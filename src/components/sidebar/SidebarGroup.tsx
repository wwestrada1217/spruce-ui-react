/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Children, createContext, useContext, useId, useState, type ReactNode } from 'react';
import { useSidebar } from './SidebarContext.js';

export interface SidebarGroupProps {
  collapsible?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  children?: ReactNode;
}

interface SidebarGroupContextValue {
  labelId: string;
  itemsId: string;
  collapsible: boolean;
  expanded: boolean;
  toggle: () => void;
}

const GroupContext = createContext<SidebarGroupContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useSidebarGroup(): SidebarGroupContextValue | null {
  return useContext(GroupContext);
}

export function SidebarGroup({
  collapsible = false,
  expanded: controlledExpanded,
  defaultExpanded = true,
  onExpandedChange,
  children,
}: SidebarGroupProps) {
  const { collapsed, isMobileOpen } = useSidebar();
  const labelId = useId();
  const itemsId = useId();
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const expanded = controlledExpanded ?? internalExpanded;
  const toggle = () => {
    if (!collapsible) return;
    const next = !expanded;
    if (controlledExpanded === undefined) setInternalExpanded(next);
    onExpandedChange?.(next);
  };

  const labelledById = (!collapsed || isMobileOpen) ? labelId : undefined;
  const childArray = Children.toArray(children);
  const content = collapsible ? (
    <>
      {childArray[0]}
      <div id={itemsId} className={`sp-sidebar-group__items-wrapper${expanded ? '' : ' sp-sidebar-group__items-wrapper--collapsed'}`} aria-hidden={!expanded}>
        <div className="sp-sidebar-group__items">{childArray.slice(1)}</div>
      </div>
    </>
  ) : children;

  return (
    <GroupContext.Provider value={{ labelId, itemsId, collapsible, expanded, toggle }}>
      <div role="group" aria-labelledby={labelledById}>
        {content}
      </div>
    </GroupContext.Provider>
  );
}
