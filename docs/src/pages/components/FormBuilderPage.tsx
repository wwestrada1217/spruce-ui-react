import { useRef, useState } from 'react';
import { FormBuilder, type FormBuilderHandle, type FormBuilderSchema } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const INITIAL_SCHEMA: FormBuilderSchema = {
  sections: [{
    id: 'contact',
    title: 'Contact information',
    cols: 12,
    fields: [
      { id: 'first-name', name: 'firstName', type: 'text', label: 'First name', required: true, x: 0, y: 0, w: 6, h: 2 },
      { id: 'last-name', name: 'lastName', type: 'text', label: 'Last name', required: true, x: 6, y: 0, w: 6, h: 2 },
      { id: 'email', name: 'email', type: 'email', label: 'Email', required: true, x: 0, y: 2, w: 8, h: 2 },
      { id: 'bio', name: 'bio', type: 'textarea', label: 'Bio', helperText: 'Tell us about yourself', x: 0, y: 4, w: 12, h: 3 },
    ],
  }],
};

const BASIC_CODE = `const [schema, setSchema] = useState<FormBuilderSchema>(initialSchema);
const [value, setValue] = useState<Record<string, unknown>>({});

<FormBuilder
  schema={schema}
  onSchemaChange={setSchema}
  value={value}
  onValueChange={setValue}
/>`;

export function FormBuilderPage() {
  const [schema, setSchema] = useState(INITIAL_SCHEMA);
  const [value, setValue] = useState<Record<string, unknown>>({});
  const [mode, setMode] = useState<'design' | 'preview'>('design');
  const [lastSubmit, setLastSubmit] = useState('No submit yet');
  const builderRef = useRef<FormBuilderHandle>(null);

  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Form Builder</h1>
        <p className="docs-desc">A controlled form designer and preview surface. React owns schema, values, persistence, and submit handling; the builder supplies field editing, layout, and validation behavior.</p>
        <section id="basic" className="demo-section"><h2>Basic designer</h2><p className="section-desc">Add fields from the palette, select a card to edit its properties, drag cards, resize them from the corner handle, and switch to Preview.</p><CodePreview code={BASIC_CODE}><FormBuilder ref={builderRef} schema={schema} onSchemaChange={setSchema} value={value} onValueChange={setValue} mode={mode} onModeChange={setMode} onSubmit={(event) => setLastSubmit(`${event.valid ? 'Valid' : 'Invalid'}: ${JSON.stringify(event.value)}`)} /></CodePreview><p className="section-desc">Value: <code>{JSON.stringify(value)}</code></p><p className="section-desc">Submit: <code>{lastSubmit}</code></p></section>
        <section id="imperative" className="demo-section"><h2>Persistence and methods</h2><p className="section-desc">Use the imperative handle for Angular-equivalent <code>save</code>, <code>restore</code>, <code>resetValues</code>, and <code>submit</code> methods. Storage remains application-owned.</p><CodePreview code={'const snapshot = builderRef.current?.save();\nbuilderRef.current?.restore(snapshot);'}><div style={{ display: 'flex', gap: 'var(--sp-space-2)', flexWrap: 'wrap' }}><button type="button" className="docs-button" onClick={() => { const snapshot = builderRef.current?.save(); if (snapshot) setSchema(snapshot); }}>Clone schema</button><button type="button" className="docs-button" onClick={() => builderRef.current?.resetValues()}>Reset values</button><button type="button" className="docs-button" onClick={() => builderRef.current?.submit()}>Submit</button></div></CodePreview></section>
        <section id="api" className="demo-section"><h2>API</h2><div className="api-table-wrap"><table className="api-table"><thead><tr><th>Prop / handle</th><th>Type</th><th>Description</th></tr></thead><tbody>
          <tr><td><code>schema</code> / <code>onSchemaChange</code></td><td><code>FormBuilderSchema</code> / callback</td><td>Controlled sections, fields, tabs, options, and grid positions.</td></tr>
          <tr><td><code>value</code> / <code>onValueChange</code></td><td><code>Record&lt;string, unknown&gt;</code> / callback</td><td>Controlled preview values keyed by field name.</td></tr>
          <tr><td><code>mode</code> / <code>onModeChange</code></td><td><code>'design' | 'preview'</code> / callback</td><td>Controlled designer or rendered form mode.</td></tr>
          <tr><td><code>onSubmit</code></td><td><code>(event) =&gt; void</code></td><td>Receives value, validity, and field errors.</td></tr>
          <tr><td><code>ref.save()</code> / <code>restore()</code></td><td>imperative handle</td><td>Clone or replace a JSON-safe schema snapshot.</td></tr>
          <tr><td><code>ref.addSection()</code> / <code>addField()</code></td><td>imperative handle</td><td>Programmatically build schema content.</td></tr>
        </tbody></table></div></section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list"><li><a className="toc-link" href="#basic">Basic designer</a></li><li><a className="toc-link" href="#imperative">Persistence and methods</a></li><li><a className="toc-link" href="#api">API</a></li></ul></nav>
    </div>
  );
}

