import { useState, useEffect, useRef } from 'react';
import {
  Card,
  StatCard,
  BarChart,
  LineChart,
  Badge,
  Button,
  Icon,
  Datagrid,
} from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'overview', label: 'Interactive Dashboard' },
  { id: 'code',     label: 'Source Code' },
];

export function DashboardBlockPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { threshold: 0.3 },
    );
    const sections = mainRef.current?.querySelectorAll('[id]') ?? [];
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const revenueSeries = [
    { name: 'This Year', data: [3200, 4100, 4800, 5600, 6200, 7800, 8900, 9400] },
    { name: 'Last Year', data: [2800, 3400, 3900, 4300, 5100, 5900, 6800, 7200] },
  ];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

  const trafficData = [
    { label: 'Direct', value: 4500 },
    { label: 'Organic', value: 7200 },
    { label: 'Referral', value: 3100 },
    { label: 'Social', value: 2400 },
  ];

  const recentOrders = [
    { id: 'ORD-9481', customer: 'Acme Corp', amount: '$4,250.00', status: 'Completed', date: '2026-07-27' },
    { id: 'ORD-9480', customer: 'Global Tech', amount: '$1,890.00', status: 'Processing', date: '2026-07-27' },
    { id: 'ORD-9479', customer: 'Starlight Inc', amount: '$850.50', status: 'Completed', date: '2026-07-26' },
    { id: 'ORD-9478', customer: 'Nexus Systems', amount: '$12,400.00', status: 'Pending', date: '2026-07-26' },
    { id: 'ORD-9477', customer: 'Vortex Dynamics', amount: '$3,120.00', status: 'Completed', date: '2026-07-25' },
  ];

  const columns = [
    { field: 'id', header: 'Order ID', width: 120 },
    { field: 'customer', header: 'Customer', flex: 1 },
    { field: 'amount', header: 'Amount', width: 130 },
    {
      field: 'status',
      header: 'Status',
      width: 140,
      render: (val: unknown) => {
        const v = String(val);
        const variant = v === 'Completed' ? 'success' : v === 'Processing' ? 'info' : 'warning';
        return <Badge variant={variant}>{v}</Badge>;
      },
    },
    { field: 'date', header: 'Date', width: 120 },
  ];

  const DASHBOARD_CODE = `import { Card, StatCard, BarChart, LineChart, Badge, Datagrid } from 'spruce-react';

export function DashboardExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <StatCard title="Total Revenue" value="$128,450" change="+14.2%" trend="up" />
        <StatCard title="Active Subscriptions" value="2,840" change="+8.1%" trend="up" />
        <StatCard title="Conversion Rate" value="3.42%" change="-0.4%" trend="down" />
        <StatCard title="Avg. Order Value" value="$412.50" change="+5.3%" trend="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <Card title="Revenue Growth YoY">
          <LineChart series={series} categories={categories} height={280} />
        </Card>
        <Card title="Acquisition Channels">
          <BarChart data={trafficData} height={280} />
        </Card>
      </div>
    </div>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Dashboard Block</h1>
        <p className="docs-desc">
          Full analytics and enterprise operations dashboard layout featuring KPI stat cards, charts, and data tables.
        </p>

        <section id="overview" className="demo-section">
          <h2>Interactive Dashboard Preview</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16, background: 'var(--sp-bg-secondary)', borderRadius: 8, border: '1px solid var(--sp-border-subtle)' }}>
            {/* Header Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Executive Overview</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--sp-text-subtle)' }}>Performance metrics for Q3 2026</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="outline" size="sm">
                  <Icon name="calendar" size={14} style={{ marginRight: 6 }} /> Last 30 Days
                </Button>
                <Button variant="primary" size="sm">
                  <Icon name="download" size={14} style={{ marginRight: 6 }} /> Export Report
                </Button>
              </div>
            </div>

            {/* Stat Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <StatCard label="Total Revenue" value="$128,450" change="+14.2%" trend="up" />
              <StatCard label="Active Customers" value="2,840" change="+8.1%" trend="up" />
              <StatCard label="Conversion Rate" value="3.42%" change="-0.4%" trend="down" />
              <StatCard label="Avg. Order Value" value="$412.50" change="+5.3%" trend="up" />
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              <Card>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Revenue Growth YoY</div>
                <div style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginBottom: 16 }}>Monthly comparative breakdown</div>
                <LineChart series={revenueSeries} categories={months} height={260} />
              </Card>
              <Card>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Acquisition Channels</div>
                <div style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginBottom: 16 }}>Pageviews by traffic source</div>
                <BarChart data={trafficData} height={260} />
              </Card>
            </div>

            {/* Recent Orders Datagrid */}
            <Card>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Recent Orders</div>
              <div style={{ fontSize: 13, color: 'var(--sp-text-subtle)', marginBottom: 16 }}>Latest transaction activity</div>
              <Datagrid rowData={recentOrders} columns={columns} style={{ height: 240 }} />
            </Card>
          </div>
        </section>

        <section id="code" className="demo-section">
          <h2>Source Code</h2>
          <CodePreview code={DASHBOARD_CODE}>
            <div style={{ padding: 12, color: 'var(--sp-text-subtle)', fontSize: 13 }}>
              Copy the code snippet above to integrate this dashboard layout block into your Spruce application.
            </div>
          </CodePreview>
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
  );
}
