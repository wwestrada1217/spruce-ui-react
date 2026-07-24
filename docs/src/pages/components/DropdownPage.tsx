import { useState, useEffect, useRef } from 'react';
import { Dropdown, Button, type DropdownItem } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const BASIC_CODE = `<Dropdown
  trigger={<Button iconRight="chevron-down">Options</Button>}
  items={[
    { label: 'Edit',     icon: 'edit',       command: () => console.log('edit') },
    { label: 'Duplicate',icon: 'copy' },
    { separator: true },
    { label: 'Delete',   icon: 'trash',      command: () => console.log('delete') },
  ]}
/>`;

const ICONS_CODE = `<Dropdown
  trigger={<Button variant="outline" iconRight="more-horizontal" iconOnly />}
  items={[
    { label: 'Profile',  icon: 'user' },
    { label: 'Settings', icon: 'settings' },
    { label: 'Help',     icon: 'help-circle' },
    { separator: true },
    { label: 'Sign out', icon: 'log-out' },
  ]}
  placement="bottom-end"
/>`;

const DISABLED_CODE = `<Dropdown
  trigger={<Button variant="secondary">Actions</Button>}
  items={[
    { label: 'Publish',  icon: 'upload-cloud' },
    { label: 'Archive',  icon: 'archive',  disabled: true },
    { label: 'Download', icon: 'download', disabled: true },
    { separator: true },
    { label: 'Delete',   icon: 'trash' },
  ]}
/>`;

const SUBMENU_CODE = `<Dropdown
  trigger={<Button variant="outline">Share</Button>}
  items={[
    { label: 'Export', icon: 'share-2', children: [
        { label: 'Export as PDF',  icon: 'file-text' },
        { label: 'Export as CSV',  icon: 'file' },
        { label: 'Export as JSON', icon: 'braces' },
      ]
    },
    { label: 'Copy link',   icon: 'link' },
    { label: 'Send by email',icon: 'mail' },
  ]}
/>`;

const ITEMS: DropdownItem[] = [
  { label: 'Edit',      icon: 'edit' },
  { label: 'Duplicate', icon: 'copy' },
  { separator: true },
  { label: 'Delete',    icon: 'trash' },
];

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic',    label: 'Basic usage' },
  { id: 'icons',    label: 'With icons' },
  { id: 'disabled', label: 'Disabled items' },
  { id: 'submenu',  label: 'Submenu' },
  { id: 'api',      label: 'API' },
];

