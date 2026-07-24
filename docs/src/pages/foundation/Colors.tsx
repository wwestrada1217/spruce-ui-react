const SURFACE_STEPS = [0, 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

const PRIMARY_SWATCHES = [
  { label: 'Primary', token: '--sp-primary' },
  { label: 'Hover', token: '--sp-primary-hover' },
  { label: 'Active', token: '--sp-primary-active' },
  { label: 'Subtle', token: '--sp-primary-subtle' },
  { label: 'On Primary', token: '--sp-primary-text' },
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
          Spruce uses cool, slate-tinted neutrals with an evergreen-teal brand
          accent. The surface scale runs from 0 (lightest) to 950 (darkest) and
          automatically inverts in dark mode. All colors are defined as CSS
          custom properties with the <code>--sp-</code> prefix — style with
          tokens, never hard-coded values, and both themes come for free.
        </p>
      </div>

      <section className="doc-section">
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

      <section className="doc-section">
        <h2>Primary</h2>
        <p className="section-desc">
          The evergreen-teal brand accent. <code>Subtle</code> is a translucent
          tint for selected/hover fills; <code>On Primary</code> is the text
          color used on solid primary surfaces.
        </p>
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
        <h2>Semantic</h2>
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
        <h2>Text</h2>
        <p className="section-desc">
          A four-step text hierarchy plus an inverse color for text on
          contrasting surfaces (tooltips, solid buttons).
        </p>
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
        <h2>Borders, Interaction &amp; Overlay</h2>
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

      <section className="doc-section">
        <h2>Frosted Glass</h2>
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
        <h2>Focus Ring &mdash; &ldquo;Precision Glow&rdquo;</h2>
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
    </>
  )
}
