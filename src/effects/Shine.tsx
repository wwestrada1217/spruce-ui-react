import './Shine.css';
import type { CSSProperties, ReactNode } from 'react';
import { clamp } from './effect-utils.js';

export type ShineAngle = number;

export interface ShineProps {
  children?: ReactNode;
  /** Enable or disable the shine effect. */
  enabled?: boolean;
  /** Angular-compatible alias for enabled. */
  spShine?: boolean;
  /** Duration of one shine sweep in milliseconds. */
  shineDuration?: number;
  /** Angle of the shine sweep in degrees. */
  shineAngle?: ShineAngle;
  /** Color of the shine highlight. */
  shineColor?: string;
  /** Width of the shine band as a percentage. */
  shineWidth?: number;
  /** Delay between repeated shine sweeps in milliseconds. */
  shineDelay?: number;
  /** Backwards-compatible shorthand for enabled. */
  active?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Shine({
  children,
  enabled,
  spShine,
  shineDuration = 2000,
  shineAngle = 120,
  shineColor = 'rgba(255, 255, 255, 0.5)',
  shineWidth = 30,
  shineDelay = 1000,
  active,
  className = '',
  style,
}: ShineProps) {
  const isActive = spShine ?? enabled ?? active ?? true;
  const classes = ['sp-shine', isActive && 'sp-shine--active', className].filter(Boolean).join(' ');
  const customStyle = {
    ...style,
    ...(isActive && {
      '--sp-shine-duration': `${Math.max(1, shineDuration)}ms`,
      '--sp-shine-angle': `${shineAngle}deg`,
      '--sp-shine-color': shineColor,
      '--sp-shine-width': `${clamp(shineWidth, 10, 100)}%`,
      '--sp-shine-delay': `${Math.max(0, shineDelay)}ms`,
    }),
  } as CSSProperties;

  return <div className={classes} style={customStyle}>{children}</div>;
}
