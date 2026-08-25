import { useState, useEffect, useRef } from 'react'
import { Tabs } from 'spruce-react'
import type { TabItem } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<Tabs tabs={[
  { label: 'Overview', content: <p>Overview content...</p> },
  { label: 'Settings', content: <p>Settings content...</p> },
  { label: 'Activity', content: <p>Activity log...</p> },
]} />`

const DISABLED_CODE = `<Tabs tabs={[
  { label: 'Active', content: <p>Active tab</p> },
  { label: 'Disabled', disabled: true, content: <p>Cannot see this</p> },
  { label: 'Another', content: <p>Another tab</p> },
]} />`

const VERTICAL_CODE = `<Tabs vertical tabs={[
  { label: 'Profile', content: <p>Profile settings...</p> },
  { label: 'Security', content: <p>Security options...</p> },
  { label: 'Notifications', content: <p>Notification prefs...</p> },
  { label: 'Billing', content: <p>Billing info...</p> },
]} />`

const basicTabs: TabItem[] = [
  { label: 'Overview', content: <p style={{ margin: 0, color: 'var(--sp-text-color)' }}>Overview panel with summary information and key metrics.</p> },
  { label: 'Settings', content: <p style={{ margin: 0, color: 'var(--sp-text-color)' }}>Application settings and configuration options.</p> },
  { label: 'Activity', content: <p style={{ margin: 0, color: 'var(--sp-text-color)' }}>Recent activity log entries.</p> },
]

const disabledTabs: TabItem[] = [
  { label: 'Active', content: <p style={{ margin: 0, color: 'var(--sp-text-color)' }}>This tab is active.</p> },
  { label: 'Disabled', disabled: true, content: <p>Cannot see this</p> },
  { label: 'Another', content: <p style={{ margin: 0, color: 'var(--sp-text-color)' }}>Another active tab.</p> },
]

const verticalTabs: TabItem[] = [
  { label: 'Profile', content: <p style={{ margin: 0, color: 'var(--sp-text-color)' }}>Profile settings and account details.</p> },
  { label: 'Security', content: <p style={{ margin: 0, color: 'var(--sp-text-color)' }}>Password, 2FA, and security options.</p> },
  { label: 'Notifications', content: <p style={{ margin: 0, color: 'var(--sp-text-color)' }}>Email and push notification preferences.</p> },
  { label: 'Billing', content: <p style={{ margin: 0, color: 'var(--sp-text-color)' }}>Subscription and payment information.</p> },
]

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',    label: 'Basic' },
  { id: 'disabled', label: 'Disabled Tab' },
  { id: 'vertical', label: 'Vertical' },
  { id: 'api',      label: 'API' },
]

export function TabsPage() {
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
        <h1>Tabs</h1>
        <p className="docs-desc">
          Tabbed interface for organizing content into switchable panels. Supports horizontal
          and vertical layouts with keyboard navigation.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">Horizontal tabs with an active indicator bar.</p>
          <CodePreview code={BASIC_CODE}>
            <Tabs tabs={basicTabs} />
          </CodePreview>
        </section>

        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled Tab</h2>
          <p className="section-desc">Individual tabs can be disabled to prevent selection.</p>
          <CodePreview code={DISABLED_CODE}>
            <Tabs tabs={disabledTabs} />
          </CodePreview>
        </section>

        <section id="vertical" className="demo-section" aria-labelledby="vertical-heading">
          <h2 id="vertical-heading">Vertical</h2>
          <p className="section-desc">
            Set <code>vertical</code> to render the tab list on the left side with a right-border indicator.
          </p>
          <CodePreview code={VERTICAL_CODE}>
            <Tabs vertical tabs={verticalTabs} />
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Tabs Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>tabs</code></td><td><code>TabItem[]</code></td><td>—</td><td>Array of tab definitions</td></tr>
                <tr><td><code>activeIndex</code></td><td><code>number</code></td><td>—</td><td>Controlled active tab index</td></tr>
                <tr><td><code>defaultActiveIndex</code></td><td><code>number</code></td><td><code>0</code></td><td>Initial active tab (uncontrolled)</td></tr>
                <tr><td><code>onChange</code></td><td><code>(index: number) =&gt; void</code></td><td>—</td><td>Callback on tab change</td></tr>
                <tr><td><code>vertical</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Vertical tab layout</td></tr>
                <tr><td><code>lazy</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Mount panels on first activation and keep them available afterward</td></tr>
                <tr><td><code>reorderable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enable pointer drag reorder callbacks</td></tr>
                <tr><td><code>onTabClose</code> / <code>onTabContextMenu</code> / <code>onTabReorder</code></td><td>callbacks</td><td>—</td><td>Close, context-menu, and reorder lifecycle callbacks</td></tr>
                <tr><td><code>toolbar</code> / <code>toolbarPlacement</code></td><td><code>ReactNode</code> / <code>'end' | 'after-tabs'</code></td><td>— / <code>'end'</code></td><td>Place auxiliary controls beside or below the tab strip</td></tr>
              </tbody>
            </table>
          </div>
          <h3 style={{ marginTop: 16 }}>TabItem</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>label</code></td><td><code>string</code></td><td>Tab label text</td></tr>
                <tr><td><code>icon</code></td><td><code>string</code></td><td>Optional icon name</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td>Disable this tab</td></tr>
                <tr><td><code>badge</code> / <code>closeable</code></td><td><code>ReactNode</code> / <code>boolean</code></td><td>— / <code>false</code></td><td>Optional badge and localized close affordance</td></tr>
                <tr><td><code>lazy</code> / <code>routeFragment</code></td><td><code>boolean</code> / <code>string</code></td><td><code>false</code> / —</td><td>Per-tab lazy content and URL fragment synchronization</td></tr>
                <tr><td><code>content</code></td><td><code>ReactNode</code></td><td>Panel content rendered when active</td></tr>
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
