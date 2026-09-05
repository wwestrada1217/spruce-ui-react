import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  ACTION_ICONS,
  CONTENT_ICONS,
  DATA_ICONS,
  DEVELOPMENT_ICONS,
  DUOTONE_ICONS,
  EDITOR_ICONS,
  FLAG_ICONS,
  GENERAL_ICONS,
  Icon,
  LAYOUT_ICONS,
  NAVIGATION_ICONS,
  SOCIAL_ICONS,
  STATUS_ICONS,
} from 'spruce-react'
import type { IconDefinition } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { FoundationPageShell } from '../../components/FoundationPageShell'

interface IconCollection {
  label: string
  importName: string
  icons: readonly IconDefinition[]
}
const COLLECTIONS: readonly IconCollection[] = [
  { label: 'Navigation', importName: 'NAVIGATION_ICONS', icons: NAVIGATION_ICONS },
  { label: 'Action', importName: 'ACTION_ICONS', icons: ACTION_ICONS },
  { label: 'Status', importName: 'STATUS_ICONS', icons: STATUS_ICONS },
  { label: 'Social', importName: 'SOCIAL_ICONS', icons: SOCIAL_ICONS },
  { label: 'Content', importName: 'CONTENT_ICONS', icons: CONTENT_ICONS },
  { label: 'Editor', importName: 'EDITOR_ICONS', icons: EDITOR_ICONS },
  { label: 'Layout', importName: 'LAYOUT_ICONS', icons: LAYOUT_ICONS },
  { label: 'Data', importName: 'DATA_ICONS', icons: DATA_ICONS },
  { label: 'Development', importName: 'DEVELOPMENT_ICONS', icons: DEVELOPMENT_ICONS },
  { label: 'General', importName: 'GENERAL_ICONS', icons: GENERAL_ICONS },
]

const iconNames = (icons: readonly IconDefinition[]) => icons.map(([name]) => name)
const DUOTONE_NAMES = iconNames(DUOTONE_ICONS)
const FLAG_NAMES = Object.keys(FLAG_ICONS)
const ALL_ICON_NAMES = [
  ...COLLECTIONS.flatMap(collection => iconNames(collection.icons)),
  ...DUOTONE_NAMES,
  ...FLAG_NAMES,
]

const USAGE_CODE = `<Icon name="check" size={20} ariaLabel="Complete" />`
const SETUP_INDIVIDUAL_CODE = `import { Icon, iconCheck } from 'spruce-react'

<Icon name="check" size={20} />`
const SETUP_COLLECTION_CODE = `import { Icon, ACTION_ICONS } from 'spruce-react'

<SpruceProvider icons={iconSet(...ACTION_ICONS)}>
  <Icon name="check" />
</SpruceProvider>`
const SETUP_ALL_CODE = `import { DEFAULT_ICONS, SpruceProvider } from 'spruce-react'

<SpruceProvider icons={DEFAULT_ICONS}>
  <App />
</SpruceProvider>`
const AUTO_REGISTRATION_CODE = `import { SpruceProvider, DEFAULT_ICONS } from 'spruce-react'

// Register once at the application boundary.
<SpruceProvider icons={DEFAULT_ICONS}>
  <App />
</SpruceProvider>`
const DUOTONE_CODE = `<Icon
  name="heart-dt"
  size={32}
  style={{
    '--sp-icon-secondary-opacity': 0.35,
  }}
/>`
const FLAG_CODE = `<Icon name="flag-us" size={24} ariaLabel="United States" />`

const WEIGHT_SIZES = [
  ['16px', 16],
  ['20px', 20],
  ['24px', 24],
  ['32px', 32],
  ['48px', 48],
] as const

function toTypeScriptName(name: string) {
  return `icon${name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')}`
}

interface IconCardProps {
  name: string
  copied: boolean
  size?: number
  onCopy: (name: string) => void
}

function IconCard({ name, copied, size = 28, onCopy }: IconCardProps) {
  return (
    <button
      type="button"
      className={`icon-card${copied ? ' icon-card--copied' : ''}`}
      aria-label={`Copy ${name}`}
      onClick={() => onCopy(name)}
    >
      <span className="icon-card__preview"><Icon name={name} size={size} /></span>
      <span className="icon-card__name">{name}</span>
      <span className="icon-card__action" aria-hidden="true">
        <Icon name={copied ? 'check' : 'copy'} size={14} />
      </span>
    </button>
  )
}

interface IconGridProps {
  names: readonly string[]
  copiedIcon: string
  onCopy: (name: string) => void
  ariaLabel: string
  size?: number
}

function IconGrid({ names, copiedIcon, onCopy, ariaLabel, size }: IconGridProps) {
  return (
    <div className="icon-grid" role="list" aria-label={ariaLabel}>
      {names.map(name => (
        <div key={name} role="listitem">
          <IconCard name={name} copied={copiedIcon === name} size={size} onCopy={onCopy} />
        </div>
      ))}
    </div>
  )
}

