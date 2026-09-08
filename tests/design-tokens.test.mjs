import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('design-tool token exports include modes, presets, and deterministic metadata', async () => {
  const dtcg = JSON.parse(await readFile(new URL('../design-tokens/figma/tokens.dtcg.json', import.meta.url), 'utf8'));
  const studio = JSON.parse(await readFile(new URL('../design-tokens/figma/tokens.tokens-studio.json', import.meta.url), 'utf8'));
  const penpot = JSON.parse(await readFile(new URL('../design-tokens/penpot/tokens.penpot.json', import.meta.url), 'utf8'));
  assert.match(dtcg.$description, /Generated from/);
  assert.ok(dtcg.$extensions['org.sprucestack.preset-order'].length >= 2);
  assert.equal(dtcg.primary.$extensions['org.sprucestack.css-name'], '--sp-primary');
  assert.ok(dtcg.primary.$extensions['org.sprucestack.modes'].dark);
  assert.ok(studio.$themes.some(theme => theme.id === 'spruce-light'));
  assert.ok(Object.keys(studio).some(key => key.startsWith('preset/')));
  assert.ok(penpot.themes.some(theme => theme.mode === 'dark'));
});
