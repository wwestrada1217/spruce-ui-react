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
} from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

// ── Code Samples ──────────────────────────────────────────────────────────────

const BASIC_CODE = `import {
  AppShell,
  Sidebar,
  SidebarContent,
  SidebarItem,
  AppHeader,
} from 'spruce-react';

<AppShell
  sidebar={
    <Sidebar allowResponsive={false} allowCollapsible={false}>
      <SidebarContent>
        <SidebarItem icon="home">Home</SidebarItem>
        <SidebarItem icon="inbox">Inbox</SidebarItem>
        <SidebarItem icon="calendar">Calendar</SidebarItem>
        <SidebarItem icon="search">Search</SidebarItem>
        <SidebarItem icon="settings">Settings</SidebarItem>
      </SidebarContent>
    </Sidebar>
  }
  header={<AppHeader title="My App" subtitle="Dashboard" />}
>
  <div style={{ padding: 24 }}>
    <h2>Main Content</h2>
    <p>Your application content goes here.</p>
  </div>
</AppShell>`;

const COLLAPSIBLE_CODE = `import {
  AppShell,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarItem,
  AppHeader,
} from 'spruce-react';

<AppShell
  sidebarCollapsible={true}
  sidebarResponsive={false}
  sidebar={
    <Sidebar allowResponsive={false}>
      <SidebarHeader showBorders>
        <strong>Workspace</strong>
      </SidebarHeader>
      <SidebarContent>
        <SidebarItem icon="home">Home</SidebarItem>
        <SidebarItem icon="bar-chart">Analytics</SidebarItem>
        <SidebarItem icon="users">Users</SidebarItem>
        <SidebarItem icon="settings">Settings</SidebarItem>
      </SidebarContent>
    </Sidebar>
  }
  header={<AppHeader title="Collapsible Shell" />}
>
  <div style={{ padding: 24 }}>
    <h2>Collapsible Sidebar</h2>
    <p>Drag the rail on the right edge of the sidebar to collapse or expand.</p>
  </div>
</AppShell>`;

const RESPONSIVE_CODE = `import {
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
} from 'spruce-react';

<AppShell
  sidebarCollapsible={true}
  sidebarResponsive={true}
  sidebar={
    <Sidebar>
      <SidebarHeader showBorders>
        <strong>🌲 Spruce App</strong>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarItem icon="home">Home</SidebarItem>
          <SidebarItem icon="inbox">Inbox</SidebarItem>
          <SidebarItem icon="calendar">Calendar</SidebarItem>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarItem icon="user">Profile</SidebarItem>
          <SidebarItem icon="settings">Preferences</SidebarItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter showBorders>
        <SidebarItem icon="log-out">Sign Out</SidebarItem>
      </SidebarFooter>
    </Sidebar>
  }
  header={
    <AppHeader
      title="Responsive Shell"
      logo={<AppShellHamburger />}
    />
  }
>
  <div style={{ padding: 24 }}>
    <h2>Responsive Layout</h2>
    <p>Resize your browser below 768px to see the sidebar become an overlay.</p>
    <p>Use the hamburger button in the header to toggle the mobile sidebar.</p>
  </div>
</AppShell>`;

const PADDED_CODE = `<AppShell
  padded
  sidebar={
    <Sidebar allowResponsive={false} allowCollapsible={false}>
      <SidebarContent>
        <SidebarItem icon="home">Home</SidebarItem>
        <SidebarItem icon="file">Documents</SidebarItem>
        <SidebarItem icon="image">Media</SidebarItem>
      </SidebarContent>
    </Sidebar>
  }
  header={<AppHeader title="Padded Content" />}
>
  <h2>Padded Main Area</h2>
  <p>The main content area uses default padding from the padded prop.</p>
</AppShell>`;

// ── Sections ──────────────────────────────────────────────────────────────────

interface Section {
  id: string;
  label: string;
}
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic Usage' },
  { id: 'collapsible', label: 'Collapsible' },
  { id: 'responsive', label: 'Responsive' },
  { id: 'padded', label: 'Padded Content' },
  { id: 'api', label: 'API Reference' },
];

// ── Preview wrapper ───────────────────────────────────────────────────────────

