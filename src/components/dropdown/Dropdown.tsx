/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Dropdown.css';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import {
  computePosition,
  getScrollParents,
  onClickOutside,
  type Placement,
} from '../../utils/positioning.js';
import { Icon } from '../../icons/Icon.js';

export interface DropdownItem {
  /** Display label. Optional for separator items. */
  label?: string;
  /** Icon name from the icon registry. */
  icon?: string;
  /** Prevents interaction when `true`. */
  disabled?: boolean;
  /** Renders as a visual divider when `true` (other fields are ignored). */
  separator?: boolean;
  /** Callback invoked when the item is clicked. */
  command?: () => void;
  /** Nested items rendered in a submenu on hover. */
  children?: DropdownItem[];
}

export interface DropdownProps {
  /** Element that toggles the menu on click. */
  trigger: ReactNode;
  /** Menu items. */
  items: DropdownItem[];
  /** Preferred placement of the menu relative to the trigger. */
  placement?: Placement;
  /** Callback fired when any item is clicked. */
  onItemClick?: (item: DropdownItem) => void;
  /** Close when clicking outside the menu. */
  dismissOnClickOutside?: boolean;
  /** Additional CSS class applied to the trigger wrapper. */
  className?: string;
}

interface SubmenuState {
  items: DropdownItem[];
  pos: { top: number; left: number };
}

/**
 * A floating menu anchored to a trigger element.
 * Supports icons, separators, disabled items, and one level of nested submenus.
 *
 * @example
 * ```tsx
 * <Dropdown
 *   trigger={<Button iconRight="chevron-down">Actions</Button>}
 *   items={[
 *     { label: 'Edit',   icon: 'edit',  command: () => editItem() },
 *     { separator: true },
 *     { label: 'Delete', icon: 'trash', command: () => deleteItem() },
 *   ]}
 * />
 * ```
 */
export function Dropdown({
  trigger,
  items,
  placement = 'bottom-start',
  onItemClick,
  dismissOnClickOutside = true,
  className = '',
}: DropdownProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [menuMinWidth, setMenuMinWidth] = useState(0);
  const [ready, setReady] = useState(false);
  const [submenu, setSubmenu] = useState<SubmenuState | null>(null);
  const submenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafId = useRef(0);

  const reposition = useCallback(() => {
    const anchor = anchorRef.current;
    const menu = menuRef.current;
    if (!anchor || !menu) return;
    const result = computePosition(anchor, menu, placement, 4);
    setMenuPos({ top: result.top, left: result.left });
    setMenuMinWidth(anchor.offsetWidth);
    setReady(true);
  }, [placement]);

  useEffect(() => {
    if (!open) {
      setReady(false);
      setSubmenu(null);
      return;
    }
    rafId.current = requestAnimationFrame(reposition);
    return () => cancelAnimationFrame(rafId.current);
  }, [open, reposition]);

  // Re-position on scroll
  useEffect(() => {
    if (!open) return;
    const anchor = anchorRef.current;
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
    if (!open || !dismissOnClickOutside) return;
    const els = [anchorRef.current, menuRef.current].filter(Boolean) as HTMLElement[];
    return onClickOutside(els, () => setOpen(false));
  }, [open, dismissOnClickOutside]);

  useEffect(
    () => () => {
      if (submenuCloseTimer.current) clearTimeout(submenuCloseTimer.current);
    },
    [],
  );

  function toggle() {
    setOpen((v) => !v);
  }

  function close() {
    setOpen(false);
  }

  function handleItemClick(item: DropdownItem) {
    if (item.disabled) return;
    item.command?.();
    onItemClick?.(item);
    close();
  }

  function handleItemHover(item: DropdownItem, e: ReactMouseEvent<HTMLButtonElement>) {
    if (submenuCloseTimer.current) clearTimeout(submenuCloseTimer.current);
    if (!item.children?.length) {
      setSubmenu(null);
      return;
    }
    const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
    setSubmenu({ items: item.children, pos: { top: rect.top, left: rect.right + 2 } });
  }

  function handleSubmenuMouseEnter() {
    if (submenuCloseTimer.current) clearTimeout(submenuCloseTimer.current);
  }

  function handleSubmenuMouseLeave() {
    submenuCloseTimer.current = setTimeout(() => setSubmenu(null), 200);
  }

  function renderMenuItems(menuItems: DropdownItem[], isSubmenu = false) {
    return menuItems.map((item, i) => {
      if (item.separator) {
        return <div key={i} className="sp-dropdown__separator" role="separator" />;
      }
      return (
        <div key={i} className="sp-dropdown__item-wrap">
          <button
            className={[
              'sp-dropdown__item',
              item.disabled && 'sp-dropdown__item--disabled',
            ]
              .filter(Boolean)
              .join(' ')}
            type="button"
            disabled={item.disabled}
            onClick={() => (isSubmenu ? handleItemClick(item) : handleItemClick(item))}
            onMouseEnter={!isSubmenu ? (e) => handleItemHover(item, e) : undefined}
          >
            {item.icon && <Icon name={item.icon} size={14} />}
            <span className="sp-dropdown__label">{item.label}</span>
            {!isSubmenu && item.children?.length ? (
              <Icon name="chevron-right" size={12} className="sp-dropdown__chevron" />
            ) : null}
          </button>
        </div>
      );
    });
  }

  return (
    <>
      <div
        ref={anchorRef}
        className={['sp-dropdown-trigger', className].filter(Boolean).join(' ')}
        onClick={toggle}
        style={{ display: 'inline-block', cursor: 'pointer' }}
      >
        {trigger}
      </div>
      {open &&
        createPortal(
          <>
            <div
              ref={menuRef}
              className="sp-dropdown__menu"
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
              {renderMenuItems(items)}
            </div>
            {submenu && (
              <div
                className="sp-dropdown__menu sp-dropdown__submenu"
                role="menu"
                style={{
                  position: 'fixed',
                  top: submenu.pos.top,
                  left: submenu.pos.left,
                  zIndex: 1000,
                }}
                onMouseEnter={handleSubmenuMouseEnter}
                onMouseLeave={handleSubmenuMouseLeave}
              >
                {renderMenuItems(submenu.items, true)}
              </div>
            )}
          </>,
          document.body,
        )}
    </>
  );
}
