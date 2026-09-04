/* eslint-disable react-refresh/only-export-components */
import './NumberTicker.css';
import { useCallback, useEffect, useRef, type CSSProperties, type RefCallback } from 'react';
import { useReducedMotion } from './effect-utils.js';

export type NumberTickerMode = 'count' | 'flip';

export interface NumberCounterOptions {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: boolean;
}

export interface NumberCounterBinding<T extends HTMLElement = HTMLElement> {
  ref: RefCallback<T>;
  ariaLabel: string;
}

function formatNumber(value: number, decimals: number, separator: boolean): string {
  const fixed = value.toFixed(decimals);
  if (!separator) return fixed;
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function easeOutCubic(progress: number): number { return 1 - Math.pow(1 - progress, 3); }

/** Animates an element's text content when its numeric value changes. */
export function useNumberCounter<T extends HTMLElement = HTMLElement>(options: NumberCounterOptions): NumberCounterBinding<T> {
  const elementRef = useRef<T | null>(null);
  const ref = useCallback<RefCallback<T>>((element) => { elementRef.current = element; }, []);
  const current = useRef(0);
  const firstRender = useRef(true);
  const frame = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const decimals = options.decimals ?? 0;
  const separator = options.separator ?? true;
  const targetLabel = `${options.prefix ?? ''}${formatNumber(options.value, decimals, separator)}${options.suffix ?? ''}`;

  useEffect(() => {
    const host = elementRef.current;
    if (!host) return;
    const target = options.value;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    if (firstRender.current || reducedMotion) {
      current.current = target;
      host.textContent = targetLabel;
      firstRender.current = false;
      return;
    }
    const start = current.current;
    const startTime = performance.now();
    const duration = Math.max(100, options.duration ?? 1000);
    const step = (timestamp: number) => {
      const progress = Math.min(1, (timestamp - startTime) / duration);
      current.current = start + (target - start) * easeOutCubic(progress);
      host.textContent = `${options.prefix ?? ''}${formatNumber(current.current, decimals, separator)}${options.suffix ?? ''}`;
      if (progress < 1) frame.current = requestAnimationFrame(step);
      else { current.current = target; host.textContent = targetLabel; frame.current = null; }
    };
    frame.current = requestAnimationFrame(step);
    return () => { if (frame.current !== null) cancelAnimationFrame(frame.current); };
  }, [decimals, options.duration, options.prefix, options.suffix, options.value, reducedMotion, separator, targetLabel]);

  useEffect(() => () => { if (frame.current !== null) cancelAnimationFrame(frame.current); }, []);
  return { ref, ariaLabel: targetLabel };
}

export interface NumberCounterProps extends NumberCounterOptions {
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

export function NumberCounter({ className = '', style, ariaLabel, ...options }: NumberCounterProps) {
  const { ref, ariaLabel: effectLabel } = useNumberCounter<HTMLSpanElement>(options);
  return <span ref={ref} className={['sp-number-counter', className].filter(Boolean).join(' ')} style={style} aria-live="polite" aria-label={ariaLabel ?? effectLabel} />;
}

export interface NumberTickerProps extends NumberCounterOptions {
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

/** Displays a numeric value as animated vertical odometer-style digit reels. */
export function NumberTicker({ value, duration = 1000, decimals = 0, prefix = '', suffix = '', separator = true, className = '', style, ariaLabel }: NumberTickerProps) {
  const reducedMotion = useReducedMotion();
  const formatted = formatNumber(value, decimals, separator);
  return (
    <span className={['sp-number-ticker', reducedMotion && 'sp-number-ticker--reduced-motion', className].filter(Boolean).join(' ')} style={style} role="text" aria-label={ariaLabel ?? `${prefix}${formatted}${suffix}`}>
      <span className="sp-ticker__prefix">{prefix}</span>
      <span className="sp-ticker__reels" aria-hidden="true">
        {formatted.split('').map((character, index) => (
          /\d/.test(character)
            ? <span className="sp-ticker__col" key={index}><span className="sp-ticker__reel" style={{ transform: `translateY(-${Number(character) * 10}%)`, transitionDuration: `${Math.max(1, duration)}ms` }}>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => <span className="sp-ticker__digit" key={digit}>{digit}</span>)}</span></span>
            : <span className="sp-ticker__char" key={index}>{character}</span>
        ))}
      </span>
      <span className="sp-ticker__suffix">{suffix}</span>
    </span>
  );
}
