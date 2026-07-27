import { useState, useEffect, useRef } from 'react';
import { MarkdownEditor, type MarkdownEditorMode } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const BASIC_CODE = `import { MarkdownEditor } from 'spruce-react';

<MarkdownEditor
  placeholder="Type your markdown here..."
  onChange={(val) => console.log(val)}
/>`;

const MODES_CODE = `import { useState } from 'react';
import { MarkdownEditor, MarkdownEditorMode } from 'spruce-react';

function ModesDemo() {
  const [mode, setMode] = useState<MarkdownEditorMode>('split');

  return (
    <MarkdownEditor
      mode={mode}
      onModeChange={setMode}
      value="# Split Mode Demo\\nEdit markdown on the left and see real-time preview on the right."
    />
  );
}`;

const CONTROLLED_CODE = `import { useState } from 'react';
import { MarkdownEditor } from 'spruce-react';

const SAMPLE_MARKDOWN = \`# Welcome to Spruce Markdown Editor

A powerful **Markdown editor** with live preview, toolbar formatting, tables, and split view.

## Features
- **Headings** (H1, H2, H3)
- **Formatting**: *italic*, ~~strikethrough~~, \`inline code\`
- **Lists**: Bullet, Numbered
- **Blockquotes** and **Tables**

| Feature | Supported |
| ------- | --------- |
| Split View | Yes |
| Custom Heights | Yes |

> "Simplicity is prerequisite for reliability." – Edsger W. Dijkstra
\`;

function ControlledDemo() {
  const [text, setText] = useState(SAMPLE_MARKDOWN);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      <MarkdownEditor value={text} onChange={setText} mode="split" minHeight={260} />
      <div style={{ padding: 12, background: 'var(--sp-surface-100)', borderRadius: 8, fontSize: 13 }}>
        <strong>Raw Markdown Value:</strong>
        <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap', fontSize: 12 }}>{text}</pre>
      </div>
    </div>
  );
}`;

const SIZES_CODE = `import { MarkdownEditor } from 'spruce-react';

<MarkdownEditor size="sm" placeholder="Small markdown editor" minHeight={80} />
<MarkdownEditor size="md" placeholder="Medium markdown editor" minHeight={120} />
<MarkdownEditor size="lg" placeholder="Large markdown editor" minHeight={180} />`;

const HEIGHTS_CODE = `import { MarkdownEditor } from 'spruce-react';

<MarkdownEditor
  minHeight={250}
  maxHeight={400}
  placeholder="Editor with custom min and max height..."
/>`;

const DISABLED_CODE = `import { MarkdownEditor } from 'spruce-react';

<MarkdownEditor disabled label="Disabled Editor" value="# Disabled\\nContent cannot be edited." />
<MarkdownEditor readOnly label="Read-only Editor" value="# Read-only\\nContent is read-only." />`;

const ERROR_CODE = `import { MarkdownEditor } from 'spruce-react';

<MarkdownEditor
  error="Markdown content is required."
/>`;

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: 'basic',      label: 'Basic Editor' },
  { id: 'modes',      label: 'View Modes' },
  { id: 'controlled', label: 'Controlled Content' },
  { id: 'sizes',      label: 'Sizes' },
  { id: 'heights',    label: 'Custom Heights' },
  { id: 'disabled',   label: 'Disabled & Readonly' },
  { id: 'error',      label: 'With Error' },
  { id: 'api',        label: 'API' },
];

const SAMPLE_MARKDOWN = `# Welcome to Spruce Markdown Editor

A powerful **Markdown editor** with live preview, toolbar formatting, tables, and split view.

## Features
- **Headings** (H1, H2, H3)
- **Formatting**: *italic*, ~~strikethrough~~, \`inline code\`
- **Lists**: Bullet, Numbered
- **Blockquotes** and **Tables**

| Feature | Supported |
| ------- | --------- |
| Split View | Yes |
| Custom Heights | Yes |

> "Simplicity is prerequisite for reliability." – Edsger W. Dijkstra
`;

