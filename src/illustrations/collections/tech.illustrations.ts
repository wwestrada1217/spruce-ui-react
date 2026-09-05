import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationCloudInfrastructure: IllustrationDefinition = {
  name: 'cloud-infrastructure',
  title: 'Cloud Infrastructure',
  category: 'technology',
  tags: ['cloud', 'infrastructure', 'server', 'aws', 'azure', 'hosting', 'cluster'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(59, 130, 246, 0.12))"/>
  <path d="M125 105C118 105 112 99 112 92C112 85.5 116.5 80 123 79.2C125 68 135 60 147 60C158 60 167 67.5 170 77.8C171.5 77.3 173 77 175 77C184 77 191 84 191 93C191 102 184 105 175 105H125Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#3B82F6" stroke-width="2.5"/>
  <line x1="160" y1="105" x2="160" y2="125" stroke="#3B82F6" stroke-width="2" stroke-dasharray="3 3"/>
  <rect x="100" y="125" width="120" height="24" rx="4" fill="var(--sp-ill-card-subtle, #0F172A)" stroke="var(--sp-ill-border, #334155)" stroke-width="1.5"/>
  <circle cx="114" cy="137" r="3" fill="#10B981"/>
  <circle cx="124" cy="137" r="3" fill="#06B6D4"/>
  <rect x="140" y="134" width="65" height="6" rx="2" fill="var(--sp-ill-subtle, #334155)"/>
  <rect x="100" y="155" width="120" height="24" rx="4" fill="var(--sp-ill-card-subtle, #0F172A)" stroke="var(--sp-ill-border, #334155)" stroke-width="1.5"/>
  <circle cx="114" cy="167" r="3" fill="#10B981"/>
  <circle cx="124" cy="167" r="3" fill="#10B981"/>
  <rect x="140" y="164" width="65" height="6" rx="2" fill="var(--sp-ill-subtle, #334155)"/>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #EFF6FF)" stroke="#3B82F6"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#3B82F6" text-anchor="middle">CLOUD 99.99% UP</text>
  </g>
</svg>`,
};

export const illustrationCodeDevelopment: IllustrationDefinition = {
  name: 'code-development',
  title: 'Software Development & IDE',
  category: 'technology',
  tags: ['code', 'development', 'programming', 'software', 'ide', 'terminal', 'git'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <rect x="80" y="55" width="160" height="120" rx="8" fill="#0F172A" stroke="var(--sp-ill-border, #334155)" stroke-width="2"/>
  <path d="M80 78H240" stroke="#1E293B" stroke-width="2"/>
  <circle cx="94" cy="67" r="3" fill="#EF4444"/>
  <circle cx="104" cy="67" r="3" fill="#F59E0B"/>
  <circle cx="114" cy="67" r="3" fill="#10B981"/>
  <text x="96" y="100" font-family="monospace" font-size="11" fill="#EC4899">const</text>
  <text x="135" y="100" font-family="monospace" font-size="11" fill="#60A5FA">spruce</text>
  <text x="180" y="100" font-family="monospace" font-size="11" fill="#94A3B8">=</text>
  <text x="194" y="100" font-family="monospace" font-size="11" fill="#FBBF24">true;</text>
  <text x="96" y="122" font-family="monospace" font-size="11" fill="#34D399">&lt;SpIllustration</text>
  <text x="110" y="142" font-family="monospace" font-size="11" fill="#06B6D4">name="code"</text>
  <text x="96" y="162" font-family="monospace" font-size="11" fill="#34D399">/&gt;</text>
  <rect x="182" y="132" width="6" height="12" fill="#10B981"/>
  <g class="sp-ill-badge">
    <rect x="100" y="195" width="120" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">CLEAN CODE</text>
  </g>
</svg>`,
};

