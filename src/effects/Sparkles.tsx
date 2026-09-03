import './Sparkles.css';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { clamp, useReducedMotion } from './effect-utils.js';

export type SparkleColor = 'gold' | 'rainbow' | 'white' | string;
export type SparkleSize = 'sm' | 'md' | 'lg';

export interface SparklesProps {
  children?: ReactNode;
  /** Enable or disable the particle effect. */
  enabled?: boolean;
  /** Angular-compatible alias for enabled. */
  spSparkles?: boolean;
  /** Sparkle palette or a custom CSS color. */
  sparkleColor?: SparkleColor;
  /** Particle size preset. */
  sparkleSize?: SparkleSize;
  /** Number of particles visible at one time. */
  sparkleCount?: number;
  /** Milliseconds between particle spawns. */
  sparkleInterval?: number;
  /** Backwards-compatible shorthand for sparkleColor. */
  color?: SparkleColor;
  /** Backwards-compatible shorthand for sparkleCount. */
  count?: number;
  className?: string;
  style?: CSSProperties;
}

interface SparkleItem {
  id: number;
  size: number;
  fill: string;
  top: number;
  left: number;
  duration: number;
}

const SIZE_MAP: Record<SparkleSize, { min: number; max: number }> = {
  sm: { min: 4, max: 8 },
  md: { min: 8, max: 16 },
  lg: { min: 14, max: 24 },
};

const PALETTES: Record<string, string[]> = {
  gold: ['#fbbf24', '#f59e0b', '#fcd34d', '#fde68a'],
  rainbow: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'],
  white: ['#ffffff', '#f8fafc', '#e2e8f0'],
};

export function Sparkles({
  children,
  enabled,
  spSparkles,
  sparkleColor,
  sparkleSize = 'md',
  sparkleCount,
  sparkleInterval = 400,
  color,
  count,
  className = '',
  style,
}: SparklesProps) {
  const isEnabled = spSparkles ?? enabled ?? true;
  const resolvedColor = sparkleColor ?? color ?? 'gold';
  const resolvedCount = sparkleCount ?? count ?? 6;
  const [sparkles, setSparkles] = useState<SparkleItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isEnabled || reducedMotion) return;

    const palette = PALETTES[resolvedColor] ?? [resolvedColor];
    const range = SIZE_MAP[sparkleSize] ?? SIZE_MAP.md;
    const maxParticles = Math.max(0, Math.floor(resolvedCount));
    if (maxParticles === 0) return;
    const spawn = () => {
      const id = nextId.current++;
      const size = range.min + Math.random() * (range.max - range.min);
      const duration = 500 + Math.random() * 500;
      const sparkle: SparkleItem = {
        id,
        size,
        fill: palette[Math.floor(Math.random() * palette.length)] ?? palette[0],
        top: Math.random() * 92,
        left: Math.random() * 92,
        duration,
      };
      setSparkles((current) => [...current, sparkle].slice(-maxParticles));
      const timer = setTimeout(() => {
        setSparkles((current) => current.filter((item) => item.id !== id));
        timers.current = timers.current.filter((item) => item !== timer);
      }, duration);
      timers.current.push(timer);
    };

    const initialCount = Math.min(maxParticles, 12);
    const initialTimers = Array.from({ length: initialCount }, (_, index) =>
      setTimeout(spawn, index * 80),
    );
    timers.current.push(...initialTimers);
    const interval = window.setInterval(spawn, Math.max(16, sparkleInterval));

    return () => {
      window.clearInterval(interval);
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current = [];
      setSparkles([]);
    };
  }, [isEnabled, reducedMotion, resolvedColor, resolvedCount, sparkleInterval, sparkleSize]);

  return (
    <span className={['sp-sparkles-container', className].filter(Boolean).join(' ')} style={style}>
      {(isEnabled && !reducedMotion ? sparkles : []).map((sparkle) => (
        <svg
          key={sparkle.id}
          className="sp-sparkle-icon"
          viewBox="0 0 24 24"
          width={sparkle.size}
          height={sparkle.size}
          aria-hidden="true"
          focusable="false"
          style={
            {
              top: `${clamp(sparkle.top, 0, 100)}%`,
              left: `${clamp(sparkle.left, 0, 100)}%`,
              '--sp-sparkle-duration': `${sparkle.duration}ms`,
            } as CSSProperties
          }
        >
          <path
            fill={sparkle.fill}
            d="M12 0C12 0 14 8 16 10C18 12 24 12 24 12C24 12 18 12 16 14C14 16 12 24 12 24C12 24 10 16 8 14C6 12 0 12 0 12C0 12 6 12 8 10C10 8 12 0 12 0Z"
          />
        </svg>
      ))}
      <span className="sp-sparkles-child">{children}</span>
    </span>
  );
}
