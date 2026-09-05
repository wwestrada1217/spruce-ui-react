import { FoundationPageShell } from '../../components/FoundationPageShell'
import { CodePreview } from '../../components/CodePreview'

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

const PRESET_GUIDANCE = [
  ['Dense', 'Users compare many rows, scan lists quickly, or keep multiple controls visible at once.', 'The surface depends on generous reading comfort, onboarding guidance, or low-vision-friendly spacing.'],
  ['Default', 'You need a balanced baseline across forms, navigation, and content surfaces.', 'A workflow clearly benefits from either more compression or more breathing room.'],
  ['Comfortable', 'Users need more visual separation, easier targeting, or more time spent inside each section.', 'The workflow is constrained by limited viewport space or requires high information density.'],
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
  ['Control padding y', '4px', '6px', '8px'], ['Inline gap', '8px', '10px', '12px'],
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
  ['Row height', '26px', '32px', '38px'], ['Header height', '24px', '32px', '32px'],
  ['Filter row', '28px', '32px', '34px'], ['Aggregate row', '28px', '32px', '34px'],
  ['Toolbar height', '32px', '36px', '40px'], ['Footer height', '24px', '28px', '30px'],
  ['Pagination height', '30px', '34px', '38px'], ['Cell padding x', '8px', '10px', '12px'],
]

const SUPPORTED_SURFACES = [
  ['Forms and controls', 'Inputs, selectors, toggles, buttons, split buttons, and tabs inherit shared control size and padding aliases.'],
  ['Navigation chrome', 'Sidebar items, popover entries, nav menus, and shell actions inherit list row height, icon size, and inline gap tokens.'],
  ['Overlay and panel surfaces', 'Dropdowns, popovers, modals, drawers, windows, command surfaces, cards, and panels use panel padding and stacked rhythm aliases.'],
  ['Display primitives', 'Trees, timelines, kanbans, stat cards, and empty states align spacing and item sizing to neighboring density-aware surfaces.'],
  ['Datagrid', 'Datagrid inherits density from the nearest scope by default and can override that density per grid when a local divergence is necessary.'],
]

const BEST_PRACTICES = [
  ['Prefer inherited density', 'Set density at the highest meaningful container and let child components follow it. Reach for local overrides only when a surface genuinely needs to diverge.'],
  ['Use semantic aliases', 'Consume shared aliases in component styles instead of mapping each preset manually. That keeps behavior consistent as the token family evolves.'],
  ['Keep density consistent within a task', 'Avoid mixing dense and comfortable surfaces arbitrarily inside the same workflow. Scope density changes to meaningful layout or task boundaries.'],
  ['Do not use density as typography', 'Density adjusts spacing and sizing rhythm. It should not replace typographic hierarchy, accessibility sizing decisions, or content structure.'],
]

const APPLICATION_SCOPE_CODE = `<html data-density="default">
  <body>
    <main data-density="dense">
      <Toolbar />
      <DataGrid />
    </main>
  </body>
</html>`
const LOCAL_SCOPE_CODE = `<section data-density="comfortable">
  <ReviewPanel />
</section>`
const SEMANTIC_ALIASES_CODE = `.surface {
  min-height: var(--sp-density-control-height);
  padding-inline: var(--sp-density-control-padding-x);
  gap: var(--sp-density-inline-gap);
}

.panel { padding: var(--sp-density-panel-padding); }`

