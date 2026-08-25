import { describe, expect, it, vi } from 'vitest';
import { Input } from '../../src/index.js';
import {
  expectNoA11yViolations,
  renderWithRtl,
} from '../utils/test-utils.js';

describe('form validation', () => {
  it('exposes invalid state and an alert message for a labeled input', async () => {
    const onChange = vi.fn();
    const { container, getByLabelText, getByRole, user } = renderWithRtl(
      <form>
        <label htmlFor="email">Email address</label>
        <Input
          id="email"
          name="email"
          type="email"
          value="not-an-email"
          error="Enter a valid email address."
          required
          onChange={onChange}
        />
      </form>,
    );
    const input = getByLabelText('Email address');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(getByRole('alert')).toHaveTextContent('Enter a valid email address.');
    await user.clear(input);
    expect(onChange).toHaveBeenLastCalledWith('');
    await expectNoA11yViolations(container);
  });
});
