import './Combobox.css';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent, type MouseEvent as ReactMouseEvent, type ReactNode, type UIEvent } from 'react';
import { Icon } from '../../icons/Icon.js';
import { computePosition, getScrollParents, type Placement } from '../../utils/positioning.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';
import { normalizeLookupOption, readLookupPage, type LookupRenderContext, type LookupSource } from '../lookup/lookup-types.js';

export interface ComboboxOption {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
  icon?: string;
}

export type ComboboxSource = LookupSource<unknown>;

export interface ComboboxProps {
  options?: ComboboxSource | null;
  source?: ComboboxSource | null;
  value?: string | string[];
  selectedItem?: unknown;
  onChange?: (value: string | string[]) => void;
  onSelectedItem?: (item: unknown) => void;
  onOpenChange?: (open: boolean) => void;
  displayField?: string;
  valueField?: string;
  dataKey?: string;
  searchFields?: string[];
  pageSize?: number;
  autoOpen?: boolean;
  placeholder?: string;
  multiple?: boolean;
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
  variant?: 'default' | 'outline' | 'outlined' | 'filled';
  icon?: string | null;
  placement?: Placement;
  constrainToModal?: boolean;
  dismissOnClickOutside?: boolean;
  dismissOnScroll?: boolean;
  virtualScroll?: boolean;
  itemHeight?: number;
  virtualPaging?: boolean;
  showPagingFooter?: boolean;
  renderOption?: (context: LookupRenderContext) => ReactNode;
  renderEmpty?: () => ReactNode;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  className?: string;
  id?: string;
}

