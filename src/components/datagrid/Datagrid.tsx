/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon } from '../../icons/Icon';
import { Popover } from '../popover/Popover';
import { CellEditor } from './CellEditor';
import { ColumnPanel } from './ColumnPanel';
import { GridColumnFilter } from './GridColumnFilter';
import { useI18n } from '../../i18n/i18n-context.js';
import {
  type ColumnDef,
  type ColumnFilter,
  type ColumnGroupSpan,
  type ColumnState,
  type DisplayRow,
  type DisplayRowKind,
  type GridDensity,
  type GridOptions,
  type GroupRowMeta,
  type PaginationState,
  type PinPosition,
  type ServerSideParams,
  type SortDirection,
  type SortEntry,
  type CellEditEvent,
  type CellEditorConfig,
  type RowEditEvent,
  DEFAULT_DENSITY,
  DEFAULT_OVERSCAN,
  DENSITY_METRICS,
  NEW_ROW_ID,
} from './grid-types';
import {
  applyFilters,
  buildColumnState,
  computeAggregate,
  getCellValue,
  sortRows,
  sortMultiRows,
} from './grid-utils';
import './Datagrid.css';

// ── Helpers ──────────────────────────────────────────────────────────────────

function rowId<T>(row: T): unknown {
  return (row as Record<string, unknown>)['id'] ?? row;
}

function applyValueToRow<T>(row: T, field: string, value: unknown): T {
  const parts = field.split('.');
  if (parts.length === 1) return { ...(row as object), [field]: value } as T;
  const clone: Record<string, unknown> = { ...(row as object) };
  let cursor: Record<string, unknown> = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    cursor[parts[i]] = { ...(cursor[parts[i]] as object) };
    cursor = cursor[parts[i]] as Record<string, unknown>;
  }
  cursor[parts[parts.length - 1]] = value;
  return clone as T;
}

type RowDraft<T> = Map<string, { oldValue: unknown; newValue: unknown; row: T }>;

// ── Component ────────────────────────────────────────────────────────────────

export interface DatagridProps<T = unknown> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  columns: ColumnDef<T>[];
  rowData?: T[];
  options?: GridOptions<T>;
  /** Automatically adjust row height to fit cell content without clipping. */
  autoRowHeight?: boolean;
  /** Alias for autoRowHeight. Automatically adjust row height to fit cell content. */
  autoHeightRow?: boolean;
}

