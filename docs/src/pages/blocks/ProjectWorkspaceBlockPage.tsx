import { useState, useEffect, useRef } from 'react';
import {
  Card,
  Badge,
  Button,
  Avatar,
  ProgressBar,
} from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'workspace', label: 'Project Workspace' },
  { id: 'code',      label: 'Source Code' },
];

export function ProjectWorkspaceBlockPage() {
  const [activeSection, setActiveSection] = useState('workspace');
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

  const CODE = `import { Card, Badge, Button, Avatar, ProgressBar } from 'spruce-react';

export function Example() {
  return (
    <Card>
      <h3>Project Overview</h3>
      {/* KanBan / Sprint Cards */}
    </Card>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Project Workspace Block</h1>
        <p className="docs-desc">
          Sprint management, milestone tracker, task Kanban overview, and team assignment workspace.
        </p>

        <section id="workspace" className="demo-section">
          <h2>Project Overview & Sprint Board</h2>
          <CodePreview code={CODE}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Header Banner */}
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Spruce UI Design System v2.0</h2>
                      <Badge variant="primary">In Progress</Badge>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)', margin: 0 }}>
                      Sprint 14 • Deadline: Aug 15, 2026 • Lead: Sarah Connor
                    </p>
                  </div>
                  <Button variant="primary" size="sm">+ New Task</Button>
                </div>
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                    <span>Sprint Milestone Progress</span>
                    <span>72%</span>
                  </div>
                  <ProgressBar value={72} variant="primary" />
                </div>
              </Card>

              {/* Task Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                <Card>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Badge variant="warning" size="sm">Frontend</Badge>
                    <span style={{ fontSize: 12, color: 'var(--sp-text-subtle)' }}>3 days left</span>
                  </div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 8px 0' }}>Refactor Datagrid Cell Virtualization</h4>
                  <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)', margin: '0 0 12px 0' }}>
                    Improve scroll performance for 100,000+ row datasets.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--sp-border-subtle)' }}>
                    <Avatar name="Alex Rivera" size="sm" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--sp-primary)' }}>12 Subtasks</span>
                  </div>
                </Card>

                <Card>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Badge variant="info" size="sm">Charts</Badge>
                    <span style={{ fontSize: 12, color: 'var(--sp-text-subtle)' }}>Completed</span>
                  </div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 8px 0' }}>Native SVG Organization Chart</h4>
                  <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)', margin: '0 0 12px 0' }}>
                    Hierarchical tree structure with card nodes and dashed connectors.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--sp-border-subtle)' }}>
                    <Avatar name="Elena Rostova" size="sm" />
                    <Badge variant="success" size="sm">Done</Badge>
                  </div>
                </Card>
              </div>
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
