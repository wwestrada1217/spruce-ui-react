/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc' | null;
export interface SortEntry {
  field: string;
  direction: 'asc' | 'desc';
}
export type SelectionMode = 'none' | 'single' | 'multi';
export type CellValueFormatter<T = unknown> = (value: unknown, row: T) => string;
export type CellStyleFn<T = unknown> = (value: unknown, row: T) => React.CSSProperties;
export type CellClassFn<T = unknown> = (
  row: T,
  field: string,
  column: ColumnDef<T>,
) => string | string[] | null | undefined;
export type CellEditorType = 'text' | 'number' | 'select' | 'date' | 'boolean' | 'textarea';
export type EditMode = 'cell' | 'row';
export type EditTrigger = 'click' | 'dblclick';
export type FilterMode = 'inline' | 'popover';
export type PinPosition = 'left' | 'right' | null;
export type AggregateType = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'custom';
export type GridDensity = 'dense' | 'default' | 'comfortable';
export type NewRowCommit = 'immediate' | 'onLeave';

export type FilterOperator =
  | 'contains'
  | 'notContains'
  | 'equals'
  | 'notEquals'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'
  | 'blank'
  | 'notBlank';

export interface SelectOption {
  value: unknown;
  label: string;
}
export interface CellEditorConfig {
  type?: CellEditorType;
  options?: SelectOption[] | (() => SelectOption[]);
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  validate?: (newValue: unknown, row: unknown) => boolean | string;
}

export interface CellEditorContext<T = unknown> {
  value: unknown;
  row: T;
  field: string;
  config: CellEditorConfig;
  commit: (value: unknown) => void;
  cancel: () => void;
  navigate: (value: unknown, direction: 'next' | 'prev') => void;
}

export interface CellEditEvent<T = unknown> {
  field: string;
  row: T;
  oldValue: unknown;
  newValue: unknown;
  accept: () => void;
  cancel: () => void;
}
export interface RowEditEvent<T = unknown> {
  row: T;
  changes: Record<string, { oldValue: unknown; newValue: unknown }>;
  accept: () => void;
  cancel: () => void;
}
export interface ColumnFilter {
  operator: FilterOperator;
  value: unknown;
  value2?: unknown;
}
export interface AggregateConfig<T = unknown> {
  type: AggregateType;
  label?: string;
  formatter?: (value: unknown, rows: T[]) => string;
  fn?: (rows: T[]) => unknown;
}
export interface GroupRowMeta {
  isGroup: true;
  groupKey: string;
  groupField: string;
  depth: number;
  rowCount: number;
  collapsed: boolean;
  children?: unknown[];
}
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
export interface ServerSideParams {
  page: number;
  pageSize: number;
  sortField: string | null;
  sortDir: SortDirection;
  sorts: SortEntry[];
  filters: Record<string, ColumnFilter>;
}
export interface ServerSideResult<T> {
  rows: T[];
  total: number;
}

export interface TreeRowMeta<T = unknown> {
  childrenField: string;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
  parent: T | null;
}

export interface DetailPanelContext<T = unknown> {
  row: T;
  index: number;
  close: () => void;
}

export interface ColumnDef<T = unknown> {
  field: string;
  headerName?: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  visible?: boolean;
  sortable?: boolean;
  resizable?: boolean;
  flex?: number;
  cellRenderer?: (value: unknown, row: T) => ReactNode;
  headerRenderer?: (headerName: string, column: ColumnDef<T>) => ReactNode;
  valueFormatter?: CellValueFormatter<T>;
  cellStyleFn?: CellStyleFn<T>;
  cellClass?: string | string[];
  headerClass?: string | string[];
  comparator?: (a: unknown, b: unknown, rowA: T, rowB: T) => number;
  editable?: boolean;
  editor?: CellEditorConfig;
  editorRenderer?: (context: CellEditorContext<T>) => ReactNode;
  filterable?: boolean;
  filterMode?: FilterMode;
  aggregate?: AggregateConfig<T>;
  pinned?: PinPosition;
  headerGroup?: string;
  headerGroupClass?: string | string[];
  wrapText?: boolean;
}

export interface ColumnGroupSpan<T = unknown> {
  groupName: string | null;
  columns: ColumnDef<T>[];
  totalWidth: number;
  isGroup: boolean;
  headerGroupClass?: string | string[];
}
export interface ColumnState {
  field: string;
  width: number;
  visible: boolean;
  sortDirection: SortDirection;
  order: number;
  pinned?: PinPosition;
}

export interface GridToolbarButton {
  label: string;
  icon?: string;
  action: () => void;
  disabled?: boolean | (() => boolean);
  variant?: 'default' | 'danger';
  title?: string;
}

