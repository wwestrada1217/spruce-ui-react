import { useState, useEffect, useRef } from 'react'
import { Datagrid, type ColumnDef, type GridOptions } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

// ── Sample data ──────────────────────────────────────────────────────────────

interface Employee {
  id: number
  name: string
  department: string
  role: string
  salary: number
  status: 'active' | 'inactive' | 'pending'
  performance: number
  location: string
  startDate: string
  email: string
  reports?: Employee[]
}

const DEPTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'DevOps']
const ROLES = ['Senior Engineer', 'Lead Designer', 'Product Manager', 'Data Analyst', 'DevOps Engineer', 'Marketing Specialist', 'Sales Rep', 'HR Manager', 'Frontend Dev', 'Backend Engineer', 'UX Designer', 'Tech Lead']
const LOCS = ['San Francisco', 'New York', 'Austin', 'Seattle', 'Chicago', 'Denver', 'Boston', 'Portland']
const NAMES = ['Alice Chen', 'Bob Martinez', 'Carol Johnson', 'David Kim', 'Emma Wilson', 'Frank Thompson', 'Grace Lee', 'Henry Davis', 'Isabella Brown', 'James Taylor', 'Kate Anderson', 'Liam Jackson', 'Mia White', 'Noah Harris', 'Olivia Martin', 'Paul Garcia', 'Quinn Robinson', 'Rachel Lewis', 'Sam Walker', 'Tina Hall']

function generateEmployees(count: number): Employee[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: NAMES[i % NAMES.length],
    department: DEPTS[i % DEPTS.length],
    role: ROLES[i % ROLES.length],
    salary: 55000 + Math.floor(Math.random() * 95000),
    status: (['active', 'inactive', 'pending'] as const)[i % 3],
    performance: 60 + Math.floor(Math.random() * 40),
    location: LOCS[i % LOCS.length],
    startDate: `202${1 + (i % 4)}-${String((i % 12) + 1).padStart(2, '0')}-15`,
    email: `${NAMES[i % NAMES.length].toLowerCase().replace(' ', '.')}@company.com`,
  }))
}

const EMPLOYEES = generateEmployees(20)
const LARGE_DATA = generateEmployees(5000)

const TREE_DATA: Employee[] = [
  {
    id: 100, name: 'Alice Chen', department: 'Engineering', role: 'VP Engineering',
    salary: 180000, status: 'active', performance: 95, location: 'San Francisco',
    startDate: '2019-03-01', email: 'alice@company.com',
    reports: [
      {
        id: 101, name: 'Bob Martinez', department: 'Engineering', role: 'Tech Lead',
        salary: 145000, status: 'active', performance: 90, location: 'Austin',
        startDate: '2020-06-15', email: 'bob@company.com',
        reports: [
          { id: 102, name: 'Carol Johnson', department: 'Engineering', role: 'Senior Engineer', salary: 125000, status: 'active', performance: 88, location: 'Austin', startDate: '2021-01-10', email: 'carol@company.com' },
          { id: 103, name: 'David Kim', department: 'Engineering', role: 'Senior Engineer', salary: 120000, status: 'active', performance: 85, location: 'Seattle', startDate: '2021-04-20', email: 'david@company.com' },
        ],
      },
      {
        id: 104, name: 'Emma Wilson', department: 'Engineering', role: 'Lead Designer',
        salary: 135000, status: 'active', performance: 92, location: 'New York',
        startDate: '2020-09-01', email: 'emma@company.com',
      },
    ],
  },
  {
    id: 200, name: 'Frank Thompson', department: 'Product', role: 'VP Product',
    salary: 175000, status: 'active', performance: 91, location: 'New York',
    startDate: '2019-05-10', email: 'frank@company.com',
    reports: [
      { id: 201, name: 'Grace Lee', department: 'Product', role: 'Product Manager', salary: 130000, status: 'active', performance: 87, location: 'Chicago', startDate: '2021-02-15', email: 'grace@company.com' },
    ],
  },
]

// ── Code snippets ────────────────────────────────────────────────────────────

const BASIC_CODE = `const columns: ColumnDef<Employee>[] = [
  { field: 'id', headerName: 'ID', width: 60, sortable: true },
  { field: 'name', headerName: 'Name', width: 180, sortable: true },
  { field: 'department', headerName: 'Department', width: 140, sortable: true },
  { field: 'role', headerName: 'Role', width: 180, sortable: true },
  { field: 'salary', headerName: 'Salary', width: 120, sortable: true,
    valueFormatter: (v) => \`$\${Number(v).toLocaleString()}\` },
  { field: 'status', headerName: 'Status', width: 100 },
];

<Datagrid columns={columns} rowData={employees} />`

