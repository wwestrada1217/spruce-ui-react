import { useState, useEffect, useRef } from 'react';
import { CodePreview } from '../../components/CodePreview';

// ─── Code samples ──────────────────────────────────────────────────────────────

const SETUP = `import {
  DataContext,
  createDataContext,
  createArrayDataSource,
} from 'spruce-react/data';

interface Invoice {
  id: string;
  number: string;
  amount: number;
  status: string;
}

const invoiceSource = createArrayDataSource<Invoice>([
  { id: '1', number: 'INV-001', amount: 1500, status: 'Paid' },
  { id: '2', number: 'INV-002', amount: 850,  status: 'Pending' },
  { id: '3', number: 'INV-003', amount: 200,  status: 'Overdue' },
]);

// Create a DataContext bound to the data source
const invoiceCtx = createDataContext<Invoice>({
  idField: 'id',
  dataSource: invoiceSource,
});`;

const LOAD = `// Load all records from the data source
await invoiceCtx.loadById('2');       // load a specific record
invoiceCtx.load();                    // fire-and-forget load from source
invoiceCtx.load(someArray);           // load from a pre-fetched array

// Or via the React hook (recommended inside components)
const { ctx, loading, error } = useDataContextLoad(invoiceCtx, { pageSize: 50 });`;

const NAVIGATION = `// Navigate records like a cursor
invoiceCtx.first();             // go to record 1
invoiceCtx.next();              // advance one
invoiceCtx.previous();          // go back one
invoiceCtx.last();              // go to last record
invoiceCtx.skip(2);             // jump to index 2 (0-based)

// Inspect position
invoiceCtx.recordNo;            // current 1-based position
invoiceCtx.recordIndex;         // 0-based index
invoiceCtx.hasNext;             // true if not at end
invoiceCtx.hasPrevious;         // true if not at start
invoiceCtx.count;               // total record count

// Current record handle
const handle = invoiceCtx.current;
console.log(handle?.data);       // { id: '2', number: 'INV-002', ... }
console.log(handle?.id);         // '2'`;

const CRUD = `const handle = invoiceCtx.current!;

// Update — replaces fields, tracks changes
handle.update({ status: 'Paid', amount: 1000 });

// Patch — only updates fields that actually changed
handle.patch({ status: 'Paid' });

// Mark for deletion (soft delete — record stays until saved)
handle.delete();

// Discard local changes to THIS record
handle.discard();

// Add a new record (gets a GUID automatically)
const newId = invoiceCtx.add({ number: 'INV-004', amount: 750, status: 'Draft' });

// Read dirty state
invoiceCtx.dirty;           // any unsaved changes anywhere
invoiceCtx.currentDirty;    // unsaved changes on the current record only

// Discard ALL pending changes
invoiceCtx.discardChanges();`;

const SAVE = `// Save persists the current record's changes via dataSource.sync()
const saved = await invoiceCtx.save();

// Inspect what would be sent
const payload = invoiceCtx.buildSyncPayload();
// [{ id: '2', number: 'INV-002', amount: 1000, status: 'Paid',
//    _state: 'Modified', _modifiedFields: ['amount', 'status'] }]

// Human-readable preview
console.log(invoiceCtx.previewPayload());`;

const USE_DATA_CONTEXT = `import {
  useDataContext,
  useDataContextLoad,
  createDataContext,
  createApiDataSource,
} from 'spruce-react/data';

const source = createApiDataSource<Invoice>('https://api.example.com', '/invoices');
const ctx = createDataContext<Invoice>({ idField: 'id', dataSource: source });

// ── useDataContext ──────────────────────────────────────────────────────────
// Subscribe to an existing DataContext. Re-renders whenever state changes.
function InvoiceDetail() {
  const invoiceCtx = useDataContext(ctx);
  const current = invoiceCtx.current;

  if (!current) return <p>No record selected.</p>;

  return (
    <div>
      <h2>{current.data.number}</h2>
      <p>Amount: \${current.data.amount}</p>
      <p>Status: {current.data.status}</p>
      {invoiceCtx.currentDirty && <em>Unsaved changes</em>}
      <button onClick={() => current.patch({ status: 'Paid' })}>Mark Paid</button>
      <button onClick={() => current.discard()}>Discard</button>
    </div>
  );
}

// ── useDataContextLoad ──────────────────────────────────────────────────────
// Loads data from the source on mount. Returns loading / error state.
function InvoiceList() {
  const { ctx: invoiceCtx, loading, error } = useDataContextLoad(ctx, { pageSize: 20 });

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error.message}</p>;

  return (
    <ul>
      {invoiceCtx.data.map((inv) => (
        <li key={inv.id}>{inv.number} — {inv.status}</li>
      ))}
    </ul>
  );
}`;

