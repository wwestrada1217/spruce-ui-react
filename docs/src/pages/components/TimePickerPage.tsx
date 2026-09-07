import { useState, useEffect, useRef } from 'react'
import { TimePicker } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { DateControlContractRows } from '../../components/DateControlContractRows'

const BASIC_CODE = `<TimePicker placeholder="Select time" onChange={(v) => console.log(v)} />`
const FORMAT_CODE = `<TimePicker use24Hour placeholder="Select time (24h)" />`
const SECONDS_CODE = `<TimePicker showSeconds placeholder="With seconds (12h)" />
<TimePicker showSeconds use24Hour placeholder="With seconds (24h)" />`
const SIZES_CODE = `<TimePicker size="sm" placeholder="Small" />
<TimePicker size="md" placeholder="Medium" />
<TimePicker size="lg" placeholder="Large" />`
const DISABLED_CODE = `<TimePicker disabled placeholder="Disabled" />`
const INPUT_MODE_CODE = `<TimePicker inputMode placeholder="hh:MM AM" />
<TimePicker inputMode use24Hour placeholder="HH:MM" />
<TimePicker inputMode showSeconds placeholder="hh:MM:SS AM" />`
const FIELD_STATE_CODE = `<TimePicker
  inputMode
  label="Start time"
  floatingLabel
  variant="filled"
  required
  error="Choose a start time."
  placement="top-start"
/>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',      label: 'Basic Usage' },
  { id: 'format',     label: '24-Hour Format' },
  { id: 'seconds',    label: 'With Seconds' },
  { id: 'sizes',      label: 'Sizes' },
  { id: 'disabled',   label: 'Disabled' },
  { id: 'input-mode', label: 'Input Mode' },
  { id: 'field-state', label: 'Field & Overlay API' },
  { id: 'api',        label: 'API' },
]

export function TimePickerPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [time1, setTime1] = useState<string | null>(null)
  const [time2, setTime2] = useState<string | null>(null)
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
        <h1>Time Picker</h1>
        <p className="docs-desc">
          A spinner-based time selector with support for 12/24-hour format, seconds, and keyboard interaction.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic Usage</h2>
          <p className="section-desc">Click the trigger to open the time spinner. Adjust hours and minutes, then click Apply.</p>
          <CodePreview code={BASIC_CODE}>
            <TimePicker value={time1} placeholder="Select time" onChange={setTime1} />
          </CodePreview>
          {time1 && <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)' }}>Selected: <code>{time1}</code></p>}
        </section>

        <section id="format" className="demo-section" aria-labelledby="format-heading">
          <h2 id="format-heading">24-Hour Format</h2>
          <p className="section-desc">Set <code>use24Hour</code> to display time in 24-hour format without AM/PM.</p>
          <CodePreview code={FORMAT_CODE}>
            <TimePicker value={time2} use24Hour placeholder="Select time (24h)" onChange={setTime2} />
          </CodePreview>
          {time2 && <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)' }}>Selected: <code>{time2}</code></p>}
        </section>

        <section id="seconds" className="demo-section" aria-labelledby="seconds-heading">
          <h2 id="seconds-heading">With Seconds</h2>
          <p className="section-desc">Enable the seconds column with <code>showSeconds</code>.</p>
          <CodePreview code={SECONDS_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <TimePicker showSeconds placeholder="With seconds (12h)" />
              <TimePicker showSeconds use24Hour placeholder="With seconds (24h)" />
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Three sizes: sm, md (default), and lg.</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
              <TimePicker size="sm" placeholder="Small" />
              <TimePicker size="md" placeholder="Medium" />
              <TimePicker size="lg" placeholder="Large" />
            </div>
          </CodePreview>
        </section>

        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled</h2>
          <p className="section-desc">Disable the picker to prevent interaction.</p>
          <CodePreview code={DISABLED_CODE}>
            <TimePicker disabled placeholder="Disabled" />
          </CodePreview>
        </section>

        <section id="input-mode" className="demo-section" aria-labelledby="input-mode-heading">
          <h2 id="input-mode-heading">Input Mode</h2>
          <p className="section-desc">
            Render a text input with a toggle button. Users can type a time directly or open the spinner panel.
          </p>
          <CodePreview code={INPUT_MODE_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <TimePicker inputMode placeholder="hh:MM AM" />
              <TimePicker inputMode use24Hour placeholder="HH:MM" />
              <TimePicker inputMode showSeconds placeholder="hh:MM:SS AM" />
            </div>
          </CodePreview>
        </section>

        <section id="field-state" className="demo-section" aria-labelledby="field-state-heading">
          <h2 id="field-state-heading">Field and overlay contract</h2>
          <p className="section-desc">TimePicker supports labels, visual variants, shared form state, placement, modal constraints, and outside/scroll dismissal controls.</p>
          <CodePreview code={FIELD_STATE_CODE} language="typescript">
            <TimePicker inputMode label="Start time" floatingLabel variant="filled" required error="Choose a start time." placement="top-start" />
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
                <tr><td><code>value</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Controlled time value</td></tr>
                <tr><td><code>onChange</code></td><td><code>(value: string | null) =&gt; void</code></td><td>—</td><td>Called on Apply or Clear</td></tr>
                <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>'Select time'</code></td><td>Placeholder text</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Trigger size</td></tr>
                <tr><td><code>use24Hour</code></td><td><code>boolean</code></td><td><code>false</code></td><td>24-hour format</td></tr>
                <tr><td><code>showSeconds</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show seconds spinner</td></tr>
                <tr><td><code>inputMode</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Text input with toggle button</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the picker</td></tr>
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
