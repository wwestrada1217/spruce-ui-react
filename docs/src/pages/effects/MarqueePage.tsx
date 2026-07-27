import { useState, useEffect, useRef } from 'react';
import { Marquee, Badge } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'marquee', label: 'Marquee Ticker' },
  { id: 'api',     label: 'API' },
];

export function MarqueePage() {
  const [activeSection, setActiveSection] = useState('marquee');
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

  const MARQUEE_CODE = `import { Marquee, Badge } from 'spruce-react';

export function Example() {
  return (
    <Marquee speed={25} pauseOnHover={true}>
      <Badge variant="primary">⚡ Vite 6 Support</Badge>
      <Badge variant="success">✨ 80+ Components</Badge>
      <Badge variant="info">🎨 Design Tokens</Badge>
      <Badge variant="warning">🚀 Zero Dependencies</Badge>
    </Marquee>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Marquee</h1>
        <p className="docs-desc">
          Infinite scrolling ticker banner for partner logos, announcements, and feature badges.
        </p>

        <section id="marquee" className="demo-section">
          <h2>Infinite Ticker Banner</h2>
          <CodePreview code={MARQUEE_CODE}>
            <div style={{ padding: 16, background: 'var(--sp-bg-surface-elevated)', borderRadius: 8 }}>
              <Marquee speed={25} pauseOnHover={true}>
                <Badge variant="primary">⚡ Vite 6 Support</Badge>
                <Badge variant="success">✨ 80+ Components</Badge>
                <Badge variant="info">🎨 Design Tokens</Badge>
                <Badge variant="warning">🚀 Zero Dependencies</Badge>
                <Badge variant="danger">🔥 React 19 Ready</Badge>
              </Marquee>
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
                <tr><td><code>speed</code></td><td><code>number</code></td><td><code>30</code></td><td>Duration of full scroll cycle (seconds)</td></tr>
                <tr><td><code>direction</code></td><td><code>'left' | 'right'</code></td><td><code>'left'</code></td><td>Scroll direction movement</td></tr>
                <tr><td><code>pauseOnHover</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Pause animation on mouse hover</td></tr>
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
