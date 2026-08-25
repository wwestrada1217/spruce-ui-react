import { useState, useEffect, useRef } from 'react'
import { Drawer, Button } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open Drawer</Button>
<Drawer open={open} onClose={() => setOpen(false)} title="Drawer Title">
  <p>Drawer content goes here.</p>
</Drawer>`

const POSITIONS_CODE = `<Drawer position="left" ... />
<Drawer position="right" ... />
<Drawer position="bottom" ... />`

const SIZES_CODE = `<Drawer size="sm" ... />
<Drawer size="md" ... />
<Drawer size="lg" ... />
<Drawer size="full" ... />`

const FOOTER_CODE = `<Drawer
  open={open}
  onClose={() => setOpen(false)}
  title="With Footer"
  footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => setOpen(false)}>Save</Button></>}
>
  <p>Drawer with footer actions.</p>
</Drawer>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',     label: 'Basic' },
  { id: 'positions', label: 'Positions' },
  { id: 'sizes',     label: 'Sizes' },
  { id: 'footer',    label: 'With Footer' },
  { id: 'api',       label: 'API' },
]

export function DrawerPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [open, setOpen] = useState(false)
  const [posDrawer, setPosDrawer] = useState<{ open: boolean; pos: 'left' | 'right' | 'bottom' }>({ open: false, pos: 'right' })
  const [sizeDrawer, setSizeDrawer] = useState<{ open: boolean; size: 'sm' | 'md' | 'lg' | 'full' }>({ open: false, size: 'md' })
  const [footerOpen, setFooterOpen] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    )
    mainRef.current?.querySelectorAll('section[id]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Drawer</h1>
        <p className="docs-desc">Slide-in panel for secondary content, forms, or navigation. Supports left, right, and bottom positions with multiple sizes.</p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">A drawer that slides in from the right with a title and close button.</p>
          <CodePreview code={BASIC_CODE}>
            <Button onClick={() => setOpen(true)}>Open Drawer</Button>
            <Drawer open={open} onClose={() => setOpen(false)} title="Drawer Title">
              <p style={{ margin: 0, color: 'var(--sp-text-color)' }}>Drawer content goes here. Click outside or press the close button to dismiss.</p>
            </Drawer>
          </CodePreview>
        </section>

        <section id="positions" className="demo-section" aria-labelledby="positions-heading">
          <h2 id="positions-heading">Positions</h2>
          <p className="section-desc">Drawers can slide in from the left, right, or bottom.</p>
          <CodePreview code={POSITIONS_CODE}>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['left', 'right', 'bottom'] as const).map(pos => (
                <Button key={pos} variant="outline" size="sm" onClick={() => setPosDrawer({ open: true, pos })}>{pos}</Button>
              ))}
            </div>
            <Drawer open={posDrawer.open} onClose={() => setPosDrawer(p => ({ ...p, open: false }))} title={`${posDrawer.pos} Drawer`} position={posDrawer.pos}>
              <p style={{ margin: 0, color: 'var(--sp-text-color)' }}>This drawer slides in from the {posDrawer.pos}.</p>
            </Drawer>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Four sizes: sm (320px), md (480px), lg (640px), and full (100%).</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['sm', 'md', 'lg', 'full'] as const).map(s => (
                <Button key={s} variant="outline" size="sm" onClick={() => setSizeDrawer({ open: true, size: s })}>{s}</Button>
              ))}
            </div>
            <Drawer open={sizeDrawer.open} onClose={() => setSizeDrawer(p => ({ ...p, open: false }))} title={`${sizeDrawer.size} Drawer`} size={sizeDrawer.size}>
              <p style={{ margin: 0, color: 'var(--sp-text-color)' }}>Size: {sizeDrawer.size}</p>
            </Drawer>
          </CodePreview>
        </section>

        <section id="footer" className="demo-section" aria-labelledby="footer-heading">
          <h2 id="footer-heading">With Footer</h2>
          <p className="section-desc">Pass a <code>footer</code> prop to render action buttons at the bottom.</p>
          <CodePreview code={FOOTER_CODE}>
            <Button onClick={() => setFooterOpen(true)}>Open with Footer</Button>
            <Drawer open={footerOpen} onClose={() => setFooterOpen(false)} title="With Footer" footer={<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}><Button variant="outline" onClick={() => setFooterOpen(false)}>Cancel</Button><Button onClick={() => setFooterOpen(false)}>Save</Button></div>}>
              <p style={{ margin: 0, color: 'var(--sp-text-color)' }}>Content with footer actions below.</p>
            </Drawer>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Props</h3>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>open</code></td><td><code>boolean</code></td><td>—</td><td>Controls visibility</td></tr>
            <tr><td><code>onClose</code></td><td><code>() =&gt; void</code></td><td>—</td><td>Called on close</td></tr>
            <tr><td><code>title</code></td><td><code>string</code></td><td><code>''</code></td><td>Header title</td></tr>
            <tr><td><code>position</code></td><td><code>'left' | 'right' | 'bottom'</code></td><td><code>'right'</code></td><td>Slide direction</td></tr>
            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg' | 'full'</code></td><td><code>'md'</code></td><td>Panel size</td></tr>
                <tr><td><code>closeOnBackdrop</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Close when clicking backdrop</td></tr>
                <tr><td><code>closeOnEscape</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Allow Escape to request close</td></tr>
                <tr><td><code>focusTrap</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Autofocus, trap, and restore focus</td></tr>
            <tr><td><code>footer</code></td><td><code>ReactNode</code></td><td>—</td><td>Footer content</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{SECTIONS.map((s) => (<li key={s.id}><a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</a></li>))}</ul></nav>
    </div>
  )
}
