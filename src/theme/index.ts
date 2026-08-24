export { oceanTheme } from './presets/ocean.js';
export { forestTheme } from './presets/forest.js';
export { roseTheme } from './presets/rose.js';
export { corporateTheme } from './presets/corporate.js';
export { corporateDarkTheme } from './presets/corporate-dark.js';
export { nightTheme } from './presets/night.js';
export { draculaTheme } from './presets/dracula.js';
export { dimTheme } from './presets/dim.js';
export { retroTheme } from './presets/retro.js';
export { nordTheme } from './presets/nord.js';
export { shadcnTheme } from './presets/shadcn.js';
export { shadcnDarkTheme } from './presets/shadcn-dark.js';
export { agentsTheme } from './presets/agents.js';
export { agentsDarkTheme } from './presets/agents-dark.js';
export { bumblebeeTheme } from './presets/bumblebee.js';
export { bumblebeeDarkTheme } from './presets/bumblebee-dark.js';
export { comicTheme } from './presets/comic.js';
export { comicDarkTheme } from './presets/comic-dark.js';
export { liquidGlassTheme } from './presets/liquid-glass.js';
export { liquidGlassDarkTheme } from './presets/liquid-glass-dark.js';
export { materialTheme } from './presets/material.js';
export { materialDarkTheme } from './presets/material-dark.js';
export { modernTheme } from './presets/modern.js';
export { modernDarkTheme } from './presets/modern-dark.js';
export { monokaiTheme } from './presets/monokai.js';
export { monokaiLightTheme } from './presets/monokai-light.js';
export { spruceTheme } from './presets/spruce.js';
export { spruceDarkTheme } from './presets/spruce-dark.js';
export { spruceCharcoalTheme } from './presets/spruce-charcoal.js';
export { spruceCharcoalDarkTheme } from './presets/spruce-charcoal-dark.js';
export { spruceSlateTheme } from './presets/spruce-slate.js';
export { spruceSlateDarkTheme } from './presets/spruce-slate-dark.js';
export { visualStudioTheme } from './presets/visual-studio.js';
export { visualStudioDarkTheme } from './presets/visual-studio-dark.js';
export { SPRUCE_THEME_PRESETS } from './presets/all.js';

export {
  ACCENT_OPTIONS,
  DEFAULT_CUSTOM_ACCENT_HEX,
  accentPresetBaseHex,
  buildAccentStylesheet,
  buildCustomAccentStylesheet,
  isAccentId,
  normalizeAccentHex,
} from './accent-presets.js';
export type { AccentId } from './accent-presets.js';

export {
  HARMONY_PRESETS,
  HARMONY_SCHEMES,
  buildHarmonyPalette,
  buildHarmonyStylesheet,
  findHarmonyPreset,
  harmonyContrastReport,
  harmonyOffsets,
  isCustomHarmony,
  isHarmonySchemeId,
  matchHarmonyScheme,
  toCustomHarmony,
} from './accent-harmony.js';
export type {
  CustomHarmony,
  HarmonyContrastRow,
  HarmonyModePalette,
  HarmonyPalette,
  HarmonyPreset,
  HarmonyRole,
  HarmonySchemeDefinition,
  HarmonySchemeId,
  HarmonySelection,
} from './accent-harmony.js';
export type { Rgb, Oklch } from './color.js';

export type { SpruceTheme, ThemePreference } from './types.js';
export { applyThemeToDocument } from './theme-dom.js';
