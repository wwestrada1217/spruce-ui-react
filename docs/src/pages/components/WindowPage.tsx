import { useState, useEffect, useRef } from 'react'
import { Window, Button } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `const [open, setOpen] = useState(false)
<Button onClick={() => setOpen(true)}>Open Window</Button>
<Window open={open} onClose={() => setOpen(false)} title="My Window">
  <p>Drag the title bar. Resize from edges.</p>
</Window>`

const SIZES_CODE = `<Window size="sm" ... />
<Window size="md" ... />
<Window size="lg" ... />
<Window size="xl" ... />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'api',   label: 'API' },
]

export function WindowPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [open, setOpen] = useState(false)
  const [sizeWin, setSizeWin] = useState<{ open: boolean; size: 'sm' | 'md' | 'lg' | 'xl' }>({ open: false, size: 'md' })
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
        <h1>Window</h1>
        <p className="docs-desc">Draggable, resizable floating window with title bar controls. Supports maximize, z-index stacking, and optional backdrop.</p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">A floating window that can be dragged by the title bar and resized from edges and corners. Double-click the title bar to maximize.</p>
          <CodePreview code={BASIC_CODE}>
            <Button onClick={() => setOpen(true)}>Open Window</Button>
            <Window open={open} onClose={() => setOpen(false)} title="My Window">
              <p style={{ margin: 0 }}>Drag the title bar to move. Resize from edges. Double-click title bar to maximize.</p>
            </Window>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Four preset sizes that set initial width and height.</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
                <Button key={s} variant="outline" size="sm" onClick={() => setSizeWin({ open: true, size: s })}>{s}</Button>
              ))}
            </div>
            <Window open={sizeWin.open} onClose={() => setSizeWin(p => ({ ...p, open: false }))} title={`${sizeWin.size} Window`} size={sizeWin.size}>
              <p style={{ margin: 0 }}>Window size: {sizeWin.size}</p>
            </Window>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2><h3>Props</h3>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>open</code></td><td><code>boolean</code></td><td>—</td><td>Controls visibility</td></tr>
            <tr><td><code>onClose</code></td><td><code>() =&gt; void</code></td><td>—</td><td>Called on close</td></tr>
            <tr><td><code>title</code></td><td><code>string</code></td><td><code>''</code></td><td>Title bar text</td></tr>
            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg' | 'xl'</code></td><td><code>'md'</code></td><td>Initial dimensions</td></tr>
            <tr><td><code>resizable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Enable resize handles</td></tr>
            <tr><td><code>minWidth</code></td><td><code>number</code></td><td><code>280</code></td><td>Minimum width in px</td></tr>
            <tr><td><code>minHeight</code></td><td><code>number</code></td><td><code>200</code></td><td>Minimum height in px</td></tr>
            <tr><td><code>showBackdrop</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show overlay behind window</td></tr>
            <tr><td><code>footer</code></td><td><code>ReactNode</code></td><td>—</td><td>Footer content</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{SECTIONS.map(s => (<li key={s.id}><a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</a></li>))}</ul></nav>
    </div>
  )
}
