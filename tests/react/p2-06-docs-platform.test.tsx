import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { CodePreview } from '../../docs/src/components/CodePreview';
import { DocsI18nPicker, DocsI18nProvider } from '../../docs/src/components/DocsI18n';
import { DocsMobilePreview } from '../../docs/src/components/DocsMobilePreview';
import { DocsPackageBadge } from '../../docs/src/components/DocsPackageBadge';
import { DocsSectionScrubber } from '../../docs/src/components/DocsSectionScrubber';
import { getDocsPageMetadata, getSearchMetadata } from '../../docs/src/components/docs-meta';
import { DocsPlatformPage } from '../../docs/src/pages/utils/DocsPlatformPage';
import { expectDocumentDirection, expectFocused, expectNoA11yViolations, renderWithSpruce } from '../utils/test-utils.js';

describe('P2-06 documentation platform', () => {
  it('centralizes descriptive search metadata and resolves deep-link routes', () => {
    const metadata = getDocsPageMetadata('#/utils/docs-platform#api');
    expect(metadata.route).toBe('#/utils/docs-platform');
    expect(metadata.keywords).toContain('documentation');
    expect(metadata.symbols).toContain('DocsSectionScrubber');
    expect(getSearchMetadata().some((item) => item.route === '#/utils/docs-platform' && item.description.length > 0)).toBe(true);
  });

  it('copies the full package import and announces feedback', async () => {
    let copiedText = '';
    const writeText = (text: string): Promise<void> => {
      copiedText = text;
      return Promise.resolve();
    };
    const { user } = renderWithSpruce(<DocsPackageBadge packageName="spruce-react" symbols={['Button', 'Card']} />);
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } });
    expect(window.navigator.clipboard.writeText).toBe(writeText);
    const copyButton = screen.getByRole('button', { name: 'Copy import statement' });

    await user.click(copyButton);

    expect(copiedText).toBe("import { Button, Card } from 'spruce-react';");
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('supports deep links, reduced-motion scrolling, and roving keyboard focus', async () => {
    window.location.hash = '#/utils/docs-platform#scrubber';
    const scrollIntoView = vi.spyOn(HTMLElement.prototype, 'scrollIntoView');
    const matchMedia = vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)', media: query, onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
    }));
    try {
      const { user } = renderWithSpruce(
        <div className="docs-main">
          <section id="overview"><h2>Overview</h2></section>
          <section id="scrubber"><h2>Scrubber</h2></section>
          <DocsSectionScrubber sections={[{ id: 'overview', label: 'Overview' }, { id: 'scrubber', label: 'Scrubber' }]} />
        </div>,
      );
      await waitFor(() => expect(screen.getByRole('link', { name: 'Scrubber' })).toHaveAttribute('aria-current', 'location'));
      const overviewLink = screen.getByRole('link', { name: 'Overview' });
      const scrubberLink = screen.getByRole('link', { name: 'Scrubber' });
      overviewLink.focus();
      expectFocused(overviewLink);
      await user.keyboard('{ArrowDown}');
      expectFocused(scrubberLink);
      expect(scrubberLink).toHaveAttribute('tabindex', '0');
      await user.click(overviewLink);
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
    } finally {
      matchMedia.mockRestore();
      scrollIntoView.mockRestore();
      window.location.hash = '#/';
    }
  });

  it('renders a touch-sized preview shell with optional status chrome', () => {
    renderWithSpruce(
      <DocsMobilePreview statusBar={false} align="center">
        <button type="button">Continue</button>
      </DocsMobilePreview>,
    );
    expect(screen.getByLabelText('Mobile component preview')).toBeInTheDocument();
    expect(screen.queryByText('9:41')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('updates locale, direction, and document language through the docs picker', async () => {
    const { user } = renderWithSpruce(
      <DocsI18nProvider><DocsI18nPicker /></DocsI18nProvider>,
      { providerProps: { syncDocument: true } },
    );
    await user.click(screen.getByRole('button', { name: 'Language settings' }));
    await user.selectOptions(screen.getByLabelText('Locale'), 'ar');

    await waitFor(() => {
      expect(screen.getAllByText('ar').length).toBeGreaterThan(0);
      expect(document.documentElement).toHaveAttribute('lang', 'ar');
      expectDocumentDirection('rtl');
    });
  });

  it('keeps CodePreview modes keyboard-addressable and the platform page accessible', async () => {
    const { user } = renderWithSpruce(<CodePreview code="const value = 1;" language="typescript"><button type="button">Run</button></CodePreview>);
    expect(screen.getByRole('tab', { name: /Preview/ })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('tab', { name: /Code/ }));
    expect(screen.getByRole('tab', { name: /Code/ })).toHaveAttribute('aria-selected', 'true');

    const page = renderWithSpruce(<DocsI18nProvider><DocsPlatformPage /></DocsI18nProvider>);
    await expectNoA11yViolations(page.container);
    page.unmount();
  });

  it('supports the shared property inspector and keyboard-resizable split pane', async () => {
    const onWidthChange = vi.fn();
    const { user } = renderWithSpruce(
      <CodePreview
        propertyPanelEnabled
        propertyPanelProperties={[{ name: 'tone', label: 'Tone', category: 'Appearance', editor: 'select', value: 'calm', options: [{ label: 'Calm', value: 'calm' }] }]}
        onPropertyPanelWidthChange={onWidthChange}
      >
        <span>Preview</span>
      </CodePreview>,
    );

    await user.click(screen.getByRole('button', { name: 'Show properties' }));
    expect(screen.getByRole('complementary', { name: 'Preview properties' })).toBeInTheDocument();
    const splitter = screen.getByRole('separator', { name: 'Resize properties panel' });
    splitter.focus();
    await user.keyboard('{Home}');
    expect(splitter).toHaveAttribute('aria-valuenow', '520');
    expect(onWidthChange).toHaveBeenCalledWith(520);
    await user.click(screen.getByRole('button', { name: 'Hide properties' }));
    expect(screen.queryByRole('complementary', { name: 'Preview properties' })).not.toBeInTheDocument();
  });
});
