import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import {
  Button,
  CommentThread,
  ComposeBar,
  EntitlementsProvider,
  FeatureGate,
  FeatureLocked,
  PdfViewer,
  PropertyPanel,
  Table,
  TextDiff,
  type Comment,
  type PropertyPanelProperty,
  type PropertyPanelValues,
} from '../../src/index.js';
import { expectNoA11yViolations, renderWithRtl, renderWithSpruce, renderWithTheme } from '../utils/test-utils.js';

interface Row extends Record<string, unknown> {
  name: string;
  score: number;
}

const ROWS: Row[] = [{ name: 'Beta', score: 2 }, { name: 'Alpha', score: 1 }];
const COLUMNS = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'score', header: 'Score', sortable: true },
] as const;

describe('P1.0-12 data and productivity parity', () => {
  it('supports controlled table sorting, pagination, vertical mode, and RTL direction', async () => {
    const sorted = vi.fn();
    const pageChanged = vi.fn();
    const view = renderWithRtl(<Table<Row> rows={ROWS} columns={COLUMNS} sort={null} onSortChange={sorted} pageSize={1} onPageChange={pageChanged} />);
    await view.user.click(view.container.querySelector('.sp-table__head-btn') as HTMLElement);
    expect(sorted).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });
    await view.user.click(view.getByRole('button', { name: /التالية/i }));
    expect(pageChanged).toHaveBeenCalledWith(2);
    expect(view.container.querySelector('.sp-table')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
  });

  it('tracks descendant focus in ComposeBar and preserves its slots', async () => {
    const view = renderWithSpruce(
      <ComposeBar leading={<span>GET</span>} trailing={<Button size="sm">Run</Button>}>
        <input aria-label="Endpoint" />
      </ComposeBar>,
    );
    const input = view.getByRole('textbox', { name: 'Endpoint' });
    await view.user.click(input);
    expect(view.container.querySelector('.sp-compose-bar--focused')).toBeInTheDocument();
    expect(view.getByText('GET')).toBeInTheDocument();
    expect(view.getByRole('button', { name: 'Run' })).toBeInTheDocument();
  });

  it('emits comment submit, reaction, reply, and delete events', async () => {
    const submit = vi.fn();
    const reaction = vi.fn();
    const deleted = vi.fn();
    const comments: Comment[] = [{ id: 'one', author: { id: 'me', name: 'Me' }, body: 'Hello', createdAt: new Date().toISOString(), reactions: [{ emoji: '👍', userIds: ['other'] }] }];
    const view = renderWithSpruce(<CommentThread comments={comments} currentUser={{ id: 'me', name: 'Me' }} onCommentSubmit={submit} onReactionToggle={reaction} onCommentDelete={deleted} />);
    await view.user.type(view.getByRole('textbox', { name: /comment/i }), 'New note');
    await view.user.click(view.getByRole('button', { name: /comment/i }));
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ body: 'New note', parentId: null }));
    await view.user.click(view.getByRole('button', { name: '👍 1' }));
    expect(reaction).toHaveBeenCalledWith({ commentId: 'one', emoji: '👍' });
    await view.user.click(view.getByRole('button', { name: /reply/i }));
    expect(view.getByRole('textbox', { name: /reply/i })).toBeInTheDocument();
    await view.user.click(view.getByRole('button', { name: /delete/i }));
    expect(deleted).toHaveBeenCalledWith({ commentId: 'one' });
  });

  it('supports searchable, categorized, controlled property editing and compound fields', async () => {
    const changed = vi.fn();
    const properties: PropertyPanelProperty[] = [
      { name: 'title', label: 'Title', category: 'General', editor: 'text', defaultValue: 'Old' },
      { name: 'shadow', label: 'Shadow', category: 'Appearance', editor: 'compound', fields: [{ key: 'x', label: 'X', editor: 'number' }, { key: 'y', label: 'Y', editor: 'number' }], separator: ', ' },
    ];
    function ControlledPanel() {
      const [values, setValues] = useState<PropertyPanelValues>({ title: 'Old', shadow: '0, 4' });
      return <PropertyPanel properties={properties} values={values} onValuesChange={(next) => { setValues(next); changed(next); }} />;
    }
    const view = renderWithSpruce(<ControlledPanel />);
    await view.user.type(view.getByDisplayValue('Old'), ' title');
    expect(changed).toHaveBeenLastCalledWith({ title: 'Old title', shadow: '0, 4' });
    await view.user.click(view.getByRole('button', { name: /expand shadow/i }));
    expect(view.getByDisplayValue('4')).toBeInTheDocument();
    await view.user.click(view.getByRole('radio', { name: /alphabetical/i }));
    expect(view.getByRole('radio', { name: /alphabetical/i })).toHaveAttribute('aria-checked', 'true');
  });

  it('exposes PDF loading, empty states, and lifecycle callbacks', () => {
    const loaded = vi.fn();
    const view = renderWithTheme(<PdfViewer src="/document.pdf" title="Contract" onLoaded={loaded} />, 'dark');
    expect(view.getByRole('status')).toHaveTextContent(/loading/i);
    const frame = view.container.querySelector('iframe');
    expect(frame).toHaveAttribute('title', 'Contract PDF preview');
    fireEvent.load(frame as HTMLIFrameElement);
    expect(loaded).toHaveBeenCalledTimes(1);
    view.rerender(<PdfViewer src={null} />);
    expect(view.getByRole('status')).toHaveTextContent(/no pdf/i);
  });

  it('computes a semantic text diff', () => {
    const view = renderWithSpruce(
      <TextDiff oldText="Ship Friday" newText="Ship Monday" showSummary />,
    );
    expect(view.container.querySelectorAll('.sp-text-diff__part--delete')).toHaveLength(1);
    expect(view.container.querySelectorAll('.sp-text-diff__part--insert')).toHaveLength(1);
  });

  it('fails closed until entitlements are loaded and renders the locked state', () => {
    const view = renderWithSpruce(
      <EntitlementsProvider features={[]}>
        <FeatureGate feature="exports" fallback={<FeatureLocked><Button>Upgrade</Button></FeatureLocked>}>
          <span>Export tools</span>
        </FeatureGate>
      </EntitlementsProvider>,
    );
    expect(view.queryByText('Export tools')).not.toBeInTheDocument();
    expect(view.getByRole('note')).toBeInTheDocument();
    expect(view.getByRole('button', { name: 'Upgrade' })).toBeInTheDocument();
  });

  it('keeps the new surfaces usable in dark theme and passes an accessibility smoke check', async () => {
    const view = renderWithTheme(
      <>
        <Table<Row> rows={[]} columns={COLUMNS} />
        <TextDiff oldText="old" newText="new" />
        <FeatureLocked />
      </>,
      'dark',
    );
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    await expectNoA11yViolations(view.container);
  });
});
