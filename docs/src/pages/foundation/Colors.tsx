const SURFACE_STEPS = [0, 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

const PRIMARY_SWATCHES = [
  { label: 'Primary', token: '--sp-primary' },
  { label: 'Hover', token: '--sp-primary-hover' },
  { label: 'Active', token: '--sp-primary-active' },
  { label: 'Subtle', token: '--sp-primary-subtle' },
]

const SEMANTIC_SWATCHES = [
  { label: 'Success', token: '--sp-success' },
  { label: 'Warning', token: '--sp-warning' },
  { label: 'Danger', token: '--sp-danger' },
  { label: 'Info', token: '--sp-info' },
]

const TEXT_SWATCHES = [
  { label: 'Default', token: '--sp-text-color' },
  { label: 'Muted', token: '--sp-text-muted' },
  { label: 'Subtle', token: '--sp-text-subtle' },
  { label: 'Disabled', token: '--sp-text-disabled' },
]

export function ColorsPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Colors</h1>
        <p className="page-lead">
          Spruce uses a neutral surface scale from 0 (lightest) to 950 (darkest)
          that automatically inverts in dark mode. All colors are defined as CSS
          custom properties with the <code>--sp-</code> prefix.
        </p>
      </div>

      <section className="doc-section">
        <h2>Surface Scale</h2>
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
    </>
  )
}
