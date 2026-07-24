import { useState, useEffect, useRef } from 'react';
import { CodePreview } from '../../components/CodePreview';

// ─── Code samples ──────────────────────────────────────────────────────────────

const ARRAY_BASIC = `import { ArrayDataSource, createArrayDataSource } from 'spruce-react/data';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

const source = createArrayDataSource<Product>([
  { id: '1', name: 'Widget A', price: 19.99, category: 'Widgets' },
  { id: '2', name: 'Gadget B', price: 49.99, category: 'Gadgets' },
  { id: '3', name: 'Widget C', price: 9.99,  category: 'Widgets' },
]);

// Read — paginated
const page = await source.read({ pageNumber: 1, pageSize: 10 });
// { data: [...], totalRecords: 3, totalPages: 1, ... }

// Read — filter + sort
const filtered = await source.read({
  filter: "category = 'Widgets'",
  sortBy: 'price:asc',
});

// Create
const newProduct = await source.create({ name: 'Thing D', price: 5, category: 'Things' });

// Update
const updated = await source.update({ id: '1', price: 24.99 });

// Patch
const patched = await source.patch('2', { price: 39.99 });

// Delete
await source.delete({ id: '3' });`;

const ARRAY_SEARCH = `// Full-text search (searches all fields)
const results = await source.search('widget');

// Search specific fields
const byName = await source.search('widget', ['name', 'category']);

// Search + pagination
const paged = await source.search('widget', ['name'], { pageNumber: 1, pageSize: 5 });`;

const ARRAY_BATCH = `// Atomic batch — all succeed or all roll back
const response = await source.batch({
  operations: [
    { operation: 'create', data: { name: 'New Item', price: 10, category: 'X' } },
    { operation: 'update', data: { id: '2', price: 55 } },
    { operation: 'delete', data: { id: '3' } },
  ],
});
// { results: [...], totalCreated: 1, totalUpdated: 1, totalDeleted: 1, totalFailed: 0 }`;

const API_SOURCE = `import { ApiDataSource, createApiDataSource } from 'spruce-react/data';

// Quick creation
const source = createApiDataSource<Product>('https://api.example.com', '/products');

// Full options
const source = new ApiDataSource<Product>({
  baseUrl: 'https://api.example.com',
  endpoint: '/products',
  headers: { Authorization: 'Bearer token123' },
  idField: 'productId',       // defaults to 'id'
  mapResponse: (raw) => ({    // transform non-standard list response shapes
    data: (raw as any).items,
    totalRecords: (raw as any).count,
    pageNumber: 1, pageSize: 20, totalPages: 1,
    hasPrevious: false, hasNext: false,
  }),
  mapItem: (raw) => raw as Product,
});

// All IDataSource methods work the same as ArrayDataSource
const page = await source.read({ pageSize: 20, sortBy: 'name:asc' });
const item = await source.getById('42');
await source.create({ name: 'New Product', price: 9.99, category: 'A' });`;

const HTTP_SOURCE = `import { HttpDataSource, createHttpDataSource } from 'spruce-react/data';

// Each URL is independent — useful when your API is not REST-conventional
const source = createHttpDataSource<Product>(
  {
    read:   'https://api.example.com/products',
    create: 'https://api.example.com/products/new',
    update: 'https://api.example.com/products/{id}',
    delete: 'https://api.example.com/products/{id}/remove',
    search: 'https://api.example.com/products/search',
    batch:  'https://api.example.com/products/bulk',
  },
  {
    headers: { 'X-Api-Key': 'my-key' },
  },
);`;

const INTERCEPTORS = `import type { DataSourceInterceptor } from 'spruce-react/data';

// Auth interceptor — adds a bearer token before every request
const authInterceptor: DataSourceInterceptor = (ctx, next) => {
  return next({
    ...ctx,
    headers: { ...ctx.headers, Authorization: \`Bearer \${getAccessToken()}\` },
  });
};

// Logging interceptor
const loggingInterceptor: DataSourceInterceptor = async (ctx, next) => {
  console.log(\`[HTTP] \${ctx.method} \${ctx.url}\`);
  const result = await next(ctx);
  console.log('[HTTP] done');
  return result;
};

const source = new ApiDataSource<Product>({
  baseUrl: 'https://api.example.com',
  endpoint: '/products',
  interceptors: [loggingInterceptor, authInterceptor],  // executed in order
});`;

