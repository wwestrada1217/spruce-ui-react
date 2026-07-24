/**
 * Typed token constants — mirrors the CSS custom property values.
 * Useful for programmatic access (e.g., chart colors, canvas drawing).
 */

export const SPRUCE_COLORS = {
  surface: {
    0: '#ffffff', 25: '#fcfcfd', 50: '#f8f9fb', 100: '#f1f3f6',
    200: '#e4e7ec', 300: '#cdd3dc', 400: '#9ca5b4', 500: '#6b7685',
    600: '#4a5567', 700: '#374151', 800: '#1f2937', 900: '#151b2b', 950: '#0f1117',
  },
  primary: { base: '#2563eb', hover: '#1d4ed8', active: '#1e40af' },
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
  info: '#0891b2',
} as const;

export const SPRUCE_SPACING = {
  0: '0px', px: '1px', 0.5: '2px', 1: '4px', 1.5: '6px',
  2: '8px', 2.5: '10px', 3: '12px', 3.5: '14px', 4: '16px',
  5: '20px', 6: '24px', 7: '28px', 8: '32px', 9: '36px',
  10: '40px', 12: '48px', 14: '56px', 16: '64px', 20: '80px', 24: '96px',
} as const;

export const SPRUCE_TYPOGRAPHY = {
  fontSans:
    "'League Spartan', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontMono:
    "ui-monospace, 'SFMono-Regular', 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
  sizes: {
    '2xs': '0.625rem', xs: '0.6875rem', sm: '0.8125rem',
    base: '0.875rem', md: '1rem', lg: '1.125rem',
    xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem',
  },
  weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
} as const;

export const SPRUCE_RADIUS = {
  none: '0', sm: '4px', md: '6px', lg: '8px', xl: '12px', '2xl': '16px', full: '9999px',
} as const;

export const SPRUCE_SHADOWS = {
  xs: '0 1px 2px rgba(0,0,0,0.05)',
  sm: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
  md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
  lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
  xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
  inner: 'inset 0 2px 4px rgba(0,0,0,0.06)',
  none: 'none',
} as const;

export const SPRUCE_Z_INDEX = {
  base: 0, dropdown: 100, sticky: 200, overlay: 300,
  modal: 400, popover: 500, toast: 600, tooltip: 700,
} as const;

export const SPRUCE_MOTION = {
  duration: {
    instant: '50ms', fast: '100ms', normal: '200ms',
    slow: '300ms', slower: '500ms',
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

/** All CSS custom property keys defined by the Spruce design system. */
export type SpruceTokenKey =
  | '--sp-surface-0' | '--sp-surface-25' | '--sp-surface-50' | '--sp-surface-100'
  | '--sp-surface-200' | '--sp-surface-300' | '--sp-surface-400' | '--sp-surface-500'
  | '--sp-surface-600' | '--sp-surface-700' | '--sp-surface-800' | '--sp-surface-900'
  | '--sp-surface-950'
  | '--sp-primary' | '--sp-primary-hover' | '--sp-primary-active'
  | '--sp-primary-subtle' | '--sp-primary-text'
  | '--sp-success' | '--sp-success-subtle'
  | '--sp-warning' | '--sp-warning-subtle'
  | '--sp-danger'  | '--sp-danger-subtle'
  | '--sp-info'    | '--sp-info-subtle'
  | '--sp-text-color' | '--sp-text-muted' | '--sp-text-subtle'
  | '--sp-text-disabled' | '--sp-text-inverse'
  | '--sp-border' | '--sp-border-strong' | '--sp-border-focus'
  | '--sp-content-hover-bg' | '--sp-content-active-bg'
  | '--sp-overlay-bg'
  | '--sp-scrollbar-track' | '--sp-scrollbar-thumb' | '--sp-scrollbar-hover'
  | '--sp-focus-ring-color' | '--sp-focus-ring-width'
  | '--sp-focus-ring-offset' | '--sp-focus-glow-color' | '--sp-focus-glow-spread'
  | '--sp-font-sans' | '--sp-font-mono'
  | '--sp-text-2xs' | '--sp-text-xs' | '--sp-text-sm' | '--sp-text-base'
  | '--sp-text-md' | '--sp-text-lg' | '--sp-text-xl' | '--sp-text-2xl' | '--sp-text-3xl'
  | '--sp-font-normal' | '--sp-font-medium' | '--sp-font-semibold' | '--sp-font-bold'
  | '--sp-leading-none' | '--sp-leading-tight' | '--sp-leading-snug'
  | '--sp-leading-normal' | '--sp-leading-relaxed'
  | '--sp-tracking-tight' | '--sp-tracking-normal' | '--sp-tracking-wide' | '--sp-tracking-wider'
  | '--sp-space-0'   | '--sp-space-px'  | '--sp-space-0_5' | '--sp-space-1'
  | '--sp-space-1_5' | '--sp-space-2'   | '--sp-space-2_5' | '--sp-space-3'
  | '--sp-space-3_5' | '--sp-space-4'   | '--sp-space-5'   | '--sp-space-6'
  | '--sp-space-7'   | '--sp-space-8'   | '--sp-space-9'   | '--sp-space-10'
  | '--sp-space-12'  | '--sp-space-14'  | '--sp-space-16'  | '--sp-space-20' | '--sp-space-24'
  | '--sp-radius-none' | '--sp-radius-sm' | '--sp-radius-md' | '--sp-radius-lg'
  | '--sp-radius-xl' | '--sp-radius-2xl' | '--sp-radius-full'
  | '--sp-shadow-xs' | '--sp-shadow-sm' | '--sp-shadow-md'
  | '--sp-shadow-lg' | '--sp-shadow-xl' | '--sp-shadow-inner' | '--sp-shadow-none'
  | '--sp-z-base' | '--sp-z-dropdown' | '--sp-z-sticky' | '--sp-z-overlay'
  | '--sp-z-modal' | '--sp-z-popover' | '--sp-z-toast' | '--sp-z-tooltip'
  | '--sp-duration-instant' | '--sp-duration-fast' | '--sp-duration-normal'
  | '--sp-duration-slow' | '--sp-duration-slower'
  | '--sp-ease-default' | '--sp-ease-in' | '--sp-ease-out' | '--sp-ease-in-out'
  | '--sp-ease-spring' | '--sp-ease-bounce' | '--sp-ease-linear'
  | '--sp-motion-distance-sm' | '--sp-motion-distance-md'
  | '--sp-motion-distance-lg' | '--sp-motion-distance-xl'
  | '--sp-motion-scale-in' | '--sp-motion-scale-out'
  | '--sp-chart-title-color' | '--sp-chart-subtitle-color' | '--sp-chart-axis-text'
  | '--sp-chart-axis-line' | '--sp-chart-grid-line' | '--sp-chart-value-label'
  | '--sp-chart-axis-label' | '--sp-chart-legend-text' | '--sp-chart-dot-stroke'
  | '--sp-chart-tooltip-bg' | '--sp-chart-tooltip-text' | '--sp-chart-track-bg'
  | '--sp-icon-secondary-color' | '--sp-icon-secondary-opacity'
  | (string & {});
