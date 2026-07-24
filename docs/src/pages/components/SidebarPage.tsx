import { useState, useEffect, useRef } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarMenu,
  SidebarMenuGroup,
  SidebarSeparator,
} from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

// ── Code samples ────────────────────────────────────────────────────────────

const SIMPLE_CODE = `import {
  Sidebar,
  SidebarContent,
  SidebarItem,
} from 'spruce-react';

<Sidebar allowResponsive={false} allowCollapsible={false}>
  <SidebarContent>
    <SidebarItem>Home</SidebarItem>
    <SidebarItem>Inbox</SidebarItem>
    <SidebarItem>Calendar</SidebarItem>
    <SidebarItem>Search</SidebarItem>
    <SidebarItem>Settings</SidebarItem>
  </SidebarContent>
</Sidebar>`;

const ICONS_CODE = `import {
  Sidebar,
  SidebarContent,
  SidebarItem,
} from 'spruce-react';

<Sidebar allowResponsive={false} allowCollapsible={false}>
  <SidebarContent>
    <SidebarItem icon="home">Home</SidebarItem>
    <SidebarItem icon="copy">Inbox</SidebarItem>
    <SidebarItem icon="calendar">Calendar</SidebarItem>
    <SidebarItem icon="search">Search</SidebarItem>
    <SidebarItem icon="settings">Settings</SidebarItem>
  </SidebarContent>
</Sidebar>`;

const GROUPS_CODE = `import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
} from 'spruce-react';

<Sidebar allowResponsive={false} allowCollapsible={false}>
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarItem icon="home">Home</SidebarItem>
      <SidebarItem icon="copy">Inbox</SidebarItem>
      <SidebarItem icon="calendar">Calendar</SidebarItem>
    </SidebarGroup>
    <SidebarGroup>
      <SidebarGroupLabel>Account</SidebarGroupLabel>
      <SidebarItem icon="user">Profile</SidebarItem>
      <SidebarItem icon="settings">Settings</SidebarItem>
    </SidebarGroup>
  </SidebarContent>
</Sidebar>`;

const HEADER_FOOTER_CODE = `import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarItem,
} from 'spruce-react';
import { Icon } from 'spruce-react';

<Sidebar allowResponsive={false} allowCollapsible={false}>
  <SidebarHeader showBorders>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px' }}>
      <Icon name="logo" size={28} />
      <span style={{ fontWeight: 700 }}>Acme Corp</span>
    </div>
  </SidebarHeader>
  <SidebarContent>
    <SidebarItem icon="home">Home</SidebarItem>
    <SidebarItem icon="copy">Inbox</SidebarItem>
    <SidebarItem icon="search">Search</SidebarItem>
  </SidebarContent>
  <SidebarFooter showBorders>
    <div style={{ padding: '8px 10px', fontSize: 12, color: 'var(--sp-text-muted)' }}>
      v1.0.0
    </div>
  </SidebarFooter>
</Sidebar>`;

const MENUS_CODE = `import {
  Sidebar,
  SidebarContent,
  SidebarMenuGroup,
  SidebarItem,
} from 'spruce-react';

<Sidebar allowResponsive={false} allowCollapsible={false}>
  <SidebarContent>
    <SidebarMenuGroup
      defaultExpanded
      items={<>
        <SidebarItem icon="arrow-down-to-line">Installation</SidebarItem>
        <SidebarItem icon="settings">Project Structure</SidebarItem>
      </>}
    >
      Getting Started
    </SidebarMenuGroup>
    <SidebarMenuGroup
      items={<>
        <SidebarItem icon="layers">Components</SidebarItem>
        <SidebarItem icon="code">Functions</SidebarItem>
        <SidebarItem icon="terminal">CLI</SidebarItem>
      </>}
    >
      API Reference
    </SidebarMenuGroup>
  </SidebarContent>
</Sidebar>`;

