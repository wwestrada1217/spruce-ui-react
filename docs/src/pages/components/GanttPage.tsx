import { useState, useEffect, useRef } from 'react'
import { GanttChart, type GanttTask, type GanttDependency, type GanttMilestone, type GanttResource } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

// ── Sample data ──────────────────────────────────────────────────────────────

const today = new Date()
const d = (offset: number) => {
  const date = new Date(today)
  date.setDate(date.getDate() + offset)
  date.setHours(0, 0, 0, 0)
  return date
}

const TASKS: GanttTask[] = [
  { id: 1, title: 'Project Planning', start: d(-2), end: d(3), progress: 1.0, color: '#8b5cf6' },
  { id: 2, title: 'Requirements Gathering', start: d(0), end: d(5), progress: 0.7, parentId: 1 },
  { id: 3, title: 'Technical Design', start: d(3), end: d(8), progress: 0.3, parentId: 1 },
  { id: 4, title: 'Frontend Development', start: d(5), end: d(18), progress: 0.4, color: '#3b82f6', resourceId: 'r1' },
  { id: 5, title: 'Component Library', start: d(5), end: d(12), progress: 0.6, parentId: 4, resourceId: 'r1' },
  { id: 6, title: 'Page Templates', start: d(10), end: d(16), progress: 0.2, parentId: 4, resourceId: 'r2' },
  { id: 7, title: 'Integration', start: d(14), end: d(18), progress: 0, parentId: 4, resourceId: 'r1' },
  { id: 8, title: 'Backend API', start: d(3), end: d(15), progress: 0.5, color: '#10b981', resourceId: 'r3' },
  { id: 9, title: 'Database Schema', start: d(3), end: d(7), progress: 0.9, parentId: 8, resourceId: 'r3' },
  { id: 10, title: 'REST Endpoints', start: d(6), end: d(13), progress: 0.4, parentId: 8, resourceId: 'r3' },
  { id: 11, title: 'Authentication', start: d(8), end: d(15), progress: 0.2, parentId: 8, resourceId: 'r4' },
  { id: 12, title: 'Testing', start: d(16), end: d(22), progress: 0, color: '#f59e0b', resourceId: 'r2' },
  { id: 13, title: 'Unit Tests', start: d(16), end: d(19), progress: 0, parentId: 12 },
  { id: 14, title: 'Integration Tests', start: d(18), end: d(22), progress: 0, parentId: 12 },
  { id: 15, title: 'Deployment', start: d(22), end: d(25), progress: 0, color: '#ef4444' },
]

const DEPS: GanttDependency[] = [
  { id: 'd1', fromId: 3, toId: 4, type: 'FS' },
  { id: 'd2', fromId: 3, toId: 8, type: 'FS' },
  { id: 'd3', fromId: 5, toId: 6, type: 'FS' },
  { id: 'd4', fromId: 10, toId: 7, type: 'FS' },
  { id: 'd5', fromId: 7, toId: 12, type: 'FS' },
  { id: 'd6', fromId: 14, toId: 15, type: 'FS' },
]

const MILESTONES: GanttMilestone[] = [
  { id: 'm1', title: 'Design Complete', date: d(8), color: '#8b5cf6' },
  { id: 'm2', title: 'Alpha Release', date: d(18), color: '#3b82f6' },
  { id: 'm3', title: 'Go Live', date: d(25), color: '#ef4444' },
]

const RESOURCES: GanttResource[] = [
  { id: 'r1', name: 'Alice Chen', color: '#3b82f6' },
  { id: 'r2', name: 'Bob Martinez', color: '#10b981' },
  { id: 'r3', name: 'Carol Johnson', color: '#f59e0b' },
  { id: 'r4', name: 'David Kim', color: '#8b5cf6' },
]

// ── Code snippets ────────────────────────────────────────────────────────────

const BASIC_CODE = `import { GanttChart, type GanttTask } from 'spruce-react'

const tasks: GanttTask[] = [
  { id: 1, title: 'Planning', start: new Date('2026-04-10'), end: new Date('2026-04-15'), progress: 1.0 },
  { id: 2, title: 'Development', start: new Date('2026-04-14'), end: new Date('2026-04-28'), progress: 0.4 },
  { id: 3, title: 'Testing', start: new Date('2026-04-26'), end: new Date('2026-05-02'), progress: 0 },
]

<GanttChart tasks={tasks} />`

const DEPS_CODE = `const dependencies: GanttDependency[] = [
  { id: 'd1', fromId: 1, toId: 2, type: 'FS' },
  { id: 'd2', fromId: 2, toId: 3, type: 'FS' },
]

<GanttChart tasks={tasks} dependencies={dependencies} />`

