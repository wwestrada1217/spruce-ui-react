import { useState } from 'react'
import { Field, Input, Select, type SelectOption } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<Field label="Full name" labelFor="name">
  <Input id="name" value={name} onChange={setName} />
</Field>`

const STATES_CODE = `<Field
  label="Email address"
  labelFor="email"
  required
  helperText="We'll never share your email."
  errorText={error}
>
  <Input id="email" value={email} onChange={setEmail} />
</Field>`

const INLINE_CODE = `<Field label="Workspace" labelFor="workspace" layout="inline" labelWidth="140px">
  <Input id="workspace" value={workspace} onChange={setWorkspace} />
</Field>`

const SELECT_OPTIONS: SelectOption[] = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Product', value: 'product' },
  { label: 'Design', value: 'design' },
]

export function FieldPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('not-an-email')
  const [workspace, setWorkspace] = useState('Spruce')
  const [department, setDepartment] = useState<string | string[]>('engineering')

  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Field</h1>
        <p className="docs-desc">
          A composable accessible wrapper for labels, hints, validation feedback, and responsive field layouts.
        </p>

        <section className="demo-section">
          <h2>Basic controlled field</h2>
          <p className="section-desc">Field preserves the child control’s controlled value and callback contract.</p>
          <CodePreview code={BASIC_CODE} language="typescript">
            <Field label="Full name" labelFor="field-name">
              <Input id="field-name" value={name} onChange={setName} placeholder="Jane Smith" />
            </Field>
          </CodePreview>
        </section>

        <section className="demo-section">
          <h2>Validation and feedback</h2>
          <p className="section-desc">Error feedback wins over helper and success feedback, and is associated with the control.</p>
          <CodePreview code={STATES_CODE} language="typescript">
            <div style={{ display: 'grid', gap: 'var(--sp-space-4)', maxWidth: 480 }}>
              <Field
                label="Email address"
                labelFor="field-email"
                required
                helperText="Use a work address for team notifications."
                errorText="Enter a valid email address."
              >
                <Input id="field-email" value={email} onChange={setEmail} type="email" />
              </Field>
              <Field label="Username" labelFor="field-username" successText="That name is available.">
                <Input id="field-username" value="spruce-user" readOnly />
              </Field>
            </div>
          </CodePreview>
        </section>

        <section className="demo-section">
          <h2>Inline and composed controls</h2>
          <p className="section-desc">Inline fields inherit label width and work with any React child, including lookup controls.</p>
          <CodePreview code={INLINE_CODE} language="typescript">
            <div style={{ display: 'grid', gap: 'var(--sp-space-3)', maxWidth: 560 }}>
              <Field label="Workspace" labelFor="field-workspace" layout="inline" labelWidth="140px">
                <Input id="field-workspace" value={workspace} onChange={setWorkspace} />
              </Field>
              <Field label="Department" labelFor="field-department" layout="inline" required>
                <Select id="field-department" options={SELECT_OPTIONS} value={department} onChange={setDepartment} />
              </Field>
            </div>
          </CodePreview>
        </section>

        <section className="demo-section">
          <h2>API</h2>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Visible label text.</td></tr>
                <tr><td><code>labelFor</code></td><td><code>string</code></td><td>—</td><td>Control id used by the native label association.</td></tr>
                <tr><td><code>required</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the localized required marker and adds <code>aria-required</code>.</td></tr>
                <tr><td><code>helperText</code></td><td><code>string</code></td><td>—</td><td>Hint shown when no error or success is active.</td></tr>
                <tr><td><code>errorText</code> / <code>errors</code></td><td><code>string</code> / <code>FormValidationError[]</code></td><td>—</td><td>Validation feedback with <code>role="alert"</code>.</td></tr>
                <tr><td><code>successText</code></td><td><code>string</code></td><td>—</td><td>Success feedback, suppressed by an error.</td></tr>
                <tr><td><code>invalid</code>, <code>disabled</code>, <code>readOnly</code>, <code>hidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shared state passed to a single child control and context consumers.</td></tr>
                <tr><td><code>layout</code></td><td><code>'vertical' | 'inline'</code></td><td><code>'vertical'</code></td><td>Label placement; parent FormLayout can provide horizontal layout.</td></tr>
                <tr><td><code>labelWidth</code></td><td><code>string</code></td><td><code>120px</code></td><td>Inline label column width.</td></tr>
                <tr><td><code>stackOnMobile</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Stacks inline fields below 640px.</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
