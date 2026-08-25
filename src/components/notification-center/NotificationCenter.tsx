import './NotificationCenter.css';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { Button } from '../button/Button.js';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { Motif, type SpDecorativeBackground, type SpMotifAppearanceOption, type SpMotifPosition } from '../motif/Motif.js';

export type NotificationSeverity = 'info' | 'success' | 'warning' | 'danger' | 'progress';
export type NotificationCenterVariant = 'panel' | 'stack';
export type NotificationCenterTone = 'surface' | 'tinted' | 'contrast';
export type NotificationCenterPosition = 'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end' | 'inline';
export type NotificationCenterDensity = 'sm' | 'md';

export interface NotificationToolbarButton {
  id: string;
  icon: string;
  label: string;
  disabled?: boolean;
  pressed?: boolean;
}

export interface NotificationAction {
  id: string;
  label: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export interface NotificationItem {
  id: string;
  message: string;
  title?: string;
  severity?: NotificationSeverity;
  source?: string;
  actions?: readonly NotificationAction[];
  progress?: number | boolean;
  dismissible?: boolean;
  icon?: string;
  toolbar?: readonly NotificationToolbarButton[];
}

export interface NotificationActionEvent {
  notificationId: string;
  actionId: string;
}

export interface NotificationToolbarEvent {
  buttonId: string;
  notificationId?: string;
}

export interface NotificationCenterProps {
  notifications?: readonly NotificationItem[];
  variant?: NotificationCenterVariant;
  tone?: NotificationCenterTone;
  position?: NotificationCenterPosition;
  density?: NotificationCenterDensity;
  heading?: string;
  showHeader?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  dismissibleAll?: boolean;
  maxVisible?: number;
  closeOnEscape?: boolean;
  toolbar?: readonly NotificationToolbarButton[];
  onDismiss?: (notificationId: string) => void;
  onClearAll?: () => void;
  onAction?: (event: NotificationActionEvent) => void;
  onToolbarAction?: (event: NotificationToolbarEvent) => void;
  backgroundMotif?: string;
  motifIcon?: string;
  motifSvg?: string;
  motifPosition?: SpMotifPosition;
  motifSize?: number | string;
  motifOpacity?: number;
  motifRotation?: number;
  motifOffsetX?: number | string;
  motifOffsetY?: number | string;
  motifAppearance?: SpMotifAppearanceOption;
  motifColor?: string;
  decorativeBackground?: SpDecorativeBackground;
  className?: string;
}

const SEVERITY_ICON: Record<NotificationSeverity, string> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-circle',
  progress: 'loader',
};

function hasMotif(props: NotificationCenterProps): boolean {
  return Boolean(
    props.backgroundMotif || props.motifIcon || props.motifSvg || props.decorativeBackground?.motif ||
      props.decorativeBackground?.icon || props.decorativeBackground?.svg,
  );
}

