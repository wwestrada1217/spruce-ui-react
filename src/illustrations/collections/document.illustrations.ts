import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationDocumentEditing: IllustrationDefinition = {
  name: 'document-editing',
  title: 'Document & Rich-Text Editor',
  category: 'document',
  tags: ['document', 'editor', 'notes', 'markdown', 'writing', 'word processor'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(99, 102, 241, 0.12))"/>
  <!-- Paper sheet with folded top-right corner -->
  <path d="M100 48H190L220 78V180H100V48Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <path d="M190 48V78H220" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2" fill="var(--sp-ill-subtle, #F1F5F9)"/>
  <!-- Header line -->
  <rect x="116" y="68" width="55" height="8" rx="2" fill="#6366F1"/>
  <!-- Paragraph lines -->
  <rect x="116" y="90" width="88" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="116" y="102" width="76" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="116" y="114" width="82" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="116" y="126" width="60" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <!-- Pen icon editing -->
  <g transform="translate(195, 135) rotate(-35)">
    <rect x="0" y="0" width="10" height="36" rx="2" fill="#10B981"/>
    <polygon points="0,36 10,36 5,46" fill="#F59E0B"/>
    <circle cx="5" cy="45" r="1.5" fill="#0F172A"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #EEF2FF)" stroke="#6366F1"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#6366F1" text-anchor="middle">DOCUMENT SAVED</text>
  </g>
</svg>`,
};

export const illustrationCollaborativeWriting: IllustrationDefinition = {
  name: 'collaborative-writing',
  title: 'Realtime Multiplayer Collaboration',
  category: 'document',
  tags: ['collaborative', 'realtime', 'multiplayer', 'cursors', 'comments', 'document'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <rect x="85" y="50" width="150" height="135" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <rect x="105" y="70" width="60" height="6" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="105" y="85" width="110" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="105" y="97" width="90" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <!-- Cursor 1 (Alex - Green) -->
  <g transform="translate(145, 95)">
    <polygon points="0,0 4,14 7,10 12,12 13,10 8,8 12,6" fill="#10B981"/>
    <rect x="8" y="12" width="28" height="12" rx="3" fill="#10B981"/>
    <text x="22" y="21" font-family="system-ui, sans-serif" font-weight="700" font-size="7" fill="#FFFFFF" text-anchor="middle">ALEX</text>
  </g>
  <!-- Cursor 2 (Sam - Cyan) -->
  <g transform="translate(115, 125)">
    <polygon points="0,0 4,14 7,10 12,12 13,10 8,8 12,6" fill="#06B6D4"/>
    <rect x="8" y="12" width="26" height="12" rx="3" fill="#06B6D4"/>
    <text x="21" y="21" font-family="system-ui, sans-serif" font-weight="700" font-size="7" fill="#FFFFFF" text-anchor="middle">SAM</text>
  </g>
  <g class="sp-ill-badge">
    <rect x="80" y="195" width="160" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">MULTIPLAYER ACTIVE</text>
  </g>
</svg>`,
};

