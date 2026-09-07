import './TreeGridCombobox.css';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactElement, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { computePosition, getScrollParents, type Placement } from '../../utils/positioning.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';
import { readLookupPage, type LookupSource } from '../lookup/lookup-types.js';
import { collectBranchValues, collectInitialExpandedValues, descendantValues, filterTree, findTreeNode, flattenVisibleTree, normalizeTreeItems, selectionState, type TreeComboboxFlatNode, type TreeComboboxNode } from '../tree-combobox/tree-combobox-utils.js';

export interface TreeGridComboboxColumn {
  key: string;
  label: string;
  width?: string;
  resizable?: boolean;
  minWidth?: number;
  align?: 'start' | 'center' | 'end';
}

export interface TreeGridComboboxOption extends TreeComboboxNode {
  children?: TreeGridComboboxOption[];
}

export interface TreeGridComboboxFlatOption {
  option: TreeGridComboboxOption;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
}

export type TreeGridComboboxSource = LookupSource<unknown>;
export type TreeGridComboboxVariant = 'default' | 'outline' | 'outlined' | 'filled';

export interface TreeGridComboboxRenderContext {
  item: unknown;
  option: TreeGridComboboxOption;
  selected: boolean;
  indeterminate: boolean;
  expanded: boolean;
  depth: number;
}

