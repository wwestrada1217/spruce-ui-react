import type {
  ChangeEntry,
  DataContextEvent,
  DataContextLogger,
  DataContextPlugin,
  FieldValidator,
  FlexibleDataSource,
  RecordValidator,
  SyncPayload,
  ValidationError,
} from './types.js';
import type { IDataSource } from './types.js';
import { RecordState } from './record-state.js';
import type { FieldChange, TrackedRecord } from './tracked-record.js';
import { deepEqual, newGUID } from './type-utils.js';
import { DataContextError, DataContextErrorCode } from './errors.js';
import { DetailContextManager } from './detail-context-manager.js';
import { NavigationCursor, type CursorListener, type CursorObserver } from './navigation-cursor.js';
import { UndoManager, type ChangeCommand } from './undo-manager.js';
import { createContextFormModel, type FormModel } from './form-model.js';

// ============================================================================
// Type Helpers
// ============================================================================

export type DetailNames<T> = {
  [K in keyof T]: NonNullable<T[K]> extends Array<unknown> ? K : never;
}[keyof T];

export type ExtractArrayElement<T, K extends keyof T> =
  NonNullable<T[K]> extends Array<infer U>
    ? U extends Record<string, unknown>
      ? U
      : Record<string, unknown>
    : Record<string, unknown>;

export type DetailDefinitions<T> = {
  [K in DetailNames<T>]?: NonNullable<T[K]> extends Array<infer U>
    ? U extends Record<string, unknown>
      ? DetailDefinition<U>
      : never
    : never;
};

export interface DetailDefinition<
  TDetail extends Record<string, unknown>,
  TDetailDefs extends DetailDefinitions<TDetail> = DetailDefinitions<TDetail>,
> {
  idField: keyof TDetail;
  foreignKey?: keyof TDetail;
  dataSource?: IDataSource<TDetail> | FlexibleDataSource<TDetail>;
  lazyLoad?: boolean;
  fieldValidators?: { [K in keyof TDetail]?: FieldValidator<TDetail> };
  recordValidators?: RecordValidator<TDetail>[];
  details?: { [K in keyof TDetailDefs]: TDetailDefs[K] };
}

export interface DataContextConfig<
  T extends Record<string, unknown>,
  TDetails extends DetailDefinitions<T> = DetailDefinitions<T>,
> {
  idField: keyof T;
  dataSource?: IDataSource<T> | FlexibleDataSource<T>;
  navigateDeletedRecords?: boolean;
  details?: { [K in keyof TDetails]: TDetails[K] };
  defaultFormValue?: Partial<T>;
  plugins?: DataContextPlugin<T>[];
  fieldValidators?: { [K in keyof T]?: FieldValidator<T> };
  recordValidators?: RecordValidator<T>[];
  logger?: DataContextLogger;
  maxUndoSteps?: number;
}

export type { SyncPayload } from './types.js';

export type RecordHandle<
  T extends Record<string, unknown>,
  TDetails extends DetailDefinitions<T> = DetailDefinitions<T>,
> = {
  readonly record: TrackedRecord<T>;
  readonly data: T;
  readonly id: string;
  update(data: Partial<T>): void;
  patch(data: Partial<T>): void;
  delete(cascade?: boolean): void;
  discard(): void;
  getDetail<K extends keyof TDetails>(detailName: K): DataContext<ExtractArrayElement<T, K & keyof T>>;
  dirty(): boolean;
} & { [K in keyof TDetails]: DataContext<ExtractArrayElement<T, K & keyof T>> };

export interface DataContextEventStream<T> {
  subscribe(listener: ((event: DataContextEvent<T>) => void) | { next?(event: DataContextEvent<T>): void; complete?(): void }): () => void;
}

export function createDataContext<
  T extends Record<string, unknown>,
  TDetails extends DetailDefinitions<T> = DetailDefinitions<T>,
>(config: DataContextConfig<T, TDetails>): DataContext<T, TDetails> {
  return new DataContext<T, TDetails>(config);
}

type ChildContext = DataContext<Record<string, unknown>>;
type Options = { emitNavigationChange?: boolean };

export class DataContext<
  T extends Record<string, unknown>,
  TDetails extends DetailDefinitions<T> = DetailDefinitions<T>,
