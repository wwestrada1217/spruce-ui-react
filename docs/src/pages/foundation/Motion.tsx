import { useState } from 'react'
import { FoundationPageShell } from '../../components/FoundationPageShell'
import { CodePreview } from '../../components/CodePreview'

const DURATIONS = [
  { token: '--sp-duration-instant', value: '50ms', usage: 'Checkbox ticks, toggle snaps' },
  { token: '--sp-duration-fast', value: '100ms', usage: 'Button hover, focus rings, micro-interactions' },
  { token: '--sp-duration-normal', value: '200ms', usage: 'Tooltips, dropdowns, fade-ins — the default' },
  { token: '--sp-duration-slow', value: '300ms', usage: 'Drawers, modals, expanding content' },
  { token: '--sp-duration-slower', value: '500ms', usage: 'Page transitions, complex orchestrated animations' },
]

const EASINGS = [
  { token: '--sp-ease-default', value: 'cubic-bezier(0.2, 0, 0, 1)', desc: 'General purpose — slightly decelerated' },
  { token: '--sp-ease-in', value: 'cubic-bezier(0.4, 0, 1, 1)', desc: 'Accelerates into the animation' },
  { token: '--sp-ease-out', value: 'cubic-bezier(0, 0, 0.2, 1)', desc: 'Decelerates to rest — ideal for entrances' },
  { token: '--sp-ease-in-out', value: 'cubic-bezier(0.4, 0, 0.2, 1)', desc: 'Smooth start and end — good for looping' },
  { token: '--sp-ease-spring', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', desc: 'Slight overshoot — playful, bouncy feel' },
  { token: '--sp-ease-bounce', value: 'cubic-bezier(0.34, 1.8, 0.64, 1)', desc: 'Strong overshoot — attention-grabbing' },
  { token: '--sp-ease-linear', value: 'linear', desc: 'Constant speed — progress bars, spinners' },
]

const DISTANCES = [
  { token: '--sp-motion-distance-sm', value: '4px', usage: 'Subtle shifts — badges, indicators' },
  { token: '--sp-motion-distance-md', value: '8px', usage: 'Default slide distance — tooltips, menus' },
  { token: '--sp-motion-distance-lg', value: '16px', usage: 'Prominent entrances — modals, drawers' },
  { token: '--sp-motion-distance-xl', value: '24px', usage: 'Large transitions — page-level animations' },
]

const SCALES = [
  { token: '--sp-motion-scale-in', value: '0.95', usage: 'Scale entrance start (grows to 1)' },
  { token: '--sp-motion-scale-out', value: '1.05', usage: 'Scale entrance from oversized (shrinks to 1)' },
]

const TRANSITION_CODE = `/* Hover lift pattern */
.my-card {
  transition:
    transform var(--sp-duration-normal) var(--sp-ease-spring),
    box-shadow var(--sp-duration-normal) var(--sp-ease-out);
}

.my-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--sp-shadow-lg);
}`

const PATTERNS = [
  { name: 'Fade In', className: 'sp-fade-in', demoClass: 'demo-fade', desc: 'Opacity 0 → 1' },
  { name: 'Slide Up', className: 'sp-slide-up-in', demoClass: 'demo-slide-up', desc: 'Slides up from below' },
  { name: 'Slide Down', className: 'sp-slide-down-in', demoClass: 'demo-slide-down', desc: 'Slides down from above' },
  { name: 'Slide Left', className: 'sp-slide-left-in', demoClass: 'demo-slide-left', desc: 'Enters from the right' },
  { name: 'Slide Right', className: 'sp-slide-right-in', demoClass: 'demo-slide-right', desc: 'Enters from the left' },
  { name: 'Scale In', className: 'sp-scale-in', demoClass: 'demo-scale-in', desc: 'Scales up from 0.95 with a spring' },
]

const UTILITIES = [
  { cls: '.sp-fade-in / .sp-fade-out', desc: 'Opacity entrance / exit' },
  { cls: '.sp-slide-up-in / .sp-slide-up-out', desc: 'Vertical slide entrance / exit' },
  { cls: '.sp-slide-down-in / .sp-slide-down-out', desc: 'Vertical slide from above' },
  { cls: '.sp-slide-left-in / .sp-slide-left-out', desc: 'Horizontal slide from the right' },
  { cls: '.sp-slide-right-in / .sp-slide-right-out', desc: 'Horizontal slide from the left' },
  { cls: '.sp-scale-in / .sp-scale-out / .sp-scale-up-in', desc: 'Scale entrances (spring) and exit' },
  { cls: '.sp-expand / .sp-collapse', desc: 'Accordion-style max-height reveal' },
  { cls: '.sp-spin', desc: 'Continuous rotation for spinners (0.8s linear)' },
  { cls: '.sp-stagger-in', desc: 'List entrance; delay = var(--sp-stagger-index) × 30ms' },
]

interface PatternDemoProps {
  pattern: typeof PATTERNS[number]
  index: number
}

function PatternDemo({ pattern }: PatternDemoProps) {
  const [key, setKey] = useState(0)

  return (
    <div
      className="pattern-card"
      role="button"
      tabIndex={0}
      title={`Click to replay ${pattern.name}`}
      onClick={() => setKey(k => k + 1)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setKey(k => k + 1)
        }
      }}
    >
      <div className="pattern-label">{pattern.name}</div>
      <div className="pattern-preview">
        <div key={key} className={`pattern-box ${pattern.demoClass}`} />
      </div>
      <div className="pattern-desc">{pattern.desc}</div>
      <code className="pattern-code">{pattern.className}</code>
    </div>
  )
}

