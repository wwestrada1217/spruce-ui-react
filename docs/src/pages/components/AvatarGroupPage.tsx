import { useState, useEffect, useRef } from 'react'
import { AvatarGroup } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
const SIZES: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

const TEAM = [
  { name: 'Alice Johnson', src: 'https://i.pravatar.cc/150?u=alice' },
  { name: 'Bob Martinez',  src: 'https://i.pravatar.cc/150?u=bob'   },
  { name: 'Charlie Kim' },
  { name: 'Diana Patel',   src: 'https://i.pravatar.cc/150?u=diana' },
  { name: 'Edward Chen',   src: 'https://i.pravatar.cc/150?u=edward'},
  { name: 'Fiona Garcia' },
  { name: 'George Wilson', src: 'https://i.pravatar.cc/150?u=george'},
  { name: 'Hannah Lee',    src: 'https://i.pravatar.cc/150?u=hannah'},
]

const BASIC_CODE = `<AvatarGroup
  items={teamMembers}
  max={5}
/>`

const MAX_CODE = `<AvatarGroup items={teamMembers} max={3} />
<AvatarGroup items={teamMembers} max={5} />
<AvatarGroup items={teamMembers} max={8} />`

const SIZES_CODE = `<AvatarGroup items={teamMembers} max={4} size="xs" />
<AvatarGroup items={teamMembers} max={4} size="sm" />
<AvatarGroup items={teamMembers} max={4} size="md" />
<AvatarGroup items={teamMembers} max={4} size="lg" />
<AvatarGroup items={teamMembers} max={4} size="xl" />`

const NO_OVERFLOW_CODE = `<AvatarGroup items={teamMembers} max={teamMembers.length} />`

const SPACING_CODE = `<AvatarGroup items={teamMembers} max={5} spacing={4} />
<AvatarGroup items={teamMembers} max={5} spacing={12} />
<AvatarGroup items={teamMembers} max={5} spacing={20} />`

const BORDER_COLOR_CODE = `{/* On a dark background */}
<AvatarGroup items={teamMembers} max={4} borderColor="#1e293b" />

{/* On a green-tinted background */}
<AvatarGroup items={teamMembers} max={4} borderColor="#f0fdf4" />`

