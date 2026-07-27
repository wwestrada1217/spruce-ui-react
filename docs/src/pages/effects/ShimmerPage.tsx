import { useState, useEffect, useRef } from 'react';
import { Shimmer, Card } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'shimmer', label: 'Shimmer Loading' },
  { id: 'api',     label: 'API' },
];

export function ShimmerPage() {
  const [activeSection, setActiveSection] = useState('shimmer');
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

  const SHIMMER_CODE = `import { Shimmer, Card } from 'spruce-react';

export function Example() {
  return (
    <Card style={{ width: 300 }}>
      <Shimmer width="100%" height={120} borderRadius={6} />
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Shimmer width="70%" height={16} />
        <Shimmer width="40%" height={14} />
      </div>
    </Card>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Shimmer</h1>
        <p className="docs-desc">
          Placeholder skeleton loading wave animation for perceived performance optimization.
        </p>

        <section id="shimmer" className="demo-section">
          <h2>Skeleton Shimmer Loading</h2>
          <CodePreview code={SHIMMER_CODE}>
            <div style={{ padding: 16 }}>
              <Card style={{ width: 320 }}>
                <Shimmer width="100%" height={120} borderRadius={6} />
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Shimmer width="70%" height={16} />
                  <Shimmer width="40%" height={14} />
                </div>
              </Card>
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
                <tr><td><code>active</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Enable shimmer animation wave</td></tr>
                <tr><td><code>width</code></td><td><code>number | string</code></td><td><code>undefined</code></td><td>Skeleton placeholder width</td></tr>
                <tr><td><code>height</code></td><td><code>number | string</code></td><td><code>undefined</code></td><td>Skeleton placeholder height</td></tr>
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
