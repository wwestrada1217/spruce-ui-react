import './DiffEditor.css';
import { useCallback, useImperativeHandle, useMemo, useRef, useState, type CSSProperties, type Ref } from 'react';
import { Button } from '../button/Button.js';
import { CodeEditor, type CodeEditorHandle, type CodeEditorTheme, type CodeLanguage } from '../code-editor/CodeEditor.js';
import { useI18n } from '../../i18n/i18n-context.js';
import type { Border, Chrome, Radius } from '../../chrome/chrome.js';

export type DiffMode = 'side-by-side' | 'inline';

export interface DiffEditorProps {
  oldCode?: string;
  newCode?: string;
  original?: string;
  modified?: string;
  language?: CodeLanguage;
  mode?: DiffMode;
  onModeChange?: (mode: DiffMode) => void;
  showLineNumbers?: boolean;
  showModeToggle?: boolean;
  showMinimap?: boolean;
  stretch?: boolean;
  fontSize?: number;
  fontZoom?: number;
  onFontZoomChange?: (fontZoom: number) => void;
  minHeight?: string | number;
  maxHeight?: string | number;
  height?: string | number;
  originalLabel?: string;
  modifiedLabel?: string;
  ariaLabel?: string;
  showSplitter?: boolean;
  editable?: boolean;
  readOnly?: boolean;
  horizontalScroll?: boolean;
  theme?: CodeEditorTheme;
  changeNavigation?: boolean;
  collapseUnchanged?: boolean;
  changesOnly?: boolean;
  contextLines?: number;
  chrome?: Chrome;
  radius?: Radius;
  border?: Border;
  onOriginalChange?: (value: string) => void;
  onModifiedChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<DiffEditorHandle>;
}

export interface DiffEditorHandle {
  nextChange(): void;
  prevChange(): void;
  toggleMode(): void;
  getOriginalEditor(): CodeEditorHandle | null;
  getModifiedEditor(): CodeEditorHandle | null;
}

interface DiffLine { type: 'unchanged' | 'added' | 'removed'; oldLineNum?: number; newLineNum?: number; content: string; }

function computeDiff(original: string, modified: string): DiffLine[] {
  const oldLines = original.split('\n');
  const newLines = modified.split('\n');
  const result: DiffLine[] = [];
  let oldIndex = 0; let newIndex = 0;
  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    const oldLine = oldLines[oldIndex]; const newLine = newLines[newIndex];
    if (oldLine !== undefined && oldLine === newLine) {
      result.push({ type: 'unchanged', oldLineNum: oldIndex + 1, newLineNum: newIndex + 1, content: oldLine }); oldIndex++; newIndex++; continue;
    }
    if (newLine !== undefined && (oldLine === undefined || !oldLines.slice(oldIndex + 1).includes(newLine))) {
      result.push({ type: 'added', newLineNum: newIndex + 1, content: newLine }); newIndex++; continue;
    }
    if (oldLine !== undefined) { result.push({ type: 'removed', oldLineNum: oldIndex + 1, content: oldLine }); oldIndex++; }
  }
  return result;
}

function filterDiff(lines: DiffLine[], collapse: boolean, changesOnly: boolean, contextLines: number): DiffLine[] {
  if (!collapse && !changesOnly) return lines;
  const changed = lines.map((line, index) => line.type !== 'unchanged' ? index : -1).filter((index) => index >= 0);
  if (changed.length === 0) return changesOnly ? [] : lines;
  const visible = new Set<number>();
  changed.forEach((index) => { for (let offset = -contextLines; offset <= contextLines; offset++) visible.add(index + offset); });
  const output: DiffLine[] = []; let separator = false;
  lines.forEach((line, index) => {
    if (visible.has(index)) { output.push(line); separator = false; }
    else if (!separator) { output.push({ type: 'unchanged', content: '⋯' }); separator = true; }
  });
  return output;
}

