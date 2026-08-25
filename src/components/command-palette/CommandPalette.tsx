/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './CommandPalette.css';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import { Kbd } from '../kbd/Kbd.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFocusTrap } from '../../utils/FocusUtils.js';

export interface CommandPaletteItem {
  id: string;
  label: string;
  icon?: string;
  category?: string;
  keywords?: string[];
  shortcut?: string[] | string;
}

export interface CommandPaletteProps {
  items: CommandPaletteItem[];
  /** Controlled visibility. */
  open: boolean;
  /** Close request callback. */
  onClose: () => void;
  /** Optional controlled visibility callback, used by the global shortcut. */
  onOpenChange?: (open: boolean) => void;
  onSelect: (item: CommandPaletteItem) => void;
  placeholder?: string;
  ariaLabel?: string;
  emptyMessage?: string;
  shortcutKey?: string;
  fuzzySearch?: boolean;
  highlightQuery?: boolean;
  showShortcuts?: boolean;
  showFooter?: boolean;
  className?: string;
  children?: ReactNode;
}

function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (!q) return 1;
  let queryIndex = 0;
  let score = 0;
  let lastMatch = -2;
  for (let targetIndex = 0; targetIndex < t.length && queryIndex < q.length; targetIndex += 1) {
    if (t[targetIndex] !== q[queryIndex]) continue;
    score += 1;
    if (lastMatch === targetIndex - 1) score += 2;
    if (targetIndex === 0 || ' _-'.includes(t[targetIndex - 1])) score += 3;
    lastMatch = targetIndex;
    queryIndex += 1;
  }
  return queryIndex === q.length ? score : 0;
}

function itemScore(query: string, item: CommandPaletteItem, fuzzy: boolean): number {
  if (!query) return 1;
  const candidates = [item.label, item.category ?? '', ...(item.keywords ?? [])];
  if (fuzzy) return Math.max(...candidates.map((candidate) => fuzzyScore(query, candidate)));
  const normalized = query.toLowerCase();
  return candidates.some((candidate) => candidate.toLowerCase().includes(normalized)) ? 1 : 0;
}

function itemShortcut(shortcut?: string[] | string): string[] {
  if (!shortcut) return [];
  return Array.isArray(shortcut) ? shortcut : shortcut.split('+').map((key) => key.trim()).filter(Boolean);
}

