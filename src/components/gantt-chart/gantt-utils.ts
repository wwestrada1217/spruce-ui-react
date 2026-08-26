/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type {
  GanttTask,
  GanttMilestone,
  GanttConfig,
  GanttTimeScale,
  GanttTimeSlot,
  GanttPrimarySlot,
  GanttFlatRow,
} from './gantt-types.js';

// ── Date Helpers ────────────────────────────────────────────

export function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function addHours(d: Date, n: number): Date {
  return new Date(d.getTime() + n * 3600_000);
}

export function startOfWeek(d: Date): Date {
  const r = startOfDay(d);
  r.setDate(r.getDate() - r.getDay());
  return r;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function diffMs(a: Date, b: Date): number {
  return b.getTime() - a.getTime();
}

// ── Alignment Helpers ──────────────────────────────────────

function scalePaddingMs(scale: GanttTimeScale = 'day'): number {
  switch (scale) {
    case 'hour':
      return 3600_000 * 2;
    case 'day':
      return 86400_000 * 2;
    case 'week':
      return 86400_000 * 7;
    case 'month':
      return 86400_000 * 15;
  }
}

function alignToScale(date: Date, scale: GanttTimeScale = 'day', dir: 'floor' | 'ceil'): Date {
  switch (scale) {
    case 'hour': {
      const d = new Date(date);
      if (dir === 'floor') {
        d.setMinutes(0, 0, 0);
      } else {
        d.setHours(d.getHours() + 1, 0, 0, 0);
      }
      return d;
    }
    case 'day':
      return dir === 'floor' ? startOfDay(date) : startOfDay(addDays(date, 1));
    case 'week':
      return dir === 'floor' ? startOfWeek(date) : startOfWeek(addDays(date, 7));
    case 'month':
      return dir === 'floor'
        ? startOfMonth(date)
        : startOfMonth(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  }
}

// ── Public Helpers ──────────────────────────────────────────

/**
 * Compute the effective time range for the chart, based on tasks, milestones,
 * and optional config overrides. Adds padding on each side.
 */
export function computeTimeRange(
  tasks: GanttTask[],
  milestones: GanttMilestone[],
  config: GanttConfig,
): { start: Date; end: Date } {
  if (config.startDate && config.endDate) {
    return { start: config.startDate, end: config.endDate };
  }

  let minDate = Infinity;
  let maxDate = -Infinity;

  for (const t of tasks) {
    const s = t.start.getTime();
    const e = t.end.getTime();
    if (s < minDate) minDate = s;
    if (e > maxDate) maxDate = e;
  }
  for (const m of milestones) {
    const ms = m.date.getTime();
    if (ms < minDate) minDate = ms;
    if (ms > maxDate) maxDate = ms;
  }

  if (!isFinite(minDate)) {
    const now = new Date();
    minDate = now.getTime();
    maxDate = addDays(now, 30).getTime();
  }

  // Add padding based on scale
  const padMs = scalePaddingMs(config.timeScale);
  const start = config.startDate ?? new Date(minDate - padMs);
  const end = config.endDate ?? new Date(maxDate + padMs);

  return {
    start: alignToScale(start, config.timeScale, 'floor'),
    end: alignToScale(end, config.timeScale, 'ceil'),
  };
}

/**
 * Generate time slots for the secondary header row.
 */
export function getTimeSlots(start: Date, end: Date, scale: GanttTimeScale): GanttTimeSlot[] {
  const slots: GanttTimeSlot[] = [];
  const now = new Date();
  let cursor = new Date(start);

  while (cursor < end) {
    const slotEnd = nextSlotBoundary(cursor, scale);
    slots.push({
      start: new Date(cursor),
      end: slotEnd > end ? new Date(end) : slotEnd,
      label: formatSlotLabel(cursor, scale),
      isToday: scale !== 'month' && isSameDay(cursor, now),
      isWeekend: scale === 'day' && isWeekend(cursor),
    });
    cursor = slotEnd;
  }

  return slots;
}

function nextSlotBoundary(cursor: Date, scale: GanttTimeScale): Date {
  switch (scale) {
    case 'hour':
      return addHours(cursor, 1);
    case 'day':
      return addDays(cursor, 1);
    case 'week':
      return addDays(cursor, 7);
    case 'month':
      return startOfMonth(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  }
}

function formatSlotLabel(d: Date, scale: GanttTimeScale): string {
  switch (scale) {
    case 'hour':
      return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    case 'day':
      return d.getDate().toString();
    case 'week': {
      const endOfWeek = addDays(d, 6);
      return `${d.getDate()}\u2013${endOfWeek.getDate()}`;
    }
    case 'month':
      return d.toLocaleString(undefined, { month: 'short' });
  }
}

/**
 * Generate primary (grouped) header slots.
 */
export function getPrimarySlots(
  slots: GanttTimeSlot[],
  scale: GanttTimeScale,
): GanttPrimarySlot[] {
  if (slots.length === 0) return [];

  const groups: GanttPrimarySlot[] = [];
  let currentLabel = primaryLabel(slots[0].start, scale);
  let span = 1;

  for (let i = 1; i < slots.length; i++) {
    const label = primaryLabel(slots[i].start, scale);
    if (label === currentLabel) {
      span++;
    } else {
      groups.push({ label: currentLabel, span });
      currentLabel = label;
      span = 1;
    }
  }
  groups.push({ label: currentLabel, span });
  return groups;
}

function primaryLabel(d: Date, scale: GanttTimeScale): string {
  switch (scale) {
    case 'hour':
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    case 'day':
      return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
    case 'week':
      return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
    case 'month':
      return d.getFullYear().toString();
  }
}

/**
 * Compute the percentage left offset of a task in the total timeline.
 */
export function taskLeft(task: GanttTask, rangeStartMs: number, totalMs: number): number {
  return ((task.start.getTime() - rangeStartMs) / totalMs) * 100;
}

/**
 * Compute the percentage width of a task in the total timeline.
 */
export function taskWidth(task: GanttTask, totalMs: number): number {
  return (diffMs(task.start, task.end) / totalMs) * 100;
}

/**
 * Compute the percentage left offset of a milestone.
 */
export function milestoneLeft(date: Date, rangeStartMs: number, totalMs: number): number {
  return ((date.getTime() - rangeStartMs) / totalMs) * 100;
}

/**
 * Snap a date to the nearest grid position based on the scale.
 */
export function snapToGrid(date: Date, scale: GanttTimeScale): Date {
  switch (scale) {
    case 'hour': {
      const d = new Date(date);
      d.setMinutes(Math.round(d.getMinutes() / 15) * 15, 0, 0);
      return d;
    }
    case 'day':
      return startOfDay(date);
    case 'week':
      return startOfWeek(date);
    case 'month':
      return startOfMonth(date);
  }
}

/**
 * Get a default slot width in pixels for a given scale.
 */
export function defaultSlotWidth(scale: GanttTimeScale): number {
  switch (scale) {
    case 'hour':
      return 60;
    case 'day':
      return 40;
    case 'week':
      return 100;
    case 'month':
      return 120;
  }
}

/**
 * Auto-detect the best scale based on the project duration.
 */
export function autoScale(start: Date, end: Date): GanttTimeScale {
  const days = diffMs(start, end) / 86400_000;
  if (days < 7) return 'hour';
  if (days < 90) return 'day';
  if (days < 365) return 'week';
  return 'month';
}

// ── Tree Utilities ──────────────────────────────────────────

interface TreeNode {
  task: GanttTask;
  children: TreeNode[];
}

/**
 * Build a tree structure from a flat task list using `parentId`.
 */
export function buildTaskTree(tasks: GanttTask[]): TreeNode[] {
  const map = new Map<string | number, TreeNode>();
  const roots: TreeNode[] = [];

  for (const task of tasks) {
    map.set(task.id, { task, children: [] });
  }

  for (const task of tasks) {
    const node = map.get(task.id)!;
    if (task.parentId != null && map.has(task.parentId)) {
      map.get(task.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/**
 * Flatten a tree into a visible row list, respecting expanded state.
 */
export function flattenTree(
  tree: TreeNode[],
  expandedIds: Set<string | number>,
  depth = 0,
): GanttFlatRow[] {
  const rows: GanttFlatRow[] = [];

  for (const node of tree) {
    const hasChildren = node.children.length > 0;
    const expanded = hasChildren && expandedIds.has(node.task.id);

    rows.push({ task: node.task, depth, hasChildren, expanded });

    if (expanded) {
      rows.push(...flattenTree(node.children, expandedIds, depth + 1));
    }
  }

  return rows;
}

/**
 * Build an SVG path string for a dependency arrow between two tasks.
 */
export function buildDependencyPath(
  type: string,
  fromLeft: number,
  fromRight: number,
  toLeft: number,
  toRight: number,
  fromY: number,
  toY: number,
): string {
  const offset = 10;

  switch (type) {
    case 'FS': {
      const startX = fromRight;
      const endX = toLeft;
      const midX = startX + offset;
      if (endX > startX + offset * 2) {
        return `M${startX},${fromY} H${midX} V${toY} H${endX}`;
      }
      const midY = (fromY + toY) / 2;
      return `M${startX},${fromY} H${midX} V${midY} H${endX - offset} V${toY} H${endX}`;
    }
    case 'SS': {
      const startX = fromLeft;
      const endX = toLeft;
      const leftMost = Math.min(startX, endX) - offset;
      return `M${startX},${fromY} H${leftMost} V${toY} H${endX}`;
    }
    case 'FF': {
      const startX = fromRight;
      const endX = toRight;
      const rightMost = Math.max(startX, endX) + offset;
      return `M${startX},${fromY} H${rightMost} V${toY} H${endX}`;
    }
    case 'SF': {
      const startX = fromLeft;
      const endX = toRight;
      const midX = startX - offset;
      if (endX < startX - offset * 2) {
        return `M${startX},${fromY} H${midX} V${toY} H${endX}`;
      }
      const midY = (fromY + toY) / 2;
      return `M${startX},${fromY} H${midX} V${midY} H${endX + offset} V${toY} H${endX}`;
    }
    default:
      return '';
  }
}
