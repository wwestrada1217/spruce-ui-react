import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { Calendar, DatePicker, DateRangePicker, DateTimePicker, RangeCalendar, TimePicker } from '../../src/index.js';
import { renderWithSpruce } from '../utils/test-utils.js';

function openPicker(container: HTMLElement, selector: string, user: ReturnType<typeof renderWithSpruce>['user']) {
  const trigger = container.querySelector(selector);
  expect(trigger).not.toBeNull();
  return user.click(trigger as HTMLElement);
}

describe('adjacent-month dates', () => {
  it('shows and selects adjacent dates in DatePicker by default', async () => {
    const onChange = vi.fn();
    const view = renderWithSpruce(
      <DatePicker value="2026-04-15" onChange={onChange} />,
    );

    await openPicker(view.container, '.sp-dp__trigger', view.user);

    const otherMonthDays = document.querySelectorAll<HTMLButtonElement>('.sp-dp__day--other-month');
    expect(otherMonthDays.length).toBeGreaterThan(0);
    expect(otherMonthDays[0]).toBeEnabled();

    await view.user.click(otherMonthDays[0]);
    expect(onChange).toHaveBeenCalledWith('2026-03-29');
  });

  it('can hide or disable adjacent dates in DatePicker', async () => {
    const hidden = renderWithSpruce(
      <DatePicker value="2026-04-15" showOtherMonths={false} />,
    );
    await openPicker(hidden.container, '.sp-dp__trigger', hidden.user);
    expect(document.querySelector('.sp-dp__day--other-month')).not.toBeInTheDocument();

    const disabledOnChange = vi.fn();
    const disabled = renderWithSpruce(
      <DatePicker
        value="2026-04-15"
        selectOtherMonths={false}
        onChange={disabledOnChange}
      />,
    );
    await openPicker(disabled.container, '.sp-dp__trigger', disabled.user);
    const disabledDay = document.querySelector<HTMLButtonElement>('.sp-dp__day--other-month');
    expect(disabledDay).not.toBeNull();
    expect(disabledDay).toBeDisabled();
  });

  it('shows and selects adjacent dates in DateTimePicker by default', async () => {
    const onChange = vi.fn();
    const view = renderWithSpruce(
      <DateTimePicker value="2026-04-15T14:30" onChange={onChange} />,
    );

    await openPicker(view.container, '.sp-dtp__trigger', view.user);

    const otherMonthDays = document.querySelectorAll<HTMLButtonElement>('.sp-dtp__day--other-month');
    expect(otherMonthDays.length).toBeGreaterThan(0);
    expect(otherMonthDays[0]).toBeEnabled();

    await view.user.click(otherMonthDays[0]);
    const applyButton = document.querySelector('.sp-dtp__apply-btn');
    expect(applyButton).not.toBeNull();
    await view.user.click(applyButton as HTMLElement);
    expect(onChange).toHaveBeenCalledWith('2026-03-29T14:30');
  });

  it('can hide or disable adjacent dates in DateTimePicker', async () => {
    const hidden = renderWithSpruce(
      <DateTimePicker value="2026-04-15T14:30" showOtherMonths={false} />,
    );
    await openPicker(hidden.container, '.sp-dtp__trigger', hidden.user);
    expect(document.querySelector('.sp-dtp__day--other-month')).not.toBeInTheDocument();

    const disabled = renderWithSpruce(
      <DateTimePicker value="2026-04-15T14:30" selectOtherMonths={false} />,
    );
    await openPicker(disabled.container, '.sp-dtp__trigger', disabled.user);
    const disabledDay = document.querySelector<HTMLButtonElement>('.sp-dtp__day--other-month');
    expect(disabledDay).not.toBeNull();
    expect(disabledDay).toBeDisabled();
  });

  it('shows and selects adjacent dates in DateRangePicker by default', async () => {
    const onChange = vi.fn();
    const view = renderWithSpruce(
      <DateRangePicker
        value={{ start: '2026-04-15', end: null }}
        onChange={onChange}
      />,
    );

    await openPicker(view.container, '.sp-drp__trigger', view.user);

    const otherMonthDays = document.querySelectorAll<HTMLButtonElement>('.sp-drp__day--other-month');
    expect(otherMonthDays.length).toBeGreaterThan(0);
    expect(otherMonthDays[0]).toBeEnabled();

    await view.user.click(otherMonthDays[0]);
    const applyButton = document.querySelector('.sp-drp__action--primary');
    expect(applyButton).not.toBeNull();
    await view.user.click(applyButton as HTMLElement);
    expect(onChange).toHaveBeenCalledWith({ start: '2026-03-29', end: null });
  });

  it('can hide or disable adjacent dates in DateRangePicker', async () => {
    const hidden = renderWithSpruce(
      <DateRangePicker
        value={{ start: '2026-04-15', end: null }}
        showOtherMonths={false}
      />,
    );
    await openPicker(hidden.container, '.sp-drp__trigger', hidden.user);
    expect(document.querySelector('.sp-drp__day--other-month')).not.toBeInTheDocument();

    const disabled = renderWithSpruce(
      <DateRangePicker
        value={{ start: '2026-04-15', end: null }}
        selectOtherMonths={false}
      />,
    );
    await openPicker(disabled.container, '.sp-drp__trigger', disabled.user);
    const disabledDay = document.querySelector<HTMLButtonElement>('.sp-drp__day--other-month');
    expect(disabledDay).not.toBeNull();
    expect(disabledDay).toBeDisabled();
  });

  it('shows and selects adjacent dates in Calendar by default', async () => {
    const onChange = vi.fn();
    const view = renderWithSpruce(
      <Calendar value="2026-04-15" onChange={onChange} showFooter={false} />,
    );

    const otherMonthDays = view.container.querySelectorAll<HTMLButtonElement>('.sp-cal__day--other-month');
    expect(otherMonthDays.length).toBeGreaterThan(0);
    expect(otherMonthDays[0]).toBeEnabled();

    await view.user.click(otherMonthDays[0]);
    expect(onChange).toHaveBeenCalledWith('2026-03-29');
  });

  it('can hide or disable adjacent dates in Calendar', async () => {
    const hidden = renderWithSpruce(
      <Calendar value="2026-04-15" showOtherMonths={false} showFooter={false} />,
    );
    expect(hidden.container.querySelector('.sp-cal__day--other-month')).not.toBeInTheDocument();

    const disabled = renderWithSpruce(
      <Calendar value="2026-04-15" selectOtherMonths={false} showFooter={false} />,
    );
    const disabledDay = disabled.container.querySelector<HTMLButtonElement>('.sp-cal__day--other-month');
    expect(disabledDay).not.toBeNull();
    expect(disabledDay).toBeDisabled();
  });
});

