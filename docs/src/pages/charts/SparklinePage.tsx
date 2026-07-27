import { useState, useEffect, useRef } from 'react';
import { Sparkline } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'area-line', label: 'Area & Line' },
  { id: 'bar',       label: 'Bar Sparkline' },
];

export function SparklinePage() {
  const [activeSection, setActiveSection] = useState('area-line');
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

  const lineData = [12, 18, 14, 26, 22, 35, 30, 42, 38, 50];
  const barData = [40, 25, 55, 30, 75, 45, 90, 60, 80];

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Sparkline</h1>
        <p className="docs-desc">
          Compact, inline SVG micro-chart component designed for embedding in tables, stat cards, and dashboard metrics.
        </p>

        <section id="area-line" className="demo-section" aria-labelledby="area-line-heading">
          <h2 id="area-line-heading">Area & Line Sparklines</h2>
          <CodePreview
            code={`import { Sparkline } from 'spruce-react';

const data = [12, 18, 14, 26, 22, 35, 30, 42, 38, 50];

export function Example() {
  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      <div>
        <span>Area: </span>
        <Sparkline data={data} type="area" color="#0f766e" width={140} height={36} />
      </div>
      <div>
        <span>Line: </span>
        <Sparkline data={data} type="line" color="#0284c7" width={140} height={36} />
      </div>
    </div>
  );
}`}
          >
            <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginRight: 8 }}>Area:</span>
                <Sparkline data={lineData} type="area" color="#0f766e" width={140} height={36} />
              </div>
              <div>
                <span style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginRight: 8 }}>Line:</span>
                <Sparkline data={lineData} type="line" color="#0284c7" width={140} height={36} />
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="bar" className="demo-section" aria-labelledby="bar-heading">
          <h2 id="bar-heading">Bar Sparkline</h2>
          <CodePreview
            code={`import { Sparkline } from 'spruce-react';

const barData = [40, 25, 55, 30, 75, 45, 90, 60, 80];

export function Example() {
  return (
    <Sparkline data={barData} type="bar" color="#d97706" width={140} height={36} />
  );
}`}
          >
            <Sparkline data={barData} type="bar" color="#d97706" width={140} height={36} />
          </CodePreview>
        </section>
      </div>

      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                className={`toc-link${activeSection === s.id ? ' active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
