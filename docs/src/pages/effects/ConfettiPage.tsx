import { useState, useEffect, useRef } from 'react';
import { Confetti, Button } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'confetti', label: 'Confetti Explosion' },
  { id: 'api',      label: 'API' },
];

export function ConfettiPage() {
  const [activeSection, setActiveSection] = useState('confetti');
  const [active, setActive] = useState(false);
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

  const CONFETTI_CODE = `import { useState } from 'react';
import { Confetti, Button } from 'spruce-react';

export function Example() {
  const [active, setActive] = useState(false);

  return (
    <div style={{ position: 'relative', padding: 32 }}>
      <Confetti active={active} onComplete={() => setActive(false)} />
      <Button variant="primary" onClick={() => setActive(true)}>
        Trigger Confetti Celebration 🎉
      </Button>
    </div>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Confetti</h1>
        <p className="docs-desc">
          Celebratory particle explosion effect for rewarding achievements and successful interactions.
        </p>

        <section id="confetti" className="demo-section">
          <h2>Celebratory Confetti</h2>
          <CodePreview code={CONFETTI_CODE}>
            <div style={{ position: 'relative', padding: 32, textAlign: 'center', minHeight: 160 }}>
              <Confetti active={active} onComplete={() => setActive(false)} />
              <Button variant="primary" onClick={() => setActive(true)}>
                Trigger Confetti Celebration 🎉
              </Button>
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
                <tr><td><code>active</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Trigger particle animation</td></tr>
                <tr><td><code>count</code></td><td><code>number</code></td><td><code>50</code></td><td>Number of confetti pieces</td></tr>
                <tr><td><code>duration</code></td><td><code>number</code></td><td><code>3000</code></td><td>Animation duration (ms)</td></tr>
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
