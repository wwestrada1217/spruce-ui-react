/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import { useSidebar } from './SidebarContext.js';
import { Icon } from '../../icons/Icon.js';

export interface SidebarItemProps<T extends ElementType = 'button'> {
  as?: T;
  icon?: string;
  label?: string;
  active?: boolean;
  collapsible?: boolean;
  children?: ReactNode;
}

type SidebarItemPolymorphicProps<T extends ElementType> =
  SidebarItemProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof SidebarItemProps<T>>;

export function SidebarItem<T extends ElementType = 'button'>({
  as,
  icon,
  label,
  active = false,
  collapsible = false,
  children,
  ...rest
}: SidebarItemPolymorphicProps<T>) {
  const Component = (as ?? 'button') as ElementType;
  const { collapsed, isMobileOpen } = useSidebar();
  const isCollapsedView = collapsed && !isMobileOpen;

  const hasIcon = !!icon;
  const resolvedLabel = label || (typeof children === 'string' ? children : undefined);

  const cls = [
    'sp-sidebar-item',
    isCollapsedView ? 'sp-sidebar-item--centered' : '',
    active ? 'sp-sidebar-item--active' : '',
  ].filter(Boolean).join(' ');

  return (
    <Component
      className={cls}
      aria-current={active ? 'page' : undefined}
      title={isCollapsedView ? resolvedLabel ?? undefined : undefined}
      aria-label={isCollapsedView ? resolvedLabel ?? undefined : undefined}
      {...rest}
    >
      {hasIcon ? (
        <Icon name={icon!} size={16} />
      ) : collapsed ? (
        <span className="sp-sidebar-item__placeholder" />
      ) : null}
      <span className={`sp-sidebar-item__label${isCollapsedView ? ' sp-sidebar-item__label--collapsed' : ''}`}>
        {children}
      </span>
      {collapsible && (
        <Icon
          name="chevron-right"
          size={12}
          className={`sp-sidebar-item__chevron${isCollapsedView ? ' sp-sidebar-item__chevron--collapsed' : ''}`}
        />
      )}
    </Component>
  );
}
