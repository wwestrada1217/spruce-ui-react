// ─── Record State & Tracking ──────────────────────────────────────────────────
export { RecordState } from './record-state.js';
export type { TrackedRecord } from './tracked-record.js';

// ─── Types ────────────────────────────────────────────────────────────────────
export { FilterOperator } from './types.js';
export type {
  FilterCondition,
  FilterExpression,
  DataSourceQueryParams,
  DataSourcePagedResponse,
  HttpRequestContext,
  DataSourceInterceptor,
  DataSourceOptions,
  BatchOperation,
  BatchOperationRequest,
  BatchOperationResult,
  BatchOperationResponse,
  SyncPayload,
  IDataSource,
  IReadableDataSource,
  IWritableDataSource,
  IBatchDataSource,
  ISyncableDataSource,
} from './types.js';

// ─── Filter Utilities ─────────────────────────────────────────────────────────
export { FilterBuilder, Filter, evaluateFilterExpression, parseStringFilter } from './filter.js';

// ─── Data Sources ─────────────────────────────────────────────────────────────
export { ArrayDataSource, createArrayDataSource } from './array-data-source.js';
export { ApiDataSource, createApiDataSource } from './api-data-source.js';
export { HttpDataSource, createHttpDataSource } from './http-data-source.js';
export type { HttpDataSourceOptions } from './http-data-source.js';

// ─── DataContext ──────────────────────────────────────────────────────────────
export { DataContext, createDataContext } from './data-context.js';
export type {
  DataContextConfig,
  DetailDefinition,
  DetailDefinitions,
  DetailNames,
  ExtractArrayElement,
  RecordHandle,
} from './data-context.js';

// ─── React Hooks ──────────────────────────────────────────────────────────────
export {
  useDataContext,
  useDataContextLoad,
  useDataSource,
} from './use-data-context.js';

// ─── Utilities ────────────────────────────────────────────────────────────────
export { newGUID, deepEqual } from './type-utils.js';
export { generateId, getItemId, extractId, hasIdProperty } from './utils.js';
