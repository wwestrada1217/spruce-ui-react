import { useState, useEffect, useRef } from 'react'
import { Coachmark } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `const [active, setActive] = useState(false)

const steps = [
  {
    target: '#step-1',
    title: 'Create a Project',
    content: 'Start by creating a new project.',
    placement: 'bottom',
  },
  {
    target: '#step-2',
    title: 'Invite Your Team',
    content: 'Add team members to collaborate.',
    placement: 'bottom',
  },
  {
    target: '#step-3',
    title: 'Start Building',
    content: 'You are all set!',
    placement: 'bottom',
  },
]

<button onClick={() => setActive(true)}>Start Tour</button>
<Coachmark active={active} steps={steps} onComplete={() => setActive(false)} />`

const PLACEMENT_CODE = `const steps = [
  { target: '#el', title: 'Top', content: '...', placement: 'top' },
  { target: '#el', title: 'Right', content: '...', placement: 'right' },
  { target: '#el', title: 'Bottom', content: '...', placement: 'bottom' },
  { target: '#el', title: 'Left', content: '...', placement: 'left' },
]

<Coachmark active={active} steps={steps} />`

const SINGLE_CODE = `<Coachmark
  active={active}
  steps={[{
    target: '#new-feature',
    title: 'Introducing Sparkles',
    content: 'Try out this brand-new feature!',
    placement: 'right',
  }]}
/>`

const NO_ARROW_CODE = `<Coachmark active={active} steps={steps} showArrow={false} />`

const BACKDROP_CODE = `<Coachmark active={active} steps={steps} closeOnBackdrop />`

const NO_BACKDROP_CODE = `<Coachmark active={active} steps={steps} showBackdrop={false} />`

const EVENTS_CODE = `<Coachmark
  active={active}
  steps={steps}
  onStepChange={(index) => console.log('step:', index)}
  onComplete={() => console.log('completed')}
  onSkip={() => console.log('skipped')}
/>`

const BASIC_STEPS = [
  {
    target: '#demo-card-1',
    title: 'Create a Project',
    content: 'Start by creating a new project. Give it a name and choose a template to get started quickly.',
    placement: 'bottom' as const,
  },
  {
    target: '#demo-card-2',
    title: 'Invite Your Team',
    content: 'Add team members to collaborate. You can assign roles and set permissions for each member.',
    placement: 'bottom' as const,
  },
  {
    target: '#demo-card-3',
    title: 'Start Building',
    content: 'You are all set! Start building your project with the tools and resources available.',
    placement: 'bottom' as const,
  },
]

const PLACEMENT_STEPS = [
  { target: '#place-top', title: 'Top Placement', content: 'The card is positioned above the target element.', placement: 'top' as const },
  { target: '#place-right', title: 'Right Placement', content: 'The card appears to the right of the target.', placement: 'right' as const },
  { target: '#place-bottom', title: 'Bottom Placement', content: 'The card is positioned below the target element.', placement: 'bottom' as const },
  { target: '#place-left', title: 'Left Placement', content: 'The card appears to the left of the target.', placement: 'left' as const },
]

const SINGLE_STEP = [
  {
    target: '#highlight-target',
    title: 'Introducing Sparkles',
    content: 'This brand-new feature lets you add particle effects to any element. Try it out!',
    placement: 'right' as const,
  },
]

const NO_ARROW_STEP = [
  {
    target: '#no-arrow-target',
    title: 'Clean Look',
    content: 'The arrow indicator is hidden for a minimal and clean card appearance.',
    placement: 'bottom' as const,
  },
]

const BACKDROP_STEP = [
  {
    target: '#backdrop-target',
    title: 'Dismissible',
    content: 'Click anywhere on the dark backdrop to dismiss this coachmark.',
    placement: 'bottom' as const,
  },
]

const NO_BACKDROP_STEP = [
  {
    target: '#no-backdrop-target',
    title: 'No Backdrop',
    content: 'The tour card appears without the dimmed overlay. The page behind remains fully interactive.',
    placement: 'bottom' as const,
  },
]

const EVENTS_STEPS = [
  {
    target: '#event-card-1',
    title: 'Step A',
    content: 'Navigate to the next step and watch the event log update.',
    placement: 'bottom' as const,
  },
  {
    target: '#event-card-2',
    title: 'Step B',
    content: 'Click Done to complete the tour or Skip to dismiss.',
    placement: 'bottom' as const,
  },
]

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic Tour' },
  { id: 'placement', label: 'Placement' },
  { id: 'single-step', label: 'Single Step' },
  { id: 'no-arrow', label: 'Without Arrow' },
  { id: 'backdrop-close', label: 'Backdrop Close' },
  { id: 'no-backdrop', label: 'No Backdrop' },
  { id: 'events', label: 'Events' },
  { id: 'api', label: 'API' },
]

