import type { SpruceTheme } from '../types.js';

/**
 * Corporate Dark preset — the enterprise navy palette recast for dark environments.
 */
export const corporateDarkTheme: SpruceTheme = {
  name: 'corporate-dark',
  displayName: 'Corporate Dark',
  base: 'dark',
  tokens: {
    '--sp-primary': '#4a8cc4',
    '--sp-primary-hover': '#6ba3d0',
    '--sp-primary-active': '#3a76ad',
    '--sp-primary-subtle': 'rgba(74, 140, 196, 0.15)',
    '--sp-primary-text': '#ffffff',
    '--sp-border-focus': '#4a8cc4',
    '--sp-success': '#4ade80',
    '--sp-success-subtle': 'rgba(74, 222, 128, 0.12)',
    '--sp-info': '#60a5fa',
    '--sp-info-subtle': 'rgba(96, 165, 250, 0.12)',
    '--sp-warning': '#fbbf24',
    '--sp-warning-subtle': 'rgba(251, 191, 36, 0.12)',
    '--sp-danger': '#f87171',
    '--sp-danger-subtle': 'rgba(248, 113, 113, 0.12)',
    '--sp-surface-0': '#0c1220',
    '--sp-surface-25': '#101827',
    '--sp-surface-50': '#151e30',
    '--sp-surface-100': '#1c2942',
    '--sp-surface-200': '#243454',
    '--sp-surface-300': '#2e4068',
    '--sp-chart-grid-line': '#1c2942',
    '--sp-chart-axis-line': '#1c2942',
    '--sp-chart-dot-stroke': '#0c1220',
    '--sp-chart-tooltip-bg': '#151e30',
    '--sp-chart-track-bg': '#151e30',
    '--sp-radius-sm': '2px',
    '--sp-radius-md': '3px',
    '--sp-radius-lg': '4px',
    '--sp-radius-xl': '6px',
    '--sp-radius-2xl': '8px',
  },
};
