import './Toolbar.css';
import { useState, useRef, useEffect, useCallback, type MouseEvent, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { Dropdown } from '../dropdown/Dropdown.js';
import type { DropdownItem } from '../dropdown/Dropdown.js';
import { useI18n } from '../../i18n/i18n-context.js';
import type { Border, Chrome, Radius } from '../../chrome/chrome.js';

export type ToolbarSize = 'sm' | 'md' | 'lg';
export type ToolbarButtonPresentation = 'auto' | 'icon-text' | 'icon-only';
export type ToolbarChrome = Chrome | 'subtle' | 'none';
export type ToolbarRadius = Radius;

export interface ToolbarButtonItem {
  icon?: string;
  label: string;
  disabled?: boolean;
  priority?: number;
  active?: boolean;
  toggle?: boolean;
  iconOnly?: boolean;
  presentation?: ToolbarButtonPresentation;
  tooltip?: string;
  onClick?: () => void;
}

export interface ToolbarOverflowEvent {
  hiddenIndices: Set<number>;
  visibleIndices: Set<number>;
  hasOverflow: boolean;
  overflowCount: number;
}

export interface ToolbarProps {
  items?: ToolbarButtonItem[];
  children?: ReactNode;
  size?: ToolbarSize;
  chrome?: ToolbarChrome;
  radius?: ToolbarRadius;
  border?: Border | boolean;
  ariaLabel?: string;
  tooltipGroupDelay?: number;
  tooltipGracePeriod?: number;
  dividerAfter?: number[];
  minimumVisible?: number;
  onItemClick?: (index: number, event: MouseEvent<HTMLButtonElement>) => void;
  onOverflowChange?: (event: ToolbarOverflowEvent) => void;
  className?: string;
}

function iconSizeForToolbar(size: ToolbarSize): number { return size === 'sm' ? 14 : size === 'lg' ? 18 : 16; }

export function Toolbar({ items = [], children, size = 'md', chrome = 'default', radius = 'md', border = true, ariaLabel, tooltipGroupDelay: _tooltipGroupDelay, tooltipGracePeriod: _tooltipGracePeriod, dividerAfter = [], minimumVisible = 0, onItemClick, onOverflowChange, className = '' }: ToolbarProps) {
  const { t } = useI18n();
  void _tooltipGroupDelay;
  void _tooltipGracePeriod;
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());
  const dividerRefs = useRef<Map<number, HTMLElement>>(new Map());
  const [hiddenIndices, setHiddenIndices] = useState<Set<number>>(new Set());
  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container || children != null) return;
    itemRefs.current.forEach((element) => { element.style.display = ''; });
    dividerRefs.current.forEach((element) => { element.style.display = ''; });
    const measurements = items.map((item, index) => {
      const element = itemRefs.current.get(index);
      if (!element) return null;
      const divider = dividerRefs.current.get(index);
      return { index, width: element.offsetWidth + (divider?.offsetWidth ?? 0) + 2, priority: item.priority ?? 0 };
    }).filter((entry): entry is { index: number; width: number; priority: number } => entry != null);
    const total = measurements.reduce((sum, entry) => sum + entry.width, 0);
    const next = new Set<number>();
    if (total > container.clientWidth) {
      let remaining = total;
      const sorted = [...measurements].sort((a, b) => a.priority - b.priority || b.index - a.index);
      for (const entry of sorted) {
        if (remaining <= container.clientWidth - 40) break;
        if (measurements.length - next.size <= minimumVisible) break;
        next.add(entry.index);
        remaining -= entry.width;
      }
    }
    itemRefs.current.forEach((element, index) => { element.style.display = next.has(index) ? 'none' : ''; });
    dividerRefs.current.forEach((element, index) => { element.style.display = next.has(index) ? 'none' : ''; });
    setHiddenIndices((previous) => previous.size === next.size && [...previous].every((index) => next.has(index)) ? previous : next);
    onOverflowChange?.({ hiddenIndices: next, visibleIndices: new Set(items.map((_, index) => index).filter((index) => !next.has(index))), hasOverflow: next.size > 0, overflowCount: next.size });
  }, [children, items, minimumVisible, onOverflowChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || children != null) return;
    if (typeof ResizeObserver === 'undefined') {
      requestAnimationFrame(() => measure());
      return;
    }
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    requestAnimationFrame(() => measure());
    return () => observer.disconnect();
  }, [children, measure]);

  const dividerSet = new Set(dividerAfter);
  const iconSize = iconSizeForToolbar(size);
  const surfaceChrome: Chrome = chrome === 'subtle' ? 'filled' : chrome === 'none' ? 'ghost' : chrome;
  const borderToken: Border = typeof border === 'boolean' ? (border ? 'default' : 'none') : border;
  const rootClasses = [
    'sp-toolbar',
    size !== 'md' && `sp-toolbar--${size}`,
    `sp-toolbar--chrome-${chrome}`,
    `sp-chrome--${surfaceChrome}`,
    radius && `sp-toolbar--radius-${radius}`,
    radius && `sp-radius--${radius}`,
    `sp-border--${borderToken}`,
    borderToken === 'none' && 'sp-toolbar--borderless',
    className,
  ].filter(Boolean).join(' ');
  const overflowItems: DropdownItem[] = items.filter((_, index) => hiddenIndices.has(index)).map((item) => ({ label: item.label, icon: item.icon, disabled: item.disabled, command: item.onClick }));
  const itemContent = items.map((item, index) => {
    const iconText = item.presentation !== 'icon-only' && !item.iconOnly;
    return <span key={`${item.label}-${index}`}><button ref={(element) => { if (element) itemRefs.current.set(index, element); else itemRefs.current.delete(index); }} type="button" className={['sp-toolbar-btn', item.active && 'sp-toolbar-btn--active'].filter(Boolean).join(' ')} title={item.tooltip ?? (iconText ? undefined : item.label)} aria-label={item.label} aria-pressed={item.toggle ? item.active : undefined} disabled={item.disabled} onClick={(event) => { item.onClick?.(); onItemClick?.(index, event); }}>{item.icon && <Icon name={item.icon} size={iconSize} aria-hidden="true" />}{iconText && <span>{item.label}</span>}</button>{dividerSet.has(index) && <span ref={(element) => { if (element) dividerRefs.current.set(index, element); else dividerRefs.current.delete(index); }} className="sp-toolbar__divider" role="separator" aria-orientation="vertical" />}</span>;
  });
  return <div ref={containerRef} className={rootClasses} role="toolbar" aria-label={ariaLabel}>
    {children ?? itemContent}
    {children == null && hiddenIndices.size > 0 && <div className="sp-toolbar__menu"><Dropdown trigger={<button type="button" className="sp-toolbar__menu-trigger" aria-label={t('moreActions')}><Icon name="more-horizontal" size={iconSize} aria-hidden="true" /></button>} items={overflowItems} placement="bottom-end" /></div>}
  </div>;
}

