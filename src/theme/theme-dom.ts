/**
 * Apply the theme attributes shared by the provider and framework-neutral
 * integrations. Keeping this small makes the DOM contract easy to verify
 * without coupling token behavior to React rendering mechanics.
 */
export function applyThemeToDocument(
  document: Pick<globalThis.Document, 'documentElement'>,
  resolved: 'light' | 'dark',
  preset?: string,
): void {
  document.documentElement.setAttribute('data-theme', resolved);
  if (preset) document.documentElement.setAttribute('data-theme-preset', preset);
  else document.documentElement.removeAttribute?.('data-theme-preset');
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}
