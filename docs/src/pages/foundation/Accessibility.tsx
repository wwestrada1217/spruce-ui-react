const PRINCIPLES = [
  ['Semantic structure', 'Prefer native elements and expose the correct role, name, value, and state.'],
  ['Keyboard operation', 'Every interactive state is reachable, visible, and usable without a pointer.'],
  ['Focus visibility', 'Use the Precision Glow tokens and never remove the browser focus indicator without a replacement.'],
  ['Theme resilience', 'Check contrast and focus treatment in both light and dark themes.'],
  ['Reduced motion', 'Let motion tokens collapse under prefers-reduced-motion and the manual data-reduce-motion override.'],
]

const CHECKS = [
  ['Static review', 'Run TypeScript, lint, and accessibility rules before visual review.'],
  ['Keyboard pass', 'Tab through the surface, operate controls, dismiss overlays, and restore focus.'],
  ['Screen reader pass', 'Verify labels, descriptions, announcements, and error associations.'],
  ['Theme pass', 'Review light, dark, density scopes, and high-contrast content.'],
]

export function AccessibilityPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Accessibility</h1>
        <p className="page-lead">
          Accessibility is part of every Spruce component contract: semantic
          structure, keyboard behavior, visible focus, understandable labels,
          and resilient presentation across themes and motion preferences.
        </p>
      </div>

      <section className="doc-section">
        <h2>Principles</h2>
        <div className="principles-grid">
          {PRINCIPLES.map(([title, body]) => (
            <article key={title} className="principle-card">
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2>Focus and motion tokens</h2>
        <p className="section-desc">
          Custom controls should use <code>.sp-focus-ring</code> or the
          <code>--sp-focus-*</code> tokens. Motion should consume
          <code>--sp-duration-*</code> and <code>--sp-motion-*</code> so both
          operating-system and manual reduced-motion settings work.
        </p>
        <div className="code-block">
          <pre><code>{`.custom-control:focus-visible {
  outline: var(--sp-focus-ring-width) solid var(--sp-focus-ring-color);
  outline-offset: var(--sp-focus-ring-offset);
}`}</code></pre>
        </div>
      </section>

      <section className="doc-section">
        <h2>Verification workflow</h2>
        <table className="token-table" aria-label="Accessibility verification workflow">
          <thead><tr><th>Step</th><th>Verify</th></tr></thead>
          <tbody>
            {CHECKS.map(([step, verify]) => (
              <tr key={step}><td>{step}</td><td>{verify}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
