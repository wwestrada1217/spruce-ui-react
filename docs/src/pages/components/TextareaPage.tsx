import { useState, useEffect, useRef } from 'react'
import { Textarea } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<Textarea placeholder="Write your message..." />`

const CHAR_LIMIT_CODE = `<Textarea
  placeholder="Maximum 200 characters..."
  maxLength={200}
  showCount
/>`

const ROWS_CODE = `<Textarea placeholder="2 rows" rows={2} />
<Textarea placeholder="4 rows (default)" rows={4} />
<Textarea placeholder="8 rows" rows={8} />`

const RESIZE_CODE = `<Textarea placeholder="Resize: none" resize="none" />
<Textarea placeholder="Resize: vertical (default)" resize="vertical" />
<Textarea placeholder="Resize: horizontal" resize="horizontal" />
<Textarea placeholder="Resize: both" resize="both" />`

const SIZES_CODE = `<Textarea size="sm" placeholder="Small textarea" />
<Textarea size="md" placeholder="Medium textarea (default)" />
<Textarea size="lg" placeholder="Large textarea" />`

const STATES_CODE = `<Textarea placeholder="With error" error="This field is required" />
<Textarea placeholder="With hint" hint="Up to 500 characters allowed." />
<Textarea placeholder="Disabled" disabled />
<Textarea placeholder="Read-only" readOnly value="Read-only content" />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',      label: 'Basic' },
  { id: 'char-limit', label: 'Character Limit' },
  { id: 'rows',       label: 'Custom Rows' },
  { id: 'resize',     label: 'Resize Options' },
  { id: 'sizes',      label: 'Sizes' },
  { id: 'states',     label: 'States' },
  { id: 'api',        label: 'API' },
]

export function TextareaPage() {
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
        <h1>Textarea</h1>
        <p className="docs-desc">
          Multi-line text input with character counting, resize control, sizes, and validation states.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">A simple multi-line text field.</p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ maxWidth: 500 }}>
              <Textarea placeholder="Write your message..." />
            </div>
          </CodePreview>
        </section>

        <section id="char-limit" className="demo-section" aria-labelledby="char-limit-heading">
          <h2 id="char-limit-heading">Character Limit</h2>
          <p className="section-desc">
            Show a character counter by setting <code>maxLength</code> and <code>showCount</code>.
            The counter turns red when the limit is reached.
          </p>
          <CodePreview code={CHAR_LIMIT_CODE}>
            <div style={{ maxWidth: 500 }}>
              <Textarea placeholder="Maximum 200 characters..." maxLength={200} showCount />
            </div>
          </CodePreview>
        </section>

        <section id="rows" className="demo-section" aria-labelledby="rows-heading">
          <h2 id="rows-heading">Custom Rows</h2>
          <p className="section-desc">Control the visible height with the <code>rows</code> prop.</p>
          <CodePreview code={ROWS_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 500 }}>
              <Textarea placeholder="2 rows" rows={2} />
              <Textarea placeholder="4 rows (default)" rows={4} />
              <Textarea placeholder="8 rows" rows={8} />
            </div>
          </CodePreview>
        </section>

        <section id="resize" className="demo-section" aria-labelledby="resize-heading">
          <h2 id="resize-heading">Resize Options</h2>
          <p className="section-desc">Control how users can resize the textarea.</p>
          <CodePreview code={RESIZE_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 500 }}>
              <Textarea placeholder="Resize: none" resize="none" />
              <Textarea placeholder="Resize: vertical (default)" resize="vertical" />
              <Textarea placeholder="Resize: horizontal" resize="horizontal" />
              <Textarea placeholder="Resize: both" resize="both" />
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Three sizes for different UI contexts.</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 500 }}>
              <Textarea size="sm" placeholder="Small textarea" rows={2} />
              <Textarea size="md" placeholder="Medium textarea (default)" rows={2} />
              <Textarea size="lg" placeholder="Large textarea" rows={2} />
            </div>
          </CodePreview>
        </section>

        <section id="states" className="demo-section" aria-labelledby="states-heading">
          <h2 id="states-heading">States</h2>
          <p className="section-desc">Error, hint, disabled, and read-only states.</p>
          <CodePreview code={STATES_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 500 }}>
              <Textarea placeholder="With error" error="This field is required" rows={2} />
              <Textarea placeholder="With hint" hint="Up to 500 characters allowed." rows={2} />
              <Textarea placeholder="Disabled" disabled rows={2} />
              <Textarea placeholder="Read-only" readOnly value="Read-only content" rows={2} />
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
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Textarea size</td></tr>
                <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>''</code></td><td>Placeholder text</td></tr>
                <tr><td><code>rows</code></td><td><code>number</code></td><td><code>4</code></td><td>Visible row count</td></tr>
                <tr><td><code>resize</code></td><td><code>'none' | 'vertical' | 'horizontal' | 'both'</code></td><td><code>'vertical'</code></td><td>CSS resize behavior</td></tr>
                <tr><td><code>maxLength</code></td><td><code>number</code></td><td>—</td><td>Character limit</td></tr>
                <tr><td><code>showCount</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show character counter when maxLength is set</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the textarea</td></tr>
                <tr><td><code>readOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Read-only mode</td></tr>
                <tr><td><code>error</code></td><td><code>string</code></td><td>—</td><td>Error message shown below</td></tr>
                <tr><td><code>hint</code></td><td><code>string</code></td><td>—</td><td>Hint text shown below</td></tr>
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
