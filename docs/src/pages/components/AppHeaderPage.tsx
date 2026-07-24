import { useState, useEffect, useRef } from 'react'
import { AppHeader } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<AppHeader title="My App" subtitle="Dashboard" />`

const VARIANTS_CODE = `<AppHeader title="Default" variant="default" />
<AppHeader title="Filled" variant="filled" />
<AppHeader title="Transparent" variant="transparent" />`

const STICKY_CODE = `<AppHeader title="Sticky Header" subtitle="Scrolls with you" sticky />`

const ACTIONS_CODE = `<AppHeader
  title="My App"
  subtitle="Dashboard"
  actions={
    <div style={{ display: 'flex', gap: 8 }}>
      <button>Settings</button>
      <button>Profile</button>
    </div>
  }
/>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',    label: 'Basic Usage' },
  { id: 'variants', label: 'Variants' },
  { id: 'sticky',   label: 'Sticky' },
  { id: 'actions',  label: 'With Actions' },
  { id: 'api',      label: 'API Reference' },
]

export function AppHeaderPage() {
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
        <h1>App Header</h1>
        <p className="docs-desc">
          A top-level application header with logo, title, subtitle, and action slots.
          Supports multiple visual variants and sticky positioning.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic Usage</h2>
          <p className="section-desc">
            A header with a title and subtitle. Renders across the full width of its container.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ width: '100%' }}>
              <AppHeader title="My App" subtitle="Dashboard" />
            </div>
          </CodePreview>
        </section>

        <section id="variants" className="demo-section" aria-labelledby="variants-heading">
          <h2 id="variants-heading">Variants</h2>
          <p className="section-desc">
            Three visual styles: default (subtle background), filled (solid background), and transparent.
          </p>
          <CodePreview code={VARIANTS_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
              <AppHeader title="Default" variant="default" />
              <AppHeader title="Filled" variant="filled" />
              <AppHeader title="Transparent" variant="transparent" />
            </div>
          </CodePreview>
        </section>

        <section id="sticky" className="demo-section" aria-labelledby="sticky-heading">
          <h2 id="sticky-heading">Sticky</h2>
          <p className="section-desc">
            Enable the <code>sticky</code> prop to keep the header pinned to the top of the viewport during scroll.
          </p>
          <CodePreview code={STICKY_CODE}>
            <div style={{ width: '100%' }}>
              <AppHeader title="Sticky Header" subtitle="Scrolls with you" sticky />
            </div>
          </CodePreview>
        </section>

        <section id="actions" className="demo-section" aria-labelledby="actions-heading">
          <h2 id="actions-heading">With Actions</h2>
          <p className="section-desc">
            Use the <code>actions</code> slot to add buttons, menus, or other interactive elements to the header.
          </p>
          <CodePreview code={ACTIONS_CODE}>
            <div style={{ width: '100%' }}>
              <AppHeader
                title="My App"
                subtitle="Dashboard"
                actions={
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button>Settings</button>
                    <button>Profile</button>
                  </div>
                }
              />
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API Reference</h2>
          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>logo</code></td><td><code>ReactNode</code></td><td>—</td><td>Logo element rendered at the start</td></tr>
                <tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>Application or page title</td></tr>
                <tr><td><code>subtitle</code></td><td><code>string</code></td><td>—</td><td>Secondary descriptor text</td></tr>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Center content slot</td></tr>
                <tr><td><code>actions</code></td><td><code>ReactNode</code></td><td>—</td><td>Right-aligned actions slot</td></tr>
                <tr><td><code>variant</code></td><td><code>'default' | 'filled' | 'transparent'</code></td><td><code>'default'</code></td><td>Visual style variant</td></tr>
                <tr><td><code>sticky</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Pin header to top on scroll</td></tr>
                <tr><td><code>height</code></td><td><code>string | number</code></td><td><code>56</code></td><td>Header height in pixels or CSS value</td></tr>
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
