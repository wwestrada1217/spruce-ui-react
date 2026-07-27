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
import './TimePicker.css';

export type TimePickerSize = 'sm' | 'md' | 'lg';

export interface TimePickerProps {
  /** Current value as a formatted time string (e.g. "02:30 PM" or "14:30"). */
  value?: string | null;
  /** Called when the value changes. Receives `null` on clear. */
  onChange?: (value: string | null) => void;
  /** Placeholder text shown when no value is set. */
  placeholder?: string;
  /** Visual size of the trigger. */
  size?: TimePickerSize;
  /** Use 24-hour format instead of 12-hour with AM/PM. */
  use24Hour?: boolean;
  /** Show a seconds column in the picker. */
  showSeconds?: boolean;
  /** Render as a text input instead of a button trigger. */
  inputMode?: boolean;
  /** Disable all interaction. */
  disabled?: boolean;
  /** Additional CSS class applied to the root wrapper. */
  className?: string;
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

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

function parseTime(
  raw: string | null | undefined,
): { hour: number; minute: number; second: number } | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  // Match "HH:MM(:SS)( AM/PM)"
  const match = trimmed.match(
    /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(AM|PM)?$/i,
  );
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const second = match[3] ? parseInt(match[3], 10) : 0;
  const period = match[4]?.toUpperCase();
  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
    return null;
  }
  return { hour, minute, second };
}

function wrap(value: number, delta: number, min: number, max: number): number {
  const range = max - min + 1;
  return ((value - min + delta) % range + range) % range + min;
}

/* ── Component ────────────────────────────────────────────────────────────── */

/**
 * A dropdown time picker with hour/minute/second spinners.
 *
 * Supports both a button trigger (default) and an input mode,
 * 12-hour and 24-hour formats, and an optional seconds column.
 *
 * @example
 * ```tsx
 * <TimePicker value="02:30 PM" onChange={setValue} />
 * <TimePicker use24Hour showSeconds inputMode />
 * ```
 */
