/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Alert.css';
import { useState, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  dismissible?: boolean;
  onClose?: () => void;
  className?: string;
  children?: ReactNode;
}

function iconNameForVariant(variant: AlertVariant): string {
  switch (variant) {
    case 'success': return 'check-circle';
    case 'warning': return 'alert-triangle';
    case 'danger': return 'alert-circle';
    default: return 'info';
  }
}

export function Alert({
  variant = 'info',
  title = '',
  dismissible = false,
  onClose,
  className = '',
  children,
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);
  const { t } = useI18n();

  if (dismissed) return null;

  const classes = ['sp-alert', `sp-alert--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  function handleDismiss() {
    setDismissed(true);
    onClose?.();
  }

  return (
    <div className={classes} role="alert">
      <Icon name={iconNameForVariant(variant)} size={18} className="sp-alert__icon" />
      <div className="sp-alert__body">
        {title && <div className="sp-alert__title">{title}</div>}
        <div className="sp-alert__message">{children}</div>
      </div>
      {dismissible && (
        <button className="sp-alert__close" aria-label={t('dismiss')} onClick={handleDismiss}>
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}
