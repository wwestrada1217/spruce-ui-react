const SPACINGS = [
  { token: '--sp-space-0', value: '0' },
  { token: '--sp-space-px', value: '1px' },
  { token: '--sp-space-0_5', value: '2px' },
  { token: '--sp-space-1', value: '4px' },
  { token: '--sp-space-1_5', value: '6px' },
  { token: '--sp-space-2', value: '8px' },
  { token: '--sp-space-2_5', value: '10px' },
  { token: '--sp-space-3', value: '12px' },
  { token: '--sp-space-3_5', value: '14px' },
  { token: '--sp-space-4', value: '16px' },
  { token: '--sp-space-5', value: '20px' },
  { token: '--sp-space-6', value: '24px' },
  { token: '--sp-space-7', value: '28px' },
  { token: '--sp-space-8', value: '32px' },
  { token: '--sp-space-9', value: '36px' },
  { token: '--sp-space-10', value: '40px' },
  { token: '--sp-space-12', value: '48px' },
  { token: '--sp-space-14', value: '56px' },
  { token: '--sp-space-16', value: '64px' },
  { token: '--sp-space-20', value: '80px' },
  { token: '--sp-space-24', value: '96px' },
]

const RADII = [
  { token: '--sp-radius-none', value: '0' },
  { token: '--sp-radius-sm', value: '2px' },
  { token: '--sp-radius-md', value: '3px' },
  { token: '--sp-radius-lg', value: '4px' },
  { token: '--sp-radius-xl', value: '6px' },
  { token: '--sp-radius-2xl', value: '8px' },
  { token: '--sp-radius-full', value: '9999px' },
]

const BORDER_WIDTHS = [
  { token: '--sp-border-width-none', value: '0', desc: 'Explicitly borderless' },
  { token: '--sp-border-width-hairline', value: '1px', desc: 'Default divider / control outline (grids, tables, splitters)' },
  { token: '--sp-border-width-medium', value: '2px', desc: 'Section breaks, emphasis separators, aggregate rows' },
]

const DENSITY_ALIASES = [
  { token: '--sp-density-control-height', dense: '28px', def: '32px', comfy: '36px' },
  { token: '--sp-density-control-padding-x', dense: '8px', def: '10px', comfy: '12px' },
  { token: '--sp-density-inline-gap', dense: '8px', def: '10px', comfy: '12px' },
  { token: '--sp-density-stack-gap', dense: '12px', def: '16px', comfy: '20px' },
  { token: '--sp-density-icon-size', dense: '14px', def: '16px', comfy: '18px' },
  { token: '--sp-density-list-item-min-height', dense: '28px', def: '32px', comfy: '40px' },
  { token: '--sp-density-panel-padding', dense: '12px', def: '16px', comfy: '20px' },
  { token: '--sp-density-datagrid-row-height', dense: '26px', def: '32px', comfy: '38px' },
]

export function SpacingPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Spacing</h1>
        <p className="page-lead">
          A 4px-base spacing scale exposed as CSS custom properties, with
          half-steps for fine control in dense UI. Use these for consistent
          padding, margins, and gaps — components own their internal padding,
          while parents own the space between siblings (prefer container{' '}
          <code>gap</code> over per-child margins).
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

      <section className="doc-section">
        <h2>Border Widths</h2>
        <p className="section-desc">
          Pair with the border color tokens:{' '}
          <code>border: var(--sp-border-width-hairline) solid var(--sp-border)</code>.
          Dark mode themes only the border <em>colors</em> — widths never change.
        </p>
        <table className="token-table" aria-label="Border widths">
          <thead>
            <tr><th>Token</th><th>Value</th><th>Usage</th></tr>
          </thead>
          <tbody>
            {BORDER_WIDTHS.map(b => (
              <tr key={b.token}>
                <td><code>{b.token}</code></td>
                <td>{b.value}</td>
                <td>{b.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="doc-section">
        <h2>Density</h2>
        <p className="section-desc">
          Density presets define semantic sizing for controls, lists, panels,
          and datagrids. Set{' '}
          <code>data-density=&quot;dense | default | comfortable&quot;</code> on
          any container and the semantic aliases below re-resolve for that
          subtree. (Preset-specific tokens such as{' '}
          <code>--sp-density-dense-control-height</code> are also available for
          local overrides.)
        </p>
        <table className="token-table" aria-label="Density aliases">
          <thead>
            <tr><th>Semantic token</th><th>Dense</th><th>Default</th><th>Comfortable</th></tr>
          </thead>
          <tbody>
            {DENSITY_ALIASES.map(d => (
              <tr key={d.token}>
                <td><code>{d.token}</code></td>
                <td>{d.dense}</td>
                <td>{d.def}</td>
                <td>{d.comfy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
