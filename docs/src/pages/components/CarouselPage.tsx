import { useState, useEffect, useRef } from 'react'
import { Carousel } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<Carousel>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>`

const BAR_CODE = `<Carousel indicator="bars">
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>`

const NO_LOOP_CODE = `<Carousel loop={false}>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>`

const AUTOPLAY_CODE = `<Carousel autoplay={3000}>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
  <div>Slide 4</div>
</Carousel>`

const NO_ARROWS_CODE = `<Carousel showArrows={false}>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>`

const slideStyles: Record<string, React.CSSProperties> = {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 280,
    fontSize: 'var(--sp-text-xl, 20px)',
    fontWeight: 600,
    color: '#fff',
    borderRadius: 'var(--sp-radius-lg, 8px)',
    userSelect: 'none',
  },
  s1: { background: 'linear-gradient(135deg, #667eea, #764ba2)' },
  s2: { background: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  s3: { background: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  s4: { background: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
}

function DemoSlide({ label, variant }: { label: string; variant: string }) {
  return (
    <div style={{ ...slideStyles.base, ...slideStyles[variant] }}>
      {label}
    </div>
  )
}

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'bar-indicators', label: 'Bar Indicators' },
  { id: 'no-loop', label: 'No Loop' },
  { id: 'autoplay', label: 'Autoplay' },
  { id: 'no-arrows', label: 'Without Arrows' },
  { id: 'api', label: 'API' },
]

export function CarouselPage() {
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
        <h1>Carousel</h1>
        <p className="docs-desc">An image and content carousel with navigation arrows, indicators, autoplay, and keyboard support.</p>

        <section id="basic" className="demo-section">
          <h2>Basic</h2>
          <p className="section-desc">A simple carousel with default dot indicators and navigation arrows on hover.</p>
          <CodePreview code={BASIC_CODE}>
            <Carousel>
              <DemoSlide label="Slide 1" variant="s1" />
              <DemoSlide label="Slide 2" variant="s2" />
              <DemoSlide label="Slide 3" variant="s3" />
            </Carousel>
          </CodePreview>
        </section>

        <section id="bar-indicators" className="demo-section">
          <h2>Bar Indicators</h2>
          <p className="section-desc">Use <code>indicator="bars"</code> for a bar-style indicator instead of dots.</p>
          <CodePreview code={BAR_CODE}>
            <Carousel indicator="bars">
              <DemoSlide label="Slide 1" variant="s1" />
              <DemoSlide label="Slide 2" variant="s2" />
              <DemoSlide label="Slide 3" variant="s3" />
            </Carousel>
          </CodePreview>
        </section>

        <section id="no-loop" className="demo-section">
          <h2>No Loop</h2>
          <p className="section-desc">Disable looping so the carousel stops at the first and last slide.</p>
          <CodePreview code={NO_LOOP_CODE}>
            <Carousel loop={false}>
              <DemoSlide label="Slide 1" variant="s1" />
              <DemoSlide label="Slide 2" variant="s2" />
              <DemoSlide label="Slide 3" variant="s3" />
            </Carousel>
          </CodePreview>
        </section>

        <section id="autoplay" className="demo-section">
          <h2>Autoplay</h2>
          <p className="section-desc">Set <code>autoplay</code> to a millisecond interval. Pauses on hover and focus.</p>
          <CodePreview code={AUTOPLAY_CODE}>
            <Carousel autoplay={3000}>
              <DemoSlide label="Slide 1" variant="s1" />
              <DemoSlide label="Slide 2" variant="s2" />
              <DemoSlide label="Slide 3" variant="s3" />
              <DemoSlide label="Slide 4" variant="s4" />
            </Carousel>
          </CodePreview>
        </section>

        <section id="no-arrows" className="demo-section">
          <h2>Without Arrows</h2>
          <p className="section-desc">Hide navigation arrows and rely only on indicators or keyboard navigation.</p>
          <CodePreview code={NO_ARROWS_CODE}>
            <Carousel showArrows={false}>
              <DemoSlide label="Slide 1" variant="s1" />
              <DemoSlide label="Slide 2" variant="s2" />
              <DemoSlide label="Slide 3" variant="s3" />
            </Carousel>
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
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td><code>-</code></td><td>Slide elements. Each direct child is one slide.</td></tr>
                <tr><td><code>activeIndex</code></td><td><code>number</code></td><td><code>-</code></td><td>Controlled active index.</td></tr>
                <tr><td><code>loop</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Wrap from last to first slide.</td></tr>
                <tr><td><code>showArrows</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show prev/next navigation arrows on hover.</td></tr>
                <tr><td><code>indicator</code></td><td><code>'dots' | 'bars' | 'none'</code></td><td><code>'dots'</code></td><td>Indicator style.</td></tr>
                <tr><td><code>autoplay</code></td><td><code>number</code></td><td><code>0</code></td><td>Autoplay interval in ms (0 to disable).</td></tr>
                <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>'Carousel'</code></td><td>Accessible label for the carousel region.</td></tr>
                <tr><td><code>onSlideChange</code></td><td><code>(index: number) =&gt; void</code></td><td><code>-</code></td><td>Called when the active slide changes.</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Keyboard</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Key</th><th>Action</th></tr></thead>
              <tbody>
                <tr><td><code>ArrowLeft</code></td><td>Previous slide</td></tr>
                <tr><td><code>ArrowRight</code></td><td>Next slide</td></tr>
                <tr><td><code>Home</code></td><td>First slide</td></tr>
                <tr><td><code>End</code></td><td>Last slide</td></tr>
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
