/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import { useI18n } from '../../i18n/i18n-context.js';
import './Tree.css';
import type { Border, Chrome, Radius } from '../../chrome/chrome.js';

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------

export interface TreeNode {
  id: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
  expanded?: boolean;
  checked?: boolean;
  disabled?: boolean;
  badge?: ReactNode;
  badgeAlign?: 'end' | 'inline';
  class?: string;
  data?: unknown;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface TreeProps {
  nodes: TreeNode[];
  chrome?: Chrome;
  radius?: Radius;
  border?: Border;
  selectable?: boolean;
  draggable?: boolean;
  nodeDraggable?: boolean | ((node: TreeNode) => boolean);
  expandAll?: boolean;
  showLines?: boolean;
  expandOnClick?: boolean;
  density?: 'default' | 'dense';
  badgeAlign?: 'end' | 'inline';
  groupSpacing?: number;
  virtualScroll?: boolean;
  virtualItemHeight?: number;
  virtualOverscan?: number;
  ariaLabel?: string;
  rowActions?: (node: TreeNode) => ReactNode;
  expandedIds?: string[];
  checkedIds?: string[];
  selectedId?: string | null;
  onExpandedIdsChange?: (ids: string[]) => void;
  onCheckedIdsChange?: (ids: string[]) => void;
  onSelectedIdChange?: (id: string | null) => void;
  onNodeSelect?: (node: TreeNode) => void;
  onNodeDblClick?: (node: TreeNode) => void;
  onNodeCheck?: (event: { node: TreeNode; checked: boolean }) => void;
  onNodeDrop?: (event: { node: TreeNode; parent: TreeNode | null; index: number }) => void;
  onNodeToggle?: (node: TreeNode) => void;
  onNodeDragStart?: (event: { node: TreeNode; event: React.DragEvent<HTMLDivElement> }) => void;
  onNodeDragEnd?: (event: { node: TreeNode; event: React.DragEvent<HTMLDivElement> }) => void;
}

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

function deepCloneNodes(nodes: TreeNode[]): TreeNode[] {
  return nodes.map(n => ({
    ...n,
    children: n.children ? deepCloneNodes(n.children) : undefined,
  }));
}

function collectExpandableIds(nodes: TreeNode[], ids: Set<string>): void {
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      ids.add(node.id);
      collectExpandableIds(node.children, ids);
    }
  }
}

function collectExpandedIds(nodes: TreeNode[], ids: Set<string>): void {
  for (const node of nodes) {
    if (node.expanded && node.children?.length) ids.add(node.id);
    if (node.children) collectExpandedIds(node.children, ids);
  }
}

function collectCheckedIds(nodes: TreeNode[], ids: Set<string>): void {
  for (const node of nodes) {
    if (node.checked) ids.add(node.id);
    if (node.children) collectCheckedIds(node.children, ids);
  }
}

function hasChildren(node: TreeNode): boolean {
  return !!node.children && node.children.length > 0;
}

interface FlatTreeNode {
  node: TreeNode;
  depth: number;
}

function flattenVisibleNodes(nodes: TreeNode[], expandedIds: Set<string>, depth = 0): FlatTreeNode[] {
  const result: FlatTreeNode[] = [];
  for (const node of nodes) {
    result.push({ node, depth });
    if (node.children && expandedIds.has(node.id)) {
      result.push(...flattenVisibleNodes(node.children, expandedIds, depth + 1));
    }
  }
  return result;
}

function findParentAndIndex(
  nodes: TreeNode[],
  id: string,
  parent: TreeNode | null = null,
): { parent: TreeNode | null; index: number } | null {
  for (let index = 0; index < nodes.length; index++) {
    if (nodes[index].id === id) return { parent, index };
    const nested = nodes[index].children && findParentAndIndex(nodes[index].children!, id, nodes[index]);
    if (nested) return nested;
  }
  return null;
}

function isDescendant(parent: TreeNode, potentialChild: TreeNode): boolean {
  if (!parent.children) return false;
  for (const child of parent.children) {
    if (child.id === potentialChild.id) return true;
    if (isDescendant(child, potentialChild)) return true;
  }
  return false;
}

function findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function removeNodeFromTree(nodes: TreeNode[], id: string): boolean {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      nodes.splice(i, 1);
      return true;
    }
    if (nodes[i].children && removeNodeFromTree(nodes[i].children!, id)) {
      return true;
    }
  }
  return false;
}

function insertNodeInTree(
  nodes: TreeNode[],
  targetId: string,
  node: TreeNode,
  position: 'before' | 'inside' | 'after',
): boolean {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === targetId) {
      if (position === 'before') {
        nodes.splice(i, 0, node);
      } else if (position === 'after') {
        nodes.splice(i + 1, 0, node);
      } else {
        if (!nodes[i].children) {
          nodes[i].children = [];
        }
        nodes[i].children!.push(node);
      }
      return true;
    }
    if (nodes[i].children && insertNodeInTree(nodes[i].children!, targetId, node, position)) {
      return true;
    }
  }
  return false;
}

function setCheckedRecursive(node: TreeNode, checked: boolean, ids: Set<string>): void {
  if (checked) {
    ids.add(node.id);
  } else {
    ids.delete(node.id);
  }
  if (node.children) {
    for (const child of node.children) {
      if (!child.disabled) {
        setCheckedRecursive(child, checked, ids);
      }
    }
  }
}

function updateParentCheckedState(nodes: TreeNode[], ids: Set<string>): void {
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      updateParentCheckedState(node.children, ids);
      const allChecked = node.children.every(c => ids.has(c.id));
      if (allChecked) {
        ids.add(node.id);
      } else {
        ids.delete(node.id);
      }
    }
  }
}

function isIndeterminate(node: TreeNode, checkedIds: Set<string>): boolean {
  if (!node.children || node.children.length === 0) return false;
  const hasChecked = node.children.some(
    c => checkedIds.has(c.id) || isIndeterminate(c, checkedIds),
  );
  const allChecked = node.children.every(c => checkedIds.has(c.id));
  return hasChecked && !allChecked;
}

// ---------------------------------------------------------------------------
// TreeNodeRow (internal recursive component)
// ---------------------------------------------------------------------------

interface TreeNodeRowProps {
  node: TreeNode;
  depth: number;
  showLines: boolean;
  selectable: boolean;
  isDraggable: (node: TreeNode) => boolean;
  expandOnClick: boolean;
  density: 'default' | 'dense';
  badgeAlign: 'end' | 'inline';
  rowActions?: (node: TreeNode) => ReactNode;
  selected: boolean;
  selectedId?: string | null;
  renderChildren: boolean;
  rowTabIndex: (node: TreeNode) => number;
  expandedIds: Set<string>;
  checkedIds: Set<string>;
  dropTarget: { id: string; position: 'before' | 'inside' | 'after' } | null;
  onToggleExpand: (node: TreeNode) => void;
  onToggleCheck: (node: TreeNode) => void;
  onNodeClick: (node: TreeNode) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, node: TreeNode) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, node: TreeNode) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, node: TreeNode) => void;
  onRowKeydown: (e: React.KeyboardEvent, node: TreeNode) => void;
  onRowFocus: (node: TreeNode) => void;
  onNodeDblClick?: (node: TreeNode) => void;
}

