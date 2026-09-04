import { useReducedMotion } from 'spruce-react';
import {
  Badge,
  BarChart,
  BarRaceChart,
  Button,
  FunnelChart,
  GaugeChart,
  GroupedBarChart,
  LineChart,
  PieChart,
  ScatterChart,
  StackedBarChart,
  Tabs,
} from 'spruce-react';
import type {
  BarRaceFrame,
  ChartDataItem,
  ChartSeries,
  ScatterSeries,
} from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { BlockPageLayout, type BlockPageSection } from './BlockPageLayout';

const SECTIONS: readonly BlockPageSection[] = [
  { id: 'analytics-dashboard', label: 'Analytics Dashboard' },
  { id: 'sales-report', label: 'Sales Report' },
  { id: 'marketing-overview', label: 'Marketing Overview' },
  { id: 'scatter-pie', label: 'Scatter & Pie' },
  { id: 'bar-chart-race', label: 'Bar Chart Race' },
  { id: 'code', label: 'Source Code' },
];

const REVENUE_SERIES: ChartSeries[] = [
  { name: 'Revenue', data: [142000, 158000, 135000, 174000, 162000, 191000] },
  { name: 'Expenses', data: [89000, 95000, 88000, 102000, 97000, 110000] },
];
const REVENUE_CATEGORIES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const REVENUE_MIX: ChartDataItem[] = [
  { label: 'SaaS Subscriptions', value: 58 },
  { label: 'Professional Services', value: 22 },
  { label: 'Licensing', value: 12 },
  { label: 'Support Plans', value: 8 },
];
const CHANNELS: ChartDataItem[] = [
  { label: 'Organic Search', value: 84520 },
  { label: 'Direct', value: 62100 },
  { label: 'Social Media', value: 47830 },
  { label: 'Email Campaigns', value: 38240 },
  { label: 'Referral', value: 29560 },
  { label: 'Paid Ads', value: 21310 },
];
const PRODUCTS: ChartDataItem[] = [
  { label: 'Enterprise Suite', value: 124000 },
  { label: 'Pro Plan', value: 87500 },
  { label: 'Starter Plan', value: 52300 },
  { label: 'Add-ons', value: 38900 },
  { label: 'Consulting', value: 31200 },
  { label: 'Training', value: 18600 },
];
const QUARTERLY_SERIES: ChartSeries[] = [
  { name: 'APAC', data: [72000, 81000, 90000, 105000] },
  { name: 'EMEA', data: [58000, 64000, 71000, 83000] },
  { name: 'Americas', data: [95000, 108000, 121000, 142000] },
];
const REGION_SERIES: ChartSeries[] = [
  { name: 'Americas', data: [48000, 54000, 46000, 61000, 57000, 68000] },
  { name: 'EMEA', data: [32000, 35000, 29000, 40000, 37000, 44000] },
  { name: 'APAC', data: [22000, 25000, 20000, 31000, 28000, 36000] },
];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const WEEKLY_SESSIONS: ChartDataItem[] = [
  { label: 'Mon', value: 12400 },
  { label: 'Tue', value: 15200 },
  { label: 'Wed', value: 14100 },
  { label: 'Thu', value: 16800 },
  { label: 'Fri', value: 13500 },
  { label: 'Sat', value: 7600 },
  { label: 'Sun', value: 5900 },
];
const FUNNEL: ChartDataItem[] = [
  { label: 'Visitors', value: 84520 },
  { label: 'Signed Up', value: 32410 },
  { label: 'Activated', value: 18720 },
  { label: 'Paying', value: 7840 },
  { label: 'Retained', value: 5620 },
];
const TRAFFIC_SOURCES: ChartDataItem[] = [
  { label: 'Organic', value: 44 },
  { label: 'Direct', value: 28 },
  { label: 'Social', value: 16 },
  { label: 'Email', value: 12 },
];
const SCATTER_SERIES: ScatterSeries[] = [
  {
    name: 'Engineering',
    data: [
      { x: 12, y: 64 }, { x: 18, y: 72 }, { x: 24, y: 81 },
      { x: 30, y: 78 }, { x: 36, y: 88 }, { x: 40, y: 92 },
    ],
  },
  {
    name: 'Design',
    data: [
      { x: 10, y: 55 }, { x: 16, y: 68 }, { x: 22, y: 74 },
      { x: 28, y: 82 }, { x: 34, y: 79 }, { x: 38, y: 86 },
    ],
  },
  {
    name: 'Marketing',
    data: [
      { x: 8, y: 48 }, { x: 14, y: 58 }, { x: 20, y: 66 },
      { x: 26, y: 70 }, { x: 32, y: 75 }, { x: 42, y: 90 },
    ],
  },
];

