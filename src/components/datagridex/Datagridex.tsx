/* eslint-disable react-refresh/only-export-components */
import './Datagridex.css';

import {
  Children,
  forwardRef,
  Fragment,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ForwardedRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type UIEvent,
} from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import {
  createDatagridexDataContextAdapter,
  type DatagridexDataContextAdapter,
} from './datagridex-data-context.js';
import type {
  DatagridexAggregate,
  DatagridexAggregateValueContext,
  DatagridexCellEditor as DatagridexCellEditorRenderer,
  DatagridexCellEditorContext,
  DatagridexCellEditCommit,
  DatagridexCellTemplate as DatagridexCellTemplateRenderer,
  DatagridexCellTemplateContext,
  DatagridexChoiceOption,
  DatagridexColumn,
  DatagridexColumnFilter,
  DatagridexColumnGroup,
  DatagridexColumnGroupOrderChange,
  DatagridexColumnGroupResize,
  DatagridexColumnOrderChange,
  DatagridexColumnPin,
  DatagridexColumnResize,
  DatagridexColumnVisibilityChange,
  DatagridexDataContext,
  DatagridexDataContextOptions,
  DatagridexDetailPane as DatagridexDetailPaneRenderer,
  DatagridexDynamicFilterCondition,
  DatagridexEditCancel,
  DatagridexEditLabels,
  DatagridexEditMode,
  DatagridexEditorType,
  DatagridexFilterChange,
  DatagridexFilterDataType,
  DatagridexFilterMode,
  DatagridexGroupBy,
  DatagridexGroupSort,
  DatagridexHandle,
  DatagridexLeadingRowActions as DatagridexLeadingRowActionsRenderer,
  DatagridexNewRowCommit,
  DatagridexNewRowFactory,
  DatagridexPageChange,
  DatagridexPaginationType,
  DatagridexRowClassName,
  DatagridexRowDetail as DatagridexRowDetailRenderer,
  DatagridexRowDetailExpandable,
  DatagridexRowEditCommit,
  DatagridexRowLabel,
  DatagridexRowOrderChange,
  DatagridexRowStyle,
  DatagridexRowTemplate as DatagridexRowTemplateRenderer,
  DatagridexSelectionChange,
  DatagridexSelectionMode,
  DatagridexSort,
  DatagridexSortChange,
  DatagridexSortDirection,
  DatagridexSortMode,
  DatagridexSortsChange,
  DatagridexTrackBy,
  DatagridexValidationError,
  DatagridexValidationEvent,
  DatagridexVirtualPageRequest,
} from './datagridex-types.js';

export type * from './datagridex-types.js';
export { DatagridexDataContextAdapter, createDatagridexDataContextAdapter } from './datagridex-data-context.js';
export type { DatagridexDataContextAdapter as DatagridexDataContextAdapterType } from './datagridex-data-context.js';

type StateUpdater<T> = T | ((previous: T) => T);

function resolveUpdater<T>(value: StateUpdater<T>, previous: T): T {
  return typeof value === 'function' ? (value as (previous: T) => T)(previous) : value;
}

function useControllableState<T>(
  controlled: T | undefined,
  initial: T,
  onChange?: (value: T) => void,
): [T, (value: StateUpdater<T>) => void] {
  const [internal, setInternal] = useState(initial);
  const value = controlled === undefined ? internal : controlled;
  const setValue = useCallback(
    (next: StateUpdater<T>) => {
      const resolved = resolveUpdater(next, value);
      if (controlled === undefined) setInternal(resolved);
      onChange?.(resolved);
    },
    [controlled, onChange, value],
  );
  return [value, setValue];
}

function defaultTrackBy<T extends object>(row: T, index: number): unknown {
  const candidate = row as Record<string, unknown>;
  return candidate['id'] ?? candidate['key'] ?? row ?? index;
}

function defaultRowLabel<T extends object>(_row: T, index: number): string {
  return `Row ${index + 1}`;
}

function defaultRowDetailExpandable(): boolean {
  return true;
}

function defaultNewRowFactory<T extends object>(): T {
  return {} as T;
}

function valueFor<T extends object>(row: T, column: DatagridexColumn<T>): unknown {
  return column.valueGetter?.(row) ?? (row as Record<string, unknown>)[column.key];
}

function toText(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  return String(value);
}

function formatValue<T extends object>(
  row: T,
  rowIndex: number,
  column: DatagridexColumn<T>,
  locale?: string,
): string {
  const value = valueFor(row, column);
  if (column.valueFormatter) {
    return column.valueFormatter({ value, row, rowIndex, column });
  }
  if (typeof value === 'number') return new Intl.NumberFormat(locale).format(value);
  return toText(value);
}

function compareValues(left: unknown, right: unknown, locale?: string): number {
  if (left === right) return 0;
  if (left === null || left === undefined) return -1;
  if (right === null || right === undefined) return 1;
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  if (left instanceof Date && right instanceof Date) return left.getTime() - right.getTime();
  return String(left).localeCompare(String(right), locale, { numeric: true, sensitivity: 'base' });
}

function normalizeClassName(value: string | readonly string[] | Readonly<Record<string, boolean>> | null | undefined): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(' ');
  if (value) return Object.entries(value).filter(([, enabled]) => enabled).map(([key]) => key).join(' ');
  return '';
}

function normalizeStyle(value: CSSProperties | string | null | undefined): CSSProperties | undefined {
  return typeof value === 'string' ? undefined : value ?? undefined;
}

function columnPinFor<T extends object>(
  column: DatagridexColumn<T>,
  overrides: Readonly<Record<string, DatagridexColumnPin | null | undefined>>,
): DatagridexColumnPin | null {
  return Object.prototype.hasOwnProperty.call(overrides, column.key)
    ? overrides[column.key] ?? null
    : column.pinned ?? null;
}

function sameRows<T>(left: readonly T[], right: readonly T[]): boolean {
  return left.length === right.length && left.every((row, index) => row === right[index]);
}

function filterValueKey(value: unknown): string {
  if (value instanceof Date) return `date:${value.toISOString()}`;
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  return `${typeof value}:${String(value)}`;
}

function evaluateCondition(
  value: unknown,
  condition: DatagridexDynamicFilterCondition,
  dataType: DatagridexFilterDataType = 'text',
  locale?: string,
): boolean {
  const normalizedValue = normalizeFilterValue(value, dataType);
  const normalizedCondition = normalizeFilterValue(condition.value, dataType);
  const normalizedTo = normalizeFilterValue(condition.valueTo, dataType);
  const text = String(normalizedValue ?? '').toLocaleLowerCase(locale);
  const conditionText = String(normalizedCondition ?? '').toLocaleLowerCase(locale);
  const compare = compareValues(normalizedValue, normalizedCondition, locale);
  switch (condition.operator) {
    case 'contains': return text.includes(conditionText);
    case 'notContains': return !text.includes(conditionText);
    case 'startsWith': return text.startsWith(conditionText);
    case 'endsWith': return text.endsWith(conditionText);
    case 'equals': return compare === 0;
    case 'notEquals': return compare !== 0;
    case 'greaterThan': return compare > 0;
    case 'greaterThanOrEqual': return compare >= 0;
    case 'lessThan': return compare < 0;
    case 'lessThanOrEqual': return compare <= 0;
    case 'between': return compare >= 0 && compareValues(normalizedValue, normalizedTo, locale) <= 0;
    case 'isEmpty': return normalizedValue === null || normalizedValue === undefined || text.length === 0;
    case 'isNotEmpty': return normalizedValue !== null && normalizedValue !== undefined && text.length > 0;
  }
}

function normalizeFilterValue(value: unknown, dataType: DatagridexFilterDataType): unknown {
  if (dataType === 'number') {
    const number = Number(value);
    return Number.isNaN(number) ? value : number;
  }
  if (dataType === 'date') {
    const date = value instanceof Date ? value : new Date(String(value));
    return Number.isNaN(date.getTime()) ? value : date;
  }
  if (dataType === 'boolean') {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
  }
  return value;
}

function editorOptions<T extends object>(column: DatagridexColumn<T>): readonly DatagridexChoiceOption[] {
  const options = column.editorOptions?.options;
  if (!Array.isArray(options)) return [];
  const displayField = column.editorOptions?.displayField;
  const valueField = column.editorOptions?.valueField;
  return options.map((option) => {
    if (option !== null && typeof option === 'object') {
      const record = option as Record<string, unknown>;
      const value = valueField ? record[valueField] : record.value ?? option;
      const label = displayField ? record[displayField] : record.label ?? value;
      return { value, label: String(label ?? ''), disabled: record.disabled === true };
    }
    return { value: option, label: String(option ?? '') };
  });
}

function validationMessage<T extends object>(column: DatagridexColumn<T>, rule: string, fallback: string): string {
  return column.validationMessages?.[rule] ?? fallback;
}

function validateValue<T extends object>(
  value: unknown,
  row: T,
  column: DatagridexColumn<T>,
): readonly DatagridexValidationError[] {
  const errors: DatagridexValidationError[] = [];
  const rules = column.rules;
  const required = rules?.required ?? column.required;
  if (required && (value === null || value === undefined || String(value).trim() === '')) {
    errors.push({
      rule: 'required',
      message: typeof required === 'string' ? required : rules?.requiredMessage ?? validationMessage(column, 'required', 'This field is required.'),
    });
  }
  const min = rules?.min ?? column.min;
  if (min !== undefined && compareValues(value, min) < 0) {
    errors.push({ rule: 'min', message: validationMessage(column, 'min', `Value must be at least ${String(min)}.`) });
  }
  const max = rules?.max ?? column.max;
  if (max !== undefined && compareValues(value, max) > 0) {
    errors.push({ rule: 'max', message: validationMessage(column, 'max', `Value must be at most ${String(max)}.`) });
  }
  const text = value === null || value === undefined ? '' : String(value);
  const minLength = rules?.minLength ?? column.minLength;
  if (minLength !== undefined && text.length < minLength) errors.push({ rule: 'minLength', message: `Use at least ${minLength} characters.` });
  const maxLength = rules?.maxLength ?? column.maxLength;
  if (maxLength !== undefined && text.length > maxLength) errors.push({ rule: 'maxLength', message: `Use no more than ${maxLength} characters.` });
  const pattern = rules?.pattern ?? column.pattern;
  if (pattern && !new RegExp(pattern).test(text)) {
    errors.push({ rule: 'pattern', message: rules?.patternMessage ?? validationMessage(column, 'pattern', 'Value has an invalid format.') });
  }

  const validators = [
    ...(column.validator ? (Array.isArray(column.validator) ? column.validator : [column.validator]) : []),
    ...(column.validators ?? []),
    ...(rules?.custom ? (Array.isArray(rules.custom) ? rules.custom : [rules.custom]) : []),
  ];
  validators.forEach((entry) => {
    const rule = typeof entry === 'function' ? { validator: entry } : entry;
    const result = rule.validator(value, row, column);
    const results = Array.isArray(result) ? result : [result];
    results.forEach((item) => {
      if (item === true || item === null || item === undefined) return;
      if (item === false) errors.push({ rule: rule.name ?? 'custom', message: rule.message ?? 'Value is invalid.' });
      else if (typeof item === 'string') errors.push({ rule: rule.name ?? 'custom', message: item });
      else errors.push(item);
    });
  });
  return errors;
}

interface DisplayRow<T extends object> {
  readonly row: T;
  readonly rowIndex: number;
  readonly isNewRow?: boolean;
}

interface GroupItem<T extends object> {
  readonly kind: 'group';
  readonly key: string;
  readonly label: string;
  readonly level: number;
  readonly rows: readonly T[];
  readonly children: readonly GridItem<T>[];
}

interface RowItem<T extends object> {
  readonly kind: 'row';
  readonly display: DisplayRow<T>;
}

type GridItem<T extends object> = GroupItem<T> | RowItem<T>;

export interface DatagridexCellTemplateProps<T extends object> {
  readonly columnKey: string;
  readonly children: DatagridexCellTemplateRenderer<T>;
}

export function DatagridexCellTemplate<T extends object>({ children }: DatagridexCellTemplateProps<T>): null {
  void children;
  return null;
}

export interface DatagridexCellEditorProps<T extends object> {
  readonly columnKey: string;
  readonly children: DatagridexCellEditorRenderer<T>;
}

export function DatagridexCellEditor<T extends object>({ children }: DatagridexCellEditorProps<T>): null {
  void children;
  return null;
}

export interface DatagridexRowDetailProps<T extends object> {
  readonly children: DatagridexRowDetailRenderer<T>;
}

export function DatagridexRowDetail<T extends object>({ children }: DatagridexRowDetailProps<T>): null {
  void children;
  return null;
}

export interface DatagridexDetailPaneProps<T extends object> {
  readonly children: DatagridexDetailPaneRenderer<T>;
}

export function DatagridexDetailPane<T extends object>({ children }: DatagridexDetailPaneProps<T>): null {
  void children;
  return null;
}

export interface DatagridexLeadingRowActionsProps<T extends object> {
  readonly children: DatagridexLeadingRowActionsRenderer<T>;
}

export function DatagridexLeadingRowActions<T extends object>({ children }: DatagridexLeadingRowActionsProps<T>): null {
  void children;
  return null;
}

export interface DatagridexRowTemplateProps<T extends object> {
  readonly children: DatagridexRowTemplateRenderer<T>;
}

export function DatagridexRowTemplate<T extends object>({ children }: DatagridexRowTemplateProps<T>): null {
  void children;
  return null;
}

type DatagridexSlotElement<T extends object> = ReactElement<
  | DatagridexCellTemplateProps<T>
  | DatagridexCellEditorProps<T>
  | DatagridexRowDetailProps<T>
  | DatagridexDetailPaneProps<T>
  | DatagridexLeadingRowActionsProps<T>
  | DatagridexRowTemplateProps<T>
>;

