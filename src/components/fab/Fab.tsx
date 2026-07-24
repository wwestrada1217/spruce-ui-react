import './Fab.css';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Icon } from '../../icons/Icon.js';

export type FabVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type FabSize = 'sm' | 'md' | 'lg';
export type FabPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'none';

export interface FabAction {
  id: string;
  icon: string;
  label: string;
  color?: string;
  disabled?: boolean;
}

export interface FabProps {
  icon?: string;
  closeIcon?: string | null;
  label?: string;
  variant?: FabVariant;
  size?: FabSize;
  position?: FabPosition;
  actions?: FabAction[];
  open?: boolean;
  actionsAbove?: boolean;
  disabled?: boolean;
  onFabClick?: () => void;
  onOpenChange?: (open: boolean) => void;
  onActionClick?: (action: FabAction) => void;
}

const ICON_SIZES: Record<FabSize, number> = { sm: 18, md: 24, lg: 28 };
const ACTION_ICON_SIZE = 18;

export function Fab({
  icon = 'plus',
  closeIcon = null,
  label,
  variant = 'primary',
  size = 'md',
  position = 'bottom-right',
  actions = [],
  open: controlledOpen,
  actionsAbove = true,
  disabled = false,
  onFabClick,
  onOpenChange,
  onActionClick,
}: FabProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const hasActions = actions.length > 0;
  const isExtended = label && size !== 'sm';
  const iconSize = ICON_SIZES[size];

  const toggleOpen = useCallback(() => {
    if (!hasActions) {
      onFabClick?.();
      return;
    }
    const next = !isOpen;
    setInternalOpen(next);
    onOpenChange?.(next);
    onFabClick?.();
  }, [hasActions, isOpen, onFabClick, onOpenChange]);

  const handleActionClick = useCallback(
    (action: FabAction) => {
      if (action.disabled) return;
      onActionClick?.(action);
      setInternalOpen(false);
      onOpenChange?.(false);
    },
    [onActionClick, onOpenChange],
  );

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setInternalOpen(false);
        onOpenChange?.(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onOpenChange]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setInternalOpen(false);
        onOpenChange?.(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onOpenChange]);

  const currentIcon = isOpen && closeIcon ? closeIcon : icon;

  const containerClasses = [
    'sp-fab',
    `sp-fab--${variant}`,
    `sp-fab--${size}`,
    position !== 'none' && `sp-fab--${position}`,
    isOpen && 'sp-fab--open',
    isExtended && 'sp-fab--extended',
    disabled && 'sp-fab--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} ref={containerRef}>
      {hasActions && (
        <div
          className={[
            'sp-fab__actions',
            actionsAbove ? 'sp-fab__actions--above' : 'sp-fab__actions--below',
          ].join(' ')}
        >
          {actions.map((action, index) => (
            <div
              key={action.id}
              className={[
                'sp-fab__action',
                action.disabled && 'sp-fab__action--disabled',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                transitionDelay: isOpen
                  ? `${index * 40}ms`
                  : `${(actions.length - 1 - index) * 20}ms`,
              }}
            >
              <span className="sp-fab__action-label">{action.label}</span>
              <button
                className="sp-fab__action-btn"
                type="button"
                disabled={disabled || action.disabled}
                aria-label={action.label}
                style={action.color ? { color: action.color } : undefined}
                onClick={() => handleActionClick(action)}
              >
                <Icon name={action.icon} size={ACTION_ICON_SIZE} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        className="sp-fab__main"
        type="button"
        disabled={disabled}
        aria-label={label || 'Floating action'}
        aria-expanded={hasActions ? isOpen : undefined}
        onClick={toggleOpen}
      >
        <span
          className="sp-fab__icon"
          style={
            !closeIcon && isOpen
              ? { transform: 'rotate(45deg)' }
              : undefined
          }
        >
          <Icon name={currentIcon} size={iconSize} />
        </span>
        {isExtended && <span className="sp-fab__label">{label}</span>}
      </button>
    </div>
  );
}
