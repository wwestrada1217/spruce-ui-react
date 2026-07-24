import { useState, useEffect, useRef } from 'react';
import { Checkbox } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const BASIC_CODE = `<Checkbox checked={checked} onChange={setChecked}>
  Accept terms and conditions
</Checkbox>`;

const STATES_CODE = `<Checkbox checked={false} onChange={() => {}}>Unchecked</Checkbox>
<Checkbox checked={true} onChange={() => {}}>Checked</Checkbox>
<Checkbox checked={false} disabled>Disabled</Checkbox>
<Checkbox checked={true} disabled>Disabled checked</Checkbox>`;

const INDETERMINATE_CODE = `<Checkbox checked={false} indeterminate>Indeterminate</Checkbox>`;

const GROUP_CODE = `<Checkbox checked={apples} onChange={setApples}>Apples</Checkbox>
<Checkbox checked={bananas} onChange={setBananas}>Bananas</Checkbox>
<Checkbox checked={cherries} onChange={setCherries}>Cherries</Checkbox>`;

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',         label: 'Basic' },
  { id: 'states',        label: 'States' },
  { id: 'indeterminate', label: 'Indeterminate' },
  { id: 'group',         label: 'Checkbox Group' },
  { id: 'api',           label: 'API' },
];

export function CheckboxPage() {
  const [checked, setChecked] = useState(false);
  const [apples, setApples] = useState(true);
  const [bananas, setBananas] = useState(false);
  const [cherries, setCherries] = useState(true);
  const [activeSection, setActiveSection] = useState('basic');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { threshold: 0.3 },
    );
    const sections = mainRef.current?.querySelectorAll('[id]') ?? [];
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Checkbox</h1>
        <p className="docs-desc">
          A binary toggle for boolean values. Supports checked, unchecked, indeterminate, and disabled states.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">A simple interactive checkbox with a label.</p>
          <CodePreview code={BASIC_CODE}>
            <Checkbox checked={checked} onChange={setChecked}>
              Accept terms and conditions
            </Checkbox>
          </CodePreview>
        </section>

        <section id="states" className="demo-section" aria-labelledby="states-heading">
          <h2 id="states-heading">States</h2>
          <p className="section-desc">All possible visual states of the checkbox.</p>
          <CodePreview code={STATES_CODE}>
            <div className="docs-stack">
              <Checkbox checked={false} onChange={() => undefined}>Unchecked</Checkbox>
              <Checkbox checked={true} onChange={() => undefined}>Checked</Checkbox>
              <Checkbox checked={false} disabled>Disabled</Checkbox>
              <Checkbox checked={true} disabled>Disabled checked</Checkbox>
            </div>
          </CodePreview>
        </section>

        <section id="indeterminate" className="demo-section" aria-labelledby="indeterminate-heading">
          <h2 id="indeterminate-heading">Indeterminate</h2>
          <p className="section-desc">
            Use <code>indeterminate</code> to represent a partially-checked state — common in parent/child selection patterns.
          </p>
          <CodePreview code={INDETERMINATE_CODE}>
            <Checkbox checked={false} indeterminate onChange={() => undefined}>Indeterminate</Checkbox>
          </CodePreview>
        </section>

        <section id="group" className="demo-section" aria-labelledby="group-heading">
          <h2 id="group-heading">Checkbox Group</h2>
          <p className="section-desc">Compose multiple checkboxes for multi-select scenarios.</p>
          <CodePreview code={GROUP_CODE}>
            <div className="docs-stack">
              <Checkbox checked={apples} onChange={setApples}>Apples</Checkbox>
              <Checkbox checked={bananas} onChange={setBananas}>Bananas</Checkbox>
              <Checkbox checked={cherries} onChange={setCherries}>Cherries</Checkbox>
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>checked</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Checked state</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the checkbox</td></tr>
                <tr><td><code>indeterminate</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show indeterminate state</td></tr>
                <tr><td><code>onChange</code></td><td><code>(checked: boolean) =&gt; void</code></td><td>—</td><td>Called when the value changes</td></tr>
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
  );
}
