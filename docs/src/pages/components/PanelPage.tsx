import { useState, useEffect, useRef } from 'react'
import { Panel } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const items = Array.from({ length: 20 }, (_, i) => i + 1)
const variants: ('default' | 'outlined' | 'elevated' | 'filled' | 'ghost' | 'flush')[] = [
  'default', 'outlined', 'elevated', 'filled', 'ghost', 'flush',
]
const paddings: ('none' | 'sm' | 'md' | 'lg')[] = ['none', 'sm', 'md', 'lg']

const BASIC_CODE = `<Panel maxHeight="240px">
  <p>Scrollable content line 1</p>
  <p>Scrollable content line 2</p>
  {/* ... */}
</Panel>`

const HEADER_FOOTER_CODE = `<Panel maxHeight="300px">
  <Panel.Header>
    <Icon name="inbox" size={18} />
    <span>Messages</span>
    <Badge size="sm" variant="primary">12</Badge>
  </Panel.Header>

  <p>Message content scrolls here...</p>

  <Panel.Footer>
    <Button size="sm" variant="ghost">Mark all read</Button>
    <Button size="sm" variant="primary">Compose</Button>
  </Panel.Footer>
</Panel>`

const VARIANTS_CODE = `{/* default | outlined | elevated | filled | ghost | flush */}
<Panel variant="outlined">
  <Panel.Header>Header</Panel.Header>
  <p>Content</p>
</Panel>`

const PADDING_CODE = `{/* none | sm | md (default) | lg */}
<Panel padding="sm">
  <p>Compact padding</p>
</Panel>`

