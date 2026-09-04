import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CodeEditor, Icon, PropertyPanel, useI18n } from 'spruce-react';
import type {
  CodeLanguage,
  PropertyPanelCollapsedGroups,
  PropertyPanelMode,
  PropertyPanelProperty,
  PropertyPanelValues,
} from 'spruce-react';
import './CodePreview.css';

export interface CodeFile {
  label: string;
  language: CodeLanguage;
  code: string;
}

export type CodePreviewTab = 'preview' | 'code';

export interface CodePreviewProps {
  /** Source code to display in the code panel (single-file shorthand) */
  code?: string;
  /** Language for single-file syntax highlighting */
  language?: CodeLanguage;
  /** Multiple files — overrides code/language when provided */
  files?: CodeFile[];
  /** Optional toolbar title */
  title?: string;
  /** Reduce preview padding */
  compact?: boolean;
  /** Show only the code panel without the preview tab */
  codeOnly?: boolean;
  /** Enable the optional preview property inspector when properties are supplied. */
  propertyPanelEnabled?: boolean;
  /** Properties rendered by the optional preview inspector. */
  propertyPanelProperties?: readonly PropertyPanelProperty[];
  /** Accessible name for the property inspector. */
  propertyPanelAriaLabel?: string;
  /** Controlled visibility for the property inspector. */
  propertyPanelOpen?: boolean;
  /** Called when the property inspector visibility changes. */
  onPropertyPanelOpenChange?: (open: boolean) => void;
  /** Controlled inspector values. */
  propertyPanelValues?: PropertyPanelValues;
  /** Called when an inspector value changes. */
  onPropertyPanelValuesChange?: (values: PropertyPanelValues) => void;
  /** Controlled inspector grouping mode. */
  propertyPanelMode?: PropertyPanelMode;
  /** Called when inspector grouping mode changes. */
  onPropertyPanelModeChange?: (mode: PropertyPanelMode) => void;
  /** Controlled collapsed inspector groups. */
  propertyPanelCollapsedGroups?: PropertyPanelCollapsedGroups;
  /** Called when inspector group expansion changes. */
  onPropertyPanelCollapsedGroupsChange?: (groups: PropertyPanelCollapsedGroups) => void;
  /** Minimum and maximum split-pane widths in pixels. */
  propertyPanelMinWidth?: number;
  propertyPanelMaxWidth?: number;
  /** Controlled split-pane width in pixels. */
  propertyPanelWidth?: number;
  /** Called when the split-pane width changes. */
  onPropertyPanelWidthChange?: (width: number) => void;
  /** Preview content rendered in the preview panel */
  children?: ReactNode;
}

