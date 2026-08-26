import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { Datagridex, type DatagridexColumn } from '../../src/index.js';
import {
  expectFocused,
  expectNoA11yViolations,
  expectDocumentTheme,
  renderWithSpruce,
  renderWithTheme,
  waitFor,
} from '../utils/test-utils.js';

interface Person {
  id: number;
  name: string;
  age: number;
}

const rows: readonly Person[] = [
  { id: 1, name: 'Ada', age: 36 },
  { id: 2, name: 'Grace', age: 28 },
];

const columns: readonly DatagridexColumn<Person>[] = [
  { key: 'name', header: 'Name', resizable: false, sortable: false, editable: true },
  { key: 'age', header: 'Age', resizable: false, sortable: false, editable: true },
];

function ControlledRowDetailsGrid() {
  const [expandedRows, setExpandedRows] = useState<readonly Person[]>([]);

  return (
    <Datagridex<Person>
      rows={rows}
      columns={columns}
      rowDetails
      expandedRows={expandedRows}
      onExpandedRowsChange={setExpandedRows}
      rowDetail={({ row }) => <span>{row.name} details</span>}
    />
  );
}

function ControlledDetailPaneGrid() {
  const [detailPaneRow, setDetailPaneRow] = useState<Person | null>(rows[0]!);

  return (
    <Datagridex<Person>
      rows={rows}
      columns={columns}
      detailPane
      detailPaneRow={detailPaneRow}
      onDetailPaneRowChange={setDetailPaneRow}
      detailPaneRenderer={({ row }) => <span>{row.name} pane</span>}
    />
  );
}

function ControlledGroupingGrid({ initialGroupBy = ['age'] }: { initialGroupBy?: readonly string[] }) {
  const [groupBy, setGroupBy] = useState<readonly string[]>(initialGroupBy);

  return (
    <Datagridex<Person>
      rows={rows}
      columns={columns}
      groupBy={groupBy}
      onGroupByChange={setGroupBy}
      groupSorting
      showGroupToolbar
    />
  );
}

