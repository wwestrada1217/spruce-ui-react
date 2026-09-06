/* eslint-disable react-refresh/only-export-components */
import './DockManager.css';
import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
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
import { Splitter, SplitterPane } from '../splitter/Splitter.js';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';

export type DockSplitDirection = 'h' | 'v';
export type DropZone = 'top' | 'right' | 'bottom' | 'left' | 'center';
export type AutoHideStripPosition = 'left' | 'right' | 'top' | 'bottom';

export interface DockLeafNode { type: 'leaf'; id: string; panelId: string }
export interface DockTabNode { type: 'tab'; id: string; panelIds: string[]; activeIndex: number }
export interface DockDocumentNode { type: 'document'; id: string; panelIds: string[]; activeIndex: number }
export interface DockSplitNode { type: 'split'; id: string; direction: DockSplitDirection; children: DockNode[]; sizes: number[] }
export type DockNode = DockLeafNode | DockTabNode | DockDocumentNode | DockSplitNode;

export interface DockFloat {
  /** Representative panel id. For a group float this is the active panel. */
  panelId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tabPanelIds?: string[];
  activeIndex?: number;
  /** Preserve document-well identity when a document is floated and re-docked. */
  document?: boolean;
}

export interface DockAutoHide {
  panelId: string;
  side: AutoHideStripPosition;
  /** The neighbour and zone used when the panel is restored. */
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

export interface DockCornerSplitRef {
  splitId: string;
  index: number;
  direction: DockSplitDirection;
  startSizes: number[];
  totalPx: number;
  handleEl?: HTMLElement;
}

export interface DockCornerJunction {
  id: string;
  x: number;
  y: number;
  cursor: 'nwse-resize' | 'nesw-resize';
  verticalSplits: DockCornerSplitRef[];
  horizontalSplits: DockCornerSplitRef[];
}

/** Calculate two-pane redistribution while preserving the original split total. */
export function calculateSplitResize(
  startSizes: number[],
  index: number,
  deltaPx: number,
  totalPx: number,
  minSize = 5,
): number[] {
  if (startSizes.length < 2 || index < 0 || index >= startSizes.length - 1 || totalPx <= 0) {
    return [...startSizes];
  }
  const sizes = [...startSizes];
  const combined = sizes[index] + sizes[index + 1];
  let first = sizes[index] + (deltaPx / totalPx) * 100;
  let second = sizes[index + 1] - (deltaPx / totalPx) * 100;
  if (first < minSize) {
    first = minSize;
    second = combined - minSize;
  } else if (second < minSize) {
    second = minSize;
    first = combined - minSize;
  }
  sizes[index] = first;
  sizes[index + 1] = second;
  const total = sizes.reduce((sum, size) => sum + size, 0);
  return total > 0 ? sizes.map((size) => (size / total) * 100) : sizes;
}

/** Find T-junctions and four-way intersections between nested splitters. */
export function findSplitIntersections(rootEl: HTMLElement | null | undefined, rootNode: DockNode | null | undefined): DockCornerJunction[] {
  if (!rootEl || !rootNode) return [];
  const handles = Array.from(rootEl.querySelectorAll<HTMLElement>('.sp-splitter__gutter'));
  if (handles.length < 2) return [];
  const rootRect = rootEl.getBoundingClientRect();
  if (rootRect.width === 0 && rootRect.height === 0 && handles[0].offsetWidth === 0) return [];

  type HandleMeta = {
    el: HTMLElement;
    splitId: string;
    direction: DockSplitDirection;
    index: number;
    cx: number;
    cy: number;
    xStart: number;
    xEnd: number;
    yStart: number;
    yEnd: number;
    totalPx: number;
  };
  const vertical: HandleMeta[] = [];
  const horizontal: HandleMeta[] = [];
  for (const el of handles) {
    const splitId = el.dataset.splitId;
    const direction = el.dataset.splitDir as DockSplitDirection | undefined;
    const index = Number(el.dataset.handleIndex);
    if (!splitId || (direction !== 'h' && direction !== 'v') || !Number.isInteger(index)) continue;
    const rect = el.getBoundingClientRect();
    const container = el.closest<HTMLElement>('.sp-dock-split');
    const totalPx = direction === 'h' ? container?.offsetWidth || rect.width || 1 : container?.offsetHeight || rect.height || 1;
    const meta: HandleMeta = {
      el,
      splitId,
      direction,
      index,
      cx: rect.left - rootRect.left + rect.width / 2,
      cy: rect.top - rootRect.top + rect.height / 2,
      xStart: rect.left - rootRect.left,
      xEnd: rect.right - rootRect.left,
      yStart: rect.top - rootRect.top,
      yEnd: rect.bottom - rootRect.top,
      totalPx,
    };
    if (direction === 'h') vertical.push(meta);
    else horizontal.push(meta);
  }
  if (vertical.length === 0 || horizontal.length === 0) return [];

  const hits: Array<{ vertical: HandleMeta; horizontal: HandleMeta; x: number; y: number }> = [];
  for (const v of vertical) {
    for (const h of horizontal) {
      if (v.cx >= h.xStart - 8 && v.cx <= h.xEnd + 8 && h.cy >= v.yStart - 8 && h.cy <= v.yEnd + 8) {
        hits.push({ vertical: v, horizontal: h, x: v.cx, y: h.cy });
      }
    }
  }
  const clusters: Array<{ x: number; y: number; vertical: Map<string, HandleMeta>; horizontal: Map<string, HandleMeta> }> = [];
  for (const hit of hits) {
    let cluster = clusters.find((candidate) => Math.hypot(candidate.x - hit.x, candidate.y - hit.y) <= 12);
    if (!cluster) {
      cluster = { x: hit.x, y: hit.y, vertical: new Map(), horizontal: new Map() };
      clusters.push(cluster);
    }
    cluster.vertical.set(`${hit.vertical.splitId}:${hit.vertical.index}`, hit.vertical);
    cluster.horizontal.set(`${hit.horizontal.splitId}:${hit.horizontal.index}`, hit.horizontal);
  }
  return clusters.map((cluster, index) => {
    const verticalSplits = [...cluster.vertical.values()].map((handle) => {
      const node = findNode(rootNode, handle.splitId);
      return {
        splitId: handle.splitId,
        index: handle.index,
        direction: 'h' as const,
        startSizes: node?.type === 'split' ? [...node.sizes] : [],
        totalPx: handle.totalPx,
        handleEl: handle.el,
      };
    });
    const horizontalSplits = [...cluster.horizontal.values()].map((handle) => {
      const node = findNode(rootNode, handle.splitId);
      return {
        splitId: handle.splitId,
        index: handle.index,
        direction: 'v' as const,
        startSizes: node?.type === 'split' ? [...node.sizes] : [],
        totalPx: handle.totalPx,
        handleEl: handle.el,
      };
    });
    const horizontalCenter = horizontalSplits.length > 0
      ? [...cluster.horizontal.values()].reduce((sum, handle) => sum + (handle.xStart + handle.xEnd) / 2, 0) / horizontalSplits.length
      : cluster.x;
    return {
      id: `corner-${index}-${verticalSplits.map((split) => split.splitId).join('_')}-${horizontalSplits.map((split) => split.splitId).join('_')}`,
      x: Math.round(cluster.x),
      y: Math.round(cluster.y),
      cursor: horizontalCenter > cluster.x + 8 ? 'nesw-resize' as const : 'nwse-resize' as const,
      verticalSplits,
      horizontalSplits,
    };
  });
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
  const { onPointerDown, onDragStart, ...rest } = props;
  return <div {...rest} className={['sp-dock-panel-tools', className].filter(Boolean).join(' ')} onPointerDown={(event) => { event.stopPropagation(); onPointerDown?.(event); }} onDragStart={(event) => { event.stopPropagation(); onDragStart?.(event); }}>{children}</div>;
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
  if (tabs.length === 0) return null;
  const vertical = position === 'left' || position === 'right';
  return (
    <div {...props} className={['sp-auto-hide-strip', `sp-auto-hide-strip--${position}`, className].filter(Boolean).join(' ')} role="tablist" aria-orientation={vertical ? 'vertical' : 'horizontal'} aria-label={label ?? `${t('autoHidePanel')} (${position})`}>
      {tabs.map((tab) => (
        <button key={tab.id} type="button" role="tab" aria-selected={activeTabId === tab.id} aria-label={tab.title ?? tab.label} title={tab.title ?? tab.label} className="sp-auto-hide-strip__tab" onClick={() => onTabClick?.(tab.id)}>
          {tab.icon && <Icon name={tab.icon} size={13} className="sp-auto-hide-strip__icon" />}
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
  closePanel: (panelId: string) => void;
  floatPanel: (panelId: string, x?: number, y?: number) => void;
  floatGroup: (tabNodeId: string, x?: number, y?: number) => void;
  dockFloat: (floatKey: string) => void;
  selectTab: (tabNodeId: string, index: number) => void;
  closeTab: (tabNodeId: string, panelId: string) => void;
  updateFloat: (panelId: string, patch: Partial<DockFloat>) => void;
  refreshCorners: () => void;
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
  content: ReactNode[];
  tools: ReactNode[];
}

type DragSource = { kind: 'panel'; panelId: string } | { kind: 'group'; tabNodeId: string };
const DOCK_DRAG_MIME = 'application/x-spruce-dock';

let generatedId = 0;
function genId(prefix = 'dock') {
  generatedId += 1;
  return `${prefix}-${generatedId}`;
}

function cloneLayout(layout: DockLayout): DockLayout {
  return JSON.parse(JSON.stringify(layout)) as DockLayout;
}

function normalizeSizes(sizes: number[]): number[] {
  const total = sizes.reduce((sum, size) => sum + size, 0);
  return total > 0 ? sizes.map((size) => (size / total) * 100) : sizes.map(() => 100 / Math.max(1, sizes.length));
}

function buildDefaultLayout(panelIds: string[]): DockLayout {
  if (panelIds.length === 0) return { root: null, floats: [], autoHide: [], autoHideHints: {} };
  if (panelIds.length === 1) return { root: { type: 'leaf', id: genId('leaf'), panelId: panelIds[0] }, floats: [], autoHide: [], autoHideHints: {} };
  const children = panelIds.map((panelId) => ({ type: 'leaf' as const, id: genId('leaf'), panelId }));
  return { root: { type: 'split', id: genId('split'), direction: 'h', children, sizes: children.map(() => 100 / children.length) }, floats: [], autoHide: [], autoHideHints: {} };
}

function findNode(node: DockNode | null, id: string): DockNode | null {
  if (!node) return null;
  if (node.id === id) return node;
  if (node.type === 'split') {
    for (const child of node.children) {
      const result = findNode(child, id);
      if (result) return result;
    }
  }
  return null;
}

function collectPanelIds(node: DockNode): string[] {
  if (node.type === 'leaf') return [node.panelId];
  if (node.type === 'tab' || node.type === 'document') return [...node.panelIds];
  return node.children.flatMap(collectPanelIds);
}

function firstPanelId(node: DockNode): string | null {
  return collectPanelIds(node)[0] ?? null;
}

function findContainingNodeId(node: DockNode, panelId: string): string | null {
  if (node.type === 'leaf') return node.panelId === panelId ? node.id : null;
  if ((node.type === 'tab' || node.type === 'document') && node.panelIds.includes(panelId)) return node.id;
  if (node.type === 'split') {
    for (const child of node.children) {
      const result = findContainingNodeId(child, panelId);
      if (result) return result;
    }
  }
  return null;
}

function removeNode(node: DockNode, nodeId: string): DockNode | null {
  if (node.id === nodeId) return null;
  if (node.type !== 'split') return node;
  const children: DockNode[] = [];
  const sizes: number[] = [];
  node.children.forEach((child, index) => {
    const next = removeNode(child, nodeId);
    if (next) {
      children.push(next);
      sizes.push(node.sizes[index] ?? 100 / node.children.length);
    }
  });
  if (children.length === 0) return null;
  if (children.length === 1) return children[0];
  return { ...node, children, sizes: normalizeSizes(sizes) };
}

function removePanel(node: DockNode | null, panelId: string): DockNode | null {
  if (!node) return null;
  if (node.type === 'leaf') return node.panelId === panelId ? null : node;
  if (node.type === 'tab' || node.type === 'document') {
    if (!node.panelIds.includes(panelId)) return node;
    const panelIds = node.panelIds.filter((id) => id !== panelId);
    if (panelIds.length === 0) return node.type === 'document' ? { ...node, panelIds: [], activeIndex: 0 } : null;
    if (panelIds.length === 1 && node.type === 'tab') return { type: 'leaf', id: node.id, panelId: panelIds[0] };
    return { ...node, panelIds, activeIndex: Math.min(node.activeIndex, panelIds.length - 1) };
  }
  const children: DockNode[] = [];
  const sizes: number[] = [];
  node.children.forEach((child, index) => {
    const next = removePanel(child, panelId);
    if (next) {
      children.push(next);
      sizes.push(node.sizes[index] ?? 100 / node.children.length);
    }
  });
  if (children.length === 0) return null;
  if (children.length === 1) return children[0];
  return { ...node, children, sizes: normalizeSizes(sizes) };
}

function pruneEmptyDocuments(node: DockNode | null): DockNode | null {
  if (!node || node.type !== 'split') return node;
  let emptyCount = 0;
  let nonEmptyCount = 0;
  const scan = (candidate: DockNode) => {
    if (candidate.type === 'document') {
      if (candidate.panelIds.length === 0) emptyCount += 1;
      else nonEmptyCount += 1;
    } else if (candidate.type === 'split') candidate.children.forEach(scan);
  };
  scan(node);
  if (emptyCount === 0) return node;
  let keptEmpty = false;
  const visit = (candidate: DockNode): DockNode | null => {
    if (candidate.type === 'document') {
      if (candidate.panelIds.length > 0 || (nonEmptyCount === 0 && !keptEmpty)) {
        if (candidate.panelIds.length === 0) keptEmpty = true;
        return candidate;
      }
      return null;
    }
    if (candidate.type !== 'split') return candidate;
    const children: DockNode[] = [];
    const sizes: number[] = [];
    candidate.children.forEach((child, index) => {
      const next = visit(child);
      if (next) {
        children.push(next);
        sizes.push(candidate.sizes[index] ?? 100 / candidate.children.length);
      }
    });
    if (children.length === 0) return null;
    if (children.length === 1) return children[0];
    return { ...candidate, children, sizes: normalizeSizes(sizes) };
  };
  return visit(node);
}

function replaceNode(node: DockNode, id: string, replacement: DockNode): DockNode {
  if (node.id === id) return replacement;
  if (node.type !== 'split') return node;
  return { ...node, children: node.children.map((child) => replaceNode(child, id, replacement)) };
}

function insertAtNode(root: DockNode, targetId: string, panelId: string, zone: DropZone): DockNode {
  const target = findNode(root, targetId);
  if (!target) return root;
  if (zone === 'center') {
    if (target.type === 'tab' || target.type === 'document') return replaceNode(root, targetId, { ...target, panelIds: [...target.panelIds, panelId], activeIndex: target.panelIds.length });
    if (target.type === 'leaf') return replaceNode(root, targetId, { type: 'tab', id: genId('tab'), panelIds: [target.panelId, panelId], activeIndex: 1 });
    return root;
  }
  const newLeaf: DockLeafNode = { type: 'leaf', id: genId('leaf'), panelId };
  const direction: DockSplitDirection = zone === 'left' || zone === 'right' ? 'h' : 'v';
  const before = zone === 'left' || zone === 'top';
  return replaceNode(root, targetId, { type: 'split', id: genId('split'), direction, children: before ? [newLeaf, target] : [target, newLeaf], sizes: [50, 50] });
}

function insertNodeAtNode(root: DockNode, targetId: string, incoming: DockNode, zone: DropZone): DockNode {
  const target = findNode(root, targetId);
  if (!target) return root;
  if (zone === 'center') {
    const incomingIds = collectPanelIds(incoming);
    if (target.type === 'tab' || target.type === 'document') return replaceNode(root, targetId, { ...target, panelIds: [...target.panelIds, ...incomingIds], activeIndex: target.panelIds.length });
    if (target.type === 'leaf') return replaceNode(root, targetId, { type: 'tab', id: genId('tab'), panelIds: [target.panelId, ...incomingIds], activeIndex: 1 });
    return root;
  }
  const direction: DockSplitDirection = zone === 'left' || zone === 'right' ? 'h' : 'v';
  const before = zone === 'left' || zone === 'top';
  return replaceNode(root, targetId, { type: 'split', id: genId('split'), direction, children: before ? [incoming, target] : [target, incoming], sizes: [50, 50] });
}

function findTabSibling(node: DockNode, panelId: string): string | null {
  if ((node.type === 'tab' || node.type === 'document') && node.panelIds.length > 1 && node.panelIds.includes(panelId)) return node.panelIds.find((id) => id !== panelId) ?? null;
  if (node.type === 'split') {
    for (const child of node.children) {
      const result = findTabSibling(child, panelId);
      if (result) return result;
    }
  }
  return null;
}

function findSplitRef(node: DockNode, panelId: string): { panelId: string; zone: DropZone } | null {
  if (node.type !== 'split') return null;
  const index = node.children.findIndex((child) => collectPanelIds(child).includes(panelId));
  if (index < 0) return null;
  const nested = findSplitRef(node.children[index], panelId);
  if (nested) return nested;
  const siblingIndex = index > 0 ? index - 1 : index + 1 < node.children.length ? index + 1 : -1;
  if (siblingIndex < 0) return null;
  const anchor = firstPanelId(node.children[siblingIndex]);
  if (!anchor) return null;
  return { panelId: anchor, zone: node.direction === 'h' ? (siblingIndex < index ? 'right' : 'left') : siblingIndex < index ? 'bottom' : 'top' };
}

function findPanelLocation(root: DockNode, panelId: string): { panelId: string; zone: DropZone } | undefined {
  const sibling = findTabSibling(root, panelId);
  return sibling ? { panelId: sibling, zone: 'center' } : findSplitRef(root, panelId) ?? undefined;
}

function activateInNode(node: DockNode, panelId: string): DockNode {
  if (node.type === 'tab' || node.type === 'document') {
    const activeIndex = node.panelIds.indexOf(panelId);
    return activeIndex >= 0 ? { ...node, activeIndex } : node;
  }
  if (node.type === 'split') return { ...node, children: node.children.map((child) => activateInNode(child, panelId)) };
  return node;
}

function updateSplitSizes(node: DockNode, id: string, sizes: number[]): DockNode {
  if (node.id === id && node.type === 'split') return { ...node, sizes: normalizeSizes(sizes) };
  if (node.type !== 'split') return node;
  return { ...node, children: node.children.map((child) => updateSplitSizes(child, id, sizes)) };
}

function collectPanels(children: ReactNode): Map<string, PanelRecord> {
  const records = new Map<string, PanelRecord>();
  Children.forEach(children, (child) => {
    if (!isValidElement<DockPanelProps>(child) || child.type !== DockPanel) return;
    const content: ReactNode[] = [];
    const tools: ReactNode[] = [];
    Children.forEach(child.props.children, (nested) => {
      if (isValidElement(nested) && nested.type === DockPanelTools) tools.push(nested);
      else content.push(nested);
    });
    records.set(child.props.panelId, { props: child.props, content, tools });
  });
  return records;
}

function encodeDragSource(source: DragSource): string {
  return `${source.kind}:${source.kind === 'panel' ? source.panelId : source.tabNodeId}`;
}

function decodeDragSource(value: string): DragSource | null {
  const separator = value.indexOf(':');
  if (separator < 0) return null;
  const kind = value.slice(0, separator);
  const id = value.slice(separator + 1);
  if (!id) return null;
  return kind === 'panel' ? { kind, panelId: id } : kind === 'group' ? { kind, tabNodeId: id } : null;
}

function panelCanMove(panel: PanelRecord | undefined): boolean {
  return panel?.props.allowedDockZones?.length !== 0;
}

function panelCanDock(panel: PanelRecord | undefined, zone: DropZone): boolean {
  const allowed = panel?.props.allowedDockZones;
  return allowed === undefined || allowed === null || allowed.includes(zone);
}

function canPanelIdsDock(panelIds: string[], zone: DropZone, panels: Map<string, PanelRecord>): boolean {
  return panelIds.length > 0 && panelIds.every((panelId) => panelCanDock(panels.get(panelId), zone));
}

interface DropZonesProps {
  nodeId: string;
  source: DragSource | null;
  zones: readonly DropZone[];
  activeZone: { nodeId: string; zone: DropZone } | null;
  canDrop: (nodeId: string, zone: DropZone) => boolean;
  onDragOver: (event: DragEvent<HTMLDivElement>, nodeId: string, zone: DropZone) => void;
  onDrop: (event: DragEvent<HTMLDivElement>, nodeId: string, zone: DropZone) => void;
  onDragLeave: () => void;
}

function DropZones({ nodeId, source, zones, activeZone, canDrop, onDragOver, onDrop, onDragLeave }: DropZonesProps) {
  if (!source) return null;
  return <div className="sp-dock-drop-zones" aria-hidden="true">{zones.filter((zone) => canDrop(nodeId, zone)).map((zone) => <div key={zone} className={['sp-dock-drop-zone', `sp-dock-drop-zone--${zone}`, activeZone?.nodeId === nodeId && activeZone.zone === zone ? 'sp-dock-drop-zone--active' : ''].filter(Boolean).join(' ')} data-dock-node={nodeId} data-dock-zone={zone} onDragOver={(event) => onDragOver(event, nodeId, zone)} onDragLeave={onDragLeave} onDrop={(event) => onDrop(event, nodeId, zone)} />)}</div>;
}

interface PanelContentProps { panelId: string; panel: PanelRecord; active?: boolean }
function PanelContent({ panelId, panel, active = true }: PanelContentProps) {
  return <div className="sp-dock-panel-view__content" data-panel-content={panelId} hidden={!active}>{panel.content}</div>;
}

interface ActionProps {
  panel: PanelRecord;
  onClose: (panelId: string) => void;
  onAutoHide: (panelId: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  onFloat: (panelId: string) => void;
  onRestore?: (panelId: string) => void;
  showFloat?: boolean;
  showAutoHide?: boolean;
}

function PanelActions({ panel, onClose, onAutoHide, onFloat, onRestore, showFloat = true, showAutoHide = true }: ActionProps) {
  const { t } = useI18n();
  const { props } = panel;
  return <span className="sp-dock-panel-view__actions">
    {showAutoHide && props.allowedDockZones?.length !== 0 && <Button variant="ghost" size="sm" iconOnly iconLeft="pin" aria-label={`${t('autoHidePanel')} ${props.title}`} title={t('autoHidePanel')} onClick={(event) => onAutoHide(props.panelId, event)} />}
    {showFloat && props.allowedDockZones?.length !== 0 && <Button variant="ghost" size="sm" iconOnly iconLeft="app-window" aria-label={`${t('floatPanel')} ${props.title}`} title={t('floatPanel')} onClick={() => onFloat(props.panelId)} />}
    {onRestore && <Button variant="ghost" size="sm" iconOnly iconLeft="pin" aria-label={t('pinToDock')} title={t('pinToDock')} onClick={() => onRestore(props.panelId)} />}
    {props.closeable !== false && <Button variant="ghost" size="sm" iconOnly iconLeft="x" aria-label={`${t('closePanel')} ${props.title}`} title={t('closePanel')} className="sp-dock-panel-view__close" onClick={() => onClose(props.panelId)} />}
  </span>;
}

interface PanelViewProps {
  panelId: string;
  panels: Map<string, PanelRecord>;
  nodeId?: string;
  active?: boolean;
  source: DragSource | null;
  activeZone: { nodeId: string; zone: DropZone } | null;
  canDrop: (nodeId: string, zone: DropZone) => boolean;
  onDragOver: (event: DragEvent<HTMLDivElement>, nodeId: string, zone: DropZone) => void;
  onDrop: (event: DragEvent<HTMLDivElement>, nodeId: string, zone: DropZone) => void;
  onDragLeave: () => void;
  onPanelDragStart: (event: DragEvent<HTMLElement>, panelId: string) => void;
  onDragEnd: () => void;
  onActivate: (panelId: string) => void;
  onClose: (panelId: string) => void;
  onAutoHide: (panelId: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  onFloat: (panelId: string) => void;
  onRestore?: (panelId: string) => void;
}

function PanelView({ panelId, panels, nodeId = `panel-${panelId}`, active = true, source, activeZone, canDrop, onDragOver, onDrop, onDragLeave, onPanelDragStart, onDragEnd, onActivate, onClose, onAutoHide, onFloat, onRestore }: PanelViewProps) {
  const panel = panels.get(panelId);
  if (!panel) return null;
  const { props } = panel;
  const draggable = panelCanMove(panel);
  return <section className="sp-dock-panel-view" data-panel-id={panelId} onDragOver={(event) => { if (event.target === event.currentTarget) onDragOver(event as DragEvent<HTMLDivElement>, nodeId, 'center'); }}>
    {props.showHeader !== false && <header className="sp-dock-panel-view__header" draggable={draggable} onDragStart={(event) => onPanelDragStart(event, panelId)} onDragEnd={onDragEnd}>
      <span className="sp-dock-panel-view__drag-handle" aria-hidden="true"><Icon name="grip-vertical" size={14} /></span>
      {props.icon && <Icon name={props.icon} size={14} className="sp-dock-panel-view__icon" />}
      <button type="button" className="sp-dock-panel-view__title" onClick={() => onActivate(panelId)}><span>{props.title}</span>{props.badge !== null && props.badge !== undefined && props.badge !== '' && props.badge !== 0 && <span className="sp-dock-panel-view__badge">{props.badge}</span>}</button>
      {panel.tools.length > 0 && <span className="sp-dock-panel-view__tools">{panel.tools}</span>}
      <PanelActions panel={panel} onClose={onClose} onAutoHide={onAutoHide} onFloat={onFloat} onRestore={onRestore} />
    </header>}
    <PanelContent panelId={panelId} panel={panel} active={active} />
    <DropZones nodeId={nodeId} source={source} zones={['top', 'right', 'bottom', 'left', 'center']} activeZone={activeZone} canDrop={canDrop} onDragOver={onDragOver} onDrop={onDrop} onDragLeave={onDragLeave} />
  </section>;
}

function PeekView({ panel, onRestore, onClose }: { panel: PanelRecord; onRestore: (panelId: string) => void; onClose: () => void }) {
  const { t } = useI18n();
  return <div className="sp-dock-peek__body" role="dialog" aria-label={panel.props.title} onMouseDown={(event) => event.stopPropagation()}>
    <div className="sp-dock-peek__header">
      {panel.props.icon && <Icon name={panel.props.icon} size={14} />}
      <span className="sp-dock-peek__title">{panel.props.title}</span>
      {panel.tools.length > 0 && <span className="sp-dock-peek__tools">{panel.tools}</span>}
      <span className="sp-dock-peek__actions">
        <Button variant="ghost" size="sm" iconOnly iconLeft="pin" aria-label={`${t('pinToDock')} ${panel.props.title}`} title={t('pinToDock')} onClick={() => onRestore(panel.props.panelId)} />
        <Button variant="ghost" size="sm" iconOnly iconLeft="x" aria-label={t('closePeek')} title={t('closePeek')} onClick={onClose} />
      </span>
    </div>
    <div className="sp-dock-peek__content"><PanelContent panelId={panel.props.panelId} panel={panel} /></div>
  </div>;
}

interface NodeViewProps {
  node: DockNode;
  panels: Map<string, PanelRecord>;
  tabsAtBottom: boolean;
  source: DragSource | null;
  activeZone: { nodeId: string; zone: DropZone } | null;
  canDrop: (nodeId: string, zone: DropZone) => boolean;
  onDragOver: (event: DragEvent<HTMLDivElement>, nodeId: string, zone: DropZone) => void;
  onDrop: (event: DragEvent<HTMLDivElement>, nodeId: string, zone: DropZone) => void;
  onDragLeave: () => void;
  onPanelDragStart: (event: DragEvent<HTMLElement>, panelId: string) => void;
  onGroupDragStart: (event: DragEvent<HTMLElement>, node: DockTabNode | DockDocumentNode) => void;
  onDragEnd: () => void;
  onActivate: (panelId: string) => void;
  onSelectTab: (nodeId: string, index: number) => void;
  onReorderTab: (nodeId: string, panelId: string, beforeIndex: number) => void;
  onClose: (panelId: string) => void;
  onAutoHide: (panelId: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  onFloat: (panelId: string) => void;
  onFloatGroup: (nodeId: string) => void;
  thinSplitters: boolean;
  onResize: (splitId: string, sizes: number[]) => void;
  onResizeEnd: () => void;
  onRestore?: (panelId: string) => void;
}

function GroupActions({ activePanel, onClose, onAutoHide, onFloat, onFloatGroup, onRestore, canFloatGroup }: { activePanel: PanelRecord | undefined; onClose: (panelId: string) => void; onAutoHide: (panelId: string, event: React.MouseEvent<HTMLButtonElement>) => void; onFloat: (panelId: string) => void; onFloatGroup: () => void; onRestore?: (panelId: string) => void; canFloatGroup: boolean }) {
  if (!activePanel) return null;
  return <span className="sp-dock-panel-view__actions"><PanelActions panel={activePanel} onClose={onClose} onAutoHide={onAutoHide} onFloat={onFloat} onRestore={onRestore} showFloat={false} />{canFloatGroup && <Button variant="ghost" size="sm" iconOnly iconLeft="app-window" aria-label="Float tab group" title="Float tab group" onClick={onFloatGroup} />}</span>;
}

function NodeView({ node, panels, tabsAtBottom, source, activeZone, canDrop, onDragOver, onDrop, onDragLeave, onPanelDragStart, onGroupDragStart, onDragEnd, onActivate, onSelectTab, onReorderTab, onClose, onAutoHide, onFloat, onFloatGroup, thinSplitters, onResize, onResizeEnd, onRestore }: NodeViewProps) {
  if (node.type === 'leaf') return <PanelView panelId={node.panelId} nodeId={node.id} panels={panels} source={source} activeZone={activeZone} canDrop={canDrop} onDragOver={onDragOver} onDrop={onDrop} onDragLeave={onDragLeave} onPanelDragStart={onPanelDragStart} onDragEnd={onDragEnd} onActivate={onActivate} onClose={onClose} onAutoHide={onAutoHide} onFloat={onFloat} onRestore={onRestore} />;
  if (node.type === 'tab' || node.type === 'document') {
    const activeId = node.panelIds[node.activeIndex] ?? node.panelIds[0];
    const activePanel = activeId ? panels.get(activeId) : undefined;
    const canGroupMove = node.panelIds.length > 0 && node.panelIds.every((panelId) => panelCanMove(panels.get(panelId)));
    const tabs = <div className={['sp-dock-stack__tabs', tabsAtBottom ? 'sp-dock-stack__tabs--bottom' : ''].filter(Boolean).join(' ')} role="tablist" aria-label={node.type === 'document' ? 'Documents' : 'Panels'} onDragOver={(event) => { if (event.target === event.currentTarget && source?.kind === 'panel') event.preventDefault(); }}>
      {node.panelIds.map((panelId, index) => {
        const panel = panels.get(panelId);
        if (!panel) return null;
        return <span className="sp-dock-stack__tab-wrap" key={panelId}>
          <button type="button" role="tab" id={`${node.id}-tab-${panelId}`} aria-selected={activeId === panelId} aria-controls={`${node.id}-panel-${panelId}`} draggable={panelCanMove(panel)} className="sp-dock-stack__tab" onClick={() => onSelectTab(node.id, index)} onDragStart={(event) => onPanelDragStart(event, panelId)} onDragEnd={onDragEnd} onDragOver={(event) => { if (source?.kind !== 'panel' || !panelCanDock(panel, 'center')) return; event.preventDefault(); event.stopPropagation(); const rect = event.currentTarget.getBoundingClientRect(); onReorderTab(node.id, source.panelId, event.clientX > rect.left + rect.width / 2 ? index + 1 : index); }} onDrop={(event) => { event.preventDefault(); event.stopPropagation(); const value = event.dataTransfer.getData(DOCK_DRAG_MIME); const drag = decodeDragSource(value) ?? source; if (drag?.kind === 'panel') onReorderTab(node.id, drag.panelId, index); }}>
            {panel.props.icon && <Icon name={panel.props.icon} size={13} />}<span>{panel.props.title}</span>{panel.props.badge !== null && panel.props.badge !== undefined && panel.props.badge !== '' && panel.props.badge !== 0 && <span className="sp-dock-panel-view__badge">{panel.props.badge}</span>}
          </button>
          {panel.props.closeable !== false && <Button variant="ghost" size="sm" iconOnly iconLeft="x" aria-label={`Close ${panel.props.title}`} title={`Close ${panel.props.title}`} onClick={() => onClose(panelId)} />}
        </span>;
      })}
    </div>;
    const header = <div className={['sp-dock-stack__header', node.panelIds.length > 1 ? 'sp-dock-stack__header--group' : ''].filter(Boolean).join(' ')} draggable={canGroupMove} onDragStart={(event) => onGroupDragStart(event, node)} onDragEnd={onDragEnd}>
      {tabsAtBottom || node.panelIds.length <= 1 ? <><span className="sp-dock-panel-view__drag-handle" aria-hidden="true"><Icon name="grip-vertical" size={14} /></span>{activePanel?.props.icon && <Icon name={activePanel.props.icon} size={14} />}<span className="sp-dock-panel-view__title-text">{activePanel?.props.title ?? 'Documents'}</span>{activePanel && activePanel.tools.length > 0 && <span className="sp-dock-panel-view__tools">{activePanel.tools}</span>}<GroupActions activePanel={activePanel} onClose={onClose} onAutoHide={onAutoHide} onFloat={onFloat} onFloatGroup={() => onFloatGroup(node.id)} onRestore={onRestore} canFloatGroup={canGroupMove && node.panelIds.length > 1} /></> : null}
      {!tabsAtBottom && node.panelIds.length > 1 && <>{tabs}{activePanel && activePanel.tools.length > 0 && <span className="sp-dock-panel-view__tools">{activePanel.tools}</span>}<GroupActions activePanel={activePanel} onClose={onClose} onAutoHide={onAutoHide} onFloat={onFloat} onFloatGroup={() => onFloatGroup(node.id)} onRestore={onRestore} canFloatGroup={canGroupMove} /></>}
    </div>;
    return <section className={['sp-dock-stack', node.type === 'document' ? 'sp-dock-stack--document' : ''].filter(Boolean).join(' ')} data-dock-node={node.id}>
      {tabsAtBottom ? header : node.panelIds.length > 1 ? header : activePanel?.props.showHeader !== false ? header : null}
      {tabsAtBottom && tabs}
      <div className="sp-dock-stack__content">
        {node.type === 'document' && node.panelIds.length === 0 && <div className="sp-dock-document__empty" role="status"><Icon name="layout-dashboard" size={32} /><span>No documents open</span></div>}
        {node.panelIds.map((panelId, index) => { const panel = panels.get(panelId); return panel ? <div key={panelId} id={`${node.id}-panel-${panelId}`} className="sp-dock-stack__panel" role="tabpanel" aria-labelledby={`${node.id}-tab-${panelId}`} hidden={index !== node.activeIndex}><PanelContent panelId={panelId} panel={panel} active={index === node.activeIndex} /></div> : null; })}
      </div>
      <DropZones nodeId={node.id} source={source} zones={['top', 'right', 'bottom', 'left', 'center']} activeZone={activeZone} canDrop={canDrop} onDragOver={onDragOver} onDrop={onDrop} onDragLeave={onDragLeave} />
    </section>;
  }
  return <Splitter
    className={['sp-dock-split', `sp-dock-split--${node.direction}`].join(' ')}
    orientation={node.direction === 'h' ? 'horizontal' : 'vertical'}
    gutterSize={thinSplitters ? 2 : 8}
    sizes={node.sizes}
    thin={thinSplitters}
    keyIncrement={5}
    ariaLabel="Dock split"
    gutterProps={(index) => ({
      'aria-label': 'Resize split',
      'data-split-id': node.id,
      'data-split-dir': node.direction,
      'data-handle-index': index,
    })}
    onSizeChange={(sizes) => onResize(node.id, sizes)}
    onSizeChangeEnd={onResizeEnd}
  >
    {node.children.map((child) => <SplitterPane key={child.id} minSize={5}>
      <NodeView node={child} panels={panels} tabsAtBottom={tabsAtBottom} source={source} activeZone={activeZone} canDrop={canDrop} onDragOver={onDragOver} onDrop={onDrop} onDragLeave={onDragLeave} onPanelDragStart={onPanelDragStart} onGroupDragStart={onGroupDragStart} onDragEnd={onDragEnd} onActivate={onActivate} onSelectTab={onSelectTab} onReorderTab={onReorderTab} onClose={onClose} onAutoHide={onAutoHide} onFloat={onFloat} onFloatGroup={onFloatGroup} thinSplitters={thinSplitters} onResize={onResize} onResizeEnd={onResizeEnd} onRestore={onRestore} />
    </SplitterPane>)}
  </Splitter>;
}

interface FloatViewProps {
  float: DockFloat;
  panels: Map<string, PanelRecord>;
  onBringToFront: (panelId: string) => void;
  onMoveStart: (event: ReactPointerEvent<HTMLDivElement>, float: DockFloat) => void;
  onResizeStart: (event: ReactPointerEvent<HTMLDivElement>, float: DockFloat, direction: string) => void;
  onSelect: (floatKey: string, index: number) => void;
  onClose: (floatKey: string, panelId: string) => void;
  onDock: (floatKey: string) => void;
}

function FloatView({ float, panels, onBringToFront, onMoveStart, onResizeStart, onSelect, onClose, onDock }: FloatViewProps) {
  const { t } = useI18n();
  const ids = float.tabPanelIds?.length ? float.tabPanelIds : [float.panelId];
  const activeIndex = Math.min(float.activeIndex ?? 0, ids.length - 1);
  const activePanel = panels.get(ids[activeIndex]);
  if (!activePanel) return null;
  return <div className="sp-dock-float" style={{ left: float.x, top: float.y, width: float.width, height: float.height }} onPointerDown={() => onBringToFront(float.panelId)}>
    <div className="sp-dock-float__header" onPointerDown={(event) => onMoveStart(event, float)}>
      <span className="sp-dock-float__drag-handle" aria-hidden="true"><Icon name="grip-vertical" size={14} /></span>
      {ids.length > 1 ? <div className="sp-dock-float__tabs" role="tablist">{ids.map((panelId, index) => { const panel = panels.get(panelId); return panel ? <span className="sp-dock-float__tab-wrap" key={panelId}><button type="button" role="tab" aria-selected={index === activeIndex} className="sp-dock-float__tab" onClick={() => onSelect(float.panelId, index)}>{panel.props.icon && <Icon name={panel.props.icon} size={12} />}<span>{panel.props.title}</span></button>{panel.props.closeable !== false && <Button variant="ghost" size="sm" iconOnly iconLeft="x" aria-label={`Close ${panel.props.title}`} onClick={(event) => { event.stopPropagation(); onClose(float.panelId, panelId); }} />}</span> : null; })}</div> : <span className="sp-dock-float__title">{activePanel.props.icon && <Icon name={activePanel.props.icon} size={14} />}{activePanel.props.title}</span>}
      {activePanel.tools.length > 0 && <span className="sp-dock-float__tools">{activePanel.tools}</span>}
      <span className="sp-dock-float__actions"><Button variant="ghost" size="sm" iconOnly iconLeft="minimize" aria-label={`${t('minimize')} ${activePanel.props.title}`} title={t('minimize')} onClick={(event) => { event.stopPropagation(); onDock(float.panelId); }} />{activePanel.props.closeable !== false && <Button variant="ghost" size="sm" iconOnly iconLeft="x" aria-label={`${t('closePanel')} ${activePanel.props.title}`} title={t('closePanel')} onClick={(event) => { event.stopPropagation(); onClose(float.panelId, activePanel.props.panelId); }} />}</span>
    </div>
    <div className="sp-dock-float__content">{ids.map((panelId, index) => { const panel = panels.get(panelId); return panel ? <div key={panelId} className="sp-dock-float__panel" hidden={index !== activeIndex}><PanelContent panelId={panelId} panel={panel} active={index === activeIndex} /></div> : null; })}</div>
    {['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].map((direction) => <div key={direction} className={['sp-dock-float__resize', `sp-dock-float__resize--${direction}`].join(' ')} onPointerDown={(event) => onResizeStart(event, float, direction)} />)}
  </div>;
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
  const [dragSource, setDragSource] = useState<DragSource | null>(null);
  const [activeZone, setActiveZone] = useState<{ nodeId: string; zone: DropZone } | null>(null);
  const [movingFloat, setMovingFloat] = useState<string | null>(null);
  const [zIndexes, setZIndexes] = useState<Record<string, number>>({});
  const [corners, setCorners] = useState<DockCornerJunction[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const currentLayoutRef = useRef(currentLayout);
  const zCounter = useRef(100);

  useEffect(() => {
    currentLayoutRef.current = currentLayout;
  }, [currentLayout]);

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

  const sourcePanelIds = useCallback((source: DragSource | null, layout: DockLayout = currentLayout): string[] => {
    if (!source) return [];
    if (source.kind === 'panel') return [source.panelId];
    const node = findNode(layout.root, source.tabNodeId);
    return node ? collectPanelIds(node) : [];
  }, [currentLayout]);
  const canNodeDrop = useCallback((nodeId: string, zone: DropZone) => {
    const target = findNode(currentLayout.root, nodeId);
    const ids = sourcePanelIds(dragSource);
    if (!target || ids.length === 0 || ids.some((panelId) => collectPanelIds(target).includes(panelId))) return false;
    if (!canPanelIdsDock(ids, zone, panels)) return false;
    return collectPanelIds(target).every((panelId) => panelCanMove(panels.get(panelId)));
  }, [currentLayout.root, dragSource, panels, sourcePanelIds]);

  const resetLayout = useCallback(() => commit(buildDefaultLayout([...panels.keys()])), [commit, panels]);
  const getLayout = useCallback(() => cloneLayout(currentLayout), [currentLayout]);
  const setLayout = useCallback((next: DockLayout) => commit(next), [commit]);
  const importLayout = useCallback((value: string) => {
    try {
      const next = JSON.parse(value) as DockLayout;
      if (!next || typeof next !== 'object' || !('root' in next) || !Array.isArray(next.floats)) return false;
      commit(next);
      return true;
    } catch { return false; }
  }, [commit]);

  const removePanelFromLayout = useCallback((layout: DockLayout, panelId: string): DockLayout => {
    const floats = layout.floats.flatMap((float) => {
      const ids = float.tabPanelIds?.filter((id) => id !== panelId);
      if (float.tabPanelIds && ids && ids.length === 0) return [];
      if (float.tabPanelIds && ids && ids.length === 1) return [{ ...float, panelId: ids[0], tabPanelIds: undefined, activeIndex: undefined }];
      if (float.tabPanelIds && ids) return [{ ...float, panelId: ids.includes(float.panelId) ? float.panelId : ids[0], tabPanelIds: ids, activeIndex: Math.min(float.activeIndex ?? 0, ids.length - 1) }];
      return float.panelId === panelId ? [] : [float];
    });
    return { ...layout, root: pruneEmptyDocuments(removePanel(layout.root, panelId)), floats, autoHide: layout.autoHide?.filter((entry) => entry.panelId !== panelId) };
  }, []);

  const closePanel = useCallback((panelId: string) => commit(removePanelFromLayout(currentLayout, panelId)), [commit, currentLayout, removePanelFromLayout]);
  const restoreAutoHide = useCallback((panelId: string) => {
    const entry = currentLayout.autoHide?.find((candidate) => candidate.panelId === panelId);
    if (!entry) return;
    const anchorId = entry.ref && currentLayout.root ? findContainingNodeId(currentLayout.root, entry.ref.panelId) : null;
    const leaf: DockLeafNode = { type: 'leaf', id: genId('leaf'), panelId };
    const root = anchorId && currentLayout.root ? insertAtNode(currentLayout.root, anchorId, panelId, entry.ref!.zone) : currentLayout.root ? { type: 'split' as const, id: genId('split'), direction: entry.side === 'left' || entry.side === 'right' ? 'h' as const : 'v' as const, children: entry.side === 'left' || entry.side === 'top' ? [leaf, currentLayout.root] : [currentLayout.root, leaf], sizes: entry.side === 'left' || entry.side === 'top' ? [25, 75] : [75, 25] } : leaf;
    commit({ ...currentLayout, root, autoHide: currentLayout.autoHide?.filter((candidate) => candidate.panelId !== panelId) });
    setActivePeek(null);
  }, [commit, currentLayout]);

  const activatePanel = useCallback((panelId: string) => {
    if (currentLayout.autoHide?.some((entry) => entry.panelId === panelId)) restoreAutoHide(panelId);
    else if (currentLayout.root) commit({ ...currentLayout, root: activateInNode(currentLayout.root, panelId) });
    setActivePeek(null);
    onPanelActivate?.(panelId);
  }, [commit, currentLayout, onPanelActivate, restoreAutoHide]);

  const autoHidePanel = useCallback((panelId: string, side: AutoHideStripPosition) => {
    const ref = currentLayout.root ? findPanelLocation(currentLayout.root, panelId) : undefined;
    const next = removePanelFromLayout(currentLayout, panelId);
    commit({ ...next, autoHide: [...(next.autoHide ?? []).filter((entry) => entry.panelId !== panelId), { panelId, side, ref }], autoHideHints: { ...(next.autoHideHints ?? {}), [panelId]: side } });
    setActivePeek(null);
  }, [commit, currentLayout, removePanelFromLayout]);

  const autoHideFromElement = useCallback((panelId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const remembered = currentLayout.autoHideHints?.[panelId];
    if (remembered) { autoHidePanel(panelId, remembered); return; }
    const panelElement = event.currentTarget.closest('.sp-dock-panel-view, .sp-dock-stack') as HTMLElement | null;
    const managerElement = rootRef.current;
    if (!panelElement || !managerElement) { autoHidePanel(panelId, 'right'); return; }
    const panelRect = panelElement.getBoundingClientRect();
    const managerRect = managerElement.getBoundingClientRect();
    const widthRatio = managerRect.width > 0 ? panelRect.width / managerRect.width : 0;
    const heightRatio = managerRect.height > 0 ? panelRect.height / managerRect.height : 0;
    const side: AutoHideStripPosition = widthRatio >= heightRatio ? panelRect.top - managerRect.top <= managerRect.bottom - panelRect.bottom ? 'top' : 'bottom' : panelRect.left - managerRect.left <= managerRect.right - panelRect.right ? 'left' : 'right';
    autoHidePanel(panelId, side);
  }, [autoHidePanel, currentLayout.autoHideHints]);

  const floatPanel = useCallback((panelId: string, x = 120, y = 80) => {
    if (!panelCanMove(panels.get(panelId)) || currentLayout.floats.some((float) => float.panelId === panelId || float.tabPanelIds?.includes(panelId))) return;
    const document = currentLayout.root ? findNode(currentLayout.root, findContainingNodeId(currentLayout.root, panelId) ?? '')?.type === 'document' : false;
    const next = removePanelFromLayout(currentLayout, panelId);
    commit({ ...next, floats: [...next.floats, { panelId, x, y, width: 340, height: 260, document: document || undefined }] });
  }, [commit, currentLayout, panels, removePanelFromLayout]);

  const floatGroup = useCallback((tabNodeId: string, x = 120, y = 80) => {
    const node = findNode(currentLayout.root, tabNodeId);
    if (!node || (node.type !== 'tab' && node.type !== 'document') || node.panelIds.length === 0 || !node.panelIds.every((panelId) => panelCanMove(panels.get(panelId)))) return;
    const activeIndex = Math.min(node.activeIndex, node.panelIds.length - 1);
    const root = pruneEmptyDocuments(removeNode(currentLayout.root!, tabNodeId));
    commit({ ...currentLayout, root, floats: [...currentLayout.floats, { panelId: node.panelIds[activeIndex], tabPanelIds: [...node.panelIds], activeIndex, x, y, width: 420, height: 300, document: node.type === 'document' || undefined }] });
  }, [commit, currentLayout, panels]);

  const dockFloat = useCallback((floatKey: string) => {
    const float = currentLayout.floats.find((candidate) => candidate.panelId === floatKey);
    if (!float) return;
    const ids = float.tabPanelIds?.length ? float.tabPanelIds : [float.panelId];
    if (!canPanelIdsDock(ids, 'center', panels)) return;
    const incoming: DockNode = float.document ? { type: 'document', id: genId('document'), panelIds: ids, activeIndex: Math.min(float.activeIndex ?? 0, ids.length - 1) } : ids.length > 1 ? { type: 'tab', id: genId('tab'), panelIds: ids, activeIndex: Math.min(float.activeIndex ?? 0, ids.length - 1) } : { type: 'leaf', id: genId('leaf'), panelId: ids[0] };
    const root = currentLayout.root ? { type: 'split' as const, id: genId('split'), direction: 'h' as const, children: [currentLayout.root, incoming], sizes: [75, 25] } : incoming;
    commit({ ...currentLayout, root: pruneEmptyDocuments(root), floats: currentLayout.floats.filter((candidate) => candidate.panelId !== floatKey) });
  }, [commit, currentLayout, panels]);

  const selectTab = useCallback((nodeId: string, index: number) => {
    if (!currentLayout.root) return;
    const update = (node: DockNode): DockNode => {
      if ((node.type === 'tab' || node.type === 'document') && node.id === nodeId) return { ...node, activeIndex: Math.max(0, Math.min(index, node.panelIds.length - 1)) };
      return node.type === 'split' ? { ...node, children: node.children.map(update) } : node;
    };
    commit({ ...currentLayout, root: update(currentLayout.root) });
  }, [commit, currentLayout]);

  const closeTab = useCallback((nodeId: string, panelId: string) => {
    if (!currentLayout.root) return;
    const close = (node: DockNode): DockNode | null => {
      if (node.id === nodeId && (node.type === 'tab' || node.type === 'document')) return removePanel(node, panelId);
      if (node.type !== 'split') return node;
      const children: DockNode[] = [];
      const sizes: number[] = [];
      node.children.forEach((child, index) => { const next = close(child); if (next) { children.push(next); sizes.push(node.sizes[index] ?? 100 / node.children.length); } });
      if (children.length === 0) return null;
      if (children.length === 1) return children[0];
      return { ...node, children, sizes: normalizeSizes(sizes) };
    };
    commit({ ...currentLayout, root: pruneEmptyDocuments(close(currentLayout.root)) });
  }, [commit, currentLayout]);

  const reorderTab = useCallback((nodeId: string, panelId: string, beforeIndex: number) => {
    if (!currentLayout.root || !panelCanDock(panels.get(panelId), 'center')) return;
    const target = findNode(currentLayout.root, nodeId);
    if (!target || (target.type !== 'tab' && target.type !== 'document')) return;
    if (target.panelIds.includes(panelId)) {
      const ids = [...target.panelIds];
      const from = ids.indexOf(panelId);
      let to = Math.max(0, Math.min(beforeIndex, ids.length));
      if (to === from || to === from + 1) return;
      if (to > from) to -= 1;
      ids.splice(from, 1); ids.splice(to, 0, panelId);
      const update = (node: DockNode): DockNode => node.id === nodeId && (node.type === 'tab' || node.type === 'document') ? { ...node, panelIds: ids, activeIndex: to } : node.type === 'split' ? { ...node, children: node.children.map(update) } : node;
      commit({ ...currentLayout, root: update(currentLayout.root) });
      return;
    }
    const cleaned = removePanel(currentLayout.root, panelId);
    if (!cleaned) return;
    const insert = (node: DockNode): DockNode => {
      if (node.id === nodeId && (node.type === 'tab' || node.type === 'document')) { const ids = [...node.panelIds]; const to = Math.max(0, Math.min(beforeIndex, ids.length)); ids.splice(to, 0, panelId); return { ...node, panelIds: ids, activeIndex: to }; }
      if (node.type === 'split') return { ...node, children: node.children.map(insert) };
      return node;
    };
    commit({ ...currentLayout, root: insert(cleaned), floats: currentLayout.floats.filter((float) => float.panelId !== panelId), autoHide: currentLayout.autoHide?.filter((entry) => entry.panelId !== panelId) });
  }, [commit, currentLayout, panels]);

  const updateFloat = useCallback((panelId: string, patch: Partial<DockFloat>) => commit({ ...currentLayout, floats: currentLayout.floats.map((float) => float.panelId === panelId ? { ...float, ...patch } : float) }), [commit, currentLayout]);
  const closeFloatTab = useCallback((floatKey: string, panelId: string) => {
    const float = currentLayout.floats.find((candidate) => candidate.panelId === floatKey);
    if (!float) return;
    if (!float.tabPanelIds) { closePanel(panelId); return; }
    const ids = float.tabPanelIds.filter((id) => id !== panelId);
    if (ids.length === 0) commit({ ...currentLayout, floats: currentLayout.floats.filter((candidate) => candidate.panelId !== floatKey) });
    else commit({ ...currentLayout, floats: currentLayout.floats.map((candidate) => candidate.panelId === floatKey ? { ...candidate, panelId: ids[Math.min(candidate.activeIndex ?? 0, ids.length - 1)], tabPanelIds: ids.length === 1 ? undefined : ids, activeIndex: ids.length === 1 ? undefined : Math.min(candidate.activeIndex ?? 0, ids.length - 1) } : candidate) });
  }, [closePanel, commit, currentLayout]);

  const startPanelDrag = useCallback((event: DragEvent<HTMLElement>, panelId: string) => {
    if (!panelCanMove(panels.get(panelId))) { event.preventDefault(); return; }
    const source: DragSource = { kind: 'panel', panelId };
    event.dataTransfer.setData(DOCK_DRAG_MIME, encodeDragSource(source));
    event.dataTransfer.setData('text/plain', panelId);
    event.dataTransfer.effectAllowed = 'move';
    setDragSource(source);
  }, [panels]);
  const startGroupDrag = useCallback((event: DragEvent<HTMLElement>, node: DockTabNode | DockDocumentNode) => {
    const target = event.target as Element;
    if (target.closest('button, .sp-dock-panel-view__tools, .sp-dock-panel-view__actions') || !node.panelIds.every((panelId) => panelCanMove(panels.get(panelId)))) return;
    const source: DragSource = { kind: 'group', tabNodeId: node.id };
    event.dataTransfer.setData(DOCK_DRAG_MIME, encodeDragSource(source));
    event.dataTransfer.setData('text/plain', node.panelIds[node.activeIndex] ?? node.panelIds[0]);
    event.dataTransfer.effectAllowed = 'move';
    setDragSource(source);
  }, [panels]);
  const endDrag = useCallback(() => { setDragSource(null); setActiveZone(null); }, []);
  const dragOver = useCallback((event: DragEvent<HTMLDivElement>, nodeId: string, zone: DropZone) => { if (!canNodeDrop(nodeId, zone)) return; event.preventDefault(); event.stopPropagation(); event.dataTransfer.dropEffect = 'move'; setActiveZone({ nodeId, zone }); }, [canNodeDrop]);
  const drop = useCallback((event: DragEvent<HTMLDivElement>, nodeId: string, zone: DropZone) => {
    event.preventDefault(); event.stopPropagation();
    const source = decodeDragSource(event.dataTransfer.getData(DOCK_DRAG_MIME)) ?? dragSource;
    if (!source || !canNodeDrop(nodeId, zone)) { endDrag(); return; }
    if (source.kind === 'group') {
      const group = findNode(currentLayout.root, source.tabNodeId);
      if (group && (group.type === 'tab' || group.type === 'document') && currentLayout.root) {
        const rootWithout = pruneEmptyDocuments(removeNode(currentLayout.root, source.tabNodeId));
        const root = rootWithout ? insertNodeAtNode(rootWithout, nodeId, group, zone) : group;
        commit({ ...currentLayout, root });
      }
    } else {
      const rootWithout = removePanel(currentLayout.root, source.panelId);
      const root = rootWithout ? insertAtNode(rootWithout, nodeId, source.panelId, zone) : { type: 'leaf' as const, id: genId('leaf'), panelId: source.panelId };
      commit({ ...removePanelFromLayout(currentLayout, source.panelId), root });
    }
    endDrag();
  }, [canNodeDrop, commit, currentLayout, dragSource, endDrag, removePanelFromLayout]);

  const bringToFront = useCallback((panelId: string) => { zCounter.current += 1; setZIndexes((previous) => ({ ...previous, [panelId]: zCounter.current })); }, []);
  const moveFloatStart = useCallback((event: ReactPointerEvent<HTMLDivElement>, float: DockFloat) => {
    if (event.button !== 0 || (event.target as Element).closest('button, input, textarea, select, .sp-dock-panel-tools')) return;
    event.preventDefault();
    const startX = event.clientX; const startY = event.clientY; const originalX = float.x; const originalY = float.y;
    let latest = float; setMovingFloat(float.panelId);
    const move = (moveEvent: PointerEvent) => { latest = { ...latest, x: originalX + moveEvent.clientX - startX, y: originalY + moveEvent.clientY - startY }; setCurrentLayout((previous) => ({ ...previous, floats: previous.floats.map((candidate) => candidate.panelId === float.panelId ? latest : candidate) })); };
    const up = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); setMovingFloat(null);
      const element = typeof document.elementFromPoint === 'function' ? document.elementFromPoint(upEvent.clientX, upEvent.clientY) as HTMLElement | null : null;
      const target = element?.closest<HTMLElement>('[data-dock-zone]');
      const outer = element?.closest<HTMLElement>('[data-dock-outer]');
      if (target?.dataset.dockNode && target.dataset.dockZone) {
        const zone = target.dataset.dockZone as DropZone; const node = findNode(currentLayout.root, target.dataset.dockNode); const ids = latest.tabPanelIds?.length ? latest.tabPanelIds : [latest.panelId];
        if (node && canPanelIdsDock(ids, zone, panels)) { const incoming: DockNode = latest.document ? { type: 'document', id: genId('document'), panelIds: ids, activeIndex: latest.activeIndex ?? 0 } : ids.length > 1 ? { type: 'tab', id: genId('tab'), panelIds: ids, activeIndex: latest.activeIndex ?? 0 } : { type: 'leaf', id: genId('leaf'), panelId: ids[0] }; const root = currentLayout.root ? insertNodeAtNode(currentLayout.root, target.dataset.dockNode, incoming, zone) : incoming; commit({ ...currentLayout, root, floats: currentLayout.floats.filter((candidate) => candidate.panelId !== float.panelId) }); return; }
      }
      if (outer?.dataset.dockOuter) {
        const side = outer.dataset.dockOuter as AutoHideStripPosition; const ids = latest.tabPanelIds?.length ? latest.tabPanelIds : [latest.panelId]; if (canPanelIdsDock(ids, side, panels)) { const incoming: DockNode = latest.document ? { type: 'document', id: genId('document'), panelIds: ids, activeIndex: latest.activeIndex ?? 0 } : ids.length > 1 ? { type: 'tab', id: genId('tab'), panelIds: ids, activeIndex: latest.activeIndex ?? 0 } : { type: 'leaf', id: genId('leaf'), panelId: ids[0] }; const root = currentLayout.root ? { type: 'split' as const, id: genId('split'), direction: side === 'left' || side === 'right' ? 'h' as const : 'v' as const, children: side === 'left' || side === 'top' ? [incoming, currentLayout.root] : [currentLayout.root, incoming], sizes: side === 'left' || side === 'top' ? [25, 75] : [75, 25] } : incoming; commit({ ...currentLayout, root, floats: currentLayout.floats.filter((candidate) => candidate.panelId !== float.panelId) }); return; }
      }
      commit({ ...currentLayout, floats: currentLayout.floats.map((candidate) => candidate.panelId === float.panelId ? latest : candidate) });
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  }, [commit, currentLayout, panels]);
  const resizeFloatStart = useCallback((event: ReactPointerEvent<HTMLDivElement>, float: DockFloat, resizeDirection: string) => {
    event.preventDefault(); event.stopPropagation();
    const startX = event.clientX; const startY = event.clientY; const original = { ...float };
    const move = (moveEvent: PointerEvent) => { const dx = moveEvent.clientX - startX; const dy = moveEvent.clientY - startY; const patch: Partial<DockFloat> = { x: original.x, y: original.y, width: Math.max(200, original.width), height: Math.max(140, original.height) }; if (resizeDirection.includes('e')) patch.width = Math.max(200, original.width + dx); if (resizeDirection.includes('s')) patch.height = Math.max(140, original.height + dy); if (resizeDirection.includes('w')) { patch.x = original.x + dx; patch.width = Math.max(200, original.width - dx); } if (resizeDirection.includes('n')) { patch.y = original.y + dy; patch.height = Math.max(140, original.height - dy); } setCurrentLayout((previous) => ({ ...previous, floats: previous.floats.map((candidate) => candidate.panelId === float.panelId ? { ...candidate, ...patch } : candidate) })); };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  }, []);

  const refreshCorners = useCallback(() => {
    if (!rootRef.current) return;
    const next = findSplitIntersections(rootRef.current, currentLayout.root);
    setCorners((previous) => previous.length === next.length && previous.every((corner, index) => {
      const candidate = next[index];
      return candidate && corner.id === candidate.id && corner.x === candidate.x && corner.y === candidate.y && corner.cursor === candidate.cursor;
    }) ? previous : next);
  }, [currentLayout.root]);
  useLayoutEffect(() => { refreshCorners(); }, [refreshCorners]);
  useEffect(() => { if (typeof ResizeObserver === 'undefined' || !rootRef.current) return undefined; const observer = new ResizeObserver(refreshCorners); observer.observe(rootRef.current); return () => observer.disconnect(); }, [refreshCorners]);
  const resizeCorner = useCallback((event: ReactPointerEvent<HTMLDivElement>, corner: DockCornerJunction) => {
    event.preventDefault(); event.stopPropagation();
    const startX = event.clientX; const startY = event.clientY; const root = currentLayout.root; if (!root) return;
    const vertical = corner.verticalSplits.map((split) => { const node = findNode(root, split.splitId); return { ...split, startSizes: node?.type === 'split' ? [...node.sizes] : split.startSizes }; });
    const horizontal = corner.horizontalSplits.map((split) => { const node = findNode(root, split.splitId); return { ...split, startSizes: node?.type === 'split' ? [...node.sizes] : split.startSizes }; });
    let latestRoot = root;
    const move = (moveEvent: PointerEvent) => { const updates = [...vertical.map((split) => ({ splitId: split.splitId, sizes: calculateSplitResize(split.startSizes, split.index, moveEvent.clientX - startX, split.totalPx, 5) })), ...horizontal.map((split) => ({ splitId: split.splitId, sizes: calculateSplitResize(split.startSizes, split.index, moveEvent.clientY - startY, split.totalPx, 5) }))]; updates.forEach((update) => { latestRoot = updateSplitSizes(latestRoot, update.splitId, update.sizes); }); setCurrentLayout((previous) => ({ ...previous, root: latestRoot })); };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); commit({ ...currentLayout, root: latestRoot }); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  }, [commit, currentLayout]);

  const resizeSplit = useCallback((splitId: string, sizes: number[]) => {
    setCurrentLayout((previous) => previous.root ? { ...previous, root: updateSplitSizes(previous.root, splitId, sizes) } : previous);
  }, []);
  const finishSplitResize = useCallback(() => {
    window.requestAnimationFrame(() => commit(currentLayoutRef.current));
  }, [commit]);

  useImperativeHandle(ref, () => ({ getLayout, setLayout, resetLayout, exportLayout: () => JSON.stringify(getLayout(), null, 2), importLayout, activatePanel, autoHidePanel, restoreAutoHide, closePanel, floatPanel, floatGroup, dockFloat, selectTab, closeTab, updateFloat, refreshCorners }), [activatePanel, autoHidePanel, closePanel, closeTab, dockFloat, floatGroup, floatPanel, getLayout, importLayout, refreshCorners, resetLayout, restoreAutoHide, selectTab, setLayout, updateFloat]);

  useEffect(() => {
    if (!activePeek) return undefined;
    const close = (event: MouseEvent) => { const target = event.target as Node; if (rootRef.current && !rootRef.current.querySelector('.sp-dock-peek')?.contains(target) && !rootRef.current.querySelector('.sp-auto-hide-strip')?.contains(target)) setActivePeek(null); };
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') setActivePeek(null); };
    document.addEventListener('mousedown', close, true); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', close, true); document.removeEventListener('keydown', key); };
  }, [activePeek]);

  const autoHideBySide = (side: AutoHideStripPosition): AutoHideStripTab[] => (currentLayout.autoHide ?? []).filter((entry) => entry.side === side).map((entry) => { const panel = panels.get(entry.panelId); return { id: entry.panelId, label: panel?.props.title ?? entry.panelId, icon: panel?.props.icon ?? undefined }; });
  const activeAutoHidePanel = activePeek ? panels.get(activePeek) : undefined;
  const activeAutoHideEntry = activePeek ? currentLayout.autoHide?.find((entry) => entry.panelId === activePeek) : undefined;
  const activeFloat = movingFloat ? currentLayout.floats.find((float) => float.panelId === movingFloat) : null;

  return <div {...props} ref={rootRef} dir={direction} className={['sp-dock-manager', thinSplitters ? 'sp-dock-manager--thin-splitters' : '', dense ? 'sp-dock-manager--dense' : '', className].filter(Boolean).join(' ')} role="region" aria-label={t('layoutManager')}>
    <AutoHideStrip position="top" tabs={autoHideBySide('top')} activeTabId={activePeek} onTabClick={(panelId) => setActivePeek(activePeek === panelId ? null : panelId)} />
    <div className="sp-dock-manager__middle">
      <AutoHideStrip position="left" tabs={autoHideBySide('left')} activeTabId={activePeek} onTabClick={(panelId) => setActivePeek(activePeek === panelId ? null : panelId)} />
      <div className="sp-dock-manager__surface">
        {currentLayout.root ? <NodeView node={currentLayout.root} panels={panels} tabsAtBottom={tabsAtBottom} source={dragSource} activeZone={activeZone} canDrop={canNodeDrop} onDragOver={dragOver} onDrop={drop} onDragLeave={() => setActiveZone(null)} onPanelDragStart={startPanelDrag} onGroupDragStart={startGroupDrag} onDragEnd={endDrag} onActivate={activatePanel} onSelectTab={selectTab} onReorderTab={reorderTab} onClose={closePanel} onAutoHide={autoHideFromElement} onFloat={floatPanel} onFloatGroup={floatGroup} thinSplitters={thinSplitters} onResize={resizeSplit} onResizeEnd={finishSplitResize} /> : <div className="sp-dock-manager__empty" role="status"><Icon name="layout-dashboard" size={36} /><span>{t('allPanelsClosed')}</span></div>}
        {(dragSource || movingFloat) && <div className="sp-dock-manager__outer-zones" aria-hidden="true">{(['top', 'right', 'bottom', 'left'] as const).map((side) => <div key={side} className={['sp-dock-manager__outer-zone', `sp-dock-manager__outer-zone--${side}`].join(' ')} data-dock-outer={side} />)}</div>}
        {corners.map((corner) => <div key={corner.id} className="sp-dock-corner-handle" style={{ left: corner.x, top: corner.y, cursor: corner.cursor }} role="separator" aria-label="Resize split intersection" onPointerDown={(event) => resizeCorner(event, corner)} />)}
      </div>
      <AutoHideStrip position="right" tabs={autoHideBySide('right')} activeTabId={activePeek} onTabClick={(panelId) => setActivePeek(activePeek === panelId ? null : panelId)} />
    </div>
    <AutoHideStrip position="bottom" tabs={autoHideBySide('bottom')} activeTabId={activePeek} onTabClick={(panelId) => setActivePeek(activePeek === panelId ? null : panelId)} />
    {currentLayout.floats.map((float) => <div key={float.panelId} style={{ zIndex: zIndexes[float.panelId] ?? 100, pointerEvents: activeFloat?.panelId === float.panelId ? 'none' : undefined }}><FloatView float={float} panels={panels} onBringToFront={bringToFront} onMoveStart={moveFloatStart} onResizeStart={resizeFloatStart} onSelect={selectTab} onClose={closeFloatTab} onDock={dockFloat} /></div>)}
    {activeAutoHidePanel && activeAutoHideEntry && <div className={['sp-dock-peek', `sp-dock-peek--${activeAutoHideEntry.side}`].join(' ')} data-peek-panel={activePeek}><PeekView panel={activeAutoHidePanel} onRestore={restoreAutoHide} onClose={() => setActivePeek(null)} /></div>}
  </div>;
});

DockManager.displayName = 'DockManager';
