/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Mention.css';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../../i18n/i18n-context.js';

/* ── Public types ──────────────────────────────────────────────────────── */

export interface MentionItem {
  id: string;
  label: string;
  avatar?: string;
  description?: string;
}

export interface MentionInsertEvent {
  item: MentionItem;
  start: number;
  end: number;
}

export type MentionTrigger = '@' | '#' | '+' | '/';

/* ── Props ─────────────────────────────────────────────────────────────── */

export interface MentionProps {
  /** Current text value (controlled). */
  value?: string;
  /** List of mentionable items. */
  items?: MentionItem[];
  /** Character that activates the suggestion panel. */
  trigger?: MentionTrigger;
  /** Textarea placeholder text. */
  placeholder?: string;
  /** Accessible name for the textarea. */
  ariaLabel?: string;
  /** Disable the input. */
  disabled?: boolean;
  /** Number of visible text rows. */
  rows?: number;
  /** Input size variant. */
  size?: 'sm' | 'md' | 'lg';
  /** Function to format the inserted text. */
  insertTemplate?: (item: MentionItem) => string;
  /** Called when the text value changes. */
  onValueChange?: (value: string) => void;
  /** Emitted when a mention is inserted. */
  onInsert?: (event: MentionInsertEvent) => void;
  /** Emitted with the current query string for async filtering. */
  onSearch?: (query: string) => void;
}

/* ── Caret coordinate helper ───────────────────────────────────────────── */

function getCaretCoordinates(
  textarea: HTMLTextAreaElement,
): { top: number; left: number; height: number } {
  const mirror = document.createElement('div');
  const style = window.getComputedStyle(textarea);

  const properties = [
    'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
    'wordSpacing', 'textIndent', 'textTransform', 'whiteSpace', 'wordWrap',
    'overflowWrap', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'boxSizing',
  ] as const;

  mirror.style.position = 'absolute';
  mirror.style.top = '0';
  mirror.style.left = '-9999px';
  mirror.style.visibility = 'hidden';
  mirror.style.overflow = 'hidden';
  mirror.style.width = `${textarea.offsetWidth}px`;
  mirror.style.height = 'auto';

  for (const prop of properties) {
    (mirror.style as unknown as Record<string, string>)[prop] = style.getPropertyValue(
      prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
    );
  }

  const text = textarea.value.substring(0, textarea.selectionStart);
  mirror.textContent = text;

  const marker = document.createElement('span');
  marker.textContent = '\u200b';
  mirror.appendChild(marker);

  document.body.appendChild(mirror);

  const markerTop = marker.offsetTop;
  const markerLeft = marker.offsetLeft;
  const lineHeight = parseInt(style.lineHeight, 10) || parseInt(style.fontSize, 10) * 1.5;

  const top = markerTop - textarea.scrollTop;
  const left = markerLeft - textarea.scrollLeft;

  document.body.removeChild(mirror);

  return { top, left, height: lineHeight };
}

/* ── Component ─────────────────────────────────────────────────────────── */

