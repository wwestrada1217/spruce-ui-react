import { useState, useEffect, useRef } from 'react';
import { Shine, Button, Card } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'shine', label: 'Shine Sweep' },
  { id: 'api',   label: 'API' },
];

export function ShinePage() {
  const [activeSection, setActiveSection] = useState('shine');
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

  const SHINE_CODE = `import { Shine, Button } from 'spruce-react';

export function Example() {
  return (
    <Shine active={true}>
      <Button variant="primary">Shining Pro Feature</Button>
    </Shine>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Shine</h1>
        <p className="docs-desc">
          Reflective light-sweep effect to draw user attention to premium features or primary buttons.
        </p>

        <section id="shine" className="demo-section">
          <h2>Light-Sweep Reflection</h2>
          <CodePreview code={SHINE_CODE}>
            <div style={{ padding: 24, display: 'flex', gap: 24, alignItems: 'center' }}>
              <Shine active={true}>
                <Button variant="primary">Shining Pro Feature</Button>
              </Shine>
              <Shine active={true}>
                <Card style={{ padding: '12px 20px', fontWeight: 600 }}>
                  Featured Announcement 🚀
                </Card>
              </Shine>
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
                <tr><td><code>active</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Enable reflective shine sweep</td></tr>
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
