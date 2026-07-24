import { useState, useEffect, useRef } from 'react'
import { SegmentedControl } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<SegmentedControl
  options={[
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ]}
  onChange={(v) => console.log(v)}
/>`

const SIZES_CODE = `<SegmentedControl size="sm" options={options} />
<SegmentedControl size="md" options={options} />
<SegmentedControl size="lg" options={options} />`

const BLOCK_CODE = `<SegmentedControl block options={options} />`

const ICONS_CODE = `<SegmentedControl
  options={[
    { label: 'Grid', value: 'grid', icon: 'grid' },
    { label: 'List', value: 'list', icon: 'list' },
    { label: 'Board', value: 'board', icon: 'layout' },
  ]}
/>`

const DISABLED_CODE = `<SegmentedControl
  options={[
    { label: 'Active', value: 'a' },
    { label: 'Disabled', value: 'b', disabled: true },
    { label: 'Active', value: 'c' },
  ]}
/>`

const opts = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
]

const iconOpts = [
  { label: 'Grid', value: 'grid', icon: 'grid' },
  { label: 'List', value: 'list', icon: 'list' },
  { label: 'Board', value: 'board', icon: 'layout' },
]

const disabledOpts = [
  { label: 'Active', value: 'a' },
  { label: 'Disabled', value: 'b', disabled: true },
  { label: 'Active', value: 'c' },
]

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',    label: 'Basic' },
  { id: 'sizes',    label: 'Sizes' },
  { id: 'block',    label: 'Block' },
  { id: 'icons',    label: 'With Icons' },
  { id: 'disabled', label: 'Disabled Option' },
  { id: 'api',      label: 'API' },
]

export function SegmentedControlPage() {
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
        <h1>Segmented Control</h1>
        <p className="docs-desc">
          A pill-shaped toggle group with a sliding indicator. Use for switching between views
          or modes with a small set of exclusive options.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">Click an option to select it. The indicator slides smoothly between options.</p>
          <CodePreview code={BASIC_CODE}>
            <SegmentedControl options={opts} />
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Three sizes: sm, md (default), and lg.</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
              <SegmentedControl size="sm" options={opts} />
              <SegmentedControl size="md" options={opts} />
              <SegmentedControl size="lg" options={opts} />
            </div>
          </CodePreview>
        </section>

        <section id="block" className="demo-section" aria-labelledby="block-heading">
          <h2 id="block-heading">Block</h2>
          <p className="section-desc">Set <code>block</code> to stretch to full width of the container.</p>
          <CodePreview code={BLOCK_CODE}>
            <div style={{ maxWidth: 400 }}>
              <SegmentedControl block options={opts} />
            </div>
          </CodePreview>
        </section>

        <section id="icons" className="demo-section" aria-labelledby="icons-heading">
          <h2 id="icons-heading">With Icons</h2>
          <p className="section-desc">Options can include icons alongside or instead of labels.</p>
          <CodePreview code={ICONS_CODE}>
            <SegmentedControl options={iconOpts} />
          </CodePreview>
        </section>

        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled Option</h2>
          <p className="section-desc">Individual options can be disabled.</p>
          <CodePreview code={DISABLED_CODE}>
            <SegmentedControl options={disabledOpts} />
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
                <tr><td><code>options</code></td><td><code>SegmentedOption[]</code></td><td>—</td><td>Array of options</td></tr>
                <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Controlled selected value</td></tr>
                <tr><td><code>defaultValue</code></td><td><code>string</code></td><td>—</td><td>Initial value (uncontrolled)</td></tr>
                <tr><td><code>onChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Selection callback</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Control size</td></tr>
                <tr><td><code>block</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Full width</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable all options</td></tr>
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
              <a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
