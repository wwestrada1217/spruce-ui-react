import { useState, useEffect, useRef } from 'react';
import { CalendarHeatmapChart, type CalendarHeatmapDay } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'calendar', label: 'Calendar Heatmap' },
  { id: 'api',      label: 'API' },
];

export function CalendarHeatmapChartPage() {
  const [activeSection, setActiveSection] = useState('calendar');
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

  const data: CalendarHeatmapDay[] = [
    { date: '2026-W01-1', value: 4 },
    { date: '2026-W01-2', value: 8 },
    { date: '2026-W01-3', value: 12 },
    { date: '2026-W02-1', value: 6 },
    { date: '2026-W02-4', value: 15 },
  ];

  const CALENDAR_CODE = `import { CalendarHeatmapChart } from 'spruce-react';

export function Example() {
  return (
    <CalendarHeatmapChart
      title="Code Contribution Activity"
      subtitle="Git commit density over a 20-week period"
      data={data}
      height={240}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Calendar Heatmap</h1>
        <p className="docs-desc">
          Temporal calendar grid heatmap for visualizing daily commit counts and activity intensity.
        </p>

        <section id="calendar" className="demo-section">
          <h2>Contribution Activity Grid</h2>
          <CodePreview code={CALENDAR_CODE}>
            <CalendarHeatmapChart
              title="Code Contribution Activity"
              subtitle="Git commit density over a 20-week period"
              data={data}
              height={240}
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
                <tr><td><code>data</code></td><td><code>CalendarHeatmapDay[]</code></td><td><code>[]</code></td><td>Daily contribution activity items</td></tr>
                <tr><td><code>baseColor</code></td><td><code>string</code></td><td><code>'#16a34a'</code></td><td>Primary intensity color</td></tr>
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
