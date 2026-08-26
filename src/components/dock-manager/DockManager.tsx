import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type ForwardedRef,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { Button } from '../button/Button.js';
import { useI18n } from '../../i18n/i18n-context.js';
import './DockManager.css';

export type DockSplitDirection = 'h' | 'v';
export type DropZone = 'top' | 'right' | 'bottom' | 'left' | 'center';
export type AutoHideStripPosition = 'left' | 'right' | 'top' | 'bottom';

export interface DockLeafNode { type: 'leaf'; id: string; panelId: string }
export interface DockTabNode { type: 'tab'; id: string; panelIds: string[]; activeIndex: number }
export interface DockDocumentNode { type: 'document'; id: string; panelIds: string[]; activeIndex: number }
export interface DockSplitNode { type: 'split'; id: string; direction: DockSplitDirection; children: DockNode[]; sizes: number[] }
export type DockNode = DockLeafNode | DockTabNode | DockDocumentNode | DockSplitNode;

export interface DockFloat {
  panelId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tabPanelIds?: string[];
  activeIndex?: number;
  document?: boolean;
}

export interface DockAutoHide {
  panelId: string;
  side: AutoHideStripPosition;
  ref?: { panelId: string; zone: DropZone };
}

export interface DockLayout {
  root: DockNode | null;
  floats: DockFloat[];
  autoHide?: DockAutoHide[];
  autoHideHints?: Record<string, AutoHideStripPosition>;
}

export interface AutoHideStripTab {
  id: string;
  label: string;
  icon?: string;
  title?: string;
}

export interface DockPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  panelId: string;
  title: string;
  icon?: string | null;
  closeable?: boolean;
  allowedDockZones?: readonly DropZone[] | null;
  showHeader?: boolean;
  badge?: number | string | null;
  children?: ReactNode;
}

export function DockPanel({ panelId, title, children, className, ...props }: DockPanelProps) {
  return <div {...props} className={['sp-dock-panel', className].filter(Boolean).join(' ')} data-panel-id={panelId} data-panel-title={title}>{children}</div>;
}

export interface DockPanelToolsProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function DockPanelTools({ children, className, ...props }: DockPanelToolsProps) {
  const { onPointerDown, ...rest } = props;
  return <div {...rest} className={['sp-dock-panel-tools', className].filter(Boolean).join(' ')} onPointerDown={(event) => { event.stopPropagation(); onPointerDown?.(event); }}>{children}</div>;
}

export interface AutoHideStripProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  position: AutoHideStripPosition;
  tabs?: readonly AutoHideStripTab[];
  activeTabId?: string | null;
  label?: string | null;
  onTabClick?: (id: string) => void;
}

