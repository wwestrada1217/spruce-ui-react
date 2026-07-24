/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import {
  computePosition,
  getScrollParents,
  onClickOutside,
} from '../../utils/positioning.js';
import './GridCombobox.css';

/* ── Public types ──────────────────────────────────────────────────── */

export interface GridComboboxColumn {
  /** Property key on the option object to display in this column. */
  key: string;
  /** Column header label. */
  label: string;
  /** CSS width — any valid grid track size (e.g. '200px', '1fr'). */
  width?: string;
}

export interface GridComboboxOption {
  /** Unique value used as the selection key. */
  value: string;
  /** Display label shown in the input when selected. */
  label: string;
  /** Additional properties matching column keys. */
  [key: string]: unknown;
}

export interface GridComboboxProps {
  /** Column definitions for the grid dropdown. */
  columns: GridComboboxColumn[];
  /** Available options to display. */
  options: GridComboboxOption[];
  /** Currently selected value (controlled). */
  value?: string;
  /** Callback fired when the selected value changes. */
  onChange?: (value: string) => void;
  /** Callback fired with the full option object on selection. */
  onSelect?: (item: GridComboboxOption) => void;
  /** Placeholder text for the search input. */
  placeholder?: string;
  /** Property key(s) used for client-side filtering. Defaults to 'label'. */
  filterBy?: string | string[];
  /** Disables the combobox when true. */
  disabled?: boolean;
  /** Additional CSS class name(s) on the root element. */
  className?: string;
}

/* ── Helpers ───────────────────────────────────────────────────────── */

let instanceCounter = 0;

function cellValue(opt: GridComboboxOption, key: string): string {
  const v = opt[key];
  return v == null ? '' : String(v);
}

/* ── Component ─────────────────────────────────────────────────────── */

/**
 * A searchable combobox that displays options in a multi-column grid format.
 *
 * @example
 * ```tsx
 * <GridCombobox
 *   columns={[
 *     { key: 'code', label: 'Code', width: '80px' },
 *     { key: 'label', label: 'Name', width: '1fr' },
 *   ]}
 *   options={[
 *     { value: 'US', label: 'United States', code: 'US' },
 *     { value: 'CA', label: 'Canada', code: 'CA' },
 *   ]}
 *   value={selected}
 *   onChange={setSelected}
 * />
 * ```
 */
