import { useState } from 'react';
import { Button, FluidFill, Slider } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [{ id: 'playground', label: 'Playground' }, { id: 'gauges', label: 'Vessel gauges' }, { id: 'api', label: 'API' }];
const PLAYGROUND_CODE = `import { FluidFill, Slider } from 'spruce-react';

<FluidFill fluidLevel={65} fluidColor="#3b82f6" showBubbles>
  <span className="vessel-label">65%</span>
</FluidFill>`;
const GAUGES_CODE = `<FluidFill fluidLevel={25} fluidColor="#f59e0b" />
<FluidFill fluidLevel={60} fluidColor="#3b82f6" />
<FluidFill fluidLevel={88} fluidColor="#ef4444" />`;

export function FluidFillPage() {
  const [level, setLevel] = useState(65);
  const [bubbles, setBubbles] = useState(true);
  return (
    <EffectDocsLayout title="Fluid Fill Effect" description="A liquid fill overlay with dual oscillating waves, rising bubbles, smooth level updates, and custom color blending." sections={SECTIONS}>
      <section id="playground" className="demo-section">
        <h2>Interactive playground</h2>
        <p className="section-desc">Adjust the fill level and toggle ambient bubbles. Give the component a sized parent when using it as an overlay.</p>
        <CodePreview code={PLAYGROUND_CODE} language="typescript">
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center', padding: 24 }}>
            <FluidFill fluidLevel={level} fluidColor="#3b82f6" showBubbles={bubbles} style={{ width: 150, height: 220, borderRadius: 24, border: '3px solid var(--sp-border)', background: 'var(--sp-surface-50)', display: 'grid', placeItems: 'center' }}>
              <span style={{ zIndex: 2, padding: '4px 10px', borderRadius: 12, background: 'rgb(255 255 255 / 70%)' }}>{level}%</span>
            </FluidFill>
            <div style={{ minWidth: 240, display: 'grid', gap: 16 }}>
              <Slider value={level} min={0} max={100} onChange={setLevel} ariaLabel="Fluid level" showTicks />
              <Button variant="outline" onClick={() => setBubbles((value) => !value)}>{bubbles ? 'Hide bubbles' : 'Show bubbles'}</Button>
            </div>
          </div>
        </CodePreview>
      </section>
      <section id="gauges" className="demo-section">
        <h2>Vessel gauges</h2>
        <p className="section-desc">Use the same overlay for tanks, battery indicators, and progress vessels.</p>
        <CodePreview code={GAUGES_CODE} language="typescript">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, padding: 24 }}>
            <FluidFill fluidLevel={25} fluidColor="#f59e0b" style={{ width: 90, height: 140, borderRadius: 16, border: '2px solid var(--sp-border)' }} />
            <FluidFill fluidLevel={60} fluidColor="#3b82f6" style={{ width: 90, height: 140, borderRadius: 16, border: '2px solid var(--sp-border)' }} />
            <FluidFill fluidLevel={88} fluidColor="#ef4444" style={{ width: 90, height: 140, borderRadius: 16, border: '2px solid var(--sp-border)' }} />
          </div>
        </CodePreview>
      </section>
      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'enabled / spFluidFill', type: 'boolean', defaultValue: 'true', description: 'Enable or disable the fill overlay.' },
          { name: 'fluidLevel', type: 'number', defaultValue: '65', description: 'Fill height percentage, clamped to 0–100.' },
          { name: 'fluidColor', type: 'string', defaultValue: "'var(--sp-primary)'", description: 'Primary wave and body color; accepts CSS colors and gradients.' },
          { name: 'secondaryColor', type: 'string | null', defaultValue: 'null', description: 'Optional secondary wave color.' },
          { name: 'waveSpeed', type: 'number', defaultValue: '1', description: 'Wave movement speed multiplier.' },
          { name: 'waveHeight', type: 'number', defaultValue: '10', description: 'Wave amplitude in pixels.' },
          { name: 'showBubbles', type: 'boolean', defaultValue: 'true', description: 'Render rising ambient bubbles.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
