import { useMemo, useState } from 'react';
import { Button, NotificationCenter, type NotificationActionEvent, type NotificationItem, type NotificationToolbarEvent } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const SECTIONS = [
  { id: 'anatomy', label: 'Anatomy' },
  { id: 'variants', label: 'Panel and stack' },
  { id: 'tone', label: 'Tone and density' },
  { id: 'overflow', label: 'Overflow' },
  { id: 'toolbars', label: 'Toolbars' },
  { id: 'live', label: 'Live' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'api', label: 'API' },
];

const SAMPLE: readonly NotificationItem[] = [
  { id: 'info', severity: 'info', title: 'Index rebuilt', message: 'Search results reflect recent changes.', source: 'Search service' },
  { id: 'success', severity: 'success', title: 'Migration complete', message: 'All records transferred with no conflicts.', source: 'Data platform' },
  { id: 'warning', severity: 'warning', title: 'Quota at 92%', message: 'Archive or expand the primary volume.', source: 'Storage' },
  { id: 'progress', severity: 'progress', title: 'Reindexing', message: 'You can keep working while this runs.', progress: 62, dismissible: false },
];

export function NotificationCenterPage() {
  const [activeSection, setActiveSection] = useState('anatomy');
  const [live, setLive] = useState<NotificationItem[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [toolbarLog, setToolbarLog] = useState('none yet');
  const [position, setPosition] = useState<'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'>('bottom-end');
  const toolbar = useMemo(() => [
    { id: 'mark-read', icon: 'check-circle', label: 'Mark all as read' },
    { id: 'settings', icon: 'settings', label: 'Notification settings' },
  ], []);

  function handleAction(event: NotificationActionEvent) {
    setLive((items) => items.filter((item) => item.id !== event.notificationId));
  }

  function handleToolbar(event: NotificationToolbarEvent) {
    setToolbarLog(event.notificationId ? `${event.buttonId} on ${event.notificationId}` : event.buttonId);
  }

  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Notification Center</h1>
        <p className="docs-desc">A nonblocking grouped surface for persistent notifications, progress, actions, and live updates.</p>

        <section id="anatomy" className="demo-section" aria-labelledby="notification-anatomy-heading">
          <h2 id="notification-anatomy-heading">Anatomy</h2>
          <p className="section-desc">Each item can include severity, title, source, actions, progress, and dismiss/tool buttons.</p>
          <CodePreview code={'<NotificationCenter notifications={items} onDismiss={remove} onAction={run} onClearAll={removeAll} />'}>
            <NotificationCenter notifications={SAMPLE.slice(0, 2)} onDismiss={() => undefined} onClearAll={() => undefined} />
          </CodePreview>
        </section>

        <section id="variants" className="demo-section" aria-labelledby="notification-variants-heading">
          <h2 id="notification-variants-heading">Panel and stack</h2>
          <CodePreview code={'<NotificationCenter variant="panel" notifications={items} />\n<NotificationCenter variant="stack" notifications={items} />'}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <NotificationCenter position="inline" variant="panel" notifications={SAMPLE.slice(0, 2)} />
              <NotificationCenter position="inline" variant="stack" notifications={SAMPLE.slice(0, 2)} />
            </div>
          </CodePreview>
        </section>

        <section id="tone" className="demo-section" aria-labelledby="notification-tone-heading">
          <h2 id="notification-tone-heading">Tone and density</h2>
          <CodePreview code={'<NotificationCenter tone="tinted" density="sm" notifications={items} />'}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <NotificationCenter position="inline" tone="tinted" notifications={SAMPLE.slice(0, 2)} />
              <NotificationCenter position="inline" tone="contrast" density="sm" notifications={SAMPLE.slice(0, 2)} />
            </div>
          </CodePreview>
        </section>

        <section id="overflow" className="demo-section" aria-labelledby="notification-overflow-heading">
          <h2 id="notification-overflow-heading">Capping the list</h2>
          <CodePreview code={'<NotificationCenter notifications={items} maxVisible={2} />'}>
            <NotificationCenter position="inline" notifications={SAMPLE} maxVisible={2} />
          </CodePreview>
        </section>

        <section id="toolbars" className="demo-section" aria-labelledby="notification-toolbar-heading">
          <h2 id="notification-toolbar-heading">Toolbars</h2>
          <CodePreview code={'<NotificationCenter toolbar={toolbar} onToolbarAction={handleToolbar} notifications={items} />'}>
            <NotificationCenter position="inline" toolbar={toolbar} onToolbarAction={handleToolbar} notifications={SAMPLE.slice(0, 2)} />
            <p>Last toolbar event: <code>{toolbarLog}</code></p>
          </CodePreview>
        </section>

        <section id="live" className="demo-section" aria-labelledby="notification-live-heading">
          <h2 id="notification-live-heading">Pinned live surface</h2>
          <p className="section-desc">Viewport positions portal to the body; only the cards take pointer events.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(['top-start', 'top-end', 'bottom-start', 'bottom-end'] as const).map((next) => <Button key={next} size="sm" variant={position === next ? 'primary' : 'secondary'} onClick={() => setPosition(next)}>{next}</Button>)}
            <Button size="sm" onClick={() => setLive((items) => [...items, { ...SAMPLE[items.length % SAMPLE.length], id: `live-${items.length}` }])}>Add notification</Button>
            <Button size="sm" variant="ghost" onClick={() => setLive([])}>Clear</Button>
            <Button size="sm" variant="outline" onClick={() => setCollapsed((value) => !value)}>{collapsed ? 'Expand' : 'Collapse'}</Button>
          </div>
          <NotificationCenter notifications={live} position={position} collapsed={collapsed} onCollapsedChange={setCollapsed} onDismiss={(id) => setLive((items) => items.filter((item) => item.id !== id))} onClearAll={() => setLive([])} onAction={handleAction} />
        </section>

        <section id="accessibility" className="demo-section" aria-labelledby="notification-accessibility-heading">
          <h2 id="notification-accessibility-heading">Accessibility</h2>
          <ul><li>Labels the region and uses a polite live list, becoming assertive when a danger item is present.</li><li>All icon controls have localized accessible names, pressed/expanded state, and keyboard focus.</li><li>Progress values are exposed when determinate and omitted when indeterminate; animations respect reduced motion.</li></ul>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Props</h3>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>notifications</code></td><td><code>NotificationItem[]</code></td><td><code>[]</code></td><td>Items to render.</td></tr>
            <tr><td><code>variant</code></td><td><code>'panel' | 'stack'</code></td><td><code>'panel'</code></td><td>Shared surface or separate cards.</td></tr>
            <tr><td><code>tone</code> / <code>density</code></td><td><code>NotificationCenterTone</code> / <code>NotificationCenterDensity</code></td><td><code>'surface'</code> / <code>'md'</code></td><td>Surface contrast and compactness.</td></tr>
            <tr><td><code>position</code></td><td><code>NotificationCenterPosition</code></td><td><code>'bottom-end'</code></td><td>Logical viewport position or inline flow.</td></tr>
            <tr><td><code>collapsed</code> / <code>onCollapsedChange</code></td><td><code>boolean</code> / <code>(value) =&gt; void</code></td><td><code>false</code></td><td>Controlled collapse state.</td></tr>
            <tr><td><code>maxVisible</code> / <code>closeOnEscape</code></td><td><code>number</code> / <code>boolean</code></td><td><code>0</code> / <code>false</code></td><td>Cap visible items and optionally clear on Escape.</td></tr>
            <tr><td><code>onDismiss</code> / <code>onClearAll</code> / <code>onAction</code> / <code>onToolbarAction</code></td><td>callbacks</td><td>—</td><td>Controlled notification lifecycle events.</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{SECTIONS.map((section) => <li key={section.id}><a className={`toc-link${activeSection === section.id ? ' active' : ''}`} onClick={() => setActiveSection(section.id)}>{section.label}</a></li>)}</ul></nav>
    </div>
  );
}
