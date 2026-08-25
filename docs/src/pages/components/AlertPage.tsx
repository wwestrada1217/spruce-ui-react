import { useState, useEffect, useRef } from 'react';
import { Alert } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const VARIANTS_CODE = `<Alert variant="info">This is an informational message.</Alert>
<Alert variant="success">Operation completed successfully.</Alert>
<Alert variant="warning">Please review the configuration before proceeding.</Alert>
<Alert variant="danger">An error occurred while saving the record.</Alert>`;

const WITH_TITLE_CODE = `<Alert variant="info" title="Heads up">
  This feature is currently in beta. Some functionality may change.
</Alert>
<Alert variant="success" title="Saved">
  Your changes have been saved to the database.
</Alert>
<Alert variant="danger" title="Connection failed">
  Unable to reach the server. Check your network and try again.
</Alert>`;

const DISMISSIBLE_CODE = `<Alert variant="warning" title="Session expiring" dismissible>
  Your session will expire in 5 minutes. Save your work.
</Alert>
<Alert variant="info" dismissible>
  Click the X to dismiss this alert.
</Alert>`;

const MOTIF_CODE = `<Alert variant="info" size="sm" backgroundMotif="arc-orbit">
  Compact contextual feedback with a decorative background motif.
</Alert>
<Alert variant="success" backgroundMotif="overlapping-diamonds" motifPosition="bottom-right">
  Motifs stay behind the content and are aria-hidden.
</Alert>`;

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'variants',    label: 'Variants' },
  { id: 'with-title',  label: 'With Title' },
  { id: 'dismissible', label: 'Dismissible' },
  { id: 'motif',       label: 'Motif & Size' },
  { id: 'api',         label: 'API' },
];

export function AlertPage() {
  const [activeSection, setActiveSection] = useState('variants');
  const [key, setKey] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { threshold: 0.3 },
    );
    const sections = mainRef.current?.querySelectorAll('[id]') ?? [];
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Alert</h1>
        <p className="docs-desc">
          Contextual feedback messages for user actions. Supports 4 variants, optional title, and dismissible close button.
        </p>

        <section id="variants" className="demo-section" aria-labelledby="variants-heading">
          <h2 id="variants-heading">Variants</h2>
          <p className="section-desc">The four built-in color variants convey different levels of severity.</p>
          <CodePreview code={VARIANTS_CODE}>
            <div className="docs-stack" style={{ width: '100%' }}>
              <Alert variant="info">This is an informational message.</Alert>
              <Alert variant="success">Operation completed successfully.</Alert>
              <Alert variant="warning">Please review the configuration before proceeding.</Alert>
              <Alert variant="danger">An error occurred while saving the record.</Alert>
            </div>
          </CodePreview>
        </section>

        <section id="with-title" className="demo-section" aria-labelledby="with-title-heading">
          <h2 id="with-title-heading">With Title</h2>
          <p className="section-desc">Add a bold title above the alert body for extra emphasis.</p>
          <CodePreview code={WITH_TITLE_CODE}>
            <div className="docs-stack" style={{ width: '100%' }}>
              <Alert variant="info" title="Heads up">
                This feature is currently in beta. Some functionality may change.
              </Alert>
              <Alert variant="success" title="Saved">
                Your changes have been saved to the database.
              </Alert>
              <Alert variant="danger" title="Connection failed">
                Unable to reach the server. Check your network and try again.
              </Alert>
            </div>
          </CodePreview>
        </section>

        <section id="dismissible" className="demo-section" aria-labelledby="dismissible-heading">
          <h2 id="dismissible-heading">Dismissible</h2>
          <p className="section-desc">
            Enable the dismiss button so users can close the alert. The <code>onClose</code> callback fires on dismiss.
          </p>
          <CodePreview code={DISMISSIBLE_CODE}>
            <div className="docs-stack" style={{ width: '100%' }}>
              <div key={`warning-${key}`}>
                <Alert variant="warning" title="Session expiring" dismissible onClose={() => undefined}>
                  Your session will expire in 5&nbsp;minutes. Save your work.
                </Alert>
              </div>
              <div key={`info-${key}`}>
                <Alert variant="info" dismissible onClose={() => undefined}>
                  Click the X to dismiss this alert.
                </Alert>
              </div>
              <button
                onClick={() => setKey((k) => k + 1)}
                style={{
                  fontSize: 12,
                  color: 'var(--text-3)',
                  background: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: 4,
                  padding: '4px 10px',
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                Reset alerts
              </button>
            </div>
          </CodePreview>
        </section>

        <section id="motif" className="demo-section" aria-labelledby="motif-heading">
          <h2 id="motif-heading">Motif &amp; Size</h2>
          <p className="section-desc">
            Use the compact size for dense layouts and add a decorative motif without changing the alert semantics.
          </p>
          <CodePreview code={MOTIF_CODE}>
            <div className="docs-stack" style={{ width: '100%' }}>
              <Alert variant="info" size="sm" backgroundMotif="arc-orbit">
                Compact contextual feedback with a decorative background motif.
              </Alert>
              <Alert variant="success" backgroundMotif="overlapping-diamonds" motifPosition="bottom-right">
                Motifs stay behind the content and are aria-hidden.
              </Alert>
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>variant</code></td><td><code>'info' | 'success' | 'warning' | 'danger'</code></td><td><code>'info'</code></td><td>Visual style of the alert</td></tr>
                <tr><td><code>title</code></td><td><code>string</code></td><td><code>''</code></td><td>Optional alert title</td></tr>
                <tr><td><code>dismissible</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show dismiss button</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>Alert density</td></tr>
                <tr><td><code>backgroundMotif</code></td><td><code>string</code></td><td>—</td><td>Decorative background motif name</td></tr>
                <tr><td><code>motifPosition</code></td><td><code>SpMotifPosition</code></td><td><code>'center-right'</code></td><td>Logical visual anchor for the motif</td></tr>
                <tr><td><code>onClose</code></td><td><code>() =&gt; void</code></td><td>—</td><td>Called when the alert is dismissed</td></tr>
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
  );
}
