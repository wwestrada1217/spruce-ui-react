import type { SpruceTheme } from '../types.js';

/**
 * Spruce — the design system's default light theme. Quiet zinc neutrals, soft
 * dividers, and restrained elevation keep the workspace focused, while a true
 * evergreen accent anchors the brand. Sharp geometric corners support dense,
 * professional product surfaces. This mirrors the base `:root` tokens.
 */
export const spruceTheme: SpruceTheme = {
  name: 'spruce',
  displayName: 'Spruce',
  base: 'light',
  tokens: {
    '--sp-primary': '#166534',
    '--sp-primary-hover': '#14532d',
    '--sp-primary-active': '#052e16',
    '--sp-primary-subtle': 'rgba(22, 101, 52, 0.09)',
    '--sp-primary-text': '#fafafa',
    '--sp-border-focus': '#166534',

    '--sp-success': '#059669',
    '--sp-success-subtle': 'rgba(5, 150, 105, 0.09)',

    '--sp-info': '#0e7490',
    '--sp-info-subtle': 'rgba(14, 116, 144, 0.09)',

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

    '--sp-focus-ring-color': 'rgba(22, 101, 52, 0.35)',
    '--sp-focus-glow-color': 'rgba(22, 101, 52, 0.12)',
    '--sp-focus-glow-spread': '3px',

    '--sp-radius-sm': '2px',
    '--sp-radius-md': '3px',
    '--sp-radius-lg': '4px',
    '--sp-radius-xl': '6px',
    '--sp-radius-2xl': '8px',

    '--sp-shadow-xs': '0 1px 2px rgba(24, 24, 27, 0.03)',
    '--sp-shadow-sm': '0 1px 2px rgba(24, 24, 27, 0.04), 0 1px 3px rgba(24, 24, 27, 0.03)',
    '--sp-shadow-md':
      '0 4px 12px -2px rgba(24, 24, 27, 0.06), 0 2px 4px -2px rgba(24, 24, 27, 0.04)',
    '--sp-shadow-lg': '0 12px 28px -8px rgba(24, 24, 27, 0.08)',

    '--sp-card-bg': '#fafafa',
    '--sp-card-bg-filled': '#f4f4f5',
    '--sp-card-border': 'rgba(24, 24, 27, 0.06)',
    '--sp-card-radius': '8px',

    '--sp-input-bg': '#ffffff',
    '--sp-input-border': 'rgba(24, 24, 27, 0.09)',
    '--sp-input-border-focus': '#166534',
    '--sp-input-radius': '3px',
    '--sp-input-text': '#18181b',

    '--sp-modal-bg': '#fafafa',
    '--sp-modal-radius': '8px',
    '--sp-modal-border': 'rgba(24, 24, 27, 0.08)',

    '--sp-btn-radius': '3px',
    '--sp-alert-radius': '4px',
    '--sp-select-bg': '#ffffff',
    '--sp-select-border': 'rgba(24, 24, 27, 0.09)',
    '--sp-select-border-focus': '#166534',
    '--sp-select-radius': '3px',
    '--sp-checkbox-border': 'rgba(24, 24, 27, 0.14)',
    '--sp-checkbox-radius': '2px',

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

