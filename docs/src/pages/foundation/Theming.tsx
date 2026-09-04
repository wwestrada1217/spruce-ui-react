import { useState } from 'react'
import { SPRUCE_THEME_PRESETS } from 'spruce-react'
import { FoundationPageShell } from '../../components/FoundationPageShell'

interface PresetDef {
  name: string
  displayName: string
  base: 'light' | 'dark'
  color: string
  importName: string
}

const ALL_PRESETS: PresetDef[] = SPRUCE_THEME_PRESETS.map(theme => ({
  name: theme.name,
  displayName: theme.displayName,
  base: theme.base,
  color: theme.tokens['--sp-primary'] ?? (theme.base === 'dark' ? '#94a3b8' : '#166534'),
  importName: `${theme.name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())}Theme`,
}))

const LIGHT_PRESETS = ALL_PRESETS.filter(preset => preset.base === 'light')
const DARK_PRESETS = ALL_PRESETS.filter(preset => preset.base === 'dark')

function PresetCard({ preset, active, onClick }: { preset: PresetDef; active: boolean; onClick: () => void }) {
  const isDark = preset.base === 'dark'

  return (
    <button
      className={`preset-card${active ? ' preset-card--active' : ''}`}
      type="button"
      onClick={onClick}
    >
      <span
        className="preset-swatch"
        style={{
          background: isDark ? `color-mix(in srgb, ${preset.color} 25%, #1a1a2e)` : preset.color,
          borderColor: isDark ? `color-mix(in srgb, ${preset.color} 40%, transparent)` : undefined,
        }}
      />
      <span className="preset-name">{preset.displayName}</span>
    </button>
  )
}

