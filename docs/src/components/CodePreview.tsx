import { useState, useMemo, type ReactNode } from 'react';
import { CodeEditor, Icon } from 'spruce-react';
import type { CodeLanguage } from 'spruce-react';
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
  children,
}: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<CodePreviewTab>(codeOnly ? 'code' : 'preview');
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentTab: CodePreviewTab = codeOnly ? 'code' : activeTab;

  const resolvedFiles = useMemo<CodeFile[]>(() => {
    if (files && files.length > 0) return files;
    return [{ label: 'Code', language, code: code ?? '' }];
  }, [files, language, code]);

  const activeFile = resolvedFiles[activeFileIndex] ?? resolvedFiles[0];
  const isMultiFile = resolvedFiles.length > 1;

  function copyCode() {
    navigator.clipboard.writeText(activeFile.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className={`cp${compact ? ' cp--compact' : ''}`}>
      <div className="cp__toolbar">
        {title && <span className="cp__title">{title}</span>}
        <div className="cp__actions">
          {!codeOnly && (
            <>
              <button
                type="button"
                className={`cp__tab${currentTab === 'preview' ? ' cp__tab--active' : ''}`}
                onClick={() => setActiveTab('preview')}
                aria-pressed={currentTab === 'preview'}
              >
                <Icon name="eye" size={12} aria-hidden="true" />
                Preview
              </button>
              <button
                type="button"
                className={`cp__tab${currentTab === 'code' ? ' cp__tab--active' : ''}`}
                onClick={() => setActiveTab('code')}
                aria-pressed={currentTab === 'code'}
              >
                <Icon name="code" size={12} aria-hidden="true" />
                Code
              </button>
            </>
          )}
          {currentTab === 'code' && (
            <button
              type="button"
              className="cp__copy"
              onClick={copyCode}
              aria-label={copied ? 'Copied' : 'Copy code'}
              title={copied ? 'Copied' : 'Copy code'}
            >
              <Icon name={copied ? 'check' : 'copy'} size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {currentTab === 'preview' && (
        <div className="cp__preview">{children}</div>
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
