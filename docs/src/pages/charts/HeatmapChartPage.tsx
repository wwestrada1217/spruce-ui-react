import { useState, useEffect, useRef } from 'react';
import { HeatmapChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'heatmap', label: 'Matrix Grid' },
  { id: 'api',     label: 'API' },
];

export function HeatmapChartPage() {
  const [activeSection, setActiveSection] = useState('heatmap');
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

  const xCategories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const yCategories = ['00:00', '06:00', '12:00', '18:00'];

  const data = [
    { x: 'Mon', y: '00:00', value: 12 },
    { x: 'Mon', y: '06:00', value: 45 },
    { x: 'Mon', y: '12:00', value: 92 },
    { x: 'Mon', y: '18:00', value: 64 },

    { x: 'Tue', y: '00:00', value: 18 },
    { x: 'Tue', y: '06:00', value: 52 },
    { x: 'Tue', y: '12:00', value: 88 },
    { x: 'Tue', y: '18:00', value: 71 },

    { x: 'Wed', y: '00:00', value: 24 },
    { x: 'Wed', y: '06:00', value: 68 },
    { x: 'Wed', y: '12:00', value: 99 },
    { x: 'Wed', y: '18:00', value: 83 },

    { x: 'Thu', y: '00:00', value: 15 },
    { x: 'Thu', y: '06:00', value: 41 },
    { x: 'Thu', y: '12:00', value: 78 },
    { x: 'Thu', y: '18:00', value: 59 },

    { x: 'Fri', y: '00:00', value: 30 },
    { x: 'Fri', y: '06:00', value: 75 },
    { x: 'Fri', y: '12:00', value: 95 },
    { x: 'Fri', y: '18:00', value: 89 },
  ];

  const HEATMAP_CODE = `import { HeatmapChart } from 'spruce-react';

const xCategories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const yCategories = ['00:00', '06:00', '12:00', '18:00'];

export function Example() {
  return (
    <HeatmapChart
      title="Weekly Server Load Heatmap"
      subtitle="Average CPU utilization density grid"
      data={data}
      xCategories={xCategories}
      yCategories={yCategories}
      height={320}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Heatmap Chart</h1>
        <p className="docs-desc">
          2D matrix grid visualization representing magnitude through color intensity density.
        </p>

        <section id="heatmap" className="demo-section">
          <h2>Matrix Grid Intensity</h2>
          <CodePreview code={HEATMAP_CODE}>
            <HeatmapChart
              title="Weekly Server Load Heatmap"
              subtitle="Average CPU utilization density grid"
              data={data}
              xCategories={xCategories}
              yCategories={yCategories}
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
                <tr><td><code>data</code></td><td><code>HeatmapItem[]</code></td><td><code>[]</code></td><td>Cell data matrix</td></tr>
                <tr><td><code>xCategories</code></td><td><code>string[]</code></td><td><code>[]</code></td><td>X-axis column categories</td></tr>
                <tr><td><code>yCategories</code></td><td><code>string[]</code></td><td><code>[]</code></td><td>Y-axis row categories</td></tr>
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
