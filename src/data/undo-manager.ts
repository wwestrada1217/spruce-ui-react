import type { TrackedRecord } from './tracked-record.js';

export interface ChangeCommand<T extends Record<string, unknown>> {
  type: 'add' | 'update' | 'delete';
  recordId: string;
  before: TrackedRecord<T> | null;
  after: TrackedRecord<T> | null;
  index?: number;
}

/** Bounded, framework-neutral undo/redo history. */
export class UndoManager<T extends Record<string, unknown>> {
  private undoStack: ChangeCommand<T>[] = [];
  private redoStack: ChangeCommand<T>[] = [];

  constructor(private readonly maxSteps = 50) {}

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  push(command: ChangeCommand<T>): void {
    this.redoStack = [];
    if (this.maxSteps <= 0) {
      this.undoStack = [];
      return;
    }
    this.undoStack = [...this.undoStack, command].slice(-this.maxSteps);
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  popUndo(): ChangeCommand<T> | null {
    const command = this.undoStack.pop() ?? null;
    if (command) this.redoStack.push(command);
    return command;
  }

  popRedo(): ChangeCommand<T> | null {
    const command = this.redoStack.pop() ?? null;
    if (command) this.undoStack.push(command);
    return command;
  }
}
