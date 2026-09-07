import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { Datagrid, type DatagridColumn } from '../../src/index.js';
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

const columns: readonly DatagridColumn<Person>[] = [
  { key: 'name', header: 'Name', resizable: false, sortable: false, editable: true },
  { key: 'age', header: 'Age', resizable: false, sortable: false, editable: true },
];

const filterColumns: readonly DatagridColumn<Person>[] = [
  { key: 'name', header: 'Name', filterable: true, filterVariant: 'dynamic', filterDataType: 'text' },
];

function ControlledRowDetailsGrid() {
  const [expandedRows, setExpandedRows] = useState<readonly Person[]>([]);

  return (
    <Datagrid<Person>
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
    <Datagrid<Person>
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
    <Datagrid<Person>
      rows={rows}
      columns={columns}
      groupBy={groupBy}
      onGroupByChange={setGroupBy}
      groupSorting
      showGroupToolbar
    />
  );
}

describe('Datagrid', () => {
  it('uses the Spruce Input for global search', () => {
    const { container, getByRole } = renderWithSpruce(
      <Datagrid<Person> ariaLabel="People" rows={rows} columns={columns} searchable />,
    );

    const search = getByRole('searchbox', { name: 'Search' });
    expect(search).toHaveClass('sp-input-wrap__field');
    expect(search.closest('.sp-input-wrap')).toHaveClass('sp-datagrid__search');
    expect(container.querySelector('.sp-datagrid__search-group')).not.toBeInTheDocument();
  });

  it('uses Spruce controls for the dynamic filter popover', async () => {
    const { container, getByRole, getByLabelText, queryByRole, user } = renderWithSpruce(
      <Datagrid<Person> ariaLabel="People" rows={rows} columns={filterColumns} />,
    );

    await user.click(getByRole('button', { name: 'Filter Name' }));

    expect(getByRole('button', { name: 'Condition' })).toBeInTheDocument();
    expect(getByLabelText('Value')).toBeInTheDocument();
    expect(container.querySelector('select')).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'Clear' })).toBeInTheDocument();
    expect(queryByRole('button', { name: 'Apply' })).toBeInTheDocument();

    await user.click(getByRole('button', { name: 'Condition' }));
    await user.click(getByRole('option', { name: 'Between' }));

    expect(getByLabelText('And')).toBeInTheDocument();
  });

  it('renders the typed grid contract and supports keyboard cell navigation', async () => {
    const { container, getByRole, getAllByRole, user } = renderWithSpruce(
      <Datagrid<Person> ariaLabel="People" rows={rows} columns={columns} editMode="cell" />,
    );
    const grid = getByRole('grid', { name: 'People' });
    expect(grid).toBeInTheDocument();
    const dataRows = getAllByRole('row').filter((row: HTMLElement) => row.classList.contains('sp-datagrid__body-row'));
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
      <Datagrid<Person> rows={rows} columns={columns} selectionMode="multiple" />,
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
      <Datagrid<Person>
        rows={rows}
        columns={columns}
        groupBy={['age']}
        groupsExpandedByDefault
        groupSelection
        selectionMode="multiple"
      />,
    );
    const groupCell = container.querySelector<HTMLElement>('.sp-datagrid__group-cell--with-selection');
    const groupToggle = groupCell?.querySelector<HTMLButtonElement>('.sp-datagrid__group-toggle');
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
    const toolbar = container.querySelector<HTMLElement>('.sp-datagrid__group-toolbar');
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
      container.querySelectorAll<HTMLButtonElement>('.sp-datagrid__toolbar-group-button'),
    );
    const dataTransfer = {
      dropEffect: '',
      effectAllowed: '',
      getData: vi.fn().mockReturnValue('age'),
      setData: vi.fn(),
    };
    const source = groupButtons()[1]!;
    const target = groupButtons()[0]!.closest<HTMLElement>('.sp-datagrid__toolbar-group')!;

    fireEvent.dragStart(source, { dataTransfer });
    expect(source.closest('.sp-datagrid__toolbar-group')).toHaveClass('sp-datagrid__toolbar-group--dragging');
    fireEvent.dragOver(target, { dataTransfer });
    expect(target).toHaveClass('sp-datagrid__toolbar-group--drop-before');
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
    const editableColumns: readonly DatagridColumn<Person>[] = [
      { key: 'name', header: 'Name', resizable: false, editable: true, required: 'Name is required.' },
      { key: 'age', header: 'Age', resizable: false, sortable: false },
    ];
    const onValidationFailed = vi.fn();
    const { getByRole, user } = renderWithSpruce(
      <Datagrid<Person>
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
      <Datagrid<Person>
        rows={rows}
        columns={columns}
        columnPins={{ name: 'right' }}
      />,
      { providerProps: { locale: 'ar', direction: 'rtl', labels: { dataGrid: 'شبكة الأشخاص' } } },
    );

    expect(getByRole('grid', { name: 'شبكة الأشخاص' })).toBeInTheDocument();
    expect(container.querySelector('.sp-datagrid__header-cell--pinned-right')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
  });

  it('applies sticky offsets to pinned headers and cells', async () => {
    const { container } = renderWithSpruce(
      <Datagrid<Person>
        rows={rows}
        columns={columns}
        selectionMode="multiple"
        columnPins={{ name: 'left', age: 'right' }}
      />,
    );

    const nameHeader = container.querySelector<HTMLElement>('[data-sp-datagrid-column="name"]');
    const ageHeader = container.querySelector<HTMLElement>('[data-sp-datagrid-column="age"]');
    const nameCell = container.querySelector<HTMLElement>('[data-sp-datagrid-cell="name"]');
    const ageCell = container.querySelector<HTMLElement>('[data-sp-datagrid-cell="age"]');

    await waitFor(() => {
      expect(nameHeader?.style.insetInlineStart).toBe('40px');
      expect(ageHeader?.style.insetInlineEnd).toBe('0px');
      expect(nameCell?.style.insetInlineStart).toBe('40px');
      expect(ageCell?.style.insetInlineEnd).toBe('0px');
    });
  });

  it('sizes default columns to intrinsic content', () => {
    const { container } = renderWithSpruce(
      <Datagrid<Person> rows={rows} columns={columns} />,
    );

    expect(container.querySelector<HTMLElement>('.sp-datagrid__grid')?.style.gridTemplateColumns)
      .toBe('minmax(min-content, max-content) minmax(min-content, max-content) minmax(0, 1fr)');
    expect(container.querySelector('.sp-datagrid__header-cell--filler')).toBeInTheDocument();
  });

  it('does not add a filler track when columns already fit the grid width', () => {
    const { container } = renderWithSpruce(
      <Datagrid<Person> rows={rows} columns={columns} fitColumnsToWidth />,
    );

    expect(container.querySelector<HTMLElement>('.sp-datagrid__grid')?.style.gridTemplateColumns)
      .toBe('minmax(min-content, 1fr) minmax(min-content, 1fr)');
    expect(container.querySelector('.sp-datagrid__header-cell--filler')).not.toBeInTheDocument();
  });

  it('preserves explicit column widths while filling remaining grid space', () => {
    const fixedColumns: readonly DatagridColumn<Person>[] = [
      { key: 'name', header: 'Name', width: 120, resizable: false, sortable: false },
      { key: 'age', header: 'Age', width: 160, resizable: false, sortable: false },
    ];
    const { container } = renderWithSpruce(
      <Datagrid<Person> rows={rows} columns={fixedColumns} />,
    );

    expect(container.querySelector<HTMLElement>('.sp-datagrid__grid')?.style.gridTemplateColumns)
      .toBe('120px 160px minmax(0, 1fr)');
  });

  it('uses shared dropdown and popover overlays for column controls', async () => {
    const { getByRole, user } = renderWithSpruce(
      <Datagrid<Person> rows={rows} columns={columns} toolbar columnMenu columnSelector />,
    );

    const menuTrigger = getByRole('button', { name: 'Column menu for Name' });
    expect(menuTrigger).toHaveClass('sp-btn--ghost');
    expect(menuTrigger.closest('.sp-dropdown-trigger')).toBeInTheDocument();

    await user.click(menuTrigger);
    await waitFor(() => expect(getByRole('menu')).toBeInTheDocument());
    expect(getByRole('button', { name: 'Auto-size Column' })).toBeInTheDocument();
    expect(document.querySelector('.sp-datagrid__column-menu-panel')).not.toBeInTheDocument();

    await user.click(getByRole('button', { name: 'Columns' }));
    await waitFor(() => expect(getByRole('dialog', { name: 'Columns' })).toBeInTheDocument());
    expect(document.querySelector('.sp-popover-panel.sp-datagrid__column-selector-popover')).not.toBeNull();
  });

  it('renders row spans with accessible span metadata and omits covered cells', () => {
    const spanColumns: readonly DatagridColumn<Person>[] = [
      { key: 'name', header: 'Name', resizable: false, sortable: false, rowSpan: 2 },
      { key: 'age', header: 'Age', resizable: false, sortable: false },
    ];
    const { container } = renderWithSpruce(<Datagrid<Person> rows={rows} columns={spanColumns} />);
    const dataRows = container.querySelectorAll('.sp-datagrid__body-row:not(.sp-datagrid__body-row--new)');
    const nameCells = [...dataRows].flatMap((row) => [...row.querySelectorAll('[role="gridcell"]')]).filter((cell) => cell.textContent?.includes('Ada') || cell.textContent?.includes('Grace'));

    expect(dataRows).toHaveLength(2);
    expect(container.querySelector('[aria-rowspan="2"]')).toBeInTheDocument();
    expect(nameCells.filter((cell) => cell.textContent?.includes('Grace'))).toHaveLength(0);
  });

  it('keeps cells after a covered row-span column in their declared grid tracks', () => {
    const spanColumns: readonly DatagridColumn<Person>[] = [
      { key: 'name', header: 'Name', resizable: false, sortable: false },
      { key: 'age', header: 'Age', resizable: false, sortable: false, rowSpan: 2 },
      { key: 'id', header: 'ID', resizable: false, sortable: false },
    ];
    const { container } = renderWithSpruce(<Datagrid<Person> rows={rows} columns={spanColumns} />);
    const dataRows = container.querySelectorAll('.sp-datagrid__body-row:not(.sp-datagrid__body-row--new)');
    const secondRowIdCell = dataRows[1]?.querySelector<HTMLElement>('[data-sp-datagrid-cell="id"]');

    expect(secondRowIdCell).toHaveStyle({ gridColumn: '3' });
  });

  it('requests virtual pages through the controlled paging callback', async () => {
    const onVirtualPageRequest = vi.fn();
    const onPageSizeChange = vi.fn();
    const { getByRole, user } = renderWithSpruce(
      <Datagrid<Person>
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
      <Datagrid<Person> rows={rows} columns={columns} rowReorder pagination />,
    );

    expect(getByRole('button', { name: /Drag handle: Row 1/i })).toBeDisabled();
  });

  it('applies current shell, density, height, line, resize, reorder, and null-display options', () => {
    interface NullablePerson { id: number; name: string | null; age: number }
    const nullableRows: readonly NullablePerson[] = [{ id: 1, name: null, age: 36 }];
    const nullableColumns: readonly DatagridColumn<NullablePerson>[] = [
      { key: 'name', header: 'Name', resizable: true },
      { key: 'age', header: 'Age' },
    ];
    const { container, getByText } = renderWithSpruce(
      <Datagrid<NullablePerson>
        rows={nullableRows}
        columns={nullableColumns}
        chrome="elevated"
        radius="lg"
        border="strong"
        density="comfortable"
        autoRowHeight
        headerTextCase="default"
        nullText="Not provided"
        borderless
        showColumnLines={false}
        rowHover={false}
        columnResizeMode="deferred"
        columnReorderMode="live"
      />,
    );

    const grid = container.querySelector('.sp-datagrid');
    expect(grid).toHaveClass(
      'sp-chrome--elevated',
      'sp-radius--lg',
      'sp-border--strong',
      'sp-datagrid--density-comfortable',
      'sp-datagrid--auto-row-height',
      'sp-datagrid--header-default',
      'sp-datagrid--borderless',
      'sp-datagrid--no-row-hover',
      'sp-datagrid--resize-deferred',
      'sp-datagrid--reorder-live',
      'sp-datagrid--without-vertical-lines',
    );
    expect(getByText('Not provided')).toHaveClass('sp-datagrid__cell--null');
  });

  it('supports row/cell hooks, callbacks, skeletons, and hidden selection controls', async () => {
    const onRowClick = vi.fn();
    const onRowDoubleClick = vi.fn();
    const onCellClick = vi.fn();
    const rendered = renderWithSpruce(
      <Datagrid<Person>
        rows={rows}
        columns={columns}
        selectionMode="multiple"
        hideSelectionColumn
        rowClassName={(row) => row.id === 1 ? 'first-row' : ''}
        cellClassName={({ column }) => column.key === 'name' ? 'name-cell' : ''}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}
        onCellClick={onCellClick}
      />,
    );
    const adaCell = rendered.getByRole('gridcell', { name: 'Ada' });
    expect(adaCell).toHaveClass('name-cell');
    expect(adaCell.closest('[role="row"]')).toHaveClass('first-row');
    expect(rendered.queryByRole('checkbox')).not.toBeInTheDocument();
    await rendered.user.click(adaCell);
    expect(onCellClick).toHaveBeenCalledWith(expect.objectContaining({ row: rows[0], column: columns[0] }));
    expect(onRowClick).toHaveBeenCalledWith(expect.objectContaining({ row: rows[0] }));
    await rendered.user.dblClick(adaCell);
    expect(onRowDoubleClick).toHaveBeenCalledWith(expect.objectContaining({ row: rows[0] }));
    rendered.unmount();

    const loading = renderWithSpruce(
      <Datagrid<Person> rows={[]} columns={columns} loading loadingMode="skeleton" skeletonRowCount={3} />,
    );
    expect(loading.container.querySelectorAll('.sp-datagrid__skeleton-row')).toHaveLength(3);
  });

  it('loads server-windowed rows and renders tree children with the canonical grid', async () => {
    const source = {
      read: vi.fn(async () => ({
        pageNumber: 1,
        pageSize: 25,
        totalPages: 1,
        totalRecords: rows.length,
        data: [...rows],
        hasPrevious: false,
        hasNext: false,
      })),
      getById: vi.fn(async (id: string) => rows.find((row) => String(row.id) === id) ?? rows[0]!),
      search: vi.fn(async () => ({
        pageNumber: 1,
        pageSize: 25,
        totalPages: 1,
        totalRecords: rows.length,
        data: [...rows],
        hasPrevious: false,
        hasNext: false,
      })),
    };
    const remote = renderWithSpruce(
      <Datagrid<Person> dataSource={source} columns={columns} virtualDataSourceWindow virtualScrollHeight={120} />,
    );
    await waitFor(() => expect(remote.getByRole('gridcell', { name: 'Ada' })).toBeInTheDocument());
    expect(source.read).toHaveBeenCalledWith(expect.objectContaining({ custom: expect.objectContaining({ start: 0 }) }));
    remote.unmount();

    interface TreePerson extends Person { children?: readonly TreePerson[] }
    const treeRows: readonly TreePerson[] = [{ id: 1, name: 'Parent', age: 36, children: [{ id: 2, name: 'Child', age: 10 }] }];
    const treeColumns: readonly DatagridColumn<TreePerson>[] = [
      { key: 'name', header: 'Name' },
      { key: 'age', header: 'Age' },
    ];
    const tree = renderWithSpruce(
      <Datagrid<TreePerson> rows={treeRows} columns={treeColumns} treeChildrenField="children" treeExpandedByDefault />,
    );
    await waitFor(() => expect(tree.getByText('Child')).toBeInTheDocument());
    expect(tree.getAllByRole('grid')).toHaveLength(2);
  });

  it.each(['light', 'dark'] as const)('uses design tokens in the %s theme', async (theme: 'light' | 'dark') => {
    const { getByRole } = renderWithTheme(
      <Datagrid<Person> rows={rows} columns={columns} ariaLabel={`${theme} people`} />,
      theme,
    );

    expect(getByRole('grid', { name: `${theme} people` })).toBeInTheDocument();
    await waitFor(() => expectDocumentTheme(theme));
  });
});
