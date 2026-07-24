import { useState, useEffect, useRef } from 'react';
import { RadioGroup, Radio } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const BASIC_CODE = `<RadioGroup value={value} onChange={setValue}>
  <Radio value="option-a">Option A</Radio>
  <Radio value="option-b">Option B</Radio>
  <Radio value="option-c">Option C</Radio>
</RadioGroup>`;

const HORIZONTAL_CODE = `<RadioGroup value={value} orientation="horizontal" onChange={setValue}>
  <Radio value="day">Day</Radio>
  <Radio value="week">Week</Radio>
  <Radio value="month">Month</Radio>
</RadioGroup>`;

const DISABLED_CODE = `<RadioGroup value="option-a" disabled onChange={() => {}}>
  <Radio value="option-a">Option A</Radio>
  <Radio value="option-b">Option B</Radio>
  <Radio value="option-c">Option C</Radio>
</RadioGroup>`;

const MIXED_DISABLED_CODE = `<RadioGroup value="option-a" onChange={() => {}}>
  <Radio value="option-a">Option A</Radio>
  <Radio value="option-b" disabled>Option B (disabled)</Radio>
  <Radio value="option-c">Option C</Radio>
</RadioGroup>`;

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',         label: 'Basic' },
  { id: 'horizontal',    label: 'Horizontal' },
  { id: 'disabled',      label: 'Disabled' },
  { id: 'mixed-disabled',label: 'Mixed Disabled' },
  { id: 'api',           label: 'API' },
];

export function RadioPage() {
  const [value, setValue] = useState('option-b');
  const [period, setPeriod] = useState('week');
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
        <h1>Radio Button</h1>
        <p className="docs-desc">
          Single-select from a group of options. Wrap <code>Radio</code> items inside a{' '}
          <code>RadioGroup</code> to manage selection state.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">A vertical group of radio options with controlled selection.</p>
          <CodePreview code={BASIC_CODE}>
            <RadioGroup value={value} onChange={setValue}>
              <Radio value="option-a">Option A</Radio>
              <Radio value="option-b">Option B</Radio>
              <Radio value="option-c">Option C</Radio>
            </RadioGroup>
          </CodePreview>
        </section>

        <section id="horizontal" className="demo-section" aria-labelledby="horizontal-heading">
          <h2 id="horizontal-heading">Horizontal</h2>
          <p className="section-desc">
            Set <code>orientation="horizontal"</code> on the group to lay items out side by side.
          </p>
          <CodePreview code={HORIZONTAL_CODE}>
            <RadioGroup value={period} orientation="horizontal" onChange={setPeriod}>
              <Radio value="day">Day</Radio>
              <Radio value="week">Week</Radio>
              <Radio value="month">Month</Radio>
            </RadioGroup>
          </CodePreview>
        </section>

        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled</h2>
          <p className="section-desc">Disable the entire group by setting <code>disabled</code> on <code>RadioGroup</code>.</p>
          <CodePreview code={DISABLED_CODE}>
            <RadioGroup value="option-a" disabled onChange={() => undefined}>
              <Radio value="option-a">Option A</Radio>
              <Radio value="option-b">Option B</Radio>
              <Radio value="option-c">Option C</Radio>
            </RadioGroup>
          </CodePreview>
        </section>

        <section id="mixed-disabled" className="demo-section" aria-labelledby="mixed-disabled-heading">
          <h2 id="mixed-disabled-heading">Mixed Disabled</h2>
          <p className="section-desc">Disable individual options by setting <code>disabled</code> on a <code>Radio</code> item.</p>
          <CodePreview code={MIXED_DISABLED_CODE}>
            <RadioGroup value="option-a" onChange={() => undefined}>
              <Radio value="option-a">Option A</Radio>
              <Radio value="option-b" disabled>Option B (disabled)</Radio>
              <Radio value="option-c">Option C</Radio>
            </RadioGroup>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>RadioGroup Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>value</code></td><td><code>string</code></td><td><code>''</code></td><td>Selected value</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable all radios in the group</td></tr>
                <tr><td><code>orientation</code></td><td><code>'vertical' | 'horizontal'</code></td><td><code>'vertical'</code></td><td>Layout direction of the radio items</td></tr>
                <tr><td><code>onChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Called when selection changes</td></tr>
              </tbody>
            </table>
          </div>
          <h3>Radio Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>Value that this radio represents (required)</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable this specific option</td></tr>
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
