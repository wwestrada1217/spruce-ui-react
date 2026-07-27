/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState } from 'react';
import {
  Card,
  StatCard,
  Badge,
  Avatar,
  Button,
  Datagrid,
  type ColumnDef,
} from 'spruce-react';

interface LeaveRequest {
  id: string;
  employee: string;
  type: string;
  dates: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function TimeOff() {
  const [requests, setRequests] = useState<LeaveRequest[]>([
    { id: 'REQ-101', employee: 'Pam Beesly', type: 'Maternity Leave', dates: 'Jul 20 - Aug 30, 2026', days: 30, reason: 'Family leave', status: 'Approved' },
    { id: 'REQ-102', employee: 'Jim Halpert', type: 'Annual Vacation', dates: 'Aug 05 - Aug 12, 2026', days: 5, reason: 'Family trip', status: 'Pending' },
    { id: 'REQ-103', employee: 'Elena Rostova', type: 'Sick Leave', dates: 'Jul 28 - Jul 29, 2026', days: 2, reason: 'Medical appointment', status: 'Pending' },
    { id: 'REQ-104', employee: 'Dwight Schrute', type: 'Personal Leave', dates: 'Aug 01 - Aug 02, 2026', days: 2, reason: 'Farm duties', status: 'Pending' },
  ]);

  function handleAction(id: string, newStatus: 'Approved' | 'Rejected') {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  }

  const columns: ColumnDef<LeaveRequest>[] = [
    {
      field: 'employee',
      headerName: 'Employee',
      cellRenderer: (_val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={row.employee} size="sm" />
          <span style={{ fontWeight: 600, fontSize: 13 }}>{row.employee}</span>
        </div>
      ),
    },
    {
      field: 'type',
      headerName: 'Leave Type',
      cellRenderer: (_val, row) => <Badge variant="primary">{row.type}</Badge>,
    },
    {
      field: 'dates',
      headerName: 'Requested Dates',
      cellRenderer: (_val, row) => <span style={{ fontSize: 12 }}>{row.dates} ({row.days} days)</span>,
    },
    {
      field: 'reason',
      headerName: 'Reason',
    },
    {
      field: 'status',
      headerName: 'Status',
      cellRenderer: (_val, row) => {
        const variant = row.status === 'Approved' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger';
        return <Badge variant={variant}>{row.status}</Badge>;
      },
    },
    {
      field: 'actions',
      headerName: 'Approval Actions',
      cellRenderer: (_val, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          {row.status === 'Pending' ? (
            <>
              <Button size="sm" variant="success" iconLeft="check" onClick={() => handleAction(row.id, 'Approved')}>
                Approve
              </Button>
              <Button size="sm" variant="danger" iconLeft="x" onClick={() => handleAction(row.id, 'Rejected')}>
                Reject
              </Button>
            </>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--sp-text-subtle, #94a3b8)' }}>No action required</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Leave Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <StatCard label="Pending Requests" value="3" change="Requires HR Approval" trend="neutral" />
        <StatCard label="Approved This Month" value="18" change="120 Total Days" trend="up" />
        <StatCard label="Vacation Days Used" value="450 hrs" change="72% Average Balance" trend="up" />
        <StatCard label="Sick Days Used" value="84 hrs" change="Normal Range" trend="neutral" />
      </div>

      {/* Leave Requests Datagrid */}
      <Card>
        <div style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Leave Requests & Approvals</h3>
          <Datagrid columns={columns} rowData={requests} options={{ pagination: true, pageSize: 10 }} />
        </div>
      </Card>
    </div>
  );
}
