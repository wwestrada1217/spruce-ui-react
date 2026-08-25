import type { DataContextLogger } from './types.js';
import { deepEqual } from './type-utils.js';

export interface FormModel<T extends Record<string, unknown>> {
  readonly value: T;
  set(value: T): void;
  update(updater: (value: T) => T): void;
  reset(value?: T): void;
  subscribe(listener: () => void): () => void;
  getSnapshot(): T;
  dispose(): void;
}

export interface ContextFormModelOptions<T extends Record<string, unknown>> {
  defaultValue: T;
  current: () => { id: string; data: T } | null;
  patch: (id: string, value: T) => void;
  logger?: DataContextLogger;
}

class LinkedFormModel<T extends Record<string, unknown>> implements FormModel<T> {
  private localValue: T | undefined;
  private activeId: string | null = null;
  private readonly listeners = new Set<() => void>();

  constructor(private readonly options: ContextFormModelOptions<T>) {}

  get value(): T {
    const current = this.options.current();
    const id = current?.id ?? null;
    const linkedValue = current ? this.merge(current.data) : this.clone(this.options.defaultValue);
    if (id !== this.activeId || !this.localValue || (current && !deepEqual(this.localValue, linkedValue))) {
      this.activeId = id;
      this.localValue = linkedValue;
    }
    return this.localValue;
  }

  set(value: T): void {
    const current = this.options.current();
    this.activeId = current?.id ?? null;
    this.localValue = this.clone(value);
    if (current && !deepEqual(current.data, this.localValue)) {
      this.options.patch(current.id, this.localValue);
    }
    this.listeners.forEach((listener) => listener());
  }

  update(updater: (value: T) => T): void {
    this.set(updater(this.clone(this.value)));
  }

  reset(value?: T): void {
    this.localValue = this.clone(value ?? this.options.defaultValue);
    const current = this.options.current();
    if (current) this.options.patch(current.id, this.localValue);
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot(): T {
    return this.value;
  }

  dispose(): void {
    this.listeners.clear();
  }

  private merge(data: T): T {
    const merged = { ...this.options.defaultValue, ...this.clone(data) } as T;
    (Object.keys(this.options.defaultValue) as (keyof T)[]).forEach((key) => {
      if (merged[key] === undefined) merged[key] = this.options.defaultValue[key];
    });
    return merged;
  }

  private clone(value: T): T {
    return structuredClone(value);
  }
}

/** Creates a linked, two-way model without requiring React or Angular. */
export function createContextFormModel<T extends Record<string, unknown>>(
  options: ContextFormModelOptions<T>,
): FormModel<T> {
  return new LinkedFormModel(options);
}