const SORTING_CODE = `// Single-column sort: click a header
// Multi-column sort: Ctrl+click additional headers
<Datagrid
  columns={columns}
  rowData={employees}
/>`

const FILTERING_INLINE_CODE = `const columns: ColumnDef<Employee>[] = [
  { field: 'name', headerName: 'Name', width: 180,
    sortable: true, filterable: true, filterMode: 'inline' },
  { field: 'department', headerName: 'Department', width: 140,
    sortable: true, filterable: true, filterMode: 'inline' },
  // ...
];

<Datagrid columns={columns} rowData={employees} />`

const FILTERING_POPOVER_CODE = `const columns: ColumnDef<Employee>[] = [
  { field: 'name', headerName: 'Name', width: 180,
    sortable: true, filterable: true },
  { field: 'salary', headerName: 'Salary', width: 120,
    sortable: true, filterable: true },
  // ...
];

<Datagrid columns={columns} rowData={employees}
  options={{ showToolbar: true }} />`

const PAGINATION_CODE = `<Datagrid
  columns={columns}
  rowData={employees}
  options={{
    pagination: true,
    pageSize: 5,
    pageSizeOptions: [5, 10, 20],
  }}
/>`

const SELECTION_CODE = `<Datagrid
  columns={columns}
  rowData={employees}
  options={{
    selectionMode: 'multi',
    rowHover: true,
    onSelectionChange: (rows) => console.log('Selected:', rows),
  }}
/>`

const CELL_EDIT_CODE = `const columns: ColumnDef<Employee>[] = [
  { field: 'id', headerName: 'ID', width: 60 },
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  { field: 'department', headerName: 'Dept', width: 140, editable: true,
    editor: {
      type: 'select',
      options: [
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Product', label: 'Product' },
        { value: 'Design', label: 'Design' },
      ],
    } },
  { field: 'salary', headerName: 'Salary', width: 120, editable: true,
    editor: { type: 'number', min: 30000, max: 300000, step: 1000 } },
];

<Datagrid columns={columns} rowData={employees}
  options={{ editMode: 'cell', editTrigger: 'dblclick' }} />`

const ROW_EDIT_CODE = `<Datagrid columns={columns} rowData={employees}
  options={{ editMode: 'row' }} />`

const PINNED_CODE = `const columns: ColumnDef<Employee>[] = [
  { field: 'id', headerName: 'ID', width: 60, pinned: 'left' },
  { field: 'name', headerName: 'Name', width: 180, pinned: 'left' },
  { field: 'department', headerName: 'Dept', width: 140 },
  { field: 'role', headerName: 'Role', width: 180 },
  { field: 'salary', headerName: 'Salary', width: 120 },
  { field: 'location', headerName: 'Location', width: 140 },
  { field: 'status', headerName: 'Status', width: 100, pinned: 'right' },
];

<Datagrid columns={columns} rowData={employees} />`

const VIRTUAL_CODE = `// Renders only visible rows for 5,000+ row datasets
<Datagrid
  columns={columns}
  rowData={largeData}
  options={{ virtualScroll: true }}
  style={{ height: 400 }}
/>`

const GROUPING_CODE = `<Datagrid
  columns={columns}
  rowData={employees}
  options={{
    groupByField: 'department',
    showToolbar: true,
  }}
/>`

const TREE_CODE = `const treeData = [
  { id: 1, name: 'Alice', role: 'VP', reports: [
    { id: 2, name: 'Bob', role: 'Lead', reports: [
      { id: 3, name: 'Carol', role: 'Engineer' },
    ]},
  ]},
];

<Datagrid columns={columns} rowData={treeData}
  options={{ treeChildrenField: 'reports', showToolbar: true }} />`

const DETAIL_CODE = `<Datagrid columns={columns} rowData={employees}
  options={{
    detailRenderer: ({ row, close }) => (
      <div style={{ padding: 16 }}>
        <h4>{row.name}</h4>
        <p>Email: {row.email}</p>
        <p>Location: {row.location}</p>
        <button onClick={close}>Close</button>
      </div>
    ),
  }}
/>`

const DRAG_CODE = `<Datagrid columns={columns} rowData={employees}
  options={{
    rowDraggable: true,
    onRowDrop: (from, to, newOrder) =>
      console.log('Reordered:', from, to),
  }}
/>`

