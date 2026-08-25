import { useMemo } from 'react';
import { DataContext, type DetailDefinitions } from '../../data/data-context.js';
import { RecordState } from '../../data/record-state.js';
import { useDataContext, useDataContextFormModel } from '../../data/use-data-context.js';
import type { ValidationError } from '../../data/types.js';
import type { FormBuilderSubmitEvent } from './FormBuilder.js';

export interface FormBuilderDataContextAdapterOptions {
  saveOnSubmit?: boolean;
  addOnSubmitWhenNoRecord?: boolean;
  onInvalidSubmit?: (event: FormBuilderSubmitEvent) => boolean;
}

export class FormBuilderDataContextAdapter<
  T extends Record<string, unknown>,
  TDetails extends DetailDefinitions<T> = DetailDefinitions<T>,
> {
  readonly context: DataContext<T, TDetails>;
  private readonly options: Required<FormBuilderDataContextAdapterOptions>;

  constructor(
    context: DataContext<T, TDetails>,
    options: FormBuilderDataContextAdapterOptions = {},
  ) {
    this.context = context;
    this.options = {
      saveOnSubmit: options.saveOnSubmit ?? false,
      addOnSubmitWhenNoRecord: options.addOnSubmitWhenNoRecord ?? true,
      onInvalidSubmit: options.onInvalidSubmit ?? (() => false),
    };
  }

  get value(): Record<string, unknown> {
    return { ...this.context.formModel.value };
  }

  setValue(value: Record<string, unknown>): void {
    this.context.formModel.set(value as T);
  }

  get dirty(): boolean { return this.context.dirty; }
  get isValid(): boolean { return this.context.isValid; }
  get validationErrors(): ValidationError[] { return this.context.validationErrors; }
  get loading(): boolean { return this.context.loading; }
  get recordState(): RecordState | null { return this.context.current?.record.state ?? null; }
  get hasRecord(): boolean { return this.context.current !== null; }
  get canNext(): boolean { return this.context.hasNext; }
  get canPrevious(): boolean { return this.context.hasPrevious; }

  async onSubmit(event: FormBuilderSubmitEvent): Promise<void> {
    if (!event.valid && !this.options.onInvalidSubmit(event)) return;
    const current = this.context.current;
    if (current) current.update(event.value as Partial<T>);
    else if (this.options.addOnSubmitWhenNoRecord) this.context.add(event.value as Partial<T>);
    if (this.options.saveOnSubmit) await this.context.save().then(() => undefined);
  }

  addNew(partial: Partial<T> = {}): string { return this.context.add(partial); }

  deleteCurrent(cascade = false): boolean {
    const current = this.context.current;
    if (!current) return false;
    current.delete(cascade);
    return true;
  }

  discardChanges(): void { this.context.discardChanges(); }
  next(): boolean { return this.context.next(); }
  previous(): boolean { return this.context.previous(); }
  first(): boolean { return this.context.first(); }
  last(): boolean { return this.context.last(); }

  getChangeSummary(): { newCount: number; modifiedCount: number; deletedCount: number; total: number } {
    const counts = {
      newCount: this.context.records.filter((record) => record.state === RecordState.New).length,
      modifiedCount: this.context.records.filter((record) => record.state === RecordState.Modified).length,
      deletedCount: this.context.records.filter((record) => record.state === RecordState.Deleted).length,
    };
    return { ...counts, total: counts.newCount + counts.modifiedCount + counts.deletedCount };
  }
}

export function createFormBuilderDataContextAdapter<
  T extends Record<string, unknown>,
  TDetails extends DetailDefinitions<T> = DetailDefinitions<T>,
>(
  context: DataContext<T, TDetails>,
  options: FormBuilderDataContextAdapterOptions = {},
): FormBuilderDataContextAdapter<T, TDetails> {
  return new FormBuilderDataContextAdapter(context, options);
}

/** Subscribe to the context and linked form model before rendering a builder. */
export function useFormBuilderDataContextAdapter<
  T extends Record<string, unknown>,
  TDetails extends DetailDefinitions<T> = DetailDefinitions<T>,
>(
  context: DataContext<T, TDetails>,
  options: FormBuilderDataContextAdapterOptions = {},
): FormBuilderDataContextAdapter<T, TDetails> {
  useDataContext(context);
  useDataContextFormModel(context);
  return useMemo(() => new FormBuilderDataContextAdapter(context, options), [context, options]);
}
