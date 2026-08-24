/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Card, StatCard, Badge, Avatar, Button, Rating } from 'spruce-react';

export default function Performance() {
  const reviews = [
    { name: 'David Miller', role: 'Senior Frontend Engineer', cycle: 'Q2 2026 Review', rating: 4.8, status: 'Completed', manager: 'Sarah Jenkins' },
    { name: 'Elena Rostova', role: 'Product Designer', cycle: 'Q2 2026 Review', rating: 4.5, status: 'Completed', manager: 'Sarah Jenkins' },
    { name: 'Michael Scott', role: 'Regional Manager', cycle: 'Mid-Year 2026', rating: 3.8, status: 'In Review', manager: 'David Wallace' },
    { name: 'Jim Halpert', role: 'Sales Lead', cycle: 'Mid-Year 2026', rating: 4.6, status: 'Completed', manager: 'Michael Scott' },
  ];

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <StatCard label="Q2 Reviews Completed" value="88%" change="142 / 160 Reviews" trend="up" />
        <StatCard label="Average Rating" value="4.4 / 5.0" change="+0.2 vs Q1" trend="up" />
        <StatCard label="Promotions Eligible" value="14" change="Under HR Committee" trend="neutral" />
      </div>

      <Card>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Performance Evaluations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 14,
                  borderRadius: 6,
                  border: '1px solid var(--sp-border, rgba(0,0,0,0.08))',
                  background: 'var(--sp-surface, #fff)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar name={rev.name} size="md" />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 14, display: 'block' }}>{rev.name}</span>
                    <span style={{ fontSize: 12, color: 'var(--sp-text-muted, #64748b)' }}>
                      {rev.role} • Manager: {rev.manager}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Rating value={rev.rating} readonly size="sm" />
                    <span style={{ fontSize: 11, color: 'var(--sp-text-subtle, #94a3b8)', marginTop: 2 }}>
                      {rev.cycle}
                    </span>
                  </div>
                  <Badge variant={rev.status === 'Completed' ? 'success' : 'warning'}>
                    {rev.status}
                  </Badge>
                  <Button size="sm" variant="outline">View Feedback</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
