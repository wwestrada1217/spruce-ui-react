import { useState } from 'react'
import { DragDrop, type DragDropEvent } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const CODE = `<DragDrop data={task} group="backlog" accepts={["backlog", "done"]}>
  {task.title}
</DragDrop>`

export function DragDropPage() {
  const [lastDrop, setLastDrop] = useState('Drop a task into the done zone')
  const onDrop = (event: DragDropEvent<string>) => setLastDrop(`${event.data ?? 'Task'} → ${event.position}`)
  return <div className="features-layout"><div className="features-main"><h1>Drag and Drop</h1><p className="docs-desc">Pointer-driven sortable and drop-zone behavior with compatible groups, handles, before/inside/after positions, live sorting, and accessible focus states.</p>
    <section id="sortable" className="demo-section"><h2>Sortable list</h2><CodePreview code={CODE}><div style={{ display: 'grid', gap: 8 }}>{['Design', 'Build', 'Review'].map((task) => <DragDrop key={task} data={task} group="tasks" accepts="*" liveSort style={{ padding: 12, border: '1px solid var(--sp-border-subtle)', borderRadius: 6 }}>{task}</DragDrop>)}</div></CodePreview></section>
    <section id="zones" className="demo-section"><h2>Drop zones and handles</h2><p className="section-desc">The target receives a typed callback with <code>before</code>, <code>inside</code>, or <code>after</code>. Set <code>dragHandle</code> to a selector when only a child handle should start a drag.</p><div style={{ minHeight: 80, padding: 20, border: '2px dashed var(--sp-border-subtle)', borderRadius: 8 }}><DragDrop data="Task" group="backlog" accepts={['backlog']} onDropped={onDrop}>Done zone</DragDrop><p aria-live="polite">{lastDrop}</p></div></section>
    <section id="horizontal" className="demo-section"><h2>Horizontal sort and preview</h2><p className="section-desc">Use <code>axis="horizontal"</code>, <code>effectAllowed</code>, <code>dropEffect</code>, <code>transferText</code>, and <code>previewTilt</code> to tune the interaction.</p></section>
    <section id="api" className="demo-section"><h2>API</h2><div className="api-table-wrap"><table className="api-table"><thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead><tbody><tr><td><code>group / accepts</code></td><td><code>string / '*' | string[]</code></td><td><code>'default' / '*'</code></td></tr><tr><td><code>axis</code></td><td><code>'vertical' | 'horizontal'</code></td><td><code>'vertical'</code></td></tr><tr><td><code>onDropped</code></td><td><code>(event) =&gt; void</code></td><td>—</td></tr></tbody></table></div></section>
  </div><nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{['sortable', 'zones', 'horizontal', 'api'].map((id) => <li key={id}><a className="toc-link" href={`#${id}`}>{id}</a></li>)}</ul></nav></div>
}
