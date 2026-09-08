/* eslint-disable react-refresh/only-export-components -- the public provider API intentionally co-locates its hooks. */

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { IconDefinition } from './collections/icon-definition.js';

// ─── Icon Registry Context ────────────────────────────────────────────────────

interface IconRegistryContextValue {
  registry: Map<string, string>;
  register: (icons: readonly IconDefinition[]) => void;
}

const EMPTY_REGISTRY = new Map<string, string>();
const IconRegistryContext = createContext<IconRegistryContextValue>({
  registry: EMPTY_REGISTRY,
  register: () => undefined,
});
const EMPTY_ICONS: Readonly<Record<string, string>> = {};

// ─── Provider ─────────────────────────────────────────────────────────────────

interface IconRegistryProviderProps {
  icons?: Record<string, string>;
  children: ReactNode;
}

export function IconRegistryProvider({ icons = EMPTY_ICONS, children }: IconRegistryProviderProps) {
  const [registeredIcons, setRegisteredIcons] = useState<Map<string, string>>(() => new Map());
  const register = useCallback((definitions: readonly IconDefinition[]) => {
    setRegisteredIcons((current) => {
      const missing = definitions.filter(([name]) => !current.has(name));
      if (missing.length === 0) return current;
      return new Map([...current, ...missing]);
    });
  }, []);
  const registry = useMemo(
    () => new Map<string, string>([...registeredIcons, ...Object.entries(icons)]),
    [icons, registeredIcons],
  );
  const value = useMemo(() => ({ registry, register }), [register, registry]);
  return (
    <IconRegistryContext.Provider value={value}>
      {children}
    </IconRegistryContext.Provider>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Returns the icon registry map. Use to look up SVG strings by name.
 */
export function useIconRegistry(): Map<string, string> {
  return useContext(IconRegistryContext).registry;
}

/**
 * Registers the given icon definitions into the nearest icon registry.
 * Call this at the top of a component that uses specific icons, similar to
 * Angular's `useIcons()` helper.
 *
 * Uses array reference identity for deduplication — the same array object
 * will only be registered once per registry instance.
 */
export function useIcons(arr: readonly IconDefinition[]): void {
  const { register } = useContext(IconRegistryContext);

  useEffect(() => {
    register(arr);
  }, [arr, register]);
}
