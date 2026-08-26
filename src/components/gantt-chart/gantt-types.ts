/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export type GanttTimeScale = 'hour' | 'day' | 'week' | 'month';
export type GanttDependencyType = 'FS' | 'SS' | 'FF' | 'SF';

export interface GanttTask {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  progress?: number; // 0–1
  resourceId?: string | number;
  parentId?: string | number | null;
  color?: string;
  data?: Record<string, unknown>;
}

export interface GanttMilestone {
  id: string | number;
  title: string;
  date: Date;
  color?: string;
}

export interface GanttDependency {
  id: string | number;
  fromId: string | number;
  toId: string | number;
  type: GanttDependencyType;
}

export interface GanttResource {
  id: string | number;
  name: string;
  color?: string;
  avatar?: string;
  data?: Record<string, unknown>;
}

export interface GanttConfig {
  timeScale: GanttTimeScale;
  startDate?: Date;
  endDate?: Date;
  rowHeight: number;
  headerHeight: number;
  taskListWidth: number;
  showCriticalPath: boolean;
  showDependencies: boolean;
  showProgress: boolean;
  showResources: boolean;
  editable: boolean;
  enableVirtualScroll: boolean;
  virtualScrollOverscan: number;
  maxUndoSteps: number;
  theme: 'light' | 'dark' | 'auto';
}

export const GANTT_DEFAULT_CONFIG: GanttConfig = {
  timeScale: 'day',
  rowHeight: 36,
  headerHeight: 32,
  taskListWidth: 300,
  showCriticalPath: false,
  showDependencies: true,
  showProgress: true,
  showResources: true,
  editable: false,
  enableVirtualScroll: false,
  virtualScrollOverscan: 5,
  maxUndoSteps: 50,
  theme: 'auto',
};

// Events
export interface TaskClickEvent {
  task: GanttTask;
  originalEvent: Event;
}
export interface TaskMoveEvent {
  task: GanttTask;
  originalEvent?: Event;
  oldStart: Date;
  oldEnd: Date;
  newStart: Date;
  newEnd: Date;
}
export interface TaskResizeEvent {
  task: GanttTask;
  originalEvent?: Event;
  oldStart: Date;
  oldEnd: Date;
  newStart: Date;
  newEnd: Date;
  edge: 'left' | 'right';
}
export interface MilestoneClickEvent {
  milestone: GanttMilestone;
  originalEvent: Event;
}
export interface DependencyClickEvent {
  dependency: GanttDependency;
  originalEvent: Event;
}
export interface SlotClickEvent {
  date: Date;
  taskId?: string | number;
  originalEvent: Event;
}

export interface GanttCommand {
  execute(): void;
  undo(): void;
  description: string;
}

export interface OverlapPeriod {
  resourceId: string | number;
  start: Date;
  end: Date;
  taskIds: (string | number)[];
}

// Internal
export interface GanttFlatRow {
  task: GanttTask;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
}
export interface GanttTimeSlot {
  start: Date;
  end: Date;
  label: string;
  isToday: boolean;
  isWeekend: boolean;
}
export interface GanttPrimarySlot {
  label: string;
  span: number;
}
