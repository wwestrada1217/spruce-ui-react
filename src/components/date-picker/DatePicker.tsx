/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import { computePosition, getScrollParents, onClickOutside } from '../../utils/positioning.js';
import { useI18n } from '../../i18n/i18n-context.js';
import './DatePicker.css';

/* ── Public Types ────────────────────────────────────────────────────────── */

export type DateFilter = (date: string) => boolean;
export type DatePickerSize = 'sm' | 'md' | 'lg';

export interface DatePickerProps {
  /** Selected date as ISO string "YYYY-MM-DD", or null. */
  value?: string | null;
  /** Called when the selected date changes. Receives null on clear. */
  onChange?: (date: string | null) => void;
  /** Placeholder text when no date is selected. */
  placeholder?: string;
  /** Visual size of the trigger. */
  size?: DatePickerSize;
  /** Disable all interaction. */
  disabled?: boolean;
  /** Render as a text input instead of a button trigger. */
  inputMode?: boolean;
  /** Show ISO week numbers column. */
  showWeekNumbers?: boolean;
  /** Apply a subtle background to week number cells. */
  weekNumberBackground?: boolean;
  /** Earliest selectable date (ISO string). */
  minDate?: string | null;
  /** Latest selectable date (ISO string). */
  maxDate?: string | null;
  /** Array of ISO date strings that cannot be selected. */
  disabledDates?: string[];
  /** Arbitrary filter function. Return false to disable a date. */
  dateFilter?: DateFilter | null;
  /** Additional CSS class applied to the root wrapper. */
  className?: string;
}

/* ── Sub-view enum ───────────────────────────────────────────────────────── */

type View = 'days' | 'months' | 'years';

/* ── Constants ───────────────────────────────────────────────────────────── */

/* ── Date Helpers ────────────────────────────────────────────────────────── */

