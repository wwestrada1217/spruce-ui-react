import { useState, useEffect, useRef } from 'react'
import { Scheduler, type SchedulerEvent, type SchedulerResource, type SchedulerView } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

// ── Sample data ──────────────────────────────────────────────────────────────

const today = new Date()
const d = (dayOffset: number, hour = 0, min = 0) => {
  const date = new Date(today)
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hour, min, 0, 0)
  return date
}

const EVENTS: SchedulerEvent[] = [
  { id: 1, title: 'Sprint Planning', start: d(0, 9, 0), end: d(0, 10, 30), color: '#3b82f6' },
  { id: 2, title: 'Design Review', start: d(0, 13, 0), end: d(0, 14, 0), color: '#8b5cf6' },
  { id: 3, title: 'Team Standup', start: d(1, 9, 0), end: d(1, 9, 30), color: '#10b981' },
  { id: 4, title: 'Code Review', start: d(1, 11, 0), end: d(1, 12, 0), color: '#f59e0b' },
  { id: 5, title: 'Client Meeting', start: d(1, 14, 0), end: d(1, 15, 30), color: '#ef4444' },
  { id: 6, title: 'Workshop', start: d(2, 10, 0), end: d(2, 12, 0), color: '#3b82f6' },
  { id: 7, title: 'Lunch & Learn', start: d(2, 12, 30), end: d(2, 13, 30), color: '#10b981' },
  { id: 8, title: 'Product Demo', start: d(3, 15, 0), end: d(3, 16, 0), color: '#8b5cf6' },
  { id: 9, title: 'All Hands', start: d(4, 10, 0), end: d(4, 11, 0), color: '#ef4444', allDay: false },
  { id: 10, title: 'Company Holiday', start: d(5, 0, 0), end: d(5, 23, 59), allDay: true, color: '#10b981' },
  { id: 11, title: 'Board Meeting', start: d(0, 10, 30), end: d(0, 12, 0), color: '#f59e0b' },
  { id: 12, title: 'One-on-One', start: d(1, 15, 30), end: d(1, 16, 0), color: '#8b5cf6' },
  { id: 13, title: 'Architecture Review', start: d(3, 9, 0), end: d(3, 10, 30), color: '#3b82f6' },
  { id: 14, title: 'Retrospective', start: d(4, 14, 0), end: d(4, 15, 0), color: '#f59e0b' },
  { id: 15, title: 'Release Planning', start: d(2, 14, 0), end: d(2, 16, 0), color: '#ef4444' },
]

const RESOURCES: SchedulerResource[] = [
  { id: 'r1', name: 'Conference Room A', color: '#3b82f6' },
  { id: 'r2', name: 'Conference Room B', color: '#10b981' },
  { id: 'r3', name: 'Auditorium', color: '#8b5cf6' },
]

// ── Code snippets ────────────────────────────────────────────────────────────

const BASIC_CODE = `import { Scheduler, type SchedulerEvent } from 'spruce-react'

const events: SchedulerEvent[] = [
  { id: 1, title: 'Sprint Planning', start: new Date('2026-04-16T09:00'), end: new Date('2026-04-16T10:30'), color: '#3b82f6' },
  { id: 2, title: 'Design Review', start: new Date('2026-04-16T13:00'), end: new Date('2026-04-16T14:00'), color: '#8b5cf6' },
]

<Scheduler events={events} />`

const VIEWS_CODE = `<Scheduler
  events={events}
  view="month"
  views={['day', 'week', 'month', 'agenda']}
/>`

const DAY_CODE = `<Scheduler events={events} view="day"
  startHour={8} endHour={18} />`

const MONTH_CODE = `<Scheduler events={events} view="month"
  onSlotClick={(e) => console.log('Slot:', e.slot.date)}
  onEventClick={(e) => console.log('Event:', e.event.title)} />`

const AGENDA_CODE = `<Scheduler events={events} view="agenda"
  agendaDays={14} />`

