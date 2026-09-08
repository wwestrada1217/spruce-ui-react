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
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import {
  computePosition,
  getScrollParents,
  modalBoundary,
  onClickOutside,
  type Placement,
} from '../../utils/positioning.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormValidationError } from '../field/form-types.js';
import {
  isLookupSource,
  readLookupPage,
  type LookupSource,
} from '../lookup/lookup-types.js';
import {
  collectAllExpandable,
  findTreeNode,
  flattenNodes,
  filterTreeNodes,
  getRawItem,
  guideColumns,
  isChecked,
  isIndeterminate,
  normalizeTreeNodes,
  setCheckedRecursive,
  type TreeComboboxNode,
} from './tree-combobox-utils.js';

export type {
  TreeComboboxFlatNode,
  TreeComboboxNode,
  TreeComboboxSource,
  TreeFlatNode,
} from './tree-combobox-utils.js';

export type TreeComboboxVariant = 'default' | 'outline' | 'outlined' | 'filled';

export interface TreeComboboxOptionContext {
  item: unknown;
  node: TreeComboboxNode;
  selected: boolean;
  expanded: boolean;
  depth: number;
}
export type TreeComboboxRenderContext = TreeComboboxOptionContext;

export interface TreeComboboxBaseProps {
  nodes?: TreeComboboxNode[] | unknown[] | LookupSource<unknown> | null;
  source?: TreeComboboxNode[] | unknown[] | LookupSource<unknown> | null;
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
  renderOption?: (context: TreeComboboxOptionContext) => ReactNode;
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
export function TreeCombobox(props: TreeComboboxProps): ReactElement | null {
  const {
    nodes,
    source,
    value,
    multiple = false,
    onChange,
    onSelectedItem,
    onOpenChange,
    displayField = 'label',
    valueField = 'value',
    childrenField = 'children',
    searchFields = null,
    icon = null,
    autoOpen = false,
    placeholder,
    label = '',
    floatingLabel = false,
    variant = 'default',
    disabled = false,
    readOnly = false,
    hidden = false,
    invalid,
    error,
    errors,
    hint,
    required = false,
    onTouchedChange,
    placement = 'bottom-start',
    constrainToModal = true,
    dismissOnClickOutside = true,
    dismissOnScroll = true,
    cascadeCheck = true,
    expandAll = false,
    expandOnClick = false,
    showLines = false,
    pageSize = 100,
    renderOption,
    renderEmpty,
    loadingLabel,
    emptyLabel,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    className = '',
    style,
    id,
  } = props;

  const { direction, t } = useI18n();
  const field = useFormFieldContext();
  const instanceId = useId().replace(/:/g, '');
  const inputId = id ?? `sp-tc-${instanceId}`;
  const popupId = `sp-tc-popup-${instanceId}`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const effectiveHidden = hidden || Boolean(field?.hidden);
  const effectiveRequired = required || Boolean(field?.required);
  const errorMessage = firstFormError(errors || field?.errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const effectiveHint = hint || field?.hint;
  const describedBy =
    ariaDescribedBy || field?.describedBy || (errorMessage ? errorId : effectiveHint ? hintId : undefined);

  const normalizedVariant = variant === 'outlined' ? 'outline' : variant;
  const hasFloatingLabel =
    floatingLabel ||
    (Boolean(label) && (normalizedVariant === 'outline' || normalizedVariant === 'filled'));

  const rawSource = source ?? nodes ?? null;
  const isRemote = typeof rawSource === 'string' || (rawSource != null && isLookupSource(rawSource));

  // States matching Angular SpTreeCombobox
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [positioned, setPositioned] = useState(false);
  const [panelWidth, setPanelWidth] = useState(0);
  const [loading, setLoading] = useState(false);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [remoteNodes, setRemoteNodes] = useState<TreeComboboxNode[]>([]);
  const [rawItems, setRawItems] = useState<unknown[]>(() =>
    Array.isArray(rawSource) ? [...rawSource] : [],
  );

  const userToggledRef = useRef<Set<string>>(new Set());
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suppressAutoOpenRef = useRef(false);
  const suppressScrollCloseRef = useRef(false);
  const suppressScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerFocusPendingRef = useRef(false);
  const pointerFocusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Local raw nodes normalization
  const localNodes = useMemo(() => {
    if (!Array.isArray(rawSource)) return null;
    return normalizeTreeNodes(rawSource, displayField, valueField, childrenField);
  }, [childrenField, displayField, rawSource, valueField]);

  useEffect(() => {
    if (Array.isArray(rawSource)) {
      setRawItems([...rawSource]);
    }
  }, [rawSource]);

  const allTreeNodes = useMemo(() => {
    return localNodes ?? remoteNodes;
  }, [localNodes, remoteNodes]);

  // Selected values
  const selectedItems = useMemo(() => {
    if (Array.isArray(value)) return [...value];
    if (typeof value === 'string' && value) return [value];
    return [];
  }, [value]);

  const checkedIds = useMemo(() => new Set(selectedItems), [selectedItems]);

  const selectedChips = useMemo(() => {
    return selectedItems.map((val) => {
      const found = findTreeNode(allTreeNodes, val);
      return { value: val, label: found?.label ?? val };
    });
  }, [allTreeNodes, selectedItems]);

  // Floated state for floating label
  const isFloated = useMemo(() => {
    if (!hasFloatingLabel) return false;
    return (
      open ||
      focused ||
      Boolean(query) ||
      (multiple && selectedItems.length > 0)
    );
  }, [focused, hasFloatingLabel, multiple, open, query, selectedItems.length]);

  const inputPlaceholder = useMemo(() => {
    if (multiple && selectedItems.length > 0) return t('search');
    return placeholder ?? t('search');
  }, [multiple, placeholder, selectedItems.length, t]);

  // Expand all when expandAll is true or query is active
  useEffect(() => {
    const q = query.trim();
    if (expandAll || q) {
      const ids = new Set<string>();
      collectAllExpandable(allTreeNodes, ids);
      setExpandedIds(ids);
    }
  }, [allTreeNodes, expandAll, query]);

  // Sync node-level `expanded` properties
  useEffect(() => {
    if (expandAll || query.trim()) return;
    const ids = new Set(expandedIds);
    let changed = false;
    const walk = (list: readonly TreeComboboxNode[]) => {
      for (const n of list) {
        if (n.expanded !== undefined && !userToggledRef.current.has(n.value)) {
          if (n.expanded && !ids.has(n.value)) {
            ids.add(n.value);
            changed = true;
          } else if (!n.expanded && ids.has(n.value)) {
            ids.delete(n.value);
            changed = true;
          }
        }
        if (n.children) walk(n.children);
      }
    };
    walk(allTreeNodes);
    if (changed) {
      setExpandedIds(ids);
    }
  }, [allTreeNodes, expandAll, expandedIds, query]);

  // Sync input query text with value when closed (single mode)
  useEffect(() => {
    if (multiple || open) return;
    const v = typeof value === 'string' ? value : '';
    if (!v) {
      setQuery('');
      return;
    }
    const match = findTreeNode(allTreeNodes, v);
    setQuery(match?.label ?? String(v));
  }, [allTreeNodes, multiple, open, value]);

  // Remote data fetch
  const fetchRemote = useCallback(
    async (searchTerm: string) => {
      if (!isRemote || !rawSource) return;
      setLoading(true);
      try {
        const filterFields = searchFields?.length ? [...searchFields] : [displayField];
        const result = await readLookupPage(rawSource, {
          pageNumber: 1,
          pageSize,
          searchTerm,
          searchFields: filterFields.join(','),
        });
        const items = result.data;
        setRawItems(items);
        setRemoteNodes(normalizeTreeNodes(items, displayField, valueField, childrenField));
      } catch {
        setRemoteNodes([]);
      } finally {
        setLoading(false);
      }
    },
    [childrenField, displayField, isRemote, pageSize, rawSource, searchFields, valueField],
  );

  useEffect(() => {
    if (!isRemote || !open) return;
    if (debounceTimerRef.current !== null) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(
      () => {
        void fetchRemote(query);
      },
      query ? 300 : 0,
    );
    return () => {
      if (debounceTimerRef.current !== null) clearTimeout(debounceTimerRef.current);
    };
  }, [fetchRemote, isRemote, open, query]);

  // Filtered tree nodes
  const filteredTreeNodes = useMemo(() => {
    const q = query.trim();
    if (!q) return allTreeNodes;
    const filterFields = searchFields?.length ? searchFields : [displayField];
    return filterTreeNodes(allTreeNodes, q, filterFields);
  }, [allTreeNodes, displayField, query, searchFields]);

  // Visible flat nodes
  const visibleFlatNodes = useMemo(() => {
    return flattenNodes(filteredTreeNodes, 0, expandedIds);
  }, [expandedIds, filteredTreeNodes]);

  const activeDescendant = useMemo(() => {
    return open && highlightedIndex >= 0 ? `sp-tc-opt-${instanceId}-${highlightedIndex}` : undefined;
  }, [highlightedIndex, instanceId, open]);

  const reposition = useCallback(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;
    const boundary = constrainToModal ? modalBoundary(anchor) : undefined;
    const r = computePosition(anchor, panel, placement, 4, boundary, direction);
    setPos({ top: r.top, left: r.left });
  }, [constrainToModal, direction, placement]);

  const focusTrigger = useCallback(() => {
    const target = anchorRef.current?.querySelector<HTMLElement>('[data-autofocus-target]');
    target?.focus();
  }, []);

  const close = useCallback(() => {
    suppressAutoOpenRef.current = true;
    setTimeout(() => {
      suppressAutoOpenRef.current = false;
    }, 200);

    setOpen(false);
    onOpenChange?.(false);
    suppressScrollCloseRef.current = false;
    if (suppressScrollTimerRef.current !== null) {
      clearTimeout(suppressScrollTimerRef.current);
      suppressScrollTimerRef.current = null;
    }
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    onTouchedChange?.(true);
  }, [onOpenChange, onTouchedChange]);

  const openPanel = useCallback(() => {
    if (effectiveDisabled || effectiveReadOnly) return;
    const anchor = anchorRef.current;
    if (anchor) setPanelWidth(anchor.offsetWidth);

    if (open) {
      requestAnimationFrame(() => {
        reposition();
        setPositioned(true);
      });
      return;
    }

    setPositioned(false);
    setOpen(true);
    onOpenChange?.(true);

    suppressScrollCloseRef.current = true;
    if (suppressScrollTimerRef.current !== null) clearTimeout(suppressScrollTimerRef.current);
    suppressScrollTimerRef.current = setTimeout(() => {
      suppressScrollCloseRef.current = false;
      suppressScrollTimerRef.current = null;
    }, 250);

    requestAnimationFrame(() => {
      reposition();
      setPositioned(true);
    });
  }, [effectiveDisabled, effectiveReadOnly, onOpenChange, open, reposition]);

  // autoOpen prop
  useEffect(() => {
    if (autoOpen && !effectiveDisabled && !effectiveReadOnly) {
      openPanel();
    }
  }, [autoOpen, effectiveDisabled, effectiveReadOnly, openPanel]);

  // Click outside and scroll listeners
  useEffect(() => {
    if (!open) return;

    let cleanupOutside: (() => void) | null = null;
    if (dismissOnClickOutside) {
      const targets: HTMLElement[] = [];
      if (anchorRef.current) targets.push(anchorRef.current);
      if (panelRef.current) targets.push(panelRef.current);
      cleanupOutside = onClickOutside(targets, () => close());
    }

    const scrollParents = anchorRef.current ? getScrollParents(anchorRef.current) : [];
    const onScroll = () => {
      if (suppressScrollCloseRef.current) {
        reposition();
        return;
      }
      if (dismissOnScroll) {
        close();
      } else {
        reposition();
      }
    };

    const pairs: { el: EventTarget; handler: () => void }[] = [];
    for (const p of scrollParents) {
      p.addEventListener('scroll', onScroll, { passive: true });
      pairs.push({ el: p, handler: onScroll });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    pairs.push({ el: window, handler: onScroll });
    window.addEventListener('resize', reposition);

    return () => {
      cleanupOutside?.();
      for (const { el, handler } of pairs) {
        el.removeEventListener('scroll', handler);
      }
      window.removeEventListener('resize', reposition);
    };
  }, [close, dismissOnClickOutside, dismissOnScroll, open, reposition]);

  // Reposition on changes to visibleFlatNodes or loading
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(reposition);
    return () => cancelAnimationFrame(frame);
  }, [open, reposition, visibleFlatNodes.length, loading]);

