import { useState, useEffect, useRef } from 'react';
import { PolarLineChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'polar', label: 'Polar Ring' },
  { id: 'api',   label: 'API' },
];

export function PolarLineChartPage() {
  const [activeSection, setActiveSection] = useState('polar');
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

  const categories = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const series = [
    { name: 'Wind Frequency', data: [85, 62, 45, 30, 40, 75, 90, 70] },
    { name: 'Average Gusts',  data: [50, 40, 25, 15, 20, 45, 60, 45] },
  ];

  const POLAR_CODE = `import { PolarLineChart } from 'spruce-react';

const categories = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const series = [
  { name: 'Wind Frequency', data: [85, 62, 45, 30, 40, 75, 90, 70] },
];

export function Example() {
  return (
    <PolarLineChart
      title="Wind Rose Radial Distribution"
      subtitle="Directional polar coordinate intensity plot"
      categories={categories}
      series={series}
      maxValue={100}
      height={320}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Polar Line Chart</h1>
        <p className="docs-desc">
          Polar coordinate line chart for plotting directional, cyclical, or angular data distributions.
        </p>

        <section id="polar" className="demo-section">
          <h2>Polar Coordinate Distribution</h2>
          <CodePreview code={POLAR_CODE}>
            <PolarLineChart
              title="Wind Rose Radial Distribution"
              subtitle="Directional polar coordinate intensity plot"
              categories={categories}
              series={series}
              maxValue={100}
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
                <tr><td><code>series</code></td><td><code>PolarSeries[]</code></td><td><code>[]</code></td><td>Polar series data</td></tr>
                <tr><td><code>categories</code></td><td><code>string[]</code></td><td><code>[]</code></td><td>Angular category axes</td></tr>
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
