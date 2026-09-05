import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationSupportAgent: IllustrationDefinition = {
  name: 'support-agent',
  title: 'Customer Support & Helpdesk Agent',
  category: 'helpdesk',
  tags: ['support', 'agent', 'headset', 'customer care', 'service', 'helpdesk'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <g transform="translate(160, 110)">
    <!-- Avatar body -->
    <path d="M-36 60C-36 40 -20 26 0 26C20 26 36 40 36 60" fill="var(--sp-ill-subtle, #E2E8F0)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
    <!-- Head -->
    <circle cx="0" cy="0" r="26" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
    <!-- Headset -->
    <path d="M-26 0C-26 -16 -14 -28 0 -28C14 -28 26 -16 26 0" stroke="#10B981" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="-30" y="-8" width="8" height="16" rx="4" fill="#10B981"/>
    <rect x="22" y="-8" width="8" height="16" rx="4" fill="#10B981"/>
    <path d="M26 4C26 14 18 20 10 20" stroke="#10B981" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="8" cy="20" r="3" fill="#10B981"/>
  </g>
  <!-- Chat bubbles -->
  <rect x="60" y="55" width="45" height="26" rx="6" fill="#10B981"/>
  <circle cx="73" cy="68" r="2" fill="#FFFFFF"/>
  <circle cx="82" cy="68" r="2" fill="#FFFFFF"/>
  <circle cx="91" cy="68" r="2" fill="#FFFFFF"/>
  <rect x="215" y="65" width="50" height="28" rx="6" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="1.5"/>
  <rect x="225" y="74" width="30" height="4" rx="2" fill="#06B6D4"/>
  <rect x="225" y="82" width="20" height="3" rx="1.5" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">AGENT ONLINE 24/7</text>
  </g>
</svg>`,
};

export const illustrationTicketResolved: IllustrationDefinition = {
  name: 'ticket-resolved',
  title: 'Ticket Resolved & Closed',
  category: 'helpdesk',
  tags: ['ticket', 'resolved', 'closed', 'issue', 'checkmark', 'success', 'helpdesk'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <rect x="95" y="50" width="130" height="135" rx="10" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <rect x="110" y="65" width="45" height="6" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
  <text x="210" y="71" font-family="monospace" font-weight="700" font-size="10" fill="var(--sp-ill-muted, #64748B)" text-anchor="end">#TK-4091</text>
  <line x1="110" y1="82" x2="210" y2="82" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="1.5"/>
  <rect x="110" y="94" width="75" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="110" y="106" width="60" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <circle cx="160" cy="144" r="24" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="2.5"/>
  <path d="M150 144L156 150L170 136" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">TICKET RESOLVED</text>
  </g>
</svg>`,
};

export const illustrationKnowledgeBase: IllustrationDefinition = {
  name: 'knowledge-base',
  title: 'Knowledge Base & Self-Service FAQ',
  category: 'helpdesk',
  tags: ['knowledge base', 'docs', 'faq', 'self service', 'search', 'articles', 'helpdesk'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(6, 182, 212, 0.12))"/>
  <!-- Open Book -->
  <g transform="translate(160, 115)">
    <path d="M0 -30C25 -40 55 -35 75 -25V45C55 35 25 30 0 40C-25 30 -55 35 -75 45V-25C-55 -35 -25 -40 0 -30Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#06B6D4" stroke-width="2"/>
    <line x1="0" y1="-30" x2="0" y2="40" stroke="#06B6D4" stroke-width="2"/>
    <!-- Left page lines -->
    <line x1="-55" y1="-15" x2="-15" y2="-20" stroke="var(--sp-ill-subtle, #CBD5E1)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="-55" y1="-2" x2="-15" y2="-7" stroke="var(--sp-ill-subtle, #CBD5E1)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="-55" y1="11" x2="-20" y2="6" stroke="var(--sp-ill-subtle, #CBD5E1)" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Right page lines -->
    <line x1="15" y1="-20" x2="55" y2="-15" stroke="#06B6D4" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="15" y1="-7" x2="55" y2="-2" stroke="var(--sp-ill-subtle, #CBD5E1)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="15" y1="6" x2="50" y2="11" stroke="var(--sp-ill-subtle, #CBD5E1)" stroke-width="2.5" stroke-linecap="round"/>
  </g>
  <circle cx="215" cy="70" r="8" fill="#F59E0B" fill-opacity="0.2"/>
  <text x="215" y="74" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#F59E0B" text-anchor="middle">?</text>
  <g class="sp-ill-badge">
    <rect x="80" y="195" width="160" height="24" rx="12" fill="var(--sp-ill-card, #F0FDFA)" stroke="#06B6D4"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#06B6D4" text-anchor="middle">KNOWLEDGE BASE</text>
  </g>
</svg>`,
};

export const illustrationSlaEscalation: IllustrationDefinition = {
  name: 'sla-escalation',
  title: 'SLA Escalation & Priority Alerts',
  category: 'helpdesk',
  tags: ['sla', 'escalation', 'priority', 'urgent', 'timer', 'alert', 'helpdesk'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(239, 68, 68, 0.12))"/>
  <g transform="translate(160, 115)">
    <circle cx="0" cy="0" r="48" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="3"/>
    <path d="M0 -48A48 48 0 0 1 42 -24" stroke="#EF4444" stroke-width="5" fill="none" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="0" y2="-28" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="22" y2="-12" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="4" fill="#EF4444"/>
  </g>
  <!-- Bell badge -->
  <g transform="translate(195, 70)">
    <circle cx="16" cy="16" r="16" fill="#EF4444"/>
    <path d="M12 18H20M13 18C13 14 14 11 16 11C18 11 19 14 19 18" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="16" cy="21" r="1.5" fill="#FFFFFF"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #FEF2F2)" stroke="#EF4444"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#EF4444" text-anchor="middle">SLA EXPIRING SOON</text>
  </g>
</svg>`,
};

export const illustrationLiveChat: IllustrationDefinition = {
  name: 'live-chat',
  title: 'Live Chat & Realtime Messaging',
  category: 'helpdesk',
  tags: ['chat', 'messaging', 'live', 'realtime', 'conversation', 'helpdesk'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(99, 102, 241, 0.12))"/>
  <!-- Incoming bubble -->
  <rect x="75" y="60" width="115" height="42" rx="10" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="1.5"/>
  <rect x="90" y="73" width="70" height="5" rx="2.5" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="90" y="84" width="45" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <!-- Outgoing bubble -->
  <rect x="130" y="115" width="115" height="42" rx="10" fill="#6366F1"/>
  <rect x="145" y="128" width="75" height="5" rx="2.5" fill="#FFFFFF"/>
  <rect x="145" y="139" width="50" height="4" rx="2" fill="#FFFFFF" fill-opacity="0.7"/>
  <circle cx="215" cy="141" r="4" fill="#10B981"/>
  <g class="sp-ill-badge">
    <rect x="88" y="195" width="144" height="24" rx="12" fill="var(--sp-ill-card, #EEF2FF)" stroke="#6366F1"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#6366F1" text-anchor="middle">LIVE CHAT ACTIVE</text>
  </g>
</svg>`,
};

export const HELPDESK_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationSupportAgent,
  illustrationTicketResolved,
  illustrationKnowledgeBase,
  illustrationSlaEscalation,
  illustrationLiveChat,
] as const;
