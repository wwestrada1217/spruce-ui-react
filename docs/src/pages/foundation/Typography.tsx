const SIZES = [
  { token: '--sp-text-2xs', value: '10px' },
  { token: '--sp-text-xs', value: '11px' },
  { token: '--sp-text-sm', value: '13px' },
  { token: '--sp-text-base', value: '14px' },
  { token: '--sp-text-md', value: '16px' },
  { token: '--sp-text-lg', value: '18px' },
  { token: '--sp-text-xl', value: '20px' },
  { token: '--sp-text-2xl', value: '24px' },
  { token: '--sp-text-3xl', value: '30px' },
]

const WEIGHTS = [
  { token: '--sp-font-normal', value: '400' },
  { token: '--sp-font-medium', value: '500' },
  { token: '--sp-font-semibold', value: '600' },
  { token: '--sp-font-bold', value: '700' },
]

const USAGE = [
  { token: '--sp-font-body', alias: '--sp-text-base', value: '14px', desc: 'Default body copy and control text' },
  { token: '--sp-font-label', alias: '--sp-text-sm', value: '13px', desc: 'Form labels, table headers, dense UI' },
  { token: '--sp-font-caption', alias: '--sp-text-xs', value: '11px', desc: 'Captions, helper text, timestamps' },
  { token: '--sp-font-heading-sm', alias: '--sp-text-lg', value: '18px', desc: 'Card and section headings' },
  { token: '--sp-font-heading-md', alias: '--sp-text-xl', value: '20px', desc: 'Panel and dialog headings' },
  { token: '--sp-font-heading-lg', alias: '--sp-text-2xl', value: '24px', desc: 'Page titles' },
]

const LEADING = [
  { token: '--sp-leading-none', value: '1' },
  { token: '--sp-leading-tight', value: '1.25' },
  { token: '--sp-leading-snug', value: '1.375' },
  { token: '--sp-leading-normal', value: '1.5' },
  { token: '--sp-leading-relaxed', value: '1.625' },
]

const TRACKING = [
  { token: '--sp-tracking-tight', value: '-0.02em' },
  { token: '--sp-tracking-normal', value: '0' },
  { token: '--sp-tracking-wide', value: '0.04em' },
  { token: '--sp-tracking-wider', value: '0.07em' },
]

export function TypographyPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Typography</h1>
        <p className="page-lead">
          Spruce sets UI text in <strong>Geist</strong>, a geometric-humanist
          sans built for dense interfaces — neutral, crisp, and highly legible
          at 11&ndash;14px. Code and numeric data use its monospace companion,{' '}
          <strong>Geist Mono</strong>. Both are self-hosted variable fonts
          (weights 100&ndash;900), with League Spartan retained as a fallback.
          The full scale is exposed as CSS custom properties.
        </p>
      </div>

      <section className="doc-section">
        <h2>Font Families</h2>
        <div style={{ marginBottom: 'var(--sp-space-4, 16px)' }}>
          <p><code>--sp-font-sans</code> &mdash; Geist</p>
          <p
            style={{
              fontFamily: 'var(--sp-font-sans)',
              fontSize: 'var(--sp-text-lg)',
              marginTop: 'var(--sp-space-1, 4px)',
            }}
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
          </p>
        </div>
        <div>
          <p><code>--sp-font-mono</code> &mdash; Geist Mono</p>
          <p
            style={{
              fontFamily: 'var(--sp-font-mono)',
              fontSize: 'var(--sp-text-lg)',
              marginTop: 'var(--sp-space-1, 4px)',
            }}
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
          </p>
        </div>
      </section>

      <section className="doc-section">
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
                <td style={{ fontSize: `var(${item.token})` }}>
                  The quick brown fox
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="doc-section">
        <h2>Semantic Usage Tokens</h2>
        <p className="section-desc">
          Prefer these role-based aliases over raw sizes — they document intent
          and give the system one place to retune the hierarchy.
        </p>
        <table className="token-table" aria-label="Font usage tokens">
          <thead>
            <tr>
              <th>Token</th>
              <th>Maps to</th>
              <th>Usage</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {USAGE.map(item => (
              <tr key={item.token}>
                <td><code>{item.token}</code></td>
                <td><code>{item.alias}</code> ({item.value})</td>
                <td>{item.desc}</td>
                <td style={{ fontSize: `var(${item.token})` }}>Spruce</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="doc-section">
        <h2>Font Weights</h2>
        <table className="token-table" aria-label="Font weights">
          <thead>
            <tr>
              <th>Token</th>
              <th>Weight</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {WEIGHTS.map(item => (
              <tr key={item.token}>
                <td><code>{item.token}</code></td>
                <td>{item.value}</td>
                <td style={{ fontWeight: `var(${item.token})` }}>
                  The quick brown fox
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="doc-section">
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
                <td style={{ lineHeight: `var(${item.token})`, maxWidth: 360 }}>
                  Line height controls the vertical rhythm of multi-line text
                  and directly affects scanability in dense UI.
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="doc-section">
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
                <td style={{ letterSpacing: `var(${item.token})` }}>
                  SPRUCE DESIGN SYSTEM
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