const SEPARATOR_CODE = `import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarSeparator,
} from 'spruce-react';

<Sidebar allowResponsive={false} allowCollapsible={false}>
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarItem icon="home">Home</SidebarItem>
      <SidebarItem icon="search">Search</SidebarItem>
    </SidebarGroup>
    <SidebarSeparator />
    <SidebarGroup>
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarItem icon="settings">Preferences</SidebarItem>
    </SidebarGroup>
  </SidebarContent>
</Sidebar>`;

// ── Sections ─────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'simple',        label: 'Simple Sidebar' },
  { id: 'icons',         label: 'With Icons' },
  { id: 'groups',        label: 'Groups' },
  { id: 'header-footer', label: 'Header & Footer' },
  { id: 'menus',         label: 'Expandable Menus' },
  { id: 'separator',     label: 'Separators' },
  { id: 'api',           label: 'API' },
];

// ── Demo wrapper ─────────────────────────────────────────────────────────────
function DemoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="sidebar-demo-card">
      <div className="sidebar-demo-card__body">{children}</div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export function SidebarPage() {
  const [activeSection, setActiveSection] = useState('simple');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = document.getElementById('main-content');

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollContainer) {
          const atBottom =
            Math.abs(scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) < 2;
          if (atBottom) {
            setActiveSection(SECTIONS[SECTIONS.length - 1].id);
            return;
          }
        }
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      {
        root: scrollContainer ?? null,
        rootMargin: '-10% 0px -60% 0px',
        threshold: 0,
      },
    );

    for (const section of SECTIONS) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    const onScroll = () => {
      if (!scrollContainer) return;
      if (Math.abs(scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) < 2) {
        setActiveSection(SECTIONS[SECTIONS.length - 1].id);
      }
    };
    scrollContainer?.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      scrollContainer?.removeEventListener('scroll', onScroll);
    };
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="features-layout" ref={mainRef}>
      <div className="features-main">
        <h1>Sidebar</h1>
        <p className="docs-desc">
          A composable navigation sidebar with collapsible rail, groups, menus,
          header/footer slots, and workspace/account switchers.
        </p>

        {/* Simple Sidebar */}
        <section id="simple" className="demo-section" aria-labelledby="simple-heading">
          <h2 id="simple-heading">Simple Sidebar</h2>
          <p className="section-desc">Minimal setup with plain text items and no collapsing.</p>
          <ul className="demo-list">
            <li>Minimal setup with plain text items</li>
            <li>No icons, no collapsing — just a vertical nav list</li>
          </ul>
          <CodePreview code={SIMPLE_CODE} language="typescript">
            <DemoCard>
              <Sidebar allowResponsive={false} allowCollapsible={false}>
                <SidebarContent>
                  <SidebarItem>Home</SidebarItem>
                  <SidebarItem>Inbox</SidebarItem>
                  <SidebarItem>Calendar</SidebarItem>
                  <SidebarItem>Search</SidebarItem>
                  <SidebarItem>Settings</SidebarItem>
                </SidebarContent>
              </Sidebar>
            </DemoCard>
          </CodePreview>
        </section>

        {/* With Icons */}
        <section id="icons" className="demo-section" aria-labelledby="icons-heading">
          <h2 id="icons-heading">With Icons</h2>
          <p className="section-desc">Add an icon to each item via the <code>icon</code> prop using Icon registry names.</p>
          <ul className="demo-list">
            <li>Add an icon to each item via the <code>icon</code> prop</li>
            <li>Icons use the Icon registry names</li>
          </ul>
          <CodePreview code={ICONS_CODE} language="typescript">
            <DemoCard>
              <Sidebar allowResponsive={false} allowCollapsible={false}>
                <SidebarContent>
                  <SidebarItem icon="home">Home</SidebarItem>
                  <SidebarItem icon="copy">Inbox</SidebarItem>
                  <SidebarItem icon="calendar">Calendar</SidebarItem>
                  <SidebarItem icon="search">Search</SidebarItem>
                  <SidebarItem icon="settings">Settings</SidebarItem>
                </SidebarContent>
              </Sidebar>
            </DemoCard>
          </CodePreview>
        </section>

        {/* Groups */}
        <section id="groups" className="demo-section" aria-labelledby="groups-heading">
          <h2 id="groups-heading">Groups</h2>
          <p className="section-desc">Organize items into labelled groups with <code>SidebarGroup</code> and <code>SidebarGroupLabel</code>.</p>
          <ul className="demo-list">
            <li>Organize items under <code>&lt;SidebarGroup&gt;</code></li>
            <li>Use <code>&lt;SidebarGroupLabel&gt;</code> for section headings</li>
          </ul>
          <CodePreview code={GROUPS_CODE} language="typescript">
            <DemoCard>
              <Sidebar allowResponsive={false} allowCollapsible={false}>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarItem icon="home">Home</SidebarItem>
                    <SidebarItem icon="copy">Inbox</SidebarItem>
                    <SidebarItem icon="calendar">Calendar</SidebarItem>
                  </SidebarGroup>
                  <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarItem icon="user">Profile</SidebarItem>
                    <SidebarItem icon="settings">Settings</SidebarItem>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
            </DemoCard>
          </CodePreview>
        </section>

        {/* Header & Footer */}
        <section id="header-footer" className="demo-section" aria-labelledby="header-footer-heading">
          <h2 id="header-footer-heading">Header &amp; Footer</h2>
          <p className="section-desc">Use header and footer slots for workspace switchers and account menus.</p>
          <ul className="demo-list">
            <li>Use <code>&lt;SidebarHeader&gt;</code> and <code>&lt;SidebarFooter&gt;</code></li>
            <li>Place any custom content in header/footer slots</li>
          </ul>
          <CodePreview code={HEADER_FOOTER_CODE} language="typescript">
            <DemoCard>
              <Sidebar allowResponsive={false} allowCollapsible={false}>
                <SidebarHeader showBorders>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', width: '100%' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-text)', flexShrink: 0 }}>
                      A
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Acme Corp</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.2 }}>Enterprise</div>
                    </div>
                  </div>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarItem icon="home">Home</SidebarItem>
                  <SidebarItem icon="copy">Inbox</SidebarItem>
                  <SidebarItem icon="search">Search</SidebarItem>
                </SidebarContent>
                <SidebarFooter showBorders>
                  <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--primary-text)' }}>
                      WE
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Wendell Estrada</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>wendell@example.com</div>
                    </div>
                  </div>
                </SidebarFooter>
              </Sidebar>
            </DemoCard>
          </CodePreview>
        </section>

        {/* Expandable Menus */}
        <section id="menus" className="demo-section" aria-labelledby="menus-heading">
          <h2 id="menus-heading">Expandable Menus</h2>
          <p className="section-desc">Collapsible menu sections with optional vertical guide lines and default-open state.</p>
          <ul className="demo-list">
            <li>Use <code>&lt;SidebarMenuGroup&gt;</code> for collapsible sections</li>
            <li>Set <code>defaultExpanded</code> for default-open, <code>showVerticalLine</code> for a visual guide</li>
          </ul>
          <CodePreview code={MENUS_CODE} language="typescript">
            <DemoCard>
              <Sidebar allowResponsive={false} allowCollapsible={false}>
                <SidebarContent>
                  <SidebarMenuGroup
                    defaultExpanded
                    items={
                      <>
                        <SidebarItem icon="arrow-down">Installation</SidebarItem>
                        <SidebarItem icon="settings">Project Structure</SidebarItem>
                      </>
                    }
                  >
                    Getting Started
                  </SidebarMenuGroup>
                  <SidebarMenuGroup
                    items={
                      <>
                        <SidebarItem icon="layers">Components</SidebarItem>
                        <SidebarItem icon="code">Functions</SidebarItem>
                        <SidebarItem icon="terminal">CLI</SidebarItem>
                      </>
                    }
                  >
                    API Reference
                  </SidebarMenuGroup>
                </SidebarContent>
              </Sidebar>
            </DemoCard>
          </CodePreview>
        </section>

        {/* Separators */}
        <section id="separator" className="demo-section" aria-labelledby="separator-heading">
          <h2 id="separator-heading">Separators</h2>
          <p className="section-desc">Use <code>SidebarSeparator</code> to visually divide sections of the sidebar.</p>
          <ul className="demo-list">
            <li>Place <code>&lt;SidebarSeparator /&gt;</code> anywhere inside <code>SidebarContent</code></li>
          </ul>
          <CodePreview code={SEPARATOR_CODE} language="typescript">
            <DemoCard>
              <Sidebar allowResponsive={false} allowCollapsible={false}>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarItem icon="home">Home</SidebarItem>
                    <SidebarItem icon="search">Search</SidebarItem>
                  </SidebarGroup>
                  <SidebarSeparator />
                  <SidebarGroup>
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarItem icon="settings">Preferences</SidebarItem>
                    <SidebarItem icon="user">Account</SidebarItem>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
            </DemoCard>
          </CodePreview>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>

          <h3>Sidebar</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>enableRail</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show the collapse rail on the right edge</td></tr>
                <tr><td><code>allowCollapsible</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Allow the sidebar to be collapsed to a narrow rail</td></tr>
                <tr><td><code>allowResponsive</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Enable responsive mobile overlay behavior</td></tr>
                <tr><td><code>expandedWidth</code></td><td><code>number</code></td><td><code>256</code></td><td>Width in pixels when expanded</td></tr>
                <tr><td><code>collapsedWidth</code></td><td><code>number</code></td><td><code>48</code></td><td>Width in pixels when collapsed to rail</td></tr>
                <tr><td><code>breakpoint</code></td><td><code>number</code></td><td><code>768</code></td><td>Pixel width at which responsive mode activates</td></tr>
                <tr><td><code>label</code></td><td><code>string</code></td><td><code>'Navigation'</code></td><td>Accessible label for the navigation landmark</td></tr>
                <tr><td><code>onCollapsedChange</code></td><td><code>(v: boolean) =&gt; void</code></td><td>—</td><td>Callback fired when collapsed state changes</td></tr>
              </tbody>
            </table>
          </div>

          <h3>SidebarHeader</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>showBorders</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show a bottom border below the header</td></tr>
              </tbody>
            </table>
          </div>

          <h3>SidebarFooter</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>showBorders</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show a top border above the footer</td></tr>
              </tbody>
            </table>
          </div>

          <h3>SidebarItem</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>as</code></td><td><code>ElementType</code></td><td><code>'button'</code></td><td>Polymorphic element type (e.g. <code>'a'</code>)</td></tr>
                <tr><td><code>icon</code></td><td><code>string</code></td><td>—</td><td>Icon name from the Icon registry</td></tr>
                <tr><td><code>active</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Marks the item as the current active page</td></tr>
                <tr><td><code>collapsible</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show a chevron indicating the item can expand</td></tr>
              </tbody>
            </table>
          </div>

          <h3>SidebarMenuGroup</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>icon</code></td><td><code>string</code></td><td>—</td><td>Icon name for the menu trigger</td></tr>
                <tr><td><code>defaultExpanded</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether the menu is open by default</td></tr>
                <tr><td><code>showVerticalLine</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Show a vertical guide line for child items</td></tr>
                <tr><td><code>compact</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Remove child indentation when vertical line is hidden</td></tr>
                <tr><td><code>items</code></td><td><code>ReactNode</code></td><td>—</td><td>Child items rendered in the expanded panel</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Table of Contents */}
      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                className={`toc-link${activeSection === section.id ? ' active' : ''}`}
                onClick={() => scrollTo(section.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && scrollTo(section.id)}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
