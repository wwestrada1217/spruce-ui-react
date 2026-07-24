import type {
  DataSourcePagedResponse,
  DataSourceQueryParams,
  DataSourceInterceptor,
  BatchOperationRequest,
  BatchOperationResponse,
  SyncPayload,
  IDataSource,
} from './types.js';
import { getItemId, extractId } from './utils.js';
import { buildQueryString, httpRequestDirect } from './http-utils.js';

export interface HttpDataSourceOptions<T> {
  readUrl: string;
  createUrl?: string;
  updateUrl?: string;
  deleteUrl?: string;
  searchUrl?: string;
  batchUrl?: string;
  headers?: Record<string, string>;
  idField?: keyof T | ((item: T) => string);
  interceptors?: DataSourceInterceptor[];
  mapResponse?: (raw: unknown) => DataSourcePagedResponse<T>;
  mapItem?: (raw: unknown) => T;
}

export class HttpDataSource<T> implements IDataSource<T> {
  private readUrl: string;
  private createUrl?: string;
  private updateUrl?: string;
  private deleteUrl?: string;
  private searchUrl?: string;
  private batchUrl?: string;
  private headers: Record<string, string>;
  private idField: keyof T | ((item: T) => string);
  private interceptors?: DataSourceInterceptor[];
  private mapResponse?: (raw: unknown) => DataSourcePagedResponse<T>;
  private mapItem?: (raw: unknown) => T;

  constructor(options: HttpDataSourceOptions<T>) {
    this.readUrl = options.readUrl;
    this.createUrl = options.createUrl;
    this.updateUrl = options.updateUrl;
    this.deleteUrl = options.deleteUrl;
    this.searchUrl = options.searchUrl;
    this.batchUrl = options.batchUrl;
    this.idField = options.idField || ('id' as keyof T);
    this.interceptors = options.interceptors;
    this.mapResponse = options.mapResponse;
    this.mapItem = options.mapItem;
    this.headers = { 'Content-Type': 'application/json', ...options.headers };
  }

  private buildUrl(template: string, params: Record<string, string> = {}): string {
    let url = template;
    for (const key of Object.keys(params)) {
      url = url.replace(`{${key}}`, encodeURIComponent(params[key]));
    }
    return url;
  }

  private request<R>(url: string, method: string = 'GET', body?: unknown): Promise<R> {
    return httpRequestDirect<R>(url, this.headers, method, body, this.interceptors);
  }

  private requestPaged(
    url: string,
    method: string = 'GET',
    body?: unknown,
  ): Promise<DataSourcePagedResponse<T>> {
    if (this.mapResponse) {
      const mapFn = this.mapResponse;
      return this.request<unknown>(url, method, body).then((raw) => mapFn(raw));
    }
    return this.request<DataSourcePagedResponse<T>>(url, method, body);
  }

  private requestItem(url: string, method: string = 'GET', body?: unknown): Promise<T> {
    if (this.mapItem) {
      const mapFn = this.mapItem;
      return this.request<unknown>(url, method, body).then((raw) => mapFn(raw));
    }
    return this.request<T>(url, method, body);
  }

  read(params: DataSourceQueryParams = {}): Promise<DataSourcePagedResponse<T>> {
    const queryString = buildQueryString(params);
    return this.requestPaged(`${this.readUrl}${queryString}`);
  }

  async getById(id: string): Promise<T> {
    if (!id) throw new Error('ID is required');
    const url = this.readUrl.includes('{id}')
      ? this.buildUrl(this.readUrl, { id })
      : `${this.readUrl}/${encodeURIComponent(id)}`;
    return this.requestItem(url);
  }

  async create(item: Partial<T>): Promise<T> {
    if (!this.createUrl) throw new Error('createUrl not configured for this data source');
    return this.requestItem(this.createUrl, 'POST', item);
  }

  async update(item: Partial<T> & { id?: string }): Promise<T> {
    if (!this.updateUrl) throw new Error('updateUrl not configured for this data source');
    const id = item.id || getItemId(item as T, this.idField);
    if (!id) throw new Error('Item must have an id for update');
    const url = this.buildUrl(this.updateUrl, { id });
    return this.requestItem(url, 'PUT', item);
  }

