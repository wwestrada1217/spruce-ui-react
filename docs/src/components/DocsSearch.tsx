import { useEffect, useMemo, useState } from 'react';
import { CommandPalette, Icon, Kbd } from 'spruce-react';
import type { CommandPaletteItem } from 'spruce-react';
import { getSearchMetadata } from './docs-meta';
import { useDocsI18n } from './DocsI18n';

const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform);

function buildItems(homeLabel: string, changelogLabel: string, developmentLabel: string, sectionLabel: (label: string) => string): CommandPaletteItem[] {
  const items: CommandPaletteItem[] = [
    { id: '#/', label: homeLabel, icon: 'home', category: 'General', keywords: ['home', 'start'] },
    {
      id: '#/changelog',
      label: changelogLabel,
      icon: 'clock',
      category: 'General',
      keywords: ['changelog', 'releases', 'versions', 'history', 'whats-new'],
    },
    {
      id: '#/development',
      label: developmentLabel,
      icon: 'code',
      category: 'General',
      keywords: ['install', 'installation', 'setup', 'getting-started', 'usage', 'contributing', 'npm'],
    },
  ];

  for (const metadata of getSearchMetadata()) {
    items.push({
      id: metadata.route,
      label: metadata.title,
      icon: 'file-text',
      category: sectionLabel(metadata.section),
      keywords: [...metadata.keywords, metadata.description],
    });
  }

  return items;
}

export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const docs = useDocsI18n();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const searchItems = useMemo(
    () => buildItems(docs.t('home'), docs.t('changelog'), docs.t('development'), docs.section),
    [docs],
  );

  return (
    <>
      <div className="docs-search-wrap">
        <button type="button" className="docs-search" onClick={() => setOpen(true)} aria-label={docs.t('searchDocumentation')}>
          <Icon name="search" size={15} aria-hidden="true" />
          <span className="docs-search__label">{docs.t('searchDocs')}</span>
          <Kbd size="sm" className="docs-search__kbd">
            {isMac ? '⌘K' : 'Ctrl K'}
          </Kbd>
        </button>
      </div>
      <CommandPalette
        items={searchItems}
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(item) => {
          window.location.hash = item.id;
        }}
        placeholder={docs.t('searchDocs')}
        ariaLabel={docs.t('documentationSearch')}
        emptyMessage={docs.t('noMatchingDocs')}
        shortcutKey=""
      />
    </>
  );
}
