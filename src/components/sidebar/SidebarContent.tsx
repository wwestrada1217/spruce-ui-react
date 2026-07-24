/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { ReactNode } from 'react';

export interface SidebarContentProps {
  children?: ReactNode;
}

export function SidebarContent({ children }: SidebarContentProps) {
  return (
    <div className="sp-sidebar__body">
      <nav className="sp-sidebar__nav">
        {children}
      </nav>
    </div>
  );
}
