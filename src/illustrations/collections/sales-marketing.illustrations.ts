import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationSalesFunnel: IllustrationDefinition = {
  name: 'sales-funnel',
  title: 'Sales & Conversion Funnel',
  category: 'sales-marketing',
  tags: ['sales', 'marketing', 'funnel', 'conversion', 'pipeline', 'leads', 'revenue'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.12))"/>
  <circle cx="70" cy="70" r="10" fill="#F59E0B" fill-opacity="0.2"/>
  <circle cx="250" cy="150" r="14" fill="#10B981" fill-opacity="0.15"/>
  <!-- Funnel Stages -->
  <polygon points="90,52 230,52 210,84 110,84" fill="#3B82F6"/>
  <polygon points="112,88 208,88 192,120 128,120" fill="#6366F1"/>
  <polygon points="130,124 190,124 176,156 144,156" fill="#EC4899"/>
  <rect x="146" y="160" width="28" height="24" rx="4" fill="#10B981"/>
  <!-- Dollar Symbol at End -->
  <text x="160" y="177" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="16" fill="#FFFFFF" text-anchor="middle">$</text>
  <!-- Floating Conversion Badges -->
  <circle cx="86" cy="104" r="16" fill="var(--sp-ill-card, #FFFFFF)" stroke="#3B82F6" stroke-width="2"/>
  <text x="86" y="108" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="10" fill="#3B82F6" text-anchor="middle">10k</text>
  <circle cx="236" cy="116" r="14" fill="var(--sp-ill-card, #FFFFFF)" stroke="#10B981" stroke-width="2"/>
  <path d="M231 116L235 120L242 113" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="200" width="110" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B" stroke-width="1.5"/>
    <text x="160" y="216" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#B45309" text-anchor="middle" letter-spacing="1">CONVERSION</text>
  </g>
</svg>`,
};

export const illustrationSocialCampaign: IllustrationDefinition = {
  name: 'social-campaign',
  title: 'Social Marketing Campaign',
  category: 'sales-marketing',
  tags: ['marketing', 'campaign', 'social', 'megaphone', 'viral', 'broadcast', 'engagement'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(236, 72, 153, 0.12))"/>
  <!-- Megaphone Body -->
  <path d="M96 112L152 84V148L96 120H84C80 120 76 116 76 112C76 108 80 104 84 104H96V112Z" fill="#F43F5E"/>
  <rect x="148" y="78" width="12" height="76" rx="4" fill="#BE123C"/>
  <!-- Handle -->
  <path d="M106 120L112 154H126L122 120" fill="#475569"/>
  <!-- Sound Waves & Hearts/Likes -->
  <path d="M172 92C182 102 182 124 172 134" stroke="#FB7185" stroke-width="3" stroke-linecap="round"/>
  <path d="M184 80C202 96 202 130 184 146" stroke="#FDA4AF" stroke-width="3" stroke-linecap="round"/>
  <!-- Social Floating Icons -->
  <circle cx="218" cy="80" r="16" fill="var(--sp-ill-card, #FFFFFF)" stroke="#EC4899" stroke-width="2"/>
  <path d="M214 77C211 74 207 77 207 80C207 85 214 89 218 92C222 89 229 85 229 80C229 77 225 74 222 77C220 79 216 79 214 77Z" fill="#EC4899"/>
  <circle cx="236" cy="128" r="14" fill="var(--sp-ill-card, #FFFFFF)" stroke="#3B82F6" stroke-width="2"/>
  <path d="M232 128L236 122L240 128H237V134H235V128H232Z" fill="#3B82F6"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="200" width="100" height="24" rx="12" fill="var(--sp-ill-card, #FCE7F3)" stroke="#EC4899" stroke-width="1.5"/>
    <text x="160" y="216" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#BE185D" text-anchor="middle" letter-spacing="1">CAMPAIGN</text>
  </g>
</svg>`,
};

