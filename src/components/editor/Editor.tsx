/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Editor.css';
import {
  useState,
  useRef,
  useEffect,
  type MouseEvent,
} from 'react';
import { Icon } from '../../icons/Icon.js';
import { Select, type SelectOption } from '../select/Select.js';

export type EditorSize = 'sm' | 'md' | 'lg';

const FORMAT_BLOCK_OPTIONS: SelectOption[] = [
  { label: 'Paragraph', value: 'p' },
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
  { label: 'Quote', value: 'blockquote' },
  { label: 'Code Block', value: 'pre' },
];

export interface EditorProps {
  /** HTML string content value */
  value?: string;
  /** Emits HTML content changes */
  onChange?: (value: string) => void;
  /** Placeholder text shown when content is empty */
  placeholder?: string;
  /** Disable editing and toolbar actions */
  disabled?: boolean;
  /** Make content read-only */
  readOnly?: boolean;
  /** Field label displayed above editor */
  label?: string;
  /** Required field indicator */
  required?: boolean;
  /** Helper text / hint displayed below editor */
  hint?: string;
  /** Validation error message string */
  error?: string;
  /** Visual size variant */
  size?: EditorSize;
  /** Minimum height of the editable area (e.g. 150 or "200px") */
  minHeight?: number | string;
  /** Maximum height of the editable area (e.g. 400 or "500px") */
  maxHeight?: number | string;
  /** Hide the formatting toolbar */
  hideToolbar?: boolean;
  /** Custom class name applied to root element */
  className?: string;
  /** Inline styles applied to root element */
  style?: React.CSSProperties;
}

