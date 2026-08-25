export enum NodeStoreErrorCode {
  NodeNotFound = 'NODE_NOT_FOUND',
  RelationNotConfigured = 'RELATION_NOT_CONFIGURED',
}

export class NodeStoreError extends Error {
  constructor(
    message: string,
    public readonly code: NodeStoreErrorCode,
    public readonly key?: string,
  ) {
    super(message);
    this.name = 'NodeStoreError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
