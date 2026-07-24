import React from 'react';
import './OtpInput.css';

export type OtpInputSize = 'sm' | 'md' | 'lg';

export interface OtpInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  size?: OtpInputSize;
  separator?: boolean;
  separatorChar?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  className?: string;
}

export function OtpInput({
  value = '',
  onChange,
  onComplete,
  length = 6,
  size = 'md',
  separator = false,
  separatorChar = '-',
  disabled = false,
  error,
  hint,
  className,
}: OtpInputProps) {
  const hasError = Boolean(error);
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  // Derive digits from value prop
  const digits = React.useMemo(() => {
    const chars = (value || '').split('').slice(0, length);
    while (chars.length < length) chars.push('');
    return chars;
  }, [value, length]);

  function focusCell(idx: number) {
    const el = inputsRef.current[idx];
    if (el) { el.focus(); el.select(); }
  }

  function emitValue(newDigits: string[]) {
    const val = newDigits.join('');
    onChange?.(val);
    if (val.length === length && !newDigits.includes('')) {
      onComplete?.(val);
    }
  }

  function updateDigit(idx: number, char: string): string[] {
    const next = [...digits];
    while (next.length < length) next.push('');
    next[idx] = char;
    return next;
  }

  function handleInput(e: React.FormEvent<HTMLInputElement>, idx: number) {
    const input = e.target as HTMLInputElement;
    const char = input.value.replace(/[^0-9]/g, '').slice(-1);
    const next = updateDigit(idx, char);
    emitValue(next);
    if (char && idx < length - 1) focusCell(idx + 1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, idx: number) {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits[idx]) {
        emitValue(updateDigit(idx, ''));
      } else if (idx > 0) {
        focusCell(idx - 1);
        const next = [...digits];
        while (next.length < length) next.push('');
        next[idx - 1] = '';
        emitValue(next);
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault();
      focusCell(idx - 1);
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      e.preventDefault();
      focusCell(idx + 1);
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>, idx: number) {
    e.preventDefault();
    const pasted = (e.clipboardData.getData('text') || '').replace(/[^0-9]/g, '');
    const next = [...digits];
    while (next.length < length) next.push('');
    for (let i = 0; i < pasted.length && idx + i < length; i++) {
      next[idx + i] = pasted[i];
    }
    emitValue(next);
    const nextIdx = Math.min(idx + pasted.length, length - 1);
    focusCell(nextIdx);
  }

  const sepIdx = Math.floor(length / 2) - 1;

  const wrapCls = [
    'sp-otp',
    size === 'sm' ? 'sp-otp--sm' : '',
    size === 'lg' ? 'sp-otp--lg' : '',
    disabled ? 'sp-otp--disabled' : '',
    hasError ? 'sp-otp--error' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div>
      <div className={wrapCls}>
        {Array.from({ length }, (_, i) => (
          <React.Fragment key={i}>
            <input
              ref={el => { inputsRef.current[i] = el; }}
              className={[
                'sp-otp__cell',
                digits[i] ? 'sp-otp__cell--filled' : '',
              ].filter(Boolean).join(' ')}
              type="text"
              inputMode="numeric"
              maxLength={1}
              autoComplete="one-time-code"
              disabled={disabled}
              value={digits[i] || ''}
              aria-label={`Digit ${i + 1} of ${length}`}
              onInput={(e) => handleInput(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={(e) => handlePaste(e, i)}
              onChange={() => {/* controlled via onInput */}}
            />
            {separator && i === sepIdx && length > 2 && (
              <span className="sp-otp__sep">{separatorChar}</span>
            )}
          </React.Fragment>
        ))}
      </div>
      {hasError && (
        <p className="sp-otp__error" role="alert">{error}</p>
      )}
      {hint && !hasError && (
        <p className="sp-otp__hint">{hint}</p>
      )}
    </div>
  );
}
