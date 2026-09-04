import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Badge,
  Icon,
  type BadgeVariant,
  type BadgeSize,
  type PropertyPanelProperty,
  type PropertyPanelValues,
} from 'spruce-react';
import { CodePreview, type CodeFile } from '../../components/CodePreview';
import { DocsPackageBadge } from '../../components/DocsPackageBadge';

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'title', label: 'With Title' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'multi-file', label: 'Multi-file' },
  { id: 'compact', label: 'Compact' },
  { id: 'property-panel', label: 'Property Panel' },
  { id: 'usage', label: 'Usage' },
  { id: 'api', label: 'API' },
];

export function CodePreviewUtilPage() {
  const [activeSection, setActiveSection] = useState('basic');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { threshold: 0.3 }
    );
    const sections = mainRef.current?.querySelectorAll('[id]') ?? [];
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ── Demos State ── */
  const [propertyPanelValues, setPropertyPanelValues] = useState<PropertyPanelValues>({
    label: 'Ready for review',
    variant: 'primary',
    size: 'md',
    pill: true,
  });
  const [propertyPanelOpen, setPropertyPanelOpen] = useState(true);

  const propertyPanelProperties: readonly PropertyPanelProperty[] = useMemo(
    () => [
      {
        name: 'label',
        label: 'Label',
        category: 'Content',
        editor: 'text',
        defaultValue: 'Ready for review',
        description: 'Updates the text projected into the badge.',
      },
      {
        name: 'variant',
        label: 'Variant',
        category: 'Appearance',
        editor: 'select',
        defaultValue: 'primary',
        description: 'Switches the badge color treatment.',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Primary', value: 'primary' },
          { label: 'Success', value: 'success' },
          { label: 'Warning', value: 'warning' },
          { label: 'Danger', value: 'danger' },
          { label: 'Info', value: 'info' },
        ],
      },
      {
        name: 'size',
        label: 'Size',
        category: 'Appearance',
        editor: 'select',
        defaultValue: 'md',
        description: 'Changes the badge size used by the preview.',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
      {
        name: 'pill',
        label: 'Pill',
        category: 'Shape',
        editor: 'boolean',
        defaultValue: true,
        description: 'Rounds the badge into a pill shape.',
      },
    ],
    []
  );

  const badgeLabel =
    typeof propertyPanelValues['label'] === 'string' && propertyPanelValues['label'].trim()
      ? propertyPanelValues['label']
      : 'Ready for review';
  const badgeVariant = (propertyPanelValues['variant'] as BadgeVariant) || 'primary';
  const badgeSize = (propertyPanelValues['size'] as BadgeSize) || 'md';
  const badgePill = propertyPanelValues['pill'] === true;

  const basicCode = `<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="danger">Danger</Badge>`;

  const titleCode = `<Badge>Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="info">Info</Badge>`;

  const tsCode = `import { Badge } from 'spruce-react';

export function ExampleComponent() {
  return <Badge variant="primary">Active</Badge>;
}`;

  const multiFileCode: CodeFile[] = [
    {
      label: 'BadgeDemo.tsx',
      language: 'typescript',
      code: `import { Badge } from 'spruce-react';

export function BadgeDemo() {
  return (
    <div className="badge-demo">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
    </div>
  );
}`,
    },
    {
      label: 'BadgeDemo.css',
      language: 'css',
      code: `.badge-demo {
  display: flex;
  gap: 8px;
  align-items: center;
}`,
    },
  ];

  const compactCode = `<Badge pill variant="success">Online</Badge>`;

  const propertyPanelCode: CodeFile[] = [
    {
      label: 'PropertyPanelDemo.tsx',
      language: 'typescript',
      code: `import { useState } from 'react';
import { Badge, type PropertyPanelValues, type PropertyPanelProperty } from 'spruce-react';
import { CodePreview } from './components/CodePreview';

export function PropertyPanelDemo() {
  const [values, setValues] = useState<PropertyPanelValues>({
    label: 'Ready for review',
    variant: 'primary',
    size: 'md',
    pill: true,
  });

  return (
    <CodePreview
      files={files}
      title="Interactive badge"
      propertyPanelEnabled
      propertyPanelProperties={properties}
      propertyPanelValues={values}
      onPropertyPanelValuesChange={setValues}
    >
      <Badge variant={values.variant} size={values.size} pill={values.pill}>
        {values.label}
      </Badge>
    </CodePreview>
  );
}`,
    },
  ];

  const usageCode = `import { CodePreview } from './components/CodePreview';
import { Badge } from 'spruce-react';

export function MyPage() {
  const code = '<Badge variant="primary">Live preview</Badge>';

  return (
    <CodePreview code={code} language="html">
      <Badge variant="primary">Live preview</Badge>
    </CodePreview>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Code Preview</h1>
        <p className="docs-desc">
          A reusable documentation component that displays a live rendered preview alongside its
          source code with syntax highlighting. Toggle between Preview and Code tabs, and copy
          snippets to the clipboard.
        </p>
        <DocsPackageBadge packageName="spruce-react" symbols={['CodePreview']} />

        {/* Basic */}
        <section id="basic" className="demo-section">
          <h2>Basic</h2>
          <p className="section-desc">
            Wrap any component in <code>&lt;CodePreview&gt;</code> and pass the source via the{' '}
            <code>code</code> prop. Defaults to HTML syntax highlighting.
          </p>
          <CodePreview code={basicCode}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="danger">Danger</Badge>
            </div>
          </CodePreview>
        </section>

        {/* With title */}
        <section id="title" className="demo-section">
          <h2>With Title</h2>
          <p className="section-desc">
            Use the <code>title</code> prop to add a label in the toolbar.
          </p>
          <CodePreview code={titleCode} title="Badge variants">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </CodePreview>
        </section>

        {/* TypeScript */}
        <section id="typescript" className="demo-section">
          <h2>TypeScript Snippets</h2>
          <p className="section-desc">
            Set <code>language="typescript"</code> for component class code. Supports all languages
            from the code editor: <code>html</code>, <code>typescript</code>, <code>css</code>,{' '}
            <code>scss</code>, <code>json</code>, <code>python</code>, and more.
          </p>
          <CodePreview code={tsCode} language="typescript" title="Component setup">
            <div className="inline-note" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="info" size={16} />
              <span>The preview area can show anything—not just the rendered component.</span>
            </div>
          </CodePreview>
        </section>

        {/* Multi-file */}
        <section id="multi-file" className="demo-section">
          <h2>Multi-file</h2>
          <p className="section-desc">
            Use the <code>files</code> prop to display multiple code files with individual tabs.
            Each file has a <code>label</code>, <code>language</code>, and <code>code</code>. The
            copy button always copies the currently visible file.
          </p>
          <CodePreview files={multiFileCode} title="Badge component">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
            </div>
          </CodePreview>
        </section>

        {/* Compact */}
        <section id="compact" className="demo-section">
          <h2>Compact</h2>
          <p className="section-desc">
            Use <code>compact</code> for tighter preview padding, ideal for small inline demos.
          </p>
          <CodePreview code={compactCode} compact>
            <Badge pill variant="success">
              Online
            </Badge>
          </CodePreview>
        </section>

        {/* Property Panel */}
        <section id="property-panel" className="demo-section">
          <h2>Property Panel</h2>
          <p className="section-desc">
            Enable the property panel when a live preview needs adjustable inputs. Bind the panel's
            value bag to your demo state, then read those values from the projected preview.
          </p>
          <CodePreview
            files={propertyPanelCode}
            title="Interactive badge"
            propertyPanelEnabled
            propertyPanelProperties={propertyPanelProperties}
            propertyPanelValues={propertyPanelValues}
            onPropertyPanelValuesChange={setPropertyPanelValues}
            propertyPanelOpen={propertyPanelOpen}
            onPropertyPanelOpenChange={setPropertyPanelOpen}
            propertyPanelWidth={360}
            propertyPanelAriaLabel="Badge preview properties"
          >
            <div style={{ display: 'grid', placeItems: 'center', minHeight: 220 }}>
              <Badge variant={badgeVariant} size={badgeSize} pill={badgePill}>
                {badgeLabel}
              </Badge>
            </div>
          </CodePreview>
        </section>

        {/* Usage */}
        <section id="usage" className="demo-section">
          <h2>Usage</h2>
          <p className="section-desc">
            Import <code>CodePreview</code> from the components directory and wrap your live preview.
          </p>
          <CodePreview code={usageCode} language="typescript" title="Page component setup">
            <div className="inline-note" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="check-circle" size={16} />
              <span>
                That's all you need. Project the live demo as children, pass the code string
                separately.
              </span>
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
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>code</code></td>
                  <td><code>string</code></td>
                  <td>&mdash;</td>
                  <td>
                    Single-file source code to display. Use <code>files</code> instead for
                    multi-file scenarios
                  </td>
                </tr>
                <tr>
                  <td><code>language</code></td>
                  <td><code>CodeLanguage</code></td>
                  <td><code>'html'</code></td>
                  <td>
                    Syntax highlighting language when using <code>code</code> (html, typescript,
                    css, scss, json, python, sql, csharp, markdown, javascript)
                  </td>
                </tr>
                <tr>
                  <td><code>files</code></td>
                  <td><code>CodeFile[]</code></td>
                  <td>&mdash;</td>
                  <td>
                    Array of files for multi-file display. Each file has <code>label</code>,
                    <code>language</code>, and <code>code</code>. Takes precedence over
                    <code>code</code>
                  </td>
                </tr>
                <tr>
                  <td><code>title</code></td>
                  <td><code>string</code></td>
                  <td>&mdash;</td>
                  <td>Optional label shown in the toolbar</td>
                </tr>
                <tr>
                  <td><code>compact</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Reduces preview padding for small demos</td>
                </tr>
                <tr>
                  <td><code>codeOnly</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Shows only the code panel and hides Preview/Code toolbar tabs</td>
                </tr>
                <tr>
                  <td><code>propertyPanelEnabled</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Shows a Properties toolbar action when properties are provided</td>
                </tr>
                <tr>
                  <td><code>propertyPanelProperties</code></td>
                  <td><code>readonly PropertyPanelProperty[]</code></td>
                  <td><code>[]</code></td>
                  <td>Property metadata rendered by the preview's side panel</td>
                </tr>
                <tr>
                  <td><code>propertyPanelAriaLabel</code></td>
                  <td><code>string</code></td>
                  <td><code>'Preview properties'</code></td>
                  <td>Accessible label for the embedded property panel</td>
                </tr>
                <tr>
                  <td><code>propertyPanelMinWidth</code></td>
                  <td><code>number</code></td>
                  <td><code>280</code></td>
                  <td>Minimum resizable width for the property panel in pixels</td>
                </tr>
                <tr>
                  <td><code>propertyPanelMaxWidth</code></td>
                  <td><code>number</code></td>
                  <td><code>520</code></td>
                  <td>Maximum resizable width for the property panel in pixels</td>
                </tr>
                <tr>
                  <td><code>propertyPanelOpen</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Controls whether the property panel is visible beside the preview</td>
                </tr>
                <tr>
                  <td><code>propertyPanelValues</code></td>
                  <td><code>PropertyPanelValues</code></td>
                  <td><code>&#123;&#125;</code></td>
                  <td>Value bag edited by the embedded property panel</td>
                </tr>
                <tr>
                  <td><code>propertyPanelMode</code></td>
                  <td><code>'categorized' | 'alphabetical'</code></td>
                  <td><code>'categorized'</code></td>
                  <td>Controls category grouping inside the property panel</td>
                </tr>
                <tr>
                  <td><code>propertyPanelCollapsedGroups</code></td>
                  <td><code>PropertyPanelCollapsedGroups</code></td>
                  <td><code>&#123;&#125;</code></td>
                  <td>Tracks collapsed property groups for categorized mode</td>
                </tr>
                <tr>
                  <td><code>propertyPanelWidth</code></td>
                  <td><code>number</code></td>
                  <td><code>420</code></td>
                  <td>Resizable property panel width in pixels</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Features</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Syntax highlighting</td>
                  <td>
                    Powered by <code>DocsCodeViewer</code> with line numbers and theme token colors
                  </td>
                </tr>
                <tr>
                  <td>Copy to clipboard</td>
                  <td>
                    One-click copy button with visual confirmation; copies the currently active file
                  </td>
                </tr>
                <tr>
                  <td>Tab switching</td>
                  <td>Toggle between rendered Preview and source Code views</td>
                </tr>
                <tr>
                  <td>Multi-file tabs</td>
                  <td>
                    Pass <code>files</code> to display per-file tabs inside the code view (e.g.
                    HTML, TypeScript, SCSS)
                  </td>
                </tr>
                <tr>
                  <td>Multi-language</td>
                  <td>Supports multiple languages via built-in tokenizer</td>
                </tr>
                <tr>
                  <td>Property panel</td>
                  <td>
                    Attach a resizable side panel to the Preview tab for interactive demo controls
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Table of Contents */}
      <nav className="features-toc" aria-label="On this page">
        <p className="features-toc__title">ON THIS PAGE</p>
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
