import type { SpruceTheme } from '../types.js';

/**
 * Visual Studio preset - a clean light workbench theme inspired by VS Code.
 */
export const visualStudioTheme: SpruceTheme = {
  name: 'visual-studio',
  displayName: 'Visual Studio',
  base: 'light',
  tokens: {
    /* Sky-tinted accent — softer than legacy #007acc, closer to modern VS / VS Code blues */
    '--sp-primary': '#3a9bdc',
    '--sp-primary-hover': '#2d87c6',
    '--sp-primary-active': '#2672ae',
    '--sp-primary-subtle': 'rgba(58, 155, 220, 0.10)',
    '--sp-primary-text': '#ffffff',
    '--sp-border-focus': '#3a9bdc',

    '--sp-success': '#16825d',
    '--sp-success-subtle': 'rgba(22, 130, 93, 0.10)',

    '--sp-info': '#3a9bdc',
    '--sp-info-subtle': 'rgba(58, 155, 220, 0.10)',

    '--sp-warning': '#bf8803',
    '--sp-warning-subtle': 'rgba(191, 136, 3, 0.11)',

    '--sp-danger': '#c42b1c',
    '--sp-danger-subtle': 'rgba(196, 43, 28, 0.10)',

    '--sp-surface-0': '#ffffff',
    '--sp-surface-25': '#f8f8f8',
    '--sp-surface-50': '#f3f3f3',
    '--sp-surface-100': '#eeeeee',
    '--sp-surface-200': '#e5e5e5',
    '--sp-surface-300': '#d4d4d4',
    '--sp-surface-400': '#c8c8c8',
    '--sp-surface-500': '#a0a0a0',
    '--sp-surface-600': '#7a7a7a',
    '--sp-surface-700': '#5f5f5f',
    '--sp-surface-800': '#3c3c3c',
    '--sp-surface-900': '#252526',
    '--sp-surface-950': '#1e1e1e',

    '--sp-text-color': '#1e1e1e',
    '--sp-text-muted': '#3c3c3c',
    '--sp-text-subtle': '#6a6a6a',
    '--sp-text-disabled': '#a0a0a0',
    '--sp-text-inverse': '#ffffff',

    '--sp-border': 'rgba(30, 30, 30, 0.075)',
    '--sp-border-strong': 'rgba(30, 30, 30, 0.13)',

    '--sp-content-hover-bg': 'rgba(58, 155, 220, 0.055)',
    '--sp-content-active-bg': 'rgba(58, 155, 220, 0.10)',

    '--sp-overlay-bg': 'rgba(30, 30, 30, 0.48)',

    '--sp-scrollbar-track': 'rgba(30, 30, 30, 0.04)',
    '--sp-scrollbar-thumb': '#c8c8c8',
    '--sp-scrollbar-hover': '#a0a0a0',

    '--sp-chart-title-color': '#1e1e1e',
    '--sp-chart-subtitle-color': '#6a6a6a',
    '--sp-chart-axis-text': '#6a6a6a',
    '--sp-chart-grid-line': '#ececec',
    '--sp-chart-axis-line': '#dfdfdf',
    '--sp-chart-value-label': '#3c3c3c',
    '--sp-chart-legend-text': '#6a6a6a',
    '--sp-chart-dot-stroke': '#ffffff',
    '--sp-chart-tooltip-bg': '#252526',
    '--sp-chart-tooltip-text': '#ffffff',
    '--sp-chart-track-bg': '#f3f3f3',
  },
};