function EasingCard({ easing, animate }: { easing: typeof EASINGS[number]; animate: number }) {
  return (
    <div className="easing-card">
      <div className="easing-label"><code>{easing.token}</code></div>
      <div className="easing-value"><code>{easing.value}</code></div>
      <div className="easing-desc">{easing.desc}</div>
      <div className="easing-track">
        <div
          key={animate}
          className="easing-dot easing-dot--animate"
          style={{ animationTimingFunction: `var(${easing.token}, ${easing.value})` }}
        />
      </div>
    </div>
  )
}

export function MotionPage() {
  const [easingKey, setEasingKey] = useState(0)

  return (
    <FoundationPageShell variant="motion" title="Motion" description="Tokens, patterns, and React animation utilities for consistent, accessible motion across the design system.">
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Motion</h1>
        <p className="page-lead">
          Tokens, patterns, and React animation utilities for consistent, accessible motion across
          the design system.
        </p>
      </div>

      <section id="duration" className="doc-section">
        <h2>Duration Tokens</h2>
        <p className="section-desc">
          Duration tokens define how long animations and transitions run. Use
          shorter durations for micro-interactions and longer ones for complex
          transitions.
        </p>
        <table className="token-table" aria-label="Duration tokens">
          <thead>
            <tr>
              <th>Token</th>
              <th>Value</th>
              <th>Usage</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {DURATIONS.map(d => (
              <tr key={d.token}>
                <td>{d.token}</td>
                <td>{d.value}</td>
                <td style={{ color: 'var(--text-3)' }}>{d.usage}</td>
                <td>
                  <div className="duration-bar-track">
                    <div
                      className="duration-bar-anim"
                      style={{ animationDuration: `var(${d.token})` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="easing" className="doc-section">
        <h2>Easing Tokens</h2>
        <p className="section-desc">
          Easing curves control the acceleration profile of animations. Each
          curve communicates a different feel — from snappy and functional to
          playful and bouncy.
        </p>
        <div className="easing-grid">
          {EASINGS.map(e => (
            <EasingCard key={e.token} easing={e} animate={easingKey} />
          ))}
        </div>
        <button
          className="motion-replay-btn"
          type="button"
          onClick={() => setEasingKey(k => k + 1)}
        >
          Replay
        </button>
      </section>

      <section id="reference" className="doc-section">
        <h2>Quick Reference</h2>
        <table className="token-table" aria-label="Motion quick reference">
          <thead><tr><th>Need</th><th>Use</th></tr></thead>
          <tbody>
            <tr><td>Micro interaction</td><td><code>--sp-duration-fast</code> + <code>--sp-ease-out</code></td></tr>
            <tr><td>Default entrance</td><td><code>.sp-fade-in</code> or <code>.sp-slide-up-in</code></td></tr>
            <tr><td>Transient overlay</td><td><code>--sp-duration-normal</code> + <code>--sp-motion-distance-md</code></td></tr>
            <tr><td>Reduced motion</td><td>Use tokens and verify <code>prefers-reduced-motion: reduce</code></td></tr>
          </tbody>
        </table>
      </section>

      <section id="distance" className="doc-section">
        <h2>Distance &amp; Scale Tokens</h2>
        <p className="section-desc">
          Distance tokens define how far elements travel during slide animations.
          Scale tokens define the shrink/grow factor for scale animations.
        </p>
        <table className="token-table" aria-label="Distance and scale tokens">
          <thead>
            <tr>
              <th>Token</th>
              <th>Value</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            {DISTANCES.map(d => (
              <tr key={d.token}>
                <td>{d.token}</td>
                <td>{d.value}</td>
                <td style={{ color: 'var(--text-3)' }}>{d.usage}</td>
              </tr>
            ))}
            {SCALES.map(s => (
              <tr key={s.token}>
                <td>{s.token}</td>
                <td>{s.value}</td>
                <td style={{ color: 'var(--text-3)' }}>{s.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="patterns" className="doc-section">
        <h2>Animation Patterns</h2>
        <p className="section-desc">
          Pre-built keyframe animations that consume motion tokens. Click any
          card to replay the animation. They correspond to CSS keyframes
          prefixed with <code>sp-</code>.
        </p>
        <div className="pattern-grid">
          {PATTERNS.map((p, i) => (
            <PatternDemo key={p.demoClass} pattern={p} index={i} />
          ))}
        </div>
        <h3>Utility classes</h3>
        <p className="section-desc">
          Every keyframe ships with a utility class that applies it with the
          default token timing. Stagger list entrances by setting{' '}
          <code>--sp-stagger-index</code> per item.
        </p>
        <table className="token-table" aria-label="Motion utility classes">
          <thead>
            <tr><th>Class</th><th>Effect</th></tr>
          </thead>
          <tbody>
            {UTILITIES.map(u => (
              <tr key={u.cls}>
                <td><code>{u.cls}</code></td>
                <td>{u.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="angular" className="doc-section">
        <h2>Angular Enter &amp; Leave Animations</h2>
        <p className="section-desc">
          React does not use Angular's animation DSL. Use the equivalent Spruce motion utility
          classes or CSS transitions for enter and leave states, and keep the same duration,
          distance, easing, and reduced-motion tokens.
        </p>
        <div className="code-block"><pre><code>{`<div className={isOpen ? 'sp-slide-up-in' : 'sp-slide-up-out'}>
  <Panel />
</div>`}</code></pre></div>
      </section>

      <section id="transitions" className="doc-section">
        <h2>CSS Transitions</h2>
        <p className="section-desc">
          Compose transition shorthand using duration and easing tokens for
          interactive state changes like hover, focus, and active.
        </p>
        <CodePreview code={TRANSITION_CODE} language="css">
          <div className="transition-demo">
            <div className="transition-card transition-card--hover">Hover me (lift)</div>
            <div className="transition-card transition-card--press">Press me (press)</div>
            <div className="transition-card transition-card--glow">Hover me (glow)</div>
          </div>
        </CodePreview>
      </section>

      <section id="accessibility" className="doc-section">
        <h2>Accessibility</h2>
        <p className="section-desc">
          The motion system automatically respects the{' '}
          <code>prefers-reduced-motion</code> media query. When a user has
          reduced motion enabled in their operating system, all duration tokens
          collapse to <code>0ms</code>, distance tokens collapse to{' '}
          <code>0px</code>, and scale tokens reset to <code>1</code>.
        </p>
        <div className="code-block">
          <pre>
            <code>{`/* Automatically applied by motion tokens */
@media (prefers-reduced-motion: reduce) {
  :root {
    --sp-duration-instant: 0ms;
    --sp-duration-fast: 0ms;
    --sp-duration-normal: 0ms;
    --sp-duration-slow: 0ms;
    --sp-duration-slower: 0ms;
    --sp-motion-distance-sm: 0px;
    --sp-motion-distance-md: 0px;
    --sp-motion-distance-lg: 0px;
    --sp-motion-distance-xl: 0px;
    --sp-motion-scale-in: 1;
    --sp-motion-scale-out: 1;
  }

  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`}</code>
          </pre>
        </div>
        <h3>Manual override</h3>
        <p className="section-desc">
          For an in-app &ldquo;reduce motion&rdquo; toggle, set{' '}
          <code>data-reduce-motion=&quot;true&quot;</code> on the document
          element — it mirrors the media query exactly, collapsing every
          duration, distance, and scale token and disabling keyframe
          animations globally.
        </p>
        <div className="code-block">
          <pre>
            <code>{`// In your settings UI
document.documentElement.setAttribute('data-reduce-motion', 'true')`}</code>
          </pre>
        </div>
        <h3>Guidelines</h3>
        <ul className="motion-guidelines">
          <li>Always use motion tokens instead of hard-coded durations or easings so that reduced-motion overrides apply automatically.</li>
          <li>Avoid animations that convey essential information — use motion to enhance, not to communicate.</li>
          <li>Prefer subtle, small-distance transitions over large sweeping animations for common UI interactions.</li>
          <li>Test your interface with <code>prefers-reduced-motion: reduce</code> enabled to verify that all content remains functional and visible.</li>
        </ul>
      </section>
    </FoundationPageShell>
  )
}
