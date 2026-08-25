import type { CSSProperties, ReactNode } from 'react';

export type DatagridexSortDirection = 'asc' | 'desc' | null;
export type DatagridexSortMode = 'client' | 'manual';
export type DatagridexSortIndicatorVisibility = 'hover' | 'always';
export type DatagridexFilterIndicatorVisibility = 'hover' | 'always';
export type DatagridexFilterMode = 'client' | 'manual';
export type DatagridexFilterVariant = 'values' | 'dynamic';
export type DatagridexFilterDataType = 'text' | 'number' | 'date' | 'boolean';
export type DatagridexDynamicFilterOperator =
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
export type DatagridexCellAlignment = 'start' | 'center' | 'end';
export type DatagridexEditMode = 'none' | 'cell' | 'row';
export type DatagridexEditorType =
  | 'text'
  | 'number'
  | 'checkbox'
  | 'date'
  | 'select'
  | 'combobox'
  | 'grid-combobox'
  | 'custom';
export type DatagridexSelectionMode = 'none' | 'single' | 'multiple';
export type DatagridexAggregateType = 'sum' | 'count' | 'avg' | 'min' | 'max';
export type DatagridexAggregateScope = 'group' | 'footer';
export type DatagridexColumnPin = 'left' | 'right';
export type DatagridexGroupSortDirection = 'asc' | 'desc';
export type DatagridexPaginationType = 'compact' | 'full';
export type DatagridexColumnWidth = number | 'auto' | `${number}%`;

export interface DatagridexColumnMenuItem {
  readonly label: string;
  readonly icon?: string;
  readonly disabled?: boolean;
  readonly separator?: boolean;
  readonly command?: () => void;
  readonly children?: readonly DatagridexColumnMenuItem[];
}

export interface DatagridexCellContext<T extends object> {
  readonly value: unknown;
  readonly row: T;
  readonly rowIndex: number;
  readonly column: DatagridexColumn<T>;
}

export interface DatagridexCellTemplateContext<T extends object>
  extends DatagridexCellContext<T> {
  /** Raw cell value exposed as the render prop's default binding. */
  readonly $implicit: unknown;
  readonly formattedValue: string;
}

export interface DatagridexCellEditorContext<T extends object> extends DatagridexCellContext<T> {
  /** Current draft value exposed as the render prop's default binding. */
  readonly $implicit: unknown;
  readonly originalValue: unknown;
  readonly invalid: boolean;
  readonly errors: readonly DatagridexValidationError[];
  readonly firstError: string | null;
  readonly update: (value: unknown) => void;
  readonly commit: () => void;
  readonly cancel: () => void;
}

export interface DatagridexChoiceOption {
  readonly label: string;
  readonly value: unknown;
  readonly disabled?: boolean;
}

