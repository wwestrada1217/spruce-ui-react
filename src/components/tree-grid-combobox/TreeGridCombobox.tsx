import './TreeGridCombobox.css';
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
  getRawItem,
  guideColumns,
  isChecked,
  isIndeterminate,
  normalizeTreeNodes,
  setCheckedRecursive,
  type TreeComboboxNode,
  type TreeFlatNode,
} from '../tree-combobox/tree-combobox-utils.js';

export interface TreeGridComboboxColumn {
  /** Property key on the option object to display in this column */
  key: string;
  /** Column header label */
  label: string;
  /** CSS width — any valid grid track size (e.g. '200px', '1fr', 'minmax(100px, 1fr)') */
  width?: string;
  /** Whether this specific column can be resized when resizableColumns is enabled. Defaults to true. */
  resizable?: boolean;
  /** Minimum width in pixels when resizing. Defaults to 40. */
  minWidth?: number;
  /** Text alignment */
  align?: 'start' | 'center' | 'end';
}

export interface TreeGridComboboxOption extends TreeComboboxNode {
  /** Child tree-grid options */
  children?: TreeGridComboboxOption[];
  /** Additional properties matching column keys */
  [key: string]: unknown;
}

export type TreeGridFlatOption = TreeFlatNode & {
  opt: TreeGridComboboxOption;
};
export type TreeGridComboboxFlatOption = TreeGridFlatOption;

export interface TreeGridComboboxOptionContext {
  /** The full raw source item. */
  item: unknown;
  /** The normalized row option. */
  opt: TreeGridComboboxOption;
  /** Whether this row is currently selected. */
  selected: boolean;
  /** Whether this row is expanded. */
  expanded: boolean;
  /** Depth level in the tree hierarchy (0 = root). */
  depth: number;
}
export type TreeGridComboboxRenderContext = TreeGridComboboxOptionContext;

export type TreeGridComboboxSource =
  | TreeGridComboboxOption[]
  | unknown[]
  | LookupSource<unknown>
  | string;

export type TreeGridComboboxVariant = 'default' | 'outline' | 'outlined' | 'filled';

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
  renderRow?: (context: TreeGridComboboxOptionContext) => ReactNode;
  renderOption?: (context: TreeGridComboboxOptionContext) => ReactNode;
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

export interface TreeGridComboboxSingleProps extends TreeGridComboboxBaseProps {
  multiple?: false;
  value?: string;
  onChange?: (value: string) => void;
}

export interface TreeGridComboboxMultipleProps extends TreeGridComboboxBaseProps {
  multiple: true;
  value?: readonly string[];
  onChange?: (value: string[]) => void;
}

export type TreeGridComboboxProps =
  | TreeGridComboboxSingleProps
  | TreeGridComboboxMultipleProps;

