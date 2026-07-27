import { useState, useEffect, useRef } from 'react';
import { BarRaceChart, type BarRaceFrame } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'barrace', label: 'Bar Race' },
  { id: 'api',     label: 'API' },
];

export function BarRaceChartPage() {
  const [activeSection, setActiveSection] = useState('barrace');
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

  const frames: BarRaceFrame[] = [
    {
      time: '2024',
      data: [
        { label: 'React',      value: 85 },
        { label: 'Vue',        value: 45 },
        { label: 'Angular',    value: 55 },
        { label: 'Svelte',     value: 30 },
      ],
    },
    {
      time: '2025',
      data: [
        { label: 'React',      value: 92 },
        { label: 'Vue',        value: 58 },
        { label: 'Angular',    value: 50 },
        { label: 'Svelte',     value: 48 },
      ],
    },
    {
      time: '2026',
      data: [
        { label: 'React',      value: 98 },
        { label: 'Vue',        value: 65 },
        { label: 'Svelte',     value: 62 },
        { label: 'Angular',    value: 42 },
      ],
    },
  ];

  const BARRACE_CODE = `import { BarRaceChart } from 'spruce-react';

const frames = [
  {
    time: '2024',
    data: [
      { label: 'React',  value: 85 },
      { label: 'Vue',    value: 45 },
    ],
  },
  {
    time: '2025',
    data: [
      { label: 'React',  value: 92 },
      { label: 'Vue',    value: 58 },
    ],
  },
];

export function Example() {
  return (
    <BarRaceChart
      title="Framework Market Share Ranking Race"
      subtitle="Dynamic time-series leaderboard transitions"
      frames={frames}
      height={320}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Bar Race Chart</h1>
        <p className="docs-desc">
          Animated horizontal bar ranking race for tracking time-series competition leaderboards.
        </p>

        <section id="barrace" className="demo-section">
          <h2>Animated Bar Ranking Race</h2>
          <CodePreview code={BARRACE_CODE}>
            <BarRaceChart
              title="Framework Market Share Ranking Race"
              subtitle="Dynamic time-series leaderboard transitions"
              frames={frames}
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
                <tr><td><code>frames</code></td><td><code>BarRaceFrame[]</code></td><td><code>[]</code></td><td>Time-series animation frames</td></tr>
                <tr><td><code>durationPerFrame</code></td><td><code>number</code></td><td><code>1200</code></td><td>Frame duration in ms</td></tr>
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
