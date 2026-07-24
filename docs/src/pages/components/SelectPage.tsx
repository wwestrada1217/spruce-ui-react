import { useState, useEffect, useRef } from 'react'
import { Select } from 'spruce-react'
import type { SelectOption } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const fruits: SelectOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
  { label: 'Fig', value: 'fig' },
  { label: 'Grape', value: 'grape' },
]

const BASIC_CODE = `<Select
  options={[
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ]}
  placeholder="Select a fruit"
  onChange={(v) => console.log(v)}
/>`

const MULTIPLE_CODE = `<Select
  options={fruits}
  multiple
  placeholder="Select fruits"
  onChange={(v) => console.log(v)}
/>`

const SIZES_CODE = `<Select options={fruits} size="sm" placeholder="Small" />
<Select options={fruits} size="md" placeholder="Medium" />
<Select options={fruits} size="lg" placeholder="Large" />`

const DISABLED_CODE = `<Select
  options={[
    { label: 'Active', value: 'a' },
    { label: 'Disabled option', value: 'b', disabled: true },
    { label: 'Another', value: 'c' },
  ]}
  placeholder="With disabled option"
/>`

const ERROR_CODE = `<Select options={fruits} error="Please select a fruit" placeholder="Required" />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',    label: 'Basic' },
  { id: 'multiple', label: 'Multiple' },
  { id: 'sizes',    label: 'Sizes' },
  { id: 'disabled', label: 'Disabled Option' },
  { id: 'error',    label: 'Error State' },
  { id: 'api',      label: 'API' },
]

export function SelectPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [val, setVal] = useState<string | string[]>('')
  const [multiVal, setMultiVal] = useState<string | string[]>([])
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
        <h1>Select</h1>
        <p className="docs-desc">
          Dropdown select with single and multiple selection modes. Supports keyboard navigation,
          disabled options, chips for multi-select, and error state.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">Click the trigger to open a dropdown list. Select an option to close.</p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ maxWidth: 300 }}>
              <Select options={fruits} placeholder="Select a fruit" value={val} onChange={setVal} />
            </div>
          </CodePreview>
          {val && <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginTop: 8 }}>Selected: <code>{String(val)}</code></p>}
        </section>

        <section id="multiple" className="demo-section" aria-labelledby="multiple-heading">
          <h2 id="multiple-heading">Multiple</h2>
          <p className="section-desc">
            Enable multi-select with chips. Click options to toggle. Remove chips with the X button.
          </p>
          <CodePreview code={MULTIPLE_CODE}>
            <div style={{ maxWidth: 360 }}>
              <Select options={fruits} multiple placeholder="Select fruits" value={multiVal} onChange={setMultiVal} />
            </div>
          </CodePreview>
          {Array.isArray(multiVal) && multiVal.length > 0 && (
            <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginTop: 8 }}>Selected: <code>{multiVal.join(', ')}</code></p>
          )}
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Three sizes: sm, md (default), and lg.</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 300 }}>
              <Select options={fruits} size="sm" placeholder="Small" />
              <Select options={fruits} size="md" placeholder="Medium" />
              <Select options={fruits} size="lg" placeholder="Large" />
            </div>
          </CodePreview>
        </section>

        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled Option</h2>
          <p className="section-desc">Individual options can be disabled.</p>
          <CodePreview code={DISABLED_CODE}>
            <div style={{ maxWidth: 300 }}>
              <Select options={[
                { label: 'Active', value: 'a' },
                { label: 'Disabled option', value: 'b', disabled: true },
                { label: 'Another', value: 'c' },
              ]} placeholder="With disabled option" />
            </div>
          </CodePreview>
        </section>

        <section id="error" className="demo-section" aria-labelledby="error-heading">
          <h2 id="error-heading">Error State</h2>
          <p className="section-desc">Show a validation error below the select.</p>
          <CodePreview code={ERROR_CODE}>
            <div style={{ maxWidth: 300 }}>
              <Select options={fruits} error="Please select a fruit" placeholder="Required" />
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
                <tr><td><code>options</code></td><td><code>SelectOption[]</code></td><td>—</td><td>Options array</td></tr>
                <tr><td><code>value</code></td><td><code>string | string[]</code></td><td>—</td><td>Controlled value</td></tr>
                <tr><td><code>onChange</code></td><td><code>(value) =&gt; void</code></td><td>—</td><td>Selection callback</td></tr>
                <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>'Select...'</code></td><td>Placeholder text</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Trigger size</td></tr>
                <tr><td><code>multiple</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Multi-select mode</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the select</td></tr>
                <tr><td><code>error</code></td><td><code>string</code></td><td>—</td><td>Error message</td></tr>
              </tbody>
            </table>
          </div>
          <h3 style={{ marginTop: 16 }}>SelectOption</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>label</code></td><td><code>string</code></td><td>Display text</td></tr>
                <tr><td><code>value</code></td><td><code>string</code></td><td>Selection value</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td>Disable this option</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{SECTIONS.map(s => (<li key={s.id}><a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</a></li>))}</ul></nav>
    </div>
  )
}
