import './Slider.css';
import { useState, useRef, useCallback, useEffect } from 'react';

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  showTicks?: boolean;
  className?: string;
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

function snapToStep(val: number, min: number, step: number): number {
  return Math.round((val - min) / step) * step + min;
}

function toPercent(val: number, min: number, max: number): number {
  if (max === min) return 0;
  return ((val - min) / (max - min)) * 100;
}

/* ── Component ──────────────────────────────────────────────────────────── */

export function Slider({
  value: controlledValue,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = true,
  showTicks = false,
  className = '',
}: SliderProps) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? min);
  const current = isControlled ? controlledValue : uncontrolledValue;

  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setValue = useCallback(
    (next: number) => {
      const snapped = snapToStep(clamp(next, min, max), min, step);
      const clamped = clamp(snapped, min, max);
      if (!isControlled) {
        setUncontrolledValue(clamped);
      }
      onChange?.(clamped);
    },
    [min, max, step, isControlled, onChange],
  );

  const getValueFromPosition = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track) return min;
      const rect = track.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      return min + ratio * (max - min);
    },
    [min, max],
  );

  /* ── Mouse drag ──────────────────────────────────────────────────────── */

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      dragging.current = true;
      setValue(getValueFromPosition(e.clientX));

      const onMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        setValue(getValueFromPosition(ev.clientX));
      };

      const onUp = () => {
        dragging.current = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [disabled, setValue, getValueFromPosition],
  );

  /* ── Touch drag ──────────────────────────────────────────────────────── */

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;
      dragging.current = true;
      const touch = e.touches[0];
      setValue(getValueFromPosition(touch.clientX));

      const onMove = (ev: TouchEvent) => {
        if (!dragging.current) return;
        const t = ev.touches[0];
        setValue(getValueFromPosition(t.clientX));
      };

      const onEnd = () => {
        dragging.current = false;
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
      };

      document.addEventListener('touchmove', onMove);
      document.addEventListener('touchend', onEnd);
    },
    [disabled, setValue, getValueFromPosition],
  );

  /* ── Keyboard ────────────────────────────────────────────────────────── */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let next: number | undefined;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault();
          next = current + step;
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault();
          next = current - step;
          break;
        case 'Home':
          e.preventDefault();
          next = min;
          break;
        case 'End':
          e.preventDefault();
          next = max;
          break;
      }

      if (next !== undefined) {
        setValue(next);
      }
    },
    [current, step, min, max, setValue],
  );

  /* ── Cleanup dragging on unmount ─────────────────────────────────────── */

  useEffect(() => {
    return () => {
      dragging.current = false;
    };
  }, []);

  const percent = toPercent(current, min, max);

  const rootClasses = [
    'sp-slider',
    disabled && 'sp-slider--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses}>
      {showValue && (
        <div className="sp-slider__value" aria-live="polite">
          {current}
        </div>
      )}
      <div
        ref={trackRef}
        className="sp-slider__track"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        <div
          className="sp-slider__fill"
          style={{ width: `${percent}%` }}
        />
        <div
          className="sp-slider__thumb"
          style={{ left: `${percent}%` }}
        />
      </div>
      {showTicks && (
        <div className="sp-slider__ticks">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
