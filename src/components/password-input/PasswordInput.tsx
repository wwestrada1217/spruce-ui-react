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
import './PasswordInput.css';

export type PasswordInputSize = 'sm' | 'md' | 'lg';

export interface PasswordInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: PasswordInputSize;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  errors?: readonly FormValidationError[];
  invalid?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  variant?: 'default' | 'outline' | 'outlined' | 'filled';
  label?: string;
  floatingLabel?: boolean;
  chrome?: FormChrome;
  radius?: FormRadius;
  border?: FormBorder;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export function PasswordInput({
  value,
  defaultValue = '',
  onChange,
  size = 'md',
  placeholder = 'Enter password',
  disabled = false,
  readOnly = false,
  hidden = false,
  errors,
  invalid,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  variant = 'default',
  label = '',
  floatingLabel = false,
  chrome,
  radius,
  border,
  error,
  hint,
  required = false,
  className,
  id,
  name,
}: PasswordInputProps) {
  const { t } = useI18n();
  const field = useFormFieldContext();
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const effectiveHidden = hidden || Boolean(field?.hidden);
  const effectiveRequired = required || Boolean(field?.required);
  const effectiveLabel = label || (field?.floatingLabel ? field.label : '');
  const effectiveFloatingLabel = floatingLabel || Boolean(field?.floatingLabel);
  const effectiveHint = hint || field?.hint;
  const errorMessage = firstFormError(errors || field?.errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const effectiveChrome = chrome ?? field?.chrome;
  const effectiveRadius = radius ?? field?.radius;
  const effectiveBorder = border ?? field?.border;
  const idBase = React.useId().replace(/:/g, '');
  const errorId = `${id ?? `sp-pw-${idBase}`}-error`;
  const hintId = `${id ?? `sp-pw-${idBase}`}-hint`;
  const describedBy = ariaDescribedBy || field?.describedBy || (errorMessage ? errorId : effectiveHint ? hintId : undefined);
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  }

  const wrapCls = [
    'sp-pw',
    size === 'sm' ? 'sp-pw--sm' : '',
    size === 'lg' ? 'sp-pw--lg' : '',
    effectiveDisabled ? 'sp-pw--disabled' : '',
    effectiveReadOnly ? 'sp-pw--readonly' : '',
    variant === 'outline' || variant === 'outlined' ? 'sp-pw--outline' : '',
    variant === 'filled' ? 'sp-pw--filled' : '',
    effectiveFloatingLabel ? 'sp-pw--floating' : '',
    effectiveChrome ? `sp-pw--chrome-${effectiveChrome}` : '',
    effectiveRadius ? `sp-pw--radius-${effectiveRadius}` : '',
    effectiveBorder ? `sp-pw--border-${effectiveBorder}` : '',
    hasError ? 'sp-pw--error' : '',
    focused ? 'sp-pw--focused' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  if (effectiveHidden) return null;

  return (
    <div>
      <div className={wrapCls}>
        {effectiveFloatingLabel && <label className="sp-pw__floating-label" htmlFor={id}>
          {effectiveLabel}{effectiveRequired && <span aria-hidden="true">*</span>}
        </label>}
        <input
          id={id}
          name={name}
          className="sp-pw__field"
          type={visible ? 'text' : 'password'}
          placeholder={effectiveFloatingLabel && !focused ? '' : placeholder}
          disabled={effectiveDisabled}
          readOnly={effectiveReadOnly}
          value={currentValue}
          aria-label={ariaLabel || (!effectiveLabel ? undefined : effectiveLabel)}
          aria-labelledby={ariaLabelledBy || undefined}
          aria-describedby={describedBy}
          aria-invalid={hasError || undefined}
          aria-required={effectiveRequired || undefined}
          aria-readonly={effectiveReadOnly || undefined}
          autoComplete="current-password"
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <button
          className="sp-pw__toggle"
          type="button"
          tabIndex={-1}
          aria-label={visible ? t('enterPassword') : t('enterPassword')}
          onClick={() => setVisible(v => !v)}
          disabled={effectiveDisabled}
          aria-pressed={visible}
        >
          <Icon name={visible ? 'eye-off' : 'eye'} size={iconSize} />
        </button>
      </div>
      {errorMessage && (
        <p className="sp-pw-error" role="alert" id={errorId}>{errorMessage}</p>
      )}
      {effectiveHint && !hasError && (
        <p className="sp-pw-hint" id={hintId}>{effectiveHint}</p>
      )}
    </div>
  );
}
