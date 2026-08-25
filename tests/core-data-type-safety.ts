import {
  createDataContext,
  createFormBridge,
  createNodeStore,
  type DataContext,
  type StoreConfig,
} from '../src/data/index.js'

interface Order extends Record<string, unknown> {
  id: string
  customer: string
}

const config: StoreConfig<Order> = {
  rootType: 'Order',
  rootIdField: 'id',
  load: async () => [{ id: '1', customer: 'ACME' }],
}

const store = createNodeStore(config)
const bridge = createFormBridge({
  store,
  emptyValue: () => ({ id: '', customer: '' }),
})
const context: DataContext<Order> = createDataContext({ idField: 'id' })

void bridge
void context
