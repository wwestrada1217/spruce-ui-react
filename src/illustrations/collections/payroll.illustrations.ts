import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationPayrollProcessing: IllustrationDefinition = {
  name: 'payroll-processing',
  title: 'Payroll Processing',
  category: 'payroll',
  tags: ['payroll', 'processing', 'salary', 'calculator', 'batch', 'pay day'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <rect x="85" y="60" width="80" height="115" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <rect x="95" y="72" width="60" height="22" rx="4" fill="#0F172A"/>
  <text x="150" y="88" font-family="monospace" font-weight="700" font-size="12" fill="#10B981" text-anchor="end">$48,250</text>
  <circle cx="103" cy="108" r="4" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <circle cx="118" cy="108" r="4" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <circle cx="133" cy="108" r="4" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <circle cx="147" cy="108" r="4" fill="#10B981"/>
  <circle cx="103" cy="124" r="4" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <circle cx="118" cy="124" r="4" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <circle cx="133" cy="124" r="4" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <circle cx="147" cy="124" r="4" fill="#10B981"/>
  <circle cx="103" cy="140" r="4" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <circle cx="118" cy="140" r="4" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <circle cx="133" cy="140" r="4" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <circle cx="147" cy="140" r="4" fill="#10B981"/>
  <circle cx="103" cy="156" r="4" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <circle cx="118" cy="156" r="4" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <circle cx="133" cy="156" r="4" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <circle cx="147" cy="156" r="4" fill="#059669"/>
  <g transform="translate(170, 75)">
    <rect x="0" y="0" width="70" height="45" rx="6" fill="#10B981"/>
    <path d="M0 0L35 25L70 0" stroke="#047857" stroke-width="2" fill="none"/>
    <circle cx="35" cy="22" r="8" fill="#FFFFFF"/>
    <text x="35" y="26" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#059669" text-anchor="middle">$</text>
  </g>
  <g transform="translate(180, 125)">
    <circle cx="20" cy="20" r="18" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="2"/>
    <path d="M14 20L18 24L26 16" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="76" y="195" width="168" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">PAYROLL DISBURSED</text>
  </g>
</svg>`,
};

export const illustrationPayslip: IllustrationDefinition = {
  name: 'payslip',
  title: 'Payslip & Salary Breakdown',
  category: 'payroll',
  tags: ['payslip', 'salary', 'statement', 'paycheck', 'earnings', 'deductions'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.12))"/>
  <rect x="105" y="50" width="110" height="135" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <rect x="120" y="62" width="45" height="6" rx="3" fill="#10B981"/>
  <rect x="180" y="62" width="22" height="6" rx="3" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <line x1="120" y1="78" x2="200" y2="78" stroke="var(--sp-ill-border, #F1F5F9)" stroke-width="2"/>
  <rect x="120" y="88" width="50" height="4" rx="2" fill="var(--sp-ill-muted, #94A3B8)"/>
  <rect x="180" y="88" width="22" height="4" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="120" y="98" width="40" height="4" rx="2" fill="var(--sp-ill-muted, #94A3B8)"/>
  <rect x="180" y="98" width="22" height="4" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="120" y="108" width="45" height="4" rx="2" fill="var(--sp-ill-muted, #94A3B8)"/>
  <rect x="180" y="108" width="22" height="4" rx="2" fill="#EF4444"/>
  <line x1="120" y1="122" x2="200" y2="122" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="1.5" stroke-dasharray="3 3"/>
  <rect x="120" y="132" width="35" height="5" rx="2.5" fill="var(--sp-ill-text, #0F172A)"/>
  <text x="202" y="138" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#10B981" text-anchor="end">$4,850</text>
  <g transform="translate(160, 148)">
    <circle cx="16" cy="16" r="14" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <path d="M11 16L14 19L21 12" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="96" y="195" width="128" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">NET PAYSLIP</text>
  </g>
</svg>`,
};

export const illustrationDirectDeposit: IllustrationDefinition = {
  name: 'direct-deposit',
  title: 'Direct Deposit',
  category: 'payroll',
  tags: ['direct deposit', 'bank transfer', 'ach', 'wire', 'card', 'payment'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <g transform="translate(80, 85)">
    <polygon points="35,5 5,20 65,20" fill="var(--sp-ill-muted, #64748B)"/>
    <rect x="10" y="20" width="8" height="30" fill="var(--sp-ill-border, #94A3B8)"/>
    <rect x="25" y="20" width="8" height="30" fill="var(--sp-ill-border, #94A3B8)"/>
    <rect x="40" y="20" width="8" height="30" fill="var(--sp-ill-border, #94A3B8)"/>
    <rect x="55" y="20" width="8" height="30" fill="var(--sp-ill-border, #94A3B8)"/>
    <rect x="5" y="50" width="62" height="6" fill="var(--sp-ill-muted, #475569)"/>
  </g>
  <path d="M155 105C170 85 185 85 200 95" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 4"/>
  <polygon points="202,96 193,92 198,103" fill="#10B981"/>
  <g transform="translate(180, 95)">
    <rect x="0" y="0" width="65" height="42" rx="6" fill="#1E293B" stroke="#0F172A" stroke-width="1.5"/>
    <rect x="0" y="10" width="65" height="8" fill="#334155"/>
    <rect x="8" y="26" width="18" height="4" rx="2" fill="#F59E0B"/>
    <circle cx="50" cy="28" r="4" fill="#10B981"/>
    <circle cx="56" cy="28" r="4" fill="#06B6D4" fill-opacity="0.8"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">INSTANT DEPOSIT</text>
  </g>
</svg>`,
};

export const illustrationTimeTracking: IllustrationDefinition = {
  name: 'time-tracking',
  title: 'Time & Attendance Tracking',
  category: 'payroll',
  tags: ['time', 'attendance', 'hours', 'clock', 'timesheet', 'overtime', 'shifts'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(6, 182, 212, 0.12))"/>
  <rect x="75" y="65" width="105" height="110" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <rect x="85" y="75" width="85" height="10" rx="2" fill="#10B981"/>
  <rect x="85" y="94" width="20" height="6" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="110" y="94" width="30" height="6" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="145" y="94" width="22" height="6" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="85" y="110" width="20" height="6" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="110" y="110" width="30" height="6" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="145" y="110" width="22" height="6" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="85" y="126" width="20" height="6" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="110" y="126" width="30" height="6" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="145" y="126" width="22" height="6" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="85" y="142" width="20" height="6" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="110" y="142" width="30" height="6" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="145" y="142" width="22" height="6" rx="2" fill="#10B981"/>
  <g transform="translate(170, 90)">
    <circle cx="36" cy="36" r="32" fill="var(--sp-ill-card, #FFFFFF)" stroke="#06B6D4" stroke-width="3"/>
    <path d="M36 18V36L48 44" stroke="#06B6D4" stroke-width="3" stroke-linecap="round"/>
    <circle cx="36" cy="36" r="3" fill="#0891B2"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="76" y="195" width="168" height="24" rx="12" fill="var(--sp-ill-card, #F0FDFA)" stroke="#06B6D4"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#06B6D4" text-anchor="middle">40.0 HOURS LOGGED</text>
  </g>
</svg>`,
};

export const illustrationTaxDeductions: IllustrationDefinition = {
  name: 'tax-deductions',
  title: 'Tax & Deductions',
  category: 'payroll',
  tags: ['tax', 'deductions', 'w2', 'irs', 'withholding', 'compliance'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.12))"/>
  <rect x="100" y="55" width="120" height="125" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <rect x="115" y="70" width="40" height="8" rx="2" fill="#F59E0B"/>
  <text x="205" y="78" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="var(--sp-ill-muted, #94A3B8)" text-anchor="end">W-2 FORM</text>
  <line x1="115" y1="88" x2="205" y2="88" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="1.5"/>
  <rect x="115" y="98" width="55" height="5" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="180" y="98" width="25" height="5" rx="2" fill="#EF4444"/>
  <rect x="115" y="110" width="50" height="5" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="180" y="110" width="25" height="5" rx="2" fill="#EF4444"/>
  <rect x="115" y="122" width="60" height="5" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="180" y="122" width="25" height="5" rx="2" fill="#EF4444"/>
  <g transform="translate(180, 130)">
    <circle cx="18" cy="18" r="16" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="2"/>
    <path d="M12 18L16 22L24 14" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="90" y="195" width="140" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#F59E0B" text-anchor="middle">TAX COMPLIANT</text>
  </g>
</svg>`,
};

export const illustrationBonusIncentive: IllustrationDefinition = {
  name: 'bonus-incentive',
  title: 'Bonus & Incentives',
  category: 'payroll',
  tags: ['bonus', 'incentive', 'reward', 'gift', 'trophy', 'commission'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.14))"/>
  <g transform="translate(120, 80)">
    <rect x="0" y="26" width="80" height="60" rx="8" fill="#10B981" stroke="#059669" stroke-width="2"/>
    <rect x="0" y="16" width="80" height="14" rx="4" fill="#34D399" stroke="#059669" stroke-width="2"/>
    <rect x="34" y="16" width="12" height="70" fill="#F59E0B"/>
    <path d="M40 16C30 4 20 6 24 16C28 16 34 16 40 16Z" fill="#FBBF24"/>
    <path d="M40 16C50 4 60 6 56 16C52 16 46 16 40 16Z" fill="#FBBF24"/>
    <circle cx="40" cy="16" r="4" fill="#D97706"/>
  </g>
  <circle cx="95" cy="80" r="10" fill="#FBBF24" stroke="#D97706" stroke-width="1.5"/>
  <text x="95" y="84" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#B45309" text-anchor="middle">$</text>
  <circle cx="225" cy="90" r="12" fill="#FBBF24" stroke="#D97706" stroke-width="1.5"/>
  <text x="225" y="95" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="#B45309" text-anchor="middle">$</text>
  <g class="sp-ill-badge">
    <rect x="92" y="195" width="136" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#F59E0B" text-anchor="middle">ANNUAL BONUS</text>
  </g>
</svg>`,
};

export const illustrationCompensationBenefits: IllustrationDefinition = {
  name: 'compensation-benefits',
  title: 'Compensation & Benefits',
  category: 'payroll',
  tags: ['compensation', 'benefits', 'insurance', 'health', 'perks', 'shield'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(59, 130, 246, 0.12))"/>
  <g transform="translate(115, 60)">
    <path d="M45 10L80 26V65C80 92 62 110 45 118C28 110 10 92 10 65V26L45 10Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#3B82F6" stroke-width="3"/>
    <rect x="38" y="44" width="14" height="40" rx="3" fill="#EF4444"/>
    <rect x="25" y="57" width="40" height="14" rx="3" fill="#EF4444"/>
  </g>
  <g transform="translate(195, 120)">
    <circle cx="18" cy="18" r="16" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B" stroke-width="2"/>
    <text x="18" y="23" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="#F59E0B" text-anchor="middle">$</text>
  </g>
  <g class="sp-ill-badge">
    <rect x="90" y="195" width="140" height="24" rx="12" fill="var(--sp-ill-card, #EFF6FF)" stroke="#3B82F6"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#3B82F6" text-anchor="middle">TOTAL REWARDS</text>
  </g>
</svg>`,
};

export const PAYROLL_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationPayrollProcessing,
  illustrationPayslip,
  illustrationDirectDeposit,
  illustrationTimeTracking,
  illustrationTaxDeductions,
  illustrationBonusIncentive,
  illustrationCompensationBenefits,
] as const;
