import { useState } from 'react';
import { PdfViewer, Button } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

export function PdfViewerPage() {
  const [source, setSource] = useState<string | null>(null);
  const [event, setEvent] = useState('No document selected');
  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>PDF Viewer</h1>
        <p className="docs-desc">A tokenized PDF preview surface with a toolbar, open/download actions, loading status, and empty state.</p>

        <section id="basic" className="demo-section">
          <h2>Preview and toolbar</h2>
          <p className="section-desc">Provide a trusted PDF URL or blob URL from the host application. This example keeps the viewer empty until a source is selected.</p>
          <div style={{ display: 'flex', gap: 'var(--sp-space-2)', marginBlockEnd: 'var(--sp-space-3)' }}>
            <Button size="sm" onClick={() => setSource('/samples/example.pdf')}>Load example</Button>
            <Button size="sm" variant="ghost" onClick={() => setSource(null)}>Clear</Button>
          </div>
          <CodePreview code={'<PdfViewer src={src} title="Contract preview" onLoaded={() => ...} onFailed={() => ...} />'}>
            <PdfViewer src={source} title="Contract preview" height="360px" onLoaded={() => setEvent('Document loaded')} onFailed={() => setEvent('Document failed to load')} />
            <p className="section-desc" role="status">{event}</p>
          </CodePreview>
        </section>

        <section id="empty" className="demo-section">
          <h2>Compact and empty</h2>
          <CodePreview code={'<PdfViewer src={null} toolbar={false} height="240px" />'}>
            <PdfViewer src={null} toolbar={false} height="240px" title="No PDF" />
          </CodePreview>
        </section>

        <section id="accessibility" className="demo-section">
          <h2>Accessibility and security</h2>
          <p className="section-desc">The iframe has a descriptive title, loading and empty states are announced as status messages, toolbar controls have localized names, and the viewer does not fetch a source until the host supplies one. Use a same-origin or explicitly trusted source when downloads are enabled.</p>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>src</code></td><td><code>string | null</code></td><td><code>null</code></td><td>PDF URL or blob URL.</td></tr>
            <tr><td><code>title</code> / <code>height</code></td><td><code>string</code></td><td>localized / <code>'640px'</code></td><td>Viewer and iframe title plus viewport height.</td></tr>
            <tr><td><code>toolbar</code> / <code>showOpen</code> / <code>showDownload</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Toolbar and action visibility.</td></tr>
            <tr><td><code>downloadFileName</code></td><td><code>string</code></td><td><code>'document.pdf'</code></td><td>Suggested download filename.</td></tr>
            <tr><td><code>onLoaded</code> / <code>onFailed</code></td><td><code>() =&gt; void</code> / iframe event callback</td><td>—</td><td>Lifecycle callbacks for host loading state.</td></tr>
            <tr><td><code>loadingTitle</code> / <code>emptyTitle</code> / <code>emptyDescription</code></td><td><code>string</code></td><td>localized</td><td>State copy overrides.</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list"><li><a className="toc-link" href="#basic">Preview</a></li><li><a className="toc-link" href="#empty">Empty state</a></li><li><a className="toc-link" href="#accessibility">Accessibility</a></li><li><a className="toc-link" href="#api">API</a></li></ul></nav>
    </div>
  );
}