const FILTER_STRING = `// Simple equality
const paid = await source.read({ filter: "status = 'Paid'" });

// Comparison operators
const expensive = await source.read({ filter: "price > 100" });

// Compound with AND / OR
const result = await source.read({
  filter: "(status = 'Active' AND price > 50) OR featured = true",
});

// Contains / StartsWith / EndsWith
const named = await source.read({ filter: "name CONTAINS 'widget'" });`;

const FILTER_OBJECT = `import { Filter, FilterBuilder } from 'spruce-react/data';

// FilterBuilder fluent API
const expr = new FilterBuilder()
  .where('status', '=', 'Active')
  .and('price', '>', 50)
  .build();

const result = await source.read({ filter: expr });

// Or plain object
const result2 = await source.read({
  filter: {
    logic: 'and',
    filters: [
      { field: 'status', operator: '=', value: 'Active' },
      { field: 'price',  operator: '>',  value: 50 },
    ],
  },
});`;

const USE_DATA_SOURCE = `import { useDataSource, createApiDataSource } from 'spruce-react/data';

const productSource = createApiDataSource<Product>('https://api.example.com', '/products');

function ProductList() {
  const { data, loading, error, total, refetch } = useDataSource(
    () => productSource.read({ pageSize: 20 }),
    [],  // deps — refetch when these change
  );

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error.message}</p>;

  return (
    <>
      <p>{total} products</p>
      <ul>
        {data.map((p) => <li key={p.id}>{p.name} — \${p.price}</li>)}
      </ul>
      <button onClick={refetch}>Refresh</button>
    </>
  );
}`;

