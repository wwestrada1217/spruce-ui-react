import { useEffect, useMemo, useRef, useState } from 'react'
import { ALL_ILLUSTRATIONS, Button, ILLUSTRATIONS_BY_NAME, Icon, Illustration } from 'spruce-react'
import type { IllustrationCategory, IllustrationDefinition } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { FoundationPageShell } from '../../components/FoundationPageShell'

type GallerySize = 'sm' | 'md' | 'lg'
type ColorMode = 'default' | 'grayscale' | 'primary'

const CATEGORY_LABELS: Record<IllustrationCategory, string> = {
  status: 'Status & Errors', hr: 'HR & People', payroll: 'Payroll', finance: 'Finance', technology: 'Technology', inventory: 'Inventory',
  'project-management': 'Project Management', helpdesk: 'Helpdesk', security: 'Security & Vault', document: 'Document', people: 'People & Characters',
  'sales-marketing': 'Sales & Marketing', telecommunications: 'Telecommunication', transportation: 'Transportation', shipping: 'Shipping & Logistics',
  construction: 'Construction', agriculture: 'Agriculture', 'petro-fuel': 'Petro & Fuel', education: 'Education & Academics', healthcare: 'Health & Medicine',
  science: 'Science', 'pet-care': 'Pet Care', 'jobs-labor': 'Jobs & Labor', robotics: 'Robotics',
}

const EMPTY_CODE = `import { Illustration, illustrationNotFound } from 'spruce-react'

<Illustration illustration={illustrationNotFound} size="md" />`

const REGISTRY_CODE = `import { ILLUSTRATIONS_BY_NAME, Illustration } from 'spruce-react'

<Illustration name="not-found" illustrations={ILLUSTRATIONS_BY_NAME} />
// Or resolve a definition for direct binding:
const illustration = ILLUSTRATIONS_BY_NAME['server-error']`

const STATUS_CODE = `<div className="status-card">
  <Illustration illustration={illustrationNotFound} size="md" ariaLabel="Page not found" />
  <h3>Page not found</h3>
  <p>The page you are looking for doesn't exist or has been moved.</p>
  <Button variant="primary">Back to dashboard</Button>
</div>`

const SIZING_CODE = `{/* Preset sizes: sm 180px, md 260px, lg 360px */}
<Illustration illustration={illustration} size="sm" />
<Illustration illustration={illustration} size="md" />
<Illustration illustration={illustration} size="lg" />

{/* Custom dimensions */}
<Illustration illustration={illustration} width="400px" height="300px" />`

const APPEARANCE_CODE = `{/* Full color with the in-illustration badge */}
<Illustration illustration={illustration} size="md" />

{/* Neutral grayscale */}
<Illustration illustration={illustration} size="md" monochrome />

{/* Theme primary tint, with the badge hidden */}
<Illustration illustration={illustration} size="md" color="primary" showBadge={false} />`

function illustrationImportName(item: IllustrationDefinition): string {
  return `illustration${item.name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')}`
}

