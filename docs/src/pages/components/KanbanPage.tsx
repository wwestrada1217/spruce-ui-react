import { useState, useEffect, useRef } from 'react'
import { Kanban, Badge, Avatar, Icon, type KanbanColumn, type KanbanCardMoveEvent, type KanbanColumnMoveEvent } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

// ── Basic demo data ─────────────────────────────────────────────────────────

function makeBasicColumns(): KanbanColumn[] {
  return [
    {
      id: 'todo',
      title: 'To Do',
      color: '#6366f1',
      cards: [
        { id: '1', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment' },
        { id: '2', title: 'Design system audit', description: 'Review color tokens and spacing scale for consistency' },
        { id: '3', title: 'Write API documentation', description: 'Document all REST endpoints with OpenAPI specs' },
      ],
    },
    {
      id: 'progress',
      title: 'In Progress',
      color: '#f59e0b',
      cards: [
        { id: '4', title: 'Implement auth flow', description: 'OAuth2 + PKCE with refresh token rotation' },
        { id: '5', title: 'Dashboard charts', description: 'Add bar chart and line chart to the analytics view' },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      color: '#22c55e',
      cards: [
        { id: '6', title: 'Database schema migration', description: 'Migrated user table to support multi-tenancy' },
      ],
    },
  ]
}

// ── Custom card demo data ───────────────────────────────────────────────────

function makeCustomColumns(): KanbanColumn[] {
  return [
    {
      id: 'backlog',
      title: 'Backlog',
      color: '#8b5cf6',
      cards: [
        { id: 'c1', title: 'Upgrade to Angular 20', description: 'Migrate to latest Angular with signal-based APIs', tag: 'SP-101', priority: 'high', assignee: 'Alice Chen' },
        { id: 'c2', title: 'Add dark mode toggle', description: 'Persist preference in localStorage', tag: 'SP-102', priority: 'medium', assignee: 'Bob Kim' },
      ],
    },
    {
      id: 'active',
      title: 'Active',
      color: '#3b82f6',
      cards: [
        { id: 'c3', title: 'Fix date picker timezone bug', description: 'UTC offset breaks in DST transitions', tag: 'SP-98', priority: 'high', assignee: 'Carol Li' },
      ],
    },
    {
      id: 'review',
      title: 'In Review',
      color: '#f59e0b',
      cards: [
        { id: 'c4', title: 'Refactor tooltip positioning', description: 'Switch to Floating UI for edge cases', tag: 'SP-95', priority: 'low', assignee: 'Dan Wu' },
      ],
    },
    {
      id: 'shipped',
      title: 'Shipped',
      color: '#22c55e',
      cards: [
        { id: 'c5', title: 'New badge component', tag: 'SP-90', priority: 'low', assignee: 'Alice Chen' },
      ],
    },
  ]
}

// ── Code snippets ────────────────────────────────────────────────────────────

const basicCode = `<Kanban
  columns={columns}
  onCardMoved={(e) => handleCardMoved(e)}
  onColumnMoved={(e) => handleColumnMoved(e)}
/>`

const customCardsCode = `<Kanban
  columns={columns}
  onCardMoved={(e) => handleCardMoved(e)}
  cardRenderer={(card, column) => (
    <div className="custom-card">
      <div className="custom-card__header">
        <span className="custom-card__id">{card.tag}</span>
        <Badge
          variant={card.priority === 'high' ? 'danger' : card.priority === 'medium' ? 'warning' : 'info'}
          size="sm" pill
        >{card.priority}</Badge>
      </div>
      <div className="custom-card__title">{card.title}</div>
      {card.description && <div className="custom-card__desc">{card.description}</div>}
      <div className="custom-card__footer">
        <Avatar name={card.assignee} size="xs" />
        <span className="custom-card__assignee">{card.assignee}</span>
      </div>
    </div>
  )}
/>`

const customHeadersCode = `<Kanban
  columns={columns}
  onCardMoved={(e) => handleCardMoved(e)}
  columnHeaderRenderer={(col, count) => (
    <div className="custom-header">
      <Icon name={col.id === 'todo' ? 'circle' : col.id === 'progress' ? 'clock' : 'check-circle'} size={16} />
      <span className="custom-header__title">{col.title}</span>
      <Badge size="sm" pill>{count}</Badge>
    </div>
  )}
/>`

// ── Sections ─────────────────────────────────────────────────────────────────

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'custom-cards', label: 'Custom Cards' },
  { id: 'custom-headers', label: 'Custom Headers' },
  { id: 'keyboard', label: 'Keyboard' },
  { id: 'api', label: 'API' },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export function KanbanPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const mainRef = useRef<HTMLDivElement>(null)
  const [basicColumns, setBasicColumns] = useState(makeBasicColumns)
  const [customColumns, setCustomColumns] = useState(makeCustomColumns)

  useEffect(() => {
    const scrollContainer = mainRef.current?.closest('.docs-main') as HTMLElement | null

    const checkIfScrolledToBottom = () => {
      if (!scrollContainer) return
      if (Math.abs(scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) < 2) {
        setActiveSection(SECTIONS[SECTIONS.length - 1].id)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollContainer && Math.abs(scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) < 2) return

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      {
        root: scrollContainer || null,
        rootMargin: '-10% 0px -60% 0px',
        threshold: 0,
      },
    )

    mainRef.current?.querySelectorAll('section[id]').forEach((el) => observer.observe(el))
    scrollContainer?.addEventListener('scroll', checkIfScrolledToBottom, { passive: true })

    return () => {
      observer.disconnect()
      scrollContainer?.removeEventListener('scroll', checkIfScrolledToBottom)
    }
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  /* ── Move helpers ──────────────────────────────────────────────────────── */

  function applyCardMove(cols: KanbanColumn[], event: KanbanCardMoveEvent): KanbanColumn[] {
    const result = cols.map((c) => ({ ...c, cards: [...c.cards] }))
    const fromCol = result.find((c) => c.id === event.fromColumnId)!
    const toCol = result.find((c) => c.id === event.toColumnId)!
    const [card] = fromCol.cards.splice(event.fromIndex, 1)
    toCol.cards.splice(event.toIndex, 0, card)
    return result
  }

  function applyColumnMove(cols: KanbanColumn[], event: KanbanColumnMoveEvent): KanbanColumn[] {
    const result = [...cols]
    const [col] = result.splice(event.fromIndex, 1)
    result.splice(event.toIndex, 0, col)
    return result
  }

  const handleBasicCardMoved = (e: KanbanCardMoveEvent) => {
    setBasicColumns((prev) => applyCardMove(prev, e))
  }

  const handleBasicColumnMoved = (e: KanbanColumnMoveEvent) => {
    setBasicColumns((prev) => applyColumnMove(prev, e))
  }

  const handleCustomCardMoved = (e: KanbanCardMoveEvent) => {
    setCustomColumns((prev) => applyCardMove(prev, e))
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Kanban</h1>
        <p className="docs-desc">
          Interactive Kanban board with drag &amp; drop support. Move cards between columns
          and reorder columns with native drag and drop or keyboard shortcuts.
        </p>

        {/* Basic */}
        <section id="basic" className="demo-section">
          <h2>Basic</h2>
          <p className="section-desc">A simple Kanban board with default card rendering.</p>
          <CodePreview code={basicCode}>
            <Kanban
              columns={basicColumns}
              onCardMoved={handleBasicCardMoved}
              onColumnMoved={handleBasicColumnMoved}
            />
          </CodePreview>
        </section>

        {/* Custom card template */}
        <section id="custom-cards" className="demo-section">
          <h2>Custom Card Template</h2>
          <p className="section-desc">
            Use <code>cardRenderer</code> to provide a custom card layout.
          </p>
          <CodePreview code={customCardsCode}>
            <Kanban
              columns={customColumns}
              onCardMoved={handleCustomCardMoved}
              cardRenderer={(card) => (
                <div className="custom-card">
                  <div className="custom-card__header">
                    <span className="custom-card__id">{card['tag'] as string}</span>
                    <Badge
                      variant={card['priority'] === 'high' ? 'danger' : card['priority'] === 'medium' ? 'warning' : 'info'}
                      size="sm"
                      pill
                    >{card['priority'] as string}</Badge>
                  </div>
                  <div className="custom-card__title">{card.title}</div>
                  {card.description && <div className="custom-card__desc">{card.description}</div>}
                  <div className="custom-card__footer">
                    <Avatar name={(card['assignee'] as string) ?? ''} size="xs" />
                    <span className="custom-card__assignee">{card['assignee'] as string}</span>
                  </div>
                </div>
              )}
            />
          </CodePreview>
        </section>

        {/* Custom column header */}
        <section id="custom-headers" className="demo-section">
          <h2>Custom Column Header</h2>
          <p className="section-desc">
            Use <code>columnHeaderRenderer</code> to customize the column header layout.
          </p>
          <CodePreview code={customHeadersCode}>
            <Kanban
              columns={basicColumns}
              onCardMoved={handleBasicCardMoved}
              columnHeaderRenderer={(col, count) => (
                <div className="custom-header">
                  <Icon name={col.id === 'todo' ? 'circle' : col.id === 'progress' ? 'clock' : 'check-circle'} size={16} />
                  <span className="custom-header__title">{col.title}</span>
                  <Badge size="sm" pill>{count}</Badge>
                </div>
              )}
            />
          </CodePreview>
        </section>

        {/* Keyboard */}
        <section id="keyboard" className="demo-section">
          <h2>Keyboard Support</h2>
          <p className="section-desc">Cards can be moved with keyboard shortcuts for full accessibility.</p>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Shortcut</th><th>Action</th></tr></thead>
              <tbody>
                <tr><td><code>Alt + ArrowUp</code></td><td>Move card up within column</td></tr>
                <tr><td><code>Alt + ArrowDown</code></td><td>Move card down within column</td></tr>
                <tr><td><code>Alt + ArrowLeft</code></td><td>Move card to previous column</td></tr>
                <tr><td><code>Alt + ArrowRight</code></td><td>Move card to next column</td></tr>
                <tr><td><code>Enter / Space</code></td><td>Emit cardClicked event</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>columns</code></td><td><code>KanbanColumn[]</code></td><td>required</td><td>Array of columns, each with an array of cards</td></tr>
                <tr><td><code>columnDraggable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether columns can be reordered via drag</td></tr>
                <tr><td><code>cardDraggable</code></td><td><code>boolean | predicate</code></td><td><code>true</code></td><td>Enable or selectively enable card dragging</td></tr>
                <tr><td><code>canMoveCard</code>, <code>canDropCard</code></td><td><code>callbacks</code></td><td>-</td><td>Guard drag and keyboard movement</td></tr>
                <tr><td><code>emptyMessage</code></td><td><code>string</code></td><td>localized</td><td>Empty-column drop text</td></tr>
                <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>'Kanban board'</code></td><td>ARIA label for the board region</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Callbacks</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>onCardMoved</code></td><td><code>KanbanCardMoveEvent</code></td><td>Emitted when a card is moved (drag, drop, or keyboard)</td></tr>
                <tr><td><code>onColumnMoved</code></td><td><code>KanbanColumnMoveEvent</code></td><td>Emitted when a column is reordered via drag</td></tr>
                <tr><td><code>onCardClicked</code></td><td><code>CardClickEvent</code></td><td>Emitted on Enter/Space keypress on a focused card (card + column)</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Render Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Prop</th><th>Signature</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>cardRenderer</code></td><td><code>(card: KanbanCard, column: KanbanColumn) =&gt; ReactNode</code></td><td>Custom card template</td></tr>
                <tr><td><code>columnHeaderRenderer</code></td><td><code>(column: KanbanColumn, count: number) =&gt; ReactNode</code></td><td>Custom column header template</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Interfaces</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Interface</th><th>Properties</th></tr></thead>
              <tbody>
                <tr><td><code>KanbanCard</code></td><td><code>id, title, description?, plus extra fields</code></td></tr>
                <tr><td><code>KanbanColumn</code></td><td><code>id, title, cards, color?</code></td></tr>
                <tr><td><code>KanbanCardMoveEvent</code></td><td><code>card, fromColumnId, toColumnId, fromIndex, toIndex</code></td></tr>
                <tr><td><code>KanbanColumnMoveEvent</code></td><td><code>columnId, fromIndex, toIndex</code></td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Table of Contents */}
      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
