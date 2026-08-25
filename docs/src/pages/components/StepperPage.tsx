import { useState, useEffect, useRef } from 'react'
import { Stepper } from 'spruce-react'
import type { StepItem } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const basicSteps: StepItem[] = [
  { label: 'Account', description: 'Create your account' },
  { label: 'Profile', description: 'Set up your profile' },
  { label: 'Preferences', description: 'Configure settings' },
  { label: 'Complete', description: 'Ready to go' },
]

const BASIC_CODE = `const [step, setStep] = useState(1)

<Stepper
  steps={[
    { label: 'Account', description: 'Create your account' },
    { label: 'Profile', description: 'Set up your profile' },
    { label: 'Preferences', description: 'Configure settings' },
    { label: 'Complete', description: 'Ready to go' },
  ]}
  activeStep={step}
  onStepChange={setStep}
/>`

const VERTICAL_CODE = `<Stepper orientation="vertical" steps={steps} activeStep={1} />`

const LINEAR_CODE = `<Stepper linear steps={steps} activeStep={1} />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',    label: 'Basic' },
  { id: 'vertical', label: 'Vertical' },
  { id: 'linear',   label: 'Linear' },
  { id: 'api',      label: 'API' },
]

export function StepperPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [step, setStep] = useState(1)
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
        <h1>Stepper</h1>
        <p className="docs-desc">
          Step indicator for multi-step workflows. Shows completed, active, and upcoming steps
          with numbers, check icons, and optional descriptions.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">Click any step to navigate. Completed steps show a check icon.</p>
          <CodePreview code={BASIC_CODE}>
            <div>
              <Stepper steps={basicSteps} activeStep={step} onStepChange={setStep} />
              <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginTop: 12 }}>
                Active step: <code>{step}</code> ({basicSteps[step]?.label})
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button style={{ fontSize: 12, padding: '4px 12px', cursor: 'pointer', border: '1px solid var(--sp-border-strong)', borderRadius: 4, background: 'var(--sp-surface-0)' }} onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</button>
                <button style={{ fontSize: 12, padding: '4px 12px', cursor: 'pointer', border: '1px solid var(--sp-primary)', borderRadius: 4, background: 'var(--sp-primary)', color: '#fff' }} onClick={() => setStep(Math.min(basicSteps.length - 1, step + 1))} disabled={step === basicSteps.length - 1}>Next</button>
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="vertical" className="demo-section" aria-labelledby="vertical-heading">
          <h2 id="vertical-heading">Vertical</h2>
          <p className="section-desc">Stack steps vertically for sidebar navigation patterns.</p>
          <CodePreview code={VERTICAL_CODE}>
            <Stepper orientation="vertical" steps={basicSteps} activeStep={1} />
          </CodePreview>
        </section>

        <section id="linear" className="demo-section" aria-labelledby="linear-heading">
          <h2 id="linear-heading">Linear</h2>
          <p className="section-desc">
            When <code>linear</code> is set, only completed and active steps are clickable. Users must
            progress through steps in order.
          </p>
          <CodePreview code={LINEAR_CODE}>
            <Stepper linear steps={basicSteps} activeStep={1} />
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Stepper Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>steps</code></td><td><code>StepItem[]</code></td><td>—</td><td>Array of step definitions</td></tr>
                <tr><td><code>activeStep</code></td><td><code>number</code></td><td><code>0</code></td><td>Currently active step index</td></tr>
                <tr><td><code>defaultActiveStep</code></td><td><code>number</code></td><td><code>0</code></td><td>Initial uncontrolled step</td></tr>
                <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Layout direction</td></tr>
                <tr><td><code>linear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Only allow forward progression</td></tr>
                <tr><td><code>onStepChange</code></td><td><code>(index: number) =&gt; void</code></td><td>—</td><td>Called when a step is clicked</td></tr>
                <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td>—</td><td>Accessible name for the tablist step navigation</td></tr>
              </tbody>
            </table>
          </div>
          <h3 style={{ marginTop: 16 }}>StepItem</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>label</code></td><td><code>string</code></td><td>Step label text</td></tr>
                <tr><td><code>description</code></td><td><code>string</code></td><td>Optional description text</td></tr>
                <tr><td><code>icon</code></td><td><code>string</code></td><td>Custom icon for completed state</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td>Disable this step</td></tr>
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
              <a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
