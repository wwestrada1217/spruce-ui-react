import { useState, useEffect, useRef } from 'react'
import { NavMenu } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<NavMenu
  items={[
    { label: 'Home', href: '#' },
    {
      label: 'Products',
      links: [
        { label: 'Project Manager', href: '#', description: 'Track team tasks and deadlines' },
        { label: 'Analytics', href: '#', description: 'Visualize data in real time' },
        { label: 'Automation', href: '#', description: 'Automate repetitive workflows' },
      ],
    },
    { label: 'Pricing', href: '#' },
    { label: 'Contact', href: '#' },
  ]}
/>`

const ICONS_CODE = `<NavMenu
  items={[
    {
      label: 'Getting Started',
      links: [
        { label: 'Quick Start', href: '#', icon: 'rocket', description: 'Get up and running in minutes' },
        { label: 'Guides', href: '#', icon: 'book', description: 'Learn the core concepts' },
        { label: 'Documentation', href: '#', icon: 'file-text', description: 'Full API reference' },
      ],
    },
    {
      label: 'Resources',
      links: [
        { label: 'Templates', href: '#', icon: 'layout-grid', description: 'Ready-to-use UI patterns' },
        { label: 'Design Tokens', href: '#', icon: 'palette', description: 'Colors, spacing, and typography' },
        { label: 'Source Code', href: '#', icon: 'github', description: 'Contribute on GitHub' },
      ],
    },
    { label: 'Blog', href: '#' },
  ]}
/>`

const RICH_CODE = `<NavMenu
  items={[
    {
      label: 'Components',
      content: (
        <div className="demo-grid">
          <div className="demo-grid__col">
            <p className="demo-grid__heading">Inputs</p>
            {/* NavMenu links rendered inside custom content */}
          </div>
          <div className="demo-grid__col">
            <p className="demo-grid__heading">Actions</p>
            {/* NavMenu links rendered inside custom content */}
          </div>
        </div>
      ),
    },
    {
      label: 'Foundations',
      content: (
        <div className="demo-featured">
          <div className="demo-featured__highlight">
            <p className="demo-featured__label">Design Tokens</p>
            <p className="demo-featured__desc">A unified system of colors, spacing, and typography.</p>
          </div>
          {/* Additional links */}
        </div>
      ),
    },
    { label: 'Docs', href: '#' },
  ]}
/>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic Usage' },
  { id: 'icons', label: 'With Icons' },
  { id: 'rich', label: 'Rich Content' },
  { id: 'api', label: 'API' },
]

