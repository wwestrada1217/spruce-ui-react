import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { DocsRoute } from '../../docs/src/App';
import { getDocsPageMetadata, getSearchMetadata } from '../../docs/src/components/docs-meta';
import { flattenNavSections, NAV_SECTIONS } from '../../docs/src/components/nav';
import { ComingSoonPage } from '../../docs/src/pages/ComingSoonPage';
import { ChoreographyPage } from '../../docs/src/pages/effects/ChoreographyPage';
import { expectNoA11yViolations, renderWithSpruce } from '../utils/test-utils.js';

describe('cross-cutting documentation', () => {
  it('keeps every published navigation entry registered in routes and search metadata', () => {
    const publishedItems = flattenNavSections(NAV_SECTIONS)
      .map(({ item }) => item)
      .filter((item) => !item.soon && !item.route.endsWith('/'));
    const publishedRoutes = publishedItems.map((item) => item.route);
    const searchRoutes = getSearchMetadata().map((item) => item.route);

    expect(new Set(publishedRoutes).size).toBe(publishedRoutes.length);
    expect(new Set(searchRoutes)).toEqual(new Set(publishedRoutes));

    for (const item of publishedItems) {
      const page = DocsRoute({ hash: item.route });
      const metadata = getDocsPageMetadata(item.route);

      expect(page.type, `${item.route} should resolve to a documentation page`).not.toBe(ComingSoonPage);
      expect(metadata.title).toBe(item.label);
      expect(metadata.description.length).toBeGreaterThan(0);

      if (['component', 'chart', 'effect', 'utility'].includes(metadata.kind)) {
        expect(metadata.packageName).toBe('spruce-react');
        expect(metadata.symbols?.length).toBeGreaterThan(0);
      }
    }
  });

  it('registers Effects Choreography in route and search metadata', () => {
    const metadata = getDocsPageMetadata('#/effects/choreography#reduced-motion');

    expect(metadata.route).toBe('#/effects/choreography');
    expect(metadata.kind).toBe('effect');
    expect(metadata.packageName).toBe('spruce-react');
    expect(metadata.symbols).toContain('useReducedMotion');
    expect(getSearchMetadata().some((item) => item.route === '#/effects/choreography')).toBe(true);
  });

  it('renders three live compositions with accessible state guidance', async () => {
    vi.stubGlobal('IntersectionObserver', class {
      observe(): void {}
      disconnect(): void {}
    });

    try {
      const page = renderWithSpruce(<ChoreographyPage />);

      expect(screen.getByRole('heading', { name: 'Effects Choreography' })).toBeInTheDocument();
      expect(screen.getAllByRole('tab', { name: /Preview/ })).toHaveLength(3);
      expect(screen.getByText(/Reduced motion is enabled|Motion is enabled/)).toBeInTheDocument();
      await expectNoA11yViolations(page.container);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
