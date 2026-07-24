import { useState, useEffect, useRef, useCallback } from 'react'
import { Terminal, useTerminal } from 'spruce-react'
import type { TerminalEntry, TerminalLogLevel } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

/* ── Code snippets ─────────────────────────────────────────────────────── */

const BASIC_CODE = `const [entries, setEntries] = useState<TerminalEntry[]>([...])

<Terminal
  title="app -- console"
  entries={entries}
  onClear={() => setEntries([])}
  maxHeight="260px"
/>`

const LEVELS_CODE = `<Terminal
  title="log levels"
  entries={levelEntries}
  clearable={false}
  showTimestamp={false}
  maxHeight="220px"
/>`

const TIMESTAMPS_CODE = `{/* showTimestamp = true (default) */}
<Terminal
  entries={tsEntries}
  clearable={false}
  showTimestamp={true}
  maxHeight="160px"
/>

{/* showTimestamp = false */}
<Terminal
  entries={tsEntries}
  clearable={false}
  showTimestamp={false}
  maxHeight="160px"
/>`

const BADGES_CODE = `<Terminal
  title="server -- console"
  entries={badgeEntries}
  clearable={false}
  maxHeight="200px"
/>`

const HOOK_CODE = `const { entries, log, info, warn, error, success, debug, clear } = useTerminal()

<Terminal
  title="useTerminal demo"
  entries={entries}
  onClear={clear}
  maxHeight="200px"
/>`

const BORDERLESS_CODE = `<Terminal
  entries={tsEntries}
  clearable={false}
  bordered={false}
  maxHeight="160px"
/>`

/* ── Static data ───────────────────────────────────────────────────────── */

const levelEntries: TerminalEntry[] = [
  { id: 1, level: 'log',     message: 'Application started successfully.',           timestamp: new Date() },
  { id: 2, level: 'info',    message: 'Connecting to database...',                   timestamp: new Date() },
  { id: 3, level: 'warn',    message: 'Deprecated API used: /api/v1/users',          timestamp: new Date() },
  { id: 4, level: 'error',   message: 'Failed to connect: ECONNREFUSED 5432',        timestamp: new Date() },
  { id: 5, level: 'success', message: 'Build completed in 3.42s',                    timestamp: new Date() },
  { id: 6, level: 'debug',   message: 'State snapshot: { user: null, token: null }', timestamp: new Date() },
]

const tsEntries: TerminalEntry[] = [
  { id: 7,  level: 'info',    message: 'Server listening on port 3000',   timestamp: new Date() },
  { id: 8,  level: 'success', message: 'Connected to Redis',             timestamp: new Date() },
  { id: 9,  level: 'warn',    message: 'High memory usage detected: 87%', timestamp: new Date() },
]

const badgeEntries: TerminalEntry[] = [
  { id: 10, level: 'info',    message: 'GET /api/users 200 OK (42ms)',            timestamp: new Date(), badge: 'HTTP' },
  { id: 11, level: 'success', message: 'Migrated 3 pending schemas',              timestamp: new Date(), badge: 'DB' },
  { id: 12, level: 'warn',    message: 'Queue depth reached 500 messages',        timestamp: new Date(), badge: 'Queue' },
  { id: 13, level: 'error',   message: 'POST /api/upload 413 Payload Too Large',  timestamp: new Date(), badge: 'HTTP' },
  { id: 14, level: 'debug',   message: 'Cache miss for key: user:profile:42',     timestamp: new Date(), badge: 'Cache' },
]

/* ── Sections ──────────────────────────────────────────────────────────── */

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',      label: 'Basic' },
  { id: 'levels',     label: 'Log Levels' },
  { id: 'timestamps', label: 'Timestamps' },
  { id: 'badges',     label: 'Source Badges' },
  { id: 'hook',       label: 'useTerminal' },
  { id: 'borderless', label: 'Borderless' },
  { id: 'api',        label: 'API' },
]

/* ── Control button styles ─────────────────────────────────────────────── */

