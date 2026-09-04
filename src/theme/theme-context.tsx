/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  ACCENT_OPTIONS,
  DEFAULT_CUSTOM_ACCENT_HEX,
  accentPresetBaseHex,
  buildAccentStylesheet,
  isAccentId,
  normalizeAccentHex,
  type AccentId,
} from './accent-presets.js';
import {
  buildHarmonyPalette,
  buildHarmonyStylesheet,
  findHarmonyPreset,
  isHarmonySchemeId,
  toCustomHarmony,
  type CustomHarmony,
  type HarmonyPalette,
  type HarmonySchemeId,
  type HarmonySelection,
} from './accent-harmony.js';
import { SPRUCE_THEME_PRESETS } from './presets/all.js';
import type { SpruceTheme, ThemePreference as Theme } from './types.js';
import { applyThemeToDocument } from './theme-dom.js';

const THEME_STORAGE_KEY = 'spruce-theme-preference';
const ACCENT_STORAGE_KEY = 'spruce-accent-preference';
const ACCENT_CUSTOM_COLOR_KEY = 'spruce-accent-custom-hex';
const ACCENT_HARMONY_KEY = 'spruce-accent-harmony';
const ACCENT_HARMONY_CUSTOM_KEY = 'spruce-accent-harmony-custom';

type ThemeMode = 'light' | 'dark';
export type AccentHarmony = HarmonySchemeId | 'custom' | 'none';

function readStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable in privacy modes and SSR-like environments.
  }
}

