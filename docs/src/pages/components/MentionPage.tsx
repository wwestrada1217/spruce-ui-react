import { useState, useEffect, useRef } from 'react'
import { Mention } from 'spruce-react'
import type { MentionItem, MentionInsertEvent } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<Mention
  items={users}
  value={basicValue}
  onValueChange={setBasicValue}
  placeholder="Type @ to mention a teammate..."
/>`

const AVATARS_CODE = `<Mention
  items={usersWithDesc}
  value={avatarValue}
  onValueChange={setAvatarValue}
  placeholder="Write a comment..."
  rows={4}
/>`

const TRIGGER_CODE = `<Mention
  items={channels}
  trigger="#"
  value={channelValue}
  onValueChange={setChannelValue}
  placeholder="Type # to tag a channel..."
/>`

const SIZES_CODE = `<Mention items={users} size="sm" placeholder="Small mention input..." />
<Mention items={users} size="md" placeholder="Medium mention input..." />
<Mention items={users} size="lg" placeholder="Large mention input..." />`

const EVENTS_CODE = `<Mention
  items={users}
  value={eventValue}
  onValueChange={setEventValue}
  onInsert={onMentioned}
  onSearch={onSearch}
  placeholder="Type @ and watch the events..."
/>`

const EDITOR_CODE = `const [content, setContent] = useState('')

<Editor
  value={content}
  onChange={setContent}
  mentionItems={users}
  mentionTrigger="@"
  onMention={onMentioned}
  onMentionSearch={onSearch}