export const illustrationVersionHistory: IllustrationDefinition = {
  name: 'version-history',
  title: 'Document Revisions & Version History',
  category: 'document',
  tags: ['history', 'revisions', 'diff', 'versions', 'undo', 'timeline', 'document'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(6, 182, 212, 0.12))"/>
  <rect x="75" y="52" width="170" height="130" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <!-- Version timeline spine -->
  <line x1="110" y1="70" x2="110" y2="160" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <!-- Node 1 (current) -->
  <circle cx="110" cy="78" r="8" fill="#10B981"/>
  <circle cx="110" cy="78" r="3" fill="#FFFFFF"/>
  <rect x="126" y="74" width="70" height="5" rx="2" fill="var(--sp-ill-text, #0F172A)"/>
  <text x="230" y="79" font-family="system-ui, sans-serif" font-weight="700" font-size="8" fill="#10B981" text-anchor="end">Current</text>
  <!-- Node 2 (yesterday) -->
  <circle cx="110" cy="115" r="7" fill="var(--sp-ill-card, #FFFFFF)" stroke="#06B6D4" stroke-width="2"/>
  <rect x="126" y="111" width="60" height="5" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <text x="230" y="116" font-family="system-ui, sans-serif" font-weight="600" font-size="8" fill="var(--sp-ill-muted, #64748B)" text-anchor="end">v2.1</text>
  <!-- Node 3 (initial) -->
  <circle cx="110" cy="150" r="7" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <rect x="126" y="146" width="50" height="5" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <text x="230" y="151" font-family="system-ui, sans-serif" font-weight="600" font-size="8" fill="var(--sp-ill-muted, #64748B)" text-anchor="end">v1.0</text>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #F0FDFA)" stroke="#06B6D4"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#06B6D4" text-anchor="middle">SNAPSHOT RESTORED</text>
  </g>
</svg>`,
};

export const illustrationPdfExport: IllustrationDefinition = {
  name: 'pdf-export',
  title: 'Export PDF & Print Formats',
  category: 'document',
  tags: ['pdf', 'export', 'print', 'download', 'format', 'document'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(239, 68, 68, 0.12))"/>
  <!-- PDF file icon -->
  <rect x="105" y="48" width="110" height="135" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <!-- PDF Badge badge on doc -->
  <rect x="120" y="65" width="40" height="20" rx="4" fill="#EF4444"/>
  <text x="140" y="79" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#FFFFFF" text-anchor="middle">PDF</text>
  <!-- Content lines -->
  <rect x="120" y="100" width="80" height="5" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="120" y="114" width="65" height="5" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <!-- Download arrow -->
  <circle cx="160" cy="148" r="16" fill="var(--sp-ill-card, #FEF2F2)" stroke="#EF4444" stroke-width="2"/>
  <path d="M160 140V154M155 149L160 154L165 149" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <g class="sp-ill-badge">
    <rect x="88" y="195" width="144" height="24" rx="12" fill="var(--sp-ill-card, #FEF2F2)" stroke="#EF4444"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#EF4444" text-anchor="middle">PDF READY TO PRINT</text>
  </g>
</svg>`,
};

export const illustrationTemplateLibrary: IllustrationDefinition = {
  name: 'template-library',
  title: 'Document Template Library',
  category: 'document',
  tags: ['templates', 'gallery', 'preset', 'contract', 'brief', 'document'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.12))"/>
  <!-- Template 1 (Back left) -->
  <rect x="75" y="65" width="60" height="85" rx="5" fill="var(--sp-ill-subtle, #F1F5F9)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="1.5"/>
  <rect x="85" y="78" width="25" height="4" rx="1" fill="#F59E0B"/>
  <!-- Template 2 (Back right) -->
  <rect x="185" y="65" width="60" height="85" rx="5" fill="var(--sp-ill-subtle, #F1F5F9)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="1.5"/>
  <rect x="195" y="78" width="25" height="4" rx="1" fill="#06B6D4"/>
  <!-- Template 3 (Center Front) -->
  <rect x="120" y="52" width="80" height="110" rx="6" fill="var(--sp-ill-card, #FFFFFF)" stroke="#10B981" stroke-width="2"/>
  <rect x="132" y="68" width="35" height="6" rx="2" fill="#10B981"/>
  <rect x="132" y="84" width="56" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="132" y="96" width="45" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="132" y="108" width="50" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <g class="sp-ill-badge">
    <rect x="80" y="195" width="160" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#F59E0B" text-anchor="middle">TEMPLATES EXPLORER</text>
  </g>
</svg>`,
};

export const DOCUMENT_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationDocumentEditing,
  illustrationCollaborativeWriting,
  illustrationVersionHistory,
  illustrationPdfExport,
  illustrationTemplateLibrary,
] as const;

/**
 * @deprecated Use DOCUMENT_ILLUSTRATIONS instead.
 */
export const PAPER_ILLUSTRATIONS = DOCUMENT_ILLUSTRATIONS;
