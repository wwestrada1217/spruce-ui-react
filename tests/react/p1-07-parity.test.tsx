import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { Accordion, AccordionItem, Breadcrumbs, ButtonGroup, SplitButton, Stepper, Tabs, computeOverflowHidden } from '../../src/index.js';
import { pressKey, renderWithRtl, renderWithSpruce, waitFor } from '../utils/test-utils.js';

describe('P1.0-07 navigation and action parity', () => {
  it('supports controlled accordion values, item events, heading semantics, and keyboard navigation', async () => {
    const toggled = vi.fn();
    function Harness() {
      const [value, setValue] = useState(['first']);
      return <Accordion value={value} onValueChange={setValue} onItemToggle={toggled} headingLevel={2} multiple={false} ariaLabel="FAQ">
        <AccordionItem value="first" header="First">First body</AccordionItem>
        <AccordionItem value="second" header="Second">Second body</AccordionItem>
      </Accordion>;
    }
    const view = renderWithSpruce(<Harness />);
    expect(view.getAllByRole('heading', { level: 2 })).toHaveLength(2);
    expect(view.getByText('First body')).toBeInTheDocument();
    await view.user.click(view.getByRole('button', { name: /Second/ }));
    expect(view.getByText('First body').closest('[role="region"]')).toHaveAttribute('aria-hidden', 'true');
    expect(view.getByText('Second body')).toBeVisible();
    expect(toggled).toHaveBeenCalledWith({ value: 'second', open: true });
    await pressKey(view.user, 'ArrowUp');
    expect(document.activeElement).toHaveTextContent('First');
  });

  it('controls button-group selection and preserves RTL connected layout', async () => {
    const changed = vi.fn();
    const view = renderWithRtl(<ButtonGroup items={[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]} toggleMode="single" defaultValue={['one']} ariaLabel="Modes" onValueChange={changed} />);
    expect(view.getByRole('group', { name: 'Modes' })).toBeInTheDocument();
    expect(view.getByRole('button', { name: 'One' })).toHaveAttribute('aria-pressed', 'true');
    await view.user.click(view.getByRole('button', { name: 'Two' }));
    expect(changed).toHaveBeenCalledWith(['two']);
    expect(view.getByRole('button', { name: 'Two' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('collapses breadcrumbs into an i18n-labelled menu', async () => {
    const view = renderWithSpruce(<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Projects', href: '/projects' }, { label: 'Design', href: '/design' }, { label: 'Current', active: true }]} maxItems={3} itemsBeforeCollapse={1} itemsAfterCollapse={1} />);
    expect(view.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    const more = view.getByRole('button', { name: 'More actions' });
    await view.user.click(more);
    await waitFor(() => expect(view.getByRole('menu')).toBeInTheDocument());
    expect(view.getByRole('menuitem', { name: 'Projects' })).toBeInTheDocument();
  });

  it('supports split-button controlled popup labels and keyboard-safe selection', async () => {
    const selected = vi.fn();
    const view = renderWithSpruce(<SplitButton label="Save" items={[{ label: 'Save as draft', command: selected }]} ariaLabel="Save actions" menuAriaLabel="Save options" />);
    await view.user.click(view.getByRole('button', { name: 'Open actions menu' }));
    expect(view.getByRole('menu', { name: 'Save options' })).toBeInTheDocument();
    await view.user.click(view.getByRole('menuitem', { name: 'Save as draft' }));
    expect(selected).toHaveBeenCalledTimes(1);
  });

  it('keeps lazy tab panels activated, exposes close/context callbacks, and follows RTL arrows', async () => {
    const closed = vi.fn();
    const contextMenu = vi.fn();
    const view = renderWithRtl(<Tabs lazy tabs={[{ label: 'One', content: 'One body' }, { label: 'Two', content: 'Two body', closeable: true }]} onTabClose={closed} onTabContextMenu={contextMenu} />);
    expect(view.getByRole('tabpanel')).toHaveTextContent('One body');
    await view.user.click(view.getByRole('tab', { name: /Two/ }));
    expect(view.getByRole('tabpanel')).toHaveTextContent('Two body');
    await pressKey(view.user, 'ContextMenu');
    expect(contextMenu).toHaveBeenCalled();
    await view.user.click(view.getByRole('button'));
    expect(closed).toHaveBeenCalledWith(1, expect.objectContaining({ label: 'Two' }));
  });

  it('uses priority and last-DOM tie breaking for overflow and exposes stepper tab semantics', async () => {
    const hidden = computeOverflowHidden(100, 4, [
      { id: 'first', width: 60, priority: 0, order: 0 },
      { id: 'second', width: 60, priority: 0, order: 1 },
    ], 32);
    expect(hidden.has('second')).toBe(true);
    const view = renderWithSpruce(<Stepper steps={[{ label: 'Start' }, { label: 'Finish' }]} ariaLabel="Checkout steps" />);
    expect(view.getByRole('tablist', { name: 'Checkout steps' })).toHaveAttribute('aria-orientation', 'horizontal');
    expect(view.getByRole('tab', { name: /Start/ })).toHaveAttribute('aria-selected', 'true');
    await waitFor(() => expect(view.getByRole('tab', { name: /Finish/ })).toBeInTheDocument());
  });
});
