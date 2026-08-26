import { useState, useEffect, useCallback } from 'react';
import { CodeEditor } from 'spruce-react';
import type { CodeLanguage } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

// ── Language samples ──────────────────────────────────────────────────────────

const TS_SAMPLE = `import { useState, useCallback } from 'react';

interface CounterProps {
  initialCount?: number;
}

export function Counter({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  const increment = useCallback(() => {
    setCount(v => v + 1);
  }, []);

  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
}`;

const HTML_SAMPLE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Hello World</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main id="app">
    <h1>Hello, World!</h1>
    <p class="description">Welcome to the app.</p>
  </main>
  <script src="main.js"></script>
</body>
</html>`;

const CSS_SAMPLE = `:root {
  --primary: #3b82f6;
  --bg: #0f172a;
}

.container {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: var(--bg);
  border-radius: 8px;
}

.container > .title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary);
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}`;

const JSON_SAMPLE = `{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}`;

const SQL_SAMPLE = `SELECT
  u.id,
  u.username,
  COUNT(o.id) AS order_count,
  SUM(o.total) AS total_spent
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at >= '2024-01-01'
  AND u.active = TRUE
GROUP BY u.id, u.username
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT 10;`;

const PYTHON_SAMPLE = `from dataclasses import dataclass
from typing import Optional

@dataclass
class User:
    name: str
    email: str
    age: Optional[int] = None

    def greet(self) -> str:
        return f"Hello, {self.name}!"

users = [
    User("Alice", "alice@example.com", 30),
    User("Bob", "bob@example.com"),
]

for user in users:
    print(user.greet())`;

const CSHARP_SAMPLE = `using System;
using System.Linq;

namespace MyApp.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }

        public string GetDisplayName()
        {
            return $"{Name} - {Price:C}";
        }
    }
}`;

const MARKDOWN_SAMPLE = `# Project README

## Getting Started

Install the dependencies:

\`\`\`bash
npm install
\`\`\`

### Features

- **Fast** - Optimized for performance
- **Simple** - Easy to use API
- *Flexible* - Works with any framework

> Note: Requires Node.js 18 or higher.`;

const LANGUAGE_SAMPLES: Record<string, string> = {
  typescript: TS_SAMPLE,
  javascript: TS_SAMPLE,
  html: HTML_SAMPLE,
  css: CSS_SAMPLE,
  scss: CSS_SAMPLE,
  json: JSON_SAMPLE,
  sql: SQL_SAMPLE,
  python: PYTHON_SAMPLE,
  csharp: CSHARP_SAMPLE,
  markdown: MARKDOWN_SAMPLE,
};

const SUPPORTED_LANGUAGES: CodeLanguage[] = [
  'typescript', 'javascript', 'html', 'css', 'scss',
  'json', 'sql', 'python', 'csharp', 'markdown',
];

// ── Code usage snippets ───────────────────────────────────────────────────────

const BASIC_USAGE_CODE = `import { useState } from 'react';
import { CodeEditor } from 'spruce-react';

export function MyEditor() {
  const [code, setCode] = useState('');

  return (
    <CodeEditor
      code={code}
      language="typescript"
      onCodeChange={setCode}
    />
  );
}`;

const READONLY_USAGE_CODE = `<CodeEditor
  code={sourceCode}
  language="typescript"
  readonly
/>`;

const NO_LINE_NUMBERS_USAGE_CODE = `<CodeEditor
  code={jsonData}
  language="json"
  showLineNumbers={false}
  readonly
/>`;

const PLACEHOLDER_USAGE_CODE = `<CodeEditor
  code={code}
  placeholder="Start typing your code here..."
  language="typescript"
  onCodeChange={setCode}
/>`;

const CONSTRAINED_USAGE_CODE = `<CodeEditor
  code={pythonCode}
  language="python"
  readonly
  minHeight="100px"
  maxHeight="200px"
/>`;

const TAB_SIZE_USAGE_CODE = `{/* 2 spaces (default) */}
<CodeEditor
  code=""
  language="typescript"
  tabSize={2}
  placeholder="Press Tab here..."
  minHeight="80px"
/>

{/* 4 spaces */}
<CodeEditor
  code=""
  language="typescript"
  tabSize={4}
  placeholder="Press Tab here..."
  minHeight="80px"
/>`;

