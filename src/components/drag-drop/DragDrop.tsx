import {
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import './DragDrop.css';

export type DragDropEffect = DataTransfer['dropEffect'];
export type DragDropEffectAllowed = DataTransfer['effectAllowed'];
export type DragDropPosition = 'before' | 'after' | 'inside';
export type DragDropAxis = 'vertical' | 'horizontal';

export interface DragDropEvent<T = unknown> {
  event: PointerEvent;
  data: T | undefined;
  source: HTMLElement | null;
  target: HTMLElement;
  sourceGroup: string;
  targetGroup: string;
  position: DragDropPosition;
}

type DragCallback<T> = (event: DragDropEvent<T>) => void;

interface DragTarget {
  element: HTMLElement;
  group: string;
  accepts: '*' | readonly string[];
  disabled: boolean;
  dropDisabled: boolean;
  data: unknown;
  axis: DragDropAxis;
  setState: (dragging: boolean, over: boolean, position: DragDropPosition | null) => void;
  emitStarted: (event: PointerEvent) => void;
  emitEntered: (event: DragDropEvent) => void;
  emitMoved: (event: DragDropEvent) => void;
  emitLeft: (event: DragDropEvent) => void;
  emitDropped: (event: DragDropEvent) => void;
  emitEnded: (event: DragDropEvent) => void;
}

const targets = new Map<HTMLElement, DragTarget>();

function acceptsTarget(source: DragTarget, target: DragTarget): boolean {
  if (target.disabled || target.dropDisabled || source.group === target.group) return !target.disabled && !target.dropDisabled;
  return target.accepts === '*' || target.accepts.includes(source.group);
}

function positionFor(event: PointerEvent, target: DragTarget): DragDropPosition {
  const rect = target.element.getBoundingClientRect();
  const value = target.axis === 'horizontal'
    ? (event.clientX - rect.left) / Math.max(rect.width, 1)
    : (event.clientY - rect.top) / Math.max(rect.height, 1);
  const adjustedValue = target.axis === 'horizontal' && getComputedStyle(target.element).direction === 'rtl' ? 1 - value : value;
  if (adjustedValue < 0.35) return 'before';
  if (adjustedValue > 0.65) return 'after';
  return 'inside';
}

function targetAt(event: PointerEvent, source: DragTarget): { target: DragTarget; position: DragDropPosition } | null {
  const elements = typeof document.elementsFromPoint === 'function' ? document.elementsFromPoint(event.clientX, event.clientY) : [];
  const candidates: HTMLElement[] = elements.length
    ? elements.filter((element): element is HTMLElement => element instanceof HTMLElement)
    : [...targets.keys()];
  for (const element of candidates) {
    const candidate = targets.get(element) ?? targets.get(element.closest('[data-drag-drop-target]') as HTMLElement);
    if (candidate && acceptsTarget(source, candidate)) return { target: candidate, position: positionFor(event, candidate) };
  }
  return null;
}

function createPreview(element: HTMLElement): HTMLElement {
  const preview = element.cloneNode(true) as HTMLElement;
  const rect = element.getBoundingClientRect();
  preview.setAttribute('aria-hidden', 'true');
  preview.style.position = 'fixed';
  preview.style.pointerEvents = 'none';
  preview.style.zIndex = 'var(--sp-drag-drop-preview-z-index, 1200)';
  preview.style.width = `${rect.width}px`;
  preview.style.opacity = 'var(--sp-drag-drop-preview-opacity, 0.92)';
  preview.style.boxShadow = 'var(--sp-drag-drop-preview-shadow, var(--sp-shadow-lg))';
  if (element.ownerDocument.body) element.ownerDocument.body.appendChild(preview);
  return preview;
}

export interface DragDropProps<T = unknown> extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onDragStart' | 'onDragEnd' | 'onKeyDown'> {
  as?: 'div' | 'li' | 'section' | 'article' | 'button' | 'span';
  data?: T;
  group?: string;
  accepts?: '*' | readonly string[];
  disabled?: boolean;
  dragDisabled?: boolean;
  dropDisabled?: boolean;
  dragHandle?: string;
  axis?: DragDropAxis;
  effectAllowed?: DragDropEffectAllowed;
  dropEffect?: DragDropEffect;
  dataType?: string;
  transferText?: string;
  liveSort?: boolean;
  previewTilt?: boolean;
  onDragStarted?: DragCallback<T>;
  onDragEntered?: DragCallback<T>;
  onDragMoved?: DragCallback<T>;
  onDragLeft?: DragCallback<T>;
  onDropped?: DragCallback<T>;
  onDragEnded?: DragCallback<T>;
  children?: ReactNode;
  onKeyDown?: (event: ReactKeyboardEvent<HTMLElement>) => void;
}