  async patch(id: string, changes: Partial<T>): Promise<T> {
    if (!this.updateUrl) throw new Error('updateUrl not configured for this data source');
    if (!id) throw new Error('ID is required for patch');
    const url = this.buildUrl(this.updateUrl, { id });
    return this.requestItem(url, 'PATCH', changes);
  }

  async delete(item: T | { id: string }): Promise<void> {
    if (!this.deleteUrl) throw new Error('deleteUrl not configured for this data source');
    const id = extractId(item, this.idField);
    if (!id) throw new Error('Item must have an id for delete');
    const url = this.buildUrl(this.deleteUrl, { id });
    return this.request<void>(url, 'DELETE');
  }

  search(
    query: string,
    searchFields?: string[],
    params?: DataSourceQueryParams,
  ): Promise<DataSourcePagedResponse<T>> {
    const url = this.searchUrl || this.readUrl;
    const mergedParams: DataSourceQueryParams = { ...params, searchTerm: query };
    if (searchFields && searchFields.length > 0) {
      mergedParams.searchFields = searchFields.join(',');
    }
    const queryString = buildQueryString(mergedParams);
    return this.requestPaged(`${url}${queryString}`);
  }

  async batchCreate(items: Partial<T>[]): Promise<T[]> {
    const url = this.batchUrl || (this.createUrl ? `${this.createUrl}/batch` : null);
    if (!url) throw new Error('batchUrl or createUrl not configured for this data source');
    return this.request<T[]>(url, 'POST', items);
  }

  async batchUpdate(items: (Partial<T> & { id?: string })[]): Promise<T[]> {
    const url =
      this.batchUrl || (this.updateUrl ? `${this.updateUrl.replace('/{id}', '')}/batch` : null);
    if (!url) throw new Error('batchUrl or updateUrl not configured for this data source');
    return this.request<T[]>(url, 'PUT', items);
  }

  async batchDelete(items: (T | { id: string })[]): Promise<void> {
    const url =
      this.batchUrl || (this.deleteUrl ? `${this.deleteUrl.replace('/{id}', '')}/batch` : null);
    if (!url) throw new Error('batchUrl or deleteUrl not configured for this data source');
    const ids = items.map((item) => extractId(item, this.idField));
    return this.request<void>(url, 'DELETE', { ids });
  }

  async batch(request: BatchOperationRequest<T>): Promise<BatchOperationResponse<T>> {
    const url =
      this.batchUrl || (this.createUrl ? `${this.createUrl}/batch-operations` : null);
    if (!url) throw new Error('batchUrl or createUrl not configured for batch operations');

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

    return this.request<BatchOperationResponse<T>>(url, 'POST', requestBody);
  }

  async sync(data: SyncPayload[]): Promise<T> {
    const url = this.createUrl ? `${this.createUrl}/sync` : null;
    if (!url) throw new Error('createUrl not configured for sync operation');
    return this.request<T>(url, 'POST', data);
  }
}

export function createHttpDataSource<T>(
  urls: {
    read: string;
    create?: string;
    update?: string;
    delete?: string;
    search?: string;
    batch?: string;
  },
  options?: {
    headers?: Record<string, string>;
    idField?: keyof T | ((item: T) => string);
    interceptors?: DataSourceInterceptor[];
    mapResponse?: (raw: unknown) => DataSourcePagedResponse<T>;
    mapItem?: (raw: unknown) => T;
  },
): HttpDataSource<T> {
  return new HttpDataSource<T>({
    readUrl: urls.read,
    createUrl: urls.create,
    updateUrl: urls.update,
    deleteUrl: urls.delete,
    searchUrl: urls.search,
    batchUrl: urls.batch,
    headers: options?.headers,
    idField: options?.idField,
    interceptors: options?.interceptors,
    mapResponse: options?.mapResponse,
    mapItem: options?.mapItem,
  });
}
