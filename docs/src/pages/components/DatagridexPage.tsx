import { useEffect, useRef, useState } from 'react'
import {
  Datagridex,
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
  region: 'Americas' | 'EMEA'
  description: string
}

const PROJECTS: readonly Project[] = [
  { id: 1, name: 'Atlas redesign', owner: 'Mina Patel', status: 'active', budget: 82000, region: 'Americas', description: 'Refresh the core workspace experience.' },
  { id: 2, name: 'Mobile foundation', owner: 'Jon Bell', status: 'paused', budget: 41000, region: 'EMEA', description: 'Shared responsive primitives for product teams.' },
  { id: 3, name: 'Billing migration', owner: 'Rae Chen', status: 'complete', budget: 126000, region: 'Americas', description: 'Move legacy invoices onto the new ledger.' },
  { id: 4, name: 'Support console', owner: 'Mina Patel', status: 'active', budget: 68000, region: 'EMEA', description: 'Give support a faster customer timeline.' },
  { id: 5, name: 'Analytics refresh', owner: 'Rae Chen', status: 'active', budget: 97000, region: 'Americas', description: 'Make operational metrics easier to explore.' },
]

const ROW_SPAN_PROJECTS: readonly Project[] = [
  { ...PROJECTS[0], id: 11 },
  { ...PROJECTS[3], id: 12, name: 'Support console follow-up' },
  { ...PROJECTS[1], id: 13 },
  { ...PROJECTS[2], id: 14 },
]

const PROJECT_COLUMNS: readonly DatagridexColumn<Project>[] = [
  { key: 'name', header: 'Project', editable: true, filterable: true },
  { key: 'owner', header: 'Owner', filterable: true, filterVariant: 'dynamic' },
  {
    key: 'status',
    header: 'Status',
    editable: true,
    editorType: 'select',
    editorOptions: {
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Complete', value: 'complete' },
      ],
    },
  },
  { key: 'region', header: 'Region', filterable: true },
  {
    key: 'budget',
    header: 'Budget',
    align: 'end',
    editable: true,
    editorType: 'number',
    aggregate: { type: 'sum', label: 'Total' },
    valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}`,
  },
]

const GROUPS = [
  { key: 'identity', header: 'Project identity', columnKeys: ['name', 'owner'] },
  { key: 'delivery', header: 'Delivery', columnKeys: ['status', 'region', 'budget'] },
] as const

const IMPORT_CODE = `import {
  Datagridex,
  type DatagridexColumn,
} from 'spruce-react'
import 'spruce-react/style.css'`

const BASIC_CODE = `interface Project {
  name: string
  owner: string
  budget: number
}

const columns: DatagridexColumn<Project>[] = [
  { key: 'name', header: 'Project' },
  { key: 'owner', header: 'Owner' },
  { key: 'budget', header: 'Budget', align: 'end' },
]

<Datagridex<Project>
  rows={projects}
  columns={columns}
  ariaLabel="Projects"
/>`

const SIZING_CODE = `<Datagridex
  rows={projects}
  columns={columns}
  autoHeight
  autoColumnWidth
  fitColumnsToWidth
  showVerticalLines={false}
/>`

const PINNING_CODE = `const columns = [
  { key: 'name', header: 'Project', pinned: 'left' },
  { key: 'owner', header: 'Owner' },
  { key: 'budget', header: 'Budget', pinned: 'right' },
]

<Datagridex rows={projects} columns={columns} />`

const MENU_CODE = `const columns = [{
  key: 'budget',
  header: 'Budget',
  menuItems: [
    { label: 'Open budget report', icon: 'external-link', command: openReport },
  ],
}]

<Datagridex rows={projects} columns={columns} columnMenu />`

const SORTING_CODE = `<Datagridex
  rows={projects}
  columns={columns}
  multiSort
  sortIndicatorVisibility="always"
  onSortChange={({ key, direction }) => logSort(key, direction)}
  onSortsChange={(nextSorts) => saveSorts(nextSorts)}
