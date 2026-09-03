import { Button, Glow } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [
  { id: 'variants', label: 'Variants' },
  { id: 'controls', label: 'Color & Intensity' },
  { id: 'api', label: 'API' },
];

const VARIANTS_CODE = `<Glow glowVariant="pulse" glowColor="#3b82f6">
  <Button variant="primary">Pulse</Button>
</Glow>
<Glow glowVariant="breathe" glowColor="#a855f7">
  <Button variant="outline">Breathe</Button>
</Glow>
<Glow glowVariant="steady" glowColor="#10b981">
  <Button variant="outline">Steady</Button>
</Glow>`;

const CONTROLS_CODE = `<Glow
  glowColor="#f59e0b"
  glowRadius={32}
  glowIntensity={0.8}
  glowSpeed={1.5}
>
  <Button variant="primary">Bright amber glow</Button>
</Glow>`;

export function GlowPage() {
  return (
    <EffectDocsLayout
      title="Glow"
      description="A theme-friendly luminous shadow with pulse, breathe, and steady variants."
      sections={SECTIONS}
    >
      <section id="variants" className="demo-section">
        <h2>Glow Variants</h2>
        <p className="section-desc">Choose a motion variant to match the emphasis level of the surface.</p>
        <CodePreview code={VARIANTS_CODE} language="typescript">
          <div style={{ padding: 32, display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
            <Glow glowVariant="pulse" glowColor="#3b82f6"><Button variant="primary">Pulse</Button></Glow>
            <Glow glowVariant="breathe" glowColor="#a855f7"><Button variant="outline">Breathe</Button></Glow>
            <Glow glowVariant="steady" glowColor="#10b981"><Button variant="outline">Steady</Button></Glow>
          </div>
        </CodePreview>
      </section>

      <section id="controls" className="demo-section">
        <h2>Color, Radius &amp; Intensity</h2>
        <p className="section-desc">Pass any CSS color and control the spread, opacity, and speed independently.</p>
        <CodePreview code={CONTROLS_CODE} language="typescript">
          <div style={{ padding: 32, display: 'flex', justifyContent: 'center' }}>
            <Glow glowColor="#f59e0b" glowRadius={32} glowIntensity={0.8} glowSpeed={1.5}>
              <Button variant="primary">Bright amber glow</Button>
            </Glow>
          </div>
        </CodePreview>
      </section>

      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'enabled', type: 'boolean', defaultValue: 'true', description: 'Enable or disable the effect.' },
          { name: 'glowColor', type: 'string', defaultValue: "'var(--sp-primary)'", description: 'Any CSS color.' },
          { name: 'glowRadius', type: 'number', defaultValue: '16', description: 'Glow spread radius in pixels.' },
          { name: 'glowIntensity', type: 'number', defaultValue: '0.6', description: 'Glow opacity, clamped to 0–1.' },
          { name: 'glowVariant', type: "'pulse' | 'steady' | 'breathe'", defaultValue: "'pulse'", description: 'Animation variant.' },
          { name: 'glowSpeed', type: 'number', defaultValue: '2', description: 'Animation cycle in seconds.' },
          { name: 'color / blur / pulse', type: 'string / number / boolean', defaultValue: '—', description: 'Backwards-compatible aliases.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
