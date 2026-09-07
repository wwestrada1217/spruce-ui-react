import { useState } from 'react'
import { TreeGridCombobox } from 'spruce-react'
import type { TreeGridComboboxColumn, TreeGridComboboxOption } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { DocsPackageBadge } from '../../components/DocsPackageBadge'

const columns: TreeGridComboboxColumn[] = [{ key: 'label', label: 'Name', width: 'minmax(180px, 2fr)' }, { key: 'kind', label: 'Kind' }, { key: 'owner', label: 'Owner' }]
const options: TreeGridComboboxOption[] = [{ value: 'src', label: 'src', kind: 'Folder', owner: 'Platform', expanded: true, children: [{ value: 'components', label: 'components', kind: 'Folder', owner: 'Design systems' }, { value: 'index', label: 'index.ts', kind: 'TypeScript', owner: 'Platform' }] }, { value: 'docs', label: 'docs', kind: 'Folder', owner: 'Content' }]

export function TreeGridComboboxPage() {
  const [value, setValue] = useState<string[]>([])
  return <div className="features-layout"><main className="features-main"><h1>Tree Grid Combobox</h1><p className="docs-desc">A hierarchical multi-column lookup using Spruce datagrid geometry, column tracks, and accessible resize handles.</p><DocsPackageBadge packageName="spruce-react" symbols={['TreeGridCombobox', 'TreeGridComboboxColumn', 'TreeGridComboboxOption']} />
    <section className="demo-section"><h2>Datagrid tree selection</h2><CodePreview code={'<TreeGridCombobox columns={columns} options={options} multiple resizableColumns expandAll />'}><div style={{ maxWidth: 620 }}><TreeGridCombobox columns={columns} options={options} multiple value={value} onChange={setValue} resizableColumns panelResizable expandAll showLines label="Repository items" /></div></CodePreview></section>
    <section className="demo-section"><h2>API</h2><div className="api-table-wrap"><table className="api-table"><thead><tr><th>Props</th><th>Purpose</th></tr></thead><tbody><tr><td><code>columns / options / source</code></td><td>Typed columns and local or remote hierarchy.</td></tr><tr><td><code>resizableColumns / panelResizable</code></td><td>Datagrid-style column and popup sizing.</td></tr><tr><td><code>value / multiple / cascadeCheck</code></td><td>Controlled selection with mixed parent state.</td></tr><tr><td><code>searchFields / renderRow / renderEmpty</code></td><td>Search and custom rows.</td></tr><tr><td><code>variant / label / errors</code></td><td>Shared field and validation contract.</td></tr></tbody></table></div></section>
  </main></div>
}
