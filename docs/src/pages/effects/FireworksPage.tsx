import { useRef, useState } from 'react';
import { Button, Fireworks, type FireworksHandle } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [{ id: 'playground', label: 'Fireworks show' }, { id: 'api', label: 'API' }];
const PLAYGROUND_CODE = `import { useRef } from 'react';
import { Fireworks, Button, type FireworksHandle } from 'spruce-react';

const fireworksRef = useRef<FireworksHandle>(null);

<Fireworks ref={fireworksRef} autoLaunch={false} launchOnClick>
  <div className="night-sky">Click to launch</div>
</Fireworks>
<Button onClick={() => fireworksRef.current?.launch()}>Launch rocket</Button>`;

export function FireworksPage() {
  const fireworksRef = useRef<FireworksHandle>(null);
  const [palette, setPalette] = useState<'multicolor' | 'gold' | 'neon' | 'patriot'>('multicolor');
  const [lastBurst, setLastBurst] = useState('No burst yet');
  return (
    <EffectDocsLayout title="Fireworks Effect" description="A canvas fireworks show with rising rocket trails, starburst particles, customizable palettes, and imperative launch control." sections={SECTIONS}>
      <section id="playground" className="demo-section">
        <h2>Fireworks show</h2>
        <p className="section-desc">Use the ref to launch a rocket, or set <code>launchOnClick</code> to make the sky interactive.</p>
        <CodePreview code={PLAYGROUND_CODE} language="typescript">
          <div style={{ display: 'grid', gap: 16, padding: 24 }}>
            <Fireworks ref={fireworksRef} palette={palette} autoLaunch={false} launchOnClick onBurst={(burst) => setLastBurst(`Burst at ${Math.round(burst.x)}, ${Math.round(burst.y)}`)} style={{ minHeight: 260, borderRadius: 16, background: 'linear-gradient(180deg, #020617, #0f172a)', color: 'white', display: 'grid', placeItems: 'end center', padding: 20 }} ariaLabel="Interactive night sky">
              <span style={{ color: 'rgb(255 255 255 / 75%)' }}>Click anywhere in the night sky to launch 🎆</span>
            </Fireworks>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button variant="primary" onClick={() => fireworksRef.current?.launch()}>Launch rocket 🚀</Button>
              {(['multicolor', 'gold', 'neon', 'patriot'] as const).map((item) => <Button key={item} variant="ghost" active={palette === item} onClick={() => setPalette(item)}>{item}</Button>)}
              <span aria-live="polite" style={{ color: 'var(--sp-text-muted)' }}>{lastBurst}</span>
            </div>
          </div>
        </CodePreview>
      </section>
      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'enabled / spFireworks', type: 'boolean', defaultValue: 'true', description: 'Enable or disable the canvas effect.' },
          { name: 'intensity', type: "'low' | 'medium' | 'high'", defaultValue: "'medium'", description: 'Automatic rocket launch interval.' },
          { name: 'palette', type: "'multicolor' | 'gold' | 'neon' | 'patriot'", defaultValue: "'multicolor'", description: 'Particle burst color scheme.' },
          { name: 'autoLaunch', type: 'boolean', defaultValue: 'true', description: 'Continuously launch rockets.' },
          { name: 'launchOnClick', type: 'boolean', defaultValue: 'false', description: 'Launch at the clicked container-relative coordinates.' },
          { name: 'onBurst', type: '(burst: FireworksBurst) => void', defaultValue: '—', description: 'Called with relative x/y coordinates when a rocket detonates.' },
          { name: 'ref.launch(x?, y?)', type: 'FireworksHandle', defaultValue: '—', description: 'Imperatively launch a rocket.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
