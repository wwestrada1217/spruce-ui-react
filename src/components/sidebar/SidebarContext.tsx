/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface SidebarContextValue {
  /** True when the value comes from a mounted SidebarProvider. */
  isProvider: boolean;
  collapsed: boolean;
  isMobileOpen: boolean;
  isSmallScreen: boolean;
  allowCollapsible: boolean;
  allowResponsive: boolean;
  activeItem: string;
  toggle: () => void;
  toggleMobile: () => void;
  setMobileOpen: (value: boolean) => void;
  setCollapsed: (value: boolean) => void;
  setIsSmallScreen: (value: boolean) => void;
  setActiveItem: (item: string) => void;
}

// The context and hook intentionally live beside the provider so consumers have one import path.
// eslint-disable-next-line react-refresh/only-export-components
export const SidebarContext = createContext<SidebarContextValue>({
  isProvider: false,
  collapsed: false,
  isMobileOpen: false,
  isSmallScreen: false,
  allowCollapsible: true,
  allowResponsive: true,
  activeItem: '',
  toggle: () => {},
  toggleMobile: () => {},
  setMobileOpen: () => {},
  setCollapsed: () => {},
  setIsSmallScreen: () => {},
  setActiveItem: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export function useSidebar(): SidebarContextValue {
  return useContext(SidebarContext);
}

export interface SidebarProviderProps {
  allowCollapsible?: boolean;
  allowResponsive?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  defaultMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  activeItem?: string;
  onActiveItemChange?: (item: string) => void;
  children: ReactNode;
}

export function SidebarProvider({
  allowCollapsible = true,
  allowResponsive = true,
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  isMobileOpen: controlledMobileOpen,
  defaultMobileOpen = false,
  onMobileOpenChange,
  activeItem: controlledActiveItem,
  onActiveItemChange,
  children,
}: SidebarProviderProps) {
  const [internalCollapsed, setCollapsedState] = useState(defaultCollapsed);
  const [internalMobileOpen, setIsMobileOpen] = useState(defaultMobileOpen);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [internalActiveItem, setActiveItemState] = useState('');
  const collapsed = controlledCollapsed ?? internalCollapsed;
  const isMobileOpen = controlledMobileOpen ?? internalMobileOpen;
  const activeItem = controlledActiveItem ?? internalActiveItem;

  const toggle = useCallback(() => {
    if (!allowCollapsible) return;
    const next = !collapsed;
    if (controlledCollapsed === undefined) setCollapsedState(next);
    onCollapsedChange?.(next);
  }, [allowCollapsible, collapsed, controlledCollapsed, onCollapsedChange]);

  const toggleMobile = useCallback(() => {
    if (!allowResponsive) return;
    const next = !isMobileOpen;
    if (controlledMobileOpen === undefined) setIsMobileOpen(next);
    onMobileOpenChange?.(next);
  }, [allowResponsive, controlledMobileOpen, isMobileOpen, onMobileOpenChange]);

  const setMobileOpen = useCallback((value: boolean) => {
    if (controlledMobileOpen === undefined) setIsMobileOpen(value);
    onMobileOpenChange?.(value);
  }, [controlledMobileOpen, onMobileOpenChange]);

  const setCollapsed = useCallback((value: boolean) => {
    if (controlledCollapsed === undefined) setCollapsedState(value);
    onCollapsedChange?.(value);
  }, [controlledCollapsed, onCollapsedChange]);

  const setActiveItem = useCallback((item: string) => {
    if (controlledActiveItem === undefined) setActiveItemState(item);
    onActiveItemChange?.(item);
  }, [controlledActiveItem, onActiveItemChange]);

  return (
    <SidebarContext.Provider
      value={{
        isProvider: true,
        collapsed: allowCollapsible ? collapsed : false,
        isMobileOpen: allowResponsive ? isMobileOpen : false,
        isSmallScreen,
        allowCollapsible,
        allowResponsive,
        activeItem,
        toggle,
        toggleMobile,
        setMobileOpen,
        setCollapsed,
        setIsSmallScreen,
        setActiveItem,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
