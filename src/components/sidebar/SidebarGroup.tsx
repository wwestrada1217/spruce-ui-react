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
