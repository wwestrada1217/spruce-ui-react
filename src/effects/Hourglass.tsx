import './Hourglass.css';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useState,
  useRef,
  type CSSProperties,
  type Ref,
} from 'react';
import { clamp, useReducedMotion } from './effect-utils.js';

export type HourglassSize = 'sm' | 'md' | 'lg' | 'xl' | number;

export interface HourglassHandle {
  /** Briefly flips the vessel to indicate a reset. */
  flip(): void;
}

export interface HourglassProps {
  /** Progress percentage from 0 to 100 of sand in the bottom bulb. */
  progress?: number;
  /** Optional countdown duration in seconds. Zero keeps progress manual. */
  duration?: number;
  /** Color of the sand. */
  sandColor?: string;
  /** Color of the glass frame and caps. */
  glassColor?: string;
  /** Size preset or pixel width. */
  size?: HourglassSize;
  /** Enable the falling sand stream. */
  animating?: boolean;
  /** Angular-compatible alias for animating. */
  running?: boolean;
  /** Called when an optional countdown reaches 100%. */
  onComplete?: () => void;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HourglassHandle>;
}

const SIZE_MAP: Record<string, number> = { sm: 32, md: 48, lg: 64, xl: 96 };

export const Hourglass = forwardRef<HourglassHandle, HourglassProps>(function Hourglass(
  {
    progress = 45,
    duration = 0,
    sandColor = '#f59e0b',
    glassColor = 'var(--sp-border-strong, #cbd5e1)',
    size = 'md',
    animating,
    running,
    onComplete,
    ariaLabel,
    className = '',
    style,
  },
  ref,
) {
  const isRunning = running ?? animating ?? true;
  const reducedMotion = useReducedMotion();
  const [isFlipping, setIsFlipping] = useState(false);
  const flipTimerRef = useRef<number | null>(null);
  const [countdownProgress, setCountdownProgress] = useState(clamp(progress, 0, 100));
  const onCompleteRef = useRef(onComplete);
  const baseProgress = clamp(progress, 0, 100);
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] ?? 48;
  const clipPrefix = useId().replace(/:/g, '');
  const topClipId = `${clipPrefix}-top-sand-clip`;
  const bottomClipId = `${clipPrefix}-bottom-sand-clip`;
  const displayProgress = duration > 0 && isRunning && baseProgress < 100 ? countdownProgress : baseProgress;
  const topRatio = (100 - displayProgress) / 100;
  const bottomRatio = displayProgress / 100;
  const streaming = isRunning && displayProgress < 100 && displayProgress > 0;
  const bottomSandY = 76 - bottomRatio * 30;
  const bottomSandPath = bottomRatio <= 0
    ? 'M 32 76 Z'
    : `M 16 76 H 48 V ${bottomSandY} Q 32 ${bottomSandY - 6} 16 ${bottomSandY} Z`;

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (duration <= 0 || !isRunning || baseProgress >= 100) {
      return;
    }
    const startTime = performance.now();
    const startProgress = baseProgress;
    const interval = window.setInterval(() => {
      const elapsed = performance.now() - startTime;
      const nextProgress = Math.min(100, startProgress + (elapsed / (duration * 1000)) * (100 - startProgress));
      setCountdownProgress(nextProgress);
      if (nextProgress >= 100) {
        window.clearInterval(interval);
        onCompleteRef.current?.();
      }
    }, reducedMotion ? Math.max(1, duration * 1000) : 50);
    return () => window.clearInterval(interval);
  }, [baseProgress, duration, isRunning, reducedMotion]);

  useEffect(() => () => {
    if (flipTimerRef.current !== null) window.clearTimeout(flipTimerRef.current);
  }, []);

  const flip = useCallback(() => {
    if (flipTimerRef.current !== null) window.clearTimeout(flipTimerRef.current);
    setIsFlipping(true);
    flipTimerRef.current = window.setTimeout(() => {
      setIsFlipping(false);
      flipTimerRef.current = null;
    }, 650);
  }, []);

  useImperativeHandle(ref, () => ({ flip }), [flip]);

  const classes = [
    'sp-hourglass',
    isFlipping && 'sp-hourglass--flipping',
    reducedMotion && 'sp-hourglass--reduced-motion',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={style}
      role="img"
      aria-label={ariaLabel ?? `Hourglass: ${Math.round(displayProgress)}% complete`}
      aria-busy={streaming || undefined}
    >
      <div
        className="sp-hourglass-vessel"
        style={{ width: pixelSize, height: pixelSize * 1.35 }}
      >
        <svg
          width={pixelSize}
          height={pixelSize * 1.35}
          viewBox="0 0 64 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M 12 8 H 52 M 16 8 V 14 C 16 28 28 36 32 44 C 36 36 48 28 48 14 V 8 M 12 80 H 52 M 16 80 V 74 C 16 60 28 52 32 44 C 36 52 48 60 48 74 V 80" stroke={glassColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="8" y="3" width="48" height="6" rx="2" fill={glassColor} />
          <rect x="8" y="79" width="48" height="6" rx="2" fill={glassColor} />
          <defs>
            <clipPath id={topClipId}>
              <path d="M 18 12 C 18 26 28 34 32 42 C 36 34 46 26 46 12 Z" />
            </clipPath>
            <clipPath id={bottomClipId}>
              <path d="M 18 76 C 18 62 28 54 32 46 C 36 54 46 62 46 76 Z" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${topClipId})`}>
            <rect x="12" y={12 + topRatio * 32} width="40" height={topRatio * 32} fill={sandColor} />
          </g>
          <g clipPath={`url(#${bottomClipId})`}>
            <path d={bottomSandPath} fill={sandColor} />
          </g>
          {streaming && <line x1="32" y1="40" x2="32" y2="72" stroke={sandColor} strokeWidth="2.5" strokeDasharray="4 3" className="sp-sand-stream-line" />}
          <path d="M 20 16 C 20 24 26 30 29 36 M 20 72 C 20 64 26 58 29 52" stroke="rgb(255 255 255 / 45%)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
});
