import { useState, useEffect, useRef } from 'react';
import { GroupedBarChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'vertical',   label: 'Vertical Grouped' },
  { id: 'horizontal', label: 'Horizontal Grouped' },
];

export function GroupedBarChartPage() {
  const [activeSection, setActiveSection] = useState('vertical');
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
    { name: '2024', data: [320, 450, 510, 600] },
    { name: '2025', data: [410, 520, 640, 750] },
    { name: '2026', data: [490, 610, 780, 920] },
  ];
  const categories = ['Q1', 'Q2', 'Q3', 'Q4'];

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Grouped Bar Chart</h1>
        <p className="docs-desc">
          Native SVG grouped bar chart component for side-by-side comparative analysis of multi-series metrics across categories.
        </p>

        <section id="vertical" className="demo-section" aria-labelledby="vertical-heading">
          <h2 id="vertical-heading">Vertical Grouped Bar Chart</h2>
          <CodePreview
            code={`import { GroupedBarChart } from 'spruce-react';

const series = [
  { name: '2024', data: [320, 450, 510, 600] },
  { name: '2025', data: [410, 520, 640, 750] },
  { name: '2026', data: [490, 610, 780, 920] },
];
const categories = ['Q1', 'Q2', 'Q3', 'Q4'];

export function Example() {
  return (
    <GroupedBarChart
      title="Quarterly Growth Comparison"
      subtitle="Side-by-side revenue per quarter over 3 years"
      series={series}
      categories={categories}
      height={320}
    />
  );
}`}
          >
            <GroupedBarChart
              title="Quarterly Growth Comparison"
              subtitle="Side-by-side revenue per quarter over 3 years"
              series={series}
              categories={categories}
              height={320}
            />
          </CodePreview>
        </section>

        <section id="horizontal" className="demo-section" aria-labelledby="horizontal-heading">
          <h2 id="horizontal-heading">Horizontal Grouped Bar Chart</h2>
          <CodePreview
            code={`import { GroupedBarChart } from 'spruce-react';

export function Example() {
  return (
    <GroupedBarChart
      title="Regional Performance"
      subtitle="Horizontal side-by-side comparison"
      series={series}
      categories={categories}
      orientation="horizontal"
      height={320}
    />
  );
}`}
          >
            <GroupedBarChart
              title="Regional Performance"
              subtitle="Horizontal side-by-side comparison"
              series={series}
              categories={categories}
              orientation="horizontal"
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
