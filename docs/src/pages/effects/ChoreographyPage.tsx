import { useState } from 'react';
import {
  Button,
  ContentTransition,
  Fade,
  Glow,
  Shimmer,
  Slide,
  Sparkles,
  useReducedMotion,
} from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { EffectApiTable, EffectDocsLayout } from './EffectDocsLayout';

const SECTIONS = [
  { id: 'overview', label: 'Composition model' },
  { id: 'coordination', label: 'Trigger coordination' },
  { id: 'interruption', label: 'Interruption & cancellation' },
  { id: 'layering', label: 'Layering & focus' },
  { id: 'reduced-motion', label: 'Reduced motion' },
  { id: 'api', label: 'Timing reference' },
];

const SURFACE_STYLE = {
  padding: 20,
  border: '1px solid var(--sp-border)',
  borderRadius: 'var(--sp-radius-lg)',
  background: 'var(--sp-surface-raised)',
};

const COORDINATION_CODE = `import { useState } from 'react';
import { Fade, Glow, Shimmer, Slide } from 'spruce-react';

const [visible, setVisible] = useState(true);

<Slide slideTrigger="mount" slideDirection="up" slideDuration={300}>
  <Glow enabled={visible} glowVariant="breathe">
    <Fade visible={visible} fadeDuration={300} fadeDistance={8}>
      <Shimmer enabled={visible} shimmerDuration={1200}>
        <StatusCard />
      </Shimmer>
    </Fade>
  </Glow>
</Slide>`;

const INTERRUPTION_CODE = `const [showDetails, setShowDetails] = useState(false);

<ContentTransition
  active={showDetails}
  trigger="manual"
  transitionType="slide-left"
  duration={300}
  ariaLabel="Deployment status"
  front={<Summary />}
  back={<Details />}
/>

<Button onClick={() => setShowDetails((value) => !value)}>
  Toggle details
</Button>`;

const LAYERING_CODE = `import { Button, Sparkles, Glow } from 'spruce-react';

<Glow enabled={celebrating} glowVariant="steady">
  <Sparkles enabled={celebrating} sparkleCount={6}>
    <Button onClick={onCelebrate}>Celebrate release</Button>
  </Sparkles>
</Glow>`;

