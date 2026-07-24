import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import './Scheduler.css';
import { Icon } from '../../icons/Icon.js';
import type {
  SchedulerView,
  SchedulerEvent,
  SchedulerResource,
  SchedulerSlot,
  EventClickEvent,
  SlotClickEvent,
  EventMoveEvent,
  EventResizeEvent,
  PositionedEvent,
} from './scheduler-types';
import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  startOfDay,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
  getWeekDays,
  getWorkWeekDays,
  getMonthCalendarDays,
  getHoursOfDay,
  getEventsForDay,
  getEventsForRange,
  layoutEventsForDay,
  getTopAndHeight,
  formatHour,
  formatDate,
  formatDayHeader,
  formatMonthYear,
  formatTime,
} from './scheduler-utils';

/* ── View labels ── */

const VIEW_LABELS: Record<SchedulerView, string> = {
  day: 'Day',
  week: 'Week',
  workWeek: 'Work Week',
  month: 'Month',
  agenda: 'Agenda',
  year: 'Year',
  timeline: 'Timeline',
};

const ALL_VIEWS: SchedulerView[] = ['day', 'week', 'workWeek', 'month', 'agenda', 'year', 'timeline'];

/* ── Props ── */

export interface SchedulerProps {
  events?: SchedulerEvent[];
  resources?: SchedulerResource[];
  view?: SchedulerView;
  currentDate?: Date;
  startHour?: number;
  endHour?: number;
  agendaDays?: number;
  timelineDays?: number;
  views?: SchedulerView[];
  onEventClick?: (e: EventClickEvent) => void;
  onSlotClick?: (e: SlotClickEvent) => void;
  onEventMove?: (e: EventMoveEvent) => void;
  onEventResize?: (e: EventResizeEvent) => void;
  onViewChange?: (view: SchedulerView) => void;
  onDateChange?: (date: Date) => void;
}

/* ══════════════════════════════════════════════════
   Scheduler
   ══════════════════════════════════════════════════ */