export function TimePicker({
  value,
  onChange,
  placeholder = 'Select time',
  size = 'md',
  use24Hour = false,
  showSeconds = false,
  inputMode = false,
  disabled = false,
  className,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const [panelReady, setPanelReady] = useState(false);
  const rafId = useRef(0);

  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    const parsed = parseTime(value);
    if (parsed) {
      setHour(parsed.hour);
      setMinute(parsed.minute);
      setSecond(parsed.second);
    }
  }

  const displayValue = value ?? '';

  /* ── Positioning ──────────────────────────────────────────────────────── */

  const reposition = useCallback(() => {
    const anchor = wrapRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;
    const result = computePosition(anchor, panel, 'bottom-start', 4);
    setPanelPos({ top: result.top, left: result.left });
    setPanelReady(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    rafId.current = requestAnimationFrame(reposition);
    return () => cancelAnimationFrame(rafId.current);
  }, [open, reposition]);

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

  /* ── Apply / Close ────────────────────────────────────────────────────── */

  const applyAndClose = useCallback(() => {
    const formatted = formatTime(hour, minute, second, use24Hour, showSeconds);
    onChange?.(formatted);
    setOpen(false);
  }, [hour, minute, second, use24Hour, showSeconds, onChange]);

  const handleClear = useCallback(() => {
    setHour(0);
    setMinute(0);
    setSecond(0);
    onChange?.(null);
    setOpen(false);
  }, [onChange]);

  /* ── Click outside ────────────────────────────────────────────────────── */

  useEffect(() => {
    if (!open) return;
    const els = [wrapRef.current, panelRef.current].filter(Boolean) as HTMLElement[];
    return onClickOutside(els, applyAndClose);
  }, [open, applyAndClose]);

  /* ── Keyboard ─────────────────────────────────────────────────────────── */

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

  /* ── Toggle ───────────────────────────────────────────────────────────── */

  function toggleOpen() {
    if (disabled) return;
    if (open) {
      applyAndClose();
      return;
    }
    const parsed = parseTime(value);
    if (parsed) {
      setHour(parsed.hour);
      setMinute(parsed.minute);
      setSecond(parsed.second);
    } else {
      setHour(0);
      setMinute(0);
      setSecond(0);
    }
    setPanelReady(false);
    setOpen(true);
  }

  /* ── Input mode typing ────────────────────────────────────────────────── */

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const parsed = parseTime(raw);
    if (parsed) {
      setHour(parsed.hour);
      setMinute(parsed.minute);
      setSecond(parsed.second);
      onChange?.(formatTime(parsed.hour, parsed.minute, parsed.second, use24Hour, showSeconds));
    } else {
      // Pass raw through so onChange reflects partial edits as null
      onChange?.(raw || null);
    }
  }

  /* ── Hold-to-repeat helper ────────────────────────────────────────────── */

  const holdTimers = useRef<Map<string, { timeout: ReturnType<typeof setTimeout>; interval: ReturnType<typeof setInterval> }>>(new Map());

  // Cleanup all hold timers on unmount
  useEffect(() => {
    const timers = holdTimers.current;
    return () => {
      timers.forEach((entry) => {
        clearTimeout(entry.timeout);
        clearInterval(entry.interval);
      });
      timers.clear();
    };
  }, []);

  function makeHoldHandlers(key: string, action: () => void) {
    function start() {
      action();
      const timeout = setTimeout(() => {
        const iv = setInterval(action, 80);
        const entry = holdTimers.current.get(key);
        if (entry) entry.interval = iv;
      }, 400);
      holdTimers.current.set(key, { timeout, interval: 0 as unknown as ReturnType<typeof setInterval> });
    }

    function stop() {
      const entry = holdTimers.current.get(key);
      if (entry) {
        clearTimeout(entry.timeout);
        clearInterval(entry.interval);
        holdTimers.current.delete(key);
      }
    }

    function handleClick(e: React.MouseEvent) {
      if (e.detail === 0) {
        action();
      }
    }

    return { onMouseDown: start, onMouseUp: stop, onMouseLeave: stop, onClick: handleClick };
  }

  /* ── Step buttons ─────────────────────────────────────────────────────── */

  const hourUp = makeHoldHandlers('hu', () => setHour((h) => wrap(h, 1, 0, 23)));
  const hourDown = makeHoldHandlers('hd', () => setHour((h) => wrap(h, -1, 0, 23)));
  const minuteUp = makeHoldHandlers('mu', () => setMinute((m) => wrap(m, 1, 0, 59)));
  const minuteDown = makeHoldHandlers('md', () => setMinute((m) => wrap(m, -1, 0, 59)));
  const secondUp = makeHoldHandlers('su', () => setSecond((s) => wrap(s, 1, 0, 59)));
  const secondDown = makeHoldHandlers('sd', () => setSecond((s) => wrap(s, -1, 0, 59)));

  /* ── Display helpers ──────────────────────────────────────────────────── */

  const displayHour = use24Hour ? pad(hour) : pad(hour % 12 === 0 ? 12 : hour % 12);
  const isAM = hour < 12;

  function setAM() {
    if (!isAM) setHour((h) => h - 12);
  }
  function setPM() {
    if (isAM) setHour((h) => h + 12);
  }

  /* ── Size classes ─────────────────────────────────────────────────────── */

  const sizeClass = size === 'sm' ? '--sm' : size === 'lg' ? '--lg' : '';

  /* ── Render ───────────────────────────────────────────────────────────── */

  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;

  const panel = open
    ? createPortal(
        <div
          ref={panelRef}
          className="sp-tp__panel"
          style={{
            position: 'fixed',
            top: panelPos.top,
            left: panelPos.left,
            zIndex: 999,
            opacity: panelReady ? 1 : 0,
          }}
          role="dialog"
          aria-label="Time picker"
        >
          {/* Columns */}
          <div className="sp-tp__columns">
            {/* Hour */}
            <div className="sp-tp__col">
              <button
                type="button"
                className="sp-tp__step"
                aria-label="Increase hour"
                {...hourUp}
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
                {...hourDown}
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
                {...minuteUp}
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
                {...minuteDown}
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
                    {...secondUp}
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
                    {...secondDown}
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

          {/* Footer */}
          <div className="sp-tp__footer">
            <button
              type="button"
              className="sp-tp__clear-btn"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              type="button"
              className="sp-tp__apply-btn"
              onClick={applyAndClose}
            >
              Apply
            </button>
          </div>
        </div>,
        document.body,
      )
    : null;

  const rootCls = ['sp-tp', className].filter(Boolean).join(' ');

  if (inputMode) {
    return (
      <div ref={wrapRef} className={rootCls}>
        <div
          className={[
            'sp-tp__input-wrap',
            sizeClass ? `sp-tp__input-wrap${sizeClass}` : '',
            disabled ? 'sp-tp__input-wrap--disabled' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Icon
            name="clock"
            size={iconSize}
            className="sp-tp__input-icon"
          />
          <input
            className="sp-tp__input"
            type="text"
            placeholder={placeholder}
            value={displayValue}
            disabled={disabled}
            onChange={handleInputChange}
            aria-label="Time"
          />
          <button
            type="button"
            className="sp-tp__input-toggle"
            onClick={toggleOpen}
            disabled={disabled}
            aria-label="Toggle time picker"
            aria-expanded={open}
          >
            <Icon name="chevron-down" size={12} />
          </button>
        </div>
        {panel}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={rootCls}>
      <button
        type="button"
        className={[
          'sp-tp__trigger',
          sizeClass ? `sp-tp__trigger${sizeClass}` : '',
          disabled ? 'sp-tp__trigger--disabled' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={toggleOpen}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Icon name="clock" size={iconSize} />
        <span className="sp-tp__value">
          {displayValue || placeholder}
        </span>
        <Icon name="chevron-down" size={12} />
      </button>
      {panel}
    </div>
  );
}
