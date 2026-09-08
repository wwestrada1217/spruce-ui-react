import { useEffect, useRef, useState, type ReactNode } from 'react';
import { DocsPackageBadge } from '../../components/DocsPackageBadge';

export interface EffectSection {
  id: string;
  label: string;
}

export interface EffectApiRow {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export interface EffectDocsLayoutProps {
  title: string;
  description: string;
  sections: EffectSection[];
  children: ReactNode;
  packageName?: string;
  packageSymbols?: readonly string[];
}

export function EffectDocsLayout({ title, description, sections, children, packageName = 'spruce-react', packageSymbols }: EffectDocsLayoutProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { threshold: 0.3 },
    );
    mainRef.current?.querySelectorAll<HTMLElement>('[id]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>{title}</h1>
        <p className="docs-desc">{description}</p>
        {packageName && <DocsPackageBadge packageName={packageName} symbols={packageSymbols} />}
        {children}
      </div>
      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                className={`toc-link${activeSection === section.id ? ' active' : ''}`}
                aria-current={activeSection === section.id ? 'location' : undefined}
                onClick={() => scrollTo(section.id)}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function EffectApiTable({ rows }: { rows: EffectApiRow[] }) {
  return (
    <div className="api-table-wrap">
      <table className="api-table">
        <thead>
          <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td><code>{row.name}</code></td>
              <td><code>{row.type}</code></td>
              <td><code>{row.defaultValue}</code></td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
