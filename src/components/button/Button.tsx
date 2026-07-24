import './Button.css';
import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { Icon } from '../../icons/Icon.js';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'danger-outline'
  | 'success'
  | 'success-outline';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  iconLeft?: string | null;
  iconRight?: string | null;
  active?: boolean;
  children?: ReactNode;
}

const ICON_SIZES: Record<ButtonSize, number> = { sm: 12, md: 16, lg: 18 };

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  iconOnly = false,
  iconLeft = null,
  iconRight = null,
  active = false,
  type = 'button',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const iconSize = ICON_SIZES[size];

  const classes = [
    'sp-btn',
    `sp-btn--${variant}`,
    size !== 'md' && `sp-btn--${size}`,
    fullWidth && 'sp-btn--full',
    iconOnly && 'sp-btn--icon-only',
    active && 'sp-btn--active',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled} type={type} {...props}>
      {iconLeft && <Icon name={iconLeft} size={iconSize} />}
      <span className="sp-btn__label">{children}</span>
      {iconRight && <Icon name={iconRight} size={iconSize} />}
      {loading && <Icon name="loader" size={iconSize} className="sp-btn__spinner" />}
    </button>
  );
}
