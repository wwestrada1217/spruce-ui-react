/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Splitter.css';
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  Children,
  isValidElement,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { useI18n } from '../../i18n/i18n-context.js';

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface SplitterPaneProps {
  minSize?: number;
  maxSize?: number;
  children: ReactNode;
}

export interface SplitterProps {
  orientation?: 'horizontal' | 'vertical';
  gutterSize?: number;
  initialSizes?: number[];
  /** Controlled pane sizes in percentages. */
  sizes?: number[];
  /** Accessible label for the split view. */
  ariaLabel?: string;
  /** Percentage moved by each arrow-key press. */
  keyIncrement?: number;
  /** Render a 1px visual hairline while preserving the configured hit area. */
  thin?: boolean;
  /** Additional attributes for each gutter, useful for integrating with layout metadata. */
  gutterProps?: (index: number) => HTMLAttributes<HTMLDivElement>;
  onSizeChange?: (sizes: number[]) => void;
  /** Fired after a pointer, touch, or keyboard size change completes. */
  onSizeChangeEnd?: () => void;
  /** Fired when pointer, mouse, or touch dragging starts. */
  onDragStart?: () => void;
  /** Fired when pointer, mouse, or touch dragging ends. */
  onDragEnd?: () => void;
  className?: string;
  children: ReactNode;
}

/* ── SplitterPane ───────────────────────────────────────────────────────── */

export function SplitterPane({ children }: SplitterPaneProps) {
  return <>{children}</>;
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

interface PaneMeta {
  minSize: number;
  maxSize: number;
}

function collectPaneMeta(children: ReactNode): PaneMeta[] {
  const panes: PaneMeta[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement<SplitterPaneProps>(child) && child.type === SplitterPane) {
      panes.push({
        minSize: child.props.minSize ?? 0,
        maxSize: child.props.maxSize ?? 100,
      });
    }
  });
  return panes;
}

function collectPaneContent(children: ReactNode): ReactNode[] {
  const content: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement<SplitterPaneProps>(child) && child.type === SplitterPane) {
      content.push(child.props.children);
    }
  });
  return content;
}

function clampSize(size: number, meta: PaneMeta): number {
  return Math.min(meta.maxSize, Math.max(meta.minSize, size));
}

/* ── Component ──────────────────────────────────────────────────────────── */

