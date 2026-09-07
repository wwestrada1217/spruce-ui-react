import './DateControl.css';
import { useId, type AriaAttributes } from 'react';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';

export type DateControlVariant = 'default' | 'outline' | 'outlined' | 'filled';

export interface DateControlContractProps {
  readOnly?: boolean;
  hidden?: boolean;
  invalid?: boolean;
  error?: string;
  errors?: readonly FormValidationError[];
  required?: boolean;
  touched?: boolean;
  onTouchedChange?: (touched: boolean) => void;
  onBlur?: () => void;
  label?: string;
  floatingLabel?: boolean;
  hint?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  id?: string;
}

export interface DateControlContractOptions extends DateControlContractProps {
  disabled?: boolean;
  valuePresent?: boolean;
}

export function useDateControlContract({
  disabled = false,
  readOnly = false,
  hidden = false,
  invalid,
  error,
  errors,
  required = false,
  touched = false,
  onTouchedChange,
  onBlur,
  label = '',
  floatingLabel = false,
  hint,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  id,
  valuePresent = false,
}: DateControlContractOptions) {
  const field = useFormFieldContext();
  const generatedId = useId().replace(/:/g, '');
  const controlId = id ?? field?.controlId ?? `sp-date-control-${generatedId}`;
  const errorMessage = firstFormError(errors ?? field?.errors, error);
  const effectiveHint = hint ?? field?.hint;
  const errorId = `${controlId}-error`;
  const hintId = `${controlId}-hint`;
  const effectiveLabel = label || field?.label || '';
  const effectiveFloatingLabel = floatingLabel || Boolean(field?.floatingLabel);
  const describedBy = ariaDescribedBy || field?.describedBy || (errorMessage ? errorId : effectiveHint ? hintId : undefined);

  return {
    id: controlId,
    disabled: disabled || Boolean(field?.disabled),
    readOnly: readOnly || Boolean(field?.readOnly),
    hidden: hidden || Boolean(field?.hidden),
    invalid: Boolean(errorMessage) || Boolean(invalid ?? field?.invalid),
    required: required || Boolean(field?.required),
    touched,
    label: effectiveLabel,
    floatingLabel: effectiveFloatingLabel,
    floated: effectiveFloatingLabel && valuePresent,
    errorMessage,
    hint: effectiveHint,
    errorId,
    hintId,
    aria: {
      'aria-label': ariaLabel || (!effectiveLabel ? undefined : effectiveLabel),
      'aria-labelledby': ariaLabelledBy || field?.labelId,
      'aria-describedby': describedBy,
      'aria-invalid': Boolean(errorMessage) || Boolean(invalid ?? field?.invalid) || undefined,
      'aria-required': required || Boolean(field?.required) || undefined,
      'aria-readonly': readOnly || Boolean(field?.readOnly) || undefined,
    } satisfies AriaAttributes,
    markTouched() {
      if (!touched) onTouchedChange?.(true);
      onBlur?.();
    },
  };
}
