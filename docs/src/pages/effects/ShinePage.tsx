import { Button, Card, Shine } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [
  { id: 'basic', label: 'Shine Sweep' },
  { id: 'controls', label: 'Angles & Timing' },
  { id: 'api', label: 'API' },
];

const BASIC_CODE = `import { Shine, Button } from 'spruce-react';

<Shine shineColor="rgba(255, 255, 255, 0.5)">
  <Button variant="primary">Featured action</Button>
</Shine>`;

const CONTROLS_CODE = `<Shine shineAngle={90} shineWidth={20} shineDuration={1000} shineDelay={500}>
  <Card>Fast, narrow shine</Card>
</Shine>
<Shine shineAngle={150} shineColor="rgba(59, 130, 246, 0.35)">
  <Card>Blue angled shine</Card>
</Shine>`;

export function ShinePage() {
  return (
    <EffectDocsLayout
      title="Shine"
      description="A configurable reflective sweep for featured cards, premium actions, and announcements."
      sections={SECTIONS}
    >
      <section id="basic" className="demo-section">
        <h2>Shine Sweep</h2>
        <p className="section-desc">The highlight repeats automatically and can be disabled without removing the wrapped content.</p>
        <CodePreview code={BASIC_CODE} language="typescript">
          <div style={{ padding: 28, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            <Shine shineColor="rgba(255, 255, 255, 0.5)">
              <Button variant="primary">Featured action</Button>
            </Shine>
            <Shine enabled={false}><Card>Shine disabled</Card></Shine>
          </div>
        </CodePreview>
      </section>

      <section id="controls" className="demo-section">
        <h2>Angles, Width &amp; Timing</h2>
        <p className="section-desc">Tune the band geometry and cadence for different surfaces.</p>
        <CodePreview code={CONTROLS_CODE} language="typescript">
          <div style={{ padding: 28, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            <Shine shineAngle={90} shineWidth={20} shineDuration={1000} shineDelay={500}>
              <Card>Fast, narrow shine</Card>
            </Shine>
            <Shine shineAngle={150} shineColor="rgba(59, 130, 246, 0.35)">
              <Card>Blue angled shine</Card>
            </Shine>
          </div>
        </CodePreview>
      </section>

      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'enabled', type: 'boolean', defaultValue: 'true', description: 'Enable or disable the effect.' },
          { name: 'shineDuration', type: 'number', defaultValue: '2000', description: 'Sweep duration in milliseconds.' },
          { name: 'shineAngle', type: 'number', defaultValue: '120', description: 'Gradient angle in degrees.' },
          { name: 'shineColor', type: 'string', defaultValue: "'rgba(255, 255, 255, 0.5)'", description: 'Highlight color.' },
          { name: 'shineWidth', type: 'number', defaultValue: '30', description: 'Band width, clamped to 10–100 percent.' },
          { name: 'shineDelay', type: 'number', defaultValue: '1000', description: 'Delay between repeated sweeps in milliseconds.' },
          { name: 'active / spShine', type: 'boolean', defaultValue: '—', description: 'Backwards-compatible aliases for enabled.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