export function CoachmarkPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [basicActive, setBasicActive] = useState(false)
  const [placementActive, setPlacementActive] = useState(false)
  const [singleActive, setSingleActive] = useState(false)
  const [noArrowActive, setNoArrowActive] = useState(false)
  const [backdropActive, setBackdropActive] = useState(false)
  const [noBackdropActive, setNoBackdropActive] = useState(false)
  const [eventsActive, setEventsActive] = useState(false)
  const [eventLog, setEventLog] = useState('')
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    )
    mainRef.current?.querySelectorAll('section[id]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Coachmark</h1>
        <p className="docs-desc">
          Guided tours, walkthroughs, and feature highlights. The coachmark overlays a spotlight
          on a target element and displays a card with navigation controls for multi-step tours.
        </p>

        {/* Basic Tour */}
        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic Tour</h2>
          <p className="section-desc">A simple multi-step guided tour that highlights target elements and shows descriptive cards with navigation controls. Use arrow keys or click buttons to navigate.</p>
          <CodePreview code={BASIC_CODE}>
            <div className="demo-tour-area">
              <div className="demo-card" id="demo-card-1">
                <div className="demo-card__icon">1</div>
                <p className="demo-card__label">Create Project</p>
              </div>
              <div className="demo-card" id="demo-card-2">
                <div className="demo-card__icon">2</div>
                <p className="demo-card__label">Add Members</p>
              </div>
              <div className="demo-card" id="demo-card-3">
                <div className="demo-card__icon">3</div>
                <p className="demo-card__label">Start Building</p>
              </div>
            </div>
            <button onClick={() => setBasicActive(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Start Tour</button>
            <Coachmark
              active={basicActive}
              steps={BASIC_STEPS}
              onComplete={() => setBasicActive(false)}
              onSkip={() => setBasicActive(false)}
            />
          </CodePreview>
        </section>

        {/* Placement */}
        <section id="placement" className="demo-section" aria-labelledby="placement-heading">
          <h2 id="placement-heading">Placement</h2>
          <p className="section-desc">The card automatically positions itself relative to the target element. Set a preferred placement per step; it auto-flips when clipped by the viewport.</p>
          <CodePreview code={PLACEMENT_CODE}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, padding: '16px 0' }}>
              <button id="place-top" style={{ padding: '8px 16px' }}>Top Target</button>
              <button id="place-right" style={{ padding: '8px 16px' }}>Right Target</button>
              <button id="place-bottom" style={{ padding: '8px 16px' }}>Bottom Target</button>
              <button id="place-left" style={{ padding: '8px 16px' }}>Left Target</button>
            </div>
            <button onClick={() => setPlacementActive(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Start Placement Tour</button>
            <Coachmark
              active={placementActive}
              steps={PLACEMENT_STEPS}
              onComplete={() => setPlacementActive(false)}
              onSkip={() => setPlacementActive(false)}
            />
          </CodePreview>
        </section>

        {/* Single Step */}
        <section id="single-step" className="demo-section" aria-labelledby="single-step-heading">
          <h2 id="single-step-heading">Single Step (Feature Highlight)</h2>
          <p className="section-desc">Use a single step to call attention to a specific feature. The skip button is hidden for single-step coachmarks.</p>
          <CodePreview code={SINGLE_CODE}>
            <div className="demo-row">
              <button id="highlight-target" style={{ padding: '8px 16px' }}>New Feature</button>
            </div>
            <button onClick={() => setSingleActive(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Highlight Feature</button>
            <Coachmark
              active={singleActive}
              steps={SINGLE_STEP}
              onComplete={() => setSingleActive(false)}
              onSkip={() => setSingleActive(false)}
            />
          </CodePreview>
        </section>

        {/* No Arrow */}
        <section id="no-arrow" className="demo-section" aria-labelledby="no-arrow-heading">
          <h2 id="no-arrow-heading">Without Arrow</h2>
          <p className="section-desc">Hide the arrow indicator for a cleaner look when the visual connection to the target is already obvious.</p>
          <CodePreview code={NO_ARROW_CODE}>
            <div className="demo-row">
              <button id="no-arrow-target" style={{ padding: '8px 16px' }}>Target Element</button>
            </div>
            <button onClick={() => setNoArrowActive(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Start Without Arrow</button>
            <Coachmark
              active={noArrowActive}
              steps={NO_ARROW_STEP}
              showArrow={false}
              onComplete={() => setNoArrowActive(false)}
              onSkip={() => setNoArrowActive(false)}
            />
          </CodePreview>
        </section>

        {/* Close on Backdrop */}
        <section id="backdrop-close" className="demo-section" aria-labelledby="backdrop-close-heading">
          <h2 id="backdrop-close-heading">Close on Backdrop Click</h2>
          <p className="section-desc">Allow users to dismiss the coachmark by clicking anywhere on the backdrop overlay.</p>
          <CodePreview code={BACKDROP_CODE}>
            <div className="demo-row">
              <button id="backdrop-target" style={{ padding: '8px 16px' }}>Target</button>
            </div>
            <button onClick={() => setBackdropActive(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Start Tour (Click Backdrop to Close)</button>
            <Coachmark
              active={backdropActive}
              steps={BACKDROP_STEP}
              closeOnBackdrop
              onComplete={() => setBackdropActive(false)}
              onSkip={() => setBackdropActive(false)}
            />
          </CodePreview>
        </section>

        {/* No Backdrop */}
        <section id="no-backdrop" className="demo-section" aria-labelledby="no-backdrop-heading">
          <h2 id="no-backdrop-heading">No Backdrop</h2>
          <p className="section-desc">Set <code>showBackdrop={'{false}'}</code> to show only the card without the dimmed overlay. The page behind remains fully interactive while the tour is active.</p>
          <CodePreview code={NO_BACKDROP_CODE}>
            <div className="demo-row">
              <button id="no-backdrop-target" style={{ padding: '8px 16px' }}>Target Element</button>
            </div>
            <button onClick={() => setNoBackdropActive(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Start Tour (No Backdrop)</button>
            <Coachmark
              active={noBackdropActive}
              steps={NO_BACKDROP_STEP}
              showBackdrop={false}
              onComplete={() => setNoBackdropActive(false)}
              onSkip={() => setNoBackdropActive(false)}
            />
          </CodePreview>
        </section>

        {/* Events */}
        <section id="events" className="demo-section" aria-labelledby="events-heading">
          <h2 id="events-heading">Events</h2>
          <p className="section-desc">Listen to step changes, tour completion, and skip events for analytics or follow-up actions.</p>
          <CodePreview code={EVENTS_CODE}>
            <div className="demo-tour-area">
              <div className="demo-card" id="event-card-1">
                <div className="demo-card__icon">A</div>
                <p className="demo-card__label">Step A</p>
              </div>
              <div className="demo-card" id="event-card-2">
                <div className="demo-card__icon">B</div>
                <p className="demo-card__label">Step B</p>
              </div>
            </div>
            <div className="demo-row">
              <button onClick={() => setEventsActive(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Start Events Tour</button>
              {eventLog && (
                <span className="event-log">{eventLog}</span>
              )}
            </div>
            <Coachmark
              active={eventsActive}
              steps={EVENTS_STEPS}
              onStepChange={(index: number) => setEventLog(`stepChanged: ${index}`)}
              onComplete={() => { setEventLog('completed'); setEventsActive(false) }}
              onSkip={() => { setEventLog('skipped'); setEventsActive(false) }}
            />
          </CodePreview>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>steps</code></td><td><code>CoachmarkStep[]</code></td><td>required</td><td>Array of tour steps</td></tr>
                <tr><td><code>active</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether the tour is active</td></tr>
                <tr><td><code>showProgress</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show step counter (e.g. "2 / 5")</td></tr>
                <tr><td><code>showArrow</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show arrow pointing to target</td></tr>
                <tr><td><code>showBackdrop</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show dimmed backdrop overlay around the spotlight cutout</td></tr>
                <tr><td><code>closeOnBackdrop</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Close on backdrop click</td></tr>
                <tr><td><code>spotlightPadding</code></td><td><code>number</code></td><td><code>8</code></td><td>Default padding around the spotlight cutout (px)</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Callbacks</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>onStepChange</code></td><td><code>{'(index: number) => void'}</code></td><td>Called with the new step index on navigation</td></tr>
                <tr><td><code>onComplete</code></td><td><code>{'() => void'}</code></td><td>Called when the tour finishes (Done clicked)</td></tr>
                <tr><td><code>onSkip</code></td><td><code>{'() => void'}</code></td><td>Called when the tour is skipped or dismissed</td></tr>
              </tbody>
            </table>
          </div>

          <h3>CoachmarkStep</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>target</code></td><td><code>string</code></td><td>required</td><td>CSS selector for the target element</td></tr>
                <tr><td><code>title</code></td><td><code>string</code></td><td>required</td><td>Step title displayed in the card header</td></tr>
                <tr><td><code>content</code></td><td><code>string</code></td><td>required</td><td>Step description text</td></tr>
                <tr><td><code>placement</code></td><td><code>Placement</code></td><td><code>'bottom'</code></td><td>Preferred card placement relative to target</td></tr>
                <tr><td><code>spotlightPadding</code></td><td><code>number</code></td><td><code>8</code></td><td>Extra padding around the spotlight cutout</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Keyboard Support</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Key</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr><td><code>ArrowRight</code> / <code>ArrowDown</code></td><td>Next step</td></tr>
                <tr><td><code>ArrowLeft</code> / <code>ArrowUp</code></td><td>Previous step</td></tr>
                <tr><td><code>Escape</code></td><td>Close the tour</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                className={`toc-link${activeSection === s.id ? ' active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
