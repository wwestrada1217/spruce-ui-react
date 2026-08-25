/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './SplitButton.css';
import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import {
  computePosition,
  getScrollParents,
  onClickOutside,
  type Placement,
} from '../../utils/positioning.js';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';

export interface SplitButtonItem {
  /** Display label. */
  label: string;
  /** Icon name from the icon registry. */
  icon?: string;
  /** Prevents interaction when `true`. */
  disabled?: boolean;
  /** Renders as a visual divider when `true` (other fields are ignored). */
  separator?: boolean;
  /** Callback invoked when the item is clicked. */
  command?: () => void;
}

export type SplitButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'danger-outline'
  | 'success'
  | 'success-outline';

export type SplitButtonSize = 'sm' | 'md' | 'lg';

export interface SplitButtonProps {
  /** Text displayed in the main button. */
  label?: string;
  /** Visual variant. */
  variant?: SplitButtonVariant;
  /** Size of both buttons. */
  size?: SplitButtonSize;
  /** Disables both buttons when `true`. */
  disabled?: boolean;
  /** Shows a loading spinner in the main button when `true`. */
  loading?: boolean;
  /** Stretches the component to full width. */
  fullWidth?: boolean;
  /** Icon rendered before the label in the main button. */
  iconLeft?: string | null;
  /** Icon rendered after the label in the main button. */
  iconRight?: string | null;
  /** Menu items shown when the toggle button is clicked. */
  items?: SplitButtonItem[];
  /** Preferred popup placement. RTL-aware collision positioning is applied. */
  placement?: Placement;
  /** Overflow priority used when rendered inside an adaptive toolbar. */
  priority?: number;
  /** Renders the primary action without visible text. */
  iconOnly?: boolean;
  /** Accessible name for the split-button group. */
  ariaLabel?: string;
  /** Accessible name for the menu trigger. */
  toggleAriaLabel?: string;
  /** Accessible name for the popup menu. */
  menuAriaLabel?: string;
  /** Controlled popup state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Callback fired when the main button is clicked. */
  onPrimaryClick?: (e: React.MouseEvent) => void;
  /** Callback fired when a menu item is selected. */
  onItemSelect?: (item: SplitButtonItem) => void;
  /** Additional CSS class applied to the root container. */
  className?: string;
}

const ICON_SIZES: Record<SplitButtonSize, number> = { sm: 12, md: 16, lg: 18 };

/**
 * A split button that combines a primary action button with a dropdown toggle
 * for secondary actions.
 *
 * @example
 * ```tsx
 * <SplitButton
 *   label="Save"
 *   variant="primary"
 *   items={[
 *     { label: 'Save as draft', icon: 'file', command: () => saveDraft() },
 *     { separator: true },
 *     { label: 'Save & close',  icon: 'check', command: () => saveAndClose() },
 *   ]}
 *   onPrimaryClick={() => save()}
 * />
 * ```
 */
export function SplitButton({
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  items = [],
  placement = 'bottom-end',
  priority = 0,
  iconOnly = false,
  ariaLabel,
  toggleAriaLabel,
  menuAriaLabel,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onPrimaryClick,
  onItemSelect,
  className = '',
}: SplitButtonProps) {
  const { t } = useI18n();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [menuMinWidth, setMenuMinWidth] = useState(0);
  const [ready, setReady] = useState(false);
  const menuId = useId();

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);

  const iconSize = ICON_SIZES[size];
  const primaryLabel = label ?? t('action');
  const setOpen = useCallback((next: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  }, [controlledOpen, onOpenChange]);

  const reposition = useCallback(() => {
    const anchor = containerRef.current;
    const menu = menuRef.current;
    if (!anchor || !menu) return;
    const result = computePosition(anchor, menu, placement, 4);
    setMenuPos({ top: result.top, left: result.left });
    setMenuMinWidth(anchor.offsetWidth);
    setReady(true);
  }, [placement]);

  // Position the menu after open
  useEffect(() => {
    if (!open) {
      // Reset positioning readiness when a controlled popup closes.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(false);
      return;
    }
    rafId.current = requestAnimationFrame(reposition);
    return () => cancelAnimationFrame(rafId.current);
  }, [open, reposition]);

  // Re-position on scroll
  useEffect(() => {
    if (!open) return;
    const anchor = containerRef.current;
    if (!anchor) return;
    const scrollables = getScrollParents(anchor);
    const onScroll = () => {
      rafId.current = requestAnimationFrame(reposition);
    };
    scrollables.forEach((el) => el.addEventListener('scroll', onScroll, { passive: true }));
    return () => {
      scrollables.forEach((el) => el.removeEventListener('scroll', onScroll));
      cancelAnimationFrame(rafId.current);
    };
  }, [open, reposition]);

  // Click-outside to dismiss
  useEffect(() => {
    if (!open) return;
    const els = [containerRef.current, menuRef.current].filter(Boolean) as HTMLElement[];
    return onClickOutside(els, () => setOpen(false));
  }, [open, setOpen]);

  function handleToggle() {
    if (disabled || loading) return;
    setOpen(!open);
  }

  function handleItemClick(item: SplitButtonItem) {
    if (item.disabled) return;
    item.command?.();
    onItemSelect?.(item);
    setOpen(false);
  }

  function handlePrimaryClick(e: React.MouseEvent) {
    if (disabled || loading) return;
    onPrimaryClick?.(e);
  }

  // CSS class builders
  const containerClasses = [
    'sp-split',
    fullWidth && 'sp-split--full',
    disabled && 'sp-split--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const btnClasses = [
    'sp-split__btn',
    `sp-split__btn--${variant}`,
    size !== 'md' && `sp-split__btn--${size}`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div ref={containerRef} className={containerClasses} role="group" aria-label={ariaLabel} data-priority={priority}>
        {/* Main action button */}
        <button
          className={`${btnClasses} sp-split__btn--main`}
          type="button"
          disabled={disabled || loading}
          onClick={handlePrimaryClick}
          aria-label={iconOnly ? (ariaLabel ?? primaryLabel) : undefined}
        >
          {iconLeft && <Icon name={iconLeft} size={iconSize} />}
          {!iconOnly && <span className="sp-split__label">{primaryLabel}</span>}
          {iconRight && <Icon name={iconRight} size={iconSize} />}
          {loading && <Icon name="loader" size={iconSize} className="sp-split__spinner" />}
        </button>

        {/* Dropdown toggle button */}
        <button
          className={`${btnClasses} sp-split__btn--toggle`}
          type="button"
          disabled={disabled || loading}
          onClick={handleToggle}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          aria-label={toggleAriaLabel ?? t('openActionsMenu')}
        >
          <Icon name="chevron-down" size={iconSize} />
        </button>
      </div>

      {/* Dropdown menu */}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            className="sp-split__menu"
            role="menu"
            aria-label={menuAriaLabel ?? t('moreActions')}
            style={{
              position: 'fixed',
              top: menuPos.top,
              left: menuPos.left,
              zIndex: 999,
              minWidth: menuMinWidth,
              opacity: ready ? 1 : 0,
            }}
          >
            {items.map((item, i) => {
              if (item.separator) {
                return <div key={i} className="sp-split__separator" role="separator" />;
              }
              return (
                <button
                  key={i}
                  className={[
                    'sp-split__menu-item',
                    item.disabled && 'sp-split__menu-item--disabled',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => handleItemClick(item)}
                >
                  {item.icon && <Icon name={item.icon} size={14} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
