/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState, useEffect, useRef } from 'react';
import {
  AppShell,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarSeparator,
  AppHeader,
  Button,
  Badge,
  StatCard,
  Card,
  Avatar,
} from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

// ── Code Samples ──────────────────────────────────────────────────────────────

const FULL_SHELL_CODE = `import {
  AppShell,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarSeparator,
  AppHeader,
  Button,
  Badge,
  StatCard,
  Avatar,
} from 'spruce-react';

export function ApplicationShellDemo() {
  return (
    <AppShell
      headerHeight={52}
      sidebar={
        <Sidebar>
          {/* Sidebar Header Sample */}
          <SidebarHeader showBorders>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', width: '100%', height: 44 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--sp-primary)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                S
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.2 }}>Spruce Studio</span>
                <span style={{ fontSize: 10, color: 'var(--sp-text-muted)' }}>v2.4.0 Pro</span>
              </div>
            </div>
          </SidebarHeader>

          {/* Sidebar Content */}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarItem icon="layout-dashboard" active>Dashboard</SidebarItem>
              <SidebarItem icon="folder">Projects</SidebarItem>
              <SidebarItem icon="bar-chart">Analytics</SidebarItem>
              <SidebarItem icon="users">Team Members</SidebarItem>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarItem icon="settings">Preferences</SidebarItem>
              <SidebarItem icon="bell">Notifications</SidebarItem>
            </SidebarGroup>
          </SidebarContent>

          {/* Sidebar Footer Sample */}
          <SidebarFooter showBorders>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar name="Alex Johnson" size="sm" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.2 }}>Alex Johnson</span>
                  <span style={{ fontSize: 10, color: 'var(--sp-text-muted)' }}>Admin</span>
                </div>
              </div>
              <Button size="sm" variant="ghost" iconLeft="log-out" aria-label="Sign Out" />
            </div>
          </SidebarFooter>
        </Sidebar>
      }
      header={
        <AppHeader
          height={52}
          title="Overview Dashboard"
          subtitle="Project Workspace & Stats"
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge variant="success">Online</Badge>
              <Button size="sm" variant="primary">New Project</Button>
            </div>
          }
        />
      }
    >
      <div style={{ padding: 24 }}>
        <h2>Scrollable Main Container</h2>
        <p>Content inside the container scrolls independently while header and sidebar stay fixed.</p>
      </div>
    </AppShell>
  );
}`;


interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: 'overview', label: 'Interactive App Shell Demo' },
  { id: 'api', label: 'API Reference' },
];