export interface TreeGridComboboxBaseProps {
  columns: readonly TreeGridComboboxColumn[];
  options?: TreeGridComboboxSource | null;
  source?: TreeGridComboboxSource | null;
  selectedItem?: unknown;
  onSelectedItem?: (item: unknown) => void;
  onOpenChange?: (open: boolean) => void;
  displayField?: string;
  valueField?: string;
  childrenField?: string;
  filterBy?: string | readonly string[];
  searchFields?: readonly string[] | null;
  icon?: string | null;
  autoOpen?: boolean;
  placeholder?: string;
  label?: string;
  floatingLabel?: boolean;
  variant?: TreeGridComboboxVariant;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  invalid?: boolean;
  error?: string;
  errors?: readonly FormValidationError[];
  hint?: string;
  required?: boolean;
  touched?: boolean;
  onTouchedChange?: (touched: boolean) => void;
  placement?: Placement;
  constrainToModal?: boolean;
  dismissOnClickOutside?: boolean;
  dismissOnScroll?: boolean;
  cascadeCheck?: boolean;
  expandAll?: boolean;
  expandOnClick?: boolean;
  showLines?: boolean;
  resizableColumns?: boolean;
  resizable?: boolean;
  panelResizable?: boolean;
  pageSize?: number;
  virtualScroll?: boolean;
  virtualItemHeight?: number;
  renderRow?: (context: TreeGridComboboxRenderContext) => ReactNode;
  renderEmpty?: (query: string) => ReactNode;
  loadingLabel?: string;
  emptyLabel?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

export interface TreeGridComboboxSingleProps extends TreeGridComboboxBaseProps { multiple?: false; value?: string; onChange?: (value: string) => void; }
export interface TreeGridComboboxMultipleProps extends TreeGridComboboxBaseProps { multiple: true; value?: readonly string[]; onChange?: (value: string[]) => void; }
export type TreeGridComboboxProps = TreeGridComboboxSingleProps | TreeGridComboboxMultipleProps;

export function TreeGridCombobox(props: TreeGridComboboxSingleProps): ReactElement | null;
export function TreeGridCombobox(props: TreeGridComboboxMultipleProps): ReactElement | null;
export function TreeGridCombobox(props: TreeGridComboboxProps) {
  const {
    columns, options, source, value, multiple = false, selectedItem, onChange, onSelectedItem, onOpenChange,
    displayField = 'label', valueField = 'value', childrenField = 'children', filterBy = 'label', searchFields,
    icon = null, autoOpen = false, placeholder, label = '', floatingLabel = false, variant = 'default',
    disabled = false, readOnly = false, hidden = false, invalid, error, errors, hint, required = false,
    onTouchedChange, placement = 'bottom-start', constrainToModal = true, dismissOnClickOutside = true,
    dismissOnScroll = true, cascadeCheck = true, expandAll = false, expandOnClick = false, showLines = false,
    resizableColumns = false, resizable = false, panelResizable = false, pageSize = 50, virtualScroll = false,
    virtualItemHeight = 34, renderRow, renderEmpty, loadingLabel, emptyLabel, ariaLabel, ariaLabelledBy,
    ariaDescribedBy, className = '', style, id,
  } = props;
  const { direction, t } = useI18n();
  const field = useFormFieldContext();
  const generatedId = useId().replace(/:/g, '');
  const inputId = id ?? `sp-tree-grid-combo-${generatedId}`;
  const popupId = `${inputId}-treegrid`;
  const lookupSource = useMemo(() => source ?? options ?? [], [options, source]);
  const fields = useMemo(() => searchFields?.length ? [...searchFields] : Array.isArray(filterBy) ? [...filterBy] : [filterBy], [filterBy, searchFields]);
  const normalizedVariant = variant === 'outlined' ? 'outline' : variant;
  const hasFloatingLabel = floatingLabel || Boolean(label && normalizedVariant !== 'default');
  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const effectiveHidden = hidden || Boolean(field?.hidden);
  const effectiveRequired = required || Boolean(field?.required);
  const errorMessage = firstFormError(errors || field?.errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const effectiveHint = hint || field?.hint;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = ariaDescribedBy || field?.describedBy || (errorMessage ? errorId : effectiveHint ? hintId : undefined);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(autoOpen);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tree, setTree] = useState<TreeGridComboboxOption[]>(() => Array.isArray(lookupSource) ? normalizeTreeItems(lookupSource, displayField, valueField, childrenField) as TreeGridComboboxOption[] : []);
  const [expanded, setExpanded] = useState<Set<string>>(() => expandAll ? collectBranchValues(tree) : collectInitialExpandedValues(tree));
  const [highlighted, setHighlighted] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [positioned, setPositioned] = useState(false);
  const [columnWidths, setColumnWidths] = useState<Record<string, string>>({});
  const [scrollTop, setScrollTop] = useState(0);
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suppressFocusOpen = useRef(false);
  const previousValue = useRef<typeof value>(value);
  const columnsResizable = resizableColumns || resizable;

  const load = useCallback(async (term: string) => {
    setLoading(true); setLoadError(null);
    try {
      const result = await readLookupPage(lookupSource, { pageNumber: 1, pageSize, searchTerm: term, searchFields: fields.join(',') });
      const next = normalizeTreeItems(result.data, displayField, valueField, childrenField) as TreeGridComboboxOption[];
      setTree(next);
      setExpanded((current) => expandAll || term ? collectBranchValues(next) : current.size ? current : collectInitialExpandedValues(next));
    } catch (cause) {
      setTree([]); setLoadError(cause instanceof Error ? cause.message : 'Unable to load options');
    } finally { setLoading(false); }
  }, [childrenField, displayField, expandAll, fields, lookupSource, pageSize, valueField]);
  useEffect(() => {
    if (!Array.isArray(lookupSource)) return;
    const next = normalizeTreeItems(lookupSource, displayField, valueField, childrenField) as TreeGridComboboxOption[];
    setTree(next); setExpanded(expandAll ? collectBranchValues(next) : collectInitialExpandedValues(next));
  }, [childrenField, displayField, expandAll, lookupSource, valueField]);

  const selectedValues = useMemo(() => new Set(Array.isArray(value) ? value : value ? [value] : []), [value]);
  const selectedNodes = useMemo(() => [...selectedValues].map((entry) => findTreeNode(tree, entry)).filter((entry): entry is TreeComboboxNode => Boolean(entry)), [selectedValues, tree]);
  const filtered = useMemo(() => Array.isArray(lookupSource) ? filterTree(tree, query, fields) : tree, [fields, lookupSource, query, tree]);
  const effectiveExpanded = useMemo(() => query ? collectBranchValues(filtered) : expanded, [expanded, filtered, query]);
  const flat = useMemo(() => flattenVisibleTree(filtered, effectiveExpanded), [effectiveExpanded, filtered]);
  const visibleStart = virtualScroll ? Math.max(0, Math.floor(scrollTop / virtualItemHeight) - 5) : 0;
  const visibleEnd = virtualScroll ? Math.min(flat.length, Math.ceil((scrollTop + 280) / virtualItemHeight) + 5) : flat.length;
  const visible = flat.slice(visibleStart, visibleEnd);
  const gridTemplate = columns.map((column) => columnWidths[column.key] ?? column.width ?? 'minmax(96px, 1fr)').join(' ');

  const reposition = useCallback(() => {
    if (!anchorRef.current || !panelRef.current) return;
    const next = computePosition(anchorRef.current, panelRef.current, placement, 4);
    setPosition({ top: next.top, left: next.left, width: anchorRef.current.offsetWidth }); setPositioned(true);
  }, [placement]);
  const setOpenState = useCallback((next: boolean) => {
    if (effectiveDisabled || effectiveReadOnly) return;
    setOpen(next); onOpenChange?.(next);
    if (next) { setPositioned(false); setHighlighted(0); void load(''); }
  }, [effectiveDisabled, effectiveReadOnly, load, onOpenChange]);
  useEffect(() => { if (autoOpen && !effectiveDisabled && !effectiveReadOnly) setOpenState(true); }, [autoOpen, effectiveDisabled, effectiveReadOnly, setOpenState]);
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(reposition);
    const parents = anchorRef.current ? getScrollParents(anchorRef.current) : [];
    const onScroll = () => dismissOnScroll ? setOpenState(false) : reposition();
    parents.forEach((parent) => parent.addEventListener('scroll', onScroll, { passive: true }));
    window.addEventListener('resize', reposition);
    if (dismissOnScroll) window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); parents.forEach((parent) => parent.removeEventListener('scroll', onScroll)); window.removeEventListener('resize', reposition); if (dismissOnScroll) window.removeEventListener('scroll', onScroll); };
  }, [dismissOnScroll, open, reposition, setOpenState]);
  useEffect(() => {
    if (!open || !dismissOnClickOutside) return;
    const listener = (event: MouseEvent) => { const target = event.target as Node; if (!anchorRef.current?.contains(target) && !panelRef.current?.contains(target)) setOpenState(false); };
    document.addEventListener('mousedown', listener); return () => document.removeEventListener('mousedown', listener);
  }, [dismissOnClickOutside, open, setOpenState]);
  useEffect(() => {
    if (multiple) return;
    const node = typeof value === 'string' ? findTreeNode(tree, value) : undefined;
    if (node) setQuery(node.label); else if (selectedItem) setQuery(normalizeTreeItems([selectedItem], displayField, valueField, childrenField)[0]?.label ?? ''); else if (!value && previousValue.current) setQuery('');
    previousValue.current = value;
  }, [childrenField, displayField, multiple, selectedItem, tree, value, valueField]);

  function emitValue(next: string | string[]) {
    if (multiple) (onChange as TreeGridComboboxMultipleProps['onChange'])?.(Array.isArray(next) ? next : [next]);
    else (onChange as TreeGridComboboxSingleProps['onChange'])?.(Array.isArray(next) ? next[0] ?? '' : next);
  }
  function toggle(item: TreeComboboxFlatNode) {
    if (!item.hasChildren) return;
    setExpanded((current) => { const next = new Set(current); if (next.has(item.node.value)) next.delete(item.node.value); else next.add(item.node.value); return next; });
  }
  function select(item: TreeComboboxFlatNode) {
    if (item.node.disabled) return;
    if (multiple) {
      const next = new Set(selectedValues); const state = selectionState(item.node, next);
      (cascadeCheck ? descendantValues(item.node) : [item.node.value]).forEach((entry) => state === 'checked' ? next.delete(entry) : next.add(entry));
      emitValue([...next]); setQuery('');
    } else { emitValue(item.node.value); setQuery(item.node.label); setOpenState(false); }
    onSelectedItem?.(item.raw); suppressFocusOpen.current = true; inputRef.current?.focus();
  }
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (effectiveDisabled || effectiveReadOnly) return;
    if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) { event.preventDefault(); setOpenState(true); return; }
    if (!open || !flat.length) return;
    const active = flat[highlighted];
    if (event.key === 'ArrowDown') { event.preventDefault(); setHighlighted((current) => (current + 1) % flat.length); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setHighlighted((current) => (current - 1 + flat.length) % flat.length); }
    else if (event.key === 'Home') { event.preventDefault(); setHighlighted(0); }
    else if (event.key === 'End') { event.preventDefault(); setHighlighted(flat.length - 1); }
    else if (event.key === 'ArrowRight' && active?.hasChildren) { event.preventDefault(); if (!active.expanded) toggle(active); else setHighlighted(Math.min(flat.length - 1, highlighted + 1)); }
    else if (event.key === 'ArrowLeft' && active) { event.preventDefault(); if (active.expanded) toggle(active); else { const parent = active.parentValues.at(-1); const index = flat.findIndex((entry) => entry.node.value === parent); if (index >= 0) setHighlighted(index); } }
    else if ((event.key === 'Enter' || event.key === ' ') && active) { event.preventDefault(); if (expandOnClick && active.hasChildren && !multiple) toggle(active); else select(active); }
    else if (event.key === 'Escape') { event.preventDefault(); setOpenState(false); }
    else if (event.key === 'Tab') setOpenState(false);
  }
  function beginResize(column: TreeGridComboboxColumn, event: ReactPointerEvent<HTMLButtonElement>) {
    if (!columnsResizable || column.resizable === false) return;
    event.preventDefault();
    const startX = event.clientX; const startWidth = event.currentTarget.parentElement?.getBoundingClientRect().width ?? 96;
    const move = (moveEvent: PointerEvent) => setColumnWidths((current) => ({ ...current, [column.key]: `${Math.max(column.minWidth ?? 40, startWidth + (direction === 'rtl' ? startX - moveEvent.clientX : moveEvent.clientX - startX))}px` }));
    const stop = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', stop, { once: true });
  }

  if (effectiveHidden) return null;
  const activeId = flat[highlighted] ? `${popupId}-row-${highlighted}` : undefined;
  const rootClass = ['sp-tgc', `sp-tgc--${normalizedVariant}`, hasFloatingLabel && 'sp-tgc--floating', hasFloatingLabel && (open || Boolean(query) || selectedValues.size > 0) && 'sp-tgc--floated', open && 'sp-tgc--open', effectiveDisabled && 'sp-tgc--disabled', effectiveReadOnly && 'sp-tgc--readonly', hasError && 'sp-tgc--error', className].filter(Boolean).join(' ');
  return <>
    <div ref={anchorRef} className={rootClass} dir={direction} style={style} data-constrain-to-modal={constrainToModal}>
      {label && <label className="sp-tgc__label" htmlFor={inputId}>{label}{effectiveRequired && <span aria-hidden="true"> *</span>}</label>}
      <div className="sp-tgc__control"><Icon name={icon ?? 'search'} size={14} className="sp-tgc__search-icon" />
        {multiple && selectedNodes.length > 0 && <div className="sp-tgc__chips" aria-label={`${selectedNodes.length} selected`}>{selectedNodes.map((node) => <span className="sp-tgc__chip" key={node.value}>{node.label}<button type="button" aria-label={`${t('clear')} ${node.label}`} onMouseDown={(event) => event.preventDefault()} onClick={() => emitValue([...selectedValues].filter((entry) => entry !== node.value))}><Icon name="x" size={10} /></button></span>)}</div>}
        <input ref={inputRef} id={inputId} className="sp-tgc__input" role="combobox" aria-haspopup="grid" aria-expanded={open} aria-controls={open ? popupId : undefined} aria-activedescendant={open ? activeId : undefined} aria-autocomplete="list" aria-label={ariaLabel || (!label ? t('treeView') : undefined)} aria-labelledby={ariaLabelledBy} aria-describedby={describedBy} aria-invalid={hasError || undefined} aria-required={effectiveRequired || undefined} aria-readonly={effectiveReadOnly || undefined} disabled={effectiveDisabled} readOnly={effectiveReadOnly} placeholder={hasFloatingLabel && !open && !query ? undefined : placeholder ?? t('search')} value={query} onFocus={() => { if (suppressFocusOpen.current) suppressFocusOpen.current = false; else setOpenState(true); }} onBlur={() => onTouchedChange?.(true)} onChange={(event: ChangeEvent<HTMLInputElement>) => { setQuery(event.target.value); setHighlighted(0); if (!open) setOpenState(true); if (!Array.isArray(lookupSource)) void load(event.target.value); }} onKeyDown={onKeyDown} />
        {(query || selectedValues.size) && !effectiveDisabled && !effectiveReadOnly ? <button type="button" tabIndex={-1} className="sp-tgc__clear" aria-label={t('clear')} onMouseDown={(event) => event.preventDefault()} onClick={() => { setQuery(''); emitValue(multiple ? [] : ''); inputRef.current?.focus(); }}><Icon name="x" size={12} /></button> : null}
        <button type="button" className="sp-tgc__chevron" aria-label={open ? t('close') : t('open')} aria-expanded={open} disabled={effectiveDisabled || effectiveReadOnly} onMouseDown={(event) => event.preventDefault()} onClick={() => { setOpenState(!open); inputRef.current?.focus(); }}><Icon name="chevron-down" size={12} /></button>
      </div>
      {errorMessage && <div id={errorId} className="sp-tgc__message sp-tgc__message--error" role="alert">{errorMessage}</div>}
      {!errorMessage && effectiveHint && <div id={hintId} className="sp-tgc__message">{effectiveHint}</div>}
    </div>
    {open && createPortal(<div ref={panelRef} id={popupId} role="treegrid" aria-multiselectable={multiple || undefined} aria-label={ariaLabel || label || 'Options'} aria-colcount={columns.length} className={['sp-tgc__popup', showLines && 'sp-tgc__popup--lines', panelResizable && 'sp-tgc__popup--resizable', virtualScroll && 'sp-tgc__popup--virtual'].filter(Boolean).join(' ')} dir={direction} style={{ position: 'fixed', top: position.top, left: position.left, minWidth: position.width, opacity: positioned ? 1 : 0 }} onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}>
      <div role="row" className="sp-tgc__header" style={{ gridTemplateColumns: gridTemplate }}>{columns.map((column, index) => <div role="columnheader" aria-colindex={index + 1} key={column.key} className={`sp-tgc__header-cell sp-tgc__cell--${column.align ?? 'start'}`}><span>{column.label}</span>{columnsResizable && column.resizable !== false && <button type="button" className="sp-tgc__resizer" aria-label={t('resizeColumn', { column: column.label })} onPointerDown={(event) => beginResize(column, event)} />}</div>)}</div>
      {loading && <div className="sp-tgc__state" role="status">{loadingLabel ?? t('loading')}</div>}
      {!loading && loadError && <div className="sp-tgc__state sp-tgc__state--error" role="alert">{loadError}</div>}
      {!loading && !loadError && virtualScroll && visibleStart > 0 && <div aria-hidden="true" style={{ height: visibleStart * virtualItemHeight }} />}
      {!loading && !loadError && visible.map((item, offset) => {
        const index = visibleStart + offset; const state = selectionState(item.node, selectedValues); const selected = state === 'checked';
        const context: TreeGridComboboxRenderContext = { item: item.raw, option: item.node as TreeGridComboboxOption, selected, indeterminate: state === 'mixed', expanded: item.expanded, depth: item.depth };
        return <div key={item.node.value} id={`${popupId}-row-${index}`} role="row" aria-level={item.depth + 1} aria-expanded={item.hasChildren ? item.expanded : undefined} aria-selected={selectedValues.has(item.node.value)} aria-disabled={item.node.disabled || undefined} className={['sp-tgc__row', index === highlighted && 'sp-tgc__row--highlighted', selectedValues.has(item.node.value) && 'sp-tgc__row--selected', item.node.disabled && 'sp-tgc__row--disabled'].filter(Boolean).join(' ')} style={{ gridTemplateColumns: gridTemplate }} onMouseEnter={() => setHighlighted(index)} onClick={() => { if (expandOnClick && item.hasChildren) toggle(item); else select(item); }}>
          {renderRow ? <div role="gridcell" className="sp-tgc__custom-cell" style={{ gridColumn: `1 / span ${Math.max(1, columns.length)}` }}>{renderRow(context)}</div> : columns.map((column, columnIndex) => <div role="gridcell" aria-colindex={columnIndex + 1} key={column.key} className={`sp-tgc__cell sp-tgc__cell--${column.align ?? 'start'}`}>{columnIndex === 0 && <span className="sp-tgc__tree-cell" style={{ '--sp-tgc-depth': item.depth } as CSSProperties}><span className="sp-tgc__guides" aria-hidden="true" />{item.hasChildren ? <button type="button" tabIndex={-1} className="sp-tgc__toggle" aria-label={`${item.expanded ? t('close') : t('open')} ${item.node.label}`} onClick={(event) => { event.stopPropagation(); toggle(item); }}><Icon name="chevron-right" size={12} /></button> : <span className="sp-tgc__toggle" />}{multiple && <span className={['sp-tgc__checkbox', state === 'mixed' && 'sp-tgc__checkbox--mixed', selected && 'sp-tgc__checkbox--checked'].filter(Boolean).join(' ')} aria-hidden="true">{state === 'mixed' ? '–' : selected ? '✓' : ''}</span>}<Icon name={item.node.icon ?? (item.hasChildren ? 'folder' : 'file')} size={14} /></span>}<span className="sp-tgc__cell-value">{String(item.node[column.key] ?? '')}</span></div>)}
        </div>;
      })}
      {!loading && !loadError && !visible.length && <div className="sp-tgc__state">{renderEmpty ? renderEmpty(query) : emptyLabel ?? t('noResults')}</div>}
      {!loading && !loadError && virtualScroll && visibleEnd < flat.length && <div aria-hidden="true" style={{ height: (flat.length - visibleEnd) * virtualItemHeight }} />}
    </div>, document.body)}
  </>;
}
