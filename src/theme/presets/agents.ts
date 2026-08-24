import type { SpruceTheme } from '../types.js';

/**
 * Agents preset — minimalist light workspace with muted zinc neutrals, very soft borders,
 * and a restrained indigo accent. Inspired by contemporary agent / IDE side-panel UIs:
 * quiet chrome, low-contrast dividers, subtle elevation.
 */
export const agentsTheme: SpruceTheme = {
  name: 'agents',
  displayName: 'Agents',
  base: 'light',
  tokens: {
    '--sp-primary': '#6366f1',
    '--sp-primary-hover': '#4f46e5',
    '--sp-primary-active': '#4338ca',
    '--sp-primary-subtle': 'rgba(99, 102, 241, 0.09)',
    '--sp-primary-text': '#fafafa',
    '--sp-border-focus': '#6366f1',

    '--sp-success': '#059669',
    '--sp-success-subtle': 'rgba(5, 150, 105, 0.09)',

    '--sp-info': '#6366f1',
    '--sp-info-subtle': 'rgba(99, 102, 241, 0.09)',

    '--sp-warning': '#b45309',
    '--sp-warning-subtle': 'rgba(180, 83, 9, 0.09)',

    '--sp-danger': '#dc2626',
    '--sp-danger-subtle': 'rgba(220, 38, 38, 0.09)',

    '--sp-surface-0': '#fafafa',
    '--sp-surface-25': '#f8f8f9',
    '--sp-surface-50': '#f4f4f5',
    '--sp-surface-100': '#ececee',
    '--sp-surface-200': '#e4e4e7',
    '--sp-surface-300': '#d4d4d8',
    '--sp-surface-400': '#a1a1aa',
    '--sp-surface-500': '#71717a',
    '--sp-surface-600': '#52525b',
    '--sp-surface-700': '#3f3f46',
    '--sp-surface-800': '#27272a',
    '--sp-surface-900': '#18181b',
    '--sp-surface-950': '#09090b',

    '--sp-text-color': '#18181b',
    '--sp-text-muted': '#3f3f46',
    '--sp-text-subtle': '#71717a',
    '--sp-text-disabled': '#a1a1aa',
    '--sp-text-inverse': '#fafafa',

    '--sp-border': 'rgba(24, 24, 27, 0.055)',
    '--sp-border-strong': 'rgba(24, 24, 27, 0.10)',

    '--sp-content-hover-bg': 'rgba(24, 24, 27, 0.035)',
    '--sp-content-active-bg': 'rgba(24, 24, 27, 0.065)',

    '--sp-overlay-bg': 'rgba(24, 24, 27, 0.45)',

    '--sp-scrollbar-track': 'rgba(24, 24, 27, 0.028)',
    '--sp-scrollbar-thumb': '#d4d4d8',
    '--sp-scrollbar-hover': '#a1a1aa',

    '--sp-focus-ring-color': 'rgba(99, 102, 241, 0.35)',
    '--sp-focus-glow-color': 'rgba(99, 102, 241, 0.12)',
    '--sp-focus-glow-spread': '5px',

    '--sp-radius-sm': '4px',
    '--sp-radius-md': '6px',
    '--sp-radius-lg': '8px',
    '--sp-radius-xl': '10px',
    '--sp-radius-2xl': '14px',

    '--sp-shadow-xs': '0 1px 2px rgba(24, 24, 27, 0.03)',
    '--sp-shadow-sm': '0 1px 2px rgba(24, 24, 27, 0.04), 0 1px 3px rgba(24, 24, 27, 0.03)',
    '--sp-shadow-md':
      '0 4px 12px -2px rgba(24, 24, 27, 0.06), 0 2px 4px -2px rgba(24, 24, 27, 0.04)',
    '--sp-shadow-lg': '0 12px 28px -8px rgba(24, 24, 27, 0.08)',

    '--sp-card-bg': '#fafafa',
    '--sp-card-bg-filled': '#f4f4f5',
    '--sp-card-border': 'rgba(24, 24, 27, 0.06)',
    '--sp-card-radius': '10px',

    '--sp-input-bg': '#ffffff',
    '--sp-input-border': 'rgba(24, 24, 27, 0.09)',
    '--sp-input-border-focus': '#6366f1',
    '--sp-input-radius': '6px',
    '--sp-input-text': '#18181b',

    '--sp-modal-bg': '#fafafa',
    '--sp-modal-radius': '12px',
    '--sp-modal-border': 'rgba(24, 24, 27, 0.08)',

    '--sp-btn-radius': '6px',
    '--sp-alert-radius': '8px',
    '--sp-select-bg': '#ffffff',
    '--sp-select-border': 'rgba(24, 24, 27, 0.09)',
    '--sp-select-border-focus': '#6366f1',
    '--sp-select-radius': '6px',
    '--sp-checkbox-border': 'rgba(24, 24, 27, 0.14)',
    '--sp-checkbox-radius': '4px',

    '--sp-chart-title-color': '#18181b',
    '--sp-chart-subtitle-color': '#71717a',
    '--sp-chart-axis-text': '#71717a',
    '--sp-chart-axis-line': '#e4e4e7',
    '--sp-chart-grid-line': '#ececee',
    '--sp-chart-value-label': '#3f3f46',
    '--sp-chart-axis-label': '#71717a',
    '--sp-chart-legend-text': '#71717a',
    '--sp-chart-dot-stroke': '#fafafa',
    '--sp-chart-tooltip-bg': '#27272a',
    '--sp-chart-tooltip-text': '#fafafa',
    '--sp-chart-track-bg': '#f4f4f5',
  },
};