  const resetPointerFocus = useCallback(() => {
    pointerFocusPendingRef.current = false;
    if (pointerFocusTimerRef.current !== null) {
      clearTimeout(pointerFocusTimerRef.current);
      pointerFocusTimerRef.current = null;
    }
  }, []);

  const onTriggerPointerDown = useCallback(() => {
    pointerFocusPendingRef.current = true;
    if (pointerFocusTimerRef.current !== null) clearTimeout(pointerFocusTimerRef.current);
    pointerFocusTimerRef.current = setTimeout(() => resetPointerFocus(), 1000);
  }, [resetPointerFocus]);

  const onTriggerPointerCancel = useCallback(() => {
    resetPointerFocus();
  }, [resetPointerFocus]);

  const onTriggerClick = useCallback(() => {
    resetPointerFocus();
    openPanel();
  }, [openPanel, resetPointerFocus]);

  const onFocus = useCallback(() => {
    setFocused(true);
    if (suppressAutoOpenRef.current || pointerFocusPendingRef.current) return;
    openPanel();
  }, [openPanel]);

  const onBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
    if (!anchorRef.current?.contains(e.relatedTarget) && !panelRef.current?.contains(e.relatedTarget)) {
      setFocused(false);
    }
  }, []);

  const onQueryChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      openPanel();
      setHighlightedIndex(-1);
    },
    [openPanel],
  );

  const isSelected = useCallback(
    (val: string): boolean => {
      return multiple ? selectedItems.includes(val) : selectedItems[0] === val;
    },
    [multiple, selectedItems],
  );

  const onToggleExpand = useCallback((node: TreeComboboxNode, event: ReactMouseEvent | Event) => {
    event.preventDefault();
    event.stopPropagation();
    userToggledRef.current.add(node.value);
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(node.value)) next.delete(node.value);
      else next.add(node.value);
      return next;
    });
  }, []);

  const toggleCheck = useCallback(
    (node: TreeComboboxNode) => {
      if (node.disabled) return;
      const ids = new Set(checkedIds);
      const wasChecked = isChecked(node, checkedIds, cascadeCheck);

      if (cascadeCheck) {
        setCheckedRecursive(node, !wasChecked, ids);
      } else {
        if (wasChecked) ids.delete(node.value);
        else ids.add(node.value);
      }

      const nextValues = Array.from(ids);
      (onChange as TreeComboboxMultipleProps['onChange'])?.(nextValues);
      const raw = getRawItem(node.value, rawItems, valueField, displayField);
      onSelectedItem?.(raw ?? node);
    },
    [cascadeCheck, checkedIds, displayField, onChange, onSelectedItem, rawItems, valueField],
  );

  const selectNode = useCallback(
    (node: TreeComboboxNode) => {
      const raw = getRawItem(node.value, rawItems, valueField, displayField);
      onSelectedItem?.(raw ?? node);
      (onChange as TreeComboboxSingleProps['onChange'])?.(node.value);
      setQuery(node.label);
      close();
      focusTrigger();
    },
    [close, displayField, focusTrigger, onChange, onSelectedItem, rawItems, valueField],
  );

  const onRowClick = useCallback(
    (node: TreeComboboxNode, event?: ReactMouseEvent | Event) => {
      if (node.disabled) return;
      event?.preventDefault();
      event?.stopPropagation();

      if (multiple) {
        toggleCheck(node);
        return;
      }

      if (expandOnClick && node.children && node.children.length > 0) {
        onToggleExpand(node, event ?? new MouseEvent('click'));
        return;
      }

      selectNode(node);
    },
    [expandOnClick, multiple, onToggleExpand, selectNode, toggleCheck],
  );

  const onCheckboxClick = useCallback(
    (node: TreeComboboxNode, event: ReactMouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      toggleCheck(node);
    },
    [toggleCheck],
  );

  const onClear = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setQuery('');
      if (multiple) {
        (onChange as TreeComboboxMultipleProps['onChange'])?.([]);
      } else {
        (onChange as TreeComboboxSingleProps['onChange'])?.('');
      }
      openPanel();
      focusTrigger();
    },
    [focusTrigger, multiple, onChange, openPanel],
  );

  const onClearAll = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setQuery('');
      (onChange as TreeComboboxMultipleProps['onChange'])?.([]);
      openPanel();
      focusTrigger();
    },
    [focusTrigger, onChange, openPanel],
  );

  const removeItem = useCallback(
    (e: ReactMouseEvent, val: string) => {
      e.preventDefault();
      e.stopPropagation();
      const next = selectedItems.filter((v) => v !== val);
      (onChange as TreeComboboxMultipleProps['onChange'])?.(next);
    },
    [onChange, selectedItems],
  );

  const scrollRowIntoView = useCallback((index: number) => {
    document
      .getElementById(`sp-tc-opt-${instanceId}-${index}`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [instanceId]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (effectiveDisabled || effectiveReadOnly) return;

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          if (!open) {
            openPanel();
            return;
          }
          const next = Math.min(visibleFlatNodes.length - 1, highlightedIndex + 1);
          setHighlightedIndex(next);
          scrollRowIntoView(next);
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          if (!open) {
            openPanel();
            return;
          }
          const prev = Math.max(0, highlightedIndex - 1);
          setHighlightedIndex(prev);
          scrollRowIntoView(prev);
          break;
        }
        case 'ArrowRight': {
          const idx = highlightedIndex >= 0 ? highlightedIndex : 0;
          if (idx >= 0 && idx < visibleFlatNodes.length) {
            setHighlightedIndex(idx);
            const current = visibleFlatNodes[idx];
            if (current.hasChildren) {
              event.preventDefault();
              if (!current.isExpanded) {
                onToggleExpand(current.node, event.nativeEvent);
              } else if (idx + 1 < visibleFlatNodes.length) {
                setHighlightedIndex(idx + 1);
                scrollRowIntoView(idx + 1);
              }
            }
          }
          break;
        }
        case 'ArrowLeft': {
          const idx = highlightedIndex >= 0 ? highlightedIndex : 0;
          if (idx >= 0 && idx < visibleFlatNodes.length) {
            setHighlightedIndex(idx);
            const current = visibleFlatNodes[idx];
            if (current.hasChildren && current.isExpanded) {
              event.preventDefault();
              onToggleExpand(current.node, event.nativeEvent);
            } else if (current.depth > 0) {
              event.preventDefault();
              for (let i = idx - 1; i >= 0; i--) {
                if (visibleFlatNodes[i].depth < current.depth) {
                  setHighlightedIndex(i);
                  scrollRowIntoView(i);
                  break;
                }
              }
            }
          }
          break;
        }
        case 'Enter': {
          event.preventDefault();
          const idx = highlightedIndex >= 0 ? highlightedIndex : 0;
          if (idx >= 0 && idx < visibleFlatNodes.length) {
            onRowClick(visibleFlatNodes[idx].node);
          }
          break;
        }
        case ' ': {
          if (multiple && open) {
            const idx = highlightedIndex >= 0 ? highlightedIndex : 0;
            if (idx >= 0 && idx < visibleFlatNodes.length) {
              event.preventDefault();
              toggleCheck(visibleFlatNodes[idx].node);
            }
          }
          break;
        }
        case 'Backspace': {
          if (multiple && !query && selectedItems.length > 0) {
            const next = selectedItems.slice(0, -1);
            (onChange as TreeComboboxMultipleProps['onChange'])?.(next);
          }
          break;
        }
        case 'Escape': {
          if (open) {
            event.preventDefault();
            event.stopPropagation();
            close();
          }
          break;
        }
        case 'Tab': {
          close();
          break;
        }
      }
    },
    [
      close,
      effectiveDisabled,
      effectiveReadOnly,
      highlightedIndex,
      multiple,
      onChange,
      onRowClick,
      onToggleExpand,
      open,
      openPanel,
      query,
      scrollRowIntoView,
      selectedItems,
      toggleCheck,
      visibleFlatNodes,
    ],
  );

  const rowPaddingLeft = useCallback(
    (depth: number): string => {
      const base = 'var(--sp-density-control-padding-x, 10px)';
      if (showLines) {
        return `calc(${base} + ${depth} * var(--sp-tc-toggle-size, 16px))`;
      }
      return `calc(${base} + ${depth} * var(--sp-tc-indent-step, 18px))`;
    },
    [showLines],
  );

  const guideLeft = useCallback((column: number): string => {
    return `calc(var(--sp-density-control-padding-x, 10px) + ${column} * var(--sp-tc-toggle-size, 16px))`;
  }, []);

  if (effectiveHidden) return null;

  const rootClasses = [
    'sp-tc',
    normalizedVariant === 'outline' && 'sp-tc--outline',
    normalizedVariant === 'filled' && 'sp-tc--filled',
    hasFloatingLabel && 'sp-tc--floating',
    isFloated && 'sp-tc--floated',
    open && 'sp-tc--open',
    effectiveDisabled && 'sp-tc--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div
        ref={anchorRef}
        className={rootClasses}
        dir={direction}
        style={style}
        data-constrain-to-modal={constrainToModal}
      >
        <div className={`sp-tc__input-wrap${multiple ? ' sp-tc__input-wrap--multi' : ''}`}>
          {hasFloatingLabel && (
            <label
              className={[
                'sp-tc__floating-label',
                isFloated && 'sp-tc__floating-label--floated',
                (open || focused) && 'sp-tc__floating-label--focused',
                !multiple && 'sp-tc__floating-label--has-icon',
              ]
                .filter(Boolean)
                .join(' ')}
              htmlFor={inputId}
            >
              {label}
              {effectiveRequired && (
                <span className="sp-tc__required" aria-hidden="true">
                  *
                </span>
              )}
            </label>
          )}

          {multiple &&
            selectedChips.map((chip) => (
              <span className="sp-tc__chip" key={chip.value}>
                {chip.label}
                <span
                  className="sp-tc__chip-remove"
                  role="button"
                  tabIndex={-1}
                  aria-label={t('remove')}
                  onClick={(e) => removeItem(e, chip.value)}
                >
                  <Icon name="x" size={10} />
                </span>
              </span>
            ))}

          {!multiple && (
            <Icon
              name={icon ?? 'search'}
              size={14}
              className="sp-tc__search-icon"
            />
          )}

          <input
            ref={inputRef}
            id={inputId}
            className="sp-tc__input"
            data-autofocus-target
            placeholder={hasFloatingLabel && !isFloated ? '' : inputPlaceholder}
            disabled={effectiveDisabled}
            readOnly={effectiveReadOnly}
            value={query}
            onChange={onQueryChange}
            onPointerDown={onTriggerPointerDown}
            onPointerCancel={onTriggerPointerCancel}
            onClick={onTriggerClick}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={open}
            aria-controls={open ? popupId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={activeDescendant}
            aria-label={ariaLabel || label || undefined}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={describedBy}
            aria-invalid={hasError || undefined}
            aria-required={effectiveRequired || undefined}
            aria-readonly={effectiveReadOnly || undefined}
          />

          {query ? (
            <button
              className="sp-tc__clear"
              type="button"
              tabIndex={-1}
              aria-label={t('clear')}
              onClick={onClear}
            >
              <Icon name="x" size={12} />
            </button>
          ) : multiple && selectedItems.length > 0 ? (
            <button
              className="sp-tc__clear"
              type="button"
              tabIndex={-1}
              aria-label={t('clearAll')}
              onClick={onClearAll}
            >
              <Icon name="x" size={12} />
            </button>
          ) : null}
        </div>

        {errorMessage && (
          <div id={errorId} className="sp-tc__message sp-tc__message--error" role="alert">
            {errorMessage}
          </div>
        )}
        {!errorMessage && effectiveHint && (
          <div id={hintId} className="sp-tc__message">
            {effectiveHint}
          </div>
        )}
      </div>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            id={popupId}
            className="sp-tc__dropdown"
            role="tree"
            aria-multiselectable={multiple || undefined}
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              minWidth: panelWidth,
              zIndex: 1100,
              visibility: positioned ? 'visible' : 'hidden',
            }}
          >
            {loading ? (
              <div className="sp-tc__loading" role="status" aria-live="polite">
                <span className="sp-tc__loading-spinner" aria-hidden="true" />
                <span>{loadingLabel ?? t('loading')}</span>
              </div>
            ) : visibleFlatNodes.length > 0 ? (
              visibleFlatNodes.map((item, i) => {
                const isSel = isSelected(item.node.value);
                const isChk = isChecked(item.node, checkedIds, cascadeCheck);
                const isInd = isIndeterminate(item.node, checkedIds, cascadeCheck);
                const isHigh = i === highlightedIndex;

                return (
                  <div
                    key={item.node.value}
                    id={`sp-tc-opt-${instanceId}-${i}`}
                    className={[
                      'sp-tc__row',
                      isHigh && 'sp-tc__row--highlighted',
                      isSel && 'sp-tc__row--selected',
                      item.node.disabled && 'sp-tc__row--disabled',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    role="treeitem"
                    aria-level={item.depth + 1}
                    aria-expanded={item.hasChildren ? item.isExpanded : undefined}
                    aria-selected={isSel}
                    aria-checked={
                      multiple
                        ? isChk
                          ? 'true'
                          : isInd
                            ? 'mixed'
                            : 'false'
                        : undefined
                    }
                    aria-disabled={item.node.disabled || undefined}
                    style={{ paddingInlineStart: rowPaddingLeft(item.depth) }}
                    onClick={(e) => onRowClick(item.node, e)}
                    onMouseEnter={() => setHighlightedIndex(i)}
                  >
                    {showLines && item.depth > 0 && (
                      <span className="sp-tc__guides" aria-hidden="true">
                        {guideColumns(item).map((col, cIdx) => (
                          <span
                            key={cIdx}
                            className={[
                              'sp-tc__guide',
                              col === 'line' && 'sp-tc__guide--line',
                              col === 'elbow' && 'sp-tc__guide--elbow',
                              col === 'elbow-last' && 'sp-tc__guide--elbow-last',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            style={{ insetInlineStart: guideLeft(cIdx) }}
                          />
                        ))}
                      </span>
                    )}

                    {item.hasChildren ? (
                      <button
                        className={`sp-tc__toggle${item.isExpanded ? ' sp-tc__toggle--expanded' : ''}`}
                        type="button"
                        tabIndex={-1}
                        aria-label={item.isExpanded ? t('collapse') : t('expand')}
                        onClick={(e) => onToggleExpand(item.node, e)}
                      >
                        <Icon name="chevron-right" size={12} />
                      </button>
                    ) : (
                      <span className="sp-tc__toggle-placeholder" aria-hidden="true" />
                    )}

                    {renderOption ? (
                      renderOption({
                        item: getRawItem(item.node.value, rawItems, valueField, displayField),
                        node: item.node,
                        selected: isSel,
                        expanded: item.isExpanded,
                        depth: item.depth,
                      })
                    ) : (
                      <>
                        {multiple && (
                          <span
                            className={[
                              'sp-tc__checkbox',
                              isChk && 'sp-tc__checkbox--checked',
                              isInd && 'sp-tc__checkbox--indeterminate',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            role="checkbox"
                            aria-checked={isChk ? 'true' : isInd ? 'mixed' : 'false'}
                            onClick={(e) => onCheckboxClick(item.node, e)}
                          >
                            {isChk && <Icon name="check" size={10} />}
                          </span>
                        )}

                        {item.node.icon && (
                          <Icon
                            name={item.node.icon}
                            size={14}
                            className="sp-tc__node-icon"
                            aria-hidden="true"
                          />
                        )}

                        <span className="sp-tc__label">{item.node.label}</span>

                        {item.node.badge && (
                          <span className="sp-tc__badge">{item.node.badge}</span>
                        )}

                        {!multiple && isSel && (
                          <Icon name="check" size={14} className="sp-tc__check" />
                        )}
                      </>
                    )}
                  </div>
                );
              })
            ) : query ? (
              renderEmpty ? (
                renderEmpty(query)
              ) : (
                <div className="sp-tc__empty">{emptyLabel ?? t('noResults')}</div>
              )
            ) : null}
          </div>,
          document.body,
        )}
    </>
  );
}
