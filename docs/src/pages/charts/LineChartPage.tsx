import { useState, useEffect, useRef } from 'react';
import { LineChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'single-series', label: 'Single Series' },
  { id: 'multi-series',  label: 'Multi-Series' },
  { id: 'api',           label: 'API' },
];

export function LineChartPage() {
  const [activeSection, setActiveSection] = useState('single-series');
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

  const lineData = [
    { label: 'Jan', value: 120 },
    { label: 'Feb', value: 210 },
    { label: 'Mar', value: 180 },
    { label: 'Apr', value: 340 },
    { label: 'May', value: 310 },
    { label: 'Jun', value: 450 },
  ];

  const series = [
    { name: '2025', data: [150, 230, 220, 310, 290, 390] },
    { name: '2026', data: [210, 320, 310, 420, 480, 560] },
  ];
  const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Line Chart</h1>
        <p className="docs-desc">
          Native SVG line chart component for visualizing continuous trends over time with smooth Bezier curves and multi-series support.
        </p>

        <section id="single-series" className="demo-section" aria-labelledby="single-series-heading">
          <h2 id="single-series-heading">Single Series Line Chart</h2>
          <CodePreview
            code={`import { LineChart } from 'spruce-react';

const data = [
  { label: 'Jan', value: 120 },
  { label: 'Feb', value: 210 },
  { label: 'Mar', value: 180 },
  { label: 'Apr', value: 340 },
  { label: 'May', value: 310 },
  { label: 'Jun', value: 450 },
];

export function Example() {
  return (
    <LineChart
      title="User Signups Trend"
      subtitle="Monthly active user signups in 2026"
      data={data}
      height={300}
    />
  );
}`}
          >
            <LineChart
              title="User Signups Trend"
              subtitle="Monthly active user signups in 2026"
              data={lineData}
              height={300}
            />
          </CodePreview>
        </section>

        <section id="multi-series" className="demo-section" aria-labelledby="multi-series-heading">
          <h2 id="multi-series-heading">Multi-Series Line Comparison</h2>
          <CodePreview
            code={`import { LineChart } from 'spruce-react';

const series = [
  { name: '2025', data: [150, 230, 220, 310, 290, 390] },
  { name: '2026', data: [210, 320, 310, 420, 480, 560] },
];
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export function Example() {
  return (
    <LineChart
      title="Year-over-Year Growth Comparison"
      subtitle="Comparing 2025 vs 2026 performance"
      series={series}
      categories={categories}
      height={320}
    />
  );
}`}
          >
            <LineChart
              title="Year-over-Year Growth Comparison"
              subtitle="Comparing 2025 vs 2026 performance"
              series={series}
              categories={categories}
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
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>data</code></td>
                  <td><code>ChartDataItem[]</code></td>
                  <td><code>undefined</code></td>
                  <td>Single-series data array.</td>
                </tr>
                <tr>
                  <td><code>series</code></td>
                  <td><code>ChartSeries[]</code></td>
                  <td><code>undefined</code></td>
                  <td>Multi-series data array.</td>
                </tr>
                <tr>
                  <td><code>curved</code></td>
                  <td><code>boolean</code></td>
                  <td><code>true</code></td>
                  <td>Render smooth cubic Bezier curve lines.</td>
                </tr>
                <tr>
                  <td><code>showDots</code></td>
                  <td><code>boolean</code></td>
                  <td><code>true</code></td>
                  <td>Show interactive data point dots.</td>
                </tr>
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
