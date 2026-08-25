export type NodeStoreRecordState = 'unchanged' | 'new' | 'modified' | 'deleted';

export interface StoreNode<TData extends Record<string, unknown> = Record<string, unknown>> {
  key: string;
  type: string;
  id: string;
  parentKey: string | null;
  relationFromParent: string | null;
  data: TData;
  state: NodeStoreRecordState;
}

export interface RelationConfig<
  TParent extends Record<string, unknown> = Record<string, unknown>,
  TChild extends Record<string, unknown> = Record<string, unknown>,
> {
  name: string;
  childType: string;
  idField: keyof TChild;
  foreignKey: keyof TChild;
  loadChildren?: (parent: TParent) => Promise<TChild[]> | TChild[];
  relations?: RelationConfig<TChild, Record<string, unknown>>[];
}

export interface StoreConfig<TRoot extends Record<string, unknown>> {
  rootType: string;
  rootIdField: keyof TRoot;
  load: () => Promise<TRoot[]> | TRoot[];
  relations?: RelationConfig<TRoot, Record<string, unknown>>[];
}

export interface AddChildOptions {
  parentKey: string;
  relationName: string;
  data?: Record<string, unknown>;
}

export type SyncState = 'New' | 'Modified' | 'Deleted' | 'Unchanged';

export interface NodeStoreSyncPayload {
  [key: string]: unknown;
  _state?: SyncState;
}

export interface RelationState {
  loaded: boolean;
  loading: boolean;
}

export interface NodeStoreSnapshot {
  version: number;
}
