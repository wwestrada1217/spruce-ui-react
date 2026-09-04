import { type ReactNode } from 'react';
import { DocsPackageBadge } from './DocsPackageBadge';
import { DocsSectionScrubber, type DocsScrubberSection } from './DocsSectionScrubber';
import { useDocsI18n } from './DocsI18n';
import './DocsPageLayout.css';

export interface DocsApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue?: string;
  readonly description: string;
}

export interface DocsApiTableProps {
  readonly rows: readonly DocsApiRow[];
  readonly caption?: string;
}

export function DocsApiTable({ rows, caption }: DocsApiTableProps) {
  return (
    <div className="docs-api-table-wrap">
      <table className="docs-api-table">
        {caption && <caption>{caption}</caption>}
        <thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Default</th><th scope="col">Description</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.name}><th scope="row"><code>{row.name}</code></th><td><code>{row.type}</code></td><td>{row.defaultValue ? <code>{row.defaultValue}</code> : '—'}</td><td>{row.description}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

export interface DocsPageLayoutProps {
  readonly title: string;
  readonly description: string;
  readonly sections: readonly DocsScrubberSection[];
  readonly packageName?: string;
  readonly symbols?: readonly string[];
  readonly children: ReactNode;
}

/** Shared page frame for documentation-platform pages and future page migrations. */
export function DocsPageLayout({ title, description, sections, packageName, symbols, children }: DocsPageLayoutProps) {
  const docs = useDocsI18n();

  return (
    <div className="docs-page-layout">
      <div className="docs-page-layout__main">
        <header className="docs-page-layout__header">
          <h1>{title}</h1>
          <p>{description}</p>
          {packageName && <DocsPackageBadge packageName={packageName} symbols={symbols} />}
        </header>
        {children}
      </div>
      <DocsSectionScrubber sections={sections} ariaLabel={docs.t('onThisPage')} />
    </div>
  );
}
