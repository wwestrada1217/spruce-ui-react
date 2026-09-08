import './SidebarAccountSwitcher.css';
import { useState, type ReactNode } from 'react';
import { Avatar } from '../avatar/Avatar.js';
import { Icon } from '../../icons/Icon.js';
import { Popover } from '../popover/Popover.js';
import { useSidebar } from './SidebarContext.js';
import { useI18n } from '../../i18n/i18n-context.js';

export interface SidebarMenuItem {
  label: string;
  icon?: string;
  command?: () => void;
}

export interface SidebarAccountSwitcherProps {
  username?: string;
  email?: string;
  avatar?: string;
  userMenuItems?: readonly SidebarMenuItem[];
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function SidebarAccountSwitcher({
  username = '',
  email = '',
  avatar = '',
  userMenuItems = [],
  children,
  open,
  onOpenChange,
  className = '',
}: SidebarAccountSwitcherProps) {
  const { t } = useI18n();
  const { collapsed, isMobileOpen } = useSidebar();
  const [internalOpen, setInternalOpen] = useState(false);
  const isCollapsedView = collapsed && !isMobileOpen;
  const setOpen = (next: boolean) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const menu = userMenuItems.length > 0 ? userMenuItems.slice(0, -1) : [];
  const trailing = userMenuItems.length > 0 ? userMenuItems[userMenuItems.length - 1] : undefined;
  const run = (item: SidebarMenuItem) => {
    item.command?.();
    setOpen(false);
  };

  return (
    <Popover
      placement="top-start"
      offset={4}
      open={open ?? internalOpen}
      onOpenChange={setOpen}
      className={['sp-sidebar-account-switcher', className].filter(Boolean).join(' ')}
      trigger={<button type="button" className={['sp-account__btn', isCollapsedView && 'sp-account__btn--centered', className].filter(Boolean).join(' ')} aria-label={isCollapsedView ? (username || t('accountMenu')) : undefined} aria-haspopup="menu">
        <Avatar size="sm" src={avatar} alt={username} name={username} />
        <span className={['sp-account__info', isCollapsedView && 'sp-account__info--collapsed'].filter(Boolean).join(' ')}>
          <span className="sp-account__name">{username}</span>
          <span className="sp-account__email">{email}</span>
        </span>
        <Icon name="chevron-down" size={12} className={isCollapsedView ? 'sp-account__chevron--collapsed' : undefined} />
      </button>}
    >
      <div className="sp-account__menu" role="menu" aria-label={username || t('accountMenu')}>
        {menu.map((item) => <button key={item.label} type="button" role="menuitem" className="sp-account__menu-item" onClick={() => run(item)}>{item.icon && <Icon name={item.icon} size={14} />}{item.label}</button>)}
        {children}
        {trailing && <button type="button" role="menuitem" className="sp-account__menu-item" onClick={() => run(trailing)}>{trailing.icon && <Icon name={trailing.icon} size={14} />}{trailing.label}</button>}
      </div>
    </Popover>
  );
}
