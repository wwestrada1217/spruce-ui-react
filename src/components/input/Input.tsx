/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import React from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormBorder, type FormChrome, type FormRadius, type FormValidationError } from '../field/form-types.js';
import './Input.css';

export type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url' | 'date' | 'time';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'outline' | 'outlined' | 'filled';

export interface InputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  type?: InputType;
  size?: InputSize;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  clearable?: boolean;
  iconLeft?: string | null;
  iconRight?: string | null;
  error?: string;
  errors?: readonly FormValidationError[];
  invalid?: boolean;
  hint?: string;
  required?: boolean;
  label?: string;
  floatingLabel?: boolean;
  variant?: InputVariant;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaReadonly?: boolean;
  chrome?: FormChrome;
  radius?: FormRadius;
  border?: FormBorder;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function Input({
  value,
  defaultValue = '',
  onChange,
  type = 'text',
  size = 'md',
  placeholder = '',
  disabled = false,
  readOnly = false,
  hidden = false,
  clearable = false,
  iconLeft = null,
  iconRight = null,
  error,
  errors,
  invalid,
  hint,
  required = false,
  label = '',
  floatingLabel = false,
  variant = 'default',
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  ariaReadonly,
  chrome,
  radius,
  border,
  min,
  max,
  step,
  className,
  id,
  name,
  autoComplete,
  onFocus,
  onBlur,
}: InputProps) {
  const { t } = useI18n();
  const field = useFormFieldContext();
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
  const effectiveAriaLabel = ariaLabel || undefined;
  const effectiveAriaLabelledBy = ariaLabelledBy || undefined;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  }

  function handleClear() {
    if (effectiveReadOnly || effectiveDisabled) return;
    if (!isControlled) setInternalValue('');
    onChange?.('');
  }

  if (effectiveHidden) return null;

  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;
  const floated = effectiveFloatingLabel && (focused || Boolean(currentValue));

  const wrapCls = [
    'sp-input-wrap',
    size === 'sm' ? 'sp-input-wrap--sm' : '',
    size === 'lg' ? 'sp-input-wrap--lg' : '',
    variant === 'outline' || variant === 'outlined' ? 'sp-input-wrap--outline' : '',
    variant === 'filled' ? 'sp-input-wrap--filled' : '',
    effectiveFloatingLabel ? 'sp-input-wrap--floating' : '',
    floated ? 'sp-input-wrap--floated' : '',
    effectiveDisabled ? 'sp-input-wrap--disabled' : '',
    hasError ? 'sp-input-wrap--error' : '',
    effectiveReadOnly ? 'sp-input-wrap--readonly' : '',
    chrome ? `sp-input-wrap--chrome-${chrome}` : '',
    radius ? `sp-input-wrap--radius-${radius}` : '',
    border ? `sp-input-wrap--border-${border}` : '',
    focused ? 'sp-input-wrap--focused' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div className="sp-input">
      <div className={wrapCls}>
        {effectiveFloatingLabel && (
          <label
            className={[
              'sp-input-wrap__floating-label',
              floated && 'sp-input-wrap__floating-label--floated',
              focused && 'sp-input-wrap__floating-label--focused',
              hasError && 'sp-input-wrap__floating-label--error',
            ].filter(Boolean).join(' ')}
            htmlFor={id}
          >
            {effectiveLabel}
            {effectiveRequired && <span className="sp-input-wrap__required" aria-hidden="true">*</span>}
          </label>
        )}
        {iconLeft && (
          <Icon name={iconLeft} size={iconSize} className="sp-input-wrap__icon" />
        )}
        <input
          id={id}
          name={name}
          className="sp-input-wrap__field"
          type={type}
          placeholder={effectiveFloatingLabel && !floated ? '' : placeholder}
          disabled={effectiveDisabled}
          readOnly={effectiveReadOnly}
          value={currentValue}
          min={min}
          max={max}
          step={step}
          aria-label={effectiveAriaLabel || (!effectiveLabel ? undefined : effectiveLabel)}
          aria-labelledby={effectiveAriaLabelledBy}
          aria-describedby={effectiveDescribedBy}
          aria-invalid={hasError || undefined}
          aria-required={effectiveRequired || undefined}
          aria-readonly={ariaReadonly ?? effectiveReadOnly ? true : undefined}
          autoComplete={autoComplete}
          onChange={handleChange}
          onFocus={() => { setFocused(true); onFocus?.(); }}
          onBlur={() => { setFocused(false); onBlur?.(); }}
        />
        {clearable && currentValue && !effectiveReadOnly && (
          <button
            className="sp-input-wrap__clear"
            type="button"
            tabIndex={-1}
            onClick={handleClear}
            disabled={effectiveDisabled}
            aria-label={t('clear')}
          >
            <Icon name="x" size={12} />
          </button>
        )}
        {iconRight && (
          <Icon name={iconRight} size={iconSize} className="sp-input-wrap__icon" />
        )}
      </div>
      {errorMessage && !field?.describedBy && (
        <p className="sp-input-error" role="alert">{errorMessage}</p>
      )}
      {effectiveHint && !hasError && !field?.describedBy && (
        <p className="sp-input-hint">{effectiveHint}</p>
      )}
    </div>
  );
}
