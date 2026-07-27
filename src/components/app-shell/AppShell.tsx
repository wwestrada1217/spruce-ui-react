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
  useCallback,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { SidebarProvider, useSidebar } from '../sidebar/SidebarContext.js';

/* ────────────────────────────────────────────────────────────────────────────
 * AppShell — a full-viewport application layout with sidebar, header & main.
 *
 * The component wraps its sidebar child in a SidebarProvider so that the
 * sidebar collapse/expand and mobile open/close states are available to both
 * the sidebar and the hamburger toggle button in the header area.
 *
 * Usage:
 *   <AppShell
 *     sidebar={<Sidebar>…</Sidebar>}
 *     header={<AppHeader title="Dashboard" />}
 *   >
 *     <main content here />
 *   </AppShell>
 * ──────────────────────────────────────────────────────────────────────────── */

export interface AppShellProps {
  /** Sidebar content — pass a Sidebar component (without its own SidebarProvider wrapper). */
  sidebar?: ReactNode;
  /** Header content — pass an AppHeader or custom header. */
  header?: ReactNode;
  /** Main body content. */
  children?: ReactNode;
  /** Whether the sidebar is collapsible on desktop. Defaults to true. */
  sidebarCollapsible?: boolean;
  /** Whether the sidebar adapts responsively to mobile. Defaults to true. */
  sidebarResponsive?: boolean;
  /** Add default padding to the main content area. Defaults to false. */
  padded?: boolean;
  /** Viewport breakpoint in pixels for responsive behaviour. Defaults to 768. */
  breakpoint?: number;
  /** Additional className for the root element. */
  className?: string;
  /** Additional inline styles for the root element. */
  style?: CSSProperties;
}

/**
 * Hamburger menu icon (three horizontal lines).
 * Used as the mobile sidebar toggle.
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
 * Inner shell component that consumes the SidebarContext.
 * Separated so it can live inside the SidebarProvider.
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
  const { toggleMobile, allowResponsive } = useSidebar();
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

  const handleHamburger = useCallback(() => {
    toggleMobile();
  }, [toggleMobile]);

  const rootCls = ['sp-app-shell', className].filter(Boolean).join(' ');
  const mainCls = ['sp-app-shell__main', padded && 'sp-app-shell__main--padded']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootCls} style={style}>
      {/* Sidebar slot */}
      {sidebar}

      {/* Body: header + main */}
      <div className="sp-app-shell__body">
        {(header || showHamburger) && (
          <div className="sp-app-shell__header">
            {showHamburger && !header && (
              <div style={{ padding: 'var(--sp-space-2, 8px)' }}>
                <button
                  type="button"
                  className="sp-app-shell__hamburger"
                  style={{ display: 'inline-flex' }}
                  onClick={handleHamburger}
                  aria-label="Toggle navigation menu"
                >
                  <HamburgerIcon />
                </button>
              </div>
            )}
            {header}
          </div>
        )}

        <main className={mainCls} role="main">
          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * AppShell — responsive application layout component.
 *
 * Provides a sidebar + header + content layout that adapts to
 * viewport size. On small screens the sidebar is hidden and a
 * hamburger toggle becomes available.
 *
 * The component wraps the entire layout in a `SidebarProvider`
 * so that both the sidebar and the header hamburger button
 * share the same collapse / mobile-open state.
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

/* ────────────────────────────────────────────────────────────────────────────
 * AppShellHamburger — standalone hamburger button.
 *
 * Place inside a header slot (e.g. as AppHeader's `logo` prop) so the
 * user can toggle the mobile sidebar from anywhere in the header.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface AppShellHamburgerProps {
  /** Accessible label for the button */
  label?: string;
  className?: string;
}

export function AppShellHamburger({
  label = 'Toggle navigation menu',
  className,
}: AppShellHamburgerProps) {
  const { toggleMobile } = useSidebar();

  const cls = ['sp-app-shell__hamburger', className].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={cls}
      onClick={toggleMobile}
      aria-label={label}
    >
      <HamburgerIcon />
    </button>
  );
}
