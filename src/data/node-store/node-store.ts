import { deepEqual, newGUID } from '../type-utils.js';
import { NodeStoreError, NodeStoreErrorCode } from './errors.js';
import type {
  AddChildOptions,
  NodeStoreRecordState,
  NodeStoreSyncPayload,
  RelationConfig,
  RelationState,
  StoreConfig,
  StoreNode,
} from './types.js';

type AnyRecord = Record<string, unknown>;
type AnyRelationConfig = RelationConfig<AnyRecord, AnyRecord>;

interface RelationDescriptor {
  config: AnyRelationConfig;
}

export class NodeStore<TRoot extends AnyRecord> {
  private readonly relationIndex = new Map<string, Map<string, RelationDescriptor>>();
  private nodeMap = new Map<string, StoreNode>();
  private originalMap = new Map<string, AnyRecord>();
  private childLinksMap = new Map<string, Map<string, string[]>>();
  private relationStateMap = new Map<string, Map<string, RelationState>>();
  private rootKeys: string[] = [];
  private _selectedKey: string | null = null;
  private version = 0;
  private readonly listeners = new Set<() => void>();

  constructor(private readonly config: StoreConfig<TRoot>) {
    this.indexRelations(config.rootType, (config.relations ?? []) as unknown as AnyRelationConfig[]);
  }

  get selectedKey(): string | null {
    return this._selectedKey;
  }

  get allNodes(): StoreNode[] {
    return Array.from(this.nodeMap.values());
  }

  get roots(): StoreNode<TRoot>[] {
    return this.rootKeys
      .map((key) => this.nodeMap.get(key))
      .filter((node): node is StoreNode<TRoot> => !!node && node.state !== 'deleted');
  }

  get selectedNode(): StoreNode | null {
    return this._selectedKey ? this.nodeMap.get(this._selectedKey) ?? null : null;
  }

