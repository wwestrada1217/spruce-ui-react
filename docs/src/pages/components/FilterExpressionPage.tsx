import { useState, useEffect, useRef } from 'react'
import { FilterExpression } from 'spruce-react'
import type { FilterField, FilterGroup, FieldType } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_FIELDS: FilterField[] = [
  { label: 'Name', value: 'name' },
  { label: 'Category', value: 'category' },
  { label: 'Price', value: 'price' },
  { label: 'Status', value: 'status' },
  { label: 'SKU', value: 'sku' },
]

const CUSTOM_FIELDS: FilterField[] = [
  { label: 'Product Name', value: 'name' },
  {
    label: 'Price',
    value: 'price',
    operators: [
      { label: 'Equals', value: 'equals' },
      { label: 'Greater than', value: 'greaterThan' },
      { label: 'Less than', value: 'lessThan' },
      { label: 'Between', value: 'between', needsSecondValue: true },
    ],
  },
  {
    label: 'Status',
    value: 'status',
    operators: [
      { label: 'Equals', value: 'equals' },
      { label: 'Not equals', value: 'notEquals' },
      { label: 'Is blank', value: 'blank', needsValue: false },
    ],
  },
]

const TYPED_FIELDS: FilterField[] = [
  { label: 'Name', value: 'name', type: 'text' },
  { label: 'Age', value: 'age', type: 'number' },
  { label: 'Created Date', value: 'createdDate', type: 'date' },
  { label: 'Last Updated', value: 'lastUpdated', type: 'datetime' },
  { label: 'Start Time', value: 'startTime', type: 'time' },
  { label: 'Active', value: 'active', type: 'boolean' },
]

const TYPE_ROWS: { type: FieldType; desc: string }[] = [
  { type: 'text', desc: 'Plain text input (default). Operators: contains, starts with, ends with, blank...' },
  { type: 'number', desc: 'Numeric input. Operators: equals, greater than, less than, between, blank...' },
  { type: 'date', desc: 'Date picker in input mode. Operators: equals, after, before, between, blank...' },
  { type: 'datetime', desc: 'Date & time picker in input mode. Same operators as date.' },
  { type: 'time', desc: 'Time picker in input mode. Same operators as date.' },
  { type: 'boolean', desc: 'True / False select. Operators: is, is not.' },
]

const BASIC_CODE = `import { FilterExpression } from 'spruce-react'
import type { FilterField, FilterGroup } from 'spruce-react'

const fields: FilterField[] = [
  { label: 'Name', value: 'name' },
  { label: 'Category', value: 'category' },
  { label: 'Price', value: 'price' },
  { label: 'Status', value: 'status' },
]

const [expression, setExpression] = useState<FilterGroup>({
  type: 'group',
  logic: 'and',
  children: [],
})

<FilterExpression
  fields={fields}
  expression={expression}
  onChange={setExpression}
/>`

const NESTED_CODE = `const [expression, setExpression] = useState<FilterGroup>({
  type: 'group',
  logic: 'and',
  children: [
    { type: 'rule', field: 'status', operator: 'equals', value: 'active' },
    {
      type: 'group',
      logic: 'or',
      children: [
        { type: 'rule', field: 'category', operator: 'equals', value: 'Electronics' },
        { type: 'rule', field: 'price', operator: 'greaterThan', value: '100' },
      ],
    },
  ],
})

<FilterExpression fields={fields} expression={expression} onChange={setExpression} />`

const CUSTOM_OP_CODE = `const fields: FilterField[] = [
  { label: 'Product Name', value: 'name' },
  {
    label: 'Price',
    value: 'price',
    operators: [
      { label: 'Equals', value: 'equals' },
      { label: 'Greater than', value: 'greaterThan' },
      { label: 'Less than', value: 'lessThan' },
      { label: 'Between', value: 'between', needsSecondValue: true },
    ],
  },
  {
    label: 'Status',
    value: 'status',
    operators: [
      { label: 'Equals', value: 'equals' },
      { label: 'Not equals', value: 'notEquals' },
      { label: 'Is blank', value: 'blank', needsValue: false },
    ],
  },
]

<FilterExpression fields={fields} expression={expression} onChange={setExpression} />`

const FIELD_TYPE_CODE = `const fields: FilterField[] = [
  { label: 'Name',         value: 'name',        type: 'text' },
  { label: 'Age',          value: 'age',         type: 'number' },
  { label: 'Created Date', value: 'createdDate', type: 'date' },
  { label: 'Last Updated', value: 'lastUpdated', type: 'datetime' },
  { label: 'Start Time',   value: 'startTime',   type: 'time' },
  { label: 'Active',       value: 'active',      type: 'boolean' },
]

<FilterExpression fields={fields} expression={expression} onChange={setExpression} />`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic Usage' },
  { id: 'nested', label: 'Nested Groups' },
  { id: 'custom-operators', label: 'Custom Operators' },
  { id: 'field-types', label: 'Field Types' },
  { id: 'api', label: 'API' },
]

