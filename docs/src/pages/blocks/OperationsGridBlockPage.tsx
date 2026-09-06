import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Datagrid,
  Input,
  Sparkline,
} from 'spruce-react';
import type { BadgeVariant, DatagridColumn, DatagridProps } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { BlockPageLayout, type BlockPageSection } from './BlockPageLayout';

export type QueueStatus = 'Needs Review' | 'Pending Approval' | 'Escalated' | 'Ready to Ship';
export type QueuePriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type QueueChannel = 'Portal' | 'EDI' | 'API' | 'Manual';

export interface QueueRecord {
  readonly id: string;
  readonly customer: string;
  readonly region: string;
  readonly owner: string;
  readonly priority: QueuePriority;
  readonly status: QueueStatus;
  readonly ageHours: number;
  readonly riskScore: number;
  readonly channel: QueueChannel;
  readonly nextStep: string;
}

type StatusFilter = 'All' | QueueStatus;

const SECTIONS: readonly BlockPageSection[] = [
  { id: 'queue-workbench', label: 'Queue Workbench' },
  { id: 'bulk-review', label: 'Bulk Review Actions' },
  { id: 'handoff-panel', label: 'Analyst Handoff Panel' },
  { id: 'code', label: 'Source Code' },
];

const STATUS_FILTERS: readonly StatusFilter[] = [
  'All',
  'Needs Review',
  'Pending Approval',
  'Escalated',
  'Ready to Ship',
];

const INITIAL_ROWS: QueueRecord[] = [
  { id: 'Q-1024', customer: 'Northwind Health', region: 'US-East', owner: 'Mina Patel', priority: 'Critical', status: 'Escalated', ageHours: 31, riskScore: 92, channel: 'API', nextStep: 'Review approval exception' },
  { id: 'Q-1027', customer: 'Atlas Freight', region: 'US-West', owner: 'Jared Kim', priority: 'High', status: 'Needs Review', ageHours: 12, riskScore: 81, channel: 'Portal', nextStep: 'Validate shipping documents' },
  { id: 'Q-1031', customer: 'Mercury Retail', region: 'EU-Central', owner: 'Sara Doyle', priority: 'Medium', status: 'Pending Approval', ageHours: 18, riskScore: 67, channel: 'EDI', nextStep: 'Await finance approval' },
  { id: 'Q-1035', customer: 'Bluebird Labs', region: 'US-East', owner: 'Mina Patel', priority: 'Low', status: 'Ready to Ship', ageHours: 5, riskScore: 29, channel: 'Portal', nextStep: 'Release to warehouse' },
  { id: 'Q-1038', customer: 'Summit Care', region: 'APAC', owner: 'Noah Bell', priority: 'High', status: 'Needs Review', ageHours: 26, riskScore: 74, channel: 'Manual', nextStep: 'Contact analyst for missing fields' },
  { id: 'Q-1041', customer: 'Harbor Manufacturing', region: 'EU-West', owner: 'Ivy Carter', priority: 'Critical', status: 'Pending Approval', ageHours: 21, riskScore: 88, channel: 'API', nextStep: 'Escalate margin exception' },
  { id: 'Q-1047', customer: 'Evergreen Foods', region: 'US-South', owner: 'Jared Kim', priority: 'Medium', status: 'Ready to Ship', ageHours: 9, riskScore: 44, channel: 'EDI', nextStep: 'Print labels' },
  { id: 'Q-1050', customer: 'Praxis Energy', region: 'US-West', owner: 'Noah Bell', priority: 'Critical', status: 'Escalated', ageHours: 37, riskScore: 95, channel: 'Manual', nextStep: 'Open leadership review' },
  { id: 'Q-1054', customer: 'Juniper Bio', region: 'EU-Central', owner: 'Sara Doyle', priority: 'High', status: 'Needs Review', ageHours: 15, riskScore: 72, channel: 'Portal', nextStep: 'Confirm certificate bundle' },
  { id: 'Q-1058', customer: 'Silverline Tech', region: 'APAC', owner: 'Ivy Carter', priority: 'Low', status: 'Pending Approval', ageHours: 8, riskScore: 34, channel: 'API', nextStep: 'Auto-route for approval' },
  { id: 'Q-1062', customer: 'Pioneer Telecom', region: 'US-East', owner: 'Mina Patel', priority: 'Medium', status: 'Ready to Ship', ageHours: 11, riskScore: 41, channel: 'EDI', nextStep: 'Finalize carrier booking' },
  { id: 'Q-1068', customer: 'Acorn Public Sector', region: 'US-South', owner: 'Noah Bell', priority: 'High', status: 'Needs Review', ageHours: 29, riskScore: 78, channel: 'Manual', nextStep: 'Check pricing override memo' },
];

