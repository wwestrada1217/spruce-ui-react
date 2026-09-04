import { useState, useEffect, useRef } from 'react'
import { DatePicker } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { DocsPackageBadge } from '../../components/DocsPackageBadge'

const BASIC_CODE = `<DatePicker placeholder="Pick a date" onChange={(d) => console.log(d)} />`
const INPUT_CODE = `<DatePicker inputMode placeholder="MM/DD/YYYY" />`
const SIZES_TRIGGER_CODE = `<DatePicker size="sm" placeholder="Small" />
<DatePicker size="md" placeholder="Medium" />
<DatePicker size="lg" placeholder="Large" />`
const SIZES_INPUT_CODE = `<DatePicker inputMode size="sm" placeholder="Small" />
<DatePicker inputMode size="md" placeholder="Medium" />
<DatePicker inputMode size="lg" placeholder="Large" />`
const WEEK_NUMBERS_CODE = `<DatePicker showWeekNumbers placeholder="With week numbers" />`
const WEEK_NUMBERS_BACKGROUND_CODE = `<DatePicker
  showWeekNumbers
  weekNumberBackground
  placeholder="Highlighted weeks"
/>`
const OTHER_MONTHS_CODE = `<DatePicker showOtherMonths selectOtherMonths placeholder="Adjacent dates selectable" />
<DatePicker showOtherMonths selectOtherMonths={false} placeholder="Adjacent dates disabled" />`
const DISABLED_CODE = `<DatePicker disabled placeholder="Disabled" />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',        label: 'Basic' },
  { id: 'input-mode',   label: 'Input Mode' },
  { id: 'sizes',        label: 'Sizes' },
  { id: 'week-numbers', label: 'Week Numbers' },
  { id: 'other-months', label: 'Other Months' },
  { id: 'disabled',     label: 'Disabled' },
  { id: 'api',          label: 'API' },
]

export function DatePickerPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [date1, setDate1] = useState<string | null>(null)
  const [date2, setDate2] = useState<string | null>(null)
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
        <h1>Datepicker</h1>
        <p className="docs-desc">
          Calendar-based date selection with button and input modes. Supports keyboard navigation, min/max
          date constraints, adjacent-month dates, and week numbers.
        </p>
        <DocsPackageBadge packageName="spruce-react" symbols={['DatePicker']} />

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">Click the trigger button to open a dropdown calendar.</p>
          <CodePreview code={BASIC_CODE}>
            <DatePicker placeholder="Pick a date" onChange={setDate1} />
          </CodePreview>
          {date1 && <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)' }}>Selected: <code>{date1}</code></p>}
        </section>

        <section id="input-mode" className="demo-section" aria-labelledby="input-mode-heading">
          <h2 id="input-mode-heading">Input Mode</h2>
          <p className="section-desc">
            Text input mode lets users type a date in <code>MM/DD/YYYY</code> format or use the calendar toggle.
          </p>
          <CodePreview code={INPUT_CODE}>
            <DatePicker inputMode placeholder="MM/DD/YYYY" onChange={setDate2} />
          </CodePreview>
          {date2 && <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)' }}>Selected: <code>{date2}</code></p>}
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Available in sm, md (default), and lg for both trigger and input modes.</p>
          <h3>Trigger Mode</h3>
          <CodePreview code={SIZES_TRIGGER_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
              <DatePicker size="sm" placeholder="Small" />
              <DatePicker size="md" placeholder="Medium" />
              <DatePicker size="lg" placeholder="Large" />
            </div>
          </CodePreview>
          <h3>Input Mode</h3>
          <CodePreview code={SIZES_INPUT_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
              <DatePicker inputMode size="sm" placeholder="Small" />
              <DatePicker inputMode size="md" placeholder="Medium" />
              <DatePicker inputMode size="lg" placeholder="Large" />
            </div>
          </CodePreview>
        </section>

        <section id="week-numbers" className="demo-section" aria-labelledby="week-numbers-heading">
          <h2 id="week-numbers-heading">Week Numbers</h2>
          <p className="section-desc">Display ISO week numbers in the dropdown calendar.</p>
          <CodePreview code={WEEK_NUMBERS_CODE}>
            <DatePicker showWeekNumbers placeholder="With week numbers" />
          </CodePreview>
          <p className="section-desc">Highlight the week-number column with <code>weekNumberBackground</code>.</p>
          <CodePreview code={WEEK_NUMBERS_BACKGROUND_CODE} language="typescript">
            <DatePicker showWeekNumbers weekNumberBackground placeholder="Highlighted weeks" />
          </CodePreview>
        </section>

        <section id="other-months" className="demo-section" aria-labelledby="other-months-heading">
          <h2 id="other-months-heading">Other Months</h2>
          <p className="section-desc">Show adjacent-month dates in a subtle color. They are selectable by default and can be disabled independently.</p>
          <CodePreview code={OTHER_MONTHS_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
              <DatePicker showOtherMonths selectOtherMonths placeholder="Adjacent dates selectable" />
              <DatePicker showOtherMonths selectOtherMonths={false} placeholder="Adjacent dates disabled" />
            </div>
          </CodePreview>
        </section>

        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled</h2>
          <p className="section-desc">Disable the picker to prevent interaction.</p>
          <CodePreview code={DISABLED_CODE}>
            <DatePicker disabled placeholder="Disabled" />
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
                <tr><td><code>value</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Controlled date (ISO YYYY-MM-DD)</td></tr>
                <tr><td><code>onChange</code></td><td><code>(date: string | null) =&gt; void</code></td><td>—</td><td>Called on selection or clear</td></tr>
                <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>'Select date'</code></td><td>Trigger placeholder</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Trigger/input size</td></tr>
                <tr><td><code>inputMode</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Text input with calendar toggle</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the picker</td></tr>
                <tr><td><code>showOtherMonths</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show dates from adjacent months</td></tr>
                <tr><td><code>selectOtherMonths</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Allow selecting visible adjacent-month dates</td></tr>
                <tr><td><code>showWeekNumbers</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show week numbers in calendar</td></tr>
                <tr><td><code>minDate</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Min selectable date (ISO)</td></tr>
                <tr><td><code>maxDate</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Max selectable date (ISO)</td></tr>
                <tr><td><code>disabledDates</code></td><td><code>string[]</code></td><td><code>[]</code></td><td>Specific disabled dates</td></tr>
                <tr><td><code>dateFilter</code></td><td><code>(date: string) =&gt; boolean</code></td><td><code>null</code></td><td>Custom filter function</td></tr>
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
