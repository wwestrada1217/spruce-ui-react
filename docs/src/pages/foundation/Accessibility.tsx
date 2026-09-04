import { FoundationPageShell } from '../../components/FoundationPageShell'

const PRINCIPLES = [
  ['Keyboard First', 'Every interactive component must be reachable, operable, and dismissible without a pointer.'],
  ['Clear Semantics', 'Use native controls and landmark structure before adding ARIA. ARIA should clarify behavior, not repair avoidable markup.'],
  ['Visible State', 'Focus, disabled, selected, invalid, loading, and expanded states need visible styling and assistive technology signals.'],
]

const STANDARDS = [
  ['Keyboard', 'No keyboard traps; expected shortcuts work for menus, dialogs, sliders, tabs, and overlays.', 'Use native buttons, focus-visible styles, escape handling, and focus trap utilities for modal surfaces.'],
  ['Names And Labels', 'Controls expose accessible names and state.', 'Provide labels through visible text, aria-label, aria-labelledby, or shared i18n labels for reusable chrome.'],
  ['Contrast', 'Text, icons, focus rings, and state colors meet WCAG AA contrast in light and dark themes.', 'Use semantic tokens and validate custom theme palettes before release.'],
  ['Motion', 'Animation must respect reduced motion preferences and never block content comprehension.', 'Use motion tokens, short durations, and reduced-motion fallbacks for component transitions.'],
]

const CHECKLIST = [
  ['Interactive Elements', 'Use native button, input, select, and anchor semantics when possible. Set type="button" for non-submit actions rendered inside forms.'],
  ['Focus Management', 'Move focus intentionally for dialogs and popovers, restore it on close, and keep focus outlines visible in every theme.'],
  ['ARIA State', 'Expose expanded, selected, checked, current, invalid, disabled, and modal state only when component behavior requires it.'],
  ['Error Messaging', 'Associate validation text with field and make invalid state available to assistive tech.'],
  ['Touch Targets', 'Keep controls large enough for pointer/touch, especially dense enterprise controls/icon-only buttons.'],
  ['Localization', 'Route reusable labels through Spruce i18n so accessible names remain correct when locale/direction changes.'],
]

const SCAN_RESULTS = [
  ['Buttons inside reusable templates', 'Several non-submit buttons were missing explicit type attributes.', 'Added type="button" in modal, drawer, lightbox, coachmark, editor menu controls.'],
  ['Shared ARIA labels', 'Range slider labels and drawer close label used fixed English strings.', 'Moved those labels to Spruce i18n so locale changes update assistive text.'],
  ['Dialogs and overlays', 'Dialog roles, close controls, focus trap hooks, and escape handlers are present in modal-style surfaces reviewed.', 'Kept existing focus behavior and hardened close button semantics.'],
  ['Keyboard handlers', 'Slider, lightbox, menus, and picker-style components expose keyboard handlers in source.', 'Documented manual keyboard review as required release step because source checks cannot prove runtime order.'],
]

const AUTHORING = [
  ['Name Icon Buttons', 'Icon-only actions need a label that names the action, not the icon. Prefer localized labels for reusable component chrome.'],
  ['Write Useful Alt Text', 'Describe image purpose. Decorative images should use empty alt text; informative images need concise context.'],
  ['Keep Copy Specific', 'Validation and empty states should explain what happened and what user can do next.'],
  ['Respect Direction', 'Use logical CSS properties and verify layouts in LTR/RTL when components include placement, navigation, reading order.'],
]

const TESTING = [
  ['Static scan', 'Search templates for unlabeled buttons, missing button types, risky tabindex values, invalid ARIA, and pointer-only behavior.'],
  ['Keyboard pass', 'Tab through page, operate controls with Enter, Space, arrow keys, Home, End, Escape where applicable.'],
  ['Screen reader pass', 'Confirm labels, roles, state changes, error text, dialog announcements, focus movement understandable.'],
  ['Theme and contrast', 'Check foreground, border, focus, disabled, selected, error states in light/dark/custom themes.'],
  ['Runtime automation', 'Run axe or equivalent checks against docs examples/product workflows after page renders.'],
]

