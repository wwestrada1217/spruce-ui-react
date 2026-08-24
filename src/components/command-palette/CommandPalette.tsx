/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './CommandPalette.css';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';

/* ── Types ────────────────────────────────────────────────────────────── */

export interface CommandPaletteItem {
  id: string;
  label: string;
  icon?: string;
  category?: string;
  keywords?: string[];
}

export interface CommandPaletteProps {
  items: CommandPaletteItem[];
  open: boolean;
  onClose: () => void;
  onSelect: (item: CommandPaletteItem) => void;
  placeholder?: string;
  emptyMessage?: string;
  shortcutKey?: string;
  fuzzySearch?: boolean;
  className?: string;
}

/* ── Fuzzy scoring ───────────────────────────────────────────────────── */

function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (q.length === 0) return 1;
  if (q.length > t.length) return 0;

  let qi = 0;
  let score = 0;
  let lastMatchIndex = -1;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += 1;
      // Bonus for consecutive matches
      if (lastMatchIndex === ti - 1) score += 2;
      // Bonus for matching at start or after separator
      if (ti === 0 || t[ti - 1] === ' ' || t[ti - 1] === '-' || t[ti - 1] === '_') {
        score += 3;
      }
      lastMatchIndex = ti;
      qi++;
    }
  }

  // All query characters must match
  if (qi < q.length) return 0;

  return score;
}

function matchesItem(query: string, item: CommandPaletteItem, fuzzy: boolean): number {
  if (!query) return 1;

  if (fuzzy) {
    let bestScore = fuzzyScore(query, item.label);
    if (item.keywords) {
      for (const kw of item.keywords) {
        const s = fuzzyScore(query, kw);
        if (s > bestScore) bestScore = s;
      }
    }
    if (item.category) {
      const s = fuzzyScore(query, item.category);
      if (s > bestScore) bestScore = s;
    }
    return bestScore;
  }

  // Simple substring search
  const q = query.toLowerCase();
  if (item.label.toLowerCase().includes(q)) return 1;
  if (item.keywords?.some((kw) => kw.toLowerCase().includes(q))) return 1;
  if (item.category?.toLowerCase().includes(q)) return 1;
  return 0;
}

/* ── Component ───────────────────────────────────────────────────────── */

export function CommandPalette({
  items,
  open,
  onClose,
  onSelect,
  placeholder = 'Type a command...',
  emptyMessage = 'No results found.',
  shortcutKey = 'k',
  fuzzySearch = true,
  className = '',
}: CommandPaletteProps) {
  const { t } = useI18n();
  const resolvedPlaceholder = placeholder === 'Type a command...' ? t('commandPalette') : placeholder;
  const resolvedEmptyMessage = emptyMessage === 'No results found.' ? t('noResults') : emptyMessage;
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  // Reset on open/close
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      // Focus input after portal renders
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  // Keyboard shortcut to open
  useEffect(() => {
    if (!shortcutKey) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === shortcutKey.toLowerCase()) {
        e.preventDefault();
        if (!open) {
          // The parent controls open state; we just close
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, shortcutKey, onClose]);

  // Filter + sort items
  const filtered = useMemo(() => {
    const scored = items
      .map((item) => ({ item, score: matchesItem(query, item, fuzzySearch) }))
      .filter(({ score }) => score > 0);

    if (fuzzySearch && query) {
      scored.sort((a, b) => b.score - a.score);
    }

    return scored.map(({ item }) => item);
  }, [items, query, fuzzySearch]);

  // Group by category
  const groups = useMemo(() => {
    const map = new Map<string, CommandPaletteItem[]>();
    for (const item of filtered) {
      const cat = item.category || 'General';
      const list = map.get(cat);
      if (list) {
        list.push(item);
      } else {
        map.set(cat, [item]);
      }
    }
    return map;
  }, [filtered]);

  // Build flat list for keyboard nav
  const flatItems = useMemo(() => {
    const result: CommandPaletteItem[] = [];
    for (const items of groups.values()) {
      result.push(...items);
    }
    return result;
  }, [groups]);

  // Clamp active index
  useEffect(() => {
    setActiveIndex((prev) => {
      if (flatItems.length === 0) return 0;
      return Math.min(prev, flatItems.length - 1);
    });
  }, [flatItems.length]);

  // Scroll active item into view
  useEffect(() => {
    const el = itemRefs.current.get(activeIndex);
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) =>
            flatItems.length === 0 ? 0 : (prev + 1) % flatItems.length,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) =>
            flatItems.length === 0
              ? 0
              : (prev - 1 + flatItems.length) % flatItems.length,
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (flatItems[activeIndex]) {
            onSelect(flatItems[activeIndex]);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [flatItems, activeIndex, onSelect, onClose],
  );

  function handleSelect(item: CommandPaletteItem) {
    onSelect(item);
    onClose();
  }

  function setItemRef(index: number, el: HTMLButtonElement | null) {
    if (el) {
      itemRefs.current.set(index, el);
    } else {
      itemRefs.current.delete(index);
    }
  }

  if (!open) return null;

  const dialogClass = ['sp-cp-dialog', className].filter(Boolean).join(' ');

  let flatIndex = 0;

  const portal = (
    <>
      <div className="sp-cp-backdrop" onClick={onClose} aria-hidden />
      <div
        className={dialogClass}
        role="dialog"
        aria-label={t('commandPalette')}
        onKeyDown={handleKeyDown}
      >
        {/* Search bar */}
        <div className="sp-cp-search">
          <span className="sp-cp-search__icon">
            <Icon name="search" size={16} />
          </span>
          <input
            ref={inputRef}
            type="text"
            className="sp-cp-search__input"
            placeholder={resolvedPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            aria-label={t('search')}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="sp-cp-kbd">Esc</kbd>
        </div>

        {/* Results */}
        <div className="sp-cp-results" ref={listRef} role="listbox">
          {flatItems.length === 0 && (
            <div className="sp-cp-empty">{resolvedEmptyMessage}</div>
          )}
          {Array.from(groups.entries()).map(([category, groupItems]) => (
            <div key={category} role="group" aria-label={category}>
              <div className="sp-cp-group__label">{category}</div>
              {groupItems.map((item) => {
                const idx = flatIndex++;
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    ref={(el) => setItemRef(idx, el)}
                    type="button"
                    className={[
                      'sp-cp-item',
                      isActive && 'sp-cp-item--active',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    {item.icon && (
                      <span className="sp-cp-item__icon">
                        <Icon name={item.icon} size={16} />
                      </span>
                    )}
                    <span className="sp-cp-item__label">{item.label}</span>
                    {item.category && (
                      <span className="sp-cp-item__category">{item.category}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return createPortal(portal, document.body);
}
