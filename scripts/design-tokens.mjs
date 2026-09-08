import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = join(root, 'design-tokens');
const check = process.argv.includes('--check');

function blockFor(source, selector, startAt = 0) {
  const selectorIndex = source.indexOf(selector, startAt);
  if (selectorIndex < 0) throw new Error(`Missing CSS selector: ${selector}`);
  const open = source.indexOf('{', selectorIndex);
  let depth = 1;
  for (let index = open + 1; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) return source.slice(open + 1, index);
  }
  throw new Error(`Unclosed CSS selector: ${selector}`);
}

function declarations(block) {
  return Object.fromEntries(Array.from(block.matchAll(/(--sp-[\w-]+)\s*:\s*([^;]+);/g), match => [match[1], match[2].trim()]));
}

function tokenPath(cssName) {
  return cssName.replace(/^--sp-/, '').split('-').join('.');
}

function tokenType(name, value) {
  if (/color|surface|background|\bbg\b|border(?!-width)|text|primary|secondary|tertiary|success|warning|danger|info|scrollbar|overlay/.test(name) && /#|rgb|hsl|oklch|var\(/.test(value)) return 'color';
  if (/shadow/.test(name)) return 'shadow';
  if (/duration/.test(name)) return 'duration';
  if (/ease/.test(name)) return 'cubicBezier';
  if (/font-(weight|light|normal|medium|semibold|bold|extrabold)/.test(name)) return 'fontWeight';
  if (/space|radius|width|height|size|offset|spread|distance|leading|font-size/.test(name) && /-?\d/.test(value)) return 'dimension';
  if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(value)) return 'number';
  return 'string';
}

function aliasValue(value) {
  const exact = value.match(/^var\((--sp-[\w-]+)\)$/);
  return exact ? `{${tokenPath(exact[1])}}` : value;
}

function setNested(target, path, value) {
  const parts = path.split('.');
  let cursor = target;
  for (const part of parts.slice(0, -1)) cursor = cursor[part] ??= {};
  cursor[parts.at(-1)] = value;
}

function parsePresets() {
  const allSource = readFileSync(join(root, 'src/theme/presets/all.ts'), 'utf8');
  const files = Array.from(allSource.matchAll(/from '\.\/([^']+)\.js'/g), match => match[1]);
  return files.map(file => {
    const source = readFileSync(join(root, `src/theme/presets/${file}.ts`), 'utf8');
    const name = source.match(/name:\s*'([^']+)'/)?.[1];
    const displayName = source.match(/displayName:\s*'([^']+)'/)?.[1];
    const base = source.match(/base:\s*'(light|dark)'/)?.[1];
    if (!name || !displayName || !base) throw new Error(`Invalid preset source: ${file}.ts`);
    const tokenBlock = blockFor(source, 'tokens:');
    const tokens = Object.fromEntries(Array.from(tokenBlock.matchAll(/'(\-\-sp-[\w-]+)'\s*:\s*'([^']*)'/g), match => [match[1], match[2]]));
    return { name, displayName, base, tokens };
  });
}

function canonicalModel() {
  const css = readFileSync(join(root, 'src/tokens/tokens.css'), 'utf8');
  const light = declarations(blockFor(css, ':root {'));
  const darkSelector = css.indexOf("[data-theme='dark']");
  if (darkSelector < 0) throw new Error('Missing dark token mode.');
  const dark = declarations(blockFor(css, '{', darkSelector));
  const presets = parsePresets();
  const names = Array.from(new Set([...Object.keys(light), ...Object.keys(dark)])).sort();
  return { light, dark, presets, names };
}

function buildDtcg(model) {
  const out = {
    $schema: 'https://www.designtokens.org/tr/drafts/format/',
    $description: 'Generated from src/tokens/tokens.css and src/theme/presets. Do not edit.',
  };
  for (const name of model.names) {
    const light = model.light[name] ?? model.dark[name];
    const dark = model.dark[name] ?? light;
    const presetValues = Object.fromEntries(model.presets.filter(preset => preset.tokens[name] !== undefined).map(preset => [preset.name, preset.tokens[name]]));
    setNested(out, tokenPath(name), {
      $type: tokenType(name, light),
      $value: aliasValue(light),
      $description: `Spruce semantic token ${name}.`,
      $extensions: {
        'org.sprucestack.css-name': name,
        'org.sprucestack.modes': { light: aliasValue(light), dark: aliasValue(dark) },
        ...(Object.keys(presetValues).length ? { 'org.sprucestack.presets': presetValues } : {}),
      },
    });
  }
  out.$extensions = {
    'org.sprucestack.preset-order': model.presets.map(({ name, displayName, base }) => ({ name, displayName, base })),
  };
  return out;
}