export function CodePreview({
  code,
  language = 'typescript',
  files,
  title,
  compact = false,
  codeOnly = false,
  propertyPanelEnabled = false,
  propertyPanelProperties = [],
  propertyPanelAriaLabel,
  propertyPanelOpen,
  onPropertyPanelOpenChange,
  propertyPanelValues,
  onPropertyPanelValuesChange,
  propertyPanelMode,
  onPropertyPanelModeChange,
  propertyPanelCollapsedGroups,
  onPropertyPanelCollapsedGroupsChange,
  propertyPanelMinWidth = 280,
  propertyPanelMaxWidth = 520,
  propertyPanelWidth,
  onPropertyPanelWidthChange,
  children,
}: CodePreviewProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<CodePreviewTab>(codeOnly ? 'code' : 'preview');
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [internalPropertyPanelOpen, setInternalPropertyPanelOpen] = useState(false);
  const [internalPropertyPanelWidth, setInternalPropertyPanelWidth] = useState(420);
  const [isResizingPropertyPanel, setIsResizingPropertyPanel] = useState(false);
  const resizeStart = useRef<{ clientX: number; width: number } | null>(null);

  const currentTab: CodePreviewTab = codeOnly ? 'code' : activeTab;
  const propertyPanelAvailable = propertyPanelEnabled && propertyPanelProperties.length > 0 && !codeOnly;
  const resolvedPropertyPanelOpen = propertyPanelOpen ?? internalPropertyPanelOpen;
  const propertyPanelVisible = currentTab === 'preview' && propertyPanelAvailable && resolvedPropertyPanelOpen;
  const resolvedPropertyPanelWidth = Math.min(
    propertyPanelMaxWidth,
    Math.max(propertyPanelMinWidth, propertyPanelWidth ?? internalPropertyPanelWidth),
  );

  useEffect(() => {
    if (!isResizingPropertyPanel) return;
    const onPointerMove = (event: PointerEvent) => {
      const start = resizeStart.current;
      if (!start) return;
      const next = Math.min(propertyPanelMaxWidth, Math.max(propertyPanelMinWidth, start.width - (event.clientX - start.clientX)));
      if (propertyPanelWidth === undefined) setInternalPropertyPanelWidth(next);
      onPropertyPanelWidthChange?.(next);
    };
    const onPointerUp = () => {
      resizeStart.current = null;
      setIsResizingPropertyPanel(false);
    };
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointercancel', onPointerUp);
    };
  }, [isResizingPropertyPanel, onPropertyPanelWidthChange, propertyPanelMaxWidth, propertyPanelMinWidth, propertyPanelWidth]);

  const resolvedFiles = useMemo<CodeFile[]>(() => {
    if (files && files.length > 0) return files;
    return [{ label: 'Code', language, code: code ?? '' }];
  }, [files, language, code]);

  const activeFile = resolvedFiles[activeFileIndex] ?? resolvedFiles[0];
  const isMultiFile = resolvedFiles.length > 1;

  async function copyCode(): Promise<void> {
    try {
      await navigator.clipboard?.writeText(activeFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permissions are optional in embedded documentation previews.
    }
  }

  function setPropertyPanelOpen(next: boolean): void {
    if (propertyPanelOpen === undefined) setInternalPropertyPanelOpen(next);
    if (next) setActiveTab('preview');
    onPropertyPanelOpenChange?.(next);
  }

  function beginPropertyPanelResize(event: React.PointerEvent<HTMLButtonElement>): void {
    event.preventDefault();
    resizeStart.current = { clientX: event.clientX, width: resolvedPropertyPanelWidth };
    setIsResizingPropertyPanel(true);
  }

  function handlePropertyPanelResizeKeyDown(event: React.KeyboardEvent<HTMLButtonElement>): void {
    let next: number | null = null;
    if (event.key === 'ArrowLeft') next = resolvedPropertyPanelWidth + 16;
    if (event.key === 'ArrowRight') next = resolvedPropertyPanelWidth - 16;
    if (event.key === 'Home') next = propertyPanelMaxWidth;
    if (event.key === 'End') next = propertyPanelMinWidth;
    if (next === null) return;
    event.preventDefault();
    const clamped = Math.min(propertyPanelMaxWidth, Math.max(propertyPanelMinWidth, next));
    if (propertyPanelWidth === undefined) setInternalPropertyPanelWidth(clamped);
    onPropertyPanelWidthChange?.(clamped);
  }

  return (
    <div className={`cp${compact ? ' cp--compact' : ''}`}>
      <div className="cp__toolbar">
        {title && <span className="cp__title">{title}</span>}
        <div className="cp__actions">
          {!codeOnly && (
            <div className="cp__tabs" role="tablist" aria-label="Code preview modes">
              <button
                type="button"
                role="tab"
                className={`cp__tab${currentTab === 'preview' ? ' cp__tab--active' : ''}`}
                onClick={() => setActiveTab('preview')}
                aria-selected={currentTab === 'preview'}
                tabIndex={currentTab === 'preview' ? 0 : -1}
              >
                <Icon name="eye" size={12} aria-hidden="true" />
                {t('preview')}
              </button>
              <button
                type="button"
                role="tab"
                className={`cp__tab${currentTab === 'code' ? ' cp__tab--active' : ''}`}
                onClick={() => setActiveTab('code')}
                aria-selected={currentTab === 'code'}
                tabIndex={currentTab === 'code' ? 0 : -1}
              >
                <Icon name="code" size={12} aria-hidden="true" />
                Code
              </button>
            </div>
          )}
          {propertyPanelAvailable && (
            <button
              type="button"
              className={`cp__tab${resolvedPropertyPanelOpen ? ' cp__tab--active' : ''}`}
              onClick={() => setPropertyPanelOpen(!resolvedPropertyPanelOpen)}
              aria-pressed={resolvedPropertyPanelOpen}
              aria-label={resolvedPropertyPanelOpen ? 'Hide properties' : 'Show properties'}
            >
              <Icon name="sliders-horizontal" size={12} aria-hidden="true" />
              Properties
            </button>
          )}
          {currentTab === 'code' && (
            <button
              type="button"
              className="cp__copy"
              onClick={() => void copyCode()}
              aria-label={copied ? 'Copied' : 'Copy code'}
              title={copied ? 'Copied' : t('copy')}
            >
              <Icon name={copied ? 'check' : 'copy'} size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {currentTab === 'preview' && (
        <div
          className={`cp__preview-shell${propertyPanelVisible ? ' cp__preview-shell--with-properties' : ''}`}
          style={{ '--cp-property-panel-width': `${resolvedPropertyPanelWidth}px` } as React.CSSProperties}
        >
          <div className={`cp__preview${propertyPanelVisible ? ' cp__preview--split' : ''}`} role="tabpanel">{children}</div>
          {propertyPanelVisible && (
            <>
              <button
                type="button"
                className="cp__splitter"
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize properties panel"
                aria-valuemin={propertyPanelMinWidth}
                aria-valuemax={propertyPanelMaxWidth}
                aria-valuenow={resolvedPropertyPanelWidth}
                tabIndex={0}
                onPointerDown={beginPropertyPanelResize}
                onKeyDown={handlePropertyPanelResizeKeyDown}
              ><span aria-hidden="true" /></button>
              <aside className="cp__property-panel" aria-label={propertyPanelAriaLabel ?? 'Preview properties'}>
                <PropertyPanel
                  properties={propertyPanelProperties}
                  values={propertyPanelValues}
                  onValuesChange={onPropertyPanelValuesChange}
                  mode={propertyPanelMode}
                  onModeChange={onPropertyPanelModeChange}
                  collapsedGroups={propertyPanelCollapsedGroups}
                  onCollapsedGroupsChange={onPropertyPanelCollapsedGroupsChange}
                  ariaLabel={propertyPanelAriaLabel ?? 'Preview properties'}
                />
              </aside>
            </>
          )}
        </div>
      )}

      {currentTab === 'code' && (
        <div className="cp__code">
          {isMultiFile && (
            <div className="cp__file-tabs" role="tablist" aria-label="Code files">
              {resolvedFiles.map((file, i) => (
                <button
                  key={file.label}
                  type="button"
                  role="tab"
                  aria-selected={i === activeFileIndex}
                  tabIndex={i === activeFileIndex ? 0 : -1}
                  className={`cp__file-tab${i === activeFileIndex ? ' cp__file-tab--active' : ''}`}
                  onClick={() => setActiveFileIndex(i)}
                >
                  {file.label}
                </button>
              ))}
            </div>
          )}
          <CodeEditor
            code={activeFile.code}
            language={activeFile.language}
            readonly
            showLineNumbers
            minHeight="0"
            maxHeight="400px"
            className="cp__code-editor"
          />
        </div>
      )}
    </div>
  );
}
