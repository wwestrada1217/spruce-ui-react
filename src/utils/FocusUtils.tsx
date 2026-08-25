import { useEffect, useRef, type ReactNode, type RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

function getFocusableElements(element: HTMLElement): HTMLElement[] {
  return Array.from(element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (node) => !node.hasAttribute('hidden') && node.getAttribute('aria-hidden') !== 'true',
  );
}

export interface UseFocusTrapOptions {
  active?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
}

/** Trap, optionally autofocus, and restore focus for an existing overlay root. */
// eslint-disable-next-line react-refresh/only-export-components
export function useFocusTrap(
  rootRef: RefObject<HTMLElement | null>,
  { active = true, autoFocus = true, restoreFocus = true }: UseFocusTrapOptions = {},
): void {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const root = rootRef.current;
    if (!root) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const focusFirst = () => {
      const first = getFocusableElements(root)[0];
      if (first) first.focus({ preventScroll: true });
      else if (root.tabIndex >= 0) root.focus({ preventScroll: true });
    };
    const frame = autoFocus ? requestAnimationFrame(focusFirst) : null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const focusables = getFocusableElements(root);
      if (focusables.length === 0) {
        event.preventDefault();
        if (root.tabIndex >= 0) root.focus({ preventScroll: true });
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeElement = document.activeElement;
      if (event.shiftKey && (activeElement === first || !root.contains(activeElement))) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && (activeElement === last || !root.contains(activeElement))) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    root.addEventListener('keydown', handleKeyDown);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      root.removeEventListener('keydown', handleKeyDown);
      const previous = previousFocusRef.current;
      previousFocusRef.current = null;
      if (restoreFocus && previous?.isConnected && !root.contains(previous)) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [active, autoFocus, restoreFocus, rootRef]);
}

export interface FocusTrapProps {
  children?: ReactNode;
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
  restoreFocus?: boolean;
}

export function FocusTrap({
  children,
  active = true,
  className = '',
  style,
  autoFocus = false,
  restoreFocus = false,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(containerRef, { active, autoFocus, restoreFocus });

  return (
    <div ref={containerRef} className={['sp-focus-trap', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  );
}

export interface AutoFocusProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AutoFocus({ children, className = '', style }: AutoFocusProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const focusable = el.querySelector<HTMLElement>(
      'input, button, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable) {
      focusable.focus();
    }
  }, []);

  return (
    <div ref={containerRef} className={['sp-auto-focus', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  );
}
