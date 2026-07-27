import { useState, useEffect, useRef } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  Card,
  Input,
  Switch,
  Button,
  Avatar,
} from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'settings', label: 'Interactive Settings Layout' },
  { id: 'code',     label: 'Source Code' },
];

export function SettingsBlockPage() {
  const [activeSection, setActiveSection] = useState('settings');
  const mainRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');

  // Form states
  const [name, setName] = useState('Sarah Connor');
  const [email, setEmail] = useState('sarah.connor@sprucestack.io');
  const [bio, setBio] = useState('Lead Product Engineer');

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [marketingNotifs, setMarketingNotifs] = useState(true);

  const [twoFactor, setTwoFactor] = useState(true);

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

  const SETTINGS_CODE = `import { Sidebar, SidebarItem, Card, Input, Switch, Button } from 'spruce-react';

export function SettingsApp() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
      <Sidebar enableRail={false}>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarItem icon="user" active>Profile</SidebarItem>
          <SidebarItem icon="bell">Notifications</SidebarItem>
          <SidebarItem icon="shield">Security</SidebarItem>
        </SidebarGroup>
      </Sidebar>

      <Card title="Profile Information">
        {/* Settings form content */}
      </Card>
    </div>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Settings Block</h1>
        <p className="docs-desc">
          Full settings application layout powered by Spruce Sidebar navigation with profile, notification, and security preferences.
        </p>

        <section id="settings" className="demo-section">
          <h2>Interactive Settings App Preview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, minHeight: 480, background: 'var(--sp-bg-secondary)', borderRadius: 8, border: '1px solid var(--sp-border-subtle)', overflow: 'hidden' }}>
            {/* Left Settings Sidebar */}
            <div style={{ borderRight: '1px solid var(--sp-border-subtle)', background: 'var(--sp-bg-surface)', padding: 16 }}>
              <Sidebar enableRail={false} allowCollapsible={false} allowResponsive={false}>
                <SidebarHeader showBorders={false}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>Account Settings</span>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>Personal</SidebarGroupLabel>
                    <SidebarItem icon="user" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
                      Profile
                    </SidebarItem>
                    <SidebarItem icon="bell" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>
                      Notifications
                    </SidebarItem>
                    <SidebarItem icon="shield" active={activeTab === 'security'} onClick={() => setActiveTab('security')}>
                      Security
                    </SidebarItem>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
            </div>

            {/* Right Settings Content */}
            <div style={{ padding: 24 }}>
              {activeTab === 'profile' && (
                <Card>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Profile Preferences</div>
                  <div style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginBottom: 20 }}>Manage your public profile information</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <Avatar name={name} size="xl" />
                      <Button variant="outline" size="sm">Change Avatar</Button>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Full name</label>
                      <Input value={name} onChange={setName} />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email address</label>
                      <Input type="email" value={email} onChange={setEmail} />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Role / Bio</label>
                      <Input value={bio} onChange={setBio} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="primary">Save Changes</Button>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === 'notifications' && (
                <Card>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Notification Preferences</div>
                  <div style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginBottom: 20 }}>Control how and when you receive notifications</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Email Notifications</div>
                        <div style={{ fontSize: 13, color: 'var(--sp-text-subtle)' }}>Receive daily updates and summary digests</div>
                      </div>
                      <Switch checked={emailNotifs} onChange={setEmailNotifs} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Push Notifications</div>
                        <div style={{ fontSize: 13, color: 'var(--sp-text-subtle)' }}>Instant alerts on browser desktop</div>
                      </div>
                      <Switch checked={pushNotifs} onChange={setPushNotifs} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Product & Feature Announcements</div>
                        <div style={{ fontSize: 13, color: 'var(--sp-text-subtle)' }}>Stay informed about new Spruce updates</div>
                      </div>
                      <Switch checked={marketingNotifs} onChange={setMarketingNotifs} />
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === 'security' && (
                <Card>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Security & Authentication</div>
                  <div style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginBottom: 20 }}>Manage two-factor auth and account credentials</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Two-Factor Authentication (2FA)</div>
                        <div style={{ fontSize: 13, color: 'var(--sp-text-subtle)' }}>Secure your account using authenticator app</div>
                      </div>
                      <Switch checked={twoFactor} onChange={setTwoFactor} />
                    </div>

                    <div style={{ paddingTop: 12, borderTop: '1px solid var(--sp-border-subtle)' }}>
                      <Button variant="outline">Reset Password</Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </section>

        <section id="code" className="demo-section">
          <h2>Source Code</h2>
          <CodePreview code={SETTINGS_CODE}>
            <div style={{ padding: 12, color: 'var(--sp-text-subtle)', fontSize: 13 }}>
              Use this layout block for application user settings and preferences.
            </div>
          </CodePreview>
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