export function DiffEditor({
  oldCode = '', newCode = '', original, modified, language = 'typescript', mode: propMode, onModeChange,
  showLineNumbers = true, showModeToggle = true, showMinimap = false, stretch = false, fontSize = 13, fontZoom = 0,
  onFontZoomChange, minHeight = '200px', maxHeight = '600px', height, originalLabel, modifiedLabel, ariaLabel,
  showSplitter = false, editable = false, readOnly = false, horizontalScroll = false, theme = 'auto', changeNavigation = false,
  collapseUnchanged = false, changesOnly = false, contextLines = 3, chrome = 'default', radius, border = 'default',
  onOriginalChange, onModifiedChange, className = '', style, ref,
}: DiffEditorProps) {
  const { t } = useI18n();
  const [modeState, setModeState] = useState<DiffMode>('side-by-side');
  const [split, setSplit] = useState(50);
  const [changeIndex, setChangeIndex] = useState(0);
  const originalEditorRef = useRef<CodeEditorHandle>(null);
  const modifiedEditorRef = useRef<CodeEditorHandle>(null);
  const actualOriginal = original ?? oldCode;
  const actualModified = modified ?? newCode;
  const mode = propMode ?? modeState;
  const lines = useMemo(() => filterDiff(computeDiff(actualOriginal, actualModified), collapseUnchanged, changesOnly, Math.max(0, contextLines)), [actualModified, actualOriginal, changesOnly, collapseUnchanged, contextLines]);
  const changes = useMemo(() => lines.reduce<number[]>((indices, line, index) => { if (line.type !== 'unchanged' && (indices.length === 0 || index > (indices.at(-1) ?? -2) + 1)) indices.push(index); return indices; }, []), [lines]);
  const nextChange = useCallback(() => { if (changes.length === 0) return; const next = (changeIndex + 1) % changes.length; setChangeIndex(next); modifiedEditorRef.current?.scrollTo({ top: changes[next] * Math.max(1, fontSize * 1.6) }); originalEditorRef.current?.scrollTo({ top: changes[next] * Math.max(1, fontSize * 1.6) }); }, [changeIndex, changes, fontSize]);
  const prevChange = useCallback(() => { if (changes.length === 0) return; const next = (changeIndex - 1 + changes.length) % changes.length; setChangeIndex(next); modifiedEditorRef.current?.scrollTo({ top: changes[next] * Math.max(1, fontSize * 1.6) }); originalEditorRef.current?.scrollTo({ top: changes[next] * Math.max(1, fontSize * 1.6) }); }, [changeIndex, changes, fontSize]);
  const toggleMode = useCallback(() => { const next = mode === 'side-by-side' ? 'inline' : 'side-by-side'; setModeState(next); onModeChange?.(next); }, [mode, onModeChange]);
  useImperativeHandle(ref, () => ({ nextChange, prevChange, toggleMode, getOriginalEditor: () => originalEditorRef.current, getModifiedEditor: () => modifiedEditorRef.current }), [nextChange, prevChange, toggleMode]);

  const inlineCode = lines.map((line) => `${line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}${line.content}`).join('\n');
  const inlinePrefixes = new Map(lines.map((line, index) => [index, line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ']));
  const shellClass = ['sp-diff-editor', `sp-chrome--${chrome}`, radius && `sp-radius--${radius}`, `sp-border--${border}`, horizontalScroll && 'sp-diff-editor--horizontal-scroll', stretch && 'sp-diff-editor--stretch', className].filter(Boolean).join(' ');
  const paneStyle = { minHeight, maxHeight, height } as CSSProperties;

  const body = mode === 'inline' ? <CodeEditor code={inlineCode} language={language} readonly theme={theme} fontSize={fontSize} fontZoom={fontZoom} showLineNumbers={showLineNumbers} showMinimap={showMinimap} minHeight={minHeightToString(minHeight)} maxHeight={minHeightToString(maxHeight)} lineGutterPrefixes={inlinePrefixes} ariaLabel={ariaLabel ?? t('diffEditor')} /> : <div className="sp-diff-editor__panes" style={{ gridTemplateColumns: showSplitter ? `${split}% 1fr` : '1fr 1fr' }}>
    <section className="sp-diff-editor__pane" aria-label={originalLabel ?? t('original')}>
      <div className="sp-diff-editor__label">{originalLabel ?? t('original')}</div>
      <CodeEditor ref={originalEditorRef} code={actualOriginal} language={language} readonly theme={theme} fontSize={fontSize} fontZoom={fontZoom} onFontZoomChange={onFontZoomChange} showLineNumbers={showLineNumbers} showMinimap={showMinimap} minHeight={minHeightToString(minHeight)} maxHeight={minHeightToString(maxHeight)} onCodeChange={onOriginalChange} ariaLabel={originalLabel ?? t('original')} />
    </section>
    {showSplitter && <div className="sp-diff-editor__splitter" role="separator" aria-orientation="vertical" aria-label={t('resizableSplitView')} tabIndex={0} onKeyDown={(event) => { if (event.key === 'ArrowLeft') setSplit((value) => Math.max(20, value - 5)); if (event.key === 'ArrowRight') setSplit((value) => Math.min(80, value + 5)); }} onPointerDown={(event) => { const startX = event.clientX; const start = split; const move = (moveEvent: PointerEvent) => setSplit(Math.max(20, Math.min(80, start + ((moveEvent.clientX - startX) / Math.max(1, window.innerWidth)) * 100))); const stop = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop); }; window.addEventListener('pointermove', move); window.addEventListener('pointerup', stop); }} />}
    <section className="sp-diff-editor__pane" aria-label={modifiedLabel ?? t('modified')}>
      <div className="sp-diff-editor__label">{modifiedLabel ?? t('modified')}</div>
      <CodeEditor ref={modifiedEditorRef} code={actualModified} language={language} readonly={readOnly || !editable} theme={theme} fontSize={fontSize} fontZoom={fontZoom} onFontZoomChange={onFontZoomChange} showLineNumbers={showLineNumbers} showMinimap={showMinimap} minHeight={minHeightToString(minHeight)} maxHeight={minHeightToString(maxHeight)} onCodeChange={onModifiedChange} ariaLabel={modifiedLabel ?? t('modified')} />
    </section>
  </div>;

  return <div className={shellClass} style={style} role="region" aria-label={ariaLabel ?? t('diffEditor')}>
    <div className="sp-diff-editor__toolbar" role="toolbar" aria-label={t('formattingOptions')}>
      {showModeToggle && <Button size="sm" variant="ghost" iconLeft="columns" active={mode === 'side-by-side'} onClick={toggleMode}>{mode === 'side-by-side' ? t('sideBySide') : t('inline')}</Button>}
      {changeNavigation && <><Button size="sm" variant="ghost" iconOnly iconLeft="chevron-up" aria-label={t('previousChange')} disabled={changes.length === 0} onClick={prevChange} /><Button size="sm" variant="ghost" iconOnly iconLeft="chevron-down" aria-label={t('nextChange')} disabled={changes.length === 0} onClick={nextChange} /><span className="sp-diff-editor__change-count" aria-live="polite">{changes.length ? `${changeIndex + 1} ${t('of')} ${changes.length}` : '0'}</span></>}
    </div>
    <div className="sp-diff-editor__body" style={paneStyle}>{body}</div>
  </div>;
}

function minHeightToString(value: string | number | undefined): string {
  return typeof value === 'number' ? `${value}px` : value ?? '200px';
}