const COLUMNS: readonly DatagridColumn<QueueRecord>[] = [
  { key: 'id', header: 'Queue ID', width: 124, pinned: 'left', sortable: true, filterable: true },
  { key: 'customer', header: 'Customer', width: 180, sortable: true, filterable: true },
  { key: 'region', header: 'Region', width: 120, sortable: true, filterable: true },
  { key: 'owner', header: 'Owner', width: 150, sortable: true, filterable: true },
  { key: 'priority', header: 'Priority', width: 120, sortable: true, filterable: true },
  { key: 'status', header: 'Status', width: 170, sortable: true, filterable: true },
  { key: 'ageHours', header: 'Age', width: 90, sortable: true, valueFormatter: ({ value }) => `${String(value)}h` },
  { key: 'riskScore', header: 'Risk', width: 90, sortable: true, valueFormatter: ({ value }) => `${String(value)}%` },
  { key: 'riskTrend', header: 'Risk trend', width: 140, sortable: false, resizable: false, valueGetter: riskTrendValues },
  { key: 'channel', header: 'Channel', width: 110, sortable: true, filterable: true },
  { key: 'nextStep', header: 'Next Step', width: 240, sortable: true, filterable: true },
];

function priorityColor(priority: QueuePriority): string {
  if (priority === 'Critical') return 'var(--sp-danger)';
  if (priority === 'High') return 'var(--sp-warning)';
  if (priority === 'Medium') return 'var(--sp-primary)';
  return 'var(--sp-text-subtle)';
}

function statusVariant(status: QueueStatus): BadgeVariant {
  if (status === 'Escalated') return 'danger';
  if (status === 'Needs Review') return 'warning';
  if (status === 'Pending Approval') return 'info';
  return 'success';
}

function scoreColor(score: number): string {
  if (score >= 80) return 'var(--sp-danger)';
  if (score >= 60) return 'var(--sp-warning)';
  return 'var(--sp-success)';
}

function ageColor(age: number): string {
  if (age >= 24) return 'var(--sp-danger)';
  if (age >= 16) return 'var(--sp-warning)';
  return 'var(--sp-text-color)';
}

function riskTrendValues(row: QueueRecord): number[] {
  const ageShift = Math.min(8, Math.round(row.ageHours / 6));
  return [
    Math.max(0, row.riskScore - 14 + ageShift),
    Math.max(0, row.riskScore - 10),
    Math.max(0, row.riskScore - 7 + (row.priority === 'Critical' ? 3 : 0)),
    Math.max(0, row.riskScore - 4),
    Math.max(0, row.riskScore - 2),
    row.riskScore,
  ];
}

const OPS_CODE = `import { Badge, Button, Datagrid, Input, Sparkline } from 'spruce-react';

<Input value={searchTerm} onChange={setSearchTerm} iconLeft="search" />
<Datagrid
  rows={filteredRows}
  columns={columns}
  selectionMode="multiple"
  selection={selectedRows}
  pagination
  pageSize={8}
  showStatusbar
  columnSelector
  onSelectionChange={({ selectedRows }) => setSelectedRows(selectedRows)}
  cellTemplates={{
    status: ({ value }) => <Badge variant="info">{String(value)}</Badge>,
    riskTrend: ({ value, row }) => (
      <Sparkline data={riskTrendValues(row)} ariaLabel={'Risk trend for ' + row.customer} />
    ),
  }}
/>`;

