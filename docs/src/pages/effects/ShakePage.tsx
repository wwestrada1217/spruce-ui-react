import { useRef } from 'react';
import { Button, Shake, type ShakeHandle } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [{ id: 'manual', label: 'Manual Trigger' }, { id: 'variants', label: 'Variants' }, { id: 'api', label: 'API' }];
const MANUAL_CODE = `const shaker = useRef<ShakeHandle>(null);
<Shake ref={shaker} shakeTrigger="manual" onShakeEnd={() => console.log('done')}>
  <Button onClick={() => shaker.current?.trigger()}>Validate form</Button>
</Shake>`;
const VARIANTS_CODE = `<Shake shakeVariant="shake-y"><Button>Shake Y</Button></Shake>
<Shake shakeVariant="bounce"><Button>Bounce</Button></Shake>
<Shake shakeVariant="pulse"><Button>Pulse</Button></Shake>
<Shake shakeVariant="wobble"><Button>Wobble</Button></Shake>`;

export function ShakePage() {
  const shaker = useRef<ShakeHandle>(null);
  return (
    <EffectDocsLayout title="Shake" description="Tactile feedback for validation errors, denied actions, and playful controls. Trigger it on click, hover, or imperatively through a ref." sections={SECTIONS} packageName="spruce-react" packageSymbols={['Shake', 'ShakeHandle']}>
      <section id="manual" className="demo-section"><h2>Manual Trigger</h2><p className="section-desc">Use a ref when the animation should follow application logic, such as a failed form submission.</p><CodePreview code={MANUAL_CODE} language="tsx"><div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 24 }}><Shake ref={shaker} shakeTrigger="manual" onShakeEnd={() => undefined}><Button onClick={() => shaker.current?.trigger()}>Validate form</Button></Shake><span>Click to trigger</span></div></CodePreview></section>
      <section id="variants" className="demo-section"><h2>Motion Variants</h2><CodePreview code={VARIANTS_CODE} language="tsx"><div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: 24 }}><Shake shakeVariant="shake-y"><Button>Shake Y</Button></Shake><Shake shakeVariant="bounce"><Button>Bounce</Button></Shake><Shake shakeVariant="pulse"><Button>Pulse</Button></Shake><Shake shakeVariant="wobble"><Button>Wobble</Button></Shake></div></CodePreview></section>
      <section id="api" className="demo-section"><h2>API</h2><EffectApiTable rows={[
        { name: 'shakeVariant', type: "'shake' | 'shake-y' | 'bounce' | 'pulse' | 'wobble' | 'pop' | 'jiggle'", defaultValue: "'shake'", description: 'Motion pattern.' },
        { name: 'shakeTrigger', type: "'click' | 'hover' | 'manual'", defaultValue: "'click'", description: 'When to trigger the cycle.' },
        { name: 'shakeIntensity', type: "'subtle' | 'normal' | 'intense'", defaultValue: "'normal'", description: 'Travel and scale intensity.' },
        { name: 'shakeDuration', type: 'number', defaultValue: '500', description: 'Animation duration in milliseconds.' },
        { name: 'onShakeEnd', type: '() => void', defaultValue: '—', description: 'Called when the cycle finishes.' },
        { name: 'ShakeHandle.trigger()', type: '() => void', defaultValue: '—', description: 'Imperatively starts the animation.' },
      ]} /></section>
    </EffectDocsLayout>
  );
}
