import { useState, useEffect, useRef } from 'react';
import { TreemapChart, type TreemapNode } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'treemap', label: 'Treemap Layout' },
  { id: 'api',     label: 'API' },
];

export function TreemapChartPage() {
  const [activeSection, setActiveSection] = useState('treemap');
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

  const data: TreemapNode[] = [
    { name: 'Technology',  value: 450 },
    { name: 'Healthcare',  value: 320 },
    { name: 'Finance',     value: 280 },
    { name: 'Consumer',    value: 190 },
    { name: 'Energy',      value: 140 },
    { name: 'Industrials', value: 90 },
  ];

  const TREEMAP_CODE = `import { TreemapChart } from 'spruce-react';

const data = [
  { name: 'Technology',  value: 450 },
  { name: 'Healthcare',  value: 320 },
  { name: 'Finance',     value: 280 },
  { name: 'Consumer',    value: 190 },
  { name: 'Energy',      value: 140 },
];

export function Example() {
  return (
    <TreemapChart
      title="Sector Portfolio Allocation"
      subtitle="Nested rectangle volume breakdown"
      data={data}
      height={320}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Treemap Chart</h1>
        <p className="docs-desc">
          Space-filling rectangular tree partition chart for visualizing relative proportions.
        </p>

        <section id="treemap" className="demo-section">
          <h2>Rectangular Treemap Partition</h2>
          <CodePreview code={TREEMAP_CODE}>
            <TreemapChart
              title="Sector Portfolio Allocation"
              subtitle="Nested rectangle volume breakdown"
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
                <tr><td><code>data</code></td><td><code>TreemapNode[]</code></td><td><code>[]</code></td><td>Treemap nodes array</td></tr>
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
