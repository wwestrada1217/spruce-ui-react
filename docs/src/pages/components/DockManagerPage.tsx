import { useRef, useState, type ReactNode, type RefObject } from 'react'
import {
  Button,
  DockManager,
  DockPanel,
  DockPanelTools,
  type DockLayout,
  type DockManagerHandle,
} from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

const BASIC_CODE = `<DockManager style={{ height: 360 }}>
  <DockPanel panelId="explorer" title="Explorer" icon="folder">
    <FileTree />
  </DockPanel>
  <DockPanel panelId="editor" title="app.ts" icon="file-code">
    <EditorPreview />
  </DockPanel>
  <DockPanel panelId="terminal" title="Terminal" icon="terminal">
    <TerminalPreview />
  </DockPanel>
</DockManager>`

const LAYOUT_CODE = `const layout: DockLayout = {
  root: {
    type: 'split',
    id: 'root',
    direction: 'h',
    sizes: [22, 78],
    children: [
      { type: 'leaf', id: 'files', panelId: 'files' },
      {
        type: 'split',
        id: 'work',
        direction: 'v',
        sizes: [68, 32],
        children: [
          { type: 'tab', id: 'editor-tabs', panelIds: ['main-ts', 'styles'], activeIndex: 0 },
          { type: 'leaf', id: 'console', panelId: 'console' },
        ],
      },
    ],
  },
  floats: [],
}`

const TABS_CODE = `const layout: DockLayout = {
  root: {
    type: 'split',
    id: 'root',
    direction: 'h',
    sizes: [30, 70],
    children: [
      { type: 'leaf', id: 'explorer', panelId: 'explorer' },
      { type: 'tab', id: 'tabs', panelIds: ['editor', 'preview'], activeIndex: 0 },
    ],
  },
  floats: [],
}`

const BOTTOM_TABS_CODE = `<DockManager layout={layout} tabsAtBottom>
  <DockPanel panelId="editor" title="editor.ts">...</DockPanel>
  <DockPanel panelId="preview" title="Preview">...</DockPanel>
</DockManager>`

const DOCUMENT_CODE = `const layout: DockLayout = {
  root: {
    type: 'split',
    id: 'root',
    direction: 'h',
    sizes: [20, 60, 20],
    children: [
      { type: 'leaf', id: 'left', panelId: 'explorer' },
      {
        type: 'split',
        id: 'center',
        direction: 'v',
        sizes: [70, 30],
        children: [
          { type: 'document', id: 'documents', panelIds: ['main', 'preview'], activeIndex: 0 },
          { type: 'leaf', id: 'terminal', panelId: 'terminal' },
        ],
      },
      { type: 'leaf', id: 'right', panelId: 'properties' },
    ],
  },
  floats: [],
}`

const FIXED_CODE = `const layout: DockLayout = {
  root: {
    type: 'split',
    id: 'root',
    direction: 'h',
    sizes: [72, 28],
    children: [
      { type: 'document', id: 'canvas', panelIds: ['canvas'], activeIndex: 0 },
      { type: 'leaf', id: 'properties', panelId: 'properties' },
    ],
  },
  floats: [],
}

<DockPanel panelId="canvas" title="Design" allowedDockZones={[]} showHeader={false}>
  <Canvas />
</DockPanel>`

const TOOLS_CODE = `<DockPanel panelId="editor" title="editor.ts" icon="file-code">
  <DockPanelTools>
    <Button size="sm" variant="ghost" iconLeft="save">Save</Button>
    <Button size="sm" variant="ghost" iconLeft="play">Run</Button>
  </DockPanelTools>
  <EditorPreview />
</DockPanel>`

const PERSISTENCE_CODE = `const manager = useRef<DockManagerHandle>(null)

const json = manager.current?.exportLayout()
manager.current?.importLayout(json ?? '')
manager.current?.resetLayout()

<DockManager storageKey="my-app-layout" ref={manager}>
  ...
</DockManager>`

const AUTO_HIDE_CODE = `const layout: DockLayout = {
  root: {
    type: 'split',
    id: 'root',
    direction: 'v',
    sizes: [70, 30],
    children: [
      { type: 'leaf', id: 'editor', panelId: 'editor' },
      { type: 'leaf', id: 'terminal', panelId: 'terminal' },
    ],
  },
  floats: [],
  autoHide: [
    { panelId: 'explorer', side: 'left' },
    { panelId: 'properties', side: 'right' },
    { panelId: 'output', side: 'bottom' },
  ],
}`

