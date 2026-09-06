/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Card, StatCard, Badge, Avatar, Datagrid, type DatagridCellTemplateContext, type DatagridColumn } from 'spruce-react';

interface AttendanceLog {
  employee: string;
  department: string;
  clockIn: string;
  clockOut: string;
  workHours: string;
  status: 'On Time' | 'Late' | 'Remote' | 'Absent';
}

export default function Attendance() {
  const logs: AttendanceLog[] = [
    { employee: 'Sarah Jenkins', department: 'Human Resources', clockIn: '08:55 AM', clockOut: '05:30 PM', workHours: '8h 35m', status: 'On Time' },
    { employee: 'David Miller', department: 'Engineering', clockIn: '09:12 AM', clockOut: '06:00 PM', workHours: '8h 48m', status: 'Late' },
    { employee: 'Elena Rostova', department: 'Design', clockIn: '08:45 AM', clockOut: '05:15 PM', workHours: '8h 30m', status: 'Remote' },
    { employee: 'Michael Scott', department: 'Sales', clockIn: '09:05 AM', clockOut: '05:00 PM', workHours: '7h 55m', status: 'On Time' },
    { employee: 'Jim Halpert', department: 'Sales', clockIn: '08:50 AM', clockOut: '05:25 PM', workHours: '8h 35m', status: 'On Time' },
  ];

  const columns: DatagridColumn<AttendanceLog>[] = [
    {
      key: 'employee',
      header: 'Employee',
    },
    { key: 'department', header: 'Department' },
    { key: 'clockIn', header: 'Clock In' },
    { key: 'clockOut', header: 'Clock Out' },
    { key: 'workHours', header: 'Hours Worked' },
    {
      key: 'status',
      header: 'Status',
    },
  ];

  const cellTemplates = {
    employee: ({ row }: DatagridCellTemplateContext<AttendanceLog>) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={row.employee} size="sm" />
        <span style={{ fontWeight: 600, fontSize: 13 }}>{row.employee}</span>
      </div>
    ),
    status: ({ row }: DatagridCellTemplateContext<AttendanceLog>) => {
      const variant = row.status === 'On Time' ? 'success' : row.status === 'Remote' ? 'info' : row.status === 'Late' ? 'warning' : 'danger';
      return <Badge variant={variant}>{row.status}</Badge>;
    },
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <StatCard label="Clocked In Today" value="236 / 248" change="95.1% Present" trend="up" />
        <StatCard label="Remote Workers" value="42" change="17% of Workforce" trend="neutral" />
        <StatCard label="Late Arrivals" value="4" change="-2 vs Yesterday" trend="down" />
      </div>

      <Card>
        <div style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Daily Clock-in / Timesheet Log</h3>
          <Datagrid columns={columns} rows={logs} autoHeight pagination pageSize={10} cellTemplates={cellTemplates} />
        </div>
      </Card>
    </div>
  );
}
