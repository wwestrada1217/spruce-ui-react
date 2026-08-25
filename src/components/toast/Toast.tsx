/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Toast.css';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type CSSProperties,
  type FocusEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';

// ── Types ──────────────────────────────────────────────────────────────────────

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';
export type ToastStackMode = 'default' | 'collapsible';

export interface ToastConfig {
  message: string;
  variant?: ToastVariant;
  title?: string;
  /** Auto-dismiss duration in ms. Default 5000. Set 0 to disable. */
  duration?: number;
  action?: { label: string; onClick: () => void };
  /** Whether the close button is shown. Default true. */
  dismissible?: boolean;
  /** Use solid coloured background instead of bordered style. */
  solid?: boolean;
}

interface ToastInstance extends Required<Omit<ToastConfig, 'action'>> {
  id: number;
  action: ToastConfig['action'];
  removing?: boolean;
  solid: boolean;
}

// ── Icon helper ────────────────────────────────────────────────────────────────

function iconForVariant(variant: ToastVariant): string {
  switch (variant) {
    case 'success':
      return 'check';
    case 'warning':
      return 'alert-circle';
    case 'danger':
      return 'alert-circle';
    default:
      return 'info';
  }
}

// ── Context ────────────────────────────────────────────────────────────────────

export interface ToastContextValue {
  show: (config: ToastConfig) => number;
  info: (message: string, opts?: Partial<ToastConfig>) => number;
  success: (message: string, opts?: Partial<ToastConfig>) => number;
  warning: (message: string, opts?: Partial<ToastConfig>) => number;
  danger: (message: string, opts?: Partial<ToastConfig>) => number;
  dismiss: (id: number) => void;
  dismissAll: () => void;
  position: ToastPosition;
  stackMode: ToastStackMode;
  setPosition: (position: ToastPosition) => void;
  setStackMode: (mode: ToastStackMode) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Hook to access toast methods. Must be used within a `<ToastProvider>`.
 *
 * @example
 * ```tsx
 * const toast = useToast();
 * toast.success('Saved!');
 * ```
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}

// ── Position helpers ───────────────────────────────────────────────────────────

function isLeftPosition(pos: ToastPosition): boolean {
  return pos === 'top-left' || pos === 'bottom-left';
}

function isRightPosition(pos: ToastPosition): boolean {
  return pos === 'top-right' || pos === 'bottom-right';
}

// ── Provider ───────────────────────────────────────────────────────────────────

export interface ToastProviderProps {
  children: ReactNode;
  /** Position of the toast container. Default "top-right". */
  position?: ToastPosition;
  /** Initial stack behavior. The hook can change it at runtime. */
  stackMode?: ToastStackMode;
}

/**
 * Provides the toast context and renders the toast container via portal.
 *
 * @example
 * ```tsx
 * <ToastProvider position="top-right">
 *   <App />
 * </ToastProvider>
 * ```
 */
