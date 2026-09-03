import './Aura.css';
import type { CSSProperties, ReactNode } from 'react';
import { useReducedMotion } from './effect-utils.js';

export interface AuraProps {
  children?: ReactNode;
  /** Enable or disable the aura effect. */
  enabled?: boolean;
  /** Angular-compatible alias for enabled. */
  spAura?: boolean;
  /** Custom gradient colors. Defaults to a full rainbow. */
  auraColors?: string[];
  /** Rotation speed in seconds for one full turn. */
  auraSpeed?: number;
  /** Thickness of the gradient ring in pixels. */
  auraWidth?: number;
  /** Blur radius of the outer glow in pixels. */
  auraBlur?: number;
  /** Intensity/opacity of the outer glow from 0 to 1. */
  auraIntensity?: number;
  /** Whether the ring rotates. */
  auraAnimate?: boolean;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_GRADIENT = '#ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ec4899, #ef4444';

function resolveGradient(colors: string[]): string {
  if (colors.length < 2) return DEFAULT_GRADIENT;
  const closed = [...colors];
  if (closed[0] !== closed[closed.length - 1]) closed.push(closed[0]);
  return closed.join(', ');
}

export function Aura({
  children,
  enabled,
  spAura,
  auraColors = [],
  auraSpeed = 4,
  auraWidth = 2,
  auraBlur = 12,
  auraIntensity = 0.6,
  auraAnimate = true,
  className = '',
  style,
}: AuraProps) {
  const isEnabled = spAura ?? enabled ?? true;
  const reducedMotion = useReducedMotion();
  const classes = [
    isEnabled && 'sp-aura',
    isEnabled && auraAnimate && 'sp-aura-animated',
    isEnabled && reducedMotion && 'sp-aura--reduced-motion',
    className,
  ].filter(Boolean).join(' ');
  const customStyle = {
    ...style,
    ...(isEnabled && {
      '--sp-aura-gradient': resolveGradient(auraColors),
      '--sp-aura-speed': `${Math.max(0.01, auraSpeed)}s`,
      '--sp-aura-width': `${Math.max(0, auraWidth)}px`,
      '--sp-aura-blur': `${Math.max(0, auraBlur)}px`,
      '--sp-aura-intensity': Math.min(1, Math.max(0, auraIntensity)),
    }),
  } as CSSProperties;

  return (
    <div className={classes} style={customStyle}>
      {children}
      {isEnabled && <div className="sp-aura-cover" aria-hidden="true" />}
    </div>
  );
}
