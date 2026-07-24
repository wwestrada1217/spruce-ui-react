import type { IDataSource, SyncPayload } from './types.js';
import { RecordState } from './record-state.js';
import type { TrackedRecord } from './tracked-record.js';
import { deepEqual, newGUID } from './type-utils.js';

// ============================================================================
// Type Helpers
// ============================================================================

export type DetailNames<T> = {
  [K in keyof T]: T[K] extends Array<unknown> ? K : never;
}[keyof T];

export type ExtractArrayElement<T, K extends keyof T> =
  T[K] extends Array<infer U>
    ? U extends Record<string, unknown>
      ? U
      : Record<string, unknown>
    : Record<string, unknown>;

export type DetailDefinitions<T> = {
  [K in DetailNames<T>]?: T[K] extends Array<infer U>
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
  dataSource?: IDataSource<TDetail>;
  lazyLoad?: boolean;
  details?: {
    [K in keyof TDetailDefs]: TDetailDefs[K];
  };
}

export interface DataContextConfig<
  T extends Record<string, unknown>,
  TDetails extends DetailDefinitions<T> = DetailDefinitions<T>,
> {
  idField: keyof T;
  dataSource?: IDataSource<T>;
  navigateDeletedRecords?: boolean;
  details?: {
    [K in keyof TDetails]: TDetails[K];
  };
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
  getDetail<K extends keyof TDetails>(
    detailName: K,
  ): DataContext<ExtractArrayElement<T, K & keyof T>>;
  dirty(): boolean;
} & {
  [K in keyof TDetails]: DataContext<ExtractArrayElement<T, K & keyof T>>;
};

// ============================================================================
// Factory
// ============================================================================

export function createDataContext<
  T extends Record<string, unknown>,
  TDetails extends DetailDefinitions<T> = DetailDefinitions<T>,
>(config: DataContextConfig<T, TDetails>): DataContext<T, TDetails> {
  return new DataContext<T, TDetails>(config);
}

// ============================================================================
// DataContext
// ============================================================================

export class DataContext<
  T extends Record<string, unknown>,
  TDetails extends DetailDefinitions<T> = DetailDefinitions<T>,
