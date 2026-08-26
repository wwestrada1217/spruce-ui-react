import type { GanttCommand, GanttDependency, GanttTask, OverlapPeriod } from './gantt-types.js';

/** Framework-neutral bounded undo/redo history for editable Gantt hosts. */
export class GanttUndoRedo {
  private undoStack: GanttCommand[] = [];
  private redoStack: GanttCommand[] = [];
  private maxSteps: number;

  public constructor(maxSteps = 50) {
    this.maxSteps = Math.max(1, maxSteps);
  }

  public setMaxSteps(maxSteps: number): void {
    this.maxSteps = Math.max(1, maxSteps);
    this.undoStack = this.undoStack.slice(-this.maxSteps);
  }

  public execute(command: GanttCommand): void {
    command.execute();
    this.undoStack.push(command);
    this.undoStack = this.undoStack.slice(-this.maxSteps);
    this.redoStack = [];
  }

  public undo(): void {
    const command = this.undoStack.pop();
    if (!command) return;
    command.undo();
    this.redoStack.push(command);
  }

  public redo(): void {
    const command = this.redoStack.pop();
    if (!command) return;
    command.execute();
    this.undoStack.push(command);
  }

  public canUndo(): boolean { return this.undoStack.length > 0; }
  public canRedo(): boolean { return this.redoStack.length > 0; }
  public undoDescription(): string | undefined { return this.undoStack.at(-1)?.description; }
  public redoDescription(): string | undefined { return this.redoStack.at(-1)?.description; }
  public clear(): void { this.undoStack = []; this.redoStack = []; }
}

/** Return task IDs on the longest dependency chain. */
export function computeCriticalPath(
  tasks: GanttTask[],
  dependencies: GanttDependency[],
): Set<string | number> {
  const taskMap = new Map(tasks.map((task) => [task.id, task]));
  const incoming = new Map<string | number, GanttDependency[]>();
  for (const dependency of dependencies) {
    const list = incoming.get(dependency.toId) ?? [];
    list.push(dependency);
    incoming.set(dependency.toId, list);
  }

  const memo = new Map<string | number, { duration: number; ids: Set<string | number> }>();
  const visiting = new Set<string | number>();
  const longestTo = (id: string | number): { duration: number; ids: Set<string | number> } => {
    const cached = memo.get(id);
    if (cached) return cached;
    const task = taskMap.get(id);
    if (!task || visiting.has(id)) return { duration: 0, ids: new Set() };
    visiting.add(id);
    const ownDuration = Math.max(0, task.end.getTime() - task.start.getTime());
    let best = { duration: 0, ids: new Set<string | number>() };
    for (const dependency of incoming.get(id) ?? []) {
      const previous = longestTo(dependency.fromId);
      if (previous.duration > best.duration) best = previous;
    }
    visiting.delete(id);
    const result = { duration: best.duration + ownDuration, ids: new Set([...best.ids, id]) };
    memo.set(id, result);
    return result;
  };

  let longest = { duration: 0, ids: new Set<string | number>() };
  for (const task of tasks) {
    const path = longestTo(task.id);
    if (path.duration > longest.duration) longest = path;
  }
  return longest.ids;
}

/** Find resource overallocations by intersecting task intervals. */
export function detectOverallocations(tasks: GanttTask[]): OverlapPeriod[] {
  const grouped = new Map<string | number, GanttTask[]>();
  for (const task of tasks) {
    if (task.resourceId == null) continue;
    const list = grouped.get(task.resourceId) ?? [];
    list.push(task);
    grouped.set(task.resourceId, list);
  }
  const overlaps: OverlapPeriod[] = [];
  for (const [resourceId, resourceTasks] of grouped) {
    for (let i = 0; i < resourceTasks.length; i += 1) {
      for (let j = i + 1; j < resourceTasks.length; j += 1) {
        const left = resourceTasks[i];
        const right = resourceTasks[j];
        const start = new Date(Math.max(left.start.getTime(), right.start.getTime()));
        const end = new Date(Math.min(left.end.getTime(), right.end.getTime()));
        if (start < end) overlaps.push({ resourceId, start, end, taskIds: [left.id, right.id] });
      }
    }
  }
  return overlaps;
}

/** Minimal virtual-scroll math shared by Gantt consumers and tests. */
export class GanttVirtualScroll {
  public getRange(totalRows: number, rowHeight: number, viewportHeight: number, scrollTop: number, overscan = 5): { start: number; end: number; offset: number } {
    const visible = Math.max(1, Math.ceil(viewportHeight / rowHeight));
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const end = Math.min(totalRows, start + visible + overscan * 2);
    return { start, end, offset: start * rowHeight };
  }
}
