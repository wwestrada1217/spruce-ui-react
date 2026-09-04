type Density = 'dense' | 'default' | 'comfortable'

const PRINCIPLES = [
  ['Inherited', 'Density should flow from the nearest container scope so adjacent surfaces stay rhythmically aligned by default.'],
  ['Semantic', 'Components should use shared aliases for heights, padding, gaps, and list rows instead of hard-coded preset values.'],
  ['Task-Fit', 'Choose density based on workflow needs: scan-heavy surfaces can be denser, while guided or detail-heavy flows often need more space.'],
]

const PRESETS: Array<{ id: Density; label: string; description: string; bestFor: string }> = [
  { id: 'dense', label: 'Dense', description: 'Optimized for operational and analyst workflows where scan speed matters more than spacious presentation.', bestFor: 'Datagrids, admin workspaces, command surfaces, compact side panels, and monitoring views.' },
  { id: 'default', label: 'Default', description: 'Balanced spacing for everyday application surfaces and the baseline rhythm for most products.', bestFor: 'General navigation, standard forms, lists, cards, dashboards, and product-wide defaults.' },
  { id: 'comfortable', label: 'Comfortable', description: 'Introduces more breathing room for slower-paced or guidance-heavy surfaces without changing component behavior.', bestFor: 'Detail pages, onboarding, settings, review flows, and content-first panels.' },
]

const TOKENS = [
  ['--sp-density-control-height', 'Buttons, inputs, selects, segmented controls, and toolbar affordances.'],
  ['--sp-density-control-padding-x', 'Horizontal padding inside controls, chips, inline actions, and compact badges.'],
  ['--sp-density-control-padding-y', 'Vertical padding for multiline controls, chips, pills, and compact rows.'],
  ['--sp-density-inline-gap', 'Gap between inline controls, field groups, toolbar items, and horizontal meta rows.'],
  ['--sp-density-stack-gap', 'Gap between stacked groups inside cards, panels, drawers, dialogs, and sections.'],
  ['--sp-density-icon-size', 'Density-aware icon sizing inside actions, menus, badges, and input affordances.'],
  ['--sp-density-list-item-min-height', 'Menus, list rows, tree nodes, timeline items, command results, and option lists.'],
  ['--sp-density-panel-padding', 'Card bodies, popovers, dropdown panels, modals, drawers, windows, and empty states.'],
]

const METRICS = [
  ['Control height', '28px', '32px', '36px'], ['Control padding x', '8px', '10px', '12px'],
  ['Control padding y', '6px', '8px', '10px'], ['Inline gap', '8px', '10px', '12px'],
  ['Stack gap', '12px', '16px', '20px'], ['List item min height', '28px', '32px', '40px'],
  ['Panel padding', '12px', '16px', '20px'], ['Icon size', '14px', '16px', '18px'],
]

const GUIDANCE = [
  ['Controls and actions', '--sp-density-control-height, --sp-density-control-padding-x, --sp-density-inline-gap', 'Buttons, inputs, segmented controls, and toolbar actions should align to the same baseline height and horizontal rhythm.'],
  ['Menus and lists', '--sp-density-list-item-min-height, --sp-density-control-padding-y, --sp-density-inline-gap', 'Interactive rows should keep predictable hit areas while adjusting vertical compactness across dense and comfortable layouts.'],
  ['Cards and panels', '--sp-density-panel-padding, --sp-density-stack-gap', 'Container interiors should expand and contract through panel padding and stacked spacing rather than independent ad hoc margins.'],
  ['Specialized data surfaces', 'Semantic aliases first, plus explicit datagrid metrics when the surface has coordinated row and header sizing', 'Data-dense surfaces can expose local overrides, but inherited behavior should remain the default so they still match surrounding UI.'],
]

const DATAGRID = [
  ['Row height', '26px', '32px', '38px'], ['Header height', '30px', '36px', '42px'],
  ['Filter row', '28px', '34px', '40px'], ['Aggregate row', '30px', '36px', '42px'],
  ['Toolbar height', '32px', '40px', '48px'], ['Footer height', '30px', '36px', '42px'],
  ['Pagination height', '32px', '40px', '48px'], ['Cell padding x', '8px', '12px', '16px'],
]

