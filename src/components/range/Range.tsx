import './Range.css';
import { useCallback, useId, useRef, useState } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';

export interface RangeValue { low: number; high: number; }

export interface RangeProps {
  value?: RangeValue;
  defaultValue?: RangeValue;
  onChange?: (value: RangeValue) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  invalid?: boolean;
  errors?: readonly FormValidationError[];
  required?: boolean;
  error?: string;
  hint?: string;
  ariaLabelLow?: string;
  ariaLabelHigh?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  showValues?: boolean;
  draggableRange?: boolean;
  orientation?: 'horizontal' | 'vertical';
  showMarker?: boolean;
  className?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function snap(value: number, min: number, step: number, max: number): number {
  const safeStep = step > 0 ? step : 1;
  return clamp(Math.round((value - min) / safeStep) * safeStep + min, min, max);
}

export function Range({
  value: controlledValue,
  defaultValue = { low: 20, high: 80 },
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  readOnly = false,
  hidden = false,
  invalid,
  errors,
  required = false,
  error,
  hint,
  ariaLabelLow,
  ariaLabelHigh,
  ariaLabelledBy,
  ariaDescribedBy,
  showValues = true,
  draggableRange = false,
  orientation = 'horizontal',
  showMarker = false,
  className = '',
}: RangeProps) {
  const { t } = useI18n();
  const field = useFormFieldContext();
  const instanceId = useId().replace(/:/g, '');
  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const effectiveHidden = hidden || Boolean(field?.hidden);
  const effectiveRequired = required || Boolean(field?.required);
  const errorMessage = firstFormError(errors || field?.errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const effectiveHint = hint || field?.hint;
  const errorId = `sp-range-${instanceId}-error`;
  const hintId = `sp-range-${instanceId}-hint`;
  const describedBy = ariaDescribedBy || field?.describedBy ||
    (errorMessage ? errorId : effectiveHint ? hintId : undefined);
  const [internal, setInternal] = useState(defaultValue);
  const current = controlledValue ?? internal;
  const isControlled = controlledValue !== undefined;
  const trackRef = useRef<HTMLDivElement>(null);

  const setValue = useCallback((next: RangeValue) => {
    const normalized = {
      low: clamp(next.low, min, max),
      high: clamp(next.high, min, max),
    };
    if (!isControlled) setInternal(normalized);
    onChange?.(normalized);
  }, [isControlled, max, min, onChange]);
  const setThumb = useCallback((thumb: 'low' | 'high', next: number) => {
    const valueAtStep = snap(next, min, step, max);
    setValue(thumb === 'low'
      ? { low: Math.min(valueAtStep, current.high), high: current.high }
      : { low: current.low, high: Math.max(valueAtStep, current.low) });
  }, [current.high, current.low, max, min, setValue, step]);

  const getPosition = useCallback((event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if ('touches' in event) {
      return orientation === 'vertical' ? event.touches[0]?.clientY ?? 0 : event.touches[0]?.clientX ?? 0;
    }
    return orientation === 'vertical' ? event.clientY : event.clientX;
  }, [orientation]);
  const valueFromPosition = useCallback((position: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return current.low;
    const ratio = orientation === 'vertical'
      ? (rect.bottom - position) / rect.height
      : (position - rect.left) / rect.width;
    return min + clamp(ratio, 0, 1) * (max - min);
  }, [current.low, max, min, orientation]);

  const handleTrackClick = useCallback((event: React.MouseEvent) => {
    if (effectiveDisabled || effectiveReadOnly) return;
    const next = snap(valueFromPosition(getPosition(event)), min, step, max);
    setThumb(Math.abs(next - current.low) <= Math.abs(next - current.high) ? 'low' : 'high', next);
  }, [current.high, current.low, effectiveDisabled, effectiveReadOnly, getPosition, max, min, setThumb, step, valueFromPosition]);

  const handleThumbStart = useCallback((event: React.MouseEvent | React.TouchEvent, thumb: 'low' | 'high') => {
    if (effectiveDisabled || effectiveReadOnly) return;
    event.preventDefault();
    const onMove = (moveEvent: MouseEvent | TouchEvent) => setThumb(thumb, valueFromPosition(getPosition(moveEvent)));
    const onEnd = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.removeEventListener('touchcancel', onEnd);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
    document.addEventListener('touchcancel', onEnd);
  }, [effectiveDisabled, effectiveReadOnly, getPosition, setThumb, valueFromPosition]);

  const handleRangeStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!draggableRange || effectiveDisabled || effectiveReadOnly) return;
    event.preventDefault();
    event.stopPropagation();
    const startPosition = getPosition(event);
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const start = current;
    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const length = orientation === 'vertical' ? rect.height : rect.width;
      if (length <= 0) return;
      const deltaRatio = orientation === 'vertical'
        ? (startPosition - getPosition(moveEvent)) / length
        : (getPosition(moveEvent) - startPosition) / length;
      const delta = Math.round((deltaRatio * (max - min)) / (step > 0 ? step : 1)) * (step > 0 ? step : 1);
      const bounded = Math.min(max - start.high, Math.max(min - start.low, delta));
      setValue({ low: start.low + bounded, high: start.high + bounded });
    };
    const onEnd = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.removeEventListener('touchcancel', onEnd);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
    document.addEventListener('touchcancel', onEnd);
  }, [current, draggableRange, effectiveDisabled, effectiveReadOnly, getPosition, max, min, orientation, setValue, step]);

  function handleKeyDown(event: React.KeyboardEvent, thumb: 'low' | 'high') {
    if (effectiveDisabled || effectiveReadOnly) return;
    let next = thumb === 'low' ? current.low : current.high;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next += step;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next -= step;
    else if (event.key === 'Home') next = min;
    else if (event.key === 'End') next = max;
    else return;
    event.preventDefault();
    setThumb(thumb, next);
  }

  if (effectiveHidden) return null;
  const span = max - min;
  const lowPct = span === 0 ? 0 : ((current.low - min) / span) * 100;
  const highPct = span === 0 ? 0 : ((current.high - min) / span) * 100;
  const rootClasses = ['sp-range', orientation === 'vertical' && 'sp-range--vertical',
    effectiveDisabled && 'sp-range--disabled', effectiveReadOnly && 'sp-range--readonly',
    hasError && 'sp-range--error', className].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      {showValues && <div className="sp-range__values"><span>{current.low}</span><span>{current.high}</span></div>}
      <div className="sp-range__track" ref={trackRef} onClick={handleTrackClick}>
        <div className={['sp-range__fill', draggableRange && 'sp-range__fill--draggable'].filter(Boolean).join(' ')}
          style={orientation === 'vertical'
            ? { bottom: `${lowPct}%`, height: `${highPct - lowPct}%` }
            : { left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
          onMouseDown={handleRangeStart} onTouchStart={handleRangeStart} />
        {(['low', 'high'] as const).map((thumb) => {
          const isLow = thumb === 'low';
          const percent = isLow ? lowPct : highPct;
          return <div key={thumb} className={`sp-range__thumb sp-range__thumb--${thumb}`}
            style={orientation === 'vertical' ? { bottom: `${percent}%` } : { left: `${percent}%` }}
            role="slider" aria-valuenow={isLow ? current.low : current.high}
            aria-valuemin={isLow ? min : current.low} aria-valuemax={isLow ? current.high : max}
            aria-orientation={orientation} aria-label={isLow ? ariaLabelLow || t('min') : ariaLabelHigh || t('max')}
            aria-labelledby={ariaLabelledBy || undefined} aria-describedby={describedBy}
            aria-invalid={hasError || undefined} aria-required={effectiveRequired || undefined}
            aria-readonly={effectiveReadOnly || undefined} tabIndex={effectiveDisabled ? -1 : 0}
            onMouseDown={(event) => handleThumbStart(event, thumb)} onTouchStart={(event) => handleThumbStart(event, thumb)}
            onKeyDown={(event) => handleKeyDown(event, thumb)}>
            {showMarker && <span className="sp-range__marker" aria-hidden="true">{isLow ? current.low : current.high}</span>}
          </div>;
        })}
      </div>
      {errorMessage && <p className="sp-range__error" role="alert" id={errorId}>{errorMessage}</p>}
      {!errorMessage && effectiveHint && <p className="sp-range__hint" id={hintId}>{effectiveHint}</p>}
    </div>
  );
}
