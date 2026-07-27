/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import { computePosition, getScrollParents, onClickOutside } from '../../utils/positioning.js';
import './DateTimePicker.css';

export type DateTimePickerSize = 'sm' | 'md' | 'lg';

export interface DateTimePickerProps {
  /** Current value as an ISO datetime string (e.g. "2025-01-15T14:30" or "2025-01-15T14:30:00"). */
  value?: string | null;
  /** Called when the value changes. Receives `null` on clear. */
  onChange?: (value: string | null) => void;
  /** Placeholder text shown when no value is set. */
  placeholder?: string;
  /** Visual size of the trigger. */
  size?: DateTimePickerSize;
  /** Use 24-hour format instead of 12-hour with AM/PM. */
  use24Hour?: boolean;
  /** Show a seconds spinner in the time section. */
  showSeconds?: boolean;
  /** Render as a text input instead of a button trigger. */
  inputMode?: boolean;
  /** Disable all interaction. */
  disabled?: boolean;
  /** Additional CSS class applied to the root wrapper. */
  className?: string;
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const WEEKDAY_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function formatTime(
  hour: number,
  minute: number,
  second: number,
  use24: boolean,
  showSec: boolean,
): string {
  if (use24) {
    return showSec
      ? `${pad(hour)}:${pad(minute)}:${pad(second)}`
      : `${pad(hour)}:${pad(minute)}`;
  }
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return showSec
    ? `${pad(h12)}:${pad(minute)}:${pad(second)} ${ampm}`
    : `${pad(h12)}:${pad(minute)} ${ampm}`;
}

function formatDisplay(
  date: { year: number; month: number; day: number } | null,
  hour: number,
  minute: number,
  second: number,
  use24: boolean,
  showSec: boolean,
): string {
  if (!date) return '';
  const timePart = formatTime(hour, minute, second, use24, showSec);
  return `${MONTH_SHORT[date.month]} ${pad(date.day)}, ${date.year} ${timePart}`;
}

function buildISOValue(
  date: { year: number; month: number; day: number },
  hour: number,
  minute: number,
  second: number,
  showSec: boolean,
): string {
  const datePart = `${date.year}-${pad(date.month + 1)}-${pad(date.day)}`;
  const timePart = showSec
    ? `${pad(hour)}:${pad(minute)}:${pad(second)}`
    : `${pad(hour)}:${pad(minute)}`;
  return `${datePart}T${timePart}`;
}

interface ParsedDateTime {
  date: { year: number; month: number; day: number };
  hour: number;
  minute: number;
  second: number;
}

function parseISO(raw: string | null | undefined): ParsedDateTime | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  const tIndex = trimmed.indexOf('T');
  if (tIndex === -1) return null;

  const datePart = trimmed.substring(0, tIndex);
  const timePart = trimmed.substring(tIndex + 1);

  const dateMatch = datePart.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!dateMatch) return null;

  const year = parseInt(dateMatch[1], 10);
  const month = parseInt(dateMatch[2], 10) - 1; // 0-indexed
  const day = parseInt(dateMatch[3], 10);

  if (month < 0 || month > 11 || day < 1 || day > 31) return null;

  const timeMatch = timePart.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
  if (!timeMatch) return null;

  const hour = parseInt(timeMatch[1], 10);
  const minute = parseInt(timeMatch[2], 10);
  const second = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
    return null;
  }

  return { date: { year, month, day }, hour, minute, second };
}

function parseInputString(
  raw: string,
): ParsedDateTime | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  // Match "MM/DD/YYYY HH:MM(:SS)( AM/PM)"
  const match = trimmed.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(AM|PM)?$/i,
  );
  if (!match) return null;

  const month = parseInt(match[1], 10) - 1;
  const day = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  let hour = parseInt(match[4], 10);
  const minute = parseInt(match[5], 10);
  const second = match[6] ? parseInt(match[6], 10) : 0;
  const period = match[7]?.toUpperCase();

  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  if (
    month < 0 || month > 11 ||
    day < 1 || day > 31 ||
    hour < 0 || hour > 23 ||
    minute < 0 || minute > 59 ||
    second < 0 || second > 59
  ) {
    return null;
  }

  return { date: { year, month, day }, hour, minute, second };
}

