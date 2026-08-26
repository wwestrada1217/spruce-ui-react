import { useState, useEffect, useRef } from 'react'
import { InplaceEditor } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'
import type { CodeFile } from '../../components/CodePreview'

const basicFiles: CodeFile[] = [
  {
    label: 'Example.tsx',
    language: 'typescript',
    code: `const [name, setName] = useState('Jane Doe');

<InplaceEditor value={name} onValueChange={setName} />`,
  },
]

const indicatorFiles: CodeFile[] = [
  {
    label: 'Example.tsx',
    language: 'typescript',
    code: `const [jobTitle, setJobTitle] = useState('Senior Engineer');
const [company, setCompany] = useState('Acme Corp');

<InplaceEditor value={jobTitle} showIndicator onValueChange={setJobTitle} />
<InplaceEditor value={company} showIndicator onValueChange={setCompany} />`,
  },
]

const sizeFiles: CodeFile[] = [
  {
    label: 'Example.tsx',
    language: 'typescript',
    code: `<InplaceEditor value="Small" size="sm" showIndicator />
<InplaceEditor value="Medium (default)" showIndicator />
<InplaceEditor value="Large" size="lg" showIndicator />`,
  },
]

const DISABLED_CODE = `<InplaceEditor value="Read only value" disabled />
<InplaceEditor value="Read only (indicator hidden)" disabled showIndicator />`

const ariaFiles: CodeFile[] = [
  {
    label: 'Example.tsx',
    language: 'typescript',
    code: `const [email, setEmail] = useState('jane.doe@email.com');

<InplaceEditor
  value={email}
  editLabel="Edit email address"
  showIndicator
  onValueChange={setEmail}
/>`,
  },
]

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic Usage' },
  { id: 'indicator', label: 'Editable Indicator' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'disabled', label: 'Disabled' },
  { id: 'aria', label: 'Accessibility' },
  { id: 'api', label: 'API' },
]

export function InplaceEditorPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [name, setName] = useState('Jane Doe')
  const [email, setEmail] = useState('jane.doe@email.com')
  const [jobTitle, setJobTitle] = useState('Senior Engineer')
  const [company, setCompany] = useState('Acme Corp')
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = mainRef.current?.closest('.docs-main') as HTMLElement | null

    const checkIfScrolledToBottom = () => {
      if (!scrollContainer) return
      if (Math.abs(scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) < 2) {
        setActiveSection(SECTIONS[SECTIONS.length - 1].id)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollContainer && Math.abs(scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) < 2) return
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { root: scrollContainer || null, rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    )

    for (const section of SECTIONS) {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    }

    scrollContainer?.addEventListener('scroll', checkIfScrolledToBottom, { passive: true })

    return () => {
      observer.disconnect()
      scrollContainer?.removeEventListener('scroll', checkIfScrolledToBottom)
    }
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>In-place Editor</h1>
        <p className="docs-desc">Edit text values directly in place, with full keyboard and accessibility support.</p>

        <section id="basic" className="demo-section">
          <h2>Basic Usage</h2>
          <p className="section-desc">Click the value to begin editing. Press <kbd>Enter</kbd> or click away to save, or <kbd>Escape</kbd> to cancel.</p>
          <CodePreview files={basicFiles}>
            <div className="demo-row">
              <InplaceEditor value={name} onValueChange={setName} />
            </div>
          </CodePreview>
        </section>

        <section id="indicator" className="demo-section">
          <h2>Editable Indicator</h2>
          <p className="section-desc">
            Set <code>showIndicator</code> to display a subtle pencil icon and dashed underline when not hovered,
            making it immediately clear that the value is editable even before interaction.
          </p>
          <CodePreview files={indicatorFiles}>
            <div className="demo-row">
              <InplaceEditor value={jobTitle} showIndicator onValueChange={setJobTitle} />
              <InplaceEditor value={company} showIndicator onValueChange={setCompany} />
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section">
          <h2>Sizes</h2>
          <p className="section-desc">
            Use the <code>size</code> prop to match the surrounding layout. Available sizes are <code>sm</code>, <code>md</code> (default), and <code>lg</code>, matching the dimensions of the standard input fields.
          </p>
          <CodePreview files={sizeFiles}>
            <div className="demo-row">
              <InplaceEditor value="Small" size="sm" showIndicator />
              <InplaceEditor value="Medium (default)" showIndicator />
              <InplaceEditor value="Large" size="lg" showIndicator />
            </div>
          </CodePreview>
        </section>

        <section id="disabled" className="demo-section">
          <h2>Disabled</h2>
          <p className="section-desc">Disable editing with the <code>disabled</code> prop. The editable indicator is hidden automatically when disabled.</p>
          <CodePreview code={DISABLED_CODE}>
            <div className="demo-row">
              <InplaceEditor value="Read only value" disabled />
              <InplaceEditor value="Read only (indicator hidden)" disabled showIndicator />
            </div>
          </CodePreview>
        </section>

        <section id="aria" className="demo-section">
          <h2>Accessibility</h2>
          <p className="section-desc">Use <code>editLabel</code> to provide a descriptive ARIA label for screen readers when the displayed value alone is not sufficient context.</p>
          <CodePreview files={ariaFiles}>
            <div className="demo-row">
              <InplaceEditor value={email} editLabel="Edit email address" showIndicator onValueChange={setEmail} />
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>value</code></td><td><code>string</code></td><td><code>''</code></td><td>The value to display and edit</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables all editing interactions</td></tr>
                <tr><td><code>showIndicator</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a pencil icon and dashed underline at rest to signal the value is editable. Automatically hidden when <code>disabled</code> is true.</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Controls the height, padding, and font size to match the standard input fields</td></tr>
                <tr><td><code>editLabel</code></td><td><code>string</code></td><td><code>'Edit value'</code></td><td>ARIA label for the edit trigger button</td></tr>
                <tr><td><code>type</code></td><td><code>InplaceEditorType</code></td><td><code>'text'</code></td><td>Choose text, number, masked, combobox, grid-combobox, date/time, emoji, or color editing</td></tr>
                <tr><td><code>showActions</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Use explicit localized accept/discard buttons instead of blur commit</td></tr>
                <tr><td><code>options</code>, <code>gridOptions</code>, <code>mask</code>, <code>min</code>, <code>max</code></td><td><code>source</code>, <code>source</code>, <code>string</code>, <code>number</code>, <code>number</code></td><td>—</td><td>Pass the type-specific lookup, mask, and number constraints to the controlled editor</td></tr>
              </tbody>
            </table>
          </div>
          <h3>Callbacks</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>onValueChange</code></td><td><code>(value: string) =&gt; void</code></td><td>Called with the new value when editing is committed via Enter or blur. Does not fire if the value is unchanged.</td></tr>
                <tr><td><code>onSelectedItem</code>, <code>onEmojiSelected</code></td><td><code>callback</code></td><td>—</td><td>Receive lookup selections or the selected emoji while the editor remains controlled</td></tr>
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
