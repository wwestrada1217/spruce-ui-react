/* eslint-disable react-refresh/only-export-components */
import './Entitlements.css';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';
import { Icon } from '../../icons/Icon.js';

export const SP_ENTITLEMENTS_URL = '/api/v1/me/entitlements';

export interface EntitlementFeature {
  key: string;
  limit: number | null;
}

export interface EntitlementsResponse {
  resolved: boolean;
  plan: string | null;
  status?: string;
  features?: readonly EntitlementFeature[];
}

export interface EntitlementsSnapshot {
  features?: readonly EntitlementFeature[];
  plan?: string | null;
  status?: string | null;
  loaded?: boolean;
}

export type EntitlementsFetcher = (url: string) => Promise<EntitlementsResponse>;

export interface EntitlementsContextValue {
  features: readonly string[];
  plan: string | null;
  status: string | null;
  loaded: boolean;
  loading: boolean;
  error: unknown;
  has: (featureKey: string) => boolean;
  limitFor: (featureKey: string) => number | null;
  load: () => Promise<void>;
}

export interface EntitlementsProviderProps {
  children: ReactNode;
  /** Controlled entitlement response for applications that already have session data. */
  entitlements?: EntitlementsSnapshot;
  /** Controlled feature list shorthand. Supplying it marks the provider loaded. */
  features?: readonly EntitlementFeature[];
  plan?: string | null;
  status?: string | null;
  url?: string;
  loadOnMount?: boolean;
  fetcher?: EntitlementsFetcher;
}

const EMPTY_CONTEXT: EntitlementsContextValue = {
  features: [],
  plan: null,
  status: null,
  loaded: false,
  loading: false,
  error: null,
  has: () => false,
  limitFor: () => null,
  load: async () => undefined,
};

const EntitlementsContext = createContext<EntitlementsContextValue>(EMPTY_CONTEXT);

async function defaultFetcher(url: string): Promise<EntitlementsResponse> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Entitlements request failed: ${response.status}`);
  return response.json() as Promise<EntitlementsResponse>;
}

function featureMap(features: readonly EntitlementFeature[]): ReadonlyMap<string, number | null> {
  return new Map(features.map((feature) => [feature.key, feature.limit]));
}

/** Provides reactive entitlement checks and an explicit session entitlement loader. */
export function EntitlementsProvider({
  children,
  entitlements,
  features: controlledFeatures,
  plan: controlledPlan,
  status: controlledStatus,
  url = SP_ENTITLEMENTS_URL,
  loadOnMount = false,
  fetcher = defaultFetcher,
}: EntitlementsProviderProps) {
  const controlled = useMemo<EntitlementsSnapshot | undefined>(
    () => entitlements ?? (controlledFeatures ? { features: controlledFeatures, plan: controlledPlan, status: controlledStatus } : undefined),
    [controlledFeatures, controlledPlan, controlledStatus, entitlements],
  );
  const [loadedState, setLoadedState] = useState(Boolean(controlled?.loaded ?? controlled));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [response, setResponse] = useState<EntitlementsResponse>({ resolved: false, plan: null, features: [] });
  const effectiveFeatures = useMemo(
    () => controlled?.features ?? response.features ?? [],
    [controlled?.features, response.features],
  );
  const effectivePlan = controlled?.plan ?? response.plan ?? null;
  const effectiveStatus = controlled?.status ?? response.status ?? null;
  const limits = useMemo(() => featureMap(effectiveFeatures), [effectiveFeatures]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetcher(url);
      setResponse(next);
      setLoadedState(true);
    } catch (reason) {
      setError(reason);
      setLoadedState(false);
      throw reason;
    } finally {
      setLoading(false);
    }
  }, [fetcher, url]);

  useEffect(() => {
    if (!loadOnMount) return;
    void load().catch(() => undefined);
  }, [load, loadOnMount]);

  const value = useMemo<EntitlementsContextValue>(() => {
    const keys = effectiveFeatures.map((feature) => feature.key);
    return {
      features: keys,
      plan: effectivePlan,
      status: effectiveStatus,
      loaded: Boolean(controlled?.loaded ?? loadedState),
      loading,
      error,
      has: (featureKey) => limits.has(featureKey),
      limitFor: (featureKey) => limits.get(featureKey) ?? null,
      load,
    };
  }, [controlled?.loaded, effectiveFeatures, effectivePlan, effectiveStatus, error, limits, load, loadedState, loading]);

  return <EntitlementsContext.Provider value={value}>{children}</EntitlementsContext.Provider>;
}

export function useEntitlements(): EntitlementsContextValue {
  return useContext(EntitlementsContext);
}

export function useHasFeature(featureKey: string): boolean {
  return useEntitlements().has(featureKey);
}

export interface FeatureGateProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
}

/** Renders children only after the active entitlement set grants `feature`. */
export function FeatureGate({ feature, children, fallback = null, loadingFallback }: FeatureGateProps) {
  const entitlements = useEntitlements();
  if (!entitlements.loaded) return <>{loadingFallback ?? fallback}</>;
  return <>{entitlements.has(feature) ? children : fallback}</>;
}

export interface FeatureLockedProps {
  title?: string;
  message?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** A themed soft-gate panel for an upgrade CTA or other host-provided action. */
export function FeatureLocked({ title, message, children, className = '', style }: FeatureLockedProps) {
  const { t } = useI18n();
  return (
    <div className={['sp-feature-locked', className].filter(Boolean).join(' ')} style={style} role="note">
      <div className="sp-feature-locked__icon" aria-hidden="true"><Icon name="lock" size={24} /></div>
      <h3 className="sp-feature-locked__title">{title ?? t('featureNotIncluded')}</h3>
      <p className="sp-feature-locked__message">{message ?? t('upgradePlanToUnlock')}</p>
      <div className="sp-feature-locked__actions">{children}</div>
    </div>
  );
}

export type SpEntitlementFeature = EntitlementFeature;
export type SpFeatureLockedProps = FeatureLockedProps;
export type SpEntitlementsProviderProps = EntitlementsProviderProps;
export type SpFeatureGateProps = FeatureGateProps;
