/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import React from 'react';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormBorder, type FormChrome, type FormRadius, type FormValidationError } from '../field/form-types.js';
import './Textarea.css';

export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';
export type TextareaVariant = 'default' | 'outline' | 'outlined' | 'filled';

export interface TextareaProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: TextareaSize;
  placeholder?: string;
  rows?: number;
  resize?: TextareaResize;
  maxLength?: number;
  showCount?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  error?: string;
  errors?: readonly FormValidationError[];
  invalid?: boolean;
  hint?: string;
  required?: boolean;
  label?: string;
  floatingLabel?: boolean;
  variant?: TextareaVariant;
  chrome?: FormChrome;
  radius?: FormRadius;
  border?: FormBorder;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaReadonly?: boolean;
  className?: string;
  id?: string;
  name?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function Textarea({
  value,
  defaultValue = '',
  onChange,
  size = 'md',
  placeholder = '',
  rows = 4,
  resize = 'vertical',
  maxLength,
  showCount = true,
  disabled = false,
  readOnly = false,
  hidden = false,
  error,
  errors,
  invalid,
  hint,
  required = false,
  label = '',
  floatingLabel = false,
  variant = 'default',
  chrome,
  radius,
  border,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  ariaReadonly,
  className,
  id,
  name,
  onFocus,
  onBlur,
}: TextareaProps) {
  const field = useFormFieldContext();
  const generatedId = React.useId().replace(/:/g, '');
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const errorMessage = firstFormError(errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const effectiveHidden = hidden || Boolean(field?.hidden);
  const effectiveRequired = required || Boolean(field?.required);
  const effectiveLabel = label || (field?.floatingLabel ? field.label : '');
  const effectiveFloatingLabel = floatingLabel || Boolean(field?.floatingLabel);
  const effectiveHint = hint || field?.hint;
  const effectiveDescribedBy = ariaDescribedBy || field?.describedBy;
  const effectiveChrome = chrome ?? field?.chrome;
  const effectiveRadius = radius ?? field?.radius;
  const effectiveBorder = border ?? field?.border;
  const errorId = `${id ?? `sp-textarea-${generatedId}`}-error`;
  const hintId = `${id ?? `sp-textarea-${generatedId}`}-hint`;
  const describedBy = effectiveDescribedBy || (errorMessage ? errorId : effectiveHint ? hintId : undefined);
  const floated = effectiveFloatingLabel && (focused || Boolean(currentValue));
  const charCount = currentValue.length;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  }

  const wrapCls = [
    'sp-textarea',
    size === 'sm' ? 'sp-textarea--sm' : '',
    size === 'lg' ? 'sp-textarea--lg' : '',
    variant === 'outline' || variant === 'outlined' ? 'sp-textarea--outline' : '',
    variant === 'filled' ? 'sp-textarea--filled' : '',
    effectiveFloatingLabel ? 'sp-textarea--floating' : '',
    floated ? 'sp-textarea--floated' : '',
    effectiveDisabled ? 'sp-textarea--disabled' : '',
    hasError ? 'sp-textarea--error' : '',
    effectiveReadOnly ? 'sp-textarea--readonly' : '',
    effectiveChrome ? `sp-textarea--chrome-${effectiveChrome}` : '',
    effectiveRadius ? `sp-textarea--radius-${effectiveRadius}` : '',
    effectiveBorder ? `sp-textarea--border-${effectiveBorder}` : '',
    focused ? 'sp-textarea--focused' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  const countCls = [
    'sp-textarea__count',
    maxLength !== undefined && charCount >= maxLength ? 'sp-textarea__count--limit' : '',
  ].filter(Boolean).join(' ');

  if (effectiveHidden) return null;

  return (
    <div className="sp-textarea-field">
      <div className={wrapCls}>
        {effectiveFloatingLabel && (
          <label
            className={[
              'sp-textarea__floating-label',
              floated && 'sp-textarea__floating-label--floated',
              focused && 'sp-textarea__floating-label--focused',
              hasError && 'sp-textarea__floating-label--error',
            ].filter(Boolean).join(' ')}
            htmlFor={id}
          >
            {effectiveLabel}
            {effectiveRequired && <span className="sp-textarea__required" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          id={id}
          name={name}
          className="sp-textarea__field"
          placeholder={effectiveFloatingLabel && !floated ? '' : placeholder}
          disabled={effectiveDisabled}
          readOnly={effectiveReadOnly}
          rows={rows}
          value={currentValue}
          maxLength={maxLength}
          aria-label={ariaLabel || (!effectiveLabel ? undefined : effectiveLabel)}
          aria-labelledby={ariaLabelledBy || undefined}
          aria-describedby={describedBy}
          aria-invalid={hasError || undefined}
          aria-required={effectiveRequired || undefined}
          aria-readonly={ariaReadonly ?? effectiveReadOnly ? true : undefined}
          style={{ resize }}
          onChange={handleChange}
          onFocus={() => { setFocused(true); onFocus?.(); }}
          onBlur={() => { setFocused(false); onBlur?.(); }}
        />
        {maxLength !== undefined && showCount && (
          <div className="sp-textarea__footer">
            <span className={countCls}>{charCount} / {maxLength}</span>
          </div>
        )}
      </div>
      {errorMessage && !field?.describedBy && (
        <p className="sp-textarea__error" role="alert" id={errorId}>{errorMessage}</p>
      )}
      {effectiveHint && !hasError && !field?.describedBy && (
        <p className="sp-textarea__hint" id={hintId}>{effectiveHint}</p>
      )}
    </div>
  );
}
