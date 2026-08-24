import type { SpruceTheme } from '../types.js';

/**
 * Material Design Dark preset — inspired by Google Material 3 Dark Theme.
 *
 * Distinguishing traits:
 * - Luminous lavender primary (#d0bcff) on deep tonal slate/charcoal surfaces
 * - Layered Material dark elevation shadows
 * - Soft rounded geometry (20px pill buttons, 12px cards, 28px dialogs)
 * - Roboto-led typography stack
 */
export const materialDarkTheme: SpruceTheme = {
  name: 'material-dark',
  displayName: 'Material Dark',
  base: 'dark',
  tokens: {
    // ── Primary Brand (M3 Lavender Dark) ──────────────────────────────────
    '--sp-primary': '#d0bcff',
    '--sp-primary-hover': '#e8deff',
    '--sp-primary-active': '#b69df8',
    '--sp-primary-subtle': 'rgba(208, 188, 255, 0.16)',
    '--sp-primary-text': '#381e72',
    '--sp-border-focus': '#d0bcff',

    // ── Semantic Status (Material Dark Tonal) ──────────────────────────────
    '--sp-success': '#a1f47d',
    '--sp-success-subtle': 'rgba(161, 244, 125, 0.16)',

    '--sp-info': '#92ccff',
    '--sp-info-subtle': 'rgba(146, 204, 255, 0.16)',

    '--sp-warning': '#ffb870',
    '--sp-warning-subtle': 'rgba(255, 184, 112, 0.16)',

    '--sp-danger': '#ffb4ab',
    '--sp-danger-subtle': 'rgba(255, 180, 171, 0.16)',

    // ── Surface Scale (M3 Dark Tonal Surfaces) ─────────────────────────────
    '--sp-surface-0': '#141218',
    '--sp-surface-25': '#1d1b20',
    '--sp-surface-50': '#211f26',
    '--sp-surface-100': '#2b2930',
    '--sp-surface-200': '#36343b',
    '--sp-surface-300': '#48464c',
    '--sp-surface-400': '#79747e',
    '--sp-surface-500': '#938f99',
    '--sp-surface-600': '#cac4d0',
    '--sp-surface-700': '#e6e0e9',
    '--sp-surface-800': '#ece6f0',
    '--sp-surface-900': '#f3edf7',
    '--sp-surface-950': '#fef7ff',

    // ── Text ──────────────────────────────────────────────────────────────
    '--sp-text-color': '#e6e0e9',
    '--sp-text-muted': '#cac4d0',
    '--sp-text-subtle': '#938f99',
    '--sp-text-disabled': '#635f68',
    '--sp-text-inverse': '#1d1b20',

    // ── Typography ─────────────────────────────────────────────────────────
    '--sp-font-sans':
      'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    '--sp-font-family':
      'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',

    // ── Borders ───────────────────────────────────────────────────────────
    '--sp-border': 'rgba(147, 143, 153, 0.22)',
    '--sp-border-strong': 'rgba(147, 143, 153, 0.38)',

    // ── Interactive States ────────────────────────────────────────────────
    '--sp-content-hover-bg': 'rgba(208, 188, 255, 0.08)',
    '--sp-content-active-bg': 'rgba(208, 188, 255, 0.14)',

    // ── Overlay & Scrollbar ───────────────────────────────────────────────
    '--sp-overlay-bg': 'rgba(0, 0, 0, 0.65)',
    '--sp-scrollbar-track': 'rgba(255, 255, 255, 0.03)',
    '--sp-scrollbar-thumb': '#48464c',
    '--sp-scrollbar-hover': '#79747e',

    // ── Radius (Material 3 Shapes) ─────────────────────────────────────────
    '--sp-radius-sm': '4px',
    '--sp-radius-md': '8px',
    '--sp-radius-lg': '12px',
    '--sp-radius-xl': '16px',
    '--sp-radius-2xl': '28px',

    // ── Shadows (Material Dark Elevation) ─────────────────────────────────
    '--sp-shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.45)',
    '--sp-shadow-sm': '0 1px 3px 1px rgba(0, 0, 0, 0.45), 0 1px 2px 0 rgba(0, 0, 0, 0.60)',
    '--sp-shadow-md': '0 2px 6px 2px rgba(0, 0, 0, 0.45), 0 1px 2px 0 rgba(0, 0, 0, 0.60)',
    '--sp-shadow-lg': '0 4px 8px 3px rgba(0, 0, 0, 0.45), 0 1px 3px 0 rgba(0, 0, 0, 0.60)',
    '--sp-shadow-xl': '0 8px 12px 6px rgba(0, 0, 0, 0.45), 0 4px 4px 0 rgba(0, 0, 0, 0.60)',

    // ── Component Overrides ───────────────────────────────────────────────
    '--sp-btn-radius': '20px',
    '--sp-card-radius': '12px',
    '--sp-card-bg': '#1d1b20',
    '--sp-card-bg-filled': '#2b2930',
    '--sp-card-border': 'rgba(147, 143, 153, 0.22)',
    '--sp-input-radius': '8px',
    '--sp-modal-radius': '28px',
    '--sp-alert-radius': '12px',
    '--sp-select-radius': '8px',
    '--sp-checkbox-radius': '4px',

    // ── Charts ────────────────────────────────────────────────────────────
    '--sp-chart-title-color': '#e6e0e9',
    '--sp-chart-subtitle-color': '#cac4d0',
    '--sp-chart-axis-text': '#938f99',
    '--sp-chart-grid-line': '#36343b',
    '--sp-chart-axis-line': '#48464c',
    '--sp-chart-value-label': '#cac4d0',
    '--sp-chart-legend-text': '#cac4d0',
    '--sp-chart-dot-stroke': '#141218',
    '--sp-chart-tooltip-bg': '#e6e0e9',
    '--sp-chart-tooltip-text': '#1d1b20',
    '--sp-chart-track-bg': '#211f26',
  },
};

