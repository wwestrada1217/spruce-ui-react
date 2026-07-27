import { useState, useEffect, useRef } from 'react';
import { FunnelChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'funnel', label: 'Funnel Pipeline' },
  { id: 'api',    label: 'API' },
];

export function FunnelChartPage() {
  const [activeSection, setActiveSection] = useState('funnel');
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

  const data = [
    { label: 'Impressions',    value: 10000 },
    { label: 'Website Visits', value: 5400 },
    { label: 'Downloads',      value: 2300 },
    { label: 'Free Trial',     value: 1100 },
    { label: 'Paid License',   value: 450 },
  ];

  const FUNNEL_CODE = `import { FunnelChart } from 'spruce-react';

const data = [
  { label: 'Impressions',    value: 10000 },
  { label: 'Website Visits', value: 5400 },
  { label: 'Downloads',      value: 2300 },
  { label: 'Free Trial',     value: 1100 },
  { label: 'Paid License',   value: 450 },
];

export function Example() {
  return (
    <FunnelChart
      title="Sales Conversion Funnel"
      subtitle="Percentage retention through marketing pipeline"
      data={data}
      height={320}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Funnel Chart</h1>
        <p className="docs-desc">
          Tapered funnel stage chart for measuring conversion rates and drop-off points across progressive pipeline steps.
        </p>

        <section id="funnel" className="demo-section">
          <h2>Funnel Conversion Pipeline</h2>
          <CodePreview code={FUNNEL_CODE}>
            <FunnelChart
              title="Sales Conversion Funnel"
              subtitle="Percentage retention through marketing pipeline"
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
                <tr><td><code>data</code></td><td><code>ChartDataItem[]</code></td><td><code>[]</code></td><td>Funnel stage data items</td></tr>
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
