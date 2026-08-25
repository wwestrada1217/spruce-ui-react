import { describe, expect, it, vi } from 'vitest';
import { Checkbox, Combobox, GridCombobox, Range, Select, Slider } from '../../src/index.js';
import { renderWithSpruce, renderWithTheme, waitFor } from '../utils/test-utils.js';

describe('P1.0-02 form and lookup parity', () => {
  it('keeps Select multiple selection controlled and emits the selected item', async () => {
    const onChange = vi.fn();
    const onSelectedItem = vi.fn();
    const { container, getByRole, user } = renderWithSpruce(
      <Select
        options={[{ label: 'Alpha', value: 'a' }, { label: 'Beta', value: 'b' }]}
        value={['a']}
        multiple
        onChange={onChange}
        onSelectedItem={onSelectedItem}
      />,
    );

    await user.click(container.querySelector('.sp-select__trigger') as HTMLElement);
    await user.click(getByRole('option', { name: 'Beta' }));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);
    expect(onSelectedItem).toHaveBeenLastCalledWith({ label: 'Beta', value: 'b' });
  });

  it('loads a paged source and exposes listbox keyboard selection', async () => {
    const onChange = vi.fn();
    const source = {
      read: vi.fn(async ({ pageNumber = 1 } = {}) => ({
        pageNumber,
        pageSize: 1,
        totalPages: 2,
        totalRecords: 2,
        data: pageNumber === 1 ? [{ label: 'Remote one', value: 'one' }] : [{ label: 'Remote two', value: 'two' }],
        hasPrevious: pageNumber > 1,
        hasNext: pageNumber < 2,
      })),
      getById: vi.fn(async (id: string) => ({ label: `Remote ${id}`, value: id })),
      search: vi.fn(async (query: string, _searchFields?: string[], params = {}) => ({
        pageNumber: params.pageNumber ?? 1,
        pageSize: params.pageSize ?? 1,
        totalPages: 1,
        totalRecords: query ? 1 : 0,
        data: query ? [{ label: 'Remote one', value: 'one' }] : [],
        hasPrevious: false,
        hasNext: false,
      })),
    };
    const { getByRole, user } = renderWithSpruce(
      <Select options={source} pageSize={1} virtualPaging onChange={onChange} />,
    );

    await user.click(getByRole('button'));
    await waitFor(() => {
      expect(source.read).toHaveBeenCalled();
      expect(getByRole('option', { name: 'Remote one' })).toBeTruthy();
    });
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('one');
  });

  it('supports combobox source templates and GridCombobox remote selection', async () => {
    const onComboChange = vi.fn();
    const onGridSelect = vi.fn();
    const { getByRole, getByText, getAllByRole, user } = renderWithSpruce(
      <>
        <Combobox
          source={[{ name: 'Alpha', id: 'a' }]}
          displayField="name"
          valueField="id"
          renderOption={({ option }) => <span data-testid="custom-option">{option.label}</span>}
          onChange={onComboChange}
        />
        <GridCombobox
          columns={[{ key: 'code', label: 'Code' }, { key: 'name', label: 'Name' }]}
          options={[{ code: 'A', name: 'Alpha', value: 'a', label: 'Alpha' }]}
          onChange={onGridSelect}
          resizableColumns
        />
      </>,
    );

    const inputs = getAllByRole('combobox');
    await user.click(inputs[0]);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onComboChange).toHaveBeenLastCalledWith('a');
    await user.click(inputs[1]);
    expect(getByText('Code')).toBeTruthy();
    await user.click(getByRole('option', { name: /AAlpha/ }));
    expect(onGridSelect).toHaveBeenLastCalledWith('a');
  });

  it('applies shared state and keyboard behavior across primitives in RTL dark theme', async () => {
    const checkboxChange = vi.fn();
    const sliderChange = vi.fn();
    const rangeChange = vi.fn();
    const { getByRole, user } = renderWithTheme(
      <>
        <Checkbox ariaLabel="Accept" required error="Required" onChange={checkboxChange} />
        <Slider ariaLabel="Progress" value={10} min={0} max={20} step={5} orientation="vertical" onChange={sliderChange} />
        <Range ariaLabelLow="Minimum" ariaLabelHigh="Maximum" value={{ low: 10, high: 20 }} onChange={rangeChange} showMarker />
      </>,
      'dark',
      { providerProps: { direction: 'rtl', locale: 'ar' } },
    );

    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
    expect(getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
    await user.click(getByRole('checkbox'));
    expect(checkboxChange).toHaveBeenCalledWith(true);
    const slider = getByRole('slider', { name: 'Progress' });
    slider.focus();
    await user.keyboard('{ArrowUp}');
    expect(sliderChange).toHaveBeenLastCalledWith(15);
    expect(getByRole('slider', { name: 'Minimum' })).toBeTruthy();
  });
});
