import { useState } from 'react'
import { Button, ContentTransition, FlipCard } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { DocsPackageBadge } from '../../components/DocsPackageBadge'

const face = { padding: 24, border: '1px solid var(--sp-border)', borderRadius: 'var(--sp-radius-lg)', background: 'var(--sp-surface-raised)' }

export function ContentTransitionPage() {
  const [active, setActive] = useState(false)
  return <div className="features-layout"><main className="features-main"><h1>Content Transition &amp; Flip Card</h1><p className="docs-desc">Switch between two accessible content faces with flip, fade, slide, and zoom motion.</p><DocsPackageBadge packageName="spruce-react" symbols={['ContentTransition', 'FlipCard']} />
    <section className="demo-section"><h2>Click flip card</h2><CodePreview code={'<FlipCard front={front} back={back} trigger="click" />'}><FlipCard width={320} height={160} trigger="click" ariaLabel="Reveal account details" front={<div style={face}><h3>Account</h3><p>Click or press Enter to reveal details.</p></div>} back={<div style={face}><h3>Details</h3><p>Keyboard and screen-reader visibility are managed.</p></div>} /></CodePreview></section>
    <section className="demo-section"><h2>Manual control</h2><CodePreview code={'<ContentTransition active={active} onActiveChange={setActive} trigger="manual" type="slide-left" />'}><div style={{ display: 'grid', gap: 12, maxWidth: 420 }}><ContentTransition active={active} onActiveChange={setActive} trigger="manual" type="slide-left" front={<div style={face}>Front content</div>} back={<div style={face}>Back content</div>} /><Button onClick={() => setActive((current) => !current)}>Toggle content</Button></div></CodePreview></section>
    <section className="demo-section"><h2>API</h2><div className="api-table-wrap"><table className="api-table"><thead><tr><th>Props</th><th>Purpose</th></tr></thead><tbody><tr><td><code>front / back</code></td><td>React nodes or render functions.</td></tr><tr><td><code>type / transitionType</code></td><td>Flip, crossfade, four slide directions, or zoom.</td></tr><tr><td><code>trigger / transitionTrigger</code></td><td>Hover, click, focus, or manual.</td></tr><tr><td><code>active / defaultActive</code></td><td>Controlled or uncontrolled face state.</td></tr><tr><td><code>duration / perspective</code></td><td>Motion timing and 3D depth.</td></tr></tbody></table></div></section>
  </main></div>
}
