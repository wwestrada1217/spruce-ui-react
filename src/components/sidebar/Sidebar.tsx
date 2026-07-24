import {
  useEffect,
  useState,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { SidebarProvider, useSidebar } from './SidebarContext.js';
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
  const { collapsed, isMobileOpen, allowCollapsible, allowResponsive, toggle, setMobileOpen, setCollapsed } = useSidebar();
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches : false,
  );
  const prevCollapsed = useRef(collapsed);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mm = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsSmallScreen(mm.matches);
    const handler = (e: MediaQueryListEvent) => {
      setIsSmallScreen(e.matches);
      if (e.matches) {
        if (allowCollapsible) setCollapsed(true);
        setMobileOpen(false);
      }
    };
    mm.addEventListener('change', handler);
    return () => mm.removeEventListener('change', handler);
  }, [breakpoint, allowCollapsible, setCollapsed, setMobileOpen]);

  useEffect(() => {
    if (prevCollapsed.current !== collapsed) {
      prevCollapsed.current = collapsed;
      onCollapsedChange?.(collapsed);
    }
  }, [collapsed, onCollapsedChange]);

  const collapsedEffective = allowCollapsible ? collapsed : false;
  const smallEffective = allowResponsive ? isSmallScreen : false;
  const isExpanded = smallEffective || (!collapsedEffective && !smallEffective);

  const hostStyle: CSSProperties = {
    ...(expandedWidth ? { '--sp-sidebar-expanded-width': `${expandedWidth}px` } as CSSProperties : {}),
    ...(collapsedWidth ? { '--sp-sidebar-collapsed-width': `${collapsedWidth}px` } as CSSProperties : {}),
    ...(smallEffective ? { width: 0, overflow: 'visible', flexShrink: 0 } : {}),
  };

  const asideClass = [
    'sp-sidebar',
    smallEffective ? 'sp-sidebar--mobile' : '',
    isExpanded ? 'sp-sidebar--expanded' : '',
    collapsedEffective && !smallEffective ? 'sp-sidebar--collapsed' : '',
    smallEffective && isMobileOpen ? 'sp-sidebar--mobile-visible' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="sp-sidebar-host" style={hostStyle}>
      {isMobileOpen && smallEffective && (
        <button
          type="button"
          className="sp-sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        />
      )}
      <aside className={asideClass} aria-label={label}>
        {children}
        {enableRail && allowCollapsible && (
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
  ...rest
}: SidebarProps) {
  return (
    <SidebarProvider allowCollapsible={allowCollapsible} allowResponsive={allowResponsive}>
      <SidebarInner {...rest} />
    </SidebarProvider>
  );
}
