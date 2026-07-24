import { useState, useEffect, useRef } from 'react'
import { Empty } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<Empty
  title="No data"
  description="There are no records to display."
/>`

const ICON_CODE = `<Empty
  icon="package"
  title="No products"
  description="Your product catalog is empty. Add your first product to get started."
/>
<Empty
  icon="search"
  title="No results"
  description="We couldn't find anything matching your search. Try different keywords."
/>
<Empty
  icon="database"
  title="No data available"
  description="There is no data to display at this time."
/>`

const SIZES_CODE = `<Empty icon="package" title="Small" description="Compact empty state" size="sm" bordered />
<Empty icon="package" title="Medium (default)" description="Standard empty state" bordered />
<Empty icon="package" title="Large" description="Prominent empty state for full-page placeholders" size="lg" bordered />`

const BORDERED_CODE = `<Empty
  icon="file-text"
  title="Drop files here"
  description="Drag and drop files into this area to upload them."
  bordered
/>`

const ACTIONS_CODE = `<Empty
  icon="package"
  title="No products yet"
  description="Create your first product to start building your catalog."
>
  <div className="sp-empty__actions">
    <button>Add Product</button>
  </div>
</Empty>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',     label: 'Basic' },
  { id: 'icon',      label: 'With Icon' },
  { id: 'sizes',     label: 'Sizes' },
  { id: 'bordered',  label: 'Bordered' },
  { id: 'actions',   label: 'With Actions' },
  { id: 'use-cases', label: 'Use Cases' },
  { id: 'api',       label: 'API' },
]

const btnBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 16px',
  fontSize: 'var(--sp-text-sm, 13px)',
  fontWeight: 600,
  borderRadius: 'var(--sp-radius-md, 6px)',
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'all 0.15s',
}

export function EmptyPage() {
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
        <h1>Empty</h1>
        <p className="docs-desc">
          Placeholder component for empty pages, no-data states, 404 errors, and other situations
          where content is absent. Supports icons, titles, descriptions, and action buttons.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">A simple empty state with a title and description.</p>
          <CodePreview code={BASIC_CODE}>
            <Empty title="No data" description="There are no records to display." />
          </CodePreview>
        </section>

        <section id="icon" className="demo-section" aria-labelledby="icon-heading">
          <h2 id="icon-heading">With Icon</h2>
          <p className="section-desc">Add an icon to give visual context to the empty state.</p>
          <CodePreview code={ICON_CODE}>
            <Empty icon="package" title="No products" description="Your product catalog is empty. Add your first product to get started." />
            <Empty icon="search" title="No results" description="We couldn't find anything matching your search. Try different keywords." />
            <Empty icon="database" title="No data available" description="There is no data to display at this time." />
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Three sizes for different UI contexts.</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <Empty icon="package" title="Small" description="Compact empty state" size="sm" bordered />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <Empty icon="package" title="Medium (default)" description="Standard empty state" bordered />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <Empty icon="package" title="Large" description="Prominent empty state for full-page placeholders" size="lg" bordered />
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="bordered" className="demo-section" aria-labelledby="bordered-heading">
          <h2 id="bordered-heading">Bordered</h2>
          <p className="section-desc">
            Add a dashed border and subtle background with <code>bordered</code> to visually
            contain the empty state.
          </p>
          <CodePreview code={BORDERED_CODE}>
            <Empty icon="file-text" title="Drop files here" description="Drag and drop files into this area to upload them." bordered />
          </CodePreview>
        </section>

        <section id="actions" className="demo-section" aria-labelledby="actions-heading">
          <h2 id="actions-heading">With Actions</h2>
          <p className="section-desc">
            Pass action buttons as children to let users take immediate action from the empty state.
          </p>
          <CodePreview code={ACTIONS_CODE}>
            <Empty icon="package" title="No products yet" description="Create your first product to start building your catalog.">
              <div className="sp-empty__actions">
                <button style={{ ...btnBase, background: 'var(--sp-primary, #2563eb)', color: '#fff' }}>
                  Add Product
                </button>
              </div>
            </Empty>
          </CodePreview>
        </section>

        <section id="use-cases" className="demo-section" aria-labelledby="use-cases-heading">
          <h2 id="use-cases-heading">Use Cases</h2>
          <p className="section-desc">Common patterns for empty states in applications.</p>

          <h3>404 Not Found</h3>
          <CodePreview code={`<Empty icon="alert-circle" title="Page not found" description="The page you're looking for doesn't exist." size="lg" bordered>`}>
            <Empty icon="alert-circle" title="Page not found" description="The page you're looking for doesn't exist or has been moved." size="lg" bordered>
              <div className="sp-empty__actions">
                <button style={{ ...btnBase, background: 'var(--sp-primary, #2563eb)', color: '#fff' }}>Go Home</button>
                <button style={{ ...btnBase, background: 'transparent', color: 'var(--sp-text-color, #1a202c)', borderColor: 'var(--sp-border, rgba(0,0,0,0.15))' }}>Go Back</button>
              </div>
            </Empty>
          </CodePreview>

          <h3>Empty Search Results</h3>
          <CodePreview code={`<Empty icon="search" title="No results found" description="Try adjusting your search or filter criteria." bordered />`}>
            <Empty icon="search" title="No results found" description="Try adjusting your search or filter criteria." bordered />
          </CodePreview>

          <h3>Empty Table</h3>
          <CodePreview code={`<Empty icon="database" title="No records" description="This table doesn't have any data yet." size="sm" />`}>
            <Empty icon="database" title="No records" description="This table doesn't have any data yet." size="sm" />
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
                <tr><td><code>icon</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Icon name displayed above the title</td></tr>
                <tr><td><code>title</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Main heading text</td></tr>
                <tr><td><code>description</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Supporting text below the title</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Controls padding, icon size, and text size</td></tr>
                <tr><td><code>bordered</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show a dashed border and subtle background</td></tr>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Action buttons or custom content. Wrap in <code>&lt;div className="sp-empty__actions"&gt;</code> for proper spacing.</td></tr>
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
