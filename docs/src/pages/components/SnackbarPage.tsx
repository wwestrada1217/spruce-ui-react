import { useState, useEffect, useRef } from 'react'
import { SnackbarProvider, useSnackbar, Button } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `const snackbar = useSnackbar()
<Button onClick={() => snackbar.open('Changes saved successfully')}>Show Snackbar</Button>`

const ACTION_CODE = `snackbar.show({
  message: 'Item deleted',
  action: { label: 'Undo', onClick: () => console.log('Undo') }
})`

const PERSISTENT_CODE = `snackbar.show({ message: 'Persistent message', duration: 0 })`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',      label: 'Basic' },
  { id: 'action',     label: 'With Action' },
  { id: 'persistent', label: 'Persistent' },
  { id: 'api',        label: 'API' },
]

function SnackbarDemos() {
  const snackbar = useSnackbar()
  return (
    <>
      <section id="basic" className="demo-section" aria-labelledby="basic-heading">
        <h2 id="basic-heading">Basic</h2>
        <p className="section-desc">A dark bottom-center notification that auto-dismisses after 4 seconds.</p>
        <CodePreview code={BASIC_CODE}>
          <Button onClick={() => snackbar.open('Changes saved successfully')}>Show Snackbar</Button>
        </CodePreview>
      </section>
      <section id="action" className="demo-section" aria-labelledby="action-heading">
        <h2 id="action-heading">With Action</h2>
        <p className="section-desc">Include an action button for undo or follow-up.</p>
        <CodePreview code={ACTION_CODE}>
          <Button variant="outline" onClick={() => snackbar.show({ message: 'Item deleted', action: { label: 'Undo', onClick: () => snackbar.open('Undo clicked') } })}>Delete Item</Button>
        </CodePreview>
      </section>
      <section id="persistent" className="demo-section" aria-labelledby="persistent-heading">
        <h2 id="persistent-heading">Persistent</h2>
        <p className="section-desc">Set <code>duration: 0</code> for a snackbar that stays until dismissed.</p>
        <CodePreview code={PERSISTENT_CODE}>
          <Button variant="outline" onClick={() => snackbar.show({ message: 'Persistent message', duration: 0 })}>Show Persistent</Button>
        </CodePreview>
      </section>
    </>
  )
}

export function SnackbarPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const mainRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { const v = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top); if (v.length > 0) setActiveSection(v[0].target.id) }, { rootMargin: '-10% 0px -60% 0px', threshold: 0 })
    mainRef.current?.querySelectorAll('section[id]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return (
    <SnackbarProvider>
      <div className="features-layout">
        <div className="features-main" ref={mainRef}>
          <h1>Snackbar</h1>
          <p className="docs-desc">Bottom-center notification bar for brief messages. Shows one at a time with optional action button and auto-dismiss.</p>
          <SnackbarDemos />
          <section id="api" className="demo-section">
            <h2>API</h2>
            <h3>useSnackbar() Methods</h3>
            <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Method</th><th>Description</th></tr></thead><tbody>
              <tr><td><code>show(config)</code></td><td>Show snackbar with full config</td></tr>
              <tr><td><code>open(message, opts?)</code></td><td>Quick show with message</td></tr>
              <tr><td><code>dismiss()</code></td><td>Dismiss current snackbar</td></tr>
            </tbody></table></div>
            <h3 style={{ marginTop: 16 }}>SnackbarConfig</h3>
            <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
              <tr><td><code>message</code></td><td><code>string</code></td><td>—</td><td>Message text</td></tr>
              <tr><td><code>duration</code></td><td><code>number</code></td><td><code>4000</code></td><td>Auto-dismiss ms (0=persistent)</td></tr>
              <tr><td><code>action</code></td><td><code>{'{label, onClick}'}</code></td><td>—</td><td>Action button</td></tr>
              <tr><td><code>dismissible</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show close button</td></tr>
            </tbody></table></div>
          </section>
        </div>
        <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{SECTIONS.map(s => (<li key={s.id}><a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</a></li>))}</ul></nav>
      </div>
    </SnackbarProvider>
  )
}
