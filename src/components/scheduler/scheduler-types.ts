/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export type SchedulerView = 'day' | 'week' | 'workWeek' | 'month' | 'agenda' | 'year' | 'timeline';

export interface SchedulerEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resourceId?: string | number;
  color?: string;
  description?: string;
  data?: Record<string, unknown>;
}

export interface SchedulerResource {
  id: string | number;
  name: string;
  color?: string;
  avatar?: string;
}

export interface SchedulerSlot {
  date: Date;
  hour?: number;
  minute?: number;
  resourceId?: string | number;
}

export interface EventClickEvent {
  event: SchedulerEvent;
  nativeEvent: MouseEvent;
}

export interface SlotClickEvent {
  slot: SchedulerSlot;
  nativeEvent: MouseEvent;
}

export interface EventMoveEvent {
  event: SchedulerEvent;
  oldStart: Date;
  oldEnd: Date;
  newStart: Date;
  newEnd: Date;
  newResourceId?: string | number;
}

export interface EventResizeEvent {
  event: SchedulerEvent;
  oldStart: Date;
  oldEnd: Date;
  newStart: Date;
  newEnd: Date;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface PositionedEvent {
  event: SchedulerEvent;
  column: number;
  totalColumns: number;
  top?: number;
  height?: number;
}
