/* eslint-disable react-refresh/only-export-components */
import './Overflow.css';
import { Children, isValidElement, useCallback, useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type ReactNode, type Ref } from 'react';

export interface OverflowItemMeasurement {
  id: string;
  width: number;
  priority?: number;
  order?: number;
}

export function computeOverflowHidden(
  availableWidth: number,
  gap: number,
  items: OverflowItemMeasurement[],
  menuWidth = 0,
  minimumVisible = 0,
): Set<string> {
  const total = items.reduce((sum, item) => sum + item.width, 0) + Math.max(0, items.length - 1) * gap;
  if (total <= availableWidth) return new Set();
  let remaining = total;
  const hidden = new Set<string>();
  const sorted = [...items].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0) || (b.order ?? 0) - (a.order ?? 0));
  for (const item of sorted) {
    if (remaining + menuWidth <= availableWidth) break;
    if (items.length - hidden.size <= minimumVisible) break;
    hidden.add(item.id);
    remaining -= item.width + gap;
  }
  return hidden;
}

export interface OverflowChangeEvent {
  hiddenItemIds: Set<string>;
  visibleItemIds: Set<string>;
  hasOverflow: boolean;
  overflowCount: number;
  hiddenIds: Set<string>;
  count: number;
}

export interface OverflowHandle {
  refresh: () => void;
  hasOverflow: boolean;
  overflowCount: number;
  hiddenItemIds: Set<string>;
  visibleItemIds: Set<string>;
  isItemVisible: (id: string) => boolean;
}

export interface OverflowProps {
  children: ReactNode;
  menuContent?: (hiddenIds: Set<string>) => ReactNode;
  minimumVisible?: number;
  onOverflowChange?: (event: OverflowChangeEvent) => void;
  gap?: number;
  menuWidth?: number;
  ref?: Ref<OverflowHandle>;
  className?: string;
}

export interface OverflowItemProps {
  id: string;
  priority?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function OverflowItem({ id, priority = 0, children, className = '', style }: OverflowItemProps) {
  return <div data-overflow-id={id} data-overflow-priority={priority} className={className} style={{ flexShrink: 0, ...style }}>{children}</div>;
}

interface ItemMeta { id: string; priority: number; }
function collectItemMeta(children: ReactNode): ItemMeta[] {
  const items: ItemMeta[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement<OverflowItemProps>(child) && child.type === OverflowItem) items.push({ id: child.props.id, priority: child.props.priority ?? 0 });
  });
  return items;
}

export function Overflow({ children, menuContent, minimumVisible = 0, onOverflowChange, gap = 0, menuWidth = 40, ref, className = '' }: OverflowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hiddenItemIds, setHiddenItemIds] = useState<Set<string>>(new Set());
  const menuRef = useRef<HTMLDivElement>(null);
  const meta = collectItemMeta(children);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const itemElements = [...container.querySelectorAll<HTMLElement>('[data-overflow-id]')];
    itemElements.forEach((element) => { element.style.display = ''; });
    const measurements = itemElements.map((element, order) => ({
      id: element.dataset.overflowId ?? '',
      width: element.offsetWidth,
      priority: meta.find((item) => item.id === element.dataset.overflowId)?.priority ?? Number(element.dataset.overflowPriority ?? 0),
      order,
    })).filter((item) => item.id);
    const total = measurements.reduce((sum, item) => sum + item.width, 0) + Math.max(0, measurements.length - 1) * gap;
    const measuredMenuWidth = menuRef.current?.offsetWidth || menuWidth;
    const nextHidden = computeOverflowHidden(container.clientWidth, gap, measurements, total > container.clientWidth ? measuredMenuWidth : 0, minimumVisible);
    itemElements.forEach((element) => { element.style.display = nextHidden.has(element.dataset.overflowId ?? '') ? 'none' : ''; });
    setHiddenItemIds((previous) => previous.size === nextHidden.size && [...previous].every((id) => nextHidden.has(id)) ? previous : nextHidden);
    const visibleItemIds = new Set(measurements.map((item) => item.id).filter((id) => !nextHidden.has(id)));
    onOverflowChange?.({ hiddenItemIds: nextHidden, visibleItemIds, hasOverflow: nextHidden.size > 0, overflowCount: nextHidden.size, hiddenIds: nextHidden, count: nextHidden.size });
  }, [gap, menuWidth, meta, minimumVisible, onOverflowChange]);

  useImperativeHandle(ref, () => ({
    refresh: measure,
    hasOverflow: hiddenItemIds.size > 0,
    overflowCount: hiddenItemIds.size,
    hiddenItemIds,
    visibleItemIds: new Set(meta.map((item) => item.id).filter((id) => !hiddenItemIds.has(id))),
    isItemVisible: (id: string) => !hiddenItemIds.has(id),
  }), [hiddenItemIds, measure, meta]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (typeof ResizeObserver === 'undefined') {
      measure();
      return;
    }
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    measure();
    return () => observer.disconnect();
  }, [measure]);

  return (
    <div ref={containerRef} className={['sp-overflow', className].filter(Boolean).join(' ')} style={{ gap }}>
      {children}
      {menuContent && <div ref={menuRef} className="sp-overflow__menu" aria-hidden={hiddenItemIds.size === 0} style={{ visibility: hiddenItemIds.size > 0 ? 'visible' : 'hidden' }}>{menuContent(hiddenItemIds)}</div>}
    </div>
  );
}
