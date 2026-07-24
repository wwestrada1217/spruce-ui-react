import { useState, useEffect, useRef } from 'react'
import { ToastProvider, useToast, Button } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `const toast = useToast()

<Button onClick={() => toast.info('This is an info toast')}>Info</Button>
<Button onClick={() => toast.success('Operation successful')}>Success</Button>
<Button onClick={() => toast.warning('Please review')}>Warning</Button>
<Button onClick={() => toast.danger('Something went wrong')}>Danger</Button>`

const TITLE_CODE = `toast.show({ title: 'Update Available', message: 'A new version is ready.', variant: 'info' })`

const ACTION_CODE = `toast.show({
  message: 'File deleted',
  variant: 'danger',
  action: { label: 'Undo', onClick: () => console.log('Undo') }
})`

const SOLID_CODE = `toast.show({ message: 'Solid info toast', variant: 'info', solid: true })
toast.show({ message: 'Solid success toast', variant: 'success', solid: true })`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',  label: 'Basic' },
  { id: 'title',  label: 'With Title' },
  { id: 'action', label: 'With Action' },
  { id: 'solid',  label: 'Solid' },
  { id: 'api',    label: 'API' },
]

function ToastDemos() {
  const toast = useToast()
  return (
    <>
      <section id="basic" className="demo-section" aria-labelledby="basic-heading">
        <h2 id="basic-heading">Basic</h2>
        <p className="section-desc">Four variants for different notification types.</p>
        <CodePreview code={BASIC_CODE}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm" onClick={() => toast.info('This is an info toast')}>Info</Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Operation completed successfully')}>Success</Button>
            <Button variant="outline" size="sm" onClick={() => toast.warning('Please review your input')}>Warning</Button>
            <Button variant="outline" size="sm" onClick={() => toast.danger('Something went wrong')}>Danger</Button>
          </div>
        </CodePreview>
      </section>

      <section id="title" className="demo-section" aria-labelledby="title-heading">
        <h2 id="title-heading">With Title</h2>
        <p className="section-desc">Add a bold title above the message.</p>
        <CodePreview code={TITLE_CODE}>
          <Button variant="outline" size="sm" onClick={() => toast.show({ title: 'Update Available', message: 'A new version is ready to install.', variant: 'info' })}>Show with Title</Button>
        </CodePreview>
      </section>

      <section id="action" className="demo-section" aria-labelledby="action-heading">
        <h2 id="action-heading">With Action</h2>
        <p className="section-desc">Include an action button for undo or follow-up.</p>
        <CodePreview code={ACTION_CODE}>
          <Button variant="outline" size="sm" onClick={() => toast.show({ message: 'File deleted', variant: 'danger', action: { label: 'Undo', onClick: () => toast.info('Undo clicked') } })}>Show with Action</Button>
        </CodePreview>
      </section>

      <section id="solid" className="demo-section" aria-labelledby="solid-heading">
        <h2 id="solid-heading">Solid</h2>
        <p className="section-desc">Solid variant fills the background with the variant color.</p>
        <CodePreview code={SOLID_CODE}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm" onClick={() => toast.show({ message: 'Solid info', variant: 'info', solid: true })}>Solid Info</Button>
            <Button variant="outline" size="sm" onClick={() => toast.show({ message: 'Solid success', variant: 'success', solid: true })}>Solid Success</Button>
            <Button variant="outline" size="sm" onClick={() => toast.show({ message: 'Solid warning', variant: 'warning', solid: true })}>Solid Warning</Button>
            <Button variant="outline" size="sm" onClick={() => toast.show({ message: 'Solid danger', variant: 'danger', solid: true })}>Solid Danger</Button>
          </div>
        </CodePreview>
      </section>
    </>
  )
}

export function ToastPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { const v = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top); if (v.length > 0) setActiveSection(v[0].target.id) }, { rootMargin: '-10% 0px -60% 0px', threshold: 0 })
    mainRef.current?.querySelectorAll('section[id]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return (
    <ToastProvider position="top-right">
      <div className="features-layout">
        <div className="features-main" ref={mainRef}>
          <h1>Toast</h1>
          <p className="docs-desc">Non-blocking notification system with multiple variants, positions, actions, and auto-dismiss. Uses a context provider pattern.</p>
          <ToastDemos />

          <section id="api" className="demo-section">
            <h2>API</h2>
            <h3>ToastProvider Props</h3>
            <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
              <tr><td><code>position</code></td><td><code>ToastPosition</code></td><td><code>'top-right'</code></td><td>Container position</td></tr>
              <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>App content</td></tr>
            </tbody></table></div>
            <h3 style={{ marginTop: 16 }}>useToast() Methods</h3>
            <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead><tbody>
              <tr><td><code>show(config)</code></td><td><code>number</code></td><td>Show toast, returns ID</td></tr>
              <tr><td><code>info(message, opts?)</code></td><td><code>number</code></td><td>Info toast shorthand</td></tr>
              <tr><td><code>success(message, opts?)</code></td><td><code>number</code></td><td>Success toast</td></tr>
              <tr><td><code>warning(message, opts?)</code></td><td><code>number</code></td><td>Warning toast</td></tr>
              <tr><td><code>danger(message, opts?)</code></td><td><code>number</code></td><td>Danger toast</td></tr>
              <tr><td><code>dismiss(id)</code></td><td><code>void</code></td><td>Dismiss by ID</td></tr>
              <tr><td><code>dismissAll()</code></td><td><code>void</code></td><td>Dismiss all</td></tr>
            </tbody></table></div>
            <h3 style={{ marginTop: 16 }}>ToastConfig</h3>
            <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
              <tr><td><code>message</code></td><td><code>string</code></td><td>—</td><td>Toast message</td></tr>
              <tr><td><code>variant</code></td><td><code>'info' | 'success' | 'warning' | 'danger'</code></td><td><code>'info'</code></td><td>Visual style</td></tr>
              <tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>Optional bold title</td></tr>
              <tr><td><code>duration</code></td><td><code>number</code></td><td><code>5000</code></td><td>Auto-dismiss ms (0=persistent)</td></tr>
              <tr><td><code>action</code></td><td><code>{'{label, onClick}'}</code></td><td>—</td><td>Action button</td></tr>
              <tr><td><code>dismissible</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show close button</td></tr>
              <tr><td><code>solid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Solid colored background</td></tr>
            </tbody></table></div>
          </section>
        </div>
        <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{SECTIONS.map(s => (<li key={s.id}><a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</a></li>))}</ul></nav>
      </div>
    </ToastProvider>
  )
}
