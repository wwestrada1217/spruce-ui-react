import { Button, Empty } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import { FoundationPageShell } from '../../components/FoundationPageShell'

const EMPTY_CODE = `<Empty
  icon="file-dt"
  title="No projects yet"
  description="Create a project to get started."
>
  <Button variant="primary">Create project</Button>
</Empty>`

export function IllustrationsPage() {
  return <FoundationPageShell variant="illustrations" title="Illustrations" description="A visual language for status pages, empty states, HR, payroll, finance, and technology. Use illustrations as supportive content while keeping the message and next action clear.">
    <div className="page-header"><p className="page-tag">Foundation</p><h1>Illustrations</h1><p className="page-lead">Illustrations give empty, status, and onboarding states a clear visual language. React uses the Empty component and application-owned artwork so teams can keep illustrations tree-shakeable and brand-specific.</p></div>
    <section id="gallery" className="doc-section"><h2>Illustration Gallery</h2><p className="section-desc">Use illustrations as supportive content in an empty or status state. Keep the visual secondary to the message and next action.</p><CodePreview code={EMPTY_CODE} language="typescript"><div className="illustration-live-card"><Empty icon="file-dt" title="No projects yet" description="Create a project to get started."><Button variant="primary">Create project</Button></Empty></div></CodePreview></section>
    <section id="usage" className="doc-section"><h2>Tree-Shaking &amp; Setup</h2><p className="section-desc">Import only the artwork or empty-state assets used by your application. The React library does not register a global illustration catalog.</p><CodePreview codeOnly language="typescript" code={EMPTY_CODE} /></section>
    <section id="status-pages" className="doc-section"><h2>Status Pages &amp; Empty States</h2><p className="section-desc">Pair a concise illustration with a specific explanation and a clear recovery action. Do not rely on the illustration alone to communicate status.</p><div className="status-card-demo"><Empty icon="check-circle" title="All systems operational" description="There are no incidents affecting your workspace." /><Button variant="secondary">Back to dashboard</Button></div></section>
    <section id="sizing" className="doc-section"><h2>Sizing &amp; Responsive Layout</h2><p className="section-desc">Size artwork relative to the state container. Reduce decorative dimensions on narrow screens while preserving readable copy and touch targets.</p><div className="illustration-size-row"><Empty size="sm" icon="search" title="Small" /><Empty icon="search" title="Medium" /><Empty size="lg" icon="search" title="Large" /></div></section>
    <section id="appearance" className="doc-section"><h2>Appearance, Color &amp; Badges</h2><p className="section-desc">Use semantic tokens for illustration accents and keep contrast with the surrounding surface. Status badges and labels should carry the meaning that color or shape cannot.</p><div className="illustration-appearance"><span className="illustration-badge illustration-badge--success">Success</span><span className="illustration-badge illustration-badge--warning">Needs review</span><span className="illustration-badge illustration-badge--danger">Action required</span></div></section>
    <section id="api" className="doc-section"><h2>API Reference</h2><table className="token-table" aria-label="Illustration guidance"><thead><tr><th>Surface</th><th>React pattern</th></tr></thead><tbody><tr><td>Empty state</td><td><code>Empty</code> with title, description, and action</td></tr><tr><td>Custom artwork</td><td>Application-owned SVG or image component</td></tr><tr><td>Accessibility</td><td>Meaningful alternative text or decorative <code>aria-hidden</code></td></tr></tbody></table></section>
  </FoundationPageShell>
}
