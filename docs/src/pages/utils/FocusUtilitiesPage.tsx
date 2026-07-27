import { useState, useEffect, useRef } from 'react';
import { FocusTrap, AutoFocus, Button, Input, Card } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'focustrap', label: 'Focus Trap' },
  { id: 'autofocus', label: 'Auto Focus' },
  { id: 'api',       label: 'API' },
];

export function FocusUtilitiesPage() {
  const [activeSection, setActiveSection] = useState('focustrap');
  const [trapActive, setTrapActive] = useState(false);
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

  const FOCUS_TRAP_CODE = `import { useState } from 'react';
import { FocusTrap, Button, Input, Card } from 'spruce-react';

export function Example() {
  const [trapActive, setTrapActive] = useState(false);

  return (
    <div>
      <Button onClick={() => setTrapActive(!trapActive)}>
        Toggle Focus Trap ({trapActive ? 'Active' : 'Inactive'})
      </Button>

      <FocusTrap active={trapActive}>
        <Card style={{ marginTop: 16, padding: 16 }}>
          <Input placeholder="First focusable element" />
          <Input placeholder="Second focusable element" />
          <Button variant="primary">Submit</Button>
        </Card>
      </FocusTrap>
    </div>
  );
}`;

  const AUTO_FOCUS_CODE = `import { AutoFocus, Input } from 'spruce-react';

export function Example() {
  return (
    <AutoFocus>
      <Input placeholder="Automatically focused on mount" />
    </AutoFocus>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Focus Utilities</h1>
        <p className="docs-desc">
          Keyboard navigation and accessibility focus management helpers including Focus Trap and Auto Focus wrappers.
        </p>

        <section id="focustrap" className="demo-section">
          <h2>Focus Trap</h2>
          <CodePreview code={FOCUS_TRAP_CODE}>
            <div style={{ padding: 16 }}>
              <Button onClick={() => setTrapActive(!trapActive)}>
                Toggle Focus Trap ({trapActive ? 'Active' : 'Inactive'})
              </Button>

              <FocusTrap active={trapActive}>
                <Card style={{ marginTop: 16, padding: 16, maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Input placeholder="First focusable element" />
                  <Input placeholder="Second focusable element" />
                  <Button variant="primary">Submit</Button>
                </Card>
              </FocusTrap>
            </div>
          </CodePreview>
        </section>

        <section id="autofocus" className="demo-section">
          <h2>Auto Focus</h2>
          <CodePreview code={AUTO_FOCUS_CODE}>
            <div style={{ padding: 16, maxWidth: 360 }}>
              <AutoFocus>
                <Input placeholder="Automatically focused on mount" />
              </AutoFocus>
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>FocusTrap Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>active</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Trap tab focus inside container</td></tr>
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
