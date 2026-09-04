import { useState, useEffect, useRef } from 'react';
import { Button } from 'spruce-react';
import type { PropertyPanelProperty } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { DocsPackageBadge } from '../../components/DocsPackageBadge';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'codepreview', label: 'Code Preview' },
  { id: 'api',         label: 'API' },
];

const PROPERTY_PANEL_PROPERTIES: readonly PropertyPanelProperty[] = [
  { name: 'accent', label: 'Accent', category: 'Appearance', editor: 'color', value: '#2563eb' },
  { name: 'density', label: 'Density', category: 'Appearance', editor: 'select', value: 'comfortable', options: [{ label: 'Comfortable', value: 'comfortable' }, { label: 'Compact', value: 'compact' }] },
  { name: 'showIcon', label: 'Show icon', category: 'Content', editor: 'boolean', value: true },
];

export function CodePreviewUtilPage() {
  const [activeSection, setActiveSection] = useState('codepreview');
  const [propertyPanelValues, setPropertyPanelValues] = useState<Record<string, string | number | boolean | null>>({});
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

  const EXAMPLE_CODE = `import { Button } from 'spruce-react';

export function Example() {
  return <Button variant="primary">Click Me</Button>;
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Code Preview Utility</h1>
        <p className="docs-desc">
          Interactive component preview container with toggleable syntax-highlighted source code view.
        </p>
        <DocsPackageBadge packageName="spruce-react" symbols={['CodePreview']} />

        <section id="codepreview" className="demo-section">
          <h2>Code Preview Showcase</h2>
          <CodePreview title="Live preview" code={EXAMPLE_CODE} language="typescript">
            <div style={{ padding: 16 }}>
              <Button variant="primary">Click Me</Button>
            </div>
          </CodePreview>
          <CodePreview
            title="Multi-file example"
            files={[
              { label: 'Example.tsx', language: 'typescript', code: EXAMPLE_CODE },
              { label: 'Example.css', language: 'css', code: '.example { display: grid; gap: 12px; }' },
            ]}
          >
            <div className="demo-row"><Button variant="outline">Multi-file preview</Button></div>
          </CodePreview>
          <CodePreview
            title="Property inspector"
            code={`<CodePreview\n  propertyPanelEnabled\n  propertyPanelProperties={properties}\n>\n  <Button>Adjust me</Button>\n</CodePreview>`}
            propertyPanelEnabled
            propertyPanelProperties={PROPERTY_PANEL_PROPERTIES}
            propertyPanelOpen
            propertyPanelValues={propertyPanelValues}
            onPropertyPanelValuesChange={setPropertyPanelValues}
          >
            <div className="demo-row"><Button variant="primary">Adjust me</Button></div>
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
                <tr><td><code>code</code></td><td><code>string</code></td><td><code>''</code></td><td>Source code snippet string for the single-file shorthand</td></tr>
                <tr><td><code>language</code></td><td><code>CodeLanguage</code></td><td><code>'typescript'</code></td><td>Syntax language. Use <code>typescript</code> for TSX examples.</td></tr>
                <tr><td><code>files</code></td><td><code>CodeFile[]</code></td><td>—</td><td>Multi-file source tabs; overrides <code>code</code> and <code>language</code>.</td></tr>
                <tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>Optional toolbar caption.</td></tr>
                <tr><td><code>compact</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Reduces preview padding.</td></tr>
                <tr><td><code>codeOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows source without a live preview tab.</td></tr>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Rendered live preview content.</td></tr>
                <tr><td><code>propertyPanelEnabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enables the inspector toggle when properties are supplied.</td></tr>
                <tr><td><code>propertyPanelProperties</code></td><td><code>PropertyPanelProperty[]</code></td><td><code>[]</code></td><td>Property definitions rendered by the shared inspector.</td></tr>
                <tr><td><code>propertyPanelAriaLabel</code></td><td><code>string</code></td><td><code>'Preview properties'</code></td><td>Accessible name for the inspector.</td></tr>
                <tr><td><code>propertyPanelOpen</code> / <code>onPropertyPanelOpenChange</code></td><td><code>boolean</code> / <code>(open) =&gt; void</code></td><td><code>false</code></td><td>Controlled inspector visibility and its change callback.</td></tr>
                <tr><td><code>propertyPanelValues</code> / <code>onPropertyPanelValuesChange</code></td><td><code>PropertyPanelValues</code> / <code>(values) =&gt; void</code></td><td>—</td><td>Controlled inspector values and value-change callback.</td></tr>
                <tr><td><code>propertyPanelMode</code> / <code>onPropertyPanelModeChange</code></td><td><code>PropertyPanelMode</code> / <code>(mode) =&gt; void</code></td><td>—</td><td>Controlled categorized or alphabetical grouping.</td></tr>
                <tr><td><code>propertyPanelCollapsedGroups</code> / <code>onPropertyPanelCollapsedGroupsChange</code></td><td><code>PropertyPanelCollapsedGroups</code> / <code>(groups) =&gt; void</code></td><td>—</td><td>Controlled collapsed-group state.</td></tr>
                <tr><td><code>propertyPanelMinWidth</code> / <code>propertyPanelMaxWidth</code></td><td><code>number</code></td><td><code>280</code> / <code>520</code></td><td>Minimum and maximum inspector split widths.</td></tr>
                <tr><td><code>propertyPanelWidth</code> / <code>onPropertyPanelWidthChange</code></td><td><code>number</code> / <code>(width) =&gt; void</code></td><td><code>420</code></td><td>Controlled width and callback for pointer/keyboard resizing.</td></tr>
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
              <a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
