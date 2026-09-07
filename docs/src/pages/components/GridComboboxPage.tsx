import { useState, useEffect, useRef } from 'react'
import { GridCombobox } from 'spruce-react'
import type { GridComboboxColumn, GridComboboxOption } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { DocsPackageBadge } from '../../components/DocsPackageBadge'

const columns: GridComboboxColumn[] = [
  { key: 'name', label: 'Name', width: '1fr' },
  { key: 'code', label: 'Code', width: '80px' },
  { key: 'capital', label: 'Capital', width: '1fr' },
]

const options: GridComboboxOption[] = [
  { value: 'us', label: 'United States', name: 'United States', code: 'US', capital: 'Washington, D.C.' },
  { value: 'gb', label: 'United Kingdom', name: 'United Kingdom', code: 'GB', capital: 'London' },
  { value: 'fr', label: 'France', name: 'France', code: 'FR', capital: 'Paris' },
  { value: 'de', label: 'Germany', name: 'Germany', code: 'DE', capital: 'Berlin' },
  { value: 'jp', label: 'Japan', name: 'Japan', code: 'JP', capital: 'Tokyo' },
  { value: 'au', label: 'Australia', name: 'Australia', code: 'AU', capital: 'Canberra' },
  { value: 'br', label: 'Brazil', name: 'Brazil', code: 'BR', capital: 'Brasilia' },
  { value: 'ca', label: 'Canada', name: 'Canada', code: 'CA', capital: 'Ottawa' },
  { value: 'in', label: 'India', name: 'India', code: 'IN', capital: 'New Delhi' },
  { value: 'mx', label: 'Mexico', name: 'Mexico', code: 'MX', capital: 'Mexico City' },
]

const BASIC_CODE = `<GridCombobox
  columns={[
    { key: 'name', label: 'Name', width: '1fr' },
    { key: 'code', label: 'Code', width: '80px' },
    { key: 'capital', label: 'Capital', width: '1fr' },
  ]}
  options={countries}
  placeholder="Search countries..."
  filterBy={['name', 'code', 'capital']}
  onChange={(v) => console.log(v)}
/>`

const CHEVRON_CODE = `<GridCombobox
  columns={columns}
  options={options}
  showChevron
  placeholder="Choose a country"
  filterBy={['name', 'code', 'capital']}
/>`

const STYLE_CODE = `<GridCombobox
  columns={columns}
  options={options}
  resizableColumns
  showColumnLines
  stripedRows
  placeholder="Grid styling..."
  filterBy={['name', 'code', 'capital']}
/>`

const RESIZABLE_CODE = `<GridCombobox
  columns={columns}
  options={options}
  resizableColumns
  placeholder="Resize columns..."
/>`

const VIRTUAL_CODE = `<GridCombobox
  columns={columns}
  options={options}
  virtualScroll
  virtualPaging
  placeholder="Large data set..."
/>`

