import './Select.css';
import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';

/* ── Public types ────────────────────────────────────────────────────────── */

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  size?: SelectSize;
  multiple?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function computePosition(anchor: HTMLElement) {
  const rect = anchor.getBoundingClientRect();
  return { top: rect.bottom + 4, left: rect.left };
}

/* ── Component ───────────────────────────────────────────────────────────── */

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  size = 'md',
  multiple = false,
  disabled = false,
  error,
  className,
}: SelectProps) {
  const instanceId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [panelWidth, setPanelWidth] = useState(0);

  /* ── Derived state ───────────────────────────────────────────────────── */

  const selected: string = typeof value === 'string' ? value : '';
  const selectedItems: string[] = Array.isArray(value) ? value : [];
  const hasValue = multiple ? selectedItems.length > 0 : !!selected;

  const selectedLabel =
    options.find((o) => o.value === selected)?.label ?? '';

  const displayLabel = multiple
    ? placeholder
    : selectedLabel || placeholder;

  const selectedChips = selectedItems.map((v) => ({
    value: v,
    label: options.find((o) => o.value === v)?.label ?? v,
  }));

  function isSelected(val: string): boolean {
    return multiple ? selectedItems.includes(val) : selected === val;
  }

  /* ── Open / close ────────────────────────────────────────────────────── */

  const reposition = useCallback(() => {
    const anchor = wrapperRef.current;
    if (!anchor) return;
    setDropdownPos(computePosition(anchor));
    setPanelWidth(anchor.offsetWidth);
  }, []);

  const openPanel = useCallback(() => {
    reposition();
    setOpen(true);
    const selectedIdx = options.findIndex((o) => isSelected(o.value));
    setHighlightedIndex(selectedIdx >= 0 ? selectedIdx : 0);
  }, [options, reposition]);

  const closePanel = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const toggle = useCallback(() => {
    if (disabled) return;
    open ? closePanel() : openPanel();
  }, [disabled, open, openPanel, closePanel]);

  /* ── Click outside ───────────────────────────────────────────────────── */

  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (wrapperRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      closePanel();
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open, closePanel]);

  /* ── Reposition on scroll / resize ───────────────────────────────────── */

  useEffect(() => {
    if (!open) return;
    const onScroll = () => reposition();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [open, reposition]);

  /* ── Scroll highlighted option into view ─────────────────────────────── */

  useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    const optionEl = document.getElementById(
      `sp-select-opt-${instanceId}-${highlightedIndex}`,
    );
    optionEl?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex, open, instanceId]);

  /* ── Selection ───────────────────────────────────────────────────────── */

  function selectOption(opt: SelectOption) {
    if (opt.disabled) return;
    if (multiple) {
      const current = selectedItems;
      const next = current.includes(opt.value)
        ? current.filter((v) => v !== opt.value)
        : [...current, opt.value];
      onChange?.(next);
    } else {
      onChange?.(opt.value);
      closePanel();
      triggerRef.current?.focus();
    }
  }

  function removeChip(e: React.MouseEvent, val: string) {
    e.stopPropagation();
    const next = selectedItems.filter((v) => v !== val);
    onChange?.(next);
  }

  /* ── Keyboard ────────────────────────────────────────────────────────── */

  function navigateDown() {
    let next = highlightedIndex + 1;
    while (next < options.length && options[next].disabled) next++;
    if (next < options.length) setHighlightedIndex(next);
  }

  function navigateUp() {
    let prev = highlightedIndex - 1;
    while (prev >= 0 && options[prev].disabled) prev--;
    if (prev >= 0) setHighlightedIndex(prev);
  }

  function navigateHome() {
    let first = 0;
    while (first < options.length && options[first].disabled) first++;
    if (first < options.length) setHighlightedIndex(first);
  }

  function navigateEnd() {
    let last = options.length - 1;
    while (last >= 0 && options[last].disabled) last--;
    if (last >= 0) setHighlightedIndex(last);
  }

  function handleKeydown(event: React.KeyboardEvent) {
    if (!open) {
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp':
        case 'Enter':
        case ' ':
          event.preventDefault();
          openPanel();
          return;
        default:
          return;
      }
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        navigateDown();
        break;
      case 'ArrowUp':
        event.preventDefault();
        navigateUp();
        break;
      case 'Home':
        event.preventDefault();
        navigateHome();
        break;
      case 'End':
        event.preventDefault();
        navigateEnd();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < options.length &&
          !options[highlightedIndex].disabled
        ) {
          selectOption(options[highlightedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        closePanel();
        triggerRef.current?.focus();
        break;
      case 'Tab':
        closePanel();
        break;
    }
  }

  /* ── CSS class composition ───────────────────────────────────────────── */

  const wrapperClasses = [
    'sp-select',
    size === 'sm' && 'sp-select--sm',
    size === 'lg' && 'sp-select--lg',
    disabled && 'sp-select--disabled',
    error && 'sp-select--error',
    open && 'sp-select--open',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  /* ── Active descendant for a11y ──────────────────────────────────────── */

  const activeDescendant =
    highlightedIndex >= 0
      ? `sp-select-opt-${instanceId}-${highlightedIndex}`
      : undefined;

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <>
      <div ref={wrapperRef} className={wrapperClasses}>
        <button
          ref={triggerRef}
          className="sp-select__trigger"
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-activedescendant={activeDescendant}
          onClick={toggle}
          onKeyDown={handleKeydown}
        >
          {multiple && selectedItems.length > 0 ? (
            <span className="sp-select__chips">
              {selectedChips.map((chip) => (
                <span key={chip.value} className="sp-select__chip">
                  {chip.label}
                  <button
                    className="sp-select__chip-remove"
                    type="button"
                    tabIndex={-1}
                    aria-label="Remove"
                    onClick={(e) => removeChip(e, chip.value)}
                  >
                    <Icon name="x" size={10} />
                  </button>
                </span>
              ))}
            </span>
          ) : (
            <span
              className={[
                'sp-select__value',
                !hasValue && 'sp-select__value--placeholder',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {displayLabel}
            </span>
          )}
          <Icon name="chevron-down" size={12} className="sp-select__chevron" />
        </button>
      </div>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            className="sp-select__dropdown"
            role="listbox"
            aria-multiselectable={multiple || undefined}
            style={{
              position: 'fixed',
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: panelWidth,
              zIndex: 999,
            }}
          >
            {options.length > 0 ? (
              options.map((opt, i) => (
                <button
                  key={opt.value}
                  id={`sp-select-opt-${instanceId}-${i}`}
                  className={[
                    'sp-select__option',
                    isSelected(opt.value) && 'sp-select__option--selected',
                    highlightedIndex === i && 'sp-select__option--highlighted',
                    opt.disabled && 'sp-select__option--disabled',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  type="button"
                  role="option"
                  aria-selected={isSelected(opt.value)}
                  disabled={opt.disabled}
                  onClick={() => selectOption(opt)}
                  onMouseEnter={() => setHighlightedIndex(i)}
                >
                  {multiple && (
                    <span
                      className={[
                        'sp-select__option-checkbox',
                        isSelected(opt.value) &&
                          'sp-select__option-checkbox--checked',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {isSelected(opt.value) && (
                        <Icon name="check" size={10} />
                      )}
                    </span>
                  )}
                  <span>{opt.label}</span>
                  {!multiple && isSelected(opt.value) && (
                    <Icon
                      name="check"
                      size={14}
                      className="sp-select__check"
                    />
                  )}
                </button>
              ))
            ) : (
              <div className="sp-select__empty">No options</div>
            )}
          </div>,
          document.body,
        )}

      {error && (
        <p className="sp-select-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
