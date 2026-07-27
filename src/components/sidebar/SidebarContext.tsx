/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface SidebarContextValue {
  collapsed: boolean;
  isMobileOpen: boolean;
  isSmallScreen: boolean;
  allowCollapsible: boolean;
  allowResponsive: boolean;
  breakpoint: number;
  toggle: () => void;
  toggleMobile: () => void;
  setMobileOpen: (value: boolean) => void;
  setCollapsed: (value: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    return {
      collapsed: false,
      isMobileOpen: false,
      isSmallScreen: false,
      allowCollapsible: true,
      allowResponsive: true,
      breakpoint: 768,
      toggle: () => {},
      toggleMobile: () => {},
      setMobileOpen: () => {},
      setCollapsed: () => {},
    };
  }
  return ctx;
}

export interface SidebarProviderProps {
  allowCollapsible?: boolean;
  allowResponsive?: boolean;
  breakpoint?: number;
  children: ReactNode;
}

export function SidebarProvider({
  allowCollapsible = true,
  allowResponsive = true,
  breakpoint = 768,
  children,
}: SidebarProviderProps) {
  const [collapsed, setCollapsedState] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches : false,
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mm = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => {
      setIsSmallScreen(e.matches);
      if (e.matches) {
        if (allowCollapsible) setCollapsedState(true);
        setIsMobileOpen(false);
      }
    };
    mm.addEventListener('change', handler);
    return () => mm.removeEventListener('change', handler);
  }, [breakpoint, allowCollapsible]);

  const toggle = useCallback(() => {
    if (!allowCollapsible) return;
    setCollapsedState((v) => !v);
  }, [allowCollapsible]);

  const toggleMobile = useCallback(() => {
    if (!allowResponsive) return;
    setIsMobileOpen((v) => !v);
  }, [allowResponsive]);

  const setMobileOpen = useCallback((value: boolean) => {
    setIsMobileOpen(value);
  }, []);

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        collapsed: allowCollapsible ? collapsed : false,
        isMobileOpen: allowResponsive ? isMobileOpen : false,
        isSmallScreen: allowResponsive ? isSmallScreen : false,
        allowCollapsible,
        allowResponsive,
        breakpoint,
        toggle,
        toggleMobile,
        setMobileOpen,
        setCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
