import { useState, useEffect, useRef } from 'react';
import { SunburstChart, type SunburstNode } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'sunburst', label: 'Sunburst Ring' },
  { id: 'api',      label: 'API' },
];

export function SunburstChartPage() {
  const [activeSection, setActiveSection] = useState('sunburst');
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

  const sunburstData: SunburstNode = {
    name: 'Global Revenue',
    children: [
      {
        name: 'North America',
        children: [
          { name: 'Enterprise', value: 450 },
          { name: 'SMB', value: 280 },
        ],
      },
      {
        name: 'Europe',
        children: [
          { name: 'Enterprise', value: 320 },
          { name: 'SMB', value: 190 },
        ],
      },
      {
        name: 'Asia Pacific',
        children: [
          { name: 'Enterprise', value: 240 },
          { name: 'SMB', value: 160 },
        ],
      },
    ],
  };

  const SUNBURST_CODE = `import { SunburstChart } from 'spruce-react';

const data = {
  name: 'Global Revenue',
  children: [
    {
      name: 'North America',
      children: [
        { name: 'Enterprise', value: 450 },
        { name: 'SMB', value: 280 },
      ],
    },
    {
      name: 'Europe',
      children: [
        { name: 'Enterprise', value: 320 },
        { name: 'SMB', value: 190 },
      ],
    },
  ],
};

export function Example() {
  return (
    <SunburstChart
      title="Hierarchical Revenue Share"
      subtitle="Concentric multi-level sunburst visualization"
      data={data}
      height={320}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Sunburst Chart</h1>
        <p className="docs-desc">
          Concentric radial chart for displaying multi-level hierarchical tree structure proportions.
        </p>

        <section id="sunburst" className="demo-section">
          <h2>Sunburst Hierarchical Structure</h2>
          <CodePreview code={SUNBURST_CODE}>
            <SunburstChart
              title="Hierarchical Revenue Share"
              subtitle="Concentric multi-level sunburst visualization"
              data={sunburstData}
              height={320}
            />
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
                <tr><td><code>data</code></td><td><code>SunburstNode</code></td><td><code>undefined</code></td><td>Hierarchical root node</td></tr>
                <tr><td><code>showLegend</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Root children legend</td></tr>
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
