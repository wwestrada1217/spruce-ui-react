import { useState, useEffect, useRef } from 'react'
import { Toolbar } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<Toolbar
  items={[
    { icon: 'bold', label: 'Bold' },
    { icon: 'italic', label: 'Italic' },
    { icon: 'underline', label: 'Underline' },
    { icon: 'align-left', label: 'Align Left' },
    { icon: 'align-center', label: 'Align Center' },
    { icon: 'align-right', label: 'Align Right' },
  ]}
  dividerAfter={[2]}
/>`

const SIZES_CODE = `<Toolbar size="sm" items={items} dividerAfter={[2]} />
<Toolbar size="md" items={items} dividerAfter={[2]} />
<Toolbar size="lg" items={items} dividerAfter={[2]} />`

const toolbarItems = [
  { icon: 'bold', label: 'Bold' },
  { icon: 'italic', label: 'Italic' },
  { icon: 'underline', label: 'Underline' },
  { icon: 'align-left', label: 'Align Left' },
  { icon: 'align-center', label: 'Align Center' },
  { icon: 'align-right', label: 'Align Right' },
]

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'api',   label: 'API' },
]

export function ToolbarPage() {
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
        <h1>Toolbar</h1>
        <p className="docs-desc">
          Horizontal toolbar with icon buttons, dividers, and automatic overflow into a dropdown menu.
          Buttons that don't fit are collapsed into a "more" menu.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">
            A toolbar with icon buttons grouped by dividers. Resize the container to see overflow behavior.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ maxWidth: 320 }}>
              <Toolbar items={toolbarItems} dividerAfter={[2]} />
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Three sizes: sm, md (default), and lg.</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
              <Toolbar size="sm" items={toolbarItems} dividerAfter={[2]} />
              <Toolbar size="md" items={toolbarItems} dividerAfter={[2]} />
              <Toolbar size="lg" items={toolbarItems} dividerAfter={[2]} />
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Toolbar Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>items</code></td><td><code>ToolbarButtonItem[]</code></td><td>—</td><td>Array of button definitions</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Toolbar size</td></tr>
                <tr><td><code>dividerAfter</code></td><td><code>number[]</code></td><td><code>[]</code></td><td>Indices after which to insert dividers</td></tr>
              </tbody>
            </table>
          </div>
          <h3 style={{ marginTop: 16 }}>ToolbarButtonItem</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>icon</code></td><td><code>string</code></td><td>Icon name</td></tr>
                <tr><td><code>label</code></td><td><code>string</code></td><td>Button label (shown in tooltip and overflow menu)</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td>Disable this button</td></tr>
                <tr><td><code>priority</code></td><td><code>number</code></td><td>Overflow priority (higher stays visible longer)</td></tr>
                <tr><td><code>onClick</code></td><td><code>() =&gt; void</code></td><td>Click handler</td></tr>
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
