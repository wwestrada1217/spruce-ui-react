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
import { useI18n } from '../../i18n/i18n-context.js';
import type { Border, Chrome, Radius } from '../../chrome/chrome.js';

export type EditorSize = 'sm' | 'md' | 'lg';

export type MentionTrigger = string;

export interface MentionItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface MentionInsertEvent {
  item: MentionItem;
  start: number;
  end: number;
}

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
  /** Angular-parity alias for the controlled HTML value. */
  content?: string;
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
  /** Items shown when the mention trigger is typed in the editor. */
  mentionItems?: readonly MentionItem[];
  /** Character or string that opens mention suggestions. */
  mentionTrigger?: MentionTrigger;
  /** Formats the inserted mention text. */
  mentionInsertTemplate?: (item: MentionItem) => string;
  /** Surface chrome shared with cards, panels, and data surfaces. */
  chrome?: Chrome;
  radius?: Radius;
  border?: Border;
  /** Emits when a mention is inserted. */
  onMention?: (event: MentionInsertEvent) => void;
  /** Emits the current mention query for async lookup integrations. */
  onMentionSearch?: (query: string) => void;
  /** Custom class name applied to root element */
  className?: string;
  /** Inline styles applied to root element */
  style?: React.CSSProperties;
}

export function Editor({
  value,
  content,
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
  chrome = 'default',
  radius,
  border = 'default',
  mentionItems = [],
  mentionTrigger = '@',
  mentionInsertTemplate,
  onMention,
  onMentionSearch,
  className,
  style,
}: EditorProps) {
  const { t } = useI18n();
  const controlledHtml = value !== undefined ? value : content;
  const [internalHtml, setInternalHtml] = useState<string>(controlledHtml ?? '');
  const [isSourceView, setIsSourceView] = useState(false);
  const [blockFormat, setBlockFormat] = useState<string>('p');
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionIndex, setMentionIndex] = useState(0);
  const mentionRangeRef = useRef<Range | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const filteredMentionItems = mentionItems.filter((item) => {
    const query = mentionQuery.toLowerCase();
    return !query || item.label.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query);
  });

  // Sync internal state when value prop changes externally
  const [prevValue, setPrevValue] = useState(controlledHtml);
  if (controlledHtml !== prevValue) {
    setPrevValue(controlledHtml);
    if (controlledHtml !== undefined) {
      setInternalHtml(controlledHtml);
    }
  }

  const currentHtml = controlledHtml !== undefined ? controlledHtml : internalHtml;

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
    detectMention();
  }

  function detectMention() {
    if (!isInteractive || mentionItems.length === 0 || isSourceView) {
      setMentionOpen(false);
      return;
    }
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection?.rangeCount || !selection.isCollapsed || !editor.contains(selection.anchorNode)) return;
    const range = selection.getRangeAt(0).cloneRange();
    const before = range.cloneRange();
    before.selectNodeContents(editor);
    before.setEnd(range.endContainer, range.endOffset);
    const text = before.toString();
    const triggerIndex = text.lastIndexOf(mentionTrigger);
    if (triggerIndex < 0) { setMentionOpen(false); return; }
    const query = text.slice(triggerIndex + mentionTrigger.length);
    if (/\s/.test(query)) { setMentionOpen(false); return; }
    const mentionRange = createTextRange(editor, triggerIndex, text.length);
    if (!mentionRange) return;
    mentionRangeRef.current = mentionRange;
    setMentionQuery(query);
    setMentionIndex(0);
    setMentionOpen(true);
    onMentionSearch?.(query);
  }

  function createTextRange(root: HTMLElement, start: number, end: number): Range | null {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let offset = 0;
    let node = walker.nextNode();
    let startSet = false;
    while (node) {
      const length = node.textContent?.length ?? 0;
      if (!startSet && start >= offset && start <= offset + length) {
        range.setStart(node, start - offset);
        startSet = true;
      }
      if (startSet && end >= offset && end <= offset + length) {
        range.setEnd(node, end - offset);
        return range;
      }
      offset += length;
      node = walker.nextNode();
    }
    return null;
  }

  function insertMention(item: MentionItem) {
    const range = mentionRangeRef.current;
    const editor = editorRef.current;
    if (!range || !editor) return;
    const text = mentionInsertTemplate?.(item) ?? `${mentionTrigger}${item.label}`;
    const mention = document.createElement('span');
    mention.className = 'sp-editor__mention';
    mention.contentEditable = 'false';
    mention.dataset.mentionId = item.id;
    mention.textContent = text;
    const trailingSpace = document.createTextNode('\u00a0');
    range.deleteContents();
    range.insertNode(trailingSpace);
    range.insertNode(mention);
    const next = document.createRange();
    next.setStartAfter(trailingSpace);
    next.collapse(true);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(next);
    setMentionOpen(false);
    setMentionQuery('');
    handleContentChange();
    editor.focus();
    onMention?.({ item, start: 0, end: text.length });
  }

  function handleMentionKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!mentionOpen) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); setMentionIndex((index) => (index + 1) % Math.max(1, filteredMentionItems.length)); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setMentionIndex((index) => (index - 1 + Math.max(1, filteredMentionItems.length)) % Math.max(1, filteredMentionItems.length)); }
    else if ((event.key === 'Enter' || event.key === 'Tab') && filteredMentionItems[mentionIndex]) { event.preventDefault(); insertMention(filteredMentionItems[mentionIndex]); }
    else if (event.key === 'Escape') { event.preventDefault(); setMentionOpen(false); }
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

      <div
        className={[
          'sp-editor__container',
          `sp-chrome--${chrome}`,
          radius && `sp-radius--${radius}`,
          `sp-border--${border}`,
        ].filter(Boolean).join(' ')}
      >
        {/* Toolbar */}
        {!hideToolbar && (
          <div className="sp-editor__toolbar" role="toolbar" aria-label={t('formattingOptions')}>
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
                aria-label={t('bold')}
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
                aria-label={t('italic')}
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
                aria-label={t('underline')}
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
                aria-label={t('strikethrough')}
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
                aria-label={t('subscript')}
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
                aria-label={t('superscript')}
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
                  aria-label={t('textColor')}
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
                  aria-label={t('highlightColor')}
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
                aria-label={t('bulletList')}
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
                aria-label={t('numberedList')}
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
                aria-label={t('blockquote')}
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
                aria-label={t('codeBlock')}
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
                aria-label={t('horizontalRule')}
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
                aria-label={t('alignLeft')}
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
                aria-label={t('alignCenter')}
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
                aria-label={t('alignRight')}
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
                aria-label={t('insertLink')}
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
                aria-label={t('insertImage')}
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
                aria-label={t('formattingOptions')}
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
                aria-label={t('htmlSource')}
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
            aria-label={t('htmlSource')}
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
            onKeyDown={handleMentionKeyDown}
            role="textbox"
            aria-multiline="true"
            aria-readonly={readOnly}
            aria-disabled={disabled}
            aria-invalid={Boolean(propError) || undefined}
            aria-label={label || t('editorContent')}
          />
        )}
        {mentionOpen && filteredMentionItems.length > 0 && (
          <div className="sp-editor__mention-panel" role="listbox" aria-label={t('mentionSuggestions')}>
            {filteredMentionItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={index === mentionIndex}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => insertMention(item)}
              >
                {item.icon && <Icon name={item.icon} size={14} aria-hidden="true" />}
                <span>{item.label}</span>
                {item.description && <small>{item.description}</small>}
              </button>
            ))}
          </div>
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
