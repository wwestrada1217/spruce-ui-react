import {
  render,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { expect } from 'vitest';
import { axe } from 'jest-axe';
import {
  SpruceProvider,
  type SpruceProviderProps,
  type SpDirection,
} from '../../src/index.js';
import type { ReactElement, PropsWithChildren } from 'react';

export type SpruceProviderTestProps = Omit<SpruceProviderProps, 'children'>;

export interface RenderWithSpruceOptions extends Omit<RenderOptions, 'wrapper'> {
  providerProps?: SpruceProviderTestProps;
}

export type SpruceRenderResult = RenderResult & {
  user: UserEvent;
};

export function renderWithSpruce(
  ui: ReactElement,
  { providerProps, ...renderOptions }: RenderWithSpruceOptions = {},
): SpruceRenderResult {
  function Wrapper({ children }: PropsWithChildren) {
    return <SpruceProvider {...providerProps}>{children}</SpruceProvider>;
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    user: userEvent.setup(),
  };
}

export function renderWithTheme(
  ui: ReactElement,
  theme: NonNullable<SpruceProviderProps['defaultTheme']>,
  options: RenderWithSpruceOptions = {},
): SpruceRenderResult {
  return renderWithSpruce(ui, {
    ...options,
    providerProps: {
      ...options.providerProps,
      defaultTheme: theme,
    },
  });
}

export function renderWithRtl(
  ui: ReactElement,
  options: RenderWithSpruceOptions = {},
): SpruceRenderResult {
  return renderWithSpruce(ui, {
    ...options,
    providerProps: {
      ...options.providerProps,
      direction: 'rtl',
      locale: options.providerProps?.locale ?? 'ar',
    },
  });
}

export async function expectNoA11yViolations(
  container: Element = document.body,
): Promise<void> {
  const results = await axe(container);
  expect(results.violations).toEqual([]);
}

export function expectFocused(element: Element): void {
  expect(document.activeElement).toBe(element);
}

export function expectDocumentTheme(theme: 'light' | 'dark'): void {
  expect(document.documentElement).toHaveAttribute('data-theme', theme);
}

export function expectDocumentDirection(direction: SpDirection): void {
  expect(document.documentElement).toHaveAttribute('dir', direction);
}

export async function pressKey(user: UserEvent, key: string): Promise<void> {
  await user.keyboard(`{${key}}`);
}

export async function tabTo(user: UserEvent, element: Element): Promise<void> {
  await user.tab();
  expectFocused(element);
}

export { axe, userEvent };
export { waitFor } from '@testing-library/react';
