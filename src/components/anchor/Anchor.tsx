import './Anchor.css';
import { Children, createElement, isValidElement, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ElementType, type KeyboardEvent, type PointerEvent, type ReactElement, type ReactNode, type Ref } from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';

export type AnchorVariant = 'line' | 'stepped' | 'timeline' | 'scrubber' | 'default' | 'bracket' | 'curved' | 'magnifier';
export type AnchorSize = 'sm' | 'md' | 'lg';
export type AnchorOrientation = 'vertical' | 'horizontal';

export interface AnchorItemDefinition {
  id: string;
  label: string;
  href?: string;
  badge?: string;
  icon?: string;
  description?: string;
  indent?: number;
  children?: AnchorItemDefinition[];
  disabled?: boolean;
  isGroup?: boolean;
  data?: unknown;
}

export interface AnchorClickEvent {
  event: React.MouseEvent<HTMLAnchorElement>;
  item: AnchorItemDefinition;
  targetId: string;
}

export interface AnchorItemProps extends Omit<AnchorItemDefinition, 'id' | 'children'> {
  id?: string;
  target?: string;
  children?: ReactNode;
}

/** Declarative item marker consumed by a parent Anchor. */
export function AnchorItem(_props: AnchorItemProps) {
  return null;
}

function declarativeItems(children: ReactNode): AnchorItemDefinition[] {
  const result: AnchorItemDefinition[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement<AnchorItemProps>(child) || child.type !== AnchorItem) return;
    const { id, target, label, children: nested, ...rest } = child.props;
    const resolvedId = (target ?? id ?? '').replace(/^#/, '');
    if (!resolvedId) return;
    result.push({ id: resolvedId, label, ...rest, children: declarativeItems(nested) });
  });
  return result;
}

export interface AnchorTargetProps {
  id?: string;
  target?: string;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLElement>;
  [key: `data-${string}`]: unknown;
}