export function GridCombobox({
  columns,
  options,
  value,
  onChange,
  onSelect,
  placeholder = 'Search...',
  filterBy = 'label',
  disabled = false,
  className,
}: GridComboboxProps) {
  const [instanceId] = useState(() => instanceCounter++);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const [panelMinWidth, setPanelMinWidth] = useState(0);
  const [ready, setReady] = useState(false);

  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const rafId = useRef(0);

  /* ── Derived values ───────────────────────────────────────────────── */

  const filterKeys = useMemo(
    () => (Array.isArray(filterBy) ? filterBy : [filterBy]),
    [filterBy],
  );

  const gridTemplate = useMemo(() => {
    if (columns.length === 0) return '1fr';
    return columns.map((c) => c.width ?? '1fr').join(' ');
  }, [columns]);

  const filteredOptions = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return options;
    return options.filter((o) =>
      filterKeys.some((k) =>
        String(o[k] ?? '')
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [options, query, filterKeys]);

  const activeDescendant =
    highlightedIndex >= 0
      ? `sp-gc-opt-${instanceId}-${highlightedIndex}`
      : undefined;

  /* ── Positioning ──────────────────────────────────────────────────── */

  const reposition = useCallback(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;
    const result = computePosition(anchor, panel, 'bottom-start', 4);
    setPanelPos({ top: result.top, left: result.left });
    setPanelMinWidth(anchor.offsetWidth);
    setReady(true);
  }, []);

  // Position the panel when it opens
  useEffect(() => {
    if (!open) {
      setReady(false);
      return;
    }
    rafId.current = requestAnimationFrame(reposition);
    return () => cancelAnimationFrame(rafId.current);
  }, [open, reposition]);

  // Re-position on scroll
  useEffect(() => {
    if (!open) return;
    const anchor = anchorRef.current;
    if (!anchor) return;
    const scrollables = getScrollParents(anchor);
    const onScroll = () => {
      rafId.current = requestAnimationFrame(reposition);
    };
    scrollables.forEach((el) =>
      el.addEventListener('scroll', onScroll, { passive: true }),
    );
    return () => {
      scrollables.forEach((el) => el.removeEventListener('scroll', onScroll));
      cancelAnimationFrame(rafId.current);
    };
  }, [open, reposition]);

  // Click-outside to dismiss
  useEffect(() => {
    if (!open) return;
    const els = [anchorRef.current, panelRef.current].filter(
      Boolean,
    ) as HTMLElement[];
    return onClickOutside(els, () => closePanel());
  }, [open]);

  /* ── Helpers ──────────────────────────────────────────────────────── */

  function isSelected(optionValue: string): boolean {
    return value === optionValue;
  }

  function openPanel() {
    if (disabled) return;
    setOpen(true);
  }

  function closePanel() {
    setOpen(false);
    setHighlightedIndex(-1);
  }

  function selectOption(opt: GridComboboxOption) {
    onChange?.(opt.value);
    onSelect?.(opt);
    setQuery(opt.label);
    closePanel();
  }

  function scrollRowIntoView(index: number) {
    const panel = panelRef.current;
    if (!panel) return;
    // +1 because the first child is the sticky header
    const row = panel.children[index + 1] as HTMLElement | undefined;
    row?.scrollIntoView({ block: 'nearest' });
  }

  /* ── Event handlers ───────────────────────────────────────────────── */

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    openPanel();
    setHighlightedIndex(-1);
  }

  function handleFocus() {
    openPanel();
  }

  function handleClear(e: React.MouseEvent) {
    e.preventDefault();
    setQuery('');
    onChange?.('');
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!open) {
          openPanel();
          return;
        }
        const next =
          highlightedIndex + 1 >= filteredOptions.length
            ? 0
            : highlightedIndex + 1;
        setHighlightedIndex(next);
        requestAnimationFrame(() => scrollRowIntoView(next));
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (!open) {
          openPanel();
          return;
        }
        const prev =
          highlightedIndex - 1 < 0
            ? filteredOptions.length - 1
            : highlightedIndex - 1;
        setHighlightedIndex(prev);
        requestAnimationFrame(() => scrollRowIntoView(prev));
        break;
      }
      case 'Home': {
        if (!open) return;
        e.preventDefault();
        setHighlightedIndex(0);
        requestAnimationFrame(() => scrollRowIntoView(0));
        break;
      }
      case 'End': {
        if (!open) return;
        e.preventDefault();
        const last = filteredOptions.length - 1;
        setHighlightedIndex(last);
        requestAnimationFrame(() => scrollRowIntoView(last));
        break;
      }
      case 'Enter': {
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          selectOption(filteredOptions[highlightedIndex]);
        }
        break;
      }
      case 'Escape':
        e.preventDefault();
        closePanel();
        break;
      case 'Tab':
        closePanel();
        break;
    }
  }

  /* ── Render ───────────────────────────────────────────────────────── */

  const rootCls = [
    'sp-gc',
    open && 'sp-gc--open',
    disabled && 'sp-gc--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div ref={anchorRef} className={rootCls}>
        <div className="sp-gc__input-wrap">
          <Icon name="search" size={14} className="sp-gc__search-icon" />
          <input
            ref={inputRef}
            className="sp-gc__input"
            placeholder={placeholder}
            disabled={disabled}
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
            aria-activedescendant={activeDescendant}
          />
          {query && (
            <button
              className="sp-gc__clear"
              type="button"
              tabIndex={-1}
              aria-label="Clear"
              onMouseDown={handleClear}
            >
              <Icon name="x" size={12} />
            </button>
          )}
        </div>
      </div>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            className="sp-gc__dropdown"
            role="listbox"
            style={{
              position: 'fixed',
              top: panelPos.top,
              left: panelPos.left,
              minWidth: panelMinWidth,
              zIndex: 999,
              opacity: ready ? 1 : 0,
            }}
          >
            {/* Column headers */}
            <div
              className="sp-gc__header"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              {columns.map((col) => (
                <div key={col.key} className="sp-gc__header-cell">
                  {col.label}
                </div>
              ))}
            </div>

            {/* Rows */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, i) => (
                <button
                  key={opt.value}
                  id={`sp-gc-opt-${instanceId}-${i}`}
                  className={[
                    'sp-gc__row',
                    i === highlightedIndex && 'sp-gc__row--highlighted',
                    isSelected(opt.value) && 'sp-gc__row--selected',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  type="button"
                  role="option"
                  aria-selected={isSelected(opt.value)}
                  style={{ gridTemplateColumns: gridTemplate }}
                  onMouseDown={() => selectOption(opt)}
                  onMouseEnter={() => setHighlightedIndex(i)}
                >
                  {columns.map((col) => (
                    <span key={col.key} className="sp-gc__cell">
                      {cellValue(opt, col.key)}
                    </span>
                  ))}
                  {isSelected(opt.value) && (
                    <Icon name="check" size={14} className="sp-gc__check" />
                  )}
                </button>
              ))
            ) : query ? (
              <div className="sp-gc__empty">No matches for "{query}"</div>
            ) : null}
          </div>,
          document.body,
        )}
    </>
  );
}
