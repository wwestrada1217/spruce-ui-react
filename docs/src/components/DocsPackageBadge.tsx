import { useState } from 'react';
import { Icon } from 'spruce-react';
import { useDocsI18n } from './DocsI18n';
import './DocsPackageBadge.css';

export interface DocsPackageBadgeProps {
  /** Package or entry point shown beneath a documentation page heading. */
  packageName?: string;
  /** Alias matching the Angular docs input name. */
  package?: string;
  /** Exported symbols used to form a copyable import statement. */
  symbols?: readonly string[];
}

function importStatement(packageName: string, symbols: readonly string[]): string {
  return symbols.length
    ? `import { ${symbols.join(', ')} } from '${packageName}';`
    : packageName;
}

/** Displays a package entry point and copies its import statement on request. */
export function DocsPackageBadge({ packageName, package: packageAlias, symbols = [] }: DocsPackageBadgeProps) {
  const [copied, setCopied] = useState(false);
  const docs = useDocsI18n();
  const resolvedPackage = packageName ?? packageAlias ?? '';
  const statement = importStatement(resolvedPackage, symbols);

  async function copy(): Promise<void> {
    if (!resolvedPackage) return;
    try {
      const clipboard = typeof document !== 'undefined' ? document.defaultView?.navigator.clipboard : undefined;
      if (!clipboard?.writeText) return;
      await clipboard.writeText(statement);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permissions are optional in docs previews; the badge remains usable.
    }
  }

  if (!resolvedPackage) return null;

  return (
    <div className="docs-package-badge" title={resolvedPackage}>
      <Icon name="package" size={14} aria-hidden="true" />
      <code className="docs-package-badge__name">{resolvedPackage}</code>
      <button
        type="button"
        className="docs-package-badge__copy"
        onClick={() => void copy()}
        aria-label={copied ? docs.t('packageCopied') : docs.t('packageCopyImport')}
        title={copied ? docs.t('packageCopied') : docs.t('packageCopyImport')}
      >
        <Icon name={copied ? 'check' : 'copy'} size={14} aria-hidden="true" />
      </button>
      <span className="docs-package-badge__status" aria-live="polite">
        {copied ? docs.t('packageCopied') : ''}
      </span>
    </div>
  );
}

export const PackageBadge = DocsPackageBadge;
