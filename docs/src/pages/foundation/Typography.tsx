import { FoundationPageShell } from '../../components/FoundationPageShell'
import { CodePreview } from '../../components/CodePreview'

const USAGE_CODE = `.page-title {
  font: var(--sp-font-heading-xl) / var(--sp-leading-tight) var(--sp-font-sans);
  letter-spacing: var(--sp-tracking-tight);
}`

const SIZES = [
  { token: '--sp-text-2xs', value: '10px' },
  { token: '--sp-text-xs', value: '12px' },
  { token: '--sp-text-sm', value: '13px' },
  { token: '--sp-text-base', value: '14px' },
  { token: '--sp-text-md', value: '16px' },
  { token: '--sp-text-lg', value: '18px' },
  { token: '--sp-text-xl', value: '20px' },
  { token: '--sp-text-2xl', value: '24px' },
  { token: '--sp-text-3xl', value: '30px' },
  { token: '--sp-text-4xl', value: '36px' },
  { token: '--sp-text-5xl', value: '48px' },
  { token: '--sp-text-6xl', value: '60px' },
]

const WEIGHTS = [
  { token: '--sp-font-light', value: '300' },
  { token: '--sp-font-normal', value: '400' },
  { token: '--sp-font-regular', value: '400' },
  { token: '--sp-font-medium', value: '500' },
  { token: '--sp-font-semibold', value: '600' },
  { token: '--sp-font-bold', value: '700' },
  { token: '--sp-font-extrabold', value: '800' },
]

const USAGE = [
  { token: '--sp-font-body', alias: '--sp-text-base', value: '14px', desc: 'Default body copy and control text' },
  { token: '--sp-font-body-lg', alias: '--sp-text-md', value: '16px', desc: 'Large body copy and reading surfaces' },
  { token: '--sp-font-heading-xs', alias: '--sp-text-md', value: '16px', desc: 'Small headings and dense section labels' },
  { token: '--sp-font-label', alias: '--sp-text-sm', value: '13px', desc: 'Form labels, table headers, dense UI' },
  { token: '--sp-font-caption', alias: '--sp-text-xs', value: '11px', desc: 'Captions, helper text, timestamps' },
  { token: '--sp-font-heading-sm', alias: '--sp-text-lg', value: '18px', desc: 'Card and section headings' },
  { token: '--sp-font-heading-md', alias: '--sp-text-xl', value: '20px', desc: 'Panel and dialog headings' },
  { token: '--sp-font-heading-lg', alias: '--sp-text-2xl', value: '24px', desc: 'Page titles' },
  { token: '--sp-font-heading-xl', alias: '--sp-text-3xl', value: '30px', desc: 'Large page and product titles' },
  { token: '--sp-font-display-sm', alias: '--sp-text-4xl', value: '36px', desc: 'Display heading, small' },
  { token: '--sp-font-display-md', alias: '--sp-text-5xl', value: '48px', desc: 'Display heading, medium' },
  { token: '--sp-font-display-lg', alias: '--sp-text-6xl', value: '60px', desc: 'Display heading, large' },
]

const LEADING = [
  { token: '--sp-leading-none', value: '1' },
  { token: '--sp-leading-tight', value: '1.25' },
  { token: '--sp-leading-snug', value: '1.375' },
  { token: '--sp-leading-normal', value: '1.5' },
  { token: '--sp-leading-relaxed', value: '1.625' },
]

const TRACKING = [
  { token: '--sp-tracking-tighter', value: '-0.035em' },
  { token: '--sp-tracking-tight', value: '-0.02em' },
  { token: '--sp-tracking-normal', value: '0' },
  { token: '--sp-tracking-wide', value: '0.04em' },
  { token: '--sp-tracking-wider', value: '0.07em' },
  { token: '--sp-tracking-widest', value: '0.1em' },
]

