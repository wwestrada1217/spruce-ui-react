import type { SpruceTheme } from '../types.js';

/** Rose preset — a warm pink/rose palette with softer, rounder aesthetics. */
export const roseTheme: SpruceTheme = {
  name: 'rose',
  displayName: 'Rose',
  base: 'light',
  tokens: {
    '--sp-primary': '#be185d',
    '--sp-primary-hover': '#9d174d',
    '--sp-primary-active': '#831843',
    '--sp-primary-subtle': 'rgba(190, 24, 93, 0.1)',
    '--sp-primary-text': '#ffffff',
    '--sp-border-focus': '#be185d',
    '--sp-success': '#15803d',
    '--sp-success-subtle': 'rgba(21, 128, 61, 0.1)',
    '--sp-info': '#0891b2',
    '--sp-info-subtle': 'rgba(8, 145, 178, 0.1)',
    '--sp-warning': '#b45309',
    '--sp-warning-subtle': 'rgba(180, 83, 9, 0.1)',
    '--sp-danger': '#dc2626',
    '--sp-danger-subtle': 'rgba(220, 38, 38, 0.1)',
    '--sp-radius-sm': '6px',
    '--sp-radius-md': '10px',
    '--sp-radius-lg': '14px',
    '--sp-radius-xl': '18px',
    '--sp-radius-2xl': '24px',
  },
};
