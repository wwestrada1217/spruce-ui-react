import { useState, useEffect, useRef } from 'react'
import { Rating } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<Rating
  value={rating}
  onValueChange={setRating} />`

const SIZES_CODE = `<Rating size="sm" value={4} readonly />
<Rating size="md" value={4} readonly />
<Rating size="lg" value={4} readonly />`

const COLORS_CODE = `<Rating value={4} readonly />
<Rating value={4} readonly color="var(--sp-danger, #dc2626)" />
<Rating value={4} readonly color="var(--sp-success, #16a34a)" />
<Rating value={4} readonly color="var(--sp-primary, #2563eb)" />
<Rating value={4} readonly color="#a855f7" />`

const HALF_CODE = `<Rating
  allowHalf
  value={rating}
  onValueChange={setRating} />

{/* Read-only half rating */}
<Rating allowHalf value={3.5} readonly />`

const SHAPES_CODE = `<Rating shape="star" value={4} readonly />
<Rating shape="heart" value={4} readonly color="#f43f5e" />
<Rating shape="circle" value={4} readonly color="var(--sp-primary)" />
<Rating shape="diamond" value={4} readonly color="#a855f7" />`

const READONLY_CODE = `<Rating value={5} readonly />
<Rating value={3.5} allowHalf readonly />
<Rating value={1} readonly color="var(--sp-danger)" />`

const DISABLED_CODE = `<Rating value={3} disabled />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'colors', label: 'Custom Colors' },
  { id: 'half', label: 'Half Ratings' },
  { id: 'shapes', label: 'Custom Shapes' },
  { id: 'readonly', label: 'Read-only' },
  { id: 'disabled', label: 'Disabled' },
  { id: 'api', label: 'API' },
]

