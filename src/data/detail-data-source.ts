import type { DataSourcePagedResponse, DataSourceQueryParams, FlexibleDataSource } from './types.js';

export function createDetailDataSource<T>(
  loadByParentId: (parentId: string) => Promise<T[]> | T[],
): FlexibleDataSource<T> {
  const read = async (params?: DataSourceQueryParams): Promise<DataSourcePagedResponse<T>> => {
    const filter = params?.filter;
    const parentId =
      typeof filter === 'object' && filter !== null ? filter.filters?.[0]?.value : undefined;
    if (parentId === undefined || parentId === null || parentId === '') {
      throw new Error('createDetailDataSource: read() requires a foreign-key filter');
    }

    const data = await loadByParentId(String(parentId));
    return {
      pageNumber: 1,
      pageSize: data.length,
      totalPages: 1,
      totalRecords: data.length,
      data,
      hasPrevious: false,
      hasNext: false,
    };
  };

  return {
    read,
    getById: async () => {
      throw new Error('createDetailDataSource: getById() is not supported');
    },
    search: (_query, _fields, params) => read(params),
  };
}
