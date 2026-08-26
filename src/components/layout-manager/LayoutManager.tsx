import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { useI18n } from '../../i18n/i18n-context.js';
import './LayoutManager.css';

export type LayoutCompactType = 'vertical' | 'horizontal' | null;
export type LayoutResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export interface LayoutItem<T = unknown> {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  deletable?: boolean;
  data?: T;
}

export interface LayoutBreakpoint {
  name: string;
  minWidth: number;
  cols: number;
}

export interface LayoutChangeEvent<T = unknown> {
  items: LayoutItem<T>[];
  reason: 'drag' | 'resize' | 'compact' | 'breakpoint' | 'delete';
}

export interface LayoutDragEvent<T = unknown> {
  item: LayoutItem<T>;
  x: number;
  y: number;
}

export interface LayoutResizeEvent<T = unknown> {
  item: LayoutItem<T>;
  w: number;
  h: number;
}

export interface LayoutManagerHandle<T = unknown> {
  save: () => LayoutItem<T>[];
  restore: (items: LayoutItem<T>[]) => void;
  deleteItem: (itemOrId: LayoutItem<T> | string) => boolean;
}

export interface LayoutDragHandleProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function LayoutDragHandle({ children, className, ...props }: LayoutDragHandleProps) {
  return <div {...props} className={['sp-layout-drag-handle', className].filter(Boolean).join(' ')}>{children}</div>;
}

export interface LayoutManagerProps<T = unknown> extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  items: LayoutItem<T>[];
  onItemsChange?: (items: LayoutItem<T>[]) => void;
  onLayoutChange?: (event: LayoutChangeEvent<T>) => void;
  onItemDragStart?: (event: LayoutDragEvent<T>) => void;
  onItemDragEnd?: (event: LayoutDragEvent<T>) => void;
  onItemResizeStart?: (event: LayoutResizeEvent<T>) => void;
  onItemResizeEnd?: (event: LayoutResizeEvent<T>) => void;
  onItemDelete?: (item: LayoutItem<T>) => void;
  onBreakpointChange?: (breakpoint: LayoutBreakpoint | null) => void;
  renderItem?: (item: LayoutItem<T>, index: number) => ReactNode;
  cols?: number;
  rowHeight?: number;
  gap?: number;
  margin?: number;
  compactType?: LayoutCompactType;
  preventCollision?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  locked?: boolean;
  deletable?: boolean;
  confirmDelete?: (item: LayoutItem<T>) => boolean;
  breakpoints?: readonly LayoutBreakpoint[] | null;
  ariaLabel?: string;
  children?: ((item: LayoutItem<T>, index: number) => ReactNode) | ReactNode;
}

interface DragState {
  id: string;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  active: boolean;
}

interface ResizeState {
  id: string;
  handle: LayoutResizeHandle;
  startX: number;
  startY: number;
  active: boolean;
}

function cloneItems<T>(items: LayoutItem<T>[]): LayoutItem<T>[] {
  return items.map((item) => ({ ...item, data: item.data }));
}

function overlaps(a: LayoutItem, b: LayoutItem): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function compactItems<T>(items: LayoutItem<T>[], compactType: LayoutCompactType): LayoutItem<T>[] {
  if (!compactType) return cloneItems(items);
  const next = cloneItems(items).sort((a, b) =>
    compactType === 'horizontal' ? a.x - b.x || a.y - b.y : a.y - b.y || a.x - b.x,
  );
  for (const item of next) {
    if (item.static) continue;
    while (compactType === 'vertical' ? item.y > 0 : item.x > 0) {
      const candidate = { ...item, y: compactType === 'vertical' ? item.y - 1 : item.y, x: compactType === 'horizontal' ? item.x - 1 : item.x };
      if (next.some((other) => other.id !== item.id && overlaps(candidate, other))) break;
      item.x = candidate.x;
      item.y = candidate.y;
    }
  }
  return next;
}

function moveItem<T>(items: LayoutItem<T>[], id: string, x: number, y: number, preventCollision: boolean): LayoutItem<T>[] {
  const next = cloneItems(items);
  const moving = next.find((item) => item.id === id);
  if (!moving) return next;
  moving.x = Math.max(0, x);
  moving.y = Math.max(0, y);
  if (preventCollision && next.some((item) => item.id !== id && overlaps(moving, item))) return cloneItems(items);
  if (!preventCollision) {
    let changed = true;
    while (changed) {
      changed = false;
      for (const item of next) {
        if (item.id === id || item.static || !overlaps(moving, item)) continue;
        const targetY = moving.y + moving.h;
        if (item.y < targetY) {
          item.y = targetY;
          changed = true;
        }
      }
    }
  }
  return next;
}

