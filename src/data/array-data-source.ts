import type {
  DataSourceOptions,
  DataSourcePagedResponse,
  DataSourceQueryParams,
  FilterExpression,
  BatchOperationRequest,
  BatchOperationResponse,
  BatchOperationResult,
  SyncPayload,
  IDataSource,
} from './types.js';
import { evaluateFilterExpression, parseStringFilter } from './filter.js';
import { getItemId, extractId, generateId } from './utils.js';

export class ArrayDataSource<T> implements IDataSource<T> {
  private data: T[];
  private idField: keyof T | ((item: T) => string);
  private defaultPageSize: number;
  private index: Map<string, number>;

  constructor(options: DataSourceOptions<T> = {}) {
    this.data = options.data ? [...options.data] : [];
    this.idField = options.idField || ('id' as keyof T);
    this.defaultPageSize = options.pageSize || 10;
    this.index = new Map();
    this.rebuildIndex();
  }

  private rebuildIndex(): void {
    this.index.clear();
    for (let i = 0; i < this.data.length; i++) {
      const id = getItemId(this.data[i], this.idField);
      this.index.set(id, i);
    }
  }

  private findIndexById(id: string): number {
    return this.index.get(id) ?? -1;
  }

  private createPagedResponse(
    data: T[],
    pageNumber: number = 1,
    pageSize: number = this.defaultPageSize,
  ): DataSourcePagedResponse<T> {
    const totalRecords = data.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pagedData = data.slice(startIndex, endIndex);

    return {
      pageNumber,
      pageSize,
      totalPages,
      totalRecords,
      data: pagedData,
      hasPrevious: pageNumber > 1,
      hasNext: pageNumber < totalPages,
    };
  }

  private applyFilters(data: T[], params: DataSourceQueryParams): T[] {
    let filtered: T[] | undefined;

    if (params.filter) {
      const expr: FilterExpression =
        typeof params.filter === 'string' ? parseStringFilter(params.filter) : params.filter;
      filtered = data.filter((item) => evaluateFilterExpression(item, expr));
    }

    if (params.searchTerm) {
      const source = filtered ?? data;
      const searchTerm = params.searchTerm.toLowerCase();
      const searchFields = params.searchFields?.split(',').map((f) => f.trim());

      filtered = source.filter((item) => {
        if (searchFields && searchFields.length > 0) {
          return searchFields.some((field) =>
            String((item as Record<string, unknown>)[field] ?? '')
              .toLowerCase()
              .includes(searchTerm),
          );
        }
        return Object.values(item as Record<string, unknown>).some((value) =>
          String(value).toLowerCase().includes(searchTerm),
        );
      });
    }

    if (params.sortBy) {
      if (!filtered) filtered = [...data];

      const sortFields = params.sortBy.split(',').map((s) => {
        const [field, order] = s.trim().split(':');
        return { field, desc: order === 'desc' };
      });

      filtered.sort((a, b) => {
        for (const { field, desc } of sortFields) {
          const aVal = (a as Record<string, unknown>)[field];
          const bVal = (b as Record<string, unknown>)[field];
          const cmp = aVal! > bVal! ? 1 : aVal! < bVal! ? -1 : 0;
          if (cmp !== 0) return desc ? -cmp : cmp;
        }
        return 0;
      });
    }

    return filtered ?? data;
  }

  read(params: DataSourceQueryParams = {}): Promise<DataSourcePagedResponse<T>> {
    const filtered = this.applyFilters(this.data, params);
    const pageNumber = params.pageNumber || 1;
    const pageSize = params.pageSize || this.defaultPageSize;
    return Promise.resolve(this.createPagedResponse(filtered, pageNumber, pageSize));
  }

  getById(id: string): Promise<T> {
    const index = this.findIndexById(id);
    if (index === -1) return Promise.reject(new Error(`Item with id ${id} not found`));
    return Promise.resolve(this.data[index]);
  }

  create(item: Partial<T>): Promise<T> {
    const newItem = { ...item } as T;
    if (!getItemId(newItem, this.idField)) {
      if (typeof this.idField === 'string') {
        (newItem as Record<string, unknown>)[this.idField] = generateId();
      }
    }
    this.data.push(newItem);
    const id = getItemId(newItem, this.idField);
    this.index.set(id, this.data.length - 1);
    return Promise.resolve(newItem);
  }

  update(item: Partial<T> & { id?: string }): Promise<T> {
    const id = item.id || getItemId(item as T, this.idField);
    const index = this.findIndexById(id);
    if (index === -1) return Promise.reject(new Error(`Item with id ${id} not found`));
    this.data[index] = { ...this.data[index], ...item };
    return Promise.resolve(this.data[index]);
  }

  patch(id: string, changes: Partial<T>): Promise<T> {
    const index = this.findIndexById(id);
    if (index === -1) return Promise.reject(new Error(`Item with id ${id} not found`));
    this.data[index] = { ...this.data[index], ...changes };
    return Promise.resolve(this.data[index]);
  }

