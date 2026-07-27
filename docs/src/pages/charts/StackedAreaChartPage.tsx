import { useState, useEffect, useRef } from 'react';
import { StackedAreaChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'cumulative', label: 'Cumulative Volume' },
];

export function StackedAreaChartPage() {
  const [activeSection, setActiveSection] = useState('cumulative');
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
    { name: 'Direct', data: [1200, 1800, 2400, 3100, 3900, 4800] },
    { name: 'Organic Search', data: [900, 1400, 2100, 2900, 3600, 4200] },
    { name: 'Social', data: [400, 600, 900, 1200, 1700, 2100] },
  ];
  const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Stacked Area Chart</h1>
        <p className="docs-desc">
          Native SVG stacked area chart component for visualizing cumulative volume trends and component composition over time.
        </p>

        <section id="cumulative" className="demo-section" aria-labelledby="cumulative-heading">
          <h2 id="cumulative-heading">Cumulative Traffic Source Area</h2>
          <CodePreview
            code={`import { StackedAreaChart } from 'spruce-react';

const series = [
  { name: 'Direct', data: [1200, 1800, 2400, 3100, 3900, 4800] },
  { name: 'Organic Search', data: [900, 1400, 2100, 2900, 3600, 4200] },
  { name: 'Social', data: [400, 600, 900, 1200, 1700, 2100] },
];
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export function Example() {
  return (
    <StackedAreaChart
      title="Cumulative Traffic Volume Growth"
      subtitle="Stacked monthly pageview accumulation by source"
      series={series}
      categories={categories}
      height={320}
    />
  );
}`}
          >
            <StackedAreaChart
              title="Cumulative Traffic Volume Growth"
              subtitle="Stacked monthly pageview accumulation by source"
              series={series}
              categories={categories}
              height={320}
            />
          </CodePreview>
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
