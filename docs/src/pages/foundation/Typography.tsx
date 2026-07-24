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

export function TypographyPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Typography</h1>
        <p className="page-lead">
          Type scale, font families, weights, and line heights — all exposed as
          CSS custom properties.
        </p>
      </div>

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
                <td>{item.token}</td>
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
                <td>{item.token}</td>
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
        <h2>Font Families</h2>
        <div style={{ marginBottom: 'var(--sp-space-4, 16px)' }}>
          <p><code>--sp-font-sans</code></p>
          <p
            style={{
              fontFamily: 'var(--sp-font-sans)',
              fontSize: 'var(--sp-text-md)',
              marginTop: 'var(--sp-space-1, 4px)',
            }}
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
          </p>
        </div>
        <div>
          <p><code>--sp-font-mono</code></p>
          <p
            style={{
              fontFamily: 'var(--sp-font-mono)',
              fontSize: 'var(--sp-text-md)',
              marginTop: 'var(--sp-space-1, 4px)',
            }}
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
          </p>
        </div>
      </section>
    </>
  )
}
