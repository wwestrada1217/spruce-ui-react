import { useState, useEffect, useRef } from 'react'
import { Modal, Button } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open Modal</Button>
<Modal open={open} onClose={() => setOpen(false)} title="Modal Title">
  <p>Modal content goes here.</p>
</Modal>`

const SIZES_CODE = `<Modal size="sm" ... />
<Modal size="md" ... />
<Modal size="lg" ... />
<Modal size="xl" ... />`

const FOOTER_CODE = `<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm Action"
  footer={<><Button variant="outline" onClick={close}>Cancel</Button><Button onClick={close}>Confirm</Button></>}
>
  <p>Are you sure you want to proceed?</p>
</Modal>`

const SURFACES_CODE = `<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Review changes"
  headerBackground="var(--sp-primary-tint)"
  footerBackground="var(--sp-surface-100)"
  footer={<Button onClick={() => setOpen(false)}>Done</Button>}
>
  <p>Only the header and footer receive the custom surfaces.</p>
</Modal>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',  label: 'Basic' },
  { id: 'sizes',  label: 'Sizes' },
  { id: 'footer', label: 'With Footer' },
  { id: 'surfaces', label: 'Region Backgrounds' },
  { id: 'api',    label: 'API' },
]

export function ModalPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [open, setOpen] = useState(false)
  const [sizeModal, setSizeModal] = useState<{ open: boolean; size: 'sm' | 'md' | 'lg' | 'xl' | 'full' }>({ open: false, size: 'md' })
  const [footerOpen, setFooterOpen] = useState(false)
  const [surfacesOpen, setSurfacesOpen] = useState(false)
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
        <h1>Modal</h1>
        <p className="docs-desc">Centered dialog overlay for confirmations, forms, and content that requires user attention. Supports multiple sizes, footer actions, and backdrop dismiss.</p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">A centered modal with title, content, and close button.</p>
          <CodePreview code={BASIC_CODE}>
            <Button onClick={() => setOpen(true)}>Open Modal</Button>
            <Modal open={open} onClose={() => setOpen(false)} title="Modal Title">
              <p style={{ margin: 0 }}>This is a basic modal dialog. Click the close button or outside to dismiss.</p>
            </Modal>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Five sizes: sm (400px), md (560px), lg (720px), xl (960px), and full.</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
                <Button key={s} variant="outline" size="sm" onClick={() => setSizeModal({ open: true, size: s })}>{s}</Button>
              ))}
            </div>
            <Modal open={sizeModal.open} onClose={() => setSizeModal(p => ({ ...p, open: false }))} title={`${sizeModal.size} Modal`} size={sizeModal.size}>
              <p style={{ margin: 0 }}>This is a {sizeModal.size} modal.</p>
            </Modal>
          </CodePreview>
        </section>

        <section id="footer" className="demo-section" aria-labelledby="footer-heading">
          <h2 id="footer-heading">With Footer</h2>
          <p className="section-desc">Add action buttons in the footer for confirmations.</p>
          <CodePreview code={FOOTER_CODE}>
            <Button onClick={() => setFooterOpen(true)}>Confirm Action</Button>
            <Modal open={footerOpen} onClose={() => setFooterOpen(false)} title="Confirm Action" footer={<><Button variant="outline" onClick={() => setFooterOpen(false)}>Cancel</Button><Button onClick={() => setFooterOpen(false)}>Confirm</Button></>}>
              <p style={{ margin: 0 }}>Are you sure you want to proceed? This action cannot be undone.</p>
            </Modal>
          </CodePreview>
        </section>

        <section id="surfaces" className="demo-section" aria-labelledby="surfaces-heading">
          <h2 id="surfaces-heading">Header and footer backgrounds</h2>
          <p className="section-desc">
            Apply a Spruce custom-property value to either region without changing the dialog body.
            The type also accepts <code>transparent</code> and <code>inherit</code>.
          </p>
          <CodePreview code={SURFACES_CODE} language="typescript">
            <Button onClick={() => setSurfacesOpen(true)}>Open surfaced modal</Button>
            <Modal
              open={surfacesOpen}
              onClose={() => setSurfacesOpen(false)}
              title="Review changes"
              headerBackground="var(--sp-primary-tint)"
              footerBackground="var(--sp-surface-100)"
              footer={<Button onClick={() => setSurfacesOpen(false)}>Done</Button>}
            >
              <p style={{ margin: 0 }}>Only the header and footer receive the custom surfaces.</p>
            </Modal>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Props</h3>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>open</code></td><td><code>boolean</code></td><td>—</td><td>Controls visibility</td></tr>
            <tr><td><code>onClose</code></td><td><code>() =&gt; void</code></td><td>—</td><td>Called on close</td></tr>
            <tr><td><code>title</code></td><td><code>string</code></td><td><code>''</code></td><td>Header title</td></tr>
            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg' | 'xl' | 'full'</code></td><td><code>'md'</code></td><td>Max width</td></tr>
                <tr><td><code>closeOnBackdrop</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Close on backdrop click</td></tr>
                <tr><td><code>closeOnEscape</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Allow Escape to request close</td></tr>
                <tr><td><code>focusTrap</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Autofocus, trap, and restore focus</td></tr>
                <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Accessible dialog description</td></tr>
            <tr><td><code>footer</code></td><td><code>ReactNode</code></td><td>—</td><td>Footer content</td></tr>
            <tr><td><code>headerBackground</code></td><td><code>ModalRegionBackground</code></td><td>—</td><td>Token-safe header-only background</td></tr>
            <tr><td><code>footerBackground</code></td><td><code>ModalRegionBackground</code></td><td>—</td><td>Token-safe footer-only background</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{SECTIONS.map((s) => (<li key={s.id}><a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</a></li>))}</ul></nav>
    </div>
  )
}
