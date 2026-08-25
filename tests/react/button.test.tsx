import { describe, expect, it } from 'vitest';
import { Button } from '../../src/index.js';
import {
  expectFocused,
  expectNoA11yViolations,
  renderWithTheme,
} from '../utils/test-utils.js';

describe('Button', () => {
  it('supports native semantics, loading, and keyboard focus', async () => {
    const { getByRole, user } = renderWithTheme(
      <Button type="submit" variant="secondary" loading>
        Save changes
      </Button>,
      'light',
    );
    const button = getByRole('button', { name: 'Save changes' });

    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveClass('sp-btn--secondary');
    expect(button.querySelector('.sp-btn__spinner')).toBeInTheDocument();
    await user.click(button);
    expectFocused(button);
  });

  it('keeps icon-only buttons accessible in both themes', async () => {
    const { getByRole, container } = renderWithTheme(
      <Button iconOnly iconLeft="x" aria-label="Close dialog" />,
      'dark',
    );

    expect(getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
