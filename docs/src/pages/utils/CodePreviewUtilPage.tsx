import { useState, useEffect, useRef } from 'react';
import { Button } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'codepreview', label: 'Code Preview' },
  { id: 'api',         label: 'API' },
];

export function CodePreviewUtilPage() {
  const [activeSection, setActiveSection] = useState('codepreview');
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

  const EXAMPLE_CODE = `import { Button } from 'spruce-react';

export function Example() {
  return <Button variant="primary">Click Me</Button>;
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Code Preview Utility</h1>
        <p className="docs-desc">
          Interactive component preview container with toggleable syntax-highlighted source code view.
        </p>

        <section id="codepreview" className="demo-section">
          <h2>Code Preview Showcase</h2>
          <CodePreview code={EXAMPLE_CODE}>
            <div style={{ padding: 16 }}>
              <Button variant="primary">Click Me</Button>
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
                <tr><td><code>code</code></td><td><code>string</code></td><td><code>''</code></td><td>Source code snippet string</td></tr>
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
