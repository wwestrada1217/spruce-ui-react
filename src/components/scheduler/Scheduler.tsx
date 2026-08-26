/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import './Scheduler.css';
import { Icon } from '../../icons/Icon.js';
import { Button } from '../button/Button.js';
import { useI18n } from '../../i18n/i18n-context.js';
import type { Border, Chrome, Radius } from '../../chrome/chrome.js';
import type {
  SchedulerView,
  SchedulerEvent,
  SchedulerResource,
  SchedulerCalendar,
  SchedulerCalendarControls,
  SchedulerCalendarId,
  SchedulerDayGlyphConfig,
  SchedulerDayGlyphResolver,
  SchedulerDateRestriction,
  SchedulerTimelineScale,
  SchedulerTimeScale,
  SchedulerUnavailableHourRange,
  SchedulerWeekNumberRule,
  SchedulerSlot,
  EventClickEvent,
  SlotClickEvent,
  EventMoveEvent,
  EventResizeEvent,
  PositionedEvent,
} from './scheduler-types.js';
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
  formatDayHeader,
  formatMonthYear,
  formatTime,
  getWeekNumber,
  hasEventConflict,
  isAllDayOrLongDuration,
  isDateRestricted,
  isHourUnavailable,
  resolveDayGlyphs,
  expandRecurringEvents,
} from './scheduler-utils.js';

/* ── View labels ── */

const ALL_VIEWS: SchedulerView[] = ['day', 'week', 'workWeek', 'month', 'agenda', 'year', 'timeline'];

/* ── Props ── */

export interface SchedulerProps {
  events?: SchedulerEvent[];
  calendars?: SchedulerCalendar[];
  visibleCalendarIds?: SchedulerCalendarId[] | null;
  calendarControls?: SchedulerCalendarControls;
  dayGlyphs?: SchedulerDayGlyphResolver | null;
  dayGlyphConfig?: SchedulerDayGlyphConfig;
  resources?: SchedulerResource[];
  collapsibleResourceGroups?: boolean;
  chrome?: Chrome;
  radius?: Radius;
  border?: Border;
  view?: SchedulerView;
  currentDate?: Date;
  startHour?: number;
  endHour?: number;
  timeScale?: SchedulerTimeScale;
  showTimeScaleLines?: boolean;
  disabledDates?: SchedulerDateRestriction[];
  agendaDays?: number;
  timelineDays?: number;
  timelineScale?: SchedulerTimelineScale;
  showScrollIndicators?: boolean;
  showWeekNumbers?: boolean;
  showMonthWeekNumbers?: boolean;
  showWeekViewWeekNumbers?: boolean;
  showWorkWeekWeekNumbers?: boolean;
  showDayWeekNumbers?: boolean;
  showYearWeekNumbers?: boolean;
  weekNumberRule?: SchedulerWeekNumberRule;
  showEventDetailsPopover?: boolean;
  showEventPopover?: boolean;
  showEventDetails?: boolean;
  detectConflict?: boolean;
  detectConflicts?: boolean;
  autoAllDay?: boolean;
  enableAutoAllDay?: boolean;
  autoAllDayThresholdHours?: number;
  unavailableHours?: SchedulerUnavailableHourRange[];
  unavailableRanges?: SchedulerUnavailableHourRange[];
  views?: SchedulerView[];
  onEventClick?: (e: EventClickEvent) => void;
  onSlotClick?: (e: SlotClickEvent) => void;
  onEventMove?: (e: EventMoveEvent) => void;
  onEventResize?: (e: EventResizeEvent) => void;
  onEventCreate?: (event: SchedulerEvent) => void;
  onEventUpdate?: (event: SchedulerEvent) => void;
  onEventDelete?: (event: SchedulerEvent) => void;
  onVisibleCalendarIdsChange?: (ids: SchedulerCalendarId[]) => void;
  onViewChange?: (view: SchedulerView) => void;
  onDateChange?: (date: Date) => void;
}

/* ══════════════════════════════════════════════════
   Scheduler
   ══════════════════════════════════════════════════ */

