import { useState, useEffect, useRef } from 'react'
import { Overflow, OverflowItem } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<Overflow
  menuContent={(hiddenIds) => (
    <button>+{hiddenIds.size} more</button>
  )}
>
  <OverflowItem id="a" priority={3}>Item A</OverflowItem>
  <OverflowItem id="b" priority={2}>Item B</OverflowItem>
  <OverflowItem id="c" priority={1}>Item C</OverflowItem>
  <OverflowItem id="d" priority={0}>Item D</OverflowItem>
</Overflow>`

const btnStyle: React.CSSProperties = {
  padding: '6px 16px',
  fontSize: 13,
  border: '1px solid var(--sp-border-strong, rgba(0,0,0,0.14))',
  borderRadius: 6,
  background: 'var(--sp-surface-0, #fff)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'api',   label: 'API' },
]

export function OverflowPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    )
    mainRef.current?.querySelectorAll('section[id]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Overflow</h1>
        <p className="docs-desc">
          Container that measures its children and hides items that overflow, showing
          a customizable overflow menu. Items are hidden by priority.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">
            Resize the browser to see items collapse into the overflow menu. Lower priority items
            are hidden first.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ maxWidth: 360, border: '1px dashed var(--sp-border)', padding: 8, borderRadius: 8 }}>
              <Overflow
                gap={8}
                menuContent={(hiddenIds) => (
                  <button style={{ ...btnStyle, background: 'var(--sp-primary-subtle)', color: 'var(--sp-primary)', borderColor: 'var(--sp-primary)' }}>
                    +{hiddenIds.size} more
                  </button>
                )}
              >
                {['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'].map((name, i) => (
                  <OverflowItem key={name} id={name.toLowerCase()} priority={6 - i}>
                    <button style={btnStyle}>{name}</button>
                  </OverflowItem>
                ))}
              </Overflow>
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Overflow Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>OverflowItem elements</td></tr>
                <tr><td><code>menuContent</code></td><td><code>(hiddenIds: Set&lt;string&gt;) =&gt; ReactNode</code></td><td>—</td><td>Render prop for overflow menu</td></tr>
                <tr><td><code>minimumVisible</code></td><td><code>number</code></td><td><code>0</code></td><td>Minimum items always visible</td></tr>
                <tr><td><code>gap</code></td><td><code>number</code></td><td><code>0</code></td><td>Gap between items in px</td></tr>
                <tr><td><code>menuWidth</code></td><td><code>number</code></td><td><code>40</code></td><td>Reserved overflow trigger width during measurement</td></tr>
                <tr><td><code>onOverflowChange</code></td><td><code>(event) =&gt; void</code></td><td>—</td><td>Fired when overflow state changes</td></tr>
              </tbody>
            </table>
          </div>
          <h3 style={{ marginTop: 16 }}>OverflowItem Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>Unique identifier</td></tr>
                <tr><td><code>priority</code></td><td><code>number</code></td><td><code>0</code></td><td>Higher priority items stay visible longer</td></tr>
                <tr><td><code>className</code> / <code>style</code></td><td><code>string</code> / <code>CSSProperties</code></td><td>—</td><td>Style the measured item wrapper</td></tr>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Item content</td></tr>
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
              <a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
