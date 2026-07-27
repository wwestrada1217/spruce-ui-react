import { useState, useEffect, useRef } from 'react';
import { SignaturePad, Badge } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'signature', label: 'Signature Canvas' },
  { id: 'api',       label: 'API' },
];

export function SignaturePadPage() {
  const [activeSection, setActiveSection] = useState('signature');
  const [signatureData, setSignatureData] = useState<string | null>(null);
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

  const SIGNATURE_CODE = `import { useState } from 'react';
import { SignaturePad } from 'spruce-react';

export function Example() {
  const [data, setData] = useState<string | null>(null);

  return (
    <SignaturePad
      width={400}
      height={180}
      penColor="#0f766e"
      onChange={setData}
    />
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Signature Pad</h1>
        <p className="docs-desc">
          Canvas-based smooth freehand drawing pad for electronic signatures and legal authorizations.
        </p>

        <section id="signature" className="demo-section">
          <h2>Freehand Drawing Canvas</h2>
          <CodePreview code={SIGNATURE_CODE}>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
              <SignaturePad width={440} height={180} penColor="#0f766e" onChange={setSignatureData} />
              <div style={{ fontSize: 13, color: 'var(--sp-text-subtle)' }}>
                Status: {signatureData ? <Badge variant="success">Signed</Badge> : <Badge variant="warning">Empty</Badge>}
              </div>
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
                <tr><td><code>width</code></td><td><code>number</code></td><td><code>400</code></td><td>Canvas width in pixels</td></tr>
                <tr><td><code>height</code></td><td><code>number</code></td><td><code>180</code></td><td>Canvas height in pixels</td></tr>
                <tr><td><code>penColor</code></td><td><code>string</code></td><td><code>'#0f766e'</code></td><td>Drawing stroke color</td></tr>
                <tr><td><code>penWidth</code></td><td><code>number</code></td><td><code>2</code></td><td>Drawing stroke line width</td></tr>
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
