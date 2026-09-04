import { Button, Icon, IconMotion } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [{ id: 'motions', label: 'Button Motions' }, { id: 'swap', label: 'Icon Swap' }, { id: 'standalone', label: 'Standalone Icons' }, { id: 'api', label: 'API' }];
const MOTIONS_CODE = `<IconMotion iconMotion="slide-right"><Button iconRight="arrow-right">Continue</Button></IconMotion>
<IconMotion iconMotion="spin"><Button iconLeft="refresh-cw">Sync data</Button></IconMotion>
<IconMotion iconMotion="wiggle"><Button iconLeft="bell">Alerts</Button></IconMotion>`;
const SWAP_CODE = `<IconMotion swapIcon="check" swapTransition="crossfade">
  <Button iconLeft="copy">Copy code</Button>
</IconMotion>`;
const STANDALONE_CODE = `<IconMotion iconMotion="spin-continuous"><Icon name="loader" size={24} /></IconMotion>
<IconMotion iconMotion="float"><Icon name="cloud" size={24} /></IconMotion>`;

export function IconMotionPage() {
  return (
    <EffectDocsLayout title="Icon Motion" description="Animate icons on hover, focus, or active state, and smoothly swap one registered icon for another." sections={SECTIONS} packageName="spruce-react" packageSymbols={['IconMotion']}>
      <section id="motions" className="demo-section"><h2>Button Icon Motions</h2><p className="section-desc">Wrap a Spruce button or another icon-bearing control to animate its first icon.</p><CodePreview code={MOTIONS_CODE} language="tsx"><div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: 24 }}><IconMotion iconMotion="slide-right"><Button iconRight="arrow-right">Continue</Button></IconMotion><IconMotion iconMotion="spin"><Button iconLeft="refresh-cw">Sync data</Button></IconMotion><IconMotion iconMotion="wiggle"><Button iconLeft="bell">Alerts</Button></IconMotion></div></CodePreview></section>
      <section id="swap" className="demo-section"><h2>Icon Morph &amp; Swap</h2><p className="section-desc">Set <code>swapIcon</code> to transition the first icon into another registered icon.</p><CodePreview code={SWAP_CODE} language="tsx"><div style={{ padding: 24 }}><IconMotion swapIcon="check" swapTransition="crossfade"><Button iconLeft="copy">Copy code</Button></IconMotion></div></CodePreview></section>
      <section id="standalone" className="demo-section"><h2>Standalone Icons</h2><CodePreview code={STANDALONE_CODE} language="tsx"><div style={{ display: 'flex', gap: 24, padding: 24 }}><IconMotion iconMotion="spin-continuous"><Icon name="loader" size={24} /></IconMotion><IconMotion iconMotion="float"><Icon name="cloud" size={24} /></IconMotion><IconMotion iconMotion="pop"><Icon name="thumbs-up" size={24} /></IconMotion></div></CodePreview></section>
      <section id="api" className="demo-section"><h2>API</h2><EffectApiTable rows={[
        { name: 'iconMotion', type: 'IconMotionType', defaultValue: "'bounce'", description: 'Motion pattern such as slide, spin, pulse, wiggle, float, or pop.' },
        { name: 'swapIcon', type: 'string | null', defaultValue: 'null', description: 'Registered icon name to show during the active state.' },
        { name: 'swapTransition', type: 'IconSwapTransition', defaultValue: "'crossfade'", description: 'crossfade, flip, rotate, slide-up, or scale.' },
        { name: 'motionTrigger', type: "'hover' | 'active' | 'always'", defaultValue: "'hover'", description: 'When the motion is active.' },
        { name: 'motionDuration', type: 'number', defaultValue: '300', description: 'Animation duration in milliseconds.' },
      ]} /></section>
    </EffectDocsLayout>
  );
}
