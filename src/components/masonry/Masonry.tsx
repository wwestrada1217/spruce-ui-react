import {
  createContext,
  forwardRef,
  useId,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import './Masonry.css';
import { useI18n } from '../../i18n/i18n-context.js';

export interface MasonryItemLayout {
  x: number;
  y: number;
  width: number;
}

interface RegisteredItem {
  element: HTMLDivElement;
}

interface MasonryContextValue {
  register: (id: string, element: HTMLDivElement) => void;
  unregister: (id: string) => void;
  layouts: Map<string, MasonryItemLayout>;
  indexes: Map<string, number>;
}

const MasonryContext = createContext<MasonryContextValue | null>(null);

export interface MasonryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  columns?: number;
  minColumnWidth?: number;
  gap?: number;
  children?: ReactNode;
}

export interface MasonryItemProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const MasonryItem = forwardRef<HTMLDivElement, MasonryItemProps>(function MasonryItem(
  { children, className, style, ...props },
  forwardedRef,
) {
  const context = useContext(MasonryContext);
  const generatedId = useId();
  const id = `masonry-item-${generatedId}`;
  const internalRef = useRef<HTMLDivElement>(null);
  const layout = context?.layouts.get(id);
  const index = context?.indexes.get(id);

  const register = context?.register;
  const unregister = context?.unregister;
  useEffect(() => {
    const element = internalRef.current;
    if (!register || !unregister || !element) return undefined;
    register(id, element);
    return () => unregister(id);
  }, [id, register, unregister]);

  const setRef = useCallback((element: HTMLDivElement | null) => {
    internalRef.current = element;
    if (typeof forwardedRef === 'function') forwardedRef(element);
    else if (forwardedRef) forwardedRef.current = element;
  }, [forwardedRef]);

  const itemStyle: CSSProperties = {
    ...style,
    ...(layout ? { inlineSize: layout.width, transform: `translate3d(${layout.x}px, ${layout.y}px, 0)` } : {}),
    visibility: layout ? style?.visibility : 'hidden',
  };

  return (
    <div
      {...props}
      ref={setRef}
      className={['sp-masonry__item', className].filter(Boolean).join(' ')}
      style={itemStyle}
      data-masonry-ready={layout ? 'true' : 'false'}
      data-masonry-index={index ?? -1}
    >
      {children}
    </div>
  );
});

export const Masonry = forwardRef<HTMLDivElement, MasonryProps>(function Masonry(
  { columns = 3, minColumnWidth = 240, gap = 16, children, className, style, ...props },
  forwardedRef,
) {
  const { direction } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<string, RegisteredItem>>(new Map());
  const frameRef = useRef<number | null>(null);
  const [layouts, setLayouts] = useState<Map<string, MasonryItemLayout>>(new Map());
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [version, setVersion] = useState(0);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  const setRootRef = useCallback((element: HTMLDivElement | null) => {
    rootRef.current = element;
    if (typeof forwardedRef === 'function') forwardedRef(element);
    else if (forwardedRef) forwardedRef.current = element;
  }, [forwardedRef]);

  const register = useCallback((id: string, element: HTMLDivElement) => {
    itemsRef.current.set(id, { element });
    setRegisteredIds((current) => current.includes(id) ? current : [...current, id]);
    setVersion((value) => value + 1);
  }, []);
  const unregister = useCallback((id: string) => {
    itemsRef.current.delete(id);
    setRegisteredIds((current) => current.filter((candidate) => candidate !== id));
    setVersion((value) => value + 1);
  }, []);

  const layoutItems = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const entries = Array.from(itemsRef.current.entries());
    const nextWidth = root.clientWidth;
    setWidth(nextWidth);
    if (nextWidth <= 0 || entries.length === 0) {
      setLayouts(new Map());
      setHeight(0);
      return;
    }
    const requestedColumns = columns > 0 ? columns : Math.max(1, Math.floor((nextWidth + gap) / Math.max(minColumnWidth + gap, 1)));
    const count = Math.max(1, Math.min(requestedColumns, entries.length));
    const columnWidth = (nextWidth - gap * (count - 1)) / count;
    const columnHeights = Array.from({ length: count }, () => 0);
    const nextLayouts = new Map<string, MasonryItemLayout>();
    const nextIndexes = new Map<string, number>();
    entries.forEach(([id, { element }], index) => {
      const column = columnHeights.indexOf(Math.min(...columnHeights));
      const y = columnHeights[column];
      nextLayouts.set(id, { x: column * (columnWidth + gap), y, width: columnWidth });
      nextIndexes.set(id, index);
      columnHeights[column] = y + element.offsetHeight + gap;
    });
    setLayouts(nextLayouts);
    setHeight(Math.max(0, ...columnHeights) - gap);
    setWidth(nextWidth);
  }, [columns, gap, minColumnWidth]);

  const scheduleLayout = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      layoutItems();
    });
  }, [layoutItems]);

  useEffect(() => {
    scheduleLayout();
    const root = rootRef.current;
    if (!root) return undefined;
    window.addEventListener('resize', scheduleLayout);
    if (typeof ResizeObserver === 'undefined') {
      return () => window.removeEventListener('resize', scheduleLayout);
    }
    const observer = new ResizeObserver(scheduleLayout);
    observer.observe(root);
    for (const { element } of itemsRef.current.values()) observer.observe(element);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', scheduleLayout);
    };
  }, [scheduleLayout, version]);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  const indexes = useMemo(() => {
    const result = new Map<string, number>();
    registeredIds.forEach((id, index) => result.set(id, index));
    return result;
  }, [registeredIds]);
  const contextValue = useMemo(() => ({ register, unregister, layouts, indexes }), [indexes, layouts, register, unregister]);
  const rootStyle: CSSProperties = { ...style, height: height || undefined, '--sp-masonry-gap': `var(--sp-space-${gap}, ${gap}px)` } as CSSProperties;

  return (
    <MasonryContext.Provider value={contextValue}>
      <div {...props} ref={setRootRef} dir={direction} className={['sp-masonry', width > 0 ? 'sp-masonry--measured' : '', className].filter(Boolean).join(' ')} style={rootStyle}>
        {children}
      </div>
    </MasonryContext.Provider>
  );
});

Masonry.displayName = 'Masonry';