const MARKET_RACE_FRAMES: BarRaceFrame[] = [
  { time: 'Jan 2026', data: [{ label: 'United States', value: 82 }, { label: 'India', value: 76 }, { label: 'Brazil', value: 64 }, { label: 'Germany', value: 59 }, { label: 'Indonesia', value: 54 }, { label: 'Japan', value: 49 }] },
  { time: 'Feb 2026', data: [{ label: 'India', value: 84 }, { label: 'United States', value: 81 }, { label: 'Brazil', value: 66 }, { label: 'Germany', value: 61 }, { label: 'Indonesia', value: 58 }, { label: 'Japan', value: 47 }] },
  { time: 'Mar 2026', data: [{ label: 'India', value: 88 }, { label: 'United States', value: 83 }, { label: 'Indonesia', value: 68 }, { label: 'Brazil', value: 67 }, { label: 'Germany', value: 60 }, { label: 'Japan', value: 45 }] },
  { time: 'Apr 2026', data: [{ label: 'India', value: 93 }, { label: 'United States', value: 85 }, { label: 'Indonesia', value: 74 }, { label: 'Brazil', value: 69 }, { label: 'Germany', value: 63 }, { label: 'Mexico', value: 51 }] },
];
const GDP_RACE_FRAMES: BarRaceFrame[] = [
  { time: '1990', data: [{ label: 'United States', value: 5.96 }, { label: 'Japan', value: 3.13 }, { label: 'Germany', value: 1.77 }, { label: 'France', value: 1.28 }, { label: 'Italy', value: 1.14 }, { label: 'China', value: 0.39 }] },
  { time: '2000', data: [{ label: 'United States', value: 10.25 }, { label: 'Japan', value: 4.89 }, { label: 'Germany', value: 1.95 }, { label: 'France', value: 1.36 }, { label: 'China', value: 1.21 }, { label: 'Italy', value: 1.15 }] },
  { time: '2010', data: [{ label: 'United States', value: 14.99 }, { label: 'China', value: 6.09 }, { label: 'Japan', value: 5.76 }, { label: 'Germany', value: 3.42 }, { label: 'France', value: 2.65 }, { label: 'United Kingdom', value: 2.48 }] },
  { time: '2020', data: [{ label: 'United States', value: 21.06 }, { label: 'China', value: 14.72 }, { label: 'Japan', value: 5.05 }, { label: 'Germany', value: 3.89 }, { label: 'United Kingdom', value: 2.76 }, { label: 'France', value: 2.65 }] },
];

const CHARTS_CODE = `import {
  BarChart, BarRaceChart, FunnelChart, GaugeChart, GroupedBarChart,
  LineChart, PieChart, ScatterChart, StackedBarChart, Tabs,
} from 'spruce-react';

export function ChartsBlock() {
  return (
    <>
      <GaugeChart value={78} max={100} title="Revenue Goal" unit="%" />
      <LineChart series={revenueSeries} categories={months} ariaLabel="Monthly revenue" />
      <PieChart data={revenueMix} donut ariaLabel="Revenue mix" />
      <BarChart data={channels} orientation="horizontal" ariaLabel="Acquisition channels" />
      <GroupedBarChart series={quarterly} categories={quarters} />
      <StackedBarChart series={regions} categories={months} />
      <Tabs tabs={[{ label: 'Trends', content: <BarChart data={weekly} /> }]} />
      <ScatterChart series={scatter} ariaLabel="Hours and performance" />
      <FunnelChart data={funnel} ariaLabel="Conversion funnel" />
      <BarRaceChart frames={marketFrames} ariaLabel="Market ranking" />
    </>
  );
}`;

