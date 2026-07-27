import { useState, useEffect, useRef } from 'react';
import { Fade, Button, Card } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'fade', label: 'Fade Transition' },
  { id: 'api',  label: 'API' },
];

export function FadePage() {
  const [activeSection, setActiveSection] = useState('fade');
  const [visible, setVisible] = useState(true);
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

  const FADE_CODE = `import { useState } from 'react';
import { Fade, Button, Card } from 'spruce-react';

export function Example() {
  const [visible, setVisible] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Button onClick={() => setVisible(!visible)}>
        Toggle Fade State
      </Button>
      <Fade visible={visible} direction="up" duration={400}>
        <Card style={{ padding: 16 }}>
          Fading card element with slide-up motion
        </Card>
      </Fade>
    </div>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Fade</h1>
        <p className="docs-desc">
          Smooth opacity and directional transform entrance/exit transitions for UI elements.
        </p>

        <section id="fade" className="demo-section">
          <h2>Directional Fade Entrance</h2>
          <CodePreview code={FADE_CODE}>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
              <Button onClick={() => setVisible(!visible)}>
                Toggle Fade State ({visible ? 'Visible' : 'Hidden'})
              </Button>
              <Fade visible={visible} direction="up" duration={400}>
                <Card style={{ padding: 16, maxWidth: 320 }}>
                  Fading card element with slide-up motion
                </Card>
              </Fade>
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
                <tr><td><code>visible</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Visibility state indicator</td></tr>
                <tr><td><code>duration</code></td><td><code>number</code></td><td><code>300</code></td><td>Transition duration in ms</td></tr>
                <tr><td><code>direction</code></td><td><code>'none' | 'up' | 'down' | 'left' | 'right'</code></td><td><code>'none'</code></td><td>Directional offset slide motion</td></tr>
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
