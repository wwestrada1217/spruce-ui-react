import { useState, useEffect, useRef } from 'react'
import { List, ListItem, ListItemLine, Avatar, Badge, Button } from 'spruce-react'
import { Icon } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

/* ── Types ──────────────────────────────────────────────────────────────── */

interface TeamMember {
  name: string
  role: string
  online: boolean
}

interface InboxMessage {
  id: number
  from: string
  subject: string
  preview: string
  time: string
  unread: boolean
  labels: string[]
}

interface NotificationItem {
  id: number
  icon: string
  text: string
  time: string
  type: 'info' | 'success' | 'warning'
}

/* ── Code snippets ─────────────────────────────────────────────────────── */

const BASIC_CODE = `<List variant="bordered" ariaLabel="Navigation">
  <ListItem>
    <ListItemLine>Dashboard</ListItemLine>
    <ListItemLine secondary>Overview of key metrics</ListItemLine>
  </ListItem>
  <ListItem>
    <ListItemLine>Settings</ListItemLine>
    <ListItemLine secondary>Manage your preferences</ListItemLine>
  </ListItem>
</List>`

const ROSTER_CODE = `<List ariaLabel="Team members">
  {members.map(member => (
    <ListItem
      key={member.name}
      leading={<Avatar name={member.name} size="sm" />}
      trailing={
        <Badge variant={member.online ? 'success' : 'default'} size="sm">
          {member.online ? 'Online' : 'Offline'}
        </Badge>
      }
    >
      <ListItemLine>{member.name}</ListItemLine>
      <ListItemLine secondary>{member.role}</ListItemLine>
    </ListItem>
  ))}
</List>`

const INBOX_CODE = `<List ariaLabel="Inbox messages">
  {messages.map(msg => (
    <ListItem
      key={msg.id}
      unread={msg.unread}
      active={selectedMsg === msg.id}
      onClick={() => setSelectedMsg(msg.id)}
      leading={<Avatar name={msg.from} size="sm" />}
    >
      <ListItemLine>{msg.from}</ListItemLine>
      <ListItemLine>{msg.subject}</ListItemLine>
      <ListItemLine secondary ellipsis>{msg.preview}</ListItemLine>
    </ListItem>
  ))}
</List>`

const NOTIF_CODE = `<List ariaLabel="Notifications">
  <ListItem
    leading={
      <div className="notif-icon notif-icon--success">
        <Icon name="check-circle" size={16} />
      </div>
    }
    trailing={<span>2 min ago</span>}
  >
    <ListItemLine>Deployment completed</ListItemLine>
  </ListItem>
</List>`

const VARIANTS_CODE = `<!-- Variants: default | bordered | striped -->
<List variant="bordered">...</List>
<List variant="striped">...</List>

<!-- Sizes: sm | md | lg -->
<List size="sm">...</List>
<List size="lg">...</List>`

const ACTIONS_CODE = `<List variant="bordered" ariaLabel="Files">
  <ListItem
    leading={<Icon name="file-text" size={18} />}
    trailing={<Button size="sm" variant="ghost"><Icon name="download" size={14} /></Button>}
  >
    <ListItemLine>quarterly-report.pdf</ListItemLine>
    <ListItemLine secondary>2.4 MB</ListItemLine>
  </ListItem>
</List>`

/* ── Data ──────────────────────────────────────────────────────────────── */

const members: TeamMember[] = [
  { name: 'Alex Johnson', role: 'Lead Engineer', online: true },
  { name: 'Sarah Chen', role: 'Product Designer', online: true },
  { name: 'Marcus Rivera', role: 'Backend Developer', online: false },
  { name: 'Emily Park', role: 'QA Engineer', online: true },
  { name: 'Daniel Kim', role: 'DevOps', online: false },
  { name: 'Olivia Smith', role: 'Frontend Developer', online: true },
  { name: 'James Lee', role: 'Engineering Manager', online: false },
  { name: 'Mia Williams', role: 'UX Researcher', online: true },
]