const BEST_PRACTICES = [
  ['Prefer inherited density', 'Set density at the highest meaningful container and let child components follow it. Reach for local overrides only when a surface genuinely needs to diverge.'],
  ['Use semantic aliases', 'Consume shared aliases in component styles instead of mapping each preset manually. That keeps behavior consistent as the token family evolves.'],
  ['Keep density consistent within a task', 'Avoid mixing dense and comfortable surfaces arbitrarily inside the same workflow. Scope density changes to meaningful layout or task boundaries.'],
  ['Do not use density as typography', 'Density adjusts spacing and sizing rhythm. It should not replace typographic hierarchy, accessibility sizing decisions, or content structure.'],
]

export function DensityPage() {
  return (
    <>
      <div className="page-header"><p className="page-tag">Foundation</p><h1>Density</h1><p className="page-lead">Density controls how compact or spacious a surface feels. Spruce exposes density as a shared token family so controls, lists, panels, and data-heavy surfaces can move together between dense, default, and comfortable layouts without introducing component-specific spacing APIs.</p></div>

      <section id="overview" className="doc-section"><h2>Overview</h2><p className="section-desc">Density changes sizing and rhythm as one inherited contract. Choose a preset without changing component meaning or duplicating component-specific spacing APIs.</p><div className="principles-grid">{PRINCIPLES.map(([title, body]) => <article key={title} className="principle-card"><h3>{title}</h3><p>{body}</p></article>)}</div></section>

      <section id="presets" className="doc-section"><h2>Presets</h2><div className="preset-grid">{PRESETS.map(preset => <article key={preset.id} className="preset-card" data-density={preset.id}><h3>{preset.label}</h3><p>{preset.description}</p><p><strong>Best for:</strong> {preset.bestFor}</p><code>data-density=&quot;{preset.id}&quot;</code></article>)}</div></section>

      <section id="applying-density" className="doc-section"><h2>Applying Density</h2><p className="section-desc">Apply density at the application root or on a local subtree. The semantic aliases re-resolve for descendants.</p><div className="code-block"><pre><code>{`<html data-density="default">
  <body>
    <main data-density="dense">
      <Toolbar />
      <DataGrid />
    </main>
  </body>
</html>`}</code></pre></div><div className="code-block"><pre><code>{`.surface {
  min-height: var(--sp-density-control-height);
  padding-inline: var(--sp-density-control-padding-x);
  gap: var(--sp-density-inline-gap);
}

.panel { padding: var(--sp-density-panel-padding); }`}</code></pre></div></section>

      <section id="tokens" className="doc-section"><h2>Token Reference</h2><table className="token-table" aria-label="Density semantic aliases"><thead><tr><th>Semantic token</th><th>Use</th></tr></thead><tbody>{TOKENS.map(([token, usage]) => <tr key={token}><td><code>{token}</code></td><td>{usage}</td></tr>)}</tbody></table><table className="token-table" aria-label="Density core metrics" style={{ marginTop: 'var(--sp-space-4)' }}><thead><tr><th>Metric</th><th>Dense</th><th>Default</th><th>Comfortable</th></tr></thead><tbody>{METRICS.map(([label, dense, defaultValue, comfortable]) => <tr key={label}><td>{label}</td><td>{dense}</td><td>{defaultValue}</td><td>{comfortable}</td></tr>)}</tbody></table></section>

      <section id="component-guidance" className="doc-section"><h2>Component Guidance</h2><div className="principles-grid">{GUIDANCE.map(([title, tokens, body]) => <article key={title} className="principle-card"><h3>{title}</h3><p><strong>Use:</strong> {tokens}</p><p>{body}</p></article>)}</div></section>

      <section id="datagrid" className="doc-section"><h2>Datagrid Behavior</h2><p className="section-desc">Datagrid inherits density from the nearest scope by default and can override that density per grid when a local divergence is necessary. Row lines, headers, filters, toolbars, pagination, and cell padding remain coordinated.</p><table className="token-table" aria-label="Datagrid density metrics"><thead><tr><th>Metric</th><th>Dense</th><th>Default</th><th>Comfortable</th></tr></thead><tbody>{DATAGRID.map(([label, dense, defaultValue, comfortable]) => <tr key={label}><td>{label}</td><td>{dense}</td><td>{defaultValue}</td><td>{comfortable}</td></tr>)}</tbody></table></section>

      <section id="best-practices" className="doc-section"><h2>Best Practices</h2><div className="principles-grid">{BEST_PRACTICES.map(([title, body]) => <article key={title} className="principle-card"><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    </>
  )
}
