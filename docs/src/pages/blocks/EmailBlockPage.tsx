import { useState, useEffect, useRef } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  Input,
  Button,
  Avatar,
  Badge,
  Icon,
} from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'email-app', label: 'Interactive Email App' },
  { id: 'code',      label: 'Source Code' },
];

interface EmailMessage {
  id: string;
  sender: string;
  avatar: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  unread: boolean;
  tag: string;
}

export function EmailBlockPage() {
  const [activeSection, setActiveSection] = useState('email-app');
  const mainRef = useRef<HTMLDivElement>(null);

  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'drafts' | 'archive'>('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string>('1');

  const emails: EmailMessage[] = [
    {
      id: '1',
      sender: 'Alex Rivera',
      avatar: 'AR',
      subject: 'Spruce React v0.2 Release Plan & Design Tokens Update',
      preview: 'Hey team, I reviewed the latest design tokens and icon registry additions for...',
      body: 'Hey team,\n\nI reviewed the latest design tokens and icon registry additions for the upcoming Spruce React v0.2 release. All WCAG AA contrast tests look great across both light and dark themes!\n\nLet me know if we need any final documentation reviews before deployment.\n\nBest,\nAlex',
      time: '10:42 AM',
      unread: true,
      tag: 'Work',
    },
    {
      id: '2',
      sender: 'Elena Rostova',
      avatar: 'ER',
      subject: 'Quarterly Design System Audit Summary',
      preview: 'The Q3 audit report for component coverage across all web products is complete...',
      body: 'Hi everyone,\n\nThe Q3 audit report for component coverage across all web products is complete. We reached 94% component adoption across desktop web apps!\n\nCheck out the full metrics in our dashboard.\n\nElena',
      time: 'Yesterday',
      unread: false,
      tag: 'Design',
    },
    {
      id: '3',
      sender: 'GitHub Security',
      avatar: 'GH',
      subject: '[Security Alert] Dependabot vulnerability resolved',
      preview: 'Dependabot has automatically updated package dependencies in spruce-ui-react...',
      body: 'Dependabot has resolved all open vulnerability alerts in spruce-ui-react workspace. No further action required.',
      time: 'Jul 25',
      unread: false,
      tag: 'System',
    },
  ];

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];

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

  const EMAIL_CODE = `import { Sidebar, SidebarItem, Card, Avatar, Badge, Button } from 'spruce-react';

export function EmailApplication() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 320px 1fr', gap: 0, height: 600 }}>
      {/* 1. Folders Sidebar */}
      <Sidebar enableRail={false}>
        <SidebarItem icon="inbox" active>Inbox</SidebarItem>
        <SidebarItem icon="send">Sent</SidebarItem>
        <SidebarItem icon="file-text">Drafts</SidebarItem>
      </Sidebar>

      {/* 2. Messages List */}
      <div className="email-list">
        {emails.map(email => (
          <div key={email.id} onClick={() => selectEmail(email)}>
            <h4>{email.sender}</h4>
            <p>{email.subject}</p>
          </div>
        ))}
      </div>

      {/* 3. Reading Pane */}
      <Card title={selectedEmail.subject}>
        <p>{selectedEmail.body}</p>
      </Card>
    </div>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Email App Block</h1>
        <p className="docs-desc">
          Complete 3-pane email application interface featuring folder navigation, message list threader, and reader view.
        </p>

        <section id="email-app" className="demo-section">
          <h2>Interactive Email Application</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '180px 300px 1fr', height: 520, background: 'var(--sp-bg-secondary)', borderRadius: 8, border: '1px solid var(--sp-border-subtle)', overflow: 'hidden' }}>
            {/* Pane 1: Sidebar Folders */}
            <div style={{ borderRight: '1px solid var(--sp-border-subtle)', background: 'var(--sp-bg-surface)', padding: 12 }}>
              <Button variant="primary" style={{ width: '100%', marginBottom: 16 }} size="sm">
                <Icon name="pen-tool" size={14} style={{ marginRight: 6 }} /> Compose
              </Button>
              <Sidebar enableRail={false} allowCollapsible={false} allowResponsive={false}>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>Folders</SidebarGroupLabel>
                    <SidebarItem icon="inbox" active={activeFolder === 'inbox'} onClick={() => setActiveFolder('inbox')}>
                      Inbox
                    </SidebarItem>
                    <SidebarItem icon="send" active={activeFolder === 'sent'} onClick={() => setActiveFolder('sent')}>
                      Sent
                    </SidebarItem>
                    <SidebarItem icon="file-text" active={activeFolder === 'drafts'} onClick={() => setActiveFolder('drafts')}>
                      Drafts
                    </SidebarItem>
                    <SidebarItem icon="folder" active={activeFolder === 'archive'} onClick={() => setActiveFolder('archive')}>
                      Archive
                    </SidebarItem>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
            </div>

            {/* Pane 2: Message List */}
            <div style={{ borderRight: '1px solid var(--sp-border-subtle)', background: 'var(--sp-bg-surface)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: 12, borderBottom: '1px solid var(--sp-border-subtle)' }}>
                <Input placeholder="Search messages..." size="sm" />
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {emails.map((email) => {
                  const isSelected = email.id === selectedEmailId;
                  return (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmailId(email.id)}
                      style={{
                        padding: 12,
                        borderBottom: '1px solid var(--sp-border-subtle)',
                        cursor: 'pointer',
                        background: isSelected ? 'var(--sp-bg-hover)' : 'transparent',
                        borderLeft: isSelected ? '3px solid var(--sp-primary)' : '3px solid transparent',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: email.unread ? 700 : 500, fontSize: 13 }}>{email.sender}</span>
                        <span style={{ fontSize: 11, color: 'var(--sp-text-subtle)' }}>{email.time}</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: email.unread ? 600 : 400, color: 'var(--sp-text-default)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>
                        {email.subject}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--sp-text-subtle)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {email.preview}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pane 3: Mail Reading Pane */}
            <div style={{ padding: 24, background: 'var(--sp-bg-surface)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--sp-border-subtle)' }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0' }}>{selectedEmail.subject}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={selectedEmail.sender} size="sm" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedEmail.sender}</div>
                      <div style={{ fontSize: 11, color: 'var(--sp-text-subtle)' }}>To: me &lt;user@sprucestack.io&gt;</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Badge variant="primary">{selectedEmail.tag}</Badge>
                  <Button variant="outline" size="sm">Reply</Button>
                </div>
              </div>

              <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--sp-text-default)' }}>
                {selectedEmail.body}
              </div>
            </div>
          </div>
        </section>

        <section id="code" className="demo-section">
          <h2>Source Code</h2>
          <CodePreview code={EMAIL_CODE}>
            <div style={{ padding: 12, color: 'var(--sp-text-subtle)', fontSize: 13 }}>
              Use this multi-pane block to build rich email and communication productivity tools.
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
