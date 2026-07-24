import { useState, useEffect, useRef } from 'react'
import { AspectRatio } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const DEFAULT_CODE = `<AspectRatio>
  <img src="hero.jpg" alt="Hero" />
</AspectRatio>`

const RATIOS_CODE = `<AspectRatio ratio="1/1">
  <img src="square.jpg" alt="Square" />
</AspectRatio>

<AspectRatio ratio="4/3">
  <img src="classic.jpg" alt="Classic" />
</AspectRatio>

<AspectRatio ratio="21/9">
  <img src="wide.jpg" alt="Ultrawide" />
</AspectRatio>`

const IMAGE_CODE = `<AspectRatio ratio="3/2" style={{ maxWidth: 400 }}>
  <img src="photo.jpg" alt="Landscape" />
</AspectRatio>`

const VIDEO_CODE = `<AspectRatio ratio="16/9">
  <iframe src="..." frameBorder="0" allowFullScreen />
</AspectRatio>`

const NUMERIC_CODE = `<AspectRatio ratio={2.35}>
  <div>Cinemascope content</div>
</AspectRatio>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'default', label: 'Default (16:9)' },
  { id: 'ratios', label: 'Common Ratios' },
  { id: 'image', label: 'With Image' },
  { id: 'video', label: 'With Video / Embed' },
  { id: 'numeric', label: 'Numeric Ratio' },
  { id: 'api', label: 'API' },
]

export function AspectRatioPage() {
  const [activeSection, setActiveSection] = useState('default')
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
        <h1>Aspect Ratio</h1>
        <p className="docs-desc">
          A container that constrains its content to a specified aspect ratio. Useful for images, videos, embeds, and responsive placeholders.
        </p>

        <section id="default" className="demo-section">
          <h2>Default (16:9)</h2>
          <p className="section-desc">
            The default ratio is 16/9, ideal for video embeds and hero images.
          </p>
          <CodePreview code={DEFAULT_CODE}>
            <AspectRatio style={{ maxWidth: 480 }}>
              <div style={{
                width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 600, color: '#fff', borderRadius: 6,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
              }}>
                16 : 9
              </div>
            </AspectRatio>
          </CodePreview>
        </section>

        <section id="ratios" className="demo-section">
          <h2>Common Ratios</h2>
          <p className="section-desc">
            Pass a string like <code>"4/3"</code> or a number like <code>1</code> for a square.
          </p>
          <CodePreview code={RATIOS_CODE}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, maxWidth: 640 }}>
              <div>
                <AspectRatio ratio="1/1">
                  <div style={{
                    width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 600, color: '#fff', borderRadius: 6,
                    background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                  }}>
                    1 : 1
                  </div>
                </AspectRatio>
                <span style={{ display: 'block', textAlign: 'center', fontSize: 12, color: 'var(--sp-text-muted, #4a5568)', marginTop: 6 }}>Square</span>
              </div>
              <div>
                <AspectRatio ratio="4/3">
                  <div style={{
                    width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 600, color: '#fff', borderRadius: 6,
                    background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                  }}>
                    4 : 3
                  </div>
                </AspectRatio>
                <span style={{ display: 'block', textAlign: 'center', fontSize: 12, color: 'var(--sp-text-muted, #4a5568)', marginTop: 6 }}>Classic</span>
              </div>
              <div>
                <AspectRatio ratio="21/9">
                  <div style={{
                    width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 600, color: '#fff', borderRadius: 6,
                    background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
                  }}>
                    21 : 9
                  </div>
                </AspectRatio>
                <span style={{ display: 'block', textAlign: 'center', fontSize: 12, color: 'var(--sp-text-muted, #4a5568)', marginTop: 6 }}>Ultrawide</span>
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="image" className="demo-section">
          <h2>With Image</h2>
          <p className="section-desc">
            Images inside the ratio container automatically fill the space with <code>object-fit: cover</code>.
          </p>
          <CodePreview code={IMAGE_CODE}>
            <AspectRatio ratio="3/2" style={{ maxWidth: 400 }}>
              <img src="https://picsum.photos/seed/ar-img/600/400" alt="Sample landscape" />
            </AspectRatio>
          </CodePreview>
        </section>

        <section id="video" className="demo-section">
          <h2>With Video / Embed</h2>
          <p className="section-desc">
            Wrap iframes or videos to maintain a consistent aspect ratio.
          </p>
          <CodePreview code={VIDEO_CODE}>
            <AspectRatio ratio="16/9" style={{ maxWidth: 480 }}>
              <div style={{
                width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 600, color: '#fff', borderRadius: 6,
                background: 'linear-gradient(135deg, #fa709a, #fee140)',
              }}>
                iframe or video goes here
              </div>
            </AspectRatio>
          </CodePreview>
        </section>

        <section id="numeric" className="demo-section">
          <h2>Numeric Ratio</h2>
          <p className="section-desc">
            You can also pass a numeric value directly (width / height).
          </p>
          <CodePreview code={NUMERIC_CODE}>
            <AspectRatio ratio={2.35} style={{ maxWidth: 480 }}>
              <div style={{
                width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 600, color: '#fff', borderRadius: 6,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
              }}>
                2.35 : 1 (Cinemascope)
              </div>
            </AspectRatio>
          </CodePreview>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>AspectRatio</h3>
          <h4>Props</h4>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>ratio</code></td>
                  <td><code>number | string</code></td>
                  <td><code>16/9</code></td>
                  <td>Aspect ratio as a number (e.g. <code>1.777</code>) or string (e.g. <code>"16/9"</code>, <code>"4/3"</code>)</td>
                </tr>
                <tr>
                  <td><code>children</code></td>
                  <td><code>ReactNode</code></td>
                  <td>&mdash;</td>
                  <td>Content to render inside the aspect ratio container</td>
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