export function Scheduler({
  events = [],
  calendars = [],
  visibleCalendarIds = null,
  calendarControls = 'popover',
  dayGlyphs = null,
  dayGlyphConfig = {},
  resources = [],
  collapsibleResourceGroups = true,
  chrome = 'default',
  radius,
  border = 'default',
  view = 'week',
  currentDate: currentDateProp,
  startHour = 0,
  endHour = 24,
  timeScale = 15,
  showTimeScaleLines = true,
  disabledDates = [],
  agendaDays = 7,
  timelineDays = 1,
  timelineScale = 'time',
  showScrollIndicators = true,
  showWeekNumbers = false,
  showMonthWeekNumbers = false,
  showWeekViewWeekNumbers = false,
  showWorkWeekWeekNumbers = false,
  showDayWeekNumbers = false,
  showYearWeekNumbers = false,
  weekNumberRule = 'iso',
  showEventDetailsPopover = true,
  showEventPopover = true,
  showEventDetails = true,
  detectConflict = false,
  detectConflicts = false,
  autoAllDay = true,
  enableAutoAllDay = true,
  autoAllDayThresholdHours = 24,
  unavailableHours = [],
  unavailableRanges = [],
  views = ALL_VIEWS,
  onEventClick,
  onSlotClick,
  onEventMove,
  onEventResize,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  onVisibleCalendarIdsChange,
  onViewChange,
  onDateChange,
}: SchedulerProps) {
  const { t, formatDate: i18nFormatDate, formatMonthYear: i18nFormatMonthYear } = useI18n();
  const [activeView, setActiveView] = useState<SchedulerView>(view);
  const [currentDate, setCurrentDate] = useState<Date>(currentDateProp ?? new Date());
  const [calendarPanelOpen, setCalendarPanelOpen] = useState(false);
  const [localVisibleCalendarIds, setLocalVisibleCalendarIds] = useState<SchedulerCalendarId[] | null>(visibleCalendarIds);
  const [editor, setEditor] = useState<{ mode: 'create' | 'edit'; event: SchedulerEvent; source?: SchedulerEvent } | null>(null);
  const [conflictNotice, setConflictNotice] = useState<string | null>(null);

  const effectiveVisibleCalendarIds = visibleCalendarIds === null ? localVisibleCalendarIds : visibleCalendarIds;
  const effectiveUnavailableRanges = useMemo(() => [...unavailableHours, ...unavailableRanges], [unavailableHours, unavailableRanges]);
  const conflictDetectionEnabled = detectConflict || detectConflicts;
  const autoPromotionEnabled = autoAllDay && enableAutoAllDay;

  const enabledCalendars = useMemo(() => calendars.filter((calendar) => !calendar.disabled), [calendars]);
  const visibleCalendarSet = useMemo(() => {
    if (effectiveVisibleCalendarIds === null) return new Set(enabledCalendars.map((calendar) => calendar.id));
    return new Set(effectiveVisibleCalendarIds);
  }, [effectiveVisibleCalendarIds, enabledCalendars]);
  const visibleEvents = useMemo(() => {
    const filtered = calendars.length === 0
      ? events
      : events.filter((event) => event.calendarId == null || visibleCalendarSet.has(event.calendarId));
    const expanded = expandRecurringEvents(filtered, { start: addDays(currentDate, -366), end: addDays(currentDate, 366) });
    return expanded.map((event) => autoPromotionEnabled && isAllDayOrLongDuration(event, autoAllDayThresholdHours) && !event.allDay
      ? { ...event, allDay: true }
      : event);
  }, [autoAllDayThresholdHours, autoPromotionEnabled, calendars.length, currentDate, events, visibleCalendarSet]);
  const touchesUnavailableRange = useCallback((start: Date, end: Date) => {
    const lastMinute = new Date(Math.max(start.getTime(), end.getTime() - 1));
    return Boolean(
      isHourUnavailable(start, start.getHours(), effectiveUnavailableRanges) ||
      isHourUnavailable(lastMinute, lastMinute.getHours(), effectiveUnavailableRanges),
    );
  }, [effectiveUnavailableRanges]);

  /* Sync when props change */
  useEffect(() => { setActiveView(view); }, [view]);
  useEffect(() => { if (currentDateProp) setCurrentDate(currentDateProp); }, [currentDateProp]);
  useEffect(() => { setLocalVisibleCalendarIds(visibleCalendarIds); }, [visibleCalendarIds]);

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
        return i18nFormatDate(currentDate);
      case 'week':
      case 'workWeek': {
        const ws = startOfWeek(currentDate);
        const we = endOfWeek(currentDate);
        if (ws.getMonth() === we.getMonth()) {
          return `${i18nFormatDate(ws, { month: 'long', day: 'numeric' })} \u2013 ${i18nFormatDate(we, { day: 'numeric', year: 'numeric' })}`;
        }
        return `${i18nFormatDate(ws, { month: 'short', day: 'numeric' })} \u2013 ${i18nFormatDate(we, { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
      case 'month':
        return i18nFormatMonthYear(currentDate.getMonth(), currentDate.getFullYear());
      case 'agenda':
        return `${t('agendaView')}: ${i18nFormatDate(currentDate)}`;
      case 'year':
        return `${currentDate.getFullYear()}`;
      case 'timeline':
        return i18nFormatDate(currentDate);
      default:
        return i18nFormatDate(currentDate);
    }
  }, [activeView, currentDate, i18nFormatDate, i18nFormatMonthYear, t]);

  /* ── View options ── */

  const viewOptions = useMemo(
    () => views.map(v => ({ value: v, label: t(v === 'workWeek' ? 'workWeek' : v) })),
    [t, views],
  );

  const emitVisibleCalendarIds = useCallback((ids: SchedulerCalendarId[]) => {
    setLocalVisibleCalendarIds(ids);
    onVisibleCalendarIdsChange?.(ids);
  }, [onVisibleCalendarIdsChange]);

  const toggleCalendar = useCallback((calendar: SchedulerCalendar) => {
    if (calendar.disabled) return;
    const current = effectiveVisibleCalendarIds ?? enabledCalendars.map((item) => item.id);
    const next = current.includes(calendar.id)
      ? current.filter((id) => id !== calendar.id)
      : [...current, calendar.id];
    emitVisibleCalendarIds(next);
  }, [effectiveVisibleCalendarIds, emitVisibleCalendarIds, enabledCalendars]);

  const setAllCalendars = useCallback((show: boolean) => {
    emitVisibleCalendarIds(show ? enabledCalendars.map((calendar) => calendar.id) : []);
  }, [emitVisibleCalendarIds, enabledCalendars]);

  const handleEventClick = useCallback((event: EventClickEvent) => {
    onEventClick?.(event);
    if (showEventDetailsPopover && showEventPopover && showEventDetails) {
      setEditor({ mode: 'edit', event: { ...event.event }, source: event.event });
    }
  }, [onEventClick, showEventDetails, showEventDetailsPopover, showEventPopover]);

  const handleSlotClick = useCallback((event: SlotClickEvent) => {
    onSlotClick?.(event);
  }, [onSlotClick]);

  const handleEventMove = useCallback((event: EventMoveEvent) => {
    if (isDateRestricted(event.newStart, disabledDates) || isDateRestricted(event.newEnd, disabledDates) || touchesUnavailableRange(event.newStart, event.newEnd)) return;
    if (conflictDetectionEnabled && hasEventConflict({ ...event.event, id: event.event.id, start: event.newStart, end: event.newEnd, resourceId: event.newResourceId ?? event.event.resourceId }, events)) {
      setConflictNotice(t('schedulerConflict'));
      return;
    }
    setConflictNotice(null);
    onEventMove?.(event);
  }, [conflictDetectionEnabled, disabledDates, events, onEventMove, t, touchesUnavailableRange]);

  const handleEventResize = useCallback((event: EventResizeEvent) => {
    if (isDateRestricted(event.newStart, disabledDates) || isDateRestricted(event.newEnd, disabledDates) || touchesUnavailableRange(event.newStart, event.newEnd)) return;
    if (conflictDetectionEnabled && hasEventConflict({ ...event.event, id: event.event.id, start: event.newStart, end: event.newEnd }, events)) {
      setConflictNotice(t('schedulerConflict'));
      return;
    }
    setConflictNotice(null);
    onEventResize?.(event);
  }, [conflictDetectionEnabled, disabledDates, events, onEventResize, t, touchesUnavailableRange]);

  const openCreateEditor = useCallback((event: SlotClickEvent) => {
    if (isDateRestricted(event.slot.date, disabledDates) || isHourUnavailable(event.slot.date, event.slot.hour ?? 0, effectiveUnavailableRanges)) return;
    const start = new Date(event.slot.date);
    start.setHours(event.slot.hour ?? 9, event.slot.minute ?? 0, 0, 0);
    const end = addHours(start, 1);
    setEditor({ mode: 'create', event: { id: `event-${Date.now()}`, title: '', start, end } });
  }, [disabledDates, effectiveUnavailableRanges]);

  const saveEditor = useCallback(() => {
    if (!editor || !editor.event.title.trim() || editor.event.end <= editor.event.start) return;
    if (touchesUnavailableRange(editor.event.start, editor.event.end)) return;
    if (conflictDetectionEnabled && hasEventConflict(editor.event, events)) {
      setConflictNotice(t('schedulerConflict'));
      return;
    }
    setConflictNotice(null);
    if (editor.mode === 'create') onEventCreate?.(editor.event);
    else onEventUpdate?.(editor.event);
    setEditor(null);
  }, [conflictDetectionEnabled, editor, events, onEventCreate, onEventUpdate, t, touchesUnavailableRange]);

  const deleteEditorEvent = useCallback(() => {
    if (!editor || editor.mode !== 'edit' || !editor.source) return;
    onEventDelete?.(editor.source);
    setEditor(null);
  }, [editor, onEventDelete]);

  /* ── Render ── */

  return (
    <div
      className={[
        'sp-sch',
        `sp-sch--${activeView}`,
        `sp-chrome--${chrome}`,
        radius && `sp-radius--${radius}`,
        `sp-border--${border}`,
        !showScrollIndicators && 'sp-sch--hide-scroll-indicators',
      ].filter(Boolean).join(' ')}
    >
      {/* Toolbar */}
      <div className="sp-sch__toolbar" role="toolbar" aria-label={t('schedulerToolbar')}>
        <div className="sp-sch__toolbar-nav">
          <button className="sp-sch__btn" onClick={handleToday} aria-label={t('goToToday')}>{t('today')}</button>
          <button className="sp-sch__btn sp-sch__btn--icon" onClick={handlePrev} aria-label={t('previous')}>
            <Icon name="chevron-left" size={16} />
          </button>
          <button className="sp-sch__btn sp-sch__btn--icon" onClick={handleNext} aria-label={t('next')}>
            <Icon name="chevron-right" size={16} />
          </button>
          <span className="sp-sch__title">{title}</span>
        </div>

        {calendars.length > 0 && calendarControls === 'popover' && (
          <div className="sp-sch__calendar-control">
            <button
              type="button"
              className="sp-sch__btn"
              aria-expanded={calendarPanelOpen}
              aria-controls="sp-sch-calendar-panel"
              aria-label={t('calendars')}
              onClick={() => setCalendarPanelOpen((open) => !open)}
            >
              {t('calendars')} ({visibleCalendarSet.size})
            </button>
            {calendarPanelOpen && (
              <CalendarPanel
                calendars={calendars}
                visibleCalendarSet={visibleCalendarSet}
                onToggle={toggleCalendar}
                onSelectAll={() => setAllCalendars(true)}
                onClearAll={() => setAllCalendars(false)}
              />
            )}
          </div>
        )}

        <div className="sp-sch__toolbar-views" role="tablist" aria-label={t('calendarViews')}>
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
      <div className="sp-sch__main">
        {calendars.length > 0 && calendarControls === 'sidebar' && (
          <aside className="sp-sch__calendar-sidebar" aria-label={t('calendars')}>
            <CalendarPanel
              calendars={calendars}
              visibleCalendarSet={visibleCalendarSet}
              onToggle={toggleCalendar}
              onSelectAll={() => setAllCalendars(true)}
              onClearAll={() => setAllCalendars(false)}
            />
          </aside>
        )}
        <div className="sp-sch__content">
          {conflictNotice && <div className="sp-sch__conflict" role="alert">{conflictNotice}</div>}
        {(activeView === 'day' || activeView === 'week' || activeView === 'workWeek') && (
          <DayView
            mode={activeView}
            currentDate={currentDate}
            events={visibleEvents}
            resources={resources}
            startHour={startHour}
            endHour={endHour}
            timeScale={timeScale}
            showTimeScaleLines={showTimeScaleLines}
            disabledDates={disabledDates}
            unavailableRanges={effectiveUnavailableRanges}
            dayGlyphs={dayGlyphs}
            dayGlyphConfig={dayGlyphConfig}
            showWeekNumbers={activeView === 'day' ? showDayWeekNumbers : activeView === 'week' ? showWeekViewWeekNumbers : showWorkWeekWeekNumbers}
            weekNumberRule={weekNumberRule}
            onEventClick={handleEventClick}
            onSlotClick={handleSlotClick}
            onSlotDoubleClick={openCreateEditor}
            onEventMove={handleEventMove}
            onEventResize={handleEventResize}
          />
        )}
        {activeView === 'month' && (
          <MonthView
            currentDate={currentDate}
            events={visibleEvents}
            dayGlyphs={dayGlyphs}
            dayGlyphConfig={dayGlyphConfig}
            showWeekNumbers={showMonthWeekNumbers || showWeekNumbers}
            weekNumberRule={weekNumberRule}
            onEventClick={handleEventClick}
            onSlotClick={handleSlotClick}
            onSlotDoubleClick={openCreateEditor}
          />
        )}
        {activeView === 'agenda' && (
          <AgendaView
            currentDate={currentDate}
            events={visibleEvents}
            daysToShow={agendaDays}
            onEventClick={handleEventClick}
          />
        )}
        {activeView === 'year' && (
          <YearView
            currentDate={currentDate}
            events={visibleEvents}
            dayGlyphs={dayGlyphs}
            dayGlyphConfig={dayGlyphConfig}
            showWeekNumbers={showYearWeekNumbers}
            weekNumberRule={weekNumberRule}
            onEventClick={handleEventClick}
            onSlotClick={handleSlotClick}
          />
        )}
        {activeView === 'timeline' && (
          <TimelineView
            currentDate={currentDate}
            events={visibleEvents}
            resources={resources}
            numberOfDays={timelineDays}
            timelineScale={timelineScale}
            collapsibleResourceGroups={collapsibleResourceGroups}
            startHour={startHour}
            endHour={endHour}
            unavailableRanges={effectiveUnavailableRanges}
            disabledDates={disabledDates}
            onEventClick={handleEventClick}
            onSlotClick={handleSlotClick}
            onSlotDoubleClick={openCreateEditor}
            onEventMove={handleEventMove}
            onEventResize={handleEventResize}
          />
        )}
        </div>
      </div>
      {editor && (
        <SchedulerEditor
          mode={editor.mode}
          event={editor.event}
          calendars={enabledCalendars}
          onChange={(next) => setEditor((current) => current ? { ...current, event: next } : current)}
          onSave={saveEditor}
          onDelete={editor.mode === 'edit' ? deleteEditorEvent : undefined}
          onCancel={() => setEditor(null)}
        />
      )}
    </div>
  );
}

interface CalendarPanelProps {
  calendars: SchedulerCalendar[];
  visibleCalendarSet: Set<SchedulerCalendarId>;
  onToggle: (calendar: SchedulerCalendar) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

function CalendarPanel({ calendars, visibleCalendarSet, onToggle, onSelectAll, onClearAll }: CalendarPanelProps) {
  const { t } = useI18n();
  return (
    <div id="sp-sch-calendar-panel" className="sp-sch__calendar-panel" role="group" aria-label={t('calendars')}>
      <div className="sp-sch__calendar-panel-head">
        <strong>{t('calendars')}</strong>
        <span>
          <button type="button" onClick={onSelectAll}>{t('selectAll')}</button>
          <button type="button" onClick={onClearAll}>{t('clearAll')}</button>
        </span>
      </div>
      {calendars.map((calendar) => {
        const checked = visibleCalendarSet.has(calendar.id);
        return (
          <div className="sp-sch__calendar-item" key={String(calendar.id)}>
            <button
              type="button"
              role="checkbox"
              aria-checked={checked}
              disabled={calendar.disabled}
              onClick={() => onToggle(calendar)}
            >
              <span aria-hidden="true" className="sp-sch__calendar-check">{checked ? '✓' : ''}</span>
              <span>{calendar.name}</span>
              <span aria-hidden="true" className="sp-sch__calendar-swatch" style={{ background: calendar.color }} />
            </button>
            <button type="button" onClick={() => onToggle({ ...calendar, disabled: false })}>{t('showAll')}</button>
          </div>
        );
      })}
    </div>
  );
}

interface SchedulerEditorProps {
  mode: 'create' | 'edit';
  event: SchedulerEvent;
  calendars: SchedulerCalendar[];
  onChange: (event: SchedulerEvent) => void;
  onSave: () => void;
  onDelete?: () => void;
  onCancel: () => void;
}

function SchedulerEditor({ mode, event, calendars, onChange, onSave, onDelete, onCancel }: SchedulerEditorProps) {
  const { t } = useI18n();
  const toInputValue = (date: Date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 16);
  };
  const fromInputValue = (value: string) => new Date(value);
  return (
    <div className="sp-sch__editor-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <form className="sp-sch__editor" role="dialog" aria-modal="true" aria-labelledby="sp-sch-editor-title" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
        <h2 id="sp-sch-editor-title">{mode === 'create' ? t('newEvent') : t('editEvent')}</h2>
        <label>
          {t('title')}
          <input autoFocus required value={event.title} onChange={(e) => onChange({ ...event, title: e.target.value })} />
        </label>
        <div className="sp-sch__editor-grid">
          <label>{t('start')}<input type="datetime-local" value={toInputValue(event.start)} onChange={(e) => onChange({ ...event, start: fromInputValue(e.target.value) })} /></label>
          <label>{t('end')}<input type="datetime-local" value={toInputValue(event.end)} onChange={(e) => onChange({ ...event, end: fromInputValue(e.target.value) })} /></label>
        </div>
        <label className="sp-sch__editor-check"><input type="checkbox" checked={event.allDay ?? false} onChange={(e) => onChange({ ...event, allDay: e.target.checked })} />{t('allDay')}</label>
        {calendars.length > 0 && (
          <label>{t('calendar')}
            <select value={event.calendarId == null ? '' : String(event.calendarId)} onChange={(e) => onChange({ ...event, calendarId: e.target.value || undefined })}>
              <option value="">{t('noCalendar')}</option>
              {calendars.map((calendar) => <option key={String(calendar.id)} value={String(calendar.id)}>{calendar.name}</option>)}
            </select>
          </label>
        )}
        <div className="sp-sch__editor-actions">
          {onDelete && <Button type="button" variant="danger-outline" onClick={onDelete}>{t('deleteEvent')}</Button>}
          <span />
          <Button type="button" variant="ghost" onClick={onCancel}>{t('cancel')}</Button>
          <Button type="submit" variant="primary">{t('save')}</Button>
        </div>
      </form>
    </div>
  );
}

interface DayGlyphsProps {
  date: Date;
  resolver: SchedulerDayGlyphResolver | null;
  config: SchedulerDayGlyphConfig;
}

function DayGlyphs({ date, resolver, config }: DayGlyphsProps) {
  const glyphs = resolveDayGlyphs(resolver, date);
  if (glyphs.length === 0) return null;
  const size = Math.max(10, Math.min(16, config.iconSize ?? 12));
  return (
    <span className={`sp-sch-day-glyphs sp-sch-day-glyphs--${config.layout ?? 'inline'} sp-sch-day-glyphs--${config.tone ?? 'semantic'}`}>
      {glyphs.map((glyph, index) => (
        <span className="sp-sch-day-glyph" key={`${glyph.label ?? glyph.icon ?? 'glyph'}-${index}`} title={glyph.ariaLabel ?? glyph.label}>
          {glyph.avatarUrl ? <img src={glyph.avatarUrl} alt="" width={size} height={size} /> : glyph.icon ? <Icon name={glyph.icon} size={size} aria-hidden="true" /> : null}
          {config.showLabels && glyph.label && <span>{glyph.label}</span>}
          {!config.showLabels && glyph.ariaLabel && <span className="sp-visually-hidden">{glyph.ariaLabel}</span>}
        </span>
      ))}
    </span>
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
  timeScale: SchedulerTimeScale;
  showTimeScaleLines: boolean;
  disabledDates: SchedulerDateRestriction[];
  unavailableRanges: SchedulerUnavailableHourRange[];
  dayGlyphs: SchedulerDayGlyphResolver | null;
  dayGlyphConfig: SchedulerDayGlyphConfig;
  showWeekNumbers: boolean;
  weekNumberRule: SchedulerWeekNumberRule;
  onEventClick?: (e: EventClickEvent) => void;
  onSlotClick?: (e: SlotClickEvent) => void;
  onSlotDoubleClick?: (e: SlotClickEvent) => void;
  onEventMove?: (e: EventMoveEvent) => void;
  onEventResize?: (e: EventResizeEvent) => void;
}

function DayView({
  mode,
  currentDate,
  events,
  startHour,
  endHour,
  timeScale,
  showTimeScaleLines,
  disabledDates,
  unavailableRanges,
  dayGlyphs,
  dayGlyphConfig,
  showWeekNumbers,
  weekNumberRule,
  onEventClick,
  onSlotClick,
  onSlotDoubleClick,
  onEventMove,
  onEventResize,
}: DayViewProps) {
  const { t, locale } = useI18n();
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
    (nativeEvent: React.MouseEvent | React.KeyboardEvent, event: SchedulerEvent) => {
      nativeEvent.stopPropagation();
      onEventClick?.({ event, nativeEvent: nativeEvent.nativeEvent });
    },
    [onEventClick],
  );

  const handleSlotClick = useCallback(
    (nativeEvent: React.MouseEvent | React.KeyboardEvent, day: Date, hour: number, minute: number) => {
      if (isDateRestricted(day, disabledDates)) return;
      const slot: SchedulerSlot = { date: day, hour, minute };
      onSlotClick?.({ slot, nativeEvent: nativeEvent.nativeEvent });
    },
    [disabledDates, onSlotClick],
  );

  const handleSlotDoubleClick = useCallback((e: React.MouseEvent, day: Date, hour: number, minute: number) => {
    onSlotDoubleClick?.({ slot: { date: day, hour, minute }, nativeEvent: e.nativeEvent });
  }, [onSlotDoubleClick]);

  const handleSlotClickFromPosition = useCallback(
    (e: React.MouseEvent, day: Date) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const pct = (e.clientY - rect.top) / rect.height;
      const totalMin = (endHour - startHour) * 60;
      const min = Math.round((pct * totalMin) / timeScale) * timeScale;
      const hour = Math.floor(min / 60) + startHour;
      const minute = min % 60;
      handleSlotClick(e, day, hour, minute);
    },
    [endHour, handleSlotClick, startHour, timeScale],
  );

  /* ── Drag to move ── */

  const handleEventDragStart = useCallback(
    (e: React.MouseEvent, event: SchedulerEvent) => {
      if (isDateRestricted(event.start, disabledDates)) return;
      if ((e.target as HTMLElement).classList.contains('sp-sch-event__resize')) return;
      e.preventDefault();
      e.stopPropagation();

      dragRef.current = {
        event: { ...event, start: new Date(event.start), end: new Date(event.end) },
        origStart: new Date(event.start),
        origEnd: new Date(event.end),
        startY: e.clientY,
      };
      setDragState({
        eventId: event.id,
        title: event.title,
        time: `${formatTime(event.start, locale)} \u2013 ${formatTime(event.end, locale)}`,
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
        const deltaMin = Math.round((dy / gridHeight) * totalMin / timeScale) * timeScale;
        const newStart = addMinutes(dr.origStart, deltaMin);
        const newEnd = addMinutes(dr.origEnd, deltaMin);
        dr.event.start = newStart;
        dr.event.end = newEnd;
        setDragState({
          eventId: dr.event.id,
          title: dr.event.title,
          time: `${formatTime(newStart, locale)} \u2013 ${formatTime(newEnd, locale)}`,
          color: dr.event.color || 'var(--sp-primary)',
          x: me.clientX,
          y: me.clientY,
        });
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        const dr = dragRef.current;
        if (dr && dr.event.start.getTime() !== dr.origStart.getTime() && !isDateRestricted(dr.event.start, disabledDates)) {
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
    [disabledDates, endHour, locale, onEventMove, timeScale, startHour],
  );

  /* ── Resize ── */

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, event: SchedulerEvent, edge: 'top' | 'bottom') => {
      if (isDateRestricted(event.start, disabledDates)) return;
      e.preventDefault();
      e.stopPropagation();

      resizeRef.current = {
        event: { ...event, start: new Date(event.start), end: new Date(event.end) },
        edge,
        origStart: new Date(event.start),
        origEnd: new Date(event.end),
        startY: e.clientY,
      };
      setDragState({
        eventId: event.id,
        title: event.title,
        time: `${formatTime(event.start, locale)} \u2013 ${formatTime(event.end, locale)}`,
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
        const deltaMin = Math.round((dy / gridHeight) * totalMin / timeScale) * timeScale;

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
          time: `${formatTime(rr.event.start, locale)} \u2013 ${formatTime(rr.event.end, locale)}`,
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
            rr.event.end.getTime() !== rr.origEnd.getTime()) &&
          !isDateRestricted(rr.event.start, disabledDates) &&
          !isDateRestricted(rr.event.end, disabledDates)
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
    [disabledDates, endHour, locale, onEventResize, timeScale, startHour],
  );

  return (
    <div className="sp-sch-dayview" role="grid" aria-label={t('scheduleDayView')}>
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
              <span className="sp-sch-dayview__day-name">{formatDayHeader(day, locale)}</span>
              <span className={`sp-sch-dayview__day-num${isToday(day) ? ' sp-sch-dayview__day-num--today' : ''}`}>
                {day.getDate()}
              </span>
              {showWeekNumbers && <span className="sp-sch-dayview__week-number">W{getWeekNumber(day, weekNumberRule)}</span>}
              <DayGlyphs date={day} resolver={dayGlyphs} config={dayGlyphConfig} />
            </div>
          ))}
        </div>

        {/* All-day row */}
        {hasAllDay && (
          <div className="sp-sch-dayview__allday-row" role="row">
            <div className="sp-sch-dayview__allday-label">{t('allDay')}</div>
            {days.map(day => (
              <div
                key={day.toISOString()}
                className="sp-sch-dayview__allday-cell"
                role="gridcell"
                tabIndex={0}
                onClick={e => handleSlotClick(e, day, 0, 0)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSlotClick(e, day, 0, 0);
                  }
                }}
                onDoubleClick={e => handleSlotDoubleClick(e, day, 0, 0)}
              >
                {getAllDayEventsForDay(day).map(ev => (
                  <div
                    key={ev.id}
                    className="sp-sch-event sp-sch-event--allday"
                    style={{ background: ev.color || 'var(--sp-primary)' }}
                    onClick={e => handleEventClick(e, ev)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleEventClick(e, ev);
                      }
                    }}
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
                {formatHour(h, locale)}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map(day => (
            <div
              key={day.toISOString()}
              className={`sp-sch-dayview__day-col${isToday(day) ? ' sp-sch-dayview__day-col--today' : ''}`}
              role="gridcell"
              tabIndex={0}
              onClick={e => handleSlotClickFromPosition(e, day)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSlotClick(e, day, startHour, 0);
                }
              }}
              onDoubleClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = rect.height ? (e.clientY - rect.top) / rect.height : 0;
                const totalMin = (endHour - startHour) * 60;
                const min = Math.max(0, Math.min(totalMin, Math.round((pct * totalMin) / timeScale) * timeScale));
                handleSlotDoubleClick(e, day, startHour + Math.floor(min / 60), min % 60);
              }}
            >
              {/* Hour grid lines */}
              {hours.map(h => (
                <div
                  key={h}
                  className={`sp-sch-dayview__hour-slot${!showTimeScaleLines ? ' sp-sch-dayview__hour-slot--minor-hidden' : ''}${isHourUnavailable(day, h, unavailableRanges) ? ' sp-sch-dayview__hour-slot--unavailable' : ''}`}
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
                  aria-label={`${pe.event.title} from ${formatTime(pe.event.start, locale)} to ${formatTime(pe.event.end, locale)}`}
                  onMouseDown={e => handleEventDragStart(e, pe.event)}
                  onClick={e => handleEventClick(e, pe.event)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleEventClick(e, pe.event);
                    }
                  }}
                >
                  <div
                    className="sp-sch-event__resize sp-sch-event__resize--top"
                    onMouseDown={e => handleResizeStart(e, pe.event, 'top')}
                  />
                  <div className="sp-sch-event__title">{pe.event.title}</div>
                  <div className="sp-sch-event__time">
                    {formatTime(pe.event.start, locale)} &ndash; {formatTime(pe.event.end, locale)}
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
  dayGlyphs: SchedulerDayGlyphResolver | null;
  dayGlyphConfig: SchedulerDayGlyphConfig;
  showWeekNumbers: boolean;
  weekNumberRule: SchedulerWeekNumberRule;
  onEventClick?: (e: EventClickEvent) => void;
  onSlotClick?: (e: SlotClickEvent) => void;
  onSlotDoubleClick?: (e: SlotClickEvent) => void;
}

const MAX_VISIBLE_EVENTS = 3;

function MonthView({ currentDate, events, dayGlyphs, dayGlyphConfig, showWeekNumbers, weekNumberRule, onEventClick, onSlotClick, onSlotDoubleClick }: MonthViewProps) {
  const { dayLabels, firstDayOfWeek, locale } = useI18n();
  const weeks = useMemo(() => {
    const all = getMonthCalendarDays(currentDate, firstDayOfWeek);
    const result: Date[][] = [];
    for (let i = 0; i < all.length; i += 7) result.push(all.slice(i, i + 7));
    return result;
  }, [currentDate, firstDayOfWeek]);

  const dayEvents = useCallback(
    (day: Date) => getEventsForDay(events, day),
    [events],
  );

  const handleCellClick = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent, day: Date) => {
      const slot: SchedulerSlot = { date: startOfDay(day), hour: 0, minute: 0 };
      onSlotClick?.({ slot, nativeEvent: e.nativeEvent });
    },
    [onSlotClick],
  );

  const handleCellDoubleClick = useCallback(
    (e: React.MouseEvent, day: Date) => onSlotDoubleClick?.({ slot: { date: startOfDay(day), hour: 0, minute: 0 }, nativeEvent: e.nativeEvent }),
    [onSlotDoubleClick],
  );

  const handleEventClick = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent, ev: SchedulerEvent) => {
      e.stopPropagation();
      onEventClick?.({ event: ev, nativeEvent: e.nativeEvent });
    },
    [onEventClick],
  );

  return (
    <div className="sp-sch-month" role="grid" aria-label={`Calendar for ${formatMonthYear(currentDate, locale)}`}>
      <div className="sp-sch-month__header" role="row">
        {dayLabels.map((wd, index) => (
          <div key={`${wd}-${index}`} className="sp-sch-month__weekday" role="columnheader">{wd}</div>
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
                  tabIndex={0}
                  onClick={e => handleCellClick(e, day)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCellClick(e, day);
                    }
                  }}
                  onDoubleClick={e => handleCellDoubleClick(e, day)}
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
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleEventClick(e, ev);
                          }
                        }}
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
                    <DayGlyphs date={day} resolver={dayGlyphs} config={dayGlyphConfig} />
                    {evs.length > MAX_VISIBLE_EVENTS && (
                      <div className="sp-sch-month__more">
                        +{evs.length - MAX_VISIBLE_EVENTS} more
                      </div>
                    )}
                  </div>
                  {showWeekNumbers && week[0] && day === week[0] && <span className="sp-sch-month__week-number">W{getWeekNumber(day, weekNumberRule, firstDayOfWeek)}</span>}
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
  const { t, locale } = useI18n();
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
    (e: React.MouseEvent | React.KeyboardEvent, ev: SchedulerEvent) => {
      e.stopPropagation();
      onEventClick?.({ event: ev, nativeEvent: e.nativeEvent });
    },
    [onEventClick],
  );

  return (
    <div className="sp-sch-agenda" role="list" aria-label={t('agendaView')}>
      {agendaDays.length === 0 && (
        <div className="sp-sch-agenda__empty">{t('noEventsInPeriod')}</div>
      )}
      {agendaDays.map(day => (
        <div key={day.date.toISOString()} className="sp-sch-agenda__day" role="listitem">
          <div className="sp-sch-agenda__date-col">
            <span className="sp-sch-agenda__date-month">
              {day.date.toLocaleDateString(locale, { month: 'short' })}
            </span>
            <span className="sp-sch-agenda__date-num">{day.date.getDate()}</span>
            <span className="sp-sch-agenda__date-weekday">
              {day.date.toLocaleDateString(locale, { weekday: 'short' })}
            </span>
          </div>
          <div className="sp-sch-agenda__events-col">
            {day.events.map(ev => (
              <div
                key={ev.id}
                className="sp-sch-agenda__event"
                style={{ '--ev-color': ev.color || 'var(--sp-primary)' } as React.CSSProperties}
                onClick={e => handleEventClick(e, ev)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleEventClick(e, ev);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={ev.title}
              >
                <div className="sp-sch-agenda__ev-bar" />
                <div className="sp-sch-agenda__ev-body">
                  <div className="sp-sch-agenda__ev-title">{ev.title}</div>
                  <div className="sp-sch-agenda__ev-time">
                    {ev.allDay ? t('allDay') : `${formatTime(ev.start, locale)} \u2013 ${formatTime(ev.end, locale)}`}
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
  dayGlyphs: SchedulerDayGlyphResolver | null;
  dayGlyphConfig: SchedulerDayGlyphConfig;
  showWeekNumbers: boolean;
  weekNumberRule: SchedulerWeekNumberRule;
  onEventClick?: (e: EventClickEvent) => void;
  onSlotClick?: (e: SlotClickEvent) => void;
}

interface MiniMonth {
  year: number;
  month: number;
  name: string;
  weeks: (Date | null)[][];
}

function YearView({ currentDate, events, dayGlyphs, dayGlyphConfig, showWeekNumbers, weekNumberRule, onEventClick, onSlotClick }: YearViewProps) {
  const { dayLabels, firstDayOfWeek, locale } = useI18n();
  const year = currentDate.getFullYear();

  const months = useMemo<MiniMonth[]>(() => {
    const result: MiniMonth[] = [];
    for (let m = 0; m < 12; m++) {
      const first = new Date(year, m, 1);
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      const startDow = (first.getDay() - firstDayOfWeek + 7) % 7;
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
        name: first.toLocaleDateString(locale, { month: 'long' }),
        weeks,
      });
    }
    return result;
  }, [firstDayOfWeek, locale, year]);

  const hasEvents = useCallback(
    (d: Date) => getEventsForDay(events, d).length > 0,
    [events],
  );

  const handleDayClick = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent, day: Date) => {
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
              {dayLabels.map((wd, i) => (
                <span key={i}>{wd.slice(0, 1)}</span>
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
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleDayClick(e, day);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={day.toLocaleDateString(locale, { dateStyle: 'full' })}
                    >
                      {day.getDate()}
                      <DayGlyphs date={day} resolver={dayGlyphs} config={{ ...dayGlyphConfig, showLabels: false }} />
                      {showWeekNumbers && di === 0 && <span className="sp-sch-year__week-number">W{getWeekNumber(day, weekNumberRule, firstDayOfWeek)}</span>}
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
  timelineScale: SchedulerTimelineScale;
  collapsibleResourceGroups: boolean;
  startHour: number;
  endHour: number;
  unavailableRanges: SchedulerUnavailableHourRange[];
  disabledDates: SchedulerDateRestriction[];
  onEventClick?: (e: EventClickEvent) => void;
  onSlotClick?: (e: SlotClickEvent) => void;
  onSlotDoubleClick?: (e: SlotClickEvent) => void;
  onEventMove?: (e: EventMoveEvent) => void;
  onEventResize?: (e: EventResizeEvent) => void;
}

function TimelineView({
  currentDate,
  events,
  resources,
  numberOfDays,
  timelineScale,
  collapsibleResourceGroups,
  startHour,
  endHour,
  unavailableRanges,
  disabledDates,
  onEventClick,
  onSlotClick,
  onSlotDoubleClick,
  onEventMove,
  onEventResize,
}: TimelineViewProps) {
  const { t, locale } = useI18n();
  const timeHeaderRef = useRef<HTMLDivElement>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

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
    (e: React.MouseEvent | React.KeyboardEvent, ev: SchedulerEvent) => {
      e.stopPropagation();
      onEventClick?.({ event: ev, nativeEvent: e.nativeEvent });
    },
    [onEventClick],
  );

  const handleSlotClick = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent, day: Date, hour: number, resourceId: string | number) => {
      if (isDateRestricted(day, disabledDates)) return;
      const slot: SchedulerSlot = { date: day, hour, minute: 0, resourceId };
      onSlotClick?.({ slot, nativeEvent: e.nativeEvent });
    },
    [disabledDates, onSlotClick],
  );

  const handleSlotDoubleClick = useCallback((e: React.MouseEvent, day: Date, hour: number, resourceId: string | number) => {
    onSlotDoubleClick?.({ slot: { date: day, hour, minute: 0, resourceId }, nativeEvent: e.nativeEvent });
  }, [onSlotDoubleClick]);

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
      if (isDateRestricted(event.start, disabledDates)) return;
      if (
        (e.target as HTMLElement).classList.contains('sp-sch-event__resize--left') ||
        (e.target as HTMLElement).classList.contains('sp-sch-event__resize--right')
      ) return;
      e.preventDefault();
      e.stopPropagation();

      dragRef.current = {
        event: { ...event, start: new Date(event.start), end: new Date(event.end) },
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
    [disabledDates, totalSlots, rangeTotalMinutes, onEventMove],
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
      if (isDateRestricted(event.start, disabledDates)) return;
      e.preventDefault();
      e.stopPropagation();

      resizeRef.current = {
        event: { ...event, start: new Date(event.start), end: new Date(event.end) },
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
    [disabledDates, totalSlots, rangeTotalMinutes, onEventResize],
  );

  return (
    <div className={`sp-sch-timeline sp-sch-timeline--${timelineScale}`} role="grid" aria-label={t('timelineView')}>
      {/* Header */}
      <div className="sp-sch-timeline__header">
        <div className="sp-sch-timeline__res-hd">{t('resource')}</div>
        <div className="sp-sch-timeline__time-hd-wrap" ref={timeHeaderRef}>
          {days.map(day => (
            <div key={day.toISOString()} className="sp-sch-timeline__day-group">
              <div className={`sp-sch-timeline__day-label${isToday(day) ? ' sp-sch-timeline__day-label--today' : ''}`}>
                {formatDayHeader(day, locale)}
              </div>
              <div className="sp-sch-timeline__hours">
                {hours.map(h => (
                  <div key={h} className="sp-sch-timeline__hour-label">{formatHour(h, locale)}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body with resource rows */}
      <div className="sp-sch-timeline__body" onScroll={handleBodyScroll}>
        <div className="sp-sch-timeline__rows">
          {resources.map((res, index) => {
            const previous = resources[index - 1];
            const isGroupStart = Boolean(res.group && (!previous || previous.group !== res.group));
            const groupCollapsed = res.group ? collapsedGroups.has(res.group) : false;
            if (groupCollapsed) return isGroupStart ? (
              <button key={`group-${res.group}`} type="button" className="sp-sch-timeline__group-toggle" aria-expanded="false" onClick={() => setCollapsedGroups((current) => { const next = new Set(current); next.delete(res.group ?? ''); return next; })}>{res.group}</button>
            ) : null;
            return (
              <div key={res.id} className="sp-sch-timeline__resource-wrap">
                {isGroupStart && res.group && collapsibleResourceGroups && (
                  <button type="button" className="sp-sch-timeline__group-toggle" aria-expanded="true" onClick={() => setCollapsedGroups((current) => new Set(current).add(res.group ?? ''))}>{res.group}</button>
                )}
            <div className="sp-sch-timeline__row" role="row">
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
                      role="gridcell"
                      tabIndex={0}
                      onClick={e => handleSlotClick(e, day, h, res.id)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSlotClick(e, day, h, res.id);
                        }
                      }}
                      onDoubleClick={e => handleSlotDoubleClick(e, day, h, res.id)}
                      title={isHourUnavailable(day, h, unavailableRanges)?.label}
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
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleEventClick(e, ev);
                      }
                    }}
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
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
