import { useState, useEffect, useRef } from 'react';
import { PieChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'standard', label: 'Standard Pie' },
  { id: 'donut',    label: 'Donut Variant' },
  { id: 'api',      label: 'API' },
];

export function PieChartPage() {
  const [activeSection, setActiveSection] = useState('standard');
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

  const browserData = [
    { label: 'Chrome', value: 65 },
    { label: 'Safari', value: 18 },
    { label: 'Edge', value: 9 },
    { label: 'Firefox', value: 5 },
    { label: 'Other', value: 3 },
  ];

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Pie Chart</h1>
        <p className="docs-desc">
          Native SVG pie & donut chart component for visualizing proportions and percentage shares of a whole.
        </p>

        <section id="standard" className="demo-section" aria-labelledby="standard-heading">
          <h2 id="standard-heading">Standard Pie Chart</h2>
          <CodePreview
            code={`import { PieChart } from 'spruce-react';

const data = [
  { label: 'Chrome', value: 65 },
  { label: 'Safari', value: 18 },
  { label: 'Edge', value: 9 },
  { label: 'Firefox', value: 5 },
  { label: 'Other', value: 3 },
];

export function Example() {
  return (
    <PieChart
      title="Global Browser Market Share"
      subtitle="Desktop browser usage distribution"
      data={data}
      height={300}
    />
  );
}`}
          >
            <PieChart
              title="Global Browser Market Share"
              subtitle="Desktop browser usage distribution"
              data={browserData}
              height={300}
            />
          </CodePreview>
        </section>

        <section id="donut" className="demo-section" aria-labelledby="donut-heading">
          <h2 id="donut-heading">Donut Chart Variant</h2>
          <CodePreview
            code={`import { PieChart } from 'spruce-react';

export function Example() {
  return (
    <PieChart
      title="Traffic Source Breakdown"
      subtitle="Percentage of visitors by channel"
      data={[
        { label: 'Direct', value: 40 },
        { label: 'Organic Search', value: 35 },
        { label: 'Referral', value: 15 },
        { label: 'Social', value: 10 },
      ]}
      donut={true}
      innerRadius={60}
      height={320}
    />
  );
}`}
          >
            <PieChart
              title="Traffic Source Breakdown"
              subtitle="Percentage of visitors by channel"
              data={[
                { label: 'Direct', value: 40 },
                { label: 'Organic Search', value: 35 },
                { label: 'Referral', value: 15 },
                { label: 'Social', value: 10 },
              ]}
              donut={true}
              innerRadius={60}
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
                  <td><code>[]</code></td>
                  <td>Array of pie slice data items.</td>
                </tr>
                <tr>
                  <td><code>donut</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Render as donut chart cutout.</td>
                </tr>
                <tr>
                  <td><code>innerRadius</code></td>
                  <td><code>number</code></td>
                  <td><code>55</code></td>
                  <td>Cutout inner radius percentage for donut mode.</td>
                </tr>
                <tr>
                  <td><code>title</code></td>
                  <td><code>string</code></td>
                  <td><code>undefined</code></td>
                  <td>Chart title string.</td>
                </tr>
                <tr>
                  <td><code>subtitle</code></td>
                  <td><code>string</code></td>
                  <td><code>undefined</code></td>
                  <td>Chart subtitle string.</td>
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