const BASIC_LAYOUT: DockLayout = {
  root: {
    type: 'split',
    id: 'basic-root',
    direction: 'h',
    sizes: [22, 58, 20],
    children: [
      { type: 'leaf', id: 'basic-explorer', panelId: 'explorer' },
      { type: 'leaf', id: 'basic-editor', panelId: 'editor' },
      { type: 'leaf', id: 'basic-terminal', panelId: 'terminal' },
    ],
  },
  floats: [],
}

const EDITOR_LAYOUT: DockLayout = {
  root: {
    type: 'split',
    id: 'editor-root',
    direction: 'h',
    sizes: [22, 78],
    children: [
      { type: 'leaf', id: 'files', panelId: 'files' },
      {
        type: 'split',
        id: 'work',
        direction: 'v',
        sizes: [68, 32],
        children: [
          { type: 'tab', id: 'editor-tabs', panelIds: ['main-ts', 'styles'], activeIndex: 0 },
          { type: 'leaf', id: 'console', panelId: 'console' },
        ],
      },
    ],
  },
  floats: [],
}

const TABS_LAYOUT: DockLayout = {
  root: {
    type: 'split',
    id: 'tabs-root',
    direction: 'h',
    sizes: [30, 70],
    children: [
      { type: 'leaf', id: 'tab-explorer', panelId: 'explorer' },
      { type: 'tab', id: 'tabs', panelIds: ['tab-editor', 'tab-preview'], activeIndex: 0 },
    ],
  },
  floats: [],
}

const DOCUMENT_LAYOUT: DockLayout = {
  root: {
    type: 'split',
    id: 'document-root',
    direction: 'h',
    sizes: [20, 60, 20],
    children: [
      { type: 'leaf', id: 'document-explorer', panelId: 'explorer' },
      {
        type: 'split',
        id: 'document-center',
        direction: 'v',
        sizes: [70, 30],
        children: [
          { type: 'document', id: 'documents', panelIds: ['main', 'preview'], activeIndex: 0 },
          { type: 'leaf', id: 'document-terminal', panelId: 'terminal' },
        ],
      },
      { type: 'leaf', id: 'document-properties', panelId: 'properties' },
    ],
  },
  floats: [],
}

const FIXED_LAYOUT: DockLayout = {
  root: {
    type: 'split',
    id: 'fixed-root',
    direction: 'h',
    sizes: [72, 28],
    children: [
      { type: 'document', id: 'canvas-well', panelIds: ['canvas'], activeIndex: 0 },
      { type: 'leaf', id: 'fixed-properties', panelId: 'properties' },
    ],
  },
  floats: [],
}

const AUTO_HIDE_LAYOUT: DockLayout = {
  root: {
    type: 'split',
    id: 'auto-hide-root',
    direction: 'v',
    sizes: [70, 30],
    children: [
      { type: 'leaf', id: 'auto-editor', panelId: 'editor' },
      { type: 'leaf', id: 'auto-terminal', panelId: 'terminal' },
    ],
  },
  floats: [],
  autoHide: [
    { panelId: 'explorer', side: 'left' },
    { panelId: 'properties', side: 'right' },
    { panelId: 'output', side: 'bottom' },
  ],
}

const DOC_SECTIONS = [
  ['basic', 'Basic Usage'],
  ['layout', 'Custom Layout'],
  ['tabs', 'Tabbed Panels'],
  ['bottom-tabs', 'Bottom Tabs'],
  ['document-panels', 'Document Panels'],
  ['fixed-document', 'Fixed Document'],
  ['panel-tools', 'Panel Tools and Badges'],
  ['persist', 'Layout Persistence'],
  ['export-import', 'Export and Import'],
  ['dnd', 'Drag and Drop Docking'],
  ['auto-hide', 'Auto-hide and Edge Strips'],
  ['api', 'API'],
] as const

const dockStyle = { height: 360, minHeight: 280 }
const panelTextStyle = { margin: 0, lineHeight: 1.6 }
const codeStyle = { margin: 0, fontFamily: 'var(--sp-font-family-mono)', fontSize: 12, lineHeight: 1.7 }

function ExplorerContent({ label = 'src' }: { label?: string }) {
  return <div style={{ display: 'grid', gap: 4, fontSize: 13 }}>
    <div>▾ 📁 {label}</div>
    <div style={{ paddingInlineStart: 18 }}>📄 app.ts</div>
    <div style={{ paddingInlineStart: 18 }}>📄 main.ts</div>
    <div style={{ paddingInlineStart: 18 }}>🎨 styles.scss</div>
    <div>▸ 📁 assets</div>
    <div>▸ 📁 environments</div>
  </div>
}

