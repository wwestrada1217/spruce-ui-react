import { useState, useEffect, useRef } from 'react'
import { DateRangePicker } from 'spruce-react'
import type { DateRange, DateRangePreset } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { DocsPackageBadge } from '../../components/DocsPackageBadge'

const BASIC_CODE = `<DateRangePicker placeholder="Select range" onChange={(r) => console.log(r)} />`

const INPUT_CODE = `<DateRangePicker inputMode />`

const PRESETS_CODE = `const presets = [
  { label: 'Today', range: { start: '2025-04-15', end: '2025-04-15' } },
  { label: 'Last 7 days', range: { start: '2025-04-09', end: '2025-04-15' } },
  { label: 'This month', range: { start: '2025-04-01', end: '2025-04-30' } },
]

<DateRangePicker presets={presets} />`

const OTHER_MONTHS_CODE = `<DateRangePicker showOtherMonths selectOtherMonths placeholder="Adjacent dates selectable" />
<DateRangePicker showOtherMonths selectOtherMonths={false} placeholder="Adjacent dates disabled" />`

const MULTI_MONTH_CODE = `<DateRangePicker months={3} placeholder="Three calendar panels" />`

const DISABLED_CODE = `<DateRangePicker disabled placeholder="Disabled" />`

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
  { id: 'basic',      label: 'Basic' },
  { id: 'input-mode', label: 'Input Mode' },
  { id: 'presets',    label: 'With Presets' },
  { id: 'multi-month', label: 'Multiple Months' },
  { id: 'other-months', label: 'Other Months' },
  { id: 'disabled',   label: 'Disabled' },
  { id: 'api',        label: 'API' },
]

export function DateRangePickerPage() {
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
        <h1>Date Range Picker</h1>
        <p className="docs-desc">
          Dropdown date range selection with dual calendar panels, optional presets sidebar,
          configurable calendar panels, and both button and input trigger modes.
        </p>
        <DocsPackageBadge packageName="spruce-react" symbols={['DateRangePicker', 'DateRangePreset']} />

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">Click the trigger to open a dual-panel calendar for selecting a date range.</p>
          <CodePreview code={BASIC_CODE}>
            <DateRangePicker placeholder="Select range" onChange={setRange} />
          </CodePreview>
          {(range.start || range.end) && (
            <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)' }}>
              Range: <code>{range.start || '—'}</code> to <code>{range.end || '—'}</code>
            </p>
          )}
        </section>

        <section id="multi-month" className="demo-section" aria-labelledby="multi-month-heading">
          <h2 id="multi-month-heading">Multiple Months</h2>
          <p className="section-desc">Set <code>months</code> when a longer range benefits from more calendar context.</p>
          <CodePreview code={MULTI_MONTH_CODE} language="typescript">
            <DateRangePicker months={3} placeholder="Three calendar panels" />
          </CodePreview>
        </section>

        <section id="input-mode" className="demo-section" aria-labelledby="input-mode-heading">
          <h2 id="input-mode-heading">Input Mode</h2>
          <p className="section-desc">
            Dual text inputs for start and end dates with a calendar toggle button.
          </p>
          <CodePreview code={INPUT_CODE}>
            <DateRangePicker inputMode />
          </CodePreview>
        </section>

        <section id="presets" className="demo-section" aria-labelledby="presets-heading">
          <h2 id="presets-heading">With Presets</h2>
          <p className="section-desc">
            Add a presets sidebar for quick range selection.
          </p>
          <CodePreview code={PRESETS_CODE}>
            <DateRangePicker presets={presets} placeholder="Select range" />
          </CodePreview>
        </section>

        <section id="other-months" className="demo-section" aria-labelledby="other-months-heading">
          <h2 id="other-months-heading">Other Months</h2>
          <p className="section-desc">Show adjacent-month dates in a subtle color. They are selectable by default and can be disabled independently.</p>
          <CodePreview code={OTHER_MONTHS_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
              <DateRangePicker showOtherMonths selectOtherMonths placeholder="Adjacent dates selectable" />
              <DateRangePicker showOtherMonths selectOtherMonths={false} placeholder="Adjacent dates disabled" />
            </div>
          </CodePreview>
        </section>

        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled</h2>
          <p className="section-desc">Disable the picker.</p>
          <CodePreview code={DISABLED_CODE}>
            <DateRangePicker disabled placeholder="Disabled" />
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
                <tr><td><code>value</code></td><td><code>DateRange</code></td><td><code>{'{start: null, end: null}'}</code></td><td>Controlled range</td></tr>
                <tr><td><code>onChange</code></td><td><code>(range: DateRange) =&gt; void</code></td><td>—</td><td>Called on Apply or Clear</td></tr>
                <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>'Select range'</code></td><td>Trigger placeholder</td></tr>
                <tr><td><code>inputMode</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Dual text inputs mode</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the picker</td></tr>
                <tr><td><code>showOtherMonths</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show dates from adjacent months</td></tr>
                <tr><td><code>selectOtherMonths</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Allow selecting visible adjacent-month dates</td></tr>
                <tr><td><code>months</code></td><td><code>number</code></td><td><code>2</code></td><td>Number of calendar panels</td></tr>
                <tr><td><code>presets</code></td><td><code>DateRangePreset[]</code></td><td><code>[]</code></td><td>Preset range options</td></tr>
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
