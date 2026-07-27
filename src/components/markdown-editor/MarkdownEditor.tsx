/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './MarkdownEditor.css';
import {
  useState,
  useRef,
  useMemo,
  type ChangeEvent,
  type MouseEvent,
} from 'react';
import { Icon } from '../../icons/Icon.js';

export type MarkdownEditorMode = 'write' | 'preview' | 'split';
export type MarkdownEditorSize = 'sm' | 'md' | 'lg';

export interface MarkdownEditorProps {
  /** Raw Markdown text content value */
  value?: string;
  /** Emits Markdown text content changes */
  onChange?: (value: string) => void;
  /** Active editing view mode */
  mode?: MarkdownEditorMode;
  /** Emits view mode changes */
  onModeChange?: (mode: MarkdownEditorMode) => void;
  /** Placeholder text shown when editor is empty */
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
  size?: MarkdownEditorSize;
  /** Minimum height of the editable area */
  minHeight?: number | string;
  /** Maximum height of the editable area */
  maxHeight?: number | string;
  /** Custom class name applied to root element */
  className?: string;
  /** Inline styles applied to root element */
  style?: React.CSSProperties;
}

/* ── Lightweight Markdown to HTML Parser ─────────────────────────────────── */

function parseMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';

  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Fenced Code Blocks: ```code```
  html = html.replace(/```([\s\S]*?)```/g, (_match, code) => {
    return `<pre><code>${code.trim()}</code></pre>`;
  });

  // Inline Code: `code`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headers: # H1, ## H2, ### H3, #### H4
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Blockquotes: > quote
  html = html.replace(/^&gt;\s?(.*$)/gim, 'blockquote>$1</blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '<br/>');
  html = html.replace(/blockquote>(.*?)<\/blockquote/g, 'blockquote>$1</blockquote>');

  // Horizontal Rules: --- or ***
  html = html.replace(/^(?:---|[*]{3,})$/gim, '<hr/>');

  // Bold: **text** or __text__
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Strikethrough: ~~text~~
  html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

  // Images: ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Links: [title](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Lists: Unordered (- or *) & Ordered (1.)
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<ul><li>$1</li></ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<ol><li>$1</li></ol>');
  html = html.replace(/<\/ol>\s*<ol>/g, '');

  // Paragraphs & Line Breaks
  const lines = html.split('\n');
  const processedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (
      trimmed.startsWith('<h') ||
      trimmed.startsWith('<pre') ||
      trimmed.startsWith('<ul') ||
      trimmed.startsWith('<ol') ||
      trimmed.startsWith('<blockquote') ||
      trimmed.startsWith('<hr') ||
      trimmed === ''
    ) {
      return line;
    }
    return `<p>${line}</p>`;
  });

  return processedLines.join('\n').replace(/<\/p>\n<p>/g, '<br/>');
}

/* ── Component ───────────────────────────────────────────────────────────── */

