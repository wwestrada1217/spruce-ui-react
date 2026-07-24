import './AppHeader.css';
import type { ReactNode } from 'react';

export interface AppHeaderProps {
  logo?: ReactNode;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  actions?: ReactNode;
  variant?: 'default' | 'filled' | 'transparent';
  sticky?: boolean;
  height?: number;
  className?: string;
}

export function AppHeader({
  logo,
  title,
  subtitle,
  children,
  actions,
  variant = 'default',
  sticky = false,
  height = 56,
  className = '',
}: AppHeaderProps) {
  const classes = [
    'sp-app-header',
    `sp-app-header--${variant}`,
    sticky && 'sp-app-header--sticky',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header
      className={classes}
      style={{ height }}
      role="banner"
    >
      <div className="sp-app-header__left">
        {logo && <div className="sp-app-header__logo">{logo}</div>}
        {(title || subtitle) && (
          <div className="sp-app-header__titles">
            {title && <span className="sp-app-header__title">{title}</span>}
            {subtitle && <span className="sp-app-header__subtitle">{subtitle}</span>}
          </div>
        )}
      </div>

      {children && (
        <div className="sp-app-header__center">{children}</div>
      )}

      {actions && (
        <div className="sp-app-header__right">{actions}</div>
      )}
    </header>
  );
}
