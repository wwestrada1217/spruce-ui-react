import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationInvoiceBilling: IllustrationDefinition = {
  name: 'invoice-billing',
  title: 'Invoice & Billing',
  category: 'finance',
  tags: ['invoice', 'billing', 'accounts receivable', 'payment', 'due date', 'finance'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <rect x="95" y="45" width="130" height="145" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <rect x="115" y="60" width="35" height="8" rx="2" fill="#10B981"/>
  <text x="205" y="68" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="var(--sp-ill-muted, #94A3B8)" text-anchor="end">INV-2026-089</text>
  <line x1="115" y1="78" x2="205" y2="78" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="1.5"/>
  <rect x="115" y="90" width="55" height="5" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="180" y="90" width="25" height="5" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="115" y="104" width="45" height="5" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="180" y="104" width="25" height="5" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="115" y="118" width="60" height="5" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="180" y="118" width="25" height="5" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
  <line x1="115" y1="134" x2="205" y2="134" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <rect x="115" y="145" width="35" height="6" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
  <text x="205" y="152" font-family="system-ui, sans-serif" font-weight="800" font-size="13" fill="#10B981" text-anchor="end">$12,450.00</text>
  <g transform="translate(170, 140)">
    <rect x="0" y="0" width="50" height="22" rx="4" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <text x="25" y="15" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#10B981" text-anchor="middle">PAID</text>
  </g>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">INVOICE SETTLED</text>
  </g>
</svg>`,
};

export const illustrationBudgetPlanning: IllustrationDefinition = {
  name: 'budget-planning',
  title: 'Budget & Financial Planning',
  category: 'finance',
  tags: ['budget', 'planning', 'finance', 'pie chart', 'forecast', 'allocation'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <g transform="translate(160, 115)">
    <path d="M0 0L48 -15A50 50 0 0 0 -45 -22Z" fill="#10B981"/>
    <path d="M0 0L-45 -22A50 50 0 0 0 -25 43Z" fill="#06B6D4"/>
    <path d="M0 0L-25 43A50 50 0 0 0 45 22Z" fill="#F59E0B"/>
    <path d="M0 0L45 22A50 50 0 0 0 48 -15Z" fill="#6366F1"/>
    <circle cx="0" cy="0" r="24" fill="var(--sp-ill-card, #FFFFFF)"/>
    <text x="0" y="4" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="var(--sp-ill-text, #0F172A)" text-anchor="middle">100%</text>
  </g>
  <g transform="translate(65, 80)">
    <circle cx="6" cy="6" r="4" fill="#10B981"/>
    <rect x="15" y="3" width="35" height="6" rx="2" fill="var(--sp-ill-muted, #64748B)"/>
    <circle cx="6" cy="22" r="4" fill="#06B6D4"/>
    <rect x="15" y="19" width="35" height="6" rx="2" fill="var(--sp-ill-muted, #64748B)"/>
    <circle cx="6" cy="38" r="4" fill="#F59E0B"/>
    <rect x="15" y="35" width="35" height="6" rx="2" fill="var(--sp-ill-muted, #64748B)"/>
    <circle cx="6" cy="54" r="4" fill="#6366F1"/>
    <rect x="15" y="51" width="35" height="6" rx="2" fill="var(--sp-ill-muted, #64748B)"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="80" y="195" width="160" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">BUDGET ALLOCATED</text>
  </g>
</svg>`,
};

export const illustrationExpenseReport: IllustrationDefinition = {
  name: 'expense-report',
  title: 'Expense Reporting',
  category: 'finance',
  tags: ['expense', 'receipt', 'reimbursement', 'finance', 'spending', 'claims'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.12))"/>
  <g transform="translate(100, 50)">
    <path d="M0 0H90V130L80 125L70 130L60 125L50 130L40 125L30 130L20 125L10 130L0 125V0Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
    <circle cx="45" cy="22" r="10" fill="var(--sp-ill-subtle, #F1F5F9)"/>
    <text x="45" y="26" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="var(--sp-ill-text, #0F172A)" text-anchor="middle">$</text>
    <line x1="15" y1="42" x2="75" y2="42" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="1.5"/>
    <rect x="15" y="52" width="30" height="4" rx="2" fill="var(--sp-ill-muted, #94A3B8)"/>
    <rect x="55" y="52" width="20" height="4" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
    <rect x="15" y="64" width="35" height="4" rx="2" fill="var(--sp-ill-muted, #94A3B8)"/>
    <rect x="55" y="64" width="20" height="4" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
    <rect x="15" y="76" width="25" height="4" rx="2" fill="var(--sp-ill-muted, #94A3B8)"/>
    <rect x="55" y="76" width="20" height="4" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
    <line x1="15" y1="92" x2="75" y2="92" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="1.5" stroke-dasharray="2 2"/>
    <rect x="15" y="102" width="25" height="5" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
    <text x="75" y="107" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#10B981" text-anchor="end">$342.50</text>
  </g>
  <g transform="translate(170, 125)">
    <circle cx="20" cy="20" r="18" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="2"/>
    <path d="M14 20L18 24L26 16" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="80" y="195" width="160" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">EXPENSE APPROVED</text>
  </g>
</svg>`,
};

export const illustrationFinancialGrowth: IllustrationDefinition = {
  name: 'financial-growth',
  title: 'Financial Growth & Profit',
  category: 'finance',
  tags: ['growth', 'profit', 'revenue', 'chart', 'investment', 'success', 'finance'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <defs>
    <linearGradient id="fg-chart" x1="160" y1="60" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#10B981" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#10B981" stop-opacity="0.0"/>
    </linearGradient>
  </defs>
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <rect x="80" y="60" width="160" height="110" rx="10" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <path d="M100 145L125 125L150 135L180 100L215 75V145H100Z" fill="url(#fg-chart)"/>
  <path d="M100 145L125 125L150 135L180 100L215 75" stroke="#10B981" stroke-width="3" stroke-linecap="round"/>
  <circle cx="125" cy="125" r="4" fill="#10B981"/>
  <circle cx="150" cy="135" r="4" fill="#10B981"/>
  <circle cx="180" cy="100" r="4" fill="#10B981"/>
  <circle cx="215" cy="75" r="5" fill="#10B981"/>
  <g transform="translate(200, 50)">
    <rect x="0" y="0" width="46" height="20" rx="10" fill="#10B981"/>
    <text x="23" y="14" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#FFFFFF" text-anchor="middle">+38.4%</text>
  </g>
  <g class="sp-ill-badge">
    <rect x="86" y="195" width="148" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">RECORD QUARTER</text>
  </g>
</svg>`,
};

