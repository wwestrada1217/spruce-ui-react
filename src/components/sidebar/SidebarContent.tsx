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
