import { useState, useEffect, useRef } from 'react'
import { CommandPalette, Button } from 'spruce-react'
import type { CommandPaletteItem } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const ITEMS: CommandPaletteItem[] = [
  { id: '1', label: 'New File', icon: 'file-plus', category: 'File', keywords: ['create'] },
  { id: '2', label: 'Open File', icon: 'folder-open', category: 'File', keywords: ['browse'] },
  { id: '3', label: 'Save', icon: 'save', category: 'File', keywords: ['write'] },
  { id: '4', label: 'Find & Replace', icon: 'search', category: 'Edit', keywords: ['search'] },
  { id: '5', label: 'Undo', icon: 'rotate-ccw', category: 'Edit' },
  { id: '6', label: 'Redo', icon: 'rotate-cw', category: 'Edit' },
  { id: '7', label: 'Toggle Sidebar', icon: 'sidebar', category: 'View' },
  { id: '8', label: 'Toggle Terminal', icon: 'terminal', category: 'View' },
  { id: '9', label: 'User Settings', icon: 'settings', category: 'Preferences' },
  { id: '10', label: 'Keyboard Shortcuts', icon: 'keyboard', category: 'Preferences' },
]

const BASIC_CODE = `const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open Command Palette</Button>
<CommandPalette
  items={items}
  open={open}
  onClose={() => setOpen(false)}
  onSelect={(item) => console.log('Selected:', item.label)}
/>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'api',   label: 'API' },
]

export function CommandPalettePage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { const v = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top); if (v.length > 0) setActiveSection(v[0].target.id) }, { rootMargin: '-10% 0px -60% 0px', threshold: 0 })
    mainRef.current?.querySelectorAll('section[id]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Command Palette</h1>
        <p className="docs-desc">Searchable command launcher overlay. Open with Ctrl/Cmd+K, type to filter, arrow keys to navigate, Enter to select.</p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">Click the button or press <kbd>Ctrl+K</kbd> to open. Type to filter commands, use arrow keys to navigate.</p>
          <CodePreview code={BASIC_CODE}>
            <div>
              <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
              <CommandPalette items={ITEMS} open={open} onClose={() => setOpen(false)} onSelect={(item) => { setSelected(item.label); setOpen(false) }} />
              {selected && <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginTop: 8 }}>Last selected: <code>{selected}</code></p>}
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2><h3>Props</h3>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>items</code></td><td><code>CommandPaletteItem[]</code></td><td>—</td><td>Searchable items</td></tr>
            <tr><td><code>open</code></td><td><code>boolean</code></td><td>—</td><td>Controls visibility</td></tr>
            <tr><td><code>onClose</code></td><td><code>() =&gt; void</code></td><td>—</td><td>Called on close</td></tr>
            <tr><td><code>onOpenChange</code></td><td><code>(open) =&gt; void</code></td><td>—</td><td>Receives the global shortcut open request</td></tr>
            <tr><td><code>onSelect</code></td><td><code>(item) =&gt; void</code></td><td>—</td><td>Called on item selection</td></tr>
            <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>'Search...'</code></td><td>Search input placeholder</td></tr>
            <tr><td><code>emptyMessage</code></td><td><code>string</code></td><td><code>'No results found.'</code></td><td>Empty state message</td></tr>
            <tr><td><code>shortcutKey</code></td><td><code>string</code></td><td><code>'k'</code></td><td>Keyboard shortcut key (with Ctrl/Cmd)</td></tr>
            <tr><td><code>fuzzySearch</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enable fuzzy matching</td></tr>
            <tr><td><code>highlightQuery</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Highlight matching label text</td></tr>
            <tr><td><code>showShortcuts</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Render item shortcut KBD controls</td></tr>
            <tr><td><code>showFooter</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Render localized keyboard hints</td></tr>
          </tbody></table></div>
          <h3 style={{ marginTop: 16 }}>CommandPaletteItem</h3>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>id</code></td><td><code>string</code></td><td>Unique identifier</td></tr>
            <tr><td><code>label</code></td><td><code>string</code></td><td>Display label</td></tr>
            <tr><td><code>icon</code></td><td><code>string</code></td><td>Optional icon name</td></tr>
            <tr><td><code>category</code></td><td><code>string</code></td><td>Group category</td></tr>
            <tr><td><code>keywords</code></td><td><code>string[]</code></td><td>Additional search terms</td></tr>
            <tr><td><code>shortcut</code></td><td><code>string[] | string</code></td><td>Optional item keyboard shortcut</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{SECTIONS.map(s => (<li key={s.id}><a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</a></li>))}</ul></nav>
    </div>
  )
}