export function DragDrop<T = unknown>({
  as = 'div',
  data,
  group = 'default',
  accepts = '*',
  disabled = false,
  dragDisabled = false,
  dropDisabled = false,
  dragHandle = '',
  axis = 'vertical',
  effectAllowed = 'move',
  dropEffect = 'move',
  dataType = 'application/x-spruce-drag-drop',
  transferText = '',
  liveSort = false,
  previewTilt = false,
  onDragStarted,
  onDragEntered,
  onDragMoved,
  onDragLeft,
  onDropped,
  onDragEnded,
  children,
  className,
  onKeyDown: userOnKeyDown,
  ...props
}: DragDropProps<T>) {
  const [dragging, setDragging] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dropPosition, setDropPosition] = useState<DragDropPosition | null>(null);
  const [keyboardDragging, setKeyboardDragging] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const targetRef = useRef<DragTarget | null>(null);

  const eventFor = useCallback((event: PointerEvent, target: DragTarget, position: DragDropPosition): DragDropEvent<T> => ({
    event,
    data,
    source: elementRef.current,
    target: target.element,
    sourceGroup: group,
    targetGroup: target.group,
    position,
  }), [data, group]);

  const setState = useCallback((nextDragging: boolean, over: boolean, position: DragDropPosition | null) => {
    setDragging(nextDragging);
    setDragOver(over);
    setDropPosition(position);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;
    const target: DragTarget = {
      element,
      group,
      accepts,
      disabled,
      dropDisabled,
      data,
      axis,
      setState,
      emitStarted: (event) => onDragStarted?.({ event, data, source: element, target: element, sourceGroup: group, targetGroup: group, position: 'inside' }),
      emitEntered: (event) => onDragEntered?.(event as DragDropEvent<T>),
      emitMoved: (event) => onDragMoved?.(event as DragDropEvent<T>),
      emitLeft: (event) => onDragLeft?.(event as DragDropEvent<T>),
      emitDropped: (event) => onDropped?.(event as DragDropEvent<T>),
      emitEnded: (event) => onDragEnded?.(event as DragDropEvent<T>),
    };
    targetRef.current = target;
    targets.set(element, target);
    return () => {
      targets.delete(element);
      if (targetRef.current === target) targetRef.current = null;
    };
  }, [accepts, axis, data, disabled, dropDisabled, group, onDragEnded, onDragEntered, onDragLeft, onDragMoved, onDragStarted, onDropped, setState]);

  const setElementRef = useCallback((element: HTMLElement | null) => { elementRef.current = element; }, []);

  const startPointerDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const source = targetRef.current;
    const element = elementRef.current;
    if (!source || !element || disabled || dragDisabled || event.button !== 0) return;
    const startTarget = event.target as HTMLElement;
    if (dragHandle && !startTarget.closest(dragHandle)) return;
    if (startTarget.closest('button, input, textarea, select, a, [contenteditable="true"]')) return;
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    let active = false;
    let lastTarget: DragTarget | null = null;
    let lastPosition: DragDropPosition = 'inside';
    let preview: HTMLElement | null = null;
    const sourceParent = element.parentNode;
    const sourceNextSibling = element.nextSibling;
    const pointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (!active && Math.hypot(dx, dy) < 4) return;
      if (!active) {
        active = true;
        setState(true, false, null);
        source.emitStarted(moveEvent);
        preview = createPreview(element);
        if (previewTilt) preview.style.transform = 'rotate(var(--sp-drag-drop-preview-tilt, 1deg))';
      }
      if (preview) {
        preview.style.left = `${moveEvent.clientX + 12}px`;
        preview.style.top = `${moveEvent.clientY + 12}px`;
      }
      const located = targetAt(moveEvent, source);
      if (!located) {
        if (lastTarget) lastTarget.emitLeft(eventFor(moveEvent, lastTarget, lastPosition));
        lastTarget = null;
        setState(true, false, null);
        return;
      }
      const { target, position } = located;
      if (lastTarget !== target) {
        if (lastTarget) lastTarget.emitLeft(eventFor(moveEvent, lastTarget, lastPosition));
        target.emitEntered(eventFor(moveEvent, target, position));
      }
      lastTarget = target;
      lastPosition = position;
      target.setState(target === source ? true : false, true, position);
      setState(true, target === source, position);
      target.emitMoved(eventFor(moveEvent, target, position));
      if (liveSort && target.element !== element && (position === 'before' || position === 'after')) {
        if (position === 'before') target.element.before(element);
        else target.element.after(element);
      }
    };
    const pointerUp = (upEvent: PointerEvent) => {
      document.removeEventListener('pointermove', pointerMove);
      document.removeEventListener('pointerup', pointerUp);
      document.removeEventListener('pointercancel', pointerUp);
      if (preview) preview.remove();
      if (lastTarget && active) {
        lastTarget.emitDropped(eventFor(upEvent, lastTarget, lastPosition));
        lastTarget.setState(false, false, null);
      } else if (liveSort && sourceParent) {
        sourceParent.insertBefore(element, sourceNextSibling);
      }
      if (active) source.emitEnded(eventFor(upEvent, source, lastPosition));
      setState(false, false, null);
    };
    document.addEventListener('pointermove', pointerMove);
    document.addEventListener('pointerup', pointerUp);
    document.addEventListener('pointercancel', pointerUp);
  }, [disabled, dragDisabled, dragHandle, eventFor, liveSort, previewTilt, setState]);

  const handleKeyDown = useCallback((event: ReactKeyboardEvent<HTMLElement>) => {
    userOnKeyDown?.(event);
    if (disabled || dragDisabled) return;
    const source = targetRef.current;
    const element = elementRef.current;
    if (!source || !element) return;
    if ((event.key === ' ' || event.key === 'Enter') && !keyboardDragging) {
      event.preventDefault();
      setKeyboardDragging(true);
      setState(true, true, 'inside');
      source.emitStarted(event.nativeEvent as unknown as PointerEvent);
      return;
    }
    if (event.key === 'Escape' && keyboardDragging) {
      event.preventDefault();
      setKeyboardDragging(false);
      setState(false, false, null);
      source.emitEnded(eventFor(event.nativeEvent as unknown as PointerEvent, source, 'inside'));
      return;
    }
    if ((event.key === ' ' || event.key === 'Enter') && keyboardDragging) {
      event.preventDefault();
      setKeyboardDragging(false);
      setState(false, false, null);
      source.emitDropped(eventFor(event.nativeEvent as unknown as PointerEvent, source, 'inside'));
      source.emitEnded(eventFor(event.nativeEvent as unknown as PointerEvent, source, 'inside'));
    }
  }, [disabled, dragDisabled, eventFor, keyboardDragging, setState, userOnKeyDown]);

  const Element = as;
  // The dynamic host element is deliberately supported by this primitive; the ref is attached to the resolved DOM host.
  // eslint-disable-next-line react-hooks/refs
  return createElement(Element, {
    ...props,
    ref: setElementRef,
    className: ['sp-drag-drop', dragging ? 'sp-drag-drop--dragging' : '', dragOver ? 'sp-drag-drop--drag-over' : '', dropPosition ? `sp-drag-drop--drop-${dropPosition}` : '', disabled ? 'sp-drag-drop--disabled' : '', dragHandle ? 'sp-drag-drop--has-handle' : '', className].filter(Boolean).join(' '),
    'data-drag-drop-target': 'true',
    'data-drag-drop-group': group,
    'data-drag-drop-effect-allowed': effectAllowed,
    'data-drag-drop-effect': dropEffect,
    'data-drag-drop-type': dataType,
    'data-drag-drop-transfer-text': transferText || undefined,
    'aria-disabled': disabled || undefined,
    'aria-grabbed': dragging || undefined,
    tabIndex: props.tabIndex ?? (disabled ? undefined : 0),
    onPointerDown: startPointerDrag,
    onKeyDown: handleKeyDown,
  }, children);
}