function EditorContent({ lines = ["import { DockManager, DockPanel } from 'spruce-react';", '', 'export function Workspace() {', '  return (', '    <DockManager>', '      <DockPanel panelId="editor" title="app.ts" />', '    </DockManager>', '  );', '}'] }: { lines?: string[] }) {
  return <pre style={codeStyle}>{lines.map((line, index) => <span key={index} style={{ display: 'block' }}><span style={{ display: 'inline-block', width: 24, color: 'var(--sp-text-muted)' }}>{index + 1}</span>{line}</span>)}</pre>
}

function TerminalContent({ command = '$ npm run build' }: { command?: string }) {
  return <div style={{ ...codeStyle, color: 'var(--sp-text-muted)' }}><div style={{ color: 'var(--sp-success)' }}>{command}</div><div>Building application...</div><div style={{ color: 'var(--sp-success)' }}>✔ Build completed successfully.</div><div>0 errors, 0 warnings</div></div>
}

function PropertyContent() {
  return <div style={{ display: 'grid', gap: 10, fontSize: 13 }}><strong>Properties</strong><span>Selection: Workspace</span><span>Layout: Responsive</span><span>Theme: System</span></div>
}

function DocsDock({ layout, children, onLayoutChange, tabsAtBottom = false, manager }: { layout: DockLayout; children: ReactNode; onLayoutChange?: (next: DockLayout) => void; tabsAtBottom?: boolean; manager?: RefObject<DockManagerHandle | null> }) {
  return <div style={dockStyle}><DockManager layout={layout} onLayoutChange={onLayoutChange} tabsAtBottom={tabsAtBottom} ref={manager}>{children}</DockManager></div>
}

