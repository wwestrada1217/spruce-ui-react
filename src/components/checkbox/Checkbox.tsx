/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Checkbox.css';
import { useId, type ReactNode, type ChangeEvent, type FocusEvent } from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';

export interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  error?: string;
  errors?: readonly FormValidationError[];
  invalid?: boolean;
  required?: boolean;
  hint?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  tabIndex?: number;
  className?: string;
  children?: ReactNode;
  id?: string;
  name?: string;
  value?: string;
}

export function Checkbox({
  checked = false,
  disabled = false,
  readOnly = false,
  hidden = false,
  indeterminate = false,
  onChange,
  onBlur,
  onFocus,
  error,
  errors,
  invalid,
  required = false,
  hint,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  tabIndex,
  className = '',
  children,
  id,
  name,
  value,
}: CheckboxProps) {
  const { t } = useI18n();
  const field = useFormFieldContext();
  const generatedId = useId().replace(/:/g, '');
  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const effectiveHidden = hidden || Boolean(field?.hidden);
  const effectiveRequired = required || Boolean(field?.required);
  const errorMessage = firstFormError(errors || field?.errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const effectiveHint = hint || field?.hint;
  const errorId = `${id ?? `sp-checkbox-${generatedId}`}-error`;
  const hintId = `${id ?? `sp-checkbox-${generatedId}`}-hint`;
  const describedBy = ariaDescribedBy || field?.describedBy || (errorMessage ? errorId : effectiveHint ? hintId : undefined);
  if (effectiveHidden) return null;
  const classes = [
    'sp-checkbox',
    effectiveDisabled && 'sp-checkbox--disabled',
    checked && 'sp-checkbox--checked',
    indeterminate && 'sp-checkbox--indeterminate',
    hasError && 'sp-checkbox--invalid',
    effectiveReadOnly && 'sp-checkbox--readonly',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (effectiveDisabled || effectiveReadOnly) return;
    onChange?.(e.target.checked);
  }

  return (
    <>
      <label className={classes} title={effectiveRequired ? t('required') : undefined}>
      <span className="sp-checkbox__box">
        {checked && !indeterminate && <Icon name="check" size={12} />}
        {indeterminate && <Icon name="minus" size={12} />}
      </span>
      <input
        type="checkbox"
        className="sp-checkbox__input"
        checked={checked}
        disabled={effectiveDisabled}
        aria-label={ariaLabel || undefined}
        aria-labelledby={ariaLabelledBy || undefined}
        aria-describedby={describedBy || undefined}
        aria-invalid={hasError || undefined}
        aria-required={effectiveRequired || undefined}
        aria-readonly={effectiveReadOnly || undefined}
        tabIndex={tabIndex}
        id={id}
        name={name}
        value={value}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate;
        }}
        onClick={(event) => {
          if (effectiveReadOnly) event.preventDefault();
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={handleChange}
      />
      <span className="sp-checkbox__label">{children}</span>
      </label>
      {errorMessage && (
        <p className="sp-checkbox-error" role="alert" id={errorId}>
          {errorMessage}
        </p>
      )}
      {!errorMessage && effectiveHint && (
        <p className="sp-checkbox-hint" id={hintId}>
          {effectiveHint}
        </p>
      )}
    </>
  );
}
