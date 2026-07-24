import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardMedia, CardFooter, Icon } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const BASIC_CODE = `<Card style={{ maxWidth: 320 }}>
  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Project Alpha</h3>
  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--sp-text-muted)' }}>
    A brief description of the project and its current status.
  </p>
</Card>`;

const VARIANTS_CODE = `<Card variant="default">
  <h3>Default</h3>
  <p>Subtle border with white background.</p>
</Card>
<Card variant="outlined">
  <h3>Outlined</h3>
  <p>Stronger border for emphasis.</p>
</Card>
<Card variant="elevated">
  <h3>Elevated</h3>
  <p>Drop shadow with no visible border.</p>
</Card>
<Card variant="filled">
  <h3>Filled</h3>
  <p>Subtle background fill.</p>
</Card>`;

const HEADER_FOOTER_CODE = `<Card style={{ maxWidth: 360 }}
  header={
    <CardHeader>
      <Icon name="settings" size={18} />
      <div>
        <div style={{ fontWeight: 600, fontSize: 13 }}>Settings</div>
        <div style={{ fontSize: 11, color: 'var(--sp-text-muted)' }}>Manage preferences</div>
      </div>
    </CardHeader>
  }
  footer={
    <CardFooter>
      <button style={{ marginLeft: 'auto' }}>Cancel</button>
      <button>Save</button>
    </CardFooter>
  }
>
  Configure your account settings and security options.
</Card>`;

const PADDING_CODE = `<Card padding="none" variant="outlined">
  <h3 style={{ padding: 12 }}>None</h3>
</Card>
<Card padding="sm" variant="outlined">
  <h3>Small</h3>
</Card>
<Card padding="md" variant="outlined">
  <h3>Medium (default)</h3>
</Card>
<Card padding="lg" variant="outlined">
  <h3>Large</h3>
</Card>`;

const INTERACTIVE_CODE = `<Card interactive>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <Icon name="file-text" size={20} />
    <div>
      <h3>Documents</h3>
      <p>View and manage files</p>
    </div>
  </div>
</Card>`;

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',         label: 'Basic' },
  { id: 'variants',      label: 'Variants' },
  { id: 'header-footer', label: 'Header & Footer' },
  { id: 'media',         label: 'Media' },
  { id: 'padding',       label: 'Padding' },
  { id: 'interactive',   label: 'Interactive' },
  { id: 'api',           label: 'API' },
];

