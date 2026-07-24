const SPACINGS = [
  { token: '--sp-space-0', value: '0' },
  { token: '--sp-space-px', value: '1px' },
  { token: '--sp-space-0_5', value: '2px' },
  { token: '--sp-space-1', value: '4px' },
  { token: '--sp-space-2', value: '8px' },
  { token: '--sp-space-3', value: '12px' },
  { token: '--sp-space-4', value: '16px' },
  { token: '--sp-space-5', value: '20px' },
  { token: '--sp-space-6', value: '24px' },
  { token: '--sp-space-8', value: '32px' },
  { token: '--sp-space-10', value: '40px' },
  { token: '--sp-space-12', value: '48px' },
  { token: '--sp-space-16', value: '64px' },
  { token: '--sp-space-20', value: '80px' },
  { token: '--sp-space-24', value: '96px' },
]

const RADII = [
  { token: '--sp-radius-none', value: '0' },
  { token: '--sp-radius-sm', value: '4px' },
  { token: '--sp-radius-md', value: '6px' },
  { token: '--sp-radius-lg', value: '8px' },
  { token: '--sp-radius-xl', value: '12px' },
  { token: '--sp-radius-2xl', value: '16px' },
  { token: '--sp-radius-full', value: '9999px' },
]

export function SpacingPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Spacing</h1>
        <p className="page-lead">
          A 4px-base spacing scale exposed as CSS custom properties. Use these
          for consistent padding, margins, and gaps across components.
        </p>
      </div>

      <section className="doc-section">
        <h2>Scale</h2>
        <div role="list" aria-label="Spacing scale">
          {SPACINGS.map(s => (
            <div key={s.token} className="spacing-row" role="listitem">
              <span className="spacing-token">{s.token}</span>
              <div className="spacing-bar-wrap">
                <div
                  className="spacing-bar"
                  style={{ width: `var(${s.token})` }}
                  aria-hidden="true"
                />
                <span className="spacing-px">{s.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2>Border Radius</h2>
        <div className="radius-grid">
          {RADII.map(r => (
            <div key={r.token} className="radius-item">
              <div
                className="radius-item__box"
                style={{ borderRadius: `var(${r.token})` }}
                aria-hidden="true"
              />
              <code>{r.token}</code>
              <span className="radius-item__value">{r.value}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