function resizeItem<T>(items: LayoutItem<T>[], id: string, handle: LayoutResizeHandle, dx: number, dy: number, cellWidth: number, rowHeight: number, gap: number): LayoutItem<T>[] {
  const next = cloneItems(items);
  const item = next.find((candidate) => candidate.id === id);
  if (!item) return next;
  const stepX = cellWidth + gap;
  const stepY = rowHeight + gap;
  const deltaX = Math.round(dx / Math.max(stepX, 1));
  const deltaY = Math.round(dy / Math.max(stepY, 1));
  const minW = item.minW ?? 1;
  const minH = item.minH ?? 1;
  const maxW = item.maxW ?? Number.POSITIVE_INFINITY;
  const maxH = item.maxH ?? Number.POSITIVE_INFINITY;
  if (handle.includes('e')) item.w = Math.max(minW, Math.min(maxW, item.w + deltaX));
  if (handle.includes('s')) item.h = Math.max(minH, Math.min(maxH, item.h + deltaY));
  if (handle.includes('w')) {
    const width = Math.max(minW, Math.min(maxW, item.w - deltaX));
    item.x += item.w - width;
    item.w = width;
  }
  if (handle.includes('n')) {
    const height = Math.max(minH, Math.min(maxH, item.h - deltaY));
    item.y += item.h - height;
    item.h = height;
  }
  return next;
}

function getItemStyle(item: LayoutItem, cols: number, rowHeight: number, gap: number, margin: number, width: number): CSSProperties {
  const usableWidth = Math.max(width - margin * 2 - gap * Math.max(cols - 1, 0), 0);
  const cellWidth = usableWidth / Math.max(cols, 1);
  return {
    left: margin + item.x * (cellWidth + gap),
    top: margin + item.y * (rowHeight + gap),
    width: Math.max(cellWidth * item.w + gap * Math.max(item.w - 1, 0), 0),
    height: Math.max(rowHeight * item.h + gap * Math.max(item.h - 1, 0), 0),
  };
}

function getMaxBottom(items: LayoutItem[], rowHeight: number, gap: number, margin: number): number {
  return Math.max(0, ...items.map((item) => margin + item.y * (rowHeight + gap) + item.h * rowHeight + Math.max(item.h - 1, 0) * gap));
}

