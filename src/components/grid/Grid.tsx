import React from 'react';
import './Grid.css';

/* ─── Container ──────────────────────────────────────────────────────────── */

export interface ContainerProps {
  fluid?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Container({ fluid = false, children, className }: ContainerProps) {
  const cls = ['sp-container', fluid ? 'sp-container--fluid' : '', className].filter(Boolean).join(' ');
  return <div className={cls}>{children}</div>;
}

/* ─── Row ────────────────────────────────────────────────────────────────── */

export interface RowProps {
  cols?: number;
  gap?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  children: React.ReactNode;
  className?: string;
}

export function Row({ cols = 12, gap = 4, align = 'stretch', children, className }: RowProps) {
  const style: React.CSSProperties = {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: `var(--sp-space-${gap}, ${gap * 4}px)`,
    alignItems: align,
  };
  return <div className={['sp-row', className].filter(Boolean).join(' ')} style={style}>{children}</div>;
}

/* ─── Col ────────────────────────────────────────────────────────────────── */

export interface ColProps {
  span?: number;
  offset?: number;
  children: React.ReactNode;
  className?: string;
}

export function Col({ span = 1, offset = 0, children, className }: ColProps) {
  const start = offset > 0 ? offset + 1 : 'auto';
  const style: React.CSSProperties = {
    gridColumn: `${start} / span ${span}`,
  };
  return <div className={['sp-col', className].filter(Boolean).join(' ')} style={style}>{children}</div>;
}