function todayIso(): string {
  const d = new Date();
  return buildIso(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function buildIso(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseIso(iso: string | null | undefined): { year: number; month: number; day: number } | null {
  if (!iso) return null;
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return { year: parseInt(m[1], 10), month: parseInt(m[2], 10), day: parseInt(m[3], 10) };
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** ISO 8601 week number */
function isoWeekNumber(year: number, month: number, day: number): number {
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay() || 7; // Monday = 1
  date.setDate(date.getDate() + 4 - dayOfWeek);
  const yearStart = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function formatInputValue(iso: string | null | undefined): string {
  const parsed = parseIso(iso);
  if (!parsed) return '';
  return `${String(parsed.month).padStart(2, '0')}/${String(parsed.day).padStart(2, '0')}/${parsed.year}`;
}

function parseInputValue(raw: string): string | null {
  const m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const month = parseInt(m[1], 10);
  const day = parseInt(m[2], 10);
  const year = parseInt(m[3], 10);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
  return buildIso(year, month, day);
}

function clampDay(year: number, month: number, day: number): number {
  return Math.min(day, daysInMonth(year, month));
}

/* ── Component ───────────────────────────────────────────────────────────── */

/**
 * A dropdown date picker with a floating calendar panel.
 *
 * Supports both a button trigger (default) and an input mode,
 * three sub-views (days, months, years), keyboard navigation,
 * min/max dates, disabled dates, and a custom date filter.
 *
 * @example
 * ```tsx
 * <DatePicker value="2025-01-15" onChange={setDate} />
 * <DatePicker inputMode placeholder="MM/DD/YYYY" />
 * ```
 */
export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  size = 'md',
  disabled = false,
  inputMode = false,
  showWeekNumbers = false,
  weekNumberBackground = false,
  minDate,
  maxDate,
  disabledDates,
  dateFilter,
  className,
}: DatePickerProps) {
  const { monthNames, monthLabels, dayLabels, t, formatDate, formatDayLabel, leadingBlankDays } = useI18n();
  const resolvedPlaceholder = placeholder === 'Select date' ? t('selectDate') : placeholder;
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('days');
  const [viewYear, setViewYear] = useState(() => {
    const p = parseIso(value);
    return p ? p.year : new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const p = parseIso(value);
    return p ? p.month : new Date().getMonth() + 1;
  });
  const [focusedDate, setFocusedDate] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');

  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const [panelReady, setPanelReady] = useState(false);
  const rafId = useRef(0);

  // Disabled-dates lookup set for O(1) checks
  const disabledSet = useMemo(
    () => new Set(disabledDates ?? []),
    [disabledDates],
  );

  /* ── Sync view when value changes externally ─────────────────────────── */

  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    const p = parseIso(value);
    if (p) {
      setViewYear(p.year);
      setViewMonth(p.month);
    }
    if (inputMode) {
      setInputText(formatInputValue(value));
    }
  }

  /* ── Date constraint helpers ─────────────────────────────────────────── */

  const isDateDisabled = useCallback(
    (iso: string): boolean => {
      if (disabledSet.has(iso)) return true;
      if (minDate && iso < minDate) return true;
      if (maxDate && iso > maxDate) return true;
      if (dateFilter && !dateFilter(iso)) return true;
      return false;
    },
    [disabledSet, minDate, maxDate, dateFilter],
  );

  const isMonthDisabled = useCallback(
    (year: number, month: number): boolean => {
      // A month is disabled if ALL its days are disabled or outside min/max
      const isoFirst = buildIso(year, month, 1);
      const isoLast = buildIso(year, month, daysInMonth(year, month));
      if (minDate && isoLast < minDate) return true;
      if (maxDate && isoFirst > maxDate) return true;
      return false;
    },
    [minDate, maxDate],
  );

  const isYearDisabled = useCallback(
    (year: number): boolean => {
      const isoFirst = buildIso(year, 1, 1);
      const isoLast = buildIso(year, 12, 31);
      if (minDate && isoLast < minDate) return true;
      if (maxDate && isoFirst > maxDate) return true;
      return false;
    },
    [minDate, maxDate],
  );

  /* ── Calendar grid computation ───────────────────────────────────────── */

  const calendarDays = useMemo(() => {
    const offset = leadingBlankDays(viewYear, viewMonth - 1);
    const total = daysInMonth(viewYear, viewMonth);
    const cells: (number | null)[] = [];

    // Leading empties
    for (let i = 0; i < offset; i++) cells.push(null);
    // Days
    for (let d = 1; d <= total; d++) cells.push(d);

    return cells;
  }, [leadingBlankDays, viewMonth, viewYear]);

  /** Group calendar cells into rows of 7 for week number computation */
  const calendarRows = useMemo(() => {
    const rows: (number | null)[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      rows.push(calendarDays.slice(i, i + 7));
    }
    // Pad last row
    const last = rows[rows.length - 1];
    if (last) {
      while (last.length < 7) last.push(null);
    }
    return rows;
  }, [calendarDays]);

  /* ── Year range for year-picker view ─────────────────────────────────── */

  const yearRangeStart = useMemo(() => viewYear - (viewYear % 12), [viewYear]);

  /* ── Positioning ─────────────────────────────────────────────────────── */

  const reposition = useCallback(() => {
    const anchor = wrapRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;
    const result = computePosition(anchor, panel, 'bottom-start', 4);
    setPanelPos({ top: result.top, left: result.left });
    setPanelReady(true);
  }, []);

  // Position after open, and re-measure when the sub-view changes panel height
  useEffect(() => {
    if (!open) return;
    rafId.current = requestAnimationFrame(reposition);
    return () => cancelAnimationFrame(rafId.current);
  }, [open, view, viewMonth, viewYear, reposition]);

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

  /* ── Click outside ───────────────────────────────────────────────────── */

  useEffect(() => {
    if (!open) return;
    const els = [wrapRef.current, panelRef.current].filter(Boolean) as HTMLElement[];
    return onClickOutside(els, () => setOpen(false));
  }, [open]);

  /* ── Open / Close ────────────────────────────────────────────────────── */

  function openPanel() {
    if (disabled) return;
    // Reset view to days when opening
    setView('days');
    const p = parseIso(value);
    if (p) {
      setViewYear(p.year);
      setViewMonth(p.month);
      setFocusedDate(value ?? null);
    } else {
      const now = new Date();
      setViewYear(now.getFullYear());
      setViewMonth(now.getMonth() + 1);
      setFocusedDate(todayIso());
    }
    setPanelReady(false);
    setOpen(true);
  }

  function closePanel() {
    setOpen(false);
  }

  function togglePanel() {
    if (open) {
      closePanel();
    } else {
      openPanel();
    }
  }

  /* ── Select a day ────────────────────────────────────────────────────── */

  function selectDay(day: number) {
    const iso = buildIso(viewYear, viewMonth, day);
    if (isDateDisabled(iso)) return;
    onChange?.(iso);
    closePanel();
  }

  /* ── Today / Clear ───────────────────────────────────────────────────── */

  function handleToday() {
    const iso = todayIso();
    if (isDateDisabled(iso)) return;
    onChange?.(iso);
    closePanel();
  }

  function handleClear() {
    onChange?.(null);
    closePanel();
  }

  /* ── Navigation ──────────────────────────────────────────────────────── */

  function prevMonth() {
    setViewMonth((m) => {
      if (m === 1) {
        setViewYear((y) => y - 1);
        return 12;
      }
      return m - 1;
    });
  }

  function nextMonth() {
    setViewMonth((m) => {
      if (m === 12) {
        setViewYear((y) => y + 1);
        return 1;
      }
      return m + 1;
    });
  }

  function prevYear() {
    setViewYear((y) => y - 1);
  }

  function nextYear() {
    setViewYear((y) => y + 1);
  }

  function prevYearRange() {
    setViewYear((y) => y - 12);
  }

  function nextYearRange() {
    setViewYear((y) => y + 12);
  }

  /* ── Sub-view navigation ─────────────────────────────────────────────── */

  function selectMonth(month: number) {
    if (isMonthDisabled(viewYear, month)) return;
    setViewMonth(month);
    setView('days');
  }

  function selectYear(year: number) {
    if (isYearDisabled(year)) return;
    setViewYear(year);
    setView('months');
  }

  function headerLabelClick() {
    if (view === 'days') setView('months');
    else if (view === 'months') setView('years');
  }

  /* ── Keyboard Navigation ─────────────────────────────────────────────── */

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!open) openPanel();
    }
  }

  function moveFocusedDate(delta: number) {
    setFocusedDate((prev) => {
      const parsed = parseIso(prev);
      if (!parsed) return prev;
      const d = new Date(parsed.year, parsed.month - 1, parsed.day + delta);
      const newIso = buildIso(d.getFullYear(), d.getMonth() + 1, d.getDate());
      // Update view month/year if we moved out of current view
      if (d.getMonth() + 1 !== viewMonth || d.getFullYear() !== viewYear) {
        setViewMonth(d.getMonth() + 1);
        setViewYear(d.getFullYear());
      }
      return newIso;
    });
  }

  function handlePanelKeyDown(e: React.KeyboardEvent) {
    if (view !== 'days') {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePanel();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        moveFocusedDate(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveFocusedDate(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveFocusedDate(-7);
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveFocusedDate(7);
        break;
      case 'PageUp':
        e.preventDefault();
        if (e.shiftKey) {
          // Move focused date back 1 year
          setFocusedDate((prev) => {
            const p = parseIso(prev);
            if (!p) return prev;
            const newYear = p.year - 1;
            const newDay = clampDay(newYear, p.month, p.day);
            setViewYear(newYear);
            return buildIso(newYear, p.month, newDay);
          });
        } else {
          // Move focused date back 1 month
          setFocusedDate((prev) => {
            const p = parseIso(prev);
            if (!p) return prev;
            let newMonth = p.month - 1;
            let newYear = p.year;
            if (newMonth < 1) {
              newMonth = 12;
              newYear--;
            }
            const newDay = clampDay(newYear, newMonth, p.day);
            setViewYear(newYear);
            setViewMonth(newMonth);
            return buildIso(newYear, newMonth, newDay);
          });
        }
        break;
      case 'PageDown':
        e.preventDefault();
        if (e.shiftKey) {
          setFocusedDate((prev) => {
            const p = parseIso(prev);
            if (!p) return prev;
            const newYear = p.year + 1;
            const newDay = clampDay(newYear, p.month, p.day);
            setViewYear(newYear);
            return buildIso(newYear, p.month, newDay);
          });
        } else {
          setFocusedDate((prev) => {
            const p = parseIso(prev);
            if (!p) return prev;
            let newMonth = p.month + 1;
            let newYear = p.year;
            if (newMonth > 12) {
              newMonth = 1;
              newYear++;
            }
            const newDay = clampDay(newYear, newMonth, p.day);
            setViewYear(newYear);
            setViewMonth(newMonth);
            return buildIso(newYear, newMonth, newDay);
          });
        }
        break;
      case 'Home':
        e.preventDefault();
        setFocusedDate(buildIso(viewYear, viewMonth, 1));
        break;
      case 'End':
        e.preventDefault();
        setFocusedDate(buildIso(viewYear, viewMonth, daysInMonth(viewYear, viewMonth)));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedDate) {
          const p = parseIso(focusedDate);
          if (p && !isDateDisabled(focusedDate)) {
            selectDay(p.day);
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        closePanel();
        break;
    }
  }

  /* ── Input mode handlers ─────────────────────────────────────────────── */

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputText(e.target.value);
  }

  function handleInputBlur() {
    const parsed = parseInputValue(inputText);
    if (parsed) {
      if (!isDateDisabled(parsed)) {
        onChange?.(parsed);
      } else {
        // Revert to previous valid value
        setInputText(formatInputValue(value));
      }
    } else if (inputText === '') {
      onChange?.(null);
    } else {
      // Invalid, revert
      setInputText(formatInputValue(value));
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInputBlur();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) openPanel();
    }
  }

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  const today = todayIso();
  const sizeClass = size === 'sm' ? '--sm' : size === 'lg' ? '--lg' : '';
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;

  /* ── Render: Day view ────────────────────────────────────────────────── */

  function renderDayView() {
    const wk = showWeekNumbers;

    return (
      <>
        {/* Weekday headers */}
        <div
          className={`sp-dp__weekdays${wk ? ' sp-dp__weekdays--with-weeks' : ''}`}
        >
          {wk && <div className="sp-dp__weekday" />}
          {dayLabels.map((wd) => (
            <div key={wd} className="sp-dp__weekday">{wd}</div>
          ))}
        </div>

        {/* Day grid */}
        <div
          className={`sp-dp__grid${wk ? ' sp-dp__grid--with-weeks' : ''}`}
          role="grid"
          aria-label={`${monthNames[viewMonth - 1]} ${viewYear}`}
        >
          {calendarRows.map((row, ri) => {
            // Calculate week number from the first real day in this row
            let weekNum: number | null = null;
            if (wk) {
              const realDay = row.find((d) => d != null);
              if (realDay != null) {
                weekNum = isoWeekNumber(viewYear, viewMonth, realDay);
              }
            }

            return row.map((day, ci) => {
              // Week number cell at the start of each row
              const cells = [];
              if (wk && ci === 0) {
                cells.push(
                  <div
                    key={`wn-${ri}`}
                    className={`sp-dp__week-number${weekNumberBackground ? ' sp-dp__week-number--bg' : ''}`}
                    aria-hidden="true"
                  >
                    {weekNum ?? ''}
                  </div>,
                );
              }

              if (day == null) {
                cells.push(
                  <div
                    key={`e-${ri}-${ci}`}
                    className="sp-dp__day sp-dp__day--empty"
                    aria-hidden="true"
                  />,
                );
              } else {
                const iso = buildIso(viewYear, viewMonth, day);
                const isToday = iso === today;
                const isSelected = iso === value;
                const isFocused = iso === focusedDate;
                const isDayDisabled = isDateDisabled(iso);

                const cls = [
                  'sp-dp__day',
                  isToday && 'sp-dp__day--today',
                  isSelected && 'sp-dp__day--selected',
                  isFocused && 'sp-dp__day--focused',
                  isDayDisabled && 'sp-dp__day--disabled',
                ]
                  .filter(Boolean)
                  .join(' ');

                cells.push(
                  <button
                    key={`d-${day}`}
                    type="button"
                    className={cls}
                    tabIndex={isFocused ? 0 : -1}
                    disabled={isDayDisabled}
                    aria-label={formatDayLabel(day, viewMonth - 1, viewYear)}
                    aria-selected={isSelected}
                    aria-current={isToday ? 'date' : undefined}
                    onClick={() => selectDay(day)}
                  >
                    {day}
                  </button>,
                );
              }

              return cells;
            });
          })}
        </div>
      </>
    );
  }

  /* ── Render: Month view ──────────────────────────────────────────────── */

  function renderMonthView() {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const selectedParsed = parseIso(value);

    return (
      <div className="sp-dp__cell-grid" role="grid" aria-label={t('month')}>
        {monthLabels.map((label, i) => {
          const month = i + 1;
          const isCurrent = month === currentMonth && viewYear === currentYear;
          const isSelected =
            selectedParsed != null && month === selectedParsed.month && viewYear === selectedParsed.year;
          const isDis = isMonthDisabled(viewYear, month);

          const cls = [
            'sp-dp__cell',
            isCurrent && 'sp-dp__cell--current',
            isSelected && 'sp-dp__cell--selected',
            isDis && 'sp-dp__cell--disabled',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={month}
              type="button"
              className={cls}
              disabled={isDis}
              onClick={() => selectMonth(month)}
              aria-label={monthNames[i]}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  /* ── Render: Year view ───────────────────────────────────────────────── */

  function renderYearView() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const selectedParsed = parseIso(value);
    const years: number[] = [];
    for (let i = 0; i < 12; i++) years.push(yearRangeStart + i);

    return (
      <div className="sp-dp__cell-grid" role="grid" aria-label={t('year')}>
        {years.map((year) => {
          const isCurrent = year === currentYear;
          const isSelected = selectedParsed != null && year === selectedParsed.year;
          const isDis = isYearDisabled(year);

          const cls = [
            'sp-dp__cell',
            isCurrent && 'sp-dp__cell--current',
            isSelected && 'sp-dp__cell--selected',
            isDis && 'sp-dp__cell--disabled',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={year}
              type="button"
              className={cls}
              disabled={isDis}
              onClick={() => selectYear(year)}
              aria-label={String(year)}
            >
              {year}
            </button>
          );
        })}
      </div>
    );
  }

  /* ── Render: Header ──────────────────────────────────────────────────── */

  function renderHeader() {
    let labelText: string;
    let labelStatic = false;
    let onPrev: () => void;
    let onNext: () => void;
    let prevLabel: string;
    let nextLabel: string;

    if (view === 'days') {
      labelText = `${monthNames[viewMonth - 1]} ${viewYear}`;
      onPrev = prevMonth;
      onNext = nextMonth;
      prevLabel = t('previousMonth');
      nextLabel = t('nextMonth');
    } else if (view === 'months') {
      labelText = String(viewYear);
      onPrev = prevYear;
      onNext = nextYear;
      prevLabel = t('previousYear');
      nextLabel = t('nextYear');
    } else {
      labelText = `${yearRangeStart} – ${yearRangeStart + 11}`;
      labelStatic = true;
      onPrev = prevYearRange;
      onNext = nextYearRange;
      prevLabel = t('previousYears');
      nextLabel = t('nextYears');
    }

    return (
      <div className="sp-dp__header">
        <button
          type="button"
          className="sp-dp__nav"
          onClick={onPrev}
          aria-label={prevLabel}
        >
          <Icon name="chevron-left" size={14} />
        </button>

        <button
          type="button"
          className={`sp-dp__header-label${labelStatic ? ' sp-dp__header-label--static' : ''}`}
          onClick={!labelStatic ? headerLabelClick : undefined}
          aria-label={view === 'days' ? t('month') : view === 'months' ? t('year') : undefined}
          tabIndex={labelStatic ? -1 : 0}
        >
          {labelText}
        </button>

        <button
          type="button"
          className="sp-dp__nav"
          onClick={onNext}
          aria-label={nextLabel}
        >
          <Icon name="chevron-right" size={14} />
        </button>
      </div>
    );
  }

  /* ── Render: Panel ───────────────────────────────────────────────────── */

  const panel = open
    ? createPortal(
        <div
          ref={panelRef}
          className={`sp-dp__dropdown${showWeekNumbers ? ' sp-dp__dropdown--with-weeks' : ''}`}
          style={{
            position: 'fixed',
            top: panelPos.top,
            left: panelPos.left,
            zIndex: 999,
            opacity: panelReady ? 1 : 0,
          }}
          role="dialog"
          aria-modal="true"
            aria-label={t('dateInput')}
          onKeyDown={handlePanelKeyDown}
        >
          {renderHeader()}

          {view === 'days' && renderDayView()}
          {view === 'months' && renderMonthView()}
          {view === 'years' && renderYearView()}

          {/* Footer */}
          <div className="sp-dp__footer">
            <button
              type="button"
              className="sp-dp__today-btn"
              onClick={handleToday}
            >
              {t('today')}
            </button>
            <button
              type="button"
              className="sp-dp__clear-btn"
              onClick={handleClear}
            >
              {t('clear')}
            </button>
          </div>
        </div>,
        document.body,
      )
    : null;

  /* ── Render: Root ────────────────────────────────────────────────────── */

  const rootCls = [
    'sp-dp',
    open && 'sp-dp--open',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (inputMode) {
    return (
      <div ref={wrapRef} className={rootCls}>
        <div
          className={[
            'sp-dp__input-wrap',
            sizeClass ? `sp-dp__input-wrap${sizeClass}` : '',
            disabled ? 'sp-dp__input-wrap--disabled' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <input
            ref={inputRef}
            className="sp-dp__input"
            type="text"
            placeholder={resolvedPlaceholder}
            value={inputText}
            disabled={disabled}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            aria-label={t('dateInput')}
          />
          <button
            type="button"
            className="sp-dp__input-toggle"
            onClick={togglePanel}
            disabled={disabled}
            aria-label={open ? t('hideCalendar') : t('showCalendar')}
            aria-expanded={open}
          >
            <Icon name="calendar" size={iconSize} />
          </button>
        </div>
        {panel}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={rootCls}>
      <button
        ref={triggerRef}
        type="button"
        className={[
          'sp-dp__trigger',
          sizeClass ? `sp-dp__trigger${sizeClass}` : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={togglePanel}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Icon name="filter" size={iconSize} />
        <span className="sp-dp__value">
          {value ? formatDate(value) : resolvedPlaceholder}
        </span>
        <Icon name="chevron-down" size={12} />
      </button>
      {panel}
    </div>
  );
}