export function OperationsGridBlockPage() {
  const [rows, setRows] = useState<QueueRecord[]>(INITIAL_ROWS);
  const [selectedRows, setSelectedRows] = useState<readonly QueueRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const filteredRows = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return rows.filter((row) => {
      if (statusFilter !== 'All' && row.status !== statusFilter) return false;
      if (!search) return true;
      return [row.id, row.customer, row.owner, row.region, row.channel, row.nextStep]
        .join(' ')
        .toLowerCase()
        .includes(search);
    });
  }, [rows, searchTerm, statusFilter]);

  const selectedCritical = selectedRows.filter((row) => row.priority === 'Critical').length;
  const selectedEscalated = selectedRows.filter((row) => row.status === 'Escalated').length;
  const selectedAverageAge = selectedRows.length === 0
    ? 0
    : Math.round(selectedRows.reduce((total, row) => total + row.ageHours, 0) / selectedRows.length);
  const averageRisk = filteredRows.length === 0
    ? 0
    : Math.round(filteredRows.reduce((total, row) => total + row.riskScore, 0) / filteredRows.length);

  function applyBulkStatus(status: QueueStatus): void {
    if (selectedRows.length === 0) return;
    const selectedIds = new Set(selectedRows.map((row) => row.id));
    setRows((currentRows) => currentRows.map((row) => selectedIds.has(row.id)
      ? { ...row, status, nextStep: nextStepFor(status) }
      : row));
    setSelectedRows([]);
  }

  const nextAction = selectedRows.length === 0
    ? 'Start with a filtered view'
    : selectedRows.some((row) => row.status === 'Escalated')
      ? 'Escalation review required'
      : selectedRows.every((row) => row.status === 'Ready to Ship')
        ? 'Release queue to fulfillment'
        : 'Route batch to approval';
  const nextActionDescription = selectedRows.length === 0
    ? 'Use the grid search, column filters, or toolbar controls to narrow the queue before taking action.'
    : selectedRows.some((row) => row.status === 'Escalated')
      ? 'At least one selected record has exceeded normal handling rules and should be reviewed by a senior analyst.'
      : selectedRows.every((row) => row.status === 'Ready to Ship')
        ? 'All selected records are complete and can move to downstream execution without another approval pass.'
        : 'The current selection mixes review states, so the safest next step is a coordinated approval handoff.';
  const owners = new Set(selectedRows.map((row) => row.owner));
  const routingRule = selectedRows.length === 0
    ? 'Owner + status routing'
    : owners.size === 1 ? `Single-owner batch: ${selectedRows[0].owner}` : 'Cross-owner escalation batch';

  const cellTemplates: NonNullable<DatagridProps<QueueRecord>['cellTemplates']> = {
    id: ({ value }) => <strong>{String(value)}</strong>,
    priority: ({ value }) => <span style={{ color: priorityColor(String(value) as QueuePriority), fontWeight: 700 }}>{String(value)}</span>,
    status: ({ value }) => <Badge variant={statusVariant(String(value) as QueueStatus)} size="sm">{String(value)}</Badge>,
    ageHours: ({ value }) => <span style={{ color: ageColor(Number(value)), fontWeight: 600 }}>{String(value)}h</span>,
    riskScore: ({ value }) => <span style={{ color: scoreColor(Number(value)), fontWeight: 600 }}>{String(value)}%</span>,
    riskTrend: ({ row }) => <span className="sp-block-ops__sparkline"><Sparkline data={riskTrendValues(row)} width={116} height={28} config={{ animate: false, showTooltip: false }} ariaLabel={`Risk trend for ${row.customer}`} /></span>,
  };

  return (
    <BlockPageLayout
      title="Operations Grid"
      description="A queue-management block built around Datagrid for triage, bulk review, and analyst handoff. It showcases pinned columns, filtering, selection, toolbar actions, and pagination inside an application-ready shell."
      sections={SECTIONS}
    >
      <section id="queue-workbench" className="demo-section" aria-labelledby="queue-workbench-heading">
        <h2 id="queue-workbench-heading">Queue Workbench</h2>
        <div className="sp-block-frame">
          <header className="sp-block-ops__header">
            <div>
              <div className="sp-block-ops__heading-row"><h3>Shipment exception queue</h3><Badge variant="info" size="sm">Live queue</Badge></div>
              <p>Filter active records, review SLA breaches, and triage risk directly from the grid.</p>
            </div>
            <div className="sp-block-ops__controls">
              <Input size="sm" value={searchTerm} onChange={setSearchTerm} placeholder="Search customer, owner, or queue ID" clearable iconLeft="search" ariaLabel="Search shipment exception queue" />
              <div className="sp-block-ops__filters" role="toolbar" aria-label="Queue status filter">
                {STATUS_FILTERS.map((filter) => <button key={filter} type="button" className="sp-block-ops__filter" aria-pressed={statusFilter === filter} onClick={() => setStatusFilter(filter)}>{filter}</button>)}
              </div>
            </div>
          </header>

          <div className="sp-block-ops__metrics" role="list" aria-label="Queue metrics">
            <div className="sp-block-ops__metric" role="listitem"><span>Visible records</span><strong>{filteredRows.length}</strong></div>
            <div className="sp-block-ops__metric" role="listitem"><span>Escalated</span><strong>{filteredRows.filter((row) => row.status === 'Escalated').length}</strong></div>
            <div className="sp-block-ops__metric" role="listitem"><span>SLA over 24h</span><strong>{filteredRows.filter((row) => row.ageHours >= 24).length}</strong></div>
            <div className="sp-block-ops__metric" role="listitem"><span>Avg. risk</span><strong>{averageRisk}%</strong></div>
          </div>

          <div className="sp-block-ops__grid">
            <Datagrid<QueueRecord>
              ariaLabel="Shipment exception queue"
              rows={filteredRows}
              columns={COLUMNS}
              selectionMode="multiple"
              selection={selectedRows}
              pagination
              pageSize={8}
              showStatusbar
              statusbarMergePagination
              columnSelector
              cellTemplates={cellTemplates}
              onSelectionChange={(event) => setSelectedRows([...event.selectedRows])}
            />
          </div>
        </div>
      </section>

      <section id="bulk-review" className="demo-section" aria-labelledby="bulk-review-heading">
        <h2 id="bulk-review-heading">Bulk Review Actions</h2>
        <div className="sp-block-frame sp-block-frame--pad">
          <div className="sp-block-ops__bulk">
            <div className="sp-block-ops__panel">
              <span className="sp-block-ops__eyebrow">Selection summary</span>
              <h3>{selectedRows.length} record(s) selected</h3>
              <p>Use the datagrid selection model to move multiple records through the queue in one pass.</p>
              <div className="sp-block-ops__selected-meta"><span>Critical: {selectedCritical}</span> · <span>Escalated: {selectedEscalated}</span> · <span>Avg. age: {selectedAverageAge}h</span></div>
            </div>
            <div className="sp-block-ops__actions">
              <Button size="sm" variant="primary" disabled={selectedRows.length === 0} onClick={() => applyBulkStatus('Ready to Ship')}>Mark ready</Button>
              <Button size="sm" variant="outline" disabled={selectedRows.length === 0} onClick={() => applyBulkStatus('Pending Approval')}>Send for approval</Button>
              <Button size="sm" variant="ghost" disabled={selectedRows.length === 0} onClick={() => applyBulkStatus('Escalated')}>Escalate batch</Button>
            </div>
            <div className="sp-block-ops__panel" aria-live="polite">
              <div className="sp-block-ops__selected-list">
                {selectedRows.length === 0 ? <div className="sp-block-ops__empty">Select rows in the grid to preview bulk actions and handoff metadata.</div> : selectedRows.map((row) => (
                  <div className="sp-block-ops__selected-row" key={row.id}>
                    <div><strong>{row.id} · {row.customer}</strong><p className="sp-block-ops__selected-meta">{row.owner} · {row.region} · {row.nextStep}</p></div>
                    <div className="sp-block-ops__selected-tags"><Badge size="sm">{row.priority}</Badge><Badge size="sm" variant="info">{row.status}</Badge></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="handoff-panel" className="demo-section" aria-labelledby="handoff-panel-heading">
        <h2 id="handoff-panel-heading">Analyst Handoff Panel</h2>
        <div className="sp-block-frame sp-block-frame--pad">
          <div className="sp-block-ops__handoff">
            <div className="sp-block-ops__panel"><span className="sp-block-ops__panel-label">Recommended next step</span><h3>{nextAction}</h3><p>{nextActionDescription}</p></div>
            <div className="sp-block-ops__panel"><span className="sp-block-ops__panel-label">Routing rule</span><h3>{routingRule}</h3><p>Automatically derived from the selected queue state and visible data.</p></div>
            <div className="sp-block-ops__panel"><span className="sp-block-ops__panel-label">Shift notes</span><ul className="sp-block-ops__handoff-list"><li>Use pinned columns to keep IDs and customer names visible during review.</li><li>Toolbar filters stay available for owner, status, and risk refinements.</li><li>Pagination keeps dense operational queues readable without losing context.</li></ul></div>
          </div>
        </div>
      </section>

      <section id="code" className="demo-section" aria-labelledby="operations-code-heading">
        <h2 id="operations-code-heading">Source Code</h2>
        <CodePreview code={OPS_CODE} language="typescript" codeOnly title="Datagrid operations block" />
      </section>
    </BlockPageLayout>
  );
}

function nextStepFor(status: QueueStatus): string {
  if (status === 'Ready to Ship') return 'Release to warehouse';
  if (status === 'Pending Approval') return 'Await finance approval';
  if (status === 'Escalated') return 'Open leadership review';
  return 'Return to analyst queue';
}
