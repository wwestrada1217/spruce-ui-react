import { useState, useEffect, useRef } from 'react'
import { Switch } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { DocsPackageBadge } from '../../components/DocsPackageBadge'

const BASIC_CODE = `<Switch onChange={(checked) => console.log(checked)}>
  Enable notifications
</Switch>
<Switch>Dark mode</Switch>
<Switch disabled>Disabled switch</Switch>`

const ICONS_CODE = `<Switch showIcon defaultChecked>With checkmark icon</Switch>
<Switch checkedIcon="check" uncheckedIcon="x">Custom state icons</Switch>
<Switch showIcon disabled defaultChecked>Disabled with icon</Switch>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'icons', label: 'Handle Icons' },
  { id: 'api',   label: 'API' },
]

export function SwitchPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [notifications, setNotifications] = useState(false)
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
        <h1>Switch</h1>
        <p className="docs-desc">
          Toggle switches for boolean settings, with optional disabled state and configurable handle
          icons.
        </p>
        <DocsPackageBadge packageName="spruce-react" symbols={['Switch']} />

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">
            Use switches for on/off settings. Visually distinct from checkboxes to signal a live toggle.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Switch onChange={setNotifications}>Enable notifications</Switch>
              <Switch>Dark mode</Switch>
              <Switch disabled>Disabled switch</Switch>
            </div>
          </CodePreview>
          <p style={{ marginTop: 8, fontSize: 13, color: 'var(--sp-text-subtle, #718096)' }}>
            Notifications: {notifications ? 'On' : 'Off'}
          </p>
        </section>

        <section id="icons" className="demo-section" aria-labelledby="icons-heading">
          <h2 id="icons-heading">Handle Icons</h2>
          <p className="section-desc">
            Add icons to the switch thumb with <code>showIcon</code>, or customize the checked and
            unchecked states independently.
          </p>
          <CodePreview code={ICONS_CODE} language="typescript">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Switch showIcon defaultChecked>With checkmark icon</Switch>
              <Switch checkedIcon="check" uncheckedIcon="x">Custom state icons</Switch>
              <Switch showIcon disabled defaultChecked>Disabled with icon</Switch>
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
                <tr><td><code>checked</code></td><td><code>boolean</code></td><td>—</td><td>Controlled checked state</td></tr>
                <tr><td><code>defaultChecked</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Initial checked state (uncontrolled)</td></tr>
                <tr><td><code>onChange</code></td><td><code>(checked: boolean) =&gt; void</code></td><td>—</td><td>Callback when toggled</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the switch</td></tr>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Label content</td></tr>
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
