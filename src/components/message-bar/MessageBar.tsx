/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import './MessageBar.css';

export type MessageBarVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

export interface MessageBarAction {
  label: string;
  action: () => void;
}

export interface MessageBarProps {
  variant?: MessageBarVariant;
  title?: string;
  dismissible?: boolean;
  actions?: MessageBarAction[];
  onClose?: () => void;
  children?: ReactNode;
}

function iconNameForVariant(variant: MessageBarVariant): string {
  switch (variant) {
    case 'success': return 'check-circle';
    case 'warning': return 'alert-triangle';
    case 'danger': return 'x-circle';
    case 'neutral': return 'message-square';
    default: return 'info';
  }
}

export function MessageBar({
  variant = 'info',
  title,
  dismissible = false,
  actions = [],
  onClose,
  children,
}: MessageBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const classes = ['sp-message-bar', `sp-message-bar--${variant}`]
    .filter(Boolean)
    .join(' ');

  function handleDismiss() {
    setDismissed(true);
    onClose?.();
  }

  const ariaLive = variant === 'danger' || variant === 'warning' ? 'assertive' : 'polite';

  return (
    <div
      className={classes}
      role="status"
      aria-live={ariaLive}
      aria-label={title || undefined}
    >
      <Icon
        name={iconNameForVariant(variant)}
        size={16}
        className="sp-message-bar__icon"
        ariaLabel=""
      />
      <div className="sp-message-bar__content">
        {title && <span className="sp-message-bar__title">{title}</span>}
        <span className="sp-message-bar__message">{children}</span>
      </div>
      {actions.length > 0 && (
        <div className="sp-message-bar__actions" role="group" aria-label="Message bar actions">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              className="sp-message-bar__action"
              onClick={a.action}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
      {dismissible && (
        <button
          type="button"
          className="sp-message-bar__dismiss"
          aria-label="Dismiss"
          onClick={handleDismiss}
        >
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}