export function NavMenuPage() {
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
        <h1>Navigation Menu</h1>
        <p className="docs-desc">
          A horizontal navigation bar with hover-activated dropdown panels for organizing site-wide links. Ideal for top-level navigation with rich content menus.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic Usage</h2>
          <p className="section-desc">Mix plain links and trigger items that reveal dropdown panels on hover or click.</p>
          <CodePreview code={BASIC_CODE}>
            <NavMenu
              items={[
                { label: 'Home', href: '#' },
                {
                  label: 'Products',
                  links: [
                    { label: 'Project Manager', href: '#', description: 'Track team tasks and deadlines' },
                    { label: 'Analytics', href: '#', description: 'Visualize data in real time' },
                    { label: 'Automation', href: '#', description: 'Automate repetitive workflows' },
                  ],
                },
                { label: 'Pricing', href: '#' },
                { label: 'Contact', href: '#' },
              ]}
            />
          </CodePreview>
        </section>

        <section id="icons" className="demo-section" aria-labelledby="icons-heading">
          <h2 id="icons-heading">With Icons</h2>
          <p className="section-desc">Add icons to links inside the dropdown panel for visual cues.</p>
          <CodePreview code={ICONS_CODE}>
            <NavMenu
              items={[
                {
                  label: 'Getting Started',
                  links: [
                    { label: 'Quick Start', href: '#', icon: 'rocket', description: 'Get up and running in minutes' },
                    { label: 'Guides', href: '#', icon: 'book', description: 'Learn the core concepts' },
                    { label: 'Documentation', href: '#', icon: 'file-text', description: 'Full API reference' },
                  ],
                },
                {
                  label: 'Resources',
                  links: [
                    { label: 'Templates', href: '#', icon: 'layout-grid', description: 'Ready-to-use UI patterns' },
                    { label: 'Design Tokens', href: '#', icon: 'palette', description: 'Colors, spacing, and typography' },
                    { label: 'Source Code', href: '#', icon: 'github', description: 'Contribute on GitHub' },
                  ],
                },
                { label: 'Blog', href: '#' },
              ]}
            />
          </CodePreview>
        </section>

        <section id="rich" className="demo-section" aria-labelledby="rich-heading">
          <h2 id="rich-heading">Rich Content</h2>
          <p className="section-desc">The content panel accepts arbitrary markup. Build multi-column grids, featured items, or any custom layout.</p>
          <CodePreview code={RICH_CODE}>
            <NavMenu
              items={[
                {
                  label: 'Components',
                  content: (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: 460 }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--sp-text-subtle, #718096)', margin: '0 0 4px', padding: '0 12px' }}>Inputs</p>
                        <a href="#" style={{ padding: '8px 12px', textDecoration: 'none', color: 'inherit' }}>
                          <strong style={{ fontSize: 13 }}>Input</strong>
                          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--sp-text-muted, #4a5568)' }}>Text, email, and number fields</p>
                        </a>
                        <a href="#" style={{ padding: '8px 12px', textDecoration: 'none', color: 'inherit' }}>
                          <strong style={{ fontSize: 13 }}>Combobox</strong>
                          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--sp-text-muted, #4a5568)' }}>Searchable select with filtering</p>
                        </a>
                        <a href="#" style={{ padding: '8px 12px', textDecoration: 'none', color: 'inherit' }}>
                          <strong style={{ fontSize: 13 }}>Datepicker</strong>
                          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--sp-text-muted, #4a5568)' }}>Date and time selection</p>
                        </a>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--sp-text-subtle, #718096)', margin: '0 0 4px', padding: '0 12px' }}>Actions</p>
                        <a href="#" style={{ padding: '8px 12px', textDecoration: 'none', color: 'inherit' }}>
                          <strong style={{ fontSize: 13 }}>Button</strong>
                          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--sp-text-muted, #4a5568)' }}>Primary and secondary actions</p>
                        </a>
                        <a href="#" style={{ padding: '8px 12px', textDecoration: 'none', color: 'inherit' }}>
                          <strong style={{ fontSize: 13 }}>Dropdown</strong>
                          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--sp-text-muted, #4a5568)' }}>Contextual action list</p>
                        </a>
                        <a href="#" style={{ padding: '8px 12px', textDecoration: 'none', color: 'inherit' }}>
                          <strong style={{ fontSize: 13 }}>Stepper</strong>
                          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--sp-text-muted, #4a5568)' }}>Step-by-step wizards</p>
                        </a>
                      </div>
                    </div>
                  ),
                },
                {
                  label: 'Foundations',
                  content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 300 }}>
                      <div style={{ padding: 12, background: 'var(--sp-surface-50, #f8f9fb)', borderRadius: 6, marginBottom: 8 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--sp-text-color, #1a202c)', margin: '0 0 4px' }}>Design Tokens</p>
                        <p style={{ fontSize: 11, color: 'var(--sp-text-muted, #4a5568)', lineHeight: 1.5, margin: 0 }}>A unified system of colors, spacing, and typography that powers every component in the library.</p>
                      </div>
                      <a href="#" style={{ padding: '8px 12px', textDecoration: 'none', color: 'inherit', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>Colors</span>
                        <span style={{ fontSize: 11, color: 'var(--sp-text-muted, #4a5568)' }}>Brand and semantic palettes</span>
                      </a>
                      <a href="#" style={{ padding: '8px 12px', textDecoration: 'none', color: 'inherit', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>Typography</span>
                        <span style={{ fontSize: 11, color: 'var(--sp-text-muted, #4a5568)' }}>Font scale and weights</span>
                      </a>
                    </div>
                  ),
                },
                { label: 'Docs', href: '#' },
              ]}
            />
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>NavMenu</h3>
          <p className="section-desc">Root container that coordinates open/close state across items.</p>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>items</code></td><td><code>NavMenuItem[]</code></td><td><code>[]</code></td><td>Array of top-level navigation items</td></tr>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Compound <code>NavMenuItem</code> composition</td></tr>
                <tr><td><code>openIndex</code> / <code>onOpenChange</code></td><td><code>number | null</code> / callback</td><td>—</td><td>Controlled open item state</td></tr>
                <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td>i18n main navigation</td><td>Accessible navigation name</td></tr>
                <tr><td><code>className</code></td><td><code>string</code></td><td><code>''</code></td><td>Additional CSS class for the root element</td></tr>
              </tbody>
            </table>
          </div>

          <h3>NavMenuItem</h3>
          <p className="section-desc">Each top-level navigation entry. Renders as a link when <code>href</code> is set and no content is provided, otherwise renders as a trigger button.</p>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>label</code></td><td><code>string</code></td><td>&mdash;</td><td>Text shown in the trigger or link (required)</td></tr>
                <tr><td><code>href</code></td><td><code>string | undefined</code></td><td><code>undefined</code></td><td>URL for link-only items (no dropdown)</td></tr>
                <tr><td><code>links</code></td><td><code>NavMenuLink[]</code></td><td><code>undefined</code></td><td>Grid of links for dropdown panel</td></tr>
                <tr><td><code>content</code></td><td><code>ReactNode</code></td><td><code>undefined</code></td><td>Custom dropdown content (overrides links)</td></tr>
              </tbody>
            </table>
          </div>

          <h3>NavMenuLink</h3>
          <p className="section-desc">Styled link for inside dropdown panels. Supports an icon and description.</p>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>label</code></td><td><code>string</code></td><td>&mdash;</td><td>Link display text</td></tr>
                <tr><td><code>href</code></td><td><code>string</code></td><td><code>'#'</code></td><td>Link destination</td></tr>
                <tr><td><code>icon</code></td><td><code>string | undefined</code></td><td><code>undefined</code></td><td>Icon name displayed in a tinted box</td></tr>
                <tr><td><code>description</code></td><td><code>string | undefined</code></td><td><code>undefined</code></td><td>Secondary text below the title</td></tr>
                <tr><td><code>onClick</code></td><td><code>{'() => void'}</code></td><td><code>undefined</code></td><td>Click handler for the link</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Compound primitives</h3>
          <p className="section-desc"><code>NavMenuContent</code> provides a surface for arbitrary panel content; <code>NavMenuLink</code> renders an accessible menu item with optional icon and description. Hover opening is delayed and Escape/outside clicks dismiss the panel.</p>

          <h3>Keyboard Interactions</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Key</th><th>Behavior</th></tr>
              </thead>
              <tbody>
                <tr><td><code>Enter / Space</code></td><td>Toggle the dropdown panel</td></tr>
                <tr><td><code>Arrow Down</code></td><td>Open the dropdown panel</td></tr>
                <tr><td><code>Escape</code></td><td>Close the currently open panel</td></tr>
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