export interface DatagridexProps<T extends object> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  readonly rows?: readonly T[];
  readonly dataContext?: DatagridexDataContext<T> | null;
  readonly dataContextOptions?: DatagridexDataContextOptions<T>;
  readonly columns: readonly DatagridexColumn<T>[];
  readonly columnGroups?: readonly DatagridexColumnGroup[];
  readonly ariaLabel?: string;
  readonly loading?: boolean;
  readonly loadingMessage?: string;
  readonly emptyMessage?: string;
  readonly filterEmptyMessage?: string;
  readonly emptyStateDescription?: string | null;
  readonly filterEmptyStateDescription?: string | null;
  readonly autoHeight?: boolean;
  readonly autoColumnWidth?: boolean;
  readonly fitColumnsToWidth?: boolean;
  readonly reorderable?: boolean;
  readonly showVerticalLines?: boolean;
  readonly defaultColumnWidth?: number;
  readonly sortMode?: DatagridexSortMode;
  readonly sortIndicatorVisibility?: 'hover' | 'always';
  readonly multiSort?: boolean;
  readonly filterIndicatorVisibility?: 'hover' | 'always';
  readonly filterMode?: DatagridexFilterMode;
  readonly locale?: string;
  readonly trackBy?: DatagridexTrackBy<T>;
  readonly editMode?: DatagridexEditMode;
  readonly editOnClick?: boolean;
  readonly editOnType?: boolean;
  readonly editLabels?: Partial<DatagridexEditLabels>;
  readonly rowLabel?: DatagridexRowLabel<T>;
  readonly rowDetails?: boolean;
  readonly expandedRows?: readonly T[];
  readonly onExpandedRowsChange?: (rows: readonly T[]) => void;
  readonly rowDetailExpandable?: DatagridexRowDetailExpandable<T>;
  readonly rowDetailHeight?: number;
  readonly enableNewRow?: boolean;
  readonly newRowFactory?: DatagridexNewRowFactory<T>;
  readonly newRowLabel?: string;
  readonly pagination?: boolean;
  readonly paginationType?: DatagridexPaginationType;
  readonly pageSize?: number;
  readonly pageSizeOptions?: readonly number[];
  readonly virtualScroll?: boolean;
  readonly virtualScrollHeight?: number;
  readonly virtualRowHeight?: number;
  readonly virtualOverscan?: number;
  readonly columnVirtualization?: boolean;
  readonly columnVirtualizationOverscan?: number;
  readonly virtualPaging?: boolean;
  readonly virtualPage?: number;
  readonly onVirtualPageChange?: (page: number) => void;
  readonly virtualTotalRows?: number | null;
  readonly virtualHasPreviousPage?: boolean | null;
  readonly virtualHasNextPage?: boolean | null;
  readonly virtualPagingLoading?: boolean;
  readonly selectionMode?: DatagridexSelectionMode;
  readonly groupSelection?: boolean;
  readonly selectedRows?: readonly T[];
  readonly onSelectedRowsChange?: (rows: readonly T[]) => void;
  readonly stripedRows?: boolean;
  readonly footer?: boolean;
  readonly footerLabel?: string;
  readonly statusbar?: boolean;
  readonly statusbarAriaLabel?: string;
  readonly statusbarShowRowCount?: boolean;
  readonly statusbarShowSelectedRowCount?: boolean;
  readonly statusbarMergePagination?: boolean;
  readonly toolbar?: boolean;
  readonly toolbarAriaLabel?: string;
  readonly toolbarShowColumnSelector?: boolean;
  readonly toolbarShowGroupedColumns?: boolean;
  readonly searchable?: boolean;
  readonly searchTerm?: string;
  readonly onSearchTermChange?: (value: string) => void;
  readonly columnSelector?: boolean;
  readonly columnSelectorLabel?: string;
  readonly hiddenColumnKeys?: readonly string[];
  readonly onHiddenColumnKeysChange?: (keys: readonly string[]) => void;
  readonly groupBy?: DatagridexGroupBy;
  readonly onGroupByChange?: (keys: DatagridexGroupBy) => void;
  readonly stickyGroupHeaders?: boolean;
  readonly groupsExpandedByDefault?: boolean;
  readonly indentGroupedRows?: boolean;
  readonly rowReorder?: boolean;
  readonly rowNumbers?: boolean;
  readonly groupSorting?: boolean;
  readonly groupSorts?: readonly DatagridexGroupSort[];
  readonly onGroupSortsChange?: (sorts: readonly DatagridexGroupSort[]) => void;
  readonly columnMenu?: boolean;
  readonly columnPins?: Readonly<Record<string, DatagridexColumnPin | null | undefined>>;
  readonly onColumnPinsChange?: (pins: Readonly<Record<string, DatagridexColumnPin | null | undefined>>) => void;
  readonly detailPane?: boolean;
  readonly detailPaneWidth?: number;
  readonly detailPaneTitle?: string;
  readonly detailPaneRow?: T | null;
  readonly onDetailPaneRowChange?: (row: T | null) => void;
  readonly leadingRowActionsWidth?: number;
  readonly preventInvalidCommit?: boolean;
  readonly validateOnInput?: boolean;
  readonly rowClass?: DatagridexRowClassName<T>;
  readonly rowStyle?: DatagridexRowStyle<T>;
  readonly cellTemplates?: Readonly<Record<string, DatagridexCellTemplateRenderer<T>>>;
  readonly cellEditors?: Readonly<Record<string, DatagridexCellEditorRenderer<T>>>;
  readonly rowDetail?: DatagridexRowDetailRenderer<T>;
  readonly detailPaneRenderer?: DatagridexDetailPaneRenderer<T>;
  readonly leadingRowActions?: DatagridexLeadingRowActionsRenderer<T>;
  readonly rowTemplate?: DatagridexRowTemplateRenderer<T>;
  readonly toolbarStart?: ReactNode;
  readonly toolbarEnd?: ReactNode;
  readonly statusbarStart?: ReactNode;
  readonly statusbarEnd?: ReactNode;
  readonly onSortChange?: (event: DatagridexSortChange) => void;
  readonly onSortsChange?: (sorts: DatagridexSortsChange) => void;
  readonly onFilterChange?: (filters: DatagridexFilterChange<T>) => void;
  readonly onColumnResize?: (event: DatagridexColumnResize) => void;
  readonly onColumnOrderChange?: (keys: DatagridexColumnOrderChange) => void;
  readonly onColumnVisibilityChange?: (event: DatagridexColumnVisibilityChange) => void;
  readonly onCellEditCommit?: (event: DatagridexCellEditCommit<T>) => void;
  readonly onRowEditCommit?: (event: DatagridexRowEditCommit<T>) => void;
  readonly onNewRowCommit?: (event: DatagridexNewRowCommit<T>) => void;
  readonly onEditCancel?: (event: DatagridexEditCancel<T>) => void;
  readonly onCellValidationFailed?: (event: DatagridexValidationEvent<T>) => void;
  readonly onRowValidationFailed?: (events: readonly DatagridexValidationEvent<T>[]) => void;
  readonly onPageChange?: (event: DatagridexPageChange) => void;
  readonly onPageSizeChange?: (size: number) => void;
  readonly onVirtualPageRequest?: (event: DatagridexVirtualPageRequest) => void;
  readonly onSelectionChange?: (event: DatagridexSelectionChange<T>) => void;
  readonly onRowOrderChange?: (event: DatagridexRowOrderChange<T>) => void;
  readonly onColumnGroupResize?: (event: DatagridexColumnGroupResize) => void;
  readonly onColumnGroupOrderChange?: (keys: DatagridexColumnGroupOrderChange) => void;
  readonly onDataContextSaveComplete?: () => void;
  readonly onDataContextSaveError?: (error: unknown) => void;
  readonly children?: ReactNode;
}

interface ActiveCellEdit<T extends object> {
  readonly row: T;
  readonly rowIndex: number;
  readonly key: string;
  readonly originalValue: unknown;
  readonly isNewRow: boolean;
  readonly value: unknown;
}

interface ActiveRowEdit<T extends object> {
  readonly row: T;
  readonly rowIndex: number;
  readonly values: ReadonlyMap<string, unknown>;
}

interface GroupBucket<T extends object> {
  readonly key: string;
  readonly label: string;
  readonly rows: readonly T[];
}

function slotChildren<T extends object>(children: ReactNode): DatagridexSlotElement<T>[] {
  return Children.toArray(children).filter(isValidElement) as DatagridexSlotElement<T>[];
}

function getSlotProps<T extends object, P>(slots: DatagridexSlotElement<T>[], component: unknown): P | undefined {
  const slot = slots.find((candidate) => candidate.type === component);
  return slot?.props as P | undefined;
}

function getSlotMap<T extends object, P extends { columnKey: string }>(slots: DatagridexSlotElement<T>[], component: unknown): Readonly<Record<string, DatagridexCellTemplateRenderer<T> | DatagridexCellEditorRenderer<T>>> {
  const map: Record<string, DatagridexCellTemplateRenderer<T> | DatagridexCellEditorRenderer<T>> = {};
  slots.forEach((slot) => {
    if (slot.type === component) {
      const props = slot.props as P & { children: DatagridexCellTemplateRenderer<T> | DatagridexCellEditorRenderer<T> };
      map[props.columnKey] = props.children;
    }
  });
  return map;
}

function sortGroups<T extends object>(groups: readonly GroupBucket<T>[], key: string, sorts: readonly DatagridexGroupSort[], columnByKey: ReadonlyMap<string, DatagridexColumn<T>>): GroupBucket<T>[] {
  return [...groups].sort((left, right) => {
    const sort = sorts.find((entry) => entry.key === key);
    if (!sort) return 0;
    const column = columnByKey.get(sort.key);
    if (!column) return 0;
    const result = compareValues(valueFor(left.rows[0], column), valueFor(right.rows[0], column));
    return sort.direction === 'asc' ? result : -result;
  });
}

function buildGroupItems<T extends object>(
  entries: readonly DisplayRow<T>[],
  depth: number,
  path: string,
  groupBy: readonly string[],
  columnByKey: ReadonlyMap<string, DatagridexColumn<T>>,
  groupSorting: boolean,
  groupSorts: readonly DatagridexGroupSort[],
  groupExpanded: ReadonlySet<string>,
  groupsExpandedByDefault: boolean,
  emptyGroupLabel: string,
): readonly GridItem<T>[] {
  const key = groupBy[depth];
  if (!key) return entries.map((display) => ({ kind: 'row', display }));
  const column = columnByKey.get(key);
  if (!column) return entries.map((display) => ({ kind: 'row', display }));
  const groups = new Map<string, GroupBucket<T>>();
  entries.forEach((display) => {
    const raw = valueFor(display.row, column);
    const groupKey = filterValueKey(raw);
    const existing = groups.get(groupKey);
    groups.set(groupKey, existing ? { ...existing, rows: [...existing.rows, display.row] } : { key: groupKey, label: toText(raw) || emptyGroupLabel, rows: [display.row] });
  });
  const ordered = groupSorting ? sortGroups([...groups.values()], key, groupSorts, columnByKey) : [...groups.values()];
  return ordered.flatMap((bucket) => {
    const groupKey = `${path}/${key}:${bucket.key}`;
    const childEntries = entries.filter((entry) => filterValueKey(valueFor(entry.row, column)) === bucket.key);
    const children = buildGroupItems(childEntries, depth + 1, groupKey, groupBy, columnByKey, groupSorting, groupSorts, groupExpanded, groupsExpandedByDefault, emptyGroupLabel);
    const item: GroupItem<T> = { kind: 'group', key: groupKey, label: bucket.label, level: depth, rows: bucket.rows, children };
    return groupExpanded.has(groupKey) || (groupExpanded.size === 0 && groupsExpandedByDefault) ? [item, ...children] : [item];
  });
}

function aggregateValue<T extends object>(aggregate: DatagridexAggregate<T>, rows: readonly T[], column: DatagridexColumn<T>, scope: 'group' | 'footer'): { value: unknown; label: string; formatter?: (context: DatagridexAggregateValueContext<T>) => string } {
  const values = rows.map((row) => valueFor(row, column));
  const definition = typeof aggregate === 'string' ? { type: aggregate } : aggregate;
  let value: unknown;
  if (definition.type === 'custom') value = definition.aggregate({ values, rows, column, scope });
  else if (definition.type === 'count') value = values.length;
  else if (definition.type === 'sum') value = values.reduce<number>((sum, item) => sum + (typeof item === 'number' ? item : Number(item) || 0), 0);
  else if (definition.type === 'avg') value = values.length === 0 ? 0 : values.reduce<number>((sum, item) => sum + (Number(item) || 0), 0) / values.length;
  else if (definition.type === 'min') value = values.length === 0 ? '' : values.reduce((min, item) => compareValues(item, min) < 0 ? item : min, values[0]);
  else value = values.length === 0 ? '' : values.reduce((max, item) => compareValues(item, max) > 0 ? item : max, values[0]);
  return { value, label: definition.label ?? (definition.type === 'custom' ? 'Aggregate' : definition.type), formatter: definition.valueFormatter };
}

