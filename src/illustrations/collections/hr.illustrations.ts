import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationEmployeeOnboarding: IllustrationDefinition = {
  name: 'employee-onboarding',
  title: 'Employee Onboarding',
  category: 'hr',
  tags: ['onboarding', 'new hire', 'welcome', 'employee', 'desk', 'laptop', 'hr'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <rect x="70" y="150" width="180" height="10" rx="5" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="110" y="90" width="100" height="60" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #94A3B8)" stroke-width="2"/>
  <rect x="120" y="100" width="80" height="40" rx="4" fill="#0F172A"/>
  <circle cx="160" cy="116" r="10" fill="#10B981"/>
  <path d="M156 116L159 119L165 113" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
  <path d="M100 150L110 142H210L220 150H100Z" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <g transform="translate(64, 100)">
    <rect x="6" y="24" width="18" height="26" rx="4" fill="#10B981"/>
    <path d="M15 10C8 10 4 16 4 24H26C26 16 22 10 15 10Z" fill="#34D399"/>
    <circle cx="15" cy="8" r="4" fill="#059669"/>
  </g>
  <g transform="translate(225, 80)">
    <rect x="0" y="0" width="46" height="58" rx="6" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
    <rect x="8" y="10" width="30" height="4" rx="2" fill="#10B981"/>
    <rect x="8" y="18" width="22" height="3" rx="1.5" fill="var(--sp-ill-subtle, #E2E8F0)"/>
    <rect x="8" y="25" width="26" height="3" rx="1.5" fill="var(--sp-ill-subtle, #E2E8F0)"/>
    <circle cx="12" cy="38" r="5" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <path d="M10 38L11.5 39.5L14 36.5" stroke="#10B981" stroke-width="1.5" stroke-linecap="round"/>
    <rect x="20" y="37" width="16" height="3" rx="1.5" fill="var(--sp-ill-muted, #94A3B8)"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="86" y="195" width="148" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">NEW HIRE READY</text>
  </g>
</svg>`,
};

export const illustrationTeamCollaboration: IllustrationDefinition = {
  name: 'team-collaboration',
  title: 'Team Collaboration',
  category: 'hr',
  tags: ['team', 'collaboration', 'people', 'meeting', 'hr', 'connect', 'culture'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(6, 182, 212, 0.12))"/>
  <line x1="160" y1="78" x2="108" y2="136" stroke="var(--sp-ill-muted, #94A3B8)" stroke-width="2" stroke-dasharray="4 4"/>
  <line x1="160" y1="78" x2="212" y2="136" stroke="var(--sp-ill-muted, #94A3B8)" stroke-width="2" stroke-dasharray="4 4"/>
  <line x1="108" y1="136" x2="212" y2="136" stroke="var(--sp-ill-muted, #94A3B8)" stroke-width="2" stroke-dasharray="4 4"/>
  <g transform="translate(140, 54)">
    <circle cx="20" cy="20" r="18" fill="var(--sp-ill-card, #FFFFFF)" stroke="#10B981" stroke-width="2.5"/>
    <circle cx="20" cy="16" r="6" fill="#10B981"/>
    <path d="M12 28C12 24 16 22 20 22C24 22 28 24 28 28" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>
  </g>
  <g transform="translate(88, 114)">
    <circle cx="20" cy="20" r="18" fill="var(--sp-ill-card, #FFFFFF)" stroke="#06B6D4" stroke-width="2.5"/>
    <circle cx="20" cy="16" r="6" fill="#06B6D4"/>
    <path d="M12 28C12 24 16 22 20 22C24 22 28 24 28 28" stroke="#06B6D4" stroke-width="2" stroke-linecap="round"/>
  </g>
  <g transform="translate(192, 114)">
    <circle cx="20" cy="20" r="18" fill="var(--sp-ill-card, #FFFFFF)" stroke="#F59E0B" stroke-width="2.5"/>
    <circle cx="20" cy="16" r="6" fill="#F59E0B"/>
    <path d="M12 28C12 24 16 22 20 22C24 22 28 24 28 28" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
  </g>
  <circle cx="160" cy="116" r="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="2"/>
  <path d="M160 110V122M154 116H166" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>
  <g class="sp-ill-badge">
    <rect x="105" y="195" width="110" height="24" rx="12" fill="var(--sp-ill-card, #F0FDFA)" stroke="#06B6D4"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#06B6D4" text-anchor="middle">ONE TEAM</text>
  </g>
</svg>`,
};

export const illustrationTalentRecruitment: IllustrationDefinition = {
  name: 'talent-recruitment',
  title: 'Talent Recruitment',
  category: 'hr',
  tags: ['recruitment', 'talent', 'hiring', 'interview', 'resume', 'candidate', 'hr'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(99, 102, 241, 0.12))"/>
  <rect x="95" y="55" width="90" height="120" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <circle cx="140" cy="85" r="14" fill="var(--sp-ill-subtle, #F1F5F9)" stroke="var(--sp-ill-muted, #94A3B8)" stroke-width="1.5"/>
  <circle cx="140" cy="82" r="5" fill="var(--sp-ill-muted, #64748B)"/>
  <path d="M132 94C132 89 135 88 140 88C145 88 148 89 148 94" stroke="var(--sp-ill-muted, #64748B)" stroke-width="1.5" stroke-linecap="round"/>
  <rect x="110" y="110" width="60" height="4" rx="2" fill="#10B981"/>
  <rect x="110" y="118" width="50" height="3" rx="1.5" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="110" y="125" width="40" height="3" rx="1.5" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="110" y="132" width="55" height="3" rx="1.5" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <circle cx="185" cy="130" r="34" fill="var(--sp-ill-card, #FFFFFF)" stroke="#10B981" stroke-width="3"/>
  <circle cx="185" cy="130" r="26" fill="#10B981" fill-opacity="0.15"/>
  <polygon points="185,116 188,124 196,124 190,129 192,137 185,132 178,137 180,129 174,124 182,124" fill="#F59E0B"/>
  <line x1="209" y1="154" x2="235" y2="180" stroke="var(--sp-ill-text, #0F172A)" stroke-width="5" stroke-linecap="round"/>
  <g class="sp-ill-badge">
    <rect x="98" y="195" width="124" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">TOP TALENT</text>
  </g>
</svg>`,
};

export const illustrationPerformanceReview: IllustrationDefinition = {
  name: 'performance-review',
  title: 'Performance Review',
  category: 'hr',
  tags: ['performance', 'review', 'kpi', 'growth', 'goals', 'evaluation', 'hr'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <rect x="85" y="60" width="150" height="110" rx="10" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <line x1="105" y1="145" x2="215" y2="145" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="2"/>
  <rect x="115" y="115" width="16" height="30" rx="3" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="140" y="95" width="16" height="50" rx="3" fill="#A7F3D0" fill-opacity="0.5"/>
  <rect x="165" y="75" width="16" height="70" rx="3" fill="#34D399"/>
  <rect x="190" y="65" width="16" height="80" rx="3" fill="#10B981"/>
  <path d="M123 105L148 85L173 70L198 55" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="198" cy="55" r="4" fill="#F59E0B"/>
  <g transform="translate(200, 125)">
    <circle cx="16" cy="16" r="16" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B" stroke-width="2"/>
    <polygon points="16,8 18.5,13.5 24,14 20,18 21,23.5 16,20.5 11,23.5 12,18 8,14 13.5,13.5" fill="#F59E0B"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="88" y="195" width="144" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">EXCEEDS GOALS</text>
  </g>
</svg>`,
};

export const illustrationLeaveVacation: IllustrationDefinition = {
  name: 'leave-vacation',
  title: 'Leave & Vacation',
  category: 'hr',
  tags: ['leave', 'vacation', 'time off', 'pto', 'holiday', 'beach', 'umbrella', 'hr'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.12))"/>
  <circle cx="225" cy="70" r="18" fill="#FBBF24" fill-opacity="0.8"/>
  <path d="M80 165C130 155 190 155 240 165V185H80V165Z" fill="#FDE68A" fill-opacity="0.6"/>
  <path d="M80 175C130 168 190 168 240 175V185H80V175Z" fill="#FCD34D" fill-opacity="0.7"/>
  <g transform="translate(130, 80)">
    <line x1="30" y1="20" x2="30" y2="85" stroke="#92400E" stroke-width="4" stroke-linecap="round"/>
    <path d="M5 25C5 8 55 8 55 25H5Z" fill="#EF4444"/>
    <path d="M15 25C15 12 45 12 45 25H15Z" fill="#FFFFFF"/>
    <path d="M25 25C25 15 35 15 35 25H25Z" fill="#06B6D4"/>
  </g>
  <g transform="translate(180, 130)">
    <rect x="0" y="0" width="36" height="24" rx="4" fill="var(--sp-ill-card, #FFFFFF)" stroke="#0284C7" stroke-width="1.5"/>
    <rect x="4" y="4" width="28" height="6" fill="#0284C7" fill-opacity="0.2"/>
    <text x="18" y="20" font-family="system-ui, sans-serif" font-weight="700" font-size="8" fill="#0284C7" text-anchor="middle">PTO</text>
  </g>
  <g class="sp-ill-badge">
    <rect x="86" y="195" width="148" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#F59E0B" text-anchor="middle">TIME OFF / PTO</text>
  </g>
</svg>`,
};

export const illustrationTrainingLearning: IllustrationDefinition = {
  name: 'training-learning',
  title: 'Training & Development',
  category: 'hr',
  tags: ['training', 'learning', 'education', 'skills', 'degree', 'course', 'hr'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(59, 130, 246, 0.12))"/>
  <rect x="90" y="145" width="140" height="18" rx="4" fill="#3B82F6" stroke="#1D4ED8" stroke-width="1.5"/>
  <rect x="100" y="125" width="120" height="18" rx="4" fill="#10B981" stroke="#047857" stroke-width="1.5"/>
  <rect x="110" y="105" width="100" height="18" rx="4" fill="#F59E0B" stroke="#B45309" stroke-width="1.5"/>
  <path d="M160 52L215 72L160 92L105 72L160 52Z" fill="#1E293B"/>
  <rect x="135" y="74" width="50" height="14" rx="2" fill="#0F172A"/>
  <line x1="205" y1="74" x2="205" y2="105" stroke="#F59E0B" stroke-width="2"/>
  <circle cx="205" cy="107" r="3" fill="#F59E0B"/>
  <g transform="translate(68, 65)">
    <circle cx="14" cy="14" r="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <path d="M10 14L13 17L19 11" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="88" y="195" width="144" height="24" rx="12" fill="var(--sp-ill-card, #EFF6FF)" stroke="#3B82F6"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#3B82F6" text-anchor="middle">SKILLS GROWTH</text>
  </g>
</svg>`,
};

