import type { SpruceTheme } from '../types.js';

/**
 * Liquid Glass preset — a bright iOS-inspired theme with translucent surfaces,
 * soft blue accents, large radius, and layered glass-like elevation.
 */
export const liquidGlassTheme: SpruceTheme = {
  name: 'liquid-glass',
  displayName: 'Liquid Glass',
  base: 'light',
  tokens: {
    '--sp-primary': '#007aff',
    '--sp-primary-hover': '#006ee6',
    '--sp-primary-active': '#005ec4',
    '--sp-primary-subtle': 'rgba(0, 122, 255, 0.12)',
    '--sp-primary-text': '#ffffff',
    '--sp-border-focus': '#007aff',

    '--sp-success': '#34c759',
    '--sp-success-subtle': 'rgba(52, 199, 89, 0.12)',
    '--sp-info': '#5ac8fa',
    '--sp-info-subtle': 'rgba(90, 200, 250, 0.14)',
    '--sp-warning': '#ff9500',
    '--sp-warning-subtle': 'rgba(255, 149, 0, 0.13)',
    '--sp-danger': '#ff3b30',
    '--sp-danger-subtle': 'rgba(255, 59, 48, 0.12)',

    '--sp-surface-0': 'rgba(255, 255, 255, 0.78)',
    '--sp-surface-25': 'rgba(255, 255, 255, 0.66)',
    '--sp-surface-50': 'rgba(248, 250, 255, 0.62)',
    '--sp-surface-100': 'rgba(241, 246, 255, 0.58)',
    '--sp-surface-200': 'rgba(226, 234, 247, 0.62)',
    '--sp-surface-300': 'rgba(203, 213, 225, 0.72)',
    '--sp-surface-400': '#94a3b8',
    '--sp-surface-500': '#64748b',
    '--sp-surface-600': '#475569',
    '--sp-surface-700': '#334155',
    '--sp-surface-800': '#1e293b',
    '--sp-surface-900': '#0f172a',
    '--sp-surface-950': '#020617',

    '--sp-text-color': '#0f172a',
    '--sp-text-muted': '#334155',
    '--sp-text-subtle': '#64748b',
    '--sp-text-disabled': '#94a3b8',
    '--sp-text-inverse': '#ffffff',

    '--sp-border': 'rgba(255, 255, 255, 0.55)',
    '--sp-border-strong': 'rgba(148, 163, 184, 0.32)',
    // Glass panels lean on a soft rim rather than a hard line, but a floating
    // panel still needs an edge you can find against a bright page.
    '--sp-overlay-border': 'rgba(148, 163, 184, 0.55)',
    '--sp-content-hover-bg': 'rgba(255, 255, 255, 0.36)',
    '--sp-content-active-bg': 'rgba(0, 122, 255, 0.10)',
    '--sp-overlay-bg': 'rgba(15, 23, 42, 0.28)',

    '--sp-scrollbar-track': 'rgba(255, 255, 255, 0.24)',
    '--sp-scrollbar-thumb': 'rgba(148, 163, 184, 0.52)',
    '--sp-scrollbar-hover': 'rgba(100, 116, 139, 0.62)',
    '--sp-backdrop-filter': 'blur(24px) saturate(180%) brightness(1.06)',
    '--sp-backdrop-filter-strong': 'blur(36px) saturate(190%) brightness(1.08)',

    '--sp-frosted-bg': 'rgba(255, 255, 255, 0.46)',
    '--sp-frosted-border': 'rgba(255, 255, 255, 0.64)',
    '--sp-frosted-blur': 'blur(24px) saturate(180%) brightness(1.06)',
    '--sp-frosted-blur-strong': 'blur(36px) saturate(190%) brightness(1.08)',
    '--sp-frosted-shadow':
      '0 18px 38px -26px rgba(15, 23, 42, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.90), inset 0 0 0 1px rgba(255, 255, 255, 0.14)',

    '--sp-focus-ring-color': 'rgba(0, 122, 255, 0.32)',
    '--sp-focus-glow-color': 'rgba(0, 122, 255, 0.18)',
    '--sp-focus-glow-spread': '8px',

    '--sp-radius-sm': '10px',
    '--sp-radius-md': '14px',
    '--sp-radius-lg': '18px',
    '--sp-radius-xl': '24px',
    '--sp-radius-2xl': '30px',

    // Each glass shadow pairs an ambient drop shadow with a bright specular
    // rim — a strong top edge highlight plus a soft inner glow and a faint
    // lower-edge shadow — so surfaces read as a lit, refractive glass slab.
    '--sp-shadow-xs': '0 1px 2px rgba(15, 23, 42, 0.06)',
    '--sp-shadow-sm':
      '0 8px 20px -16px rgba(15, 23, 42, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.85), inset 0 0 0 1px rgba(255, 255, 255, 0.12)',
    '--sp-shadow-md':
      '0 18px 38px -26px rgba(15, 23, 42, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.90), inset 0 0 0 1px rgba(255, 255, 255, 0.14), inset 0 -1px 0 rgba(15, 23, 42, 0.05)',
    '--sp-shadow-lg':
      '0 28px 70px -42px rgba(15, 23, 42, 0.46), inset 0 1px 0 rgba(255, 255, 255, 0.94), inset 0 0 0 1px rgba(255, 255, 255, 0.16), inset 0 -1px 0 rgba(15, 23, 42, 0.06)',
    '--sp-shadow-xl':
      '0 36px 96px -52px rgba(15, 23, 42, 0.52), inset 0 1px 0 rgba(255, 255, 255, 0.96), inset 0 0 0 1px rgba(255, 255, 255, 0.18), inset 0 -1px 0 rgba(15, 23, 42, 0.06)',

    '--sp-card-bg': 'rgba(255, 255, 255, 0.60)',
    '--sp-card-bg-filled': 'rgba(255, 255, 255, 0.46)',
    '--sp-card-border': 'rgba(255, 255, 255, 0.64)',
    '--sp-card-radius': '24px',

    '--sp-input-bg': 'rgba(255, 255, 255, 0.52)',
    '--sp-input-border': 'rgba(148, 163, 184, 0.28)',
    '--sp-input-border-focus': '#007aff',
    '--sp-input-radius': '16px',
    '--sp-input-text': '#0f172a',

    '--sp-modal-bg': 'rgba(255, 255, 255, 0.74)',
    '--sp-modal-radius': '28px',
    '--sp-modal-border': 'rgba(255, 255, 255, 0.70)',

    '--sp-btn-radius': '16px',
    '--sp-alert-radius': '20px',
    '--sp-select-bg': 'rgba(255, 255, 255, 0.52)',
    '--sp-select-border': 'rgba(148, 163, 184, 0.28)',
    '--sp-select-border-focus': '#007aff',
    '--sp-select-radius': '16px',
    '--sp-checkbox-border': 'rgba(100, 116, 139, 0.34)',
    '--sp-checkbox-radius': '8px',

    '--sp-chart-title-color': '#0f172a',
    '--sp-chart-subtitle-color': '#64748b',
    '--sp-chart-axis-text': '#64748b',
    '--sp-chart-axis-line': 'rgba(148, 163, 184, 0.38)',
    '--sp-chart-grid-line': 'rgba(203, 213, 225, 0.48)',
    '--sp-chart-value-label': '#334155',
    '--sp-chart-axis-label': '#94a3b8',
    '--sp-chart-legend-text': '#64748b',
    '--sp-chart-dot-stroke': 'rgba(255, 255, 255, 0.82)',
    '--sp-chart-tooltip-bg': 'rgba(15, 23, 42, 0.86)',
    '--sp-chart-tooltip-text': '#f8fafc',
    '--sp-chart-track-bg': 'rgba(241, 246, 255, 0.58)',
  },
};

