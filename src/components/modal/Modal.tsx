/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Modal.css';
import { useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  /** Whether the modal is open. */
  open: boolean;
  /** Callback fired when the modal requests to close. */
  onClose: () => void;
  /** Title displayed in the header. */
  title?: string;
  /** Controls the maximum width of the modal. */
  size?: ModalSize;
  /** Whether clicking the backdrop closes the modal. */
  closeOnBackdrop?: boolean;
  /** Main content of the modal. */
  children?: ReactNode;
  /** Content rendered in the footer area. */
  footer?: ReactNode;
  /** Additional CSS class applied to the modal panel. */
  className?: string;
}

/**
 * A centered dialog overlay. Rendered into a portal on `document.body`.
 *
 * @example
 * ```tsx
 * <Modal open={isOpen} onClose={() => setOpen(false)} title="Confirm">
 *   <p>Are you sure?</p>
 * </Modal>
 * ```
 */
export function Modal({
  open,
  onClose,
  title,
  size = 'md',
  closeOnBackdrop = true,
  children,
  footer,
  className,
}: ModalProps) {
  const { t } = useI18n();
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

  const panelClasses = ['sp-modal', `sp-modal--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return createPortal(
    <div
      className="sp-modal-backdrop"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={panelClasses}
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sp-modal__header">
          <span className="sp-modal__title">{title}</span>
          <button
            className="sp-modal__close"
            onClick={onClose}
            aria-label={t('close')}
          >
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
