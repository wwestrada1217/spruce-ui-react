import type {
  DatagridDataContext,
  DatagridDataContextOptions,
  DatagridDataContextStateDisplay,
  DatagridRecordState,
  DatagridTrackedRecord,
  DatagridValidationError,
} from './datagrid-types.js';

function read<T>(value: T | (() => T)): T {
  return typeof value === 'function' ? (value as () => T)() : value;
}

const EMPTY_ERRORS: ReadonlyMap<string, readonly DatagridValidationError[]> = new Map();

/**
 * React-side adapter for the framework-neutral DataContext contract used by Datagrid.
 * It accepts the existing Spruce React DataContext as well as small structural adapters.
 */
export class DatagridDataContextAdapter<T extends object> {
  readonly context: DatagridDataContext<T>;
  private readonly options: Required<
    Omit<DatagridDataContextOptions<T>, 'newRowDefaults'>
  > & Pick<DatagridDataContextOptions<T>, 'newRowDefaults'>;

  constructor(
    context: DatagridDataContext<T>,
    options: DatagridDataContextOptions<T> = {},
  ) {
    this.context = context;
    this.options = {
      synchronizeSelection: options.synchronizeSelection ?? true,
      stateDisplay: options.stateDisplay ?? 'none',
      validationDisplay: options.validationDisplay ?? 'row-and-cell',
      blockInvalidSave: options.blockInvalidSave ?? true,
      toolbarActions: options.toolbarActions ?? true,
      cascadeDelete: options.cascadeDelete ?? false,
      newRowDefaults: options.newRowDefaults,
    };
  }

  get rows(): readonly T[] {
    return read(this.context.data);
  }

  get loading(): boolean {
    return this.context.loading === undefined ? false : read(this.context.loading);
  }

  get dirty(): boolean {
    return this.context.dirty === undefined ? false : read(this.context.dirty);
  }

  get synchronizeSelection(): boolean {
    return this.options.synchronizeSelection;
  }

  get toolbarActions(): boolean {
    return this.options.toolbarActions;
  }

  get stateDisplay(): DatagridDataContextStateDisplay {
    return this.options.stateDisplay;
  }

  get validationDisplay(): DatagridDataContextStateDisplay {
    return this.options.validationDisplay;
  }

  get blockInvalidSave(): boolean {
    return this.options.blockInvalidSave;
  }

  get newRowDefaults(): Partial<T> {
    const defaults = this.options.newRowDefaults;
    return defaults ? (typeof defaults === 'function' ? defaults() : { ...defaults }) : {};
  }

  recordId(row: T): string {
    return String((row as Record<string, unknown>)[String(this.context.idField)]);
  }

  record(row: T): DatagridTrackedRecord<T> | null {
    return this.context.findRecord(this.recordId(row));
  }

  recordState(row: T): DatagridRecordState {
    const state = this.record(row)?.state.toLowerCase();
    if (state === 'new' || state === 'added') return 'added';
    if (state === 'modified') return 'modified';
    if (state === 'deleted') return 'deleted';
    return null;
  }

  cellState(row: T, key: string): DatagridRecordState {
    const record = this.record(row);
    if (record?.state.toLowerCase() === 'new' || record?.state.toLowerCase() === 'added') {
      return 'added';
    }
    if (
      record?.state.toLowerCase() === 'modified' &&
      record._modifiedFields?.has(key as keyof T)
    ) {
      return 'modified';
    }
    return null;
  }

  showRowState(): boolean {
    return this.stateDisplay === 'row' || this.stateDisplay === 'row-and-cell';
  }

  showCellState(): boolean {
    return this.stateDisplay === 'cell' || this.stateDisplay === 'row-and-cell';
  }

  showRowValidation(): boolean {
    return this.validationDisplay === 'row' || this.validationDisplay === 'row-and-cell';
  }

  showCellValidation(): boolean {
    return this.validationDisplay === 'cell' || this.validationDisplay === 'row-and-cell';
  }

  valid(): boolean {
    return this.context.allValid === undefined ? true : read(this.context.allValid);
  }

  rowValidationErrors(row: T): readonly DatagridValidationError[] {
    const errors =
      this.context.allValidationErrors === undefined
        ? EMPTY_ERRORS
        : read(this.context.allValidationErrors);
    return errors.get(this.recordId(row)) ?? [];
  }

  cellValidationErrors(row: T, key: string): readonly DatagridValidationError[] {
    return this.rowValidationErrors(row).filter((error) => {
      const rule = error.rule ?? ('field' in error ? String(error.field) : undefined);
      return rule === key || rule === `field:${key}`;
    });
  }

  rowInvalid(row: T): boolean {
    return this.rowValidationErrors(row).length > 0;
  }

  cellInvalid(row: T, key: string): boolean {
    return this.cellValidationErrors(row, key).length > 0;
  }

  validationMessage(row: T, key?: string): string | null {
    const errors = key ? this.cellValidationErrors(row, key) : this.rowValidationErrors(row);
    return errors.length > 0 ? errors.map((error) => error.message).join('\n') : null;
  }

  patch(row: T, changes: Readonly<Record<string, unknown>>): void {
    this.context.patch(this.recordId(row), changes as Partial<T>);
  }

  add(row: Partial<T>, applyDefaults = true): T | null {
    const data = {
      ...(applyDefaults ? this.newRowDefaults : {}),
      ...row,
    } as Partial<T>;
    const id = this.context.add(data);
    return this.context.findRecord(id)?.data ?? null;
  }

  delete(rows: readonly T[]): void {
    rows.forEach((row) => this.context.delete(this.recordId(row), this.options.cascadeDelete));
  }

  discardChanges(): void {
    this.context.discardChanges();
  }

  navigateTo(row: T): boolean {
    if (!this.synchronizeSelection) return false;
    const records = this.context.navigationRecords;
    if (records === undefined) return false;
    const id = this.recordId(row);
    const index = read(records).findIndex((record) => this.recordId(record.data) === id);
    return index >= 0 ? this.context.skip(index) : false;
  }

  currentRow(): T | null {
    const current = this.context.current === undefined ? null : read(this.context.current);
    return current?.data ?? null;
  }
}

export function createDatagridDataContextAdapter<T extends object>(
  context: DatagridDataContext<T>,
  options: DatagridDataContextOptions<T> = {},
): DatagridDataContextAdapter<T> {
  return new DatagridDataContextAdapter(context, options);
}
