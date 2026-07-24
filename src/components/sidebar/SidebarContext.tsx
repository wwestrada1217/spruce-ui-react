import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface SidebarContextValue {
  collapsed: boolean;
  isMobileOpen: boolean;
  allowCollapsible: boolean;
  allowResponsive: boolean;
  toggle: () => void;
  toggleMobile: () => void;
  setMobileOpen: (value: boolean) => void;
  setCollapsed: (value: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  isMobileOpen: false,
  allowCollapsible: true,
  allowResponsive: true,
  toggle: () => {},
  toggleMobile: () => {},
  setMobileOpen: () => {},
  setCollapsed: () => {},
});

export function useSidebar(): SidebarContextValue {
  return useContext(SidebarContext);
}

export interface SidebarProviderProps {
  allowCollapsible?: boolean;
  allowResponsive?: boolean;
  children: ReactNode;
}

export function SidebarProvider({
  allowCollapsible = true,
  allowResponsive = true,
  children,
}: SidebarProviderProps) {
  const [collapsed, setCollapsedState] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
        allowCollapsible,
        allowResponsive,
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
