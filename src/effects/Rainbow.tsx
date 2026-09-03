import './Rainbow.css';
import type { CSSProperties, ReactNode } from 'react';

export type RainbowMode = 'text' | 'background' | 'border';

export interface RainbowProps {
  children?: ReactNode;
  /** Enable or disable the gradient effect. */
  enabled?: boolean;
  /** Angular-compatible alias for enabled. */
  spRainbow?: boolean;
  /** Where to apply the rainbow gradient. */
  rainbowMode?: RainbowMode;
  /** Seconds for one complete gradient cycle. */
  rainbowSpeed?: number;
  /** Custom gradient colors. Two or more colors are required. */
  rainbowColors?: string[];
  /** Whether the gradient animates. */
  rainbowAnimate?: boolean;
  /** Backwards-compatible animation prop. */
  animated?: boolean;
  /** Border width used by border mode, in pixels. */
  borderWidth?: number;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444',
];

export function Rainbow({
  children,
  enabled,
  spRainbow,
  rainbowMode = 'text',
  rainbowSpeed = 3,
  rainbowColors = [],
  rainbowAnimate,
  animated,
  borderWidth = 2,
  className = '',
  style,
}: RainbowProps) {
  const isEnabled = spRainbow ?? enabled ?? true;
  const isAnimated = rainbowAnimate ?? animated ?? true;
  const colors = rainbowColors.length >= 2 ? rainbowColors : DEFAULT_COLORS;
  const classes = [
    'sp-rainbow',
    isEnabled && `sp-rainbow--${rainbowMode}`,
    isEnabled && isAnimated && 'sp-rainbow--animated',
    className,
  ].filter(Boolean).join(' ');
  const customStyle = {
    ...style,
    ...(isEnabled && {
      '--sp-rainbow-gradient': `linear-gradient(90deg, ${colors.join(', ')})`,
      '--sp-rainbow-speed': `${Math.max(0.01, rainbowSpeed)}s`,
      '--sp-rainbow-border-width': `${Math.max(0, borderWidth)}px`,
    }),
  } as CSSProperties;

  return (
    <div className={classes} style={customStyle}>
      {children}
    </div>
  );
}
