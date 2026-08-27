import { useState, useEffect, useRef } from 'react'
import { Splitter, SplitterPane } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<Splitter>
  <SplitterPane>
    <div style={{ padding: 16 }}>Left pane</div>
  </SplitterPane>
  <SplitterPane>
    <div style={{ padding: 16 }}>Right pane</div>
  </SplitterPane>
</Splitter>`

const VERTICAL_CODE = `<Splitter orientation="vertical">
  <SplitterPane>
    <div style={{ padding: 16 }}>Top pane</div>
  </SplitterPane>
  <SplitterPane>
    <div style={{ padding: 16 }}>Bottom pane</div>
  </SplitterPane>
</Splitter>`

const THREE_PANES_CODE = `<Splitter initialSizes={[25, 50, 25]}>
  <SplitterPane minSize={10}><div style={{ padding: 16 }}>Sidebar</div></SplitterPane>
  <SplitterPane minSize={20}><div style={{ padding: 16 }}>Main</div></SplitterPane>
  <SplitterPane minSize={10}><div style={{ padding: 16 }}>Panel</div></SplitterPane>
</Splitter>`

const MIN_MAX_CODE = `<Splitter>
  <SplitterPane minSize={20} maxSize={60}>
    <div style={{ padding: 16 }}>Min 20%, Max 60%</div>
  </SplitterPane>
  <SplitterPane minSize={20}>
    <div style={{ padding: 16 }}>Min 20%</div>
  </SplitterPane>
</Splitter>`

const KEYBOARD_CODE = `<Splitter
  initialSizes={[30, 70]}
  keyIncrement={5}
  thin
  ariaLabel="Inspector split view"
  onDragStart={() => setDragging(true)}
  onDragEnd={() => setDragging(false)}
>
  ...
