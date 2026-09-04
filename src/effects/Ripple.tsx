/* eslint-disable react-refresh/only-export-components */
import './Ripple.css';
import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode, type RefCallback } from 'react';

export interface RippleOptions {
  /** Enable or disable the ripple effect. */
  enabled?: boolean;
  /** Angular-compatible alias for enabled. */
  spRipple?: boolean;
  /** Ripple color. Defaults to the host's current color. */
  rippleColor?: string;
  /** Ripple animation duration in milliseconds. */
  rippleDuration?: number;
  /** Start the ripple from the host's geometric center. */
  rippleCentered?: boolean;
  /** Allow the wave to extend outside the host. */
  rippleUnbounded?: boolean;
  /** Disable ripple interaction while leaving the host styled. */
  rippleDisabled?: boolean;
}

export interface RippleBinding<T extends HTMLElement = HTMLElement> {
  ref: RefCallback<T>;
  className: string;
}

function addRipple(host: HTMLElement, event: PointerEvent, options: RippleOptions, nextId: () => number): void {
  if (event.button !== 0 && event.pointerType === 'mouse') return;
  if (host.hasAttribute('disabled') || host.getAttribute('aria-disabled') === 'true') return;

  const rect = host.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const centered = options.rippleCentered ?? false;
  const x = centered ? rect.width / 2 : event.clientX - rect.left;
  const y = centered ? rect.height / 2 : event.clientY - rect.top;
  const radius = Math.max(
    Math.hypot(x, y),
    Math.hypot(rect.width - x, y),
    Math.hypot(x, rect.height - y),
    Math.hypot(rect.width - x, rect.height - y),
  );
  const duration = Math.max(1, options.rippleDuration ?? 500);
  const wave = document.createElement('span');
  wave.className = 'sp-ripple-wave';
  wave.dataset.rippleId = String(nextId());
  wave.style.width = `${radius * 2}px`;
  wave.style.height = `${radius * 2}px`;
  wave.style.left = `${x - radius}px`;
  wave.style.top = `${y - radius}px`;
  wave.style.animationDuration = `${duration}ms`;
  if (options.rippleColor) wave.style.setProperty('--sp-ripple-color-override', options.rippleColor);
  host.appendChild(wave);

  const fade = () => {
    if (!wave.isConnected || wave.classList.contains('sp-ripple-wave--fading')) return;
    wave.classList.add('sp-ripple-wave--fading');
    window.setTimeout(() => wave.remove(), 250);
  };
  window.setTimeout(fade, duration);
}

/** Adds Angular-compatible ripple behavior to any existing HTMLElement. */
export function useRipple<T extends HTMLElement = HTMLElement>(options: RippleOptions = {}): RippleBinding<T> {
  const elementRef = useRef<T | null>(null);
  const ref = useCallback<RefCallback<T>>((element) => { elementRef.current = element; }, []);
  const idRef = useRef(0);
  const enabled = options.spRipple ?? options.enabled ?? true;
  const rippleCentered = options.rippleCentered ?? false;
  const rippleColor = options.rippleColor;
  const rippleDisabled = options.rippleDisabled ?? false;
  const rippleDuration = options.rippleDuration ?? 500;
  const rippleUnbounded = options.rippleUnbounded ?? false;

  useEffect(() => {
    const host = elementRef.current;
    if (!host) return;
    host.classList.add('sp-ripple-host');
    host.classList.toggle('sp-ripple--unbounded', rippleUnbounded);

    const onPointerDown = (event: PointerEvent) => {
      if (!enabled || rippleDisabled) return;
      addRipple(host, event, { rippleCentered, rippleColor, rippleDuration }, () => idRef.current++);
    };
    const onPointerRelease = () => {
      host.querySelectorAll<HTMLElement>('.sp-ripple-wave').forEach((wave) => {
        if (wave.classList.contains('sp-ripple-wave--fading')) return;
        wave.classList.add('sp-ripple-wave--fading');
        window.setTimeout(() => wave.remove(), 250);
      });
    };
    host.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerRelease, { passive: true });
    window.addEventListener('pointercancel', onPointerRelease, { passive: true });

    return () => {
      host.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerRelease);
      window.removeEventListener('pointercancel', onPointerRelease);
      host.querySelectorAll('.sp-ripple-wave').forEach((wave) => wave.remove());
    };
  }, [enabled, rippleCentered, rippleColor, rippleDisabled, rippleDuration, rippleUnbounded]);

  return {
    ref,
    className: ['sp-ripple-host', rippleUnbounded && 'sp-ripple--unbounded'].filter(Boolean).join(' '),
  };
}

export interface RippleProps extends RippleOptions {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Convenience wrapper for adding ripple feedback around any surface. */
export function Ripple({ children, className = '', style, ...options }: RippleProps) {
  const { ref, className: effectClassName } = useRipple<HTMLDivElement>(options);
  return <div ref={ref} className={[effectClassName, className].filter(Boolean).join(' ')} style={style}>{children}</div>;
}
