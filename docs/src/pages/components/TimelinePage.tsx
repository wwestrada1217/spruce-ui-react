import { useState, useEffect, useRef } from 'react'
import { Timeline, TimelineItem } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<Timeline>
  <TimelineItem>
    <strong>Order placed</strong>
    <p>Your order has been confirmed.</p>
  </TimelineItem>
  <TimelineItem>
    <strong>Processing</strong>
    <p>Your order is being prepared.</p>
  </TimelineItem>
  <TimelineItem>
    <strong>Shipped</strong>
    <p>Your order is on its way.</p>
  </TimelineItem>
  <TimelineItem>
    <strong>Delivered</strong>
    <p>Your order has been delivered.</p>
  </TimelineItem>
</Timeline>`

const COLORS_CODE = `<Timeline>
  <TimelineItem color="primary"><strong>Primary</strong></TimelineItem>
  <TimelineItem color="success"><strong>Success</strong></TimelineItem>
  <TimelineItem color="warning"><strong>Warning</strong></TimelineItem>
  <TimelineItem color="danger"><strong>Danger</strong></TimelineItem>
  <TimelineItem color="neutral"><strong>Neutral</strong></TimelineItem>
</Timeline>`

const ICONS_CODE = `<Timeline>
  <TimelineItem icon="check" color="success" dotSize={24}>
    <strong>Completed</strong>
  </TimelineItem>
  <TimelineItem icon="info" color="primary" dotSize={24}>
    <strong>Information</strong>
  </TimelineItem>
  <TimelineItem icon="alert-circle" color="warning" dotSize={24}>
    <strong>Warning</strong>
  </TimelineItem>
  <TimelineItem icon="x" color="danger" dotSize={24}>
    <strong>Failed</strong>
  </TimelineItem>
</Timeline>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',  label: 'Basic' },
  { id: 'colors', label: 'Dot Colors' },
  { id: 'icons',  label: 'With Icons' },
  { id: 'api',    label: 'API' },
]

const pStyle: React.CSSProperties = {
  margin: '4px 0 0',
  color: 'var(--sp-text-muted, #4a5568)',
}

export function TimelinePage() {
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
        <h1>Timeline</h1>
        <p className="docs-desc">
          Vertical timeline for displaying sequential events or steps in a process.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">
            A simple vertical timeline showing sequential events with default styling.
          </p>
          <CodePreview code={BASIC_CODE}>
            <Timeline>
              <TimelineItem>
                <strong>Order placed</strong>
                <p style={pStyle}>Your order has been confirmed.</p>
              </TimelineItem>
              <TimelineItem>
                <strong>Processing</strong>
                <p style={pStyle}>Your order is being prepared.</p>
              </TimelineItem>
              <TimelineItem>
                <strong>Shipped</strong>
                <p style={pStyle}>Your order is on its way.</p>
              </TimelineItem>
              <TimelineItem>
                <strong>Delivered</strong>
                <p style={pStyle}>Your order has been delivered.</p>
              </TimelineItem>
            </Timeline>
          </CodePreview>
        </section>

        <section id="colors" className="demo-section" aria-labelledby="colors-heading">
          <h2 id="colors-heading">Dot Colors</h2>
          <p className="section-desc">
            Each timeline item dot can be colored to convey status or severity.
          </p>
          <CodePreview code={COLORS_CODE}>
            <Timeline>
              <TimelineItem color="primary">
                <strong>Primary</strong>
                <p style={pStyle}>Default primary color dot.</p>
              </TimelineItem>
              <TimelineItem color="success">
                <strong>Success</strong>
                <p style={pStyle}>Indicates a successful action.</p>
              </TimelineItem>
              <TimelineItem color="warning">
                <strong>Warning</strong>
                <p style={pStyle}>Indicates a warning or caution.</p>
              </TimelineItem>
              <TimelineItem color="danger">
                <strong>Danger</strong>
                <p style={pStyle}>Indicates an error or critical event.</p>
              </TimelineItem>
              <TimelineItem color="neutral">
                <strong>Neutral</strong>
                <p style={pStyle}>A neutral or inactive state.</p>
              </TimelineItem>
            </Timeline>
          </CodePreview>
        </section>

        <section id="icons" className="demo-section" aria-labelledby="icons-heading">
          <h2 id="icons-heading">With Icons</h2>
          <p className="section-desc">
            Replace the default dot with an icon and increase the dot size for emphasis.
          </p>
          <CodePreview code={ICONS_CODE}>
            <Timeline>
              <TimelineItem icon="check" color="success" dotSize={24}>
                <strong>Completed</strong>
                <p style={pStyle}>This step is finished.</p>
              </TimelineItem>
              <TimelineItem icon="info" color="primary" dotSize={24}>
                <strong>Information</strong>
                <p style={pStyle}>An informational update.</p>
              </TimelineItem>
              <TimelineItem icon="alert-circle" color="warning" dotSize={24}>
                <strong>Warning</strong>
                <p style={pStyle}>Something needs attention.</p>
              </TimelineItem>
              <TimelineItem icon="x" color="danger" dotSize={24}>
                <strong>Failed</strong>
                <p style={pStyle}>This step encountered an error.</p>
              </TimelineItem>
            </Timeline>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>Timeline</h3>
          <p className="section-desc">Container component. Accepts children only.</p>

          <h3>TimelineItem</h3>
          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>icon</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Icon name shown inside the dot</td></tr>
                <tr><td><code>color</code></td><td><code>'primary' | 'success' | 'warning' | 'danger' | 'neutral'</code></td><td><code>'primary'</code></td><td>Dot background color</td></tr>
                <tr><td><code>dotSize</code></td><td><code>number</code></td><td><code>10</code></td><td>Dot diameter in pixels</td></tr>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Item content</td></tr>
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
