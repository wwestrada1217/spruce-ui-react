import React from 'react';
import './Range.css';

export interface RangeValue {
  low: number;
  high: number;
}

export interface RangeProps {
  value?: RangeValue;
  defaultValue?: RangeValue;
  onChange?: (value: RangeValue) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValues?: boolean;
  className?: string;
}

export function Range({
  value,
  defaultValue = { low: 20, high: 80 },
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValues = true,
  className,
}: RangeProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const trackRef = React.useRef<HTMLDivElement>(null);

  const range = max - min;
  const lowPct = range === 0 ? 0 : ((current.low - min) / range) * 100;
  const highPct = range === 0 ? 0 : ((current.high - min) / range) * 100;

  function clamp(v: number) { return Math.min(max, Math.max(min, v)); }
  function snap(v: number) { return clamp(Math.round(v / step) * step); }

  function setValue(next: RangeValue) {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  function setThumb(thumb: 'low' | 'high', val: number) {
    val = snap(val);
    if (thumb === 'low') {
      setValue({ low: Math.min(val, current.high), high: current.high });
    } else {
      setValue({ low: current.low, high: Math.max(val, current.low) });
    }
  }

  function calcFromX(clientX: number): number {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return current.low;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return min + ratio * range;
  }

  function onTrackClick(e: React.MouseEvent) {
    if (disabled) return;
    const val = snap(calcFromX(e.clientX));
    const distLow = Math.abs(val - current.low);
    const distHigh = Math.abs(val - current.high);
    setThumb(distLow <= distHigh ? 'low' : 'high', val);
  }

  function onThumbDown(e: React.MouseEvent | React.TouchEvent, thumb: 'low' | 'high') {
    if (disabled) return;
    e.preventDefault();
    const onMove = (ev: MouseEvent | TouchEvent) => {
      const clientX = ev instanceof MouseEvent ? ev.clientX : ev.touches[0].clientX;
      setThumb(thumb, calcFromX(clientX));
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onUp);
  }

  function onKeydown(e: React.KeyboardEvent, thumb: 'low' | 'high') {
    if (disabled) return;
    let val = thumb === 'low' ? current.low : current.high;
    switch (e.key) {
      case 'ArrowLeft': case 'ArrowDown': val -= step; break;
      case 'ArrowRight': case 'ArrowUp': val += step; break;
      case 'Home': val = min; break;
      case 'End': val = max; break;
      default: return;
    }
    e.preventDefault();
    setThumb(thumb, val);
  }

  const cls = ['sp-range', disabled ? 'sp-range--disabled' : '', className].filter(Boolean).join(' ');

  return (
    <div className={cls}>
      {showValues && (
        <div className="sp-range__values">
          <span>{current.low}</span>
          <span>{current.high}</span>
        </div>
      )}
      <div className="sp-range__track" ref={trackRef} onClick={onTrackClick}>
        <div className="sp-range__fill" style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }} />
        <div
          className="sp-range__thumb sp-range__thumb--low"
          style={{ left: `${lowPct}%` }}
          role="slider"
          aria-valuenow={current.low}
          aria-valuemin={min}
          aria-valuemax={current.high}
          aria-label="Low value"
          tabIndex={0}
          onMouseDown={(e) => onThumbDown(e, 'low')}
          onTouchStart={(e) => onThumbDown(e, 'low')}
          onKeyDown={(e) => onKeydown(e, 'low')}
        />
        <div
          className="sp-range__thumb sp-range__thumb--high"
          style={{ left: `${highPct}%` }}
          role="slider"
          aria-valuenow={current.high}
          aria-valuemin={current.low}
          aria-valuemax={max}
          aria-label="High value"
          tabIndex={0}
          onMouseDown={(e) => onThumbDown(e, 'high')}
          onTouchStart={(e) => onThumbDown(e, 'high')}
          onKeyDown={(e) => onKeydown(e, 'high')}
        />
      </div>
    </div>
  );
}
