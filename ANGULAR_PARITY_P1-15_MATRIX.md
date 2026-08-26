# P1.0-15 Scheduling parity matrix

This matrix records the Angular baseline reviewed for P1.0-15 and the React contract implemented in this repository. Angular-only dependency injection, signals, and directives are represented as controlled props, callbacks, or framework-neutral utilities.

## Reviewed baseline

Angular source packages:

- `../spruce-ng/projects/spruce-ui/scheduler/src/lib/scheduler.ts`
- `../spruce-ng/projects/spruce-ui/scheduler/src/lib/models.ts`
- `../spruce-ng/projects/spruce-ui/scheduler/src/lib/scheduler.utils.ts`
- `../spruce-ng/projects/spruce-ui/scheduler/src/lib/day-view.ts`
- `../spruce-ng/projects/spruce-ui/scheduler/src/lib/month-view.ts`
- `../spruce-ng/projects/spruce-ui/scheduler/src/lib/agenda-view.ts`
- `../spruce-ng/projects/spruce-ui/scheduler/src/lib/year-view.ts`
- `../spruce-ng/projects/spruce-ui/scheduler/src/lib/timeline-view.ts`
- `../spruce-ng/projects/spruce-ui/scheduler/src/lib/scheduler-glyph.styles.ts`
- `../spruce-ng/projects/spruce-ui/gantt/src/lib/gantt-chart.ts`
- `../spruce-ng/projects/spruce-ui/gantt/src/lib/gantt-task-list.ts`
- `../spruce-ng/projects/spruce-ui/gantt/src/lib/gantt-timeline-header.ts`
- `../spruce-ng/projects/spruce-ui/gantt/src/lib/gantt-timeline-body.ts`
- `../spruce-ng/projects/spruce-ui/gantt/src/lib/gantt-task-bar.ts`
- `../spruce-ng/projects/spruce-ui/gantt/src/lib/gantt-milestone.ts`
- `../spruce-ng/projects/spruce-ui/gantt/src/lib/gantt-dependency-overlay.ts`
- `../spruce-ng/projects/spruce-ui/gantt/src/lib/gantt.utils.ts`
- `../spruce-ng/projects/spruce-ui/gantt/src/lib/models.ts`
- `../spruce-ng/projects/spruce-ui/gantt/src/lib/critical-path.service.ts`
- `../spruce-ng/projects/spruce-ui/gantt/src/lib/resource.utils.ts`
- `../spruce-ng/projects/spruce-ui/gantt/src/lib/undo-redo.service.ts`
- `../spruce-ng/projects/spruce-ui/gantt/src/lib/virtual-scroll.ts`

Angular documentation pages:

- `../spruce-ng/projects/docs/src/app/pages/components/scheduler-page.ts`
- `../spruce-ng/projects/docs/src/app/pages/components/gantt-page.ts`

React counterparts inspected:

- `src/components/scheduler/Scheduler.tsx`, `Scheduler.css`, `scheduler-types.ts`, `scheduler-utils.ts`
- `src/components/gantt-chart/GanttChart.tsx`, `GanttChart.css`, `gantt-types.ts`, `gantt-utils.ts`
- `docs/src/pages/components/SchedulerPage.tsx`
- `docs/src/pages/components/GanttPage.tsx`
- `docs/src/App.tsx`, `docs/src/components/nav.ts`

## Scheduler: property and behavior matrix

| Angular feature | React API / behavior | Status and accessibility contract |
|---|---|---|
| `events` and event model | `events?: SchedulerEvent[]`; recurrence, calendar, availability, visibility, reminder, location, category, timezone, occurrence metadata | Implemented. Recurrence rules expand into immutable occurrence objects for the display window; derived auto-all-day events are also cloned. |
| `calendars`, `visibleCalendarIds`, `calendarControls` | `calendars`, controlled `visibleCalendarIds` with `onVisibleCalendarIdsChange`, `calendarControls: 'popover' \| 'sidebar' \| 'none'` | Implemented. Native checkbox-role buttons are keyboard accessible and disabled calendars cannot be toggled. |
| calendar select/clear controls | Calendar panel select-all and clear-all callbacks through the controlled visibility API | Implemented and localized with `useI18n`. |
| `resources` and collapsible resource groups | `resources`, `SchedulerResource.group`, `collapsibleResourceGroups` | Implemented in timeline view with controlled event resource IDs and keyboard-operable group buttons. |
| day glyphs | `dayGlyphs: SchedulerDayGlyphResolver`, `dayGlyphConfig` | Implemented for day/month/year headers. Supports icon, avatar URL, semantic tone, labels, and accessible labels. |
| `view`, `views`, current date navigation | `view`, `views`, `currentDate`, `onViewChange`, `onDateChange` | Implemented as controlled initial/override props with native buttons and tab semantics. |
| time range and scale | `startHour`, `endHour`, `timeScale`, `showTimeScaleLines` | Implemented. Minute snapping uses the configured scale; minor lines can be hidden. |
| disabled dates | `disabledDates: SchedulerDateRestriction[]` | Implemented for slot creation and move/resize guards. Disabled slots expose disabled styling and do not invoke creation. |
| unavailable hours | `unavailableHours` / `unavailableRanges` | Implemented with range labels, unavailable styling, and move/resize/create protection. |
| timeline range and scale | `timelineDays`, `timelineScale` | Implemented for time/day/week/month/year timeline modes. |
| week-number variants | `showWeekNumbers` alias plus `showDayWeekNumbers`, `showWeekViewWeekNumbers`, `showWorkWeekWeekNumbers`, `showMonthWeekNumbers`, `showYearWeekNumbers`, `weekNumberRule` | Implemented with ISO and locale rules. Week labels are rendered in headers/cells and use the localized first day of week. |
| event details popover aliases | `showEventDetailsPopover`, `showEventPopover`, `showEventDetails` | Implemented as a controlled edit dialog opened from event activation. |
| event click and slot click | `onEventClick`, `onSlotClick` with native event metadata | Implemented for mouse and keyboard activation. |
| event move and resize | `onEventMove`, `onEventResize` | Implemented with immutable drag/resize payloads, date restrictions, unavailable ranges, and optional conflict blocking. |
| event CRUD | `onEventCreate`, `onEventUpdate`, `onEventDelete` | Implemented through double-click slot creation and event edit dialog. Consumers own the event array. |
| conflict detection | `detectConflict` / `detectConflicts`, `hasEventConflict` | Implemented for move, resize, and CRUD save. Announces a localized-region alert when the operation is rejected. |
| auto all-day | `autoAllDay`, `enableAutoAllDay`, `autoAllDayThresholdHours` | Implemented as a derived display behavior without mutating caller data. |
| chrome, radius, border, scroll indicators | Existing `chrome`, `radius`, `border`, `showScrollIndicators` props retained and wired to scheduler classes/behavior | Implemented with Spruce chrome classes and token-based CSS. |