const TOOLBAR_CODE = `<Datagrid columns={columns} rowData={employees}
  options={{
    showToolbar: true,
    toolbarButtons: [
      { label: 'Export', icon: 'download', action: () => alert('Export') },
      { label: 'Delete', icon: 'trash', variant: 'danger',
        action: () => alert('Delete') },
    ],
  }}
/>`

const DENSITY_CODE = `<Datagrid columns={columns} rowData={employees}
  options={{ density: 'dense' }} />
<Datagrid columns={columns} rowData={employees}
  options={{ density: 'comfortable' }} />`

const AGGREGATE_CODE = `const columns: ColumnDef<Employee>[] = [
  { field: 'name', headerName: 'Name', width: 180,
    aggregate: { type: 'count', label: 'Total: ' } },
  { field: 'salary', headerName: 'Salary', width: 120,
    aggregate: { type: 'avg', label: 'Avg: ',
      formatter: (v) => \`$\${Number(v).toLocaleString()}\` } },
];

<Datagrid columns={columns} rowData={employees}
  options={{ showAggregates: true }} />`

const STRIPED_CODE = `<Datagrid columns={columns} rowData={employees}
  options={{ striped: true }} />

<Datagrid columns={columns} rowData={employees}
  options={{ borderless: true }} />`

// ── Sections ─────────────────────────────────────────────────────────────────

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic Usage' },
  { id: 'sorting', label: 'Sorting' },
  { id: 'filtering', label: 'Filtering' },
  { id: 'pagination', label: 'Pagination' },
  { id: 'selection', label: 'Selection' },
  { id: 'cell-editing', label: 'Cell Editing' },
  { id: 'row-editing', label: 'Row Editing' },
  { id: 'column-pinning', label: 'Column Pinning' },
  { id: 'virtual-scroll', label: 'Virtual Scroll' },
  { id: 'grouping', label: 'Row Grouping' },
  { id: 'tree', label: 'Tree Rows' },
  { id: 'detail', label: 'Detail Panel' },
  { id: 'drag', label: 'Row Drag & Drop' },
  { id: 'toolbar', label: 'Toolbar' },
  { id: 'density', label: 'Density' },
  { id: 'aggregates', label: 'Aggregates' },
  { id: 'striped', label: 'Striped & Borderless' },
  { id: 'api', label: 'API Reference' },
]

// ── Reusable column sets ─────────────────────────────────────────────────────

const basicCols: ColumnDef<Employee>[] = [
  { field: 'id', headerName: 'ID', width: 60, sortable: true },
  { field: 'name', headerName: 'Name', width: 180, sortable: true },
  { field: 'department', headerName: 'Department', width: 140, sortable: true },
  { field: 'role', headerName: 'Role', width: 180, sortable: true },
  { field: 'salary', headerName: 'Salary', width: 120, sortable: true, valueFormatter: (v) => `$${Number(v).toLocaleString()}` },
  { field: 'status', headerName: 'Status', width: 100 },
]

const inlineFilterCols: ColumnDef<Employee>[] = [
  { field: 'id', headerName: 'ID', width: 60 },
  { field: 'name', headerName: 'Name', width: 180, sortable: true, filterable: true, filterMode: 'inline' },
  { field: 'department', headerName: 'Department', width: 140, sortable: true, filterable: true, filterMode: 'inline' },
  { field: 'role', headerName: 'Role', width: 180, sortable: true, filterable: true, filterMode: 'inline' },
  { field: 'salary', headerName: 'Salary', width: 120, valueFormatter: (v) => `$${Number(v).toLocaleString()}` },
]

const popoverFilterCols: ColumnDef<Employee>[] = [
  { field: 'id', headerName: 'ID', width: 60 },
  { field: 'name', headerName: 'Name', width: 180, sortable: true, filterable: true },
  { field: 'department', headerName: 'Department', width: 140, sortable: true, filterable: true },
  { field: 'salary', headerName: 'Salary', width: 120, sortable: true, filterable: true, valueFormatter: (v) => `$${Number(v).toLocaleString()}` },
  { field: 'status', headerName: 'Status', width: 100 },
]