/** Assigns a stable DOM id to content tracked by Anchor scrollspy. */
export function AnchorTarget({ id, target, as = 'section', children, ...rest }: AnchorTargetProps) {
  return createElement(as, { ...rest, id: (target ?? id ?? '').replace(/^#/, '') || undefined }, children);
}

export interface AnchorTargetBinding {
  id: string;
  ref: (element: HTMLElement | null) => void;
}

/** Hook alternative to AnchorTarget for existing DOM elements. */
export function useAnchorTarget(targetId: string): AnchorTargetBinding {
  const id = targetId.replace(/^#/, '');
  return useMemo(() => ({
    id,
    ref: (element: HTMLElement | null) => {
      if (element) element.id = id;
    },
  }), [id]);
}

export interface AnchorProps {
  items?: readonly AnchorItemDefinition[];
  children?: ReactNode;
  variant?: AnchorVariant;
  size?: AnchorSize;
  orientation?: AnchorOrientation;
  direction?: AnchorOrientation;
  affix?: boolean;
  affixTop?: string | number;
  showIndicator?: boolean;
  title?: string;
  showTitle?: boolean;
  smoothScroll?: boolean;
  activeBackground?: boolean;
  showActiveBackground?: boolean;
  scrubberRowHeight?: number;
  scrubberRestLength?: number;
  scrubberPeakLength?: number;
  scrubberRadius?: number;
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  onAnchorClick?: (event: AnchorClickEvent) => void;
  scrollContainer?: HTMLElement | string | Window | null;
  offsetTop?: number;
  scrollOffset?: number;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

interface FlatAnchorItem extends AnchorItemDefinition { depth: number; index: number; }

function flatten(items: readonly AnchorItemDefinition[], depth = 0, result: FlatAnchorItem[] = []): FlatAnchorItem[] {
  for (const item of items) {
    result.push({ ...item, depth: item.indent ?? depth, index: result.length });
    if (item.children) flatten(item.children, depth + 1, result);
  }
  return result;
}

function normalizeVariant(variant: AnchorVariant): 'line' | 'stepped' | 'timeline' | 'scrubber' {
  if (variant === 'stepped' || variant === 'bracket') return 'stepped';
  if (variant === 'timeline' || variant === 'curved') return 'timeline';
  if (variant === 'scrubber' || variant === 'magnifier') return 'scrubber';
  return 'line';
}

function resolveContainer(value: AnchorProps['scrollContainer']): HTMLElement | Window {
  if (typeof window === 'undefined') return {} as Window;
  if (!value) return window;
  if (typeof value === 'string') return document.querySelector<HTMLElement>(value) ?? window;
  return value;
}

export function Anchor({
  items, children, variant = 'line', size = 'md', orientation, direction: layoutDirection,
  affix = false, affixTop = '1.5rem', showIndicator = true, title, showTitle = false,
  smoothScroll = true, activeBackground = false, showActiveBackground = false,
  scrubberRowHeight = 24, scrubberRestLength = 14, scrubberPeakLength = 54,
  scrubberRadius = 4, activeId, defaultActiveId = '', onActiveChange, onAnchorClick,
  scrollContainer = null, offsetTop = 0, scrollOffset = 0, ariaLabel, className = '', style,
}: AnchorProps) {
  const { direction: textDirection } = useI18n();
  const resolvedItems = useMemo(() => items?.length ? [...items] : declarativeItems(children), [children, items]);
  const flat = useMemo(() => flatten(resolvedItems), [resolvedItems]);
  const normalizedVariant = normalizeVariant(variant);
  const resolvedOrientation = orientation ?? layoutDirection ?? 'vertical';
  const controlled = activeId !== undefined;
  const [internalActive, setInternalActive] = useState(defaultActiveId || flat[0]?.id || '');
  const currentActive = controlled ? activeId : internalActive;
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [pointerRow, setPointerRow] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const manualScroll = useRef(false);
  const manualTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const commitActive = useCallback((id: string) => {
    if (!controlled) setInternalActive(id);
    if (id !== currentActive) onActiveChange?.(id);
  }, [controlled, currentActive, onActiveChange]);

  useEffect(() => {
    if (!flat.length || typeof document === 'undefined') return;
    const container = resolveContainer(scrollContainer);
    const getTop = (element: HTMLElement) => container === window
      ? element.getBoundingClientRect().top
      : element.getBoundingClientRect().top - (container as HTMLElement).getBoundingClientRect().top;
    const update = () => {
      if (manualScroll.current) return;
      const candidates = flat.map((item) => ({ item, element: document.getElementById(item.id) })).filter((entry): entry is { item: FlatAnchorItem; element: HTMLElement } => Boolean(entry.element));
      const threshold = offsetTop + scrollOffset + 1;
      let visible = candidates[0];
      for (const candidate of candidates) if (getTop(candidate.element) <= threshold) visible = candidate; else break;
      if (visible) commitActive(visible.item.id);
    };
    container.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => { container.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [commitActive, flat, offsetTop, scrollContainer, scrollOffset]);

  function activate(event: React.MouseEvent<HTMLAnchorElement>, item: FlatAnchorItem) {
    if (item.disabled || item.isGroup) { event.preventDefault(); return; }
    onAnchorClick?.({ event, item, targetId: item.id });
    const target = document.getElementById(item.id);
    if (!target || (item.href && !item.href.startsWith('#'))) return;
    event.preventDefault();
    commitActive(item.id);
    manualScroll.current = true;
    const container = resolveContainer(scrollContainer);
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = smoothScroll && !reduceMotion ? 'smooth' : 'auto';
    if (container === window) {
      const top = target.getBoundingClientRect().top + window.scrollY - offsetTop - scrollOffset;
      window.scrollTo({ top, behavior });
    } else {
      const element = container as HTMLElement;
      const top = target.getBoundingClientRect().top - element.getBoundingClientRect().top + element.scrollTop - offsetTop - scrollOffset;
      element.scrollTo({ top, behavior });
    }
    if (manualTimer.current) clearTimeout(manualTimer.current);
    manualTimer.current = setTimeout(() => { manualScroll.current = false; }, behavior === 'smooth' ? 600 : 0);
  }
  useEffect(() => () => { if (manualTimer.current) clearTimeout(manualTimer.current); }, []);

  function moveFocus(event: KeyboardEvent<HTMLAnchorElement>, index: number) {
    const previousKey = resolvedOrientation === 'horizontal' ? (textDirection === 'rtl' ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
    const nextKey = resolvedOrientation === 'horizontal' ? (textDirection === 'rtl' ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
    let next = index;
    if (event.key === previousKey) next = (index - 1 + flat.length) % flat.length;
    else if (event.key === nextKey) next = (index + 1) % flat.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = flat.length - 1;
    else return;
    event.preventDefault();
    while (flat[next]?.disabled || flat[next]?.isGroup) next = event.key === previousKey ? (next - 1 + flat.length) % flat.length : (next + 1) % flat.length;
    setFocusedIndex(next);
    navRef.current?.querySelectorAll<HTMLAnchorElement>('.sp-anchor__link')[next]?.focus();
  }

  const activeIndex = Math.max(0, flat.findIndex((item) => item.id === currentActive));
  const previewIndex = pointerRow === null ? focusedIndex : Math.max(0, Math.min(flat.length - 1, Math.round(pointerRow)));
  const previewItem = flat[previewIndex];
  const rootStyle = {
    ...style,
    '--sp-anchor-affix-top': typeof affixTop === 'number' ? `${affixTop}px` : affixTop,
    '--sp-anchor-row-height': `${scrubberRowHeight}px`,
  } as CSSProperties;
  return <nav ref={navRef} className={['sp-anchor', `sp-anchor--${normalizedVariant}`, `sp-anchor--${size}`, `sp-anchor--${resolvedOrientation}`, affix && 'sp-anchor--affix', (activeBackground || showActiveBackground) && 'sp-anchor--active-background', className].filter(Boolean).join(' ')} aria-label={ariaLabel ?? title ?? 'On this page'} dir={textDirection} style={rootStyle}>
    {showTitle && <div className="sp-anchor__title">{title ?? 'On this page'}</div>}
    {normalizedVariant === 'scrubber' ? <div className="sp-anchor__scrubber" onPointerMove={(event: PointerEvent<HTMLDivElement>) => { const rect = event.currentTarget.getBoundingClientRect(); setPointerRow((event.clientY - rect.top) / scrubberRowHeight - .5); }} onPointerLeave={() => setPointerRow(null)}>
      <div className="sp-anchor__ticks">{flat.map((item, index) => { const distance = pointerRow === null ? Number.POSITIVE_INFINITY : Math.abs(index - pointerRow); const bump = distance >= scrubberRadius ? 0 : .5 * (1 + Math.cos(Math.PI * distance / scrubberRadius)); const length = scrubberRestLength + bump * (scrubberPeakLength - scrubberRestLength); return <a key={item.id} href={item.href ?? `#${item.id}`} className={['sp-anchor__link', 'sp-anchor__tick', item.id === currentActive && 'sp-anchor__link--active', item.disabled && 'sp-anchor__link--disabled'].filter(Boolean).join(' ')} aria-label={item.label} aria-current={item.id === currentActive ? 'location' : undefined} aria-disabled={item.disabled || undefined} tabIndex={index === focusedIndex ? 0 : -1} style={{ '--sp-anchor-tick-length': `${length}px`, '--sp-anchor-tick-opacity': index === activeIndex ? .65 : .25 + bump * .75 } as CSSProperties} onFocus={() => setFocusedIndex(index)} onKeyDown={(event) => moveFocus(event, index)} onClick={(event) => activate(event, item)}><span className="sp-anchor__tick-line" /></a>; })}</div>
      {pointerRow !== null && previewItem && <div className="sp-anchor__preview" role="status"><strong>{previewItem.label}</strong>{previewItem.description && <span>{previewItem.description}</span>}</div>}
    </div> : <ol className="sp-anchor__list">{flat.map((item, index) => <li key={item.id} className={['sp-anchor__item', item.isGroup && 'sp-anchor__item--group'].filter(Boolean).join(' ')} style={{ '--sp-anchor-depth': Math.min(2, item.depth) } as CSSProperties}>
      <a href={item.href ?? `#${item.id}`} className={['sp-anchor__link', item.id === currentActive && 'sp-anchor__link--active', item.disabled && 'sp-anchor__link--disabled'].filter(Boolean).join(' ')} aria-current={item.id === currentActive ? 'location' : undefined} aria-disabled={item.disabled || undefined} tabIndex={!item.disabled && !item.isGroup && index === focusedIndex ? 0 : -1} onFocus={() => setFocusedIndex(index)} onKeyDown={(event) => moveFocus(event, index)} onClick={(event) => activate(event, item)}>
        <span className="sp-anchor__rail" aria-hidden="true">{normalizedVariant === 'timeline' && <span className="sp-anchor__dot" />}</span>
        {item.icon && <Icon name={item.icon} size={14} />}
        <span className="sp-anchor__content"><span className="sp-anchor__label">{item.label}</span>{item.description && <span className="sp-anchor__description">{item.description}</span>}</span>
        {item.badge && <span className="sp-anchor__badge">{item.badge}</span>}
      </a>
    </li>)}</ol>}
    {showIndicator && normalizedVariant !== 'scrubber' && <span className="sp-anchor__indicator" aria-hidden="true" style={resolvedOrientation === 'vertical' ? { transform: `translateY(${activeIndex * 100}%)` } : { transform: `translateX(${activeIndex * 100}%)` }} />}
  </nav>;
}
