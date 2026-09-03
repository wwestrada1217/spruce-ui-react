import { useRef, useState } from 'react';
import { Button, Confetti, type ConfettiHandle } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [
  { id: 'click', label: 'Click Trigger' },
  { id: 'config', label: 'Configuration' },
  { id: 'programmatic', label: 'Programmatic Trigger' },
  { id: 'api', label: 'API' },
];

const CLICK_CODE = `import { Confetti, Button } from 'spruce-react';

<Confetti confettiOnClick config={{ count: 80, spread: 70 }}>
  <Button variant="primary">Click for confetti 🎉</Button>
</Confetti>`;

const CONFIG_CODE = `<Confetti
  active={celebrating}
  count={120}
  duration={2500}
  spread={90}
  colors={['#3b82f6', '#8b5cf6', '#ec4899']}
  shapes={['circle', 'strip']}
  originY={60}
  onStart={() => setCelebrating(true)}
  onComplete={() => setCelebrating(false)}
/>`;

const PROGRAMMATIC_CODE = `import { useRef } from 'react';
import { Confetti, Button, type ConfettiHandle } from 'spruce-react';

const confettiRef = useRef<ConfettiHandle>(null);

<Confetti ref={confettiRef} confettiOnClick={false} />
<Button onClick={() => confettiRef.current?.fire({ count: 40 })}>
  Fire burst
</Button>`;

export function ConfettiPage() {
  const [celebrating, setCelebrating] = useState(false);
  const confettiRef = useRef<ConfettiHandle>(null);

  return (
    <EffectDocsLayout
      title="Confetti"
      description="A configurable celebration burst with click, controlled, and imperative triggers."
      sections={SECTIONS}
    >
      <section id="click" className="demo-section">
        <h2>Click Trigger</h2>
        <p className="section-desc">Wrap an interactive control to fire a burst when the host is clicked.</p>
        <CodePreview code={CLICK_CODE} language="typescript">
          <div style={{ padding: 32, display: 'flex', justifyContent: 'center' }}>
            <Confetti confettiOnClick config={{ count: 80, spread: 70 }}>
              <Button variant="primary">Click for confetti 🎉</Button>
            </Confetti>
          </div>
        </CodePreview>
      </section>

      <section id="config" className="demo-section">
        <h2>Configuration</h2>
        <p className="section-desc">Control the burst count, duration, spread, origin, palette, and shape mix.</p>
        <CodePreview code={CONFIG_CODE} language="typescript">
          <div style={{ padding: 32, display: 'flex', justifyContent: 'center' }}>
            <Confetti
              active={celebrating}
              count={120}
              duration={1200}
              spread={90}
              colors={['#3b82f6', '#8b5cf6', '#ec4899']}
              shapes={['circle', 'strip']}
              onStart={() => setCelebrating(true)}
              onComplete={() => setCelebrating(false)}
            />
            <Button disabled={celebrating} onClick={() => setCelebrating(true)}>
              {celebrating ? 'Celebrating…' : 'Celebrate'}
            </Button>
          </div>
        </CodePreview>
      </section>

      <section id="programmatic" className="demo-section">
        <h2>Programmatic Trigger</h2>
        <p className="section-desc">Use a ref handle when the burst is owned by a separate action or event.</p>
        <CodePreview code={PROGRAMMATIC_CODE} language="typescript">
          <div style={{ padding: 32, display: 'flex', justifyContent: 'center' }}>
            <Confetti ref={confettiRef} confettiOnClick={false} />
            <Button variant="outline" onClick={() => confettiRef.current?.fire({ count: 40, spread: 45 })}>
              Fire burst
            </Button>
          </div>
        </CodePreview>
      </section>

      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'active', type: 'boolean', defaultValue: 'false', description: 'Fire once when changed from false to true.' },
          { name: 'config / spConfetti', type: 'ConfettiConfig', defaultValue: '—', description: 'Object form of the burst configuration.' },
          { name: 'count', type: 'number', defaultValue: '80', description: 'Number of particles.' },
          { name: 'duration', type: 'number', defaultValue: '2500', description: 'Animation duration in milliseconds.' },
          { name: 'spread', type: 'number', defaultValue: '70', description: 'Spread angle in degrees.' },
          { name: 'colors', type: 'string[]', defaultValue: 'default palette', description: 'Custom particle colors.' },
          { name: 'shapes', type: 'ConfettiShape[]', defaultValue: "['square', 'circle', 'strip']", description: 'Particle shape mix.' },
          { name: 'originY', type: 'number', defaultValue: '60', description: 'Start position as a percentage of the host height.' },
          { name: 'confettiOnClick', type: 'boolean', defaultValue: 'true', description: 'Fire when the host is clicked.' },
          { name: 'onStart / onComplete', type: '() => void', defaultValue: '—', description: 'Callbacks for burst start and completion.' },
          { name: 'ref.fire(overrides?)', type: 'ConfettiHandle', defaultValue: '—', description: 'Imperatively fire a burst with optional overrides.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