> {
  // ── State ────────────────────────────────────────────────────────────────
  private _records: TrackedRecord<T>[] = [];
  private _currentIndex = -1;
  private _navigateDeletedRecords = false;
  private _resetVersion = 0;

  readonly idField: keyof T;
  readonly dataSource?: IDataSource<T>;

  private foreignKey?: keyof T;
  private parentRecordId?: string;

  private childContexts = new Map<string, Map<string, DataContext<Record<string, unknown>>>>();
  private childDefinitions: [string, DetailDefinition<Record<string, unknown>>][];
  private detailsLoadedByParent = new Map<string, Set<string>>();
  private detailsLoadingByParent = new Map<string, Set<string>>();

  // Change notification (listener pattern for useSyncExternalStore)
  private _listeners = new Set<() => void>();
  private _version = 0;

  /**
   * Subscribe to state changes. Returns an unsubscribe function.
   * Designed for use with React's `useSyncExternalStore`.
   */
  subscribe(listener: () => void): () => void {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }

  /**
   * Returns a version counter that increments on every state change.
   * Designed for use with React's `useSyncExternalStore`.
   */
  getSnapshot(): number {
    return this._version;
  }

  constructor(config: DataContextConfig<T, TDetails>) {
    this.idField = config.idField;
    this.dataSource = config.dataSource;
    this._navigateDeletedRecords = config.navigateDeletedRecords ?? false;
    this.childDefinitions = config.details
      ? (Object.entries(config.details)
          .filter(([, d]) => d)
          .map(([key, d]) => [key, d]) as [string, DetailDefinition<Record<string, unknown>>][])
      : [];
  }

  // ── Notify ───────────────────────────────────────────────────────────────

  private notify(): void {
    this._version++;
    this._listeners.forEach((l) => l());
  }

  // ── Computed Accessors ───────────────────────────────────────────────────

  get records(): TrackedRecord<T>[] {
    return this._records;
  }

  get resetVersion(): number {
    return this._resetVersion;
  }

  get navigateDeletedRecords(): boolean {
    return this._navigateDeletedRecords;
  }

  set navigateDeletedRecords(value: boolean) {
    this._navigateDeletedRecords = value;
    this.notify();
  }

  get activeRecords(): TrackedRecord<T>[] {
    return this._records.filter((r) => r.state !== RecordState.Deleted);
  }

  get navigationRecords(): TrackedRecord<T>[] {
    return this._navigateDeletedRecords ? this._records : this.activeRecords;
  }

  get data(): T[] {
    const activeRecs = this.activeRecords;
    const inMemoryDetails = this.childDefinitions.filter(([, def]) => !def.dataSource);
    if (inMemoryDetails.length === 0) return activeRecs.map((r) => r.data);

    return activeRecs.map((r) => {
      const id = String(r.data[this.idField]);
      const childMap = this.childContexts.get(id);
      if (!childMap) return r.data;

      const detailSlices: Partial<T> = {};
      inMemoryDetails.forEach(([name]) => {
        const childCtx = childMap.get(name);
        if (childCtx) (detailSlices as Record<string, unknown>)[name] = childCtx.data;
      });

      return { ...r.data, ...detailSlices };
    });
  }

  get dataWithDetails(): T[] {
    return this.activeRecords.map((r) => {
      const id = String(r.data[this.idField]);
      const childMap = this.childContexts.get(id);
      if (!childMap || this.childDefinitions.length === 0) return r.data;

      const detailSlices: Partial<T> = {};
      this.childDefinitions.forEach(([name]) => {
        const childCtx = childMap.get(name);
        if (childCtx) (detailSlices as Record<string, unknown>)[name] = childCtx.data;
      });

      return { ...r.data, ...detailSlices };
    });
  }

  get dirty(): boolean {
    const hasDirtyRecords = this._records.some((r) => r.state !== RecordState.Unchanged);
    const hasNestedChanges = Array.from(this.childContexts.values()).some((childMap) =>
      Array.from(childMap.values()).some((child) => child.dirty),
    );
    return hasDirtyRecords || hasNestedChanges;
  }

  get currentDirty(): boolean {
    const cur = this.current;
    if (!cur) return false;
    const record = this.findRecord(cur.id);
    if (!record) return false;
    if (record.state !== RecordState.Unchanged) return true;
    const children = this.childContexts.get(cur.id);
    if (!children) return false;
    return Array.from(children.values()).some((child) => child.dirty);
  }

  get count(): number {
    return this._records.length;
  }

  get empty(): boolean {
    return this.count === 0;
  }

  get hasNext(): boolean {
    return this._currentIndex < this.navigationRecords.length - 1;
  }

  get hasPrevious(): boolean {
    return this._currentIndex > 0;
  }

  get isLast(): boolean {
    return this._currentIndex === this.count - 1;
  }

  get isFirst(): boolean {
    return this._currentIndex === 0;
  }

  get recordNo(): number {
    return this._currentIndex + 1;
  }

  get recordIndex(): number {
    return this._currentIndex;
  }

  get current(): RecordHandle<T, TDetails> | null {
    const idx = this._currentIndex;
    const recs = this.navigationRecords;
    if (idx < 0 || idx >= recs.length) return null;
    return this.createHandle(recs[idx]);
  }

  // ============================================================================
  // Child Detail Access
  // ============================================================================

  getDetail<K extends keyof TDetails>(
    parentId: string,
    detailName: K,
  ): DataContext<ExtractArrayElement<T, K & keyof T>> {
    if (!this.childContexts.has(parentId)) {
      this.initializeChildContexts(parentId);
    }

    const ctx = this.childContexts.get(parentId)?.get(detailName as string);
    if (!ctx) {
      throw new Error(
        `Detail '${String(detailName)}' not configured. Available: [${this.childDefinitions
          .map(([n]) => n)
          .join(', ')}]`,
      );
    }

    const name = detailName as string;
    const def = this.getDetailDefinition(name);
    if (
      def?.lazyLoad &&
      !this.isDetailLoaded(parentId, name) &&
      !this.isDetailLoading(parentId, name)
    ) {
      this.fetchSingleDetail(parentId, name).catch(console.error);
    }

    return ctx as unknown as DataContext<ExtractArrayElement<T, K & keyof T>>;
  }

  private getDetailDefinition(
    detailName: string,
  ): DetailDefinition<Record<string, unknown>> | undefined {
    return this.childDefinitions.find(([n]) => n === detailName)?.[1];
  }

  getAllDetails(parentId: string): Map<string, DataContext<Record<string, unknown>>> {
    if (!this.childContexts.has(parentId)) {
      this.initializeChildContexts(parentId);
    }
    return this.childContexts.get(parentId) ?? new Map();
  }

  private initializeChildContexts(parentId: string): void {
    if (this.childDefinitions.length === 0) return;
    if (this.childContexts.has(parentId)) return;

    this.childContexts.set(parentId, new Map());

    this.childDefinitions.forEach(([childName, childDef]) => {
      const childCtx = new DataContext<Record<string, unknown>>({
        idField: childDef.idField,
        dataSource: childDef.dataSource,
        details: childDef.details as DetailDefinitions<Record<string, unknown>>,
      });

      if (childDef.foreignKey) {
        childCtx.foreignKey = childDef.foreignKey;
        childCtx.parentRecordId = parentId;
      }
      this.childContexts.get(parentId)!.set(childName, childCtx);
    });
  }

  // ============================================================================
  // CRUD Operations
  // ============================================================================

  add(data: Partial<T>): string {
    const rawData = {
      ...data,
      [this.idField]: data[this.idField] ?? newGUID(),
    } as T;

    if (this.foreignKey && this.parentRecordId && !(rawData as Record<string, unknown>)[this.foreignKey as string]) {
      (rawData as Record<string, unknown>)[this.foreignKey as string] = this.parentRecordId;
    }

    const { cleaned, nested } = this.extractNestedDetails(rawData);

    const newRecord: TrackedRecord<T> = {
      data: cleaned,
      state: RecordState.New,
      original: undefined,
      _modifiedFields: undefined,
    };

    this._records = [...this._records, newRecord];
    this._currentIndex = this._records.length - 1;
    this.emitNavigationChange();

    const recordId = String(cleaned[this.idField]);
    this.loadNestedIntoChildContexts(recordId, nested);
    this.notify();
    return recordId;
  }

  update(id: string, data: Partial<T>): void {
    const index = this._records.findIndex((r) => String(r.data[this.idField]) === id);
    if (index === -1) throw new Error(`Record with id ${id} not found`);

    const current = this._records[index];
    const updatedData = { ...current.data, ...data } as T;

    const newState =
      current.state === RecordState.New
        ? RecordState.New
        : this.detectChanges(current.original, updatedData)
          ? RecordState.Modified
          : RecordState.Unchanged;

    let modifiedFields: Map<keyof T, { oldValue: unknown; newValue: unknown }> | undefined;
    if (newState === RecordState.Modified) {
      modifiedFields = this.computeModifiedFields(current.original, updatedData);
    }

    const updatedRecord: TrackedRecord<T> = {
      data: updatedData,
      state: newState,
      original: current.original,
      _modifiedFields: modifiedFields,
    };

    const newRecords = [...this._records];
    newRecords[index] = updatedRecord;
    this._records = newRecords;
    this.notify();
  }

  patch(id: string, data: Partial<T>): void {
    const record = this.findRecord(id);
    if (!record) throw new Error(`Record with id ${id} not found`);

    const changed = Object.keys(data).some(
      (key) => !deepEqual(data[key as keyof T], record.data[key as keyof T]),
    );

    if (changed) this.update(id, data);
  }

  delete(id: string, cascade: boolean = false): void {
    const index = this._records.findIndex((r) => String(r.data[this.idField]) === id);
    if (index === -1) throw new Error(`Record with id ${id} not found`);

    const current = this._records[index];

    if (cascade) {
      const children = this.childContexts.get(id);
      if (children) children.forEach((child) => child.deleteAll());
    }

    let newRecords: TrackedRecord<T>[];
    if (current.state === RecordState.New) {
      newRecords = [...this._records.slice(0, index), ...this._records.slice(index + 1)];
    } else {
      const deletedRecord: TrackedRecord<T> = {
        ...current,
        state: RecordState.Deleted,
        _modifiedFields: undefined,
      };
      newRecords = [...this._records.slice(0, index), deletedRecord, ...this._records.slice(index + 1)];
    }

    this._records = newRecords;
    this.clampCurrentIndexAfterDelete();
    this.notify();
  }

  deleteAll(): void {
    this._records = this._records
      .map((record) => {
        const id = String(record.data[this.idField]);
        const children = this.childContexts.get(id);
        if (children) children.forEach((child) => child.deleteAll());

        if (record.state === RecordState.New) return record;

        return {
          ...record,
          state: RecordState.Deleted,
          _modifiedFields: undefined,
        } as TrackedRecord<T>;
      })
      .filter((r) => r.state !== RecordState.New);
    this.notify();
  }

  clear(): void {
    this._records = [];
    this.childContexts.clear();
    this._resetVersion++;
    this.notify();
  }

  findRecord(id: string): TrackedRecord<T> | null {
    return this._records.find((r) => String(r.data[this.idField]) === id) ?? null;
  }

  // ============================================================================
  // Loading
  // ============================================================================

  load(records: T[]): void;
  load(): void;
  load(records?: T[]): void {
    if (Array.isArray(records)) {
      this.loadRecords(records);
      return;
    }
    this.dataSource?.read().then((response) => this.loadRecords(response.data));
  }

  loadRecords(records: T[]): void {
    this.detailsLoadedByParent.clear();
    this.detailsLoadingByParent.clear();

    const trackedRecords: TrackedRecord<T>[] = records.map((record) => {
      const recordCopy = structuredClone(record);
      const { cleaned, nested } = this.extractNestedDetails(recordCopy);

      const trackedRecord: TrackedRecord<T> = {
        data: cleaned,
        state: RecordState.Unchanged,
        original: structuredClone(cleaned),
        _modifiedFields: undefined,
      };

      const recordId = String(cleaned[this.idField]);
      this.loadNestedIntoChildContexts(recordId, nested);

      if (Object.keys(nested).length > 0) {
        if (!this.detailsLoadedByParent.has(recordId)) {
          this.detailsLoadedByParent.set(recordId, new Set());
        }
        Object.keys(nested).forEach((name) => {
          this.detailsLoadedByParent.get(recordId)!.add(name);
        });
      }

      return trackedRecord;
    });

    this._records = trackedRecords;
    this._resetVersion++;
    this._currentIndex = trackedRecords.length > 0 ? 0 : -1;
    this.emitNavigationChange();
    this.notify();
  }

  async reload(): Promise<void> {
    const currentRecord = this.current;
    if (!currentRecord) throw new Error('No current record to reload');
    if (!this.dataSource) throw new Error('Data source not configured');

    const recordId = currentRecord.id;
    const currentIdx = this._currentIndex;

    const freshData = await this.dataSource.getById(recordId);
    const recordCopy = structuredClone(freshData);
    const { cleaned, nested } = this.extractNestedDetails(recordCopy);

    const trackedRecord: TrackedRecord<T> = {
      data: cleaned,
      state: RecordState.Unchanged,
      original: structuredClone(cleaned),
      _modifiedFields: undefined,
    };

    const newRecords = [...this._records];
    const actualIndex = newRecords.findIndex(
      (r) => String(r.data[this.idField]) === recordId,
    );
    if (actualIndex !== -1) newRecords[actualIndex] = trackedRecord;
    this._records = newRecords;

    const oldChildContexts = this.childContexts.get(recordId);
    if (oldChildContexts) {
      oldChildContexts.forEach((child) => child.clear());
      this.childContexts.delete(recordId);
      this.detailsLoadedByParent.delete(recordId);
      this.detailsLoadingByParent.delete(recordId);
    }

    this.loadNestedIntoChildContexts(recordId, nested);
    this.notify();

    await this.fetchChildRecords(recordId);
    this._currentIndex = currentIdx;
    this.notify();
  }

  async loadById(id: string): Promise<void> {
    if (!this.dataSource) throw new Error('Data source not configured');

    const data = await this.dataSource.getById(id);
    this.loadRecords([data]);
    const recordId = String(data[this.idField]);
    await this.fetchChildRecords(recordId);
  }

  private async fetchChildRecords(parentId: string): Promise<void> {
    const childMap = this.childContexts.get(parentId);
    if (!childMap) return;

    const fetches: Promise<void>[] = [];
    this.childDefinitions.forEach(([detailName, childDef]) => {
      if (childDef.lazyLoad) return;
      const childCtx = childMap.get(detailName);
      if (childCtx?.dataSource && childCtx.foreignKey) {
        const p = childCtx.dataSource
          .read({
            filter: {
              filters: [{ field: String(childCtx.foreignKey), operator: 'eq', value: parentId }],
            },
          })
          .then(async (res) => {
            if (res.data.length > 0) {
              childCtx.loadRecords(res.data);
            } else {
              childCtx.clear();
            }
            await Promise.all(
              childCtx.records.map((record) => {
                const recordId = String(record.data[childCtx.idField]);
                return childCtx.fetchChildRecords(recordId);
              }),
            );
          })
          .catch(() => undefined);
        fetches.push(p);
      }
    });

    await Promise.all(fetches);
  }

  private isDetailLoaded(parentId: string, detailName: string): boolean {
    return this.detailsLoadedByParent.get(parentId)?.has(detailName) ?? false;
  }

  private isDetailLoading(parentId: string, detailName: string): boolean {
    return this.detailsLoadingByParent.get(parentId)?.has(detailName) ?? false;
  }

  private markDetailLoaded(parentId: string, detailName: string): void {
    if (!this.detailsLoadedByParent.has(parentId)) {
      this.detailsLoadedByParent.set(parentId, new Set());
    }
    this.detailsLoadedByParent.get(parentId)!.add(detailName);
  }

  private async fetchSingleDetail(parentId: string, detailName: string): Promise<void> {
    const childMap = this.childContexts.get(parentId);
    const childCtx = childMap?.get(detailName);
    if (!childCtx?.dataSource || !childCtx.foreignKey) return;

    if (!this.detailsLoadingByParent.has(parentId)) {
      this.detailsLoadingByParent.set(parentId, new Set());
    }
    this.detailsLoadingByParent.get(parentId)!.add(detailName);

    try {
      const res = await childCtx.dataSource.read({
        filter: {
          filters: [{ field: String(childCtx.foreignKey), operator: 'eq', value: parentId }],
        },
      });

      if (res.data.length > 0) {
        childCtx.loadRecords(res.data);
      } else {
        childCtx.clear();
      }
      this.markDetailLoaded(parentId, detailName);

      await Promise.all(
        childCtx.records.map((record) => {
          const recordId = String(record.data[childCtx.idField]);
          return childCtx.fetchChildRecords(recordId);
        }),
      );
    } catch {
      // Silently ignore errors for lazy-loaded details
    } finally {
      this.detailsLoadingByParent.get(parentId)?.delete(detailName);
    }
  }

  // ============================================================================
  // State Inspection
  // ============================================================================

  getChanges(): unknown[] {
    return this._records
      .map((record) => {
        const id = String(record.data[this.idField]);
        const nestedChanges: Record<string, unknown> = {};

        const children = this.childContexts.get(id);
        if (children) {
          children.forEach((child, name) => {
            const childChanges = child.getChanges();
            if (childChanges.length > 0) {
              nestedChanges[name] = childChanges;
            }
          });
        }

        const hasChildChanges = Object.keys(nestedChanges).length > 0;
        const hasOwnChanges = record.state !== RecordState.Unchanged;

        if (!hasOwnChanges && !hasChildChanges) return null;

        return {
          data: record.data,
          state: record.state,
          _modifiedFields:
            record._modifiedFields instanceof Map
              ? [...record._modifiedFields.keys()].map((k) => String(k))
              : record._modifiedFields,
          children: hasChildChanges ? nestedChanges : undefined,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  }

  discardChanges(): void {
    this._records = this._records
      .filter((r) => r.state !== RecordState.New)
      .map((record) => {
        if (record.state === RecordState.Unchanged) return record;
        return {
          data: structuredClone(record.original!),
          state: RecordState.Unchanged,
          original: structuredClone(record.original!),
          _modifiedFields: undefined,
        } as TrackedRecord<T>;
      });

    this.childContexts.forEach((childMap, parentId) => {
      const parentExists = this._records.some(
        (r) => String(r.data[this.idField]) === parentId,
      );
      if (!parentExists) {
        childMap.forEach((child) => child.clear());
        this.childContexts.delete(parentId);
      } else {
        childMap.forEach((child) => child.discardChanges());
      }
    });

    this.clampCurrentIndexAfterDelete();
    this._resetVersion++;
    this.notify();
  }

  discardRecord(recordId: string): void {
    const records = this._records;
    const index = records.findIndex((r) => String(r.data[this.idField]) === recordId);
    if (index === -1) return;

    const record = records[index];

    if (record.state === RecordState.New) {
      this._records = this._records.filter(
        (r) => String(r.data[this.idField]) !== recordId,
      );
      const children = this.childContexts.get(recordId);
      if (children) {
        children.forEach((child) => child.clear());
        this.childContexts.delete(recordId);
      }
      this.clampCurrentIndexAfterDelete();
      this.notify();
      return;
    }

    if (record.state !== RecordState.Unchanged && record.original) {
      const next = [...this._records];
      next[index] = {
        data: structuredClone(record.original),
        state: RecordState.Unchanged,
        original: structuredClone(record.original),
        _modifiedFields: undefined,
      } as TrackedRecord<T>;
      this._records = next;
    }

    const children = this.childContexts.get(recordId);
    if (children) children.forEach((child) => child.discardChanges());
    this._resetVersion++;
    this.notify();
  }

  // ============================================================================
  // Sync / Save
  // ============================================================================

  buildSyncPayload(): SyncPayload[] {
    return this._records
      .map((record) => {
        const id = String(record.data[this.idField]);
        const payload: SyncPayload = { ...record.data };

        if (record.state !== RecordState.Unchanged) {
          payload._state = this.mapRecordState(record.state);
          if (record.state === RecordState.Modified && record._modifiedFields) {
            payload._modifiedFields = [
              ...(record._modifiedFields as Map<keyof T, unknown>).keys(),
            ].map((k) => String(k));
          }
        }

        const children = this.childContexts.get(id);
        if (children) {
          children.forEach((childCtx, childName) => {
            const childPayload = childCtx.buildSyncPayload();
            if (childPayload.length > 0) {
              payload[childName] = childPayload;
            }
          });
        }

        return { record, payload };
      })
      .filter(({ record, payload }) => {
        if (record.state !== RecordState.Unchanged) return true;
        const id = String(record.data[this.idField]);
        const children = this.childContexts.get(id);
        if (!children) return false;
        return Array.from(children.keys()).some(
          (childName) => Array.isArray(payload[childName]) && (payload[childName] as unknown[]).length > 0,
        );
      })
      .map(({ payload }) => payload);
  }

  previewPayload(isJsonFormat: boolean = true): string | SyncPayload[] {
    if (isJsonFormat) return JSON.stringify(this.buildSyncPayload(), null, 2);
    return this.buildSyncPayload();
  }

  async save(): Promise<T> {
    const currentRecord = this.current;
    if (!currentRecord) throw new Error('No current record to save');
    if (!this.dataSource) throw new Error('Data source not configured');
    if (!this.dirty) throw new Error('No changes to save');

    const payloads = this.buildSyncPayload();
    const savedData = await this.dataSource.sync(payloads);
    const savedArray = Array.isArray(savedData) ? (savedData as T[]) : [savedData as T];
    for (let i = 0; i < savedArray.length; i++) {
      const oldId = payloads[i] ? String(payloads[i][this.idField as string]) : undefined;
      const item = savedArray[i];
      this.applySavedRecord(oldId ?? String(item[this.idField]), item);
    }
    return savedData as T;
  }

  private applySavedRecord(oldId: string, savedData: T): void {
    const newId = String(savedData[this.idField]);
    const recordCopy = structuredClone(savedData);
    const { cleaned, nested } = this.extractNestedDetails(recordCopy);

    const trackedRecord: TrackedRecord<T> = {
      data: cleaned,
      state: RecordState.Unchanged,
      original: structuredClone(cleaned),
      _modifiedFields: undefined,
    };

    const newRecords = [...this._records];
    const actualIndex = newRecords.findIndex((r) => String(r.data[this.idField]) === oldId);
    if (actualIndex !== -1) newRecords[actualIndex] = trackedRecord;
    this._records = newRecords;

    const oldChildContexts = this.childContexts.get(oldId);
    if (oldChildContexts) {
      oldChildContexts.forEach((child) => child.clear());
      this.childContexts.delete(oldId);
    }

    this.loadNestedIntoChildContexts(newId, nested);
    this.notify();
  }

  // ============================================================================
  // Foreign Key Management
  // ============================================================================

  updateForeignKeyReferences(oldParentId: string, newParentId: string): void {
    if (!this.foreignKey) return;

    this._records = this._records.map((record) => {
      if (String(record.data[this.foreignKey!]) === oldParentId) {
        return { ...record, data: { ...record.data, [this.foreignKey!]: newParentId } };
      }
      return record;
    });

    this.childContexts.forEach((childMap) => {
      childMap.forEach((childCtx) => {
        childCtx.updateForeignKeyReferences(oldParentId, newParentId);
      });
    });

    this.notify();
  }

  // ============================================================================
  // Private Helpers
  // ============================================================================

  private extractNestedDetails(record: T): {
    cleaned: T;
    nested: Record<string, unknown[]>;
  } {
    if (this.childDefinitions.length === 0) return { cleaned: record, nested: {} };

    const cleaned = { ...record };
    const nested: Record<string, unknown[]> = {};

    this.childDefinitions.forEach(([childName]) => {
      const childData = (record as Record<string, unknown>)[childName];
      if (childData && Array.isArray(childData) && (childData.length === 0 || typeof childData[0] === 'object')) {
        nested[childName] = childData as unknown[];
        delete (cleaned as Record<string, unknown>)[childName];
      }
    });

    return { cleaned, nested };
  }

  private loadNestedIntoChildContexts(
    recordId: string,
    nested: Record<string, unknown[]>,
  ): void {
    if (Object.keys(nested).length === 0) return;
    this.initializeChildContexts(recordId);
    const childMap = this.childContexts.get(recordId);
    if (!childMap) return;
    Object.entries(nested).forEach(([name, items]) => {
      childMap.get(name)?.loadRecords(items as Record<string, unknown>[]);
    });
  }

  private mapRecordState(state: RecordState): 'New' | 'Modified' | 'Deleted' | 'Unchanged' {
    switch (state) {
      case RecordState.New: return 'New';
      case RecordState.Modified: return 'Modified';
      case RecordState.Deleted: return 'Deleted';
      default: return 'Unchanged';
    }
  }

  private detectChanges<TChange extends Record<string, unknown>>(
    original: TChange | undefined,
    current: TChange,
  ): boolean {
    if (!original) return true;
    const allKeys = new Set([...Object.keys(original), ...Object.keys(current)]);
    return [...allKeys].some(
      (key) => !deepEqual(original[key as keyof TChange], current[key as keyof TChange]),
    );
  }

  private computeModifiedFields<TRec extends Record<string, unknown>>(
    original: TRec | undefined,
    current: TRec,
  ): Map<keyof TRec, { oldValue: unknown; newValue: unknown }> {
    if (!original) return new Map();

    const allKeys = new Set([
      ...Object.keys(current as object),
      ...Object.keys(original as object),
    ]) as Set<keyof TRec>;

    const modifiedFields = new Map<keyof TRec, { oldValue: unknown; newValue: unknown }>();
    allKeys.forEach((key) => {
      const currentValue = current[key];
      const originalValue = original[key];
      if (!deepEqual(currentValue, originalValue)) {
        modifiedFields.set(key, { oldValue: originalValue, newValue: currentValue });
      }
    });

    return modifiedFields;
  }

  // ============================================================================
  // Navigation
  // ============================================================================

  private emitNavigationChange(): void {
    this.notify();
  }

  next(): boolean {
    if (!this.hasNext) return false;
    this._currentIndex++;
    this.emitNavigationChange();
    this.notify();
    return true;
  }

  previous(): boolean {
    if (!this.hasPrevious) return false;
    this._currentIndex--;
    this.emitNavigationChange();
    this.notify();
    return true;
  }

  first(): boolean {
    if (this.navigationRecords.length === 0) return false;
    this._currentIndex = 0;
    this.emitNavigationChange();
    this.notify();
    return true;
  }

  last(): boolean {
    const len = this.navigationRecords.length;
    if (len === 0) return false;
    this._currentIndex = len - 1;
    this.emitNavigationChange();
    this.notify();
    return true;
  }

  skip(index: number): boolean {
    if (index < 0 || index >= this.navigationRecords.length) return false;
    this._currentIndex = index;
    this.emitNavigationChange();
    this.notify();
    return true;
  }

  peek(index: number): RecordHandle<T, TDetails> | undefined {
    if (index < 0 || index >= this._records.length) return undefined;
    return this.createHandle(this._records[index]);
  }

  private clampCurrentIndexAfterDelete(): void {
    const active = this.navigationRecords;
    if (active.length === 0) {
      this._currentIndex = -1;
      this.emitNavigationChange();
      return;
    }
    const idx = this._currentIndex;
    if (idx >= active.length) {
      this._currentIndex = active.length - 1;
      this.emitNavigationChange();
    }
  }

  // ============================================================================
  // Record Handle
  // ============================================================================

  private createHandle(record: TrackedRecord<T>): RecordHandle<T, TDetails> {
    const id = String(record.data[this.idField]);

    const getMergedData = (): T => {
      const childMap = this.childContexts.get(id);
      const inMemoryDetails = this.childDefinitions.filter(([, def]) => !def.dataSource);

      if (!childMap || inMemoryDetails.length === 0) return record.data;

      const detailSlices: Partial<T> = {};
      inMemoryDetails.forEach(([name]) => {
        const childCtx = childMap.get(name);
        if (childCtx) (detailSlices as Record<string, unknown>)[name] = childCtx.data;
      });

      return { ...record.data, ...detailSlices };
    };

    const handle = {
      record,
      get data() { return getMergedData(); },
      id,
      update: (data: Partial<T>) => this.update(id, data),
      patch: (data: Partial<T>) => this.patch(id, data),
      delete: (cascade?: boolean) => this.delete(id, cascade),
      discard: () => this.discardRecord(id),
      getDetail: <K extends keyof TDetails>(detailName: K) => this.getDetail(id, detailName),
      dirty: () => this.currentDirty,
    } as RecordHandle<T, TDetails>;

    this.childDefinitions.forEach(([detailName]) => {
      Object.defineProperty(handle, detailName, {
        get: () => this.getDetail(id, detailName as keyof TDetails),
        enumerable: true,
        configurable: true,
      });
    });

    return handle;
  }
}
