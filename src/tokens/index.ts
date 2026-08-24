/**
 * Typed token constants — mirrors the CSS custom property values.
 * Useful for programmatic access (e.g., chart colors, canvas drawing).
 */

export const SPRUCE_COLORS = {
  surface: {
    0: '#fafafa',
    25: '#f8f8f9',
    50: '#f4f4f5',
    100: '#ececee',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },
  primary: {
    base: '#166534',
    hover: '#14532d',
    active: '#052e16',
    subtle: 'rgba(22, 101, 52, 0.09)',
    text: '#fafafa',
    border: 'rgba(22, 101, 52, 0.25)',
  },
  success: {
    base: '#059669',
    hover: '#047857',
    active: '#065f46',
    subtle: 'rgba(5, 150, 105, 0.09)',
    bg: '#ecfdf5',
    border: 'rgba(5, 150, 105, 0.25)',
    text: '#065f46',
  },
  warning: {
    base: '#b45309',
    hover: '#92400e',
    active: '#78350f',
    subtle: 'rgba(180, 83, 9, 0.09)',
    bg: '#fffbeb',
    border: 'rgba(180, 83, 9, 0.25)',
    text: '#92400e',
  },
  danger: {
    base: '#dc2626',
    hover: '#b91c1c',
    active: '#991b1b',
    subtle: 'rgba(220, 38, 38, 0.09)',
    bg: '#fef2f2',
    border: 'rgba(220, 38, 38, 0.25)',
    text: '#b91c1c',
  },
  info: {
    base: '#0e7490',
    hover: '#0369a1',
    active: '#075985',
    subtle: 'rgba(14, 116, 144, 0.09)',
    bg: '#f0f9ff',
    border: 'rgba(14, 116, 144, 0.25)',
    text: '#075985',
  },
  text: {
    default: '#18181b',
    muted: '#3f3f46',
    subtle: '#71717a',
    disabled: '#a1a1aa',
    inverse: '#fafafa',
  },
  border: {
    default: 'rgba(24, 24, 27, 0.055)',
    strong: 'rgba(24, 24, 27, 0.10)',
    focus: '#166534',
  },
} as const;

