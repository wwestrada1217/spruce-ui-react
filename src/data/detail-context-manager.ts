import type { DetailDefinition } from './data-context.js';

export class DetailContextManager<TContext> {
  private readonly contexts = new Map<string, Map<string, TContext>>();
  private readonly loadedByParent = new Map<string, Set<string>>();
  private readonly loadingByParent = new Map<string, Set<string>>();
  private readonly listeners = new Set<() => void>();
  private _version = 0;

  constructor(
    readonly definitions: [string, DetailDefinition<Record<string, unknown>>][],
    private readonly createChild: (
      name: string,
      definition: DetailDefinition<Record<string, unknown>>,
      parentId: string,
    ) => TContext,
  ) {}

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  touch(): void {
    this._version += 1;
    this.listeners.forEach((listener) => listener());
  }

  get version(): number {
    return this._version;
  }

  getSnapshot(): number {
    return this._version;
  }

  /** Read the version in framework-neutral code that wants dependency tracking. */
  track(): number {
    return this._version;
  }

  definition(name: string): DetailDefinition<Record<string, unknown>> | undefined {
    return this.definitions.find(([definitionName]) => definitionName === name)?.[1];
  }

  has(parentId: string): boolean {
    return this.contexts.has(parentId);
  }

  ensure(parentId: string): void {
    if (this.definitions.length === 0 || this.contexts.has(parentId)) return;
    const childMap = new Map<string, TContext>();
    this.contexts.set(parentId, childMap);
    this.definitions.forEach(([name, definition]) => {
      childMap.set(name, this.createChild(name, definition, parentId));
    });
    this.touch();
  }

  contextsFor(parentId: string): Map<string, TContext> | undefined {
    return this.contexts.get(parentId);
  }

  get(parentId: string, name: string): TContext | undefined {
    return this.contexts.get(parentId)?.get(name);
  }

  forEach(callback: (childMap: Map<string, TContext>, parentId: string) => void): void {
    this.contexts.forEach(callback);
  }

  remove(parentId: string): Map<string, TContext> | undefined {
    const childMap = this.contexts.get(parentId);
    if (!childMap) return undefined;
    this.contexts.delete(parentId);
    this.loadedByParent.delete(parentId);
    this.loadingByParent.delete(parentId);
    this.touch();
    return childMap;
  }

  rekey(oldId: string, newId: string): Map<string, TContext> | undefined {
    const childMap = this.contexts.get(oldId);
    if (!childMap) return undefined;
    this.contexts.delete(oldId);
    this.contexts.set(newId, childMap);

    const loaded = this.loadedByParent.get(oldId);
    if (loaded) {
      this.loadedByParent.delete(oldId);
      this.loadedByParent.set(newId, loaded);
    }
    const loading = this.loadingByParent.get(oldId);
    if (loading) {
      this.loadingByParent.delete(oldId);
      this.loadingByParent.set(newId, loading);
    }
    this.touch();
    return childMap;
  }

  clearAll(): void {
    this.contexts.clear();
    this.loadedByParent.clear();
    this.loadingByParent.clear();
    this.touch();
  }

  isLoaded(parentId: string, name: string): boolean {
    return this.loadedByParent.get(parentId)?.has(name) ?? false;
  }

  isLoading(parentId: string, name: string): boolean {
    return this.loadingByParent.get(parentId)?.has(name) ?? false;
  }

  markLoaded(parentId: string, name: string): void {
    if (!this.loadedByParent.has(parentId)) this.loadedByParent.set(parentId, new Set());
    this.loadedByParent.get(parentId)?.add(name);
  }

  markLoading(parentId: string, name: string): void {
    if (!this.loadingByParent.has(parentId)) this.loadingByParent.set(parentId, new Set());
    this.loadingByParent.get(parentId)?.add(name);
  }

  clearLoading(parentId: string, name: string): void {
    this.loadingByParent.get(parentId)?.delete(name);
  }

  clearLoadMarks(): void {
    this.loadedByParent.clear();
    this.loadingByParent.clear();
  }
}
