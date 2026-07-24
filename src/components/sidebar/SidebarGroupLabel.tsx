import { useId, type ReactNode } from 'react';
import { useSidebar } from './SidebarContext.js';

export interface SidebarGroupLabelProps {
  children?: ReactNode;
  /** Optional actions to render on the right side */
  actions?: ReactNode;
}

export function SidebarGroupLabel({ children, actions }: SidebarGroupLabelProps) {
  const { collapsed, isMobileOpen } = useSidebar();
  const isCollapsedView = collapsed && !isMobileOpen;
  const labelId = useId();

  return (
    <div
      id={labelId}
      className={`sp-sidebar-group-label${isCollapsedView ? ' sp-sidebar-group-label--collapsed' : ''}`}
    >
      <span className="sp-sidebar-group-label__text">{children}</span>
      {actions && (
        <span className="sp-sidebar-group-label__actions">{actions}</span>
      )}
    </div>
  );
}
