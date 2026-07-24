const SHADOWS = [
  { token: '--sp-shadow-xs' },
  { token: '--sp-shadow-sm' },
  { token: '--sp-shadow-md' },
  { token: '--sp-shadow-lg' },
  { token: '--sp-shadow-xl' },
]

const Z_LEVELS = [
  { token: '--sp-z-base', value: 0, usage: 'Default stacking' },
  { token: '--sp-z-dropdown', value: 100, usage: 'Dropdown menus' },
  { token: '--sp-z-sticky', value: 200, usage: 'Sticky headers' },
  { token: '--sp-z-overlay', value: 300, usage: 'Overlays, backdrops' },
  { token: '--sp-z-modal', value: 400, usage: 'Modal dialogs' },
  { token: '--sp-z-popover', value: 500, usage: 'Popovers, tooltips' },
  { token: '--sp-z-toast', value: 600, usage: 'Toast notifications' },
  { token: '--sp-z-tooltip', value: 700, usage: 'Tooltip layer' },
]

export function ShadowsPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Shadows</h1>
        <p className="page-lead">
          Elevation tokens for layering and depth.
        </p>
      </div>

      <section className="doc-section">
        <h2>Shadow Levels</h2>
        <div className="shadow-grid">
          {SHADOWS.map(s => (
            <div
              key={s.token}
              className="shadow-card"
              style={{ boxShadow: `var(${s.token})` }}
            >
              <code className="shadow-card-token">{s.token}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2>Z-Index Scale</h2>
        <table className="token-table" aria-label="Z-index scale">
          <thead>
            <tr>
              <th>Token</th>
              <th>Value</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            {Z_LEVELS.map(item => (
              <tr key={item.token}>
                <td>{item.token}</td>
                <td>{item.value}</td>
                <td style={{ color: 'var(--text-3)' }}>{item.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