function getSystemResolved(): ThemeMode {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredHarmony(): {
  scheme: AccentHarmony;
  custom: CustomHarmony | null;
} | null {
  const storedCustom = readStorage(ACCENT_HARMONY_CUSTOM_KEY);
  let custom: CustomHarmony | null = null;
  if (storedCustom) {
    try {
      custom = toCustomHarmony(JSON.parse(storedCustom));
    } catch {
      custom = null;
    }
  }
  const storedScheme = readStorage(ACCENT_HARMONY_KEY);
  if (!storedScheme && !custom) return null;
  if (storedScheme === 'custom' && custom) return { scheme: 'custom', custom };
  if (storedScheme && isHarmonySchemeId(storedScheme)) {
    return { scheme: storedScheme, custom };
  }
  return { scheme: 'none', custom };
}

function initialThemePreference(
  defaultTheme: Theme,
  explicitTheme: SpruceTheme | undefined,
  storageKey: string,
): Theme {
  return explicitTheme?.name ?? readStorage(storageKey) ?? defaultTheme;
}

// ─── Theme Context Value ─────────────────────────────────────────────────────

export interface ThemeContextValue {
  /** The persisted user preference: light, dark, system, or a registered preset name. */
  preference: Theme;
  /** The resolved mode currently applied to the document. */
  resolved: ThemeMode;
  /** The active registered preset, or null for the base light/dark/system modes. */
  activeTheme: SpruceTheme | null;
  /** Select a base mode or registered preset. The selection is persisted by default. */
  setTheme: (theme: Theme) => void;
  /** Toggle between the currently resolved light and dark modes. */
  toggle: () => void;
  /** Register a custom preset for activation by name. */
  registerTheme: (theme: SpruceTheme) => void;
  /** Return all shipped and application-registered presets. */
  getRegisteredThemes: () => SpruceTheme[];

  /** Active accent preset. default follows the active theme's primary color. */
  accentPreference: AccentId;
  /** Alias for accentPreference, convenient for appearance controls. */
  accent: AccentId;
  /** The last valid custom accent color. */
  accentCustomColor: string;
  /** Active harmony scheme, or none for a single-hue accent. */
  accentHarmony: AccentHarmony;
  /** Explicit offsets used when accentHarmony is custom. */
  accentHarmonyCustom: CustomHarmony | null;
  /** Normalized brand color that seeded the current harmony. */
  accentHarmonyBase: string;
  /** Increments whenever accent/harmony CSS is rewritten. */
  accentRevision: number;
  /** Generated light/dark harmony palette, or null for a plain accent. */
  harmonyPalette: HarmonyPalette | null;
  /** The shape consumed by buildHarmonyPalette. */
  harmonySelection: HarmonySelection | null;
  /** Set a shipped accent preset. */
  setAccent: (accent: AccentId) => void;
  /** Validate, persist, and activate a custom hex accent. */
  setCustomAccentColor: (hex: string) => void;
  /** Activate a named or custom harmony. */
  setAccentHarmony: (scheme: AccentHarmony) => void;
  /** Activate explicit hue offsets from a color-harmony editor. */
  setAccentHarmonyCustom: (offsets: CustomHarmony) => void;
  /** Activate a shipped brand + harmony pairing. */
  setHarmonyPreset: (presetId: string) => void;
  /** Clear the accent layer and return to the active preset's colors. */
  resetAccent: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface ThemeProviderProps {
  /** Initial theme preference; persisted state wins when persistence is enabled. */
  defaultTheme?: Theme;
  /** Custom theme preset object to register and activate. */
  theme?: SpruceTheme;
  /** Initial accent when no persisted accent exists. */
  defaultAccent?: AccentId;
  /** Initial custom accent color when no persisted color exists. */
  defaultAccentCustomColor?: string;
  /** Initial harmony when no persisted harmony exists. */
  defaultAccentHarmony?: AccentHarmony;
  /** Initial custom harmony offsets when no persisted offsets exist. */
  defaultAccentHarmonyCustom?: CustomHarmony | null;
  /** Persist theme, accent, and harmony choices in localStorage. */
  persist?: boolean;
  /** Storage key for the theme preference. Accent keys remain namespaced by Spruce. */
  storageKey?: string;
  children: ReactNode;
}

export function ThemeProvider({
  defaultTheme = 'system',
  theme,
  defaultAccent = 'default',
  defaultAccentCustomColor = DEFAULT_CUSTOM_ACCENT_HEX,
  defaultAccentHarmony = 'none',
  defaultAccentHarmonyCustom = null,
  persist = true,
  storageKey = THEME_STORAGE_KEY,
  children,
}: ThemeProviderProps) {
  const storedHarmony = useMemo(() => (persist ? readStoredHarmony() : null), [persist]);
  const initialCustomColor =
    normalizeAccentHex(
      persist
        ? readStorage(ACCENT_CUSTOM_COLOR_KEY) ?? defaultAccentCustomColor
        : defaultAccentCustomColor,
    ) ?? DEFAULT_CUSTOM_ACCENT_HEX;
  const initialAccent = persist
    ? (() => {
        const stored = readStorage(ACCENT_STORAGE_KEY);
        return stored && isAccentId(stored) ? stored : defaultAccent;
      })()
    : defaultAccent;
  const initialHarmony = storedHarmony?.scheme ?? defaultAccentHarmony;
  const initialHarmonyCustom = storedHarmony?.custom ?? defaultAccentHarmonyCustom;

  const initialRegisteredThemes = useMemo(() => {
    const themes = new Map<string, SpruceTheme>();
    for (const preset of SPRUCE_THEME_PRESETS) themes.set(preset.name, preset);
    if (theme) themes.set(theme.name, theme);
    return themes;
  }, [theme]);
  const registeredThemesRef = useRef(initialRegisteredThemes);

  const [registeredThemes, setRegisteredThemes] = useState(() => initialRegisteredThemes);
  const [preference, setPreference] = useState<Theme>(() =>
    initialThemePreference(defaultTheme, theme, storageKey),
  );
  const [resolved, setResolved] = useState<ThemeMode>(() => {
    const initial = initialThemePreference(defaultTheme, theme, storageKey);
    if (initial === 'dark') return 'dark';
    if (initial === 'light') return 'light';
    return getSystemResolved();
  });
  const [activeTheme, setActiveTheme] = useState<SpruceTheme | null>(() =>
    initialRegisteredThemes.get(initialThemePreference(defaultTheme, theme, storageKey)) ?? null,
  );
  const [accentPreference, setAccentPreference] = useState<AccentId>(initialAccent);
  const [accentCustomColor, setAccentCustomColor] = useState(initialCustomColor);
  const [accentHarmony, setAccentHarmonyState] = useState<AccentHarmony>(initialHarmony);
  const [accentHarmonyCustom, setAccentHarmonyCustomState] = useState<CustomHarmony | null>(
    initialHarmonyCustom,
  );
  const [accentHarmonyBase, setAccentHarmonyBase] = useState(initialCustomColor);
  const [accentRevision, setAccentRevision] = useState(0);
  const styleOverrideRef = useRef<HTMLStyleElement | null>(null);
  const accentStyleRef = useRef<HTMLStyleElement | null>(null);

  const injectTokenOverrides = useCallback((nextTheme: SpruceTheme) => {
    if (typeof document === 'undefined') return;
    if (!styleOverrideRef.current) {
      const style = document.createElement('style');
      style.id = 'sp-theme-override';
      document.head.appendChild(style);
      styleOverrideRef.current = style;
    }
    const css = Object.entries({ ...nextTheme.tokens, ...nextTheme.customTokens })
      .map(([key, value]) => '  ' + key + ': ' + value + ';')
      .join('\n');
    styleOverrideRef.current.textContent = ':root {\n' + css + '\n}';
  }, []);

  const clearTokenOverrides = useCallback(() => {
    if (styleOverrideRef.current) styleOverrideRef.current.textContent = '';
  }, []);

  const applyAccentStyles = useCallback(
    (
      accent: AccentId,
      harmony: AccentHarmony,
      customHarmony: CustomHarmony | null,
      customHex: string,
    ) => {
      if (typeof document === 'undefined') return;
      const root = document.documentElement;
      root.setAttribute('data-accent', accent);
      if (harmony === 'none') root.removeAttribute('data-accent-harmony');
      else root.setAttribute('data-accent-harmony', harmony);

      // Blank first so default-accent harmony always reads the base theme color,
      // never the previous generated palette.
      if (accentStyleRef.current) accentStyleRef.current.textContent = '';
      const presetHex = accentPresetBaseHex(accent);
      const computedPrimary =
        accent === 'default' && typeof window !== 'undefined'
          ? window.getComputedStyle(root).getPropertyValue('--sp-primary').trim()
          : null;
      const base =
        normalizeAccentHex(
          accent === 'custom' ? customHex : presetHex ?? computedPrimary ?? DEFAULT_CUSTOM_ACCENT_HEX,
        ) ?? DEFAULT_CUSTOM_ACCENT_HEX;
      setAccentHarmonyBase(base);

      const selection: HarmonySelection | null =
        harmony === 'none' ? null : harmony === 'custom' ? customHarmony : harmony;
      const css = selection
        ? buildHarmonyStylesheet(base, selection)
        : buildAccentStylesheet(accent, customHex);
      setAccentRevision((revision) => revision + 1);
      if (!css) {
        accentStyleRef.current?.remove();
        accentStyleRef.current = null;
        return;
      }
      if (!accentStyleRef.current) {
        const style = document.createElement('style');
        style.id = 'sp-accent-override';
        document.head.appendChild(style);
        accentStyleRef.current = style;
      }
      accentStyleRef.current.textContent = css;
    },
    [],
  );

  const applyResolvedTheme = useCallback(
    (pref: Theme) => {
      if (typeof document === 'undefined') return;
      const custom = registeredThemes.get(pref);
      let nextResolved: ThemeMode;
      if (custom) {
        nextResolved = custom.base;
        setActiveTheme(custom);
        applyThemeToDocument(document, custom.base, custom.name);
        injectTokenOverrides(custom);
      } else {
        clearTokenOverrides();
        setActiveTheme(null);
        nextResolved = pref === 'dark' ? 'dark' : pref === 'system' ? getSystemResolved() : 'light';
        applyThemeToDocument(document, nextResolved);
      }
      setResolved(nextResolved);
      applyAccentStyles(accentPreference, accentHarmony, accentHarmonyCustom, accentCustomColor);
    },
    [
      accentCustomColor,
      accentHarmony,
      accentHarmonyCustom,
      accentPreference,
      applyAccentStyles,
      clearTokenOverrides,
      injectTokenOverrides,
      registeredThemes,
    ],
  );

  useEffect(() => {
    if (theme) {
      registeredThemesRef.current.set(theme.name, theme);
      setRegisteredThemes(new Map(registeredThemesRef.current));
      setPreference(theme.name);
    }
  }, [theme]);

  useEffect(() => {
    // Applying a theme synchronizes both the document and the provider's
    // resolved state; this is an intentional external-system effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    applyResolvedTheme(preference);
  }, [applyResolvedTheme, preference]);

  useEffect(() => {
    if (
      preference !== 'system' ||
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return;
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyResolvedTheme('system');
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, [applyResolvedTheme, preference]);

  useEffect(() => {
    return () => {
      styleOverrideRef.current?.remove();
      accentStyleRef.current?.remove();
      // StrictMode replays effects after cleanup; recreate the detached styles.
      styleOverrideRef.current = null;
      accentStyleRef.current = null;
    };
  }, []);

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      setPreference(nextTheme);
      if (persist) writeStorage(storageKey, nextTheme);
    },
    [persist, storageKey],
  );

  const toggle = useCallback(() => {
    setTheme(resolved === 'light' ? 'dark' : 'light');
  }, [resolved, setTheme]);

  const registerTheme = useCallback((nextTheme: SpruceTheme) => {
    if (registeredThemesRef.current.get(nextTheme.name) === nextTheme) return;
    registeredThemesRef.current.set(nextTheme.name, nextTheme);
    setRegisteredThemes(new Map(registeredThemesRef.current));
  }, []);

  const getRegisteredThemes = useCallback(
    () => Array.from(registeredThemes.values()),
    [registeredThemes],
  );

  const setAccent = useCallback(
    (nextAccent: AccentId) => {
      setAccentPreference(nextAccent);
      if (persist) writeStorage(ACCENT_STORAGE_KEY, nextAccent);
    },
    [persist],
  );

  const setCustomAccentColor = useCallback(
    (hex: string) => {
      const normalized = normalizeAccentHex(hex);
      if (!normalized) return;
      setAccentCustomColor(normalized);
      setAccentPreference('custom');
      if (persist) {
        writeStorage(ACCENT_STORAGE_KEY, 'custom');
        writeStorage(ACCENT_CUSTOM_COLOR_KEY, normalized);
      }
    },
    [persist],
  );

  const setAccentHarmony = useCallback(
    (scheme: AccentHarmony) => {
      if (scheme === 'custom' && !accentHarmonyCustom) return;
      setAccentHarmonyState(scheme);
      if (persist) writeStorage(ACCENT_HARMONY_KEY, scheme);
    },
    [accentHarmonyCustom, persist],
  );

  const setAccentHarmonyCustom = useCallback(
    (offsets: CustomHarmony) => {
      const normalized = toCustomHarmony(offsets);
      if (!normalized) return;
      setAccentHarmonyCustomState(normalized);
      setAccentHarmonyState('custom');
      if (persist) {
        writeStorage(ACCENT_HARMONY_KEY, 'custom');
        writeStorage(ACCENT_HARMONY_CUSTOM_KEY, JSON.stringify(normalized));
      }
    },
    [persist],
  );

  const setHarmonyPreset = useCallback(
    (presetId: string) => {
      const preset = findHarmonyPreset(presetId);
      if (!preset) return;
      const normalized = normalizeAccentHex(preset.base);
      if (!normalized) return;
      setAccentCustomColor(normalized);
      setAccentPreference('custom');
      setAccentHarmonyState(preset.scheme);
      if (persist) {
        writeStorage(ACCENT_STORAGE_KEY, 'custom');
        writeStorage(ACCENT_CUSTOM_COLOR_KEY, normalized);
        writeStorage(ACCENT_HARMONY_KEY, preset.scheme);
      }
    },
    [persist],
  );

  const resetAccent = useCallback(() => {
    setAccent('default');
    setAccentHarmonyState('none');
    if (persist) writeStorage(ACCENT_HARMONY_KEY, 'none');
  }, [persist, setAccent]);

  const harmonySelection = useMemo<HarmonySelection | null>(() => {
    if (accentHarmony === 'none') return null;
    if (accentHarmony === 'custom') return accentHarmonyCustom;
    return accentHarmony;
  }, [accentHarmony, accentHarmonyCustom]);

  const harmonyPalette = useMemo(
    () => (harmonySelection ? buildHarmonyPalette(accentHarmonyBase, harmonySelection) : null),
    [accentHarmonyBase, harmonySelection],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      resolved,
      activeTheme,
      setTheme,
      toggle,
      registerTheme,
      getRegisteredThemes,
      accentPreference,
      accent: accentPreference,
      accentCustomColor,
      accentHarmony,
      accentHarmonyCustom,
      accentHarmonyBase,
      accentRevision,
      harmonyPalette,
      harmonySelection,
      setAccent,
      setCustomAccentColor,
      setAccentHarmony,
      setAccentHarmonyCustom,
      setHarmonyPreset,
      resetAccent,
    }),
    [
      accentCustomColor,
      accentHarmony,
      accentHarmonyBase,
      accentHarmonyCustom,
      accentPreference,
      accentRevision,
      activeTheme,
      getRegisteredThemes,
      harmonyPalette,
      harmonySelection,
      preference,
      registerTheme,
      resetAccent,
      resolved,
      setAccent,
      setAccentHarmony,
      setAccentHarmonyCustom,
      setCustomAccentColor,
      setHarmonyPreset,
      setTheme,
      toggle,
    ],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Read theme, accent, and harmony state inside a SpruceProvider. */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}

/** Accent metadata is exported for switchers without requiring a duplicated registry. */
export { ACCENT_OPTIONS };
