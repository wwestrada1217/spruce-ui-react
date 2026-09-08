import type { LookupSource } from '../lookup/lookup-types.js';

export interface TreeComboboxNode {
  /** Unique key/identifier used as the selection value */
  value: string;
  /** Display label */
  label: string;
  /** Optional icon name rendered before the label */
  icon?: string;
  /** Short pill badge */
  badge?: string;
  /** Whether this node is disabled */
  disabled?: boolean;
  /** Initial expanded state */
  expanded?: boolean;
  /** Child tree nodes */
  children?: TreeComboboxNode[];
  /** Custom data payload */
  data?: unknown;
  /** Additional custom properties */
  [key: string]: unknown;
}

export interface TreeFlatNode {
  node: TreeComboboxNode;
  depth: number;
  isLast: boolean;
  ancestorLines: boolean[];
  hasChildren: boolean;
  isExpanded: boolean;
}

export type TreeComboboxFlatNode = TreeFlatNode & {
  raw?: unknown;
  parentValues?: string[];
};

export type TreeComboboxSource =
  | TreeComboboxNode[]
  | unknown[]
  | LookupSource<unknown>
  | string;

export function normalizeTreeNodes(
  items: readonly unknown[],
  displayField = 'label',
  valueField = 'value',
  childrenField = 'children',
): TreeComboboxNode[] {
  return items.map((item) => {
    if (typeof item === 'object' && item !== null) {
      const rec = item as Record<string, unknown>;
      const rawChildren = Array.isArray(rec[childrenField])
        ? (rec[childrenField] as unknown[])
        : undefined;
      const node: TreeComboboxNode = {
        ...rec,
        value: String(rec[valueField] ?? rec['id'] ?? rec[displayField] ?? ''),
        label: String(rec[displayField] ?? rec['name'] ?? rec[valueField] ?? ''),
        icon: typeof rec['icon'] === 'string' ? rec['icon'] : undefined,
        badge: typeof rec['badge'] === 'string' ? rec['badge'] : undefined,
        disabled: Boolean(rec['disabled']),
        expanded: typeof rec['expanded'] === 'boolean' ? rec['expanded'] : undefined,
        data: rec['data'] ?? rec,
        children: rawChildren
          ? normalizeTreeNodes(rawChildren, displayField, valueField, childrenField)
          : undefined,
      };
      return node;
    }
    return { value: String(item), label: String(item), data: item };
  });
}

export function normalizeTreeItems(
  items: readonly unknown[],
  displayField = 'label',
  valueField = 'value',
  childrenField = 'children',
): TreeComboboxNode[] {
  return normalizeTreeNodes(items, displayField, valueField, childrenField);
}

export function collectAllExpandable(
  nodes: readonly TreeComboboxNode[],
  ids = new Set<string>(),
): Set<string> {
  for (const n of nodes) {
    if (n.children && n.children.length > 0) {
      ids.add(n.value);
      collectAllExpandable(n.children, ids);
    }
  }
  return ids;
}

export function collectBranchValues(
  nodes: readonly TreeComboboxNode[],
  result = new Set<string>(),
): Set<string> {
  return collectAllExpandable(nodes, result);
}

export function collectInitialExpandedValues(
  nodes: readonly TreeComboboxNode[],
  result = new Set<string>(),
): Set<string> {
  for (const node of nodes) {
    if (node.expanded && node.children?.length) result.add(node.value);
    if (node.children) collectInitialExpandedValues(node.children, result);
  }
  return result;
}

export function filterTreeNodes(
  nodes: readonly TreeComboboxNode[],
  query: string,
  filterKeys?: readonly string[] | null,
): TreeComboboxNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...nodes];

  const result: TreeComboboxNode[] = [];
  for (const node of nodes) {
    const matches = filterKeys && filterKeys.length > 0
      ? filterKeys.some((k) => String(node[k] ?? '').toLowerCase().includes(q)) ||
        node.label.toLowerCase().includes(q)
      : node.label.toLowerCase().includes(q);

    const filteredChildren = node.children
      ? filterTreeNodes(node.children, query, filterKeys)
      : [];

    if (matches || filteredChildren.length > 0) {
      result.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children,
      });
    }
  }
  return result;
}

export function filterTree(
  nodes: readonly TreeComboboxNode[],
  query: string,
  fields?: readonly string[],
): TreeComboboxNode[] {
  return filterTreeNodes(nodes, query, fields);
}

export function flattenNodes(
  nodes: readonly TreeComboboxNode[],
  depth: number,
  expandedIds: ReadonlySet<string>,
  output: TreeFlatNode[] = [],
  ancestorLines: boolean[] = [],
): TreeFlatNode[] {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const isLast = i === nodes.length - 1;
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isExpanded = expandedIds.has(node.value);

    output.push({
      node,
      depth,
      isLast,
      ancestorLines,
      hasChildren,
      isExpanded,
    });

    if (hasChildren && isExpanded) {
      flattenNodes(node.children!, depth + 1, expandedIds, output, [...ancestorLines, !isLast]);
    }
  }
  return output;
}

