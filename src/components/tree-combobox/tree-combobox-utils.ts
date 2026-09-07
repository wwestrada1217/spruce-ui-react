import type { LookupSource } from '../lookup/lookup-types.js';

export interface TreeComboboxNode {
  value: string;
  label: string;
  icon?: string;
  badge?: string;
  disabled?: boolean;
  expanded?: boolean;
  children?: TreeComboboxNode[];
  data?: unknown;
  [key: string]: unknown;
}

export interface TreeComboboxFlatNode {
  node: TreeComboboxNode;
  raw: unknown;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
  parentValues: string[];
}

export type TreeComboboxSource = LookupSource<unknown>;

export function normalizeTreeItems(
  items: readonly unknown[],
  displayField: string,
  valueField: string,
  childrenField: string,
): TreeComboboxNode[] {
  return items.map((item) => {
    if (typeof item === 'string' || typeof item === 'number') {
      return { value: String(item), label: String(item), data: item };
    }
    const record = (item ?? {}) as Record<string, unknown>;
    const rawChildren = record[childrenField];
    return {
      ...record,
      value: String(record[valueField] ?? record.value ?? record[displayField] ?? ''),
      label: String(record[displayField] ?? record.label ?? record[valueField] ?? ''),
      icon: typeof record.icon === 'string' ? record.icon : undefined,
      badge: typeof record.badge === 'string' ? record.badge : undefined,
      disabled: typeof record.disabled === 'boolean' ? record.disabled : undefined,
      expanded: typeof record.expanded === 'boolean' ? record.expanded : undefined,
      children: Array.isArray(rawChildren)
        ? normalizeTreeItems(rawChildren, displayField, valueField, childrenField)
        : undefined,
      data: item,
    };
  });
}

export function collectBranchValues(nodes: readonly TreeComboboxNode[], result = new Set<string>()): Set<string> {
  for (const node of nodes) {
    if (node.children?.length) {
      result.add(node.value);
      collectBranchValues(node.children, result);
    }
  }
  return result;
}

export function collectInitialExpandedValues(nodes: readonly TreeComboboxNode[], result = new Set<string>()): Set<string> {
  for (const node of nodes) {
    if (node.expanded && node.children?.length) result.add(node.value);
    if (node.children) collectInitialExpandedValues(node.children, result);
  }
  return result;
}

export function flattenVisibleTree(
  nodes: readonly TreeComboboxNode[],
  expanded: ReadonlySet<string>,
  depth = 0,
  parents: string[] = [],
  result: TreeComboboxFlatNode[] = [],
): TreeComboboxFlatNode[] {
  for (const node of nodes) {
    const hasChildren = Boolean(node.children?.length);
    const isExpanded = hasChildren && expanded.has(node.value);
    result.push({ node, raw: node.data ?? node, depth, hasChildren, expanded: isExpanded, parentValues: parents });
    if (isExpanded && node.children) flattenVisibleTree(node.children, expanded, depth + 1, [...parents, node.value], result);
  }
  return result;
}

export function filterTree(
  nodes: readonly TreeComboboxNode[],
  query: string,
  fields: readonly string[],
): TreeComboboxNode[] {
  const term = query.trim().toLocaleLowerCase();
  if (!term) return [...nodes];
  const visit = (node: TreeComboboxNode): TreeComboboxNode | null => {
    const children = node.children?.map(visit).filter((child): child is TreeComboboxNode => child !== null);
    const matches = fields.some((field) => String(node[field] ?? '').toLocaleLowerCase().includes(term));
    return matches || children?.length ? { ...node, children } : null;
  };
  return nodes.map(visit).filter((node): node is TreeComboboxNode => node !== null);
}

export function findTreeNode(nodes: readonly TreeComboboxNode[], value: string): TreeComboboxNode | undefined {
  for (const node of nodes) {
    if (node.value === value) return node;
    const nested = node.children ? findTreeNode(node.children, value) : undefined;
    if (nested) return nested;
  }
  return undefined;
}

export function descendantValues(node: TreeComboboxNode): string[] {
  return [node.value, ...(node.children?.flatMap(descendantValues) ?? [])];
}

export function selectionState(node: TreeComboboxNode, selected: ReadonlySet<string>): 'checked' | 'mixed' | 'unchecked' {
  const values = descendantValues(node).filter((value) => value !== node.value);
  if (selected.has(node.value) && values.every((value) => selected.has(value))) return 'checked';
  const count = values.filter((value) => selected.has(value)).length;
  return count > 0 || selected.has(node.value) ? 'mixed' : 'unchecked';
}
