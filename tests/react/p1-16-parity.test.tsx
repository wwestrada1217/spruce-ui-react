import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import {
  AppHeader,
  AppShell,
  Fab,
  FilterExpression,
  Mention,
  Scrollbar,
  Splitter,
  SplitterPane,
} from '../../src/index.js';
import type { FilterGroup } from '../../src/index.js';
import { expectDocumentDirection, pressKey, renderWithRtl, renderWithSpruce } from '../utils/test-utils.js';

describe('P1.0-16 Angular parity', () => {
  it('keeps AppShell composable and shares RTL direction with its layout', () => {
    const view = renderWithRtl(
      <AppShell
        sidebar={<nav aria-label="Workspace navigation">Navigation</nav>}
        header={<AppHeader title="Workspace" />}
      >
        <p>Content</p>
      </AppShell>,
    );

    expect(view.getByRole('main')).toHaveTextContent('Content');
    expect(view.container.querySelector('.sp-app-shell')).toBeInTheDocument();
    expectDocumentDirection('rtl');
  });

  it('matches FAB plain and speed-dial event semantics and menu accessibility', async () => {
    const onFabClick = vi.fn();
    const onOpenChange = vi.fn();
    const onActionClick = vi.fn();
    const view = renderWithSpruce(
      <Fab
        position="none"
        onFabClick={onFabClick}
        onOpenChange={onOpenChange}
        onActionClick={onActionClick}
        actions={[{ id: 'share', icon: 'share', label: 'Share' }]}
      />,
    );

    const mainButton = view.getByRole('button', { name: 'Action' });
    const menu = view.getByRole('menu', { hidden: true });
    expect(menu).toHaveAttribute('aria-hidden', 'true');
    expect(view.getByRole('menuitem', { hidden: true })).toHaveAttribute('tabindex', '-1');

    await view.user.click(mainButton);
    expect(onFabClick).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(menu).toHaveAttribute('aria-hidden', 'false');
    expect(view.getByRole('menuitem', { name: 'Share' })).toBeInTheDocument();

    await view.user.click(view.getByRole('menuitem', { name: 'Share' }));
    expect(onActionClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'share' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    const plainView = renderWithSpruce(<Fab position="none" onFabClick={onFabClick} />);
    const plainButton = plainView.container.querySelector('button');
    if (!plainButton) throw new Error('Plain FAB button was not rendered');
    await plainView.user.click(plainButton);
    expect(onFabClick).toHaveBeenCalledTimes(1);
  });

  it('renders typed filter controls and supports nested group changes as a controlled tree', async () => {
    const fields = [
      { label: 'Age', value: 'age', type: 'number' as const },
      { label: 'Created', value: 'created', type: 'date' as const },
      { label: 'Active', value: 'active', type: 'boolean' as const },
    ];

    function Host() {
      const [expression, setExpression] = useState<FilterGroup>({
        type: 'group' as const,
        logic: 'and' as const,
        children: [{ type: 'rule' as const, field: 'age', operator: 'greaterThan', value: '' }],
      });
      return <FilterExpression fields={fields} expression={expression} onChange={setExpression} />;
    }

    const view = renderWithSpruce(<Host />, {
      providerProps: { labels: { opGreaterThan: 'Above localized' } },
    });
    expect(view.getByRole('spinbutton', { name: 'Value' })).toBeInTheDocument();
    expect(view.getByRole('group', { name: 'Filter' })).toBeInTheDocument();
    await view.user.click(view.getByRole('button', { name: 'Condition' }));
    expect(view.getByRole('option', { name: 'Above localized' })).toBeInTheDocument();
    await view.user.click(view.getByRole('option', { name: 'Above localized' }));

    await view.user.click(view.getByRole('button', { name: 'Group' }));
    expect(view.getAllByRole('group').length).toBeGreaterThan(2);
    expect(view.getAllByRole('button', { name: 'Remove' }).length).toBeGreaterThan(0);
  });

  it('localizes mention defaults, filters by description, and inserts through keyboard callbacks', async () => {
    const onValueChange = vi.fn();
    const onInsert = vi.fn();
    const onSearch = vi.fn();
    const view = renderWithRtl(
      <Mention
        items={[{ id: 'alice', label: 'Alice', description: 'Engineering' }]}
        onValueChange={onValueChange}
        onInsert={onInsert}
        onSearch={onSearch}
      />,
    );
    const textarea = view.getByRole('textbox', { name: 'إشارة' });
    expect(textarea).toHaveAttribute('placeholder', 'اكتب @ للإشارة إلى شخص...');
    expect(textarea).toHaveAttribute('dir', 'rtl');

    await view.user.type(textarea, '@Eng');
    expect(onSearch).toHaveBeenLastCalledWith('Eng');
    expect(view.getByRole('listbox', { name: 'اقتراحات الإشارات' })).toBeInTheDocument();
    await pressKey(view.user, 'Enter');

    expect(onValueChange).toHaveBeenLastCalledWith('@Alice ');
    expect(onInsert).toHaveBeenCalledWith(expect.objectContaining({
      item: expect.objectContaining({ id: 'alice' }),
      start: 0,
      end: 7,
    }));
    expectDocumentDirection('rtl');
  });

  it('supports native scroll attributes and all-axis overflow configuration', () => {
    const view = renderWithSpruce(
      <Scrollbar
        aria-label="Wide data"
        tabIndex={0}
        style={{ width: 100, height: 80, overflowX: 'auto' }}
      >
        <div style={{ width: 400, height: 200 }}>Data</div>
      </Scrollbar>,
    );
    const scrollRegion = view.container.querySelector('.sp-scrollbar');
    if (!scrollRegion) throw new Error('Scrollbar wrapper was not rendered');
    expect(scrollRegion).toHaveAttribute('tabindex', '0');
    expect(scrollRegion).toHaveStyle({ overflow: 'auto', overflowX: 'auto' });
  });

  it('supports splitter key increment, thin mode, controlled callbacks, and drag lifecycle', async () => {
    const onSizeChange = vi.fn();
    const onDragStart = vi.fn();
    const onDragEnd = vi.fn();
    const view = renderWithSpruce(
      <Splitter
        initialSizes={[50, 50]}
        keyIncrement={10}
        thin
        ariaLabel="Inspector split view"
        onSizeChange={onSizeChange}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SplitterPane><div>Left</div></SplitterPane>
        <SplitterPane><div>Right</div></SplitterPane>
      </Splitter>,
    );
    const root = view.getByRole('group', { name: 'Inspector split view' });
    expect(root).toHaveClass('sp-splitter--thin');
    const gutter = view.getByRole('separator', { name: 'Split 1' });
    expect(gutter).toHaveAttribute('aria-valuenow', '50');

    gutter.focus();
    await pressKey(view.user, 'ArrowRight');
    expect(onSizeChange).toHaveBeenLastCalledWith([60, 40]);

    Object.defineProperty(root, 'offsetWidth', { configurable: true, value: 1000 });
    fireEvent.mouseDown(gutter, { clientX: 100 });
    expect(onDragStart).toHaveBeenCalledTimes(1);
    fireEvent.mouseMove(window, { clientX: 200 });
    fireEvent.mouseUp(window);
    expect(onDragEnd).toHaveBeenCalledTimes(1);
  });

  it('keeps splitter logical keyboard behavior and token surfaces in RTL and dark themes', async () => {
    const onSizeChange = vi.fn();
    const rtlView = renderWithRtl(
      <Splitter initialSizes={[50, 50]} keyIncrement={10} onSizeChange={onSizeChange}>
        <SplitterPane><div>Right-to-left first pane</div></SplitterPane>
        <SplitterPane><div>Right-to-left second pane</div></SplitterPane>
      </Splitter>,
    );
    const rtlGutter = rtlView.getByRole('separator', { name: 'تقسيم 1' });
    rtlGutter.focus();
    await pressKey(rtlView.user, 'ArrowLeft');
    expect(onSizeChange).toHaveBeenLastCalledWith([60, 40]);
    expectDocumentDirection('rtl');

    const darkView = renderWithSpruce(
      <>
        <Fab position="none" />
        <Scrollbar style={{ height: 40 }}><span>Dark scroll surface</span></Scrollbar>
        <Splitter><SplitterPane>One</SplitterPane><SplitterPane>Two</SplitterPane></Splitter>
      </>,
      { providerProps: { defaultTheme: 'dark' } },
    );
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(darkView.container.querySelector('.sp-fab')).toBeInTheDocument();
    expect(darkView.container.querySelector('.sp-scrollbar')).toBeInTheDocument();
    expect(darkView.container.querySelector('.sp-splitter')).toBeInTheDocument();
  });
});
