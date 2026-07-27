import { useState, useEffect, useRef } from 'react';
import {
  Card,
  Avatar,
  Badge,
  Button,
  Input,
  Icon,
} from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'feeds', label: 'Feeds & Activity Lists' },
  { id: 'code',  label: 'Source Code' },
];

export function FeedsBlockPage() {
  const [activeSection, setActiveSection] = useState('feeds');
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

  const CODE = `import { Card, Avatar, Badge, Button, Input, Icon } from 'spruce-react';

export function Example() {
  return (
    <Card>
      <h3>Activity Stream</h3>
      {/* Activity Item */}
    </Card>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Feeds & Lists Block</h1>
        <p className="docs-desc">
          Social activity stream, timeline feeds, comment threads, and notification event lists layout pattern.
        </p>

        <section id="feeds" className="demo-section">
          <h2>Social & Activity Stream</h2>
          <CodePreview code={CODE}>
            <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Compose Box */}
              <Card>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Avatar name="Sarah Connor" />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Input placeholder="Share an update with your team..." />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 8, color: 'var(--sp-text-subtle)' }}>
                        <Button variant="outline" size="sm"><Icon name="image" size={14} /> Image</Button>
                        <Button variant="outline" size="sm"><Icon name="paperclip" size={14} /> File</Button>
                      </div>
                      <Button variant="primary" size="sm">Post</Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Feed Item 1 */}
              <Card>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <Avatar name="Alex Rivera" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Alex Rivera <Badge variant="primary" size="sm">Admin</Badge></div>
                    <div style={{ fontSize: 12, color: 'var(--sp-text-subtle)' }}>2 hours ago • Public</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, margin: '0 0 12px 0', lineHeight: 1.5 }}>
                  Just released <strong>Spruce UI React v0.1.3</strong>! Huge performance gains on Datagrid rendering and 12 new native SVG chart types available now. 🚀
                </p>
                <div style={{ display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid var(--sp-border-subtle)', fontSize: 13 }}>
                  <Button variant="outline" size="sm"><Icon name="heart" size={14} /> Like (24)</Button>
                  <Button variant="outline" size="sm"><Icon name="message-square" size={14} /> Comment (5)</Button>
                </div>
              </Card>

              {/* Feed Item 2 */}
              <Card>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <Avatar name="Elena Rostova" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Elena Rostova</div>
                    <div style={{ fontSize: 12, color: 'var(--sp-text-subtle)' }}>5 hours ago • Engineering</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, margin: '0 0 12px 0', lineHeight: 1.5 }}>
                  Deployed cluster migration node 4. Zero downtime achieved during database sharding. 🎉
                </p>
              </Card>
            </div>
          </CodePreview>
        </section>

        <section id="code" className="demo-section">
          <h2>Source Code</h2>
          <CodePreview code={CODE} codeOnly />
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
