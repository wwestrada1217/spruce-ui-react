export type FormChrome = 'default' | 'outlined' | 'filled' | 'elevated' | 'ghost' | 'flush';
export type FormRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type FormBorder = 'default' | 'none' | 'subtle' | 'strong';

/** A framework-neutral validation error used by controlled React form controls. */
export interface FormValidationError {
  message: string;
  code?: string;
  path?: string;
}

/** Shared state and accessibility inputs for Spruce form controls. */
export interface FormControlContractProps {
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  invalid?: boolean;
  errors?: readonly FormValidationError[];
  required?: boolean;
  label?: string;
  floatingLabel?: boolean;
  hint?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  chrome?: FormChrome;
  radius?: FormRadius;
  border?: FormBorder;
}

export function firstFormError(
  errors: readonly FormValidationError[] | undefined,
  fallback?: string,
): string | undefined {
  return fallback || errors?.[0]?.message;
}
