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

const FULL_SHELL_CODE = `import {
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
        <h2>Scrollable Main Container</h2>
        <p>Content inside the container scrolls independently while header and sidebar stay fixed.</p>
      </div>
    </AppShell>
  );
}`;

const SCROLLABLE_CONTAINER_CODE = `/* The main content container in AppShell features an independent scrollbar */
<AppShell
  headerHeight={52}
  sidebar={<Sidebar>...</Sidebar>}
  header={<AppHeader title="Scrollable Container" height={52} />}
>
  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
    {/* Long list of cards or data items */}
    {Array.from({ length: 25 }).map((_, idx) => (
      <Card key={idx}>
        <div style={{ padding: 16 }}>Item #{idx + 1}</div>
      </Card>
    ))}
  </div>
</AppShell>`;

const MOBILE_DRAWER_CODE = `/* Below the 768px breakpoint, the sidebar transforms into an off-canvas drawer
   and a hamburger button automatically appears in the app header */
<AppShell
  breakpoint={768}
  headerHeight={52}
  sidebar={<Sidebar>...</Sidebar>}
  header={<AppHeader title="Mobile Responsive App" height={52} />}
>
  <div style={{ padding: 16 }}>
    <p>Tap the hamburger icon in the header on mobile screens to toggle the sidebar drawer.</p>
  </div>
</AppShell>`;

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: 'overview', label: 'Interactive App Shell Demo' },
  { id: 'scrollable', label: 'Scrollable Container' },
  { id: 'mobile-drawer', label: 'Mobile Drawer & Hamburger' },
  { id: 'header-footer', label: 'Sidebar Header & Footer' },
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
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                          Spruce Studio
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--sp-text-muted)', whiteSpace: 'nowrap' }}>
                          v2.4.0 Pro
                        </span>
                      </div>
                    </div>
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
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px 6px',
                        width: '100%',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar name="Alex Johnson" size="sm" />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, fontSize: 12, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                            Alex Johnson
                          </span>
                          <span style={{ fontSize: 10, color: 'var(--sp-text-muted)', whiteSpace: 'nowrap' }}>
                            Admin
                          </span>
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
                  logo={<AppShellHamburger />}
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
        </section>

        {/* ── Scrollable Content Container ─────────────────────────────── */}
        <section id="scrollable">
          <h2>1. Scrollable Content Container</h2>
          <p>
            The main content area (`.sp-app-shell__main`) is independently scrollable with custom styled scrollbars. The header and sidebar remain fixed in position while the content scrolls smoothly underneath.
          </p>

          <div
            style={{
              height: 380,
              border: '1px solid var(--sp-border)',
              borderRadius: 'var(--sp-radius-lg, 8px)',
              overflow: 'hidden',
              boxShadow: 'var(--sp-shadow-sm)',
            }}
          >
            <AppShell
              headerHeight={52}
              sidebar={
                <Sidebar allowResponsive={false} allowCollapsible={false}>
                  <SidebarHeader showBorders>
                    <div style={{ padding: '0 12px', fontWeight: 600, fontSize: 13, height: 44, display: 'flex', alignItems: 'center' }}>
                      Fixed Sidebar
                    </div>
                  </SidebarHeader>
                  <SidebarContent>
                    <SidebarItem icon="file-text" active>
                      Document Stream
                    </SidebarItem>
                    <SidebarItem icon="database">Records</SidebarItem>
                    <SidebarItem icon="archive">Archives</SidebarItem>
                  </SidebarContent>
                </Sidebar>
              }
              header={
                <AppHeader
                  height={52}
                  title="Scrollable Content Demo"
                  subtitle="Scroll down to test independent content scrolling"
                />
              }
            >
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Array.from({ length: 15 }).map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 6,
                      background: 'var(--sp-surface)',
                      border: '1px solid var(--sp-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500 }}>
                      Scrollable Row Item #{idx + 1}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--sp-text-muted)' }}>
                      Timestamp 14:38:{10 + idx}
                    </span>
                  </div>
                ))}
              </div>
            </AppShell>
          </div>

          <div style={{ marginTop: 16 }}>
            <CodePreview code={SCROLLABLE_CONTAINER_CODE} />
          </div>
        </section>

        {/* ── Mobile Responsive Drawer & Hamburger Menu ────────────────── */}
        <section id="mobile-drawer">
          <h2>2. Mobile Responsive View & Hamburger Menu</h2>
          <p>
            When in mobile view (below 768px), the sidebar automatically transforms into an off-canvas drawer overlay, and a hamburger menu button shows up in the app header to open/close the sidebar drawer.
          </p>

          <div style={{ marginBottom: 12 }}>
            <Button
              size="sm"
              variant={mobileSim ? 'primary' : 'secondary'}
              onClick={() => setMobileSim(!mobileSim)}
            >
              {mobileSim ? 'Switch to Desktop Mode' : 'Simulate Mobile Viewpoint (375px)'}
            </Button>
          </div>

          <div
            style={{
              width: mobileSim ? 375 : '100%',
              height: 440,
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
                      <span style={{ fontWeight: 600, fontSize: 14 }}>🌲 Mobile Drawer</span>
                    </div>
                  </SidebarHeader>
                  <SidebarContent>
                    <SidebarItem icon="home" active>
                      Home Feed
                    </SidebarItem>
                    <SidebarItem icon="search">Search</SidebarItem>
                    <SidebarItem icon="bell">Notifications</SidebarItem>
                    <SidebarItem icon="user">Profile Settings</SidebarItem>
                  </SidebarContent>
                  <SidebarFooter showBorders>
                    <SidebarItem icon="log-out">Logout</SidebarItem>
                  </SidebarFooter>
                </Sidebar>
              }
              header={
                <AppHeader
                  height={52}
                  title="Mobile App Header"
                  actions={<Badge variant="primary">Mobile Size</Badge>}
                />
              }
            >
              <div style={{ padding: 16 }}>
                <h3 style={{ margin: '0 0 8px' }}>Mobile Container View</h3>
                <p style={{ fontSize: 13, color: 'var(--sp-text-muted)' }}>
                  Notice the hamburger menu button automatically positioned in the top header. Tapping it slides in the sidebar drawer with a dark backdrop.
                </p>
              </div>
            </AppShell>
          </div>

          <div style={{ marginTop: 16 }}>
            <CodePreview code={MOBILE_DRAWER_CODE} />
          </div>
        </section>

        {/* ── Sidebar Header & Footer Samples ─────────────────────────── */}
        <section id="header-footer">
          <h2>3. Sidebar Header & Footer Samples</h2>
          <p>
            The layout supports structured header and footer slots inside the sidebar component using <code>SidebarHeader</code> and <code>SidebarFooter</code>.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {/* Sample 1: Brand Header + Profile Footer */}
            <Card>
              <div style={{ padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 14 }}>Brand Header & Profile Footer</h4>
                <div style={{ border: '1px solid var(--sp-border)', borderRadius: 8, height: 260, overflow: 'hidden' }}>
                  <Sidebar allowResponsive={false} allowCollapsible={false}>
                    <SidebarHeader showBorders>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px', width: '100%' }}>
                        <div style={{ width: 24, height: 24, borderRadius: 4, background: 'var(--sp-primary)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: 12 }}>
                          A
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>Acme Cloud</span>
                      </div>
                    </SidebarHeader>
                    <SidebarContent>
                      <SidebarItem icon="home" active>Home</SidebarItem>
                      <SidebarItem icon="layers">Services</SidebarItem>
                    </SidebarContent>
                    <SidebarFooter showBorders>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px' }}>
                        <Avatar name="Jane Doe" size="sm" />
                        <span style={{ fontSize: 12, fontWeight: 500 }}>Jane Doe</span>
                      </div>
                    </SidebarFooter>
                  </Sidebar>
                </div>
              </div>
            </Card>

            {/* Sample 2: Workspace Switcher Header + Action Footer */}
            <Card>
              <div style={{ padding: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 14 }}>Workspace Switcher & Action Footer</h4>
                <div style={{ border: '1px solid var(--sp-border)', borderRadius: 8, height: 260, overflow: 'hidden' }}>
                  <Sidebar allowResponsive={false} allowCollapsible={false}>
                    <SidebarHeader showBorders>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', width: '100%' }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>⚡ Team Space</span>
                        <Badge variant="success">Pro</Badge>
                      </div>
                    </SidebarHeader>
                    <SidebarContent>
                      <SidebarItem icon="folder" active>Projects</SidebarItem>
                      <SidebarItem icon="settings">Settings</SidebarItem>
                    </SidebarContent>
                    <SidebarFooter showBorders>
                      <SidebarItem icon="plus-circle">Add Workspace</SidebarItem>
                    </SidebarFooter>
                  </Sidebar>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* ── Implementation Code ────────────────────────────────────────── */}
        <section id="code">
          <h2>Implementation Code</h2>
          <CodePreview code={FULL_SHELL_CODE} />
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
