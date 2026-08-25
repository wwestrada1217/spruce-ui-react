export type CursorListener = (index: number) => void;
export interface CursorObserver {
  next?(index: number): void;
  complete?(): void;
}

/**
 * A small cursor over a changing list length. It owns navigation semantics;
 * the list itself remains the caller's concern.
 */
export class NavigationCursor {
  private currentIndex = -1;
  private readonly listeners = new Set<CursorListener>();
  private readonly completions = new Map<CursorListener, () => void>();
  private completed = false;

  constructor(private readonly length: () => number) {}

  get index(): number {
    return this.currentIndex;
  }

  get hasNext(): boolean {
    return this.currentIndex < this.length() - 1;
  }

  get hasPrevious(): boolean {
    return this.currentIndex > 0;
  }

  subscribe(listener: CursorListener | CursorObserver): () => void {
    if (this.completed) return () => undefined;
    const next = typeof listener === 'function' ? listener : (listener.next ?? (() => undefined));
    this.listeners.add(next);
    if (typeof listener !== 'function' && listener.complete) this.completions.set(next, listener.complete);
    return () => {
      this.listeners.delete(next);
      this.completions.delete(next);
    };
  }

  set(index: number): void {
    this.currentIndex = index;
  }

  emitChange(): void {
    if (this.completed) return;
    this.listeners.forEach((listener) => listener(this.currentIndex));
  }

  next(): boolean {
    if (!this.hasNext) return false;
    this.currentIndex += 1;
    this.emitChange();
    return true;
  }

  previous(): boolean {
    if (!this.hasPrevious) return false;
    this.currentIndex -= 1;
    this.emitChange();
    return true;
  }

  first(): boolean {
    if (this.length() === 0) return false;
    this.currentIndex = 0;
    this.emitChange();
    return true;
  }

  last(): boolean {
    const length = this.length();
    if (length === 0) return false;
    this.currentIndex = length - 1;
    this.emitChange();
    return true;
  }

  skip(index: number): boolean {
    if (index < 0 || index >= this.length()) return false;
    this.currentIndex = index;
    this.emitChange();
    return true;
  }

  clampAfterDelete(): void {
    const length = this.length();
    if (length === 0) {
      this.currentIndex = -1;
      this.emitChange();
      return;
    }
    if (this.currentIndex >= length) {
      this.currentIndex = length - 1;
      this.emitChange();
    }
  }

  complete(): void {
    this.completed = true;
    this.completions.forEach((complete) => complete());
    this.completions.clear();
    this.listeners.clear();
  }
}
