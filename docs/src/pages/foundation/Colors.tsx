const SURFACE_STEPS = [0, 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

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

export function ColorsPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Colors</h1>
        <p className="page-lead">
          Color tokens define surfaces, text contrast, borders, brand accents, and semantic
          feedback. Spruce exposes them as CSS custom properties so the same component APIs adapt
          cleanly across light and dark contexts.
        </p>
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
        <div className="swatch-grid">
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
        </div>
      </section>

      <section id="roles" className="doc-section">
        <h2>Brand And Semantic Roles</h2>
        <p className="section-desc">
          Primary colors guide attention and confirm the active path through the interface. Semantic
          colors communicate meaning such as success, warning, danger, and informational status.
        </p>
        <h3>Primary Roles</h3>
        <div className="swatch-grid">
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
        </div>
      </section>

      <section className="doc-section">
        <h3>Semantic Roles</h3>
        <p className="section-desc">
          Status colors for alerts, badges, and validation. Each has a
          translucent <code>-subtle</code> companion for tinted backgrounds
          that keep text legible in both themes.
        </p>
        <div className="swatch-grid">
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
        </div>
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

      <section id="text-borders" className="doc-section">
        <h2>Text And Borders</h2>
        <p className="section-desc">
          Text and border tokens establish readable hierarchy. Use the strongest text token only
          for primary content, and step down gradually for secondary, helper, and disabled states.
        </p>
        <h3>Text roles</h3>
        <div className="swatch-grid">
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
        </div>
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
            border: '1px solid var(--sp-border-strong)',
            background: 'var(--sp-surface-50)',
            color: 'var(--sp-text-color)',
            cursor: 'pointer',
          }}
        >
          Tab to me
        </button>
      </section>

      <section id="usage" className="doc-section">
        <h2>Usage</h2>
        <p className="section-desc">Build surfaces from semantic tokens rather than fixed hex values. That keeps the component contract stable across theme switches and avoids manual dark-mode overrides inside each component.</p>
        <div className="code-block"><pre><code>{`.panel {
  background: var(--sp-surface-0);
  color: var(--sp-text-color);
  border: var(--sp-border-width-hairline) solid var(--sp-border);
}`}</code></pre></div>
      </section>
    </>
  )
}
