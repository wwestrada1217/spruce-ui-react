import { useState, useEffect, useRef } from 'react';
import { ScatterChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'scatter', label: 'Scatter Distribution' },
  { id: 'api',     label: 'API' },
];

export function ScatterChartPage() {
  const [activeSection, setActiveSection] = useState('scatter');
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

  const series = [
    {
      name: 'Group A',
      data: [
        { x: 10, y: 30, label: 'A-1' },
        { x: 25, y: 65, label: 'A-2' },
        { x: 40, y: 120, label: 'A-3' },
        { x: 55, y: 190, label: 'A-4' },
        { x: 70, y: 240, label: 'A-5' },
      ],
    },
    {
      name: 'Group B',
      data: [
        { x: 15, y: 80, label: 'B-1' },
        { x: 35, y: 110, label: 'B-2' },
        { x: 50, y: 150, label: 'B-3' },
        { x: 65, y: 210, label: 'B-4' },
        { x: 80, y: 290, label: 'B-5' },
      ],
    },
  ];

  const SCATTER_CODE = `import { ScatterChart } from 'spruce-react';

const series = [
  {
    name: 'Group A',
    data: [
      { x: 10, y: 30 },
      { x: 25, y: 65 },
      { x: 40, y: 120 },
      { x: 55, y: 190 },
      { x: 70, y: 240 },
    ],
  },
];

export function Example() {
  return (
    <ScatterChart
      title="Correlation Analysis"
      subtitle="Bivariate data point scatter plot"
      series={series}
      height={320}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Scatter Chart</h1>
        <p className="docs-desc">
          Bivariate scatter plot for discovering trends, clusters, and correlations across continuous data dimensions.
        </p>

        <section id="scatter" className="demo-section">
          <h2>Scatter Plot Distribution</h2>
          <CodePreview code={SCATTER_CODE}>
            <ScatterChart
              title="Correlation Analysis"
              subtitle="Bivariate data point scatter plot"
              series={series}
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
                <tr><td><code>series</code></td><td><code>ScatterSeries[]</code></td><td><code>[]</code></td><td>Scatter series array</td></tr>
                <tr><td><code>showGrid</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Background gridlines</td></tr>
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
