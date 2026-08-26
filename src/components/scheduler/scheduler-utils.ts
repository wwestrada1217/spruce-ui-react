/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type {
  SchedulerDateRestriction,
  SchedulerDayGlyph,
  SchedulerDayGlyphResolver,
  SchedulerEvent,
  SchedulerRecurrenceRule,
  SchedulerRecurrenceWeekday,
  SchedulerUnavailableHourRange,
  DateRange,
  PositionedEvent,
} from './scheduler-types.js';

/* ── Date arithmetic ── */

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addHours(date: Date, hours: number): Date {
  const d = new Date(date);
  d.setTime(d.getTime() + hours * 60 * 60 * 1000);
  return d;
}

export function addMinutes(date: Date, minutes: number): Date {
  const d = new Date(date);
  d.setTime(d.getTime() + minutes * 60 * 1000);
  return d;
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

/* ── Day / week / month boundaries ── */

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function startOfWeek(date: Date, weekStartsOn = 0): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfWeek(date: Date, weekStartsOn = 0): Date {
  return endOfDay(addDays(startOfWeek(date, weekStartsOn), 6));
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

/* ── Comparison helpers ── */

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/* ── Range helpers ── */

export function getDaysInRange(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  let current = startOfDay(start);
  const last = startOfDay(end);
  while (current <= last) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }
  return days;
}

export function getWeekDays(date: Date, weekStartsOn = 0): Date[] {
  const start = startOfWeek(date, weekStartsOn);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function getWorkWeekDays(date: Date, weekStartsOn = 1): Date[] {
  const start = startOfWeek(date, weekStartsOn);
  return Array.from({ length: 5 }, (_, i) => addDays(start, i));
}

export function getMonthCalendarDays(date: Date, weekStartsOn = 0): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calStart = startOfWeek(monthStart, weekStartsOn);
  const calEnd = endOfWeek(monthEnd, weekStartsOn);
  return getDaysInRange(calStart, calEnd);
}

export function getHoursOfDay(startHour = 0, endHour = 24): number[] {
  const hours: number[] = [];
  for (let h = startHour; h < endHour; h++) hours.push(h);
  return hours;
}

/* ── Formatters ── */

export function formatHour(hour: number, locale = 'en-US'): string {
  const value = new Date(2024, 0, 1, hour, 0, 0, 0);
  return value.toLocaleTimeString(locale, { hour: 'numeric' });
}

export function formatDate(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDayHeader(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, { weekday: 'short', day: 'numeric' });
}

export function formatMonthYear(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}

export function formatWeekdayShort(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatTime(date: Date, locale = 'en-US'): string {
  return date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
}

export function getWeekNumber(date: Date, rule: 'iso' | 'locale' = 'iso', weekStartsOn = 0): number {
  const day = startOfDay(date);
  if (rule === 'locale') {
    const first = new Date(day.getFullYear(), 0, 1);
    const firstDay = (first.getDay() - weekStartsOn + 7) % 7;
    return Math.floor((day.getTime() - first.getTime()) / 86_400_000 / 7) + (firstDay < 1 ? 1 : 0) + 1;
  }
  const isoDay = day.getDay() || 7;
  day.setDate(day.getDate() + 4 - isoDay);
  const yearStart = new Date(day.getFullYear(), 0, 1);
  return Math.ceil(((day.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

export function isDateRestricted(date: Date, restrictions: SchedulerDateRestriction[]): boolean {
  const target = startOfDay(date).getTime();
  return restrictions.some((restriction) => {
    if (restriction instanceof Date) return startOfDay(restriction).getTime() === target;
    return startOfDay(restriction.start).getTime() <= target && startOfDay(restriction.end).getTime() >= target;
  });
}

export function schedulerEventKey(event: SchedulerEvent): string {
  return event.occurrenceId ?? String(event.id);
}

export function isAllDayOrLongDuration(event: SchedulerEvent, thresholdHours = 24): boolean {
  return Boolean(event.allDay) || event.end.getTime() - event.start.getTime() >= thresholdHours * 3_600_000;
}

export function hasEventConflict(
  target: Pick<SchedulerEvent, 'id' | 'start' | 'end' | 'resourceId'>,
  events: SchedulerEvent[],
): boolean {
  return events.some((event) => {
    if (event.id === target.id || event.occurrenceId === target.id) return false;
    if (target.resourceId !== undefined && event.resourceId !== target.resourceId) return false;
    return event.start < target.end && event.end > target.start;
  });
}

export function isHourUnavailable(
  date: Date,
  hour: number,
  ranges: SchedulerUnavailableHourRange[],
): SchedulerUnavailableHourRange | undefined {
  const weekdays: SchedulerRecurrenceWeekday[] = [
    'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
  ];
  return ranges.find((range) =>
    hour >= range.startHour && hour < range.endHour &&
    (!range.daysOfWeek || range.daysOfWeek.includes(weekdays[date.getDay()])),
  );
}

export function resolveDayGlyphs(
  resolver: SchedulerDayGlyphResolver | null | undefined,
  date: Date,
): SchedulerDayGlyph[] {
  if (!resolver) return [];
  const key = startOfDay(date).toISOString().slice(0, 10);
  const value = typeof resolver === 'function'
    ? resolver(date)
    : resolver instanceof Map
      ? resolver.get(key)
      : resolver[key];
  return value ? (Array.isArray(value) ? value : [value]) : [];
}

/** Expand recurrence metadata into immutable occurrence objects for a display window. */
export function expandRecurringEvents(
  events: SchedulerEvent[],
  range: DateRange,
): SchedulerEvent[] {
  const weekdays: SchedulerRecurrenceWeekday[] = [
    'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
  ];
  const result: SchedulerEvent[] = [];
  for (const event of events) {
    const recurrence = event.recurrence;
    if (!recurrence || recurrence === 'none') {
      result.push(event);
      continue;
    }
    const rule: SchedulerRecurrenceRule = typeof recurrence === 'string'
      ? { frequency: recurrence, interval: 1 }
      : { ...recurrence, interval: recurrence.interval ?? 1 };
    const duration = event.end.getTime() - event.start.getTime();
    const anchor = new Date(event.start);
    let cursor = new Date(anchor);
    let generated = 0;
    let occurrenceIndex = 0;
    const maxOccurrences = rule.count ?? 500;
    while (cursor < range.end && generated < maxOccurrences && occurrenceIndex < 500) {
      const isAllowedWeekday = !rule.daysOfWeek || rule.daysOfWeek.includes(weekdays[cursor.getDay()]);
      const weekDistance = Math.floor((startOfDay(cursor).getTime() - startOfWeek(anchor).getTime()) / 86_400_000 / 7);
      const isAllowedWeek = rule.frequency !== 'weekly' || !rule.daysOfWeek || weekDistance % (rule.interval ?? 1) === 0;
      const isExcluded = rule.excludedDates?.some((excluded) => isSameDay(excluded, cursor)) ?? false;
      const isBeforeEnd = !rule.endDate || cursor <= rule.endDate;
      if (isBeforeEnd && isAllowedWeekday && isAllowedWeek && !isExcluded) {
        const occurrenceEnd = new Date(cursor.getTime() + duration);
        if (occurrenceEnd > range.start && cursor < range.end) {
          result.push({
            ...event,
            id: occurrenceIndex === 0 ? event.id : `${String(event.id)}:${occurrenceIndex}`,
            start: new Date(cursor),
            end: occurrenceEnd,
            occurrenceId: occurrenceIndex === 0 ? `${String(event.id)}:0` : `${String(event.id)}:${occurrenceIndex}`,
            recurringEventId: event.recurringEventId ?? event.id,
            recurrence: event.recurrence,
          });
        }
        generated += 1;
      }
      occurrenceIndex += 1;
      if (rule.frequency === 'daily') cursor = addDays(cursor, rule.interval ?? 1);
      else if (rule.frequency === 'weekly' && !rule.daysOfWeek) cursor = addDays(cursor, 7 * (rule.interval ?? 1));
      else if (rule.frequency === 'monthly') cursor = addMonths(cursor, rule.interval ?? 1);
      else if (rule.frequency === 'yearly') cursor = new Date(cursor.getFullYear() + (rule.interval ?? 1), cursor.getMonth(), cursor.getDate(), cursor.getHours(), cursor.getMinutes(), cursor.getSeconds(), cursor.getMilliseconds());
      else cursor = addDays(cursor, 1);
    }
  }
  return result;
}

/* ── Event helpers ── */

export function eventsOverlap(a: SchedulerEvent, b: SchedulerEvent): boolean {
  return a.start < b.end && a.end > b.start;
}

export function getEventsForDay(events: SchedulerEvent[], date: Date): SchedulerEvent[] {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  return events.filter(e => e.start < dayEnd && e.end > dayStart);
}

export function getEventsForRange(events: SchedulerEvent[], range: DateRange): SchedulerEvent[] {
  return events.filter(e => e.start < range.end && e.end > range.start);
}

/* ── Layout: compute overlapping column positions ── */

function buildOverlapGroups(sortedEvents: SchedulerEvent[]): SchedulerEvent[][] {
  const groups: SchedulerEvent[][] = [];
  let currentGroup: SchedulerEvent[] = [];
  let groupEnd = new Date(0);

  for (const event of sortedEvents) {
    if (currentGroup.length === 0 || event.start < groupEnd) {
      currentGroup.push(event);
      if (event.end > groupEnd) groupEnd = event.end;
    } else {
      groups.push(currentGroup);
      currentGroup = [event];
      groupEnd = event.end;
    }
  }
  if (currentGroup.length) groups.push(currentGroup);
  return groups;
}

export function layoutEventsForDay(events: SchedulerEvent[]): PositionedEvent[] {
  if (!events.length) return [];

  const sorted = [...events].sort(
    (a, b) => a.start.getTime() - b.start.getTime() || b.end.getTime() - a.end.getTime(),
  );
  const columns: SchedulerEvent[][] = [];
  const result: PositionedEvent[] = [];

  for (const event of sorted) {
    let placed = false;
    for (let col = 0; col < columns.length; col++) {
      const lastInCol = columns[col][columns[col].length - 1];
      if (lastInCol.end <= event.start) {
        columns[col].push(event);
        placed = true;
        result.push({ event, column: col, totalColumns: 0 });
        break;
      }
    }
    if (!placed) {
      columns.push([event]);
      result.push({ event, column: columns.length - 1, totalColumns: 0 });
    }
  }

  // Compute totalColumns per overlap group
  const groups = buildOverlapGroups(sorted);
  for (const group of groups) {
    const groupIds = new Set(group.map(e => e.id));
    const maxCol =
      result.filter(r => groupIds.has(r.event.id)).reduce((max, r) => Math.max(max, r.column), 0) + 1;
    for (const r of result) {
      if (groupIds.has(r.event.id)) r.totalColumns = maxCol;
    }
  }

  return result;
}

export function getTopAndHeight(
  event: SchedulerEvent,
  dayDate: Date,
  startHour: number,
  endHour: number,
): { top: number; height: number } {
  const dayStart = new Date(dayDate);
  dayStart.setHours(startHour, 0, 0, 0);
  const totalMinutes = (endHour - startHour) * 60;

  const eventStart = event.start < dayStart ? dayStart : event.start;
  const dayEnd = new Date(dayDate);
  dayEnd.setHours(endHour, 0, 0, 0);
  const eventEnd = event.end > dayEnd ? dayEnd : event.end;

  const startMin = (eventStart.getTime() - dayStart.getTime()) / 60000;
  const durationMin = (eventEnd.getTime() - eventStart.getTime()) / 60000;

  return {
    top: (startMin / totalMinutes) * 100,
    height: Math.max((durationMin / totalMinutes) * 100, 1.5),
  };
}
