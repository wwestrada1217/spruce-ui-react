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
  useCallback,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { SidebarProvider, useSidebar } from './SidebarContext.js';
import { useI18n } from '../../i18n/i18n-context.js';
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
  /** Show the active item accent. */
  showActiveAccent?: boolean;
  /** Fade the sidebar scrollbar until hover/focus. */
  autoHideScrollbar?: boolean;
  /** Alias for autoHideScrollbar, matching Angular's spelling. */
  autohideScrollbar?: boolean;
  /** Enable pointer and keyboard resizing of the expanded sidebar. */
  resizable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  /** Controlled mobile overlay state. */
  isMobileOpen?: boolean;
  defaultMobileOpen?: boolean;
  /** Emits whenever the collapsed state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  onMobileOpenChange?: (open: boolean) => void;
  /** Emits the final width after pointer or keyboard resizing. */
  onExpandedWidthChange?: (width: number) => void;
  children?: ReactNode;
}

function SidebarInner({
  label,
  enableRail = true,
  expandedWidth = null,
  collapsedWidth = null,
  breakpoint = 768,
  showActiveAccent = false,
  autoHideScrollbar = true,
  autohideScrollbar = true,
  resizable = false,
  minWidth = 200,
  maxWidth = 480,
  onExpandedWidthChange,
  onCollapsedChange,
  onMobileOpenChange,
  children,
}: Omit<SidebarProps, 'allowCollapsible' | 'allowResponsive' | 'collapsed' | 'defaultCollapsed' | 'isMobileOpen' | 'defaultMobileOpen'>) {
  const { t, isRtl } = useI18n();
  const resolvedLabel = label ?? t('navigation');
  const {
    collapsed,
    isMobileOpen,
    isSmallScreen,
    allowCollapsible,
    allowResponsive,
    toggle,
    setMobileOpen,
    setCollapsed,
    setIsSmallScreen,
  } = useSidebar();
  const [dragWidth, setDragWidth] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const prevCollapsed = useRef(collapsed);

  // The provider owns this state so AppHeader and Sidebar can be siblings.
  const localIsSmallScreen = isSmallScreen;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mm = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => {
      setIsSmallScreen(e.matches);
      if (e.matches) {
        if (allowCollapsible) setCollapsed(true);
        setMobileOpen(false);
      }
    };
    setIsSmallScreen(mm.matches);
    mm.addEventListener('change', handler);
    return () => mm.removeEventListener('change', handler);
  }, [breakpoint, allowCollapsible, setCollapsed, setIsSmallScreen, setMobileOpen]);

  useEffect(() => {
    if (prevCollapsed.current !== collapsed) {
      prevCollapsed.current = collapsed;
      onCollapsedChange?.(collapsed);
    }
  }, [collapsed, onCollapsedChange]);

  const prevMobileOpen = useRef(isMobileOpen);
  useEffect(() => {
    if (prevMobileOpen.current !== isMobileOpen) {
      prevMobileOpen.current = isMobileOpen;
      onMobileOpenChange?.(isMobileOpen);
    }
  }, [isMobileOpen, onMobileOpenChange]);

  const collapsedEffective = allowCollapsible ? collapsed : false;
  const smallEffective = allowResponsive ? localIsSmallScreen : false;
  const isExpanded = smallEffective || (!collapsedEffective && !smallEffective);

  const applyWidth = useCallback((width: number) => {
    setDragWidth(Math.round(Math.min(maxWidth, Math.max(minWidth, width))));
  }, [maxWidth, minWidth]);

  const onResizeStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!resizable) return;
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = dragWidth ?? expandedWidth ?? 256;
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    setIsResizing(true);
    let lastWidth = startWidth;
    const onMove = (moveEvent: PointerEvent) => {
      const delta = isRtl ? startX - moveEvent.clientX : moveEvent.clientX - startX;
      lastWidth = Math.round(Math.min(maxWidth, Math.max(minWidth, startWidth + delta)));
      applyWidth(lastWidth);
    };
    const onEnd = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onEnd);
      handle.removeEventListener('pointercancel', onEnd);
      setIsResizing(false);
      onExpandedWidthChange?.(lastWidth);
    };
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onEnd);
    handle.addEventListener('pointercancel', onEnd);
  };

  const onResizeKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!resizable) return;
    const step = event.shiftKey ? 32 : 8;
    let width = dragWidth ?? expandedWidth ?? 256;
    if (event.key === (isRtl ? 'ArrowRight' : 'ArrowLeft')) width -= step;
    else if (event.key === (isRtl ? 'ArrowLeft' : 'ArrowRight')) width += step;
    else if (event.key === 'Home') width = minWidth;
    else if (event.key === 'End') width = maxWidth;
    else return;
    event.preventDefault();
    applyWidth(width);
    onExpandedWidthChange?.(Math.round(Math.min(maxWidth, Math.max(minWidth, width))));
  };

  const hostStyle = {
    ...((dragWidth ?? expandedWidth) ? { '--sp-sidebar-expanded-width': `${dragWidth ?? expandedWidth}px` } : {}),
    ...(collapsedWidth ? { '--sp-sidebar-collapsed-width': `${collapsedWidth}px` } : {}),
    '--sp-sidebar-active-accent-width': showActiveAccent ? '2px' : '0px',
    ...(smallEffective ? { width: 0, overflow: 'visible', flexShrink: 0 } : {}),
  } as CSSProperties;

  const asideClass = [
    'sp-sidebar',
    smallEffective ? 'sp-sidebar--mobile' : '',
    isExpanded ? 'sp-sidebar--expanded' : '',
    collapsedEffective && !smallEffective ? 'sp-sidebar--collapsed' : '',
    smallEffective && isMobileOpen ? 'sp-sidebar--mobile-visible' : '',
    isResizing ? 'sp-sidebar--resizing' : '',
    autoHideScrollbar && autohideScrollbar ? 'sp-sidebar--autohide-scrollbar' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="sp-sidebar-host" style={hostStyle}>
      {isMobileOpen && smallEffective && (
        <button
          type="button"
          className="sp-sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label={t('closeSidebar')}
        />
      )}
      <aside className={asideClass} aria-label={resolvedLabel}>
        {children}
        {enableRail && allowCollapsible && !resizable && (
          <button
            type="button"
            className="sp-sidebar__rail"
            style={{ cursor: collapsedEffective ? 'e-resize' : 'w-resize' }}
            aria-expanded={!collapsedEffective}
            aria-label={collapsedEffective ? t('expand') : t('collapse')}
            onClick={toggle}
          >
            <span className="sp-sidebar__rail-indicator" />
          </button>
        )}
        {resizable && !collapsedEffective && !smallEffective && (
          <div
            className="sp-sidebar__resizer"
            role="separator"
            aria-orientation="vertical"
            aria-label={t('resizeSidebar')}
            aria-valuenow={dragWidth ?? expandedWidth ?? 256}
            aria-valuemin={minWidth}
            aria-valuemax={maxWidth}
            tabIndex={0}
            onPointerDown={onResizeStart}
            onKeyDown={onResizeKeyDown}
          >
            <span className="sp-sidebar__resizer-indicator" />
          </div>
        )}
      </aside>
    </div>
  );
}

export function Sidebar({
  allowCollapsible = true,
  allowResponsive = true,
  collapsed,
  defaultCollapsed,
  isMobileOpen,
  defaultMobileOpen,
  onCollapsedChange,
  onMobileOpenChange,
  ...rest
}: SidebarProps) {
  const context = useSidebar();
  const content = <SidebarInner {...rest} onCollapsedChange={context.isProvider ? onCollapsedChange : undefined} onMobileOpenChange={context.isProvider ? onMobileOpenChange : undefined} />;
  if (context.isProvider) return content;
  return (
    <SidebarProvider
      allowCollapsible={allowCollapsible}
      allowResponsive={allowResponsive}
      collapsed={collapsed}
      defaultCollapsed={defaultCollapsed}
      onCollapsedChange={onCollapsedChange}
      isMobileOpen={isMobileOpen}
      defaultMobileOpen={defaultMobileOpen}
      onMobileOpenChange={onMobileOpenChange}
    >
      {content}
    </SidebarProvider>
  );
}
