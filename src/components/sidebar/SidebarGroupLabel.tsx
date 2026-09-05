/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useId, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { useSidebar } from './SidebarContext.js';
import { useSidebarGroup } from './SidebarGroup.js';

export interface SidebarGroupLabelProps {
  children?: ReactNode;
  /** Optional actions to render on the right side */
  actions?: ReactNode;
}

export function SidebarGroupLabel({ children, actions }: SidebarGroupLabelProps) {
  const { collapsed, isMobileOpen } = useSidebar();
  const group = useSidebarGroup();
  const isCollapsedView = collapsed && !isMobileOpen;
  const fallbackLabelId = useId();
  const labelId = group?.labelId ?? fallbackLabelId;
  const toggleLabel = () => {
    group?.toggle();
  };

  return (
    <div className={`sp-sidebar-group-label${isCollapsedView ? ' sp-sidebar-group-label--collapsed' : ''}`}>
      {group?.collapsible ? (
        <button
          id={labelId}
          type="button"
          className="sp-sidebar-group-label__toggle"
          aria-expanded={group.expanded}
          aria-controls={group.itemsId}
          onClick={toggleLabel}
        >
          <span className="sp-sidebar-group-label__text">{children}</span>
          <Icon
            name="chevron-right"
            size={12}
            className={`sp-sidebar-group-label__chevron${group.expanded ? ' sp-sidebar-group-label__chevron--expanded' : ''}`}
          />
        </button>
      ) : (
        <span id={labelId} className="sp-sidebar-group-label__text">{children}</span>
      )}
      {actions && (
        <span className="sp-sidebar-group-label__actions">{actions}</span>
      )}
    </div>
  );
}
