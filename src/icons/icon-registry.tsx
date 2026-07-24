import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { IconDefinition } from './collections/icon-definition.js';

// ─── Icon Registry Context ────────────────────────────────────────────────────

const IconRegistryContext = createContext<Map<string, string>>(new Map());

// ─── Provider ─────────────────────────────────────────────────────────────────

interface IconRegistryProviderProps {
  icons?: Record<string, string>;
  children: ReactNode;
}

export function IconRegistryProvider({ icons = {}, children }: IconRegistryProviderProps) {
  const [registry] = useState(() => new Map<string, string>(Object.entries(icons)));
  return (
    <IconRegistryContext.Provider value={registry}>
      {children}
    </IconRegistryContext.Provider>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Returns the icon registry map. Use to look up SVG strings by name.
 */
export function useIconRegistry(): Map<string, string> {
  return useContext(IconRegistryContext);
}

/** Tracks which icon definition arrays have already been registered to avoid duplicates. */
const _registered = new Set<readonly IconDefinition[]>();

/**
 * Registers the given icon definitions into the nearest icon registry.
 * Call this at the top of a component that uses specific icons, similar to
 * Angular's `useIcons()` helper.
 *
 * Uses array reference identity for deduplication — the same array object
 * will only be registered once per registry instance.
 */
export function useIcons(arr: readonly IconDefinition[]): void {
  const registry = useContext(IconRegistryContext);

  const registryRef = useRef(registry);
  registryRef.current = registry;

  useEffect(() => {
    if (_registered.has(arr)) return;
    _registered.add(arr);
    for (const [name, svg] of arr) {
      if (!registryRef.current.has(name)) {
        registryRef.current.set(name, svg);
      }
    }
  }, [arr]);
}
