import { useState, useEffect, useRef } from 'react'
import { SplitButton } from 'spruce-react'
import type { SplitButtonItem } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const menuItems: SplitButtonItem[] = [
  { label: 'Save as draft', icon: 'file' },
  { label: 'Duplicate', icon: 'copy' },
  { separator: true, label: '' },
  { label: 'Delete', icon: 'trash-2', disabled: true },
]

const BASIC_CODE = `<SplitButton
  label="Save"
  items={[
    { label: 'Save as draft', icon: 'file' },
    { label: 'Duplicate', icon: 'copy' },
    { separator: true },
    { label: 'Delete', icon: 'trash-2', disabled: true },
  ]}
  onPrimaryClick={() => console.log('Save clicked')}
/>`

const VARIANTS_CODE = `<SplitButton label="Primary" variant="primary" items={items} />
<SplitButton label="Secondary" variant="secondary" items={items} />
<SplitButton label="Outline" variant="outline" items={items} />
<SplitButton label="Danger" variant="danger" items={items} />
<SplitButton label="Success" variant="success" items={items} />`

const SIZES_CODE = `<SplitButton label="Small" size="sm" items={items} />
<SplitButton label="Medium" size="md" items={items} />
<SplitButton label="Large" size="lg" items={items} />`

const DISABLED_CODE = `<SplitButton label="Disabled" disabled items={items} />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',    label: 'Basic' },
  { id: 'variants', label: 'Variants' },
  { id: 'sizes',    label: 'Sizes' },
  { id: 'disabled', label: 'Disabled' },
  { id: 'api',      label: 'API' },
]

export function SplitButtonPage() {
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
        <h1>Split Button</h1>
        <p className="docs-desc">
          A compound button with a primary action and a dropdown toggle for additional actions.
          Supports all button variants, sizes, loading state, and icons.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">
            Click the main button for the primary action. Click the dropdown arrow for more options.
          </p>
          <CodePreview code={BASIC_CODE}>
            <SplitButton label="Save" items={menuItems} onPrimaryClick={() => alert('Save clicked')} />
          </CodePreview>
        </section>

        <section id="variants" className="demo-section" aria-labelledby="variants-heading">
          <h2 id="variants-heading">Variants</h2>
          <p className="section-desc">All button color variants are supported.</p>
          <CodePreview code={VARIANTS_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <SplitButton label="Primary" variant="primary" items={menuItems} />
              <SplitButton label="Secondary" variant="secondary" items={menuItems} />
              <SplitButton label="Outline" variant="outline" items={menuItems} />
              <SplitButton label="Danger" variant="danger" items={menuItems} />
              <SplitButton label="Success" variant="success" items={menuItems} />
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Three sizes: sm, md (default), and lg.</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
              <SplitButton label="Small" size="sm" items={menuItems} />
              <SplitButton label="Medium" size="md" items={menuItems} />
              <SplitButton label="Large" size="lg" items={menuItems} />
            </div>
          </CodePreview>
        </section>

        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled</h2>
          <p className="section-desc">Disable both buttons simultaneously.</p>
          <CodePreview code={DISABLED_CODE}>
            <SplitButton label="Disabled" disabled items={menuItems} />
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>label</code></td><td><code>string</code></td><td><code>'Action'</code></td><td>Main button label</td></tr>
                <tr><td><code>variant</code></td><td><code>SplitButtonVariant</code></td><td><code>'primary'</code></td><td>Color variant</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Button size</td></tr>
                <tr><td><code>items</code></td><td><code>SplitButtonItem[]</code></td><td><code>[]</code></td><td>Dropdown menu items</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable both buttons</td></tr>
                <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show loading spinner</td></tr>
                <tr><td><code>iconLeft</code></td><td><code>string</code></td><td>—</td><td>Icon before label</td></tr>
                <tr><td><code>iconRight</code></td><td><code>string</code></td><td>—</td><td>Icon after label</td></tr>
                <tr><td><code>onPrimaryClick</code></td><td><code>(e: MouseEvent) =&gt; void</code></td><td>—</td><td>Main button click</td></tr>
                <tr><td><code>onItemSelect</code></td><td><code>(item: SplitButtonItem) =&gt; void</code></td><td>—</td><td>Dropdown item selected</td></tr>
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
