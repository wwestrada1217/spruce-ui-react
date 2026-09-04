import { useState, useEffect, useRef } from 'react'
import { Input } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { DocsPackageBadge } from '../../components/DocsPackageBadge'

const BASIC_CODE = `<Input placeholder="Enter text..." />
<Input placeholder="Search..." iconLeft="search" clearable />
<Input placeholder="Email" error="Invalid email address" />
<Input placeholder="Username" hint="3-20 characters, letters and numbers only" />
<Input placeholder="Disabled" disabled />
<Input type="password" placeholder="Password" iconLeft="check" />`

const VARIANTS_CODE = `<Input label="Outline form field" variant="outline" placeholder="Placeholder" />
<Input label="Filled form field" variant="filled" placeholder="Placeholder" />
<Input label="Required outline" variant="outline" required value="Pre-filled value" />`

const SIZES_CODE = `<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />`

const ICONS_CODE = `<Input iconLeft="search" placeholder="Search..." />
<Input iconRight="mail" placeholder="Email address" />
<Input iconLeft="user" iconRight="check" placeholder="Username" />`

const CLEARABLE_CODE = `<Input placeholder="Clearable input" clearable />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',     label: 'Basic' },
  { id: 'variants',  label: 'Floating Labels & Variants' },
  { id: 'sizes',     label: 'Sizes' },
  { id: 'icons',     label: 'With Icons' },
  { id: 'clearable', label: 'Clearable' },
  { id: 'api',       label: 'API' },
]

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--sp-text-xs, 11px)',
  fontWeight: 600,
  color: 'var(--sp-text-muted, #4a5568)',
  marginBottom: 4,
}

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}

export function InputPage() {
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
        <h1>Input</h1>
        <p className="docs-desc">
          A versatile text input with support for floating labels, visual variants, icons, clearable
          state, validation errors, and hints.
        </p>
        <DocsPackageBadge packageName="spruce-react" symbols={['Input']} />

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">
            Input supports various configurations including icons, clearable state, error and hint messages.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Default</label>
                <Input placeholder="Enter text..." />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>With icons</label>
                <Input placeholder="Search..." iconLeft="search" clearable />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>With error</label>
                <Input placeholder="Email" error="Invalid email address" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>With hint</label>
                <Input placeholder="Username" hint="3-20 characters, letters and numbers only" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Disabled</label>
                <Input placeholder="Disabled" disabled />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Password</label>
                <Input type="password" placeholder="Password" iconLeft="check" />
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="variants" className="demo-section" aria-labelledby="variants-heading">
          <h2 id="variants-heading">Floating Labels &amp; Variants</h2>
          <p className="section-desc">
            Use <code>variant="outline"</code> or <code>variant="filled"</code> with a label for
            a floating-label field treatment.
          </p>
          <CodePreview code={VARIANTS_CODE} language="typescript">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <Input label="Outline form field" variant="outline" placeholder="Placeholder" />
              <Input label="Filled form field" variant="filled" placeholder="Placeholder" />
              <Input label="Required outline" variant="outline" required defaultValue="Pre-filled value" />
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Available in small, medium (default), and large sizes.</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label style={labelStyle}>Small</label>
                <Input size="sm" placeholder="Small" />
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label style={labelStyle}>Medium</label>
                <Input size="md" placeholder="Medium" />
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label style={labelStyle}>Large</label>
                <Input size="lg" placeholder="Large" />
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="icons" className="demo-section" aria-labelledby="icons-heading">
          <h2 id="icons-heading">With Icons</h2>
          <p className="section-desc">Add icons on the left or right side of the input for visual context.</p>
          <CodePreview code={ICONS_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
              <Input iconLeft="search" placeholder="Search..." />
              <Input iconRight="mail" placeholder="Email address" />
              <Input iconLeft="user" iconRight="check" placeholder="Username" />
            </div>
          </CodePreview>
        </section>

        <section id="clearable" className="demo-section" aria-labelledby="clearable-heading">
          <h2 id="clearable-heading">Clearable</h2>
          <p className="section-desc">Add a clear button to let users quickly reset the input value.</p>
          <CodePreview code={CLEARABLE_CODE}>
            <div style={{ maxWidth: 360 }}>
              <Input placeholder="Type something to clear..." clearable />
            </div>
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
                <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Controlled value</td></tr>
                <tr><td><code>defaultValue</code></td><td><code>string</code></td><td><code>''</code></td><td>Initial value (uncontrolled)</td></tr>
                <tr><td><code>onChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Change callback</td></tr>
                <tr><td><code>type</code></td><td><code>'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'</code></td><td><code>'text'</code></td><td>Input type</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Input size</td></tr>
                <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>''</code></td><td>Placeholder text</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable input</td></tr>
                <tr><td><code>readOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Read-only mode</td></tr>
                <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show clear button</td></tr>
                <tr><td><code>iconLeft</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Left icon name</td></tr>
                <tr><td><code>iconRight</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Right icon name</td></tr>
                <tr><td><code>error</code></td><td><code>string</code></td><td>—</td><td>Error message shown below input</td></tr>
                <tr><td><code>hint</code></td><td><code>string</code></td><td>—</td><td>Hint text shown below input</td></tr>
                <tr><td><code>min</code></td><td><code>number</code></td><td>—</td><td>Min value (number input)</td></tr>
                <tr><td><code>max</code></td><td><code>number</code></td><td>—</td><td>Max value (number input)</td></tr>
                <tr><td><code>step</code></td><td><code>number</code></td><td>—</td><td>Step value (number input)</td></tr>
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
              <a
                className={`toc-link${activeSection === s.id ? ' active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
