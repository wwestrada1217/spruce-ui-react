import './Radio.css';
import { createContext, useContext, type ReactNode } from 'react';

// ── Context ───────────────────────────────────────────────────────────────────

interface RadioGroupContextValue {
  value: string;
  disabled: boolean;
  onChange: (val: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

// ── RadioGroup ────────────────────────────────────────────────────────────────

export interface RadioGroupProps {
  value?: string;
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
  onChange?: (value: string) => void;
  className?: string;
  children?: ReactNode;
}

export function RadioGroup({
  value = '',
  disabled = false,
  orientation = 'vertical',
  onChange,
  className = '',
  children,
}: RadioGroupProps) {
  const classes = [
    'sp-radio-group',
    orientation === 'horizontal' && 'sp-radio-group--horizontal',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <RadioGroupContext.Provider
      value={{ value, disabled, onChange: onChange ?? (() => undefined) }}
    >
      <div className={classes} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

// ── Radio ─────────────────────────────────────────────────────────────────────

export interface RadioProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  id?: string;
}

export function Radio({ value, disabled = false, className = '', children, id }: RadioProps) {
  const group = useContext(RadioGroupContext);
  const isChecked = group ? group.value === value : false;
  const isDisabled = disabled || (group?.disabled ?? false);

  const classes = [
    'sp-radio',
    isDisabled && 'sp-radio--disabled',
    isChecked && 'sp-radio--checked',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  function handleChange() {
    if (isDisabled) return;
    group?.onChange(value);
  }

  return (
    <label className={classes}>
      <span className="sp-radio__circle">
        <span className="sp-radio__dot" />
      </span>
      <input
        type="radio"
        className="sp-radio__input"
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        id={id}
        onChange={handleChange}
      />
      <span className="sp-radio__label">{children}</span>
    </label>
  );
}
