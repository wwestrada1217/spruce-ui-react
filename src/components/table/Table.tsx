import './Table.css';
import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';
import { Icon } from '../../icons/Icon.js';
import { Pager } from '../pager/Pager.js';

export type TableSortDirection = 'asc' | 'desc' | null;
export type TableCellAlign = 'left' | 'center' | 'right';
export type TableDensity = 'compact' | 'comfortable' | 'spacious';

export interface TableSort<T extends object> {
  key: keyof T & string;
  direction: Exclude<TableSortDirection, null>;
}

export interface TableColumn<T extends object> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  value?: (row: T) => string | number | boolean | null | undefined;
}

export interface TableProps<T extends object> {
  rows?: readonly T[];
  columns?: readonly TableColumn<T>[];
  density?: TableDensity;
  pagination?: boolean;
  vertical?: boolean;
  pageSize?: number;
  page?: number;
  sort?: TableSort<T> | null;
  ariaLabel?: string;
  borders?: boolean;
  headerBackground?: boolean;
  striped?: boolean;
  hover?: boolean;
  emptyMessage?: string;
  cellAlign?: TableCellAlign;
  rowKey?: (row: T, index: number) => string | number;
  onSortChange?: (sort: TableSort<T>) => void;
  onPageChange?: (page: number) => void;
  className?: string;
  style?: CSSProperties;
}

function normalize(value: unknown): string | number {
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  return String(value ?? '').toLocaleLowerCase();
}

function renderValue(value: unknown): ReactNode {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

/** A small, semantic table for simple datasets that do not need Datagridex. */
export function Table<T extends object>({
  rows = [],
  columns = [],
  density = 'comfortable',
  pagination = true,
  vertical = false,
  pageSize = 10,
  page,
  sort: controlledSort,
  ariaLabel,
  borders = true,
  headerBackground = true,
  striped = false,
  hover = true,
  emptyMessage,
  cellAlign = 'left',
  rowKey,
  onSortChange,
  onPageChange,
  className = '',
  style,
}: TableProps<T>) {
  const { t } = useI18n();
  const [internalSort, setInternalSort] = useState<TableSort<T> | null>(null);
  const [internalPage, setInternalPage] = useState(1);
  const activeSort = controlledSort === undefined ? internalSort : controlledSort;
  const currentPage = page ?? internalPage;
  const safePageSize = Math.max(1, pageSize);

  const sortedRows = useMemo(() => {
    if (!activeSort) return [...rows];
    const column = columns.find((item) => item.key === activeSort.key);
    if (!column?.sortable) return [...rows];
    const factor = activeSort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((left, right) => {
      const leftValue = normalize(column.value ? column.value(left) : left[column.key]);
      const rightValue = normalize(column.value ? column.value(right) : right[column.key]);
      if (leftValue < rightValue) return -1 * factor;
      if (leftValue > rightValue) return 1 * factor;
      return 0;
    });
  }, [activeSort, columns, rows]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / safePageSize));
  const resolvedPage = Math.min(Math.max(1, currentPage), totalPages);
  const visibleRows = pagination
    ? sortedRows.slice((resolvedPage - 1) * safePageSize, resolvedPage * safePageSize)
    : sortedRows;
  const resolvedAriaLabel = ariaLabel ?? t('table');
  const resolvedEmptyMessage = emptyMessage ?? t('noRowsToDisplay');
  const tableClasses = [
    'sp-table',
    density !== 'comfortable' && `sp-table--density-${density}`,
    !borders && 'sp-table--borderless',
    !headerBackground && 'sp-table--header-plain',
    striped && 'sp-table--striped',
    hover && 'sp-table--hover',
    cellAlign !== 'left' && `sp-table--align-${cellAlign}`,
    vertical && 'sp-table--vertical',
  ].filter(Boolean).join(' ');

  function toggleSort(key: keyof T & string): void {
    const column = columns.find((item) => item.key === key);
    if (!column?.sortable) return;
    const direction: Exclude<TableSortDirection, null> =
      activeSort?.key !== key || activeSort.direction === 'desc' ? 'asc' : 'desc';
    const next: TableSort<T> = { key, direction };
    if (controlledSort === undefined) setInternalSort(next);
    onSortChange?.(next);
  }

  function changePage(nextPage: number): void {
    const next = Math.min(Math.max(1, nextPage), totalPages);
    if (page === undefined) setInternalPage(next);
    onPageChange?.(next);
  }

  function valueFor(row: T, column: TableColumn<T>): ReactNode {
    return renderValue(column.value ? column.value(row) : row[column.key]);
  }

  return (
    <div className={['sp-table-wrap', className].filter(Boolean).join(' ')} style={style}>
      <table className={tableClasses} aria-label={resolvedAriaLabel}>
        {vertical ? (
          <tbody>
            {columns.map((column) => (
              <tr key={column.key}>
                <th scope="row">{column.header}</th>
                <td>{sortedRows[0] ? valueFor(sortedRows[0], column) : '—'}</td>
              </tr>
            ))}
          </tbody>
        ) : (
          <>
            <thead>
              <tr>
                {columns.map((column) => {
                  const isSorted = activeSort?.key === column.key;
                  const ariaSort = !column.sortable
                    ? undefined
                    : isSorted && activeSort?.direction === 'desc'
                      ? 'descending'
                      : isSorted
                        ? 'ascending'
                        : 'none';
                  const iconName = !isSorted
                    ? 'arrow-up-down'
                    : activeSort?.direction === 'asc'
                      ? 'sort-asc'
                      : 'sort-desc';
                  return (
                    <th key={column.key} scope="col" aria-sort={ariaSort}>
                      <button
                        type="button"
                        className="sp-table__head-btn"
                        disabled={!column.sortable}
                        aria-label={column.sortable ? `${isSorted && activeSort?.direction === 'asc' ? t('sortDescending') : t('sortAscending')}: ${column.header}` : undefined}
                        onClick={() => toggleSort(column.key)}
                      >
                        <span>{column.header}</span>
                        {column.sortable && (
                          <Icon
                            name={iconName}
                            size={14}
                            className={['sp-table__sort-icon', isSorted && 'sp-table__sort-icon--active'].filter(Boolean).join(' ')}
                          />
                        )}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 ? (
                <tr className="sp-table__empty-row">
                  <td className="sp-table__empty-cell" colSpan={Math.max(1, columns.length)}>
                    {resolvedEmptyMessage}
                  </td>
                </tr>
              ) : (
                visibleRows.map((row, index) => (
                  <tr key={rowKey ? rowKey(row, index) : index}>
                    {columns.map((column) => <td key={column.key}>{valueFor(row, column)}</td>)}
                  </tr>
                ))
              )}
            </tbody>
          </>
        )}
      </table>
      {!vertical && pagination && sortedRows.length > safePageSize && (
        <div className="sp-table__pager">
          <Pager
            page={resolvedPage}
            pageSize={safePageSize}
            totalItems={sortedRows.length}
            onPageChange={changePage}
          />
        </div>
      )}
    </div>
  );
}

export type SpTableColumn<T extends object> = TableColumn<T>;
export type SpTableProps<T extends object> = TableProps<T>;
export type SpTableDensity = TableDensity;
export type SpTableCellAlign = TableCellAlign;