export function CardPage() {
  const [activeSection, setActiveSection] = useState('basic');
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
        <h1>Card</h1>
        <p className="docs-desc">
          A flexible container for grouping related content. Supports headers, media, footers,
          multiple variants, and interactive hover states.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic</h2>
          <p className="section-desc">A simple card with body content.</p>
          <CodePreview code={BASIC_CODE}>
            <Card style={{ maxWidth: 320 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Project Alpha</h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--sp-text-muted)' }}>
                A brief description of the project and its current status.
              </p>
            </Card>
          </CodePreview>
        </section>

        <section id="variants" className="demo-section" aria-labelledby="variants-heading">
          <h2 id="variants-heading">Variants</h2>
          <p className="section-desc">Four visual styles for different contexts.</p>
          <CodePreview code={VARIANTS_CODE}>
            <div className="docs-grid" style={{ alignItems: 'stretch' }}>
              <Card variant="default" style={{ minWidth: 160 }}>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Default</h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--sp-text-muted)' }}>Subtle border with white background.</p>
              </Card>
              <Card variant="outlined" style={{ minWidth: 160 }}>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Outlined</h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--sp-text-muted)' }}>Stronger border for emphasis.</p>
              </Card>
              <Card variant="elevated" style={{ minWidth: 160 }}>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Elevated</h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--sp-text-muted)' }}>Drop shadow with no visible border.</p>
              </Card>
              <Card variant="filled" style={{ minWidth: 160 }}>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Filled</h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--sp-text-muted)' }}>Subtle background fill.</p>
              </Card>
            </div>
          </CodePreview>
        </section>

        <section id="header-footer" className="demo-section" aria-labelledby="header-footer-heading">
          <h2 id="header-footer-heading">Header &amp; Footer</h2>
          <p className="section-desc">
            Use <code>CardHeader</code> and <code>CardFooter</code> to project content into the
            corresponding card slots, separated by borders.
          </p>
          <CodePreview code={HEADER_FOOTER_CODE}>
            <Card
              style={{ maxWidth: 360 }}
              header={
                <CardHeader>
                  <Icon name="settings" size={18} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Settings</div>
                    <div style={{ fontSize: 11, color: 'var(--sp-text-muted)' }}>Manage preferences</div>
                  </div>
                </CardHeader>
              }
              footer={
                <CardFooter>
                  <button
                    style={{
                      marginLeft: 'auto',
                      padding: '6px 12px',
                      border: '1px solid var(--sp-border-strong)',
                      borderRadius: 6,
                      background: 'transparent',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    style={{
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: 6,
                      background: 'var(--sp-primary)',
                      color: '#fff',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Save
                  </button>
                </CardFooter>
              }
            >
              <p style={{ margin: 0, fontSize: 13, color: 'var(--sp-text-muted)' }}>
                Configure your account settings, notification preferences, and security options.
              </p>
            </Card>
          </CodePreview>
        </section>

        <section id="media" className="demo-section" aria-labelledby="media-heading">
          <h2 id="media-heading">Media</h2>
          <p className="section-desc">
            Use <code>CardMedia</code> to display images or other media at the top of the card.
          </p>
          <CodePreview code={`<Card style={{ maxWidth: 320 }}
  media={
    <CardMedia>
      <div style={{ height: 160, background: 'linear-gradient(...)' }} />
    </CardMedia>
  }
>
  <h3>Media Card</h3>
  <p>Image displayed above the body.</p>
</Card>`}>
            <Card
              style={{ maxWidth: 320 }}
              media={
                <CardMedia>
                  <div
                    style={{
                      height: 160,
                      background: 'linear-gradient(135deg, var(--sp-primary-subtle), color-mix(in srgb, var(--sp-primary) 20%, transparent))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name="image" size={32} />
                  </div>
                </CardMedia>
              }
            >
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Media Card</h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--sp-text-muted)' }}>
                Image or visual content displayed above the body.
              </p>
            </Card>
          </CodePreview>
        </section>

        <section id="padding" className="demo-section" aria-labelledby="padding-heading">
          <h2 id="padding-heading">Padding</h2>
          <p className="section-desc">
            Control body padding with the <code>padding</code> prop.
          </p>
          <CodePreview code={PADDING_CODE}>
            <div className="docs-grid">
              <Card padding="none" variant="outlined" style={{ minWidth: 130 }}>
                <h3 style={{ padding: 12, margin: 0, fontSize: 13, fontWeight: 600 }}>None</h3>
              </Card>
              <Card padding="sm" variant="outlined" style={{ minWidth: 130 }}>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Small</h3>
              </Card>
              <Card variant="outlined" style={{ minWidth: 130 }}>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Medium</h3>
              </Card>
              <Card padding="lg" variant="outlined" style={{ minWidth: 130 }}>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Large</h3>
              </Card>
            </div>
          </CodePreview>
        </section>

        <section id="interactive" className="demo-section" aria-labelledby="interactive-heading">
          <h2 id="interactive-heading">Interactive</h2>
          <p className="section-desc">
            Set <code>interactive</code> for hover effects, ideal for clickable cards.
          </p>
          <CodePreview code={INTERACTIVE_CODE}>
            <div className="docs-grid">
              {[
                { icon: 'file-text', title: 'Documents', desc: 'View and manage files' },
                { icon: 'users',     title: 'Team',      desc: 'Manage team members' },
                { icon: 'bar-chart', title: 'Analytics', desc: 'View performance data' },
              ].map(({ icon, title, desc }) => (
                <Card key={title} interactive style={{ minWidth: 160 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Icon name={icon} size={20} />
                    <div>
                      <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{title}</h3>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--sp-text-muted)' }}>{desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Card Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>variant</code></td><td><code>'default' | 'outlined' | 'elevated' | 'filled'</code></td><td><code>'default'</code></td><td>Visual style</td></tr>
                <tr><td><code>padding</code></td><td><code>'none' | 'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Body content padding</td></tr>
                <tr><td><code>interactive</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enable hover effects for clickable cards</td></tr>
                <tr><td><code>header</code></td><td><code>ReactNode</code></td><td>—</td><td>Header slot content (use with <code>CardHeader</code>)</td></tr>
                <tr><td><code>media</code></td><td><code>ReactNode</code></td><td>—</td><td>Media slot content (use with <code>CardMedia</code>)</td></tr>
                <tr><td><code>footer</code></td><td><code>ReactNode</code></td><td>—</td><td>Footer slot content (use with <code>CardFooter</code>)</td></tr>
              </tbody>
            </table>
          </div>
          <h3>Slot Components</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Component</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>CardHeader</code></td><td>Content above the body with a bottom border</td></tr>
                <tr><td><code>CardMedia</code></td><td>Full-width image or visual content above the body</td></tr>
                <tr><td><code>CardFooter</code></td><td>Content below the body with a top border</td></tr>
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
