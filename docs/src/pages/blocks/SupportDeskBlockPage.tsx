import { useState, useEffect, useRef } from 'react';
import {
  Card,
  Badge,
  Button,
  Input,
  Avatar,
} from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'support', label: 'Support Desk' },
  { id: 'code',    label: 'Source Code' },
];

export function SupportDeskBlockPage() {
  const [activeSection, setActiveSection] = useState('support');
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

  const CODE = `import { Card, Badge, Button, Input, Avatar } from 'spruce-react';

export function Example() {
  return (
    <Card>
      <h3>Support Tickets</h3>
      {/* Ticket Table / Thread */}
    </Card>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Support Desk Block</h1>
        <p className="docs-desc">
          Customer support ticket queue, resolution status, and help desk communication layout.
        </p>

        <section id="support" className="demo-section">
          <h2>Support Ticket Queue</h2>
          <CodePreview code={CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Ticket Search Bar */}
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <Input placeholder="Search ticket ID or customer name..." />
                </div>
                <Button variant="primary">+ Open Ticket</Button>
              </div>

              {/* Ticket Items */}
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>#TCK-8492</span>
                    <Badge variant="danger" size="sm">High Priority</Badge>
                    <Badge variant="warning" size="sm">Open</Badge>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--sp-text-subtle)' }}>Updated 12m ago</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px 0' }}>SAML Single Sign-On Authentication Error</h3>
                <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)', margin: '0 0 16px 0' }}>
                  Enterprise customer reporting 500 internal server error during Okta IDP redirect callback.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--sp-border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name="David Kim" size="sm" />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Assigned to David Kim</span>
                  </div>
                  <Button variant="outline" size="sm">View Thread</Button>
                </div>
              </Card>

              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>#TCK-8488</span>
                    <Badge variant="info" size="sm">Normal</Badge>
                    <Badge variant="success" size="sm">Resolved</Badge>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--sp-text-subtle)' }}>Updated 2h ago</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px 0' }}>Billing Invoice Export CSV Formatting</h3>
                <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)', margin: '0 0 16px 0' }}>
                  Request for custom tax ID column export in monthly PDF invoice.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--sp-border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name="Chloe Bennett" size="sm" />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Assigned to Chloe Bennett</span>
                  </div>
                  <Button variant="outline" size="sm">View Thread</Button>
                </div>
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