function wrap(value: number, delta: number, min: number, max: number): number {
  const range = max - min + 1;
  return ((value - min + delta) % range + range) % range + min;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/* ── Component ────────────────────────────────────────────────────────────── */

/**
 * A combined date and time picker dropdown.
 *
 * Opens a floating panel containing a calendar grid on top and
 * time spinners below, separated by a divider. Supports button
 * trigger (default) and input mode, 12h/24h formats, and an
 * optional seconds column.
 *
 * @example
 * ```tsx
 * <DateTimePicker value="2025-01-15T14:30" onChange={setValue} />
 * <DateTimePicker use24Hour showSeconds inputMode />
 * ```
 */
export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Select date & time',
  size = 'md',
  use24Hour = false,
  showSeconds = false,
  inputMode = false,
  disabled = false,
  className,
}: DateTimePickerProps) {
  /* ── State ─────────────────────────────────────────────────────────────── */

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [panelReady, setPanelReady] = useState(false);
  const rafId = useRef(0);

  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
  const [yearRangeStart, setYearRangeStart] = useState(() => {
    const y = new Date().getFullYear();
    return y - (y % 12);
  });

  const [selectedDate, setSelectedDate] = useState<{
    year: number;
    month: number;
    day: number;
  } | null>(null);
  const [hour24, setHour24] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* ── Sync from value prop ──────────────────────────────────────────────── */

  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    const parsed = parseISO(value);
    if (parsed) {
      setSelectedDate(parsed.date);
      setHour24(parsed.hour);
      setMinute(parsed.minute);
      setSecond(parsed.second);
      setViewMonth(parsed.date.month);
      setViewYear(parsed.date.year);
    }
  }

  /* ── Display value ─────────────────────────────────────────────────────── */

  const displayValue = selectedDate
    ? formatDisplay(selectedDate, hour24, minute, second, use24Hour, showSeconds)
    : '';

  /* ── Positioning ───────────────────────────────────────────────────────── */

  const reposition = useCallback(() => {
    const anchor = wrapRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;
    const result = computePosition(anchor, panel, 'bottom-start', 4);
    setPos({ top: result.top, left: result.left });
    setPanelReady(true);
  }, []);

  // Position after open, and re-measure when the sub-view changes panel height
  useEffect(() => {
    if (!open) return;
    rafId.current = requestAnimationFrame(reposition);
    return () => cancelAnimationFrame(rafId.current);
  }, [open, viewMode, viewMonth, viewYear, reposition]);

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

  /* ── Apply / Close ─────────────────────────────────────────────────────── */

  const applyAndClose = useCallback(() => {
    if (selectedDate) {
      const iso = buildISOValue(selectedDate, hour24, minute, second, showSeconds);
      onChange?.(iso);
    }
    setOpen(false);
  }, [selectedDate, hour24, minute, second, showSeconds, onChange]);

  const handleClear = useCallback(() => {
    setSelectedDate(null);
    setHour24(0);
    setMinute(0);
    setSecond(0);
    onChange?.(null);
    setOpen(false);
  }, [onChange]);

  /* ── Click outside ─────────────────────────────────────────────────────── */

  useEffect(() => {
    if (!open) return;
    const els = [wrapRef.current, panelRef.current].filter(Boolean) as HTMLElement[];
    return onClickOutside(els, applyAndClose);
  }, [open, applyAndClose]);

  /* ── Keyboard ──────────────────────────────────────────────────────────── */

  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
      } else if (e.key === 'Enter') {
        applyAndClose();
      }
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, applyAndClose]);

  /* ── Toggle ────────────────────────────────────────────────────────────── */

  function toggleOpen() {
    if (disabled) return;
    if (!open) {
      const parsed = parseISO(value);
      if (parsed) {
        setSelectedDate(parsed.date);
        setHour24(parsed.hour);
        setMinute(parsed.minute);
        setSecond(parsed.second);
        setViewMonth(parsed.date.month);
        setViewYear(parsed.date.year);
      }
      setViewMode('days');
    }
    setPanelReady(false);
    setOpen((v) => !v);
  }

  /* ── Input mode typing ─────────────────────────────────────────────────── */

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const parsed = parseInputString(raw);
    if (parsed) {
      setSelectedDate(parsed.date);
      setHour24(parsed.hour);
      setMinute(parsed.minute);
      setSecond(parsed.second);
      setViewMonth(parsed.date.month);
      setViewYear(parsed.date.year);
      onChange?.(buildISOValue(parsed.date, parsed.hour, parsed.minute, parsed.second, showSeconds));
    } else {
      onChange?.(raw || null);
    }
  }

  /* ── Hold-to-repeat helper ─────────────────────────────────────────────── */

  const repeatTimer = useRef<number | null>(null);
  const repeatInterval = useRef<number | null>(null);

  function startRepeat(action: () => void, e: React.MouseEvent) {
    e.preventDefault();
    stopRepeat();
    action();
    repeatTimer.current = window.setTimeout(() => {
      repeatInterval.current = window.setInterval(action, 80);
    }, 400);
  }

  function stopRepeat() {
    if (repeatTimer.current !== null) {
      clearTimeout(repeatTimer.current);
      repeatTimer.current = null;
    }
    if (repeatInterval.current !== null) {
      clearInterval(repeatInterval.current);
      repeatInterval.current = null;
    }
  }

  useEffect(() => {
    return () => stopRepeat();
  }, []);

  /* ── Time step handlers ────────────────────────────────────────────────── */

  const incHour = useCallback(() => setHour24((h) => wrap(h, 1, 0, 23)), []);
  const decHour = useCallback(() => setHour24((h) => wrap(h, -1, 0, 23)), []);
  const incMinute = useCallback(() => setMinute((m) => wrap(m, 1, 0, 59)), []);
  const decMinute = useCallback(() => setMinute((m) => wrap(m, -1, 0, 59)), []);
  const incSecond = useCallback(() => setSecond((s) => wrap(s, 1, 0, 59)), []);
  const decSecond = useCallback(() => setSecond((s) => wrap(s, -1, 0, 59)), []);

  /* ── Display helpers ───────────────────────────────────────────────────── */

  const displayHour = use24Hour ? pad(hour24) : pad(hour24 % 12 === 0 ? 12 : hour24 % 12);
  const isAM = hour24 < 12;

  function setAM() {
    if (!isAM) setHour24((h) => h - 12);
  }
  function setPM() {
    if (isAM) setHour24((h) => h + 12);
  }

  /* ── Calendar navigation ───────────────────────────────────────────────── */

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function prevYearRange() {
    setYearRangeStart((s) => s - 12);
  }

  function nextYearRange() {
    setYearRangeStart((s) => s + 12);
  }

  function selectDay(day: number) {
    setSelectedDate({ year: viewYear, month: viewMonth, day });
  }

  function selectMonth(month: number) {
    setViewMonth(month);
    setViewMode('days');
  }

  function selectYear(year: number) {
    setViewYear(year);
    setViewMode('months');
  }

  function headerLabelClick() {
    if (viewMode === 'days') {
      setViewMode('months');
    } else if (viewMode === 'months') {
      setYearRangeStart(viewYear - (viewYear % 12));
      setViewMode('years');
    }
  }

  /* ── Calendar grid data ────────────────────────────────────────────────── */

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  /* ── Size classes ──────────────────────────────────────────────────────── */

  const sizeClass = size === 'sm' ? '--sm' : size === 'lg' ? '--lg' : '';
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;

  /* ── Input mode placeholder ────────────────────────────────────────────── */

  const inputPlaceholder = (() => {
    if (placeholder !== 'Select date & time') return placeholder;
    if (use24Hour) {
      return showSeconds ? 'MM/DD/YYYY HH:MM:SS' : 'MM/DD/YYYY HH:MM';
    }
    return showSeconds ? 'MM/DD/YYYY hh:MM:SS AM' : 'MM/DD/YYYY hh:MM AM';
  })();

  /* ── Render calendar section ───────────────────────────────────────────── */

  function renderCalendar() {
    if (viewMode === 'days') {
      const emptySlots: null[] = Array.from({ length: firstDay }, () => null);
      const daySlots: number[] = Array.from({ length: daysInMonth }, (_, i) => i + 1);

      return (
        <>
          <div className="sp-dtp__cal-header">
            <button
              type="button"
              className="sp-dtp__nav"
              onClick={prevMonth}
              aria-label="Previous month"
            >
              <Icon name="chevron-left" size={14} />
            </button>
            <button
              type="button"
              className="sp-dtp__header-label"
              onClick={headerLabelClick}
            >
              {MONTH_NAMES[viewMonth]} {viewYear}
            </button>
            <button
              type="button"
              className="sp-dtp__nav"
              onClick={nextMonth}
              aria-label="Next month"
            >
              <Icon name="chevron-right" size={14} />
            </button>
          </div>
          <div className="sp-dtp__weekdays">
            {WEEKDAY_SHORT.map((wd) => (
              <div key={wd} className="sp-dtp__weekday">{wd}</div>
            ))}
          </div>
          <div className="sp-dtp__grid" role="grid" aria-label="Calendar">
            {emptySlots.map((_, i) => (
              <div key={`e${i}`} className="sp-dtp__day sp-dtp__day--empty" />
            ))}
            {daySlots.map((d) => {
              const isToday =
                viewYear === todayYear && viewMonth === todayMonth && d === todayDay;
              const isSelected =
                selectedDate !== null &&
                selectedDate.year === viewYear &&
                selectedDate.month === viewMonth &&
                selectedDate.day === d;
              const cls = [
                'sp-dtp__day',
                isToday && !isSelected ? 'sp-dtp__day--today' : '',
                isSelected ? 'sp-dtp__day--selected' : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <button
                  key={d}
                  type="button"
                  className={cls}
                  onClick={() => selectDay(d)}
                  aria-label={`${MONTH_NAMES[viewMonth]} ${d}, ${viewYear}`}
                  aria-pressed={isSelected}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </>
      );
    }

    if (viewMode === 'months') {
      return (
        <>
          <div className="sp-dtp__cell-header">
            <button
              type="button"
              className="sp-dtp__nav"
              onClick={() => setViewYear((y) => y - 1)}
              aria-label="Previous year"
            >
              <Icon name="chevron-left" size={14} />
            </button>
            <button
              type="button"
              className="sp-dtp__header-label"
              onClick={headerLabelClick}
            >
              {viewYear}
            </button>
            <button
              type="button"
              className="sp-dtp__nav"
              onClick={() => setViewYear((y) => y + 1)}
              aria-label="Next year"
            >
              <Icon name="chevron-right" size={14} />
            </button>
          </div>
          <div className="sp-dtp__cell-grid">
            {MONTH_SHORT.map((name, i) => {
              const isCurrent = viewYear === todayYear && i === todayMonth;
              const isSelected =
                selectedDate !== null &&
                selectedDate.year === viewYear &&
                selectedDate.month === i;
              const cls = [
                'sp-dtp__cell',
                isCurrent && !isSelected ? 'sp-dtp__cell--current' : '',
                isSelected ? 'sp-dtp__cell--selected' : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <button
                  key={name}
                  type="button"
                  className={cls}
                  onClick={() => selectMonth(i)}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </>
      );
    }

    // viewMode === 'years'
    const years = Array.from({ length: 12 }, (_, i) => yearRangeStart + i);
    return (
      <>
        <div className="sp-dtp__cell-header">
          <button
            type="button"
            className="sp-dtp__nav"
            onClick={prevYearRange}
            aria-label="Previous year range"
          >
            <Icon name="chevron-left" size={14} />
          </button>
          <span className="sp-dtp__header-label" style={{ cursor: 'default' }}>
            {yearRangeStart} &ndash; {yearRangeStart + 11}
          </span>
          <button
            type="button"
            className="sp-dtp__nav"
            onClick={nextYearRange}
            aria-label="Next year range"
          >
            <Icon name="chevron-right" size={14} />
          </button>
        </div>
        <div className="sp-dtp__cell-grid">
          {years.map((y) => {
            const isCurrent = y === todayYear;
            const isSelected = selectedDate !== null && selectedDate.year === y;
            const cls = [
              'sp-dtp__cell',
              isCurrent && !isSelected ? 'sp-dtp__cell--current' : '',
              isSelected ? 'sp-dtp__cell--selected' : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <button key={y} type="button" className={cls} onClick={() => selectYear(y)}>
                {y}
              </button>
            );
          })}
        </div>
      </>
    );
  }

  /* ── Render time section ───────────────────────────────────────────────── */

  function renderTimeSpinners() {
    return (
      <div className="sp-dtp__time">
        <div className="sp-dtp__time-label">Time</div>
        <div className="sp-dtp__columns">
          {/* Hour */}
          <div className="sp-tp__col">
            <button
              type="button"
              className="sp-tp__step"
              aria-label="Increase hour"
              onMouseDown={(e) => startRepeat(incHour, e)}
              onMouseUp={stopRepeat}
              onMouseLeave={stopRepeat}
            >
              <Icon name="chevron-up" size={14} />
            </button>
            <div className="sp-tp__digit" aria-label={`Hour: ${displayHour}`}>
              {displayHour}
            </div>
            <button
              type="button"
              className="sp-tp__step"
              aria-label="Decrease hour"
              onMouseDown={(e) => startRepeat(decHour, e)}
              onMouseUp={stopRepeat}
              onMouseLeave={stopRepeat}
            >
              <Icon name="chevron-down" size={14} />
            </button>
          </div>

          <div className="sp-tp__sep" aria-hidden="true">:</div>

          {/* Minute */}
          <div className="sp-tp__col">
            <button
              type="button"
              className="sp-tp__step"
              aria-label="Increase minute"
              onMouseDown={(e) => startRepeat(incMinute, e)}
              onMouseUp={stopRepeat}
              onMouseLeave={stopRepeat}
            >
              <Icon name="chevron-up" size={14} />
            </button>
            <div className="sp-tp__digit" aria-label={`Minute: ${pad(minute)}`}>
              {pad(minute)}
            </div>
            <button
              type="button"
              className="sp-tp__step"
              aria-label="Decrease minute"
              onMouseDown={(e) => startRepeat(decMinute, e)}
              onMouseUp={stopRepeat}
              onMouseLeave={stopRepeat}
            >
              <Icon name="chevron-down" size={14} />
            </button>
          </div>

          {/* Second */}
          {showSeconds && (
            <>
              <div className="sp-tp__sep" aria-hidden="true">:</div>
              <div className="sp-tp__col">
                <button
                  type="button"
                  className="sp-tp__step"
                  aria-label="Increase second"
                  onMouseDown={(e) => startRepeat(incSecond, e)}
                  onMouseUp={stopRepeat}
                  onMouseLeave={stopRepeat}
                >
                  <Icon name="chevron-up" size={14} />
                </button>
                <div className="sp-tp__digit" aria-label={`Second: ${pad(second)}`}>
                  {pad(second)}
                </div>
                <button
                  type="button"
                  className="sp-tp__step"
                  aria-label="Decrease second"
                  onMouseDown={(e) => startRepeat(decSecond, e)}
                  onMouseUp={stopRepeat}
                  onMouseLeave={stopRepeat}
                >
                  <Icon name="chevron-down" size={14} />
                </button>
              </div>
            </>
          )}

          {/* AM/PM */}
          {!use24Hour && (
            <div className="sp-tp__period">
              <button
                type="button"
                className={`sp-tp__period-btn${isAM ? ' sp-tp__period-btn--active' : ''}`}
                onClick={setAM}
                aria-pressed={isAM}
              >
                AM
              </button>
              <button
                type="button"
                className={`sp-tp__period-btn${!isAM ? ' sp-tp__period-btn--active' : ''}`}
                onClick={setPM}
                aria-pressed={!isAM}
              >
                PM
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Panel ─────────────────────────────────────────────────────────────── */

  const panel = open
    ? createPortal(
        <div
          ref={panelRef}
          className="sp-dtp__panel"
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            zIndex: 999,
            opacity: panelReady ? 1 : 0,
          }}
          role="dialog"
          aria-label="Date and time picker"
        >
          {/* Calendar */}
          {renderCalendar()}

          {/* Divider */}
          <div className="sp-dtp__divider" />

          {/* Time spinners */}
          {renderTimeSpinners()}

          {/* Footer */}
          <div className="sp-dtp__footer">
            <button
              type="button"
              className="sp-dtp__clear-btn"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              type="button"
              className="sp-dtp__apply-btn"
              onClick={applyAndClose}
            >
              Apply
            </button>
          </div>
        </div>,
        document.body,
      )
    : null;

  /* ── Root class ────────────────────────────────────────────────────────── */

  const rootCls = [
    'sp-dtp',
    open ? 'sp-dtp--open' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  /* ── Input mode render ─────────────────────────────────────────────────── */

  if (inputMode) {
    return (
      <div ref={wrapRef} className={rootCls}>
        <div
          className={[
            'sp-dtp__input-wrap',
            sizeClass ? `sp-dtp__input-wrap${sizeClass}` : '',
            disabled ? 'sp-dtp__input-wrap--disabled' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Icon
            name="calendar"
            size={iconSize}
            className="sp-dtp__input-icon"
          />
          <input
            className="sp-dtp__input"
            type="text"
            placeholder={inputPlaceholder}
            value={displayValue}
            disabled={disabled}
            onChange={handleInputChange}
            aria-label="Date and time"
          />
          <button
            type="button"
            className="sp-dtp__input-toggle"
            onClick={toggleOpen}
            disabled={disabled}
            aria-label="Toggle date time picker"
            aria-expanded={open}
          >
            <Icon name="chevron-down" size={12} />
          </button>
        </div>
        {panel}
      </div>
    );
  }

  /* ── Button trigger render ─────────────────────────────────────────────── */

  return (
    <div ref={wrapRef} className={rootCls}>
      <button
        type="button"
        className={[
          'sp-dtp__trigger',
          sizeClass ? `sp-dtp__trigger${sizeClass}` : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={toggleOpen}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Icon name="calendar" size={iconSize} />
        <span className="sp-dtp__value">
          {displayValue || placeholder}
        </span>
        <Icon name="chevron-down" size={12} />
      </button>
      {panel}
    </div>
  );
}
