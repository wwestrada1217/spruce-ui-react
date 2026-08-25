import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSyncExternalStore } from 'react';
import type { DataContext } from './data-context.js';
import type { DetailDefinitions } from './data-context.js';
import type { DataSourceQueryParams, DataSourcePagedResponse } from './types.js';
import type { FormModel } from './form-model.js';
import type { FormBridge, FormBridgeOptions } from './node-store/form-bridge.js';
import { createFormBridge } from './node-store/form-bridge.js';
import type { NodeStore } from './node-store/node-store.js';

/**
 * A React hook that subscribes to a `DataContext` and triggers re-renders
 * whenever the context changes.
 *
 * Returns the context itself (so you can call `.current`, `.data`, `.dirty`, etc.).
 *
 * @example
 * const ctx = useDataContext(myDataContext);
 * const current = ctx.current;
 */
export function useDataContext<
  T extends Record<string, unknown>,
  TDetails extends DetailDefinitions<T> = DetailDefinitions<T>,
>(context: DataContext<T, TDetails>): DataContext<T, TDetails> {
  useSyncExternalStore(
    useCallback((onStoreChange) => context.subscribe(onStoreChange), [context]),
    useCallback(() => context.getSnapshot(), [context]),
  );
  return context;
}

/** Subscribes to a DataContext's linked, two-way form model. */
export function useDataContextFormModel<
  T extends Record<string, unknown>,
  TDetails extends DetailDefinitions<T> = DetailDefinitions<T>,
>(
  context: DataContext<T, TDetails>,
): FormModel<T> {
  const model = useMemo(() => context.formModel, [context]);
  const subscribe = useCallback((onStoreChange: () => void) => {
    const unsubscribeContext = context.subscribe(onStoreChange);
    const unsubscribeModel = model.subscribe(onStoreChange);
    return () => {
      unsubscribeContext();
      unsubscribeModel();
    };
  }, [context, model]);
  const getSnapshot = useCallback(() => model.getSnapshot(), [model]);
  useSyncExternalStore(subscribe, getSnapshot);
  return model;
}

/** Short alias for consumers that use form models as their primary API. */
export const useFormModel = useDataContextFormModel;

/** Subscribes to a framework-neutral NodeStore and returns the same instance. */
export function useNodeStore<TRoot extends Record<string, unknown>>(
  store: NodeStore<TRoot>,
): NodeStore<TRoot> {
  useSyncExternalStore(
    useCallback((onStoreChange) => store.subscribe(onStoreChange), [store]),
    useCallback(() => store.getSnapshot(), [store]),
  );
  return store;
}

/** React lifecycle wrapper for the NodeStore form bridge. */
export function useFormBridge<TModel extends Record<string, unknown>>(
  options: FormBridgeOptions<TModel>,
): FormBridge<TModel> {
  const bridge = useMemo(() => createFormBridge(options), [options]);
  const getSnapshot = useCallback(() => bridge.model.getSnapshot(), [bridge]);
  useSyncExternalStore(
    useCallback((onStoreChange) => {
      const unsubscribeStore = options.store.subscribe(onStoreChange);
      const unsubscribeModel = bridge.model.subscribe(onStoreChange);
      return () => {
        unsubscribeStore();
        unsubscribeModel();
      };
    }, [bridge, options.store]),
    getSnapshot,
  );
  useEffect(() => () => bridge.dispose(), [bridge]);
  return bridge;
}

/**
 * A React hook that loads a DataContext from its data source and subscribes
 * to changes. Loads on mount and whenever `params` change.
 *
 * @example
 * const { ctx, loading, error } = useDataContextLoad(myContext, { pageSize: 20 });
 */
export function useDataContextLoad<
  T extends Record<string, unknown>,
  TDetails extends DetailDefinitions<T> = DetailDefinitions<T>,
>(
  context: DataContext<T, TDetails>,
  params?: DataSourceQueryParams,
): {
  ctx: DataContext<T, TDetails>;
  loading: boolean;
  error: Error | null;
} {
  const ctx = useDataContext(context);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const paramsKey = JSON.stringify(params ?? null);

  useEffect(() => {
    if (!context.dataSource) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    context.dataSource
      .read(params)
      .then((response) => {
        if (!cancelled) {
          context.loadRecords(response.data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, paramsKey]);

  return { ctx, loading, error };
}

/**
 * A hook for reading data from any async data source with loading and error state.
 *
 * @example
 * const { data, loading, error, refetch } = useDataSource(() => mySource.read({ pageSize: 20 }));
 */
export function useDataSource<T>(
  fetchFn: () => Promise<DataSourcePagedResponse<T>>,
  deps: unknown[] = [],
): {
  data: T[];
  loading: boolean;
  error: Error | null;
  total: number;
  refetch: () => void;
} {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const versionRef = useRef(0);

  const load = useCallback(() => {
    versionRef.current++;
    const version = versionRef.current;

    setLoading(true);
    setError(null);

    fetchFn()
      .then((response) => {
        if (version !== versionRef.current) return;
        setData(response.data);
        setTotal(response.totalRecords);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (version !== versionRef.current) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, total, refetch: load };
}
