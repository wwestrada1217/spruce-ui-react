import { useState } from 'react'
import { Alert, Card, Motif, MotifProvider, Panel, CIRCLE_MOTIFS, DOT_MOTIFS, FRAME_MOTIFS, GEOMETRIC_MOTIFS, GRID_MOTIFS, LINE_MOTIFS, ORGANIC_MOTIFS, SP_BUILT_IN_MOTIFS } from 'spruce-react'
import type { SpBuiltInMotifDefinition, SpMotifName, SpMotifPosition } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { FoundationPageShell } from '../../components/FoundationPageShell'

interface MotifFamily { id: string; label: string; blurb: string; motifs: readonly SpBuiltInMotifDefinition[] }

const titleCase = (name: string) => name.replace(/-/g, ' ').replace(/^./, character => character.toUpperCase())

const FAMILIES: readonly MotifFamily[] = [
  { id: 'geometric', label: 'Geometric', blurb: 'Angular and block forms — diamonds, facets, cubes, crosses, steps.', motifs: GEOMETRIC_MOTIFS },
  { id: 'circles', label: 'Circles, arcs & capsules', blurb: 'Rings, wedges, arches, crescents, and stadium shapes.', motifs: CIRCLE_MOTIFS },
  { id: 'grids', label: 'Grids & lattices', blurb: 'Even fields — squares, diamonds, combs, blueprints, warped weaves.', motifs: GRID_MOTIFS },
  { id: 'dots', label: 'Dots, nodes & particles', blurb: 'Texture rather than shape: lattices, halftones, graphs, confetti.', motifs: DOT_MOTIFS },
  { id: 'lines', label: 'Lines, rays & signals', blurb: 'Straight rules, radiating fans, waveforms, circuits, spirals.', motifs: LINE_MOTIFS },
  { id: 'organic', label: 'Organic & terrain', blurb: 'Blobs, ribbons, contours, foliage, horizons, clouds.', motifs: ORGANIC_MOTIFS },
  { id: 'frames', label: 'Frames, corners & sights', blurb: 'Brackets, open frames, corner arcs, and reticles.', motifs: FRAME_MOTIFS },
]

const BANNER_SAMPLE: readonly SpMotifName[] = ['overlapping-diamonds', 'arc-orbit', 'concentric-circles', 'organic-blob', 'dot-grid', 'diagonal-lines', 'hexagon-pattern', 'flowing-ribbons', 'sparkle-cluster', 'topographic-contours', 'radar-arcs', 'corner-arcs']
const BANNER_VARIANTS = ['info', 'success', 'warning', 'danger'] as const
const BANNER_COPY = ['The reporting service is read-only while maintenance runs.', 'All records were transferred with no conflicts.', 'Storage is approaching the workspace limit.', 'Review the deployment log before trying again.']
const POSITIONS: readonly SpMotifPosition[] = ['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right']
const OPACITY_STEPS = [0.05, 0.1, 0.15] as const
const OPACITY_NOTES: Record<(typeof OPACITY_STEPS)[number], string> = { 0.05: 'Quietest; use when the message is the strongest layer.', 0.1: 'Default; a balanced atmospheric treatment.', 0.15: 'Upper limit; inspect text contrast before going higher.' }
const CUSTOM_SVG = '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="50,8 88,30 88,70 50,92 12,70 12,30"/><polygon points="50,26 72,39 72,61 50,74 28,61 28,39"/><line x1="50" y1="8" x2="50" y2="26"/><line x1="88" y1="70" x2="72" y2="61"/><line x1="12" y1="70" x2="28" y2="61"/></svg>'

