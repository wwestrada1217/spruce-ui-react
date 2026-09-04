import { useState, useMemo, useRef, useEffect, useCallback, type ReactNode } from 'react';
import {
  Icon,
  PropertyPanel,
  type PropertyPanelProperty,
  type PropertyPanelValues,
  type PropertyPanelMode,
  type PropertyPanelCollapsedGroups,
} from 'spruce-react';
import './CodePreview.css';

export type CodePreviewTab = 'preview' | 'code';
export type CodeLanguage = 'html' | 'typescript' | 'scss' | 'css' | 'json' | 'bash' | string;

export interface CodeFile {
  label: string;
  language: CodeLanguage;
  code: string;
}

export interface DocsCodeViewerProps {
  code?: string;
  language?: CodeLanguage;
  showLineNumbers?: boolean;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cleanCodeString(code: string): string {
  if (!code) return '';
  let str = code.replace(/^[\r\n]+/, '');
  str = str.replace(/\s+$/, '');

  const lines = str.split('\n');
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim().length > 0) {
      const match = line.match(/^[ \t]*/);
      const indent = match ? match[0].length : 0;
      if (indent < minIndent) {
        minIndent = indent;
      }
    }
  }

  if (minIndent > 0 && minIndent !== Infinity) {
    str = lines.map((line) => (line.length >= minIndent ? line.slice(minIndent) : line)).join('\n');
  }

  return str;
}

const STRING_RE =
  /&quot;(?:(?!&quot;)[\s\S])*?&quot;|&#039;(?:(?!&#039;)[\s\S])*?&#039;|`(?:[^`\\]|\\.)*`/g;
