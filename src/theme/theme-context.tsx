import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { SpruceTheme, ThemePreference as Theme } from './types.js';

// ─── Theme Context Value ───────────────────────────────────────────────────────

export interface ThemeContextValue {
  /** The user-chosen preference: 'light', 'dark', 'system', or a custom theme name. */
  preference: Theme;
  /** The resolved base theme ('light' or 'dark') currently applied to the document. */
  resolved: 'light' | 'dark';
  /** The active custom theme object, or null when using a built-in theme. */
  activeTheme: SpruceTheme | null;
  /** Set the active theme by name or built-in value. */
  setTheme: (theme: Theme) => void;
  /** Toggle between light and dark built-in themes. */
  toggle: () => void;
  /** Register a custom theme so it can be activated via `setTheme(name)`. */
  registerTheme: (theme: SpruceTheme) => void;
  /** Returns all currently registered custom themes. */
  getRegisteredThemes: () => SpruceTheme[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface ThemeProviderProps {
  /** Initial theme preference. Defaults to 'system'. */
  defaultTheme?: Theme;
  children: ReactNode;
}

export function ThemeProvider({ defaultTheme = 'system', children }: ThemeProviderProps) {
  const registeredThemesRef = useRef(new Map<string, SpruceTheme>());
  const styleOverrideRef = useRef<HTMLStyleElement | null>(null);

  const getSystemResolved = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  const [preference, setPreference] = useState<Theme>(defaultTheme);
  const [resolved, setResolved] = useState<'light' | 'dark'>(() => {
    if (defaultTheme === 'system') return getSystemResolved();
    if (defaultTheme === 'dark') return 'dark';
    if (defaultTheme === 'light') return 'light';
    return 'light'; // custom themes resolve after registration
  });
  const [activeTheme, setActiveTheme] = useState<SpruceTheme | null>(null);

  const injectTokenOverrides = useCallback((theme: SpruceTheme) => {
    if (typeof document === 'undefined') return;
    if (!styleOverrideRef.current) {
      const el = document.createElement('style');
      el.id = 'sp-theme-override';
      document.head.appendChild(el);
      styleOverrideRef.current = el;
    }
    const css = Object.entries(theme.tokens)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n');
    styleOverrideRef.current.textContent = `:root {\n${css}\n}`;
  }, []);

  const clearTokenOverrides = useCallback(() => {
    if (styleOverrideRef.current) {
      styleOverrideRef.current.textContent = '';
    }
  }, []);

  const applyResolvedTheme = useCallback(
    (pref: Theme) => {
      if (typeof document === 'undefined') return;

      const customTheme = registeredThemesRef.current.get(pref);
      if (customTheme) {
        setResolved(customTheme.base);
        setActiveTheme(customTheme);
        document.documentElement.setAttribute('data-theme', customTheme.base);
        document.documentElement.classList.toggle('dark', customTheme.base === 'dark');
        injectTokenOverrides(customTheme);
        return;
      }

      clearTokenOverrides();
      setActiveTheme(null);

      const effective: 'light' | 'dark' =
        pref === 'system'
          ? getSystemResolved()
          : pref === 'dark'
            ? 'dark'
            : 'light';

      setResolved(effective);
      document.documentElement.setAttribute('data-theme', effective);
      document.documentElement.classList.toggle('dark', effective === 'dark');
    },
    [getSystemResolved, injectTokenOverrides, clearTokenOverrides],
  );

  // Apply theme on preference change
  useEffect(() => {
    applyResolvedTheme(preference);
  }, [preference, applyResolvedTheme]);

  // Listen for system color scheme changes when preference is 'system'
  useEffect(() => {
    if (preference !== 'system' || typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyResolvedTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [preference, applyResolvedTheme]);

  const setTheme = useCallback(
    (theme: Theme) => {
      setPreference(theme);
    },
    [],
  );

  const toggle = useCallback(() => {
    setPreference(resolved === 'light' ? 'dark' : 'light');
  }, [resolved]);

  const registerTheme = useCallback((theme: SpruceTheme) => {
    registeredThemesRef.current.set(theme.name, theme);
  }, []);

  const getRegisteredThemes = useCallback((): SpruceTheme[] => {
    return Array.from(registeredThemesRef.current.values());
  }, []);

  const value: ThemeContextValue = {
    preference,
    resolved,
    activeTheme,
    setTheme,
    toggle,
    registerTheme,
    getRegisteredThemes,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns the current theme context value.
 * Must be used inside a `<SpruceProvider>` or `<ThemeProvider>`.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
