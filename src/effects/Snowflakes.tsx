import './Snowflakes.css';
import { useMemo, type CSSProperties, type ReactNode } from 'react';
import { clamp, useReducedMotion } from './effect-utils.js';

export type SnowflakeSize = 'sm' | 'md' | 'lg' | 'mixed';

export interface SnowflakesProps {
  children?: ReactNode;
  /** Enable or disable the snowflakes effect. */
  enabled?: boolean;
  /** Angular-compatible alias for enabled. */
  spSnowflakes?: boolean;
  /** Number of active falling snowflakes. */
  snowflakeCount?: number;
  /** Backwards-compatible count alias. */
  count?: number;
  /** Snowflake size preset. */
  snowflakeSize?: SnowflakeSize;
  /** Backwards-compatible size alias. */
  size?: SnowflakeSize;
  /** Fall speed multiplier. */
  snowflakeSpeed?: number;
  /** Backwards-compatible speed alias. */
  speed?: number;
  /** Snowflake color. */
  snowflakeColor?: string;
  /** Backwards-compatible color alias. */
  color?: string;
  /** Horizontal wind drift force from -5 to 5. */
  wind?: number;
  className?: string;
  style?: CSSProperties;
}

interface Snowflake {
  id: number;
  size: number;
  left: number;
  duration: number;
  sway: number;
  opacity: number;
  delay: number;
  height: number;
}

function pseudoRandom(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

const SIZE_RANGES: Record<SnowflakeSize, { min: number; max: number }> = {
  sm: { min: 4, max: 8 },
  md: { min: 8, max: 14 },
  lg: { min: 14, max: 22 },
  mixed: { min: 4, max: 18 },
};

function resolveValue<T>(primary: T, alias: T, defaultValue: T): T {
  return alias !== defaultValue ? alias : primary;
}

export function Snowflakes({
  children,
  enabled,
  spSnowflakes,
  snowflakeCount = 30,
  count = 30,
  snowflakeSize = 'mixed',
  size = 'mixed',
  snowflakeSpeed = 1,
  speed = 1,
  snowflakeColor = '#ffffff',
  color = '#ffffff',
  wind = 1,
  className = '',
  style,
}: SnowflakesProps) {
  const isEnabled = spSnowflakes ?? enabled ?? true;
  const resolvedCount = Math.max(1, Math.floor(resolveValue(snowflakeCount, count, 30)));
  const resolvedSize = resolveValue(snowflakeSize, size, 'mixed');
  const resolvedSpeed = Math.max(0.2, resolveValue(snowflakeSpeed, speed, 1));
  const resolvedColor = resolveValue(snowflakeColor, color, '#ffffff');
  const reducedMotion = useReducedMotion();
  const snowflakes = useMemo<Snowflake[]>(() => {
    const range = SIZE_RANGES[resolvedSize] ?? SIZE_RANGES.mixed;
    return Array.from({ length: resolvedCount }, (_, id) => {
      const flakeSize = range.min + pseudoRandom(id + 1) * (range.max - range.min);
      const duration = 7000 / resolvedSpeed + pseudoRandom(id + 2) * 4000;
      return {
        id,
        size: flakeSize,
        left: pseudoRandom(id + 3) * 100,
        duration,
        sway: wind * 15 + (pseudoRandom(id + 4) * 20 - 10),
        opacity: 0.4 + pseudoRandom(id + 5) * 0.55,
        delay: pseudoRandom(id + 6) * duration,
        height: 220,
      };
    });
  }, [resolvedCount, resolvedSize, resolvedSpeed, wind]);

  const classes = [
    'sp-snow-host',
    reducedMotion && 'sp-snow-host--reduced-motion',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style}>
      {isEnabled && snowflakes.map((flake) => (
        <span
          key={flake.id}
          className="sp-snowflake-particle"
          aria-hidden="true"
          style={{
            left: `${clamp(flake.left, 0, 100)}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            background: resolvedColor,
            boxShadow: `0 0 ${flake.size * 0.6}px ${resolvedColor}`,
            '--sp-snow-height': `${flake.height}px`,
            '--sp-snow-sway': `${flake.sway}px`,
            '--sp-snow-duration': `${flake.duration}ms`,
            '--sp-snow-opacity': flake.opacity,
            animationDelay: `-${flake.delay}ms`,
          } as CSSProperties}
        />
      ))}
      {children}
    </div>
  );
}
