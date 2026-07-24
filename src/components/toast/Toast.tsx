import './Toast.css';
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

// ── Types ──────────────────────────────────────────────────────────────────────

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

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
export function ToastProvider({ children, position = 'top-right' }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);
  const nextIdRef = useRef(0);
  const timersRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  const dismiss = useCallback((id: number) => {
    // Clear auto-dismiss timer
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }

    // Mark as removing for exit animation
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, removing: true } : t)));

    // Remove after exit animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
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
    setToasts((prev) => {
      for (const t of prev) {
        dismiss(t.id);
      }
      return prev;
    });
  }, [dismiss]);

  const contextValue: ToastContextValue = {
    show,
    info,
    success,
    warning,
    danger,
    dismiss,
    dismissAll,
  };

  const handleAction = (toast: ToastInstance) => {
    toast.action?.onClick();
    dismiss(toast.id);
  };

  const containerClass = [
    'sp-toast-container',
    `sp-toast-container--${position}`,
  ].join(' ');

  const portal = createPortal(
    <div className={containerClass} aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => {
        const classes = [
          'sp-toast',
          `sp-toast--${toast.variant}`,
          toast.solid ? 'sp-toast--solid' : '',
          toast.removing ? 'sp-toast--removing' : '',
          isLeftPosition(position) ? 'sp-toast--enter-left' : '',
          isRightPosition(position) ? 'sp-toast--enter-right' : '',
          position === 'top-center' ? 'sp-toast--enter-center-top' : '',
          position === 'bottom-center' ? 'sp-toast--enter-center-bottom' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div key={toast.id} className={classes} role="alert">
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
                  className="sp-toast__action"
                  onClick={() => handleAction(toast)}
                >
                  {toast.action.label}
                </button>
              )}
            </div>
            {toast.dismissible && (
              <button
                className="sp-toast__close"
                aria-label="Dismiss notification"
                onClick={() => dismiss(toast.id)}
              >
                <Icon name="x" size={14} />
              </button>
            )}
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
