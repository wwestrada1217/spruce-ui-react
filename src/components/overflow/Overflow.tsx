/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Overflow.css';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  Children,
  isValidElement,
  type ReactNode,
} from 'react';

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface OverflowProps {
  children: ReactNode;
  menuContent?: (hiddenIds: Set<string>) => ReactNode;
  minimumVisible?: number;
  onOverflowChange?: (event: {
    hiddenIds: Set<string>;
    hasOverflow: boolean;
    count: number;
  }) => void;
  gap?: number;
  className?: string;
}

export interface OverflowItemProps {
  id: string;
  priority?: number;
  children: ReactNode;
}

/* ── OverflowItem ───────────────────────────────────────────────────────── */

export function OverflowItem({ id, children }: OverflowItemProps) {
  return (
    <div data-overflow-id={id} style={{ flexShrink: 0 }}>
      {children}
    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

interface ItemMeta {
  id: string;
  priority: number;
}

function collectItemMeta(children: ReactNode): ItemMeta[] {
  const items: ItemMeta[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement<OverflowItemProps>(child) && child.type === OverflowItem) {
      items.push({
        id: child.props.id,
        priority: child.props.priority ?? 0,
      });
    }
  });
  return items;
}

/* ── Overflow ───────────────────────────────────────────────────────────── */

export function Overflow({
  children,
  menuContent,
  minimumVisible = 0,
  onOverflowChange,
  gap = 0,
  className = '',
}: OverflowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const availableWidth = container.offsetWidth;
    const itemElements = container.querySelectorAll<HTMLElement>('[data-overflow-id]');
    const meta = collectItemMeta(children);

    // First, show all items to measure their natural widths
    itemElements.forEach((el) => {
      el.style.display = '';
    });

    // Measure each item
    const measurements: { id: string; priority: number; width: number; el: HTMLElement }[] = [];
    itemElements.forEach((el) => {
      const id = el.getAttribute('data-overflow-id')!;
      const itemMeta = meta.find((m) => m.id === id);
      measurements.push({
        id,
        priority: itemMeta?.priority ?? 0,
        width: el.offsetWidth,
        el,
      });
    });

    // Sort by priority descending so we hide lowest priority first
    const sortedByPriority = [...measurements].sort((a, b) => a.priority - b.priority);

    // Calculate total width needed (with gaps)
    let totalWidth = measurements.reduce(
      (sum, m) => sum + m.width,
      Math.max(0, (measurements.length - 1) * gap),
    );

    const newHiddenIds = new Set<string>();
    const visibleCount = measurements.length - newHiddenIds.size;

    // Hide items starting from lowest priority until we fit
    for (const item of sortedByPriority) {
      if (totalWidth <= availableWidth) break;
      const currentVisible = measurements.length - newHiddenIds.size;
      if (currentVisible <= minimumVisible) break;
      newHiddenIds.add(item.id);
      totalWidth -= item.width + gap;
    }

    // Apply visibility
    itemElements.forEach((el) => {
      const id = el.getAttribute('data-overflow-id')!;
      el.style.display = newHiddenIds.has(id) ? 'none' : '';
    });

    setHiddenIds((prev) => {
      // Only update state if the set actually changed
      if (prev.size === newHiddenIds.size && [...prev].every((id) => newHiddenIds.has(id))) {
        return prev;
      }
      return newHiddenIds;
    });

    onOverflowChange?.({
      hiddenIds: newHiddenIds,
      hasOverflow: newHiddenIds.size > 0,
      count: newHiddenIds.size,
    });
  }, [children, gap, minimumVisible, onOverflowChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      measure();
    });
    observer.observe(container);

    // Initial measurement
    measure();

    return () => observer.disconnect();
  }, [measure]);

  const rootClasses = ['sp-overflow', className].filter(Boolean).join(' ');

  return (
    <div ref={containerRef} className={rootClasses} style={{ gap }}>
      {children}
      {hiddenIds.size > 0 && menuContent && (
        <div className="sp-overflow__menu">{menuContent(hiddenIds)}</div>
      )}
    </div>
  );
}
