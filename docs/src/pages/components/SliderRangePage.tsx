import { useState, useEffect, useRef } from 'react'
import { Slider, Range } from 'spruce-react'
import type { RangeValue } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const SLIDER_BASIC_CODE = `<Slider defaultValue={40} onChange={(v) => console.log(v)} />`
const SLIDER_STEP_CODE = `<Slider defaultValue={50} step={10} showTicks />`
const SLIDER_NO_VALUE_CODE = `<Slider defaultValue={30} showValue={false} />`
const RANGE_BASIC_CODE = `<Range defaultValue={{ low: 25, high: 75 }} onChange={(v) => console.log(v)} />`
const RANGE_STEP_CODE = `<Range defaultValue={{ low: 20, high: 80 }} step={5} />`
const DISABLED_CODE = `<Slider defaultValue={60} disabled />
<Range defaultValue={{ low: 30, high: 70 }} disabled />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'slider-basic',    label: 'Slider' },
  { id: 'slider-step',     label: 'Slider with Step' },
  { id: 'slider-no-value', label: 'Slider without Value' },
  { id: 'range-basic',     label: 'Range' },
  { id: 'range-step',      label: 'Range with Step' },
  { id: 'disabled',        label: 'Disabled' },
  { id: 'api',             label: 'API' },
]

export function SliderRangePage() {
  const [activeSection, setActiveSection] = useState('slider-basic')
  const [sliderVal, setSliderVal] = useState(40)
  const [rangeVal, setRangeVal] = useState<RangeValue>({ low: 25, high: 75 })
  const mainRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { const v = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top); if (v.length > 0) setActiveSection(v[0].target.id) }, { rootMargin: '-10% 0px -60% 0px', threshold: 0 })
    mainRef.current?.querySelectorAll('section[id]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Slider &amp; Range</h1>
        <p className="docs-desc">Draggable controls for selecting numeric values. Slider picks a single value; Range picks a low-high pair.</p>

        <section id="slider-basic" className="demo-section" aria-labelledby="slider-basic-heading">
          <h2 id="slider-basic-heading">Slider</h2>
          <p className="section-desc">Drag the thumb or click the track to set a value. Arrow keys adjust by step.</p>
          <CodePreview code={SLIDER_BASIC_CODE}>
            <div style={{ maxWidth: 400 }}>
              <Slider value={sliderVal} onChange={setSliderVal} />
            </div>
          </CodePreview>
        </section>

        <section id="slider-step" className="demo-section" aria-labelledby="slider-step-heading">
          <h2 id="slider-step-heading">Slider with Step &amp; Ticks</h2>
          <p className="section-desc">Snap to intervals with <code>step</code> and show min/max labels with <code>showTicks</code>.</p>
          <CodePreview code={SLIDER_STEP_CODE}>
            <div style={{ maxWidth: 400 }}>
              <Slider defaultValue={50} step={10} showTicks />
            </div>
          </CodePreview>
        </section>

        <section id="slider-no-value" className="demo-section" aria-labelledby="slider-no-value-heading">
          <h2 id="slider-no-value-heading">Slider without a Value Label</h2>
          <p className="section-desc">Hide the visible value when surrounding content already communicates it.</p>
          <CodePreview code={SLIDER_NO_VALUE_CODE}>
            <div style={{ maxWidth: 400 }}>
              <Slider defaultValue={30} showValue={false} ariaLabel="Example value" />
            </div>
          </CodePreview>
        </section>

        <section id="range-basic" className="demo-section" aria-labelledby="range-basic-heading">
          <h2 id="range-basic-heading">Range</h2>
          <p className="section-desc">Two thumbs for selecting a range. Each thumb is independently draggable and keyboard-accessible.</p>
          <CodePreview code={RANGE_BASIC_CODE}>
            <div style={{ maxWidth: 400 }}>
              <Range value={rangeVal} onChange={setRangeVal} />
            </div>
          </CodePreview>
        </section>

        <section id="range-step" className="demo-section" aria-labelledby="range-step-heading">
          <h2 id="range-step-heading">Range with Step</h2>
          <p className="section-desc">Snap both thumbs to step intervals.</p>
          <CodePreview code={RANGE_STEP_CODE}>
            <div style={{ maxWidth: 400 }}>
              <Range defaultValue={{ low: 20, high: 80 }} step={5} />
            </div>
          </CodePreview>
        </section>

        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled</h2>
          <p className="section-desc">Both Slider and Range support a disabled state.</p>
          <CodePreview code={DISABLED_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
              <Slider defaultValue={60} disabled />
              <Range defaultValue={{ low: 30, high: 70 }} disabled />
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Slider Props</h3>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>value</code></td><td><code>number</code></td><td>—</td><td>Controlled value</td></tr>
            <tr><td><code>defaultValue</code></td><td><code>number</code></td><td><code>0</code></td><td>Initial value</td></tr>
            <tr><td><code>onChange</code></td><td><code>(v: number) =&gt; void</code></td><td>—</td><td>Value change callback</td></tr>
            <tr><td><code>min</code></td><td><code>number</code></td><td><code>0</code></td><td>Minimum</td></tr>
            <tr><td><code>max</code></td><td><code>number</code></td><td><code>100</code></td><td>Maximum</td></tr>
            <tr><td><code>step</code></td><td><code>number</code></td><td><code>1</code></td><td>Step increment</td></tr>
            <tr><td><code>showValue</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show value label</td></tr>
            <tr><td><code>showTicks</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show min/max labels</td></tr>
            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable interaction</td></tr>
          </tbody></table></div>
          <h3 style={{ marginTop: 16 }}>Range Props</h3>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>value</code></td><td><code>RangeValue</code></td><td>—</td><td>Controlled value ({'{low, high}'})</td></tr>
            <tr><td><code>defaultValue</code></td><td><code>RangeValue</code></td><td><code>{'{low: 20, high: 80}'}</code></td><td>Initial value</td></tr>
            <tr><td><code>onChange</code></td><td><code>(v: RangeValue) =&gt; void</code></td><td>—</td><td>Value change callback</td></tr>
            <tr><td><code>min</code></td><td><code>number</code></td><td><code>0</code></td><td>Minimum</td></tr>
            <tr><td><code>max</code></td><td><code>number</code></td><td><code>100</code></td><td>Maximum</td></tr>
            <tr><td><code>step</code></td><td><code>number</code></td><td><code>1</code></td><td>Step increment</td></tr>
            <tr><td><code>showValues</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show low/high labels</td></tr>
            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable interaction</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{SECTIONS.map(s => (<li key={s.id}><a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</a></li>))}</ul></nav>
    </div>
  )
}
