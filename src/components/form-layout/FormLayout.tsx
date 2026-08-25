import './FormLayout.css';
import type {
  CSSProperties,
  FormEventHandler,
  ReactNode,
} from 'react';
import { useI18n } from '../../i18n/i18n-context.js';
import { FormLayoutProvider } from './FormLayoutContext.js';

export type FormLayoutMode = 'vertical' | 'horizontal' | 'compact' | 'grid';
export type FormLayoutGap = 'sm' | 'md' | 'lg';
export type FormLayoutColumns = 1 | 2 | 3 | 4;

interface FormLayoutCommonProps {
  children?: ReactNode;
  layout?: FormLayoutMode;
  columns?: FormLayoutColumns;
  gap?: FormLayoutGap;
  labelWidth?: string;
  responsive?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
  role?: React.AriaRole;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  onReset?: FormEventHandler<HTMLFormElement>;
}

export interface FormLayoutProps extends FormLayoutCommonProps {
  as?: 'div' | 'form';
  onSubmit?: FormEventHandler<HTMLFormElement>;
  noValidate?: boolean;
}

export function FormLayout({
  children,
  as = 'div',
  layout = 'vertical',
  columns = 2,
  gap = 'md',
  labelWidth,
  responsive = false,
  className,
  style,
  id,
  role,
  ariaLabel,
  ariaLabelledBy,
  onSubmit,
  onReset,
  noValidate = false,
}: FormLayoutProps) {
  const { direction } = useI18n();
  const classes = [
    'sp-form',
    `sp-form--${layout}`,
    layout === 'grid' && `sp-form--cols-${columns}`,
    gap !== 'md' && `sp-form--gap-${gap}`,
    responsive && 'sp-form--responsive',
    className,
  ].filter(Boolean).join(' ');
  const formStyle = {
    ...style,
    ...(labelWidth ? { '--sp-form-label-width': labelWidth } : {}),
    ...(layout === 'grid' ? { '--sp-form-cols': columns } : {}),
  } as CSSProperties;
  const commonProps = {
    id,
    role,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    className: classes,
    style: formStyle,
    dir: direction,
  };

  return (
    <FormLayoutProvider value={{ mode: layout, gap, labelWidth, responsive }}>
      {as === 'form' ? (
        <form {...commonProps} noValidate={noValidate} onSubmit={onSubmit} onReset={onReset}>
          {children}
        </form>
      ) : (
        <div {...commonProps}>{children}</div>
      )}
    </FormLayoutProvider>
  );
}
