import { useState } from 'react'
import { HideOnScroll } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const CODE = `<HideOnScroll threshold={12} idleReveal={300}>
  <header>Scroll-aware toolbar</header>
</HideOnScroll>`

export function HideOnScrollPage() {
  const [hidden, setHidden] = useState(false)
  return <div className="features-layout"><div className="features-main"><h1>Hide on Scroll</h1><p className="docs-desc">Reveal-on-up scroll behavior for toolbars and headers, with threshold tuning, idle reveal, focus reveal, and nearest-scroll-parent detection.</p>
    <section id="basic" className="demo-section"><h2>Basic</h2><CodePreview code={CODE}><div style={{ height: 180, overflow: 'auto', border: '1px solid var(--sp-border-subtle)', borderRadius: 8 }}><HideOnScroll onHiddenChange={setHidden} style={{ position: 'sticky', top: 0, padding: 12, background: 'var(--sp-surface-2)', zIndex: 1 }}><strong>Toolbar</strong> <span aria-live="polite">{hidden ? 'hidden' : 'visible'}</span></HideOnScroll><div style={{ height: 500, padding: 16 }}>Scroll down to hide, up to reveal. Focused descendants reveal it again.</div></div></CodePreview></section>
    <section id="tuning" className="demo-section"><h2>Tuning and disabling</h2><p className="section-desc">Use <code>threshold</code>, <code>idleReveal</code>, <code>disabled</code>, or an explicit <code>scroller</code> element for nested scroll containers.</p></section>
    <section id="positioning" className="demo-section"><h2>Positioning</h2><p className="section-desc">The component owns transform only; position it with the parent, typically using sticky or fixed positioning.</p></section>
    <section id="api" className="demo-section"><h2>API</h2><div className="api-table-wrap"><table className="api-table"><thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead><tbody><tr><td><code>threshold</code></td><td><code>number</code></td><td><code>8</code></td></tr><tr><td><code>idleReveal</code></td><td><code>number</code></td><td><code>200</code> ms</td></tr><tr><td><code>onHiddenChange</code></td><td><code>(hidden) =&gt; void</code></td><td>—</td></tr></tbody></table></div></section>
  </div><nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{['basic', 'tuning', 'positioning', 'api'].map((id) => <li key={id}><a className="toc-link" href={`#${id}`}>{id}</a></li>)}</ul></nav></div>
}