export const illustrationOrganizationChart: IllustrationDefinition = {
  name: 'organization-chart',
  title: 'Organization Chart',
  category: 'hr',
  tags: ['org chart', 'hierarchy', 'structure', 'teams', 'departments', 'manager', 'hr'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.12))"/>
  <line x1="160" y1="80" x2="160" y2="105" stroke="var(--sp-ill-muted, #94A3B8)" stroke-width="2"/>
  <line x1="100" y1="105" x2="220" y2="105" stroke="var(--sp-ill-muted, #94A3B8)" stroke-width="2"/>
  <line x1="100" y1="105" x2="100" y2="125" stroke="var(--sp-ill-muted, #94A3B8)" stroke-width="2"/>
  <line x1="160" y1="105" x2="160" y2="125" stroke="var(--sp-ill-muted, #94A3B8)" stroke-width="2"/>
  <line x1="220" y1="105" x2="220" y2="125" stroke="var(--sp-ill-muted, #94A3B8)" stroke-width="2"/>
  <rect x="125" y="55" width="70" height="28" rx="6" fill="var(--sp-ill-card, #FFFFFF)" stroke="#10B981" stroke-width="2"/>
  <circle cx="140" cy="69" r="6" fill="#10B981"/>
  <rect x="152" y="66" width="34" height="6" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="70" y="125" width="60" height="26" rx="5" fill="var(--sp-ill-card, #FFFFFF)" stroke="#06B6D4" stroke-width="1.5"/>
  <circle cx="82" cy="138" r="5" fill="#06B6D4"/>
  <rect x="92" y="135" width="28" height="5" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="130" y="125" width="60" height="26" rx="5" fill="var(--sp-ill-card, #FFFFFF)" stroke="#6366F1" stroke-width="1.5"/>
  <circle cx="142" cy="138" r="5" fill="#6366F1"/>
  <rect x="152" y="135" width="28" height="5" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <rect x="190" y="125" width="60" height="26" rx="5" fill="var(--sp-ill-card, #FFFFFF)" stroke="#F59E0B" stroke-width="1.5"/>
  <circle cx="202" cy="138" r="5" fill="#F59E0B"/>
  <rect x="212" y="135" width="28" height="5" rx="2" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <g class="sp-ill-badge">
    <rect x="88" y="195" width="144" height="24" rx="12" fill="var(--sp-ill-card, #F1F5F9)" stroke="var(--sp-ill-border, #CBD5E1)"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="var(--sp-ill-text, #475569)" text-anchor="middle">ORG HIERARCHY</text>
  </g>
</svg>`,
};

export const HR_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationEmployeeOnboarding,
  illustrationTeamCollaboration,
  illustrationTalentRecruitment,
  illustrationPerformanceReview,
  illustrationLeaveVacation,
  illustrationTrainingLearning,
  illustrationOrganizationChart,
] as const;