export function Combobox({
  options, source, value, selectedItem, onChange, onSelectedItem, onOpenChange,
  displayField = 'label', valueField = 'value', dataKey, searchFields, pageSize = 20,
  autoOpen = false, placeholder = 'Search…', multiple = false, disabled = false,
  readOnly = false, hidden = false, error, hint, errors, invalid, required = false, label = '',
  floatingLabel = false, variant = 'default', icon = null, placement = 'bottom-start',
  constrainToModal = true, dismissOnClickOutside = true, dismissOnScroll = true,
  virtualScroll = false, itemHeight = 32, virtualPaging = false, showPagingFooter = true,
  renderOption, renderEmpty, ariaLabel, ariaLabelledBy, ariaDescribedBy, className = '', id,
}: ComboboxProps) {
  const { direction, t } = useI18n();
  const field = useFormFieldContext();
  const instanceId = useId().replace(/:/g, '');
  const lookupSource = useMemo(() => source ?? options ?? [], [options, source]);
  const inputId = id ?? `sp-combo-${instanceId}`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const effectiveHidden = hidden || Boolean(field?.hidden);
  const effectiveRequired = required || Boolean(field?.required);
  const effectiveHint = hint || field?.hint;
  const errorMessage = firstFormError(errors || field?.errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const describedBy = ariaDescribedBy || field?.describedBy || (errorMessage ? errorId : effectiveHint ? hintId : undefined);
  const [internalSelectedValues, setInternalSelectedValues] = useState<string[]>(() => Array.isArray(value) ? value : value ? [value] : []);
  const selectedValues = useMemo(() => value === undefined ? internalSelectedValues : Array.isArray(value) ? value : value ? [value] : [], [internalSelectedValues, value]);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(autoOpen);
  const [items, setItems] = useState<unknown[]>(Array.isArray(lookupSource) ? [...lookupSource] : []);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [ready, setReady] = useState(false);
  const [virtualStart, setVirtualStart] = useState(0);
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const suppressOpenOnFocusRef = useRef(false);

  const load = useCallback(async (requestedPage: number, searchTerm: string, append = false) => {
    setLoading(true);
    try {
      const response = await readLookupPage(lookupSource, { pageNumber: requestedPage, pageSize, searchTerm, searchFields: searchFields?.join(',') ?? dataKey });
      setItems((current) => append ? [...current, ...response.data] : response.data);
      setPage(response.pageNumber);
      setTotalPages(response.totalPages);
    } catch {
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [dataKey, lookupSource, pageSize, searchFields]);

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

  useEffect(() => {
    if (autoOpen && !effectiveDisabled && !effectiveReadOnly) setOpenState(true);
  }, [autoOpen, effectiveDisabled, effectiveReadOnly, setOpenState]);
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
    if (!multiple) {
      const selected = items.map((item) => normalizeLookupOption(item, displayField, valueField)).find((item) => selectedValues.includes(item.value));
      if (selected) setQuery(selected.label);
      else if (!selectedValues.length) setQuery('');
    }
  }, [displayField, items, multiple, selectedValues, valueField]);

  const normalized = useMemo(() => items.map((item) => normalizeLookupOption(item, displayField, valueField)), [displayField, items, valueField]);
  const selectedOptions = normalized.filter((option) => selectedValues.includes(option.value));
  const virtualItems = virtualScroll ? normalized.slice(virtualStart, virtualStart + Math.ceil(240 / itemHeight) + 8) : normalized;
  const activeIndex = virtualScroll ? virtualStart + highlightedIndex : highlightedIndex;

  function openPanel() { if (!effectiveDisabled && !effectiveReadOnly) setOpenState(true); }
  function updateSelection(next: string | string[]) {
    if (value === undefined) setInternalSelectedValues(Array.isArray(next) ? next : next ? [next] : []);
    onChange?.(next);
  }
  function focusInputAfterSelection() {
    if (document.activeElement !== inputRef.current) suppressOpenOnFocusRef.current = true;
    inputRef.current?.focus();
  }
  function selectOption(index: number) {
    const option = normalized[index];
    if (!option || option.disabled) return;
    const next = multiple ? selectedValues.includes(option.value) ? selectedValues.filter((entry) => entry !== option.value) : [...selectedValues, option.value] : option.value;
    updateSelection(next);
    onSelectedItem?.(items[index] ?? selectedItem);
    if (multiple) { setQuery(''); inputRef.current?.focus(); } else { setQuery(option.label); setOpenState(false); focusInputAfterSelection(); }
  }
  function moveHighlight(delta: number) {
    if (!normalized.length) return;
    let next = activeIndex + delta;
    if (next < 0) next = normalized.length - 1;
    if (next >= normalized.length) { if (virtualPaging && page < totalPages) { void load(page + 1, query); setHighlightedIndex(0); return; } next = 0; }
    if (normalized[next]?.disabled) { moveHighlight(delta > 0 ? 1 : -1); return; }
    if (virtualScroll) setVirtualStart(Math.max(0, Math.min(next, normalized.length - 1)));
    setHighlightedIndex(virtualScroll ? next - virtualStart : next);
  }
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (effectiveDisabled || effectiveReadOnly) return;
    if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) { event.preventDefault(); openPanel(); return; }
    if (!open) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); moveHighlight(1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); moveHighlight(-1); }
    else if (event.key === 'Home') { event.preventDefault(); setHighlightedIndex(0); }
    else if (event.key === 'End') { event.preventDefault(); setHighlightedIndex(Math.max(0, normalized.length - 1)); }
    else if (event.key === 'PageDown' && virtualPaging && page < totalPages) { event.preventDefault(); void load(page + 1, query); setHighlightedIndex(0); }
    else if (event.key === 'PageUp' && virtualPaging && page > 1) { event.preventDefault(); void load(page - 1, query); setHighlightedIndex(0); }
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (activeIndex >= 0) selectOption(activeIndex); }
    else if (event.key === 'Escape') { event.preventDefault(); setOpenState(false); }
    else if (event.key === 'Backspace' && multiple && !query && selectedValues.length) updateSelection(selectedValues.slice(0, -1));
    else if (event.key === 'Tab') setOpenState(false);
  }
  function handlePanelScroll(event: UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    if (virtualScroll) setVirtualStart(Math.max(0, Math.floor(element.scrollTop / itemHeight) - 4));
    if (virtualPaging && element.scrollHeight - element.scrollTop - element.clientHeight < 20 && page < totalPages) void load(page + 1, query);
  }
  function removeChip(valueToRemove: string, event: ReactMouseEvent) { event.stopPropagation(); updateSelection(selectedValues.filter((entry) => entry !== valueToRemove)); }

  if (effectiveHidden) return null;
  const rootClasses = ['sp-combo', floatingLabel && 'sp-combo--floating', selectedValues.length > 0 && 'sp-combo--floated', open && 'sp-combo--open', effectiveDisabled && 'sp-combo--disabled', effectiveReadOnly && 'sp-combo--readonly', hasError && 'sp-combo--error', variant !== 'default' && `sp-combo--${variant === 'outlined' ? 'outline' : variant}`, className].filter(Boolean).join(' ');
  const activeDescendant = activeIndex >= 0 ? `sp-combo-opt-${instanceId}-${activeIndex}` : undefined;
  return <>
    <div ref={anchorRef} className={rootClasses} dir={direction} data-constrain-to-modal={constrainToModal}>
      {floatingLabel && <label className="sp-combo__floating-label" htmlFor={inputId}>{label}{effectiveRequired && <span aria-hidden="true">*</span>}</label>}
      <div className="sp-combo__input-wrap" onClick={() => inputRef.current?.focus()}>
        {icon ? <Icon name={icon} size={14} className="sp-combo__search-icon" /> : !multiple && <Icon name="search" size={14} className="sp-combo__search-icon" />}
        {multiple && selectedOptions.map((option) => <span key={option.value} className="sp-combo__chip">{option.label}<button type="button" className="sp-combo__chip-remove" tabIndex={-1} aria-label={`${t('remove')} ${option.label}`} onClick={(event) => removeChip(option.value, event)}><Icon name="x" size={10} /></button></span>)}
        <input ref={inputRef} id={inputId} className="sp-combo__input" value={query} type="text" placeholder={selectedValues.length && multiple ? '' : placeholder === 'Search…' ? t('search') : placeholder} disabled={effectiveDisabled} readOnly={effectiveReadOnly} role="combobox" aria-expanded={open} aria-haspopup="listbox" aria-autocomplete="list" aria-activedescendant={activeDescendant} aria-label={ariaLabel || (!label ? undefined : label)} aria-labelledby={ariaLabelledBy || undefined} aria-describedby={describedBy} aria-invalid={hasError || undefined} aria-required={effectiveRequired || undefined} aria-readonly={effectiveReadOnly || undefined} onChange={(event: ChangeEvent<HTMLInputElement>) => { setQuery(event.target.value); if (!open) openPanel(); else void load(1, event.target.value); }} onFocus={() => { if (suppressOpenOnFocusRef.current) { suppressOpenOnFocusRef.current = false; return; } openPanel(); }} onKeyDown={handleKeyDown} />
        {(query || selectedValues.length > 0) && !effectiveDisabled && <button type="button" className="sp-combo__clear" tabIndex={-1} aria-label={t('clear')} onClick={(event) => { event.stopPropagation(); setQuery(''); updateSelection(multiple ? [] : ''); inputRef.current?.focus(); }}><Icon name="x" size={10} /></button>}
      </div>
    </div>
    {open && createPortal(<div ref={panelRef} className="sp-combo__dropdown" role="listbox" aria-multiselectable={multiple || undefined} style={{ position: 'fixed', top: position.top, left: position.left, width: position.width, zIndex: 999, opacity: ready ? 1 : 0 }} onScroll={handlePanelScroll}>
      {loading && <div className="sp-combo__loading" role="status">{t('loading')}</div>}
      {!loading && virtualItems.length > 0 && <div style={virtualScroll ? { paddingTop: `${virtualStart * itemHeight}px`, paddingBottom: `${Math.max(0, normalized.length - virtualStart - virtualItems.length) * itemHeight}px` } : undefined}>{virtualItems.map((option, offset) => { const index = virtualScroll ? virtualStart + offset : offset; const selected = selectedValues.includes(option.value); const highlighted = index === activeIndex; const context = { item: items[index], option, selected, highlighted }; return <button key={`${option.value}-${index}`} id={`sp-combo-opt-${instanceId}-${index}`} type="button" role="option" aria-selected={selected} disabled={option.disabled} className={['sp-combo__option', selected && 'sp-combo__option--selected', highlighted && 'sp-combo__option--highlighted'].filter(Boolean).join(' ')} onMouseEnter={() => setHighlightedIndex(virtualScroll ? offset : index)} onClick={() => selectOption(index)}>{multiple && <span className={['sp-combo__option-checkbox', selected && 'sp-combo__option-checkbox--checked'].filter(Boolean).join(' ')}>{selected && <Icon name="check" size={10} />}</span>}{renderOption ? renderOption(context) : <><span>{option.icon && <Icon name={option.icon} size={14} />}{option.label}</span>{option.description && <small>{option.description}</small>}</>}{selected && !multiple && <Icon name="check" size={14} className="sp-combo__check" />}</button>; })}</div>}
      {!loading && !virtualItems.length && <div className="sp-combo__empty">{renderEmpty ? renderEmpty() : t('noResults')}</div>}
      {virtualPaging && showPagingFooter && <div className="sp-combo__paging"><button type="button" disabled={page <= 1 || loading} onClick={() => void load(page - 1, query)}>{t('previous')}</button><span>{t('page')} {page} {t('of')} {totalPages}</span><button type="button" disabled={page >= totalPages || loading} onClick={() => void load(page + 1, query)}>{t('next')}</button></div>}
    </div>, document.body)}
    {errorMessage && <p className="sp-combo-error" id={errorId} role="alert">{errorMessage}</p>}
    {effectiveHint && !errorMessage && <p className="sp-combo-hint" id={hintId}>{effectiveHint}</p>}
  </>;
}
