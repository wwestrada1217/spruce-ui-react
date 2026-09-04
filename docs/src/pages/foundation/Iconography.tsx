import { useState, useMemo } from 'react'
import {
  Icon,
  NAVIGATION_ICONS,
  ACTION_ICONS,
  STATUS_ICONS,
  SOCIAL_ICONS,
  CONTENT_ICONS,
  EDITOR_ICONS,
  LAYOUT_ICONS,
  DATA_ICONS,
  DEVELOPMENT_ICONS,
  GENERAL_ICONS,
  DUOTONE_ICONS,
} from 'spruce-react'
import type { IconDefinition } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { FoundationPageShell } from '../../components/FoundationPageShell'

// ── Collection metadata ──────────────────────────────────────────────────────

interface IconCollection {
  label: string
  icons: readonly IconDefinition[]
}

const COLLECTIONS: IconCollection[] = [
  { label: 'Navigation',   icons: NAVIGATION_ICONS },
  { label: 'Action',       icons: ACTION_ICONS },
  { label: 'Status',       icons: STATUS_ICONS },
  { label: 'Social',       icons: SOCIAL_ICONS },
  { label: 'Content',      icons: CONTENT_ICONS },
  { label: 'Editor',       icons: EDITOR_ICONS },
  { label: 'Layout',       icons: LAYOUT_ICONS },
  { label: 'Data',         icons: DATA_ICONS },
  { label: 'Development',  icons: DEVELOPMENT_ICONS },
  { label: 'General',      icons: GENERAL_ICONS },
  { label: 'Duotone',      icons: DUOTONE_ICONS },
]

const ALL_ICONS: { name: string; category: string }[] = COLLECTIONS.flatMap((c) =>
  c.icons.map(([name]) => ({ name, category: c.label })),
)

const ICON_SIZES = [12, 16, 20, 24, 32, 48]

const USAGE_CODE = `import { Icon } from 'spruce-react'

<Icon name="check" size={20} />
<Icon name="star" size={24} ariaLabel="Favourite" />
<Icon name="chevron-down" />`

const DUOTONE_CODE = `{/* Duotone icons have a secondary fill path. */}
{/* Control its appearance with CSS custom properties: */}
<div style={{
  '--sp-icon-secondary-color': 'var(--sp-primary)',
  '--sp-icon-secondary-opacity': '0.15',
}}>
  <Icon name="home-dt" size={32} />
  <Icon name="bell-dt" size={32} />
  <Icon name="star-dt" size={32} />
  <Icon name="shield-dt" size={32} />
  <Icon name="heart-dt" size={32} />
</div>`

const TREE_SHAKE_CODE = `// Import only the icons you use for smaller bundles:
import { iconSet, iconCheck, iconX, iconStar } from 'spruce-react'

<SpruceProvider icons={iconSet(iconCheck, iconX, iconStar)}>
  <App />
</SpruceProvider>

// Or import entire collections:
import { iconSet, NAVIGATION_ICONS, ACTION_ICONS } from 'spruce-react'

<SpruceProvider icons={iconSet(...NAVIGATION_ICONS, ...ACTION_ICONS)}>
  <App />
</SpruceProvider>`

// ── Icon item ────────────────────────────────────────────────────────────────

