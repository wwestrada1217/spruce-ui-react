import { createContext, useContext } from 'react';
import type {
  FormBorder,
  FormChrome,
  FormRadius,
  FormValidationError,
} from './form-types.js';

export interface FormFieldContextValue {
  controlId?: string;
  labelId?: string;
  describedBy?: string;
  label?: string;
  floatingLabel: boolean;
  required: boolean;
  invalid: boolean;
  disabled: boolean;
  readOnly: boolean;
  hidden: boolean;
  errors: readonly FormValidationError[];
  hint?: string;
  chrome?: FormChrome;
  radius?: FormRadius;
  border?: FormBorder;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export const FormFieldProvider = FormFieldContext.Provider;

/** Read the nearest Field contract from a custom or library form control. */
export function useFormFieldContext(): FormFieldContextValue | null {
  return useContext(FormFieldContext);
}
