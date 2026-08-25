import './Radio.css';
import { createContext, useContext, useId, type FocusEvent, type ReactNode } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';

interface RadioGroupContextValue {
  value: string;
  disabled: boolean;
  readOnly: boolean;
  groupName: string;
  onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  value?: string;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  orientation?: 'vertical' | 'horizontal';
  onChange?: (value: string) => void;
  error?: string;
  errors?: readonly FormValidationError[];
  invalid?: boolean;
  required?: boolean;
  hint?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  className?: string;
  children?: ReactNode;
}

export function RadioGroup({
  value = '', disabled = false, readOnly = false, hidden = false,
  orientation = 'vertical', onChange, error, errors, invalid = false,
  required = false, hint, ariaLabel, ariaLabelledBy, ariaDescribedBy,
  className = '', children,
}: RadioGroupProps) {
  const { t } = useI18n();
  const groupId = useId().replace(/:/g, '');
  const errorMessage = firstFormError(errors, error);
  const errorId = `sp-radio-group-${groupId}-error`;
  const hintId = `sp-radio-group-${groupId}-hint`;
  const describedBy = ariaDescribedBy || (errorMessage ? errorId : hint ? hintId : undefined);
  if (hidden) return null;

  const classes = [
    'sp-radio-group',
    orientation === 'horizontal' && 'sp-radio-group--horizontal',
    disabled && 'sp-radio-group--disabled',
    readOnly && 'sp-radio-group--readonly',
    (invalid || Boolean(errorMessage)) && 'sp-radio-group--invalid',
    className,
  ].filter(Boolean).join(' ');

  return (
    <RadioGroupContext.Provider value={{
      value, disabled, readOnly, groupName: `sp-radio-group-${groupId}`,
      onChange: onChange ?? (() => undefined),
    }}>
      <div className={classes} role="radiogroup" aria-label={ariaLabel || undefined}
        aria-labelledby={ariaLabelledBy || undefined} aria-describedby={describedBy}
        aria-invalid={invalid || Boolean(errorMessage) || undefined}
        aria-required={required || undefined} aria-readonly={readOnly || undefined}
        title={required ? t('required') : undefined}>
        {children}
      </div>
      {errorMessage && <p className="sp-radio-group__error" role="alert" id={errorId}>{errorMessage}</p>}
      {!errorMessage && hint && <p className="sp-radio-group__hint" id={hintId}>{hint}</p>}
    </RadioGroupContext.Provider>
  );
}

export interface RadioProps {
  value: string;
  disabled?: boolean;
  readOnly?: boolean;
  ariaLabel?: string;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  className?: string;
  children?: ReactNode;
  id?: string;
}

export function Radio({ value, disabled = false, readOnly = false, ariaLabel, onBlur, onFocus,
  className = '', children, id }: RadioProps) {
  const group = useContext(RadioGroupContext);
  const isChecked = group ? group.value === value : false;
  const isDisabled = disabled || (group?.disabled ?? false);
  const isReadOnly = readOnly || (group?.readOnly ?? false);
  const classes = ['sp-radio', isDisabled && 'sp-radio--disabled', isReadOnly && 'sp-radio--readonly',
    isChecked && 'sp-radio--checked', className].filter(Boolean).join(' ');

  function handleChange() {
    if (isDisabled || isReadOnly) return;
    group?.onChange(value);
  }

  return (
    <label className={classes}>
      <span className="sp-radio__circle"><span className="sp-radio__dot" /></span>
      <input type="radio" className="sp-radio__input" name={group?.groupName} value={value}
        checked={isChecked} disabled={isDisabled} aria-label={ariaLabel || undefined}
        aria-readonly={isReadOnly || undefined} id={id}
        onClick={(event) => { if (isReadOnly) event.preventDefault(); }}
        onFocus={onFocus} onBlur={onBlur} onChange={handleChange} />
      <span className="sp-radio__label">{children}</span>
    </label>
  );
}
