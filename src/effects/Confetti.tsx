import './Confetti.css';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import { clamp, useReducedMotion } from './effect-utils.js';

export type ConfettiShape = 'square' | 'circle' | 'strip';

export interface ConfettiConfig {
  /** Number of confetti particles. */
  count?: number;
  /** Animation duration in milliseconds. */
  duration?: number;
  /** Spread angle in degrees. */
  spread?: number;
  /** Custom particle color palette. */
  colors?: string[];
  /** Particle shapes to use. */
  shapes?: ConfettiShape[];
  /** Starting Y position as a percentage from the top of the host. */
  originY?: number;
}

export interface ConfettiHandle {
  /** Fires a burst, optionally overriding the configured burst. */
  fire(overrides?: ConfettiConfig): void;
}

export interface ConfettiProps extends ConfettiConfig {
  children?: ReactNode;
  /** Fire once when the active flag changes from false to true. */
  active?: boolean;
  /** Configuration object matching the Angular directive input. */
  config?: ConfettiConfig;
  /** Alias for config. */
  spConfetti?: ConfettiConfig;
  /** Fire when the host is clicked. */
  confettiOnClick?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<ConfettiHandle>;
}

interface ConfettiPiece {
  id: number;
  color: string;
  shape: ConfettiShape;
  size: number;
  dx: number;
  dy: number;
  rotation: number;
  duration: number;
}

interface Burst {
  id: number;
  originX: number;
  originY: number;
  config: Required<ConfettiConfig>;
  pieces: ConfettiPiece[];
}

const DEFAULT_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6',
  '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#f43f5e',
];

const DEFAULT_CONFIG: Required<ConfettiConfig> = {
  count: 80,
  duration: 2500,
  spread: 70,
  colors: DEFAULT_COLORS,
  shapes: ['square', 'circle', 'strip'],
  originY: 60,
};

function normalizeConfig(config: ConfettiConfig): Required<ConfettiConfig> {
  return {
    count: clamp(Math.floor(config.count ?? DEFAULT_CONFIG.count), 0, 500),
    duration: Math.max(1, config.duration ?? DEFAULT_CONFIG.duration),
    spread: Math.max(0, config.spread ?? DEFAULT_CONFIG.spread),
    colors: config.colors?.length ? config.colors : DEFAULT_COLORS,
    shapes: config.shapes?.length ? config.shapes : DEFAULT_CONFIG.shapes,
    originY: clamp(config.originY ?? DEFAULT_CONFIG.originY, 0, 100),
  };
}

function makePieces(config: Required<ConfettiConfig>): ConfettiPiece[] {
  return Array.from({ length: config.count }, (_, id) => {
    const angle = (-90 + (Math.random() - 0.5) * config.spread * 2) * (Math.PI / 180);
    const velocity = 300 + Math.random() * 500;
    return {
      id,
      color: config.colors[Math.floor(Math.random() * config.colors.length)] ?? DEFAULT_COLORS[0],
      shape: config.shapes[Math.floor(Math.random() * config.shapes.length)] ?? 'square',
      size: 6 + Math.random() * 6,
      dx: Math.cos(angle) * velocity,
      dy: Math.sin(angle) * velocity,
      rotation: Math.random() * 720 - 360,
      duration: config.duration * (0.7 + Math.random() * 0.3),
    };
  });
}

export const Confetti = forwardRef<ConfettiHandle, ConfettiProps>(function Confetti(
  {
    children,
    active = false,
    config,
    spConfetti,
    count,
    duration,
    spread,
    colors,
    shapes,
    originY,
    confettiOnClick = true,
    onStart,
    onComplete,
    className = '',
    style,
  },
  ref,
) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextBurstId = useRef(0);
  const previousActive = useRef(false);
  const [burst, setBurst] = useState<Burst | null>(null);
  const reducedMotion = useReducedMotion();

  const fire = useCallback((overrides?: ConfettiConfig) => {
    const host = hostRef.current;
    const hostRect = host?.getBoundingClientRect();
    const hostWidth = hostRect?.width ?? 0;
    const hostHeight = hostRect?.height ?? 0;
    const merged = normalizeConfig({
      ...DEFAULT_CONFIG,
      ...(typeof spConfetti === 'object' ? spConfetti : {}),
      ...(config ?? {}),
      ...(count !== undefined ? { count } : {}),
      ...(duration !== undefined ? { duration } : {}),
      ...(spread !== undefined ? { spread } : {}),
      ...(colors !== undefined ? { colors } : {}),
      ...(shapes !== undefined ? { shapes } : {}),
      ...(originY !== undefined ? { originY } : {}),
      ...(overrides ?? {}),
    });
    const originX = hostRect && hostWidth ? hostRect.left + hostWidth / 2 : window.innerWidth / 2;
    const originTop = hostRect && hostHeight ? hostRect.top : window.innerHeight * 0.6;
    const nextBurst: Burst = {
      id: nextBurstId.current++,
      originX,
      originY: originTop + (hostHeight * merged.originY) / 100,
      config: merged,
      pieces: makePieces(merged),
    };

    if (burstTimer.current) clearTimeout(burstTimer.current);
    setBurst(nextBurst);
    onStart?.();
    burstTimer.current = setTimeout(() => {
      setBurst(null);
      burstTimer.current = null;
      onComplete?.();
    }, merged.duration + 200);
  }, [colors, config, count, duration, onComplete, onStart, originY, shapes, spConfetti, spread]);

  useImperativeHandle(ref, () => ({ fire }), [fire]);

  useEffect(() => {
    if (active && !previousActive.current) fire();
    previousActive.current = active;
  }, [active, fire]);

  useEffect(() => () => {
    if (burstTimer.current) clearTimeout(burstTimer.current);
  }, []);

  return (
    <span
      ref={hostRef}
      className={['sp-confetti-host', className].filter(Boolean).join(' ')}
      style={style}
      onClick={() => {
        if (confettiOnClick) fire();
      }}
    >
      {children}
      {burst && typeof document !== 'undefined' && createPortal(
        <div
          className={['sp-confetti-burst', 'sp-confetti-wrap', reducedMotion && 'sp-confetti-burst--reduced-motion'].filter(Boolean).join(' ')}
          aria-hidden="true"
        >
          {burst.pieces.map((piece) => {
            const shapeStyle: CSSProperties = {
              left: burst.originX,
              top: burst.originY,
              width: piece.shape === 'strip' ? piece.size * 0.4 : piece.size,
              height: piece.shape === 'strip' ? piece.size * 1.6 : piece.size,
              backgroundColor: piece.color,
              borderRadius: piece.shape === 'circle' ? '50%' : piece.shape === 'strip' ? 2 : 0,
              '--sp-confetti-dx': `${piece.dx}px`,
              '--sp-confetti-dy': `${piece.dy}px`,
              '--sp-confetti-rot': `${piece.rotation}deg`,
              '--sp-confetti-duration': `${piece.duration}ms`,
            } as CSSProperties;
            return <span key={`${burst.id}-${piece.id}`} className="sp-confetti-particle" style={shapeStyle} />;
          })}
        </div>,
        document.body,
      )}
    </span>
  );
});