  delete(item: T | { id: string }): Promise<void> {
    const id = extractId(item, this.idField);
    const index = this.findIndexById(id);
    if (index === -1) return Promise.reject(new Error(`Item with id ${id} not found`));
    this.data.splice(index, 1);
    this.rebuildIndex();
    return Promise.resolve();
  }

  search(
    query: string,
    searchFields?: string[],
    params?: DataSourceQueryParams,
  ): Promise<DataSourcePagedResponse<T>> {
    return this.read({
      ...params,
      searchTerm: query,
      searchFields: searchFields?.join(','),
    });
  }

  batchCreate(items: Partial<T>[]): Promise<T[]> {
    const createdItems: T[] = [];
    for (const item of items) {
      const newItem = { ...item } as T;
      if (!getItemId(newItem, this.idField)) {
        if (typeof this.idField === 'string') {
          (newItem as Record<string, unknown>)[this.idField] = generateId();
        }
      }
      this.data.push(newItem);
      const id = getItemId(newItem, this.idField);
      this.index.set(id, this.data.length - 1);
      createdItems.push(newItem);
    }
    return Promise.resolve(createdItems);
  }

  batchUpdate(items: (Partial<T> & { id?: string })[]): Promise<T[]> {
    const updatedItems: T[] = [];
    for (const item of items) {
      const id = item.id || getItemId(item as T, this.idField);
      const index = this.findIndexById(id);
      if (index === -1) return Promise.reject(new Error(`Item with id ${id} not found`));
      this.data[index] = { ...this.data[index], ...item };
      updatedItems.push(this.data[index]);
    }
    return Promise.resolve(updatedItems);
  }

  batchDelete(items: (T | { id: string })[]): Promise<void> {
    const idsToDelete = new Set(items.map((item) => extractId(item, this.idField)));
    const originalLength = this.data.length;
    this.data = this.data.filter((d) => !idsToDelete.has(getItemId(d, this.idField)));
    if (this.data.length === originalLength) {
      return Promise.reject(new Error('One or more items not found for delete'));
    }
    this.rebuildIndex();
    return Promise.resolve();
  }

  batch(request: BatchOperationRequest<T>): Promise<BatchOperationResponse<T>> {
    const snapshot = this.data.map((d) => ({ ...d }));
    const snapshotIndex = new Map(this.index);
    const results: BatchOperationResult<T>[] = [];
    let totalCreated = 0;
    let totalUpdated = 0;
    let totalDeleted = 0;

    try {
      const deleteIds = new Set<string>();

      for (const operation of request.operations) {
        if (operation.operation === 'create') {
          const newItem = { ...operation.data } as T;
          if (!getItemId(newItem, this.idField)) {
            if (typeof this.idField === 'string') {
              (newItem as Record<string, unknown>)[this.idField] = generateId();
            }
          }
          this.data.push(newItem);
          const id = getItemId(newItem, this.idField);
          this.index.set(id, this.data.length - 1);
          results.push({ operation: 'create', success: true, data: newItem });
          totalCreated++;
        } else if (operation.operation === 'update') {
          const item = operation.data as Partial<T> & { id?: string };
          const id = item.id || getItemId(item as T, this.idField);
          const index = this.findIndexById(id);
          if (index === -1) throw new Error(`Item with id ${id} not found for update`);
          this.data[index] = { ...this.data[index], ...item };
          results.push({ operation: 'update', success: true, data: this.data[index] });
          totalUpdated++;
        } else if (operation.operation === 'delete') {
          const id = extractId(operation.data as T | { id: string }, this.idField);
          const index = this.findIndexById(id);
          if (index === -1) throw new Error(`Item with id ${id} not found for delete`);
          deleteIds.add(id);
          results.push({ operation: 'delete', success: true });
          totalDeleted++;
        }
      }

      if (deleteIds.size > 0) {
        this.data = this.data.filter((d) => !deleteIds.has(getItemId(d, this.idField)));
        this.rebuildIndex();
      }
    } catch (error) {
      this.data = snapshot;
      this.index = snapshotIndex;
      return Promise.reject(error);
    }

    return Promise.resolve({ results, totalCreated, totalUpdated, totalDeleted, totalFailed: 0 });
  }

  sync(data: SyncPayload[]): Promise<T> {
    console.warn('ArrayDataSource.sync() called - this is a no-op for in-memory data sources');
    return Promise.resolve(data as unknown as T);
  }

  getAllData(): T[] {
    return [...this.data];
  }

  setData(data: T[]): void {
    this.data = [...data];
    this.rebuildIndex();
  }
}

export function createArrayDataSource<T>(
  data: T[],
  options?: Partial<DataSourceOptions<T>>,
): ArrayDataSource<T> {
  return new ArrayDataSource<T>({ ...options, data });
}
