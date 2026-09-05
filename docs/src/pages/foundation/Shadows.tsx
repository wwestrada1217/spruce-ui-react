import { FoundationPageShell } from '../../components/FoundationPageShell'
import { CodePreview } from '../../components/CodePreview'
import { SPRUCE_SHADOWS, SPRUCE_Z_INDEX } from 'spruce-react'

const USAGE_CODE = `.popover {
  box-shadow: var(--sp-shadow-md);
  z-index: var(--sp-z-popover);
}

.dialog-backdrop {
  background: var(--sp-overlay-bg);
  z-index: var(--sp-z-overlay);
}

.dialog {
  box-shadow: var(--sp-shadow-lg);
  z-index: var(--sp-z-modal);
}`

const PRINCIPLES = [
  ['Use elevation sparingly', 'A shadow should explain separation or interaction. Flat surfaces and borders are often enough.'],
  ['Match depth to stack order', 'A modal should feel more elevated than the page beneath it, and its shadow should agree with its z-index layer.'],
  ['Avoid arbitrary stack numbers', 'Use the shared z-index scale so overlays remain predictable as the application grows.'],
]

const SHADOWS = [
  ['None', '--sp-shadow-none', SPRUCE_SHADOWS.none, 'Flat surfaces, borders-only containers, and intentionally quiet UI.'],
  ['XS', '--sp-shadow-xs', SPRUCE_SHADOWS.xs, 'Subtle separation for low-rise cards and compact surfaces.'],
  ['SM', '--sp-shadow-sm', SPRUCE_SHADOWS.sm, 'Default lifted cards, dropdown shells, and compact overlays.'],
  ['MD', '--sp-shadow-md', SPRUCE_SHADOWS.md, 'Popovers, menus, and surfaces that need clear separation.'],
  ['LG', '--sp-shadow-lg', SPRUCE_SHADOWS.lg, 'Dialogs, command palettes, and more prominent transient layers.'],
  ['XL', '--sp-shadow-xl', SPRUCE_SHADOWS.xl, 'High-priority modals and isolated spotlight surfaces.'],
  ['Inner', '--sp-shadow-inner', SPRUCE_SHADOWS.inner, 'Pressed states, recessed inputs, and inset treatments.'],
]

const LAYERS = [
  ['Base surfaces', 'None → XS', 'Use no shadow or a subtle lift for ordinary cards, panels, and surfaces that sit directly in the page flow.'],
  ['Interactive overlays', 'SM → MD', 'Dropdowns, popovers, menus, and contextual surfaces need enough separation to read above nearby content.'],
  ['High-priority surfaces', 'LG → XL', 'Dialogs, command palettes, and blocking surfaces can use stronger elevation when they interrupt the page.'],
]

const Z_LEVELS = [
  ['--sp-z-base', SPRUCE_Z_INDEX.base, 'Default stacking context for ordinary content.'], ['--sp-z-dropdown', SPRUCE_Z_INDEX.dropdown, 'Dropdown menus and compact selectable lists.'],
  ['--sp-z-sticky', SPRUCE_Z_INDEX.sticky, 'Sticky headers, pinned rows, and persistent region chrome.'], ['--sp-z-overlay', SPRUCE_Z_INDEX.overlay, 'Backdrops and overlay shells beneath modal content.'],
  ['--sp-z-modal', SPRUCE_Z_INDEX.modal, 'Modal dialogs and primary blocking surfaces.'], ['--sp-z-popover', SPRUCE_Z_INDEX.popover, 'Popovers or contextual layers that may open above other overlays.'],
  ['--sp-z-toast', SPRUCE_Z_INDEX.toast, 'Toast notifications and transient global notices.'], ['--sp-z-tooltip', SPRUCE_Z_INDEX.tooltip, 'Tooltip surfaces that need to clear nearby overlays.'],
]

const BEST_PRACTICES = [
  ['Let borders do some of the work', 'A subtle border can separate a surface without making every card look elevated.'],
  ['Themes can shadow every control at once', 'Use --sp-control-shadow for buttons, fields, and toggles, and --sp-surface-shadow for cards. Both default to none so themes can opt into a coordinated elevation treatment.'],
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

      <section id="usage" className="doc-section"><h2>Usage</h2><p className="section-desc">Treat shadow and z-index tokens as a matched pair. Visual depth alone is not enough for overlays, and a high stack value without visual elevation often feels accidental.</p><div className="usage-grid"><article className="code-card"><h3>Token Consumption</h3><CodePreview codeOnly language="css" code={USAGE_CODE} /></article><article className="guidance-card"><h3>Best Practices</h3><div className="best-practices">{BEST_PRACTICES.map(([title, body]) => <div key={title} className="best-practice-item"><strong>{title}</strong><p>{body}</p></div>)}</div></article></div></section>
    </FoundationPageShell>
  )
}
