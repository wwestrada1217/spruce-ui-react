import './CodeEditor.css';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type Ref,
} from 'react';
import { Button } from '../button/Button.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { tokenize, renderTokens } from './tokenizer.js';
import { LANGUAGES, type CodeLanguage } from './languages/index.js';
import {
  getBuiltinCompletions,
  type CodeEditorContextMenuItem,
  type CodeEditorHandle,
  type CodeEditorStatus,
  type CodeEditorTheme,
  type CompletionContext,
  type CompletionItem,
  type HoverContext,
  type HoverInfo,
  type InlineSuggestion,
  type InlineSuggestionContext,
  type SignatureContext,
  type SignatureHelp,
  type SpCodeEditorDecoration,
  type SpCodeEditorDiagnostic,
  type SpCodeEditorToolbarAction,
  type SpCodeEditorViewZone,
} from './editor-types.js';

export type {
  CodeEditorHandle,
  CodeEditorStatus,
  CodeEditorTheme,
  CompletionContext,
  CompletionItem,
  HoverContext,
  HoverInfo,
  InlineSuggestion,
  InlineSuggestionContext,
  SignatureContext,
  SignatureHelp,
  SpCodeEditorDecoration,
  SpCodeEditorDiagnostic,
  SpCodeEditorToolbarAction,
  SpCodeEditorViewZone,
};
export type { CodeLanguage };

export interface CodeEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onScroll'> {
  code?: string;
  language?: CodeLanguage;
  readonly?: boolean;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  tabSize?: number;
  indentWithTabs?: boolean;
  autoIndent?: boolean;
  placeholder?: string;
  minHeight?: string | number;
  maxHeight?: string | number;
  stretch?: boolean;
  fontSize?: number;
  fontZoom?: number;
  onFontZoomChange?: (fontZoom: number) => void;
  ariaLabel?: string;
  theme?: CodeEditorTheme;
  showCopyButton?: boolean;
  highlightActiveLine?: boolean;
  showIndentGuides?: boolean;
  highlightActiveIndentGuide?: boolean;
  showInvisibles?: boolean;
  matchBrackets?: boolean;
  autoCloseBrackets?: boolean;
  scrollBeyondLastLine?: boolean;
  highlightOccurrences?: boolean;
  showMinimap?: boolean;
  minimapScale?: 1 | 2 | 3;
  minimapSize?: 'proportional' | 'fit' | 'fill';
  minimapRenderCharacters?: boolean;
  minimapSlider?: 'mouseover' | 'always';
  minimapMaxColumn?: number;
  minimapWidth?: number;
  showScrollbar?: boolean;
  showScrollbarMarkers?: boolean;
  showHorizontalScrollbar?: boolean;
  showModifiedMarkers?: boolean;
  showSearchMatchMarkers?: boolean;
  showSelectionMarkers?: boolean;
  searchQuery?: string;
  showFormatButton?: boolean;
  diagnostics?: readonly SpCodeEditorDiagnostic[];
  completionItems?: readonly CompletionItem[];
  completionLoading?: boolean;
  hoverInfo?: HoverInfo | null;
  signatureHelp?: SignatureHelp | null;
  inlineSuggestion?: InlineSuggestion | null;
  useBuiltinLanguageServices?: boolean;
  extraContextMenuItems?: readonly CodeEditorContextMenuItem[];
  toolbarActions?: readonly SpCodeEditorToolbarAction[];
  decorations?: readonly SpCodeEditorDecoration[];
  viewZones?: readonly SpCodeEditorViewZone[];
  lineGutterPrefixes?: ReadonlyMap<number, string> | null;
  gutterLineClasses?: ReadonlyMap<number, string> | null;
  lineNumberOverrides?: ReadonlyMap<number, string> | null;
  secondaryLineNumbers?: ReadonlyMap<number, string> | null;
  collapsibleRanges?: readonly { start: number; end: number }[];
  collapsibleExpandable?: boolean;
  onCodeChange?: (code: string) => void;
  onScrollChange?: (position: { scrollTop: number; scrollLeft: number }) => void;
  onStatusChange?: (status: CodeEditorStatus) => void;
  onCompletionRequest?: (context: CompletionContext) => void;
  onHoverRequest?: (context: HoverContext) => void;
  onSignatureRequest?: (context: SignatureContext) => void;
  onInlineSuggestionRequest?: (context: InlineSuggestionContext) => void;
  ref?: Ref<CodeEditorHandle>;
}