export function AutoHideStrip({ position, tabs = [], activeTabId = null, label, onTabClick, className, ...props }: AutoHideStripProps) {
  const { t } = useI18n();
  const vertical = position === 'left' || position === 'right';
  return (
    <div {...props} className={['sp-auto-hide-strip', `sp-auto-hide-strip--${position}`, className].filter(Boolean).join(' ')} role="tablist" aria-orientation={vertical ? 'vertical' : 'horizontal'} aria-label={label ?? `${t('autoHidePanel')} (${position})`}>
      {tabs.map((tab) => (
        <button key={tab.id} type="button" role="tab" aria-selected={activeTabId === tab.id} aria-label={tab.title ?? tab.label} title={tab.title} className="sp-auto-hide-strip__tab" onClick={() => onTabClick?.(tab.id)}>
          {tab.icon && <span aria-hidden="true" className="sp-auto-hide-strip__icon">{tab.icon}</span>}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export interface DockManagerHandle {
  getLayout: () => DockLayout;
  setLayout: (layout: DockLayout) => void;
  resetLayout: () => void;
  exportLayout: () => string;
  importLayout: (value: string) => boolean;
  activatePanel: (panelId: string) => void;
  autoHidePanel: (panelId: string, side: AutoHideStripPosition) => void;
  restoreAutoHide: (panelId: string) => void;
}

export interface DockManagerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  layout?: DockLayout | null;
  storageKey?: string | null;
  thinSplitters?: boolean;
  dense?: boolean;
  tabsAtBottom?: boolean;
  onLayoutChange?: (layout: DockLayout) => void;
  onPanelActivate?: (panelId: string) => void;
  children?: ReactNode;
}

interface PanelRecord {
  props: DockPanelProps;
  content: ReactNode;
  tools: ReactNode;
}

function cloneLayout(layout: DockLayout): DockLayout {
  return JSON.parse(JSON.stringify(layout)) as DockLayout;
}

function buildDefaultLayout(panelIds: string[]): DockLayout {
  if (panelIds.length === 0) return { root: null, floats: [] };
  if (panelIds.length === 1) return { root: { type: 'leaf', id: `leaf-${panelIds[0]}`, panelId: panelIds[0] }, floats: [] };
  const children: DockNode[] = panelIds.map((panelId) => ({ type: 'leaf', id: `leaf-${panelId}`, panelId }));
  return { root: { type: 'split', id: 'root-split', direction: 'h', children, sizes: panelIds.map(() => 100 / panelIds.length) }, floats: [] };
}

function removePanel(node: DockNode | null, panelId: string): { node: DockNode | null; removed: boolean } {
  if (!node) return { node: null, removed: false };
  if (node.type === 'leaf') return node.panelId === panelId ? { node: null, removed: true } : { node, removed: false };
  if (node.type === 'tab' || node.type === 'document') {
    if (!node.panelIds.includes(panelId)) return { node, removed: false };
    const panelIds = node.panelIds.filter((id) => id !== panelId);
    if (panelIds.length === 0) return { node: null, removed: true };
    if (panelIds.length === 1 && node.type === 'tab') return { node: { type: 'leaf', id: node.id, panelId: panelIds[0] }, removed: true };
    return { node: { ...node, panelIds, activeIndex: Math.min(node.activeIndex, panelIds.length - 1) }, removed: true };
  }
  let removed = false;
  const children = node.children.map((child) => {
    const result = removePanel(child, panelId);
    removed ||= result.removed;
    return result.node;
  }).filter((child): child is DockNode => child !== null);
  if (!removed) return { node, removed: false };
  if (children.length === 0) return { node: null, removed: true };
  if (children.length === 1) return { node: children[0], removed: true };
  return { node: { ...node, children, sizes: children.map((_, index) => node.sizes[index] ?? 100 / children.length) }, removed: true };
}

function replaceNode(node: DockNode, id: string, replacement: DockNode): DockNode {
  if (node.id === id) return replacement;
  if (node.type !== 'split') return node;
  return { ...node, children: node.children.map((child) => replaceNode(child, id, replacement)) };
}

function nodeForPanel(node: DockNode | null, panelId: string): DockNode | null {
  if (!node) return null;
  if (node.type === 'leaf' && node.panelId === panelId) return node;
  if ((node.type === 'tab' || node.type === 'document') && node.panelIds.includes(panelId)) return node;
  if (node.type === 'split') {
    for (const child of node.children) {
      const result = nodeForPanel(child, panelId);
      if (result) return result;
    }
  }
  return null;
}

function activateInNode(node: DockNode, panelId: string): DockNode {
  if (node.type === 'tab' || node.type === 'document') {
    const activeIndex = node.panelIds.indexOf(panelId);
    return activeIndex >= 0 ? { ...node, activeIndex } : node;
  }
  if (node.type === 'split') return { ...node, children: node.children.map((child) => activateInNode(child, panelId)) };
  return node;
}

function dockPanel(layout: DockLayout, panelId: string, targetPanelId: string, zone: DropZone): DockLayout {
  const without = removePanel(layout.root, panelId);
  const target = nodeForPanel(without.node, targetPanelId);
  if (!target || panelId === targetPanelId) return layout;
  let root = without.node;
  const newPanel: DockLeafNode = { type: 'leaf', id: `leaf-${panelId}-${Date.now()}`, panelId };
  if (zone === 'center' && (target.type === 'leaf' || target.type === 'tab')) {
    const replacement: DockTabNode = target.type === 'leaf'
      ? { type: 'tab', id: target.id, panelIds: [target.panelId, panelId], activeIndex: 1 }
      : { ...target, panelIds: [...target.panelIds, panelId], activeIndex: target.panelIds.length };
    root = root ? replaceNode(root, target.id, replacement) : replacement;
  } else if (root) {
    const direction: DockSplitDirection = zone === 'top' || zone === 'bottom' ? 'v' : 'h';
    const first = zone === 'top' || zone === 'left' ? newPanel : target;
    const second = first === newPanel ? target : newPanel;
    const split: DockSplitNode = { type: 'split', id: `split-${Date.now()}`, direction, children: [first, second], sizes: [50, 50] };
    root = replaceNode(root, target.id, split);
  } else {
    root = newPanel;
  }
  return { ...cloneLayout(layout), root, floats: layout.floats.filter((float) => float.panelId !== panelId), autoHide: layout.autoHide?.filter((entry) => entry.panelId !== panelId) };
}

function updateSplitSizes(node: DockNode, id: string, index: number, delta: number): DockNode {
  if (node.id === id && node.type === 'split') {
    const sizes = [...node.sizes];
    const next = Math.max(5, Math.min(95, (sizes[index] ?? 50) + delta));
    const neighbor = index + 1;
    if (neighbor >= sizes.length) return node;
    const available = (sizes[index] ?? 50) + (sizes[neighbor] ?? 50);
    sizes[index] = next;
    sizes[neighbor] = Math.max(5, available - next);
    return { ...node, sizes };
  }
  if (node.type !== 'split') return node;
  return { ...node, children: node.children.map((child) => updateSplitSizes(child, id, index, delta)) };
}

function collectPanels(children: ReactNode): Map<string, PanelRecord> {
  const records = new Map<string, PanelRecord>();
  Children.forEach(children, (child) => {
    if (!isValidElement<DockPanelProps>(child) || child.type !== DockPanel) return;
    const tools: ReactNode[] = [];
    const content: ReactNode[] = [];
    Children.forEach(child.props.children, (nested) => {
      if (isValidElement(nested) && nested.type === DockPanelTools) tools.push(nested);
      else content.push(nested);
    });
    records.set(child.props.panelId, { props: child.props, content, tools });
  });
  return records;
}

interface NodeViewProps {
  node: DockNode;
  panels: Map<string, PanelRecord>;
  tabsAtBottom: boolean;
  onActivate: (panelId: string) => void;
  onClose: (panelId: string) => void;
  onDock: (panelId: string, targetPanelId: string, zone: DropZone) => void;
  onResize: (splitId: string, index: number, delta: number) => void;
}

function dropZone(event: DragEvent<HTMLElement>): DropZone {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
  const y = (event.clientY - rect.top) / Math.max(rect.height, 1);
  if (y < 0.25) return 'top';
  if (y > 0.75) return 'bottom';
  if (x < 0.25) return 'left';
  if (x > 0.75) return 'right';
  return 'center';
}

function PanelView({ panelId, panels, onActivate, onClose, onDock, onFloatPointerDown, active = true }: { panelId: string; panels: Map<string, PanelRecord>; onActivate: (panelId: string) => void; onClose: (panelId: string) => void; onDock: (panelId: string, targetPanelId: string, zone: DropZone) => void; onFloatPointerDown?: (panelId: string, event: ReactPointerEvent<HTMLElement>) => void; active?: boolean }) {
  const panel = panels.get(panelId);
  if (!panel) return null;
  const { props } = panel;
  const allowed = props.allowedDockZones;
  return (
    <section className="sp-dock-panel-view" data-panel-id={panelId} onDragOver={(event) => { if (!allowed || allowed.length > 0) event.preventDefault(); }} onDrop={(event) => { event.preventDefault(); const source = event.dataTransfer.getData('application/x-spruce-dock-panel'); if (source && (!allowed || allowed.includes(dropZone(event)))) onDock(source, panelId, dropZone(event)); }}>
      {props.showHeader !== false && <header className="sp-dock-panel-view__header" draggable={props.allowedDockZones?.length !== 0} onPointerDown={(event) => onFloatPointerDown?.(panelId, event)} onDragStart={(event) => { event.dataTransfer.setData('application/x-spruce-dock-panel', panelId); event.dataTransfer.effectAllowed = 'move'; }}>
        <button type="button" className="sp-dock-panel-view__title" role="button" onClick={() => onActivate(panelId)}>{props.icon && <span aria-hidden="true">{props.icon}</span>}<span>{props.title}</span>{props.badge !== null && props.badge !== undefined && <span className="sp-dock-panel-view__badge">{props.badge}</span>}</button>
        <span className="sp-dock-panel-view__tools">{panel.tools}</span>
        {props.closeable !== false && <Button variant="ghost" size="sm" iconOnly aria-label={`Close ${props.title}`} className="sp-dock-panel-view__close" onClick={() => onClose(panelId)}>×</Button>}
      </header>}
      {active && <div className="sp-dock-panel-view__content">{panel.content}</div>}
    </section>
  );
}

function NodeView({ node, panels, tabsAtBottom, onActivate, onClose, onDock, onResize }: NodeViewProps) {
  if (node.type === 'leaf') return <PanelView panelId={node.panelId} panels={panels} onActivate={onActivate} onClose={onClose} onDock={onDock} />;
  if (node.type === 'tab' || node.type === 'document') {
    const activeId = node.panelIds[node.activeIndex] ?? node.panelIds[0];
    return (
      <section className={['sp-dock-stack', node.type === 'document' ? 'sp-dock-stack--document' : ''].filter(Boolean).join(' ')}>
        <div className={['sp-dock-stack__tabs', tabsAtBottom ? 'sp-dock-stack__tabs--bottom' : ''].filter(Boolean).join(' ')} role="tablist" aria-label={node.type === 'document' ? 'Documents' : 'Panels'}>
          {node.panelIds.map((panelId) => {
            const panel = panels.get(panelId);
            if (!panel) return null;
            return <span className="sp-dock-stack__tab-wrap" key={panelId}><button type="button" role="tab" aria-selected={activeId === panelId} className="sp-dock-stack__tab" onClick={() => onActivate(panelId)}>{panel.props.title}</button>{panel.props.closeable !== false && <Button variant="ghost" size="sm" iconOnly aria-label={`Close ${panel.props.title}`} onClick={() => onClose(panelId)}>×</Button>}</span>;
          })}
        </div>
        <PanelView panelId={activeId} panels={panels} onActivate={onActivate} onClose={onClose} onDock={onDock} />
      </section>
    );
  }
  return (
    <div className={['sp-dock-split', `sp-dock-split--${node.direction}`].join(' ')} data-split-id={node.id}>
      {node.children.map((child, index) => <div className="sp-dock-split__child" key={child.id} style={{ flexBasis: `${node.sizes[index] ?? 100 / node.children.length}%` }}><NodeView node={child} panels={panels} tabsAtBottom={tabsAtBottom} onActivate={onActivate} onClose={onClose} onDock={onDock} onResize={onResize} />{index < node.children.length - 1 && <button type="button" role="separator" aria-orientation={node.direction === 'h' ? 'vertical' : 'horizontal'} aria-valuenow={Math.round(node.sizes[index] ?? 50)} aria-valuemin={5} aria-valuemax={95} className="sp-dock-split__handle" onKeyDown={(event) => { if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { onResize(node.id, index, -2); event.preventDefault(); } if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { onResize(node.id, index, 2); event.preventDefault(); } }} onPointerDown={(event) => { const start = node.direction === 'h' ? event.clientX : event.clientY; const parent = event.currentTarget.parentElement?.parentElement; const size = node.direction === 'h' ? parent?.clientWidth ?? 1 : parent?.clientHeight ?? 1; const move = (moveEvent: PointerEvent) => onResize(node.id, index, ((node.direction === 'h' ? moveEvent.clientX : moveEvent.clientY) - start) / Math.max(size, 1) * 100); const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); }; window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); }} />}</div>)}
    </div>
  );
}

export const DockManager = forwardRef(function DockManager(
  { layout: controlledLayout = null, storageKey = null, thinSplitters = false, dense = false, tabsAtBottom = false, onLayoutChange, onPanelActivate, children, className, ...props }: DockManagerProps,
  ref: ForwardedRef<DockManagerHandle>,
) {
  const { direction, t } = useI18n();
  const panels = useMemo(() => collectPanels(children), [children]);
  const initialLayout = useMemo(() => {
    if (controlledLayout) return cloneLayout(controlledLayout);
    if (storageKey && typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        try { return JSON.parse(saved) as DockLayout; } catch { /* ignore invalid persisted layouts */ }
      }
    }
    return buildDefaultLayout([...panels.keys()]);
  }, [controlledLayout, panels, storageKey]);
  const [currentLayout, setCurrentLayout] = useState<DockLayout>(initialLayout);
  const [activePeek, setActivePeek] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!controlledLayout) return undefined;
    const timer = window.setTimeout(() => setCurrentLayout(cloneLayout(controlledLayout)), 0);
    return () => window.clearTimeout(timer);
  }, [controlledLayout]);

  const commit = useCallback((next: DockLayout) => {
    const cloned = cloneLayout(next);
    setCurrentLayout(cloned);
    if (storageKey && typeof window !== 'undefined') window.localStorage.setItem(storageKey, JSON.stringify(cloned));
    onLayoutChange?.(cloned);
  }, [onLayoutChange, storageKey]);
  const resetLayout = useCallback(() => commit(buildDefaultLayout([...panels.keys()])), [commit, panels]);
  const getLayout = useCallback(() => cloneLayout(currentLayout), [currentLayout]);
  const setLayout = useCallback((next: DockLayout) => commit(next), [commit]);
  const importLayout = useCallback((value: string) => { try { const next = JSON.parse(value) as DockLayout; if (!('root' in next) || !('floats' in next)) return false; commit(next); return true; } catch { return false; } }, [commit]);
  const activatePanel = useCallback((panelId: string) => {
    setActivePeek(null);
    if (currentLayout.root && nodeForPanel(currentLayout.root, panelId)) commit({ ...currentLayout, root: activateInNode(currentLayout.root, panelId) });
    onPanelActivate?.(panelId);
  }, [commit, currentLayout, onPanelActivate]);
  const closePanel = useCallback((panelId: string) => { const next = removePanel(currentLayout.root, panelId); commit({ ...currentLayout, root: next.node, floats: currentLayout.floats.filter((float) => float.panelId !== panelId), autoHide: currentLayout.autoHide?.filter((entry) => entry.panelId !== panelId) }); }, [commit, currentLayout]);
  const autoHidePanel = useCallback((panelId: string, side: AutoHideStripPosition) => { const next = removePanel(currentLayout.root, panelId); commit({ ...currentLayout, root: next.node, autoHide: [...(currentLayout.autoHide ?? []).filter((entry) => entry.panelId !== panelId), { panelId, side }] }); }, [commit, currentLayout]);
  const restoreAutoHide = useCallback((panelId: string) => {
    const entry = currentLayout.autoHide?.find((candidate) => candidate.panelId === panelId);
    if (!entry) return;
    const restored: DockLeafNode = { type: 'leaf', id: `leaf-${panelId}-${Date.now()}`, panelId };
    const root = currentLayout.root
      ? { type: 'split' as const, id: `split-restore-${Date.now()}`, direction: entry.side === 'top' || entry.side === 'bottom' ? 'v' as const : 'h' as const, children: [currentLayout.root, restored], sizes: [75, 25] }
      : restored;
    const next = { ...currentLayout, root, autoHide: currentLayout.autoHide?.filter((candidate) => candidate.panelId !== panelId) };
    commit(next);
  }, [commit, currentLayout]);
  useImperativeHandle(ref, () => ({ getLayout, setLayout, resetLayout, exportLayout: () => JSON.stringify(getLayout(), null, 2), importLayout, activatePanel, autoHidePanel, restoreAutoHide }), [activatePanel, autoHidePanel, getLayout, importLayout, resetLayout, restoreAutoHide, setLayout]);

  useEffect(() => {
    if (!activePeek) return undefined;
    const close = (event: MouseEvent) => { if (rootRef.current && !rootRef.current.contains(event.target as Node)) setActivePeek(null); };
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') setActivePeek(null); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', key); };
  }, [activePeek]);

  const dock = useCallback((panelId: string, targetPanelId: string, zone: DropZone) => {
    const panel = panels.get(panelId);
    const allowed = panel?.props.allowedDockZones;
    if (allowed?.length === 0 || (allowed && !allowed.includes(zone))) return;
    commit(dockPanel(currentLayout, panelId, targetPanelId, zone));
  }, [commit, currentLayout, panels]);
  const resize = useCallback((splitId: string, index: number, delta: number) => commit({ ...currentLayout, root: currentLayout.root ? updateSplitSizes(currentLayout.root, splitId, index, delta) : null }), [commit, currentLayout]);
  const moveFloat = useCallback((panelId: string, event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button, input, textarea, select')) return;
    const float = currentLayout.floats.find((candidate) => candidate.panelId === panelId);
    if (!float) return;
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    let nextLayout = cloneLayout(currentLayout);
    const move = (moveEvent: PointerEvent) => {
      nextLayout = { ...nextLayout, floats: nextLayout.floats.map((candidate) => candidate.panelId === panelId ? { ...candidate, x: float.x + moveEvent.clientX - startX, y: float.y + moveEvent.clientY - startY } : candidate) };
      setCurrentLayout(nextLayout);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      commit(nextLayout);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }, [commit, currentLayout]);
  const autoHideBySide = (side: AutoHideStripPosition): AutoHideStripTab[] => (currentLayout.autoHide ?? []).filter((entry) => entry.side === side).map((entry) => { const panel = panels.get(entry.panelId); return { id: entry.panelId, label: panel?.props.title ?? entry.panelId }; });
  const activeAutoHidePanel = activePeek ? panels.get(activePeek) : undefined;
  const activeAutoHideEntry = activePeek ? currentLayout.autoHide?.find((entry) => entry.panelId === activePeek) : undefined;

  return (
    <div {...props} ref={rootRef} dir={direction} className={['sp-dock-manager', thinSplitters ? 'sp-dock-manager--thin-splitters' : '', dense ? 'sp-dock-manager--dense' : '', className].filter(Boolean).join(' ')} role="region" aria-label={t('layoutManager')}>
      <AutoHideStrip position="left" tabs={autoHideBySide('left')} activeTabId={activePeek} onTabClick={setActivePeek} />
      <AutoHideStrip position="right" tabs={autoHideBySide('right')} activeTabId={activePeek} onTabClick={setActivePeek} />
      <AutoHideStrip position="top" tabs={autoHideBySide('top')} activeTabId={activePeek} onTabClick={setActivePeek} />
      <AutoHideStrip position="bottom" tabs={autoHideBySide('bottom')} activeTabId={activePeek} onTabClick={setActivePeek} />
      <div className="sp-dock-manager__surface">{currentLayout.root && <NodeView node={currentLayout.root} panels={panels} tabsAtBottom={tabsAtBottom} onActivate={activatePanel} onClose={closePanel} onDock={dock} onResize={resize} />}</div>
      {currentLayout.floats.map((float) => <div key={float.panelId} className="sp-dock-float" style={{ left: float.x, top: float.y, width: float.width, height: float.height }}><PanelView panelId={float.panelId} panels={panels} onActivate={activatePanel} onClose={closePanel} onDock={dock} onFloatPointerDown={moveFloat} /></div>)}
      {activeAutoHidePanel && <div className={['sp-dock-peek', activeAutoHideEntry ? `sp-dock-peek--${activeAutoHideEntry.side}` : ''].filter(Boolean).join(' ')} data-peek-panel={activePeek}><PanelView panelId={activePeek ?? ''} panels={panels} onActivate={activatePanel} onClose={closePanel} onDock={dock} /><Button variant="ghost" size="sm" iconOnly aria-label={t('closePeek')} onClick={() => setActivePeek(null)}>×</Button></div>}
    </div>
  );
});

DockManager.displayName = 'DockManager';