function TreeNodeRow({
  node,
  depth,
  showLines,
  selectable,
  isDraggable,
  expandOnClick,
  density,
  badgeAlign,
  rowActions,
  selected,
  selectedId,
  renderChildren,
  rowTabIndex,
  expandedIds,
  checkedIds,
  dropTarget,
  onToggleExpand,
  onToggleCheck,
  onNodeClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onRowKeydown,
  onRowFocus,
  onNodeDblClick,
}: TreeNodeRowProps) {
  const { t } = useI18n();
  const nodeHasChildren = hasChildren(node);
  const expanded = expandedIds.has(node.id);
  const checked = checkedIds.has(node.id);
  const indeterminate = isIndeterminate(node, checkedIds);

  const isDropBefore = dropTarget !== null && dropTarget.id === node.id && dropTarget.position === 'before';
  const isDropInside = dropTarget !== null && dropTarget.id === node.id && dropTarget.position === 'inside';
  const isDropAfter = dropTarget !== null && dropTarget.id === node.id && dropTarget.position === 'after';

  const nodeClassName = [
    'sp-tree-node',
    isDropBefore ? 'sp-tree-node--drop-before' : '',
    isDropInside ? 'sp-tree-node--drop-inside' : '',
    isDropAfter ? 'sp-tree-node--drop-after' : '',
    showLines ? 'sp-tree-node--line-connector' : '',
    density === 'dense' ? 'sp-tree-node--dense' : '',
    selected ? 'sp-tree-node--selected' : '',
    node.class ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const toggleClassName = [
    'sp-tree-node__toggle',
    !nodeHasChildren ? 'sp-tree-node__toggle--hidden' : '',
    nodeHasChildren && expanded ? 'sp-tree-node__toggle--expanded' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const checkboxClassName = [
    'sp-tree-node__checkbox',
    checked ? 'sp-tree-node__checkbox--checked' : '',
    indeterminate ? 'sp-tree-node__checkbox--indeterminate' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const labelClassName = [
    'sp-tree-node__label',
    node.disabled ? 'sp-tree-node__label--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const childrenClassName = [
    'sp-tree-node__children',
    showLines ? 'sp-tree-node__children--lines' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={nodeClassName}
      role="treeitem"
      aria-expanded={nodeHasChildren ? expanded : undefined}
    >
      <div
        className="sp-tree-node__row"
        style={{ paddingInlineStart: showLines ? undefined : depth * 20 }}
        draggable={isDraggable(node) && !node.disabled ? true : undefined}
        tabIndex={rowTabIndex(node)}
        onDragStart={e => onDragStart(e, node)}
        onDragEnd={onDragEnd}
        onDragOver={e => onDragOver(e, node)}
        onDragLeave={onDragLeave}
        onDrop={e => onDrop(e, node)}
        onClick={() => onNodeClick(node)}
        onDoubleClick={() => onNodeDblClick?.(node)}
        onKeyDown={e => onRowKeydown(e, node)}
        onFocus={() => onRowFocus(node)}
      >
        <button
          className={toggleClassName}
          onClick={e => {
            e.stopPropagation();
            onToggleExpand(node);
          }}
          type="button"
          tabIndex={-1}
          aria-label={expanded ? `${t('collapse')} ${node.label}` : `${t('expand')} ${node.label}`}
        >
          <Icon name="chevron-right" size={12} />
        </button>

        {selectable && (
          <span
            className={checkboxClassName}
            onClick={e => {
              e.stopPropagation();
              onToggleCheck(node);
            }}
            role="checkbox"
            aria-checked={checked ? 'true' : indeterminate ? 'mixed' : 'false'}
            aria-label={node.label}
          >
            {checked && <Icon name="check" size={10} />}
          </span>
        )}

        {node.icon && (
          <Icon name={node.icon} size={14} className="sp-tree-node__icon" />
        )}

        <span className={labelClassName}>{node.label}</span>
        {node.badge !== undefined && (
          <span className={`sp-tree-node__badge sp-tree-node__badge--${node.badgeAlign ?? badgeAlign}`}>
            {node.badge}
          </span>
        )}
        {rowActions && <span className="sp-tree-node__actions">{rowActions(node)}</span>}
      </div>

      {renderChildren && nodeHasChildren && expanded && (
        <div className={childrenClassName} role="group">
          {node.children!.map(child => (
            <TreeNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              showLines={showLines}
              selectable={selectable}
              isDraggable={isDraggable}
              expandOnClick={expandOnClick}
              density={density}
              badgeAlign={badgeAlign}
              rowActions={rowActions}
              selected={selectedId === child.id}
              selectedId={selectedId}
              renderChildren={renderChildren}
              rowTabIndex={rowTabIndex}
              expandedIds={expandedIds}
              checkedIds={checkedIds}
              dropTarget={dropTarget}
              onToggleExpand={onToggleExpand}
              onToggleCheck={onToggleCheck}
              onNodeClick={onNodeClick}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onRowKeydown={onRowKeydown}
              onRowFocus={onRowFocus}
              onNodeDblClick={onNodeDblClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tree (top-level component)
// ---------------------------------------------------------------------------

export function Tree({
  nodes,
  chrome = 'default',
  radius,
  border = 'default',
  selectable = false,
  draggable: isDraggable = false,
  nodeDraggable,
  expandAll = false,
  showLines = false,
  expandOnClick = false,
  density = 'default',
  badgeAlign = 'end',
  groupSpacing = 0,
  virtualScroll = false,
  virtualItemHeight = 32,
  virtualOverscan = 6,
  ariaLabel,
  rowActions,
  expandedIds: controlledExpandedIds,
  checkedIds: controlledCheckedIds,
  selectedId,
  onExpandedIdsChange,
  onCheckedIdsChange,
  onSelectedIdChange,
  onNodeSelect,
  onNodeDblClick,
  onNodeCheck,
  onNodeDrop,
  onNodeToggle,
  onNodeDragStart,
  onNodeDragEnd,
}: TreeProps) {
  const { t } = useI18n();
  const resolveNodeDraggable = useCallback(
    (node: TreeNode) => isDraggable && (nodeDraggable ? (typeof nodeDraggable === 'function' ? nodeDraggable(node) : nodeDraggable) : true),
    [isDraggable, nodeDraggable],
  );
  const [internalExpandedIds, setInternalExpandedIds] = useState<Set<string>>(() => {
    if (expandAll) {
      const ids = new Set<string>();
      collectExpandableIds(nodes, ids);
      return ids;
    }
    const ids = new Set<string>();
    collectExpandedIds(nodes, ids);
    return ids;
  });

  const [internalCheckedIds, setInternalCheckedIds] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    collectCheckedIds(nodes, ids);
    return ids;
  });
  const [draggedNode, setDraggedNode] = useState<TreeNode | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    id: string;
    position: 'before' | 'inside' | 'after';
  } | null>(null);
  const [internalNodes, setInternalNodes] = useState<TreeNode[]>(() => deepCloneNodes(nodes));

  const treeRef = useRef<HTMLDivElement>(null);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const expandedIds = useMemo(
    () => controlledExpandedIds !== undefined ? new Set<string>(controlledExpandedIds) : internalExpandedIds,
    [controlledExpandedIds, internalExpandedIds],
  );
  const checkedIds = useMemo(
    () => controlledCheckedIds !== undefined ? new Set<string>(controlledCheckedIds) : internalCheckedIds,
    [controlledCheckedIds, internalCheckedIds],
  );

  // Sync external nodes into internal state when props change
  useEffect(() => {
    setInternalNodes(deepCloneNodes(nodes));
    const ids = new Set<string>();
    collectCheckedIds(nodes, ids);
    if (controlledCheckedIds === undefined) setInternalCheckedIds(ids);
  }, [controlledCheckedIds, nodes]);

  // Expand-all effect when prop changes
  useEffect(() => {
    if (expandAll) {
      const ids = new Set<string>();
      collectExpandableIds(internalNodes, ids);
      if (controlledExpandedIds === undefined) setInternalExpandedIds(ids);
    }
    // Only re-run when expandAll changes, not internalNodes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandAll]);

  // ── Expand / collapse ──────────────────────────────────────────────────

  const toggleExpand = useCallback(
    (node: TreeNode) => {
      const next = new Set<string>(expandedIds);
      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);
      }
      if (controlledExpandedIds === undefined) setInternalExpandedIds(next);
      onExpandedIdsChange?.([...next]);
      onNodeToggle?.(node);
    },
    [controlledExpandedIds, expandedIds, onExpandedIdsChange, onNodeToggle],
  );

  // ── Checkbox logic ─────────────────────────────────────────────────────

  const toggleCheck = useCallback(
    (node: TreeNode) => {
      if (node.disabled) return;
      const next = new Set<string>(checkedIds);
      const wasChecked = next.has(node.id);
      setCheckedRecursive(node, !wasChecked, next);
      updateParentCheckedState(internalNodes, next);
      if (controlledCheckedIds === undefined) setInternalCheckedIds(next);
      onCheckedIdsChange?.([...next]);
      onNodeCheck?.({ node, checked: !wasChecked });
    },
    [checkedIds, controlledCheckedIds, internalNodes, onCheckedIdsChange, onNodeCheck],
  );

  // ── Node click ─────────────────────────────────────────────────────────

  const handleNodeClick = useCallback(
    (node: TreeNode) => {
      if (node.disabled) return;
      if (expandOnClick && hasChildren(node)) {
        toggleExpand(node);
      }
      onNodeSelect?.(node);
      onSelectedIdChange?.(node.id);
    },
    [expandOnClick, onNodeSelect, onSelectedIdChange, toggleExpand],
  );

  // ── Keyboard navigation ────────────────────────────────────────────────

  const focusSiblingRow = useCallback(
    (current: HTMLElement, direction: 'next' | 'previous') => {
      const tree = treeRef.current;
      if (!tree) return;
      const rows = Array.from(tree.querySelectorAll<HTMLElement>('.sp-tree-node__row'));
      const idx = rows.indexOf(current);
      const target = direction === 'next' ? rows[idx + 1] : rows[idx - 1];
      target?.focus();
    },
    [],
  );

  const handleRowKeydown = useCallback(
    (event: React.KeyboardEvent, node: TreeNode) => {
      const row = event.currentTarget as HTMLElement;
      const key = event.key;

      if (key === 'ArrowDown') {
        event.preventDefault();
        focusSiblingRow(row, 'next');
      } else if (key === 'ArrowUp') {
        event.preventDefault();
        focusSiblingRow(row, 'previous');
      } else if (key === 'ArrowRight') {
        event.preventDefault();
        if (hasChildren(node) && !expandedIds.has(node.id)) {
          toggleExpand(node);
        } else if (hasChildren(node) && expandedIds.has(node.id)) {
          queueMicrotask(() => focusSiblingRow(row, 'next'));
        }
      } else if (key === 'ArrowLeft') {
        event.preventDefault();
        if (hasChildren(node) && expandedIds.has(node.id)) {
          toggleExpand(node);
        } else {
          const parentGroup = row.closest('.sp-tree-node__children');
          if (parentGroup) {
            const parentRow = (parentGroup as HTMLElement).previousElementSibling as HTMLElement | null;
            parentRow?.focus();
          }
        }
      } else if (key === 'Enter' || key === ' ') {
        event.preventDefault();
        if (selectable) {
          toggleCheck(node);
        } else {
          handleNodeClick(node);
        }
      } else if (key === 'Home') {
        event.preventDefault();
        const tree = treeRef.current;
        const first = tree?.querySelector<HTMLElement>('.sp-tree-node__row');
        first?.focus();
      } else if (key === 'End') {
        event.preventDefault();
        const tree = treeRef.current;
        const rows = tree?.querySelectorAll<HTMLElement>('.sp-tree-node__row');
        if (rows && rows.length > 0) {
          rows[rows.length - 1].focus();
        }
      }
    },
    [expandedIds, selectable, toggleExpand, toggleCheck, handleNodeClick, focusSiblingRow],
  );

  // ── Drag and drop ──────────────────────────────────────────────────────

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, node: TreeNode) => {
      if (!resolveNodeDraggable(node) || node.disabled) return;
      setDraggedNode(node);
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', node.id);
      }
      onNodeDragStart?.({ node, event: e });
    },
    [onNodeDragStart, resolveNodeDraggable],
  );

  const handleDragEnd = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (draggedNode) onNodeDragEnd?.({ node: draggedNode, event });
    setDraggedNode(null);
    setDropTarget(null);
  }, [draggedNode, onNodeDragEnd]);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, targetNode: TreeNode) => {
      e.preventDefault();
      if (!draggedNode || draggedNode.id === targetNode.id) return;
      if (isDescendant(draggedNode, targetNode)) return;

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const y = e.clientY - rect.top;
      const height = rect.height;
      let position: 'before' | 'inside' | 'after';

      if (y < height * 0.25) {
        position = 'before';
      } else if (y > height * 0.75) {
        position = 'after';
      } else {
        position = 'inside';
      }

      setDropTarget({ id: targetNode.id, position });
    },
    [draggedNode],
  );

  const handleDragLeave = useCallback(() => {
    setDropTarget(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, targetNode: TreeNode) => {
      e.preventDefault();
      if (!draggedNode || !dropTarget) return;

      const newNodes = deepCloneNodes(internalNodes);
      const draggedClone = findNodeById(newNodes, draggedNode.id);
      if (!draggedClone) return;

      removeNodeFromTree(newNodes, draggedNode.id);
      insertNodeInTree(newNodes, dropTarget.id, draggedClone, dropTarget.position);

      setInternalNodes(newNodes);
      const targetLocation = findParentAndIndex(newNodes, dropTarget.id);
      const parent = dropTarget.position === 'inside' ? targetNode : targetLocation?.parent ?? null;
      const index = dropTarget.position === 'inside'
        ? (targetNode.children?.length ?? 1) - 1
        : (targetLocation?.index ?? 0) + (dropTarget.position === 'after' ? 1 : 0);
      onNodeDrop?.({ node: draggedNode, parent, index });

      setDraggedNode(null);
      setDropTarget(null);
    },
    [draggedNode, dropTarget, internalNodes, onNodeDrop],
  );

  const flatVisibleNodes = flattenVisibleNodes(internalNodes, expandedIds);
  const flatVisibleIds = useMemo(() => new Set(flatVisibleNodes.map(({ node }) => node.id)), [flatVisibleNodes]);
  const firstVisibleId = flatVisibleNodes[0]?.node.id;
  const rowTabIndex = useCallback(
    (node: TreeNode) => {
      const activeId = focusedNodeId && flatVisibleIds.has(focusedNodeId) ? focusedNodeId : firstVisibleId;
      return node.id === activeId ? 0 : -1;
    },
    [flatVisibleIds, firstVisibleId, focusedNodeId],
  );
  const onRowFocus = useCallback((node: TreeNode) => setFocusedNodeId(node.id), []);
  const visibleStart = virtualScroll
    ? Math.max(0, Math.floor(scrollTop / virtualItemHeight) - virtualOverscan)
    : 0;
  const visibleEnd = virtualScroll
    ? Math.min(flatVisibleNodes.length, Math.ceil((scrollTop + 320) / virtualItemHeight) + virtualOverscan)
    : flatVisibleNodes.length;
  const renderedFlatNodes = virtualScroll
    ? flatVisibleNodes.slice(visibleStart, visibleEnd)
    : flatVisibleNodes;

  const renderNode = (node: TreeNode, depth: number, renderChildren: boolean) => (
    <TreeNodeRow
      key={node.id}
      node={node}
      depth={depth}
      showLines={showLines}
      selectable={selectable}
      isDraggable={resolveNodeDraggable}
      expandOnClick={expandOnClick}
      density={density}
      badgeAlign={badgeAlign}
      rowActions={rowActions}
      selected={selectedId === node.id}
      selectedId={selectedId}
      renderChildren={renderChildren}
      rowTabIndex={rowTabIndex}
      expandedIds={expandedIds}
      checkedIds={checkedIds}
      dropTarget={dropTarget}
      onToggleExpand={toggleExpand}
      onToggleCheck={toggleCheck}
      onNodeClick={handleNodeClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onRowKeydown={handleRowKeydown}
      onRowFocus={onRowFocus}
      onNodeDblClick={onNodeDblClick}
    />
  );

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div
      className={[
        'sp-tree',
        virtualScroll && 'sp-tree--virtual',
        `sp-chrome--${chrome}`,
        radius && `sp-radius--${radius}`,
        `sp-border--${border}`,
      ].filter(Boolean).join(' ')}
      role="tree"
      aria-label={ariaLabel ?? t('treeView')}
      style={{ '--sp-tree-group-spacing': `${groupSpacing}px` } as React.CSSProperties}
      ref={treeRef}
      onScroll={(event) => {
        if (virtualScroll) setScrollTop(event.currentTarget.scrollTop);
      }}
    >
      {virtualScroll && visibleStart > 0 && <div aria-hidden="true" style={{ height: visibleStart * virtualItemHeight }} />}
      {virtualScroll
        ? renderedFlatNodes.map(({ node, depth }) => renderNode(node, depth, false))
        : internalNodes.map((node) => renderNode(node, 0, true))}
      {virtualScroll && visibleEnd < flatVisibleNodes.length && <div aria-hidden="true" style={{ height: (flatVisibleNodes.length - visibleEnd) * virtualItemHeight }} />}
    </div>
  );
}
