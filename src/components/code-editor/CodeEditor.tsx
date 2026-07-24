/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
  type HTMLAttributes,
} from 'react';
import { tokenize, renderTokens } from './tokenizer.js';
import { LANGUAGES, type CodeLanguage } from './languages/index.js';
import './CodeEditor.css';

export type { CodeLanguage };

export interface CodeEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The code content */
  code?: string;
  /** Language for syntax highlighting */
  language?: CodeLanguage;
  /** Whether the editor is read-only */
  readonly?: boolean;
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
  /** Number of spaces per tab */
  tabSize?: number;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Minimum height of the editor */
  minHeight?: string;
  /** Maximum height of the editor */
  maxHeight?: string;
  /** Accessible label for the textarea */
  ariaLabel?: string;
  /** Emits on code change */
  onCodeChange?: (code: string) => void;
}

export function CodeEditor({
  code = '',
  language = 'typescript',
  readonly = false,
  showLineNumbers = true,
  tabSize = 2,
  placeholder = '',
  minHeight = '200px',
  maxHeight = 'none',
  ariaLabel = 'Code editor',
  onCodeChange,
  className,
  ...rest
}: CodeEditorProps) {
  const [internalCode, setInternalCode] = useState(code);
  const [focused, setFocused] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);

  // Sync external code prop → internal state
  useEffect(() => {
    setInternalCode(code);
  }, [code]);

  const isEmpty = !internalCode;

  const lineNumbers = useMemo(() => {
    const count = internalCode ? internalCode.split('\n').length : 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [internalCode]);

  const highlightedHtml = useMemo(() => {
    const langDef = LANGUAGES[language];
    if (!internalCode) return '\n';
    const tokens = tokenize(internalCode, langDef);
    return renderTokens(tokens) + '\n';
  }, [internalCode, language]);

  const syncScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const highlight = highlightRef.current;
    if (textarea && highlight) {
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
    }
  }, []);

  const handleInput = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    const value = (e.target as HTMLTextAreaElement).value;
    setInternalCode(value);
    onCodeChange?.(value);
    syncScroll();
  }, [onCodeChange, syncScroll]);

  const handleScroll = useCallback(() => {
    syncScroll();
  }, [syncScroll]);

  const handleTab = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const spaces = ' '.repeat(tabSize);

    let newValue: string;
    if (start === end) {
      newValue = value.substring(0, start) + spaces + value.substring(end);
      setInternalCode(newValue);
      onCodeChange?.(newValue);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      });
    } else {
      const before = value.substring(0, start);
      const selected = value.substring(start, end);
      const after = value.substring(end);
      const indented = selected.replace(/^/gm, spaces);
      newValue = before + indented + after;
      setInternalCode(newValue);
      onCodeChange?.(newValue);
      requestAnimationFrame(() => {
        textarea.selectionStart = start;
        textarea.selectionEnd = start + indented.length;
      });
    }
  }, [tabSize, onCodeChange]);

  const hostClass = [
    'sp-code-editor-host',
    readonly ? 'sp-code-editor-host--readonly' : '',
    focused ? 'sp-code-editor-host--focused' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div className={hostClass} {...rest}>
      <div
        className="sp-code-editor"
        style={{ minHeight, maxHeight }}
      >
        {showLineNumbers && (
          <div className="sp-code-editor__gutter" aria-hidden="true">
            {lineNumbers.map((num) => (
              <div key={num} className="sp-code-editor__line-number">{num}</div>
            ))}
          </div>
        )}

        <div className="sp-code-editor__content">
          <pre
            className="sp-code-editor__highlight"
            ref={highlightRef}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            aria-hidden="true"
          />

          {!readonly && (
            <textarea
              className="sp-code-editor__textarea"
              ref={textareaRef}
              value={internalCode}
              placeholder={placeholder || undefined}
              aria-label={ariaLabel}
              tabIndex={0}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              onInput={handleInput}
              onScroll={handleScroll}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={handleTab}
              onChange={() => {/* controlled via onInput */}}
            />
          )}

          {!readonly && isEmpty && placeholder && (
            <div className="sp-code-editor__placeholder" aria-hidden="true">
              {placeholder}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