export function Editor({
  value,
  onChange,
  placeholder = 'Write content here...',
  disabled = false,
  readOnly = false,
  label,
  required = false,
  hint,
  error: propError,
  size = 'md',
  minHeight,
  maxHeight,
  hideToolbar = false,
  className,
  style,
}: EditorProps) {
  const [internalHtml, setInternalHtml] = useState<string>(value ?? '');
  const [isSourceView, setIsSourceView] = useState(false);
  const [blockFormat, setBlockFormat] = useState<string>('p');
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync internal state when value prop changes externally
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== undefined) {
      setInternalHtml(value);
    }
  }

  const currentHtml = value !== undefined ? (value ?? '') : internalHtml;

  // DOM content synchronization
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== currentHtml) {
      editorRef.current.innerHTML = currentHtml;
    }
  }, [currentHtml]);

  /* ── Selection & Format State Checking ───────────────────────────────────── */

  function updateActiveFormats() {
    if (typeof document === 'undefined' || isSourceView) return;
    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikethrough: document.queryCommandState('strikethrough'),
        subscript: document.queryCommandState('subscript'),
        superscript: document.queryCommandState('superscript'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
      });
    } catch {
      // Ignored if selection fails
    }
  }

  /* ── Command Execution ─────────────────────────────────────────────────── */

  function execCmd(command: string, valueArg: string | undefined = undefined) {
    if (disabled || readOnly || isSourceView) return;
    editorRef.current?.focus();
    try {
      document.execCommand(command, false, valueArg);
    } catch {
      // Ignore fallback
    }
    handleContentChange();
    updateActiveFormats();
  }

  function handleContentChange() {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const cleanHtml = html === '<br>' ? '' : html;
    setInternalHtml(cleanHtml);
    onChange?.(cleanHtml);
  }

  function handleSourceChange(newHtml: string) {
    setInternalHtml(newHtml);
    if (editorRef.current) {
      editorRef.current.innerHTML = newHtml;
    }
    onChange?.(newHtml);
  }

  function handleInsertLink() {
    if (disabled || readOnly || isSourceView) return;
    const url = window.prompt('Enter link URL:');
    if (url) {
      execCmd('createLink', url);
    }
  }

  function handleInsertImage() {
    if (disabled || readOnly || isSourceView) return;
    const url = window.prompt('Enter image URL:');
    if (url) {
      execCmd('insertImage', url);
    }
  }

  function handleFormatBlockChange(val: string | string[]) {
    const selectedValue = Array.isArray(val) ? val[0] : val;
    setBlockFormat(selectedValue);
    execCmd('formatBlock', `<${selectedValue}>`);
  }

  const isInteractive = !disabled && !readOnly;

  /* ── Dimension Style Calculation ────────────────────────────────────────── */

  const contentStyle: React.CSSProperties = {
    ...(minHeight ? { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight } : {}),
    ...(maxHeight ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight } : {}),
  };

  const sizeCls = size === 'sm' ? 'sp-editor--sm' : size === 'lg' ? 'sp-editor--lg' : '';
  const rootCls = [
    'sp-editor',
    sizeCls,
    disabled ? 'sp-editor--disabled' : '',
    readOnly ? 'sp-editor--readonly' : '',
    propError ? 'sp-editor--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootCls} style={style}>
      {label && (
        <label className="sp-editor__label">
          {label}
          {required && <span className="sp-editor__required" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="sp-editor__container">
        {/* Toolbar */}
        {!hideToolbar && (
          <div className="sp-editor__toolbar" role="toolbar" aria-label="Formatting options">
            {/* Spruce Select Heading / Block selector */}
            <div style={{ width: 130 }}>
              <Select
                options={FORMAT_BLOCK_OPTIONS}
                value={blockFormat}
                onChange={handleFormatBlockChange}
                disabled={!isInteractive || isSourceView}
                size="sm"
              />
            </div>

            <div className="sp-editor__divider" aria-hidden="true" />

            {/* Inline Formats Group */}
            <div className="sp-editor__toolbar-group">
              <button
                type="button"
                className={`sp-editor__btn${activeFormats.bold ? ' sp-editor__btn--active' : ''}`}
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  execCmd('bold');
                }}
                disabled={!isInteractive || isSourceView}
                title="Bold"
                aria-label="Bold"
              >
                <Icon name="bold" size={16} />
              </button>
              <button
                type="button"
                className={`sp-editor__btn${activeFormats.italic ? ' sp-editor__btn--active' : ''}`}
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  execCmd('italic');
                }}
                disabled={!isInteractive || isSourceView}
                title="Italic"
                aria-label="Italic"
              >
                <Icon name="italic" size={16} />
              </button>
              <button
                type="button"
                className={`sp-editor__btn${activeFormats.underline ? ' sp-editor__btn--active' : ''}`}
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  execCmd('underline');
                }}
                disabled={!isInteractive || isSourceView}
                title="Underline"
                aria-label="Underline"
              >
                <Icon name="underline" size={16} />
              </button>
              <button
                type="button"
                className={`sp-editor__btn${activeFormats.strikethrough ? ' sp-editor__btn--active' : ''}`}
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  execCmd('strikethrough');
                }}
                disabled={!isInteractive || isSourceView}
                title="Strikethrough"
                aria-label="Strikethrough"
              >
                <Icon name="strikethrough" size={16} />
              </button>
              <button
                type="button"
                className={`sp-editor__btn${activeFormats.subscript ? ' sp-editor__btn--active' : ''}`}
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  execCmd('subscript');
                }}
                disabled={!isInteractive || isSourceView}
                title="Subscript"
                aria-label="Subscript"
              >
                <Icon name="subscript" size={16} />
              </button>
              <button
                type="button"
                className={`sp-editor__btn${activeFormats.superscript ? ' sp-editor__btn--active' : ''}`}
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  execCmd('superscript');
                }}
                disabled={!isInteractive || isSourceView}
                title="Superscript"
                aria-label="Superscript"
              >
                <Icon name="superscript" size={16} />
              </button>
            </div>

            <div className="sp-editor__divider" aria-hidden="true" />

            {/* Colors Group */}
            <div className="sp-editor__toolbar-group">
              <label className="sp-editor__color-wrap" title="Text Color">
                <button
                  type="button"
                  className="sp-editor__btn"
                  disabled={!isInteractive || isSourceView}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Icon name="palette" size={16} />
                </button>
                <input
                  type="color"
                  className="sp-editor__color-input"
                  disabled={!isInteractive || isSourceView}
                  onChange={(e) => execCmd('foreColor', e.target.value)}
                  aria-label="Text Color"
                />
              </label>
              <label className="sp-editor__color-wrap" title="Highlight Color">
                <button
                  type="button"
                  className="sp-editor__btn"
                  disabled={!isInteractive || isSourceView}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Icon name="highlighter" size={16} />
                </button>
                <input
                  type="color"
                  className="sp-editor__color-input"
                  disabled={!isInteractive || isSourceView}
                  onChange={(e) => execCmd('hiliteColor', e.target.value)}
                  aria-label="Highlight Color"
                />
              </label>
            </div>

            <div className="sp-editor__divider" aria-hidden="true" />

            {/* Lists Group */}
            <div className="sp-editor__toolbar-group">
              <button
                type="button"
                className={`sp-editor__btn${activeFormats.insertUnorderedList ? ' sp-editor__btn--active' : ''}`}
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  execCmd('insertUnorderedList');
                }}
                disabled={!isInteractive || isSourceView}
                title="Bullet List"
                aria-label="Bullet List"
              >
                <Icon name="list" size={16} />
              </button>
              <button
                type="button"
                className={`sp-editor__btn${activeFormats.insertOrderedList ? ' sp-editor__btn--active' : ''}`}
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  execCmd('insertOrderedList');
                }}
                disabled={!isInteractive || isSourceView}
                title="Numbered List"
                aria-label="Numbered List"
              >
                <Icon name="list-ordered" size={16} />
              </button>
            </div>

            <div className="sp-editor__divider" aria-hidden="true" />

            {/* Blocks Group */}
            <div className="sp-editor__toolbar-group">
              <button
                type="button"
                className="sp-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  execCmd('formatBlock', 'blockquote');
                }}
                disabled={!isInteractive || isSourceView}
                title="Blockquote"
                aria-label="Blockquote"
              >
                <Icon name="quote" size={16} />
              </button>
              <button
                type="button"
                className="sp-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  execCmd('formatBlock', 'pre');
                }}
                disabled={!isInteractive || isSourceView}
                title="Code Block"
                aria-label="Code Block"
              >
                <Icon name="code" size={16} />
              </button>
              <button
                type="button"
                className="sp-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  execCmd('insertHorizontalRule');
                }}
                disabled={!isInteractive || isSourceView}
                title="Horizontal Line"
                aria-label="Horizontal Line"
              >
                <Icon name="minus" size={16} />
              </button>
            </div>

            <div className="sp-editor__divider" aria-hidden="true" />

            {/* Alignment Group */}
            <div className="sp-editor__toolbar-group">
              <button
                type="button"
                className={`sp-editor__btn${activeFormats.justifyLeft ? ' sp-editor__btn--active' : ''}`}
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  execCmd('justifyLeft');
                }}
                disabled={!isInteractive || isSourceView}
                title="Align Left"
                aria-label="Align Left"
              >
                <Icon name="align-left" size={16} />
              </button>
              <button
                type="button"
                className={`sp-editor__btn${activeFormats.justifyCenter ? ' sp-editor__btn--active' : ''}`}
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  execCmd('justifyCenter');
                }}
                disabled={!isInteractive || isSourceView}
                title="Align Center"
                aria-label="Align Center"
              >
                <Icon name="align-center" size={16} />
              </button>
              <button
                type="button"
                className={`sp-editor__btn${activeFormats.justifyRight ? ' sp-editor__btn--active' : ''}`}
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  execCmd('justifyRight');
                }}
                disabled={!isInteractive || isSourceView}
                title="Align Right"
                aria-label="Align Right"
              >
                <Icon name="align-right" size={16} />
              </button>
            </div>

            <div className="sp-editor__divider" aria-hidden="true" />

            {/* Insert & Actions */}
            <div className="sp-editor__toolbar-group">
              <button
                type="button"
                className="sp-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  handleInsertLink();
                }}
                disabled={!isInteractive || isSourceView}
                title="Insert Link"
                aria-label="Insert Link"
              >
                <Icon name="link" size={16} />
              </button>
              <button
                type="button"
                className="sp-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  handleInsertImage();
                }}
                disabled={!isInteractive || isSourceView}
                title="Insert Image"
                aria-label="Insert Image"
              >
                <Icon name="image" size={16} />
              </button>
              <button
                type="button"
                className="sp-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  execCmd('removeFormat');
                }}
                disabled={!isInteractive || isSourceView}
                title="Clear Formatting"
                aria-label="Clear Formatting"
              >
                <Icon name="x" size={16} />
              </button>
              <button
                type="button"
                className={`sp-editor__btn${isSourceView ? ' sp-editor__btn--active' : ''}`}
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  setIsSourceView(!isSourceView);
                }}
                disabled={disabled}
                title={isSourceView ? 'Visual Editor' : 'HTML Source'}
                aria-label="Toggle HTML Source View"
              >
                <Icon name="code" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Editable Area vs Source Code View */}
        {isSourceView ? (
          <textarea
            className="sp-editor__source"
            style={contentStyle}
            value={currentHtml}
            onChange={(e) => handleSourceChange(e.target.value)}
            disabled={disabled}
            readOnly={readOnly}
            aria-label="HTML Source Code"
          />
        ) : (
          <div
            ref={editorRef}
            className="sp-editor__content"
            style={contentStyle}
            contentEditable={isInteractive}
            data-placeholder={placeholder}
            onInput={handleContentChange}
            onBlur={handleContentChange}
            onKeyUp={updateActiveFormats}
            onClick={updateActiveFormats}
            role="textbox"
            aria-multiline="true"
            aria-readonly={readOnly}
            aria-disabled={disabled}
            aria-label={label || 'Rich text editor'}
          />
        )}
      </div>

      {/* Error message */}
      {propError && (
        <div className="sp-editor__error-msg" role="alert">
          {propError}
        </div>
      )}

      {/* Hint message */}
      {!propError && hint && (
        <div className="sp-editor__hint-msg">{hint}</div>
      )}
    </div>
  );
}