function studioToken(name, value) {
  return { value: aliasValue(value), type: tokenType(name, value), description: `Spruce semantic token ${name}.` };
}

function tokenSet(entries) {
  const out = {};
  for (const [name, value] of Object.entries(entries).sort(([a], [b]) => a.localeCompare(b))) setNested(out, tokenPath(name), studioToken(name, value));
  return out;
}

function buildTokensStudio(model) {
  const sets = {
    $themes: [
      { id: 'spruce-light', name: 'Light', selectedTokenSets: { light: 'enabled' } },
      { id: 'spruce-dark', name: 'Dark', selectedTokenSets: { dark: 'enabled' } },
      ...model.presets.map(preset => ({ id: preset.name, name: preset.displayName, selectedTokenSets: { [preset.base]: 'source', [`preset/${preset.name}`]: 'enabled' } })),
    ],
    light: tokenSet(model.light),
    dark: tokenSet(model.dark),
  };
  for (const preset of model.presets) sets[`preset/${preset.name}`] = tokenSet(preset.tokens);
  return sets;
}

function buildPenpot(model) {
  return {
    $schema: 'https://design-tokens.github.io/community-group/format/',
    name: 'Spruce UI',
    generatedFrom: ['src/tokens/tokens.css', 'src/theme/presets/*.ts'],
    themes: [
      { name: 'Light', mode: 'light', tokens: model.light },
      { name: 'Dark', mode: 'dark', tokens: model.dark },
      ...model.presets.map(preset => ({ name: preset.displayName, mode: preset.base, preset: preset.name, tokens: preset.tokens })),
    ],
  };
}

function figmaCode(dtcg) {
  const payload = JSON.stringify(dtcg);
  return `// Generated by scripts/design-tokens.mjs.\nconst TOKENS = ${payload};\nfunction walk(node, path = [], output = []) {\n  for (const [key, value] of Object.entries(node)) {\n    if (key.startsWith('$')) continue;\n    if (value && typeof value === 'object' && '$value' in value) output.push({ path: [...path, key], ...value });\n    else if (value && typeof value === 'object') walk(value, [...path, key], output);\n  }\n  return output;\n}\nfigma.showUI(__html__, { width: 360, height: 300 });\nfigma.ui.onmessage = async message => {\n  if (message.type !== 'generate') return;\n  const collection = figma.variables.createVariableCollection('Spruce UI');\n  const modeId = collection.modes[0].modeId;\n  let count = 0;\n  for (const token of walk(TOKENS)) {\n    const raw = token.$extensions?.['org.sprucestack.modes']?.light ?? token.$value;\n    if (token.$type !== 'color' || typeof raw !== 'string' || !raw.startsWith('#')) continue;\n    const hex = raw.slice(1);\n    const rgb = { r: parseInt(hex.slice(0,2),16)/255, g: parseInt(hex.slice(2,4),16)/255, b: parseInt(hex.slice(4,6),16)/255 };\n    const variable = figma.variables.createVariable(token.path.join('/'), collection, 'COLOR');\n    variable.description = token.$description ?? '';\n    variable.setValueForMode(modeId, rgb);\n    count += 1;\n  }\n  figma.ui.postMessage({ type: 'complete', count });\n};\n`;
}

const figmaUi = `<!doctype html><html><head><meta charset="utf-8"><style>body{font:13px system-ui;padding:20px}button{width:100%;padding:10px;border:0;border-radius:6px;background:#166534;color:white;font-weight:600}p{color:#52525b}</style></head><body><h2>Spruce UI Foundations</h2><p>Generate local variables from the checked-in Spruce token contract.</p><button id="generate">Generate variables</button><p id="status" aria-live="polite"></p><script>generate.onclick=()=>parent.postMessage({pluginMessage:{type:'generate'}},'*');onmessage=e=>{if(e.data.pluginMessage?.type==='complete')status.textContent=e.data.pluginMessage.count+' variables generated';}</script></body></html>\n`;

const penpotPlugin = `// Generated by scripts/design-tokens.mjs.\npenpot.ui.open('Spruce UI Foundations', '', { width: 360, height: 240 });\npenpot.ui.onMessage(message => { if (message?.type === 'close') penpot.closePlugin(); });\n`;