function IconItem({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(name).catch(() => undefined)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      className="icon-item"
      onClick={copy}
      type="button"
      title={copied ? 'Copied!' : `Copy name: ${name}`}
      aria-label={name}
    >
      <Icon name={name} size={20} />
      <span className="icon-item-name">{copied ? 'copied' : name}</span>
    </button>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function IconographyPage() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return null
    const q = search.toLowerCase()
    return ALL_ICONS.filter((i) => i.name.includes(q) || i.category.toLowerCase().includes(q))
  }, [search])

  return (
    <FoundationPageShell variant="iconography" title="Iconography" description="Spruce includes a lightweight SVG icon system. Icons are registered through the React icon registry and rendered with the Icon component. All icons inherit currentColor and can be tree-shaken by importing only the collections or individual icons your application uses.">
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Iconography</h1>
        <p className="page-lead">
          Spruce includes a lightweight SVG icon system. Icons are registered through the React
          icon registry and rendered with the <code>&lt;Icon&gt;</code> component. All icons inherit
          <code>currentColor</code> and can be tree-shaken by importing only the collections or
          individual icons your application uses.
        </p>
      </div>

      {/* Search */}
      <div className="doc-section" style={{ paddingBottom: 0 }}>
        <input
          type="text"
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 400,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid var(--sp-border-strong, rgba(0,0,0,0.14))',
            background: 'var(--sp-surface-0, #fff)',
            color: 'var(--sp-text-color, #1a202c)',
            fontSize: 14,
            fontFamily: 'inherit',
            outline: 'none',
          }}
        />
        {filtered && (
          <p style={{ fontSize: 12, color: 'var(--sp-text-subtle)', marginTop: 8 }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Usage */}
      <section id="usage" className="doc-section">
        <h2>Usage</h2>
        <p className="section-desc">
          Render icons with the <code>{'<Icon>'}</code> component. Pass the icon
          name and an optional pixel size.
        </p>
        <CodePreview code={USAGE_CODE}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Icon name="check" size={20} />
            <Icon name="star" size={24} />
            <Icon name="chevron-down" />
            <Icon name="edit" size={20} />
            <Icon name="search" size={20} />
            <Icon name="settings" size={20} />
          </div>
        </CodePreview>
        <table className="token-table" aria-label="Icon component props" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>name</td>
              <td>string</td>
              <td>--</td>
              <td>Icon name (required)</td>
            </tr>
            <tr>
              <td>size</td>
              <td>number</td>
              <td>16</td>
              <td>Width and height in px</td>
            </tr>
            <tr>
              <td>ariaLabel</td>
              <td>string</td>
              <td>''</td>
              <td>Accessible label; sets role="img"</td>
            </tr>
            <tr>
              <td>className</td>
              <td>string</td>
              <td>--</td>
              <td>Additional CSS class name(s)</td>
            </tr>
            <tr>
              <td>style</td>
              <td>CSSProperties</td>
              <td>--</td>
              <td>Inline style overrides</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="thickness" className="doc-section">
        <h2>Icon Thickness / Stroke Width</h2>
        <p className="section-desc">Spruce icons use a consistent outlined SVG treatment and inherit <code>currentColor</code>. The React <code>Icon</code> API controls name, size, accessible label, class, and style; use an icon definition with the desired stroke treatment when a different weight is required.</p>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: 16, background: 'var(--sp-surface-50)', border: '1px solid var(--sp-border)', borderRadius: 'var(--sp-radius-md)' }}>
          {[1, 1.5, 2, 3].map(weight => <div key={weight} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}><Icon name="check" size={28} /><span style={{ fontSize: 12, color: 'var(--sp-text-muted)' }}>{weight}px</span></div>)}
        </div>
      </section>

      <section id="setup" className="doc-section">
        <h2>Setup &amp; Tree Shaking</h2>
        <p className="section-desc">The provider registers the icon set used by the application. Import individual definitions or spread selected collections into <code>iconSet</code> to keep bundles small.</p>
        <CodePreview code={TREE_SHAKE_CODE}><div><Icon name="check" size={20} /><Icon name="x" size={20} /><Icon name="star" size={20} /></div></CodePreview>
        <h3>Auto-Registration</h3>
        <p className="section-desc">When no custom registry is supplied, Spruce's provider makes the bundled icon set available to <code>Icon</code>. A custom icon registry takes precedence for names it registers.</p>
      </section>

      {/* Search results or categorized grid */}
      {filtered ? (
        <section className="doc-section">
          <h2>Search Results</h2>
          <div className="icon-grid" role="list" aria-label="Search results">
            {filtered.map((icon) => (
              <div key={icon.name} role="listitem">
                <IconItem name={icon.name} />
              </div>
            ))}
            {filtered.length === 0 && (
              <p style={{ color: 'var(--sp-text-subtle)', fontSize: 13, gridColumn: '1 / -1' }}>
                No icons match "{search}".
              </p>
            )}
          </div>
        </section>
      ) : (
        <>
        <section id="collections" className="doc-section"><h2>Collections</h2><p className="section-desc">Icons are grouped by product meaning so teams can find familiar actions, status, navigation, content, and data symbols.</p></section>
        {COLLECTIONS.map((col) => (
          <section key={col.label} className="doc-section">
            <h3>{col.label} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--sp-text-subtle)' }}>({col.icons.length})</span></h3>
            <div className="icon-grid" role="list" aria-label={`${col.label} icons`}>
              {col.icons.map(([name]) => (
                <div key={name} role="listitem">
                  <IconItem name={name} />
                </div>
              ))}
            </div>
          </section>
        ))}
        </>
      )}

      {/* Sizes */}
      <section className="doc-section">
        <h2>Sizes</h2>
        <p className="section-desc">
          Icons scale to any pixel size. Common sizes range from 12 px to 48 px.
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
          {ICON_SIZES.map((s) => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Icon name="check" size={s} />
              <span style={{ fontSize: 11, color: 'var(--sp-text-subtle)' }}>{s}px</span>
            </div>
          ))}
        </div>
      </section>

      {/* Duotone */}
      <section className="doc-section">
        <h2>Duotone Icons</h2>
        <p className="section-desc">
          Duotone icons use a secondary fill path. Its color and opacity are
          controlled by two CSS custom properties.
        </p>
        <CodePreview code={DUOTONE_CODE}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              '--sp-icon-secondary-color': 'var(--sp-primary)',
              '--sp-icon-secondary-opacity': '0.15',
            } as React.CSSProperties}
          >
            <Icon name="home-dt" size={32} />
            <Icon name="bell-dt" size={32} />
            <Icon name="star-dt" size={32} />
            <Icon name="shield-dt" size={32} />
            <Icon name="heart-dt" size={32} />
            <Icon name="folder-dt" size={32} />
            <Icon name="mail-dt" size={32} />
            <Icon name="calendar-dt" size={32} />
            <Icon name="user-dt" size={32} />
            <Icon name="file-dt" size={32} />
          </div>
        </CodePreview>
        <table className="token-table" aria-label="Duotone CSS custom properties" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>Property</th>
              <th>Default</th>
              <th>Controls</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>--sp-icon-secondary-color</td>
              <td>currentColor</td>
              <td>Fill color of the secondary path</td>
            </tr>
            <tr>
              <td>--sp-icon-secondary-opacity</td>
              <td>0.2</td>
              <td>Opacity of the secondary path</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="flags" className="doc-section">
        <h2>Flag Icons</h2>
        <p className="section-desc">Use the registered flag icon names for locale and country selectors. Keep country names visible or available through an accessible label; a flag alone is not a sufficient language name.</p>
        <div className="icon-grid" role="list" aria-label="Flag icon examples">
          {['flag-us', 'flag-gb', 'flag-fr', 'flag-de', 'flag-jp', 'flag-ph'].map(name => <div key={name} role="listitem"><IconItem name={name} /></div>)}
        </div>
      </section>

      {/* Tree shaking */}
      <section className="doc-section">
        <h2>Tree Shaking</h2>
        <p className="section-desc">
          By default, <code>SpruceProvider</code> registers all {ALL_ICONS.length} icons.
          For smaller bundles, import only the icons or collections you need.
        </p>
        <CodePreview code={TREE_SHAKE_CODE}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="check" size={20} />
            <Icon name="x" size={20} />
            <Icon name="star" size={20} />
          </div>
        </CodePreview>
      </section>

      <section id="api" className="doc-section">
        <h2>API</h2>
        <table className="token-table" aria-label="Icon API"><thead><tr><th>Prop</th><th>Type</th><th>Description</th></tr></thead><tbody><tr><td><code>name</code></td><td>string</td><td>Registered icon name.</td></tr><tr><td><code>size</code></td><td>number</td><td>Width and height in pixels.</td></tr><tr><td><code>ariaLabel</code></td><td>string</td><td>Accessible name for meaningful icons; decorative icons remain hidden from assistive technology.</td></tr><tr><td><code>className</code> / <code>style</code></td><td>string / CSSProperties</td><td>Additional styling hooks and inline overrides.</td></tr></tbody></table>
      </section>
    </FoundationPageShell>
  )
}