export function DockManagerPage() {
  const manager = useRef<DockManagerHandle>(null)
  const [basicLayout, setBasicLayout] = useState(BASIC_LAYOUT)
  const [serialized, setSerialized] = useState('')
  return <div className="features-layout"><div className="features-main">
    <h1>Dock Manager</h1>
    <p className="docs-desc">A flexible IDE-style layout engine with resizable split panels, tabbed and document groups, floating windows, auto-hide edge strips, controlled layouts, and JSON persistence.</p>

    <section id="basic" className="demo-section"><h2>Basic Usage</h2><p className="section-desc">Panels are auto-arranged when no layout is supplied. Drag a title bar, use the pin and float actions, resize a splitter, or close a panel.</p><CodePreview code={BASIC_CODE} language="typescript"><DocsDock layout={basicLayout} onLayoutChange={setBasicLayout} manager={manager}><DockPanel panelId="explorer" title="Explorer" icon="folder"><ExplorerContent /></DockPanel><DockPanel panelId="editor" title="app.ts" icon="file-code"><EditorContent /></DockPanel><DockPanel panelId="terminal" title="Terminal" icon="terminal"><TerminalContent /></DockPanel></DocsDock></CodePreview></section>

    <section id="layout" className="demo-section"><h2>Custom Layout</h2><p className="section-desc">A <code>DockLayout</code> is a serializable tree. Compose horizontal and vertical splits, then place tab groups wherever the product needs them.</p><CodePreview code={LAYOUT_CODE} language="typescript"><DocsDock layout={EDITOR_LAYOUT}><DockPanel panelId="files" title="Files" icon="folder"><ExplorerContent /></DockPanel><DockPanel panelId="main-ts" title="main.ts" icon="file-code"><EditorContent lines={["import { useEffect } from 'react';", "import { Workspace } from './Workspace';", '', 'export function App() {', '  return <Workspace />;', '}']} /></DockPanel><DockPanel panelId="styles" title="styles.scss" icon="file-code"><EditorContent lines={[':root {', '  --primary: #166534;', '  --surface: #fafafa;', '  --radius: 6px;', '}']} /></DockPanel><DockPanel panelId="console" title="Output" icon="terminal"><TerminalContent command="$ npm run build -- --production" /></DockPanel></DocsDock></CodePreview></section>

    <section id="tabs" className="demo-section"><h2>Tabbed Panels</h2><p className="section-desc">Drop one panel onto another to create a tab group. Individual tabs can be activated, reordered, closed, or dragged out into a separate split.</p><CodePreview code={TABS_CODE} language="typescript"><DocsDock layout={TABS_LAYOUT}><DockPanel panelId="explorer" title="Explorer" icon="folder"><ExplorerContent label="project" /></DockPanel><DockPanel panelId="tab-editor" title="editor.ts" icon="file-code"><EditorContent /></DockPanel><DockPanel panelId="tab-preview" title="Preview" icon="globe"><p style={panelTextStyle}>The preview panel is the second tab in this workspace.</p></DockPanel></DocsDock></CodePreview></section>

    <section id="bottom-tabs" className="demo-section"><h2>Bottom Tabs</h2><p className="section-desc">Set <code>tabsAtBottom</code> when the active document title and tools should stay above a bottom tab strip.</p><CodePreview code={BOTTOM_TABS_CODE} language="typescript"><DocsDock layout={TABS_LAYOUT} tabsAtBottom><DockPanel panelId="explorer" title="Explorer" icon="folder"><ExplorerContent label="project" /></DockPanel><DockPanel panelId="tab-editor" title="editor.ts" icon="file-code"><EditorContent /></DockPanel><DockPanel panelId="tab-preview" title="Preview" icon="globe"><p style={panelTextStyle}>Bottom tabs are useful for document-centric workspaces.</p></DockPanel></DocsDock></CodePreview></section>

    <section id="document-panels" className="demo-section"><h2>Document Panels</h2><p className="section-desc">A <code>document</code> node keeps its well when its last document closes, so users can drop a new document back into the same workspace.</p><CodePreview code={DOCUMENT_CODE} language="typescript"><DocsDock layout={DOCUMENT_LAYOUT}><DockPanel panelId="explorer" title="Explorer" icon="folder"><ExplorerContent /></DockPanel><DockPanel panelId="main" title="main.ts" icon="file-code"><EditorContent /></DockPanel><DockPanel panelId="preview" title="Preview" icon="globe"><p style={panelTextStyle}>Document preview.</p></DockPanel><DockPanel panelId="terminal" title="Terminal" icon="terminal"><TerminalContent /></DockPanel><DockPanel panelId="properties" title="Properties" icon="sliders-horizontal"><PropertyContent /></DockPanel></DocsDock></CodePreview></section>

    <section id="fixed-document" className="demo-section"><h2>Fixed Document Surface</h2><p className="section-desc">Use <code>allowedDockZones={'[]'}</code> and <code>showHeader={'false'}</code> for a permanent, headerless document surface that cannot be dragged into another well.</p><CodePreview code={FIXED_CODE} language="typescript"><DocsDock layout={FIXED_LAYOUT}><DockPanel panelId="canvas" title="Design" allowedDockZones={[]} showHeader={false}><div style={{ minHeight: 180, display: 'grid', placeItems: 'center', border: '1px dashed var(--sp-border)', borderRadius: 'var(--sp-radius-md)' }}>Canvas surface</div></DockPanel><DockPanel panelId="properties" title="Properties" icon="sliders-horizontal"><PropertyContent /></DockPanel></DocsDock></CodePreview></section>

    <section id="panel-tools" className="demo-section"><h2>Panel Tools and Badges</h2><p className="section-desc">Place <code>DockPanelTools</code> directly inside a panel. Its controls stay interactive and are not treated as drag handles.</p><CodePreview code={TOOLS_CODE} language="typescript"><DocsDock layout={{ root: { type: 'split', id: 'tools-root', direction: 'h', sizes: [50, 50], children: [{ type: 'leaf', id: 'tools-editor', panelId: 'tools-editor' }, { type: 'leaf', id: 'tools-preview', panelId: 'tools-preview' }] }, floats: [] }}><DockPanel panelId="tools-editor" title="editor.ts" icon="file-code" badge={3}><DockPanelTools><Button size="sm" variant="ghost" iconLeft="save">Save</Button><Button size="sm" variant="ghost" iconLeft="play">Run</Button></DockPanelTools><EditorContent /></DockPanel><DockPanel panelId="tools-preview" title="Preview" icon="globe"><p style={panelTextStyle}>The editor has a badge and two header tools.</p></DockPanel></DocsDock></CodePreview></section>

    <section id="persist" className="demo-section"><h2>Layout Persistence</h2><p className="section-desc">Set <code>storageKey</code> to restore and save the current layout through <code>localStorage</code>. The same layout can also be controlled with <code>layout</code> and <code>onLayoutChange</code>.</p><CodePreview code={PERSISTENCE_CODE} language="typescript" codeOnly /></section>

    <section id="export-import" className="demo-section"><h2>Export and Import</h2><p className="section-desc">The handle exposes object and JSON methods for save/restore commands. Try exporting the live basic example, editing the JSON, and importing it back.</p><div style={{ display: 'grid', gap: 10 }}><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}><Button size="sm" variant="secondary" iconLeft="save" onClick={() => setSerialized(manager.current?.exportLayout() ?? '')}>Export JSON</Button><Button size="sm" variant="outline" iconLeft="download" onClick={() => manager.current?.importLayout(serialized)}>Import JSON</Button><Button size="sm" variant="ghost" iconLeft="rotate-ccw" onClick={() => manager.current?.resetLayout()}>Reset layout</Button></div><textarea aria-label="Dock layout JSON" value={serialized} onChange={(event) => setSerialized(event.target.value)} style={{ width: '100%', minHeight: 120, resize: 'vertical', fontFamily: 'var(--sp-font-family-mono)', fontSize: 12 }} /></div></section>

    <section id="dnd" className="demo-section"><h2>Drag and Drop Docking</h2><p className="section-desc">Panel title bars expose native drag sources. Drop zones appear over compatible nodes and support top, right, bottom, left, and center docking. Drag a tab-group bar to move the complete group.</p><CodePreview code={`<DockPanel panelId="editor" title="Editor" allowedDockZones={['center', 'right']}>
  <EditorPreview />
</DockPanel>`} language="typescript" codeOnly /></section>

    <section id="auto-hide" className="demo-section"><h2>Auto-hide and Edge Strips</h2><p className="section-desc">Auto-hidden panels render as logical edge strips. Click a strip tab to peek, press <kbd>Esc</kbd> or click outside to dismiss, and use the pin action to restore the panel to its remembered neighbour or edge.</p><CodePreview code={AUTO_HIDE_CODE} language="typescript"><DocsDock layout={AUTO_HIDE_LAYOUT}><DockPanel panelId="explorer" title="Explorer" icon="folder"><ExplorerContent /></DockPanel><DockPanel panelId="properties" title="Properties" icon="sliders-horizontal"><PropertyContent /></DockPanel><DockPanel panelId="output" title="Output" icon="terminal"><TerminalContent /></DockPanel><DockPanel panelId="editor" title="app.ts" icon="file-code"><EditorContent /></DockPanel><DockPanel panelId="terminal" title="Terminal" icon="terminal"><TerminalContent /></DockPanel></DocsDock></CodePreview></section>

    <section id="api" className="demo-section"><h2>API</h2><div className="api-table-wrap"><table className="api-table"><thead><tr><th>Surface</th><th>API</th><th>Purpose</th></tr></thead><tbody>
      <tr><td><code>DockManager</code></td><td><code>layout, onLayoutChange, storageKey</code></td><td>Controlled state and JSON persistence.</td></tr>
      <tr><td><code>DockManager</code></td><td><code>thinSplitters, dense, tabsAtBottom</code></td><td>Thin splitters (enabled by default), chrome density, and tab placement.</td></tr>
      <tr><td><code>DockPanel</code></td><td><code>panelId, title, icon, closeable, badge</code></td><td>Panel identity and header metadata.</td></tr>
      <tr><td><code>DockPanel</code></td><td><code>allowedDockZones, showHeader</code></td><td>Restrict movement or create a fixed document surface.</td></tr>
      <tr><td><code>DockPanelTools</code></td><td>children</td><td>Interactive controls projected into the active header.</td></tr>
      <tr><td>Handle</td><td><code>getLayout, setLayout, resetLayout</code></td><td>Imperative layout commands.</td></tr>
      <tr><td>Handle</td><td><code>exportLayout, importLayout</code></td><td>Serialize or restore JSON layouts.</td></tr>
      <tr><td>Handle</td><td><code>activatePanel, autoHidePanel, restoreAutoHide</code></td><td>Reveal and control auto-hidden panels.</td></tr>
      <tr><td>Types</td><td><code>DockLeafNode, DockTabNode, DockDocumentNode, DockSplitNode</code></td><td>Serializable layout tree nodes.</td></tr>
      <tr><td>Types</td><td><code>DockFloat, DockAutoHide, AutoHideStrip</code></td><td>Floating windows and reusable edge-strip data.</td></tr>
    </tbody></table></div></section>
  </div><nav className="features-toc" aria-label="On this page"><p className="features-toc__title">On this page</p><ul className="toc-list">{DOC_SECTIONS.map(([id, label]) => <li key={id}><a className="toc-link" href={`#${id}`}>{label}</a></li>)}</ul></nav></div>
}
