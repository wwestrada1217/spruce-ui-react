/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './ButtonGroup.css';
import { useState, useCallback } from 'react';
import { Icon } from '../../icons/Icon.js';

/* ── Types ──────────────────────────────────────────────────────────────── */

export type ButtonGroupOrientation = 'horizontal' | 'vertical';
export type ButtonGroupToggleMode = 'none' | 'single' | 'multiple';

export interface ButtonGroupItem {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
}

export type ButtonGroupVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonGroupSize = 'sm' | 'md' | 'lg';

export interface ButtonGroupProps {
  items: ButtonGroupItem[];
  orientation?: ButtonGroupOrientation;
  toggleMode?: ButtonGroupToggleMode;
  value?: string[];
  onChange?: (value: string[]) => void;
  variant?: ButtonGroupVariant;
  size?: ButtonGroupSize;
  className?: string;
}

/* ── Icon sizes per button size ────────────────────────────────────────── */

const ICON_SIZES: Record<ButtonGroupSize, number> = { sm: 12, md: 16, lg: 18 };

/* ── Component ──────────────────────────────────────────────────────────── */

export function ButtonGroup({
  items,
  orientation = 'horizontal',
  toggleMode = 'none',
  value: controlledValue,
  onChange,
  variant = 'outline',
  size = 'md',
  className = '',
}: ButtonGroupProps) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>([]);
  const selected = isControlled ? controlledValue : uncontrolledValue;

  const iconSize = ICON_SIZES[size];

  const handleClick = useCallback(
    (itemValue: string) => {
      if (toggleMode === 'none') return;

      let next: string[];

      if (toggleMode === 'single') {
        next = selected.includes(itemValue) ? [] : [itemValue];
      } else {
        // multiple
        next = selected.includes(itemValue)
          ? selected.filter((v) => v !== itemValue)
          : [...selected, itemValue];
      }

      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onChange?.(next);
    },
    [toggleMode, selected, isControlled, onChange],
  );

  const rootClasses = [
    'sp-button-group',
    orientation === 'vertical' && 'sp-button-group--vertical',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses} role={toggleMode !== 'none' ? 'group' : undefined}>
      {items.map((item) => {
        const isActive = toggleMode !== 'none' && selected.includes(item.value);

        const btnClasses = [
          'sp-btn',
          `sp-btn--${variant}`,
          size !== 'md' && `sp-btn--${size}`,
          isActive && 'sp-btn--active',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={item.value}
            type="button"
            className={btnClasses}
            disabled={item.disabled}
            aria-pressed={toggleMode !== 'none' ? isActive : undefined}
            onClick={() => handleClick(item.value)}
          >
            {item.icon && <Icon name={item.icon} size={iconSize} />}
            <span className="sp-btn__label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