const messages: InboxMessage[] = [
  {
    id: 1, from: 'Sarah Chen', subject: 'Design review feedback',
    preview: 'I reviewed the latest mockups and have some suggestions for the navigation flow...',
    time: '10:32 AM', unread: true, labels: ['Design'],
  },
  {
    id: 2, from: 'Marcus Rivera', subject: 'API migration update',
    preview: 'The v2 endpoints are now deployed to staging. Please test your integrations...',
    time: '9:15 AM', unread: true, labels: ['Backend', 'Urgent'],
  },
  {
    id: 3, from: 'Emily Park', subject: 'Test suite results',
    preview: 'All 247 test cases passed. Coverage is up to 94%. Full report attached.',
    time: 'Yesterday', unread: false, labels: ['QA'],
  },
  {
    id: 4, from: 'Daniel Kim', subject: 'Infrastructure cost report',
    preview: 'Monthly cloud spend decreased by 12% after the optimization changes...',
    time: 'Yesterday', unread: false, labels: [],
  },
  {
    id: 5, from: 'Alex Johnson', subject: 'Sprint planning notes',
    preview: 'Here are the priorities for the next sprint based on our discussion...',
    time: 'Mon', unread: false, labels: ['Planning'],
  },
]

const notifications: NotificationItem[] = [
  { id: 1, icon: 'check-circle', text: 'Deployment to production completed successfully', time: '2 min ago', type: 'success' },
  { id: 2, icon: 'alert-triangle', text: 'Memory usage exceeded 80% threshold on server-3', time: '15 min ago', type: 'warning' },
  { id: 3, icon: 'info', text: 'New team member Olivia joined the project', time: '1 hr ago', type: 'info' },
  { id: 4, icon: 'check-circle', text: 'Pull request #342 merged into main', time: '3 hrs ago', type: 'success' },
  { id: 5, icon: 'info', text: 'Scheduled maintenance window this Saturday 2-4 AM', time: '5 hrs ago', type: 'info' },
]

/* ── Sections ──────────────────────────────────────────────────────────── */

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',         label: 'Basic' },
  { id: 'team-roster',   label: 'Team Roster' },
  { id: 'inbox',         label: 'Inbox List' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'variants',      label: 'Variants & Sizes' },
  { id: 'actions',       label: 'Trailing Actions' },
  { id: 'api',           label: 'API' },
]

/* ── Inline styles ─────────────────────────────────────────────────────── */

const notifIconStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: 'var(--sp-radius-md, 6px)',
  flexShrink: 0,
}

const notifTimeStyle: React.CSSProperties = {
  fontSize: 'var(--sp-text-xs, 0.75rem)',
  color: 'var(--sp-text-muted)',
  whiteSpace: 'nowrap',
}

const variantLabelStyle: React.CSSProperties = {
  fontSize: 'var(--sp-text-sm, 13px)',
  fontWeight: 600,
  margin: '0 0 8px',
}

const inboxRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
}

const inboxTimeStyle: React.CSSProperties = {
  fontSize: 'var(--sp-text-xs, 0.75rem)',
  color: 'var(--sp-text-muted)',
  whiteSpace: 'nowrap',
  flexShrink: 0,
}

const inboxLabelsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 4,
  marginTop: 4,
}

function getNotifIconColors(type: 'info' | 'success' | 'warning'): React.CSSProperties {
  if (type === 'success') return { background: 'var(--sp-success-subtle)', color: 'var(--sp-success)' }
  if (type === 'warning') return { background: 'var(--sp-warning-subtle)', color: 'var(--sp-warning)' }
  return { background: 'var(--sp-info-subtle)', color: 'var(--sp-info)' }
}

/* ── Component ─────────────────────────────────────────────────────────── */

