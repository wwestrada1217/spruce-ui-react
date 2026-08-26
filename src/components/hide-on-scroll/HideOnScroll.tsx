/* eslint-disable react-refresh/only-export-components */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import './HideOnScroll.css';

export interface HideOnScrollOptions {
  scroller?: HTMLElement | null;
  disabled?: boolean;
  threshold?: number;
  idleReveal?: number;
  onHiddenChange?: (hidden: boolean) => void;
}

export interface HideOnScrollResult {
  hidden: boolean;
  ref: (element: HTMLElement | null) => void;
}

function resolveScrollParent(element: HTMLElement | null): HTMLElement | null {
  if (typeof window === 'undefined' || !element) return null;
  let current = element.parentElement;
  while (current) {
    const style = window.getComputedStyle(current);
    if (/(auto|scroll|overlay)/.test(style.overflowY) && current.scrollHeight > current.clientHeight) return current;
    current = current.parentElement;
  }
  return null;
}

export function useHideOnScroll({ scroller, disabled = false, threshold = 8, idleReveal = 200, onHiddenChange }: HideOnScrollOptions = {}): HideOnScrollResult {
  const elementRef = useRef<HTMLElement | null>(null);
  const [hidden, setHidden] = useState(false);
  const hiddenRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const idleRef = useRef<number | null>(null);
  const lastPosition = useRef(0);
  const pointerDown = useRef(false);

  const setHiddenState = useCallback((next: boolean) => {
    if (hiddenRef.current === next) return;
    hiddenRef.current = next;
    setHidden(next);
    onHiddenChange?.(next);
  }, [onHiddenChange]);

  const ref = useCallback((element: HTMLElement | null) => { elementRef.current = element; }, []);

  useEffect(() => {
    if (disabled || typeof window === 'undefined') {
      if (typeof window === 'undefined') return undefined;
      const reset = window.setTimeout(() => setHiddenState(false), 0);
      return () => window.clearTimeout(reset);
    }
    const target = scroller ?? resolveScrollParent(elementRef.current);
    const scrollTarget: HTMLElement | Window = target ?? window;
    const getPosition = () => target ? target.scrollTop : window.scrollY;
    lastPosition.current = getPosition();
    const reveal = () => setHiddenState(false);
    const schedule = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (pointerDown.current) return;
        const position = getPosition();
        const delta = position - lastPosition.current;
        lastPosition.current = position;
        if (position <= 0 || Math.abs(delta) < threshold) return;
        setHiddenState(delta > 0);
        if (idleRef.current !== null) window.clearTimeout(idleRef.current);
        idleRef.current = window.setTimeout(reveal, idleReveal);
      });
    };
    const handlePointerDown = (event: PointerEvent) => {
      const targetElement = event.target as HTMLElement | null;
      const scrollbar = targetElement && targetElement === elementRef.current && event.clientX > targetElement.clientWidth;
      pointerDown.current = Boolean(scrollbar);
    };
    const handlePointerUp = () => { pointerDown.current = false; lastPosition.current = getPosition(); };
    const handleFocusIn = () => reveal();
    scrollTarget.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });
    window.addEventListener('blur', handlePointerUp);
    window.addEventListener('focusin', handleFocusIn);
    return () => {
      scrollTarget.removeEventListener('scroll', schedule);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('blur', handlePointerUp);
      window.removeEventListener('focusin', handleFocusIn);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (idleRef.current !== null) window.clearTimeout(idleRef.current);
    };
  }, [disabled, idleReveal, scroller, setHiddenState, threshold]);

  return { hidden, ref };
}

export interface HideOnScrollProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, HideOnScrollOptions {
  children?: ReactNode;
}

export function HideOnScroll({ children, className, style, onHiddenChange, scroller, disabled, threshold, idleReveal, ...props }: HideOnScrollProps) {
  const { hidden, ref } = useHideOnScroll({ scroller, disabled, threshold, idleReveal, onHiddenChange });
  const hiddenStyle: CSSProperties = {
    ...style,
    transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
    transition: 'transform var(--sp-duration-normal, 200ms) var(--sp-ease-out)',
    willChange: 'transform',
  };
  return <div {...props} ref={ref} className={['sp-hide-on-scroll', hidden ? 'sp-hide-on-scroll--hidden' : '', className].filter(Boolean).join(' ')} style={hiddenStyle} data-hidden={hidden ? 'true' : 'false'}>{children}</div>;
}
