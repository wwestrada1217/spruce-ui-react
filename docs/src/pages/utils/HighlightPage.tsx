import { useState, useEffect, useRef } from 'react';
import { Highlight, Input, Card } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'highlight', label: 'Text Highlight' },
  { id: 'api',       label: 'API' },
];

export function HighlightPage() {
  const [activeSection, setActiveSection] = useState('highlight');
  const [searchQuery, setSearchQuery] = useState('Spruce');
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

  const HIGHLIGHT_CODE = `import { useState } from 'react';
import { Highlight, Input } from 'spruce-react';

export function Example() {
  const [query, setQuery] = useState('Spruce');

  return (
    <div>
      <Input value={query} onChange={setQuery} placeholder="Type search query..." />
      <p>
        <Highlight
          text="Spruce UI React is a premium design system with 80+ components built with Spruce tokens."
          query={query}
        />
      </p>
    </div>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Highlight Utility</h1>
        <p className="docs-desc">
          Text search query substring matching and visual text highlighting component.
        </p>

        <section id="highlight" className="demo-section">
          <h2>Interactive Search Highlight</h2>
          <CodePreview code={HIGHLIGHT_CODE}>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
              <Input value={searchQuery} onChange={setSearchQuery} placeholder="Type query to highlight..." />

              <Card style={{ padding: 16, fontSize: 14, lineHeight: 1.6 }}>
                <Highlight
                  text="Spruce UI React is a modern, ultra-fast React 19 design system. Build responsive enterprise web applications effortlessly with Spruce design tokens and native SVG chart components."
                  query={searchQuery}
                />
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
                <tr><td><code>text</code></td><td><code>string</code></td><td><code>''</code></td><td>Full body text content</td></tr>
                <tr><td><code>query</code></td><td><code>string</code></td><td><code>''</code></td><td>Substring query to highlight</td></tr>
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
