const SHADOWS = [
  { token: '--sp-shadow-xs', usage: 'Hairline lift — inputs, subtle cards' },
  { token: '--sp-shadow-sm', usage: 'Cards, panels at rest' },
  { token: '--sp-shadow-md', usage: 'Dropdowns, popovers, raised cards' },
  { token: '--sp-shadow-lg', usage: 'Drawers, floating toolbars' },
  { token: '--sp-shadow-xl', usage: 'Modals, command palette' },
]

const EXTRA_SHADOWS = [
  { token: '--sp-shadow-inner', usage: 'Inset wells, pressed states' },
  { token: '--sp-shadow-none', usage: 'Explicitly flat' },
]

const Z_LEVELS = [
  { token: '--sp-z-base', value: 0, usage: 'Default stacking' },
  { token: '--sp-z-dropdown', value: 100, usage: 'Dropdown menus' },
  { token: '--sp-z-sticky', value: 200, usage: 'Sticky headers' },
  { token: '--sp-z-overlay', value: 300, usage: 'Overlays, backdrops' },
  { token: '--sp-z-modal', value: 400, usage: 'Modal dialogs' },
  { token: '--sp-z-popover', value: 500, usage: 'Popovers' },
  { token: '--sp-z-toast', value: 600, usage: 'Toast notifications' },
  { token: '--sp-z-tooltip', value: 700, usage: 'Tooltip layer (always on top)' },
]

export function ShadowsPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Shadows</h1>
        <p className="page-lead">
          Elevation tokens for layering and depth. Each level maps to a class
          of surface — the higher the element floats, the larger and softer its
          shadow. In dark mode every level is automatically re-tuned (deeper,
          higher-opacity shadows) so elevation stays readable on dark surfaces;
          never hard-code a <code>box-shadow</code>.
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
        <table className="token-table" aria-label="Shadow usage" style={{ marginTop: 'var(--sp-space-4)' }}>
          <thead>
            <tr><th>Token</th><th>Usage</th></tr>
          </thead>
          <tbody>
            {[...SHADOWS, ...EXTRA_SHADOWS].map(s => (
              <tr key={s.token}>
                <td><code>{s.token}</code></td>
                <td>{s.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="doc-section">
        <h2>Frosted Elevation</h2>
        <p className="section-desc">
          Translucent glass surfaces use their own tuned shadow,{' '}
          <code>--sp-frosted-shadow</code>, which combines an outer drop with an
          inner top highlight so the panel reads as lit glass. See the{' '}
          <a href="#/foundation/colors">Colors</a> page for the full frosted
          token set and the <code>.sp-frosted</code> utility.
        </p>
      </section>

      <section className="doc-section">
        <h2>Z-Index Scale</h2>
        <p className="section-desc">
          A fixed ladder with 100-point gaps — components never invent z-index
          values, they take a rung. The gaps leave room for app-level layers
          without reshuffling the system.
        </p>
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
                <td><code>{item.token}</code></td>
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
