/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './AppHeader.css';
import type { ReactNode } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';
import { useSidebar } from '../sidebar/SidebarContext.js';
import { Icon } from '../../icons/Icon.js';

export interface AppHeaderProps {
  logo?: ReactNode;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  actions?: ReactNode;
  /** Angular-compatible end slot; `actions` remains an alias. */
  headerEnd?: ReactNode;
  variant?: 'default' | 'filled' | 'transparent';
  sticky?: boolean;
  /** Height in pixels or CSS length. Defaults to the shared shell-bar token. */
  height?: number | string;
  /** Show the bottom border. */
  showBorders?: boolean;
  /** Show the sidebar toggle when a SidebarProvider is available. */
  showToggle?: boolean;
  ariaLabel?: string;
  onToggle?: () => void;
  className?: string;
}

export function AppHeader({
  logo,
  title,
  subtitle,
  children,
  actions,
  headerEnd,
  variant = 'default',
  sticky = true,
  height,
  showBorders = true,
  showToggle = true,
  ariaLabel,
  onToggle,
  className = '',
}: AppHeaderProps) {
  const { t } = useI18n();
  const sidebar = useSidebar();
  const toggleLabel = sidebar.isSmallScreen
    ? (sidebar.isMobileOpen ? t('closeSidebar') : t('navigation'))
    : (sidebar.collapsed ? t('expand') : t('collapse'));
  const classes = [
    'sp-app-header',
    `sp-app-header--${variant}`,
    sticky && 'sp-app-header--sticky',
    showBorders && 'sp-app-header--bordered',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header
      className={classes}
      style={height !== undefined ? { height } : undefined}
      role="banner"
      aria-label={ariaLabel}
    >
      <div className="sp-app-header__start">
        {showToggle && sidebar.isProvider && (
          <button
            type="button"
            className="sp-app-header__toggle"
            aria-expanded={sidebar.isSmallScreen ? sidebar.isMobileOpen : !sidebar.collapsed}
            aria-label={toggleLabel}
            onClick={() => {
              onToggle?.();
              if (sidebar.isSmallScreen) sidebar.toggleMobile();
              else sidebar.toggle();
            }}
          >
            <Icon name="panel-left" size={18} />
          </button>
        )}
        <div className="sp-app-header__left">
        {logo && <div className="sp-app-header__logo">{logo}</div>}
        {(title || subtitle) && (
          <div className="sp-app-header__titles">
            {title && <span className="sp-app-header__title">{title}</span>}
            {subtitle && <span className="sp-app-header__subtitle">{subtitle}</span>}
          </div>
        )}
        </div>

        {children && <div className="sp-app-header__content">{children}</div>}
      </div>

      {(headerEnd || actions) && (
        <div className="sp-app-header__right">{headerEnd ?? actions}</div>
      )}
    </header>
  );
}
