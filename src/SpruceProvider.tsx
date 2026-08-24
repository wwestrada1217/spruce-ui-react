import { type ReactNode } from 'react';
import { IconRegistryProvider } from './icons/icon-registry.js';
import { ThemeProvider } from './theme/theme-context.js';
import type { ThemeProviderProps } from './theme/theme-context.js';
import { DEFAULT_ICONS } from './icons/default-icons.js';
import {
  SpruceI18nProvider,
  type SpruceI18nProviderProps,
} from './i18n/i18n-context.js';

export interface SpruceProviderProps
  extends Omit<ThemeProviderProps, 'children'>,
    Omit<SpruceI18nProviderProps, 'children'> {
  /**
   * Icon registry to use. Defaults to `DEFAULT_ICONS` which includes all
   * built-in Spruce icons. Pass a custom `Record<string, string>` to use only
   * a subset of icons or to add custom icons.
   */
  icons?: Record<string, string>;
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
  theme,
  defaultAccent,
  defaultAccentCustomColor,
  defaultAccentHarmony,
  defaultAccentHarmonyCustom,
  persist,
  storageKey,
  locale,
  direction,
  labels,
  firstDayOfWeek,
  dateFormatOptions,
  shortDateFormatOptions,
  syncDocument,
  children,
}: SpruceProviderProps) {
  return (
    <ThemeProvider
      defaultTheme={defaultTheme}
      theme={theme}
      defaultAccent={defaultAccent}
      defaultAccentCustomColor={defaultAccentCustomColor}
      defaultAccentHarmony={defaultAccentHarmony}
      defaultAccentHarmonyCustom={defaultAccentHarmonyCustom}
      persist={persist}
      storageKey={storageKey}
    >
      <IconRegistryProvider icons={icons}>
        <SpruceI18nProvider
          locale={locale}
          direction={direction}
          labels={labels}
          firstDayOfWeek={firstDayOfWeek}
          dateFormatOptions={dateFormatOptions}
          shortDateFormatOptions={shortDateFormatOptions}
          syncDocument={syncDocument}
        >
          {children}
        </SpruceI18nProvider>
      </IconRegistryProvider>
    </ThemeProvider>
  );
}
