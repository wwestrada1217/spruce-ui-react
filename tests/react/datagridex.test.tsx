import { describe, expect, it, vi } from 'vitest';
import { Datagridex, type DatagridexColumn } from '../../src/index.js';
import {
  expectFocused,
  expectNoA11yViolations,
  renderWithSpruce,
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
});
