import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import type { FilterField, FilterGroup } from '../filter-expression/FilterExpression.js';

export type DatagridSortDirection = 'asc' | 'desc' | null;
export type DatagridSortMode = 'client' | 'manual';
export type DatagridSortIndicatorVisibility = 'hover' | 'always';
export type DatagridFilterIndicatorVisibility = 'hover' | 'always';
export type DatagridFilterMode = 'client' | 'manual';
export type DatagridFilterVariant = 'values' | 'dynamic';
export type DatagridFilterDataType = 'text' | 'number' | 'date' | 'boolean';
export type DatagridDynamicFilterOperator =
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'equals'
  | 'notEquals'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'between'
  | 'isEmpty'
  | 'isNotEmpty';
export type DatagridCellAlignment = 'start' | 'center' | 'end';
export type DatagridEditMode = 'none' | 'cell' | 'row';
export type DatagridEditorType =
  | 'text'
  | 'number'
  | 'checkbox'
  | 'date'
  | 'select'
  | 'combobox'
  | 'grid-combobox'
  | 'custom';
export type DatagridSelectionMode = 'none' | 'single' | 'multiple';
export type DatagridAggregateType = 'sum' | 'count' | 'avg' | 'min' | 'max';
export type DatagridAggregateScope = 'group' | 'footer';
export type DatagridColumnPin = 'left' | 'right';
export type DatagridGroupSortDirection = 'asc' | 'desc';
export type DatagridPaginationType = 'compact' | 'full';
export type DatagridColumnWidth = number | 'auto' | `${number}%`;
export type DatagridDensity = 'dense' | 'default' | 'comfortable';
export type DatagridHeaderTextCase = 'uppercase' | 'default';
export type DatagridSelectionControl = 'checkbox' | 'radio';
export type DatagridResizeMode = 'live' | 'deferred';
export type DatagridReorderMode = 'live' | 'deferred';
export type DatagridLoadingMode = 'spinner' | 'skeleton';
export type DatagridNewRowPosition = 'top' | 'bottom';
export type DatagridNewRowCommitMode = 'immediate' | 'onLeave';

export interface DatagridColumnMenuItem {
  readonly label: string;
  readonly icon?: string;
  readonly disabled?: boolean;
  readonly separator?: boolean;
  readonly command?: () => void;
  readonly children?: readonly DatagridColumnMenuItem[];
}

export interface DatagridCellContext<T extends object> {
  readonly value: unknown;
  readonly row: T;
  readonly rowIndex: number;
  readonly column: DatagridColumn<T>;
}

export interface DatagridCellTemplateContext<T extends object>
  extends DatagridCellContext<T> {
  /** Raw cell value exposed as the render prop's default binding. */
  readonly $implicit: unknown;
  readonly formattedValue: string;
}

export interface DatagridCellEditorContext<T extends object> extends DatagridCellContext<T> {
  /** Current draft value exposed as the render prop's default binding. */
  readonly $implicit: unknown;
  readonly originalValue: unknown;
  readonly invalid: boolean;
  readonly errors: readonly DatagridValidationError[];
  readonly firstError: string | null;
  readonly update: (value: unknown) => void;
  readonly commit: () => void;
  readonly cancel: () => void;
}

export interface DatagridChoiceOption {
  readonly label: string;
  readonly value: unknown;
  readonly disabled?: boolean;
}

export interface DatagridEditorOptions {
  readonly options?: readonly DatagridChoiceOption[] | unknown;
  readonly columns?: readonly DatagridColumn<Record<string, unknown>>[];
  readonly placeholder?: string;
  readonly displayField?: string;
  readonly valueField?: string;
  readonly useDisplayValue?: boolean;
  readonly saveDisplayField?: boolean;
  readonly searchFields?: readonly string[];
  readonly filterBy?: string | readonly string[];
  readonly multiple?: boolean;
  readonly pageSize?: number;
  readonly virtualScroll?: boolean;
  readonly virtualPaging?: boolean;
  readonly minDate?: string;
  readonly maxDate?: string;
  readonly disabledDates?: readonly string[];
  readonly dateFilter?: (value: string) => boolean;
}

