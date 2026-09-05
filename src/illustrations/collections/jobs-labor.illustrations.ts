import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationJobInterview: IllustrationDefinition = {
  name: 'job-interview',
  title: 'Job Interview & Candidate Hiring',
  category: 'jobs-labor',
  tags: ['job', 'interview', 'hiring', 'recruitment', 'candidate', 'resume', 'cv', 'career', 'hr'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="195" rx="88" ry="18" fill="var(--sp-ill-halo, rgba(2,132,199,0.12))"/>
    <circle cx="160" cy="118" r="76" fill="var(--sp-ill-halo, rgba(2,132,199,0.06))"/>
    <!-- Interview Desk -->
    <rect x="80" y="145" width="160" height="12" rx="4" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
    <rect x="95" y="157" width="8" height="45" rx="3" fill="var(--sp-ill-border, #94A3B8)"/>
    <rect x="217" y="157" width="8" height="45" rx="3" fill="var(--sp-ill-border, #94A3B8)"/>
    <line x1="99" y1="180" x2="221" y2="180" stroke="var(--sp-ill-line, #CBD5E1)" stroke-width="2"/>
    <!-- Interviewer Silhouette Left -->
    <g transform="translate(68, 85)">
      <circle cx="24" cy="16" r="14" fill="#0284C7"/>
      <path d="M4 58 C4 42 14 36 24 36 C34 36 44 42 44 58 Z" fill="#0369A1"/>
      <!-- Tie -->
      <polygon points="22,36 26,36 25,50 23,50" fill="#38BDF8"/>
    </g>
    <!-- Candidate Silhouette Right -->
    <g transform="translate(208, 85)">
      <circle cx="24" cy="16" r="14" fill="#10B981"/>
      <path d="M4 58 C4 42 14 36 24 36 C34 36 44 42 44 58 Z" fill="#059669"/>
      <!-- Collar -->
      <polygon points="21,36 27,36 24,44" fill="#FFFFFF"/>
    </g>
    <!-- Resume / CV on Table -->
    <g transform="translate(138, 132)">
      <rect x="0" y="0" width="44" height="20" rx="3" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="1.5"/>
      <line x1="6" y1="6" x2="38" y2="6" stroke="#0284C7" stroke-width="2"/>
      <line x1="6" y1="10" x2="28" y2="10" stroke="var(--sp-ill-line, #CBD5E1)" stroke-width="1.5"/>
      <line x1="6" y1="14" x2="34" y2="14" stroke="var(--sp-ill-line, #CBD5E1)" stroke-width="1.5"/>
    </g>
    <!-- Briefcase beside table -->
    <g transform="translate(242, 160)">
      <rect x="0" y="10" width="36" height="26" rx="4" fill="#64748B"/>
      <rect x="12" y="5" width="12" height="6" rx="2" fill="none" stroke="#64748B" stroke-width="2"/>
      <line x1="0" y1="20" x2="36" y2="20" stroke="#475569" stroke-width="1.5"/>
      <rect x="16" y="18" width="4" height="4" rx="1" fill="#F59E0B"/>
    </g>
    <!-- Checkmark Badge of Approval floating -->
    <g transform="translate(142, 60)">
      <circle cx="18" cy="18" r="16" fill="#10B981"/>
      <path d="M12 18 L16 22 L24 14" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="70" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(2,132,199,0.12))" stroke="var(--sp-ill-tag-border, #38BDF8)" stroke-width="1"/>
      <text x="47" y="29" fill="var(--sp-ill-tag-text, #0284C7)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">HIRING</text>
    </g>
  </svg>`,
};

export const illustrationTradesWorker: IllustrationDefinition = {
  name: 'trades-worker',
  title: 'Skilled Trades & Craft Labor',
  category: 'jobs-labor',
  tags: ['job', 'trades', 'labor', 'construction', 'worker', 'tools', 'technician', 'craftsman'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="198" rx="85" ry="18" fill="var(--sp-ill-halo, rgba(245,158,11,0.12))"/>
    <circle cx="160" cy="120" r="76" fill="var(--sp-ill-halo, rgba(245,158,11,0.06))"/>
    <!-- Structural Girder Background -->
    <g stroke="var(--sp-ill-line, #CBD5E1)" stroke-width="2">
      <line x1="50" y1="60" x2="270" y2="60"/>
      <line x1="50" y1="75" x2="270" y2="75"/>
      <line x1="60" y1="60" x2="80" y2="75"/>
      <line x1="80" y1="75" x2="100" y2="60"/>
      <line x1="100" y1="60" x2="120" y2="75"/>
      <line x1="200" y1="60" x2="220" y2="75"/>
      <line x1="220" y1="75" x2="240" y2="60"/>
      <line x1="240" y1="60" x2="260" y2="75"/>
    </g>
    <!-- Tradesperson Figure Center -->
    <g transform="translate(125, 75)">
      <!-- Hardhat -->
      <path d="M12 28 C12 12 58 12 58 28 Z" fill="#F59E0B"/>
      <rect x="8" y="27" width="54" height="6" rx="3" fill="#D97706"/>
      <rect x="32" y="16" width="6" height="12" rx="1" fill="#FBBF24"/>
      <!-- Face -->
      <circle cx="35" cy="38" r="13" fill="#FDBA74"/>
      <!-- Overalls / Workwear Torso -->
      <path d="M14 62 L18 122 L52 122 L56 62 Z" fill="#0284C7"/>
      <!-- Tool Belt -->
      <rect x="12" y="98" width="46" height="10" rx="3" fill="#78350F"/>
      <rect x="30" y="96" width="10" height="14" rx="2" fill="#F59E0B"/>
      <!-- Suspender straps -->
      <rect x="22" y="62" width="6" height="38" fill="#0369A1"/>
      <rect x="42" y="62" width="6" height="38" fill="#0369A1"/>
    </g>
    <!-- Spirit Level Tool Left -->
    <g transform="translate(55, 125) rotate(-30)">
      <rect x="0" y="0" width="65" height="14" rx="3" fill="#F59E0B"/>
      <rect x="24" y="3" width="18" height="8" rx="4" fill="#FFFFFF"/>
      <circle cx="33" cy="7" r="3" fill="#84CC16"/>
    </g>
    <!-- Pipe Wrench Right -->
    <g transform="translate(230, 100) rotate(35)">
      <rect x="8" y="24" width="10" height="60" rx="3" fill="#EF4444"/>
      <path d="M4 10 L22 10 L22 24 L14 24 L14 18 L4 18 Z" fill="#64748B"/>
      <rect x="0" y="0" width="26" height="10" rx="2" fill="#475569"/>
      <rect x="18" y="16" width="8" height="6" rx="1" fill="#F59E0B"/>
    </g>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="112" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(245,158,11,0.12))" stroke="var(--sp-ill-tag-border, #FBBF24)" stroke-width="1"/>
      <text x="68" y="29" fill="var(--sp-ill-tag-text, #D97706)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">SKILLED TRADES</text>
    </g>
  </svg>`,
};

export const illustrationCareerGrowth: IllustrationDefinition = {
  name: 'career-growth',
  title: 'Career Growth & Promotion',
  category: 'jobs-labor',
  tags: [
    'job',
    'career',
    'growth',
    'promotion',
    'ladder',
    'success',
    'stepping-stones',
    'achievement',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="202" rx="92" ry="18" fill="var(--sp-ill-halo, rgba(16,185,129,0.12))"/>
    <circle cx="160" cy="120" r="76" fill="var(--sp-ill-halo, rgba(16,185,129,0.06))"/>
    <!-- Career Staircase Progression -->
    <g fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2">
      <!-- Step 1 (Junior) -->
      <rect x="65" y="165" width="45" height="35" rx="3"/>
      <!-- Step 2 (Mid) -->
      <rect x="110" y="135" width="45" height="65" rx="3"/>
      <!-- Step 3 (Senior) -->
      <rect x="155" y="105" width="45" height="95" rx="3"/>
      <!-- Step 4 (Lead/Exec) -->
      <rect x="200" y="75" width="45" height="125" rx="3"/>
    </g>
    <!-- Step Numbers on front -->
    <g fill="var(--sp-ill-muted, #94A3B8)" font-size="10" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">
      <text x="87" y="186">01</text>
      <text x="132" y="156">02</text>
      <text x="177" y="126">03</text>
      <text x="222" y="96">04</text>
    </g>
    <!-- Target Trophy / Flag at Peak -->
    <g transform="translate(210, 36)">
      <!-- Golden Trophy -->
      <path d="M6 6 L18 6 L18 16 C18 20 14 24 12 24 C10 24 6 20 6 16 Z" fill="#F59E0B"/>
      <rect x="10" y="24" width="4" height="6" fill="#D97706"/>
      <rect x="7" y="30" width="10" height="4" rx="1" fill="#B45309"/>
      <!-- Trophy Handles -->
      <path d="M6 9 C3 9 1 12 3 15 C5 17 6 17 6 17" fill="none" stroke="#D97706" stroke-width="1.5"/>
      <path d="M18 9 C21 9 23 12 21 15 C19 17 18 17 18 17" fill="none" stroke="#D97706" stroke-width="1.5"/>
    </g>
    <!-- Bold Upward Growth Trend Arrow -->
    <path d="M75 155 Q 140 120 220 55" fill="none" stroke="#10B981" stroke-width="4" stroke-linecap="round"/>
    <polygon points="228,50 216,52 222,62" fill="#10B981"/>
    <!-- Sparkles of Achievement -->
    <polygon points="255,42 257,47 262,49 257,51 255,56 253,51 248,49 253,47" fill="#F59E0B"/>
    <polygon points="188,72 189,76 193,77 189,79 188,83 186,79 182,77 186,76" fill="#10B981"/>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="88" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(16,185,129,0.12))" stroke="var(--sp-ill-tag-border, #34D399)" stroke-width="1"/>
      <text x="56" y="29" fill="var(--sp-ill-tag-text, #059669)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">PROMOTION</text>
    </g>
  </svg>`,
};

export const illustrationLaborUnion: IllustrationDefinition = {
  name: 'labor-union',
  title: 'Labor Union & Worker Rights',
  category: 'jobs-labor',
  tags: ['job', 'union', 'labor', 'rights', 'solidarity', 'fairness', 'protection', 'justice'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="198" rx="85" ry="18" fill="var(--sp-ill-halo, rgba(239,68,68,0.12))"/>
    <circle cx="160" cy="118" r="76" fill="var(--sp-ill-halo, rgba(239,68,68,0.06))"/>
    <!-- Protective Shield of Worker Rights -->
    <path d="M160 52 C205 52 225 65 225 105 C225 155 160 188 160 188 C160 188 95 155 95 105 C95 65 115 52 160 52 Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2.5"/>
    <!-- Inner Shield Accent -->
    <path d="M160 62 C196 62 212 72 212 105 C212 146 160 174 160 174 C160 174 108 146 108 105 C108 72 124 62 160 62 Z" fill="rgba(239,68,68,0.06)"/>
    <!-- Fair Labor Scales of Justice -->
    <g transform="translate(125, 76)">
      <!-- Central Pillar -->
      <line x1="35" y1="18" x2="35" y2="68" stroke="#475569" stroke-width="3"/>
      <rect x="22" y="66" width="26" height="5" rx="2" fill="#334155"/>
      <circle cx="35" cy="18" r="4" fill="#F59E0B"/>
      <!-- Balance Crossbeam -->
      <line x1="10" y1="24" x2="60" y2="24" stroke="#475569" stroke-width="2.5"/>
      <!-- Left Pan -->
      <line x1="10" y1="24" x2="3" y2="44" stroke="#64748B" stroke-width="1.5"/>
      <line x1="10" y1="24" x2="17" y2="44" stroke="#64748B" stroke-width="1.5"/>
      <path d="M0 44 Q 10 52 20 44 Z" fill="#F59E0B"/>
      <!-- Right Pan -->
      <line x1="60" y1="24" x2="53" y2="44" stroke="#64748B" stroke-width="1.5"/>
      <line x1="60" y1="24" x2="67" y2="44" stroke="#64748B" stroke-width="1.5"/>
      <path d="M50 44 Q 60 52 70 44 Z" fill="#F59E0B"/>
    </g>
    <!-- Laurel Wreath sprigs -->
    <path d="M80 135 C75 105 85 85 92 78" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>
    <circle cx="82" cy="120" r="3" fill="#10B981"/>
    <circle cx="78" cy="102" r="3" fill="#10B981"/>
    <circle cx="84" cy="88" r="3" fill="#10B981"/>
    <path d="M240 135 C245 105 235 85 228 78" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>
    <circle cx="238" cy="120" r="3" fill="#10B981"/>
    <circle cx="242" cy="102" r="3" fill="#10B981"/>
    <circle cx="236" cy="88" r="3" fill="#10B981"/>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="118" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(239,68,68,0.12))" stroke="var(--sp-ill-tag-border, #F87171)" stroke-width="1"/>
      <text x="71" y="29" fill="var(--sp-ill-tag-text, #DC2626)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">WORKERS RIGHTS</text>
    </g>
  </svg>`,
};

export const illustrationOfficeWorkplace: IllustrationDefinition = {
  name: 'office-workplace',
  title: 'Modern Office Workstation',
  category: 'jobs-labor',
  tags: [
    'job',
    'office',
    'workplace',
    'desk',
    'computer',
    'dual-monitor',
    'workstation',
    'ergonomic',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="198" rx="88" ry="18" fill="var(--sp-ill-halo, rgba(2,132,199,0.12))"/>
    <circle cx="160" cy="120" r="76" fill="var(--sp-ill-halo, rgba(2,132,199,0.06))"/>
    <!-- Desk Table Surface -->
    <rect x="70" y="146" width="180" height="10" rx="3" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
    <rect x="85" y="156" width="6" height="42" rx="2" fill="var(--sp-ill-border, #94A3B8)"/>
    <rect x="229" y="156" width="6" height="42" rx="2" fill="var(--sp-ill-border, #94A3B8)"/>
    <!-- Primary Monitor (Center Left) -->
    <rect x="110" y="85" width="70" height="46" rx="3" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
    <rect x="114" y="89" width="62" height="38" rx="2" fill="#0284C7"/>
    <!-- Code/UI Lines on monitor -->
    <line x1="120" y1="96" x2="145" y2="96" stroke="#BAE6FD" stroke-width="2"/>
    <line x1="120" y1="102" x2="162" y2="102" stroke="#FFFFFF" stroke-width="1.5"/>
    <line x1="120" y1="108" x2="155" y2="108" stroke="#FFFFFF" stroke-width="1.5"/>
    <line x1="120" y1="114" x2="140" y2="114" stroke="#BAE6FD" stroke-width="1.5"/>
    <!-- Monitor Stand -->
    <rect x="142" y="131" width="6" height="15" fill="var(--sp-ill-border, #94A3B8)"/>
    <rect x="135" y="144" width="20" height="3" rx="1" fill="var(--sp-ill-border, #94A3B8)"/>
    <!-- Secondary Portrait Monitor (Right) -->
    <rect x="188" y="82" width="32" height="52" rx="3" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
    <rect x="191" y="85" width="26" height="46" rx="2" fill="#1E293B"/>
    <line x1="195" y1="92" x2="213" y2="92" stroke="#10B981" stroke-width="1.5"/>
    <line x1="195" y1="98" x2="211" y2="98" stroke="#38BDF8" stroke-width="1.5"/>
    <line x1="195" y1="104" x2="207" y2="104" stroke="#94A3B8" stroke-width="1.5"/>
    <rect x="201" y="134" width="6" height="12" fill="var(--sp-ill-border, #94A3B8)"/>
    <!-- Desk Lamp Left -->
    <g transform="translate(80, 100)">
      <path d="M12 46 L20 22 L32 15" fill="none" stroke="var(--sp-ill-border, #64748B)" stroke-width="3" stroke-linecap="round"/>
      <polygon points="28,8 42,18 36,24 24,14" fill="#F59E0B"/>
      <!-- Light beam cone -->
      <polygon points="34,20 22,46 54,46" fill="rgba(245,158,11,0.12)"/>
      <circle cx="12" cy="46" r="4" fill="var(--sp-ill-border, #64748B)"/>
    </g>
    <!-- Keyboard & Coffee Mug -->
    <rect x="122" y="147" width="46" height="5" rx="1.5" fill="var(--sp-ill-line, #CBD5E1)"/>
    <circle cx="178" cy="149" r="4" fill="#F59E0B"/>
    <circle cx="178" cy="149" r="2.5" fill="#78350F"/>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="100" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(2,132,199,0.12))" stroke="var(--sp-ill-tag-border, #38BDF8)" stroke-width="1"/>
      <text x="62" y="29" fill="var(--sp-ill-tag-text, #0284C7)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">WORKSTATION</text>
    </g>
  </svg>`,
};

export const JOBS_LABOR_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationJobInterview,
  illustrationTradesWorker,
  illustrationCareerGrowth,
  illustrationLaborUnion,
  illustrationOfficeWorkplace,
] as const;
