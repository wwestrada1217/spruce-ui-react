import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationKanbanBoard: IllustrationDefinition = {
  name: 'kanban-board',
  title: 'Kanban Sprint Board',
  category: 'project-management',
  tags: ['kanban', 'scrum', 'agile', 'sprint', 'board', 'cards', 'project management'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(99, 102, 241, 0.12))"/>
  <rect x="65" y="48" width="190" height="135" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <!-- Column 1: Backlog / To Do -->
  <rect x="75" y="60" width="50" height="110" rx="4" fill="var(--sp-ill-subtle, #F1F5F9)"/>
  <rect x="80" y="66" width="26" height="4" rx="2" fill="var(--sp-ill-muted, #64748B)"/>
  <rect x="80" y="76" width="40" height="24" rx="3" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="1"/>
  <rect x="84" y="81" width="22" height="3" rx="1.5" fill="#6366F1"/>
  <rect x="80" y="106" width="40" height="24" rx="3" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="1"/>
  <rect x="84" y="111" width="18" height="3" rx="1.5" fill="#F59E0B"/>
  <!-- Column 2: In Progress -->
  <rect x="135" y="60" width="50" height="110" rx="4" fill="var(--sp-ill-subtle, #F1F5F9)"/>
  <rect x="140" y="66" width="26" height="4" rx="2" fill="#06B6D4"/>
  <rect x="140" y="76" width="40" height="30" rx="3" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="1"/>
  <rect x="144" y="81" width="28" height="3" rx="1.5" fill="#06B6D4"/>
  <rect x="144" y="88" width="18" height="2" rx="1" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <circle cx="170" cy="98" r="4" fill="#06B6D4"/>
  <!-- Column 3: Done -->
  <rect x="195" y="60" width="50" height="110" rx="4" fill="var(--sp-ill-subtle, #F1F5F9)"/>
  <rect x="200" y="66" width="26" height="4" rx="2" fill="#10B981"/>
  <rect x="200" y="76" width="40" height="24" rx="3" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1"/>
  <path d="M210 88L214 92L222 84" stroke="#10B981" stroke-width="1.8" stroke-linecap="round"/>
  <rect x="200" y="106" width="40" height="24" rx="3" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1"/>
  <path d="M210 118L214 122L222 114" stroke="#10B981" stroke-width="1.8" stroke-linecap="round"/>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #EEF2FF)" stroke="#6366F1"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#6366F1" text-anchor="middle">SPRINT IN MOTION</text>
  </g>
</svg>`,
};

export const illustrationGanttRoadmap: IllustrationDefinition = {
  name: 'gantt-roadmap',
  title: 'Project Roadmap & Gantt Timeline',
  category: 'project-management',
  tags: ['gantt', 'roadmap', 'timeline', 'milestones', 'project management'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(6, 182, 212, 0.12))"/>
  <rect x="65" y="48" width="190" height="135" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <!-- Header -->
  <line x1="65" y1="78" x2="255" y2="78" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="1.5"/>
  <text x="100" y="68" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="var(--sp-ill-muted, #64748B)">Q1</text>
  <text x="145" y="68" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="var(--sp-ill-muted, #64748B)">Q2</text>
  <text x="190" y="68" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="var(--sp-ill-muted, #64748B)">Q3</text>
  <text x="235" y="68" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="var(--sp-ill-muted, #64748B)">Q4</text>
  <!-- Grid columns -->
  <line x1="120" y1="78" x2="120" y2="183" stroke="var(--sp-ill-border, #F1F5F9)" stroke-width="1.5" stroke-dasharray="2 2"/>
  <line x1="165" y1="78" x2="165" y2="183" stroke="var(--sp-ill-border, #F1F5F9)" stroke-width="1.5" stroke-dasharray="2 2"/>
  <line x1="210" y1="78" x2="210" y2="183" stroke="var(--sp-ill-border, #F1F5F9)" stroke-width="1.5" stroke-dasharray="2 2"/>
  <!-- Bars -->
  <rect x="75" y="90" width="70" height="14" rx="7" fill="#6366F1"/>
  <rect x="125" y="112" width="65" height="14" rx="7" fill="#06B6D4"/>
  <rect x="175" y="134" width="65" height="14" rx="7" fill="#10B981"/>
  <rect x="150" y="156" width="85" height="14" rx="7" fill="#F59E0B"/>
  <g class="sp-ill-badge">
    <rect x="80" y="195" width="160" height="24" rx="12" fill="var(--sp-ill-card, #F0FDFA)" stroke="#06B6D4"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#06B6D4" text-anchor="middle">ROADMAP ON TRACK</text>
  </g>
</svg>`,
};

