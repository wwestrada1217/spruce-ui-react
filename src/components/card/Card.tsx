/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Card.css';
import type { ReactNode, HTMLAttributes } from 'react';

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'filled';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
  header?: ReactNode;
  media?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

export interface CardHeaderProps {
  children?: ReactNode;
  className?: string;
}

export interface CardMediaProps {
  children?: ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children?: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={['sp-card__header', className].filter(Boolean).join(' ')}>{children}</div>;
}

export function CardMedia({ children, className = '' }: CardMediaProps) {
  return <div className={['sp-card__media', className].filter(Boolean).join(' ')}>{children}</div>;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return <div className={['sp-card__footer', className].filter(Boolean).join(' ')}>{children}</div>;
}

export function Card({
  variant = 'default',
  padding = 'md',
  interactive = false,
  header,
  media,
  footer,
  children,
  className = '',
  ...props
}: CardProps) {
  const classes = [
    'sp-card',
    variant !== 'default' && `sp-card--${variant}`,
    padding !== 'md' && `sp-card--pad-${padding}`,
    interactive && 'sp-card--interactive',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {header && <div className="sp-card__header">{header}</div>}
      {media && <div className="sp-card__media">{media}</div>}
      {children !== undefined && <div className="sp-card__body">{children}</div>}
      {footer && <div className="sp-card__footer">{footer}</div>}
    </div>
  );
}