function HighlightedLabel({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return <>{parts.map((part, index) => part.toLowerCase() === query.toLowerCase() ? <mark key={index} className="sp-cp-highlight">{part}</mark> : <span key={index}>{part}</span>)}</>;
}

/** A localized, keyboard-first command palette with controlled visibility. */
export function CommandPalette({
  items,
  open,
  onClose,
  onOpenChange,
  onSelect,
  placeholder,
  ariaLabel,
  emptyMessage,
  shortcutKey = 'k',
  fuzzySearch = false,
  highlightQuery = false,
  showShortcuts = true,
  showFooter = false,
  className = '',
}: CommandPaletteProps) {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const paletteId = useId();
  const resolvedPlaceholder = placeholder ?? t('search');
  const resolvedAriaLabel = ariaLabel ?? t('commandPalette');
  const resolvedEmptyMessage = emptyMessage ?? t('noResults');

  useFocusTrap(dialogRef, { active: open, autoFocus: open, restoreFocus: true });

  const requestClose = useCallback(() => {
    onClose();
    onOpenChange?.(false);
  }, [onClose, onOpenChange]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!shortcutKey) return;
    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === shortcutKey.toLowerCase()) {
        event.preventDefault();
        if (open) requestClose();
        else onOpenChange?.(true);
      } else if (event.key === 'Escape' && open) {
        event.preventDefault();
        requestClose();
      }
    };
    document.addEventListener('keydown', handleDocumentKeyDown);
    return () => document.removeEventListener('keydown', handleDocumentKeyDown);
  }, [onOpenChange, open, requestClose, shortcutKey]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  const filtered = useMemo(() => items
    .map((item) => ({ item, score: itemScore(query.trim().toLowerCase(), item, fuzzySearch) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => fuzzySearch && query ? b.score - a.score : 0)
    .map(({ item }) => item), [fuzzySearch, items, query]);

  const groups = useMemo(() => {
    const grouped = new Map<string, CommandPaletteItem[]>();
    filtered.forEach((item) => {
      const category = item.category || 'General';
      const group = grouped.get(category);
      if (group) group.push(item);
      else grouped.set(category, [item]);
    });
    return grouped;
  }, [filtered]);

  useEffect(() => {
    setActiveIndex((current) => Math.max(0, Math.min(current, filtered.length - 1)));
  }, [filtered.length]);

  useEffect(() => {
    const active = dialogRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const selectItem = (item: CommandPaletteItem) => {
    onSelect(item);
    requestClose();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => filtered.length ? (current + 1) % filtered.length : 0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => filtered.length ? (current - 1 + filtered.length) % filtered.length : 0);
    } else if (event.key === 'Enter' && filtered[activeIndex]) {
      event.preventDefault();
      selectItem(filtered[activeIndex]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      requestClose();
    }
  };

  if (!open) return null;
  let flatIndex = 0;
  const activeId = filtered[activeIndex] ? `sp-cp-opt-${paletteId}-${filtered[activeIndex].id}` : undefined;

  return createPortal(
    <>
      <div className="sp-cp-backdrop" onClick={requestClose} role="presentation" />
      <div
        ref={dialogRef}
        className={['sp-cp-dialog', className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={resolvedAriaLabel}
        tabIndex={-1}
        data-sp-overlay-interactive="true"
        onKeyDown={handleKeyDown}
      >
        <div className="sp-cp-search">
          <span className="sp-cp-search__icon" aria-hidden="true"><Icon name="search" size={16} /></span>
          <input
            ref={inputRef}
            type="text"
            className="sp-cp-search__input"
            placeholder={resolvedPlaceholder}
            value={query}
            onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
            aria-label={resolvedPlaceholder}
            aria-controls={`${paletteId}-results`}
            aria-activedescendant={activeId}
            autoComplete="off"
            spellCheck={false}
          />
          <Kbd size="sm">Esc</Kbd>
        </div>
        <div id={`${paletteId}-results`} className="sp-cp-results" role="listbox" aria-label={t('commandPaletteResults')}>
          {Array.from(groups.entries()).map(([category, groupItems]) => (
            <div key={category} role="group" aria-label={category}>
              <div className="sp-cp-group__label">{category}</div>
              {groupItems.map((item) => {
                const index = flatIndex++;
                const selected = index === activeIndex;
                const keys = itemShortcut(item.shortcut);
                return (
                  <button
                    key={item.id}
                    id={`sp-cp-opt-${paletteId}-${item.id}`}
                    type="button"
                    className={['sp-cp-item', selected && 'sp-cp-item--active'].filter(Boolean).join(' ')}
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectItem(item)}
                  >
                    {item.icon && <span className="sp-cp-item__icon"><Icon name={item.icon} size={16} /></span>}
                    <span className="sp-cp-item__label">{highlightQuery ? <HighlightedLabel text={item.label} query={query} /> : item.label}</span>
                    {item.category && <span className="sp-cp-item__category">{item.category}</span>}
                    {showShortcuts && keys.length > 0 && <span className="sp-cp-item__shortcut"><Kbd keys={keys} size="sm" /></span>}
                  </button>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && <div className="sp-cp-empty">{resolvedEmptyMessage}</div>}
        </div>
        {showFooter && (
          <div className="sp-cp-footer">
            <span className="sp-cp-footer__hint"><Kbd size="sm">↑</Kbd><Kbd size="sm">↓</Kbd>{t('commandPaletteNavigateHint')}</span>
            <span className="sp-cp-footer__hint"><Kbd size="sm">Enter</Kbd>{t('commandPaletteSelectHint')}</span>
            <span className="sp-cp-footer__hint"><Kbd size="sm">Esc</Kbd>{t('commandPaletteCloseHint')}</span>
          </div>
        )}
      </div>
    </>,
    document.body,
  );
}
