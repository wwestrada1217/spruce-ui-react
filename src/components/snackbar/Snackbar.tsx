/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Snackbar.css';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SnackbarConfig {
  message: string;
  /** Auto-dismiss duration in ms. 0 = persistent. Default 4000. */
  duration?: number;
  action?: { label: string; onClick: () => void };
  /** Whether the close button is shown. Default true. */
  dismissible?: boolean;
}

// ── Context ────────────────────────────────────────────────────────────────────

export interface SnackbarContextValue {
  show: (config: SnackbarConfig) => void;
  open: (message: string, opts?: Partial<SnackbarConfig>) => void;
  dismiss: () => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

/**
 * Hook to access snackbar methods. Must be used within a `<SnackbarProvider>`.
 *
 * @example
 * ```tsx
 * const snackbar = useSnackbar();
 * snackbar.open('Item deleted');
 * ```
 */
export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error('useSnackbar must be used within a <SnackbarProvider>');
  }
  return ctx;
}

// ── Provider ───────────────────────────────────────────────────────────────────

export interface SnackbarProviderProps {
  children: ReactNode;
}

/**
 * Provides the snackbar context and renders the snackbar container via portal.
 * Only one snackbar is shown at a time; new calls replace the current one.
 *
 * @example
 * ```tsx
 * <SnackbarProvider>
 *   <App />
 * </SnackbarProvider>
 * ```
 */
export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const { t } = useI18n();
  const [current, setCurrent] = useState<SnackbarConfig | null>(null);
  const [removing, setRemoving] = useState(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    if (animTimerRef.current) {
      clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
  }, []);

  // Clean up timers on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const dismiss = useCallback(() => {
    setCurrent((prev) => {
      if (!prev) return prev;
      clearTimers();
      setRemoving(true);

      animTimerRef.current = setTimeout(() => {
        setCurrent(null);
        setRemoving(false);
      }, 300);

      return prev;
    });
  }, [clearTimers]);

  const show = useCallback(
    (config: SnackbarConfig) => {
      clearTimers();

      // Replace immediately (skip exit animation for replaced snackbar)
      setRemoving(false);
      setCurrent({ dismissible: true, ...config });

      const duration = config.duration ?? 4000;
      if (duration > 0) {
        autoTimerRef.current = setTimeout(() => dismiss(), duration);
      }
    },
    [clearTimers, dismiss],
  );

  const open = useCallback(
    (message: string, opts?: Partial<SnackbarConfig>) => {
      show({ message, ...opts });
    },
    [show],
  );

  const handleAction = () => {
    current?.action?.onClick();
    dismiss();
  };

  const contextValue: SnackbarContextValue = { show, open, dismiss };

  const snackbarClasses = [
    'sp-snackbar',
    removing ? 'sp-snackbar--removing' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const portal = createPortal(
    current ? (
      <div className="sp-snackbar-host">
        <div
          className={snackbarClasses}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="sp-snackbar__message">{current.message}</span>

          {current.action && (
            <button type="button" className="sp-snackbar__action" onClick={handleAction}>
              {current.action.label}
            </button>
          )}

          {current.dismissible !== false && (
            <button
              type="button"
              className="sp-snackbar__close"
              aria-label={t('dismiss')}
              onClick={dismiss}
            >
              <Icon name="x" size={14} />
            </button>
          )}
        </div>
      </div>
    ) : null,
    document.body,
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      {portal}
    </SnackbarContext.Provider>
  );
}
