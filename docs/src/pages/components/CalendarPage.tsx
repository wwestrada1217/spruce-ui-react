import { useState, useEffect, useRef } from 'react'
import { Calendar } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<Calendar onChange={(date) => console.log(date)} />`

const MIN_MAX_CODE = `<Calendar minDate="2025-04-01" maxDate="2025-04-30" />`

const DISABLED_DATES_CODE = `// Disable weekends
const noWeekends = (date: string) => {
  const d = new Date(date + 'T00:00:00')
  return d.getDay() !== 0 && d.getDay() !== 6
}

<Calendar dateFilter={noWeekends} />`

const WEEK_NUMBERS_CODE = `<Calendar showWeekNumbers />`

const OTHER_MONTHS_CODE = `<Calendar showOtherMonths selectOtherMonths />
<Calendar showOtherMonths selectOtherMonths={false} />`

const NO_FOOTER_CODE = `<Calendar showFooter={false} />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',          label: 'Basic Usage' },
  { id: 'min-max',        label: 'Min / Max Dates' },
  { id: 'disabled-dates', label: 'Disabled Dates' },
  { id: 'week-numbers',   label: 'Week Numbers' },
  { id: 'other-months',   label: 'Other Months' },
  { id: 'no-footer',      label: 'Without Footer' },
  { id: 'api',            label: 'API' },
]

const noWeekends = (date: string) => {
  const d = new Date(date + 'T00:00:00')
  return d.getDay() !== 0 && d.getDay() !== 6
}

export function CalendarPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
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
        <h1>Calendar</h1>
        <p className="docs-desc">
          An inline calendar component for date selection. Supports min/max constraints,
          disabled dates, week numbers, and keyboard navigation.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic Usage</h2>
          <p className="section-desc">
            A simple inline calendar. Click a day to select it.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
              <Calendar onChange={setSelectedDate} />
              <p style={{ fontSize: 13, color: 'var(--sp-text-subtle, #718096)' }}>
                Selected: <code>{selectedDate || 'none'}</code>
              </p>
            </div>
          </CodePreview>
        </section>

        <section id="min-max" className="demo-section" aria-labelledby="min-max-heading">
          <h2 id="min-max-heading">Min / Max Dates</h2>
          <p className="section-desc">
            Restrict the selectable date range with <code>minDate</code> and <code>maxDate</code>.
            Dates outside the range are disabled automatically.
          </p>
          <CodePreview code={MIN_MAX_CODE}>
            <Calendar minDate="2025-04-01" maxDate="2025-04-30" />
          </CodePreview>
        </section>

        <section id="disabled-dates" className="demo-section" aria-labelledby="disabled-dates-heading">
          <h2 id="disabled-dates-heading">Disabled Dates</h2>
          <p className="section-desc">
            Use <code>dateFilter</code> to dynamically disable dates. The function receives an ISO
            date string and returns <code>true</code> if the date should be selectable.
          </p>
          <CodePreview code={DISABLED_DATES_CODE}>
            <Calendar dateFilter={noWeekends} />
          </CodePreview>
        </section>

        <section id="week-numbers" className="demo-section" aria-labelledby="week-numbers-heading">
          <h2 id="week-numbers-heading">Week Numbers</h2>
          <p className="section-desc">
            Display ISO week numbers alongside the calendar grid.
          </p>
          <CodePreview code={WEEK_NUMBERS_CODE}>
            <Calendar showWeekNumbers />
          </CodePreview>
        </section>

        <section id="other-months" className="demo-section" aria-labelledby="other-months-heading">
          <h2 id="other-months-heading">Other Months</h2>
          <p className="section-desc">Show adjacent-month dates in a subtle color. They are selectable by default and can be disabled independently.</p>
          <CodePreview code={OTHER_MONTHS_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
              <Calendar showOtherMonths selectOtherMonths />
              <Calendar showOtherMonths selectOtherMonths={false} />
            </div>
          </CodePreview>
        </section>

        <section id="no-footer" className="demo-section" aria-labelledby="no-footer-heading">
          <h2 id="no-footer-heading">Without Footer</h2>
          <p className="section-desc">
            Hide the Today / Clear footer buttons.
          </p>
          <CodePreview code={NO_FOOTER_CODE}>
            <Calendar showFooter={false} />
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
                <tr><td><code>value</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Selected date (ISO format YYYY-MM-DD)</td></tr>
                <tr><td><code>onChange</code></td><td><code>(date: string | null) =&gt; void</code></td><td>—</td><td>Called when a date is selected or cleared</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the calendar</td></tr>
                <tr><td><code>minDate</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Minimum selectable date (ISO)</td></tr>
                <tr><td><code>maxDate</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Maximum selectable date (ISO)</td></tr>
                <tr><td><code>disabledDates</code></td><td><code>string[]</code></td><td><code>[]</code></td><td>Array of specific disabled dates (ISO)</td></tr>
                <tr><td><code>dateFilter</code></td><td><code>(date: string) =&gt; boolean</code></td><td><code>null</code></td><td>Custom filter function</td></tr>
                <tr><td><code>showWeekNumbers</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show ISO week numbers</td></tr>
                <tr><td><code>showOtherMonths</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show dates from adjacent months</td></tr>
                <tr><td><code>selectOtherMonths</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Allow selecting visible adjacent-month dates</td></tr>
                <tr><td><code>showFooter</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show Today/Clear footer buttons</td></tr>
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
