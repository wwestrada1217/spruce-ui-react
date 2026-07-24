import type { SpruceTokenKey } from '../tokens/index.js';

/**
 * A Spruce theme preset. Defines a named set of CSS custom property overrides
 * that are applied to the document root when the theme is activated.
 */
export interface SpruceTheme {
  /** Unique identifier used to activate the theme via `setTheme(name)`. */
  name: string;
  /** Human-readable label for display in UI (e.g., a theme switcher). */
  displayName: string;
  /** The base color scheme this theme builds on. Used to toggle `.dark` class. */
  base: 'light' | 'dark';
  /** Token overrides applied as inline CSS variables on `:root`. */
  tokens: Partial<Record<SpruceTokenKey, string>>;
}

/** Built-in theme names plus an escape hatch for custom theme names. */
export type ThemePreference = 'light' | 'dark' | 'system' | (string & {});
