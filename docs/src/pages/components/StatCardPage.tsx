import { useState, useEffect, useRef } from 'react'
import { StatCard, StatDivider, StatGroup } from 'spruce-react'
import { CodePreview } from '../../components/CodePreview'

// ── Inline sparkline SVG ──────────────────────────────────────────────────────

interface SparklineProps {
  values: number[]
  color?: string
  fill?: string
  height?: number
}

function Sparkline({ values, color = '#2563eb', fill, height = 52 }: SparklineProps) {
  if (values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const w = 200
  const h = height
  const pad = 4
  const step = (w) / (values.length - 1)
  const pts = values.map((v, i) => ({
    x: i * step,
    y: pad + ((max - v) / range) * (h - pad * 2),
  }))
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`
  const last = pts[pts.length - 1]
  const resolvedFill = fill ?? color

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: `${h}px`, display: 'block' }}
    >
      <path d={areaPath} fill={resolvedFill} fillOpacity={0.12} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} />
      <circle cx={last.x} cy={last.y} r={2.5} fill={color} />
    </svg>
  )
}

const SPARK_UP   = [14, 18, 15, 20, 22, 19, 24, 21, 26, 28, 25, 30]
const SPARK_DOWN = [32, 30, 28, 31, 27, 25, 24, 26, 22, 20, 21, 18]
const SPARK_FLAT = [10, 11, 9, 12, 10, 11, 10, 12, 11, 10, 11, 10]

// ── Code snippets ─────────────────────────────────────────────────────────────

const FLAT_CODE = `<StatCard label="Revenue"    value="$24.5k" change="+12.3%" trend="up" />
<StatCard label="Users"      value="4,291"  change="+8.1%"  trend="up" />
<StatCard label="Orders"     value="1,342"  change="−2.4%"  trend="down" />
<StatCard label="Conversion" value="3.2%"   change="+0.6%"  trend="up" />`

const NO_CHANGE_CODE = `{/* Omit change to hide the trend indicator */}
<StatCard label="Total Revenue" value="$124.5k" />
<StatCard label="Active Users"  value="12,841" />
<StatCard label="Open Tickets"  value="37" />`

const ICON_CODE = `<StatCard variant="icon" icon="dollar-sign"   iconColor="blue"   label="Revenue"    value="$24.5k" change="+12.3%" trend="up" />
<StatCard variant="icon" icon="users"         iconColor="green"  label="Users"      value="4,291"  change="+8.1%"  trend="up" />
<StatCard variant="icon" icon="shopping-cart" iconColor="amber"  label="Orders"     value="1,342"  change="−2.4%"  trend="down" />
<StatCard variant="icon" icon="percent"       iconColor="purple" label="Conversion" value="3.2%"   change="+0.6%"  trend="up" />`

const ICON_COLORS_CODE = `<StatCard variant="icon" icon="zap"          iconColor="blue"   label="Blue"   value="100" />
<StatCard variant="icon" icon="leaf"         iconColor="green"  label="Green"  value="100" />
<StatCard variant="icon" icon="flame"        iconColor="amber"  label="Amber"  value="100" />
<StatCard variant="icon" icon="alert-circle" iconColor="red"    label="Red"    value="100" />
<StatCard variant="icon" icon="star"         iconColor="purple" label="Purple" value="100" />`

const TREND_CODE = `<StatCard variant="trend" label="Revenue" value="$24.5k" change="+12.3%" trend="up">
  {/* pass a sparkline chart as children */}
  <YourSparklineChart />
</StatCard>`

const TREND_COLORS_CODE = `<StatCard label="Upward"   value="4,291" change="+8.1%"  trend="up" />
<StatCard label="Downward" value="1,342" change="−2.4%"  trend="down" />
<StatCard label="Neutral"  value="3.2%"  change="±0.0%"  trend="neutral" />`

const INLINE_CODE = `<StatGroup variant="strip" bordered ariaLabel="Account metrics">
  <StatCard variant="inline" icon="users" label="Users" value="4,291" change="+8.1%" trend="up" />
  <StatDivider />
  <StatCard variant="inline" icon="shopping-cart" label="Orders" value="1,342" />
</StatGroup>`

const GROUP_CODE = `<StatGroup variant="grid" bordered>
  <StatCard label="Revenue" value="$24.5k" />
  <StatCard label="Users" value="4,291" />
  <StatCard label="Orders" value="1,342" />
</StatGroup>`

// ── Sections ──────────────────────────────────────────────────────────────────

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'flat',           label: 'Flat' },
  { id: 'no-change',      label: 'Without Change' },
  { id: 'icon',           label: 'Icon' },
  { id: 'icon-colors',    label: 'Icon Colors' },
  { id: 'trend',          label: 'Trend + Sparkline' },
  { id: 'trend-colors',   label: 'Trend Colors' },
  { id: 'inline',         label: 'Inline & Groups' },
  { id: 'dashboard-grid', label: 'Dashboard Grid' },
  { id: 'api',            label: 'API' },
]

const grid4: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 12,
}

const grid3: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 12,
}

const grid5: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: 12,
}

export function StatCardPage() {
  const [activeSection, setActiveSection] = useState('flat')
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
        <h1>Stat Card</h1>
        <p className="docs-desc">
          A KPI card for dashboard and overview layouts. Three visual variants — flat, icon, and
          trend — let you match the density and emphasis you need. The <code>trend</code> variant
          accepts any chart component as children, making sparklines a first-class use case.
        </p>

        <section id="flat" className="demo-section" aria-labelledby="flat-heading">
          <h2 id="flat-heading">Flat</h2>
          <p className="section-desc">
            The default variant. Label, large value, and a colour-coded change indicator. Works
            well in dense layouts.
          </p>
          <CodePreview code={FLAT_CODE}>
            <div style={grid4}>
              <StatCard label="Revenue"    value="$24.5k" change="+12.3%" trend="up" />
              <StatCard label="Users"      value="4,291"  change="+8.1%"  trend="up" />
              <StatCard label="Orders"     value="1,342"  change="−2.4%"  trend="down" />
              <StatCard label="Conversion" value="3.2%"   change="+0.6%"  trend="up" />
            </div>
          </CodePreview>
        </section>

        <section id="no-change" className="demo-section" aria-labelledby="no-change-heading">
          <h2 id="no-change-heading">Without Change</h2>
          <p className="section-desc">
            Leave <code>change</code> empty to hide the trend indicator entirely.
          </p>
          <CodePreview code={NO_CHANGE_CODE}>
            <div style={grid3}>
              <StatCard label="Total Revenue" value="$124.5k" />
              <StatCard label="Active Users"  value="12,841" />
              <StatCard label="Open Tickets"  value="37" />
            </div>
          </CodePreview>
        </section>

        <section id="icon" className="demo-section" aria-labelledby="icon-heading">
          <h2 id="icon-heading">Icon</h2>
          <p className="section-desc">
            A colour-coded icon tile sits on the left for quick visual scanning. Use{' '}
            <code>icon</code> (any Lucide name) and <code>iconColor</code> to match the
            metric's meaning.
          </p>
          <CodePreview code={ICON_CODE}>
            <div style={grid4}>
              <StatCard variant="icon" icon="dollar-sign"   iconColor="blue"   label="Revenue"    value="$24.5k" change="+12.3%" trend="up" />
              <StatCard variant="icon" icon="users"         iconColor="green"  label="Users"      value="4,291"  change="+8.1%"  trend="up" />
              <StatCard variant="icon" icon="shopping-cart" iconColor="amber"  label="Orders"     value="1,342"  change="−2.4%"  trend="down" />
              <StatCard variant="icon" icon="percent"       iconColor="purple" label="Conversion" value="3.2%"   change="+0.6%"  trend="up" />
            </div>
          </CodePreview>
        </section>

        <section id="icon-colors" className="demo-section" aria-labelledby="icon-colors-heading">
          <h2 id="icon-colors-heading">Icon Colors</h2>
          <p className="section-desc">
            Five pre-defined colour tokens: <code>blue</code>, <code>green</code>,{' '}
            <code>amber</code>, <code>red</code>, and <code>purple</code>.
          </p>
          <CodePreview code={ICON_COLORS_CODE}>
            <div style={grid5}>
              <StatCard variant="icon" icon="zap"          iconColor="blue"   label="Blue"   value="100" />
              <StatCard variant="icon" icon="leaf"         iconColor="green"  label="Green"  value="100" />
              <StatCard variant="icon" icon="flame"        iconColor="amber"  label="Amber"  value="100" />
              <StatCard variant="icon" icon="alert-circle" iconColor="red"    label="Red"    value="100" />
              <StatCard variant="icon" icon="star"         iconColor="purple" label="Purple" value="100" />
            </div>
          </CodePreview>
        </section>

        <section id="trend" className="demo-section" aria-labelledby="trend-heading">
          <h2 id="trend-heading">Trend (with Sparkline)</h2>
          <p className="section-desc">
            The <code>trend</code> variant lays out the label and change badge on a top row, the
            big value below it, and reserves a chart area via <code>children</code>. Drop in any
            sparkline or mini chart and it snaps flush to the card edges.
          </p>
          <CodePreview code={TREND_CODE}>
            <div style={grid4}>
              <StatCard variant="trend" label="Revenue"    value="$24.5k" change="+12.3%" trend="up">
                <Sparkline values={SPARK_UP} color="#16a34a" />
              </StatCard>
              <StatCard variant="trend" label="Users"      value="4,291"  change="+8.1%"  trend="up">
                <Sparkline values={SPARK_UP} color="#16a34a" />
              </StatCard>
              <StatCard variant="trend" label="Orders"     value="1,342"  change="−2.4%"  trend="down">
                <Sparkline values={SPARK_DOWN} color="#dc2626" />
              </StatCard>
              <StatCard variant="trend" label="Churn Rate" value="0.8%"   change="−0.3%"  trend="up">
                <Sparkline values={SPARK_FLAT} color="#718096" />
              </StatCard>
            </div>
          </CodePreview>
        </section>

        <section id="trend-colors" className="demo-section" aria-labelledby="trend-colors-heading">
          <h2 id="trend-colors-heading">Trend Change Colours</h2>
          <p className="section-desc">
            The <code>trend</code> prop controls the colour of the change badge.{' '}
            <code>"up"</code> → green, <code>"down"</code> → red, <code>"neutral"</code> → grey
            (default).
          </p>
          <CodePreview code={TREND_COLORS_CODE}>
            <div style={grid3}>
              <StatCard label="Upward"   value="4,291" change="+8.1%"  trend="up" />
              <StatCard label="Downward" value="1,342" change="−2.4%"  trend="down" />
              <StatCard label="Neutral"  value="3.2%"  change="±0.0%"  trend="neutral" />
            </div>
          </CodePreview>
        </section>

        <section id="inline" className="demo-section" aria-labelledby="inline-heading">
          <h2 id="inline-heading">Inline cards and groups</h2>
          <p className="section-desc">
            Use the compact inline variant in a labelled strip, or let <code>StatGroup</code>
            arrange cards as a responsive grid or stack. <code>StatDivider</code> provides an
            explicit visual separator and is hidden from assistive technology.
          </p>
          <CodePreview code={INLINE_CODE} language="typescript">
            <StatGroup variant="strip" bordered ariaLabel="Account metrics">
              <StatCard variant="inline" icon="users" label="Users" value="4,291" change="+8.1%" trend="up" />
              <StatDivider />
              <StatCard variant="inline" icon="shopping-cart" label="Orders" value="1,342" />
            </StatGroup>
          </CodePreview>
          <CodePreview code={GROUP_CODE} language="typescript">
            <StatGroup variant="grid" bordered>
              <StatCard label="Revenue" value="$24.5k" />
              <StatCard label="Users" value="4,291" />
              <StatCard label="Orders" value="1,342" />
            </StatGroup>
          </CodePreview>
        </section>

        <section id="dashboard-grid" className="demo-section" aria-labelledby="dashboard-grid-heading">
          <h2 id="dashboard-grid-heading">Dashboard Grid</h2>
          <p className="section-desc">
            Mixing flat and icon variants in a single row, as commonly seen in SaaS dashboards.
          </p>
          <CodePreview code={`// Icon row + trend row`}>
            <div style={{ padding: 16, background: 'var(--sp-surface-50, #fafafa)', border: '1px solid var(--sp-border, rgba(0,0,0,.08))', borderRadius: 8 }}>
              <div style={grid4}>
                <StatCard variant="icon" icon="dollar-sign"  iconColor="blue"  label="MRR"          value="$48.2k" change="+9.1%"  trend="up" />
                <StatCard variant="icon" icon="users"        iconColor="green" label="Active Users"  value="12,841" change="+14.3%" trend="up" />
                <StatCard variant="icon" icon="zap"          iconColor="amber" label="Avg. Latency"  value="38 ms"  change="−5 ms"  trend="up" />
                <StatCard variant="icon" icon="alert-circle" iconColor="red"   label="Error Rate"    value="0.04%"  change="+0.01%" trend="down" />
              </div>
              <div style={{ ...grid4, marginTop: 12 }}>
                <StatCard variant="trend" label="Monthly Revenue" value="$48.2k" change="+9.1%"  trend="up">
                  <Sparkline values={SPARK_UP} color="#16a34a" />
                </StatCard>
                <StatCard variant="trend" label="New Signups"     value="1,204"  change="+14.3%" trend="up">
                  <Sparkline values={SPARK_UP} color="#16a34a" />
                </StatCard>
                <StatCard variant="trend" label="Avg. Latency"    value="38 ms"  change="−5 ms"  trend="up">
                  <Sparkline values={SPARK_DOWN} color="#dc2626" />
                </StatCard>
                <StatCard variant="trend" label="Error Rate"      value="0.04%"  change="+0.01%" trend="down">
                  <Sparkline values={SPARK_FLAT} color="#718096" />
                </StatCard>
              </div>
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <h3>Props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Metric name shown above the value</td></tr>
                <tr><td><code>value</code></td><td><code>string</code></td><td><code>''</code></td><td>Primary metric value (pre-formatted string)</td></tr>
                <tr><td><code>change</code></td><td><code>string</code></td><td><code>''</code></td><td>Change indicator text — empty hides it</td></tr>
                <tr><td><code>trend</code></td><td><code>'up' | 'down' | 'neutral'</code></td><td><code>'neutral'</code></td><td>Controls change badge colour</td></tr>
                <tr><td><code>variant</code></td><td><code>'flat' | 'icon' | 'trend' | 'inline'</code></td><td><code>'flat'</code></td><td>Visual layout variant</td></tr>
                <tr><td><code>icon</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Lucide icon name — used by <code>icon</code> variant</td></tr>
                <tr><td><code>iconColor</code></td><td><code>'blue' | 'green' | 'amber' | 'red' | 'purple'</code></td><td><code>'blue'</code></td><td>Icon tile colour</td></tr>
                <tr><td><code>chartFit</code></td><td><code>'bleed' | 'inset'</code></td><td><code>'bleed'</code></td><td>Whether trend charts bleed to the card edges</td></tr>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Chart area rendered below the value when <code>variant="trend"</code></td></tr>
              </tbody>
            </table>
          </div>
          <h3>StatGroup props</h3>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>variant</code></td><td><code>'strip' | 'grid' | 'stack'</code></td><td><code>'strip'</code></td><td>Responsive child layout</td></tr>
                <tr><td><code>bordered</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Add a token-based group border</td></tr>
                <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td>—</td><td>Accessible name for the metric group</td></tr>
                <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Cards and optional dividers</td></tr>
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
              <a
                className={`toc-link${activeSection === s.id ? ' active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
