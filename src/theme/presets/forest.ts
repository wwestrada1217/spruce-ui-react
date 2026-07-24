import type { SpruceTheme } from '../types.js';

/** Forest preset — an earthy green palette inspired by nature. */
export const forestTheme: SpruceTheme = {
  name: 'forest',
  displayName: 'Forest',
  base: 'light',
  tokens: {
    '--sp-primary': '#166534',
    '--sp-primary-hover': '#14532d',
    '--sp-primary-active': '#052e16',
    '--sp-primary-subtle': 'rgba(22, 101, 52, 0.1)',
    '--sp-primary-text': '#ffffff',
    '--sp-border-focus': '#166534',
    '--sp-success': '#15803d',
    '--sp-success-subtle': 'rgba(21, 128, 61, 0.1)',
    '--sp-info': '#0369a1',
    '--sp-info-subtle': 'rgba(3, 105, 161, 0.1)',
    '--sp-warning': '#a16207',
    '--sp-warning-subtle': 'rgba(161, 98, 7, 0.1)',
    '--sp-danger': '#b91c1c',
    '--sp-danger-subtle': 'rgba(185, 28, 28, 0.1)',
  },
};