export interface DatagridRowSpanContext<T extends object> extends DatagridCellContext<T> {
  readonly rows: readonly T[];
}

export interface DatagridRowDetailContext<T extends object> {
  readonly $implicit: T;
  readonly row: T;
  readonly rowIndex: number;
}

export interface DatagridDetailPaneContext<T extends object> {
  readonly $implicit: T;
  readonly row: T;
  readonly rowIndex: number;
  readonly close: () => void;
}

export interface DatagridLeadingRowActionsContext<T extends object> {
  readonly $implicit: T;
  readonly row: T;
  readonly rowIndex: number;
  readonly detailPaneOpen: boolean;
  readonly toggleDetailPane: () => void;
}

export interface DatagridAggregateContext<T extends object> {
  readonly values: readonly unknown[];
  readonly rows: readonly T[];
  readonly column: DatagridColumn<T>;
  readonly scope: DatagridAggregateScope;
}

export interface DatagridAggregateValueContext<T extends object>
  extends DatagridAggregateContext<T> {
  readonly value: unknown;
}

export interface DatagridBuiltInAggregate<T extends object> {
  readonly type: DatagridAggregateType;
  readonly label?: string;
  readonly valueFormatter?: (context: DatagridAggregateValueContext<T>) => string;
}

export interface DatagridCustomAggregate<T extends object> {
  readonly type: 'custom';
  readonly aggregate: (context: DatagridAggregateContext<T>) => unknown;
  readonly label?: string;
  readonly valueFormatter?: (context: DatagridAggregateValueContext<T>) => string;
}

export type DatagridAggregate<T extends object> =
  | DatagridAggregateType
  | DatagridBuiltInAggregate<T>
  | DatagridCustomAggregate<T>;

export interface DatagridColumn<T extends object = Record<string, unknown>> {
  readonly key: string;
  readonly header: string;
  readonly valueGetter?: (row: T) => unknown;
  readonly valueFormatter?: (context: DatagridCellContext<T>) => string;
  readonly sortComparator?: (
    leftValue: unknown,
    rightValue: unknown,
    leftRow: T,
    rightRow: T,
  ) => number;
  readonly sortable?: boolean;
  readonly filterable?: boolean;
  readonly filterVariant?: DatagridFilterVariant;
  readonly filterDataType?: DatagridFilterDataType;
  readonly filterValueFormatter?: (value: unknown, row: T) => string;
  readonly filterPredicate?: (
    value: unknown,
    selectedValues: readonly unknown[],
    row: T,
  ) => boolean;
  readonly resizable?: boolean;
  readonly reorderable?: boolean;
  readonly pinned?: DatagridColumnPin;
  readonly width?: DatagridColumnWidth;
  readonly flex?: number;
  readonly minWidth?: number;
  readonly maxWidth?: number;
  readonly align?: DatagridCellAlignment;
  readonly wrap?: boolean;
  readonly className?: string | readonly string[] | ((context: DatagridCellContext<T>) => string | readonly string[] | null | undefined);
  readonly style?: CSSProperties | ((context: DatagridCellContext<T>) => CSSProperties | null | undefined);
  readonly editable?: boolean | ((row: T) => boolean);
  readonly readonly?: boolean | ((row: T) => boolean);
  readonly editorType?: DatagridEditorType;
  readonly editorOptions?: DatagridEditorOptions;
  readonly editorValueFormatter?: (value: unknown, row: T) => string;
  readonly valueParser?: (value: unknown, row: T) => unknown;
  readonly required?: boolean | string;
  readonly min?: number | Date | string;
  readonly max?: number | Date | string;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: string | RegExp;
  readonly validator?: DatagridValidator<T> | readonly DatagridValidator<T>[];
  readonly validators?: readonly DatagridValidator<T>[];
  readonly rules?: DatagridValidationRules<T>;
  readonly validationMessages?: Readonly<Record<string, string>>;
  readonly aggregate?: DatagridAggregate<T>;
  readonly rowSpan?: number | ((context: DatagridRowSpanContext<T>) => number);
  readonly menuItems?: readonly DatagridColumnMenuItem[];
}

