import { describe, expect, it, vi } from 'vitest';
import {
  Badge,
  Barcode,
  Carousel,
  CreditCard,
  GitGraph,
  ImageCompare,
  Kanban,
  QrCode,
  StatCard,
  Terminal,
  Tree,
  type TerminalEntry,
} from '../../src/index.js';
import { expectNoA11yViolations, pressKey, renderWithRtl, renderWithSpruce, renderWithTheme } from '../utils/test-utils.js';

describe('P1.0-11 data-display parity', () => {
  it('renders Badge as a native clickable control with icons and parity variants', async () => {
    const clicked = vi.fn();
    const view = renderWithSpruce(
      <Badge variant="tertiary" size="xs" pill borderless clickable iconLeft="check" onBadgeClick={clicked}>
        Ready
      </Badge>,
    );
    const badge = view.getByRole('button', { name: 'Ready' });
    expect(badge).toHaveClass('sp-badge--tertiary', 'sp-badge--xs', 'sp-badge--pill', 'sp-badge--borderless');
    await view.user.click(badge);
    expect(clicked).toHaveBeenCalledTimes(1);
  });

  it('supports aligned barcode props and high-capacity QR correction', () => {
    const value = 'high-capacity payload '.repeat(8);
    const view = renderWithSpruce(
      <>
        <Barcode value="012345678905" format="upc-a" barColor="var(--sp-primary)" showValue={false} />
        <QrCode value={value} ecLevel="H" highCapacity size={160} />
      </>,
    );
    expect(view.getByRole('img', { name: /Barcode \(upc-a\)/ })).toBeInTheDocument();
    expect(view.container.querySelector('.sp-qrcode')).toHaveAttribute('aria-label', `QR Code: ${value}`);
    expect(view.container.querySelectorAll('.sp-qrcode__module').length).toBeGreaterThan(0);
  });

  it('keeps Carousel and ImageCompare changes controlled', async () => {
    const slideChanged = vi.fn();
    const positionChanged = vi.fn();
    const view = renderWithSpruce(
      <>
        <Carousel activeIndex={0} onSlideChange={slideChanged}>
          <span>First</span><span>Second</span>
        </Carousel>
        <ImageCompare beforeSrc="before.png" afterSrc="after.png" position={50} onPositionChange={positionChanged} />
      </>,
    );
    await view.user.click(view.getByRole('button', { name: /Next slide/i }));
    expect(slideChanged).toHaveBeenCalledWith(1);
    const slider = view.getByRole('slider');
    slider.focus();
    await pressKey(view.user, 'ArrowRight');
    expect(positionChanged).toHaveBeenCalledWith(51);
  });

  it('localizes the card holder and exposes graph selection/context callbacks', async () => {
    const selected = vi.fn();
    const context = vi.fn();
    const view = renderWithSpruce(
      <>
        <CreditCard number="4111 1111 1111 4242" />
        <GitGraph
          commits={[{ hash: 'abc1234', message: 'Initial commit', branch: 'main', tags: ['v1'] }]}
          onCommitSelect={selected}
          onCommitContextMenu={context}
        />
      </>,
    );
    expect(view.getByRole('img', { name: /ending in 4242/ })).toBeInTheDocument();
    const row = view.getByRole('button', { name: /Initial commit/ });
    await view.user.click(row);
    expect(selected).toHaveBeenCalledWith(expect.objectContaining({ hash: 'abc1234' }));
    await view.user.pointer({ target: row, keys: '[MouseRight]' });
    expect(context).toHaveBeenCalled();
  });

  it('enforces Kanban movement guards for keyboard moves', async () => {
    const moved = vi.fn();
    const view = renderWithSpruce(
      <Kanban
        columns={[
          { id: 'todo', title: 'Todo', cards: [{ id: 'a', title: 'Task A' }] },
          { id: 'done', title: 'Done', cards: [] },
        ]}
        canMoveCard={() => false}
        onCardMoved={moved}
      />,
    );
    const card = view.getByRole('listitem', { name: 'Task A' });
    card.focus();
    await view.user.keyboard('{Alt>}{ArrowRight}{/Alt}');
    expect(moved).not.toHaveBeenCalled();
  });

  it('supports chart fit, terminal light virtualization, and controlled Tree state', async () => {
    const checked = vi.fn();
    const selected = vi.fn();
    const entries: TerminalEntry[] = Array.from({ length: 30 }, (_, id) => ({
      id,
      level: 'info',
      message: `line ${id}`,
      timestamp: new Date(0),
    }));
    const view = renderWithTheme(
      <>
        <StatCard variant="trend" chartFit="inset"><span>chart</span></StatCard>
        <Terminal theme="light" virtualScroll virtualItemHeight={20} virtualOverscan={2} entries={entries} maxHeight="120px" />
        <Tree
          nodes={[{ id: 'root', label: 'Root', badge: '3', children: [{ id: 'child', label: 'Child' }] }]}
          expandedIds={['root']}
          checkedIds={[]}
          selectable
          onNodeCheck={checked}
          onNodeSelect={selected}
        />
      </>,
      'dark',
      { providerProps: { direction: 'rtl', locale: 'ar' } },
    );
    expect(view.container.querySelector('.sp-stat-card__chart--inset')).toBeInTheDocument();
    expect(view.container.querySelector('.sp-terminal--light')).toBeInTheDocument();
    expect(view.getByText('3')).toBeInTheDocument();
    await view.user.click(view.getByRole('checkbox', { name: 'Root' }));
    expect(checked).toHaveBeenCalledWith(expect.objectContaining({ checked: true }));
    await view.user.click(view.getByText('Child'));
    expect(selected).toHaveBeenCalledWith(expect.objectContaining({ id: 'child' }));
    await expectNoA11yViolations(view.container);
  });

  it('keeps data-display chrome and layout usable in RTL', () => {
    const view = renderWithRtl(<Carousel><span>RTL</span></Carousel>);
    expect(view.container.querySelector('.sp-carousel')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
  });
});
