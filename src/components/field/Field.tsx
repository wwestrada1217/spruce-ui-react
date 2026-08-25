import './Field.css';
import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFormLayoutContext } from '../form-layout/FormLayoutContext.js';
import { FormFieldProvider } from './FormFieldContext.js';
import type {
  FormBorder,
  FormChrome,
  FormRadius,
  FormValidationError,
} from './form-types.js';

export type {
  FormBorder,
  FormChrome,
  FormRadius,
  FormValidationError,
  FormControlContractProps,
} from './form-types.js';

export type FieldLayout = 'vertical' | 'inline';

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: ReactNode;
  label?: string;
  /** The id of the control labelled by this field. */
  labelFor?: string;
  required?: boolean;
  helperText?: string;
  errorText?: string;
  successText?: string;
  errors?: readonly FormValidationError[];
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  floatingLabel?: boolean;
  layout?: FieldLayout;
  labelWidth?: string;
  stackOnMobile?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  chrome?: FormChrome;
  radius?: FormRadius;
  border?: FormBorder;
  style?: CSSProperties;
}

function joinIds(...values: Array<string | undefined>): string | undefined {
  const ids = values.flatMap((value) => value?.split(/\s+/) ?? []).filter(Boolean);
  return ids.length > 0 ? Array.from(new Set(ids)).join(' ') : undefined;
}

function enhanceControl(
  children: ReactNode,
  props: Record<string, unknown>,
): ReactNode {
  if (Children.count(children) !== 1 || !isValidElement(children)) return children;
  const element = children as ReactElement<Record<string, unknown>>;
  return cloneElement(element, props);
}

export function Field({
  children,
  label,
  labelFor,
  required = false,
  helperText,
  errorText,
  successText,
  errors = [],
  invalid = false,
  disabled = false,
  readOnly = false,
  hidden = false,
  floatingLabel = false,
  layout = 'vertical',
  labelWidth,
  stackOnMobile = false,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  chrome,
  radius,
  border,
  className,
  style,
  ...rest
}: FieldProps) {
  const { direction, t } = useI18n();
  const layoutContext = useFormLayoutContext();
  const reactId = useId().replace(/:/g, '');
  const idBase = labelFor || `sp-field-${reactId}`;
  const labelId = label ? `${idBase}-label` : undefined;
  const errorMessage = errorText || errors[0]?.message;
  const helperId = helperText && !errorMessage && !successText ? `${idBase}-helper` : undefined;
  const errorId = errorMessage ? `${idBase}-error` : undefined;
  const successId = successText && !errorMessage ? `${idBase}-success` : undefined;
  const describedBy = joinIds(ariaDescribedBy, helperId, errorId, successId);
  const hasError = invalid || Boolean(errorMessage);
  const effectiveLayout: FieldLayout =
    layout !== 'vertical'
      ? layout
      : layoutContext?.mode === 'horizontal'
        ? 'inline'
        : 'vertical';
  const effectiveLabelWidth = labelWidth || layoutContext?.labelWidth;
  const fieldClasses = [
    'sp-field',
    effectiveLayout === 'inline' && 'sp-field--inline',
    stackOnMobile && 'sp-field--stack-on-mobile',
    hasError && 'sp-field--error',
    !hasError && Boolean(successText) && 'sp-field--success',
    disabled && 'sp-field--disabled',
    readOnly && 'sp-field--readonly',
    chrome && `sp-field--chrome-${chrome}`,
    className,
  ].filter(Boolean).join(' ');
  const fieldStyle = {
    ...style,
    ...(effectiveLabelWidth ? { '--sp-field-label-width': effectiveLabelWidth } : {}),
  } as CSSProperties;

  const controlProps: Record<string, unknown> = {};
  if (labelFor) controlProps.id = labelFor;
  if (disabled) controlProps.disabled = true;
  if (readOnly) controlProps.readOnly = true;
  if (hidden) controlProps.hidden = true;
  if (required) controlProps.required = true;
  if (hasError) {
    controlProps.invalid = true;
    controlProps['aria-invalid'] = true;
  }
  if (errors.length > 0) controlProps.errors = errors;
  if (ariaLabel) {
    controlProps.ariaLabel = ariaLabel;
    controlProps['aria-label'] = ariaLabel;
  }
  const labelledBy = ariaLabelledBy || (!labelFor ? labelId : undefined);
  if (labelledBy) {
    controlProps.ariaLabelledBy = labelledBy;
    controlProps['aria-labelledby'] = labelledBy;
  }
  if (describedBy) {
    controlProps.ariaDescribedBy = describedBy;
    controlProps['aria-describedby'] = describedBy;
  }
  if (required) controlProps['aria-required'] = true;
  if (readOnly) controlProps['aria-readonly'] = true;
  const control = enhanceControl(children, controlProps);

  return (
    <FormFieldProvider
      value={{
        controlId: labelFor,
        labelId,
        describedBy,
        label,
        floatingLabel,
        required,
        invalid: hasError,
        disabled,
        readOnly,
        hidden,
        errors,
        hint: helperText,
        chrome,
        radius,
        border,
      }}
    >
      <div
        {...rest}
        className={fieldClasses}
        style={fieldStyle}
        dir={direction}
        hidden={hidden || undefined}
      >
        {label && (
          <label className="sp-field__label" id={labelId} htmlFor={labelFor}>
            {label}
            {required && (
              <span className="sp-field__required" aria-hidden="true" title={t('required')}>
                *
              </span>
            )}
          </label>
        )}
        <div className="sp-field__body">
          <div className="sp-field__control">{control}</div>
          {helperText && !errorMessage && !successText && (
            <p className="sp-field__helper" id={helperId}>{helperText}</p>
          )}
          {errorMessage && (
            <p className="sp-field__feedback sp-field__feedback--error" role="alert" id={errorId}>
              <span className="sp-field__feedback-icon" aria-hidden="true">!</span>
              {errorMessage}
            </p>
          )}
          {successText && !errorMessage && (
            <p className="sp-field__feedback sp-field__feedback--success" id={successId}>
              <span className="sp-field__feedback-icon" aria-hidden="true">✓</span>
              {successText}
            </p>
          )}
        </div>
      </div>
    </FormFieldProvider>
  );
}
