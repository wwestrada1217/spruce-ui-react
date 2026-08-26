import { useState, useEffect, useRef } from 'react';
import { Editor } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const BASIC_CODE = `import { Editor } from 'spruce-react';

<Editor
  placeholder="Type your content here..."
  onChange={(html) => console.log(html)}
/>`;

const RICH_FORMATTING_CODE = `import { useState } from 'react';
import { Editor } from 'spruce-react';

const RICH_HTML = \`
  <h1>Spruce Rich Text Editor</h1>
  <p>Format text with <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strikethrough</s>, <sub>subscript</sub> (H<sub>2</sub>O), and <sup>superscript</sup> (E = mc<sup>2</sup>).</p>
  <hr />
  <blockquote>"Design is not just what it looks like and feels like. Design is how it works."</blockquote>
  <ul>
    <li>Bullet list item 1</li>
    <li>Bullet list item 2</li>
  </ul>
  <ol>
    <li>First step</li>
    <li>Second step</li>
  </ol>
  <pre><code>console.log("Hello from Spruce Editor!");</code></pre>
\`;

<Editor value={RICH_HTML} />`;

const CONTROLLED_CODE = `import { useState } from 'react';
import { Editor } from 'spruce-react';

function ControlledDemo() {
  const [content, setContent] = useState('<h1>Welcome to Spruce Editor</h1><p>Start editing this rich text content...</p>');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Editor value={content} onChange={setContent} />
      <div style={{ padding: 12, background: 'var(--sp-surface-100)', borderRadius: 8 }}>
        <strong>HTML Output:</strong>
        <code style={{ display: 'block', whiteSpace: 'pre-wrap', marginTop: 8, fontSize: 12 }}>
          {content}
        </code>
      </div>
    </div>
  );
}`;

const SIZES_CODE = `import { Editor } from 'spruce-react';

<Editor size="sm" placeholder="Small editor" minHeight={80} />
<Editor size="md" placeholder="Medium editor" minHeight={120} />
<Editor size="lg" placeholder="Large editor" minHeight={180} />`;

const HEIGHTS_CODE = `import { Editor } from 'spruce-react';

<Editor
  minHeight={250}
  maxHeight={400}
  placeholder="Editor with custom min and max height..."
/>`;

const DISABLED_CODE = `import { Editor } from 'spruce-react';

<Editor disabled value="<p>This editor content is disabled.</p>" />
<Editor readOnly value="<p>This editor content is read-only.</p>" />`;

const ERROR_CODE = `import { Editor } from 'spruce-react';

<Editor
  error="Content is required and must contain at least 20 characters."
/>`;

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: 'basic',      label: 'Basic Editor' },
  { id: 'formatting', label: 'Rich Formatting' },
  { id: 'controlled', label: 'Controlled Value' },
  { id: 'sizes',      label: 'Sizes' },
  { id: 'heights',    label: 'Custom Heights' },
  { id: 'disabled',   label: 'Disabled & Readonly' },
  { id: 'error',      label: 'With Error' },
  { id: 'api',        label: 'API' },
];

const RICH_SAMPLE_HTML = `
  <h1>Spruce Rich Text Editor</h1>
  <p>Format text with <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strikethrough</s>, <sub>subscript</sub> (H<sub>2</sub>O), and <sup>superscript</sup> (E = mc<sup>2</sup>).</p>
  <hr />
  <blockquote>"Design is not just what it looks like and feels like. Design is how it works."</blockquote>
  <ul>
    <li>Bullet list item 1</li>
    <li>Bullet list item 2</li>
  </ul>
  <ol>
    <li>First step</li>
    <li>Second step</li>
  </ol>
  <pre><code>console.log("Hello from Spruce Editor!");</code></pre>
  <p><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80" alt="Dashboard demo" /></p>
`.trim();

