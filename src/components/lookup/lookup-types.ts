import type { ReactNode } from 'react';
import type {
  DataSourcePagedResponse,
  DataSourceQueryParams,
  IReadableDataSource,
} from '../../data/types.js';

export interface LookupOption {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
  icon?: string;
  color?: string;
}

export interface LookupColumn {
  key: string;
  label: string;
  width?: string;
  minWidth?: number;
}

export interface LookupRenderContext<T = unknown> {
  item: T;
  option: LookupOption;
  selected: boolean;
  highlighted: boolean;
}

export type LookupSource<T = unknown> = readonly T[] | IReadableDataSource<T> | string;

export function isLookupSource<T>(source: LookupSource<T>): source is IReadableDataSource<T> {
  return typeof source === 'object' && source !== null && !Array.isArray(source) && 'read' in source && typeof source.read === 'function';
}

export function readLookupProperty(item: unknown, key: string): unknown {
  if (item === null || item === undefined) return undefined;
  if (typeof item !== 'object') return item;
  return (item as Record<string, unknown>)[key];
}

export function normalizeLookupOption(
  item: unknown,
  displayField = 'label',
  valueField = 'value',
): LookupOption {
  if (typeof item === 'string' || typeof item === 'number') {
    return { label: String(item), value: String(item) };
  }
  const record = (item ?? {}) as Record<string, unknown>;
  return {
    label: String(record[displayField] ?? record.label ?? record[valueField] ?? ''),
    value: String(record[valueField] ?? record.value ?? record[displayField] ?? ''),
    disabled: typeof record.disabled === 'boolean' ? record.disabled : undefined,
    description: typeof record.description === 'string' ? record.description : undefined,
    icon: typeof record.icon === 'string' ? record.icon : undefined,
    color: typeof record.color === 'string' ? record.color : undefined,
  };
}

export function getLookupItemValue<T>(
  items: readonly T[],
  value: string,
  valueField = 'value',
  displayField = 'label',
): T | undefined {
  return items.find((item) => normalizeLookupOption(item, displayField, valueField).value === value);
}

function localPage<T>(items: readonly T[], params: DataSourceQueryParams): DataSourcePagedResponse<T> {
  const query = params.searchTerm?.trim().toLowerCase();
  const fields = params.searchFields?.split(',').map((field) => field.trim()).filter(Boolean);
  const filtered = query
    ? items.filter((item) => {
        const record = item as unknown as Record<string, unknown>;
        const values = fields?.length
          ? fields.map((field) => record[field])
          : Object.values(record);
        return values.some((value) => String(value ?? '').toLowerCase().includes(query));
      })
    : [...items];
  const pageSize = Math.max(1, params.pageSize ?? (filtered.length || 1));
  const pageNumber = Math.max(1, params.pageNumber ?? 1);
  const totalRecords = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const page = Math.min(pageNumber, totalPages);
  return {
    pageNumber: page,
    pageSize,
    totalPages,
    totalRecords,
    data: filtered.slice((page - 1) * pageSize, page * pageSize),
    hasPrevious: page > 1,
    hasNext: page < totalPages,
  };
}

export async function readLookupPage<T>(
  source: LookupSource<T>,
  params: DataSourceQueryParams = {},
): Promise<DataSourcePagedResponse<T>> {
  if (Array.isArray(source)) return localPage(source, params);
  if (typeof source === 'string') {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (typeof value === 'object') query.set(key, JSON.stringify(value));
      else query.set(key, String(value));
    });
    const response = await fetch(`${source}${query.size ? `?${query}` : ''}`);
    if (!response.ok) throw new Error(`Lookup request failed (${response.status})`);
    const payload: unknown = await response.json();
    if (Array.isArray(payload)) return localPage(payload as T[], params);
    const record = payload as Partial<DataSourcePagedResponse<T>> & { items?: T[]; results?: T[] };
    const data = record.data ?? record.items ?? record.results ?? [];
    return {
      pageNumber: record.pageNumber ?? params.pageNumber ?? 1,
      pageSize: record.pageSize ?? params.pageSize ?? data.length,
      totalPages: record.totalPages ?? 1,
      totalRecords: record.totalRecords ?? data.length,
      data,
      hasPrevious: record.hasPrevious ?? false,
      hasNext: record.hasNext ?? false,
    };
  }
  if (isLookupSource(source)) {
    return params.searchTerm
      ? source.search(params.searchTerm, params.searchFields?.split(','), params)
      : source.read(params);
  }
  return localPage([], params);
}

export type LookupRenderer<T = unknown> = (context: LookupRenderContext<T>) => ReactNode;
