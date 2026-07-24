/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { ReactNode } from 'react';
import { useSidebar } from './SidebarContext.js';

export interface SidebarFooterProps {
  showBorders?: boolean;
  children?: ReactNode;
}

export function SidebarFooter({ showBorders = false, children }: SidebarFooterProps) {
  const { collapsed, isMobileOpen } = useSidebar();
  const isExpanded = !collapsed || isMobileOpen;

  const cls = [
    'sp-sidebar-footer',
    isExpanded ? 'sp-sidebar-footer--expanded' : '',
    showBorders ? 'sp-sidebar-footer--bordered' : '',
  ].filter(Boolean).join(' ');

  return <div className={cls}>{children}</div>;
}
