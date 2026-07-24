import './Checkbox.css';
import type { ReactNode, ChangeEvent } from 'react';
import { Icon } from '../../icons/Icon.js';

export interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  children?: ReactNode;
  id?: string;
  name?: string;
  value?: string;
}

export function Checkbox({
  checked = false,
  disabled = false,
  indeterminate = false,
  onChange,
  className = '',
  children,
  id,
  name,
  value,
}: CheckboxProps) {
  const classes = [
    'sp-checkbox',
    disabled && 'sp-checkbox--disabled',
    checked && 'sp-checkbox--checked',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (disabled) return;
    onChange?.(e.target.checked);
  }

  return (
    <label className={classes}>
      <span className="sp-checkbox__box">
        {checked && !indeterminate && <Icon name="check" size={12} />}
        {indeterminate && <Icon name="minus" size={12} />}
      </span>
      <input
        type="checkbox"
        className="sp-checkbox__input"
        checked={checked}
        disabled={disabled}
        id={id}
        name={name}
        value={value}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate;
        }}
        onChange={handleChange}
      />
      <span className="sp-checkbox__label">{children}</span>
    </label>
  );
}