export function Mention({
  value: controlledValue,
  items = [],
  trigger = '@',
  placeholder = 'Type @ to mention someone...',
  ariaLabel,
  disabled = false,
  rows = 3,
  size = 'md',
  insertTemplate,
  onValueChange,
  onInsert,
  onSearch,
}: MentionProps) {
  const { t } = useI18n();
  const [internalValue, setInternalValue] = useState('');
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const [panelOpen, setPanelOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const [query, setQuery] = useState('');

  const mentionStartRef = useRef(-1);
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const defaultInsertTemplate = useCallback(
    (item: MentionItem) => `${trigger}${item.label} `,
    [trigger],
  );

  const formatInsert = insertTemplate ?? defaultInsertTemplate;

  /* ── Filtered items ────────────────────────────────────────────────── */

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q),
    );
  }, [items, query]);

  /* ── Value setter ──────────────────────────────────────────────────── */

  const setValue = useCallback(
    (v: string) => {
      if (!isControlled) setInternalValue(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange],
  );

  /* ── Reposition panel ──────────────────────────────────────────────── */

  const reposition = useCallback(() => {
    const textarea = inputRef.current;
    const panel = panelRef.current;
    if (!textarea || !panel) return;

    const caretCoords = getCaretCoordinates(textarea);
    const textareaRect = textarea.getBoundingClientRect();

    const anchorTop = textareaRect.top + caretCoords.top + caretCoords.height;
    const anchorLeft = textareaRect.left + caretCoords.left;

    const panelHeight = panel.offsetHeight || 200;
    const panelWidth = panel.offsetWidth || 260;
    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;

    let top = anchorTop + 4;
    let left = anchorLeft;

    if (top + panelHeight > viewportH - 8) {
      top = textareaRect.top + caretCoords.top - panelHeight - 4;
    }

    if (left + panelWidth > viewportW - 8) {
      left = viewportW - panelWidth - 8;
    }
    if (left < 8) left = 8;

    setPanelPos({ top, left });
  }, []);

  /* ── Close panel ───────────────────────────────────────────────────── */

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    mentionStartRef.current = -1;
    setQuery('');
    setActiveIndex(0);
  }, []);

  /* ── Open panel ────────────────────────────────────────────────────── */

  const openPanel = useCallback(() => {
    setPanelOpen(true);
    requestAnimationFrame(() => reposition());
  }, [reposition]);

  /* ── Detect mention ────────────────────────────────────────────────── */

  const detectMention = useCallback(
    (textarea: HTMLTextAreaElement) => {
      const text = textarea.value;
      const cursorPos = textarea.selectionStart;

      let start = cursorPos - 1;
      while (start >= 0) {
        const char = text[start];
        if (char === trigger) {
          if (start === 0 || /\s/.test(text[start - 1])) {
            break;
          }
          closePanel();
          return;
        }
        if (/\s/.test(char)) {
          closePanel();
          return;
        }
        start--;
      }

      if (start < 0) {
        closePanel();
        return;
      }

      const mentionQuery = text.substring(start + 1, cursorPos);

      mentionStartRef.current = start;
      setQuery(mentionQuery);
      onSearch?.(mentionQuery);
      setActiveIndex(0);

      if (!panelOpen) {
        openPanel();
      } else {
        requestAnimationFrame(() => reposition());
      }
    },
    [trigger, panelOpen, closePanel, openPanel, reposition, onSearch],
  );

  /* ── Select item ───────────────────────────────────────────────────── */

  const selectItem = useCallback(
    (item: MentionItem, event?: React.MouseEvent) => {
      event?.preventDefault();

      const textarea = inputRef.current;
      if (!textarea || mentionStartRef.current < 0) return;

      const start = mentionStartRef.current;
      const cursorPos = textarea.selectionStart;
      const insertText = formatInsert(item);

      const before = currentValue.substring(0, start);
      const after = currentValue.substring(cursorPos);
      const newValue = before + insertText + after;
      const newCursorPos = start + insertText.length;

      setValue(newValue);
      closePanel();

      onInsert?.({
        item,
        start,
        end: newCursorPos,
      });

      requestAnimationFrame(() => {
        textarea.value = newValue;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      });
    },
    [currentValue, formatInsert, setValue, closePanel, onInsert],
  );

  /* ── Handlers ──────────────────────────────────────────────────────── */

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const textarea = e.target;
    setValue(textarea.value);
    detectMention(textarea);
  }

  function handleClick(e: React.MouseEvent<HTMLTextAreaElement>) {
    detectMention(e.target as HTMLTextAreaElement);
  }

  function handleKeydown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!panelOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const len = filtered.length;
      if (len > 0) setActiveIndex((i) => (i + 1) % len);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const len = filtered.length;
      if (len > 0) setActiveIndex((i) => (i - 1 + len) % len);
      return;
    }

    if (e.key === 'Enter' || e.key === 'Tab') {
      const idx = activeIndex;
      if (filtered.length > 0 && idx >= 0 && idx < filtered.length) {
        e.preventDefault();
        selectItem(filtered[idx]);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      closePanel();
      return;
    }
  }

  function handleBlur() {
    setTimeout(() => {
      if (panelOpen) closePanel();
    }, 150);
  }

  /* ── Click outside to close ────────────────────────────────────────── */

  useEffect(() => {
    if (!panelOpen) return;
    function onMouseDown(e: MouseEvent) {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      const target = e.target as Node;
      if (anchor?.contains(target) || panel?.contains(target)) return;
      closePanel();
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [panelOpen, closePanel]);

  /* ── Scroll repositioning ──────────────────────────────────────────── */

  useEffect(() => {
    if (!panelOpen) return;
    const onScroll = () => requestAnimationFrame(reposition);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [panelOpen, reposition]);

  /* ── Input class ───────────────────────────────────────────────────── */

  const inputCls = [
    'sp-mention__input',
    size === 'sm' ? 'sp-mention__input--sm' : '',
    size === 'lg' ? 'sp-mention__input--lg' : '',
  ].filter(Boolean).join(' ');

  /* ── Render ────────────────────────────────────────────────────────── */

  return (
    <>
      <div className="sp-mention" ref={anchorRef}>
        <textarea
          ref={inputRef}
          className={inputCls}
          placeholder={placeholder}
          aria-label={ariaLabel}
          disabled={disabled}
          rows={rows}
          value={currentValue}
          onChange={handleInput}
          onKeyDown={handleKeydown}
          onClick={handleClick}
          onBlur={handleBlur}
          role="textbox"
          aria-multiline="true"
          aria-expanded={panelOpen}
          aria-haspopup="listbox"
        />
      </div>

      {panelOpen &&
        createPortal(
          <div
            ref={panelRef}
            className="sp-mention__panel"
            role="listbox"
          aria-label={t('suggestions')}
            style={{
              position: 'fixed',
              top: panelPos.top,
              left: panelPos.left,
              zIndex: 999,
            }}
          >
            {filtered.length > 0 ? (
              filtered.map((item, i) => (
                <button
                  key={item.id}
                  className={`sp-mention__option${i === activeIndex ? ' sp-mention__option--active' : ''}`}
                  type="button"
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseDown={(e) => selectItem(item, e)}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  {item.avatar ? (
                    <img
                      className="sp-mention__avatar"
                      src={item.avatar}
                      alt={item.label}
                      width={24}
                      height={24}
                    />
                  ) : (
                    <span className="sp-mention__avatar-fallback">
                      {item.label.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="sp-mention__option-body">
                    <span className="sp-mention__option-label">{item.label}</span>
                    {item.description && (
                      <span className="sp-mention__option-desc">{item.description}</span>
                    )}
                  </span>
                </button>
              ))
            ) : (
              <div className="sp-mention__empty">{t('noResults')}</div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