export const illustrationCustomerTargeting: IllustrationDefinition = {
  name: 'customer-targeting',
  title: 'Customer Audience Targeting',
  category: 'sales-marketing',
  tags: ['targeting', 'audience', 'customer', 'persona', 'demographics', 'bullseye', 'reach'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(59, 130, 246, 0.12))"/>
  <!-- Target Rings -->
  <circle cx="160" cy="112" r="70" fill="none" stroke="#E2E8F0" stroke-width="3"/>
  <circle cx="160" cy="112" r="50" fill="none" stroke="#93C5FD" stroke-width="3"/>
  <circle cx="160" cy="112" r="30" fill="none" stroke="#3B82F6" stroke-width="3"/>
  <circle cx="160" cy="112" r="12" fill="#EF4444"/>
  <!-- Dart / Arrow in Center -->
  <line x1="205" y1="67" x2="166" y2="106" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
  <polygon points="205,67 215,62 210,72" fill="#EF4444"/>
  <polygon points="205,67 210,57 200,62" fill="#3B82F6"/>
  <!-- Audience Pin Badges -->
  <circle cx="112" cy="78" r="14" fill="var(--sp-ill-card, #FFFFFF)" stroke="#3B82F6" stroke-width="2"/>
  <circle cx="112" cy="74" r="4" fill="#3B82F6"/>
  <path d="M106 85C106 81 109 79 112 79C115 79 118 81 118 85" stroke="#3B82F6" stroke-width="1.5"/>
  <circle cx="218" cy="144" r="14" fill="var(--sp-ill-card, #FFFFFF)" stroke="#10B981" stroke-width="2"/>
  <circle cx="218" cy="140" r="4" fill="#10B981"/>
  <path d="M212 151C212 147 215 145 218 145C221 145 224 147 224 151" stroke="#10B981" stroke-width="1.5"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="200" width="100" height="24" rx="12" fill="var(--sp-ill-card, #DBEAFE)" stroke="#3B82F6" stroke-width="1.5"/>
    <text x="160" y="216" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#1D4ED8" text-anchor="middle" letter-spacing="1">TARGETED</text>
  </g>
</svg>`,
};

export const illustrationGrowthMetrics: IllustrationDefinition = {
  name: 'growth-metrics',
  title: 'Growth Metrics & ROI',
  category: 'sales-marketing',
  tags: ['growth', 'metrics', 'roi', 'rocket', 'performance', 'kpi', 'revenue', 'scaling'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <!-- Bar Chart Base -->
  <rect x="74" y="140" width="24" height="40" rx="4" fill="var(--sp-ill-card, #FFFFFF)" stroke="#CBD5E1" stroke-width="2"/>
  <rect x="108" y="116" width="24" height="64" rx="4" fill="#60A5FA"/>
  <rect x="142" y="90" width="24" height="90" rx="4" fill="#3B82F6"/>
  <rect x="176" y="66" width="24" height="114" rx="4" fill="#10B981"/>
  <!-- Rocket Rising on Right -->
  <g transform="translate(200, 36) rotate(35)">
    <path d="M20 0C20 0 32 10 32 26V40H8V26C8 10 20 0 20 0Z" fill="#F43F5E"/>
    <circle cx="20" cy="20" r="5" fill="#FFFFFF"/>
    <polygon points="8,34 0,44 8,40" fill="#BE123C"/>
    <polygon points="32,34 40,44 32,40" fill="#BE123C"/>
    <polygon points="14,40 20,52 26,40" fill="#F59E0B"/>
  </g>
  <!-- Trend Line -->
  <path d="M86 130L120 106L154 80L188 56" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 4"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="115" y="200" width="90" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <text x="160" y="216" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#047857" text-anchor="middle" letter-spacing="1">GROWTH</text>
  </g>
</svg>`,
};

export const illustrationEmailMarketing: IllustrationDefinition = {
  name: 'email-marketing',
  title: 'Email Marketing & Outreach',
  category: 'sales-marketing',
  tags: ['email', 'newsletter', 'outreach', 'leads', 'click-through', 'open-rate', 'automation'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(139, 92, 246, 0.12))"/>
  <!-- Main Envelope Container -->
  <rect x="90" y="80" width="140" height="96" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="#8B5CF6" stroke-width="2"/>
  <!-- Letter Popping Out -->
  <rect x="106" y="44" width="108" height="66" rx="6" fill="#EDE9FE" stroke="#8B5CF6" stroke-width="1.5"/>
  <line x1="118" y1="58" x2="162" y2="58" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="118" y1="68" x2="194" y2="68" stroke="#A78BFA" stroke-width="2" stroke-linecap="round"/>
  <line x1="118" y1="78" x2="180" y2="78" stroke="#A78BFA" stroke-width="2" stroke-linecap="round"/>
  <!-- Envelope Flaps -->
  <polygon points="90,80 160,132 230,80" fill="none" stroke="#8B5CF6" stroke-width="2"/>
  <line x1="90" y1="176" x2="136" y2="128" stroke="#DDD6FE" stroke-width="1.5"/>
  <line x1="230" y1="176" x2="184" y2="128" stroke="#DDD6FE" stroke-width="1.5"/>
  <!-- Click Rate Stamp Badge -->
  <circle cx="218" cy="80" r="16" fill="#10B981"/>
  <text x="218" y="84" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="10" fill="#FFFFFF" text-anchor="middle">98%</text>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="200" width="100" height="24" rx="12" fill="var(--sp-ill-card, #F5F3FF)" stroke="#8B5CF6" stroke-width="1.5"/>
    <text x="160" y="216" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#6D28D9" text-anchor="middle" letter-spacing="1">ENGAGED</text>
  </g>
</svg>`,
};

export const SALES_MARKETING_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationSalesFunnel,
  illustrationSocialCampaign,
  illustrationCustomerTargeting,
  illustrationGrowthMetrics,
  illustrationEmailMarketing,
] as const;
