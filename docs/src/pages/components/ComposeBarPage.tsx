import { useState } from 'react';
import { ComposeBar, Icon } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

export function ComposeBarPage() {
  const [query, setQuery] = useState('');
  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Compose Bar</h1>
        <p className="docs-desc">A flexible command surface for search, prompts, filters, and composer workflows with leading and trailing slots.</p>

        <section id="basic" className="demo-section">
          <h2>Basic</h2>
          <CodePreview code={'<ComposeBar leading={...} trailing={...}><input className="sp-compose-bar__input" /></ComposeBar>'}>
            <ComposeBar leading={<Icon name="search" size={16} />} trailing={<button type="button" className="sp-compose-bar__action sp-compose-bar__action--primary">Run</button>}>
              <input className="sp-compose-bar__input" aria-label="Search projects" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" />
            </ComposeBar>
          </CodePreview>
        </section>

        <section id="variants" className="demo-section">
          <h2>Size, shape, and utility classes</h2>
          <CodePreview code={'<ComposeBar size="sm" shape="rounded" leading={...}>...</ComposeBar>'}>
            <div style={{ display: 'grid', gap: 'var(--sp-space-3)' }}>
              <ComposeBar size="sm" shape="rounded" leading={<span className="sp-compose-bar__chip sp-compose-bar__chip--success">GET</span>} trailing={<button type="button" className="sp-compose-bar__action sp-compose-bar__action--accent">Send</button>}>
                <span className="sp-compose-bar__input">/api/projects</span>
              </ComposeBar>
              <ComposeBar size="lg" shape="pill" leading={<span className="sp-compose-bar__chip sp-compose-bar__chip--info">AI</span>}>
                <span className="sp-compose-bar__input">Ask about this workspace</span>
              </ComposeBar>
            </div>
          </CodePreview>
        </section>

        <section id="accessibility" className="demo-section">
          <h2>Accessibility</h2>
          <p className="section-desc">The shell tracks descendant focus, preserves logical RTL ordering, and leaves labels, keyboard handling, and native form semantics to the slotted controls.</p>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>leading</code> / <code>children</code> / <code>trailing</code></td><td><code>ReactNode</code></td><td>—</td><td>Named leading/trailing slots and the primary body.</td></tr>
            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Tokenized height and spacing.</td></tr>
            <tr><td><code>shape</code></td><td><code>'pill' | 'rounded'</code></td><td><code>'pill'</code></td><td>Border-radius treatment.</td></tr>
            <tr><td>HTML div props</td><td><code>HTMLAttributes&lt;HTMLDivElement&gt;</code></td><td>—</td><td>Class names, direction, data attributes, and event handlers.</td></tr>
          </tbody></table></div>
          <p className="section-desc">Utility classes include <code>sp-compose-bar__input</code>, <code>sp-compose-bar__chip--success|info|warning|danger|neutral</code>, and <code>sp-compose-bar__action--primary|accent|danger</code>.</p>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list"><li><a className="toc-link" href="#basic">Basic</a></li><li><a className="toc-link" href="#variants">Variants</a></li><li><a className="toc-link" href="#accessibility">Accessibility</a></li><li><a className="toc-link" href="#api">API</a></li></ul></nav>
    </div>
  );
}
