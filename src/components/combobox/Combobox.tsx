/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Combobox.css';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import { computePosition, getScrollParents } from '../../utils/positioning.js';

export interface ComboboxOption {
  label: string;
  value: string;
}

export interface ComboboxProps {
  /** Available options to select from. */
  options: ComboboxOption[];
  /** Current value. A string in single mode, a string array in multiple mode. */
  value?: string | string[];
  /** Callback fired when the selection changes. */
  onChange?: (value: string | string[]) => void;
  /** Placeholder text shown when no query or selection exists. */
  placeholder?: string;
  /** Enable multi-select mode with chips and checkboxes. */
  multiple?: boolean;
  /** Disable the combobox. */
  disabled?: boolean;
  /** Additional CSS class applied to the root element. */
  className?: string;
}

/**
 * A searchable combobox that supports single and multiple selection.
 *
 * Single mode displays a text input with a search icon and a dropdown of
 * filterable options. Multiple mode renders selected values as chips and
 * uses checkboxes in the dropdown.
 *
 * @example
 * ```tsx
 * <Combobox
 *   options={[
 *     { label: 'Apple', value: 'apple' },
 *     { label: 'Banana', value: 'banana' },
 *   ]}
 *   value="apple"
 *   onChange={(val) => console.log(val)}
 * />
 * ```
 */
