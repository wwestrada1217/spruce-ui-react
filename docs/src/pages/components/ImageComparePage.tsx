import { useState, useEffect, useRef } from 'react'
import { ImageCompare } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<ImageCompare
  beforeSrc="path/to/before.jpg"
  afterSrc="path/to/after.jpg"
/>`

const LABELS_CODE = `<ImageCompare
  beforeSrc="original.jpg"
  afterSrc="edited.jpg"
  beforeLabel="Original"
  afterLabel="Edited"
/>`

const VERTICAL_CODE = `<ImageCompare
  orientation="vertical"
  beforeSrc="top.jpg"
  afterSrc="bottom.jpg"
/>`

const POSITION_CODE = `<ImageCompare
  initialPosition={25}
  beforeSrc="before.jpg"
  afterSrc="after.jpg"
/>`

const NO_LABELS_CODE = `<ImageCompare
  showLabels={false}
  beforeSrc="before.jpg"
  afterSrc="after.jpg"
/>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'custom-labels', label: 'Custom Labels' },
  { id: 'vertical', label: 'Vertical' },
  { id: 'initial-position', label: 'Initial Position' },
  { id: 'no-labels', label: 'Without Labels' },
  { id: 'api', label: 'API' },
]

export function ImageComparePage() {
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
        <h1>Image Compare</h1>
        <p className="docs-desc">
          A draggable slider to compare two images side-by-side. Supports horizontal and vertical orientations with keyboard accessibility.
        </p>

        <section id="basic" className="demo-section">
          <h2>Basic</h2>
          <p className="section-desc">
            Drag the handle or use arrow keys to reveal the before and after images.
          </p>
          <CodePreview code={BASIC_CODE}>
            <ImageCompare
              style={{ maxWidth: 600 }}
              beforeSrc="https://picsum.photos/seed/compare-a/600/400"
              afterSrc="https://picsum.photos/seed/compare-b/600/400"
            />
          </CodePreview>
        </section>

        <section id="custom-labels" className="demo-section">
          <h2>Custom Labels</h2>
          <p className="section-desc">
            Customize the labels displayed on each side of the comparison.
          </p>
          <CodePreview code={LABELS_CODE}>
            <ImageCompare
              style={{ maxWidth: 600 }}
              beforeSrc="https://picsum.photos/seed/orig/600/400"
              afterSrc="https://picsum.photos/seed/edit/600/400"
              beforeLabel="Original"
              afterLabel="Edited"
            />
          </CodePreview>
        </section>

        <section id="vertical" className="demo-section">
          <h2>Vertical</h2>
          <p className="section-desc">
            Set <code>orientation="vertical"</code> for a top-to-bottom comparison.
          </p>
          <CodePreview code={VERTICAL_CODE}>
            <ImageCompare
              style={{ maxWidth: 600 }}
              orientation="vertical"
              beforeSrc="https://picsum.photos/seed/v-before/600/400"
              afterSrc="https://picsum.photos/seed/v-after/600/400"
              beforeLabel="Top"
              afterLabel="Bottom"
            />
          </CodePreview>
        </section>

        <section id="initial-position" className="demo-section">
          <h2>Initial Position</h2>
          <p className="section-desc">
            Use <code>initialPosition</code> to start the slider at a custom percentage.
          </p>
          <CodePreview code={POSITION_CODE}>
            <ImageCompare
              style={{ maxWidth: 600 }}
              initialPosition={25}
              beforeSrc="https://picsum.photos/seed/pos-a/600/400"
              afterSrc="https://picsum.photos/seed/pos-b/600/400"
            />
          </CodePreview>
        </section>

        <section id="no-labels" className="demo-section">
          <h2>Without Labels</h2>
          <p className="section-desc">Hide the labels for a minimal appearance.</p>
          <CodePreview code={NO_LABELS_CODE}>
            <ImageCompare
              style={{ maxWidth: 600 }}
              showLabels={false}
              beforeSrc="https://picsum.photos/seed/nl-a/600/400"
              afterSrc="https://picsum.photos/seed/nl-b/600/400"
            />
          </CodePreview>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>ImageCompare</h3>
          <h4>Props</h4>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>beforeSrc</code></td><td><code>string</code></td><td>Required</td><td>Source URL of the before image</td></tr>
                <tr><td><code>afterSrc</code></td><td><code>string</code></td><td>Required</td><td>Source URL of the after image</td></tr>
                <tr><td><code>beforeLabel</code></td><td><code>string</code></td><td><code>'Before'</code></td><td>Label for the before image</td></tr>
                <tr><td><code>afterLabel</code></td><td><code>string</code></td><td><code>'After'</code></td><td>Label for the after image</td></tr>
                <tr><td><code>showLabels</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show before/after labels</td></tr>
                <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Slider orientation</td></tr>
                <tr><td><code>initialPosition</code></td><td><code>number</code></td><td><code>50</code></td><td>Initial slider position (0-100)</td></tr>
                <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>'Image comparison'</code></td><td>Accessible label for the component</td></tr>
              </tbody>
            </table>
          </div>

          <h4>Keyboard Shortcuts</h4>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Key</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr><td><code>ArrowLeft / ArrowUp</code></td><td>Move slider by 1% (orientation-aware)</td></tr>
                <tr><td><code>ArrowRight / ArrowDown</code></td><td>Move slider by 1% (orientation-aware)</td></tr>
                <tr><td><code>Shift + Arrow</code></td><td>Move slider by 10%</td></tr>
                <tr><td><code>Home</code></td><td>Move slider to 0%</td></tr>
                <tr><td><code>End</code></td><td>Move slider to 100%</td></tr>
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
