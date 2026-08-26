import type { CodeLanguage } from './languages/index.js';
import type { DropdownItem } from '../dropdown/Dropdown.js';

export type CodeEditorTheme =
  | 'auto'
  | 'catppuccin-mocha'
  | 'catppuccin-latte'
  | 'one-dark'
  | 'dracula'
  | 'github-dark'
  | 'github-light'
  | 'nord';

export interface SpCodeEditorPosition {
  line: number;
  col: number;
}

export interface SpCodeEditorViewZone {
  afterDisplayRow: number;
  heightInRows: number;
  className?: string;
}

export type ScrollMarkerKind = 'modified' | 'search' | 'selection' | 'error' | 'warning';

export interface CodeEditorStatus {
  line: number;
  column: number;
  overwriteMode: boolean;
  selectedCharacters: number;
  isModified: boolean;
}

export type DiagnosticSeverity = 'error' | 'warning' | 'info' | 'hint';

export interface SpCodeEditorDiagnostic {
  line: number;
  startCol: number;
  endCol: number;
  severity: DiagnosticSeverity;
  message: string;
  source?: string;
  code?: string | number;
}

export interface HoverContext {
  line: number;
  col: number;
  language: CodeLanguage;
  word: string;
}

export interface HoverInfo {
  contents: string;
  range?: { line: number; startCol: number; endCol: number };
}

export type CompletionTriggerKind = 'invoke' | 'character' | 'typing';

export interface CompletionContext {
  line: number;
  col: number;
  language: CodeLanguage;
  triggerKind: CompletionTriggerKind;
  triggerCharacter?: string;
  linePrefix: string;
  wordPrefix: string;
}

export type CompletionItemKind =
  | 'keyword'
  | 'function'
  | 'method'
  | 'variable'
  | 'class'
  | 'interface'
  | 'enum'
  | 'property'
  | 'snippet'
  | 'text'
  | 'module'
  | 'constant';

export interface CompletionItem {
  label: string;
  kind?: CompletionItemKind;
  detail?: string;
  documentation?: string;
  insertText?: string;
  filterText?: string;
  sortText?: string;
}

export interface SignatureContext {
  line: number;
  col: number;
  language: CodeLanguage;
  triggerCharacter?: '(' | ',';
  callRange: { line: number; startCol: number };
}

export interface ParameterInfo {
  label: string | [number, number];
  documentation?: string;
}

export interface SignatureInfo {
  label: string;
  parameters: readonly ParameterInfo[];
  documentation?: string;
}

export interface SignatureHelp {
  signatures: readonly SignatureInfo[];
  activeSignature: number;
  activeParameter: number;
}

export interface InlineSuggestionContext {
  line: number;
  col: number;
  language: CodeLanguage;
  linePrefix: string;
}

export interface InlineSuggestion {
  text: string;
}

export interface SpCodeEditorDecoration {
  line: number;
  startCol?: number;
  endCol?: number;
  className: string;
  wholeLine?: boolean;
}

export interface SpCodeEditorToolbarAction {
  icon: string;
  label: string;
  ariaLabel?: string;
  disabled?: boolean;
  command: () => void;
}

export interface CodeEditorHandle {
  scrollTo(position: { top?: number; left?: number }): void;
  getScrollPosition(): { scrollTop: number; scrollLeft: number };
  getSelectedText(): string;
  openFind(): void;
  openGoToLine(): void;
  closeCommandPanel(): void;
  findNext(): void;
  findPrev(): void;
  formatDocument(): void;
  trimTrailingWhitespace(): void;
  indentToSpaces(): void;
  indentToTabs(): void;
  zoomIn(): void;
  zoomOut(): void;
  resetZoom(): void;
  triggerCompletion(): void;
  acceptCompletion(): boolean;
  acceptInlineSuggestion(scope?: 'all' | 'word'): boolean;
}

export type CodeEditorContextMenuItem = DropdownItem;

export function getBuiltinCompletions(language: CodeLanguage): readonly CompletionItem[] {
  const common: CompletionItem[] = [
    { label: 'const', kind: 'keyword' },
    { label: 'let', kind: 'keyword' },
    { label: 'function', kind: 'keyword' },
    { label: 'return', kind: 'keyword' },
    { label: 'import', kind: 'keyword' },
    { label: 'export', kind: 'keyword' },
    { label: 'class', kind: 'keyword' },
    { label: 'true', kind: 'constant' },
    { label: 'false', kind: 'constant' },
    { label: 'null', kind: 'constant' },
  ];
  if (language === 'json' || language === 'markdown') return [];
  return common;
}