// ─── Section list ─────────────────────────────────────────────────────────────

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'overview',       label: 'Overview' },
  { id: 'array',          label: 'ArrayDataSource' },
  { id: 'array-search',   label: 'Search' },
  { id: 'array-batch',    label: 'Batch Operations' },
  { id: 'api-source',     label: 'ApiDataSource' },
  { id: 'http-source',    label: 'HttpDataSource' },
  { id: 'interceptors',   label: 'Interceptors' },
  { id: 'filter-string',  label: 'Filter — String' },
  { id: 'filter-object',  label: 'Filter — Object' },
  { id: 'use-data-source',label: 'useDataSource hook' },
  { id: 'api',            label: 'API Reference' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DataSourcePage() {
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
        <h1>Data Sources</h1>
        <p className="docs-desc">
          Data sources provide a uniform, Promise-based API for reading, writing, searching,
          and batch-operating on collections of records — whether the data lives in memory,
          a REST API, or any other backing store.
        </p>

        {/* Overview */}
        <section id="overview" className="demo-section" aria-labelledby="overview-heading">
          <h2 id="overview-heading">Overview</h2>
          <p className="section-desc">
            All data sources implement <code>IDataSource&lt;T&gt;</code>, which extends four
            composable interfaces:
          </p>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Interface</th><th>Methods</th></tr></thead>
              <tbody>
                <tr><td><code>IReadableDataSource</code></td><td><code>read</code>, <code>getById</code>, <code>search</code></td></tr>
                <tr><td><code>IWritableDataSource</code></td><td><code>create</code>, <code>update</code>, <code>patch</code>, <code>delete</code></td></tr>
                <tr><td><code>IBatchDataSource</code></td><td><code>batchCreate</code>, <code>batchUpdate</code>, <code>batchDelete</code>, <code>batch</code></td></tr>
                <tr><td><code>ISyncableDataSource</code></td><td><code>sync</code></td></tr>
              </tbody>
            </table>
          </div>
          <p className="section-desc" style={{ marginTop: '1rem' }}>
            Three concrete implementations are available:
          </p>
          <ul className="docs-list">
            <li><strong>ArrayDataSource</strong> — in-memory, great for prototyping and offline-first scenarios</li>
            <li><strong>ApiDataSource</strong> — REST API with a conventional base URL + endpoint pattern</li>
            <li><strong>HttpDataSource</strong> — REST API with fully independent URLs per operation</li>
          </ul>
        </section>

        {/* ArrayDataSource */}
        <section id="array" className="demo-section" aria-labelledby="array-heading">
          <h2 id="array-heading">ArrayDataSource</h2>
          <p className="section-desc">
            Stores records in memory. Supports filtering, sorting, pagination, and full CRUD — no
            network required.
          </p>
          <CodePreview codeOnly={true} code={ARRAY_BASIC} />
        </section>

        {/* Search */}
        <section id="array-search" className="demo-section" aria-labelledby="array-search-heading">
          <h2 id="array-search-heading">Search</h2>
          <p className="section-desc">
            <code>search()</code> performs full-text matching across all string fields or a subset
            you specify. It is a convenience wrapper around <code>read()</code> with
            <code>searchTerm</code> / <code>searchFields</code> params.
          </p>
          <CodePreview codeOnly={true} code={ARRAY_SEARCH} />
        </section>

        {/* Batch */}
        <section id="array-batch" className="demo-section" aria-labelledby="array-batch-heading">
          <h2 id="array-batch-heading">Batch Operations</h2>
          <p className="section-desc">
            <code>batch()</code> executes multiple creates, updates, and deletes atomically. In
            <code>ArrayDataSource</code> the entire operation rolls back if any step throws. HTTP
            sources delegate atomicity to the server.
          </p>
          <CodePreview codeOnly={true} code={ARRAY_BATCH} />
        </section>

        {/* ApiDataSource */}
        <section id="api-source" className="demo-section" aria-labelledby="api-source-heading">
          <h2 id="api-source-heading">ApiDataSource</h2>
          <p className="section-desc">
            Targets a REST API following the conventional <code>baseUrl + endpoint</code> pattern
            (e.g. <code>GET /products</code>, <code>POST /products</code>,
            <code>PUT /products/&#123;id&#125;</code>). Query params are serialized automatically
            from <code>DataSourceQueryParams</code>.
          </p>
          <CodePreview codeOnly={true} code={API_SOURCE} />
        </section>

        {/* HttpDataSource */}
        <section id="http-source" className="demo-section" aria-labelledby="http-source-heading">
          <h2 id="http-source-heading">HttpDataSource</h2>
          <p className="section-desc">
            Gives full URL independence — useful when your backend deviates from REST conventions
            or when operations live on different hosts. Use <code>&#123;id&#125;</code> as a
            placeholder in URLs and it will be substituted automatically.
          </p>
          <CodePreview codeOnly={true} code={HTTP_SOURCE} />
        </section>

        {/* Interceptors */}
        <section id="interceptors" className="demo-section" aria-labelledby="interceptors-heading">
          <h2 id="interceptors-heading">Interceptors</h2>
          <p className="section-desc">
            Interceptors form a middleware chain around every HTTP request. Each interceptor
            receives the request context and a <code>next()</code> function. Call <code>next(ctx)</code> to
            forward the (optionally modified) request to the next interceptor or the actual fetch.
          </p>
          <CodePreview codeOnly={true} code={INTERCEPTORS} />
        </section>

        {/* Filter — string */}
        <section id="filter-string" className="demo-section" aria-labelledby="filter-string-heading">
          <h2 id="filter-string-heading">Filter — String Syntax</h2>
          <p className="section-desc">
            Pass a concise expression string. Supports <code>=</code>, <code>!=</code>,{' '}
            <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>,{' '}
            <code>CONTAINS</code>, <code>STARTSWITH</code>, <code>ENDSWITH</code>,{' '}
            <code>IS NULL</code>, <code>IS NOT NULL</code>, <code>IS BLANK</code>, and{' '}
            <code>IS NOT BLANK</code>. Combine conditions with <code>AND</code> / <code>OR</code> and
            group with parentheses.
          </p>
          <CodePreview codeOnly={true} code={FILTER_STRING} />
        </section>

        {/* Filter — object */}
        <section id="filter-object" className="demo-section" aria-labelledby="filter-object-heading">
          <h2 id="filter-object-heading">Filter — Object / Builder</h2>
          <p className="section-desc">
            Prefer a type-safe, composable approach? Use the <code>FilterBuilder</code> or pass a
            plain <code>FilterExpression</code> object. Nested groups with mixed <code>and</code> /
            <code>or</code> logic are supported.
          </p>
          <CodePreview codeOnly={true} code={FILTER_OBJECT} />
        </section>

        {/* useDataSource */}
        <section id="use-data-source" className="demo-section" aria-labelledby="use-data-source-heading">
          <h2 id="use-data-source-heading">useDataSource hook</h2>
          <p className="section-desc">
            A lightweight React hook that calls any async function returning a
            <code>DataSourcePagedResponse&lt;T&gt;</code> and tracks loading / error / refetch state.
            It is independent of <code>DataContext</code> — use it for simple read-only scenarios.
          </p>
          <CodePreview codeOnly={true} code={USE_DATA_SOURCE} />
        </section>

        {/* API Reference */}
        <section id="api" className="demo-section" aria-labelledby="api-heading">
          <h2 id="api-heading">API Reference</h2>

          <h3>IDataSource&lt;T&gt; methods</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Method</th><th>Signature</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>read</code></td><td><code>(params?) =&gt; Promise&lt;DataSourcePagedResponse&lt;T&gt;&gt;</code></td><td>Fetch a page of records</td></tr>
                <tr><td><code>getById</code></td><td><code>(id) =&gt; Promise&lt;T&gt;</code></td><td>Fetch a single record by ID</td></tr>
                <tr><td><code>search</code></td><td><code>(query, fields?, params?) =&gt; Promise&lt;DataSourcePagedResponse&lt;T&gt;&gt;</code></td><td>Full-text search</td></tr>
                <tr><td><code>create</code></td><td><code>(item) =&gt; Promise&lt;T&gt;</code></td><td>Create a new record</td></tr>
                <tr><td><code>update</code></td><td><code>(item) =&gt; Promise&lt;T&gt;</code></td><td>Replace a record</td></tr>
                <tr><td><code>patch</code></td><td><code>(id, changes) =&gt; Promise&lt;T&gt;</code></td><td>Partial update</td></tr>
                <tr><td><code>delete</code></td><td><code>(item) =&gt; Promise&lt;void&gt;</code></td><td>Delete a record</td></tr>
                <tr><td><code>batchCreate</code></td><td><code>(items) =&gt; Promise&lt;T[]&gt;</code></td><td>Create multiple records</td></tr>
                <tr><td><code>batchUpdate</code></td><td><code>(items) =&gt; Promise&lt;T[]&gt;</code></td><td>Update multiple records</td></tr>
                <tr><td><code>batchDelete</code></td><td><code>(items) =&gt; Promise&lt;void&gt;</code></td><td>Delete multiple records</td></tr>
                <tr><td><code>batch</code></td><td><code>(request) =&gt; Promise&lt;BatchOperationResponse&lt;T&gt;&gt;</code></td><td>Atomic mixed-operation batch</td></tr>
                <tr><td><code>sync</code></td><td><code>(payloads) =&gt; Promise&lt;T&gt;</code></td><td>Send sync payloads (used by DataContext.save)</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: '2rem' }}>DataSourceQueryParams</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>pageNumber</code></td><td><code>number</code></td><td>1-based page number</td></tr>
                <tr><td><code>pageSize</code></td><td><code>number</code></td><td>Records per page</td></tr>
                <tr><td><code>sortBy</code></td><td><code>string</code></td><td>Sort expression, e.g. <code>'name:asc,price:desc'</code></td></tr>
                <tr><td><code>filter</code></td><td><code>string | FilterExpression</code></td><td>Filter expression</td></tr>
                <tr><td><code>searchTerm</code></td><td><code>string</code></td><td>Full-text search term</td></tr>
                <tr><td><code>searchFields</code></td><td><code>string</code></td><td>Comma-separated field names to search</td></tr>
                <tr><td><code>fields</code></td><td><code>string</code></td><td>Comma-separated field projection</td></tr>
                <tr><td><code>include</code></td><td><code>string</code></td><td>Navigation properties to include</td></tr>
                <tr><td><code>custom</code></td><td><code>Record&lt;string, string | number | boolean&gt;</code></td><td>Extra query params</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: '2rem' }}>useDataSource return value</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>data</code></td><td><code>T[]</code></td><td>Current page of records</td></tr>
                <tr><td><code>loading</code></td><td><code>boolean</code></td><td>True while fetching</td></tr>
                <tr><td><code>error</code></td><td><code>Error | null</code></td><td>Last fetch error</td></tr>
                <tr><td><code>total</code></td><td><code>number</code></td><td>Total matching records</td></tr>
                <tr><td><code>refetch</code></td><td><code>() =&gt; void</code></td><td>Manually re-trigger the fetch</td></tr>
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