export const illustrationWalletPayments: IllustrationDefinition = {
  name: 'wallet-payments',
  title: 'Digital Wallet & Payments',
  category: 'finance',
  tags: ['wallet', 'payment', 'card', 'cash', 'transfer', 'fintech'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(6, 182, 212, 0.12))"/>
  <g transform="translate(100, 70)">
    <rect x="0" y="20" width="120" height="80" rx="12" fill="#0F172A" stroke="#334155" stroke-width="2"/>
    <path d="M10 20V12C10 7.6 13.6 4 18 4H102C106.4 4 110 7.6 110 12V20" stroke="#475569" stroke-width="2" fill="#1E293B"/>
    <rect x="80" y="46" width="40" height="28" rx="6" fill="#10B981"/>
    <circle cx="94" cy="60" r="5" fill="#FFFFFF"/>
  </g>
  <g transform="translate(130, 42)">
    <rect x="0" y="0" width="70" height="42" rx="6" fill="#06B6D4" stroke="#0891B2" stroke-width="1.5"/>
    <rect x="8" y="24" width="18" height="4" rx="2" fill="#FFFFFF" fill-opacity="0.8"/>
    <circle cx="54" cy="26" r="6" fill="#FFFFFF" fill-opacity="0.6"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="86" y="195" width="148" height="24" rx="12" fill="var(--sp-ill-card, #F0FDFA)" stroke="#06B6D4"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#06B6D4" text-anchor="middle">PAYMENT SYNCED</text>
  </g>
</svg>`,
};

export const illustrationFinancialAudit: IllustrationDefinition = {
  name: 'financial-audit',
  title: 'Financial Audit & Compliance',
  category: 'finance',
  tags: ['audit', 'compliance', 'ledger', 'accounting', 'review', 'inspection'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(99, 102, 241, 0.12))"/>
  <rect x="90" y="55" width="105" height="120" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <rect x="105" y="70" width="40" height="6" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
  <line x1="105" y1="84" x2="180" y2="84" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="1.5"/>
  <rect x="105" y="94" width="25" height="4" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="145" y="94" width="30" height="4" rx="2" fill="#10B981"/>
  <rect x="105" y="106" width="25" height="4" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="145" y="106" width="30" height="4" rx="2" fill="#10B981"/>
  <rect x="105" y="118" width="25" height="4" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="145" y="118" width="30" height="4" rx="2" fill="#10B981"/>
  <circle cx="185" cy="130" r="32" fill="var(--sp-ill-card, #FFFFFF)" stroke="#6366F1" stroke-width="3"/>
  <circle cx="185" cy="130" r="24" fill="#6366F1" fill-opacity="0.15"/>
  <path d="M177 130L182 135L193 124" stroke="#6366F1" stroke-width="3" stroke-linecap="round"/>
  <line x1="208" y1="153" x2="232" y2="177" stroke="var(--sp-ill-text, #0F172A)" stroke-width="5" stroke-linecap="round"/>
  <g class="sp-ill-badge">
    <rect x="86" y="195" width="148" height="24" rx="12" fill="var(--sp-ill-card, #EEF2FF)" stroke="#6366F1"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#6366F1" text-anchor="middle">AUDIT VERIFIED</text>
  </g>
</svg>`,
};

export const illustrationRevenueAnalytics: IllustrationDefinition = {
  name: 'revenue-analytics',
  title: 'Revenue Analytics',
  category: 'finance',
  tags: ['revenue', 'analytics', 'dashboard', 'sales', 'mrr', 'arr', 'finance'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <rect x="80" y="60" width="160" height="110" rx="10" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <rect x="95" y="74" width="45" height="10" rx="3" fill="#10B981"/>
  <text x="225" y="84" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="var(--sp-ill-text, #0F172A)" text-anchor="end">$1.2M ARR</text>
  <rect x="95" y="125" width="18" height="30" rx="3" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="122" y="110" width="18" height="45" rx="3" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="149" y="95" width="18" height="60" rx="3" fill="#A7F3D0" fill-opacity="0.5"/>
  <rect x="176" y="85" width="18" height="70" rx="3" fill="#34D399"/>
  <rect x="203" y="70" width="18" height="85" rx="3" fill="#10B981"/>
  <g class="sp-ill-badge">
    <rect x="90" y="195" width="140" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">STRONG GROWTH</text>
  </g>
</svg>`,
};

export const FINANCE_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationInvoiceBilling,
  illustrationBudgetPlanning,
  illustrationExpenseReport,
  illustrationFinancialGrowth,
  illustrationWalletPayments,
  illustrationFinancialAudit,
  illustrationRevenueAnalytics,
] as const;
