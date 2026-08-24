import type { SpruceTheme } from '../types.js';

/**
 * Modern preset — a clean, neutral light theme with cool blue accents,
 * soft elevations, and restrained radii for a contemporary UI feel.
 */
export const modernTheme: SpruceTheme = {
  name: 'modern',
  displayName: 'Modern',
  base: 'light',
  tokens: {
    '--sp-primary': '#2563eb',
    '--sp-primary-hover': '#1d4ed8',
    '--sp-primary-active': '#1e40af',
    '--sp-primary-subtle': 'rgba(37, 99, 235, 0.08)',
    '--sp-primary-text': '#ffffff',
    '--sp-border-focus': '#2563eb',

    '--sp-success': '#16a34a',
    '--sp-success-subtle': 'rgba(22, 163, 74, 0.1)',

    '--sp-info': '#0ea5e9',
    '--sp-info-subtle': 'rgba(14, 165, 233, 0.1)',

    '--sp-warning': '#d97706',
    '--sp-warning-subtle': 'rgba(217, 119, 6, 0.1)',

    '--sp-danger': '#dc2626',
    '--sp-danger-subtle': 'rgba(220, 38, 38, 0.1)',

    // ── Companion accent roles ──────────────────────────────────────────────
    // Generated from the brand hue above with the analogous scheme
    // (buildHarmonyPalette('#2563eb', 'analogous')) and kept as literals so the
    // theme stays a plain token map. Modern already leaned analogous by hand —
    // its info blue sits a step off the primary — so this formalizes the
    // relationship rather than changing the theme's character. Every value
    // below clears AA as text on white; regenerate with the same call if the
    // brand hue changes.
    '--sp-secondary': '#007aa7',
    '--sp-secondary-hover': '#00688e',
    '--sp-secondary-active': '#005677',
    '--sp-secondary-subtle': 'rgba(0, 122, 167, 0.1)',
    '--sp-secondary-text': '#ffffff',
    '--sp-tertiary': '#7a49df',
    '--sp-tertiary-hover': '#6a34cb',
    '--sp-tertiary-active': '#5a1bb6',
    '--sp-tertiary-subtle': 'rgba(122, 73, 223, 0.1)',
    '--sp-tertiary-text': '#ffffff',

    // Categorical ramp for charts using palette: 'harmony'.
    '--sp-chart-series-1': '#2563eb',
    '--sp-chart-series-2': '#007aa7',
    '--sp-chart-series-3': '#7a49df',
    '--sp-chart-series-4': '#008088',
    '--sp-chart-series-5': '#184bbc',
    '--sp-chart-series-6': '#005f83',
    '--sp-chart-series-7': '#5f36b2',
    '--sp-chart-series-8': '#00636a',

    '--sp-surface-0': '#ffffff',
    '--sp-surface-25': '#fcfdff',
    '--sp-surface-50': '#f8fafc',
    '--sp-surface-100': '#eef2f7',
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

    '--sp-border': 'rgba(15, 23, 42, 0.10)',
    '--sp-border-strong': 'rgba(15, 23, 42, 0.18)',

    '--sp-content-hover-bg': 'rgba(15, 23, 42, 0.04)',
    '--sp-content-active-bg': 'rgba(15, 23, 42, 0.08)',

    '--sp-overlay-bg': 'rgba(15, 23, 42, 0.56)',

    '--sp-scrollbar-track': 'rgba(15, 23, 42, 0.03)',
    '--sp-scrollbar-thumb': '#cbd5e1',
    '--sp-scrollbar-hover': '#94a3b8',

    '--sp-focus-ring-color': 'rgba(37, 99, 235, 0.22)',
    '--sp-focus-glow-color': 'rgba(37, 99, 235, 0.18)',
    '--sp-focus-glow-spread': '6px',

    '--sp-radius-sm': '3px',
    '--sp-radius-md': '5px',
    '--sp-radius-lg': '7px',
    '--sp-radius-xl': '9px',
    '--sp-radius-2xl': '12px',

    '--sp-shadow-xs': '0 1px 2px rgba(15, 23, 42, 0.04)',
    '--sp-shadow-sm': '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
    '--sp-shadow-md':
      '0 4px 8px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
    '--sp-shadow-lg': '0 12px 24px -8px rgba(15, 23, 42, 0.14)',

    '--sp-card-bg': '#ffffff',
    '--sp-card-bg-filled': '#f8fafc',
    '--sp-card-border': 'rgba(15, 23, 42, 0.08)',
    '--sp-card-radius': '8px',

    '--sp-input-bg': '#ffffff',
    '--sp-input-border': 'rgba(15, 23, 42, 0.12)',
    '--sp-input-border-focus': '#2563eb',
    '--sp-input-radius': '6px',
    '--sp-input-text': '#0f172a',

    '--sp-modal-bg': '#ffffff',
    '--sp-modal-radius': '10px',
    '--sp-modal-border': 'rgba(15, 23, 42, 0.08)',

    '--sp-btn-radius': '6px',
    '--sp-alert-radius': '8px',
    '--sp-select-bg': '#ffffff',
    '--sp-select-border': 'rgba(15, 23, 42, 0.12)',
    '--sp-select-border-focus': '#2563eb',
    '--sp-select-radius': '6px',
    '--sp-checkbox-border': 'rgba(15, 23, 42, 0.16)',
    '--sp-checkbox-radius': '3px',

    '--sp-chart-title-color': '#0f172a',
    '--sp-chart-subtitle-color': '#64748b',
    '--sp-chart-axis-text': '#64748b',
    '--sp-chart-axis-line': '#e2e8f0',
    '--sp-chart-grid-line': '#eef2f7',
    '--sp-chart-value-label': '#334155',
    '--sp-chart-axis-label': '#334155',
    '--sp-chart-legend-text': '#64748b',
    '--sp-chart-dot-stroke': '#ffffff',
    '--sp-chart-tooltip-bg': '#0f172a',
    '--sp-chart-tooltip-text': '#f8fafc',
    '--sp-chart-track-bg': '#f8fafc',
  },
};