export function ChartsBlockPage() {
  const reducedMotion = useReducedMotion();
  const chartConfig = { palette: 'harmony', animate: !reducedMotion } as const;
  const raceFrames = reducedMotion ? MARKET_RACE_FRAMES.slice(0, 1) : MARKET_RACE_FRAMES;
  const gdpFrames = reducedMotion ? GDP_RACE_FRAMES.slice(0, 1) : GDP_RACE_FRAMES;

  return (
    <BlockPageLayout
      title="Charts Blocks"
      description="Real-world chart compositions for analytics dashboards, business reports, and financial summaries. Drop these blocks into any layout."
      sections={SECTIONS}
    >
      <section id="analytics-dashboard" className="demo-section" aria-labelledby="analytics-dashboard-heading">
        <h2 id="analytics-dashboard-heading">Analytics Dashboard</h2>
        <p className="section-desc">A full analytics view combining KPI gauges, revenue trends, top-channel rankings, and category breakdowns.</p>
        <div className="sp-block-frame sp-block-frame--pad">
          <div className="sp-block-toolbar">
            <div>
              <h3>Business Overview</h3>
              <p>March 2026 · All regions</p>
            </div>
            <div className="sp-block-inline">
              <Badge variant="success" size="sm">Live</Badge>
              <Button variant="outline" size="sm" iconLeft="download">Export</Button>
            </div>
          </div>

          <div className="sp-block-kpi-grid" role="list" aria-label="Business performance indicators">
            {[['Revenue Goal', 78], ['Retention', 62], ['Uptime', 91], ['Support SLA', 44]].map(([label, value]) => (
              <div className="sp-block-kpi" role="listitem" key={String(label)}>
                <GaugeChart value={Number(value)} max={100} unit="%" title={String(label)} height={150} ariaLabel={`${String(label)} ${String(value)} percent`} config={chartConfig} />
              </div>
            ))}
          </div>

          <div className="sp-block-chart-grid sp-block-chart-grid--wide">
            <div className="sp-block-chart-card">
              <div className="sp-block-chart-card__header"><span>Monthly Revenue</span><Badge variant="info" size="sm">2026</Badge></div>
              <LineChart series={REVENUE_SERIES} categories={REVENUE_CATEGORIES} height={260} ariaLabel="Monthly revenue and expenses" config={chartConfig} />
            </div>
            <div className="sp-block-chart-card">
              <div className="sp-block-chart-card__header"><span>Revenue Mix</span></div>
              <PieChart data={REVENUE_MIX} donut height={260} ariaLabel="Revenue mix" config={chartConfig} />
            </div>
          </div>

          <div className="sp-block-chart-grid">
            <div className="sp-block-chart-card">
              <div className="sp-block-chart-card__header"><span>Top Acquisition Channels</span></div>
              <BarChart data={CHANNELS} orientation="horizontal" height={280} ariaLabel="Top acquisition channels" config={chartConfig} />
            </div>
            <div className="sp-block-chart-card">
              <div className="sp-block-chart-card__header"><span>Sales by Quarter</span></div>
              <GroupedBarChart series={QUARTERLY_SERIES} categories={['Q1', 'Q2', 'Q3', 'Q4']} height={280} ariaLabel="Sales by quarter" config={chartConfig} />
            </div>
          </div>
        </div>
      </section>

      <section id="sales-report" className="demo-section" aria-labelledby="sales-report-heading">
        <h2 id="sales-report-heading">Sales Report</h2>
        <p className="section-desc">Product performance ranked by revenue with a target benchmark, plus a stacked breakdown across regions.</p>
        <div className="sp-block-frame sp-block-frame--pad">
          <div className="sp-block-chart-grid">
            <div className="sp-block-chart-card">
              <div className="sp-block-chart-card__header"><span>Product Revenue</span><Badge size="sm">Target: $80K</Badge></div>
              <BarChart data={PRODUCTS} orientation="horizontal" height={320} ariaLabel="Product revenue" config={{ ...chartConfig, referenceLines: [{ value: 80000, label: 'Target' }] }} />
            </div>
            <div className="sp-block-chart-card">
              <div className="sp-block-chart-card__header"><span>Sales by Region</span></div>
              <StackedBarChart series={REGION_SERIES} categories={MONTHS} height={320} ariaLabel="Sales by region" config={chartConfig} />
            </div>
          </div>
        </div>
      </section>

      <section id="marketing-overview" className="demo-section" aria-labelledby="marketing-overview-heading">
        <h2 id="marketing-overview-heading">Marketing Overview</h2>
        <p className="section-desc">Channel performance versus spend with tabbed views for channel, trend, and conversion breakdowns.</p>
        <div className="sp-block-frame sp-block-frame--pad sp-block-tabs">
          <Tabs
            ariaLabel="Marketing report views"
            tabs={[
              { label: 'All Channels', content: <BarChart data={CHANNELS} orientation="horizontal" height={280} ariaLabel="Sessions by channel" config={chartConfig} /> },
              { label: 'Trends', content: <BarChart data={WEEKLY_SESSIONS} height={280} ariaLabel="Weekly sessions" config={chartConfig} /> },
              { label: 'Conversion', content: <div className="sp-block-chart-grid"><div className="sp-block-chart-card"><div className="sp-block-chart-card__header"><span>Funnel Drop-off</span></div><FunnelChart data={FUNNEL} height={240} ariaLabel="Funnel drop-off" config={chartConfig} /></div><div className="sp-block-chart-card"><div className="sp-block-chart-card__header"><span>Traffic Sources</span></div><PieChart data={TRAFFIC_SOURCES} donut height={240} ariaLabel="Traffic sources" config={chartConfig} /></div></div> },
            ]}
          />
        </div>
      </section>

      <section id="scatter-pie" className="demo-section" aria-labelledby="scatter-pie-heading">
        <h2 id="scatter-pie-heading">Scatter &amp; Pie</h2>
        <p className="section-desc">Scatter plots for correlation analysis and pie/donut charts for composition and share.</p>
        <div className="sp-block-frame sp-block-frame--pad">
          <div className="sp-block-chart-grid">
            <div className="sp-block-chart-card">
              <div className="sp-block-chart-card__header"><span>Hours vs. Performance Score</span><Badge variant="info" size="sm">Trendline</Badge></div>
              <ScatterChart series={SCATTER_SERIES} height={300} ariaLabel="Hours versus performance score" config={{ ...chartConfig, xLabel: 'Hours / week', yLabel: 'Performance score' }} />
            </div>
            <div className="sp-block-chart-card">
              <div className="sp-block-chart-card__header"><span>Revenue Mix</span><Badge variant="success" size="sm">Donut</Badge></div>
              <PieChart data={REVENUE_MIX} donut height={300} ariaLabel="Revenue mix donut" config={{ ...chartConfig, showLegend: false }} />
            </div>
          </div>
        </div>
      </section>

      <section id="bar-chart-race" className="demo-section" aria-labelledby="bar-chart-race-heading">
        <h2 id="bar-chart-race-heading">Bar Chart Race</h2>
        <p className="section-desc">Animated rankings for time-based comparisons. Reduced-motion users see a stable first frame without playback work.</p>
        <div className="sp-block-frame sp-block-frame--pad">
          <div className="sp-block-chart-grid">
            <div className="sp-block-chart-card">
              <div className="sp-block-chart-card__header"><span>Monthly Active Users by Market</span><Badge variant="info" size="sm">Step Playback</Badge></div>
              <BarRaceChart frames={raceFrames} height={340} durationPerFrame={1500} ariaLabel="Monthly active users by market" config={chartConfig} />
            </div>
            <div className="sp-block-chart-card">
              <div className="sp-block-chart-card__header"><span>GDP by Country</span><Badge variant="success" size="sm">Animated</Badge></div>
              <BarRaceChart frames={gdpFrames} height={340} durationPerFrame={750} ariaLabel="GDP by country" config={chartConfig} />
            </div>
          </div>
        </div>
      </section>

      <section id="code" className="demo-section" aria-labelledby="charts-code-heading">
        <h2 id="charts-code-heading">Source Code</h2>
        <CodePreview code={CHARTS_CODE} language="typescript" codeOnly title="Charts block composition" />
      </section>
    </BlockPageLayout>
  );
}
