import { describe, expect, it, vi } from 'vitest';
import {
  Button,
  GridCombobox,
  Modal,
  StatCard,
  StatDivider,
  StatGroup,
} from '../../src/index.js';
import { expectNoA11yViolations, renderWithSpruce, waitFor } from '../utils/test-utils.js';

const lookupColumns = [
  { key: 'name', label: 'Name' },
  { key: 'capital', label: 'Capital' },
];
const lookupOptions = [
  { value: 'fr', label: 'France', name: 'France', capital: 'Paris' },
  { value: 'us', label: 'United States', name: 'United States', capital: 'Washington' },
];

describe('C-02 StatCard family', () => {
  it.each(['strip', 'grid', 'stack'] as const)('renders an accessible %s group', (variant) => {
    const { getByRole } = renderWithSpruce(
      <StatGroup variant={variant} bordered ariaLabel={`${variant} metrics`}>
        <StatCard variant="inline" icon="users" label="Users" value="42" />
        <StatDivider />
        <StatCard label="Orders" value="7" />
      </StatGroup>,
    );

    const group = getByRole('group', { name: `${variant} metrics` });
    expect(group).toHaveClass(`sp-stat-group--${variant}`, 'sp-stat-group--bordered');
    expect(group.querySelector('.sp-stat-card--inline')).toBeInTheDocument();
    expect(group.querySelector('.sp-stat-divider')).toHaveAttribute('aria-hidden', 'true');
  });

  it('preserves flat, icon, and trend rendering', () => {
    const { container, getByText } = renderWithSpruce(
      <>
        <StatCard label="Flat" value="1" />
        <StatCard variant="icon" icon="users" label="Icon" value="2" />
        <StatCard variant="trend" label="Trend" value="3" change="+2%" trend="up"><span>Chart</span></StatCard>
      </>,
    );

    expect(container.querySelector('.sp-stat-card--flat')).toBeInTheDocument();
    expect(container.querySelector('.sp-stat-card--icon .sp-stat-card__icon')).toBeInTheDocument();
    expect(container.querySelector('.sp-stat-card--trend .sp-stat-card__chart')).toContainElement(getByText('Chart'));
    expect(getByText('+2%')).toHaveClass('sp-stat-card__change--up');
  });
});

describe('C-04 GridCombobox current API', () => {
  it('supports multiple keyboard selection, search fields, variants, resizing, and validation', async () => {
    const onChange = vi.fn();
    const { container, getByRole, queryByRole, user } = renderWithSpruce(
      <GridCombobox
        columns={lookupColumns}
        options={lookupOptions}
        multiple
        value={['fr']}
        onChange={onChange}
        icon="globe"
        variant="filled"
        searchFields={['capital']}
        panelResizable
        label="Markets"
        required
        error="Choose a market."
      />,
    );

    const input = getByRole('combobox', { name: 'Markets' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(container.querySelector('.sp-gc--filled .sp-gc__search-icon')).toBeInTheDocument();

    await user.click(input);
    await waitFor(() => expect(document.body.querySelector('.sp-gc__dropdown--resizable')).toBeInTheDocument());
    await user.type(input, 'Washington');
    await waitFor(() => expect(getByRole('option', { name: /United StatesWashington/ })).toBeInTheDocument());
    expect(queryByRole('option', { name: /FranceParis/ })).not.toBeInTheDocument();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['fr', 'us']);
    expect(getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    await expectNoA11yViolations(container);
  });
});

describe('C-07 Modal region backgrounds', () => {
  it('applies custom backgrounds only to rendered header and footer regions', () => {
    renderWithSpruce(
      <Modal
        open
        onClose={() => undefined}
        title="Review"
        headerBackground="var(--sp-primary-tint)"
        footerBackground="var(--sp-surface-100)"
        footer={<Button>Done</Button>}
      >
        Body
      </Modal>,
    );

    expect(document.querySelector('.sp-modal__header')).toHaveStyle({ background: 'var(--sp-primary-tint)' });
    expect(document.querySelector('.sp-modal__footer')).toHaveStyle({ background: 'var(--sp-surface-100)' });
    expect(document.querySelector('.sp-modal__body')).not.toHaveAttribute('style');
  });

  it('keeps default regions free of inline backgrounds and omits an absent footer', () => {
    renderWithSpruce(<Modal open onClose={() => undefined}>Body</Modal>);

    expect(document.querySelector('.sp-modal__header')).not.toHaveAttribute('style');
    expect(document.querySelector('.sp-modal__footer')).not.toBeInTheDocument();
  });
});
