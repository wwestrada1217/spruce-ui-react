import type { SpruceTheme } from '../types.js';

/**
 * Material Design preset — inspired by Google Material 3 (Material You).
 *
 * Distinguishing traits:
 * - Signature purple-indigo primary (#6750a4) with warm tonal surfaces
 * - Soft rounded geometry (20px pill buttons, 12px cards, 28px dialogs)
 * - Layered Material elevation shadows
 * - Roboto-led typography stack
 */
export const materialTheme: SpruceTheme = {
  name: 'material',
  displayName: 'Material',
  base: 'light',
  tokens: {
    // ── Primary Brand (M3 Purple/Indigo) ──────────────────────────────────
    '--sp-primary': '#6750a4',
    '--sp-primary-hover': '#583f99',
    '--sp-primary-active': '#4f378b',
    '--sp-primary-subtle': 'rgba(103, 80, 164, 0.12)',
    '--sp-primary-text': '#ffffff',
    '--sp-border-focus': '#6750a4',

    // ── Semantic Status (Material Tonal) ───────────────────────────────────
    '--sp-success': '#386a20',
    '--sp-success-subtle': 'rgba(56, 106, 32, 0.12)',

    '--sp-info': '#00639b',
    '--sp-info-subtle': 'rgba(0, 99, 155, 0.12)',

    '--sp-warning': '#b26a00',
    '--sp-warning-subtle': 'rgba(178, 106, 0, 0.12)',

    '--sp-danger': '#ba1a1a',
    '--sp-danger-subtle': 'rgba(186, 26, 26, 0.12)',

    // ── Surface Scale (M3 Tonal Surfaces) ──────────────────────────────────
    '--sp-surface-0': '#ffffff',
    '--sp-surface-25': '#fdf8fd',
    '--sp-surface-50': '#f7f2fa',
    '--sp-surface-100': '#f3edf7',
    '--sp-surface-200': '#ece6f0',
    '--sp-surface-300': '#e6e0e9',
    '--sp-surface-400': '#cac4d0',
    '--sp-surface-500': '#938f99',
    '--sp-surface-600': '#79747e',
    '--sp-surface-700': '#49454f',
    '--sp-surface-800': '#313033',
    '--sp-surface-900': '#1d1b20',
    '--sp-surface-950': '#141218',

    // ── Text ──────────────────────────────────────────────────────────────
    '--sp-text-color': '#1d1b20',
    '--sp-text-muted': '#49454f',
    '--sp-text-subtle': '#79747e',
    '--sp-text-disabled': '#a4a0a9',
    '--sp-text-inverse': '#f4eff4',

    // ── Typography ─────────────────────────────────────────────────────────
    '--sp-font-sans':
      'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    '--sp-font-family':
      'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',

    // ── Borders ───────────────────────────────────────────────────────────
    '--sp-border': 'rgba(121, 116, 126, 0.20)',
    '--sp-border-strong': 'rgba(121, 116, 126, 0.38)',

    // ── Interactive States ────────────────────────────────────────────────
    '--sp-content-hover-bg': 'rgba(103, 80, 164, 0.08)',
    '--sp-content-active-bg': 'rgba(103, 80, 164, 0.12)',

    // ── Overlay & Scrollbar ───────────────────────────────────────────────
    '--sp-overlay-bg': 'rgba(0, 0, 0, 0.40)',
    '--sp-scrollbar-track': 'rgba(0, 0, 0, 0.04)',
    '--sp-scrollbar-thumb': '#cac4d0',
    '--sp-scrollbar-hover': '#938f99',

    // ── Radius (Material 3 Shapes) ─────────────────────────────────────────
    '--sp-radius-sm': '4px',
    '--sp-radius-md': '8px',
    '--sp-radius-lg': '12px',
    '--sp-radius-xl': '16px',
    '--sp-radius-2xl': '28px',

    // ── Shadows (Material Elevation) ──────────────────────────────────────
    '--sp-shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.12)',
    '--sp-shadow-sm': '0 1px 3px 1px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30)',
    '--sp-shadow-md': '0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30)',
    '--sp-shadow-lg': '0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.30)',
    '--sp-shadow-xl': '0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px 0 rgba(0, 0, 0, 0.30)',

    // ── Component Overrides ───────────────────────────────────────────────
    '--sp-btn-radius': '20px',
    '--sp-card-radius': '12px',
    '--sp-card-bg': '#ffffff',
    '--sp-card-bg-filled': '#f3edf7',
    '--sp-card-border': 'rgba(121, 116, 126, 0.20)',
    '--sp-input-radius': '8px',
    '--sp-modal-radius': '28px',
    '--sp-alert-radius': '12px',
    '--sp-select-radius': '8px',
    '--sp-checkbox-radius': '4px',

    // ── Charts ────────────────────────────────────────────────────────────
    '--sp-chart-title-color': '#1d1b20',
    '--sp-chart-subtitle-color': '#49454f',
    '--sp-chart-axis-text': '#79747e',
    '--sp-chart-grid-line': '#e6e0e9',
    '--sp-chart-axis-line': '#cac4d0',
    '--sp-chart-value-label': '#49454f',
    '--sp-chart-legend-text': '#49454f',
    '--sp-chart-dot-stroke': '#ffffff',
    '--sp-chart-tooltip-bg': '#313033',
    '--sp-chart-tooltip-text': '#f4eff4',
    '--sp-chart-track-bg': '#f7f2fa',
  },
};

