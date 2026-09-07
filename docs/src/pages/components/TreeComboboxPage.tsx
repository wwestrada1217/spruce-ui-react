import { useState } from 'react'
import { TreeCombobox } from 'spruce-react'
import type { TreeComboboxNode } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { DocsPackageBadge } from '../../components/DocsPackageBadge'

const nodes: TreeComboboxNode[] = [
  { value: 'eng', label: 'Engineering', icon: 'folder', children: [{ value: 'web', label: 'Web platform' }, { value: 'mobile', label: 'Mobile' }] },
  { value: 'design', label: 'Design', icon: 'folder', children: [{ value: 'product', label: 'Product design' }, { value: 'research', label: 'Research', badge: '4' }] },
]

export function TreeComboboxPage() {
  const [value, setValue] = useState<string[]>(['web'])
  return <div className="features-layout"><main className="features-main"><h1>Tree Combobox</h1><p className="docs-desc">A searchable hierarchical picker with single and cascade multi-selection.</p><DocsPackageBadge packageName="spruce-react" symbols={['TreeCombobox', 'TreeComboboxNode']} />
    <section className="demo-section"><h2>Multiple selection</h2><CodePreview code={'<TreeCombobox nodes={nodes} multiple value={value} onChange={setValue} expandAll showLines />'}><div style={{ maxWidth: 480 }}><TreeCombobox nodes={nodes} multiple value={value} onChange={setValue} expandAll showLines label="Teams" required /></div></CodePreview></section>
    <section className="demo-section"><h2>Custom row and empty state</h2><CodePreview code={'<TreeCombobox nodes={nodes} renderOption={({ node }) => <strong>{node.label}</strong>} />'}><div style={{ maxWidth: 480 }}><TreeCombobox nodes={nodes} variant="filled" label="Organization" searchFields={['label']} renderOption={({ node, selected }) => <span>{selected ? '✓ ' : ''}{node.label}</span>} renderEmpty={(query) => <>No team matches “{query}”</>} /></div></CodePreview></section>
    <section className="demo-section"><h2>API</h2><div className="api-table-wrap"><table className="api-table"><thead><tr><th>Props</th><th>Purpose</th></tr></thead><tbody><tr><td><code>nodes / source</code></td><td>Local tree, DataSource, or URL.</td></tr><tr><td><code>value / multiple / onChange</code></td><td>Controlled string or string-array selection.</td></tr><tr><td><code>displayField / valueField / childrenField</code></td><td>Object normalization.</td></tr><tr><td><code>cascadeCheck / expandAll / expandOnClick / showLines</code></td><td>Tree behavior.</td></tr><tr><td><code>renderOption / renderEmpty</code></td><td>Custom result presentation.</td></tr></tbody></table></div></section>
  </main></div>
}