const shellPreviewStyle: React.CSSProperties = {
  height: 400,
  border: '1px solid var(--sp-border)',
  borderRadius: 'var(--sp-radius-lg, 8px)',
  overflow: 'hidden',
  position: 'relative',
};

export function AppShellPage() {
  const [activeSection, setActiveSection] = useState('basic');
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
        <h1>App Shell</h1>
        <p className="docs-desc">
          A full-viewport application shell layout with a sidebar on the left, a header pinned to
          the top, and a main content area filling the remaining space. Fully responsive&mdash;on
          small screens the sidebar collapses to an off-canvas overlay toggled by a hamburger button.
        </p>

        {/* ── Basic ──────────────────────────────────────────────────────── */}
        <section id="basic">
          <h2>Basic Usage</h2>
          <p>
            Pass <code>sidebar</code>, <code>header</code>, and <code>children</code> to compose the
            three layout zones.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div style={shellPreviewStyle}>
              <AppShell
                sidebarCollapsible={false}
                sidebarResponsive={false}
                sidebar={
                  <Sidebar allowResponsive={false} allowCollapsible={false}>
                    <SidebarContent>
                      <SidebarItem icon="home">Home</SidebarItem>
                      <SidebarItem icon="inbox">Inbox</SidebarItem>
                      <SidebarItem icon="calendar">Calendar</SidebarItem>
                      <SidebarItem icon="search">Search</SidebarItem>
                      <SidebarItem icon="settings">Settings</SidebarItem>
                    </SidebarContent>
                  </Sidebar>
                }
                header={<AppHeader title="My App" subtitle="Dashboard" />}
              >
                <div style={{ padding: 24 }}>
                  <h2 style={{ margin: '0 0 8px' }}>Main Content</h2>
                  <p style={{ margin: 0, color: 'var(--sp-text-muted)' }}>
                    Your application content goes here.
                  </p>
                </div>
              </AppShell>
            </div>
          </CodePreview>
        </section>

        {/* ── Collapsible ────────────────────────────────────────────────── */}
        <section id="collapsible">
          <h2>Collapsible Sidebar</h2>
          <p>
            When <code>sidebarCollapsible</code> is <code>true</code>, the sidebar can be collapsed
            via the drag rail on its right edge.
          </p>
          <CodePreview code={COLLAPSIBLE_CODE}>
            <div style={shellPreviewStyle}>
              <AppShell
                sidebarCollapsible={true}
                sidebarResponsive={false}
                sidebar={
                  <Sidebar allowResponsive={false}>
                    <SidebarHeader showBorders>
                      <strong>Workspace</strong>
                    </SidebarHeader>
                    <SidebarContent>
                      <SidebarItem icon="home">Home</SidebarItem>
                      <SidebarItem icon="bar-chart">Analytics</SidebarItem>
                      <SidebarItem icon="users">Users</SidebarItem>
                      <SidebarItem icon="settings">Settings</SidebarItem>
                    </SidebarContent>
                  </Sidebar>
                }
                header={<AppHeader title="Collapsible Shell" />}
              >
                <div style={{ padding: 24 }}>
                  <h2 style={{ margin: '0 0 8px' }}>Collapsible Sidebar</h2>
                  <p style={{ margin: 0, color: 'var(--sp-text-muted)' }}>
                    Drag the rail on the right edge of the sidebar to collapse or expand.
                  </p>
                </div>
              </AppShell>
            </div>
          </CodePreview>
        </section>

        {/* ── Responsive ─────────────────────────────────────────────────── */}
        <section id="responsive">
          <h2>Responsive Layout</h2>
          <p>
            With <code>sidebarResponsive</code> enabled (the default), the sidebar becomes a mobile
            overlay below the configured breakpoint. Place an <code>AppShellHamburger</code> inside
            the header to toggle the mobile sidebar.
          </p>
          <CodePreview code={RESPONSIVE_CODE}>
            <div style={shellPreviewStyle}>
              <AppShell
                sidebarCollapsible={true}
                sidebarResponsive={true}
                sidebar={
                  <Sidebar>
                    <SidebarHeader showBorders>
                      <strong>🌲 Spruce App</strong>
                    </SidebarHeader>
                    <SidebarContent>
                      <SidebarGroup>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarItem icon="home">Home</SidebarItem>
                        <SidebarItem icon="inbox">Inbox</SidebarItem>
                        <SidebarItem icon="calendar">Calendar</SidebarItem>
                      </SidebarGroup>
                      <SidebarSeparator />
                      <SidebarGroup>
                        <SidebarGroupLabel>Settings</SidebarGroupLabel>
                        <SidebarItem icon="user">Profile</SidebarItem>
                        <SidebarItem icon="settings">Preferences</SidebarItem>
                      </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter showBorders>
                      <SidebarItem icon="log-out">Sign Out</SidebarItem>
                    </SidebarFooter>
                  </Sidebar>
                }
                header={
                  <AppHeader
                    title="Responsive Shell"
                    logo={<AppShellHamburger />}
                  />
                }
              >
                <div style={{ padding: 24 }}>
                  <h2 style={{ margin: '0 0 8px' }}>Responsive Layout</h2>
                  <p style={{ margin: 0, color: 'var(--sp-text-muted)' }}>
                    Resize your browser below 768px to see the sidebar become an overlay.
                    Use the hamburger button in the header to toggle the mobile sidebar.
                  </p>
                </div>
              </AppShell>
            </div>
          </CodePreview>
        </section>

        {/* ── Padded ─────────────────────────────────────────────────────── */}
        <section id="padded">
          <h2>Padded Main Content</h2>
          <p>
            Set <code>padded</code> to apply default spacing to the main content area.
          </p>
          <CodePreview code={PADDED_CODE}>
            <div style={shellPreviewStyle}>
              <AppShell
                padded
                sidebarCollapsible={false}
                sidebarResponsive={false}
                sidebar={
                  <Sidebar allowResponsive={false} allowCollapsible={false}>
                    <SidebarContent>
                      <SidebarItem icon="home">Home</SidebarItem>
                      <SidebarItem icon="file">Documents</SidebarItem>
                      <SidebarItem icon="image">Media</SidebarItem>
                    </SidebarContent>
                  </Sidebar>
                }
                header={<AppHeader title="Padded Content" />}
              >
                <h2 style={{ margin: '0 0 8px' }}>Padded Main Area</h2>
                <p style={{ margin: 0, color: 'var(--sp-text-muted)' }}>
                  The main content area uses default padding from the padded prop.
                </p>
              </AppShell>
            </div>
          </CodePreview>
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
                <td>Sidebar content — pass a Sidebar component.</td>
              </tr>
              <tr>
                <td><code>header</code></td>
                <td><code>ReactNode</code></td>
                <td>—</td>
                <td>Header content — pass an AppHeader or custom header.</td>
              </tr>
              <tr>
                <td><code>children</code></td>
                <td><code>ReactNode</code></td>
                <td>—</td>
                <td>Main body content.</td>
              </tr>
              <tr>
                <td><code>sidebarCollapsible</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>Whether the sidebar can be collapsed on desktop.</td>
              </tr>
              <tr>
                <td><code>sidebarResponsive</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>Whether the sidebar adapts to mobile viewports.</td>
              </tr>
              <tr>
                <td><code>padded</code></td>
                <td><code>boolean</code></td>
                <td><code>false</code></td>
                <td>Apply default padding to the main content area.</td>
              </tr>
              <tr>
                <td><code>breakpoint</code></td>
                <td><code>number</code></td>
                <td><code>768</code></td>
                <td>Viewport width breakpoint for responsive behaviour (px).</td>
              </tr>
              <tr>
                <td><code>className</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>Additional CSS class for the root element.</td>
              </tr>
              <tr>
                <td><code>style</code></td>
                <td><code>CSSProperties</code></td>
                <td>—</td>
                <td>Inline styles for the root element.</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginTop: 32 }}>AppShellHamburger</h3>
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
                <td>Accessible label for the hamburger button.</td>
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

      {/* ── Mini-nav ───────────────────────────────────────────────────── */}
      <nav className="features-toc">
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                className={activeSection === s.id ? 'active' : ''}
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
