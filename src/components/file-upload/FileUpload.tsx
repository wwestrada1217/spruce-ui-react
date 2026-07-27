/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './FileUpload.css';
import {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from 'react';
import { Icon } from '../../icons/Icon.js';

export type FileUploadSize = 'sm' | 'md' | 'lg';

export interface UploadedFileItem {
  id?: string;
  file?: File;
  name: string;
  size: number;
  type?: string;
  previewUrl?: string;
  progress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface FileUploadProps {
  /** Value as array of File or UploadedFileItem objects */
  value?: File[] | UploadedFileItem[] | null;
  /** Called when files change (added or removed) */
  onChange?: (files: File[] | null) => void;
  /** Enable selecting multiple files */
  multiple?: boolean;
  /** Accept file extension/mime constraints (e.g. "image/*", ".pdf,.png") */
  accept?: string;
  /** Maximum size allowed per file in bytes (e.g. 10 * 1024 * 1024 for 10MB) */
  maxFileSize?: number;
  /** Maximum number of files allowed when multiple is true */
  maxFiles?: number;
  /** Show image thumbnail previews for image files */
  showPreviews?: boolean;
  /** Disable file upload interactions */
  disabled?: boolean;
  /** Label shown above the upload zone */
  label?: string;
  /** Required field indicator */
  required?: boolean;
  /** Helper text / hint shown below the dropzone */
  hint?: string;
  /** Error message displayed under the component */
  error?: string;
  /** Primary text inside dropzone */
  dropText?: string;
  /** Subtext inside dropzone (e.g. "Max 10 MB") */
  dropSubtext?: string;
  /** Component visual size variant */
  size?: FileUploadSize;
  /** Additional CSS class applied to root wrapper */
  className?: string;
  /** Style object applied to root wrapper */
  style?: React.CSSProperties;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

interface FileUploadCardProps {
  item: File | UploadedFileItem;
  disabled?: boolean;
  showPreviews?: boolean;
  onRemove: () => void;
}

function FileUploadCard({ item, disabled, showPreviews = true, onRemove }: FileUploadCardProps) {
  const isNativeFile = item instanceof File;
  const fileName = isNativeFile ? item.name : item.name;
  const fileSize = isNativeFile ? item.size : item.size;
  const fileType = isNativeFile ? item.type : item.type || '';
  const initialUrl = isNativeFile ? undefined : (item as UploadedFileItem).previewUrl;
  const progress = isNativeFile ? undefined : (item as UploadedFileItem).progress;

  const [previewUrl] = useState<string | undefined>(() => {
    if (showPreviews && isNativeFile && fileType.startsWith('image/')) {
      return URL.createObjectURL(item as File);
    }
    return initialUrl;
  });

  useEffect(() => {
    if (!previewUrl || !isNativeFile) return;
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, isNativeFile]);

  const isImage = fileType.startsWith('image/') || previewUrl;

  return (
    <div className="sp-file-upload__file-card" role="listitem">
      <div className="sp-file-upload__file-preview">
        {previewUrl ? (
          <img src={previewUrl} alt={fileName} className="sp-file-upload__file-img" />
        ) : (
          <Icon
            name={isImage ? 'image' : fileType.includes('pdf') || fileType.includes('doc') ? 'file-text' : 'file'}
            size={20}
          />
        )}
      </div>

      <div className="sp-file-upload__file-info">
        <div className="sp-file-upload__file-name">{fileName}</div>
        <div className="sp-file-upload__file-size">{formatBytes(fileSize)}</div>
        {progress !== undefined && (
          <div className="sp-file-upload__progress-wrap">
            <div className="sp-file-upload__progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      <div className="sp-file-upload__file-actions">
        {!disabled && (
          <button
            type="button"
            className="sp-file-upload__remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label={`Remove file ${fileName}`}
          >
            <Icon name="x" size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export function FileUpload({
  value,
  onChange,
  multiple = false,
  accept,
  maxFileSize,
  maxFiles,
  showPreviews = true,
  disabled = false,
  label,
  required = false,
  hint,
  error: propError,
  dropText,
  dropSubtext,
  size = 'md',
  className,
  style,
}: FileUploadProps) {
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal state when value prop is controlled
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== undefined) {
      if (Array.isArray(value)) {
        const fileList = value.map((v) => (v instanceof File ? v : (v.file as File))).filter(Boolean);
        setInternalFiles(fileList);
      } else {
        setInternalFiles([]);
      }
    }
  }

  const currentFiles = useMemo<(File | UploadedFileItem)[]>(
    () => (value !== undefined ? value ?? [] : internalFiles),
    [value, internalFiles],
  );

  /* ── Validation & Processing ────────────────────────────────────────────── */

  const processFiles = useCallback(
    (newFilesList: FileList | File[]) => {
      if (disabled) return;
      setValidationError(null);
      const incoming = Array.from(newFilesList);

      let filtered = incoming;
      let err: string | null = null;

      // Validate max file size
      if (maxFileSize) {
        const oversized = incoming.find((f) => f.size > maxFileSize);
        if (oversized) {
          err = `File "${oversized.name}" exceeds the maximum allowed size of ${formatBytes(maxFileSize)}.`;
          filtered = incoming.filter((f) => f.size <= maxFileSize);
        }
      }

      if (filtered.length === 0 && err) {
        setValidationError(err);
        return;
      }

      let nextFiles: File[];
      if (multiple) {
        const existing = internalFiles;
        nextFiles = [...existing, ...filtered];
        if (maxFiles && nextFiles.length > maxFiles) {
          err = `You can only upload a maximum of ${maxFiles} files.`;
          nextFiles = nextFiles.slice(0, maxFiles);
        }
      } else {
        nextFiles = filtered.slice(0, 1);
      }

      setValidationError(err);
      setInternalFiles(nextFiles);
      onChange?.(nextFiles.length > 0 ? nextFiles : null);
    },
    [disabled, maxFileSize, multiple, maxFiles, internalFiles, onChange],
  );

  /* ── Event Handlers ─────────────────────────────────────────────────────── */

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }

  function handleRemoveFile(index: number) {
    if (disabled) return;
    const nextFiles = [...internalFiles];
    nextFiles.splice(index, 1);
    setInternalFiles(nextFiles);
    onChange?.(nextFiles.length > 0 ? nextFiles : null);
  }

  function triggerBrowse() {
    if (disabled) return;
    inputRef.current?.click();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerBrowse();
    }
  }

  /* ── Format Dropzone Subtext ─────────────────────────────────────────────── */

  let defaultSubtext = '';
  if (dropSubtext) {
    defaultSubtext = dropSubtext;
  } else {
    const hints: string[] = [];
    if (maxFileSize) hints.push(`Max ${formatBytes(maxFileSize)}`);
    if (multiple && maxFiles) hints.push(`Up to ${maxFiles} files`);
    defaultSubtext = hints.join(' • ');
  }

  const defaultText = dropText
    ? dropText
    : multiple
      ? 'Drop files here or click to browse'
      : 'Drop a file here or click to browse';

  const activeError = propError || validationError;
  const sizeCls = size === 'sm' ? 'sp-file-upload__dropzone--sm' : size === 'lg' ? 'sp-file-upload__dropzone--lg' : '';

  const dropzoneCls = [
    'sp-file-upload__dropzone',
    sizeCls,
    isDragging ? 'sp-file-upload__dropzone--dragging' : '',
    disabled ? 'sp-file-upload__dropzone--disabled' : '',
    activeError ? 'sp-file-upload__dropzone--error' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const rootCls = ['sp-file-upload', className].filter(Boolean).join(' ');

  return (
    <div className={rootCls} style={style}>
      {label && (
        <label className="sp-file-upload__label">
          {label}
          {required && <span className="sp-file-upload__required" aria-hidden="true">*</span>}
        </label>
      )}

      {/* Dropzone Container */}
      <div
        className={dropzoneCls}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerBrowse}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-disabled={disabled}
        aria-label={label || dropText || 'File upload'}
      >
        <input
          ref={inputRef}
          type="file"
          className="sp-file-upload__input"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleFileInputChange}
          tabIndex={-1}
        />

        <div className="sp-file-upload__icon">
          <Icon name="cloud-upload" size={size === 'sm' ? 24 : size === 'lg' ? 40 : 32} />
        </div>

        <div className="sp-file-upload__text">{defaultText}</div>
        {defaultSubtext && <div className="sp-file-upload__subtext">{defaultSubtext}</div>}
      </div>

      {/* Selected File Cards */}
      {currentFiles.length > 0 && (
        <div className="sp-file-upload__file-list" role="list" aria-label="Uploaded files">
          {currentFiles.map((item, index) => {
            const isNativeFile = item instanceof File;
            const key = isNativeFile ? `${item.name}-${index}` : (item as UploadedFileItem).id || index;
            return (
              <FileUploadCard
                key={key}
                item={item}
                disabled={disabled}
                showPreviews={showPreviews}
                onRemove={() => handleRemoveFile(index)}
              />
            );
          })}
        </div>
      )}

      {/* Error message */}
      {activeError && (
        <div className="sp-file-upload__error-msg" role="alert">
          {activeError}
        </div>
      )}

      {/* Hint message */}
      {!activeError && hint && (
        <div className="sp-file-upload__hint-msg">{hint}</div>
      )}
    </div>
  );
}
