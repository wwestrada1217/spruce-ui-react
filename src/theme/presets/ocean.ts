import type { SpruceTheme } from '../types.js';

/** Ocean preset — a cool cyan/teal palette inspired by the sea. */
export const oceanTheme: SpruceTheme = {
  name: 'ocean',
  displayName: 'Ocean',
  base: 'light',
  tokens: {
    '--sp-primary': '#0e7490',
    '--sp-primary-hover': '#0c6678',
    '--sp-primary-active': '#0a526a',
    '--sp-primary-subtle': 'rgba(14, 116, 144, 0.1)',
    '--sp-primary-text': '#ffffff',
    '--sp-border-focus': '#0e7490',
    '--sp-success': '#059669',
    '--sp-success-subtle': 'rgba(5, 150, 105, 0.1)',
    '--sp-info': '#0284c7',
    '--sp-info-subtle': 'rgba(2, 132, 199, 0.1)',
    '--sp-warning': '#b45309',
    '--sp-warning-subtle': 'rgba(180, 83, 9, 0.1)',
    '--sp-danger': '#e11d48',
    '--sp-danger-subtle': 'rgba(225, 29, 72, 0.1)',
  },
};