export function EditorPage() {
  const [activeSection, setActiveSection] = useState('basic');
  const [content, setContent] = useState(
    '<h1>Welcome to Spruce Editor</h1><p>A powerful, lightweight HTML editor with formatting tools, lists, links, images, blockquotes, codeblocks, superscripts/subscripts, and source view.</p>',
  );
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
        <h1>Editor</h1>
        <p className="docs-desc">
          A rich HTML / WYSIWYG text editor component with full formatting toolbar, superscript, subscript, text &amp; highlight colors, bullet/numbered lists, blockquotes, codeblocks, images, horizontal rules, and HTML source view.
        </p>

        {/* Basic Editor */}
        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic Editor</h2>
          <p className="section-desc">Default rich text editor with interactive formatting toolbar.</p>
          <CodePreview code={BASIC_CODE} language="typescript">
            <Editor placeholder="Type your content here..." />
          </CodePreview>
        </section>

        {/* Rich Formatting */}
        <section id="formatting" className="demo-section" aria-labelledby="formatting-heading">
          <h2 id="formatting-heading">Rich Formatting</h2>
          <p className="section-desc">Supports superscripts, subscripts, text &amp; highlight colors, bullet/numbered lists, blockquotes, codeblocks, images, and horizontal rules.</p>
          <CodePreview code={RICH_FORMATTING_CODE} language="typescript">
            <Editor value={RICH_SAMPLE_HTML} minHeight={260} />
          </CodePreview>
        </section>

        {/* Controlled Value */}
        <section id="controlled" className="demo-section" aria-labelledby="controlled-heading">
          <h2 id="controlled-heading">Controlled Value</h2>
          <p className="section-desc">Bind state to <code>value</code> and <code>onChange</code> to manage and display raw HTML content.</p>
          <CodePreview code={CONTROLLED_CODE} language="typescript">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
              <Editor value={content} onChange={setContent} />
              <div style={{ padding: 12, background: 'var(--sp-surface-100, #e9eef5)', borderRadius: 8, fontSize: 13 }}>
                <strong>HTML Output:</strong>
                <code style={{ display: 'block', whiteSpace: 'pre-wrap', marginTop: 8, fontSize: 12 }}>
                  {content}
                </code>
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
              <Editor size="sm" placeholder="Small editor..." minHeight={80} />
              <Editor size="md" placeholder="Medium editor..." minHeight={120} />
              <Editor size="lg" placeholder="Large editor..." minHeight={180} />
            </div>
          </CodePreview>
        </section>

        {/* Custom Heights */}
        <section id="heights" className="demo-section" aria-labelledby="heights-heading">
          <h2 id="heights-heading">Custom Heights</h2>
          <p className="section-desc">Control vertical bounds using <code>minHeight</code> and <code>maxHeight</code>.</p>
          <CodePreview code={HEIGHTS_CODE} language="typescript">
            <Editor minHeight={200} maxHeight={350} placeholder="Editor with min/max height..." />
          </CodePreview>
        </section>

        {/* Disabled & Readonly */}
        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled &amp; Readonly</h2>
          <p className="section-desc">Prevent editing using <code>disabled</code> or <code>readOnly</code> props.</p>
          <CodePreview code={DISABLED_CODE} language="typescript">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
              <Editor disabled label="Disabled Editor" value="<p>This editor content is disabled.</p>" />
              <Editor readOnly label="Read-only Editor" value="<p>This editor content is read-only.</p>" />
            </div>
          </CodePreview>
        </section>

        {/* With Error */}
        <section id="error" className="demo-section" aria-labelledby="error-heading">
          <h2 id="error-heading">With Error</h2>
          <p className="section-desc">Display validation error state using the <code>error</code> prop.</p>
          <CodePreview code={ERROR_CODE} language="typescript">
            <Editor error="Content is required and must contain at least 20 characters." />
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
                  <td>HTML content string value</td>
                </tr>
                <tr>
                  <td><code>content</code></td>
                  <td><code>string</code></td>
                  <td>—</td>
                  <td>Angular-parity alias for the controlled HTML content value</td>
                </tr>
                <tr>
                  <td><code>onChange</code></td>
                  <td><code>(value: string) =&gt; void</code></td>
                  <td>—</td>
                  <td>Callback emitted when HTML content changes</td>
                </tr>
                <tr>
                  <td><code>placeholder</code></td>
                  <td><code>string</code></td>
                  <td><code>'Write content here...'</code></td>
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
                <tr>
                  <td><code>hideToolbar</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Hide top formatting toolbar</td>
                </tr>
                <tr>
                  <td><code>mentionItems</code>, <code>mentionTrigger</code></td>
                  <td><code>MentionItem[]</code>, <code>string</code></td>
                  <td><code>[]</code>, <code>'@'</code></td>
                  <td>Show keyboard-navigable mention suggestions when the trigger is typed</td>
                </tr>
                <tr>
                  <td><code>onMention</code>, <code>onMentionSearch</code></td>
                  <td><code>callback</code></td>
                  <td>—</td>
                  <td>Receive the selected item/range and the current query for async filtering</td>
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
