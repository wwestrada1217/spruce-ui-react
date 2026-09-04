import { Button, Card, Slide } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [{ id: 'hover', label: 'Hover Lift' }, { id: 'mount', label: 'Mount Entrance' }, { id: 'viewport', label: 'Viewport Reveal' }, { id: 'api', label: 'API' }];
const HOVER_CODE = `<Slide slideDirection="up" slideDistance={10}><Card>Hover lift</Card></Slide>
<Slide slideDirection="right" slideDistance={8}><Button>Slide next</Button></Slide>`;
const MOUNT_CODE = `<Slide slideTrigger="mount" slideDirection="left" slideDistance={24}>
  <Card>Entrance motion</Card>
</Slide>`;
const VIEWPORT_CODE = `<Slide slideTrigger="viewport" slideDirection="up" slideDistance={32}>
  <Card>Revealed as it enters the viewport</Card>
</Slide>`;

export function SlidePage() {
  return (
    <EffectDocsLayout title="Slide Motion" description="Directional sliding and elevation-lift motion for cards, buttons, banners, and empty states with hover, mount, and viewport triggers." sections={SECTIONS} packageName="spruce-react" packageSymbols={['Slide', 'useSlide']}>
      <section id="hover" className="demo-section"><h2>Hover Lift</h2><p className="section-desc">Use a small distance for a subtle physical response on interactive surfaces.</p><CodePreview code={HOVER_CODE} language="tsx"><div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: 24, alignItems: 'center' }}><Slide slideDirection="up" slideDistance={10}><Card>Hover lift</Card></Slide><Slide slideDirection="right" slideDistance={8}><Button>Slide next</Button></Slide></div></CodePreview></section>
      <section id="mount" className="demo-section"><h2>Mount Entrance</h2><CodePreview code={MOUNT_CODE} language="tsx"><Slide slideTrigger="mount" slideDirection="left" slideDistance={24}><Card>Entrance motion</Card></Slide></CodePreview></section>
      <section id="viewport" className="demo-section"><h2>Viewport Reveal</h2><p className="section-desc">The viewport trigger uses <code>IntersectionObserver</code> and reveals the content once it enters view.</p><CodePreview code={VIEWPORT_CODE} language="tsx"><Slide slideTrigger="viewport" slideDirection="up" slideDistance={32}><Card>Revealed as it enters the viewport</Card></Slide></CodePreview></section>
      <section id="api" className="demo-section"><h2>API</h2><EffectApiTable rows={[
        { name: 'slideDirection', type: "'up' | 'down' | 'left' | 'right'", defaultValue: "'up'", description: 'Direction of travel.' },
        { name: 'slideDistance', type: 'number', defaultValue: '8', description: 'Travel distance in pixels.' },
        { name: 'slideTrigger', type: "'hover' | 'mount' | 'viewport'", defaultValue: "'hover'", description: 'When to activate the motion.' },
        { name: 'slideDuration / slideDelay', type: 'number', defaultValue: '300 / 0', description: 'Duration and delay in milliseconds.' },
        { name: 'slideEasing', type: 'string', defaultValue: "'cubic-bezier(0.16, 1, 0.3, 1)'", description: 'CSS timing function.' },
      ]} /></section>
    </EffectDocsLayout>
  );
}
