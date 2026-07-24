import React from 'react';
import './Textarea.css';

export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: TextareaSize;
  placeholder?: string;
  rows?: number;
  resize?: TextareaResize;
  maxLength?: number;
  showCount?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  hint?: string;
  required?: boolean;
  ariaLabel?: string;
  className?: string;
  id?: string;
  name?: string;
}

export function Textarea({
  value,
  defaultValue = '',
  onChange,
  size = 'md',
  placeholder = '',
  rows = 4,
  resize = 'vertical',
  maxLength,
  showCount = true,
  disabled = false,
  readOnly = false,
  error,
  hint,
  required = false,
  ariaLabel,
  className,
  id,
  name,
}: TextareaProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const hasError = Boolean(error);
  const charCount = currentValue.length;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  }

  const wrapCls = [
    'sp-textarea',
    size === 'sm' ? 'sp-textarea--sm' : '',
    size === 'lg' ? 'sp-textarea--lg' : '',
    disabled ? 'sp-textarea--disabled' : '',
    hasError ? 'sp-textarea--error' : '',
    focused ? 'sp-textarea--focused' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  const countCls = [
    'sp-textarea__count',
    maxLength !== undefined && charCount >= maxLength ? 'sp-textarea__count--limit' : '',
  ].filter(Boolean).join(' ');

  return (
    <div>
      <div className={wrapCls}>
        <textarea
          id={id}
          name={name}
          className="sp-textarea__field"
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          value={currentValue}
          maxLength={maxLength}
          aria-label={ariaLabel || undefined}
          aria-invalid={hasError || undefined}
          aria-required={required || undefined}
          style={{ resize }}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {maxLength !== undefined && showCount && (
          <div className="sp-textarea__footer">
            <span className={countCls}>{charCount} / {maxLength}</span>
          </div>
        )}
      </div>
      {hasError && (
        <p className="sp-textarea__error" role="alert">{error}</p>
      )}
      {hint && !hasError && (
        <p className="sp-textarea__hint">{hint}</p>
      )}
    </div>
  );
}
