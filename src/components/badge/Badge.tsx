import './Badge.css';
import type { ReactNode } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  pill?: boolean;
  dot?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Badge({
  variant = 'default',
  size = 'md',
  pill = false,
  dot = false,
  className = '',
  children,
}: BadgeProps) {
  const classes = [
    'sp-badge',
    variant !== 'default' && `sp-badge--${variant}`,
    size !== 'md' && `sp-badge--${size}`,
    pill && 'sp-badge--pill',
    dot && 'sp-badge--dot',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {dot && <span className="sp-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
