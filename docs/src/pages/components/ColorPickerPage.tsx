import { useState } from 'react';
import { ColorPicker, type ColorPickerColor } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const COLORS: readonly ColorPickerColor[] = [
  { label: 'Ocean', value: '#1e88e5' },
  { label: 'Forest', value: '#43a047' },
  { label: 'Sunset', value: '#fb8c00' },
  { label: 'Plum', value: '#8e24aa' },
];

const BASIC_CODE = `const [accent, setAccent] = useState('#1e88e5');

<ColorPicker value={accent} onChange={setAccent} label="Accent color" />`;

export function ColorPickerPage() {
  const [accent, setAccent] = useState('#1e88e5');
  const [custom, setCustom] = useState('#43a047');

  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Color Picker</h1>
        <p className="docs-desc">Compact preset and custom color selection for toolbar and form surfaces.</p>

        <section id="basic" className="demo-section">
          <h2>Basic</h2>
          <p className="section-desc">Choose a preset or open the native color input from Custom.</p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-space-3)' }}>
              <ColorPicker value={accent} onChange={setAccent} label="Accent color" />
              <code>{accent}</code>
            </div>
          </CodePreview>
        </section>

        <section id="custom" className="demo-section">
          <h2>Custom palette</h2>
          <CodePreview code={'<ColorPicker value={color} colors={colors} onChange={setColor} />'}>
            <ColorPicker value={custom} colors={COLORS} onChange={setCustom} label="Brand color" icon={null} />
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>value</code></td><td><code>string</code></td><td><code>'#111827'</code></td><td>Controlled color value.</td></tr>
            <tr><td><code>onChange</code></td><td><code>(value) =&gt; void</code></td><td>—</td><td>Called with a preset or native color value.</td></tr>
            <tr><td><code>colors</code></td><td><code>ColorPickerColor[]</code></td><td>Common colors</td><td>Preset colors displayed in the listbox.</td></tr>
            <tr><td><code>label</code> / <code>icon</code></td><td><code>string</code> / <code>string | null</code></td><td>Localized / <code>'palette'</code></td><td>Accessible trigger label and optional icon.</td></tr>
            <tr><td><code>open</code> / <code>onOpenChange</code></td><td><code>boolean</code> / callback</td><td>Uncontrolled</td><td>Control the portaled panel from React.</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list"><li><a className="toc-link" href="#basic">Basic</a></li><li><a className="toc-link" href="#custom">Custom palette</a></li><li><a className="toc-link" href="#api">API</a></li></ul></nav>
    </div>
  );
}