export interface DatagridColumnGroup {
  readonly key: string;
  readonly header: string;
  readonly columnKeys: readonly string[];
  readonly resizable?: boolean;
  readonly reorderable?: boolean;
}

export interface DatagridColumnGroupResize {
  readonly key: string;
  readonly width: number;
  readonly columnKey: string;
  readonly columnWidth: number;
}

export type DatagridColumnGroupOrderChange = readonly string[];

export interface DatagridSort {
  readonly key: string;
  readonly direction: Exclude<DatagridSortDirection, null>;
}

export interface DatagridSortChange {
  readonly key: string;
  readonly direction: DatagridSortDirection;
}

export type DatagridSortsChange = readonly DatagridSort[];

export interface DatagridColumnFilter<T extends object> {
  readonly key: string;
  readonly column: DatagridColumn<T>;
  readonly values: readonly unknown[];
  readonly condition?: DatagridDynamicFilterCondition;
}

export type DatagridFilterChange<T extends object> = readonly DatagridColumnFilter<T>[];

export interface DatagridDynamicFilterCondition {
  readonly operator: DatagridDynamicFilterOperator;
  readonly value?: unknown;
  readonly valueTo?: unknown;
}

export interface DatagridColumnResize {
  readonly key: string;
  readonly width: number | 'auto';
}

export type DatagridColumnOrderChange = readonly string[];

export interface DatagridColumnVisibilityChange {
  readonly visibleKeys: readonly string[];
  readonly hiddenKeys: readonly string[];
}

export type DatagridGroupBy = readonly string[];

export interface DatagridGroupSort {
  readonly key: string;
  readonly direction: DatagridGroupSortDirection;
}

export interface DatagridPageChange {
  readonly page: number;
  readonly pageSize: number;
  readonly totalRows: number;
  readonly totalPages: number;
}

export type DatagridVirtualPageDirection = 'previous' | 'next';
export type DatagridVirtualPageTrigger = 'button' | 'scroll' | 'api';

export interface DatagridVirtualPageRequest {
  readonly page: number;
  readonly pageSize: number;
  readonly direction: DatagridVirtualPageDirection;
  readonly trigger: DatagridVirtualPageTrigger;
}

export interface DatagridSelectionChange<T extends object> {
  readonly selectedRows: readonly T[];
  readonly changedRow: T | null;
  readonly selected: boolean;
}

export interface DatagridRowOrderChange<T extends object> {
  readonly row: T;
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly rows: readonly T[];
}

export type DatagridTrackBy<T extends object> = (row: T, index: number) => unknown;
export type DatagridRowLabel<T extends object> = (row: T, index: number) => string;
export type DatagridRowDetailExpandable<T extends object> = (row: T, index: number) => boolean;
export type DatagridNewRowFactory<T extends object> = () => T;

export interface DatagridEditLabels {
  readonly actions: string;
  readonly edit: string;
  readonly save: string;
  readonly cancel: string;
}

export interface DatagridCellEditCommit<T extends object> {
  readonly row: T;
  readonly rowIndex: number;
  readonly column: DatagridColumn<T>;
  readonly key: string;
  readonly previousValue: unknown;
  readonly value: unknown;
}

export interface DatagridRowEditCommit<T extends object> {
  readonly row: T;
  readonly rowIndex: number;
  readonly changes: Readonly<Record<string, unknown>>;
}

export interface DatagridNewRowCommit<T extends object> {
  readonly row: T;
  readonly rowIndex: number;
  readonly column: DatagridColumn<T>;
  readonly key: string;
  readonly value: unknown;
}

export interface DatagridRowEvent<T extends object> {
  readonly row: T;
  readonly rowIndex: number;
  readonly nativeEvent: ReactMouseEvent<HTMLDivElement>;
}

