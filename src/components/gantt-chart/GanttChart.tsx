/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Icon } from '../../icons/Icon';
import type {
  GanttTask,
  GanttMilestone,
  GanttDependency,
  GanttResource,
  GanttConfig,
  GanttTimeScale,
  GanttFlatRow,
  GanttTimeSlot,
  GanttPrimarySlot,
  TaskClickEvent,
  TaskMoveEvent,
  TaskResizeEvent,
  MilestoneClickEvent,
  SlotClickEvent,
} from './gantt-types';
import {
  computeTimeRange,
  getTimeSlots,
  getPrimarySlots,
  buildTaskTree,
  flattenTree,
  autoScale,
  defaultSlotWidth,
  taskLeft,
  taskWidth,
  milestoneLeft,
  buildDependencyPath,
} from './gantt-utils';
import './GanttChart.css';

const SCALE_ORDER: GanttTimeScale[] = ['hour', 'day', 'week', 'month'];

const DEFAULT_CONFIG: Required<GanttConfig> = {
  timeScale: 'day',
  startDate: undefined as unknown as Date,
  endDate: undefined as unknown as Date,
  rowHeight: 36,
  headerHeight: 32,
  taskListWidth: 300,
  showDependencies: true,
  showProgress: true,
  showResources: true,
  editable: false,
  theme: 'light',
};

export interface GanttChartProps {
  /** Array of tasks to display in the Gantt chart. */
  tasks: GanttTask[];
  /** Optional milestones to display as diamond markers. */
  milestones?: GanttMilestone[];
  /** Optional dependency links between tasks. */
  dependencies?: GanttDependency[];
  /** Optional resources (people) assigned to tasks. */
  resources?: GanttResource[];
  /** Configuration overrides for the chart. */
  config?: GanttConfig;
  /** Fired when a task bar or task row is clicked. */
  onTaskClick?: (event: TaskClickEvent) => void;
  /** Fired when a task bar is moved via drag. */
  onTaskMove?: (event: TaskMoveEvent) => void;
  /** Fired when a task bar is resized via edge drag. */
  onTaskResize?: (event: TaskResizeEvent) => void;
  /** Fired when a milestone diamond is clicked. */
  onMilestoneClick?: (event: MilestoneClickEvent) => void;
  /** Fired when a timeline slot cell is clicked. */
  onSlotClick?: (event: SlotClickEvent) => void;
  /** Additional CSS class name(s). */
  className?: string;
}

// ── Helper sub-components ──────────────────────────────────

interface TaskBarProps {
  task: GanttTask;
  rangeStartMs: number;
  totalMs: number;
  rowIndex: number;
  rowHeight: number;
  containerWidth: number;
  editable: boolean;
  onTaskClick?: (event: TaskClickEvent) => void;
  onTaskMove?: (event: TaskMoveEvent) => void;
  onTaskResize?: (event: TaskResizeEvent) => void;
}