export function TypographyPage() {
  return (
    <FoundationPageShell variant="typography" title="Typography" description="Typography tokens define readable hierarchy for interface chrome, dense data, long-form body copy, and code-oriented surfaces. The scale is deliberately compact so enterprise workflows can remain information rich without feeling cramped.">
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Typography</h1>
        <p className="page-lead">
          Typography tokens define readable hierarchy for interface chrome, dense data, long-form
          body copy, and code-oriented surfaces. The scale is deliberately compact so enterprise
          workflows can remain information rich without feeling cramped.
        </p>
      </div>

      <section id="overview" className="doc-section">
        <h2>Overview</h2>
        <p className="section-desc">Use the typography scale to establish rank, rhythm, and legibility. A consistent type system keeps tables, forms, navigation, and documentation aligned even when components vary in density or available space.</p>
        <div className="principles-grid">
          <article className="principle-card"><h3>Hierarchy over novelty</h3><p>Use type to rank information clearly. Size and weight should help users scan faster, not create visual noise.</p></article>
          <article className="principle-card"><h3>Compact by default</h3><p>The scale is tuned for product UI, dense tables, and operational screens where clarity matters more than dramatic contrast.</p></article>
          <article className="principle-card"><h3>Semantic roles win</h3><p>Assign tokens to roles like title, body, caption, or code rather than styling each component independently.</p></article>
        </div>
      </section>

      <section id="type-scale" className="doc-section">
        <h2>Type Scale</h2>
        <table className="token-table" aria-label="Type scale">
          <thead>
            <tr>
              <th>Token</th>
              <th>Size</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {SIZES.map(item => (
              <tr key={item.token}>
                <td><code>{item.token}</code></td>
                <td>{item.value}</td>
                <td><div className="type-preview"><div className="type-preview__sample" style={{ fontSize: `var(${item.token})` }}>The quick brown fox</div><span className="type-preview__meta">{item.value} · interface type scale</span></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="font-weights" className="doc-section">
        <h2>Font Weights</h2>
        <div className="weights-grid">
          {WEIGHTS.map(item => <article key={item.token} className="weight-card"><div className="weight-card__header"><strong>{item.token.replace('--sp-font-', '').replace('-', ' ')}</strong><span>{item.value}</span></div><code>{item.token}</code><p className="weight-card__sample" style={{ fontWeight: `var(${item.token})` }}>Interface hierarchy stays readable when weight changes are intentional.</p><p className="weight-card__usage">Use weight changes for emphasis before jumping to a larger type token.</p></article>)}
        </div>
      </section>

      <section id="families" className="doc-section">
        <h2>Font Families</h2>
        <div className="family-grid">
          {[
            ['Sans', '--sp-font-sans', 'Noto Sans', 'Application UI, forms, navigation, and prose.'],
            ['Mono', '--sp-font-mono', 'Noto Sans Mono', 'Code, tabular data, and technical references.'],
          ].map(([label, token, value, usage]) => <article key={token} className="family-card"><div className="family-card__header"><div><h3>{label}</h3><code>{token}</code></div><span className="family-card__value">{value}</span></div><p className="family-card__sample" style={{ fontFamily: `var(${token})` }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789 !@#$%^&amp;*()</p><p className="family-card__usage">{usage}</p></article>)}
        </div>
      </section>

      <section id="line-heights" className="doc-section">
        <h2>Line Heights</h2>
        <table className="token-table" aria-label="Line heights">
          <thead>
            <tr>
              <th>Token</th>
              <th>Value</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {LEADING.map(item => (
              <tr key={item.token}>
                <td><code>{item.token}</code></td>
                <td>{item.value}</td>
                <td><div className="type-preview"><div className="type-preview__sample" style={{ lineHeight: `var(${item.token})`, maxWidth: 360 }}>Line height controls the vertical rhythm of multi-line text and directly affects scanability in dense UI.</div><span className="type-preview__meta">{item.value} leading</span></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="letter-spacing" className="doc-section">
        <h2>Letter Spacing</h2>
        <table className="token-table" aria-label="Letter spacing">
          <thead>
            <tr>
              <th>Token</th>
              <th>Value</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {TRACKING.map(item => (
              <tr key={item.token}>
                <td><code>{item.token}</code></td>
                <td>{item.value}</td>
                <td><div className="type-preview"><div className="type-preview__sample" style={{ letterSpacing: `var(${item.token})` }}>SPRUCE DESIGN SYSTEM</div><span className="type-preview__meta">{item.value} tracking</span></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="semantic-roles" className="doc-section">
        <h2>Semantic Roles</h2>
        <p className="section-desc">Prefer these role-based aliases over raw sizes — they document intent and give the system one place to retune the hierarchy.</p>
        <table className="token-table" aria-label="Font usage tokens"><thead><tr><th>Token</th><th>Maps to</th><th>Usage</th><th>Preview</th></tr></thead><tbody>{USAGE.map(item => <tr key={item.token}><td><code>{item.token}</code></td><td><code>{item.alias}</code> ({item.value})</td><td>{item.desc}</td><td style={{ fontSize: `var(${item.token})` }}>Spruce</td></tr>)}</tbody></table>
      </section>

      <section id="usage" className="doc-section">
        <h2>Usage</h2>
        <p className="section-desc">Prefer semantic role tokens over raw sizes. This keeps intent visible in component styles and gives themes one place to retune the hierarchy.</p>
        <CodePreview codeOnly language="css" code={USAGE_CODE} />
      </section>
    </FoundationPageShell>
  )
}
