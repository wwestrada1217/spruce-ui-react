import { useState, useEffect, useRef } from 'react'
import { Spinner } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const SIZES_CODE = `<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />`

const LABEL_CODE = `<Spinner size="sm" label="Loading..." />
<Spinner size="md" label="Fetching data..." />
<Spinner size="lg" label="Processing records..." />`

const INLINE_CODE = `<p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  Saving changes <Spinner size="sm" />
</p>`

const VARIANTS_CODE = `<Spinner variant="ring" />
<Spinner variant="chasing-dots" />
<Spinner variant="wave-bars" />
<Spinner variant="grid-cube" />`

const COLORS_CODE = `<Spinner variant="arc" colorVariant="primary" />
<Spinner variant="pulse-dot" colorVariant="success" />
<Spinner variant="three-dots" colorVariant="warning" />
<Spinner variant="bars" colorVariant="danger" />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'sizes',  label: 'Sizes' },
  { id: 'variants', label: 'Variants' },
  { id: 'colors', label: 'Colors' },
  { id: 'label',  label: 'With Label' },
  { id: 'inline', label: 'Inline Usage' },
  { id: 'api',    label: 'API' },
]

export function SpinnerPage() {
  const [activeSection, setActiveSection] = useState('sizes')
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
        <h1>Spinner</h1>
        <p className="docs-desc">
          A loading indicator for async operations. Available in 4 sizes with an optional label.
        </p>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Available in four sizes to fit different layout contexts.</p>
          <CodePreview code={SIZES_CODE}>
            <div className="demo-row" style={{ alignItems: 'center' }}>
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <Spinner size="xl" />
            </div>
          </CodePreview>
        </section>

        <section id="variants" className="demo-section" aria-labelledby="variants-heading">
          <h2 id="variants-heading">Variants</h2>
          <p className="section-desc">Choose from ring, dots, bars, orbit, ripple, and geometric loading animations.</p>
          <CodePreview code={VARIANTS_CODE}>
            <div className="demo-row" style={{ alignItems: 'center' }}>
              <Spinner variant="ring" />
              <Spinner variant="chasing-dots" />
              <Spinner variant="wave-bars" />
              <Spinner variant="grid-cube" />
            </div>
          </CodePreview>
        </section>

        <section id="colors" className="demo-section" aria-labelledby="colors-heading">
          <h2 id="colors-heading">Colors</h2>
          <p className="section-desc">Use semantic color variants or provide a custom CSS color.</p>
          <CodePreview code={COLORS_CODE}>
            <div className="demo-row" style={{ alignItems: 'center' }}>
              <Spinner variant="arc" colorVariant="primary" />
              <Spinner variant="pulse-dot" colorVariant="success" />
              <Spinner variant="three-dots" colorVariant="warning" />
              <Spinner variant="bars" colorVariant="danger" />
            </div>
          </CodePreview>
        </section>

        <section id="label" className="demo-section" aria-labelledby="label-heading">
          <h2 id="label-heading">With Label</h2>
          <p className="section-desc">
            Add descriptive text next to the spinner to inform users what is loading.
          </p>
          <CodePreview code={LABEL_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Spinner size="sm" label="Loading..." />
              <Spinner size="md" label="Fetching data..." />
              <Spinner size="lg" label="Processing records..." />
            </div>
          </CodePreview>
        </section>

        <section id="inline" className="demo-section" aria-labelledby="inline-heading">
          <h2 id="inline-heading">Inline Usage</h2>
          <p className="section-desc">
            Use the small spinner inline alongside text for contextual loading indicators.
          </p>
          <CodePreview code={INLINE_CODE}>
            <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--sp-text-sm, 13px)', margin: 0 }}>
              Saving changes <Spinner size="sm" />
            </p>
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
                <tr>
                  <td><code>size</code></td>
                  <td><code>'xs' | 'sm' | 'md' | 'lg' | 'xl'</code></td>
                  <td><code>'md'</code></td>
                  <td>Spinner size</td>
                </tr>
                <tr>
                  <td><code>label</code></td>
                  <td><code>string</code></td>
                  <td><code>''</code></td>
                  <td>Accessible label text shown beside the spinner</td>
                </tr>
                <tr>
                  <td><code>variant</code></td>
                  <td><code>SpinnerVariant</code></td>
                  <td><code>'ring'</code></td>
                  <td>Loading animation variant</td>
                </tr>
                <tr>
                  <td><code>colorVariant</code></td>
                  <td><code>'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'white'</code></td>
                  <td><code>'primary'</code></td>
                  <td>Semantic spinner color</td>
                </tr>
                <tr>
                  <td><code>ariaLabel</code></td>
                  <td><code>string</code></td>
                  <td>Localized loading label</td>
                  <td>Accessible status text when no visible label is supplied</td>
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
