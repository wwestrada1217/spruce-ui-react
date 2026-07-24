/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import React from 'react';
import { Icon } from '../../icons/Icon.js';
import './MaskedInput.css';

export type MaskedInputSize = 'sm' | 'md' | 'lg';

/**
 * Mask characters:
 *  `9` — digit (0-9)
 *  `a` — letter (a-z, A-Z)
 *  `*` — alphanumeric (digit or letter)
 *
 * Any other character is treated as a literal separator and auto-inserted.
 */
const MASK_CHARS: Record<string, RegExp> = {
  '9': /\d/,
  'a': /[a-zA-Z]/,
  '*': /[a-zA-Z0-9]/,
};

function isMaskChar(c: string): boolean {
  return c in MASK_CHARS;
}

function stripLiterals(value: string, mask: string): string {
  const literals = new Set<string>();
  for (const c of mask) {
    if (!isMaskChar(c)) literals.add(c);
  }
  return value.split('').filter(c => !literals.has(c)).join('');
}

function applyMask(raw: string, mask: string): { display: string; rawStr: string } {
  let result = '';
  let rawIdx = 0;
  const accepted: string[] = [];

  for (let i = 0; i < mask.length && rawIdx < raw.length; i++) {
    const maskChar = mask[i];
    if (isMaskChar(maskChar)) {
      const pattern = MASK_CHARS[maskChar];
      const inputChar = raw[rawIdx];
      if (pattern.test(inputChar)) {
        result += inputChar;
        accepted.push(inputChar);
        rawIdx++;
      } else {
        rawIdx++;
        i--; // retry this mask slot with the next raw char
      }
    } else {
      result += maskChar; // literal separator
    }
  }

  return { display: result, rawStr: accepted.join('') };
}

function buildGuide(mask: string): string {
  return mask.replace(/9/g, '_').replace(/a/g, '_').replace(/\*/g, '_');
}

function countMaskSlots(mask: string): number {
  return mask.split('').filter(c => isMaskChar(c)).length;
}

export interface MaskedInputProps {
  mask: string;
  value?: string;
  onChange?: (value: string) => void;
  onRawChange?: (rawValue: string) => void;
  size?: MaskedInputSize;
  placeholder?: string;
  showMaskGuide?: boolean;
  clearable?: boolean;
  iconLeft?: string | null;
  iconRight?: string | null;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export function MaskedInput({
  mask,
  value,
  onChange,
  onRawChange,
  size = 'md',
  placeholder,
  showMaskGuide = true,
  clearable = false,
  iconLeft = null,
  iconRight = null,
  disabled = false,
  readOnly = false,
  error,
  hint,
  required = false,
  className,
  id,
  name,
}: MaskedInputProps) {
  const [displayValue, setDisplayValue] = React.useState(() => {
    if (value) {
      const raw = stripLiterals(value, mask);
      return applyMask(raw, mask).display;
    }
    return '';
  });
  const [rawValue, setRawValue] = React.useState(() => {
    if (value) return stripLiterals(value, mask);
    return '';
  });
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const hasError = Boolean(error);
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;
  const placeholderText = placeholder || (showMaskGuide ? buildGuide(mask) : '');

  // Sync when controlled value changes
  React.useEffect(() => {
    if (value !== undefined) {
      const raw = stripLiterals(value, mask);
      const { display } = applyMask(raw, mask);
      setDisplayValue(display);
      setRawValue(raw);
    }
  }, [value, mask]);

  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    const input = e.target as HTMLInputElement;
    const rawTyped = stripLiterals(input.value, mask);
    const { display, rawStr } = applyMask(rawTyped, mask);

    setDisplayValue(display);
    setRawValue(rawStr);
    onChange?.(display);
    onRawChange?.(rawStr);

    // Set cursor after mask application
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.value = display;
        inputRef.current.setSelectionRange(display.length, display.length);
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const input = e.target as HTMLInputElement;
    if (
      e.key.length === 1 && !e.ctrlKey && !e.metaKey &&
      rawValue.length >= countMaskSlots(mask)
    ) {
      if (input.selectionStart === input.selectionEnd) {
        e.preventDefault();
      }
    }
  }

  function handleClear() {
    setDisplayValue('');
    setRawValue('');
    onChange?.('');
    onRawChange?.('');
  }

  const wrapCls = [
    'sp-mask',
    size === 'sm' ? 'sp-mask--sm' : '',
    size === 'lg' ? 'sp-mask--lg' : '',
    disabled ? 'sp-mask--disabled' : '',
    hasError ? 'sp-mask--error' : '',
    focused ? 'sp-mask--focused' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div>
      <div className={wrapCls}>
        {iconLeft && (
          <Icon name={iconLeft} size={iconSize} className="sp-mask__icon" />
        )}
        <input
          ref={inputRef}
          id={id}
          name={name}
          className="sp-mask__field"
          type="text"
          placeholder={placeholderText}
          disabled={disabled}
          readOnly={readOnly}
          value={displayValue}
          aria-invalid={hasError || undefined}
          aria-required={required || undefined}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={() => {/* controlled via onInput */}}
        />
        {clearable && rawValue && (
          <button
            className="sp-mask__clear"
            type="button"
            tabIndex={-1}
            onClick={handleClear}
            aria-label="Clear"
          >
            <Icon name="x" size={12} />
          </button>
        )}
        {iconRight && (
          <Icon name={iconRight} size={iconSize} className="sp-mask__icon" />
        )}
      </div>
      {hasError && (
        <p className="sp-mask__error" role="alert">{error}</p>
      )}
      {hint && !hasError && (
        <p className="sp-mask__hint">{hint}</p>
      )}
    </div>
  );
}
