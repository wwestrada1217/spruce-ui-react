/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Drawer.css';
import { useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';

export type DrawerPosition = 'left' | 'right' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

export interface DrawerProps {
  /** Whether the drawer is open. */
  open: boolean;
  /** Callback fired when the drawer requests to close. */
  onClose: () => void;
  /** Title displayed in the header. */
  title?: string;
  /** Which edge the drawer slides in from. */
  position?: DrawerPosition;
  /** Width (left/right) or height (bottom) of the drawer panel. */
  size?: DrawerSize;
  /** Whether clicking the backdrop closes the drawer. */
  closeOnBackdrop?: boolean;
  /** Main content of the drawer. */
  children?: ReactNode;
  /** Content rendered in the footer area. */
  footer?: ReactNode;
  /** Additional CSS class applied to the drawer panel. */
  className?: string;
}

/**
 * A sliding panel that enters from the left, right, or bottom edge of the
 * viewport. Rendered into a portal on `document.body`.
 *
 * @example
 * ```tsx
 * <Drawer open={isOpen} onClose={() => setOpen(false)} title="Settings">
 *   <p>Drawer content</p>
 * </Drawer>
 * ```
 */
export function Drawer({
  open,
  onClose,
  title,
  position = 'right',
  size = 'md',
  closeOnBackdrop = true,
  children,
  footer,
  className,
}: DrawerProps) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const panelClasses = [
    'sp-drawer',
    `sp-drawer--${position}`,
    `sp-drawer--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return createPortal(
    <>
      <div
        className="sp-drawer-backdrop"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div className={panelClasses} role="dialog" aria-label={title}>
        <div className="sp-drawer__header">
          <span className="sp-drawer__title">{title}</span>
          <button
            className="sp-drawer__close"
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="sp-drawer__body">{children}</div>
        {footer && <div className="sp-drawer__footer">{footer}</div>}
      </div>
    </>,
    document.body,
  );
}
