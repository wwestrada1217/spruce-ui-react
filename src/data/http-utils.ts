import type { DataSourceInterceptor, DataSourceQueryParams, HttpRequestContext } from './types.js';

// ============================================================================
// Query String Builder
// ============================================================================

export function buildQueryString(params?: DataSourceQueryParams): string {
  if (!params) return '';

  const queryParams = new URLSearchParams();
  const { custom, ...standardParams } = params;

  for (const [key, value] of Object.entries(standardParams)) {
    if (value === undefined || value === null || value === '') continue;

    if (key === 'filter' && typeof value === 'object') {
      queryParams.append(key, JSON.stringify(value));
    } else {
      queryParams.append(key, String(value));
    }
  }

  if (custom) {
    for (const [key, value] of Object.entries(custom)) {
      if (value === undefined || value === null || value === '') continue;
      queryParams.append(key, String(value));
    }
  }

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
}

// ============================================================================
// HTTP Request with Fetch
// ============================================================================

async function doFetch<R>(ctx: HttpRequestContext): Promise<R> {
  const options: RequestInit = {
    method: ctx.method,
    headers: ctx.headers,
    credentials: 'same-origin',
  };

  if (ctx.body !== undefined) {
    options.body = JSON.stringify(ctx.body);
  }

  const response = await fetch(ctx.url, options);

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = (await response.json()) as Record<string, string>;
      errorMessage =
        errorData['message'] ?? errorData['error'] ?? errorData['title'] ?? errorMessage;
    } catch {
      // If response isn't JSON, use default message
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as R;
  }

  return response.json() as Promise<R>;
}

function runWithInterceptors<R>(
  context: HttpRequestContext,
  interceptors?: DataSourceInterceptor[],
): Promise<R> {
  if (!interceptors || interceptors.length === 0) {
    return doFetch<R>(context);
  }

  const execute = (ctx: HttpRequestContext, idx: number): Promise<unknown> => {
    if (idx >= interceptors.length) return doFetch<unknown>(ctx);
    return interceptors[idx](ctx, (nextCtx) => execute(nextCtx, idx + 1));
  };

  return execute(context, 0) as Promise<R>;
}

// ============================================================================
// Unified HTTP Request (applies middleware interceptors)
// ============================================================================

export function httpRequest<R>(
  baseUrl: string,
  endpoint: string,
  headers: Record<string, string>,
  method: string = 'GET',
  body?: unknown,
  interceptors?: DataSourceInterceptor[],
): Promise<R> {
  const url = `${baseUrl}${endpoint}`;
  return runWithInterceptors<R>({ url, method, headers, body }, interceptors);
}

/**
 * Direct HTTP request for custom URL-based data sources (HttpDataSource).
 */
export function httpRequestDirect<R>(
  url: string,
  headers: Record<string, string>,
  method: string = 'GET',
  body?: unknown,
  interceptors?: DataSourceInterceptor[],
): Promise<R> {
  return runWithInterceptors<R>({ url, method, headers, body }, interceptors);
}
