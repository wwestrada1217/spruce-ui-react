import { useState } from 'react';
import { Aura, Button } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [
  { id: 'basic', label: 'Basic ring' },
  { id: 'colors', label: 'Colors & glow' },
  { id: 'api', label: 'API' },
];

const BASIC_CODE = `import { Aura } from 'spruce-react';

<Aura auraWidth={2} auraBlur={12}>
  <div className="surface">AI assistant</div>
</Aura>`;
const COLORS_CODE = `<Aura auraColors={['#6366f1', '#a855f7', '#ec4899']}>
  <div className="surface">AI Purple</div>
</Aura>
<Aura auraAnimate={false} auraIntensity={0.4}>
  <div className="surface">Static subtle ring</div>
</Aura>`;

export function AuraPage() {
  const [enabled, setEnabled] = useState(true);
  return (
    <EffectDocsLayout title="Aura" description="A rotating gradient ring with a soft halo for assistant inputs, highlighted surfaces, and focused content." sections={SECTIONS}>
      <section id="basic" className="demo-section">
        <h2>Basic ring</h2>
        <p className="section-desc">Wrap an opaque surface with <code>Aura</code>. The ring follows its border radius.</p>
        <CodePreview code={BASIC_CODE} language="typescript">
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
            <Aura auraWidth={2} auraBlur={12} style={{ borderRadius: 16, background: 'var(--sp-surface-100)', padding: 24 }}>
              AI assistant surface
            </Aura>
          </div>
        </CodePreview>
      </section>
      <section id="colors" className="demo-section">
        <h2>Colors, glow &amp; runtime control</h2>
        <p className="section-desc">Custom colors close back to the first stop automatically. Set <code>auraAnimate</code> to false for a static ring.</p>
        <CodePreview code={COLORS_CODE} language="typescript">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap', padding: 32 }}>
            <Aura enabled={enabled} auraColors={['#6366f1', '#a855f7', '#ec4899']} style={{ borderRadius: 16, background: 'var(--sp-surface-100)', padding: 20 }}>
              Custom purple
            </Aura>
            <Aura auraAnimate={false} auraIntensity={0.4} style={{ borderRadius: 16, background: 'var(--sp-surface-100)', padding: 20 }}>
              Static subtle
            </Aura>
            <Button variant="outline" onClick={() => setEnabled((value) => !value)}>
              {enabled ? 'Disable' : 'Enable'} first ring
            </Button>
          </div>
        </CodePreview>
      </section>
      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'enabled / spAura', type: 'boolean', defaultValue: 'true', description: 'Enable or disable the effect.' },
          { name: 'auraColors', type: 'string[]', defaultValue: '[]', description: 'Two or more custom gradient colors; the loop closes automatically.' },
          { name: 'auraSpeed', type: 'number', defaultValue: '4', description: 'Seconds per complete ring rotation.' },
          { name: 'auraWidth', type: 'number', defaultValue: '2', description: 'Gradient ring thickness in pixels.' },
          { name: 'auraBlur', type: 'number', defaultValue: '12', description: 'Outer halo blur radius in pixels.' },
          { name: 'auraIntensity', type: 'number', defaultValue: '0.6', description: 'Outer halo opacity, clamped to 0–1.' },
          { name: 'auraAnimate', type: 'boolean', defaultValue: 'true', description: 'Rotate the ring; reduced-motion users always receive a static ring.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