export function DensityPage() {
  return (
    <FoundationPageShell variant="density" title="Density" description="Density controls how compact or spacious a surface feels. Spruce exposes density as a shared token family so controls, lists, panels, and data-heavy surfaces can move together between dense, default, and comfortable layouts without introducing component-specific spacing APIs.">
      <div className="page-header"><p className="page-tag">Foundation</p><h1>Density</h1><p className="page-lead">Density controls how compact or spacious a surface feels. Spruce exposes density as a shared token family so controls, lists, panels, and data-heavy surfaces can move together between dense, default, and comfortable layouts without introducing component-specific spacing APIs.</p></div>

      <section id="overview" className="doc-section"><h2>Overview</h2><p className="section-desc">Density is inherited through <code>data-density</code> scopes and resolved through semantic aliases like <code>--sp-density-control-height</code> and <code>--sp-density-panel-padding</code>. Components should consume those aliases so the same surface can adapt to different workflows without branching styles for each preset.</p><div className="principles-grid">{PRINCIPLES.map(([title, body]) => <article key={title} className="principle-card"><h3>{title}</h3><p>{body}</p></article>)}</div><article className="note-card"><h3>What Density Changes</h3><p>Density changes sizing and rhythm, not component meaning. It affects heights, padding, gaps, list row sizes, and container spacing. It should not change information hierarchy, interaction models, or typography scale.</p></article></section>

      <section id="presets" className="doc-section"><h2>Presets</h2><p className="section-desc">Use the preset that matches the task. Dense optimizes for scan-heavy workflows, default is the baseline for most application surfaces, and comfortable creates more breathing room for low-frequency or high-guidance flows.</p><div className="preset-grid">{PRESETS.map(preset => <article key={preset.id} className="preset-card" data-density={preset.id}><div className="preset-card__header"><div><h3>{preset.label}</h3><p>{preset.description}</p></div><span className="preset-chip">{preset.id}</span></div><p className="preset-card__meta"><strong>Best for:</strong> {preset.bestFor}</p><div className="density-preview" aria-hidden="true"><div className="density-preview__toolbar"><span className="density-preview__pill">Filters</span><span className="density-preview__pill">Status</span><span className="density-preview__pill">Owner</span></div><div className="density-preview__controls"><div className="density-preview__control">Search queue</div><div className="density-preview__control density-preview__control--short">Open</div></div><div className="density-preview__list"><div className="density-preview__item">Approval pending</div><div className="density-preview__item">Escalated request</div><div className="density-preview__item">SLA breach warning</div></div></div></article>)}</div><table className="token-table" aria-label="Density preset guidance" style={{ marginTop: 'var(--sp-space-4)' }}><thead><tr><th>Preset</th><th>Use When</th><th>Avoid When</th></tr></thead><tbody>{PRESET_GUIDANCE.map(([preset, useWhen, avoidWhen]) => <tr key={preset}><td>{preset}</td><td>{useWhen}</td><td>{avoidWhen}</td></tr>)}</tbody></table></section>

      <section id="applying-density" className="doc-section"><h2>Applying Density</h2><p className="section-desc">Apply density at the root for an application-wide default, or scope it to a subtree when a single workspace, panel, or embedded surface needs a different rhythm.</p><div className="code-grid"><article className="code-card"><h3>Application Scope</h3><CodePreview codeOnly language="html" code={APPLICATION_SCOPE_CODE} /><p>Use this when the entire product should share one density preset.</p></article><article className="code-card"><h3>Local Scope</h3><CodePreview codeOnly language="html" code={LOCAL_SCOPE_CODE} /><p>Use a local scope when one surface needs a different rhythm.</p></article></div><article className="code-card code-card--wide"><h3>Consume Semantic Aliases</h3><CodePreview codeOnly language="css" code={SEMANTIC_ALIASES_CODE} /><p>Prefer semantic aliases over hard-coded preset values.</p></article></section>

      <section id="tokens" className="doc-section"><h2>Token Reference</h2><table className="token-table" aria-label="Density semantic aliases"><thead><tr><th>Semantic token</th><th>Use</th></tr></thead><tbody>{TOKENS.map(([token, usage]) => <tr key={token}><td><code>{token}</code></td><td>{usage}</td></tr>)}</tbody></table><table className="token-table" aria-label="Density core metrics" style={{ marginTop: 'var(--sp-space-4)' }}><thead><tr><th>Metric</th><th>Dense</th><th>Default</th><th>Comfortable</th></tr></thead><tbody>{METRICS.map(([label, dense, defaultValue, comfortable]) => <tr key={label}><td>{label}</td><td>{dense}</td><td>{defaultValue}</td><td>{comfortable}</td></tr>)}</tbody></table></section>

      <section id="component-guidance" className="doc-section"><h2>Component Guidance</h2><p className="section-desc">Different component families should map density in predictable ways. The goal is a stable, reusable rhythm across controls, lists, containers, and data surfaces.</p><div className="principles-grid">{GUIDANCE.map(([title, tokens, body]) => <article key={title} className="principle-card"><h3>{title}</h3><p><strong>Use:</strong> {tokens}</p><p>{body}</p></article>)}</div><table className="token-table" aria-label="Density supported surfaces" style={{ marginTop: 'var(--sp-space-4)' }}><thead><tr><th>Surface</th><th>Expected Behavior</th></tr></thead><tbody>{SUPPORTED_SURFACES.map(([surface, behavior]) => <tr key={surface}><td>{surface}</td><td>{behavior}</td></tr>)}</tbody></table></section>

      <section id="datagrid" className="doc-section"><h2>Datagrid Behavior</h2><p className="section-desc">Datagrid inherits the ambient density scope by default. If a grid needs to diverge from the surrounding UI, it can still override density locally through its own control without forcing the rest of the page to change.</p><div className="guidance-grid guidance-grid--two-up"><article className="guidance-card"><h3>Inherited by Default</h3><p>When no grid-specific density is set, row height, header height, filters, footer, and pagination all resolve from the nearest <code>data-density</code> scope.</p></article><article className="guidance-card"><h3>Local Override When Needed</h3><p>Use the grid density control only when a single grid must diverge from the page. Users can return that grid to inherited behavior through the same control.</p></article></div><table className="token-table" aria-label="Datagrid density metrics" style={{ marginTop: 'var(--sp-space-4)' }}><thead><tr><th>Metric</th><th>Dense</th><th>Default</th><th>Comfortable</th></tr></thead><tbody>{DATAGRID.map(([label, dense, defaultValue, comfortable]) => <tr key={label}><td>{label}</td><td>{dense}</td><td>{defaultValue}</td><td>{comfortable}</td></tr>)}</tbody></table></section>

      <section id="best-practices" className="doc-section"><h2>Best Practices</h2><div className="principles-grid">{BEST_PRACTICES.map(([title, body]) => <article key={title} className="principle-card"><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    </FoundationPageShell>
  )
}