export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Search…',
  multiple = false,
  disabled = false,
  className = '',
}: ComboboxProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const [ready, setReady] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);

  // -- Derived state ----------------------------------------------------------

  const selectedValues: string[] = useMemo(() => {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const filteredOptions = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, query]);

  // -- Positioning ------------------------------------------------------------

  const reposition = useCallback(() => {
    const wrap = wrapRef.current;
    const dropdown = dropdownRef.current;
    if (!wrap || !dropdown) return;
    const result = computePosition(wrap, dropdown, 'bottom-start', 4);
    setDropdownPos({
      top: result.top,
      left: result.left,
      width: wrap.offsetWidth,
    });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    rafId.current = requestAnimationFrame(reposition);
    return () => cancelAnimationFrame(rafId.current);
  }, [open, reposition]);

  // Reposition when the filtered list changes size (matters when flipped above)
  useEffect(() => {
    if (!open) return;
    rafId.current = requestAnimationFrame(reposition);
    return () => cancelAnimationFrame(rafId.current);
  }, [filteredOptions.length, open, reposition]);

  // Reposition on scroll / resize
  useEffect(() => {
    if (!open) return;

    const onScroll = () => {
      rafId.current = requestAnimationFrame(reposition);
    };

    const scrollables = wrapRef.current ? getScrollParents(wrapRef.current) : [];

    scrollables.forEach((el) => el.addEventListener('scroll', onScroll, { passive: true }));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      scrollables.forEach((el) => el.removeEventListener('scroll', onScroll));
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [open, reposition]);

  // -- Click outside ----------------------------------------------------------

  useEffect(() => {
    if (!open) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (wrapRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpen(false);
    };

    const id = setTimeout(() => document.addEventListener('mousedown', handler, true), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener('mousedown', handler, true);
    };
  }, [open]);

  // -- Sync query in single mode ----------------------------------------------

  // When value changes externally in single mode, update query to match label
  useEffect(() => {
    if (multiple) return;
    if (value && typeof value === 'string') {
      const match = options.find((o) => o.value === value);
      if (match) setQuery(match.label);
    } else if (!value) {
      setQuery('');
    }
  }, [value, options, multiple]);

  // -- Reset highlight when filtered options change ---------------------------

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredOptions.length]);

  // -- Scroll highlighted option into view ------------------------------------

  useEffect(() => {
    if (highlightedIndex < 0 || !dropdownRef.current) return;
    const el = dropdownRef.current.children[highlightedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex]);

  // -- Handlers ---------------------------------------------------------------

  function openPanel() {
    if (disabled) return;
    // Prime width/position from the anchor so the first paint (invisible)
    // measures the dropdown at its real size before the smart-position pass.
    const rect = wrapRef.current?.getBoundingClientRect();
    if (rect) {
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setReady(false);
    setOpen(true);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    if (!open) openPanel();
  }

  function handleInputFocus() {
    openPanel();
  }

  function selectOption(opt: ComboboxOption) {
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      const exists = current.includes(opt.value);
      const next = exists
        ? current.filter((v) => v !== opt.value)
        : [...current, opt.value];
      onChange?.(next);
      setQuery('');
      inputRef.current?.focus();
    } else {
      setQuery(opt.label);
      onChange?.(opt.value);
      setOpen(false);
    }
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    setQuery('');
    if (multiple) {
      onChange?.([]);
    } else {
      onChange?.('');
    }
    inputRef.current?.focus();
  }

  function removeChip(val: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (disabled) return;
    const current = Array.isArray(value) ? value : [];
    onChange?.(current.filter((v) => v !== val));
    inputRef.current?.focus();
  }

  function handleKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!open) {
          openPanel();
          return;
        }
        setHighlightedIndex((prev) => {
          const next = prev + 1;
          return next >= filteredOptions.length ? 0 : next;
        });
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (!open) return;
        setHighlightedIndex((prev) => {
          const next = prev - 1;
          return next < 0 ? filteredOptions.length - 1 : next;
        });
        break;
      }
      case 'Enter': {
        e.preventDefault();
        if (open && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          selectOption(filteredOptions[highlightedIndex]);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setOpen(false);
        break;
      }
      case 'Backspace': {
        if (multiple && query === '' && selectedValues.length > 0) {
          const current = Array.isArray(value) ? value : [];
          onChange?.(current.slice(0, -1));
        }
        break;
      }
    }
  }

  // -- Derived display helpers ------------------------------------------------

  const showClear =
    !disabled &&
    (query.length > 0 || selectedValues.length > 0);

  function getLabelForValue(val: string): string {
    return options.find((o) => o.value === val)?.label ?? val;
  }

  // -- Render -----------------------------------------------------------------

  const rootClasses = [
    'sp-combo',
    open && 'sp-combo--open',
    disabled && 'sp-combo--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const wrapClasses = [
    'sp-combo__input-wrap',
    multiple && 'sp-combo__input-wrap--multi',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses} ref={wrapRef}>
      <div
        className={wrapClasses}
        onClick={() => inputRef.current?.focus()}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {/* Search icon (single mode only) */}
        {!multiple && (
          <Icon name="search" size={14} className="sp-combo__search-icon" />
        )}

        {/* Chips (multi mode) */}
        {multiple &&
          selectedValues.map((val) => (
            <span key={val} className="sp-combo__chip">
              {getLabelForValue(val)}
              <button
                type="button"
                className="sp-combo__chip-remove"
                tabIndex={-1}
                aria-label={`Remove ${getLabelForValue(val)}`}
                onClick={(e) => removeChip(val, e)}
              >
                <Icon name="x" size={10} />
              </button>
            </span>
          ))}

        {/* Text input */}
        <input
          ref={inputRef}
          className="sp-combo__input"
          type="text"
          value={query}
          placeholder={selectedValues.length > 0 && multiple ? '' : placeholder}
          disabled={disabled}
          aria-autocomplete="list"
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
        />

        {/* Clear button */}
        {showClear && (
          <button
            type="button"
            className="sp-combo__clear"
            tabIndex={-1}
            aria-label="Clear selection"
            onClick={handleClear}
          >
            <Icon name="x" size={10} />
          </button>
        )}
      </div>

      {/* Dropdown panel */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="sp-combo__dropdown"
            role="listbox"
            aria-multiselectable={multiple || undefined}
            style={{
              position: 'fixed',
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              zIndex: 999,
              opacity: ready ? 1 : 0,
            }}
          >
            {filteredOptions.length === 0 && (
              <div className="sp-combo__empty">No results found</div>
            )}

            {filteredOptions.map((opt, idx) => {
              const isSelected = selectedValues.includes(opt.value);
              const isHighlighted = idx === highlightedIndex;

              const optClasses = [
                'sp-combo__option',
                isSelected && 'sp-combo__option--selected',
                isHighlighted && 'sp-combo__option--highlighted',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <button
                  key={opt.value}
                  type="button"
                  className={optClasses}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectOption(opt)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                >
                  {multiple && (
                    <span
                      className={[
                        'sp-combo__option-checkbox',
                        isSelected && 'sp-combo__option-checkbox--checked',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {isSelected && <Icon name="check" size={10} />}
                    </span>
                  )}
                  <span>{opt.label}</span>
                  {!multiple && isSelected && (
                    <Icon name="check" size={14} className="sp-combo__check" />
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
