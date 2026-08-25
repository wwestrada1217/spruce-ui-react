import { FormLayout, Field, Input, Button } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const GRID_CODE = `<FormLayout layout="grid" columns={2} responsive>
  <Field label="First name" labelFor="first-name"><Input id="first-name" /></Field>
  <Field label="Last name" labelFor="last-name"><Input id="last-name" /></Field>
  <Field label="Email" labelFor="email" className="sp-form__full"><Input id="email" /></Field>
  <div className="sp-form__actions sp-form__actions--end sp-form__full">
    <Button variant="outline">Cancel</Button>
    <Button variant="primary" type="submit">Save</Button>
  </div>
</FormLayout>`

const HORIZONTAL_CODE = `<FormLayout layout="horizontal" labelWidth="160px">
  <Field label="Project name" labelFor="project"><Input id="project" /></Field>
  <Field label="Description" labelFor="description"><Textarea id="description" /></Field>
</FormLayout>`

export function FormLayoutPage() {
  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Form Layout</h1>
        <p className="docs-desc">Tokenized layout primitives for vertical, horizontal, compact, and responsive multi-column forms.</p>

        <section className="demo-section">
          <h2>Grid and responsive layout</h2>
          <p className="section-desc">Use <code>sp-form__full</code> for content that spans every grid column.</p>
          <CodePreview code={GRID_CODE} language="typescript">
            <FormLayout layout="grid" columns={2} responsive as="form" onSubmit={(event) => event.preventDefault()}>
              <Field label="First name" labelFor="layout-first" required><Input id="layout-first" placeholder="Jane" /></Field>
              <Field label="Last name" labelFor="layout-last" required><Input id="layout-last" placeholder="Smith" /></Field>
              <Field label="Email" labelFor="layout-email" className="sp-form__full"><Input id="layout-email" type="email" placeholder="you@example.com" /></Field>
              <div className="sp-form__actions sp-form__actions--end sp-form__full">
                <Button variant="outline">Cancel</Button>
                <Button variant="primary" type="submit">Save</Button>
              </div>
            </FormLayout>
          </CodePreview>
        </section>

        <section className="demo-section">
          <h2>Inherited horizontal labels</h2>
          <p className="section-desc">Fields use the nearest FormLayout context when their own layout remains vertical.</p>
          <CodePreview code={HORIZONTAL_CODE} language="typescript">
            <FormLayout layout="horizontal" labelWidth="160px" style={{ maxWidth: 560 }}>
              <Field label="Project name" labelFor="layout-project"><Input id="layout-project" value="Spruce" onChange={() => undefined} /></Field>
              <Field label="Owner" labelFor="layout-owner"><Input id="layout-owner" value="Design systems" onChange={() => undefined} /></Field>
            </FormLayout>
          </CodePreview>
        </section>

        <section className="demo-section">
          <h2>Modes, gaps, and helper classes</h2>
          <p className="section-desc">The layout maps Angular’s CSS helper contract directly to class names usable with any React children.</p>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Prop/class</th><th>Values</th><th>Behavior</th></tr></thead>
              <tbody>
                <tr><td><code>layout</code></td><td><code>vertical | horizontal | compact | grid</code></td><td>Container mode and Field inheritance.</td></tr>
                <tr><td><code>columns</code></td><td><code>1 | 2 | 3 | 4</code></td><td>Grid column count.</td></tr>
                <tr><td><code>gap</code></td><td><code>sm | md | lg</code></td><td>8px, 16px, or 24px tokenized spacing.</td></tr>
                <tr><td><code>labelWidth</code></td><td><code>string</code></td><td>Inherited inline label column width.</td></tr>
                <tr><td><code>responsive</code></td><td><code>boolean</code></td><td>Collapses grid rows and horizontal fields at 640px.</td></tr>
                <tr><td><code>sp-form__section-title</code></td><td>class</td><td>Section heading; spans grid columns.</td></tr>
                <tr><td><code>sp-form__row sp-form__row--2/3/4</code></td><td>class</td><td>Horizontal sub-grid outside grid mode.</td></tr>
                <tr><td><code>sp-form__full</code></td><td>class</td><td>Full-width grid child.</td></tr>
                <tr><td><code>sp-form__divider</code></td><td>class</td><td>Tokenized divider.</td></tr>
                <tr><td><code>sp-form__actions--end/between</code></td><td>class</td><td>Action alignment helpers.</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
