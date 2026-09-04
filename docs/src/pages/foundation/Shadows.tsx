import { FoundationPageShell } from '../../components/FoundationPageShell'

const PRINCIPLES = [
  ['Use elevation sparingly', 'A shadow should explain separation or interaction. Flat surfaces and borders are often enough.'],
  ['Match depth to stack order', 'A modal should feel more elevated than the page beneath it, and its shadow should agree with its z-index layer.'],
  ['Avoid arbitrary stack numbers', 'Use the shared z-index scale so overlays remain predictable as the application grows.'],
]

const SHADOWS = [
  ['None', '--sp-shadow-none', 'none', 'Flat surfaces, borders-only containers, and intentionally quiet UI.'],
  ['XS', '--sp-shadow-xs', '0 1px 2px rgba(0, 0, 0, 0.05)', 'Subtle separation for low-rise cards and compact surfaces.'],
  ['SM', '--sp-shadow-sm', '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)', 'Default lifted cards, dropdown shells, and compact overlays.'],
  ['MD', '--sp-shadow-md', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)', 'Popovers, menus, and surfaces that need clear separation.'],
  ['LG', '--sp-shadow-lg', '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)', 'Dialogs, command palettes, and more prominent transient layers.'],
  ['XL', '--sp-shadow-xl', '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', 'High-priority modals and isolated spotlight surfaces.'],
  ['Inner', '--sp-shadow-inner', 'inset 0 2px 4px rgba(0, 0, 0, 0.06)', 'Pressed states, recessed inputs, and inset treatments.'],
]

const LAYERS = [
  ['Base surfaces', 'None → XS', 'Use no shadow or a subtle lift for ordinary cards, panels, and surfaces that sit directly in the page flow.'],
  ['Interactive overlays', 'SM → MD', 'Dropdowns, popovers, menus, and contextual surfaces need enough separation to read above nearby content.'],
  ['High-priority surfaces', 'LG → XL', 'Dialogs, command palettes, and blocking surfaces can use stronger elevation when they interrupt the page.'],
]

const Z_LEVELS = [
  ['--sp-z-base', 0, 'Default stacking context for ordinary content.'], ['--sp-z-dropdown', 100, 'Dropdown menus and compact selectable lists.'],
  ['--sp-z-sticky', 200, 'Sticky headers, pinned rows, and persistent region chrome.'], ['--sp-z-overlay', 300, 'Backdrops and overlay shells beneath modal content.'],
  ['--sp-z-modal', 400, 'Modal dialogs and primary blocking surfaces.'], ['--sp-z-popover', 500, 'Popovers or contextual layers that may open above other overlays.'],
  ['--sp-z-toast', 600, 'Toast notifications and transient global notices.'], ['--sp-z-tooltip', 700, 'Tooltip surfaces that need to clear nearby overlays.'],
]

const BEST_PRACTICES = [
  ['Let borders do some of the work', 'A subtle border can separate a surface without making every card look elevated.'],
  ['Themes can shadow every control at once', 'Use semantic shadow tokens so light and dark themes can retune elevation globally.'],
  ['Keep overlay steps predictable', 'Choose a shadow and z-index rung together rather than inventing local values.'],
  ['Escalate only when the interaction changes', 'Reserve large shadows for surfaces that interrupt or demand attention.'],
]

export function ShadowsPage() {
  return (
    <FoundationPageShell variant="shadows" title="Shadows" description="Elevation tokens create depth, focus, and layer separation. Shadows should clarify the stack of the interface, while z-index tokens keep overlays, popovers, and temporary surfaces ordered in a predictable way.">
      <div className="page-header"><p className="page-tag">Foundation</p><h1>Shadows</h1><p className="page-lead">Elevation tokens create depth, focus, and layer separation. Shadows should clarify the stack of the interface, while z-index tokens keep overlays, popovers, and temporary surfaces ordered in a predictable way.</p></div>

      <section id="overview" className="doc-section"><h2>Overview</h2><p className="section-desc">Elevation is a system, not a decoration. Use lower shadow levels for subtle separation, use higher levels only for transient or highly interactive surfaces, and rely on z-index tokens to define stacking rather than arbitrary large numbers.</p><div className="principles-grid">{PRINCIPLES.map(([title, body]) => <article key={title} className="principle-card"><h3>{title}</h3><p>{body}</p></article>)}</div></section>

      <section id="shadow-levels" className="doc-section"><h2>Shadow Levels</h2><p className="section-desc">Each shadow token represents a consistent elevation step. Keep the progression narrow so users can still understand which surface is actually on top.</p><div className="shadow-grid">{SHADOWS.map(([label, token, value, usage]) => <article key={token} className="shadow-card"><div className="shadow-card__sample-wrap"><div className="shadow-card__sample" style={{ boxShadow: `var(${token})` }}><span>{label}</span></div></div><div className="shadow-card__body"><div className="shadow-card__row"><strong>{token}</strong><span>{value}</span></div><p>{usage}</p></div></article>)}</div></section>

      <section id="layering" className="doc-section"><h2>Layering Guidance</h2><p className="section-desc">Shadows and stacking should reinforce each other. A modal should not only sit above page content numerically, it should also feel visually elevated relative to the layers beneath it.</p><div className="layering-grid">{LAYERS.map(([title, range, body]) => <article key={title} className="layering-card"><div className="layering-card__badge">{range}</div><h3>{title}</h3><p>{body}</p></article>)}</div></section>

      <section id="z-index" className="doc-section"><h2>Z-Index Scale</h2><p className="section-desc">The z-index scale gives overlays a predictable order. Components should consume these tokens instead of inventing local stacks that are hard to reconcile later.</p><table className="token-table" aria-label="Z-index scale"><thead><tr><th>Token</th><th>Value</th><th>Use For</th></tr></thead><tbody>{Z_LEVELS.map(([token, value, usage]) => <tr key={token}><td><code>{token}</code></td><td>{value}</td><td>{usage}</td></tr>)}</tbody></table></section>

      <section id="usage" className="doc-section"><h2>Usage</h2><p className="section-desc">Treat shadow and z-index tokens as a matched pair. Visual depth alone is not enough for overlays, and a high stack value without visual elevation often feels accidental.</p><div className="code-block"><pre><code>{`.popover {
  box-shadow: var(--sp-shadow-md);
  z-index: var(--sp-z-popover);
}`}</code></pre></div><div className="principles-grid">{BEST_PRACTICES.map(([title, body]) => <article key={title} className="principle-card"><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    </FoundationPageShell>
  )
}
