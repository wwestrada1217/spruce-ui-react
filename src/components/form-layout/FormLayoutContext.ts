import { createContext, useContext } from 'react';
import type { FormLayoutGap, FormLayoutMode } from './FormLayout.js';

export interface FormLayoutContextValue {
  mode: FormLayoutMode;
  gap: FormLayoutGap;
  labelWidth?: string;
  responsive: boolean;
}

const FormLayoutContext = createContext<FormLayoutContextValue | null>(null);

export const FormLayoutProvider = FormLayoutContext.Provider;

export function useFormLayoutContext(): FormLayoutContextValue | null {
  return useContext(FormLayoutContext);
}
