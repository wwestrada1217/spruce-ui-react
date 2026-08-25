import './Select.css';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import { computePosition, getScrollParents, type Placement } from '../../utils/positioning.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';
import { getLookupItemValue, isLookupSource, normalizeLookupOption, readLookupPage, type LookupRenderContext, type LookupSource } from '../lookup/lookup-types.js';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
  icon?: string;
  color?: string;
}

export type SelectSource = LookupSource<unknown>;
export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectProps {
  options: SelectSource | null;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  onSelectedItem?: (item: unknown) => void;
  onOpenChange?: (open: boolean) => void;
  displayField?: string;
  valueField?: string;
  dataKey?: string;
  pageSize?: number;
  searchable?: boolean;
  autoOpen?: boolean;
  placeholder?: string;
  size?: SelectSize;
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

export function Select({
  options, value, onChange, onSelectedItem, onOpenChange, displayField = 'label', valueField = 'value', dataKey,
  pageSize = 20, searchable = false, autoOpen = false, placeholder = 'Select...', size = 'md', multiple = false,
  disabled = false, readOnly = false, hidden = false, error, hint, errors, invalid, required = false, label = '',
  floatingLabel = false, variant = 'default', icon = null, placement = 'bottom-start', constrainToModal = true,
  dismissOnClickOutside = true, dismissOnScroll = true, virtualScroll = false, itemHeight = 32,
  virtualPaging = false, showPagingFooter = true, renderOption, renderEmpty, ariaLabel, ariaLabelledBy,
  ariaDescribedBy, className = '', id,
}: SelectProps) {
  const { direction, t } = useI18n();
  const field = useFormFieldContext();
  const instanceId = useId().replace(/:/g, '');
  const anchorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const effectiveHidden = hidden || Boolean(field?.hidden);
  const effectiveRequired = required || Boolean(field?.required);
  const errorMessage = firstFormError(errors || field?.errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const effectiveHint = hint || field?.hint;
  const errorId = `sp-select-${instanceId}-error`;
  const hintId = `sp-select-${instanceId}-hint`;
  const describedBy = ariaDescribedBy || field?.describedBy || (errorMessage ? errorId : effectiveHint ? hintId : undefined);
  const selectedValues = useMemo(() => Array.isArray(value) ? value : value ? [value] : [], [value]);
  const [open, setOpen] = useState(autoOpen);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<unknown[]>(Array.isArray(options) ? [...options] : []);
  const [rawItems, setRawItems] = useState<unknown[]>(Array.isArray(options) ? [...options] : []);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [ready, setReady] = useState(false);
  const [virtualStart, setVirtualStart] = useState(0);

  const load = useCallback(async (requestedPage: number, searchTerm: string, append = false) => {
    if (!options) return;
    setLoading(true);
    try {
      const response = await readLookupPage(options, {
        pageNumber: requestedPage, pageSize,
        searchTerm: searchable ? searchTerm : undefined,
        searchFields: dataKey,
      });
      const nextItems = response.data;
      setRawItems((current) => append ? [...current, ...nextItems] : nextItems);
      setItems((current) => append ? [...current, ...nextItems] : nextItems);
      setPage(response.pageNumber);
      setTotalPages(response.totalPages);
      setTotalRecords(response.totalRecords);
    } catch {
      setItems([]);
      setRawItems([]);
    } finally {
      setLoading(false);
    }
  }, [dataKey, options, pageSize, searchable]);

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
    if (next) {
      setQuery('');
      setHighlightedIndex(0);
      setVirtualStart(0);
      void load(virtualPaging ? 1 : 1, '');
    } else {
      setHighlightedIndex(-1);
      setQuery('');
    }
  }, [effectiveDisabled, effectiveReadOnly, load, onOpenChange, virtualPaging]);

  useEffect(() => {
    if (autoOpen && !effectiveDisabled && !effectiveReadOnly) setOpenState(true);
  }, [autoOpen, effectiveDisabled, effectiveReadOnly, setOpenState]);
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(reposition);
    const anchor = anchorRef.current;
    const scrollParents = anchor ? getScrollParents(anchor) : [];
    const onScroll = () => dismissOnScroll ? setOpenState(false) : reposition();
    scrollParents.forEach((element) => element.addEventListener('scroll', onScroll, { passive: true }));
    window.addEventListener('resize', reposition);
    if (dismissOnScroll) window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      scrollParents.forEach((element) => element.removeEventListener('scroll', onScroll));
      window.removeEventListener('resize', reposition);
      if (dismissOnScroll) window.removeEventListener('scroll', onScroll);
    };
  }, [dismissOnScroll, open, reposition, setOpenState]);
  useEffect(() => {
    if (!open || !dismissOnClickOutside) return;
    const handler = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!anchorRef.current?.contains(target) && !panelRef.current?.contains(target)) setOpenState(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dismissOnClickOutside, open, setOpenState]);
  useEffect(() => {
    if (open && searchable) searchRef.current?.focus();
  }, [open, searchable]);

  const normalized = useMemo(() => items.map((item) => normalizeLookupOption(item, displayField, valueField)), [displayField, items, valueField]);
  const selectedOptions = normalized.filter((option) => selectedValues.includes(option.value));
  const renderedItems = virtualScroll ? normalized.slice(virtualStart, virtualStart + Math.ceil(240 / itemHeight) + 8) : normalized;
  const activeIndex = virtualScroll ? virtualStart + highlightedIndex : highlightedIndex;
  const selectedLabel = selectedOptions.map((option) => option.label).join(', ');

  function selectOption(index: number) {
    const item = items[index];
    const option = normalized[index];
    if (!option || option.disabled) return;
    onSelectedItem?.(item ?? getLookupItemValue(rawItems, option.value, valueField, displayField));
    const next = multiple
      ? (selectedValues.includes(option.value) ? selectedValues.filter((entry) => entry !== option.value) : [...selectedValues, option.value])
      : option.value;
    onChange?.(next);
    if (!multiple) { setOpenState(false); triggerRef.current?.focus(); }
  }
  function moveHighlight(delta: number) {
    if (!normalized.length) return;
    let next = activeIndex + delta;
    while (next >= 0 && next < normalized.length && normalized[next].disabled) next += delta;
    if (next < 0) next = normalized.length - 1;
    if (next >= normalized.length) {
      if (virtualPaging && page < totalPages) { setPage(page + 1); void load(page + 1, query); setHighlightedIndex(0); return; }
      next = 0;
    }
    if (virtualScroll) setVirtualStart(Math.max(0, Math.min(next, normalized.length - 1)));
    setHighlightedIndex(virtualScroll ? next - virtualStart : next);
  }
  function handleKeyDown(event: React.KeyboardEvent) {
    if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) { event.preventDefault(); setOpenState(true); return; }
    if (!open) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); moveHighlight(1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); moveHighlight(-1); }
    else if (event.key === 'Home') { event.preventDefault(); setHighlightedIndex(0); }
    else if (event.key === 'End') { event.preventDefault(); setHighlightedIndex(Math.max(0, normalized.length - 1)); }
    else if (event.key === 'PageDown' && virtualPaging && page < totalPages) { event.preventDefault(); setPage(page + 1); void load(page + 1, query); setHighlightedIndex(0); }
    else if (event.key === 'PageUp' && virtualPaging && page > 1) { event.preventDefault(); setPage(page - 1); void load(page - 1, query); setHighlightedIndex(0); }
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (activeIndex >= 0) selectOption(activeIndex); }
    else if (event.key === 'Escape') { event.preventDefault(); setOpenState(false); triggerRef.current?.focus(); }
    else if (event.key === 'Tab') setOpenState(false);
  }
  function removeValue(valueToRemove: string) {
    if (!multiple) return;
    onChange?.(selectedValues.filter((entry) => entry !== valueToRemove));
  }
  function handlePanelScroll(event: React.UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    if (virtualScroll) setVirtualStart(Math.max(0, Math.floor(element.scrollTop / itemHeight) - 4));
    if (virtualPaging && element.scrollHeight - element.scrollTop - element.clientHeight < 20 && page < totalPages) { setPage(page + 1); void load(page + 1, query); }
    if (!virtualPaging && isLookupSource(options ?? [] as unknown[]) && element.scrollHeight - element.scrollTop - element.clientHeight < 40 && page < totalPages) { setPage(page + 1); void load(page + 1, query, true); }
  }

  if (effectiveHidden) return null;
  const triggerClasses = ['sp-select', size !== 'md' && `sp-select--${size}`, variant !== 'default' && `sp-select--${variant === 'outlined' ? 'outline' : variant}`,
    floatingLabel && 'sp-select--floating', selectedValues.length > 0 && 'sp-select--floated', open && 'sp-select--open', effectiveDisabled && 'sp-select--disabled', effectiveReadOnly && 'sp-select--readonly', hasError && 'sp-select--error', className].filter(Boolean).join(' ');
  const activeDescendant = activeIndex >= 0 ? `sp-select-opt-${instanceId}-${activeIndex}` : undefined;
  return (
    <>
      <div ref={anchorRef} className={triggerClasses} dir={direction} data-constrain-to-modal={constrainToModal}>
        {floatingLabel && <label className="sp-select__floating-label" htmlFor={id}>{label}{effectiveRequired && <span aria-hidden="true">*</span>}</label>}
        <div ref={triggerRef} id={id} className="sp-select__trigger" role="button" tabIndex={effectiveDisabled ? -1 : 0} aria-disabled={effectiveDisabled || undefined}
          aria-haspopup="listbox" aria-expanded={open} aria-activedescendant={activeDescendant}
          aria-label={ariaLabel || (!label ? undefined : label)} aria-labelledby={ariaLabelledBy || undefined}
          aria-describedby={describedBy} aria-invalid={hasError || undefined} aria-required={effectiveRequired || undefined}
          aria-readonly={effectiveReadOnly || undefined} onClick={() => setOpenState(!open)} onKeyDown={handleKeyDown}>
          {icon && <Icon name={icon} size={14} className="sp-select__icon" />}
          {multiple && selectedOptions.length > 0 ? <span className="sp-select__chips">{selectedOptions.map((option) => <span key={option.value} className="sp-select__chip">{option.label}<button type="button" className="sp-select__chip-remove" tabIndex={-1} aria-label={t('remove')} onClick={(event) => { event.stopPropagation(); removeValue(option.value); }}><Icon name="x" size={10} /></button></span>)}</span>
            : <span className={['sp-select__value', !selectedLabel && 'sp-select__value--placeholder'].filter(Boolean).join(' ')}>{selectedLabel || (placeholder === 'Select...' ? t('select') : placeholder)}</span>}
          <Icon name="chevron-down" size={12} className="sp-select__chevron" />
        </div>
      </div>
      {open && createPortal(<div ref={panelRef} className="sp-select__dropdown" role="listbox" aria-multiselectable={multiple || undefined} data-total-records={totalRecords}
        style={{ position: 'fixed', top: position.top, left: position.left, width: position.width, zIndex: 999, opacity: ready ? 1 : 0 }} onScroll={handlePanelScroll}>
        {searchable && <input ref={searchRef} className="sp-select__search" value={query} placeholder={t('search')} aria-label={t('search')} onChange={(event) => { setQuery(event.target.value); setPage(1); void load(1, event.target.value); }} onKeyDown={handleKeyDown} />}
        {loading && <div className="sp-select__loading" role="status">{t('loading')}</div>}
        {!loading && renderedItems.length > 0 && <div style={virtualScroll ? { paddingTop: `${virtualStart * itemHeight}px`, paddingBottom: `${Math.max(0, normalized.length - virtualStart - renderedItems.length) * itemHeight}px` } : undefined}>
          {renderedItems.map((option, offset) => { const index = virtualScroll ? virtualStart + offset : offset; const item = items[index]; const selected = selectedValues.includes(option.value); const highlighted = index === activeIndex; const context = { item, option, selected, highlighted };
            return <button key={`${option.value}-${index}`} id={`sp-select-opt-${instanceId}-${index}`} type="button" role="option" aria-selected={selected} disabled={option.disabled} className={['sp-select__option', selected && 'sp-select__option--selected', highlighted && 'sp-select__option--highlighted', option.disabled && 'sp-select__option--disabled'].filter(Boolean).join('')} onMouseEnter={() => setHighlightedIndex(virtualScroll ? offset : index)} onClick={() => selectOption(index)}>
              {renderOption ? renderOption(context) : <><span className="sp-select__option-label">{option.icon && <Icon name={option.icon} size={14} ariaLabel={undefined} />}{option.color && <span className="sp-select__option-color" style={{ background: option.color }} aria-hidden="true" />}{option.label}{option.description && <small>{option.description}</small>}</span>{selected && <Icon name="check" size={14} className="sp-select__check" />}</>}
            </button>; })}
        </div>}
        {!loading && renderedItems.length === 0 && <div className="sp-select__empty">{renderEmpty ? renderEmpty() : t('noOptions')}</div>}
        {virtualPaging && showPagingFooter && <div className="sp-select__paging"><button type="button" disabled={page <= 1 || loading} onClick={() => { setPage(page - 1); void load(page - 1, query); }}>{t('previous')}</button><span>{t('page')} {page} {t('of')} {totalPages}</span><button type="button" disabled={page >= totalPages || loading} onClick={() => { setPage(page + 1); void load(page + 1, query); }}>{t('next')}</button></div>}
      </div>, document.body)}
      {errorMessage && <p className="sp-select-error" role="alert" id={errorId}>{errorMessage}</p>}
      {effectiveHint && !errorMessage && <p className="sp-select-hint" id={hintId}>{effectiveHint}</p>}
    </>
  );
}
