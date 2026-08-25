/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import React from 'react';
import './OtpInput.css';
import { useId } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';

export type OtpInputSize = 'sm' | 'md' | 'lg';

export interface OtpInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  size?: OtpInputSize;
  separator?: boolean;
  separatorChar?: string;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  invalid?: boolean;
  errors?: readonly FormValidationError[];
  required?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  error?: string;
  hint?: string;
  className?: string;
}

export function OtpInput({
  value = '',
  onChange,
  onComplete,
  length = 6,
  size = 'md',
  separator = false,
  separatorChar = '-',
  disabled = false,
  readOnly = false,
  hidden = false,
  invalid,
  errors,
  required = false,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  error,
  hint,
  className,
}: OtpInputProps) {
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
  const errorId = `sp-otp-${instanceId}-error`;
  const hintId = `sp-otp-${instanceId}-hint`;
  const describedBy = ariaDescribedBy || field?.describedBy || (errorMessage ? errorId : effectiveHint ? hintId : undefined);
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  // Derive digits from value prop
  const digits = React.useMemo(() => {
    const chars = (value || '').split('').slice(0, length);
    while (chars.length < length) chars.push('');
    return chars;
  }, [value, length]);

  function focusCell(idx: number) {
    const el = inputsRef.current[idx];
    if (el) { el.focus(); el.select(); }
  }

  function emitValue(newDigits: string[]) {
    const val = newDigits.join('');
    onChange?.(val);
    if (val.length === length && !newDigits.includes('')) {
      onComplete?.(val);
    }
  }

  function updateDigit(idx: number, char: string): string[] {
    const next = [...digits];
    while (next.length < length) next.push('');
    next[idx] = char;
    return next;
  }

  function handleInput(e: React.FormEvent<HTMLInputElement>, idx: number) {
    const input = e.target as HTMLInputElement;
    const char = input.value.replace(/[^0-9]/g, '').slice(-1);
    const next = updateDigit(idx, char);
    emitValue(next);
    if (char && idx < length - 1) focusCell(idx + 1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, idx: number) {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits[idx]) {
        emitValue(updateDigit(idx, ''));
      } else if (idx > 0) {
        focusCell(idx - 1);
        const next = [...digits];
        while (next.length < length) next.push('');
        next[idx - 1] = '';
        emitValue(next);
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault();
      focusCell(idx - 1);
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      e.preventDefault();
      focusCell(idx + 1);
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>, idx: number) {
    e.preventDefault();
    const pasted = (e.clipboardData.getData('text') || '').replace(/[^0-9]/g, '');
    const next = [...digits];
    while (next.length < length) next.push('');
    for (let i = 0; i < pasted.length && idx + i < length; i++) {
      next[idx + i] = pasted[i];
    }
    emitValue(next);
    const nextIdx = Math.min(idx + pasted.length, length - 1);
    focusCell(nextIdx);
  }

  const sepIdx = Math.floor(length / 2) - 1;

  const wrapCls = [
    'sp-otp',
    size === 'sm' ? 'sp-otp--sm' : '',
    size === 'lg' ? 'sp-otp--lg' : '',
    effectiveDisabled ? 'sp-otp--disabled' : '',
    effectiveReadOnly ? 'sp-otp--readonly' : '',
    hasError ? 'sp-otp--error' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  if (effectiveHidden) return null;

  return (
    <div>
      <div className={wrapCls}>
        {Array.from({ length }, (_, i) => (
          <React.Fragment key={i}>
            <input
              ref={el => { inputsRef.current[i] = el; }}
              className={[
                'sp-otp__cell',
                digits[i] ? 'sp-otp__cell--filled' : '',
              ].filter(Boolean).join(' ')}
              type="text"
              inputMode="numeric"
              maxLength={1}
              autoComplete="one-time-code"
              disabled={effectiveDisabled}
              readOnly={effectiveReadOnly}
              value={digits[i] || ''}
              aria-label={`${ariaLabel || t('codeBlock')} ${i + 1} of ${length}`}
              aria-labelledby={ariaLabelledBy || undefined}
              aria-describedby={describedBy}
              aria-invalid={hasError || undefined}
              aria-required={effectiveRequired || undefined}
              onInput={(e) => handleInput(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={(e) => handlePaste(e, i)}
              onChange={() => {/* controlled via onInput */}}
            />
            {separator && i === sepIdx && length > 2 && (
              <span className="sp-otp__sep">{separatorChar}</span>
            )}
          </React.Fragment>
        ))}
      </div>
      {errorMessage && (
        <p className="sp-otp__error" role="alert" id={errorId}>{errorMessage}</p>
      )}
      {effectiveHint && !hasError && (
        <p className="sp-otp__hint" id={hintId}>{effectiveHint}</p>
      )}
    </div>
  );
}
