import { useRef, useState } from 'react'
import { Button, Fullscreen, type FullscreenHandle } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const CODE = `<Fullscreen ref={fullscreenRef} mode="overlay">
  <Button onClick={() => fullscreenRef.current?.toggle()}>Toggle</Button>
</Fullscreen>`

export function FullscreenPage() {
  const fullscreenRef = useRef<FullscreenHandle>(null)
  const [active, setActive] = useState(false)
  return <div className="features-layout"><div className="features-main"><h1>Fullscreen</h1><p className="docs-desc">Controlled or imperative fullscreen behavior with overlay, native browser, and class-only modes.</p>
    <section id="basic" className="demo-section"><h2>Overlay</h2><CodePreview code={CODE}><Fullscreen ref={fullscreenRef} active={active} onActiveChange={setActive} style={{ padding: 20, minHeight: 100, border: '1px solid var(--sp-border-subtle)', borderRadius: 8 }}><Button onClick={() => fullscreenRef.current?.toggle()}>{active ? 'Exit fullscreen' : 'Enter fullscreen'}</Button><p>Press Escape to exit.</p></Fullscreen></CodePreview></section>
    <section id="native" className="demo-section"><h2>Native and class modes</h2><p className="section-desc">Set <code>mode="native"</code> to use the Fullscreen API, or <code>mode="class"</code> to let CSS own the presentation while retaining the active state.</p></section>
    <section id="api" className="demo-section"><h2>API</h2><div className="api-table-wrap"><table className="api-table"><thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead><tbody><tr><td><code>active / onActiveChange</code></td><td><code>boolean / callback</code></td><td>uncontrolled</td></tr><tr><td><code>mode</code></td><td><code>'overlay' | 'native' | 'class'</code></td><td><code>'overlay'</code></td></tr><tr><td><code>exitOnEscape</code></td><td><code>boolean</code></td><td><code>true</code></td></tr></tbody></table></div></section>
  </div><nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{['basic', 'native', 'api'].map((id) => <li key={id}><a className="toc-link" href={`#${id}`}>{id}</a></li>)}</ul></nav></div>
}
