import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import {
  ColorPicker,
  EmojiPicker,
  FormBuilder,
  FormBuilderDataContextAdapter,
  type FormBuilderSchema,
  createDataContext,
} from '../../src/index.js';
import {
  expectDocumentDirection,
  expectDocumentTheme,
  expectNoA11yViolations,
  renderWithSpruce,
  renderWithTheme,
  waitFor,
} from '../utils/test-utils.js';

const schema: FormBuilderSchema = {
  sections: [{
    id: 'profile',
    title: 'Profile',
    cols: 12,
    fields: [
      { id: 'name', name: 'name', type: 'text', label: 'Name', required: true, x: 0, y: 0, w: 6, h: 2 },
      { id: 'role', name: 'role', type: 'select', label: 'Role', options: [{ label: 'Admin', value: 'admin' }], x: 6, y: 0, w: 6, h: 2 },
    ],
  }],
};

describe('P1.0-03 missing forms parity', () => {
  it('supports controlled color presets, custom input, and accessible dialog semantics', async () => {
    const onChange = vi.fn();
    const { getByRole, getByLabelText, user } = renderWithTheme(
      <ColorPicker value="#1e88e5" onChange={onChange} label="Accent color" />,
      'dark',
    );

    await user.click(getByRole('button', { name: 'Accent color' }));
    expect(getByRole('dialog', { name: 'Accent color' })).toBeTruthy();
    await user.click(getByRole('option', { name: 'Blue' }));
    expect(onChange).toHaveBeenLastCalledWith('#1e88e5');

    await user.click(getByRole('button', { name: 'Accent color' }));
    await user.click(getByRole('button', { name: 'Custom' }));
    expect(getByLabelText(/accent color custom/i)).toHaveAttribute('type', 'color');
    expectDocumentTheme('dark');
    await expectNoA11yViolations(document.body);
  });

  it('filters emoji by keyword and emits both value and selected object', async () => {
    const onChange = vi.fn();
    const onSelected = vi.fn();
    const { getByRole, user } = renderWithSpruce(
      <EmojiPicker value="🙂" onChange={onChange} onSelected={onSelected} label="Reaction" />,
    );

    await user.click(getByRole('button', { name: 'Reaction' }));
    const search = getByRole('searchbox', { name: 'Search emojis' });
    expect(search).toHaveFocus();
    await user.type(search, 'rocket');
    await waitFor(() => expect(getByRole('option', { name: 'Rocket' })).toBeTruthy());
    await user.click(getByRole('option', { name: 'Rocket' }));

    expect(onChange).toHaveBeenLastCalledWith('🚀');
    expect(onSelected).toHaveBeenLastCalledWith(expect.objectContaining({ label: 'Rocket', value: '🚀' }));
    expect(document.body.querySelector('.sp-emoji-picker__panel')).toBeNull();
  });

  it('keeps FormBuilder schema, value, mode, validation, and submit controlled', async () => {
    const onSubmit = vi.fn();
    function Host() {
      const [currentSchema, setSchema] = useState(schema);
      const [value, setValue] = useState<Record<string, unknown>>({});
      const [mode, setMode] = useState<'design' | 'preview'>('design');
      return <FormBuilder schema={currentSchema} onSchemaChange={setSchema} value={value} onValueChange={setValue} mode={mode} onModeChange={setMode} onSubmit={onSubmit} />;
    }

    const { getByRole, getByText, user } = renderWithSpruce(<Host />);
    expect(getByText('Profile')).toBeTruthy();
    await user.click(getByRole('button', { name: 'Preview' }));
    expect(getByRole('textbox', { name: 'Name' })).toBeTruthy();
    await user.click(getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenLastCalledWith(expect.objectContaining({ valid: false, errors: { name: ['Name is required'] } }));
    expect(getByRole('alert')).toHaveTextContent('Name is required');
  });

  it('supports design operations and the DataContext adapter without Angular signals', async () => {
    const { getByRole, user } = renderWithSpruce(<FormBuilder />);
    await user.click(getByRole('button', { name: 'Add section' }));
    expect(getByRole('textbox')).toHaveValue('Section');

    const context = createDataContext<{ id: string; name: string }>({
      idField: 'id',
      defaultFormValue: { name: '' },
    });
    context.loadRecords([{ id: '1', name: 'Ada' }]);
    context.first();
    const adapter = new FormBuilderDataContextAdapter(context);
    adapter.setValue({ name: 'Grace' });
    expect(context.current?.data.name).toBe('Grace');
    await adapter.onSubmit({ value: { name: 'Alan' }, valid: true, errors: {} });
    expect(context.current?.data.name).toBe('Alan');
    expect(adapter.dirty).toBe(true);
    expect(adapter.getChangeSummary().modifiedCount).toBe(1);
  });

  it('applies RTL and dark-theme direction to picker and builder surfaces', () => {
    const { container } = renderWithTheme(
      <><ColorPicker label="لون" /><EmojiPicker label="رمز" /><FormBuilder schema={schema} /></>,
      'dark',
      { providerProps: { direction: 'rtl', locale: 'ar' } },
    );
    expectDocumentTheme('dark');
    expectDocumentDirection('rtl');
    expect(container.querySelector('.sp-color-picker')).toHaveAttribute('dir', 'rtl');
    expect(container.querySelector('.sp-emoji-picker')).toHaveAttribute('dir', 'rtl');
    expect(container.querySelector('.sp-fb')).toHaveAttribute('dir', 'rtl');
  });
});
