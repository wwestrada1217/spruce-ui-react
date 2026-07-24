/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import React from 'react';
import { Icon } from '../../icons/Icon.js';
import './Input.css';

export type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  type?: InputType;
  size?: InputSize;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  iconLeft?: string | null;
  iconRight?: string | null;
  error?: string;
  hint?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
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
  clearable = false,
  iconLeft = null,
  iconRight = null,
  error,
  hint,
  required = false,
  min,
  max,
  step,
  className,
  id,
  name,
  autoComplete,
}: InputProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const hasError = Boolean(error);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  }

  function handleClear() {
    if (!isControlled) setInternalValue('');
    onChange?.('');
  }

  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;

  const wrapCls = [
    'sp-input-wrap',
    size === 'sm' ? 'sp-input-wrap--sm' : '',
    size === 'lg' ? 'sp-input-wrap--lg' : '',
    disabled ? 'sp-input-wrap--disabled' : '',
    hasError ? 'sp-input-wrap--error' : '',
    focused ? 'sp-input-wrap--focused' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div>
      <div className={wrapCls}>
        {iconLeft && (
          <Icon name={iconLeft} size={iconSize} className="sp-input-wrap__icon" />
        )}
        <input
          id={id}
          name={name}
          className="sp-input-wrap__field"
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          value={currentValue}
          min={min}
          max={max}
          step={step}
          aria-invalid={hasError || undefined}
          aria-required={required || undefined}
          autoComplete={autoComplete}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {clearable && currentValue && (
          <button
            className="sp-input-wrap__clear"
            type="button"
            tabIndex={-1}
            onClick={handleClear}
            aria-label="Clear"
          >
            <Icon name="x" size={12} />
          </button>
        )}
        {iconRight && (
          <Icon name={iconRight} size={iconSize} className="sp-input-wrap__icon" />
        )}
      </div>
      {hasError && (
        <p className="sp-input-error" role="alert">{error}</p>
      )}
      {hint && !hasError && (
        <p className="sp-input-hint">{hint}</p>
      )}
    </div>
  );
}
