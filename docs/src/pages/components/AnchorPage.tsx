import { Anchor, AnchorItem, AnchorTarget } from 'spruce-react'
import type { AnchorItemDefinition } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { DocsPackageBadge } from '../../components/DocsPackageBadge'

const items: AnchorItemDefinition[] = [
  { id: 'anchor-overview', label: 'Overview' },
  { id: 'anchor-variants', label: 'Variants', children: [{ id: 'anchor-scrubber', label: 'Scrubber', badge: 'new' }] },
  { id: 'anchor-api', label: 'API' },
]

const CODE = `<Anchor items={items} variant="stepped" affix showTitle />
<AnchorTarget id="overview"><h2>Overview</h2></AnchorTarget>`

export function AnchorPage() {
  return <div className="features-layout"><main className="features-main">
    <h1>Anchor</h1>
    <p className="docs-desc">Scroll-aware navigation for long pages, with data-driven or declarative nested items.</p>
    <DocsPackageBadge packageName="spruce-react" symbols={['Anchor', 'AnchorItem', 'AnchorTarget', 'useAnchorTarget']} />
    <section className="demo-section"><h2>Variants and composition</h2><CodePreview code={CODE}><div style={{ display: 'flex', gap: 48 }}>
      <Anchor items={items} variant="stepped" activeId="anchor-variants" showTitle />
      <Anchor variant="timeline" activeId="anchor-declarative" ariaLabel="Declarative example"><AnchorItem target="anchor-declarative" label="Declarative item"><AnchorItem target="anchor-child" label="Nested item" /></AnchorItem></Anchor>
    </div></CodePreview></section>
    <AnchorTarget id="anchor-overview"><h2>Overview</h2><p>Use line, stepped/bracket, timeline/curved, or scrubber/magnifier rails in vertical or horizontal layouts.</p></AnchorTarget>
    <AnchorTarget id="anchor-variants"><h2>Interaction</h2><p>Scrollspy, smooth scrolling, offsets, active callbacks, keyboard roving focus, RTL, and reduced motion are built in.</p></AnchorTarget>
    <AnchorTarget id="anchor-scrubber"><CodePreview code={'<Anchor items={items} variant="scrubber" />'}><Anchor items={items} variant="scrubber" activeId="anchor-variants" /></CodePreview></AnchorTarget>
    <AnchorTarget id="anchor-api" className="demo-section"><h2>API</h2><div className="api-table-wrap"><table className="api-table"><thead><tr><th>Props</th><th>Purpose</th></tr></thead><tbody>
      <tr><td><code>items / children</code></td><td>Data-driven definitions or nested AnchorItem markers.</td></tr><tr><td><code>variant / size / orientation</code></td><td>Rail appearance, density, and direction.</td></tr><tr><td><code>activeId / onActiveChange</code></td><td>Controlled scrollspy state.</td></tr><tr><td><code>scrollContainer / offsetTop / scrollOffset</code></td><td>Scrolling owner and target offsets.</td></tr><tr><td><code>affix / affixTop</code></td><td>Sticky page navigation.</td></tr>
    </tbody></table></div></AnchorTarget>
  </main></div>
}
