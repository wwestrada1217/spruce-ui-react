/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState, useRef, useEffect } from 'react';
import { Icon } from '../../icons/Icon.js';
import './InplaceEditor.css';

export type InplaceEditorSize = 'sm' | 'md' | 'lg';

export interface InplaceEditorProps {
  value?: string;
  disabled?: boolean;
  editLabel?: string;
  showIndicator?: boolean;
  size?: InplaceEditorSize;
  onValueChange?: (newValue: string) => void;
}

export function InplaceEditor({
  value = '',
  disabled = false,
  editLabel = 'Click to edit',
  showIndicator = true,
  size = 'md',
  onValueChange,
}: InplaceEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function enterEdit() {
    if (disabled) return;
    setDraft(value);
    setEditing(true);
  }

  function commit() {
    setEditing(false);
    if (draft !== value) {
      onValueChange?.(draft);
    }
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  }

  const sizeCls = size !== 'md' ? `sp-inplace-editor--${size}` : '';

  if (editing) {
    const inputClasses = ['sp-inplace-editor__input', sizeCls]
      .filter(Boolean)
      .join(' ');

    return (
      <input
        ref={inputRef}
        className={inputClasses}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        aria-label={editLabel}
      />
    );
  }

  const displayClasses = [
    'sp-inplace-editor__display',
    sizeCls,
    showIndicator && 'sp-inplace-editor__display--indicator',
    disabled && 'sp-inplace-editor__display--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={displayClasses}
      onClick={enterEdit}
      disabled={disabled}
      aria-label={editLabel}
    >
      <span className="sp-inplace-editor__text">{value || '\u00A0'}</span>
      {showIndicator && (
        <Icon name="pencil" size={size === 'sm' ? 10 : size === 'lg' ? 14 : 12} className="sp-inplace-editor__icon" />
      )}
    </button>
  );
}
