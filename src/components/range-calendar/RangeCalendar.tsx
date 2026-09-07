/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* The local draft intentionally synchronizes from the controlled range value. */
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import './RangeCalendar.css';
import { useDateControlContract, type DateControlContractProps } from '../date-control/date-control-contract.js';
import { DateControlMessages } from '../date-control/DateControlMessages.js';

/* ── Types ── */

export interface DateRange {
  start: string | null;
  end: string | null;
}

export interface DateRangePreset {
  label: string;
  range: DateRange;
}

export interface RangeCalendarProps extends DateControlContractProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  months?: number;
  presets?: DateRangePreset[];
  showFooter?: boolean;
  disabled?: boolean;
  className?: string;
}

/* ── Constants ── */

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
  // Clamp to end of month if day overflows
  const maxDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  if (d.getDate() !== day) {
    return toISO(d.getFullYear(), d.getMonth(), Math.min(day, maxDay));
  }
  return toISO(d.getFullYear(), d.getMonth(), d.getDate());
}

/* ── Component ── */

interface PanelData {
  index: number;
  month: number;
  year: number;
  days: DayEntry[];
}

export function RangeCalendar({
  value,
  onChange,
  months: monthCount = 2,
  presets,
  showFooter = true,
  disabled: disabledProp = false,
  readOnly = false,
  hidden = false,
  invalid,
  error,
  errors,
  required = false,
  touched = false,
  onTouchedChange,
  onBlur,
  hint,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  id,
  className = '',
}: RangeCalendarProps) {
  const { monthNames, monthLabels, dayLabels, t, formatDayLabel, leadingBlankDays } = useI18n();
  const contract = useDateControlContract({ disabled: disabledProp, readOnly, hidden, invalid, error, errors, required, touched, onTouchedChange, onBlur, hint, ariaLabel, ariaLabelledBy, ariaDescribedBy, id, valuePresent: Boolean(value?.start || value?.end) });
  const disabled = contract.disabled || contract.readOnly;
  const today = useMemo(() => todayISO(), []);
  const todayParsed = useMemo(() => parseISO(today), [today]);

  // Determine initial base month from value or today
  const initialBase = value?.start
    ? parseISO(value.start)
    : { month: todayParsed.month, year: todayParsed.year };

  const [baseMonth, setBaseMonth] = useState(initialBase.month);
  const [baseYear, setBaseYear] = useState(initialBase.year);

  // Local range state (applied on Apply click, or immediately if no footer)
  const [rangeStart, setRangeStart] = useState<string | null>(value?.start ?? null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(value?.end ?? null);
  const [picking, setPicking] = useState<'start' | 'end'>('start');

  // View mode
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
  const [editingPanel, setEditingPanel] = useState(0);
  const [editYear, setEditYear] = useState(baseYear);
  const [yearRangeStart, setYearRangeStart] = useState(baseYear - (baseYear % 12));

  // Keyboard navigation
  const [focusedDate, setFocusedDate] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync from controlled value
  useEffect(() => {
    if (value) {
      setRangeStart(value.start ?? null);
      setRangeEnd(value.end ?? null);
    }
  }, [value]);

  // Build panels
  const panels: PanelData[] = useMemo(() => {
    return Array.from({ length: monthCount }, (_, i) => {
      const total = baseYear * 12 + baseMonth + i;
      const month = total % 12;
      const year = Math.floor(total / 12);
      return { index: i, month, year, days: buildDays(year, month, leadingBlankDays(year, month)) };
    });
  }, [baseMonth, baseYear, leadingBlankDays, monthCount]);

  // Navigation
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

  // Day click
  const handleDayClick = useCallback(
    (iso: string) => {
      if (picking === 'start') {
        setRangeStart(iso);
        setRangeEnd(null);
        setPicking('end');
        setFocusedDate(iso);
      } else {
        // If clicked date is before start, restart
        if (rangeStart && iso < rangeStart) {
          setRangeStart(iso);
          setRangeEnd(null);
          setPicking('end');
        } else {
          setRangeEnd(iso);
          setPicking('start');
          // If no footer, emit immediately
          if (!showFooter) {
            onChange?.({ start: rangeStart, end: iso });
          }
        }
        setFocusedDate(iso);
      }
    },
    [picking, rangeStart, showFooter, onChange],
  );

  // Preset click
  const handlePresetClick = useCallback(
    (preset: DateRangePreset) => {
      setRangeStart(preset.range.start);
      setRangeEnd(preset.range.end);
      setPicking('start');

      // Navigate base month to show the preset start
      if (preset.range.start) {
        const p = parseISO(preset.range.start);
        setBaseMonth(p.month);
        setBaseYear(p.year);
      }

      if (!showFooter) {
        onChange?.(preset.range);
      }
    },
    [showFooter, onChange],
  );

  // Footer actions
  const handleClear = useCallback(() => {
    setRangeStart(null);
    setRangeEnd(null);
    setPicking('start');
    setFocusedDate(null);
    onChange?.({ start: null, end: null });
  }, [onChange]);

  const handleApply = useCallback(() => {
    onChange?.({ start: rangeStart, end: rangeEnd });
  }, [onChange, rangeStart, rangeEnd]);

  // Header label click -> open month picker for that panel
  const handleHeaderLabelClick = useCallback(
    (panelIndex: number, panelYear: number) => {
      setEditingPanel(panelIndex);
      setEditYear(panelYear);
      setYearRangeStart(panelYear - (panelYear % 12));
      setViewMode('months');
    },
    [],
  );

  // Month picker: select a month
  const handleMonthSelect = useCallback(
    (month: number) => {
      const targetTotal = editYear * 12 + month - editingPanel;
      setBaseMonth(targetTotal % 12);
      setBaseYear(Math.floor(targetTotal / 12));
      setViewMode('days');
    },
    [editYear, editingPanel],
  );

  // Year picker: select a year
  const handleYearSelect = useCallback(
    (year: number) => {
      setEditYear(year);
      setViewMode('months');
    },
    [],
  );

  // Check if a preset is currently active
  const isPresetActive = useCallback(
    (preset: DateRangePreset) =>
      rangeStart === preset.range.start && rangeEnd === preset.range.end,
    [rangeStart, rangeEnd],
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled || viewMode !== 'days') return;

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
          setFocusedDate(null);
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
    [disabled, viewMode, focusedDate, rangeStart, today, panels, baseYear, handleDayClick],
  );

  // Root classes
  const rootClasses = [
    'sp-rcal',
    contract.invalid && 'sp-date-control--invalid',
    contract.readOnly && 'sp-date-control--readonly',
    contract.hidden && 'sp-date-control--hidden',
    disabled && 'sp-rcal--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // ── Render Picker Views ──

  if (viewMode === 'months') {
    const nowMonth = todayParsed.month;
    const nowYear = todayParsed.year;

    return (
      <div
        id={contract.id}
        className={rootClasses}
        ref={containerRef}
        tabIndex={0}
        role="application"
          aria-label={`${t('dateRangeCalendar')} ${t('month')}`}
        aria-disabled={contract.disabled || undefined}
        aria-readonly={contract.readOnly || undefined}
        aria-invalid={contract.invalid || undefined}
        aria-required={contract.required || undefined}
        aria-describedby={contract.aria['aria-describedby']}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) contract.markTouched(); }}
      >
        <div className="sp-rcal__body">
          {presets && presets.length > 0 && (
            <div className="sp-rcal__presets" role="listbox" aria-label={t('dateRangePresets')}>
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  role="option"
                  aria-selected={isPresetActive(preset)}
                  className={`sp-rcal__preset${isPresetActive(preset) ? ' sp-rcal__preset--active' : ''}`}
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
          <div className="sp-rcal__content">
            <div className="sp-rcal__picker-view">
              <div className="sp-rcal__header">
                <button
                  type="button"
                  className="sp-rcal__nav"
                  aria-label={t('previousYear')}
                  onClick={() => setEditYear((y) => y - 1)}
                >
                  <Icon name="chevron-left" size={14} />
                </button>
                <button
                  type="button"
                  className="sp-rcal__header-label"
                  onClick={() => {
                    setYearRangeStart(editYear - (editYear % 12));
                    setViewMode('years');
                  }}
                >
                  {editYear}
                </button>
                <button
                  type="button"
                  className="sp-rcal__nav"
                  aria-label={t('nextYear')}
                  onClick={() => setEditYear((y) => y + 1)}
                >
                  <Icon name="chevron-right" size={14} />
                </button>
              </div>
              <div className="sp-rcal__cell-grid" role="grid" aria-label={t('month')}>
                {monthLabels.map((label, i) => {
                  const isCurrent = i === nowMonth && editYear === nowYear;
                  // A month is "selected" if it matches the panel being edited
                  const panelTotal = baseYear * 12 + baseMonth + editingPanel;
                  const isSelected = editYear * 12 + i === panelTotal;
                  const cls = [
                    'sp-rcal__cell',
                    isCurrent && 'sp-rcal__cell--current',
                    isSelected && 'sp-rcal__cell--selected',
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
          </div>
        </div>

        {showFooter && (
          <div className="sp-rcal__footer">
            <button type="button" className="sp-rcal__action" onClick={handleClear}>
              {t('clear')}
            </button>
            <button
              type="button"
              className="sp-rcal__action sp-rcal__action--primary"
              onClick={handleApply}
            >
              {t('apply')}
            </button>
          </div>
        )}
        <DateControlMessages errorMessage={contract.errorMessage} hint={contract.hint} errorId={contract.errorId} hintId={contract.hintId} />
      </div>
    );
  }

  if (viewMode === 'years') {
    const nowYear = todayParsed.year;
    const years = Array.from({ length: 12 }, (_, i) => yearRangeStart + i);

    return (
      <div
        id={contract.id}
        className={rootClasses}
        ref={containerRef}
        tabIndex={0}
        role="application"
          aria-label={`${t('dateRangeCalendar')} ${t('year')}`}
        aria-disabled={contract.disabled || undefined}
        aria-readonly={contract.readOnly || undefined}
        aria-invalid={contract.invalid || undefined}
        aria-required={contract.required || undefined}
        aria-describedby={contract.aria['aria-describedby']}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) contract.markTouched(); }}
      >
        <div className="sp-rcal__body">
          {presets && presets.length > 0 && (
            <div className="sp-rcal__presets" role="listbox" aria-label={t('dateRangePresets')}>
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  role="option"
                  aria-selected={isPresetActive(preset)}
                  className={`sp-rcal__preset${isPresetActive(preset) ? ' sp-rcal__preset--active' : ''}`}
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
          <div className="sp-rcal__content">
            <div className="sp-rcal__picker-view">
              <div className="sp-rcal__header">
                <button
                  type="button"
                  className="sp-rcal__nav"
                  aria-label={t('previousYears')}
                  onClick={() => setYearRangeStart((s) => s - 12)}
                >
                  <Icon name="chevron-left" size={14} />
                </button>
                <span className="sp-rcal__header-label" style={{ cursor: 'default' }}>
                  {yearRangeStart} &ndash; {yearRangeStart + 11}
                </span>
                <button
                  type="button"
                  className="sp-rcal__nav"
                  aria-label={t('nextYears')}
                  onClick={() => setYearRangeStart((s) => s + 12)}
                >
                  <Icon name="chevron-right" size={14} />
                </button>
              </div>
              <div className="sp-rcal__cell-grid" role="grid" aria-label={t('year')}>
                {years.map((yr) => {
                  const isCurrent = yr === nowYear;
                  const isSelected = yr === editYear;
                  const cls = [
                    'sp-rcal__cell',
                    isCurrent && 'sp-rcal__cell--current',
                    isSelected && 'sp-rcal__cell--selected',
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
          </div>
        </div>

        {showFooter && (
          <div className="sp-rcal__footer">
            <button type="button" className="sp-rcal__action" onClick={handleClear}>
              {t('clear')}
            </button>
            <button
              type="button"
              className="sp-rcal__action sp-rcal__action--primary"
              onClick={handleApply}
            >
              {t('apply')}
            </button>
          </div>
        )}
        <DateControlMessages errorMessage={contract.errorMessage} hint={contract.hint} errorId={contract.errorId} hintId={contract.hintId} />
      </div>
    );
  }

  // ── Days View ──

  return (
    <div
      id={contract.id}
      className={rootClasses}
      ref={containerRef}
      tabIndex={0}
      role="application"
        aria-label={t('dateRangeCalendar')}
      aria-disabled={contract.disabled || undefined}
      aria-readonly={contract.readOnly || undefined}
      aria-invalid={contract.invalid || undefined}
      aria-required={contract.required || undefined}
      aria-describedby={contract.aria['aria-describedby']}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) contract.markTouched(); }}
      onKeyDown={handleKeyDown}
    >
      <div className="sp-rcal__body">
        {/* Presets sidebar */}
        {presets && presets.length > 0 && (
          <div className="sp-rcal__presets" role="listbox" aria-label={t('dateRangePresets')}>
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                role="option"
                aria-selected={isPresetActive(preset)}
                className={`sp-rcal__preset${isPresetActive(preset) ? ' sp-rcal__preset--active' : ''}`}
                onClick={() => handlePresetClick(preset)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        {/* Panels */}
        <div className="sp-rcal__content">
          <div className="sp-rcal__panels">
            {panels.map((panel) => (
              <div key={`${panel.year}-${panel.month}`} className="sp-rcal__panel">
                {/* Panel header */}
                <div className="sp-rcal__header">
                  {panel.index === 0 ? (
                    <button
                      type="button"
                      className="sp-rcal__nav"
                        aria-label={t('previousMonth')}
                      onClick={goToPrevMonth}
                    >
                      <Icon name="chevron-left" size={14} />
                    </button>
                  ) : (
                    <span className="sp-rcal__nav-spacer" />
                  )}
                  <button
                    type="button"
                    className="sp-rcal__header-label"
                      aria-label={`${monthNames[panel.month]} ${panel.year}`}
                    onClick={() => handleHeaderLabelClick(panel.index, panel.year)}
                  >
                    {monthNames[panel.month]} {panel.year}
                  </button>
                  {panel.index === monthCount - 1 ? (
                    <button
                      type="button"
                      className="sp-rcal__nav"
                        aria-label={t('nextMonth')}
                      onClick={goToNextMonth}
                    >
                      <Icon name="chevron-right" size={14} />
                    </button>
                  ) : (
                    <span className="sp-rcal__nav-spacer" />
                  )}
                </div>

                {/* Weekday headers */}
                <div className="sp-rcal__weekdays" role="row">
                  {dayLabels.map((label) => (
                    <span key={label} className="sp-rcal__weekday" role="columnheader" aria-label={label}>
                      {label}
                    </span>
                  ))}
                </div>

                {/* Day grid */}
                <div className="sp-rcal__grid" role="grid" aria-label={`${monthNames[panel.month]} ${panel.year}`}>
                  {panel.days.map((day, i) => {
                    if (day.empty) {
                      return <span key={`empty-${i}`} className="sp-rcal__day sp-rcal__day--empty" />;
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
                      'sp-rcal__day',
                      isStart && 'sp-rcal__day--start',
                      isEnd && 'sp-rcal__day--end',
                      isInRange && 'sp-rcal__day--in-range',
                      isToday && !isStart && !isEnd && 'sp-rcal__day--today',
                      isFocused && 'sp-rcal__day--focused',
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
        </div>
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="sp-rcal__footer">
          <button type="button" className="sp-rcal__action" onClick={handleClear}>
            {t('clear')}
          </button>
          <button
            type="button"
            className="sp-rcal__action sp-rcal__action--primary"
            onClick={handleApply}
          >
            {t('apply')}
          </button>
        </div>
      )}
      <DateControlMessages errorMessage={contract.errorMessage} hint={contract.hint} errorId={contract.errorId} hintId={contract.hintId} />
    </div>
  );
}