export function Splitter({
  orientation = 'horizontal',
  gutterSize = 4,
  initialSizes,
  sizes: controlledSizes,
  ariaLabel,
  keyIncrement = 2,
  thin = false,
  gutterProps,
  onSizeChange,
  onSizeChangeEnd,
  onDragStart,
  onDragEnd,
  className = '',
  children,
}: SplitterProps) {
  const { isRtl, t } = useI18n();
  const paneMeta = collectPaneMeta(children);
  const paneContent = collectPaneContent(children);
  const paneCount = paneContent.length;

  const defaultSizes =
    initialSizes && initialSizes.length === paneCount
      ? initialSizes
      : Array.from({ length: paneCount }, () => 100 / paneCount);

  const [internalSizes, setInternalSizes] = useState<number[]>(defaultSizes);
  const [dragging, setDragging] = useState(false);
  const sizes = controlledSizes ?? internalSizes;

  const updateSizes = useCallback((nextSizes: number[]) => {
    if (controlledSizes === undefined) setInternalSizes(nextSizes);
    onSizeChange?.(nextSizes);
  }, [controlledSizes, onSizeChange]);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    gutterIndex: number;
    startPos: number;
    startSizes: number[];
    containerSize: number;
    input: 'pointer' | 'mouse' | 'touch';
  } | null>(null);

  // Keep sizes in sync if initialSizes prop changes while not dragging
  const initialSizesKey = initialSizes?.join(',');
  const prevInitialKey = useRef(initialSizesKey);
  useEffect(() => {
    if (prevInitialKey.current !== initialSizesKey && !dragging) {
      prevInitialKey.current = initialSizesKey;
      if (initialSizes && initialSizes.length === paneCount) {
        updateSizes(initialSizes);
      }
    }
  }, [initialSizesKey, initialSizes, paneCount, dragging, updateSizes]);

  const isHorizontal = orientation === 'horizontal';

  const getContainerSize = useCallback(() => {
    if (!containerRef.current) return 0;
    const totalGutterSize = gutterSize * (paneCount - 1);
    return (
      (isHorizontal
        ? containerRef.current.offsetWidth
        : containerRef.current.offsetHeight) - totalGutterSize
    );
  }, [isHorizontal, gutterSize, paneCount]);

  const applyConstraints = useCallback(
    (newSizes: number[], gutterIdx: number): number[] => {
      const result = [...newSizes];
      const a = gutterIdx;
      const b = gutterIdx + 1;
      const metaA = paneMeta[a];
      const metaB = paneMeta[b];

      if (!metaA || !metaB) return result;

      // Clamp pane A
      const clampedA = clampSize(result[a], metaA);
      const diffA = clampedA - result[a];
      result[a] = clampedA;
      result[b] -= diffA;

      // Clamp pane B
      const clampedB = clampSize(result[b], metaB);
      const diffB = clampedB - result[b];
      result[b] = clampedB;
      result[a] -= diffB;

      return result;
    },
    [paneMeta],
  );

  const handleDragStart = useCallback(
    (gutterIndex: number, clientPos: number, input: 'pointer' | 'mouse' | 'touch') => {
      if (dragState.current) return;
      const containerSize = getContainerSize();
      if (containerSize <= 0) return;

      dragState.current = {
        gutterIndex,
        startPos: clientPos,
        startSizes: [...sizes],
        containerSize,
        input,
      };
      setDragging(true);
      onDragStart?.();
    },
    [sizes, getContainerSize, onDragStart],
  );

  const handleDragMove = useCallback(
    (clientPos: number) => {
      const state = dragState.current;
      if (!state) return;

      const delta = isHorizontal && isRtl
        ? state.startPos - clientPos
        : clientPos - state.startPos;
      const deltaPercent = (delta / state.containerSize) * 100;

      const newSizes = [...state.startSizes];
      const a = state.gutterIndex;
      const b = state.gutterIndex + 1;

      newSizes[a] = state.startSizes[a] + deltaPercent;
      newSizes[b] = state.startSizes[b] - deltaPercent;

      const constrained = applyConstraints(newSizes, state.gutterIndex);

      updateSizes(constrained);
    },
    [applyConstraints, isHorizontal, isRtl, updateSizes],
  );

  const handleDragEnd = useCallback(() => {
    if (!dragState.current) return;
    dragState.current = null;
    setDragging(false);
    onDragEnd?.();
    onSizeChangeEnd?.();
  }, [onDragEnd, onSizeChangeEnd]);

  // Pointer, mouse, and touch events. Pointer events are primary, while the
  // mouse/touch paths keep the component usable in older event environments.
  useEffect(() => {
    if (!dragging) return;
    const input = dragState.current?.input;
    if (!input) return;

    if (input === 'pointer') {
      const onPointerMove = (e: PointerEvent) => {
        e.preventDefault();
        handleDragMove(isHorizontal ? e.clientX : e.clientY);
      };

      const onPointerUp = () => {
        handleDragEnd();
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);

      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
      };
    }

    if (input === 'touch') {
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 0) return;
        e.preventDefault();
        const touch = e.touches[0];
        handleDragMove(isHorizontal ? touch.clientX : touch.clientY);
      };

      const onTouchEnd = () => {
        handleDragEnd();
      };

      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
      window.addEventListener('touchcancel', onTouchEnd);

      return () => {
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('touchcancel', onTouchEnd);
      };
    }

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleDragMove(isHorizontal ? e.clientX : e.clientY);
    };

    const onMouseUp = () => {
      handleDragEnd();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, isHorizontal, handleDragMove, handleDragEnd]);

  const handleGutterPointerDown = useCallback(
    (gutterIndex: number, e: ReactPointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      handleDragStart(gutterIndex, isHorizontal ? e.clientX : e.clientY, 'pointer');
    },
    [handleDragStart, isHorizontal],
  );

  const handleGutterMouseDown = useCallback(
    (gutterIndex: number, e: React.MouseEvent) => {
      if (dragState.current) return;
      e.preventDefault();
      handleDragStart(gutterIndex, isHorizontal ? e.clientX : e.clientY, 'mouse');
    },
    [handleDragStart, isHorizontal],
  );

  const handleGutterTouchStart = useCallback(
    (gutterIndex: number, e: React.TouchEvent) => {
      if (dragState.current) return;
      if (e.touches.length === 0) return;
      e.preventDefault();
      const touch = e.touches[0];
      handleDragStart(gutterIndex, isHorizontal ? touch.clientX : touch.clientY, 'touch');
    },
    [handleDragStart, isHorizontal],
  );

  const handleGutterDoubleClick = useCallback(
    () => {
      const resetSizes =
        initialSizes && initialSizes.length === paneCount
          ? [...initialSizes]
          : Array.from({ length: paneCount }, () => 100 / paneCount);
      updateSizes(resetSizes);
      onSizeChangeEnd?.();
    },
    [initialSizes, paneCount, updateSizes, onSizeChangeEnd],
  );

  const handleGutterKeyDown = useCallback(
    (gutterIndex: number, e: React.KeyboardEvent) => {
      const step = keyIncrement;
      const a = gutterIndex;
      const b = gutterIndex + 1;
      let newSizes: number[] | null = null;

      const growKey = isHorizontal ? (isRtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
      const shrinkKey = isHorizontal ? (isRtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';

      if (e.key === growKey) {
        e.preventDefault();
        newSizes = [...sizes];
        newSizes[a] += step;
        newSizes[b] -= step;
      } else if (e.key === shrinkKey) {
        e.preventDefault();
        newSizes = [...sizes];
        newSizes[a] -= step;
        newSizes[b] += step;
      } else if (e.key === 'Home') {
        e.preventDefault();
        newSizes = [...sizes];
        const metaA = paneMeta[a];
        const shift = newSizes[a] - (metaA?.minSize ?? 0);
        newSizes[a] -= shift;
        newSizes[b] += shift;
      } else if (e.key === 'End') {
        e.preventDefault();
        newSizes = [...sizes];
        const metaA = paneMeta[a];
        const shift = (metaA?.maxSize ?? 100) - newSizes[a];
        newSizes[a] += shift;
        newSizes[b] -= shift;
      }

      if (newSizes) {
        const constrained = applyConstraints(newSizes, gutterIndex);
        updateSizes(constrained);
        onSizeChangeEnd?.();
      }
    },
    [sizes, isHorizontal, isRtl, paneMeta, applyConstraints, keyIncrement, updateSizes, onSizeChangeEnd],
  );

  const rootClasses = [
    'sp-splitter',
    `sp-splitter--${orientation}`,
    dragging && 'sp-splitter--dragging',
    thin && 'sp-splitter--thin',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const elements: ReactNode[] = [];

  for (let i = 0; i < paneCount; i++) {
    const paneStyle: React.CSSProperties = isHorizontal
      ? { width: `calc(${sizes[i]}% - ${(gutterSize * (paneCount - 1)) / paneCount}px)` }
      : { height: `calc(${sizes[i]}% - ${(gutterSize * (paneCount - 1)) / paneCount}px)` };

    elements.push(
      <div key={`pane-${i}`} className="sp-splitter__pane" style={paneStyle}>
        {paneContent[i]}
      </div>,
    );

    if (i < paneCount - 1) {
      const gutterStyle: React.CSSProperties = isHorizontal
        ? { width: gutterSize }
        : { height: gutterSize };
      const customGutterProps = gutterProps?.(i);
      const {
        className: customClassName,
        style: customStyle,
        onPointerDown: customOnPointerDown,
        onMouseDown: customOnMouseDown,
        onTouchStart: customOnTouchStart,
        onDoubleClick: customOnDoubleClick,
        onKeyDown: customOnKeyDown,
        role: customRole,
        tabIndex: customTabIndex,
        'aria-label': customAriaLabel,
        ...customAttributes
      } = customGutterProps ?? {};

      elements.push(
        <div
          key={`gutter-${i}`}
          {...customAttributes}
          className={['sp-splitter__gutter', customClassName].filter(Boolean).join(' ')}
          role={customRole ?? 'separator'}
          aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
          aria-valuenow={Math.round(sizes[i])}
          aria-valuemin={paneMeta[i]?.minSize ?? 0}
          aria-valuemax={paneMeta[i]?.maxSize ?? 100}
          aria-label={customAriaLabel ?? `${t('split')} ${i + 1}`}
          tabIndex={customTabIndex ?? 0}
          style={{ ...customStyle, ...gutterStyle }}
          onPointerDown={(e) => {
            customOnPointerDown?.(e);
            if (!e.defaultPrevented) handleGutterPointerDown(i, e);
          }}
          onMouseDown={(e) => {
            customOnMouseDown?.(e);
            if (!e.defaultPrevented) handleGutterMouseDown(i, e);
          }}
          onTouchStart={(e) => {
            customOnTouchStart?.(e);
            if (!e.defaultPrevented) handleGutterTouchStart(i, e);
          }}
          onDoubleClick={(e) => {
            customOnDoubleClick?.(e);
            if (!e.defaultPrevented) handleGutterDoubleClick();
          }}
          onKeyDown={(e) => {
            customOnKeyDown?.(e);
            if (!e.defaultPrevented) handleGutterKeyDown(i, e);
          }}
        >
          <div className="sp-splitter__gutter-handle" />
        </div>,
      );
    }
  }

  return (
    <div ref={containerRef} className={rootClasses} role="group" aria-label={ariaLabel ?? t('resizableSplitView')}>
      {elements}
    </div>
  );
}