export function MarkdownEditorPage() {
  const [activeSection, setActiveSection] = useState('basic');
  const [mode, setMode] = useState<MarkdownEditorMode>('split');
  const [content, setContent] = useState(SAMPLE_MARKDOWN);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    );
    mainRef.current?.querySelectorAll('section[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Markdown Editor</h1>
        <p className="docs-desc">
          A dedicated Markdown text editor component featuring toolbar formatting, write, live preview, and side-by-side split modes.
        </p>

        {/* Basic Editor */}
        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic Editor</h2>
          <p className="section-desc">Default markdown editor with formatting toolbar and write mode.</p>
          <CodePreview code={BASIC_CODE} language="typescript">
            <MarkdownEditor placeholder="Type your markdown here..." />
          </CodePreview>
        </section>

        {/* View Modes */}
        <section id="modes" className="demo-section" aria-labelledby="modes-heading">
          <h2 id="modes-heading">View Modes</h2>
          <p className="section-desc">Switch between <code>write</code>, <code>preview</code>, and <code>split</code> side-by-side modes using the <code>mode</code> prop.</p>
          <CodePreview code={MODES_CODE} language="typescript">
            <MarkdownEditor
              mode={mode}
              onModeChange={setMode}
              value="# Split Mode Demo&#10;Edit markdown on the left and see real-time preview on the right."
              minHeight={180}
            />
          </CodePreview>
        </section>

        {/* Controlled Content */}
        <section id="controlled" className="demo-section" aria-labelledby="controlled-heading">
          <h2 id="controlled-heading">Controlled Content</h2>
          <p className="section-desc">Bind state to <code>value</code> and <code>onChange</code> for controlled state management.</p>
          <CodePreview code={CONTROLLED_CODE} language="typescript">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
              <MarkdownEditor value={content} onChange={setContent} mode="split" minHeight={240} />
              <div style={{ padding: 12, background: 'var(--sp-surface-100, #e9eef5)', borderRadius: 8, fontSize: 13 }}>
                <strong>Raw Markdown Value:</strong>
                <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap', fontSize: 12 }}>{content}</pre>
              </div>
            </div>
          </CodePreview>
        </section>

        {/* Sizes */}
        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Visual size variants using the <code>size</code> prop (<code>sm</code>, <code>md</code>, <code>lg</code>).</p>
          <CodePreview code={SIZES_CODE} language="typescript">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
              <MarkdownEditor size="sm" placeholder="Small markdown editor..." minHeight={80} />
              <MarkdownEditor size="md" placeholder="Medium markdown editor..." minHeight={120} />
              <MarkdownEditor size="lg" placeholder="Large markdown editor..." minHeight={180} />
            </div>
          </CodePreview>
        </section>

        {/* Custom Heights */}
        <section id="heights" className="demo-section" aria-labelledby="heights-heading">
          <h2 id="heights-heading">Custom Heights</h2>
          <p className="section-desc">Control vertical bounds using <code>minHeight</code> and <code>maxHeight</code>.</p>
          <CodePreview code={HEIGHTS_CODE} language="typescript">
            <MarkdownEditor minHeight={200} maxHeight={350} placeholder="Editor with min/max height..." />
          </CodePreview>
        </section>

        {/* Disabled & Readonly */}
        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled &amp; Readonly</h2>
          <p className="section-desc">Prevent editing using <code>disabled</code> or <code>readOnly</code> props.</p>
          <CodePreview code={DISABLED_CODE} language="typescript">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
              <MarkdownEditor disabled label="Disabled Editor" value="# Disabled&#10;Content cannot be edited." />
              <MarkdownEditor readOnly label="Read-only Editor" value="# Read-only&#10;Content is read-only." />
            </div>
          </CodePreview>
        </section>

        {/* With Error */}
        <section id="error" className="demo-section" aria-labelledby="error-heading">
          <h2 id="error-heading">With Error</h2>
          <p className="section-desc">Display validation error state using the <code>error</code> prop.</p>
          <CodePreview code={ERROR_CODE} language="typescript">
            <MarkdownEditor error="Markdown content is required." />
          </CodePreview>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>value</code></td>
                  <td><code>string</code></td>
                  <td>—</td>
                  <td>Raw Markdown content string value</td>
                </tr>
                <tr>
                  <td><code>onChange</code></td>
                  <td><code>(value: string) =&gt; void</code></td>
                  <td>—</td>
                  <td>Callback emitted when raw Markdown content changes</td>
                </tr>
                <tr>
                  <td><code>mode</code></td>
                  <td><code>'write' | 'preview' | 'split'</code></td>
                  <td><code>'write'</code></td>
                  <td>Active editing view mode</td>
                </tr>
                <tr>
                  <td><code>onModeChange</code></td>
                  <td><code>(mode: MarkdownEditorMode) =&gt; void</code></td>
                  <td>—</td>
                  <td>Callback emitted when view mode switches</td>
                </tr>
                <tr>
                  <td><code>placeholder</code></td>
                  <td><code>string</code></td>
                  <td><code>'Write markdown content here...'</code></td>
                  <td>Placeholder text displayed when content is empty</td>
                </tr>
                <tr>
                  <td><code>disabled</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Disable editing and toolbar actions</td>
                </tr>
                <tr>
                  <td><code>readOnly</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Make editor content read-only</td>
                </tr>
                <tr>
                  <td><code>label</code></td>
                  <td><code>string</code></td>
                  <td>—</td>
                  <td>Field label shown above editor</td>
                </tr>
                <tr>
                  <td><code>hint</code></td>
                  <td><code>string</code></td>
                  <td>—</td>
                  <td>Helper message shown below editor</td>
                </tr>
                <tr>
                  <td><code>error</code></td>
                  <td><code>string</code></td>
                  <td>—</td>
                  <td>Validation error message string</td>
                </tr>
                <tr>
                  <td><code>size</code></td>
                  <td><code>'sm' | 'md' | 'lg'</code></td>
                  <td><code>'md'</code></td>
                  <td>Visual size variant</td>
                </tr>
                <tr>
                  <td><code>minHeight</code></td>
                  <td><code>number | string</code></td>
                  <td>—</td>
                  <td>Minimum height of content area</td>
                </tr>
                <tr>
                  <td><code>maxHeight</code></td>
                  <td><code>number | string</code></td>
                  <td>—</td>
                  <td>Maximum height of content area</td>
                </tr>
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
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && scrollTo(section.id)}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
