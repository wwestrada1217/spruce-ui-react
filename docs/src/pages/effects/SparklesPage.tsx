import { useState, useEffect, useRef } from 'react';
import { Sparkles, Button } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'sparkles', label: 'Sparkles' },
  { id: 'api',      label: 'API' },
];

export function SparklesPage() {
  const [activeSection, setActiveSection] = useState('sparkles');
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

  const SPARKLES_CODE = `import { Sparkles, Button } from 'spruce-react';

export function Example() {
  return (
    <Sparkles color="#f59e0b" count={8}>
      <Button variant="primary">Magical Sparkles</Button>
    </Sparkles>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Sparkles</h1>
        <p className="docs-desc">
          Particle sparkles effect for adding subtle magic and accent highlights to UI elements.
        </p>

        <section id="sparkles" className="demo-section">
          <h2>Sparkles Particle Overlay</h2>
          <CodePreview code={SPARKLES_CODE}>
            <div style={{ padding: 24, display: 'flex', gap: 24, alignItems: 'center' }}>
              <Sparkles color="#f59e0b" count={8}>
                <Button variant="primary">Magical Sparkles</Button>
              </Sparkles>
              <Sparkles color="#3b82f6" count={6}>
                <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--sp-text-default)' }}>
                  Highlighted Headline
                </span>
              </Sparkles>
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
                <tr><td><code>color</code></td><td><code>string</code></td><td><code>'#f59e0b'</code></td><td>Particle sparkle color</td></tr>
                <tr><td><code>count</code></td><td><code>number</code></td><td><code>6</code></td><td>Number of active sparkle particles</td></tr>
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
