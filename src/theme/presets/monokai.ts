import type { SpruceTheme } from '../types.js';

/**
 * Monokai preset - a high-contrast dark theme inspired by the classic editor palette.
 */
export const monokaiTheme: SpruceTheme = {
  name: 'monokai',
  displayName: 'Monokai',
  base: 'dark',
  tokens: {
    '--sp-primary': '#f92672',
    '--sp-primary-hover': '#ff4d8d',
    '--sp-primary-active': '#d81f60',
    '--sp-primary-subtle': 'rgba(249, 38, 114, 0.16)',
    '--sp-primary-text': '#21181b',
    '--sp-border-focus': '#f92672',

    '--sp-success': '#a6e22e',
    '--sp-success-subtle': 'rgba(166, 226, 46, 0.13)',

    '--sp-info': '#66d9ef',
    '--sp-info-subtle': 'rgba(102, 217, 239, 0.13)',

    '--sp-warning': '#e6db74',
    '--sp-warning-subtle': 'rgba(230, 219, 116, 0.14)',

    '--sp-danger': '#fd971f',
    '--sp-danger-subtle': 'rgba(253, 151, 31, 0.14)',

    '--sp-surface-0': '#272822',
    '--sp-surface-25': '#2d2e27',
    '--sp-surface-50': '#33342c',
    '--sp-surface-100': '#3a3b32',
    '--sp-surface-200': '#49483e',
    '--sp-surface-300': '#57564a',
    '--sp-surface-400': '#6c6b5d',
    '--sp-surface-500': '#888674',
    '--sp-surface-600': '#a6a38d',
    '--sp-surface-700': '#c8c4aa',
    '--sp-surface-800': '#e6e1c4',
    '--sp-surface-900': '#f8f8f2',
    '--sp-surface-950': '#ffffff',

    '--sp-text-color': '#f8f8f2',
    '--sp-text-muted': '#d7d2b8',
    '--sp-text-subtle': '#a59f85',
    '--sp-text-disabled': '#6c6b5d',
    '--sp-text-inverse': '#272822',

    '--sp-border': 'rgba(248, 248, 242, 0.09)',
    '--sp-border-strong': 'rgba(248, 248, 242, 0.17)',

    '--sp-content-hover-bg': 'rgba(249, 38, 114, 0.07)',
    '--sp-content-active-bg': 'rgba(249, 38, 114, 0.12)',

    '--sp-overlay-bg': 'rgba(20, 21, 18, 0.78)',

    '--sp-scrollbar-track': 'rgba(248, 248, 242, 0.04)',
    '--sp-scrollbar-thumb': 'rgba(248, 248, 242, 0.18)',
    '--sp-scrollbar-hover': 'rgba(248, 248, 242, 0.30)',

    '--sp-shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.42)',
    '--sp-shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.48), 0 1px 2px rgba(0, 0, 0, 0.36)',
    '--sp-shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.54), 0 2px 4px -2px rgba(0, 0, 0, 0.42)',
    '--sp-shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.58), 0 4px 6px -4px rgba(0, 0, 0, 0.46)',
    '--sp-shadow-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.62), 0 8px 10px -6px rgba(0, 0, 0, 0.50)',

    '--sp-chart-title-color': '#f8f8f2',
    '--sp-chart-subtitle-color': '#d7d2b8',
    '--sp-chart-axis-text': '#d7d2b8',
    '--sp-chart-grid-line': '#49483e',
    '--sp-chart-axis-line': '#49483e',
    '--sp-chart-value-label': '#f8f8f2',
    '--sp-chart-legend-text': '#d7d2b8',
    '--sp-chart-dot-stroke': '#272822',
    '--sp-chart-tooltip-bg': '#33342c',
    '--sp-chart-tooltip-text': '#f8f8f2',
    '--sp-chart-track-bg': '#33342c',
  },
};

