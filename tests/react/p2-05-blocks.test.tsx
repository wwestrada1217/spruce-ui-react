import { describe, expect, it, vi } from 'vitest';
import { within } from '@testing-library/react';
import { ChartsBlockPage } from '../../docs/src/pages/blocks/ChartsBlockPage';
import { CookieConsentBlockPage } from '../../docs/src/pages/blocks/CookieConsentBlockPage';
import { OperationsGridBlockPage } from '../../docs/src/pages/blocks/OperationsGridBlockPage';
import { RestClientWorkflowBlockPage } from '../../docs/src/pages/blocks/RestClientWorkflowBlockPage';
import { StocksBlockPage } from '../../docs/src/pages/blocks/StocksBlockPage';
import { expectNoA11yViolations, renderWithSpruce, waitFor } from '../utils/test-utils.js';

describe('P2-05 application blocks', () => {
  it('renders every block with an accessible page heading and no axe violations', async () => {
    const pages = [
      [ChartsBlockPage, 'Charts Blocks'],
      [CookieConsentBlockPage, 'Privacy & Cookie Consent Block'],
      [OperationsGridBlockPage, 'Operations Grid'],
      [RestClientWorkflowBlockPage, 'REST Client — Workflow Designer'],
      [StocksBlockPage, 'Stocks App'],
    ] as const;

    for (const [Page, heading] of pages) {
      const view = renderWithSpruce(<Page />);
      expect(view.getByRole('heading', { name: heading, level: 1 })).toBeInTheDocument();
      await expectNoA11yViolations(view.container);
      view.unmount();
    }
  }, 30000);

  it('persists cookie choices and exposes expandable preferences', async () => {
    window.localStorage.clear();
    const { getByRole, getByText, queryByText, user } = renderWithSpruce(<CookieConsentBlockPage />);
    const banner = within(getByRole('region', { name: 'Privacy Consent Block' }));

    const preferences = banner.getByRole('button', { name: 'Preferences' });
    expect(preferences).toHaveAttribute('aria-expanded', 'false');
    await user.click(preferences);
    expect(banner.getByRole('button', { name: 'Hide details' })).toHaveAttribute('aria-expanded', 'true');
    expect(banner.getByText('Analytics Telemetry')).toBeInTheDocument();

    await user.click(banner.getByRole('button', { name: 'Accept All' }));
    expect(getByText('Granted (All Cookies)')).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('sp_privacy_consent') ?? '{}')).toMatchObject({
      status: 'granted',
      analytics: true,
    });

    await user.click(getByRole('button', { name: 'Reset Consent State' }));
    expect(getByText('Pending Choice')).toBeInTheDocument();
    expect(queryByText('Granted (All Cookies)')).not.toBeInTheDocument();
  });

  it('filters and bulk-updates selected operations records', async () => {
    const { getByRole, getByText, getAllByRole, user } = renderWithSpruce(<OperationsGridBlockPage />);
    const metrics = within(getByRole('list', { name: 'Queue metrics' }));

    expect(metrics.getByText('12')).toBeInTheDocument();
    await user.click(getByRole('button', { name: 'Escalated' }));
    expect(metrics.getByText('Visible records').parentElement).toHaveTextContent('2');

    const checkboxes = getAllByRole('checkbox') as HTMLInputElement[];
    await user.click(checkboxes[1]!);
    await waitFor(() => expect(getByText('1 record(s) selected')).toBeInTheDocument());
    const markReady = getByRole('button', { name: 'Mark ready' });
    expect(markReady).toBeEnabled();
    await user.click(markReady);
    await waitFor(() => expect(getByText('0 record(s) selected')).toBeInTheDocument());
    expect(markReady).toBeDisabled();
  });

  it('updates the stocks selection and chart period with native button semantics', async () => {
    const { getByRole, getByText, user } = renderWithSpruce(<StocksBlockPage />);

    const microsoft = getByRole('button', { name: /MSFT \$412\.87 up/ });
    expect(microsoft).toHaveAttribute('aria-pressed', 'false');
    await user.click(microsoft);
    expect(microsoft).toHaveAttribute('aria-pressed', 'true');
    expect(getByText('Microsoft Corp.', { selector: '.sp-block-stocks__company-name' })).toBeInTheDocument();

    const week = getByRole('button', { name: '1W' });
    await user.click(week);
    expect(week).toHaveAttribute('aria-pressed', 'true');
    expect(getByRole('button', { name: '1M' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('reports workflow execution state', async () => {
    const { getByRole, getByText, user } = renderWithSpruce(<RestClientWorkflowBlockPage />);

    await user.click(getByRole('button', { name: 'Run workflow' }));
    const output = getByText('Completed: 3 nodes evaluated');
    expect(output).toBeInTheDocument();
    expect(output.closest('[role="status"]')).toHaveAttribute('aria-live', 'polite');
  });

  it('uses an automatic scroll behavior when reduced motion is requested', async () => {
    const scrollIntoView = vi.spyOn(HTMLElement.prototype, 'scrollIntoView');
    const matchMedia = vi.spyOn(window, 'matchMedia');
    matchMedia.mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    try {
      const { getByRole, user } = renderWithSpruce(<ChartsBlockPage />);
      await user.click(getByRole('button', { name: 'Sales Report' }));
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
    } finally {
      matchMedia.mockRestore();
      scrollIntoView.mockRestore();
    }
  });
});
