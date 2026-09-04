import './blocks.css';
import type { ReactNode } from 'react';
import { useBlockPageNavigation, type BlockPageSection } from './BlockPageNavigation';

export type { BlockPageSection } from './BlockPageNavigation';

interface BlockPageLayoutProps {
  readonly title: string;
  readonly description: string;
  readonly sections: readonly BlockPageSection[];
  readonly children: ReactNode;
}

export function BlockPageLayout({ title, description, sections, children }: BlockPageLayoutProps) {
  const { mainRef, activeSection, scrollToSection } = useBlockPageNavigation(sections);

  return (
    <div className="features-layout sp-block-page">
      <div className="features-main" ref={mainRef}>
        <h1>{title}</h1>
        <p className="docs-desc">{description}</p>
        {children}
      </div>

      <nav className="features-toc" aria-label="On this page">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                className={`toc-link${activeSection === section.id ? ' active' : ''}`}
                aria-current={activeSection === section.id ? 'location' : undefined}
                onClick={() => scrollToSection(section.id)}
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
