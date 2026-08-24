import type { SpruceTheme } from '../types.js';

/**
 * Bumblebee Dark preset - honey accents on Visual Studio-like charcoal surfaces.
 */
export const bumblebeeDarkTheme: SpruceTheme = {
  name: 'bumblebee-dark',
  displayName: 'Bumblebee Dark',
  base: 'dark',
  tokens: {
    '--sp-primary': '#f5c542',
    '--sp-primary-hover': '#ffd866',
    '--sp-primary-active': '#d9a520',
    '--sp-primary-subtle': 'rgba(245, 197, 66, 0.14)',
    '--sp-primary-text': '#1f1808',
    '--sp-border-focus': '#f5c542',

    '--sp-success': '#7bc96f',
    '--sp-success-subtle': 'rgba(123, 201, 111, 0.12)',

    '--sp-info': '#75beff',
    '--sp-info-subtle': 'rgba(117, 190, 255, 0.12)',

    '--sp-warning': '#f5c542',
    '--sp-warning-subtle': 'rgba(245, 197, 66, 0.14)',

    '--sp-danger': '#f36c6c',
    '--sp-danger-subtle': 'rgba(243, 108, 108, 0.13)',

    '--sp-surface-0': '#1e1e1e',
    '--sp-surface-25': '#222222',
    '--sp-surface-50': '#252526',
    '--sp-surface-100': '#2d2d30',
    '--sp-surface-200': '#333333',
    '--sp-surface-300': '#3c3c3c',
    '--sp-surface-400': '#4a4a4a',
    '--sp-surface-500': '#6a6253',
    '--sp-surface-600': '#8f8265',
    '--sp-surface-700': '#b8aa84',
    '--sp-surface-800': '#dccb9b',
    '--sp-surface-900': '#f1dfaa',
    '--sp-surface-950': '#fff4cf',

    '--sp-text-color': '#e8e1cf',
    '--sp-text-muted': '#c9c0a9',
    '--sp-text-subtle': '#9d927b',
    '--sp-text-disabled': '#6f6758',
    '--sp-text-inverse': '#1e1e1e',

    '--sp-border': 'rgba(232, 225, 207, 0.10)',
    '--sp-border-strong': 'rgba(245, 197, 66, 0.22)',

    '--sp-content-hover-bg': 'rgba(245, 197, 66, 0.08)',
    '--sp-content-active-bg': 'rgba(245, 197, 66, 0.14)',

    '--sp-overlay-bg': 'rgba(0, 0, 0, 0.70)',

    '--sp-scrollbar-track': 'rgba(255, 255, 255, 0.03)',
    '--sp-scrollbar-thumb': '#4a4a4a',
    '--sp-scrollbar-hover': '#6a6253',

    '--sp-focus-ring-color': 'rgba(245, 197, 66, 0.28)',
    '--sp-focus-glow-color': 'rgba(245, 197, 66, 0.18)',

    '--sp-shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.45)',
    '--sp-shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.52), 0 1px 2px rgba(0, 0, 0, 0.40)',
    '--sp-shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.58), 0 2px 4px -2px rgba(0, 0, 0, 0.46)',
    '--sp-shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.64), 0 4px 6px -4px rgba(0, 0, 0, 0.52)',
    '--sp-shadow-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.70), 0 8px 10px -6px rgba(0, 0, 0, 0.58)',

    '--sp-card-bg': '#252526',
    '--sp-card-bg-filled': '#2d2d30',
    '--sp-card-border': 'rgba(232, 225, 207, 0.10)',

    '--sp-input-bg': '#252526',
    '--sp-input-border': 'rgba(232, 225, 207, 0.14)',
    '--sp-input-border-focus': '#f5c542',
    '--sp-input-text': '#e8e1cf',

    '--sp-modal-bg': '#252526',
    '--sp-modal-border': 'rgba(232, 225, 207, 0.10)',

    '--sp-select-bg': '#252526',
    '--sp-select-border': 'rgba(232, 225, 207, 0.14)',
    '--sp-select-border-focus': '#f5c542',
    '--sp-checkbox-border': 'rgba(232, 225, 207, 0.18)',

    '--sp-chart-title-color': '#e8e1cf',
    '--sp-chart-subtitle-color': '#9d927b',
    '--sp-chart-axis-text': '#9d927b',
    '--sp-chart-grid-line': '#333333',
    '--sp-chart-axis-line': '#4a4a4a',
    '--sp-chart-value-label': '#c9c0a9',
    '--sp-chart-axis-label': '#8f8265',
    '--sp-chart-legend-text': '#c9c0a9',
    '--sp-chart-dot-stroke': '#1e1e1e',
    '--sp-chart-tooltip-bg': '#252526',
    '--sp-chart-tooltip-text': '#e8e1cf',
    '--sp-chart-track-bg': '#2d2d30',
  },
};

