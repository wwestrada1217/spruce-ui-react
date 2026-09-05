import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationNotFound: IllustrationDefinition = {
  name: 'not-found',
  title: 'Page Not Found (404)',
  category: 'status',
  tags: ['404', 'not found', 'missing', 'lost', 'broken link', 'error'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <defs>
    <filter id="nf-shadow" x="70" y="60" width="180" height="130" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
  </defs>
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.12))"/>
  <circle cx="240" cy="64" r="16" fill="#10B981" fill-opacity="0.15"/>
  <circle cx="80" cy="170" r="12" fill="#06B6D4" fill-opacity="0.15"/>
  <path d="M72 80L76 88L68 88Z" fill="#F59E0B" fill-opacity="0.6"/>
  <path d="M252 168L256 176L248 176Z" fill="#10B981" fill-opacity="0.6"/>
  <g filter="url(#nf-shadow)">
    <rect x="85" y="70" width="150" height="96" rx="12" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="2"/>
    <path d="M85 96H235" stroke="var(--sp-ill-border, #F1F5F9)" stroke-width="2"/>
    <circle cx="101" cy="83" r="3.5" fill="#EF4444" fill-opacity="0.9"/>
    <circle cx="113" cy="83" r="3.5" fill="#F59E0B" fill-opacity="0.9"/>
    <circle cx="125" cy="83" r="3.5" fill="#10B981" fill-opacity="0.9"/>
    <rect x="140" y="79" width="80" height="8" rx="4" fill="var(--sp-ill-subtle, #F1F5F9)"/>
    <text x="160" y="142" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="34" fill="var(--sp-ill-text, #0F172A)" text-anchor="middle" letter-spacing="-1">404</text>
  </g>
  <circle cx="204" cy="148" r="32" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="3"/>
  <circle cx="204" cy="148" r="24" fill="#10B981" fill-opacity="0.15"/>
  <path d="M196 148H212M204 140V156" stroke="#10B981" stroke-width="3" stroke-linecap="round"/>
  <line x1="226" y1="170" x2="252" y2="196" stroke="var(--sp-ill-text, #0F172A)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="200" cy="144" r="2" fill="#10B981"/>
  <g class="sp-ill-badge">
    <rect x="100" y="195" width="120" height="24" rx="12" fill="var(--sp-ill-card, #FEF2F2)" stroke="#EF4444" stroke-width="1.5"/>
    <text x="160" y="211" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#EF4444" text-anchor="middle" letter-spacing="1">ERROR 404</text>
  </g>
</svg>`,
};

export const illustrationForbidden: IllustrationDefinition = {
  name: 'forbidden',
  title: 'Forbidden (403)',
  category: 'status',
  tags: ['403', 'forbidden', 'restricted', 'lock', 'security', 'shield', 'blocked'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <defs>
    <linearGradient id="fb-shield" x1="160" y1="50" x2="160" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#EF4444"/>
      <stop offset="1" stop-color="#B91C1C"/>
    </linearGradient>
    <filter id="fb-drop" x="100" y="44" width="120" height="142" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#EF4444" flood-opacity="0.3"/>
    </filter>
  </defs>
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(239, 68, 68, 0.1))"/>
  <circle cx="70" cy="90" r="6" fill="#F87171" fill-opacity="0.4"/>
  <circle cx="250" cy="150" r="10" fill="#EF4444" fill-opacity="0.15"/>
  <path d="M236 74L242 84L230 84Z" fill="#F59E0B" fill-opacity="0.5"/>
  <g filter="url(#fb-drop)">
    <path d="M160 52L210 74V122C210 152 186 174 160 184C134 174 110 152 110 122V74L160 52Z" fill="url(#fb-shield)"/>
    <path d="M160 56L206 76V122C206 149 184 170 160 179V56Z" fill="#FFFFFF" fill-opacity="0.15"/>
    <rect x="142" y="104" width="36" height="28" rx="6" fill="#FFFFFF"/>
    <path d="M148 104V96C148 89.4 153.4 84 160 84C166.6 84 172 89.4 172 96V104" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" fill="none"/>
    <circle cx="160" cy="116" r="3" fill="#B91C1C"/>
    <path d="M160 119V124" stroke="#B91C1C" stroke-width="2" stroke-linecap="round"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="100" y="195" width="120" height="24" rx="12" fill="var(--sp-ill-card, #FEF2F2)" stroke="#EF4444" stroke-width="1.5"/>
    <text x="160" y="211" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#EF4444" text-anchor="middle" letter-spacing="1">ERROR 403</text>
  </g>
</svg>`,
};

