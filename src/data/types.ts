// ============================================================================
// Filter Types
// ============================================================================

export enum FilterOperator {
  Equal = '=',
  NotEqual = '!=',
  LessThan = '<',
  LessThanOrEqual = '<=',
  GreaterThan = '>',
  GreaterThanOrEqual = '>=',
  Contains = 'CONTAINS',
  StartsWith = 'STARTSWITH',
  EndsWith = 'ENDSWITH',
  IsNull = 'IS NULL',
  IsNotNull = 'IS NOT NULL',
  IsBlank = 'IS BLANK',
  IsNotBlank = 'IS NOT BLANK',
}

export interface FilterCondition {
  field: string;
  operator: FilterOperator | string;
  value?: unknown;
}

export interface FilterExpression {
  logic?: 'and' | 'or';
  filters?: FilterCondition[];
  groups?: FilterExpression[];
}

// ============================================================================
// Query and Response Types
// ============================================================================

export interface DataSourceQueryParams {
  /** Search term to search across fields */
  searchTerm?: string;
  /** Comma-separated list of fields to search in */
  searchFields?: string;
  /** Sort expression (e.g., 'name:asc', 'date:desc', 'price:asc,name:desc') */
  sortBy?: string;
  /** Comma-separated list of fields to return */
  fields?: string;
  /** Number of items per page */
  pageSize?: number;
  /** Page number (1-based) */
  pageNumber?: number;
  /**
   * Filter expression - supports both string and JSON formats:
   * - String: "(status = 'Paid' AND amount > 1000) OR status = 'Pending'"
   * - JSON: {"logic":"and","filters":[{"field":"status","operator":"eq","value":"Paid"}]}
   */
  filter?: string | FilterExpression;
  /** Comma-separated list of navigation properties to include */
  include?: string;
  /** Custom query parameters to append to the URL */
  custom?: Record<string, string | number | boolean>;
}

export interface DataSourcePagedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  data: T[];
  hasPrevious: boolean;
  hasNext: boolean;
}

// ============================================================================
// Data Source Options and Interceptor
// ============================================================================

export interface HttpRequestContext {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
}

/**
 * Middleware-style interceptor. Call `next(ctx)` to continue the chain.
 * Can modify headers/url/body before the request, or transform the response.
 */
export type DataSourceInterceptor = (
  context: HttpRequestContext,
  next: (ctx: HttpRequestContext) => Promise<unknown>,
) => Promise<unknown>;

export interface DataSourceOptions<T> {
  /** Base URL for API calls */
  baseUrl?: string;
  /** API endpoint path */
  endpoint?: string;
  /** Initial data for array-based sources */
  data?: T[];
  /** Function to extract ID from an item */
  idField?: keyof T | ((item: T) => string);
  /** Default page size for pagination */
  pageSize?: number;
  /** Custom headers for HTTP requests */
  headers?: Record<string, string>;
  /** Interceptors applied to every HTTP request. Executed in order (first to last). */
  interceptors?: DataSourceInterceptor[];
  /**
   * Maps the raw API response for list endpoints (read, search) into the
   * standard `DataSourcePagedResponse<T>` shape.
   */
  mapResponse?: (raw: unknown) => DataSourcePagedResponse<T>;
  /**
   * Maps the raw API response for single-item endpoints (getById, create,
   * update, patch) into the expected `T` shape.
   */
  mapItem?: (raw: unknown) => T;
}

// ============================================================================
// Batch Operation Types
// ============================================================================

export interface BatchOperation<T> {
  operation: 'create' | 'update' | 'delete';
  data: Partial<T> | { id: string };
}

export interface BatchOperationRequest<T> {
  operations: BatchOperation<T>[];
}

export interface BatchOperationResult<T> {
  operation: 'create' | 'update' | 'delete';
  success: boolean;
  data?: T;
  error?: string;
}

export interface BatchOperationResponse<T> {
  results: BatchOperationResult<T>[];
  totalCreated: number;
  totalUpdated: number;
  totalDeleted: number;
  totalFailed: number;
}

// ============================================================================
// Sync Payload
// ============================================================================

export interface SyncPayload {
  [key: string]: unknown;
  _state?: 'New' | 'Modified' | 'Deleted' | 'Unchanged';
  _modifiedFields?: string[];
}

// ============================================================================
// Composable Data Source Interfaces
// ============================================================================

export interface IReadableDataSource<T> {
  read(params?: DataSourceQueryParams): Promise<DataSourcePagedResponse<T>>;
  getById(id: string): Promise<T>;
  search(
    query: string,
    searchFields?: string[],
    params?: DataSourceQueryParams,
  ): Promise<DataSourcePagedResponse<T>>;
}

export interface IWritableDataSource<T> {
  create(item: Partial<T>): Promise<T>;
  update(item: Partial<T> & { id?: string }): Promise<T>;
  patch(id: string, changes: Partial<T>): Promise<T>;
  delete(item: T | { id: string }): Promise<void>;
}

export interface IBatchDataSource<T> {
  batchCreate(items: Partial<T>[]): Promise<T[]>;
  batchUpdate(items: (Partial<T> & { id?: string })[]): Promise<T[]>;
  batchDelete(items: (T | { id: string })[]): Promise<void>;
  batch(operations: BatchOperationRequest<T>): Promise<BatchOperationResponse<T>>;
}

export interface ISyncableDataSource<T> {
  sync(data: SyncPayload[]): Promise<T | T[]>;
}

export interface IDataSource<T>
  extends IReadableDataSource<T>,
    IWritableDataSource<T>,
    IBatchDataSource<T>,
    ISyncableDataSource<T> {}

/**
 * The minimum source shape required by DataContext. Detail sources are often
 * read-only, so write, batch, and sync capabilities remain optional here.
 */
export type FlexibleDataSource<T> = IReadableDataSource<T> &
  Partial<IWritableDataSource<T>> &
  Partial<IBatchDataSource<T>> &
  Partial<ISyncableDataSource<T>>;

// ============================================================================
// DataContext Events, Plugins, Validation, and Change Inspection
// ============================================================================

export type DataContextEventType =
  | 'add'
  | 'update'
  | 'delete'
  | 'load'
  | 'clear'
  | 'discard'
  | 'save'
  | 'undo'
  | 'redo';

export interface DataContextEvent<T> {
  type: DataContextEventType;
  recordId?: string;
  data?: Partial<T>;
  previousState?: import('./record-state.js').RecordState;
  newState?: import('./record-state.js').RecordState;
  timestamp: number;
}

export interface DataContextPlugin<T> {
  onBeforeAdd?(data: Partial<T>): Partial<T>;
  onAfterAdd?(recordId: string, data: T): void;
  onBeforeUpdate?(id: string, data: Partial<T>): Partial<T>;
  onAfterUpdate?(id: string, data: T): void;
  onBeforeDelete?(id: string): boolean;
  onAfterDelete?(id: string): void;
  onBeforeSave?(payloads: SyncPayload[]): SyncPayload[];
  onAfterSave?(payloads: SyncPayload[]): void;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export type FieldValidator<T> = (value: unknown, record: T) => string | null;
export type RecordValidator<T> = (record: T) => ValidationError[];

export interface DataContextLogger {
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

export interface ChangeEntry<T> {
  data: T;
  state: import('./record-state.js').RecordState;
  modifiedFields: string[];
  children?: Record<string, ChangeEntry<Record<string, unknown>>[]>;
}
