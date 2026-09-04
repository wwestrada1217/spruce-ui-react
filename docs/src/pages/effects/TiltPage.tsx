import { Card, Tilt } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [{ id: 'basic', label: 'Basic Tilt' }, { id: 'glare', label: 'Dynamic Glare' }, { id: 'axes', label: 'Axes & Reverse' }, { id: 'api', label: 'API' }];
const BASIC_CODE = `<Tilt tiltMax={15} tiltScale={1.03}><Card>Move the pointer across me</Card></Tilt>`;
const GLARE_CODE = `<Tilt tiltGlare tiltScale={1.06}><Card>Specular glare</Card></Tilt>`;
const AXES_CODE = `<Tilt tiltAxis="x" tiltMax={20}><Card>X axis only</Card></Tilt>
<Tilt tiltAxis="y" tiltReverse><Card>Reversed Y axis</Card></Tilt>`;

export function TiltPage() {
  return (
    <EffectDocsLayout title="3D Tilt" description="Cursor-tracked perspective tilt with optional specular glare, axis constraints, reverse direction, and reduced-motion support." sections={SECTIONS} packageName="spruce-react" packageSymbols={['Tilt', 'useTilt']}>
      <section id="basic" className="demo-section"><h2>Basic Tilt</h2><p className="section-desc">Move across the surface to preview perspective rotation and hover scaling.</p><CodePreview code={BASIC_CODE} language="tsx"><Tilt style={{ display: 'inline-block' }}><Card>Move the pointer across me</Card></Tilt></CodePreview></section>
      <section id="glare" className="demo-section"><h2>Dynamic Glare</h2><p className="section-desc">Enable <code>tiltGlare</code> to add a light reflection that follows the pointer.</p><CodePreview code={GLARE_CODE} language="tsx"><Tilt tiltGlare tiltScale={1.06} style={{ display: 'inline-block' }}><Card>Specular glare</Card></Tilt></CodePreview></section>
      <section id="axes" className="demo-section"><h2>Axes &amp; Reverse</h2><CodePreview code={AXES_CODE} language="tsx"><div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}><Tilt tiltAxis="x" tiltMax={20}><Card>X axis only</Card></Tilt><Tilt tiltAxis="y" tiltReverse><Card>Reversed Y axis</Card></Tilt></div></CodePreview></section>
      <section id="api" className="demo-section"><h2>API</h2><EffectApiTable rows={[
        { name: 'tiltMax', type: 'number', defaultValue: '15', description: 'Maximum rotation angle in degrees.' },
        { name: 'tiltPerspective', type: 'number', defaultValue: '1000', description: 'Perspective depth in pixels.' },
        { name: 'tiltScale', type: 'number', defaultValue: '1.03', description: 'Scale multiplier while hovering.' },
        { name: 'tiltAxis', type: "'both' | 'x' | 'y'", defaultValue: "'both'", description: 'Restrict the rotation axis.' },
        { name: 'tiltReverse', type: 'boolean', defaultValue: 'false', description: 'Reverse the pointer-to-rotation direction.' },
        { name: 'tiltGlare / tiltGlareMaxOpacity / tiltGlareColor', type: 'boolean / number / string', defaultValue: 'false / 0.35 / white', description: 'Configure the optional surface reflection.' },
      ]} /></section>
    </EffectDocsLayout>
  );
}