export function DropdownPage() {
  const [activeSection, setActiveSection] = useState('basic');
  const [lastClicked, setLastClicked] = useState('');
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
    mainRef.current?.querySelectorAll('[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Dropdown</h1>
        <p className="docs-desc">
          A floating menu anchored to a trigger element.
          Supports icons, separators, disabled items, and nested submenus.
        </p>

        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic usage</h2>
          <p className="section-desc">
            Pass a <code>trigger</code> element and an <code>items</code> array.
            Use <code>command</code> to handle item clicks.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div className="demo-row" style={{ alignItems: 'flex-start', minHeight: 48 }}>
              <Dropdown
                trigger={<Button iconRight="chevron-down">Options</Button>}
                items={[
                  { label: 'Edit',      icon: 'edit',  command: () => setLastClicked('Edit') },
                  { label: 'Duplicate', icon: 'copy',  command: () => setLastClicked('Duplicate') },
                  { separator: true },
                  { label: 'Delete',    icon: 'trash', command: () => setLastClicked('Delete') },
                ]}
                onItemClick={(item) => setLastClicked(item.label ?? '')}
              />
              {lastClicked && (
                <span style={{ fontSize: 13, color: 'var(--sp-text-muted)' }}>
                  Last: {lastClicked}
                </span>
              )}
            </div>
          </CodePreview>
        </section>

        <section id="icons" className="demo-section" aria-labelledby="icons-heading">
          <h2 id="icons-heading">With icons</h2>
          <p className="section-desc">Add an <code>icon</code> name to any item for a leading icon.</p>
          <CodePreview code={ICONS_CODE}>
            <div className="demo-row" style={{ alignItems: 'flex-start', minHeight: 48 }}>
              <Dropdown
                trigger={<Button variant="outline" iconOnly iconLeft="more-horizontal" />}
                placement="bottom-end"
                items={[
                  { label: 'Profile',  icon: 'user' },
                  { label: 'Settings', icon: 'settings' },
                  { label: 'Help',     icon: 'help-circle' },
                  { separator: true },
                  { label: 'Sign out', icon: 'log-out' },
                ]}
              />
            </div>
          </CodePreview>
        </section>

        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled items</h2>
          <p className="section-desc">Set <code>disabled: true</code> on any item to make it non-interactive.</p>
          <CodePreview code={DISABLED_CODE}>
            <div className="demo-row" style={{ alignItems: 'flex-start', minHeight: 48 }}>
              <Dropdown
                trigger={<Button variant="secondary">Actions</Button>}
                items={[
                  { label: 'Publish',  icon: 'upload-cloud' },
                  { label: 'Archive',  icon: 'archive',  disabled: true },
                  { label: 'Download', icon: 'download', disabled: true },
                  { separator: true },
                  { label: 'Delete',   icon: 'trash' },
                ]}
              />
            </div>
          </CodePreview>
        </section>

        <section id="submenu" className="demo-section" aria-labelledby="submenu-heading">
          <h2 id="submenu-heading">Submenu</h2>
          <p className="section-desc">Provide a <code>children</code> array on any item to show a submenu on hover.</p>
          <CodePreview code={SUBMENU_CODE}>
            <div className="demo-row" style={{ alignItems: 'flex-start', minHeight: 48 }}>
              <Dropdown
                trigger={<Button variant="outline">Share</Button>}
                items={[
                  {
                    label: 'Export', icon: 'share-2',
                    children: [
                      { label: 'Export as PDF',  icon: 'file-text' },
                      { label: 'Export as CSV',  icon: 'file' },
                      { label: 'Export as JSON', icon: 'braces' },
                    ],
                  },
                  { label: 'Copy link',    icon: 'link' },
                  { label: 'Send by email',icon: 'mail' },
                ]}
              />
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>DropdownProps</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>trigger</code></td><td><code>ReactNode</code></td><td>—</td><td>Element that toggles the menu.</td></tr>
                <tr><td><code>items</code></td><td><code>DropdownItem[]</code></td><td><code>[]</code></td><td>Menu item definitions.</td></tr>
                <tr><td><code>placement</code></td><td><code>Placement</code></td><td><code>'bottom-start'</code></td><td>Preferred menu position.</td></tr>
                <tr><td><code>onItemClick</code></td><td><code>(item) =&gt; void</code></td><td>—</td><td>Called when any item is clicked.</td></tr>
                <tr><td><code>dismissOnClickOutside</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Close menu on outside click.</td></tr>
                <tr><td><code>className</code></td><td><code>string</code></td><td><code>''</code></td><td>Extra CSS class on the trigger wrapper.</td></tr>
              </tbody>
            </table>
          </div>
          <h3 style={{ marginTop: 24 }}>DropdownItem</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>label</code></td><td><code>string</code></td><td>Display text.</td></tr>
                <tr><td><code>icon</code></td><td><code>string</code></td><td>Icon name from the icon registry.</td></tr>
                <tr><td><code>disabled</code></td><td><code>boolean</code></td><td>Prevent interaction.</td></tr>
                <tr><td><code>separator</code></td><td><code>boolean</code></td><td>Render as a divider line.</td></tr>
                <tr><td><code>command</code></td><td><code>() =&gt; void</code></td><td>Called when the item is clicked.</td></tr>
                <tr><td><code>children</code></td><td><code>DropdownItem[]</code></td><td>Nested items shown in a submenu.</td></tr>
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
              <a
                className={`toc-link${activeSection === s.id ? ' active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
