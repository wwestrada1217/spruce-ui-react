import './GridCombobox.css';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactElement, type ReactNode, type UIEvent } from 'react';
import { Icon } from '../../icons/Icon.js';
import { computePosition, getScrollParents, type Placement } from '../../utils/positioning.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';
import { normalizeLookupOption, readLookupPage, type LookupRenderContext, type LookupSource } from '../lookup/lookup-types.js';

export interface GridComboboxColumn { key: string; label: string; width?: string; minWidth?: number; }
export type GridComboboxSource = LookupSource<unknown>;
export interface GridComboboxOption { value: string; label: string; disabled?: boolean; icon?: string; [key: string]: unknown; }
export type GridComboboxVariant = 'default' | 'outline' | 'outlined' | 'filled';

export interface GridComboboxBaseProps {
  columns: GridComboboxColumn[];
  options?: GridComboboxSource | null;
  source?: GridComboboxSource | null;
  selectedItem?: unknown;
  onSelect?: (item: GridComboboxOption) => void;
  onSelectedItem?: (item: unknown) => void;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  filterBy?: string | string[];
  searchFields?: readonly string[] | null;
  displayField?: string;
  valueField?: string;
  pageSize?: number;
  autoOpen?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  error?: string;
  hint?: string;
  errors?: readonly FormValidationError[];
  invalid?: boolean;
  required?: boolean;
  label?: string;
  floatingLabel?: boolean;
  icon?: string | null;
  showChevron?: boolean;
  variant?: GridComboboxVariant;
  placement?: Placement;
  constrainToModal?: boolean;
  dismissOnClickOutside?: boolean;
  dismissOnScroll?: boolean;
  virtualScroll?: boolean;
  itemHeight?: number;
  virtualPaging?: boolean;
  showPagingFooter?: boolean;
  resizableColumns?: boolean;
  /** Show vertical separators between the column headers. Defaults to enabled with resizable columns. */
  showColumnLines?: boolean;
  /** Show alternating backgrounds on the option rows. */
  stripedRows?: boolean;
  /** Allow the dropdown panel itself to be resized by the user. */
  panelResizable?: boolean;
  renderRow?: (context: LookupRenderContext<GridComboboxOption>) => ReactNode;
  renderEmpty?: () => ReactNode;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  className?: string;
  id?: string;
}

export interface GridComboboxSingleProps extends GridComboboxBaseProps {
  multiple?: false;
  value?: string;
  onChange?: (value: string) => void;
}

export interface GridComboboxMultipleProps extends GridComboboxBaseProps {
  multiple: true;
  value?: readonly string[];
  onChange?: (value: string[]) => void;
}

export type GridComboboxProps = GridComboboxSingleProps | GridComboboxMultipleProps;