export function RatingPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const mainRef = useRef<HTMLDivElement>(null)

  const [basicRating, setBasicRating] = useState(3)
  const [halfRating, setHalfRating] = useState(3.5)
  const [heartRating, setHeartRating] = useState(4)

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
        <h1>Rating</h1>
        <p className="docs-desc">
          An interactive star-rating widget with keyboard navigation, half-step support,
          customizable shapes, sizes, and colors.
        </p>

        {/* Basic */}
        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">
            Click or tap a star to set a rating. Click the same star again to clear it.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div className="demo-row" style={{ alignItems: 'center' }}>
              <Rating
                value={basicRating}
                onValueChange={setBasicRating}
              />
              <span className="rating-label">{basicRating} / 5</span>
            </div>
          </CodePreview>
        </section>

        {/* Sizes */}
        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Three size variants: <code>sm</code>, <code>md</code> (default), and <code>lg</code>.</p>
          <CodePreview code={SIZES_CODE}>
            <div className="demo-stack">
              <div className="demo-row" style={{ alignItems: 'center' }}>
                <Rating size="sm" value={4} readonly ariaLabel="Small size rating" />
                <span className="demo-tag">sm</span>
              </div>
              <div className="demo-row" style={{ alignItems: 'center' }}>
                <Rating size="md" value={4} readonly ariaLabel="Medium size rating" />
                <span className="demo-tag">md</span>
              </div>
              <div className="demo-row" style={{ alignItems: 'center' }}>
                <Rating size="lg" value={4} readonly ariaLabel="Large size rating" />
                <span className="demo-tag">lg</span>
              </div>
            </div>
          </CodePreview>
        </section>

        {/* Custom Colors */}
        <section id="colors" className="demo-section" aria-labelledby="colors-heading">
          <h2 id="colors-heading">Custom Colors</h2>
          <p className="section-desc">
            Override the default amber color via the <code>color</code> prop.
            Accepts any valid CSS color value.
          </p>
          <CodePreview code={COLORS_CODE}>
            <div className="demo-stack">
              <div className="demo-row" style={{ alignItems: 'center' }}>
                <Rating value={4} readonly ariaLabel="Default color" />
                <span className="demo-tag">default amber</span>
              </div>
              <div className="demo-row" style={{ alignItems: 'center' }}>
                <Rating value={4} readonly color="var(--sp-danger, #dc2626)" ariaLabel="Red rating" />
                <span className="demo-tag">danger red</span>
              </div>
              <div className="demo-row" style={{ alignItems: 'center' }}>
                <Rating value={4} readonly color="var(--sp-success, #16a34a)" ariaLabel="Green rating" />
                <span className="demo-tag">success green</span>
              </div>
              <div className="demo-row" style={{ alignItems: 'center' }}>
                <Rating value={4} readonly color="var(--sp-primary, #2563eb)" ariaLabel="Blue rating" />
                <span className="demo-tag">primary blue</span>
              </div>
              <div className="demo-row" style={{ alignItems: 'center' }}>
                <Rating value={4} readonly color="#a855f7" ariaLabel="Purple rating" />
                <span className="demo-tag">#a855f7 purple</span>
              </div>
            </div>
          </CodePreview>
        </section>

        {/* Half Ratings */}
        <section id="half" className="demo-section" aria-labelledby="half-heading">
          <h2 id="half-heading">Half Ratings</h2>
          <p className="section-desc">
            Enable <code>allowHalf</code> to allow 0.5-step precision. Hover the
            left half of a star to select a half-value.
          </p>
          <CodePreview code={HALF_CODE}>
            <div className="demo-stack">
              <div className="demo-row">
                <Rating
                  allowHalf
                  value={halfRating}
                  onValueChange={setHalfRating}
                  ariaLabel="Half-rating demo"
                />
                <span className="rating-label">{halfRating} / 5</span>
              </div>
              <div className="demo-row">
                <Rating allowHalf value={3.5} readonly ariaLabel="Static 3.5 rating" />
                <span className="rating-label">3.5 / 5 (read-only)</span>
              </div>
            </div>
          </CodePreview>
        </section>

        {/* Custom Shapes */}
        <section id="shapes" className="demo-section" aria-labelledby="shapes-heading">
          <h2 id="shapes-heading">Custom Shapes</h2>
          <p className="section-desc">
            Use the <code>shape</code> prop to choose from built-in shapes:
            <code>star</code>, <code>heart</code>, <code>circle</code>, and <code>diamond</code>.
          </p>
          <CodePreview code={SHAPES_CODE}>
            <div className="demo-stack">
              <div className="demo-row" style={{ alignItems: 'center' }}>
                <Rating shape="star" value={4} readonly ariaLabel="Star rating" />
                <span className="demo-tag">star (default)</span>
              </div>
              <div className="demo-row" style={{ alignItems: 'center' }}>
                <Rating shape="heart" value={4} readonly color="#f43f5e" ariaLabel="Heart rating" />
                <span className="demo-tag">heart</span>
              </div>
              <div className="demo-row" style={{ alignItems: 'center' }}>
                <Rating shape="circle" value={4} readonly color="var(--sp-primary)" ariaLabel="Circle rating" />
                <span className="demo-tag">circle</span>
              </div>
              <div className="demo-row" style={{ alignItems: 'center' }}>
                <Rating shape="diamond" value={4} readonly color="#a855f7" ariaLabel="Diamond rating" />
                <span className="demo-tag">diamond</span>
              </div>
              <div className="demo-row" style={{ alignItems: 'center' }}>
                <Rating
                  shape="heart"
                  color="#f43f5e"
                  allowHalf
                  value={heartRating}
                  onValueChange={setHeartRating}
                  ariaLabel="Interactive heart rating"
                />
                <span className="rating-label">{heartRating} / 5</span>
              </div>
            </div>
          </CodePreview>
        </section>

        {/* Read-only */}
        <section id="readonly" className="demo-section" aria-labelledby="readonly-heading">
          <h2 id="readonly-heading">Read-only</h2>
          <p className="section-desc">
            Use <code>readonly</code> to render a non-interactive display. Suitable
            for showing review scores or data summaries.
          </p>
          <CodePreview code={READONLY_CODE}>
            <div className="demo-stack">
              <div className="demo-row" style={{ alignItems: 'center' }}>
                <Rating value={5} readonly ariaLabel="5 star review" />
                <span className="demo-tag">5.0 — Excellent</span>
              </div>
              <div className="demo-row" style={{ alignItems: 'center' }}>
                <Rating value={3.5} allowHalf readonly ariaLabel="3.5 star review" />
                <span className="demo-tag">3.5 — Average</span>
              </div>
              <div className="demo-row" style={{ alignItems: 'center' }}>
                <Rating value={1} readonly color="var(--sp-danger)" ariaLabel="1 star review" />
                <span className="demo-tag">1.0 — Poor</span>
              </div>
            </div>
          </CodePreview>
        </section>

        {/* Disabled */}
        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled</h2>
          <p className="section-desc">
            Setting <code>disabled</code> prevents all interaction and dims the
            component to communicate its unavailability.
          </p>
          <CodePreview code={DISABLED_CODE}>
            <Rating value={3} disabled ariaLabel="Disabled rating" />
          </CodePreview>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>value</code></td><td><code>number</code></td><td><code>0</code></td><td>Current rating value.</td></tr>
                <tr><td><code>max</code></td><td><code>number</code></td><td><code>5</code></td><td>Total number of rating items.</td></tr>
                <tr><td><code>allowHalf</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enable 0.5-step values — hover the left half of an item to select half.</td></tr>
                <tr><td><code>readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Display-only mode. Disables all mouse and keyboard interaction.</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the component and dims it visually.</td></tr>
                <tr><td><code>color</code></td><td><code>string</code></td><td><code>''</code></td><td>Custom fill color for rated items. Accepts any CSS color value or variable.</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Icon size — 16 px / 24 px / 32 px.</td></tr>
                <tr><td><code>shape</code></td><td><code>'star' | 'heart' | 'circle' | 'diamond'</code></td><td><code>'star'</code></td><td>Shape rendered for each rating item.</td></tr>
                <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>'Rating'</code></td><td>Accessible label for the slider region.</td></tr>
                <tr><td><code>onValueChange</code></td><td><code>(value: number) =&gt; void</code></td><td><code>-</code></td><td>Called when the rating value changes on click or keyboard.</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Keyboard</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Key</th><th>Action</th></tr></thead>
              <tbody>
                <tr><td><code>&rarr;</code> / <code>&uarr;</code></td><td>Increase by one step.</td></tr>
                <tr><td><code>&larr;</code> / <code>&darr;</code></td><td>Decrease by one step.</td></tr>
                <tr><td><code>Home</code></td><td>Clear rating (set to 0).</td></tr>
                <tr><td><code>End</code></td><td>Set to maximum.</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* TOC */}
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
