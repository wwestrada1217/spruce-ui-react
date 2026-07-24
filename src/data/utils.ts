export function hasIdProperty(obj: unknown): obj is { id: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    (obj as Record<string, unknown>)['id'] !== undefined
  );
}

export function getItemId<T>(item: T, idField: keyof T | ((item: T) => string)): string {
  if (typeof idField === 'function') {
    return idField(item);
  }
  return String(item[idField]);
}

export function extractId<T>(
  item: T | { id: string },
  idField: keyof T | ((item: T) => string),
): string {
  if (hasIdProperty(item)) return item.id;
  return getItemId(item as T, idField);
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
