import { useState, useEffect, useRef } from 'react'
import { ButtonGroup } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<ButtonGroup
  items={[
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ]}
  variant="outline"
/>`

const TOGGLE_CODE = `<ButtonGroup
  toggleMode="single"
  items={[
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ]}
  variant="outline"
/>`

const MULTI_CODE = `<ButtonGroup
  toggleMode="multiple"
  items={[
    { label: 'Bold', value: 'bold', icon: 'bold' },
    { label: 'Italic', value: 'italic', icon: 'italic' },
    { label: 'Underline', value: 'underline', icon: 'underline' },
  ]}
  variant="outline"
/>`

const VERTICAL_CODE = `<ButtonGroup orientation="vertical" items={items} variant="outline" />`

const items = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
]

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',    label: 'Basic' },
  { id: 'toggle',   label: 'Single Toggle' },
  { id: 'multi',    label: 'Multiple Toggle' },
  { id: 'vertical', label: 'Vertical' },
  { id: 'api',      label: 'API' },
]

export function ButtonGroupPage() {
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
        <h1>Button Group</h1>
        <p className="docs-desc">Group of connected buttons for related actions or toggle selections. Supports single and multiple toggle modes.</p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">Connected buttons sharing border radius.</p>
          <CodePreview code={BASIC_CODE}>
            <ButtonGroup items={items} variant="outline" />
          </CodePreview>
        </section>

        <section id="toggle" className="demo-section" aria-labelledby="toggle-heading">
          <h2 id="toggle-heading">Single Toggle</h2>
          <p className="section-desc">Radio-like selection where only one button can be active.</p>
          <CodePreview code={TOGGLE_CODE}>
            <ButtonGroup toggleMode="single" items={[{ label: 'Day', value: 'day' }, { label: 'Week', value: 'week' }, { label: 'Month', value: 'month' }]} variant="outline" />
          </CodePreview>
        </section>

        <section id="multi" className="demo-section" aria-labelledby="multi-heading">
          <h2 id="multi-heading">Multiple Toggle</h2>
          <p className="section-desc">Checkbox-like selection where multiple buttons can be active simultaneously.</p>
          <CodePreview code={MULTI_CODE}>
            <ButtonGroup toggleMode="multiple" items={[{ label: 'Bold', value: 'bold', icon: 'bold' }, { label: 'Italic', value: 'italic', icon: 'italic' }, { label: 'Underline', value: 'underline', icon: 'underline' }]} variant="outline" />
          </CodePreview>
        </section>

        <section id="vertical" className="demo-section" aria-labelledby="vertical-heading">
          <h2 id="vertical-heading">Vertical</h2>
          <p className="section-desc">Stack buttons vertically.</p>
          <CodePreview code={VERTICAL_CODE}>
            <ButtonGroup orientation="vertical" items={items} variant="outline" />
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2><h3>Props</h3>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>items</code></td><td><code>ButtonGroupItem[]</code></td><td>—</td><td>Button definitions</td></tr>
            <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Layout direction</td></tr>
            <tr><td><code>toggleMode</code></td><td><code>'none' | 'single' | 'multiple'</code></td><td><code>'none'</code></td><td>Selection behavior</td></tr>
            <tr><td><code>value</code></td><td><code>string[]</code></td><td><code>[]</code></td><td>Selected values</td></tr>
            <tr><td><code>onChange</code></td><td><code>(value: string[]) =&gt; void</code></td><td>—</td><td>Selection callback</td></tr>
            <tr><td><code>variant</code></td><td><code>string</code></td><td><code>'outline'</code></td><td>Button variant</td></tr>
            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Button size</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{SECTIONS.map(s => (<li key={s.id}><a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</a></li>))}</ul></nav>
    </div>
  )
}