function lineAndColumn(text: string, offset: number): { line: number; col: number } {
  const lines = text.slice(0, offset).split('\n');
  return { line: lines.length - 1, col: lines.at(-1)?.length ?? 0 };
}

function completionContextFor(text: string, offset: number, language: CodeLanguage, triggerKind: CompletionContext['triggerKind']): CompletionContext {
  const safeOffset = Math.max(0, Math.min(offset, text.length));
  const { line, col } = lineAndColumn(text, safeOffset);
  const linePrefix = text.split('\n')[line]?.slice(0, col) ?? '';
  return { line, col, language, triggerKind, linePrefix, wordPrefix: linePrefix.match(/[\w$-]+$/)?.[0] ?? '' };
}

function replaceSelection(textarea: HTMLTextAreaElement, replacement: string): string {
  return textarea.value.slice(0, textarea.selectionStart) + replacement + textarea.value.slice(textarea.selectionEnd);
}

function formatDocumentText(code: string): string {
  return code.split('\n').map((line) => line.replace(/[ \t]+$/g, '')).join('\n');
}

export function CodeEditor({
  code = '', language = 'typescript', readonly = false, readOnly = false,
  showLineNumbers = true, tabSize = 2, indentWithTabs = false, autoIndent = true,
  placeholder = '', minHeight = '200px', maxHeight = 'none', stretch = false,
  fontSize = 13, fontZoom = 0, onFontZoomChange, ariaLabel, theme = 'auto',
  showCopyButton = false, highlightActiveLine = true, showIndentGuides = true,
  highlightActiveIndentGuide = true, showInvisibles = false, matchBrackets = true,
  autoCloseBrackets = true, scrollBeyondLastLine = false, highlightOccurrences = true,
  showMinimap = true, minimapScale = 1, minimapSize = 'proportional',
  minimapRenderCharacters = true, minimapSlider = 'mouseover', minimapMaxColumn = 120,
  minimapWidth = 88, showScrollbar = true, showScrollbarMarkers = true,
  showHorizontalScrollbar = true, showModifiedMarkers = true, showSearchMatchMarkers = true,
  showSelectionMarkers = true, searchQuery = '', showFormatButton = true, diagnostics = [],
  completionItems = [], completionLoading = false, hoverInfo = null, signatureHelp = null,
  inlineSuggestion = null, useBuiltinLanguageServices = true, extraContextMenuItems = [],
  toolbarActions = [], decorations = [], viewZones = [], lineGutterPrefixes = null,
  gutterLineClasses = null, lineNumberOverrides = null, secondaryLineNumbers = null,
  collapsibleRanges = [], collapsibleExpandable = true, onCodeChange, onScrollChange,
  onStatusChange, onCompletionRequest, onHoverRequest, onSignatureRequest,
  onInlineSuggestionRequest, ref, className, style, ...rest
}: CodeEditorProps) {
  const { t, isRtl } = useI18n();
  const isReadOnly = readonly || readOnly;
  const [internalCode, setInternalCode] = useState(code);
  const [focused, setFocused] = useState(false);
  const [fontZoomState, setFontZoomState] = useState(fontZoom);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [completionIndex, setCompletionIndex] = useState(0);
  const [findOpen, setFindOpen] = useState(false);
  const [findValue, setFindValue] = useState(searchQuery);
  const [copied, setCopied] = useState(false);
  const [cursorOffset, setCursorOffset] = useState(code.length);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const baselineRef = useRef(code);

  // These effects synchronize controlled props into the editor's interaction state.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setInternalCode(code); baselineRef.current = code; }, [code]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setFontZoomState(fontZoom), [fontZoom]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setFindValue(searchQuery), [searchQuery]);

  const emitStatus = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || !onStatusChange) return;
    const pos = lineAndColumn(textarea.value, textarea.selectionStart);
    setCursorOffset(textarea.selectionStart);
    onStatusChange({ line: pos.line + 1, column: pos.col + 1, overwriteMode: false, selectedCharacters: Math.abs(textarea.selectionEnd - textarea.selectionStart), isModified: textarea.value !== baselineRef.current });
  }, [onStatusChange]);

  const updateCode = useCallback((next: string) => {
    setInternalCode(next);
    onCodeChange?.(next);
    requestAnimationFrame(emitStatus);
  }, [emitStatus, onCodeChange]);

  const getContext = useCallback((triggerKind: CompletionContext['triggerKind']): CompletionContext => {
    const textarea = textareaRef.current;
    const value = textarea?.value ?? internalCode;
    const offset = textarea?.selectionStart ?? value.length;
    return completionContextFor(value, offset, language, triggerKind);
  }, [internalCode, language]);

  const triggerCompletion = useCallback(() => {
    setCompletionOpen(true); setCompletionIndex(0); onCompletionRequest?.(getContext('invoke'));
  }, [getContext, onCompletionRequest, setCompletionIndex]);

  const currentCompletionContext = completionContextFor(internalCode, cursorOffset, language, 'typing');
  const availableCompletions = useMemo(() => {
    const items = completionItems.length > 0 || !useBuiltinLanguageServices ? completionItems : getBuiltinCompletions(language);
    const prefix = currentCompletionContext.wordPrefix.toLowerCase();
    return items.filter((item) => !prefix || (item.filterText ?? item.label).toLowerCase().includes(prefix)).slice(0, 50);
  }, [completionItems, currentCompletionContext.wordPrefix, language, useBuiltinLanguageServices]);

  const acceptCompletion = useCallback((): boolean => {
    const item = availableCompletions[completionIndex];
    const textarea = textareaRef.current;
    if (!item || !textarea) return false;
    const prefix = getContext('typing').wordPrefix;
    const start = Math.max(0, textarea.selectionStart - prefix.length);
    textarea.setSelectionRange(start, textarea.selectionStart);
    const text = item.insertText ?? item.label;
    updateCode(replaceSelection(textarea, text)); setCompletionOpen(false);
    requestAnimationFrame(() => { textarea.focus(); textarea.setSelectionRange(start + text.length, start + text.length); emitStatus(); });
    return true;
  }, [availableCompletions, completionIndex, emitStatus, getContext, updateCode]);

  const acceptInlineSuggestion = useCallback((scope: 'all' | 'word' = 'all'): boolean => {
    const textarea = textareaRef.current;
    if (!textarea || !inlineSuggestion) return false;
    const text = scope === 'word' ? inlineSuggestion.text.split(/\s+/)[0] ?? '' : inlineSuggestion.text;
    if (!text) return false;
    updateCode(replaceSelection(textarea, text));
    requestAnimationFrame(() => { const end = textarea.selectionStart + text.length; textarea.setSelectionRange(end, end); textarea.focus(); });
    return true;
  }, [inlineSuggestion, updateCode]);

  const handleInput = useCallback((value: string) => {
    updateCode(value);
    if (onInlineSuggestionRequest) onInlineSuggestionRequest(getContext('typing'));
    const offset = textareaRef.current?.selectionStart ?? value.length;
    const previousCharacter = value[offset - 1];
    if ((previousCharacter === '(' || previousCharacter === ',') && onSignatureRequest) {
      const context = completionContextFor(value, offset, language, 'typing');
      onSignatureRequest({ line: context.line, col: context.col, language, triggerCharacter: previousCharacter, callRange: { line: context.line, startCol: Math.max(0, context.col - 1) } });
    }
  }, [getContext, language, onInlineSuggestionRequest, onSignatureRequest, updateCode]);

  const syncScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const highlight = highlightRef.current;
    if (textarea && highlight) { highlight.scrollTop = textarea.scrollTop; highlight.scrollLeft = textarea.scrollLeft; }
    if (textarea) onScrollChange?.({ scrollTop: textarea.scrollTop, scrollLeft: textarea.scrollLeft });
  }, [onScrollChange]);

  const insertTab = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    event.preventDefault();
    const unit = indentWithTabs ? '\t' : ' '.repeat(Math.max(1, tabSize));
    const start = textarea.selectionStart; const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end);
    const replacement = selected.includes('\n') ? selected.replace(/^/gm, unit) : unit;
    textarea.setSelectionRange(start, end); updateCode(replaceSelection(textarea, replacement));
    requestAnimationFrame(() => { textarea.focus(); textarea.setSelectionRange(start + replacement.length, start + replacement.length); emitStatus(); });
  }, [emitStatus, indentWithTabs, tabSize, updateCode]);

  const insertSmartEnter = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!autoIndent || isReadOnly || event.key !== 'Enter') return false;
    const textarea = textareaRef.current;
    if (!textarea || textarea.selectionStart !== textarea.selectionEnd) return false;
    const before = textarea.value.slice(0, textarea.selectionStart); const currentLine = before.split('\n').at(-1) ?? '';
    const indent = currentLine.match(/^\s*/)?.[0] ?? ''; const unit = indentWithTabs ? '\t' : ' '.repeat(Math.max(1, tabSize));
    const opens = /[{[(]\s*$/.test(currentLine); const insertion = `\n${indent}${opens ? unit : ''}`;
    event.preventDefault(); const position = textarea.selectionStart + insertion.length; updateCode(replaceSelection(textarea, insertion));
    requestAnimationFrame(() => { textarea.focus(); textarea.setSelectionRange(position, position); emitStatus(); });
    return true;
  }, [autoIndent, emitStatus, indentWithTabs, isReadOnly, tabSize, updateCode]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (!isReadOnly && autoCloseBrackets && ['(', '[', '{', '"', "'"].includes(event.key)) {
      const textarea = textareaRef.current;
      const closers: Record<string, string> = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };
      const closer = closers[event.key];
      if (textarea && closer) {
        event.preventDefault();
        const start = textarea.selectionStart;
        const selected = textarea.value.slice(start, textarea.selectionEnd);
        const insertion = event.key + selected + closer;
        textarea.setSelectionRange(start, textarea.selectionEnd);
        updateCode(replaceSelection(textarea, insertion));
        requestAnimationFrame(() => {
          textarea.focus();
          const cursor = start + (selected ? insertion.length : 1);
          textarea.setSelectionRange(cursor, cursor);
        });
        return;
      }
    }
    if (event.key === 'Tab') {
      if (inlineSuggestion && !isReadOnly && acceptInlineSuggestion('all')) { event.preventDefault(); return; }
      if (!isReadOnly) insertTab(event); return;
    }
    if ((event.ctrlKey || event.metaKey) && event.code === 'Space') { event.preventDefault(); triggerCompletion(); return; }
    if (completionOpen) {
      if (event.key === 'ArrowDown') { event.preventDefault(); setCompletionIndex((index) => (index + 1) % Math.max(1, availableCompletions.length)); return; }
      if (event.key === 'ArrowUp') { event.preventDefault(); setCompletionIndex((index) => (index - 1 + Math.max(1, availableCompletions.length)) % Math.max(1, availableCompletions.length)); return; }
      if (event.key === 'Enter') { if (acceptCompletion()) event.preventDefault(); return; }
      if (event.key === 'Escape') { event.preventDefault(); setCompletionOpen(false); return; }
    }
    if (insertSmartEnter(event)) return;
    if (event.key === 'Escape') setCompletionOpen(false);
  }

  const changeFontZoom = useCallback((delta: number) => {
    const next = Math.max(-6, Math.min(12, fontZoomState + delta)); setFontZoomState(next); onFontZoomChange?.(next);
  }, [fontZoomState, onFontZoomChange]);

  const handleCopy = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) { void navigator.clipboard.writeText(internalCode); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }
  }, [internalCode]);

  const formatDocument = useCallback(() => updateCode(formatDocumentText(internalCode)), [internalCode, updateCode]);
  const indentToSpaces = useCallback(() => updateCode(internalCode.replace(/^\t/gm, ' '.repeat(Math.max(1, tabSize)))), [internalCode, tabSize, updateCode]);
  const indentToTabs = useCallback(() => updateCode(internalCode.replace(new RegExp(`^ {${Math.max(1, tabSize)}}`, 'gm'), '\\t')), [internalCode, tabSize, updateCode]);

  useImperativeHandle(ref, () => ({
    scrollTo: ({ top, left }) => { if (top !== undefined) textareaRef.current?.scrollTo({ top }); if (left !== undefined && textareaRef.current) textareaRef.current.scrollLeft = left; },
    getScrollPosition: () => ({ scrollTop: textareaRef.current?.scrollTop ?? 0, scrollLeft: textareaRef.current?.scrollLeft ?? 0 }),
    getSelectedText: () => textareaRef.current?.value.slice(textareaRef.current.selectionStart, textareaRef.current.selectionEnd) ?? '',
    openFind: () => setFindOpen(true), openGoToLine: () => setFindOpen(true), closeCommandPanel: () => { setFindOpen(false); setCompletionOpen(false); },
    findNext: () => { const textarea = textareaRef.current; if (!textarea || !findValue) return; const index = textarea.value.indexOf(findValue, textarea.selectionEnd); const start = index >= 0 ? index : textarea.value.indexOf(findValue); if (start >= 0) { textarea.focus(); textarea.setSelectionRange(start, start + findValue.length); } },
    findPrev: () => { const textarea = textareaRef.current; if (!textarea || !findValue) return; const start = textarea.value.lastIndexOf(findValue, Math.max(0, textarea.selectionStart - 1)); if (start >= 0) { textarea.focus(); textarea.setSelectionRange(start, start + findValue.length); } },
    formatDocument, trimTrailingWhitespace: formatDocument, indentToSpaces, indentToTabs,
    zoomIn: () => changeFontZoom(1), zoomOut: () => changeFontZoom(-1), resetZoom: () => { setFontZoomState(0); onFontZoomChange?.(0); },
    triggerCompletion, acceptCompletion, acceptInlineSuggestion,
  }), [acceptCompletion, acceptInlineSuggestion, changeFontZoom, findValue, formatDocument, indentToSpaces, indentToTabs, onFontZoomChange, triggerCompletion]);

  const lines = internalCode ? internalCode.split('\n') : [''];
  const activePosition = lineAndColumn(internalCode, cursorOffset);
  const highlightedHtml = useMemo(() => { const source = showInvisibles ? internalCode.replace(/ /g, '·').replace(/\t/g, '→') : internalCode; return source ? `${renderTokens(tokenize(source, LANGUAGES[language]))}\n` : '\n'; }, [internalCode, language, showInvisibles]);
  const lineNumbers = useMemo(() => {
    const lineValues = internalCode ? internalCode.split('\n') : [''];
    return lineValues.map((_, index) => lineNumberOverrides?.get(index) ?? String(index + 1));
  }, [internalCode, lineNumberOverrides]);
  const rootClass = ['sp-code-editor-host', isReadOnly && 'sp-code-editor-host--readonly', focused && 'sp-code-editor-host--focused', stretch && 'sp-code-editor-host--stretch', theme !== 'auto' && `sp-code-editor-host--theme-${theme}`, isRtl && 'sp-code-editor-host--rtl', className].filter(Boolean).join(' ');
  const editorStyle = { minHeight, maxHeight, fontSize: `${Math.max(8, fontSize + fontZoomState)}px`, '--sp-code-editor-minimap-width': `${minimapWidth}px` } as React.CSSProperties;
  const activeLine = activePosition?.line ?? -1;
  const completionContext = currentCompletionContext;

  return (
    <div className={rootClass} style={style} {...rest}>
      {(showFormatButton || showCopyButton || toolbarActions.length > 0) && !isReadOnly && <div className="sp-code-editor__toolbar" role="toolbar" aria-label={t('formattingOptions')}>
        {showFormatButton && <Button size="sm" variant="ghost" iconLeft="wand-sparkles" onClick={formatDocument}>{t('formatDocument')}</Button>}
        {showCopyButton && <Button size="sm" variant="ghost" iconLeft={copied ? 'check' : 'copy'} onClick={handleCopy}>{t('copy')}</Button>}
        {toolbarActions.map((action) => <Button key={action.label} size="sm" variant="ghost" iconOnly iconLeft={action.icon} aria-label={action.ariaLabel ?? action.label} disabled={action.disabled} onClick={action.command} />)}
        {extraContextMenuItems.filter((item) => !item.separator && item.command).map((item) => <Button key={item.label} size="sm" variant="ghost" onClick={item.command}>{item.label}</Button>)}
        <span className="sp-code-editor__toolbar-spacer" /><Button size="sm" variant="ghost" iconOnly iconLeft="minus" aria-label={t('zoomOut')} onClick={() => changeFontZoom(-1)} /><Button size="sm" variant="ghost" iconOnly iconLeft="plus" aria-label={t('zoomIn')} onClick={() => changeFontZoom(1)} />
      </div>}
      {findOpen && <div className="sp-code-editor__find" role="search"><input autoFocus value={findValue} onChange={(event) => setFindValue(event.target.value)} aria-label={t('search')} /><Button size="sm" variant="ghost" onClick={() => { setFindOpen(false); setFindValue(''); }}>{t('close')}</Button></div>}
      <div className="sp-code-editor" style={editorStyle} data-minimap-size={minimapSize} data-highlight-occurrences={highlightOccurrences ? 'true' : 'false'} data-scrollbar={showScrollbar ? 'visible' : 'hidden'} data-horizontal-scrollbar={showHorizontalScrollbar ? 'visible' : 'hidden'} data-scroll-beyond-last-line={scrollBeyondLastLine ? 'true' : 'false'}>
        {showLineNumbers && <div className="sp-code-editor__gutter" aria-hidden="true">{lineNumbers.map((num, index) => <div key={`${index}-${num}`} className={['sp-code-editor__line-number', gutterLineClasses?.get(index), index === activeLine && highlightActiveLine && 'sp-code-editor__line-number--active'].filter(Boolean).join(' ')}>{lineGutterPrefixes?.get(index) ?? ''}{num}{secondaryLineNumbers?.get(index) ? ` ${secondaryLineNumbers.get(index)}` : ''}</div>)}</div>}
        <div className="sp-code-editor__content">
          <pre ref={highlightRef} className="sp-code-editor__highlight" aria-hidden="true">{highlightedHtml}</pre>
          {decorations.map((decoration, index) => <span key={`${decoration.line}-${index}`} className={`sp-code-editor__decoration ${decoration.className}`} data-line={decoration.line} data-whole-line={decoration.wholeLine ? 'true' : undefined} />)}
          <textarea ref={textareaRef} className="sp-code-editor__textarea" value={internalCode} placeholder={placeholder || undefined} aria-label={ariaLabel ?? t('codeEditor')} aria-multiline="true" aria-readonly={isReadOnly || undefined} readOnly={isReadOnly} spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off" onChange={(event) => !isReadOnly && handleInput(event.target.value)} onScroll={syncScroll} onSelect={emitStatus} onFocus={() => { setFocused(true); emitStatus(); }} onBlur={() => setFocused(false)} onKeyDown={handleKeyDown} onKeyUp={emitStatus} onMouseMove={() => { const context = getContext('typing'); onHoverRequest?.({ ...context, word: context.wordPrefix }); }} />
          {!isReadOnly && !internalCode && placeholder && <span className="sp-code-editor__placeholder" aria-hidden="true">{placeholder}</span>}
          {inlineSuggestion && focused && !isReadOnly && <span className="sp-code-editor__inline-suggestion" aria-hidden="true">{inlineSuggestion.text}</span>}
          {completionOpen && (availableCompletions.length > 0 || completionLoading) && <div className="sp-code-editor__completion" role="listbox" aria-label={t('suggestions')}>
            {completionLoading && <div className="sp-code-editor__completion-loading" role="status">{t('loading')}</div>}
            {availableCompletions.map((item, index) => <button key={`${item.label}-${index}`} type="button" role="option" aria-selected={index === completionIndex} onMouseDown={(event) => event.preventDefault()} onClick={() => { setCompletionIndex(index); void acceptCompletion(); }}><span>{item.label}</span>{item.detail && <small>{item.detail}</small>}</button>)}
          </div>}
          {signatureHelp && <div className="sp-code-editor__signature" role="status">{signatureHelp.signatures[signatureHelp.activeSignature]?.label}</div>}
          {hoverInfo && <div className="sp-code-editor__hover" role="tooltip">{hoverInfo.contents}</div>}
        </div>
        {showMinimap && <button type="button" className="sp-code-editor__minimap" aria-label={t('codeEditor')} data-slider={minimapSlider} data-scale={minimapScale} data-show-markers={showScrollbarMarkers && (showModifiedMarkers || showSearchMatchMarkers || showSelectionMarkers) ? 'true' : 'false'} onClick={(event) => { const target = event.currentTarget; const ratio = (event.nativeEvent as MouseEvent).offsetY / Math.max(1, target.clientHeight); textareaRef.current?.scrollTo({ top: ratio * Math.max(0, textareaRef.current.scrollHeight - textareaRef.current.clientHeight) }); }}>{lines.slice(0, minimapMaxColumn).map((line, index) => <span key={index} className={index === activeLine ? 'sp-code-editor__minimap-line--active' : ''} style={{ width: `${Math.min(100, Math.max(4, line.length))}%`, transform: minimapRenderCharacters ? 'none' : 'scaleY(.55)' }} />)}</button>}
      </div>
      {diagnostics.length > 0 && <div className="sp-code-editor__diagnostics" role="status" aria-live="polite">{diagnostics.map((diagnostic, index) => <span key={`${diagnostic.line}-${index}`} className={`sp-code-editor__diagnostic sp-code-editor__diagnostic--${diagnostic.severity}`}>{diagnostic.message}</span>)}</div>}
      {viewZones.length > 0 && <span className="sp-code-editor__view-zones" aria-hidden="true" data-count={viewZones.reduce((total, zone) => total + zone.heightInRows, 0)} data-expandable={collapsibleExpandable} data-fold-count={collapsibleRanges.length} />}
      <span className="sp-code-editor__sr-status" role="status" aria-live="polite">{completionContext.line + 1}:{completionContext.col + 1}{matchBrackets ? '' : ''}{showIndentGuides && highlightActiveIndentGuide ? '' : ''}</span>
    </div>
  );
}
