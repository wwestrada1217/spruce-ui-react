import { useState } from 'react';
import { PropertyPanel, type PropertyPanelProperty, type PropertyPanelValues } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const PROPERTIES: PropertyPanelProperty[] = [
  { name: 'displayName', label: 'Display name', category: 'General', editor: 'text', description: 'Shown in the workspace tree.' },
  { name: 'opacity', label: 'Opacity', category: 'Appearance', editor: 'number', min: 0, max: 1, step: 0.05 },
  { name: 'visible', label: 'Visible', category: 'Appearance', editor: 'boolean' },
  { name: 'blend', label: 'Blend mode', category: 'Appearance', editor: 'select', options: [{ label: 'Normal', value: 'normal' }, { label: 'Multiply', value: 'multiply' }] },
  { name: 'shadow', label: 'Shadow', category: 'Appearance', editor: 'compound', fields: [{ key: 'x', label: 'X', editor: 'number' }, { key: 'y', label: 'Y', editor: 'number' }], separator: ', ' },
];

export function PropertyPanelPage() {
  const [values, setValues] = useState<PropertyPanelValues>({ displayName: 'Hero card', opacity: 0.85, visible: true, blend: 'normal', 'shadow.x': 0, 'shadow.y': 4 });
  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Property Panel</h1>
        <p className="docs-desc">An object inspector for categorized or alphabetical properties, mixed values, inline editors, compound fields, and contextual descriptions.</p>

        <section id="inspector" className="demo-section">
          <h2>Object inspector</h2>
          <CodePreview code={'<PropertyPanel properties={properties} values={values} onValuesChange={setValues} showSearch />'}>
            <div style={{ maxWidth: 480 }}><PropertyPanel properties={PROPERTIES} values={values} onValuesChange={setValues} ariaLabel="Hero card properties" /></div>
          </CodePreview>
        </section>

        <section id="mixed" className="demo-section">
          <h2>Mixed values and dialog actions</h2>
          <CodePreview code={'<PropertyPanel properties={properties} values={values} mode="alphabetical" onOpenDialog={openDialog} />'}>
            <div style={{ maxWidth: 480 }}><PropertyPanel properties={[{ name: 'fill', label: 'Fill', category: 'Appearance', editor: 'color', mixed: true, actionLabel: 'Edit fill' }]} values={{ fill: null }} mode="alphabetical" onOpenDialog={(property) => window.alert(`Edit ${property.label}`)} /></div>
          </CodePreview>
        </section>

        <section id="accessibility" className="demo-section">
          <h2>Accessibility</h2>
          <p className="section-desc">Rows are exposed as a table, category controls are native buttons with expanded state, every editor has a label, mixed values are announced, and the description footer follows the focused property. Search, collapse, and editors are keyboard accessible and use logical RTL spacing.</p>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>properties</code></td><td><code>PropertyPanelProperty[]</code></td><td>required</td><td>Metadata for categories, editors, options, compound fields, and actions.</td></tr>
            <tr><td><code>values</code> / <code>onValuesChange</code></td><td><code>Record&lt;string, PropertyPanelValue&gt;</code> / callback</td><td><code>{'{}'}</code></td><td>Controlled property values; callbacks receive the full next object.</td></tr>
            <tr><td><code>mode</code> / <code>onModeChange</code></td><td><code>'categorized' | 'alphabetical'</code> / callback</td><td><code>'categorized'</code></td><td>Ordering mode.</td></tr>
            <tr><td><code>query</code> / <code>onQueryChange</code> / <code>showSearch</code></td><td><code>string</code> / callback / <code>boolean</code></td><td><code>''</code> / — / <code>true</code></td><td>Controlled search state and visibility.</td></tr>
            <tr><td><code>collapsedGroups</code> / <code>onCollapsedGroupsChange</code></td><td><code>Record&lt;string, boolean&gt;</code> / callback</td><td><code>{'{}'}</code></td><td>Controlled category collapse state.</td></tr>
            <tr><td><code>onPropertyChange</code> / <code>onFocusedPropertyChange</code> / <code>onOpenDialog</code></td><td>callbacks</td><td>—</td><td>Fine-grained editing, focus, and dialog action events.</td></tr>
            <tr><td><code>showFooter</code> / custom text props</td><td><code>boolean</code> / <code>string</code></td><td><code>true</code> / localized</td><td>Contextual description footer and localization overrides.</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list"><li><a className="toc-link" href="#inspector">Inspector</a></li><li><a className="toc-link" href="#mixed">Mixed values</a></li><li><a className="toc-link" href="#accessibility">Accessibility</a></li><li><a className="toc-link" href="#api">API</a></li></ul></nav>
    </div>
  );
}
