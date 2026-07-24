import type { SpruceTheme } from '../types.js';

/**
 * Retro preset — a warm, nostalgic light theme inspired by 80s interfaces.
 */
export const retroTheme: SpruceTheme = {
  name: 'retro',
  displayName: 'Retro',
  base: 'light',
  tokens: {
    '--sp-primary': '#d97706',
    '--sp-primary-hover': '#b45309',
    '--sp-primary-active': '#92400e',
    '--sp-primary-subtle': 'rgba(217, 119, 6, 0.12)',
    '--sp-primary-text': '#ffffff',
    '--sp-border-focus': '#d97706',
    '--sp-success': '#15803d',
    '--sp-success-subtle': 'rgba(21, 128, 61, 0.1)',
    '--sp-info': '#0369a1',
    '--sp-info-subtle': 'rgba(3, 105, 161, 0.1)',
    '--sp-warning': '#a16207',
    '--sp-warning-subtle': 'rgba(161, 98, 7, 0.1)',
    '--sp-danger': '#b91c1c',
    '--sp-danger-subtle': 'rgba(185, 28, 28, 0.1)',
    '--sp-surface-0': '#fdf6e3',
    '--sp-surface-25': '#faf1d5',
    '--sp-surface-50': '#f5e9c8',
    '--sp-surface-100': '#eddbaa',
    '--sp-surface-200': '#dfc98c',
    '--sp-surface-300': '#c9b070',
    '--sp-text-color': '#292203',
    '--sp-text-muted': '#57461e',
    '--sp-text-subtle': '#87661e',
    '--sp-text-disabled': '#c4a44e',
    '--sp-text-inverse': '#fdf6e3',
    '--sp-border': 'rgba(180, 130, 30, 0.18)',
    '--sp-border-strong': 'rgba(180, 130, 30, 0.30)',
    '--sp-content-hover-bg': 'rgba(180, 130, 30, 0.07)',
    '--sp-content-active-bg': 'rgba(180, 130, 30, 0.12)',
    '--sp-scrollbar-track': 'rgba(180, 130, 30, 0.05)',
    '--sp-scrollbar-thumb': 'rgba(180, 130, 30, 0.22)',
    '--sp-scrollbar-hover': 'rgba(180, 130, 30, 0.38)',
  },
};