const NUMBER_RE = /(?<!&#)\b\d+(\.\d+)?\b/g;
const NUMBER_RE_CSS = /(?<!&#)\b\d+(\.\d+)?(px|rem|em|%|s|ms|deg|vh|vw)?\b/g;

function highlightSyntax(code: string, lang: string): string {
  if (!code) return '';

  const tokens: { id: string; val: string }[] = [];
  let tokenIdx = 0;

  function pushToken(val: string, cls: string): string {
    const id = `___TOK_${tokenIdx++}___`;
    tokens.push({ id, val: `<span class="${cls}">${val}</span>` });
    return id;
  }

  let src = escapeHtml(code);
  const l = (lang || 'html').toLowerCase();

  if (l === 'html' || l === 'xml' || l === 'angular') {
    src = src.replace(/&lt;!--[\s\S]*?--&gt;/g, (m) => pushToken(m, 'tok-cmt'));
    src = src.replace(
      /@(if|else|for|switch|case|let|key|defer|placeholder|loading|error)\b/g,
      (m) => pushToken(m, 'tok-kw'),
    );
    src = src.replace(STRING_RE, (m) => pushToken(m, 'tok-str'));
    src = src.replace(/&lt;\/?[a-zA-Z0-9_-]+/g, (m) => pushToken(m, 'tok-tag'));
    src = src.replace(/\/&gt;|&gt;/g, (m) => pushToken(m, 'tok-tag'));
    src = src.replace(/\b([a-zA-Z0-9_-]+|\[[a-zA-Z0-9_.-]+\]|\([a-zA-Z0-9_.-]+\))(?==|\s)/g, (m) =>
      pushToken(m, 'tok-attr'),
    );
  } else if (l === 'css' || l === 'scss' || l === 'less') {
    src = src.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, (m) => pushToken(m, 'tok-cmt'));
    src = src.replace(STRING_RE, (m) => pushToken(m, 'tok-str'));
    src = src.replace(/#[0-9a-fA-F]{3,8}\b/g, (m) => pushToken(m, 'tok-str'));
    src = src.replace(
      /(:host|::ng-deep|:hover|:focus|:active|:disabled|@media|@keyframes|@import)\b/g,
      (m) => pushToken(m, 'tok-sel'),
    );
    src = src.replace(/var\(--[a-zA-Z0-9_-]+\)|--[a-zA-Z0-9_-]+/g, (m) => pushToken(m, 'tok-var'));
    src = src.replace(/\b[a-zA-Z0-9-]+(?=\s*:)/g, (m) => pushToken(m, 'tok-attr'));
    src = src.replace(NUMBER_RE_CSS, (m) => pushToken(m, 'tok-num'));
  } else if (l === 'json') {
    src = src.replace(/&quot;[^&quot;]+&quot;(?=\s*:)/g, (m) => pushToken(m, 'tok-attr'));
    src = src.replace(/&quot;[^&quot;]*&quot;/g, (m) => pushToken(m, 'tok-str'));
    src = src.replace(/(?<!&#)\b(-?\d+(\.\d+)?|true|false|null)\b/g, (m) =>
      pushToken(m, 'tok-num'),
    );
  } else {
    src = src.replace(/\/\/.*/g, (m) => pushToken(m, 'tok-cmt'));
    src = src.replace(/\/\*[\s\S]*?\*\//g, (m) => pushToken(m, 'tok-cmt'));
    src = src.replace(STRING_RE, (m) => pushToken(m, 'tok-str'));
    src = src.replace(/@[a-zA-Z0-9_]+/g, (m) => pushToken(m, 'tok-dec'));
    src = src.replace(
      /\b(import|export|from|class|extends|implements|interface|type|const|let|var|readonly|private|protected|public|static|function|return|if|else|switch|case|for|while|do|new|this|async|await|try|catch|finally|throw|default|of|in|as)\b/g,
      (m) => pushToken(m, 'tok-kw'),
    );
    src = src.replace(
      /\b(string|number|boolean|void|unknown|any|never|null|undefined|true|false|signal|computed|input|output|model|inject|Signal|WritableSignal|InputSignal)\b/g,
      (m) => pushToken(m, 'tok-type'),
    );
    src = src.replace(/\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/g, (m) => pushToken(m, 'tok-fn'));
    src = src.replace(NUMBER_RE, (m) => pushToken(m, 'tok-num'));
  }

  for (let i = tokens.length - 1; i >= 0; i--) {
    src = src.replace(tokens[i].id, tokens[i].val);
  }

  return src;
}

export function DocsCodeViewer({
  code = '',
  language = 'html',
  showLineNumbers = true,
}: DocsCodeViewerProps) {
  const cleanedCode = useMemo(() => cleanCodeString(code || ''), [code]);
  const lines = useMemo(() => cleanedCode.split('\n'), [cleanedCode]);
  const highlightedCode = useMemo(() => {
    const lang = (language || 'html').toLowerCase();
    return highlightSyntax(cleanedCode, lang);
  }, [cleanedCode, language]);

  return (
    <div className="docs-cv">
      <div className="docs-cv__wrapper">
        {showLineNumbers && (
          <div className="docs-cv__lines" aria-hidden="true">
            {lines.map((_, i) => (
              <span key={i} className="docs-cv__num">
                {i + 1}
              </span>
            ))}
          </div>
        )}
        <pre className="docs-cv__pre">
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
      </div>
    </div>
  );
}

export interface CodePreviewProps {
  /** Source code string for single-file display */
  code?: string;
  /** Language for single-file syntax highlighting (default 'html') */
  language?: CodeLanguage;
  /** Array of files for multi-file display */
  files?: CodeFile[];
  /** Optional title shown in the toolbar */
  title?: string;
  /** Reduces preview panel padding */
  compact?: boolean;
  /** When true, hides Preview/Code tabs and shows only code panel with copy button */
  codeOnly?: boolean;
  /** Enables the property panel when properties are provided */
  propertyPanelEnabled?: boolean;
  /** Property metadata array rendered in the side property panel */
  propertyPanelProperties?: readonly PropertyPanelProperty[];
  /** Accessible aria-label for the embedded property panel */
  propertyPanelAriaLabel?: string;
  /** Controlled property panel open state */
  propertyPanelOpen?: boolean;
  /** Default property panel open state */
  defaultPropertyPanelOpen?: boolean;
  /** Callback when property panel open state changes */
  onPropertyPanelOpenChange?: (open: boolean) => void;
  /** Controlled property panel values */
  propertyPanelValues?: PropertyPanelValues;
  /** Default property panel values */
  defaultPropertyPanelValues?: PropertyPanelValues;
  /** Callback when property panel values change */
  onPropertyPanelValuesChange?: (values: PropertyPanelValues) => void;
  /** Property panel mode ('categorized' | 'alphabetical') */
  propertyPanelMode?: PropertyPanelMode;
  /** Default property panel mode */
  defaultPropertyPanelMode?: PropertyPanelMode;
  /** Callback when property panel mode changes */
  onPropertyPanelModeChange?: (mode: PropertyPanelMode) => void;
  /** Collapsed groups map */
  propertyPanelCollapsedGroups?: PropertyPanelCollapsedGroups;
  /** Default collapsed groups map */
  defaultPropertyPanelCollapsedGroups?: PropertyPanelCollapsedGroups;
  /** Callback when collapsed groups change */
  onPropertyPanelCollapsedGroupsChange?: (groups: PropertyPanelCollapsedGroups) => void;
  /** Minimum resizable width for property panel in pixels */
  propertyPanelMinWidth?: number;
  /** Maximum resizable width for property panel in pixels */
  propertyPanelMaxWidth?: number;
  /** Controlled property panel width in pixels */
  propertyPanelWidth?: number;
  /** Default property panel width in pixels */
  defaultPropertyPanelWidth?: number;
  /** Callback when property panel width changes */
  onPropertyPanelWidthChange?: (width: number) => void;
  /** Live component projected in the preview panel */
  children?: ReactNode;
}

export function CodePreview({
  code,
  language = 'html',
  files,
  title,
  compact = false,
  codeOnly = false,
  propertyPanelEnabled = false,
  propertyPanelProperties = [],
  propertyPanelAriaLabel = 'Preview properties',
  propertyPanelOpen: propertyPanelOpenProp,
  defaultPropertyPanelOpen = false,
  onPropertyPanelOpenChange,
  propertyPanelValues: propertyPanelValuesProp,
  defaultPropertyPanelValues = {},
  onPropertyPanelValuesChange,
  propertyPanelMode: propertyPanelModeProp,
  defaultPropertyPanelMode = 'categorized',
  onPropertyPanelModeChange,
  propertyPanelCollapsedGroups: propertyPanelCollapsedGroupsProp,
  defaultPropertyPanelCollapsedGroups = {},
  onPropertyPanelCollapsedGroupsChange,
  propertyPanelMinWidth = 280,
  propertyPanelMaxWidth = 520,
  propertyPanelWidth: propertyPanelWidthProp,
  defaultPropertyPanelWidth = 420,
  onPropertyPanelWidthChange,
  children,
}: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<CodePreviewTab>(codeOnly ? 'code' : 'preview');
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Property panel open state (controlled/uncontrolled)
  const [internalOpen, setInternalOpen] = useState(defaultPropertyPanelOpen);
  const isOpenControlled = propertyPanelOpenProp !== undefined;
  const propertyPanelOpen = isOpenControlled ? propertyPanelOpenProp : internalOpen;
  const setOpen = useCallback(
    (nextOpen: boolean | ((prev: boolean) => boolean)) => {
      const val = typeof nextOpen === 'function' ? nextOpen(propertyPanelOpen) : nextOpen;
      if (!isOpenControlled) setInternalOpen(val);
      onPropertyPanelOpenChange?.(val);
    },
    [isOpenControlled, propertyPanelOpen, onPropertyPanelOpenChange]
  );

  // Property panel values state (controlled/uncontrolled)
  const [internalValues, setInternalValues] = useState<PropertyPanelValues>(defaultPropertyPanelValues);
  const isValuesControlled = propertyPanelValuesProp !== undefined;
  const propertyPanelValues = isValuesControlled ? propertyPanelValuesProp : internalValues;
  const setValues = useCallback(
    (nextValues: PropertyPanelValues | ((prev: PropertyPanelValues) => PropertyPanelValues)) => {
      const val = typeof nextValues === 'function' ? nextValues(propertyPanelValues) : nextValues;
      if (!isValuesControlled) setInternalValues(val);
      onPropertyPanelValuesChange?.(val);
    },
    [isValuesControlled, propertyPanelValues, onPropertyPanelValuesChange]
  );

  // Property panel mode state (controlled/uncontrolled)
  const [internalMode, setInternalMode] = useState<PropertyPanelMode>(defaultPropertyPanelMode);
  const isModeControlled = propertyPanelModeProp !== undefined;
  const propertyPanelMode = isModeControlled ? propertyPanelModeProp : internalMode;
  const setMode = useCallback(
    (nextMode: PropertyPanelMode | ((prev: PropertyPanelMode) => PropertyPanelMode)) => {
      const val = typeof nextMode === 'function' ? nextMode(propertyPanelMode) : nextMode;
      if (!isModeControlled) setInternalMode(val);
      onPropertyPanelModeChange?.(val);
    },
    [isModeControlled, propertyPanelMode, onPropertyPanelModeChange]
  );

  // Property panel collapsed groups state (controlled/uncontrolled)
  const [internalCollapsed, setInternalCollapsed] =
    useState<PropertyPanelCollapsedGroups>(defaultPropertyPanelCollapsedGroups);
  const isCollapsedControlled = propertyPanelCollapsedGroupsProp !== undefined;
  const propertyPanelCollapsedGroups = isCollapsedControlled
    ? propertyPanelCollapsedGroupsProp
    : internalCollapsed;
  const setCollapsedGroups = useCallback(
    (
      nextCollapsed:
        | PropertyPanelCollapsedGroups
        | ((prev: PropertyPanelCollapsedGroups) => PropertyPanelCollapsedGroups)
    ) => {
      const val =
        typeof nextCollapsed === 'function'
          ? nextCollapsed(propertyPanelCollapsedGroups)
          : nextCollapsed;
      if (!isCollapsedControlled) setInternalCollapsed(val);
      onPropertyPanelCollapsedGroupsChange?.(val);
    },
    [isCollapsedControlled, propertyPanelCollapsedGroups, onPropertyPanelCollapsedGroupsChange]
  );

  // Property panel width state (controlled/uncontrolled)
  const [internalWidth, setInternalWidth] = useState(defaultPropertyPanelWidth);
  const isWidthControlled = propertyPanelWidthProp !== undefined;
  const propertyPanelWidth = isWidthControlled ? propertyPanelWidthProp : internalWidth;
  const setWidth = useCallback(
    (nextWidth: number | ((prev: number) => number)) => {
      const val = typeof nextWidth === 'function' ? nextWidth(propertyPanelWidth) : nextWidth;
      const clamped = Math.min(propertyPanelMaxWidth, Math.max(propertyPanelMinWidth, val));
      if (!isWidthControlled) setInternalWidth(clamped);
      onPropertyPanelWidthChange?.(clamped);
    },
    [
      isWidthControlled,
      propertyPanelWidth,
      propertyPanelMaxWidth,
      propertyPanelMinWidth,
      onPropertyPanelWidthChange,
    ]
  );

  const currentTab: CodePreviewTab = codeOnly ? 'code' : activeTab;
  const propertyPanelAvailable =
    propertyPanelEnabled && !codeOnly && propertyPanelProperties.length > 0;
  const propertyPanelVisible =
    currentTab === 'preview' && propertyPanelAvailable && propertyPanelOpen;

  const resolvedFiles = useMemo<CodeFile[]>(() => {
    if (files && files.length > 0) return files;
    if (code !== undefined && code !== null) {
      return [{ label: language, code, language }];
    }
    return [];
  }, [files, code, language]);

  const activeFile = useMemo<CodeFile>(() => {
    const idx = Math.min(activeFileIndex, resolvedFiles.length - 1);
    return resolvedFiles[idx] ?? { label: '', language: 'html', code: '' };
  }, [resolvedFiles, activeFileIndex]);

  const copyCode = () => {
    navigator.clipboard.writeText(activeFile.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const togglePropertyPanel = () => {
    const nextOpen = !propertyPanelOpen;
    setOpen(nextOpen);
    if (nextOpen) {
      setActiveTab('preview');
    }
  };

  const previewShellRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef(false);

  const startPropertyResize = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    resizingRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);

    const onPointerMove = (e: globalThis.PointerEvent) => {
      if (!resizingRef.current) return;
      const shell = previewShellRef.current;
      if (!shell) return;
      const rect = shell.getBoundingClientRect();
      const newWidth = rect.right - e.clientX;
      setWidth(newWidth);
    };

    const onPointerEnd = () => {
      resizingRef.current = false;
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerEnd);
      document.removeEventListener('pointercancel', onPointerEnd);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerEnd, { once: true });
    document.addEventListener('pointercancel', onPointerEnd, { once: true });
  };

  useEffect(() => {
    return () => {
      resizingRef.current = false;
    };
  }, []);

  const onPropertySplitterKeydown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const increment = event.shiftKey ? 40 : 20;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setWidth(propertyPanelWidth + increment);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setWidth(propertyPanelWidth - increment);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setWidth(propertyPanelMaxWidth);
    } else if (event.key === 'End') {
      event.preventDefault();
      setWidth(propertyPanelMinWidth);
    }
  };

  return (
    <div className={`cp${compact ? ' cp--compact' : ''}`}>
      {/* Toolbar */}
      <div className="cp__toolbar">
        {title && <span className="cp__title">{title}</span>}
        <div className="cp__actions">
          {!codeOnly && (
            <>
              <button
                className={`cp__tab${currentTab === 'preview' ? ' cp__tab--active' : ''}`}
                type="button"
                onClick={() => setActiveTab('preview')}
                aria-label="Show preview"
              >
                <Icon name="eye" size={14} />
                Preview
              </button>
              <button
                className={`cp__tab${currentTab === 'code' ? ' cp__tab--active' : ''}`}
                type="button"
                onClick={() => setActiveTab('code')}
                aria-label="Show code"
              >
                <Icon name="code" size={14} />
                Code
              </button>

              {propertyPanelAvailable && (
                <button
                  className={`cp__tab${currentTab === 'preview' && propertyPanelOpen ? ' cp__tab--active' : ''}`}
                  type="button"
                  aria-pressed={propertyPanelOpen}
                  onClick={togglePropertyPanel}
                  aria-label="Show properties"
                >
                  <Icon name="sliders-horizontal" size={14} />
                  Properties
                </button>
              )}
            </>
          )}

          {currentTab === 'code' && (
            <button
              className="cp__copy"
              type="button"
              onClick={copyCode}
              aria-label={copied ? 'Copied' : 'Copy code'}
            >
              <Icon name={copied ? 'check' : 'copy'} size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Preview panel */}
      {currentTab === 'preview' && (
        <div
          ref={previewShellRef}
          className={`cp__preview-shell${propertyPanelVisible ? ' cp__preview-shell--with-properties' : ''}`}
          style={
            propertyPanelVisible
              ? ({ '--cp-property-panel-width': `${propertyPanelWidth}px` } as React.CSSProperties)
              : undefined
          }
        >
          <div className={`cp__preview${propertyPanelVisible ? ' cp__preview--split' : ''}`}>
            {children}
          </div>

          {propertyPanelVisible && (
            <>
              <button
                className="cp__splitter"
                type="button"
                role="separator"
                aria-label="Resize properties panel"
                aria-orientation="vertical"
                aria-valuemin={propertyPanelMinWidth}
                aria-valuemax={propertyPanelMaxWidth}
                aria-valuenow={propertyPanelWidth}
                onPointerDown={startPropertyResize}
                onKeyDown={onPropertySplitterKeydown}
              >
                <span />
              </button>

              <aside className="cp__property-panel" aria-label={propertyPanelAriaLabel}>
                <PropertyPanel
                  properties={propertyPanelProperties}
                  values={propertyPanelValues}
                  onValuesChange={setValues}
                  mode={propertyPanelMode}
                  onModeChange={setMode}
                  collapsedGroups={propertyPanelCollapsedGroups}
                  onCollapsedGroupsChange={setCollapsedGroups}
                  ariaLabel={propertyPanelAriaLabel}
                />
              </aside>
            </>
          )}
        </div>
      )}

      {/* Code panel */}
      {currentTab === 'code' && (
        <div className="cp__code">
          {resolvedFiles.length > 1 && (
            <div className="cp__file-tabs" role="tablist" aria-label="Code files">
              {resolvedFiles.map((file, i) => (
                <button
                  key={file.label}
                  className={`cp__file-tab${activeFileIndex === i ? ' cp__file-tab--active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={activeFileIndex === i}
                  onClick={() => setActiveFileIndex(i)}
                >
                  {file.label}
                </button>
              ))}
            </div>
          )}
          <DocsCodeViewer
            code={activeFile.code}
            language={activeFile.language}
            showLineNumbers={true}
          />
        </div>
      )}
    </div>
  );
}
