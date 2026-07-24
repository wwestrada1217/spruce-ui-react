import { useState, useEffect, useRef } from 'react'
import { Pager } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `const [page, setPage] = useState(1)

<Pager totalItems={100} page={page} onPageChange={setPage} />`

const WITH_TOTAL_CODE = `<Pager
  totalItems={256}
  page={page}
  pageSize={pageSize}
  showTotal
  showPageSize
  pageSizeOptions={[10, 25, 50, 100]}
  onStateChange={({ page, pageSize }) => {
    setPage(page)
    setPageSize(pageSize)
  }}
/>`

const VARIANTS_CODE = `<Pager totalItems={80} variant="default" />
<Pager totalItems={80} variant="outline" />
<Pager totalItems={80} variant="ghost" />`

const SIZES_CODE = `<Pager totalItems={100} size="sm" />
<Pager totalItems={100} size="md" />
<Pager totalItems={100} size="lg" />`

const COMPACT_CODE = `<Pager
  totalItems={200}
  showPages={false}
  showTotal
/>`

const SIBLINGS_CODE = `<Pager totalItems={500} page={25} siblingCount={1} />
<Pager totalItems={500} page={25} siblingCount={2} />
<Pager totalItems={500} page={25} siblingCount={3} />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'with-total', label: 'With Total & Page Size' },
  { id: 'variants', label: 'Variants' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'compact', label: 'Compact' },
  { id: 'siblings', label: 'Sibling Count' },
  { id: 'api', label: 'API' },
]

export function PagerPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [basicPage, setBasicPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [totalPageSize, setTotalPageSize] = useState(10)
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
        <h1>Pager</h1>
        <p className="docs-desc">
          Navigate through paged data with page numbers, previous/next buttons, and optional
          page-size selector. Supports multiple sizes and variants.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">
            Provide <code>totalItems</code> and bind the <code>page</code> prop to get started.
          </p>
          <CodePreview code={BASIC_CODE}>
            <Pager totalItems={100} page={basicPage} onPageChange={setBasicPage} />
            <p className="demo-value">Current page: {basicPage}</p>
          </CodePreview>
        </section>

        <section id="with-total" className="demo-section" aria-labelledby="with-total-heading">
          <h2 id="with-total-heading">With Total &amp; Page Size</h2>
          <p className="section-desc">
            Show the item range and a page-size selector to let users control how many rows they see.
          </p>
          <CodePreview code={WITH_TOTAL_CODE}>
            <Pager
              totalItems={256}
              page={totalPage}
              pageSize={totalPageSize}
              showTotal
              showPageSize
              pageSizeOptions={[10, 25, 50, 100]}
              onStateChange={({ page, pageSize }: { page: number; pageSize: number }) => {
                setTotalPage(page)
                setTotalPageSize(pageSize)
              }}
            />
          </CodePreview>
        </section>

        <section id="variants" className="demo-section" aria-labelledby="variants-heading">
          <h2 id="variants-heading">Variants</h2>
          <p className="section-desc">
            Three visual styles: <code>default</code> (bordered), <code>outline</code> (subtle active state),
            and <code>ghost</code> (borderless).
          </p>
          <CodePreview code={VARIANTS_CODE}>
            <div className="demo-stack">
              <div>
                <p className="demo-label">Default</p>
                <Pager totalItems={80} variant="default" />
              </div>
              <div>
                <p className="demo-label">Outline</p>
                <Pager totalItems={80} variant="outline" />
              </div>
              <div>
                <p className="demo-label">Ghost</p>
                <Pager totalItems={80} variant="ghost" />
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">
            Three sizes to fit different UI densities.
          </p>
          <CodePreview code={SIZES_CODE}>
            <div className="demo-stack">
              <div>
                <p className="demo-label">Small</p>
                <Pager totalItems={100} size="sm" />
              </div>
              <div>
                <p className="demo-label">Medium (default)</p>
                <Pager totalItems={100} size="md" />
              </div>
              <div>
                <p className="demo-label">Large</p>
                <Pager totalItems={100} size="lg" />
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="compact" className="demo-section" aria-labelledby="compact-heading">
          <h2 id="compact-heading">Compact</h2>
          <p className="section-desc">
            Hide individual page numbers with <code>showPages={'{false}'}</code> for a minimal
            previous/next layout.
          </p>
          <CodePreview code={COMPACT_CODE}>
            <Pager totalItems={200} showPages={false} showTotal />
          </CodePreview>
        </section>

        <section id="siblings" className="demo-section" aria-labelledby="siblings-heading">
          <h2 id="siblings-heading">Sibling Count</h2>
          <p className="section-desc">
            Control how many page numbers appear around the current page with
            <code>siblingCount</code>.
          </p>
          <CodePreview code={SIBLINGS_CODE}>
            <div className="demo-stack">
              <div>
                <p className="demo-label">siblingCount = 1 (default)</p>
                <Pager totalItems={500} page={25} siblingCount={1} />
              </div>
              <div>
                <p className="demo-label">siblingCount = 2</p>
                <Pager totalItems={500} page={25} siblingCount={2} />
              </div>
              <div>
                <p className="demo-label">siblingCount = 3</p>
                <Pager totalItems={500} page={25} siblingCount={3} />
              </div>
            </div>
          </CodePreview>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>totalItems</code></td>
                  <td><code>number</code></td>
                  <td>required</td>
                  <td>Total number of items to paginate</td>
                </tr>
                <tr>
                  <td><code>page</code></td>
                  <td><code>number</code></td>
                  <td><code>1</code></td>
                  <td>Current page (controlled)</td>
                </tr>
                <tr>
                  <td><code>pageSize</code></td>
                  <td><code>number</code></td>
                  <td><code>10</code></td>
                  <td>Items per page</td>
                </tr>
                <tr>
                  <td><code>size</code></td>
                  <td><code>'sm' | 'md' | 'lg'</code></td>
                  <td><code>'md'</code></td>
                  <td>Component size</td>
                </tr>
                <tr>
                  <td><code>variant</code></td>
                  <td><code>'default' | 'outline' | 'ghost'</code></td>
                  <td><code>'default'</code></td>
                  <td>Visual style</td>
                </tr>
                <tr>
                  <td><code>siblingCount</code></td>
                  <td><code>number</code></td>
                  <td><code>1</code></td>
                  <td>Number of page buttons shown on each side of the current page</td>
                </tr>
                <tr>
                  <td><code>showFirstLast</code></td>
                  <td><code>boolean</code></td>
                  <td><code>true</code></td>
                  <td>Show first/last page navigation buttons</td>
                </tr>
                <tr>
                  <td><code>showPages</code></td>
                  <td><code>boolean</code></td>
                  <td><code>true</code></td>
                  <td>Show individual page number buttons</td>
                </tr>
                <tr>
                  <td><code>showTotal</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Show item range text (e.g. "1-10 of 100")</td>
                </tr>
                <tr>
                  <td><code>showPageSize</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Show page-size dropdown selector</td>
                </tr>
                <tr>
                  <td><code>pageSizeOptions</code></td>
                  <td><code>number[]</code></td>
                  <td><code>[10, 25, 50, 100]</code></td>
                  <td>Available page size options</td>
                </tr>
                <tr>
                  <td><code>ariaLabel</code></td>
                  <td><code>string</code></td>
                  <td><code>'Pagination'</code></td>
                  <td>Accessible label for the navigation landmark</td>
                </tr>
                <tr>
                  <td><code>disabled</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Disable all pager controls</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Callbacks</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>onStateChange</code></td>
                  <td><code>{'(state: { page: number; pageSize: number }) => void'}</code></td>
                  <td>Called when the page or page size changes. Payload: {'{ page, pageSize }'}</td>
                </tr>
                <tr>
                  <td><code>onPageChange</code></td>
                  <td><code>{'(page: number) => void'}</code></td>
                  <td>Called when the current page changes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Table of Contents */}
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