export function NotificationCenter({
  notifications = [],
  variant = 'panel',
  tone = 'surface',
  position = 'bottom-end',
  density = 'md',
  heading,
  showHeader = true,
  collapsible = true,
  collapsed,
  onCollapsedChange,
  dismissibleAll = true,
  maxVisible = 0,
  closeOnEscape = false,
  toolbar = [],
  onDismiss,
  onClearAll,
  onAction,
  onToolbarAction,
  backgroundMotif,
  motifIcon,
  motifSvg,
  motifPosition,
  motifSize,
  motifOpacity,
  motifRotation,
  motifOffsetX,
  motifOffsetY,
  motifAppearance,
  motifColor,
  decorativeBackground,
  className = '',
}: NotificationCenterProps) {
  const { t } = useI18n();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = collapsed ?? internalCollapsed;
  const title = heading ?? t('notifications');
  const visible = maxVisible > 0 ? notifications.slice(0, maxVisible) : notifications;
  const overflow = Math.max(0, notifications.length - visible.length);
  const politeness = notifications.some((item) => (item.severity ?? 'info') === 'danger') ? 'assertive' : 'polite';

  useEffect(() => {
    if (!closeOnEscape) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && notifications.length > 0) {
        event.preventDefault();
        onClearAll?.();
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [closeOnEscape, notifications.length, onClearAll]);

  function toggleCollapsed() {
    const next = !isCollapsed;
    if (collapsed === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  }

  if (visible.length === 0) return null;

  const motif = hasMotif({
    backgroundMotif, motifIcon, motifSvg, decorativeBackground,
  });
  const surfaceClasses = [
    'sp-notification-center__surface',
    `sp-notification-center__surface--${variant}`,
    `sp-notification-center__surface--${tone}`,
    density === 'sm' && 'sp-notification-center__surface--sm',
    motif && variant === 'panel' && 'sp-notification-center__surface--has-motif',
  ].filter(Boolean).join(' ');
  const hostClasses = [
    'sp-notification-center',
    `sp-notification-center--${position}`,
    className,
  ].filter(Boolean).join(' ');
  const motifProps = {
    config: decorativeBackground,
    motif: backgroundMotif,
    icon: motifIcon,
    svg: motifSvg,
    position: motifPosition,
    size: motifSize,
    opacity: motifOpacity,
    rotation: motifRotation,
    offsetX: motifOffsetX,
    offsetY: motifOffsetY,
    appearance: motifAppearance,
    color: motifColor,
  };

  const content = (
    <div className={hostClasses}>
      <div className={surfaceClasses} role="region" aria-label={title}>
        {motif && variant === 'panel' && <Motif {...motifProps} />}
        {showHeader && variant === 'panel' && (
          <div className="sp-notification-center__header">
            <Icon name="bell" size={13} className="sp-notification-center__header-icon" />
            <span className="sp-notification-center__header-title">{title}</span>
            <span className="sp-notification-center__count">{notifications.length}</span>
            <span className="sp-notification-center__spacer" />
            {toolbar.map((button) => (
              <Button
                key={button.id}
                type="button"
                variant="ghost"
                size="sm"
                iconOnly
                iconLeft={button.icon}
                className="sp-notification-center__chrome"
                aria-label={button.label}
                title={button.label}
                aria-pressed={button.pressed}
                disabled={button.disabled}
                onClick={() => onToolbarAction?.({ buttonId: button.id })}
              />
            ))}
            {dismissibleAll && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                iconOnly
                iconLeft="check"
                className="sp-notification-center__chrome"
                aria-label={t('clearAll')}
                onClick={() => onClearAll?.()}
              />
            )}
            {collapsible && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                iconOnly
                iconLeft={isCollapsed ? 'chevron-up' : 'chevron-down'}
                className="sp-notification-center__chrome"
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? t('expand') : t('collapse')}
                onClick={toggleCollapsed}
              />
            )}
          </div>
        )}
        {!isCollapsed && (
          <ul className="sp-notification-center__list" aria-live={politeness} aria-relevant="additions text">
            {visible.map((item) => {
              const severity = item.severity ?? 'info';
              const itemHasChrome = Boolean(item.toolbar?.length) || item.dismissible !== false;
              const itemClasses = [
                'sp-notification-center__item',
                `sp-notification-center__item--${severity}`,
                itemHasChrome && 'sp-notification-center__item--has-chrome',
              ].filter(Boolean).join(' ');
              const progressValue = typeof item.progress === 'number' ? Math.min(100, Math.max(0, item.progress)) : undefined;
              return (
                <li key={item.id} className={itemClasses}>
                  {motif && variant === 'stack' && <Motif {...motifProps} />}
                  <Icon name={item.icon ?? SEVERITY_ICON[severity]} size={16} className={['sp-notification-center__severity', severity === 'progress' && 'sp-notification-center__severity--spin'].filter(Boolean).join(' ')} />
                  <div className="sp-notification-center__body">
                    {item.title && <p className="sp-notification-center__title">{item.title}</p>}
                    <p className="sp-notification-center__message">{item.message}</p>
                  </div>
                  {itemHasChrome && (
                    <div className="sp-notification-center__item-toolbar">
                      {item.toolbar?.map((button) => (
                        <Button
                          key={button.id}
                          type="button"
                          variant="ghost"
                          size="sm"
                          iconOnly
                          iconLeft={button.icon}
                          className="sp-notification-center__chrome"
                          aria-label={button.label}
                          title={button.label}
                          aria-pressed={button.pressed}
                          disabled={button.disabled}
                          onClick={() => onToolbarAction?.({ buttonId: button.id, notificationId: item.id })}
                        />
                      ))}
                      {item.dismissible !== false && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          iconOnly
                          iconLeft="x"
                          className="sp-notification-center__chrome"
                          aria-label={t('dismissNotification')}
                          onClick={() => onDismiss?.(item.id)}
                        />
                      )}
                    </div>
                  )}
                  {item.progress !== undefined && item.progress !== false && (
                    <div
                      className={['sp-notification-center__progress', item.progress === true && 'sp-notification-center__progress--indeterminate'].filter(Boolean).join(' ')}
                      role="progressbar"
                      aria-label={t('progress')}
                      aria-valuemin={item.progress === true ? undefined : 0}
                      aria-valuemax={item.progress === true ? undefined : 100}
                      aria-valuenow={item.progress === true ? undefined : progressValue}
                    >
                      <span className="sp-notification-center__progress-bar" style={item.progress === true ? undefined : { inlineSize: `${progressValue ?? 0}%` }} />
                    </div>
                  )}
                  {(item.source || item.actions?.length) && (
                    <div className="sp-notification-center__footer">
                      {item.source && <p className="sp-notification-center__source">{item.source}</p>}
                      {item.actions?.length ? (
                        <div className="sp-notification-center__actions">
                          {item.actions.map((action, index) => (
                            <Button
                              key={action.id}
                              type="button"
                              size="sm"
                              variant={action.variant ?? (index === 0 ? 'primary' : 'secondary')}
                              className="sp-notification-center__action"
                              disabled={action.disabled}
                              onClick={() => onAction?.({ notificationId: item.id, actionId: action.id })}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}
                </li>
              );
            })}
            {overflow > 0 && <li className="sp-notification-center__overflow">{t('moreNotifications', { count: overflow })}</li>}
          </ul>
        )}
      </div>
    </div>
  );

  if (position !== 'inline' && typeof document !== 'undefined') return createPortal(content, document.body);
  return content;
}