export function AppShellBlockPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    );
    mainRef.current?.querySelectorAll('section[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ padding: '4px 10px', borderRadius: 20, background: 'var(--sp-primary-subtle)', color: 'var(--sp-primary)', fontWeight: 600, fontSize: 12 }}>
            BLOCK
          </span>
          <h1 style={{ margin: 0 }}>App Shell</h1>
        </div>
        <p className="docs-desc">
          Application Shell layout block combining a collapsible, responsive Sidebar on the left,
          a top AppHeader with aligned height (52px), and an independently scrollable main content container.
          When in mobile size, the sidebar transforms into an off-canvas drawer controlled by a hamburger menu in the app header.
        </p>

        {/* ── Interactive Demo ─────────────────────────────────────────── */}
        <section id="overview">
          <h2>Interactive App Shell Demo</h2>
          <p>
            Full-featured application layout block. Hover over the sidebar rail handle to collapse/expand on desktop, or toggle the responsive mobile drawer.
          </p>

          <div
            style={{
              height: 540,
              border: '1px solid var(--sp-border)',
              borderRadius: 'var(--sp-radius-lg, 8px)',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'var(--sp-shadow-md)',
            }}
          >
            <AppShell
              headerHeight={52}
              sidebar={
                <Sidebar>
                  {/* Sidebar Header Sample */}
                  <SidebarHeader showBorders>
                    {({ collapsed }: { collapsed: boolean }) => (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '0 4px',
                          width: '100%',
                          height: 44,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            background: 'var(--sp-primary)',
                            display: 'grid',
                            placeItems: 'center',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: 14,
                            flexShrink: 0,
                          }}
                        >
                          S
                        </div>
                        {!collapsed && (
                          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <span style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                              Spruce Studio
                            </span>
                            <span style={{ fontSize: 10, color: 'var(--sp-text-muted)', whiteSpace: 'nowrap' }}>
                              v2.4.0 Pro
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </SidebarHeader>

                  {/* Sidebar Content Sample */}
                  <SidebarContent>
                    <SidebarGroup>
                      <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                      <SidebarItem icon="layout-dashboard" active>
                        Dashboard
                      </SidebarItem>
                      <SidebarItem icon="folder">Projects</SidebarItem>
                      <SidebarItem icon="bar-chart">Analytics</SidebarItem>
                      <SidebarItem icon="users">Team Members</SidebarItem>
                    </SidebarGroup>
                    <SidebarSeparator />
                    <SidebarGroup>
                      <SidebarGroupLabel>Preferences</SidebarGroupLabel>
                      <SidebarItem icon="settings">Settings</SidebarItem>
                      <SidebarItem icon="bell">Notifications</SidebarItem>
                    </SidebarGroup>
                  </SidebarContent>

                  {/* Sidebar Footer Sample */}
                  <SidebarFooter showBorders>
                    {({ collapsed }: { collapsed: boolean }) => (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: collapsed ? 'center' : 'space-between',
                          padding: '4px 2px',
                          width: '100%',
                          overflow: 'hidden',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                          <Avatar name="Alex Johnson" size="sm" />
                          {!collapsed && (
                            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <span style={{ fontWeight: 600, fontSize: 12, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                                Alex Johnson
                              </span>
                              <span style={{ fontSize: 10, color: 'var(--sp-text-muted)', whiteSpace: 'nowrap' }}>
                                Admin
                              </span>
                            </div>
                          )}
                        </div>
                        {!collapsed && (
                          <Button size="sm" variant="ghost" iconLeft="log-out" aria-label="Sign Out" />
                        )}
                      </div>
                    )}
                  </SidebarFooter>
                </Sidebar>
              }
              header={
                <AppHeader
                  height={52}
                  title="Overview Dashboard"
                  subtitle="Project Workspace & Stats"
                  actions={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Badge variant="success">Online</Badge>
                      <Button size="sm" variant="primary">
                        New Project
                      </Button>
                    </div>
                  }
                />
              }
            >
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h2 style={{ margin: '0 0 4px', fontSize: 20 }}>Workspace Overview</h2>
                  <p style={{ margin: 0, color: 'var(--sp-text-muted)', fontSize: 14 }}>
                    Real-time performance and system stats. Scroll down to test container scrolling.
                  </p>
                </div>

                {/* Metric Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  <StatCard label="Active Users" value="12,450" change="+14.2%" trend="up" />
                  <StatCard label="Total Revenue" value="$48,200" change="+8.5%" trend="up" />
                  <StatCard label="Open Tasks" value="34" change="-3" trend="down" />
                  <StatCard label="Server Load" value="28%" change="Optimal" trend="neutral" />
                </div>

                {/* Scrollable Container Cards */}
                {Array.from({ length: 8 }).map((_, idx) => (
                  <Card key={idx}>
                    <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: 14 }}>Project Module #{idx + 1}</h4>
                        <p style={{ margin: 0, fontSize: 12, color: 'var(--sp-text-subtle)' }}>
                          System task build process completed successfully.
                        </p>
                      </div>
                      <Badge variant={idx % 2 === 0 ? 'primary' : 'default'}>
                        {idx % 2 === 0 ? 'Active' : 'Pending'}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </AppShell>
          </div>

          <div style={{ marginTop: 24 }}>
            <CodePreview code={FULL_SHELL_CODE} codeOnly />
          </div>
        </section>

        {/* ── API Reference ──────────────────────────────────────────────── */}
        <section id="api">
          <h2>API Reference</h2>

          <h3>AppShell</h3>
          <table className="api-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>sidebar</code></td>
                <td><code>ReactNode</code></td>
                <td>—</td>
                <td>Left sidebar slot component (e.g. <code>&lt;Sidebar&gt;</code>).</td>
              </tr>
              <tr>
                <td><code>header</code></td>
                <td><code>ReactNode</code></td>
                <td>—</td>
                <td>Top header slot component (e.g. <code>&lt;AppHeader&gt;</code>).</td>
              </tr>
              <tr>
                <td><code>children</code></td>
                <td><code>ReactNode</code></td>
                <td>—</td>
                <td>Scrollable main content container slot.</td>
              </tr>
              <tr>
                <td><code>sidebarCollapsible</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>Enables rail handle for collapsing sidebar on desktop.</td>
              </tr>
              <tr>
                <td><code>sidebarResponsive</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>Enables mobile drawer overlay below breakpoint width.</td>
              </tr>
              <tr>
                <td><code>headerHeight</code></td>
                <td><code>number</code></td>
                <td><code>52</code></td>
                <td>Height in pixels for AppHeader matching SidebarHeader.</td>
              </tr>
              <tr>
                <td><code>padded</code></td>
                <td><code>boolean</code></td>
                <td><code>false</code></td>
                <td>Applies default padding to the main content container.</td>
              </tr>
              <tr>
                <td><code>breakpoint</code></td>
                <td><code>number</code></td>
                <td><code>768</code></td>
                <td>Viewport width breakpoint for mobile responsive mode.</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginTop: 24 }}>AppShellHamburger</h3>
          <table className="api-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>label</code></td>
                <td><code>string</code></td>
                <td><code>&quot;Toggle navigation menu&quot;</code></td>
                <td>Accessible label for mobile hamburger button.</td>
              </tr>
              <tr>
                <td><code>className</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>Additional CSS class.</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      {/* ── Mini Toc ───────────────────────────────────────────────────── */}
      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                className={`toc-link${activeSection === s.id ? ' active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
