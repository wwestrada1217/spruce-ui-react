import { useState, useEffect, useRef } from 'react';
import { OrgChart, type OrgNode } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'org',  label: 'Organization Hierarchy' },
  { id: 'api',  label: 'API' },
];

export function OrgChartPage() {
  const [activeSection, setActiveSection] = useState('org');
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

  const data: OrgNode = {
    id: 'ceo',
    name: 'Sarah Connor',
    role: 'CEO & Founder',
    children: [
      {
        id: 'cto',
        name: 'Alex Rivera',
        role: 'VP of Engineering',
        children: [
          { id: 'dev1', name: 'James Wright', role: 'Lead Frontend' },
          { id: 'dev2', name: 'Elena Rostova', role: 'Backend Architect' },
        ],
      },
      {
        id: 'cpo',
        name: 'Marcus Vance',
        role: 'Head of Product',
        children: [
          { id: 'ux1', name: 'Chloe Bennett', role: 'Lead UI/UX' },
          { id: 'pm1', name: 'David Kim', role: 'Product Manager' },
        ],
      },
    ],
  };

  const ORG_CODE = `import { OrgChart } from 'spruce-react';

const data = {
  id: 'ceo',
  name: 'Sarah Connor',
  role: 'CEO & Founder',
  children: [
    {
      id: 'cto',
      name: 'Alex Rivera',
      role: 'VP of Engineering',
      children: [
        { id: 'dev1', name: 'James Wright', role: 'Lead Frontend' },
      ],
    },
  ],
};

export function Example() {
  return (
    <OrgChart
      title="Company Leadership Structure"
      subtitle="Interactive organizational hierarchy tree"
      data={data}
      height={360}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Organization Chart</h1>
        <p className="docs-desc">
          Hierarchical tree diagram for displaying team reporting structures and organizational leadership.
        </p>

        <section id="org" className="demo-section">
          <h2>Organizational Hierarchy Tree</h2>
          <CodePreview code={ORG_CODE}>
            <OrgChart
              title="Company Leadership Structure"
              subtitle="Interactive organizational hierarchy tree"
              data={data}
              height={360}
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
                <tr><td><code>data</code></td><td><code>OrgNode</code></td><td><code>undefined</code></td><td>Root organizational node</td></tr>
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