/>`

const FILTERING_CODE = `const columns = [
  { key: 'owner', header: 'Owner', filterable: true },
  {
    key: 'budget',
    header: 'Budget',
    filterable: true,
    filterVariant: 'dynamic',
    filterDataType: 'number',
  },
]

<Datagridex
  rows={projects}
  columns={columns}
  searchable
  onFilterChange={(filters) => loadFilteredRows(filters)}
/>`

const TEMPLATE_CODE = `<Datagridex
  rows={projects}
  columns={columns}
  cellTemplates={{
    status: ({ row, formattedValue }) => (
      <strong data-status={row.status}>{formattedValue}</strong>
    ),
  }}
  rowDetail={({ row }) => <p>{row.description}</p>}
  rowDetails
/>`

const TOOLBAR_CODE = `<Datagridex
  rows={projects}
  columns={columns}
  toolbar
  searchable
  columnSelector
  toolbarShowGroupedColumns
  statusbar
  footer
/>`

const GROUPS_CODE = `const columnGroups = [
  { key: 'identity', header: 'Project identity', columnKeys: ['name', 'owner'] },
  { key: 'delivery', header: 'Delivery', columnKeys: ['status', 'region', 'budget'] },
]

<Datagridex
  rows={projects}
  columns={columns}
  columnGroups={columnGroups}
/>`

const ROW_SPAN_CODE = `const columns = [
  {
    key: 'owner',
    header: 'Owner',
    rowSpan: ({ row, rows, rowIndex }) =>
      rows[rowIndex + 1]?.owner === row.owner ? 2 : 1,
  },
]

<Datagridex rows={projects} columns={columns} />`

const GROUPING_CODE = `<Datagridex
  rows={projects}
  columns={columns}
  groupBy={['region', 'owner']}
  groupSorting
  groupsExpandedByDefault
  groupSelection
  selectionMode="multiple"
/>`

const AGGREGATE_CODE = `const columns = [
  { key: 'name', header: 'Project', aggregate: 'count' },
  {
    key: 'budget',
    header: 'Budget',
    aggregate: {
      type: 'avg',
      label: 'Average',
      valueFormatter: ({ value }) => '$' + Number(value).toLocaleString(),
    },
  },
]

<Datagridex rows={projects} columns={columns} footer footerLabel="Summary" />`

const VIRTUAL_CODE = `<Datagridex
  rows={largeRows}
  columns={columns}
  virtualScroll
  virtualScrollHeight={400}
  virtualRowHeight={32}
  virtualOverscan={6}
  columnVirtualization
/>`

const VIRTUAL_PAGING_CODE = `<Datagridex
  rows={pageRows}
  columns={columns}
  virtualPaging
  virtualPage={page}
  virtualTotalRows={totalRows}
  virtualPagingLoading={loading}
  onVirtualPageRequest={loadPage}
/>`

const EDITING_CODE = `const columns = [
  { key: 'name', header: 'Project', editable: true, required: true },
  { key: 'budget', header: 'Budget', editable: true, editorType: 'number' },
]

<Datagridex
  rows={projects}
  columns={columns}
  editMode="cell"
  editOnClick
  editOnType
  preventInvalidCommit
  onCellEditCommit={applyCellEdit}
  onCellValidationFailed={showValidation}
