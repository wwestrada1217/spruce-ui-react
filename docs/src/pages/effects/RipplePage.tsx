import { Button, Card, Ripple } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [
  { id: 'basic', label: 'Basic Usage' },
  { id: 'centered', label: 'Centered & Unbounded' },
  { id: 'custom', label: 'Custom Color' },
  { id: 'api', label: 'API' },
];

const BASIC_CODE = `import { Button, Card, Ripple } from 'spruce-react';

<Ripple><Button variant="primary">Spruce button</Button></Ripple>
<Ripple><Card>Clickable card surface</Card></Ripple>`;
const CENTERED_CODE = `<Ripple rippleCentered><Button iconLeft="plus">Centered icon action</Button></Ripple>
<Ripple rippleUnbounded><Card>Unbounded wave</Card></Ripple>`;
const CUSTOM_CODE = `<Ripple rippleColor="var(--sp-info)"><Card>Blue ink</Card></Ripple>
<Ripple rippleDisabled><Button>Ripple disabled</Button></Ripple>`;

export function RipplePage() {
  return (
    <EffectDocsLayout title="Ripple" description="Material-style ink feedback for buttons, cards, list items, chips, and circular controls. Waves respect reduced-motion preferences and can be centered or unbounded." sections={SECTIONS} packageName="spruce-react" packageSymbols={['Ripple', 'useRipple']}>
      <section id="basic" className="demo-section">
        <h2>Basic Usage</h2>
        <p className="section-desc">Wrap any surface with <code>Ripple</code> to create a fluid wave from the pointer location.</p>
        <CodePreview code={BASIC_CODE} language="tsx">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', padding: 24 }}>
            <Ripple><Button variant="primary">Spruce button</Button></Ripple>
            <Ripple><Card>Clickable card surface</Card></Ripple>
          </div>
        </CodePreview>
      </section>
      <section id="centered" className="demo-section">
        <h2>Centered &amp; Unbounded</h2>
        <p className="section-desc"><code>rippleCentered</code> is useful for icon actions. <code>rippleUnbounded</code> lets the wave cross the host boundary.</p>
        <CodePreview code={CENTERED_CODE} language="tsx">
          <div style={{ display: 'flex', gap: 16, padding: 24 }}>
            <Ripple rippleCentered><Button iconLeft="plus">Centered icon action</Button></Ripple>
            <Ripple rippleUnbounded><Card>Unbounded wave</Card></Ripple>
          </div>
        </CodePreview>
      </section>
      <section id="custom" className="demo-section">
        <h2>Custom Color &amp; Disabled State</h2>
        <CodePreview code={CUSTOM_CODE} language="tsx">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: 24 }}>
            <Ripple rippleColor="var(--sp-info)"><Card>Blue ink</Card></Ripple>
            <Ripple rippleDisabled><Button>Ripple disabled</Button></Ripple>
          </div>
        </CodePreview>
      </section>
      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'enabled / spRipple', type: 'boolean', defaultValue: 'true', description: 'Enable or disable the effect.' },
          { name: 'rippleColor', type: 'string', defaultValue: 'currentColor', description: 'Wave color or CSS variable.' },
          { name: 'rippleDuration', type: 'number', defaultValue: '500', description: 'Expansion duration in milliseconds.' },
          { name: 'rippleCentered', type: 'boolean', defaultValue: 'false', description: 'Start from the geometric center.' },
          { name: 'rippleUnbounded', type: 'boolean', defaultValue: 'false', description: 'Allow the wave to overflow the host.' },
          { name: 'rippleDisabled', type: 'boolean', defaultValue: 'false', description: 'Suppress pointer feedback.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
