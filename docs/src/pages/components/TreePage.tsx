import { useState, useEffect, useRef } from 'react'
import { Tree, type TreeNode } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

// ── Sample data ──────────────────────────────────────────────────────────────

const basicNodes: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'app',
        label: 'app',
        children: [
          { id: 'components', label: 'components' },
          { id: 'services', label: 'services' },
        ],
      },
    ],
  },
  {
    id: 'assets',
    label: 'assets',
    children: [
      { id: 'images', label: 'images' },
    ],
  },
  { id: 'readme', label: 'README.md' },
]

const checkableNodes: TreeNode[] = [
  {
    id: 'chk-src',
    label: 'src',
    children: [
      {
        id: 'chk-app',
        label: 'app',
        children: [
          { id: 'chk-components', label: 'components' },
          { id: 'chk-services', label: 'services' },
        ],
      },
    ],
  },
  {
    id: 'chk-assets',
    label: 'assets',
    children: [
      { id: 'chk-images', label: 'images' },
    ],
  },
  { id: 'chk-readme', label: 'README.md' },
]

const draggableNodes: TreeNode[] = [
  {
    id: 'drag-src',
    label: 'src',
    children: [
      {
        id: 'drag-app',
        label: 'app',
        children: [
          { id: 'drag-components', label: 'components' },
          { id: 'drag-services', label: 'services' },
        ],
      },
    ],
  },
  {
    id: 'drag-assets',
    label: 'assets',
    children: [
      { id: 'drag-images', label: 'images' },
    ],
  },
  { id: 'drag-readme', label: 'README.md' },
]

const iconNodes: TreeNode[] = [
  {
    id: 'icon-settings',
    label: 'Settings',
    icon: 'settings',
    children: [
      { id: 'icon-general', label: 'General', icon: 'info' },
      { id: 'icon-profile', label: 'Profile', icon: 'edit' },
    ],
  },
  {
    id: 'icon-admin',
    label: 'Administration',
    icon: 'settings',
    children: [
      { id: 'icon-users', label: 'Users', icon: 'info' },
      { id: 'icon-roles', label: 'Roles', icon: 'edit' },
    ],
  },
]

// ── Code snippets ────────────────────────────────────────────────────────────

const basicCode = `<Tree nodes={nodes} />`

const expandedCode = `<Tree nodes={nodes} expandAll />`

const checkboxesCode = `<Tree nodes={nodes} selectable expandAll />`

const dragDropCode = `<Tree nodes={nodes} draggable expandAll />`

const iconsCode = `<Tree nodes={iconNodes} expandAll />`

const treeLinesCode = `<Tree nodes={nodes} expandAll showLines />`

const expandOnClickCode = `<Tree nodes={nodes} expandOnClick />`

// ── Sections ─────────────────────────────────────────────────────────────────

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'expanded', label: 'Expanded' },
  { id: 'checkboxes', label: 'Checkboxes' },
  { id: 'drag-drop', label: 'Drag & Drop' },
  { id: 'icons', label: 'Icons' },
  { id: 'tree-lines', label: 'Tree Lines' },
  { id: 'expand-on-click', label: 'Expand on Click' },
  { id: 'api', label: 'API' },
]

// ── Demo tree container style ────────────────────────────────────────────────