const MILESTONES_CODE = `const milestones: GanttMilestone[] = [
  { id: 'm1', title: 'Alpha Release', date: new Date('2026-04-18'), color: '#3b82f6' },
  { id: 'm2', title: 'Go Live', date: new Date('2026-05-02'), color: '#ef4444' },
]

<GanttChart tasks={tasks} milestones={milestones} />`

const RESOURCES_CODE = `const resources: GanttResource[] = [
  { id: 'r1', name: 'Alice Chen', color: '#3b82f6' },
  { id: 'r2', name: 'Bob Martinez', color: '#10b981' },
]

<GanttChart tasks={tasks} resources={resources}
  config={{ showResources: true }} />`

const EDITABLE_CODE = `<GanttChart tasks={tasks} dependencies={dependencies}
  config={{ editable: true }}
  onTaskMove={(e) => console.log('Moved:', e.task.title)}
  onTaskResize={(e) => console.log('Resized:', e.task.title)} />`

const SCALE_CODE = `// Auto-detected based on project duration
<GanttChart tasks={tasks} config={{ timeScale: 'week' }} />`

const FULL_CODE = `<GanttChart
  tasks={tasks}
  dependencies={dependencies}
  milestones={milestones}
  resources={resources}
  config={{
    showDependencies: true,
    showProgress: true,
    showResources: true,
    rowHeight: 36,
  }}
  onTaskClick={(e) => console.log('Clicked:', e.task.title)}
/>`

