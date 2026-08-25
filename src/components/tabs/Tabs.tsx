import './Tabs.css';
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';

export interface TabItem {
  label: string;
  icon?: string;
  badge?: ReactNode;
  disabled?: boolean;
  closeable?: boolean;
  lazy?: boolean;
  routeFragment?: string;
  id?: string;
  content?: ReactNode;
  header?: ReactNode;
}

export interface TabHeaderRenderProps { tab: TabItem; index: number; active: boolean; }
export interface TabContextMenuEvent { index: number; tab: TabItem; x: number; y: number; }
export interface TabReorderEvent { from: number; to: number; }
export type TabsToolbarPlacement = 'end' | 'after-tabs';

export interface TabsProps {
  tabs: TabItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onChange?: (index: number) => void;
  onTabChange?: (index: number) => void;
  vertical?: boolean;
  lazy?: boolean;
  reorderable?: boolean;
  toolbar?: ReactNode;
  toolbarBorders?: boolean;
  toolbarPlacement?: TabsToolbarPlacement;
  renderTab?: (props: TabHeaderRenderProps) => ReactNode;
  renderPanel?: (tab: TabItem, index: number) => ReactNode;
  onClose?: (index: number, tab: TabItem) => void;
  onTabClose?: (index: number, tab: TabItem) => void;
  onContextMenu?: (event: TabContextMenuEvent) => void;
  onTabContextMenu?: (event: TabContextMenuEvent) => void;
  onReorder?: (event: TabReorderEvent) => void;
  onTabReorder?: (event: TabReorderEvent) => void;
  ariaLabel?: string;
  className?: string;
}

