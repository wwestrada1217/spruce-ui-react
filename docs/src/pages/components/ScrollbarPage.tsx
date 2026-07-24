import { useState, useEffect, useRef } from 'react'
import { Scrollbar } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<Scrollbar style={{ height: 200 }}>
  <div style={{ height: 600 }}>Scrollable content...</div>
</Scrollbar>`

const AUTO_HIDE_CODE = `<Scrollbar autoHide style={{ height: 200 }}>
  <div style={{ height: 600 }}>Scrollbar hides when not hovering.</div>
</Scrollbar>`

const THICKNESS_CODE = `<Scrollbar thickness="thin" style={{ height: 150 }}>...</Scrollbar>
<Scrollbar thickness="medium" style={{ height: 150 }}>...</Scrollbar>
<Scrollbar thickness="thick" style={{ height: 150 }}>...</Scrollbar>`

const content = Array.from({ length: 30 }, (_, i) => `Line ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`).join('\n')

const boxStyle: React.CSSProperties = { border: '1px solid var(--sp-border)', borderRadius: 8, overflow: 'hidden' }

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',     label: 'Basic' },
  { id: 'auto-hide', label: 'Auto Hide' },
  { id: 'thickness', label: 'Thickness' },
  { id: 'api',       label: 'API' },
]

export function ScrollbarPage() {
  const [activeSection, setActiveSection] = useState('basic')
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
        <h1>Scrollbar</h1>
        <p className="docs-desc">Styled scrollbar wrapper with customizable thickness and auto-hide behavior. Applies consistent scrollbar styling across browsers.</p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">A thin styled scrollbar that matches the design system.</p>
          <CodePreview code={BASIC_CODE}>
            <div style={boxStyle}>
              <Scrollbar style={{ height: 200, padding: 12 }}>
                <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{content}</pre>
              </Scrollbar>
            </div>
          </CodePreview>
        </section>

        <section id="auto-hide" className="demo-section" aria-labelledby="auto-hide-heading">
          <h2 id="auto-hide-heading">Auto Hide</h2>
          <p className="section-desc">Scrollbar becomes transparent until the user hovers or interacts with the content.</p>
          <CodePreview code={AUTO_HIDE_CODE}>
            <div style={boxStyle}>
              <Scrollbar autoHide style={{ height: 200, padding: 12 }}>
                <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{content}</pre>
              </Scrollbar>
            </div>
          </CodePreview>
        </section>

        <section id="thickness" className="demo-section" aria-labelledby="thickness-heading">
          <h2 id="thickness-heading">Thickness</h2>
          <p className="section-desc">Three thickness levels: thin (8px), medium (12px), and thick (16px).</p>
          <CodePreview code={THICKNESS_CODE}>
            <div style={{ display: 'flex', gap: 16 }}>
              {(['thin', 'medium', 'thick'] as const).map(t => (
                <div key={t} style={{ flex: 1, ...boxStyle }}>
                  <p style={{ margin: '8px 12px 0', fontSize: 11, color: 'var(--sp-text-muted)' }}>{t}</p>
                  <Scrollbar thickness={t} style={{ height: 150, padding: 12 }}>
                    <pre style={{ margin: 0, fontSize: 11, whiteSpace: 'pre-wrap' }}>{content}</pre>
                  </Scrollbar>
                </div>
              ))}
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2><h3>Props</h3>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>autoHide</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hide scrollbar until hover/focus</td></tr>
            <tr><td><code>thickness</code></td><td><code>'thin' | 'medium' | 'thick'</code></td><td><code>'thin'</code></td><td>Scrollbar width</td></tr>
            <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Scrollable content</td></tr>
            <tr><td><code>style</code></td><td><code>CSSProperties</code></td><td>—</td><td>Container styles (set height here)</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{SECTIONS.map(s => (<li key={s.id}><a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</a></li>))}</ul></nav>
    </div>
  )
}
