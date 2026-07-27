import { useState, useEffect, useRef } from 'react';
import { SankeyChart, type SankeyNode, type SankeyLink } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'sankey', label: 'Flow Ribbon' },
  { id: 'api',    label: 'API' },
];

export function SankeyChartPage() {
  const [activeSection, setActiveSection] = useState('sankey');
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

  const nodes: SankeyNode[] = [
    { id: 'organic', name: 'Organic Search' },
    { id: 'direct',  name: 'Direct Traffic' },
    { id: 'social',  name: 'Social Ads' },
    { id: 'product', name: 'Product Page' },
    { id: 'pricing', name: 'Pricing Page' },
    { id: 'signup',  name: 'Signed Up' },
  ];

  const links: SankeyLink[] = [
    { source: 'organic', target: 'product', value: 4500 },
    { source: 'organic', target: 'pricing', value: 2100 },
    { source: 'direct',  target: 'product', value: 3200 },
    { source: 'social',  target: 'pricing', value: 1800 },
    { source: 'product', target: 'signup',  value: 4800 },
    { source: 'pricing', target: 'signup',  value: 2900 },
  ];

  const SANKEY_CODE = `import { SankeyChart } from 'spruce-react';

const nodes = [
  { id: 'organic', name: 'Organic Search' },
  { id: 'direct',  name: 'Direct Traffic' },
  { id: 'product', name: 'Product Page' },
  { id: 'signup',  name: 'Signed Up' },
];

const links = [
  { source: 'organic', target: 'product', value: 4500 },
  { source: 'product', target: 'signup',  value: 4800 },
];

export function Example() {
  return (
    <SankeyChart
      title="User Acquisition Conversion Flow"
      subtitle="Flow magnitude distribution from traffic source to signup"
      nodes={nodes}
      links={links}
      height={340}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Sankey Chart</h1>
        <p className="docs-desc">
          Flow diagram for visualizing volume transfers and conversion drop-offs between nodes.
        </p>

        <section id="sankey" className="demo-section">
          <h2>Flow Ribbon Transfer</h2>
          <CodePreview code={SANKEY_CODE}>
            <SankeyChart
              title="User Acquisition Conversion Flow"
              subtitle="Flow magnitude distribution from traffic source to signup"
              nodes={nodes}
              links={links}
              height={340}
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
                <tr><td><code>nodes</code></td><td><code>SankeyNode[]</code></td><td><code>[]</code></td><td>Diagram nodes list</td></tr>
                <tr><td><code>links</code></td><td><code>SankeyLink[]</code></td><td><code>[]</code></td><td>Flow transfer links</td></tr>
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
