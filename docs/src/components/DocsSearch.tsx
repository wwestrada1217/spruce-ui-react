import { useEffect, useState } from 'react';
import { CommandPalette, Icon, Kbd } from 'spruce-react';
import type { CommandPaletteItem } from 'spruce-react';
import { NAV_SECTIONS, isNavBranch } from './nav';

const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform);

function buildItems(): CommandPaletteItem[] {
  const items: CommandPaletteItem[] = [
    { id: '#/', label: 'Home', icon: 'home', category: 'General' },
    {
      id: '#/changelog',
      label: 'Changelog',
      icon: 'clock',
      category: 'General',
      keywords: ['changelog', 'releases', 'versions', 'history', 'whats-new'],
    },
    {
      id: '#/development',
      label: 'Development',
      icon: 'code',
      category: 'General',
      keywords: ['install', 'installation', 'setup', 'getting-started', 'usage', 'contributing', 'npm'],
    },
  ];

  for (const section of NAV_SECTIONS) {
    for (const entry of section.items) {
      const leaves = isNavBranch(entry) ? entry.children : [entry];
      for (const leaf of leaves) {
        if (leaf.soon) continue;
        items.push({
          id: leaf.route,
          label: leaf.label,
          icon: leaf.icon,
          category: section.label,
          keywords: leaf.route.split('/').pop()?.split('-') ?? [],
        });
      }
    }
  }

  return items;
}

const SEARCH_ITEMS = buildItems();

export function DocsSearch() {
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <div className="docs-search-wrap">
        <button type="button" className="docs-search" onClick={() => setOpen(true)}>
          <Icon name="search" size={15} aria-hidden="true" />
          <span className="docs-search__label">Search docs…</span>
          <Kbd size="sm" className="docs-search__kbd">
            {isMac ? '⌘K' : 'Ctrl K'}
          </Kbd>
        </button>
      </div>
      <CommandPalette
        items={SEARCH_ITEMS}
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(item) => {
          window.location.hash = item.id;
        }}
        placeholder="Search docs…"
        emptyMessage="No matching pages."
        shortcutKey=""
      />
    </>
  );
}
