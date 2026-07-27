import { useState, useEffect, useRef } from 'react';
import { StackedBarChart } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'standard',   label: 'Standard Stacked' },
  { id: 'normalized', label: '100% Normalized' },
];

export function StackedBarChartPage() {
  const [activeSection, setActiveSection] = useState('standard');
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
    { name: 'Product A', data: [400, 300, 500, 280, 600] },
    { name: 'Product B', data: [240, 190, 320, 210, 410] },
    { name: 'Product C', data: [150, 210, 180, 310, 250] },
  ];
  const categories = ['2022', '2023', '2024', '2025', '2026'];

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Stacked Bar Chart</h1>
        <p className="docs-desc">
          Native SVG stacked bar chart component for displaying cumulative totals and component share across categories.
        </p>

        <section id="standard" className="demo-section" aria-labelledby="standard-heading">
          <h2 id="standard-heading">Standard Stacked Bar Chart</h2>
          <CodePreview
            code={`import { StackedBarChart } from 'spruce-react';

const series = [
  { name: 'Product A', data: [400, 300, 500, 280, 600] },
  { name: 'Product B', data: [240, 190, 320, 210, 410] },
  { name: 'Product C', data: [150, 210, 180, 310, 250] },
];
const categories = ['2022', '2023', '2024', '2025', '2026'];

export function Example() {
  return (
    <StackedBarChart
      title="Annual Product Sales Breakdown"
      subtitle="Cumulative revenue per product line"
      series={series}
      categories={categories}
      height={320}
    />
  );
}`}
          >
            <StackedBarChart
              title="Annual Product Sales Breakdown"
              subtitle="Cumulative revenue per product line"
              series={series}
              categories={categories}
              height={320}
            />
          </CodePreview>
        </section>

        <section id="normalized" className="demo-section" aria-labelledby="normalized-heading">
          <h2 id="normalized-heading">100% Normalized Stacked Bar Chart</h2>
          <CodePreview
            code={`import { StackedBarChart } from 'spruce-react';

export function Example() {
  return (
    <StackedBarChart
      title="Market Share Share-of-Wallet"
      subtitle="Normalized 100% stacked percentage distribution"
      series={series}
      categories={categories}
      percentage={true}
      height={320}
    />
  );
}`}
          >
            <StackedBarChart
              title="Market Share Share-of-Wallet"
              subtitle="Normalized 100% stacked percentage distribution"
              series={series}
              categories={categories}
              percentage={true}
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
