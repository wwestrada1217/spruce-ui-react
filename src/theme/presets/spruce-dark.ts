import type { SpruceTheme } from '../types.js';

/**
 * Spruce Dark — default dark companion to {@link spruceTheme}. Neutral charcoal
 * base surfaces (similar to Visual Studio Dark) paired with a rich evergreen
 * green primary accent that complements default Spruce green tones in dark mode.
 */
export const spruceDarkTheme: SpruceTheme = {
  name: 'spruce-dark',
  displayName: 'Spruce Dark',
  base: 'dark',
  tokens: {
    '--sp-primary': '#22c55e',
    '--sp-primary-hover': '#4ade80',
    '--sp-primary-active': '#16a34a',
    '--sp-primary-subtle': 'rgba(34, 197, 94, 0.15)',
    '--sp-primary-text': '#052e16',
    '--sp-border-focus': '#22c55e',

    '--sp-success': '#34d399',
    '--sp-success-subtle': 'rgba(52, 211, 153, 0.13)',

    '--sp-info': '#38bdf8',
    '--sp-info-subtle': 'rgba(56, 189, 248, 0.13)',

    '--sp-warning': '#fbbf24',
    '--sp-warning-subtle': 'rgba(251, 191, 36, 0.13)',

    '--sp-danger': '#f87171',
    '--sp-danger-subtle': 'rgba(248, 113, 113, 0.13)',

    '--sp-surface-0': '#1e1e1e',
    '--sp-surface-25': '#222222',
    '--sp-surface-50': '#252526',
    '--sp-surface-100': '#2d2d30',
    '--sp-surface-200': '#333333',
    '--sp-surface-300': '#3c3c3c',
    '--sp-surface-400': '#4a4a4a',
    '--sp-surface-500': '#6a6a6a',
    '--sp-surface-600': '#858585',
    '--sp-surface-700': '#a6a6a6',
    '--sp-surface-800': '#cccccc',
    '--sp-surface-900': '#e5e5e5',
    '--sp-surface-950': '#ffffff',

    '--sp-text-color': '#cccccc',
    '--sp-text-muted': '#b7b7b7',
    '--sp-text-subtle': '#858585',
    '--sp-text-disabled': '#5f5f5f',
    '--sp-text-inverse': '#1e1e1e',

    '--sp-border': 'rgba(255, 255, 255, 0.08)',
    '--sp-border-strong': 'rgba(255, 255, 255, 0.14)',

    '--sp-content-hover-bg': 'rgba(255, 255, 255, 0.05)',
    '--sp-content-active-bg': 'rgba(255, 255, 255, 0.09)',

    '--sp-overlay-bg': 'rgba(0, 0, 0, 0.70)',

    '--sp-scrollbar-track': 'rgba(255, 255, 255, 0.03)',
    '--sp-scrollbar-thumb': '#424242',
    '--sp-scrollbar-hover': '#5f5f5f',

    '--sp-focus-ring-color': 'rgba(34, 197, 94, 0.35)',
    '--sp-focus-glow-color': 'rgba(34, 197, 94, 0.16)',
    '--sp-focus-glow-spread': '3px',

    // Keep the dark preset explicit and aligned with the Corporate radius scale.
    '--sp-radius-sm': '2px',
    '--sp-radius-md': '3px',
    '--sp-radius-lg': '4px',
    '--sp-radius-xl': '6px',
    '--sp-radius-2xl': '8px',

    '--sp-shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.45)',
    '--sp-shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.52), 0 1px 2px rgba(0, 0, 0, 0.4)',
    '--sp-shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.58), 0 2px 4px -2px rgba(0, 0, 0, 0.46)',
    '--sp-shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.64), 0 4px 6px -4px rgba(0, 0, 0, 0.52)',

    '--sp-card-bg': '#252526',
    '--sp-card-bg-filled': '#2d2d30',
    '--sp-card-border': 'rgba(255, 255, 255, 0.08)',
    '--sp-card-radius': '8px',

    '--sp-input-bg': '#252526',
    '--sp-input-border': 'rgba(255, 255, 255, 0.12)',
    '--sp-input-border-focus': '#22c55e',
    '--sp-input-radius': '3px',
    '--sp-input-text': '#cccccc',

    '--sp-modal-bg': '#252526',
    '--sp-modal-radius': '8px',
    '--sp-modal-border': 'rgba(255, 255, 255, 0.10)',

    '--sp-btn-radius': '3px',
    '--sp-alert-radius': '4px',
    '--sp-select-bg': '#252526',
    '--sp-select-border': 'rgba(255, 255, 255, 0.12)',
    '--sp-select-border-focus': '#22c55e',
    '--sp-select-radius': '3px',
    '--sp-checkbox-border': 'rgba(255, 255, 255, 0.18)',
    '--sp-checkbox-radius': '2px',

    '--sp-chart-title-color': '#cccccc',
    '--sp-chart-subtitle-color': '#858585',
    '--sp-chart-axis-text': '#858585',
    '--sp-chart-axis-line': '#383838',
    '--sp-chart-grid-line': '#2d2d30',
    '--sp-chart-value-label': '#cccccc',
    '--sp-chart-axis-label': '#6a6a6a',
    '--sp-chart-legend-text': '#858585',
    '--sp-chart-dot-stroke': '#1e1e1e',
    '--sp-chart-tooltip-bg': '#252526',
    '--sp-chart-tooltip-text': '#ffffff',
    '--sp-chart-track-bg': '#2d2d30',
  },
};