// ── Sections ─────────────────────────────────────────────────────────────────

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'basic', label: 'Basic Usage' },
  { id: 'dependencies', label: 'Dependencies' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'resources', label: 'Resources' },
  { id: 'editable', label: 'Editable' },
  { id: 'scales', label: 'Time Scales' },
  { id: 'full', label: 'Full Example' },
  { id: 'api', label: 'API Reference' },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export function GanttPage() {
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
        <h1>Gantt Chart</h1>
        <p className="docs-desc">
          A project management Gantt chart with task hierarchy, dependencies, milestones,
          resource assignment, progress tracking, and interactive editing.
        </p>

        <section id="basic" className="demo-section">
          <h2>Basic Usage</h2>
          <p className="section-desc">
            Provide a <code>tasks</code> array with <code>id</code>, <code>title</code>,
            <code>start</code>, and <code>end</code> dates. Tasks are displayed as bars on a timeline.
          </p>
          <CodePreview code={BASIC_CODE}>
            <div style={{ height: 400 }}>
              <GanttChart tasks={TASKS.slice(0, 5)} />
            </div>
          </CodePreview>
        </section>

        <section id="dependencies" className="demo-section">
          <h2>Dependencies</h2>
          <p className="section-desc">
            Add dependency arrows between tasks using <code>dependencies</code>.
            Supports Finish-to-Start (FS), Start-to-Start (SS), Finish-to-Finish (FF),
            and Start-to-Finish (SF) types.
          </p>
          <CodePreview code={DEPS_CODE}>
            <div style={{ height: 400 }}>
              <GanttChart tasks={TASKS} dependencies={DEPS} />
            </div>
          </CodePreview>
        </section>

        <section id="milestones" className="demo-section">
          <h2>Milestones</h2>
          <p className="section-desc">
            Milestones are diamond-shaped markers at specific dates.
          </p>
          <CodePreview code={MILESTONES_CODE}>
            <div style={{ height: 400 }}>
              <GanttChart tasks={TASKS} milestones={MILESTONES} />
            </div>
          </CodePreview>
        </section>

        <section id="resources" className="demo-section">
          <h2>Resources</h2>
          <p className="section-desc">
            Assign resources to tasks via <code>resourceId</code>. Resource names and colors
            appear in the task list when <code>showResources</code> is enabled.
          </p>
          <CodePreview code={RESOURCES_CODE}>
            <div style={{ height: 400 }}>
              <GanttChart tasks={TASKS} resources={RESOURCES} config={{ showResources: true }} />
            </div>
          </CodePreview>
        </section>

        <section id="editable" className="demo-section">
          <h2>Editable</h2>
          <p className="section-desc">
            Set <code>editable: true</code> to allow dragging task bars to move them,
            or dragging their edges to resize.
          </p>
          <CodePreview code={EDITABLE_CODE}>
            <div style={{ height: 400 }}>
              <GanttChart
                tasks={TASKS}
                dependencies={DEPS}
                config={{ editable: true }}
                onTaskMove={(e) => console.log('Moved:', e.task.title, e.newStart, e.newEnd)}
                onTaskResize={(e) => console.log('Resized:', e.task.title, e.edge)}
              />
            </div>
          </CodePreview>
        </section>

        <section id="scales" className="demo-section">
          <h2>Time Scales</h2>
          <p className="section-desc">
            Switch between Hour, Day, Week, and Month scales using the toolbar or
            the <code>timeScale</code> config option.
          </p>
          <CodePreview code={SCALE_CODE}>
            <div style={{ height: 400 }}>
              <GanttChart tasks={TASKS} config={{ timeScale: 'week' }} />
            </div>
          </CodePreview>
        </section>

        <section id="full" className="demo-section">
          <h2>Full Example</h2>
          <p className="section-desc">
            All features combined: hierarchy, dependencies, milestones, resources, and progress.
          </p>
          <CodePreview code={FULL_CODE}>
            <div style={{ height: 500 }}>
              <GanttChart
                tasks={TASKS}
                dependencies={DEPS}
                milestones={MILESTONES}
                resources={RESOURCES}
                config={{ showDependencies: true, showProgress: true, showResources: true }}
                onTaskClick={(e) => console.log('Clicked:', e.task.title)}
              />
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API Reference</h2>

          <h3>GanttChartProps</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>tasks</code></td><td><code>GanttTask[]</code></td><td>Required</td><td>Task data array</td></tr>
                <tr><td><code>milestones</code></td><td><code>GanttMilestone[]</code></td><td><code>[]</code></td><td>Milestone markers</td></tr>
                <tr><td><code>dependencies</code></td><td><code>GanttDependency[]</code></td><td><code>[]</code></td><td>Task dependency arrows</td></tr>
                <tr><td><code>resources</code></td><td><code>GanttResource[]</code></td><td><code>[]</code></td><td>Resource definitions</td></tr>
                <tr><td><code>config</code></td><td><code>GanttConfig</code></td><td><code>{'{}'}</code></td><td>Configuration options</td></tr>
                <tr><td><code>onTaskClick</code></td><td><code>(e) =&gt; void</code></td><td>--</td><td>Task click handler</td></tr>
                <tr><td><code>onTaskMove</code></td><td><code>(e) =&gt; void</code></td><td>--</td><td>Task drag-move handler</td></tr>
                <tr><td><code>onTaskResize</code></td><td><code>(e) =&gt; void</code></td><td>--</td><td>Task edge-resize handler</td></tr>
                <tr><td><code>onMilestoneClick</code></td><td><code>(e) =&gt; void</code></td><td>--</td><td>Milestone click handler</td></tr>
                <tr><td><code>onSlotClick</code></td><td><code>(e) =&gt; void</code></td><td>--</td><td>Empty slot click handler</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: 24 }}>GanttTask</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>id</code></td><td><code>string | number</code></td><td>Unique identifier</td></tr>
                <tr><td><code>title</code></td><td><code>string</code></td><td>Task name</td></tr>
                <tr><td><code>start</code></td><td><code>Date</code></td><td>Start date</td></tr>
                <tr><td><code>end</code></td><td><code>Date</code></td><td>End date</td></tr>
                <tr><td><code>progress</code></td><td><code>number</code></td><td>Completion (0-1)</td></tr>
                <tr><td><code>parentId</code></td><td><code>string | number | null</code></td><td>Parent task ID for hierarchy</td></tr>
                <tr><td><code>resourceId</code></td><td><code>string | number</code></td><td>Assigned resource ID</td></tr>
                <tr><td><code>color</code></td><td><code>string</code></td><td>Bar color override</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: 24 }}>GanttConfig</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>timeScale</code></td><td><code>'hour' | 'day' | 'week' | 'month'</code></td><td>'day'</td><td>Time scale</td></tr>
                <tr><td><code>rowHeight</code></td><td><code>number</code></td><td>36</td><td>Row height in px</td></tr>
                <tr><td><code>taskListWidth</code></td><td><code>number</code></td><td>300</td><td>Task list panel width</td></tr>
                <tr><td><code>showDependencies</code></td><td><code>boolean</code></td><td>true</td><td>Show dependency arrows</td></tr>
                <tr><td><code>showProgress</code></td><td><code>boolean</code></td><td>true</td><td>Show progress bars</td></tr>
                <tr><td><code>showResources</code></td><td><code>boolean</code></td><td>true</td><td>Show resource column</td></tr>
                <tr><td><code>editable</code></td><td><code>boolean</code></td><td>false</td><td>Enable drag/resize editing</td></tr>
              </tbody>
            </table>
          </div>
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
