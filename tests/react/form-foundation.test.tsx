import { describe, expect, it, vi } from 'vitest';
import {
  Field,
  FormLayout,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupSpacer,
} from '../../src/index.js';
import {
  expectDocumentDirection,
  expectDocumentTheme,
  expectNoA11yViolations,
  renderWithSpruce,
  renderWithTheme,
} from '../utils/test-utils.js';

describe('form foundation', () => {
  it('associates labels, feedback, and controlled callbacks through Field', async () => {
    const onChange = vi.fn();
    const { container, getByRole, user } = renderWithSpruce(
      <Field
        label="Email address"
        labelFor="field-email"
        required
        helperText="Use a work address."
        errorText="Enter a valid email address."
      >
        <Input id="field-email" value="bad" onChange={onChange} />
      </Field>,
    );
    const input = getByRole('textbox', { name: 'Email address' });

    expect(input).toHaveAttribute('id', 'field-email');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toContain('field-email-error');
    expect(getByRole('alert')).toHaveTextContent('Enter a valid email address.');
    expect(container.querySelector('.sp-field__helper')).toBeNull();

    await user.clear(input);
    expect(onChange).toHaveBeenLastCalledWith('');
    await expectNoA11yViolations(container);
  });

  it('supports hidden fields and inherited horizontal layout', () => {
    const { container, rerender } = renderWithSpruce(
      <FormLayout layout="horizontal" labelWidth="160px" responsive>
        <Field label="Name" labelFor="layout-name">
          <Input id="layout-name" value="Ada" onChange={() => undefined} />
        </Field>
      </FormLayout>,
    );
    const field = container.querySelector('.sp-field');
    expect(field).toHaveClass('sp-field--inline');
    expect(field).toHaveStyle('--sp-field-label-width: 160px');
    expect(container.querySelector('.sp-form')).toHaveClass('sp-form--horizontal', 'sp-form--responsive');

    rerender(
      <Field hidden label="Hidden" labelFor="hidden-field">
        <Input id="hidden-field" value="secret" onChange={() => undefined} />
      </Field>,
    );
    expect(container.querySelector('.sp-field')).toHaveAttribute('hidden');
    expect(container.querySelector('.sp-input')).toBeNull();
  });

  it('keeps InputGroup actions controlled and inherits disabled state', async () => {
    const onClick = vi.fn();
    const onChange = vi.fn();
    const { container, getByRole, getByDisplayValue, user } = renderWithSpruce(
      <InputGroup ariaLabel="Search" invalid>
        <InputGroupAddon>@</InputGroupAddon>
        <InputGroupInput aria-label="Search value" value="spruce" onChange={onChange} />
        <InputGroupButton onClick={onClick}>Go</InputGroupButton>
      </InputGroup>,
    );
    const group = getByRole('group', { name: 'Search' });
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(container.querySelector('.sp-input-group--invalid')).not.toBeNull();
    await user.click(getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    await user.clear(getByDisplayValue('spruce'));
    expect(onChange).toHaveBeenLastCalledWith(expect.anything());

    const disabled = renderWithSpruce(
      <InputGroup disabled ariaLabel="Locked">
        <InputGroupInput aria-label="Locked value" value="locked" onChange={() => undefined} />
        <InputGroupSpacer />
        <InputGroupButton iconOnly ariaLabel="Copy">C</InputGroupButton>
      </InputGroup>,
    );
    expect(disabled.getByRole('button', { name: 'Copy' })).toBeDisabled();
    expect(disabled.getByRole('textbox', { name: 'Locked value' })).toBeDisabled();
    await expectNoA11yViolations(container);
  });

  it('applies document and local direction while mounting in a dark theme', () => {
    const { container } = renderWithTheme(
      <Field label="اسم" labelFor="rtl-name" layout="inline">
        <Input id="rtl-name" value="" onChange={() => undefined} />
      </Field>,
      'dark',
      { providerProps: { direction: 'rtl', locale: 'ar' } },
    );
    expectDocumentTheme('dark');
    expectDocumentDirection('rtl');
    expect(container.querySelector('.sp-field')).toHaveAttribute('dir', 'rtl');
  });
});
