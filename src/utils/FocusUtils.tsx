import { useEffect, useRef, type ReactNode } from 'react';

export interface FocusTrapProps {
  children?: ReactNode;
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function FocusTrap({ children, active = true, className = '', style }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const el = containerRef.current;
    if (!el) return;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      const focusables = Array.from(el!.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }

    el.addEventListener('keydown', handleKeyDown);
    return () => el.removeEventListener('keydown', handleKeyDown);
  }, [active]);

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
