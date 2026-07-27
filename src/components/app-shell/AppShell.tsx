/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './AppShell.css';
import {
  useEffect,
  useState,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { SidebarProvider, useSidebar } from '../sidebar/SidebarContext.js';

export interface AppShellProps {
  /** Sidebar component slot (placed on the left) */
  sidebar?: ReactNode;
  /** Header component slot (placed on top, e.g. AppHeader) */
  header?: ReactNode;
  /** Main content container slot */
  children?: ReactNode;
  /** Allow sidebar to collapse on desktop. Defaults to true. */
  sidebarCollapsible?: boolean;
  /** Allow sidebar to be responsive (collapses to overlay on mobile). Defaults to true. */
  sidebarResponsive?: boolean;
  /** Apply default padding to the main content container. Defaults to false. */
  padded?: boolean;
  /** Viewport breakpoint in pixels for mobile responsive behavior. Defaults to 768. */
  breakpoint?: number;
  /** Height in pixels for the app header area to match sidebar header. Defaults to 52. */
  headerHeight?: number;
  /** Additional CSS class for the shell root element */
  className?: string;
  /** Additional inline styles for the shell root element */
  style?: CSSProperties;
}

/**
 * Hamburger icon component used as mobile sidebar menu toggle.
 */
function HamburgerIcon() {
  return (
    <svg
      className="sp-app-shell__hamburger-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

/**
 * Standalone hamburger toggle button component.
 * Can be passed as `logo` prop to `AppHeader` or used in custom headers.
 */
export interface AppShellHamburgerProps {
  /** Accessible label for the hamburger button */
  label?: string;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
}

export function AppShellHamburger({
  label = 'Toggle navigation menu',
  className,
  style,
}: AppShellHamburgerProps) {
  const { toggleMobile } = useSidebar();

  const cls = ['sp-app-shell__hamburger', className].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={cls}
      style={style}
      onClick={toggleMobile}
      aria-label={label}
    >
      <HamburgerIcon />
    </button>
  );
}

/**
 * Inner shell implementation consuming SidebarContext.
 */
function AppShellInner({
  sidebar,
  header,
  children,
  padded = false,
  breakpoint = 768,
  className,
  style,
}: Omit<AppShellProps, 'sidebarCollapsible' | 'sidebarResponsive'>) {
  const { allowResponsive } = useSidebar();
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches : false,
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);

  const showHamburger = allowResponsive && isSmallScreen && !!sidebar;

  const rootCls = ['sp-app-shell', className].filter(Boolean).join(' ');
  const mainCls = ['sp-app-shell__main', padded && 'sp-app-shell__main--padded']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootCls} style={style}>
      {/* Left Sidebar slot */}
      {sidebar}

      {/* Main Column (Top Header + Main Container) */}
      <div className="sp-app-shell__body">
        {(header || showHamburger) && (
          <div className="sp-app-shell__header">
            {showHamburger && (
              <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                <AppShellHamburger />
              </div>
            )}
            {header}
          </div>
        )}

        {/* Main Content Container */}
        <main className={mainCls} role="main">
          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * AppShell Block Component
 *
 * Provides a responsive layout block with a left sidebar, top header, and main container.
 * Automatically manages collapse and mobile drawer state via an internal `SidebarProvider`.
 */
export function AppShell({
  sidebarCollapsible = true,
  sidebarResponsive = true,
  ...rest
}: AppShellProps) {
  return (
    <SidebarProvider allowCollapsible={sidebarCollapsible} allowResponsive={sidebarResponsive}>
      <AppShellInner {...rest} />
    </SidebarProvider>
  );
}
