import type { SpruceTheme } from '../types.js';

/**
 * Spruce Charcoal — a near-monochrome flavor of {@link spruceTheme}. Keeps the
 * cool slate neutrals but uses a blue-tinted charcoal accent instead of a colored
 * one, for a restrained, low-chroma look that still reads cool rather than neutral.
 */
export const spruceCharcoalTheme: SpruceTheme = {
  name: 'spruce-charcoal',
  displayName: 'Spruce Charcoal',
  base: 'light',
  tokens: {
    '--sp-primary': '#1e293b',
    '--sp-primary-hover': '#273449',
    '--sp-primary-active': '#0f172a',
    '--sp-primary-subtle': 'rgba(30, 41, 59, 0.08)',
    '--sp-primary-text': '#f8fafc',
    '--sp-border-focus': '#334155',

    '--sp-success': '#16a34a',
    '--sp-success-subtle': 'rgba(22, 163, 74, 0.09)',

    '--sp-info': '#475569',
    '--sp-info-subtle': 'rgba(71, 85, 105, 0.09)',

    '--sp-warning': '#b45309',
    '--sp-warning-subtle': 'rgba(180, 83, 9, 0.09)',

    '--sp-danger': '#dc2626',
    '--sp-danger-subtle': 'rgba(220, 38, 38, 0.09)',

    '--sp-surface-0': '#f8fafc',
    '--sp-surface-25': '#f4f7fb',
    '--sp-surface-50': '#f1f5f9',
    '--sp-surface-100': '#e9eef5',
    '--sp-surface-200': '#e2e8f0',
    '--sp-surface-300': '#cbd5e1',
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
    '--sp-text-inverse': '#f8fafc',

    '--sp-border': 'rgba(15, 23, 42, 0.08)',
    '--sp-border-strong': 'rgba(15, 23, 42, 0.14)',

    '--sp-content-hover-bg': 'rgba(15, 23, 42, 0.04)',
    '--sp-content-active-bg': 'rgba(15, 23, 42, 0.07)',

    '--sp-overlay-bg': 'rgba(15, 23, 42, 0.45)',

    '--sp-scrollbar-track': 'rgba(15, 23, 42, 0.03)',
    '--sp-scrollbar-thumb': '#cbd5e1',
    '--sp-scrollbar-hover': '#94a3b8',

    '--sp-focus-ring-color': 'rgba(51, 65, 85, 0.35)',
    '--sp-focus-glow-color': 'rgba(51, 65, 85, 0.12)',
    '--sp-focus-glow-spread': '5px',

    '--sp-radius-sm': '2px',
    '--sp-radius-md': '3px',
    '--sp-radius-lg': '4px',
    '--sp-radius-xl': '6px',
    '--sp-radius-2xl': '8px',

    '--sp-shadow-xs': '0 1px 2px rgba(15, 23, 42, 0.03)',
    '--sp-shadow-sm': '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.03)',
    '--sp-shadow-md':
      '0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
    '--sp-shadow-lg': '0 12px 28px -8px rgba(15, 23, 42, 0.08)',

    '--sp-card-bg': '#ffffff',
    '--sp-card-bg-filled': '#f1f5f9',
    '--sp-card-border': 'rgba(15, 23, 42, 0.08)',
    '--sp-card-radius': '8px',

    '--sp-input-bg': '#ffffff',
    '--sp-input-border': 'rgba(15, 23, 42, 0.11)',
    '--sp-input-border-focus': '#334155',
    '--sp-input-radius': '3px',
    '--sp-input-text': '#0f172a',

    '--sp-modal-bg': '#f8fafc',
    '--sp-modal-radius': '8px',
    '--sp-modal-border': 'rgba(15, 23, 42, 0.09)',

    '--sp-btn-radius': '3px',
    '--sp-alert-radius': '4px',
    '--sp-select-bg': '#ffffff',
    '--sp-select-border': 'rgba(15, 23, 42, 0.11)',
    '--sp-select-border-focus': '#334155',
    '--sp-select-radius': '3px',
    '--sp-checkbox-border': 'rgba(15, 23, 42, 0.16)',
    '--sp-checkbox-radius': '2px',

    '--sp-chart-title-color': '#0f172a',
    '--sp-chart-subtitle-color': '#64748b',
    '--sp-chart-axis-text': '#64748b',
    '--sp-chart-axis-line': '#e2e8f0',
    '--sp-chart-grid-line': '#eef2f7',
    '--sp-chart-value-label': '#334155',
    '--sp-chart-axis-label': '#94a3b8',
    '--sp-chart-legend-text': '#64748b',
    '--sp-chart-dot-stroke': '#f8fafc',
    '--sp-chart-tooltip-bg': '#1e293b',
    '--sp-chart-tooltip-text': '#f8fafc',
    '--sp-chart-track-bg': '#f1f5f9',
  },
};

