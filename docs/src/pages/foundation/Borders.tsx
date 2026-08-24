const WIDTHS = [
  { token: '--sp-border-width-none', value: '0', usage: 'Explicitly borderless surfaces' },
  { token: '--sp-border-width-hairline', value: '1px', usage: 'Dividers, controls, grids, and tables' },
  { token: '--sp-border-width-medium', value: '2px', usage: 'Section breaks and emphasized separators' },
]

const COLORS = [
  { token: '--sp-border', usage: 'Default divider and outline color' },
  { token: '--sp-border-strong', usage: 'Emphasized frames and separators' },
  { token: '--sp-border-focus', usage: 'Focused control border' },
  { token: '--sp-overlay-border', usage: 'Floating panel edge' },
]

export function BordersPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Borders</h1>
        <p className="page-lead">
          Pair a width token with a themed border color. Widths stay stable across
          themes; colors carry the visual weight.
        </p>
      </div>

      <section className="doc-section">
        <h2>Widths</h2>
        <table className="token-table" aria-label="Border width tokens">
          <thead><tr><th>Token</th><th>Value</th><th>Usage</th></tr></thead>
          <tbody>
            {WIDTHS.map(item => (
              <tr key={item.token}>
                <td><code>{item.token}</code></td>
                <td>{item.value}</td>
                <td>{item.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="doc-section">
        <h2>Colors and overlays</h2>
        <p className="section-desc">
          Use <code>--sp-overlay-border</code> for popovers, menus, pickers, and
          other floating surfaces. It is derived from the active text color so
          custom themes stay coherent.
        </p>
        <table className="token-table" aria-label="Border color tokens">
          <thead><tr><th>Token</th><th>Usage</th></tr></thead>
          <tbody>
            {COLORS.map(item => (
              <tr key={item.token}>
                <td><code>{item.token}</code></td>
                <td>{item.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="doc-section">
        <h2>Usage</h2>
        <div className="code-block">
          <pre><code>{`/* Component-owned border */
.panel {
  border: var(--sp-border-width-hairline) solid var(--sp-border);
}

/* Floating surface */
.menu {
  border: var(--sp-overlay-border-width) solid var(--sp-overlay-border);
}`}</code></pre>
        </div>
      </section>
    </>
  )
}
