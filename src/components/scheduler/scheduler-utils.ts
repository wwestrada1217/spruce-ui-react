import type { SchedulerEvent, DateRange, PositionedEvent } from './scheduler-types';

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

export function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDayHeader(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function formatWeekdayShort(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
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