export const illustrationMilestoneLaunch: IllustrationDefinition = {
  name: 'milestone-launch',
  title: 'Milestone & Product Launch',
  category: 'project-management',
  tags: ['milestone', 'launch', 'rocket', 'release', 'delivery', 'project management'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <!-- Rocket Body -->
  <g transform="translate(160, 110) rotate(-45)">
    <path d="M0 -45C22 -20 25 15 25 35H-25C-25 15 -22 -20 0 -45Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#10B981" stroke-width="2.5"/>
    <circle cx="0" cy="-5" r="8" fill="#06B6D4" stroke="#0891B2" stroke-width="2"/>
    <circle cx="0" cy="-5" r="4" fill="#FFFFFF"/>
    <!-- Fins -->
    <path d="M-25 20L-40 38L-25 35Z" fill="#F59E0B"/>
    <path d="M25 20L40 38L25 35Z" fill="#F59E0B"/>
    <!-- Thruster flame -->
    <path d="M-12 36C-12 50 0 65 0 65C0 65 12 50 12 36Z" fill="#EF4444"/>
    <path d="M-6 36C-6 45 0 54 0 54C0 45 6 36 6 36Z" fill="#FBBF24"/>
  </g>
  <circle cx="85" cy="80" r="3" fill="#F59E0B"/>
  <circle cx="235" cy="65" r="4" fill="#10B981"/>
  <circle cx="245" cy="140" r="3" fill="#06B6D4"/>
  <g class="sp-ill-badge">
    <rect x="76" y="195" width="168" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">RELEASE DELIVERED</text>
  </g>
</svg>`,
};

export const illustrationTaskBacklog: IllustrationDefinition = {
  name: 'task-backlog',
  title: 'Task Assignment & Backlog Grooming',
  category: 'project-management',
  tags: ['tasks', 'backlog', 'checklist', 'assignment', 'grooming', 'project management'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.12))"/>
  <rect x="85" y="48" width="150" height="135" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <circle cx="106" cy="72" r="8" fill="#10B981"/>
  <path d="M103 72L105.5 74.5L110 69.5" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
  <rect x="122" y="69" width="95" height="6" rx="3" fill="var(--sp-ill-text, #0F172A)"/>
  <circle cx="106" cy="100" r="8" fill="#10B981"/>
  <path d="M103 100L105.5 102.5L110 97.5" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
  <rect x="122" y="97" width="80" height="6" rx="3" fill="var(--sp-ill-text, #0F172A)"/>
  <circle cx="106" cy="128" r="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="#06B6D4" stroke-width="2"/>
  <rect x="122" y="125" width="88" height="6" rx="3" fill="#06B6D4"/>
  <circle cx="106" cy="156" r="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <rect x="122" y="153" width="70" height="6" rx="3" fill="var(--sp-ill-muted, #94A3B8)"/>
  <g class="sp-ill-badge">
    <rect x="80" y="195" width="160" height="24" rx="12" fill="var(--sp-ill-card, #EEF2FF)" stroke="#6366F1"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#6366F1" text-anchor="middle">BACKLOG PRIORITIZED</text>
  </g>
</svg>`,
};

export const illustrationTeamVelocity: IllustrationDefinition = {
  name: 'team-velocity',
  title: 'Team Velocity & Burndown',
  category: 'project-management',
  tags: ['velocity', 'burndown', 'chart', 'scrum', 'performance', 'project management'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <rect x="75" y="52" width="170" height="130" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <line x1="95" y1="68" x2="95" y2="162" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="1.5"/>
  <line x1="95" y1="162" x2="230" y2="162" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="1.5"/>
  <!-- Ideal burndown line -->
  <line x1="100" y1="78" x2="225" y2="158" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2" stroke-dasharray="4 3"/>
  <!-- Actual burndown curve -->
  <path d="M100 78L130 92L160 118L190 125L225 160" stroke="#10B981" stroke-width="3" stroke-linecap="round"/>
  <circle cx="100" cy="78" r="4" fill="#10B981"/>
  <circle cx="130" cy="92" r="4" fill="#10B981"/>
  <circle cx="160" cy="118" r="4" fill="#10B981"/>
  <circle cx="190" cy="125" r="4" fill="#10B981"/>
  <circle cx="225" cy="160" r="5" fill="#10B981"/>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">VELOCITY PEAKING</text>
  </g>
</svg>`,
};

export const PROJECT_MANAGEMENT_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationKanbanBoard,
  illustrationGanttRoadmap,
  illustrationMilestoneLaunch,
  illustrationTaskBacklog,
  illustrationTeamVelocity,
] as const;

/**
 * @deprecated Use PROJECT_MANAGEMENT_ILLUSTRATIONS instead.
 */
export const FOOTMARK_ILLUSTRATIONS = PROJECT_MANAGEMENT_ILLUSTRATIONS;
