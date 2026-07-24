/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { ReactNode } from 'react';
import { useSidebar } from './SidebarContext.js';

export interface SidebarHeaderProps {
  showBorders?: boolean;
  children?: ReactNode;
}

export function SidebarHeader({ showBorders = false, children }: SidebarHeaderProps) {
  const { collapsed, isMobileOpen } = useSidebar();
  const isCollapsedView = collapsed && !isMobileOpen;

  const cls = [
    'sp-sidebar-header',
    showBorders ? 'sp-sidebar-header--bordered' : '',
    isCollapsedView ? 'sp-sidebar-header--collapsed' : '',
  ].filter(Boolean).join(' ');

  return <div className={cls}>{children}</div>;
}
