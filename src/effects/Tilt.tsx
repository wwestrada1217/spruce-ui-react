/* eslint-disable react-refresh/only-export-components */
import './Tilt.css';
import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode, type RefCallback } from 'react';
import { useReducedMotion } from './effect-utils.js';

export type TiltAxis = 'both' | 'x' | 'y';

export interface TiltOptions {
  enabled?: boolean;
  spTilt?: boolean;
  tiltMax?: number;
  tiltPerspective?: number;
  tiltScale?: number;
  tiltSpeed?: number;
  tiltAxis?: TiltAxis;
  tiltReverse?: boolean;
  tiltGlare?: boolean;
  tiltGlareMaxOpacity?: number;
  tiltGlareColor?: string;
}

export interface TiltBinding<T extends HTMLElement = HTMLElement> {
  ref: RefCallback<T>;
  className: string;
}

export function useTilt<T extends HTMLElement = HTMLElement>(options: TiltOptions = {}): TiltBinding<T> {
  const elementRef = useRef<T | null>(null);
  const ref = useCallback<RefCallback<T>>((element) => { elementRef.current = element; }, []);
  const frame = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const enabled = options.spTilt ?? options.enabled ?? true;

  useEffect(() => {
    const host = elementRef.current;
    if (!host || !enabled || reducedMotion) return;
    const max = options.tiltMax ?? 15;
    const perspective = Math.max(1, options.tiltPerspective ?? 1000);
    const scale = options.tiltScale ?? 1.03;
    const speed = Math.max(0, options.tiltSpeed ?? 400);
    const axis = options.tiltAxis ?? 'both';
    const reverse = options.tiltReverse ? -1 : 1;
    let glare: HTMLSpanElement | null = null;

    const reset = () => {
      host.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
      host.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      if (glare) glare.style.opacity = '0';
    };
    const update = (event: MouseEvent) => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      let rotateX = y * max * -2 * reverse;
      let rotateY = x * max * 2 * reverse;
      if (axis === 'x') rotateY = 0;
      if (axis === 'y') rotateX = 0;
      host.style.transform = `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
      if (glare) {
        const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
        const opacity = Math.min(Math.hypot(x, y) * 2 * (options.tiltGlareMaxOpacity ?? 0.35), options.tiltGlareMaxOpacity ?? 0.35);
        glare.style.transform = `rotate(${angle.toFixed(1)}deg) translate(-50%, -50%)`;
        glare.style.opacity = opacity.toFixed(2);
      }
    };
    const onEnter = () => {
      host.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
      if (options.tiltGlare) {
        glare = document.createElement('span');
        glare.className = 'sp-tilt-glare';
        glare.style.background = `linear-gradient(0deg, transparent 0%, ${options.tiltGlareColor ?? 'rgb(255 255 255 / 80%)'} 100%)`;
        host.appendChild(glare);
      }
    };
    const onMove = (event: MouseEvent) => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => update(event));
    };
    const onLeave = () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      reset();
      glare?.remove();
      glare = null;
    };

    host.classList.add('sp-tilt-host');
    host.addEventListener('mouseenter', onEnter, { passive: true });
    host.addEventListener('mousemove', onMove, { passive: true });
    host.addEventListener('mouseleave', onLeave, { passive: true });
    return () => {
      host.removeEventListener('mouseenter', onEnter);
      host.removeEventListener('mousemove', onMove);
      host.removeEventListener('mouseleave', onLeave);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      glare?.remove();
      host.style.removeProperty('transform');
      host.style.removeProperty('transition');
    };
  }, [enabled, options.tiltAxis, options.tiltGlare, options.tiltGlareColor, options.tiltGlareMaxOpacity, options.tiltMax, options.tiltPerspective, options.tiltReverse, options.tiltScale, options.tiltSpeed, reducedMotion]);

  return { ref, className: ['sp-tilt-host', enabled && !reducedMotion && 'sp-tilt-host--active'].filter(Boolean).join(' ') };
}

export interface TiltProps extends TiltOptions {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Tilt({ children, className = '', style, ...options }: TiltProps) {
  const { ref, className: effectClassName } = useTilt<HTMLDivElement>(options);
  return <div ref={ref} className={[effectClassName, className].filter(Boolean).join(' ')} style={style}>{children}</div>;
}