export function AccessibilityPage() {
  return (
    <FoundationPageShell variant="accessibility" title="Accessibility" description="Spruce components are designed to be keyboard operable, readable by assistive technology, resilient across themes, and practical for teams building WCAG-aligned enterprise interfaces.">
      <div className="page-header">
        <p className="page-tag">Foundation</p>
        <h1>Accessibility</h1>
        <p className="page-lead">
          Spruce components are designed to be keyboard operable, readable by assistive technology,
          resilient across themes, and practical for teams building WCAG-aligned enterprise interfaces.
        </p>
      </div>

      <section id="overview" className="doc-section">
        <h2>Overview</h2>
        <p className="section-desc">Accessibility is part of the component contract. Components should expose semantic structure, visible focus, understandable labels, predictable keyboard behavior, and enough flexibility for product teams to provide context-specific copy.</p>
        <div className="principles-grid">{PRINCIPLES.map(([title, body]) => <article key={title} className="principle-card"><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section id="standards" className="doc-section">
        <h2>Standards</h2>
        <p className="section-desc">Use WCAG 2.2 AA as the baseline for shipped Spruce components and product screens. Automated checks are useful, but every release should also include keyboard and screen reader review for interactive flows.</p>
        <table className="token-table" aria-label="Accessibility standards"><thead><tr><th>Area</th><th>Requirement</th><th>Spruce Pattern</th></tr></thead><tbody>{STANDARDS.map(([area, requirement, pattern]) => <tr key={area}><td>{area}</td><td>{requirement}</td><td>{pattern}</td></tr>)}</tbody></table>
      </section>

      <section id="component-checklist" className="doc-section">
        <h2>Component Checklist</h2>
        <p className="section-desc">Review each new or changed component against this checklist before documenting the API. Prefer native elements first, then add ARIA only when native semantics are not enough.</p>
        <div className="principles-grid">{CHECKLIST.map(([title, body]) => <article key={title} className="principle-card"><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section id="scan-results" className="doc-section">
        <h2>Scan Results</h2>
        <p className="section-desc">A source-level accessibility scan was run against the core component templates. The scan checked interactive controls, dialog semantics, focus behavior, ARIA labels, keyboard handlers, and form-safe button usage.</p>
        <table className="token-table" aria-label="Accessibility scan results"><thead><tr><th>Check</th><th>Result</th><th>Action</th></tr></thead><tbody>{SCAN_RESULTS.map(([check, result, action]) => <tr key={check}><td>{check}</td><td>{result}</td><td>{action}</td></tr>)}</tbody></table>
        <div className="principle-card"><h3>Audit Scope</h3><p>This pass was static and code-based. Pair it with runtime axe checks, keyboard traversal, screen reader testing, and contrast review in product contexts where components receive real labels, validation messages, and page landmarks.</p></div>
      </section>

      <section id="authoring" className="doc-section">
        <h2>Authoring Guidance</h2>
        <p className="section-desc">Product teams should provide accessible names, descriptions, and error text that match the surrounding workflow. Component defaults cover reusable chrome, but business meaning belongs in the consuming application.</p>
        <div className="principles-grid">{AUTHORING.map(([title, body]) => <article key={title} className="principle-card"><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section id="testing" className="doc-section">
        <h2>Testing Workflow</h2>
        <p className="section-desc">Validate accessibility at the component, documentation, and product levels. Static analysis catches common misses, while manual review confirms real behavior.</p>
        <table className="token-table" aria-label="Accessibility testing workflow"><thead><tr><th>Step</th><th>What To Verify</th></tr></thead><tbody>{TESTING.map(([step, verify]) => <tr key={step}><td>{step}</td><td>{verify}</td></tr>)}</tbody></table>
      </section>
    </FoundationPageShell>
  )
}