export const illustrationDatabaseStorage: IllustrationDefinition = {
  name: 'database-storage',
  title: 'Database & Data Storage',
  category: 'technology',
  tags: ['database', 'storage', 'sql', 'nosql', 'records', 'data', 'backup'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(6, 182, 212, 0.12))"/>
  <g transform="translate(110, 55)">
    <path d="M0 20C0 9 22.4 0 50 0C77.6 0 100 9 100 20V45C100 56 77.6 65 50 65C22.4 65 0 56 0 45V20Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#06B6D4" stroke-width="2"/>
    <ellipse cx="50" cy="20" rx="50" ry="20" fill="#06B6D4" fill-opacity="0.15" stroke="#06B6D4" stroke-width="2"/>
    <circle cx="80" cy="38" r="3" fill="#10B981"/>
    <path d="M0 55C0 66 22.4 75 50 75C77.6 75 100 66 100 55V80C100 91 77.6 100 50 100C22.4 100 0 91 0 80V55Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#06B6D4" stroke-width="2"/>
    <circle cx="80" cy="73" r="3" fill="#10B981"/>
    <path d="M0 90C0 101 22.4 110 50 110C77.6 110 100 101 100 90V115C100 126 77.6 135 50 135C22.4 135 0 126 0 115V90Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#06B6D4" stroke-width="2"/>
    <circle cx="80" cy="108" r="3" fill="#10B981"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #F0FDFA)" stroke="#06B6D4"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#06B6D4" text-anchor="middle">DATA REPLICATED</text>
  </g>
</svg>`,
};

export const illustrationCyberSecurity: IllustrationDefinition = {
  name: 'cyber-security',
  title: 'Cybersecurity & Data Privacy',
  category: 'technology',
  tags: ['security', 'shield', 'lock', 'firewall', 'encryption', 'privacy', 'cyber'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <defs>
    <linearGradient id="cs-shield" x1="160" y1="50" x2="160" y2="180" gradientUnits="userSpaceOnUse">
      <stop stop-color="#10B981"/>
      <stop offset="1" stop-color="#047857"/>
    </linearGradient>
  </defs>
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <path d="M160 52L215 76V126C215 158 189 180 160 190C131 180 105 158 105 126V76L160 52Z" fill="url(#cs-shield)"/>
  <path d="M160 56L211 78V126C211 155 186 176 160 186V56Z" fill="#FFFFFF" fill-opacity="0.15"/>
  <g transform="translate(142, 95)">
    <rect x="0" y="14" width="36" height="28" rx="6" fill="#FFFFFF"/>
    <path d="M7 14V8C7 2.5 11.9 -2 18 -2C24.1 -2 29 2.5 29 8V14" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="18" cy="26" r="3" fill="#047857"/>
    <path d="M18 29V34" stroke="#047857" stroke-width="2" stroke-linecap="round"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="76" y="195" width="168" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">256-BIT ENCRYPTED</text>
  </g>
</svg>`,
};

export const illustrationApiIntegration: IllustrationDefinition = {
  name: 'api-integration',
  title: 'API & Microservices Integration',
  category: 'technology',
  tags: ['api', 'integration', 'rest', 'endpoints', 'json', 'webhook', 'connect'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(99, 102, 241, 0.12))"/>
  <rect x="70" y="85" width="70" height="70" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="#6366F1" stroke-width="2"/>
  <rect x="80" y="97" width="30" height="6" rx="2" fill="#6366F1"/>
  <rect x="80" y="110" width="45" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="80" y="120" width="35" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="80" y="130" width="50" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="180" y="85" width="70" height="70" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="#10B981" stroke-width="2"/>
  <rect x="190" y="97" width="30" height="6" rx="2" fill="#10B981"/>
  <rect x="190" y="110" width="45" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="190" y="120" width="35" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="190" y="130" width="50" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <path d="M140 120H180" stroke="var(--sp-ill-text, #0F172A)" stroke-width="3" stroke-linecap="round"/>
  <circle cx="160" cy="120" r="14" fill="var(--sp-ill-text, #0F172A)"/>
  <path d="M155 116L160 120L155 124M165 116L160 120L165 124" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
  <g class="sp-ill-badge">
    <rect x="88" y="195" width="144" height="24" rx="12" fill="var(--sp-ill-card, #EEF2FF)" stroke="#6366F1"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#6366F1" text-anchor="middle">REST & GRAPHQL</text>
  </g>
</svg>`,
};

export const illustrationAiMachineLearning: IllustrationDefinition = {
  name: 'ai-machine-learning',
  title: 'Artificial Intelligence & ML',
  category: 'technology',
  tags: ['ai', 'machine learning', 'neural', 'brain', 'model', 'smart', 'automation'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(217, 70, 239, 0.12))"/>
  <line x1="115" y1="90" x2="160" y2="70" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <line x1="115" y1="90" x2="160" y2="120" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <line x1="115" y1="150" x2="160" y2="120" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <line x1="115" y1="150" x2="160" y2="170" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <line x1="160" y1="70" x2="205" y2="120" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <line x1="160" y1="120" x2="205" y2="120" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <line x1="160" y1="170" x2="205" y2="120" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <circle cx="115" cy="90" r="12" fill="var(--sp-ill-card, #FFFFFF)" stroke="#D946EF" stroke-width="2.5"/>
  <circle cx="115" cy="150" r="12" fill="var(--sp-ill-card, #FFFFFF)" stroke="#D946EF" stroke-width="2.5"/>
  <circle cx="160" cy="70" r="12" fill="var(--sp-ill-card, #FFFFFF)" stroke="#8B5CF6" stroke-width="2.5"/>
  <circle cx="160" cy="120" r="14" fill="#8B5CF6"/>
  <path d="M156 120L159 123L165 117" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
  <circle cx="160" cy="170" r="12" fill="var(--sp-ill-card, #FFFFFF)" stroke="#8B5CF6" stroke-width="2.5"/>
  <circle cx="205" cy="120" r="14" fill="var(--sp-ill-card, #FFFFFF)" stroke="#10B981" stroke-width="3"/>
  <circle cx="205" cy="120" r="6" fill="#10B981"/>
  <g class="sp-ill-badge">
    <rect x="80" y="195" width="160" height="24" rx="12" fill="var(--sp-ill-card, #FDF4FF)" stroke="#D946EF"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#D946EF" text-anchor="middle">NEURAL INFERENCE</text>
  </g>
</svg>`,
};