export interface DatagridexEditorOptions {
  readonly options?: readonly DatagridexChoiceOption[] | unknown;
  readonly columns?: readonly DatagridexColumn<Record<string, unknown>>[];
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

export interface DatagridexRowSpanContext<T extends object> extends DatagridexCellContext<T> {
  readonly rows: readonly T[];
}

export interface DatagridexRowDetailContext<T extends object> {
  readonly $implicit: T;
  readonly row: T;
  readonly rowIndex: number;
}

export interface DatagridexDetailPaneContext<T extends object> {
  readonly $implicit: T;
  readonly row: T;
  readonly rowIndex: number;
  readonly close: () => void;
}

export interface DatagridexLeadingRowActionsContext<T extends object> {
  readonly $implicit: T;
  readonly row: T;
  readonly rowIndex: number;
  readonly detailPaneOpen: boolean;
  readonly toggleDetailPane: () => void;
}

export interface DatagridexAggregateContext<T extends object> {
  readonly values: readonly unknown[];
  readonly rows: readonly T[];
  readonly column: DatagridexColumn<T>;
  readonly scope: DatagridexAggregateScope;
}

export interface DatagridexAggregateValueContext<T extends object>
  extends DatagridexAggregateContext<T> {
  readonly value: unknown;
}

export interface DatagridexBuiltInAggregate<T extends object> {
  readonly type: DatagridexAggregateType;
  readonly label?: string;
  readonly valueFormatter?: (context: DatagridexAggregateValueContext<T>) => string;
}

export interface DatagridexCustomAggregate<T extends object> {
  readonly type: 'custom';
  readonly aggregate: (context: DatagridexAggregateContext<T>) => unknown;
  readonly label?: string;
  readonly valueFormatter?: (context: DatagridexAggregateValueContext<T>) => string;
}

export type DatagridexAggregate<T extends object> =
  | DatagridexAggregateType
  | DatagridexBuiltInAggregate<T>
  | DatagridexCustomAggregate<T>;

export interface DatagridexColumn<T extends object = Record<string, unknown>> {
  readonly key: string;
  readonly header: string;
  readonly valueGetter?: (row: T) => unknown;
  readonly valueFormatter?: (context: DatagridexCellContext<T>) => string;
  readonly sortComparator?: (
    leftValue: unknown,
    rightValue: unknown,
    leftRow: T,
    rightRow: T,
  ) => number;
  readonly sortable?: boolean;
  readonly filterable?: boolean;
  readonly filterVariant?: DatagridexFilterVariant;
  readonly filterDataType?: DatagridexFilterDataType;
  readonly filterValueFormatter?: (value: unknown, row: T) => string;
  readonly filterPredicate?: (
    value: unknown,
    selectedValues: readonly unknown[],
    row: T,
  ) => boolean;
  readonly resizable?: boolean;
  readonly reorderable?: boolean;
  readonly pinned?: DatagridexColumnPin;
  readonly width?: DatagridexColumnWidth;
  readonly flex?: number;
  readonly minWidth?: number;
  readonly maxWidth?: number;
  readonly align?: DatagridexCellAlignment;
  readonly wrap?: boolean;
  readonly editable?: boolean | ((row: T) => boolean);
  readonly readonly?: boolean | ((row: T) => boolean);
  readonly editorType?: DatagridexEditorType;
  readonly editorOptions?: DatagridexEditorOptions;
  readonly editorValueFormatter?: (value: unknown, row: T) => string;
  readonly valueParser?: (value: unknown, row: T) => unknown;
  readonly required?: boolean | string;
  readonly min?: number | Date | string;
  readonly max?: number | Date | string;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: string | RegExp;
  readonly validator?: DatagridexValidator<T> | readonly DatagridexValidator<T>[];
  readonly validators?: readonly DatagridexValidator<T>[];
  readonly rules?: DatagridexValidationRules<T>;
  readonly validationMessages?: Readonly<Record<string, string>>;
  readonly aggregate?: DatagridexAggregate<T>;
  readonly rowSpan?: number | ((context: DatagridexRowSpanContext<T>) => number);
  readonly menuItems?: readonly DatagridexColumnMenuItem[];
}

export interface DatagridexColumnGroup {
  readonly key: string;
  readonly header: string;
  readonly columnKeys: readonly string[];
  readonly resizable?: boolean;
  readonly reorderable?: boolean;
}

export interface DatagridexColumnGroupResize {
  readonly key: string;
  readonly width: number;
  readonly columnKey: string;
  readonly columnWidth: number;
}

export type DatagridexColumnGroupOrderChange = readonly string[];

export interface DatagridexSort {
  readonly key: string;
  readonly direction: Exclude<DatagridexSortDirection, null>;
}

export interface DatagridexSortChange {
  readonly key: string;
  readonly direction: DatagridexSortDirection;
}

export type DatagridexSortsChange = readonly DatagridexSort[];

export interface DatagridexColumnFilter<T extends object> {
  readonly key: string;
  readonly column: DatagridexColumn<T>;
  readonly values: readonly unknown[];
  readonly condition?: DatagridexDynamicFilterCondition;
}

export type DatagridexFilterChange<T extends object> = readonly DatagridexColumnFilter<T>[];

export interface DatagridexDynamicFilterCondition {
  readonly operator: DatagridexDynamicFilterOperator;
  readonly value?: unknown;
  readonly valueTo?: unknown;
}

export interface DatagridexColumnResize {
  readonly key: string;
  readonly width: number | 'auto';
}

export type DatagridexColumnOrderChange = readonly string[];

export interface DatagridexColumnVisibilityChange {
  readonly visibleKeys: readonly string[];
  readonly hiddenKeys: readonly string[];
}

export type DatagridexGroupBy = readonly string[];

export interface DatagridexGroupSort {
  readonly key: string;
  readonly direction: DatagridexGroupSortDirection;
}

export interface DatagridexPageChange {
  readonly page: number;
  readonly pageSize: number;
  readonly totalRows: number;
  readonly totalPages: number;
}

export type DatagridexVirtualPageDirection = 'previous' | 'next';
export type DatagridexVirtualPageTrigger = 'button' | 'scroll' | 'api';

export interface DatagridexVirtualPageRequest {
  readonly page: number;
  readonly pageSize: number;
  readonly direction: DatagridexVirtualPageDirection;
  readonly trigger: DatagridexVirtualPageTrigger;
}

export interface DatagridexSelectionChange<T extends object> {
  readonly selectedRows: readonly T[];
  readonly changedRow: T | null;
  readonly selected: boolean;
}

export interface DatagridexRowOrderChange<T extends object> {
  readonly row: T;
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly rows: readonly T[];
}

export type DatagridexTrackBy<T extends object> = (row: T, index: number) => unknown;
export type DatagridexRowLabel<T extends object> = (row: T, index: number) => string;
export type DatagridexRowDetailExpandable<T extends object> = (row: T, index: number) => boolean;
export type DatagridexNewRowFactory<T extends object> = () => T;

export interface DatagridexEditLabels {
  readonly actions: string;
  readonly edit: string;
  readonly save: string;
  readonly cancel: string;
}

export interface DatagridexCellEditCommit<T extends object> {
  readonly row: T;
  readonly rowIndex: number;
  readonly column: DatagridexColumn<T>;
  readonly key: string;
  readonly previousValue: unknown;
  readonly value: unknown;
}

export interface DatagridexRowEditCommit<T extends object> {
  readonly row: T;
  readonly rowIndex: number;
  readonly changes: Readonly<Record<string, unknown>>;
}

export interface DatagridexNewRowCommit<T extends object> {
  readonly row: T;
  readonly rowIndex: number;
  readonly column: DatagridexColumn<T>;
  readonly key: string;
  readonly value: unknown;
}

export interface DatagridexEditCancel<T extends object> {
  readonly mode: Exclude<DatagridexEditMode, 'none'>;
  readonly row: T;
  readonly rowIndex: number;
  readonly key?: string;
}

export interface DatagridexValidationError {
  /** Field validators from core-data may identify the field instead of a rule name. */
  readonly rule?: string;
  readonly message: string;
}

export type DatagridexValidatorFn<T extends object = object> = (
  value: unknown,
  row: T,
  column: DatagridexColumn<T>,
) => string | boolean | null | undefined | readonly (string | DatagridexValidationError)[];

export interface DatagridexValidatorRule<T extends object = object> {
  readonly name?: string;
  readonly validator: DatagridexValidatorFn<T>;
  readonly message?: string;
}

export type DatagridexValidator<T extends object = object> =
  | DatagridexValidatorFn<T>
  | DatagridexValidatorRule<T>;

export interface DatagridexValidationRules<T extends object = object> {
  readonly required?: boolean | string;
  readonly requiredMessage?: string;
  readonly min?: number | Date | string;
  readonly max?: number | Date | string;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: string | RegExp;
  readonly patternMessage?: string;
  readonly custom?: DatagridexValidator<T> | readonly DatagridexValidator<T>[];
}

export interface DatagridexValidationEvent<T extends object = object> {
  readonly row: T;
  readonly rowIndex: number;
  readonly column: DatagridexColumn<T>;
  readonly key: string;
  readonly value: unknown;
  readonly errors: readonly DatagridexValidationError[];
}

export interface DatagridexRowTemplateContext<T extends object = object> {
  readonly $implicit: T;
  readonly row: T;
  readonly rowIndex: number;
  readonly columns: readonly DatagridexColumn<T>[];
  readonly isEditing: boolean;
  readonly isSelected: boolean;
  readonly isExpanded: boolean;
}

export type DatagridexCellTemplate<T extends object> = (
  context: DatagridexCellTemplateContext<T>,
) => ReactNode;

export type DatagridexCellEditor<T extends object> = (
  context: DatagridexCellEditorContext<T>,
) => ReactNode;

export type DatagridexRowDetail<T extends object> = (
  context: DatagridexRowDetailContext<T>,
) => ReactNode;

export type DatagridexDetailPane<T extends object> = (
  context: DatagridexDetailPaneContext<T>,
) => ReactNode;

export type DatagridexLeadingRowActions<T extends object> = (
  context: DatagridexLeadingRowActionsContext<T>,
) => ReactNode;

export type DatagridexRowTemplate<T extends object> = (
  context: DatagridexRowTemplateContext<T>,
) => ReactNode;

export type DatagridexDataContextValue<T> = T | (() => T);

export type DatagridexDataContextStateDisplay = 'none' | 'row' | 'cell' | 'row-and-cell';

export interface DatagridexDataContextOptions<T extends object> {
  readonly synchronizeSelection?: boolean;
  readonly stateDisplay?: DatagridexDataContextStateDisplay;
  readonly validationDisplay?: DatagridexDataContextStateDisplay;
  readonly blockInvalidSave?: boolean;
  readonly toolbarActions?: boolean;
  readonly cascadeDelete?: boolean;
  readonly newRowDefaults?: Partial<T> | (() => Partial<T>);
}

export type DatagridexRecordState = 'added' | 'modified' | 'deleted' | null;

export interface DatagridexTrackedRecord<T extends object> {
  readonly data: T;
  readonly state: string;
  readonly _modifiedFields?: ReadonlyMap<keyof T, unknown>;
}

export interface DatagridexDataContext<T extends object> {
  readonly idField: keyof T;
  readonly data: readonly T[] | (() => readonly T[]);
  readonly loading?: DatagridexDataContextValue<boolean>;
  readonly dirty?: DatagridexDataContextValue<boolean>;
  readonly resetVersion?: DatagridexDataContextValue<number>;
  readonly navigationRecords?:
    | readonly DatagridexTrackedRecord<T>[]
    | (() => readonly DatagridexTrackedRecord<T>[]);
  readonly current?: DatagridexDataContextValue<{ readonly data: T } | null>;
  readonly allValidationErrors?: DatagridexDataContextValue<
    ReadonlyMap<string, readonly DatagridexValidationError[]>
  >;
  readonly allValid?: DatagridexDataContextValue<boolean>;
  readonly subscribe?: (listener: () => void) => () => void;
  readonly getSnapshot?: () => unknown;
  findRecord(id: string): DatagridexTrackedRecord<T> | null;
  add(data: Partial<T>): string;
  patch(id: string, data: Partial<T>): void;
  delete(id: string, cascade?: boolean): void;
  discardChanges(): void;
  save(): Promise<unknown>;
  skip(index: number): boolean;
}

export interface DatagridexHandle<T extends object> {
  sortBy(key: string, direction: DatagridexSortDirection): void;
  filterBy(key: string, values: readonly unknown[]): void;
  filterByCondition(key: string, condition: DatagridexDynamicFilterCondition | null): void;
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
}

export type DatagridexRowClassName<T extends object> =
  | string
  | readonly string[]
  | Readonly<Record<string, boolean>>
  | ((row: T, rowIndex: number) => string | readonly string[] | Readonly<Record<string, boolean>> | null | undefined)
  | null;

export type DatagridexRowStyle<T extends object> =
  | CSSProperties
  | string
  | ((row: T, rowIndex: number) => CSSProperties | string | null | undefined)
  | null;
