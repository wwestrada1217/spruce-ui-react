import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuGroup,
  SidebarItem,
  SidebarSeparator,
  Icon,
  Badge,
} from 'spruce-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { DocsSearch } from './DocsSearch';
import { DocsI18nPicker, useDocsI18n } from './DocsI18n';
import { NAV_SECTIONS, isNavBranch } from './nav';
import type { NavLeaf } from './nav';
import { SPRUCE_VERSION } from '../version';

interface DocsSidebarProps {
  activeHash: string;
}

export function DocsSidebar({ activeHash }: DocsSidebarProps) {
  const docs = useDocsI18n();
  return (
    <Sidebar label={docs.t('documentationNavigation')} enableRail={false} allowCollapsible={false} allowResponsive={false}>
      <SidebarHeader showBorders>
        <a className="docs-brand" href="#/" aria-label="Spruce React Design System — home">
          <Icon name="logo" size={32} aria-hidden="true" />
          <div className="docs-brand__text">
            <span className="docs-brand__name-row">
              <span className="docs-brand__name">Spruce</span>
              <span className="docs-brand__badge">v{SPRUCE_VERSION}</span>
            </span>
            <span className="docs-brand__subtitle">{docs.t('brandSubtitle')}</span>
          </div>
        </a>
      </SidebarHeader>

      <DocsSearch />

      <SidebarContent>
        {/* Home item */}
        <SidebarItem
          as="a"
          href="#/"
          icon="home"
          active={activeHash === '#/' || activeHash === '#' || activeHash === ''}
        >
          {docs.t('home')}
        </SidebarItem>

        <SidebarItem
          as="a"
          href="#/changelog"
          icon="clock"
          active={activeHash === '#/changelog'}
        >
          {docs.t('changelog')}
        </SidebarItem>

        <SidebarItem
          as="a"
          href="#/development"
          icon="code"
          active={activeHash === '#/development'}
        >
          {docs.t('development')}
        </SidebarItem>

        <SidebarSeparator />

        {NAV_SECTIONS.map((section, sectionIndex) => (
          <div key={section.label}>
            {sectionIndex > 0 && <SidebarSeparator />}
            <SidebarGroup>
              <SidebarGroupLabel>{docs.section(section.label)}</SidebarGroupLabel>
              {section.items.map((item) =>
                isNavBranch(item) ? (
                  <SidebarMenuGroup
                    key={item.label}
                    icon={item.icon}
                    items={item.children.map((child) => (
                      <SidebarItem
                        key={child.route}
                        as="a"
                        href={child.route}
                        icon={child.icon}
                        active={activeHash === child.route}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          {child.label}
                          {child.soon && <Badge variant='warning'>Soon</Badge>}
                        </div>
                      </SidebarItem>
                    ))}
                  >
                    {item.label}
                  </SidebarMenuGroup>
                ) : (
                  <SidebarItem
                    key={item.route}
                    as="a"
                    href={item.route}
                    icon={item.icon}
                    active={activeHash === item.route}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {item.label}
                      {(item as NavLeaf).soon && <Badge variant='warning'>Soon</Badge>}
                    </div>
                  </SidebarItem>
                )
              )}
            </SidebarGroup>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter showBorders>
        <div className="docs-footer-appearance">
          <span className="docs-footer-appearance__label">{docs.t('appearance')}</span>
          <div className="docs-sidebar-footer-controls">
            <ThemeSwitcher compact />
            <DocsI18nPicker compact />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
