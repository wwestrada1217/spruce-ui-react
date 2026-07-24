import { useState } from 'react'

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

const PATTERNS = [
  { name: 'Fade In', className: 'sp-fade-in', demoClass: 'demo-fade', desc: 'Opacity 0 → 1' },
  { name: 'Slide Up', className: 'sp-slide-up-in', demoClass: 'demo-slide-up', desc: 'Slides up from below' },
  { name: 'Slide Down', className: 'sp-slide-down-in', demoClass: 'demo-slide-down', desc: 'Slides down from above' },
  { name: 'Slide Left', className: 'sp-slide-left-in', demoClass: 'demo-slide-left', desc: 'Enters from the right' },
  { name: 'Slide Right', className: 'sp-slide-right-in', demoClass: 'demo-slide-right', desc: 'Enters from the left' },
  { name: 'Scale In', className: 'sp-scale-in', demoClass: 'demo-scale-in', desc: 'Scales up from 0.7' },
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
    <>
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Motion</h1>
        <p className="page-lead">
          Tokens, patterns, and CSS utilities for consistent, accessible motion
          across the design system.
        </p>
      </div>

      <section className="doc-section">
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

      <section className="doc-section">
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

      <section className="doc-section">
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

      <section className="doc-section">
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
      </section>

      <section className="doc-section">
        <h2>CSS Transitions</h2>
        <p className="section-desc">
          Compose transition shorthand using duration and easing tokens for
          interactive state changes like hover, focus, and active.
        </p>
        <div className="code-block">
          <pre>
            <code>{`/* Simple property transition */
.my-button {
  transition: background var(--sp-duration-fast) var(--sp-ease-out);
}

/* Multiple properties */
.my-card {
  transition:
    transform var(--sp-duration-normal) var(--sp-ease-spring),
    box-shadow var(--sp-duration-normal) var(--sp-ease-out),
    opacity var(--sp-duration-fast) var(--sp-ease-out);
}

/* Hover lift pattern */
.my-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--sp-shadow-lg);
}`}</code>
          </pre>
        </div>
        <div className="transition-demo">
          <div className="transition-card transition-card--hover">Hover me (lift)</div>
          <div className="transition-card transition-card--press">Press me (press)</div>
          <div className="transition-card transition-card--glow">Hover me (glow)</div>
        </div>
      </section>

      <section className="doc-section">
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
        <h3>Guidelines</h3>
        <ul className="motion-guidelines">
          <li>Always use motion tokens instead of hard-coded durations or easings so that reduced-motion overrides apply automatically.</li>
          <li>Avoid animations that convey essential information — use motion to enhance, not to communicate.</li>
          <li>Prefer subtle, small-distance transitions over large sweeping animations for common UI interactions.</li>
          <li>Test your interface with <code>prefers-reduced-motion: reduce</code> enabled to verify that all content remains functional and visible.</li>
        </ul>
      </section>
    </>
  )
}
