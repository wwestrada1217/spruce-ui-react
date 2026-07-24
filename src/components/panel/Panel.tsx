/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { CSSProperties, ReactNode } from 'react';
import './Panel.css';

export type PanelVariant = 'default' | 'outlined' | 'elevated' | 'filled' | 'ghost';
export type PanelPadding = 'none' | 'sm' | 'md' | 'lg';

export interface PanelProps {
  variant?: PanelVariant;
  padding?: PanelPadding;
  height?: string;
  maxHeight?: string;
  minHeight?: string;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Panel({
  variant = 'default',
  padding = 'md',
  height,
  maxHeight,
  minHeight,
  header,
  footer,
  children,
  className = '',
  style: styleProp,
}: PanelProps) {
  const classes = [
    'sp-panel',
    variant !== 'default' && `sp-panel--${variant}`,
    padding !== 'md' && `sp-panel--pad-${padding}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style: CSSProperties = { ...styleProp };
  if (height) style.height = height;
  if (maxHeight) style.maxHeight = maxHeight;
  if (minHeight) style.minHeight = minHeight;

  return (
    <div className={classes} style={Object.keys(style).length > 0 ? style : undefined}>
      {header && <div className="sp-panel__header">{header}</div>}
      <div className="sp-panel__body">{children}</div>
      {footer && <div className="sp-panel__footer">{footer}</div>}
    </div>
  );
}
