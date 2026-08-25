import { useState, useEffect, useRef } from 'react'
import { Combobox } from 'spruce-react'
import type { ComboboxOption } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const countries: ComboboxOption[] = [
  { label: 'Argentina', value: 'ar' }, { label: 'Australia', value: 'au' },
  { label: 'Brazil', value: 'br' }, { label: 'Canada', value: 'ca' },
  { label: 'China', value: 'cn' }, { label: 'France', value: 'fr' },
  { label: 'Germany', value: 'de' }, { label: 'India', value: 'in' },
  { label: 'Japan', value: 'jp' }, { label: 'Mexico', value: 'mx' },
  { label: 'United Kingdom', value: 'gb' }, { label: 'United States', value: 'us' },
]

const BASIC_CODE = `<Combobox
  options={countries}
  placeholder="Search countries..."
  onChange={(v) => console.log(v)}
/>`

const MULTIPLE_CODE = `<Combobox
  options={countries}
  multiple
  placeholder="Search countries..."
/>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',    label: 'Basic' },
  { id: 'multiple', label: 'Multiple' },
  { id: 'api',      label: 'API' },
]

export function ComboboxPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [val, setVal] = useState<string | string[]>('')
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    )
    mainRef.current?.querySelectorAll('section[id]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Combobox</h1>
        <p className="docs-desc">
          Searchable dropdown with text input for filtering. Supports single and multiple selection,
          chips, keyboard navigation, and clear button.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">Type to filter options. Select an option or use keyboard navigation.</p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ maxWidth: 320 }}>
              <Combobox options={countries} placeholder="Search countries..." value={val} onChange={setVal} />
            </div>
          </CodePreview>
          {val && <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginTop: 8 }}>Selected: <code>{String(val)}</code></p>}
        </section>

        <section id="multiple" className="demo-section" aria-labelledby="multiple-heading">
          <h2 id="multiple-heading">Multiple</h2>
          <p className="section-desc">
            Multi-select with chips. Type to filter, click to toggle. Backspace removes the last chip.
          </p>
          <CodePreview code={MULTIPLE_CODE}>
            <div style={{ maxWidth: 360 }}>
              <Combobox options={countries} multiple placeholder="Search countries..." />
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>options</code></td><td><code>ComboboxOption[]</code></td><td>—</td><td>Options to search</td></tr>
                <tr><td><code>source</code></td><td><code>LookupSource</code></td><td>—</td><td>Array, readable data source, or URL</td></tr>
                <tr><td><code>value</code></td><td><code>string | string[]</code></td><td>—</td><td>Controlled value</td></tr>
                <tr><td><code>onChange</code></td><td><code>(value) =&gt; void</code></td><td>—</td><td>Selection callback</td></tr>
                <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>'Search...'</code></td><td>Input placeholder</td></tr>
                <tr><td><code>multiple</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Multi-select mode</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the combobox</td></tr>
                <tr><td><code>renderOption</code></td><td><code>(context) =&gt; ReactNode</code></td><td>—</td><td>Custom option renderer</td></tr>
                <tr><td><code>virtualPaging</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enable remote/page navigation</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{SECTIONS.map(s => (<li key={s.id}><a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</a></li>))}</ul></nav>
    </div>
  )
}
