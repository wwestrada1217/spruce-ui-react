import { useRef, useState } from 'react'
import { Button, DockManager, DockPanel, type DockLayout, type DockManagerHandle } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const CODE = `<DockManager storageKey="docs-dock-layout">
  <DockPanel panelId="overview" title="Overview">...</DockPanel>
  <DockPanel panelId="details" title="Details">...</DockPanel>
</DockManager>`

const initialLayout: DockLayout = { root: { type: 'split', id: 'docs-root', direction: 'h', children: [{ type: 'leaf', id: 'overview-leaf', panelId: 'overview' }, { type: 'leaf', id: 'details-leaf', panelId: 'details' }], sizes: [50, 50] }, floats: [] }

export function DockManagerPage() {
  const [layout, setLayout] = useState(initialLayout)
  const manager = useRef<DockManagerHandle>(null)
  const [serialized, setSerialized] = useState('')
  return <div className="features-layout"><div className="features-main"><h1>Dock Manager</h1><p className="docs-desc">Typed tree-based docking with splitters, tab and document nodes, floating panels, auto-hide strips, controlled layout changes, and JSON persistence.</p>
    <section id="basic" className="demo-section"><h2>Basic and custom layout</h2><CodePreview code={CODE}><div style={{ height: 300 }}><DockManager layout={layout} onLayoutChange={setLayout} ref={manager}><DockPanel panelId="overview" title="Overview"><p>Overview content</p></DockPanel><DockPanel panelId="details" title="Details"><p>Details content</p></DockPanel></DockManager></div></CodePreview></section>
    <section id="tabs" className="demo-section"><h2>Tabs and documents</h2><p className="section-desc">Use <code>tab</code> and <code>document</code> nodes in <code>DockLayout</code>; <code>tabsAtBottom</code> changes tab placement and empty document wells can remain persistent.</p></section>
    <section id="persistence" className="demo-section"><h2>Persistence and import/export</h2><Button size="sm" onClick={() => setSerialized(manager.current?.exportLayout() ?? '')}>Export JSON</Button> <Button size="sm" variant="secondary" onClick={() => manager.current?.importLayout(serialized)}>Import JSON</Button><textarea aria-label="Dock layout JSON" value={serialized} onChange={(event) => setSerialized(event.target.value)} style={{ display: 'block', width: '100%', minHeight: 80, marginTop: 12 }} /></section>
    <section id="autohide" className="demo-section"><h2>Drag/drop and auto-hide</h2><p className="section-desc">Panel headers are native drag sources. Call <code>autoHidePanel</code> from a command to move a panel to a logical edge strip; clicking a strip tab opens a peek overlay and Escape/outside click closes it.</p></section>
    <section id="api" className="demo-section"><h2>API</h2><div className="api-table-wrap"><table className="api-table"><thead><tr><th>Surface</th><th>Key API</th></tr></thead><tbody><tr><td><code>DockManager</code></td><td><code>layout, storageKey, thinSplitters, dense, tabsAtBottom</code></td></tr><tr><td><code>DockPanel</code></td><td><code>panelId, title, icon, closeable, allowedDockZones, showHeader, badge</code></td></tr><tr><td>Handle</td><td><code>getLayout, setLayout, resetLayout, exportLayout, importLayout, activatePanel</code></td></tr></tbody></table></div></section>
  </div><nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{['basic', 'tabs', 'persistence', 'autohide', 'api'].map((id) => <li key={id}><a className="toc-link" href={`#${id}`}>{id}</a></li>)}</ul></nav></div>
}