const editableCols: ColumnDef<Employee>[] = [
  { field: 'id', headerName: 'ID', width: 60 },
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  { field: 'department', headerName: 'Dept', width: 140, editable: true, editor: { type: 'select', options: [{ value: 'Engineering', label: 'Engineering' }, { value: 'Product', label: 'Product' }, { value: 'Design', label: 'Design' }, { value: 'Marketing', label: 'Marketing' }] } },
  { field: 'role', headerName: 'Role', width: 180, editable: true },
  { field: 'salary', headerName: 'Salary', width: 120, editable: true, editor: { type: 'number', min: 30000, max: 300000, step: 1000 }, valueFormatter: (v) => `$${Number(v).toLocaleString()}` },
  { field: 'status', headerName: 'Status', width: 100 },
]

const pinnedCols: ColumnDef<Employee>[] = [
  { field: 'id', headerName: 'ID', width: 60, pinned: 'left' },
  { field: 'name', headerName: 'Name', width: 180, pinned: 'left' },
  { field: 'department', headerName: 'Dept', width: 140 },
  { field: 'role', headerName: 'Role', width: 180 },
  { field: 'salary', headerName: 'Salary', width: 120, valueFormatter: (v) => `$${Number(v).toLocaleString()}` },
  { field: 'location', headerName: 'Location', width: 140 },
  { field: 'startDate', headerName: 'Start Date', width: 120 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'status', headerName: 'Status', width: 100, pinned: 'right' },
]

const treeCols: ColumnDef<Employee>[] = [
  { field: 'id', headerName: 'ID', width: 60 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'role', headerName: 'Role', width: 180 },
  { field: 'salary', headerName: 'Salary', width: 120, valueFormatter: (v) => `$${Number(v).toLocaleString()}` },
  { field: 'location', headerName: 'Location', width: 140 },
]

const aggCols: ColumnDef<Employee>[] = [
  { field: 'id', headerName: 'ID', width: 60 },
  { field: 'name', headerName: 'Name', width: 180, aggregate: { type: 'count', label: 'Total: ' } },
  { field: 'department', headerName: 'Dept', width: 140 },
  { field: 'salary', headerName: 'Salary', width: 130, valueFormatter: (v) => `$${Number(v).toLocaleString()}`, aggregate: { type: 'avg', label: 'Avg: ', formatter: (v) => `$${Math.round(Number(v)).toLocaleString()}` } },
  { field: 'performance', headerName: 'Perf', width: 90, aggregate: { type: 'max', label: 'Max: ' } },
]

// ── Component ────────────────────────────────────────────────────────────────

