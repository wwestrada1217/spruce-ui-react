import { useState, useEffect, useRef } from 'react'
import { PasswordProgress, PasswordInput } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const INTERACTIVE_CODE = `const [password, setPassword] = useState('')

<PasswordInput value={password} onChange={setPassword} placeholder="Type a password..." />
<PasswordProgress password={password} />`

const LEVELS_CODE = `<PasswordProgress password="a" />
<PasswordProgress password="abc123" />
<PasswordProgress password="Abc1234" />
<PasswordProgress password="Abc1234!" />`

const NO_LABEL_CODE = `<PasswordProgress password="Abc1234!" showLabel={false} />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'interactive', label: 'Interactive Demo' },
  { id: 'levels',      label: 'Strength Levels' },
  { id: 'no-label',    label: 'Without Label' },
  { id: 'api',         label: 'API' },
]

const levelLabelStyle: React.CSSProperties = {
  fontSize: 'var(--sp-text-xs, 11px)',
  color: 'var(--sp-text-muted, #4a5568)',
  marginBottom: 4,
}

export function PasswordProgressPage() {
  const [activeSection, setActiveSection] = useState('interactive')
  const [password, setPassword] = useState('')
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
        <h1>Password Progress</h1>
        <p className="docs-desc">
          Visual strength indicator for password fields. Displays 4 bars colored by strength level:
          weak, fair, good, and strong.
        </p>

        <section id="interactive" className="demo-section" aria-labelledby="interactive-heading">
          <h2 id="interactive-heading">Interactive Demo</h2>
          <p className="section-desc">
            Type a password to see the strength bars update in real time. Strength is calculated from
            length, uppercase, lowercase, digits, and special characters.
          </p>
          <CodePreview code={INTERACTIVE_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
              <PasswordInput
                value={password}
                onChange={setPassword}
                placeholder="Type a password..."
              />
              <PasswordProgress password={password} />
            </div>
          </CodePreview>
        </section>

        <section id="levels" className="demo-section" aria-labelledby="levels-heading">
          <h2 id="levels-heading">Strength Levels</h2>
          <p className="section-desc">
            Strength is computed based on how many of the following criteria the password meets:
            length ≥ 8, uppercase letter, lowercase letter, digit, and special character.
          </p>
          <CodePreview code={LEVELS_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
              <div>
                <p style={levelLabelStyle}>Weak — "a" (score 1)</p>
                <PasswordProgress password="a" />
              </div>
              <div>
                <p style={levelLabelStyle}>Fair — "abc123" (score 2)</p>
                <PasswordProgress password="abc123" />
              </div>
              <div>
                <p style={levelLabelStyle}>Good — "Abc1234" (score 3)</p>
                <PasswordProgress password="Abc1234" />
              </div>
              <div>
                <p style={levelLabelStyle}>Strong — "Abc1234!" (score 4+)</p>
                <PasswordProgress password="Abc1234!" />
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="no-label" className="demo-section" aria-labelledby="no-label-heading">
          <h2 id="no-label-heading">Without Label</h2>
          <p className="section-desc">Hide the text label by setting <code>showLabel</code> to false.</p>
          <CodePreview code={NO_LABEL_CODE}>
            <div style={{ maxWidth: 360 }}>
              <PasswordProgress password="Abc1234!" showLabel={false} />
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
                <tr><td><code>password</code></td><td><code>string</code></td><td><code>''</code></td><td>Password value to evaluate</td></tr>
                <tr><td><code>showLabel</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show strength label text</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: 16 }}>Strength Scoring</h3>
          <p className="section-desc">One point is awarded for each satisfied criterion:</p>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Score</th><th>Label</th><th>Color</th></tr>
              </thead>
              <tbody>
                <tr><td>0–1</td><td>Weak</td><td>Danger (red)</td></tr>
                <tr><td>2</td><td>Fair</td><td>Warning (amber)</td></tr>
                <tr><td>3</td><td>Good</td><td>Info (cyan)</td></tr>
                <tr><td>4–5</td><td>Strong</td><td>Success (green)</td></tr>
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
