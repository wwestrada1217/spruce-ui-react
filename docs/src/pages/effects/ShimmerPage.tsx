import { Card, Shimmer } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [
  { id: 'overlay', label: 'Overlay' },
  { id: 'skeleton', label: 'Skeleton' },
  { id: 'directions', label: 'Directions' },
  { id: 'api', label: 'API' },
];

const OVERLAY_CODE = `<Shimmer shimmerColor="rgba(255, 255, 255, 0.4)" shimmerDuration={1500}>
  <Card>Content with a shimmer overlay</Card>
</Shimmer>`;

const SKELETON_CODE = `<Shimmer
  enabled={loading}
  shimmerSkeleton={loading}
  width="100%"
  height={120}
  borderRadius={6}
/>`;

const DIRECTIONS_CODE = `<Shimmer shimmerDirection="left-right">Left to right</Shimmer>
<Shimmer shimmerDirection="right-left">Right to left</Shimmer>
<Shimmer shimmerDirection="top-bottom">Top to bottom</Shimmer>
<Shimmer shimmerDirection="diagonal">Diagonal</Shimmer>`;

export function ShimmerPage() {
  return (
    <EffectDocsLayout
      title="Shimmer"
      description="A configurable loading sweep that can overlay content or render accessible skeleton placeholders."
      sections={SECTIONS}
    >
      <section id="overlay" className="demo-section">
        <h2>Content Overlay</h2>
        <p className="section-desc">Keep the content in place while a translucent band sweeps across the host.</p>
        <CodePreview code={OVERLAY_CODE} language="typescript">
          <div style={{ padding: 16 }}>
            <Shimmer shimmerColor="rgba(255, 255, 255, 0.4)" shimmerDuration={1500}>
              <Card>Content with a shimmer overlay</Card>
            </Shimmer>
          </div>
        </CodePreview>
      </section>

      <section id="skeleton" className="demo-section">
        <h2>Skeleton Placeholder</h2>
        <p className="section-desc">Set <code>shimmerSkeleton</code> while loading to hide visual content and expose <code>aria-busy</code>.</p>
        <CodePreview code={SKELETON_CODE} language="typescript">
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Shimmer shimmerSkeleton width="100%" height={120} borderRadius={6} />
            <Shimmer shimmerSkeleton width="70%" height={16} />
            <Shimmer shimmerSkeleton width="40%" height={14} />
          </div>
        </CodePreview>
      </section>

      <section id="directions" className="demo-section">
        <h2>Directions &amp; Custom Color</h2>
        <p className="section-desc">Choose the sweep direction and pass any valid CSS color for the highlight.</p>
        <CodePreview code={DIRECTIONS_CODE} language="typescript">
          <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            {(['left-right', 'right-left', 'top-bottom', 'diagonal'] as const).map((direction) => (
              <Shimmer key={direction} shimmerDirection={direction} shimmerColor="rgba(59, 130, 246, 0.3)" style={{ padding: 16, border: '1px solid var(--sp-border)' }}>
                {direction}
              </Shimmer>
            ))}
          </div>
        </CodePreview>
      </section>

      <section id="api" className="demo-section">
        <h2>API</h2>
        <EffectApiTable rows={[
          { name: 'enabled', type: 'boolean', defaultValue: 'true', description: 'Enable or disable the effect.' },
          { name: 'shimmerDuration', type: 'number', defaultValue: '1500', description: 'Sweep duration in milliseconds.' },
          { name: 'shimmerDirection', type: "'left-right' | 'right-left' | 'top-bottom' | 'diagonal'", defaultValue: "'left-right'", description: 'Sweep direction.' },
          { name: 'shimmerColor', type: 'string', defaultValue: "'rgba(255, 255, 255, 0.4)'", description: 'Highlight color.' },
          { name: 'shimmerSkeleton', type: 'boolean', defaultValue: 'false', description: 'Hide visual content and apply skeleton surface styling.' },
          { name: 'active', type: 'boolean', defaultValue: '—', description: 'Backwards-compatible alias for enabled.' },
          { name: 'width / height / borderRadius', type: 'number | string', defaultValue: '—', description: 'Optional host dimensions and radius.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
