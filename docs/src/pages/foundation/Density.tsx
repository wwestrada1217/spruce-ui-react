type Density = 'dense' | 'default' | 'comfortable'

const PRESETS: Array<{ id: Density; label: string; description: string }> = [
  { id: 'dense', label: 'Dense', description: 'Scan-heavy workflows and data-rich surfaces' },
  { id: 'default', label: 'Default', description: 'The baseline rhythm for most application UI' },
  { id: 'comfortable', label: 'Comfortable', description: 'Guided, low-frequency, and reading-oriented flows' },
]

const ALIASES = [
  '--sp-density-control-height',
  '--sp-density-control-padding-x',
  '--sp-density-control-padding-y',
  '--sp-density-inline-gap',
  '--sp-density-stack-gap',
  '--sp-density-icon-size',
  '--sp-density-list-item-min-height',
  '--sp-density-panel-padding',
  '--sp-density-datagrid-row-height',
]

export function DensityPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Density</h1>
        <p className="page-lead">
          Density changes sizing and rhythm as one inherited contract. Choose
          dense, default, or comfortable without changing component meaning or
          duplicating component-specific spacing APIs.
        </p>
      </div>

      <section className="doc-section">
        <h2>Presets</h2>
        <div className="preset-grid">
          {PRESETS.map(preset => (
            <article key={preset.id} className="preset-card" data-density={preset.id}>
              <h3>{preset.label}</h3>
              <p>{preset.description}</p>
              <code>data-density=&quot;{preset.id}&quot;</code>
            </article>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2>Scoped selectors</h2>
        <p className="section-desc">
          Apply density at the application root or on a subtree. The semantic
          aliases re-resolve for descendants.
        </p>
        <div className="code-block">
          <pre><code>{`<main data-density="dense">
  <DataSurface />
</main>

<section data-density="comfortable">
  <ReadingPanel />
</section>`}</code></pre>
        </div>
      </section>

      <section className="doc-section">
        <h2>Semantic aliases</h2>
        <table className="token-table" aria-label="Density semantic aliases">
          <thead><tr><th>Alias</th><th>Use</th></tr></thead>
          <tbody>
            {ALIASES.map(token => (
              <tr key={token}>
                <td><code>{token}</code></td>
                <td>Inherited sizing or spacing for the active density scope</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
