import { useState } from 'react';
import { Table, type TableColumn, type TableSort } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  status: string;
}

const INVOICES: Invoice[] = [
  { id: 'INV-1042', customer: 'Acme Labs', amount: 1280, status: 'Paid' },
  { id: 'INV-1041', customer: 'Northstar', amount: 640, status: 'Open' },
  { id: 'INV-1040', customer: 'Atlas Works', amount: 2190, status: 'Overdue' },
  { id: 'INV-1039', customer: 'Brightside', amount: 420, status: 'Paid' },
  { id: 'INV-1038', customer: 'Fieldstone', amount: 875, status: 'Open' },
];

const COLUMNS: TableColumn<Invoice>[] = [
  { key: 'id', header: 'Invoice', sortable: true },
  { key: 'customer', header: 'Customer', sortable: true },
  { key: 'amount', header: 'Amount', sortable: true, value: (row) => `$${row.amount.toLocaleString()}` },
  { key: 'status', header: 'Status' },
];

export function TablePage() {
  const [sort, setSort] = useState<TableSort<Invoice> | null>(null);

  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Table</h1>
        <p className="docs-desc">Accessible, tokenized data tables with controlled sorting, pagination, density, alignment, and vertical summaries.</p>

        <section id="basic" className="demo-section">
          <h2>Basic and sorting</h2>
          <CodePreview code={'<Table rows={invoices} columns={columns} sort={sort} onSortChange={setSort} />'}>
            <Table rows={INVOICES} columns={COLUMNS} sort={sort} onSortChange={setSort} ariaLabel="Invoices" />
          </CodePreview>
        </section>

        <section id="variants" className="demo-section">
          <h2>Density, stripes, and pagination</h2>
          <CodePreview code={'<Table rows={rows} columns={columns} density="compact" striped hover pagination pageSize={3} />'}>
            <Table rows={INVOICES} columns={COLUMNS} density="compact" striped pagination pageSize={3} ariaLabel="Paginated invoices" />
          </CodePreview>
        </section>

        <section id="vertical" className="demo-section">
          <h2>Vertical summary</h2>
          <CodePreview code={'<Table rows={rows} columns={columns} vertical cellAlign="right" />'}>
            <Table rows={INVOICES.slice(0, 1)} columns={COLUMNS} vertical cellAlign="right" ariaLabel="Invoice summary" />
          </CodePreview>
        </section>

        <section id="accessibility" className="demo-section">
          <h2>Accessibility</h2>
          <p className="section-desc">Sortable headers expose <code>aria-sort</code>; pagination uses the shared keyboard-friendly pager; logical alignment follows the document direction; empty states use a status row.</p>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>rows</code></td><td><code>T[]</code></td><td><code>[]</code></td><td>Rows to display.</td></tr>
            <tr><td><code>columns</code></td><td><code>TableColumn&lt;T&gt;[]</code></td><td>required</td><td>Column keys, labels, sortable flags, and optional value formatters.</td></tr>
            <tr><td><code>sort</code> / <code>onSortChange</code></td><td><code>TableSort&lt;T&gt; | null</code> / callback</td><td>—</td><td>Controlled sort state and sort events.</td></tr>
            <tr><td><code>pagination</code> / <code>page</code> / <code>onPageChange</code></td><td><code>boolean</code> / <code>number</code> / callback</td><td><code>true</code> / <code>1</code></td><td>Controlled paging; page size is configurable.</td></tr>
            <tr><td><code>density</code> / <code>cellAlign</code></td><td><code>'compact' | 'comfortable' | 'spacious'</code> / <code>'left' | 'center' | 'right'</code></td><td><code>'comfortable'</code> / <code>'left'</code></td><td>Tokenized row density and logical cell alignment.</td></tr>
            <tr><td><code>vertical</code> / <code>striped</code> / <code>hover</code></td><td><code>boolean</code></td><td><code>false</code> / <code>false</code> / <code>true</code></td><td>Display modes and row interaction affordances.</td></tr>
            <tr><td><code>ariaLabel</code> / <code>emptyMessage</code></td><td><code>string</code></td><td>localized</td><td>Accessible table name and empty state copy.</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list"><li><a className="toc-link" href="#basic">Basic and sorting</a></li><li><a className="toc-link" href="#variants">Variants</a></li><li><a className="toc-link" href="#vertical">Vertical summary</a></li><li><a className="toc-link" href="#accessibility">Accessibility</a></li><li><a className="toc-link" href="#api">API</a></li></ul></nav>
    </div>
  );
}
