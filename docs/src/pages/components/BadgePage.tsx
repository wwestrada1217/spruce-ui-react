import { useState, useEffect, useRef } from 'react';
import { Badge } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { DocsPackageBadge } from '../../components/DocsPackageBadge';

const VARIANTS_CODE = `<Badge>Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>`;

const PILL_CODE = `<Badge pill variant="primary">12</Badge>
<Badge pill variant="success">Active</Badge>
<Badge pill variant="danger">3 errors</Badge>`;

const DOT_CODE = `<Badge dot variant="success">Online</Badge>
<Badge dot variant="danger">Offline</Badge>
<Badge dot variant="warning">Away</Badge>
<Badge dot variant="info">Syncing</Badge>`;

const SIZES_CODE = `<Badge variant="primary" size="sm">Small</Badge>
<Badge variant="primary" size="md">Medium</Badge>
<Badge variant="primary" size="lg">Large</Badge>`;

const CLICKABLE_CODE = `<Badge clickable pill variant="primary" onBadgeClick={handleFilter}>
  Filter active
</Badge>`;

const BORDERLESS_CODE = `<Badge borderless variant="primary">Primary</Badge>
<Badge borderless dot variant="success">Online</Badge>`;

const ICON_CODE = `<Badge icon="shield" variant="primary">Verified</Badge>
<Badge icon="check-circle" variant="success">Completed</Badge>
<Badge icon="clock" variant="info">In progress</Badge>`;

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'variants', label: 'Variants' },
  { id: 'pill',     label: 'Pill' },
  { id: 'dot',      label: 'With Dot' },
  { id: 'sizes',    label: 'Sizes' },
  { id: 'clickable', label: 'Clickable' },
  { id: 'borderless', label: 'Borderless' },
  { id: 'with-icon', label: 'With Icon' },
  { id: 'api',      label: 'API' },
];

export function BadgePage() {
  const [activeSection, setActiveSection] = useState('variants');
  const [badgeClicks, setBadgeClicks] = useState(0);
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
        <h1>Badge</h1>
        <p className="docs-desc">
          Small status indicators, counts, or labels. Available as square or pill, with an optional
          dot indicator and an interactive mode for filter chips or compact actions.
        </p>
        <DocsPackageBadge packageName="spruce-react" symbols={['Badge']} />

        <section id="variants" className="demo-section" aria-labelledby="variants-heading">
          <h2 id="variants-heading">Variants</h2>
          <p className="section-desc">Eight tokenized color variants for different semantic purposes.</p>
          <CodePreview code={VARIANTS_CODE}>
            <div className="demo-row">
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="tertiary">Tertiary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </CodePreview>
        </section>

        <section id="pill" className="demo-section" aria-labelledby="pill-heading">
          <h2 id="pill-heading">Pill</h2>
          <p className="section-desc">
            Enable <code>pill</code> for a fully rounded shape, ideal for counts and short labels.
          </p>
          <CodePreview code={PILL_CODE}>
            <div className="demo-row">
              <Badge pill variant="primary">12</Badge>
              <Badge pill variant="success">Active</Badge>
              <Badge pill variant="danger">3 errors</Badge>
            </div>
          </CodePreview>
        </section>

        <section id="dot" className="demo-section" aria-labelledby="dot-heading">
          <h2 id="dot-heading">With Dot</h2>
          <p className="section-desc">
            Add a small colored dot before the label to reinforce status meaning.
          </p>
          <CodePreview code={DOT_CODE}>
            <div className="demo-row">
              <Badge dot variant="success">Online</Badge>
              <Badge dot variant="danger">Offline</Badge>
              <Badge dot variant="warning">Away</Badge>
              <Badge dot variant="info">Syncing</Badge>
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="sizes-heading">
          <h2 id="sizes-heading">Sizes</h2>
          <p className="section-desc">Four size options to fit different UI contexts.</p>
          <CodePreview code={SIZES_CODE}>
            <div className="demo-row">
              <Badge variant="primary" size="xs">Extra small</Badge>
              <Badge variant="primary" size="sm">Small</Badge>
              <Badge variant="primary" size="md">Medium</Badge>
              <Badge variant="primary" size="lg">Large</Badge>
            </div>
          </CodePreview>
        </section>

        <section id="clickable" className="demo-section" aria-labelledby="clickable-heading">
          <h2 id="clickable-heading">Clickable</h2>
          <p className="section-desc">
            Enable <code>clickable</code> when a badge performs a compact action. It renders as a
            native button with keyboard support.
          </p>
          <CodePreview code={CLICKABLE_CODE} language="typescript">
            <div className="demo-row">
              <Badge clickable pill variant="primary" onBadgeClick={() => setBadgeClicks((count) => count + 1)}>
                Filter active
              </Badge>
              <Badge clickable dot variant="info" onBadgeClick={() => setBadgeClicks((count) => count + 1)}>
                {badgeClicks} clicks
              </Badge>
            </div>
          </CodePreview>
        </section>

        <section id="borderless" className="demo-section" aria-labelledby="borderless-heading">
          <h2 id="borderless-heading">Borderless</h2>
          <p className="section-desc">
            Remove the perimeter border while keeping the tinted background and text treatment.
          </p>
          <CodePreview code={BORDERLESS_CODE}>
            <div className="demo-row">
              <Badge borderless>Default</Badge>
              <Badge borderless variant="primary">Primary</Badge>
              <Badge borderless variant="success">Success</Badge>
              <Badge borderless dot variant="success">Online</Badge>
            </div>
          </CodePreview>
        </section>

        <section id="with-icon" className="demo-section" aria-labelledby="with-icon-heading">
          <h2 id="with-icon-heading">With Icon</h2>
          <p className="section-desc">
            Use <code>icon</code>, <code>iconLeft</code>, or <code>iconRight</code> for compact
            visual context. Icon sizes scale with the badge size.
          </p>
          <CodePreview code={ICON_CODE}>
            <div className="demo-row">
              <Badge icon="shield" variant="primary">Verified</Badge>
              <Badge icon="check-circle" variant="success">Completed</Badge>
              <Badge icon="clock" variant="info">In progress</Badge>
            </div>
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
                <tr><td><code>variant</code></td><td><code>'default' | 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'info'</code></td><td><code>'default'</code></td><td>Color variant</td></tr>
                <tr><td><code>size</code></td><td><code>'xs' | 'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Badge size</td></tr>
                <tr><td><code>pill</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Fully rounded shape</td></tr>
                <tr><td><code>dot</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show dot indicator</td></tr>
                <tr><td><code>borderless</code>, <code>clickable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Remove the border or render a native button</td></tr>
                <tr><td><code>icon</code>, <code>iconLeft</code>, <code>iconRight</code></td><td><code>string | null</code></td><td>-</td><td>Decorative icon names</td></tr>
                <tr><td><code>onBadgeClick</code></td><td><code>() =&gt; void</code></td><td>-</td><td>Called when a clickable badge is activated</td></tr>
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
