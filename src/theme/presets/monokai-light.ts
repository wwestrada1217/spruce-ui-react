import type { SpruceTheme } from '../types.js';

/**
 * Monokai Light preset - the Monokai accent palette on warm editor-paper surfaces.
 */
export const monokaiLightTheme: SpruceTheme = {
  name: 'monokai-light',
  displayName: 'Monokai Light',
  base: 'light',
  tokens: {
    '--sp-primary': '#c2185b',
    '--sp-primary-hover': '#ad1457',
    '--sp-primary-active': '#8e124b',
    '--sp-primary-subtle': 'rgba(194, 24, 91, 0.10)',
    '--sp-primary-text': '#ffffff',
    '--sp-border-focus': '#c2185b',

    '--sp-success': '#5f8f00',
    '--sp-success-subtle': 'rgba(95, 143, 0, 0.10)',

    '--sp-info': '#007c9d',
    '--sp-info-subtle': 'rgba(0, 124, 157, 0.10)',

    '--sp-warning': '#9a6a00',
    '--sp-warning-subtle': 'rgba(154, 106, 0, 0.11)',

    '--sp-danger': '#c75000',
    '--sp-danger-subtle': 'rgba(199, 80, 0, 0.11)',

    '--sp-surface-0': '#f8f8f2',
    '--sp-surface-25': '#f3f2e9',
    '--sp-surface-50': '#eceadf',
    '--sp-surface-100': '#e2dfd0',
    '--sp-surface-200': '#d6d1bd',
    '--sp-surface-300': '#c8c1aa',
    '--sp-surface-400': '#a9a18d',
    '--sp-surface-500': '#81796a',
    '--sp-surface-600': '#625c51',
    '--sp-surface-700': '#49443c',
    '--sp-surface-800': '#38342e',
    '--sp-surface-900': '#272822',
    '--sp-surface-950': '#1b1c18',

    '--sp-text-color': '#272822',
    '--sp-text-muted': '#4f4a41',
    '--sp-text-subtle': '#776f60',
    '--sp-text-disabled': '#a9a18d',
    '--sp-text-inverse': '#f8f8f2',

    '--sp-border': 'rgba(39, 40, 34, 0.12)',
    '--sp-border-strong': 'rgba(39, 40, 34, 0.22)',

    '--sp-content-hover-bg': 'rgba(194, 24, 91, 0.06)',
    '--sp-content-active-bg': 'rgba(194, 24, 91, 0.10)',

    '--sp-overlay-bg': 'rgba(39, 40, 34, 0.48)',

    '--sp-scrollbar-track': 'rgba(39, 40, 34, 0.04)',
    '--sp-scrollbar-thumb': '#c8c1aa',
    '--sp-scrollbar-hover': '#a9a18d',

    '--sp-chart-title-color': '#272822',
    '--sp-chart-subtitle-color': '#776f60',
    '--sp-chart-axis-text': '#776f60',
    '--sp-chart-grid-line': '#d6d1bd',
    '--sp-chart-axis-line': '#d6d1bd',
    '--sp-chart-value-label': '#4f4a41',
    '--sp-chart-legend-text': '#776f60',
    '--sp-chart-dot-stroke': '#f8f8f2',
    '--sp-chart-tooltip-bg': '#272822',
    '--sp-chart-tooltip-text': '#f8f8f2',
    '--sp-chart-track-bg': '#eceadf',
  },
};