/>`

const CUSTOM_EDITOR_CODE = `<Datagridex
  rows={projects}
  columns={columns}
  editMode="cell"
  cellEditors={{
    name: ({ value, update, commit, cancel }) => (
      <input
        autoFocus
        value={String(value ?? '')}
        onChange={(event) => update(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => event.key === 'Escape' && cancel()}
      />
    ),
  }}
/>`

const NEW_ROW_CODE = `<Datagridex
  rows={projects}
  columns={columns}
  editMode="cell"
  enableNewRow
  newRowFactory={() => ({
    id: crypto.randomUUID(),
    name: '',
    owner: '',
    status: 'active',
    budget: 0,
    region: 'Americas',
    description: '',
  })}
  onNewRowCommit={({ row }) => setProjects((current) => [...current, row])}
/>`

const DATA_CONTEXT_CODE = `const dataContextOptions = {
  synchronizeSelection: true,
  stateDisplay: 'row-and-cell',
  validationDisplay: 'row-and-cell',
  toolbarActions: true,
  newRowDefaults: { status: 'active', budget: 0 },
}

<Datagridex
  dataContext={projectContext}
  dataContextOptions={dataContextOptions}
  columns={columns}
  editMode="cell"
  toolbar
  searchable
  enableNewRow
  onDataContextSaveComplete={handleSaved}
  onDataContextSaveError={handleSaveError}
/>`

const KEYBOARD_CODE = `// Header: Enter/Space sorts
// Header: Alt + Arrow/Home/End reorders
// Resize handle: Arrow, Shift + Arrow, Home, End
// Editable cell: Enter/F2 edits; printable keys edit when editOnType is enabled
// Editor: Enter commits; Escape cancels
// Row reorder: Alt + Arrow/Home/End moves the row`

const THEME_CODE = `<SpruceProvider defaultTheme="dark">
  <Datagridex
    rows={projects}
    columns={columns}
    ariaLabel="Projects"
  />
</SpruceProvider>`

interface Section {
  id: string
  label: string
}

const SECTIONS: readonly Section[] = [
  { id: 'import', label: 'Import' },
  { id: 'basic', label: 'Basic usage' },
  { id: 'sizing', label: 'Sizing' },
  { id: 'pinning', label: 'Column pinning' },
  { id: 'menu', label: 'Column menu' },
  { id: 'sorting', label: 'Sorting' },
  { id: 'templates', label: 'Custom rendering' },
  { id: 'filtering', label: 'Filtering' },
  { id: 'toolbar', label: 'Toolbar and selector' },
  { id: 'groups', label: 'Column groups' },
  { id: 'spans', label: 'Row spans' },
  { id: 'details', label: 'Row details and pane' },
  { id: 'grouping', label: 'Row grouping' },
  { id: 'aggregates', label: 'Aggregates and footer' },
  { id: 'status', label: 'Status bar' },
  { id: 'empty', label: 'Empty states' },
  { id: 'large-data', label: 'Large data sets' },
  { id: 'selection', label: 'Selection and stripes' },
  { id: 'reorder', label: 'Row reordering' },
  { id: 'editing', label: 'Editing' },
  { id: 'new-row', label: 'New row' },
  { id: 'data-context', label: 'DataContext' },
  { id: 'keyboard', label: 'Keyboard interaction' },
  { id: 'theming', label: 'Theming' },
  { id: 'api', label: 'Public API' },
]

export function DatagridexPage() {
  const [projects, setProjects] = useState<readonly Project[]>(PROJECTS)
  const [selectedRows, setSelectedRows] = useState<readonly Project[]>([])
  const [expandedRows, setExpandedRows] = useState<readonly Project[]>([])
  const [reorderRows, setReorderRows] = useState<readonly Project[]>(PROJECTS.slice(0, 4))
  const [lastAction, setLastAction] = useState('Interact with the grid to see emitted state changes.')
  const [activeSection, setActiveSection] = useState('import')
  const gridRef = useRef<DatagridexHandle<Project>>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-10% 0px -65% 0px', threshold: 0 },
    )
    mainRef.current?.querySelectorAll('section[id]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function applyCellEdit(event: { row: Project; key: string; value: unknown }) {
    setProjects((current) => current.map((project) => (
      project === event.row ? { ...project, [event.key]: event.value } as Project : project
    )))
    setLastAction(`Committed ${event.key}.`)
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Datagridex</h1>
        <p className="docs-desc">
          A typed, accessible data grid for sortable, filterable, resizable, reorderable, editable,
          selectable, grouped, paginated, and virtualized records.
        </p>

        <section id="import" className="demo-section">
          <h2>Import</h2>
          <p className="section-desc">Import the component and its typed column contract from the single Spruce React package.</p>
          <CodePreview code={IMPORT_CODE} language="typescript" codeOnly />
        </section>

        <section id="basic" className="demo-section">
          <h2>Basic usage</h2>
          <p className="section-desc">Provide a generic row type, an array of rows, and a typed column definition. Sorting, resizing, and column reordering are enabled by default.</p>
          <CodePreview code={BASIC_CODE} language="typescript">
            <Datagridex<Project> ref={gridRef} rows={projects} columns={PROJECT_COLUMNS} ariaLabel="Projects" />
          </CodePreview>
        </section>

        <section id="sizing" className="demo-section">
          <h2>Sizing</h2>
          <p className="section-desc">Use <code>autoHeight</code> for wrapped content, <code>autoColumnWidth</code> for intrinsic sizing, and <code>fitColumnsToWidth</code> when the grid should fill its viewport. Numeric, percentage, flex, minimum, and maximum column widths are supported.</p>
          <CodePreview code={SIZING_CODE} language="typescript">
            <Datagridex<Project> rows={projects.slice(0, 4)} columns={PROJECT_COLUMNS} fitColumnsToWidth ariaLabel="Sized projects" />
          </CodePreview>
          <p>Set <code>autoHeight={'{false}'}</code> and give the host a height when the grid belongs in a fixed workspace. Set <code>showVerticalLines</code> to <code>true</code> when column separators are useful.</p>
        </section>

        <section id="pinning" className="demo-section">
          <h2>Column pinning</h2>
          <p className="section-desc">Set <code>pinned</code> to <code>left</code> or <code>right</code> to keep a column visible while the center columns scroll horizontally. Utility columns remain pinned to the logical edge.</p>
          <CodePreview code={PINNING_CODE} language="typescript">
            <Datagridex<Project> rows={projects} columns={PROJECT_COLUMNS} columnPins={{ name: 'left', budget: 'right' }} ariaLabel="Pinned projects" />
          </CodePreview>
        </section>

        <section id="menu" className="demo-section">
          <h2>Column menu</h2>
          <p className="section-desc">Enable <code>columnMenu</code> to expose sorting, width, visibility, grouping, and pinning actions. Add typed <code>menuItems</code> for application commands.</p>
          <CodePreview code={MENU_CODE} language="typescript">
            <Datagridex<Project> rows={projects} columns={PROJECT_COLUMNS} columnMenu ariaLabel="Project column menu" />
          </CodePreview>
        </section>

        <section id="sorting" className="demo-section">
          <h2>Sorting</h2>
          <p className="section-desc">Client sorting handles strings, numbers, booleans, dates, value getters, and custom comparators. Use <code>sortMode="manual"</code> with <code>onSortChange</code> or <code>onSortsChange</code> for remote sorting.</p>
          <CodePreview code={SORTING_CODE} language="typescript">
            <Datagridex<Project> rows={projects} columns={PROJECT_COLUMNS} multiSort sortIndicatorVisibility="always" onSortChange={({ key, direction }) => setLastAction(`Sorted ${key} ${direction ?? 'off'}.`)} ariaLabel="Sortable projects" />
          </CodePreview>
        </section>

        <section id="templates" className="demo-section">
          <h2>Custom cell rendering</h2>
          <p className="section-desc">Use <code>cellTemplates</code> for read-only presentation while sorting, filtering, and editing continue to use the underlying value. Row details, detail panes, leading actions, and complete row templates use the same render-prop model.</p>
          <CodePreview code={TEMPLATE_CODE} language="typescript">
            <Datagridex<Project>
              rows={projects}
              columns={PROJECT_COLUMNS}
              cellTemplates={{
                status: ({ row, formattedValue }) => <strong data-status={row.status}>{formattedValue}</strong>,
              }}
              rowDetails
              expandedRows={expandedRows}
              onExpandedRowsChange={setExpandedRows}
              rowDetail={({ row }) => <p>{row.description}</p>}
              ariaLabel="Templated projects"
            />
          </CodePreview>
        </section>

        <section id="filtering" className="demo-section">
          <h2>Filtering</h2>
          <p className="section-desc">Set <code>filterable</code> on a column for distinct-value filtering. Use <code>filterVariant="dynamic"</code> and <code>filterDataType</code> for condition builders with text, number, date, and boolean operators. <code>searchable</code> adds a global search field.</p>
          <CodePreview code={FILTERING_CODE} language="typescript">
            <Datagridex<Project> rows={projects} columns={PROJECT_COLUMNS} searchable toolbar ariaLabel="Filterable projects" onFilterChange={(filters) => setLastAction(`${filters.length} column filter${filters.length === 1 ? '' : 's'} active.`)} />
          </CodePreview>
        </section>

        <section id="toolbar" className="demo-section">
          <h2>Built-in toolbar and column selector</h2>
          <p className="section-desc">The toolbar can contain search, DataContext actions, custom content, the column selector, and grouped-column controls. The selector preserves the full column order while hiding columns.</p>
          <CodePreview code={TOOLBAR_CODE} language="typescript">
            <Datagridex<Project> rows={projects} columns={PROJECT_COLUMNS} toolbar searchable columnSelector statusbar footer ariaLabel="Project tools" />
          </CodePreview>
        </section>

        <section id="groups" className="demo-section">
          <h2>Column groups</h2>
          <p className="section-desc">Use <code>columnGroups</code> to add a grouped header row. Groups can be reordered and resized when the corresponding grid-level and group-level capabilities are enabled.</p>
          <CodePreview code={GROUPS_CODE} language="typescript">
            <Datagridex<Project> rows={projects} columns={PROJECT_COLUMNS} columnGroups={GROUPS} ariaLabel="Grouped project columns" />
          </CodePreview>
        </section>

        <section id="spans" className="demo-section">
          <h2>Row spans</h2>
          <p className="section-desc">A numeric <code>rowSpan</code> or row-span callback merges adjacent records in a column. Row spans are disabled while grouping, virtualization, or expanded row details are active.</p>
          <CodePreview code={ROW_SPAN_CODE} language="typescript">
            <Datagridex<Project>
              rows={ROW_SPAN_PROJECTS}
              columns={PROJECT_COLUMNS.map((column) => column.key === 'owner' ? { ...column, rowSpan: ({ rows, rowIndex }) => rows[rowIndex + 1]?.owner === rows[rowIndex]?.owner ? 2 : 1 } : column)}
              ariaLabel="Projects with row spans"
            />
          </CodePreview>
        </section>

        <section id="details" className="demo-section">
          <h2>Row details and detail pane</h2>
          <p className="section-desc">Use <code>rowDetails</code> with <code>rowDetail</code> for an expandable detail row. Use <code>detailPane</code>, <code>detailPaneRow</code>, and <code>detailPaneRenderer</code> for a side panel.</p>
          <CodePreview code={`<Datagridex
  rows={projects}
  columns={columns}
  rowDetails
  rowDetail={({ row }) => <p>{row.description}</p>}
  detailPane
  detailPaneRow={selectedProject}
  detailPaneRenderer={({ row, close }) => (
    <><h3>{row.name}</h3><p>{row.description}</p><button onClick={close}>Close</button></>
  )}
/>`} language="typescript">
            <Datagridex<Project>
              rows={projects}
              columns={PROJECT_COLUMNS}
              rowDetails
              expandedRows={expandedRows}
              onExpandedRowsChange={setExpandedRows}
              rowDetail={({ row }) => <p>{row.description}</p>}
              detailPane
              detailPaneRow={selectedRows[0] ?? null}
              detailPaneTitle={({ name }) => name}
              detailPaneRenderer={({ row, close }) => <div><strong>{row.name}</strong><p>{row.description}</p><button type="button" onClick={close}>Close</button></div>}
              selectionMode="single"
              selectedRows={selectedRows}
              onSelectedRowsChange={setSelectedRows}
              ariaLabel="Projects with details"
            />
          </CodePreview>
        </section>

        <section id="grouping" className="demo-section">
          <h2>Multi-column row grouping</h2>
          <p className="section-desc">Pass ordered keys to <code>groupBy</code> for nested groups. <code>groupSorts</code>, <code>groupsExpandedByDefault</code>, <code>stickyGroupHeaders</code>, <code>indentGroupedRows</code>, and <code>groupSelection</code> control the grouped view.</p>
          <CodePreview code={GROUPING_CODE} language="typescript">
            <Datagridex<Project> rows={projects} columns={PROJECT_COLUMNS} groupBy={['region', 'owner']} groupSorting groupsExpandedByDefault groupSelection selectionMode="multiple" ariaLabel="Grouped projects" />
          </CodePreview>
        </section>

        <section id="aggregates" className="demo-section">
          <h2>Aggregates and footer</h2>
          <p className="section-desc">Set <code>aggregate</code> to <code>sum</code>, <code>count</code>, <code>avg</code>, <code>min</code>, or <code>max</code>, or provide a custom aggregate. Enable <code>footer</code> and customize its accessible label with <code>footerLabel</code>.</p>
          <CodePreview code={AGGREGATE_CODE} language="typescript">
            <Datagridex<Project> rows={projects} columns={PROJECT_COLUMNS} footer footerLabel="Project summary" ariaLabel="Projects with aggregates" />
          </CodePreview>
        </section>

        <section id="status" className="demo-section">
          <h2>Status bar</h2>
          <p className="section-desc">The status bar can show total rows, selected rows, custom start/end content, the column selector, and merged pagination controls. Set <code>statusbarMergePagination</code> when pagination should live inside it.</p>
          <CodePreview code={`<Datagridex
  rows={projects}
  columns={columns}
  statusbar
  statusbarShowRowCount
  statusbarShowSelectedRowCount
  statusbarMergePagination
  pagination
  statusbarStart={<span>Last sync: just now</span>}
/>`} language="typescript">
            <Datagridex<Project> rows={projects} columns={PROJECT_COLUMNS} statusbar statusbarShowRowCount statusbarShowSelectedRowCount statusbarMergePagination pagination pageSize={3} selectedRows={selectedRows} selectionMode="multiple" onSelectedRowsChange={setSelectedRows} statusbarStart={<span>Last sync: just now</span>} ariaLabel="Project status" />
          </CodePreview>
        </section>

        <section id="empty" className="demo-section">
          <h2>Empty states</h2>
          <p className="section-desc">Customize the empty and filtered-empty messages independently. <code>emptyState</code> can replace the built-in presentation with application content.</p>
          <CodePreview code={`<Datagridex
  rows={[]}
  columns={columns}
  emptyMessage="No projects yet"
  emptyStateDescription="Create a project to start tracking delivery."
  emptyState={<CreateProjectPrompt />}
/>`} language="typescript">
            <Datagridex<Project> rows={[]} columns={PROJECT_COLUMNS} emptyMessage="No projects yet" emptyStateDescription="Create a project to start tracking delivery." ariaLabel="Empty projects" />
          </CodePreview>
        </section>

        <section id="large-data" className="demo-section">
          <h2>Large data sets</h2>
          <p className="section-desc">Use row virtualization for large local collections. Column virtualization keeps only horizontally visible center columns mounted while pinned columns remain visible.</p>
          <CodePreview code={VIRTUAL_CODE} language="typescript">
            <Datagridex<Project> rows={Array.from({ length: 100 }, (_, index) => ({ ...PROJECTS[index % PROJECTS.length], id: 1000 + index }))} columns={PROJECT_COLUMNS} virtualScroll virtualScrollHeight={280} virtualRowHeight={32} virtualOverscan={6} columnVirtualization ariaLabel="Virtualized projects" />
          </CodePreview>
          <CodePreview code={VIRTUAL_PAGING_CODE} language="typescript" codeOnly />
          <p>For remote pages, set <code>virtualPaging</code>, provide <code>virtualTotalRows</code> when known, and replace <code>rows</code> in response to <code>onVirtualPageRequest</code>. Use <code>virtualPagingLoading</code> to prevent duplicate requests.</p>
        </section>

        <section id="selection" className="demo-section">
          <h2>Row selection and stripes</h2>
          <p className="section-desc">Single selection uses radios; multiple selection uses checkboxes and an indeterminate header control. Selection is controlled through <code>selectedRows</code> and <code>onSelectedRowsChange</code>.</p>
          <CodePreview code={`<Datagridex
  rows={projects}
  columns={columns}
  selectionMode="multiple"
  selectedRows={selectedRows}
  onSelectedRowsChange={setSelectedRows}
  stripedRows
/>`} language="typescript">
            <Datagridex<Project> rows={projects} columns={PROJECT_COLUMNS} selectionMode="multiple" selectedRows={selectedRows} onSelectedRowsChange={setSelectedRows} stripedRows ariaLabel="Selectable projects" />
          </CodePreview>
          <p role="status">{selectedRows.length} project{selectedRows.length === 1 ? '' : 's'} selected.</p>
        </section>

        <section id="reorder" className="demo-section">
          <h2>Row reordering</h2>
          <p className="section-desc">Set <code>rowReorder</code> to enable drag handles. Reordering pauses while sorting, filtering, grouping, pagination, virtual paging, or virtual scrolling transforms the visible order.</p>
          <CodePreview code={`<Datagridex
  rows={projects}
  columns={columns}
  rowReorder
  onRowOrderChange={({ rows }) => setProjects(rows)}
/>`} language="typescript">
            <Datagridex<Project> rows={reorderRows} columns={PROJECT_COLUMNS} rowReorder onRowOrderChange={({ rows: nextRows }) => { setReorderRows(nextRows); setLastAction('Rows reordered.') }} ariaLabel="Reorderable projects" />
          </CodePreview>
        </section>

        <section id="editing" className="demo-section">
          <h2>Editing and validation</h2>
          <p className="section-desc">Set <code>editable</code> on columns and choose <code>editMode="cell"</code> or <code>editMode="row"</code>. Built-in text, number, date, checkbox, select, combobox, and grid-combobox editors are typed through the column definition.</p>
          <CodePreview code={EDITING_CODE} language="typescript">
            <Datagridex<Project> rows={projects} columns={PROJECT_COLUMNS} editMode="cell" editOnClick editOnType preventInvalidCommit onCellEditCommit={applyCellEdit} onCellValidationFailed={() => setLastAction('Invalid value kept in the editor.')} ariaLabel="Editable projects" />
          </CodePreview>
          <p role="status">{lastAction}</p>
          <h3>Custom cell editors</h3>
          <p>Use <code>cellEditors</code> when an application-specific control owns the draft. The render context provides <code>value</code>, <code>update</code>, <code>commit</code>, <code>cancel</code>, and validation state.</p>
          <CodePreview code={CUSTOM_EDITOR_CODE} language="typescript" codeOnly />
        </section>

        <section id="new-row" className="demo-section">
          <h2>New row</h2>
          <p className="section-desc">Set <code>enableNewRow</code> to keep a draft row below the records. <code>newRowFactory</code> supplies identifiers and defaults; each valid cell commit emits <code>onNewRowCommit</code>.</p>
          <CodePreview code={NEW_ROW_CODE} language="typescript" codeOnly />
        </section>

        <section id="data-context" className="demo-section">
          <h2>DataContext integration</h2>
          <p className="section-desc">Bind a compatible <code>dataContext</code> to make it the grid&apos;s row and change manager. The adapter can synchronize selection, show row/cell state, block invalid saves, and provide Add/Delete/Save/Discard toolbar commands.</p>
          <CodePreview code={DATA_CONTEXT_CODE} language="typescript" codeOnly />
          <p>Valid edits write through <code>patch</code>, new rows use <code>add</code>, and toolbar save/discard operations call the context. Use <code>onDataContextSaveComplete</code> and <code>onDataContextSaveError</code> for application-level feedback.</p>
        </section>

        <section id="keyboard" className="demo-section">
          <h2>Keyboard interaction</h2>
          <p className="section-desc">Datagridex keeps grid navigation and utility controls keyboard accessible. Focus the grid, header, resize handle, cell, or editor and use the following shortcuts.</p>
          <CodePreview code={KEYBOARD_CODE} language="typescript" codeOnly />
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Control</th><th>Keys</th><th>Result</th></tr></thead>
              <tbody>
                <tr><td>Sort button</td><td>Enter, Space</td><td>Cycle ascending, descending, and unsorted.</td></tr>
                <tr><td>Column header</td><td>Alt + Arrow/Home/End</td><td>Reorder the column.</td></tr>
                <tr><td>Resize handle</td><td>Arrow, Shift + Arrow, Home, End</td><td>Resize by a step, large step, minimum, or maximum.</td></tr>
                <tr><td>Editable cell</td><td>Enter, F2, printable key</td><td>Start editing; printable keys replace the value when <code>editOnType</code> is enabled.</td></tr>
                <tr><td>Editor</td><td>Enter, Escape</td><td>Commit or cancel the draft.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="theming" className="demo-section">
          <h2>Theming</h2>
          <p className="section-desc">Datagridex consumes Spruce surface, text, border, typography, spacing, density, motion, scrollbar, and focus tokens. It follows the active <code>SpruceProvider</code> theme and document direction.</p>
          <CodePreview code={THEME_CODE} language="typescript" codeOnly />
          <p>Use the <code>locale</code> prop for display and comparison overrides. Use provider locale and direction for localized chrome and RTL layouts. Customize local presentation with <code>--sp-datagridex-*</code> tokens rather than hard-coded colors.</p>
        </section>

        <section id="api" className="demo-section">
          <h2>Public API</h2>
          <p className="section-desc">Datagridex exposes typed props and callbacks for the Angular feature surface, plus an imperative ref for common commands.</p>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Surface</th><th>React API</th><th>Purpose</th></tr></thead>
              <tbody>
                <tr><td>Data</td><td><code>rows</code>, <code>data</code>, <code>dataContext</code></td><td>Local rows or tracked DataContext records.</td></tr>
                <tr><td>Columns</td><td><code>columns</code>, <code>columnGroups</code>, <code>columnPins</code></td><td>Typed columns, grouped headers, and pinned columns.</td></tr>
                <tr><td>Sorting/filtering</td><td><code>sortMode</code>, <code>sorts</code>, <code>filterMode</code>, <code>columnFilters</code>, <code>searchTerm</code></td><td>Client or manual state.</td></tr>
                <tr><td>Selection</td><td><code>selectionMode</code>, <code>selectedRows</code>, <code>onSelectedRowsChange</code>, <code>onSelectionChange</code></td><td>Single or multiple controlled selection.</td></tr>
                <tr><td>Pagination</td><td><code>pagination</code>, <code>pageSize</code>, <code>paginationType</code>, <code>onPageChange</code></td><td>Compact or full client pagination.</td></tr>
                <tr><td>Virtual data</td><td><code>virtualScroll</code>, <code>columnVirtualization</code>, <code>virtualPaging</code></td><td>Large local and remote datasets.</td></tr>
                <tr><td>Editing</td><td><code>editMode</code>, <code>editOnClick</code>, <code>editOnType</code>, <code>cellEditors</code></td><td>Cell/row editors and custom controls.</td></tr>
                <tr><td>Details</td><td><code>rowDetails</code>, <code>rowDetail</code>, <code>detailPaneRenderer</code></td><td>Expandable rows and side panels.</td></tr>
                <tr><td>Callbacks</td><td><code>onSortChange</code>, <code>onFilterChange</code>, <code>onCellEditCommit</code>, <code>onRowOrderChange</code>, <code>onDataContextSaveComplete</code></td><td>Immutable state and lifecycle events.</td></tr>
                <tr><td>Ref methods</td><td><code>DatagridexHandle&lt;T&gt;</code></td><td>Sorting, filtering, paging, selection, grouping, sizing, and editing commands.</td></tr>
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => gridRef.current?.clearSelection()}>Clear the selection in the basic grid</button>
        </section>
      </div>

      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a className={`toc-link${activeSection === section.id ? ' active' : ''}`} href={`#${section.id}`} onClick={(event) => { event.preventDefault(); scrollTo(section.id) }}>
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