const RESOURCES_CODE = `const resources: SchedulerResource[] = [
  { id: 'r1', name: 'Room A', color: '#3b82f6' },
  { id: 'r2', name: 'Room B', color: '#10b981' },
]

<Scheduler events={events} resources={resources}
  view="timeline" />`

const CALLBACKS_CODE = `<Scheduler
  events={events}
  onEventClick={(e) => console.log('Clicked:', e.event.title)}
  onSlotClick={(e) => console.log('Slot:', e.slot.date)}
  onViewChange={(view) => console.log('View:', view)}
  onDateChange={(date) => console.log('Date:', date)}
/>`

// ── Sections ─────────────────────────────────────────────────────────────────

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic Usage' },
  { id: 'week-view', label: 'Week View' },
  { id: 'day-view', label: 'Day View' },
  { id: 'month-view', label: 'Month View' },
  { id: 'agenda-view', label: 'Agenda View' },
  { id: 'resources', label: 'Resources' },
  { id: 'callbacks', label: 'Callbacks' },
  { id: 'api', label: 'API Reference' },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export function SchedulerPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    )
    mainRef.current?.querySelectorAll('section[id]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Scheduler</h1>
        <p className="docs-desc">
          A full-featured calendar scheduler with day, week, work week, month, agenda, year,
          and timeline views. Supports event display, navigation, resource management, and
          interactive event manipulation.
        </p>

        <section id="basic" className="demo-section">
          <h2>Basic Usage</h2>
          <p className="section-desc">
            Provide an <code>events</code> array. Each event needs <code>id</code>, <code>title</code>,
            <code>start</code>, and <code>end</code> dates. The default view is week.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ height: 500 }}>
              <Scheduler events={EVENTS} />
            </div>
          </CodePreview>
        </section>

        <section id="week-view" className="demo-section">
          <h2>Week View</h2>
          <p className="section-desc">
            The week view shows 7 columns with hour grid lines. Events are positioned
            by time with overlapping events displayed side by side. The current time
            is marked with a red indicator.
          </p>
          <CodePreview code={VIEWS_CODE}>
            <div style={{ height: 500 }}>
              <Scheduler events={EVENTS} view="week" views={['day', 'week', 'month', 'agenda']} />
            </div>
          </CodePreview>
        </section>

        <section id="day-view" className="demo-section">
          <h2>Day View</h2>
          <p className="section-desc">
            Single day view with configurable <code>startHour</code> and <code>endHour</code> to
            focus on business hours.
          </p>
          <CodePreview code={DAY_CODE}>
            <div style={{ height: 500 }}>
              <Scheduler events={EVENTS} view="day" startHour={8} endHour={18} />
            </div>
          </CodePreview>
        </section>

        <section id="month-view" className="demo-section">
          <h2>Month View</h2>
          <p className="section-desc">
            Calendar grid showing the full month. Events appear as colored dots or bars.
            Overflow events show a "+N more" indicator.
          </p>
          <CodePreview code={MONTH_CODE}>
            <div style={{ height: 500 }}>
              <Scheduler events={EVENTS} view="month" />
            </div>
          </CodePreview>
        </section>

        <section id="agenda-view" className="demo-section">
          <h2>Agenda View</h2>
          <p className="section-desc">
            A chronological list of upcoming events grouped by day. Configure the number
            of days shown with <code>agendaDays</code>.
          </p>
          <CodePreview code={AGENDA_CODE}>
            <div style={{ height: 400 }}>
              <Scheduler events={EVENTS} view="agenda" agendaDays={14} />
            </div>
          </CodePreview>
        </section>

        <section id="resources" className="demo-section">
          <h2>Resources</h2>
          <p className="section-desc">
            Assign events to resources (rooms, people, etc.) using <code>resourceId</code>.
            The timeline view displays resource rows with events positioned horizontally.
          </p>
          <CodePreview code={RESOURCES_CODE}>
            <div style={{ height: 400 }}>
              <Scheduler
                events={EVENTS.map((e, i) => ({ ...e, resourceId: RESOURCES[i % RESOURCES.length].id }))}
                resources={RESOURCES}
                view="timeline"
              />
            </div>
          </CodePreview>
        </section>

        <section id="callbacks" className="demo-section">
          <h2>Callbacks</h2>
          <p className="section-desc">
            Handle user interactions with event and slot click callbacks, plus view and date change events.
          </p>
          <CodePreview code={CALLBACKS_CODE}>
            <div style={{ height: 500 }}>
              <Scheduler
                events={EVENTS}
                onEventClick={(e) => console.log('Clicked:', e.event.title)}
                onSlotClick={(e) => console.log('Slot clicked:', e.slot.date)}
                onViewChange={(view) => console.log('View changed to:', view)}
                onDateChange={(date) => console.log('Date navigated to:', date)}
              />
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API Reference</h2>

          <h3>SchedulerProps</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>events</code></td><td><code>SchedulerEvent[]</code></td><td><code>[]</code></td><td>Event data array</td></tr>
                <tr><td><code>resources</code></td><td><code>SchedulerResource[]</code></td><td><code>[]</code></td><td>Resource definitions</td></tr>
                <tr><td><code>view</code></td><td><code>SchedulerView</code></td><td>'week'</td><td>Initial view</td></tr>
                <tr><td><code>currentDate</code></td><td><code>Date</code></td><td>today</td><td>Initial date</td></tr>
                <tr><td><code>startHour</code></td><td><code>number</code></td><td>0</td><td>Day start hour</td></tr>
                <tr><td><code>endHour</code></td><td><code>number</code></td><td>24</td><td>Day end hour</td></tr>
                <tr><td><code>agendaDays</code></td><td><code>number</code></td><td>7</td><td>Agenda view days</td></tr>
                <tr><td><code>timelineDays</code></td><td><code>number</code></td><td>1</td><td>Timeline view days</td></tr>
                <tr><td><code>views</code></td><td><code>SchedulerView[]</code></td><td>all 7 views</td><td>Enabled views</td></tr>
                <tr><td><code>onEventClick</code></td><td><code>(e) =&gt; void</code></td><td>--</td><td>Event click handler</td></tr>
                <tr><td><code>onSlotClick</code></td><td><code>(e) =&gt; void</code></td><td>--</td><td>Empty slot click handler</td></tr>
                <tr><td><code>onEventMove</code></td><td><code>(e) =&gt; void</code></td><td>--</td><td>Event drag-move handler</td></tr>
                <tr><td><code>onEventResize</code></td><td><code>(e) =&gt; void</code></td><td>--</td><td>Event resize handler</td></tr>
                <tr><td><code>onViewChange</code></td><td><code>(view) =&gt; void</code></td><td>--</td><td>View change handler</td></tr>
                <tr><td><code>onDateChange</code></td><td><code>(date) =&gt; void</code></td><td>--</td><td>Date navigation handler</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: 24 }}>SchedulerEvent</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>id</code></td><td><code>string | number</code></td><td>Unique identifier</td></tr>
                <tr><td><code>title</code></td><td><code>string</code></td><td>Event title</td></tr>
                <tr><td><code>start</code></td><td><code>Date</code></td><td>Start date/time</td></tr>
                <tr><td><code>end</code></td><td><code>Date</code></td><td>End date/time</td></tr>
                <tr><td><code>allDay</code></td><td><code>boolean</code></td><td>All-day event flag</td></tr>
                <tr><td><code>resourceId</code></td><td><code>string | number</code></td><td>Assigned resource</td></tr>
                <tr><td><code>color</code></td><td><code>string</code></td><td>Event color</td></tr>
                <tr><td><code>description</code></td><td><code>string</code></td><td>Event description</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: 24 }}>SchedulerView</h3>
          <p style={{ fontSize: 13, color: 'var(--sp-text-subtle)' }}>
            <code>'day' | 'week' | 'workWeek' | 'month' | 'agenda' | 'year' | 'timeline'</code>
          </p>
        </section>
      </div>

      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a className={`toc-link${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
