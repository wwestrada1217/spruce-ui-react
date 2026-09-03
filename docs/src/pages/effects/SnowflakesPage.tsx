import { useState } from 'react';
import { Button, Snowflakes, type SnowflakeSize } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [{ id: 'density', label: 'Density & count' }, { id: 'sizes', label: 'Particle sizes' }, { id: 'api', label: 'API' }];
const DENSITY_CODE = `<Snowflakes snowflakeCount={12}>
  <div className="snow-card">Light dusting</div>
</Snowflakes>
<Snowflakes count={70} wind={3}><div className="snow-card">Blizzard</div></Snowflakes>`;
const SIZES_CODE = `<Snowflakes snowflakeSize="sm"><div>Small particles</div></Snowflakes>
<Snowflakes size="lg"><div>Large crystals</div></Snowflakes>
<Snowflakes snowflakeColor="#38bdf8"><div>Ice blue</div></Snowflakes>`;

const snowStyle = { minHeight: 150, borderRadius: 16, background: 'linear-gradient(180deg, #172554, #0f172a)', color: 'white', display: 'grid', placeItems: 'center', padding: 24 } as const;

export function SnowflakesPage() {
  const [count, setCount] = useState(35);
  const [size, setSize] = useState<SnowflakeSize>('mixed');
  return (
    <EffectDocsLayout title="Snowflakes Effect" description="A winter ambient overlay with falling particles, depth-friendly size presets, wind sway, and custom colors." sections={SECTIONS}>
      <section id="density" className="demo-section">
        <h2>Density &amp; snowflake count</h2>
        <p className="section-desc">Choose a light dusting, moderate snowfall, or a dense blizzard for a banner or card.</p>
        <CodePreview code={DENSITY_CODE} language="typescript">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, padding: 24 }}>
            <Snowflakes snowflakeCount={12} style={snowStyle}>Light dusting</Snowflakes>
            <Snowflakes snowflakeCount={35} style={snowStyle}>Moderate snowfall</Snowflakes>
            <Snowflakes snowflakeCount={70} style={snowStyle}>Winter blizzard</Snowflakes>
          </div>
        </CodePreview>
      </section>
      <section id="sizes" className="demo-section">
        <h2>Particle sizes &amp; runtime controls</h2>
        <p className="section-desc">Use <code>sm</code>, <code>md</code>, <code>lg</code>, or <code>mixed</code>, and adjust the live playground without remounting.</p>
        <CodePreview code={SIZES_CODE} language="typescript">
          <div style={{ display: 'grid', gap: 16, padding: 24 }}>
            <Snowflakes count={count} size={size} wind={2} style={snowStyle}>{size} particles</Snowflakes>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {([20, 35, 70] as const).map((value) => <Button key={value} variant="ghost" active={count === value} onClick={() => setCount(value)}>{value} flakes</Button>)}
              {(['sm', 'md', 'lg', 'mixed'] as const).map((value) => <Button key={value} variant="outline" active={size === value} onClick={() => setSize(value)}>{value}</Button>)}
            </div>
          </div>
        </CodePreview>
      </section>
      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'enabled / spSnowflakes', type: 'boolean', defaultValue: 'true', description: 'Enable or disable the effect.' },
          { name: 'snowflakeCount / count', type: 'number', defaultValue: '30', description: 'Number of active falling flakes.' },
          { name: 'snowflakeSize / size', type: "'sm' | 'md' | 'lg' | 'mixed'", defaultValue: "'mixed'", description: 'Particle size preset.' },
          { name: 'snowflakeSpeed / speed', type: 'number', defaultValue: '1', description: 'Fall speed multiplier.' },
          { name: 'snowflakeColor / color', type: 'string', defaultValue: "'#ffffff'", description: 'Any CSS color string.' },
          { name: 'wind', type: 'number', defaultValue: '1', description: 'Horizontal drift force from -5 to 5.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
