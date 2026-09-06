/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Card,
  StatCard,
  Badge,
  Button,
  AreaChart,
  Datagrid,
  type DatagridCellTemplateContext,
  type DatagridColumn,
} from 'spruce-react';

interface PayrollRecord {
  id: string;
  month: string;
  grossPay: string;
  taxDeduction: string;
  netPay: string;
  status: 'Completed' | 'Processing';
  payDate: string;
}

export default function Payroll() {
  const chartSeries = [
    { name: 'Gross Payroll ($)', data: [165000, 172000, 178000, 181000, 185400] },
    { name: 'Net Pay ($)', data: [128000, 134000, 139000, 142000, 145000] },
  ];
  const categories = ['Mar', 'Apr', 'May', 'Jun', 'Jul'];

  const records: PayrollRecord[] = [
    { id: 'PAY-2026-07', month: 'July 2026', grossPay: '$185,400', taxDeduction: '$40,400', netPay: '$145,000', status: 'Completed', payDate: 'Jul 25, 2026' },
    { id: 'PAY-2026-06', month: 'June 2026', grossPay: '$181,000', taxDeduction: '$39,000', netPay: '$142,000', status: 'Completed', payDate: 'Jun 25, 2026' },
    { id: 'PAY-2026-05', month: 'May 2026', grossPay: '$178,000', taxDeduction: '$39,000', netPay: '$139,000', status: 'Completed', payDate: 'May 25, 2026' },
    { id: 'PAY-2026-04', month: 'April 2026', grossPay: '$172,000', taxDeduction: '$38,000', netPay: '$134,000', status: 'Completed', payDate: 'Apr 25, 2026' },
  ];

  const columns: DatagridColumn<PayrollRecord>[] = [
    { key: 'month', header: 'Pay Period' },
    { key: 'id', header: 'Batch ID' },
    { key: 'grossPay', header: 'Gross Payroll' },
    { key: 'taxDeduction', header: 'Tax & Deductions' },
    { key: 'netPay', header: 'Net Disbursed' },
    {
      key: 'status',
      header: 'Status',
    },
    { key: 'payDate', header: 'Payment Date' },
    {
      key: 'actions',
      header: 'Statement',
    },
  ];

  const cellTemplates = {
    month: ({ row }: DatagridCellTemplateContext<PayrollRecord>) => <strong>{row.month}</strong>,
    id: ({ row }: DatagridCellTemplateContext<PayrollRecord>) => <code>{row.id}</code>,
    status: ({ row }: DatagridCellTemplateContext<PayrollRecord>) => <Badge variant={row.status === 'Completed' ? 'success' : 'warning'}>{row.status}</Badge>,
    actions: () => <Button size="sm" variant="outline" iconLeft="download">PDF Report</Button>,
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Payroll Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <StatCard label="July Gross Payroll" value="$185,400" change="+2.4% vs June" trend="up" />
        <StatCard label="Total Deductions" value="$40,400" change="Taxes & Benefits" trend="neutral" />
        <StatCard label="Direct Deposit Net" value="$145,000" change="Disbursed Jul 25" trend="up" />
        <StatCard label="Active Tax Profiles" value="248" change="100% Compliant" trend="up" />
      </div>

      {/* Payroll Trend Chart */}
      <Card>
        <div style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Monthly Payroll Expense Trend</h3>
          <AreaChart series={chartSeries} categories={categories} height={260} showLegend />
        </div>
      </Card>

      {/* Payroll Batches Table */}
      <Card>
        <div style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Historical Payroll Batches</h3>
          <Datagrid columns={columns} rows={records} autoHeight pagination pageSize={5} cellTemplates={cellTemplates} />
        </div>
      </Card>
    </div>
  );
}
