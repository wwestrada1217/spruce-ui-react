/* eslint-disable react-refresh/only-export-components */
import './Datagrid.css';

import {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../button/Button.js';
import { Checkbox } from '../checkbox/Checkbox.js';
import { Dropdown, type DropdownItem } from '../dropdown/Dropdown.js';
import { Field } from '../field/Field.js';
import { FilterExpression, type FilterGroup } from '../filter-expression/FilterExpression.js';
import { Icon } from '../../icons/Icon.js';
import { Input } from '../input/Input.js';
import { Popover } from '../popover/Popover.js';
import { Select, type SelectOption } from '../select/Select.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { surfaceChromeClasses, type Border, type Chrome, type Radius } from '../../chrome/chrome.js';
import type { IReadableDataSource } from '../../data/types.js';
import {
  createDatagridDataContextAdapter,
  type DatagridDataContextAdapter,
} from './datagrid-data-context.js';
import type {
  DatagridAggregate,
  DatagridAggregateScope,
  DatagridCellEditor as DatagridCellEditorRenderer,
  DatagridCellClassName,
  DatagridCellEvent,
  DatagridCellStyle,
  DatagridCellEditCommit,
  DatagridCellTemplate as DatagridCellTemplateRenderer,
  DatagridColumn,
  DatagridColumnMenuItem,
  DatagridColumnFilter,
  DatagridColumnGroup,
  DatagridColumnGroupOrderChange,
  DatagridColumnGroupResize,
  DatagridColumnOrderChange,
  DatagridColumnPin,
  DatagridColumnResize,
  DatagridColumnVisibilityChange,
  DatagridDataContext,
  DatagridDataContextOptions,
  DatagridDetailPane as DatagridDetailPaneRenderer,
  DatagridDynamicFilterCondition,
  DatagridDynamicFilterOperator,
  DatagridEditCancel,
  DatagridEditLabels,
  DatagridEditMode,
  DatagridFilterChange,
  DatagridFilterIndicatorVisibility,
  DatagridFilterMode,
  DatagridFilterPanelConfig,
  DatagridGroupBy,
  DatagridGroupSort,
  DatagridGroupSortDirection,
  DatagridHandle,
  DatagridLeadingRowActions as DatagridLeadingRowActionsRenderer,
  DatagridNewRowCommit,
  DatagridNewRowCommitMode,
  DatagridNewRowFactory,
  DatagridNewRowPosition,
  DatagridNestedGridConfig,
  DatagridPageChange,
  DatagridPaginationType,
  DatagridRowClassName,
  DatagridRowEvent,
  DatagridRowDetail as DatagridRowDetailRenderer,
  DatagridRowDetailExpandable,
  DatagridRowEditCommit,
  DatagridRowLabel,
  DatagridRowOrderChange,
  DatagridRowStyle,
  DatagridRowTemplate as DatagridRowTemplateRenderer,
  DatagridSelectionChange,
  DatagridSelectionControl,
  DatagridSelectionMode,
  DatagridSort,
  DatagridSortChange,
  DatagridSortDirection,
  DatagridSortIndicatorVisibility,
  DatagridSortMode,
  DatagridSortsChange,
  DatagridTrackBy,
  DatagridValidationError,
  DatagridValidationEvent,
  DatagridVirtualPageRequest,
} from './datagrid-types.js';

export type * from './datagrid-types.js';
export { DatagridDataContextAdapter, createDatagridDataContextAdapter } from './datagrid-data-context.js';
export type { DatagridDataContextAdapter as DatagridDataContextAdapterType } from './datagrid-data-context.js';

export interface DatagridCellTemplateProps<T extends object = Record<string, unknown>> {
  readonly columnKey?: string;
  readonly column?: string;
  readonly children: DatagridCellTemplateRenderer<T>;
}
export function DatagridCellTemplate<T extends object = Record<string, unknown>>(props: DatagridCellTemplateProps<T>): ReactElement | null {
  void props;
  return null;
}

export interface DatagridCellEditorProps<T extends object = Record<string, unknown>> {
  readonly columnKey?: string;
  readonly column?: string;
  readonly children: DatagridCellEditorRenderer<T>;
}
export function DatagridCellEditor<T extends object = Record<string, unknown>>(props: DatagridCellEditorProps<T>): ReactElement | null {
  void props;
  return null;
}

export interface DatagridRowDetailProps<T extends object = Record<string, unknown>> {
  readonly children: DatagridRowDetailRenderer<T>;
}
export function DatagridRowDetail<T extends object = Record<string, unknown>>(props: DatagridRowDetailProps<T>): ReactElement | null {
  void props;
  return null;
}

export interface DatagridDetailPaneProps<T extends object = Record<string, unknown>> {
  readonly children: DatagridDetailPaneRenderer<T>;
}
export function DatagridDetailPane<T extends object = Record<string, unknown>>(props: DatagridDetailPaneProps<T>): ReactElement | null {
  void props;
  return null;
}

export interface DatagridLeadingRowActionsProps<T extends object = Record<string, unknown>> {
  readonly children: DatagridLeadingRowActionsRenderer<T>;
}
export function DatagridLeadingRowActions<T extends object = Record<string, unknown>>(props: DatagridLeadingRowActionsProps<T>): ReactElement | null {
  void props;
  return null;
}

export interface DatagridRowTemplateProps<T extends object = Record<string, unknown>> {
  readonly children: DatagridRowTemplateRenderer<T>;
}
export function DatagridRowTemplate<T extends object = Record<string, unknown>>(props: DatagridRowTemplateProps<T>): ReactElement | null {
  void props;
  return null;
}

export interface DatagridProps<T extends object = Record<string, unknown>> {
  readonly children?: ReactNode;
  readonly data?: readonly T[];
  readonly rows?: readonly T[];
  /** Angular-compatible alias for rows. */
  readonly rowData?: readonly T[];
  readonly dataSource?: IReadableDataSource<T> | null;
  readonly columns?: readonly DatagridColumn<T>[];
  readonly columnGroups?: readonly DatagridColumnGroup[];
  readonly trackBy?: DatagridTrackBy<T> | keyof T;
  readonly rowLabel?: DatagridRowLabel<T> | keyof T;
  readonly locale?: string;
  readonly emptyMessage?: string;
  readonly filterEmptyMessage?: string;
  readonly emptyStateDescription?: string | null;
  readonly filterEmptyStateDescription?: string | null;
  readonly autoColumnWidth?: boolean;
  readonly autoFit?: boolean;
  readonly chrome?: Chrome;
  readonly radius?: Radius;
  readonly border?: Border;
  readonly density?: 'dense' | 'default' | 'comfortable';
  readonly autoRowHeight?: boolean;
  readonly headerTextCase?: 'uppercase' | 'default';
  readonly nullText?: string;
  readonly borderless?: boolean;
  readonly showColumnLines?: boolean;
  readonly hideColumnLines?: boolean;
  readonly columnLines?: boolean;
  readonly showColumnBorders?: boolean;
  readonly rowHover?: boolean;
  readonly reorderable?: boolean;
  readonly defaultColumnWidth?: number;
  readonly sortMode?: DatagridSortMode;
  readonly sortIndicatorVisibility?: DatagridSortIndicatorVisibility;
  readonly multiSort?: boolean;
  readonly sorts?: readonly DatagridSort[];
  readonly filterMode?: DatagridFilterMode;
  readonly filterIndicatorVisibility?: DatagridFilterIndicatorVisibility;
  readonly searchQuery?: string;
  readonly searchFilter?: (row: T, query: string) => boolean;
  readonly columnFilters?: readonly DatagridColumnFilter<T>[];
  readonly columnOrder?: readonly string[];
  readonly columnGroupOrder?: readonly string[];
  readonly columnVisibility?: readonly string[];
  readonly hiddenColumns?: readonly string[];
  readonly columnPins?: Readonly<Record<string, DatagridColumnPin | null | undefined>>;
  readonly groupBy?: readonly string[];
  readonly groupSorts?: readonly DatagridGroupSort[];
  readonly expandAllGroups?: boolean;
  readonly stickyGroupHeaders?: boolean;
  readonly indentGroupedRows?: boolean;
  readonly selectionMode?: DatagridSelectionMode;
  readonly selectionControl?: DatagridSelectionControl;
  readonly appendSelection?: boolean;
  readonly rowSelection?: boolean;
  readonly hideSelectionColumn?: boolean;
  readonly selectOnNavigate?: boolean;
  readonly hideFocusRing?: boolean;
  readonly selection?: readonly T[];
  readonly fitColumnsToWidth?: boolean;
  readonly stripedRows?: boolean;
  readonly showVerticalLines?: boolean;
  readonly showRowNumbers?: boolean;
  readonly rowHeight?: number;
  readonly headerHeight?: number;
  readonly autoHeight?: boolean;
  readonly fixedHeight?: number | string;
  readonly paginate?: boolean;
  readonly pagination?: boolean;
  readonly pageSize?: number;
  readonly page?: number;
  readonly paginationType?: DatagridPaginationType;
  readonly paginationRowsOptions?: readonly number[];
  readonly pageSizeOptions?: readonly number[];
  readonly virtualScroll?: boolean;
  readonly virtualScrollHeight?: number;
  readonly virtualRowHeight?: number;
  readonly virtualOverscan?: number;
  readonly columnVirtualization?: boolean;
  readonly columnVirtualizationOverscan?: number;
  readonly virtualPaging?: boolean;
  readonly virtualPage?: number;
  readonly virtualTotalRows?: number;
  readonly virtualHasPreviousPage?: boolean;
  readonly virtualHasNextPage?: boolean;
  readonly virtualPagingLoading?: boolean;
  readonly virtualDataSourceWindow?: boolean;
  readonly virtualPageThreshold?: number;
  readonly virtualPageRequest?: (request: DatagridVirtualPageRequest) => void;
  readonly onVirtualPageRequest?: (request: DatagridVirtualPageRequest) => void;
  readonly onPageSizeChange?: (pageSize: number) => void;
  readonly editMode?: DatagridEditMode;
  readonly editOnType?: boolean;
  readonly autoEditOnNavigate?: boolean;
  readonly manualCommit?: boolean;
  readonly showDirtyIndicator?: boolean;
  readonly undoStackSize?: number;
  readonly enableUndoShortcuts?: boolean;
  readonly enableFillDown?: boolean;
  readonly editLabels?: Partial<DatagridEditLabels>;
  readonly isRowEditable?: (row: T) => boolean;
  readonly isCellEditable?: (row: T, column: DatagridColumn<T>) => boolean;
  readonly isCellReadonly?: (row: T, column: DatagridColumn<T>) => boolean;
  readonly allowNewRow?: boolean;
  readonly enableNewRow?: boolean;
  readonly newRowPrompt?: string;
  readonly newRowLabel?: string;
  readonly newRowFactory?: DatagridNewRowFactory<T>;
  readonly newRowPosition?: DatagridNewRowPosition;
  readonly newRowCommit?: DatagridNewRowCommitMode;
  readonly preventInvalidCommit?: boolean;
  readonly onCellValidationFailed?: (event: DatagridValidationEvent<T>) => void;
  readonly onRowValidationFailed?: (events: readonly DatagridValidationEvent<T>[]) => void;
  readonly reorderableRows?: boolean;
  readonly rowReorder?: boolean;
  readonly rowReorderable?: (row: T) => boolean;
  readonly rowDetailExpandable?: DatagridRowDetailExpandable<T>;
  readonly rowClassName?: DatagridRowClassName<T>;
  readonly rowStyle?: DatagridRowStyle<T>;
  readonly cellClassName?: DatagridCellClassName<T>;
  readonly cellStyle?: DatagridCellStyle<T>;
  readonly showGroupToolbar?: boolean;
  readonly groupSorting?: boolean;
  readonly groupsExpandedByDefault?: boolean;
  readonly showColumnSelector?: boolean;
  readonly columnSelector?: boolean;
  readonly showStatusbar?: boolean;
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
  readonly selectedRows?: readonly T[];
  readonly onSelectedRowsChange?: (rows: readonly T[]) => void;
  readonly expandedRows?: readonly T[] | readonly unknown[];
  readonly onExpandedRowsChange?: (rows: readonly T[]) => void;
  readonly onDetailPaneRowChange?: (row: T | null) => void;
  readonly footer?: boolean;
  readonly footerLabel?: string;
  readonly columnMenu?: boolean;
  readonly columnSelectorLabel?: string;
  readonly hiddenColumnKeys?: readonly string[];
  readonly groupSelection?: boolean;
  readonly rowNumbers?: boolean;
  readonly detailPaneWidth?: number;
  readonly rowDetailHeight?: number;
  readonly leadingRowActionsWidth?: number;
  readonly validateOnInput?: boolean;
  readonly rowClass?: DatagridRowClassName<T>;
  readonly editOnClick?: boolean;
  readonly statusbarStart?: ReactNode | ((context: { totalRows: number; selectedRows: readonly T[] }) => ReactNode);
  readonly statusbarEnd?: ReactNode | ((context: { totalRows: number; selectedRows: readonly T[] }) => ReactNode);
  readonly toolbarStart?: ReactNode;
  readonly toolbarEnd?: ReactNode;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly emptyIcon?: string;
  readonly emptyState?: ReactNode;
  readonly loading?: boolean;
  readonly loadingMode?: 'spinner' | 'skeleton';
  readonly skeletonRowCount?: number;
  readonly loadingMessage?: string;
  readonly detailPaneTitle?: string | ((row: T) => string);
  readonly cellTemplates?: Partial<Record<string, DatagridCellTemplateRenderer<T>>>;
  readonly cellEditors?: Partial<Record<string, DatagridCellEditorRenderer<T>>>;
  readonly rowDetail?: DatagridRowDetailRenderer<T>;
  readonly rowDetails?: boolean | DatagridRowDetailRenderer<T>;
  readonly detailPane?: boolean | DatagridDetailPaneRenderer<T>;
  readonly detailPaneRenderer?: DatagridDetailPaneRenderer<T>;
  readonly detailPaneRow?: T | null;
  readonly leadingRowActions?: DatagridLeadingRowActionsRenderer<T>;
  readonly rowTemplate?: DatagridRowTemplateRenderer<T>;
  readonly treeChildrenField?: keyof T | string;
  readonly treeExpandedByDefault?: boolean;
  readonly nestedGrid?: DatagridNestedGridConfig<T, object>;
  readonly infiniteScroll?: boolean;
  readonly infiniteScrollThreshold?: number;
  readonly onLoadMore?: (currentCount: number) => Promise<readonly T[] | void>;
  readonly pinControlColumns?: boolean;
  readonly pinSelectionColumns?: boolean;
  readonly filterPanel?: DatagridFilterPanelConfig;
  readonly dataContext?: DatagridDataContext<T>;
  readonly dataContextOptions?: DatagridDataContextOptions<T>;

  readonly onSortChange?: (event: DatagridSortChange) => void;
  readonly onSortsChange?: (sorts: DatagridSortsChange) => void;
  readonly onFilterChange?: (filters: DatagridFilterChange<T>) => void;
  readonly onSearchQueryChange?: (query: string) => void;
  readonly onColumnResize?: (event: DatagridColumnResize) => void;
  readonly onColumnGroupResize?: (event: DatagridColumnGroupResize) => void;
  readonly onColumnOrderChange?: (order: DatagridColumnOrderChange) => void;
  readonly onColumnGroupOrderChange?: (order: DatagridColumnGroupOrderChange) => void;
  readonly onColumnVisibilityChange?: (event: DatagridColumnVisibilityChange) => void;
  readonly onGroupByChange?: (groupBy: DatagridGroupBy) => void;
  readonly onGroupSortsChange?: (groupSorts: readonly DatagridGroupSort[]) => void;
  readonly onSelectionChange?: (event: DatagridSelectionChange<T>) => void;
  readonly onPageChange?: (event: DatagridPageChange) => void;
  readonly onRowOrderChange?: (event: DatagridRowOrderChange<T>) => void;
  readonly onCellEditCommit?: (event: DatagridCellEditCommit<T>) => void | boolean | Promise<void | boolean>;
  readonly onRowEditCommit?: (event: DatagridRowEditCommit<T>) => void | boolean | Promise<void | boolean>;
  readonly onNewRowCommit?: (event: DatagridNewRowCommit<T>) => void;
  readonly onEditCancel?: (event: DatagridEditCancel<T>) => void;
  readonly onValidationError?: (event: DatagridValidationEvent<T>) => void;
  readonly onDataContextSaveComplete?: () => void;
  readonly onDataContextSaveError?: (error: unknown) => void;
  readonly onRowClick?: (event: DatagridRowEvent<T>) => void;
  readonly onRowDoubleClick?: (event: DatagridRowEvent<T>) => void;
  readonly onCellClick?: (event: DatagridCellEvent<T>) => void;
  readonly onDetailOpen?: (row: T) => void;
  readonly onDetailClose?: (row: T) => void;
  readonly onFilterExpressionChange?: (expression: FilterGroup) => void;

  readonly columnResizeMode?: 'live' | 'deferred';
  readonly columnReorderMode?: 'live' | 'deferred';
  readonly colResizeMode?: 'live' | 'deferred';
  readonly colReorderMode?: 'live' | 'deferred';
  readonly showColumnMenu?: boolean;

  readonly className?: string;
  readonly style?: CSSProperties;
  readonly ariaLabel?: string;
  readonly ariaLabelledBy?: string;
}

const DEFAULT_COLUMN_WIDTH = 160;
const DEFAULT_MIN_COLUMN_WIDTH = 72;
const DEFAULT_MAX_COLUMN_WIDTH = 480;
const DEFAULT_VIRTUAL_OVERSCAN = 6;
const DEFAULT_COLUMN_VIRTUALIZATION_OVERSCAN = 320;
const DEFAULT_ROW_DETAIL_HEIGHT = 112;
const DEFAULT_ROW_NUMBER_WIDTH = 52;
const DEFAULT_ROW_ACTIONS_WIDTH = 156;
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

interface DatagridPinnedColumnOffset {
  readonly left?: number;
  readonly right?: number;
}

const DEFAULT_EDIT_LABELS: DatagridEditLabels = {
  actions: 'Actions',
  edit: 'Edit',
  save: 'Save',
  cancel: 'Cancel',
};

function getCellValue<T extends object>(row: T, column: DatagridColumn<T>): unknown {
  if (column.valueGetter) {
    return column.valueGetter(row);
  }
  return (row as Record<string, unknown>)[column.key];
}

function formatCellValue<T extends object>(
  row: T,
  rowIndex: number,
  column: DatagridColumn<T>,
  locale = 'en-US',
  nullText = '',
): string {
  const value = getCellValue(row, column);
  if (column.valueFormatter) {
    return column.valueFormatter({ value, row, rowIndex, column });
  }
  if (value === null || value === undefined) return nullText;
  if (typeof value === 'object' && value instanceof Date) {
    return new Intl.DateTimeFormat(locale).format(value);
  }
  if (typeof value === 'number') return new Intl.NumberFormat(locale).format(value);
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  return String(value);
}

function resolveRowSpan<T extends object>(
  rows: readonly T[],
  rowIndex: number,
  column: DatagridColumn<T>,
): number {
  if (!column.rowSpan) return 1;
  const row = rows[rowIndex];
  if (!row) return 1;
  const value = getCellValue(row, column);
  const configuredSpan =
    typeof column.rowSpan === 'function'
      ? column.rowSpan({
          value,
          row,
          rowIndex,
          column,
          rows,
        })
      : column.rowSpan;
  return Math.max(1, Math.floor(Number(configuredSpan) || 1));
}

function isRowSpanCovered<T extends object>(
  rows: readonly T[],
  rowIndex: number,
  column: DatagridColumn<T>,
): boolean {
  for (let startIndex = 0; startIndex < rowIndex; startIndex += 1) {
    if (startIndex + resolveRowSpan(rows, startIndex, column) > rowIndex) return true;
  }
  return false;
}

function validateValue<T extends object>(
  value: unknown,
  row: T,
  column: DatagridColumn<T>,
): readonly DatagridValidationError[] {
  const errors: DatagridValidationError[] = [];
  const rules = column.rules;

  const isBlank =
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0);

  const requiredRule = rules?.required ?? column.required;
  if (requiredRule) {
    if (isBlank) {
      const msg =
        typeof requiredRule === 'string'
          ? requiredRule
          : rules?.requiredMessage ?? `${column.header} is required.`;
      errors.push({ rule: 'required', message: msg });
    }
  }

  if (!isBlank) {
    const minRule = rules?.min ?? column.min;
    if (minRule !== undefined) {
      if (typeof value === 'number' && typeof minRule === 'number' && value < minRule) {
        errors.push({ rule: 'min', message: `Must be at least ${minRule}.` });
      } else if (value instanceof Date && minRule instanceof Date && value < minRule) {
        errors.push({ rule: 'min', message: `Must be on or after ${minRule.toLocaleDateString()}.` });
      }
    }

    const maxRule = rules?.max ?? column.max;
    if (maxRule !== undefined) {
      if (typeof value === 'number' && typeof maxRule === 'number' && value > maxRule) {
        errors.push({ rule: 'max', message: `Must be at most ${maxRule}.` });
      } else if (value instanceof Date && maxRule instanceof Date && value > maxRule) {
        errors.push({ rule: 'max', message: `Must be on or before ${maxRule.toLocaleDateString()}.` });
      }
    }

    const minLength = rules?.minLength ?? column.minLength;
    if (minLength !== undefined && typeof value === 'string' && value.length < minLength) {
      errors.push({ rule: 'minLength', message: `Must be at least ${minLength} characters.` });
    }

    const maxLength = rules?.maxLength ?? column.maxLength;
    if (maxLength !== undefined && typeof value === 'string' && value.length > maxLength) {
      errors.push({ rule: 'maxLength', message: `Must be at most ${maxLength} characters.` });
    }

    const pattern = rules?.pattern ?? column.pattern;
    if (pattern !== undefined && typeof value === 'string') {
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
      if (!regex.test(value)) {
        errors.push({
          rule: 'pattern',
          message: rules?.patternMessage ?? 'Invalid format.',
        });
      }
    }
  }

  const validators = [
    ...(column.validator ? (Array.isArray(column.validator) ? column.validator : [column.validator]) : []),
    ...(column.validators ?? []),
    ...(rules?.custom ? (Array.isArray(rules.custom) ? rules.custom : [rules.custom]) : []),
  ];

  for (const v of validators) {
    if (typeof v === 'function') {
      const res = v(value, row, column);
      if (typeof res === 'string') {
        errors.push({ rule: 'custom', message: res });
      } else if (res === false) {
        errors.push({ rule: 'custom', message: 'Invalid value.' });
      } else if (Array.isArray(res)) {
        for (const item of res) {
          if (typeof item === 'string') {
            errors.push({ rule: 'custom', message: item });
          } else if (item && typeof item === 'object') {
            errors.push(item);
          }
        }
      }
    } else if (v && typeof v === 'object' && typeof v.validator === 'function') {
      const res = v.validator(value, row, column);
      if (typeof res === 'string') {
        errors.push({ rule: v.name ?? 'custom', message: res });
      } else if (res === false) {
        errors.push({ rule: v.name ?? 'custom', message: v.message ?? 'Invalid value.' });
      } else if (Array.isArray(res)) {
        for (const item of res) {
          if (typeof item === 'string') {
            errors.push({ rule: v.name ?? 'custom', message: item });
          } else if (item && typeof item === 'object') {
            errors.push(item);
          }
        }
      }
    }
  }

  return errors;
}

