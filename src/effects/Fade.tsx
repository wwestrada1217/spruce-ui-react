import './Fade.css';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { clamp, useReducedMotion } from './effect-utils.js';

export type FadeDirection = 'up' | 'down' | 'left' | 'right' | 'none';
export type FadeTrigger = 'mount' | 'viewport';

export interface FadeProps {
  children?: ReactNode;
  /** Enable or disable the fade effect. */
  enabled?: boolean;
  /** Angular-compatible alias for enabled. */
  spFade?: boolean;
  /** Direction from which the element enters. */
  fadeDirection?: FadeDirection;
  /** Animation duration in milliseconds. */
  fadeDuration?: number;
  /** Delay before the fade starts in milliseconds. */
  fadeDelay?: number;
  /** Initial travel distance in pixels. */
  fadeDistance?: number;
  /** Trigger on mount or when entering the viewport. */
  fadeTrigger?: FadeTrigger;
  /** IntersectionObserver threshold for viewport triggering. */
  fadeThreshold?: number;
  /** Replay when the element re-enters the viewport. */
  fadeOnce?: boolean;
  /** Backwards-compatible controlled visibility prop. */
  visible?: boolean;
  /** Backwards-compatible shorthand for fadeDuration. */
  duration?: number;
  /** Backwards-compatible shorthand for fadeDirection. */
  direction?: FadeDirection;
  className?: string;
  style?: CSSProperties;
}

function initialTransform(direction: FadeDirection, distance: number): string {
  switch (direction) {
    case 'up': return `translateY(${distance}px)`;
    case 'down': return `translateY(-${distance}px)`;
    case 'left': return `translateX(${distance}px)`;
    case 'right': return `translateX(-${distance}px)`;
    default: return 'none';
  }
}

export function Fade({
  children,
  enabled,
  spFade,
  fadeDirection,
  fadeDuration,
  fadeDelay = 0,
  fadeDistance = 24,
  fadeTrigger = 'viewport',
  fadeThreshold = 0.1,
  fadeOnce = true,
  visible,
  duration,
  direction,
  className = '',
  style,
}: FadeProps) {
  const isEnabled = spFade ?? enabled ?? true;
  const resolvedDirection = fadeDirection ?? direction ?? 'up';
  const resolvedDuration = fadeDuration ?? duration ?? 600;
  const controlled = visible !== undefined;
  const [entered, setEntered] = useState(controlled ? visible : false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isVisible = !isEnabled || reducedMotion || (controlled ? visible : (typeof IntersectionObserver === 'undefined' ? true : entered));
  const distance = Math.max(0, fadeDistance);
  const hiddenTransform = initialTransform(resolvedDirection, distance);

  useEffect(() => {
    if (controlled || !isEnabled || reducedMotion) return;

    if (fadeTrigger === 'mount') {
      const frame = window.requestAnimationFrame(() => setEntered(true));
      return () => window.cancelAnimationFrame(frame);
    }

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setEntered(true);
            if (fadeOnce) observer.disconnect();
          } else if (!fadeOnce) {
            setEntered(false);
          }
        }
      },
      { threshold: clamp(fadeThreshold, 0, 1) },
    );
    if (rootRef.current) observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [controlled, fadeOnce, fadeThreshold, fadeTrigger, isEnabled, reducedMotion]);

  const classes = [
    'sp-fade',
    isEnabled && (isVisible ? 'sp-fade--in' : 'sp-fade--out'),
    isEnabled && resolvedDirection !== 'none' && `sp-fade--${resolvedDirection}`,
    className,
  ].filter(Boolean).join(' ');
  const customStyle = {
    ...style,
    ...(isEnabled && {
      opacity: isVisible ? 1 : 0,
      transform: reducedMotion ? 'none' : (isVisible || resolvedDirection === 'none' ? 'translate(0, 0)' : hiddenTransform),
      transition: reducedMotion ? 'none' : `opacity ${Math.max(1, resolvedDuration)}ms ease-out ${Math.max(0, fadeDelay)}ms, transform ${Math.max(1, resolvedDuration)}ms ease-out ${Math.max(0, fadeDelay)}ms`,
    }),
  } as CSSProperties;

  return <div ref={rootRef} className={classes} style={customStyle}>{children}</div>;
}