/>`

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',   label: 'Basic' },
  { id: 'avatars', label: 'With Descriptions' },
  { id: 'trigger', label: 'Custom Trigger' },
  { id: 'sizes',   label: 'Sizes' },
  { id: 'events',  label: 'Events' },
  { id: 'editor',  label: 'Rich-text Editor' },
  { id: 'api',     label: 'API' },
]

const users: MentionItem[] = [
  { id: '1', label: 'Alice Chen' },
  { id: '2', label: 'Bob Kim' },
  { id: '3', label: 'Carol Li' },
  { id: '4', label: 'Dan Wu' },
  { id: '5', label: 'Eva Patel' },
  { id: '6', label: 'Frank Zhou' },
  { id: '7', label: 'Grace Ng' },
  { id: '8', label: 'Henry Tan' },
]

const usersWithDesc: MentionItem[] = [
  { id: '1', label: 'Alice Chen', description: 'Engineering Lead' },
  { id: '2', label: 'Bob Kim', description: 'Product Manager' },
  { id: '3', label: 'Carol Li', description: 'Senior Developer' },
  { id: '4', label: 'Dan Wu', description: 'UX Designer' },
  { id: '5', label: 'Eva Patel', description: 'QA Engineer' },
  { id: '6', label: 'Frank Zhou', description: 'DevOps Lead' },
]

const channels: MentionItem[] = [
  { id: 'c1', label: 'general', description: 'Company-wide announcements' },
  { id: 'c2', label: 'engineering', description: 'Engineering discussions' },
  { id: 'c3', label: 'design', description: 'Design reviews and feedback' },
  { id: 'c4', label: 'product', description: 'Product roadmap and planning' },
  { id: 'c5', label: 'support', description: 'Customer support issues' },
  { id: 'c6', label: 'random', description: 'Off-topic chatter' },
]

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--sp-text-xs, 11px)',
  fontWeight: 600,
  color: 'var(--sp-text-muted, #4a5568)',
  marginBottom: 4,
}

export function MentionPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const mainRef = useRef<HTMLDivElement>(null)

  const [basicValue, setBasicValue] = useState('')
  const [avatarValue, setAvatarValue] = useState('')
  const [channelValue, setChannelValue] = useState('')
  const [eventValue, setEventValue] = useState('')
  const [lastEvent, setLastEvent] = useState('')
  const [lastSearch, setLastSearch] = useState('')

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

  function onMentioned(event: MentionInsertEvent) {
    setLastEvent(`${event.item.label} (id: ${event.item.id})`)
  }

  function onSearch(query: string) {
    setLastSearch(query)
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Mention</h1>
        <p className="docs-desc">
          A textarea with inline mention support. Type a trigger character to open a suggestion
          panel, filter by name, and insert mentions with keyboard or mouse.
        </p>

        {/* Basic */}
        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">
            Type <code>@</code> to trigger the mention dropdown and select a user.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
              <Mention
                items={users}
                value={basicValue}
                onValueChange={setBasicValue}
                placeholder="Type @ to mention a teammate..."
              />
              {basicValue && (
                <div className="demo-output">
                  <strong>Value:</strong> {basicValue}
                </div>
              )}
            </div>
          </CodePreview>
        </section>

        {/* With Descriptions */}
        <section id="avatars" className="demo-section" aria-labelledby="avatars-heading">
          <h2 id="avatars-heading">With Descriptions</h2>
          <p className="section-desc">
            Mention items can include descriptions for additional context.
          </p>
          <CodePreview code={AVATARS_CODE}>
            <div style={{ maxWidth: 480 }}>
              <Mention
                items={usersWithDesc}
                value={avatarValue}
                onValueChange={setAvatarValue}
                placeholder="Write a comment..."
                rows={4}
              />
            </div>
          </CodePreview>
        </section>

        {/* Custom Trigger */}
        <section id="trigger" className="demo-section" aria-labelledby="trigger-heading">
          <h2 id="trigger-heading">Custom Trigger</h2>
          <p className="section-desc">
            Change the trigger character to <code>#</code> for tagging channels, issues, or topics.
          </p>
          <CodePreview code={TRIGGER_CODE}>
            <div style={{ maxWidth: 480 }}>
              <Mention
                items={channels}
                trigger="#"
                value={channelValue}
                onValueChange={setChannelValue}
                placeholder="Type # to tag a channel..."
              />
            </div>
          </CodePreview>
        </section>

        {/* Sizes */}
        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Three sizes for different contexts.</p>
          <CodePreview code={SIZES_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
              <div>
                <label style={labelStyle}>Small</label>
                <Mention items={users} size="sm" placeholder="Small mention input..." />
              </div>
              <div>
                <label style={labelStyle}>Medium (default)</label>
                <Mention items={users} size="md" placeholder="Medium mention input..." />
              </div>
              <div>
                <label style={labelStyle}>Large</label>
                <Mention items={users} size="lg" placeholder="Large mention input..." />
              </div>
            </div>
          </CodePreview>
        </section>

        {/* Events */}
        <section id="events" className="demo-section" aria-labelledby="events-heading">
          <h2 id="events-heading">Events</h2>
          <p className="section-desc">
            Listen to <code>onInsert</code> to react when a mention is inserted, and{' '}
            <code>onSearch</code> to dynamically filter or fetch suggestions.
          </p>
          <CodePreview code={EVENTS_CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
              <Mention
                items={users}
                value={eventValue}
                onValueChange={setEventValue}
                onInsert={onMentioned}
                onSearch={onSearch}
                placeholder="Type @ and watch the events..."
              />
              {lastEvent && (
                <div className="demo-output">
                  <strong>Last mention:</strong> {lastEvent}
                </div>
              )}
              {lastSearch && (
                <div className="demo-output">
                  <strong>Last search query:</strong> "{lastSearch}"
                </div>
              )}
            </div>
          </CodePreview>
        </section>

        <section id="editor" className="demo-section" aria-labelledby="editor-heading">
          <h2 id="editor-heading">Rich-text Editor</h2>
          <p className="section-desc">
            Angular also exposes a directive for inputs, textareas, and contenteditable elements. In React, use the controlled <code>Editor</code> mention props for rich text; the directive mechanism itself is intentionally not copied into the component API.
          </p>
          <CodePreview code={EDITOR_CODE} codeOnly />
          <p className="section-desc">The <code>Editor</code> mapping preserves item filtering, keyboard selection, custom insertion templates, and <code>onMention</code>/<code>onMentionSearch</code> callbacks.</p>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>value</code></td><td><code>string</code></td><td><code>''</code></td><td>Controlled text value</td></tr>
                <tr><td><code>items</code></td><td><code>MentionItem[]</code></td><td><code>[]</code></td><td>List of mentionable items</td></tr>
                <tr><td><code>trigger</code></td><td><code>'@' | '#' | '+' | '/'</code></td><td><code>'@'</code></td><td>Character that activates the suggestion panel</td></tr>
                <tr><td><code>placeholder</code></td><td><code>string</code></td><td>localized <code>typeMentionPrompt</code></td><td>Textarea placeholder text</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the input</td></tr>
                <tr><td><code>rows</code></td><td><code>number</code></td><td><code>3</code></td><td>Number of visible text rows</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Input size variant</td></tr>
                <tr><td><code>insertTemplate</code></td><td><code>(item) =&gt; string</code></td><td>item label with trigger</td><td>Function to format the inserted text</td></tr>
                <tr><td><code>onValueChange</code></td><td><code>(value: string) =&gt; void</code></td><td>-</td><td>Called when the text value changes</td></tr>
                <tr><td><code>onInsert</code></td><td><code>(event: MentionInsertEvent) =&gt; void</code></td><td>-</td><td>Emitted when a mention is inserted</td></tr>
                <tr><td><code>onSearch</code></td><td><code>(query: string) =&gt; void</code></td><td>-</td><td>Emitted with the current query string for async filtering</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Keyboard Shortcuts</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Key</th><th>Action</th></tr></thead>
              <tbody>
                <tr><td><code>ArrowDown</code></td><td>Move to next suggestion</td></tr>
                <tr><td><code>ArrowUp</code></td><td>Move to previous suggestion</td></tr>
                <tr><td><code>Enter / Tab</code></td><td>Insert selected suggestion</td></tr>
                <tr><td><code>Escape</code></td><td>Close suggestion panel</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Interfaces</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Interface</th><th>Properties</th></tr></thead>
              <tbody>
                <tr><td><code>MentionItem</code></td><td><code>id, label, avatar?, icon?, description?</code></td></tr>
                <tr><td><code>MentionInsertEvent</code></td><td><code>item, start, end</code></td></tr>
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