function evaluateDynamicCondition(
  value: unknown,
  condition: DatagridDynamicFilterCondition,
  dataType: 'text' | 'number' | 'date' | 'boolean' = 'text',
): boolean {
  const { operator, value: condVal, valueTo } = condition;
  if (operator === 'isEmpty') {
    return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
  }
  if (operator === 'isNotEmpty') {
    return value !== null && value !== undefined && !(typeof value === 'string' && value.trim() === '');
  }
  if (value === null || value === undefined) return false;

  const normalizedValue = dataType === 'number'
    ? Number(value)
    : dataType === 'date'
      ? new Date(String(value)).getTime()
      : dataType === 'boolean'
        ? Boolean(value)
        : value;
  const normalizedCondition = dataType === 'number'
    ? Number(condVal)
    : dataType === 'date'
      ? new Date(String(condVal)).getTime()
      : dataType === 'boolean'
        ? String(condVal).toLowerCase() === 'true'
        : condVal;
  const normalizedTo = dataType === 'number'
    ? Number(valueTo)
    : dataType === 'date'
      ? new Date(String(valueTo)).getTime()
      : valueTo;
  const strVal = String(normalizedValue).toLowerCase();
  const condStr = normalizedCondition !== undefined && normalizedCondition !== null ? String(normalizedCondition).toLowerCase() : '';

  switch (operator) {
    case 'contains':
      return strVal.includes(condStr);
    case 'notContains':
      return !strVal.includes(condStr);
    case 'startsWith':
      return strVal.startsWith(condStr);
    case 'endsWith':
      return strVal.endsWith(condStr);
    case 'equals':
      if (dataType === 'number' || dataType === 'date') {
        return normalizedValue === normalizedCondition;
      }
      return strVal === condStr;
    case 'notEquals':
      if (dataType === 'number' || dataType === 'date') {
        return normalizedValue !== normalizedCondition;
      }
      return strVal !== condStr;
    case 'greaterThan':
      return Number(normalizedValue) > Number(normalizedCondition);
    case 'greaterThanOrEqual':
      return Number(normalizedValue) >= Number(normalizedCondition);
    case 'lessThan':
      return Number(normalizedValue) < Number(normalizedCondition);
    case 'lessThanOrEqual':
      return Number(normalizedValue) <= Number(normalizedCondition);
    case 'between':
      return Number(normalizedValue) >= Number(normalizedCondition) && Number(normalizedValue) <= Number(normalizedTo);
    default:
      return true;
  }
}

const DATAGRID_DYNAMIC_FILTER_OPERATOR_OPTIONS: readonly SelectOption[] = [
  { value: 'contains', label: 'Contains' },
  { value: 'notContains', label: 'Does not contain' },
  { value: 'startsWith', label: 'Starts with' },
  { value: 'endsWith', label: 'Ends with' },
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Not equal' },
  { value: 'greaterThan', label: 'Greater than' },
  { value: 'greaterThanOrEqual', label: 'Greater than or equal' },
  { value: 'lessThan', label: 'Less than' },
  { value: 'lessThanOrEqual', label: 'Less than or equal' },
  { value: 'between', label: 'Between' },
  { value: 'isEmpty', label: 'Is empty' },
  { value: 'isNotEmpty', label: 'Is not empty' },
];

function computeAggregate<T extends object>(
  aggregate: DatagridAggregate<T>,
  values: readonly unknown[],
  rows: readonly T[],
  column: DatagridColumn<T>,
  scope: DatagridAggregateScope,
): { label: string; value: unknown; formatted: string } {
  const aggType = typeof aggregate === 'string' ? aggregate : aggregate.type;
  const customFn = typeof aggregate === 'object' && aggregate.type === 'custom' ? aggregate.aggregate : null;
  const valueFormatter = typeof aggregate === 'object' ? aggregate.valueFormatter : undefined;
  const customLabel = typeof aggregate === 'object' ? aggregate.label : undefined;

  let calculated: unknown = '';
  let defaultLabel = '';

  const numValues = values
    .map((v) => (typeof v === 'number' ? v : Number(v)))
    .filter((n) => !Number.isNaN(n));

  switch (aggType) {
    case 'sum':
      calculated = numValues.reduce((acc, v) => acc + v, 0);
      defaultLabel = 'Sum';
      break;
    case 'count':
      calculated = values.length;
      defaultLabel = 'Count';
      break;
    case 'avg':
      calculated = numValues.length ? numValues.reduce((acc, v) => acc + v, 0) / numValues.length : 0;
      defaultLabel = 'Avg';
      break;
    case 'min':
      calculated = numValues.length ? Math.min(...numValues) : '';
      defaultLabel = 'Min';
      break;
    case 'max':
      calculated = numValues.length ? Math.max(...numValues) : '';
      defaultLabel = 'Max';
      break;
    case 'custom':
      if (customFn) {
        calculated = customFn({ values, rows, column, scope });
      }
      defaultLabel = 'Total';
      break;
  }

  const label = customLabel ?? defaultLabel;
  let formatted = String(calculated);
  if (valueFormatter) {
    formatted = valueFormatter({
      value: calculated,
      values,
      rows,
      column,
      scope,
    });
  } else if (typeof calculated === 'number' && !Number.isInteger(calculated)) {
    formatted = calculated.toFixed(2);
  }

  return { label, value: calculated, formatted };
}

interface GroupNode<T extends object> {
  key: string;
  groupField: string;
  groupValue: unknown;
  groupPath: readonly string[];
  rows: readonly T[];
  subgroups: readonly GroupNode<T>[];
  expanded: boolean;
}

function buildGroupHierarchy<T extends object>(
  rows: readonly T[],
  groupBy: readonly string[],
  groupSorts: readonly DatagridGroupSort[],
  columns: readonly DatagridColumn<T>[],
  expandedMap: ReadonlyMap<string, boolean>,
  defaultExpanded: boolean,
  depth = 0,
  parentPath: readonly string[] = [],
): readonly GroupNode<T>[] {
  if (depth >= groupBy.length) {
    return [];
  }
  const groupField = groupBy[depth];
  const col = columns.find((c) => c.key === groupField);
  const groupsMap = new Map<string, { value: unknown; rows: T[] }>();

  for (const row of rows) {
    const val = col ? getCellValue(row, col) : (row as Record<string, unknown>)[groupField];
    const key = String(val ?? '');
    if (!groupsMap.has(key)) {
      groupsMap.set(key, { value: val, rows: [] });
    }
    groupsMap.get(key)!.rows.push(row);
  }

  const sortDirection = groupSorts.find((gs) => gs.key === groupField)?.direction ?? 'asc';
  const sortedEntries = [...groupsMap.entries()].sort(([a], [b]) => {
    const cmp = a.localeCompare(b, undefined, { numeric: true });
    return sortDirection === 'desc' ? -cmp : cmp;
  });

  return sortedEntries.map(([strVal, groupData]) => {
    const groupPath = [...parentPath, strVal];
    const pathKey = groupPath.join(' > ');
    const isExpanded = expandedMap.has(pathKey) ? expandedMap.get(pathKey)! : defaultExpanded;

    const subgroups = buildGroupHierarchy(
      groupData.rows,
      groupBy,
      groupSorts,
      columns,
      expandedMap,
      defaultExpanded,
      depth + 1,
      groupPath,
    );

    return {
      key: pathKey,
      groupField,
      groupValue: groupData.value,
      groupPath,
      rows: groupData.rows,
      subgroups,
      expanded: isExpanded,
    };
  });
}

function flattenGroupNodes<T extends object>(
  nodes: readonly GroupNode<T>[],
  flatList: ({ type: 'group'; node: GroupNode<T>; depth: number } | { type: 'row'; row: T })[] = [],
  depth = 0,
): ({ type: 'group'; node: GroupNode<T>; depth: number } | { type: 'row'; row: T })[] {
  for (const node of nodes) {
    flatList.push({ type: 'group', node, depth });
    if (node.expanded) {
      if (node.subgroups.length > 0) {
        flattenGroupNodes(node.subgroups, flatList, depth + 1);
      } else {
        for (const row of node.rows) {
          flatList.push({ type: 'row', row });
        }
      }
    }
  }
  return flatList;
}

function resolveTrackBy<T extends object>(
  trackBy: DatagridTrackBy<T> | keyof T | undefined,
  row: T,
  index: number,
): unknown {
  if (typeof trackBy === 'function') {
    return trackBy(row, index);
  }
  if (trackBy) {
    return (row as Record<string, unknown>)[String(trackBy)];
  }
  return (row as Record<string, unknown>)['id'] ?? (row as Record<string, unknown>)['key'] ?? index;
}

function normalizeClassName(
  value:
    | string
    | readonly string[]
    | Readonly<Record<string, boolean>>
    | null
    | undefined,
): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.filter(Boolean).join(' ');
  return value
    ? Object.entries(value)
        .filter(([, enabled]) => enabled)
        .map(([name]) => name)
        .join(' ')
    : '';
}

function toDropdownItems(items: readonly DatagridColumnMenuItem[]): DropdownItem[] {
  return items.flatMap((item) => [
    ...(item.separator ? [{ separator: true }] : []),
    {
      label: item.label,
      icon: item.icon,
      disabled: item.disabled,
      command: item.command,
      children: item.children ? toDropdownItems(item.children) : undefined,
    },
  ]);
}