export const illustrationUnauthorized: IllustrationDefinition = {
  name: 'unauthorized',
  title: 'Unauthorized (401)',
  category: 'status',
  tags: ['401', 'unauthorized', 'login', 'authentication', 'key', 'badge', 'id'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="90" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.12))"/>
  <rect x="110" y="55" width="100" height="135" rx="10" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <rect x="145" y="63" width="30" height="5" rx="2.5" fill="var(--sp-ill-muted, #94A3B8)"/>
  <circle cx="160" cy="100" r="22" fill="var(--sp-ill-subtle, #F1F5F9)" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="2"/>
  <circle cx="160" cy="94" r="8" fill="var(--sp-ill-muted, #94A3B8)"/>
  <path d="M145 114C145 107 151.7 104 160 104C168.3 104 175 107 175 114" stroke="var(--sp-ill-muted, #94A3B8)" stroke-width="2" stroke-linecap="round"/>
  <rect x="125" y="132" width="70" height="6" rx="3" fill="var(--sp-ill-border, #E2E8F0)"/>
  <rect x="135" y="144" width="50" height="5" rx="2.5" fill="var(--sp-ill-subtle, #F1F5F9)"/>
  <g transform="translate(180, 130)">
    <circle cx="24" cy="24" r="22" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B" stroke-width="2"/>
    <path d="M24 14V26M24 32V34" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="108" y="195" width="104" height="24" rx="12" fill="var(--sp-ill-card, #FFFBEB)" stroke="#F59E0B"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#F59E0B" text-anchor="middle">401 AUTH</text>
  </g>
</svg>`,
};

export const illustrationServerError: IllustrationDefinition = {
  name: 'server-error',
  title: 'Internal Server Error (500)',
  category: 'status',
  tags: ['500', 'server', 'database', 'down', 'crash', 'rack', 'bug', 'error'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(239, 68, 68, 0.1))"/>
  <rect x="100" y="60" width="120" height="34" rx="6" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <circle cx="116" cy="77" r="4" fill="#10B981"/>
  <circle cx="128" cy="77" r="4" fill="#10B981"/>
  <line x1="145" y1="77" x2="205" y2="77" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="4" stroke-linecap="round"/>
  <rect x="100" y="102" width="120" height="34" rx="6" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <circle cx="116" cy="119" r="4" fill="#10B981"/>
  <circle cx="128" cy="119" r="4" fill="#EF4444"/>
  <line x1="145" y1="119" x2="205" y2="119" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="4" stroke-linecap="round"/>
  <rect x="100" y="144" width="120" height="34" rx="6" fill="var(--sp-ill-card, #FFFFFF)" stroke="#EF4444" stroke-width="2"/>
  <circle cx="116" cy="161" r="4" fill="#EF4444"/>
  <circle cx="128" cy="161" r="4" fill="#EF4444"/>
  <line x1="145" y1="161" x2="185" y2="161" stroke="#FCA5A5" stroke-width="4" stroke-linecap="round"/>
  <path d="M196 155L208 167M208 155L196 167" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M216 48L204 74H218L206 100" stroke="#F59E0B" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
  <g class="sp-ill-badge">
    <rect x="100" y="195" width="120" height="24" rx="12" fill="var(--sp-ill-card, #FEF2F2)" stroke="#EF4444"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#EF4444" text-anchor="middle">500 ERROR</text>
  </g>
</svg>`,
};