export function FilterExpressionPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const mainRef = useRef<HTMLDivElement>(null)

  const [basicExpression, setBasicExpression] = useState<FilterGroup>({
    type: 'group',
    logic: 'and',
    children: [
      { type: 'rule', field: 'name', operator: 'contains', value: '' },
    ],
  })

  const [nestedExpression, setNestedExpression] = useState<FilterGroup>({
    type: 'group',
    logic: 'and',
    children: [
      { type: 'rule', field: 'status', operator: 'equals', value: 'active' },
      {
        type: 'group',
        logic: 'or',
        children: [
          { type: 'rule', field: 'category', operator: 'equals', value: 'Electronics' },
          { type: 'rule', field: 'price', operator: 'greaterThan', value: '100' },
        ],
      },
    ],
  })

  const [customOpExpression, setCustomOpExpression] = useState<FilterGroup>({
    type: 'group',
    logic: 'and',
    children: [],
  })

  const [fieldTypeExpression, setFieldTypeExpression] = useState<FilterGroup>({
    type: 'group',
    logic: 'and',
    children: [
      { type: 'rule', field: 'name', operator: 'contains', value: '' },
      { type: 'rule', field: 'age', operator: 'greaterThan', value: '' },
      { type: 'rule', field: 'createdDate', operator: 'greaterThan', value: '' },
      { type: 'rule', field: 'active', operator: 'equals', value: '' },
    ],
  })

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
        <h1>Filter Expression</h1>
        <p className="docs-desc">
          Build complex filter queries with nested AND/OR groups. Each group combines its conditions with a logic operator, and groups can be nested to any depth.
        </p>

        {/* Basic */}
        <section id="basic" className="demo-section">
          <h2>Basic Usage</h2>
          <p className="section-desc">
            Pass a list of filterable fields. Users can add rules, change operators, and enter values. The component emits the full expression tree on every change.
          </p>
          <CodePreview code={BASIC_CODE}>
            <FilterExpression
              fields={BASIC_FIELDS}
              expression={basicExpression}
              onChange={setBasicExpression}
            />
            {basicExpression.children.length > 0 && (
              <pre style={{
                marginTop: 12, padding: 12,
                background: 'var(--sp-surface-50)', border: '1px solid var(--sp-border)',
                borderRadius: 6, fontSize: 12, color: 'var(--sp-text-muted)',
                overflowX: 'auto', whiteSpace: 'pre-wrap', maxHeight: 200,
              }}>
                {JSON.stringify(basicExpression, null, 2)}
              </pre>
            )}
          </CodePreview>
        </section>

        {/* Nested groups */}
        <section id="nested" className="demo-section">
          <h2>Nested Groups</h2>
          <p className="section-desc">
            Click <strong>+ Group</strong> to create a nested sub-group with its own AND/OR logic. This lets users express complex queries like <em>"status is active AND (category is Electronics OR price {'>'} 100)"</em>.
          </p>
          <CodePreview code={NESTED_CODE}>
            <FilterExpression
              fields={BASIC_FIELDS}
              expression={nestedExpression}
              onChange={setNestedExpression}
            />
          </CodePreview>
        </section>

        {/* Custom operators */}
        <section id="custom-operators" className="demo-section">
          <h2>Custom Operators</h2>
          <p className="section-desc">
            Each field can define its own set of operators. For example, a numeric field might only offer comparison operators, while a status field might use "equals" and "not equals".
          </p>
          <CodePreview code={CUSTOM_OP_CODE}>
            <FilterExpression
              fields={CUSTOM_FIELDS}
              expression={customOpExpression}
              onChange={setCustomOpExpression}
            />
          </CodePreview>
        </section>

        {/* Field types */}
        <section id="field-types" className="demo-section">
          <h2>Field Types</h2>
          <p className="section-desc">
            Set <code>type</code> on a field to control which input component appears in the value column. Each type also gets a sensible default set of operators so you don't have to configure them manually. Operator labels use the active Spruce locale.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {TYPE_ROWS.map((r) => (
              <div key={r.type} style={{ display: 'flex', alignItems: 'baseline', gap: 12, fontSize: 13 }}>
                <code style={{
                  fontSize: 12, padding: '1px 7px',
                  background: 'var(--sp-primary-subtle, #dbeafe)', color: 'var(--sp-primary, #2563eb)',
                  borderRadius: 4, whiteSpace: 'nowrap', flexShrink: 0, minWidth: 72, textAlign: 'center',
                }}>
                  {r.type}
                </code>
                <span style={{ color: 'var(--sp-text-muted, #4a5568)' }}>{r.desc}</span>
              </div>
            ))}
          </div>
          <CodePreview code={FIELD_TYPE_CODE}>
            <FilterExpression
              fields={TYPED_FIELDS}
              expression={fieldTypeExpression}
              onChange={setFieldTypeExpression}
            />
            {fieldTypeExpression.children.length > 0 && (
              <pre style={{
                marginTop: 12, padding: 12,
                background: 'var(--sp-surface-50)', border: '1px solid var(--sp-border)',
                borderRadius: 6, fontSize: 12, color: 'var(--sp-text-muted)',
                overflowX: 'auto', whiteSpace: 'pre-wrap', maxHeight: 200,
              }}>
                {JSON.stringify(fieldTypeExpression, null, 2)}
              </pre>
            )}
          </CodePreview>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>FilterExpression</h3>
          <h4>Props</h4>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>fields</code></td>
                  <td><code>FilterField[]</code></td>
                  <td>required</td>
                  <td>Available fields for filter rules</td>
                </tr>
                <tr>
                  <td><code>expression</code></td>
                  <td><code>FilterGroup</code></td>
                  <td>empty AND group</td>
                  <td>The filter expression tree (controlled)</td>
                </tr>
                <tr>
                  <td><code>onChange</code></td>
                  <td><code>(expression: FilterGroup) =&gt; void</code></td>
                  <td>required</td>
                  <td>Called when the expression changes</td>
                </tr>
                <tr>
                  <td><code>maxDepth</code></td>
                  <td><code>number</code></td>
                  <td><code>5</code></td>
                  <td>Maximum nesting depth for groups</td>
                </tr>
                <tr>
                  <td><code>chrome / radius / border</code></td>
                  <td><code>Chrome / Radius / Border</code></td>
                  <td><code>'default'</code></td>
                  <td>Surface styling tokens for the expression container</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>FilterField</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>label</code></td>
                  <td><code>string</code></td>
                  <td>Display label shown in the field dropdown</td>
                </tr>
                <tr>
                  <td><code>value</code></td>
                  <td><code>string</code></td>
                  <td>Field identifier used in the expression tree</td>
                </tr>
                <tr>
                  <td><code>type</code></td>
                  <td><code>FieldType</code></td>
                  <td>Controls the value input component and the default operator set. One of <code>'text'</code>, <code>'number'</code>, <code>'date'</code>, <code>'datetime'</code>, <code>'time'</code>, <code>'boolean'</code>. Defaults to <code>'text'</code>.</td>
                </tr>
                <tr>
                  <td><code>operators</code></td>
                  <td><code>FilterOperatorOption[]</code></td>
                  <td>Custom operators for this field. When omitted, a default set is chosen based on <code>type</code>.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>FilterOperatorOption</h3>
          <p className="section-desc">Use <code>labelKey</code> for labels resolved through <code>useI18n</code>. The exported <code>TEXT_OPERATORS</code>, <code>NUMBER_OPERATORS</code>, <code>DATE_OPERATORS</code>, <code>BOOLEAN_OPERATORS</code>, and deprecated <code>DEFAULT_FILTER_OPERATORS</code> sets are ready to reuse.</p>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>label</code></td><td><code>string</code></td><td>Fallback display label</td></tr>
                <tr><td><code>labelKey</code></td><td><code>SpI18nLabelKey?</code></td><td>Localized label key; takes precedence over <code>label</code></td></tr>
                <tr><td><code>needsValue</code></td><td><code>boolean?</code></td><td>Whether the primary value control is shown; defaults to <code>true</code></td></tr>
                <tr><td><code>needsSecondValue</code></td><td><code>boolean?</code></td><td>Whether a second value control is shown for range operators</td></tr>
              </tbody>
            </table>
          </div>

          <h3>FilterGroup</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>type</code></td><td><code>'group'</code></td><td>Discriminant for the union type</td></tr>
                <tr><td><code>logic</code></td><td><code>'and' | 'or'</code></td><td>How to combine children</td></tr>
                <tr><td><code>children</code></td><td><code>FilterExpression[]</code></td><td>Child rules and nested groups</td></tr>
              </tbody>
            </table>
          </div>

          <h3>FilterRule</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Property</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>type</code></td><td><code>'rule'</code></td><td>Discriminant for the union type</td></tr>
                <tr><td><code>field</code></td><td><code>string</code></td><td>The field to filter on</td></tr>
                <tr><td><code>operator</code></td><td><code>string</code></td><td>The comparison operator</td></tr>
                <tr><td><code>value</code></td><td><code>string</code></td><td>The filter value</td></tr>
                <tr><td><code>value2</code></td><td><code>string</code></td><td>Second value for range operators like "between"</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

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