function editorValueFor<T extends object>(
  value: unknown,
  row: T,
  column: DatagridColumn<T>,
): unknown {
  if (column.editorValueFormatter) return column.editorValueFormatter(value, row);
  if ((column.editorType === 'date' || value instanceof Date) && value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return value;
}

function parsedEditorValue<T extends object>(value: unknown, row: T, column: DatagridColumn<T>): unknown {
  if (column.valueParser) return column.valueParser(value, row);
  if ((column.editorType === 'date' || getCellValue(row, column) instanceof Date) && typeof value === 'string') {
    if (value === '') return null;
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? value : parsed;
  }
  if (column.editorType === 'number') {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }
  return value;
}

function selectAllInputText(input: HTMLInputElement | null) {
  if (!input) return;
  try {
    input.select();
  } catch {
    // Non-text input types such as date might not support select()
  }
}

function normalizeChoiceOptions(
  options: unknown,
  displayField = 'label',
  valueField = 'value',
): readonly { label: string; value: unknown; disabled?: boolean }[] {
  if (!Array.isArray(options)) return [];
  return options.map((option) => {
    if (option && typeof option === 'object') {
      const record = option as Record<string, unknown>;
      const value = record[valueField] ?? record.value;
      const label = record[displayField] ?? record.label ?? value;
      return {
        label: String(label ?? ''),
        value,
        disabled: record.disabled === true,
      };
    }
    return { label: String(option ?? ''), value: option };
  });
}

function filterValueKey(value: unknown): string {
  if (value instanceof Date) return `date:${value.toISOString()}`;
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  return `${typeof value}:${String(value)}`;
}

function DatagridInner<T extends object = Record<string, unknown>>(
  props: DatagridProps<T>,
  ref: ForwardedRef<DatagridHandle<T>>,
): ReactElement {
  const {
    data: dataProp,
    rows: rowsProp,
    rowData,
    dataSource,
    columns: columnsProp = [],
    columnGroups: columnGroupsProp = [],
    trackBy,
    rowLabel,
    locale: localeProp,
    emptyMessage,
    filterEmptyMessage,
    emptyStateDescription,
    filterEmptyStateDescription = 'Try changing or clearing the active filters.',
    autoColumnWidth = true,
    autoFit,
    chrome = 'default',
    radius,
    border = 'default',
    density = 'default',
    autoRowHeight = false,
    headerTextCase = 'uppercase',
    nullText,
    borderless = false,
    showColumnLines,
    hideColumnLines = false,
    columnLines,
    showColumnBorders,
    rowHover = true,
    reorderable = true,
    defaultColumnWidth = DEFAULT_COLUMN_WIDTH,
    sortMode = 'client',
    sortIndicatorVisibility = 'hover',
    multiSort = false,
    sorts: sortsProp,
    filterMode = 'client',
    filterIndicatorVisibility = 'hover',
    searchQuery: searchQueryProp,
    searchFilter,
    columnFilters: columnFiltersProp,
    columnOrder: columnOrderProp,
    columnGroupOrder: columnGroupOrderProp,
    columnVisibility: columnVisibilityProp,
    hiddenColumns: hiddenColumnsProp,
    columnPins: columnPinsProp,
    groupBy: groupByProp,
    groupSorts: groupSortsProp,
    expandAllGroups = true,
    stickyGroupHeaders = false,
    indentGroupedRows = true,
    selectionMode = 'none',
    selectionControl = 'checkbox',
    appendSelection = false,
    rowSelection = false,
    hideSelectionColumn = false,
    selectOnNavigate = false,
    hideFocusRing = false,
    selection: selectionProp,
    fitColumnsToWidth = false,
    stripedRows = false,
    showVerticalLines = false,
    showRowNumbers: showRowNumbersProp = false,
    rowNumbers = false,
    rowHeight,
    headerHeight,
    autoHeight = true,
    fixedHeight,
    paginate: paginateProp,
    pagination: paginationProp,
    pageSize: pageSizeProp,
    page: pageProp,
    paginationType = 'compact',
    paginationRowsOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    pageSizeOptions,
    virtualScroll = false,
    virtualScrollHeight = 400,
    virtualRowHeight = 32,
    virtualOverscan = DEFAULT_VIRTUAL_OVERSCAN,
    columnVirtualization = false,
    columnVirtualizationOverscan = DEFAULT_COLUMN_VIRTUALIZATION_OVERSCAN,
    virtualPaging = false,
    virtualPage = 1,
    virtualTotalRows,
    virtualHasPreviousPage,
    virtualHasNextPage,
    virtualPagingLoading = false,
    virtualDataSourceWindow = false,
    virtualPageRequest,
    onVirtualPageRequest,
    onPageSizeChange,
    editMode = 'none',
    editOnType = false,
    autoEditOnNavigate = false,
    manualCommit = false,
    showDirtyIndicator = true,
    undoStackSize = 100,
    enableUndoShortcuts = true,
    enableFillDown = true,
    editLabels: customEditLabels,
    isRowEditable,
    isCellEditable,
    isCellReadonly,
    allowNewRow: allowNewRowProp = false,
    enableNewRow,
    newRowPrompt,
    newRowLabel,
    newRowFactory,
    newRowPosition = 'bottom',
    newRowCommit = 'immediate',
    preventInvalidCommit = true,
    onCellValidationFailed,
    onRowValidationFailed,
    reorderableRows: reorderableRowsProp,
    rowReorder: rowReorderProp,
    rowReorderable,
    rowDetailExpandable,
    rowClassName,
    rowStyle,
    cellClassName,
    cellStyle,
    showGroupToolbar = false,
    showColumnSelector = false,
    showStatusbar = false,
    statusbarStart,
    statusbarEnd,
    toolbarStart,
    toolbarEnd,
    emptyTitle,
    emptyDescription,
    emptyIcon = 'search',
    emptyState,
    loading = false,
    loadingMode = 'spinner',
    skeletonRowCount = 5,
    loadingMessage: loadingMessageProp,
    toolbar = false,
    searchable = false,
    columnSelector = false,
    statusbar = false,
    statusbarAriaLabel,
    statusbarShowRowCount = true,
    statusbarShowSelectedRowCount = true,
    statusbarMergePagination = false,
    footer = false,
    footerLabel,
    toolbarAriaLabel,
    toolbarShowColumnSelector = true,
    toolbarShowGroupedColumns = true,
    groupSorting = false,
    groupsExpandedByDefault,
    columnMenu = false,
    columnSelectorLabel,
    hiddenColumnKeys,
    groupSelection = false,
    detailPaneWidth = 320,
    rowDetailHeight = DEFAULT_ROW_DETAIL_HEIGHT,
    leadingRowActionsWidth = 40,
    validateOnInput = true,
    rowClass,
    rowNumbers: rowNumbersAlias,
    searchTerm,
    editOnClick = false,
    selectedRows,
    onSelectedRowsChange,
    expandedRows,
    onExpandedRowsChange,
    onDetailPaneRowChange,
    detailPaneTitle,
    cellTemplates = {},
    cellEditors = {},
    rowDetail: rowDetailProp,
    rowDetails: rowDetailsProp,
    detailPane,
    detailPaneRenderer,
    detailPaneRow,
    leadingRowActions,
    rowTemplate,
    treeChildrenField,
    treeExpandedByDefault = false,
    nestedGrid,
    infiniteScroll = false,
    infiniteScrollThreshold = 120,
    onLoadMore,
    pinControlColumns = false,
    pinSelectionColumns = true,
    filterPanel,
    dataContext,
    dataContextOptions,
    onSortChange,
    onSortsChange,
    onFilterChange,
    onSearchQueryChange,
    onColumnResize,
    onColumnGroupResize,
    onColumnOrderChange,
    onColumnGroupOrderChange,
    onColumnVisibilityChange,
    onGroupByChange,
    onGroupSortsChange,
    onSelectionChange,
    onPageChange,
    onRowOrderChange,
    onCellEditCommit,
    onRowEditCommit,
    onNewRowCommit,
    onEditCancel,
    onValidationError,
    onDataContextSaveComplete,
    onDataContextSaveError,
    onRowClick,
    onRowDoubleClick,
    onCellClick,
    onDetailOpen,
    onDetailClose,
    onFilterExpressionChange,
    columnResizeMode,
    columnReorderMode,
    colResizeMode,
    colReorderMode,
    showColumnMenu,
    className = '',
    style,
    ariaLabel: ariaLabelProp,
    ariaLabelledBy,
  } = props;

  const { t, locale: i18nLocale } = useI18n();
  const effectiveFitColumnsToWidth = autoFit ?? fitColumnsToWidth;
  const effectiveShowColumnLines = hideColumnLines
    ? false
    : showColumnLines ?? columnLines ?? showColumnBorders ?? showVerticalLines;
  const effectiveColumnMenu = showColumnMenu ?? columnMenu;
  const effectiveResizeMode = columnResizeMode ?? colResizeMode ?? 'live';
  const effectiveReorderMode = columnReorderMode ?? colReorderMode ?? 'deferred';
  const isPaginated = virtualPaging || (paginateProp ?? paginationProp ?? false);
  const isRowReorder = reorderableRowsProp ?? rowReorderProp ?? false;
  const allowNewRow = enableNewRow ?? allowNewRowProp;
  const showRowNumbers = rowNumbersAlias ?? rowNumbers ?? showRowNumbersProp;
  const activeSearchTermProp = searchQueryProp ?? searchTerm;
  const defaultGroupsExpanded = groupsExpandedByDefault ?? expandAllGroups;
  const effectiveLocale = localeProp ?? i18nLocale;
  const effectivePageSizeOptions = pageSizeOptions ?? paginationRowsOptions;
  const rowDetail = useMemo(() => rowDetailProp ?? (typeof rowDetailsProp === 'function' ? rowDetailsProp : undefined) ??
      (nestedGrid
        ? ({ row }: { row: T }) => (
            <div style={{ height: nestedGrid.height ?? 300 }}>
              <Datagrid
                data={nestedGrid.getRows(row)}
                columns={nestedGrid.columns}
                {...nestedGrid.props}
                autoHeight={false}
                fixedHeight="100%"
              />
            </div>
          )
        : treeChildrenField
          ? ({ row }: { row: T }) => {
              const children = (row as Record<string, unknown>)[String(treeChildrenField)];
              return Array.isArray(children) && children.length > 0 ? (
                <Datagrid
                  rows={children.filter((child) => Boolean(child) && typeof child === 'object') as readonly T[]}
                  columns={columnsProp}
                  treeChildrenField={treeChildrenField as string}
                  treeExpandedByDefault={treeExpandedByDefault}
                  autoHeight
                  chrome="flush"
                  border="none"
                  ariaLabel={`${ariaLabelProp ?? 'Data Grid'} child rows`}
                />
              ) : null;
            }
          : undefined),
    [ariaLabelProp, columnsProp, nestedGrid, rowDetailProp, rowDetailsProp, treeChildrenField, treeExpandedByDefault]);
  const effectiveDetailPaneRenderer =
    typeof detailPane === 'function'
      ? detailPane
      : detailPaneRenderer;
  const isShowColumnSelector = showColumnSelector || columnSelector;
  const showColumnSelectorInToolbar = isShowColumnSelector && toolbarShowColumnSelector;
  const isShowStatusbar = showStatusbar || statusbar;
  const isShowGroupToolbar = (showGroupToolbar || groupSorting) && toolbarShowGroupedColumns;

  const ariaLabel = ariaLabelProp ?? t('dataGrid') ?? 'Data Grid';
  const gridId = useId();
  const [dataSourceRows, setDataSourceRows] = useState<readonly T[]>([]);
  const [dataSourceTotal, setDataSourceTotal] = useState(0);
  const [dataSourceLoading, setDataSourceLoading] = useState(false);
  const [appendedRows, setAppendedRows] = useState<readonly T[]>([]);
  const [loadMorePending, setLoadMorePending] = useState(false);
  const effectiveLoading = loading || dataSourceLoading;

  // Data Context Adapter
  const dataContextAdapter = useMemo<DatagridDataContextAdapter<T> | null>(() => {
    if (!dataContext) return null;
    return createDatagridDataContextAdapter(dataContext, dataContextOptions);
  }, [dataContext, dataContextOptions]);

  // Raw source rows
  const rawRows: readonly T[] = useMemo(() => {
    if (dataContextAdapter) {
      return dataContextAdapter.rows;
    }
    const base = dataSource ? dataSourceRows : dataProp ?? rowsProp ?? rowData ?? [];
    return appendedRows.length > 0 ? [...base, ...appendedRows] : base;
  }, [appendedRows, dataContextAdapter, dataProp, dataSource, dataSourceRows, rowData, rowsProp]);

  // Local controllable states
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const activeSearchQuery = activeSearchTermProp !== undefined ? activeSearchTermProp : internalSearchQuery;

  const [internalSorts, setInternalSorts] = useState<readonly DatagridSort[]>([]);
  const activeSorts = sortsProp !== undefined ? sortsProp : internalSorts;

  const [internalColumnFilters, setInternalColumnFilters] = useState<readonly DatagridColumnFilter<T>[]>([]);
  const activeColumnFilters = columnFiltersProp !== undefined ? columnFiltersProp : internalColumnFilters;
  const hasActiveFilters = activeSearchQuery.trim().length > 0 || activeColumnFilters.length > 0;
  const resolvedFilterEmptyDescription =
    filterEmptyStateDescription ?? filterEmptyMessage ?? emptyDescription ?? 'Try changing or clearing the active filters.';
  const resolvedEmptyTitle =
    hasActiveFilters ? filterEmptyMessage ?? t('noMatchingRows') : emptyMessage ?? emptyTitle ?? t('noRowsToDisplay');
  const resolvedEmptyDescription = hasActiveFilters
    ? resolvedFilterEmptyDescription
    : emptyStateDescription ?? emptyDescription;
  const statusbarEnabled = isShowStatusbar || (statusbarMergePagination && isPaginated);
  const resolvedEditLabels: DatagridEditLabels = {
    actions: customEditLabels?.actions ?? t('actions') ?? DEFAULT_EDIT_LABELS.actions,
    edit: customEditLabels?.edit ?? t('edit') ?? DEFAULT_EDIT_LABELS.edit,
    save: customEditLabels?.save ?? t('save') ?? DEFAULT_EDIT_LABELS.save,
    cancel: customEditLabels?.cancel ?? t('cancel') ?? DEFAULT_EDIT_LABELS.cancel,
  };
  const resolvedLoadingMessage = loadingMessageProp ?? t('loadingData');
  const resolvedNewRowPrompt = newRowLabel ?? newRowPrompt ?? t('newRow');

  const [internalColumnOrder, setInternalColumnOrder] = useState<readonly string[]>(() =>
    columnsProp.map((c) => c.key),
  );
  const activeColumnOrder = columnOrderProp !== undefined ? columnOrderProp : internalColumnOrder;

  const [internalColumnGroupOrder, setInternalColumnGroupOrder] = useState<readonly string[]>(() =>
    columnGroupsProp.map((group) => group.key),
  );
  const activeColumnGroupOrder =
    columnGroupOrderProp !== undefined ? columnGroupOrderProp : internalColumnGroupOrder;

  const [internalHiddenColumns, setInternalHiddenColumns] = useState<ReadonlySet<string>>(() => {
    if (columnVisibilityProp) {
      const visSet = new Set(columnVisibilityProp);
      return new Set(columnsProp.filter((c) => !visSet.has(c.key)).map((c) => c.key));
    }
    if (hiddenColumnsProp || hiddenColumnKeys) {
      return new Set([...(hiddenColumnsProp ?? []), ...(hiddenColumnKeys ?? [])]);
    }
    return new Set();
  });

  const [internalGroupBy, setInternalGroupBy] = useState<readonly string[]>([]);
  const activeGroupBy = groupByProp !== undefined ? groupByProp : internalGroupBy;

  const [internalGroupSorts, setInternalGroupSorts] = useState<readonly DatagridGroupSort[]>([]);
  const activeGroupSorts = groupSortsProp !== undefined ? groupSortsProp : internalGroupSorts;

  const [groupExpandedMap, setGroupExpandedMap] = useState<Map<string, boolean>>(new Map());

  const [internalSelection, setInternalSelection] = useState<readonly T[]>([]);
  const activeSelection = selectionProp !== undefined ? selectionProp : (selectedRows !== undefined ? selectedRows : internalSelection);
  const lastSelectedIndexRef = useRef<number | null>(null);

  const [internalPage, setInternalPage] = useState(pageProp ?? 1);
  const activePage = virtualPaging ? Math.max(1, virtualPage) : pageProp !== undefined ? pageProp : internalPage;

  const [internalPageSize, setInternalPageSize] = useState(pageSizeProp ?? 25);
  const activePageSize = pageSizeProp !== undefined ? pageSizeProp : internalPageSize;

  const [columnWidths, setColumnWidths] = useState<Map<string, number | 'auto'>>(new Map());
  const [internalExpandedRowDetails, setInternalExpandedRowDetails] = useState<Set<unknown>>(new Set());
  const expandedRowDetails = useMemo(() => {
    if (expandedRows === undefined) return internalExpandedRowDetails;

    const controlledRows = new Set<unknown>(expandedRows);
    const expandedIds = new Set<unknown>();
    rawRows.forEach((row, index) => {
      const rowId = resolveTrackBy(trackBy, row, index);
      if (controlledRows.has(row) || controlledRows.has(rowId)) expandedIds.add(rowId);
    });
    return expandedIds;
  }, [expandedRows, internalExpandedRowDetails, rawRows, trackBy]);
  useEffect(() => {
    if (!treeChildrenField || !treeExpandedByDefault || expandedRows !== undefined) return;
    setInternalExpandedRowDetails(new Set(rawRows.flatMap((row, index) => {
      const children = (row as Record<string, unknown>)[String(treeChildrenField)];
      return Array.isArray(children) && children.length > 0 ? [resolveTrackBy(trackBy, row, index)] : [];
    })));
  }, [expandedRows, rawRows, trackBy, treeChildrenField, treeExpandedByDefault]);
  const [internalDetailPaneRow, setInternalDetailPaneRow] = useState<T | null>(null);
  const activeDetailPaneRow = detailPaneRow !== undefined ? detailPaneRow : internalDetailPaneRow;
  const setActiveDetailPaneRow = useCallback(
    (next: T | null) => {
      if (activeDetailPaneRow && activeDetailPaneRow !== next) onDetailClose?.(activeDetailPaneRow);
      if (next && activeDetailPaneRow !== next) onDetailOpen?.(next);
      setInternalDetailPaneRow(next);
      onDetailPaneRowChange?.(next);
    },
    [activeDetailPaneRow, onDetailClose, onDetailOpen, onDetailPaneRowChange],
  );

  const updateExpandedRowDetails = useCallback(
    (next: Set<unknown>) => {
      setInternalExpandedRowDetails(next);
      const nextRows = rawRows.filter((row, index) => next.has(resolveTrackBy(trackBy, row, index)));
      onExpandedRowsChange?.(nextRows);
    },
    [onExpandedRowsChange, rawRows, trackBy],
  );

  // Edit states
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; key: string } | null>(null);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [rowDrafts, setRowDrafts] = useState<Map<string, unknown>>(new Map());
  const [newRowDraft, setNewRowDraft] = useState<T | null>(null);
  const [newRowEditing, setNewRowEditing] = useState(false);
  const [cellDraftValue, setCellDraftValue] = useState<unknown>(undefined);
  const [cellValidationErrors, setCellValidationErrors] = useState<readonly DatagridValidationError[]>([]);
  const [dirtyCells, setDirtyCells] = useState<ReadonlySet<string>>(new Set());
  const [editHistory, setEditHistory] = useState<readonly DatagridCellEditCommit<T>[]>([]);
  const [editHistoryIndex, setEditHistoryIndex] = useState(0);
  const lastEditedCellRef = useRef<{ row: T; rowIndex: number; column: DatagridColumn<T> } | null>(null);

  // Drag states
  const [draggedColumnKey, setDraggedColumnKey] = useState<string | null>(null);
  const [columnDropTarget, setColumnDropTarget] = useState<{ key: string; position: 'before' | 'after' } | null>(null);
  const [draggedColumnGroupKey, setDraggedColumnGroupKey] = useState<string | null>(null);
  const [columnGroupDropTarget, setColumnGroupDropTarget] = useState<{ key: string; position: 'before' | 'after' } | null>(null);
  const [draggedSelectorColumnKey, setDraggedSelectorColumnKey] = useState<string | null>(null);
  const [selectorDropTarget, setSelectorDropTarget] = useState<{ key: string; position: 'before' | 'after' } | null>(null);
  const [dragGhostPos, setDragGhostPos] = useState<{ x: number; y: number } | null>(null);
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);
  const [rowDropTarget, setRowDropTarget] = useState<{ index: number; position: 'before' | 'after' } | null>(null);
  const [isGroupToolbarDragOver, setIsGroupToolbarDragOver] = useState(false);
  const [draggedToolbarGroupKey, setDraggedToolbarGroupKey] = useState<string | null>(null);
  const [toolbarGroupDropTarget, setToolbarGroupDropTarget] = useState<{
    key: string;
    position: 'before' | 'after';
  } | null>(null);

  // Popovers & menus
  const [activeFilterPopover, setActiveFilterPopover] = useState<{
    key: string;
    triggerRect: DOMRect;
  } | null>(null);
  const [activeColumnMenu, setActiveColumnMenu] = useState<{
    key: string;
  } | null>(null);
  const [showColumnSelectorPopover, setShowColumnSelectorPopover] = useState<{
    source: 'toolbar' | 'statusbar';
  } | null>(null);

  // Error badge floating position
  const [floatingError, setFloatingError] = useState<{
    message: string;
    rect: DOMRect;
  } | null>(null);

  const [virtualScrollTop, setVirtualScrollTop] = useState(0);
  const [virtualViewportHeight, setVirtualViewportHeight] = useState(virtualScrollHeight);
  const [horizontalScrollLeft, setHorizontalScrollLeft] = useState(0);
  const [horizontalViewportWidth, setHorizontalViewportWidth] = useState(0);

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dataSourceRequestRef = useRef(0);
  const [pinnedColumnOffsets, setPinnedColumnOffsets] = useState<ReadonlyMap<string, DatagridPinnedColumnOffset>>(new Map());

  const effectiveSelectionMode: DatagridSelectionMode =
    selectionMode === 'none' && dataContextAdapter?.synchronizeSelection ? 'single' : selectionMode;
  const showSelectionColumn = effectiveSelectionMode !== 'none' && !hideSelectionColumn;
  const effectiveVirtualRowHeight = Math.max(1, rowHeight ?? virtualRowHeight);
  const virtualizationEnabled = virtualScroll && !autoRowHeight && activeGroupBy.length === 0 && !isPaginated;

  useEffect(() => {
    if (!dataSource) return;
    const requestId = ++dataSourceRequestRef.current;
    const windowStart = virtualDataSourceWindow
      ? Math.max(0, Math.floor(virtualScrollTop / effectiveVirtualRowHeight) - virtualOverscan)
      : 0;
    setDataSourceLoading(true);
    void dataSource.read({
      pageNumber: activePage,
      pageSize: virtualDataSourceWindow
        ? Math.max(activePageSize, Math.ceil(virtualViewportHeight / effectiveVirtualRowHeight) + virtualOverscan * 2)
        : activePageSize,
      searchTerm: activeSearchQuery || undefined,
      sortBy: activeSorts.length > 0
        ? activeSorts.map((sort) => `${sort.key}:${sort.direction}`).join(',')
        : undefined,
      custom: virtualDataSourceWindow ? { start: windowStart, count: activePageSize } : undefined,
    }).then((response) => {
      if (requestId !== dataSourceRequestRef.current) return;
      setDataSourceRows(response.data);
      setDataSourceTotal(response.totalRecords);
      setAppendedRows([]);
    }).catch(() => {
      if (requestId === dataSourceRequestRef.current) {
        setDataSourceRows([]);
        setDataSourceTotal(0);
      }
    }).finally(() => {
      if (requestId === dataSourceRequestRef.current) setDataSourceLoading(false);
    });
  }, [activePage, activePageSize, activeSearchQuery, activeSorts, dataSource, effectiveVirtualRowHeight, virtualDataSourceWindow, virtualOverscan, virtualScrollTop, virtualViewportHeight]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || (!virtualScroll && !columnVirtualization && !infiniteScroll)) {
      return;
    }

    const updateViewportHeight = () => {
      setVirtualViewportHeight(viewport.clientHeight || virtualScrollHeight);
      setHorizontalViewportWidth(viewport.clientWidth);
    };
    const handleScroll = () => {
      setVirtualScrollTop(viewport.scrollTop);
      setHorizontalScrollLeft(viewport.scrollLeft);
      if (
        infiniteScroll &&
        onLoadMore &&
        !loadMorePending &&
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= infiniteScrollThreshold
      ) {
        setLoadMorePending(true);
        void onLoadMore(rawRows.length).then((more) => {
          if (more?.length) setAppendedRows((current) => [...current, ...more]);
        }).finally(() => setLoadMorePending(false));
      }
    };
    updateViewportHeight();
    viewport.addEventListener('scroll', handleScroll, { passive: true });
    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(updateViewportHeight)
      : null;
    observer?.observe(viewport);
    return () => {
      viewport.removeEventListener('scroll', handleScroll);
      observer?.disconnect();
    };
  }, [columnVirtualization, infiniteScroll, infiniteScrollThreshold, loadMorePending, onLoadMore, rawRows.length, virtualScroll, virtualScrollHeight]);

  // Column order & pinned setup
  const orderedColumns = useMemo(() => {
    const colMap = new Map(columnsProp.map((col) => [col.key, col]));
    const list: DatagridColumn<T>[] = [];
    for (const key of activeColumnOrder) {
      const col = colMap.get(key);
      if (col && !internalHiddenColumns.has(key)) {
        list.push(col);
      }
    }
    // Any remaining columns not in order list
    for (const col of columnsProp) {
      if (!internalHiddenColumns.has(col.key) && !list.some((c) => c.key === col.key)) {
        list.push(col);
      }
    }
    return list;
  }, [columnsProp, activeColumnOrder, internalHiddenColumns]);

  const orderedColumnGroups = useMemo(() => {
    const groupsByKey = new Map(columnGroupsProp.map((group) => [group.key, group]));
    const ordered = activeColumnGroupOrder.flatMap((key) => {
      const group = groupsByKey.get(key);
      if (!group) return [];
      groupsByKey.delete(key);
      return [group];
    });
    return [...ordered, ...columnGroupsProp.filter((group) => groupsByKey.has(group.key))];
  }, [activeColumnGroupOrder, columnGroupsProp]);

  const selectorColumns = useMemo(
    () => [...columnsProp].sort((left, right) => activeColumnOrder.indexOf(left.key) - activeColumnOrder.indexOf(right.key)),
    [activeColumnOrder, columnsProp],
  );

  // Pinned column partitions: left, center, right
  const { leftPinned, rightPinned, visibleColumns } = useMemo(() => {
    const left: DatagridColumn<T>[] = [];
    const center: DatagridColumn<T>[] = [];
    const right: DatagridColumn<T>[] = [];

    for (const col of orderedColumns) {
      const pin = columnPinsProp?.[col.key] ?? col.pinned;
      if (pin === 'left') {
        left.push(col);
      } else if (pin === 'right') {
        right.push(col);
      } else {
        center.push(col);
      }
    }

    return {
      leftPinned: left,
      rightPinned: right,
      visibleColumns: [...left, ...center, ...right],
    };
  }, [orderedColumns, columnPinsProp]);

  const hasPinnedColumns = leftPinned.length > 0 || rightPinned.length > 0;
  const hasActiveRowSpans = visibleColumns.some((column) => column.rowSpan !== undefined);
  const hasLeadingRowActions = Boolean(leadingRowActions || effectiveDetailPaneRenderer);
  const showRowEditActions =
    editMode === 'row' && visibleColumns.some((column) => column.editable === true || typeof column.editable === 'function');

  const columnVirtualLayout = useMemo(() => {
    const centerColumns = visibleColumns.filter((column) => {
      const pin = columnPinsProp?.[column.key] ?? column.pinned;
      return pin !== 'left' && pin !== 'right';
    });
    const widthFor = (column: DatagridColumn<T>) => {
      const configured = columnWidths.get(column.key) ?? column.width;
      const width = typeof configured === 'number'
        ? configured
        : typeof configured === 'string' && configured.endsWith('%')
          ? defaultColumnWidth
          : defaultColumnWidth;
      return Math.min(column.maxWidth ?? Number.POSITIVE_INFINITY, Math.max(column.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH, width));
    };
    if (!columnVirtualization || centerColumns.length === 0 || horizontalViewportWidth <= 0) {
      return { columns: visibleColumns, beforeWidth: 0, afterWidth: 0 };
    }
    const leftPinnedWidth = leftPinned.reduce((total, column) => total + widthFor(column), 0);
    const rightPinnedWidth = rightPinned.reduce((total, column) => total + widthFor(column), 0);
    const viewportWidth = Math.max(1, horizontalViewportWidth - leftPinnedWidth - rightPinnedWidth);
    const overscan = Math.max(0, columnVirtualizationOverscan);
    const offsets = [0];
    for (const column of centerColumns) offsets.push((offsets.at(-1) ?? 0) + widthFor(column));
    const targetStart = Math.max(0, horizontalScrollLeft - leftPinnedWidth - overscan);
    const targetEnd = horizontalScrollLeft - leftPinnedWidth + viewportWidth + overscan;
    let start = 0;
    while (start < centerColumns.length && (offsets[start + 1] ?? 0) <= targetStart) start += 1;
    let end = start;
    while (end < centerColumns.length && (offsets[end] ?? 0) < targetEnd) end += 1;
    end = Math.max(start + 1, Math.min(centerColumns.length, end));
    return {
      columns: [...leftPinned, ...centerColumns.slice(start, end), ...rightPinned],
      beforeWidth: offsets[start] ?? 0,
      afterWidth: Math.max(0, (offsets.at(-1) ?? 0) - (offsets[end] ?? offsets.at(-1) ?? 0)),
    };
  }, [columnVirtualization, columnVirtualizationOverscan, columnPinsProp, columnWidths, defaultColumnWidth, horizontalScrollLeft, horizontalViewportWidth, leftPinned, rightPinned, visibleColumns]);
  const renderedColumns = columnVirtualLayout.columns;

  // Filtered rows
  const filteredRows = useMemo(() => {
    let list = rawRows;

    // Search query filter
    if (activeSearchQuery.trim() !== '') {
      const q = activeSearchQuery.toLowerCase();
      if (searchFilter) {
        list = list.filter((r) => searchFilter(r, activeSearchQuery));
      } else {
        list = list.filter((row) =>
          visibleColumns.some((col) => {
            const formatted = formatCellValue(row, 0, col, effectiveLocale).toLocaleLowerCase(effectiveLocale);
            return formatted.includes(q);
          }),
        );
      }
    }

    // Column distinct & dynamic filters
    if (filterMode === 'client') {
      for (const filter of activeColumnFilters) {
        const col = visibleColumns.find((c) => c.key === filter.key);
        if (!col) continue;

        if (filter.values && filter.values.length > 0) {
          list = list.filter((row) => {
            const val = getCellValue(row, col);
            if (col.filterPredicate) {
              return col.filterPredicate(val, filter.values, row);
            }
            return filter.values.some((candidate) => filterValueKey(candidate) === filterValueKey(val));
          });
        }

        if (filter.condition) {
          list = list.filter((row) => {
            const val = getCellValue(row, col);
            return evaluateDynamicCondition(val, filter.condition!, col.filterDataType ?? 'text');
          });
        }
      }
    }

    return list;
  }, [rawRows, activeSearchQuery, searchFilter, visibleColumns, filterMode, activeColumnFilters, effectiveLocale]);

  // Sorted rows
  const sortedRows = useMemo(() => {
    if (sortMode !== 'client' || activeSorts.length === 0) {
      return filteredRows;
    }

    const list = [...filteredRows];
    list.sort((a, b) => {
      for (const sort of activeSorts) {
        const col = visibleColumns.find((c) => c.key === sort.key);
        if (!col) continue;

        const valA = getCellValue(a, col);
        const valB = getCellValue(b, col);

        let cmp = 0;
        if (col.sortComparator) {
          cmp = col.sortComparator(valA, valB, a, b);
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          cmp = valA - valB;
        } else if (valA instanceof Date && valB instanceof Date) {
          cmp = valA.getTime() - valB.getTime();
        } else {
          cmp = String(valA ?? '').localeCompare(String(valB ?? ''), effectiveLocale, {
            numeric: true,
            sensitivity: 'base',
          });
        }

        if (cmp !== 0) {
          return sort.direction === 'desc' ? -cmp : cmp;
        }
      }
      return 0;
    });

    return list;
  }, [filteredRows, sortMode, activeSorts, visibleColumns, effectiveLocale]);

  // Grouped rows
  const groupedHierarchy = useMemo(() => {
    if (activeGroupBy.length === 0) return [];
    return buildGroupHierarchy(
      sortedRows,
      activeGroupBy,
      activeGroupSorts,
      visibleColumns,
      groupExpandedMap,
      defaultGroupsExpanded,
    );
  }, [sortedRows, activeGroupBy, activeGroupSorts, visibleColumns, groupExpandedMap, defaultGroupsExpanded]);

  const flattenedRows = useMemo(() => {
    if (activeGroupBy.length === 0) {
      return sortedRows.map((row) => ({ type: 'row' as const, row }));
    }
    return flattenGroupNodes(groupedHierarchy);
  }, [activeGroupBy, sortedRows, groupedHierarchy]);

  // Paged rows
  const totalRowsCount = dataSource && dataSourceTotal > 0
    ? dataSourceTotal
    : virtualPaging
    ? virtualTotalRows ?? (Math.max(0, activePage - 1) * activePageSize + sortedRows.length)
    : sortedRows.length;
  const totalPages = virtualPaging
    ? virtualTotalRows === undefined
      ? Math.max(activePage, activePage + (virtualHasNextPage === true ? 1 : 0))
      : Math.max(1, Math.ceil(virtualTotalRows / activePageSize))
    : Math.max(1, Math.ceil(totalRowsCount / activePageSize));
  const canVirtualPrevious =
    !virtualPagingLoading && (virtualHasPreviousPage ?? activePage > 1);
  const canVirtualNext =
    !virtualPagingLoading &&
    (virtualHasNextPage ??
      (virtualTotalRows !== undefined
        ? activePage * activePageSize < virtualTotalRows
        : sortedRows.length >= activePageSize));

  const displayRows = useMemo(() => {
    if (virtualPaging) {
      return sortedRows.map((row) => ({ type: 'row' as const, row }));
    }
    if (!isPaginated || activeGroupBy.length > 0 || virtualScroll) {
      return flattenedRows;
    }
    const startIndex = (activePage - 1) * activePageSize;
    return flattenedRows.slice(startIndex, startIndex + activePageSize);
  }, [virtualPaging, isPaginated, activeGroupBy, flattenedRows, activePage, activePageSize, sortedRows, virtualScroll]);

  const virtualStartIndex = virtualizationEnabled
    ? Math.max(0, Math.floor(virtualScrollTop / effectiveVirtualRowHeight) - Math.max(0, virtualOverscan))
    : 0;
  const virtualEndIndex = virtualizationEnabled
    ? Math.min(
        displayRows.length,
        Math.ceil((virtualScrollTop + virtualViewportHeight) / effectiveVirtualRowHeight) +
          Math.max(0, virtualOverscan),
      )
    : displayRows.length;
  const renderedDisplayRows = virtualizationEnabled
    ? displayRows.slice(virtualStartIndex, Math.max(virtualStartIndex, virtualEndIndex))
    : displayRows;
  const virtualTopSpacer = virtualizationEnabled ? virtualStartIndex * effectiveVirtualRowHeight : 0;
  const virtualBottomSpacer = virtualizationEnabled
    ? Math.max(0, (displayRows.length - virtualEndIndex) * effectiveVirtualRowHeight)
    : 0;
  const rowReorderingEnabled =
    isRowReorder &&
    !isPaginated &&
    !virtualPaging &&
    !virtualScroll &&
    activeGroupBy.length === 0 &&
    activeSorts.length === 0 &&
    activeSearchQuery.trim().length === 0 &&
    activeColumnFilters.length === 0;

  // Column width calculations & CSS Grid template
  const gridTemplateColumns = useMemo(() => {
    const parts: string[] = [];

    // Leading toggles / detail / selection / numbers
    if (rowDetail) parts.push('40px');
    if (hasLeadingRowActions) parts.push(`${Math.max(32, leadingRowActionsWidth)}px`);
    if (isRowReorder) parts.push('32px');
    if (showSelectionColumn) parts.push('40px');
    if (showRowNumbers) parts.push(`${DEFAULT_ROW_NUMBER_WIDTH}px`);

    if (columnVirtualization && columnVirtualLayout.beforeWidth > 0) {
      parts.push(`${columnVirtualLayout.beforeWidth}px`);
    }

    for (const col of renderedColumns) {
      const explicitWidth = columnWidths.get(col.key) ?? col.width;
      if (explicitWidth !== undefined) {
        if (typeof explicitWidth === 'number') {
          const bounded = Math.min(col.maxWidth ?? DEFAULT_MAX_COLUMN_WIDTH, Math.max(col.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH, explicitWidth));
          parts.push(`${bounded}px`);
        } else if (explicitWidth === 'auto') {
          parts.push('minmax(min-content, max-content)');
        } else {
          parts.push(explicitWidth);
        }
      } else if (col.flex !== undefined) {
        const minW = col.minWidth ? `${col.minWidth}px` : 'min-content';
        parts.push(`minmax(${minW}, ${col.flex}fr)`);
      } else {
        const minW = col.minWidth !== undefined
          ? `${col.minWidth}px`
          : autoColumnWidth
            ? 'min-content'
            : `${defaultColumnWidth}px`;
        if (autoColumnWidth) {
          parts.push(`minmax(${minW}, ${fitColumnsToWidth ? '1fr' : col.maxWidth ? `${col.maxWidth}px` : 'max-content'})`);
        } else {
          const width = Math.min(col.maxWidth ?? defaultColumnWidth, Math.max(col.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH, defaultColumnWidth));
          parts.push(`${width}px`);
        }
      }
    }

    if (columnVirtualization && columnVirtualLayout.afterWidth > 0) {
      parts.push(`${columnVirtualLayout.afterWidth}px`);
    }

    if (showRowEditActions) {
      parts.push('max-content');
    }

    if (!fitColumnsToWidth) {
      parts.push('minmax(0, 1fr)');
    }

    return parts.join(' ');
  }, [
    rowDetail,
    hasLeadingRowActions,
    leadingRowActionsWidth,
    isRowReorder,
    showSelectionColumn,
    autoColumnWidth,
    defaultColumnWidth,
    showRowNumbers,
    renderedColumns,
    columnVirtualization,
    columnVirtualLayout,
    columnWidths,
    fitColumnsToWidth,
    showRowEditActions,
  ]);

  // Measure the rendered tracks so sticky columns remain anchored when column widths,
  // responsive layout, or row actions change.
  useEffect(() => {
    const grid = gridContainerRef.current;
    if (!grid || !hasPinnedColumns) {
      return;
    }

    const measure = () => {
      const headerCells = new Map(
        Array.from(
          grid.querySelectorAll<HTMLElement>('.sp-datagrid__header-row [data-sp-datagrid-column]'),
        ).flatMap((cell) => {
          const key = cell.dataset.spDatagridColumn;
          return key ? [[key, cell] as const] : [];
        }),
      );
      const widthFor = (column: DatagridColumn<T>) => {
        const renderedWidth = headerCells.get(column.key)?.getBoundingClientRect().width ?? 0;
        if (renderedWidth > 0) return renderedWidth;

        const configured = columnWidths.get(column.key) ?? column.width;
        const width = typeof configured === 'number' ? configured : defaultColumnWidth;
        return Math.min(
          column.maxWidth ?? DEFAULT_MAX_COLUMN_WIDTH,
          Math.max(column.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH, width),
        );
      };

      const next = new Map<string, DatagridPinnedColumnOffset>();
      let left =
        (rowDetail ? 40 : 0) +
        (hasLeadingRowActions ? Math.max(32, leadingRowActionsWidth) : 0) +
        (isRowReorder ? 32 : 0) +
        (showSelectionColumn ? 40 : 0) +
        (showRowNumbers ? DEFAULT_ROW_NUMBER_WIDTH : 0);

      for (const column of visibleColumns) {
        const pin = columnPinsProp?.[column.key] ?? column.pinned;
        if (pin === 'left') {
          next.set(column.key, { left });
          left += widthFor(column);
        }
      }

      const actionsHeader = grid.querySelector<HTMLElement>('.sp-datagrid__actions-header');
      let right = showRowEditActions
        ? actionsHeader?.getBoundingClientRect().width || DEFAULT_ROW_ACTIONS_WIDTH
        : 0;
      for (const column of [...visibleColumns].reverse()) {
        const pin = columnPinsProp?.[column.key] ?? column.pinned;
        if (pin === 'right') {
          next.set(column.key, { right });
          right += widthFor(column);
        }
      }

      setPinnedColumnOffsets((previous) => {
        const unchanged =
          previous.size === next.size &&
          [...next].every(([key, offset]) => {
            const current = previous.get(key);
            return current?.left === offset.left && current?.right === offset.right;
          });
        return unchanged ? previous : next;
      });
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    grid.querySelectorAll<HTMLElement>('.sp-datagrid__header-row [data-sp-datagrid-column]').forEach((cell) => {
      observer.observe(cell);
    });
    const actionsHeader = grid.querySelector<HTMLElement>('.sp-datagrid__actions-header');
    if (actionsHeader) observer.observe(actionsHeader);
    return () => observer.disconnect();
  }, [
    columnPinsProp,
    columnWidths,
    defaultColumnWidth,
    showSelectionColumn,
    hasLeadingRowActions,
    hasPinnedColumns,
    isRowReorder,
    leadingRowActionsWidth,
    rowDetail,
    showRowEditActions,
    showRowNumbers,
    visibleColumns,
  ]);

  const pinnedColumnStyle = (key: string, pin: DatagridColumnPin | undefined): CSSProperties | undefined => {
    const offset = pinnedColumnOffsets.get(key);
    if (pin === 'left' && offset?.left !== undefined) return { insetInlineStart: offset.left };
    if (pin === 'right' && offset?.right !== undefined) return { insetInlineEnd: offset.right };
    return undefined;
  };

  const ariaColumnOffset =
    (rowDetail ? 1 : 0) +
    (hasLeadingRowActions ? 1 : 0) +
    (isRowReorder ? 1 : 0) +
    (showSelectionColumn ? 1 : 0) +
    (showRowNumbers ? 1 : 0);
  const ariaColumnCount = ariaColumnOffset + visibleColumns.length + (showRowEditActions ? 1 : 0);

  const gridColumnFor = (column: DatagridColumn<T>): string => {
    if (columnVirtualization) {
      const renderedIndex = renderedColumns.indexOf(column);
      const beforeSpacerOffset = columnVirtualLayout.beforeWidth > 0 ? 1 : 0;
      return String(ariaColumnOffset + beforeSpacerOffset + renderedIndex + 1);
    }
    return String(visibleColumns.indexOf(column) + ariaColumnOffset + 1);
  };

  // Aggregates calculation for footer
  const footerAggregates = useMemo(() => {
    const map = new Map<string, { label: string; value: unknown; formatted: string }>();
    for (const col of visibleColumns) {
      if (col.aggregate) {
        const values = sortedRows.map((r) => getCellValue(r, col));
        map.set(col.key, computeAggregate(col.aggregate, values, sortedRows, col, 'footer'));
      }
    }
    return map;
  }, [visibleColumns, sortedRows]);

  const hasFooterAggregates = footer || footerAggregates.size > 0;
  const footerLabelColumnKey = visibleColumns.find((column) => !footerAggregates.has(column.key))?.key;

  // Selection handlers
  const handleToggleSelectAll = useCallback(() => {
    if (effectiveSelectionMode !== 'multiple') return;
    const allSelected = sortedRows.length > 0 && activeSelection.length === sortedRows.length;
    const nextSelection = allSelected ? [] : [...sortedRows];
    setInternalSelection(nextSelection);
    onSelectionChange?.({
      selectedRows: nextSelection,
      changedRow: null,
      selected: !allSelected,
    });
    onSelectedRowsChange?.(nextSelection);
  }, [effectiveSelectionMode, sortedRows, activeSelection, onSelectionChange, onSelectedRowsChange]);

  const handleToggleRowSelection = useCallback(
    (row: T) => {
      if (effectiveSelectionMode === 'single') {
        const isCurrent = activeSelection.length === 1 && activeSelection[0] === row;
        const next = isCurrent ? [] : [row];
        setInternalSelection(next);
        onSelectionChange?.({
          selectedRows: next,
          changedRow: row,
          selected: !isCurrent,
        });
        onSelectedRowsChange?.(next);
        if (dataContextAdapter) {
          dataContextAdapter.navigateTo(row);
        }
      } else if (effectiveSelectionMode === 'multiple') {
        const exists = activeSelection.includes(row);
        const next = exists ? activeSelection.filter((r) => r !== row) : [...activeSelection, row];
        setInternalSelection(next);
        onSelectionChange?.({
          selectedRows: next,
          changedRow: row,
          selected: !exists,
        });
        onSelectedRowsChange?.(next);
      }
    },
    [effectiveSelectionMode, activeSelection, onSelectionChange, onSelectedRowsChange, dataContextAdapter],
  );

  const handleRowSelection = useCallback((row: T, rowIndex: number, event: ReactMouseEvent<HTMLDivElement>) => {
    if (!rowSelection || effectiveSelectionMode === 'none') return;
    let next: readonly T[];
    if (effectiveSelectionMode === 'single') {
      next = [row];
    } else if (event.shiftKey && lastSelectedIndexRef.current !== null) {
      const start = Math.min(lastSelectedIndexRef.current, rowIndex);
      const end = Math.max(lastSelectedIndexRef.current, rowIndex);
      const range = sortedRows.slice(start, end + 1);
      next = appendSelection || event.ctrlKey || event.metaKey
        ? [...activeSelection, ...range.filter((candidate) => !activeSelection.includes(candidate))]
        : range;
    } else if (event.ctrlKey || event.metaKey) {
      next = activeSelection.includes(row)
        ? activeSelection.filter((candidate) => candidate !== row)
        : [...activeSelection, row];
    } else if (appendSelection) {
      next = activeSelection.includes(row) ? activeSelection : [...activeSelection, row];
    } else {
      next = [row];
    }
    lastSelectedIndexRef.current = rowIndex;
    setInternalSelection(next);
    onSelectionChange?.({ selectedRows: next, changedRow: row, selected: next.includes(row) });
    onSelectedRowsChange?.(next);
  }, [activeSelection, appendSelection, effectiveSelectionMode, onSelectedRowsChange, onSelectionChange, rowSelection, sortedRows]);

  const handleToggleGroupSelection = useCallback(
    (rows: readonly T[]) => {
      if (!groupSelection || effectiveSelectionMode !== 'multiple') return;
      const selectedCount = rows.filter((row) => activeSelection.includes(row)).length;
      const selecting = selectedCount !== rows.length;
      const next = selecting
        ? [...activeSelection, ...rows.filter((row) => !activeSelection.includes(row))]
        : activeSelection.filter((row) => !rows.includes(row));
      setInternalSelection(next);
      onSelectionChange?.({
        selectedRows: next,
        changedRow: null,
        selected: selecting,
      });
      onSelectedRowsChange?.(next);
    },
    [activeSelection, effectiveSelectionMode, groupSelection, onSelectedRowsChange, onSelectionChange],
  );

  // Sorting handlers
  const handleSortColumn = useCallback(
    (key: string) => {
      const col = visibleColumns.find((c) => c.key === key);
      if (!col || col.sortable === false) return;

      let nextSorts: DatagridSort[] = [];
      const existing = activeSorts.find((s) => s.key === key);

      let nextDir: DatagridSortDirection = 'asc';
      if (existing) {
        if (existing.direction === 'asc') nextDir = 'desc';
        else if (existing.direction === 'desc') nextDir = null;
      }

      if (multiSort) {
        if (nextDir === null) {
          nextSorts = activeSorts.filter((s) => s.key !== key);
        } else if (existing) {
          nextSorts = activeSorts.map((s) => (s.key === key ? { key, direction: nextDir as 'asc' | 'desc' } : s));
        } else {
          nextSorts = [...activeSorts, { key, direction: nextDir }];
        }
      } else {
        if (nextDir !== null) {
          nextSorts = [{ key, direction: nextDir }];
        }
      }

      setInternalSorts(nextSorts);
      onSortChange?.({ key, direction: nextDir });
      onSortsChange?.(nextSorts);
    },
    [visibleColumns, activeSorts, multiSort, onSortChange, onSortsChange],
  );

  const startCellEdit = useCallback(
    (rowIndex: number, key: string, initialValue?: unknown, targetRow?: T) => {
      const row = targetRow ?? sortedRows[rowIndex];
      const column = visibleColumns.find((candidate) => candidate.key === key);
      if (!row || !column || editMode !== 'cell') return;
      const editable = isRowEditable ? isRowEditable(row) : true;
      const cellEditable =
        editable &&
        (typeof column.editable === 'function' ? column.editable(row) : column.editable === true) &&
        (!isCellEditable || isCellEditable(row, column)) &&
        !(column.readonly === true || (typeof column.readonly === 'function' && column.readonly(row))) &&
        !(isCellReadonly?.(row, column));
      if (!cellEditable) return;
      setEditingCell({ rowIndex, key });
      setCellDraftValue(editorValueFor(initialValue ?? getCellValue(row, column), row, column));
      setCellValidationErrors([]);
    },
    [sortedRows, visibleColumns, editMode, isRowEditable, isCellEditable, isCellReadonly],
  );

  const commitCellDraft = useCallback(
    (row: T, rowIndex: number, column: DatagridColumn<T>, draft: unknown): boolean => {
      const value = parsedEditorValue(draft, row, column);
      const errors = validateValue(value, row, column);
      if (errors.length > 0) {
        setCellValidationErrors(errors);
        const event = { row, rowIndex, column, key: column.key, value, errors };
        onValidationError?.(event);
        onCellValidationFailed?.(event);
        if (preventInvalidCommit) return false;
      }

      const commitEvent: DatagridCellEditCommit<T> = {
        row,
        rowIndex,
        column,
        key: column.key,
        previousValue: getCellValue(row, column),
        value,
      };
      const applyCommit = () => {
        dataContextAdapter?.patch(row, { [column.key]: value });
        lastEditedCellRef.current = { row, rowIndex, column };
        setDirtyCells((current) => new Set(current).add(`${String(resolveTrackBy(trackBy, row, rowIndex))}:${column.key}`));
        if (undoStackSize > 0) {
          setEditHistory((current) => {
            const next = [...current.slice(0, editHistoryIndex), commitEvent].slice(-undoStackSize);
            setEditHistoryIndex(next.length);
            return next;
          });
        }
        setEditingCell(null);
        setCellDraftValue(undefined);
        setCellValidationErrors([]);
      };
      const decision = onCellEditCommit?.(commitEvent);
      if (manualCommit && decision instanceof Promise) {
        void decision.then((accepted) => { if (accepted === true) applyCommit(); });
        return true;
      }
      if (manualCommit && decision !== true) return false;
      applyCommit();
      return true;
    },
    [dataContextAdapter, editHistoryIndex, manualCommit, onCellEditCommit, onCellValidationFailed, onValidationError, preventInvalidCommit, trackBy, undoStackSize],
  );

  const startRowEdit = useCallback(
    (rowIndex: number, targetRow?: T) => {
      const row = targetRow ?? sortedRows[rowIndex];
      if (!row || editMode !== 'row' || (isRowEditable && !isRowEditable(row))) return;
      const drafts = new Map<string, unknown>();
      for (const column of visibleColumns) {
        drafts.set(column.key, editorValueFor(getCellValue(row, column), row, column));
      }
      setEditingRowIndex(rowIndex);
      setRowDrafts(drafts);
    },
    [sortedRows, editMode, isRowEditable, visibleColumns],
  );

  const commitRowDraft = useCallback(
    (row: T, rowIndex: number, drafts: ReadonlyMap<string, unknown>): boolean => {
      const changes: Record<string, unknown> = {};
      const validationEvents: DatagridValidationEvent<T>[] = [];
      for (const column of visibleColumns) {
        const editable =
          (typeof column.editable === 'function' ? column.editable(row) : column.editable === true) &&
          !(column.readonly === true || (typeof column.readonly === 'function' && column.readonly(row))) &&
          !(isCellReadonly?.(row, column));
        if (!editable || !drafts.has(column.key)) continue;
        const value = parsedEditorValue(drafts.get(column.key), row, column);
        const errors = validateValue(value, row, column);
        if (errors.length > 0) {
          const event = { row, rowIndex, column, key: column.key, value, errors };
          validationEvents.push(event);
          onValidationError?.(event);
        }
        changes[column.key] = value;
      }
      if (validationEvents.length > 0) {
        onRowValidationFailed?.(validationEvents);
        if (preventInvalidCommit) return false;
      }
      onRowEditCommit?.({ row, rowIndex, changes });
      dataContextAdapter?.patch(row, changes);
      setEditingRowIndex(null);
      setRowDrafts(new Map());
      return true;
    },
    [dataContextAdapter, isCellReadonly, onRowEditCommit, onRowValidationFailed, onValidationError, preventInvalidCommit, visibleColumns],
  );

  const saveDataContextChanges = useCallback(() => {
    if (!dataContextAdapter) return;
    void dataContextAdapter.context.save().then(
      () => onDataContextSaveComplete?.(),
      (error: unknown) => onDataContextSaveError?.(error),
    );
  }, [dataContextAdapter, onDataContextSaveComplete, onDataContextSaveError]);

  const createNewRowDraft = useCallback((): T => ({
    ...((newRowFactory?.() ?? {}) as T),
    ...(dataContextAdapter?.newRowDefaults ?? {}),
  }), [dataContextAdapter, newRowFactory]);

  const beginNewRowEdit = useCallback(() => {
    setNewRowDraft((current) => current ?? createNewRowDraft());
    setNewRowEditing(true);
  }, [createNewRowDraft]);

  const commitNewRowCell = useCallback(
    (column: DatagridColumn<T>, value: unknown) => {
      const draft = newRowDraft ?? createNewRowDraft();
      const parsed = parsedEditorValue(value, draft, column);
      const rowIndex = sortedRows.length;
      const errors = validateValue(parsed, draft, column);
      if (errors.length > 0) {
        setCellValidationErrors(errors);
        const event = { row: draft, rowIndex, column, key: column.key, value: parsed, errors };
        onValidationError?.(event);
        onCellValidationFailed?.(event);
        if (preventInvalidCommit) return;
      }
      const nextRow = { ...draft, [column.key]: parsed } as T;
      if (dataContextAdapter) {
        dataContextAdapter.add(nextRow);
      } else {
        onNewRowCommit?.({
          row: nextRow,
          rowIndex,
          column,
          key: column.key,
          value: parsed,
        });
      }
      setNewRowDraft(createNewRowDraft());
      setCellValidationErrors([]);
      setNewRowEditing(false);
    },
    [createNewRowDraft, dataContextAdapter, newRowDraft, onCellValidationFailed, onNewRowCommit, onValidationError, preventInvalidCommit, sortedRows.length],
  );

  // Imperative handle
  useImperativeHandle(
    ref,
    () => ({
      sortBy(key: string, direction: DatagridSortDirection) {
        const next = direction ? [{ key, direction }] : [];
        setInternalSorts(next);
        onSortChange?.({ key, direction });
        onSortsChange?.(next);
      },
      filterBy(key: string, values: readonly unknown[]) {
        const col = visibleColumns.find((c) => c.key === key);
        if (!col) return;
        const next = activeColumnFilters.filter((f) => f.key !== key);
        if (values.length > 0) {
          next.push({ key, column: col, values });
        }
        setInternalColumnFilters(next);
        onFilterChange?.(next);
      },
      filterByCondition(key: string, condition: DatagridDynamicFilterCondition | null) {
        const col = visibleColumns.find((c) => c.key === key);
        if (!col) return;
        const next = activeColumnFilters.filter((f) => f.key !== key);
        if (condition) {
          next.push({ key, column: col, values: [], condition });
        }
        setInternalColumnFilters(next);
        onFilterChange?.(next);
      },
      setRowDetailExpanded(row: T, expanded: boolean) {
        const id = resolveTrackBy(trackBy, row, 0);
        {
          const next = new Set(expandedRowDetails);
          if (expanded) next.add(id);
          else next.delete(id);
          updateExpandedRowDetails(next);
        }
      },
      toggleRowDetails(row: T) {
        const id = resolveTrackBy(trackBy, row, 0);
        {
          const next = new Set(expandedRowDetails);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          updateExpandedRowDetails(next);
        }
      },
      clearFilters() {
        setInternalColumnFilters([]);
        setInternalSearchQuery('');
        onFilterChange?.([]);
        onSearchQueryChange?.('');
      },
      goToPage(page: number) {
        const bounded = Math.max(1, Math.min(page, totalPages));
        if (virtualPaging) {
          const direction: 'previous' | 'next' = bounded < activePage ? 'previous' : 'next';
          const request = { page: bounded, pageSize: activePageSize, direction, trigger: 'api' as const };
          (onVirtualPageRequest ?? virtualPageRequest)?.(request);
          return;
        }
        setInternalPage(bounded);
        onPageChange?.({
          page: bounded,
          pageSize: activePageSize,
          totalRows: totalRowsCount,
          totalPages,
        });
      },
      previousPage() {
        if (activePage > 1 && (!virtualPaging || virtualHasPreviousPage !== false)) {
          const bounded = activePage - 1;
          if (virtualPaging) {
            const request = { page: bounded, pageSize: activePageSize, direction: 'previous' as const, trigger: 'api' as const };
            (onVirtualPageRequest ?? virtualPageRequest)?.(request);
            return;
          }
          setInternalPage(bounded);
          onPageChange?.({
            page: bounded,
            pageSize: activePageSize,
            totalRows: totalRowsCount,
            totalPages,
          });
        }
      },
      nextPage() {
        if (activePage < totalPages || (virtualPaging && virtualHasNextPage !== false)) {
          const bounded = activePage + 1;
          if (virtualPaging) {
            const request = { page: bounded, pageSize: activePageSize, direction: 'next' as const, trigger: 'api' as const };
            (onVirtualPageRequest ?? virtualPageRequest)?.(request);
            return;
          }
          setInternalPage(bounded);
          onPageChange?.({
            page: bounded,
            pageSize: activePageSize,
            totalRows: totalRowsCount,
            totalPages,
          });
        }
      },
      clearSelection() {
        setInternalSelection([]);
        onSelectionChange?.({
          selectedRows: [],
          changedRow: null,
          selected: false,
        });
        onSelectedRowsChange?.([]);
      },
      addDataContextRow() {
        if (dataContextAdapter) {
          const added = dataContextAdapter.add({});
          if (added) {
            setInternalSelection([added]);
          }
        }
      },
      deleteDataContextSelection() {
        if (dataContextAdapter && activeSelection.length > 0) {
          dataContextAdapter.delete(activeSelection);
          setInternalSelection([]);
        }
      },
      saveDataContextChanges() {
        saveDataContextChanges();
      },
      discardDataContextChanges() {
        if (dataContextAdapter) {
          dataContextAdapter.discardChanges();
        }
      },
      autoSizeColumn(key: string) {
        setColumnWidths((prev) => {
          const next = new Map(prev);
          next.set(key, 'auto');
          return next;
        });
      },
      autoSizeColumns() {
        setColumnWidths(new Map(visibleColumns.map((c) => [c.key, 'auto'])));
      },
      resetColumnOrder() {
        const order = columnsProp.map((c) => c.key);
        setInternalColumnOrder(order);
        onColumnOrderChange?.(order);
      },
      setColumnVisible(key: string, visible: boolean) {
        setInternalHiddenColumns((prev) => {
          const next = new Set(prev);
          if (visible) next.delete(key);
          else next.add(key);
          const visibleKeys = columnsProp.filter((c) => !next.has(c.key)).map((c) => c.key);
          const hiddenKeys = [...next];
          onColumnVisibilityChange?.({ visibleKeys, hiddenKeys });
          return next;
        });
      },
      setGrouping(keys: readonly string[]) {
        setInternalGroupBy(keys);
        onGroupByChange?.(keys);
      },
      clearGrouping() {
        setInternalGroupBy([]);
        onGroupByChange?.([]);
      },
      startCellEdit(rowIndex: number, key: string) {
        startCellEdit(rowIndex, key);
      },
      startRowEdit(rowIndex: number) {
        startRowEdit(rowIndex);
      },
      commitCellEdit() {
        if (!editingCell) return;
        const { rowIndex, key } = editingCell;
        const targetRow = sortedRows[rowIndex];
        const col = visibleColumns.find((c) => c.key === key);
        if (!targetRow || !col) return;

        commitCellDraft(targetRow, rowIndex, col, cellDraftValue);
      },
      commitRowEdit() {
        if (editingRowIndex === null) return;
        const targetRow = sortedRows[editingRowIndex];
        if (!targetRow) return;

        commitRowDraft(targetRow, editingRowIndex, rowDrafts);
      },
      cancelEditing() {
        if (editingCell) {
          const targetRow = sortedRows[editingCell.rowIndex];
          if (targetRow) {
            onEditCancel?.({
              mode: 'cell',
              row: targetRow,
              rowIndex: editingCell.rowIndex,
              key: editingCell.key,
            });
          }
          setEditingCell(null);
          setCellDraftValue(undefined);
          setCellValidationErrors([]);
        }
        if (editingRowIndex !== null) {
          const targetRow = sortedRows[editingRowIndex];
          if (targetRow) {
            onEditCancel?.({
              mode: 'row',
              row: targetRow,
              rowIndex: editingRowIndex,
            });
          }
          setEditingRowIndex(null);
          setRowDrafts(new Map());
        }
      },
      undo() {
        const event = editHistory[editHistoryIndex - 1];
        if (!event) return;
        dataContextAdapter?.patch(event.row, { [event.key]: event.previousValue });
        setEditHistoryIndex((index) => Math.max(0, index - 1));
      },
      redo() {
        const event = editHistory[editHistoryIndex];
        if (!event) return;
        dataContextAdapter?.patch(event.row, { [event.key]: event.value });
        setEditHistoryIndex((index) => Math.min(editHistory.length, index + 1));
      },
      fillDown() {
        const source = lastEditedCellRef.current;
        if (!source) return;
        const value = getCellValue(source.row, source.column);
        activeSelection.forEach((row) => {
          if (row !== source.row) dataContextAdapter?.patch(row, { [source.column.key]: value });
        });
      },
    }),
    [
      visibleColumns,
      activeColumnFilters,
      trackBy,
      totalPages,
      activePage,
      activePageSize,
      totalRowsCount,
      sortedRows,
      dataContextAdapter,
      columnsProp,
      editingCell,
      cellDraftValue,
      editingRowIndex,
      rowDrafts,
      onSortChange,
      onSortsChange,
      onFilterChange,
      onSearchQueryChange,
      onPageChange,
      onSelectionChange,
      onColumnOrderChange,
      onColumnVisibilityChange,
      onGroupByChange,
      onEditCancel,
      onSelectedRowsChange,
      onVirtualPageRequest,
      virtualPageRequest,
      virtualPaging,
      virtualHasPreviousPage,
      virtualHasNextPage,
      startCellEdit,
      startRowEdit,
      commitCellDraft,
      commitRowDraft,
      saveDataContextChanges,
      editHistory,
      editHistoryIndex,
      activeSelection,
      expandedRowDetails,
      updateExpandedRowDetails,
    ],
  );

  // Auto-close popovers on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        !target.closest('.sp-datagrid__filter-panel') &&
        !target.closest('.sp-datagrid__filter-trigger') &&
        !target.closest('.sp-select__dropdown')
      ) {
        setActiveFilterPopover(null);
      }
    }
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  const undoEdit = useCallback(() => {
    if (editHistoryIndex <= 0) return;
    const event = editHistory[editHistoryIndex - 1];
    if (!event) return;
    dataContextAdapter?.patch(event.row, { [event.key]: event.previousValue });
    setEditHistoryIndex((index) => Math.max(0, index - 1));
  }, [dataContextAdapter, editHistory, editHistoryIndex]);

  const redoEdit = useCallback(() => {
    const event = editHistory[editHistoryIndex];
    if (!event) return;
    dataContextAdapter?.patch(event.row, { [event.key]: event.value });
    setEditHistoryIndex((index) => Math.min(editHistory.length, index + 1));
  }, [dataContextAdapter, editHistory, editHistoryIndex]);

  const fillDown = useCallback(() => {
    const source = lastEditedCellRef.current;
    if (!source || activeSelection.length < 2) return;
    const value = getCellValue(source.row, source.column);
    for (const row of activeSelection) {
      if (row === source.row) continue;
      dataContextAdapter?.patch(row, { [source.column.key]: value });
      onCellEditCommit?.({ row, rowIndex: sortedRows.indexOf(row), column: source.column, key: source.column.key, previousValue: getCellValue(row, source.column), value });
    }
  }, [activeSelection, dataContextAdapter, onCellEditCommit, sortedRows]);

  // Keyboard navigation on grid
  const handleGridKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.ctrlKey || e.metaKey) && !editingCell && editingRowIndex === null) {
      if (enableUndoShortcuts && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redoEdit(); else undoEdit();
        return;
      }
      if (enableUndoShortcuts && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redoEdit();
        return;
      }
      if (enableFillDown && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        fillDown();
        return;
      }
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const focusedCell = document.activeElement?.closest('[role="gridcell"], [role="columnheader"]');
      if (!focusedCell) return;

      const cells = Array.from(
        gridContainerRef.current?.querySelectorAll<HTMLElement>(
          '[role="gridcell"], [role="columnheader"]',
        ) ?? [],
      ).filter((c) => {
        if (c.hidden || c.closest('[aria-hidden="true"]')) return false;
        const computedStyle = window.getComputedStyle(c);
        return computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';
      });

      const currIdx = cells.indexOf(focusedCell as HTMLElement);
      if (currIdx === -1) return;

      let nextIdx = currIdx;
      const focusTarget = (target: HTMLElement) => {
        target.focus();
        const rowElement = target.closest<HTMLElement>('[data-row-index]');
        const rowIndex = Number(rowElement?.dataset.rowIndex);
        const row = Number.isInteger(rowIndex) ? sortedRows[rowIndex] : undefined;
        if (row && selectOnNavigate && effectiveSelectionMode === 'single') {
          setInternalSelection([row]);
          onSelectionChange?.({ selectedRows: [row], changedRow: row, selected: true });
          onSelectedRowsChange?.([row]);
        }
        const key = target.dataset.spDatagridCell;
        if (row && key && autoEditOnNavigate && editMode === 'cell') startCellEdit(rowIndex, key, undefined, row);
      };
      if (e.key === 'ArrowRight') nextIdx = currIdx + 1;
      if (e.key === 'ArrowLeft') nextIdx = currIdx - 1;
      if (e.key === 'ArrowDown') {
        const nextRow = (focusedCell.closest('[role="row"]')?.nextElementSibling) as HTMLElement | null;
        if (nextRow) {
          const rowCells = Array.from(nextRow.querySelectorAll<HTMLElement>('[role="gridcell"]'));
          const colIdx = Array.from(focusedCell.parentElement?.children ?? []).indexOf(focusedCell);
          if (rowCells[colIdx]) {
            focusTarget(rowCells[colIdx]);
            e.preventDefault();
            return;
          }
        }
      }
      if (e.key === 'ArrowUp') {
        const prevRow = (focusedCell.closest('[role="row"]')?.previousElementSibling) as HTMLElement | null;
        if (prevRow) {
          const rowCells = Array.from(
            prevRow.querySelectorAll<HTMLElement>('[role="gridcell"], [role="columnheader"]'),
          );
          const colIdx = Array.from(focusedCell.parentElement?.children ?? []).indexOf(focusedCell);
          if (rowCells[colIdx]) {
            focusTarget(rowCells[colIdx]);
            e.preventDefault();
            return;
          }
        }
      }

      if (nextIdx >= 0 && nextIdx < cells.length) {
        focusTarget(cells[nextIdx]);
        e.preventDefault();
      }
    }
  };

  // Host CSS classes
  const hostClasses = [
    'sp-datagrid',
    ...surfaceChromeClasses({ chrome, radius, border }),
    `sp-datagrid--density-${density}`,
    `sp-datagrid--header-${headerTextCase}`,
    autoRowHeight ? 'sp-datagrid--auto-row-height' : '',
    borderless ? 'sp-datagrid--borderless' : '',
    rowHover ? '' : 'sp-datagrid--no-row-hover',
    hideFocusRing ? 'sp-datagrid--hide-focus-ring' : '',
    pinControlColumns ? 'sp-datagrid--pin-control-columns' : '',
    pinSelectionColumns ? 'sp-datagrid--pin-selection-columns' : '',
    effectiveResizeMode === 'deferred' ? 'sp-datagrid--resize-deferred' : '',
    effectiveReorderMode === 'live' ? 'sp-datagrid--reorder-live' : '',
    allowNewRow && newRowPosition === 'top' ? 'sp-datagrid--new-row-top' : '',
    autoHeight
      ? 'sp-datagrid-host--auto-height sp-datagrid--auto-height'
      : 'sp-datagrid-host--fixed-height sp-datagrid--fixed-height',
    effectiveLoading ? 'sp-datagrid-host--loading' : '',
    effectiveFitColumnsToWidth ? 'sp-datagrid--fit-columns-to-width' : '',
    !effectiveShowColumnLines ? 'sp-datagrid--without-vertical-lines' : '',
    hasPinnedColumns ? 'sp-datagrid--has-pinned-columns' : '',
    sortIndicatorVisibility === 'always' ? 'sp-datagrid--sort-indicators-always' : '',
    filterIndicatorVisibility === 'always' ? 'sp-datagrid--filter-indicators-always' : '',
    virtualizationEnabled ? 'sp-datagrid--virtual' : '',
    hasActiveRowSpans ? 'sp-datagrid--row-spanning' : '',
    columnVirtualization ? 'sp-datagrid--column-virtualization' : '',
    autoColumnWidth ? 'sp-datagrid--auto-column-width' : 'sp-datagrid--fixed-columns',
    reorderable ? '' : 'sp-datagrid--columns-not-reorderable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hostStyle: CSSProperties = {
    ...(fixedHeight ? { height: fixedHeight } : {}),
    ...({
      '--sp-datagrid-row-height': `${effectiveVirtualRowHeight}px`,
      '--sp-datagrid-virtual-scroll-height': `${Math.max(effectiveVirtualRowHeight * 2, virtualScrollHeight)}px`,
      '--sp-datagrid-detail-pane-width': `${Math.max(240, detailPaneWidth)}px`,
      '--sp-datagrid-row-detail-height': `${Math.max(rowDetailHeight, effectiveVirtualRowHeight)}px`,
      '--sp-datagrid-column-virtualization-overscan': `${Math.max(0, columnVirtualizationOverscan)}px`,
      '--sp-datagrid-detail-control-width': rowDetail ? '40px' : '0px',
      '--sp-datagrid-leading-control-width': hasLeadingRowActions ? `${leadingRowActionsWidth}px` : '0px',
      '--sp-datagrid-drag-control-width': isRowReorder ? '36px' : '0px',
      '--sp-datagrid-selection-control-width': showSelectionColumn ? '40px' : '0px',
    } as CSSProperties),
    ...(headerHeight ? ({ '--sp-datagrid-header-height': `${headerHeight}px` } as CSSProperties) : {}),
    ...style,
  };

  const columnMenuItemsFor = (column: DatagridColumn<T>): DropdownItem[] => {
    const items: DropdownItem[] = [];
    if (column.sortable !== false) {
      items.push(
        {
          label: 'Sort Ascending',
          icon: 'arrow-up',
          command: () => handleSortColumn(column.key),
        },
        {
          label: 'Sort Descending',
          icon: 'arrow-down',
          command: () => {
            const next = [{ key: column.key, direction: 'desc' as const }];
            setInternalSorts(next);
            onSortChange?.({ key: column.key, direction: 'desc' });
          },
        },
        { separator: true },
      );
    }
    items.push(
      {
        label: 'Auto-size Column',
        command: () => setColumnWidths((prev) => new Map(prev).set(column.key, 'auto')),
      },
      {
        label: `Group by ${column.header}`,
        command: () => {
          if (!activeGroupBy.includes(column.key)) {
            const next = [...activeGroupBy, column.key];
            setInternalGroupBy(next);
            onGroupByChange?.(next);
          }
        },
      },
      {
        label: 'Hide Column',
        command: () => {
          setInternalHiddenColumns((prev) => {
            const next = new Set(prev);
            next.add(column.key);
            return next;
          });
        },
      },
      ...toDropdownItems(column.menuItems ?? []),
    );
    return items;
  };

  const renderColumnSelectorContent = () => (
    <>
      <div className="sp-datagrid__column-selector-header">
        <h3>{columnSelectorLabel ?? t('columns')}</h3>
        <p>Show, hide, and reorder columns</p>
      </div>
      <div className="sp-datagrid__column-selector-list">
        {selectorColumns.map((column) => {
          const isVis = !internalHiddenColumns.has(column.key);
          return (
            <div
              key={column.key}
              className={[
                'sp-datagrid__column-selector-item',
                draggedSelectorColumnKey === column.key ? 'sp-datagrid__column-selector-item--dragging' : '',
                selectorDropTarget?.key === column.key && selectorDropTarget.position === 'before' ? 'sp-datagrid__column-selector-item--drop-before' : '',
                selectorDropTarget?.key === column.key && selectorDropTarget.position === 'after' ? 'sp-datagrid__column-selector-item--drop-after' : '',
              ].filter(Boolean).join(' ')}
              draggable={reorderable && column.reorderable !== false}
              onDragStart={() => setDraggedSelectorColumnKey(column.key)}
              onDragEnd={() => {
                setDraggedSelectorColumnKey(null);
                setSelectorDropTarget(null);
              }}
              onDragOver={(event) => {
                if (!draggedSelectorColumnKey || draggedSelectorColumnKey === column.key) return;
                event.preventDefault();
                const rect = event.currentTarget.getBoundingClientRect();
                setSelectorDropTarget({ key: column.key, position: event.clientY < rect.top + rect.height / 2 ? 'before' : 'after' });
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (draggedSelectorColumnKey && selectorDropTarget) {
                  const next = activeColumnOrder.filter((key) => key !== draggedSelectorColumnKey);
                  const target = next.indexOf(selectorDropTarget.key);
                  next.splice(selectorDropTarget.position === 'after' ? target + 1 : target, 0, draggedSelectorColumnKey);
                  setInternalColumnOrder(next);
                  onColumnOrderChange?.(next);
                }
                setDraggedSelectorColumnKey(null);
                setSelectorDropTarget(null);
              }}
            >
              <span className="sp-datagrid__column-selector-handle">
                <Icon name="grip-vertical" size={14} />
              </span>
              <Checkbox
                checked={isVis}
                onChange={(checked) => {
                  setInternalHiddenColumns((prev) => {
                    const next = new Set(prev);
                    if (checked) next.delete(column.key);
                    else next.add(column.key);
                    onColumnVisibilityChange?.({
                      visibleKeys: columnsProp.filter((item) => !next.has(item.key)).map((item) => item.key),
                      hiddenKeys: [...next],
                    });
                    return next;
                  });
                }}
              >
                {column.header}
              </Checkbox>
            </div>
          );
        })}
      </div>
      <div className="sp-datagrid__filter-actions">
        <Button
          size="sm"
          variant="primary"
          onClick={() => setShowColumnSelectorPopover(null)}
        >
          Done
        </Button>
      </div>
    </>
  );

  return (
    <div
      ref={gridContainerRef}
      className={hostClasses}
      style={hostStyle}
      data-testid="datagrid-host"
    >
      {/* Optional Top Toolbar */}
      {(toolbar || toolbarStart || toolbarEnd || searchable || dataContextAdapter?.toolbarActions || isShowColumnSelector) && (
        <div className="sp-datagrid__toolbar" role="toolbar" aria-label={toolbarAriaLabel ?? t('dataGridTools')}>
          <div className="sp-datagrid__toolbar-start">
            {toolbarStart}
            {searchable && (
              <Input
                className="sp-datagrid__search"
                type="search"
                size="sm"
                ariaLabel={t('search')}
                placeholder={t('search')}
                value={activeSearchQuery}
                onChange={(value) => {
                  setInternalSearchQuery(value);
                  onSearchQueryChange?.(value);
                }}
              />
            )}
            {dataContextAdapter?.toolbarActions && (
              <div className="sp-datagrid__toolbar-actions" style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  className="sp-btn sp-btn--sm sp-btn--secondary"
                  onClick={() => {
                    const added = dataContextAdapter.add({});
                    if (added) setInternalSelection([added]);
                  }}
                >
                  <Icon name="plus" size={14} /> {t('add')}
                </button>
                <button
                  type="button"
                  className="sp-btn sp-btn--sm sp-btn--secondary"
                  disabled={activeSelection.length === 0}
                  onClick={() => {
                    dataContextAdapter.delete(activeSelection);
                    setInternalSelection([]);
                  }}
                >
                  <Icon name="trash" size={14} /> {t('delete')}
                </button>
                <button
                  type="button"
                  className="sp-btn sp-btn--sm sp-btn--secondary"
                  disabled={!dataContextAdapter.dirty}
                  onClick={() => dataContextAdapter.discardChanges()}
                >
                  {t('discard')}
                </button>
                <button
                  type="button"
                  className="sp-btn sp-btn--sm sp-btn--primary"
                  disabled={!dataContextAdapter.dirty || (dataContextAdapter.blockInvalidSave && !dataContextAdapter.valid())}
                  onClick={saveDataContextChanges}
                >
                  <Icon name="check" size={14} /> {t('save')}
                </button>
              </div>
            )}
          </div>
          <div className="sp-datagrid__toolbar-end">
            {toolbarEnd}
            {showColumnSelectorInToolbar && (
              <Popover
                trigger={(
                  <Button
                    variant="secondary"
                    size="sm"
                    iconLeft="columns"
                    className="sp-datagrid__column-selector-trigger"
                  >
                    {columnSelectorLabel ?? t('columns')}
                  </Button>
                )}
                open={showColumnSelectorPopover?.source === 'toolbar'}
                onOpenChange={(open) => setShowColumnSelectorPopover(open ? { source: 'toolbar' } : null)}
                placement="bottom-end"
                panelClassName="sp-datagrid__column-selector-popover"
                panelAriaLabel={columnSelectorLabel ?? t('columns')}
                padding="0"
              >
                <div className="sp-datagrid__column-selector-panel">
                  {renderColumnSelectorContent()}
                </div>
              </Popover>
            )}
          </div>
        </div>
      )}

      {/* Grouping Toolbar */}
      {(isShowGroupToolbar || activeGroupBy.length > 0) && (
        <div
          className={`sp-datagrid__group-toolbar ${
            isGroupToolbarDragOver ? 'sp-datagrid__group-toolbar--drop-active' : ''
          }`}
          onDragOver={(e) => {
            if (draggedToolbarGroupKey) return;
            const columnKey = draggedColumnKey ?? e.dataTransfer.getData('text/plain');
            if (columnKey && columnsProp.some((column) => column.key === columnKey) && !activeGroupBy.includes(columnKey)) {
              e.preventDefault();
              setIsGroupToolbarDragOver(true);
            }
          }}
          onDragLeave={() => setIsGroupToolbarDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedToolbarGroupKey) return;
            setIsGroupToolbarDragOver(false);
            const columnKey = draggedColumnKey ?? e.dataTransfer.getData('text/plain');
            if (columnKey && columnsProp.some((column) => column.key === columnKey) && !activeGroupBy.includes(columnKey)) {
              const next = [...activeGroupBy, columnKey];
              setInternalGroupBy(next);
              onGroupByChange?.(next);
            }
            setDraggedColumnKey(null);
          }}
        >
          <div className="sp-datagrid__toolbar-group-list">
            {activeGroupBy.length === 0 ? (
              <span className="sp-datagrid__toolbar-group-empty">
                Drag column headers here to group
              </span>
            ) : (
              activeGroupBy.map((gKey) => {
                const col = columnsProp.find((c) => c.key === gKey);
                const sortDir = activeGroupSorts.find((gs) => gs.key === gKey)?.direction ?? 'asc';
                return (
                  <div
                    key={gKey}
                    className={[
                      'sp-datagrid__toolbar-group',
                      draggedToolbarGroupKey === gKey ? 'sp-datagrid__toolbar-group--dragging' : '',
                      toolbarGroupDropTarget?.key === gKey && toolbarGroupDropTarget.position === 'before'
                        ? 'sp-datagrid__toolbar-group--drop-before'
                        : '',
                      toolbarGroupDropTarget?.key === gKey && toolbarGroupDropTarget.position === 'after'
                        ? 'sp-datagrid__toolbar-group--drop-after'
                        : '',
                    ].filter(Boolean).join(' ')}
                    onDragOver={(event) => {
                      if (!draggedToolbarGroupKey || draggedToolbarGroupKey === gKey) {
                        setToolbarGroupDropTarget(null);
                        return;
                      }
                      event.preventDefault();
                      event.dataTransfer.dropEffect = 'move';
                      const rect = event.currentTarget.getBoundingClientRect();
                      setToolbarGroupDropTarget({
                        key: gKey,
                        position: event.clientX > rect.left + rect.width / 2 ? 'after' : 'before',
                      });
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      const sourceKey = draggedToolbarGroupKey;
                      const dropTarget = toolbarGroupDropTarget;
                      if (sourceKey && dropTarget?.key === gKey && sourceKey !== gKey) {
                        const next = activeGroupBy.filter((key) => key !== sourceKey);
                        const targetIndex = next.indexOf(gKey);
                        next.splice(targetIndex + (dropTarget.position === 'after' ? 1 : 0), 0, sourceKey);
                        setInternalGroupBy(next);
                        onGroupByChange?.(next);
                      }
                      setDraggedToolbarGroupKey(null);
                      setToolbarGroupDropTarget(null);
                    }}
                  >
                    <button
                      type="button"
                      className="sp-datagrid__toolbar-group-button"
                      draggable
                      aria-label={`${col?.header ?? gKey} grouping. Drag to reorder.`}
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = 'move';
                        event.dataTransfer.setData('text/plain', gKey);
                        setDraggedToolbarGroupKey(gKey);
                      }}
                      onDragEnd={() => {
                        setDraggedToolbarGroupKey(null);
                        setToolbarGroupDropTarget(null);
                      }}
                      onClick={() => {
                        const nextDir = sortDir === 'asc' ? 'desc' : 'asc';
                        const nextSorts = [
                          ...activeGroupSorts.filter((gs) => gs.key !== gKey),
                          { key: gKey, direction: nextDir as DatagridGroupSortDirection },
                        ];
                        setInternalGroupSorts(nextSorts);
                        onGroupSortsChange?.(nextSorts);
                      }}
                    >
                      {col?.header ?? gKey}
                      <Icon
                        name={sortDir === 'asc' ? 'arrow-up' : 'arrow-down'}
                        size={12}
                        className="sp-datagrid__toolbar-group-sort"
                      />
                    </button>
                    <div className="sp-datagrid__toolbar-group-remove">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        iconLeft="x"
                        aria-label={`Remove grouping by ${col?.header ?? gKey}`}
                        onClick={() => {
                          const next = activeGroupBy.filter((k) => k !== gKey);
                          setInternalGroupBy(next);
                          onGroupByChange?.(next);
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Grid Viewport */}
      <div className="sp-datagrid__body">
        {filterPanel?.position === 'left' && (
          <aside className={`sp-datagrid__filter-expression-panel${filterPanel.pinned === false ? ' sp-datagrid__filter-expression-panel--floating' : ''}`} style={{ width: filterPanel.width ?? 320, minWidth: filterPanel.minWidth ?? 240, maxWidth: filterPanel.maxWidth ?? 600 }} aria-label={t('filter')}>
            <FilterExpression fields={[...filterPanel.fields]} expression={filterPanel.expression} chrome="flush" border="none" onChange={onFilterExpressionChange ?? (() => undefined)} />
          </aside>
        )}
        <div ref={viewportRef} className="sp-datagrid__viewport">
          <div
            className="sp-datagrid__grid sp-datagrid-matrix"
            style={{ gridTemplateColumns }}
            role="grid"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-busy={effectiveLoading || virtualPagingLoading ? true : undefined}
            aria-rowcount={totalRowsCount}
            aria-colcount={ariaColumnCount}
            aria-multiselectable={effectiveSelectionMode === 'multiple' ? true : undefined}
            onKeyDown={handleGridKeyDown}
            tabIndex={0}
          >
            {/* Column Group Header Row */}
            {orderedColumnGroups.length > 0 && (
              <div className="sp-datagrid__row sp-datagrid__column-group-row" role="row" aria-rowindex={1}>
                {rowDetail && <div className="sp-datagrid__column-group-cell sp-datagrid__column-group-cell--empty" />}
                {hasLeadingRowActions && <div className="sp-datagrid__column-group-cell sp-datagrid__column-group-cell--empty" />}
                {isRowReorder && <div className="sp-datagrid__column-group-cell sp-datagrid__column-group-cell--empty" />}
                {showSelectionColumn && <div className="sp-datagrid__column-group-cell sp-datagrid__column-group-cell--empty" />}
                {showRowNumbers && <div className="sp-datagrid__column-group-cell sp-datagrid__column-group-cell--empty" />}

                {orderedColumnGroups.map((cg) => {
                  const span = cg.columnKeys.filter((k) => !internalHiddenColumns.has(k)).length;
                  if (span === 0) return null;
                  return (
                    <div
                      key={cg.key}
                      className={[
                        'sp-datagrid__column-group-cell',
                        reorderable && cg.reorderable !== false ? 'sp-datagrid__column-group-cell--reorderable' : '',
                        draggedColumnGroupKey === cg.key ? 'sp-datagrid__column-group-cell--dragging' : '',
                        columnGroupDropTarget?.key === cg.key && columnGroupDropTarget.position === 'before' ? 'sp-datagrid__column-group-cell--drop-before' : '',
                        columnGroupDropTarget?.key === cg.key && columnGroupDropTarget.position === 'after' ? 'sp-datagrid__column-group-cell--drop-after' : '',
                      ].filter(Boolean).join(' ')}
                      style={{ gridColumn: `span ${span}` }}
                      draggable={reorderable && cg.reorderable !== false}
                      onDragStart={() => setDraggedColumnGroupKey(cg.key)}
                      onDragEnd={() => {
                        setDraggedColumnGroupKey(null);
                        setColumnGroupDropTarget(null);
                      }}
                      onDragOver={(event) => {
                        if (!draggedColumnGroupKey || draggedColumnGroupKey === cg.key) return;
                        event.preventDefault();
                        const rect = event.currentTarget.getBoundingClientRect();
                        setColumnGroupDropTarget({
                          key: cg.key,
                          position: event.clientX < rect.left + rect.width / 2 ? 'before' : 'after',
                        });
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        if (draggedColumnGroupKey && columnGroupDropTarget) {
                          const next = activeColumnGroupOrder.filter((key) => key !== draggedColumnGroupKey);
                          const target = next.indexOf(columnGroupDropTarget.key);
                          next.splice(columnGroupDropTarget.position === 'after' ? target + 1 : target, 0, draggedColumnGroupKey);
                          setInternalColumnGroupOrder(next);
                          onColumnGroupOrderChange?.(next);
                        }
                        setDraggedColumnGroupKey(null);
                        setColumnGroupDropTarget(null);
                      }}
                    >
                      <span className="sp-datagrid__column-group-label">{cg.header}</span>
                      {cg.resizable !== false && (
                        <div
                          className="sp-datagrid__column-group-resize-handle"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            const startX = e.clientX;
                            const startWidth = e.currentTarget.parentElement?.getBoundingClientRect().width ?? 150;
                            const handleMouseMove = (moveEvent: MouseEvent) => {
                              const diff = moveEvent.clientX - startX;
                              const width = Math.max(50, startWidth + diff);
                              const firstColumn = cg.columnKeys[0];
                              if (firstColumn) {
                                setColumnWidths((previous) => new Map(previous).set(firstColumn, width));
                              }
                              onColumnGroupResize?.({
                                key: cg.key,
                                width,
                                columnKey: firstColumn ?? '',
                                columnWidth: width,
                              });
                            };
                            const handleMouseUp = () => {
                              window.removeEventListener('mousemove', handleMouseMove);
                              window.removeEventListener('mouseup', handleMouseUp);
                            };
                            window.addEventListener('mousemove', handleMouseMove);
                            window.addEventListener('mouseup', handleMouseUp);
                          }}
                        />
                      )}
                    </div>
                  );
                })}
                {showRowEditActions && <div className="sp-datagrid__column-group-cell sp-datagrid__column-group-cell--empty" />}
              </div>
            )}

            {/* Column Header Row */}
            <div
              className={`sp-datagrid__row sp-datagrid__header-row ${
                orderedColumnGroups.length > 0 ? 'sp-datagrid__header-row--with-column-groups' : ''
              }`}
              role="row"
              aria-rowindex={orderedColumnGroups.length > 0 ? 2 : 1}
            >
              {rowDetail && (
                <div className="sp-datagrid__header-cell sp-datagrid__row-detail-toggle-cell" role="columnheader">
                  <span className="sp-datagrid__visually-hidden">Row Details</span>
                </div>
              )}
              {hasLeadingRowActions && (
                <div className="sp-datagrid__header-cell sp-datagrid__leading-row-actions-cell" role="columnheader">
                  <span className="sp-datagrid__visually-hidden">Actions</span>
                </div>
              )}
              {isRowReorder && (
                <div className="sp-datagrid__header-cell sp-datagrid__row-drag-header" role="columnheader">
                  <span className="sp-datagrid__visually-hidden">Row Reorder</span>
                </div>
              )}
              {showSelectionColumn && (
                <div className="sp-datagrid__header-cell sp-datagrid__selection-cell" role="columnheader" aria-label={`${t('selectAllRowsOnPage')}`}>
                  {effectiveSelectionMode === 'multiple' && (
                    <Checkbox
                      ariaLabel={`${t('selectAllRowsOnPage')}`}
                      checked={sortedRows.length > 0 && activeSelection.length === sortedRows.length}
                      indeterminate={activeSelection.length > 0 && activeSelection.length < sortedRows.length}
                      onChange={handleToggleSelectAll}
                    />
                  )}
                </div>
              )}
              {showRowNumbers && (
                <div className="sp-datagrid__header-cell sp-datagrid__row-number-cell" role="columnheader">
                  #
                </div>
              )}

              {/* Column Headers */}
              {columnVirtualization && columnVirtualLayout.beforeWidth > 0 && (
                <div className="sp-datagrid__column-virtual-spacer" aria-hidden="true" />
              )}
              {renderedColumns.map((column, colIdx) => {
                const col = column;
                const sortItem = activeSorts.find((s) => s.key === col.key);
                const isSorted = !!sortItem;
                const sortPriority = multiSort && activeSorts.length > 1 ? activeSorts.findIndex((s) => s.key === col.key) + 1 : 0;
                const filterItem = activeColumnFilters.find((f) => f.key === col.key);
                const isFiltered = !!filterItem;
                const pin = columnPinsProp?.[col.key] ?? col.pinned;

                const headerCellClasses = [
                  'sp-datagrid__header-cell',
                  reorderable && col.reorderable !== false ? 'sp-datagrid__header-cell--reorderable' : '',
                  pin ? 'sp-datagrid__pinned-cell' : '',
                  pin === 'left' ? 'sp-datagrid__pinned-cell--left sp-datagrid__header-cell--pinned-left' : '',
                  pin === 'right' ? 'sp-datagrid__pinned-cell--right sp-datagrid__header-cell--pinned-right' : '',
                  colIdx === leftPinned.length - 1 ? 'sp-datagrid__pinned-cell--boundary' : '',
                  colIdx === renderedColumns.length - rightPinned.length ? 'sp-datagrid__pinned-cell--boundary' : '',
                  draggedColumnKey === col.key ? 'sp-datagrid__header-cell--dragging' : '',
                  columnDropTarget?.key === col.key && columnDropTarget.position === 'before' ? 'sp-datagrid__header-cell--drop-before' : '',
                  columnDropTarget?.key === col.key && columnDropTarget.position === 'after' ? 'sp-datagrid__header-cell--drop-after' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <div
                    key={col.key}
                    className={headerCellClasses}
                    role="columnheader"
                    data-sp-datagrid-column={col.key}
                    aria-colindex={visibleColumns.indexOf(col) + ariaColumnOffset + 1}
                    aria-sort={
                      sortItem?.direction === 'asc'
                        ? 'ascending'
                        : sortItem?.direction === 'desc'
                        ? 'descending'
                        : 'none'
                    }
                    draggable={reorderable && col.reorderable !== false}
                    style={pinnedColumnStyle(col.key, pin)}
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('text/plain', col.key);
                      setDraggedColumnKey(col.key);
                      setDragGhostPos({ x: e.clientX, y: e.clientY });
                    }}
                    onDrag={(e) => {
                      if (e.clientX !== 0 && e.clientY !== 0) {
                        setDragGhostPos({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    onDragEnd={() => {
                      setDraggedColumnKey(null);
                      setColumnDropTarget(null);
                      setDragGhostPos(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (draggedColumnKey && draggedColumnKey !== col.key) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const midX = rect.left + rect.width / 2;
                        setColumnDropTarget({
                          key: col.key,
                          position: e.clientX < midX ? 'before' : 'after',
                        });
                        if (effectiveReorderMode === 'live') {
                          const nextOrder = activeColumnOrder.filter((key) => key !== draggedColumnKey);
                          let targetIndex = nextOrder.indexOf(col.key);
                          if (e.clientX >= midX) targetIndex += 1;
                          nextOrder.splice(Math.max(0, targetIndex), 0, draggedColumnKey);
                          setInternalColumnOrder(nextOrder);
                          onColumnOrderChange?.(nextOrder);
                        }
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedColumnKey && columnDropTarget) {
                        const nextOrder = [...activeColumnOrder];
                        const fromIdx = nextOrder.indexOf(draggedColumnKey);
                        if (fromIdx !== -1) {
                          nextOrder.splice(fromIdx, 1);
                          let toIdx = nextOrder.indexOf(columnDropTarget.key);
                          if (columnDropTarget.position === 'after') toIdx += 1;
                          nextOrder.splice(toIdx, 0, draggedColumnKey);
                          setInternalColumnOrder(nextOrder);
                          onColumnOrderChange?.(nextOrder);
                        }
                      }
                      setDraggedColumnKey(null);
                      setColumnDropTarget(null);
                    }}
                    tabIndex={0}
                  >
                    {/* Sort Button */}
                    <button
                      type="button"
                      className="sp-datagrid__sort-button"
                      aria-label={`${t('sortAscending')} ${column.header}`}
                      onClick={() => handleSortColumn(col.key)}
                      disabled={col.sortable === false}
                    >
                      <span className="sp-datagrid__header-label">{col.header}</span>
                      {col.sortable !== false && (
                        <span
                          className={`sp-datagrid__sort-indicator ${
                            isSorted ? 'sp-datagrid__sort-indicator--active' : ''
                          }`}
                        >
                          <Icon
                            name={
                              sortItem?.direction === 'desc'
                                ? 'arrow-down'
                                : sortItem?.direction === 'asc'
                                ? 'arrow-up'
                                : 'arrow-down-up'
                            }
                            size={12}
                          />
                        </span>
                      )}
                      {sortPriority > 0 && (
                        <span className="sp-datagrid__sort-priority">{sortPriority}</span>
                      )}
                    </button>

                    {/* Filter Trigger */}
                    {col.filterable === true && (
                      <button
                        type="button"
                        className={`sp-datagrid__filter-trigger ${
                          isFiltered ? 'sp-datagrid__filter-trigger--active' : ''
                        }`}
                        aria-label={`${t('filter')} ${column.header}`}
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setActiveFilterPopover({ key: col.key, triggerRect: rect });
                        }}
                      >
                        <Icon name="filter" size={12} />
                      </button>
                    )}

                    {/* Column Menu */}
                    {(effectiveColumnMenu || col.menuItems) && (
                      <div className="sp-datagrid__column-menu">
                        <Dropdown
                          trigger={(
                            <Button
                              variant="ghost"
                              size="sm"
                              iconOnly
                              iconLeft="more-vertical"
                              className="sp-datagrid__column-menu-trigger"
                              aria-label={`Column menu for ${col.header}`}
                            />
                          )}
                          items={columnMenuItemsFor(col)}
                          placement="bottom-end"
                          minWidth={220}
                          open={activeColumnMenu?.key === col.key}
                          onOpenChange={(open) => setActiveColumnMenu(open ? { key: col.key } : null)}
                        />
                      </div>
                    )}

                    {/* Column Resize Handle */}
                    {col.resizable !== false && (
                      <div
                        className="sp-datagrid__resize-handle"
                        tabIndex={0}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          const startX = e.clientX;
                          const initialWidth =
                            typeof columnWidths.get(col.key) === 'number'
                              ? (columnWidths.get(col.key) as number)
                              : e.currentTarget.parentElement?.getBoundingClientRect().width ?? 120;
                          let deferredWidth = initialWidth;

                          const handleMouseMove = (moveEvent: MouseEvent) => {
                            const diff = moveEvent.clientX - startX;
                            const newW = Math.min(
                              col.maxWidth ?? Number.POSITIVE_INFINITY,
                              Math.max(col.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH, initialWidth + diff),
                            );
                            deferredWidth = newW;
                            if (effectiveResizeMode === 'live') {
                              setColumnWidths((prev) => new Map(prev).set(col.key, newW));
                              onColumnResize?.({ key: col.key, width: newW });
                            }
                          };

                          const handleMouseUp = () => {
                            if (effectiveResizeMode === 'deferred') {
                              setColumnWidths((prev) => new Map(prev).set(col.key, deferredWidth));
                              onColumnResize?.({ key: col.key, width: deferredWidth });
                            }
                            window.removeEventListener('mousemove', handleMouseMove);
                            window.removeEventListener('mouseup', handleMouseUp);
                          };

                          window.addEventListener('mousemove', handleMouseMove);
                          window.addEventListener('mouseup', handleMouseUp);
                        }}
                        onDoubleClick={() => {
                          setColumnWidths((prev) => new Map(prev).set(col.key, 'auto'));
                          onColumnResize?.({ key: col.key, width: 'auto' });
                        }}
                        onKeyDown={(event) => {
                          const current =
                            typeof columnWidths.get(col.key) === 'number'
                              ? Number(columnWidths.get(col.key))
                              : col.width && typeof col.width === 'number'
                                ? col.width
                                : defaultColumnWidth;
                          const step = event.shiftKey ? 32 : 8;
                          let next: number | null = null;
                          if (event.key === 'ArrowLeft') next = current - step;
                          if (event.key === 'ArrowRight') next = current + step;
                          if (event.key === 'Home') next = col.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH;
                          if (event.key === 'End') next = col.maxWidth ?? current;
                          if (next === null) return;
                          event.preventDefault();
                          const bounded = Math.min(col.maxWidth ?? Number.POSITIVE_INFINITY, Math.max(col.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH, next));
                          setColumnWidths((prev) => new Map(prev).set(col.key, bounded));
                          onColumnResize?.({ key: col.key, width: bounded });
                        }}
                      />
                    )}
                  </div>
                );
              })}

              {columnVirtualization && columnVirtualLayout.afterWidth > 0 && (
                <div className="sp-datagrid__column-virtual-spacer" aria-hidden="true" />
              )}
              {showRowEditActions && (
                <div className="sp-datagrid__header-cell sp-datagrid__actions-header" role="columnheader">
                  {resolvedEditLabels.actions}
                </div>
              )}
              {!fitColumnsToWidth && (
                <div
                  className="sp-datagrid__header-cell sp-datagrid__header-cell--filler"
                  role="columnheader"
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Body Rows */}
            {displayRows.length === 0 && !effectiveLoading && (
              <div className="sp-datagrid__empty-row" role="row">
                <div className="sp-datagrid__empty-cell" role="gridcell" style={{ gridColumn: '1 / -1' }}>
                  {emptyState ?? (
                    <div className="sp-datagrid__empty-state">
                      <Icon name={emptyIcon} size={32} />
                      <div className="sp-datagrid__empty-state-copy">
                        <strong>{resolvedEmptyTitle}</strong>
                        {resolvedEmptyDescription && <p>{resolvedEmptyDescription}</p>}
        </div>
        {filterPanel && filterPanel.position !== 'left' && (
          <aside className={`sp-datagrid__filter-expression-panel${filterPanel.pinned === false ? ' sp-datagrid__filter-expression-panel--floating' : ''}`} style={{ width: filterPanel.width ?? 320, minWidth: filterPanel.minWidth ?? 240, maxWidth: filterPanel.maxWidth ?? 600 }} aria-label={t('filter')}>
            <FilterExpression fields={[...filterPanel.fields]} expression={filterPanel.expression} chrome="flush" border="none" onChange={onFilterExpressionChange ?? (() => undefined)} />
          </aside>
        )}
      </div>
                  )}
                </div>
              </div>
            )}

            {virtualTopSpacer > 0 && (
              <div
                className="sp-datagrid__virtual-spacer"
                aria-hidden="true"
                style={{ blockSize: `${virtualTopSpacer}px` }}
              />
            )}
            {/* The callbacks below only read refs from event handlers, never during render. */}
            {/* eslint-disable-next-line react-hooks/refs */}
            {renderedDisplayRows.map((item, itemIdx) => {
              const absoluteItemIdx = itemIdx + virtualStartIndex;
              if (item.type === 'group') {
                const node = item.node;
                return (
                  <div
                    key={`group-${node.key}`}
                    className={`sp-datagrid__row sp-datagrid__group-row ${
                      stickyGroupHeaders ? 'sp-datagrid__group-row--sticky' : ''
                    }`}
                    role="row"
                    aria-rowindex={absoluteItemIdx + (orderedColumnGroups.length > 0 ? 3 : 2)}
                    aria-expanded={node.expanded}
                  >
                    <div
                      className={`sp-datagrid__group-cell ${
                        groupSelection && effectiveSelectionMode === 'multiple'
                          ? 'sp-datagrid__group-cell--with-selection'
                          : ''
                      }`}
                      style={{
                        gridColumn: '1 / -1',
                        paddingInlineStart: indentGroupedRows
                          ? `calc(var(--sp-datagrid-cell-padding-inline) + ${item.depth * 20}px)`
                          : undefined,
                      }}
                    >
                      {groupSelection && effectiveSelectionMode === 'multiple' && (
                        <Checkbox
                          className="sp-datagrid__group-selection"
                          ariaLabel={`Select group ${node.groupField}: ${String(node.groupValue ?? '')}`}
                          checked={node.rows.length > 0 && node.rows.every((row) => activeSelection.includes(row))}
                          indeterminate={(() => {
                            const selectedCount = node.rows.filter((row) => activeSelection.includes(row)).length;
                            return selectedCount > 0 && selectedCount < node.rows.length;
                          })()}
                          onChange={() => handleToggleGroupSelection(node.rows)}
                        />
                      )}
                      <button
                        type="button"
                        className="sp-datagrid__group-toggle"
                        onClick={() => {
                          setGroupExpandedMap((prev) => {
                            const next = new Map(prev);
                            next.set(node.key, !node.expanded);
                            return next;
                          });
                        }}
                      >
                        <Icon name={node.expanded ? 'chevron-down' : 'chevron-right'} size={14} />
                        <span className="sp-datagrid__group-label">
                          <strong>{node.groupField}:</strong> {String(node.groupValue ?? '')}
                        </span>
                        <span className="sp-datagrid__group-count">{node.rows.length}</span>
                      </button>
                    </div>
                  </div>
                );
              }

              const row = item.row;
              const sourceRowIndex = sortedRows.indexOf(row);
              const rowIndex = virtualPaging
                ? (activePage - 1) * activePageSize + Math.max(0, sourceRowIndex)
                : isPaginated
                  ? (activePage - 1) * activePageSize + Math.max(0, sourceRowIndex)
                  : Math.max(0, sourceRowIndex === -1 ? absoluteItemIdx : sourceRowIndex);
              const rowId = resolveTrackBy(trackBy, row, rowIndex);
              const isSelected = activeSelection.includes(row);
              const isRowDetailOpen = expandedRowDetails.has(rowId);
              const isEditingThisRow = editingRowIndex === rowIndex;
              const canEditRow = isRowEditable ? isRowEditable(row) : true;
              const isDirtyRow = visibleColumns.some((column) => dirtyCells.has(`${String(rowId)}:${column.key}`));
              const treeChildren = treeChildrenField ? (row as Record<string, unknown>)[String(treeChildrenField)] : undefined;
              const canExpandRow = rowDetailExpandable
                ? rowDetailExpandable(row, rowIndex)
                : treeChildrenField
                  ? Array.isArray(treeChildren) && treeChildren.length > 0
                  : true;

              // DataContext row markers
              const rowState = dataContextAdapter?.recordState(row);
              const isRowInvalid = dataContextAdapter?.rowInvalid(row);

              const customClass = normalizeClassName(
                typeof rowClass === 'function' ? rowClass(row, rowIndex) : rowClass ??
                  (typeof rowClassName === 'function' ? rowClassName(row, rowIndex) : rowClassName),
              );

              let customRowStyle: CSSProperties | undefined = undefined;
              if (typeof rowStyle === 'function') {
                const res = rowStyle(row, rowIndex);
                if (typeof res === 'object' && res !== null) customRowStyle = res;
              } else if (typeof rowStyle === 'object' && rowStyle !== null) {
                customRowStyle = rowStyle;
              }

              const rowClasses = [
                'sp-datagrid__row',
                'sp-datagrid__body-row',
                stripedRows && rowIndex % 2 === 1 ? 'sp-datagrid__body-row--striped' : '',
                isSelected ? 'sp-datagrid__body-row--selected' : '',
                isEditingThisRow ? 'sp-datagrid__body-row--editing' : '',
                showDirtyIndicator && isDirtyRow ? 'sp-datagrid__body-row--modified' : '',
                rowReorderingEnabled && (!rowReorderable || rowReorderable(row)) ? 'sp-datagrid__body-row--reorderable' : '',
                draggedRowIndex === rowIndex ? 'sp-datagrid__body-row--dragging' : '',
                rowDropTarget?.index === rowIndex && rowDropTarget.position === 'before' ? 'sp-datagrid__body-row--drop-before' : '',
                rowDropTarget?.index === rowIndex && rowDropTarget.position === 'after' ? 'sp-datagrid__body-row--drop-after' : '',
                rowState === 'added' && dataContextAdapter?.showRowState() ? 'sp-datagrid__body-row--state-added' : '',
                rowState === 'modified' && dataContextAdapter?.showRowState() ? 'sp-datagrid__body-row--state-modified' : '',
                isRowInvalid && dataContextAdapter?.showRowValidation() ? 'sp-datagrid__body-row--validation-error' : '',
                customClass,
              ]
                .filter(Boolean)
                .join(' ');

              // Full custom row template projection
              if (rowTemplate) {
                return (
                  <Fragment key={String(rowId)}>
                    {rowTemplate({
                      $implicit: row,
                      row,
                      rowIndex,
                      columns: visibleColumns,
                      isEditing: isEditingThisRow,
                      isSelected,
                      isExpanded: isRowDetailOpen,
                    })}
                  </Fragment>
                );
              }

              return (
                <Fragment key={String(rowId)}>
                  <div
                    className={rowClasses}
                    role="row"
                    aria-rowindex={absoluteItemIdx + (orderedColumnGroups.length > 0 ? 3 : 2)}
                    aria-selected={isSelected}
                    aria-label={rowLabel
                      ? typeof rowLabel === 'function'
                        ? rowLabel(row, rowIndex)
                        : String((row as Record<string, unknown>)[String(rowLabel)] ?? '')
                      : `Row ${rowIndex + 1}`}
                    style={customRowStyle}
                    data-row-index={rowIndex}
                    onClick={(event) => {
                      onRowClick?.({ row, rowIndex, nativeEvent: event });
                      const target = event.target as HTMLElement;
                      if (!target.closest('button, input, select, textarea, a')) handleRowSelection(row, rowIndex, event);
                    }}
                    onDoubleClick={(event) => onRowDoubleClick?.({ row, rowIndex, nativeEvent: event })}
                    draggable={rowReorderingEnabled && (!rowReorderable || rowReorderable(row))}
                    onDragStart={() => setDraggedRowIndex(rowIndex)}
                    onDragEnd={() => {
                      setDraggedRowIndex(null);
                      setRowDropTarget(null);
                    }}
                    onDragOver={(e) => {
                      if (draggedRowIndex !== null && draggedRowIndex !== rowIndex) {
                        e.preventDefault();
                        const rect = e.currentTarget.getBoundingClientRect();
                        const midY = rect.top + rect.height / 2;
                        setRowDropTarget({
                          index: rowIndex,
                          position: e.clientY < midY ? 'before' : 'after',
                        });
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedRowIndex !== null && rowDropTarget) {
                        const nextRows = [...sortedRows];
                        const [moved] = nextRows.splice(draggedRowIndex, 1);
                        let targetIdx = rowDropTarget.index;
                        if (rowDropTarget.position === 'after') targetIdx += 1;
                        nextRows.splice(targetIdx, 0, moved);
                        onRowOrderChange?.({
                          row: moved,
                          fromIndex: draggedRowIndex,
                          toIndex: targetIdx,
                          rows: nextRows,
                        });
                      }
                      setDraggedRowIndex(null);
                      setRowDropTarget(null);
                    }}
                  >
                    {/* Row Detail Toggle */}
                    {rowDetail && (
                      <div className="sp-datagrid__cell sp-datagrid__row-detail-toggle-cell" role="gridcell">
                        {canExpandRow && (
                          <button
                            type="button"
                            className="sp-datagrid__row-detail-toggle"
                            aria-label="Toggle row details"
                            aria-expanded={isRowDetailOpen}
                            onClick={() => {
                              {
                                const next = new Set(expandedRowDetails);
                                if (next.has(rowId)) {
                                  next.delete(rowId);
                                  onDetailClose?.(row);
                                } else {
                                  next.add(rowId);
                                  onDetailOpen?.(row);
                                }
                                updateExpandedRowDetails(next);
                              }
                            }}
                          >
                            <Icon name={isRowDetailOpen ? 'chevron-down' : 'chevron-right'} size={14} />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Leading Row Actions */}
                    {hasLeadingRowActions && (
                      <div className="sp-datagrid__cell sp-datagrid__leading-row-actions-cell" role="gridcell">
                        {leadingRowActions ? leadingRowActions({
                          $implicit: row,
                          row,
                          rowIndex,
                          detailPaneOpen: activeDetailPaneRow === row,
                          toggleDetailPane: () => {
                            setActiveDetailPaneRow(activeDetailPaneRow === row ? null : row);
                          },
                        }) : (
                          <button
                            type="button"
                            className="sp-btn sp-btn--sm sp-datagrid__detail-pane-toggle"
                            aria-label={`${activeDetailPaneRow === row ? 'Close' : 'Open'} details for ${String(resolveTrackBy(trackBy, row, rowIndex))}`}
                            aria-pressed={activeDetailPaneRow === row}
                            onClick={() => setActiveDetailPaneRow(activeDetailPaneRow === row ? null : row)}
                          >
                            <Icon name="info" size={14} />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Row Reorder Grip */}
                    {isRowReorder && (
                      <div className="sp-datagrid__cell sp-datagrid__row-drag-cell" role="gridcell">
                        <button
                          type="button"
                          className="sp-datagrid__row-drag-handle"
                          aria-label={`Drag handle: Row ${rowIndex + 1}`}
                          disabled={!rowReorderingEnabled || (rowReorderable !== undefined && !rowReorderable(row))}
                          style={{ border: 'none', background: 'transparent' }}
                        >
                          <Icon name="grip-vertical" size={14} />
                        </button>
                      </div>
                    )}

                    {/* Row Selection Cell */}
                    {showSelectionColumn && (
                      <div className="sp-datagrid__cell sp-datagrid__selection-cell" role="gridcell">
                        {effectiveSelectionMode === 'single' && selectionControl === 'radio' ? (
                          <label className="sp-datagrid__radio">
                            <input
                              type="radio"
                              name={`${gridId}-selection`}
                              className="sp-datagrid__radio-input"
                              aria-label={`Select row ${rowIndex + 1}`}
                              checked={isSelected}
                              onChange={() => handleToggleRowSelection(row)}
                            />
                            <span className="sp-datagrid__radio-circle">
                              <span className="sp-datagrid__radio-dot" />
                            </span>
                          </label>
                        ) : (
                          <Checkbox
                            ariaLabel={`Select row ${rowIndex + 1}`}
                            checked={isSelected}
                            onChange={() => handleToggleRowSelection(row)}
                          />
                        )}
                      </div>
                    )}

                    {/* Row Number */}
                    {showRowNumbers && (
                      <div className="sp-datagrid__cell sp-datagrid__row-number-cell" role="gridcell">
                        {rowIndex + 1}
                      </div>
                    )}

                    {/* Cells */}
                    {columnVirtualization && columnVirtualLayout.beforeWidth > 0 && (
                      <div className="sp-datagrid__column-virtual-spacer" aria-hidden="true" />
                    )}
                    {renderedColumns.map((col, colIdx) => {
                      const sourceSpanIndex = sortedRows.indexOf(row);
                      const rowSpanEnabled =
                        Boolean(col.rowSpan) &&
                        !virtualizationEnabled &&
                        activeGroupBy.length === 0 &&
                        !rowDetail;
                      if (
                        rowSpanEnabled &&
                        sourceSpanIndex >= 0 &&
                        isRowSpanCovered(sortedRows, sourceSpanIndex, col)
                      ) {
                        return null;
                      }

                      const cellVal = getCellValue(row, col);
                      const formattedVal = formatCellValue(row, rowIndex, col, effectiveLocale, nullText);
                      const isEditingCell =
                        (editMode === 'cell' && editingCell?.rowIndex === rowIndex && editingCell?.key === col.key) ||
                        (editMode === 'row' && isEditingThisRow && canEditRow);

                      const isEditable =
                        canEditRow &&
                        (typeof col.editable === 'function' ? col.editable(row) : col.editable === true) &&
                        (!isCellEditable || isCellEditable(row, col)) &&
                        (editMode !== 'none');

                      const isReadonly =
                        col.readonly === true ||
                        (typeof col.readonly === 'function' && col.readonly(row)) ||
                        (isCellReadonly && isCellReadonly(row, col));

                      const editorType =
                        col.editorType ??
                        (cellVal instanceof Date
                          ? 'date'
                          : typeof cellVal === 'number'
                            ? 'number'
                            : typeof cellVal === 'boolean'
                              ? 'checkbox'
                              : 'text');
                      const draftValue = editMode === 'row' ? rowDrafts.get(col.key) : cellDraftValue;

                      const pin = columnPinsProp?.[col.key] ?? col.pinned;

                      const span = rowSpanEnabled && sourceSpanIndex >= 0
                        ? resolveRowSpan(sortedRows, sourceSpanIndex, col)
                        : 1;

                      const cellState = dataContextAdapter?.cellState(row, col.key);
                      const cellErrors = dataContextAdapter?.cellValidationErrors(row, col.key) ?? [];
                      const isCellInvalid = cellErrors.length > 0 || (isEditingCell && cellValidationErrors.length > 0);

                      const cellClasses = [
                        'sp-datagrid__cell',
                        col.align ? `sp-datagrid__cell--align-${col.align}` : '',
                        col.wrap !== false ? 'sp-datagrid__cell--wrap' : '',
                        isEditable ? 'sp-datagrid__cell--editable' : '',
                        isReadonly ? 'sp-datagrid__cell--readonly' : '',
                        isEditingCell ? 'sp-datagrid__cell--editing' : '',
                        isCellInvalid ? 'sp-datagrid__cell--invalid' : '',
                        span > 1 ? 'sp-datagrid__cell--row-span' : '',
                        pin ? 'sp-datagrid__pinned-cell' : '',
                        pin === 'left' ? 'sp-datagrid__pinned-cell--left' : '',
                        pin === 'right' ? 'sp-datagrid__pinned-cell--right' : '',
                        colIdx === leftPinned.length - 1 ? 'sp-datagrid__pinned-cell--boundary' : '',
                        colIdx === renderedColumns.length - rightPinned.length ? 'sp-datagrid__pinned-cell--boundary' : '',
                        cellState === 'added' && dataContextAdapter?.showCellState() ? 'sp-datagrid__cell--state-added' : '',
                        cellState === 'modified' && dataContextAdapter?.showCellState() ? 'sp-datagrid__cell--state-modified' : '',
                        isCellInvalid && dataContextAdapter?.showCellValidation() ? 'sp-datagrid__cell--validation-error' : '',
                        showDirtyIndicator && dirtyCells.has(`${String(rowId)}:${col.key}`) ? 'sp-datagrid__cell--modified' : '',
                        (cellVal === null || cellVal === undefined) ? 'sp-datagrid__cell--null' : '',
                        normalizeClassName(typeof col.className === 'function' ? col.className({ value: cellVal, row, rowIndex, column: col }) : col.className),
                        normalizeClassName(cellClassName?.({ value: cellVal, row, rowIndex, column: col })),
                      ]
                        .filter(Boolean)
                        .join(' ');

                      const customTemplate = cellTemplates[col.key];
                      const customEditor = cellEditors[col.key];
                      const choiceOptions = normalizeChoiceOptions(
                        col.editorOptions?.options,
                        col.editorOptions?.displayField,
                        col.editorOptions?.valueField,
                      );

                      return (
                        <div
                          key={col.key}
                          className={cellClasses}
                          role="gridcell"
                          aria-colindex={visibleColumns.indexOf(col) + ariaColumnOffset + 1}
                          aria-rowspan={span > 1 ? span : undefined}
                          aria-readonly={isReadonly ? true : undefined}
                          aria-invalid={isCellInvalid ? true : undefined}
                          data-sp-datagrid-cell={col.key}
                          tabIndex={0}
                          style={{
                            ...pinnedColumnStyle(col.key, pin),
                            gridColumn: gridColumnFor(col),
                            ...(span > 1 ? { '--sp-datagrid-row-span': span } : {}),
                            ...(typeof col.style === 'function' ? col.style({ value: cellVal, row, rowIndex, column: col }) ?? {} : col.style ?? {}),
                            ...(cellStyle?.({ value: cellVal, row, rowIndex, column: col }) ?? {}),
                          } as CSSProperties}
                          onDoubleClick={() => {
                            if (isEditable && !isReadonly && editMode === 'cell') {
                              startCellEdit(rowIndex, col.key, cellVal, row);
                            }
                          }}
                          onClick={(event) => {
                            onCellClick?.({ row, rowIndex, column: col, value: cellVal, nativeEvent: event });
                            if (isEditable && !isReadonly && editMode === 'cell' && editOnClick) {
                              startCellEdit(rowIndex, col.key, cellVal, row);
                            }
                          }}
                          onKeyDown={(event) => {
                            if (isEditingCell) return;
                            if (isEditable && !isReadonly && editMode === 'cell') {
                              if (event.key === 'Enter' || event.key === 'F2' || (event.key === ' ' && editorType === 'checkbox')) {
                                event.preventDefault();
                                startCellEdit(rowIndex, col.key, cellVal);
                              } else if (
                                editOnType &&
                                !event.ctrlKey &&
                                !event.metaKey &&
                                !event.altKey &&
                                (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete')
                              ) {
                                event.preventDefault();
                                startCellEdit(rowIndex, col.key, event.key === 'Backspace' || event.key === 'Delete' ? '' : event.key, row);
                              }
                            }
                          }}
                          onMouseEnter={(e) => {
                            if (isCellInvalid) {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const msg = cellErrors.map((err) => err.message).join(' ') || cellValidationErrors.map((err) => err.message).join(' ');
                              setFloatingError({ message: msg, rect });
                            }
                          }}
                          onMouseLeave={() => setFloatingError(null)}
                        >
                          {/* Corner triangle state indicator */}
                          {cellState && dataContextAdapter?.showCellState() && (
                            <span className="sp-datagrid__state-indicator" />
                          )}

                          {/* Corner triangle validation indicator */}
                          {isCellInvalid && dataContextAdapter?.showCellValidation() && (
                            <span className="sp-datagrid__validation-indicator" />
                          )}

                          {/* Readonly lock indicator glyph */}
                          {isReadonly && (
                            <span className="sp-datagrid__readonly-indicator">
                              <Icon name="lock" size={12} />
                            </span>
                          )}

                          {/* Editing control or Cell Template */}
                          {isEditingCell ? (
                            <>
                              <span className="sp-datagrid__editor-sizer" aria-hidden="true">
                                {formattedVal || '\u00A0'}
                              </span>
                              {customEditor ? (
                                customEditor({
                                  $implicit: draftValue,
                                  originalValue: cellVal,
                                  value: draftValue,
                                  row,
                                  rowIndex,
                                  column: col,
                                  invalid: isCellInvalid,
                                  errors: cellValidationErrors,
                                  firstError: cellValidationErrors[0]?.message ?? null,
                                  update: (newVal) => {
                                    if (editMode === 'row') {
                                      setRowDrafts((prev) => new Map(prev).set(col.key, newVal));
                                    } else {
                                      setCellDraftValue(newVal);
                                    }
                                  },
                                  commit: () => {
                                    if (editMode === 'row') {
                                      // Row save handled by row save button
                                    } else {
                                      // Cell commit
                                      commitCellDraft(row, rowIndex, col, draftValue);
                                    }
                                  },
                                  cancel: () => {
                                    setEditingCell(null);
                                  },
                                })
                              ) : editorType === 'checkbox' ? (
                                <Checkbox
                                  className="sp-datagrid__editor-control--checkbox"
                                  checked={Boolean(draftValue)}
                                  onChange={(val) => {
                                    if (editMode === 'row') {
                                      setRowDrafts((prev) => new Map(prev).set(col.key, val));
                                    } else {
                                      setCellDraftValue(val);
                                      commitCellDraft(row, rowIndex, col, val);
                                    }
                                  }}
                                />
                              ) : editorType === 'select' || editorType === 'combobox' || editorType === 'grid-combobox' ? (
                                <select
                                  className="sp-datagrid__editor"
                                  value={col.editorOptions?.multiple === true
                                    ? (Array.isArray(draftValue) ? draftValue.map((value) => String(value)) : [])
                                    : String(draftValue ?? '')}
                                  autoFocus
                                  multiple={col.editorOptions?.multiple === true}
                                  onChange={(event) => {
                                    const value = event.currentTarget.multiple
                                      ? Array.from(event.currentTarget.selectedOptions).map((option) => {
                                          const match = choiceOptions.find((candidate) => String(candidate.value) === option.value);
                                          return col.editorOptions?.useDisplayValue || col.editorOptions?.saveDisplayField
                                            ? match?.label ?? option.value
                                            : match?.value ?? option.value;
                                        })
                                      : (() => {
                                          const match = choiceOptions.find((candidate) => String(candidate.value) === event.currentTarget.value);
                                          return col.editorOptions?.useDisplayValue || col.editorOptions?.saveDisplayField
                                            ? match?.label ?? event.currentTarget.value
                                            : match?.value ?? event.currentTarget.value;
                                        })();
                                    if (editMode === 'row') {
                                      setRowDrafts((prev) => new Map(prev).set(col.key, value));
                                    } else {
                                      setCellDraftValue(value);
                                      commitCellDraft(row, rowIndex, col, value);
                                    }
                                  }}
                                  onKeyDown={(event) => {
                                    if (event.key === 'Escape') {
                                      setEditingCell(null);
                                      setCellDraftValue(undefined);
                                    } else if (event.key === 'Enter' && editMode === 'cell') {
                                      event.preventDefault();
                                      commitCellDraft(row, rowIndex, col, event.currentTarget.value);
                                    }
                                  }}
                                >
                                  {col.editorOptions?.placeholder && <option value="">{col.editorOptions.placeholder}</option>}
                                  {choiceOptions.map((option) => (
                                    <option key={String(option.value)} value={String(option.value)} disabled={option.disabled}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={editorType === 'number' ? 'number' : editorType === 'date' ? 'date' : 'text'}
                                  className={`sp-datagrid__editor${isCellInvalid ? ' sp-datagrid__editor--invalid' : ''}`}
                                  aria-invalid={isCellInvalid ? true : undefined}
                                  min={col.editorOptions?.minDate}
                                  max={col.editorOptions?.maxDate}
                                  value={String(draftValue ?? '')}
                                  autoFocus
                                  ref={(el) => {
                                    if (el) {
                                      el.focus();
                                      selectAllInputText(el);
                                      const handleMouseUp = () => {
                                        selectAllInputText(el);
                                      };
                                      el.addEventListener('mouseup', handleMouseUp, { once: true });
                                      requestAnimationFrame(() => {
                                        selectAllInputText(el);
                                      });
                                      setTimeout(() => {
                                        el.removeEventListener('mouseup', handleMouseUp);
                                      }, 300);
                                    }
                                  }}
                                  onFocus={(e) => {
                                    selectAllInputText(e.currentTarget);
                                  }}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (editMode === 'row') {
                                      setRowDrafts((prev) => new Map(prev).set(col.key, val));
                                    } else {
                                      setCellDraftValue(val);
                                      if (validateOnInput) setCellValidationErrors(validateValue(val, row, col));
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      if (editMode === 'cell') {
                                        e.preventDefault();
                                        commitCellDraft(row, rowIndex, col, e.currentTarget.value);
                                      }
                                    } else if (e.key === 'Escape') {
                                      setEditingCell(null);
                                      setCellDraftValue(undefined);
                                    }
                                  }}
                                  onBlur={(event) => {
                                    if (editMode === 'cell') commitCellDraft(row, rowIndex, col, event.currentTarget.value);
                                  }}
                                />
                              )}
                            </>
                          ) : editorType === 'checkbox' ? (
                            <Checkbox
                              className="sp-datagrid__cell-checkbox"
                              ariaLabel={`${col.header} for ${rowLabel
                                ? typeof rowLabel === 'function'
                                  ? rowLabel(row, rowIndex)
                                  : String((row as Record<string, unknown>)[String(rowLabel)] ?? '')
                                : `row ${rowIndex + 1}`}`}
                              checked={Boolean(cellVal)}
                              disabled={!isEditable || isReadonly}
                              onChange={(checked) => commitCellDraft(row, rowIndex, col, checked)}
                            />
                          ) : customTemplate ? (
                            customTemplate({
                              $implicit: cellVal,
                              value: cellVal,
                              formattedValue: formattedVal,
                              row,
                              rowIndex,
                              column: col,
                            })
                          ) : (
                            formattedVal
                          )}
                        </div>
                      );
                    })}
                    {columnVirtualization && columnVirtualLayout.afterWidth > 0 && (
                      <div className="sp-datagrid__column-virtual-spacer" aria-hidden="true" />
                    )}

                    {/* Row Edit Save / Cancel Action Column */}
                    {showRowEditActions && (
                      <div className="sp-datagrid__cell sp-datagrid__row-action-cell" role="gridcell">
                        {isEditingThisRow ? (
                          <>
                            <button
                              type="button"
                              className="sp-btn sp-btn--sm sp-btn--primary"
                              onClick={() => {
                                commitRowDraft(row, rowIndex, rowDrafts);
                              }}
                            >
                              {resolvedEditLabels.save}
                            </button>
                            <button
                              type="button"
                              className="sp-btn sp-btn--sm sp-btn--secondary"
                              onClick={() => {
                                onEditCancel?.({ mode: 'row', row, rowIndex });
                                setEditingRowIndex(null);
                              }}
                            >
                              {resolvedEditLabels.cancel}
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="sp-btn sp-btn--sm sp-btn--secondary"
                            onClick={() => {
                              startRowEdit(rowIndex, row);
                            }}
                          >
                            {resolvedEditLabels.edit}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Expandable Row Detail */}
                  {rowDetail && isRowDetailOpen && (
                    <div className="sp-datagrid__row sp-datagrid__row-detail-row" role="row">
                      <div className="sp-datagrid__row-detail-cell sp-datagrid__row-detail-enter">
                        <div className="sp-datagrid__row-detail-content">
                          {rowDetail({ $implicit: row, row, rowIndex })}
                        </div>
                      </div>
                    </div>
                  )}
                </Fragment>
              );
            })}
            {virtualBottomSpacer > 0 && (
              <div
                className="sp-datagrid__virtual-spacer"
                aria-hidden="true"
                style={{ blockSize: `${virtualBottomSpacer}px` }}
              />
            )}

            {/* Optional New Row Prompt Row */}
            {allowNewRow && (
              <div className="sp-datagrid__row sp-datagrid__body-row sp-datagrid__body-row--new" role="row">
                {rowDetail && <div className="sp-datagrid__cell sp-datagrid__row-detail-toggle-cell" role="gridcell" />}
                {hasLeadingRowActions && <div className="sp-datagrid__cell sp-datagrid__leading-row-actions-cell" role="gridcell" />}
                {isRowReorder && <div className="sp-datagrid__cell sp-datagrid__row-drag-cell" role="gridcell" />}
                {showSelectionColumn && <div className="sp-datagrid__cell sp-datagrid__selection-cell" role="gridcell" />}
                {showRowNumbers && <div className="sp-datagrid__cell sp-datagrid__row-number-cell" role="gridcell" />}
                {!newRowEditing ? (
                  <div
                    className="sp-datagrid__cell"
                    role="gridcell"
                    style={{ gridColumn: `span ${Math.max(1, renderedColumns.length + (columnVirtualLayout.beforeWidth > 0 ? 1 : 0) + (columnVirtualLayout.afterWidth > 0 ? 1 : 0))}`, cursor: 'pointer' }}
                    onClick={beginNewRowEdit}
                  >
                    <span className="sp-datagrid__new-row-prompt">
                      <Icon name="plus" size={14} /> {resolvedNewRowPrompt}
                    </span>
                  </div>
                ) : (
                  renderedColumns.map((column) => {
                    const draft = newRowDraft ?? createNewRowDraft();
                    const value = getCellValue(draft, column);
                    const editorType = column.editorType ?? (value instanceof Date ? 'date' : typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'checkbox' : 'text');
                    const options = normalizeChoiceOptions(
                      column.editorOptions?.options,
                      column.editorOptions?.displayField,
                      column.editorOptions?.valueField,
                    );
                    const editable = typeof column.editable === 'function' ? column.editable(draft) : column.editable === true;
                    if (!editable) {
                      return <div key={column.key} className="sp-datagrid__cell" role="gridcell">{formatCellValue(draft, sortedRows.length, column, effectiveLocale)}</div>;
                    }
                    const updateDraft = (nextValue: unknown) => setNewRowDraft({ ...draft, [column.key]: nextValue } as T);
                    const isFocusedNewRowCol = column.key === visibleColumns.find((candidate) => candidate.editable === true)?.key;
                    const newRowFormattedVal = formatCellValue(draft, sortedRows.length, column, effectiveLocale);
                    return (
                      <div key={column.key} className="sp-datagrid__cell sp-datagrid__cell--editing sp-datagrid__cell--editable" role="gridcell">
                        <span className="sp-datagrid__editor-sizer" aria-hidden="true">
                          {newRowFormattedVal || '\u00A0'}
                        </span>
                        {editorType === 'checkbox' ? (
                          <Checkbox
                            className="sp-datagrid__editor-control--checkbox"
                            checked={Boolean(value)}
                            onChange={(checked) => newRowCommit === 'immediate' ? commitNewRowCell(column, checked) : updateDraft(checked)}
                          />
                        ) : editorType === 'select' || editorType === 'combobox' || editorType === 'grid-combobox' ? (
                          <select
                            className="sp-datagrid__editor"
                            value={String(value ?? '')}
                            autoFocus={isFocusedNewRowCol}
                            onChange={(event) => newRowCommit === 'immediate' ? commitNewRowCell(column, event.target.value) : updateDraft(event.target.value)}
                          >
                            {column.editorOptions?.placeholder && <option value="">{column.editorOptions.placeholder}</option>}
                            {options.map((option) => <option key={String(option.value)} value={String(option.value)} disabled={option.disabled}>{option.label}</option>)}
                          </select>
                        ) : (
                          <input
                            className="sp-datagrid__editor"
                            type={editorType === 'number' ? 'number' : editorType === 'date' ? 'date' : 'text'}
                            value={String(value ?? '')}
                            autoFocus={isFocusedNewRowCol}
                            ref={(el) => {
                              if (el && isFocusedNewRowCol) {
                                el.focus();
                                selectAllInputText(el);
                                const handleMouseUp = () => {
                                  selectAllInputText(el);
                                };
                                el.addEventListener('mouseup', handleMouseUp, { once: true });
                                requestAnimationFrame(() => {
                                  selectAllInputText(el);
                                });
                                setTimeout(() => {
                                  el.removeEventListener('mouseup', handleMouseUp);
                                }, 300);
                              }
                            }}
                            onFocus={(e) => {
                              selectAllInputText(e.currentTarget);
                            }}
                            onChange={(event) => updateDraft(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') commitNewRowCell(column, event.currentTarget.value);
                              if (event.key === 'Escape') {
                                setNewRowDraft(null);
                                setNewRowEditing(false);
                              }
                            }}
                            onBlur={(event) => {
                              if (newRowCommit === 'immediate' || !event.currentTarget.closest('.sp-datagrid__body-row--new')?.contains(event.relatedTarget)) {
                                commitNewRowCell(column, event.currentTarget.value);
                              }
                            }}
                          />
                        )}
                      </div>
                    );
                  })
                )}
                {showRowEditActions && <div className="sp-datagrid__cell sp-datagrid__row-action-cell" role="gridcell" />}
              </div>
            )}

            {/* Sticky Summary Footer Row */}
            {hasFooterAggregates && (
              <div className="sp-datagrid__row sp-datagrid__footer-row" role="row" aria-rowindex={renderedDisplayRows.length + (orderedColumnGroups.length > 0 ? 3 : 2)} aria-label={footerLabel ?? t('summary')}>
                {rowDetail && <div className="sp-datagrid__footer-cell" />}
                {hasLeadingRowActions && <div className="sp-datagrid__footer-cell" />}
                {isRowReorder && <div className="sp-datagrid__footer-cell" />}
                {showSelectionColumn && <div className="sp-datagrid__footer-cell" />}
                {showRowNumbers && <div className="sp-datagrid__footer-cell" />}

                {columnVirtualization && columnVirtualLayout.beforeWidth > 0 && (
                  <div className="sp-datagrid__column-virtual-spacer" aria-hidden="true" />
                )}
                {renderedColumns.map((col, colIdx) => {
                  const agg = footerAggregates.get(col.key);
                  const pin = columnPinsProp?.[col.key] ?? col.pinned;
                  return (
                    <div
                      key={col.key}
                      className={[
                        'sp-datagrid__footer-cell',
                        pin ? 'sp-datagrid__pinned-cell' : '',
                        pin === 'left' ? 'sp-datagrid__pinned-cell--left' : '',
                        pin === 'right' ? 'sp-datagrid__pinned-cell--right' : '',
                        colIdx === leftPinned.length - 1 ? 'sp-datagrid__pinned-cell--boundary' : '',
                        colIdx === renderedColumns.length - rightPinned.length ? 'sp-datagrid__pinned-cell--boundary' : '',
                      ].filter(Boolean).join(' ')}
                      role="gridcell"
                      aria-colindex={visibleColumns.indexOf(col) + ariaColumnOffset + 1}
                      style={pinnedColumnStyle(col.key, pin)}
                    >
                      {agg && (
                        <div className="sp-datagrid__aggregate">
                          <span className="sp-datagrid__aggregate-label">{agg.label}:</span>
                          <span className="sp-datagrid__aggregate-value">{agg.formatted}</span>
                        </div>
                      )}
                      {!agg && col.key === footerLabelColumnKey && (
                        <span className="sp-datagrid__footer-label">
                          {footerLabel ?? t('summary')}
                        </span>
                      )}
                    </div>
                  );
                })}

                {columnVirtualization && columnVirtualLayout.afterWidth > 0 && (
                  <div className="sp-datagrid__column-virtual-spacer" aria-hidden="true" />
                )}

                {showRowEditActions && <div className="sp-datagrid__footer-cell" />}
              </div>
            )}
          </div>
        </div>

        {/* Slide-out Side Detail Pane */}
        {effectiveDetailPaneRenderer && activeDetailPaneRow && (
          <aside className="sp-datagrid__detail-pane sp-datagrid__detail-pane-enter">
            <header className="sp-datagrid__detail-pane-header">
              <strong>
                {typeof detailPaneTitle === 'function'
                  ? detailPaneTitle(activeDetailPaneRow)
                  : detailPaneTitle ?? t('details')}
              </strong>
              <button
                type="button"
                className="sp-btn sp-btn--sm"
                aria-label={t('close')}
                onClick={() => setActiveDetailPaneRow(null)}
              >
                <Icon name="x" size={14} />
              </button>
            </header>
            <div className="sp-datagrid__detail-pane-content">
              {effectiveDetailPaneRenderer({
                $implicit: activeDetailPaneRow,
                row: activeDetailPaneRow,
                rowIndex: sortedRows.indexOf(activeDetailPaneRow),
                close: () => setActiveDetailPaneRow(null),
              })}
            </div>
          </aside>
        )}
      </div>

      {/* Pagination Bar */}
      {isPaginated && (
        <div
          className={`sp-datagrid__pagination ${
            paginationType === 'full' ? 'sp-datagrid__pagination--full' : ''
          }`}
        >
          {paginationType === 'full' ? (
            <div className="sp-datagrid__pagination-full">
              <span className="sp-datagrid__pagination-page-info">
                Page {activePage} of {totalPages} ({totalRowsCount} items)
              </span>

              <div className="sp-datagrid__pagination-nav-group">
                <button
                  type="button"
                  className="sp-datagrid__page-nav-btn"
                  aria-label="First page"
                  disabled={virtualPaging ? !canVirtualPrevious : activePage <= 1}
                  onClick={() => {
                    setInternalPage(1);
                    if (virtualPaging) {
                      const request = { page: Math.max(1, activePage - 1), pageSize: activePageSize, direction: 'previous' as const, trigger: 'button' as const };
                      (onVirtualPageRequest ?? virtualPageRequest)?.(request);
                    } else {
                      onPageChange?.({ page: 1, pageSize: activePageSize, totalRows: totalRowsCount, totalPages });
                    }
                  }}
                >
                  <Icon name="chevrons-left" size={14} />
                </button>
                <button
                  type="button"
                  className="sp-datagrid__page-nav-btn"
                  aria-label="Previous page"
                  disabled={virtualPaging ? !canVirtualPrevious : activePage <= 1}
                  onClick={() => {
                    const p = activePage - 1;
                    if (virtualPaging) {
                      const request = { page: p, pageSize: activePageSize, direction: 'previous' as const, trigger: 'button' as const };
                      (onVirtualPageRequest ?? virtualPageRequest)?.(request);
                    } else {
                      setInternalPage(p);
                      onPageChange?.({ page: p, pageSize: activePageSize, totalRows: totalRowsCount, totalPages });
                    }
                  }}
                >
                  <Icon name="chevron-left" size={14} />
                </button>

                {/* Page number buttons */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pNum = i + 1;
                  if (totalPages > 5 && activePage > 3) {
                    pNum = Math.min(totalPages - 4, activePage - 2) + i;
                  }
                  return (
                    <button
                      key={pNum}
                      type="button"
                      className={`sp-datagrid__page-btn ${
                        activePage === pNum ? 'sp-datagrid__page-btn--active' : ''
                      }`}
                      onClick={() => {
                        if (virtualPaging) {
                          const request = {
                            page: pNum,
                            pageSize: activePageSize,
                            direction: pNum < activePage ? 'previous' as const : 'next' as const,
                            trigger: 'button' as const,
                          };
                          (onVirtualPageRequest ?? virtualPageRequest)?.(request);
                        } else {
                          setInternalPage(pNum);
                          onPageChange?.({ page: pNum, pageSize: activePageSize, totalRows: totalRowsCount, totalPages });
                        }
                      }}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className="sp-datagrid__page-nav-btn"
                  aria-label="Next page"
                  disabled={virtualPaging ? !canVirtualNext : activePage >= totalPages}
                  onClick={() => {
                    const p = activePage + 1;
                    if (virtualPaging) {
                      onVirtualPageRequest?.({ page: p, pageSize: activePageSize, direction: 'next', trigger: 'button' });
                      virtualPageRequest?.({ page: p, pageSize: activePageSize, direction: 'next', trigger: 'button' });
                    } else {
                      setInternalPage(p);
                      onPageChange?.({ page: p, pageSize: activePageSize, totalRows: totalRowsCount, totalPages });
                    }
                  }}
                >
                  <Icon name="chevron-right" size={14} />
                </button>
                <button
                  type="button"
                  className="sp-datagrid__page-nav-btn"
                  aria-label="Last page"
                  disabled={virtualPaging || activePage >= totalPages}
                  onClick={() => {
                    if (!virtualPaging) {
                      setInternalPage(totalPages);
                      onPageChange?.({ page: totalPages, pageSize: activePageSize, totalRows: totalRowsCount, totalPages });
                    }
                  }}
                >
                  <Icon name="chevrons-right" size={14} />
                </button>
              </div>

              {/* Rows Per Page Selector */}
              <div className="sp-datagrid__pagination-rows-group">
                <span className="sp-datagrid__pagination-rows-label">Rows</span>
                <div className="sp-datagrid__pagination-rows-pills">
                  {effectivePageSizeOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`sp-datagrid__rows-btn ${
                        activePageSize === opt ? 'sp-datagrid__rows-btn--active' : ''
                      }`}
                      onClick={() => {
                        setInternalPageSize(opt);
                        onPageSizeChange?.(opt);
                        setInternalPage(1);
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <p>
                Showing {(activePage - 1) * activePageSize + 1}–
                {Math.min(activePage * activePageSize, totalRowsCount)} of {totalRowsCount}
              </p>
              <div className="sp-datagrid__pagination-actions">
                <select
                  className="sp-datagrid__pagination-select"
                  aria-label="Rows per page"
                  value={activePageSize}
                  onChange={(event) => {
                    const opt = Number(event.target.value);
                    setInternalPageSize(opt);
                    onPageSizeChange?.(opt);
                    setInternalPage(1);
                  }}
                >
                  {effectivePageSizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Previous page"
                  disabled={virtualPaging ? !canVirtualPrevious : activePage <= 1}
                  onClick={() => {
                    const p = activePage - 1;
                    if (virtualPaging) {
                      const request = { page: p, pageSize: activePageSize, direction: 'previous' as const, trigger: 'button' as const };
                      (onVirtualPageRequest ?? virtualPageRequest)?.(request);
                    } else {
                      setInternalPage(p);
                      onPageChange?.({ page: p, pageSize: activePageSize, totalRows: totalRowsCount, totalPages });
                    }
                  }}
                >
                  Previous
                </Button>
                <span className="sp-datagrid__pagination-page-label">
                  {activePage} / {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Next page"
                  disabled={virtualPaging ? !canVirtualNext : activePage >= totalPages}
                  onClick={() => {
                    const p = activePage + 1;
                    if (virtualPaging) {
                      onVirtualPageRequest?.({ page: p, pageSize: activePageSize, direction: 'next', trigger: 'button' });
                      virtualPageRequest?.({ page: p, pageSize: activePageSize, direction: 'next', trigger: 'button' });
                    } else {
                      setInternalPage(p);
                      onPageChange?.({ page: p, pageSize: activePageSize, totalRows: totalRowsCount, totalPages });
                    }
                  }}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Status Bar */}
      {statusbarEnabled && (
        <div className="sp-datagrid__statusbar" role="status" aria-label={statusbarAriaLabel ?? t('dataGridStatus')}>
          <div className="sp-datagrid__statusbar-start">
            <div className="sp-datagrid__statusbar-values">
              {statusbarShowRowCount && <span>{totalRowsCount} {t('rows').toLocaleLowerCase()}</span>}
              {statusbarShowSelectedRowCount && activeSelection.length > 0 && <span>{activeSelection.length} selected</span>}
            </div>
            {typeof statusbarStart === 'function'
              ? statusbarStart({ totalRows: totalRowsCount, selectedRows: activeSelection })
              : statusbarStart}
          </div>
          <div className="sp-datagrid__statusbar-end">
            {typeof statusbarEnd === 'function'
              ? statusbarEnd({ totalRows: totalRowsCount, selectedRows: activeSelection })
              : statusbarEnd}
            {isShowColumnSelector && (
              <div className="sp-datagrid__statusbar-column-selector">
                <Popover
                  trigger={(
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      iconLeft="columns"
                      aria-label={columnSelectorLabel ?? t('columns')}
                    />
                  )}
                  open={showColumnSelectorPopover?.source === 'statusbar'}
                  onOpenChange={(open) => setShowColumnSelectorPopover(open ? { source: 'statusbar' } : null)}
                  placement="top-end"
                  panelClassName="sp-datagrid__column-selector-popover"
                  panelAriaLabel={columnSelectorLabel ?? t('columns')}
                  padding="0"
                >
                  <div className="sp-datagrid__column-selector-panel">
                    {renderColumnSelectorContent()}
                  </div>
                </Popover>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {effectiveLoading && (
        <div className="sp-datagrid__loading-overlay">
          {loadingMode === 'skeleton' ? (
            <div className="sp-datagrid__skeleton" role="status" aria-label={resolvedLoadingMessage}>
              {Array.from({ length: Math.max(1, skeletonRowCount) }, (_, index) => (
                <div key={index} className="sp-datagrid__skeleton-row">
                  {renderedColumns.map((column) => <span key={column.key} className="sp-datagrid__skeleton-cell" />)}
                </div>
              ))}
            </div>
          ) : (
            <div className="sp-datagrid__loading-spinner-wrap">
              <Icon name="refresh-cw" size={24} className="sp-datagrid__loading-spinner" />
              <span className="sp-datagrid__loading-message">{resolvedLoadingMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Floating Drag Ghost for Column Header Reorder */}
      {draggedColumnKey && dragGhostPos && createPortal(
        <div
          className="sp-datagrid__drag-ghost"
          style={{
            transform: `translate3d(${dragGhostPos.x + 12}px, ${dragGhostPos.y + 12}px, 0)`,
          }}
        >
          <div className="sp-datagrid__drag-ghost-surface">
            <span className="sp-datagrid__drag-ghost-label">
              {columnsProp.find((c) => c.key === draggedColumnKey)?.header ?? draggedColumnKey}
            </span>
          </div>
        </div>,
        document.body,
      )}

      {/* Floating Error Badge */}
      {floatingError && createPortal(
        <div
          className="sp-datagrid__editor-error-badge"
          style={{
            top: floatingError.rect.bottom + 4,
            left: floatingError.rect.left,
          }}
        >
          <Icon name="alert-circle" size={12} />
          <span>{floatingError.message}</span>
        </div>,
        document.body,
      )}

      {/* Distinct / Dynamic Filter Popover */}
      {activeFilterPopover && (() => {
        const col = visibleColumns.find((c) => c.key === activeFilterPopover.key);
        if (!col) return null;

        const isDynamic = col.filterVariant === 'dynamic';
        const distinctValues = Array.from(
          new Map(rawRows.map((row) => {
            const value = getCellValue(row, col);
            return [filterValueKey(value), value] as const;
          })).values(),
        );
        const existingFilter = activeColumnFilters.find((f) => f.key === col.key);

        return createPortal(
          <div
            className="sp-datagrid__filter-popover"
            style={{
              position: 'fixed',
              top: activeFilterPopover.triggerRect.bottom + 6,
              left: Math.max(10, Math.min(activeFilterPopover.triggerRect.left, window.innerWidth - 330)),
              zIndex: 10000,
              background: 'var(--sp-surface-0)',
              border: '1px solid var(--sp-border)',
              borderRadius: '8px',
              boxShadow: 'var(--sp-shadow-lg)',
            }}
          >
            <div className="sp-datagrid__filter-panel">
              <div className="sp-datagrid__filter-header">
                <h3>Filter {col.header}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  iconLeft="x"
                  aria-label="Close filter"
                  onClick={() => setActiveFilterPopover(null)}
                />
              </div>

              {isDynamic ? (
                <div className="sp-datagrid__dynamic-filter-fields">
                  {(() => {
                    const operator = existingFilter?.condition?.operator ?? 'contains';
                    const value = String(existingFilter?.condition?.value ?? '');
                    const valueTo = String(existingFilter?.condition?.valueTo ?? '');
                    const updateCondition = (condition: DatagridDynamicFilterCondition) => {
                      const next = activeColumnFilters.filter((f) => f.key !== col.key);
                      next.push({
                        key: col.key,
                        column: col,
                        values: [],
                        condition,
                      });
                      setInternalColumnFilters(next);
                      onFilterChange?.(next);
                    };

                    return (
                      <>
                        <Field
                          className="sp-datagrid__dynamic-filter-field"
                          label="Condition"
                          labelFor="sp-datagrid-filter-condition"
                        >
                          <Select
                            id="sp-datagrid-filter-condition"
                            options={DATAGRID_DYNAMIC_FILTER_OPERATOR_OPTIONS}
                            value={operator}
                            size="sm"
                            ariaLabel="Condition"
                            onChange={(next) => {
                              const nextOperator = typeof next === 'string' ? next : next[0];
                              if (!nextOperator) return;
                              updateCondition({
                                operator: nextOperator as DatagridDynamicFilterOperator,
                                value,
                                valueTo: nextOperator === 'between' ? valueTo : undefined,
                              });
                            }}
                          />
                        </Field>
                        <Field
                          className="sp-datagrid__dynamic-filter-field"
                          label="Value"
                          labelFor="sp-datagrid-filter-value"
                        >
                          <Input
                            id="sp-datagrid-filter-value"
                            value={value}
                            size="sm"
                            ariaLabel="Value"
                            onChange={(next) => updateCondition({ operator, value: next, valueTo: operator === 'between' ? valueTo : undefined })}
                          />
                        </Field>
                        {operator === 'between' && (
                          <Field
                            className="sp-datagrid__dynamic-filter-field"
                            label="And"
                            labelFor="sp-datagrid-filter-value-to"
                          >
                            <Input
                              id="sp-datagrid-filter-value-to"
                              value={valueTo}
                              size="sm"
                              ariaLabel="And"
                              onChange={(next) => updateCondition({ operator, value, valueTo: next })}
                            />
                          </Field>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <>
                  <div className="sp-datagrid__filter-options">
                    {distinctValues.map((v, i) => {
                      const str = v === null || v === undefined
                        ? '(Blanks)'
                        : col.filterValueFormatter
                          ? col.filterValueFormatter(v, rawRows.find((row) => filterValueKey(getCellValue(row, col)) === filterValueKey(v)) ?? rawRows[0]!)
                          : String(v);
                      const isChecked = existingFilter
                        ? existingFilter.values.some((candidate) => filterValueKey(candidate) === filterValueKey(v))
                        : true;
                      return (
                        <Checkbox
                          key={i}
                          checked={isChecked}
                          onChange={(checked) => {
                            let nextVals: unknown[] = existingFilter ? [...existingFilter.values] : [...distinctValues];
                            if (checked) {
                              if (!nextVals.includes(v)) nextVals.push(v);
                            } else {
                              nextVals = nextVals.filter((item) => filterValueKey(item) !== filterValueKey(v));
                            }
                            const next = activeColumnFilters.filter((f) => f.key !== col.key);
                            if (nextVals.length < distinctValues.length) {
                              next.push({ key: col.key, column: col, values: nextVals });
                            }
                            setInternalColumnFilters(next);
                            onFilterChange?.(next);
                          }}
                        >
                          <span className="sp-datagrid__filter-option-label">{str}</span>
                        </Checkbox>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="sp-datagrid__filter-actions">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    const next = activeColumnFilters.filter((f) => f.key !== col.key);
                    setInternalColumnFilters(next);
                    onFilterChange?.(next);
                    setActiveFilterPopover(null);
                  }}
                >
                  Clear
                </Button>
                <Button size="sm" variant="primary" onClick={() => setActiveFilterPopover(null)}>
                  Apply
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        );
      })()}

    </div>
  );
}

export const Datagrid = forwardRef(DatagridInner) as <
  T extends object = Record<string, unknown>,
>(
  props: DatagridProps<T> & { ref?: ForwardedRef<DatagridHandle<T>> },
) => ReactElement;