export function ToastProvider({ children, position = 'top-right', stackMode = 'default' }: ToastProviderProps) {
  const { t } = useI18n();
  const [toasts, setToasts] = useState<ToastInstance[]>([]);
  const [positionOverride, setPositionOverride] = useState<ToastPosition>();
  const [stackModeOverride, setStackModeOverride] = useState<ToastStackMode>();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const nextIdRef = useRef(0);
  const timersRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const removalTimersRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastsRef = useRef<ToastInstance[]>([]);
  useEffect(() => {
    toastsRef.current = toasts;
  }, [toasts]);

  const currentPosition = positionOverride ?? position;
  const currentStackMode = stackModeOverride ?? stackMode;

  // Clean up all timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    const removalTimers = removalTimersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
      removalTimers.forEach((timer) => clearTimeout(timer));
      removalTimers.clear();
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const dismiss = useCallback((id: number) => {
    // Clear auto-dismiss timer
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }

    const toast = toastsRef.current.find((item) => item.id === id);
    if (!toast || toast.removing) return;

    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, removing: true } : t)));

    // Remove after exit animation completes
    const removalTimer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      removalTimersRef.current.delete(id);
    }, 300);
    removalTimersRef.current.set(id, removalTimer);
  }, []);

  const show = useCallback(
    (config: ToastConfig): number => {
      const id = nextIdRef.current++;
      const instance: ToastInstance = {
        id,
        message: config.message,
        variant: config.variant ?? 'info',
        title: config.title ?? '',
        duration: config.duration ?? 5000,
        dismissible: config.dismissible ?? true,
        action: config.action,
        solid: config.solid ?? false,
      };

      setToasts((prev) => [...prev, instance]);

      if (instance.duration > 0) {
        const timer = setTimeout(() => dismiss(id), instance.duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [dismiss],
  );

  const info = useCallback(
    (message: string, opts?: Partial<ToastConfig>): number =>
      show({ ...opts, message, variant: 'info' }),
    [show],
  );

  const success = useCallback(
    (message: string, opts?: Partial<ToastConfig>): number =>
      show({ ...opts, message, variant: 'success' }),
    [show],
  );

  const warning = useCallback(
    (message: string, opts?: Partial<ToastConfig>): number =>
      show({ ...opts, message, variant: 'warning' }),
    [show],
  );

  const danger = useCallback(
    (message: string, opts?: Partial<ToastConfig>): number =>
      show({ ...opts, message, variant: 'danger' }),
    [show],
  );

  const dismissAll = useCallback(() => {
    for (const toast of toastsRef.current) dismiss(toast.id);
  }, [dismiss]);

  const setPosition = useCallback((next: ToastPosition) => setPositionOverride(next), []);
  const setStackMode = useCallback((next: ToastStackMode) => setStackModeOverride(next), []);

  const contextValue: ToastContextValue = {
    show,
    info,
    success,
    warning,
    danger,
    dismiss,
    dismissAll,
    position: currentPosition,
    stackMode: currentStackMode,
    setPosition,
    setStackMode,
  };

  const handleAction = (toast: ToastInstance) => {
    toast.action?.onClick();
    dismiss(toast.id);
  };

  const isExpanded = hovered || focused;
  const activeToasts = toasts.filter((toast) => !toast.removing);
  const containerClass = [
    'sp-toast-container',
    `sp-toast-container--${currentPosition}`,
    currentStackMode === 'collapsible' && 'sp-toast-container--collapsible',
    isExpanded && 'sp-toast-container--expanded',
  ].filter(Boolean).join(' ');

  const portal = createPortal(
    <div
      className={containerClass}
      aria-live="polite"
      aria-atomic="false"
      onMouseEnter={() => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        setHovered(true);
      }}
      onMouseLeave={() => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => setHovered(false), 150);
      }}
      onFocus={() => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        setFocused(true);
      }}
      onBlur={(event: FocusEvent<HTMLDivElement>) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) setFocused(false);
      }}
    >
      {toasts.map((toast) => {
        const classes = [
          'sp-toast',
          `sp-toast--${toast.variant}`,
          toast.solid ? 'sp-toast--solid' : '',
          toast.removing ? 'sp-toast--removing' : '',
          isLeftPosition(currentPosition) ? 'sp-toast--enter-left' : '',
          isRightPosition(currentPosition) ? 'sp-toast--enter-right' : '',
          currentPosition === 'top-center' ? 'sp-toast--enter-center-top' : '',
          currentPosition === 'bottom-center' ? 'sp-toast--enter-center-bottom' : '',
        ]
          .filter(Boolean)
          .join(' ');

        const activeIndex = activeToasts.findIndex((item) => item.id === toast.id);
        const depth = toast.removing || activeIndex < 0 ? 0 : activeToasts.length - 1 - activeIndex;
        return (
          <div
            key={toast.id}
            className="sp-toast-wrapper"
            style={{ '--toast-depth': depth, '--toast-z-index': 100 - depth } as CSSProperties}
          >
            <div className={classes} role="alert">
            <Icon
              name={iconForVariant(toast.variant)}
              size={18}
              className="sp-toast__icon"
            />
            <div className="sp-toast__body">
              {toast.title && <div className="sp-toast__title">{toast.title}</div>}
              <div className="sp-toast__message">{toast.message}</div>
              {toast.action && (
                  <button
                    type="button"
                  className="sp-toast__action"
                  onClick={() => handleAction(toast)}
                >
                  {toast.action.label}
                </button>
              )}
            </div>
            {toast.dismissible && (
              <button
                type="button"
                className="sp-toast__close"
                aria-label={t('dismissNotification')}
                onClick={() => dismiss(toast.id)}
              >
                <Icon name="x" size={14} />
              </button>
            )}
            </div>
          </div>
        );
      })}
    </div>,
    document.body,
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {portal}
    </ToastContext.Provider>
  );
}
