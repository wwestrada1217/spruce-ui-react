import { useState, useEffect, useRef } from 'react';
import { BlockEditor, type BlockItem } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const BASIC_CODE = `import { BlockEditor } from 'spruce-react';

<BlockEditor
  onChange={(blocks) => console.log(blocks)}
/>`;

const CONTROLLED_CODE = `import { useState } from 'react';
import { BlockEditor, BlockItem } from 'spruce-react';

const INITIAL_BLOCKS: BlockItem[] = [
  { id: 'b1', type: 'h1', content: 'Product Documentation Plan' },
  { id: 'b2', type: 'paragraph', content: 'This block document defines our core architecture and components.' },
  { id: 'b3', type: 'callout', content: 'Note: All components adhere to Spruce design tokens.', metadata: { calloutType: 'info' } },
  { id: 'b4', type: 'code', content: 'npm install spruce-react' },
];

function ControlledDemo() {
  const [blocks, setBlocks] = useState<BlockItem[]>(INITIAL_BLOCKS);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      <BlockEditor blocks={blocks} onChange={setBlocks} />
      <div style={{ padding: 12, background: 'var(--sp-surface-100)', borderRadius: 8, fontSize: 13 }}>
        <strong>Blocks JSON Data ({blocks.length} blocks):</strong>
        <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap', fontSize: 12 }}>
          {JSON.stringify(blocks, null, 2)}
        </pre>
      </div>
    </div>
  );
}`;

const SIZES_CODE = `import { BlockEditor } from 'spruce-react';

<BlockEditor size="sm" label="Small Block Editor" />
<BlockEditor size="md" label="Medium Block Editor" />
<BlockEditor size="lg" label="Large Block Editor" />`;

const DISABLED_CODE = `import { BlockEditor } from 'spruce-react';

<BlockEditor disabled label="Disabled Block Editor" />
<BlockEditor readOnly label="Read-only Block Editor" />`;

const ERROR_CODE = `import { BlockEditor } from 'spruce-react';

<BlockEditor
  error="At least one content block is required."
/>`;

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: 'basic',      label: 'Basic Editor' },
  { id: 'controlled', label: 'Controlled Blocks' },
  { id: 'sizes',      label: 'Sizes' },
  { id: 'disabled',   label: 'Disabled & Readonly' },
  { id: 'error',      label: 'With Error' },
  { id: 'api',        label: 'API' },
];

const INITIAL_BLOCKS: BlockItem[] = [
  { id: 'b1', type: 'h1', content: 'Product Documentation Plan' },
  { id: 'b2', type: 'paragraph', content: 'This block document defines our core architecture and components.' },
  { id: 'b3', type: 'callout', content: 'Note: All components adhere to Spruce design tokens.', metadata: { calloutType: 'info' } },
  { id: 'b4', type: 'code', content: 'npm install spruce-react' },
];

export function BlockEditorPage() {
  const [activeSection, setActiveSection] = useState('basic');
  const [blocks, setBlocks] = useState<BlockItem[]>(INITIAL_BLOCKS);
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
        <h1>Block Editor</h1>
        <p className="docs-desc">
          A block-based content editor for building modular document layouts with paragraphs, headings, callouts, code blocks, dividers, and reordering tools.
        </p>

        {/* Basic Editor */}
        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic Editor</h2>
          <p className="section-desc">Default block editor with interactive block list and type selectors.</p>
          <CodePreview code={BASIC_CODE} language="typescript">
            <BlockEditor />
          </CodePreview>
        </section>

        {/* Controlled Blocks */}
        <section id="controlled" className="demo-section" aria-labelledby="controlled-heading">
          <h2 id="controlled-heading">Controlled Blocks</h2>
          <p className="section-desc">Bind state to <code>blocks</code> and <code>onChange</code> to manage structured document block objects.</p>
          <CodePreview code={CONTROLLED_CODE} language="typescript">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
              <BlockEditor blocks={blocks} onChange={setBlocks} />
              <div style={{ padding: 12, background: 'var(--sp-surface-100, #e9eef5)', borderRadius: 8, fontSize: 13 }}>
                <strong>Blocks JSON Data ({blocks.length} blocks):</strong>
                <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap', fontSize: 12 }}>
                  {JSON.stringify(blocks, null, 2)}
                </pre>
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
              <BlockEditor size="sm" label="Small Block Editor" />
              <BlockEditor size="md" label="Medium Block Editor" />
              <BlockEditor size="lg" label="Large Block Editor" />
            </div>
          </CodePreview>
        </section>

        {/* Disabled & Readonly */}
        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled &amp; Readonly</h2>
          <p className="section-desc">Prevent editing using <code>disabled</code> or <code>readOnly</code> props.</p>
          <CodePreview code={DISABLED_CODE} language="typescript">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
              <BlockEditor disabled label="Disabled Block Editor" />
              <BlockEditor readOnly label="Read-only Block Editor" />
            </div>
          </CodePreview>
        </section>

        {/* With Error */}
        <section id="error" className="demo-section" aria-labelledby="error-heading">
          <h2 id="error-heading">With Error</h2>
          <p className="section-desc">Display validation error state using the <code>error</code> prop.</p>
          <CodePreview code={ERROR_CODE} language="typescript">
            <BlockEditor error="At least one content block is required." />
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
                  <td><code>blocks</code></td>
                  <td><code>BlockItem[]</code></td>
                  <td>—</td>
                  <td>Array of content block objects</td>
                </tr>
                <tr>
                  <td><code>onChange</code></td>
                  <td><code>(blocks: BlockItem[]) =&gt; void</code></td>
                  <td>—</td>
                  <td>Callback emitted when blocks are modified, reordered, added, or deleted</td>
                </tr>
                <tr>
                  <td><code>placeholder</code></td>
                  <td><code>string</code></td>
                  <td><code>'Type block content...'</code></td>
                  <td>Placeholder text for new block inputs</td>
                </tr>
                <tr>
                  <td><code>disabled</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Disable editing and block actions</td>
                </tr>
                <tr>
                  <td><code>readOnly</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Make block content read-only</td>
                </tr>
                <tr>
                  <td><code>label</code></td>
                  <td><code>string</code></td>
                  <td>—</td>
                  <td>Field label shown above block editor</td>
                </tr>
                <tr>
                  <td><code>hint</code></td>
                  <td><code>string</code></td>
                  <td>—</td>
                  <td>Helper message shown below block editor</td>
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
