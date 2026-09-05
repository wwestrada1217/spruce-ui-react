import { useState } from 'react'
import { FoundationPageShell } from '../../components/FoundationPageShell'
import { CodePreview } from '../../components/CodePreview'

const SURFACE_STEPS = [0, 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

const SURFACE_GUIDANCE = [
  ['0–50', 'Primary app backgrounds, cards, panels, and high-emphasis raised surfaces.'],
  ['100–300', 'Muted containers, dividers, hover states, subtle fills, and inactive UI chrome.'],
  ['400–600', 'Low-emphasis icons, subdued accents, and transitional neutral elements.'],
  ['700–950', 'Deep canvases, inverse surfaces, overlays, and dark presentation layers.'],
]

const SURFACE_ALIASES = [
  ['--sp-surface', '--sp-bg / --sp-background', 'var(--sp-surface-0)', 'Default page and canvas background across application layouts.'],
  ['--sp-surface-raised', '', 'Light: --sp-surface-50 / Dark: --sp-surface-100', 'Raised cards, dropdown panels, dialogs, and elevated surfaces.'],
  ['--sp-surface-sunken', '', 'Light: --sp-surface-100 / Dark: --sp-surface-25', 'Inset wells, code editors, search input cavities, and recessed containers.'],
  ['--sp-surface-hover', '', 'var(--sp-content-hover-bg)', 'Hover fill for interactive lists, table rows, and navigation items.'],
]

const PRIMARY_SWATCHES = [
  { label: 'Primary', token: '--sp-primary' },
  { label: 'Hover', token: '--sp-primary-hover' },
  { label: 'Active', token: '--sp-primary-active' },
  { label: 'Subtle', token: '--sp-primary-subtle' },
  { label: 'On Primary', token: '--sp-primary-text' },
  { label: 'Secondary', token: '--sp-secondary' },
  { label: 'Tertiary', token: '--sp-tertiary' },
]

const SEMANTIC_SWATCHES = [
  { label: 'Success', token: '--sp-success' },
  { label: 'Success Subtle', token: '--sp-success-subtle' },
  { label: 'Warning', token: '--sp-warning' },
  { label: 'Warning Subtle', token: '--sp-warning-subtle' },
  { label: 'Danger', token: '--sp-danger' },
  { label: 'Danger Subtle', token: '--sp-danger-subtle' },
  { label: 'Info', token: '--sp-info' },
  { label: 'Info Subtle', token: '--sp-info-subtle' },
  { label: 'Success Tint', token: '--sp-success-tint' },
  { label: 'Warning Tint', token: '--sp-warning-tint' },
  { label: 'Danger Tint', token: '--sp-danger-tint' },
  { label: 'Info Tint', token: '--sp-info-tint' },
]

const TEXT_SWATCHES = [
  { label: 'Default', token: '--sp-text-color' },
  { label: 'Muted', token: '--sp-text-muted' },
  { label: 'Subtle', token: '--sp-text-subtle' },
  { label: 'Disabled', token: '--sp-text-disabled' },
  { label: 'Inverse', token: '--sp-text-inverse' },
]

const UTILITY_TOKENS = [
  { token: '--sp-border', desc: 'Default hairline border / divider color' },
  { token: '--sp-border-strong', desc: 'Emphasized borders and separators' },
  { token: '--sp-border-focus', desc: 'Border color for focused controls' },
  { token: '--sp-content-hover-bg', desc: 'Hover background for interactive rows/items' },
  { token: '--sp-content-active-bg', desc: 'Pressed/selected background for interactive items' },
  { token: '--sp-overlay-bg', desc: 'Scrim behind modals, drawers, and lightboxes' },
  { token: '--sp-scrollbar-track', desc: 'Custom scrollbar track' },
  { token: '--sp-scrollbar-thumb', desc: 'Custom scrollbar thumb' },
  { token: '--sp-scrollbar-hover', desc: 'Scrollbar thumb on hover' },
]

const FROSTED_TOKENS = [
  { token: '--sp-frosted-bg', desc: 'Translucent panel background' },
  { token: '--sp-frosted-border', desc: 'Glass panel border' },
  { token: '--sp-frosted-blur', desc: 'Backdrop blur + saturation for glass panels' },
  { token: '--sp-frosted-blur-strong', desc: 'Heavier blur for modals and command bars' },
  { token: '--sp-frosted-shadow', desc: 'Elevation shadow tuned for glass surfaces' },
]

const COMPANION_ROLES = [
  ['--sp-secondary', 'Companion accent', 'Second non-semantic accent for CTAs, badges, and tag categories.'],
  ['--sp-secondary-subtle', 'Companion tint', 'Tinted background carrying the secondary hue for badges and highlight rows.'],
  ['--sp-secondary-text', 'Label on fill', 'Label color that reads on the secondary fill.'],
  ['--sp-tertiary', 'Third accent', 'Third non-semantic accent for a distinct category or series.'],
  ['--sp-tertiary-subtle', 'Companion tint', 'Tinted background carrying the tertiary hue.'],
  ['--sp-tertiary-text', 'Label on fill', 'Label color that reads on the tertiary fill.'],
]

const CHART_TOKENS = [
  ['--sp-chart-series-1 … --sp-chart-series-8', 'Categorical series ramp for chart data.'],
  ['--sp-chart-axis-line', 'Axis line and chart frame.'],
  ['--sp-chart-grid-line', 'Low-emphasis grid lines.'],
  ['--sp-chart-tooltip-bg', 'Tooltip container background.'],
  ['--sp-chart-tooltip-text', 'Text placed inside chart tooltips.'],
  ['--sp-chart-track-bg', 'Track behind progress and gauge values.'],
]

const USAGE_CODE = `.panel {
  background: var(--sp-surface-0);
  color: var(--sp-text-color);
  border: var(--sp-border-width-hairline) solid var(--sp-border);
}

.panel__action:hover {
  background: var(--sp-primary-subtle);
  color: var(--sp-primary);
}`

const BEST_PRACTICES = [
  ['Prefer role tokens over palette values', 'Map components to semantic roles like surface, text, border, or primary so themes can redefine the look without changing component code.'],
  ['Keep primary selective', 'If too many surfaces use primary, nothing stands out. Reserve it for actions, selection, and the most important active state.'],
  ['Use semantic colors for meaning only', 'Avoid using success or danger as generic decoration. Their visual language should stay tied to outcome and state.'],
]

export function ColorsPage() {
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light')

  return (
    <FoundationPageShell variant="colors" title="Colors" description="Color tokens define surfaces, text contrast, borders, brand accents, and semantic feedback. Spruce exposes them as CSS custom properties so the same component APIs adapt cleanly across light and dark contexts.">
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Colors</h1>
        <p className="page-lead">
          Color tokens define surfaces, text contrast, borders, brand accents, and semantic
          feedback. Spruce exposes them as CSS custom properties so the same component APIs adapt
          cleanly across light and dark contexts.
        </p>
      </div>

      <div className="theme-switch-banner">
        <div className="theme-switch-banner__info"><strong>Theme Preview Scope</strong><span>Test how surface, text, and semantic tokens respond to light and dark themes in real time.</span></div>
        <div className="theme-switch-pills" role="group" aria-label="Color preview theme">
          <button type="button" className={`theme-pill${previewTheme === 'light' ? ' active' : ''}`} aria-pressed={previewTheme === 'light'} onClick={() => setPreviewTheme('light')}>Light Theme</button>
          <button type="button" className={`theme-pill${previewTheme === 'dark' ? ' active' : ''}`} aria-pressed={previewTheme === 'dark'} onClick={() => setPreviewTheme('dark')}>Dark Theme</button>
        </div>
      </div>

      <section id="overview" className="doc-section">
        <h2>Overview</h2>
        <p className="section-desc">
          Color should communicate hierarchy and state before decoration. Use neutral surfaces as
          the structural baseline, apply primary only where focus or action matters, and reserve
          semantic colors for status and feedback.
        </p>
        <div className="principles-grid">
          <article className="principle-card"><h3>Structure first</h3><p>Use neutral surfaces and text roles to establish hierarchy before adding accent color.</p></article>
          <article className="principle-card"><h3>Meaningful accents</h3><p>Apply primary colors where focus or action matters, and semantic colors for status and feedback.</p></article>
          <article className="principle-card"><h3>Theme resilient</h3><p>Consume token names rather than fixed visual values so relationships survive theme changes.</p></article>
        </div>
        <div className="principle-card"><h3>Theme Behavior</h3><p>Surface tokens such as <code>--sp-surface-0</code> through <code>--sp-surface-950</code> are semantic layers rather than fixed visual outcomes. Their relationship is preserved when the active theme changes.</p></div>
      </section>

      <section id="surface-scale" className="doc-section">
        <h2>Surface Scale</h2>
        <p className="section-desc">
          Slate-tinted grays for backgrounds, panels, and containers. In dark
          mode the scale inverts, so <code>--sp-surface-0</code> is always
          &ldquo;the page&rdquo; and <code>--sp-surface-950</code> is always the
          strongest contrast.
        </p>
        <div className="foundation-color-scope" data-theme={previewTheme}><div className="swatch-grid">
          {SURFACE_STEPS.map(step => (
            <div key={step} className="swatch-item">
              <div
                className="swatch-item__color"
                style={{ background: `var(--sp-surface-${step})` }}
              />
              <span className="swatch-item__label">{step}</span>
              <code className="swatch-item__token">--sp-surface-{step}</code>
            </div>
          ))}
        </div></div>
        <table className="token-table" aria-label="Surface scale guidance">
          <thead><tr><th>Range</th><th>Use For</th></tr></thead>
          <tbody>{SURFACE_GUIDANCE.map(([range, usage]) => <tr key={range}><td><strong>{range}</strong></td><td>{usage}</td></tr>)}</tbody>
        </table>
        <table className="token-table" aria-label="Surface aliases" style={{ marginTop: 'var(--sp-space-4)' }}>
          <thead><tr><th>Token</th><th>Alias</th><th>Maps to</th><th>Use For</th></tr></thead>
          <tbody>{SURFACE_ALIASES.map(([token, alias, mapping, usage]) => <tr key={token}><td><code>{token}</code></td><td>{alias ? <code>{alias}</code> : '—'}</td><td><code>{mapping}</code></td><td>{usage}</td></tr>)}</tbody>
        </table>
      </section>

      <section id="roles" className="doc-section">
        <h2>Brand And Semantic Roles</h2>
        <p className="section-desc">
          Primary colors guide attention and confirm the active path through the interface. Semantic
          colors communicate meaning such as success, warning, danger, and informational status.
        </p>
        <h3>Primary Roles</h3>
        <div className="foundation-color-scope" data-theme={previewTheme}><div className="swatch-grid">
          {PRIMARY_SWATCHES.map(item => (
            <div key={item.label} className="swatch-item">
              <div
                className="swatch-item__color"
                style={{ background: `var(${item.token})` }}
              />
              <span className="swatch-item__label">{item.label}</span>
              <code className="swatch-item__token">{item.token}</code>
            </div>
          ))}
        </div></div>
      </section>

      <section className="doc-section">
        <h3>Semantic Roles</h3>
        <p className="section-desc">
          Status colors for alerts, badges, and validation. Each has a
          translucent <code>-subtle</code> companion for tinted backgrounds
          that keep text legible in both themes.
        </p>
        <div className="foundation-color-scope" data-theme={previewTheme}><div className="swatch-grid">
          {SEMANTIC_SWATCHES.map(item => (
            <div key={item.label} className="swatch-item">
              <div
                className="swatch-item__color"
                style={{ background: `var(${item.token})` }}
              />
              <span className="swatch-item__label">{item.label}</span>
              <code className="swatch-item__token">{item.token}</code>
            </div>
          ))}
        </div></div>
      </section>

      <section className="doc-section">
        <h3>Status tints and on-tint roles</h3>
        <p className="section-desc">
          The <code>-tint</code>, <code>-tint-border</code>, and{' '}
          <code>-on-tint</code> roles use a shared perceptual tone scale. Use
          them for status surfaces when a stable lightness matters more than an
          alpha blend over the page background.
        </p>
        <table className="token-table" aria-label="Status tone tokens">
          <thead><tr><th>Family</th><th>Tint</th><th>Border</th><th>On tint</th></tr></thead>
          <tbody>
            {['primary', 'success', 'warning', 'danger', 'info'].map(name => (
              <tr key={name}>
                <td>{name}</td>
                <td><code>--sp-{name}-tint</code></td>
                <td><code>--sp-{name}-tint-border</code></td>
                <td><code>--sp-{name}-on-tint</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="doc-section">
        <h3>Companion accent roles</h3>
        <p className="section-desc">Use secondary and tertiary for additional categories without borrowing meaning from success, warning, danger, or info. They alias primary until a theme or color harmony gives them derived hues.</p>
        <table className="token-table" aria-label="Companion accent roles">
          <thead><tr><th>Token</th><th>Type</th><th>Use For</th></tr></thead>
          <tbody>{COMPANION_ROLES.map(([token, type, usage]) => <tr key={token}><td><code>{token}</code></td><td>{type}</td><td>{usage}</td></tr>)}</tbody>
        </table>
      </section>

      <section id="text-borders" className="doc-section">
        <h2>Text And Borders</h2>
        <p className="section-desc">
          Text and border tokens establish readable hierarchy. Use the strongest text token only
          for primary content, and step down gradually for secondary, helper, and disabled states.
        </p>
        <h3>Text roles</h3>
        <div className="foundation-color-scope" data-theme={previewTheme}><div className="swatch-grid">
          {TEXT_SWATCHES.map(item => (
            <div key={item.label} className="swatch-item">
              <div
                className="swatch-item__color"
                style={{ background: `var(${item.token})` }}
              />
              <span className="swatch-item__label">{item.label}</span>
              <code className="swatch-item__token">{item.token}</code>
            </div>
          ))}
        </div></div>
      </section>

      <section className="doc-section">
        <h3>Borders, Interaction &amp; Overlay</h3>
        <p className="section-desc">
          Functional colors consumed by nearly every component. Pair the border
          colors with the width tokens (<code>--sp-border-width-hairline</code>,{' '}
          <code>--sp-border-width-medium</code>):{' '}
          <code>border: var(--sp-border-width-hairline) solid var(--sp-border)</code>.
        </p>
        <table className="token-table">
          <thead>
            <tr><th>Token</th><th>Preview</th><th>Usage</th></tr>
          </thead>
          <tbody>
            {UTILITY_TOKENS.map(item => (
              <tr key={item.token}>
                <td><code>{item.token}</code></td>
                <td>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 48,
                      height: 20,
                      borderRadius: 'var(--sp-radius-sm)',
                      background: `var(${item.token})`,
                      border: '1px solid var(--sp-border)',
                      verticalAlign: 'middle',
                    }}
                  />
                </td>
                <td>{item.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="specialized-tokens" className="doc-section">
        <h2>Specialized Tokens</h2>
        <p className="section-desc">Spruce includes dedicated tokens for modern frosted glass surfaces, accessible focus glow indicators, and data visualization color palettes.</p>
        <h3>Frosted Glass</h3>
        <p className="section-desc">
          Tokens for translucent &ldquo;glass&rdquo; panels, plus the{' '}
          <code>.sp-frosted</code> / <code>.sp-frosted--strong</code> utility
          classes that apply them (with an opaque fallback when{' '}
          <code>backdrop-filter</code> is unsupported).
        </p>
        <table className="token-table">
          <thead>
            <tr><th>Token</th><th>Usage</th></tr>
          </thead>
          <tbody>
            {FROSTED_TOKENS.map(item => (
              <tr key={item.token}>
                <td><code>{item.token}</code></td>
                <td>{item.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            position: 'relative',
            marginTop: 'var(--sp-space-4)',
            borderRadius: 'var(--sp-radius-lg)',
            overflow: 'hidden',
            padding: 'var(--sp-space-6)',
            background:
              'linear-gradient(120deg, var(--sp-primary) 0%, var(--sp-info) 45%, var(--sp-success) 100%)',
          }}
        >
          <div className="sp-frosted" style={{ padding: 'var(--sp-space-4)' }}>
            <strong>Frosted panel</strong>
            <p style={{ margin: 'var(--sp-space-1) 0 0', fontSize: 'var(--sp-text-sm)' }}>
              <code>.sp-frosted</code> lenses the colorful content behind it.
            </p>
          </div>
        </div>
      </section>

      <section className="doc-section">
        <h3>Focus &amp; Precision Glow</h3>
        <p className="section-desc">
          Spruce&rsquo;s brand fingerprint for keyboard focus: a crisp outline
          (<code>--sp-focus-ring-color</code>, <code>--sp-focus-ring-width</code>,{' '}
          <code>--sp-focus-ring-offset</code>) plus an animated glow that blooms
          outward (<code>--sp-focus-glow-color</code>,{' '}
          <code>--sp-focus-glow-spread</code>). Apply it to custom controls with
          the <code>.sp-focus-ring</code> utility class — tab to the button
          below to see it.
        </p>
        <button
          type="button"
          className="sp-focus-ring"
          style={{
            padding: 'var(--sp-space-2) var(--sp-space-4)',
            borderRadius: 'var(--sp-radius-md)',
            border: 'var(--sp-border-width-hairline) solid var(--sp-border-strong)',
            background: 'var(--sp-surface-50)',
            color: 'var(--sp-text-color)',
            cursor: 'pointer',
          }}
        >
          Tab to me
        </button>
      </section>

      <section className="doc-section">
        <h3>Data Visualization Palette</h3>
        <p className="section-desc">Chart tokens keep axes, gridlines, tooltips, tracks, and categorical series consistent across themes and color-harmony presets.</p>
        <table className="token-table" aria-label="Data visualization color tokens">
          <thead><tr><th>Token</th><th>Use For</th></tr></thead>
          <tbody>{CHART_TOKENS.map(([token, usage]) => <tr key={token}><td><code>{token}</code></td><td>{usage}</td></tr>)}</tbody>
        </table>
      </section>

      <section id="usage" className="doc-section">
        <h2>Usage</h2>
        <p className="section-desc">Build surfaces from semantic tokens rather than fixed hex values. That keeps the component contract stable across theme switches and avoids manual dark-mode overrides inside each component.</p>
        <div className="usage-grid">
          <article className="code-card"><h3>Token Consumption</h3><CodePreview codeOnly language="css" code={USAGE_CODE} /></article>
          <article className="guidance-card"><h3>Best Practices</h3><div className="best-practices">{BEST_PRACTICES.map(([title, body]) => <div key={title} className="best-practice-item"><strong>{title}</strong><p>{body}</p></div>)}</div></article>
        </div>
      </section>
    </FoundationPageShell>
  )
}
