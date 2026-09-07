import './TreeCombobox.css';
import { createPortal } from 'react-dom';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type UIEvent,
} from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { computePosition, getScrollParents, type Placement } from '../../utils/positioning.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';
import { readLookupPage } from '../lookup/lookup-types.js';
import {
  collectBranchValues,
  collectInitialExpandedValues,
  descendantValues,
  filterTree,
  findTreeNode,
  flattenVisibleTree,
  normalizeTreeItems,
  selectionState,
  type TreeComboboxFlatNode,
  type TreeComboboxNode,
  type TreeComboboxSource,
} from './tree-combobox-utils.js';

export type { TreeComboboxFlatNode, TreeComboboxNode, TreeComboboxSource } from './tree-combobox-utils.js';
export type TreeComboboxVariant = 'default' | 'outline' | 'outlined' | 'filled';

export interface TreeComboboxRenderContext {
  item: unknown;
  node: TreeComboboxNode;
  selected: boolean;
  indeterminate: boolean;
  expanded: boolean;
  depth: number;
}

export interface TreeComboboxBaseProps {
  nodes?: TreeComboboxSource | null;
  source?: TreeComboboxSource | null;
  selectedItem?: unknown;
  onSelectedItem?: (item: unknown) => void;
  onOpenChange?: (open: boolean) => void;
  displayField?: string;
  valueField?: string;
  childrenField?: string;
  searchFields?: readonly string[] | null;
  icon?: string | null;
  autoOpen?: boolean;
  placeholder?: string;
  label?: string;
  floatingLabel?: boolean;
  variant?: TreeComboboxVariant;
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
  pageSize?: number;
  virtualScroll?: boolean;
  virtualItemHeight?: number;
  virtualOverscan?: number;
  renderOption?: (context: TreeComboboxRenderContext) => ReactNode;
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

export interface TreeComboboxSingleProps extends TreeComboboxBaseProps {
  multiple?: false;
  value?: string;
  onChange?: (value: string) => void;
}

export interface TreeComboboxMultipleProps extends TreeComboboxBaseProps {
  multiple: true;
  value?: readonly string[];
  onChange?: (value: string[]) => void;
}

export type TreeComboboxProps = TreeComboboxSingleProps | TreeComboboxMultipleProps;

export function TreeCombobox(props: TreeComboboxSingleProps): ReactElement | null;
export function TreeCombobox(props: TreeComboboxMultipleProps): ReactElement | null;
export function TreeCombobox(props: TreeComboboxProps) {
  const {
    nodes, source, value, multiple = false, selectedItem, onChange, onSelectedItem, onOpenChange,
    displayField = 'label', valueField = 'value', childrenField = 'children', searchFields,
    icon = null, autoOpen = false, placeholder, label = '', floatingLabel = false,
    variant = 'default', disabled = false, readOnly = false, hidden = false, invalid,
    error, errors, hint, required = false, onTouchedChange, placement = 'bottom-start',
    constrainToModal = true, dismissOnClickOutside = true, dismissOnScroll = true,
    cascadeCheck = true, expandAll = false, expandOnClick = false, showLines = false,
    pageSize = 50, virtualScroll = false, virtualItemHeight = 32, virtualOverscan = 5,
    renderOption, renderEmpty, loadingLabel, emptyLabel, ariaLabel, ariaLabelledBy,
    ariaDescribedBy, className = '', style, id,
  } = props;
  const { direction, t } = useI18n();
  const field = useFormFieldContext();
  const generatedId = useId().replace(/:/g, '');
  const inputId = id ?? `sp-tree-combo-${generatedId}`;
  const popupId = `${inputId}-tree`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const lookupSource = useMemo(() => source ?? nodes ?? [], [nodes, source]);
  const normalizedVariant = variant === 'outlined' ? 'outline' : variant;
  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const effectiveHidden = hidden || Boolean(field?.hidden);
  const effectiveRequired = required || Boolean(field?.required);
  const errorMessage = firstFormError(errors || field?.errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const effectiveHint = hint || field?.hint;
  const describedBy = ariaDescribedBy || field?.describedBy || (errorMessage ? errorId : effectiveHint ? hintId : undefined);
  const filterFields = useMemo(() => searchFields?.length ? [...searchFields] : [displayField], [displayField, searchFields]);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(autoOpen);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tree, setTree] = useState<TreeComboboxNode[]>(() => Array.isArray(lookupSource) ? normalizeTreeItems(lookupSource, displayField, valueField, childrenField) : []);
  const [expanded, setExpanded] = useState<Set<string>>(() => expandAll ? collectBranchValues(tree) : collectInitialExpandedValues(tree));
  const [highlighted, setHighlighted] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [positioned, setPositioned] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const suppressFocusOpen = useRef(false);

  const load = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setLoadError(null);
    try {
      const result = await readLookupPage(lookupSource, { pageNumber: 1, pageSize, searchTerm, searchFields: filterFields.join(',') });
      const next = normalizeTreeItems(result.data, displayField, valueField, childrenField);
      setTree(next);
      setExpanded((current) => expandAll || searchTerm ? collectBranchValues(next) : current.size ? current : collectInitialExpandedValues(next));
    } catch (cause) {
      setTree([]);
      setLoadError(cause instanceof Error ? cause.message : 'Unable to load options');
    } finally {
      setLoading(false);
    }
  }, [childrenField, displayField, expandAll, filterFields, lookupSource, pageSize, valueField]);

  useEffect(() => {
    if (!Array.isArray(lookupSource)) return;
    const next = normalizeTreeItems(lookupSource, displayField, valueField, childrenField);
    setTree(next);
    setExpanded(expandAll ? collectBranchValues(next) : collectInitialExpandedValues(next));
  }, [childrenField, displayField, expandAll, lookupSource, valueField]);

  const selectedValues = useMemo(() => new Set(Array.isArray(value) ? value : value ? [value] : []), [value]);
  const selectedNodes = useMemo(() => [...selectedValues].map((item) => findTreeNode(tree, item)).filter((item): item is TreeComboboxNode => Boolean(item)), [selectedValues, tree]);
  const filtered = useMemo(() => Array.isArray(lookupSource) ? filterTree(tree, query, filterFields) : tree, [filterFields, lookupSource, query, tree]);
  const effectiveExpanded = useMemo(() => query ? collectBranchValues(filtered) : expanded, [expanded, filtered, query]);
  const flat = useMemo(() => flattenVisibleTree(filtered, effectiveExpanded), [effectiveExpanded, filtered]);
  const visibleStart = virtualScroll ? Math.max(0, Math.floor(scrollTop / virtualItemHeight) - virtualOverscan) : 0;
  const visibleEnd = virtualScroll ? Math.min(flat.length, Math.ceil((scrollTop + 280) / virtualItemHeight) + virtualOverscan) : flat.length;
  const visible = flat.slice(visibleStart, visibleEnd);

  const reposition = useCallback(() => {
    if (!anchorRef.current || !panelRef.current) return;
    const next = computePosition(anchorRef.current, panelRef.current, placement, 4);
    setPosition({ top: next.top, left: next.left, width: anchorRef.current.offsetWidth });
    setPositioned(true);
  }, [placement]);
  const setOpenState = useCallback((next: boolean) => {
    if (effectiveDisabled || effectiveReadOnly) return;
    setOpen(next);
    onOpenChange?.(next);
    if (next) {
      setPositioned(false);
      setHighlighted(0);
      void load('');
    }
  }, [effectiveDisabled, effectiveReadOnly, load, onOpenChange]);
  useEffect(() => { if (autoOpen && !effectiveDisabled && !effectiveReadOnly) setOpenState(true); }, [autoOpen, effectiveDisabled, effectiveReadOnly, setOpenState]);
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(reposition);
    const parents = anchorRef.current ? getScrollParents(anchorRef.current) : [];
    const handleScroll = () => dismissOnScroll ? setOpenState(false) : reposition();
    parents.forEach((parent) => parent.addEventListener('scroll', handleScroll, { passive: true }));
    window.addEventListener('resize', reposition);
    if (dismissOnScroll) window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      parents.forEach((parent) => parent.removeEventListener('scroll', handleScroll));
      window.removeEventListener('resize', reposition);
      if (dismissOnScroll) window.removeEventListener('scroll', handleScroll);
    };
  }, [dismissOnScroll, open, reposition, setOpenState]);
  useEffect(() => {
    if (!open || !dismissOnClickOutside) return;
    const handlePointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!anchorRef.current?.contains(target) && !panelRef.current?.contains(target)) setOpenState(false);
    };
    document.addEventListener('mousedown', handlePointer);
    return () => document.removeEventListener('mousedown', handlePointer);
  }, [dismissOnClickOutside, open, setOpenState]);
  useEffect(() => {
    if (multiple) return;
    const node = typeof value === 'string' ? findTreeNode(tree, value) : undefined;
    if (node) setQuery(node.label);
    else if (selectedItem) setQuery(normalizeTreeItems([selectedItem], displayField, valueField, childrenField)[0]?.label ?? '');
    else if (!value) setQuery('');
  }, [childrenField, displayField, multiple, selectedItem, tree, value, valueField]);

  function emitValue(next: string | string[]) {
    if (multiple) (onChange as TreeComboboxMultipleProps['onChange'])?.(Array.isArray(next) ? next : [next]);
    else (onChange as TreeComboboxSingleProps['onChange'])?.(Array.isArray(next) ? next[0] ?? '' : next);
  }
  function selectNode(item: TreeComboboxFlatNode) {
    if (item.node.disabled) return;
    if (multiple) {
      const next = new Set(selectedValues);
      const state = selectionState(item.node, next);
      const targets = cascadeCheck ? descendantValues(item.node) : [item.node.value];
      targets.forEach((target) => state === 'checked' ? next.delete(target) : next.add(target));
      emitValue([...next]);
      setQuery('');
    } else {
      emitValue(item.node.value);
      setQuery(item.node.label);
      setOpenState(false);
    }
    onSelectedItem?.(item.raw);
    suppressFocusOpen.current = true;
    inputRef.current?.focus();
  }
  function toggle(item: TreeComboboxFlatNode) {
    if (!item.hasChildren) return;
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(item.node.value)) next.delete(item.node.value); else next.add(item.node.value);
      return next;
    });
  }
  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (effectiveDisabled || effectiveReadOnly) return;
    if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault(); setOpenState(true); return;
    }
    if (!open || !flat.length) return;
    const active = flat[highlighted];
    if (event.key === 'ArrowDown') { event.preventDefault(); setHighlighted((current) => (current + 1) % flat.length); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setHighlighted((current) => (current - 1 + flat.length) % flat.length); }
    else if (event.key === 'Home') { event.preventDefault(); setHighlighted(0); }
    else if (event.key === 'End') { event.preventDefault(); setHighlighted(flat.length - 1); }
    else if (event.key === 'ArrowRight' && active?.hasChildren) { event.preventDefault(); if (!active.expanded) toggle(active); else setHighlighted(Math.min(flat.length - 1, highlighted + 1)); }
    else if (event.key === 'ArrowLeft' && active) { event.preventDefault(); if (active.expanded) toggle(active); else { const parent = active.parentValues.at(-1); const index = flat.findIndex((entry) => entry.node.value === parent); if (index >= 0) setHighlighted(index); } }
    else if ((event.key === 'Enter' || event.key === ' ') && active) { event.preventDefault(); if (expandOnClick && active.hasChildren && !multiple) toggle(active); else selectNode(active); }
    else if (event.key === 'Escape') { event.preventDefault(); setOpenState(false); }
    else if (event.key === 'Tab') setOpenState(false);
  }
  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) onTouchedChange?.(true);
  }

  if (effectiveHidden) return null;
  const active = flat[highlighted];
  const activeId = active ? `${popupId}-item-${highlighted}` : undefined;
  const rootClass = ['sp-tc', `sp-tc--${normalizedVariant}`, floatingLabel && 'sp-tc--floating', open && 'sp-tc--open', effectiveDisabled && 'sp-tc--disabled', effectiveReadOnly && 'sp-tc--readonly', hasError && 'sp-tc--error', className].filter(Boolean).join(' ');
  return <>
    <div ref={anchorRef} className={rootClass} dir={direction} style={style} data-constrain-to-modal={constrainToModal}>
      {label && <label className="sp-tc__label" htmlFor={inputId}>{label}{effectiveRequired && <span aria-hidden="true"> *</span>}</label>}
      <div className="sp-tc__control">
        <Icon name={icon ?? 'search'} size={14} className="sp-tc__search-icon" />
        {multiple && selectedNodes.length > 0 && <div className="sp-tc__chips" aria-label={`${selectedNodes.length} selected`}>
          {selectedNodes.map((node) => <span className="sp-tc__chip" key={node.value}>{node.label}<button type="button" aria-label={`${t('clear')} ${node.label}`} onMouseDown={(event) => event.preventDefault()} onClick={() => emitValue([...selectedValues].filter((selected) => selected !== node.value))}><Icon name="x" size={10} /></button></span>)}
        </div>}
        <input ref={inputRef} id={inputId} className="sp-tc__input" role="combobox" aria-haspopup="tree" aria-expanded={open} aria-controls={open ? popupId : undefined} aria-activedescendant={open ? activeId : undefined} aria-autocomplete="list" aria-label={ariaLabel || (!label ? 'Tree combobox' : undefined)} aria-labelledby={ariaLabelledBy} aria-describedby={describedBy} aria-invalid={hasError || undefined} aria-required={effectiveRequired || undefined} aria-readonly={effectiveReadOnly || undefined} disabled={effectiveDisabled} readOnly={effectiveReadOnly} placeholder={placeholder ?? t('search')} value={query} onFocus={() => { if (suppressFocusOpen.current) suppressFocusOpen.current = false; else setOpenState(true); }} onBlur={handleBlur} onChange={(event: ChangeEvent<HTMLInputElement>) => { const next = event.target.value; setQuery(next); if (!open) setOpenState(true); if (!Array.isArray(lookupSource)) void load(next); }} onKeyDown={onInputKeyDown} />
        {(query || selectedValues.size) && !effectiveDisabled && !effectiveReadOnly ? <button type="button" className="sp-tc__clear" tabIndex={-1} aria-label={t('clear')} onMouseDown={(event) => event.preventDefault()} onClick={() => { setQuery(''); emitValue(multiple ? [] : ''); inputRef.current?.focus(); }}><Icon name="x" size={12} /></button> : null}
        <button type="button" className="sp-tc__chevron" aria-label={open ? t('close') : t('open')} aria-expanded={open} disabled={effectiveDisabled || effectiveReadOnly} onMouseDown={(event) => event.preventDefault()} onClick={() => { setOpenState(!open); inputRef.current?.focus(); }}><Icon name="chevron-down" size={12} /></button>
      </div>
      {errorMessage && <div id={errorId} className="sp-tc__message sp-tc__message--error" role="alert">{errorMessage}</div>}
      {!errorMessage && effectiveHint && <div id={hintId} className="sp-tc__message">{effectiveHint}</div>}
    </div>
    {open && createPortal(<div ref={panelRef} id={popupId} role="tree" aria-multiselectable={multiple || undefined} aria-label={ariaLabel || label || 'Options'} className={['sp-tc__popup', showLines && 'sp-tc__popup--lines', virtualScroll && 'sp-tc__popup--virtual'].filter(Boolean).join(' ')} dir={direction} style={{ position: 'fixed', top: position.top, left: position.left, minWidth: position.width, opacity: positioned ? 1 : 0 }} onScroll={(event: UIEvent<HTMLDivElement>) => setScrollTop(event.currentTarget.scrollTop)}>
      {loading && <div className="sp-tc__state" role="status">{loadingLabel ?? t('loading')}</div>}
      {!loading && loadError && <div className="sp-tc__state sp-tc__state--error" role="alert">{loadError}</div>}
      {!loading && !loadError && virtualScroll && visibleStart > 0 && <div aria-hidden="true" style={{ height: visibleStart * virtualItemHeight }} />}
      {!loading && !loadError && visible.map((item, offset) => {
        const index = visibleStart + offset;
        const state = selectionState(item.node, selectedValues);
        const selected = state === 'checked';
        const context: TreeComboboxRenderContext = { item: item.raw, node: item.node, selected, indeterminate: state === 'mixed', expanded: item.expanded, depth: item.depth };
        return <div id={`${popupId}-item-${index}`} key={item.node.value} role="treeitem" aria-level={item.depth + 1} aria-expanded={item.hasChildren ? item.expanded : undefined} aria-selected={!multiple ? selectedValues.has(item.node.value) : undefined} aria-checked={multiple ? (state === 'mixed' ? 'mixed' : selected) : undefined} aria-disabled={item.node.disabled || undefined} className={['sp-tc__row', index === highlighted && 'sp-tc__row--highlighted', selectedValues.has(item.node.value) && 'sp-tc__row--selected', item.node.disabled && 'sp-tc__row--disabled'].filter(Boolean).join(' ')} style={{ '--sp-tc-depth': item.depth } as CSSProperties} onMouseEnter={() => setHighlighted(index)} onClick={() => { if (expandOnClick && item.hasChildren) toggle(item); else selectNode(item); }}>
          <span className="sp-tc__guides" aria-hidden="true" />
          {item.hasChildren ? <button type="button" tabIndex={-1} className="sp-tc__toggle" aria-label={`${item.expanded ? t('close') : t('open')} ${item.node.label}`} onClick={(event) => { event.stopPropagation(); toggle(item); }}><Icon name="chevron-right" size={12} /></button> : <span className="sp-tc__toggle" />}
          {multiple && <span className={['sp-tc__checkbox', state === 'mixed' && 'sp-tc__checkbox--mixed', selected && 'sp-tc__checkbox--checked'].filter(Boolean).join(' ')} aria-hidden="true">{state === 'mixed' ? '–' : selected ? '✓' : ''}</span>}
          {renderOption ? renderOption(context) : <><Icon name={item.node.icon ?? (item.hasChildren ? 'folder' : 'file')} size={14} /><span className="sp-tc__row-label">{item.node.label}</span>{item.node.badge && <span className="sp-tc__badge">{item.node.badge}</span>}</>}
        </div>;
      })}
      {!loading && !loadError && !visible.length && <div className="sp-tc__state">{renderEmpty ? renderEmpty(query) : emptyLabel ?? t('noResults')}</div>}
      {!loading && !loadError && virtualScroll && visibleEnd < flat.length && <div aria-hidden="true" style={{ height: (flat.length - visibleEnd) * virtualItemHeight }} />}
    </div>, document.body)}
  </>;
}
