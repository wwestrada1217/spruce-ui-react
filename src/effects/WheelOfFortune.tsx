import './WheelOfFortune.css';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type Ref,
} from 'react';
import { useReducedMotion } from './effect-utils.js';

export interface WheelSlice {
  id: string;
  label: string;
  color: string;
  textColor?: string;
  icon?: string;
}

export type WheelSize = 'sm' | 'md' | 'lg' | 'xl' | number;

export interface WheelOfFortuneHandle {
  /** Programmatically trigger a wheel spin. */
  spin(): void;
}

export interface WheelOfFortuneProps {
  /** Array of prize slice objects. */
  slices?: WheelSlice[];
  /** Diameter preset or pixel size. */
  size?: WheelSize;
  /** Top indicator arrow color. */
  pointerColor?: string;
  /** Center button label. */
  centerText?: string;
  /** Spin duration in seconds. */
  duration?: number;
  /** Documentation-compatible spin duration in milliseconds. */
  spinDuration?: number;
  /** Called when spinning begins. */
  onSpinStart?: () => void;
  /** Called with the winning slice when spinning completes. */
  onSpinComplete?: (winner: WheelSlice) => void;
  /** Accessible name for the wheel. */
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<WheelOfFortuneHandle>;
}

const SIZE_MAP: Record<string, number> = { sm: 220, md: 320, lg: 400, xl: 480 };

const DEFAULT_WHEEL_SLICES: WheelSlice[] = [
  { id: '1', label: '$100', color: '#ef4444', textColor: '#ffffff' },
  { id: '2', label: 'Try Again', color: '#f97316', textColor: '#ffffff' },
  { id: '3', label: '$500', color: '#eab308', textColor: '#ffffff' },
  { id: '4', label: 'Jackpot 🎉', color: '#10b981', textColor: '#ffffff' },
  { id: '5', label: '$50', color: '#06b6d4', textColor: '#ffffff' },
  { id: '6', label: '$250', color: '#3b82f6', textColor: '#ffffff' },
  { id: '7', label: 'Mystery Gift 🎁', color: '#8b5cf6', textColor: '#ffffff' },
  { id: '8', label: '$1,000 ⭐', color: '#ec4899', textColor: '#ffffff' },
];

interface ComputedSlice extends WheelSlice {
  path: string;
  textTransform: string;
}

function polarPoint(radius: number, angle: number): { x: number; y: number } {
  return {
    x: 200 + radius * Math.cos((Math.PI * angle) / 180),
    y: 200 + radius * Math.sin((Math.PI * angle) / 180),
  };
}