describe('Datagridex', () => {
  it('renders the typed grid contract and supports keyboard cell navigation', async () => {
    const { container, getByRole, getAllByRole, user } = renderWithSpruce(
      <Datagridex<Person> ariaLabel="People" rows={rows} columns={columns} editMode="cell" />,
    );
    const grid = getByRole('grid', { name: 'People' });
    expect(grid).toBeInTheDocument();
    const dataRows = getAllByRole('row').filter((row: HTMLElement) => row.classList.contains('sp-datagridex__body-row'));
    const firstRowCells = getAllByRole('gridcell').filter((cell: HTMLElement) => cell.closest('[role="row"]') === dataRows[0]);
    const firstCell = firstRowCells[0]!;
    const secondCell = firstRowCells[1]!;
    expect(getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(getByRole('gridcell', { name: 'Ada' })).toBeInTheDocument();
    firstCell.focus();
    expectFocused(firstCell);
    await user.keyboard('{ArrowRight}');
    await waitFor(() => expectFocused(secondCell));
    await expectNoA11yViolations(container);
  });

  it('renders selected and indeterminate checkbox states', async () => {
    const { container, getAllByRole, user } = renderWithSpruce(
      <Datagridex<Person> rows={rows} columns={columns} selectionMode="multiple" />,
    );
    const checkboxes = getAllByRole('checkbox') as HTMLInputElement[];
    const headerCheckbox = checkboxes[0]!;
    const firstRowCheckbox = checkboxes[1]!;
    const secondRowCheckbox = checkboxes[2]!;

    await user.click(firstRowCheckbox);
    await waitFor(() => {
      expect(firstRowCheckbox).toBeChecked();
      expect(headerCheckbox).toHaveProperty('indeterminate', true);
      expect(headerCheckbox.closest('.sp-checkbox')).toHaveClass('sp-checkbox--indeterminate');
      expect(container.querySelector('.sp-checkbox--indeterminate .sp-icon')).toBeInTheDocument();
    });

    await user.click(secondRowCheckbox);
    await waitFor(() => {
      expect(headerCheckbox).toBeChecked();
      expect(headerCheckbox.closest('.sp-checkbox')).toHaveClass('sp-checkbox--checked');
      expect(container.querySelectorAll('.sp-checkbox--checked .sp-icon')).toHaveLength(3);
    });
  });

  it('keeps grouped-row expansion controls separate from group selection', async () => {
    const { container, user } = renderWithSpruce(
      <Datagridex<Person>
        rows={rows}
        columns={columns}
        groupBy={['age']}
        groupsExpandedByDefault
        groupSelection
        selectionMode="multiple"
      />,
    );
    const groupCell = container.querySelector<HTMLElement>('.sp-datagridex__group-cell--with-selection');
    const groupToggle = groupCell?.querySelector<HTMLButtonElement>('.sp-datagridex__group-toggle');
    const groupCheckbox = groupCell?.querySelector<HTMLInputElement>('input[type="checkbox"]');

    expect(groupCell).toBeInTheDocument();
    expect(groupToggle).toBeInTheDocument();
    expect(groupCheckbox).toBeInTheDocument();

    await user.click(groupToggle!);
    expect(groupCell?.closest('[role="row"]')).toHaveAttribute('aria-expanded', 'false');
    expect(groupCheckbox).not.toBeChecked();
  });

  it('removes a controlled grouping when its toolbar button is clicked', async () => {
    const { getByRole, queryByRole, getByText, user } = renderWithSpruce(<ControlledGroupingGrid />);
    const removeButton = getByRole('button', { name: 'Remove grouping by Age' });

    await user.click(removeButton);
    await waitFor(() => {
      expect(queryByRole('button', { name: 'Remove grouping by Age' })).not.toBeInTheDocument();
      expect(getByText('Drag column headers here to group')).toBeInTheDocument();
    });
  });

  it('adds a controlled grouping when a column header is dropped on the toolbar', async () => {
    const { container, getByRole } = renderWithSpruce(
      <ControlledGroupingGrid initialGroupBy={[]} />,
    );
    const header = getByRole('columnheader', { name: 'Name' });
    const toolbar = container.querySelector<HTMLElement>('.sp-datagridex__group-toolbar');
    const dataTransfer = {
      effectAllowed: '',
      getData: vi.fn().mockReturnValue('name'),
      setData: vi.fn(),
    };

    expect(toolbar).toBeInTheDocument();
    fireEvent.dragStart(header, { dataTransfer });
    fireEvent.dragOver(toolbar!, { dataTransfer });
    fireEvent.drop(toolbar!, { dataTransfer });

    await waitFor(() => expect(getByRole('button', { name: 'Remove grouping by Name' })).toBeInTheDocument());
  });

  it('reorders controlled grouping when a toolbar group button is dragged', async () => {
    const { container } = renderWithSpruce(
      <ControlledGroupingGrid initialGroupBy={['name', 'age']} />,
    );
    const groupButtons = () => Array.from(
      container.querySelectorAll<HTMLButtonElement>('.sp-datagridex__toolbar-group-button'),
    );
    const dataTransfer = {
      dropEffect: '',
      effectAllowed: '',
      getData: vi.fn().mockReturnValue('age'),
      setData: vi.fn(),
    };
    const source = groupButtons()[1]!;
    const target = groupButtons()[0]!.closest<HTMLElement>('.sp-datagridex__toolbar-group')!;

    fireEvent.dragStart(source, { dataTransfer });
    expect(source.closest('.sp-datagridex__toolbar-group')).toHaveClass('sp-datagridex__toolbar-group--dragging');
    fireEvent.dragOver(target, { dataTransfer });
    expect(target).toHaveClass('sp-datagridex__toolbar-group--drop-before');
    fireEvent.drop(target, { dataTransfer });

    await waitFor(() => {
      expect(groupButtons().map((button) => button.getAttribute('aria-label')?.split(' grouping')[0])).toEqual(['Age', 'Name']);
    });
  });

  it('expands and collapses controlled row details when expanded rows are row objects', async () => {
    const { getAllByRole, getByText, queryByText, user } = renderWithSpruce(<ControlledRowDetailsGrid />);
    const toggle = getAllByRole('button', { name: 'Toggle row details' })[0]!;

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    await waitFor(() => {
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      expect(getByText('Ada details')).toBeInTheDocument();
    });

    await user.click(toggle);
    await waitFor(() => expect(queryByText('Ada details')).not.toBeInTheDocument());
  });

  it('closes a controlled detail pane through its close button', async () => {
    const { getAllByRole, queryByText, user } = renderWithSpruce(<ControlledDetailPaneGrid />);

    expect(queryByText('Ada pane')).toBeInTheDocument();
    await user.click(getAllByRole('button', { name: 'Close' })[0]!);
    await waitFor(() => expect(queryByText('Ada pane')).not.toBeInTheDocument());
  });

  it('shows validation feedback when an edited required cell is committed empty', async () => {
    const editableColumns: readonly DatagridexColumn<Person>[] = [
      { key: 'name', header: 'Name', resizable: false, editable: true, required: 'Name is required.' },
      { key: 'age', header: 'Age', resizable: false, sortable: false },
    ];
    const onValidationFailed = vi.fn();
    const { getByRole, user } = renderWithSpruce(
      <Datagridex<Person>
        ariaLabel="Editable people"
        rows={rows}
        columns={editableColumns}
        editMode="cell"
        preventInvalidCommit
        onCellValidationFailed={onValidationFailed}
      />,
    );
    const nameCell = getByRole('gridcell', { name: 'Ada' });

    await user.dblClick(nameCell);
    const editor = getByRole('textbox');
    await user.clear(editor);
    await user.keyboard('{Enter}');
    expect(onValidationFailed).toHaveBeenCalledWith(expect.objectContaining({
      key: 'name',
      errors: [{ rule: 'required', message: 'Name is required.' }],
    }));
  });

  it('uses provider labels and logical pinned offsets in RTL', () => {
    const { getByRole, container } = renderWithSpruce(
      <Datagridex<Person>
        rows={rows}
        columns={columns}
        columnPins={{ name: 'right' }}
      />,
      { providerProps: { locale: 'ar', direction: 'rtl', labels: { dataGrid: 'شبكة الأشخاص' } } },
    );

    expect(getByRole('grid', { name: 'شبكة الأشخاص' })).toBeInTheDocument();
    expect(container.querySelector('.sp-datagridex__header-cell--pinned-right')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
  });

  it('applies sticky offsets to pinned headers and cells', async () => {
    const { container } = renderWithSpruce(
      <Datagridex<Person>
        rows={rows}
        columns={columns}
        selectionMode="multiple"
        columnPins={{ name: 'left', age: 'right' }}
      />,
    );

    const nameHeader = container.querySelector<HTMLElement>('[data-sp-datagridex-column="name"]');
    const ageHeader = container.querySelector<HTMLElement>('[data-sp-datagridex-column="age"]');
    const nameCell = container.querySelector<HTMLElement>('[data-sp-datagridex-cell="name"]');
    const ageCell = container.querySelector<HTMLElement>('[data-sp-datagridex-cell="age"]');

    await waitFor(() => {
      expect(nameHeader?.style.insetInlineStart).toBe('40px');
      expect(ageHeader?.style.insetInlineEnd).toBe('0px');
      expect(nameCell?.style.insetInlineStart).toBe('40px');
      expect(ageCell?.style.insetInlineEnd).toBe('0px');
    });
  });

  it('sizes default columns to intrinsic content', () => {
    const { container } = renderWithSpruce(
      <Datagridex<Person> rows={rows} columns={columns} />,
    );

    expect(container.querySelector<HTMLElement>('.sp-datagridex__grid')?.style.gridTemplateColumns)
      .toBe('minmax(min-content, max-content) minmax(min-content, max-content)');
  });

  it('uses shared dropdown and popover overlays for column controls', async () => {
    const { getByRole, user } = renderWithSpruce(
      <Datagridex<Person> rows={rows} columns={columns} toolbar columnMenu columnSelector />,
    );

    const menuTrigger = getByRole('button', { name: 'Column menu for Name' });
    expect(menuTrigger).toHaveClass('sp-btn--ghost');
    expect(menuTrigger.closest('.sp-dropdown-trigger')).toBeInTheDocument();

    await user.click(menuTrigger);
    await waitFor(() => expect(getByRole('menu')).toBeInTheDocument());
    expect(getByRole('button', { name: 'Auto-size Column' })).toBeInTheDocument();
    expect(document.querySelector('.sp-datagridex__column-menu-panel')).not.toBeInTheDocument();

    await user.click(getByRole('button', { name: 'Columns' }));
    await waitFor(() => expect(getByRole('dialog', { name: 'Columns' })).toBeInTheDocument());
    expect(document.querySelector('.sp-popover-panel.sp-datagridex__column-selector-popover')).not.toBeNull();
  });

  it('renders row spans with accessible span metadata and omits covered cells', () => {
    const spanColumns: readonly DatagridexColumn<Person>[] = [
      { key: 'name', header: 'Name', resizable: false, sortable: false, rowSpan: 2 },
      { key: 'age', header: 'Age', resizable: false, sortable: false },
    ];
    const { container } = renderWithSpruce(<Datagridex<Person> rows={rows} columns={spanColumns} />);
    const dataRows = container.querySelectorAll('.sp-datagridex__body-row:not(.sp-datagridex__body-row--new)');
    const nameCells = [...dataRows].flatMap((row) => [...row.querySelectorAll('[role="gridcell"]')]).filter((cell) => cell.textContent?.includes('Ada') || cell.textContent?.includes('Grace'));

    expect(dataRows).toHaveLength(2);
    expect(container.querySelector('[aria-rowspan="2"]')).toBeInTheDocument();
    expect(nameCells.filter((cell) => cell.textContent?.includes('Grace'))).toHaveLength(0);
  });

  it('keeps cells after a covered row-span column in their declared grid tracks', () => {
    const spanColumns: readonly DatagridexColumn<Person>[] = [
      { key: 'name', header: 'Name', resizable: false, sortable: false },
      { key: 'age', header: 'Age', resizable: false, sortable: false, rowSpan: 2 },
      { key: 'id', header: 'ID', resizable: false, sortable: false },
    ];
    const { container } = renderWithSpruce(<Datagridex<Person> rows={rows} columns={spanColumns} />);
    const dataRows = container.querySelectorAll('.sp-datagridex__body-row:not(.sp-datagridex__body-row--new)');
    const secondRowIdCell = dataRows[1]?.querySelector<HTMLElement>('[data-sp-datagridex-cell="id"]');

    expect(secondRowIdCell).toHaveStyle({ gridColumn: '3' });
  });

  it('requests virtual pages through the controlled paging callback', async () => {
    const onVirtualPageRequest = vi.fn();
    const onPageSizeChange = vi.fn();
    const { getByRole, user } = renderWithSpruce(
      <Datagridex<Person>
        rows={rows}
        columns={columns}
        virtualPaging
        virtualPage={1}
        virtualTotalRows={100}
        virtualHasNextPage
        onVirtualPageRequest={onVirtualPageRequest}
        pageSizeOptions={[25, 50]}
        onPageSizeChange={onPageSizeChange}
      />,
    );

    await user.click(getByRole('button', { name: 'Next page' }));
    expect(onVirtualPageRequest).toHaveBeenCalledWith(expect.objectContaining({ page: 2, pageSize: 25, direction: 'next', trigger: 'button' }));
    await user.selectOptions(getByRole('combobox'), '50');
    expect(onPageSizeChange).toHaveBeenCalledWith(50);
  });

  it('disables row reorder controls when the visible order is transformed', () => {
    const { getByRole } = renderWithSpruce(
      <Datagridex<Person> rows={rows} columns={columns} rowReorder pagination />,
    );

    expect(getByRole('button', { name: /Drag handle: Row 1/i })).toBeDisabled();
  });

  it.each(['light', 'dark'] as const)('uses design tokens in the %s theme', async (theme: 'light' | 'dark') => {
    const { getByRole } = renderWithTheme(
      <Datagridex<Person> rows={rows} columns={columns} ariaLabel={`${theme} people`} />,
      theme,
    );

    expect(getByRole('grid', { name: `${theme} people` })).toBeInTheDocument();
    await waitFor(() => expectDocumentTheme(theme));
  });
});
