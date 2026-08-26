import './SidebarPopoverItem.css';
import type { ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { Popover } from '../popover/Popover.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { useSidebar } from './SidebarContext.js';
import type { Placement } from '../../utils/positioning.js';

export interface SidebarPopoverItemProps {
  icon?: string;
  label?: string;
  sublabel?: string;
  avatar?: ReactNode;
  placement?: Placement;
  ariaLabel?: string;
  panelAriaLabel?: string;
  dismissOnScroll?: boolean;
  dismissOnClickOutside?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
}

export function SidebarPopoverItem({
  icon,
  label,
  sublabel,
  avatar,
  placement = 'top-end',
  ariaLabel,
  panelAriaLabel,
  dismissOnScroll = true,
  dismissOnClickOutside = true,
  open,
  onOpenChange,
  children,
  className = '',
}: SidebarPopoverItemProps) {
  const { t } = useI18n();
  const { collapsed, isMobileOpen } = useSidebar();
  const isCollapsedView = collapsed && !isMobileOpen;
  const resolvedLabel = label ?? t('moreOptions');
  return (
    <Popover
      placement={placement}
      dismissOnScroll={dismissOnScroll}
      dismissOnClickOutside={dismissOnClickOutside}
      open={open}
      onOpenChange={onOpenChange}
      panelAriaLabel={panelAriaLabel ?? t('popoverContent')}
      trigger={<button type="button" className={['sp-sidebar-popover-item', isCollapsedView && 'sp-sidebar-popover-item--centered', className].filter(Boolean).join(' ')} aria-label={ariaLabel ?? resolvedLabel} title={resolvedLabel}>
        {avatar ?? (icon ? <Icon name={icon} size={16} /> : isCollapsedView ? <span className="sp-sidebar-popover-item__placeholder" /> : null)}
        <span className={['sp-sidebar-popover-item__text', isCollapsedView && 'sp-sidebar-popover-item__text--collapsed'].filter(Boolean).join(' ')}>
          <span className="sp-sidebar-popover-item__label">{resolvedLabel}</span>
          {sublabel && <span className="sp-sidebar-popover-item__sublabel">{sublabel}</span>}
        </span>
        <Icon name="chevron-up" size={12} className={isCollapsedView ? 'sp-sidebar-popover-item__chevron--collapsed' : undefined} />
      </button>}
    >
      <div className="sp-sidebar-popover-item__panel" role="region" aria-label={panelAriaLabel ?? t('popoverContent')}>{children}</div>
    </Popover>
  );
}