export function GridCombobox(props: GridComboboxSingleProps): ReactElement | null;
export function GridCombobox(props: GridComboboxMultipleProps): ReactElement | null;
export function GridCombobox(props: GridComboboxSingleProps | GridComboboxMultipleProps) {
  const {
  columns, options, source, value, multiple = false, selectedItem, onChange, onSelect, onSelectedItem, onOpenChange,
  placeholder = 'Search...', filterBy = 'label', searchFields = null, displayField = 'label', valueField = 'value', pageSize = 20,
  autoOpen = false, disabled = false, readOnly = false, hidden = false, error, hint, errors, invalid, required = false,
  label = '', floatingLabel = false, icon = null, variant = 'default', placement = 'bottom-start', constrainToModal = true,
  showChevron = false,
  dismissOnClickOutside = true, dismissOnScroll = true, virtualScroll = false, itemHeight = 32,
  virtualPaging = false, showPagingFooter = true, resizableColumns = false, showColumnLines, stripedRows = false,
  panelResizable = false, renderRow, renderEmpty,
  ariaLabel, ariaLabelledBy, ariaDescribedBy, className = '', id,
  } = props;
  const { direction, t } = useI18n();
  const field = useFormFieldContext();
  const instanceId = useId().replace(/:/g, '');
  const lookupSource = useMemo(() => source ?? options ?? [], [options, source]);
  const inputId = id ?? `sp-grid-combo-${instanceId}`;
  const listboxId = `${inputId}-listbox`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const filterKeys = useMemo(() => searchFields?.length ? [...searchFields] : Array.isArray(filterBy) ? filterBy : [filterBy], [filterBy, searchFields]);
  const normalizedVariant = variant === 'outlined' ? 'outline' : variant;
  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const effectiveHidden = hidden || Boolean(field?.hidden);
  const effectiveRequired = required || Boolean(field?.required);
  const errorMessage = firstFormError(errors || field?.errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const effectiveHint = hint || field?.hint;
  const describedBy = ariaDescribedBy || field?.describedBy || (errorMessage ? errorId : effectiveHint ? hintId : undefined);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(autoOpen);
  const [items, setItems] = useState<GridComboboxOption[]>(Array.isArray(lookupSource) ? lookupSource as GridComboboxOption[] : []);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [virtualStart, setVirtualStart] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [columnWidths, setColumnWidths] = useState<Record<string, string>>({});
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suppressOpenOnFocusRef = useRef(false);

  const load = useCallback(async (requestedPage: number, searchTerm: string) => {
    setLoading(true);
    try {
      const response = await readLookupPage(lookupSource, { pageNumber: requestedPage, pageSize, searchTerm, searchFields: filterKeys.join(',') });
      setItems(response.data as GridComboboxOption[]);
      setPage(response.pageNumber);
      setTotalPages(response.totalPages);
    } catch { setItems([]); setTotalPages(1); }
    finally { setLoading(false); }
  }, [filterKeys, lookupSource, pageSize]);

  const reposition = useCallback(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;
    const result = computePosition(anchor, panel, placement, 4);
    setPosition({ top: result.top, left: result.left, width: anchor.offsetWidth });
    setReady(true);
  }, [placement]);
  const setOpenState = useCallback((next: boolean) => {
    if (effectiveDisabled || effectiveReadOnly) return;
    setOpen(next);
    onOpenChange?.(next);
    if (next) { setReady(false); setHighlightedIndex(0); setVirtualStart(0); void load(1, ''); }
    else setHighlightedIndex(-1);
  }, [effectiveDisabled, effectiveReadOnly, load, onOpenChange]);
  useEffect(() => { if (autoOpen && !effectiveDisabled && !effectiveReadOnly) setOpenState(true); }, [autoOpen, effectiveDisabled, effectiveReadOnly, setOpenState]);
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(reposition);
    const anchor = anchorRef.current;
    const parents = anchor ? getScrollParents(anchor) : [];
    const onScroll = () => dismissOnScroll ? setOpenState(false) : reposition();
    parents.forEach((parent) => parent.addEventListener('scroll', onScroll, { passive: true }));
    window.addEventListener('resize', reposition);
    if (dismissOnScroll) window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); parents.forEach((parent) => parent.removeEventListener('scroll', onScroll)); window.removeEventListener('resize', reposition); if (dismissOnScroll) window.removeEventListener('scroll', onScroll); };
  }, [dismissOnScroll, open, reposition, setOpenState]);
  useEffect(() => {
    if (!open || !dismissOnClickOutside) return;
    const handler = (event: globalThis.MouseEvent) => { const target = event.target as Node; if (!anchorRef.current?.contains(target) && !panelRef.current?.contains(target)) setOpenState(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dismissOnClickOutside, open, setOpenState]);
  useEffect(() => {
    if (multiple) return;
    if (!value) { setQuery(''); return; }
    const selected = items.map((item) => normalizeLookupOption(item, displayField, valueField)).find((item) => item.value === value);
    if (selected) setQuery(selected.label);
    else if (selectedItem) setQuery(normalizeLookupOption(selectedItem, displayField, valueField).label);
  }, [displayField, items, multiple, selectedItem, value, valueField]);

  const normalized = useMemo(() => items.map((item) => normalizeLookupOption(item, displayField, valueField)), [displayField, items, valueField]);
  const selectedValues = useMemo(() => new Set(Array.isArray(value) ? value : value ? [value] : []), [value]);
  const selectedOptions = useMemo(() => normalized.filter((option) => selectedValues.has(option.value)), [normalized, selectedValues]);
  const visibleItems = virtualScroll ? items.slice(virtualStart, virtualStart + Math.ceil(240 / itemHeight) + 8) : items;
  const activeIndex = virtualScroll ? virtualStart + highlightedIndex : highlightedIndex;
  const gridTemplate = columns.map((column) => columnWidths[column.key] ?? column.width ?? '1fr').join(' ');
  const effectiveShowColumnLines = showColumnLines ?? resizableColumns;

  function focusInputAfterSelection() {
    if (document.activeElement !== inputRef.current) suppressOpenOnFocusRef.current = true;
    inputRef.current?.focus();
  }
  function emitValue(next: string | string[]) {
    if (multiple) {
      (onChange as GridComboboxMultipleProps['onChange'])?.(Array.isArray(next) ? next : [next]);
    } else {
      (onChange as GridComboboxSingleProps['onChange'])?.(Array.isArray(next) ? next[0] ?? '' : next);
    }
  }
  function selectOption(index: number) {
    const item = items[index];
    const option = normalized[index];
    if (!item || !option || option.disabled) return;
    if (multiple) {
      const next = new Set(selectedValues);
      if (next.has(option.value)) next.delete(option.value);
      else next.add(option.value);
      emitValue([...next]);
    } else {
      emitValue(option.value);
    }
    onSelect?.(item);
    onSelectedItem?.(item);
    setQuery(multiple ? '' : option.label);
    if (!multiple) setOpenState(false);
    focusInputAfterSelection();
  }
  function moveHighlight(delta: number) {
    if (!items.length) return;
    let next = activeIndex + delta;
    if (next < 0) next = items.length - 1;
    if (next >= items.length) { if (virtualPaging && page < totalPages) { void load(page + 1, query); setHighlightedIndex(0); return; } next = 0; }
    if (normalized[next]?.disabled) { moveHighlight(delta > 0 ? 1 : -1); return; }
    if (virtualScroll) setVirtualStart(Math.max(0, Math.min(next, items.length - 1)));
    setHighlightedIndex(virtualScroll ? next - virtualStart : next);
  }
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (effectiveDisabled || effectiveReadOnly) return;
    if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) { event.preventDefault(); setOpenState(true); return; }
    if (!open) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); moveHighlight(1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); moveHighlight(-1); }
    else if (event.key === 'Home') { event.preventDefault(); setHighlightedIndex(0); }
    else if (event.key === 'End') { event.preventDefault(); setHighlightedIndex(items.length - 1); }
    else if (event.key === 'PageDown' && virtualPaging && page < totalPages) { event.preventDefault(); void load(page + 1, query); setHighlightedIndex(0); }
    else if (event.key === 'PageUp' && virtualPaging && page > 1) { event.preventDefault(); void load(page - 1, query); setHighlightedIndex(0); }
    else if (event.key === 'Enter' && activeIndex >= 0) { event.preventDefault(); selectOption(activeIndex); }
    else if (event.key === 'Escape') { event.preventDefault(); setOpenState(false); }
    else if (event.key === 'Tab') setOpenState(false);
  }
  function handlePanelScroll(event: UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    if (virtualScroll) setVirtualStart(Math.max(0, Math.floor(element.scrollTop / itemHeight) - 4));
    if (virtualPaging && element.scrollHeight - element.scrollTop - element.clientHeight < 20 && page < totalPages) void load(page + 1, query);
  }
  function beginResize(key: string, event: ReactPointerEvent<HTMLButtonElement>) {
    if (!resizableColumns) return;
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = (event.currentTarget.parentElement?.getBoundingClientRect().width ?? 80);
    const move = (moveEvent: PointerEvent) => setColumnWidths((current) => ({ ...current, [key]: `${Math.max(40, startWidth + moveEvent.clientX - startX)}px` }));
    const stop = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', stop, { once: true });
  }

  if (effectiveHidden) return null;
  const rootClasses = ['sp-gc', `sp-gc--${normalizedVariant}`, floatingLabel && 'sp-gc--floating', open && 'sp-gc--open', effectiveDisabled && 'sp-gc--disabled', effectiveReadOnly && 'sp-gc--readonly', hasError && 'sp-gc--error', className].filter(Boolean).join(' ');
  const dropdownClasses = ['sp-gc__dropdown', panelResizable && 'sp-gc__dropdown--resizable', effectiveShowColumnLines && 'sp-gc__dropdown--column-lines', stripedRows && 'sp-gc__dropdown--striped'].filter(Boolean).join(' ');
  const activeDescendant = activeIndex >= 0 ? `sp-gc-opt-${instanceId}-${activeIndex}` : undefined;
  return <>
    <div ref={anchorRef} className={rootClasses} dir={direction} data-constrain-to-modal={constrainToModal}>
      {floatingLabel && <label className="sp-gc__floating-label" htmlFor={inputId}>{label}{effectiveRequired && <span aria-hidden="true">*</span>}</label>}
      <div className="sp-gc__input-wrap">
        <Icon name={icon ?? 'search'} size={14} className="sp-gc__search-icon" />
        {multiple && selectedOptions.length > 0 && <div className="sp-gc__chips" aria-label={`${selectedOptions.length} selected`}>
          {selectedOptions.map((option) => <span key={option.value} className="sp-gc__chip">{option.label}<button type="button" aria-label={`Remove ${option.label}`} disabled={effectiveDisabled || effectiveReadOnly} onMouseDown={(event) => event.preventDefault()} onClick={() => emitValue([...selectedValues].filter((item) => item !== option.value))}><Icon name="x" size={10} /></button></span>)}
        </div>}
        <input ref={inputRef} id={inputId} className="sp-gc__input" placeholder={placeholder === 'Search...' ? t('search') : placeholder} disabled={effectiveDisabled} readOnly={effectiveReadOnly} value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => { setQuery(event.target.value); if (!open) setOpenState(true); else void load(1, event.target.value); }} onFocus={() => { if (suppressOpenOnFocusRef.current) { suppressOpenOnFocusRef.current = false; return; } setOpenState(true); }} onKeyDown={handleKeyDown} role="combobox" aria-expanded={open} aria-haspopup="listbox" aria-autocomplete="list" aria-controls={open ? listboxId : undefined} aria-activedescendant={activeDescendant} aria-label={ariaLabel || (!label ? undefined : label)} aria-labelledby={ariaLabelledBy || undefined} aria-describedby={describedBy} aria-invalid={hasError || undefined} aria-required={effectiveRequired || undefined} aria-readonly={effectiveReadOnly || undefined} />
        {(query || selectedValues.size > 0) && !effectiveDisabled && !effectiveReadOnly && <button type="button" className="sp-gc__clear" tabIndex={-1} aria-label={t('clear')} onMouseDown={(event) => { event.preventDefault(); setQuery(''); emitValue(multiple ? [] : ''); inputRef.current?.focus(); }}><Icon name="x" size={12} /></button>}
        {showChevron && <button type="button" className="sp-gc__chevron" aria-label={open ? t('close') : t('open')} aria-expanded={open} disabled={effectiveDisabled || effectiveReadOnly}
          onMouseDown={(event) => event.preventDefault()} onClick={(event) => { event.stopPropagation(); setOpenState(!open); inputRef.current?.focus(); }}>
          <Icon name="chevron-down" size={12} />
        </button>}
      </div>
    </div>
    {open && createPortal(<div ref={panelRef} id={listboxId} className={dropdownClasses} role="listbox" aria-multiselectable={multiple || undefined} style={{ position: 'fixed', top: position.top, left: position.left, width: position.width, zIndex: 999, opacity: ready ? 1 : 0 }} onScroll={handlePanelScroll}>
      <div className="sp-gc__header" style={{ gridTemplateColumns: gridTemplate }}>{columns.map((column) => <div key={column.key} className="sp-gc__header-cell"><span className="sp-gc__header-label">{column.label}</span>{resizableColumns && <button type="button" className="sp-gc__resizer" aria-label={t('resizeColumn', { column: column.label })} onPointerDown={(event) => beginResize(column.key, event)} />}</div>)}</div>
      {loading && <div className="sp-gc__loading" role="status">{t('loading')}</div>}
      {!loading && visibleItems.length > 0 && <div style={virtualScroll ? { paddingTop: `${virtualStart * itemHeight}px`, paddingBottom: `${Math.max(0, items.length - virtualStart - visibleItems.length) * itemHeight}px` } : undefined}>{visibleItems.map((item, offset) => { const index = virtualScroll ? virtualStart + offset : offset; const option = normalized[index]; const selected = Boolean(option && selectedValues.has(option.value)); const highlighted = index === activeIndex; const context = { item, option, selected, highlighted }; return <button key={`${option?.value ?? index}-${index}`} id={`sp-gc-opt-${instanceId}-${index}`} type="button" role="option" aria-selected={selected} disabled={option?.disabled} className={['sp-gc__row', selected && 'sp-gc__row--selected', highlighted && 'sp-gc__row--highlighted'].filter(Boolean).join(' ')} style={{ gridTemplateColumns: gridTemplate }} onMouseEnter={() => setHighlightedIndex(virtualScroll ? offset : index)} onClick={() => selectOption(index)}>{renderRow ? renderRow(context) : columns.map((column) => <span key={column.key} className="sp-gc__cell">{column.key === valueField && option?.icon && <Icon name={option.icon} size={14} />}{String(item[column.key] ?? '')}</span>)}{selected && <Icon name="check" size={14} className="sp-gc__check" />}</button>; })}</div>}
      {!loading && !visibleItems.length && <div className="sp-gc__empty">{renderEmpty ? renderEmpty() : t('noResults')}</div>}
      {virtualPaging && showPagingFooter && <div className="sp-gc__paging"><button type="button" disabled={page <= 1 || loading} onClick={() => void load(page - 1, query)}>{t('previous')}</button><span>{t('page')} {page} {t('of')} {totalPages}</span><button type="button" disabled={page >= totalPages || loading} onClick={() => void load(page + 1, query)}>{t('next')}</button></div>}
    </div>, document.body)}
    {errorMessage && <p className="sp-gc-error" id={errorId} role="alert">{errorMessage}</p>}
    {effectiveHint && !errorMessage && <p className="sp-gc-hint" id={hintId}>{effectiveHint}</p>}
  </>;
}
