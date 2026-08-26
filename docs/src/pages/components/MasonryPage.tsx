import { Masonry, MasonryItem } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const CODE = `<Masonry columns={0} minColumnWidth={220} gap={4}>
  <MasonryItem>First card</MasonryItem>
  <MasonryItem>Second card</MasonryItem>
</Masonry>`

const cards = ['Editorial', 'Product notes', 'A longer card that demonstrates shortest-column placement', 'Release update', 'Gallery tile', 'Research']

export function MasonryPage() {
  return <div className="features-layout"><div className="features-main"><h1>Masonry</h1><p className="docs-desc">Responsive shortest-column layout for cards, image galleries, and content with different heights. Resize the viewport to change automatic columns.</p>
    <section id="basic" className="demo-section"><h2>Basic</h2><CodePreview code={CODE}><Masonry columns={0} minColumnWidth={180} gap={4}>{cards.map((card, index) => <MasonryItem key={card}><div style={{ minHeight: 70 + (index % 3) * 30, padding: 16, borderRadius: 8, background: 'var(--sp-surface-2)', border: '1px solid var(--sp-border-subtle)' }}>{card}</div></MasonryItem>)}</Masonry></CodePreview></section>
    <section id="gallery" className="demo-section"><h2>Image gallery</h2><p className="section-desc">Wrap images or media cards in <code>MasonryItem</code>; the observer measures their rendered height and keeps DOM order intact.</p></section>
    <section id="motion" className="demo-section"><h2>Animated reflow</h2><p className="section-desc">Reflow uses transform transitions and automatically honors <code>prefers-reduced-motion</code>.</p></section>
    <section id="api" className="demo-section"><h2>API</h2><div className="api-table-wrap"><table className="api-table"><thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead><tbody><tr><td><code>columns</code></td><td><code>number</code></td><td><code>3</code>; <code>0</code> auto</td></tr><tr><td><code>minColumnWidth</code></td><td><code>number</code></td><td><code>240</code></td></tr><tr><td><code>gap</code></td><td><code>number</code></td><td><code>16</code></td></tr></tbody></table></div></section>
  </div><nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{['basic', 'gallery', 'motion', 'api'].map((id) => <li key={id}><a className="toc-link" href={`#${id}`}>{id}</a></li>)}</ul></nav></div>
}
