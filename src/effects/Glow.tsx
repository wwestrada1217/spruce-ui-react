import './Glow.css';
import type { CSSProperties, ReactNode } from 'react';
import { clamp } from './effect-utils.js';

export type GlowVariant = 'pulse' | 'steady' | 'breathe';

export interface GlowProps {
  children?: ReactNode;
  /** Enable or disable the glow effect. */
  enabled?: boolean;
  /** Angular-compatible alias for enabled. */
  spGlow?: boolean;
  /** Glow color; accepts any CSS color. */
  glowColor?: string;
  /** Glow spread radius in pixels. */
  glowRadius?: number;
  /** Glow intensity from 0 to 1. */
  glowIntensity?: number;
  /** Animation variant. */
  glowVariant?: GlowVariant;
  /** Animation cycle in seconds. */
  glowSpeed?: number;
  /** Backwards-compatible shorthand for glowColor. */
  color?: string;
  /** Backwards-compatible shorthand for glowRadius. */
  blur?: number;
  /** Backwards-compatible pulse toggle. */
  pulse?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Glow({
  children,
  enabled,
  spGlow,
  glowColor,
  glowRadius,
  glowIntensity = 0.6,
  glowVariant,
  glowSpeed = 2,
  color,
  blur,
  pulse,
  className = '',
  style,
}: GlowProps) {
  const isEnabled = spGlow ?? enabled ?? true;
  const variant = glowVariant ?? (pulse === false ? 'steady' : 'pulse');
  const customStyle = {
    ...style,
    ...(isEnabled && {
      '--sp-glow-color': glowColor ?? color ?? 'var(--sp-primary, #3b82f6)',
      '--sp-glow-radius': `${Math.max(0, glowRadius ?? blur ?? 16)}px`,
      '--sp-glow-intensity': clamp(glowIntensity, 0, 1),
      '--sp-glow-speed': `${Math.max(0.01, glowSpeed)}s`,
    }),
  } as CSSProperties;
  const classes = [
    'sp-glow',
    isEnabled && 'sp-glow--active',
    isEnabled && `sp-glow--${variant}`,
    isEnabled && `sp-glow-${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return <div className={classes} style={customStyle}>{children}</div>;
}
