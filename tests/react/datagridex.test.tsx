import { describe, expect, it, vi } from 'vitest';
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

describe('Datagridex', () => {
  it('renders the typed grid contract and supports keyboard cell navigation', async () => {
    const { container, getByRole, getAllByRole, user } = renderWithSpruce(
      <Datagridex<Person> ariaLabel="People" rows={rows} columns={columns} editMode="cell" />,
    );
    const grid = getByRole('grid', { name: 'People' });
    const dataRows = getAllByRole('row').filter((row) => row.classList.contains('sp-datagridex__row'));
    const firstRowCells = getAllByRole('gridcell').filter((cell) => cell.closest('[role="row"]') === dataRows[0]);
    const firstCell = firstRowCells[0];
    const secondCell = firstRowCells[1];

    expect(grid).toHaveAttribute('aria-rowcount', '2');
    expect(getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(getByRole('gridcell', { name: 'Ada' })).toBeInTheDocument();
    firstCell.focus();
    expectFocused(firstCell);
    await user.keyboard('{ArrowRight}');
    await waitFor(() => expectFocused(secondCell));
    await expectNoA11yViolations(container);
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

  it('renders row spans with accessible span metadata and omits covered cells', () => {
    const spanColumns: readonly DatagridexColumn<Person>[] = [
      { key: 'name', header: 'Name', resizable: false, sortable: false, rowSpan: 2 },
      { key: 'age', header: 'Age', resizable: false, sortable: false },
    ];
    const { container } = renderWithSpruce(<Datagridex<Person> rows={rows} columns={spanColumns} />);
    const dataRows = container.querySelectorAll('.sp-datagridex__row');
    const nameCells = [...dataRows].flatMap((row) => [...row.querySelectorAll('[role="gridcell"]')]).filter((cell) => cell.textContent?.includes('Ada') || cell.textContent?.includes('Grace'));

    expect(dataRows).toHaveLength(2);
    expect(container.querySelector('[aria-rowspan="2"]')).toBeInTheDocument();
    expect(nameCells.filter((cell) => cell.textContent?.includes('Grace'))).toHaveLength(0);
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

  it.each(['light', 'dark'] as const)('uses design tokens in the %s theme', (theme) => {
    const { getByRole } = renderWithTheme(
      <Datagridex<Person> rows={rows} columns={columns} ariaLabel={`${theme} people`} />,
      theme,
    );

    expect(getByRole('grid', { name: `${theme} people` })).toBeInTheDocument();
    expectDocumentTheme(theme);
  });
});
