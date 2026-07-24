/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useId, type ReactNode } from 'react';
import { useSidebar } from './SidebarContext.js';

export interface SidebarGroupProps {
  children?: ReactNode;
}

export function SidebarGroup({ children }: SidebarGroupProps) {
  const { collapsed, isMobileOpen } = useSidebar();
  const labelId = useId();

  const labelledById = (!collapsed || isMobileOpen) ? labelId : undefined;

  return (
    <div
      role="group"
      aria-labelledby={labelledById}
      data-sidebar-group-label-id={labelId}
    >
      {children}
    </div>
  );
}
