import { useState, useEffect, useRef } from 'react';
import { Glow, Button } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'glow', label: 'Glow Effect' },
  { id: 'api',  label: 'API' },
];

export function GlowPage() {
  const [activeSection, setActiveSection] = useState('glow');
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

  const GLOW_CODE = `import { Glow, Button } from 'spruce-react';

export function Example() {
  return (
    <Glow color="rgba(15, 118, 110, 0.5)" blur={20} pulse={true}>
      <Button variant="primary">Pulsing Glow Accent</Button>
    </Glow>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Glow</h1>
        <p className="docs-desc">
          Luminous shadow aura effect with pulsing intensity for modern neon and glassmorphic designs.
        </p>

        <section id="glow" className="demo-section">
          <h2>Pulsing Luminous Aura</h2>
          <CodePreview code={GLOW_CODE}>
            <div style={{ padding: 24, display: 'flex', gap: 24, alignItems: 'center' }}>
              <Glow color="rgba(15, 118, 110, 0.5)" blur={20} pulse={true}>
                <Button variant="primary">Pulsing Glow Accent</Button>
              </Glow>
              <Glow color="rgba(245, 158, 11, 0.6)" blur={24} pulse={true}>
                <Button variant="outline" style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
                  Amber Neon Glow
                </Button>
              </Glow>
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
                <tr><td><code>color</code></td><td><code>string</code></td><td><code>'rgba(15, 118, 110, 0.4)'</code></td><td>Glow shadow color</td></tr>
                <tr><td><code>blur</code></td><td><code>number</code></td><td><code>16</code></td><td>Shadow blur radius (px)</td></tr>
                <tr><td><code>pulse</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Enable pulsing brightness animation</td></tr>
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
