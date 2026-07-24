import { useState, useEffect, useRef } from 'react'
import { MaskedInput } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const PHONE_CODE = `<MaskedInput mask="(999) 999-9999" placeholder="Phone number" />`

const DATE_CODE = `<MaskedInput mask="99/99/9999" placeholder="MM/DD/YYYY" />`

const CREDIT_CARD_CODE = `<MaskedInput mask="9999 9999 9999 9999" placeholder="Card number" />`

const CUSTOM_CODE = `{/* Only digits */}
<MaskedInput mask="99999" placeholder="ZIP code" />

{/* Only letters */}
<MaskedInput mask="aaa-aaa" placeholder="Code (letters only)" />

{/* Alphanumeric */}
<MaskedInput mask="***-***" placeholder="License key" />`

const SIZES_CODE = `<MaskedInput mask="(999) 999-9999" size="sm" />
<MaskedInput mask="(999) 999-9999" size="md" />
<MaskedInput mask="(999) 999-9999" size="lg" />`

const STATES_CODE = `<MaskedInput mask="(999) 999-9999" error="Invalid phone number" />
<MaskedInput mask="(999) 999-9999" hint="US phone numbers only" />
<MaskedInput mask="(999) 999-9999" disabled />
<MaskedInput mask="(999) 999-9999" readOnly value="(555) 123-4567" />`

const RAW_CODE = `<MaskedInput
  mask="(999) 999-9999"
  onChange={(formatted) => console.log('Formatted:', formatted)}
  onRawChange={(raw) => console.log('Raw:', raw)}
/>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'phone',       label: 'Phone Number' },
  { id: 'date',        label: 'Date' },
  { id: 'credit-card', label: 'Credit Card' },
  { id: 'custom',      label: 'Custom Patterns' },
  { id: 'sizes',       label: 'Sizes' },
  { id: 'states',      label: 'States' },
  { id: 'raw',         label: 'Raw vs Formatted' },
  { id: 'api',         label: 'API' },
]

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--sp-text-xs, 11px)',
  color: 'var(--sp-text-muted, #4a5568)',
  marginBottom: 4,
}

export function MaskedInputPage() {
  const [activeSection, setActiveSection] = useState('phone')
  const [formatted, setFormatted] = useState('')
  const [raw, setRaw] = useState('')
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
        <h1>Masked Input</h1>
        <p className="docs-desc">
          Text input with an automatic formatting mask. Literal separators are inserted automatically
          as you type. Mask characters: <code>9</code> = digit, <code>a</code> = letter,
          <code>*</code> = alphanumeric.
        </p>

        <section id="phone" className="demo-section" aria-labelledby="phone-heading">
          <h2 id="phone-heading">Phone Number</h2>
          <p className="section-desc">Format a US phone number with automatic parentheses and dashes.</p>
          <CodePreview code={PHONE_CODE}>
            <div style={{ maxWidth: 320 }}>
              <MaskedInput mask="(999) 999-9999" placeholder="Phone number" clearable />
            </div>
          </CodePreview>
        </section>

        <section id="date" className="demo-section" aria-labelledby="date-heading">
          <h2 id="date-heading">Date</h2>
          <p className="section-desc">A date input with automatic slash separators.</p>
          <CodePreview code={DATE_CODE}>
            <div style={{ maxWidth: 200 }}>
              <MaskedInput mask="99/99/9999" placeholder="MM/DD/YYYY" />
            </div>
          </CodePreview>
        </section>

        <section id="credit-card" className="demo-section" aria-labelledby="credit-card-heading">
          <h2 id="credit-card-heading">Credit Card</h2>
          <p className="section-desc">Format a 16-digit card number with space separators.</p>
          <CodePreview code={CREDIT_CARD_CODE}>
            <div style={{ maxWidth: 260 }}>
              <MaskedInput mask="9999 9999 9999 9999" placeholder="Card number" />
            </div>
          </CodePreview>
        </section>

        <section id="custom" className="demo-section" aria-labelledby="custom-heading">
          <h2 id="custom-heading">Custom Patterns</h2>
          <p className="section-desc">
            Use <code>9</code> for digits, <code>a</code> for letters, and <code>*</code> for
            alphanumeric characters. Any other character is treated as a literal separator.
          </p>
          <CodePreview code={CUSTOM_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
              <div>
                <p style={labelStyle}>Digits only (ZIP code)</p>
                <MaskedInput mask="99999" placeholder="ZIP code" />
              </div>
              <div>
                <p style={labelStyle}>Letters only</p>
                <MaskedInput mask="aaa-aaa" placeholder="Code (letters only)" />
              </div>
              <div>
                <p style={labelStyle}>Alphanumeric (license key)</p>
                <MaskedInput mask="***-***" placeholder="License key" />
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Available in small, medium (default), and large sizes.</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
              <div>
                <p style={labelStyle}>Small</p>
                <MaskedInput mask="(999) 999-9999" size="sm" />
              </div>
              <div>
                <p style={labelStyle}>Medium (default)</p>
                <MaskedInput mask="(999) 999-9999" size="md" />
              </div>
              <div>
                <p style={labelStyle}>Large</p>
                <MaskedInput mask="(999) 999-9999" size="lg" />
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="states" className="demo-section" aria-labelledby="states-heading">
          <h2 id="states-heading">States</h2>
          <p className="section-desc">Error, hint, disabled, and read-only states.</p>
          <CodePreview code={STATES_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
              <MaskedInput mask="(999) 999-9999" error="Invalid phone number" />
              <MaskedInput mask="(999) 999-9999" hint="US phone numbers only" />
              <MaskedInput mask="(999) 999-9999" disabled />
              <MaskedInput mask="(999) 999-9999" readOnly value="(555) 123-4567" />
            </div>
          </CodePreview>
        </section>

        <section id="raw" className="demo-section" aria-labelledby="raw-heading">
          <h2 id="raw-heading">Raw vs Formatted</h2>
          <p className="section-desc">
            <code>onChange</code> provides the formatted value (with separators).
            <code>onRawChange</code> provides only the user-entered characters, without separators.
          </p>
          <CodePreview code={RAW_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
              <MaskedInput
                mask="(999) 999-9999"
                onChange={setFormatted}
                onRawChange={setRaw}
              />
              <p style={{ fontSize: 13, color: 'var(--sp-text-subtle, #718096)', margin: 0 }}>
                Formatted: <code>{formatted || '—'}</code>
              </p>
              <p style={{ fontSize: 13, color: 'var(--sp-text-subtle, #718096)', margin: 0 }}>
                Raw: <code>{raw || '—'}</code>
              </p>
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
                <tr><td><code>mask</code></td><td><code>string</code></td><td>—</td><td>Required. Mask pattern (9=digit, a=letter, *=alphanumeric)</td></tr>
                <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Controlled formatted value</td></tr>
                <tr><td><code>onChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Called with formatted value (includes separators)</td></tr>
                <tr><td><code>onRawChange</code></td><td><code>(raw: string) =&gt; void</code></td><td>—</td><td>Called with only user-entered characters</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Input size</td></tr>
                <tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>Custom placeholder (overrides mask guide)</td></tr>
                <tr><td><code>showMaskGuide</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show mask pattern as placeholder</td></tr>
                <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show clear button</td></tr>
                <tr><td><code>iconLeft</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Left icon name</td></tr>
                <tr><td><code>iconRight</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Right icon name</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the input</td></tr>
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
