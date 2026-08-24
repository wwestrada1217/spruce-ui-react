import type { SpruceTheme } from '../types.js';

/**
 * Visual Studio Dark preset - a VS Code-like dark workbench palette.
 */
export const visualStudioDarkTheme: SpruceTheme = {
  name: 'visual-studio-dark',
  displayName: 'Visual Studio Dark',
  base: 'dark',
  tokens: {
    /* Brighter sky-blue on dark surfaces — less saturated navy, more airy cyan-sky */
    '--sp-primary': '#5cb3f0',
    '--sp-primary-hover': '#6dbef7',
    '--sp-primary-active': '#4999d9',
    '--sp-primary-subtle': 'rgba(92, 179, 240, 0.18)',
    '--sp-primary-text': '#ffffff',
    '--sp-border-focus': '#5cb3f0',

    '--sp-success': '#89d185',
    '--sp-success-subtle': 'rgba(137, 209, 133, 0.12)',

    '--sp-info': '#6eb8f8',
    '--sp-info-subtle': 'rgba(110, 184, 248, 0.12)',

    '--sp-warning': '#cca700',
    '--sp-warning-subtle': 'rgba(204, 167, 0, 0.13)',

    '--sp-danger': '#f14c4c',
    '--sp-danger-subtle': 'rgba(241, 76, 76, 0.13)',

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

    '--sp-border': 'rgba(255, 255, 255, 0.068)',
    '--sp-border-strong': 'rgba(255, 255, 255, 0.118)',

    '--sp-content-hover-bg': 'rgba(92, 179, 240, 0.085)',
    '--sp-content-active-bg': 'rgba(92, 179, 240, 0.14)',

    '--sp-overlay-bg': 'rgba(0, 0, 0, 0.70)',

    '--sp-scrollbar-track': 'rgba(255, 255, 255, 0.03)',
    '--sp-scrollbar-thumb': '#424242',
    '--sp-scrollbar-hover': '#5f5f5f',

    '--sp-shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.45)',
    '--sp-shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.52), 0 1px 2px rgba(0, 0, 0, 0.40)',
    '--sp-shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.58), 0 2px 4px -2px rgba(0, 0, 0, 0.46)',
    '--sp-shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.64), 0 4px 6px -4px rgba(0, 0, 0, 0.52)',
    '--sp-shadow-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.70), 0 8px 10px -6px rgba(0, 0, 0, 0.58)',

    '--sp-chart-title-color': '#cccccc',
    '--sp-chart-subtitle-color': '#858585',
    '--sp-chart-axis-text': '#858585',
    '--sp-chart-grid-line': '#2f2f2f',
    '--sp-chart-axis-line': '#383838',
    '--sp-chart-value-label': '#cccccc',
    '--sp-chart-legend-text': '#b7b7b7',
    '--sp-chart-dot-stroke': '#1e1e1e',
    '--sp-chart-tooltip-bg': '#252526',
    '--sp-chart-tooltip-text': '#cccccc',
    '--sp-chart-track-bg': '#252526',
  },
};