export const WheelOfFortune = forwardRef<WheelOfFortuneHandle, WheelOfFortuneProps>(function WheelOfFortune(
  {
    slices = DEFAULT_WHEEL_SLICES,
    size = 'lg',
    pointerColor = '#ef4444',
    centerText = 'SPIN',
    duration = 4.5,
    spinDuration,
    onSpinStart,
    onSpinComplete,
    ariaLabel,
    className = '',
    style,
  },
  ref,
) {
  const reducedMotion = useReducedMotion();
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isTickBouncing, setIsTickBouncing] = useState(false);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] ?? 400;
  const resolvedDuration = Math.max(0.01, spinDuration !== undefined ? spinDuration / 1000 : duration);
  const safeSlices = slices.length > 0 ? slices : DEFAULT_WHEEL_SLICES;

  useEffect(() => () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    timerRefs.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const computedSlices = useMemo<ComputedSlice[]>(() => {
    const sliceAngle = 360 / Math.max(1, safeSlices.length);
    const radius = 184;
    return safeSlices.map((slice, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = (index + 1) * sliceAngle;
      const start = polarPoint(radius, startAngle);
      const end = polarPoint(radius, endAngle);
      const midAngle = startAngle + sliceAngle / 2;
      const text = polarPoint(135, midAngle);
      return {
        ...slice,
        path: `M 200 200 L ${start.x} ${start.y} A ${radius} ${radius} 0 ${sliceAngle > 180 ? 1 : 0} 1 ${end.x} ${end.y} Z`,
        textTransform: `translate(${text.x}, ${text.y}) rotate(${midAngle})`,
      };
    });
  }, [safeSlices]);

  const outerPins = useMemo(() => {
    const count = Math.max(1, safeSlices.length) * 2;
    return Array.from({ length: count }, (_, index) => polarPoint(188, (index * 360) / count));
  }, [safeSlices.length]);

  const spin = useCallback(() => {
    if (isSpinning || safeSlices.length === 0) return;
    setIsSpinning(true);
    onSpinStart?.();
    const sliceAngle = 360 / safeSlices.length;
    const targetIndex = Math.floor(Math.random() * safeSlices.length);
    const targetSlice = safeSlices[targetIndex];
    const sliceCenterAngle = targetIndex * sliceAngle + sliceAngle / 2;
    const fullSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    const targetRotation = currentRotation
      + fullSpins
      + ((270 - sliceCenterAngle - (currentRotation % 360) + 360) % 360);
    setCurrentRotation(targetRotation);

    if (reducedMotion) {
      const timer = window.setTimeout(() => {
        setIsSpinning(false);
        onSpinComplete?.(targetSlice);
      }, 0);
      timerRefs.current.push(timer);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setIsTickBouncing(true);
      const tickTimer = window.setTimeout(() => setIsTickBouncing(false), 80);
      timerRefs.current.push(tickTimer);
    }, 160);
    const completeTimer = window.setTimeout(() => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsSpinning(false);
      onSpinComplete?.(targetSlice);
    }, resolvedDuration * 1000);
    timerRefs.current.push(completeTimer);
  }, [currentRotation, isSpinning, onSpinComplete, onSpinStart, reducedMotion, resolvedDuration, safeSlices]);

  useImperativeHandle(ref, () => ({ spin }), [spin]);

  const classes = ['sp-wheel-of-fortune', className].filter(Boolean).join(' ');
  const spinnerStyle = {
    transform: `rotate(${currentRotation}deg)`,
    transition: isSpinning && !reducedMotion
      ? `transform ${resolvedDuration}s cubic-bezier(0.15, 0.85, 0.35, 1)`
      : 'none',
  } as CSSProperties;

  return (
    <div
      className={classes}
      style={{ ...style, width: pixelSize, height: pixelSize }}
      role="group"
      aria-label={ariaLabel ?? 'Wheel of fortune'}
      aria-busy={isSpinning || undefined}
    >
      <div className={`sp-wheel-pointer${isTickBouncing ? ' sp-pointer-tick' : ''}`} style={{ borderTopColor: pointerColor }} aria-hidden="true" />
      <div className="sp-wheel-spinner" style={spinnerStyle}>
        <svg width={pixelSize} height={pixelSize} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="200" cy="200" r="195" fill="var(--sp-surface-100, #1e293b)" stroke="var(--sp-border-strong, #cbd5e1)" strokeWidth="4" />
          <circle cx="200" cy="200" r="188" fill="none" stroke="var(--sp-warning, #f59e0b)" strokeWidth="6" />
          {outerPins.map((pin, index) => <circle key={index} cx={pin.x} cy={pin.y} r="4" fill="var(--sp-warning-subtle, #fef08a)" stroke="var(--sp-warning-strong, #d97706)" strokeWidth="1.5" />)}
          {computedSlices.map((slice) => (
            <g key={slice.id}>
              <path d={slice.path} fill={slice.color} stroke="rgb(255 255 255 / 30%)" strokeWidth="1.5" />
              <g transform={slice.textTransform}>
                <text x="0" y="0" fill={slice.textColor || '#ffffff'} fontSize="14" fontWeight="700" textAnchor="end" dominantBaseline="central">{slice.label}</text>
              </g>
            </g>
          ))}
          <circle cx="200" cy="200" r="42" fill="#ffffff" stroke="var(--sp-border, #e2e8f0)" strokeWidth="4" />
          <circle cx="200" cy="200" r="34" fill="var(--sp-primary, #3b82f6)" />
        </svg>
      </div>
      <button type="button" className="sp-wheel-center-btn" disabled={isSpinning} onClick={spin} aria-label={centerText}>
        <span>{centerText}</span>
      </button>
    </div>
  );
});
