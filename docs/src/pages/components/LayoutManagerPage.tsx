import { useState } from 'react'
import { LayoutDragHandle, LayoutManager, type LayoutItem } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

type Tile = LayoutItem<{ color: string }>

const CODE = `<LayoutManager
  items={items}
  onItemsChange={setItems}
  breakpoints={[{ name: 'compact', minWidth: 0, cols: 6 }]}
  renderItem={(item) => <LayoutDragHandle>{item.id}</LayoutDragHandle>}
/>`

const initialItems: Tile[] = [
  { id: 'Revenue', x: 0, y: 0, w: 4, h: 2, data: { color: 'var(--sp-primary-subtle)' } },
  { id: 'Activity', x: 4, y: 0, w: 4, h: 3, data: { color: 'var(--sp-success-subtle)' } },
  { id: 'Tasks', x: 8, y: 0, w: 4, h: 2, data: { color: 'var(--sp-warning-subtle)' } },
]

export function LayoutManagerPage() {
  const [items, setItems] = useState(initialItems)
  return <div className="features-layout"><div className="features-main">
    <h1>Layout Manager</h1>
    <p className="docs-desc">A controlled, responsive dashboard grid with collision-aware dragging, eight resize handles, persistence hooks, constraints, and keyboard controls.</p>
    <section id="basic" className="demo-section"><h2>Basic</h2><p className="section-desc">Drag a tile or resize it from any edge. The dashboard remains controlled by <code>items</code> and <code>onItemsChange</code>.</p><CodePreview code={CODE}><div style={{ minHeight: 300, padding: 8, border: '1px solid var(--sp-border-subtle)', borderRadius: 8 }}><LayoutManager items={items} onItemsChange={(next) => setItems(next as Tile[])} renderItem={(item) => <><LayoutDragHandle style={{ padding: 12, fontWeight: 600 }}>{item.id}</LayoutDragHandle><small style={{ padding: 12, display: 'block' }}>Use arrows to move; Alt + arrows resize</small></>} /></div></CodePreview></section>
    <section id="save" className="demo-section"><h2>Save and restore</h2><p className="section-desc">Call the imperative handle's <code>save</code>, <code>restore</code>, or <code>deleteItem</code> methods when a toolbar needs an explicit command.</p><pre className="code-block"><code>{`const saved = managerRef.current?.save()\nmanagerRef.current?.restore(saved ?? [])`}</code></pre></section>
    <section id="responsive" className="demo-section"><h2>Constraints and breakpoints</h2><p className="section-desc">Items support min/max dimensions, static/locked states, collision prevention, and breakpoint callbacks that select responsive column counts.</p></section>
    <section id="keyboard" className="demo-section"><h2>Keyboard</h2><p className="section-desc">Focus a tile and use Arrow keys to move, Shift + Arrow for larger steps, Alt + Arrow to resize, and Delete/Backspace when deletion is enabled.</p></section>
    <section id="api" className="demo-section"><h2>API</h2><div className="api-table-wrap"><table className="api-table"><thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead><tbody><tr><td><code>items</code></td><td><code>LayoutItem[]</code></td><td>required</td></tr><tr><td><code>cols / rowHeight / gap / margin</code></td><td><code>number</code></td><td><code>12 / 60 / 12 / 0</code></td></tr><tr><td><code>compactType</code></td><td><code>'vertical' | 'horizontal' | null</code></td><td><code>'vertical'</code></td></tr><tr><td><code>onItemsChange</code></td><td><code>(items) =&gt; void</code></td><td>—</td></tr><tr><td><code>renderItem</code></td><td><code>(item, index) =&gt; ReactNode</code></td><td>children</td></tr></tbody></table></div></section>
  </div><nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{['basic', 'save', 'responsive', 'keyboard', 'api'].map((id) => <li key={id}><a className="toc-link" href={`#${id}`}>{id}</a></li>)}</ul></nav></div>
}
