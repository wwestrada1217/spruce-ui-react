import { useState, useEffect, useRef } from 'react';
import { AreaChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'single-series', label: 'Single Series' },
  { id: 'multi-series',  label: 'Multi-Series' },
  { id: 'api',           label: 'API' },
];

export function AreaChartPage() {
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

  const areaData = [
    { label: 'Jan', value: 2400 },
    { label: 'Feb', value: 1398 },
    { label: 'Mar', value: 9800 },
    { label: 'Apr', value: 3908 },
    { label: 'May', value: 4800 },
    { label: 'Jun', value: 3800 },
    { label: 'Jul', value: 4300 },
  ];

  const series = [
    { name: 'Desktop Views', data: [3000, 4200, 5100, 6800, 7200, 8900] },
    { name: 'Mobile Views',  data: [1800, 2400, 3100, 4500, 5200, 6400] },
  ];
  const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Area Chart</h1>
        <p className="docs-desc">
          Native SVG area chart component for emphasizing volume and quantitative change over time with smooth gradient fills.
        </p>

        <section id="single-series" className="demo-section" aria-labelledby="single-series-heading">
          <h2 id="single-series-heading">Single Series Gradient Area Chart</h2>
          <CodePreview
            code={`import { AreaChart } from 'spruce-react';

const data = [
  { label: 'Jan', value: 2400 },
  { label: 'Feb', value: 1398 },
  { label: 'Mar', value: 9800 },
  { label: 'Apr', value: 3908 },
  { label: 'May', value: 4800 },
  { label: 'Jun', value: 3800 },
  { label: 'Jul', value: 4300 },
];

export function Example() {
  return (
    <AreaChart
      title="Monthly Website Traffic"
      subtitle="Total pageviews per month"
      data={data}
      height={300}
    />
  );
}`}
          >
            <AreaChart
              title="Monthly Website Traffic"
              subtitle="Total pageviews per month"
              data={areaData}
              height={300}
            />
          </CodePreview>
        </section>

        <section id="multi-series" className="demo-section" aria-labelledby="multi-series-heading">
          <h2 id="multi-series-heading">Multi-Series Area Comparison</h2>
          <CodePreview
            code={`import { AreaChart } from 'spruce-react';

const series = [
  { name: 'Desktop Views', data: [3000, 4200, 5100, 6800, 7200, 8900] },
  { name: 'Mobile Views',  data: [1800, 2400, 3100, 4500, 5200, 6400] },
];
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export function Example() {
  return (
    <AreaChart
      title="Desktop vs Mobile Pageviews"
      subtitle="Volume trend breakdown by device type"
      series={series}
      categories={categories}
      fillOpacity={0.4}
      height={320}
    />
  );
}`}
          >
            <AreaChart
              title="Desktop vs Mobile Pageviews"
              subtitle="Volume trend breakdown by device type"
              series={series}
              categories={categories}
              fillOpacity={0.4}
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
                  <td><code>fillOpacity</code></td>
                  <td><code>number</code></td>
                  <td><code>0.35</code></td>
                  <td>Opacity of the gradient area fill.</td>
                </tr>
                <tr>
                  <td><code>curved</code></td>
                  <td><code>boolean</code></td>
                  <td><code>true</code></td>
                  <td>Render smooth cubic Bezier curve area boundaries.</td>
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
