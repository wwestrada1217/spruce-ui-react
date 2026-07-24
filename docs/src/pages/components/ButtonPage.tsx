import { useState, useEffect, useRef } from 'react';
import { Button } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const VARIANTS_CODE = `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="danger-outline">Danger Outline</Button>
<Button variant="success">Success</Button>
<Button variant="success-outline">Success Outline</Button>`;

const SIZES_CODE = `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`;

const ICONS_CODE = `<Button iconLeft="plus">Add Item</Button>
<Button variant="outline" iconLeft="search">Search</Button>
<Button variant="secondary" iconRight="chevron-right">Next</Button>
<Button variant="danger" iconLeft="trash">Delete</Button>`;

const ICON_ONLY_CODE = `<Button variant="outline" iconOnly iconLeft="plus" size="sm" />
<Button variant="outline" iconOnly iconLeft="settings" />
<Button variant="outline" iconOnly iconLeft="edit" size="lg" />`;

const STATES_CODE = `<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
<Button fullWidth variant="secondary">Full Width</Button>`;

const VARIANTS = [
  'primary', 'secondary', 'outline', 'ghost',
  'danger', 'danger-outline', 'success', 'success-outline',
] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'variants',    label: 'Variants' },
  { id: 'sizes',       label: 'Sizes' },
  { id: 'icons',       label: 'With Icons' },
  { id: 'icon-only',   label: 'Icon Only' },
  { id: 'states',      label: 'States' },
  { id: 'all-variants',label: 'All Variants' },
  { id: 'api',         label: 'API' },
];

export function ButtonPage() {
  const [activeSection, setActiveSection] = useState('variants');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
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
        <h1>Button</h1>
        <p className="docs-desc">
          Buttons trigger actions. Available in 8 variants and 3 sizes, with icon and loading support.
        </p>

        <section id="variants" className="demo-section" aria-labelledby="variants-heading">
          <h2 id="variants-heading">Variants</h2>
          <p className="section-desc">Eight style variants to communicate intent and severity.</p>
          <CodePreview code={VARIANTS_CODE}>
            <div className="demo-row">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="danger-outline">Danger Outline</Button>
              <Button variant="success">Success</Button>
              <Button variant="success-outline">Success Outline</Button>
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Three size options for different contexts: small, medium (default), and large.</p>
          <CodePreview code={SIZES_CODE}>
            <div className="demo-row">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </CodePreview>
        </section>

        <section id="icons" className="demo-section" aria-labelledby="icons-heading">
          <h2 id="icons-heading">With Icons</h2>
          <p className="section-desc">Place icons on the left or right side of the button label for added visual context.</p>
          <CodePreview code={ICONS_CODE}>
            <div className="demo-row">
              <Button iconLeft="plus">Add Item</Button>
              <Button variant="outline" iconLeft="search">Search</Button>
              <Button variant="secondary" iconRight="chevron-right">Next</Button>
              <Button variant="danger" iconLeft="trash">Delete</Button>
            </div>
          </CodePreview>
        </section>

        <section id="icon-only" className="demo-section" aria-labelledby="icon-only-heading">
          <h2 id="icon-only-heading">Icon Only</h2>
          <p className="section-desc">Compact buttons with only an icon, useful for toolbars and tight layouts.</p>
          <CodePreview code={ICON_ONLY_CODE}>
            <div className="demo-row">
              <Button variant="outline" iconOnly iconLeft="plus" size="sm" />
              <Button variant="outline" iconOnly iconLeft="settings" />
              <Button variant="outline" iconOnly iconLeft="edit" size="lg" />
            </div>
          </CodePreview>
        </section>

        <section id="states" className="demo-section" aria-labelledby="states-heading">
          <h2 id="states-heading">States</h2>
          <p className="section-desc">Buttons support disabled, loading, and full-width states.</p>
          <CodePreview code={STATES_CODE}>
            <div className="demo-row" style={{ width: '100%' }}>
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
              <div style={{ width: '100%', marginTop: 8 }}>
                <Button fullWidth variant="secondary">Full Width</Button>
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="all-variants" className="demo-section" aria-labelledby="all-variants-heading">
          <h2 id="all-variants-heading">All Variants &times; Sizes</h2>
          <p className="section-desc">A matrix of every variant and size combination for visual reference.</p>
          <div className="docs-grid">
            {VARIANTS.map((v) =>
              SIZES.map((s) => (
                <Button key={`${v}-${s}`} variant={v} size={s}>
                  {v} {s}
                </Button>
              )),
            )}
          </div>
        </section>

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
                <tr><td><code>variant</code></td><td><code>'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-outline' | 'success' | 'success-outline'</code></td><td><code>'primary'</code></td><td>Button style variant</td></tr>
                <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Button size</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable the button</td></tr>
                <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show loading spinner</td></tr>
                <tr><td><code>fullWidth</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Stretch to full width</td></tr>
                <tr><td><code>iconOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Icon-only mode (hides label)</td></tr>
                <tr><td><code>iconLeft</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Left icon name</td></tr>
                <tr><td><code>iconRight</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Right icon name</td></tr>
                <tr><td><code>type</code></td><td><code>'button' | 'submit' | 'reset'</code></td><td><code>'button'</code></td><td>HTML button type</td></tr>
                <tr><td><code>active</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Active/selected state</td></tr>
                <tr><td><code>onClick</code></td><td><code>MouseEventHandler</code></td><td>—</td><td>Click handler</td></tr>
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
