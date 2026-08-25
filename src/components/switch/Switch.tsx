/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import React from 'react';
import './Switch.css';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  error?: string;
  errors?: readonly FormValidationError[];
  invalid?: boolean;
  required?: boolean;
  hint?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  icon?: string | null;
  checkedIcon?: string | null;
  uncheckedIcon?: string | null;
  showIcon?: boolean;
  thumbIconSize?: number;
  children?: React.ReactNode;
  className?: string;
}

export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  readOnly = false,
  hidden = false,
  error,
  errors,
  invalid,
  required = false,
  hint,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  icon = null,
  checkedIcon = null,
  uncheckedIcon = null,
  showIcon = false,
  thumbIconSize = 10,
  children,
  className,
}: SwitchProps) {
  const { t } = useI18n();
  const field = useFormFieldContext();
  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const effectiveHidden = hidden || Boolean(field?.hidden);
  const errorMessage = firstFormError(errors || field?.errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const effectiveRequired = required || Boolean(field?.required);
  const effectiveHint = hint || field?.hint;
  const idBase = React.useId().replace(/:/g, '');
  const errorId = `sp-switch-${idBase}-error`;
  const hintId = `sp-switch-${idBase}-hint`;
  const describedBy = ariaDescribedBy || field?.describedBy || (errorMessage ? errorId : effectiveHint ? hintId : undefined);
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;
  const activeIcon = isChecked
    ? checkedIcon ?? (showIcon ? 'check' : icon)
    : uncheckedIcon ?? (showIcon ? null : icon);

  function handleToggle() {
    if (effectiveDisabled || effectiveReadOnly) return;
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  }

  const cls = [
    'sp-switch',
    isChecked ? 'sp-switch--checked' : '',
    effectiveDisabled ? 'sp-switch--disabled' : '',
    effectiveReadOnly ? 'sp-switch--readonly' : '',
    hasError ? 'sp-switch--invalid' : '',
    activeIcon ? 'sp-switch--has-icon' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  if (effectiveHidden) return null;

  return (
    <>
    <label className={cls} title={effectiveRequired ? t('required') : undefined}>
      <button
        className="sp-switch__track"
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={effectiveDisabled}
        aria-label={ariaLabel || undefined}
        aria-labelledby={ariaLabelledBy || undefined}
        aria-describedby={describedBy}
        aria-readonly={effectiveReadOnly || undefined}
        aria-invalid={hasError || undefined}
        aria-required={effectiveRequired || undefined}
        onClick={handleToggle}
      >
        <span className={['sp-switch__thumb', activeIcon && 'sp-switch__thumb--has-icon'].filter(Boolean).join('')}>
          {activeIcon && <Icon name={activeIcon} size={thumbIconSize} className="sp-switch__thumb-icon" />}
        </span>
      </button>
      {children && <span className="sp-switch__label">{children}</span>}
    </label>
    {errorMessage && <p className="sp-switch__error" role="alert" id={errorId}>{errorMessage}</p>}
    {!errorMessage && effectiveHint && <p className="sp-switch__hint" id={hintId}>{effectiveHint}</p>}
    </>
  );
}