export function ListPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [selectedMsg, setSelectedMsg] = useState<number | null>(null)
  const mainRef = useRef<HTMLDivElement>(null)

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
        <h1>List</h1>
        <p className="docs-desc">
          A flexible list component for rendering collections of items with leading visuals,
          multi-line text, trailing actions, and decorations like badges.
        </p>

        {/* Basic */}
        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">Simple list with text items.</p>
          <CodePreview code={BASIC_CODE}>
            <List variant="bordered" ariaLabel="Simple list" style={{ maxWidth: 400 }}>
              <ListItem>
                <ListItemLine>Dashboard</ListItemLine>
                <ListItemLine secondary>Overview of key metrics</ListItemLine>
              </ListItem>
              <ListItem>
                <ListItemLine>Settings</ListItemLine>
                <ListItemLine secondary>Manage your preferences</ListItemLine>
              </ListItem>
              <ListItem>
                <ListItemLine>Profile</ListItemLine>
                <ListItemLine secondary>Update your information</ListItemLine>
              </ListItem>
            </List>
          </CodePreview>
        </section>

        {/* Team Roster */}
        <section id="team-roster" className="demo-section" aria-labelledby="roster-heading">
          <h2 id="roster-heading">Team Roster</h2>
          <p className="section-desc">
            Avatars, roles, and status badges in a scrollable list.
          </p>
          <CodePreview code={ROSTER_CODE}>
            <div style={{ maxWidth: 400, maxHeight: 380, overflow: 'auto', border: '1px solid var(--sp-border)', borderRadius: 'var(--sp-radius-lg, 8px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid var(--sp-border)' }}>
                <span style={{ fontWeight: 600, fontSize: 'var(--sp-text-sm)' }}>Team Members</span>
                <Badge size="sm">{members.length} members</Badge>
              </div>
              <List ariaLabel="Team members">
                {members.map((member) => (
                  <ListItem
                    key={member.name}
                    leading={<Avatar name={member.name} size="sm" />}
                    trailing={
                      <Badge variant={member.online ? 'success' : 'default'} size="sm">
                        {member.online ? 'Online' : 'Offline'}
                      </Badge>
                    }
                  >
                    <ListItemLine>{member.name}</ListItemLine>
                    <ListItemLine secondary>{member.role}</ListItemLine>
                  </ListItem>
                ))}
              </List>
            </div>
          </CodePreview>
        </section>

        {/* Inbox List */}
        <section id="inbox" className="demo-section" aria-labelledby="inbox-heading">
          <h2 id="inbox-heading">Inbox List</h2>
          <p className="section-desc">
            Email-style list with unread indicators, subject lines, preview text,
            timestamps, and label badges.
          </p>
          <CodePreview code={INBOX_CODE}>
            <div style={{ maxWidth: 480, maxHeight: 420, overflow: 'auto', border: '1px solid var(--sp-border)', borderRadius: 'var(--sp-radius-lg, 8px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid var(--sp-border)' }}>
                <Icon name="inbox" size={18} />
                <span style={{ fontWeight: 600, fontSize: 'var(--sp-text-sm)' }}>Inbox</span>
                <span style={{ marginLeft: 'auto' }}><Badge size="sm" variant="primary">2</Badge></span>
              </div>
              <List ariaLabel="Inbox messages">
                {messages.map((msg) => (
                  <ListItem
                    key={msg.id}
                    unread={msg.unread}
                    active={selectedMsg === msg.id}
                    onClick={() => setSelectedMsg(msg.id)}
                    leading={<Avatar name={msg.from} size="sm" />}
                  >
                    <div>
                      <div style={inboxRowStyle}>
                        <ListItemLine ellipsis>{msg.from}</ListItemLine>
                        <span style={inboxTimeStyle}>{msg.time}</span>
                      </div>
                      <ListItemLine ellipsis>{msg.subject}</ListItemLine>
                      <ListItemLine secondary ellipsis>{msg.preview}</ListItemLine>
                      {msg.labels.length > 0 && (
                        <div style={inboxLabelsStyle}>
                          {msg.labels.map((label) => (
                            <Badge key={label} size="sm">{label}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </ListItem>
                ))}
              </List>
            </div>
          </CodePreview>
        </section>

        {/* Notifications */}
        <section id="notifications" className="demo-section" aria-labelledby="notif-heading">
          <h2 id="notif-heading">Notifications</h2>
          <p className="section-desc">
            Icon-led list with colored indicators and time stamps. Demonstrates
            leading icons and trailing timestamps.
          </p>
          <CodePreview code={NOTIF_CODE}>
            <div style={{ maxWidth: 420, maxHeight: 320, overflow: 'auto', border: '1px solid var(--sp-border)', borderRadius: 'var(--sp-radius-lg, 8px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid var(--sp-border)' }}>
                <span style={{ fontWeight: 600, fontSize: 'var(--sp-text-sm)' }}>Notifications</span>
                <span style={{ marginLeft: 'auto' }}><Badge size="sm" variant="info">4 new</Badge></span>
              </div>
              <List ariaLabel="Notifications">
                {notifications.map((n) => (
                  <ListItem
                    key={n.id}
                    leading={
                      <div style={{ ...notifIconStyle, ...getNotifIconColors(n.type) }}>
                        <Icon name={n.icon} size={16} />
                      </div>
                    }
                    trailing={<span style={notifTimeStyle}>{n.time}</span>}
                  >
                    <ListItemLine>{n.text}</ListItemLine>
                  </ListItem>
                ))}
              </List>
            </div>
          </CodePreview>
        </section>

        {/* Variants & Sizes */}
        <section id="variants" className="demo-section" aria-labelledby="variants-heading">
          <h2 id="variants-heading">Variants &amp; Sizes</h2>
          <p className="section-desc">
            The list supports <code>bordered</code> and <code>striped</code> variants,
            and <code>sm</code>, <code>md</code>, <code>lg</code> sizes.
          </p>
          <CodePreview code={VARIANTS_CODE}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              <div>
                <h4 style={variantLabelStyle}>Bordered</h4>
                <List variant="bordered" ariaLabel="Bordered list">
                  <ListItem><ListItemLine>Item A</ListItemLine></ListItem>
                  <ListItem><ListItemLine>Item B</ListItemLine></ListItem>
                  <ListItem><ListItemLine>Item C</ListItemLine></ListItem>
                </List>
              </div>
              <div>
                <h4 style={variantLabelStyle}>Striped</h4>
                <List variant="striped" ariaLabel="Striped list">
                  <ListItem><ListItemLine>Item A</ListItemLine></ListItem>
                  <ListItem><ListItemLine>Item B</ListItemLine></ListItem>
                  <ListItem><ListItemLine>Item C</ListItemLine></ListItem>
                </List>
              </div>
              <div>
                <h4 style={variantLabelStyle}>Small</h4>
                <List variant="bordered" size="sm" ariaLabel="Small list">
                  <ListItem><ListItemLine>Item A</ListItemLine></ListItem>
                  <ListItem><ListItemLine>Item B</ListItemLine></ListItem>
                </List>
              </div>
              <div>
                <h4 style={variantLabelStyle}>Large</h4>
                <List variant="bordered" size="lg" ariaLabel="Large list">
                  <ListItem><ListItemLine>Item A</ListItemLine></ListItem>
                  <ListItem><ListItemLine>Item B</ListItemLine></ListItem>
                </List>
              </div>
            </div>
          </CodePreview>
        </section>

        {/* Trailing Actions */}
        <section id="actions" className="demo-section" aria-labelledby="actions-heading">
          <h2 id="actions-heading">Trailing Actions</h2>
          <p className="section-desc">
            Place buttons, icons, or any content in the trailing slot.
          </p>
          <CodePreview code={ACTIONS_CODE}>
            <List variant="bordered" ariaLabel="Action list" style={{ maxWidth: 420 }}>
              <ListItem
                leading={<Icon name="file-text" size={18} />}
                trailing={<Button size="sm" variant="ghost"><Icon name="download" size={14} /></Button>}
              >
                <ListItemLine>quarterly-report.pdf</ListItemLine>
                <ListItemLine secondary>2.4 MB &middot; Shared by Alex</ListItemLine>
              </ListItem>
              <ListItem
                leading={<Icon name="image" size={18} />}
                trailing={<Button size="sm" variant="ghost"><Icon name="download" size={14} /></Button>}
              >
                <ListItemLine>mockup-v2.png</ListItemLine>
                <ListItemLine secondary>1.1 MB &middot; Shared by Dana</ListItemLine>
              </ListItem>
              <ListItem
                leading={<Icon name="file-spreadsheet" size={18} />}
                trailing={<Button size="sm" variant="ghost"><Icon name="download" size={14} /></Button>}
              >
                <ListItemLine>budget-2026.xlsx</ListItemLine>
                <ListItemLine secondary>540 KB &middot; Shared by Jordan</ListItemLine>
              </ListItem>
            </List>
          </CodePreview>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>List Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Controls spacing and font size of list items</td></tr>
                <tr><td><code>variant</code></td><td><code>'default' | 'bordered' | 'striped'</code></td><td><code>'default'</code></td><td>Visual style of the list container</td></tr>
                <tr><td><code>ariaLabel</code></td><td><code>string | undefined</code></td><td><code>undefined</code></td><td>Accessible label applied to the list element</td></tr>
              </tbody>
            </table>
          </div>

          <h3>ListItem Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>active</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Highlight the item as active (subtle background)</td></tr>
                <tr><td><code>selected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Highlight the item with a left accent border</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable interaction and dim the item</td></tr>
                <tr><td><code>interactive</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Enable hover effects and keyboard activation</td></tr>
                <tr><td><code>unread</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Apply unread styling (bold text, tinted background)</td></tr>
                <tr><td><code>leading</code></td><td><code>ReactNode</code></td><td>-</td><td>Left-side content such as avatars, icons, or checkboxes</td></tr>
                <tr><td><code>trailing</code></td><td><code>ReactNode</code></td><td>-</td><td>Right-side content such as badges, buttons, or timestamps</td></tr>
                <tr><td><code>onClick</code></td><td><code>() =&gt; void</code></td><td>-</td><td>Emitted on click or Enter/Space key when not disabled</td></tr>
              </tbody>
            </table>
          </div>

          <h3>ListItemLine Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>secondary</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Render in smaller, muted text for secondary information</td></tr>
                <tr><td><code>ellipsis</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Truncate overflowing text with an ellipsis</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Slots</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Slot</th><th>Prop</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td>Leading</td><td><code>leading</code></td><td>Left-side content such as avatars, icons, or checkboxes</td></tr>
                <tr><td>Body</td><td><code>children</code></td><td>Main content area, typically ListItemLine elements</td></tr>
                <tr><td>Trailing</td><td><code>trailing</code></td><td>Right-side content such as badges, buttons, or timestamps</td></tr>
              </tbody>
            </table>
          </div>

          <h3>CSS Custom Properties</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Property</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>--sp-list-divider</code></td><td><code>var(--sp-border)</code></td><td>Divider color between items</td></tr>
                <tr><td><code>--sp-list-hover</code></td><td><code>var(--sp-surface-50)</code></td><td>Background on hover for interactive items</td></tr>
                <tr><td><code>--sp-list-active-bg</code></td><td><code>var(--sp-primary-subtle)</code></td><td>Background for active items</td></tr>
                <tr><td><code>--sp-list-selected-bg</code></td><td><code>var(--sp-primary-subtle)</code></td><td>Background for selected items</td></tr>
                <tr><td><code>--sp-list-unread-bg</code></td><td><code>var(--sp-surface-50)</code></td><td>Background for unread items</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Table of Contents */}
      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                className={`toc-link${activeSection === section.id ? ' active' : ''}`}
                onClick={() => scrollTo(section.id)}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