export const illustrationMaintenance: IllustrationDefinition = {
  name: 'maintenance',
  title: 'Under Maintenance (503)',
  category: 'status',
  tags: ['maintenance', '503', 'service unavailable', 'repair', 'tools', 'cone', 'upgrade'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="90" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.1))"/>
  <path d="M80 186H240" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="3" stroke-linecap="round"/>
  <path d="M140 186L155 96H165L180 186H140Z" fill="#F59E0B" stroke="#D97706" stroke-width="2"/>
  <path d="M146 150H174L177 166H143L146 150Z" fill="#FFFFFF"/>
  <path d="M152 114H168L171 130H149L152 114Z" fill="#FFFFFF"/>
  <rect x="130" y="184" width="60" height="6" rx="3" fill="#D97706"/>
  <g transform="translate(190, 80) rotate(20)">
    <rect x="0" y="14" width="36" height="8" rx="4" fill="#64748B"/>
    <path d="M28 8C33 10 36 15 36 18C36 21 33 26 28 28L32 23L32 13L28 8Z" fill="#475569"/>
    <circle cx="4" cy="18" r="4" fill="#334155"/>
  </g>
  <g transform="translate(74, 90) rotate(-30)">
    <circle cx="16" cy="16" r="14" fill="var(--sp-ill-subtle, #E2E8F0)" stroke="var(--sp-ill-muted, #94A3B8)" stroke-width="2"/>
    <path d="M16 6V26M6 16H26" stroke="var(--sp-ill-muted, #94A3B8)" stroke-width="2"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="86" y="44" width="148" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B" stroke-width="1.5"/>
    <text x="160" y="60" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#F59E0B" text-anchor="middle" letter-spacing="1">MAINTENANCE</text>
  </g>
</svg>`,
};

export const illustrationEmptyState: IllustrationDefinition = {
  name: 'empty-state',
  title: 'Empty State (No Data)',
  category: 'status',
  tags: ['empty', 'no data', 'zero', 'box', 'blank', 'clean', 'start'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.12))"/>
  <path d="M96 172L160 200L224 172L160 144L96 172Z" fill="var(--sp-ill-subtle, #E2E8F0)"/>
  <path d="M96 128L160 156L224 128L160 100L96 128Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <path d="M96 128V166L160 194V156L96 128Z" fill="var(--sp-ill-subtle, #F1F5F9)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <path d="M224 128V166L160 194V156L224 128Z" fill="var(--sp-ill-subtle, #E2E8F0)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <path d="M128 88L160 74L192 88L160 102L128 88Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#10B981" stroke-width="2" stroke-dasharray="3 3"/>
  <circle cx="218" cy="78" r="4" fill="#10B981"/>
  <circle cx="94" cy="98" r="3" fill="#06B6D4"/>
  <circle cx="236" cy="142" r="3" fill="#F59E0B"/>
  <path d="M154 62L160 50L166 62Z" fill="#10B981" fill-opacity="0.8"/>
  <g class="sp-ill-badge">
    <rect x="88" y="206" width="144" height="24" rx="12" fill="var(--sp-ill-card, #F8FAFC)" stroke="var(--sp-ill-border, #CBD5E1)"/>
    <text x="160" y="222" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="var(--sp-ill-muted, #64748B)" text-anchor="middle">NO RECORDS FOUND</text>
  </g>
</svg>`,
};

export const illustrationSessionExpired: IllustrationDefinition = {
  name: 'session-expired',
  title: 'Session Expired',
  category: 'status',
  tags: ['session', 'expired', 'timeout', 'clock', 'lock', 'hourglass', 'login'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.1))"/>
  <circle cx="160" cy="116" r="56" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="4"/>
  <circle cx="160" cy="116" r="48" fill="#F59E0B" fill-opacity="0.1"/>
  <path d="M160 84V116L182 128" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
  <circle cx="160" cy="116" r="4" fill="#D97706"/>
  <g transform="translate(190, 134)">
    <rect x="0" y="14" width="34" height="26" rx="6" fill="#EF4444" stroke="#DC2626" stroke-width="2"/>
    <path d="M7 14V9C7 3.5 11.5 0 17 0C22.5 0 27 3.5 27 9V14" stroke="#EF4444" stroke-width="3" fill="none"/>
    <circle cx="17" cy="26" r="2.5" fill="#FFFFFF"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="80" y="195" width="160" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#F59E0B" text-anchor="middle">SESSION TIMEOUT</text>
  </g>
