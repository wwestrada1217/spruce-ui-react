import { useState, useEffect, useRef } from 'react';
import { Breadcrumbs, BreadcrumbItem, Icon } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const BASIC_CODE = `<Breadcrumbs>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
  <BreadcrumbItem active>Profile</BreadcrumbItem>
</Breadcrumbs>`;

const SEPARATOR_CODE = `<Breadcrumbs separator="›">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
  <BreadcrumbItem active>Spruce Kit</BreadcrumbItem>
</Breadcrumbs>

<Breadcrumbs separator="·">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
  <BreadcrumbItem active>Components</BreadcrumbItem>
</Breadcrumbs>`;

const DEEP_CODE = `<Breadcrumbs separator="/">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/org">Organization</BreadcrumbItem>
  <BreadcrumbItem href="/org/team">Team</BreadcrumbItem>
  <BreadcrumbItem href="/org/team/project">Project</BreadcrumbItem>
  <BreadcrumbItem active>Settings</BreadcrumbItem>
</Breadcrumbs>`;

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',     label: 'Basic usage' },
  { id: 'separator', label: 'Custom separator' },
  { id: 'deep',      label: 'Deep nesting' },
  { id: 'api',       label: 'API' },
];

export function BreadcrumbPage() {
  const [activeSection, setActiveSection] = useState('basic');
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
    mainRef.current?.querySelectorAll('[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Breadcrumb</h1>
        <p className="docs-desc">
          A navigation aid that shows the user's current location within a hierarchy.
          The last item's separator is hidden automatically.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic usage</h2>
          <p className="section-desc">
            Wrap <code>{'<BreadcrumbItem>'}</code> elements inside <code>{'<Breadcrumbs>'}</code>.
            Set <code>active</code> on the current page item.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div className="demo-row">
              <Breadcrumbs>
                <BreadcrumbItem href="/">Home</BreadcrumbItem>
                <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
                <BreadcrumbItem active>Profile</BreadcrumbItem>
              </Breadcrumbs>
            </div>
          </CodePreview>
        </section>

        <section id="separator" className="demo-section" aria-labelledby="separator-heading">
          <h2 id="separator-heading">Custom separator</h2>
          <p className="section-desc">
            Pass any string to the <code>separator</code> prop on <code>{'<Breadcrumbs>'}</code>.
          </p>
          <CodePreview code={SEPARATOR_CODE}>
            <div className="demo-col" style={{ gap: 12 }}>
              <Breadcrumbs separator="›">
                <BreadcrumbItem href="#">Home</BreadcrumbItem>
                <BreadcrumbItem href="#">Products</BreadcrumbItem>
                <BreadcrumbItem active>Spruce Kit</BreadcrumbItem>
              </Breadcrumbs>
              <Breadcrumbs separator="·">
                <BreadcrumbItem href="#">Home</BreadcrumbItem>
                <BreadcrumbItem href="#">Docs</BreadcrumbItem>
                <BreadcrumbItem active>Components</BreadcrumbItem>
              </Breadcrumbs>
            </div>
          </CodePreview>
        </section>

        <section id="deep" className="demo-section" aria-labelledby="deep-heading">
          <h2 id="deep-heading">Deep nesting</h2>
          <p className="section-desc">Use as many levels as needed. Items wrap naturally on small viewports.</p>
          <CodePreview code={DEEP_CODE}>
            <div className="demo-row">
              <Breadcrumbs>
                <BreadcrumbItem href="#">Home</BreadcrumbItem>
                <BreadcrumbItem href="#">Organization</BreadcrumbItem>
                <BreadcrumbItem href="#">Team</BreadcrumbItem>
                <BreadcrumbItem href="#">Project</BreadcrumbItem>
                <BreadcrumbItem active>Settings</BreadcrumbItem>
              </Breadcrumbs>
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Breadcrumbs Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>separator</code></td><td><code>string</code></td><td><code>'/'</code></td><td>Character rendered between items.</td></tr>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td><code>BreadcrumbItem</code> elements.</td></tr>
              </tbody>
            </table>
          </div>
          <h3 style={{ marginTop: 24 }}>BreadcrumbItem Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>href</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Navigation URL. Renders an <code>&lt;a&gt;</code> when set.</td></tr>
                <tr><td><code>active</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks item as current page (<code>aria-current="page"</code>).</td></tr>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Label content.</td></tr>
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
