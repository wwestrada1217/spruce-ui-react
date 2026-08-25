import { useRef, useState } from 'react'
import {
  Datagridex,
  DatagridexCellEditor,
  DatagridexCellTemplate,
  DatagridexDetailPane,
  DatagridexLeadingRowActions,
  DatagridexRowDetail,
  type DatagridexColumn,
  type DatagridexHandle,
} from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

interface Project {
  id: number
  name: string
  owner: string
  status: 'active' | 'paused' | 'complete'
  budget: number
  description: string
}

const PROJECTS: Project[] = [
  { id: 1, name: 'Atlas redesign', owner: 'Mina Patel', status: 'active', budget: 82000, description: 'Refresh the core workspace experience.' },
  { id: 2, name: 'Mobile foundation', owner: 'Jon Bell', status: 'paused', budget: 41000, description: 'Shared responsive primitives for product teams.' },
  { id: 3, name: 'Billing migration', owner: 'Rae Chen', status: 'complete', budget: 126000, description: 'Move legacy invoices onto the new ledger.' },
  { id: 4, name: 'Support console', owner: 'Mina Patel', status: 'active', budget: 68000, description: 'Give support a faster customer timeline.' },
]

const COLUMNS: readonly DatagridexColumn<Project>[] = [
  { key: 'name', header: 'Project', editable: true, filterable: true, pinned: 'left' },
  { key: 'owner', header: 'Owner', filterable: true, filterVariant: 'dynamic' },
  { key: 'status', header: 'Status', editable: true, editorType: 'select', editorOptions: { options: [
    { label: 'Active', value: 'active' },
    { label: 'Paused', value: 'paused' },
    { label: 'Complete', value: 'complete' },
  ] } },
  { key: 'budget', header: 'Budget', align: 'end', editable: true, editorType: 'number', aggregate: { type: 'sum', label: 'Total' }, valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}` },
]

const BASIC_CODE = `interface Project { name: string; owner: string; budget: number }

const columns: DatagridexColumn<Project>[] = [
  { key: 'name', header: 'Project', sortable: true },
  { key: 'owner', header: 'Owner', filterable: true },
  { key: 'budget', header: 'Budget', align: 'end' },
]

<Datagridex<Project>
  rows={projects}
  columns={columns}
  ariaLabel="Projects"
/>`

const TEMPLATE_CODE = `<Datagridex<Project>
  rows={projects}
  columns={columns}
  cellTemplates={{
    status: ({ row, formattedValue }) => (
      <span data-status={row.status}>{formattedValue}</span>
    ),
  }}
  rowDetails
  rowDetail={({ row }) => <p>{row.description}</p>}
/>`

const EDITING_CODE = `<Datagridex<Project>
  rows={projects}
  columns={columns}
  editMode="cell"
  editOnClick
  onCellEditCommit={({ row, key, value }) => {
    setProjects((current) => current.map((item) =>
      item === row ? { ...item, [key]: value } : item,
    ))
  }}
/>`

export function DatagridexPage() {
  const [projects, setProjects] = useState(PROJECTS)
  const [selectedRows, setSelectedRows] = useState<readonly Project[]>([])
  const [expandedRows, setExpandedRows] = useState<readonly Project[]>([])
  const [lastAction, setLastAction] = useState('Use the grid to explore sorting, filtering, selection, and editing.')
  const gridRef = useRef<DatagridexHandle<Project>>(null)

  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Datagridex</h1>
        <p className="docs-desc">
          The canonical typed Spruce data grid for sortable, filterable, editable, selectable, grouped,
          paginated, and virtualized records.
        </p>

        <section id="basic" className="demo-section">
          <h2>Basic usage</h2>
          <p className="section-desc">Datagridex uses a generic row type and a small column definition. Columns are sortable and reorderable by default.</p>
          <CodePreview code={BASIC_CODE}>
            <Datagridex<Project> rows={projects} columns={COLUMNS} ariaLabel="Projects" />
          </CodePreview>
        </section>

        <section id="features" className="demo-section">
          <h2>Grid features</h2>
          <p className="section-desc">Enable the focused features you need. Models can be controlled when their state needs to persist outside the grid.</p>
          <CodePreview code={`<Datagridex
  rows={projects}
  columns={columns}
  toolbar
  searchable
  columnSelector
  selectionMode="multiple"
  pagination
  pageSize={3}
/>`}>
            <Datagridex<Project>
              ref={gridRef}
              rows={projects}
              columns={COLUMNS}
              toolbar
              searchable
              columnSelector
              selectionMode="multiple"
              selectedRows={selectedRows}
              onSelectedRowsChange={setSelectedRows}
              pagination
              pageSize={3}
              footer
              statusbar
              onSortChange={(event) => setLastAction(`Sorted ${event.key} ${event.direction ?? 'off'}.`)}
              onFilterChange={(filters) => setLastAction(`${filters.length} filter${filters.length === 1 ? '' : 's'} active.`)}
            />
          </CodePreview>
          <p role="status">{lastAction}</p>
        </section>

        <section id="templates" className="demo-section">
          <h2>Render props and slots</h2>
          <p className="section-desc">Use render props for cell templates, custom editors, row details, detail panes, leading actions, and complete row templates. The slot components below are the JSX equivalent.</p>
          <CodePreview code={TEMPLATE_CODE}>
            <Datagridex<Project>
              rows={projects}
              columns={COLUMNS}
              rowDetails
              expandedRows={expandedRows}
              onExpandedRowsChange={setExpandedRows}
              cellTemplates={{ status: ({ row, formattedValue }) => <span data-status={row.status}>{formattedValue}</span> }}
              leadingRowActions={({ row, detailPaneOpen, toggleDetailPane }) => <button type="button" onClick={toggleDetailPane} aria-label={`${detailPaneOpen ? 'Close' : 'Open'} ${row.name} details`}>i</button>}
              detailPane
              detailPaneRow={expandedRows[0] ?? null}
              detailPaneRenderer={({ row, close }) => <div><strong>{row.name}</strong><p>{row.description}</p><button type="button" onClick={close}>Close</button></div>}
            >
              <DatagridexCellTemplate<Project> columnKey="owner">{({ row, formattedValue }) => <strong>{row.name}: {formattedValue}</strong>}</DatagridexCellTemplate>
              <DatagridexRowDetail<Project>>{({ row, rowIndex }) => <p>{row.description} · record {rowIndex + 1}</p>}</DatagridexRowDetail>
              <DatagridexDetailPane<Project>>{({ row, close }) => <div><strong>{row.name}</strong><p>{row.owner}</p><button type="button" onClick={close}>Close</button></div>}</DatagridexDetailPane>
              <DatagridexLeadingRowActions<Project>>{({ row, toggleDetailPane }) => <button type="button" onClick={toggleDetailPane} aria-label={`Open ${row.name} details`}>i</button>}</DatagridexLeadingRowActions>
            </Datagridex>
          </CodePreview>
        </section>

        <section id="editing" className="demo-section">
          <h2>Editing and validation</h2>
          <p className="section-desc">Cell and row editing are controlled by immutable commit events. Custom editors receive the draft, validation state, and update/commit/cancel callbacks.</p>
          <CodePreview code={EDITING_CODE}>
            <Datagridex<Project>
              rows={projects}
              columns={COLUMNS}
              editMode="cell"
              editOnClick
              onCellEditCommit={({ row, key, value }) => setProjects((current) => current.map((item) => item === row ? { ...item, [key]: value } as Project : item))}
            >
              <DatagridexCellEditor<Project> columnKey="name">{({ value, update, commit }) => <input autoFocus value={String(value ?? '')} onChange={(event) => update(event.target.value)} onBlur={commit} aria-label="Project name" />}</DatagridexCellEditor>
            </Datagridex>
          </CodePreview>
        </section>

        <section id="migration" className="demo-section">
          <h2>Legacy Datagrid migration</h2>
          <p className="section-desc">Datagridex replaces the legacy React <code>Datagrid</code> docs route and is the only grid baseline for Angular parity. The legacy export remains available as a deprecated compatibility surface, but its <code>rowData</code>/<code>options</code> API is frozen and is not extended.</p>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Legacy Datagrid</th><th>Datagridex</th></tr></thead>
              <tbody>
                <tr><td><code>rowData</code></td><td><code>rows</code></td></tr>
                <tr><td><code>ColumnDef.field</code></td><td><code>DatagridexColumn.key</code></td></tr>
                <tr><td><code>options</code> bag</td><td>Typed top-level props and callbacks</td></tr>
                <tr><td>Renderer options</td><td>Render props or <code>DatagridexCellTemplate</code>/<code>DatagridexCellEditor</code> slots</td></tr>
              </tbody>
            </table>
          </div>
          <p>Plan migration by moving one feature at a time, then remove the deprecated import when your release policy permits.</p>
        </section>

        <section id="api" className="demo-section">
          <h2>Public API</h2>
          <p className="section-desc">All Angular Datagridex inputs, outputs, and public methods are represented by typed React props, callbacks, or the <code>DatagridexHandle</code> ref.</p>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Surface</th><th>React form</th></tr></thead>
              <tbody>
                <tr><td>Rows and columns</td><td><code>rows</code>, <code>dataContext</code>, <code>columns</code>, <code>columnGroups</code></td></tr>
                <tr><td>Templates</td><td><code>cellTemplates</code>, <code>cellEditors</code>, <code>rowDetail</code>, <code>detailPaneRenderer</code>, <code>leadingRowActions</code>, <code>rowTemplate</code></td></tr>
                <tr><td>Events</td><td><code>onSortChange</code>, <code>onFilterChange</code>, <code>onCellEditCommit</code>, <code>onSelectionChange</code>, <code>onRowOrderChange</code>, and the remaining <code>on…</code> callbacks</td></tr>
                <tr><td>Methods</td><td><code>sortBy</code>, <code>filterBy</code>, <code>goToPage</code>, <code>clearSelection</code>, <code>startCellEdit</code>, <code>commitRowEdit</code>, and the remaining handle methods</td></tr>
                <tr><td>Accessibility</td><td>ARIA grid semantics, labeled utility controls, roving cell focus, keyboard sorting/reordering/editing, and visible focus styles</td></tr>
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => gridRef.current?.clearSelection()}>Clear selection through ref</button>
        </section>
      </div>
    </div>
  )
}
