import './Slider.css';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
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
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  showValue?: boolean;
  showTicks?: boolean;
  orientation?: 'horizontal' | 'vertical';
  showMarker?: boolean;
  className?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function snapToStep(value: number, min: number, step: number): number {
  const safeStep = step > 0 ? step : 1;
  return Math.round((value - min) / safeStep) * safeStep + min;
}

export function Slider({
  value: controlledValue,
  defaultValue,
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
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  showValue = true,
  showTicks = false,
  orientation = 'horizontal',
  showMarker = false,
  className = '',
}: SliderProps) {
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
  const errorId = `sp-slider-${instanceId}-error`;
  const hintId = `sp-slider-${instanceId}-hint`;
  const describedBy = ariaDescribedBy || field?.describedBy ||
    (errorMessage ? errorId : effectiveHint ? hintId : undefined);
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? min);
  const current = clamp(isControlled ? controlledValue : internalValue, min, max);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setValue = useCallback((next: number) => {
    const normalized = clamp(snapToStep(next, min, step), min, max);
    if (!isControlled) setInternalValue(normalized);
    onChange?.(normalized);
  }, [isControlled, max, min, onChange, step]);

  const getValueFromPosition = useCallback((position: number): number => {
    const track = trackRef.current;
    if (!track) return current;
    const rect = track.getBoundingClientRect();
    const ratio = orientation === 'vertical'
      ? (rect.bottom - position) / rect.height
      : (position - rect.left) / rect.width;
    return min + clamp(ratio, 0, 1) * (max - min);
  }, [current, max, min, orientation]);

  const position = useCallback((event: React.MouseEvent | React.TouchEvent): number => {
    return 'touches' in event
      ? (orientation === 'vertical' ? event.touches[0]?.clientY ?? 0 : event.touches[0]?.clientX ?? 0)
      : (orientation === 'vertical' ? event.clientY : event.clientX);
  }, [orientation]);

  const handlePointerStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (effectiveDisabled || effectiveReadOnly) return;
    event.preventDefault();
    dragging.current = true;
    setValue(getValueFromPosition(position(event)));
    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const valuePosition = 'touches' in moveEvent
        ? (orientation === 'vertical' ? moveEvent.touches[0]?.clientY ?? 0 : moveEvent.touches[0]?.clientX ?? 0)
        : (orientation === 'vertical' ? moveEvent.clientY : moveEvent.clientX);
      setValue(getValueFromPosition(valuePosition));
    };
    const onEnd = () => {
      dragging.current = false;
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
  }, [effectiveDisabled, effectiveReadOnly, getValueFromPosition, orientation, position, setValue]);

  useEffect(() => () => { dragging.current = false; }, []);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (effectiveDisabled || effectiveReadOnly) return;
    let next: number | undefined;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = current + step;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = current - step;
    if (event.key === 'Home') next = min;
    if (event.key === 'End') next = max;
    if (next === undefined) return;
    event.preventDefault();
    setValue(next);
  }

  if (effectiveHidden) return null;
  const percent = max === min ? 0 : ((current - min) / (max - min)) * 100;
  const rootClasses = ['sp-slider', orientation === 'vertical' && 'sp-slider--vertical',
    effectiveDisabled && 'sp-slider--disabled', effectiveReadOnly && 'sp-slider--readonly',
    hasError && 'sp-slider--error', className].filter(Boolean).join(' ');

  return (
    <div className={rootClasses} title={effectiveRequired ? t('required') : undefined}>
      {showValue && <span className="sp-slider__value" aria-live="polite">{current}</span>}
      <div className="sp-slider__control">
        <div ref={trackRef} className="sp-slider__track" onMouseDown={handlePointerStart}
          onTouchStart={handlePointerStart} role="slider" aria-valuemin={min} aria-valuemax={max}
          aria-valuenow={current} aria-disabled={effectiveDisabled || undefined}
          aria-readonly={effectiveReadOnly || undefined} aria-invalid={hasError || undefined}
          aria-required={effectiveRequired || undefined} aria-orientation={orientation}
          aria-label={ariaLabel || undefined} aria-labelledby={ariaLabelledBy || undefined}
          aria-describedby={describedBy} tabIndex={effectiveDisabled ? -1 : 0}
          onKeyDown={handleKeyDown}>
          <div className="sp-slider__fill" style={orientation === 'vertical'
            ? { height: `${percent}%` } : { width: `${percent}%` }} />
          <div className="sp-slider__thumb" style={orientation === 'vertical'
            ? { bottom: `${percent}%` } : { left: `${percent}%` }}>
            {showMarker && <span className="sp-slider__marker" aria-hidden="true">{current}</span>}
          </div>
        </div>
      </div>
      {showTicks && <div className="sp-slider__ticks"><span>{min}</span><span>{max}</span></div>}
      {errorMessage && <p className="sp-slider__error" role="alert" id={errorId}>{errorMessage}</p>}
      {!errorMessage && effectiveHint && <p className="sp-slider__hint" id={hintId}>{effectiveHint}</p>}
    </div>
  );
}
