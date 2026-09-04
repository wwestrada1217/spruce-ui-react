/* eslint-disable react-refresh/only-export-components */
import './Slide.css';
import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode, type RefCallback } from 'react';
import { useReducedMotion } from './effect-utils.js';

export type SlideDirection = 'up' | 'down' | 'left' | 'right';
export type SlideTrigger = 'hover' | 'mount' | 'viewport';

export interface SlideOptions {
  enabled?: boolean;
  spSlide?: boolean;
  slideDirection?: SlideDirection;
  slideDistance?: number;
  slideTrigger?: SlideTrigger;
  slideDuration?: number;
  slideDelay?: number;
  slideEasing?: string;
}

export interface SlideBinding<T extends HTMLElement = HTMLElement> {
  ref: RefCallback<T>;
  className: string;
}

function offset(direction: SlideDirection, distance: number, inverse = false): string {
  const sign = inverse ? 1 : -1;
  if (direction === 'down') return `translateY(${distance * -sign}px)`;
  if (direction === 'left') return `translateX(${distance * sign}px)`;
  if (direction === 'right') return `translateX(${distance * -sign}px)`;
  return `translateY(${distance * sign}px)`;
}

export function useSlide<T extends HTMLElement = HTMLElement>(options: SlideOptions = {}): SlideBinding<T> {
  const elementRef = useRef<T | null>(null);
  const ref = useCallback<RefCallback<T>>((element) => { elementRef.current = element; }, []);
  const reducedMotion = useReducedMotion();
  const enabled = options.spSlide ?? options.enabled ?? true;

  useEffect(() => {
    const host = elementRef.current;
    if (!host || !enabled || reducedMotion) return;
    const direction = options.slideDirection ?? 'up';
    const distance = Math.max(0, options.slideDistance ?? 8);
    const duration = Math.max(1, options.slideDuration ?? 300);
    const delay = Math.max(0, options.slideDelay ?? 0);
    const easing = options.slideEasing ?? 'cubic-bezier(0.16, 1, 0.3, 1)';
    const trigger = options.slideTrigger ?? 'hover';
    const setTransition = (opacity = false) => {
      host.style.transition = opacity
        ? `transform ${duration}ms ${easing} ${delay}ms, opacity ${duration}ms ease ${delay}ms`
        : `transform ${duration}ms ${easing} ${delay}ms`;
    };

    if (trigger === 'hover') {
      const enter = () => { setTransition(); host.style.transform = offset(direction, distance); };
      const leave = () => { setTransition(); host.style.transform = 'translate(0, 0)'; };
      host.addEventListener('mouseenter', enter, { passive: true });
      host.addEventListener('mouseleave', leave, { passive: true });
      return () => { host.removeEventListener('mouseenter', enter); host.removeEventListener('mouseleave', leave); };
    }

    host.style.transform = offset(direction, distance, true);
    host.style.opacity = '0';
    if (trigger === 'mount') {
      const frame = requestAnimationFrame(() => { setTransition(true); host.style.transform = 'translate(0, 0)'; host.style.opacity = '1'; });
      return () => cancelAnimationFrame(frame);
    }

    if (typeof IntersectionObserver === 'undefined') {
      setTransition(true); host.style.transform = 'translate(0, 0)'; host.style.opacity = '1';
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setTransition(true); host.style.transform = 'translate(0, 0)'; host.style.opacity = '1'; observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(host);
    return () => observer.disconnect();
  }, [enabled, options.slideDelay, options.slideDirection, options.slideDistance, options.slideDuration, options.slideEasing, options.slideTrigger, reducedMotion]);

  return { ref, className: 'sp-slide-host' };
}

export interface SlideProps extends SlideOptions {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Slide({ children, className = '', style, ...options }: SlideProps) {
  const { ref, className: effectClassName } = useSlide<HTMLDivElement>(options);
  return <div ref={ref} className={[effectClassName, className].filter(Boolean).join(' ')} style={style}>{children}</div>;
}
