/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  useEffect,
  useState,
  useRef,
  useContext,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { SidebarContext, SidebarProvider, useSidebar } from './SidebarContext.js';
import './Sidebar.css';

export interface SidebarProps {
  /** Accessible name for the navigation landmark */
  label?: string;
  enableRail?: boolean;
  allowCollapsible?: boolean;
  allowResponsive?: boolean;
  /** Override the expanded sidebar width in pixels. Defaults to 256. */
  expandedWidth?: number | null;
  /** Override the collapsed sidebar width in pixels. Defaults to 48. */
  collapsedWidth?: number | null;
  /** Viewport breakpoint in pixels for responsive behaviour. Defaults to 768. */
  breakpoint?: number;
  /** Emits whenever the collapsed state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  children?: ReactNode;
}

function SidebarInner({
  label = 'Navigation',
  enableRail = true,
  expandedWidth = null,
  collapsedWidth = null,
  breakpoint = 768,
  onCollapsedChange,
  children,
}: Omit<SidebarProps, 'allowCollapsible' | 'allowResponsive'>) {
  const {
    collapsed,
    isMobileOpen,
    isSmallScreen: ctxSmallScreen,
    allowCollapsible,
    allowResponsive,
    toggle,
    setMobileOpen,
  } = useSidebar();

  const [localSmallScreen, setLocalSmallScreen] = useState(
    typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches : false,
  );
  const prevCollapsed = useRef(collapsed);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mm = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setLocalSmallScreen(e.matches);
    mm.addEventListener('change', handler);
    return () => mm.removeEventListener('change', handler);
  }, [breakpoint]);

  useEffect(() => {
    if (prevCollapsed.current !== collapsed) {
      prevCollapsed.current = collapsed;
      onCollapsedChange?.(collapsed);
    }
  }, [collapsed, onCollapsedChange]);

  const collapsedEffective = allowCollapsible ? collapsed : false;
  const isSmall = allowResponsive && (ctxSmallScreen || localSmallScreen);
  const isMobileView = isSmall || isMobileOpen;
  const isExpanded = isMobileView || (!collapsedEffective && !isMobileView);

  const hostStyle: CSSProperties = {
    ...(expandedWidth ? ({ '--sp-sidebar-expanded-width': `${expandedWidth}px` } as CSSProperties) : {}),
    ...(collapsedWidth ? ({ '--sp-sidebar-collapsed-width': `${collapsedWidth}px` } as CSSProperties) : {}),
    ...(isMobileView ? { width: 0, overflow: 'visible', flexShrink: 0 } : {}),
  };

  const asideClass = [
    'sp-sidebar',
    isMobileView ? 'sp-sidebar--mobile' : '',
    isExpanded ? 'sp-sidebar--expanded' : '',
    collapsedEffective && !isMobileView ? 'sp-sidebar--collapsed' : '',
    isMobileOpen ? 'sp-sidebar--mobile-visible' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="sp-sidebar-host" style={hostStyle}>
      {isMobileOpen && (
        <button
          type="button"
          className="sp-sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        />
      )}
      <aside className={asideClass} aria-label={label}>
        {children}
        {enableRail && allowCollapsible && !isMobileView && (
          <button
            type="button"
            className="sp-sidebar__rail"
            style={{ cursor: collapsedEffective ? 'e-resize' : 'w-resize' }}
            aria-expanded={!collapsedEffective}
            aria-label={collapsedEffective ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={toggle}
          >
            <span className="sp-sidebar__rail-indicator" />
          </button>
        )}
      </aside>
    </div>
  );
}

export function Sidebar({
  allowCollapsible = true,
  allowResponsive = true,
  breakpoint = 768,
  ...rest
}: SidebarProps) {
  const parentContext = useContext(SidebarContext);

  if (parentContext) {
    return <SidebarInner breakpoint={breakpoint} {...rest} />;
  }

  return (
    <SidebarProvider
      allowCollapsible={allowCollapsible}
      allowResponsive={allowResponsive}
      breakpoint={breakpoint}
    >
      <SidebarInner breakpoint={breakpoint} {...rest} />;
    </SidebarProvider>
  );
}
