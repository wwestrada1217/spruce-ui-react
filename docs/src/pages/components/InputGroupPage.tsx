import { useState } from 'react'
import {
  InputGroup,
  InputGroupActions,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupSpacer,
} from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<InputGroup ariaLabel="Username">
  <InputGroupAddon>@</InputGroupAddon>
  <InputGroupInput value={username} onChange={(event) => setUsername(event.target.value)} />
</InputGroup>`

const COMPOSITION_CODE = `<InputGroup layout="composition" ariaLabel="Prompt">
  <InputGroupInput as="textarea" value={prompt} onChange={(event) => setPrompt(event.target.value)} />
  <InputGroupActions>
    <InputGroupButton variant="ghost" ariaLabel="Attach">+</InputGroupButton>
    <InputGroupSpacer />
    <InputGroupButton variant="soft" onClick={send}>Send</InputGroupButton>
  </InputGroupActions>
</InputGroup>`

export function InputGroupPage() {
  const [username, setUsername] = useState('spruce')
  const [prompt, setPrompt] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Input Group</h1>
        <p className="docs-desc">Compose native inputs and textareas with addons, separators, and accessible actions in one tokenized frame.</p>

        <section className="demo-section">
          <h2>Prefix, suffix, and action</h2>
          <p className="section-desc">InputGroupInput is controlled with normal native input callbacks.</p>
          <CodePreview code={BASIC_CODE} language="typescript">
            <div style={{ display: 'grid', gap: 'var(--sp-space-3)', maxWidth: 520 }}>
              <InputGroup ariaLabel="Username">
                <InputGroupAddon>@</InputGroupAddon>
                <InputGroupInput value={username} onChange={(event) => setUsername(event.target.value)} />
                <InputGroupButton onClick={() => setUsername('')}>Clear</InputGroupButton>
              </InputGroup>
              <InputGroup ariaLabel="Website">
                <InputGroupInput placeholder="workspace" />
                <InputGroupAddon>.spruce.app</InputGroupAddon>
              </InputGroup>
            </div>
          </CodePreview>
        </section>

        <section className="demo-section">
          <h2>Composition layout</h2>
          <p className="section-desc">Composition stacks the control and action row for prompt and composer surfaces.</p>
          <CodePreview code={COMPOSITION_CODE} language="typescript">
            <div style={{ display: 'grid', gap: 'var(--sp-space-2)', maxWidth: 680 }}>
              <InputGroup layout="composition" size="lg" ariaLabel="Prompt">
                <InputGroupInput as="textarea" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="How can I help?" />
                <InputGroupActions>
                  <InputGroupButton iconOnly variant="ghost" ariaLabel="Attach">+</InputGroupButton>
                  <InputGroupSpacer />
                  <InputGroupButton variant="soft" onClick={() => setSent(true)}>Send</InputGroupButton>
                </InputGroupActions>
              </InputGroup>
              {sent && <p className="section-desc" role="status">Prompt sent.</p>}
            </div>
          </CodePreview>
        </section>

        <section className="demo-section">
          <h2>States and API</h2>
          <div style={{ display: 'grid', gap: 'var(--sp-space-3)', maxWidth: 520 }}>
            <InputGroup invalid ariaLabel="Invalid amount">
              <InputGroupAddon>$</InputGroupAddon>
              <InputGroupInput value="0" onChange={() => undefined} aria-invalid="true" />
            </InputGroup>
            <InputGroup disabled ariaLabel="Disabled token">
              <InputGroupAddon>🔒</InputGroupAddon>
              <InputGroupInput value="Locked token" readOnly onChange={() => undefined} />
              <InputGroupButton disabled>Copy</InputGroupButton>
            </InputGroup>
          </div>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Component</th><th>Props</th><th>Behavior</th></tr></thead>
              <tbody>
                <tr><td><code>InputGroup</code></td><td><code>size</code>, <code>layout</code>, <code>disabled</code>, <code>invalid</code></td><td>Owns frame, focus, density, composition, and inherited state.</td></tr>
                <tr><td><code>InputGroupInput</code></td><td>Native input/textarea props; <code>as="textarea"</code></td><td>Controlled value and native callbacks; group state is reflected in ARIA.</td></tr>
                <tr><td><code>InputGroupAddon</code></td><td><code>children</code></td><td>Prefix or suffix text/icons with optional background/separator chrome.</td></tr>
                <tr><td><code>InputGroupActions</code></td><td><code>align</code></td><td>Action row for composition layouts.</td></tr>
                <tr><td><code>InputGroupSpacer</code></td><td>—</td><td>Flexible layout spacer, hidden from assistive technology.</td></tr>
                <tr><td><code>InputGroupButton</code></td><td><code>type</code>, <code>disabled</code>, <code>ariaLabel</code>, <code>variant</code>, <code>iconOnly</code></td><td>Native keyboard button with <code>onClick</code>; icon-only buttons require a label.</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
