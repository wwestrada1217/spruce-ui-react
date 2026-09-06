/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState } from 'react';
import {
  Card,
  Badge,
  Avatar,
  Button,
  Input,
  Select,
  Datagrid,
  type DatagridCellTemplateContext,
  type DatagridColumn,
} from 'spruce-react';

interface EmployeeRecord {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  type: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  joinDate: string;
}

export default function Employees() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const employees: EmployeeRecord[] = [
    { id: 'EMP-001', name: 'Sarah Jenkins', email: 'sarah.j@acme.com', department: 'Human Resources', role: 'HR Director', type: 'Full-time', status: 'Active', joinDate: 'Jan 15, 2021' },
    { id: 'EMP-002', name: 'Michael Scott', email: 'michael.s@acme.com', department: 'Sales', role: 'Regional Manager', type: 'Full-time', status: 'Active', joinDate: 'Mar 10, 2019' },
    { id: 'EMP-003', name: 'David Miller', email: 'david.m@acme.com', department: 'Engineering', role: 'Senior Frontend Engineer', type: 'Full-time', status: 'Active', joinDate: 'Jul 24, 2026' },
    { id: 'EMP-004', name: 'Elena Rostova', email: 'elena.r@acme.com', department: 'Design', role: 'Product Designer', type: 'Full-time', status: 'Active', joinDate: 'Jul 22, 2026' },
    { id: 'EMP-005', name: 'Pam Beesly', email: 'pam.b@acme.com', department: 'Human Resources', role: 'Office Administrator', type: 'Full-time', status: 'On Leave', joinDate: 'May 04, 2020' },
    { id: 'EMP-006', name: 'Jim Halpert', email: 'jim.h@acme.com', department: 'Sales', role: 'Sales Lead', type: 'Full-time', status: 'Active', joinDate: 'Feb 14, 2020' },
    { id: 'EMP-007', name: 'Dwight Schrute', email: 'dwight.s@acme.com', department: 'Sales', role: 'Assistant Manager', type: 'Full-time', status: 'Active', joinDate: 'Nov 01, 2018' },
    { id: 'EMP-008', name: 'Ryan Howard', email: 'ryan.h@acme.com', department: 'Product', role: 'Product Manager', type: 'Contractor', status: 'Terminated', joinDate: 'Aug 12, 2023' },
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
                          emp.email.toLowerCase().includes(search.toLowerCase()) ||
                          emp.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const columns: DatagridColumn<EmployeeRecord>[] = [
    {
      key: 'name',
      header: 'Employee',
    },
    {
      key: 'id',
      header: 'Employee ID',
    },
    {
      key: 'department',
      header: 'Department',
    },
    {
      key: 'role',
      header: 'Job Title',
    },
    {
      key: 'status',
      header: 'Status',
    },
    {
      key: 'joinDate',
      header: 'Join Date',
    },
    {
      key: 'actions',
      header: 'Actions',
    },
  ];

  const cellTemplates = {
    name: ({ row }: DatagridCellTemplateContext<EmployeeRecord>) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={row.name} size="sm" />
        <div>
          <span style={{ fontWeight: 600, fontSize: 13, display: 'block' }}>{row.name}</span>
          <span style={{ fontSize: 11, color: 'var(--sp-text-muted, #64748b)' }}>{row.email}</span>
        </div>
      </div>
    ),
    id: ({ row }: DatagridCellTemplateContext<EmployeeRecord>) => <code style={{ fontSize: 12 }}>{row.id}</code>,
    status: ({ row }: DatagridCellTemplateContext<EmployeeRecord>) => {
      const variantMap = {
        Active: 'success',
        'On Leave': 'warning',
        Terminated: 'danger',
      } as const;
      return <Badge variant={variantMap[row.status]}>{row.status}</Badge>;
    },
    actions: () => (
      <div style={{ display: 'flex', gap: 6 }}>
        <Button size="sm" variant="ghost" iconLeft="eye" aria-label="View Profile" />
        <Button size="sm" variant="ghost" iconLeft="edit" aria-label="Edit Record" />
      </div>
    ),
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Filter Bar */}
      <Card>
        <div style={{ padding: 16, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 260 }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="Search name, email, or title..."
                value={search}
                onChange={(val) => setSearch(val)}
                iconLeft="search"
              />
            </div>
            <div style={{ width: 180 }}>
              <Select
                value={deptFilter}
                options={[
                  { value: 'All', label: 'All Departments' },
                  { value: 'Human Resources', label: 'Human Resources' },
                  { value: 'Sales', label: 'Sales' },
                  { value: 'Engineering', label: 'Engineering' },
                  { value: 'Design', label: 'Design' },
                  { value: 'Product', label: 'Product' },
                ]}
                onChange={(val) => setDeptFilter(String(val))}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" iconLeft="download">Export CSV</Button>
          </div>
        </div>
      </Card>

      {/* Employee Datagrid */}
      <Card>
        <div style={{ padding: 8 }}>
          <Datagrid
            columns={columns}
            rows={filteredEmployees}
            autoHeight
            pagination
            pageSize={10}
            cellTemplates={cellTemplates}
          />
        </div>
      </Card>
    </div>
  );
}
