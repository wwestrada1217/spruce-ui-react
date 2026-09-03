import { useState } from 'react';
import { Button, Fire } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [
  { id: 'playground', label: 'Playground' },
  { id: 'colors', label: 'Color themes' },
  { id: 'api', label: 'API' },
];
const PLAYGROUND_CODE = `import { Fire } from 'spruce-react';

<Fire fireColor="classic" intensity={6} density="medium" windDrift={1}>
  <div className="flame-surface">Rising embers</div>
</Fire>`;
const COLORS_CODE = `<Fire fireColor="blue" intensity={6}><div /></Fire>
<Fire fireColor="purple" intensity={6}><div /></Fire>
<Fire fireColor="emerald" intensity={6}><div /></Fire>`;

const surfaceStyle = { minHeight: 150, borderRadius: 16, background: 'linear-gradient(180deg, var(--sp-surface-100), var(--sp-surface-300))', display: 'flex', alignItems: 'end', justifyContent: 'center', padding: 24, color: 'var(--sp-text-color)' } as const;

export function FirePage() {
  const [enabled, setEnabled] = useState(true);
  const [intensity, setIntensity] = useState(6);
  return (
    <EffectDocsLayout title="Fire Effect" description="A particle flame overlay with rising embers, a heat glow, density controls, color themes, and wind drift." sections={SECTIONS}>
      <section id="playground" className="demo-section">
        <h2>Interactive playground</h2>
        <p className="section-desc">Tune intensity and switch the effect off without remounting the host.</p>
        <CodePreview code={PLAYGROUND_CODE} language="typescript">
          <div style={{ display: 'grid', gap: 16, padding: 24 }}>
            <Fire enabled={enabled} fireColor="classic" intensity={intensity} density="medium" windDrift={1} style={surfaceStyle}>
              <span>Rising embers</span>
            </Fire>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button variant="outline" onClick={() => setEnabled((value) => !value)}>{enabled ? 'Disable fire' : 'Enable fire'}</Button>
              <Button variant="ghost" onClick={() => setIntensity(2)} active={intensity === 2}>Low</Button>
              <Button variant="ghost" onClick={() => setIntensity(6)} active={intensity === 6}>Medium</Button>
              <Button variant="ghost" onClick={() => setIntensity(10)} active={intensity === 10}>Inferno</Button>
            </div>
          </div>
        </CodePreview>
      </section>
      <section id="colors" className="demo-section">
        <h2>Flame color themes</h2>
        <p className="section-desc">Choose classic, blue, purple, emerald, or white, or provide a custom CSS color.</p>
        <CodePreview code={COLORS_CODE} language="typescript">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, padding: 24 }}>
            <Fire fireColor="blue" intensity={6} style={surfaceStyle}>Blue plasma</Fire>
            <Fire fireColor="purple" intensity={6} style={surfaceStyle}>Violet mystic</Fire>
            <Fire fireColor="emerald" intensity={6} style={surfaceStyle}>Emerald fire</Fire>
          </div>
        </CodePreview>
      </section>
      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'enabled / spFire', type: 'boolean', defaultValue: 'true', description: 'Enable or disable the fire effect.' },
          { name: 'fireColor / color', type: 'FireColor', defaultValue: "'classic'", description: 'Built-in palette or custom CSS color.' },
          { name: 'fireIntensity / intensity', type: 'number', defaultValue: '5', description: 'Flame intensity from 1 to 10.' },
          { name: 'fireSpeed / speed', type: 'number', defaultValue: '1', description: 'Rising ember speed multiplier.' },
          { name: 'fireDensity / density', type: "'low' | 'medium' | 'high'", defaultValue: "'medium'", description: 'Particle spawn density.' },
          { name: 'windDrift', type: 'number', defaultValue: '0', description: 'Horizontal drift angle from -5 to 5.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