const INVERT_STACK_CODE = `{/* Default: last avatar on top */}
<AvatarGroup items={teamMembers} max={5} />

{/* Inverted: first avatar on top */}
<AvatarGroup items={teamMembers} max={5} invertStack />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',        label: 'Basic' },
  { id: 'max',          label: 'Max Visible' },
  { id: 'sizes',        label: 'Sizes' },
  { id: 'no-overflow',  label: 'No Overflow' },
  { id: 'spacing',      label: 'Spacing' },
  { id: 'border-color', label: 'Border Color' },
  { id: 'invert-stack', label: 'Invert Stack' },
  { id: 'api',          label: 'API' },
]

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--sp-text-xs, 12px)',
  color: 'var(--sp-text-muted)',
}

const labeledItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 8,
}

export function AvatarGroupPage() {
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
        <h1>Avatar Group</h1>
        <p className="docs-desc">
          Display a collection of avatars with overflow handling, configurable max count, and multiple sizes.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">
            An avatar group showing up to 5 members with an overflow badge for the rest.
          </p>
          <CodePreview code={BASIC_CODE}>
            <AvatarGroup items={TEAM} max={5} />
          </CodePreview>
        </section>

        <section id="max" className="demo-section" aria-labelledby="max-heading">
          <h2 id="max-heading">Max Visible</h2>
          <p className="section-desc">
            Control how many avatars are shown before the overflow count appears.
          </p>
          <CodePreview code={MAX_CODE}>
            <div className="demo-row" style={{ alignItems: 'flex-start' }}>
              {([3, 5, 8] as const).map((max) => (
                <div key={max} style={labeledItemStyle}>
                  <span style={labelStyle}>max={max}</span>
                  <AvatarGroup items={TEAM} max={max} />
                </div>
              ))}
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">
            Avatar groups support all avatar sizes: xs, sm, md, lg, and xl.
          </p>
          <CodePreview code={SIZES_CODE}>
            <div className="demo-row" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {SIZES.map((s) => (
                <div key={s} style={labeledItemStyle}>
                  <span style={labelStyle}>{s}</span>
                  <AvatarGroup items={TEAM} max={4} size={s} />
                </div>
              ))}
            </div>
          </CodePreview>
        </section>

        <section id="no-overflow" className="demo-section" aria-labelledby="no-overflow-heading">
          <h2 id="no-overflow-heading">No Overflow</h2>
          <p className="section-desc">
            When the max equals or exceeds the number of items, no overflow badge is shown.
          </p>
          <CodePreview code={NO_OVERFLOW_CODE}>
            <AvatarGroup items={TEAM} max={TEAM.length} />
          </CodePreview>
        </section>

        <section id="spacing" className="demo-section" aria-labelledby="spacing-heading">
          <h2 id="spacing-heading">Spacing</h2>
          <p className="section-desc">
            Adjust the overlap between avatars using the <code>spacing</code> prop.
          </p>
          <CodePreview code={SPACING_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {([4, 12, 20] as const).map((sp) => (
                <div key={sp} style={labeledItemStyle}>
                  <span style={labelStyle}>spacing={sp}</span>
                  <AvatarGroup items={TEAM} max={5} spacing={sp} />
                </div>
              ))}
            </div>
          </CodePreview>
        </section>

        <section id="border-color" className="demo-section" aria-labelledby="border-color-heading">
          <h2 id="border-color-heading">Border Color</h2>
          <p className="section-desc">
            Customize the border color of avatars and the overflow badge using the{' '}
            <code>borderColor</code> prop. Useful when placing the group on a non-white background.
          </p>
          <CodePreview code={BORDER_COLOR_CODE}>
            <div className="demo-row" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
              <div style={labeledItemStyle}>
                <span style={labelStyle}>Default</span>
                <AvatarGroup items={TEAM} max={4} />
              </div>
              <div
                style={{ background: '#1e293b', padding: '12px 16px', borderRadius: 8, ...labeledItemStyle }}
              >
                <span style={{ ...labelStyle, color: '#94a3b8' }}>borderColor="#1e293b"</span>
                <AvatarGroup items={TEAM} max={4} borderColor="#1e293b" />
              </div>
              <div
                style={{ background: '#f0fdf4', padding: '12px 16px', borderRadius: 8, ...labeledItemStyle }}
              >
                <span style={labelStyle}>borderColor="#f0fdf4"</span>
                <AvatarGroup items={TEAM} max={4} borderColor="#f0fdf4" />
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="invert-stack" className="demo-section" aria-labelledby="invert-stack-heading">
          <h2 id="invert-stack-heading">Invert Stack</h2>
          <p className="section-desc">
            By default the last avatar renders on top. Set <code>invertStack</code> to make
            the first avatar appear on top instead.
          </p>
          <CodePreview code={INVERT_STACK_CODE}>
            <div className="demo-row" style={{ alignItems: 'flex-start' }}>
              <div style={labeledItemStyle}>
                <span style={labelStyle}>Default</span>
                <AvatarGroup items={TEAM} max={5} />
              </div>
              <div style={labeledItemStyle}>
                <span style={labelStyle}>invertStack</span>
                <AvatarGroup items={TEAM} max={5} invertStack />
              </div>
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
                  <td><code>items</code></td>
                  <td><code>AvatarGroupItem[]</code></td>
                  <td>required</td>
                  <td>Array of avatar items</td>
                </tr>
                <tr>
                  <td><code>max</code></td>
                  <td><code>number</code></td>
                  <td><code>5</code></td>
                  <td>Maximum visible avatars before overflow badge</td>
                </tr>
                <tr>
                  <td><code>size</code></td>
                  <td><code>'xs' | 'sm' | 'md' | 'lg' | 'xl'</code></td>
                  <td><code>'md'</code></td>
                  <td>Size for all avatars</td>
                </tr>
                <tr>
                  <td><code>spacing</code></td>
                  <td><code>number</code></td>
                  <td><code>8</code></td>
                  <td>Overlap offset (px) between avatars</td>
                </tr>
                <tr>
                  <td><code>invertStack</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>When true, the first avatar appears on top instead of the last</td>
                </tr>
                <tr>
                  <td><code>borderColor</code></td>
                  <td><code>string</code></td>
                  <td><code>''</code></td>
                  <td>Border color for avatars and overflow badge (any CSS color). Defaults to the surface background.</td>
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
