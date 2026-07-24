import './Terminal.css';
import { useRef, useEffect, useCallback, useState } from 'react';

/* ── Public types ──────────────────────────────────────────────────────── */

export type TerminalLogLevel = 'log' | 'info' | 'warn' | 'error' | 'success' | 'debug';

export interface TerminalEntry {
  id: number;
  level: TerminalLogLevel;
  message: string;
  timestamp: Date;
  badge?: string;
}

/* ── useTerminal hook ──────────────────────────────────────────────────── */

export function useTerminal() {
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const nextIdRef = useRef(0);

  const push = useCallback((level: TerminalLogLevel, message: string, badge?: string) => {
    const entry: TerminalEntry = {
      id: nextIdRef.current++,
      level,
      message,
      timestamp: new Date(),
      badge,
    };
    setEntries((prev) => [...prev, entry]);
  }, []);

  const log = useCallback(
    (message: string, badge?: string) => push('log', message, badge),
    [push],
  );
  const info = useCallback(
    (message: string, badge?: string) => push('info', message, badge),
    [push],
  );
  const warn = useCallback(
    (message: string, badge?: string) => push('warn', message, badge),
    [push],
  );
  const error = useCallback(
    (message: string, badge?: string) => push('error', message, badge),
    [push],
  );
  const success = useCallback(
    (message: string, badge?: string) => push('success', message, badge),
    [push],
  );
  const debug = useCallback(
    (message: string, badge?: string) => push('debug', message, badge),
    [push],
  );
  const clear = useCallback(() => setEntries([]), []);

  return { entries, log, info, warn, error, success, debug, clear };
}

/* ── Helpers ───────────────────────────────────────────────────────────── */

function prefixFor(level: TerminalLogLevel): string {
  switch (level) {
    case 'info':    return '\u2139';
    case 'warn':    return '\u26A0';
    case 'error':   return '\u2716';
    case 'success': return '\u2714';
    case 'debug':   return '\u25C8';
    default:        return '\u203A';
  }
}

function formatTimestamp(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  const ms = String(date.getMilliseconds()).padStart(3, '0');
  return `${h}:${m}:${s}.${ms}`;
}

/* ── Props ─────────────────────────────────────────────────────────────── */

export interface TerminalProps {
  /** Entries to display. */
  entries?: TerminalEntry[];
  /** Terminal window title shown in the titlebar. */
  title?: string;
  /** Show timestamp column before each entry. */
  showTimestamp?: boolean;
  /** Show level badge labels. */
  showLevelBadge?: boolean;
  /** Show a "clear" button in the titlebar. */
  clearable?: boolean;
  /** Draw a border and box-shadow around the terminal shell. */
  bordered?: boolean;
  /** Max number of entries before oldest are discarded (0 = unlimited). */
  maxEntries?: number;
  /** Max height CSS value (e.g. '260px'). */
  maxHeight?: string;
  /** Accessible label for the log region. */
  ariaLabel?: string;
  /** Emitted when the user clicks the clear button. */
  onClear?: () => void;
}

/* ── Component ─────────────────────────────────────────────────────────── */

export function Terminal({
  entries = [],
  title = 'terminal',
  showTimestamp = true,
  showLevelBadge = true,
  clearable = true,
  bordered = true,
  maxEntries = 500,
  maxHeight,
  ariaLabel = 'Terminal output',
  onClear,
}: TerminalProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  /* Resolve entries with max cap */
  const resolvedEntries =
    maxEntries > 0 && entries.length > maxEntries
      ? entries.slice(entries.length - maxEntries)
      : entries;

  /* Auto-scroll to bottom */
  useEffect(() => {
    const el = bodyRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [resolvedEntries]);

  function handleClear() {
    onClear?.();
  }

  const shellCls = [
    'sp-terminal',
    bordered ? 'sp-terminal--bordered' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={shellCls}
      role="log"
      aria-label={ariaLabel}
      aria-live="polite"
      style={maxHeight ? { height: maxHeight } : undefined}
    >
      {/* Titlebar */}
      <div className="sp-terminal__bar">
        <div className="sp-terminal__dots" aria-hidden="true">
          <span className="sp-terminal__dot sp-terminal__dot--red" />
          <span className="sp-terminal__dot sp-terminal__dot--yellow" />
          <span className="sp-terminal__dot sp-terminal__dot--green" />
        </div>
        <span className="sp-terminal__title">{title}</span>
        {clearable && (
          <button
            className="sp-terminal__clear-btn"
            type="button"
            onClick={handleClear}
            aria-label="Clear terminal"
          >
            clear
          </button>
        )}
      </div>

      {/* Output */}
      <div className="sp-terminal__body" ref={bodyRef}>
        {resolvedEntries.map((entry) => (
          <div
            key={entry.id}
            className={`sp-terminal__line sp-terminal__line--${entry.level}`}
          >
            {showTimestamp && (
              <span className="sp-terminal__ts">
                {formatTimestamp(entry.timestamp)}
              </span>
            )}
            {entry.badge && showLevelBadge && (
              <span className={`sp-terminal__badge sp-terminal__badge--${entry.level}`}>
                {entry.badge}
              </span>
            )}
            <span className="sp-terminal__prefix" aria-hidden="true">
              {prefixFor(entry.level)}
            </span>
            <span className="sp-terminal__msg">{entry.message}</span>
          </div>
        ))}
        {resolvedEntries.length === 0 && (
          <div className="sp-terminal__empty">No output yet.</div>
        )}
        <div className="sp-terminal__cursor" aria-hidden="true" />
      </div>
    </div>
  );
}
