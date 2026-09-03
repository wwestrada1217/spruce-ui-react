import './FluidFill.css';
import { useMemo, type CSSProperties, type ReactNode } from 'react';
import { clamp, useReducedMotion } from './effect-utils.js';

export interface FluidFillProps {
  children?: ReactNode;
  /** Enable or disable the fluid fill animation. */
  enabled?: boolean;
  /** Angular-compatible alias for enabled. */
  spFluidFill?: boolean;
  /** Fluid fill level percentage from 0 to 100. */
  fluidLevel?: number;
  /** Main fluid color or gradient string. */
  fluidColor?: string;
  /** Optional secondary wave color for depth blending. */
  secondaryColor?: string | null;
  /** Wave animation speed multiplier. */
  waveSpeed?: number;
  /** Wave oscillation height amplitude in pixels. */
  waveHeight?: number;
  /** Show rising ambient bubbles inside the fluid. */
  showBubbles?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  riseHeight: number;
}

function pseudoRandom(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function wavePath(waveHeight: number, secondary: boolean): string {
  const controlY = secondary ? waveHeight * 1.8 : 0;
  return `M 0 ${waveHeight} Q 100 ${controlY}, 200 ${waveHeight} T 400 ${waveHeight} T 600 ${waveHeight} T 800 ${waveHeight} V ${waveHeight * 2.5} H 0 Z`;
}

export function FluidFill({
  children,
  enabled,
  spFluidFill,
  fluidLevel = 65,
  fluidColor = 'var(--sp-primary, #3b82f6)',
  secondaryColor,
  waveSpeed = 1,
  waveHeight = 10,
  showBubbles = true,
  className = '',
  style,
}: FluidFillProps) {
  const isEnabled = spFluidFill ?? enabled ?? true;
  const reducedMotion = useReducedMotion();
  const level = clamp(fluidLevel, 0, 100);
  const resolvedWaveHeight = Math.max(4, waveHeight);
  const resolvedSpeed = Math.max(0.2, waveSpeed);
  const primaryColor = fluidColor;
  const depthColor = secondaryColor || `color-mix(in srgb, ${primaryColor} 70%, #ffffff)`;
  const bubbles = useMemo<Bubble[]>(() => {
    if (!showBubbles || level < 10) return [];
    const bubbleCount = Math.min(8, Math.floor(level / 12));
    return Array.from({ length: bubbleCount }, (_, id) => ({
      id,
      size: 3 + pseudoRandom(id + 1) * 5,
      left: 10 + pseudoRandom(id + 2) * 80,
      duration: 1.8 + pseudoRandom(id + 3) * 1.6,
      delay: pseudoRandom(id + 4) * 2,
      riseHeight: -(level * 2.2 + pseudoRandom(id + 5) * 20),
    }));
  }, [level, showBubbles]);

  const classes = [
    'sp-fluid-fill',
    isEnabled && reducedMotion && 'sp-fluid-fill--reduced-motion',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style}>
      {isEnabled && (
        <div className="sp-fluid-container" aria-hidden="true">
          <div
            className="sp-fluid-body"
            style={{
              height: `${level}%`,
              '--sp-wave-height': `${resolvedWaveHeight}px`,
            } as CSSProperties}
          >
            <div className="sp-fluid-wave-wrapper">
              <svg
                className="sp-fluid-wave sp-fluid-wave--secondary"
                viewBox={`0 0 800 ${resolvedWaveHeight * 2.2}`}
                preserveAspectRatio="none"
                style={{ '--sp-wave-speed-2': `${6 / resolvedSpeed}s` } as CSSProperties}
              >
                <path d={wavePath(resolvedWaveHeight, true)} fill={depthColor} />
              </svg>
              <svg
                className="sp-fluid-wave sp-fluid-wave--primary"
                viewBox={`0 0 800 ${resolvedWaveHeight * 2.2}`}
                preserveAspectRatio="none"
                style={{ '--sp-wave-speed-1': `${4 / resolvedSpeed}s` } as CSSProperties}
              >
                <path d={wavePath(resolvedWaveHeight, false)} fill={primaryColor} />
              </svg>
            </div>
            <div className="sp-fluid-fill-bg" style={{ background: primaryColor }} />
            {bubbles.map((bubble) => (
              <span
                key={bubble.id}
                className="sp-fluid-bubble"
                style={{
                  left: `${bubble.left}%`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  '--sp-bubble-rise': `${bubble.riseHeight}px`,
                  '--sp-bubble-duration': `${bubble.duration}s`,
                  animationDelay: `${bubble.delay}s`,
                } as CSSProperties}
              />
            ))}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
