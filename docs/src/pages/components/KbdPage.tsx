import { useState, useEffect, useRef } from 'react'
import { Kbd } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<Kbd>Enter</Kbd>
<Kbd>Escape</Kbd>
<Kbd>Tab</Kbd>
<Kbd>Space</Kbd>
<Kbd>Backspace</Kbd>
<Kbd>Delete</Kbd>
<Kbd>↑</Kbd>
<Kbd>↓</Kbd>
<Kbd>←</Kbd>
<Kbd>→</Kbd>`

const CHORDS_CODE = `<Kbd keys={['Ctrl', 'K']} />
<Kbd keys={['Ctrl', 'Shift', 'P']} />
<Kbd keys={['⌘', 'K']} />
<Kbd keys={['Alt', 'F4']} />`

const SIZES_CODE = `{/* sm */}
<Kbd size="sm">Ctrl</Kbd>
<Kbd size="sm" keys={['Ctrl', 'K']} />

{/* md (default) */}
<Kbd size="md">Ctrl</Kbd>
<Kbd size="md" keys={['Ctrl', 'K']} />

{/* lg */}
<Kbd size="lg">Ctrl</Kbd>
<Kbd size="lg" keys={['Ctrl', 'K']} />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',      label: 'Basic' },
  { id: 'chords',     label: 'Chords' },
  { id: 'sizes',      label: 'Sizes' },
  { id: 'in-context', label: 'In Context' },
  { id: 'api',        label: 'API' },
]

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
}

const colStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 12,
}

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--sp-text-sm, 13px)',
  color: 'var(--sp-text-muted, #4a5568)',
}

export function KbdPage() {
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
        <h1>Kbd</h1>
        <p className="docs-desc">
          Displays keyboard keys and shortcuts in a native <code>&lt;kbd&gt;</code> element styled
          to resemble a physical key. Supports single keys via children and multi-key chords via
          the <code>keys</code> prop.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">Use children to display a single key label.</p>
          <CodePreview code={BASIC_CODE}>
            <div style={rowStyle}>
              <Kbd>Enter</Kbd>
              <Kbd>Escape</Kbd>
              <Kbd>Tab</Kbd>
              <Kbd>Space</Kbd>
              <Kbd>Backspace</Kbd>
              <Kbd>Delete</Kbd>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <Kbd>←</Kbd>
              <Kbd>→</Kbd>
            </div>
          </CodePreview>
        </section>

        <section id="chords" className="demo-section" aria-labelledby="chords-heading">
          <h2 id="chords-heading">Chords</h2>
          <p className="section-desc">
            Pass an array of key labels via the <code>keys</code> prop to display a chord. Keys are
            separated by a <code>+</code> character.
          </p>
          <CodePreview code={CHORDS_CODE}>
            <div style={colStyle}>
              <div style={rowStyle}>
                <Kbd keys={['Ctrl', 'K']} />
                <span style={labelStyle}>Copy to clipboard</span>
              </div>
              <div style={rowStyle}>
                <Kbd keys={['Ctrl', 'Shift', 'P']} />
                <span style={labelStyle}>Open command palette</span>
              </div>
              <div style={rowStyle}>
                <Kbd keys={['⌘', 'K']} />
                <span style={labelStyle}>Open search (macOS)</span>
              </div>
              <div style={rowStyle}>
                <Kbd keys={['Alt', 'F4']} />
                <span style={labelStyle}>Close window</span>
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">
            Three size variants — <code>sm</code>, <code>md</code> (default), and <code>lg</code> —
            for use in dense tables or large call-to-action hints.
          </p>
          <CodePreview code={SIZES_CODE}>
            <div style={colStyle}>
              <div style={{ ...rowStyle, alignItems: 'flex-end' }}>
                <Kbd size="sm">Ctrl</Kbd>
                <Kbd size="sm" keys={['Ctrl', 'K']} />
                <span style={{ ...labelStyle, fontSize: 'var(--sp-text-xs, 11px)' }}>sm</span>
              </div>
              <div style={{ ...rowStyle, alignItems: 'flex-end' }}>
                <Kbd size="md">Ctrl</Kbd>
                <Kbd size="md" keys={['Ctrl', 'K']} />
                <span style={{ ...labelStyle, fontSize: 'var(--sp-text-xs, 11px)' }}>md</span>
              </div>
              <div style={{ ...rowStyle, alignItems: 'flex-end' }}>
                <Kbd size="lg">Ctrl</Kbd>
                <Kbd size="lg" keys={['Ctrl', 'K']} />
                <span style={{ ...labelStyle, fontSize: 'var(--sp-text-xs, 11px)' }}>lg</span>
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="in-context" className="demo-section" aria-labelledby="in-context-heading">
          <h2 id="in-context-heading">In Context</h2>
          <p className="section-desc">
            Key badges inline with prose, providing contextual keyboard hints inside help text or
            tooltips.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            background: 'var(--sp-surface-50, #f8f9fb)',
            border: '1px solid var(--sp-border, rgba(0, 0, 0, 0.08))',
            borderRadius: 'var(--sp-radius-md, 8px)',
            padding: '16px 20px',
          }}>
            <p style={{ margin: 0, fontSize: 'var(--sp-text-sm, 13px)', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              Press <Kbd size="sm">Ctrl</Kbd> + <Kbd size="sm">C</Kbd> to copy the selection.
            </p>
            <p style={{ margin: 0, fontSize: 'var(--sp-text-sm, 13px)', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              Hit <Kbd size="sm">Enter</Kbd> to confirm or <Kbd size="sm">Escape</Kbd> to cancel.
            </p>
            <p style={{ margin: 0, fontSize: 'var(--sp-text-sm, 13px)', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              Use <Kbd size="sm" keys={['Ctrl', 'Shift', 'P']} /> to open the command palette.
            </p>
            <p style={{ margin: 0, fontSize: 'var(--sp-text-sm, 13px)', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              Navigate rows with <Kbd size="sm">↑</Kbd> and <Kbd size="sm">↓</Kbd>.
            </p>
          </div>
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
                <tr>
                  <td><code>size</code></td>
                  <td><code>'sm' | 'md' | 'lg'</code></td>
                  <td><code>'md'</code></td>
                  <td>Visual size variant</td>
                </tr>
                <tr>
                  <td><code>keys</code></td>
                  <td><code>string[]</code></td>
                  <td><code>[]</code></td>
                  <td>Ordered list of key labels for a chord (e.g. <code>['Ctrl', 'K']</code>). When non-empty, children are ignored.</td>
                </tr>
                <tr>
                  <td><code>children</code></td>
                  <td><code>ReactNode</code></td>
                  <td>—</td>
                  <td>Single key label (used when <code>keys</code> is empty)</td>
                </tr>
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
