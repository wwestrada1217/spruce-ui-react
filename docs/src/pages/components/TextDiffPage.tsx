import { TextDiff } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

export function TextDiffPage() {
  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Text Diff</h1>
        <p className="docs-desc">Readable inline and block text comparisons with word or character granularity, style controls, and an optional summary.</p>

        <section id="inline" className="demo-section">
          <h2>Inline word diff</h2>
          <CodePreview code={'<TextDiff oldText="Ship on Friday" newText="Ship on Monday" showSummary />'}>
            <TextDiff oldText="Ship on Friday" newText="Ship on Monday" showSummary ariaLabel="Release date change" />
          </CodePreview>
        </section>

        <section id="block" className="demo-section">
          <h2>Block and character diff</h2>
          <CodePreview code={'<TextDiff appearance="block" granularity="character" deletionStyle="highlight" insertionStyle="highlight" />'}>
            <TextDiff appearance="block" granularity="character" deletionStyle="highlight" insertionStyle="highlight" oldText={'const mode = "safe";'} newText={'const mode = "fast";'} ariaLabel="Code change" />
          </CodePreview>
        </section>

        <section id="accessibility" className="demo-section">
          <h2>Accessibility</h2>
          <p className="section-desc">The result has a localized label, inserted/deleted segments retain semantic markup, whitespace is preserved, and the optional summary is polite live content. Appearance and colors are tokenized for light and dark themes.</p>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>oldText</code> / <code>newText</code></td><td><code>string</code></td><td><code>''</code></td><td>Source and updated text.</td></tr>
            <tr><td><code>granularity</code></td><td><code>'word' | 'character'</code></td><td><code>'word'</code></td><td>Diff segmentation strategy.</td></tr>
            <tr><td><code>appearance</code></td><td><code>'inline' | 'block' | 'plain'</code></td><td><code>'inline'</code></td><td>Layout treatment.</td></tr>
            <tr><td><code>deletionStyle</code> / <code>insertionStyle</code></td><td><code>'strike' | 'underline' | 'highlight' | 'none'</code></td><td><code>'strike'</code> / <code>'underline'</code></td><td>Visual treatment of each change kind.</td></tr>
            <tr><td><code>showSummary</code> / <code>ariaLabel</code></td><td><code>boolean</code> / <code>string</code></td><td><code>false</code> / localized</td><td>Change count and accessible result name.</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list"><li><a className="toc-link" href="#inline">Inline</a></li><li><a className="toc-link" href="#block">Block</a></li><li><a className="toc-link" href="#accessibility">Accessibility</a></li><li><a className="toc-link" href="#api">API</a></li></ul></nav>
    </div>
  );
}