const FIXED_HEIGHT_CODE = `<Panel height="200px">
  <Panel.Header>Fixed 200px</Panel.Header>
  <p>Content scrolls when it overflows</p>
  <Panel.Footer>Footer</Panel.Footer>
</Panel>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'header-footer', label: 'Header & Footer' },
  { id: 'variants', label: 'Variants' },
  { id: 'padding', label: 'Padding' },
  { id: 'fixed-height', label: 'Fixed Height' },
  { id: 'api', label: 'API' },
]

export function PanelPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = mainRef.current?.closest('.docs-main') as HTMLElement | null

    const checkIfScrolledToBottom = () => {
      if (!scrollContainer) return
      if (Math.abs(scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) < 2) {
        setActiveSection(SECTIONS[SECTIONS.length - 1].id)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollContainer && Math.abs(scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) < 2) return
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { root: scrollContainer || null, rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    )

    for (const section of SECTIONS) {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    }

    scrollContainer?.addEventListener('scroll', checkIfScrolledToBottom, { passive: true })

    return () => {
      observer.disconnect()
      scrollContainer?.removeEventListener('scroll', checkIfScrolledToBottom)
    }
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Panel</h1>
        <p className="docs-desc">
          A scrollable container with optional header and footer sections. Ideal for
          sidebars, detail panes, chat windows, and any layout that needs a fixed
          chrome around scrollable content.
        </p>

        {/* Basic */}
        <section id="basic" className="demo-section">
          <h2>Basic</h2>
          <p className="section-desc">A simple panel with scrollable content.</p>
          <CodePreview code={BASIC_CODE}>
            <Panel maxHeight="240px" style={{ maxWidth: 400 }}>
              {items.map((i) => (
                <p key={i} className="demo-line">Item {i} &mdash; Scrollable content line</p>
              ))}
            </Panel>
          </CodePreview>
        </section>

        {/* Header & Footer */}
        <section id="header-footer" className="demo-section">
          <h2>Header &amp; Footer</h2>
          <p className="section-desc">
            Use the <code>header</code> and <code>footer</code> props to provide fixed content
            above and below the scrollable body.
          </p>
          <CodePreview code={HEADER_FOOTER_CODE}>
            <Panel
              maxHeight="300px"
              style={{ maxWidth: 400 }}
              header={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 'var(--sp-text-sm)' }}>Messages</span>
                  <span style={{ marginLeft: 'auto', fontSize: 'var(--sp-text-xs)', background: 'var(--sp-primary)', color: '#fff', borderRadius: 'var(--sp-radius-full)', padding: '1px 8px' }}>12</span>
                </div>
              }
              footer={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button style={{ fontSize: 'var(--sp-text-sm)' }}>Mark all read</button>
                  <button style={{ fontSize: 'var(--sp-text-sm)', marginLeft: 'auto' }}>Compose</button>
                </div>
              }
            >
              {items.map((i) => (
                <p key={i} className="demo-line">Message {i} &mdash; Preview text for this message</p>
              ))}
            </Panel>
          </CodePreview>
        </section>

        {/* Variants */}
        <section id="variants" className="demo-section">
          <h2>Variants</h2>
          <p className="section-desc">Five visual styles for different layout contexts.</p>
          <CodePreview code={VARIANTS_CODE}>
            <div className="variant-grid">
              {variants.map((v) => (
                <Panel
                  key={v}
                  variant={v}
                  maxHeight="160px"
                  header={
                    <span style={{ fontWeight: 600, fontSize: 'var(--sp-text-sm)', textTransform: 'capitalize' }}>{v}</span>
                  }
                >
                  <p className="demo-line">Content inside a {v} panel.</p>
                  <p className="demo-line">More content here.</p>
                </Panel>
              ))}
            </div>
          </CodePreview>
        </section>

        {/* Padding */}
        <section id="padding" className="demo-section">
          <h2>Padding</h2>
          <p className="section-desc">Control inner spacing with the <code>padding</code> prop.</p>
          <CodePreview code={PADDING_CODE}>
            <div className="variant-grid">
              {paddings.map((p) => (
                <Panel
                  key={p}
                  variant="outlined"
                  padding={p}
                  maxHeight="140px"
                  header={
                    <span style={{ fontWeight: 600, fontSize: 'var(--sp-text-sm)' }}>{p}</span>
                  }
                >
                  <p className="demo-line">Padded content.</p>
                </Panel>
              ))}
            </div>
          </CodePreview>
        </section>

        {/* Fixed Height */}
        <section id="fixed-height" className="demo-section">
          <h2>Fixed Height</h2>
          <p className="section-desc">
            Set <code>height</code>, <code>maxHeight</code>, or <code>minHeight</code> to
            control the panel dimensions. The body scrolls when content overflows.
          </p>
          <CodePreview code={FIXED_HEIGHT_CODE}>
            <Panel
              variant="outlined"
              height="200px"
              style={{ maxWidth: 400 }}
              header={
                <span style={{ fontWeight: 600, fontSize: 'var(--sp-text-sm)' }}>Fixed 200px</span>
              }
              footer={
                <span style={{ fontSize: 'var(--sp-text-xs)', color: 'var(--sp-text-muted)' }}>{items.length} items</span>
              }
            >
              {items.map((i) => (
                <p key={i} className="demo-line">Line {i}</p>
              ))}
            </Panel>
          </CodePreview>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>variant</code></td><td><code>'default' | 'outlined' | 'elevated' | 'filled' | 'ghost' | 'flush'</code></td><td><code>'default'</code></td><td>Legacy visual style; maps to <code>chrome</code></td></tr>
                <tr><td><code>chrome</code></td><td><code>Chrome</code></td><td>variant</td><td>Shared surface treatment</td></tr>
                <tr><td><code>radius</code></td><td><code>Radius</code></td><td>token default</td><td>Shared corner radius</td></tr>
                <tr><td><code>border</code></td><td><code>Border</code></td><td>token default</td><td>Shared border strength</td></tr>
                <tr><td><code>elevation</code></td><td><code>Elevation</code></td><td>token default</td><td>Shared shadow treatment</td></tr>
                <tr><td><code>backgroundMotif</code></td><td><code>SpMotifName</code></td><td>—</td><td>Decorative motif name and placement inputs</td></tr>
                <tr><td><code>padding</code></td><td><code>'none' | 'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Inner spacing for header, body, and footer</td></tr>
                <tr><td><code>height</code></td><td><code>string | undefined</code></td><td><code>undefined</code></td><td>Fixed height (e.g. <code>'300px'</code>)</td></tr>
                <tr><td><code>maxHeight</code></td><td><code>string | undefined</code></td><td><code>undefined</code></td><td>Maximum height before the body scrolls</td></tr>
                <tr><td><code>minHeight</code></td><td><code>string | undefined</code></td><td><code>undefined</code></td><td>Minimum height of the panel</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Content</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Slot</th><th>Prop</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td>Header</td><td><code>header</code></td><td>Fixed content above the scrollable body with a bottom border</td></tr>
                <tr><td>Body</td><td><code>children</code></td><td>Scrollable main content area</td></tr>
                <tr><td>Footer</td><td><code>footer</code></td><td>Fixed content below the scrollable body with a top border</td></tr>
              </tbody>
            </table>
          </div>

          <h3>CSS Custom Properties</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Property</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>--sp-panel-bg</code></td><td><code>var(--sp-surface-0)</code></td><td>Background color</td></tr>
                <tr><td><code>--sp-panel-bg-filled</code></td><td><code>var(--sp-surface-50)</code></td><td>Background for the filled variant</td></tr>
                <tr><td><code>--sp-panel-border</code></td><td><code>var(--sp-border)</code></td><td>Border and divider color</td></tr>
                <tr><td><code>--sp-panel-radius</code></td><td><code>var(--sp-radius-lg)</code></td><td>Corner radius</td></tr>
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
