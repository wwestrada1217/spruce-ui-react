import { strict as assert } from 'node:assert'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { createDatagridexDataContextAdapter } from '../src/components/datagridex/datagridex-data-context.ts'

test('exports Datagridex and its DataContext adapter', () => {
  assert.equal(typeof createDatagridexDataContextAdapter, 'function')
  assert.match(readFileSync(new URL('../src/components/datagridex/Datagridex.tsx', import.meta.url), 'utf8'), /export const Datagridex = forwardRef/)
})

test('renders accessible grid semantics and labeled keyboard controls', () => {
  const source = readFileSync(new URL('../src/components/datagridex/Datagridex.tsx', import.meta.url), 'utf8')
  assert.match(source, /role="grid"/)
  assert.match(source, /aria-label=\{ariaLabel\}/)
  assert.match(source, /aria-label=\{`\$\{t\('sortAscending'\)\} \$\{column\.header\}/)
  assert.match(source, /aria-label=\{`\$\{t\('filter'\)\} \$\{column\.header\}/)
  assert.match(source, /aria-label=\{`\$\{t\('selectAllRowsOnPage'\)\}/)
})

test('adapts structural DataContext state and write-through operations', () => {
  let rows = [{ id: 1, name: 'Atlas' }]
  const record = { data: rows[0], state: 'Modified', _modifiedFields: new Map([['name', 'Old']]) }
  const context = {
    idField: 'id',
    data: () => rows,
    dirty: true,
    current: () => ({ data: rows[0] }),
    navigationRecords: () => [record],
    findRecord: (id) => String(record.data.id) === id ? record : null,
    add: (data) => { rows = [...rows, { id: 2, name: data.name ?? 'New' }]; return '2' },
    patch: (_id, changes) => { rows = [{ ...rows[0], ...changes }] },
    delete: () => undefined,
    discardChanges: () => undefined,
    save: async () => undefined,
    skip: () => true,
  }
  const adapter = createDatagridexDataContextAdapter(context, { stateDisplay: 'row-and-cell' })

  assert.equal(adapter.recordId(rows[0]), '1')
  assert.equal(adapter.recordState(rows[0]), 'modified')
  assert.equal(adapter.cellState(rows[0], 'name'), 'modified')
  adapter.patch(rows[0], { name: 'New name' })
  assert.equal(rows[0].name, 'New name')
})
