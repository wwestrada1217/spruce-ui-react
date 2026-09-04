import { useState, useEffect, useRef } from 'react'
import { ProgressBar } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { DocsPackageBadge } from '../../components/DocsPackageBadge'

const BASIC_CODE = `<ProgressBar value={60} />`

const VARIANTS_CODE = `<ProgressBar value={45} variant="primary" />
<ProgressBar value={80} variant="success" />
<ProgressBar value={60} variant="warning" />
<ProgressBar value={30} variant="danger" />
<ProgressBar value={70} variant="info" />`

const SIZES_CODE = `<ProgressBar value={50} size="sm" />
<ProgressBar value={50} size="md" />
<ProgressBar value={50} size="lg" />`

const LABEL_CODE = `<ProgressBar value={72} label="Uploading files..." showValue />
<ProgressBar value={100} label="Complete" showValue variant="success" />`

const STRIPED_CODE = `<ProgressBar value={55} striped />
<ProgressBar value={55} striped animated variant="success" />`

const INDETERMINATE_CODE = `<ProgressBar indeterminate />
<ProgressBar indeterminate variant="info" label="Loading..." />`

const SEGMENTS_CODE = `<ProgressBar
  value={72}
  segments={12}
  segmentShape="pill"
  segmentGap={4}
  showValue
/>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',         label: 'Basic' },
  { id: 'variants',      label: 'Variants' },
  { id: 'sizes',         label: 'Sizes' },
  { id: 'with-label',    label: 'With Label' },
  { id: 'striped',       label: 'Striped' },
  { id: 'indeterminate', label: 'Indeterminate' },
  { id: 'segmented',     label: 'Segmented' },
  { id: 'api',           label: 'API' },
]

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--sp-text-xs, 11px)',
  color: 'var(--sp-text-subtle, #718096)',
}

const progressWrap: React.CSSProperties = {
  maxWidth: 500,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
}

export function ProgressBarPage() {
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
        <h1>Progress Bar</h1>
        <p className="docs-desc">
          Visualize task completion or loading status with variants, sizes, labels, stripes, and
          indeterminate mode.
        </p>
        <DocsPackageBadge packageName="spruce-react" symbols={['ProgressBar']} />

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">A simple progress bar at 60% completion.</p>
          <CodePreview code={BASIC_CODE}>
            <div style={progressWrap}>
              <ProgressBar value={60} />
            </div>
          </CodePreview>
        </section>

        <section id="variants" className="demo-section" aria-labelledby="variants-heading">
          <h2 id="variants-heading">Variants</h2>
          <p className="section-desc">Five color variants to convey different statuses.</p>
          <CodePreview code={VARIANTS_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {([ ['primary', 45], ['success', 80], ['warning', 60], ['danger', 30], ['info', 70] ] as const).map(([v, val]) => (
                <div key={v} style={progressWrap}>
                  <span style={labelStyle}>{v} ({val}%)</span>
                  <ProgressBar value={val} variant={v} />
                </div>
              ))}
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Three track heights: sm (4px), md (8px, default), and lg (12px).</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <div key={s} style={progressWrap}>
                  <span style={labelStyle}>{s}</span>
                  <ProgressBar value={50} size={s} />
                </div>
              ))}
            </div>
          </CodePreview>
        </section>

        <section id="with-label" className="demo-section" aria-labelledby="with-label-heading">
          <h2 id="with-label-heading">With Label</h2>
          <p className="section-desc">Display a label and percentage value alongside the bar.</p>
          <CodePreview code={LABEL_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={progressWrap}>
                <ProgressBar value={72} label="Uploading files..." showValue />
              </div>
              <div style={progressWrap}>
                <ProgressBar value={100} label="Complete" showValue variant="success" />
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="striped" className="demo-section" aria-labelledby="striped-heading">
          <h2 id="striped-heading">Striped</h2>
          <p className="section-desc">Add a striped texture, optionally animated, for active processes.</p>
          <CodePreview code={STRIPED_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={progressWrap}>
                <span style={labelStyle}>Striped</span>
                <ProgressBar value={55} striped />
              </div>
              <div style={progressWrap}>
                <span style={labelStyle}>Striped + Animated</span>
                <ProgressBar value={55} striped animated variant="success" />
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="indeterminate" className="demo-section" aria-labelledby="indeterminate-heading">
          <h2 id="indeterminate-heading">Indeterminate</h2>
          <p className="section-desc">Use indeterminate mode when progress cannot be determined.</p>
          <CodePreview code={INDETERMINATE_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={progressWrap}>
                <ProgressBar indeterminate />
              </div>
              <div style={progressWrap}>
                <ProgressBar indeterminate variant="info" label="Loading..." />
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="segmented" className="demo-section" aria-labelledby="segmented-heading">
          <h2 id="segmented-heading">Segmented</h2>
          <p className="section-desc">Render proportional segments with bar, tick, or pill shapes and a tokenized gap.</p>
          <CodePreview code={SEGMENTS_CODE}>
            <div style={progressWrap}>
              <ProgressBar value={72} segments={12} segmentShape="pill" segmentGap={4} showValue />
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
                <tr><td><code>value</code></td><td><code>number</code></td><td><code>0</code></td><td>Current progress value</td></tr>
                <tr><td><code>max</code></td><td><code>number</code></td><td><code>100</code></td><td>Maximum value</td></tr>
                <tr><td><code>variant</code></td><td><code>'primary' | 'success' | 'warning' | 'danger' | 'info'</code></td><td><code>'primary'</code></td><td>Color variant</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Bar thickness</td></tr>
                <tr><td><code>showValue</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show percentage text</td></tr>
                <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Label shown above the bar</td></tr>
                <tr><td><code>striped</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Striped pattern</td></tr>
                <tr><td><code>animated</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Animate stripes</td></tr>
                <tr><td><code>indeterminate</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Indeterminate loading state</td></tr>
                <tr><td><code>segments</code></td><td><code>number</code></td><td><code>0</code></td><td>Number of segments to render</td></tr>
                <tr><td><code>segmentShape</code></td><td><code>'bar' | 'tick' | 'pill'</code></td><td><code>'bar'</code></td><td>Segment visual shape</td></tr>
                <tr><td><code>segmentGap</code></td><td><code>number | string</code></td><td><code>0</code></td><td>Gap between segments</td></tr>
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