export function IllustrationsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | IllustrationCategory>('all')
  const [size, setSize] = useState<GallerySize>('md')
  const [colorMode, setColorMode] = useState<ColorMode>('default')
  const [showBadges, setShowBadges] = useState(true)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const copyTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
  }, [])

  const categories = useMemo(() => {
    const entries = (Object.keys(CATEGORY_LABELS) as IllustrationCategory[]).map(id => ({ id, label: CATEGORY_LABELS[id], count: ALL_ILLUSTRATIONS.filter(item => item.category === id).length }))
    return [{ id: 'all' as const, label: 'All', count: ALL_ILLUSTRATIONS.length }, ...entries]
  }, [])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return ALL_ILLUSTRATIONS.filter(item => {
      if (category !== 'all' && item.category !== category) return false
      if (!normalized) return true
      return item.name.includes(normalized) || item.title.toLowerCase().includes(normalized) || item.tags?.some(tag => tag.toLowerCase().includes(normalized))
    })
  }, [category, query])

  function flashCopied(key: string): void {
    setCopiedKey(key)
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopiedKey(current => current === key ? null : current), 1800)
  }

  function copyText(text: string, key: string): void {
    if (navigator.clipboard?.writeText) void navigator.clipboard.writeText(text).then(() => flashCopied(key)).catch(() => undefined)
  }

  return <FoundationPageShell variant="illustrations" title="Illustrations" description="Spruce includes a tree-shakeable SVG illustration library for status pages, errors, empty states, HR, payroll, finance, technology, inventory, project management, helpdesk, security, and document applications." packageName="spruce-react" packageSymbols={['Illustration', 'ALL_ILLUSTRATIONS', 'STATUS_ILLUSTRATIONS']}>
    <section id="gallery" className="doc-section">
      <h2>Illustration Gallery</h2>
      <p className="section-desc">Browse all {ALL_ILLUSTRATIONS.length} illustrations. Filter by category, search by name or keyword, and copy the name, import, or SVG markup directly into your app.</p>
      <div className="illustrations-toolbar">
        <label className="illustrations-search"><Icon name="search" size={16} /><input aria-label="Search illustrations" value={query} onChange={event => setQuery(event.target.value)} placeholder={`Search ${ALL_ILLUSTRATIONS.length} illustrations...`} /></label>
        <div className="illustrations-categories" aria-label="Illustration categories">{categories.map(item => <button key={item.id} type="button" className={`illustration-filter${category === item.id ? ' active' : ''}`} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label} <span>{item.count}</span></button>)}</div>
        <div className="illustrations-controls">
          <div className="illustration-segmented" role="group" aria-label="Illustration size">{(['sm', 'md', 'lg'] as GallerySize[]).map(option => <button key={option} type="button" className={size === option ? 'active' : ''} aria-pressed={size === option} onClick={() => setSize(option)}>{option.toUpperCase()}</button>)}</div>
          <div className="illustration-segmented" role="group" aria-label="Illustration color mode"><button type="button" className={colorMode === 'default' ? 'active' : ''} aria-pressed={colorMode === 'default'} onClick={() => setColorMode('default')}>Color</button><button type="button" className={colorMode === 'grayscale' ? 'active' : ''} aria-pressed={colorMode === 'grayscale'} onClick={() => setColorMode('grayscale')}>Gray</button><button type="button" className={colorMode === 'primary' ? 'active' : ''} aria-pressed={colorMode === 'primary'} onClick={() => setColorMode('primary')}>Primary</button></div>
          <button type="button" className={`illustration-toggle${showBadges ? ' active' : ''}`} aria-pressed={showBadges} onClick={() => setShowBadges(value => !value)}><Icon name={showBadges ? 'eye' : 'eye-off'} size={14} /> Badges {showBadges ? 'On' : 'Off'}</button>
        </div>
      </div>
      <div className={`illustrations-grid illustrations-grid--${size}`}>
        {filtered.length > 0 ? filtered.map(item => <article key={item.name} className="illustration-card">
          <div className="illustration-card__preview"><Illustration illustration={item} size={size} showBadge={showBadges} monochrome={colorMode === 'grayscale'} color={colorMode === 'primary' ? 'primary' : null} /></div>
          <div className="illustration-card__body"><div className="illustration-card__header"><h3>{item.title}</h3><span>{CATEGORY_LABELS[item.category]}</span></div><code>{item.name}</code><div className="illustration-card__actions"><button type="button" onClick={() => copyText(item.name, `${item.name}-name`)}>{copiedKey === `${item.name}-name` ? 'Copied!' : 'Name'}</button><button type="button" onClick={() => copyText(`import { ${illustrationImportName(item)} } from 'spruce-react';`, `${item.name}-import`)}>{copiedKey === `${item.name}-import` ? 'Copied!' : 'Import'}</button><button type="button" onClick={() => copyText(item.svg, `${item.name}-svg`)}>{copiedKey === `${item.name}-svg` ? 'Copied!' : 'SVG'}</button></div></div>
        </article>) : <div className="illustrations-empty"><Illustration name="not-found" illustrations={ILLUSTRATIONS_BY_NAME} size="sm" /><p>No illustrations match “{query}”.</p></div>}
      </div>
    </section>

    <section id="usage" className="doc-section"><h2>Tree-Shaking &amp; Setup</h2><p className="section-desc">Illustrations are exported as individual definitions. Import the definition you need for the smallest bundle, or use the complete collection when building a gallery or registry-driven experience.</p><div className="code-grid"><article className="code-card"><h3>Direct Binding</h3><CodePreview codeOnly language="typescript" code={EMPTY_CODE} /><p>Pass an illustration definition directly to <code>Illustration</code>; no global registry is required.</p></article><article className="code-card"><h3>Name Lookup</h3><CodePreview codeOnly language="typescript" code={REGISTRY_CODE} /><p>Use <code>ILLUSTRATIONS_BY_NAME</code> when the illustration name comes from configuration or content data.</p></article></div></section>

    <section id="status-pages" className="doc-section"><h2>Status Pages &amp; Empty States</h2><p className="section-desc">Use illustrations inside error views, 404 pages, session timeout modals, and empty-state containers. The message and recovery action remain the primary communication.</p><CodePreview code={STATUS_CODE}><div className="status-card-demo"><Illustration name="not-found" illustrations={ILLUSTRATIONS_BY_NAME} size="md" ariaLabel="Page not found" /><h3>Page not found</h3><p>The page you are looking for doesn't exist or has been moved.</p><Button variant="primary">Back to dashboard</Button></div></CodePreview></section>

    <section id="sizing" className="doc-section"><h2>Sizing &amp; Responsive Layout</h2><p className="section-desc">Choose preset sizes from <code>xs</code> through <code>2xl</code>, or use <code>full</code> and explicit dimensions when artwork needs to follow its container.</p><CodePreview code={SIZING_CODE}><div className="illustration-size-row"><div><Illustration name="employee-onboarding" illustrations={ILLUSTRATIONS_BY_NAME} size="sm" /><span>sm · 180px</span></div><div><Illustration name="employee-onboarding" illustrations={ILLUSTRATIONS_BY_NAME} size="md" /><span>md · 260px</span></div><div><Illustration name="employee-onboarding" illustrations={ILLUSTRATIONS_BY_NAME} size="lg" /><span>lg · 360px</span></div></div></CodePreview></section>

    <section id="appearance" className="doc-section"><h2>Appearance, Color &amp; Badges</h2><p className="section-desc">Toggle in-illustration status badges, activate grayscale styling, or pass <code>primary</code> or any CSS color to tint an illustration with the active brand palette.</p><CodePreview code={APPEARANCE_CODE}><div className="illustration-appearance"><div><Illustration name="employee-onboarding" illustrations={ILLUSTRATIONS_BY_NAME} size="sm" /><span>Default</span></div><div><Illustration name="employee-onboarding" illustrations={ILLUSTRATIONS_BY_NAME} size="sm" monochrome /><span>Monochrome</span></div><div><Illustration name="employee-onboarding" illustrations={ILLUSTRATIONS_BY_NAME} size="sm" color="primary" showBadge={false} /><span>Primary tint</span></div></div></CodePreview></section>

    <section id="api" className="doc-section"><h2>API Reference</h2><p className="section-desc">The React illustration API supports direct definitions, optional name lookup, responsive sizing, accessible labeling, badge visibility, and monochrome or tinted rendering.</p><table className="token-table" aria-label="Illustration API"><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>illustration</code></td><td><code>IllustrationDefinition | string | null</code></td><td><code>null</code></td><td>Tree-shakeable definition or trusted raw SVG markup.</td></tr><tr><td><code>name</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Name resolved from the supplied <code>illustrations</code> map.</td></tr><tr><td><code>illustrations</code></td><td><code>Readonly&lt;Record&lt;string, IllustrationDefinition&gt;&gt;</code></td><td><code>undefined</code></td><td>Optional registry map for name-based rendering.</td></tr><tr><td><code>size</code></td><td><code>IllustrationSize</code></td><td><code>'md'</code></td><td>Preset size, numeric pixels, or a CSS dimension string.</td></tr><tr><td><code>showBadge</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows or hides the <code>.sp-ill-badge</code> group inside the SVG.</td></tr><tr><td><code>color</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Enables monochromatic tinting with <code>primary</code> or any CSS color.</td></tr><tr><td><code>monochrome</code></td><td><code>boolean | string</code></td><td><code>false</code></td><td>Applies grayscale or a custom monochromatic tint.</td></tr><tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>''</code></td><td>Accessible label; unlabeled illustrations are rendered as presentation.</td></tr></tbody></table></section>
  </FoundationPageShell>
}