export interface DatagridCellEvent<T extends object> extends DatagridRowEvent<T> {
  readonly column: DatagridColumn<T>;
  readonly value: unknown;
}

export interface DatagridNestedGridConfig<T extends object, C extends object = Record<string, unknown>> {
  readonly getRows: (row: T) => readonly C[];
  readonly columns: readonly DatagridColumn<C>[];
  readonly props?: Omit<DatagridNestedGridProps<C>, 'data' | 'rows' | 'columns'>;
  readonly height?: number;
}

/** Serializable subset accepted by nested grids without recursively nesting their type. */
export interface DatagridNestedGridProps<T extends object> {
  readonly selectionMode?: DatagridSelectionMode;
  readonly stripedRows?: boolean;
  readonly showVerticalLines?: boolean;
  readonly rowHeight?: number;
  readonly headerHeight?: number;
  readonly emptyMessage?: string;
  readonly ariaLabel?: string;
}

export interface DatagridFilterPanelConfig {
  readonly position?: 'left' | 'right';
  readonly width?: number;
  readonly minWidth?: number;
  readonly maxWidth?: number;
  readonly pinned?: boolean;
  readonly fields: readonly FilterField[];
  readonly expression: FilterGroup;
}

export interface DatagridEditDecision {
  readonly accepted: boolean;
  readonly message?: string;
}

export interface DatagridEditCancel<T extends object> {
  readonly mode: Exclude<DatagridEditMode, 'none'>;
  readonly row: T;
  readonly rowIndex: number;
  readonly key?: string;
}

export interface DatagridValidationError {
  /** Field validators from core-data may identify the field instead of a rule name. */
  readonly rule?: string;
  readonly message: string;
}

export type DatagridValidatorFn<T extends object = object> = (
  value: unknown,
  row: T,
  column: DatagridColumn<T>,
) => string | boolean | null | undefined | readonly (string | DatagridValidationError)[];

export interface DatagridValidatorRule<T extends object = object> {
  readonly name?: string;
  readonly validator: DatagridValidatorFn<T>;
  readonly message?: string;
}

export type DatagridValidator<T extends object = object> =
  | DatagridValidatorFn<T>
  | DatagridValidatorRule<T>;

export interface DatagridValidationRules<T extends object = object> {
  readonly required?: boolean | string;
  readonly requiredMessage?: string;
  readonly min?: number | Date | string;
  readonly max?: number | Date | string;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: string | RegExp;
  readonly patternMessage?: string;
  readonly custom?: DatagridValidator<T> | readonly DatagridValidator<T>[];
}

export interface DatagridValidationEvent<T extends object = object> {
  readonly row: T;
  readonly rowIndex: number;
  readonly column: DatagridColumn<T>;
  readonly key: string;
  readonly value: unknown;
  readonly errors: readonly DatagridValidationError[];
}

export interface DatagridRowTemplateContext<T extends object = object> {
  readonly $implicit: T;
  readonly row: T;
  readonly rowIndex: number;
  readonly columns: readonly DatagridColumn<T>[];
  readonly isEditing: boolean;
  readonly isSelected: boolean;
  readonly isExpanded: boolean;
}

export type DatagridCellTemplate<T extends object> = (
  context: DatagridCellTemplateContext<T>,
) => ReactNode;

export type DatagridCellEditor<T extends object> = (
  context: DatagridCellEditorContext<T>,
) => ReactNode;

export type DatagridRowDetail<T extends object> = (
  context: DatagridRowDetailContext<T>,
) => ReactNode;

export type DatagridDetailPane<T extends object> = (
  context: DatagridDetailPaneContext<T>,
) => ReactNode;

export type DatagridLeadingRowActions<T extends object> = (
  context: DatagridLeadingRowActionsContext<T>,
) => ReactNode;

export type DatagridRowTemplate<T extends object> = (
  context: DatagridRowTemplateContext<T>,
) => ReactNode;

export type DatagridDataContextValue<T> = T | (() => T);

