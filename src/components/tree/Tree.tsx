/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Icon } from '../../icons/Icon';
import { useI18n } from '../../i18n/i18n-context.js';
import './Tree.css';

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
  data?: unknown;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface TreeProps {
  nodes: TreeNode[];
  selectable?: boolean;
  draggable?: boolean;
  expandAll?: boolean;
  showLines?: boolean;
  expandOnClick?: boolean;
  onNodeSelect?: (node: TreeNode) => void;
  onNodeCheck?: (event: { node: TreeNode; checked: boolean }) => void;
  onNodeDrop?: (event: { node: TreeNode; parent: TreeNode | null; index: number }) => void;
  onNodeToggle?: (node: TreeNode) => void;
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

function hasChildren(node: TreeNode): boolean {
  return !!node.children && node.children.length > 0;
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
  isDraggable: boolean;
  expandOnClick: boolean;
  expandedIds: Set<string>;
  checkedIds: Set<string>;
  dropTarget: { id: string; position: 'before' | 'inside' | 'after' } | null;
  onToggleExpand: (node: TreeNode) => void;
  onToggleCheck: (node: TreeNode) => void;
  onNodeClick: (node: TreeNode) => void;
  onDragStart: (e: React.DragEvent, node: TreeNode) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, node: TreeNode) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, node: TreeNode) => void;
  onRowKeydown: (e: React.KeyboardEvent, node: TreeNode) => void;
}

function TreeNodeRow({
  node,
  depth,
  showLines,
  selectable,
  isDraggable,
  expandOnClick,
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
        style={{ paddingLeft: showLines ? undefined : depth * 20 }}
        draggable={isDraggable && !node.disabled ? true : undefined}
        tabIndex={0}
        onDragStart={e => onDragStart(e, node)}
        onDragEnd={onDragEnd}
        onDragOver={e => onDragOver(e, node)}
        onDragLeave={onDragLeave}
        onDrop={e => onDrop(e, node)}
        onClick={() => onNodeClick(node)}
        onKeyDown={e => onRowKeydown(e, node)}
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
      </div>

      {nodeHasChildren && expanded && (
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
  selectable = false,
  draggable: isDraggable = false,
  expandAll = false,
  showLines = false,
  expandOnClick = false,
  onNodeSelect,
  onNodeCheck,
  onNodeDrop,
  onNodeToggle,
}: TreeProps) {
  const { t } = useI18n();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    if (expandAll) {
      const ids = new Set<string>();
      collectExpandableIds(nodes, ids);
      return ids;
    }
    return new Set();
  });

  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set);
  const [draggedNode, setDraggedNode] = useState<TreeNode | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    id: string;
    position: 'before' | 'inside' | 'after';
  } | null>(null);
  const [internalNodes, setInternalNodes] = useState<TreeNode[]>(() => deepCloneNodes(nodes));

  const treeRef = useRef<HTMLDivElement>(null);

  // Sync external nodes into internal state when props change
  useEffect(() => {
    setInternalNodes(deepCloneNodes(nodes));
  }, [nodes]);

  // Expand-all effect when prop changes
  useEffect(() => {
    if (expandAll) {
      const ids = new Set<string>();
      collectExpandableIds(internalNodes, ids);
      setExpandedIds(ids);
    }
    // Only re-run when expandAll changes, not internalNodes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandAll]);

  // ── Expand / collapse ──────────────────────────────────────────────────

  const toggleExpand = useCallback(
    (node: TreeNode) => {
      setExpandedIds(prev => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          next.delete(node.id);
        } else {
          next.add(node.id);
        }
        return next;
      });
      onNodeToggle?.(node);
    },
    [onNodeToggle],
  );

  // ── Checkbox logic ─────────────────────────────────────────────────────

  const toggleCheck = useCallback(
    (node: TreeNode) => {
      if (node.disabled) return;
      setCheckedIds(prev => {
        const next = new Set(prev);
        const wasChecked = next.has(node.id);
        setCheckedRecursive(node, !wasChecked, next);
        updateParentCheckedState(nodes, next);
        onNodeCheck?.({ node, checked: !wasChecked });
        return next;
      });
    },
    [nodes, onNodeCheck],
  );

  // ── Node click ─────────────────────────────────────────────────────────

  const handleNodeClick = useCallback(
    (node: TreeNode) => {
      if (node.disabled) return;
      if (expandOnClick && hasChildren(node)) {
        toggleExpand(node);
      }
      onNodeSelect?.(node);
    },
    [expandOnClick, toggleExpand, onNodeSelect],
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
    (e: React.DragEvent, node: TreeNode) => {
      setDraggedNode(node);
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', node.id);
      }
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedNode(null);
    setDropTarget(null);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetNode: TreeNode) => {
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
    (e: React.DragEvent, targetNode: TreeNode) => {
      e.preventDefault();
      if (!draggedNode || !dropTarget) return;

      const newNodes = deepCloneNodes(internalNodes);
      const draggedClone = findNodeById(newNodes, draggedNode.id);
      if (!draggedClone) return;

      removeNodeFromTree(newNodes, draggedNode.id);
      insertNodeInTree(newNodes, dropTarget.id, draggedClone, dropTarget.position);

      setInternalNodes(newNodes);
      onNodeDrop?.({ node: draggedNode, parent: targetNode, index: 0 });

      setDraggedNode(null);
      setDropTarget(null);
    },
    [draggedNode, dropTarget, internalNodes, onNodeDrop],
  );

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="sp-tree" role="tree" aria-label={t('treeView')} ref={treeRef}>
      {internalNodes.map(node => (
        <TreeNodeRow
          key={node.id}
          node={node}
          depth={0}
          showLines={showLines}
          selectable={selectable}
          isDraggable={isDraggable}
          expandOnClick={expandOnClick}
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
        />
      ))}
    </div>
  );
}
