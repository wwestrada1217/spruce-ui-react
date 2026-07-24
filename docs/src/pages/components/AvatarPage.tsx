import { useState, useEffect, useRef } from 'react'
import { Avatar } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
const SIZES: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

const IMAGE_CODE = `<Avatar src="https://i.pravatar.cc/100?u=alice" alt="Alice" size="xs" />
<Avatar src="https://i.pravatar.cc/100?u=bob" alt="Bob" size="sm" />
<Avatar src="https://i.pravatar.cc/100?u=charlie" alt="Charlie" size="md" />
<Avatar src="https://i.pravatar.cc/100?u=diana" alt="Diana" size="lg" />
<Avatar src="https://i.pravatar.cc/100?u=edward" alt="Edward" size="xl" />`

const INITIALS_CODE = `<Avatar name="Alice Zimmerman" size="sm" />
<Avatar name="Bob Adams" size="md" />
<Avatar name="Charlie" size="lg" />`

const SHAPES_CODE = `<Avatar name="Circle" size="lg" shape="circle" />
<Avatar name="Square" size="lg" shape="square" />`

const STATUS_CODE = `<Avatar name="Online" size="lg" status="online" />
<Avatar name="Offline" size="lg" status="offline" />
<Avatar name="Busy" size="lg" status="busy" />
<Avatar src="https://i.pravatar.cc/100?u=status" alt="Status" size="lg" status="online" />`

const ALL_SIZES_CODE = `<Avatar name="Test User" size="xs" status="online" />
<Avatar name="Test User" size="sm" status="online" />
<Avatar name="Test User" size="md" status="online" />
<Avatar name="Test User" size="lg" status="online" />
<Avatar name="Test User" size="xl" status="online" />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'image',    label: 'With Image' },
  { id: 'initials', label: 'Initials' },
  { id: 'shapes',   label: 'Shapes' },
  { id: 'status',   label: 'Status Indicator' },
  { id: 'sizes',    label: 'All Sizes' },
  { id: 'api',      label: 'API' },
]

export function AvatarPage() {
  const [activeSection, setActiveSection] = useState('image')
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
        <h1>Avatar</h1>
        <p className="docs-desc">
          User or entity representation with image, initials, status indicator, and multiple sizes.
        </p>

        <section id="image" className="demo-section" aria-labelledby="image-heading">
          <h2 id="image-heading">With Image</h2>
          <p className="section-desc">
            Avatars with an image source at each of the five available sizes.
          </p>
          <CodePreview code={IMAGE_CODE}>
            <div className="demo-row" style={{ alignItems: 'center' }}>
              <Avatar src="https://i.pravatar.cc/100?u=alice" alt="Alice" size="xs" />
              <Avatar src="https://i.pravatar.cc/100?u=bob" alt="Bob" size="sm" />
              <Avatar src="https://i.pravatar.cc/100?u=charlie" alt="Charlie" size="md" />
              <Avatar src="https://i.pravatar.cc/100?u=diana" alt="Diana" size="lg" />
              <Avatar src="https://i.pravatar.cc/100?u=edward" alt="Edward" size="xl" />
            </div>
          </CodePreview>
        </section>

        <section id="initials" className="demo-section" aria-labelledby="initials-heading">
          <h2 id="initials-heading">Initials (fallback)</h2>
          <p className="section-desc">
            When no image is provided, the avatar renders initials derived from the{' '}
            <code>name</code> prop.
          </p>
          <CodePreview code={INITIALS_CODE}>
            <div className="demo-row" style={{ alignItems: 'center' }}>
              <Avatar name="Alice Zimmerman" size="sm" />
              <Avatar name="Bob Adams" size="md" />
              <Avatar name="Charlie" size="lg" />
            </div>
          </CodePreview>
        </section>

        <section id="shapes" className="demo-section" aria-labelledby="shapes-heading">
          <h2 id="shapes-heading">Shapes</h2>
          <p className="section-desc">Choose between circle (default) and square shapes.</p>
          <CodePreview code={SHAPES_CODE}>
            <div className="demo-row" style={{ alignItems: 'center' }}>
              <Avatar name="Circle" size="lg" shape="circle" />
              <Avatar name="Square" size="lg" shape="square" />
            </div>
          </CodePreview>
        </section>

        <section id="status" className="demo-section" aria-labelledby="status-heading">
          <h2 id="status-heading">Status Indicator</h2>
          <p className="section-desc">
            A colored dot overlays the avatar to indicate online, offline, or busy status.
          </p>
          <CodePreview code={STATUS_CODE}>
            <div className="demo-row" style={{ alignItems: 'center' }}>
              <Avatar name="Online" size="lg" status="online" />
              <Avatar name="Offline" size="lg" status="offline" />
              <Avatar name="Busy" size="lg" status="busy" />
              <Avatar src="https://i.pravatar.cc/100?u=status" alt="Status" size="lg" status="online" />
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">All Sizes</h2>
          <p className="section-desc">
            Side-by-side comparison of all five size options from xs to xl.
          </p>
          <CodePreview code={ALL_SIZES_CODE}>
            <div className="demo-row" style={{ alignItems: 'flex-end' }}>
              {SIZES.map((s) => (
                <div
                  key={s}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                >
                  <Avatar name="Test User" size={s} status="online" />
                  <span style={{ fontSize: 'var(--sp-text-2xs, 10px)', color: 'var(--sp-text-muted)' }}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
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
                  <td><code>src</code></td>
                  <td><code>string</code></td>
                  <td><code>''</code></td>
                  <td>Image URL</td>
                </tr>
                <tr>
                  <td><code>alt</code></td>
                  <td><code>string</code></td>
                  <td><code>''</code></td>
                  <td>Alt text for image</td>
                </tr>
                <tr>
                  <td><code>name</code></td>
                  <td><code>string</code></td>
                  <td><code>''</code></td>
                  <td>Name for initials fallback</td>
                </tr>
                <tr>
                  <td><code>size</code></td>
                  <td><code>'xs' | 'sm' | 'md' | 'lg' | 'xl'</code></td>
                  <td><code>'md'</code></td>
                  <td>Avatar size</td>
                </tr>
                <tr>
                  <td><code>shape</code></td>
                  <td><code>'circle' | 'square'</code></td>
                  <td><code>'circle'</code></td>
                  <td>Avatar shape</td>
                </tr>
                <tr>
                  <td><code>status</code></td>
                  <td><code>'online' | 'offline' | 'busy' | null</code></td>
                  <td><code>null</code></td>
                  <td>Status indicator</td>
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
