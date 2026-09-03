import { useState } from 'react';
import { Button, Thermometer } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [{ id: 'playground', label: 'Playground' }, { id: 'ranges', label: 'Color ranges' }, { id: 'api', label: 'API' }];
const PLAYGROUND_CODE = `import { Thermometer } from 'spruce-react';

<Thermometer temperature={24} minTemp={-20} maxTemp={50} size="xl" />`;
const RANGES_CODE = `<Thermometer temperature={-5} size="lg" />
<Thermometer temperature={24} size="lg" />
<Thermometer temperature={48} size="lg" />`;

export function ThermometerPage() {
  const [temperature, setTemperature] = useState(24);
  return (
    <EffectDocsLayout title="Thermometer Effect" description="A vector thermometer that raises its fluid column and changes color across freezing, cool, normal, warm, and hot thresholds." sections={SECTIONS}>
      <section id="playground" className="demo-section">
        <h2>Interactive temperature controls</h2>
        <p className="section-desc">Choose a preset to see the column and automatic liquid color respond.</p>
        <CodePreview code={PLAYGROUND_CODE} language="typescript">
          <div style={{ display: 'grid', gap: 16, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}><Thermometer temperature={temperature} size="xl" showTicks showLabel /></div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              {([-10, 14, 24, 36, 45] as const).map((value) => <Button key={value} variant="ghost" active={temperature === value} onClick={() => setTemperature(value)}>{value}°C</Button>)}
            </div>
          </div>
        </CodePreview>
      </section>
      <section id="ranges" className="demo-section">
        <h2>Dynamic color ranges</h2>
        <p className="section-desc">Colors transition at 0°C, 18°C, 30°C, and 40°C; temperatures over 40°C pulse.</p>
        <CodePreview code={RANGES_CODE} language="typescript">
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'center', gap: 24, flexWrap: 'wrap', padding: 24 }}>
            <Thermometer temperature={-5} size="lg" />
            <Thermometer temperature={12} size="lg" />
            <Thermometer temperature={24} size="lg" />
            <Thermometer temperature={35} size="lg" />
            <Thermometer temperature={48} size="lg" />
          </div>
        </CodePreview>
      </section>
      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'temperature', type: 'number', defaultValue: '25', description: 'Current temperature value.' },
          { name: 'minTemp / maxTemp', type: 'number', defaultValue: '-20 / 50', description: 'Scale bounds used to position the fluid column.' },
          { name: 'unit', type: "'°C' | '°F'", defaultValue: "'°C'", description: 'Displayed temperature unit.' },
          { name: 'color', type: 'string | null', defaultValue: 'null', description: 'Optional custom liquid color; otherwise thresholds choose the color.' },
          { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | number", defaultValue: "'md'", description: 'Thermometer width preset or pixel width.' },
          { name: 'showTicks / showLabel', type: 'boolean', defaultValue: 'true / true', description: 'Toggle scale ticks and the numeric label.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