export function ChoreographyPage() {
  const [visible, setVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <EffectDocsLayout
      title="Effects Choreography"
      description="Coordinate Spruce effects with one state machine, shared timing tokens, and safe interruption boundaries."
      sections={SECTIONS}
      packageName="spruce-react"
      packageSymbols={['Fade', 'Slide', 'Shimmer', 'ContentTransition', 'Sparkles', 'useReducedMotion']}
    >
      <section id="overview" className="demo-section">
        <h2>Composition model</h2>
        <p className="section-desc">
          Effects are independent presentation components. Keep the trigger, lifecycle, and business state in the
          parent, then pass the same state to each effect that belongs to the sequence. This keeps the choreography
          predictable without adding a second runtime or a page-local animation abstraction.
        </p>
        <div style={{ ...SURFACE_STYLE, display: 'grid', gap: 12 }}>
          <strong>Recommended ownership</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <div><strong>Trigger</strong><p className="section-desc">Own click, submit, viewport, or async events in the parent.</p></div>
            <div><strong>Sequence</strong><p className="section-desc">Share state and tokenized durations across effects.</p></div>
            <div><strong>Content</strong><p className="section-desc">Keep focusable content mounted and semantically visible.</p></div>
          </div>
        </div>
      </section>

      <section id="coordination" className="demo-section">
        <h2>Coordinate triggers with shared state</h2>
        <p className="section-desc">
          Use one boolean to start and stop a group. Each effect still owns its own cleanup and reduced-motion
          behavior, while the parent makes the sequence understandable to users and assistive technology.
        </p>
        <CodePreview code={COORDINATION_CODE} language="typescript">
          <div style={{ display: 'grid', gap: 16, maxWidth: 520 }}>
            <Slide slideTrigger="mount" slideDirection="up" slideDuration={300}>
              <Glow enabled={visible} glowVariant="breathe" glowSpeed={2.2}>
                <Fade visible={visible} fadeTrigger="mount" fadeDirection="up" fadeDuration={300} fadeDistance={8}>
                  <Shimmer enabled={visible} shimmerDuration={1200}>
                    <div style={SURFACE_STYLE}>
                      <strong>Release notes ready</strong>
                      <p className="section-desc">Fade controls entry, shimmer signals freshness, and glow adds a quiet emphasis.</p>
                    </div>
                  </Shimmer>
                </Fade>
              </Glow>
            </Slide>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Button onClick={() => setVisible((value) => !value)}>{visible ? 'Pause sequence' : 'Run sequence'}</Button>
              <span role="status" aria-live="polite">{visible ? 'Sequence active' : 'Sequence paused'}</span>
            </div>
          </div>
        </CodePreview>
      </section>

      <section id="interruption" className="demo-section">
        <h2>Interrupt and cancel safely</h2>
        <p className="section-desc">
          Controlled effects can be reversed immediately. Rapidly toggle the example to see the latest state win;
          the components cancel their observers, timers, and transition work during cleanup. Do not sequence effects
          by waiting on arbitrary timeouts when the next state is already known.
        </p>
        <CodePreview code={INTERRUPTION_CODE} language="typescript">
          <div style={{ display: 'grid', gap: 16, maxWidth: 520 }}>
            <ContentTransition
              active={showDetails}
              trigger="manual"
              transitionType="slide-left"
              duration={300}
              ariaLabel="Deployment status"
              style={{ minHeight: 132 }}
              front={<div style={SURFACE_STYLE}><strong>Deployment queued</strong><p className="section-desc">The next action is ready for review.</p></div>}
              back={<div style={SURFACE_STYLE}><strong>Deployment details</strong><p className="section-desc">Region: Manila · checks: passing · owner: Platform.</p></div>}
            />
            <Button onClick={() => setShowDetails((value) => !value)}>{showDetails ? 'Show summary' : 'Show details'}</Button>
          </div>
        </CodePreview>
      </section>

      <section id="layering" className="demo-section">
        <h2>Layer decoration without stealing interaction</h2>
        <p className="section-desc">
          Put decorative effects outside the interactive control. Sparkles and glow are aria-hidden presentation;
          the button remains the only focus target and owns the accessible action name.
        </p>
        <CodePreview code={LAYERING_CODE} language="typescript">
          <div style={{ padding: 28, display: 'flex', justifyContent: 'center' }}>
            <Glow enabled={celebrating} glowVariant="steady" glowRadius={18}>
              <Sparkles enabled={celebrating && !reducedMotion} sparkleColor="rainbow" sparkleCount={6} sparkleInterval={500}>
                <Button onClick={() => setCelebrating((value) => !value)}>
                  {celebrating ? 'Stop celebration' : 'Celebrate release'}
                </Button>
              </Sparkles>
            </Glow>
          </div>
        </CodePreview>
      </section>

      <section id="reduced-motion" className="demo-section">
        <h2>Reduced-motion fallback</h2>
        <p className="section-desc">
          Every effect should remain understandable without animation. Spruce effects honor
          <code>prefers-reduced-motion</code>; use <code>useReducedMotion</code> when coordinating decorative work
          or when you need to replace motion with a status update.
        </p>
        <div style={{ ...SURFACE_STYLE, display: 'grid', gap: 8 }}>
          <strong>{reducedMotion ? 'Reduced motion is enabled' : 'Motion is enabled'}</strong>
          <span role="status" aria-live="polite">
            {reducedMotion ? 'The sequence uses immediate state changes and no decorative particles.' : 'The sequence may use the configured transitions and decorative effects.'}
          </span>
          <p className="section-desc">Keep loading, success, and error states visible in the DOM; motion should reinforce state, never carry its meaning.</p>
        </div>
      </section>

      <section id="api" className="demo-section">
        <h2>Timing and safety reference</h2>
        <EffectApiTable rows={[
          { name: '--sp-duration-fast', type: 'CSS custom property', defaultValue: '100ms', description: 'Short feedback such as hover or pressed-state emphasis.' },
          { name: '--sp-duration-normal', type: 'CSS custom property', defaultValue: '200ms', description: 'Default component transitions and small state changes.' },
          { name: '--sp-duration-slow', type: 'CSS custom property', defaultValue: '300ms', description: 'Larger panel, layout, and staged transitions.' },
          { name: 'duration / fadeDuration / slideDuration', type: 'number', defaultValue: 'component-specific', description: 'Use the smallest duration that preserves comprehension; coordinate values from the parent.' },
          { name: 'useReducedMotion()', type: '() => boolean', defaultValue: 'false', description: 'Opt out of decorative effects or replace motion-dependent feedback with text/status UI.' },
          { name: 'focus and interaction', type: 'guidance', defaultValue: '—', description: 'Do not move focus during decoration. Keep inactive content inert/hidden and restore focus after a real overlay closes.' },
        ]} />
      </section>
    </EffectDocsLayout>
  );
}
