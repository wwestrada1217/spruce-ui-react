import type { SpruceTheme } from '../types.js';

/**
 * Liquid Glass Dark preset — an iOS-inspired dark glass theme with translucent
 * charcoal surfaces, luminous blue accents, and soft layered elevation.
 */
export const liquidGlassDarkTheme: SpruceTheme = {
  name: 'liquid-glass-dark',
  displayName: 'Liquid Glass Dark',
  base: 'dark',
  tokens: {
    '--sp-primary': '#0a84ff',
    '--sp-primary-hover': '#409cff',
    '--sp-primary-active': '#0066cc',
    '--sp-primary-subtle': 'rgba(10, 132, 255, 0.18)',
    '--sp-primary-text': '#ffffff',
    '--sp-border-focus': '#0a84ff',

    '--sp-success': '#30d158',
    '--sp-success-subtle': 'rgba(48, 209, 88, 0.14)',
    '--sp-info': '#64d2ff',
    '--sp-info-subtle': 'rgba(100, 210, 255, 0.15)',
    '--sp-warning': '#ffd60a',
    '--sp-warning-subtle': 'rgba(255, 214, 10, 0.15)',
    '--sp-danger': '#ff453a',
    '--sp-danger-subtle': 'rgba(255, 69, 58, 0.15)',

    '--sp-surface-0': 'rgba(20, 24, 33, 0.74)',
    '--sp-surface-25': 'rgba(24, 29, 39, 0.68)',
    '--sp-surface-50': 'rgba(29, 35, 48, 0.64)',
    '--sp-surface-100': 'rgba(36, 43, 58, 0.62)',
    '--sp-surface-200': 'rgba(48, 57, 75, 0.66)',
    '--sp-surface-300': 'rgba(71, 85, 105, 0.74)',
    '--sp-surface-400': '#64748b',
    '--sp-surface-500': '#94a3b8',
    '--sp-surface-600': '#cbd5e1',
    '--sp-surface-700': '#e2e8f0',
    '--sp-surface-800': '#f1f5f9',
    '--sp-surface-900': '#f8fafc',
    '--sp-surface-950': '#ffffff',

    '--sp-text-color': '#f8fafc',
    '--sp-text-muted': '#e2e8f0',
    '--sp-text-subtle': '#cbd5e1',
    '--sp-text-disabled': '#64748b',
    '--sp-text-inverse': '#0f172a',

    '--sp-border': 'rgba(255, 255, 255, 0.12)',
    '--sp-border-strong': 'rgba(255, 255, 255, 0.22)',
    '--sp-overlay-border': 'rgba(255, 255, 255, 0.28)',
    '--sp-content-hover-bg': 'rgba(255, 255, 255, 0.08)',
    '--sp-content-active-bg': 'rgba(10, 132, 255, 0.18)',
    '--sp-overlay-bg': 'rgba(0, 0, 0, 0.58)',

    '--sp-scrollbar-track': 'rgba(255, 255, 255, 0.06)',
    '--sp-scrollbar-thumb': 'rgba(148, 163, 184, 0.42)',
    '--sp-scrollbar-hover': 'rgba(203, 213, 225, 0.52)',
    '--sp-backdrop-filter': 'blur(26px) saturate(190%) brightness(1.12)',
    '--sp-backdrop-filter-strong': 'blur(40px) saturate(200%) brightness(1.16)',

    '--sp-frosted-bg': 'rgba(24, 29, 39, 0.50)',
    '--sp-frosted-border': 'rgba(255, 255, 255, 0.16)',
    '--sp-frosted-blur': 'blur(26px) saturate(190%) brightness(1.12)',
    '--sp-frosted-blur-strong': 'blur(40px) saturate(200%) brightness(1.16)',
    '--sp-frosted-shadow':
      '0 20px 44px -28px rgba(0, 0, 0, 0.66), inset 0 1px 0 rgba(255, 255, 255, 0.24), inset 0 0 0 1px rgba(255, 255, 255, 0.07)',

    '--sp-focus-ring-color': 'rgba(10, 132, 255, 0.36)',
    '--sp-focus-glow-color': 'rgba(10, 132, 255, 0.22)',
    '--sp-focus-glow-spread': '8px',

    '--sp-radius-sm': '10px',
    '--sp-radius-md': '14px',
    '--sp-radius-lg': '18px',
    '--sp-radius-xl': '24px',
    '--sp-radius-2xl': '30px',

    // Dark glass catches a cooler, dimmer specular rim: a luminous top edge
    // plus a faint full-perimeter light line so the slab edge stays legible
    // against the deep gradient field behind it.
    '--sp-shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.28)',
    '--sp-shadow-sm':
      '0 10px 24px -18px rgba(0, 0, 0, 0.58), inset 0 1px 0 rgba(255, 255, 255, 0.20), inset 0 0 0 1px rgba(255, 255, 255, 0.06)',
    '--sp-shadow-md':
      '0 20px 44px -28px rgba(0, 0, 0, 0.66), inset 0 1px 0 rgba(255, 255, 255, 0.24), inset 0 0 0 1px rgba(255, 255, 255, 0.07)',
    '--sp-shadow-lg':
      '0 32px 76px -44px rgba(0, 0, 0, 0.76), inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
    '--sp-shadow-xl':
      '0 42px 110px -58px rgba(0, 0, 0, 0.82), inset 0 1px 0 rgba(255, 255, 255, 0.30), inset 0 0 0 1px rgba(255, 255, 255, 0.09)',

    '--sp-card-bg': 'rgba(24, 29, 39, 0.58)',
    '--sp-card-bg-filled': 'rgba(36, 43, 58, 0.52)',
    '--sp-card-border': 'rgba(255, 255, 255, 0.16)',
    '--sp-card-radius': '24px',

    '--sp-input-bg': 'rgba(24, 29, 39, 0.50)',
    '--sp-input-border': 'rgba(255, 255, 255, 0.16)',
    '--sp-input-border-focus': '#0a84ff',
    '--sp-input-radius': '16px',
    '--sp-input-text': '#f8fafc',

    '--sp-modal-bg': 'rgba(20, 24, 33, 0.76)',
    '--sp-modal-radius': '28px',
    '--sp-modal-border': 'rgba(255, 255, 255, 0.18)',

    '--sp-btn-radius': '16px',
    '--sp-alert-radius': '20px',
    '--sp-select-bg': 'rgba(24, 29, 39, 0.50)',
    '--sp-select-border': 'rgba(255, 255, 255, 0.16)',
    '--sp-select-border-focus': '#0a84ff',
    '--sp-select-radius': '16px',
    '--sp-checkbox-border': 'rgba(255, 255, 255, 0.22)',
    '--sp-checkbox-radius': '8px',

    '--sp-chart-title-color': '#f8fafc',
    '--sp-chart-subtitle-color': '#cbd5e1',
    '--sp-chart-axis-text': '#cbd5e1',
    '--sp-chart-axis-line': 'rgba(148, 163, 184, 0.28)',
    '--sp-chart-grid-line': 'rgba(100, 116, 139, 0.28)',
    '--sp-chart-value-label': '#e2e8f0',
    '--sp-chart-axis-label': '#94a3b8',
    '--sp-chart-legend-text': '#cbd5e1',
    '--sp-chart-dot-stroke': 'rgba(20, 24, 33, 0.86)',
    '--sp-chart-tooltip-bg': 'rgba(2, 6, 23, 0.88)',
    '--sp-chart-tooltip-text': '#f8fafc',
    '--sp-chart-track-bg': 'rgba(36, 43, 58, 0.58)',
  },
};

