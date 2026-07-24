/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useId, useState, type ReactNode } from 'react';
import { useSidebar } from './SidebarContext.js';
import { Icon } from '../../icons/Icon.js';

export interface SidebarMenuProps {
  icon?: string;
  label?: string;
  defaultExpanded?: boolean;
  showVerticalLine?: boolean;
  compact?: boolean;
  children?: ReactNode;
}

export function SidebarMenu({
  icon,
  label,
  defaultExpanded = false,
  showVerticalLine = true,
  compact = false,
  children,
}: SidebarMenuProps) {
  const { collapsed, isMobileOpen } = useSidebar();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const uid = useId();
  const menuContentId = `sp-sidebar-menu-${uid}-content`;

  const isCollapsedView = collapsed && !isMobileOpen;
  const collapsedAndNoIcon = collapsed && !icon;
  const showChildren = expanded && (!collapsed || isMobileOpen);

  const paddingLeft = icon
    ? 'var(--sp-space-2, 8px)'
    : !collapsed || isMobileOpen
      ? '0'
      : 'var(--sp-space-2, 8px)';

  return (
    <div>
      <button
        type="button"
        className={`sp-sidebar-menu${isCollapsedView ? ' sp-sidebar-menu--centered' : ''}`}
        style={{ paddingLeft, paddingRight: 'var(--sp-space-2, 8px)' }}
        aria-expanded={expanded}
        aria-controls={menuContentId}
        onClick={() => setExpanded((e) => !e)}
      >
        {icon ? (
          <Icon name={icon} size={16} />
        ) : collapsedAndNoIcon ? (
          <span className="sp-sidebar-menu__placeholder" />
        ) : null}
        <span className={`sp-sidebar-menu__label${isCollapsedView ? ' sp-sidebar-menu__label--collapsed' : ''}`}>
          {children}
        </span>
        <Icon
          name="chevron-right"
          size={12}
          className={`sp-sidebar-menu__chevron${expanded ? ' sp-sidebar-menu__chevron--expanded' : ''}${isCollapsedView ? ' sp-sidebar-menu__chevron--collapsed' : ''}`}
        />
      </button>

      {showChildren && (
        <div
          id={menuContentId}
          role="group"
          aria-label={label ?? undefined}
          className={[
            'sp-sidebar-menu__children',
            !compact || showVerticalLine ? 'sp-sidebar-menu__children--indented' : '',
            showVerticalLine ? 'sp-sidebar-menu__children--lined' : '',
          ].filter(Boolean).join(' ')}
        >
          {/* Render named children for items */}
        </div>
      )}
    </div>
  );
}

export interface SidebarMenuWithItemsProps extends SidebarMenuProps {
  items?: ReactNode;
}

/**
 * SidebarMenuGroup combines a menu trigger with expandable children.
 * Pass menu items as `children` of the sub-items prop.
 */
export function SidebarMenuGroup({
  icon,
  label,
  defaultExpanded = false,
  showVerticalLine = true,
  compact = false,
  children,
  items,
}: SidebarMenuWithItemsProps) {
  const { collapsed, isMobileOpen } = useSidebar();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const uid = useId();
  const menuContentId = `sp-sidebar-menu-${uid}-content`;

  const isCollapsedView = collapsed && !isMobileOpen;
  const collapsedAndNoIcon = collapsed && !icon;
  const showChildren = expanded && (!collapsed || isMobileOpen);

  const paddingLeft = icon
    ? 'var(--sp-space-2, 8px)'
    : !collapsed || isMobileOpen
      ? '0'
      : 'var(--sp-space-2, 8px)';

  return (
    <div>
      <button
        type="button"
        className={`sp-sidebar-menu${isCollapsedView ? ' sp-sidebar-menu--centered' : ''}`}
        style={{ paddingLeft, paddingRight: 'var(--sp-space-2, 8px)' }}
        aria-expanded={expanded}
        aria-controls={menuContentId}
        onClick={() => setExpanded((e) => !e)}
      >
        {icon ? (
          <Icon name={icon} size={16} />
        ) : collapsedAndNoIcon ? (
          <span className="sp-sidebar-menu__placeholder" />
        ) : null}
        <span className={`sp-sidebar-menu__label${isCollapsedView ? ' sp-sidebar-menu__label--collapsed' : ''}`}>
          {children}
        </span>
        <Icon
          name="chevron-right"
          size={12}
          className={`sp-sidebar-menu__chevron${expanded ? ' sp-sidebar-menu__chevron--expanded' : ''}${isCollapsedView ? ' sp-sidebar-menu__chevron--collapsed' : ''}`}
        />
      </button>

      {showChildren && (
        <div
          id={menuContentId}
          role="group"
          aria-label={label ?? undefined}
          className={[
            'sp-sidebar-menu__children',
            !compact || showVerticalLine ? 'sp-sidebar-menu__children--indented' : '',
            showVerticalLine ? 'sp-sidebar-menu__children--lined' : '',
          ].filter(Boolean).join(' ')}
        >
          {items}
        </div>
      )}
    </div>
  );
}