function TaskBar({
  task,
  rangeStartMs,
  totalMs,
  rowIndex,
  rowHeight,
  containerWidth,
  editable,
  onTaskClick,
  onTaskMove,
  onTaskResize,
}: TaskBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragLeftOffset, setDragLeftOffset] = useState(0);
  const [resizeLeftOffset, setResizeLeftOffset] = useState(0);
  const [resizeWidthOffset, setResizeWidthOffset] = useState(0);

  const barHeight = 24;
  const left = taskLeft(task, rangeStartMs, totalMs);
  const barW = taskWidth(task, totalMs);
  const visualLeft = left + dragLeftOffset + resizeLeftOffset;
  const visualWidth = Math.max(0.2, barW + resizeWidthOffset);
  const top = rowIndex * rowHeight + (rowHeight - barHeight) / 2;
  const progressPct = Math.round((task.progress ?? 0) * 100);

  const pxToPct = useCallback(
    (dx: number) => (containerWidth > 0 ? (dx / containerWidth) * 100 : 0),
    [containerWidth],
  );
  const pctToMs = useCallback(
    (pct: number) => (pct / 100) * totalMs,
    [totalMs],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!editable) {
        onTaskClick?.({ task });
        return;
      }
      const target = e.target as HTMLElement;
      if (target.classList.contains('sp-gantt__bar-resize')) return;

      e.preventDefault();
      const startX = e.clientX;
      const origStart = new Date(task.start);
      const origEnd = new Date(task.end);
      let didDrag = false;

      const onMove = (me: MouseEvent) => {
        const dx = me.clientX - startX;
        if (!didDrag && Math.abs(dx) < 3) return;
        didDrag = true;
        setDragging(true);
        setDragLeftOffset(pxToPct(dx));
      };

      const onUp = (me: MouseEvent) => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);

        // Read the final offset from the last drag
        // We need to compute it here since state might not have flushed
        const finalDx = me.clientX - startX;
        const finalOffset = pxToPct(finalDx);

        setDragLeftOffset(0);
        setDragging(false);

        if (!didDrag) {
          onTaskClick?.({ task });
          return;
        }

        const deltaMs = pctToMs(finalOffset);
        const newStart = new Date(origStart.getTime() + deltaMs);
        const newEnd = new Date(origEnd.getTime() + deltaMs);

        onTaskMove?.({
          task,
          oldStart: origStart,
          oldEnd: origEnd,
          newStart,
          newEnd,
        });
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [editable, task, pxToPct, pctToMs, onTaskClick, onTaskMove],
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, edge: 'left' | 'right') => {
      e.stopPropagation();
      e.preventDefault();

      const startX = e.clientX;
      const origStart = new Date(task.start);
      const origEnd = new Date(task.end);
      setDragging(true);

      const onMove = (me: MouseEvent) => {
        const dx = me.clientX - startX;
        const pctDelta = pxToPct(dx);

        if (edge === 'left') {
          const clampedPct = Math.min(pctDelta, barW - 0.2);
          setResizeLeftOffset(clampedPct);
          setResizeWidthOffset(-clampedPct);
        } else {
          const clampedPct = Math.max(pctDelta, -barW + 0.2);
          setResizeWidthOffset(clampedPct);
        }
      };

      const onUp = (me: MouseEvent) => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);

        // Compute final values directly from mouse position
        const finalDx = me.clientX - startX;
        const finalPctDelta = pxToPct(finalDx);

        let finalLeftOff = 0;
        let finalWidthOff = 0;

        if (edge === 'left') {
          finalLeftOff = Math.min(finalPctDelta, barW - 0.2);
          finalWidthOff = -finalLeftOff;
        } else {
          finalWidthOff = Math.max(finalPctDelta, -barW + 0.2);
        }

        setResizeLeftOffset(0);
        setResizeWidthOffset(0);
        setDragging(false);

        if (Math.abs(finalLeftOff) < 0.1 && Math.abs(finalWidthOff) < 0.1) return;

        let newStart: Date;
        let newEnd: Date;

        if (edge === 'left') {
          const deltaMs = pctToMs(finalLeftOff);
          newStart = new Date(origStart.getTime() + deltaMs);
          newEnd = origEnd;
        } else {
          newStart = origStart;
          const deltaMs = pctToMs(finalWidthOff);
          newEnd = new Date(origEnd.getTime() + deltaMs);
        }

        onTaskResize?.({
          task,
          oldStart: origStart,
          oldEnd: origEnd,
          newStart,
          newEnd,
          edge,
        });
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [task, barW, pxToPct, pctToMs, onTaskResize],
  );

  const ariaLabel = `${task.title}, ${task.start.toLocaleDateString()} to ${task.end.toLocaleDateString()}, ${progressPct}% complete`;

  return (
    <div
      className={`sp-gantt__bar${dragging ? ' sp-gantt__bar--dragging' : ''}`}
      style={{
        left: `${visualLeft}%`,
        width: `${visualWidth}%`,
        top: `${top}px`,
        ...(task.color ? { '--bar-color': task.color } as React.CSSProperties : {}),
      }}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onTaskClick?.({ task });
      }}
    >
      {editable && (
        <div
          className="sp-gantt__bar-resize sp-gantt__bar-resize--left"
          onMouseDown={(e) => handleResizeStart(e, 'left')}
        />
      )}

      <div className="sp-gantt__bar-fill" style={{ width: `${progressPct}%` }} />

      <span className="sp-gantt__bar-label">{task.title}</span>

      {editable && (
        <div
          className="sp-gantt__bar-resize sp-gantt__bar-resize--right"
          onMouseDown={(e) => handleResizeStart(e, 'right')}
        />
      )}

      {showTooltip && (
        <div className="sp-gantt__bar-tooltip" role="tooltip">
          <strong>{task.title}</strong>
          <div className="sp-gantt__bar-tooltip-row">
            {task.start.toLocaleDateString()} &ndash; {task.end.toLocaleDateString()}
          </div>
          {task.progress != null && (
            <div className="sp-gantt__bar-tooltip-row">Progress: {progressPct}%</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Milestone Marker ───────────────────────────────────────

interface MilestoneMarkerProps {
  milestone: GanttMilestone;
  rangeStartMs: number;
  totalMs: number;
  rowHeight: number;
  rowIndex: number;
  onMilestoneClick?: (event: MilestoneClickEvent) => void;
}

function MilestoneMarker({
  milestone,
  rangeStartMs,
  totalMs,
  rowHeight,
  rowIndex,
  onMilestoneClick,
}: MilestoneMarkerProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const left = milestoneLeft(milestone.date, rangeStartMs, totalMs);
  const top = rowIndex * rowHeight + rowHeight / 2 - 7;
  const ariaLabel = `Milestone: ${milestone.title}, ${milestone.date.toLocaleDateString()}`;

  return (
    <div
      className="sp-gantt__milestone"
      style={{
        left: `${left}%`,
        top: `${top}px`,
        ...(milestone.color ? { '--ms-color': milestone.color } as React.CSSProperties : {}),
      }}
      role="img"
      aria-label={ariaLabel}
      tabIndex={0}
      onClick={() => onMilestoneClick?.({ milestone })}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onMilestoneClick?.({ milestone });
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="sp-gantt__milestone-diamond" />
      {showTooltip && (
        <div className="sp-gantt__milestone-tooltip" role="tooltip">
          <strong>{milestone.title}</strong>
          <div>{milestone.date.toLocaleDateString()}</div>
        </div>
      )}
    </div>
  );
}

// ── Dependency Overlay ─────────────────────────────────────

interface DependencyOverlayProps {
  dependencies: GanttDependency[];
  rows: GanttFlatRow[];
  rangeStartMs: number;
  totalMs: number;
  rowHeight: number;
  containerWidth: number;
}

function DependencyOverlay({
  dependencies,
  rows,
  rangeStartMs,
  totalMs,
  rowHeight,
  containerWidth,
}: DependencyOverlayProps) {
  const totalHeight = rows.length * rowHeight;

  const taskRowIndex = useMemo(() => {
    const map = new Map<string | number, number>();
    for (let i = 0; i < rows.length; i++) {
      map.set(rows[i].task.id, i);
    }
    return map;
  }, [rows]);

  const taskMap = useMemo(() => {
    const map = new Map<string | number, GanttTask>();
    for (const row of rows) {
      map.set(row.task.id, row.task);
    }
    return map;
  }, [rows]);

  const paths = useMemo(() => {
    const result: Array<{ dep: GanttDependency; d: string }> = [];

    for (const dep of dependencies) {
      const fromTask = taskMap.get(dep.fromId);
      const toTask = taskMap.get(dep.toId);
      if (!fromTask || !toTask) continue;

      const fromIdx = taskRowIndex.get(dep.fromId);
      const toIdx = taskRowIndex.get(dep.toId);
      if (fromIdx == null || toIdx == null) continue;

      const fLeft = (taskLeft(fromTask, rangeStartMs, totalMs) / 100) * containerWidth;
      const fRight = fLeft + (taskWidth(fromTask, totalMs) / 100) * containerWidth;
      const tLeft = (taskLeft(toTask, rangeStartMs, totalMs) / 100) * containerWidth;
      const tRight = tLeft + (taskWidth(toTask, totalMs) / 100) * containerWidth;

      const fromY = fromIdx * rowHeight + rowHeight / 2;
      const toY = toIdx * rowHeight + rowHeight / 2;

      const d = buildDependencyPath(dep.type, fLeft, fRight, tLeft, tRight, fromY, toY);
      result.push({ dep, d });
    }

    return result;
  }, [dependencies, taskMap, taskRowIndex, rangeStartMs, totalMs, rowHeight, containerWidth]);

  return (
    <div
      className="sp-gantt__dep-overlay"
      style={{ width: '100%', height: `${totalHeight}px` }}
    >
      <svg
        width="100%"
        height={totalHeight}
        className="sp-gantt__dep-svg"
        aria-label="Task dependencies"
      >
        <defs>
          <marker
            id="sp-gantt-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--sp-text-subtle, #718096)" />
          </marker>
        </defs>

        {paths.map(({ dep, d }) => (
          <path
            key={String(dep.id)}
            d={d}
            fill="none"
            stroke="var(--sp-text-subtle, #718096)"
            strokeWidth="1.5"
            markerEnd="url(#sp-gantt-arrow)"
            className="sp-gantt__dep-line"
            aria-label={`Dependency: ${dep.fromId} to ${dep.toId} (${dep.type})`}
            role="img"
            tabIndex={0}
          />
        ))}
      </svg>
    </div>
  );
}

// ── Format Helpers ─────────────────────────────────────────

function formatDate(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const y = date.getFullYear();
  return `${m}/${d}/${y}`;
}

function formatProgress(p: number | undefined): string {
  if (p == null) return '';
  return `${Math.round(p * 100)}%`;
}

// ── Main Component ─────────────────────────────────────────

/**
 * A full-featured Gantt chart component.
 *
 * Displays tasks on a timeline with support for tree hierarchy,
 * milestones, dependency arrows, drag-to-move, drag-to-resize,
 * multiple time scales, and a resizable task list panel.
 *
 * @example
 * ```tsx
 * <GanttChart
 *   tasks={[
 *     { id: 1, title: 'Design', start: new Date(2026, 0, 1), end: new Date(2026, 0, 15), progress: 0.8 },
 *     { id: 2, title: 'Development', start: new Date(2026, 0, 10), end: new Date(2026, 1, 15), progress: 0.3 },
 *   ]}
 *   dependencies={[{ id: 'd1', fromId: 1, toId: 2, type: 'FS' }]}
 *   config={{ editable: true }}
 *   onTaskClick={(e) => console.log('Clicked', e.task.title)}
 * />
 * ```
 */
export function GanttChart({
  tasks,
  milestones = [],
  dependencies = [],
  resources = [],
  config = {},
  onTaskClick,
  onTaskMove,
  onTaskResize,
  onMilestoneClick,
  onSlotClick,
  className = '',
}: GanttChartProps) {
  // ── Merged config ────────────────────────────────────────
  const cfg = useMemo<GanttConfig>(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config],
  );

  // ── State ────────────────────────────────────────────────
  const [expandedIds, setExpandedIds] = useState<Set<string | number>>(() => new Set());
  const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(null);
  const [currentScale, setCurrentScale] = useState<GanttTimeScale>(cfg.timeScale ?? 'day');
  const [taskListWidthPx, setTaskListWidthPx] = useState(cfg.taskListWidth ?? 300);

  const timelineRef = useRef<HTMLDivElement>(null);
  const taskListBodyRef = useRef<HTMLDivElement>(null);

  // Auto-detect scale on mount
  useEffect(() => {
    if (!config.timeScale) {
      const range = computeTimeRange(tasks, milestones, cfg);
      setCurrentScale(autoScale(range.start, range.end));
    } else {
      setCurrentScale(config.timeScale);
    }
    // Only run on mount or when config.timeScale changes explicitly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.timeScale]);

  // ── Tree -> flat rows ────────────────────────────────────
  const tree = useMemo(() => buildTaskTree(tasks), [tasks]);
  const flatRows = useMemo(
    () => flattenTree(tree, expandedIds),
    [tree, expandedIds],
  );

  // ── Time range ───────────────────────────────────────────
  const timeRange = useMemo(
    () => computeTimeRange(tasks, milestones, { ...cfg, timeScale: currentScale }),
    [tasks, milestones, cfg, currentScale],
  );
  const rangeStartMs = timeRange.start.getTime();
  const totalMs = timeRange.end.getTime() - timeRange.start.getTime();

  // ── Slots ────────────────────────────────────────────────
  const timeSlots: GanttTimeSlot[] = useMemo(
    () => getTimeSlots(timeRange.start, timeRange.end, currentScale),
    [timeRange, currentScale],
  );
  const primarySlots: GanttPrimarySlot[] = useMemo(
    () => getPrimarySlots(timeSlots, currentScale),
    [timeSlots, currentScale],
  );

  const slotWidth = defaultSlotWidth(currentScale);
  const totalWidth = timeSlots.length * slotWidth;
  const rowHeight = cfg.rowHeight ?? 36;
  const headerHeight = cfg.headerHeight ?? 32;
  const totalHeight = flatRows.length * rowHeight;

  // ── Resource map ─────────────────────────────────────────
  const resourceMap = useMemo(() => {
    const map = new Map<string | number, GanttResource>();
    for (const r of resources) {
      map.set(r.id, r);
    }
    return map;
  }, [resources]);

  // ── Today position ───────────────────────────────────────
  const todayPosition = useMemo(() => {
    const now = new Date();
    const pos = ((now.getTime() - rangeStartMs) / totalMs) * 100;
    return pos >= 0 && pos <= 100 ? pos : null;
  }, [rangeStartMs, totalMs]);

  // ── Callbacks ────────────────────────────────────────────
  const toggleExpand = useCallback((taskId: string | number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }, []);

  const handleTaskClick = useCallback(
    (event: TaskClickEvent) => {
      setSelectedTaskId(event.task.id);
      onTaskClick?.(event);
    },
    [onTaskClick],
  );

  const handleSlotClick = useCallback(
    (date: Date) => {
      onSlotClick?.({ date });
    },
    [onSlotClick],
  );

  // ── Scroll sync ──────────────────────────────────────────
  const handleTimelineScroll = useCallback(() => {
    const timeline = timelineRef.current;
    const taskListBody = taskListBodyRef.current;
    if (timeline && taskListBody) {
      taskListBody.style.transform = `translateY(${-timeline.scrollTop}px)`;
    }
  }, []);

  const handleTaskListWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    const timeline = timelineRef.current;
    if (timeline) {
      timeline.scrollTop += e.deltaY;
    }
  }, []);

  // ── Zoom controls ────────────────────────────────────────
  const zoomIn = useCallback(() => {
    setCurrentScale((prev) => {
      const idx = SCALE_ORDER.indexOf(prev);
      return idx > 0 ? SCALE_ORDER[idx - 1] : prev;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setCurrentScale((prev) => {
      const idx = SCALE_ORDER.indexOf(prev);
      return idx < SCALE_ORDER.length - 1 ? SCALE_ORDER[idx + 1] : prev;
    });
  }, []);

  const scrollToToday = useCallback(() => {
    const now = new Date();
    const pct = (now.getTime() - rangeStartMs) / totalMs;
    const timeline = timelineRef.current;
    if (timeline) {
      const scrollPos = pct * totalWidth - timeline.clientWidth / 2;
      timeline.scrollTo({ left: Math.max(0, scrollPos), behavior: 'smooth' });
    }
  }, [rangeStartMs, totalMs, totalWidth]);

  // ── Gutter drag ──────────────────────────────────────────
  const handleGutterDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = taskListWidthPx;

      const body = (e.currentTarget as HTMLElement).parentElement;
      body?.classList.add('sp-gantt__body--resizing');

      const onMove = (ev: MouseEvent) => {
        const delta = ev.clientX - startX;
        setTaskListWidthPx(Math.max(150, Math.min(600, startWidth + delta)));
      };

      const onUp = () => {
        body?.classList.remove('sp-gantt__body--resizing');
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [taskListWidthPx],
  );

  const handleGutterKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = 20;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setTaskListWidthPx((w) => Math.max(150, w - step));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setTaskListWidthPx((w) => Math.min(600, w + step));
    }
  }, []);

  // ── Render ───────────────────────────────────────────────
  const rootClasses = ['sp-gantt', className].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="sp-gantt__toolbar" role="toolbar" aria-label="Gantt chart controls">
        <div className="sp-gantt__toolbar-group">
          {SCALE_ORDER.map((scale) => (
            <button
              key={scale}
              className={`sp-gantt__toolbar-btn${currentScale === scale ? ' sp-gantt__toolbar-btn--active' : ''}`}
              onClick={() => setCurrentScale(scale)}
              aria-label={`${scale.charAt(0).toUpperCase() + scale.slice(1)} scale`}
            >
              {scale.charAt(0).toUpperCase() + scale.slice(1)}
            </button>
          ))}
        </div>

        <div className="sp-gantt__toolbar-group">
          <button className="sp-gantt__toolbar-btn" onClick={zoomIn} aria-label="Zoom in">
            <Icon name="plus" size={14} />
          </button>
          <button className="sp-gantt__toolbar-btn" onClick={zoomOut} aria-label="Zoom out">
            <Icon name="minus" size={14} />
          </button>
          <button className="sp-gantt__toolbar-btn" onClick={scrollToToday} aria-label="Scroll to today">
            Today
          </button>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────── */}
      <div className="sp-gantt__body">
        {/* Task List (left panel) */}
        <div
          className="sp-gantt__task-list-wrap"
          style={{ width: `${taskListWidthPx}px` }}
          onWheel={handleTaskListWheel}
        >
          <div
            className="sp-gantt__task-list"
            role="treegrid"
            aria-label="Task list"
          >
            {/* Task list header */}
            <div
              className="sp-gantt__task-list-header"
              style={{ height: `${headerHeight * 2}px` }}
              role="row"
            >
              <div className="sp-gantt__task-list-header-cell sp-gantt__task-list-header-cell--name" role="columnheader">
                Task
              </div>
              {cfg.showProgress && (
                <div className="sp-gantt__task-list-header-cell sp-gantt__task-list-header-cell--progress" role="columnheader">
                  %
                </div>
              )}
              {cfg.showResources && (
                <div className="sp-gantt__task-list-header-cell sp-gantt__task-list-header-cell--resource" role="columnheader">
                  Owner
                </div>
              )}
            </div>

            {/* Task list rows */}
            <div className="sp-gantt__task-list-body" ref={taskListBodyRef}>
              {flatRows.map((row, idx) => {
                const resource = row.task.resourceId != null
                  ? resourceMap.get(row.task.resourceId)
                  : undefined;

                return (
                  <div
                    key={String(row.task.id)}
                    className={[
                      'sp-gantt__task-list-row',
                      selectedTaskId === row.task.id && 'sp-gantt__task-list-row--selected',
                      idx % 2 === 0 && 'sp-gantt__task-list-row--even',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{ height: `${rowHeight}px` }}
                    role="row"
                    aria-level={row.depth + 1}
                    aria-expanded={row.hasChildren ? row.expanded : undefined}
                    aria-selected={selectedTaskId === row.task.id}
                    tabIndex={0}
                    onClick={() => handleTaskClick({ task: row.task })}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight' && row.hasChildren && !row.expanded) {
                        e.preventDefault();
                        toggleExpand(row.task.id);
                      } else if (e.key === 'ArrowLeft' && row.hasChildren && row.expanded) {
                        e.preventDefault();
                        toggleExpand(row.task.id);
                      }
                    }}
                  >
                    {/* Task name cell */}
                    <div className="sp-gantt__task-list-cell sp-gantt__task-list-cell--name">
                      <span
                        className="sp-gantt__task-list-indent"
                        style={{ width: `${row.depth * 20}px` }}
                      />
                      {row.hasChildren ? (
                        <button
                          className="sp-gantt__task-list-toggle"
                          aria-label={row.expanded ? `Collapse ${row.task.title}` : `Expand ${row.task.title}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(row.task.id);
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            className={row.expanded ? 'sp-gantt__task-list-toggle--expanded' : ''}
                          >
                            <path
                              d="M4 2l4 4-4 4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      ) : (
                        <span className="sp-gantt__task-list-toggle-spacer" />
                      )}
                      <span className="sp-gantt__task-list-title" title={row.task.title}>
                        {row.task.title}
                      </span>
                    </div>

                    {/* Progress cell */}
                    {cfg.showProgress && (
                      <div className="sp-gantt__task-list-cell sp-gantt__task-list-cell--progress">
                        {formatProgress(row.task.progress)}
                      </div>
                    )}

                    {/* Resource cell */}
                    {cfg.showResources && (
                      <div className="sp-gantt__task-list-cell sp-gantt__task-list-cell--resource">
                        {resource && (
                          <>
                            {resource.avatar ? (
                              <img
                                className="sp-gantt__resource-avatar"
                                src={resource.avatar}
                                alt={resource.name}
                              />
                            ) : null}
                            <span className="sp-gantt__resource-name">{resource.name}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {flatRows.length === 0 && (
                <div className="sp-gantt__empty">No tasks to display</div>
              )}
            </div>
          </div>
        </div>

        {/* Gutter (resize handle) */}
        <div
          className="sp-gantt__gutter"
          role="separator"
          tabIndex={0}
          aria-label="Resize task list"
          aria-valuenow={taskListWidthPx}
          onMouseDown={handleGutterDragStart}
          onKeyDown={handleGutterKeyDown}
        />

        {/* Timeline (right panel) */}
        <div
          className="sp-gantt__timeline"
          ref={timelineRef}
          onScroll={handleTimelineScroll}
        >
          {/* Timeline header */}
          <div
            className="sp-gantt__timeline-header"
            style={{ width: `${totalWidth}px` }}
          >
            {/* Primary row */}
            <div className="sp-gantt__timeline-header-primary" role="row">
              {primarySlots.map((group, i) => (
                <div
                  key={`${group.label}-${i}`}
                  className="sp-gantt__timeline-header-primary-cell"
                  style={{ width: `${group.span * slotWidth}px` }}
                  role="columnheader"
                >
                  {group.label}
                </div>
              ))}
            </div>

            {/* Secondary row */}
            <div className="sp-gantt__timeline-header-secondary" role="row">
              {timeSlots.map((slot) => (
                <div
                  key={slot.start.getTime()}
                  className={[
                    'sp-gantt__timeline-header-cell',
                    slot.isToday && 'sp-gantt__timeline-header-cell--today',
                    slot.isWeekend && 'sp-gantt__timeline-header-cell--weekend',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ width: `${slotWidth}px` }}
                  role="columnheader"
                >
                  {slot.label}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline body */}
          <div
            className="sp-gantt__timeline-body"
            style={{ width: `${totalWidth}px`, height: `${totalHeight}px` }}
          >
            {/* Row backgrounds with slot grid cells */}
            {flatRows.map((row, idx) => (
              <div
                key={`row-bg-${String(row.task.id)}`}
                className={`sp-gantt__timeline-row${idx % 2 === 0 ? ' sp-gantt__timeline-row--even' : ''}`}
                style={{
                  top: `${idx * rowHeight}px`,
                  height: `${rowHeight}px`,
                  width: `${totalWidth}px`,
                }}
              >
                {timeSlots.map((slot) => (
                  <div
                    key={slot.start.getTime()}
                    className={[
                      'sp-gantt__timeline-cell',
                      slot.isToday && 'sp-gantt__timeline-cell--today',
                      slot.isWeekend && 'sp-gantt__timeline-cell--weekend',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{ width: `${slotWidth}px` }}
                    onClick={() => handleSlotClick(slot.start)}
                  />
                ))}
              </div>
            ))}

            {/* Today line */}
            {todayPosition != null && (
              <div
                className="sp-gantt__today-line"
                style={{ left: `${todayPosition}%`, height: `${totalHeight}px` }}
                aria-hidden="true"
              />
            )}

            {/* Dependency arrows */}
            {cfg.showDependencies && dependencies.length > 0 && (
              <DependencyOverlay
                dependencies={dependencies}
                rows={flatRows}
                rangeStartMs={rangeStartMs}
                totalMs={totalMs}
                rowHeight={rowHeight}
                containerWidth={totalWidth}
              />
            )}

            {/* Task bars */}
            {flatRows.map((row, idx) => (
              <TaskBar
                key={`bar-${String(row.task.id)}`}
                task={row.task}
                rangeStartMs={rangeStartMs}
                totalMs={totalMs}
                rowIndex={idx}
                rowHeight={rowHeight}
                containerWidth={totalWidth}
                editable={cfg.editable ?? false}
                onTaskClick={handleTaskClick}
                onTaskMove={onTaskMove}
                onTaskResize={onTaskResize}
              />
            ))}

            {/* Milestones */}
            {milestones.map((ms) => (
              <MilestoneMarker
                key={`ms-${String(ms.id)}`}
                milestone={ms}
                rangeStartMs={rangeStartMs}
                totalMs={totalMs}
                rowHeight={rowHeight}
                rowIndex={0}
                onMilestoneClick={onMilestoneClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
