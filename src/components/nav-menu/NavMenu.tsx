/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './NavMenu.css';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';

export interface NavMenuLink {
  label: string;
  href?: string;
  icon?: string;
  description?: string;
  onClick?: () => void;
}

export interface NavMenuItem {
  label: string;
  href?: string;
  links?: NavMenuLink[];
  content?: ReactNode;
}

export interface NavMenuProps {
  items: NavMenuItem[];
  className?: string;
}

/**
 * A horizontal navigation menu bar with dropdown panels.
 *
 * Each item can be a simple link or a dropdown trigger that reveals
 * a panel of categorized links on hover.
 *
 * @example
 * ```tsx
 * <NavMenu
 *   items={[
 *     { label: 'Home', href: '/' },
 *     {
 *       label: 'Products',
 *       links: [
 *         { label: 'Analytics', icon: 'chart-bar', description: 'Track metrics' },
 *         { label: 'Reports', icon: 'file-text', description: 'Generate reports' },
 *       ],
 *     },
 *   ]}
 * />
 * ```
 */
export function NavMenu({ items, className = '' }: NavMenuProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const [ready, setReady] = useState(false);
  const triggerRefs = useRef<(HTMLElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDropdown = (item: NavMenuItem) =>
    (item.links && item.links.length > 0) || item.content != null;

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const positionPanel = useCallback((index: number) => {
    const trigger = triggerRefs.current[index];
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setPanelPos({
      top: rect.bottom + 4,
      left: rect.left,
    });
    setReady(true);
  }, []);

  const open = useCallback(
    (index: number) => {
      clearTimers();
      openTimer.current = setTimeout(() => {
        setOpenIndex(index);
        // Position will be calculated in the effect
      }, 150);
    },
    [clearTimers],
  );

  const close = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => {
      setOpenIndex(null);
      setReady(false);
    }, 300);
  }, [clearTimers]);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  // Position the panel whenever openIndex changes
  useEffect(() => {
    if (openIndex == null) {
      setReady(false);
      return;
    }
    requestAnimationFrame(() => positionPanel(openIndex));
  }, [openIndex, positionPanel]);

  // Escape key handler
  useEffect(() => {
    if (openIndex == null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenIndex(null);
        setReady(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openIndex]);

  // Cleanup timers on unmount
  useEffect(() => () => clearTimers(), [clearTimers]);

  function handleTriggerKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === 'ArrowDown' && isDropdown(items[index])) {
      e.preventDefault();
      clearTimers();
      setOpenIndex(index);
    }
  }

  function handleTriggerMouseEnter(index: number) {
    if (isDropdown(items[index])) {
      open(index);
    } else {
      clearTimers();
      setOpenIndex(null);
      setReady(false);
    }
  }

  function handleTriggerMouseLeave() {
    close();
  }

  function handlePanelMouseEnter() {
    cancelClose();
  }

  function handlePanelMouseLeave() {
    close();
  }

  const rootClasses = ['sp-nav-menu', className].filter(Boolean).join(' ');

  return (
    <nav className={rootClasses} role="navigation">
      <ul className="sp-nav-menu__list">
        {items.map((item, index) => {
          const hasDropdown = isDropdown(item);
          const isOpen = openIndex === index;

          return (
            <li key={index} className="sp-nav-menu__item">
              {hasDropdown ? (
                <button
                  ref={(el) => {
                    triggerRefs.current[index] = el;
                  }}
                  type="button"
                  className={[
                    'sp-nav-menu__trigger',
                    isOpen && 'sp-nav-menu__trigger--open',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onMouseEnter={() => handleTriggerMouseEnter(index)}
                  onMouseLeave={handleTriggerMouseLeave}
                  onKeyDown={(e) => handleTriggerKeyDown(e, index)}
                >
                  <span>{item.label}</span>
                  <Icon
                    name="chevron-down"
                    size={12}
                    className={[
                      'sp-nav-menu__chevron',
                      isOpen && 'sp-nav-menu__chevron--open',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  />
                </button>
              ) : (
                <a
                  ref={(el) => {
                    triggerRefs.current[index] = el;
                  }}
                  href={item.href ?? '#'}
                  className="sp-nav-menu__trigger"
                  onMouseEnter={() => handleTriggerMouseEnter(index)}
                  onMouseLeave={handleTriggerMouseLeave}
                >
                  <span>{item.label}</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>

      {openIndex != null &&
        isDropdown(items[openIndex]) &&
        createPortal(
          <div
            ref={panelRef}
            className="sp-nav-menu__panel"
            role="menu"
            style={{
              position: 'fixed',
              top: panelPos.top,
              left: panelPos.left,
              zIndex: 999,
              opacity: ready ? 1 : 0,
            }}
            onMouseEnter={handlePanelMouseEnter}
            onMouseLeave={handlePanelMouseLeave}
          >
            {items[openIndex].content
              ? items[openIndex].content
              : (
                <div className="sp-nav-menu__links">
                  {items[openIndex].links?.map((link, linkIndex) => {
                    const Tag = link.href ? 'a' : 'button';
                    const tagProps = link.href
                      ? { href: link.href }
                      : { type: 'button' as const, onClick: link.onClick };

                    return (
                      <Tag
                        key={linkIndex}
                        className="sp-nav-menu__link"
                        role="menuitem"
                        {...tagProps}
                      >
                        {link.icon && (
                          <span className="sp-nav-menu__link-icon">
                            <Icon name={link.icon} size={16} />
                          </span>
                        )}
                        <span className="sp-nav-menu__link-content">
                          <span className="sp-nav-menu__link-title">
                            {link.label}
                          </span>
                          {link.description && (
                            <span className="sp-nav-menu__link-desc">
                              {link.description}
                            </span>
                          )}
                        </span>
                      </Tag>
                    );
                  })}
                </div>
              )}
          </div>,
          document.body,
        )}
    </nav>
  );
}