export const LayoutManager = forwardRef(function LayoutManager<T = unknown>(
  {
    items,
    onItemsChange,
    onLayoutChange,
    onItemDragStart,
    onItemDragEnd,
    onItemResizeStart,
    onItemResizeEnd,
    onItemDelete,
    onBreakpointChange,
    renderItem,
    cols = 12,
    rowHeight = 60,
    gap = 12,
    margin = 0,
    compactType = 'vertical',
    preventCollision = false,
    draggable = true,
    resizable = true,
    locked = false,
    deletable = false,
    confirmDelete = () => true,
    breakpoints = null,
    ariaLabel,
    children,
    className,
    style,
    ...props
  }: LayoutManagerProps<T>, ref: React.ForwardedRef<LayoutManagerHandle<T>>,
) {
  const { direction, t } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [workingItems, setWorkingItems] = useState(() => cloneItems(items));
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
  const previousBreakpoint = useRef<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setWorkingItems(cloneItems(items)), 0);
    return () => window.clearTimeout(timer);
  }, [items]);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;
    const update = () => setWidth(element.clientWidth);
    update();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const selectedBreakpoint = useMemo(() => {
    if (!breakpoints?.length || width <= 0) return null;
    return [...breakpoints].sort((a, b) => b.minWidth - a.minWidth).find((candidate) => width >= candidate.minWidth) ?? null;
  }, [breakpoints, width]);
  const activeCols = selectedBreakpoint?.cols ?? cols;

  useEffect(() => {
    const name = selectedBreakpoint?.name ?? null;
    if (previousBreakpoint.current === name) return;
    previousBreakpoint.current = name;
    onBreakpointChange?.(selectedBreakpoint);
  }, [onBreakpointChange, selectedBreakpoint]);

  const commit = useCallback((next: LayoutItem<T>[], reason: LayoutChangeEvent<T>['reason']) => {
    const cloned = cloneItems(next);
    setWorkingItems(cloned);
    onItemsChange?.(cloned);
    onLayoutChange?.({ items: cloned, reason });
  }, [onItemsChange, onLayoutChange]);

  const deleteItem = useCallback((itemOrId: LayoutItem<T> | string): boolean => {
    const id = typeof itemOrId === 'string' ? itemOrId : itemOrId.id;
    const item = workingItems.find((candidate) => candidate.id === id);
    if (!item || locked || !deletable || item.deletable === false || !confirmDelete(item)) return false;
    commit(workingItems.filter((candidate) => candidate.id !== id), 'delete');
    onItemDelete?.(item);
    return true;
  }, [commit, confirmDelete, deletable, locked, onItemDelete, workingItems]);

  useImperativeHandle(ref, () => ({
    save: () => cloneItems(workingItems),
    restore: (next) => commit(compactItems(next, compactType), 'compact'),
    deleteItem,
  }), [compactType, commit, deleteItem, workingItems]);

  const getCellWidth = useCallback(() => {
    const usableWidth = Math.max(width - margin * 2 - gap * Math.max(activeCols - 1, 0), 0);
    return usableWidth / Math.max(activeCols, 1);
  }, [activeCols, gap, margin, width]);

  const startDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>, item: LayoutItem<T>) => {
    if (locked || !draggable || item.static || item.draggable === false || event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest('button, input, textarea, select, a, [contenteditable="true"]')) return;
    const owner = Array.from(rootRef.current?.querySelectorAll<HTMLElement>('.sp-layout-item') ?? []).find((candidate) => candidate.dataset.layoutId === item.id);
    const handle = owner?.querySelector('.sp-layout-drag-handle');
    if (handle && !target.closest('.sp-layout-drag-handle')) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragState({ id: item.id, startX: event.clientX, startY: event.clientY, originX: item.x, originY: item.y, active: false });
  }, [draggable, locked]);

  const startResize = useCallback((event: ReactPointerEvent<HTMLDivElement>, item: LayoutItem<T>, handle: LayoutResizeHandle) => {
    if (locked || !resizable || item.static || item.resizable === false || event.button !== 0) return;
    event.stopPropagation();
    setResizeState({ id: item.id, handle, startX: event.clientX, startY: event.clientY, active: false });
  }, [locked, resizable]);

  useEffect(() => {
    if (!dragState && !resizeState) return undefined;
    const handleMove = (event: PointerEvent) => {
      if (dragState) {
        const dx = event.clientX - dragState.startX;
        const dy = event.clientY - dragState.startY;
        const active = dragState.active || Math.hypot(dx, dy) >= 4;
        if (!active) return;
        if (!dragState.active) {
          const item = workingItems.find((candidate) => candidate.id === dragState.id);
          if (item) onItemDragStart?.({ item: { ...item }, x: item.x, y: item.y });
        }
        const nextX = dragState.originX + Math.round(dx / Math.max(getCellWidth() + gap, 1));
        const nextY = dragState.originY + Math.round(dy / Math.max(rowHeight + gap, 1));
        setDragState({ ...dragState, active });
        setWorkingItems(moveItem(workingItems, dragState.id, nextX, nextY, preventCollision));
      }
      if (resizeState) {
        const dx = event.clientX - resizeState.startX;
        const dy = event.clientY - resizeState.startY;
        const active = resizeState.active || Math.hypot(dx, dy) >= 4;
        if (!active) return;
        if (!resizeState.active) {
          const item = workingItems.find((candidate) => candidate.id === resizeState.id);
          if (item) onItemResizeStart?.({ item: { ...item }, w: item.w, h: item.h });
        }
        setResizeState({ ...resizeState, active });
        setWorkingItems(resizeItem(workingItems, resizeState.id, resizeState.handle, dx, dy, getCellWidth(), rowHeight, gap));
      }
    };
    const handleUp = () => {
      if (dragState) {
        const item = workingItems.find((candidate) => candidate.id === dragState.id);
        if (item && dragState.active) {
          const next = compactItems(workingItems, compactType);
          commit(next, 'drag');
          onItemDragEnd?.({ item: { ...item }, x: item.x, y: item.y });
        }
        setDragState(null);
      }
      if (resizeState) {
        const item = workingItems.find((candidate) => candidate.id === resizeState.id);
        if (item && resizeState.active) {
          commit(workingItems, 'resize');
          onItemResizeEnd?.({ item: { ...item }, w: item.w, h: item.h });
        }
        setResizeState(null);
      }
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [commit, compactType, dragState, gap, getCellWidth, onItemDragEnd, onItemDragStart, onItemResizeEnd, onItemResizeStart, preventCollision, resizeState, rowHeight, workingItems]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>, item: LayoutItem<T>) => {
    if (locked || item.static) return;
    const step = event.shiftKey ? 2 : 1;
    const next = cloneItems(workingItems);
    const current = next.find((candidate) => candidate.id === item.id);
    if (!current) return;
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (deleteItem(item)) event.preventDefault();
      return;
    }
    if (event.altKey && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      const direction = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0;
      const vertical = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0;
      current.w = Math.max(current.minW ?? 1, Math.min(current.maxW ?? Number.POSITIVE_INFINITY, current.w + direction));
      current.h = Math.max(current.minH ?? 1, Math.min(current.maxH ?? Number.POSITIVE_INFINITY, current.h + vertical));
      commit(next, 'resize');
      event.preventDefault();
      return;
    }
    const x = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0;
    const y = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0;
    if ((x || y) && event.key.startsWith('Arrow')) {
      commit(compactItems(moveItem(next, item.id, current.x + x, current.y + y, preventCollision), compactType), 'drag');
      event.preventDefault();
    }
  }, [commit, compactType, deleteItem, locked, preventCollision, workingItems]);

  const itemRenderer = renderItem ?? (typeof children === 'function' ? children : () => children);
  const itemHeight = getMaxBottom(workingItems, rowHeight, gap, margin);
  const rootStyle: CSSProperties = {
    ...style,
    minHeight: itemHeight,
    '--sp-layout-columns': activeCols,
    '--sp-layout-row-height': `${rowHeight}px`,
    '--sp-layout-gap': `${gap}px`,
  } as CSSProperties;

  return (
    <div
      {...props}
      ref={rootRef}
      dir={direction}
      className={['sp-layout-manager', locked ? 'sp-layout-manager--locked' : '', className].filter(Boolean).join(' ')}
      style={rootStyle}
      role="group"
      aria-label={ariaLabel ?? t('layoutManager')}
      aria-readonly={locked || undefined}
    >
      {workingItems.map((item, index) => {
        const dragging = dragState?.id === item.id && dragState.active;
        const resizing = resizeState?.id === item.id && resizeState.active;
        const itemStyle = getItemStyle(item, activeCols, rowHeight, gap, margin, width);
        const canResize = resizable && !locked && !item.static && item.resizable !== false;
        const canDelete = deletable && !locked && !item.static && item.deletable !== false;
        return (
          <div
            key={item.id}
            data-layout-id={item.id}
            className={['sp-layout-item', dragging ? 'sp-layout-item--dragging' : '', resizing ? 'sp-layout-item--resizing' : '', item.static ? 'sp-layout-item--static' : ''].filter(Boolean).join(' ')}
            style={itemStyle}
            role="group"
            aria-label={item.id}
            aria-roledescription="Layout tile"
            aria-readonly={item.static || locked || undefined}
            tabIndex={locked || item.static ? -1 : 0}
            onPointerDown={(event) => startDrag(event, item)}
            onKeyDown={(event) => handleKeyDown(event, item)}
          >
            {itemRenderer(item, index)}
            {canDelete && <button type="button" className="sp-layout-item__delete" aria-label={`${t('close')} ${item.id}`} onClick={() => deleteItem(item)}>×</button>}
            {canResize && (['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as LayoutResizeHandle[]).map((handle) => (
              <div key={handle} className={`sp-layout-resize-handle sp-layout-resize-handle--${handle}`} role="presentation" onPointerDown={(event) => startResize(event, item, handle)} />
            ))}
          </div>
        );
      })}
      {selectedBreakpoint && <span className="sp-layout-manager__breakpoint" aria-live="polite">{selectedBreakpoint.name}</span>}
    </div>
  );
});

LayoutManager.displayName = 'LayoutManager';
