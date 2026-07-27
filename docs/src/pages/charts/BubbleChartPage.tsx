import { useState, useEffect, useRef } from 'react';
import { BubbleChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'bubble', label: 'Bubble Chart' },
  { id: 'api',    label: 'API' },
];

export function BubbleChartPage() {
  const [activeSection, setActiveSection] = useState('bubble');
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

  const series = [
    {
      name: 'Product A',
      data: [
        { x: 15, y: 120, r: 25, label: 'Feature Release' },
        { x: 30, y: 240, r: 45, label: 'Marketing Campaign' },
        { x: 50, y: 310, r: 60, label: 'Promo Expansion' },
        { x: 75, y: 450, r: 85, label: 'Global Push' },
      ],
    },
    {
      name: 'Product B',
      data: [
        { x: 20, y: 180, r: 35, label: 'Initial Rollout' },
        { x: 40, y: 210, r: 40, label: 'Mid Segment' },
        { x: 65, y: 390, r: 70, label: 'Enterprise Ad' },
      ],
    },
  ];

  const BUBBLE_CODE = `import { BubbleChart } from 'spruce-react';

const series = [
  {
    name: 'Product A',
    data: [
      { x: 15, y: 120, r: 25, label: 'Feature Release' },
      { x: 30, y: 240, r: 45, label: 'Marketing Campaign' },
      { x: 50, y: 310, r: 60, label: 'Promo Expansion' },
      { x: 75, y: 450, r: 85, label: 'Global Push' },
    ],
  },
];

export function Example() {
  return (
    <BubbleChart
      title="User Acquisition Impact vs Investment"
      subtitle="X: Investment ($k), Y: Users Acquired, Bubble Radius: ROI Ratio"
      series={series}
      height={320}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Bubble Chart</h1>
        <p className="docs-desc">
          3-dimensional quantitative data visualization using Cartesian X-Y coordinates and scaled bubble radii.
        </p>

        <section id="bubble" className="demo-section">
          <h2>Bubble Data Distribution</h2>
          <CodePreview code={BUBBLE_CODE}>
            <BubbleChart
              title="User Acquisition Impact vs Investment"
              subtitle="X: Investment ($k), Y: Users Acquired, Bubble Radius: ROI Ratio"
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
                <tr><td><code>series</code></td><td><code>BubbleSeries[]</code></td><td><code>[]</code></td><td>Multi-series bubble data array</td></tr>
                <tr><td><code>showGrid</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Background gridlines</td></tr>
                <tr><td><code>showLegend</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Display series legend</td></tr>
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
