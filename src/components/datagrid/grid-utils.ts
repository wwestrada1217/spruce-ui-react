import type {
  ColumnDef,
  ColumnFilter,
  ColumnState,
  FilterOperator,
  SortDirection,
  SortEntry,
} from './grid-types';

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function buildColumnState<T>(columns: ColumnDef<T>[]): ColumnState[] {
  return columns.map((col, i) => ({
    field: col.field,
    width: col.width ?? 150,
    visible: col.visible ?? true,
    sortDirection: null as SortDirection,
    order: i,
    pinned: col.pinned ?? null,
  }));
}

export function sortRows<T>(
  data: T[],
  field: string,
  direction: SortDirection,
  comparator?: (a: unknown, b: unknown, rowA: T, rowB: T) => number,
): T[] {
  if (!direction || !field) return [...data];
  const sign = direction === 'asc' ? 1 : -1;
  return [...data].sort((a, b) => {
    const va = (a as Record<string, unknown>)[field];
    const vb = (b as Record<string, unknown>)[field];
    if (comparator) return comparator(va, vb, a, b) * sign;
    if (va == null && vb == null) return 0;
    if (va == null) return -1 * sign;
    if (vb == null) return 1 * sign;
    if (typeof va === 'string' && typeof vb === 'string')
      return va.localeCompare(vb, undefined, { sensitivity: 'base' }) * sign;
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * sign;
    return String(va).localeCompare(String(vb)) * sign;
  });
}

export function sortMultiRows<T>(
  data: T[],
  sorts: SortEntry[],
  comparators?: Map<string, (a: unknown, b: unknown, rowA: T, rowB: T) => number>,
): T[] {
  if (!sorts.length) return [...data];
  return [...data].sort((a, b) => {
    for (const { field, direction } of sorts) {
      const sign = direction === 'asc' ? 1 : -1;
      const va = (a as Record<string, unknown>)[field];
      const vb = (b as Record<string, unknown>)[field];
      const comp = comparators?.get(field);
      let cmp: number;
      if (comp) {
        cmp = comp(va, vb, a, b);
      } else if (va == null && vb == null) {
        cmp = 0;
      } else if (va == null) {
        cmp = -1;
      } else if (vb == null) {
        cmp = 1;
      } else if (typeof va === 'string' && typeof vb === 'string') {
        cmp = va.localeCompare(vb, undefined, { sensitivity: 'base' });
      } else if (typeof va === 'number' && typeof vb === 'number') {
        cmp = va - vb;
      } else {
        cmp = String(va).localeCompare(String(vb));
      }
      if (cmp !== 0) return cmp * sign;
    }
    return 0;
  });
}

export function getCellValue<T>(row: T, field: string): unknown {
  const parts = field.split('.');
  let val: unknown = row;
  for (const p of parts) val = (val as Record<string, unknown>)?.[p];
  return val;
}

export const FILTER_OPERATORS: { op: FilterOperator; label: string }[] = [
  { op: 'contains', label: 'Contains' },
  { op: 'notContains', label: 'Does not contain' },
  { op: 'equals', label: 'Equals' },
  { op: 'notEquals', label: 'Not equals' },
  { op: 'startsWith', label: 'Starts with' },
  { op: 'endsWith', label: 'Ends with' },
  { op: 'greaterThan', label: 'Greater than' },
  { op: 'lessThan', label: 'Less than' },
  { op: 'greaterThanOrEqual', label: '≥' },
  { op: 'lessThanOrEqual', label: '≤' },
  { op: 'between', label: 'Between' },
  { op: 'blank', label: 'Is blank' },
  { op: 'notBlank', label: 'Is not blank' },
];

export function matchesFilter(cellValue: unknown, filter: ColumnFilter): boolean {
  const cv = cellValue == null ? '' : String(cellValue).toLowerCase();
  const fv = filter.value == null ? '' : String(filter.value).toLowerCase();
  switch (filter.operator) {
    case 'contains':
      return cv.includes(fv);
    case 'notContains':
      return !cv.includes(fv);
    case 'equals':
      return cv === fv;
    case 'notEquals':
      return cv !== fv;
    case 'startsWith':
      return cv.startsWith(fv);
    case 'endsWith':
      return cv.endsWith(fv);
    case 'blank':
      return String(cellValue ?? '').trim() === '';
    case 'notBlank':
      return String(cellValue ?? '').trim() !== '';
    case 'greaterThan':
      return Number(cellValue) > Number(filter.value);
    case 'lessThan':
      return Number(cellValue) < Number(filter.value);
    case 'greaterThanOrEqual':
      return Number(cellValue) >= Number(filter.value);
    case 'lessThanOrEqual':
      return Number(cellValue) <= Number(filter.value);
    case 'between':
      return (
        Number(cellValue) >= Number(filter.value) &&
        Number(cellValue) <= Number(filter.value2 ?? filter.value)
      );
    default:
      return true;
  }
}

export function applyFilters<T>(rows: T[], filters: Record<string, ColumnFilter>): T[] {
  const entries = Object.entries(filters);
  if (!entries.length) return rows;
  return rows.filter((row) =>
    entries.every(([field, filter]) => matchesFilter(getCellValue(row, field), filter)),
  );
}

export function computeAggregate<T>(rows: T[], field: string, col: ColumnDef<T>): string {
  const agg = col.aggregate;
  if (!agg) return '';
  const nums = rows.map((r) => Number(getCellValue(r, field))).filter((n) => !isNaN(n));
  let result: unknown;
  switch (agg.type) {
    case 'sum':
      result = nums.reduce((a, b) => a + b, 0);
      break;
    case 'avg':
      result = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
      break;
    case 'min':
      result = nums.length ? Math.min(...nums) : null;
      break;
    case 'max':
      result = nums.length ? Math.max(...nums) : null;
      break;
    case 'count':
      result = rows.length;
      break;
    case 'custom':
      result = agg.fn ? agg.fn(rows) : null;
      break;
    default:
      result = null;
  }
  if (agg.formatter) return agg.formatter(result, rows);
  const prefix = agg.label ?? '';
  if (result == null) return prefix + '\u2014';
  if (typeof result === 'number') {
    return (
      prefix +
      (agg.type === 'avg'
        ? result.toFixed(1)
        : Number.isInteger(result)
          ? String(result)
          : result.toFixed(2))
    );
  }
  return prefix + String(result);
}