export function flattenVisibleTree(
  nodes: readonly TreeComboboxNode[],
  expanded: ReadonlySet<string>,
  depth = 0,
  parents: string[] = [],
  result: TreeComboboxFlatNode[] = [],
): TreeComboboxFlatNode[] {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const hasChildren = Boolean(node.children?.length);
    const isExpanded = hasChildren && expanded.has(node.value);
    result.push({
      node,
      depth,
      isLast: i === nodes.length - 1,
      ancestorLines: [],
      hasChildren,
      isExpanded,
      raw: node.data ?? node,
      parentValues: parents,
    });
    if (isExpanded && node.children) {
      flattenVisibleTree(node.children, expanded, depth + 1, [...parents, node.value], result);
    }
  }
  return result;
}

export function guideColumns(
  item: Pick<TreeFlatNode, 'depth' | 'ancestorLines' | 'isLast'>,
): ('line' | 'elbow' | 'elbow-last' | 'empty')[] {
  const depth = item.depth;
  const ancestors = item.ancestorLines;
  const cols: ('line' | 'elbow' | 'elbow-last' | 'empty')[] = [];
  for (let c = 0; c < depth; c++) {
    if (c === depth - 1) {
      cols.push(item.isLast ? 'elbow-last' : 'elbow');
    } else {
      cols.push(ancestors[c + 1] ? 'line' : 'empty');
    }
  }
  return cols;
}

export function findTreeNode(
  nodes: readonly TreeComboboxNode[],
  val: string,
): TreeComboboxNode | null {
  for (const n of nodes) {
    if (n.value === val) return n;
    if (n.children) {
      const found = findTreeNode(n.children, val);
      if (found) return found;
    }
  }
  return null;
}

export function getRawItem(
  value: string,
  rawItems: readonly unknown[],
  valueField = 'value',
  displayField = 'label',
): unknown {
  const findRaw = (items: readonly unknown[]): unknown => {
    for (const item of items) {
      if (typeof item === 'object' && item !== null) {
        const rec = item as Record<string, unknown>;
        if (
          String(rec[valueField]) === value ||
          String(rec[displayField]) === value ||
          String(rec['id']) === value
        ) {
          return item;
        }
        if (Array.isArray(rec['children'])) {
          const found = findRaw(rec['children'] as unknown[]);
          if (found) return found;
        }
      } else if (String(item) === value) {
        return item;
      }
    }
    return null;
  };
  return findRaw(rawItems);
}

function isNodeAndDescendantsChecked(
  node: TreeComboboxNode,
  ids: ReadonlySet<string>,
): boolean {
  if (!ids.has(node.value) && (!node.children || node.children.length === 0)) return false;
  if (node.children && node.children.length > 0) {
    return node.children.every((c) => isNodeAndDescendantsChecked(c, ids));
  }
  return ids.has(node.value);
}

function hasAnyCheckedDescendant(
  node: TreeComboboxNode,
  ids: ReadonlySet<string>,
): boolean {
  if (ids.has(node.value)) return true;
  if (node.children) {
    return node.children.some((c) => hasAnyCheckedDescendant(c, ids));
  }
  return false;
}

export function isChecked(
  node: TreeComboboxNode,
  ids: ReadonlySet<string>,
  cascadeCheck = true,
): boolean {
  if (!cascadeCheck || !node.children || node.children.length === 0) {
    return ids.has(node.value);
  }
  return isNodeAndDescendantsChecked(node, ids);
}

export function isIndeterminate(
  node: TreeComboboxNode,
  ids: ReadonlySet<string>,
  cascadeCheck = true,
): boolean {
  if (!cascadeCheck || !node.children || node.children.length === 0) return false;
  const hasAnyChecked = hasAnyCheckedDescendant(node, ids);
  const allChecked = isNodeAndDescendantsChecked(node, ids);
  return hasAnyChecked && !allChecked;
}

export function setCheckedRecursive(
  node: TreeComboboxNode,
  checked: boolean,
  ids: Set<string>,
): void {
  if (checked) {
    ids.add(node.value);
  } else {
    ids.delete(node.value);
  }
  if (node.children) {
    for (const child of node.children) {
      if (!child.disabled) {
        setCheckedRecursive(child, checked, ids);
      }
    }
  }
}

export function descendantValues(node: TreeComboboxNode): string[] {
  return [node.value, ...(node.children?.flatMap(descendantValues) ?? [])];
}

export function selectionState(
  node: TreeComboboxNode,
  selected: ReadonlySet<string>,
): 'checked' | 'mixed' | 'unchecked' {
  if (isChecked(node, selected, true)) return 'checked';
  if (isIndeterminate(node, selected, true)) return 'mixed';
  return selected.has(node.value) ? 'checked' : 'unchecked';
}