const OVERVIEW_CODE = `<div className="docs-stack">
  <Alert variant="info" title="Scheduled maintenance" backgroundMotif="overlapping-diamonds">
    The reporting service is read-only during maintenance.
  </Alert>
  <Alert variant="success" title="Migration complete" backgroundMotif="arc-orbit">
    All records were transferred with no conflicts.
  </Alert>
</div>`
const BANNERS_CODE = `<div className="motif-banner-grid">
  <Alert variant="info" title="Scheduled maintenance" backgroundMotif="overlapping-diamonds">
    The reporting service is read-only during maintenance.
  </Alert>
  <Alert variant="success" title="Migration complete" backgroundMotif="arc-orbit">
    All records were transferred with no conflicts.
  </Alert>
</div>`
const POSITION_CODE = `<div className="motif-position-grid">
  <Panel variant="filled" backgroundMotif="rounded-blocks" motifPosition="center">
    <code>center</code>
  </Panel>
</div>`
const SIZE_CODE = `<div className="motif-trio">
  <Card backgroundMotif="concentric-circles" motifSize={90}>Compact</Card>
  <Card backgroundMotif="concentric-circles" motifSize={160}>Default</Card>
  <Card backgroundMotif="concentric-circles" motifSize={280}>Hero</Card>
</div>`
const OPACITY_CODE = `<Card backgroundMotif="hexagon-pattern" motifOpacity={0.1} motifSize={150}>
  Default opacity
</Card>`
const APPEARANCE_CODE = `<Card backgroundMotif="hexagon-pattern" motifAppearance="outlined">
  Outlined
</Card>
<Card backgroundMotif="hexagon-pattern" motifAppearance="filled">
  Filled
</Card>`
const CROPPING_CODE = `<Alert
  variant="warning"
  title="Quota at 92%"
  backgroundMotif="organic-blob"
  motifPosition="center-right"
  motifSize={220}
  motifOffsetX={60}
  motifRotation={-18}
>
  Storage is nearly exhausted.
</Alert>`
const ANY_CONTAINER_CODE = `<section className="motif-hero">
  <Motif motif="organic-blob" position="bottom-right" size={320} opacity={0.09} />
  <h3>Everything reconciled</h3>
</section>`
const SOURCES_CODE = `<Card backgroundMotif="dot-grid">Registered motif</Card>
<Card motifIcon="cloud">Icon source</Card>
<Card motifSvg={customSvg}>Raw SVG source</Card>
<Motif position="center-right"><CustomSvg /></Motif>`
const EXTENDING_CODE = `const customMotif = {
  name: 'docs-spark',
  appearance: 'outlined',
  svg: '<svg viewBox="0 0 100 100">...</svg>',
}

<MotifProvider motifs={[customMotif]}>
  <Card backgroundMotif="docs-spark">...</Card>
</MotifProvider>`

function MotifCard({ motif, title, body, size = 160, opacity = 0.12, appearance }: { motif: SpMotifName; title: string; body: string; size?: number; opacity?: number; appearance?: 'auto' | 'outlined' | 'filled' }) {
  return <Card variant="filled" backgroundMotif={motif} motifPosition="center-right" motifSize={size} motifOpacity={opacity} motifAppearance={appearance} style={{ minHeight: 120 }}><p className="motif-card-title">{title}</p><p className="motif-card-body">{body}</p></Card>
}

