import type { SpruceTheme } from '../types.js';

/**
 * Bumblebee preset - warm honey surfaces with confident charcoal contrast.
 */
export const bumblebeeTheme: SpruceTheme = {
  name: 'bumblebee',
  displayName: 'Bumblebee',
  base: 'light',
  tokens: {
    '--sp-primary': '#d99a00',
    '--sp-primary-hover': '#c18400',
    '--sp-primary-active': '#9f6a00',
    '--sp-primary-subtle': 'rgba(217, 154, 0, 0.12)',
    '--sp-primary-text': '#1f1808',
    '--sp-border-focus': '#d99a00',

    '--sp-success': '#2f855a',
    '--sp-success-subtle': 'rgba(47, 133, 90, 0.10)',

    '--sp-info': '#0f6f8f',
    '--sp-info-subtle': 'rgba(15, 111, 143, 0.10)',

    '--sp-warning': '#b7791f',
    '--sp-warning-subtle': 'rgba(183, 121, 31, 0.12)',

    '--sp-danger': '#c53030',
    '--sp-danger-subtle': 'rgba(197, 48, 48, 0.10)',

    '--sp-surface-0': '#fffdf7',
    '--sp-surface-25': '#fff9ea',
    '--sp-surface-50': '#fff3ce',
    '--sp-surface-100': '#ffe8a3',
    '--sp-surface-200': '#f4d16a',
    '--sp-surface-300': '#d9b24a',
    '--sp-surface-400': '#a9872f',
    '--sp-surface-500': '#765f29',
    '--sp-surface-600': '#5b4a27',
    '--sp-surface-700': '#403522',
    '--sp-surface-800': '#2b251b',
    '--sp-surface-900': '#1f1a12',
    '--sp-surface-950': '#15110a',

    '--sp-text-color': '#1f1a12',
    '--sp-text-muted': '#4a3a18',
    '--sp-text-subtle': '#7a6125',
    '--sp-text-disabled': '#b59a58',
    '--sp-text-inverse': '#fffdf7',

    '--sp-border': 'rgba(31, 26, 18, 0.12)',
    '--sp-border-strong': 'rgba(31, 26, 18, 0.24)',

    '--sp-content-hover-bg': 'rgba(217, 154, 0, 0.08)',
    '--sp-content-active-bg': 'rgba(217, 154, 0, 0.14)',

    '--sp-overlay-bg': 'rgba(31, 26, 18, 0.46)',

    '--sp-scrollbar-track': 'rgba(31, 26, 18, 0.04)',
    '--sp-scrollbar-thumb': '#d9b24a',
    '--sp-scrollbar-hover': '#a9872f',

    '--sp-focus-ring-color': 'rgba(217, 154, 0, 0.28)',
    '--sp-focus-glow-color': 'rgba(217, 154, 0, 0.18)',

    '--sp-card-bg': '#fffdf7',
    '--sp-card-bg-filled': '#fff9ea',
    '--sp-card-border': 'rgba(31, 26, 18, 0.12)',

    '--sp-input-bg': '#fffdf7',
    '--sp-input-border': 'rgba(31, 26, 18, 0.16)',
    '--sp-input-border-focus': '#d99a00',
    '--sp-input-text': '#1f1a12',

    '--sp-select-bg': '#fffdf7',
    '--sp-select-border': 'rgba(31, 26, 18, 0.16)',
    '--sp-select-border-focus': '#d99a00',

    '--sp-chart-title-color': '#1f1a12',
    '--sp-chart-subtitle-color': '#7a6125',
    '--sp-chart-axis-text': '#7a6125',
    '--sp-chart-grid-line': '#f4d16a',
    '--sp-chart-axis-line': '#d9b24a',
    '--sp-chart-value-label': '#4a3a18',
    '--sp-chart-legend-text': '#7a6125',
    '--sp-chart-dot-stroke': '#fffdf7',
    '--sp-chart-tooltip-bg': '#1f1a12',
    '--sp-chart-tooltip-text': '#fffdf7',
    '--sp-chart-track-bg': '#fff3ce',
  },
};

