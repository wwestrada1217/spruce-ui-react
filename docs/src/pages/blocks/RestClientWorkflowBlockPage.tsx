import { useState } from 'react';
import { Badge, Button, Icon } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { BlockPageLayout, type BlockPageSection } from './BlockPageLayout';

const SECTIONS: readonly BlockPageSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'opening', label: 'Opening the Workflow Designer' },
  { id: 'canvas', label: 'Canvas Basics' },
  { id: 'building', label: 'Building a Workflow' },
  { id: 'conditions', label: 'Edge Conditions' },
  { id: 'running', label: 'Running a Workflow' },
  { id: 'env-vars', label: 'Environment Variables' },
  { id: 'branch-modes', label: 'Branch Modes' },
  { id: 'scripts', label: 'Scripts' },
  { id: 'limitations', label: 'Known Limitations' },
  { id: 'code', label: 'Source Code' },
];

const WORKFLOW_CODE = `type WorkflowNode = {
  id: string;
  requestId: string;
  position: { x: number; y: number };
};

type WorkflowEdge = {
  source: string;
  target: string;
  conditions?: Array<{ source: 'status' | 'body' | 'header' | 'env'; operator: string; value: string }>;
};

export function WorkflowDesigner() {
  const [runState, setRunState] = useState<'idle' | 'complete'>('idle');
  return (
    <section aria-label="REST workflow designer">
      <button type="button" onClick={() => setRunState('complete')}>Run workflow</button>
      <output aria-live="polite">{runState === 'complete' ? 'Workflow completed' : 'Ready to run'}</output>
    </section>
  );
}`;

function WorkflowDiagram() {
  return (
    <div className="sp-block-workflow__diagram" role="img" aria-label="Workflow designer diagram showing login, profile, and error nodes connected by conditional edges">
      <svg viewBox="0 0 540 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="workflow-arrow-success" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,1 L0,7 L6,4 Z" fill="var(--sp-success)" /></marker>
          <marker id="workflow-arrow-danger" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,1 L0,7 L6,4 Z" fill="var(--sp-danger)" /></marker>
        </defs>
        <path d="M100,135 C100,155 250,155 250,145" stroke="var(--sp-success)" strokeWidth="1.5" markerEnd="url(#workflow-arrow-success)" />
        <path d="M100,135 C100,180 400,195 400,145" stroke="var(--sp-danger)" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#workflow-arrow-danger)" />
        <g className="sp-workflow-svg-node">
          <rect x="20" y="70" width="160" height="60" rx="8" fill="var(--sp-surface-100)" stroke="var(--sp-border)" />
          <text x="49" y="94" fontSize="9" fontWeight="700" fill="var(--sp-primary)" textAnchor="middle">POST</text>
          <text x="102" y="94" fontSize="11" fontWeight="600" fill="var(--sp-text-color)" textAnchor="middle">Login</text>
          <text x="30" y="116" fontSize="9" fill="var(--sp-text-muted)">/api/auth/login</text>
        </g>
        <g className="sp-workflow-svg-node">
          <rect x="190" y="70" width="160" height="60" rx="8" fill="var(--sp-surface-100)" stroke="var(--sp-border)" />
          <text x="214" y="94" fontSize="9" fontWeight="700" fill="var(--sp-success)" textAnchor="middle">GET</text>
          <text x="270" y="94" fontSize="11" fontWeight="600" fill="var(--sp-text-color)" textAnchor="middle">Get Profile</text>
          <text x="200" y="116" fontSize="9" fill="var(--sp-text-muted)">/api/users/me</text>
        </g>
        <g className="sp-workflow-svg-node">
          <rect x="360" y="70" width="160" height="60" rx="8" fill="var(--sp-surface-100)" stroke="var(--sp-danger)" />
          <text x="389" y="94" fontSize="9" fontWeight="700" fill="var(--sp-primary)" textAnchor="middle">POST</text>
          <text x="440" y="94" fontSize="11" fontWeight="600" fill="var(--sp-text-color)" textAnchor="middle">Log Error</text>
          <text x="370" y="116" fontSize="9" fill="var(--sp-text-muted)">/api/errors</text>
        </g>
        <text x="181" y="166" fontSize="9" fill="var(--sp-text-muted)" textAnchor="middle">status = 200</text>
        <text x="262" y="193" fontSize="9" fill="var(--sp-text-muted)" textAnchor="middle">status ≠ 200</text>
      </svg>
    </div>
  );
}

