import './Shake.css';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode, type Ref } from 'react';

export type ShakeVariant = 'shake' | 'shake-y' | 'bounce' | 'pulse' | 'wobble' | 'pop' | 'jiggle';
export type ShakeTrigger = 'click' | 'hover' | 'manual';
export type ShakeIntensity = 'subtle' | 'normal' | 'intense';

export interface ShakeHandle { trigger(): void; }

export interface ShakeProps {
  children?: ReactNode;
  enabled?: boolean;
  spShake?: boolean;
  shakeVariant?: ShakeVariant;
  shakeTrigger?: ShakeTrigger;
  shakeIntensity?: ShakeIntensity;
  shakeDuration?: number;
  onShakeEnd?: () => void;
  onClick?: (event: MouseEvent<HTMLSpanElement>) => void;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<ShakeHandle>;
}

export const Shake = forwardRef<ShakeHandle, ShakeProps>(function Shake(
  { children, enabled, spShake, shakeVariant = 'shake', shakeTrigger = 'click', shakeIntensity = 'normal', shakeDuration = 500, onShakeEnd, onClick, className = '', style },
  ref,
) {
  const isEnabled = spShake ?? enabled ?? true;
  const [animating, setAnimating] = useState(false);
  const timer = useRef<number | null>(null);
  const trigger = useCallback(() => {
    if (!isEnabled || animating) return;
    setAnimating(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setAnimating(false);
      timer.current = null;
      onShakeEnd?.();
    }, Math.max(1, shakeDuration));
  }, [animating, isEnabled, onShakeEnd, shakeDuration]);

  useImperativeHandle(ref, () => ({ trigger }), [trigger]);
  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);

  return (
    <span
      className={['sp-shake-host', animating && 'sp-shake--animating', animating && `sp-shake--${shakeVariant}`, animating && `sp-shake--${shakeIntensity}`, className].filter(Boolean).join(' ')}
      style={{ ...style, '--sp-shake-duration': `${Math.max(1, shakeDuration)}ms` } as CSSProperties}
      onClick={(event) => { onClick?.(event); if (shakeTrigger === 'click') trigger(); }}
      onMouseEnter={() => { if (shakeTrigger === 'hover') trigger(); }}
    >
      {children}
    </span>
  );
});
