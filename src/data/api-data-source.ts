import type {
  DataSourceOptions,
  DataSourcePagedResponse,
  DataSourceQueryParams,
  DataSourceInterceptor,
  BatchOperationRequest,
  BatchOperationResponse,
  SyncPayload,
  IDataSource,
} from './types.js';
import { getItemId, extractId } from './utils.js';
import { buildQueryString, httpRequest } from './http-utils.js';

export class ApiDataSource<T> implements IDataSource<T> {
  private baseUrl: string;
  private endpoint: string;
  private headers: Record<string, string>;
  private idField: keyof T | ((item: T) => string);
  private interceptors?: DataSourceInterceptor[];
  private mapResponse?: (raw: unknown) => DataSourcePagedResponse<T>;
  private mapItem?: (raw: unknown) => T;

  constructor(options: DataSourceOptions<T>) {
    if (!options.baseUrl) throw new Error('baseUrl is required for ApiDataSource');
    if (!options.endpoint) throw new Error('endpoint is required for ApiDataSource');

    this.baseUrl = options.baseUrl;
    this.endpoint = options.endpoint;
    this.idField = options.idField || ('id' as keyof T);
    this.interceptors = options.interceptors;
    this.mapResponse = options.mapResponse;
    this.mapItem = options.mapItem;
    this.headers = { 'Content-Type': 'application/json', ...options.headers };
  }

  private request<R>(endpoint: string, method: string = 'GET', body?: unknown): Promise<R> {
    return httpRequest<R>(this.baseUrl, endpoint, this.headers, method, body, this.interceptors);
  }

  private requestPaged(
    endpoint: string,
    method: string = 'GET',
    body?: unknown,
  ): Promise<DataSourcePagedResponse<T>> {
    if (this.mapResponse) {
      const mapFn = this.mapResponse;
      return this.request<unknown>(endpoint, method, body).then((raw) => mapFn(raw));
    }
    return this.request<DataSourcePagedResponse<T>>(endpoint, method, body);
  }

  private requestItem(endpoint: string, method: string = 'GET', body?: unknown): Promise<T> {
    if (this.mapItem) {
      const mapFn = this.mapItem;
      return this.request<unknown>(endpoint, method, body).then((raw) => mapFn(raw));
    }
    return this.request<T>(endpoint, method, body);
  }

  read(params: DataSourceQueryParams = {}): Promise<DataSourcePagedResponse<T>> {
    const queryString = buildQueryString(params);
    return this.requestPaged(`${this.endpoint}${queryString}`);
  }

  getById(id: string): Promise<T> {
    return this.requestItem(`${this.endpoint}/${encodeURIComponent(id)}`);
  }

  create(item: Partial<T>): Promise<T> {
    return this.requestItem(this.endpoint, 'POST', item);
  }

  async update(item: Partial<T> & { id?: string }): Promise<T> {
    const id = item.id || getItemId(item as T, this.idField);
    if (!id) throw new Error('Item must have an id for update');
    return this.requestItem(`${this.endpoint}/${encodeURIComponent(id)}`, 'PUT', item);
  }

  async patch(id: string, changes: Partial<T>): Promise<T> {
    if (!id) throw new Error('ID is required for patch');
    return this.requestItem(`${this.endpoint}/${encodeURIComponent(id)}`, 'PATCH', changes);
  }

  async delete(item: T | { id: string }): Promise<void> {
    const id = extractId(item, this.idField);
    if (!id) throw new Error('Item must have an id for delete');
    return this.request<void>(`${this.endpoint}/${encodeURIComponent(id)}`, 'DELETE');
  }

  search(
    query: string,
    searchFields?: string[],
    params?: DataSourceQueryParams,
  ): Promise<DataSourcePagedResponse<T>> {
    const mergedParams: DataSourceQueryParams = { ...params, searchTerm: query };
    if (searchFields && searchFields.length > 0) {
      mergedParams.searchFields = searchFields.join(',');
    }
    return this.read(mergedParams);
  }

  batchCreate(items: Partial<T>[]): Promise<T[]> {
    return this.request<T[]>(`${this.endpoint}/batch`, 'POST', items);
  }

  batchUpdate(items: (Partial<T> & { id?: string })[]): Promise<T[]> {
    return this.request<T[]>(`${this.endpoint}/batch`, 'PUT', items);
  }

  batchDelete(items: (T | { id: string })[]): Promise<void> {
    const ids = items.map((item) => extractId(item, this.idField));
    return this.request<void>(`${this.endpoint}/batch`, 'DELETE', { ids });
  }

  batch(request: BatchOperationRequest<T>): Promise<BatchOperationResponse<T>> {
    const requestBody = {
      operations: request.operations.map((op) => {
        if (op.operation === 'delete') {
          return {
            operation: 'delete' as const,
            data: { id: extractId(op.data as T | { id: string }, this.idField) },
          };
        }
        return { operation: op.operation, data: op.data };
      }),
    };
    return this.request<BatchOperationResponse<T>>(
      `${this.endpoint}/batch-operations`,
      'POST',
      requestBody,
    );
  }

  sync(data: SyncPayload[]): Promise<T> {
    return this.request<T>(`${this.endpoint}/sync`, 'POST', data);
  }
}

export function createApiDataSource<T>(
  baseUrl: string,
  endpoint: string,
  options?: Partial<DataSourceOptions<T>>,
): ApiDataSource<T> {
  return new ApiDataSource<T>({ ...options, baseUrl, endpoint });
}
