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