function DatagridexInner<T extends object>(props: DatagridexProps<T>, ref: ForwardedRef<DatagridexHandle<T>>): ReactElement {
  const {
    rows = [], dataContext = null, dataContextOptions, columns, columnGroups = [],
    ariaLabel: ariaLabelProp, loading = false, loadingMessage: loadingMessageProp,
    emptyMessage: emptyMessageProp, filterEmptyMessage: filterEmptyMessageProp,
    emptyStateDescription, filterEmptyStateDescription: filterEmptyStateDescriptionProp,
    autoHeight = true, autoColumnWidth = true, fitColumnsToWidth = false, reorderable = true,
    showVerticalLines = false, defaultColumnWidth = 160, sortMode = 'client',
    sortIndicatorVisibility = 'hover', multiSort = false, filterIndicatorVisibility = 'hover',
    filterMode = 'client', locale: localeProp, trackBy = defaultTrackBy, editMode = 'none', editOnClick = false,
    editOnType = false, editLabels = {}, rowLabel = defaultRowLabel, rowDetails = false,
    expandedRows: expandedRowsProp, onExpandedRowsChange, rowDetailExpandable = defaultRowDetailExpandable,
    rowDetailHeight = 112, enableNewRow = false, newRowFactory = defaultNewRowFactory,
    newRowLabel: newRowLabelProp, pagination = false, paginationType = 'compact', pageSize: pageSizeProp,
    pageSizeOptions = [10, 25, 50, 100], virtualScroll = false, virtualScrollHeight = 400,
    virtualRowHeight = 32, virtualOverscan = 6, columnVirtualization = false,
    columnVirtualizationOverscan = 320, virtualPaging = false, virtualPage: virtualPageProp,
    onVirtualPageChange, virtualTotalRows = null, virtualHasPreviousPage = null,
    virtualHasNextPage = null, virtualPagingLoading = false, selectionMode = 'none',
    groupSelection = false, selectedRows: selectedRowsProp, onSelectedRowsChange, stripedRows = false,
    footer = false, footerLabel: footerLabelProp, statusbar = false, statusbarAriaLabel: statusbarAriaLabelProp,
    statusbarShowRowCount = true, statusbarShowSelectedRowCount = true, statusbarMergePagination = false,
    toolbar = false, toolbarAriaLabel: toolbarAriaLabelProp, toolbarShowColumnSelector = true,
    toolbarShowGroupedColumns = true, searchable = false, searchTerm: searchTermProp,
    onSearchTermChange, columnSelector = false, columnSelectorLabel: columnSelectorLabelProp,
    hiddenColumnKeys: hiddenColumnKeysProp, onHiddenColumnKeysChange, groupBy: groupByProp,
    onGroupByChange, stickyGroupHeaders = false, groupsExpandedByDefault = true, indentGroupedRows = true,
    rowReorder = false, rowNumbers = false, groupSorting = false, groupSorts: groupSortsProp,
    onGroupSortsChange, columnMenu = false, columnPins: columnPinsProp, onColumnPinsChange, detailPane = false,
    detailPaneWidth = 320, detailPaneTitle: detailPaneTitleProp, detailPaneRow: detailPaneRowProp,
    onDetailPaneRowChange, leadingRowActionsWidth = 40, preventInvalidCommit = true,
    validateOnInput = true, rowClass, rowStyle, cellTemplates = {}, cellEditors = {}, rowDetail,
    detailPaneRenderer, leadingRowActions, rowTemplate, toolbarStart, toolbarEnd, statusbarStart,
    statusbarEnd, onSortChange, onSortsChange, onFilterChange, onColumnResize, onColumnOrderChange,
    onColumnVisibilityChange, onCellEditCommit, onRowEditCommit, onNewRowCommit, onEditCancel,
    onCellValidationFailed, onRowValidationFailed, onPageChange, onPageSizeChange, onVirtualPageRequest,
    onSelectionChange, onRowOrderChange, onColumnGroupResize, onColumnGroupOrderChange,
    onDataContextSaveComplete, onDataContextSaveError, className, style, children, ...rest
  } = props;

  const { t, locale: i18nLocale, isRtl } = useI18n();
  const ariaLabel = ariaLabelProp ?? t('dataGrid');
  const loadingMessage = loadingMessageProp ?? t('loadingData');
  const emptyMessage = emptyMessageProp ?? t('noRowsToDisplay');
  const filterEmptyMessage = filterEmptyMessageProp ?? t('noMatchingRows');
  const filterEmptyStateDescription = filterEmptyStateDescriptionProp ?? t('clearFilters');
  const newRowLabel = newRowLabelProp ?? t('newRow');
  const footerLabel = footerLabelProp ?? t('summary');
  const statusbarAriaLabel = statusbarAriaLabelProp ?? t('dataGridStatus');
  const toolbarAriaLabel = toolbarAriaLabelProp ?? t('dataGridTools');
  const columnSelectorLabel = columnSelectorLabelProp ?? t('columns');
  const detailPaneTitle = detailPaneTitleProp ?? t('details');
  const locale = localeProp ?? i18nLocale;
  const getRowLabel = useCallback((row: T, index: number) => rowLabel === defaultRowLabel ? `${t('row')} ${index + 1}` : rowLabel(row, index), [rowLabel, t]);

  const instanceId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const headerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [sorts, setSorts] = useState<readonly DatagridexSort[]>([]);
  const [valueFilters, setValueFilters] = useState<ReadonlyMap<string, ReadonlySet<string>>>(new Map());
  const [dynamicFilters, setDynamicFilters] = useState<ReadonlyMap<string, DatagridexDynamicFilterCondition>>(new Map());
  const [filterPanelKey, setFilterPanelKey] = useState<string | null>(null);
  const [columnMenuKey, setColumnMenuKey] = useState<string | null>(null);
  const [columnOrder, setColumnOrder] = useState<readonly string[]>([]);
  const [resizedWidths, setResizedWidths] = useState<ReadonlyMap<string, number>>(new Map());
  const [columnSelectorOpen, setColumnSelectorOpen] = useState(false);
  const [groupExpanded, setGroupExpanded] = useState<ReadonlySet<string>>(new Set());
  const [draggedColumnKey, setDraggedColumnKey] = useState<string | null>(null);
  const [draggedGroupKey, setDraggedGroupKey] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [virtualPageInternal, setVirtualPageInternal] = useState(1);
  const [viewportScrollTop, setViewportScrollTop] = useState(0);
  const [activeCellEdit, setActiveCellEdit] = useState<ActiveCellEdit<T> | null>(null);
  const [activeRowEdit, setActiveRowEdit] = useState<ActiveRowEdit<T> | null>(null);
  const [newRowVersion, setNewRowVersion] = useState(0);
  const [openDetailPaneInternal, setOpenDetailPaneInternal] = useState<T | null>(null);
  const [rowDragIndex, setRowDragIndex] = useState<number | null>(null);
  const [resizing, setResizing] = useState<{ key: string; startX: number; width: number } | null>(null);
  const [virtualViewportHeight, setVirtualViewportHeight] = useState(virtualScrollHeight);

  const [expandedRows, setExpandedRows] = useControllableState(expandedRowsProp, [] as readonly T[], onExpandedRowsChange);
  const [selectedRows, setSelectedRows] = useControllableState(selectedRowsProp, [] as readonly T[], onSelectedRowsChange);
  const [pageSize, setPageSize] = useControllableState(pageSizeProp, 25, onPageSizeChange);
  const [hiddenColumnKeys, setHiddenColumnKeys] = useControllableState(hiddenColumnKeysProp, [] as readonly string[], onHiddenColumnKeysChange);
  const [groupBy, setGroupBy] = useControllableState(groupByProp, [] as readonly string[], onGroupByChange);
  const [groupSorts, setGroupSorts] = useControllableState(groupSortsProp, [] as readonly DatagridexGroupSort[], onGroupSortsChange);
  const [searchTerm, setSearchTerm] = useControllableState(searchTermProp, '', onSearchTermChange);
  const [virtualPage, setVirtualPage] = useControllableState(virtualPageProp, virtualPageInternal, (next) => {
    setVirtualPageInternal(next);
    onVirtualPageChange?.(next);
  });
  const [detailPaneRow, setDetailPaneRow] = useControllableState(detailPaneRowProp, openDetailPaneInternal, (next) => {
    setOpenDetailPaneInternal(next);
    onDetailPaneRowChange?.(next);
  });
  const [columnPins, setColumnPins] = useControllableState(
    columnPinsProp,
    {} as Readonly<Record<string, DatagridexColumnPin | null | undefined>>,
    onColumnPinsChange,
  );

  const contextSubscribe = useCallback((listener: () => void) => dataContext?.subscribe?.(listener) ?? (() => undefined), [dataContext]);
  const contextSnapshot = useCallback(() => dataContext?.getSnapshot?.() ?? 0, [dataContext]);
  useSyncExternalStore(contextSubscribe, contextSnapshot, contextSnapshot);
  const contextAdapter = useMemo<DatagridexDataContextAdapter<T> | null>(
    () => dataContext ? createDatagridexDataContextAdapter(dataContext, dataContextOptions) : null,
    [dataContext, dataContextOptions],
  );
  const resolvedRows = contextAdapter?.rows ?? rows;
  const resolvedLoading = loading || Boolean(contextAdapter?.loading);
  const gridLoading = resolvedLoading || virtualPagingLoading;
  const allColumns = useMemo(() => {
    const byKey = new Map(columns.map((column) => [column.key, column]));
    const configured = columnOrder.filter((key) => byKey.has(key)).map((key) => byKey.get(key)!);
    return [...configured, ...columns.filter((column) => !columnOrder.includes(column.key))];
  }, [columns, columnOrder]);
  const visibleColumns = useMemo(() => {
    const visible = allColumns.filter((column) => !hiddenColumnKeys.includes(column.key));
    return [
      ...visible.filter((column) => columnPinFor(column, columnPins) === 'left'),
      ...visible.filter((column) => columnPinFor(column, columnPins) === null),
      ...visible.filter((column) => columnPinFor(column, columnPins) === 'right'),
    ];
  }, [allColumns, columnPins, hiddenColumnKeys]);
  const columnByKey = useMemo(() => new Map(allColumns.map((column) => [column.key, column])), [allColumns]);
  const leadingColumnCount = (rowDetails ? 1 : 0) + (detailPane ? 1 : 0) + (selectionMode !== 'none' ? 1 : 0) + (rowNumbers ? 1 : 0) + (rowReorder ? 1 : 0) + (editMode === 'row' ? 1 : 0) + (leadingRowActions ? 1 : 0);

  const slots = useMemo(() => slotChildren<T>(children), [children]);
  const slotCellTemplates = useMemo(() => getSlotMap(slots, DatagridexCellTemplate), [slots]);
  const slotCellEditors = useMemo(() => getSlotMap(slots, DatagridexCellEditor), [slots]);
  const rowDetailSlot = useMemo(() => getSlotProps<T, DatagridexRowDetailProps<T>>(slots, DatagridexRowDetail)?.children, [slots]);
  const detailPaneSlot = useMemo(() => getSlotProps<T, DatagridexDetailPaneProps<T>>(slots, DatagridexDetailPane)?.children, [slots]);
  const leadingActionsSlot = useMemo(() => getSlotProps<T, DatagridexLeadingRowActionsProps<T>>(slots, DatagridexLeadingRowActions)?.children, [slots]);
  const rowTemplateSlot = useMemo(() => getSlotProps<T, DatagridexRowTemplateProps<T>>(slots, DatagridexRowTemplate)?.children, [slots]);
  const resolvedCellTemplates = { ...slotCellTemplates, ...cellTemplates } as Readonly<Record<string, DatagridexCellTemplateRenderer<T>>>;
  const resolvedCellEditors = { ...slotCellEditors, ...cellEditors } as Readonly<Record<string, DatagridexCellEditorRenderer<T>>>;
  const resolvedRowDetail = rowDetail ?? rowDetailSlot;
  const resolvedDetailPane = detailPaneRenderer ?? detailPaneSlot;
  const resolvedLeadingActions = leadingRowActions ?? leadingActionsSlot;
  const resolvedRowTemplate = rowTemplate ?? rowTemplateSlot;

  const format = useCallback((row: T, index: number, column: DatagridexColumn<T>) => formatValue(row, index, column, locale), [locale]);
  const filterOptions = useCallback((column: DatagridexColumn<T>) => {
    const seen = new Map<string, { value: unknown; row: T }>();
    resolvedRows.forEach((row) => {
      const value = valueFor(row, column);
      const key = filterValueKey(value);
      if (!seen.has(key)) seen.set(key, { value, row });
    });
    return [...seen.values()];
  }, [resolvedRows]);
  const filteredRows = useMemo(() => {
    if (filterMode === 'manual') return [...resolvedRows];
    const query = searchTerm.trim().toLocaleLowerCase(locale);
    return resolvedRows.filter((row, rowIndex) => {
      if (query && !visibleColumns.some((column) => format(row, rowIndex, column).toLocaleLowerCase(locale).includes(query))) return false;
      for (const column of allColumns) {
        const values = valueFilters.get(column.key);
        if (values) {
          const selectedValues = resolvedRows
            .map((candidate) => valueFor(candidate, column))
            .filter((candidate, candidateIndex, source) =>
              values.has(filterValueKey(candidate)) &&
              source.findIndex((value) => filterValueKey(value) === filterValueKey(candidate)) === candidateIndex,
            );
          if (column.filterPredicate && !column.filterPredicate(valueFor(row, column), selectedValues, row)) return false;
          if (!column.filterPredicate && !values.has(filterValueKey(valueFor(row, column)))) return false;
        }
        const condition = dynamicFilters.get(column.key);
        if (condition && !evaluateCondition(valueFor(row, column), condition, column.filterDataType, locale)) return false;
      }
      return true;
    });
  }, [allColumns, dynamicFilters, filterMode, format, locale, resolvedRows, searchTerm, valueFilters, visibleColumns]);
  const sortedRows = useMemo(() => {
    if (sortMode === 'manual' || sorts.length === 0) return [...filteredRows];
    return filteredRows.map((row, index) => ({ row, index })).sort((left, right) => {
      for (const sort of sorts) {
        const column = columnByKey.get(sort.key);
        if (!column) continue;
        const result = column.sortComparator
          ? column.sortComparator(valueFor(left.row, column), valueFor(right.row, column), left.row, right.row)
          : compareValues(valueFor(left.row, column), valueFor(right.row, column), locale);
        if (result !== 0) return sort.direction === 'asc' ? result : -result;
      }
      return left.index - right.index;
    }).map(({ row }) => row);
  }, [columnByKey, filteredRows, locale, sortMode, sorts]);
  const totalRows = virtualPaging ? virtualTotalRows ?? resolvedRows.length : sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / Math.max(1, pageSize)));
  const currentPage = virtualPaging ? virtualPage : Math.min(page, totalPages);
  const pagedRows = virtualPaging || !pagination ? sortedRows : sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const newRow = useMemo(() => { void newRowVersion; return newRowFactory(); }, [newRowFactory, newRowVersion]);
  const displayRows = useMemo<readonly DisplayRow<T>[]>(() => {
    const result: DisplayRow<T>[] = pagedRows.map((row, index) => ({ row, rowIndex: (currentPage - 1) * pageSize + index }));
    if (enableNewRow && editMode === 'cell') result.push({ row: newRow, rowIndex: result.length, isNewRow: true });
    return result;
  }, [currentPage, editMode, enableNewRow, newRow, pageSize, pagedRows]);
  const visibleDataRows = displayRows.filter((entry) => !entry.isNewRow).map((entry) => entry.row);
  const rowSpanPlan = useMemo(() => {
    const plan = new Map<string, number>();
    if (virtualScroll || virtualPaging || groupBy.length > 0 || expandedRows.length > 0) return plan;
    const dataRows = displayRows.filter((entry) => !entry.isNewRow);
    const sourceRows = dataRows.map((entry) => entry.row);
    visibleColumns.forEach((column) => {
      let coveredThrough = -1;
      dataRows.forEach((display, index) => {
        const key = `${display.rowIndex}:${column.key}`;
        if (index <= coveredThrough) {
          plan.set(key, 0);
          return;
        }
        const configured = typeof column.rowSpan === 'function'
          ? column.rowSpan({
            value: valueFor(display.row, column),
            row: display.row,
            rowIndex: display.rowIndex,
            column,
            rows: sourceRows,
          })
          : column.rowSpan;
        const span = typeof configured === 'number' && Number.isFinite(configured)
          ? Math.max(1, Math.min(Math.floor(configured), dataRows.length - index))
          : 1;
        plan.set(key, span);
        coveredThrough = index + span - 1;
      });
    });
    return plan;
  }, [displayRows, expandedRows.length, groupBy.length, virtualPaging, virtualScroll, visibleColumns]);
  const isCellCoveredByRowSpan = useCallback((rowIndex: number, key: string) => rowSpanPlan.get(`${rowIndex}:${key}`) === 0, [rowSpanPlan]);
  const cellRowSpan = useCallback((rowIndex: number, key: string) => rowSpanPlan.get(`${rowIndex}:${key}`) ?? 1, [rowSpanPlan]);

  const gridItems = useMemo(
    () => buildGroupItems(displayRows, 0, '', groupBy, columnByKey, groupSorting, groupSorts, groupExpanded, groupsExpandedByDefault, t('none')),
    [columnByKey, displayRows, groupBy, groupExpanded, groupSorting, groupSorts, groupsExpandedByDefault, t],
  );

  const activeItemCount = gridItems.length;
  const virtualStart = virtualScroll ? Math.max(0, Math.floor(viewportScrollTop / virtualRowHeight) - virtualOverscan) : 0;
  const virtualEnd = virtualScroll ? Math.min(activeItemCount, Math.ceil((viewportScrollTop + virtualViewportHeight) / virtualRowHeight) + virtualOverscan) : activeItemCount;
  const renderedItems = virtualScroll ? gridItems.slice(virtualStart, virtualEnd) : gridItems;
  const estimatedWidth = useCallback((column: DatagridexColumn<T>): number => {
    const resized = resizedWidths.get(column.key);
    if (resized) return resized;
    if (typeof column.width === 'number') return column.width;
    if (typeof column.width === 'string' && column.width.endsWith('%')) return Math.max(column.minWidth ?? 96, defaultColumnWidth);
    return column.minWidth ?? defaultColumnWidth;
  }, [defaultColumnWidth, resizedWidths]);
  const totalGridWidth = visibleColumns.reduce((sum, column) => sum + estimatedWidth(column), 0);
  const utilityColumnWidth = leadingColumnCount * 40;
  const pinnedOffsets = useMemo(() => {
    const left = new Map<string, number>();
    const right = new Map<string, number>();
    let leftOffset = utilityColumnWidth;
    let rightOffset = 0;
    visibleColumns.forEach((column) => {
      if (columnPinFor(column, columnPins) === 'left') {
        left.set(column.key, leftOffset);
        leftOffset += estimatedWidth(column);
      }
    });
    [...visibleColumns].reverse().forEach((column) => {
      if (columnPinFor(column, columnPins) === 'right') {
        right.set(column.key, rightOffset);
        rightOffset += estimatedWidth(column);
      }
    });
    return { left, right };
  }, [columnPins, estimatedWidth, utilityColumnWidth, visibleColumns]);
  const leadingTemplate = leadingColumnCount > 0 ? `repeat(${leadingColumnCount}, auto) ` : '';
  const gridTemplateColumns = `${leadingTemplate}${visibleColumns.map((column) => {
    const width = column.width;
    if (typeof width === 'string' && width.endsWith('%')) return width;
    if (typeof width === 'number' || resizedWidths.has(column.key)) return `${estimatedWidth(column)}px`;
    return autoColumnWidth && !fitColumnsToWidth ? `minmax(${column.minWidth ?? 96}px, ${column.flex ? `${column.flex}fr` : 'max-content'})` : `minmax(${column.minWidth ?? 96}px, 1fr)`;
  }).join(' ')}`;

  useEffect(() => {
    if (!virtualScroll) return;
    const observer = new ResizeObserver((entries) => setVirtualViewportHeight(entries[0]?.contentRect.height ?? virtualScrollHeight));
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [virtualScroll, virtualScrollHeight]);

  useEffect(() => {
    if (!contextAdapter?.synchronizeSelection) return;
    const current = contextAdapter.currentRow();
    if (current && selectionMode !== 'multiple' && !selectedRows.includes(current)) setSelectedRows([current]);
  }, [contextAdapter, selectedRows, selectionMode, setSelectedRows]);

  useEffect(() => {
    if (!resizing) return;
    const move = (event: globalThis.MouseEvent) => {
      const column = columnByKey.get(resizing.key);
      if (!column) return;
      const delta = isRtl ? resizing.startX - event.clientX : event.clientX - resizing.startX;
      const width = Math.max(column.minWidth ?? 96, Math.min(column.maxWidth ?? 480, resizing.width + delta));
      setResizedWidths((current) => {
        const next = new Map(current);
        next.set(resizing.key, width);
        return next;
      });
    };
    const up = () => {
      setResizing(null);
      const width = resizedWidths.get(resizing.key) ?? resizing.width;
      onColumnResize?.({ key: resizing.key, width });
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up, { once: true });
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, [columnByKey, isRtl, onColumnResize, resizing, resizedWidths]);

  const emitFilters = useCallback((nextValues: ReadonlyMap<string, ReadonlySet<string>>, nextDynamic: ReadonlyMap<string, DatagridexDynamicFilterCondition>) => {
    const filters: DatagridexColumnFilter<T>[] = [];
    allColumns.forEach((column) => {
      const values = nextValues.get(column.key);
      const condition = nextDynamic.get(column.key);
      if (values || condition) {
        const selectedValues = values
          ? filterOptions(column)
            .filter((option) => values.has(filterValueKey(option.value)))
            .map((option) => option.value)
          : [];
        filters.push({ key: column.key, column, values: selectedValues, ...(condition ? { condition } : {}) });
      }
    });
    onFilterChange?.(filters);
  }, [allColumns, filterOptions, onFilterChange]);

  const setSort = useCallback((key: string, direction: DatagridexSortDirection) => {
    const column = columnByKey.get(key);
    if (!column || column.sortable === false) return;
    setSorts((current) => {
      const next = !multiSort ? (direction ? [{ key, direction }] : []) : direction === null ? current.filter((sort) => sort.key !== key) : current.some((sort) => sort.key === key) ? current.map((sort) => sort.key === key ? { key, direction } : sort) : [...current, { key, direction }];
      onSortChange?.({ key, direction });
      onSortsChange?.(next);
      setPage(1);
      return next;
    });
  }, [columnByKey, multiSort, onSortChange, onSortsChange]);

  const cycleSort = useCallback((key: string) => {
    const current = sorts.find((sort) => sort.key === key);
    setSort(key, current?.direction === undefined ? 'asc' : current.direction === 'asc' ? 'desc' : null);
  }, [setSort, sorts]);

  const updateColumnOrder = useCallback((key: string, targetKey: string, after = false) => {
    if (key === targetKey || !reorderable) return;
    const keys = allColumns.map((column) => column.key);
    const from = keys.indexOf(key);
    const target = keys.indexOf(targetKey);
    if (from < 0 || target < 0) return;
    const next = [...keys];
    next.splice(from, 1);
    const destination = next.indexOf(targetKey) + (after ? 1 : 0);
    next.splice(destination, 0, key);
    setColumnOrder(next);
    onColumnOrderChange?.(next);
  }, [allColumns, onColumnOrderChange, reorderable]);

  const changeSelection = useCallback((row: T, selected: boolean) => {
    if (selectionMode === 'none') return;
    const next = selectionMode === 'single' ? selected ? [row] : [] : selected ? selectedRows.includes(row) ? selectedRows : [...selectedRows, row] : selectedRows.filter((candidate) => candidate !== row);
    if (sameRows(next, selectedRows)) return;
    setSelectedRows(next);
    if (selected) contextAdapter?.navigateTo(row);
    onSelectionChange?.({ selectedRows: next, changedRow: row, selected });
  }, [contextAdapter, onSelectionChange, selectedRows, selectionMode, setSelectedRows]);

  const clearSelection = useCallback(() => {
    if (selectedRows.length === 0) return;
    setSelectedRows([]);
    onSelectionChange?.({ selectedRows: [], changedRow: null, selected: false });
  }, [onSelectionChange, selectedRows.length, setSelectedRows]);

  const setRowsSelected = useCallback((rowsToChange: readonly T[], selected: boolean) => {
    if (selectionMode !== 'multiple') return;
    const rowSet = new Set(rowsToChange);
    const next = selected ? [...selectedRows, ...rowsToChange.filter((row) => !selectedRows.includes(row))] : selectedRows.filter((row) => !rowSet.has(row));
    setSelectedRows(next);
    onSelectionChange?.({ selectedRows: next, changedRow: null, selected });
  }, [onSelectionChange, selectedRows, selectionMode, setSelectedRows]);

  const isEditable = useCallback((row: T, column: DatagridexColumn<T>) => {
    const editable = typeof column.editable === 'function' ? column.editable(row) : column.editable === true;
    const readonly = typeof column.readonly === 'function' ? column.readonly(row) : column.readonly === true;
    return editable && !readonly && editMode !== 'none';
  }, [editMode]);

  const editorType = useCallback((row: T, column: DatagridexColumn<T>): DatagridexEditorType => {
    if (column.editorType) return column.editorType;
    const value = valueFor(row, column);
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'checkbox';
    return 'text';
  }, []);

  const initialEditorValue = useCallback((row: T, column: DatagridexColumn<T>): unknown => {
    const value = valueFor(row, column);
    if (column.editorValueFormatter) return column.editorValueFormatter(value, row);
    if ((editorType(row, column) === 'select' || editorType(row, column) === 'combobox' || editorType(row, column) === 'grid-combobox') && column.editorOptions?.useDisplayValue) {
      return editorOptions(column).find((option) => Object.is(option.value, value))?.label ?? value;
    }
    return editorType(row, column) === 'number' ? value === null || value === undefined ? '' : String(value) : value;
  }, [editorType]);

  const parseEditorValue = useCallback((value: unknown, row: T, column: DatagridexColumn<T>): unknown => {
    let next = value;
    if (editorType(row, column) === 'number') next = value === '' ? null : Number(value);
    if (editorType(row, column) === 'checkbox') next = Boolean(value);
    if (editorType(row, column) === 'select' || editorType(row, column) === 'combobox' || editorType(row, column) === 'grid-combobox') {
      const option = editorOptions(column).find((candidate) => String(candidate.value) === String(value) || candidate.label === String(value));
      if (option) next = column.editorOptions?.saveDisplayField ? option.label : option.value;
    }
    return column.valueParser?.(next, row) ?? next;
  }, [editorType]);

  const focusCell = useCallback((rowIndex: number, key: string) => {
    requestAnimationFrame(() => document.getElementById(`${instanceId}-cell-${rowIndex}-${key}`)?.focus());
  }, [instanceId]);

  const startCellEdit = useCallback((rowIndex: number, key: string, replacementValue?: unknown) => {
    if (editMode !== 'cell') return;
    const display = displayRows[rowIndex];
    const column = columnByKey.get(key);
    if (!display || !column || display.isNewRow && !enableNewRow || !isEditable(display.row, column)) return;
    const originalValue = display.isNewRow ? '' : valueFor(display.row, column);
    setActiveCellEdit({ row: display.row, rowIndex, key, originalValue, isNewRow: Boolean(display.isNewRow), value: replacementValue ?? initialEditorValue(display.row, column) });
  }, [columnByKey, displayRows, editMode, enableNewRow, initialEditorValue, isEditable]);

  const updateCellDraft = useCallback((value: unknown) => setActiveCellEdit((current) => current ? { ...current, value } : current), []);

  const commitCellEdit = useCallback((restoreFocus = true) => {
    const edit = activeCellEdit;
    if (!edit) return;
    const column = columnByKey.get(edit.key);
    if (!column) return;
    const value = parseEditorValue(edit.value, edit.row, column);
    const errors = validateValue(value, edit.row, column);
    if (errors.length > 0) {
      onCellValidationFailed?.({ row: edit.row, rowIndex: edit.rowIndex, column, key: edit.key, value, errors });
      if (preventInvalidCommit) return;
    }
    setActiveCellEdit(null);
    if (edit.isNewRow) {
      const row = { ...edit.row, [column.key]: value } as T;
      const committedRow = contextAdapter?.add(row, false) ?? row;
      onNewRowCommit?.({ row: committedRow, rowIndex: edit.rowIndex, column, key: column.key, value });
      setNewRowVersion((version) => version + 1);
    } else {
      const previousValue = valueFor(edit.row, column);
      if (!Object.is(previousValue, value)) {
        contextAdapter?.patch(edit.row, { [column.key]: value });
        onCellEditCommit?.({ row: edit.row, rowIndex: edit.rowIndex, column, key: edit.key, previousValue, value });
      }
    }
    if (restoreFocus) focusCell(edit.rowIndex, edit.key);
  }, [activeCellEdit, columnByKey, contextAdapter, focusCell, onCellEditCommit, onCellValidationFailed, onNewRowCommit, parseEditorValue, preventInvalidCommit]);

  const startRowEdit = useCallback((rowIndex: number, focusKey?: string) => {
    if (editMode !== 'row' || activeRowEdit) return;
    const display = displayRows[rowIndex];
    if (!display || display.isNewRow) return;
    const values = new Map<string, unknown>();
    visibleColumns.forEach((column) => { if (isEditable(display.row, column)) values.set(column.key, initialEditorValue(display.row, column)); });
    if (values.size === 0) return;
    setActiveRowEdit({ row: display.row, rowIndex, values });
    focusCell(rowIndex, focusKey ?? values.keys().next().value ?? visibleColumns[0]?.key ?? '');
  }, [activeRowEdit, displayRows, editMode, focusCell, initialEditorValue, isEditable, visibleColumns]);

  const updateRowDraft = useCallback((key: string, value: unknown) => setActiveRowEdit((current) => {
    if (!current) return current;
    const values = new Map(current.values);
    values.set(key, value);
    return { ...current, values };
  }), []);

  const commitRowEdit = useCallback(() => {
    const edit = activeRowEdit;
    if (!edit) return;
    const changes: Record<string, unknown> = {};
    const errors: DatagridexValidationEvent<T>[] = [];
    visibleColumns.forEach((column) => {
      if (!isEditable(edit.row, column)) return;
      const draft = edit.values.get(column.key);
      if (draft === undefined) return;
      const value = parseEditorValue(draft, edit.row, column);
      const cellErrors = validateValue(value, edit.row, column);
      if (cellErrors.length > 0) errors.push({ row: edit.row, rowIndex: edit.rowIndex, column, key: column.key, value, errors: cellErrors });
      if (!Object.is(valueFor(edit.row, column), value)) changes[column.key] = value;
    });
    if (errors.length > 0) {
      onRowValidationFailed?.(errors);
      if (preventInvalidCommit) return;
    }
    setActiveRowEdit(null);
    if (Object.keys(changes).length > 0) contextAdapter?.patch(edit.row, changes);
    onRowEditCommit?.({ row: edit.row, rowIndex: edit.rowIndex, changes });
  }, [activeRowEdit, contextAdapter, isEditable, onRowEditCommit, onRowValidationFailed, parseEditorValue, preventInvalidCommit, visibleColumns]);

  const cancelEditing = useCallback(() => {
    if (activeCellEdit) {
      const edit = activeCellEdit;
      setActiveCellEdit(null);
      onEditCancel?.({ mode: 'cell', row: edit.row, rowIndex: edit.rowIndex, key: edit.key });
      focusCell(edit.rowIndex, edit.key);
    } else if (activeRowEdit) {
      const edit = activeRowEdit;
      setActiveRowEdit(null);
      onEditCancel?.({ mode: 'row', row: edit.row, rowIndex: edit.rowIndex });
      focusCell(edit.rowIndex, visibleColumns[0]?.key ?? '');
    }
  }, [activeCellEdit, activeRowEdit, focusCell, onEditCancel, visibleColumns]);

  const moveEditableCell = useCallback((rowIndex: number, key: string, rowDelta: number, columnDelta: number) => {
    const currentIndex = visibleColumns.findIndex((column) => column.key === key);
    let nextRow = rowIndex + rowDelta;
    let nextColumn = currentIndex + columnDelta;
    while (nextRow >= 0 && nextRow < displayRows.length) {
      while (nextColumn >= 0 && nextColumn < visibleColumns.length) {
        const candidate = visibleColumns[nextColumn];
        const row = displayRows[nextRow]?.row;
        if (row && isEditable(row, candidate)) {
          focusCell(nextRow, candidate.key);
          return;
        }
        nextColumn += columnDelta || 1;
      }
      nextRow += rowDelta || 1;
      nextColumn = columnDelta < 0 ? visibleColumns.length - 1 : 0;
    }
  }, [displayRows, focusCell, isEditable, visibleColumns]);

  const renderEditor = (display: DisplayRow<T>, column: DatagridexColumn<T>, value: unknown, update: (value: unknown) => void, commit: () => void, cancel: () => void): ReactNode => {
    const errors = validateOnInput ? validateValue(parseEditorValue(value, display.row, column), display.row, column) : [];
    const context: DatagridexCellEditorContext<T> = { $implicit: value, value, originalValue: valueFor(display.row, column), row: display.row, rowIndex: display.rowIndex, column, invalid: errors.length > 0, errors, firstError: errors[0]?.message ?? null, update, commit, cancel };
    const custom = resolvedCellEditors[column.key];
    if (custom || editorType(display.row, column) === 'custom') return custom ? custom(context) : null;
    const type = editorType(display.row, column);
    const common = { className: 'sp-datagridex__editor-control', autoFocus: true, onKeyDown: (event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (event.key === 'Escape') { event.preventDefault(); cancel(); }
      if (event.key === 'Enter' && type !== 'select') { event.preventDefault(); commit(); }
      if (event.key === 'Tab') { event.preventDefault(); commit(); moveEditableCell(display.rowIndex, column.key, 0, event.shiftKey ? -1 : 1); }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); commit(); moveEditableCell(display.rowIndex, column.key, 0, event.key === 'ArrowLeft' ? -1 : 1); }
    } };
    if (type === 'checkbox') return <input {...common} type="checkbox" checked={Boolean(value)} aria-label={`Edit ${column.header}`} onChange={(event) => { update(event.target.checked); if (editMode === 'cell') commit(); }} />;
    if (type === 'select') {
      const options = editorOptions(column);
      return <select {...common} value={String(value ?? '')} multiple={column.editorOptions?.multiple} onChange={(event) => update(column.editorOptions?.multiple ? [...event.currentTarget.selectedOptions].map((option) => option.value) : event.target.value)}>{!column.editorOptions?.multiple && <option value="">{column.editorOptions?.placeholder ?? t('select')}</option>}{options.map((option) => <option key={String(option.value)} value={String(option.value)} disabled={option.disabled}>{option.label}</option>)}</select>;
    }
    if (type === 'combobox' || type === 'grid-combobox') {
      const options = editorOptions(column);
      const listId = `${instanceId}-editor-options-${display.rowIndex}-${column.key}`;
      return <><input {...common} type="text" role="combobox" aria-autocomplete="list" list={listId} value={String(value ?? '')} placeholder={column.editorOptions?.placeholder} onChange={(event) => update(event.target.value)} onBlur={() => commit()} /><datalist id={listId}>{options.map((option) => <option key={String(option.value)} value={String(option.value)} label={option.label} />)}</datalist></>;
    }
    const minDate = column.editorOptions?.minDate ?? (column.min instanceof Date ? column.min.toISOString().slice(0, 10) : typeof column.min === 'string' ? column.min : undefined);
    const maxDate = column.editorOptions?.maxDate ?? (column.max instanceof Date ? column.max.toISOString().slice(0, 10) : typeof column.max === 'string' ? column.max : undefined);
    const dateIsAllowed = (next: string) => type !== 'date' || (!column.editorOptions?.disabledDates?.includes(next) && (column.editorOptions?.dateFilter?.(next) ?? true));
    return <input {...common} type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'} value={String(value ?? '')} placeholder={column.editorOptions?.placeholder} min={type === 'date' ? minDate : undefined} max={type === 'date' ? maxDate : undefined} onChange={(event) => { const next = event.target.value; if (dateIsAllowed(next)) update(type === 'number' ? next : next); }} onBlur={() => commit()} />;
  };

  const toggleDetails = useCallback((row: T) => {
    if (!rowDetails) return;
    const next = expandedRows.includes(row) ? expandedRows.filter((candidate) => candidate !== row) : [...expandedRows, row];
    setExpandedRows(next);
  }, [expandedRows, rowDetails, setExpandedRows]);

  const setDetailRow = useCallback((row: T | null) => setDetailPaneRow(row), [setDetailPaneRow]);

  const goToPage = useCallback((nextPage: number, trigger: 'api' | 'button' | 'scroll' = 'api') => {
    if (virtualPaging) {
      const safe = Math.max(1, Math.floor(nextPage));
      if (safe === currentPage) return;
      setVirtualPage(safe);
      onVirtualPageRequest?.({ page: safe, pageSize, direction: safe < currentPage ? 'previous' : 'next', trigger });
      return;
    }
    if (!pagination) return;
    const safe = Math.min(totalPages, Math.max(1, Math.floor(nextPage)));
    if (safe === currentPage) return;
    setPage(safe);
    onPageChange?.({ page: safe, pageSize, totalRows, totalPages });
  }, [currentPage, onPageChange, onVirtualPageRequest, pageSize, pagination, setVirtualPage, totalPages, totalRows, virtualPaging]);

  const changePageSize = useCallback((nextSize: number) => {
    const size = Math.max(1, Math.floor(nextSize));
    if (size === pageSize) return;
    setPageSize(size);
    setPage(1);
    if (!virtualPaging) {
      const nextTotalPages = Math.max(1, Math.ceil(totalRows / size));
      onPageChange?.({ page: 1, pageSize: size, totalRows, totalPages: nextTotalPages });
    }
  }, [onPageChange, pageSize, setPageSize, totalRows, virtualPaging]);

  const setColumnVisible = useCallback((key: string, visible: boolean) => {
    const nextHidden = visible ? hiddenColumnKeys.filter((candidate) => candidate !== key) : [...hiddenColumnKeys, key];
    if (!visible && visibleColumns.length <= 1) return;
    setHiddenColumnKeys(nextHidden);
    onColumnVisibilityChange?.({ visibleKeys: allColumns.map((column) => column.key).filter((candidate) => !nextHidden.includes(candidate)), hiddenKeys: allColumns.map((column) => column.key).filter((candidate) => nextHidden.includes(candidate)) });
  }, [allColumns, hiddenColumnKeys, onColumnVisibilityChange, setHiddenColumnKeys, visibleColumns.length]);

  const setColumnPin = useCallback((key: string, pin: DatagridexColumnPin | null) => {
    if (!allColumns.some((column) => column.key === key)) return;
    setColumnPins({ ...columnPins, [key]: pin });
  }, [allColumns, columnPins, setColumnPins]);

  const setGrouping = useCallback((keys: readonly string[]) => {
    const known = new Set(allColumns.map((column) => column.key));
    const next = keys.filter((key, index) => known.has(key) && keys.indexOf(key) === index);
    setGroupBy(next);
    setGroupSorts(groupSorts.filter((sort) => next.includes(sort.key)));
  }, [allColumns, groupSorts, setGroupBy, setGroupSorts]);

  const toggleGroupSort = useCallback((key: string) => {
    if (!groupSorting || !groupBy.includes(key)) return;
    const current = groupSorts.find((sort) => sort.key === key)?.direction;
    const next = groupSorts.filter((sort) => sort.key !== key);
    setGroupSorts([...next, { key, direction: current === 'asc' ? 'desc' : 'asc' }]);
  }, [groupBy, groupSorts, groupSorting, setGroupSorts]);

  const moveGrouping = useCallback((sourceKey: string, targetKey: string, after = false) => {
    if (!reorderable || sourceKey === targetKey) return;
    const next = groupBy.filter((key) => key !== sourceKey);
    const targetIndex = next.indexOf(targetKey);
    if (targetIndex < 0) return;
    next.splice(targetIndex + (after ? 1 : 0), 0, sourceKey);
    setGrouping(next);
  }, [groupBy, reorderable, setGrouping]);

  const addDataContextRow = useCallback(() => {
    if (!contextAdapter) return;
    const row = contextAdapter.add({}, true);
    if (row) setPage(totalPages);
  }, [contextAdapter, totalPages]);

  const deleteDataContextSelection = useCallback(() => {
    if (!contextAdapter) return;
    const rowsToDelete = selectedRows.length > 0 ? selectedRows : contextAdapter.currentRow() ? [contextAdapter.currentRow()!] : [];
    if (rowsToDelete.length === 0) return;
    contextAdapter.delete(rowsToDelete);
    const next = selectedRows.filter((row) => !rowsToDelete.includes(row));
    setSelectedRows(next);
    onSelectionChange?.({ selectedRows: next, changedRow: null, selected: false });
  }, [contextAdapter, onSelectionChange, selectedRows, setSelectedRows]);

  const saveDataContextChanges = useCallback(() => {
    if (!contextAdapter || !contextAdapter.dirty || (contextAdapter.blockInvalidSave && !contextAdapter.valid())) return;
    contextAdapter.context.save().then(() => onDataContextSaveComplete?.()).catch((error: unknown) => onDataContextSaveError?.(error));
  }, [contextAdapter, onDataContextSaveComplete, onDataContextSaveError]);

  const discardDataContextChanges = useCallback(() => {
    if (!contextAdapter || !contextAdapter.dirty) return;
    contextAdapter.discardChanges();
    setSelectedRows([]);
  }, [contextAdapter, setSelectedRows]);

  useImperativeHandle(ref, () => ({
    sortBy: setSort,
    filterBy: (key, values) => {
      const next = new Map(valueFilters);
      next.set(key, new Set(values.map(filterValueKey)));
      setValueFilters(next);
      emitFilters(next, dynamicFilters);
    },
    filterByCondition: (key, condition) => {
      const next = new Map(dynamicFilters);
      if (condition) next.set(key, condition); else next.delete(key);
      setDynamicFilters(next);
      emitFilters(valueFilters, next);
    },
    setRowDetailExpanded: (row, expanded) => {
      if (expanded === expandedRows.includes(row)) return;
      setExpandedRows(expanded ? [...expandedRows, row] : expandedRows.filter((candidate) => candidate !== row));
    },
    toggleRowDetails: (row) => toggleDetails(row),
    clearFilters: () => { setSearchTerm(''); setValueFilters(new Map()); setDynamicFilters(new Map()); onFilterChange?.([]); },
    goToPage,
    previousPage: () => goToPage(currentPage - 1, 'button'),
    nextPage: () => goToPage(currentPage + 1, 'button'),
    clearSelection,
    addDataContextRow,
    deleteDataContextSelection,
    saveDataContextChanges,
    discardDataContextChanges,
    autoSizeColumn: (key) => { setResizedWidths((current) => { const next = new Map(current); next.delete(key); return next; }); onColumnResize?.({ key, width: 'auto' }); },
    autoSizeColumns: () => { setResizedWidths(new Map()); allColumns.forEach((column) => onColumnResize?.({ key: column.key, width: 'auto' })); },
    resetColumnOrder: () => { setColumnOrder([]); onColumnOrderChange?.(allColumns.map((column) => column.key)); },
    setColumnVisible,
    setGrouping,
    clearGrouping: () => setGrouping([]),
    startCellEdit,
    startRowEdit,
    commitCellEdit,
    commitRowEdit,
    cancelEditing,
  }), [addDataContextRow, allColumns, cancelEditing, clearSelection, commitCellEdit, commitRowEdit, currentPage, deleteDataContextSelection, discardDataContextChanges, dynamicFilters, emitFilters, expandedRows, goToPage, onColumnOrderChange, onColumnResize, onFilterChange, saveDataContextChanges, setColumnVisible, setExpandedRows, setGrouping, setSearchTerm, setSort, startCellEdit, startRowEdit, toggleDetails, valueFilters]);

  const handleViewportScroll = (event: UIEvent<HTMLDivElement>) => {
    const viewport = event.currentTarget;
    setViewportScrollTop(viewport.scrollTop);
    if (virtualPaging && !virtualPagingLoading && viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 1 && (virtualHasNextPage ?? false)) goToPage(currentPage + 1, 'scroll');
    if (virtualPaging && !virtualPagingLoading && viewport.scrollTop <= 1 && (virtualHasPreviousPage ?? false)) goToPage(currentPage - 1, 'scroll');
  };

  const rootClassName = ['sp-datagridex', autoHeight ? 'sp-datagridex--auto-height' : '', showVerticalLines ? 'sp-datagridex--vertical-lines' : '', stripedRows ? 'sp-datagridex--striped' : '', virtualScroll || virtualPaging ? 'sp-datagridex--virtual' : '', Array.from(rowSpanPlan.values()).some((span) => span > 1) ? 'sp-datagridex--row-spanning' : '', columnVirtualization ? 'sp-datagridex--column-virtual' : '', className ?? ''].filter(Boolean).join(' ');
  const activeFilters = valueFilters.size + dynamicFilters.size;
  const selectableRows = visibleDataRows;
  const rowReorderingEnabled = rowReorder && !pagination && !virtualPaging && !virtualScroll && groupBy.length === 0 && sorts.length === 0 && activeFilters === 0;
  const allSelected = selectableRows.length > 0 && selectableRows.every((row) => selectedRows.includes(row));
  const someSelected = selectableRows.some((row) => selectedRows.includes(row)) && !allSelected;
  const resolvedEditLabels: DatagridexEditLabels = { actions: t('actions'), edit: t('edit'), save: t('save'), cancel: t('cancel'), ...editLabels };
  const paneRenderer = detailPaneRow && resolvedDetailPane ? resolvedDetailPane({ $implicit: detailPaneRow, row: detailPaneRow, rowIndex: resolvedRows.indexOf(detailPaneRow), close: () => setDetailRow(null) }) : null;

  const onCellKeyDown = (event: KeyboardEvent<HTMLDivElement>, display: DisplayRow<T>, column: DatagridexColumn<T>) => {
    if (event.altKey && rowReorderingEnabled && (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Home' || event.key === 'End')) {
      event.preventDefault();
      const from = display.rowIndex;
      const to = event.key === 'Home' ? 0 : event.key === 'End' ? resolvedRows.length - 1 : from + (event.key === 'ArrowUp' ? -1 : 1);
      if (to >= 0 && to < resolvedRows.length && from !== to) {
        const next = [...resolvedRows]; const [moved] = next.splice(from, 1); next.splice(to, 0, moved);
        onRowOrderChange?.({ row: display.row, fromIndex: from, toIndex: to, rows: next });
      }
      return;
    }
    if (activeCellEdit && activeCellEdit.row === display.row && activeCellEdit.key === column.key) return;
    if (event.key === 'Enter' || event.key === 'F2') {
      event.preventDefault();
      if (editMode === 'row') startRowEdit(display.rowIndex, column.key); else startCellEdit(display.rowIndex, column.key);
      return;
    }
    if (editOnType && isEditable(display.row, column) && (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete')) {
      event.preventDefault();
      startCellEdit(display.rowIndex, column.key, event.key.length === 1 ? event.key : '');
      return;
    }
    if (event.key === 'ArrowRight') { event.preventDefault(); moveEditableCell(display.rowIndex, column.key, 0, 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveEditableCell(display.rowIndex, column.key, 0, -1); }
    if (event.key === 'ArrowDown') { event.preventDefault(); moveEditableCell(display.rowIndex, column.key, 1, 0); }
    if (event.key === 'ArrowUp') { event.preventDefault(); moveEditableCell(display.rowIndex, column.key, -1, 0); }
  };

  const renderLeadingCell = (display: DisplayRow<T>, rowIndex: number) => {
    const isSelected = selectedRows.includes(display.row);
    const isPaneOpen = detailPaneRow === display.row;
    return <Fragment key={String(trackBy(display.row, display.rowIndex))}>
      {rowDetails && <div role="gridcell" className="sp-datagridex__cell sp-datagridex__cell--utility" style={{ gridColumn: 1 }}><button type="button" className="sp-datagridex__icon-button" aria-label={`${expandedRows.includes(display.row) ? t('collapse') : t('expand')} ${getRowLabel(display.row, rowIndex)}`} aria-expanded={expandedRows.includes(display.row)} onClick={() => toggleDetails(display.row)} disabled={!rowDetailExpandable(display.row, rowIndex)}><Icon name={expandedRows.includes(display.row) ? 'chevron-down' : 'chevron-right'} size={14} aria-hidden="true" /></button></div>}
      {detailPane && <div role="gridcell" className="sp-datagridex__cell sp-datagridex__cell--utility" style={{ gridColumn: rowDetails ? 2 : 1 }}><button type="button" className={`sp-datagridex__icon-button${isPaneOpen ? ' sp-datagridex__icon-button--active' : ''}`} aria-label={`${isPaneOpen ? t('close') : t('open')} ${t('details').toLocaleLowerCase()} ${getRowLabel(display.row, rowIndex)}`} aria-pressed={isPaneOpen} onClick={() => setDetailRow(isPaneOpen ? null : display.row)}><Icon name="info" size={14} aria-hidden="true" /></button></div>}
      {selectionMode !== 'none' && <div role="gridcell" className="sp-datagridex__cell sp-datagridex__cell--utility" style={{ gridColumn: (rowDetails ? 1 : 0) + (detailPane ? 1 : 0) + 1 }}>{selectionMode === 'single' ? <input type="radio" aria-label={`${t('select')} ${getRowLabel(display.row, rowIndex)}`} name={`${instanceId}-selection`} checked={isSelected} onChange={(event) => changeSelection(display.row, event.target.checked)} /> : <input type="checkbox" aria-label={`${t('select')} ${getRowLabel(display.row, rowIndex)}`} checked={isSelected} onChange={(event) => changeSelection(display.row, event.target.checked)} />}</div>}
      {rowNumbers && <div role="gridcell" className="sp-datagridex__cell sp-datagridex__cell--utility sp-datagridex__cell--number" style={{ gridColumn: leadingColumnCount - (editMode === 'row' ? 1 : 0) }}>{rowIndex + 1}</div>}
      {rowReorder && <div role="gridcell" className="sp-datagridex__cell sp-datagridex__cell--utility"><button type="button" className="sp-datagridex__icon-button" draggable={rowReorderingEnabled} disabled={!rowReorderingEnabled} aria-label={`${t('dragHandle')}: ${getRowLabel(display.row, rowIndex)}`} onDragStart={() => rowReorderingEnabled && setRowDragIndex(rowIndex)} onDragOver={(event) => { if (rowReorderingEnabled) event.preventDefault(); }} onDrop={() => { if (!rowReorderingEnabled || rowDragIndex === null || rowDragIndex === rowIndex) return; const next = [...resolvedRows]; const [moved] = next.splice(rowDragIndex, 1); next.splice(rowIndex, 0, moved); onRowOrderChange?.({ row: moved, fromIndex: rowDragIndex, toIndex: rowIndex, rows: next }); setRowDragIndex(null); }}><Icon name="grip-vertical" size={14} aria-hidden="true" /></button></div>}
      {resolvedLeadingActions && <div role="gridcell" className="sp-datagridex__cell sp-datagridex__cell--utility" style={{ minWidth: leadingRowActionsWidth }}>{resolvedLeadingActions({ $implicit: display.row, row: display.row, rowIndex, detailPaneOpen: isPaneOpen, toggleDetailPane: () => setDetailRow(isPaneOpen ? null : display.row) })}</div>}
      {editMode === 'row' && <div role="gridcell" className="sp-datagridex__cell sp-datagridex__cell--utility">{activeRowEdit?.row === display.row ? <span className="sp-datagridex__edit-actions"><button type="button" onClick={commitRowEdit}>{resolvedEditLabels.save}</button><button type="button" onClick={cancelEditing}>{resolvedEditLabels.cancel}</button></span> : <button type="button" className="sp-datagridex__icon-button" aria-label={`${resolvedEditLabels.edit} ${getRowLabel(display.row, rowIndex)}`} onClick={() => startRowEdit(rowIndex)}><Icon name="edit" size={14} aria-hidden="true" /></button>}</div>}
    </Fragment>;
  };

  const renderDataCell = (display: DisplayRow<T>, column: DatagridexColumn<T>, columnIndex: number) => {
    if (isCellCoveredByRowSpan(display.rowIndex, column.key)) return null;
    const value = valueFor(display.row, column);
    const isActiveCell = activeCellEdit?.row === display.row && activeCellEdit.key === column.key;
    const rowEditValue = activeRowEdit?.row === display.row ? activeRowEdit.values.get(column.key) : undefined;
    const isEditing = isActiveCell || activeRowEdit?.row === display.row && rowEditValue !== undefined && isEditable(display.row, column);
    const readonly = column.readonly === true || typeof column.readonly === 'function' && column.readonly(display.row);
    const showCellState = contextAdapter?.showCellState() ?? true;
    const showCellValidation = contextAdapter?.showCellValidation() ?? true;
    const recordState = showCellState ? contextAdapter?.cellState(display.row, column.key) : null;
    const activeErrors = isEditing && validateOnInput
      ? validateValue(parseEditorValue(isActiveCell ? activeCellEdit.value : rowEditValue, display.row, column), display.row, column)
      : [];
    const invalid = activeErrors.length > 0 || (showCellValidation && (contextAdapter?.cellInvalid(display.row, column.key) ?? false));
    const span = cellRowSpan(display.rowIndex, column.key);
    const pin = columnPinFor(column, columnPins);
    const content = isEditing ? renderEditor(display, column, isActiveCell ? activeCellEdit.value : rowEditValue, (next) => isActiveCell ? updateCellDraft(next) : updateRowDraft(column.key, next), isActiveCell ? () => commitCellEdit() : commitRowEdit, cancelEditing) : editorType(display.row, column) === 'checkbox' && isEditable(display.row, column) ? <input type="checkbox" tabIndex={-1} aria-label={`${column.header} for ${getRowLabel(display.row, display.rowIndex)}`} checked={Boolean(value)} onChange={(event) => { const next = event.target.checked; if (contextAdapter) contextAdapter.patch(display.row, { [column.key]: next }); onCellEditCommit?.({ row: display.row, rowIndex: display.rowIndex, column, key: column.key, previousValue: value, value: next }); }} /> : resolvedCellTemplates[column.key]?.({ $implicit: value, value, formattedValue: format(display.row, display.rowIndex, column), row: display.row, rowIndex: display.rowIndex, column } as DatagridexCellTemplateContext<T>) ?? format(display.row, display.rowIndex, column);
    const displayContent = display.isNewRow && columnIndex === 0 && !isEditing ? <span className="sp-datagridex__new-row-prompt">{newRowLabel}</span> : content;
    const classes = ['sp-datagridex__cell', pin === 'left' ? 'sp-datagridex__cell--pinned-left' : '', pin === 'right' ? 'sp-datagridex__cell--pinned-right' : '', span > 1 ? 'sp-datagridex__cell--row-span' : '', column.align ? `sp-datagridex__cell--align-${column.align}` : '', column.wrap === false ? 'sp-datagridex__cell--nowrap' : '', readonly ? 'sp-datagridex__cell--readonly' : '', recordState ? `sp-datagridex__cell--state-${recordState}` : '', invalid ? 'sp-datagridex__cell--validation-error' : ''].filter(Boolean).join(' ');
    const validationMessage = activeErrors[0]?.message ?? contextAdapter?.validationMessage(display.row, column.key);
    const cellStyle: CSSProperties = {
      gridColumn: leadingColumnCount + columnIndex + 1,
      ...(span > 1 ? { gridRow: `span ${span}`, blockSize: `calc(${span} * var(--sp-density-datagrid-row-height))` } : {}),
      ...(pin === 'left' ? { insetInlineStart: pinnedOffsets.left.get(column.key) } : {}),
      ...(pin === 'right' ? { insetInlineEnd: pinnedOffsets.right.get(column.key) } : {}),
    };
    return <div key={column.key} id={`${instanceId}-cell-${display.rowIndex}-${column.key}`} role="gridcell" tabIndex={isEditing ? -1 : 0} aria-colindex={leadingColumnCount + columnIndex + 1} aria-rowspan={span > 1 ? span : undefined} aria-readonly={readonly || undefined} aria-invalid={invalid || undefined} aria-describedby={validationMessage ? `${instanceId}-error-${display.rowIndex}-${column.key}` : undefined} className={classes} style={cellStyle} onClick={() => { if (editOnClick && isEditable(display.row, column) && !isActiveCell) startCellEdit(display.rowIndex, column.key); else contextAdapter?.navigateTo(display.row); }} onKeyDown={(event) => onCellKeyDown(event, display, column)} onDoubleClick={() => { if (isEditable(display.row, column)) startCellEdit(display.rowIndex, column.key); }}>{displayContent}{validationMessage && invalid && <span id={`${instanceId}-error-${display.rowIndex}-${column.key}`} className="sp-datagridex__validation-message" role="alert">{validationMessage}</span>}</div>;
  };

  const renderRow = (display: DisplayRow<T>, itemIndex: number) => {
    const selected = selectedRows.includes(display.row);
    const expanded = expandedRows.includes(display.row);
    const rowClassValue = typeof rowClass === 'function' ? rowClass(display.row, display.rowIndex) : rowClass;
    const rowStyleValue = typeof rowStyle === 'function' ? rowStyle(display.row, display.rowIndex) : rowStyle;
    const recordState = contextAdapter?.showRowState() ? contextAdapter.recordState(display.row) : null;
    const rowInvalid = contextAdapter?.showRowValidation() ? contextAdapter.rowInvalid(display.row) : false;
    const customRow = resolvedRowTemplate?.({ $implicit: display.row, row: display.row, rowIndex: display.rowIndex, columns: visibleColumns, isEditing: activeRowEdit?.row === display.row || activeCellEdit?.row === display.row, isSelected: selected, isExpanded: expanded });
    return <Fragment key={String(trackBy(display.row, display.rowIndex))}>
      <div role="row" aria-label={display.isNewRow ? newRowLabel : undefined} aria-rowindex={itemIndex + 2} aria-selected={selected || undefined} aria-invalid={rowInvalid || undefined} className={['sp-datagridex__row', selected ? 'sp-datagridex__row--selected' : '', expanded ? 'sp-datagridex__row--expanded' : '', display.isNewRow ? 'sp-datagridex__row--new' : '', recordState ? `sp-datagridex__row--state-${recordState}` : '', rowInvalid ? 'sp-datagridex__row--validation-error' : '', normalizeClassName(rowClassValue)].filter(Boolean).join(' ')} style={normalizeStyle(rowStyleValue)}>{customRow ?? <>{renderLeadingCell(display, display.rowIndex)}{visibleColumns.map((column, index) => renderDataCell(display, column, index))}</>}</div>
      {expanded && resolvedRowDetail && <div className="sp-datagridex__detail-row" role="row" style={{ minHeight: rowDetailHeight }}><div role="gridcell" className="sp-datagridex__detail-cell" style={{ gridColumn: `1 / span ${leadingColumnCount + visibleColumns.length}` }}>{resolvedRowDetail({ $implicit: display.row, row: display.row, rowIndex: display.rowIndex })}</div></div>}
    </Fragment>;
  };

  const renderGroup = (item: GroupItem<T>) => {
    const expanded = groupExpanded.has(item.key) || (groupExpanded.size === 0 && groupsExpandedByDefault);
    const selectedCount = item.rows.filter((row) => selectedRows.includes(row)).length;
    return <div role="row" aria-expanded={expanded} aria-level={item.level + 1} className={`sp-datagridex__group-row${stickyGroupHeaders ? ' sp-datagridex__group-row--sticky' : ''}`} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setGroupExpanded((current) => { const next = new Set(current); if (next.has(item.key)) next.delete(item.key); else next.add(item.key); return next; }); } }} tabIndex={0}><div role="gridcell" className="sp-datagridex__group-cell" style={{ gridColumn: `1 / span ${leadingColumnCount + visibleColumns.length}`, paddingInlineStart: indentGroupedRows ? `calc(var(--sp-space-3) * ${item.level + 1})` : undefined }}><button type="button" className="sp-datagridex__icon-button" aria-label={`${expanded ? t('collapseGroupRows') : t('expandGroupRows')}: ${item.label}`} aria-expanded={expanded} onClick={() => setGroupExpanded((current) => { const next = new Set(current); if (next.has(item.key)) next.delete(item.key); else next.add(item.key); return next; })}><Icon name={expanded ? 'chevron-down' : 'chevron-right'} size={14} aria-hidden="true" /></button>{groupSelection && selectionMode === 'multiple' && <input type="checkbox" aria-label={`${t('selectAllRows')}: ${item.label}`} checked={selectedCount === item.rows.length && item.rows.length > 0} ref={(node) => { if (node) node.indeterminate = selectedCount > 0 && selectedCount < item.rows.length; }} onChange={(event) => setRowsSelected(item.rows, event.target.checked)} />}{item.label}<span className="sp-datagridex__group-count">{item.rows.length}</span>{visibleColumns.map((column) => { if (!column.aggregate) return null; const aggregate = aggregateValue(column.aggregate, item.rows, column, 'group'); const context: DatagridexAggregateValueContext<T> = { value: aggregate.value, values: item.rows.map((row) => valueFor(row, column)), rows: item.rows, column, scope: 'group' }; return <span key={`aggregate-${column.key}`} className="sp-datagridex__aggregate"><b>{column.header}</b> {aggregate.formatter?.(context) ?? toText(aggregate.value)}</span>; })}</div></div>;
  };

  const renderHeader = (column: DatagridexColumn<T>, index: number) => {
    const sort = sorts.find((entry) => entry.key === column.key);
    const filterActive = valueFilters.has(column.key) || dynamicFilters.has(column.key);
    const pin = columnPinFor(column, columnPins);
    const width = resizedWidths.get(column.key) ?? (typeof column.width === 'number' ? column.width : undefined);
    const headerClasses = ['sp-datagridex__header-cell', pin === 'left' ? 'sp-datagridex__header-cell--pinned-left' : '', pin === 'right' ? 'sp-datagridex__header-cell--pinned-right' : '', column.align ? `sp-datagridex__header-cell--align-${column.align}` : ''].filter(Boolean).join(' ');
    const headerStyle: CSSProperties = { width: width ? `${width}px` : undefined, ...(pin === 'left' ? { insetInlineStart: pinnedOffsets.left.get(column.key) } : {}), ...(pin === 'right' ? { insetInlineEnd: pinnedOffsets.right.get(column.key) } : {}) };
    return <div key={column.key} ref={(node) => { headerRefs.current[column.key] = node; }} role="columnheader" aria-colindex={leadingColumnCount + index + 1} draggable={reorderable && column.reorderable !== false} className={headerClasses} onDragStart={() => setDraggedColumnKey(column.key)} onDragOver={(event) => { if (draggedColumnKey && draggedColumnKey !== column.key) event.preventDefault(); }} onDrop={() => { if (draggedColumnKey) updateColumnOrder(draggedColumnKey, column.key); setDraggedColumnKey(null); }} onKeyDown={(event) => { if (event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Home' || event.key === 'End')) { event.preventDefault(); const keys = allColumns.map((candidate) => candidate.key); const currentIndex = keys.indexOf(column.key); const visualDirection = isRtl ? (event.key === 'ArrowLeft' ? 1 : -1) : (event.key === 'ArrowLeft' ? -1 : 1); const targetIndex = event.key === 'Home' ? 0 : event.key === 'End' ? keys.length - 1 : currentIndex + visualDirection; const target = keys[targetIndex]; if (target) updateColumnOrder(column.key, target, !isRtl && event.key === 'ArrowRight' || isRtl && event.key === 'ArrowLeft'); } if (event.key === 'Enter' && column.sortable !== false) cycleSort(column.key); }} style={headerStyle}><span className="sp-datagridex__header-label">{column.readonly && editMode !== 'none' && <Icon name="lock" size={12} aria-hidden="true" />}{column.header}</span><span className="sp-datagridex__header-actions">{column.sortable !== false && <button type="button" className={`sp-datagridex__sort-button${sort ? ' sp-datagridex__sort-button--active' : ''}`} aria-label={`${t('sortAscending')} ${column.header}${sort ? `, ${sort.direction}` : ''}`} onClick={() => cycleSort(column.key)}><Icon name={sort?.direction === 'desc' ? 'chevron-down' : 'chevron-up'} size={12} aria-hidden="true" />{sort && multiSort && <span className="sp-datagridex__sort-order">{sorts.indexOf(sort) + 1}</span>}</button>}{column.filterable && <button type="button" className={`sp-datagridex__filter-button${filterActive ? ' sp-datagridex__filter-button--active' : ''}`} aria-label={`${t('filter')} ${column.header}`} onClick={() => setFilterPanelKey(filterPanelKey === column.key ? null : column.key)}><Icon name="filter" size={12} aria-hidden="true" /></button>}{columnMenu && <button type="button" className="sp-datagridex__menu-button" aria-label={t('openColumnMenu', { column: column.header })} aria-haspopup="menu" onClick={() => setColumnMenuKey(columnMenuKey === column.key ? null : column.key)}><Icon name="more-vertical" size={12} aria-hidden="true" /></button>}</span>{column.resizable !== false && <button type="button" className="sp-datagridex__resize-handle" aria-label={t('resizeColumn', { column: column.header })} onMouseDown={(event) => { event.preventDefault(); setResizing({ key: column.key, startX: event.clientX, width: width ?? estimatedWidth(column) }); }} onDoubleClick={() => { setResizedWidths((current) => { const next = new Map(current); next.delete(column.key); return next; }); onColumnResize?.({ key: column.key, width: 'auto' }); }} onKeyDown={(event) => { const currentWidth = width ?? estimatedWidth(column); const amount = event.shiftKey ? 32 : 8; if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); const delta = event.key === 'ArrowRight' ? (isRtl ? -amount : amount) : (isRtl ? amount : -amount); const next = Math.max(column.minWidth ?? 96, Math.min(column.maxWidth ?? 480, currentWidth + delta)); setResizedWidths((current) => new Map(current).set(column.key, next)); onColumnResize?.({ key: column.key, width: next }); } if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); const next = event.key === 'Home' ? column.minWidth ?? 96 : column.maxWidth ?? 480; setResizedWidths((current) => new Map(current).set(column.key, next)); onColumnResize?.({ key: column.key, width: next }); } }} />}{filterPanelKey === column.key && <div className="sp-datagridex__popover sp-datagridex__filter-popover" role="dialog" aria-label={`${t('filter')} ${column.header}`}><FilterPanel column={column} options={filterOptions(column)} selected={valueFilters.get(column.key) ?? new Set()} condition={dynamicFilters.get(column.key)} onApply={(values, nextCondition) => { const nextValues = new Map(valueFilters); const nextDynamic = new Map(dynamicFilters); if (values.size === 0) nextValues.delete(column.key); else nextValues.set(column.key, values); if (nextCondition) nextDynamic.set(column.key, nextCondition); else nextDynamic.delete(column.key); setValueFilters(nextValues); setDynamicFilters(nextDynamic); setFilterPanelKey(null); emitFilters(nextValues, nextDynamic); }} /></div>}{columnMenuKey === column.key && <ColumnMenu column={column} onClose={() => setColumnMenuKey(null)} onSort={() => cycleSort(column.key)} onHide={() => setColumnVisible(column.key, false)} onGroup={() => setGrouping([...groupBy, column.key])} onPin={(nextPin) => setColumnPin(column.key, nextPin)} onAutoSize={() => { setResizedWidths((current) => { const next = new Map(current); next.delete(column.key); return next; }); onColumnResize?.({ key: column.key, width: 'auto' }); }} />}</div>;
  };

  const groupHeaderKeys = columnGroups.length > 0 ? [...columnGroups].sort((left, right) => Math.min(...left.columnKeys.map((key) => allColumns.findIndex((column) => column.key === key))) - Math.min(...right.columnKeys.map((key) => allColumns.findIndex((column) => column.key === key)))) : [];
  const rootStyle: CSSProperties = { ...style, '--sp-datagridex-grid-template-columns': gridTemplateColumns, '--sp-datagridex-min-width': `${Math.max(totalGridWidth, 0)}px` } as CSSProperties;

  return <div {...rest} className={rootClassName} aria-busy={gridLoading || undefined} style={rootStyle} data-sort-indicator-visibility={sortIndicatorVisibility} data-filter-indicator-visibility={filterIndicatorVisibility} data-column-virtualization={columnVirtualization ? 'true' : undefined} data-column-virtualization-overscan={columnVirtualizationOverscan}>
    {toolbar && <div className="sp-datagridex__toolbar" role="toolbar" aria-label={toolbarAriaLabel}>{toolbarStart}<div className="sp-datagridex__toolbar-spacer" />{dataContext && dataContextOptions?.toolbarActions !== false && <><button type="button" onClick={addDataContextRow} aria-label={t('addNewRow')}>+</button><button type="button" onClick={deleteDataContextSelection} aria-label={t('delete')}>{t('delete')}</button><button type="button" onClick={saveDataContextChanges} disabled={!contextAdapter?.dirty || (contextAdapter?.blockInvalidSave && !contextAdapter.valid())} aria-label={t('save')}>{resolvedEditLabels.save}</button><button type="button" onClick={discardDataContextChanges} disabled={!contextAdapter?.dirty} aria-label={t('discard')}>{resolvedEditLabels.cancel}</button></>}{searchable && <input className="sp-datagridex__search" type="search" value={searchTerm} placeholder={t('search')} aria-label={t('search')} onChange={(event) => setSearchTerm(event.target.value)} />}{toolbarShowColumnSelector && columnSelector && <button type="button" onClick={() => setColumnSelectorOpen((open) => !open)} aria-expanded={columnSelectorOpen} aria-label={columnSelectorLabel}>{columnSelectorLabel}</button>}{toolbarEnd}</div>}
    {toolbar && toolbarShowGroupedColumns && groupBy.length > 0 && <div className="sp-datagridex__grouping-toolbar" aria-label={t('groupedColumns')}>{groupBy.map((key, index) => { const column = columnByKey.get(key); const sort = groupSorts.find((entry) => entry.key === key); return <div key={key} className="sp-datagridex__group-chip" draggable={reorderable} onDragStart={() => setDraggedGroupKey(key)} onDragOver={(event) => { if (draggedGroupKey && draggedGroupKey !== key) event.preventDefault(); }} onDrop={() => { if (draggedGroupKey) moveGrouping(draggedGroupKey, key, false); setDraggedGroupKey(null); }}><button type="button" className="sp-datagridex__group-chip-label" aria-label={`${column?.header ?? key} ${t('group')}, ${index + 1} of ${groupBy.length}${sort ? `, ${sort.direction}` : ''}`} onClick={() => toggleGroupSort(key)} onKeyDown={(event) => { if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); setGrouping(groupBy.filter((candidate) => candidate !== key)); return; } if (!event.altKey) return; const delta = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : event.key === 'Home' ? -groupBy.length : event.key === 'End' ? groupBy.length : 0; if (delta === 0) return; event.preventDefault(); const nextIndex = Math.max(0, Math.min(groupBy.length - 1, index + delta)); const next = [...groupBy]; next.splice(index, 1); next.splice(nextIndex, 0, key); setGrouping(next); }}>{column?.header ?? key}{sort ? ` (${sort.direction})` : ''}</button><button type="button" className="sp-datagridex__group-chip-remove" aria-label={t('removeColumnGrouping', { column: column?.header ?? key })} onClick={() => setGrouping(groupBy.filter((candidate) => candidate !== key))}>×</button></div>; })}</div>}
    {!toolbar && columnSelector && <div className="sp-datagridex__standalone-actions"><button type="button" onClick={() => setColumnSelectorOpen((open) => !open)} aria-expanded={columnSelectorOpen}>{columnSelectorLabel}</button></div>}
    {columnSelectorOpen && <ColumnSelector columns={allColumns} hidden={hiddenColumnKeys} reorderable={reorderable} onVisible={setColumnVisible} onMove={updateColumnOrder} />}
    <div ref={viewportRef} className="sp-datagridex__viewport" onScroll={handleViewportScroll} style={{ maxHeight: autoHeight ? undefined : virtualScroll ? virtualScrollHeight : undefined }}>
      <div className="sp-datagridex__grid" role="grid" aria-label={ariaLabel} aria-rowcount={totalRows} aria-colcount={leadingColumnCount + visibleColumns.length} aria-multiselectable={selectionMode === 'multiple' ? 'true' : undefined} style={{ minWidth: 'var(--sp-datagridex-min-width)' }}>
        {groupHeaderKeys.length > 0 && <div role="row" className="sp-datagridex__group-header-row">{Array.from({ length: leadingColumnCount }).map((_, index) => <div key={`utility-${index}`} role="columnheader" className="sp-datagridex__header-cell sp-datagridex__header-cell--utility" />)}{groupHeaderKeys.map((group) => { const matching = visibleColumns.filter((column) => group.columnKeys.includes(column.key)); const groupCanReorder = reorderable && group.reorderable !== false; return matching.length === 0 ? null : <div key={group.key} role="columnheader" className="sp-datagridex__group-header-cell" style={{ gridColumn: `span ${matching.length}` }} draggable={groupCanReorder} tabIndex={0} onDragStart={() => groupCanReorder && setDraggedGroupKey(group.key)} onDragOver={(event) => { if (draggedGroupKey && draggedGroupKey !== group.key && groupCanReorder) event.preventDefault(); }} onDrop={() => { if (draggedGroupKey && draggedGroupKey !== group.key && groupCanReorder) { const next = [...groupHeaderKeys]; const from = next.findIndex((candidate) => candidate.key === draggedGroupKey); const target = next.findIndex((candidate) => candidate.key === group.key); if (from >= 0 && target >= 0) { const [moved] = next.splice(from, 1); next.splice(target, 0, moved); onColumnGroupOrderChange?.(next.map((candidate) => candidate.key)); } } setDraggedGroupKey(null); }} onDoubleClick={() => { const boundary = matching[matching.length - 1]; if (boundary) { const width = estimatedWidth(boundary); onColumnGroupResize?.({ key: group.key, width, columnKey: boundary.key, columnWidth: width }); } }} onKeyDown={(event) => { if (event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) { event.preventDefault(); const index = groupHeaderKeys.findIndex((candidate) => candidate.key === group.key); const next = [...groupHeaderKeys]; const target = index + (event.key === 'ArrowLeft' ? -1 : 1); if (target >= 0 && target < next.length) { [next[index], next[target]] = [next[target], next[index]]; onColumnGroupOrderChange?.(next.map((candidate) => candidate.key)); } } }}>{group.header}</div>; })}</div>}
        <div role="row" className="sp-datagridex__header-row">{Array.from({ length: leadingColumnCount }).map((_, index) => <div key={`utility-${index}`} role="columnheader" className="sp-datagridex__header-cell sp-datagridex__header-cell--utility">{index === 0 && selectionMode === 'multiple' && <input type="checkbox" aria-label={`${t('selectAllRowsOnPage')} (${t('rows')})`} checked={allSelected} ref={(node) => { if (node) node.indeterminate = someSelected; }} onChange={(event) => setRowsSelected(selectableRows, event.target.checked)} />}</div>)}{visibleColumns.map(renderHeader)}</div>
        {gridLoading && <div className="sp-datagridex__loading" role="status"><span className="sp-datagridex__spinner" aria-hidden="true" />{loadingMessage}</div>}
        {!gridLoading && renderedItems.length === 0 && <div className="sp-datagridex__empty" role="row"><div role="gridcell" className="sp-datagridex__empty-cell" style={{ gridColumn: `1 / span ${leadingColumnCount + visibleColumns.length}` }}><strong>{activeFilters > 0 ? filterEmptyMessage : emptyMessage}</strong>{activeFilters > 0 ? filterEmptyStateDescription && <span>{filterEmptyStateDescription}</span> : emptyStateDescription && <span>{emptyStateDescription}</span>}{activeFilters > 0 && <button type="button" onClick={() => { setSearchTerm(''); setValueFilters(new Map()); setDynamicFilters(new Map()); onFilterChange?.([]); }}>{t('clearFilters')}</button>}</div></div>}
        {virtualScroll && virtualStart > 0 && <div style={{ height: virtualStart * virtualRowHeight }} aria-hidden="true" />}
        <div className="sp-datagridex__rows">{!gridLoading && renderedItems.map((item, index) => item.kind === 'group' ? renderGroup(item) : renderRow(item.display, virtualStart + index))}</div>
        {virtualScroll && virtualEnd < activeItemCount && <div style={{ height: (activeItemCount - virtualEnd) * virtualRowHeight }} aria-hidden="true" />}
        {footer && <div role="row" className="sp-datagridex__footer-row"><div role="gridcell" className="sp-datagridex__footer-cell" style={{ gridColumn: `1 / span ${leadingColumnCount + visibleColumns.length}` }}><strong>{footerLabel}</strong>{visibleColumns.map((column) => column.aggregate ? <span key={column.key} className="sp-datagridex__aggregate"><b>{column.header}</b> {(() => { const aggregate = aggregateValue(column.aggregate, filteredRows, column, 'footer'); const context: DatagridexAggregateValueContext<T> = { value: aggregate.value, values: filteredRows.map((row) => valueFor(row, column)), rows: filteredRows, column, scope: 'footer' }; return aggregate.formatter?.(context) ?? toText(aggregate.value); })()}</span> : null)}</div></div>}
      </div>
    </div>
    {statusbar && <div className="sp-datagridex__statusbar" role="status" aria-label={statusbarAriaLabel}>{statusbarStart}<span className="sp-datagridex__statusbar-spacer" />{statusbarShowRowCount && <span>{totalRows} {totalRows === 1 ? t('row') : t('rows')}</span>}{statusbarShowSelectedRowCount && selectionMode !== 'none' && <span>{selectedRows.length} {t('rowSelection')}</span>}{statusbarEnd}{statusbarMergePagination && (pagination || virtualPaging) && <Pagination page={currentPage} totalPages={totalPages} pageSize={pageSize} pageSizeOptions={pageSizeOptions} type={paginationType} virtualPaging={virtualPaging} hasPreviousPage={virtualHasPreviousPage ?? currentPage > 1} hasNextPage={virtualHasNextPage ?? currentPage < totalPages} pageLabel={t('paginationPageTotal', { current: currentPage, total: totalPages })} onPage={goToPage} onPageSize={changePageSize} />}</div>}
    {(pagination || virtualPaging) && !statusbarMergePagination && <Pagination page={currentPage} totalPages={totalPages} pageSize={pageSize} pageSizeOptions={pageSizeOptions} type={paginationType} virtualPaging={virtualPaging} hasPreviousPage={virtualHasPreviousPage ?? currentPage > 1} hasNextPage={virtualHasNextPage ?? currentPage < totalPages} pageLabel={t('paginationPageTotal', { current: currentPage, total: totalPages })} onPage={goToPage} onPageSize={changePageSize} />}
    {detailPane && detailPaneRow && <aside className="sp-datagridex__detail-pane" style={{ width: detailPaneWidth }} aria-label={detailPaneTitle}><div className="sp-datagridex__detail-pane-header"><strong>{detailPaneTitle}</strong><button type="button" className="sp-datagridex__icon-button" onClick={() => setDetailRow(null)} aria-label={t('closeDetailPane')}><Icon name="x" size={14} aria-hidden="true" /></button></div><div className="sp-datagridex__detail-pane-body">{paneRenderer}</div></aside>}
  </div>;
}

