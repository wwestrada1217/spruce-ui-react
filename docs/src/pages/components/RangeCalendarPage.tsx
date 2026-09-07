import { useState, useEffect, useRef } from 'react'
import { RangeCalendar } from 'spruce-react'
import type { DateRange, DateRangePreset } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { DateControlContractRows } from '../../components/DateControlContractRows'

const BASIC_CODE = `<RangeCalendar onChange={(range) => console.log(range)} />`

const PRESETS_CODE = `const presets = [
  { label: 'Today', range: { start: '2025-04-15', end: '2025-04-15' } },
  { label: 'Last 7 days', range: { start: '2025-04-09', end: '2025-04-15' } },
  { label: 'This month', range: { start: '2025-04-01', end: '2025-04-30' } },
]

<RangeCalendar presets={presets} />`

const THREE_MONTHS_CODE = `<RangeCalendar months={3} />`

const NO_FOOTER_CODE = `<RangeCalendar showFooter={false} />`
const FIELD_STATE_CODE = `<RangeCalendar
  ariaLabel="Reporting range"
  required
  touched
  error="Choose a start and end date."
/>`

const today = new Date()
const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
const weekAgo = new Date(today)
weekAgo.setDate(weekAgo.getDate() - 6)
const weekAgoISO = `${weekAgo.getFullYear()}-${String(weekAgo.getMonth() + 1).padStart(2, '0')}-${String(weekAgo.getDate()).padStart(2, '0')}`
const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`
const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
const monthEndISO = `${monthEnd.getFullYear()}-${String(monthEnd.getMonth() + 1).padStart(2, '0')}-${String(monthEnd.getDate()).padStart(2, '0')}`

const presets: DateRangePreset[] = [
  { label: 'Today', range: { start: todayISO, end: todayISO } },
  { label: 'Last 7 days', range: { start: weekAgoISO, end: todayISO } },
  { label: 'This month', range: { start: monthStart, end: monthEndISO } },
]

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',        label: 'Basic' },
  { id: 'presets',      label: 'With Presets' },
  { id: 'three-months', label: 'Three Months' },
  { id: 'no-footer',    label: 'Without Footer' },
  { id: 'field-state',  label: 'Field State' },
  { id: 'api',          label: 'API' },
]

export function RangeCalendarPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [range, setRange] = useState<DateRange>({ start: null, end: null })
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
        <h1>Range Calendar</h1>
        <p className="docs-desc">
          An inline dual-panel calendar for selecting date ranges. Supports presets, multi-month views,
          and keyboard navigation.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">
            Click a day to set the start, click another to set the end. Days between are highlighted.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div>
              <RangeCalendar onChange={setRange} />
              {(range.start || range.end) && (
                <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginTop: 8 }}>
                  Range: <code>{range.start || '—'}</code> to <code>{range.end || '—'}</code>
                </p>
              )}
            </div>
          </CodePreview>
        </section>

        <section id="presets" className="demo-section" aria-labelledby="presets-heading">
          <h2 id="presets-heading">With Presets</h2>
          <p className="section-desc">
            Add a presets sidebar for quick range selection.
          </p>
          <CodePreview code={PRESETS_CODE}>
            <RangeCalendar presets={presets} />
          </CodePreview>
        </section>

        <section id="three-months" className="demo-section" aria-labelledby="three-months-heading">
          <h2 id="three-months-heading">Three Months</h2>
          <p className="section-desc">
            Show more months by setting the <code>months</code> prop.
          </p>
          <CodePreview code={THREE_MONTHS_CODE}>
            <RangeCalendar months={3} />
          </CodePreview>
        </section>

        <section id="no-footer" className="demo-section" aria-labelledby="no-footer-heading">
          <h2 id="no-footer-heading">Without Footer</h2>
          <p className="section-desc">
            Hide the Apply/Clear footer. Changes are emitted immediately on selection.
          </p>
          <CodePreview code={NO_FOOTER_CODE}>
            <RangeCalendar showFooter={false} />
          </CodePreview>
        </section>

        <section id="field-state" className="demo-section" aria-labelledby="field-state-heading">
          <h2 id="field-state-heading">Form state and validation</h2>
          <p className="section-desc">RangeCalendar shares the readonly, hidden, required, touched, hint, and accessible error contract.</p>
          <CodePreview code={FIELD_STATE_CODE} language="typescript">
            <RangeCalendar ariaLabel="Reporting range" required touched error="Choose a start and end date." />
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
                <tr><td><code>value</code></td><td><code>DateRange</code></td><td><code>{'{start: null, end: null}'}</code></td><td>Controlled range value</td></tr>
                <tr><td><code>onChange</code></td><td><code>(range: DateRange) =&gt; void</code></td><td>—</td><td>Called on Apply or Clear</td></tr>
                <tr><td><code>months</code></td><td><code>number</code></td><td><code>2</code></td><td>Number of visible month panels</td></tr>
                <tr><td><code>presets</code></td><td><code>DateRangePreset[]</code></td><td><code>[]</code></td><td>Quick-pick preset ranges</td></tr>
                <tr><td><code>showFooter</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show Apply/Clear footer</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the calendar</td></tr>
                <DateControlContractRows />
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: 16 }}>DateRange</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>start</code></td><td><code>string | null</code></td><td>Start date (ISO YYYY-MM-DD)</td></tr>
                <tr><td><code>end</code></td><td><code>string | null</code></td><td>End date (ISO YYYY-MM-DD)</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: 16 }}>DateRangePreset</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>label</code></td><td><code>string</code></td><td>Display label</td></tr>
                <tr><td><code>range</code></td><td><code>DateRange</code></td><td>The preset range</td></tr>
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
