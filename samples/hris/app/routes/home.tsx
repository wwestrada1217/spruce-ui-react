/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  StatCard,
  Card,
  Badge,
  Avatar,
  BarChart,
  PieChart,
  Button,
} from 'spruce-react';

export default function Home() {
  const deptData = [
    { name: 'Engineering', data: [68] },
    { name: 'Product', data: [24] },
    { name: 'Design', data: [18] },
    { name: 'Sales', data: [42] },
    { name: 'HR & Operations', data: [16] },
  ];

  const employmentTypeData = [
    { label: 'Full-time', value: 185 },
    { label: 'Part-time', value: 32 },
    { label: 'Contractor', value: 24 },
    { label: 'Intern', value: 7 },
  ];

  const recentHires = [
    { name: 'David Miller', role: 'Senior Frontend Engineer', dept: 'Engineering', date: 'Jul 24, 2026' },
    { name: 'Elena Rostova', role: 'Product Designer', dept: 'Design', date: 'Jul 22, 2026' },
    { name: 'Marcus Vance', role: 'Sales Account Executive', dept: 'Sales', date: 'Jul 18, 2026' },
    { name: 'Priya Sharma', role: 'Talent Acquisition Lead', dept: 'HR', date: 'Jul 15, 2026' },
  ];

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <StatCard label="Total Headcount" value="248" change="+12 this month" trend="up" />
        <StatCard label="On Leave Today" value="8" change="3 pending approval" trend="neutral" />
        <StatCard label="Monthly Payroll" value="$185,400" change="Processed Jul 25" trend="up" />
        <StatCard label="Retention Rate" value="96.4%" change="+1.2% YoY" trend="up" />
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        <Card>
          <div style={{ padding: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Headcount by Department</h3>
            <BarChart
              series={deptData}
              categories={['Department']}
              height={260}
              showLegend
            />
          </div>
        </Card>

        <Card>
          <div style={{ padding: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Employment Type Distribution</h3>
            <PieChart
              data={employmentTypeData}
              donut
              innerRadius={50}
              height={260}
            />
          </div>
        </Card>
      </div>

      {/* Recent Hires & Announcements Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        <Card>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Recent Onboarding Hires</h3>
              <Badge variant="info">4 New Hires</Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentHires.map((hire, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--sp-border, rgba(0,0,0,0.08))',
                    background: 'var(--sp-surface, #fff)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={hire.name} size="sm" />
                    <div>
                      <span style={{ display: 'block', fontWeight: 600, fontSize: 13 }}>{hire.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--sp-text-muted, #64748b)' }}>
                        {hire.role} • {hire.dept}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--sp-text-subtle, #94a3b8)' }}>{hire.date}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Company Announcements & Actions</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: 12, borderRadius: 6, background: 'var(--sp-primary-subtle, rgba(37,99,235,0.06))', borderLeft: '4px solid var(--sp-primary, #2563eb)' }}>
                <span style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 2 }}>
                  📢 Q3 Open Enrollment Period Begins August 1st
                </span>
                <span style={{ fontSize: 12, color: 'var(--sp-text-muted, #64748b)' }}>
                  All employees must review health plan choices in the benefits portal.
                </span>
              </div>

              <div style={{ padding: 12, borderRadius: 6, background: 'var(--sp-surface-100, #f1f5f9)', border: '1px solid var(--sp-border, rgba(0,0,0,0.08))' }}>
                <span style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 2 }}>
                  🗓️ Upcoming Holiday: Labor Day (Sept 7)
                </span>
                <span style={{ fontSize: 12, color: 'var(--sp-text-muted, #64748b)' }}>
                  Office will be closed. Paid holiday applies for all full-time staff.
                </span>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Button size="sm" variant="outline" iconLeft="calendar">View HR Calendar</Button>
                <Button size="sm" variant="primary" iconLeft="file-text">Generate Reports</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
