import { strict as assert } from 'node:assert'
import { createRequire } from 'node:module'
import test from 'node:test'

globalThis.require = createRequire(import.meta.url)
const {
  createArrayDataSource,
  createContextFormModel,
  createDataContext,
  createDetailDataSource,
  createFormBridge,
  createNodeStore,
  DataContextError,
  DataContextErrorCode,
  NavigationCursor,
  NodeStoreError,
  NodeStoreErrorCode,
  RecordState,
} = await import('../dist/spruce-react.es.js')

test('detail contexts preserve nested data and sync payloads', () => {
  const context = createDataContext({
    idField: 'id',
    details: { lines: { idField: 'id', foreignKey: 'orderId' } },
  })
  context.loadRecords([{ id: 'o-1', lines: [{ id: 'l-1', orderId: 'o-1', quantity: 1 }] }])

  const lines = context.current?.getDetail('lines')
  assert.equal(lines?.count, 1)
  lines?.add({ id: 'l-2', orderId: 'o-1', quantity: 2 })
  assert.equal(context.dirty, true)
  assert.equal(context.data[0].lines.length, 2)
  assert.equal(context.dataWithDetails[0].lines.length, 2)
  assert.equal(context.buildSyncPayload()[0].lines.length, 1)
  assert.equal(context.buildSyncPayload()[0].lines[0].id, 'l-2')
})

test('detail data source extracts and stringifies the parent id', async () => {
  const calls = []
  const source = createDetailDataSource((parentId) => {
    calls.push(parentId)
    return Promise.resolve([{ id: 'l-1', orderId: parentId }])
  })
  const response = await source.read({ filter: { filters: [{ field: 'orderId', operator: 'eq', value: 7 }] } })
  assert.deepEqual(calls, ['7'])
  assert.equal(response.data[0].orderId, '7')
  await assert.rejects(source.getById('l-1'), /not supported/)
})

test('cursor navigation and undo/redo match DataContext scenarios', () => {
  const cursor = new NavigationCursor(() => 2)
  const changes = []
  cursor.subscribe((index) => changes.push(index))
  assert.equal(cursor.first(), true)
  assert.equal(cursor.next(), true)
  assert.equal(cursor.next(), false)
  assert.deepEqual(changes, [0, 1])

  const context = createDataContext({ idField: 'id' })
  context.loadRecords([{ id: '1', name: 'Before' }])
  context.update('1', { name: 'After' })
  assert.equal(context.canUndo, true)
  assert.equal(context.undo(), true)
  assert.equal(context.findRecord('1').data.name, 'Before')
  assert.equal(context.redo(), true)
  assert.equal(context.findRecord('1').data.name, 'After')
  context.delete('1')
  assert.equal(context.findRecord('1').state, RecordState.Deleted)
  context.undo()
  assert.equal(context.findRecord('1').state, RecordState.Modified)
})

test('form model writes current-record edits back without React', () => {
  const context = createDataContext({ idField: 'id', defaultFormValue: { id: '', name: '' } })
  context.loadRecords([{ id: '1', name: 'Atlas' }])
  const model = context.formModel
  model.update((value) => ({ ...value, name: 'Orion' }))
  assert.equal(context.current.data.name, 'Orion')

  const detached = createContextFormModel({
    defaultValue: { name: '' },
    current: () => null,
    patch: () => undefined,
  })
  detached.set({ name: 'Detached' })
  assert.equal(detached.value.name, 'Detached')
})

test('NodeStore loads nested relations, tracks edits, and bridges forms', async () => {
  const store = createNodeStore({
    rootType: 'Order',
    rootIdField: 'id',
    load: async () => [{ id: 'o-1', customer: 'ACME' }],
    relations: [{
      name: 'lines',
      childType: 'Line',
      idField: 'id',
      foreignKey: 'orderId',
      loadChildren: async (order) => [{ id: 'l-1', orderId: order.id, total: 10 }],
      relations: [{
        name: 'taxes',
        childType: 'Tax',
        idField: 'id',
        foreignKey: 'lineId',
        loadChildren: async (line) => [{ id: 't-1', lineId: line.id, amount: 1 }],
      }],
    }],
  })
  await store.load()
  await store.loadChildren('Order:o-1', 'lines')
  await store.loadChildren('Line:l-1', 'taxes')
  store.patch('Tax:t-1', { amount: 2 })
  const payload = store.buildPayload()
  assert.equal(payload[0].lines[0].taxes[0].amount, 2)
  assert.equal(payload[0].lines[0].taxes[0]._state, 'Modified')

  store.select('Order:o-1')
  const bridge = createFormBridge({ store, emptyValue: () => ({ id: '', customer: '' }) })
  bridge.model.update((value) => ({ ...value, customer: 'Globex' }))
  assert.equal(store.find('Order:o-1').data.customer, 'Globex')
  bridge.dispose()
  assert.throws(() => store.select('missing'), (error) => error instanceof NodeStoreError && error.code === NodeStoreErrorCode.NodeNotFound)
})

test('DataContext surfaces typed errors and ArrayDataSource syncs changes', async () => {
  const source = createArrayDataSource([{ id: '1', name: 'Before' }])
  const context = createDataContext({ idField: 'id', dataSource: source })
  await context.load()
  context.update('1', { name: 'After' })
  await context.save()
  assert.equal((await source.getById('1')).name, 'After')

  assert.throws(
    () => context.update('missing', { name: 'x' }),
    (error) => error instanceof DataContextError && error.code === DataContextErrorCode.RecordNotFound,
  )
})

test('DataContext event observers, validation, and acceptChanges cover integration boundaries', async () => {
  const events = []
  let completed = false
  const context = createDataContext({
    idField: 'id',
    fieldValidators: { name: (value) => value ? null : 'Name is required' },
    dataSource: {
      read: async () => ({ pageNumber: 1, pageSize: 1, totalPages: 1, totalRecords: 1, data: [{ id: '1', name: 'A' }], hasPrevious: false, hasNext: false }),
      getById: async () => ({ id: '1', name: 'A' }),
      search: async () => ({ pageNumber: 1, pageSize: 0, totalPages: 0, totalRecords: 0, data: [], hasPrevious: false, hasNext: false }),
    },
  })
  context.events$.subscribe({ next: (event) => events.push(event.type), complete: () => { completed = true } })
  await context.load()
  context.update('1', { name: '' })
  assert.equal(context.isValid, false)
  assert.equal(context.validationErrors[0].message, 'Name is required')
  await assert.rejects(context.save(), (error) => error.code === DataContextErrorCode.ValidationFailed)
  context.update('1', { name: 'B' })
  context.acceptChanges()
  assert.equal(context.dirty, false)
  assert.deepEqual(events, ['load', 'update', 'update'])
  context.dispose()
  assert.equal(completed, true)
})

test('lazy details preserve numeric foreign-key matching', async () => {
  const source = createArrayDataSource([{ id: 1, personId: 7, total: 100 }], { idField: 'id' })
  const context = createDataContext({
    idField: 'id',
    details: { orders: { idField: 'id', foreignKey: 'personId', dataSource: source, lazyLoad: true } },
  })
  context.loadRecords([{ id: 7, name: 'Ann' }])
  const orders = context.current.getDetail('orders')
  await new Promise((resolve) => setTimeout(resolve, 0))
  assert.equal(orders.count, 1)
  assert.equal(orders.current.data.total, 100)
})
