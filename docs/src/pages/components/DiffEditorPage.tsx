import { useState, useEffect, useRef } from 'react';
import { DiffEditor } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'diffeditor', label: 'Diff View' },
  { id: 'api',        label: 'API' },
];

export function DiffEditorPage() {
  const [activeSection, setActiveSection] = useState('diffeditor');
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

  const oldCode = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

  const newCode = `function calculateTotal(items) {
  return items.reduce((acc, item) => {
    return acc + (item.price * (item.quantity || 1));
  }, 0);
}`;

  const DIFF_CODE = `import { DiffEditor } from 'spruce-react';

const oldCode = \`function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}\`;

const newCode = \`function calculateTotal(items) {
  return items.reduce((acc, item) => {
    return acc + (item.price * (item.quantity || 1));
  }, 0);
}\`;

export function Example() {
  return (
    <DiffEditor
      oldCode={oldCode}
      newCode={newCode}
      height={260}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Diff Editor</h1>
        <p className="docs-desc">
          Side-by-side or unified line comparison viewer for code and text version differences.
        </p>

        <section id="diffeditor" className="demo-section">
          <h2>Code Version Comparison</h2>
          <CodePreview code={DIFF_CODE}>
            <div style={{ padding: 16 }}>
              <DiffEditor oldCode={oldCode} newCode={newCode} height={260} />
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
                <tr><td><code>oldCode</code></td><td><code>string</code></td><td><code>''</code></td><td>Previous code snippet string</td></tr>
                <tr><td><code>newCode</code></td><td><code>string</code></td><td><code>''</code></td><td>Updated code snippet string</td></tr>
                <tr><td><code>height</code></td><td><code>number | string</code></td><td><code>300</code></td><td>Editor container height</td></tr>
                <tr><td><code>original</code>, <code>modified</code></td><td><code>string</code></td><td>—</td><td>Angular-parity aliases for the controlled before/after values</td></tr>
                <tr><td><code>mode</code></td><td><code>'side-by-side' | 'inline'</code></td><td><code>'side-by-side'</code></td><td>Choose split panes or a unified diff; the toolbar and <code>onModeChange</code> keep it controlled</td></tr>
                <tr><td><code>editable</code>, <code>showSplitter</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enable modified-pane editing and the keyboard-resizable splitter</td></tr>
                <tr><td><code>changeNavigation</code>, <code>collapseUnchanged</code>, <code>contextLines</code></td><td><code>boolean</code>, <code>boolean</code>, <code>number</code></td><td><code>false</code>, <code>false</code>, <code>3</code></td><td>Navigate changes and reduce unchanged context around them</td></tr>
                <tr><td><code>onOriginalChange</code>, <code>onModifiedChange</code></td><td><code>(value: string) =&gt; void</code></td><td>—</td><td>Controlled pane callbacks, emitted only for editable panes</td></tr>
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
  );
}
