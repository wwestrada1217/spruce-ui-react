/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import React from 'react';
import './Grid.css';

/* ─── Container ──────────────────────────────────────────────────────────── */

export interface ContainerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  fluid?: boolean;
  children?: React.ReactNode;
}

export function Container({ fluid = false, children, className, ...props }: ContainerProps) {
  const cls = ['sp-container', fluid ? 'sp-container--fluid' : '', className].filter(Boolean).join(' ');
  return <div {...props} className={cls}>{children}</div>;
}

/* ─── Row ────────────────────────────────────────────────────────────────── */

export interface RowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  cols?: number;
  gap?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  children?: React.ReactNode;
}

export function Row({ cols = 12, gap = 4, align = 'stretch', children, className, style: userStyle, ...props }: RowProps) {
  const style: React.CSSProperties = {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: `var(--sp-space-${gap}, ${gap * 4}px)`,
    alignItems: align,
    ...userStyle,
  };
  return <div {...props} className={['sp-row', className].filter(Boolean).join(' ')} style={style}>{children}</div>;
}

/* ─── Col ────────────────────────────────────────────────────────────────── */

export interface ColProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  span?: number;
  offset?: number;
  children?: React.ReactNode;
}

export function Col({ span = 1, offset = 0, children, className, style: userStyle, ...props }: ColProps) {
  const start = offset > 0 ? offset + 1 : 'auto';
  const style: React.CSSProperties = {
    gridColumn: `${start} / span ${span}`,
    ...userStyle,
  };
  return <div {...props} className={['sp-col', className].filter(Boolean).join(' ')} style={style}>{children}</div>;
}