interface FilterPanelProps<T extends object> { column: DatagridexColumn<T>; options: readonly { value: unknown; row: T }[]; selected: ReadonlySet<string>; condition?: DatagridexDynamicFilterCondition; onApply: (values: ReadonlySet<string>, condition?: DatagridexDynamicFilterCondition) => void }
function FilterPanel<T extends object>({ column, options, selected, condition, onApply }: FilterPanelProps<T>) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<ReadonlySet<string>>(selected);
  const [operator, setOperator] = useState<DatagridexDynamicFilterCondition['operator']>(condition?.operator ?? 'contains');
  const [value, setValue] = useState(String(condition?.value ?? ''));
  const [valueTo, setValueTo] = useState(String(condition?.valueTo ?? ''));
  const dynamic = column.filterVariant === 'dynamic';
  const visible = options.filter((option) => String(option.value ?? '').toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const operatorLabels: Readonly<Record<DatagridexDynamicFilterCondition['operator'], string>> = {
    contains: t('opContains'), notContains: t('opDoesNotContain'), startsWith: t('opStartsWith'), endsWith: t('opEndsWith'),
    equals: t('opEquals'), notEquals: t('opDoesNotEqual'), greaterThan: t('opGreaterThan'), greaterThanOrEqual: t('opGreaterThanOrEqual'),
    lessThan: t('opLessThan'), lessThanOrEqual: t('opLessThanOrEqual'), between: t('opBetween'), isEmpty: t('opIsEmpty'), isNotEmpty: t('opIsNotEmpty'),
  };
  return <div className="sp-datagridex__filter-panel"><strong>{column.header}</strong>{dynamic ? <><select aria-label={t('condition')} value={operator} onChange={(event) => setOperator(event.target.value as DatagridexDynamicFilterCondition['operator'])}>{Object.entries(operatorLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><input value={value} onChange={(event) => setValue(event.target.value)} placeholder={t('filterValue')} aria-label={t('filterValue')} />{operator === 'between' && <input value={valueTo} onChange={(event) => setValueTo(event.target.value)} placeholder={t('to')} aria-label={t('to')} />}</> : <><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('searchValues')} aria-label={t('searchValues')} /><label><input type="checkbox" aria-label={t('selectAllRows')} checked={draft.size === options.length && options.length > 0} ref={(node) => { if (node) node.indeterminate = draft.size > 0 && draft.size < options.length; }} onChange={(event) => setDraft(event.target.checked ? new Set(options.map((option) => filterValueKey(option.value))) : new Set())} /> {t('selectAllRows')}</label><div className="sp-datagridex__filter-values">{visible.length === 0 ? <span>{t('noMatchingValues')}</span> : visible.map((option) => { const key = filterValueKey(option.value); return <label key={key}><input type="checkbox" checked={draft.has(key)} onChange={(event) => { const next = new Set(draft); if (event.target.checked) next.add(key); else next.delete(key); setDraft(next); }} />{column.filterValueFormatter?.(option.value, option.row) ?? toText(option.value)}</label>; })}</div></>}<div className="sp-datagridex__filter-actions"><button type="button" onClick={() => onApply(new Set(), undefined)}>{t('clear')}</button><button type="button" onClick={() => onApply(dynamic ? new Set() : draft, dynamic ? { operator, value, ...(operator === 'between' ? { valueTo } : {}) } : undefined)}>{t('apply')}</button></div></div>;
}

interface ColumnMenuProps<T extends object> { column: DatagridexColumn<T>; onClose: () => void; onSort: () => void; onHide: () => void; onGroup: () => void; onPin: (pin: DatagridexColumnPin | null) => void; onAutoSize: () => void }
function ColumnMenu<T extends object>({ column, onClose, onSort, onHide, onGroup, onPin, onAutoSize }: ColumnMenuProps<T>) {
  const { t } = useI18n();
  return <div className="sp-datagridex__column-menu" role="menu" aria-label={t('columnMenu')} onKeyDown={(event) => { if (event.key === 'Escape') onClose(); }}><button type="button" role="menuitem" onClick={() => { onSort(); onClose(); }}>{t('sortAscending')}</button><button type="button" role="menuitem" onClick={() => { onAutoSize(); onClose(); }}>{t('autoFitColumn')}</button><button type="button" role="menuitem" onClick={() => { onGroup(); onClose(); }}>{t('groupedColumns')}</button><button type="button" role="menuitem" onClick={() => { onPin('left'); onClose(); }}>{t('pinLeft')}</button><button type="button" role="menuitem" onClick={() => { onPin('right'); onClose(); }}>{t('pinRight')}</button><button type="button" role="menuitem" onClick={() => { onPin(null); onClose(); }}>{t('unpin')}</button><button type="button" role="menuitem" disabled={column.readonly === true} onClick={() => { onHide(); onClose(); }}>{t('hideColumn')}</button>{column.menuItems?.map((item) => <Fragment key={item.label}>{item.separator && <div role="separator" />}{item.children?.length ? <div role="group" aria-label={item.label}>{item.children.map((child) => <button key={child.label} type="button" role="menuitem" disabled={child.disabled} onClick={() => { child.command?.(); onClose(); }}>{child.label}</button>)}</div> : <button type="button" role="menuitem" disabled={item.disabled} onClick={() => { item.command?.(); onClose(); }}>{item.label}</button>}</Fragment>)}</div>;
}

interface ColumnSelectorProps<T extends object> { columns: readonly DatagridexColumn<T>[]; hidden: readonly string[]; reorderable: boolean; onVisible: (key: string, visible: boolean) => void; onMove: (key: string, target: string, after?: boolean) => void }
function ColumnSelector<T extends object>({ columns, hidden, reorderable, onVisible, onMove }: ColumnSelectorProps<T>) {
  const { t } = useI18n();
  const [draggedKey, setDraggedKey] = useState<string | null>(null);
  const canReorder = (column: DatagridexColumn<T>) => reorderable && column.reorderable !== false;
  return <div className="sp-datagridex__column-selector" role="dialog" aria-label={t('columnVisibility')}><strong>{t('columns')}</strong>{columns.map((column, index) => <div key={column.key} className="sp-datagridex__column-selector-item" draggable={canReorder(column)} onDragStart={() => setDraggedKey(column.key)} onDragOver={(event) => { if (draggedKey && draggedKey !== column.key && canReorder(column)) event.preventDefault(); }} onDrop={() => { if (draggedKey && draggedKey !== column.key) onMove(draggedKey, column.key); setDraggedKey(null); }}><input type="checkbox" checked={!hidden.includes(column.key)} onChange={(event) => onVisible(column.key, event.target.checked)} aria-label={`${t('visibility')}: ${column.header}`} /><span>{column.header}</span><button type="button" aria-label={`${t('moveUp')} ${column.header}`} disabled={index === 0 || !canReorder(column)} onClick={() => { const target = columns[index - 1]?.key; if (target) onMove(column.key, target); }}>↑</button><button type="button" aria-label={`${t('moveDown')} ${column.header}`} disabled={index === columns.length - 1 || !canReorder(column)} onClick={() => { const target = columns[index + 1]?.key; if (target) onMove(column.key, target, true); }}>↓</button></div>)}</div>;
}

interface PaginationProps { page: number; totalPages: number; pageSize: number; pageSizeOptions: readonly number[]; type: DatagridexPaginationType; virtualPaging: boolean; hasPreviousPage: boolean; hasNextPage: boolean; pageLabel: string; onPage: (page: number, trigger?: 'api' | 'button') => void; onPageSize: (size: number) => void }
function Pagination({ page, totalPages, pageSize, pageSizeOptions, type, virtualPaging, hasPreviousPage, hasNextPage, pageLabel, onPage, onPageSize }: PaginationProps) {
  const { t } = useI18n();
  return <nav className={`sp-datagridex__pagination sp-datagridex__pagination--${type}`} aria-label={t('pagination')}><button type="button" onClick={() => onPage(page - 1, 'button')} disabled={!hasPreviousPage} aria-label={t('previousPage')}>‹</button>{type === 'full' && <button type="button" onClick={() => onPage(1, 'button')} disabled={!hasPreviousPage} aria-label={t('firstPage')}>«</button>}<span>{pageLabel}</span>{type === 'full' && !virtualPaging && <span className="sp-datagridex__page-buttons">{Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1).map((number) => <button key={number} type="button" aria-current={number === page ? 'page' : undefined} onClick={() => onPage(number)}>{number}</button>)}</span>}<button type="button" onClick={() => onPage(page + 1, 'button')} disabled={!hasNextPage} aria-label={t('nextPage')}>›</button>{type === 'full' && <button type="button" onClick={() => onPage(totalPages, 'button')} disabled={!hasNextPage} aria-label={t('lastPage')}>»</button>}<label>{t('rows')}: <select value={pageSize} onChange={(event) => onPageSize(Number(event.target.value))}>{pageSizeOptions.map((size) => <option key={size} value={size}>{size}</option>)}</select></label></nav>;
}

export const Datagridex = forwardRef(DatagridexInner) as <T extends object>(props: DatagridexProps<T> & { ref?: ForwardedRef<DatagridexHandle<T>> }) => ReactElement;
