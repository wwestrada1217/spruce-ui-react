import { describe, expect, it } from 'vitest';
import { SPRUCE_THEME_PRESETS, useI18n, useTheme } from '../../src/index.js';
import {
  expectDocumentDirection,
  expectDocumentTheme,
  renderWithRtl,
  renderWithSpruce,
  pressKey,
} from '../utils/test-utils.js';

function ProviderProbe() {
  const theme = useTheme();
  const i18n = useI18n();

  return (
    <div>
      <output data-testid="resolved-theme">{theme.resolved}</output>
      <output data-testid="locale">{i18n.locale}</output>
      <output data-testid="direction">{i18n.direction}</output>
      <button type="button" onClick={theme.toggle}>Toggle theme</button>
      {SPRUCE_THEME_PRESETS.map(preset => (
        <button key={preset.name} onClick={() => theme.setTheme(preset.name)}>
          {preset.name}
        </button>
      ))}
      <button type="button" onClick={() => i18n.setLabels({ close: 'Dismiss panel' })}>
        Override label
      </button>
      <span>{i18n.t('close')}</span>
    </div>
  );
}

describe('SpruceProvider test contract', () => {
  it('keeps preset styles attached after StrictMode effect cleanup and theme changes', async () => {
    const { getByRole, user, unmount } = renderWithSpruce(<ProviderProbe />, {
      reactStrictMode: true,
      providerProps: { defaultTheme: 'ocean', persist: false },
    });

    expect(document.head.querySelector('#sp-theme-override')).not.toBeNull();

    for (const preset of SPRUCE_THEME_PRESETS) {
      await user.click(getByRole('button', { name: preset.name }));
      expectDocumentTheme(preset.base);
      expect(document.documentElement).toHaveAttribute('data-theme-preset', preset.name);
      const stylesheet = document.head.querySelector('#sp-theme-override');
      expect(stylesheet).not.toBeNull();
      for (const [token, value] of Object.entries(preset.tokens)) {
        expect(stylesheet?.textContent).toContain(`${token}: ${value};`);
      }
    }

    await user.click(getByRole('button', { name: 'Toggle theme' }));
    expect(document.head.querySelector('#sp-theme-override')?.textContent).toBe('');
    unmount();
    expect(document.head.querySelector('#sp-theme-override')).toBeNull();
  });

  it('applies theme state and exposes provider actions', async () => {
    const { getByRole, getByTestId, user } = renderWithSpruce(<ProviderProbe />, {
      providerProps: { defaultTheme: 'dark', persist: false },
    });

    expect(getByTestId('resolved-theme')).toHaveTextContent('dark');
    expectDocumentTheme('dark');
    await user.click(getByRole('button', { name: 'Toggle theme' }));
    expect(getByTestId('resolved-theme')).toHaveTextContent('light');
    expectDocumentTheme('light');
  });

  it('lets dark preset tokens override the base dark token layer', async () => {
    const { getByRole, user } = renderWithSpruce(<ProviderProbe />, {
      providerProps: { persist: false },
    });

    const preset = SPRUCE_THEME_PRESETS.find((theme) => theme.name === 'modern-dark');
    expect(preset).toBeDefined();
    await user.click(getByRole('button', { name: 'modern-dark' }));

    const stylesheet = document.head.querySelector('#sp-theme-override')?.textContent;
    expect(stylesheet).toContain(":root[data-theme='light'],\n:root[data-theme='dark']");
    expect(stylesheet).toContain(`--sp-primary: ${preset?.tokens['--sp-primary']};`);
  });

  it('supports RTL document synchronization and localized label overrides', async () => {
    const { getByRole, getByText, getByTestId, user } = renderWithRtl(<ProviderProbe />, {
      providerProps: { persist: false, syncDocument: true },
    });

    expect(getByTestId('locale')).toHaveTextContent('ar');
    expect(getByTestId('direction')).toHaveTextContent('rtl');
    expectDocumentDirection('rtl');
    expect(document.documentElement).toHaveAttribute('lang', 'ar');

    await user.click(getByRole('button', { name: 'Override label' }));
    expect(getByText('Dismiss panel')).toBeInTheDocument();
    await pressKey(user, 'Tab');
  });
});
