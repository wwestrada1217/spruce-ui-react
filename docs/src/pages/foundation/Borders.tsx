import { FoundationPageShell } from '../../components/FoundationPageShell'
import { CodePreview } from '../../components/CodePreview'

const PRINCIPLES = [
  ['Default to hairline', 'Most internal dividers and grid lines should use the hairline width with the default border color so dense UIs stay crisp without heavy rules.'],
  ['Lean on color before width', 'When a divider needs more presence, step up to --sp-border-strong before reaching for a thicker stroke.'],
  ['Use medium width sparingly', 'Reserve the medium width for separators that must read as a distinct band, such as aggregate rows or major section breaks.'],
]

const WIDTHS = [
  { label: 'None', token: '--sp-border-width-none', value: '0', usage: 'Removing borders while keeping border-box sizing stable, or resetting an inherited border.' },
  { label: 'Hairline', token: '--sp-border-width-hairline', value: '1px', usage: 'Default dividers, table and datagrid lines, panel edges, and inline filters.' },
  { label: 'Medium', token: '--sp-border-width-medium', value: '2px', usage: 'Strong horizontal breaks such as aggregate totals, scrollbar inset rails, or emphasized separators.' },
]

const COLORS = [
  ['--sp-border', 'Standard dividers between rows, columns, and lightweight chrome.'],
  ['--sp-border-strong', 'Outer frames, badges, and controls that need clearer separation from adjacent surfaces.'],
  ['--sp-control-border-color', 'Outline drawn around a filled control — button, field, toggle. Transparent by default; a theme sets it to give every control a visible edge.'],
  ['--sp-overlay-border', 'Edge of a floating surface — popover, dropdown panel, menu, picker. Stronger than an in-page divider so a panel that overlaps content reads as a separate layer.'],
  ['--sp-border-focus', 'Focus and selection outlines; typically driven by focus rings rather than layout borders.'],
]

const BEST_PRACTICES = [
  ['Compose width and color', 'Declare borders as width + style + color using tokens, e.g. var(--sp-border-width-hairline) solid var(--sp-border).'],
  ['Give floating panels a visible edge', 'Popovers, dropdown panels, menus, and pickers use var(--sp-overlay-border-width) solid var(--sp-overlay-border) instead of the divider color, so the panel edge stays findable against the content behind it.'],
  ['Theme via colors', 'Light and dark themes remap border colors; widths stay stable so layouts do not shift between themes.'],
  ['Mirror tokens in code when needed', 'Use SPRUCE_BORDERS.width for canvas or chart code paths that cannot read CSS variables directly.'],
]

const USAGE_CSS = `.panel {
  border: var(--sp-border-width-hairline) solid var(--sp-border);
  border-radius: var(--sp-radius-lg);
}

section.major-break {
  border-top: var(--sp-border-width-medium) solid var(--sp-border-strong);
}`

const USAGE_TS = `import { SPRUCE_BORDERS } from 'spruce-react'

canvasContext.lineWidth = SPRUCE_BORDERS.width.medium
canvasContext.strokeStyle = getComputedStyle(element)
  .getPropertyValue('--sp-border-strong')`

export function BordersPage() {
  return (
    <FoundationPageShell variant="borders" title="Borders" description="Border width and color tokens keep dividers, table chrome, and panel frames consistent. Pair width tokens with the border color scale so light and dark themes stay aligned without re-tuning every component.">
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Borders</h1>
        <p className="page-lead">Border width and color tokens keep dividers, table chrome, and panel frames consistent. Pair width tokens with the border color scale so light and dark themes stay aligned without re-tuning every component.</p>
      </div>

      <section id="overview" className="doc-section">
        <h2>Overview</h2>
        <p className="section-desc">Most Spruce surfaces separate with a hairline stroke and a subtle border color. Stronger lines call for the strong border token, not a heavier width. Reserve the medium width for section breaks, aggregate bars, and other emphasis that should read clearly at a glance.</p>
        <div className="principles-grid">{PRINCIPLES.map(([title, body]) => <article key={title} className="principle-card"><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section id="widths" className="doc-section">
        <h2>Border widths</h2>
        <p className="section-desc">Width tokens are defined in <code>@spruce-ui/components/tokens</code> (<code>_borders.scss</code>) and exposed as CSS custom properties on <code>:root</code>. They do not change between light and dark mode; theme switching adjusts border <em>colors</em> only.</p>
        <div className="width-grid">
          {WIDTHS.map(item => <article key={item.token} className="width-card">
            <div className="width-card__preview-wrap">
              <div className="width-card__preview" style={{ border: `${item.value} solid var(--sp-border-strong)` }}>
                <span>{item.label}</span>
              </div>
            </div>
            <div className="width-card__body">
              <div className="width-card__row"><strong><code>{item.token}</code></strong><span>{item.value}</span></div>
              <p>{item.usage}</p>
            </div>
          </article>)}
        </div>
      </section>

      <section id="colors" className="doc-section">
        <h2>Border colors</h2>
        <p className="section-desc">Color tokens live alongside surfaces in the theme. Use the default border for most dividers; use the strong token for outer frames, pagination chrome, and emphasis where the hairline would disappear against busy backgrounds.</p>
        <div className="swatch-row">
          {COLORS.map(([token, usage]) => <article key={token} className="swatch-card">
            <div className="swatch-card__frame" style={{ border: `var(--sp-border-width-hairline) solid var(${token})` }} />
            <div className="swatch-card__body"><code>{token}</code><p>{usage}</p></div>
          </article>)}
        </div>
      </section>

      <section id="components" className="doc-section">
        <h2>Components</h2>
        <p className="section-desc">The datagrid maps foundation widths to local aliases (<code>--grid-stroke</code>, <code>--grid-stroke-md</code>) so row lines, headers, and toolbars share one stroke scale. See <a href="#/components/datagrid">Datagrid</a> for full API and examples.</p>
      </section>

      <section id="usage" className="doc-section">
        <h2>Usage</h2>
        <p className="section-desc">Prefer composing width and color tokens instead of hard-coding <code>1px</code> or raw RGBA values. For programmatic access (charts, canvas), use <code>SPRUCE_BORDERS</code> from <code>@spruce-ui/components/tokens</code>.</p>
        <div className="usage-grid">
          <article className="code-card"><h3>CSS</h3><CodePreview codeOnly language="css" code={USAGE_CSS} /></article>
          <article className="code-card"><h3>TypeScript</h3><CodePreview codeOnly language="typescript" code={USAGE_TS} /></article>
          <article className="guidance-card"><h3>Best practices</h3><div className="best-practices">{BEST_PRACTICES.map(([title, body]) => <div key={title} className="best-practice-item"><strong>{title}</strong><p>{body}</p></div>)}</div></article>
        </div>
      </section>
    </FoundationPageShell>
  )
}