  get dirty(): boolean {
    return this.allNodes.some((node) => node.state !== 'unchanged');
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot(): number {
    return this.version;
  }

  async load(): Promise<void> {
    const rows = await this.config.load();
    const nodes = new Map<string, StoreNode>();
    const originals = new Map<string, AnyRecord>();
    const roots: string[] = [];

    rows.forEach((row) => {
      const id = String(row[this.config.rootIdField]);
      const key = this.createNodeKey(this.config.rootType, id);
      nodes.set(key, {
        key,
        type: this.config.rootType,
        id,
        parentKey: null,
        relationFromParent: null,
        data: structuredClone(row),
        state: 'unchanged',
      });
      originals.set(key, structuredClone(row));
      roots.push(key);
    });

    this.nodeMap = nodes;
    this.originalMap = originals;
    this.childLinksMap = new Map();
    this.relationStateMap = new Map();
    this.rootKeys = roots;
    this._selectedKey = roots[0] ?? null;
    this.notify();
  }

  find<TData extends AnyRecord = AnyRecord>(key: string): StoreNode<TData> | null {
    return (this.nodeMap.get(key) as StoreNode<TData> | undefined) ?? null;
  }

  childrenOf(parentKey: string, relationName?: string): StoreNode[] {
    const relationMap = this.childLinksMap.get(parentKey);
    if (!relationMap) return [];
    const keys = relationName
      ? relationMap.get(relationName) ?? []
      : Array.from(relationMap.values()).flat();
    return keys
      .map((key) => this.nodeMap.get(key))
      .filter((node): node is StoreNode => !!node && node.state !== 'deleted');
  }

  relationState(parentKey: string, relationName: string): RelationState {
    return this.relationStateMap.get(parentKey)?.get(relationName) ?? { loaded: false, loading: false };
  }

  async loadChildren(parentKey: string, relationName: string): Promise<void> {
    const parent = this.mustFindNode(parentKey);
    const relation = this.getRelation(parent.type, relationName);
    const state = this.relationState(parentKey, relationName);
    if (state.loaded || state.loading) return;

    if (!relation.loadChildren) {
      this.updateRelationState(parentKey, relationName, { loaded: true, loading: false });
      this.ensureRelationLink(parentKey, relationName, []);
      return;
    }

    this.updateRelationState(parentKey, relationName, { loaded: false, loading: true });
    try {
      const children = await relation.loadChildren(parent.data);
      this.upsertChildren(parent, relation, children);
      this.updateRelationState(parentKey, relationName, { loaded: true, loading: false });
    } finally {
      const latest = this.relationState(parentKey, relationName);
      if (!latest.loaded) this.updateRelationState(parentKey, relationName, { ...latest, loading: false });
    }
  }

  select(key: string | null): void {
    if (key === null) {
      this._selectedKey = null;
      this.notify();
      return;
    }
    if (!this.nodeMap.has(key)) {
      throw new NodeStoreError(`Node '${key}' was not found`, NodeStoreErrorCode.NodeNotFound, key);
    }
    this._selectedKey = key;
    this.notify();
  }

  patch(key: string, patch: Partial<AnyRecord>): void {
    const existing = this.mustFindNode(key);
    if (existing.state === 'deleted') return;
    const merged = { ...existing.data, ...patch };
    const original = this.originalMap.get(key);
    const state: NodeStoreRecordState =
      existing.state === 'new' ? 'new' : !deepEqual(original ?? {}, merged) ? 'modified' : 'unchanged';
    this.nodeMap = new Map(this.nodeMap).set(key, { ...existing, data: merged, state });
    this.notify();
  }

  addChild(options: AddChildOptions): string {
    const parent = this.mustFindNode(options.parentKey);
    const relation = this.getRelation(parent.type, options.relationName);
    const sourceData = options.data ? structuredClone(options.data) : {};
    const rawId = sourceData[String(relation.idField)];
    const childId = rawId != null ? String(rawId) : newGUID();
    sourceData[String(relation.idField)] = childId;
    if (sourceData[String(relation.foreignKey)] == null) sourceData[String(relation.foreignKey)] = parent.id;

    const key = this.createNodeKey(relation.childType, childId);
    const child: StoreNode = {
      key,
      type: relation.childType,
      id: childId,
      parentKey: parent.key,
      relationFromParent: relation.name,
      data: sourceData,
      state: 'new',
    };
    this.nodeMap = new Map(this.nodeMap).set(key, child);
    this.appendChildLink(parent.key, relation.name, key);
    this.notify();
    return key;
  }

  remove(key: string, cascade = true): void {
    const node = this.mustFindNode(key);
    if (cascade) this.childKeysOf(key).forEach((childKey) => this.remove(childKey, true));
    if (node.state === 'new') {
      this.removeNodeCompletely(key);
      return;
    }
    this.nodeMap = new Map(this.nodeMap).set(key, { ...node, state: 'deleted' });
    this.notify();
  }

  discard(key: string, cascade = true): void {
    const node = this.mustFindNode(key);
    if (cascade) this.childKeysOf(key).forEach((childKey) => this.discard(childKey, true));
    if (node.state === 'new') {
      this.removeNodeCompletely(key);
      return;
    }
    const original = this.originalMap.get(key);
    if (!original) return;
    this.nodeMap = new Map(this.nodeMap).set(key, { ...node, data: structuredClone(original), state: 'unchanged' });
    this.notify();
  }

  discardAll(): void {
    const next = new Map<string, StoreNode>();
    this.nodeMap.forEach((node, key) => {
      if (node.state === 'new') return;
      const original = this.originalMap.get(key);
      if (original) next.set(key, { ...node, data: structuredClone(original), state: 'unchanged' });
    });
    this.nodeMap = next;
    const links = new Map<string, Map<string, string[]>>();
    this.childLinksMap.forEach((relationMap, parentKey) => {
      if (!this.nodeMap.has(parentKey)) return;
      const cleaned = new Map<string, string[]>();
      relationMap.forEach((keys, relationName) => cleaned.set(relationName, keys.filter((key) => this.nodeMap.has(key))));
      links.set(parentKey, cleaned);
    });
    this.childLinksMap = links;
    this.notify();
  }

  buildPayload(rootKey?: string): NodeStoreSyncPayload[] {
    const keys = rootKey ? [rootKey] : this.rootKeys;
    return keys.map((key) => this.buildNodePayload(key)).filter((entry): entry is NodeStoreSyncPayload => !!entry);
  }

  private buildNodePayload(key: string): NodeStoreSyncPayload | null {
    const node = this.nodeMap.get(key);
    if (!node) return null;
    const payload: NodeStoreSyncPayload = { ...node.data };
    this.childLinksMap.get(key)?.forEach((childKeys, relationName) => {
      const nested = childKeys.map((childKey) => this.buildNodePayload(childKey)).filter((entry): entry is NodeStoreSyncPayload => !!entry);
      if (nested.length > 0) payload[relationName] = nested;
    });
    const hasOwnChanges = node.state !== 'unchanged';
    const hasNestedChanges = Object.values(payload).some((value) => Array.isArray(value) && value.length > 0);
    if (!hasOwnChanges && !hasNestedChanges) return null;
    payload._state = this.mapState(node.state);
    return payload;
  }

  private mapState(state: NodeStoreRecordState): 'New' | 'Modified' | 'Deleted' | 'Unchanged' {
    if (state === 'new') return 'New';
    if (state === 'modified') return 'Modified';
    if (state === 'deleted') return 'Deleted';
    return 'Unchanged';
  }

  private removeNodeCompletely(key: string): void {
    this.childKeysOf(key).forEach((childKey) => this.removeNodeCompletely(childKey));
    const node = this.nodeMap.get(key);
    if (!node) return;
    this.nodeMap = new Map(this.nodeMap);
    this.nodeMap.delete(key);
    this.originalMap = new Map(this.originalMap);
    this.originalMap.delete(key);
    this.childLinksMap = new Map(this.childLinksMap);
    this.childLinksMap.delete(key);
    this.childLinksMap.forEach((relationMap) => relationMap.forEach((keys, relationName) => relationMap.set(relationName, keys.filter((childKey) => childKey !== key))));
    this.relationStateMap = new Map(this.relationStateMap);
    this.relationStateMap.delete(key);
    if (!node.parentKey) {
      this.rootKeys = this.rootKeys.filter((rootKey) => rootKey !== key);
      if (this._selectedKey === key) this._selectedKey = this.rootKeys[0] ?? null;
    }
    this.notify();
  }

  private childKeysOf(parentKey: string): string[] {
    return Array.from(this.childLinksMap.get(parentKey)?.values() ?? []).flat();
  }

  private appendChildLink(parentKey: string, relationName: string, childKey: string): void {
    const next = new Map(this.childLinksMap);
    const relationMap = new Map(next.get(parentKey) ?? new Map<string, string[]>());
    relationMap.set(relationName, [...(relationMap.get(relationName) ?? []), childKey]);
    next.set(parentKey, relationMap);
    this.childLinksMap = next;
  }

  private ensureRelationLink(parentKey: string, relationName: string, childKeys: string[]): void {
    const next = new Map(this.childLinksMap);
    const relationMap = new Map(next.get(parentKey) ?? new Map<string, string[]>());
    relationMap.set(relationName, childKeys);
    next.set(parentKey, relationMap);
    this.childLinksMap = next;
  }

  private updateRelationState(parentKey: string, relationName: string, state: RelationState): void {
    const next = new Map(this.relationStateMap);
    const relationMap = new Map(next.get(parentKey) ?? new Map<string, RelationState>());
    relationMap.set(relationName, state);
    next.set(parentKey, relationMap);
    this.relationStateMap = next;
    this.notify();
  }

  private upsertChildren(parent: StoreNode, relation: AnyRelationConfig, children: AnyRecord[]): void {
    const childKeys: string[] = [];
    const nodes = new Map(this.nodeMap);
    const originals = new Map(this.originalMap);
    children.forEach((childData) => {
      const id = String(childData[String(relation.idField)]);
      const key = this.createNodeKey(relation.childType, id);
      childKeys.push(key);
      nodes.set(key, { key, type: relation.childType, id, parentKey: parent.key, relationFromParent: relation.name, data: structuredClone(childData), state: 'unchanged' });
      originals.set(key, structuredClone(childData));
    });
    this.nodeMap = nodes;
    this.originalMap = originals;
    this.ensureRelationLink(parent.key, relation.name, childKeys);
  }

  private mustFindNode(key: string): StoreNode {
    const node = this.nodeMap.get(key);
    if (!node) throw new NodeStoreError(`Node '${key}' was not found`, NodeStoreErrorCode.NodeNotFound, key);
    return node;
  }

  private getRelation(parentType: string, relationName: string): AnyRelationConfig {
    const descriptor = this.relationIndex.get(parentType)?.get(relationName);
    if (!descriptor) throw new NodeStoreError(`Relation '${relationName}' was not configured for type '${parentType}'`, NodeStoreErrorCode.RelationNotConfigured, `${parentType}:${relationName}`);
    return descriptor.config;
  }

  private indexRelations(parentType: string, relations: AnyRelationConfig[]): void {
    if (relations.length === 0) return;
    if (!this.relationIndex.has(parentType)) this.relationIndex.set(parentType, new Map());
    const relationMap = this.relationIndex.get(parentType)!;
    relations.forEach((relation) => {
      relationMap.set(relation.name, { config: relation });
      this.indexRelations(relation.childType, relation.relations ?? []);
    });
  }

  private createNodeKey(type: string, id: string): string {
    return `${type}:${id}`;
  }

  private notify(): void {
    this.version += 1;
    this.listeners.forEach((listener) => listener());
  }
}

export function createNodeStore<TRoot extends AnyRecord>(config: StoreConfig<TRoot>): NodeStore<TRoot> {
  return new NodeStore(config);
}
