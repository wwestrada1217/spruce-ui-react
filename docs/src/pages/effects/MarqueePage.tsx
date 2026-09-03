import { Badge, Marquee } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [
  { id: 'horizontal', label: 'Horizontal Ticker' },
  { id: 'directions', label: 'Directions' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'api', label: 'API' },
];

const HORIZONTAL_CODE = `<Marquee speed={15} gap={24} ariaLabel="Product updates">
  <Badge variant="primary">Vite support</Badge>
  <Badge variant="success">80+ components</Badge>
  <Badge variant="info">Design tokens</Badge>
</Marquee>`;

const DIRECTIONS_CODE = `<Marquee direction="right" speed={15}>...</Marquee>
<Marquee direction="up" speed={10}>...</Marquee>
<Marquee direction="down" speed={10}>...</Marquee>`;

export function MarqueePage() {
  return (
    <EffectDocsLayout
      title="Marquee"
      description="An accessible infinite ticker for announcements, partner logos, and compact status updates."
      sections={SECTIONS}
    >
      <section id="horizontal" className="demo-section">
        <h2>Horizontal Ticker</h2>
        <p className="section-desc">The content is duplicated automatically for a seamless loop; the duplicate is hidden from assistive technology.</p>
        <CodePreview code={HORIZONTAL_CODE} language="typescript">
          <div style={{ padding: 16, background: 'var(--sp-surface-100)', borderRadius: 'var(--sp-radius-md)' }}>
            <Marquee speed={15} gap={24} ariaLabel="Product updates">
              <Badge variant="primary">Vite support</Badge>
              <Badge variant="success">80+ components</Badge>
              <Badge variant="info">Design tokens</Badge>
              <Badge variant="warning">React 19 ready</Badge>
            </Marquee>
          </div>
        </CodePreview>
      </section>

      <section id="directions" className="demo-section">
        <h2>All Directions</h2>
        <p className="section-desc">Use left, right, up, or down motion. The vertical modes switch the track to a column layout.</p>
        <CodePreview code={DIRECTIONS_CODE} language="typescript">
          <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
            <Marquee direction="right" speed={15}><Badge variant="primary">Right</Badge><Badge variant="info">Ticker</Badge></Marquee>
            <div style={{ height: 96 }}><Marquee direction="up" speed={10}><Badge variant="success">Up</Badge><Badge variant="warning">Ticker</Badge></Marquee></div>
            <div style={{ height: 96 }}><Marquee direction="down" speed={10}><Badge variant="danger">Down</Badge><Badge variant="info">Ticker</Badge></Marquee></div>
          </div>
        </CodePreview>
      </section>

      <section id="accessibility" className="demo-section">
        <h2>Accessible Motion</h2>
        <p className="section-desc">The region exposes a label, duplicate content is inert, hover pauses by default, and <code>prefers-reduced-motion</code> stops the animation automatically.</p>
        <CodePreview code={`<Marquee pauseOnHover ariaLabel="Scrolling release notes">\n  {releaseNotes}\n</Marquee>`} language="typescript">
          <Marquee pauseOnHover ariaLabel="Scrolling release notes">
            <Badge variant="default">Hover to pause</Badge>
            <Badge variant="default">Reduced motion supported</Badge>
          </Marquee>
        </CodePreview>
      </section>

      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'direction', type: "'left' | 'right' | 'up' | 'down'", defaultValue: "'left'", description: 'Scroll direction.' },
          { name: 'speed', type: 'number', defaultValue: '20', description: 'Seconds for one complete loop.' },
          { name: 'gap', type: 'number', defaultValue: '24', description: 'Gap between repeated items in pixels.' },
          { name: 'pauseOnHover', type: 'boolean', defaultValue: 'true', description: 'Pause the track while hovered.' },
          { name: 'ariaLabel', type: 'string', defaultValue: "'Scrolling content'", description: 'Accessible label for the marquee region.' },
          { name: 'duplicate', type: 'ReactNode', defaultValue: 'children', description: 'Optional explicit duplicate content.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
