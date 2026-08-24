import type { SpruceTheme } from '../types.js';

/**
 * Agents Dark — dark companion to {@link agentsTheme}: same zinc scale and indigo accent,
 * very soft borders, and quiet chrome for agent / IDE–style panels.
 */
export const agentsDarkTheme: SpruceTheme = {
  name: 'agents-dark',
  displayName: 'Agents Dark',
  base: 'dark',
  tokens: {
    '--sp-primary': '#818cf8',
    '--sp-primary-hover': '#a5b4fc',
    '--sp-primary-active': '#6366f1',
    '--sp-primary-subtle': 'rgba(129, 140, 248, 0.14)',
    '--sp-primary-text': '#0f172a',
    '--sp-border-focus': '#818cf8',

    '--sp-success': '#34d399',
    '--sp-success-subtle': 'rgba(52, 211, 153, 0.12)',

    '--sp-info': '#818cf8',
    '--sp-info-subtle': 'rgba(129, 140, 248, 0.12)',

    '--sp-warning': '#fbbf24',
    '--sp-warning-subtle': 'rgba(251, 191, 36, 0.12)',

    '--sp-danger': '#f87171',
    '--sp-danger-subtle': 'rgba(248, 113, 113, 0.12)',

    '--sp-surface-0': '#09090b',
    '--sp-surface-25': '#0c0c0e',
    '--sp-surface-50': '#111113',
    '--sp-surface-100': '#18181b',
    '--sp-surface-200': '#27272a',
    '--sp-surface-300': '#3f3f46',
    '--sp-surface-400': '#52525b',
    '--sp-surface-500': '#71717a',
    '--sp-surface-600': '#a1a1aa',
    '--sp-surface-700': '#d4d4d8',
    '--sp-surface-800': '#e4e4e7',
    '--sp-surface-900': '#f4f4f5',
    '--sp-surface-950': '#fafafa',

    '--sp-text-color': '#e4e4e7',
    '--sp-text-muted': '#d4d4d8',
    '--sp-text-subtle': '#a1a1aa',
    '--sp-text-disabled': '#71717a',
    '--sp-text-inverse': '#09090b',

    '--sp-border': 'rgba(244, 244, 245, 0.07)',
    '--sp-border-strong': 'rgba(244, 244, 245, 0.12)',

    '--sp-content-hover-bg': 'rgba(244, 244, 245, 0.05)',
    '--sp-content-active-bg': 'rgba(244, 244, 245, 0.09)',

    '--sp-overlay-bg': 'rgba(9, 9, 11, 0.72)',

    '--sp-scrollbar-track': 'rgba(244, 244, 245, 0.04)',
    '--sp-scrollbar-thumb': '#3f3f46',
    '--sp-scrollbar-hover': '#52525b',

    '--sp-focus-ring-color': 'rgba(129, 140, 248, 0.32)',
    '--sp-focus-glow-color': 'rgba(129, 140, 248, 0.16)',
    '--sp-focus-glow-spread': '5px',

    '--sp-radius-sm': '4px',
    '--sp-radius-md': '6px',
    '--sp-radius-lg': '8px',
    '--sp-radius-xl': '10px',
    '--sp-radius-2xl': '14px',

    '--sp-shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.28)',
    '--sp-shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.34), 0 1px 3px rgba(0, 0, 0, 0.24)',
    '--sp-shadow-md': '0 4px 12px -2px rgba(0, 0, 0, 0.36), 0 2px 4px -2px rgba(0, 0, 0, 0.26)',
    '--sp-shadow-lg': '0 12px 28px -8px rgba(0, 0, 0, 0.42)',

    '--sp-card-bg': '#121215',
    '--sp-card-bg-filled': '#18181b',
    '--sp-card-border': 'rgba(244, 244, 245, 0.08)',
    '--sp-card-radius': '10px',

    '--sp-input-bg': '#121215',
    '--sp-input-border': 'rgba(244, 244, 245, 0.11)',
    '--sp-input-border-focus': '#818cf8',
    '--sp-input-radius': '6px',
    '--sp-input-text': '#e4e4e7',

    '--sp-modal-bg': '#121215',
    '--sp-modal-radius': '12px',
    '--sp-modal-border': 'rgba(244, 244, 245, 0.1)',

    '--sp-btn-radius': '6px',
    '--sp-alert-radius': '8px',
    '--sp-select-bg': '#121215',
    '--sp-select-border': 'rgba(244, 244, 245, 0.11)',
    '--sp-select-border-focus': '#818cf8',
    '--sp-select-radius': '6px',
    '--sp-checkbox-border': 'rgba(244, 244, 245, 0.16)',
    '--sp-checkbox-radius': '4px',

    '--sp-chart-title-color': '#e4e4e7',
    '--sp-chart-subtitle-color': '#a1a1aa',
    '--sp-chart-axis-text': '#a1a1aa',
    '--sp-chart-axis-line': '#3f3f46',
    '--sp-chart-grid-line': '#27272a',
    '--sp-chart-value-label': '#d4d4d8',
    '--sp-chart-axis-label': '#71717a',
    '--sp-chart-legend-text': '#a1a1aa',
    '--sp-chart-dot-stroke': '#09090b',
    '--sp-chart-tooltip-bg': '#27272a',
    '--sp-chart-tooltip-text': '#fafafa',
    '--sp-chart-track-bg': '#18181b',
  },
};

