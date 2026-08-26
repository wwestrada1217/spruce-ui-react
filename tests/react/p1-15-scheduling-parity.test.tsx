import { fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  GanttChart,
  GanttUndoRedo,
  GanttVirtualScroll,
  Scheduler,
  computeCriticalPath,
  detectOverallocations,
  expandRecurringEvents,
  type GanttCommand,
  type GanttDependency,
  type GanttTask,
  type SchedulerEvent,
} from '../../src/index.js';
import { renderWithRtl, renderWithSpruce, renderWithTheme } from '../utils/test-utils.js';

const day = new Date(2026, 0, 6);
const workEvent: SchedulerEvent = {
  id: 'work-event',
  title: 'Work meeting',
  start: new Date(2026, 0, 6, 9),
  end: new Date(2026, 0, 6, 10),
  calendarId: 'work',
};
const personalEvent: SchedulerEvent = {
  id: 'personal-event',
  title: 'Personal appointment',
  start: new Date(2026, 0, 6, 11),
  end: new Date(2026, 0, 6, 12),
  calendarId: 'personal',
};

const tasks: GanttTask[] = [
  { id: 'design', title: 'Design', start: new Date(2026, 0, 1), end: new Date(2026, 0, 5), resourceId: 'alice' },
  { id: 'build', title: 'Build', start: new Date(2026, 0, 5), end: new Date(2026, 0, 12), resourceId: 'alice' },
];
const dependencies: GanttDependency[] = [
  { id: 'design-build', fromId: 'design', toId: 'build', type: 'FS' },
];

describe('P1.0-15 scheduling parity', () => {
  it('keeps calendar visibility controlled and emits event activation metadata', async () => {
    const clicked = vi.fn();
    function Host() {
      const [visible, setVisible] = useState<Array<string | number>>(['work']);
      return (
        <Scheduler
          events={[workEvent, personalEvent]}
          calendars={[
            { id: 'work', name: 'Work', color: '#3b82f6' },
            { id: 'personal', name: 'Personal', color: '#10b981' },
          ]}
          calendarControls="sidebar"
          visibleCalendarIds={visible}
          onVisibleCalendarIdsChange={setVisible}
          currentDate={day}
          view="day"
          showEventDetailsPopover={false}
          onEventClick={clicked}
        />
      );
    }

    const view = renderWithSpruce(<Host />);
    expect(view.getByRole('button', { name: /Work meeting from/i })).toBeInTheDocument();
    expect(view.queryByRole('button', { name: /Personal appointment from/i })).not.toBeInTheDocument();

    await view.user.click(view.getByRole('checkbox', { name: 'Personal' }));
    expect(view.getByRole('button', { name: /Personal appointment from/i })).toBeInTheDocument();
    const eventButton = view.getByRole('button', { name: /Work meeting from/i });
    eventButton.focus();
    await view.user.keyboard('{Enter}');
    expect(clicked).toHaveBeenCalledWith(expect.objectContaining({ event: workEvent, nativeEvent: expect.any(KeyboardEvent) }));
  });

  it('supports controlled event creation from a keyboard-accessible slot workflow', async () => {
    const created = vi.fn();
    const view = renderWithSpruce(
      <Scheduler events={[]} currentDate={day} view="day" onEventCreate={created} />,
    );
    const slot = view.getAllByRole('gridcell')[0];
    await view.user.dblClick(slot);
    const dialog = view.getByRole('dialog');
    const title = view.getByRole('textbox', { name: 'Title' });
    await view.user.type(title, 'New planning block');
    await view.user.click(view.getByRole('button', { name: 'Save' }));
    expect(created).toHaveBeenCalledWith(expect.objectContaining({ title: 'New planning block' }));
    expect(dialog).not.toBeInTheDocument();
  });

  it('keeps scheduling surfaces localized and direction-aware in RTL/dark themes', () => {
    const rtl = renderWithRtl(<Scheduler events={[]} currentDate={day} view="month" showMonthWeekNumbers />);
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
    expect(rtl.container.querySelector('.sp-sch')).toBeInTheDocument();

    const dark = renderWithTheme(<Scheduler events={[]} currentDate={day} view="month" />, 'dark');
    expect(dark.container.querySelector('.sp-sch')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('emits Gantt dependency and double-click callbacks with original events', async () => {
    const dependencyClicked = vi.fn();
    const doubleClicked = vi.fn();
    const view = renderWithSpruce(
      <GanttChart
        tasks={tasks}
        dependencies={dependencies}
        config={{ showCriticalPath: true }}
        onDependencyClick={dependencyClicked}
        onTaskDblClick={doubleClicked}
      />,
    );

    expect(view.container.querySelectorAll('.sp-gantt__bar--critical')).toHaveLength(2);
    const dependencyPath = view.container.querySelector('path[role="button"]');
    expect(dependencyPath).toBeInTheDocument();
    fireEvent.click(dependencyPath!);
    expect(dependencyClicked).toHaveBeenCalledWith(expect.objectContaining({ dependency: dependencies[0], originalEvent: expect.any(MouseEvent) }));

    await view.user.dblClick(view.getByRole('button', { name: /Design,/i }));
    expect(doubleClicked).toHaveBeenCalledWith(expect.objectContaining({ task: tasks[0], originalEvent: expect.any(MouseEvent) }));
  });

  it('provides critical-path, over-allocation, undo, and virtual-scroll utilities', () => {
    expect(computeCriticalPath(tasks, dependencies)).toEqual(new Set(['design', 'build']));
    expect(detectOverallocations(tasks)).toHaveLength(0);

    const history = new GanttUndoRedo(1);
    const state = { value: 0 };
    const command: GanttCommand = {
      description: 'increment',
      execute: () => { state.value += 1; },
      undo: () => { state.value -= 1; },
    };
    history.execute(command);
    expect(state.value).toBe(1);
    history.undo();
    expect(state.value).toBe(0);
    history.redo();
    expect(state.value).toBe(1);

    expect(new GanttVirtualScroll().getRange(100, 36, 360, 720, 2)).toEqual({ start: 18, end: 32, offset: 648 });

    const recurring = expandRecurringEvents([
      { id: 'daily', title: 'Daily standup', start: new Date(2026, 0, 1, 9), end: new Date(2026, 0, 1, 10), recurrence: 'daily' },
    ], { start: new Date(2026, 0, 1), end: new Date(2026, 0, 4) });
    expect(recurring).toHaveLength(3);
    expect(recurring[1].occurrenceId).toBe('daily:1');
  });
});
