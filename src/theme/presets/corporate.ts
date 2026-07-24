import type { SpruceTheme } from '../types.js';

/**
 * Corporate preset — a professional deep-navy palette for enterprise contexts.
 */
export const corporateTheme: SpruceTheme = {
  name: 'corporate',
  displayName: 'Corporate',
  base: 'light',
  tokens: {
    '--sp-primary': '#1d3557',
    '--sp-primary-hover': '#163048',
    '--sp-primary-active': '#0e1f38',
    '--sp-primary-subtle': 'rgba(29, 53, 87, 0.08)',
    '--sp-primary-text': '#ffffff',
    '--sp-border-focus': '#1d3557',
    '--sp-success': '#16a34a',
    '--sp-success-subtle': 'rgba(22, 163, 74, 0.1)',
    '--sp-info': '#0284c7',
    '--sp-info-subtle': 'rgba(2, 132, 199, 0.1)',
    '--sp-warning': '#ca8a04',
    '--sp-warning-subtle': 'rgba(202, 138, 4, 0.1)',
    '--sp-danger': '#dc2626',
    '--sp-danger-subtle': 'rgba(220, 38, 38, 0.1)',
    '--sp-radius-sm': '2px',
    '--sp-radius-md': '3px',
    '--sp-radius-lg': '4px',
    '--sp-radius-xl': '6px',
    '--sp-radius-2xl': '8px',
  },
};
