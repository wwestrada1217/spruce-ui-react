import './FileUpload.css';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';

export type FileUploadSize = 'sm' | 'md' | 'lg';

export interface UploadedFileItem {
  id?: string;
  file?: File;
  name: string;
  size: number;
  type?: string;
  previewUrl?: string;
  preview?: string | null;
  path?: string | null;
  progress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface FileUploadProps {
  value?: File[] | UploadedFileItem[] | null;
  onChange?: (files: File[] | null) => void;
  onFilesChange?: (files: UploadedFileItem[]) => void;
  multiple?: boolean;
  accept?: string;
  maxFileSize?: number;
  maxFiles?: number;
  showPreviews?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  errors?: readonly FormValidationError[];
  invalid?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  dropText?: string;
  dropSubtext?: string;
  size?: FileUploadSize;
  className?: string;
  style?: React.CSSProperties;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${parseFloat((bytes / 1024 ** index).toFixed(1))} ${units[index]}`;
}

function asUploadItem(file: File): UploadedFileItem {
  return { file, name: file.name, size: file.size, type: file.type, path: null, preview: null };
}

function FileUploadCard({ item, disabled, showPreviews, onRemove }: {
  item: File | UploadedFileItem;
  disabled: boolean;
  showPreviews: boolean;
  onRemove: () => void;
}) {
  const isFile = item instanceof File;
  const file = isFile ? item : item.file;
  const name = isFile ? item.name : item.name;
  const type = isFile ? item.type : item.type ?? file?.type ?? '';
  const previewSource = isFile && showPreviews && type.startsWith('image/')
    ? URL.createObjectURL(item)
    : (!isFile ? item.previewUrl ?? item.preview ?? undefined : undefined);
  useEffect(() => () => {
    if (isFile && previewSource?.startsWith('blob:')) URL.revokeObjectURL(previewSource);
  }, [isFile, previewSource]);
  const isImage = type.startsWith('image/') || Boolean(previewSource);
  return (
    <div className="sp-file-upload__file-card" role="listitem">
      <div className="sp-file-upload__file-preview">
        {previewSource ? <img src={previewSource} alt={name} className="sp-file-upload__file-img" />
          : <Icon name={isImage ? 'image' : type.includes('pdf') || type.includes('doc') ? 'file-text' : 'file'} size={20} />}
      </div>
      <div className="sp-file-upload__file-info">
        <div className="sp-file-upload__file-name">{name}</div>
        <div className="sp-file-upload__file-size">{formatBytes(item.size)}</div>
        {!isFile && item.progress !== undefined && <div className="sp-file-upload__progress-wrap"><div className="sp-file-upload__progress-bar" style={{ width: `${item.progress}%` }} /></div>}
      </div>
      {!disabled && <button type="button" className="sp-file-upload__remove-btn" onClick={onRemove} aria-label={`Remove file ${name}`}><Icon name="x" size={16} /></button>}
    </div>
  );
}

export function FileUpload({
  value, onChange, onFilesChange, multiple = false, accept, maxFileSize, maxFiles,
  showPreviews = true, disabled = false, readOnly = false, hidden = false,
  label, required = false, hint, error, errors, invalid, ariaLabel, ariaLabelledBy,
  ariaDescribedBy, dropText, dropSubtext, size = 'md', className, style,
}: FileUploadProps) {
  const { t } = useI18n();
  const field = useFormFieldContext();
  const instanceId = useId().replace(/:/g, '');
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const effectiveHidden = hidden || Boolean(field?.hidden);
  const effectiveRequired = required || Boolean(field?.required);
  const effectiveHint = hint || field?.hint;
  const errorMessage = firstFormError(errors || field?.errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const errorId = `sp-file-upload-${instanceId}-error`;
  const hintId = `sp-file-upload-${instanceId}-hint`;
  const describedBy = ariaDescribedBy || field?.describedBy || (errorMessage ? errorId : effectiveHint ? hintId : undefined);
  const currentItems = useMemo<(File | UploadedFileItem)[]>(() => value === undefined ? internalFiles : value ?? [], [internalFiles, value]);

  const emitItems = useCallback((items: (File | UploadedFileItem)[]) => {
    const files = items.map((item) => item instanceof File ? item : item.file).filter((file): file is File => Boolean(file));
    setInternalFiles(files);
    onChange?.(files.length ? files : null);
    onFilesChange?.(items.map((item) => item instanceof File ? asUploadItem(item) : item));
  }, [onChange, onFilesChange]);

  const processFiles = useCallback((fileList: FileList | File[]) => {
    if (effectiveDisabled || effectiveReadOnly) return;
    setValidationError(null);
    const incoming = Array.from(fileList);
    const maxSize = maxFileSize;
    const allowed = maxSize !== undefined ? incoming.filter((file) => file.size <= maxSize) : incoming;
    const oversized = maxSize !== undefined ? incoming.find((file) => file.size > maxSize) : undefined;
    let message = oversized && maxSize !== undefined ? `File "${oversized.name}" exceeds the maximum allowed size of ${formatBytes(maxSize)}.` : null;
    const existing = currentItems.filter((item): item is File => item instanceof File);
    let next = multiple ? [...existing, ...allowed] : allowed.slice(0, 1);
    if (multiple && maxFiles && next.length > maxFiles) {
      message = `You can only upload a maximum of ${maxFiles} files.`;
      next = next.slice(0, maxFiles);
    }
    setValidationError(message);
    emitItems(next);
  }, [currentItems, effectiveDisabled, effectiveReadOnly, emitItems, maxFileSize, maxFiles, multiple]);

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) processFiles(event.target.files);
    event.target.value = '';
  }
  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!effectiveDisabled && !effectiveReadOnly) setIsDragging(true);
  }
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length) processFiles(event.dataTransfer.files);
  }
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (effectiveDisabled || effectiveReadOnly) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      inputRef.current?.click();
    }
  }
  function removeFile(index: number) {
    emitItems(currentItems.filter((_, itemIndex) => itemIndex !== index));
  }

  if (effectiveHidden) return null;
  const activeError = errorMessage || validationError;
  const text = dropText ?? t('dropFilesHere');
  const subtext = dropSubtext ?? [maxFileSize && `Max ${formatBytes(maxFileSize)}`, multiple && maxFiles && `Up to ${maxFiles} files`].filter(Boolean).join(' • ');
  const rootClass = ['sp-file-upload', className].filter(Boolean).join(' ');
  const dropzoneClass = ['sp-file-upload__dropzone', size !== 'md' && `sp-file-upload__dropzone--${size}`,
    isDragging && 'sp-file-upload__dropzone--dragging', effectiveDisabled && 'sp-file-upload__dropzone--disabled', activeError && 'sp-file-upload__dropzone--error'].filter(Boolean).join(' ');
  return (
    <div className={rootClass} style={style}>
      {label && <label className="sp-file-upload__label" htmlFor={`${instanceId}-input`}>{label}{effectiveRequired && <span className="sp-file-upload__required" aria-hidden="true">*</span>}</label>}
      <div className={dropzoneClass} onDragOver={handleDragOver} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
        onClick={() => { if (!effectiveDisabled && !effectiveReadOnly) inputRef.current?.click(); }}
        onKeyDown={handleKeyDown} tabIndex={effectiveDisabled || effectiveReadOnly ? -1 : 0} role="button"
        aria-disabled={effectiveDisabled || undefined} aria-readonly={effectiveReadOnly || undefined}
        aria-label={ariaLabel || label || text} aria-labelledby={ariaLabelledBy || undefined}
        aria-describedby={describedBy} aria-invalid={hasError || undefined}>
        <input ref={inputRef} id={`${instanceId}-input`} type="file" className="sp-file-upload__input" accept={accept}
          multiple={multiple} disabled={effectiveDisabled || effectiveReadOnly} onChange={handleFileInputChange} tabIndex={-1} />
        <div className="sp-file-upload__icon"><Icon name="cloud-upload" size={size === 'sm' ? 24 : size === 'lg' ? 40 : 32} /></div>
        <div className="sp-file-upload__text">{text}</div>{subtext && <div className="sp-file-upload__subtext">{subtext}</div>}
      </div>
      {currentItems.length > 0 && <div className="sp-file-upload__file-list" role="list" aria-label={t('upload')}>
        {currentItems.map((item, index) => <FileUploadCard key={item instanceof File ? `${item.name}-${index}` : item.id ?? `${item.name}-${index}`}
          item={item} disabled={effectiveDisabled || effectiveReadOnly} showPreviews={showPreviews} onRemove={() => removeFile(index)} />)}
      </div>}
      {activeError && <div className="sp-file-upload__error-msg" role="alert" id={errorId}>{activeError}</div>}
      {!activeError && effectiveHint && <div className="sp-file-upload__hint-msg" id={hintId}>{effectiveHint}</div>}
    </div>
  );
}