describe('C-03 shared date-control contract', () => {
  it('wires readonly, required, invalid, and error state across all six controls', () => {
    const { container, getAllByRole } = renderWithSpruce(
      <>
        <Calendar ariaLabel="Calendar date" readOnly required error="Calendar error" />
        <RangeCalendar ariaLabel="Calendar range" readOnly required error="Range calendar error" />
        <DatePicker label="Date" readOnly required error="Date error" />
        <DateRangePicker label="Date range" readOnly required error="Date range error" />
        <TimePicker label="Time" readOnly required error="Time error" />
        <DateTimePicker label="Date and time" readOnly required error="Date time error" />
      </>,
    );

    expect(getAllByRole('alert')).toHaveLength(6);
    expect(container.querySelectorAll('.sp-date-control--invalid')).toHaveLength(6);
    expect(container.querySelectorAll('.sp-date-control--readonly')).toHaveLength(6);
    expect(container.querySelectorAll('[aria-required="true"]')).not.toHaveLength(0);
    expect(container.querySelectorAll('[aria-describedby$="-error"]')).not.toHaveLength(0);
  });

  it('omits hidden controls and reports blur as touched', () => {
    const onTouchedChange = vi.fn();
    const onBlur = vi.fn();
    const hidden = renderWithSpruce(
      <>
        <Calendar hidden />
        <RangeCalendar hidden />
        <DatePicker hidden />
        <DateRangePicker hidden />
        <TimePicker hidden />
        <DateTimePicker hidden />
      </>,
    );
    expect(hidden.container.querySelectorAll('.sp-date-control--hidden')).toHaveLength(2);
    expect(hidden.container.querySelector('.sp-dp, .sp-drp, .sp-tp, .sp-dtp')).not.toBeInTheDocument();
    hidden.unmount();

    const { getByRole } = renderWithSpruce(
      <DatePicker inputMode label="Due date" onTouchedChange={onTouchedChange} onBlur={onBlur} />,
    );
    fireEvent.blur(getByRole('textbox', { name: 'Due date' }));
    expect(onTouchedChange).toHaveBeenCalledWith(true);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
