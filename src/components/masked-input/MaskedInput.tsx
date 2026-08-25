/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import React from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormBorder, type FormChrome, type FormRadius, type FormValidationError } from '../field/form-types.js';
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
  hidden?: boolean;
  invalid?: boolean;
  errors?: readonly FormValidationError[];
  error?: string;
  hint?: string;
  required?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  variant?: 'default' | 'outline' | 'outlined' | 'filled';
  label?: string;
  floatingLabel?: boolean;
  chrome?: FormChrome;
  radius?: FormRadius;
  border?: FormBorder;
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
  hidden = false,
  invalid,
  errors,
  error,
  hint,
  required = false,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  variant = 'default',
  label = '',
  floatingLabel = false,
  chrome,
  radius,
  border,
  className,
  id,
  name,
}: MaskedInputProps) {
  const { t } = useI18n();
  const field = useFormFieldContext();
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

  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const effectiveHidden = hidden || Boolean(field?.hidden);
  const effectiveRequired = required || Boolean(field?.required);
  const effectiveLabel = label || (field?.floatingLabel ? field.label : '');
  const effectiveFloatingLabel = floatingLabel || Boolean(field?.floatingLabel);
  const effectiveHint = hint || field?.hint;
  const errorMessage = firstFormError(errors || field?.errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const effectiveChrome = chrome ?? field?.chrome;
  const effectiveRadius = radius ?? field?.radius;
  const effectiveBorder = border ?? field?.border;
  const idBase = React.useId().replace(/:/g, '');
  const errorId = `${id ?? `sp-mask-${idBase}`}-error`;
  const hintId = `${id ?? `sp-mask-${idBase}`}-hint`;
  const describedBy = ariaDescribedBy || field?.describedBy || (errorMessage ? errorId : effectiveHint ? hintId : undefined);
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
    if (effectiveDisabled || effectiveReadOnly) return;
    setDisplayValue('');
    setRawValue('');
    onChange?.('');
    onRawChange?.('');
  }

  const wrapCls = [
    'sp-mask',
    size === 'sm' ? 'sp-mask--sm' : '',
    size === 'lg' ? 'sp-mask--lg' : '',
    effectiveDisabled ? 'sp-mask--disabled' : '',
    effectiveReadOnly ? 'sp-mask--readonly' : '',
    variant === 'outline' || variant === 'outlined' ? 'sp-mask--outline' : '',
    variant === 'filled' ? 'sp-mask--filled' : '',
    effectiveFloatingLabel ? 'sp-mask--floating' : '',
    effectiveChrome ? `sp-mask--chrome-${effectiveChrome}` : '',
    effectiveRadius ? `sp-mask--radius-${effectiveRadius}` : '',
    effectiveBorder ? `sp-mask--border-${effectiveBorder}` : '',
    hasError ? 'sp-mask--error' : '',
    focused ? 'sp-mask--focused' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  if (effectiveHidden) return null;

  return (
    <div>
      <div className={wrapCls}>
        {effectiveFloatingLabel && <label className="sp-mask__floating-label" htmlFor={id}>
          {effectiveLabel}{effectiveRequired && <span aria-hidden="true">*</span>}
        </label>}
        {iconLeft && (
          <Icon name={iconLeft} size={iconSize} className="sp-mask__icon" />
        )}
        <input
          ref={inputRef}
          id={id}
          name={name}
          className="sp-mask__field"
          type="text"
          placeholder={effectiveFloatingLabel && !focused ? '' : placeholderText}
          disabled={effectiveDisabled}
          readOnly={effectiveReadOnly}
          value={displayValue}
          aria-invalid={hasError || undefined}
          aria-required={effectiveRequired || undefined}
          aria-readonly={effectiveReadOnly || undefined}
          aria-label={ariaLabel || (!effectiveLabel ? undefined : effectiveLabel)}
          aria-labelledby={ariaLabelledBy || undefined}
          aria-describedby={describedBy}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={() => {/* controlled via onInput */}}
        />
        {clearable && rawValue && !effectiveReadOnly && (
          <button
            className="sp-mask__clear"
            type="button"
            tabIndex={-1}
            onClick={handleClear}
            aria-label={t('clear')}
          >
            <Icon name="x" size={12} />
          </button>
        )}
        {iconRight && (
          <Icon name={iconRight} size={iconSize} className="sp-mask__icon" />
        )}
      </div>
      {errorMessage && (
        <p className="sp-mask__error" role="alert" id={errorId}>{errorMessage}</p>
      )}
      {effectiveHint && !hasError && (
        <p className="sp-mask__hint" id={hintId}>{effectiveHint}</p>
      )}
    </div>
  );
}
