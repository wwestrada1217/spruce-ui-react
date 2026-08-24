import type { SpruceTheme } from '../types.js';

/**
 * Comic Dark — the night panel. Same construction as {@link comicTheme}: thick
 * outlines, hard offset shadows, chunky geometry, flat saturated accents. The
 * roles invert — outlines become newsprint cream on a blue-black page, and the
 * offset shadows drop to near-black so a cut-out still separates from the
 * surface it sits on.
 */
export const comicDarkTheme: SpruceTheme = {
  name: 'comic-dark',
  displayName: 'Comic Dark',
  base: 'dark',
  tokens: {
    // ── Brand & status ──────────────────────────────────────────────────────
    '--sp-primary': '#5b8dff',
    '--sp-primary-hover': '#79a2ff',
    '--sp-primary-active': '#3f76f0',
    '--sp-primary-subtle': 'rgba(91, 141, 255, 0.22)',
    '--sp-primary-text': '#0c1020',

    '--sp-success': '#7ede3c',
    '--sp-success-subtle': 'rgba(126, 222, 60, 0.2)',

    '--sp-warning': '#ffc247',
    '--sp-warning-subtle': 'rgba(255, 194, 71, 0.2)',

    '--sp-danger': '#ff8098',
    '--sp-danger-subtle': 'rgba(255, 128, 152, 0.2)',

    '--sp-info': '#4ecfe8',
    '--sp-info-subtle': 'rgba(78, 207, 232, 0.2)',

    // ── Blue-black panel stock ──────────────────────────────────────────────
    '--sp-surface-0': '#1b2130',
    '--sp-surface-25': '#1f2536',
    '--sp-surface-50': '#242b3d',
    '--sp-surface-100': '#2c3547',
    '--sp-surface-200': '#374158',
    '--sp-surface-300': '#46536e',
    '--sp-surface-400': '#61708f',
    '--sp-surface-500': '#8494b3',
    '--sp-surface-600': '#a7b4cd',
    '--sp-surface-700': '#c5cfe1',
    '--sp-surface-800': '#dde4ef',
    '--sp-surface-900': '#eef2f8',
    '--sp-surface-950': '#ffffff',

    // ── Newsprint type ──────────────────────────────────────────────────────
    '--sp-text-color': '#f4ecd8',
    '--sp-text-muted': '#c9d1e0',
    '--sp-text-subtle': '#9aa5bb',
    '--sp-text-disabled': '#5f6b82',
    '--sp-text-inverse': '#12151f',

    // Rounded faces if the platform has one, otherwise the bundled Noto Sans
    // carries the theme on weight alone — no third-party font is added.
    '--sp-font-sans':
      'SF Pro Rounded, Nunito, Quicksand, Trebuchet MS, Noto Sans, system-ui, sans-serif',
    '--sp-font-medium': '600',
    '--sp-font-semibold': '700',
    '--sp-font-bold': '800',

    // ── Outlines — cream instead of ink ─────────────────────────────────────
    '--sp-border-width-hairline': '2px',
    '--sp-border-width-medium': '3px',
    '--sp-border': 'rgba(244, 236, 216, 0.32)',
    '--sp-border-strong': '#f4ecd8',
    '--sp-border-focus': '#c8f31d',
    '--sp-overlay-border': '#f4ecd8',
    '--sp-overlay-border-width': '3px',

    // ── Chrome ──────────────────────────────────────────────────────────────
    '--sp-control-border-color': '#f4ecd8',
    '--sp-control-shadow': '3px 3px 0 #05070d',
    '--sp-control-shadow-hover': '4px 4px 0 #05070d',
    '--sp-control-shadow-active': '1px 1px 0 #05070d',
    '--sp-control-press-transform': 'translate(2px, 2px)',
    '--sp-control-font-weight': '700',
    '--sp-surface-shadow': '5px 5px 0 #05070d',

    '--sp-shadow-xs': '1px 1px 0 #05070d',
    '--sp-shadow-sm': '2px 2px 0 #05070d',
    '--sp-shadow-md': '3px 3px 0 #05070d',
    '--sp-shadow-lg': '5px 5px 0 #05070d',
    '--sp-shadow-xl': '8px 8px 0 #05070d',
    '--sp-shadow-inner': 'inset 2px 2px 0 rgba(5, 7, 13, 0.45)',

    '--sp-radius-sm': '6px',
    '--sp-radius-md': '10px',
    '--sp-radius-lg': '14px',
    '--sp-radius-xl': '20px',
    '--sp-radius-2xl': '26px',

    // ── Interaction ─────────────────────────────────────────────────────────
    '--sp-content-hover-bg': 'rgba(200, 243, 29, 0.16)',
    '--sp-content-active-bg': 'rgba(200, 243, 29, 0.28)',

    '--sp-focus-ring-color': '#c8f31d',
    '--sp-focus-ring-width': '3px',
    '--sp-focus-ring-offset': '2px',
    '--sp-focus-glow-color': 'rgba(200, 243, 29, 0.35)',
    '--sp-focus-glow-spread': '4px',

    '--sp-overlay-bg': 'rgba(5, 7, 13, 0.7)',

    '--sp-scrollbar-track': 'rgba(244, 236, 216, 0.06)',
    '--sp-scrollbar-thumb': '#f4ecd8',
    '--sp-scrollbar-hover': '#c8f31d',
  },
};

