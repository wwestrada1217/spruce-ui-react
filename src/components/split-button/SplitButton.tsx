import './SplitButton.css';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  computePosition,
  getScrollParents,
  onClickOutside,
} from '../../utils/positioning.js';
import { Icon } from '../../icons/Icon.js';

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
  onPrimaryClick,
  onItemSelect,
  className = '',
}: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [menuMinWidth, setMenuMinWidth] = useState(0);
  const [ready, setReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);

  const iconSize = ICON_SIZES[size];

  const reposition = useCallback(() => {
    const anchor = containerRef.current;
    const menu = menuRef.current;
    if (!anchor || !menu) return;
    const result = computePosition(anchor, menu, 'bottom-start', 4);
    setMenuPos({ top: result.top, left: result.left });
    setMenuMinWidth(anchor.offsetWidth);
    setReady(true);
  }, []);

  // Position the menu after open
  useEffect(() => {
    if (!open) {
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
  }, [open]);

  function handleToggle() {
    if (disabled || loading) return;
    setOpen((v) => !v);
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
      <div ref={containerRef} className={containerClasses}>
        {/* Main action button */}
        <button
          className={`${btnClasses} sp-split__btn--main`}
          type="button"
          disabled={disabled || loading}
          onClick={handlePrimaryClick}
          aria-label={label}
        >
          {iconLeft && <Icon name={iconLeft} size={iconSize} />}
          {label && <span className="sp-split__label">{label}</span>}
          {iconRight && <Icon name={iconRight} size={iconSize} />}
          {loading && <Icon name="loader" size={iconSize} className="sp-split__spinner" />}
        </button>

        {/* Dropdown toggle button */}
        <button
          className={`${btnClasses} sp-split__btn--toggle`}
          type="button"
          disabled={disabled || loading}
          onClick={handleToggle}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label="More options"
        >
          <Icon name="chevron-down" size={iconSize} />
        </button>
      </div>

      {/* Dropdown menu */}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="sp-split__menu"
            role="menu"
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
