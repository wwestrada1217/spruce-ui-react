import { describe, expect, it, vi } from 'vitest';
import { Modal, Popover, Tooltip } from '../../src/index.js';
import {
  expectFocused,
  expectNoA11yViolations,
  pressKey,
  renderWithSpruce,
  waitFor,
} from '../utils/test-utils.js';

describe('overlays', () => {
  it('closes a modal with Escape and keeps the close control keyboard reachable', async () => {
    const onClose = vi.fn();
    const { getByRole, user } = renderWithSpruce(
      <Modal open onClose={onClose} title="Delete item">
        <p>Are you sure?</p>
      </Modal>,
    );
    const closeButton = getByRole('button', { name: 'Close' });

    closeButton.focus();
    expectFocused(closeButton);
    await pressKey(user, 'Escape');
    expect(onClose).toHaveBeenCalledTimes(1);
    await expectNoA11yViolations(document.body);
  });

  it('opens and dismisses a click popover', async () => {
    const { getByRole, getByText, queryByText, user } = renderWithSpruce(
      <Popover trigger={<button type="button">More details</button>}>
        <p>Popover content</p>
      </Popover>,
    );

    await user.click(getByRole('button', { name: 'More details' }));
    expect(getByText('Popover content')).toBeInTheDocument();
    await user.click(document.body);
    expect(queryByText('Popover content')).not.toBeInTheDocument();
  });

  it('reveals tooltip content from keyboard focus', async () => {
    const { getByRole, queryByRole, user } = renderWithSpruce(
      <Tooltip content="Save changes">
        <button type="button">Save</button>
      </Tooltip>,
    );
    const trigger = getByRole('button', { name: 'Save' });

    await user.tab();
    expectFocused(trigger);
    await waitFor(() => expect(queryByRole('tooltip')).toBeInTheDocument());
    await user.tab();
    expect(queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
