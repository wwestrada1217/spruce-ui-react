import { useState } from 'react';
import { Button, Sparkles } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [
  { id: 'basic', label: 'Particle Overlay' },
  { id: 'controls', label: 'Colors & Sizes' },
  { id: 'api', label: 'API' },
];

const BASIC_CODE = `import { Sparkles, Button } from 'spruce-react';

<Sparkles sparkleColor="gold" sparkleSize="md" sparkleCount={6}>
  <Button variant="primary">Magical sparkles</Button>
</Sparkles>`;

const CONTROLS_CODE = `import { useState } from 'react';
import { Sparkles, Button } from 'spruce-react';

const [enabled, setEnabled] = useState(true);

<Sparkles
  enabled={enabled}
  sparkleColor="rainbow"
  sparkleSize="lg"
  sparkleCount={8}
  sparkleInterval={300}
>
  <Button onClick={() => setEnabled((value) => !value)}>
    Toggle sparkles
  </Button>
</Sparkles>`;

export function SparklesPage() {
  const [enabled, setEnabled] = useState(true);

  return (
    <EffectDocsLayout
      title="Sparkles"
      description="A particle sparkle overlay for subtle magic, celebrations, and accent highlights."
      sections={SECTIONS}
    >
      <section id="basic" className="demo-section">
        <h2>Particle Overlay</h2>
        <p className="section-desc">Wrap any content to spawn gold sparkle particles at a controlled interval.</p>
        <CodePreview code={BASIC_CODE} language="typescript">
          <div style={{ padding: 32, display: 'flex', justifyContent: 'center' }}>
            <Sparkles sparkleColor="gold" sparkleSize="md" sparkleCount={6}>
              <Button variant="primary">Magical sparkles</Button>
            </Sparkles>
          </div>
        </CodePreview>
      </section>

      <section id="controls" className="demo-section">
        <h2>Colors, Sizes &amp; Runtime Control</h2>
        <p className="section-desc">Use the built-in palettes or a CSS color, select a particle size, and toggle the effect without remounting.</p>
        <CodePreview code={CONTROLS_CODE} language="typescript">
          <div style={{ padding: 32, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Sparkles sparkleColor="rainbow" sparkleSize="lg" sparkleCount={8} sparkleInterval={300} enabled={enabled}>
              <Button onClick={() => setEnabled((value) => !value)}>
                {enabled ? 'Disable' : 'Enable'} sparkles
              </Button>
            </Sparkles>
            <Sparkles sparkleColor="#ec4899" sparkleSize="sm" sparkleCount={4}>
              <span style={{ padding: 16, color: 'var(--sp-text-default)' }}>Custom pink</span>
            </Sparkles>
          </div>
        </CodePreview>
      </section>

      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'enabled', type: 'boolean', defaultValue: 'true', description: 'Enable or disable the effect.' },
          { name: 'sparkleColor', type: "'gold' | 'rainbow' | 'white' | string", defaultValue: "'gold'", description: 'Built-in palette or custom CSS color.' },
          { name: 'sparkleSize', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Particle size preset.' },
          { name: 'sparkleCount', type: 'number', defaultValue: '6', description: 'Maximum particles visible at one time.' },
          { name: 'sparkleInterval', type: 'number', defaultValue: '400', description: 'Milliseconds between particle spawns.' },
          { name: 'spSparkles', type: 'boolean', defaultValue: '—', description: 'Angular-compatible alias for enabled.' },
          { name: 'color / count', type: 'string / number', defaultValue: '—', description: 'Backwards-compatible aliases for sparkleColor and sparkleCount.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