const DETAILS = `interface OrderLine {
  id: string;
  orderId: string;       // foreign key
  product: string;
  qty: number;
}

interface Order {
  id: string;
  reference: string;
  lines: OrderLine[];    // nested array
}

const lineSource = createArrayDataSource<OrderLine>([]);

const orderCtx = createDataContext<Order>({
  idField: 'id',
  dataSource: orderSource,
  details: {
    lines: {
      idField:     'id',
      foreignKey:  'orderId',
      dataSource:  lineSource,
    },
  },
});

// After loading an order, access its lines:
const handle = orderCtx.current!;
const lineCtx = handle.getDetail('lines');   // DataContext<OrderLine>
lineCtx.add({ product: 'Widget', qty: 2 });`;

const GET_CHANGES = `// See all pending changes (including nested)
const changes = invoiceCtx.getChanges();
// [
//   {
//     data: { id: '2', ... },
//     state: 'Modified',
//     _modifiedFields: ['status'],
//     children: { lines: [{ data: {...}, state: 'New' }] }
//   }
// ]`;

// ─── Section list ─────────────────────────────────────────────────────────────

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'overview',      label: 'Overview' },
  { id: 'setup',         label: 'Setup' },
  { id: 'load',          label: 'Loading Records' },
  { id: 'navigation',    label: 'Navigation' },
  { id: 'crud',          label: 'CRUD' },
  { id: 'save',          label: 'Saving' },
  { id: 'hooks',         label: 'React Hooks' },
  { id: 'details',       label: 'Detail Contexts' },
  { id: 'get-changes',   label: 'Inspecting Changes' },
  { id: 'api',           label: 'API Reference' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DataContextPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { threshold: 0.2 },
    );
    const sections = mainRef.current?.querySelectorAll('[id]') ?? [];
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Data Context</h1>
        <p className="docs-desc">
          <code>DataContext</code> is a stateful record-management class that wraps any data source,
          adds cursor-style navigation, change tracking, nested detail contexts, and a React-friendly
          subscription model. Use it with the provided hooks to build data-bound views with
          minimal boilerplate.
        </p>

        {/* Overview */}
        <section id="overview" className="demo-section" aria-labelledby="overview-heading">
          <h2 id="overview-heading">Overview</h2>
          <p className="section-desc">Key capabilities at a glance:</p>
          <ul className="docs-list">
            <li><strong>Change tracking</strong> — each record carries a <code>RecordState</code> (<code>New</code>, <code>Modified</code>, <code>Deleted</code>, <code>Unchanged</code>) and a map of modified fields</li>
            <li><strong>Cursor navigation</strong> — <code>first()</code>, <code>next()</code>, <code>previous()</code>, <code>last()</code>, <code>skip()</code></li>
            <li><strong>Nested details</strong> — define child <code>DataContext</code> instances for related collections (master-detail)</li>
            <li><strong>React integration</strong> — <code>subscribe()</code> / <code>getSnapshot()</code> are designed for <code>useSyncExternalStore</code></li>
            <li><strong>Sync/Save</strong> — builds a <code>SyncPayload[]</code> with change metadata and sends it via the data source's <code>sync()</code> method</li>
          </ul>
        </section>

        {/* Setup */}
        <section id="setup" className="demo-section" aria-labelledby="setup-heading">
          <h2 id="setup-heading">Setup</h2>
          <p className="section-desc">
            Create a <code>DataContext</code> once outside your component tree (or in a module-level
            singleton). Pass any <code>IDataSource&lt;T&gt;</code> implementation.
          </p>
          <CodePreview codeOnly={true} code={SETUP} />
        </section>

        {/* Loading */}
        <section id="load" className="demo-section" aria-labelledby="load-heading">
          <h2 id="load-heading">Loading Records</h2>
          <p className="section-desc">
            Records can be loaded imperatively or via the <code>useDataContextLoad</code> hook.
            After loading, the cursor is placed at the first record.
          </p>
          <CodePreview codeOnly={true} code={LOAD} />
        </section>

        {/* Navigation */}
        <section id="navigation" className="demo-section" aria-labelledby="navigation-heading">
          <h2 id="navigation-heading">Navigation</h2>
          <p className="section-desc">
            Navigate through records like a cursor. Each navigation call notifies React subscribers
            so any components using <code>useDataContext</code> automatically re-render.
          </p>
          <CodePreview codeOnly={true} code={NAVIGATION} />
        </section>

        {/* CRUD */}
        <section id="crud" className="demo-section" aria-labelledby="crud-heading">
          <h2 id="crud-heading">CRUD</h2>
          <p className="section-desc">
            All mutations are <em>local</em> until you call <code>save()</code>. The
            <code>RecordHandle</code> returned by <code>ctx.current</code> provides a
            convenient API scoped to the active record.
          </p>
          <CodePreview codeOnly={true} code={CRUD} />
        </section>

        {/* Save */}
        <section id="save" className="demo-section" aria-labelledby="save-heading">
          <h2 id="save-heading">Saving</h2>
          <p className="section-desc">
            <code>save()</code> calls <code>dataSource.sync(payload)</code> with an array of change
            payloads. Each payload includes <code>_state</code> and (for modified records)
            <code>_modifiedFields</code> so the server knows exactly what changed.
          </p>
          <CodePreview codeOnly={true} code={SAVE} />
        </section>

        {/* React Hooks */}
        <section id="hooks" className="demo-section" aria-labelledby="hooks-heading">
          <h2 id="hooks-heading">React Hooks</h2>
          <p className="section-desc">
            Two hooks connect a <code>DataContext</code> to React's rendering cycle:
          </p>
          <ul className="docs-list" style={{ marginBottom: '1rem' }}>
            <li><strong>useDataContext</strong> — subscribes to changes; re-renders on every mutation or navigation</li>
            <li><strong>useDataContextLoad</strong> — also loads data from the source on mount (and again when <code>params</code> changes)</li>
          </ul>
          <CodePreview codeOnly={true} code={USE_DATA_CONTEXT} />
        </section>

        {/* Details */}
        <section id="details" className="demo-section" aria-labelledby="details-heading">
          <h2 id="details-heading">Detail Contexts (Master–Detail)</h2>
          <p className="section-desc">
            Declare related collections in the <code>details</code> config. Each parent record gets
            its own child <code>DataContext</code> retrieved via <code>handle.getDetail()</code> or
            the shorthand property on the handle. Changes in children are included in
            <code>buildSyncPayload()</code> and rolled up into <code>ctx.dirty</code>.
          </p>
          <CodePreview codeOnly={true} code={DETAILS} />
        </section>

        {/* Inspecting Changes */}
        <section id="get-changes" className="demo-section" aria-labelledby="get-changes-heading">
          <h2 id="get-changes-heading">Inspecting Changes</h2>
          <p className="section-desc">
            <code>getChanges()</code> returns a structured diff you can display in a UI or log for
            debugging, without committing anything to the server.
          </p>
          <CodePreview codeOnly={true} code={GET_CHANGES} />
        </section>

        {/* API Reference */}
        <section id="api" className="demo-section" aria-labelledby="api-ref-heading">
          <h2 id="api-ref-heading">API Reference</h2>

          <h3>DataContext&lt;T&gt; — properties</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>data</code></td><td><code>T[]</code></td><td>All non-deleted records</td></tr>
                <tr><td><code>records</code></td><td><code>TrackedRecord&lt;T&gt;[]</code></td><td>All records including deleted</td></tr>
                <tr><td><code>current</code></td><td><code>RecordHandle&lt;T&gt; | null</code></td><td>Handle for the active record</td></tr>
                <tr><td><code>count</code></td><td><code>number</code></td><td>Total record count</td></tr>
                <tr><td><code>empty</code></td><td><code>boolean</code></td><td>True if no records</td></tr>
                <tr><td><code>dirty</code></td><td><code>boolean</code></td><td>Any unsaved changes in this or child contexts</td></tr>
                <tr><td><code>currentDirty</code></td><td><code>boolean</code></td><td>Unsaved changes on the current record</td></tr>
                <tr><td><code>recordNo</code></td><td><code>number</code></td><td>1-based position of the current record</td></tr>
                <tr><td><code>recordIndex</code></td><td><code>number</code></td><td>0-based index of the current record</td></tr>
                <tr><td><code>hasNext</code></td><td><code>boolean</code></td><td>Whether a next record exists</td></tr>
                <tr><td><code>hasPrevious</code></td><td><code>boolean</code></td><td>Whether a previous record exists</td></tr>
                <tr><td><code>idField</code></td><td><code>keyof T</code></td><td>Configured ID field</td></tr>
                <tr><td><code>dataSource</code></td><td><code>IDataSource&lt;T&gt; | undefined</code></td><td>Backing data source</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: '2rem' }}>DataContext&lt;T&gt; — methods</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>load(records?)</code></td><td><code>void</code></td><td>Load records or fetch from source</td></tr>
                <tr><td><code>loadRecords(records)</code></td><td><code>void</code></td><td>Sync-load an array, resets change tracking</td></tr>
                <tr><td><code>loadById(id)</code></td><td><code>Promise&lt;void&gt;</code></td><td>Fetch one record by ID and load it</td></tr>
                <tr><td><code>reload()</code></td><td><code>Promise&lt;void&gt;</code></td><td>Re-fetch the current record from the source</td></tr>
                <tr><td><code>add(data)</code></td><td><code>string</code></td><td>Add a new record, returns its ID</td></tr>
                <tr><td><code>update(id, data)</code></td><td><code>void</code></td><td>Update fields on a record</td></tr>
                <tr><td><code>patch(id, data)</code></td><td><code>void</code></td><td>Update only changed fields</td></tr>
                <tr><td><code>delete(id, cascade?)</code></td><td><code>void</code></td><td>Mark a record deleted</td></tr>
                <tr><td><code>deleteAll()</code></td><td><code>void</code></td><td>Mark all records deleted</td></tr>
                <tr><td><code>clear()</code></td><td><code>void</code></td><td>Remove all records and child contexts</td></tr>
                <tr><td><code>save()</code></td><td><code>Promise&lt;T&gt;</code></td><td>Persist changes via the data source</td></tr>
                <tr><td><code>discardChanges()</code></td><td><code>void</code></td><td>Revert all pending changes</td></tr>
                <tr><td><code>discardRecord(id)</code></td><td><code>void</code></td><td>Revert changes on one record</td></tr>
                <tr><td><code>getChanges()</code></td><td><code>unknown[]</code></td><td>Structured diff of all pending changes</td></tr>
                <tr><td><code>buildSyncPayload()</code></td><td><code>SyncPayload[]</code></td><td>Build the payload for sync</td></tr>
                <tr><td><code>first() / last() / next() / previous()</code></td><td><code>boolean</code></td><td>Cursor navigation; returns false if at boundary</td></tr>
                <tr><td><code>skip(index)</code></td><td><code>boolean</code></td><td>Jump to a 0-based index</td></tr>
                <tr><td><code>subscribe(listener)</code></td><td><code>() =&gt; void</code></td><td>Subscribe to changes; returns an unsubscribe fn</td></tr>
                <tr><td><code>getSnapshot()</code></td><td><code>number</code></td><td>Version counter for <code>useSyncExternalStore</code></td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: '2rem' }}>RecordHandle&lt;T&gt;</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Member</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>id</code></td><td><code>string</code></td><td>Record ID</td></tr>
                <tr><td><code>data</code></td><td><code>T</code></td><td>Current data (merged with in-memory child data)</td></tr>
                <tr><td><code>record</code></td><td><code>TrackedRecord&lt;T&gt;</code></td><td>Raw tracked record</td></tr>
                <tr><td><code>update(data)</code></td><td><code>void</code></td><td>Update this record</td></tr>
                <tr><td><code>patch(data)</code></td><td><code>void</code></td><td>Patch this record</td></tr>
                <tr><td><code>delete(cascade?)</code></td><td><code>void</code></td><td>Mark this record deleted</td></tr>
                <tr><td><code>discard()</code></td><td><code>void</code></td><td>Discard changes on this record</td></tr>
                <tr><td><code>dirty()</code></td><td><code>boolean</code></td><td>True if this record has unsaved changes</td></tr>
                <tr><td><code>getDetail(name)</code></td><td><code>DataContext&lt;TDetail&gt;</code></td><td>Access a child detail context</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: '2rem' }}>DataContextConfig&lt;T&gt;</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>idField</code></td><td><code>keyof T</code></td><td>Required. Field used as the unique record identifier</td></tr>
                <tr><td><code>dataSource</code></td><td><code>IDataSource&lt;T&gt;</code></td><td>Backing data source</td></tr>
                <tr><td><code>navigateDeletedRecords</code></td><td><code>boolean</code></td><td>Include deleted records in navigation (default <code>false</code>)</td></tr>
                <tr><td><code>details</code></td><td><code>DetailDefinitions&lt;T&gt;</code></td><td>Child detail context definitions</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* TOC */}
      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                className={`toc-link${activeSection === s.id ? ' active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