const ctrlBase: React.CSSProperties = {
  padding: '5px 12px',
  borderRadius: 'var(--sp-radius-md, 6px)',
  border: '1px solid var(--sp-border, rgba(0,0,0,0.1))',
  background: 'var(--sp-surface-50, #f7fafc)',
  color: 'var(--sp-text-color, #1a202c)',
  fontSize: 'var(--sp-text-sm, 13px)',
  cursor: 'pointer',
}
const ctrlColors: Record<string, React.CSSProperties> = {
  info:    { color: '#2563eb', borderColor: 'rgba(37,99,235,0.3)' },
  warn:    { color: '#d97706', borderColor: 'rgba(217,119,6,0.3)' },
  error:   { color: '#dc2626', borderColor: 'rgba(220,38,38,0.3)' },
  success: { color: '#16a34a', borderColor: 'rgba(22,163,74,0.3)' },
  debug:   { color: '#7c3aed', borderColor: 'rgba(124,58,237,0.3)' },
}

/* ── Component ─────────────────────────────────────────────────────────── */

export function TerminalPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const mainRef = useRef<HTMLDivElement>(null)

  /* ── Live demo (basic section) ──────────────────────────────────────── */

  const nextIdRef = useRef(100)
  const [basicEntries, setBasicEntries] = useState<TerminalEntry[]>([
    { id: 20, level: 'info',    message: 'Initialising application...',           timestamp: new Date() },
    { id: 21, level: 'success', message: 'All modules loaded.',                   timestamp: new Date() },
    { id: 22, level: 'warn',    message: 'config.json not found, using defaults.', timestamp: new Date() },
    { id: 23, level: 'error',   message: 'Unable to reach telemetry endpoint.',   timestamp: new Date() },
  ])

  const pushBasic = useCallback((level: TerminalLogLevel, message: string) => {
    const entry: TerminalEntry = { id: nextIdRef.current++, level, message, timestamp: new Date() }
    setBasicEntries((prev) => [...prev, entry])
  }, [])

  /* ── useTerminal demo ───────────────────────────────────────────────── */

  const terminal = useTerminal()

  /* ── TOC observer ───────────────────────────────────────────────────── */

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
        <h1>Terminal</h1>
        <p className="docs-desc">
          A console-style output panel for displaying structured log entries with distinct colors
          for each log level -- ideal for dashboards, dev tools, build outputs, and live monitoring.
        </p>

        {/* Basic */}
        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">A terminal pre-loaded with entries covering all log levels.</p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingBottom: 12 }}>
              <button style={ctrlBase} onClick={() => pushBasic('log', 'This is a plain log message.')}>Add log</button>
              <button style={{ ...ctrlBase, ...ctrlColors.info }} onClick={() => pushBasic('info', 'Fetching data from API endpoint...')}>Add info</button>
              <button style={{ ...ctrlBase, ...ctrlColors.warn }} onClick={() => pushBasic('warn', 'Response time exceeded 500ms threshold.')}>Add warn</button>
              <button style={{ ...ctrlBase, ...ctrlColors.error }} onClick={() => pushBasic('error', 'Unhandled exception: NullReferenceError at line 42.')}>Add error</button>
              <button style={{ ...ctrlBase, ...ctrlColors.success }} onClick={() => pushBasic('success', 'Deployment to production completed successfully.')}>Add success</button>
              <button style={{ ...ctrlBase, ...ctrlColors.debug }} onClick={() => pushBasic('debug', 'requestId=8f4a2 payload={"user":42,"action":"login"}')}>Add debug</button>
            </div>
            <Terminal
              title="app -- console"
              entries={basicEntries}
              onClear={() => setBasicEntries([])}
              maxHeight="260px"
            />
          </CodePreview>
        </section>

        {/* Log Levels */}
        <section id="levels" className="demo-section" aria-labelledby="levels-heading">
          <h2 id="levels-heading">Log Levels</h2>
          <p className="section-desc">
            Six distinct levels -- each with its own color and prefix icon to distinguish at a glance.
          </p>
          <CodePreview code={LEVELS_CODE}>
            <Terminal
              title="log levels"
              entries={levelEntries}
              clearable={false}
              showTimestamp={false}
              maxHeight="220px"
            />
          </CodePreview>
        </section>

        {/* Timestamps */}
        <section id="timestamps" className="demo-section" aria-labelledby="timestamps-heading">
          <h2 id="timestamps-heading">Timestamps</h2>
          <p className="section-desc">
            Toggle the <code>showTimestamp</code> prop to show or hide the{' '}
            <code>HH:mm:ss.SSS</code> prefix on every line.
          </p>
          <CodePreview code={TIMESTAMPS_CODE}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <p style={{ fontSize: 'var(--sp-text-sm, 13px)', color: 'var(--sp-text-subtle, #718096)', margin: '0 0 8px' }}>
                  showTimestamp = true (default)
                </p>
                <Terminal
                  entries={tsEntries}
                  clearable={false}
                  showTimestamp={true}
                  maxHeight="160px"
                />
              </div>
              <div>
                <p style={{ fontSize: 'var(--sp-text-sm, 13px)', color: 'var(--sp-text-subtle, #718096)', margin: '0 0 8px' }}>
                  showTimestamp = false
                </p>
                <Terminal
                  entries={tsEntries}
                  clearable={false}
                  showTimestamp={false}
                  maxHeight="160px"
                />
              </div>
            </div>
          </CodePreview>
        </section>

        {/* Badges */}
        <section id="badges" className="demo-section" aria-labelledby="badges-heading">
          <h2 id="badges-heading">Source Badges</h2>
          <p className="section-desc">
            Attach an optional <code>badge</code> string to any entry (e.g. the source module name)
            to quickly identify where a log originates.
          </p>
          <CodePreview code={BADGES_CODE}>
            <Terminal
              title="server -- console"
              entries={badgeEntries}
              clearable={false}
              maxHeight="200px"
            />
          </CodePreview>
        </section>

        {/* useTerminal */}
        <section id="hook" className="demo-section" aria-labelledby="hook-heading">
          <h2 id="hook-heading">useTerminal</h2>
          <p className="section-desc">
            Instead of managing an entries array manually, use the <code>useTerminal()</code> hook and
            call <code>log()</code>, <code>info()</code>, <code>warn()</code>, <code>error()</code>,{' '}
            <code>success()</code>, or <code>debug()</code>. Pass the returned <code>entries</code> to
            the Terminal component.
          </p>
          <CodePreview code={HOOK_CODE}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingBottom: 12 }}>
              <button style={ctrlBase} onClick={() => terminal.log('Plain log via useTerminal.')}>log</button>
              <button style={{ ...ctrlBase, ...ctrlColors.info }} onClick={() => terminal.info('Hook info message.')}>info</button>
              <button style={{ ...ctrlBase, ...ctrlColors.warn }} onClick={() => terminal.warn('Hook warning: disk space low.')}>warn</button>
              <button style={{ ...ctrlBase, ...ctrlColors.error }} onClick={() => terminal.error('Hook error: connection refused.')}>error</button>
              <button style={{ ...ctrlBase, ...ctrlColors.success }} onClick={() => terminal.success('Hook task completed successfully.')}>success</button>
              <button style={{ ...ctrlBase, ...ctrlColors.debug }} onClick={() => terminal.debug('Hook debug: token=abc123 user=42')}>debug</button>
            </div>
            <Terminal
              title="useTerminal demo"
              entries={terminal.entries}
              onClear={terminal.clear}
              maxHeight="200px"
            />
          </CodePreview>
        </section>

        {/* Borderless */}
        <section id="borderless" className="demo-section" aria-labelledby="borderless-heading">
          <h2 id="borderless-heading">Borderless</h2>
          <p className="section-desc">
            Set <code>bordered=&#123;false&#125;</code> to remove the border and box-shadow -- useful when
            embedding inside a card or a panel that already provides its own surface.
          </p>
          <CodePreview code={BORDERLESS_CODE}>
            <div style={{ background: 'var(--sp-surface-50, #f7fafc)', borderRadius: 8, overflow: 'hidden' }}>
              <Terminal
                entries={tsEntries}
                clearable={false}
                bordered={false}
                maxHeight="160px"
              />
            </div>
          </CodePreview>
        </section>

        {/* API */}
        <section id="api" className="demo-section" aria-labelledby="api-heading">
          <h2 id="api-heading">API</h2>

          <h3>Terminal Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>entries</code></td><td><code>TerminalEntry[]</code></td><td><code>[]</code></td><td>Entries to display.</td></tr>
                <tr><td><code>title</code></td><td><code>string</code></td><td><code>'terminal'</code></td><td>Text shown in the titlebar.</td></tr>
                <tr><td><code>showTimestamp</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show <code>HH:mm:ss.SSS</code> timestamp prefix.</td></tr>
                <tr><td><code>showLevelBadge</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show badge labels on entries.</td></tr>
                <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show the clear button in the titlebar.</td></tr>
                <tr><td><code>bordered</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Render border and box-shadow.</td></tr>
                <tr><td><code>maxEntries</code></td><td><code>number</code></td><td><code>500</code></td><td>Oldest entries are discarded when the limit is reached. <code>0</code> = unlimited.</td></tr>
                <tr><td><code>maxHeight</code></td><td><code>string</code></td><td>-</td><td>Max height CSS value (e.g. '260px').</td></tr>
                <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>'Terminal output'</code></td><td>Accessible label for the log region.</td></tr>
                <tr><td><code>onClear</code></td><td><code>() =&gt; void</code></td><td>-</td><td>Emitted when the user clicks the clear button.</td></tr>
              </tbody>
            </table>
          </div>

          <h3>TerminalEntry</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>id</code></td><td><code>number</code></td><td>Unique entry identifier (used as React key).</td></tr>
                <tr><td><code>level</code></td><td><code>TerminalLogLevel</code></td><td>Determines color and prefix icon.</td></tr>
                <tr><td><code>message</code></td><td><code>string</code></td><td>The log message to display.</td></tr>
                <tr><td><code>timestamp</code></td><td><code>Date</code></td><td>Time the entry was created.</td></tr>
                <tr><td><code>badge</code></td><td><code>string | undefined</code></td><td>Optional source/module label shown before the message.</td></tr>
              </tbody>
            </table>
          </div>

          <h3>TerminalLogLevel</h3>
          <p className="section-desc"><code>'log' | 'info' | 'warn' | 'error' | 'success' | 'debug'</code></p>

          <h3>useTerminal()</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Return</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>entries</code></td><td><code>TerminalEntry[]</code></td><td>Current entries array (pass to Terminal).</td></tr>
                <tr><td><code>log()</code></td><td><code>(message: string, badge?: string) =&gt; void</code></td><td>Add a plain log entry.</td></tr>
                <tr><td><code>info()</code></td><td><code>(message: string, badge?: string) =&gt; void</code></td><td>Add an info entry.</td></tr>
                <tr><td><code>warn()</code></td><td><code>(message: string, badge?: string) =&gt; void</code></td><td>Add a warning entry.</td></tr>
                <tr><td><code>error()</code></td><td><code>(message: string, badge?: string) =&gt; void</code></td><td>Add an error entry.</td></tr>
                <tr><td><code>success()</code></td><td><code>(message: string, badge?: string) =&gt; void</code></td><td>Add a success entry.</td></tr>
                <tr><td><code>debug()</code></td><td><code>(message: string, badge?: string) =&gt; void</code></td><td>Add a debug entry.</td></tr>
                <tr><td><code>clear()</code></td><td><code>() =&gt; void</code></td><td>Remove all entries.</td></tr>
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
