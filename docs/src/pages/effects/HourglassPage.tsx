import { useRef, useState } from 'react';
import { Button, Hourglass, Slider, type HourglassHandle } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [{ id: 'playground', label: 'Playground' }, { id: 'sizes', label: 'Sizing presets' }, { id: 'api', label: 'API' }];
const PLAYGROUND_CODE = `import { Hourglass, Slider } from 'spruce-react';

<Hourglass progress={45} sandColor="#f59e0b" running size="xl" />
<Slider value={progress} min={0} max={100} onChange={setProgress} />`;
const SIZES_CODE = `<Hourglass size="sm" progress={40} />
<Hourglass size="md" progress={60} />
<Hourglass size="lg" progress={80} />
<Hourglass size="xl" progress={100} />`;

export function HourglassPage() {
  const [progress, setProgress] = useState(45);
  const [running, setRunning] = useState(true);
  const hourglassRef = useRef<HourglassHandle>(null);
  return (
    <EffectDocsLayout title="Hourglass Effect" description="An animated vector hourglass with trickling sand, progress levels, optional countdown timing, and an imperative flip handle." sections={SECTIONS}>
      <section id="playground" className="demo-section">
        <h2>Interactive countdown timer</h2>
        <p className="section-desc">Adjust the sand level, toggle the stream, or flip the vessel from a separate action.</p>
        <CodePreview code={PLAYGROUND_CODE} language="typescript">
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', padding: 24 }}>
            <Hourglass ref={hourglassRef} progress={progress} sandColor="#f59e0b" running={running} size="xl" />
            <div style={{ minWidth: 240, display: 'grid', gap: 16 }}>
              <Slider value={progress} min={0} max={100} onChange={setProgress} ariaLabel="Sand progress" showTicks />
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Button variant="outline" onClick={() => setRunning((value) => !value)}>{running ? 'Pause stream' : 'Run stream'}</Button>
                <Button variant="ghost" onClick={() => hourglassRef.current?.flip()}>Flip</Button>
              </div>
            </div>
          </div>
        </CodePreview>
      </section>
      <section id="sizes" className="demo-section">
        <h2>Sizing presets</h2>
        <p className="section-desc">Use <code>sm</code>, <code>md</code>, <code>lg</code>, <code>xl</code>, or provide a pixel width.</p>
        <CodePreview code={SIZES_CODE} language="typescript">
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'center', gap: 24, flexWrap: 'wrap', padding: 24 }}>
            <Hourglass size="sm" progress={40} />
            <Hourglass size="md" progress={60} />
            <Hourglass size="lg" progress={80} />
            <Hourglass size="xl" progress={100} />
          </div>
        </CodePreview>
      </section>
      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'progress', type: 'number', defaultValue: '45', description: 'Bottom-bulb sand percentage, clamped to 0–100.' },
          { name: 'duration', type: 'number', defaultValue: '0', description: 'Optional countdown duration in seconds; zero uses manual progress.' },
          { name: 'sandColor', type: 'string', defaultValue: "'#f59e0b'", description: 'Sand color.' },
          { name: 'glassColor', type: 'string', defaultValue: "'var(--sp-border-strong)'", description: 'Frame and cap color.' },
          { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | number", defaultValue: "'md'", description: 'Vessel width preset or pixel width.' },
          { name: 'animating / running', type: 'boolean', defaultValue: 'true', description: 'Show the falling sand stream.' },
          { name: 'onComplete', type: '() => void', defaultValue: '—', description: 'Called when an optional countdown reaches 100%.' },
          { name: 'ref.flip()', type: 'HourglassHandle', defaultValue: '—', description: 'Imperatively trigger the brief flip indication.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
