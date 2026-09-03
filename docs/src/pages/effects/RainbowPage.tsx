import { Button, Rainbow } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [
  { id: 'modes', label: 'Gradient Modes' },
  { id: 'colors', label: 'Colors & Speed' },
  { id: 'api', label: 'API' },
];

const MODES_CODE = `<Rainbow rainbowMode="text">
  <h2>Text gradient</h2>
</Rainbow>
<Rainbow rainbowMode="background">
  <div>Background gradient</div>
</Rainbow>
<Rainbow rainbowMode="border" borderWidth={3}>
  <Button variant="outline">Gradient border</Button>
</Rainbow>`;

const COLORS_CODE = `<Rainbow
  rainbowColors={['#3b82f6', '#8b5cf6', '#ec4899']}
  rainbowSpeed={1}
>
  <h3>Fast custom spectrum</h3>
</Rainbow>
<Rainbow rainbowAnimate={false}>
  <h3>Static text gradient</h3>
</Rainbow>`;

export function RainbowPage() {
  return (
    <EffectDocsLayout
      title="Rainbow"
      description="Apply an animated or static spectrum gradient to text, backgrounds, or borders."
      sections={SECTIONS}
    >
      <section id="modes" className="demo-section">
        <h2>Gradient Modes</h2>
        <p className="section-desc">The mode controls where the gradient is painted on the host element.</p>
        <CodePreview code={MODES_CODE} language="typescript">
          <div style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <Rainbow rainbowMode="text"><h2 style={{ margin: 0, fontSize: 28 }}>Text gradient</h2></Rainbow>
            <Rainbow rainbowMode="background" style={{ padding: '10px 18px', color: 'white', borderRadius: 'var(--sp-radius-md)' }}>
              <span>Background gradient</span>
            </Rainbow>
            <Rainbow rainbowMode="border" borderWidth={3}>
              <Button variant="outline">Gradient border</Button>
            </Rainbow>
          </div>
        </CodePreview>
      </section>

      <section id="colors" className="demo-section">
        <h2>Colors, Speed &amp; Static Mode</h2>
        <p className="section-desc">Provide two or more custom colors, tune the cycle duration, or disable animation for a still gradient.</p>
        <CodePreview code={COLORS_CODE} language="typescript">
          <div style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <Rainbow rainbowColors={['#3b82f6', '#8b5cf6', '#ec4899']} rainbowSpeed={1}>
              <h3 style={{ margin: 0 }}>Fast custom spectrum</h3>
            </Rainbow>
            <Rainbow rainbowAnimate={false}>
              <h3 style={{ margin: 0 }}>Static text gradient</h3>
            </Rainbow>
          </div>
        </CodePreview>
      </section>

      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'enabled', type: 'boolean', defaultValue: 'true', description: 'Enable or disable the effect.' },
          { name: 'rainbowMode', type: "'text' | 'background' | 'border'", defaultValue: "'text'", description: 'Where to apply the gradient.' },
          { name: 'rainbowSpeed', type: 'number', defaultValue: '3', description: 'Seconds per animation cycle.' },
          { name: 'rainbowColors', type: 'string[]', defaultValue: '[]', description: 'Custom gradient colors; defaults to the standard spectrum.' },
          { name: 'rainbowAnimate', type: 'boolean', defaultValue: 'true', description: 'Animate the gradient when enabled.' },
          { name: 'borderWidth', type: 'number', defaultValue: '2', description: 'Border thickness in pixels for border mode.' },
          { name: 'animated / spRainbow', type: 'boolean', defaultValue: '—', description: 'Backwards-compatible animation and enabled aliases.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
