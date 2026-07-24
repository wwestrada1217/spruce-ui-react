/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import React from 'react';
import { Icon } from '../../icons/Icon.js';
import './PasswordInput.css';

export type PasswordInputSize = 'sm' | 'md' | 'lg';

export interface PasswordInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: PasswordInputSize;
  placeholder?: string;
  disabled?: boolean;
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
  error,
  hint,
  required = false,
  className,
  id,
  name,
}: PasswordInputProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const hasError = Boolean(error);
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
    disabled ? 'sp-pw--disabled' : '',
    hasError ? 'sp-pw--error' : '',
    focused ? 'sp-pw--focused' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div>
      <div className={wrapCls}>
        <input
          id={id}
          name={name}
          className="sp-pw__field"
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          disabled={disabled}
          value={currentValue}
          aria-invalid={hasError || undefined}
          aria-required={required || undefined}
          autoComplete="current-password"
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <button
          className="sp-pw__toggle"
          type="button"
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible(v => !v)}
          disabled={disabled}
        >
          <Icon name={visible ? 'eye-off' : 'eye'} size={iconSize} />
        </button>
      </div>
      {hasError && (
        <p className="sp-pw-error" role="alert">{error}</p>
      )}
      {hint && !hasError && (
        <p className="sp-pw-hint">{hint}</p>
      )}
    </div>
  );
}
