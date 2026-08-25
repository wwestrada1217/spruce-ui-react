// ─── Record State & Tracking ──────────────────────────────────────────────────
export { RecordState } from './record-state.js';
export type { FieldChange, TrackedRecord } from './tracked-record.js';
export { DataContextError, DataContextErrorCode } from './errors.js';
export { UndoManager } from './undo-manager.js';
export type { ChangeCommand } from './undo-manager.js';
export { NavigationCursor } from './navigation-cursor.js';
export type { CursorListener, CursorObserver } from './navigation-cursor.js';

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
  FlexibleDataSource,
  DataContextEvent,
  DataContextEventType,
  DataContextPlugin,
  ValidationError,
  FieldValidator,
  RecordValidator,
  DataContextLogger,
  ChangeEntry,
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
  DataContextEventStream,
  DetailDefinition,
  DetailDefinitions,
  DetailNames,
  ExtractArrayElement,
  RecordHandle,
} from './data-context.js';
export { DetailContextManager } from './detail-context-manager.js';
export { createDetailDataSource } from './detail-data-source.js';
export { createContextFormModel } from './form-model.js';
export type { FormModel, ContextFormModelOptions } from './form-model.js';

// ─── NodeStore ───────────────────────────────────────────────────────────────
export {
  NodeStore,
  createNodeStore,
  NodeStoreError,
  NodeStoreErrorCode,
  createFormBridge,
} from './node-store/index.js';
export type {
  AddChildOptions,
  FormBridge,
  FormBridgeOptions,
  NodeStoreRecordState,
  NodeStoreSyncPayload,
  SyncState,
  RelationConfig,
  RelationState,
  StoreConfig,
  StoreNode,
} from './node-store/index.js';

// ─── React Hooks ──────────────────────────────────────────────────────────────
export {
  useDataContext,
  useDataContextLoad,
  useDataSource,
  useDataContextFormModel,
  useFormModel,
  useNodeStore,
  useFormBridge,
} from './use-data-context.js';

// ─── Utilities ────────────────────────────────────────────────────────────────
export { newGUID, deepEqual } from './type-utils.js';
export { generateId, getItemId, extractId, hasIdProperty } from './utils.js';