export function MotifsPage() {
  const [selectedMotif, setSelectedMotif] = useState<SpMotifName>(SP_BUILT_IN_MOTIFS[0]?.name as SpMotifName)

  return <FoundationPageShell variant="motifs" title="Background motifs" description={`A decorative SVG ornament painted behind the content of a banner, card, panel, or any other container. Spruce ships ${SP_BUILT_IN_MOTIFS.length} reusable motifs across seven families, and the collection is open — register your own and use it the same way.`}>
    <div className="page-header"><p className="page-tag">Foundation</p><h1>Background motifs</h1><p className="page-lead">A decorative SVG ornament painted behind the content of a banner, card, panel, or any other container. Spruce ships {SP_BUILT_IN_MOTIFS.length} reusable motifs across seven families; motifs never change layout, interaction, or the accessible name of their host.</p></div>

    <section id="overview" className="doc-section"><h2>Overview</h2><p className="section-desc">Set <code>backgroundMotif</code> on a container and it gains a quiet geometric backdrop. The ornament is decorative in the strict sense: it is <code>aria-hidden</code>, cannot be clicked or focused, is absolutely positioned so it never changes the container's size, and is clipped to the container's own border radius.</p><CodePreview code={OVERVIEW_CODE} language="typescript"><div className="docs-stack"><Alert variant="info" title="Scheduled maintenance" backgroundMotif="overlapping-diamonds">The reporting service is read-only during maintenance.</Alert><Alert variant="success" title="Migration complete" backgroundMotif="arc-orbit" motifPosition="center-right" motifSize={180} motifOpacity={0.1}>All records were transferred with no conflicts.</Alert></div></CodePreview></section>

    <section id="library" className="doc-section"><h2>The motif library</h2><p className="section-desc">{SP_BUILT_IN_MOTIFS.length} motifs ship with the design system, in seven families. They are shown large here so the artwork is legible; in production they sit at roughly a tenth of this contrast.</p><p className="section-desc"><strong>Pick any motif</strong> to update the live host below. Every family is sourced from the same exported collection used by the React motif registry.</p>{FAMILIES.map(family => <div key={family.id} className="motif-family"><h3 className="motif-family__title">{family.label}<span className="motif-family__count">{family.motifs.length}</span></h3><p className="section-desc">{family.blurb}</p><div className="motif-catalog">{family.motifs.map(motif => <button key={motif.name} type="button" className={`motif-swatch${selectedMotif === motif.name ? ' motif-swatch--selected' : ''}`} aria-pressed={selectedMotif === motif.name} onClick={() => setSelectedMotif(motif.name as SpMotifName)}><span className="motif-swatch__art"><Motif motif={motif.name as SpMotifName} position="center" size={86} opacity={0.55} /></span><span className="motif-swatch__label">{titleCase(motif.name)}</span><code className="motif-swatch__name">{motif.name}</code></button>)}</div></div>)}<CodePreview code={`<Card backgroundMotif="${selectedMotif}" motifPosition="center-right">\n  Selected motif\n</Card>`} language="typescript"><MotifCard motif={selectedMotif} title="Selected motif" body="Choose any swatch above to update this live host." /></CodePreview></section>

    <section id="banners" className="doc-section"><h2>In notification banners</h2><p className="section-desc">A dozen of them at production settings, two to a row. On a compact banner keep the ornament to roughly 15–35% of the panel width so it reads as depth rather than as an illustration.</p><CodePreview code={BANNERS_CODE} language="typescript"><div className="motif-banner-grid">{BANNER_SAMPLE.slice(0, 6).map((name, index) => <Alert key={name} variant={BANNER_VARIANTS[index % BANNER_VARIANTS.length]} title={titleCase(name)} backgroundMotif={name} motifSize={150}>{BANNER_COPY[index % BANNER_COPY.length]}</Alert>)}</div></CodePreview></section>

    <section id="position" className="doc-section"><h2>Position</h2><p className="section-desc">Nine anchors place the ornament against an edge, a corner, or the center. These are physical anchors — <code>center-right</code> means the right edge in both LTR and RTL.</p><CodePreview code={POSITION_CODE} language="typescript"><div className="motif-position-grid">{POSITIONS.map(position => <Panel key={position} variant="filled" backgroundMotif="rounded-blocks" motifPosition={position} motifSize={72} motifOpacity={0.22}><code className="motif-position-label">{position}</code></Panel>)}</div></CodePreview></section>

    <section id="size" className="doc-section"><h2>Size</h2><p className="section-desc"><code>motifSize</code> takes any CSS length; a plain number is read as pixels. The ornament is always square and scales cleanly from about 80px to well past 300px.</p><CodePreview code={SIZE_CODE} language="typescript"><div className="motif-trio"><MotifCard motif="concentric-circles" title="Compact" body="90px — a badge-scale accent for tight rows." size={90} /><MotifCard motif="concentric-circles" title="Default" body="160px — the balance point for banners and cards." /><MotifCard motif="concentric-circles" title="Hero" body="280px — deliberately oversized, cropped by the edge." size={280} /></div></CodePreview></section>

    <section id="opacity" className="doc-section"><h2>Opacity</h2><p className="section-desc">The default is <code>0.1</code>. Stay inside <code>0.05</code>–<code>0.15</code>: below that the ornament disappears, above it starts competing with the message and eating into text contrast.</p><CodePreview code={OPACITY_CODE} language="typescript"><div className="motif-trio">{OPACITY_STEPS.map(value => <MotifCard key={value} motif="hexagon-pattern" title={String(value)} body={OPACITY_NOTES[value]} size={150} opacity={value} />)}</div></CodePreview></section>

    <section id="appearance" className="doc-section"><h2>Filled and outlined</h2><p className="section-desc">Each motif declares the appearance it reads best in, which is what you get by default. Override it with <code>motifAppearance</code>. Line-based motifs stay strokes in both modes.</p><CodePreview code={APPEARANCE_CODE} language="typescript"><div className="motif-pair"><MotifCard motif="hexagon-pattern" title="Outlined" body="Hairline strokes. Lighter, more technical." appearance="outlined" /><MotifCard motif="hexagon-pattern" title="Filled" body="Solid shapes. Softer, reads as a wash." appearance="filled" /></div></CodePreview></section>

    <section id="cropping" className="doc-section"><h2>Rotation and cropped compositions</h2><p className="section-desc"><code>motifRotation</code>, <code>motifOffsetX</code>, and <code>motifOffsetY</code> let the ornament run off the edge on purpose. Anything past the container is clipped by the container's own radius.</p><CodePreview code={CROPPING_CODE} language="typescript"><div className="docs-stack"><Alert variant="warning" title="Quota at 92%" backgroundMotif="organic-blob" motifPosition="center-right" motifSize={220} motifOffsetX={60} motifRotation={-18} motifOpacity={0.12}>Storage on the primary volume is nearly exhausted. Archive or expand before Friday.</Alert><Alert variant="danger" title="Three checks failed" backgroundMotif="diagonal-lines" motifPosition="center-left" motifSize={200} motifOffsetX={-70} motifOpacity={0.13}>The deployment was rolled back automatically. Review the pipeline log.</Alert></div></CodePreview></section>

    <section id="themes" className="doc-section"><h2>Light and dark</h2><p className="section-desc">The ornament paints in <code>currentColor</code>, so it takes whatever color the container already uses. Nothing is re-tuned per theme; the same motif definition adapts with its host.</p><CodePreview code={`<div data-theme="dark">\n  <Card backgroundMotif="abstract-waves">Read-only window</Card>\n</div>`} language="typescript"><div className="motif-pair"><div className="motif-theme-surface" data-theme="light"><p className="motif-theme-label">Light</p><div className="motif-theme-tile"><Motif motif="abstract-waves" position="center-right" size={170} /><p className="motif-card-title">Read-only window</p><p className="motif-card-body">Edits are paused while the index rebuilds.</p></div></div><div className="motif-theme-surface" data-theme="dark"><p className="motif-theme-label">Dark</p><div className="motif-theme-tile"><Motif motif="abstract-waves" position="center-right" size={170} /><p className="motif-card-title">Read-only window</p><p className="motif-card-body">Edits are paused while the index rebuilds.</p></div></div></div></CodePreview></section>

    <section id="any-container" className="doc-section"><h2>Any container</h2><p className="section-desc"><code>Card</code>, <code>Panel</code>, and <code>Alert</code> take motif inputs directly. For everything else, place <code>Motif</code> inside a positioned, clipped host; the ornament does not alter the host's semantics or layout.</p><CodePreview code={ANY_CONTAINER_CODE} language="typescript"><section className="motif-hero"><Motif motif="organic-blob" position="bottom-right" size={320} opacity={0.09} rotation={12} /><p className="motif-hero__eyebrow">Q3 close</p><h3 className="motif-hero__title">Everything reconciled</h3><p className="motif-hero__body">Ledger, subledger, and bank statements agree to the cent. Nothing needs your attention before the audit window opens.</p></section></CodePreview></section>

    <section id="responsive" className="doc-section"><h2>Responsive behavior</h2><p className="section-desc">The layer tracks the container at every size — it is anchored to the container's edges, not a fixed coordinate. Drag the handle in the corner below to resize the panel and watch the ornament stay put and re-crop.</p><CodePreview code={`<div className="motif-resizable">\n  <Alert backgroundMotif="concentric-circles" motifSize={190}>Resize me</Alert>\n</div>`} language="typescript"><div className="motif-resizable"><Alert variant="success" title="Resize me" backgroundMotif="concentric-circles" motifSize={190} motifOpacity={0.13}>The ornament holds its anchor and re-crops as the panel narrows.</Alert></div></CodePreview></section>

    <section id="sources" className="doc-section"><h2>Four sources</h2><p className="section-desc">A registered motif is one option. You can also point at a design-system icon, hand in raw SVG, or project your own content into <code>Motif</code> directly. Raw SVG wins, then the icon, then the motif name.</p><CodePreview code={SOURCES_CODE} language="typescript"><div className="motif-quad"><MotifCard motif="dot-grid" title="Registered motif" body={'backgroundMotif="dot-grid"'} /><Card variant="filled" motifIcon="cloud" motifSize={140} motifOpacity={0.16} style={{ minHeight: 120 }}><p className="motif-card-title">Icon</p><p className="motif-card-body"><code>{'motifIcon="cloud"'}</code></p></Card><Card variant="filled" motifSvg={CUSTOM_SVG} motifSize={140} motifOpacity={0.16} style={{ minHeight: 120 }}><p className="motif-card-title">Raw SVG</p><p className="motif-card-body"><code>{'motifSvg={customSvg}'}</code></p></Card><div className="motif-slot-demo"><Motif position="center-right" size={130} opacity={0.16}><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="50" cy="50" r="34" /><circle cx="50" cy="50" r="18" /><path d="M50 4v92M4 50h92" /></svg></Motif><p className="motif-card-title">Projected content</p><p className="motif-card-body">A <code>Motif</code> with its own SVG markup.</p></div></div></CodePreview></section>

    <section id="extending" className="doc-section"><h2>Adding your own motifs</h2><p className="section-desc">The collection is a registry, not a fixed list. Register a motif once at bootstrap and every container can name it without component changes.</p><CodePreview codeOnly language="typescript" code={EXTENDING_CODE} /><CodePreview code={EXTENDING_CODE} language="typescript"><MotifProvider motifs={[{ name: 'docs-spark', appearance: 'outlined', svg: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><path d="M50 4 58 42 96 50 58 58 50 96 42 58 4 50 42 42Z"/></svg>' }]}><Card variant="ghost" style={{ minHeight: 120, position: 'relative', isolation: 'isolate', overflow: 'hidden' }}><Motif motif="docs-spark" position="center" size={96} opacity={0.15} /><strong>Registered custom motif</strong></Card></MotifProvider></CodePreview><ul className="motif-rules"><li>Draw on a <code>0 0 100 100</code> viewBox so the motif scales to any size.</li><li>Paint with <code>currentColor</code>; the layer supplies a hairline that stays constant across sizes.</li><li>Stick to basic SVG shapes. No raster images, text, or branding.</li><li>Use low opacity so content remains the strongest visual layer.</li></ul></section>

    <section id="accessibility" className="doc-section"><h2>Accessibility</h2><ul className="motif-rules"><li>The layer is <code>aria-hidden="true"</code> and carries no accessible name.</li><li><code>pointer-events: none</code> keeps it out of hit-testing so it cannot intercept content clicks.</li><li>It is not focusable, takes no tab stop, and sits below child content so focus rings remain visible.</li><li>Keep opacity inside <code>0.05</code>–<code>0.15</code> and re-check contrast if you go higher.</li><li>The layer is hidden entirely in forced-colors mode.</li></ul></section>

    <section id="api" className="doc-section"><h2>API</h2><h3>Container inputs</h3><p className="section-desc">These inputs are shared by <code>Alert</code>, <code>Card</code>, <code>Panel</code>, and <code>Motif</code> (where the prop is named directly rather than <code>backgroundMotif</code>).</p><div className="api-table-wrap"><table className="api-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>backgroundMotif</code></td><td><code>SpMotifName</code></td><td>undefined</td><td>Name of a registered motif.</td></tr><tr><td><code>motifIcon</code></td><td>string</td><td>undefined</td><td>Use a design-system icon as the ornament.</td></tr><tr><td><code>motifSvg</code></td><td>string</td><td>undefined</td><td>Use raw SVG markup as the ornament.</td></tr><tr><td><code>motifPosition</code></td><td><code>SpMotifPosition</code></td><td>center-right</td><td>Physical anchor: nine corner, edge, and center positions.</td></tr><tr><td><code>motifSize</code></td><td>number | string</td><td>160</td><td>Any CSS length; a number is read as pixels.</td></tr><tr><td><code>motifOpacity</code></td><td>number</td><td>0.1</td><td>Keep inside 0.05–0.15.</td></tr><tr><td><code>motifRotation</code></td><td>number</td><td>0</td><td>Degrees clockwise around the motif center.</td></tr><tr><td><code>motifOffsetX / motifOffsetY</code></td><td>number | string</td><td>0</td><td>Nudge the motif from its anchor.</td></tr><tr><td><code>motifAppearance</code></td><td>auto | outlined | filled</td><td>auto</td><td>Use the motif's declared appearance when auto.</td></tr><tr><td><code>motifColor</code></td><td>string</td><td>undefined</td><td>Any CSS color; defaults to inherited currentColor.</td></tr><tr><td><code>decorativeBackground</code></td><td><code>SpDecorativeBackground</code></td><td>undefined</td><td>Object form of the motif options.</td></tr></tbody></table></div><h3>CSS custom properties</h3><div className="api-table-wrap"><table className="api-table"><thead><tr><th>Property</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>--sp-motif-color</code></td><td>currentColor</td><td>Ornament color.</td></tr><tr><td><code>--sp-motif-stroke-width</code></td><td>1.5px</td><td>Hairline weight held constant at every rendered size.</td></tr><tr><td><code>--sp-motif-dark-boost</code></td><td>1.3</td><td>Opacity multiplier applied in dark themes.</td></tr></tbody></table></div><h3>Exports</h3><p className="section-desc">Each family array and every individual <code>motif*</code> definition is exported from <code>spruce-react</code> for direct registration or tree-shaken use.</p><CodePreview codeOnly language="typescript" code={`import {\n  CIRCLE_MOTIFS, DOT_MOTIFS, FRAME_MOTIFS,\n  GEOMETRIC_MOTIFS, GRID_MOTIFS, LINE_MOTIFS, ORGANIC_MOTIFS,\n  motifOverlappingDiamonds, motifDotGrid,\n  SP_BUILT_IN_MOTIFS, Motif, MotifProvider,\n} from 'spruce-react'`} /></section>
  </FoundationPageShell>
}
