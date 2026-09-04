const SPACINGS = [
  ['0', '--sp-space-0', '0', 'Reset spacing and collapse edges where needed.'], ['px', '--sp-space-px', '1px', 'Hairline alignment and optical corrections.'],
  ['0.5', '--sp-space-0_5', '2px', 'Micro-adjustments inside dense controls.'], ['1', '--sp-space-1', '4px', 'Tight icon spacing and compressed inline layouts.'],
  ['1.5', '--sp-space-1_5', '6px', 'Dense field labels, helper rows, and tight chips.'], ['2', '--sp-space-2', '8px', 'Compact gaps between related controls and metadata.'],
  ['2.5', '--sp-space-2_5', '10px', 'Tight but readable panel and toolbar spacing.'], ['3', '--sp-space-3', '12px', 'Default internal gaps across common UI blocks.'],
  ['3.5', '--sp-space-3_5', '14px', 'Intermediate spacing for nuanced control groups.'], ['4', '--sp-space-4', '16px', 'Default card padding and component separation.'],
  ['5', '--sp-space-5', '20px', 'Roomier group spacing inside larger surfaces.'], ['6', '--sp-space-6', '24px', 'Section spacing inside panels and drawers.'],
  ['8', '--sp-space-8', '32px', 'Layout-level rhythm between major blocks.'], ['10', '--sp-space-10', '40px', 'Generous separation for feature sections and hero layouts.'],
  ['12', '--sp-space-12', '48px', 'Large vertical rhythm and multi-panel separation.'], ['14', '--sp-space-14', '56px', 'Expanded structural spacing for wide layouts.'],
  ['16', '--sp-space-16', '64px', 'Page section spacing and roomy content blocks.'], ['20', '--sp-space-20', '80px', 'Hero spacing, landing sections, and immersive layouts.'],
  ['24', '--sp-space-24', '96px', 'Maximum structural separation on large canvases.'],
]

const RHYTHM = [
  ['Micro rhythm', '0.5–2', 'Use for icon gaps, label-to-control spacing, and compact metadata inside a component.'],
  ['Component rhythm', '2.5–6', 'Use for related controls, stacked content, card interiors, and panel groups.'],
  ['Section rhythm', '8–12', 'Use to separate major blocks within a page, drawer, or dialog.'],
  ['Page rhythm', '14–24', 'Use for hero layouts, page sections, and large structural transitions.'],
]

const RADII = [
  ['None', '--sp-radius-none', '0', 'Grid lines, flush layouts, and intentionally sharp boundaries.'], ['Small', '--sp-radius-sm', '2px', 'Dense inputs, chips, and compact utility surfaces.'],
  ['Medium', '--sp-radius-md', '3px', 'Default control radius for many interactive elements.'], ['Large', '--sp-radius-lg', '4px', 'Buttons, cards, and panels that need a softer edge.'],
  ['XL', '--sp-radius-xl', '6px', 'Prominent containers, dialogs, and elevated surfaces.'], ['2XL', '--sp-radius-2xl', '8px', 'Feature panels and standout containers with more generous shaping.'],
  ['Full', '--sp-radius-full', '9999px', 'Pills, badges, circular actions, and avatar treatments.'],
]

const BEST_PRACTICES = [
  ['Pick a default internal gap and repeat it', 'Repeated rhythm makes component content feel intentional and easier to scan.'],
  ['Use larger jumps for structure, not decoration', 'Reserve large tokens for separating groups, sections, and page regions.'],
  ['Tie radius to component role', 'Use the same radius family for controls and surfaces that belong to the same interaction level.'],
]

export function SpacingPage() {
  return (
    <>
      <div className="page-header"><p className="page-tag">Foundation</p><h1>Spacing</h1><p className="page-lead">Spacing tokens create layout rhythm, breathable controls, and consistent separation between interface layers. The scale is based on a compact system that still leaves room for expressive page structure and generous content sections.</p></div>

      <section id="overview" className="doc-section"><h2>Overview</h2><p className="section-desc">Spacing is a layout contract. Components own their internal padding, while parents own the space between siblings. Prefer container <code>gap</code> over per-child margins so the relationship remains visible in the layout.</p><div className="principles-grid"><article className="principle-card"><h3>Rhythm beats randomness</h3><p>Repeated spacing values create a predictable visual cadence and make interfaces easier to scan.</p></article><article className="principle-card"><h3>Density and spacing cooperate</h3><p>Density presets adjust semantic control and panel rhythm while this scale remains the shared source of values.</p></article><article className="principle-card"><h3>Scale intent with distance</h3><p>Use smaller tokens for touch points within a component and larger tokens to separate groups, sections, and page regions.</p></article></div></section>

      <section id="scale" className="doc-section"><h2>Scale</h2><div role="list" aria-label="Spacing scale">{SPACINGS.map(([label, token, value, usage]) => <div key={token} className="spacing-row" role="listitem"><span className="spacing-token"><code>{token}</code></span><div className="spacing-bar-wrap"><div className="spacing-bar" style={{ width: `var(${token})` }} aria-hidden="true" /><span className="spacing-px">{value}</span></div><span>{label} — {usage}</span></div>)}</div></section>

      <section id="layout-rhythm" className="doc-section"><h2>Layout Rhythm</h2><div className="principles-grid">{RHYTHM.map(([title, range, body]) => <article key={title} className="principle-card"><h3>{title}</h3><code>{range}</code><p>{body}</p></article>)}</div></section>

      <section id="radius" className="doc-section"><h2>Border Radius</h2><div className="radius-grid">{RADII.map(([label, token, value, usage]) => <div key={token} className="radius-item"><div className="radius-item__box" style={{ borderRadius: `var(${token})` }} aria-hidden="true" /><strong>{label}</strong><code>{token}</code><span className="radius-item__value">{value}</span><small>{usage}</small></div>)}</div></section>

      <section id="usage" className="doc-section"><h2>Usage</h2><div className="code-block"><pre><code>{`.card {
  display: grid;
  gap: var(--sp-space-4);
  padding: var(--sp-space-6);
  border-radius: var(--sp-radius-lg);
}`}</code></pre></div><div className="principles-grid">{BEST_PRACTICES.map(([title, body]) => <article key={title} className="principle-card"><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    </>
  )
}
