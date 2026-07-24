import { type ReactNode } from 'react';
import { IconRegistryProvider } from './icons/icon-registry.js';
import { ThemeProvider } from './theme/theme-context.js';
import type { ThemeProviderProps } from './theme/theme-context.js';
import { DEFAULT_ICONS } from './icons/default-icons.js';

export interface SpruceProviderProps {
  /**
   * Icon registry to use. Defaults to `DEFAULT_ICONS` which includes all
   * built-in Spruce icons. Pass a custom `Record<string, string>` to use only
   * a subset of icons or to add custom icons.
   */
  icons?: Record<string, string>;
  /** Initial theme preference. Defaults to 'system'. */
  defaultTheme?: ThemeProviderProps['defaultTheme'];
  children: ReactNode;
}

/**
 * Root provider for the Spruce design system.
 *
 * Wrap your application (or the subtree using Spruce components) with this
 * provider to activate icon registration and theme management.
 *
 * @example
 * ```tsx
 * <SpruceProvider>
 *   <App />
 * </SpruceProvider>
 * ```
 *
 * @example With custom icons and initial dark theme:
 * ```tsx
 * <SpruceProvider icons={MY_ICONS} defaultTheme="dark">
 *   <App />
 * </SpruceProvider>
 * ```
 */
export function SpruceProvider({
  icons = DEFAULT_ICONS,
  defaultTheme = 'system',
  children,
}: SpruceProviderProps) {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <IconRegistryProvider icons={icons}>
        {children}
      </IconRegistryProvider>
    </ThemeProvider>
  );
}
