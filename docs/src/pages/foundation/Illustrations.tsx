import { Empty } from 'spruce-react'

export function IllustrationsPage() {
  return <>
    <div className="page-header"><p className="page-tag">Foundation</p><h1>Illustrations</h1><p className="page-lead">Illustrations give empty, status, and onboarding states a clear visual language. React uses the Empty component and application-owned artwork so teams can keep illustrations tree-shakeable and brand-specific.</p></div>
    <section id="gallery" className="doc-section"><h2>Illustration Gallery</h2><p className="section-desc">Use illustrations as supportive content in an empty or status state. Keep the visual secondary to the message and next action.</p><div className="principle-card"><Empty title="No items yet" description="Add an item to see it appear here." /></div></section>
    <section id="usage" className="doc-section"><h2>Tree-Shaking &amp; Setup</h2><p className="section-desc">Import only the artwork or empty-state assets used by your application. The React library does not register a global illustration catalog.</p><div className="code-block"><pre><code>{`import { Empty } from 'spruce-react'

<Empty
  title="No projects yet"
  description="Create a project to get started."
/>`}</code></pre></div></section>
    <section id="status-pages" className="doc-section"><h2>Status Pages &amp; Empty States</h2><p className="section-desc">Pair a concise illustration with a specific explanation and a clear recovery action. Do not rely on the illustration alone to communicate status.</p></section>
    <section id="sizing" className="doc-section"><h2>Sizing &amp; Responsive Layout</h2><p className="section-desc">Size artwork relative to the state container. Reduce decorative dimensions on narrow screens while preserving readable copy and touch targets.</p></section>
    <section id="appearance" className="doc-section"><h2>Appearance, Color &amp; Badges</h2><p className="section-desc">Use semantic tokens for illustration accents and keep contrast with the surrounding surface. Status badges and labels should carry the meaning that color or shape cannot.</p></section>
    <section id="api" className="doc-section"><h2>API Reference</h2><table className="token-table" aria-label="Illustration guidance"><thead><tr><th>Surface</th><th>React pattern</th></tr></thead><tbody><tr><td>Empty state</td><td><code>Empty</code> with title, description, and action</td></tr><tr><td>Custom artwork</td><td>Application-owned SVG or image component</td></tr><tr><td>Accessibility</td><td>Meaningful alternative text or decorative <code>aria-hidden</code></td></tr></tbody></table></section>
  </>
}