function boardSvg(model) {
  const colors = Object.entries(model.light).filter(([name, value]) => /surface|primary|success|warning|danger|info/.test(name) && /^#/.test(value)).slice(0, 30);
  const height = 100 + Math.ceil(colors.length / 6) * 100;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="${height}" viewBox="0 0 960 ${height}"><rect width="100%" height="100%" fill="#fafafa"/><text x="40" y="48" font-family="system-ui" font-size="24" font-weight="700" fill="#18181b">Spruce UI Foundations</text>${colors.map(([name, value], index) => { const x = 40 + (index % 6) * 150; const y = 80 + Math.floor(index / 6) * 100; return `<g transform="translate(${x} ${y})"><rect width="128" height="52" rx="6" fill="${value}" stroke="#d4d4d8"/><text y="72" font-family="system-ui" font-size="10" fill="#3f3f46">${name.replace('--sp-', '')}</text></g>`; }).join('')}</svg>\n`;
}

const readme = `# Spruce design-tool tokens\n\nThese files are generated from the React package's canonical \`src/tokens/tokens.css\` and \`src/theme/presets/*.ts\` sources. Do not edit generated JSON, plugin files, or the foundations board directly.\n\n- \`npm run tokens:generate\` updates all design-tool artifacts.\n- \`npm run tokens:check\` validates structure and fails when checked-in output is stale.\n- \`figma/\` contains DTCG, Tokens Studio, and a local Figma plugin.\n- \`penpot/\` contains the Penpot token payload, plugin shell, and generated foundations board.\n\nToken source ownership remains with the React token/theme modules. Design-tool exports are delivery formats, not a second token source. Pull requests that change tokens or presets must regenerate these files.\n`;

function json(value) { return `${JSON.stringify(value, null, 2)}\n`; }

function expectedFiles() {
  const model = canonicalModel();
  const dtcg = buildDtcg(model);
  const studio = buildTokensStudio(model);
  const penpot = buildPenpot(model);
  return new Map([
    ['README.md', readme],
    ['figma/README.md', `# Figma delivery\n\nImport \`tokens.tokens-studio.json\` with Tokens Studio, consume \`tokens.dtcg.json\` with DTCG-compatible tooling, or load \`manifest.json\` as a development plugin to create Spruce color variables. All files are generated.\n`],
    ['figma/manifest.json', json({ name: 'Spruce UI Foundations', id: 'spruce-react-foundations', api: '1.0.0', main: 'code.js', ui: 'ui.html', editorType: ['figma'], networkAccess: { allowedDomains: ['none'] } })],
    ['figma/tokens.dtcg.json', json(dtcg)],
    ['figma/tokens.tokens-studio.json', json(studio)],
    ['figma/code.js', figmaCode(dtcg)],
    ['figma/ui.html', figmaUi],
    ['penpot/README.md', `# Penpot delivery\n\nImport \`tokens.penpot.json\` with a compatible tokens plugin. Load \`manifest.json\` to use the local plugin shell, and import \`spruce-foundations-board.svg\` for a visual foundations board. All files are generated.\n`],
    ['penpot/manifest.json', json({ name: 'Spruce UI Foundations', code: 'plugin.js', icon: 'icon', permissions: ['content:read', 'content:write'] })],
    ['penpot/plugin.js', penpotPlugin],
    ['penpot/index.html', `<!doctype html><html><body><h2>Spruce UI Foundations</h2><p>Use tokens.penpot.json to import the generated tokens.</p><button id="close">Close</button><script>close.onclick=()=>parent.postMessage({type:'close'},'*')</script></body></html>\n`],
    ['penpot/tokens.penpot.json', json(penpot)],
    ['penpot/spruce-foundations-board.svg', boardSvg(model)],
  ]);
}

let failures = 0;
for (const [relative, contents] of expectedFiles()) {
  const target = join(outputRoot, relative);
  if (check) {
    let current = '';
    try { current = readFileSync(target, 'utf8'); } catch { /* reported below */ }
    if (current !== contents) {
      console.error(`Stale design-token artifact: ${relative}`);
      failures += 1;
    }
  } else {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, contents);
  }
}

const model = canonicalModel();
if (model.names.length < 100) throw new Error(`Expected at least 100 canonical tokens, found ${model.names.length}`);
if (model.presets.length < 2) throw new Error('Expected multiple theme presets.');
const fingerprint = createHash('sha256').update(JSON.stringify({ names: model.names, presets: model.presets })).digest('hex').slice(0, 12);
if (failures) process.exitCode = 1;
else console.log(`${check ? 'Validated' : 'Generated'} ${model.names.length} tokens and ${model.presets.length} presets (${fingerprint}).`);
