import { useState, useEffect, useRef } from 'react'
import { PasswordInput, PasswordProgress } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<PasswordInput placeholder="Enter password" />`

const SIZES_CODE = `<PasswordInput size="sm" placeholder="Small" />
<PasswordInput size="md" placeholder="Medium (default)" />
<PasswordInput size="lg" placeholder="Large" />`

const WITH_PROGRESS_CODE = `const [password, setPassword] = useState('')

<PasswordInput
  placeholder="Create a password"
  value={password}
  onChange={setPassword}
/>
<PasswordProgress password={password} />`

const WITH_ERROR_CODE = `<PasswordInput
  placeholder="Enter password"
  error="Password must be at least 8 characters"
/>`

const DISABLED_CODE = `<PasswordInput placeholder="Disabled" disabled />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',         label: 'Basic' },
  { id: 'sizes',         label: 'Sizes' },
  { id: 'with-progress', label: 'With Progress' },
  { id: 'with-error',    label: 'With Error' },
  { id: 'disabled',      label: 'Disabled' },
  { id: 'api',           label: 'API' },
]

export function PasswordInputPage() {
  const [activeSection, setActiveSection] = useState('basic')
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
        <h1>Password Input</h1>
        <p className="docs-desc">
          Password input with a visibility toggle button. Pair with <code>PasswordProgress</code> to show
          real-time strength feedback.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">A password field with an eye icon to toggle visibility.</p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ maxWidth: 360 }}>
              <PasswordInput placeholder="Enter password" />
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Available in small, medium (default), and large sizes.</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
              <PasswordInput size="sm" placeholder="Small" />
              <PasswordInput size="md" placeholder="Medium (default)" />
              <PasswordInput size="lg" placeholder="Large" />
            </div>
          </CodePreview>
        </section>

        <section id="with-progress" className="demo-section" aria-labelledby="with-progress-heading">
          <h2 id="with-progress-heading">With Progress</h2>
          <p className="section-desc">
            Pair with <code>PasswordProgress</code> to give real-time strength feedback as the user types.
          </p>
          <CodePreview code={WITH_PROGRESS_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
              <PasswordInput
                placeholder="Create a password"
                value={password}
                onChange={setPassword}
              />
              <PasswordProgress password={password} />
            </div>
          </CodePreview>
        </section>

        <section id="with-error" className="demo-section" aria-labelledby="with-error-heading">
          <h2 id="with-error-heading">With Error</h2>
          <p className="section-desc">Show a validation error below the input.</p>
          <CodePreview code={WITH_ERROR_CODE}>
            <div style={{ maxWidth: 360 }}>
              <PasswordInput
                placeholder="Enter password"
                error="Password must be at least 8 characters"
              />
            </div>
          </CodePreview>
        </section>

        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled</h2>
          <p className="section-desc">Disable the input to prevent user interaction.</p>
          <CodePreview code={DISABLED_CODE}>
            <div style={{ maxWidth: 360 }}>
              <PasswordInput placeholder="Disabled" disabled />
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
                <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Controlled value</td></tr>
                <tr><td><code>defaultValue</code></td><td><code>string</code></td><td><code>''</code></td><td>Initial value (uncontrolled)</td></tr>
                <tr><td><code>onChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Change callback</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Input size</td></tr>
                <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>'Enter password'</code></td><td>Placeholder text</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the input</td></tr>
                <tr><td><code>error</code></td><td><code>string</code></td><td>—</td><td>Error message</td></tr>
                <tr><td><code>hint</code></td><td><code>string</code></td><td>—</td><td>Hint text</td></tr>
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
