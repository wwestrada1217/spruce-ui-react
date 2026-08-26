/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export type SchedulerView = 'day' | 'week' | 'workWeek' | 'month' | 'agenda' | 'year' | 'timeline';

export type SchedulerRecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type SchedulerRecurrence = 'none' | SchedulerRecurrenceFrequency;
export type SchedulerCalendarId = string | number;
export type SchedulerCalendarControls = 'popover' | 'sidebar' | 'none';
export type SchedulerWeekNumberRule = 'iso' | 'locale';
export type SchedulerTimeScale = 5 | 6 | 10 | 15 | 30 | 60;
export type SchedulerTimelineScale = 'time' | 'day' | 'week' | 'month' | 'year';
export type SchedulerRecurrenceWeekday =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export interface SchedulerDayGlyph {
  icon?: string;
  avatarUrl?: string;
  label?: string;
  color?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  ariaLabel?: string;
}

export interface SchedulerDayGlyphConfig {
  iconSize?: number;
  showLabels?: boolean;
  layout?: 'inline' | 'stacked';
  tone?: 'semantic' | 'muted';
}

export type SchedulerDayGlyphResolver =
  | ((date: Date) => SchedulerDayGlyph | SchedulerDayGlyph[] | null | undefined)
  | Record<string, SchedulerDayGlyph | SchedulerDayGlyph[]>
  | Map<string, SchedulerDayGlyph | SchedulerDayGlyph[]>;

export interface SchedulerRecurrenceRule {
  frequency: SchedulerRecurrenceFrequency;
  interval?: number;
  daysOfWeek?: SchedulerRecurrenceWeekday[];
  excludedDates?: Date[];
  endDate?: Date | null;
  count?: number | null;
}

export interface SchedulerCalendar {
  id: SchedulerCalendarId;
  name: string;
  color: string;
  disabled?: boolean;
  data?: Record<string, unknown>;
}

export interface SchedulerEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resourceId?: string | number;
  calendarId?: SchedulerCalendarId;
  color?: string;
  availability?: 'busy' | 'free' | 'tentative' | 'outOfOffice';
  visibility?: 'public' | 'private';
  reminderMinutes?: number | null;
  location?: string;
  category?: string;
  timezone?: string;
  description?: string;
  recurrence?: SchedulerRecurrence | SchedulerRecurrenceRule;
  occurrenceId?: string;
  recurringEventId?: string | number;
  data?: Record<string, unknown>;
}

export interface SchedulerResource {
  id: string | number;
  name: string;
  group?: string;
  color?: string;
  avatar?: string;
  data?: Record<string, unknown>;
}

export interface SchedulerSlot {
  date: Date;
  hour?: number;
  minute?: number;
  allDay?: boolean;
  resourceId?: string | number;
}

export interface EventClickEvent {
  event: SchedulerEvent;
  nativeEvent: MouseEvent | KeyboardEvent | Event;
}

export interface SlotClickEvent {
  slot: SchedulerSlot;
  nativeEvent: MouseEvent | KeyboardEvent | Event;
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

export interface SchedulerDateRange {
  start: Date;
  end: Date;
}

export type SchedulerDateRestriction = Date | SchedulerDateRange;

export interface SchedulerUnavailableHourRange {
  startHour: number;
  endHour: number;
  daysOfWeek?: SchedulerRecurrenceWeekday[];
  label?: string;
  background?: string;
  cssClass?: string;
}

export interface PositionedEvent {
  event: SchedulerEvent;
  column: number;
  totalColumns: number;
  top?: number;
  height?: number;
}
