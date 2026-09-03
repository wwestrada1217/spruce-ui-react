import { useState } from 'react';
import { Button, Card, Fade } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [
  { id: 'mount', label: 'Mount Trigger' },
  { id: 'directions', label: 'Directions' },
  { id: 'viewport', label: 'Viewport Trigger' },
  { id: 'api', label: 'API' },
];

const MOUNT_CODE = `import { useState } from 'react';
import { Fade, Button, Card } from 'spruce-react';

const [visible, setVisible] = useState(true);

<Button onClick={() => setVisible((value) => !value)}>Toggle</Button>
<Fade visible={visible} fadeDirection="up" fadeDuration={400} fadeDistance={24}>
  <Card>Fades in and out with a directional offset.</Card>
</Fade>`;

const DIRECTIONS_CODE = `<Fade fadeTrigger="mount" fadeDirection="up">Up</Fade>
<Fade fadeTrigger="mount" fadeDirection="down">Down</Fade>
<Fade fadeTrigger="mount" fadeDirection="left">Left</Fade>
<Fade fadeTrigger="mount" fadeDirection="right">Right</Fade>
<Fade fadeTrigger="mount" fadeDirection="none">Opacity only</Fade>`;

const VIEWPORT_CODE = `// The default trigger is viewport.
<Fade fadeDistance={32} fadeThreshold={0.1}>Revealed in view</Fade>
<Fade fadeOnce={false}>Replays on every re-entry</Fade>`;

export function FadePage() {
  const [visible, setVisible] = useState(true);

  return (
    <EffectDocsLayout
      title="Fade"
      description="A directional opacity transition with mount, controlled, and IntersectionObserver viewport triggers."
      sections={SECTIONS}
    >
      <section id="mount" className="demo-section">
        <h2>Mount &amp; Controlled Visibility</h2>
        <p className="section-desc">Use the controlled <code>visible</code> prop for toggles, or use <code>fadeTrigger="mount"</code> for an entrance on mount.</p>
        <CodePreview code={MOUNT_CODE} language="typescript">
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
            <Button onClick={() => setVisible((value) => !value)}>
              {visible ? 'Hide' : 'Show'} card
            </Button>
            <Fade visible={visible} fadeDirection="up" fadeDuration={400} fadeDistance={24}>
              <Card>Fades in and out with a directional offset.</Card>
            </Fade>
          </div>
        </CodePreview>
      </section>

      <section id="directions" className="demo-section">
        <h2>Directions &amp; Distance</h2>
        <p className="section-desc">Choose the entry direction or use <code>none</code> for opacity-only motion. The initial travel distance is configurable.</p>
        <CodePreview code={DIRECTIONS_CODE} language="typescript">
          <div style={{ padding: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Fade fadeTrigger="mount" fadeDirection="up"><Card>Up</Card></Fade>
            <Fade fadeTrigger="mount" fadeDirection="down"><Card>Down</Card></Fade>
            <Fade fadeTrigger="mount" fadeDirection="left"><Card>Left</Card></Fade>
            <Fade fadeTrigger="mount" fadeDirection="right"><Card>Right</Card></Fade>
            <Fade fadeTrigger="mount" fadeDirection="none"><Card>Opacity only</Card></Fade>
          </div>
        </CodePreview>
      </section>

      <section id="viewport" className="demo-section">
        <h2>Viewport Trigger</h2>
        <p className="section-desc">The default viewport trigger uses <code>IntersectionObserver</code>; set <code>fadeOnce</code> to false to replay when the content re-enters.</p>
        <CodePreview code={VIEWPORT_CODE} language="typescript">
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Fade fadeDistance={32} fadeThreshold={0.1}><Card>Revealed in view</Card></Fade>
            <Fade fadeOnce={false}><Card>Replayable on re-entry</Card></Fade>
          </div>
        </CodePreview>
      </section>

      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'enabled', type: 'boolean', defaultValue: 'true', description: 'Enable or disable the effect.' },
          { name: 'fadeDirection', type: "'up' | 'down' | 'left' | 'right' | 'none'", defaultValue: "'up'", description: 'Entry direction.' },
          { name: 'fadeDuration', type: 'number', defaultValue: '600', description: 'Transition duration in milliseconds.' },
          { name: 'fadeDelay', type: 'number', defaultValue: '0', description: 'Delay before the transition starts in milliseconds.' },
          { name: 'fadeDistance', type: 'number', defaultValue: '24', description: 'Directional travel distance in pixels.' },
          { name: 'fadeTrigger', type: "'mount' | 'viewport'", defaultValue: "'viewport'", description: 'When to reveal the content.' },
          { name: 'fadeThreshold', type: 'number', defaultValue: '0.1', description: 'IntersectionObserver threshold, clamped to 0–1.' },
          { name: 'fadeOnce', type: 'boolean', defaultValue: 'true', description: 'Disconnect after the first viewport entry; false replays on re-entry.' },
          { name: 'visible / duration / direction', type: 'boolean / number / FadeDirection', defaultValue: '—', description: 'Backwards-compatible controlled visibility aliases.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
