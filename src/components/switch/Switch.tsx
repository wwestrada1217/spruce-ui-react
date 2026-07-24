/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import React from 'react';
import './Switch.css';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  children,
  className,
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  function handleToggle() {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  }

  const cls = [
    'sp-switch',
    isChecked ? 'sp-switch--checked' : '',
    disabled ? 'sp-switch--disabled' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <label className={cls}>
      <button
        className="sp-switch__track"
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={handleToggle}
      >
        <span className="sp-switch__thumb" />
      </button>
      {children && <span className="sp-switch__label">{children}</span>}
    </label>
  );
}
