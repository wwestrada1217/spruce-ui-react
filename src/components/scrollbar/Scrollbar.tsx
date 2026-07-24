/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Scrollbar.css';
import type { ReactNode, CSSProperties } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

export type ScrollbarThickness = 'thin' | 'medium' | 'thick';

export interface ScrollbarProps {
  /** Hide scrollbar until hover/focus/active. Default false. */
  autoHide?: boolean;
  /** Scrollbar track width. Default "thin". */
  thickness?: ScrollbarThickness;
  /** Content to render inside the scrollable container. */
  children: ReactNode;
  /** Additional CSS class name(s). */
  className?: string;
  /** Inline style overrides. */
  style?: CSSProperties;
}

/**
 * A wrapper component that applies styled scrollbar CSS classes to a
 * scrollable container div.
 *
 * @example
 * ```tsx
 * <Scrollbar autoHide thickness="medium" style={{ height: 300 }}>
 *   <p>Long content here...</p>
 * </Scrollbar>
 * ```
 */
export function Scrollbar({
  autoHide = false,
  thickness = 'thin',
  children,
  className,
  style,
}: ScrollbarProps) {
  const classes = [
    'sp-scrollbar',
    autoHide ? 'sp-scrollbar--auto-hide' : '',
    thickness === 'medium' ? 'sp-scrollbar--medium' : '',
    thickness === 'thick' ? 'sp-scrollbar--thick' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={{ overflow: 'auto', ...style }}>
      {children}
    </div>
  );
}