export function Scheduler({
  events = [],
  resources = [],
  view = 'week',
  currentDate: currentDateProp,
  startHour = 0,
  endHour = 24,
  agendaDays = 7,
  timelineDays = 1,
  views = ALL_VIEWS,
  onEventClick,
  onSlotClick,
  onEventMove,
  onEventResize,
  onViewChange,
  onDateChange,
}: SchedulerProps) {
  const [activeView, setActiveView] = useState<SchedulerView>(view);
  const [currentDate, setCurrentDate] = useState<Date>(currentDateProp ?? new Date());

  /* Sync when props change */
  useEffect(() => { setActiveView(view); }, [view]);
  useEffect(() => { if (currentDateProp) setCurrentDate(currentDateProp); }, [currentDateProp]);

  /* ── Navigation ── */

  const handleSetView = useCallback((v: SchedulerView) => {
    setActiveView(v);
    onViewChange?.(v);
  }, [onViewChange]);

  const handleToday = useCallback(() => {
    const now = new Date();
    setCurrentDate(now);
    onDateChange?.(now);
  }, [onDateChange]);

  const handlePrev = useCallback(() => {
    setCurrentDate(prev => {
      let next: Date;
      switch (activeView) {
        case 'day': next = addDays(prev, -1); break;
        case 'week':
        case 'workWeek': next = addDays(prev, -7); break;
        case 'month': next = addMonths(prev, -1); break;
        case 'agenda': next = addDays(prev, -agendaDays); break;
        case 'year': next = new Date(prev.getFullYear() - 1, prev.getMonth(), prev.getDate()); break;
        case 'timeline': next = addDays(prev, -timelineDays); break;
        default: next = addDays(prev, -1);
      }
      onDateChange?.(next);
      return next;
    });
  }, [activeView, agendaDays, timelineDays, onDateChange]);

  const handleNext = useCallback(() => {
    setCurrentDate(prev => {
      let next: Date;
      switch (activeView) {
        case 'day': next = addDays(prev, 1); break;
        case 'week':
        case 'workWeek': next = addDays(prev, 7); break;
        case 'month': next = addMonths(prev, 1); break;
        case 'agenda': next = addDays(prev, agendaDays); break;
        case 'year': next = new Date(prev.getFullYear() + 1, prev.getMonth(), prev.getDate()); break;
        case 'timeline': next = addDays(prev, timelineDays); break;
        default: next = addDays(prev, 1);
      }
      onDateChange?.(next);
      return next;
    });
  }, [activeView, agendaDays, timelineDays, onDateChange]);

  /* ── Title ── */

  const title = useMemo(() => {
    switch (activeView) {
      case 'day':
        return formatDate(currentDate);
      case 'week':
      case 'workWeek': {
        const ws = startOfWeek(currentDate);
        const we = endOfWeek(currentDate);
        if (ws.getMonth() === we.getMonth()) {
          return `${ws.toLocaleDateString(undefined, { month: 'long' })} ${ws.getDate()} \u2013 ${we.getDate()}, ${ws.getFullYear()}`;
        }
        return `${ws.toLocaleDateString(undefined, { month: 'short' })} ${ws.getDate()} \u2013 ${we.toLocaleDateString(undefined, { month: 'short' })} ${we.getDate()}, ${we.getFullYear()}`;
      }
      case 'month':
        return formatMonthYear(currentDate);
      case 'agenda':
        return `Agenda: ${formatDate(currentDate)}`;
      case 'year':
        return `${currentDate.getFullYear()}`;
      case 'timeline':
        return formatDate(currentDate);
      default:
        return formatDate(currentDate);
    }
  }, [activeView, currentDate]);

  /* ── View options ── */

  const viewOptions = useMemo(
    () => views.map(v => ({ value: v, label: VIEW_LABELS[v] })),
    [views],
  );

  /* ── Render ── */

  return (
    <div className={`sp-sch sp-sch--${activeView}`}>
      {/* Toolbar */}
      <div className="sp-sch__toolbar" role="toolbar" aria-label="Scheduler toolbar">
        <div className="sp-sch__toolbar-nav">
          <button className="sp-sch__btn" onClick={handleToday} aria-label="Go to today">Today</button>
          <button className="sp-sch__btn sp-sch__btn--icon" onClick={handlePrev} aria-label="Previous">
            <Icon name="chevron-left" size={16} />
          </button>
          <button className="sp-sch__btn sp-sch__btn--icon" onClick={handleNext} aria-label="Next">
            <Icon name="chevron-right" size={16} />
          </button>
          <span className="sp-sch__title">{title}</span>
        </div>

        <div className="sp-sch__toolbar-views" role="tablist" aria-label="Calendar views">
          {viewOptions.map(v => (
            <button
              key={v.value}
              className={`sp-sch__view-btn${v.value === activeView ? ' sp-sch__view-btn--active' : ''}`}
              onClick={() => handleSetView(v.value)}
              role="tab"
              aria-selected={v.value === activeView}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="sp-sch__content">
        {(activeView === 'day' || activeView === 'week' || activeView === 'workWeek') && (
          <DayView
            mode={activeView}
            currentDate={currentDate}
            events={events}
            resources={resources}
            startHour={startHour}
            endHour={endHour}
            onEventClick={onEventClick}
            onSlotClick={onSlotClick}
            onEventMove={onEventMove}
            onEventResize={onEventResize}
          />
        )}
        {activeView === 'month' && (
          <MonthView
            currentDate={currentDate}
            events={events}
            onEventClick={onEventClick}
            onSlotClick={onSlotClick}
          />
        )}
        {activeView === 'agenda' && (
          <AgendaView
            currentDate={currentDate}
            events={events}
            daysToShow={agendaDays}
            onEventClick={onEventClick}
          />
        )}
        {activeView === 'year' && (
          <YearView
            currentDate={currentDate}
            events={events}
            onEventClick={onEventClick}
            onSlotClick={onSlotClick}
          />
        )}
        {activeView === 'timeline' && (
          <TimelineView
            currentDate={currentDate}
            events={events}
            resources={resources}
            numberOfDays={timelineDays}
            startHour={startHour}
            endHour={endHour}
            onEventClick={onEventClick}
            onSlotClick={onSlotClick}
            onEventMove={onEventMove}
            onEventResize={onEventResize}
          />
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   DayView (day / week / workWeek)
   ══════════════════════════════════════════════════ */

interface DayViewProps {
  mode: 'day' | 'week' | 'workWeek';
  currentDate: Date;
  events: SchedulerEvent[];
  resources: SchedulerResource[];
  startHour: number;
  endHour: number;
  onEventClick?: (e: EventClickEvent) => void;
  onSlotClick?: (e: SlotClickEvent) => void;
  onEventMove?: (e: EventMoveEvent) => void;
  onEventResize?: (e: EventResizeEvent) => void;
}

function DayView({
  mode,
  currentDate,
  events,
  startHour,
  endHour,
  onEventClick,
  onSlotClick,
  onEventMove,
  onEventResize,
}: DayViewProps) {
  const scrollBodyRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(new Date());
  const [dragState, setDragState] = useState<{
    eventId: string | number;
    title: string;
    time: string;
    color: string;
    x: number;
    y: number;
  } | null>(null);

  /* Rerender refs for drag/resize (avoid stale closures) */
  const dragRef = useRef<{
    event: SchedulerEvent;
    origStart: Date;
    origEnd: Date;
    startY: number;
  } | null>(null);

  const resizeRef = useRef<{
    event: SchedulerEvent;
    edge: 'top' | 'bottom';
    origStart: Date;
    origEnd: Date;
    startY: number;
  } | null>(null);

  /* Update current time every minute */
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  /* Scroll to current time on mount */
  useEffect(() => {
    const body = scrollBodyRef.current;
    if (!body) return;
    const nowDate = new Date();
    const minutes = nowDate.getHours() * 60 + nowDate.getMinutes() - startHour * 60;
    const totalMin = (endHour - startHour) * 60;
    const pct = minutes / totalMin;
    const grid = body.querySelector('.sp-sch-dayview__grid') as HTMLElement | null;
    if (grid) body.scrollTop = pct * grid.offsetHeight - body.offsetHeight / 3;
  }, [startHour, endHour]);

  const hours = useMemo(() => getHoursOfDay(startHour, endHour), [startHour, endHour]);

  const days = useMemo(() => {
    switch (mode) {
      case 'week': return getWeekDays(currentDate);
      case 'workWeek': return getWorkWeekDays(currentDate);
      default: return [startOfDay(currentDate)];
    }
  }, [mode, currentDate]);

  const hasAllDay = useMemo(() => events.some(e => e.allDay), [events]);

  const currentTimeTop = useMemo(() => {
    const totalMin = (endHour - startHour) * 60;
    const nowMin = now.getHours() * 60 + now.getMinutes() - startHour * 60;
    if (nowMin < 0 || nowMin > totalMin) return -1;
    return (nowMin / totalMin) * 100;
  }, [now, startHour, endHour]);

  const hourTop = useCallback(
    (h: number) => ((h - startHour) / hours.length) * 100,
    [startHour, hours.length],
  );

  const hourHeight = useMemo(() => 100 / hours.length, [hours.length]);

  const getAllDayEventsForDay = useCallback(
    (day: Date) => getEventsForDay(events.filter(e => e.allDay), day),
    [events],
  );

  const getTimedLayout = useCallback(
    (day: Date): (PositionedEvent & { top: number; height: number })[] => {
      const timed = getEventsForDay(events.filter(e => !e.allDay), day);
      const positioned = layoutEventsForDay(timed);
      return positioned.map(p => {
        const pos = getTopAndHeight(p.event, day, startHour, endHour);
        return { ...p, top: pos.top, height: pos.height };
      });
    },
    [events, startHour, endHour],
  );

  const handleEventClick = useCallback(
    (nativeEvent: React.MouseEvent, event: SchedulerEvent) => {
      nativeEvent.stopPropagation();
      onEventClick?.({ event, nativeEvent: nativeEvent.nativeEvent });
    },
    [onEventClick],
  );

  const handleSlotClick = useCallback(
    (nativeEvent: React.MouseEvent, day: Date, hour: number, minute: number) => {
      const slot: SchedulerSlot = { date: day, hour, minute };
      onSlotClick?.({ slot, nativeEvent: nativeEvent.nativeEvent });
    },
    [onSlotClick],
  );

  const handleSlotClickFromPosition = useCallback(
    (e: React.MouseEvent, day: Date) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const pct = (e.clientY - rect.top) / rect.height;
      const totalMin = (endHour - startHour) * 60;
      const min = Math.round((pct * totalMin) / 15) * 15;
      const hour = Math.floor(min / 60) + startHour;
      const minute = min % 60;
      handleSlotClick(e, day, hour, minute);
    },
    [endHour, startHour, handleSlotClick],
  );

  /* ── Drag to move ── */

  const handleEventDragStart = useCallback(
    (e: React.MouseEvent, event: SchedulerEvent) => {
      if ((e.target as HTMLElement).classList.contains('sp-sch-event__resize')) return;
      e.preventDefault();
      e.stopPropagation();

      dragRef.current = {
        event,
        origStart: new Date(event.start),
        origEnd: new Date(event.end),
        startY: e.clientY,
      };
      setDragState({
        eventId: event.id,
        title: event.title,
        time: `${formatTime(event.start)} \u2013 ${formatTime(event.end)}`,
        color: event.color || 'var(--sp-primary)',
        x: e.clientX,
        y: e.clientY,
      });

      const onMouseMove = (me: MouseEvent) => {
        const dr = dragRef.current;
        if (!dr) return;
        const body = scrollBodyRef.current;
        if (!body) return;
        const grid = body.querySelector('.sp-sch-dayview__grid') as HTMLElement | null;
        if (!grid) return;
        const gridHeight = grid.offsetHeight;
        const totalMin = (endHour - startHour) * 60;
        const dy = me.clientY - dr.startY;
        const deltaMin = Math.round((dy / gridHeight) * totalMin / 15) * 15;
        const newStart = addMinutes(dr.origStart, deltaMin);
        const newEnd = addMinutes(dr.origEnd, deltaMin);
        dr.event.start = newStart;
        dr.event.end = newEnd;
        setDragState({
          eventId: dr.event.id,
          title: dr.event.title,
          time: `${formatTime(newStart)} \u2013 ${formatTime(newEnd)}`,
          color: dr.event.color || 'var(--sp-primary)',
          x: me.clientX,
          y: me.clientY,
        });
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        const dr = dragRef.current;
        if (dr && dr.event.start.getTime() !== dr.origStart.getTime()) {
          onEventMove?.({
            event: dr.event,
            oldStart: dr.origStart,
            oldEnd: dr.origEnd,
            newStart: new Date(dr.event.start),
            newEnd: new Date(dr.event.end),
          });
        }
        dragRef.current = null;
        setDragState(null);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [startHour, endHour, onEventMove],
  );

  /* ── Resize ── */

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, event: SchedulerEvent, edge: 'top' | 'bottom') => {
      e.preventDefault();
      e.stopPropagation();

      resizeRef.current = {
        event,
        edge,
        origStart: new Date(event.start),
        origEnd: new Date(event.end),
        startY: e.clientY,
      };
      setDragState({
        eventId: event.id,
        title: event.title,
        time: `${formatTime(event.start)} \u2013 ${formatTime(event.end)}`,
        color: event.color || 'var(--sp-primary)',
        x: e.clientX,
        y: e.clientY,
      });

      const onMouseMove = (me: MouseEvent) => {
        const rr = resizeRef.current;
        if (!rr) return;
        const body = scrollBodyRef.current;
        if (!body) return;
        const grid = body.querySelector('.sp-sch-dayview__grid') as HTMLElement | null;
        if (!grid) return;
        const gridHeight = grid.offsetHeight;
        const totalMin = (endHour - startHour) * 60;
        const dy = me.clientY - rr.startY;
        const deltaMin = Math.round((dy / gridHeight) * totalMin / 15) * 15;

        if (rr.edge === 'bottom') {
          const newEnd = addMinutes(rr.origEnd, deltaMin);
          if (newEnd > rr.event.start) rr.event.end = newEnd;
        } else {
          const newStart = addMinutes(rr.origStart, deltaMin);
          if (newStart < rr.event.end) rr.event.start = newStart;
        }

        setDragState({
          eventId: rr.event.id,
          title: rr.event.title,
          time: `${formatTime(rr.event.start)} \u2013 ${formatTime(rr.event.end)}`,
          color: rr.event.color || 'var(--sp-primary)',
          x: me.clientX,
          y: me.clientY,
        });
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        const rr = resizeRef.current;
        if (
          rr &&
          (rr.event.start.getTime() !== rr.origStart.getTime() ||
            rr.event.end.getTime() !== rr.origEnd.getTime())
        ) {
          onEventResize?.({
            event: rr.event,
            oldStart: rr.origStart,
            oldEnd: rr.origEnd,
            newStart: new Date(rr.event.start),
            newEnd: new Date(rr.event.end),
          });
        }
        resizeRef.current = null;
        setDragState(null);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [startHour, endHour, onEventResize],
  );

  return (
    <div className="sp-sch-dayview" role="grid" aria-label="Schedule day view">
      <div className="sp-sch-dayview__body" ref={scrollBodyRef}>
        {/* Column headers */}
        <div className="sp-sch-dayview__header" role="row">
          <div className="sp-sch-dayview__time-gutter-hd" role="columnheader" />
          {days.map(day => (
            <div
              key={day.toISOString()}
              className={`sp-sch-dayview__col-hd${isToday(day) ? ' sp-sch-dayview__col-hd--today' : ''}`}
              role="columnheader"
            >
              <span className="sp-sch-dayview__day-name">{formatDayHeader(day)}</span>
              <span className={`sp-sch-dayview__day-num${isToday(day) ? ' sp-sch-dayview__day-num--today' : ''}`}>
                {day.getDate()}
              </span>
            </div>
          ))}
        </div>

        {/* All-day row */}
        {hasAllDay && (
          <div className="sp-sch-dayview__allday-row" role="row">
            <div className="sp-sch-dayview__allday-label">all-day</div>
            {days.map(day => (
              <div
                key={day.toISOString()}
                className="sp-sch-dayview__allday-cell"
                role="gridcell"
                onClick={e => handleSlotClick(e, day, 0, 0)}
              >
                {getAllDayEventsForDay(day).map(ev => (
                  <div
                    key={ev.id}
                    className="sp-sch-event sp-sch-event--allday"
                    style={{ background: ev.color || 'var(--sp-primary)' }}
                    onClick={e => handleEventClick(e, ev)}
                    role="button"
                    tabIndex={0}
                    aria-label={ev.title}
                  >
                    {ev.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Time grid */}
        <div
          className="sp-sch-dayview__grid"
          style={{ '--hour-count': hours.length } as React.CSSProperties}
        >
          {/* Time gutter */}
          <div className="sp-sch-dayview__time-col">
            {hours.map(h => (
              <div key={h} className="sp-sch-dayview__time-gutter" style={{ top: `${hourTop(h)}%` }}>
                {formatHour(h)}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map(day => (
            <div
              key={day.toISOString()}
              className={`sp-sch-dayview__day-col${isToday(day) ? ' sp-sch-dayview__day-col--today' : ''}`}
              role="gridcell"
              onClick={e => handleSlotClickFromPosition(e, day)}
            >
              {/* Hour grid lines */}
              {hours.map(h => (
                <div
                  key={h}
                  className="sp-sch-dayview__hour-slot"
                  style={{ top: `${hourTop(h)}%`, height: `${hourHeight}%` }}
                />
              ))}

              {/* Timed events */}
              {getTimedLayout(day).map(pe => (
                <div
                  key={pe.event.id}
                  className={`sp-sch-event sp-sch-event--timed${dragState?.eventId === pe.event.id ? ' sp-sch-event--dragging' : ''}`}
                  style={{
                    top: `${pe.top}%`,
                    height: `${pe.height}%`,
                    left: `${(pe.column / pe.totalColumns) * 100}%`,
                    width: `${(1 / pe.totalColumns) * 100 - 1}%`,
                    '--ev-color': pe.event.color || 'var(--sp-primary)',
                  } as React.CSSProperties}
                  role="button"
                  tabIndex={0}
                  aria-label={`${pe.event.title} from ${formatTime(pe.event.start)} to ${formatTime(pe.event.end)}`}
                  onMouseDown={e => handleEventDragStart(e, pe.event)}
                  onClick={e => handleEventClick(e, pe.event)}
                >
                  <div
                    className="sp-sch-event__resize sp-sch-event__resize--top"
                    onMouseDown={e => handleResizeStart(e, pe.event, 'top')}
                  />
                  <div className="sp-sch-event__title">{pe.event.title}</div>
                  <div className="sp-sch-event__time">
                    {formatTime(pe.event.start)} &ndash; {formatTime(pe.event.end)}
                  </div>
                  <div
                    className="sp-sch-event__resize sp-sch-event__resize--bottom"
                    onMouseDown={e => handleResizeStart(e, pe.event, 'bottom')}
                  />
                </div>
              ))}

              {/* Current time indicator */}
              {isToday(day) && currentTimeTop >= 0 && (
                <div className="sp-sch-dayview__now" style={{ top: `${currentTimeTop}%` }}>
                  <div className="sp-sch-dayview__now-dot" />
                  <div className="sp-sch-dayview__now-line" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Drag preview ghost */}
      {dragState && (
        <div
          className="sp-sch-drag-preview"
          style={{
            top: dragState.y,
            left: dragState.x,
            '--ev-color': dragState.color,
          } as React.CSSProperties}
        >
          <div className="sp-sch-drag-preview__title">{dragState.title}</div>
          <div className="sp-sch-drag-preview__time">{dragState.time}</div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MonthView
   ══════════════════════════════════════════════════ */

interface MonthViewProps {
  currentDate: Date;
  events: SchedulerEvent[];
  onEventClick?: (e: EventClickEvent) => void;
  onSlotClick?: (e: SlotClickEvent) => void;
}

const MONTH_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_VISIBLE_EVENTS = 3;

function MonthView({ currentDate, events, onEventClick, onSlotClick }: MonthViewProps) {
  const weeks = useMemo(() => {
    const all = getMonthCalendarDays(currentDate);
    const result: Date[][] = [];
    for (let i = 0; i < all.length; i += 7) result.push(all.slice(i, i + 7));
    return result;
  }, [currentDate]);

  const dayEvents = useCallback(
    (day: Date) => getEventsForDay(events, day),
    [events],
  );

  const handleCellClick = useCallback(
    (e: React.MouseEvent, day: Date) => {
      const slot: SchedulerSlot = { date: startOfDay(day), hour: 0, minute: 0 };
      onSlotClick?.({ slot, nativeEvent: e.nativeEvent });
    },
    [onSlotClick],
  );

  const handleEventClick = useCallback(
    (e: React.MouseEvent, ev: SchedulerEvent) => {
      e.stopPropagation();
      onEventClick?.({ event: ev, nativeEvent: e.nativeEvent });
    },
    [onEventClick],
  );

  return (
    <div className="sp-sch-month" role="grid" aria-label={`Calendar for ${formatMonthYear(currentDate)}`}>
      <div className="sp-sch-month__header" role="row">
        {MONTH_WEEKDAYS.map(wd => (
          <div key={wd} className="sp-sch-month__weekday" role="columnheader">{wd}</div>
        ))}
      </div>

      <div className="sp-sch-month__body">
        {weeks.map((week, wi) => (
          <div key={wi} className="sp-sch-month__week" role="row">
            {week.map(day => {
              const evs = dayEvents(day);
              return (
                <div
                  key={day.toISOString()}
                  className={
                    'sp-sch-month__cell' +
                    (!isSameMonth(day, currentDate) ? ' sp-sch-month__cell--other' : '') +
                    (isToday(day) ? ' sp-sch-month__cell--today' : '')
                  }
                  role="gridcell"
                  onClick={e => handleCellClick(e, day)}
                >
                  <span className={`sp-sch-month__day-num${isToday(day) ? ' sp-sch-month__day-num--today' : ''}`}>
                    {day.getDate()}
                  </span>
                  <div className="sp-sch-month__events">
                    {evs.slice(0, MAX_VISIBLE_EVENTS).map(ev => (
                      <div
                        key={ev.id}
                        className="sp-sch-month__ev"
                        style={{ '--ev-color': ev.color || 'var(--sp-primary)' } as React.CSSProperties}
                        onClick={e => handleEventClick(e, ev)}
                        role="button"
                        tabIndex={0}
                        aria-label={ev.title}
                      >
                        {ev.allDay ? (
                          <span className="sp-sch-month__ev-bar">{ev.title}</span>
                        ) : (
                          <>
                            <span className="sp-sch-month__ev-dot" />
                            <span className="sp-sch-month__ev-text">{ev.title}</span>
                          </>
                        )}
                      </div>
                    ))}
                    {evs.length > MAX_VISIBLE_EVENTS && (
                      <div className="sp-sch-month__more">
                        +{evs.length - MAX_VISIBLE_EVENTS} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   AgendaView
   ══════════════════════════════════════════════════ */

interface AgendaViewProps {
  currentDate: Date;
  events: SchedulerEvent[];
  daysToShow: number;
  onEventClick?: (e: EventClickEvent) => void;
}

interface AgendaDay {
  date: Date;
  events: SchedulerEvent[];
}

function AgendaView({ currentDate, events, daysToShow, onEventClick }: AgendaViewProps) {
  const agendaDays = useMemo<AgendaDay[]>(() => {
    const start = startOfDay(currentDate);
    const end = addDays(start, daysToShow);
    const rangeEvents = getEventsForRange(events, { start, end });
    const days: AgendaDay[] = [];
    for (let i = 0; i < daysToShow; i++) {
      const d = addDays(start, i);
      const dayEvs = rangeEvents.filter(e => {
        const evStart = startOfDay(e.start);
        const evEnd = e.allDay ? evStart : startOfDay(e.end);
        return isSameDay(d, evStart) || isSameDay(d, evEnd) || (d >= evStart && d <= evEnd);
      });
      if (dayEvs.length > 0) days.push({ date: d, events: dayEvs });
    }
    return days;
  }, [currentDate, events, daysToShow]);

  const handleEventClick = useCallback(
    (e: React.MouseEvent, ev: SchedulerEvent) => {
      e.stopPropagation();
      onEventClick?.({ event: ev, nativeEvent: e.nativeEvent });
    },
    [onEventClick],
  );

  return (
    <div className="sp-sch-agenda" role="list" aria-label="Agenda view">
      {agendaDays.length === 0 && (
        <div className="sp-sch-agenda__empty">No events in this period.</div>
      )}
      {agendaDays.map(day => (
        <div key={day.date.toISOString()} className="sp-sch-agenda__day" role="listitem">
          <div className="sp-sch-agenda__date-col">
            <span className="sp-sch-agenda__date-month">
              {day.date.toLocaleDateString(undefined, { month: 'short' })}
            </span>
            <span className="sp-sch-agenda__date-num">{day.date.getDate()}</span>
            <span className="sp-sch-agenda__date-weekday">
              {day.date.toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
          </div>
          <div className="sp-sch-agenda__events-col">
            {day.events.map(ev => (
              <div
                key={ev.id}
                className="sp-sch-agenda__event"
                style={{ '--ev-color': ev.color || 'var(--sp-primary)' } as React.CSSProperties}
                onClick={e => handleEventClick(e, ev)}
                role="button"
                tabIndex={0}
                aria-label={ev.title}
              >
                <div className="sp-sch-agenda__ev-bar" />
                <div className="sp-sch-agenda__ev-body">
                  <div className="sp-sch-agenda__ev-title">{ev.title}</div>
                  <div className="sp-sch-agenda__ev-time">
                    {ev.allDay ? 'All day' : `${formatTime(ev.start)} \u2013 ${formatTime(ev.end)}`}
                  </div>
                  {ev.description && (
                    <div className="sp-sch-agenda__ev-desc">{ev.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   YearView
   ══════════════════════════════════════════════════ */

interface YearViewProps {
  currentDate: Date;
  events: SchedulerEvent[];
  onEventClick?: (e: EventClickEvent) => void;
  onSlotClick?: (e: SlotClickEvent) => void;
}

interface MiniMonth {
  year: number;
  month: number;
  name: string;
  weeks: (Date | null)[][];
}

const YEAR_WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function YearView({ currentDate, events, onEventClick, onSlotClick }: YearViewProps) {
  const year = currentDate.getFullYear();

  const months = useMemo<MiniMonth[]>(() => {
    const result: MiniMonth[] = [];
    for (let m = 0; m < 12; m++) {
      const first = new Date(year, m, 1);
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      const startDow = first.getDay();
      const weeks: (Date | null)[][] = [];
      let week: (Date | null)[] = new Array(startDow).fill(null);
      for (let d = 1; d <= daysInMonth; d++) {
        week.push(new Date(year, m, d));
        if (week.length === 7) {
          weeks.push(week);
          week = [];
        }
      }
      if (week.length > 0) {
        while (week.length < 7) week.push(null);
        weeks.push(week);
      }
      result.push({
        year,
        month: m,
        name: first.toLocaleDateString(undefined, { month: 'long' }),
        weeks,
      });
    }
    return result;
  }, [year]);

  const hasEvents = useCallback(
    (d: Date) => getEventsForDay(events, d).length > 0,
    [events],
  );

  const handleDayClick = useCallback(
    (e: React.MouseEvent, day: Date) => {
      const evs = getEventsForDay(events, day);
      if (evs.length > 0) {
        onEventClick?.({ event: evs[0], nativeEvent: e.nativeEvent });
      }
      const slot: SchedulerSlot = { date: startOfDay(day), hour: 0, minute: 0 };
      onSlotClick?.({ slot, nativeEvent: e.nativeEvent });
    },
    [events, onEventClick, onSlotClick],
  );

  return (
    <div className="sp-sch-year" role="grid" aria-label={`Year ${year}`}>
      {months.map(m => (
        <div key={m.month} className="sp-sch-year__month">
          <div className="sp-sch-year__month-name">{m.name}</div>
          <div className="sp-sch-year__grid">
            <div className="sp-sch-year__hd">
              {YEAR_WEEKDAYS.map((wd, i) => (
                <span key={i}>{wd}</span>
              ))}
            </div>
            {m.weeks.map((week, wi) => (
              <div key={wi} className="sp-sch-year__week">
                {week.map((day, di) =>
                  day ? (
                    <span
                      key={di}
                      className={
                        'sp-sch-year__day' +
                        (isToday(day) ? ' sp-sch-year__day--today' : '') +
                        (hasEvents(day) ? ' sp-sch-year__day--event' : '')
                      }
                      onClick={e => handleDayClick(e, day)}
                      role="button"
                      tabIndex={0}
                      aria-label={day.toDateString()}
                    >
                      {day.getDate()}
                    </span>
                  ) : (
                    <span key={di} className="sp-sch-year__day sp-sch-year__day--empty" />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   TimelineView
   ══════════════════════════════════════════════════ */

interface TimelineViewProps {
  currentDate: Date;
  events: SchedulerEvent[];
  resources: SchedulerResource[];
  numberOfDays: number;
  startHour: number;
  endHour: number;
  onEventClick?: (e: EventClickEvent) => void;
  onSlotClick?: (e: SlotClickEvent) => void;
  onEventMove?: (e: EventMoveEvent) => void;
  onEventResize?: (e: EventResizeEvent) => void;
}

function TimelineView({
  currentDate,
  events,
  resources,
  numberOfDays,
  startHour,
  endHour,
  onEventClick,
  onSlotClick,
  onEventMove,
  onEventResize,
}: TimelineViewProps) {
  const timeHeaderRef = useRef<HTMLDivElement>(null);

  const days = useMemo(() => {
    const start = startOfDay(currentDate);
    return Array.from({ length: numberOfDays }, (_, i) => addDays(start, i));
  }, [currentDate, numberOfDays]);

  const hours = useMemo(() => {
    const result: number[] = [];
    for (let h = startHour; h < endHour; h++) result.push(h);
    return result;
  }, [startHour, endHour]);

  const totalSlots = days.length * hours.length;

  const rangeStart = useMemo(() => addHours(startOfDay(currentDate), startHour), [currentDate, startHour]);
  const rangeEnd = useMemo(
    () => addHours(addDays(startOfDay(currentDate), numberOfDays - 1), endHour),
    [currentDate, numberOfDays, endHour],
  );
  const rangeTotalMinutes = useMemo(
    () => (rangeEnd.getTime() - rangeStart.getTime()) / 60000,
    [rangeStart, rangeEnd],
  );

  const getResourceEvents = useCallback(
    (resourceId: string | number) =>
      events.filter(e => e.resourceId === resourceId && e.start < rangeEnd && e.end > rangeStart),
    [events, rangeStart, rangeEnd],
  );

  const eventLeft = useCallback(
    (ev: SchedulerEvent) => {
      const start = Math.max(ev.start.getTime(), rangeStart.getTime());
      return ((start - rangeStart.getTime()) / 60000 / rangeTotalMinutes) * 100;
    },
    [rangeStart, rangeTotalMinutes],
  );

  const eventWidth = useCallback(
    (ev: SchedulerEvent) => {
      const start = Math.max(ev.start.getTime(), rangeStart.getTime());
      const end = Math.min(ev.end.getTime(), rangeEnd.getTime());
      return ((end - start) / 60000 / rangeTotalMinutes) * 100;
    },
    [rangeStart, rangeEnd, rangeTotalMinutes],
  );

  const handleEventClick = useCallback(
    (e: React.MouseEvent, ev: SchedulerEvent) => {
      e.stopPropagation();
      onEventClick?.({ event: ev, nativeEvent: e.nativeEvent });
    },
    [onEventClick],
  );

  const handleSlotClick = useCallback(
    (e: React.MouseEvent, day: Date, hour: number, resourceId: string | number) => {
      const slot: SchedulerSlot = { date: day, hour, minute: 0, resourceId };
      onSlotClick?.({ slot, nativeEvent: e.nativeEvent });
    },
    [onSlotClick],
  );

  const handleBodyScroll = useCallback((e: React.UIEvent) => {
    const body = e.target as HTMLElement;
    if (timeHeaderRef.current) {
      timeHeaderRef.current.scrollLeft = body.scrollLeft;
    }
  }, []);

  /* ── Drag ── */
  const dragRef = useRef<{
    event: SchedulerEvent;
    origStart: Date;
    origEnd: Date;
    startX: number;
  } | null>(null);

  const handleEventDragStart = useCallback(
    (e: React.MouseEvent, event: SchedulerEvent) => {
      if (
        (e.target as HTMLElement).classList.contains('sp-sch-event__resize--left') ||
        (e.target as HTMLElement).classList.contains('sp-sch-event__resize--right')
      ) return;
      e.preventDefault();
      e.stopPropagation();

      dragRef.current = {
        event,
        origStart: new Date(event.start),
        origEnd: new Date(event.end),
        startX: e.clientX,
      };

      const onMouseMove = (me: MouseEvent) => {
        const dr = dragRef.current;
        if (!dr) return;
        const totalWidth = totalSlots * 60;
        const dx = me.clientX - dr.startX;
        const deltaMin = Math.round((dx / totalWidth) * rangeTotalMinutes / 15) * 15;
        dr.event.start = addMinutes(dr.origStart, deltaMin);
        dr.event.end = addMinutes(dr.origEnd, deltaMin);
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        const dr = dragRef.current;
        if (dr && dr.event.start.getTime() !== dr.origStart.getTime()) {
          onEventMove?.({
            event: dr.event,
            oldStart: dr.origStart,
            oldEnd: dr.origEnd,
            newStart: new Date(dr.event.start),
            newEnd: new Date(dr.event.end),
          });
        }
        dragRef.current = null;
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [totalSlots, rangeTotalMinutes, onEventMove],
  );

  /* ── Resize ── */
  const resizeRef = useRef<{
    event: SchedulerEvent;
    edge: 'left' | 'right';
    origStart: Date;
    origEnd: Date;
    startX: number;
  } | null>(null);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, event: SchedulerEvent, edge: 'left' | 'right') => {
      e.preventDefault();
      e.stopPropagation();

      resizeRef.current = {
        event,
        edge,
        origStart: new Date(event.start),
        origEnd: new Date(event.end),
        startX: e.clientX,
      };

      const onMouseMove = (me: MouseEvent) => {
        const rr = resizeRef.current;
        if (!rr) return;
        const totalWidth = totalSlots * 60;
        const dx = me.clientX - rr.startX;
        const deltaMin = Math.round((dx / totalWidth) * rangeTotalMinutes / 15) * 15;
        if (rr.edge === 'right') {
          const newEnd = addMinutes(rr.origEnd, deltaMin);
          if (newEnd > rr.event.start) rr.event.end = newEnd;
        } else {
          const newStart = addMinutes(rr.origStart, deltaMin);
          if (newStart < rr.event.end) rr.event.start = newStart;
        }
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        const rr = resizeRef.current;
        if (
          rr &&
          (rr.event.start.getTime() !== rr.origStart.getTime() ||
            rr.event.end.getTime() !== rr.origEnd.getTime())
        ) {
          onEventResize?.({
            event: rr.event,
            oldStart: rr.origStart,
            oldEnd: rr.origEnd,
            newStart: new Date(rr.event.start),
            newEnd: new Date(rr.event.end),
          });
        }
        resizeRef.current = null;
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [totalSlots, rangeTotalMinutes, onEventResize],
  );

  return (
    <div className="sp-sch-timeline" role="grid" aria-label="Timeline view">
      {/* Header */}
      <div className="sp-sch-timeline__header">
        <div className="sp-sch-timeline__res-hd">Resource</div>
        <div className="sp-sch-timeline__time-hd-wrap" ref={timeHeaderRef}>
          {days.map(day => (
            <div key={day.toISOString()} className="sp-sch-timeline__day-group">
              <div className={`sp-sch-timeline__day-label${isToday(day) ? ' sp-sch-timeline__day-label--today' : ''}`}>
                {formatDayHeader(day)}
              </div>
              <div className="sp-sch-timeline__hours">
                {hours.map(h => (
                  <div key={h} className="sp-sch-timeline__hour-label">{formatHour(h)}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body with resource rows */}
      <div className="sp-sch-timeline__body" onScroll={handleBodyScroll}>
        <div className="sp-sch-timeline__rows">
          {resources.map(res => (
            <div key={res.id} className="sp-sch-timeline__row" role="row">
              <div className="sp-sch-timeline__res-cell" role="rowheader">
                <span className="sp-sch-timeline__res-name">{res.name}</span>
              </div>
              <div
                className="sp-sch-timeline__time-cells"
                style={{ '--total-slots': totalSlots } as React.CSSProperties}
              >
                {/* Slot cells */}
                {days.map(day =>
                  hours.map(h => (
                    <div
                      key={`${day.toISOString()}-${h}`}
                      className={`sp-sch-timeline__slot${isToday(day) ? ' sp-sch-timeline__slot--today' : ''}`}
                      onClick={e => handleSlotClick(e, day, h, res.id)}
                    />
                  )),
                )}

                {/* Events for this resource */}
                {getResourceEvents(res.id).map(ev => (
                  <div
                    key={ev.id}
                    className="sp-sch-event sp-sch-event--timeline"
                    style={{
                      left: `${eventLeft(ev)}%`,
                      width: `${eventWidth(ev)}%`,
                      '--ev-color': ev.color || res.color || 'var(--sp-primary)',
                    } as React.CSSProperties}
                    onClick={e => handleEventClick(e, ev)}
                    onMouseDown={e => handleEventDragStart(e, ev)}
                    role="button"
                    tabIndex={0}
                    aria-label={ev.title}
                  >
                    <div
                      className="sp-sch-event__resize sp-sch-event__resize--left"
                      onMouseDown={e => handleResizeStart(e, ev, 'left')}
                    />
                    <span className="sp-sch-event--timeline__title">{ev.title}</span>
                    <div
                      className="sp-sch-event__resize sp-sch-event__resize--right"
                      onMouseDown={e => handleResizeStart(e, ev, 'right')}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