export interface GridOptions<T = unknown> {
  density?: GridDensity;
  rowHeight?: number;
  autoRowHeight?: boolean;
  headerHeight?: number;
  striped?: boolean;
  borderless?: boolean;
  autoFit?: boolean;
  virtualScroll?: boolean;
  overscanCount?: number;
  selectionMode?: SelectionMode;
  rowSelection?: boolean;
  rowHover?: boolean;
  colReorder?: boolean;
  showToolbar?: boolean;
  toolbarButtons?: GridToolbarButton[];
  colResizeMode?: 'live' | 'deferred';
  emptyMessage?: string;
  loading?: boolean;
  loadingMode?: 'spinner' | 'skeleton';
  keyboardNav?: boolean;
  filterMode?: FilterMode;
  showAggregates?: boolean;
  editMode?: EditMode;
  editTrigger?: EditTrigger;
  editOnType?: boolean;
  autoEditOnNavigate?: boolean;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  rowDraggable?: boolean;
  groupByField?: string;
  stickyGroupRows?: boolean;
  groupRowRenderer?: (meta: GroupRowMeta) => ReactNode;
  serverSide?: boolean;
  fetchRows?: (params: ServerSideParams) => Promise<ServerSideResult<T>>;
  infiniteScroll?: boolean;
  infiniteScrollThreshold?: number;
  onLoadMore?: (currentCount: number) => Promise<T[] | void>;
  treeChildrenField?: string;
  treeExpandedByDefault?: boolean;
  detailRenderer?: (context: DetailPanelContext<T>) => ReactNode;
  detailHeight?: number;
  detailMulti?: boolean;
  newRowPosition?: 'top' | 'bottom';
  newRowCommit?: NewRowCommit;
  onNewRow?: (draft: Record<string, unknown>) => void;
  showColumnMenu?: boolean;
  pinControlColumns?: boolean;
  getRowClass?: (row: unknown) => string;
  getCellClass?: CellClassFn<T>;
  onRowClick?: (row: T, index: number) => void;
  onRowDblClick?: (row: T, index: number) => void;
  onCellClick?: (value: unknown, field: string, row: T) => void;
  onColumnStateChange?: (state: ColumnState[]) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  onColReorder?: (newOrder: string[]) => void;
  onCellEdit?: (event: CellEditEvent<T>) => void;
  onRowEdit?: (event: RowEditEvent<T>) => void;
  onFilterChange?: (filters: Record<string, ColumnFilter>) => void;
  onRowDrop?: (dragIdx: number, dropIdx: number, newOrder: T[]) => void;
  onPageChange?: (state: PaginationState) => void;
  onDetailOpen?: (row: T) => void;
  onDetailClose?: (row: T) => void;
  onSortChange?: (sort: { field: string; direction: SortDirection }) => void;
}

export interface SelectionChange<T = unknown> {
  selectedRows: T[];
}

export type DisplayRowKind = 'data' | 'group' | 'tree' | 'detail' | 'new-row';
export interface DisplayRow<T> {
  kind: DisplayRowKind;
  data: unknown;
  absIdx: number;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
  treeId: unknown;
  isGroup: boolean;
}

export const DEFAULT_ROW_H = 32;
export const DEFAULT_OVERSCAN = 10;
export const DEFAULT_DENSITY: GridDensity = 'default';

export const DENSITY_METRICS: Record<
  GridDensity,
  {
    rowHeight: number;
    headerHeight: number;
    filterHeight: number;
    aggregateHeight: number;
    toolbarHeight: number;
    footerHeight: number;
    paginationHeight: number;
    groupHeaderHeight: number;
    leafHeaderHeight: number;
    cellPaddingX: number;
    autoCellPaddingY: number;
  }
> = {
  dense: {
    rowHeight: 26,
    headerHeight: 24,
    filterHeight: 28,
    aggregateHeight: 28,
    toolbarHeight: 32,
    footerHeight: 24,
    paginationHeight: 30,
    groupHeaderHeight: 18,
    leafHeaderHeight: 26,
    cellPaddingX: 8,
    autoCellPaddingY: 4,
  },
  default: {
    rowHeight: DEFAULT_ROW_H,
    headerHeight: 32,
    filterHeight: 32,
    aggregateHeight: 32,
    toolbarHeight: 36,
    footerHeight: 28,
    paginationHeight: 34,
    groupHeaderHeight: 22,
    leafHeaderHeight: 30,
    cellPaddingX: 10,
    autoCellPaddingY: 6,
  },
  comfortable: {
    rowHeight: 38,
    headerHeight: 32,
    filterHeight: 34,
    aggregateHeight: 34,
    toolbarHeight: 40,
    footerHeight: 30,
    paginationHeight: 38,
    groupHeaderHeight: 24,
    leafHeaderHeight: 34,
    cellPaddingX: 12,
    autoCellPaddingY: 8,
  },
};

export const NEW_ROW_ID = '__new_row__';