export function TreeGridCombobox(props: TreeGridComboboxSingleProps): ReactElement | null;
export function TreeGridCombobox(props: TreeGridComboboxMultipleProps): ReactElement | null;
export function TreeGridCombobox(props: TreeGridComboboxProps): ReactElement | null {
  const {
    columns,
    options,
    source,
    value,
    multiple = false,
    onChange,
    onSelectedItem,
    onOpenChange,
    displayField = 'label',
    valueField = 'value',
    childrenField = 'children',
    filterBy = 'label',
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
    resizableColumns = false,
    resizable = false,
    pageSize = 100,
    renderRow,
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
  const inputId = id ?? `sp-tgc-${instanceId}`;
  const popupId = `sp-tgc-popup-${instanceId}`;
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

  const rawSource = source ?? options ?? null;
  const isRemote = typeof rawSource === 'string' || (rawSource != null && isLookupSource(rawSource));
  const isColumnsResizable = resizableColumns || resizable;

  // States matching Angular SpTreeGridCombobox
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [positioned, setPositioned] = useState(false);
  const [panelMinWidth, setPanelMinWidth] = useState(0);
  const [loading, setLoading] = useState(false);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const [remoteOptions, setRemoteOptions] = useState<TreeGridComboboxOption[]>([]);
  const [rawItems, setRawItems] = useState<unknown[]>(() =>
    Array.isArray(rawSource) ? [...rawSource] : [],
  );

  const [customColumnWidths, setCustomColumnWidths] = useState<Record<number, string>>({});
  const [isResizingColumn, setIsResizingColumn] = useState(false);

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
  const activeResizeCleanupRef = useRef<(() => void) | null>(null);

  // Local raw options normalization
  const localOptions = useMemo(() => {
    if (!Array.isArray(rawSource)) return null;
    return normalizeTreeNodes(rawSource, displayField, valueField, childrenField) as TreeGridComboboxOption[];
  }, [childrenField, displayField, rawSource, valueField]);

  useEffect(() => {
    if (Array.isArray(rawSource)) {
      setRawItems([...rawSource]);
    }
  }, [rawSource]);

  const allTreeOptions = useMemo(() => {
    return localOptions ?? remoteOptions;
  }, [localOptions, remoteOptions]);

  // Selected values
  const selectedItems = useMemo(() => {
    if (Array.isArray(value)) return [...value];
    if (typeof value === 'string' && value) return [value];
    return [];
  }, [value]);

  const checkedIds = useMemo(() => new Set(selectedItems), [selectedItems]);

  const selectedChips = useMemo(() => {
    return selectedItems.map((val) => {
      const found = findTreeNode(allTreeOptions, val);
      return { value: val, label: found?.label ?? val };
    });
  }, [allTreeOptions, selectedItems]);

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

  const gridTemplate = useMemo(() => {
    if (columns.length === 0) return '1fr';
    return columns
      .map((col, i) => customColumnWidths[i] ?? col.width ?? '1fr')
      .join(' ');
  }, [columns, customColumnWidths]);

  // Expand all when expandAll is true or query is active
  useEffect(() => {
    const q = query.trim();
    if (expandAll || q) {
      const ids = new Set<string>();
      collectAllExpandable(allTreeOptions, ids);
      setExpandedIds(ids);
    }
  }, [allTreeOptions, expandAll, query]);

  // Sync node-level `expanded` properties
  useEffect(() => {
    if (expandAll || query.trim()) return;
    const ids = new Set(expandedIds);
    let changed = false;
    const walk = (list: readonly TreeGridComboboxOption[]) => {
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
    walk(allTreeOptions);
    if (changed) {
      setExpandedIds(ids);
    }
  }, [allTreeOptions, expandAll, expandedIds, query]);

  // Sync input query text with value when closed (single mode)
  useEffect(() => {
    if (multiple || open) return;
    const v = typeof value === 'string' ? value : '';
    if (!v) {
      setQuery('');
      return;
    }
    const match = findTreeNode(allTreeOptions, v);
    setQuery(match?.label ?? String(v));
  }, [allTreeOptions, multiple, open, value]);

  // Remote data fetch
  const fetchRemote = useCallback(
    async (searchTerm: string) => {
      if (!isRemote || !rawSource) return;
      setLoading(true);
      try {
        const filterFields = searchFields?.length
          ? [...searchFields]
          : Array.isArray(filterBy)
            ? [...filterBy]
            : [filterBy];
        const result = await readLookupPage(rawSource, {
          pageNumber: 1,
          pageSize,
          searchTerm,
          searchFields: filterFields.join(','),
        });
        const items = result.data;
        setRawItems(items);
        setRemoteOptions(
          normalizeTreeNodes(items, displayField, valueField, childrenField) as TreeGridComboboxOption[],
        );
      } catch {
        setRemoteOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [childrenField, displayField, filterBy, isRemote, pageSize, rawSource, searchFields, valueField],
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

  // Filtered options
  const filterKeys = useMemo(() => {
    if (searchFields && searchFields.length > 0) return searchFields;
    return Array.isArray(filterBy) ? filterBy : [filterBy];
  }, [filterBy, searchFields]);

  const filteredTreeOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allTreeOptions;

    const filterTree = (nodes: readonly TreeGridComboboxOption[]): TreeGridComboboxOption[] => {
      const result: TreeGridComboboxOption[] = [];
      for (const node of nodes) {
        const matches =
          filterKeys.some((k) =>
            String(node[k] ?? '')
              .toLowerCase()
              .includes(q),
          ) || node.label.toLowerCase().includes(q);

        const filteredChildren = node.children ? filterTree(node.children) : [];
        if (matches || filteredChildren.length > 0) {
          result.push({
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children,
          });
        }
      }
      return result;
    };

    return filterTree(allTreeOptions);
  }, [allTreeOptions, filterKeys, query]);

  // Visible flat options
  const visibleFlatOptions = useMemo(() => {
    const flat = flattenNodes(filteredTreeOptions, 0, expandedIds);
    return flat.map((f) => ({
      ...f,
      opt: f.node as TreeGridComboboxOption,
    }));
  }, [expandedIds, filteredTreeOptions]);

  const activeDescendant = useMemo(() => {
    return open && highlightedIndex >= 0 ? `sp-tgc-opt-${instanceId}-${highlightedIndex}` : undefined;
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

    activeResizeCleanupRef.current?.();
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
    if (anchor) setPanelMinWidth(anchor.offsetWidth);

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

  // Reposition on changes to visibleFlatOptions or loading
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(reposition);
    return () => cancelAnimationFrame(frame);
  }, [open, reposition, visibleFlatOptions.length, loading]);

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

  const onToggleExpand = useCallback((opt: TreeGridComboboxOption, event: ReactMouseEvent | Event) => {
    event.preventDefault();
    event.stopPropagation();
    userToggledRef.current.add(opt.value);
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(opt.value)) next.delete(opt.value);
      else next.add(opt.value);
      return next;
    });
  }, []);

  const toggleCheck = useCallback(
    (opt: TreeGridComboboxOption) => {
      if (opt.disabled) return;
      const ids = new Set(checkedIds);
      const wasChecked = isChecked(opt, checkedIds, cascadeCheck);

      if (cascadeCheck) {
        setCheckedRecursive(opt, !wasChecked, ids);
      } else {
        if (wasChecked) ids.delete(opt.value);
        else ids.add(opt.value);
      }

      const nextValues = Array.from(ids);
      (onChange as TreeGridComboboxMultipleProps['onChange'])?.(nextValues);
      const raw = getRawItem(opt.value, rawItems, valueField, displayField);
      onSelectedItem?.(raw ?? opt);
    },
    [cascadeCheck, checkedIds, displayField, onChange, onSelectedItem, rawItems, valueField],
  );

  const selectOption = useCallback(
    (opt: TreeGridComboboxOption) => {
      const raw = getRawItem(opt.value, rawItems, valueField, displayField);
      onSelectedItem?.(raw ?? opt);
      (onChange as TreeGridComboboxSingleProps['onChange'])?.(opt.value);
      setQuery(opt.label);
      close();
      focusTrigger();
    },
    [close, displayField, focusTrigger, onChange, onSelectedItem, rawItems, valueField],
  );

  const onRowClick = useCallback(
    (opt: TreeGridComboboxOption, event?: ReactMouseEvent | Event) => {
      if (opt.disabled) return;
      event?.preventDefault();
      event?.stopPropagation();

      if (multiple) {
        toggleCheck(opt);
        return;
      }

      if (expandOnClick && opt.children && opt.children.length > 0) {
        onToggleExpand(opt, event ?? new MouseEvent('click'));
        return;
      }

      selectOption(opt);
    },
    [expandOnClick, multiple, onToggleExpand, selectOption, toggleCheck],
  );

  const onCheckboxClick = useCallback(
    (opt: TreeGridComboboxOption, event: ReactMouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      toggleCheck(opt);
    },
    [toggleCheck],
  );

  const onClear = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setQuery('');
      if (multiple) {
        (onChange as TreeGridComboboxMultipleProps['onChange'])?.([]);
      } else {
        (onChange as TreeGridComboboxSingleProps['onChange'])?.('');
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
      (onChange as TreeGridComboboxMultipleProps['onChange'])?.([]);
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
      (onChange as TreeGridComboboxMultipleProps['onChange'])?.(next);
    },
    [onChange, selectedItems],
  );

  const scrollRowIntoView = useCallback((index: number) => {
    document
      .getElementById(`sp-tgc-opt-${instanceId}-${index}`)
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
          const next = Math.min(visibleFlatOptions.length - 1, highlightedIndex + 1);
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
          if (idx >= 0 && idx < visibleFlatOptions.length) {
            setHighlightedIndex(idx);
            const current = visibleFlatOptions[idx];
            if (current.hasChildren) {
              event.preventDefault();
              if (!current.isExpanded) {
                onToggleExpand(current.opt, event.nativeEvent);
              } else if (idx + 1 < visibleFlatOptions.length) {
                setHighlightedIndex(idx + 1);
                scrollRowIntoView(idx + 1);
              }
            }
          }
          break;
        }
        case 'ArrowLeft': {
          const idx = highlightedIndex >= 0 ? highlightedIndex : 0;
          if (idx >= 0 && idx < visibleFlatOptions.length) {
            setHighlightedIndex(idx);
            const current = visibleFlatOptions[idx];
            if (current.hasChildren && current.isExpanded) {
              event.preventDefault();
              onToggleExpand(current.opt, event.nativeEvent);
            } else if (current.depth > 0) {
              event.preventDefault();
              for (let i = idx - 1; i >= 0; i--) {
                if (visibleFlatOptions[i].depth < current.depth) {
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
          if (idx >= 0 && idx < visibleFlatOptions.length) {
            onRowClick(visibleFlatOptions[idx].opt);
          }
          break;
        }
        case ' ': {
          if (multiple && open) {
            const idx = highlightedIndex >= 0 ? highlightedIndex : 0;
            if (idx >= 0 && idx < visibleFlatOptions.length) {
              event.preventDefault();
              toggleCheck(visibleFlatOptions[idx].opt);
            }
          }
          break;
        }
        case 'Backspace': {
          if (multiple && !query && selectedItems.length > 0) {
            const next = selectedItems.slice(0, -1);
            (onChange as TreeGridComboboxMultipleProps['onChange'])?.(next);
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
      visibleFlatOptions,
    ],
  );

  const onResizeStart = useCallback(
    (event: ReactMouseEvent, columnIndex: number) => {
      event.preventDefault();
      event.stopPropagation();

      const headerCell = (event.target as HTMLElement).closest('.sp-tgc__header-cell') as HTMLElement;
      if (!headerCell) return;

      const startX = event.clientX;
      const startWidth = headerCell.getBoundingClientRect().width;
      setIsResizingColumn(true);

      const onMouseMove = (moveEvent: MouseEvent) => {
        moveEvent.preventDefault();
        const deltaX = direction === 'rtl' ? startX - moveEvent.clientX : moveEvent.clientX - startX;
        const minW = columns[columnIndex]?.minWidth ?? 40;
        const newWidth = Math.max(minW, Math.round(startWidth + deltaX));
        setCustomColumnWidths((prev) => ({
          ...prev,
          [columnIndex]: `${newWidth}px`,
        }));
      };

      const cleanup = () => {
        setIsResizingColumn(false);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', cleanup);
        activeResizeCleanupRef.current = null;
      };

      activeResizeCleanupRef.current = cleanup;
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', cleanup);
    },
    [columns, direction],
  );

  const rowPaddingLeft = useCallback(
    (depth: number): string => {
      const base = '0px';
      if (showLines) {
        return `calc(${base} + ${depth} * var(--sp-tgc-toggle-size, 16px))`;
      }
      return `calc(${base} + ${depth} * var(--sp-tgc-indent-step, 18px))`;
    },
    [showLines],
  );

  const guideLeft = useCallback((column: number): string => {
    return `${column * 16}px`;
  }, []);

  const cellValue = useCallback((opt: TreeGridComboboxOption, key: string): string => {
    const v = opt[key];
    return v == null ? '' : String(v);
  }, []);

  if (effectiveHidden) return null;

  const rootClasses = [
    'sp-tgc',
    normalizedVariant === 'outline' && 'sp-tgc--outline',
    normalizedVariant === 'filled' && 'sp-tgc--filled',
    hasFloatingLabel && 'sp-tgc--floating',
    isFloated && 'sp-tgc--floated',
    open && 'sp-tgc--open',
    effectiveDisabled && 'sp-tgc--disabled',
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
        <div className={`sp-tgc__input-wrap${multiple ? ' sp-tgc__input-wrap--multi' : ''}`}>
          {hasFloatingLabel && (
            <label
              className={[
                'sp-tgc__floating-label',
                isFloated && 'sp-tgc__floating-label--floated',
                (open || focused) && 'sp-tgc__floating-label--focused',
                !multiple && 'sp-tgc__floating-label--has-icon',
              ]
                .filter(Boolean)
                .join(' ')}
              htmlFor={inputId}
            >
              {label}
              {effectiveRequired && (
                <span className="sp-tgc__required" aria-hidden="true">
                  *
                </span>
              )}
            </label>
          )}

          {multiple &&
            selectedChips.map((chip) => (
              <span className="sp-tgc__chip" key={chip.value}>
                {chip.label}
                <span
                  className="sp-tgc__chip-remove"
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
              className="sp-tgc__search-icon"
            />
          )}

          <input
            ref={inputRef}
            id={inputId}
            className="sp-tgc__input"
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
              className="sp-tgc__clear"
              type="button"
              tabIndex={-1}
              aria-label={t('clear')}
              onClick={onClear}
            >
              <Icon name="x" size={12} />
            </button>
          ) : multiple && selectedItems.length > 0 ? (
            <button
              className="sp-tgc__clear"
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
          <div id={errorId} className="sp-tgc__message sp-tgc__message--error" role="alert">
            {errorMessage}
          </div>
        )}
        {!errorMessage && effectiveHint && (
          <div id={hintId} className="sp-tgc__message">
            {effectiveHint}
          </div>
        )}
      </div>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            id={popupId}
            className="sp-tgc__dropdown"
            role="treegrid"
            aria-multiselectable={multiple || undefined}
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              minWidth: panelMinWidth,
              zIndex: 1100,
              visibility: positioned ? 'visible' : 'hidden',
            }}
          >
            {/* Sticky Column Headers */}
            <div
              role="row"
              className="sp-tgc__header"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              {columns.map((col, idx) => {
                const isLast = idx === columns.length - 1;
                return (
                  <div
                    key={col.key}
                    role="columnheader"
                    className={[
                      'sp-tgc__header-cell',
                      col.align === 'center' && 'sp-tgc__header-cell--center',
                      col.align === 'end' && 'sp-tgc__header-cell--end',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <span className="sp-tgc__header-text">{col.label}</span>
                    {isColumnsResizable && col.resizable !== false && !isLast && (
                      <button
                        type="button"
                        className={[
                          'sp-tgc__resizer',
                          isResizingColumn && 'sp-tgc__resizer--resizing',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        aria-label={t('resizeColumn', { column: col.label })}
                        onMouseDown={(e) => onResizeStart(e, idx)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="sp-tgc__resizer-indicator" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tree Grid Rows */}
            {loading ? (
              <div className="sp-tgc__loading" role="status" aria-live="polite">
                <span className="sp-tgc__loading-spinner" aria-hidden="true" />
                <span>{loadingLabel ?? t('loading')}</span>
              </div>
            ) : visibleFlatOptions.length > 0 ? (
              visibleFlatOptions.map((item, i) => {
                const isSel = isSelected(item.opt.value);
                const isChk = isChecked(item.opt, checkedIds, cascadeCheck);
                const isInd = isIndeterminate(item.opt, checkedIds, cascadeCheck);
                const isHigh = i === highlightedIndex;

                const context: TreeGridComboboxOptionContext = {
                  item: getRawItem(item.opt.value, rawItems, valueField, displayField),
                  opt: item.opt,
                  selected: isSel,
                  expanded: item.isExpanded,
                  depth: item.depth,
                };

                return (
                  <div
                    key={item.opt.value}
                    id={`sp-tgc-opt-${instanceId}-${i}`}
                    role="row"
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
                    aria-disabled={item.opt.disabled || undefined}
                    className={[
                      'sp-tgc__row',
                      isHigh && 'sp-tgc__row--highlighted',
                      isSel && 'sp-tgc__row--selected',
                      item.opt.disabled && 'sp-tgc__row--disabled',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{ gridTemplateColumns: gridTemplate }}
                    onClick={(e) => onRowClick(item.opt, e)}
                    onMouseEnter={() => setHighlightedIndex(i)}
                  >
                    {renderRow ? (
                      renderRow(context)
                    ) : renderOption ? (
                      renderOption(context)
                    ) : (
                      columns.map((col, colIdx) => {
                        if (colIdx === 0) {
                          return (
                            <div
                              key={col.key}
                              role="gridcell"
                              className="sp-tgc__cell sp-tgc__cell--tree"
                              style={{ paddingInlineStart: rowPaddingLeft(item.depth) }}
                            >
                              {showLines && item.depth > 0 && (
                                <span className="sp-tgc__guides" aria-hidden="true">
                                  {guideColumns(item).map((guide, gIdx) => (
                                    <span
                                      key={gIdx}
                                      className={[
                                        'sp-tgc__guide',
                                        guide === 'line' && 'sp-tgc__guide--line',
                                        guide === 'elbow' && 'sp-tgc__guide--elbow',
                                        guide === 'elbow-last' &&
                                          'sp-tgc__guide--elbow-last',
                                      ]
                                        .filter(Boolean)
                                        .join(' ')}
                                      style={{ insetInlineStart: guideLeft(gIdx) }}
                                    />
                                  ))}
                                </span>
                              )}

                              {item.hasChildren ? (
                                <button
                                  className={`sp-tgc__toggle${item.isExpanded ? ' sp-tgc__toggle--expanded' : ''}`}
                                  type="button"
                                  tabIndex={-1}
                                  aria-label={
                                    item.isExpanded ? t('collapse') : t('expand')
                                  }
                                  onClick={(e) => onToggleExpand(item.opt, e)}
                                >
                                  <Icon name="chevron-right" size={12} />
                                </button>
                              ) : (
                                <span
                                  className="sp-tgc__toggle-placeholder"
                                  aria-hidden="true"
                                />
                              )}

                              {multiple && (
                                <span
                                  className={[
                                    'sp-tgc__checkbox',
                                    isChk && 'sp-tgc__checkbox--checked',
                                    isInd && 'sp-tgc__checkbox--indeterminate',
                                  ]
                                    .filter(Boolean)
                                    .join(' ')}
                                  role="checkbox"
                                  aria-checked={isChk ? 'true' : isInd ? 'mixed' : 'false'}
                                  onClick={(e) => onCheckboxClick(item.opt, e)}
                                >
                                  {isChk && <Icon name="check" size={10} />}
                                </span>
                              )}

                              {item.opt.icon && (
                                <Icon
                                  name={item.opt.icon}
                                  size={14}
                                  className="sp-tgc__node-icon"
                                  aria-hidden="true"
                                />
                              )}

                              <span className="sp-tgc__cell-value">
                                {cellValue(item.opt, col.key)}
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={col.key}
                            role="gridcell"
                            className={[
                              'sp-tgc__cell',
                              col.align === 'center' && 'sp-tgc__cell--center',
                              col.align === 'end' && 'sp-tgc__cell--end',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            <span className="sp-tgc__cell-value">
                              {cellValue(item.opt, col.key)}
                            </span>
                          </div>
                        );
                      })
                    )}

                    {!multiple && isSel && (
                      <Icon name="check" size={14} className="sp-tgc__check" />
                    )}
                  </div>
                );
              })
            ) : query ? (
              renderEmpty ? (
                renderEmpty(query)
              ) : (
                <div className="sp-tgc__empty">{emptyLabel ?? t('noResults')}</div>
              )
            ) : null}
          </div>,
          document.body,
        )}
    </>
  );
}