const demoTreeStyle: React.CSSProperties = {
  maxWidth: 400,
  border: '1px solid var(--sp-border)',
  borderRadius: 8,
  padding: 12,
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function TreePage() {
  const [activeSection, setActiveSection] = useState('basic')
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = mainRef.current?.closest('.docs-main') as HTMLElement | null

    const checkIfScrolledToBottom = () => {
      if (!scrollContainer) return
      if (Math.abs(scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) < 2) {
        setActiveSection(SECTIONS[SECTIONS.length - 1].id)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollContainer && Math.abs(scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) < 2) return

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      {
        root: scrollContainer || null,
        rootMargin: '-10% 0px -60% 0px',
        threshold: 0,
      },
    )

    mainRef.current?.querySelectorAll('section[id]').forEach((el) => observer.observe(el))
    scrollContainer?.addEventListener('scroll', checkIfScrolledToBottom, { passive: true })

    return () => {
      observer.disconnect()
      scrollContainer?.removeEventListener('scroll', checkIfScrolledToBottom)
    }
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Treeview</h1>
        <p className="docs-desc">
          A hierarchical tree component with expand/collapse, checkboxes, drag-and-drop reordering, and custom icons.
        </p>

        <section id="basic" className="demo-section">
          <h2>Basic</h2>
          <p className="section-desc">A minimal tree with expand/collapse toggling. Click the chevron to expand or collapse nodes.</p>
          <CodePreview code={basicCode}>
            <div style={demoTreeStyle}>
              <Tree nodes={basicNodes} />
            </div>
          </CodePreview>
        </section>

        <section id="expanded" className="demo-section">
          <h2>Expanded</h2>
          <p className="section-desc">All nodes expanded by default using the <code>expandAll</code> input.</p>
          <CodePreview code={expandedCode}>
            <div style={demoTreeStyle}>
              <Tree nodes={basicNodes} expandAll />
            </div>
          </CodePreview>
        </section>

        <section id="checkboxes" className="demo-section">
          <h2>Checkboxes</h2>
          <p className="section-desc">Enable selectable mode to show checkboxes. Checking a parent checks all its children.</p>
          <CodePreview code={checkboxesCode}>
            <div style={demoTreeStyle}>
              <Tree nodes={checkableNodes} selectable expandAll />
            </div>
          </CodePreview>
        </section>

        <section id="drag-drop" className="demo-section">
          <h2>Drag &amp; Drop</h2>
          <p className="section-desc">Drag nodes to reorder them within the tree. Drop indicators show before, inside, or after the target node.</p>
          <CodePreview code={dragDropCode}>
            <div style={demoTreeStyle}>
              <Tree nodes={draggableNodes} draggable expandAll />
            </div>
          </CodePreview>
        </section>

        <section id="icons" className="demo-section">
          <h2>Icons</h2>
          <p className="section-desc">Nodes can display custom icons using the <code>icon</code> property.</p>
          <CodePreview code={iconsCode}>
            <div style={demoTreeStyle}>
              <Tree nodes={iconNodes} expandAll />
            </div>
          </CodePreview>
        </section>

        <section id="tree-lines" className="demo-section">
          <h2>Tree Lines</h2>
          <p className="section-desc">Enable <code>showLines</code> to render connecting lines that visualize the tree hierarchy.</p>
          <CodePreview code={treeLinesCode}>
            <div style={demoTreeStyle}>
              <Tree nodes={basicNodes} expandAll showLines />
            </div>
          </CodePreview>
        </section>

        <section id="expand-on-click" className="demo-section">
          <h2>Expand on Click</h2>
          <p className="section-desc">Set <code>expandOnClick</code> to toggle expand/collapse when clicking anywhere on a node row, not just the chevron button.</p>
          <CodePreview code={expandOnClickCode}>
            <div style={demoTreeStyle}>
              <Tree nodes={basicNodes} expandOnClick />
            </div>
          </CodePreview>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>nodes</code></td><td><code>TreeNode[]</code></td><td>required</td><td>Array of tree nodes</td></tr>
                <tr><td><code>selectable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enable node selection with checkboxes</td></tr>
                <tr><td><code>draggable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enable drag and drop</td></tr>
                <tr><td><code>expandAll</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Expand all nodes initially</td></tr>
                <tr><td><code>showLines</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show connecting tree lines between parent and child nodes</td></tr>
                <tr><td><code>expandOnClick</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Toggle expand/collapse when clicking anywhere on a node row</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Callbacks</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>onNodeSelect</code></td><td><code>TreeNode</code></td><td>Emits when a node is clicked</td></tr>
                <tr><td><code>onNodeCheck</code></td><td><code>NodeCheckEvent</code></td><td>Emits node and checked state on checkbox change</td></tr>
                <tr><td><code>onNodeDrop</code></td><td><code>NodeDropEvent</code></td><td>Emits node, parent, and index after drag-drop</td></tr>
                <tr><td><code>onNodeToggle</code></td><td><code>TreeNode</code></td><td>Emits when node is expanded/collapsed</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