> {
  private _records: TrackedRecord<T>[] = [];
  private readonly listeners = new Set<() => void>();
  private readonly eventListeners = new Set<(event: DataContextEvent<T>) => void>();
  private readonly eventCompletions = new Map<(event: DataContextEvent<T>) => void, () => void>();
  private readonly cursor: NavigationCursor;
  private readonly details: DetailContextManager<ChildContext>;
  private readonly undoManager: UndoManager<T>;
  private readonly plugins: DataContextPlugin<T>[];
  private readonly fieldValidators: { [K in keyof T]?: FieldValidator<T> };
  private readonly recordValidators: RecordValidator<T>[];
  private readonly logger: DataContextLogger;
  private readonly defaultFormValue: T;
  private readonly childSubscriptions = new WeakMap<ChildContext, () => void>();
  private recordIndexMap = new Map<string, number>();
  private _currentIndex = -1;
  private _navigateDeletedRecords: boolean;
  private _resetVersion = 0;
  private _version = 0;
  private _loading = 0;
  private _lastError: Error | null = null;
  private loadToken = 0;
  private disposed = false;
  private foreignKey?: keyof T;
  private parentRecordId?: string;
  private _formModel?: FormModel<T>;

  readonly idField: keyof T;
  readonly dataSource?: IDataSource<T> | FlexibleDataSource<T>;
  readonly events$: DataContextEventStream<T>;

  constructor(config: DataContextConfig<T, TDetails>) {
    this.idField = config.idField;
    this.dataSource = config.dataSource;
    this._navigateDeletedRecords = config.navigateDeletedRecords ?? false;
    this.plugins = config.plugins ?? [];
    this.fieldValidators = config.fieldValidators ?? {};
    this.recordValidators = config.recordValidators ?? [];
    this.logger = config.logger ?? console;
    this.defaultFormValue = { ...(config.defaultFormValue ?? {}) } as T;
    this.undoManager = new UndoManager<T>(config.maxUndoSteps ?? 50);
    this.events$ = { subscribe: (listener) => this.subscribeEvents(listener) };

    const childDefinitions = config.details
      ? (Object.entries(config.details)
          .filter(([, definition]) => !!definition)
          .map(([name, definition]) => [name, definition]) as [
          string,
          DetailDefinition<Record<string, unknown>>,
        ][])
      : [];

    this.details = new DetailContextManager<ChildContext>(
      childDefinitions,
      (_name, definition, parentId) => {
        const child = new DataContext<Record<string, unknown>>({
          idField: definition.idField,
          dataSource: definition.dataSource,
          fieldValidators: definition.fieldValidators,
          recordValidators: definition.recordValidators,
          details: definition.details as DetailDefinitions<Record<string, unknown>>,
        });
        if (definition.foreignKey) {
          child.foreignKey = definition.foreignKey;
          child.parentRecordId = parentId;
        }
        this.childSubscriptions.set(child, child.subscribe(() => this.notify()));
        return child;
      },
    );
    this.details.subscribe(() => this.notify());
    this.cursor = new NavigationCursor(() => this.navigationRecords.length);
    this.cursor.subscribe(() => {
      this._currentIndex = this.cursor.index;
      this.notify();
    });
  }

  // ── React/external-store integration ─────────────────────────────────────

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot(): number {
    return this._version;
  }

  subscribeEvents(listener: ((event: DataContextEvent<T>) => void) | { next?(event: DataContextEvent<T>): void; complete?(): void }): () => void {
    const next = typeof listener === 'function' ? listener : (listener.next ?? (() => undefined));
    this.eventListeners.add(next);
    if (typeof listener !== 'function' && listener.complete) this.eventCompletions.set(next, listener.complete);
    return () => {
      this.eventListeners.delete(next);
      this.eventCompletions.delete(next);
    };
  }

  get navigationChange$(): { subscribe(listener: CursorListener | CursorObserver): () => void } {
    return this.cursor;
  }

  private notify(): void {
    this._version += 1;
    this.listeners.forEach((listener) => listener());
  }

  private emitEvent(event: Omit<DataContextEvent<T>, 'timestamp'>): void {
    if (this.disposed) return;
    const next = { ...event, timestamp: Date.now() } as DataContextEvent<T>;
    this.eventListeners.forEach((listener) => listener(next));
  }

  // ── State accessors ──────────────────────────────────────────────────────

  get records(): TrackedRecord<T>[] { return this._records; }
  get resetVersion(): number { return this._resetVersion; }
  get navigateDeletedRecords(): boolean { return this._navigateDeletedRecords; }
  set navigateDeletedRecords(value: boolean) { this._navigateDeletedRecords = value; this.notify(); }
  get activeRecords(): TrackedRecord<T>[] { return this._records.filter((record) => record.state !== RecordState.Deleted); }
  get navigationRecords(): TrackedRecord<T>[] { return this._navigateDeletedRecords ? this._records : this.activeRecords; }
  get data(): T[] { return this.mergeData(this.inMemoryDetailDefinitions()); }
  get dataWithDetails(): T[] { return this.mergeData(this.details.definitions); }
  get dataSourceLoading(): boolean { return this._loading > 0; }
  get loading(): boolean { return this._loading > 0; }
  get lastError(): Error | null { return this._lastError; }
  get dirty(): boolean {
    if (this._records.some((record) => record.state !== RecordState.Unchanged)) return true;
    let dirty = false;
    this.details.forEach((children) => children.forEach((child) => { if (child.dirty) dirty = true; }));
    return dirty;
  }
  get currentDirty(): boolean {
    const current = this.current;
    if (!current) return false;
    return this.isRecordDirty(current.id);
  }
  get validationErrors(): ValidationError[] { return this.current ? this.validateRecord(this.current.data) : []; }
  get isValid(): boolean { return this.validationErrors.length === 0; }
  get allValidationErrors(): Map<string, ValidationError[]> {
    const result = new Map<string, ValidationError[]>();
    this._records.forEach((record) => {
      if (record.state === RecordState.Deleted) return;
      const errors = this.validateRecord(record.data);
      if (errors.length > 0) result.set(String(record.data[this.idField]), errors);
    });
    return result;
  }
  get allValid(): boolean {
    if (this.allValidationErrors.size > 0) return false;
    let valid = true;
    this.details.forEach((children) => children.forEach((child) => { if (!child.allValid) valid = false; }));
    return valid;
  }
  get canUndo(): boolean { return this.undoManager.canUndo; }
  get canRedo(): boolean { return this.undoManager.canRedo; }
  get count(): number { return this._records.length; }
  get empty(): boolean { return this.count === 0; }
  get hasNext(): boolean { return this.cursor.hasNext; }
  get hasPrevious(): boolean { return this.cursor.hasPrevious; }
  get isLast(): boolean { return this._currentIndex === this.navigationRecords.length - 1; }
  get isFirst(): boolean { return this._currentIndex === 0; }
  get recordNo(): number { return this._currentIndex + 1; }
  get recordIndex(): number { return this._currentIndex; }

  get current(): RecordHandle<T, TDetails> | null {
    const record = this.navigationRecords[this._currentIndex];
    return record ? this.createHandle(record) : null;
  }

  get formModel(): FormModel<T> {
    if (!this._formModel) {
      this._formModel = createContextFormModel<T>({
        defaultValue: this.defaultFormValue,
        current: () => {
          const current = this.current;
          return current ? { id: current.id, data: current.data } : null;
        },
        patch: (id, value) => this.patch(id, value),
        logger: this.logger,
      });
    }
    return this._formModel;
  }

  // ── Detail contexts ──────────────────────────────────────────────────────

  getDetail<K extends keyof TDetails>(parentId: string, detailName: K): DataContext<ExtractArrayElement<T, K & keyof T>> {
    this.details.ensure(parentId);
    const name = String(detailName);
    const context = this.details.get(parentId, name);
    if (!context) {
      throw new DataContextError(
        `Detail '${name}' not configured. Available: [${this.details.definitions.map(([key]) => key).join(', ')}]`,
        DataContextErrorCode.DetailNotConfigured,
        parentId,
      );
    }
    const definition = this.details.definition(name);
    if (definition?.lazyLoad && !this.details.isLoaded(parentId, name) && !this.details.isLoading(parentId, name)) {
      void this.loadDetail(parentId, detailName).catch((error: unknown) => this.logger.error(`Error loading detail '${name}':`, error));
    }
    return context as unknown as DataContext<ExtractArrayElement<T, K & keyof T>>;
  }

  async loadDetail<K extends keyof TDetails>(parentId: string, detailName: K): Promise<void> {
    this.details.ensure(parentId);
    const name = String(detailName);
    const child = this.details.get(parentId, name);
    if (!child?.dataSource || !child.foreignKey) return;
    this.details.markLoading(parentId, name);
    this._loading += 1;
    this.notify();
    try {
      const response = await child.dataSource.read({ filter: { filters: [{ field: String(child.foreignKey), operator: 'eq', value: this.foreignKeyFilterValue(parentId) }] } });
      if (response.data.length > 0) child.loadRecords(response.data);
      else child.clear();
      this.details.markLoaded(parentId, name);
      await Promise.all(child.records.map((record) => child.fetchChildRecords(String(record.data[child.idField]))));
    } catch (error) {
      this.logger.error(`Error fetching detail '${name}':`, error);
    } finally {
      this.details.clearLoading(parentId, name);
      this._loading = Math.max(0, this._loading - 1);
      this.notify();
    }
  }

  getAllDetails(parentId: string): Map<string, DataContext<Record<string, unknown>>> {
    this.details.ensure(parentId);
    return this.details.contextsFor(parentId) ?? new Map();
  }

  dataSlice(start: number, end: number): T[] {
    return this.mergeData(this.inMemoryDetailDefinitions()).slice(start, end);
  }

  private inMemoryDetailDefinitions(): [string, DetailDefinition<Record<string, unknown>>][] {
    return this.details.definitions.filter(([, definition]) => !definition.dataSource);
  }

  private mergeData(definitions: [string, DetailDefinition<Record<string, unknown>>][]): T[] {
    return this.activeRecords.map((record) => {
      if (definitions.length === 0) return record.data;
      const childMap = this.details.contextsFor(String(record.data[this.idField]));
      if (!childMap) return record.data;
      const slices: Partial<T> = {};
      definitions.forEach(([name]) => {
        const child = childMap.get(name);
        if (child) (slices as Record<string, unknown>)[name] = child.data;
      });
      return { ...record.data, ...slices };
    });
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────

  add(data: Partial<T>): string {
    let processed = data;
    this.plugins.forEach((plugin) => { if (plugin.onBeforeAdd) processed = plugin.onBeforeAdd(processed); });
    const raw = { ...processed, [this.idField]: processed[this.idField] ?? newGUID() } as T;
    if (this.foreignKey && this.parentRecordId && !(raw as Record<string, unknown>)[String(this.foreignKey)]) {
      (raw as Record<string, unknown>)[String(this.foreignKey)] = this.parentRecordId;
    }
    const { cleaned, nested } = this.extractNestedDetails(raw);
    const record: TrackedRecord<T> = { data: cleaned, state: RecordState.New, original: undefined, _modifiedFields: undefined };
    this._records = [...this._records, record];
    this.rebuildRecordIndex();
    this.setCursorToLastNavigationRecord();
    const id = String(cleaned[this.idField]);
    this.loadNestedIntoChildContexts(id, nested);
    this.undoManager.push({ type: 'add', recordId: id, before: null, after: record });
    this.emitEvent({ type: 'add', recordId: id, data: cleaned, newState: RecordState.New });
    this.plugins.forEach((plugin) => plugin.onAfterAdd?.(id, cleaned));
    this.notify();
    return id;
  }

  update(id: string, data: Partial<T>): void {
    let processed = data;
    this.plugins.forEach((plugin) => { if (plugin.onBeforeUpdate) processed = plugin.onBeforeUpdate(id, processed); });
    const index = this.findIndexById(id);
    if (index === -1) throw new DataContextError(`Record with id ${id} not found`, DataContextErrorCode.RecordNotFound, id);
    const current = this._records[index];
    const updatedData = { ...current.data, ...processed } as T;
    const previousState = current.state;
    let state: RecordState;
    let modifiedFields: Map<keyof T, FieldChange> | undefined;
    if (current.state === RecordState.New) {
      state = RecordState.New;
    } else {
      modifiedFields = this.computeModifiedFields(current.original, updatedData);
      state = modifiedFields.size > 0 ? RecordState.Modified : RecordState.Unchanged;
      if (state === RecordState.Unchanged) modifiedFields = undefined;
    }
    const updated: TrackedRecord<T> = { data: updatedData, state, original: current.original, _modifiedFields: modifiedFields };
    this._records = [...this._records.slice(0, index), updated, ...this._records.slice(index + 1)];
    this.rebuildRecordIndex();
    this.undoManager.push({ type: 'update', recordId: id, before: current, after: updated });
    this.emitEvent({ type: 'update', recordId: id, data: processed, previousState, newState: state });
    this.plugins.forEach((plugin) => plugin.onAfterUpdate?.(String(updatedData[this.idField]), updated.data));
    this.notify();
  }

  patch(id: string, data: Partial<T>): void {
    const record = this.findRecord(id);
    if (!record) throw new DataContextError(`Record with id ${id} not found`, DataContextErrorCode.RecordNotFound, id);
    if (Object.keys(data).some((key) => !deepEqual(data[key as keyof T], record.data[key as keyof T]))) this.update(id, data);
  }

  delete(id: string, cascade = false): void {
    for (const plugin of this.plugins) if (plugin.onBeforeDelete && !plugin.onBeforeDelete(id)) return;
    const index = this.findIndexById(id);
    if (index === -1) throw new DataContextError(`Record with id ${id} not found`, DataContextErrorCode.RecordNotFound, id);
    const current = this._records[index];
    if (cascade) this.details.contextsFor(id)?.forEach((child) => child.deleteAll());
    this.undoManager.push({ type: 'delete', recordId: id, before: current, after: null, index });
    if (current.state === RecordState.New) {
      this.removeRecord(id);
    } else {
      this._records = [...this._records.slice(0, index), { ...current, state: RecordState.Deleted, _modifiedFields: undefined }, ...this._records.slice(index + 1)];
      this.rebuildRecordIndex();
      this.cursor.clampAfterDelete();
      this.notify();
    }
    this.emitEvent({ type: 'delete', recordId: id, previousState: current.state, newState: RecordState.Deleted });
    this.plugins.forEach((plugin) => plugin.onAfterDelete?.(id));
  }

  deleteAll(): void {
    this._records.forEach((record) => {
      const id = String(record.data[this.idField]);
      this.details.contextsFor(id)?.forEach((child) => child.deleteAll());
    });
    this._records = this._records
      .filter((record) => record.state !== RecordState.New)
      .map((record) => ({ ...record, state: RecordState.Deleted, _modifiedFields: undefined }));
    this.rebuildRecordIndex();
    this.cursor.clampAfterDelete();
    this.emitEvent({ type: 'delete' });
    this.notify();
  }

  clear(): void {
    this._records = [];
    this.recordIndexMap.clear();
    this.details.clearAll();
    this.undoManager.clear();
    this._currentIndex = -1;
    this.cursor.set(-1);
    this._resetVersion += 1;
    this.emitEvent({ type: 'clear' });
    this.notify();
  }

  findRecord(id: string): TrackedRecord<T> | null {
    const index = this.findIndexById(id);
    return index === -1 ? null : this._records[index];
  }

  private removeRecord(id: string): void {
    const index = this.findIndexById(id);
    if (index === -1) return;
    this._records = [...this._records.slice(0, index), ...this._records.slice(index + 1)];
    this.rebuildRecordIndex();
    const children = this.details.remove(id);
    children?.forEach((child) => child.dispose());
    this.cursor.clampAfterDelete();
    this.notify();
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  async load(records?: T[] | Options, options?: Options): Promise<void> {
    if (Array.isArray(records)) {
      this.loadRecords(records, options);
      return;
    }
    if (!this.dataSource) {
      this._lastError = new DataContextError('Data source not configured', DataContextErrorCode.DataSourceNotConfigured);
      this.notify();
      return;
    }
    const token = ++this.loadToken;
    this._lastError = null;
    this._loading += 1;
    this.notify();
    try {
      const response = await this.dataSource.read();
      if (token === this.loadToken) this.loadRecords(response.data, records as Options | undefined);
    } catch (error) {
      if (token === this.loadToken) {
        this._lastError = error instanceof Error ? error : new Error(String(error));
        this.logger.error('Error loading data:', error);
        this.notify();
      }
    } finally {
      this._loading = Math.max(0, this._loading - 1);
      this.notify();
    }
  }

  loadRecords(records: T[], options?: Options): void {
    this.details.clearLoadMarks();
    const tracked = records.map((record) => {
      const copy = structuredClone(record);
      const { cleaned, nested } = this.extractNestedDetails(copy);
      const trackedRecord: TrackedRecord<T> = { data: cleaned, state: RecordState.Unchanged, original: structuredClone(cleaned), _modifiedFields: undefined };
      const id = String(cleaned[this.idField]);
      this.loadNestedIntoChildContexts(id, nested);
      Object.keys(nested).forEach((name) => this.details.markLoaded(id, name));
      return trackedRecord;
    });
    this._records = tracked;
    this.rebuildRecordIndex();
    this._resetVersion += 1;
    this._currentIndex = tracked.length > 0 ? 0 : -1;
    this.cursor.set(this._currentIndex);
    this.undoManager.clear();
    this.emitEvent({ type: 'load' });
    if (options?.emitNavigationChange !== false) this.cursor.emitChange();
    this.notify();
  }

  async reload(): Promise<void> {
    const current = this.current;
    if (!current) throw new DataContextError('No current record to reload', DataContextErrorCode.NoCurrentRecord);
    if (!this.dataSource) throw new DataContextError('Data source not configured', DataContextErrorCode.DataSourceNotConfigured);
    const id = current.id;
    const index = this._currentIndex;
    this._loading += 1;
    this.notify();
    try {
      const fresh = await this.dataSource.getById(id);
      const copy = structuredClone(fresh);
      const { cleaned, nested } = this.extractNestedDetails(copy);
      const actualIndex = this.findIndexById(id);
      if (actualIndex !== -1) this._records = [...this._records.slice(0, actualIndex), { data: cleaned, state: RecordState.Unchanged, original: structuredClone(cleaned), _modifiedFields: undefined }, ...this._records.slice(actualIndex + 1)];
      this.rebuildRecordIndex();
      const old = this.details.remove(id);
      old?.forEach((child) => child.dispose());
      this.loadNestedIntoChildContexts(id, nested);
      await this.fetchChildRecords(id);
      this._currentIndex = index;
      this.cursor.set(index);
      this.notify();
    } catch (error) {
      this._lastError = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Error reloading current record:', error);
      throw error;
    } finally {
      this._loading = Math.max(0, this._loading - 1);
      this.notify();
    }
  }

  async loadById(id: string): Promise<void> {
    if (!this.dataSource) throw new DataContextError('Data source not configured', DataContextErrorCode.DataSourceNotConfigured);
    this._loading += 1;
    this.notify();
    try {
      const data = await this.dataSource.getById(id);
      this.loadRecords([data], { emitNavigationChange: false });
      await this.fetchChildRecords(String(data[this.idField]));
    } catch (error) {
      this._lastError = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Error loading record:', error);
      throw error;
    } finally {
      this._loading = Math.max(0, this._loading - 1);
      this.notify();
    }
  }

  private async fetchChildRecords(parentId: string): Promise<void> {
    const children = this.details.contextsFor(parentId);
    if (!children) return;
    await Promise.all(this.details.definitions.map(async ([name, definition]) => {
      if (definition.lazyLoad) return;
      const child = children.get(name);
      if (!child?.dataSource || !child.foreignKey) return;
      try {
        const result = await child.dataSource.read({ filter: { filters: [{ field: String(child.foreignKey), operator: 'eq', value: this.foreignKeyFilterValue(parentId) }] } });
        if (result.data.length > 0) child.loadRecords(result.data); else child.clear();
        await Promise.all(child.records.map((record) => child.fetchChildRecords(String(record.data[child.idField]))));
      } catch (error) {
        this.logger.error(`Error loading detail '${name}':`, error);
      }
    }));
  }

  // ── Inspection, validation, undo ──────────────────────────────────────────

  getChanges(): ChangeEntry<T>[] {
    return this._records.flatMap((record) => {
      const id = String(record.data[this.idField]);
      const childChanges: Record<string, ChangeEntry<Record<string, unknown>>[]> = {};
      this.details.contextsFor(id)?.forEach((child, name) => {
        const changes = child.getChanges();
        if (changes.length > 0) childChanges[name] = changes;
      });
      if (record.state === RecordState.Unchanged && Object.keys(childChanges).length === 0) return [];
      return [{ data: record.data, state: record.state, modifiedFields: record._modifiedFields ? Array.from(record._modifiedFields.keys()).map(String) : [], children: Object.keys(childChanges).length > 0 ? childChanges : undefined }];
    });
  }

  discardChanges(): void {
    const kept = this._records.filter((record) => record.state !== RecordState.New).map((record) => {
      if (record.state === RecordState.Unchanged) return record;
      const restored = structuredClone(record.original!);
      return { data: restored, state: RecordState.Unchanged, original: structuredClone(restored), _modifiedFields: undefined } as TrackedRecord<T>;
    });
    this._records = kept;
    this.rebuildRecordIndex();
    const orphaned: string[] = [];
    this.details.forEach((children, parentId) => {
      if (!this._records.some((record) => String(record.data[this.idField]) === parentId)) {
        children.forEach((child) => child.dispose());
        orphaned.push(parentId);
      } else children.forEach((child) => child.discardChanges());
    });
    orphaned.forEach((parentId) => this.details.remove(parentId));
    this.cursor.clampAfterDelete();
    this._resetVersion += 1;
    this.undoManager.clear();
    this.emitEvent({ type: 'discard' });
    this.notify();
  }

  discardRecord(recordId: string): void {
    const index = this.findIndexById(recordId);
    if (index === -1) return;
    const record = this._records[index];
    if (record.state === RecordState.New) {
      this.removeRecord(recordId);
      return;
    }
    if (record.state !== RecordState.Unchanged && record.original) {
      const restored = structuredClone(record.original);
      this._records = [...this._records.slice(0, index), { data: restored, state: RecordState.Unchanged, original: structuredClone(restored), _modifiedFields: undefined }, ...this._records.slice(index + 1)];
      this.rebuildRecordIndex();
    }
    this.details.contextsFor(recordId)?.forEach((child) => child.discardChanges());
    this._resetVersion += 1;
    this.notify();
  }

  acceptChanges(): void {
    this._records = this._records.filter((record) => record.state !== RecordState.Deleted).map((record) => record.state === RecordState.Unchanged ? record : ({ data: record.data, state: RecordState.Unchanged, original: structuredClone(record.data), _modifiedFields: undefined } as TrackedRecord<T>));
    this.rebuildRecordIndex();
    this.details.forEach((children) => children.forEach((child) => child.acceptChanges()));
    this.cursor.clampAfterDelete();
    this.undoManager.clear();
    this.notify();
  }

  validateRecord(record: T): ValidationError[] {
    const errors: ValidationError[] = [];
    (Object.entries(this.fieldValidators) as [string, FieldValidator<T> | undefined][]).forEach(([field, validator]) => {
      if (!validator) return;
      const message = validator((record as Record<string, unknown>)[field], record);
      if (message) errors.push({ field, message });
    });
    this.recordValidators.forEach((validator) => errors.push(...validator(record)));
    return errors;
  }

  undo(): boolean {
    const command = this.undoManager.popUndo();
    if (!command) return false;
    this.applyUndoCommand(command);
    this.emitEvent({ type: 'undo', recordId: command.recordId });
    this.notify();
    return true;
  }

  redo(): boolean {
    const command = this.undoManager.popRedo();
    if (!command) return false;
    this.applyRedoCommand(command);
    this.emitEvent({ type: 'redo', recordId: command.recordId });
    this.notify();
    return true;
  }

  private applyUndoCommand(command: ChangeCommand<T>): void {
    if (command.type === 'add') this.removeRecord(command.recordId);
    if (command.type === 'update' && command.before) {
      const index = this.findIndexById(command.recordId);
      if (index !== -1) this._records = [...this._records.slice(0, index), command.before, ...this._records.slice(index + 1)];
      this.rebuildRecordIndex();
    }
    if (command.type === 'delete' && command.before) {
      const index = this.findIndexById(command.recordId);
      if (index !== -1) this._records = [...this._records.slice(0, index), command.before, ...this._records.slice(index + 1)];
      else {
        const next = [...this._records];
        next.splice(Math.min(command.index ?? next.length, next.length), 0, command.before);
        this._records = next;
      }
      this.rebuildRecordIndex();
      this.cursor.clampAfterDelete();
    }
  }

  private applyRedoCommand(command: ChangeCommand<T>): void {
    if (command.type === 'add' && command.after) {
      this._records = [...this._records, command.after];
      this.rebuildRecordIndex();
    }
    if (command.type === 'update' && command.after) {
      const index = this.findIndexById(command.recordId);
      if (index !== -1) this._records = [...this._records.slice(0, index), command.after, ...this._records.slice(index + 1)];
      this.rebuildRecordIndex();
    }
    if (command.type === 'delete') {
      const index = this.findIndexById(command.recordId);
      if (index === -1) return;
      if (command.before?.state === RecordState.New) this.removeRecord(command.recordId);
      else {
        this._records = [...this._records.slice(0, index), { ...this._records[index], state: RecordState.Deleted, _modifiedFields: undefined }, ...this._records.slice(index + 1)];
        this.rebuildRecordIndex();
        this.cursor.clampAfterDelete();
      }
    }
  }

  // ── Sync ──────────────────────────────────────────────────────────────────

  buildSyncPayload(): SyncPayload[] {
    return this._records.map((record) => {
      const id = String(record.data[this.idField]);
      const payload: SyncPayload = { ...record.data };
      if (record.state !== RecordState.Unchanged) {
        payload._state = this.mapRecordState(record.state);
        if (record.state === RecordState.Modified && record._modifiedFields) payload._modifiedFields = Array.from(record._modifiedFields.keys()).map(String);
      }
      this.details.contextsFor(id)?.forEach((child, name) => {
        const childPayload = child.buildSyncPayload();
        if (childPayload.length > 0) payload[name] = childPayload;
      });
      return { record, payload };
    }).filter(({ record, payload }) => {
      if (record.state !== RecordState.Unchanged) return true;
      return Object.values(payload).some((value) => Array.isArray(value) && value.length > 0);
    }).map(({ payload }) => payload);
  }

  previewPayload(isJsonFormat = true): string | SyncPayload[] {
    const payload = this.buildSyncPayload();
    return isJsonFormat ? JSON.stringify(payload, null, 2) : payload;
  }

  async save(): Promise<T> {
    const current = this.current;
    if (!current) throw new DataContextError('No current record to save', DataContextErrorCode.NoCurrentRecord);
    if (!this.dataSource) throw new DataContextError('Data source not configured', DataContextErrorCode.DataSourceNotConfigured);
    if (!this.dirty) throw new DataContextError('No changes to save', DataContextErrorCode.NoChangesToSave);
    const validation = this.collectSyncValidationErrors();
    if (validation.length > 0) throw new DataContextError(`Validation failed: ${validation.map((error) => error.message).join(', ')}`, DataContextErrorCode.ValidationFailed);
    let payloads = this.buildSyncPayload();
    this.plugins.forEach((plugin) => { if (plugin.onBeforeSave) payloads = plugin.onBeforeSave(payloads); });
    if (!this.dataSource.sync) throw new DataContextError('Data source does not support sync', DataContextErrorCode.SyncNotSupported);
    this._loading += 1;
    this.notify();
    try {
      const saved = await this.dataSource.sync(payloads);
      this.applySyncResponse(payloads, saved);
      this.undoManager.clear();
      this.plugins.forEach((plugin) => plugin.onAfterSave?.(payloads));
      this.emitEvent({ type: 'save' });
      return saved as T;
    } catch (error) {
      this._lastError = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Error saving data:', error);
      throw error;
    } finally {
      this._loading = Math.max(0, this._loading - 1);
      this.notify();
    }
  }

  private collectSyncValidationErrors(): ValidationError[] {
    const errors: ValidationError[] = [];
    this._records.forEach((record) => { if (record.state !== RecordState.Deleted && record.state !== RecordState.Unchanged) errors.push(...this.validateRecord(record.data)); });
    this.details.forEach((children) => children.forEach((child) => errors.push(...child.collectSyncValidationErrors())));
    return errors;
  }

  private applySyncResponse(payloads: SyncPayload[], savedData: T | T[]): void {
    const saved = Array.isArray(savedData) ? savedData : [savedData];
    payloads.filter((payload) => payload._state === 'Deleted').forEach((payload) => this.removeRecord(String(payload[this.idField as string])));
    const echoed = payloads.filter((payload) => payload._state !== 'Deleted');
    const echoedIds = new Set(echoed.map((payload) => String(payload[this.idField as string])));
    const newIds = echoed.filter((payload) => payload._state === 'New').map((payload) => String(payload[this.idField as string]));
    let cursor = 0;
    saved.forEach((item) => {
      const savedId = String(item[this.idField]);
      const oldId = echoedIds.has(savedId) ? savedId : (newIds[cursor++] ?? savedId);
      this.applySavedRecord(oldId, item);
    });
  }

  private applySavedRecord(oldId: string, savedData: T): void {
    const newId = String(savedData[this.idField]);
    const copy = structuredClone(savedData);
    const { cleaned, nested } = this.extractNestedDetails(copy);
    const index = this.findIndexById(oldId);
    if (index !== -1) this._records = [...this._records.slice(0, index), { data: cleaned, state: RecordState.Unchanged, original: structuredClone(cleaned), _modifiedFields: undefined }, ...this._records.slice(index + 1)];
    this.rebuildRecordIndex();
    if (Object.keys(nested).length > 0) {
      const old = this.details.remove(oldId);
      old?.forEach((child) => child.dispose());
      this.loadNestedIntoChildContexts(newId, nested);
      return;
    }
    const children = newId !== oldId ? this.details.rekey(oldId, newId) : this.details.contextsFor(oldId);
    children?.forEach((child) => {
      if (newId !== oldId) {
        child.parentRecordId = newId;
        child.updateForeignKeyReferences(oldId, newId);
      }
      child.acceptChanges();
    });
  }

  updateForeignKeyReferences(oldParentId: string, newParentId: string): void {
    if (this.foreignKey) {
      this._records = this._records.map((record) => String(record.data[this.foreignKey!]) === oldParentId ? { ...record, data: { ...record.data, [this.foreignKey!]: newParentId } } : record);
      this.rebuildRecordIndex();
    }
    this.details.forEach((children) => children.forEach((child) => child.updateForeignKeyReferences(oldParentId, newParentId)));
    this.notify();
  }

  // ── Navigation and lifecycle ─────────────────────────────────────────────

  next(): boolean { return this.cursor.next(); }
  previous(): boolean { return this.cursor.previous(); }
  first(): boolean { return this.cursor.first(); }
  last(): boolean { return this.cursor.last(); }
  skip(index: number): boolean { return this.cursor.skip(index); }
  peek(index: number): RecordHandle<T, TDetails> | undefined { return index >= 0 && index < this._records.length ? this.createHandle(this._records[index]) : undefined; }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.cursor.complete();
    this.details.forEach((children) => children.forEach((child) => child.dispose()));
    this._formModel?.dispose();
    this.eventCompletions.forEach((complete) => complete());
    this.eventCompletions.clear();
    this.listeners.clear();
    this.eventListeners.clear();
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private rebuildRecordIndex(): void {
    this.recordIndexMap.clear();
    this._records.forEach((record, index) => this.recordIndexMap.set(String(record.data[this.idField]), index));
  }

  private findIndexById(id: string): number { return this.recordIndexMap.get(id) ?? -1; }

  private setCursorToLastNavigationRecord(): void {
    const index = this.navigationRecords.length - 1;
    this._currentIndex = index;
    this.cursor.set(index);
    this.cursor.emitChange();
  }

  private extractNestedDetails(record: T): { cleaned: T; nested: Record<string, unknown[]> } {
    if (this.details.definitions.length === 0) return { cleaned: record, nested: {} };
    const cleaned = { ...record };
    const nested: Record<string, unknown[]> = {};
    this.details.definitions.forEach(([name]) => {
      const value = (record as Record<string, unknown>)[name];
      if (Array.isArray(value) && (value.length === 0 || typeof value[0] === 'object')) {
        nested[name] = value;
        delete (cleaned as Record<string, unknown>)[name];
      }
    });
    return { cleaned, nested };
  }

  private loadNestedIntoChildContexts(recordId: string, nested: Record<string, unknown[]>): void {
    if (Object.keys(nested).length === 0) return;
    this.details.ensure(recordId);
    const children = this.details.contextsFor(recordId);
    if (!children) return;
    Object.entries(nested).forEach(([name, records]) => children.get(name)?.loadRecords(records as Record<string, unknown>[]));
  }

  private mapRecordState(state: RecordState): 'New' | 'Modified' | 'Deleted' | 'Unchanged' {
    if (state === RecordState.New) return 'New';
    if (state === RecordState.Modified) return 'Modified';
    if (state === RecordState.Deleted) return 'Deleted';
    return 'Unchanged';
  }

  private computeModifiedFields(original: T | undefined, current: T): Map<keyof T, FieldChange> {
    const changes = new Map<keyof T, FieldChange>();
    if (!original) return changes;
    const keys = new Set([...Object.keys(original), ...Object.keys(current)]) as Set<keyof T>;
    keys.forEach((key) => {
      if (!deepEqual(original[key], current[key])) changes.set(key, { oldValue: original[key], newValue: current[key] });
    });
    return changes;
  }

  private isRecordDirty(id: string): boolean {
    const record = this.findRecord(id);
    if (!record) return false;
    if (record.state !== RecordState.Unchanged) return true;
    let dirty = false;
    this.details.contextsFor(id)?.forEach((child) => { if (child.dirty) dirty = true; });
    return dirty;
  }

  private foreignKeyFilterValue(parentId: string): unknown {
    const parent = this.findRecord(parentId);
    return parent ? parent.data[this.idField] : parentId;
  }

  private createHandle(record: TrackedRecord<T>): RecordHandle<T, TDetails> {
    const id = String(record.data[this.idField]);
    const getData = (): T => {
      const inMemoryDetails = this.inMemoryDetailDefinitions();
      const childMap = this.details.contextsFor(id);
      if (!childMap || inMemoryDetails.length === 0) return record.data;
      const slices: Partial<T> = {};
      inMemoryDetails.forEach(([name]) => {
        const child = childMap.get(name);
        if (child) (slices as Record<string, unknown>)[name] = child.data;
      });
      return { ...record.data, ...slices };
    };
    const handle = {
      record,
      get data(): T { return getData(); },
      id,
      update: (data: Partial<T>) => this.update(id, data),
      patch: (data: Partial<T>) => this.patch(id, data),
      delete: (cascade?: boolean) => this.delete(id, cascade),
      discard: () => this.discardRecord(id),
      getDetail: <K extends keyof TDetails>(name: K) => this.getDetail(id, name),
      dirty: () => this.isRecordDirty(id),
    } as RecordHandle<T, TDetails>;

    this.details.definitions.forEach(([name]) => {
      Object.defineProperty(handle, name, {
        get: () => this.getDetail(id, name as keyof TDetails),
        enumerable: true,
        configurable: true,
      });
    });
    return handle;
  }
}
