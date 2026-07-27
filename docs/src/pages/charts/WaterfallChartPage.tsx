import { useState, useEffect, useRef } from 'react';
import { WaterfallChart, type WaterfallDataItem } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'waterfall', label: 'Waterfall Bridge' },
  { id: 'api',       label: 'API' },
];

export function WaterfallChartPage() {
  const [activeSection, setActiveSection] = useState('waterfall');
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

  const data: WaterfallDataItem[] = [
    { label: 'Start Revenue', value: 1200 },
    { label: 'New Sales',    value: 450 },
    { label: 'Upsells',      value: 280 },
    { label: 'Churn',        value: -190 },
    { label: 'Discounts',    value: -80 },
    { label: 'Ending Total', value: 0, isTotal: true },
  ];

  const WATERFALL_CODE = `import { WaterfallChart } from 'spruce-react';

const data = [
  { label: 'Start Revenue', value: 1200 },
  { label: 'New Sales',    value: 450 },
  { label: 'Upsells',      value: 280 },
  { label: 'Churn',        value: -190 },
  { label: 'Discounts',    value: -80 },
  { label: 'Ending Total', value: 0, isTotal: true },
];

export function Example() {
  return (
    <WaterfallChart
      title="Q3 Revenue Bridge Analysis"
      subtitle="Cumulative impact of positive and negative changes"
      data={data}
      height={320}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Waterfall Chart</h1>
        <p className="docs-desc">
          Sequential bridge chart showing how an initial value is affected by positive and negative variance items.
        </p>

        <section id="waterfall" className="demo-section">
          <h2>Waterfall Bridge Variance</h2>
          <CodePreview code={WATERFALL_CODE}>
            <WaterfallChart
              title="Q3 Revenue Bridge Analysis"
              subtitle="Cumulative impact of positive and negative changes"
              data={data}
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
                <tr><td><code>data</code></td><td><code>WaterfallDataItem[]</code></td><td><code>[]</code></td><td>Bridge items array</td></tr>
                <tr><td><code>positiveColor</code></td><td><code>string</code></td><td><code>'#16a34a'</code></td><td>Positive step color</td></tr>
                <tr><td><code>negativeColor</code></td><td><code>string</code></td><td><code>'#dc2626'</code></td><td>Negative step color</td></tr>
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
