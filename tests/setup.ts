import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

if (typeof window.requestAnimationFrame !== 'function') {
  window.requestAnimationFrame = (callback: FrameRequestCallback): number =>
    window.setTimeout(() => callback(performance.now()), 0);
  window.cancelAnimationFrame = (handle: number): void => window.clearTimeout(handle);
}

if (typeof HTMLElement.prototype.scrollIntoView !== 'function') {
  HTMLElement.prototype.scrollIntoView = vi.fn();
}

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
  document.documentElement.className = '';
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-theme-preset');
  document.documentElement.removeAttribute('data-accent');
  document.documentElement.removeAttribute('data-accent-harmony');
  document.documentElement.removeAttribute('dir');
  document.documentElement.removeAttribute('lang');
  document.getElementById('sp-theme-override')?.remove();
  document.getElementById('sp-accent-override')?.remove();
  window.localStorage.clear();
});
