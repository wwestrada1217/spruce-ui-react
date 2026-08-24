import type { SpruceTheme } from '../types.js';

/**
 * Modern Dark preset — a neutral slate dark companion to the Modern light theme,
 * with the same restrained radius scale and clean blue accents.
 */
export const modernDarkTheme: SpruceTheme = {
  name: 'modern-dark',
  displayName: 'Modern Dark',
  base: 'dark',
  tokens: {
    '--sp-primary': '#60a5fa',
    '--sp-primary-hover': '#93c5fd',
    '--sp-primary-active': '#3b82f6',
    '--sp-primary-subtle': 'rgba(96, 165, 250, 0.14)',
    '--sp-primary-text': '#0f172a',
    '--sp-border-focus': '#60a5fa',

    '--sp-success': '#4ade80',
    '--sp-success-subtle': 'rgba(74, 222, 128, 0.12)',

    '--sp-info': '#38bdf8',
    '--sp-info-subtle': 'rgba(56, 189, 248, 0.12)',

    '--sp-warning': '#fbbf24',
    '--sp-warning-subtle': 'rgba(251, 191, 36, 0.12)',

    '--sp-danger': '#f87171',
    '--sp-danger-subtle': 'rgba(248, 113, 113, 0.12)',

    // ── Companion accent roles ──────────────────────────────────────────────
    // buildHarmonyPalette('#60a5fa', 'analogous').dark — derived from this
    // theme's own brighter primary so the companions sit in the same register,
    // and validated against a dark surface rather than a light one.
    '--sp-secondary': '#3cc9f6',
    '--sp-secondary-hover': '#75daff',
    '--sp-secondary-active': '#afe8ff',
    '--sp-secondary-subtle': 'rgba(60, 201, 246, 0.14)',
    '--sp-secondary-text': '#0f172a',
    '--sp-tertiary': '#afadff',
    '--sp-tertiary-hover': '#c4c4ff',
    '--sp-tertiary-active': '#dadaff',
    '--sp-tertiary-subtle': 'rgba(175, 173, 255, 0.14)',
    '--sp-tertiary-text': '#0f172a',

    '--sp-chart-series-1': '#377bcd',
    '--sp-chart-series-2': '#0087ab',
    '--sp-chart-series-3': '#736bcb',
    '--sp-chart-series-4': '#008c8c',
    '--sp-chart-series-5': '#5e98df',
    '--sp-chart-series-6': '#14a4ce',
    '--sp-chart-series-7': '#8d89de',
    '--sp-chart-series-8': '#00abaa',

    '--sp-surface-0': '#0f172a',
    '--sp-surface-25': '#111c30',
    '--sp-surface-50': '#162033',
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
    '--sp-content-active-bg': 'rgba(226, 232, 240, 0.08)',

    '--sp-overlay-bg': 'rgba(2, 6, 23, 0.72)',

    '--sp-scrollbar-track': 'rgba(226, 232, 240, 0.04)',
    '--sp-scrollbar-thumb': '#334155',
    '--sp-scrollbar-hover': '#475569',

    '--sp-focus-ring-color': 'rgba(96, 165, 250, 0.28)',
    '--sp-focus-glow-color': 'rgba(96, 165, 250, 0.18)',
    '--sp-focus-glow-spread': '6px',

    '--sp-radius-sm': '3px',
    '--sp-radius-md': '5px',
    '--sp-radius-lg': '7px',
    '--sp-radius-xl': '9px',
    '--sp-radius-2xl': '12px',

    '--sp-shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.24)',
    '--sp-shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.30), 0 1px 2px rgba(0, 0, 0, 0.22)',
    '--sp-shadow-md': '0 4px 8px -2px rgba(0, 0, 0, 0.36), 0 2px 4px -2px rgba(0, 0, 0, 0.26)',
    '--sp-shadow-lg': '0 12px 24px -8px rgba(0, 0, 0, 0.46)',

    '--sp-card-bg': '#111827',
    '--sp-card-bg-filled': '#162033',
    '--sp-card-border': 'rgba(226, 232, 240, 0.08)',
    '--sp-card-radius': '8px',

    '--sp-input-bg': '#111827',
    '--sp-input-border': 'rgba(226, 232, 240, 0.12)',
    '--sp-input-border-focus': '#60a5fa',
    '--sp-input-radius': '6px',
    '--sp-input-text': '#e2e8f0',

    '--sp-modal-bg': '#111827',
    '--sp-modal-radius': '10px',
    '--sp-modal-border': 'rgba(226, 232, 240, 0.08)',

    '--sp-btn-radius': '6px',
    '--sp-alert-radius': '8px',
    '--sp-select-bg': '#111827',
    '--sp-select-border': 'rgba(226, 232, 240, 0.12)',
    '--sp-select-border-focus': '#60a5fa',
    '--sp-select-radius': '6px',
    '--sp-checkbox-border': 'rgba(226, 232, 240, 0.16)',
    '--sp-checkbox-radius': '3px',

    '--sp-chart-title-color': '#e2e8f0',
    '--sp-chart-subtitle-color': '#94a3b8',
    '--sp-chart-axis-text': '#94a3b8',
    '--sp-chart-axis-line': '#334155',
    '--sp-chart-grid-line': '#273449',
    '--sp-chart-value-label': '#cbd5e1',
    '--sp-chart-axis-label': '#64748b',
    '--sp-chart-legend-text': '#94a3b8',
    '--sp-chart-dot-stroke': '#0f172a',
    '--sp-chart-tooltip-bg': '#111827',
    '--sp-chart-tooltip-text': '#e2e8f0',
    '--sp-chart-track-bg': '#162033',
  },
};

