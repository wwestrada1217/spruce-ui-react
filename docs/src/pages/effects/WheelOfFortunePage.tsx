import { useRef, useState } from 'react';
import { Button, WheelOfFortune, type WheelOfFortuneHandle, type WheelSlice } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [{ id: 'playground', label: 'Spin playground' }, { id: 'slices', label: 'Custom slices' }, { id: 'api', label: 'API' }];
const PLAYGROUND_CODE = `import { useRef, useState } from 'react';
import { WheelOfFortune, type WheelOfFortuneHandle } from 'spruce-react';

const wheelRef = useRef<WheelOfFortuneHandle>(null);

<WheelOfFortune ref={wheelRef} onSpinComplete={setWinner} />
<button onClick={() => wheelRef.current?.spin()}>Spin programmatically</button>`;
const SLICES_CODE = `const slices = [
  { id: 'yes', label: 'Yes', color: '#10b981' },
  { id: 'no', label: 'No', color: '#ef4444' },
];

<WheelOfFortune slices={slices} size="md" centerText="GO" />`;

const customSlices: WheelSlice[] = [
  { id: 'yes', label: 'Yes', color: '#10b981', textColor: '#ffffff' },
  { id: 'no', label: 'No', color: '#ef4444', textColor: '#ffffff' },
  { id: 'maybe', label: 'Maybe', color: '#f59e0b', textColor: '#ffffff' },
];

export function WheelOfFortunePage() {
  const wheelRef = useRef<WheelOfFortuneHandle>(null);
  const [winner, setWinner] = useState<WheelSlice | null>(null);
  return (
    <EffectDocsLayout title="Wheel of Fortune" description="An interactive vector prize wheel with custom slices, easing physics, pointer tick feedback, and winner callbacks." sections={SECTIONS}>
      <section id="playground" className="demo-section">
        <h2>Interactive spin playground</h2>
        <p className="section-desc">Click the built-in center button or trigger a spin through the imperative handle.</p>
        <CodePreview code={PLAYGROUND_CODE} language="typescript">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <WheelOfFortune ref={wheelRef} size="md" onSpinComplete={setWinner} />
            <div style={{ display: 'grid', gap: 16, minWidth: 180 }}>
              <Button variant="primary" onClick={() => wheelRef.current?.spin()}>Spin programmatically</Button>
              <p aria-live="polite" style={{ color: 'var(--sp-text-muted)' }}>{winner ? `Winner: ${winner.label}` : 'Press SPIN to draw a prize'}</p>
            </div>
          </div>
        </CodePreview>
      </section>
      <section id="slices" className="demo-section">
        <h2>Custom slices</h2>
        <p className="section-desc">Provide stable ids, labels, colors, optional text colors, and optional icon metadata.</p>
        <CodePreview code={SLICES_CODE} language="typescript">
          <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
            <WheelOfFortune slices={customSlices} size="sm" centerText="GO" duration={2.5} ariaLabel="Yes no maybe wheel" />
          </div>
        </CodePreview>
      </section>
      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'slices', type: 'WheelSlice[]', defaultValue: 'DEFAULT_WHEEL_SLICES', description: 'Prize slices with id, label, color, optional textColor and icon.' },
          { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | number", defaultValue: "'lg'", description: 'Wheel diameter preset or pixel size.' },
          { name: 'pointerColor', type: 'string', defaultValue: "'#ef4444'", description: 'Top indicator color.' },
          { name: 'centerText', type: 'string', defaultValue: "'SPIN'", description: 'Center action label.' },
          { name: 'duration / spinDuration', type: 'number', defaultValue: '4.5s / —', description: 'Spin duration in seconds, or the documentation-compatible millisecond alias.' },
          { name: 'onSpinStart', type: '() => void', defaultValue: '—', description: 'Called when a spin begins.' },
          { name: 'onSpinComplete', type: '(winner: WheelSlice) => void', defaultValue: '—', description: 'Called with the winning slice after the spin.' },
          { name: 'ref.spin()', type: 'WheelOfFortuneHandle', defaultValue: '—', description: 'Imperatively trigger a spin.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
