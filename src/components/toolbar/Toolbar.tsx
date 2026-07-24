/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Toolbar.css';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from '../../icons/Icon.js';
import { Dropdown } from '../dropdown/Dropdown.js';
import type { DropdownItem } from '../dropdown/Dropdown.js';

/* ── Types ──────────────────────────────────────────────────────────────── */

export type ToolbarSize = 'sm' | 'md' | 'lg';

export interface ToolbarButtonItem {
  icon?: string;
  label: string;
  disabled?: boolean;
  priority?: number;
  onClick?: () => void;
}

export interface ToolbarProps {
  items: ToolbarButtonItem[];
  size?: ToolbarSize;
  dividerAfter?: number[];
  className?: string;
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

function iconSizeForToolbar(size: ToolbarSize): number {
  switch (size) {
    case 'sm':
      return 14;
    case 'lg':
      return 18;
    default:
      return 16;
  }
}

/* ── Component ──────────────────────────────────────────────────────────── */

export function Toolbar({
  items,
  size = 'md',
  dividerAfter = [],
  className = '',
}: ToolbarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());
  const dividerRefs = useRef<Map<number, HTMLElement>>(new Map());
  const [hiddenIndices, setHiddenIndices] = useState<Set<number>>(new Set());

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Show all items first for measuring
    itemRefs.current.forEach((el) => {
      el.style.display = '';
    });
    dividerRefs.current.forEach((el) => {
      el.style.display = '';
    });

    const availableWidth = container.offsetWidth;
    // Reserve space for the overflow menu trigger (roughly 40px)
    const menuReserve = 40;

    // Measure each item + following divider if present
    const measurements: { index: number; priority: number; width: number }[] = [];
    items.forEach((item, i) => {
      const el = itemRefs.current.get(i);
      if (!el) return;
      let width = el.offsetWidth + 2; // +2 for gap
      const divider = dividerRefs.current.get(i);
      if (divider) {
        width += divider.offsetWidth + 2;
      }
      measurements.push({ index: i, priority: item.priority ?? 0, width });
    });

    // Check if everything fits
    const totalWidth = measurements.reduce((sum, m) => sum + m.width, 0);
    if (totalWidth <= availableWidth) {
      setHiddenIndices(new Set());
      return;
    }

    // Sort by priority ascending (hide lowest priority first)
    const sorted = [...measurements].sort((a, b) => a.priority - b.priority);
    let usedWidth = totalWidth;
    const newHidden = new Set<number>();

    for (const m of sorted) {
      if (usedWidth <= availableWidth - menuReserve) break;
      newHidden.add(m.index);
      usedWidth -= m.width;
    }

    // Apply visibility
    itemRefs.current.forEach((el, idx) => {
      el.style.display = newHidden.has(idx) ? 'none' : '';
    });
    dividerRefs.current.forEach((el, idx) => {
      el.style.display = newHidden.has(idx) ? 'none' : '';
    });

    setHiddenIndices((prev) => {
      if (prev.size === newHidden.size && [...prev].every((i) => newHidden.has(i))) {
        return prev;
      }
      return newHidden;
    });
  }, [items]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      measure();
    });
    observer.observe(container);
    measure();

    return () => observer.disconnect();
  }, [measure]);

  const dividerSet = new Set(dividerAfter);
  const iconSize = iconSizeForToolbar(size);

  const rootClasses = [
    'sp-toolbar',
    size !== 'md' && `sp-toolbar--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Build dropdown items for hidden buttons
  const overflowItems: DropdownItem[] = items
    .filter((_, i) => hiddenIndices.has(i))
    .map((item) => ({
      label: item.label,
      icon: item.icon,
      disabled: item.disabled,
      command: item.onClick,
    }));

  return (
    <div ref={containerRef} className={rootClasses}>
      {items.map((item, i) => (
        <span key={i}>
          <button
            ref={(el) => {
              if (el) {
                itemRefs.current.set(i, el);
              } else {
                itemRefs.current.delete(i);
              }
            }}
            type="button"
            className="sp-toolbar-btn"
            title={item.label}
            aria-label={item.label}
            disabled={item.disabled}
            onClick={item.onClick}
          >
            {item.icon && <Icon name={item.icon} size={iconSize} />}
            {!item.icon && item.label}
          </button>
          {dividerSet.has(i) && (
            <span
              ref={(el) => {
                if (el) {
                  dividerRefs.current.set(i, el);
                } else {
                  dividerRefs.current.delete(i);
                }
              }}
              className="sp-toolbar__divider"
              role="separator"
              aria-orientation="vertical"
            />
          )}
        </span>
      ))}

      {hiddenIndices.size > 0 && (
        <div className="sp-toolbar__menu">
          <Dropdown
            trigger={
              <button
                type="button"
                className="sp-toolbar__menu-trigger"
                aria-label="More actions"
              >
                <Icon name="more-horizontal" size={iconSize} />
              </button>
            }
            items={overflowItems}
            placement="bottom-end"
          />
        </div>
      )}
    </div>
  );
}
