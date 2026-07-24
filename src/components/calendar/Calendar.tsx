/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Fragment, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import './Calendar.css';
import { Icon } from '../../icons/Icon.js';

/* ── Types ── */

export type DateFilter = (date: string) => boolean;

export interface CalendarProps {
  value?: string | null;
  onChange?: (date: string | null) => void;
  disabled?: boolean;
  minDate?: string | null;
  maxDate?: string | null;
  disabledDates?: string[];
  dateFilter?: DateFilter | null;
  showWeekNumbers?: boolean;
  weekNumberBackground?: boolean;
  showFooter?: boolean;
  className?: string;
}

/* ── Constants ── */

type ViewMode = 'days' | 'months' | 'years';

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const MONTH_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/* ── Helpers ── */

/** Format a Date to ISO "YYYY-MM-DD" in local time. */
function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Parse "YYYY-MM-DD" into a local Date (ignoring timezone). */
function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** ISO week number. */
function getIsoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** Get the number of days in a given month (0-indexed). */
function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Get today as ISO string. */
function todayIso(): string {
  return toIso(new Date());
}

/* ── Component ── */

export function Calendar({
  value,
  onChange,
  disabled = false,
  minDate,
  maxDate,
  disabledDates,
  dateFilter,
  showWeekNumbers = false,
  weekNumberBackground = false,
  showFooter = true,
  className,
}: CalendarProps) {
  /* ── State ── */

  const today = useMemo(() => todayIso(), []);
  const todayDate = useMemo(() => parseIso(today), [today]);

  // The month being viewed (year, month)
  const [viewYear, setViewYear] = useState(() => {
    if (value) {
      const d = parseIso(value);
      return d.getFullYear();
    }
    return todayDate.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    if (value) {
      const d = parseIso(value);
      return d.getMonth();
    }
    return todayDate.getMonth();
  });

  const [viewMode, setViewMode] = useState<ViewMode>('days');

  // Focused day (1-based) for keyboard navigation in days view
  const [focusedDay, setFocusedDay] = useState<number | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  /* ── Disabled-date lookup ── */

  const disabledSet = useMemo(
    () => new Set(disabledDates ?? []),
    [disabledDates],
  );

  const minParsed = useMemo(() => (minDate ? parseIso(minDate) : null), [minDate]);
  const maxParsed = useMemo(() => (maxDate ? parseIso(maxDate) : null), [maxDate]);

  const isDayDisabled = useCallback(
    (iso: string): boolean => {
      if (disabledSet.has(iso)) return true;
      if (dateFilter && !dateFilter(iso)) return true;
      const d = parseIso(iso);
      if (minParsed && d < minParsed) return true;
      if (maxParsed && d > maxParsed) return true;
      return false;
    },
    [disabledSet, dateFilter, minParsed, maxParsed],
  );

  /* ── Calendar grid data ── */

  const calendarRows = useMemo(() => {
    const totalDays = daysInMonth(viewYear, viewMonth);
    const firstDow = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun

    const rows: { weekNumber: number; days: (number | null)[] }[] = [];
    let currentDay = 1;

    // Build week rows
    while (currentDay <= totalDays) {
      const week: (number | null)[] = [];
      if (currentDay === 1) {
        // First row: add empty slots before the 1st
        for (let i = 0; i < firstDow; i++) week.push(null);
      }

      while (week.length < 7 && currentDay <= totalDays) {
        week.push(currentDay);
        currentDay++;
      }

      // Pad the end of the last row
      while (week.length < 7) week.push(null);

      // Compute week number from the first real day in this row
      const firstRealDay = week.find((d) => d !== null)!;
      const wn = getIsoWeekNumber(new Date(viewYear, viewMonth, firstRealDay));

      rows.push({ weekNumber: wn, days: week });
    }

    return rows;
  }, [viewYear, viewMonth]);

  /* ── Navigation helpers ── */

  const goToPrevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
    setFocusedDay(null);
  }, []);

  const goToNextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
    setFocusedDay(null);
  }, []);

  const goToPrevYear = useCallback(() => {
    setViewYear((y) => y - 1);
  }, []);

  const goToNextYear = useCallback(() => {
    setViewYear((y) => y + 1);
  }, []);

  // Years view: base year of the current 12-year range
  const yearsRangeStart = useMemo(() => {
    return viewYear - (viewYear % 12);
  }, [viewYear]);

  const goToPrevYearRange = useCallback(() => {
    setViewYear((y) => y - 12);
  }, []);

  const goToNextYearRange = useCallback(() => {
    setViewYear((y) => y + 12);
  }, []);

  /* ── Selection ── */

  const selectDay = useCallback(
    (day: number) => {
      const iso = toIso(new Date(viewYear, viewMonth, day));
      if (isDayDisabled(iso)) return;
      onChange?.(iso);
    },
    [viewYear, viewMonth, isDayDisabled, onChange],
  );

  const selectMonth = useCallback(
    (month: number) => {
      setViewMonth(month);
      setViewMode('days');
      setFocusedDay(null);
    },
    [],
  );

  const selectYear = useCallback(
    (year: number) => {
      setViewYear(year);
      setViewMode('months');
    },
    [],
  );

  const handleTodayClick = useCallback(() => {
    const td = todayIso();
    const d = parseIso(td);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setViewMode('days');
    if (!isDayDisabled(td)) {
      onChange?.(td);
    }
  }, [isDayDisabled, onChange]);

  const handleClearClick = useCallback(() => {
    onChange?.(null);
  }, [onChange]);

  /* ── Keyboard Navigation ── */

  const handleDaysKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const totalDays = daysInMonth(viewYear, viewMonth);
      let day = focusedDay ?? (value ? parseIso(value).getDate() : 1);

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          day -= 1;
          if (day < 1) {
            goToPrevMonth();
            const prevTotal = daysInMonth(
              viewMonth === 0 ? viewYear - 1 : viewYear,
              viewMonth === 0 ? 11 : viewMonth - 1,
            );
            setFocusedDay(prevTotal);
            return;
          }
          setFocusedDay(day);
          break;

        case 'ArrowRight':
          e.preventDefault();
          day += 1;
          if (day > totalDays) {
            goToNextMonth();
            setFocusedDay(1);
            return;
          }
          setFocusedDay(day);
          break;

        case 'ArrowUp':
          e.preventDefault();
          day -= 7;
          if (day < 1) {
            goToPrevMonth();
            const prevTotal = daysInMonth(
              viewMonth === 0 ? viewYear - 1 : viewYear,
              viewMonth === 0 ? 11 : viewMonth - 1,
            );
            setFocusedDay(prevTotal + day); // day is negative offset
            return;
          }
          setFocusedDay(day);
          break;

        case 'ArrowDown':
          e.preventDefault();
          day += 7;
          if (day > totalDays) {
            goToNextMonth();
            setFocusedDay(day - totalDays);
            return;
          }
          setFocusedDay(day);
          break;

        case 'PageUp':
          e.preventDefault();
          if (e.shiftKey) {
            setViewYear((y) => y - 1);
          } else {
            goToPrevMonth();
          }
          setFocusedDay(Math.min(day, daysInMonth(
            e.shiftKey ? viewYear - 1 : (viewMonth === 0 ? viewYear - 1 : viewYear),
            e.shiftKey ? viewMonth : (viewMonth === 0 ? 11 : viewMonth - 1),
          )));
          break;

        case 'PageDown':
          e.preventDefault();
          if (e.shiftKey) {
            setViewYear((y) => y + 1);
          } else {
            goToNextMonth();
          }
          setFocusedDay(Math.min(day, daysInMonth(
            e.shiftKey ? viewYear + 1 : (viewMonth === 11 ? viewYear + 1 : viewYear),
            e.shiftKey ? viewMonth : (viewMonth === 11 ? 0 : viewMonth + 1),
          )));
          break;

        case 'Home':
          e.preventDefault();
          setFocusedDay(1);
          break;

        case 'End':
          e.preventDefault();
          setFocusedDay(totalDays);
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedDay) selectDay(focusedDay);
          break;

        case 'Escape':
          e.preventDefault();
          setFocusedDay(null);
          (e.currentTarget as HTMLElement).blur();
          break;

        default:
          break;
      }
    },
    [focusedDay, value, viewYear, viewMonth, goToPrevMonth, goToNextMonth, selectDay],
  );

  /* ── Focus management: scroll focused button into view ── */

  useEffect(() => {
    if (focusedDay !== null && gridRef.current) {
      const btn = gridRef.current.querySelector<HTMLButtonElement>(
        `[data-day="${focusedDay}"]`,
      );
      btn?.focus();
    }
  }, [focusedDay, viewYear, viewMonth]);

  /* ── Check if month/year cells should be marked as disabled ── */

  const isMonthDisabled = useCallback(
    (month: number): boolean => {
      if (minParsed) {
        const lastDayOfMonth = new Date(viewYear, month + 1, 0);
        if (lastDayOfMonth < minParsed) return true;
      }
      if (maxParsed) {
        const firstDayOfMonth = new Date(viewYear, month, 1);
        if (firstDayOfMonth > maxParsed) return true;
      }
      return false;
    },
    [viewYear, minParsed, maxParsed],
  );

  const isYearDisabled = useCallback(
    (year: number): boolean => {
      if (minParsed && year < minParsed.getFullYear()) {
        // Only disabled if the entire year is before minDate
        const lastDayOfYear = new Date(year, 11, 31);
        if (lastDayOfYear < minParsed) return true;
      }
      if (maxParsed && year > maxParsed.getFullYear()) {
        const firstDayOfYear = new Date(year, 0, 1);
        if (firstDayOfYear > maxParsed) return true;
      }
      return false;
    },
    [minParsed, maxParsed],
  );

  /* ── CSS classes ── */

  const rootClasses = [
    'sp-cal',
    showWeekNumbers && 'sp-cal--with-weeks',
    disabled && 'sp-cal--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  /* ── Render: Header ── */

  function renderHeader() {
    if (viewMode === 'days') {
      return (
        <div className="sp-cal__header">
          <button
            type="button"
            className="sp-cal__nav"
            aria-label="Previous month"
            onClick={goToPrevMonth}
          >
            <Icon name="chevron-left" size={14} />
          </button>
          <button
            type="button"
            className="sp-cal__header-label"
            aria-label="Switch to months view"
            onClick={() => setViewMode('months')}
          >
            {MONTH_NAMES[viewMonth]} {viewYear}
          </button>
          <button
            type="button"
            className="sp-cal__nav"
            aria-label="Next month"
            onClick={goToNextMonth}
          >
            <Icon name="chevron-right" size={14} />
          </button>
        </div>
      );
    }

    if (viewMode === 'months') {
      return (
        <div className="sp-cal__header">
          <button
            type="button"
            className="sp-cal__nav"
            aria-label="Previous year"
            onClick={goToPrevYear}
          >
            <Icon name="chevron-left" size={14} />
          </button>
          <button
            type="button"
            className="sp-cal__header-label"
            aria-label="Switch to years view"
            onClick={() => setViewMode('years')}
          >
            {viewYear}
          </button>
          <button
            type="button"
            className="sp-cal__nav"
            aria-label="Next year"
            onClick={goToNextYear}
          >
            <Icon name="chevron-right" size={14} />
          </button>
        </div>
      );
    }

    // years
    const rangeEnd = yearsRangeStart + 11;
    return (
      <div className="sp-cal__header">
        <button
          type="button"
          className="sp-cal__nav"
          aria-label="Previous 12 years"
          onClick={goToPrevYearRange}
        >
          <Icon name="chevron-left" size={14} />
        </button>
        <span className="sp-cal__header-label sp-cal__header-label--static">
          {yearsRangeStart} &ndash; {rangeEnd}
        </span>
        <button
          type="button"
          className="sp-cal__nav"
          aria-label="Next 12 years"
          onClick={goToNextYearRange}
        >
          <Icon name="chevron-right" size={14} />
        </button>
      </div>
    );
  }

  /* ── Render: Days View ── */

  function renderDaysView() {
    const selectedIso = value ?? null;

    return (
      <>
        {/* Weekday Headers */}
        <div
          className={
            showWeekNumbers
              ? 'sp-cal__weekdays sp-cal__weekdays--with-weeks'
              : 'sp-cal__weekdays'
          }
        >
          {showWeekNumbers && <span className="sp-cal__weekday" />}
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} className="sp-cal__weekday">
              {label}
            </span>
          ))}
        </div>

        {/* Day Grid */}
        <div
          ref={gridRef}
          className={
            showWeekNumbers
              ? 'sp-cal__grid sp-cal__grid--with-weeks'
              : 'sp-cal__grid'
          }
          role="grid"
          aria-label={`${MONTH_NAMES[viewMonth]} ${viewYear}`}
          tabIndex={0}
          onKeyDown={handleDaysKeyDown}
          onFocus={() => {
            if (focusedDay === null) {
              // On initial focus, focus the selected day or the 1st
              if (selectedIso) {
                const d = parseIso(selectedIso);
                if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
                  setFocusedDay(d.getDate());
                  return;
                }
              }
              setFocusedDay(1);
            }
          }}
        >
          {calendarRows.map((row, rowIdx) => (
            <Fragment key={rowIdx}>
              {showWeekNumbers && (
                <span
                  className={
                    weekNumberBackground
                      ? 'sp-cal__week-number sp-cal__week-number--bg'
                      : 'sp-cal__week-number'
                  }
                  aria-hidden="true"
                >
                  {row.weekNumber}
                </span>
              )}
              {row.days.map((day, colIdx) => {
                if (day === null) {
                  return (
                    <span
                      key={`empty-${rowIdx}-${colIdx}`}
                      className="sp-cal__day sp-cal__day--empty"
                      aria-hidden="true"
                    />
                  );
                }

                const iso = toIso(new Date(viewYear, viewMonth, day));
                const isSelected = iso === selectedIso;
                const isToday = iso === today;
                const isDisabled = isDayDisabled(iso);
                const isFocused = day === focusedDay;

                const dayCls = [
                  'sp-cal__day',
                  isToday && 'sp-cal__day--today',
                  isSelected && 'sp-cal__day--selected',
                  isFocused && 'sp-cal__day--focused',
                  isDisabled && 'sp-cal__day--disabled',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <button
                    key={day}
                    type="button"
                    className={dayCls}
                    data-day={day}
                    tabIndex={-1}
                    aria-label={`${MONTH_NAMES[viewMonth]} ${day}, ${viewYear}`}
                    aria-selected={isSelected}
                    aria-disabled={isDisabled}
                    disabled={isDisabled}
                    onClick={() => selectDay(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </Fragment>
          ))}
        </div>
      </>
    );
  }

  /* ── Render: Months View ── */

  function renderMonthsView() {
    const currentMonth = todayDate.getMonth();
    const currentYear = todayDate.getFullYear();
    const selectedDate = value ? parseIso(value) : null;

    return (
      <div className="sp-cal__cell-grid" role="grid" aria-label="Months">
        {MONTH_ABBR.map((abbr, idx) => {
          const isCurrent = idx === currentMonth && viewYear === currentYear;
          const isSelected =
            selectedDate !== null &&
            idx === selectedDate.getMonth() &&
            viewYear === selectedDate.getFullYear();
          const isDisabled = isMonthDisabled(idx);

          const cls = [
            'sp-cal__cell',
            isCurrent && 'sp-cal__cell--current',
            isSelected && 'sp-cal__cell--selected',
            isDisabled && 'sp-cal__cell--disabled',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={abbr}
              type="button"
              className={cls}
              disabled={isDisabled}
              aria-label={MONTH_NAMES[idx]}
              onClick={() => selectMonth(idx)}
            >
              {abbr}
            </button>
          );
        })}
      </div>
    );
  }

  /* ── Render: Years View ── */

  function renderYearsView() {
    const currentYear = todayDate.getFullYear();
    const selectedDate = value ? parseIso(value) : null;
    const years: number[] = [];
    for (let i = 0; i < 12; i++) {
      years.push(yearsRangeStart + i);
    }

    return (
      <div className="sp-cal__cell-grid" role="grid" aria-label="Years">
        {years.map((year) => {
          const isCurrent = year === currentYear;
          const isSelected = selectedDate !== null && year === selectedDate.getFullYear();
          const isDisabled = isYearDisabled(year);

          const cls = [
            'sp-cal__cell',
            isCurrent && 'sp-cal__cell--current',
            isSelected && 'sp-cal__cell--selected',
            isDisabled && 'sp-cal__cell--disabled',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={year}
              type="button"
              className={cls}
              disabled={isDisabled}
              aria-label={String(year)}
              onClick={() => selectYear(year)}
            >
              {year}
            </button>
          );
        })}
      </div>
    );
  }

  /* ── Render: Footer ── */

  function renderFooter() {
    if (!showFooter) return null;

    return (
      <div className="sp-cal__footer">
        <button
          type="button"
          className="sp-cal__today-btn"
          onClick={handleTodayClick}
        >
          Today
        </button>
        <button
          type="button"
          className="sp-cal__clear-btn"
          onClick={handleClearClick}
        >
          Clear
        </button>
      </div>
    );
  }

  /* ── Main Render ── */

  return (
    <div className={rootClasses} aria-disabled={disabled || undefined}>
      {renderHeader()}
      {viewMode === 'days' && renderDaysView()}
      {viewMode === 'months' && renderMonthsView()}
      {viewMode === 'years' && renderYearsView()}
      {renderFooter()}
    </div>
  );
}
