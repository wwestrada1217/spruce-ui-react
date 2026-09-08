import { afterEach, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { act, fireEvent } from '@testing-library/react';
import {
  CommandPalette,
  Dropdown,
  Drawer,
  Modal,
  Popover,
  Tooltip,
  TooltipGroup,
  Window,
} from '../../src/index.js';
import { expectFocused, pressKey, renderWithRtl, renderWithSpruce, waitFor } from '../utils/test-utils.js';

afterEach(() => vi.useRealTimers());

describe('P1.0-05 overlay parity', () => {
  it('supports controlled popovers, modal boundaries, scroll dismissal, and capture Escape', async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <div className="sp-modal">
          <Popover trigger={<button type="button">Open popover</button>} open={open} onOpenChange={setOpen} dismissOnScroll>
            <p>Popover body</p>
          </Popover>
        </div>
      );
    }
    const { getByRole, queryByText, user } = renderWithSpruce(<Harness />);
    await user.click(getByRole('button', { name: 'Open popover' }));
    expect(queryByText('Popover body')).toBeInTheDocument();
    await pressKey(user, 'Escape');
    expect(queryByText('Popover body')).not.toBeInTheDocument();
  });

  it('delays tooltips, wires aria-describedby, suppresses disabled hosts, and warms groups', async () => {
    vi.useFakeTimers();
    const { getByRole, queryByRole } = renderWithSpruce(
      <TooltipGroup initialDelay={100} gracePeriod={100}>
        <Tooltip content="Save" delay={100}><button type="button">Save</button></Tooltip>
        <Tooltip content="Disabled" delay={0}><button type="button" disabled>Disabled</button></Tooltip>
      </TooltipGroup>,
    );
    const saveButton = getByRole('button', { name: 'Save' });
    fireEvent.focus(saveButton.parentElement ?? saveButton);
    expect(queryByRole('tooltip')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(100));
    await Promise.resolve();
    expect(queryByRole('tooltip')).toHaveTextContent('Save');
    expect(getByRole('button', { name: 'Save' })).toHaveAttribute('aria-describedby');
    fireEvent.blur(saveButton.parentElement ?? saveButton);
    const disabledButton = getByRole('button', { name: 'Disabled' });
    fireEvent.focus(disabledButton.parentElement ?? disabledButton);
    act(() => vi.advanceTimersByTime(200));
    expect(queryByRole('tooltip', { name: 'Disabled' })).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('provides controlled dropdown lifecycle callbacks and keyboard navigation', async () => {
    const opened = vi.fn();
    const closed = vi.fn();
    const selected = vi.fn();
    const { getByRole, getAllByRole, user } = renderWithSpruce(
      <Dropdown
        trigger={<button type="button">Actions</button>}
        items={[{ label: 'Edit', shortcut: ['Ctrl', 'E'] }, { label: 'Delete', disabled: true }]}
        onItemClick={selected}
        onOpened={opened}
        onClosed={closed}
      />,
    );
    await user.click(getByRole('button', { name: 'Actions' }));
    expect(opened).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(getByRole('menu')).toBeInTheDocument());
    const menuButtons = getAllByRole('button');
    await waitFor(() => expect(document.activeElement).toBe(menuButtons[1]));
    await pressKey(user, 'ArrowDown');
    expect(document.activeElement).toHaveTextContent('Edit');
    await pressKey(user, 'Escape');
    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('keeps modal and drawer backdrop clicks exact and traps/restores focus', async () => {
    const onModalClose = vi.fn();
    const trigger = document.createElement('button');
    trigger.textContent = 'Trigger';
    document.body.appendChild(trigger);
    trigger.focus();
    const modal = renderWithSpruce(
      <Modal open onClose={onModalClose} title="Details" description="Description">
        <button type="button">Confirm</button>
      </Modal>,
    );
    await waitFor(() => expectFocused(modal.getByRole('button', { name: 'Close' })));
    await modal.user.click(modal.getByRole('button', { name: 'Confirm' }));
    expect(onModalClose).not.toHaveBeenCalled();
    const modalBackdrop = document.querySelector('.sp-modal-backdrop');
    if (!(modalBackdrop instanceof HTMLElement)) throw new Error('modal backdrop missing');
    await modal.user.click(modalBackdrop);
    expect(onModalClose).toHaveBeenCalledTimes(1);
    modal.unmount();
    expectFocused(trigger);

    const onDrawerClose = vi.fn();
    const drawer = renderWithSpruce(<Drawer open onClose={onDrawerClose} title="Navigation"><button type="button">Next</button></Drawer>);
    await drawer.user.click(drawer.getByRole('button', { name: 'Next' }));
    expect(onDrawerClose).not.toHaveBeenCalled();
    await pressKey(drawer.user, 'Escape');
    expect(onDrawerClose).toHaveBeenCalledTimes(1);
  });

  it('supports window maximize state and command palette fuzzy/shortcut/footer behavior', async () => {
    const maximized = vi.fn();
    const onClose = vi.fn();
    const win = renderWithSpruce(<Window open onClose={onClose} title="Editor" onMaximizeChange={maximized}><p>Body</p></Window>);
    await win.user.click(win.getByRole('button', { name: 'Maximize' }));
    expect(maximized).toHaveBeenCalledWith(true);
    await win.user.click(win.getByRole('button', { name: 'Restore' }));
    expect(maximized).toHaveBeenCalledWith(false);
    await win.user.click(win.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    win.unmount();

    const selected = vi.fn();
    const closed = vi.fn();
    const palette = renderWithRtl(
      <CommandPalette
        open
        onClose={closed}
        onSelect={selected}
        highlightQuery
        fuzzySearch
        showShortcuts
        showFooter
        items={[{ id: 'scroll', label: 'Scroll to section', keywords: ['scrl'], shortcut: 'Ctrl+S' }]}
      />,
    );
    await palette.user.type(palette.getByRole('textbox'), 'scrl');
    expect(palette.getByText('Scroll to section')).toBeInTheDocument();
    expect(palette.getByText('Ctrl')).toBeInTheDocument();
    expect(document.querySelector('.sp-cp-footer')).toBeInTheDocument();
    await pressKey(palette.user, 'Enter');
    expect(selected).toHaveBeenCalledWith(expect.objectContaining({ id: 'scroll' }));
    expect(closed).toHaveBeenCalledTimes(1);
  });
});
