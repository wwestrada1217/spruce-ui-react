/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Badge.css';
import type { MouseEvent, ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  pill?: boolean;
  dot?: boolean;
  borderless?: boolean;
  clickable?: boolean;
  icon?: string | null;
  iconLeft?: string | null;
  iconRight?: string | null;
  /** Native accessible name for icon-only clickable badges. */
  'aria-label'?: string;
  title?: string;
  onBadgeClick?: () => void;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children?: ReactNode;
}

export function Badge({
  variant = 'default',
  size = 'md',
  pill = false,
  dot = false,
  borderless = false,
  clickable = false,
  icon = null,
  iconLeft = null,
  iconRight = null,
  onBadgeClick,
  onClick,
  className = '',
  children,
  ...attributes
}: BadgeProps) {
  const resolvedIconLeft = iconLeft ?? icon;
  const iconSize = size === 'xs' ? 10 : size === 'sm' ? 11 : size === 'lg' ? 14 : 12;
  const classes = [
    'sp-badge',
    variant !== 'default' && `sp-badge--${variant}`,
    size !== 'md' && `sp-badge--${size}`,
    pill && 'sp-badge--pill',
    dot && 'sp-badge--dot',
    borderless && 'sp-badge--borderless',
    clickable && 'sp-badge--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {dot && <span className="sp-badge__dot" aria-hidden="true" />}
      {resolvedIconLeft && <Icon name={resolvedIconLeft} size={iconSize} className="sp-badge__icon" />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} className="sp-badge__icon" />}
    </>
  );

  if (clickable) {
    return (
      <button
        {...attributes}
        type="button"
        className={classes}
        onClick={(event) => {
          onClick?.(event);
          onBadgeClick?.();
        }}
      >
        {content}
      </button>
    );
  }

  return <span {...attributes} className={classes}>{content}</span>;
}
