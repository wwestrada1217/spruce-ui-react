/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Card.css';
import type { KeyboardEvent, MouseEvent, ReactNode, HTMLAttributes } from 'react';
import type { Border, Chrome, Elevation, Radius } from '../../chrome/chrome.js';
import {
  Motif,
  type SpDecorativeBackground,
  type SpMotifAppearanceOption,
  type SpMotifPosition,
} from '../motif/Motif.js';

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'filled' | 'ghost' | 'flush';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  /** Preferred surface treatment. Defaults to the legacy variant value. */
  chrome?: Chrome;
  radius?: Radius;
  border?: Border;
  elevation?: Elevation;
  padding?: CardPadding;
  interactive?: boolean;
  header?: ReactNode;
  media?: ReactNode;
  footer?: ReactNode;
  backgroundMotif?: SpDecorativeBackground['motif'];
  motifIcon?: string;
  motifSvg?: string;
  motifPosition?: SpMotifPosition;
  motifSize?: number | string;
  motifOpacity?: number;
  motifRotation?: number;
  motifOffsetX?: number | string;
  motifOffsetY?: number | string;
  motifAppearance?: SpMotifAppearanceOption;
  motifColor?: string;
  decorativeBackground?: SpDecorativeBackground;
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
  chrome,
  radius,
  border,
  elevation,
  padding = 'md',
  interactive = false,
  header,
  media,
  footer,
  backgroundMotif,
  motifIcon,
  motifSvg,
  motifPosition,
  motifSize,
  motifOpacity,
  motifRotation,
  motifOffsetX,
  motifOffsetY,
  motifAppearance,
  motifColor,
  decorativeBackground,
  children,
  className = '',
  onClick,
  onKeyDown,
  role,
  tabIndex,
  ...props
}: CardProps) {
  const effectiveChrome = chrome ?? variant;
  const hasMotif = Boolean(
    backgroundMotif || motifIcon || motifSvg || decorativeBackground?.motif ||
      decorativeBackground?.icon || decorativeBackground?.svg,
  );
  const classes = [
    'sp-card',
    variant !== 'default' && `sp-card--${variant}`,
    `sp-chrome--${effectiveChrome}`,
    radius && `sp-radius--${radius}`,
    border && `sp-border--${border}`,
    elevation && `sp-elevation--${elevation}`,
    padding !== 'md' && `sp-card--pad-${padding}`,
    interactive && 'sp-card--interactive',
    hasMotif && 'sp-card--has-motif',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      {...props}
      onClick={onClick}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || !interactive) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.(event as unknown as MouseEvent<HTMLDivElement>);
        }
      }}
      role={role ?? (interactive ? 'button' : undefined)}
      tabIndex={tabIndex ?? (interactive ? 0 : undefined)}
    >
      {hasMotif && (
        <Motif
          config={decorativeBackground}
          motif={backgroundMotif}
          icon={motifIcon}
          svg={motifSvg}
          position={motifPosition}
          size={motifSize}
          opacity={motifOpacity}
          rotation={motifRotation}
          offsetX={motifOffsetX}
          offsetY={motifOffsetY}
          appearance={motifAppearance}
          color={motifColor}
        />
      )}
      {header && <div className="sp-card__header">{header}</div>}
      {media && <div className="sp-card__media">{media}</div>}
      {children !== undefined && <div className="sp-card__body">{children}</div>}
      {footer && <div className="sp-card__footer">{footer}</div>}
    </div>
  );
}
