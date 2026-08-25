import './InputGroup.css';
import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { useI18n } from '../../i18n/i18n-context.js';

export type InputGroupSize = 'sm' | 'md' | 'lg';
export type InputGroupLayout = 'inline' | 'composition';
export type InputGroupButtonVariant = 'default' | 'ghost' | 'soft';

interface InputGroupContextValue {
  size: InputGroupSize;
  layout: InputGroupLayout;
  disabled: boolean;
  invalid: boolean;
}

const InputGroupContext = createContext<InputGroupContextValue | null>(null);

export interface InputGroupProps {
  children?: ReactNode;
  size?: InputGroupSize;
  layout?: InputGroupLayout;
  disabled?: boolean;
  invalid?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  role?: React.AriaRole | '';
  hideAddonBackground?: boolean;
  hideAddonSeparator?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function InputGroup({
  children,
  size = 'md',
  layout = 'inline',
  disabled = false,
  invalid = false,
  ariaLabel = '',
  ariaLabelledBy,
  role = 'group',
  hideAddonBackground = false,
  hideAddonSeparator = false,
  className,
  style,
}: InputGroupProps) {
  const { direction } = useI18n();
  const classes = [
    'sp-input-group',
    size !== 'md' && `sp-input-group--${size}`,
    layout === 'composition' && 'sp-input-group--composition',
    disabled && 'sp-input-group--disabled',
    invalid && 'sp-input-group--invalid',
    hideAddonBackground && 'sp-input-group--hide-addon-background',
    hideAddonSeparator && 'sp-input-group--hide-addon-separator',
    className,
  ].filter(Boolean).join(' ');

  return (
    <InputGroupContext.Provider value={{ size, layout, disabled, invalid }}>
      <div
        className={classes}
        style={style}
        role={role || undefined}
        aria-label={ariaLabel || undefined}
        aria-labelledby={ariaLabelledBy}
        aria-invalid={invalid || undefined}
        dir={direction}
      >
        {children}
      </div>
    </InputGroupContext.Provider>
  );
}

export interface InputGroupInputBaseProps {
  className?: string;
}

export type InputGroupInputProps =
  | (InputGroupInputBaseProps &
      Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & { as?: 'input' })
  | (InputGroupInputBaseProps &
      Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & { as: 'textarea' });

export function InputGroupInput(props: InputGroupInputProps) {
  const group = useContext(InputGroupContext);
  const { className, as = 'input', disabled, 'aria-invalid': ariaInvalid, ...rest } = props;
  const classes = ['sp-input-group__control', className].filter(Boolean).join(' ');
  const resolvedDisabled = disabled || group?.disabled;
  const resolvedInvalid = ariaInvalid ?? (group?.invalid ? true : undefined);

  if (as === 'textarea') {
    return (
      <textarea
        {...rest as TextareaHTMLAttributes<HTMLTextAreaElement>}
        className={classes}
        disabled={resolvedDisabled}
        aria-invalid={resolvedInvalid}
      />
    );
  }

  return (
    <input
      {...rest as InputHTMLAttributes<HTMLInputElement>}
      className={classes}
      disabled={resolvedDisabled}
      aria-invalid={resolvedInvalid}
    />
  );
}

export interface InputGroupAddonProps {
  children?: ReactNode;
  className?: string;
}

export function InputGroupAddon({ children, className }: InputGroupAddonProps) {
  return <span className={['sp-input-group-addon', className].filter(Boolean).join(' ')}>{children}</span>;
}

export interface InputGroupActionsProps {
  children?: ReactNode;
  align?: 'start' | 'end';
  className?: string;
}

export function InputGroupActions({ children, align = 'start', className }: InputGroupActionsProps) {
  return (
    <div className={['sp-input-group-actions', align === 'end' && 'sp-input-group-actions--end', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

export interface InputGroupSpacerProps {
  className?: string;
}

export function InputGroupSpacer({ className }: InputGroupSpacerProps) {
  return <span aria-hidden="true" className={['sp-input-group-spacer', className].filter(Boolean).join(' ')} />;
}

export interface InputGroupButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled' | 'children'> {
  children?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  ariaLabel?: string;
  variant?: InputGroupButtonVariant;
  iconOnly?: boolean;
}

export function InputGroupButton({
  children,
  type = 'button',
  disabled = false,
  ariaLabel,
  variant = 'default',
  iconOnly = false,
  className,
  ...rest
}: InputGroupButtonProps) {
  const group = useContext(InputGroupContext);
  const resolvedDisabled = disabled || group?.disabled;
  const classes = [
    'sp-input-group-button',
    variant !== 'default' && `sp-input-group-button--${variant}`,
    iconOnly && 'sp-input-group-button--icon',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      {...rest}
      className={classes}
      type={type}
      disabled={resolvedDisabled}
      aria-label={ariaLabel || rest['aria-label']}
    >
      {children}
    </button>
  );
}
