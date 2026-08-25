/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Dropdown.css';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import {
  computePosition,
  getScrollParents,
  modalBoundary,
  onClickOutside,
  onEscapeCapture,
  type Placement,
  type PositionAnchor,
} from '../../utils/positioning.js';

export interface DropdownItem {
  label?: string;
  icon?: string;
  disabled?: boolean;
  separator?: boolean;
  command?: () => void;
  children?: DropdownItem[];
  shortcut?: string[] | string;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  placement?: Placement;
  anchorRect?: DOMRectReadOnly | null;
  constrainToModal?: boolean;
  dismissOnClickOutside?: boolean;
  dismissOnScroll?: boolean;
  minWidth?: number;
  reserveIconSlot?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onItemClick?: (item: DropdownItem) => void;
  onOpened?: () => void;
  onClosed?: () => void;
  className?: string;
}

interface SubmenuState {
  items: DropdownItem[];
  parentIndex: number;
  pos: { top: number; left: number };
}

const openDropdowns: symbol[] = [];

function shortcutKeys(shortcut?: string[] | string): string[] {
  if (!shortcut) return [];
  return Array.isArray(shortcut) ? shortcut : shortcut.split('+').map((key) => key.trim()).filter(Boolean);
}

/** A nested, keyboard-navigable, controlled-friendly menu. */
export function Dropdown({
  trigger,
  items,
  placement = 'bottom-start',
  anchorRect = null,
  constrainToModal = true,
  dismissOnClickOutside = true,
  dismissOnScroll = true,
  minWidth = 192,
  reserveIconSlot = false,
  open: controlledOpen,
  onOpenChange,
  onItemClick,
  onOpened,
  onClosed,
  className = '',
}: DropdownProps) {
  const { isRtl } = useI18n();
  const anchorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const submenuRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const focusBeforeOpen = useRef<HTMLElement | null>(null);
  const submenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafId = useRef<number | null>(null);
  const token = useRef(Symbol('dropdown'));
  const dropdownId = useId();
  const [internalOpen, setInternalOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [menuMinWidth, setMenuMinWidth] = useState(minWidth);
  const [ready, setReady] = useState(false);
  const [submenuPath, setSubmenuPath] = useState<SubmenuState[]>([]);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen ?? false : internalOpen;

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const boundary = useCallback(() => {
    const anchor = anchorRef.current;
    return constrainToModal && anchor ? modalBoundary(anchor) : undefined;
  }, [constrainToModal]);

  const reposition = useCallback(() => {
    const anchor = anchorRef.current;
    const menu = menuRef.current;
    if (!anchor || !menu) return;
    const result = computePosition(anchorRect ?? (anchor as PositionAnchor), menu, placement, 4, boundary(), isRtl ? 'rtl' : 'ltr');
    setMenuPos({ top: result.top, left: result.left });
    setMenuMinWidth(Math.max(minWidth, anchor.offsetWidth));
    setReady(true);
  }, [anchorRect, boundary, isRtl, minWidth, placement]);

  const focusItems = useCallback((root: HTMLElement, index: number) => {
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('.sp-dropdown__item:not(:disabled)'));
    if (buttons.length) buttons[Math.max(0, Math.min(index, buttons.length - 1))].focus({ preventScroll: true });
    else root.focus({ preventScroll: true });
  }, []);

  const close = useCallback(() => {
    const wasOpen = isOpen;
    const roots = [menuRef.current, ...submenuRefs.current.values()].filter(Boolean) as HTMLElement[];
    const focusInside = roots.some((root) => root === document.activeElement || root.contains(document.activeElement));
    if (submenuCloseTimer.current) clearTimeout(submenuCloseTimer.current);
    submenuCloseTimer.current = null;
    setOpen(false);
    setSubmenuPath([]);
    setReady(false);
    if (focusInside && focusBeforeOpen.current?.isConnected) focusBeforeOpen.current.focus({ preventScroll: true });
    focusBeforeOpen.current = null;
    if (wasOpen) onClosed?.();
  }, [isOpen, onClosed, setOpen]);

  const openMenu = useCallback(() => {
    if (isOpen) return;
    focusBeforeOpen.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const anchor = anchorRef.current;
    setMenuMinWidth(Math.max(minWidth, anchor?.offsetWidth ?? 0));
    setOpen(true);
    onOpened?.();
  }, [isOpen, minWidth, onOpened, setOpen]);

  useEffect(() => {
    if (!isOpen) {
      setReady(false);
      setSubmenuPath([]);
      return;
    }
    const dropdownToken = token.current;
    openDropdowns.push(dropdownToken);
    const frame = requestAnimationFrame(() => {
      if (menuRef.current) {
        reposition();
        focusItems(menuRef.current, 0);
      }
    });
    const removeEscape = onEscapeCapture((event) => {
      if (openDropdowns[openDropdowns.length - 1] !== dropdownToken) return;
      event.preventDefault();
      event.stopPropagation();
      close();
    });
    return () => {
      cancelAnimationFrame(frame);
      removeEscape();
      const index = openDropdowns.indexOf(dropdownToken);
      if (index !== -1) openDropdowns.splice(index, 1);
    };
  }, [close, focusItems, isOpen, reposition]);

  useEffect(() => {
    if (!isOpen) return;
    const anchor = anchorRef.current;
    if (!anchor) return;
    const onScroll = () => {
      if (dismissOnScroll) close();
      else {
        if (rafId.current !== null) cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(reposition);
      }
    };
    const parents = getScrollParents(anchor);
    parents.forEach((parent) => parent.addEventListener('scroll', onScroll, { passive: true }));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      parents.forEach((parent) => parent.removeEventListener('scroll', onScroll));
      window.removeEventListener('scroll', onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [close, dismissOnScroll, isOpen, reposition]);

  useEffect(() => {
    if (!isOpen || !dismissOnClickOutside) return;
    const targets = [anchorRef.current, menuRef.current, ...submenuRefs.current.values()].filter(Boolean) as HTMLElement[];
    return onClickOutside(targets, close);
  }, [close, dismissOnClickOutside, isOpen, submenuPath]);

  useEffect(() => () => {
    if (submenuCloseTimer.current) clearTimeout(submenuCloseTimer.current);
  }, []);

  const clearSubmenu = (depth: number) => setSubmenuPath((path) => path.slice(0, depth));

  const openSubmenu = (item: DropdownItem, depth: number, button: HTMLButtonElement) => {
    if (submenuCloseTimer.current) clearTimeout(submenuCloseTimer.current);
    if (item.disabled || !item.children?.length) {
      clearSubmenu(depth);
      return;
    }
    const rect = button.getBoundingClientRect();
    setSubmenuPath((path) => [...path.slice(0, depth), { items: item.children ?? [], parentIndex: Number(button.dataset.itemIndex ?? 0), pos: { top: rect.top, left: rect.right + 2 } }]);
    requestAnimationFrame(() => {
      const submenu = submenuRefs.current.get(depth);
      if (!submenu) return;
      const next = computePosition(button, submenu, 'right-start', 0, boundary(), isRtl ? 'rtl' : 'ltr');
      setSubmenuPath((path) => path.map((entry, index) => index === depth ? { ...entry, pos: { top: next.top, left: next.left } } : entry));
    });
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled || item.children?.length) return;
    item.command?.();
    onItemClick?.(item);
    close();
  };

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>, depth: number) => {
    const menu = event.currentTarget;
    const buttons = Array.from(menu.querySelectorAll<HTMLButtonElement>('.sp-dropdown__item:not(:disabled)'));
    const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : event.key === 'ArrowDown' ? (currentIndex + 1 + buttons.length) % buttons.length : (currentIndex <= 0 ? buttons.length : currentIndex) - 1;
      if (buttons.length) buttons[next].focus();
    } else if (event.key === 'ArrowRight') {
      const button = buttons[currentIndex];
      if (button) {
        const currentItems = depth === 0 ? items : submenuPath[depth - 1]?.items ?? [];
        const item = currentItems[Number(button.dataset.itemIndex)];
        if (item?.children?.length) {
          openSubmenu(item, depth, button);
          requestAnimationFrame(() => focusItems(submenuRefs.current.get(depth) ?? menu, 0));
          event.preventDefault();
        }
      }
    } else if (event.key === 'ArrowLeft' && depth > 0) {
      event.preventDefault();
      const parent = submenuPath[depth - 1];
      setSubmenuPath((path) => path.slice(0, depth - 1));
      requestAnimationFrame(() => {
        const parentMenu = depth === 1 ? menuRef.current : submenuRefs.current.get(depth - 2);
        if (parentMenu) focusItems(parentMenu, parent.parentIndex);
      });
    } else if (event.key === 'Tab') {
      close();
    }
  };

  const renderMenuItems = (menuItems: DropdownItem[], depth: number) => menuItems.map((item, index) => {
    if (item.separator) return <div key={`${depth}-separator-${index}`} className="sp-dropdown__separator" role="separator" />;
    const keys = shortcutKeys(item.shortcut);
    return (
      <div key={`${depth}-${index}`} className="sp-dropdown__item-wrap" onMouseEnter={(event) => {
        const button = event.currentTarget.querySelector<HTMLButtonElement>('button');
        if (button) openSubmenu(item, depth, button);
      }}>
        <button
          type="button"
          className={['sp-dropdown__item', reserveIconSlot && 'sp-dropdown__item--with-icon-slot', item.disabled && 'sp-dropdown__item--disabled'].filter(Boolean).join(' ')}
          disabled={item.disabled}
          data-menu-depth={depth}
          data-item-index={index}
          onClick={() => handleItemClick(item)}
        >
          {reserveIconSlot ? <span className="sp-dropdown__icon-slot" aria-hidden="true">{item.icon && <Icon name={item.icon} size={14} />}</span> : item.icon && <Icon name={item.icon} size={14} />}
          <span className="sp-dropdown__label">{item.label}</span>
          {keys.length > 0 && !item.children?.length && <span className="sp-dropdown__shortcut" aria-hidden="true">{keys.join('+')}</span>}
          {item.children?.length ? <Icon name="chevron-right" size={12} className="sp-dropdown__chevron" aria-hidden="true" /> : null}
        </button>
      </div>
    );
  });

  return (
    <>
      <div
        ref={anchorRef}
        className={['sp-dropdown-trigger', className].filter(Boolean).join(' ')}
        data-sp-overlay-anchor={dropdownId}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? close() : openMenu())}
        style={{ display: 'inline-block', cursor: 'pointer' }}
      >
        {trigger}
      </div>
      {isOpen && createPortal(
        <>
          <div
            ref={menuRef}
            className="sp-dropdown__menu"
            data-sp-overlay-owner={dropdownId}
            role="menu"
            tabIndex={-1}
            onKeyDown={(event) => handleMenuKeyDown(event, 0)}
            style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, zIndex: 1100, minWidth: menuMinWidth, visibility: ready ? 'visible' : 'hidden' }}
          >
            {renderMenuItems(items, 0)}
          </div>
          {submenuPath.map((submenu, depth) => (
            <div
              key={depth}
              ref={(element) => { if (element) submenuRefs.current.set(depth, element); else submenuRefs.current.delete(depth); }}
              className="sp-dropdown__menu sp-dropdown__submenu"
              data-submenu-depth={depth}
              role="menu"
              tabIndex={-1}
              onKeyDown={(event) => handleMenuKeyDown(event, depth + 1)}
              onMouseEnter={() => { if (submenuCloseTimer.current) clearTimeout(submenuCloseTimer.current); }}
              onMouseLeave={() => { submenuCloseTimer.current = setTimeout(() => setSubmenuPath((path) => path.slice(0, depth + 1)), 150); }}
              style={{ position: 'fixed', top: submenu.pos.top, left: submenu.pos.left, zIndex: 1101 + depth }}
            >
              {renderMenuItems(submenu.items, depth + 1)}
            </div>
          ))}
        </>,
        document.body,
      )}
    </>
  );
}