function WorkflowTable({ children }: { readonly children: React.ReactNode }) {
  return <div className="sp-block-workflow__table-wrap"><table className="sp-block-workflow__table">{children}</table></div>;
}

export function RestClientWorkflowBlockPage() {
  const [runState, setRunState] = useState<'idle' | 'running' | 'complete'>('idle');

  return (
    <BlockPageLayout
      title="REST Client — Workflow Designer"
      description="Visually compose and execute multi-step API request pipelines. Drag requests onto a canvas, draw conditional connections between them, and run the whole graph with one click."
      sections={SECTIONS}
    >
      <section id="overview" className="demo-section" aria-labelledby="overview-heading">
        <h2 id="overview-heading">Overview</h2>
        <p className="section-desc">The Workflow Designer models complex API interactions as a directed acyclic graph (DAG). Each node is a saved request, and each edge can carry conditions that gate whether the next request runs.</p>
        <p className="section-desc">Unlike a collection runner, workflows can branch, skip, and chain requests based on live response data.</p>
        <WorkflowDiagram />
      </section>

      <section id="opening" className="demo-section" aria-labelledby="opening-heading">
        <h2 id="opening-heading">Opening the Workflow Designer</h2>
        <p className="section-desc">Workflows are accessed from the <strong>Flows</strong> tab in the workspace sidebar, alongside Collections, History, and Environments.</p>
        <ol className="sp-block-workflow__steps">
          <li>Open the REST Client and click the <strong>Flows</strong> tab at the bottom of the sidebar.</li>
          <li>Click <strong>New Workflow</strong> or the <code>+</code> icon to create a blank workflow.</li>
          <li>Reopen an existing workflow by selecting its name in the Flows list.</li>
          <li>Return to the main workspace with the back arrow in the designer toolbar.</li>
        </ol>
        <div className="sp-block-workflow__callout"><Icon name="info" size={14} aria-hidden="true" /><p>Workflows are stored in <code>localStorage</code> under <code>spruce-rest-workflows</code>, scoped to the active workspace. They reference saved requests by ID.</p></div>
      </section>

      <section id="canvas" className="demo-section" aria-labelledby="canvas-heading">
        <h2 id="canvas-heading">Canvas Basics</h2>
        <p className="section-desc">The canvas is a zoomable, pannable SVG surface with a dot-grid background.</p>
        <div className="sp-block-workflow__grid">
          <div><h3>Navigating the canvas</h3><WorkflowTable><thead><tr><th>Action</th><th>How</th></tr></thead><tbody><tr><td>Pan</td><td>Hold <code>Space</code> then drag, or use the middle mouse button.</td></tr><tr><td>Zoom</td><td>Scroll wheel, clamped to 0.2×–3×.</td></tr><tr><td>Fit all nodes</td><td>Use <strong>Fit</strong> in the toolbar.</td></tr></tbody></WorkflowTable></div>
          <div><h3>Node keyboard shortcuts</h3><WorkflowTable><thead><tr><th>Key</th><th>Action</th></tr></thead><tbody><tr><td><code>Delete</code> / <code>Backspace</code></td><td>Delete the selected node or edge.</td></tr><tr><td><code>Escape</code></td><td>Cancel a port drag and deselect.</td></tr><tr><td><code>Arrow keys</code></td><td>Nudge a selected node by one 20px grid step.</td></tr></tbody></WorkflowTable></div>
        </div>
      </section>

      <section id="building" className="demo-section" aria-labelledby="building-heading">
        <h2 id="building-heading">Building a Workflow</h2>
        <h3>Adding request nodes</h3>
        <p className="section-desc">Drag a saved request from the workspace sidebar to the canvas. Nodes show the HTTP method, request name, URL, and snap to a 20px grid.</p>
        <h3>Connecting nodes</h3>
        <ul className="sp-block-workflow__list"><li>The output port is the circle at the bottom-center of a node.</li><li>The input port is the circle at the top-center of a node.</li><li>Drop on empty canvas space to cancel. Cycle-forming edges are rejected so the graph remains a DAG.</li></ul>
        <h3>Setting the start node</h3>
        <p className="section-desc">The runner auto-detects root nodes with no incoming edges. Configure <code>startNodeId</code> for a disconnected workflow that must start at a specific node.</p>
        <h3>Deleting nodes and edges</h3>
        <ul className="sp-block-workflow__list"><li>Select a node or edge and press <code>Delete</code>.</li><li>Deleting a node removes connected edges and clears <code>startNodeId</code> when applicable.</li></ul>
        <div className="sp-block-workflow__callout"><Icon name="info" size={14} aria-hidden="true" /><p>Canvas mutations are persisted immediately to <code>localStorage</code> through the workflow service.</p></div>
      </section>

      <section id="conditions" className="demo-section" aria-labelledby="conditions-heading">
        <h2 id="conditions-heading">Edge Conditions</h2>
        <p className="section-desc">An edge runs when all enabled conditions pass (AND logic). An edge with no conditions is unconditional. Select an edge or condition badge to open its editor.</p>
        <h3>Condition sources</h3>
        <WorkflowTable><thead><tr><th>Source</th><th>Reads from</th><th>Path field</th></tr></thead><tbody><tr><td><code>status</code></td><td>HTTP response status code</td><td>Hidden</td></tr><tr><td><code>body</code></td><td>Parsed JSON response body</td><td><code>data.user.id</code> or <code>items[0].status</code></td></tr><tr><td><code>header</code></td><td>Response header, case-insensitive</td><td><code>content-type</code></td></tr><tr><td><code>env</code></td><td>Current environment variable</td><td><code>access_token</code></td></tr></tbody></WorkflowTable>
        <h3>Operators</h3>
        <WorkflowTable><thead><tr><th>Operator</th><th>Behavior</th></tr></thead><tbody><tr><td><code>equals</code></td><td>Strict value equality.</td></tr><tr><td><code>notEquals</code></td><td>Value is different.</td></tr><tr><td><code>contains</code></td><td>String contains the right-hand value.</td></tr><tr><td><code>exists</code></td><td>Path resolves to a non-null value.</td></tr></tbody></WorkflowTable>
        <div className="sp-block-inline"><Badge variant="info" size="sm">status</Badge><Badge variant="warning" size="sm">body</Badge><Badge size="sm">header</Badge><Badge variant="success" size="sm">env</Badge></div>
      </section>

      <section id="running" className="demo-section" aria-labelledby="running-heading">
        <h2 id="running-heading">Running a Workflow</h2>
        <div className="sp-block-workflow__run">
          <div><strong>Example execution</strong><p>Run the graph and inspect each node’s request, response, and status.</p></div>
          <Button variant="primary" iconLeft={runState === 'running' ? 'loader' : 'play'} onClick={() => { setRunState('running'); setRunState('complete'); }}>{runState === 'running' ? 'Running…' : 'Run workflow'}</Button>
          <output role="status" aria-live="polite">{runState === 'complete' ? 'Completed: 3 nodes evaluated' : 'Ready to run'}</output>
        </div>
        <h3>Execution order</h3>
        <ol className="sp-block-workflow__steps"><li>Root nodes enter the work queue.</li><li>The runner executes pre-request scripts and the HTTP request.</li><li>Test scripts run; passing conditions enqueue downstream nodes.</li><li>Unreached nodes finish as <em>skipped</em>.</li></ol>
        <WorkflowTable><thead><tr><th>Status</th><th>Meaning</th></tr></thead><tbody><tr><td>pending</td><td>Not yet executed.</td></tr><tr><td>running</td><td>Request is in flight.</td></tr><tr><td>passed</td><td>Request and tests completed successfully.</td></tr><tr><td>failed</td><td>Request, test, or condition failed.</td></tr><tr><td>skipped</td><td>No passing edge path reached the node.</td></tr></tbody></WorkflowTable>
      </section>

      <section id="env-vars" className="demo-section" aria-labelledby="env-vars-heading">
        <h2 id="env-vars-heading">Environment Variables &amp; Chain Rules</h2>
        <p className="section-desc">The runner initializes a local variable map from the active workspace environment. Chain rules can extract values from a response and write them back for later requests.</p>
        <WorkflowTable><thead><tr><th>Request</th><th>Rule</th><th>Next request</th></tr></thead><tbody><tr><td>Login</td><td><code>body.token → access_token</code></td><td>Profile reads <code>{'{{access_token}}'}</code></td></tr><tr><td>Profile</td><td><code>body.user.id → user_id</code></td><td>Orders reads <code>{'{{user_id}}'}</code></td></tr></tbody></WorkflowTable>
        <div className="sp-block-workflow__callout"><Icon name="info" size={14} aria-hidden="true" /><p>Variables are scoped to a run. Use <code>{'{{varName}}'}</code> in URLs, headers, bodies, and scripts; unresolved variables remain visible so they can be corrected.</p></div>
      </section>

      <section id="branch-modes" className="demo-section" aria-labelledby="branch-modes-heading">
        <h2 id="branch-modes-heading">Branch Modes</h2>
        <p className="section-desc">When a node has multiple passing edges, choose how downstream branches should execute.</p>
        <WorkflowTable><thead><tr><th>Mode</th><th>Behavior</th><th>Use when</th></tr></thead><tbody><tr><td><code>sequential</code></td><td>Branches run one after another.</td><td>Order or shared state matters.</td></tr><tr><td><code>parallel</code></td><td>Passing branches run concurrently.</td><td>Branches are independent and latency matters.</td></tr></tbody></WorkflowTable>
        <div className="sp-block-workflow__callout"><Icon name="alert-triangle" size={14} aria-hidden="true" /><p>Parallel branches should not write the same environment variable unless the last-writer-wins behavior is intentional.</p></div>
      </section>

      <section id="scripts" className="demo-section" aria-labelledby="scripts-heading">
        <h2 id="scripts-heading">Scripts</h2>
        <p className="section-desc">Saved requests can define a pre-request script and a test script. The workflow runner honors both in the same request lifecycle as the REST Client.</p>
        <WorkflowTable><thead><tr><th>Script</th><th>When it runs</th><th>Typical use</th></tr></thead><tbody><tr><td>Pre-request</td><td>Immediately before the HTTP request.</td><td>Sign a request or prepare variables.</td></tr><tr><td>Test</td><td>After the response is received.</td><td>Assert status/body and gate outgoing edges.</td></tr></tbody></WorkflowTable>
      </section>

      <section id="limitations" className="demo-section" aria-labelledby="limitations-heading">
        <h2 id="limitations-heading">Known Limitations</h2>
        <ul className="sp-block-workflow__list"><li>Nodes currently execute once per run, even when multiple passing paths point to the same node.</li><li>All-of-N conditions are supported; arbitrary loop constructs are not.</li><li>WebSocket tabs cannot be added to a workflow.</li></ul>
      </section>

      <section id="code" className="demo-section" aria-labelledby="workflow-code-heading">
        <h2 id="workflow-code-heading">Source Code</h2>
        <CodePreview code={WORKFLOW_CODE} language="typescript" codeOnly title="Typed workflow model" />
      </section>
    </BlockPageLayout>
  );
}