export function DatagridPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const mainRef = useRef<HTMLDivElement>(null)
  const [densityVal, setDensityVal] = useState<'dense' | 'default' | 'comfortable'>('default')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    )
    mainRef.current?.querySelectorAll('section[id]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Datagrid</h1>
        <p className="docs-desc">
          A high-performance data grid with sorting, filtering, pagination, cell/row editing,
          column pinning, virtual scrolling, row grouping, tree rows, detail panels,
          row drag-and-drop, and more.
        </p>

        {/* ── Basic ──────────────────────────────────────────────────────── */}
        <section id="basic" className="demo-section">
          <h2>Basic Usage</h2>
          <p className="section-desc">
            Provide <code>columns</code> and <code>rowData</code> to render a grid.
            Each column definition specifies a field key, header label, width, and optional features.
          </p>
          <CodePreview code={BASIC_CODE}>
            <Datagrid columns={basicCols} rowData={EMPLOYEES} />
          </CodePreview>
        </section>

        {/* ── Sorting ────────────────────────────────────────────────────── */}
        <section id="sorting" className="demo-section">
          <h2>Sorting</h2>
          <p className="section-desc">
            Set <code>sortable: true</code> on column definitions. Click a header to cycle through
            ascending, descending, and unsorted. Hold Ctrl/Cmd and click multiple columns for multi-sort.
          </p>
          <CodePreview code={SORTING_CODE}>
            <Datagrid columns={basicCols} rowData={EMPLOYEES} />
          </CodePreview>
        </section>

        {/* ── Filtering ──────────────────────────────────────────────────── */}
        <section id="filtering" className="demo-section">
          <h2>Filtering</h2>
          <p className="section-desc">
            Set <code>filterable: true</code> on columns. Use <code>filterMode: 'inline'</code> for
            a filter row below the header, or the default <code>'popover'</code> for a filter icon in the header.
          </p>
          <h3>Inline Filters</h3>
          <CodePreview code={FILTERING_INLINE_CODE}>
            <Datagrid columns={inlineFilterCols} rowData={EMPLOYEES} />
          </CodePreview>
          <h3 style={{ marginTop: 24 }}>Popover Filters</h3>
          <CodePreview code={FILTERING_POPOVER_CODE}>
            <Datagrid columns={popoverFilterCols} rowData={EMPLOYEES} options={{ showToolbar: true }} />
          </CodePreview>
        </section>

        {/* ── Pagination ─────────────────────────────────────────────────── */}
        <section id="pagination" className="demo-section">
          <h2>Pagination</h2>
          <p className="section-desc">
            Enable <code>pagination</code> in options with configurable <code>pageSize</code> and
            <code> pageSizeOptions</code>.
          </p>
          <CodePreview code={PAGINATION_CODE}>
            <Datagrid columns={basicCols} rowData={EMPLOYEES} options={{ pagination: true, pageSize: 5, pageSizeOptions: [5, 10, 20] }} />
          </CodePreview>
        </section>

        {/* ── Selection ──────────────────────────────────────────────────── */}
        <section id="selection" className="demo-section">
          <h2>Selection</h2>
          <p className="section-desc">
            Set <code>selectionMode</code> to <code>'single'</code> or <code>'multi'</code>.
            Multi-select supports Shift+click for range selection and Ctrl+click for toggle.
          </p>
          <CodePreview code={SELECTION_CODE}>
            <Datagrid columns={basicCols} rowData={EMPLOYEES} options={{ selectionMode: 'multi', rowHover: true }} />
          </CodePreview>
        </section>

        {/* ── Cell Editing ────────────────────────────────────────────────── */}
        <section id="cell-editing" className="demo-section">
          <h2>Cell Editing</h2>
          <p className="section-desc">
            Set <code>editMode: 'cell'</code> and mark columns as <code>editable: true</code>.
            Supports text, number, select, date, boolean, and textarea editor types.
            Double-click a cell to edit (or set <code>editTrigger: 'click'</code>).
          </p>
          <CodePreview code={CELL_EDIT_CODE}>
            <Datagrid columns={editableCols} rowData={EMPLOYEES.slice(0, 8)} options={{ editMode: 'cell', editTrigger: 'dblclick' }} />
          </CodePreview>
        </section>

        {/* ── Row Editing ─────────────────────────────────────────────────── */}
        <section id="row-editing" className="demo-section">
          <h2>Row Editing</h2>
          <p className="section-desc">
            Set <code>editMode: 'row'</code> for full-row editing. An action column appears with
            edit, save, and cancel buttons. Double-click a row to enter edit mode.
          </p>
          <CodePreview code={ROW_EDIT_CODE}>
            <Datagrid columns={editableCols} rowData={EMPLOYEES.slice(0, 8)} options={{ editMode: 'row' }} />
          </CodePreview>
        </section>

        {/* ── Column Pinning ──────────────────────────────────────────────── */}
        <section id="column-pinning" className="demo-section">
          <h2>Column Pinning</h2>
          <p className="section-desc">
            Set <code>pinned: 'left'</code> or <code>pinned: 'right'</code> on columns to
            freeze them while scrolling horizontally.
          </p>
          <CodePreview code={PINNED_CODE}>
            <Datagrid columns={pinnedCols} rowData={EMPLOYEES} />
          </CodePreview>
        </section>

        {/* ── Virtual Scroll ──────────────────────────────────────────────── */}
        <section id="virtual-scroll" className="demo-section">
          <h2>Virtual Scroll</h2>
          <p className="section-desc">
            Enable <code>virtualScroll: true</code> for datasets with thousands of rows.
            Only visible rows are rendered in the DOM, providing smooth 60fps scrolling.
          </p>
          <CodePreview code={VIRTUAL_CODE}>
            <Datagrid
              columns={basicCols}
              rowData={LARGE_DATA}
              options={{ virtualScroll: true }}
              style={{ height: 400 }}
            />
          </CodePreview>
        </section>

        {/* ── Row Grouping ────────────────────────────────────────────────── */}
        <section id="grouping" className="demo-section">
          <h2>Row Grouping</h2>
          <p className="section-desc">
            Set <code>groupByField</code> to group rows by a column value.
            Group headers are collapsible and show the row count.
          </p>
          <CodePreview code={GROUPING_CODE}>
            <Datagrid columns={basicCols} rowData={EMPLOYEES} options={{ groupByField: 'department', showToolbar: true }} />
          </CodePreview>
        </section>

        {/* ── Tree Rows ───────────────────────────────────────────────────── */}
        <section id="tree" className="demo-section">
          <h2>Tree Rows</h2>
          <p className="section-desc">
            Set <code>treeChildrenField</code> to the property containing child rows.
            Tree nodes are expandable/collapsible with indented display.
          </p>
          <CodePreview code={TREE_CODE}>
            <Datagrid columns={treeCols} rowData={TREE_DATA} options={{ treeChildrenField: 'reports', showToolbar: true }} />
          </CodePreview>
        </section>

        {/* ── Detail Panel ────────────────────────────────────────────────── */}
        <section id="detail" className="demo-section">
          <h2>Detail Panel</h2>
          <p className="section-desc">
            Provide a <code>detailRenderer</code> function to display expandable detail content below each row.
            Click the expand button to toggle.
          </p>
          <CodePreview code={DETAIL_CODE}>
            <Datagrid
              columns={basicCols}
              rowData={EMPLOYEES.slice(0, 8)}
              options={{
                detailRenderer: ({ row, close }) => (
                  <div style={{ padding: 16, fontSize: 13 }}>
                    <strong>{(row as Employee).name}</strong> &mdash; {(row as Employee).email}
                    <span style={{ marginLeft: 12, color: 'var(--sp-text-subtle)' }}>
                      {(row as Employee).location} | Started {(row as Employee).startDate}
                    </span>
                    <button onClick={close} style={{ marginLeft: 12, cursor: 'pointer', fontSize: 11, border: '1px solid var(--sp-border)', borderRadius: 4, padding: '2px 8px', background: 'transparent' }}>
                      Close
                    </button>
                  </div>
                ),
              }}
            />
          </CodePreview>
        </section>

        {/* ── Row Drag & Drop ─────────────────────────────────────────────── */}
        <section id="drag" className="demo-section">
          <h2>Row Drag & Drop</h2>
          <p className="section-desc">
            Set <code>rowDraggable: true</code> to allow reordering rows via drag handle.
          </p>
          <CodePreview code={DRAG_CODE}>
            <Datagrid columns={basicCols} rowData={EMPLOYEES.slice(0, 8)} options={{ rowDraggable: true }} />
          </CodePreview>
        </section>

        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        <section id="toolbar" className="demo-section">
          <h2>Toolbar</h2>
          <p className="section-desc">
            Enable <code>showToolbar: true</code> to display the toolbar with column panel, filter badges,
            and custom action buttons.
          </p>
          <CodePreview code={TOOLBAR_CODE}>
            <Datagrid
              columns={popoverFilterCols}
              rowData={EMPLOYEES}
              options={{
                showToolbar: true,
                toolbarButtons: [
                  { label: 'Export', icon: 'download', action: () => alert('Export clicked') },
                  { label: 'Delete', icon: 'trash', variant: 'danger', action: () => alert('Delete clicked') },
                ],
              }}
            />
          </CodePreview>
        </section>

        {/* ── Density ─────────────────────────────────────────────────────── */}
        <section id="density" className="demo-section">
          <h2>Density</h2>
          <p className="section-desc">
            Control row height with <code>density</code>: <code>'dense'</code> (26px),
            <code>'default'</code> (32px), or <code>'comfortable'</code> (38px).
          </p>
          <CodePreview code={DENSITY_CODE}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {(['dense', 'default', 'comfortable'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDensityVal(d)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--sp-border-strong)',
                    background: densityVal === d ? 'var(--sp-primary)' : 'transparent',
                    color: densityVal === d ? '#fff' : 'var(--sp-text-color)',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
            <Datagrid columns={basicCols} rowData={EMPLOYEES.slice(0, 6)} options={{ density: densityVal }} />
          </CodePreview>
        </section>

        {/* ── Aggregates ──────────────────────────────────────────────────── */}
        <section id="aggregates" className="demo-section">
          <h2>Aggregates</h2>
          <p className="section-desc">
            Set <code>showAggregates: true</code> and define <code>aggregate</code> on columns.
            Supports sum, avg, min, max, count, and custom aggregation functions.
          </p>
          <CodePreview code={AGGREGATE_CODE}>
            <Datagrid columns={aggCols} rowData={EMPLOYEES} options={{ showAggregates: true }} />
          </CodePreview>
        </section>

        {/* ── Striped & Borderless ────────────────────────────────────────── */}
        <section id="striped" className="demo-section">
          <h2>Striped & Borderless</h2>
          <p className="section-desc">
            Use <code>striped: true</code> for alternating row backgrounds, or <code>borderless: true</code> for
            a clean flat look without internal borders.
          </p>
          <CodePreview code={STRIPED_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--sp-text-muted)', marginBottom: 8 }}>Striped</p>
                <Datagrid columns={basicCols} rowData={EMPLOYEES.slice(0, 6)} options={{ striped: true }} />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--sp-text-muted)', marginBottom: 8 }}>Borderless</p>
                <Datagrid columns={basicCols} rowData={EMPLOYEES.slice(0, 6)} options={{ borderless: true }} />
              </div>
            </div>
          </CodePreview>
        </section>

        {/* ── API Reference ───────────────────────────────────────────────── */}
        <section id="api" className="demo-section">
          <h2>API Reference</h2>

          <h3>DatagridProps</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>columns</code></td><td><code>ColumnDef&lt;T&gt;[]</code></td><td>Required</td><td>Column definitions array</td></tr>
                <tr><td><code>rowData</code></td><td><code>T[]</code></td><td><code>[]</code></td><td>Data rows</td></tr>
                <tr><td><code>options</code></td><td><code>GridOptions&lt;T&gt;</code></td><td><code>{'{}'}</code></td><td>Grid configuration options</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: 24 }}>ColumnDef&lt;T&gt;</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>field</code></td><td><code>string</code></td><td>Required</td><td>Row data property key</td></tr>
                <tr><td><code>headerName</code></td><td><code>string</code></td><td>field</td><td>Column header label</td></tr>
                <tr><td><code>width</code></td><td><code>number</code></td><td>150</td><td>Column width in px</td></tr>
                <tr><td><code>minWidth</code></td><td><code>number</code></td><td>60</td><td>Minimum column width</td></tr>
                <tr><td><code>maxWidth</code></td><td><code>number</code></td><td>2000</td><td>Maximum column width</td></tr>
                <tr><td><code>visible</code></td><td><code>boolean</code></td><td>true</td><td>Column visibility</td></tr>
                <tr><td><code>sortable</code></td><td><code>boolean</code></td><td>false</td><td>Enable sorting</td></tr>
                <tr><td><code>resizable</code></td><td><code>boolean</code></td><td>true</td><td>Enable column resize</td></tr>
                <tr><td><code>editable</code></td><td><code>boolean</code></td><td>false</td><td>Enable cell editing</td></tr>
                <tr><td><code>filterable</code></td><td><code>boolean</code></td><td>false</td><td>Enable column filtering</td></tr>
                <tr><td><code>filterMode</code></td><td><code>'inline' | 'popover'</code></td><td>'popover'</td><td>Filter UI style</td></tr>
                <tr><td><code>pinned</code></td><td><code>'left' | 'right' | null</code></td><td>null</td><td>Pin column position</td></tr>
                <tr><td><code>valueFormatter</code></td><td><code>(value, row) =&gt; string</code></td><td>&mdash;</td><td>Format display value</td></tr>
                <tr><td><code>cellRenderer</code></td><td><code>(value, row) =&gt; ReactNode</code></td><td>&mdash;</td><td>Custom cell render function</td></tr>
                <tr><td><code>editor</code></td><td><code>CellEditorConfig</code></td><td>&mdash;</td><td>Editor configuration</td></tr>
                <tr><td><code>aggregate</code></td><td><code>AggregateConfig</code></td><td>&mdash;</td><td>Aggregate function</td></tr>
                <tr><td><code>wrapText</code></td><td><code>boolean</code></td><td>false</td><td>Allow text wrapping</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: 24 }}>GridOptions&lt;T&gt;</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>density</code></td><td><code>'dense' | 'default' | 'comfortable'</code></td><td>'default'</td><td>Row density</td></tr>
                <tr><td><code>striped</code></td><td><code>boolean</code></td><td>false</td><td>Alternating row backgrounds</td></tr>
                <tr><td><code>borderless</code></td><td><code>boolean</code></td><td>false</td><td>Remove internal borders</td></tr>
                <tr><td><code>autoFit</code></td><td><code>boolean</code></td><td>false</td><td>Columns fill available width</td></tr>
                <tr><td><code>virtualScroll</code></td><td><code>boolean</code></td><td>false</td><td>Enable virtual scrolling</td></tr>
                <tr><td><code>selectionMode</code></td><td><code>'none' | 'single' | 'multi'</code></td><td>'none'</td><td>Row selection mode</td></tr>
                <tr><td><code>rowHover</code></td><td><code>boolean</code></td><td>false</td><td>Highlight row on hover</td></tr>
                <tr><td><code>editMode</code></td><td><code>'cell' | 'row'</code></td><td>&mdash;</td><td>Editing mode</td></tr>
                <tr><td><code>editTrigger</code></td><td><code>'click' | 'dblclick'</code></td><td>'dblclick'</td><td>How to open cell editor</td></tr>
                <tr><td><code>editOnType</code></td><td><code>boolean</code></td><td>false</td><td>Open editor on keypress</td></tr>
                <tr><td><code>keyboardNav</code></td><td><code>boolean</code></td><td>false</td><td>Arrow key cell navigation</td></tr>
                <tr><td><code>pagination</code></td><td><code>boolean</code></td><td>false</td><td>Enable pagination</td></tr>
                <tr><td><code>pageSize</code></td><td><code>number</code></td><td>50</td><td>Rows per page</td></tr>
                <tr><td><code>pageSizeOptions</code></td><td><code>number[]</code></td><td>[10,25,50,100]</td><td>Page size options</td></tr>
                <tr><td><code>showToolbar</code></td><td><code>boolean</code></td><td>false</td><td>Show toolbar</td></tr>
                <tr><td><code>toolbarButtons</code></td><td><code>GridToolbarButton[]</code></td><td>&mdash;</td><td>Custom toolbar buttons</td></tr>
                <tr><td><code>colReorder</code></td><td><code>boolean</code></td><td>false</td><td>Enable column reorder</td></tr>
                <tr><td><code>rowDraggable</code></td><td><code>boolean</code></td><td>false</td><td>Enable row drag</td></tr>
                <tr><td><code>groupByField</code></td><td><code>string</code></td><td>&mdash;</td><td>Group rows by field</td></tr>
                <tr><td><code>treeChildrenField</code></td><td><code>string</code></td><td>&mdash;</td><td>Tree children property</td></tr>
                <tr><td><code>detailRenderer</code></td><td><code>(ctx) =&gt; ReactNode</code></td><td>&mdash;</td><td>Row detail panel renderer</td></tr>
                <tr><td><code>showAggregates</code></td><td><code>boolean</code></td><td>false</td><td>Show aggregate row</td></tr>
                <tr><td><code>loading</code></td><td><code>boolean</code></td><td>false</td><td>Show loading state</td></tr>
                <tr><td><code>emptyMessage</code></td><td><code>string</code></td><td>'No data to display'</td><td>Empty state message</td></tr>
                <tr><td><code>infiniteScroll</code></td><td><code>boolean</code></td><td>false</td><td>Enable infinite scroll</td></tr>
                <tr><td><code>serverSide</code></td><td><code>boolean</code></td><td>false</td><td>Server-side mode</td></tr>
                <tr><td><code>fetchRows</code></td><td><code>(params) =&gt; Promise</code></td><td>&mdash;</td><td>Server fetch function</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: 24 }}>Callback Options</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>onRowClick</code></td><td><code>(row, index) =&gt; void</code></td><td>Row click handler</td></tr>
                <tr><td><code>onRowDblClick</code></td><td><code>(row, index) =&gt; void</code></td><td>Row double-click handler</td></tr>
                <tr><td><code>onCellClick</code></td><td><code>(value, field, row) =&gt; void</code></td><td>Cell click handler</td></tr>
                <tr><td><code>onSelectionChange</code></td><td><code>(rows) =&gt; void</code></td><td>Selection change handler</td></tr>
                <tr><td><code>onCellEdit</code></td><td><code>(event) =&gt; void</code></td><td>Cell edit commit handler</td></tr>
                <tr><td><code>onRowEdit</code></td><td><code>(event) =&gt; void</code></td><td>Row edit commit handler</td></tr>
                <tr><td><code>onFilterChange</code></td><td><code>(filters) =&gt; void</code></td><td>Filter change handler</td></tr>
                <tr><td><code>onSortChange</code></td><td><code>(sort) =&gt; void</code></td><td>Sort change handler</td></tr>
                <tr><td><code>onPageChange</code></td><td><code>(state) =&gt; void</code></td><td>Page change handler</td></tr>
                <tr><td><code>onRowDrop</code></td><td><code>(from, to, newOrder) =&gt; void</code></td><td>Row drop handler</td></tr>
                <tr><td><code>onColumnStateChange</code></td><td><code>(states) =&gt; void</code></td><td>Column state change handler</td></tr>
                <tr><td><code>onColReorder</code></td><td><code>(fields) =&gt; void</code></td><td>Column reorder handler</td></tr>
                <tr><td><code>onNewRow</code></td><td><code>(draft) =&gt; void</code></td><td>New row commit handler</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ── Table of Contents ─────────────────────────────────────────── */}
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
  )
}
