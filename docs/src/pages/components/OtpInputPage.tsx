import { useState, useEffect, useRef } from 'react'
import { OtpInput } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<OtpInput length={6} onComplete={(val) => console.log('Complete:', val)} />`

const LENGTHS_CODE = `<OtpInput length={4} />
<OtpInput length={6} />
<OtpInput length={8} />`

const SEPARATOR_CODE = `<OtpInput length={6} separator />
<OtpInput length={6} separator separatorChar="·" />`

const SIZES_CODE = `<OtpInput length={6} size="sm" />
<OtpInput length={6} size="md" />
<OtpInput length={6} size="lg" />`

const STATES_CODE = `<OtpInput length={6} error="Invalid code. Please try again." />
<OtpInput length={6} hint="Check your email for the 6-digit code." />
<OtpInput length={6} disabled />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',      label: 'Basic' },
  { id: 'lengths',    label: 'Lengths' },
  { id: 'separator',  label: 'With Separator' },
  { id: 'sizes',      label: 'Sizes' },
  { id: 'states',     label: 'States' },
  { id: 'api',        label: 'API' },
]

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--sp-text-xs, 11px)',
  color: 'var(--sp-text-muted, #4a5568)',
  marginBottom: 4,
}

export function OtpInputPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [otp, setOtp] = useState('')
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
        <h1>OTP Input</h1>
        <p className="docs-desc">
          One-time password input with individual digit cells. Supports keyboard navigation,
          paste, separator, multiple sizes, and validation states.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">
            A 6-digit OTP input. Focus moves automatically as digits are entered.
            Use Backspace to delete, and ArrowLeft/ArrowRight to navigate.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <OtpInput length={6} value={otp} onChange={setOtp} onComplete={(val) => console.log('Complete:', val)} />
              {otp && (
                <p style={{ fontSize: 13, color: 'var(--sp-text-subtle, #718096)', margin: 0 }}>
                  Value: <code>{otp}</code>
                </p>
              )}
            </div>
          </CodePreview>
        </section>

        <section id="lengths" className="demo-section" aria-labelledby="lengths-heading">
          <h2 id="lengths-heading">Lengths</h2>
          <p className="section-desc">Configure the number of cells with the <code>length</code> prop.</p>
          <CodePreview code={LENGTHS_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <p style={labelStyle}>4 digits</p>
                <OtpInput length={4} />
              </div>
              <div>
                <p style={labelStyle}>6 digits</p>
                <OtpInput length={6} />
              </div>
              <div>
                <p style={labelStyle}>8 digits</p>
                <OtpInput length={8} />
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="separator" className="demo-section" aria-labelledby="separator-heading">
          <h2 id="separator-heading">With Separator</h2>
          <p className="section-desc">
            Show a separator character in the middle of the cells. Customise with <code>separatorChar</code>.
          </p>
          <CodePreview code={SEPARATOR_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <OtpInput length={6} separator />
              <OtpInput length={6} separator separatorChar="·" />
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Three cell sizes: sm, md (default), and lg.</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <p style={labelStyle}>Small</p>
                <OtpInput length={6} size="sm" />
              </div>
              <div>
                <p style={labelStyle}>Medium (default)</p>
                <OtpInput length={6} size="md" />
              </div>
              <div>
                <p style={labelStyle}>Large</p>
                <OtpInput length={6} size="lg" />
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="states" className="demo-section" aria-labelledby="states-heading">
          <h2 id="states-heading">States</h2>
          <p className="section-desc">Error, hint, and disabled states.</p>
          <CodePreview code={STATES_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <OtpInput length={6} error="Invalid code. Please try again." />
              <OtpInput length={6} hint="Check your email for the 6-digit code." />
              <OtpInput length={6} disabled />
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
                <tr><td><code>value</code></td><td><code>string</code></td><td><code>''</code></td><td>Controlled OTP value</td></tr>
                <tr><td><code>onChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Called on each digit change</td></tr>
                <tr><td><code>onComplete</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Called when all digits are filled</td></tr>
                <tr><td><code>length</code></td><td><code>number</code></td><td><code>6</code></td><td>Number of input cells</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Cell size</td></tr>
                <tr><td><code>separator</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show separator in middle</td></tr>
                <tr><td><code>separatorChar</code></td><td><code>string</code></td><td><code>'-'</code></td><td>Character used as separator</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable all cells</td></tr>
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
