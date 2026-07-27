import { useState, useEffect, useRef } from 'react';
import { Rainbow, Button } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'rainbow', label: 'Rainbow Gradient' },
  { id: 'api',     label: 'API' },
];

export function RainbowPage() {
  const [activeSection, setActiveSection] = useState('rainbow');
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

  const RAINBOW_CODE = `import { Rainbow, Button } from 'spruce-react';

export function Example() {
  return (
    <Rainbow animated={true} borderWidth={3}>
      <Button variant="outline">Animated Spectrum Border</Button>
    </Rainbow>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Rainbow</h1>
        <p className="docs-desc">
          Continuous spectrum rainbow gradient animation for eye-catching call-to-action borders.
        </p>

        <section id="rainbow" className="demo-section">
          <h2>Spectrum Rainbow Border</h2>
          <CodePreview code={RAINBOW_CODE}>
            <div style={{ padding: 24 }}>
              <Rainbow animated={true} borderWidth={3}>
                <Button variant="outline">Animated Spectrum Border</Button>
              </Rainbow>
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
                <tr><td><code>animated</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Enable spectrum movement animation</td></tr>
                <tr><td><code>borderWidth</code></td><td><code>number</code></td><td><code>2</code></td><td>Gradient border thickness (px)</td></tr>
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