const CUSTOM_ROW_CODE = `<GridCombobox
  columns={columns}
  options={options}
  renderRow={({ option, selected }) => (
    <strong>{selected ? '✓ ' : ''}{option.label}</strong>
  )}
/>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'chevron', label: 'With Chevron' },
  { id: 'style', label: 'Header Lines & Stripes' },
  { id: 'resizable', label: 'Resizable Columns' },
  { id: 'virtual', label: 'Virtual Scrolling & Paging' },
  { id: 'custom-row', label: 'Custom Rows' },
  { id: 'api',   label: 'API' },
]

export function GridComboboxPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [val, setVal] = useState('')
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
        <h1>Grid Combobox</h1>
        <p className="docs-desc">
          Searchable combobox that displays options in a multi-column grid with sticky headers.
          Ideal for selecting from structured data like database records. Supports resizable
          columns, custom rows, virtual scrolling for larger sources, and an optional chevron indicator.
        </p>
        <DocsPackageBadge packageName="spruce-react" symbols={['GridCombobox', 'GridComboboxColumn', 'GridComboboxOption']} />

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">
            Type to filter across multiple columns. Use arrow keys to navigate, Enter to select.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ maxWidth: 480 }}>
              <GridCombobox
                columns={columns}
                options={options}
                placeholder="Search countries..."
                filterBy={['name', 'code', 'capital']}
                value={val}
                onChange={setVal}
              />
            </div>
          </CodePreview>
          {val && <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginTop: 8 }}>Selected: <code>{val}</code></p>}
        </section>

        <section id="chevron" className="demo-section" aria-labelledby="chevron-heading">
          <h2 id="chevron-heading">With Chevron</h2>
          <p className="section-desc">Set <code>showChevron</code> to add a clickable right-side chevron that toggles the dropdown and rotates when open.</p>
          <CodePreview code={CHEVRON_CODE} language="typescript">
            <div style={{ maxWidth: 480 }}>
              <GridCombobox columns={columns} options={options} showChevron placeholder="Choose a country" filterBy={['name', 'code', 'capital']} />
            </div>
          </CodePreview>
        </section>

        <section id="style" className="demo-section" aria-labelledby="style-heading">
          <h2 id="style-heading">Header Lines &amp; Stripes</h2>
          <p className="section-desc">Resizable columns enable vertical header lines by default. Use <code>showColumnLines</code> to control them explicitly, and <code>stripedRows</code> to add alternating row backgrounds.</p>
          <CodePreview code={STYLE_CODE} language="typescript">
            <div style={{ maxWidth: 520 }}>
              <GridCombobox columns={columns} options={options} resizableColumns showColumnLines stripedRows placeholder="Grid styling..." filterBy={['name', 'code', 'capital']} />
            </div>
          </CodePreview>
        </section>

        <section id="resizable" className="demo-section" aria-labelledby="resizable-heading">
          <h2 id="resizable-heading">Resizable Columns</h2>
          <p className="section-desc">Enable <code>resizableColumns</code> to let users adjust column widths with accessible resize handles.</p>
          <CodePreview code={RESIZABLE_CODE} language="typescript">
            <div style={{ maxWidth: 520 }}>
              <GridCombobox columns={columns} options={options} resizableColumns placeholder="Resize columns..." filterBy={['name', 'code', 'capital']} />
            </div>
          </CodePreview>
        </section>

        <section id="virtual" className="demo-section" aria-labelledby="virtual-heading">
          <h2 id="virtual-heading">Virtual Scrolling &amp; Paging</h2>
          <p className="section-desc">Combine <code>virtualScroll</code> and <code>virtualPaging</code> for large local or remote data sources.</p>
          <CodePreview code={VIRTUAL_CODE} language="typescript">
            <div style={{ maxWidth: 520 }}>
              <GridCombobox columns={columns} options={options} virtualScroll virtualPaging placeholder="Large data set..." filterBy={['name', 'code', 'capital']} />
            </div>
          </CodePreview>
        </section>

        <section id="custom-row" className="demo-section" aria-labelledby="custom-row-heading">
          <h2 id="custom-row-heading">Custom Rows</h2>
          <p className="section-desc">Use <code>renderRow</code> to emphasize selected state or add richer row content while the grid manages interaction.</p>
          <CodePreview code={CUSTOM_ROW_CODE} language="typescript">
            <div style={{ maxWidth: 480 }}>
              <GridCombobox columns={columns} options={options} placeholder="Choose a country" filterBy={['name', 'code', 'capital']} renderRow={({ option, selected }) => (
                <strong>{selected ? '✓ ' : ''}{option.label}</strong>
              )} />
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
                <tr><td><code>columns</code></td><td><code>GridComboboxColumn[]</code></td><td>—</td><td>Column definitions</td></tr>
                <tr><td><code>options</code></td><td><code>GridComboboxOption[]</code></td><td>—</td><td>Data rows</td></tr>
                <tr><td><code>source</code></td><td><code>LookupSource</code></td><td>—</td><td>Array, readable data source, or URL</td></tr>
                <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Selected value</td></tr>
                <tr><td><code>onChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Selection callback</td></tr>
                <tr><td><code>onSelect</code></td><td><code>(item) =&gt; void</code></td><td>—</td><td>Full item callback</td></tr>
                <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>'Search...'</code></td><td>Input placeholder</td></tr>
                <tr><td><code>filterBy</code></td><td><code>string | string[]</code></td><td><code>'label'</code></td><td>Keys to filter on</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the combobox</td></tr>
                <tr><td><code>showChevron</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show a clickable right-side chevron that rotates when open</td></tr>
                <tr><td><code>resizableColumns</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enable accessible column resize handles</td></tr>
                <tr><td><code>showColumnLines</code></td><td><code>boolean</code></td><td><code>resizableColumns</code></td><td>Show vertical lines between header columns; enabled by default when columns are resizable</td></tr>
                <tr><td><code>stripedRows</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show alternating row backgrounds</td></tr>
                <tr><td><code>renderRow</code></td><td><code>(context) =&gt; ReactNode</code></td><td>—</td><td>Custom row renderer</td></tr>
              </tbody>
            </table>
          </div>
          <h3 style={{ marginTop: 16 }}>GridComboboxColumn</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>key</code></td><td><code>string</code></td><td>Property key on option object</td></tr>
                <tr><td><code>label</code></td><td><code>string</code></td><td>Column header text</td></tr>
                <tr><td><code>width</code></td><td><code>string</code></td><td>CSS grid track size (default '1fr')</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{SECTIONS.map(s => (<li key={s.id}><a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</a></li>))}</ul></nav>
    </div>
  )
}
