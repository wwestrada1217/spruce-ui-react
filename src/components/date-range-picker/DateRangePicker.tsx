/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  computePosition,
  getScrollParents,
  onClickOutside,
} from '../../utils/positioning.js';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import './DateRangePicker.css';

/* ── Types (re-exported from RangeCalendar conventions) ── */

export interface DateRange {
  start: string | null;
  end: string | null;
}

export interface DateRangePreset {
  label: string;
  range: DateRange;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  disabled?: boolean;
  inputMode?: boolean;
  months?: number;
  presets?: DateRangePreset[];
  className?: string;
}

/* ── Constants ── */

type ViewMode = 'days' | 'months' | 'years';

/* ── Helpers ── */

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function parseISO(iso: string): { year: number; month: number; day: number } {
  const [y, m, d] = iso.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

function todayISO(): string {
  const d = new Date();
  return toISO(d.getFullYear(), d.getMonth(), d.getDate());
}

interface DayEntry {
  day: number;
  iso: string;
  empty: boolean;
}

function buildDays(year: number, month: number, firstDay: number): DayEntry[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: DayEntry[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push({ day: 0, iso: '', empty: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, iso: toISO(year, month, d), empty: false });
  }

  return days;
}

function isBetween(iso: string, start: string, end: string): boolean {
  return iso > start && iso < end;
}

function addDays(iso: string, n: number): string {
  const { year, month, day } = parseISO(iso);
  const d = new Date(year, month, day + n);
  return toISO(d.getFullYear(), d.getMonth(), d.getDate());
}

function addMonths(iso: string, n: number): string {
  const { year, month, day } = parseISO(iso);
  const d = new Date(year, month + n, day);
  const maxDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  if (d.getDate() !== day) {
    return toISO(d.getFullYear(), d.getMonth(), Math.min(day, maxDay));
  }
  return toISO(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Format ISO date to MM/DD/YYYY for input fields. */
function isoToInput(iso: string): string {
  const { year, month, day } = parseISO(iso);
  return `${String(month + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
}

/** Parse MM/DD/YYYY input string to ISO, or return null if invalid. */
function inputToISO(text: string): string | null {
  const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const m = parseInt(match[1], 10);
  const d = parseInt(match[2], 10);
  const y = parseInt(match[3], 10);
  if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1) return null;
  // Validate the day is valid for the month
  const maxDay = new Date(y, m, 0).getDate();
  if (d > maxDay) return null;
  return toISO(y, m - 1, d);
}

/* ── Panel Data ── */

interface PanelData {
  index: number;
  month: number;
  year: number;
  days: DayEntry[];
}

/* ── Component ── */

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Select date range',
  disabled = false,
  inputMode = false,
  months: monthCount = 2,
  presets,
  className = '',
}: DateRangePickerProps) {
  const { monthNames, monthLabels, dayLabels, t, formatDate, formatDayLabel, leadingBlankDays } = useI18n();
  const resolvedPlaceholder = placeholder === 'Select date range' ? t('selectRange') : placeholder;
  const today = useMemo(() => todayISO(), []);
  const todayParsed = useMemo(() => parseISO(today), [today]);

  /* ── Open / Position State ── */

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [ready, setReady] = useState(false);

  const anchorRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);

  /* ── Calendar State ── */

  const initialBase = useMemo(() => {
    if (value?.start) {
      const p = parseISO(value.start);
      return { month: p.month, year: p.year };
    }
    return { month: todayParsed.month, year: todayParsed.year };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [baseMonth, setBaseMonth] = useState(initialBase.month);
  const [baseYear, setBaseYear] = useState(initialBase.year);

  // Local range state (applied on Apply click)
  const [rangeStart, setRangeStart] = useState<string | null>(value?.start ?? null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(value?.end ?? null);
  const [picking, setPicking] = useState<'start' | 'end'>('start');

  // View mode for month/year picker
  const [viewMode, setViewMode] = useState<ViewMode>('days');
  const [editingPanel, setEditingPanel] = useState(0);
  const [editYear, setEditYear] = useState(initialBase.year);
  const [yearRangeStart, setYearRangeStart] = useState(initialBase.year - (initialBase.year % 12));

  // Keyboard navigation
  const [focusedDate, setFocusedDate] = useState<string | null>(null);

  // Input mode text state
  const [startInputText, setStartInputText] = useState('');
  const [endInputText, setEndInputText] = useState('');

  /* ── Sync from controlled value ── */

  useEffect(() => {
    if (value) {
      setRangeStart(value.start ?? null);
      setRangeEnd(value.end ?? null);
    }
  }, [value]);

  // Sync input text when value changes
  useEffect(() => {
    if (value?.start) {
      setStartInputText(isoToInput(value.start));
    } else {
      setStartInputText('');
    }
    if (value?.end) {
      setEndInputText(isoToInput(value.end));
    } else {
      setEndInputText('');
    }
  }, [value]);

  /* ── Build panels ── */

  const panels: PanelData[] = useMemo(() => {
    return Array.from({ length: monthCount }, (_, i) => {
      const total = baseYear * 12 + baseMonth + i;
      const month = total % 12;
      const year = Math.floor(total / 12);
      return { index: i, month, year, days: buildDays(year, month, leadingBlankDays(year, month)) };
    });
  }, [baseMonth, baseYear, leadingBlankDays, monthCount]);

  /* ── Positioning ── */

  const reposition = useCallback(() => {
    const anchor = anchorRef.current;
    const dropdown = dropdownRef.current;
    if (!anchor || !dropdown) return;
    const result = computePosition(anchor, dropdown, 'bottom-start', 4);
    setPos({ top: result.top, left: result.left });
    setReady(true);
  }, []);

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
    scrollables.forEach((el) => el.addEventListener('scroll', onScroll, { passive: true }));
    return () => {
      scrollables.forEach((el) => el.removeEventListener('scroll', onScroll));
      cancelAnimationFrame(rafId.current);
    };
  }, [open, reposition]);

  // Click-outside to close
  useEffect(() => {
    if (!open) return;
    const els = [anchorRef.current, dropdownRef.current].filter(Boolean) as HTMLElement[];
    return onClickOutside(els, () => setOpen(false));
  }, [open]);

  /* ── Open / Close ── */

  const openDropdown = useCallback(() => {
    if (disabled) return;
    // Sync local state from controlled value when opening
    setRangeStart(value?.start ?? null);
    setRangeEnd(value?.end ?? null);
    setPicking('start');
    setViewMode('days');
    setFocusedDate(null);

    // Set base month to show the start date, or today
    if (value?.start) {
      const p = parseISO(value.start);
      setBaseMonth(p.month);
      setBaseYear(p.year);
    } else {
      const td = parseISO(today);
      setBaseMonth(td.month);
      setBaseYear(td.year);
    }

    setOpen(true);
  }, [disabled, value, today]);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setViewMode('days');
    setFocusedDate(null);
  }, []);

  const toggleDropdown = useCallback(() => {
    if (open) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }, [open, openDropdown, closeDropdown]);

  /* ── Navigation ── */

  const goToPrevMonth = useCallback(() => {
    setBaseMonth((m) => {
      if (m === 0) {
        setBaseYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setBaseMonth((m) => {
      if (m === 11) {
        setBaseYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  /* ── Day Click ── */

  const handleDayClick = useCallback(
    (iso: string) => {
      if (picking === 'start') {
        setRangeStart(iso);
        setRangeEnd(null);
        setPicking('end');
        setFocusedDate(iso);
      } else {
        if (rangeStart && iso < rangeStart) {
          // Clicked before start: restart
          setRangeStart(iso);
          setRangeEnd(null);
          setPicking('end');
        } else {
          setRangeEnd(iso);
          setPicking('start');
        }
        setFocusedDate(iso);
      }
    },
    [picking, rangeStart],
  );

  /* ── Preset Click ── */

  const handlePresetClick = useCallback(
    (preset: DateRangePreset) => {
      setRangeStart(preset.range.start);
      setRangeEnd(preset.range.end);
      setPicking('start');

      if (preset.range.start) {
        const p = parseISO(preset.range.start);
        setBaseMonth(p.month);
        setBaseYear(p.year);
      }
    },
    [],
  );

  const isPresetActive = useCallback(
    (preset: DateRangePreset) =>
      rangeStart === preset.range.start && rangeEnd === preset.range.end,
    [rangeStart, rangeEnd],
  );

  /* ── Footer Actions ── */

  const handleClear = useCallback(() => {
    setRangeStart(null);
    setRangeEnd(null);
    setPicking('start');
    setFocusedDate(null);
    onChange?.({ start: null, end: null });
    closeDropdown();
  }, [onChange, closeDropdown]);

  const handleApply = useCallback(() => {
    onChange?.({ start: rangeStart, end: rangeEnd });
    closeDropdown();
  }, [onChange, rangeStart, rangeEnd, closeDropdown]);

  /* ── Header Label Click -> Month/Year Picker ── */

  const handleHeaderLabelClick = useCallback(
    (panelIndex: number, panelYear: number) => {
      setEditingPanel(panelIndex);
      setEditYear(panelYear);
      setYearRangeStart(panelYear - (panelYear % 12));
      setViewMode('months');
    },
    [],
  );

  const handleMonthSelect = useCallback(
    (month: number) => {
      const targetTotal = editYear * 12 + month - editingPanel;
      setBaseMonth(targetTotal % 12);
      setBaseYear(Math.floor(targetTotal / 12));
      setViewMode('days');
    },
    [editYear, editingPanel],
  );

  const handleYearSelect = useCallback(
    (year: number) => {
      setEditYear(year);
      setViewMode('months');
    },
    [],
  );

  /* ── Input Mode: Parse on Blur ── */

  const handleStartInputBlur = useCallback(() => {
    const iso = inputToISO(startInputText);
    if (iso) {
      setRangeStart(iso);
      const p = parseISO(iso);
      setBaseMonth(p.month);
      setBaseYear(p.year);
    } else if (startInputText === '') {
      setRangeStart(null);
    }
    // If invalid text, restore from current rangeStart
    if (startInputText !== '' && !iso && rangeStart) {
      setStartInputText(isoToInput(rangeStart));
    }
  }, [startInputText, rangeStart]);

  const handleEndInputBlur = useCallback(() => {
    const iso = inputToISO(endInputText);
    if (iso) {
      setRangeEnd(iso);
    } else if (endInputText === '') {
      setRangeEnd(null);
    }
    if (endInputText !== '' && !iso && rangeEnd) {
      setEndInputText(isoToInput(rangeEnd));
    }
  }, [endInputText, rangeEnd]);

  // Sync input text when local range changes (from clicking calendar days)
  useEffect(() => {
    if (rangeStart) {
      setStartInputText(isoToInput(rangeStart));
    } else {
      setStartInputText('');
    }
  }, [rangeStart]);

  useEffect(() => {
    if (rangeEnd) {
      setEndInputText(isoToInput(rangeEnd));
    } else {
      setEndInputText('');
    }
  }, [rangeEnd]);

  /* ── Keyboard Navigation ── */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (viewMode !== 'days') return;

      const current = focusedDate ?? rangeStart ?? today;
      let next: string | null = null;

      switch (e.key) {
        case 'ArrowLeft':
          next = addDays(current, -1);
          break;
        case 'ArrowRight':
          next = addDays(current, 1);
          break;
        case 'ArrowUp':
          next = addDays(current, -7);
          break;
        case 'ArrowDown':
          next = addDays(current, 7);
          break;
        case 'PageUp':
          next = e.shiftKey ? addMonths(current, -12) : addMonths(current, -1);
          break;
        case 'PageDown':
          next = e.shiftKey ? addMonths(current, 12) : addMonths(current, 1);
          break;
        case 'Home': {
          const parsed = parseISO(current);
          next = toISO(parsed.year, parsed.month, 1);
          break;
        }
        case 'End': {
          const parsed = parseISO(current);
          const lastDay = new Date(parsed.year, parsed.month + 1, 0).getDate();
          next = toISO(parsed.year, parsed.month, lastDay);
          break;
        }
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (current) handleDayClick(current);
          return;
        case 'Escape':
          e.preventDefault();
          closeDropdown();
          return;
        default:
          return;
      }

      if (next) {
        e.preventDefault();
        setFocusedDate(next);

        // Auto-navigate panels if focused date goes out of visible range
        const nextParsed = parseISO(next);
        const firstPanel = panels[0];
        const lastPanel = panels[panels.length - 1];
        const firstTotal = firstPanel.year * 12 + firstPanel.month;
        const lastTotal = lastPanel.year * 12 + lastPanel.month;
        const nextTotal = nextParsed.year * 12 + nextParsed.month;

        if (nextTotal < firstTotal) {
          const diff = firstTotal - nextTotal;
          setBaseMonth((m) => {
            let newTotal = baseYear * 12 + m - diff;
            if (newTotal < 0) newTotal = 0;
            setBaseYear(Math.floor(newTotal / 12));
            return newTotal % 12;
          });
        } else if (nextTotal > lastTotal) {
          const diff = nextTotal - lastTotal;
          setBaseMonth((m) => {
            const newTotal = baseYear * 12 + m + diff;
            setBaseYear(Math.floor(newTotal / 12));
            return newTotal % 12;
          });
        }
      }
    },
    [viewMode, focusedDate, rangeStart, today, panels, baseYear, handleDayClick, closeDropdown],
  );

  /* ── Display Value ── */

  const displayValue = useMemo(() => {
    if (value?.start && value?.end) {
      return `${formatDate(value.start, { month: 'short', day: 'numeric' })} \u2013 ${formatDate(value.end, { month: 'short', day: 'numeric' })}`;
    }
    if (value?.start) {
      return `${formatDate(value.start, { month: 'short', day: 'numeric' })} \u2013 ...`;
    }
    return '';
  }, [formatDate, value]);

  /* ── Root Classes ── */

  const rootClasses = [
    'sp-drp',
    open && 'sp-drp--open',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  /* ── Render: Trigger ── */

  function renderTrigger() {
    if (inputMode) {
      return (
        <div
          ref={anchorRef}
          className={`sp-drp__input-wrap${disabled ? ' sp-drp__input-wrap--disabled' : ''}`}
        >
          <input
            type="text"
            className="sp-drp__input"
            placeholder={t('dateInput')}
            value={startInputText}
            disabled={disabled}
            aria-label={t('startDate')}
            onChange={(e) => setStartInputText(e.target.value)}
            onBlur={handleStartInputBlur}
            onFocus={() => { if (!open) openDropdown(); }}
          />
          <span className="sp-drp__input-sep" aria-hidden="true">&ndash;</span>
          <input
            type="text"
            className="sp-drp__input"
            placeholder={t('dateInput')}
            value={endInputText}
            disabled={disabled}
            aria-label={t('endDate')}
            onChange={(e) => setEndInputText(e.target.value)}
            onBlur={handleEndInputBlur}
            onFocus={() => { if (!open) openDropdown(); }}
          />
          <button
            type="button"
            className="sp-drp__input-toggle"
            aria-label={open ? t('hideCalendar') : t('showCalendar')}
            disabled={disabled}
            onClick={toggleDropdown}
          >
            <Icon name="calendar" size={14} />
          </button>
        </div>
      );
    }

    return (
      <button
        ref={anchorRef as unknown as React.RefObject<HTMLButtonElement>}
        type="button"
        className="sp-drp__trigger"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggleDropdown}
      >
        <Icon name="filter" size={14} />
        <span className={`sp-drp__value${!displayValue ? ' sp-drp__value--placeholder' : ''}`}>
          {displayValue || resolvedPlaceholder}
        </span>
        <Icon name="chevron-down" size={14} />
      </button>
    );
  }

  /* ── Render: Days View Panels ── */

  function renderDaysView() {
    return (
      <div className="sp-drp__panels">
        {panels.map((panel) => (
          <div key={`${panel.year}-${panel.month}`} className="sp-drp__panel">
            {/* Panel header */}
            <div className="sp-drp__header">
              {panel.index === 0 ? (
                <button
                  type="button"
                  className="sp-drp__nav"
                  aria-label={t('previousMonth')}
                  onClick={goToPrevMonth}
                >
                  <Icon name="chevron-left" size={14} />
                </button>
              ) : (
                <span className="sp-drp__nav-spacer" />
              )}
              <button
                type="button"
                className="sp-drp__header-label"
                  aria-label={`${monthNames[panel.month]} ${panel.year}`}
                onClick={() => handleHeaderLabelClick(panel.index, panel.year)}
              >
                {monthNames[panel.month]} {panel.year}
              </button>
              {panel.index === monthCount - 1 ? (
                <button
                  type="button"
                  className="sp-drp__nav"
                  aria-label={t('nextMonth')}
                  onClick={goToNextMonth}
                >
                  <Icon name="chevron-right" size={14} />
                </button>
              ) : (
                <span className="sp-drp__nav-spacer" />
              )}
            </div>

            {/* Weekday headers */}
            <div className="sp-drp__weekdays" role="row">
              {dayLabels.map((label) => (
                <span key={label} className="sp-drp__weekday" role="columnheader" aria-label={label}>
                  {label}
                </span>
              ))}
            </div>

            {/* Day grid */}
            <div className="sp-drp__grid" role="grid" aria-label={`${monthNames[panel.month]} ${panel.year}`}>
              {panel.days.map((day, i) => {
                if (day.empty) {
                  return <span key={`empty-${i}`} className="sp-drp__day sp-drp__day--empty" />;
                }

                const isStart = rangeStart !== null && day.iso === rangeStart;
                const isEnd = rangeEnd !== null && day.iso === rangeEnd;
                const isInRange =
                  rangeStart !== null &&
                  rangeEnd !== null &&
                  isBetween(day.iso, rangeStart, rangeEnd);
                const isToday = day.iso === today;
                const isFocused = day.iso === focusedDate;

                const cls = [
                  'sp-drp__day',
                  isStart && 'sp-drp__day--start',
                  isEnd && 'sp-drp__day--end',
                  isInRange && 'sp-drp__day--in-range',
                  isToday && !isStart && !isEnd && 'sp-drp__day--today',
                  isFocused && 'sp-drp__day--focused',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <button
                    key={day.iso}
                    type="button"
                    className={cls}
                    role="gridcell"
                    aria-label={formatDayLabel(day.day, panel.month, panel.year)}
                    aria-selected={isStart || isEnd || undefined}
                    aria-current={isToday ? 'date' : undefined}
                    tabIndex={isFocused ? 0 : -1}
                    onClick={() => handleDayClick(day.iso)}
                  >
                    {day.day}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ── Render: Months View ── */

  function renderMonthsView() {
    const nowMonth = todayParsed.month;
    const nowYear = todayParsed.year;

    return (
      <div className="sp-drp__picker-view">
        <div className="sp-drp__header">
          <button
            type="button"
            className="sp-drp__nav"
            aria-label={t('previousYear')}
            onClick={() => setEditYear((y) => y - 1)}
          >
            <Icon name="chevron-left" size={14} />
          </button>
          <button
            type="button"
            className="sp-drp__header-label"
            onClick={() => {
              setYearRangeStart(editYear - (editYear % 12));
              setViewMode('years');
            }}
          >
            {editYear}
          </button>
          <button
            type="button"
            className="sp-drp__nav"
            aria-label={t('nextYear')}
            onClick={() => setEditYear((y) => y + 1)}
          >
            <Icon name="chevron-right" size={14} />
          </button>
        </div>
        <div className="sp-drp__cell-grid" role="grid" aria-label={t('month')}>
          {monthLabels.map((label, i) => {
            const isCurrent = i === nowMonth && editYear === nowYear;
            const panelTotal = baseYear * 12 + baseMonth + editingPanel;
            const isSelected = editYear * 12 + i === panelTotal;
            const cls = [
              'sp-drp__cell',
              isCurrent && 'sp-drp__cell--current',
              isSelected && 'sp-drp__cell--selected',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={i}
                type="button"
                className={cls}
                role="gridcell"
                aria-label={monthNames[i]}
                onClick={() => handleMonthSelect(i)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Render: Years View ── */

  function renderYearsView() {
    const nowYear = todayParsed.year;
    const years = Array.from({ length: 12 }, (_, i) => yearRangeStart + i);

    return (
      <div className="sp-drp__picker-view">
        <div className="sp-drp__header">
          <button
            type="button"
            className="sp-drp__nav"
            aria-label={t('previousYears')}
            onClick={() => setYearRangeStart((s) => s - 12)}
          >
            <Icon name="chevron-left" size={14} />
          </button>
          <span className="sp-drp__header-label sp-drp__header-label--static">
            {yearRangeStart} &ndash; {yearRangeStart + 11}
          </span>
          <button
            type="button"
            className="sp-drp__nav"
            aria-label={t('nextYears')}
            onClick={() => setYearRangeStart((s) => s + 12)}
          >
            <Icon name="chevron-right" size={14} />
          </button>
        </div>
        <div className="sp-drp__cell-grid" role="grid" aria-label={t('year')}>
          {years.map((yr) => {
            const isCurrent = yr === nowYear;
            const isSelected = yr === editYear;
            const cls = [
              'sp-drp__cell',
              isCurrent && 'sp-drp__cell--current',
              isSelected && 'sp-drp__cell--selected',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={yr}
                type="button"
                className={cls}
                role="gridcell"
                aria-label={String(yr)}
                onClick={() => handleYearSelect(yr)}
              >
                {yr}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Render: Presets Sidebar ── */

  function renderPresets() {
    if (!presets || presets.length === 0) return null;

    return (
      <div className="sp-drp__presets" role="listbox" aria-label={t('dateRangePresets')}>
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            role="option"
            aria-selected={isPresetActive(preset)}
            className={`sp-drp__preset${isPresetActive(preset) ? ' sp-drp__preset--active' : ''}`}
            onClick={() => handlePresetClick(preset)}
          >
            {preset.label}
          </button>
        ))}
      </div>
    );
  }

  /* ── Render: Footer ── */

  function renderFooter() {
    return (
      <div className="sp-drp__footer">
        <button type="button" className="sp-drp__action" onClick={handleClear}>
          {t('clear')}
        </button>
        <button
          type="button"
          className="sp-drp__action sp-drp__action--primary"
          onClick={handleApply}
        >
          {t('apply')}
        </button>
      </div>
    );
  }

  /* ── Render: Dropdown Content ── */

  function renderDropdownContent() {
    return (
      <div className="sp-drp__body">
        {renderPresets()}
        <div className="sp-drp__content">
          {viewMode === 'days' && renderDaysView()}
          {viewMode === 'months' && renderMonthsView()}
          {viewMode === 'years' && renderYearsView()}
        </div>
      </div>
    );
  }

  /* ── Main Render ── */

  return (
    <div className={rootClasses}>
      {renderTrigger()}

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="sp-drp__dropdown"
            role="dialog"
            aria-label={t('dateRangeCalendar')}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              zIndex: 999,
              opacity: ready ? 1 : 0,
            }}
          >
            {renderDropdownContent()}
            {renderFooter()}
          </div>,
          document.body,
        )}
    </div>
  );
}
