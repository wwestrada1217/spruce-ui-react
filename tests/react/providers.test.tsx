import { describe, expect, it } from 'vitest';
import { useI18n, useTheme } from '../../src/index.js';
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
      <button type="button" onClick={() => i18n.setLabels({ close: 'Dismiss panel' })}>
        Override label
      </button>
      <span>{i18n.t('close')}</span>
    </div>
  );
}

describe('SpruceProvider test contract', () => {
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
