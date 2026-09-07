import type {
  DatagridCellEditorContext,
  DatagridCellTemplateContext,
  DatagridColumn,
  DatagridHandle,
  DatagridProps,
  DatagridValidationRules,
} from '../src/index.js'
import { createDataContext } from '../src/index.js'

interface Project extends Record<string, unknown> {
  id: number
  name: string
  budget: number
}

const columns: readonly DatagridColumn<Project>[] = [
  { key: 'id', header: 'ID', readonly: true },
  { key: 'name', header: 'Name', editable: true, required: true },
  { key: 'budget', header: 'Budget', editable: true, editorType: 'number' },
]

const rules: DatagridValidationRules<Project> = {
  min: 0,
  custom: (value) => Number(value) >= 0 || 'Budget cannot be negative',
}

const props: DatagridProps<Project> = {
  rows: [{ id: 1, name: 'Atlas', budget: 100 }],
  columns,
  editMode: 'cell',
  rowDetails: true,
  cellTemplates: {
    name: ({ row, formattedValue }: DatagridCellTemplateContext<Project>) => `${row.id}: ${formattedValue}`,
  },
  cellEditors: {
    name: ({ value, update, commit, cancel }: DatagridCellEditorContext<Project>) => {
      update(value)
      commit()
      cancel()
      return null
    },
  },
  onCellEditCommit: (event) => {
    const key: string = event.key
    void key
  },
}

const handle: DatagridHandle<Project> = {
  sortBy: () => undefined,
  filterBy: () => undefined,
  filterByCondition: () => undefined,
  setRowDetailExpanded: () => undefined,
  toggleRowDetails: () => undefined,
  clearFilters: () => undefined,
  goToPage: () => undefined,
  previousPage: () => undefined,
  nextPage: () => undefined,
  clearSelection: () => undefined,
  addDataContextRow: () => undefined,
  deleteDataContextSelection: () => undefined,
  saveDataContextChanges: () => undefined,
  discardDataContextChanges: () => undefined,
  autoSizeColumn: () => undefined,
  autoSizeColumns: () => undefined,
  resetColumnOrder: () => undefined,
  setColumnVisible: () => undefined,
  setGrouping: () => undefined,
  clearGrouping: () => undefined,
  startCellEdit: () => undefined,
  startRowEdit: () => undefined,
  commitCellEdit: () => undefined,
  commitRowEdit: () => undefined,
  cancelEditing: () => undefined,
  undo: () => undefined,
  redo: () => undefined,
  fillDown: () => undefined,
}

const dataContext = createDataContext<Project>({ idField: 'id' })
const contextProps: DatagridProps<Project> = {
  rows: [],
  columns,
  dataContext,
}

void props
void rules
void handle
void contextProps
