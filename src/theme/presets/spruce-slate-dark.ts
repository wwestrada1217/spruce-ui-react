import type { SpruceTheme } from '../types.js';

/**
 * Spruce Slate Dark — dark companion to {@link spruceSlateTheme}. Cool slate base
 * surfaces with a soft slate-blue accent.
 */
export const spruceSlateDarkTheme: SpruceTheme = {
  name: 'spruce-slate-dark',
  displayName: 'Spruce Slate Dark',
  base: 'dark',
  tokens: {
    '--sp-primary': '#8aa6e6',
    '--sp-primary-hover': '#a9bff0',
    '--sp-primary-active': '#6f8fde',
    '--sp-primary-subtle': 'rgba(138, 166, 230, 0.16)',
    '--sp-primary-text': '#0f172a',
    '--sp-border-focus': '#8aa6e6',

    '--sp-success': '#34d399',
    '--sp-success-subtle': 'rgba(52, 211, 153, 0.13)',

    '--sp-info': '#60a5fa',
    '--sp-info-subtle': 'rgba(96, 165, 250, 0.13)',

    '--sp-warning': '#fbbf24',
    '--sp-warning-subtle': 'rgba(251, 191, 36, 0.13)',

    '--sp-danger': '#f87171',
    '--sp-danger-subtle': 'rgba(248, 113, 113, 0.13)',

    '--sp-surface-0': '#0f172a',
    '--sp-surface-25': '#131c30',
    '--sp-surface-50': '#182236',
    '--sp-surface-100': '#1e293b',
    '--sp-surface-200': '#273449',
    '--sp-surface-300': '#334155',
    '--sp-surface-400': '#475569',
    '--sp-surface-500': '#64748b',
    '--sp-surface-600': '#94a3b8',
    '--sp-surface-700': '#cbd5e1',
    '--sp-surface-800': '#e2e8f0',
    '--sp-surface-900': '#f1f5f9',
    '--sp-surface-950': '#f8fafc',

    '--sp-text-color': '#e2e8f0',
    '--sp-text-muted': '#cbd5e1',
    '--sp-text-subtle': '#94a3b8',
    '--sp-text-disabled': '#64748b',
    '--sp-text-inverse': '#0f172a',

    '--sp-border': 'rgba(226, 232, 240, 0.08)',
    '--sp-border-strong': 'rgba(226, 232, 240, 0.14)',

    '--sp-content-hover-bg': 'rgba(226, 232, 240, 0.05)',
    '--sp-content-active-bg': 'rgba(226, 232, 240, 0.09)',

    '--sp-overlay-bg': 'rgba(2, 6, 23, 0.62)',

    '--sp-scrollbar-track': 'rgba(226, 232, 240, 0.04)',
    '--sp-scrollbar-thumb': '#334155',
    '--sp-scrollbar-hover': '#475569',

    '--sp-focus-ring-color': 'rgba(138, 166, 230, 0.34)',
    '--sp-focus-glow-color': 'rgba(138, 166, 230, 0.16)',
    '--sp-focus-glow-spread': '3px',

    '--sp-radius-sm': '2px',
    '--sp-radius-md': '3px',
    '--sp-radius-lg': '4px',
    '--sp-radius-xl': '6px',
    '--sp-radius-2xl': '8px',

    '--sp-shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.45)',
    '--sp-shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.52), 0 1px 2px rgba(0, 0, 0, 0.4)',
    '--sp-shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.58), 0 2px 4px -2px rgba(0, 0, 0, 0.46)',
    '--sp-shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.64), 0 4px 6px -4px rgba(0, 0, 0, 0.52)',

    '--sp-card-bg': '#131c30',
    '--sp-card-bg-filled': '#1e293b',
    '--sp-card-border': 'rgba(226, 232, 240, 0.08)',
    '--sp-card-radius': '8px',

    '--sp-input-bg': '#131c30',
    '--sp-input-border': 'rgba(226, 232, 240, 0.12)',
    '--sp-input-border-focus': '#8aa6e6',
    '--sp-input-radius': '3px',
    '--sp-input-text': '#e2e8f0',

    '--sp-modal-bg': '#131c30',
    '--sp-modal-radius': '8px',
    '--sp-modal-border': 'rgba(226, 232, 240, 0.10)',

    '--sp-btn-radius': '3px',
    '--sp-alert-radius': '4px',
    '--sp-select-bg': '#131c30',
    '--sp-select-border': 'rgba(226, 232, 240, 0.12)',
    '--sp-select-border-focus': '#8aa6e6',
    '--sp-select-radius': '3px',
    '--sp-checkbox-border': 'rgba(226, 232, 240, 0.18)',
    '--sp-checkbox-radius': '2px',

    '--sp-chart-title-color': '#e2e8f0',
    '--sp-chart-subtitle-color': '#94a3b8',
    '--sp-chart-axis-text': '#94a3b8',
    '--sp-chart-axis-line': '#334155',
    '--sp-chart-grid-line': '#1e293b',
    '--sp-chart-value-label': '#cbd5e1',
    '--sp-chart-axis-label': '#64748b',
    '--sp-chart-legend-text': '#94a3b8',
    '--sp-chart-dot-stroke': '#0f172a',
    '--sp-chart-tooltip-bg': '#273449',
    '--sp-chart-tooltip-text': '#f8fafc',
    '--sp-chart-track-bg': '#1e293b',
  },
};

