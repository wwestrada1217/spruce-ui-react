import { useEffect, useRef, useState } from 'react';
import { CircularProgress } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const SECTIONS = [
  { id: 'basic', label: 'Basic' },
  { id: 'variants', label: 'Variants' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'custom-content', label: 'Custom Content' },
  { id: 'indeterminate', label: 'Indeterminate' },
  { id: 'api', label: 'API' },
];

export function CircularProgressPage() {
  const [activeSection, setActiveSection] = useState('basic');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    );
    mainRef.current?.querySelectorAll('section[id]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Circular Progress</h1>
        <p className="docs-desc">Circular indicators for completion, loading activity, metrics, and compact gauges.</p>

        <section id="basic" className="demo-section" aria-labelledby="circular-basic-heading">
          <h2 id="circular-basic-heading">Basic</h2>
          <p className="section-desc">Determinate progress can show its localized percentage in the center.</p>
          <CodePreview code={'<CircularProgress value={65} showValue />\n<CircularProgress value={40} />'}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              <CircularProgress value={65} showValue />
              <CircularProgress value={40} />
            </div>
          </CodePreview>
        </section>

        <section id="variants" className="demo-section" aria-labelledby="circular-variants-heading">
          <h2 id="circular-variants-heading">Variants</h2>
          <CodePreview code={'<CircularProgress value={75} variant="primary" showValue />\n<CircularProgress value={90} variant="success" showValue />\n<CircularProgress value={30} variant="danger" showValue />'}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <CircularProgress value={75} variant="primary" showValue />
              <CircularProgress value={90} variant="success" showValue />
              <CircularProgress value={30} variant="danger" showValue />
              <CircularProgress value={50} variant="neutral" showValue />
            </div>
          </CodePreview>
        </section>

        <section id="sizes" className="demo-section" aria-labelledby="circular-sizes-heading">
          <h2 id="circular-sizes-heading">Sizes and custom dimensions</h2>
          <p className="section-desc">Use xs through xl or override the diameter and stroke width.</p>
          <CodePreview code={'<CircularProgress value={70} size="xs" />\n<CircularProgress value={85} diameter={110} strokeWidth={8} showValue />'}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((value) => <CircularProgress key={value} value={70} size={value} showValue={value !== 'xs' && value !== 'sm'} />)}
              <CircularProgress value={85} diameter={110} strokeWidth={8} showValue variant="success" />
            </div>
          </CodePreview>
        </section>

        <section id="custom-content" className="demo-section" aria-labelledby="circular-content-heading">
          <h2 id="circular-content-heading">Custom center content</h2>
          <p className="section-desc">Children replace the percentage and are useful for a status mark or metric.</p>
          <CodePreview code={'<CircularProgress value={100} size="lg" variant="success">✓</CircularProgress>'}>
            <CircularProgress value={100} size="lg" variant="success"><span style={{ fontSize: 20 }}>✓</span></CircularProgress>
          </CodePreview>
        </section>

        <section id="indeterminate" className="demo-section" aria-labelledby="circular-indeterminate-heading">
          <h2 id="circular-indeterminate-heading">Indeterminate</h2>
          <CodePreview code={'<CircularProgress indeterminate size="lg" variant="info" />'}>
            <div style={{ display: 'flex', gap: 20 }}>
              <CircularProgress indeterminate size="sm" />
              <CircularProgress indeterminate size="lg" variant="info" />
              <CircularProgress indeterminate size="xl" variant="success" />
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Props</h3>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>value</code></td><td><code>number</code></td><td><code>0</code></td><td>Current progress value.</td></tr>
            <tr><td><code>max</code></td><td><code>number</code></td><td><code>100</code></td><td>Maximum value.</td></tr>
            <tr><td><code>size</code></td><td><code>CircularProgressSize</code></td><td><code>'md'</code></td><td>Preset xs, sm, md, lg, or xl.</td></tr>
            <tr><td><code>diameter</code> / <code>strokeWidth</code></td><td><code>number</code></td><td>—</td><td>Custom pixel dimensions.</td></tr>
            <tr><td><code>variant</code> / <code>color</code></td><td><code>CircularProgressVariant</code> / <code>string</code></td><td><code>'primary'</code></td><td>Token variant or custom CSS color.</td></tr>
            <tr><td><code>indeterminate</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Spin without value attributes.</td></tr>
            <tr><td><code>showTrack</code> / <code>rounded</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Control the background ring and line caps.</td></tr>
            <tr><td><code>showValue</code> / <code>valueFormat</code></td><td><code>boolean</code> / <code>string</code></td><td><code>false</code> / <code>'1.0-0'</code></td><td>Localized center percentage formatting.</td></tr>
            <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td>localized</td><td>Accessible progress name.</td></tr>
            <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Replaces the percentage in the center.</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{SECTIONS.map((section) => <li key={section.id}><a className={`toc-link${activeSection === section.id ? ' active' : ''}`} onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{section.label}</a></li>)}</ul></nav>
    </div>
  );
}
