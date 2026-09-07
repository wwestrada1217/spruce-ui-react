import { useState, useEffect, useRef } from 'react'
import { DateTimePicker } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { DocsPackageBadge } from '../../components/DocsPackageBadge'
import { DateControlContractRows } from '../../components/DateControlContractRows'

const BASIC_CODE = `<DateTimePicker placeholder="Select date & time" onChange={(v) => console.log(v)} />`
const FORMAT_CODE = `<DateTimePicker use24Hour placeholder="24-hour format" />`
const SECONDS_CODE = `<DateTimePicker showSeconds placeholder="With seconds" />`
const INPUT_CODE = `<DateTimePicker inputMode placeholder="MM/DD/YYYY hh:MM AM" />`
const SIZES_CODE = `<DateTimePicker size="sm" placeholder="Small" />
<DateTimePicker size="md" placeholder="Medium" />
<DateTimePicker size="lg" placeholder="Large" />`
const OTHER_MONTHS_CODE = `<DateTimePicker showOtherMonths selectOtherMonths placeholder="Adjacent dates selectable" />
<DateTimePicker showOtherMonths selectOtherMonths={false} placeholder="Adjacent dates disabled" />`
const DISABLED_CODE = `<DateTimePicker disabled placeholder="Disabled" />`
const FIELD_STATE_CODE = `<DateTimePicker
  inputMode
  label="Publish at"
  floatingLabel
  variant="outline"
  required
  error="Choose a publication date and time."
  placement="top-end"
/>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',      label: 'Basic' },
  { id: 'format',     label: '24-Hour Format' },
  { id: 'seconds',    label: 'With Seconds' },
  { id: 'input-mode', label: 'Input Mode' },
  { id: 'sizes',      label: 'Sizes' },
  { id: 'other-months', label: 'Other Months' },
  { id: 'disabled',   label: 'Disabled' },
  { id: 'field-state', label: 'Field & Overlay API' },
  { id: 'api',        label: 'API' },
]

export function DateTimePickerPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [dt1, setDt1] = useState<string | null>(null)
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
        <h1>Datetime Picker</h1>
        <p className="docs-desc">
          Combined date and time selection in a single dropdown. Calendar grid on top, time spinners below.
        </p>
        <DocsPackageBadge packageName="spruce-react" symbols={['DateTimePicker']} />

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">Click the trigger to open a combined calendar and time spinner panel.</p>
          <CodePreview code={BASIC_CODE}>
            <DateTimePicker placeholder="Select date & time" onChange={setDt1} />
          </CodePreview>
          {dt1 && <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)' }}>Selected: <code>{dt1}</code></p>}
        </section>

        <section id="format" className="demo-section" aria-labelledby="format-heading">
          <h2 id="format-heading">24-Hour Format</h2>
          <p className="section-desc">Use 24-hour time format without AM/PM toggle.</p>
          <CodePreview code={FORMAT_CODE}>
            <DateTimePicker use24Hour placeholder="24-hour format" />
          </CodePreview>
        </section>

        <section id="seconds" className="demo-section" aria-labelledby="seconds-heading">
          <h2 id="seconds-heading">With Seconds</h2>
          <p className="section-desc">Add a seconds spinner column.</p>
          <CodePreview code={SECONDS_CODE}>
            <DateTimePicker showSeconds placeholder="With seconds" />
          </CodePreview>
        </section>

        <section id="input-mode" className="demo-section" aria-labelledby="input-mode-heading">
          <h2 id="input-mode-heading">Input Mode</h2>
          <p className="section-desc">
            Text input mode lets users type a date and time directly or use the toggle to open the panel.
          </p>
          <CodePreview code={INPUT_CODE}>
            <DateTimePicker inputMode placeholder="MM/DD/YYYY hh:MM AM" />
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Three sizes: sm, md (default), and lg.</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
              <DateTimePicker size="sm" placeholder="Small" />
              <DateTimePicker size="md" placeholder="Medium" />
              <DateTimePicker size="lg" placeholder="Large" />
            </div>
          </CodePreview>
        </section>

        <section id="other-months" className="demo-section" aria-labelledby="other-months-heading">
          <h2 id="other-months-heading">Other Months</h2>
          <p className="section-desc">Show adjacent-month dates in a subtle color. They are selectable by default and can be disabled independently.</p>
          <CodePreview code={OTHER_MONTHS_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
              <DateTimePicker showOtherMonths selectOtherMonths placeholder="Adjacent dates selectable" />
              <DateTimePicker showOtherMonths selectOtherMonths={false} placeholder="Adjacent dates disabled" />
            </div>
          </CodePreview>
        </section>

        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled</h2>
          <p className="section-desc">Disable the picker.</p>
          <CodePreview code={DISABLED_CODE}>
            <DateTimePicker disabled placeholder="Disabled" />
          </CodePreview>
        </section>

        <section id="field-state" className="demo-section" aria-labelledby="field-state-heading">
          <h2 id="field-state-heading">Field and overlay contract</h2>
          <p className="section-desc">DateTimePicker combines visible labels and field variants with shared validation, placement, modal constraints, and dismissal controls.</p>
          <CodePreview code={FIELD_STATE_CODE} language="typescript">
            <DateTimePicker inputMode label="Publish at" floatingLabel variant="outline" required error="Choose a publication date and time." placement="top-end" />
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
                <tr><td><code>value</code></td><td><code>string | null</code></td><td><code>null</code></td><td>ISO datetime (YYYY-MM-DDTHH:MM or YYYY-MM-DDTHH:MM:SS)</td></tr>
                <tr><td><code>onChange</code></td><td><code>(value: string | null) =&gt; void</code></td><td>—</td><td>Called on Apply or Clear</td></tr>
                <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>'Select date &amp; time'</code></td><td>Trigger placeholder</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Trigger/input size</td></tr>
                <tr><td><code>use24Hour</code></td><td><code>boolean</code></td><td><code>false</code></td><td>24-hour time format</td></tr>
                <tr><td><code>showSeconds</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show seconds spinner</td></tr>
                <tr><td><code>inputMode</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Text input with toggle</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the picker</td></tr>
                <tr><td><code>showOtherMonths</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show dates from adjacent months</td></tr>
                <tr><td><code>selectOtherMonths</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Allow selecting visible adjacent-month dates</td></tr>
                <DateControlContractRows overlays variants />
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
