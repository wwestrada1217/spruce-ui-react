import type { SpruceTheme } from '../types.js';

/**
 * Comic — a light theme built on comic-panel conventions: warm paper surfaces,
 * flat saturated ink colors, thick outlines, and hard offset shadows with no
 * blur, so every control reads as a cut-out sitting on the page.
 *
 * The look comes almost entirely from three global levers rather than
 * per-component overrides: `--sp-border-width-hairline` doubles every outline,
 * the `--sp-shadow-*` ramp becomes solid offsets instead of blurs, and the
 * `--sp-control-*` / `--sp-surface-shadow` chrome tokens put an ink edge and a
 * drop shadow on buttons, fields, toggles, and cards.
 *
 * Ink is `#121317`, paper is `#fffdf5`, and the accents are comic primaries:
 * a deep electric blue, acid lime for interaction feedback, and a hot
 * crimson for danger — each darkened just enough to clear WCAG AA as text on
 * its own subtle background.
 */
export const comicTheme: SpruceTheme = {
  name: 'comic',
  displayName: 'Comic',
  base: 'light',
  tokens: {
    // ── Brand & status — flat, saturated, no gradients ──────────────────────
    '--sp-primary': '#1a56d6',
    '--sp-primary-hover': '#1246b3',
    '--sp-primary-active': '#0e3a94',
    '--sp-primary-subtle': '#e6edff',
    '--sp-primary-text': '#ffffff',

    '--sp-success': '#237514',
    '--sp-success-subtle': '#eefbdd',

    '--sp-warning': '#96540a',
    '--sp-warning-subtle': '#fff5dd',

    '--sp-danger': '#c81340',
    '--sp-danger-subtle': '#ffe9ee',

    '--sp-info': '#0c7695',
    '--sp-info-subtle': '#e4f7fc',

    // ── Paper surfaces ──────────────────────────────────────────────────────
    '--sp-surface-0': '#fffdf5',
    '--sp-surface-25': '#fdf8ea',
    '--sp-surface-50': '#faf1d8',
    '--sp-surface-100': '#f4e7c2',
    '--sp-surface-200': '#ecd9a8',
    '--sp-surface-300': '#dcc389',
    '--sp-surface-400': '#b09a63',
    '--sp-surface-500': '#7f6f45',
    '--sp-surface-600': '#5d5133',
    '--sp-surface-700': '#423923',
    '--sp-surface-800': '#2b2517',
    '--sp-surface-900': '#1a170e',
    '--sp-surface-950': '#0c0b06',

    // ── Ink type ────────────────────────────────────────────────────────────
    '--sp-text-color': '#121317',
    '--sp-text-muted': '#3a3f4b',
    '--sp-text-subtle': '#5b6270',
    '--sp-text-disabled': '#9ba1ad',
    '--sp-text-inverse': '#fffdf5',

    // Heavier across the board — comic lettering has no light weights.
    // Rounded faces if the platform has one, otherwise the bundled Noto Sans
    // carries the theme on weight alone — no third-party font is added.
    '--sp-font-sans':
      'SF Pro Rounded, Nunito, Quicksand, Trebuchet MS, Noto Sans, system-ui, sans-serif',
    '--sp-font-medium': '600',
    '--sp-font-semibold': '700',
    '--sp-font-bold': '800',

    // ── Outlines ────────────────────────────────────────────────────────────
    // Doubling the hairline is what turns every card, field, and button edge
    // into an ink line. Plain dividers stay translucent so a dense grid does
    // not become a wall of black rules.
    '--sp-border-width-hairline': '2px',
    '--sp-border-width-medium': '3px',
    '--sp-border': 'rgba(18, 19, 23, 0.35)',
    '--sp-border-strong': '#121317',
    '--sp-border-focus': '#121317',
    '--sp-overlay-border': '#121317',
    '--sp-overlay-border-width': '3px',

    // ── Chrome — ink edge plus hard offset shadow ───────────────────────────
    '--sp-control-border-color': '#121317',
    '--sp-control-shadow': '3px 3px 0 #121317',
    '--sp-control-shadow-hover': '4px 4px 0 #121317',
    '--sp-control-shadow-active': '1px 1px 0 #121317',
    '--sp-control-press-transform': 'translate(2px, 2px)',
    '--sp-control-font-weight': '700',
    '--sp-surface-shadow': '5px 5px 0 #121317',

    // ── Shadows — solid offsets, zero blur ──────────────────────────────────
    '--sp-shadow-xs': '1px 1px 0 #121317',
    '--sp-shadow-sm': '2px 2px 0 #121317',
    '--sp-shadow-md': '3px 3px 0 #121317',
    '--sp-shadow-lg': '5px 5px 0 #121317',
    '--sp-shadow-xl': '8px 8px 0 #121317',
    '--sp-shadow-inner': 'inset 2px 2px 0 rgba(18, 19, 23, 0.12)',

    // ── Chunky geometry ─────────────────────────────────────────────────────
    '--sp-radius-sm': '6px',
    '--sp-radius-md': '10px',
    '--sp-radius-lg': '14px',
    '--sp-radius-xl': '20px',
    '--sp-radius-2xl': '26px',

    // ── Interaction — acid lime highlight, ink focus ring ───────────────────
    '--sp-content-hover-bg': 'rgba(200, 243, 29, 0.35)',
    '--sp-content-active-bg': 'rgba(200, 243, 29, 0.6)',

    '--sp-focus-ring-color': '#121317',
    '--sp-focus-ring-width': '3px',
    '--sp-focus-ring-offset': '2px',
    '--sp-focus-glow-color': 'rgba(200, 243, 29, 0.85)',
    '--sp-focus-glow-spread': '4px',

    '--sp-overlay-bg': 'rgba(18, 19, 23, 0.55)',

    '--sp-scrollbar-track': 'rgba(18, 19, 23, 0.06)',
    '--sp-scrollbar-thumb': '#121317',
    '--sp-scrollbar-hover': '#1a56d6',
  },
};

