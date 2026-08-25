/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Modal.css';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFocusTrap } from '../../utils/FocusUtils.js';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  ariaLabel?: string;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  focusTrap?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** A centered, focus-managed dialog rendered through a body portal. */
export function Modal({
  open,
  onClose,
  title = '',
  description,
  ariaLabel,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  focusTrap = true,
  children,
  footer,
  className = '',
}: ModalProps) {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const backdropPointerDown = useRef(false);

  useFocusTrap(dialogRef, { active: open && focusTrap, autoFocus: open && focusTrap, restoreFocus: true });

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

  const panelClasses = ['sp-modal', `sp-modal--${size}`, className].filter(Boolean).join(' ');
  const label = title || ariaLabel || undefined;

  return createPortal(
    <div
      className="sp-modal-backdrop"
      onPointerDown={(event) => { backdropPointerDown.current = event.target === event.currentTarget; }}
      onClick={(event) => {
        if (closeOnBackdrop && backdropPointerDown.current && event.target === event.currentTarget) onClose();
        backdropPointerDown.current = false;
      }}
    >
      <div
        ref={dialogRef}
        className={panelClasses}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sp-modal__header">
          <div className="sp-modal__heading">
            {title && <span id={titleId} className="sp-modal__title">{title}</span>}
            {description && <p id={descriptionId} className="sp-modal__description">{description}</p>}
          </div>
          <button className="sp-modal__close" type="button" onClick={onClose} aria-label={t('close')}>
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="sp-modal__body">{children}</div>
        {footer && <div className="sp-modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
