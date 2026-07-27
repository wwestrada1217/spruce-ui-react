/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState, useEffect, useRef } from 'react';
import {
  AppShell,
  AppShellHamburger,
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

const BLOCK_CODE = `import {
  AppShell,
  AppShellHamburger,
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
} from 'spruce-react';

export function ApplicationShellBlock() {
  return (
    <AppShell
      headerHeight={52}
      sidebar={
        <Sidebar>
          <SidebarHeader showBorders>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', width: '100%', height: 44 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--sp-primary)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                S
              </div>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Spruce Studio</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarItem icon="layout-dashboard" active>Dashboard</SidebarItem>
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

          <SidebarFooter showBorders>
            <SidebarItem icon="log-out">Sign Out</SidebarItem>
          </SidebarFooter>
        </Sidebar>
      }
      header={
        <AppHeader
          height={52}
          logo={<AppShellHamburger />}
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
        <h1>Welcome Back</h1>
        <p>Here is your daily activity overview.</p>
      </div>
    </AppShell>
  );
}`;

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: 'overview', label: 'Live Block Demo' },
  { id: 'mobile-preview', label: 'Mobile Responsive View' },
  { id: 'code', label: 'Implementation Code' },
  { id: 'api', label: 'API Reference' },
];

export function AppShellBlockPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileSim, setMobileSim] = useState(false);
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
          a top AppHeader with aligned height (52px), and a scrollable main content container. Includes a mobile hamburger menu toggle button.
        </p>

        {/* ── Live Block Demo ───────────────────────────────────────────── */}
        <section id="overview">
          <h2>Live Block Demo</h2>
          <p>
            An interactive application shell layout block. You can collapse the sidebar using the right-edge rail handle, or toggle the responsive mobile drawer.
          </p>

          <div
            style={{
              height: 520,
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
                  <SidebarHeader showBorders>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '0 8px',
                        width: '100%',
                        height: 44,
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
                        }}
                      >
                        S
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }}>
                        Spruce Studio
                      </span>
                    </div>
                  </SidebarHeader>

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

                  <SidebarFooter showBorders>
                    <SidebarItem icon="log-out">Sign Out</SidebarItem>
                  </SidebarFooter>
                </Sidebar>
              }
              header={
                <AppHeader
                  height={52}
                  logo={<AppShellHamburger />}
                  title="Overview Dashboard"
                  subtitle="Project Workspace & Stats"
                  actions={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Badge variant="success">Online</Badge>
                      <Avatar name="Alex Johnson" size="sm" />
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
                  <h2 style={{ margin: '0 0 4px', fontSize: 20 }}>Workspace Dashboard</h2>
                  <p style={{ margin: 0, color: 'var(--sp-text-muted)', fontSize: 14 }}>
                    Overview of recent activity, active projects, and system metrics.
                  </p>
                </div>

                {/* Metric Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  <StatCard label="Active Users" value="12,450" change="+14.2%" trend="up" />
                  <StatCard label="Total Revenue" value="$48,200" change="+8.5%" trend="up" />
                  <StatCard label="Open Tasks" value="34" change="-3" trend="down" />
                  <StatCard label="Server Load" value="28%" change="Optimal" trend="neutral" />
                </div>

                {/* Sample Container Card */}
                <Card>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>Recent Activity</h3>
                    <p style={{ margin: 0, color: 'var(--sp-text-subtle)', fontSize: 13 }}>
                      All systems operating within normal parameters. Last deployment completed successfully 12 minutes ago.
                    </p>
                  </div>
                </Card>
              </div>
            </AppShell>
          </div>
        </section>

        {/* ── Mobile Responsive View Demo ───────────────────────────────── */}
        <section id="mobile-preview">
          <h2>Mobile Responsive Preview</h2>
          <p>
            Toggle mobile viewport simulation to see how the left sidebar collapses into an off-canvas drawer controlled by the header's hamburger menu button.
          </p>

          <div style={{ marginBottom: 12 }}>
            <Button
              size="sm"
              variant={mobileSim ? 'primary' : 'secondary'}
              onClick={() => setMobileSim(!mobileSim)}
            >
              {mobileSim ? 'Switch to Desktop Mode' : 'Simulate Mobile View (375px)'}
            </Button>
          </div>

          <div
            style={{
              width: mobileSim ? 375 : '100%',
              height: 480,
              margin: mobileSim ? '0 auto' : undefined,
              border: '1px solid var(--sp-border)',
              borderRadius: 'var(--sp-radius-lg, 8px)',
              overflow: 'hidden',
              transition: 'width 300ms ease',
              boxShadow: 'var(--sp-shadow-md)',
            }}
          >
            <AppShell
              breakpoint={mobileSim ? 9999 : 768}
              headerHeight={52}
              sidebar={
                <Sidebar breakpoint={mobileSim ? 9999 : 768}>
                  <SidebarHeader showBorders>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', width: '100%', height: 44 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>🌲 Mobile App</span>
                    </div>
                  </SidebarHeader>
                  <SidebarContent>
                    <SidebarItem icon="home" active>
                      Home
                    </SidebarItem>
                    <SidebarItem icon="search">Search</SidebarItem>
                    <SidebarItem icon="bell">Notifications</SidebarItem>
                    <SidebarItem icon="user">Profile</SidebarItem>
                  </SidebarContent>
                </Sidebar>
              }
              header={
                <AppHeader
                  height={52}
                  logo={<AppShellHamburger />}
                  title="Mobile App Shell"
                  actions={<Badge variant="primary">Mobile</Badge>}
                />
              }
            >
              <div style={{ padding: 16 }}>
                <h3>Mobile Container</h3>
                <p style={{ fontSize: 13, color: 'var(--sp-text-muted)' }}>
                  Tap the hamburger icon in the top header to open the responsive sidebar drawer.
                </p>
              </div>
            </AppShell>
          </div>
        </section>

        {/* ── Implementation Code ────────────────────────────────────────── */}
        <section id="code">
          <h2>Implementation Code</h2>
          <CodePreview code={BLOCK_CODE} />
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
                <td>Main content container slot.</td>
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