export const SPRUCE_SPACING = {
  0: '0px',
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

export const SPRUCE_DENSITY = {
  dense: {
    controlHeight: '28px',
    controlPaddingX: '8px',
    controlPaddingY: '4px',
    inlineGap: '8px',
    stackGap: '12px',
    iconSize: '14px',
    listItemMinHeight: '28px',
    panelPadding: '12px',
    datagrid: {
      rowHeight: '26px',
      headerHeight: '24px',
      filterHeight: '28px',
      aggregateHeight: '28px',
      toolbarHeight: '32px',
      footerHeight: '24px',
      paginationHeight: '30px',
      groupHeaderHeight: '18px',
      leafHeaderHeight: '26px',
      cellPaddingX: '8px',
      autoCellPaddingY: '4px',
    },
  },
  default: {
    controlHeight: '32px',
    controlPaddingX: '10px',
    controlPaddingY: '6px',
    inlineGap: '10px',
    stackGap: '16px',
    iconSize: '16px',
    listItemMinHeight: '32px',
    panelPadding: '16px',
    datagrid: {
      rowHeight: '32px',
      headerHeight: '32px',
      filterHeight: '32px',
      aggregateHeight: '32px',
      toolbarHeight: '36px',
      footerHeight: '28px',
      paginationHeight: '34px',
      groupHeaderHeight: '22px',
      leafHeaderHeight: '30px',
      cellPaddingX: '10px',
      autoCellPaddingY: '6px',
    },
  },
  comfortable: {
    controlHeight: '36px',
    controlPaddingX: '12px',
    controlPaddingY: '8px',
    inlineGap: '12px',
    stackGap: '20px',
    iconSize: '18px',
    listItemMinHeight: '40px',
    panelPadding: '20px',
    datagrid: {
      rowHeight: '38px',
      headerHeight: '32px',
      filterHeight: '34px',
      aggregateHeight: '34px',
      toolbarHeight: '40px',
      footerHeight: '30px',
      paginationHeight: '38px',
      groupHeaderHeight: '24px',
      leafHeaderHeight: '34px',
      cellPaddingX: '12px',
      autoCellPaddingY: '8px',
    },
  },
} as const;

export const SPRUCE_TYPOGRAPHY = {
  fontSans:
    "'Noto Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
  fontMono:
    "'Noto Sans Mono', ui-monospace, 'SFMono-Regular', 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
  sizes: {
    '2xs': '0.625rem',
    xs: '0.75rem',
    sm: '0.8125rem',
    base: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  fontSizes: {
    '2xs': 'var(--sp-font-size-2xs)',
    xs: 'var(--sp-font-size-xs)',
    sm: 'var(--sp-font-size-sm)',
    base: 'var(--sp-font-size-base)',
    md: 'var(--sp-font-size-md)',
    lg: 'var(--sp-font-size-lg)',
    xl: 'var(--sp-font-size-xl)',
    '2xl': 'var(--sp-font-size-2xl)',
    '3xl': 'var(--sp-font-size-3xl)',
    '4xl': 'var(--sp-font-size-4xl)',
    '5xl': 'var(--sp-font-size-5xl)',
    '6xl': 'var(--sp-font-size-6xl)',
  },
  fontFamilies: {
    sans: 'var(--sp-font-sans)',
    mono: 'var(--sp-font-mono)',
  },
  weights: {
    light: 300,
    normal: 400,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  fontWeights: {
    light: 'var(--sp-font-weight-light)',
    normal: 'var(--sp-font-weight-normal)',
    regular: 'var(--sp-font-weight-regular)',
    medium: 'var(--sp-font-weight-medium)',
    semibold: 'var(--sp-font-weight-semibold)',
    bold: 'var(--sp-font-weight-bold)',
    extrabold: 'var(--sp-font-weight-extrabold)',
  },
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
  },
  letterSpacings: {
    tighter: '-0.035em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.04em',
    wider: '0.07em',
    widest: '0.1em',
  },
  roles: {
    body: 'var(--sp-text-base)',
    bodyLg: 'var(--sp-text-md)',
    label: 'var(--sp-text-sm)',
    caption: 'var(--sp-text-xs)',
    headingXs: 'var(--sp-text-md)',
    headingSm: 'var(--sp-text-lg)',
    headingMd: 'var(--sp-text-xl)',
    headingLg: 'var(--sp-text-2xl)',
    headingXl: 'var(--sp-text-3xl)',
    displaySm: 'var(--sp-text-4xl)',
    displayMd: 'var(--sp-text-5xl)',
    displayLg: 'var(--sp-text-6xl)',
  },
  fontFeatures: {
    tabular: "'tnum', 'lnum'",
    default: "'cv02', 'cv03', 'cv04', 'cv11'",
  },
} as const;

/**
 * Status tone scale — the OKLCH targets every tinted status surface is built
 * from. Mirrors the `--sp-tone-*` custom properties in `_colors.scss` (light)
 * and `_theme-dark.scss` (dark); the two must move together, and
 * `color-tone.spec.ts` asserts the contrast guarantees these numbers make.
 *
 * A tint is a color at fixed lightness and chroma carrying only the family's
 * hue, so "how bright is a tinted surface" is one number per mode instead of
 * an alpha whose result depends on the surface behind it.
 */
export const SPRUCE_TONE_SCALE = {
  light: {
    tint: { l: 0.96, c: 0.035 },
    border: { l: 0.82, c: 0.1 },
    onTint: { l: 0.47, c: 0.13 },
  },
  dark: {
    tint: { l: 0.3, c: 0.05 },
    border: { l: 0.5, c: 0.09 },
    onTint: { l: 0.85, c: 0.11 },
  },
} as const;

export const SPRUCE_BORDERS = {
  width: {
    none: '0',
    hairline: '1px',
    medium: '2px',
  },
} as const;

export const SPRUCE_RADIUS = {
  none: '0',
  sm: '2px',
  md: '3px',
  lg: '4px',
  xl: '6px',
  '2xl': '8px',
  full: '9999px',
} as const;

export const SPRUCE_Z_INDEX = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  toast: 600,
  tooltip: 700,
} as const;

export const SPRUCE_MOTION = {
  duration: {
    instant: '50ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.2, 0, 0, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.34, 1.8, 0.64, 1)',
    linear: 'linear',
  },
  distance: { sm: '4px', md: '8px', lg: '16px', xl: '24px' },
  scale: { in: 0.95, out: 1.05 },
} as const;

export const SPRUCE_FOCUS = {
  ringColor: 'var(--sp-primary)',
  ringWidth: '2px',
  ringOffset: '2px',
  glowColor: 'var(--sp-primary-subtle)',
  glowSpread: '6px',
} as const;

/** Programmatic counterpart to the shadow CSS tokens. */
export const SPRUCE_SHADOWS = {
  xs: '0 1px 2px rgba(24, 24, 27, 0.03)',
  sm: '0 1px 2px rgba(24, 24, 27, 0.04), 0 1px 3px rgba(24, 24, 27, 0.03)',
  md: '0 4px 12px -2px rgba(24, 24, 27, 0.06), 0 2px 4px -2px rgba(24, 24, 27, 0.04)',
  lg: '0 12px 28px -8px rgba(24, 24, 27, 0.08)',
  xl: '0 20px 44px -16px rgba(24, 24, 27, 0.11)',
  inner: 'inset 0 2px 4px rgba(24, 24, 27, 0.05)',
  none: 'none',
} as const;

export type {
  SpruceGlobalTokenKey,
  SpruceComponentTokenKey,
  SpruceTokenKey,
  SpruceCustomTokenKey,
} from './types.js';
export {
  SPRUCE_GLOBAL_TOKEN_KEYS,
  SPRUCE_COMPONENT_TOKEN_KEYS,
  SPRUCE_TOKEN_KEYS,
} from './types.js';





