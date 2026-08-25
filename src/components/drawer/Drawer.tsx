/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Drawer.css';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFocusTrap } from '../../utils/FocusUtils.js';

export type DrawerPosition = 'left' | 'right' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  position?: DrawerPosition;
  size?: DrawerSize;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  focusTrap?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** A focus-managed sliding surface rendered through a body portal. */
export function Drawer({
  open,
  onClose,
  title = '',
  position = 'right',
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  focusTrap = true,
  children,
  footer,
  className = '',
}: DrawerProps) {
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const backdropPointerDown = useRef(false);

  useFocusTrap(panelRef, { active: open && focusTrap, autoFocus: open && focusTrap, restoreFocus: true });

  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeOnEscape, onClose, open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  if (!open) return null;
  const panelClasses = ['sp-drawer', `sp-drawer--${position}`, `sp-drawer--${size}`, className].filter(Boolean).join(' ');

  return createPortal(
    <div
      className="sp-drawer-backdrop"
      onPointerDown={(event) => { backdropPointerDown.current = event.target === event.currentTarget; }}
      onClick={(event) => {
        if (closeOnBackdrop && backdropPointerDown.current && event.target === event.currentTarget) onClose();
        backdropPointerDown.current = false;
      }}
    >
      <div
        ref={panelRef}
        className={panelClasses}
        role="dialog"
        aria-modal="true"
        aria-label={title || undefined}
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sp-drawer__header">
          {title && <span id={titleId} className="sp-drawer__title">{title}</span>}
          <button className="sp-drawer__close" type="button" onClick={onClose} aria-label={t('close')}>
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="sp-drawer__body">{children}</div>
        {footer && <div className="sp-drawer__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