export function Datagrid<T = unknown>({
  columns,
  rowData = [],
  options = {},
  autoRowHeight,
  autoHeightRow,
  className,
  ...rest
}: DatagridProps<T>) {
  const { t } = useI18n();
  const opts = options;
  const density: GridDensity = opts.density ?? DEFAULT_DENSITY;
  const metrics = DENSITY_METRICS[density];

  // ── Refs ──────────────────────────────────────────────────────────────────
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Core state ────────────────────────────────────────────────────────────
  const [columnStates, setColumnStates] = useState<ColumnState[]>(() =>
    buildColumnState(columns),
  );
  const [sortColumns, setSortColumns] = useState<SortEntry[]>([]);
  const [loading, setLoading] = useState(opts.loading ?? false);
  const [selectedIds, setSelectedIds] = useState<Set<unknown>>(new Set());
  const lastSelIdxRef = useRef(-1);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(500);

  // ── Edit state ────────────────────────────────────────────────────────────
  const [activeCellEdit, setActiveCellEdit] = useState<{
    rowId: unknown;
    field: string;
    triggerKey: string | null;
  } | null>(null);
  const [activeEditRowId, setActiveEditRowId] = useState<unknown | null>(null);
  const rowDraftsRef = useRef(new Map<unknown, RowDraft<T>>());
  const [editedRows, setEditedRows] = useState<Map<unknown, T>>(new Map());

  // ── New row state ──────────────────────────────────────────────────────────
  const [newRowDraft, setNewRowDraft] = useState<Record<string, unknown>>({});
  const [newRowField, setNewRowField] = useState<string | null>(null);
  const [newRowTriggerKey, setNewRowTriggerKey] = useState<string | null>(null);
  const [newRowActive, setNewRowActive] = useState(false);

  // ── Filter state ──────────────────────────────────────────────────────────
  const [activeFilters, setActiveFilters] = useState<Record<string, ColumnFilter>>({});

  // ── Pagination state ──────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSizeOverride, setPageSizeOverride] = useState<number | null>(null);
  const [serverTotal, setServerTotal] = useState(0);

  // ── Row drag state ────────────────────────────────────────────────────────
  const [dragRowIdx, setDragRowIdx] = useState<number | null>(null);
  const [dropRowIdx, setDropRowIdx] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<'above' | 'below'>('below');
  const [rowDragGhostY, setRowDragGhostY] = useState<number | null>(null);
  const [localRowOrder, setLocalRowOrder] = useState<T[]>([]);

  // ── Grouping / Tree / Detail state ────────────────────────────────────────
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [expandedTreeIds, setExpandedTreeIds] = useState<Set<unknown>>(new Set());
  const [openDetailIds, setOpenDetailIds] = useState<Set<unknown>>(new Set());

  // ── Column panel / Header drag state ──────────────────────────────────────
  const [columnPanelOpen, setColumnPanelOpen] = useState(false);
  const [hdrDragSrc, setHdrDragSrc] = useState<string | null>(null);
  const [hdrDragOver, setHdrDragOver] = useState<string | null>(null);
  const [hdrDragOverPos, setHdrDragOverPos] = useState<'left' | 'right'>('right');

  // ── Infinite scroll ───────────────────────────────────────────────────────
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const [infiniteExhausted, setInfiniteExhausted] = useState(false);

  // ── Column map ────────────────────────────────────────────────────────────
  const columnMap = useMemo(() => {
    const m = new Map<string, ColumnDef<T>>();
    columns.forEach((c) => m.set(c.field, c));
    return m;
  }, [columns]);

  // ── Sync columns when prop changes ────────────────────────────────────────
  useEffect(() => {
    setColumnStates((prev) => {
      if (prev.length === 0) return buildColumnState(columns);
      const existingMap = new Map(prev.map((s) => [s.field, s]));
      return columns.map(
        (col, i) =>
          existingMap.get(col.field) ?? {
            field: col.field,
            width: col.width ?? 150,
            visible: col.visible ?? true,
            sortDirection: null as SortDirection,
            order: i,
            pinned: col.pinned ?? null,
          },
      );
    });
  }, [columns]);

  // ── Sync loading from opts ────────────────────────────────────────────────
  useEffect(() => {
    setLoading(opts.loading ?? false);
  }, [opts.loading]);

  // ── Scroll + Resize ───────────────────────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrollTop(el.scrollTop);
        setViewportHeight(el.clientHeight);
        if (opts.infiniteScroll && !infiniteLoading && !infiniteExhausted) {
          const threshold = opts.infiniteScrollThreshold ?? 120;
          const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
          if (distFromBottom <= threshold) {
            triggerLoadMore();
          }
        }
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(() => setViewportHeight(el.clientHeight));
    ro.observe(el);
    setViewportHeight(el.clientHeight);
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [opts.infiniteScroll, infiniteLoading, infiniteExhausted]);

  // ── Computed: ordered visible columns ─────────────────────────────────────
  const orderedVisible = useMemo(
    () =>
      [...columnStates]
        .filter((s) => s.visible)
        .sort((a, b) => a.order - b.order)
        .map((s) => columnMap.get(s.field)!)
        .filter(Boolean),
    [columnStates, columnMap],
  );

  const getColPin = useCallback(
    (col: ColumnDef<T>): PinPosition =>
      columnStates.find((s) => s.field === col.field)?.pinned ?? col.pinned ?? null,
    [columnStates],
  );

  const leftPinnedCols = useMemo(
    () => orderedVisible.filter((c) => getColPin(c) === 'left'),
    [orderedVisible, getColPin],
  );
  const centerCols = useMemo(
    () => orderedVisible.filter((c) => !getColPin(c)),
    [orderedVisible, getColPin],
  );
  const rightPinnedCols = useMemo(
    () => orderedVisible.filter((c) => getColPin(c) === 'right'),
    [orderedVisible, getColPin],
  );
  const visibleColumns = useMemo(
    () => [...leftPinnedCols, ...centerCols, ...rightPinnedCols],
    [leftPinnedCols, centerCols, rightPinnedCols],
  );

  const getColWidth = useCallback(
    (col: ColumnDef<T>): number =>
      columnStates.find((s) => s.field === col.field)?.width ?? col.width ?? 150,
    [columnStates],
  );

  const hasPinnedLeft = leftPinnedCols.length > 0;
  const hasPinnedRight = rightPinnedCols.length > 0;
  const leftPinnedWidth = leftPinnedCols.reduce((w, c) => w + getColWidth(c), 0);
  const rightPinnedWidth = rightPinnedCols.reduce((w, c) => w + getColWidth(c), 0);

  // ── Computed: metrics ─────────────────────────────────────────────────────
  const rowHeight = opts.rowHeight ?? metrics.rowHeight;
  const headerHeight = opts.headerHeight ?? metrics.headerHeight;
  const isAutoRowHeight = !!(opts.autoRowHeight || opts.autoHeightRow || autoRowHeight || autoHeightRow);
  const fixedRowHeight = isAutoRowHeight ? null : rowHeight;
  const showToolbar = opts.showToolbar ?? false;
  const hasExpandColumn = !!(opts.treeChildrenField || opts.detailRenderer);
  const hasInlineFilters = visibleColumns.some(
    (col) => col.filterable && (col.filterMode ?? opts.filterMode ?? 'popover') === 'inline',
  );
  const hasAggregates =
    opts.showAggregates === true && visibleColumns.some((c) => c.aggregate != null);
  const hasGroupedHeaders = visibleColumns.some((c) => !!c.headerGroup);

  // ── Selection computed ────────────────────────────────────────────────────
  const pageSize = pageSizeOverride ?? opts.pageSize ?? 50;

  // ── Merged rows (with local edits + drag reorder) ─────────────────────────
  const mergedRows = useMemo(() => {
    const base = localRowOrder.length > 0 ? localRowOrder : rowData;
    if (editedRows.size === 0) return base;
    return base.map((r) => {
      const id = rowId(r);
      return editedRows.has(id) ? editedRows.get(id)! : r;
    });
  }, [rowData, localRowOrder, editedRows]);

  // ── Sorted + Filtered ─────────────────────────────────────────────────────
  const filteredSortedRows = useMemo(() => {
    const sorts = sortColumns;
    let sorted: T[];
    if (sorts.length <= 1) {
      const field = sorts[0]?.field ?? '';
      const dir = sorts[0]?.direction ?? null;
      const col = field ? columnMap.get(field) : null;
      sorted = sortRows(mergedRows, field, dir, col?.comparator);
    } else {
      const comparators = new Map<
        string,
        (a: unknown, b: unknown, rowA: T, rowB: T) => number
      >();
      for (const s of sorts) {
        const col = columnMap.get(s.field);
        if (col?.comparator) comparators.set(s.field, col.comparator);
      }
      sorted = sortMultiRows(
        mergedRows,
        sorts,
        comparators.size > 0 ? comparators : undefined,
      );
    }
    return applyFilters(sorted, activeFilters);
  }, [mergedRows, sortColumns, activeFilters, columnMap]);

  // ── Paged rows ────────────────────────────────────────────────────────────
  const pagedRows = useMemo(() => {
    if (!opts.pagination || opts.serverSide) return filteredSortedRows;
    const p = currentPage;
    return filteredSortedRows.slice((p - 1) * pageSize, p * pageSize);
  }, [filteredSortedRows, opts.pagination, opts.serverSide, currentPage, pageSize]);

  const sortedRows = pagedRows;
  const totalRows = opts.serverSide ? serverTotal : filteredSortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  // ── Selection computed ────────────────────────────────────────────────────
  const allSelected =
    sortedRows.length > 0 && sortedRows.every((r) => selectedIds.has(rowId(r)));
  const someSelected =
    sortedRows.some((r) => selectedIds.has(rowId(r))) && !allSelected;
  const activeFilterCount = Object.keys(activeFilters).length;

  // ── Display rows ──────────────────────────────────────────────────────────
  const displayRows = useMemo((): DisplayRow<T>[] => {
    const groupBy = opts.groupByField;
    const treeField = opts.treeChildrenField;
    let result: DisplayRow<T>[];

    if (groupBy) {
      result = buildGroupedRows(sortedRows, groupBy);
    } else if (treeField) {
      result = buildTreeRows(sortedRows, treeField, 0);
    } else {
      result = sortedRows.map((data, i) => makeDataRow(data, i, 0, false));
    }

    // Inject detail rows
    if (opts.detailRenderer && openDetailIds.size > 0) {
      result = injectDetailRows(result);
    }

    // Inject new-row sentinel
    if (opts.newRowPosition && opts.editMode) {
      const sentinel: DisplayRow<T> = {
        kind: 'new-row',
        data: {} as T,
        absIdx: 0,
        depth: 0,
        hasChildren: false,
        expanded: false,
        treeId: NEW_ROW_ID,
        isGroup: false,
      };
      if (opts.newRowPosition === 'top') {
        result = [sentinel, ...result].map((r, i) => ({ ...r, absIdx: i }));
      } else {
        result = [...result, sentinel].map((r, i) => ({ ...r, absIdx: i }));
      }
    }

    return result;
  }, [
    sortedRows,
    opts.groupByField,
    opts.treeChildrenField,
    opts.detailRenderer,
    opts.newRowPosition,
    opts.editMode,
    openDetailIds,
    collapsedGroups,
    expandedTreeIds,
  ]);

  // ── Virtual scroll ────────────────────────────────────────────────────────
  const vsStart = useMemo(() => {
    if (!opts.virtualScroll) return 0;
    const overscan = opts.overscanCount ?? DEFAULT_OVERSCAN;
    return Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  }, [opts.virtualScroll, scrollTop, rowHeight, opts.overscanCount]);

  const vsEnd = useMemo(() => {
    const len = displayRows.length;
    if (!opts.virtualScroll) return len;
    const overscan = opts.overscanCount ?? DEFAULT_OVERSCAN;
    return Math.min(len, Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan);
  }, [opts.virtualScroll, displayRows.length, scrollTop, viewportHeight, rowHeight, opts.overscanCount]);

  const renderedRows = useMemo(
    () => displayRows.slice(vsStart, vsEnd),
    [displayRows, vsStart, vsEnd],
  );
  const virtualOffset = opts.virtualScroll ? vsStart * rowHeight : 0;
  const virtualTotalHeight = opts.virtualScroll ? displayRows.length * rowHeight : null;

  // ── Total columns width ───────────────────────────────────────────────────
  const totalColumnsWidth = useMemo(() => {
    let w = opts.selectionMode && opts.selectionMode !== 'none' ? 44 : 0;
    if (opts.editMode === 'row') w += 80;
    if (opts.rowDraggable) w += 36;
    if (hasExpandColumn) w += 36;
    visibleColumns.forEach((col) => {
      w += getColWidth(col);
    });
    return w;
  }, [visibleColumns, getColWidth, opts.selectionMode, opts.editMode, opts.rowDraggable, hasExpandColumn]);

  // ── Control column offsets for pinning ────────────────────────────────────
  const shouldPinControls = opts.pinControlColumns === true;
  const ctrlColLeftExpand = shouldPinControls ? 0 : null;
  const ctrlColLeftDrag = shouldPinControls ? (hasExpandColumn ? 36 : 0) : null;
  const ctrlColLeftActions = useMemo(() => {
    if (!shouldPinControls) return null;
    let o = 0;
    if (hasExpandColumn) o += 36;
    if (opts.rowDraggable) o += 36;
    return o;
  }, [shouldPinControls, hasExpandColumn, opts.rowDraggable]);
  const ctrlColLeftCheckbox = useMemo(() => {
    if (!shouldPinControls) return null;
    let o = 0;
    if (hasExpandColumn) o += 36;
    if (opts.rowDraggable) o += 36;
    if (opts.editMode === 'row') o += 80;
    return o;
  }, [shouldPinControls, hasExpandColumn, opts.rowDraggable, opts.editMode]);

  const controlColsWidth = useMemo(() => {
    let w = 0;
    if (hasExpandColumn) w += 36;
    if (opts.rowDraggable) w += 36;
    if (opts.editMode === 'row') w += 80;
    if (opts.selectionMode && opts.selectionMode !== 'none') w += 44;
    return w;
  }, [hasExpandColumn, opts.rowDraggable, opts.editMode, opts.selectionMode]);

  // ── Pinned left/right offset calculator ───────────────────────────────────
  const getPinnedLeft = useCallback(
    (col: ColumnDef<T>): number | null => {
      const pin = getColPin(col);
      if (pin === 'left') {
        let offset = controlColsWidth;
        for (const c of leftPinnedCols) {
          if (c.field === col.field) break;
          offset += getColWidth(c);
        }
        return offset;
      }
      return null;
    },
    [getColPin, controlColsWidth, leftPinnedCols, getColWidth],
  );

  const getPinnedRight = useCallback(
    (col: ColumnDef<T>): number | null => {
      const pin = getColPin(col);
      if (pin === 'right') {
        let offset = 0;
        for (const c of [...rightPinnedCols].reverse()) {
          if (c.field === col.field) break;
          offset += getColWidth(c);
        }
        return offset;
      }
      return null;
    },
    [getColPin, rightPinnedCols, getColWidth],
  );

  // ── Group header spans ────────────────────────────────────────────────────
  const buildGroupSpans = useCallback(
    (cols: ColumnDef<T>[]): ColumnGroupSpan<T>[] => {
      if (!cols.length) return [];
      const spans: ColumnGroupSpan<T>[] = [];
      let i = 0;
      while (i < cols.length) {
        const col = cols[i];
        const grp = col.headerGroup ?? null;
        if (!grp) {
          spans.push({
            groupName: null,
            columns: [col],
            totalWidth: getColWidth(col),
            isGroup: false,
          });
          i++;
        } else {
          const groupCols: ColumnDef<T>[] = [col];
          let j = i + 1;
          while (j < cols.length && cols[j].headerGroup === grp) {
            groupCols.push(cols[j]);
            j++;
          }
          spans.push({
            groupName: grp,
            columns: groupCols,
            totalWidth: groupCols.reduce((w, c) => w + getColWidth(c), 0),
            isGroup: groupCols.length > 1,
            headerGroupClass: col.headerGroupClass,
          });
          i = j;
        }
      }
      return spans;
    },
    [getColWidth],
  );

  // ── Pagination ────────────────────────────────────────────────────────────
  const pageNumbers = useMemo(() => {
    const total = totalPages;
    const current = currentPage;
    const delta = 2;
    const pages: (number | '...')[] = [];
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  }, [totalPages, currentPage]);

  const goToPage = useCallback(
    (p: number) => {
      const clamped = Math.max(1, Math.min(p, totalPages));
      setCurrentPage(clamped);
      const state: PaginationState = { page: clamped, pageSize, total: totalRows };
      opts.onPageChange?.(state);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [totalPages, pageSize, totalRows, opts.onPageChange],
  );

  // ── Server-side fetch ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!opts.serverSide || !opts.fetchRows) return;
    const params: ServerSideParams = {
      page: currentPage,
      pageSize,
      sortField: sortColumns[0]?.field ?? null,
      sortDir: sortColumns[0]?.direction ?? null,
      sorts: sortColumns,
      filters: activeFilters,
    };
    setLoading(true);
    opts
      .fetchRows(params)
      .then((result) => {
        setLocalRowOrder(result.rows as T[]);
        setServerTotal(result.total);
      })
      .catch((e) => console.error('Server fetch error', e))
      .finally(() => setLoading(false));
  }, [opts.serverSide, opts.fetchRows, currentPage, pageSize, sortColumns, activeFilters]);

  // ── Sort ──────────────────────────────────────────────────────────────────
  const applySortColumns = useCallback(
    (entries: SortEntry[]) => {
      setSortColumns(entries);
      const sortMap = new Map(entries.map((s) => [s.field, s.direction as SortDirection]));
      setColumnStates((s) =>
        s.map((cs) => ({ ...cs, sortDirection: sortMap.get(cs.field) ?? null })),
      );
    },
    [],
  );

  const onHeaderClick = useCallback(
    (col: ColumnDef<T>, event?: React.MouseEvent) => {
      if (!col.sortable) return;
      const multi = event?.ctrlKey || event?.metaKey;
      const cols = sortColumns;
      const existing = cols.find((s) => s.field === col.field);
      let next: SortEntry[];

      if (multi) {
        if (!existing) {
          next = [...cols, { field: col.field, direction: 'asc' }];
        } else if (existing.direction === 'asc') {
          next = cols.map((s) =>
            s.field === col.field ? { ...s, direction: 'desc' as const } : s,
          );
        } else {
          next = cols.filter((s) => s.field !== col.field);
        }
      } else {
        const cur = existing?.direction ?? null;
        const dir: SortDirection = cur === null ? 'asc' : cur === 'asc' ? 'desc' : null;
        next = dir ? [{ field: col.field, direction: dir }] : [];
      }

      applySortColumns(next);
      if (opts.pagination) setCurrentPage(1);
      const sortDir = next.find((s) => s.field === col.field)?.direction ?? null;
      opts.onSortChange?.({ field: col.field, direction: sortDir });
    },
    [sortColumns, applySortColumns, opts.pagination, opts.onSortChange],
  );

  const getSortDir = useCallback(
    (f: string): SortDirection => sortColumns.find((s) => s.field === f)?.direction ?? null,
    [sortColumns],
  );

  const getSortIndex = useCallback(
    (f: string): number => {
      const idx = sortColumns.findIndex((s) => s.field === f);
      return idx >= 0 ? idx + 1 : 0;
    },
    [sortColumns],
  );

  const isMultiSort = sortColumns.length > 1;

  // ── Selection ─────────────────────────────────────────────────────────────
  const isSelected = useCallback(
    (row: T): boolean => selectedIds.has(rowId(row)),
    [selectedIds],
  );

  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedRows.map((r) => rowId(r))));
    }
  }, [allSelected, sortedRows]);

  const onCheckboxClick = useCallback(
    (e: React.MouseEvent, row: T, index: number) => {
      e.stopPropagation();
      const mode = opts.selectionMode ?? 'none';
      if (mode === 'none') return;
      const id = rowId(row);
      if (mode === 'single') {
        setSelectedIds((s) => {
          const n = new Set(s);
          if (n.has(id)) n.delete(id);
          else {
            n.clear();
            n.add(id);
          }
          return n;
        });
      } else {
        setSelectedIds((s) => {
          const n = new Set(s);
          n.has(id) ? n.delete(id) : n.add(id);
          return n;
        });
      }
      lastSelIdxRef.current = index;
    },
    [opts.selectionMode],
  );

  const handleRowClick = useCallback(
    (e: React.MouseEvent, row: T, index: number) => {
      const mode = opts.selectionMode ?? 'none';
      if (mode !== 'none') {
        const id = rowId(row);
        if (mode === 'single') {
          setSelectedIds((s) => {
            const n = new Set<unknown>();
            if (!s.has(id)) n.add(id);
            return n;
          });
          lastSelIdxRef.current = index;
        } else if (e.shiftKey && lastSelIdxRef.current >= 0) {
          const lo = Math.min(lastSelIdxRef.current, index);
          const hi = Math.max(lastSelIdxRef.current, index);
          setSelectedIds((s) => {
            const n = new Set(s);
            for (let i = lo; i <= hi; i++)
              if (sortedRows[i]) n.add(rowId(sortedRows[i]));
            return n;
          });
        } else if (e.ctrlKey || e.metaKey) {
          setSelectedIds((s) => {
            const n = new Set(s);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
          });
          lastSelIdxRef.current = index;
        } else {
          setSelectedIds((s) => {
            if (s.size === 1 && s.has(id)) return new Set();
            return new Set([id]);
          });
          lastSelIdxRef.current = index;
        }
      }
      opts.onRowClick?.(row, index);
    },
    [opts.selectionMode, opts.onRowClick, sortedRows],
  );

  // ── Selection change effect ───────────────────────────────────────────────
  useEffect(() => {
    const sel = sortedRows.filter((r) => selectedIds.has(rowId(r)));
    opts.onSelectionChange?.(sel);
  }, [selectedIds]);

  // ── Filter ────────────────────────────────────────────────────────────────
  const getFilterMode = useCallback(
    (col: ColumnDef<T>): 'inline' | 'popover' =>
      col.filterMode ?? opts.filterMode ?? 'popover',
    [opts.filterMode],
  );

  const hasFilter = useCallback(
    (field: string): boolean => field in activeFilters,
    [activeFilters],
  );

  const getFilter = useCallback(
    (field: string): ColumnFilter | null => activeFilters[field] ?? null,
    [activeFilters],
  );

  const onFilterApply = useCallback(
    (field: string, filter: ColumnFilter) => {
      setActiveFilters((f) => ({ ...f, [field]: filter }));
      if (opts.pagination) setCurrentPage(1);
    },
    [opts.pagination],
  );

  const onFilterClear = useCallback((field: string) => {
    setActiveFilters((f) => {
      const n = { ...f };
      delete n[field];
      return n;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  const onInlineFilterInput = useCallback(
    (field: string, value: string) => {
      if (value === '') onFilterClear(field);
      else onFilterApply(field, { operator: 'contains', value });
    },
    [onFilterClear, onFilterApply],
  );

  // ── Filter change effect ──────────────────────────────────────────────────
  useEffect(() => {
    opts.onFilterChange?.(activeFilters);
  }, [activeFilters]);

  // ── Column state change effect ────────────────────────────────────────────
  useEffect(() => {
    opts.onColumnStateChange?.(columnStates);
  }, [columnStates]);

  // ── Column resize ─────────────────────────────────────────────────────────
  const onColResize = useCallback((field: string, w: number) => {
    setColumnStates((s) => s.map((cs) => (cs.field === field ? { ...cs, width: w } : cs)));
  }, []);

  // ── Column visibility ─────────────────────────────────────────────────────
  const onVisibilityChange = useCallback(
    (c: { field: string; visible: boolean }) => {
      setColumnStates((s) =>
        s.map((cs) => (cs.field === c.field ? { ...cs, visible: c.visible } : cs)),
      );
    },
    [],
  );

  // ── Column reorder ────────────────────────────────────────────────────────
  const applyColReorder = useCallback(
    (fields: string[]) => {
      setColumnStates((s) =>
        s.map((cs) => ({ ...cs, order: fields.indexOf(cs.field) })),
      );
      opts.onColReorder?.(fields);
    },
    [opts.onColReorder],
  );

  const onHdrDragStart = useCallback(
    (e: React.DragEvent, field: string) => {
      if (!opts.colReorder) return;
      setHdrDragSrc(field);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', field);
    },
    [opts.colReorder],
  );

  const onHdrDragOver = useCallback(
    (e: React.DragEvent, field: string) => {
      if (!hdrDragSrc || hdrDragSrc === field) return;
      e.preventDefault();
      setHdrDragOver(field);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setHdrDragOverPos(e.clientX < rect.left + rect.width / 2 ? 'left' : 'right');
    },
    [hdrDragSrc],
  );

  const onHdrDrop = useCallback(
    (e: React.DragEvent, field: string) => {
      e.preventDefault();
      const src = e.dataTransfer?.getData('text/plain');
      setHdrDragOver(null);
      setHdrDragSrc(null);
      if (!src || src === field) return;
      const fields = [...columnStates]
        .sort((a, b) => a.order - b.order)
        .map((s) => s.field);
      const from = fields.indexOf(src);
      if (from === -1) return;
      fields.splice(from, 1);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const isBefore = e.clientX < rect.left + rect.width / 2;
      const to = fields.indexOf(field);
      if (to === -1) return;
      fields.splice(isBefore ? to : to + 1, 0, src);
      applyColReorder(fields);
    },
    [columnStates, applyColReorder],
  );

  // ── Cell editing ──────────────────────────────────────────────────────────
  const isCellEditing = useCallback(
    (row: T, field: string): boolean => {
      const a = activeCellEdit;
      return a !== null && a.rowId === rowId(row) && a.field === field;
    },
    [activeCellEdit],
  );

  const isRowEditing = useCallback(
    (row: T): boolean => activeEditRowId === rowId(row),
    [activeEditRowId],
  );

  const getEditorConfig = useCallback(
    (field: string): CellEditorConfig => columnMap.get(field)?.editor ?? {},
    [columnMap],
  );

  const startCellEdit = useCallback(
    (row: T, field: string, triggerKey: string | null) => {
      setActiveCellEdit({ rowId: rowId(row), field, triggerKey });
    },
    [],
  );

  const onCellEditCommit = useCallback(
    (row: T, field: string, newValue: unknown) => {
      const oldValue = getCellValue(row, field);
      const id = rowId(row);
      const event: CellEditEvent<T> = {
        field,
        row,
        oldValue,
        newValue,
        accept: () => {
          setEditedRows((m) => {
            const n = new Map(m);
            const base = n.get(id) ?? row;
            n.set(id, applyValueToRow(base, field, newValue));
            return n;
          });
          opts.onCellEdit?.(event);
        },
        cancel: () => {},
      };
      event.accept();
      setActiveCellEdit(null);
    },
    [opts.onCellEdit],
  );

  const onCellEditCancel = useCallback(() => {
    setActiveCellEdit(null);
  }, []);

  const onCellClick = useCallback(
    (e: React.MouseEvent, value: unknown, field: string, row: T) => {
      e.stopPropagation();
      opts.onCellClick?.(value, field, row);
      if (opts.editMode === 'cell' && opts.editTrigger === 'click') {
        const col = columnMap.get(field);
        if (col?.editable) startCellEdit(row, field, null);
      }
    },
    [opts.editMode, opts.editTrigger, opts.onCellClick, columnMap, startCellEdit],
  );

  const onCellDblClick = useCallback(
    (e: React.MouseEvent, field: string, row: T) => {
      e.stopPropagation();
      if (
        opts.editMode === 'cell' &&
        (opts.editTrigger ?? 'dblclick') === 'dblclick'
      ) {
        const col = columnMap.get(field);
        if (col?.editable) startCellEdit(row, field, null);
      }
    },
    [opts.editMode, opts.editTrigger, columnMap, startCellEdit],
  );

  const onRowDblClick = useCallback(
    (e: React.MouseEvent, row: T, index: number) => {
      opts.onRowDblClick?.(row, index);
      if (opts.editMode === 'row') {
        setActiveEditRowId(rowId(row));
        if (!rowDraftsRef.current.has(rowId(row))) {
          const draft: RowDraft<T> = new Map();
          columns.forEach((col) => {
            if (col.editable) {
              const v = getCellValue(row, col.field);
              draft.set(col.field, { oldValue: v, newValue: v, row });
            }
          });
          rowDraftsRef.current.set(rowId(row), draft);
        }
      }
    },
    [opts.editMode, opts.onRowDblClick, columns],
  );

  const commitRowEdit = useCallback(
    (row: T) => {
      const id = rowId(row);
      const draft = rowDraftsRef.current.get(id);
      if (!draft) return;
      const changes: Record<string, { oldValue: unknown; newValue: unknown }> = {};
      draft.forEach((v, f) => {
        changes[f] = { oldValue: v.oldValue, newValue: v.newValue };
      });
      const event: RowEditEvent<T> = {
        row,
        changes,
        accept: () => {
          setEditedRows((m) => {
            const n = new Map(m);
            let updated = n.get(id) ?? row;
            draft.forEach((v, f) => {
              updated = applyValueToRow(updated, f, v.newValue);
            });
            n.set(id, updated);
            return n;
          });
          rowDraftsRef.current.delete(id);
          setActiveEditRowId(null);
          opts.onRowEdit?.(event);
        },
        cancel: () => {
          rowDraftsRef.current.delete(id);
          setActiveEditRowId(null);
        },
      };
      event.accept();
    },
    [opts.onRowEdit],
  );

  const cancelRowEdit = useCallback((row: T) => {
    rowDraftsRef.current.delete(rowId(row));
    setActiveEditRowId(null);
  }, []);

  const onRowDraftChange = useCallback(
    (row: T, field: string, newValue: unknown) => {
      const id = rowId(row);
      const draft = rowDraftsRef.current.get(id);
      if (!draft) return;
      const existing = draft.get(field);
      draft.set(
        field,
        existing
          ? { ...existing, newValue }
          : { oldValue: getCellValue(row, field), newValue, row },
      );
    },
    [],
  );

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const onCellKeydown = useCallback(
    (e: React.KeyboardEvent, row: T, field: string) => {
      if (isCellEditing(row, field)) return;

      if (opts.keyboardNav && activeCellEdit === null) {
        if (
          ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(
            e.key,
          )
        ) {
          e.preventDefault();
          const cols = visibleColumns;
          const rows = sortedRows;
          const colIdx = cols.findIndex((c) => c.field === field);
          const rowIdx = rows.findIndex((r) => rowId(r) === rowId(row));
          let nc = colIdx,
            nr = rowIdx;
          if (e.key === 'ArrowRight' || (e.key === 'Tab' && !e.shiftKey)) {
            if (colIdx < cols.length - 1) nc = colIdx + 1;
            else if (rowIdx < rows.length - 1) {
              nc = 0;
              nr = rowIdx + 1;
            }
          } else if (e.key === 'ArrowLeft' || (e.key === 'Tab' && e.shiftKey)) {
            if (colIdx > 0) nc = colIdx - 1;
            else if (rowIdx > 0) {
              nc = cols.length - 1;
              nr = rowIdx - 1;
            }
          } else if (e.key === 'ArrowDown' || e.key === 'Enter') {
            if (rowIdx < rows.length - 1) nr = rowIdx + 1;
          } else if (e.key === 'ArrowUp') {
            if (rowIdx > 0) nr = rowIdx - 1;
          }
          if (nc !== colIdx || nr !== rowIdx) {
            const nRow = rows[nr];
            const nField = cols[nc]?.field;
            if (nRow && nField) {
              queueMicrotask(() => {
                const sel = `[data-cell-id="${String(rowId(nRow))}-${nField}"]`;
                scrollRef.current?.querySelector<HTMLElement>(sel)?.focus();
              });
            }
          }
          return;
        }
      }

      if (opts.editOnType && opts.editMode === 'cell') {
        const col = columnMap.get(field);
        if (!col?.editable) return;
        if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) return;
        e.preventDefault();
        startCellEdit(row, field, e.key === 'Backspace' ? '' : e.key);
      }
    },
    [
      isCellEditing,
      opts.keyboardNav,
      opts.editOnType,
      opts.editMode,
      activeCellEdit,
      visibleColumns,
      sortedRows,
      columnMap,
      startCellEdit,
    ],
  );

  // ── Cell navigate (Tab from editor) ───────────────────────────────────────
  const onCellEditNavigate = useCallback(
    (row: T, field: string, dir: 'next' | 'prev') => {
      const cols = visibleColumns;
      const rows = sortedRows;
      const colIdx = cols.findIndex((c) => c.field === field);
      const rowIdx = rows.findIndex((r) => rowId(r) === rowId(row));
      let nc = colIdx,
        nr = rowIdx;
      if (dir === 'next') {
        if (colIdx < cols.length - 1) nc = colIdx + 1;
        else if (rowIdx < rows.length - 1) {
          nc = 0;
          nr = rowIdx + 1;
        }
      } else {
        if (colIdx > 0) nc = colIdx - 1;
        else if (rowIdx > 0) {
          nc = cols.length - 1;
          nr = rowIdx - 1;
        }
      }
      const nRow = rows[nr];
      const nField = cols[nc]?.field;
      if (!nRow || !nField) return;
      if (opts.autoEditOnNavigate) {
        const col = columnMap.get(nField);
        if (col?.editable) {
          queueMicrotask(() => startCellEdit(nRow, nField, null));
          return;
        }
      }
      queueMicrotask(() => {
        const sel = `[data-cell-id="${String(rowId(nRow))}-${nField}"]`;
        scrollRef.current?.querySelector<HTMLElement>(sel)?.focus();
      });
    },
    [visibleColumns, sortedRows, opts.autoEditOnNavigate, columnMap, startCellEdit],
  );

  // ── Cell enter commit ─────────────────────────────────────────────────────
  const onCellEditEnter = useCallback(
    (row: T, field: string) => {
      queueMicrotask(() => {
        const sel = `[data-cell-id="${String(rowId(row))}-${field}"]`;
        scrollRef.current?.querySelector<HTMLElement>(sel)?.focus();
      });
    },
    [],
  );

  // ── Row drag ──────────────────────────────────────────────────────────────
  const onRowMouseDown = useCallback(
    (e: React.MouseEvent, absIdx: number) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      setDragRowIdx(absIdx);
      setDropRowIdx(absIdx);
      setDropPosition('below');
      setRowDragGhostY(null);

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';

      const container = scrollRef.current;

      const updateFromClientY = (clientY: number) => {
        if (!container) return;
        const containerRect = container.getBoundingClientRect();
        const relY = clientY - containerRect.top + container.scrollTop;
        const rows = displayRows;
        const clampedIdx = Math.max(
          0,
          Math.min(rows.length - 1, Math.floor(relY / rowHeight)),
        );
        const rowTopY = clampedIdx * rowHeight;
        const isAbove = relY < rowTopY + rowHeight / 2;
        setDropPosition(isAbove ? 'above' : 'below');
        setDropRowIdx(clampedIdx);
        setRowDragGhostY(isAbove ? rowTopY : rowTopY + rowHeight);
      };

      const mm = (ev: MouseEvent) => updateFromClientY(ev.clientY);
      const mu = () => {
        // Commit drop
        const from = absIdx;
        const to = dropRowIdx;
        if (from !== null && to !== null && from !== to) {
          const rows = [...sortedRows];
          const dragged = rows.splice(from, 1)[0];
          const adjustedTo = to > from ? to - 1 : to;
          const insertAt = dropPosition === 'below' ? adjustedTo + 1 : adjustedTo;
          rows.splice(Math.max(0, Math.min(rows.length, insertAt)), 0, dragged);
          setLocalRowOrder(rows);
          opts.onRowDrop?.(from, to, rows);
        }
        // Cleanup
        document.removeEventListener('mousemove', mm);
        document.removeEventListener('mouseup', mu);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        setDragRowIdx(null);
        setDropRowIdx(null);
        setRowDragGhostY(null);
      };
      document.addEventListener('mousemove', mm, { passive: true });
      document.addEventListener('mouseup', mu, { once: true });
    },
    [displayRows, rowHeight, sortedRows, opts.onRowDrop],
  );

  // ── Grouping ──────────────────────────────────────────────────────────────
  const toggleGroup = useCallback((groupKey: string) => {
    setCollapsedGroups((s) => {
      const next = new Set(s);
      next.has(groupKey) ? next.delete(groupKey) : next.add(groupKey);
      return next;
    });
  }, []);

  // ── Tree ──────────────────────────────────────────────────────────────────
  const toggleTreeRow = useCallback((treeId: unknown) => {
    setExpandedTreeIds((s) => {
      const next = new Set(s);
      next.has(treeId) ? next.delete(treeId) : next.add(treeId);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    const field = opts.treeChildrenField;
    if (!field) return;
    const ids = new Set<unknown>();
    const collect = (rows: T[]) => {
      rows.forEach((r) => {
        const children = (r as Record<string, unknown>)[field] as T[] | undefined;
        if (children?.length) {
          ids.add(rowId(r));
          collect(children);
        }
      });
    };
    collect(mergedRows);
    setExpandedTreeIds(ids);
  }, [opts.treeChildrenField, mergedRows]);

  const collapseAll = useCallback(() => {
    setExpandedTreeIds(new Set());
  }, []);

  // ── Detail panel ──────────────────────────────────────────────────────────
  const isDetailOpen = useCallback(
    (row: T): boolean => openDetailIds.has(rowId(row)),
    [openDetailIds],
  );

  const toggleDetail = useCallback(
    (row: T) => {
      const id = rowId(row);
      const multi = opts.detailMulti ?? false;
      setOpenDetailIds((s) => {
        const next = new Set(multi ? s : new Set<unknown>());
        if (s.has(id)) {
          next.delete(id);
          opts.onDetailClose?.(row);
        } else {
          next.add(id);
          opts.onDetailOpen?.(row);
        }
        return next;
      });
    },
    [opts.detailMulti, opts.onDetailClose, opts.onDetailOpen],
  );

  // ── Infinite scroll ───────────────────────────────────────────────────────
  const triggerLoadMore = useCallback(async () => {
    const onLoadMore = opts.onLoadMore;
    if (!onLoadMore || infiniteLoading || infiniteExhausted) return;
    setInfiniteLoading(true);
    try {
      const currentCount = rowData.length;
      const result = await onLoadMore(currentCount);
      if (!result || result.length === 0) {
        setInfiniteExhausted(true);
      }
    } catch (e) {
      console.error('Infinite scroll load error', e);
    } finally {
      setInfiniteLoading(false);
    }
  }, [opts.onLoadMore, infiniteLoading, infiniteExhausted, rowData.length]);

  // ── New row ───────────────────────────────────────────────────────────────
  const startNewRowEdit = useCallback(
    (field: string, triggerKey: string | null = null) => {
      setNewRowTriggerKey(triggerKey);
      setNewRowField(field);
    },
    [],
  );

  const onNewRowCellCommit = useCallback(
    (field: string, value: unknown) => {
      const updatedDraft = { ...newRowDraft, [field]: value };
      setNewRowDraft(updatedDraft);
      setNewRowActive(true);
      setNewRowField(null);
      setNewRowTriggerKey(null);

      const commitMode = opts.newRowCommit ?? 'onLeave';
      if (commitMode === 'immediate' && opts.editMode === 'cell') {
        fireNewRow(updatedDraft);
      }
    },
    [newRowDraft, opts.newRowCommit, opts.editMode],
  );

  const fireNewRow = useCallback(
    (draft: Record<string, unknown>) => {
      const hasData = Object.values(draft).some(
        (v) => v !== null && v !== undefined && v !== '',
      );
      if (!hasData) {
        setNewRowDraft({});
        setNewRowActive(false);
        setNewRowField(null);
        return;
      }
      opts.onNewRow?.(draft);
      setNewRowDraft({});
      setNewRowActive(false);
      setNewRowField(null);
    },
    [opts.onNewRow],
  );

  const commitNewRow = useCallback(() => {
    if (Object.keys(newRowDraft).length === 0) return;
    fireNewRow(newRowDraft);
  }, [newRowDraft, fireNewRow]);

  const cancelNewRow = useCallback(() => {
    setNewRowDraft({});
    setNewRowActive(false);
    setNewRowField(null);
  }, []);

  // ── Aggregates ────────────────────────────────────────────────────────────
  const getAggregateValue = useCallback(
    (col: ColumnDef<T>): string => {
      if (!col.aggregate) return '';
      return computeAggregate(filteredSortedRows, col.field, col);
    },
    [filteredSortedRows],
  );

  // ── Display row builders ──────────────────────────────────────────────────
  function makeDataRow(
    data: T,
    absIdx: number,
    depth: number,
    hasChildren: boolean,
  ): DisplayRow<T> {
    return {
      kind: 'data',
      data,
      absIdx,
      depth,
      hasChildren,
      expanded: false,
      treeId: rowId(data),
      isGroup: false,
    };
  }

  function buildGroupedRows(rows: T[], groupField: string): DisplayRow<T>[] {
    const groups = new Map<string, T[]>();
    rows.forEach((r) => {
      const key = String(getCellValue(r, groupField) ?? '(blank)');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(r);
    });
    const result: DisplayRow<T>[] = [];
    let absIdx = 0;
    groups.forEach((children, key) => {
      const meta: GroupRowMeta = {
        isGroup: true,
        groupKey: key,
        groupField,
        depth: 0,
        rowCount: children.length,
        collapsed: collapsedGroups.has(key),
        children,
      };
      result.push({
        kind: 'group',
        data: meta as unknown,
        absIdx: absIdx++,
        depth: 0,
        hasChildren: true,
        expanded: !collapsedGroups.has(key),
        treeId: null,
        isGroup: true,
      });
      if (!collapsedGroups.has(key)) {
        children.forEach((child) =>
          result.push(makeDataRow(child, absIdx++, 0, false)),
        );
      }
    });
    return result;
  }

  function buildTreeRows(
    rows: T[],
    childField: string,
    depth: number,
  ): DisplayRow<T>[] {
    const result: DisplayRow<T>[] = [];
    const expandedByDefault = opts.treeExpandedByDefault ?? false;
    let absIdx = 0;

    const walk = (list: T[], d: number) => {
      list.forEach((row) => {
        const id = rowId(row);
        const children = (row as Record<string, unknown>)[childField] as
          | T[]
          | undefined;
        const hasKids = !!children?.length;
        const isExpanded = expandedTreeIds.has(id) || (expandedByDefault && hasKids);
        result.push({
          kind: 'tree' as DisplayRowKind,
          data: row,
          absIdx: absIdx++,
          depth: d,
          hasChildren: hasKids,
          expanded: isExpanded,
          treeId: id,
          isGroup: false,
        });
        if (hasKids && isExpanded) {
          walk(children!, d + 1);
        }
      });
    };
    walk(rows, depth);
    return result;
  }

  function injectDetailRows(rows: DisplayRow<T>[]): DisplayRow<T>[] {
    const result: DisplayRow<T>[] = [];
    let absIdx = 0;
    for (const dr of rows) {
      dr.absIdx = absIdx++;
      result.push(dr);
      if (!dr.isGroup && dr.kind !== 'group') {
        const row = dr.data as T;
        if (openDetailIds.has(rowId(row))) {
          result.push({
            kind: 'detail' as DisplayRowKind,
            data: row,
            absIdx: absIdx++,
            depth: dr.depth,
            hasChildren: false,
            expanded: true,
            treeId: null,
            isGroup: false,
          });
        }
      }
    }
    return result;
  }

  // ── Cell style helpers ────────────────────────────────────────────────────
  const getCellStyle = useCallback(
    (row: T, col: ColumnDef<T>): React.CSSProperties => {
      const layout: React.CSSProperties = opts.autoFit
        ? { flex: col.flex ?? 1, minWidth: col.minWidth ?? 60 }
        : { width: getColWidth(col), minWidth: col.minWidth ?? 60 };
      const custom = col.cellStyleFn
        ? col.cellStyleFn(getCellValue(row, col.field), row)
        : {};
      const pinnedLeft = getPinnedLeft(col);
      const pinnedRight = getPinnedRight(col);
      return {
        ...layout,
        ...custom,
        ...(pinnedLeft != null ? { left: pinnedLeft, position: 'sticky' as const, zIndex: 10 } : {}),
        ...(pinnedRight != null ? { right: pinnedRight, position: 'sticky' as const, zIndex: 10 } : {}),
      };
    },
    [opts.autoFit, getColWidth, getPinnedLeft, getPinnedRight],
  );

  const getHeaderStyle = useCallback(
    (col: ColumnDef<T>): React.CSSProperties => {
      const layout: React.CSSProperties = opts.autoFit
        ? { flex: col.flex ?? 1, minWidth: col.minWidth ?? 60 }
        : { width: getColWidth(col), minWidth: col.minWidth ?? 60 };
      const pinnedLeft = getPinnedLeft(col);
      const pinnedRight = getPinnedRight(col);
      return {
        ...layout,
        ...(pinnedLeft != null ? { left: pinnedLeft, position: 'sticky' as const, zIndex: 20 } : {}),
        ...(pinnedRight != null ? { right: pinnedRight, position: 'sticky' as const, zIndex: 20 } : {}),
      };
    },
    [opts.autoFit, getColWidth, getPinnedLeft, getPinnedRight],
  );

  const getCellClasses = useCallback(
    (col: ColumnDef<T>, row?: T): string => {
      const cls = ['sp-grid-cell'];
      if (col.cellClass) {
        const cc = Array.isArray(col.cellClass) ? col.cellClass : [col.cellClass];
        cls.push(...cc);
      }
      if (row !== undefined) {
        const dynamicCellClass = opts.getCellClass?.(row, col.field, col);
        if (dynamicCellClass) {
          cls.push(
            ...(Array.isArray(dynamicCellClass) ? dynamicCellClass : [dynamicCellClass]),
          );
        }
      }
      if (col.editable) cls.push('sp-grid-cell--editable');
      if (col.wrapText) cls.push('sp-grid-cell--wrap');
      const pin = getColPin(col);
      if (pin === 'left') cls.push('sp-grid-cell--pinned-left');
      if (pin === 'right') cls.push('sp-grid-cell--pinned-right');
      return cls.join(' ');
    },
    [opts.getCellClass, getColPin],
  );

  const getFormattedValue = useCallback(
    (row: T, col: ColumnDef<T>): string => {
      const raw = getCellValue(row, col.field);
      return col.valueFormatter ? col.valueFormatter(raw, row) : raw == null ? '' : String(raw);
    },
    [],
  );

  // ── Resize handle ─────────────────────────────────────────────────────────
  const ResizeHandle = useCallback(
    ({ field, currentWidth, minWidth = 60, maxWidth = 2000 }: {
      field: string;
      currentWidth: number;
      minWidth?: number;
      maxWidth?: number;
    }) => {
      const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startW = currentWidth;

        const onMove = (ev: MouseEvent) => {
          const delta = ev.clientX - startX;
          const newW = Math.max(minWidth, Math.min(maxWidth, startW + delta));
          onColResize(field, newW);
        };
        const onUp = () => {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      };

      return (
        <span
          className="sp-grid-resize-handle"
          onMouseDown={onMouseDown}
          onDoubleClick={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => e.stopPropagation()}
        />
      );
    },
    [onColResize],
  );

  // ── Render: Header cell ───────────────────────────────────────────────────
  const renderHeaderCell = (col: ColumnDef<T>) => {
    const headerClasses = [
      'sp-grid-header-cell',
      col.sortable ? 'sortable' : '',
      opts.colReorder ? 'col-draggable' : '',
      hdrDragSrc === col.field ? 'is-dragging-src' : '',
      hdrDragOver === col.field && hdrDragOverPos === 'left' ? 'drop-left' : '',
      hdrDragOver === col.field && hdrDragOverPos === 'right' ? 'drop-right' : '',
      ...(col.headerClass ? (Array.isArray(col.headerClass) ? col.headerClass : [col.headerClass]) : []),
      getColPin(col) === 'left' ? 'sp-grid-header-cell--pinned-left' : '',
      getColPin(col) === 'right' ? 'sp-grid-header-cell--pinned-right' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        key={col.field}
        className={headerClasses}
        style={getHeaderStyle(col)}
        draggable={opts.colReorder ?? false}
        onDragStart={(e) => onHdrDragStart(e, col.field)}
        onDragOver={(e) => onHdrDragOver(e, col.field)}
        onDragLeave={() => setHdrDragOver(null)}
        onDrop={(e) => onHdrDrop(e, col.field)}
        onDragEnd={() => {
          setHdrDragSrc(null);
          setHdrDragOver(null);
        }}
        onClick={(e) => onHeaderClick(col, e)}
      >
        <div className="sp-grid-header-cell__inner">
          {col.headerRenderer ? (
            col.headerRenderer(col.headerName ?? col.field, col)
          ) : (
            <>
              <span className="sp-grid-header-cell__label">
                {col.headerName ?? col.field}
              </span>
              {col.editable && opts.editMode && (
                <span className="sp-grid-header-cell__edit-hint" title={t('editable')}>
                  <Icon name="edit" size={12} />
                </span>
              )}
              {col.sortable && (
                <span
                  className={`sp-grid-sort-icon${getSortDir(col.field) !== null ? ' active' : ''}`}
                >
                  {getSortDir(col.field) === 'asc' ? (
                    <Icon name="sort-asc" size={14} />
                  ) : getSortDir(col.field) === 'desc' ? (
                    <Icon name="sort-desc" size={14} />
                  ) : (
                    <Icon name="arrow-up-down" size={14} />
                  )}
                  {isMultiSort && getSortIndex(col.field) > 0 && (
                    <span className="sp-grid-sort-index">
                      {getSortIndex(col.field)}
                    </span>
                  )}
                </span>
              )}
              {col.filterable && getFilterMode(col) === 'popover' && (
                <Popover
                  placement="bottom-start"
                  offset={4}
                  trigger={
                    <span
                      className={`sp-grid-header-cell__filter-btn${hasFilter(col.field) ? ' active' : ''}`}
                      onClick={(e) => e.stopPropagation()}
                      title={t('filter')}
                    >
                      <Icon name="filter" size={12} />
                    </span>
                  }
                >
                  <GridColumnFilter
                    field={col.field}
                    headerName={col.headerName ?? col.field}
                    current={getFilter(col.field)}
                    onFilterChange={(f) => onFilterApply(col.field, f)}
                    onClear={() => onFilterClear(col.field)}
                    onClose={() => {}}
                  />
                </Popover>
              )}
            </>
          )}
        </div>
        {col.resizable !== false && (
          <ResizeHandle
            field={col.field}
            currentWidth={getColWidth(col)}
            minWidth={col.minWidth}
            maxWidth={col.maxWidth}
          />
        )}
      </div>
    );
  };

  // ── Render: Data cell ─────────────────────────────────────────────────────
  const renderDataCell = (col: ColumnDef<T>, row: T, absIdx: number, depth: number) => {
    const editing = isCellEditing(row, col.field);
    const rowEditMode = isRowEditing(row);

    return (
      <div
        key={col.field}
        className={getCellClasses(col, row)}
        style={getCellStyle(row, col)}
        data-cell-id={`${String(rowId(row))}-${col.field}`}
        tabIndex={opts.keyboardNav || (col.editable && opts.editMode === 'cell') ? 0 : -1}
        onClick={(e) => onCellClick(e, getCellValue(row, col.field), col.field, row)}
        onDoubleClick={(e) => onCellDblClick(e, col.field, row)}
        onKeyDown={(e) => onCellKeydown(e, row, col.field)}
        role="gridcell"
      >
        {opts.editMode === 'cell' && col.editable && editing ? (
          <CellEditor
            initialValue={getCellValue(row, col.field)}
            config={getEditorConfig(col.field)}
            initialKey={activeCellEdit?.triggerKey ?? null}
            customRenderer={col.editorRenderer}
            row={row}
            field={col.field}
            onCommit={(v) => onCellEditCommit(row, col.field, v)}
            onCancel={onCellEditCancel}
            onNavigate={(_v, dir) => onCellEditNavigate(row, col.field, dir)}
            onEnterCommit={() => onCellEditEnter(row, col.field)}
          />
        ) : opts.editMode === 'row' && col.editable && rowEditMode ? (
          <CellEditor
            initialValue={getCellValue(row, col.field)}
            config={getEditorConfig(col.field)}
            initialKey={null}
            row={row}
            field={col.field}
            onCommit={(v) => onRowDraftChange(row, col.field, v)}
            onCancel={() => {}}
            onNavigate={() => {}}
          />
        ) : (
          <>
            {opts.treeChildrenField &&
              col.field === centerCols[0]?.field &&
              depth > 0 && (
                <span
                  className="sp-grid-tree-indent"
                  style={{ width: depth * 20 }}
                />
              )}
            {col.cellRenderer ? (
              col.cellRenderer(getCellValue(row, col.field), row)
            ) : (
              <span className="sp-grid-cell__text">
                {getFormattedValue(row, col)}
              </span>
            )}
            {col.editable && opts.editMode && !rowEditMode && (
              <span className="sp-grid-cell__edit-indicator">
                <Icon name="edit" size={12} />
              </span>
            )}
          </>
        )}
      </div>
    );
  };

  // ── Render: Row ───────────────────────────────────────────────────────────
  const renderRow = (dr: DisplayRow<T>) => {
    const row = dr.data as T;
    const absIdx = dr.absIdx;
    const depth = dr.depth;
    const hasChildren = dr.hasChildren;
    const expanded = dr.expanded;
    const treeId = dr.treeId;

    const rowClasses = [
      'sp-grid-row',
      opts.striped && absIdx % 2 !== 0 ? 'sp-grid-row--odd' : '',
      isSelected(row) ? 'sp-grid-row--selected' : '',
      isRowEditing(row) ? 'sp-grid-row--editing' : '',
      opts.detailRenderer && isDetailOpen(row) ? 'sp-grid-row--detail-open' : '',
      dragRowIdx === absIdx ? 'sp-grid-row--dragging' : '',
      opts.getRowClass ? opts.getRowClass(row) : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        key={`row-${absIdx}`}
        className={rowClasses}
        style={{
          height: isRowEditing(row) ? undefined : (fixedRowHeight ?? undefined),
          minHeight: rowHeight,
        }}
        onClick={(e) => handleRowClick(e, row, absIdx)}
        onDoubleClick={(e) => onRowDblClick(e, row, absIdx)}
        role="row"
      >
        {/* Expand column */}
        {hasExpandColumn && (
          <div
            className={`sp-grid-cell sp-grid-cell--expand${shouldPinControls ? ' sp-grid-cell--control-pinned' : ''}`}
            style={{ width: 36, minWidth: 36, flexShrink: 0, ...(ctrlColLeftExpand != null ? { left: ctrlColLeftExpand } : {}) }}
            onClick={(e) => e.stopPropagation()}
          >
            {opts.treeChildrenField && hasChildren && (
              <button
                className={`sp-grid-expand-btn${expanded ? ' expanded' : ''}`}
                onClick={() => toggleTreeRow(treeId)}
                title={t('toggleChildren')}
              >
                <Icon name="chevron-down" size={14} />
              </button>
            )}
            {opts.detailRenderer && (
              <button
                className={`sp-grid-expand-btn${isDetailOpen(row) ? ' expanded' : ''}`}
                onClick={() => toggleDetail(row)}
                title={t('toggleDetails')}
              >
                <Icon name="chevron-down" size={14} />
              </button>
            )}
          </div>
        )}

        {/* Drag handle */}
        {opts.rowDraggable && (
          <div
            className={`sp-grid-cell sp-grid-cell--drag${shouldPinControls ? ' sp-grid-cell--control-pinned' : ''}`}
            style={{ width: 36, minWidth: 36, flexShrink: 0, ...(ctrlColLeftDrag != null ? { left: ctrlColLeftDrag } : {}) }}
            onMouseDown={(e) => onRowMouseDown(e, absIdx)}
            onClick={(e) => e.stopPropagation()}
            title={t('dragToReorder')}
          >
            <Icon name="grip-vertical" size={14} />
          </div>
        )}

        {/* Row edit actions */}
        {opts.editMode === 'row' && (
          <div
            className={`sp-grid-cell sp-grid-cell--actions${shouldPinControls ? ' sp-grid-cell--control-pinned' : ''}`}
            style={{ width: 80, minWidth: 80, flexShrink: 0, ...(ctrlColLeftActions != null ? { left: ctrlColLeftActions } : {}) }}
          >
            {isRowEditing(row) ? (
              <>
                <button
                  className="sp-grid-edit-btn sp-grid-edit-btn--save"
                  onClick={(e) => {
                    e.stopPropagation();
                    commitRowEdit(row);
                  }}
                  title={t('save')}
                >
                  <Icon name="check" size={12} />
                </button>
                <button
                  className="sp-grid-edit-btn sp-grid-edit-btn--cancel"
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelRowEdit(row);
                  }}
                  title={t('cancel')}
                >
                  <Icon name="x" size={12} />
                </button>
              </>
            ) : (
              <button
                className="sp-grid-edit-btn sp-grid-edit-btn--edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onRowDblClick(e as unknown as React.MouseEvent, row, absIdx);
                }}
                title={t('edit')}
              >
                <Icon name="edit" size={12} />
              </button>
            )}
          </div>
        )}

        {/* Checkbox */}
        {opts.selectionMode && opts.selectionMode !== 'none' && (
          <div
            className={`sp-grid-cell sp-grid-cell--checkbox${shouldPinControls ? ' sp-grid-cell--control-pinned' : ''}`}
            style={{ width: 44, minWidth: 44, flexShrink: 0, ...(ctrlColLeftCheckbox != null ? { left: ctrlColLeftCheckbox } : {}) }}
            onClick={(e) => onCheckboxClick(e, row, absIdx)}
          >
            <span
              className={`sp-grid-checkbox${isSelected(row) ? ' checked' : ''}`}
              role="checkbox"
              aria-checked={isSelected(row)}
            >
              {isSelected(row) && <Icon name="check" size={10} />}
            </span>
          </div>
        )}

        {/* Data cells */}
        {leftPinnedCols.map((col) => renderDataCell(col, row, absIdx, depth))}
        {centerCols.map((col) => renderDataCell(col, row, absIdx, depth))}
        {rightPinnedCols.map((col) => renderDataCell(col, row, absIdx, depth))}
      </div>
    );
  };

  // ── Render: Group row ─────────────────────────────────────────────────────
  const renderGroupRow = (dr: DisplayRow<T>) => {
    const meta = dr.data as GroupRowMeta;
    return (
      <div
        key={`group-${meta.groupKey}`}
        className="sp-grid-group-row"
        style={{ minHeight: rowHeight }}
        onClick={() => toggleGroup(meta.groupKey)}
      >
        <div className="sp-grid-group-row__content">
          <span className={`sp-grid-group-row__chevron${meta.collapsed ? ' collapsed' : ''}`}>
            <Icon name="chevron-down" size={14} />
          </span>
          {opts.groupRowRenderer ? (
            opts.groupRowRenderer(meta)
          ) : (
            <>
              <span className="sp-grid-group-row__key">{meta.groupKey}</span>
              <span className="sp-grid-group-row__count">
                {meta.rowCount} row{meta.rowCount !== 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>
      </div>
    );
  };

  // ── Render: Detail row ────────────────────────────────────────────────────
  const renderDetailRow = (dr: DisplayRow<T>) => {
    const row = dr.data as T;
    return (
      <div
        key={`detail-${dr.absIdx}`}
        className="sp-grid-detail-row"
        style={{ height: opts.detailHeight ?? undefined }}
      >
        <div className="sp-grid-detail-row__inner">
          {opts.detailRenderer?.({
            row,
            index: dr.absIdx,
            close: () => {
              setOpenDetailIds((s) => {
                const n = new Set(s);
                n.delete(rowId(row));
                return n;
              });
            },
          })}
        </div>
      </div>
    );
  };

  // ── Render: New row ───────────────────────────────────────────────────────
  const renderNewRow = (dr: DisplayRow<T>) => {
    return (
      <div
        key="new-row"
        className={`sp-grid-row sp-grid-row--new-row${newRowActive ? ' sp-grid-row--new-row-active' : ''}`}
        style={{
          height: fixedRowHeight ?? undefined,
          minHeight: rowHeight,
        }}
        role="row"
        aria-label={t('addNewRow')}
      >
        {hasExpandColumn && (
          <div className="sp-grid-cell" style={{ width: 36, minWidth: 36, flexShrink: 0 }} />
        )}
        {opts.rowDraggable && (
          <div className="sp-grid-cell" style={{ width: 36, minWidth: 36, flexShrink: 0 }} />
        )}
        {opts.editMode === 'row' && (
          <div className="sp-grid-cell sp-grid-cell--actions" style={{ width: 80, minWidth: 80, flexShrink: 0 }}>
            {newRowActive && (
              <>
                <button
                  className="sp-grid-edit-btn sp-grid-edit-btn--save"
                  onClick={commitNewRow}
                  title={t('addRow')}
                >
                  <Icon name="check" size={12} />
                </button>
                <button
                  className="sp-grid-edit-btn sp-grid-edit-btn--cancel"
                  onClick={cancelNewRow}
                  title={t('discard')}
                >
                  <Icon name="x" size={12} />
                </button>
              </>
            )}
          </div>
        )}
        {opts.selectionMode && opts.selectionMode !== 'none' && (
          <div className="sp-grid-cell sp-grid-cell--checkbox" style={{ width: 44, minWidth: 44, flexShrink: 0 }} />
        )}
        {visibleColumns.map((col) => {
          const isEditing = newRowField === col.field;
          const cellStyle: React.CSSProperties = opts.autoFit
            ? { flex: col.flex ?? 1, minWidth: col.minWidth ?? 60 }
            : { width: getColWidth(col), minWidth: col.minWidth ?? 60 };
          const pinnedLeft = getPinnedLeft(col);
          const pinnedRight = getPinnedRight(col);
          if (pinnedLeft != null) Object.assign(cellStyle, { left: pinnedLeft, position: 'sticky', zIndex: 10 });
          if (pinnedRight != null) Object.assign(cellStyle, { right: pinnedRight, position: 'sticky', zIndex: 10 });

          return (
            <div
              key={col.field}
              className={getCellClasses(col)}
              style={cellStyle}
              data-cell-id={`${NEW_ROW_ID}-${col.field}`}
              tabIndex={opts.keyboardNav || (col.editable && opts.editMode === 'cell') ? 0 : -1}
              onClick={(e) => {
                e.stopPropagation();
                if (col.editable) startNewRowEdit(col.field);
              }}
              role="gridcell"
            >
              {col.editable && isEditing ? (
                <CellEditor
                  initialValue={newRowDraft[col.field] ?? null}
                  config={getEditorConfig(col.field)}
                  initialKey={newRowTriggerKey}
                  row={null as unknown as T}
                  field={col.field}
                  onCommit={(v) => onNewRowCellCommit(col.field, v)}
                  onCancel={() => {
                    setNewRowField(null);
                    setNewRowTriggerKey(null);
                  }}
                  onNavigate={() => {}}
                />
              ) : (
                <>
                  {newRowDraft[col.field] != null && newRowDraft[col.field] !== '' ? (
                    <span className="sp-grid-cell__text">{String(newRowDraft[col.field])}</span>
                  ) : col.editable ? (
                    <span className="sp-grid-new-row__empty-indicator" />
                  ) : null}
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ── Render: Row dispatch ──────────────────────────────────────────────────
  const renderDisplayRow = (dr: DisplayRow<T>) => {
    switch (dr.kind) {
      case 'group':
        return renderGroupRow(dr);
      case 'detail':
        return renderDetailRow(dr);
      case 'new-row':
        return renderNewRow(dr);
      default:
        return renderRow(dr);
    }
  };

  // ── Root classes ──────────────────────────────────────────────────────────
  const rootClasses = [
    'sp-grid-root',
    opts.autoFit ? 'sp-grid--autofit' : '',
    isAutoRowHeight ? 'sp-grid--auto-row-height' : '',
    `sp-grid--density-${density}`,
    (opts.selectionMode && opts.selectionMode !== 'none') || opts.rowHover
      ? 'sp-grid--selectable'
      : '',
    loading ? 'sp-grid--loading' : '',
    opts.editMode === 'cell' ? 'sp-grid--cell-edit' : '',
    opts.editMode === 'row' ? 'sp-grid--row-edit' : '',
    opts.keyboardNav ? 'sp-grid--keynav' : '',
    opts.borderless ? 'sp-grid--borderless' : '',
    opts.rowDraggable ? 'sp-grid--row-draggable' : '',
    hasPinnedLeft || hasPinnedRight ? 'sp-grid--has-pinned' : '',
    opts.treeChildrenField ? 'sp-grid--has-tree' : '',
    opts.detailRenderer ? 'sp-grid--has-detail' : '',
    hasGroupedHeaders ? 'sp-grid--has-col-groups' : '',
    hasInlineFilters ? 'sp-grid--has-inline-filters' : '',
    opts.newRowPosition && opts.editMode ? 'sp-grid--has-new-row' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  // ── CSS variables ─────────────────────────────────────────────────────────
  const cssVars: React.CSSProperties = {
    '--grid-row-h': `${rowHeight}px`,
    '--grid-header-h': `${headerHeight}px`,
    '--grid-filter-h': `${metrics.filterHeight}px`,
    '--grid-aggregate-h': `${metrics.aggregateHeight}px`,
    '--grid-toolbar-h': `${metrics.toolbarHeight}px`,
    '--grid-footer-h': `${metrics.footerHeight}px`,
    '--grid-pagination-h': `${metrics.paginationHeight}px`,
    '--grid-cell-padding-x': `${metrics.cellPaddingX}px`,
    '--grid-auto-cell-padding-y': `${metrics.autoCellPaddingY}px`,
  } as React.CSSProperties;

  return (
    <div className={rootClasses} style={cssVars} {...rest}>
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      {showToolbar && (
        <div className="sp-grid-toolbar">
          <div className="sp-grid-toolbar__left">
            {opts.toolbarButtons?.map((btn) => (
              <button
                key={btn.label}
                className={`sp-grid-toolbar__action-btn${btn.variant === 'danger' ? ' sp-grid-toolbar__action-btn--danger' : ''}`}
                disabled={typeof btn.disabled === 'function' ? btn.disabled() : btn.disabled ?? false}
                title={btn.title ?? btn.label}
                onClick={() => btn.action()}
              >
                {btn.icon && <Icon name={btn.icon} size={12} />}
                {btn.label}
              </button>
            ))}
            {activeFilterCount > 0 && (
              <span className="sp-grid-toolbar__filter-badge">
                <Icon name="filter" size={14} />
                {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
                <button
                  className="sp-grid-toolbar__filter-clear"
                  onClick={clearAllFilters}
                >
                  <Icon name="x" size={12} />
                </button>
              </span>
            )}
            {opts.groupByField && (
              <span className="sp-grid-toolbar__group-badge">
                <Icon name="network" size={14} />
                {t('group')} <strong>{opts.groupByField}</strong>
              </span>
            )}
            {opts.treeChildrenField && (
              <span className="sp-grid-toolbar__tree-badge">
                <Icon name="git-fork" size={14} />
                {t('treeView')}
                <button className="sp-grid-toolbar__tree-btn" onClick={expandAll} title={t('expandAll')}>
                  <Icon name="plus" size={12} />
                </button>
                <button className="sp-grid-toolbar__tree-btn" onClick={collapseAll} title={t('collapseAll')}>
                  <Icon name="minus" size={12} />
                </button>
              </span>
            )}
          </div>
          <div className="sp-grid-toolbar__spacer" />
          <div className="sp-grid-toolbar__right">
            <Popover
              placement="bottom-end"
              offset={6}
              trigger={
                <button
                  className={`sp-grid-toolbar__btn${columnPanelOpen ? ' active' : ''}`}
                  title={t('columns')}
                >
                  <Icon name="columns" size={14} />
                  {t('columns')}
                </button>
              }
            >
              <ColumnPanel
                columns={columns}
                columnStates={columnStates}
                reorder={opts.colReorder ?? false}
                onVisibilityChange={onVisibilityChange}
                onReorderChange={applyColReorder}
              />
            </Popover>
          </div>
        </div>
      )}

      {/* ── Scroll viewport ──────────────────────────────────────────────── */}
      <div className="sp-grid-container" ref={scrollRef}>
        <div
          className="sp-grid-scroll-inner"
          style={{ minWidth: opts.autoFit ? undefined : totalColumnsWidth }}
        >
          {/* Header */}
          <div className="sp-grid-header">
            {hasExpandColumn && (
              <div className="sp-grid-header-cell sp-grid-header-cell--expand" style={{ width: 36, minWidth: 36 }} />
            )}
            {opts.rowDraggable && (
              <div className="sp-grid-header-cell sp-grid-header-cell--drag" style={{ width: 36, minWidth: 36 }} />
            )}
            {opts.editMode === 'row' && (
              <div className="sp-grid-header-cell sp-grid-header-cell--actions" style={{ width: 80, minWidth: 80 }} />
            )}
            {opts.selectionMode === 'multi' && (
              <div className="sp-grid-header-cell sp-grid-header-cell--checkbox" style={{ width: 44, minWidth: 44 }}>
                <span
                  className={`sp-grid-checkbox${allSelected ? ' checked' : ''}${someSelected ? ' indeterminate' : ''}`}
                  onClick={toggleSelectAll}
                  role="checkbox"
                  aria-checked={allSelected ? 'true' : someSelected ? 'mixed' : 'false'}
                >
                  {allSelected && <Icon name="check" size={10} />}
                </span>
              </div>
            )}
            {opts.selectionMode === 'single' && (
              <div className="sp-grid-header-cell sp-grid-header-cell--checkbox" style={{ width: 44, minWidth: 44 }} />
            )}
            {leftPinnedCols.map(renderHeaderCell)}
            {centerCols.map(renderHeaderCell)}
            {rightPinnedCols.map(renderHeaderCell)}
          </div>

          {/* Inline filter row */}
          {hasInlineFilters && (
            <div className="sp-grid-filter-row">
              {hasExpandColumn && <div className="sp-grid-filter-cell sp-grid-filter-cell--spacer" style={{ width: 36, minWidth: 36 }} />}
              {opts.rowDraggable && <div className="sp-grid-filter-cell sp-grid-filter-cell--spacer" style={{ width: 36, minWidth: 36 }} />}
              {opts.editMode === 'row' && <div className="sp-grid-filter-cell sp-grid-filter-cell--spacer" style={{ width: 80, minWidth: 80 }} />}
              {opts.selectionMode && opts.selectionMode !== 'none' && (
                <div className="sp-grid-filter-cell sp-grid-filter-cell--spacer" style={{ width: 44, minWidth: 44 }} />
              )}
              {visibleColumns.map((col) => (
                <div
                  key={col.field}
                  className="sp-grid-filter-cell"
                  style={
                    opts.autoFit
                      ? { flex: col.flex ?? 1, minWidth: col.minWidth ?? 60 }
                      : { width: getColWidth(col), minWidth: col.minWidth ?? 60 }
                  }
                >
                  {col.filterable && getFilterMode(col) === 'inline' && (
                    <>
                      <input
                        className="sp-grid-filter-inline"
                        type="text"
                        placeholder={t('filterValue')}
                        defaultValue={String(getFilter(col.field)?.value ?? '')}
                        onChange={(e) => onInlineFilterInput(col.field, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      {hasFilter(col.field) && (
                        <button
                          className="sp-grid-filter-inline-clear"
                          onClick={(e) => {
                            onFilterClear(col.field);
                            e.stopPropagation();
                          }}
                        >
                          <Icon name="x" size={12} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Body */}
          <div className="sp-grid-body">
            {/* Row drag ghost line */}
            {rowDragGhostY !== null && dragRowIdx !== null && (
              <div
                className="sp-grid-row-drag-ghost"
                style={{ transform: `translateY(${rowDragGhostY}px)` }}
              />
            )}

            {opts.virtualScroll && virtualTotalHeight != null ? (
              <div
                className="sp-grid-virtual-spacer"
                style={{ height: virtualTotalHeight, '--vs-row-h': `${rowHeight}px` } as React.CSSProperties}
              >
                <div
                  className="sp-grid-virtual-window"
                  style={{ transform: `translateY(${virtualOffset}px)` }}
                >
                  {renderedRows.map(renderDisplayRow)}
                </div>
              </div>
            ) : (
              <>
                {loading && opts.loadingMode === 'skeleton' ? (
                  <div className="sp-grid-skeleton-body">
                    {Array.from({ length: Math.ceil(viewportHeight / rowHeight) + 1 }, (_, i) => (
                      <div key={i} className="sp-grid-skeleton-row" style={{ height: rowHeight }}>
                        {visibleColumns.map((col) => (
                          <div
                            key={col.field}
                            className="sp-grid-skeleton-cell"
                            style={
                              opts.autoFit
                                ? { flex: col.flex ?? 1, minWidth: col.minWidth ?? 60 }
                                : { width: getColWidth(col), minWidth: col.minWidth ?? 60 }
                            }
                          >
                            <div className="sp-grid-skeleton-shimmer" />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="sp-grid-rows-container">
                    {displayRows.map(renderDisplayRow)}
                    {displayRows.length === 0 && !loading && (
                      <div className="sp-grid-empty">
                        <Icon name="table" size={24} />
                        <span>{opts.emptyMessage ?? t('noData')}</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Infinite scroll sentinel */}
            {opts.infiniteScroll && (
              <div className="sp-grid-infinite-sentinel">
                {infiniteLoading && (
                  <div className="sp-grid-infinite-loading">
                    <div className="sp-grid-spinner sp-grid-spinner--sm">
                      <div className="sp-grid-spinner__ring" />
                      <div className="sp-grid-spinner__ring sp-grid-spinner__ring--delay" />
                    </div>
                    <span>{t('loadingMore')}</span>
                  </div>
                )}
                {infiniteExhausted && (
                  <div className="sp-grid-infinite-end">
                    <Icon name="check-circle" size={14} />
                    All rows loaded
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Aggregate row */}
          {hasAggregates && (
            <div className="sp-grid-aggregate-row">
              {hasExpandColumn && <div className="sp-grid-agg-cell" style={{ width: 36, minWidth: 36 }} />}
              {opts.rowDraggable && <div className="sp-grid-agg-cell" style={{ width: 36, minWidth: 36 }} />}
              {opts.editMode === 'row' && <div className="sp-grid-agg-cell" style={{ width: 80, minWidth: 80 }} />}
              {opts.selectionMode && opts.selectionMode !== 'none' && (
                <div className="sp-grid-agg-cell" style={{ width: 44, minWidth: 44 }} />
              )}
              {visibleColumns.map((col) => (
                <div
                  key={col.field}
                  className="sp-grid-agg-cell"
                  style={
                    opts.autoFit
                      ? { flex: col.flex ?? 1, minWidth: col.minWidth ?? 60 }
                      : { width: getColWidth(col), minWidth: col.minWidth ?? 60 }
                  }
                >
                  {col.aggregate && (
                    <span className="sp-grid-agg-value">{getAggregateValue(col)}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && opts.loadingMode !== 'skeleton' && (
        <div className="sp-grid-loading-overlay" role="status">
          <div className="sp-grid-spinner">
            <div className="sp-grid-spinner__ring" />
            <div className="sp-grid-spinner__ring sp-grid-spinner__ring--delay" />
          </div>
          <span className="sp-grid-loading-text">
            {opts.serverSide ? 'Fetching data\u2026' : 'Loading\u2026'}
          </span>
        </div>
      )}

      {/* Pagination */}
      {opts.pagination && (
        <div className="sp-grid-pagination">
          <span className="sp-grid-pagination__info">
            {opts.serverSide
              ? `${((currentPage - 1) * pageSize + 1).toLocaleString()}\u2013${Math.min(currentPage * pageSize, totalRows).toLocaleString()} of ${totalRows.toLocaleString()}`
              : `Page ${currentPage} of ${totalPages}`}
          </span>
          <div className="sp-grid-pagination__pages">
            <button
              className="sp-grid-pagination__btn"
              disabled={currentPage === 1}
              onClick={() => goToPage(1)}
              aria-label={t('firstPage')}
            >
              <Icon name="chevrons-left" size={14} />
            </button>
            <button
              className="sp-grid-pagination__btn"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              aria-label={t('previousPage')}
            >
              <Icon name="chevron-left" size={14} />
            </button>
            {pageNumbers.map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="sp-grid-pagination__ellipsis">
                  \u2026
                </span>
              ) : (
                <button
                  key={p}
                  className={`sp-grid-pagination__page${p === currentPage ? ' active' : ''}`}
                  onClick={() => goToPage(+p)}
                >
                  {p}
                </button>
              ),
            )}
            <button
              className="sp-grid-pagination__btn"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
              aria-label={t('nextPage')}
            >
              <Icon name="chevron-right" size={14} />
            </button>
            <button
              className="sp-grid-pagination__btn"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(totalPages)}
              aria-label={t('lastPage')}
            >
              <Icon name="chevrons-right" size={14} />
            </button>
          </div>
          <div className="sp-grid-pagination__size">
            <span className="sp-grid-pagination__size-label">{t('rows')}:</span>
            {(opts.pageSizeOptions ?? [10, 25, 50, 100]).map((s) => (
              <button
                key={s}
                className={`sp-grid-pagination__size-btn${s === pageSize ? ' active' : ''}`}
                onClick={() => {
                  setCurrentPage(1);
                  setPageSizeOverride(s);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="sp-grid-footer">
        <span className="sp-grid-footer__count">
          {totalRows.toLocaleString()} row{totalRows !== 1 ? 's' : ''}
          {opts.serverSide && (
            <span className="sp-grid-footer__server-badge">server</span>
          )}
          {activeFilterCount > 0 && (
            <span className="sp-grid-footer__filtered"> (filtered)</span>
          )}
        </span>
        {opts.selectionMode !== 'none' && selectedIds.size > 0 && (
          <span className="sp-grid-footer__badge sp-grid-footer__badge--selection">
            <strong>{selectedIds.size}</strong> selected
            <button
              className="sp-grid-footer__clear"
              onClick={() => setSelectedIds(new Set())}
            >
              <Icon name="x" size={12} />
            </button>
          </span>
        )}
        {sortColumns.length > 0 && (
          <span className="sp-grid-footer__badge">
            Sorted:{' '}
            {sortColumns.map((s, i) => (
              <span key={s.field}>
                <strong>{s.field}</strong> {s.direction}
                {i < sortColumns.length - 1 ? ', ' : ''}
              </span>
            ))}
            <button
              className="sp-grid-footer__clear"
              onClick={() => applySortColumns([])}
            >
              <Icon name="x" size={12} />
            </button>
          </span>
        )}
        {opts.infiniteScroll && !infiniteExhausted && (
          <span className="sp-grid-footer__infinite-hint">\u2193 Scroll for more</span>
        )}
        {opts.editMode && (
          <span className="sp-grid-footer__edit-hint">
            <Icon name="edit" size={12} />
            {opts.editMode === 'cell'
              ? `${(opts.editTrigger ?? 'dblclick') === 'dblclick' ? 'Dbl-click' : 'Click'} to edit`
              : 'Dbl-click row to edit'}
          </span>
        )}
        {opts.virtualScroll && (
          <span className="sp-grid-footer__virtual-hint" style={{ marginLeft: 'auto' }}>
            Virtual \u00B7 {renderedRows.length} rendered
          </span>
        )}
      </div>
    </div>
  );
}
