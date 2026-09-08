import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { getDocsPageMetadata, getSearchMetadata } from '../../docs/src/components/docs-meta';
import { ChoreographyPage } from '../../docs/src/pages/effects/ChoreographyPage';
import { expectNoA11yViolations, renderWithSpruce } from '../utils/test-utils.js';

describe('cross-cutting documentation', () => {
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