export type DatagridDataContextStateDisplay = 'none' | 'row' | 'cell' | 'row-and-cell';

export interface DatagridDataContextOptions<T extends object> {
  readonly synchronizeSelection?: boolean;
  readonly stateDisplay?: DatagridDataContextStateDisplay;
  readonly validationDisplay?: DatagridDataContextStateDisplay;
  readonly blockInvalidSave?: boolean;
  readonly toolbarActions?: boolean;
  readonly cascadeDelete?: boolean;
  readonly newRowDefaults?: Partial<T> | (() => Partial<T>);
}

export type DatagridRecordState = 'added' | 'modified' | 'deleted' | null;

export interface DatagridTrackedRecord<T extends object> {
  readonly data: T;
  readonly state: string;
  readonly _modifiedFields?: ReadonlyMap<keyof T, unknown>;
}

export interface DatagridDataContext<T extends object> {
  readonly idField: keyof T;
  readonly data: readonly T[] | (() => readonly T[]);
  readonly loading?: DatagridDataContextValue<boolean>;
  readonly dirty?: DatagridDataContextValue<boolean>;
  readonly resetVersion?: DatagridDataContextValue<number>;
  readonly navigationRecords?:
    | readonly DatagridTrackedRecord<T>[]
    | (() => readonly DatagridTrackedRecord<T>[]);
  readonly current?: DatagridDataContextValue<{ readonly data: T } | null>;
  readonly allValidationErrors?: DatagridDataContextValue<
    ReadonlyMap<string, readonly DatagridValidationError[]>
  >;
  readonly allValid?: DatagridDataContextValue<boolean>;
  readonly subscribe?: (listener: () => void) => () => void;
  readonly getSnapshot?: () => unknown;
  findRecord(id: string): DatagridTrackedRecord<T> | null;
  add(data: Partial<T>): string;
  patch(id: string, data: Partial<T>): void;
  delete(id: string, cascade?: boolean): void;
  discardChanges(): void;
  save(): Promise<unknown>;
  skip(index: number): boolean;
}

export interface DatagridHandle<T extends object> {
  sortBy(key: string, direction: DatagridSortDirection): void;
  filterBy(key: string, values: readonly unknown[]): void;
  filterByCondition(key: string, condition: DatagridDynamicFilterCondition | null): void;
  setRowDetailExpanded(row: T, expanded: boolean): void;
  toggleRowDetails(row: T): void;
  clearFilters(): void;
  goToPage(page: number): void;
  previousPage(): void;
  nextPage(): void;
  clearSelection(): void;
  addDataContextRow(): void;
  deleteDataContextSelection(): void;
  saveDataContextChanges(): void;
  discardDataContextChanges(): void;
  autoSizeColumn(key: string): void;
  autoSizeColumns(): void;
  resetColumnOrder(): void;
  setColumnVisible(key: string, visible: boolean): void;
  setGrouping(keys: readonly string[]): void;
  clearGrouping(): void;
  startCellEdit(rowIndex: number, key: string): void;
  startRowEdit(rowIndex: number, focusKey?: string): void;
  commitCellEdit(restoreFocus?: boolean): void;
  commitRowEdit(): void;
  cancelEditing(): void;
  undo(): void;
  redo(): void;
  fillDown(): void;
}

export type DatagridRowClassName<T extends object> =
  | string
  | readonly string[]
  | Readonly<Record<string, boolean>>
  | ((row: T, rowIndex: number) => string | readonly string[] | Readonly<Record<string, boolean>> | null | undefined)
  | null;

export type DatagridRowStyle<T extends object> =
  | CSSProperties
  | string
  | ((row: T, rowIndex: number) => CSSProperties | string | null | undefined)
  | null;

export type DatagridCellClassName<T extends object> = (
  context: DatagridCellContext<T>,
) => string | readonly string[] | Readonly<Record<string, boolean>> | null | undefined;

export type DatagridCellStyle<T extends object> = (
  context: DatagridCellContext<T>,
) => CSSProperties | null | undefined;