export function ThemingPage() {
  const [activePreset, setActivePreset] = useState('ocean')

  return (
    <FoundationPageShell variant="theming" title="Theming" description="The Spruce design system supports fully customizable themes via CSS custom properties. Use this generator to tune the design tokens and export the result as a TypeScript preset or plain CSS override block.">
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Theming</h1>
        <p className="page-lead">
          The Spruce design system supports fully customizable themes via CSS custom properties.
          Use this generator to tune the design tokens and export the result as a TypeScript preset
          or plain CSS override block.
        </p>
      </div>

      <section id="built-in" className="doc-section">
        <h2>Built-in themes</h2>
        <p className="section-desc">
          Spruce ships with two base themes — <strong>light</strong> and{' '}
          <strong>dark</strong> — plus a <strong>system</strong> mode that
          follows the operating system preference. Switch between them using
          the <code>useTheme()</code> hook.
        </p>

        <h3>Setup</h3>
        <p className="section-desc">
          Wrap your application with <code>SpruceProvider</code> to enable
          theming. No additional configuration is required.
        </p>
        <div className="code-block">
          <pre><code>{`import { SpruceProvider } from 'spruce-react'

function App() {
  return (
    <SpruceProvider>
      <YourApp />
    </SpruceProvider>
  )
}`}</code></pre>
        </div>

        <h3>Switching themes</h3>
        <p className="section-desc">
          Call <code>setTheme()</code> with <code>'light'</code>,{' '}
          <code>'dark'</code>, or <code>'system'</code> to switch the active
          base theme. You can also use <code>toggle()</code> to flip between
          light and dark.
        </p>
        <div className="code-block">
          <pre><code>{`import { useTheme } from 'spruce-react'

function ThemeSwitcher() {
  const { setTheme, toggle } = useTheme()

  return (
    <>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
      <button onClick={toggle}>Toggle</button>
    </>
  )
}`}</code></pre>
        </div>

        <h3>Reading theme state</h3>
        <p className="section-desc">
          The hook exposes reactive values you can use in your components.
        </p>
        <table className="token-table" aria-label="useTheme hook API">
          <thead>
            <tr>
              <th>Property / Method</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>preference</td>
              <td>'light' | 'dark' | 'system' | string</td>
              <td>The user-chosen theme preference</td>
            </tr>
            <tr>
              <td>resolved</td>
              <td>'light' | 'dark'</td>
              <td>The currently applied base theme after resolving 'system'</td>
            </tr>
            <tr>
              <td>activeTheme</td>
              <td>SpruceTheme | null</td>
              <td>The active custom theme object, or null for built-in themes</td>
            </tr>
            <tr>
              <td>setTheme(name)</td>
              <td>function</td>
              <td>Change the active theme</td>
            </tr>
            <tr>
              <td>toggle()</td>
              <td>function</td>
              <td>Toggle between light and dark</td>
            </tr>
            <tr>
              <td>registerTheme(theme)</td>
              <td>function</td>
              <td>Register a custom theme preset at runtime</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="custom" className="doc-section">
        <h2>Custom themes</h2>
        <p className="section-desc">
          Create a custom theme by defining a <code>SpruceTheme</code> object.
          A custom theme builds on top of a base (<code>'light'</code> or{' '}
          <code>'dark'</code>) and only overrides the tokens you specify —
          everything else falls back to the base defaults.
        </p>

        <h3>Defining a theme</h3>
        <p className="section-desc">
          A theme object requires a unique <code>name</code>, a human-readable{' '}
          <code>displayName</code>, a <code>base</code> mode, and a partial map
          of token overrides. Built-in token names are checked by TypeScript;
          application-owned <code>--sp-*</code> properties belong in the
          separate <code>customTokens</code> map.
        </p>
        <div className="code-block">
          <pre><code>{`import type { SpruceTheme } from 'spruce-react'

const myTheme: SpruceTheme = {
  name: 'my-brand',
  displayName: 'My Brand',
  base: 'light',
  tokens: {
    '--sp-primary': '#7c3aed',
    '--sp-primary-hover': '#6d28d9',
    '--sp-primary-active': '#5b21b6',
    '--sp-primary-text': '#ffffff',
  },
  customTokens: {
    '--sp-brand-mark': 'url(/brand-mark.svg)',
  },
}`}</code></pre>
        </div>

        <h3>Registering and activating</h3>
        <p className="section-desc">
          Register the theme via <code>registerTheme()</code>, then activate it
          by name with <code>setTheme()</code>. Registration injects the token
          overrides as CSS custom properties on <code>:root</code> and applies
          the theme&rsquo;s base via <code>data-theme</code> on the document
          element.
        </p>
        <div className="code-block">
          <pre><code>{`import { useTheme } from 'spruce-react'

function Settings() {
  const { registerTheme, setTheme } = useTheme()

  function activateCustom() {
    registerTheme(myTheme)
    setTheme('my-brand')
  }

  return <button onClick={activateCustom}>Apply brand theme</button>
}`}</code></pre>
        </div>

        <h3>SpruceTheme interface</h3>
        <table className="token-table" aria-label="SpruceTheme interface">
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>name</td>
              <td>string</td>
              <td>Unique identifier used to activate the theme</td>
            </tr>
            <tr>
              <td>displayName</td>
              <td>string</td>
              <td>Human-readable label for UI (e.g., theme switcher)</td>
            </tr>
            <tr>
              <td>base</td>
              <td>'light' | 'dark'</td>
              <td>The built-in base this theme extends</td>
            </tr>
            <tr>
              <td>tokens</td>
              <td>{'Partial<Record<SpruceTokenKey, string>>'}</td>
              <td>Strict built-in CSS token overrides</td>
            </tr>
            <tr>
              <td>customTokens</td>
              <td>{'Partial<Record<`--sp-${string}`, string>>'}</td>
              <td>Application-owned custom properties</td>
            </tr>
          </tbody>
        </table>

        <h3>CSS-only override</h3>
        <p className="section-desc">
          If you prefer not to use the JavaScript API, you can override tokens
          directly in CSS. This approach works well for quick branding changes
          without touching component code.
        </p>
        <div className="code-block">
          <pre><code>{`/* Override tokens for a custom brand */
:root {
  --sp-primary: #7c3aed;
  --sp-primary-hover: #6d28d9;
  --sp-primary-active: #5b21b6;
  --sp-primary-text: #ffffff;
  --sp-primary-subtle: rgba(124, 58, 237, 0.1);
}

/* Override tokens for dark mode */
[data-theme="dark"] {
  --sp-primary: #a78bfa;
  --sp-primary-hover: #8b5cf6;
}`}</code></pre>
        </div>
      </section>

      <section id="presets" className="doc-section">
        <h2>Preset themes</h2>
        <p className="section-desc">
          Spruce includes {ALL_PRESETS.length} ready-made presets. Each preset
          is a fully typed <code>SpruceTheme</code> object that you can import
          and register directly. (The default evergreen-teal look needs no
          preset — it&rsquo;s the built-in <code>light</code>/<code>dark</code>{' '}
          base.)
        </p>

        <div className="preset-section-label">Light</div>
        <div className="preset-grid">
          {LIGHT_PRESETS.map(p => (
            <PresetCard
              key={p.name}
              preset={p}
              active={activePreset === p.name}
              onClick={() => setActivePreset(p.name)}
            />
          ))}
        </div>

        <div className="preset-section-label" style={{ marginTop: 16 }}>Dark</div>
        <div className="preset-grid">
          {DARK_PRESETS.map(p => (
            <PresetCard
              key={p.name}
              preset={p}
              active={activePreset === p.name}
              onClick={() => setActivePreset(p.name)}
            />
          ))}
        </div>

        <h3>Using a preset</h3>
        <p className="section-desc">
          Presets are named exports of the main package — register the ones you
          offer, then activate by name.
        </p>
        <div className="code-block">
          <pre><code>{`import { useTheme, oceanTheme, nightTheme } from 'spruce-react'

function ThemePicker() {
  const { registerTheme, setTheme } = useTheme()

  function useOcean() {
    registerTheme(oceanTheme)
    setTheme('ocean')
  }

  function useNight() {
    registerTheme(nightTheme)
    setTheme('night')
  }

  return (
    <>
      <button onClick={useOcean}>Ocean</button>
      <button onClick={useNight}>Night</button>
    </>
  )
}`}</code></pre>
        </div>

        <h3>Available presets</h3>
        <div className="preset-list-grid">
          {ALL_PRESETS.map(p => (
            <div key={p.name} className="preset-list-item">
              <span
                className="preset-list-swatch"
                style={{
                  background: p.color,
                  border: p.base === 'dark' ? '1px solid rgba(255,255,255,0.2)' : undefined,
                }}
              />
              <div className="preset-list-info">
                <span className="preset-list-name">{p.displayName}</span>
                <span className="preset-list-base">{p.base}</span>
              </div>
              <code className="preset-list-import">{p.importName}</code>
            </div>
          ))}
        </div>
      </section>

      <section id="frosted-surface" className="doc-section">
        <h2>Frosted surface</h2>
        <p className="section-desc">Frosted surfaces use semantic background, border, blur, and shadow tokens so glass panels adapt with the active theme.</p>
        <div className="code-block"><pre><code>{`<div className="sp-frosted">
  Floating panel content
</div>`}</code></pre></div>
      </section>

      <section id="theme-switcher" className="doc-section">
        <h2>Theme switcher component</h2>
        <p className="section-desc">Use the theme hook to build a compact switcher, or pair it with the application's settings surface. Keep theme preference separate from the resolved light or dark mode.</p>
        <div className="code-block"><pre><code>{`const { preference, resolved, setTheme, toggle } = useTheme()

<button type="button" onClick={toggle}>
  {preference} ({resolved})
</button>`}</code></pre></div>
      </section>

      <section id="palette-generator" className="doc-section">
        <h2>Palette Generator</h2>
        <p className="section-desc">
          The provider owns an independent accent layer. Choose a shipped accent,
          supply a custom hex value, or derive secondary, tertiary, and chart
          colors from a harmony scheme. These choices persist with the theme
          preference and update without remounting components.
        </p>
        <div className="code-block">
          <pre><code>{`import { useTheme } from 'spruce-react'

function BrandControls() {
  const {
    setAccent,
    setCustomAccentColor,
    setAccentHarmony,
    setAccentHarmonyCustom,
    harmonyPalette,
    accentRevision,
  } = useTheme()

  return (
    <>
      <button onClick={() => setAccent('indigo')}>Indigo</button>
      <button onClick={() => setCustomAccentColor('#7c3aed')}>Custom</button>
      <button onClick={() => setAccentHarmony('triadic')}>Triadic</button>
      <button onClick={() => setAccentHarmonyCustom({ secondary: 72, tertiary: 216 })}>
        Custom offsets
      </button>
      <output>Palette revision: {accentRevision}</output>
      <output>{harmonyPalette?.light.series.join(', ')}</output>
    </>
  )
}`}</code></pre>
        </div>
        <p className="section-desc">
          The document exposes <code>data-theme</code>,{' '}
          <code>data-theme-preset</code>, <code>data-accent</code>, and{' '}
          <code>data-accent-harmony</code>. Charts or canvas integrations that
          read computed CSS values can subscribe to <code>accentRevision</code>{' '}
          before sampling the chart-series tokens.
        </p>
        <p className="section-desc">
          See <a href="#/foundation/color-harmony">Color Harmony</a> for the
          palette generator, contrast guarantees, and custom-offset editor.
        </p>
      </section>

      <section id="editor" className="doc-section">
        <h2>Token editor</h2>
        <p className="section-desc">
          The most commonly overridden tokens when building custom themes.
          Changes apply live via CSS custom properties on <code>:root</code>.
        </p>

        <h3>Brand Colors</h3>
        <table className="token-table" aria-label="Brand color tokens">
          <thead>
            <tr><th>Token</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td>--sp-primary</td><td>#166534</td><td>Primary brand color</td></tr>
            <tr><td>--sp-primary-hover</td><td>#14532d</td><td>Hover state</td></tr>
            <tr><td>--sp-primary-active</td><td>#052e16</td><td>Active/pressed state</td></tr>
            <tr><td>--sp-primary-text</td><td>#fafafa</td><td>Text on primary surfaces</td></tr>
          </tbody>
        </table>

        <h3>Status Colors</h3>
        <table className="token-table" aria-label="Status color tokens">
          <thead>
            <tr><th>Token</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td>--sp-success</td><td>#16a34a</td><td>Success states</td></tr>
            <tr><td>--sp-warning</td><td>#b45309</td><td>Warning states</td></tr>
            <tr><td>--sp-danger</td><td>#dc2626</td><td>Error/danger states</td></tr>
            <tr><td>--sp-info</td><td>#0e7490</td><td>Informational states</td></tr>
          </tbody>
        </table>

        <h3>Surfaces &amp; Text</h3>
        <table className="token-table" aria-label="Surface and text tokens">
          <thead>
            <tr><th>Token</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td>--sp-surface-0</td><td>#fafafa</td><td>Page background</td></tr>
            <tr><td>--sp-surface-50</td><td>#f4f4f5</td><td>Subtle background</td></tr>
            <tr><td>--sp-surface-100</td><td>#ececee</td><td>Muted background</td></tr>
            <tr><td>--sp-text</td><td>#18181b</td><td>Primary text</td></tr>
            <tr><td>--sp-text-muted</td><td>#3f3f46</td><td>Muted text</td></tr>
          </tbody>
        </table>

        <h3>Shape &amp; Radius</h3>
        <table className="token-table" aria-label="Shape tokens">
          <thead>
            <tr><th>Token</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td>--sp-radius-sm</td><td>2px</td><td>Small radius</td></tr>
            <tr><td>--sp-radius-md</td><td>3px</td><td>Medium radius</td></tr>
            <tr><td>--sp-radius-lg</td><td>4px</td><td>Large radius</td></tr>
            <tr><td>--sp-radius-xl</td><td>6px</td><td>Extra large radius</td></tr>
            <tr><td>--sp-radius-full</td><td>9999px</td><td>Fully rounded</td></tr>
          </tbody>
        </table>
      </section>

      <section id="export" className="doc-section">
        <h2>Export</h2>
        <p className="section-desc">Export the active token overrides as CSS custom properties or a typed theme object when moving a palette from the editor into an application package.</p>
        <div className="code-block"><pre><code>{`export const brandTheme = {
  name: 'brand',
  displayName: 'Brand',
  base: 'light',
  tokens: {
    '--sp-primary': '#166534',
  },
}`}</code></pre></div>
      </section>
    </FoundationPageShell>
  )
}