export const illustrationDevopsPipeline: IllustrationDefinition = {
  name: 'devops-pipeline',
  title: 'DevOps & CI/CD Pipeline',
  category: 'technology',
  tags: ['devops', 'ci cd', 'pipeline', 'deployment', 'build', 'release', 'docker'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(6, 182, 212, 0.12))"/>
  <path d="M120 120C120 100 135 90 150 105L170 135C185 150 200 140 200 120C200 100 185 90 170 105L150 135C135 150 120 140 120 120Z" stroke="#06B6D4" stroke-width="12" stroke-linecap="round" fill="none"/>
  <path d="M120 120C120 100 135 90 150 105L170 135C185 150 200 140 200 120" stroke="#10B981" stroke-width="12" stroke-linecap="round" fill="none"/>
  <circle cx="120" cy="120" r="4" fill="#FFFFFF"/>
  <circle cx="200" cy="120" r="4" fill="#FFFFFF"/>
  <g class="sp-ill-badge">
    <rect x="76" y="195" width="168" height="24" rx="12" fill="var(--sp-ill-card, #F0FDFA)" stroke="#06B6D4"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#06B6D4" text-anchor="middle">BUILD: SUCCESSFUL</text>
  </g>
</svg>`,
};

export const illustrationSystemAnalytics: IllustrationDefinition = {
  name: 'system-analytics',
  title: 'Telemetry & System Health',
  category: 'technology',
  tags: ['analytics', 'telemetry', 'health', 'metrics', 'monitoring', 'cpu', 'memory'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <rect x="80" y="60" width="160" height="110" rx="8" fill="#0F172A" stroke="var(--sp-ill-border, #334155)" stroke-width="2"/>
  <rect x="92" y="72" width="45" height="8" rx="2" fill="#334155"/>
  <circle cx="222" cy="76" r="4" fill="#10B981"/>
  <path d="M92 135L115 110L135 125L160 95L185 105L210 85L228 90" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="92" y1="145" x2="228" y2="145" stroke="#1E293B" stroke-width="1.5"/>
  <rect x="92" y="152" width="25" height="6" rx="2" fill="#334155"/>
  <rect x="130" y="152" width="35" height="6" rx="2" fill="#334155"/>
  <rect x="180" y="152" width="45" height="6" rx="2" fill="#10B981"/>
  <g class="sp-ill-badge">
    <rect x="88" y="195" width="144" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">SYSTEM HEALTHY</text>
  </g>
</svg>`,
};

export const TECH_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationCloudInfrastructure,
  illustrationCodeDevelopment,
  illustrationDatabaseStorage,
  illustrationCyberSecurity,
  illustrationApiIntegration,
  illustrationAiMachineLearning,
  illustrationDevopsPipeline,
  illustrationSystemAnalytics,
] as const;