export function IconographyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [flagSearchQuery, setFlagSearchQuery] = useState('')
  const [copyFormat, setCopyFormat] = useState<'name' | 'tag' | 'ts'>('name')
  const [copiedIcon, setCopiedIcon] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current)
  }, [])

  const query = searchQuery.trim().toLowerCase()
  const filteredIconNames = useMemo(
    () => ALL_ICON_NAMES.filter(name => name.includes(query)),
    [query],
  )
  const filteredCollections = useMemo(
    () => COLLECTIONS.map(collection => ({
      ...collection,
      names: iconNames(collection.icons).filter(name => name.includes(query)),
    })).filter(collection => collection.names.length > 0),
    [query],
  )
  const filteredDuotoneNames = useMemo(
    () => DUOTONE_NAMES.filter(name => name.includes(query)),
    [query],
  )
  const flagQuery = flagSearchQuery.trim().toLowerCase()
  const filteredFlagNames = useMemo(
    () => FLAG_NAMES.filter(name => name.includes(flagQuery)),
    [flagQuery],
  )

  const copyIcon = async (name: string) => {
    const value = copyFormat === 'tag'
      ? `<Icon name="${name}" />`
      : copyFormat === 'ts'
        ? toTypeScriptName(name)
        : name
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(value)
      setCopiedIcon(name)
      setToastMessage(`Copied ${value}`)
      if (toastTimeout.current) clearTimeout(toastTimeout.current)
      toastTimeout.current = setTimeout(() => {
        setCopiedIcon('')
        setToastMessage('')
      }, 1800)
    } catch {
      setToastMessage('Copy is unavailable in this browser')
      if (toastTimeout.current) clearTimeout(toastTimeout.current)
      toastTimeout.current = setTimeout(() => setToastMessage(''), 1800)
    }
  }

  return (
    <FoundationPageShell
      variant="iconography"
      title="Iconography"
      description="A coherent icon language for navigation, actions, status, and product meaning. Spruce ships 527 icons as tree-shakeable React definitions with a shared registry and consistent sizing."
    >
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Iconography</h1>
        <p className="page-lead">A coherent icon language for navigation, actions, status, and product meaning.</p>
      </div>

      <section id="usage" className="doc-section">
        <h2>Usage</h2>
        <p className="section-desc">Use the <code>Icon</code> component with a registered icon name. Icons inherit the current text color and remain consistent across controls, navigation, and dense data surfaces.</p>
        <CodePreview code={USAGE_CODE} language="typescript" />
        <table className="token-table"><thead><tr><th>Prop</th><th>Type</th><th>Description</th></tr></thead><tbody>
          <tr><td><code>name</code></td><td><code>string</code></td><td>Registered icon name.</td></tr>
          <tr><td><code>size</code></td><td><code>number</code></td><td>Width and height in pixels. Defaults to 16.</td></tr>
          <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td>Accessible label for meaningful icons.</td></tr>
          <tr><td><code>style</code></td><td><code>CSSProperties</code></td><td>Inline style overrides, including duotone variables.</td></tr>
        </tbody></table>
        <h3>Icon thickness</h3>
        <p className="section-desc">The default set uses a consistent outline weight. Keep icon weight aligned within a surface and use duotone treatment only when it adds hierarchy or meaning.</p>
      </section>

      <section id="setup" className="doc-section">
        <h2>Setup</h2>
        <p className="section-desc">Choose individual definitions for maximum tree-shaking, a collection for a bounded feature area, or the complete default registry for application-wide use.</p>
        <CodePreview title="Individual icon" code={SETUP_INDIVIDUAL_CODE} language="typescript" codeOnly />
        <CodePreview title="Collection registration" code={SETUP_COLLECTION_CODE} language="typescript" codeOnly />
        <CodePreview title="All default icons" code={SETUP_ALL_CODE} language="typescript" codeOnly />
      </section>

      <section id="auto-registration" className="doc-section">
        <h2>Auto-registration</h2>
        <p className="section-desc">Register the icon map once at the application boundary. Descendant components can then render icons by name without repeating setup.</p>
        <CodePreview code={AUTO_REGISTRATION_CODE} language="typescript" codeOnly />
      </section>

      <section id="collections" className="doc-section">
        <h2>Collections ({filteredIconNames.length} / {ALL_ICON_NAMES.length})</h2>
        <p className="section-desc">Browse icons organized by collection. Click any icon card to copy its name, component tag, or TypeScript symbol.</p>
        <div className="icon-search-bar">
          <div className="icon-search">
            <Icon name="search" size={16} />
            <label className="sr-only" htmlFor="icon-search-input">Search icons</label>
            <input id="icon-search-input" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder={`Search ${ALL_ICON_NAMES.length} icons...`} />
            {searchQuery && <button type="button" className="icon-search__clear" aria-label="Clear icon search" onClick={() => setSearchQuery('')}><Icon name="x" size={14} /></button>}
          </div>
          <div className="copy-format-toggle" role="radiogroup" aria-label="Copy format">
            <span className="copy-format-label">Copy as:</span>
            {([['name', 'Name'], ['tag', 'Component'], ['ts', 'TS Symbol']] as const).map(([value, label]) => (
              <button key={value} type="button" className={`format-btn${copyFormat === value ? ' active' : ''}`} role="radio" aria-checked={copyFormat === value} onClick={() => setCopyFormat(value)}>{label}</button>
            ))}
          </div>
        </div>
        {filteredCollections.map(collection => (
          <div className="collection-group" key={collection.label}>
            <h3 className="collection-group__title"><span>{collection.label}</span><span className="collection-group__count">{collection.names.length}</span><code className="collection-group__import">{collection.importName}</code></h3>
            <IconGrid names={collection.names} copiedIcon={copiedIcon} onCopy={copyIcon} ariaLabel={`${collection.label} icons`} />
          </div>
        ))}
        {filteredIconNames.length === 0 && <p className="no-results">No icons match “{searchQuery}”.</p>}
      </section>

      <section id="sizes" className="doc-section">
        <h2>Sizes</h2>
        <p className="section-desc">Choose a size that follows the surrounding text and control rhythm. The icon remains optically centered at every supported size.</p>
        <div className="size-row">{WEIGHT_SIZES.map(([label, size]) => <div className="size-item" key={label}><Icon name="star" size={size} /><span>{label}</span></div>)}</div>
      </section>

      <section id="duotone-icons" className="doc-section">
        <h2>Duotone Icons</h2>
        <p className="section-desc">Duotone icons add a secondary fill layer through a CSS custom property. Use them sparingly to reinforce hierarchy without introducing a second icon family.</p>
        <IconGrid names={filteredDuotoneNames} copiedIcon={copiedIcon} onCopy={copyIcon} ariaLabel="Duotone icons" size={32} />
        <div className="duo-compare"><div className="duo-compare__item"><Icon name="heart-dt" size={40} /><span>Default</span></div><div className="duo-compare__item"><Icon name="heart-dt" size={40} style={{ '--sp-icon-secondary-opacity': 0.45 } as CSSProperties} /><span>Raised secondary</span></div><div className="duo-compare__item"><Icon name="heart-dt" size={40} style={{ '--sp-icon-secondary-opacity': 0.08 } as CSSProperties} /><span>Subtle secondary</span></div></div>
        <CodePreview code={DUOTONE_CODE} language="typescript" />
      </section>

      <section id="flag-icons" className="doc-section">
        <h2>Flag Icons ({filteredFlagNames.length} / {FLAG_NAMES.length})</h2>
        <p className="section-desc">Flag icons are an opt-in collection for locale selectors, regional settings, and internationalized workflows.</p>
        <div className="icon-search flag-search"><Icon name="search" size={16} /><label className="sr-only" htmlFor="flag-search-input">Search flags</label><input id="flag-search-input" value={flagSearchQuery} onChange={event => setFlagSearchQuery(event.target.value)} placeholder={`Search ${FLAG_NAMES.length} flags...`} />{flagSearchQuery && <button type="button" className="icon-search__clear" aria-label="Clear flag search" onClick={() => setFlagSearchQuery('')}><Icon name="x" size={14} /></button>}</div>
        {filteredFlagNames.length > 0 ? <IconGrid names={filteredFlagNames} copiedIcon={copiedIcon} onCopy={copyIcon} ariaLabel="Flag icons" size={28} /> : <p className="no-results">No flags match “{flagSearchQuery}”.</p>}
        <CodePreview code={FLAG_CODE} language="typescript" />
      </section>

      <section id="api" className="doc-section">
        <h2>API</h2>
        <p className="section-desc">Keep icon registration close to the application boundary and pass semantic labels whenever the icon communicates information by itself.</p>
        <table className="token-table"><thead><tr><th>Export</th><th>Use</th></tr></thead><tbody>
          <tr><td><code>Icon</code></td><td>Render a registered SVG icon.</td></tr>
          <tr><td><code>DEFAULT_ICONS</code></td><td>Registry map containing the shared default and duotone icons.</td></tr>
          <tr><td><code>iconSet(...definitions)</code></td><td>Create a registry map from tree-shakeable definitions.</td></tr>
          <tr><td><code>FLAG_ICONS</code></td><td>Optional 200-flag registry map.</td></tr>
        </tbody></table>
      </section>

      {toastMessage && <div className="copy-toast" role="status" aria-live="polite"><Icon name="check" size={16} />{toastMessage}</div>}
    </FoundationPageShell>
  )
}
