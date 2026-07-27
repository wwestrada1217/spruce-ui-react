import { useState, useEffect, useRef } from 'react';
import { ComboChart, type ComboSeries } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'combo', label: 'Dual Axis Combo' },
  { id: 'api',   label: 'API' },
];

export function ComboChartPage() {
  const [activeSection, setActiveSection] = useState('combo');
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

  const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const series: ComboSeries[] = [
    { name: 'Revenue ($k)', type: 'bar',  data: [120, 150, 180, 220, 260, 310] },
    { name: 'Margin (%)',   type: 'line', data: [22, 25, 28, 24, 30, 35], yAxisIndex: 1 },
  ];

  const COMBO_CODE = `import { ComboChart } from 'spruce-react';

const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const series = [
  { name: 'Revenue ($k)', type: 'bar',  data: [120, 150, 180, 220, 260, 310] },
  { name: 'Margin (%)',   type: 'line', data: [22, 25, 28, 24, 30, 35], yAxisIndex: 1 },
];

export function Example() {
  return (
    <ComboChart
      title="Revenue vs Profit Margin"
      subtitle="Combined bar and line chart with dual Y-axes"
      categories={categories}
      series={series}
      height={320}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Combo Chart</h1>
        <p className="docs-desc">
          Dual-axis combination chart supporting overlaid bar and trend line series.
        </p>

        <section id="combo" className="demo-section">
          <h2>Dual-Axis Bar & Line Combination</h2>
          <CodePreview code={COMBO_CODE}>
            <ComboChart
              title="Revenue vs Profit Margin"
              subtitle="Combined bar and line chart with dual Y-axes"
              categories={categories}
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
                <tr><td><code>series</code></td><td><code>ComboSeries[]</code></td><td><code>[]</code></td><td>Combination bar and line series</td></tr>
                <tr><td><code>categories</code></td><td><code>string[]</code></td><td><code>[]</code></td><td>X-axis categories</td></tr>
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