</Splitter>`

const paneStyle: React.CSSProperties = {
  padding: 16,
  fontSize: 13,
  color: 'var(--sp-text-color, #1a202c)',
  background: 'var(--sp-surface-50, #f8f9fb)',
  height: '100%',
  boxSizing: 'border-box',
}

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',       label: 'Basic' },
  { id: 'vertical',    label: 'Vertical' },
  { id: 'three-panes', label: 'Three Panes' },
  { id: 'min-max',     label: 'Min / Max' },
  { id: 'keyboard',   label: 'Keyboard & Thin' },
  { id: 'api',         label: 'API' },
]

export function SplitterPage() {
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
        <h1>Splitter</h1>
        <p className="docs-desc">
          Resizable split layout with draggable gutters. Supports horizontal and vertical orientation,
          min/max constraints, keyboard controls, and touch.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">Drag the gutter to resize panes. Double-click to reset.</p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ height: 200, border: '1px solid var(--sp-border)', borderRadius: 8, overflow: 'hidden' }}>
              <Splitter>
                <SplitterPane>
                  <div style={paneStyle}>Left pane</div>
                </SplitterPane>
                <SplitterPane>
                  <div style={paneStyle}>Right pane</div>
                </SplitterPane>
              </Splitter>
            </div>
          </CodePreview>
        </section>

        <section id="vertical" className="demo-section" aria-labelledby="vertical-heading">
          <h2 id="vertical-heading">Vertical</h2>
          <p className="section-desc">Stack panes vertically with a horizontal gutter.</p>
          <CodePreview code={VERTICAL_CODE}>
            <div style={{ height: 300, border: '1px solid var(--sp-border)', borderRadius: 8, overflow: 'hidden' }}>
              <Splitter orientation="vertical">
                <SplitterPane>
                  <div style={paneStyle}>Top pane</div>
                </SplitterPane>
                <SplitterPane>
                  <div style={paneStyle}>Bottom pane</div>
                </SplitterPane>
              </Splitter>
            </div>
          </CodePreview>
        </section>

        <section id="three-panes" className="demo-section" aria-labelledby="three-panes-heading">
          <h2 id="three-panes-heading">Three Panes</h2>
          <p className="section-desc">
            Multiple panes with custom initial sizes. Use <code>initialSizes</code> to set starting percentages.
          </p>
          <CodePreview code={THREE_PANES_CODE}>
            <div style={{ height: 200, border: '1px solid var(--sp-border)', borderRadius: 8, overflow: 'hidden' }}>
              <Splitter initialSizes={[25, 50, 25]}>
                <SplitterPane minSize={10}>
                  <div style={paneStyle}>Sidebar</div>
                </SplitterPane>
                <SplitterPane minSize={20}>
                  <div style={paneStyle}>Main Content</div>
                </SplitterPane>
                <SplitterPane minSize={10}>
                  <div style={paneStyle}>Panel</div>
                </SplitterPane>
              </Splitter>
            </div>
          </CodePreview>
        </section>

        <section id="min-max" className="demo-section" aria-labelledby="min-max-heading">
          <h2 id="min-max-heading">Min / Max</h2>
          <p className="section-desc">
            Set per-pane constraints with <code>minSize</code> and <code>maxSize</code> (percentages).
          </p>
          <CodePreview code={MIN_MAX_CODE}>
            <div style={{ height: 200, border: '1px solid var(--sp-border)', borderRadius: 8, overflow: 'hidden' }}>
              <Splitter>
                <SplitterPane minSize={20} maxSize={60}>
                  <div style={paneStyle}>Min 20%, Max 60%</div>
                </SplitterPane>
                <SplitterPane minSize={20}>
                  <div style={paneStyle}>Min 20%</div>
                </SplitterPane>
              </Splitter>
            </div>
          </CodePreview>
        </section>

        <section id="keyboard" className="demo-section" aria-labelledby="keyboard-heading">
          <h2 id="keyboard-heading">Keyboard &amp; Thin Mode</h2>
          <p className="section-desc">Focus a gutter and use the arrow keys to move it. <code>Home</code> moves the preceding pane to its minimum and <code>End</code> moves it to its maximum. Thin mode keeps the full hit area while rendering a subtle 1px divider.</p>
          <CodePreview code={KEYBOARD_CODE}>
            <div style={{ height: 200, border: '1px solid var(--sp-border)', borderRadius: 8, overflow: 'hidden' }}>
              <Splitter initialSizes={[35, 65]} keyIncrement={5} thin ariaLabel="Inspector split view">
                <SplitterPane><div style={paneStyle}>Focus the divider and press ArrowRight</div></SplitterPane>
                <SplitterPane><div style={paneStyle}>Thin visual divider</div></SplitterPane>
              </Splitter>
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Splitter Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Split direction</td></tr>
                <tr><td><code>gutterSize</code></td><td><code>number</code></td><td><code>4</code></td><td>Gutter width/height in px</td></tr>
                <tr><td><code>initialSizes</code></td><td><code>number[]</code></td><td>—</td><td>Starting sizes in percentages</td></tr>
                <tr><td><code>sizes</code></td><td><code>number[]</code></td><td>—</td><td>Controlled pane sizes in percentages</td></tr>
                <tr><td><code>keyIncrement</code></td><td><code>number</code></td><td><code>2</code></td><td>Percentage moved per arrow-key press</td></tr>
                <tr><td><code>thin</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Render a 1px visual divider while preserving the gutter hit area</td></tr>
                <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td>localized</td><td>Accessible name for the split view</td></tr>
                <tr><td><code>onSizeChange</code></td><td><code>(sizes: number[]) =&gt; void</code></td><td>—</td><td>Fired during drag and keyboard changes</td></tr>
                <tr><td><code>onDragStart</code></td><td><code>() =&gt; void</code></td><td>—</td><td>Fired when pointer or touch dragging starts</td></tr>
                <tr><td><code>onDragEnd</code></td><td><code>() =&gt; void</code></td><td>—</td><td>Fired when pointer or touch dragging ends</td></tr>
              </tbody>
            </table>
          </div>
          <h3 style={{ marginTop: 16 }}>SplitterPane Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>minSize</code></td><td><code>number</code></td><td><code>0</code></td><td>Minimum size in percentage</td></tr>
                <tr><td><code>maxSize</code></td><td><code>number</code></td><td><code>100</code></td><td>Maximum size in percentage</td></tr>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Pane content</td></tr>
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