export interface ToolbarButtonProps {
  icon?: string;
  label: string;
  disabled?: boolean;
  iconOnly?: boolean;
  presentation?: ToolbarButtonPresentation;
  active?: boolean;
  toggle?: boolean;
  priority?: number;
  tooltip?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
}

export function ToolbarButton({ icon, label, disabled = false, iconOnly = false, presentation = 'auto', active = false, toggle = false, priority = 0, tooltip, tooltipPlacement: _tooltipPlacement, onClick, children }: ToolbarButtonProps) {
  void _tooltipPlacement;
  const showText = !iconOnly && presentation !== 'icon-only';
  return <span className="sp-toolbar__item" data-toolbar-priority={priority}><button type="button" className={['sp-toolbar-btn', active && 'sp-toolbar-btn--active'].filter(Boolean).join(' ')} aria-label={label} aria-pressed={toggle ? active : undefined} disabled={disabled} title={tooltip ?? (!showText ? label : undefined)} onClick={onClick}>{icon && <Icon name={icon} size={16} aria-hidden="true" />}{showText && <span>{children ?? label}</span>}</button></span>;
}

export interface ToolbarGroupProps { label?: string; priority?: number; children?: ReactNode; className?: string; }
export function ToolbarGroup({ label, priority = 0, children, className = '' }: ToolbarGroupProps) { return <div className={['sp-toolbar__group', className].filter(Boolean).join(' ')} role="group" aria-label={label} data-toolbar-priority={priority}>{children}</div>; }
export function ToolbarDivider() { return <span className="sp-toolbar__divider" role="separator" aria-orientation="vertical" />; }
export function ToolbarSpacer() { return <span className="sp-toolbar__spacer" aria-hidden="true" />; }
