import { createContextFormModel, type FormModel } from '../form-model.js';
import type { NodeStore } from './node-store.js';

type AnyRecord = Record<string, unknown>;

export interface FormBridgeOptions<TModel extends AnyRecord> {
  store: Pick<NodeStore<AnyRecord>, 'selectedKey' | 'find' | 'patch' | 'subscribe'>;
  nodeKey?: () => string | null;
  emptyValue: () => TModel;
}

export interface FormBridge<TModel extends AnyRecord> {
  readonly activeKey: string | null;
  readonly model: FormModel<TModel>;
  /** Alias for consumers migrating from Angular signal-form terminology. */
  readonly nodeForm: FormModel<TModel>;
  dispose(): void;
}

export function createFormBridge<TModel extends AnyRecord>(
  options: FormBridgeOptions<TModel>,
): FormBridge<TModel> {
  let activeKey = options.nodeKey?.() ?? options.store.selectedKey;
  const model = createContextFormModel<TModel>({
    defaultValue: options.emptyValue(),
    current: () => {
      activeKey = options.nodeKey?.() ?? options.store.selectedKey;
      const node = activeKey ? options.store.find<TModel>(activeKey) : null;
      return node ? { id: activeKey!, data: structuredClone(node.data) } : null;
    },
    patch: (key, value) => options.store.patch(key, value),
  });
  return {
    get activeKey() {
      activeKey = options.nodeKey?.() ?? options.store.selectedKey;
      return activeKey;
    },
    model,
    nodeForm: model,
    dispose: () => model.dispose(),
  };
}
