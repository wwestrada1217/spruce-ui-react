import { useState, useEffect, useRef } from 'react';
import { HistogramChart, type HistogramBin } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'histogram', label: 'Histogram Bins' },
  { id: 'api',       label: 'API' },
];

export function HistogramChartPage() {
  const [activeSection, setActiveSection] = useState('histogram');
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

  const data: HistogramBin[] = [
    { x0: 0,   x1: 10,  count: 15 },
    { x0: 10,  x1: 20,  count: 42 },
    { x0: 20,  x1: 30,  count: 85 },
    { x0: 30,  x1: 40,  count: 120 },
    { x0: 40,  x1: 50,  count: 94 },
    { x0: 50,  x1: 60,  count: 60 },
    { x0: 60,  x1: 70,  count: 28 },
    { x0: 70,  x1: 80,  count: 10 },
  ];

  const HISTOGRAM_CODE = `import { HistogramChart } from 'spruce-react';

const data = [
  { x0: 0,   x1: 10,  count: 15 },
  { x0: 10,  x1: 20,  count: 42 },
  { x0: 20,  x1: 30,  count: 85 },
  { x0: 30,  x1: 40,  count: 120 },
  { x0: 40,  x1: 50,  count: 94 },
];

export function Example() {
  return (
    <HistogramChart
      title="Latency Response Distribution"
      subtitle="Frequency count across response time bins (ms)"
      data={data}
      height={320}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Histogram Chart</h1>
        <p className="docs-desc">
          Continuous frequency distribution chart using contiguous range bins.
        </p>

        <section id="histogram" className="demo-section">
          <h2>Frequency Bin Distribution</h2>
          <CodePreview code={HISTOGRAM_CODE}>
            <HistogramChart
              title="Latency Response Distribution"
              subtitle="Frequency count across response time bins (ms)"
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
                <tr><td><code>data</code></td><td><code>HistogramBin[]</code></td><td><code>[]</code></td><td>Continuous range bins</td></tr>
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