## Scheduler: event and accessibility matrix

| Interaction | React callback payload | Keyboard / RTL / i18n behavior |
|---|---|---|
| Event activation | `EventClickEvent { event, nativeEvent }` | Event surfaces use button semantics and Enter/Space activation; labels come from event titles. |
| Empty slot activation | `SlotClickEvent { slot, nativeEvent }` | Grid cells are keyboard-addressable; double-click opens CRUD creation where allowed. |
| Move / resize | `EventMoveEvent` and `EventResizeEvent` | Dragging never mutates props; restricted/unavailable/conflicting destinations are rejected. CSS uses logical layout ownership and theme tokens. |
| View/date navigation | `onViewChange`, `onDateChange` | Native buttons work with keyboard; dates, months, weekdays, and view labels use `useI18n`, including RTL direction from `SpruceProvider`. |
| Calendar visibility | `onVisibleCalendarIdsChange` | Checkbox-role buttons expose `aria-checked`, disabled state, and localized group labels. |
| Editor CRUD | CRUD callbacks receive the resulting `SchedulerEvent` | Dialog has `role="dialog"`, `aria-modal`, labels, native form controls, and keyboard submit/cancel behavior. |

## Gantt: property and behavior matrix

| Angular feature | React API / behavior | Status and accessibility contract |
|---|---|---|
| task hierarchy and list chrome | `GanttTask.parentId`, `GanttChart` task list/treegrid | Implemented with expand/collapse state that can be controlled by `expandedIds` / `onExpandedIdsChange`. |
| full chart configuration | `GanttConfig`, `GANTT_DEFAULT_CONFIG`, `config?: Partial<GanttConfig>` | Implemented: scale, dimensions, progress, resources, critical path, dependencies, editability, virtual-scroll settings, undo capacity, and theme. |
| task selection | `selectedTaskId` / `onSelectedTaskIdChange` | Implemented as controlled selection with `aria-selected`. |
| time scale and toolbar | `timeScale`, `onTimeScaleChange`, zoom controls | Implemented with native toolbar buttons and localized labels. |
| dependencies | `GanttDependency`, `showDependencies`, `onDependencyClick` | Implemented. Dependency paths are keyboard-operable buttons with dependency payload and original event metadata. |
| critical path | `showCriticalPath`, `computeCriticalPath` | Implemented with a framework-neutral longest dependency chain utility and critical bar styling. |
| resources / overallocations | `GanttResource`, `detectOverallocations` | Implemented as typed data and exported utility; resource display remains controlled by config. |
| task move / resize | `onTaskMove`, `onTaskResize` | Implemented with old/new dates, edge metadata, and `originalEvent`. |
| task click / double-click | `onTaskClick`, `onTaskDblClick` | Implemented for task rows and bars; row and bar activation retain native event metadata. |
| milestone click | `onMilestoneClick` | Implemented with keyboard activation and `originalEvent`. |
| slot click | `onSlotClick` with optional `taskId` | Implemented for timeline slots, including the source event. |
| undo/redo service | `GanttUndoRedo`, `GanttCommand`, `maxUndoSteps` | Implemented as an exported bounded, framework-neutral service for controlled hosts. |
| virtual scroll math | `GanttVirtualScroll`, `enableVirtualScroll`, `virtualScrollOverscan` | Implemented as an exported deterministic range utility for controlled virtualization hosts. |
| RTL and themes | root direction inheritance, Spruce chrome classes, token-based states | Implemented; layout direction follows `SpruceProvider`, and dark-theme selectors/tokens are retained. |

## Verification targets

Focused tests in `tests/react/p1-15-scheduling-parity.test.tsx` cover controlled calendar visibility, CRUD/event activation, RTL/dark-theme rendering, Gantt critical-path/dependency metadata, and framework-neutral Gantt utilities. The repository verification commands remain:

```text
npm run build
npm run docs:build
npm run lint
npm run test:type
npm run test:unit -- tests/react/p1-15-scheduling-parity.test.tsx
```
