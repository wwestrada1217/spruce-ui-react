import type { SpruceTheme } from '../types.js';

/**
 * Bumblebee preset — a bold, energetic light theme with a yellow-and-dark palette.
 */
export const bumblebeeTheme: SpruceTheme = {
  name: 'bumblebee',
  displayName: 'Bumblebee',
  base: 'light',
  tokens: {
    '--sp-primary': '#e5c700',
    '--sp-primary-hover': '#cdb200',
    '--sp-primary-active': '#b09700',
    '--sp-primary-subtle': 'rgba(229, 199, 0, 0.12)',
    '--sp-primary-text': '#1a1000',
    '--sp-border-focus': '#e5c700',
    '--sp-success': '#16a34a',
    '--sp-success-subtle': 'rgba(22, 163, 74, 0.1)',
    '--sp-info': '#0369a1',
    '--sp-info-subtle': 'rgba(3, 105, 161, 0.1)',
    '--sp-warning': '#ea580c',
    '--sp-warning-subtle': 'rgba(234, 88, 12, 0.1)',
    '--sp-danger': '#dc2626',
    '--sp-danger-subtle': 'rgba(220, 38, 38, 0.1)',
    '--sp-surface-0': '#ffffff',
    '--sp-surface-25': '#fefce8',
    '--sp-surface-50': '#fef9c3',
    '--sp-surface-100': '#fef08a',
    '--sp-surface-200': '#fde047',
    '--sp-surface-300': '#facc15',
    '--sp-text-color': '#1a1000',
    '--sp-text-muted': '#3d2e00',
    '--sp-text-subtle': '#6b5100',
    '--sp-text-disabled': '#a89030',
    '--sp-text-inverse': '#ffffff',
    '--sp-border': 'rgba(100, 80, 0, 0.12)',
    '--sp-border-strong': 'rgba(100, 80, 0, 0.22)',
    '--sp-content-hover-bg': 'rgba(229, 199, 0, 0.07)',
    '--sp-content-active-bg': 'rgba(229, 199, 0, 0.12)',
    '--sp-scrollbar-track': 'rgba(229, 199, 0, 0.05)',
    '--sp-scrollbar-thumb': 'rgba(229, 199, 0, 0.30)',
    '--sp-scrollbar-hover': 'rgba(229, 199, 0, 0.50)',
  },
};
