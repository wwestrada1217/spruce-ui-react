/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './SegmentedControl.css';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  type RefObject,
} from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface SegmentedOption {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
}

export type SegmentedSize = 'sm' | 'md' | 'lg';

export interface SegmentedControlProps {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: SegmentedSize;
  block?: boolean;
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
  className?: string;
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

function useIndicatorStyle(
  trackRef: RefObject<HTMLDivElement | null>,
  btnRefs: RefObject<Map<string, HTMLButtonElement>>,
  activeValue: string | undefined,
) {
  const [style, setStyle] = useState<React.CSSProperties>({ left: 0, width: 0, opacity: 0 });

  const update = useCallback(() => {
    if (!activeValue) return;
    const track = trackRef.current;
    const btn = btnRefs.current?.get(activeValue);
    if (!track || !btn) return;

    const trackRect = track.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    setStyle({
      left: btnRect.left - trackRect.left,
      width: btnRect.width,
      opacity: 1,
    });
  }, [trackRef, btnRefs, activeValue]);

  useEffect(() => {
    update();
  }, [update]);

  // Re-measure on window resize
  useEffect(() => {
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  return style;
}

/* ── Component ──────────────────────────────────────────────────────────── */

export function SegmentedControl({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  size = 'md',
  block = false,
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
  className = '',
}: SegmentedControlProps) {
  const { t } = useI18n();
  const field = useFormFieldContext();
  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const errorMessage = firstFormError(errors || field?.errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const effectiveHidden = hidden || Boolean(field?.hidden);
  const effectiveRequired = required || Boolean(field?.required);
  const effectiveHint = hint || field?.hint;
  const idBase = `sp-seg-${useId().replace(/:/g, '')}`;
  const errorId = `${idBase}-error`;
  const hintId = `${idBase}-hint`;
  const describedBy = ariaDescribedBy || field?.describedBy || (errorMessage ? errorId : effectiveHint ? hintId : undefined);
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? options[0]?.value,
  );
  const activeValue = isControlled ? controlledValue : uncontrolledValue;

  const trackRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const indicatorStyle = useIndicatorStyle(trackRef, btnRefs, activeValue);

  const handleSelect = useCallback(
    (optionValue: string) => {
      const option = options.find((o) => o.value === optionValue);
      if (!option || option.disabled || effectiveDisabled || effectiveReadOnly) return;

      if (!isControlled) {
        setUncontrolledValue(optionValue);
      }
      onChange?.(optionValue);
    },
    [options, effectiveDisabled, effectiveReadOnly, isControlled, onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const enabledOptions = options.filter((o) => !o.disabled);
      if (enabledOptions.length === 0) return;

      const currentIdx = enabledOptions.findIndex((o) => o.value === activeValue);
      let nextIdx: number | undefined;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % enabledOptions.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIdx =
          currentIdx === -1
            ? enabledOptions.length - 1
            : (currentIdx - 1 + enabledOptions.length) % enabledOptions.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIdx = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIdx = enabledOptions.length - 1;
      }

      if (nextIdx !== undefined) {
        const next = enabledOptions[nextIdx];
        handleSelect(next.value);
        btnRefs.current?.get(next.value)?.focus();
      }
    },
    [options, activeValue, handleSelect],
  );

  const rootClasses = [
    'sp-seg',
    size !== 'md' && `sp-seg--${size}`,
    block && 'sp-seg--block',
    effectiveDisabled && 'sp-seg--disabled',
    effectiveReadOnly && 'sp-seg--readonly',
    hasError && 'sp-seg--invalid',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (effectiveHidden) return null;

  return (
    <div className={rootClasses} title={effectiveRequired ? t('required') : undefined}>
      <div
        ref={trackRef}
        className="sp-seg__track"
        role="radiogroup"
        aria-label={ariaLabel || undefined}
        aria-labelledby={ariaLabelledBy || undefined}
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        aria-required={effectiveRequired || undefined}
        aria-readonly={effectiveReadOnly || undefined}
        onKeyDown={handleKeyDown}
      >
        <div className="sp-seg__indicator" style={indicatorStyle} aria-hidden />
        {options.map((option) => {
          const isActive = option.value === activeValue;

          const btnClasses = [
            'sp-seg__btn',
            isActive && 'sp-seg__btn--active',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={option.value}
              ref={(el) => {
                if (el) {
                  btnRefs.current.set(option.value, el);
                } else {
                  btnRefs.current.delete(option.value);
                }
              }}
              type="button"
              className={btnClasses}
              role="radio"
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              disabled={option.disabled || effectiveDisabled}
              onClick={() => handleSelect(option.value)}
            >
              {option.icon && <Icon name={option.icon} size={14} />}
              {option.label}
            </button>
          );
        })}
      </div>
      {errorMessage && <p className="sp-seg__error" role="alert" id={errorId}>{errorMessage}</p>}
      {!errorMessage && effectiveHint && <p className="sp-seg__hint" id={hintId}>{effectiveHint}</p>}
    </div>
  );
}
