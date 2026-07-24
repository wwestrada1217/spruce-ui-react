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