// ── Section list ──────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'basic',          label: 'Basic' },
  { id: 'languages',      label: 'Languages' },
  { id: 'readonly',       label: 'Read-only' },
  { id: 'no-line-numbers',label: 'No Line Numbers' },
  { id: 'placeholder',    label: 'Placeholder' },
  { id: 'constrained',    label: 'Constrained Height' },
  { id: 'tab-size',       label: 'Tab Size' },
  { id: 'interactive',    label: 'Interactive Playground' },
  { id: 'api',            label: 'API' },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export function CodeEditorPage() {
  const [activeSection, setActiveSection] = useState('basic');

  // Basic demo
  const [basicCode, setBasicCode] = useState(TS_SAMPLE);

  // Languages demo
  const [previewLang, setPreviewLang] = useState<CodeLanguage>('typescript');

  // Placeholder demo
  const [placeholderCode, setPlaceholderCode] = useState('');

  // Interactive playground
  const [interactiveLang, setInteractiveLang] = useState<CodeLanguage>('typescript');
  const [interactiveCode, setInteractiveCode] = useState(TS_SAMPLE);
  const [interactiveReadonly, setInteractiveReadonly] = useState(false);
  const [interactiveLineNumbers, setInteractiveLineNumbers] = useState(true);
  const [interactiveTabSize, setInteractiveTabSize] = useState(2);

  const handleInteractiveLangChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as CodeLanguage;
    setInteractiveLang(lang);
    setInteractiveCode(LANGUAGE_SAMPLES[lang] ?? '');
  }, []);

  // Intersection observer for TOC
  useEffect(() => {
    const scrollContainer = document.getElementById('main-content');

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollContainer) {
          const atBottom = Math.abs(scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) < 2;
          if (atBottom) {
            setActiveSection(SECTIONS[SECTIONS.length - 1].id);
            return;
          }
        }
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { root: scrollContainer ?? null, rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    );

    for (const section of SECTIONS) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    const onScroll = () => {
      if (!scrollContainer) return;
      if (Math.abs(scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) < 2) {
        setActiveSection(SECTIONS[SECTIONS.length - 1].id);
      }
    };
    scrollContainer?.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      scrollContainer?.removeEventListener('scroll', onScroll);
    };
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Code Editor</h1>
        <p className="docs-desc">
          A lightweight code editor with syntax highlighting, line numbers, tab indentation, and support
          for 10 languages. Zero external dependencies &mdash; uses a custom tokenizer and{' '}
          <code>textarea</code> overlay pattern for native keyboard handling.
        </p>

        {/* Basic */}
        <section id="basic" className="demo-section">
          <h2>Basic</h2>
          <p className="section-desc">Editable TypeScript editor with default settings.</p>
          <CodePreview code={BASIC_USAGE_CODE} language="typescript">
            <CodeEditor
              code={basicCode}
              language="typescript"
              onCodeChange={setBasicCode}
            />
          </CodePreview>
        </section>

        {/* Languages */}
        <section id="languages" className="demo-section">
          <h2>Languages</h2>
          <p className="section-desc">
            Syntax highlighting for all {SUPPORTED_LANGUAGES.length} supported languages.
            Pick one to preview.
          </p>
          <CodePreview codeOnly code={`<CodeEditor code={code} language="${previewLang}" readonly />`} language="typescript">
            <div className="ce-lang-picker">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  className={`ce-lang-chip${previewLang === lang ? ' ce-lang-chip--active' : ''}`}
                  onClick={() => setPreviewLang(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
            <CodeEditor
              code={LANGUAGE_SAMPLES[previewLang] ?? ''}
              language={previewLang}
              readonly
              maxHeight="320px"
            />
          </CodePreview>
        </section>

        {/* Readonly */}
        <section id="readonly" className="demo-section">
          <h2>Read-only</h2>
          <p className="section-desc">
            When <code>readonly</code> is set, the textarea is removed and the highlighted code is directly selectable and copyable.
          </p>
          <CodePreview code={READONLY_USAGE_CODE} language="typescript">
            <CodeEditor
              code={TS_SAMPLE}
              language="typescript"
              readonly
            />
          </CodePreview>
        </section>

        {/* No Line Numbers */}
        <section id="no-line-numbers" className="demo-section">
          <h2>No Line Numbers</h2>
          <p className="section-desc">Hide the line number gutter for a cleaner look.</p>
          <CodePreview code={NO_LINE_NUMBERS_USAGE_CODE} language="typescript">
            <CodeEditor
              code={JSON_SAMPLE}
              language="json"
              showLineNumbers={false}
              readonly
            />
          </CodePreview>
        </section>

        {/* Placeholder */}
        <section id="placeholder" className="demo-section">
          <h2>Placeholder</h2>
          <p className="section-desc">Shows placeholder text when the editor is empty.</p>
          <CodePreview code={PLACEHOLDER_USAGE_CODE} language="typescript">
            <CodeEditor
              code={placeholderCode}
              placeholder="Start typing your code here..."
              language="typescript"
              onCodeChange={setPlaceholderCode}
            />
          </CodePreview>
        </section>

        {/* Constrained Height */}
        <section id="constrained" className="demo-section">
          <h2>Constrained Height</h2>
          <p className="section-desc">
            Use <code>minHeight</code> and <code>maxHeight</code> to create a scrollable editor area.
          </p>
          <CodePreview code={CONSTRAINED_USAGE_CODE} language="typescript">
            <CodeEditor
              code={PYTHON_SAMPLE}
              language="python"
              readonly
              minHeight="100px"
              maxHeight="200px"
            />
          </CodePreview>
        </section>

        {/* Tab Size */}
        <section id="tab-size" className="demo-section">
          <h2>Tab Size</h2>
          <p className="section-desc">
            Configure the number of spaces inserted when pressing Tab. Try pressing Tab in each editor below.
          </p>
          <CodePreview code={TAB_SIZE_USAGE_CODE} language="typescript">
            <div className="ce-tab-demos">
              <div className="ce-tab-demo-item">
                <span className="ce-tab-demo-label">2 spaces (default)</span>
                <CodeEditor code="" language="typescript" tabSize={2} placeholder="Press Tab here..." minHeight="80px" />
              </div>
              <div className="ce-tab-demo-item">
                <span className="ce-tab-demo-label">4 spaces</span>
                <CodeEditor code="" language="typescript" tabSize={4} placeholder="Press Tab here..." minHeight="80px" />
              </div>
            </div>
          </CodePreview>
        </section>

        {/* Interactive Playground */}
        <section id="interactive" className="demo-section">
          <h2>Interactive Playground</h2>
          <p className="section-desc">Configure all options and see the editor update in real time.</p>
          <CodePreview codeOnly code={`<CodeEditor\n  code={code}\n  language="${interactiveLang}"\n  readonly={${interactiveReadonly}}\n  showLineNumbers={${interactiveLineNumbers}}\n  tabSize={${interactiveTabSize}}\n  onCodeChange={setCode}\n/>`} language="typescript">
            <div className="ce-playground">
              <div className="ce-playground__editor">
                <CodeEditor
                  code={interactiveCode}
                  language={interactiveLang}
                  readonly={interactiveReadonly}
                  showLineNumbers={interactiveLineNumbers}
                  tabSize={interactiveTabSize}
                  onCodeChange={setInteractiveCode}
                />
              </div>
              <div className="ce-playground__controls">
                <div className="ce-control-row">
                  <label className="ce-control-label" htmlFor="pg-language">Language</label>
                  <select
                    id="pg-language"
                    className="ce-control-select"
                    value={interactiveLang}
                    onChange={handleInteractiveLangChange}
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div className="ce-control-row">
                  <label className="ce-control-label" htmlFor="pg-tab-size">Tab Size</label>
                  <select
                    id="pg-tab-size"
                    className="ce-control-select"
                    value={interactiveTabSize}
                    onChange={(e) => setInteractiveTabSize(Number(e.target.value))}
                  >
                    <option value={2}>2</option>
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                  </select>
                </div>
                <label className="ce-control-check">
                  <input
                    type="checkbox"
                    checked={interactiveReadonly}
                    onChange={() => setInteractiveReadonly((v) => !v)}
                  />
                  Read-only
                </label>
                <label className="ce-control-check">
                  <input
                    type="checkbox"
                    checked={interactiveLineNumbers}
                    onChange={() => setInteractiveLineNumbers((v) => !v)}
                  />
                  Line Numbers
                </label>
              </div>
            </div>
          </CodePreview>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>code</code></td><td><code>string</code></td><td><code>''</code></td><td>The code content to display or edit</td></tr>
                <tr><td><code>language</code></td><td><code>CodeLanguage</code></td><td><code>'typescript'</code></td><td>Language for syntax highlighting</td></tr>
                <tr><td><code>readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables editing; highlighted code becomes selectable</td></tr>
                <tr><td><code>showLineNumbers</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Toggle line number gutter visibility</td></tr>
                <tr><td><code>tabSize</code></td><td><code>number</code></td><td><code>2</code></td><td>Number of spaces inserted on Tab key press</td></tr>
                <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>''</code></td><td>Placeholder text shown when the editor is empty</td></tr>
                <tr><td><code>minHeight</code></td><td><code>string | number</code></td><td><code>'200px'</code></td><td>Minimum height of the editor area</td></tr>
                <tr><td><code>maxHeight</code></td><td><code>string | number</code></td><td><code>'none'</code></td><td>Maximum height; enables vertical scrolling</td></tr>
                <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>'Code editor'</code></td><td>Accessible label for the textarea</td></tr>
                <tr><td><code>onCodeChange</code></td><td><code>(code: string) =&gt; void</code></td><td>—</td><td>Callback fired on every code change</td></tr>
                <tr><td><code>showMinimap</code>, <code>diagnostics</code></td><td><code>boolean</code>, <code>SpCodeEditorDiagnostic[]</code></td><td><code>true</code>, <code>[]</code></td><td>Configure the minimap and accessible diagnostic status messages</td></tr>
                <tr><td><code>completionItems</code>, <code>hoverInfo</code>, <code>signatureHelp</code></td><td><code>CompletionItem[]</code>, <code>HoverInfo</code>, <code>SignatureHelp</code></td><td>—</td><td>Controlled language-service surfaces; request callbacks provide async integration points</td></tr>
                <tr><td><code>decorations</code>, <code>viewZones</code>, <code>collapsibleRanges</code></td><td><code>array</code></td><td><code>[]</code></td><td>Render line decorations, reserved view-zone space, and folding metadata</td></tr>
                <tr><td><code>onStatusChange</code>, <code>onScrollChange</code></td><td><code>callback</code></td><td>—</td><td>Receive cursor/status and scroll updates without subscribing to Angular services</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Supported Languages</h3>
          <div className="ce-lang-list">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <code key={lang} className="ce-lang-tag">{lang}</code>
            ))}
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
