import { Card, Motif, MotifProvider, Panel, SP_BUILT_IN_MOTIFS } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const FAMILIES = [
  { name: 'Geometric', count: 24, examples: 'Diamonds, facets, cubes, crosses, and steps' },
  { name: 'Circles and arcs', count: 26, examples: 'Rings, wedges, arches, crescents, and capsules' },
  { name: 'Grids and lattices', count: 12, examples: 'Squares, diamonds, combs, and blueprint fields' },
  { name: 'Dots and particles', count: 11, examples: 'Lattices, halftones, graphs, and confetti' },
  { name: 'Lines and signals', count: 15, examples: 'Rules, rays, waveforms, circuits, and spirals' },
  { name: 'Organic and terrain', count: 21, examples: 'Blobs, ribbons, contours, foliage, and horizons' },
  { name: 'Frames and sights', count: 8, examples: 'Brackets, open frames, corner arcs, and reticles' },
]

const MOTIF_CODE = `<Card
  chrome="filled"
  backgroundMotif="concentric-circles"
  motifPosition="center-right"
  motifAppearance="outlined"
>
  <h3>Decorative depth</h3>
  <p>The motif never changes layout or content semantics.</p>
</Card>`

const CUSTOM_MOTIF = {
  name: 'docs-spark',
  appearance: 'outlined' as const,
  svg: '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><path data-motif-shape d="M50 4 58 42 96 50 58 58 50 96 42 58 4 50 42 42Z"/></svg>',
}

export function MotifsPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Motifs</h1>
        <p className="page-lead">
          Motifs are decorative depth behind a surface. They are typed, token-colored,
          clipped to the owner, and hidden from assistive technology.
        </p>
      </div>

      <section className="doc-section">
        <h2>Built-in library</h2>
        <p>
          Spruce ships {SP_BUILT_IN_MOTIFS.length} reusable motifs across seven families.
          The <code>backgroundMotif</code> input is physical, so <code>center-right</code>
          remains the right edge in RTL layouts.
        </p>
        <table className="token-table" aria-label="Motif families">
          <thead><tr><th>Family</th><th>Count</th><th>Examples</th></tr></thead>
          <tbody>
            {FAMILIES.map((item) => (
              <tr key={item.name}><td>{item.name}</td><td>{item.count}</td><td>{item.examples}</td></tr>
            ))}
          </tbody>
        </table>
        <div className="docs-grid" style={{ marginTop: 'var(--sp-space-4)' }}>
          {SP_BUILT_IN_MOTIFS.slice(0, 12).map((definition) => (
            <Card
              key={definition.name}
              padding="sm"
              chrome="outlined"
              backgroundMotif={definition.name}
              motifSize={96}
              motifOpacity={0.12}
              style={{ minHeight: 92 }}
            >
              <code style={{ fontSize: 'var(--sp-text-xs)' }}>{definition.name}</code>
            </Card>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2>Container usage</h2>
        <CodePreview code={MOTIF_CODE}>
          <Card
            chrome="filled"
            backgroundMotif="concentric-circles"
            motifPosition="center-right"
            motifAppearance="outlined"
            style={{ maxWidth: 420, minHeight: 140 }}
          >
            <h3 style={{ margin: 0 }}>Decorative depth</h3>
            <p style={{ marginBottom: 0 }}>The ornament sits behind content and never changes layout.</p>
          </Card>
        </CodePreview>
        <p>
          <code>Card</code>, <code>Panel</code>, and <code>Alert</code> expose the flat
          motif inputs. Use <code>&lt;Motif&gt;</code> directly for another positioned,
          isolated host; the host owns <code>position: relative</code>, clipping, and spacing.
        </p>
      </section>

      <section className="doc-section">
        <h2>Controls</h2>
        <div className="docs-grid">
          <Panel chrome="outlined" backgroundMotif="dot-grid" motifPosition="top-left" motifSize={130} motifOpacity={0.08}>
            <strong>Position</strong><br />Nine physical anchors; no automatic mirroring in RTL.
          </Panel>
          <Panel chrome="outlined" backgroundMotif="abstract-waves" motifAppearance="filled" motifRotation={-12} motifOffsetX={-14}>
            <strong>Appearance</strong><br />Outlined, filled, rotation, size, offsets, and opacity are token-safe.
          </Panel>
        </div>
        <ul>
          <li><code>motifSize</code> accepts a number in pixels or any CSS length.</li>
          <li><code>motifOpacity</code> defaults to <code>0.1</code>; dark mode boosts it through a token.</li>
          <li>Raw SVG wins over an icon, which wins over a named motif. All sources are decorative.</li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>Custom definitions</h2>
        <p>
          React uses a controlled provider for trusted custom SVG definitions. A custom name
          overrides a built-in name only within that provider subtree.
        </p>
        <CodePreview code={`<MotifProvider motifs={[customMotif]}>
  <Card><Motif motif="docs-spark" />...</Card>
</MotifProvider>`}>
          <MotifProvider motifs={[CUSTOM_MOTIF]}>
            <Card chrome="ghost" style={{ minHeight: 120, position: 'relative', isolation: 'isolate', overflow: 'hidden' }}>
              <Motif motif="docs-spark" position="center" size={96} opacity={0.15} />
              <strong>Registered custom motif</strong>
            </Card>
          </MotifProvider>
        </CodePreview>
      </section>

      <section className="doc-section">
        <h2>Accessibility and themes</h2>
        <ul>
          <li>The Motif root is <code>aria-hidden="true"</code> and <code>pointer-events: none</code>.</li>
          <li>Motifs never receive focus, announce text, or alter a component’s accessible name.</li>
          <li>Forced-colors mode hides motifs; light and dark themes use the same semantic color tokens.</li>
          <li>Use a low-opacity token color with sufficient contrast for the actual foreground content.</li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>API</h2>
        <div className="api-table-wrap">
          <table className="api-table">
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
            <tbody>
              <tr><td><code>motif</code></td><td><code>SpMotifName</code></td><td>—</td></tr>
              <tr><td><code>icon</code></td><td><code>string</code></td><td>—</td></tr>
              <tr><td><code>svg</code></td><td><code>string</code></td><td>—</td></tr>
              <tr><td><code>position</code></td><td><code>top-left | ... | bottom-right</code></td><td><code>center-right</code></td></tr>
              <tr><td><code>size</code></td><td><code>number | string</code></td><td><code>160</code></td></tr>
              <tr><td><code>opacity</code></td><td><code>number</code></td><td><code>0.1</code></td></tr>
              <tr><td><code>appearance</code></td><td><code>auto | outlined | filled</code></td><td><code>auto</code></td></tr>
              <tr><td><code>rotation / offsetX / offsetY / color</code></td><td>number, CSS length, or string</td><td>—</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Shared hosts also accept <code>chrome</code>, <code>radius</code>, <code>border</code>,
          and where applicable <code>elevation</code>; see the Card and Panel APIs.
        </p>
      </section>
    </>
  )
}