export function MarkdownEditor({
  value,
  onChange,
  mode: propMode,
  onModeChange,
  placeholder = 'Write markdown content here...',
  disabled = false,
  readOnly = false,
  label,
  required = false,
  hint,
  error: propError,
  size = 'md',
  minHeight,
  maxHeight,
  className,
  style,
}: MarkdownEditorProps) {
  const [internalText, setInternalText] = useState<string>(value ?? '');
  const [internalMode, setInternalMode] = useState<MarkdownEditorMode>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync value prop
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== undefined) {
      setInternalText(value);
    }
  }

  const currentText = value !== undefined ? (value ?? '') : internalText;
  const currentMode = propMode !== undefined ? propMode : internalMode;

  const renderedHtml = useMemo(() => parseMarkdownToHtml(currentText), [currentText]);

  function handleModeSelect(newMode: MarkdownEditorMode) {
    setInternalMode(newMode);
    onModeChange?.(newMode);
  }

  function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const nextVal = e.target.value;
    setInternalText(nextVal);
    onChange?.(nextVal);
  }

  /* ── Selection Formatting Inserter ───────────────────────────────────────── */

  function insertFormatting(prefix: string, suffix = '', defaultText = '') {
    if (disabled || readOnly || !textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selectedText = text.substring(start, end);
    const replacement = selectedText ? `${prefix}${selectedText}${suffix}` : `${prefix}${defaultText}${suffix}`;

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setInternalText(newText);
    onChange?.(newText);

    // Reset selection and focus after DOM updates
    requestAnimationFrame(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start, start + replacement.length);
      } else {
        const cursorPosition = start + prefix.length;
        textarea.setSelectionRange(cursorPosition, cursorPosition + defaultText.length);
      }
    });
  }

  function insertTable() {
    const tableTemplate =
      '\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n';
    insertFormatting('', '', tableTemplate);
  }

  const isInteractive = !disabled && !readOnly;

  /* ── Style bounds ────────────────────────────────────────────────────────── */

  const paneStyle: React.CSSProperties = {
    ...(minHeight ? { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight } : {}),
    ...(maxHeight ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight } : {}),
  };

  const sizeCls =
    size === 'sm' ? 'sp-markdown-editor--sm' : size === 'lg' ? 'sp-markdown-editor--lg' : '';

  const rootCls = [
    'sp-markdown-editor',
    sizeCls,
    disabled ? 'sp-markdown-editor--disabled' : '',
    readOnly ? 'sp-markdown-editor--readonly' : '',
    propError ? 'sp-markdown-editor--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootCls} style={style}>
      {label && (
        <label className="sp-markdown-editor__label">
          {label}
          {required && <span className="sp-markdown-editor__required" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="sp-markdown-editor__container">
        {/* Header & Mode Switcher */}
        <div className="sp-markdown-editor__header">
          {/* Formatting Toolbar */}
          <div className="sp-markdown-editor__toolbar" role="toolbar" aria-label="Markdown formatting">
            {/* Headers */}
            <div className="sp-markdown-editor__toolbar-group">
              <button
                type="button"
                className="sp-markdown-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  insertFormatting('# ', '', 'Heading 1');
                }}
                disabled={!isInteractive || currentMode === 'preview'}
                title="Heading 1"
                aria-label="Heading 1"
              >
                H1
              </button>
              <button
                type="button"
                className="sp-markdown-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  insertFormatting('## ', '', 'Heading 2');
                }}
                disabled={!isInteractive || currentMode === 'preview'}
                title="Heading 2"
                aria-label="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                className="sp-markdown-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  insertFormatting('### ', '', 'Heading 3');
                }}
                disabled={!isInteractive || currentMode === 'preview'}
                title="Heading 3"
                aria-label="Heading 3"
              >
                H3
              </button>
            </div>

            <div className="sp-markdown-editor__divider" aria-hidden="true" />

            {/* Inline Formatting */}
            <div className="sp-markdown-editor__toolbar-group">
              <button
                type="button"
                className="sp-markdown-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  insertFormatting('**', '**', 'bold text');
                }}
                disabled={!isInteractive || currentMode === 'preview'}
                title="Bold"
                aria-label="Bold"
              >
                <Icon name="bold" size={16} />
              </button>
              <button
                type="button"
                className="sp-markdown-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  insertFormatting('*', '*', 'italic text');
                }}
                disabled={!isInteractive || currentMode === 'preview'}
                title="Italic"
                aria-label="Italic"
              >
                <Icon name="italic" size={16} />
              </button>
              <button
                type="button"
                className="sp-markdown-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  insertFormatting('~~', '~~', 'strikethrough text');
                }}
                disabled={!isInteractive || currentMode === 'preview'}
                title="Strikethrough"
                aria-label="Strikethrough"
              >
                <Icon name="strikethrough" size={16} />
              </button>
              <button
                type="button"
                className="sp-markdown-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  insertFormatting('`', '`', 'code');
                }}
                disabled={!isInteractive || currentMode === 'preview'}
                title="Inline Code"
                aria-label="Inline Code"
              >
                <Icon name="code" size={16} />
              </button>
            </div>

            <div className="sp-markdown-editor__divider" aria-hidden="true" />

            {/* Lists & Quotes */}
            <div className="sp-markdown-editor__toolbar-group">
              <button
                type="button"
                className="sp-markdown-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  insertFormatting('- ', '', 'List item');
                }}
                disabled={!isInteractive || currentMode === 'preview'}
                title="Bullet List"
                aria-label="Bullet List"
              >
                <Icon name="list" size={16} />
              </button>
              <button
                type="button"
                className="sp-markdown-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  insertFormatting('1. ', '', 'Numbered item');
                }}
                disabled={!isInteractive || currentMode === 'preview'}
                title="Numbered List"
                aria-label="Numbered List"
              >
                <Icon name="list-ordered" size={16} />
              </button>
              <button
                type="button"
                className="sp-markdown-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  insertFormatting('> ', '', 'Quote text');
                }}
                disabled={!isInteractive || currentMode === 'preview'}
                title="Blockquote"
                aria-label="Blockquote"
              >
                <Icon name="quote" size={16} />
              </button>
            </div>

            <div className="sp-markdown-editor__divider" aria-hidden="true" />

            {/* Code Block & Tables */}
            <div className="sp-markdown-editor__toolbar-group">
              <button
                type="button"
                className="sp-markdown-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  insertFormatting('```\n', '\n```', 'code block');
                }}
                disabled={!isInteractive || currentMode === 'preview'}
                title="Code Block"
                aria-label="Code Block"
              >
                <Icon name="code" size={16} />
              </button>
              <button
                type="button"
                className="sp-markdown-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  insertTable();
                }}
                disabled={!isInteractive || currentMode === 'preview'}
                title="Table"
                aria-label="Insert Table"
              >
                <Icon name="table" size={16} />
              </button>
              <button
                type="button"
                className="sp-markdown-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  insertFormatting('[', '](https://example.com)', 'Link text');
                }}
                disabled={!isInteractive || currentMode === 'preview'}
                title="Link"
                aria-label="Insert Link"
              >
                <Icon name="link" size={16} />
              </button>
              <button
                type="button"
                className="sp-markdown-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  insertFormatting('![', '](https://example.com/image.jpg)', 'Image alt');
                }}
                disabled={!isInteractive || currentMode === 'preview'}
                title="Image"
                aria-label="Insert Image"
              >
                <Icon name="image" size={16} />
              </button>
              <button
                type="button"
                className="sp-markdown-editor__btn"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  insertFormatting('\n---\n', '', '');
                }}
                disabled={!isInteractive || currentMode === 'preview'}
                title="Horizontal Rule"
                aria-label="Horizontal Rule"
              >
                <Icon name="minus" size={16} />
              </button>
            </div>
          </div>

          {/* Mode Toggles */}
          <div className="sp-markdown-editor__modes" role="tablist" aria-label="View mode">
            <button
              type="button"
              className={`sp-markdown-editor__mode-btn${
                currentMode === 'write' ? ' sp-markdown-editor__mode-btn--active' : ''
              }`}
              onClick={() => handleModeSelect('write')}
              role="tab"
              aria-selected={currentMode === 'write'}
            >
              <Icon name="edit" size={14} />
              Write
            </button>
            <button
              type="button"
              className={`sp-markdown-editor__mode-btn${
                currentMode === 'preview' ? ' sp-markdown-editor__mode-btn--active' : ''
              }`}
              onClick={() => handleModeSelect('preview')}
              role="tab"
              aria-selected={currentMode === 'preview'}
            >
              <Icon name="eye" size={14} />
              Preview
            </button>
            <button
              type="button"
              className={`sp-markdown-editor__mode-btn${
                currentMode === 'split' ? ' sp-markdown-editor__mode-btn--active' : ''
              }`}
              onClick={() => handleModeSelect('split')}
              role="tab"
              aria-selected={currentMode === 'split'}
            >
              <Icon name="columns" size={14} />
              Split
            </button>
          </div>
        </div>

        {/* Body Panes */}
        <div className="sp-markdown-editor__body">
          {/* Write Pane */}
          {(currentMode === 'write' || currentMode === 'split') && (
            <div
              className={`sp-markdown-editor__pane${
                currentMode === 'split' ? ' sp-markdown-editor__pane--split' : ''
              }`}
            >
              <textarea
                ref={textareaRef}
                className="sp-markdown-editor__textarea"
                style={paneStyle}
                value={currentText}
                onChange={handleTextChange}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                aria-label="Markdown text editor"
              />
            </div>
          )}

          {/* Preview Pane */}
          {(currentMode === 'preview' || currentMode === 'split') && (
            <div className="sp-markdown-editor__pane">
              <div
                className="sp-markdown-editor__preview"
                style={paneStyle}
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
                aria-label="Markdown HTML preview"
              />
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {propError && (
        <div className="sp-markdown-editor__error-msg" role="alert">
          {propError}
        </div>
      )}

      {/* Hint message */}
      {!propError && hint && (
        <div className="sp-markdown-editor__hint-msg">{hint}</div>
      )}
    </div>
  );
}
