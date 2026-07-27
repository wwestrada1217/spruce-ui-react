import { useState, useEffect, useRef } from 'react';
import { RadarChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'radar', label: 'Radar Polygon' },
  { id: 'api',   label: 'API' },
];

export function RadarChartPage() {
  const [activeSection, setActiveSection] = useState('radar');
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

  const categories = ['Speed', 'Usability', 'Security', 'Features', 'Support', 'Reliability'];
  const series = [
    { name: 'Spruce React', data: [92, 88, 95, 90, 85, 96] },
    { name: 'Legacy System', data: [65, 70, 60, 75, 60, 68] },
  ];

  const RADAR_CODE = `import { RadarChart } from 'spruce-react';

const categories = ['Speed', 'Usability', 'Security', 'Features', 'Support', 'Reliability'];
const series = [
  { name: 'Spruce React', data: [92, 88, 95, 90, 85, 96] },
  { name: 'Legacy System', data: [65, 70, 60, 75, 60, 68] },
];

export function Example() {
  return (
    <RadarChart
      title="Product Capability Assessment"
      subtitle="Multivariate comparative radar web"
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
        <h1>Radar Chart</h1>
        <p className="docs-desc">
          Multivariate star or spider web chart for comparing multiple quantitative metrics across continuous axes.
        </p>

        <section id="radar" className="demo-section">
          <h2>Radar Web Comparison</h2>
          <CodePreview code={RADAR_CODE}>
            <RadarChart
              title="Product Capability Assessment"
              subtitle="Multivariate comparative radar web"
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
                <tr><td><code>series</code></td><td><code>RadarSeries[]</code></td><td><code>[]</code></td><td>Series polygon data</td></tr>
                <tr><td><code>categories</code></td><td><code>string[]</code></td><td><code>[]</code></td><td>Radial category axes</td></tr>
                <tr><td><code>maxValue</code></td><td><code>number</code></td><td><code>undefined</code></td><td>Max axis scale bound</td></tr>
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