</svg>`,
};

export const illustrationOffline: IllustrationDefinition = {
  name: 'offline',
  title: 'Offline / Disconnected',
  category: 'status',
  tags: ['offline', 'disconnected', 'network', 'wifi', 'internet', 'no connection'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="90" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.12))"/>
  <path d="M120 134C111 134 104 127 104 118C104 109.8 109.8 103 117.8 102.2C120.2 88.5 132.2 78 146.8 78C160.2 78 171.4 87.2 174.6 99.8C176.4 99.2 178.4 98.8 180.4 98.8C191.2 98.8 200 107.6 200 118.4C200 129.2 191.2 134 180.4 134H120Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-muted, #94A3B8)" stroke-width="3"/>
  <path d="M110 166C124 152 142 144 160 144C178 144 196 152 210 166" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="3" stroke-linecap="round"/>
  <path d="M130 178C139 169 149 164 160 164C171 164 181 169 190 178" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="3" stroke-linecap="round"/>
  <circle cx="160" cy="190" r="3.5" fill="#EF4444"/>
  <line x1="90" y1="65" x2="230" y2="195" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
  <g class="sp-ill-badge">
    <rect x="90" y="204" width="140" height="24" rx="12" fill="var(--sp-ill-card, #FEF2F2)" stroke="#EF4444"/>
    <text x="160" y="220" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#EF4444" text-anchor="middle">DISCONNECTED</text>
  </g>
</svg>`,
};

export const illustrationPageCrashed: IllustrationDefinition = {
  name: 'page-crashed',
  title: 'Page Crashed',
  category: 'status',
  tags: ['crash', 'broke', 'error', 'bug', 'sad', 'tab', 'browser', 'client'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(239, 68, 68, 0.1))"/>
  <rect x="85" y="60" width="150" height="110" rx="10" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <path d="M85 86H235" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="2"/>
  <circle cx="101" cy="73" r="3.5" fill="#EF4444"/>
  <circle cx="113" cy="73" r="3.5" fill="#F59E0B"/>
  <circle cx="125" cy="73" r="3.5" fill="#10B981"/>
  <path d="M130 114L142 126M142 114L130 126" stroke="var(--sp-ill-muted, #64748B)" stroke-width="3" stroke-linecap="round"/>
  <path d="M178 114L190 126M190 114L178 126" stroke="var(--sp-ill-muted, #64748B)" stroke-width="3" stroke-linecap="round"/>
  <path d="M145 148C152 142 168 142 175 148" stroke="var(--sp-ill-muted, #64748B)" stroke-width="3" stroke-linecap="round"/>
  <path d="M156 60L164 78L158 92L168 106" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
  <g class="sp-ill-badge">
    <rect x="76" y="195" width="168" height="24" rx="12" fill="var(--sp-ill-card, #FEF2F2)" stroke="#EF4444"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#EF4444" text-anchor="middle">AW, SNAP! CRASHED</text>
  </g>
</svg>`,
};

export const illustrationAccessDenied: IllustrationDefinition = {
  name: 'access-denied',
  title: 'Access Denied',
  category: 'status',
  tags: ['access', 'denied', 'no entry', 'stop', 'gate', 'restricted', 'barrier'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(239, 68, 68, 0.1))"/>
  <rect x="90" y="125" width="140" height="14" rx="3" fill="#EF4444" stroke="#B91C1C" stroke-width="1.5"/>
  <path d="M105 125L97 139M125 125L117 139M145 125L137 139M165 125L157 139M185 125L177 139M205 125L197 139M225 125L217 139" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="160" cy="85" r="32" fill="#EF4444" stroke="#DC2626" stroke-width="3"/>
  <circle cx="160" cy="85" r="28" fill="#FFFFFF"/>
  <circle cx="160" cy="85" r="22" fill="#EF4444"/>
  <rect x="146" y="82" width="28" height="6" rx="2" fill="#FFFFFF"/>
  <path d="M100 139V180M220 139V180" stroke="var(--sp-ill-muted, #64748B)" stroke-width="4" stroke-linecap="round"/>
  <g class="sp-ill-badge">
    <rect x="76" y="195" width="168" height="24" rx="12" fill="var(--sp-ill-card, #FEF2F2)" stroke="#EF4444"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#EF4444" text-anchor="middle">ACCESS RESTRICTED</text>
  </g>
</svg>`,
};

export const STATUS_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationNotFound,
  illustrationForbidden,
  illustrationUnauthorized,
  illustrationServerError,
  illustrationMaintenance,
  illustrationEmptyState,
  illustrationSessionExpired,
  illustrationOffline,
  illustrationPageCrashed,
  illustrationAccessDenied,
] as const;