export function Tabs({
  tabs,
  activeIndex: controlledIndex,
  defaultActiveIndex = 0,
  onChange,
  onTabChange,
  vertical = false,
  lazy = false,
  reorderable = false,
  toolbar,
  toolbarBorders = false,
  toolbarPlacement = 'end',
  renderTab,
  renderPanel,
  onClose,
  onTabClose,
  onContextMenu,
  onTabContextMenu,
  onReorder,
  onTabReorder,
  ariaLabel,
  className = '',
}: TabsProps) {
  const { t, isRtl } = useI18n();
  const baseId = useId();
  const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultActiveIndex);
  const [activated, setActivated] = useState<Set<number>>(() => new Set([defaultActiveIndex]));
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [canScroll, setCanScroll] = useState(false);
  const tabStripRef = useRef<HTMLDivElement>(null);
  const current = controlledIndex ?? uncontrolledIndex;
  const selectedIndex = tabs[current] && !tabs[current].disabled ? current : tabs.findIndex((tab) => !tab.disabled);

  useEffect(() => {
    // The activated set mirrors externally controlled selection as well as user selection.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActivated((previous) => previous.has(selectedIndex) ? previous : new Set([...previous, selectedIndex]));
  }, [selectedIndex]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fragment = window.location.hash.slice(1);
    const match = tabs.findIndex((tab) => tab.routeFragment === fragment);
    if (match >= 0 && controlledIndex === undefined && !tabs[match].disabled) {
      // Fragment synchronization is an external URL-to-state bridge.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUncontrolledIndex(match);
    }
  }, [controlledIndex, tabs]);

  const updateScrollState = useCallback(() => {
    const strip = tabStripRef.current;
    if (strip) setCanScroll(strip.scrollWidth > strip.clientWidth + 1);
  }, []);

  useEffect(() => {
    const strip = tabStripRef.current;
    if (!strip) return;
    if (typeof ResizeObserver === 'undefined') {
      updateScrollState();
      return;
    }
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(strip);
    updateScrollState();
    return () => observer.disconnect();
  }, [tabs.length, updateScrollState]);

  const selectTab = useCallback((index: number) => {
    const tab = tabs[index];
    if (!tab || tab.disabled) return;
    if (controlledIndex === undefined) setUncontrolledIndex(index);
    setActivated((previous) => new Set([...previous, index]));
    onChange?.(index);
    onTabChange?.(index);
    if (tab.routeFragment && typeof window !== 'undefined') window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${tab.routeFragment}`);
  }, [controlledIndex, onChange, onTabChange, tabs]);

  const focusTab = (index: number, container: HTMLElement) => container.querySelector<HTMLElement>(`[data-tab-index="${index}"]`)?.focus();
  const enabledIndices = tabs.map((tab, index) => tab.disabled ? -1 : index).filter((index) => index >= 0);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || target.getAttribute('role') !== 'tab') return;
    const index = Number(target.dataset.tabIndex);
    if ((event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey)) && (onContextMenu || onTabContextMenu)) {
      event.preventDefault();
      const tab = tabs[index];
      if (tab) { const payload = { index, tab, x: target.getBoundingClientRect().left, y: target.getBoundingClientRect().bottom }; onContextMenu?.(payload); onTabContextMenu?.(payload); }
      return;
    }
    const nextKey = vertical ? 'ArrowDown' : (isRtl ? 'ArrowLeft' : 'ArrowRight');
    const previousKey = vertical ? 'ArrowUp' : (isRtl ? 'ArrowRight' : 'ArrowLeft');
    const position = enabledIndices.indexOf(index);
    let next = -1;
    if (event.key === nextKey) next = enabledIndices[(position + 1 + enabledIndices.length) % enabledIndices.length] ?? -1;
    else if (event.key === previousKey) next = enabledIndices[(position - 1 + enabledIndices.length) % enabledIndices.length] ?? -1;
    else if (event.key === 'Home') next = enabledIndices[0] ?? -1;
    else if (event.key === 'End') next = enabledIndices[enabledIndices.length - 1] ?? -1;
    if (next < 0) return;
    event.preventDefault();
    selectTab(next);
    focusTab(next, event.currentTarget);
  };

  const closeTab = (index: number) => {
    const tab = tabs[index];
    if (!tab?.closeable) return;
    onClose?.(index, tab);
    onTabClose?.(index, tab);
  };

  const contextMenu = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    if (!onContextMenu && !onTabContextMenu) return;
    event.preventDefault();
    const tab = tabs[index];
    if (!tab) return;
    const payload = { index, tab, x: event.clientX, y: event.clientY };
    onContextMenu?.(payload);
    onTabContextMenu?.(payload);
  };

  const reorder = (from: number, to: number) => {
    if (!reorderable || from === to || from < 0 || to < 0) return;
    const payload = { from, to };
    onReorder?.(payload);
    onTabReorder?.(payload);
  };

  const scrollTabs = (direction: number) => tabStripRef.current?.scrollBy({ left: direction * (isRtl ? -1 : 1) * 160, behavior: 'smooth' });
  const header = (
    <div className={['sp-tabs__header', toolbarBorders && 'sp-tabs__header--borders'].filter(Boolean).join(' ')}>
      {canScroll && <button type="button" className="sp-tabs__scroll sp-tabs__scroll--start" aria-label={t('scrollTabsLeft')} onClick={() => scrollTabs(-1)}><Icon name="chevron-left" size={16} /></button>}
      <div ref={tabStripRef} className="sp-tabs__tab-strip" role="tablist" aria-label={ariaLabel ?? t('tab')} aria-orientation={vertical ? 'vertical' : 'horizontal'} onKeyDown={handleKeyDown}>
        {tabs.map((tab, index) => {
          const active = index === selectedIndex;
          const tabId = `${baseId}-tab-${index}`;
          const panelId = `${baseId}-panel-${index}`;
          const headerContent = renderTab?.({ tab, index, active }) ?? tab.header ?? <>{tab.icon && <Icon name={tab.icon} size={14} aria-hidden="true" />}{tab.label}</>;
          return (
            <button key={tab.id ?? `${tab.label}-${index}`} id={tabId} className={['sp-tabs__tab', active && 'sp-tabs__tab--active', tab.disabled && 'sp-tabs__tab--disabled'].filter(Boolean).join(' ')} type="button" role="tab" aria-selected={active} aria-controls={panelId} aria-disabled={tab.disabled || undefined} disabled={tab.disabled} tabIndex={active ? 0 : -1} data-tab-index={index} draggable={reorderable} onClick={() => selectTab(index)} onContextMenu={(event) => contextMenu(event, index)} onDragStart={() => setDragIndex(index)} onDragOver={(event) => { if (reorderable) event.preventDefault(); }} onDrop={() => { if (dragIndex != null) reorder(dragIndex, index); setDragIndex(null); }}>
              <span className="sp-tabs__tab-label">{headerContent}</span>
              {tab.badge != null && <span className="sp-tabs__badge">{tab.badge}</span>}
              {tab.closeable && <span className="sp-tabs__close" role="button" tabIndex={0} aria-label={`${t('close')} ${tab.label}`} onClick={(event) => { event.stopPropagation(); closeTab(index); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); closeTab(index); } }}>×</span>}
            </button>
          );
        })}
      </div>
      {canScroll && <button type="button" className="sp-tabs__scroll sp-tabs__scroll--end" aria-label={t('scrollTabsRight')} onClick={() => scrollTabs(1)}><Icon name="chevron-right" size={16} /></button>}
      {toolbarPlacement === 'end' && toolbar && <div className="sp-tabs__toolbar">{toolbar}</div>}
    </div>
  );

  return (
    <div className={['sp-tabs', vertical && 'sp-tabs--vertical', className].filter(Boolean).join(' ')}>
      {header}
      {toolbarPlacement === 'after-tabs' && toolbar && <div className="sp-tabs__toolbar sp-tabs__toolbar--after">{toolbar}</div>}
      <div className="sp-tabs__panels">
        {tabs.map((tab, index) => {
          const active = index === selectedIndex;
          const shouldRender = active || (activated.has(index) && (lazy || tab.lazy));
          if (!shouldRender) return null;
          const tabId = `${baseId}-tab-${index}`;
          const panelId = `${baseId}-panel-${index}`;
          return <div key={tab.id ?? `${tab.label}-${index}`} id={panelId} className="sp-tab-panel" role="tabpanel" aria-labelledby={tabId} hidden={!active} tabIndex={active ? 0 : -1}>{renderPanel?.(tab, index) ?? tab.content}</div>;
        })}
      </div>
    </div>
  );
}
