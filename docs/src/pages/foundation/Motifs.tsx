const FAMILIES = [
  { name: 'Geometric', examples: 'Diamonds, facets, cubes, crosses, and steps' },
  { name: 'Circles and arcs', examples: 'Rings, wedges, arches, crescents, and capsules' },
  { name: 'Grids and lattices', examples: 'Squares, diamonds, combs, and blueprint fields' },
  { name: 'Dots and particles', examples: 'Lattices, halftones, graphs, and confetti' },
  { name: 'Lines and signals', examples: 'Rules, rays, waveforms, circuits, and spirals' },
  { name: 'Organic and terrain', examples: 'Blobs, ribbons, contours, foliage, and horizons' },
  { name: 'Frames and sights', examples: 'Brackets, open frames, corner arcs, and reticles' },
]

export function MotifsPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Motifs</h1>
        <p className="page-lead">
          Motifs are decorative depth, not content. Keep them behind the
          surface, low contrast, clipped to the owning radius, and hidden from
          assistive technology.
        </p>
      </div>

      <section className="doc-section">
        <h2>Families</h2>
        <table className="token-table" aria-label="Motif families">
          <thead><tr><th>Family</th><th>Examples</th></tr></thead>
          <tbody>
            {FAMILIES.map(item => (
              <tr key={item.name}><td>{item.name}</td><td>{item.examples}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="doc-section">
        <h2>Authoring rules</h2>
        <ul>
          <li>Set <code>aria-hidden=&quot;true&quot;</code> and <code>pointer-events: none</code>.</li>
          <li>Position the ornament absolutely so it never changes layout size.</li>
          <li>Clip it to the container’s radius and keep opacity subordinate to the content.</li>
          <li>Use token colors such as <code>--sp-primary</code> and <code>--sp-secondary</code>.</li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>CSS pattern</h2>
        <div className="code-block">
          <pre><code>{`.surface {
  position: relative;
  overflow: hidden;
  border-radius: var(--sp-radius-lg);
}

.surface::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.12;
  background: radial-gradient(circle, var(--sp-primary) 1px, transparent 1px);
  background-size: var(--sp-space-4) var(--sp-space-4);
}`}</code></pre>
        </div>
      </section>
    </>
  )
}
