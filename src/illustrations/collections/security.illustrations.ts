import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationMfaAuthenticator: IllustrationDefinition = {
  name: 'mfa-authenticator',
  title: 'Multi-Factor Authentication (MFA)',
  category: 'security',
  tags: ['mfa', '2fa', 'otp', 'authenticator', 'smartphone', 'code', 'security'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <!-- Phone body -->
  <rect x="115" y="45" width="90" height="140" rx="14" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <circle cx="160" cy="56" r="3" fill="var(--sp-ill-border, #CBD5E1)"/>
  <!-- Screen container -->
  <rect x="125" y="68" width="70" height="95" rx="6" fill="var(--sp-ill-subtle, #F1F5F9)"/>
  <!-- Shield icon on phone -->
  <circle cx="160" cy="94" r="16" fill="#10B981"/>
  <path d="M154 94L158 98L167 90" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- OTP Digits Box -->
  <rect x="130" y="122" width="60" height="20" rx="4" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="1"/>
  <text x="160" y="136" font-family="monospace" font-weight="800" font-size="11" fill="#10B981" text-anchor="middle" letter-spacing="2">849 201</text>
  <circle cx="160" cy="172" r="5" fill="var(--sp-ill-border, #CBD5E1)"/>
  <g class="sp-ill-badge">
    <rect x="80" y="195" width="160" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">2-STEP MFA VERIFIED</text>
  </g>
</svg>`,
};

export const illustrationBiometricPasskey: IllustrationDefinition = {
  name: 'biometric-passkey',
  title: 'Passkey & Biometric Fingerprint',
  category: 'security',
  tags: ['biometric', 'fingerprint', 'passkey', 'webauthn', 'fido', 'touch id', 'security'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(6, 182, 212, 0.12))"/>
  <!-- Fingerprint concentric arcs -->
  <circle cx="160" cy="115" r="46" fill="var(--sp-ill-card, #FFFFFF)" stroke="#06B6D4" stroke-width="2"/>
  <path d="M160 90C146 90 135 101 135 115C135 129 146 140 160 140" stroke="#06B6D4" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M160 98C151 98 143 105 143 115C143 125 151 132 160 132C169 132 177 125 177 115" stroke="#06B6D4" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M160 106C155 106 151 110 151 115C151 120 155 124 160 124C165 124 169 120 169 115C169 105 160 94 150 94" stroke="#06B6D4" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- Key overlay -->
  <g transform="translate(185, 125)">
    <circle cx="18" cy="18" r="16" fill="#10B981" stroke="#FFFFFF" stroke-width="2"/>
    <circle cx="18" cy="18" r="6" fill="#FFFFFF"/>
    <path d="M18 24V32M18 28H23" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #F0FDFA)" stroke="#06B6D4"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#06B6D4" text-anchor="middle">PASSKEY ENABLED</text>
  </g>
</svg>`,
};

export const illustrationSecurityShieldAudit: IllustrationDefinition = {
  name: 'security-shield-audit',
  title: 'Security Compliance & Threat Shield',
  category: 'security',
  tags: ['shield', 'threat', 'firewall', 'protection', 'audit', 'compliance', 'security'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <defs>
    <linearGradient id="sec-shield-grad" x1="160" y1="50" x2="160" y2="180" gradientUnits="userSpaceOnUse">
      <stop stop-color="#10B981"/>
      <stop offset="1" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <path d="M160 50L215 75V125C215 158 189 180 160 190C131 180 105 158 105 125V75L160 50Z" fill="url(#sec-shield-grad)"/>
  <path d="M160 55L210 77V125C210 154 186 175 160 185V55Z" fill="#FFFFFF" fill-opacity="0.15"/>
  <circle cx="160" cy="115" r="24" fill="#FFFFFF"/>
  <path d="M150 115L157 122L171 108" stroke="#059669" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <g class="sp-ill-badge">
    <rect x="80" y="195" width="160" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">SECURITY HARDENED</text>
  </g>
</svg>`,
};

export const illustrationSsoFederation: IllustrationDefinition = {
  name: 'sso-federation',
  title: 'SSO & Enterprise Identity Provider',
  category: 'security',
  tags: ['sso', 'identity', 'saml', 'oidc', 'oauth', 'federation', 'security'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(99, 102, 241, 0.12))"/>
  <!-- Central ID Hub -->
  <circle cx="160" cy="115" r="28" fill="#6366F1"/>
  <circle cx="160" cy="108" r="8" fill="#FFFFFF"/>
  <path d="M148 126C148 120 153 118 160 118C167 118 172 120 172 126" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Orbiting federated nodes -->
  <line x1="160" y1="115" x2="90" y2="80" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2" stroke-dasharray="3 3"/>
  <line x1="160" y1="115" x2="230" y2="80" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2" stroke-dasharray="3 3"/>
  <line x1="160" y1="115" x2="90" y2="150" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2" stroke-dasharray="3 3"/>
  <line x1="160" y1="115" x2="230" y2="150" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2" stroke-dasharray="3 3"/>
  <circle cx="90" cy="80" r="16" fill="var(--sp-ill-card, #FFFFFF)" stroke="#10B981" stroke-width="2"/>
  <text x="90" y="84" font-family="system-ui, sans-serif" font-weight="800" font-size="9" fill="#10B981" text-anchor="middle">APP</text>
  <circle cx="230" cy="80" r="16" fill="var(--sp-ill-card, #FFFFFF)" stroke="#06B6D4" stroke-width="2"/>
  <text x="230" y="84" font-family="system-ui, sans-serif" font-weight="800" font-size="9" fill="#06B6D4" text-anchor="middle">OIDC</text>
  <circle cx="90" cy="150" r="16" fill="var(--sp-ill-card, #FFFFFF)" stroke="#F59E0B" stroke-width="2"/>
  <text x="90" y="154" font-family="system-ui, sans-serif" font-weight="800" font-size="9" fill="#F59E0B" text-anchor="middle">SAML</text>
  <circle cx="230" cy="150" r="16" fill="var(--sp-ill-card, #FFFFFF)" stroke="#6366F1" stroke-width="2"/>
  <text x="230" y="154" font-family="system-ui, sans-serif" font-weight="800" font-size="9" fill="#6366F1" text-anchor="middle">API</text>
  <g class="sp-ill-badge">
    <rect x="80" y="195" width="160" height="24" rx="12" fill="var(--sp-ill-card, #EEF2FF)" stroke="#6366F1"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#6366F1" text-anchor="middle">ENTERPRISE SSO SYNC</text>
  </g>
</svg>`,
};

export const illustrationSecurityBreachBlocked: IllustrationDefinition = {
  name: 'security-breach-blocked',
  title: 'Threat Detected & Blocked',
  category: 'security',
  tags: ['threat', 'breach', 'blocked', 'attack', 'hacker', 'firewall', 'security'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(239, 68, 68, 0.12))"/>
  <!-- Hexagon Firewall Perimeter -->
  <polygon points="160,50 220,85 220,155 160,190 100,155 100,85" fill="var(--sp-ill-card, #FFFFFF)" stroke="#EF4444" stroke-width="3"/>
  <polygon points="160,62 208,90 208,150 160,178 112,150 112,90" fill="#EF4444" fill-opacity="0.08"/>
  <!-- Bug/virus icon struck through -->
  <circle cx="160" cy="120" r="22" fill="#EF4444"/>
  <path d="M148 108L172 132M172 108L148 132" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #FEF2F2)" stroke="#EF4444"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#EF4444" text-anchor="middle">INTRUSION BLOCKED</text>
  </g>
</svg>`,
};

export const illustrationSafeVault: IllustrationDefinition = {
  name: 'safe-vault',
  title: 'Secure Credential Vault Door',
  category: 'security',
  tags: ['vault', 'safe', 'door', 'lock', 'dial', 'secrets', 'passwords', 'security'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.12))"/>
  <!-- Vault Door Base -->
  <circle cx="160" cy="115" r="62" fill="var(--sp-ill-card, #FFFFFF)" stroke="#F59E0B" stroke-width="4"/>
  <circle cx="160" cy="115" r="50" fill="var(--sp-ill-subtle, #F1F5F9)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <!-- Vault wheel / dial -->
  <circle cx="160" cy="115" r="26" fill="var(--sp-ill-card, #FFFFFF)" stroke="#F59E0B" stroke-width="3"/>
  <circle cx="160" cy="115" r="14" fill="#F59E0B"/>
  <!-- Spoke handles -->
  <line x1="160" y1="85" x2="160" y2="145" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="130" y1="115" x2="190" y2="115" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Hinges -->
  <rect x="86" y="80" width="10" height="20" rx="3" fill="var(--sp-ill-muted, #64748B)"/>
  <rect x="86" y="130" width="10" height="20" rx="3" fill="var(--sp-ill-muted, #64748B)"/>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#F59E0B" text-anchor="middle">VAULT LOCKED 256B</text>
  </g>
</svg>`,
};

export const illustrationPasswordKeygen: IllustrationDefinition = {
  name: 'password-keygen',
  title: 'Password Generator & High Entropy',
  category: 'security',
  tags: ['password', 'entropy', 'keygen', 'hash', 'symbols', 'credentials', 'vault', 'security'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <!-- Password card -->
  <rect x="75" y="65" width="170" height="100" rx="10" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <rect x="90" y="80" width="140" height="34" rx="6" fill="var(--sp-ill-subtle, #F1F5F9)" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="1.5"/>
  <text x="100" y="102" font-family="monospace" font-weight="800" font-size="13" fill="#10B981" letter-spacing="3">• • • • • • • • •</text>
  <!-- Entropy meter -->
  <rect x="90" y="126" width="140" height="6" rx="3" fill="var(--sp-ill-border, #E2E8F0)"/>
  <rect x="90" y="126" width="140" height="6" rx="3" fill="#10B981"/>
  <text x="90" y="146" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="#10B981">ENTROPY: 128-BIT VERY STRONG</text>
  <!-- Key icon -->
  <g transform="translate(195, 87)">
    <circle cx="12" cy="10" r="6" fill="#10B981"/>
    <path d="M12 16V24M12 20H16" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="80" y="195" width="160" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">PASSWORD GENERATED</text>
  </g>
</svg>`,
};

export const illustrationEncryptedSync: IllustrationDefinition = {
  name: 'encrypted-sync',
  title: 'End-to-End Encrypted Cloud Sync',
  category: 'security',
  tags: ['sync', 'e2ee', 'cloud', 'encryption', 'cross-platform', 'vault', 'security'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(6, 182, 212, 0.12))"/>
  <!-- Cloud shape -->
  <path d="M125 110C118 110 112 104 112 97C112 90.5 116.5 85 123 84.2C125 73 135 65 147 65C158 65 167 72.5 170 82.8C171.5 82.3 173 82 175 82C184 82 191 89 191 98C191 107 184 110 175 110H125Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#06B6D4" stroke-width="2.5"/>
  <!-- Sync arrows around center lock -->
  <g transform="translate(160, 138)">
    <circle cx="0" cy="0" r="26" fill="var(--sp-ill-card, #FFFFFF)" stroke="#06B6D4" stroke-width="2"/>
    <!-- Padlock -->
    <rect x="-9" y="-2" width="18" height="14" rx="3" fill="#06B6D4"/>
    <path d="M-5 -2V-7C-5 -9.5 -2.5 -12 0 -12C2.5 -12 5 -9.5 5 -7V-2" stroke="#06B6D4" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  </g>
  <!-- Circular sync arrows -->
  <path d="M128 138A36 36 0 0 1 180 110" stroke="#10B981" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M192 138A36 36 0 0 1 140 166" stroke="#10B981" stroke-width="2" fill="none" stroke-linecap="round"/>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #F0FDFA)" stroke="#06B6D4"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#06B6D4" text-anchor="middle">ZERO-KNOWLEDGE SYNC</text>
  </g>
</svg>`,
};

export const illustrationCredentialSharing: IllustrationDefinition = {
  name: 'credential-sharing',
  title: 'Secure Organization Credential Sharing',
  category: 'security',
  tags: ['sharing', 'teams', 'credentials', 'access control', 'org vault', 'vault', 'security'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(99, 102, 241, 0.12))"/>
  <!-- User 1 -->
  <circle cx="100" cy="95" r="16" fill="var(--sp-ill-card, #FFFFFF)" stroke="#6366F1" stroke-width="2"/>
  <circle cx="100" cy="91" r="5" fill="#6366F1"/>
  <path d="M92 105C92 101 95 99 100 99C105 99 108 101 108 105" stroke="#6366F1" stroke-width="2" stroke-linecap="round"/>
  <!-- User 2 -->
  <circle cx="220" cy="95" r="16" fill="var(--sp-ill-card, #FFFFFF)" stroke="#10B981" stroke-width="2"/>
  <circle cx="220" cy="91" r="5" fill="#10B981"/>
  <path d="M212 105C212 101 215 99 220 99C225 99 228 101 228 105" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>
  <!-- Central shared key -->
  <line x1="120" y1="95" x2="200" y2="95" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2" stroke-dasharray="4 4"/>
  <circle cx="160" cy="95" r="18" fill="var(--sp-ill-card, #FFFFFF)" stroke="#F59E0B" stroke-width="2"/>
  <circle cx="156" cy="95" r="5" fill="#F59E0B"/>
  <path d="M161 95H168M165 95V99" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
  <g class="sp-ill-badge">
    <rect x="80" y="195" width="160" height="24" rx="12" fill="var(--sp-ill-card, #EEF2FF)" stroke="#6366F1"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#6366F1" text-anchor="middle">SHARED VAULT ACCESS</text>
  </g>
</svg>`,
};

export const illustrationSecurityHealthReport: IllustrationDefinition = {
  name: 'security-health-report',
  title: 'Vault Security & Compromised Password Audit',
  category: 'security',
  tags: ['breach', 'audit', 'health', 'leaked', 'pwned', 'vault', 'report', 'security'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <rect x="85" y="52" width="150" height="130" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <circle cx="160" cy="95" r="28" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="3"/>
  <text x="160" y="100" font-family="system-ui, sans-serif" font-weight="800" font-size="15" fill="#10B981" text-anchor="middle">100%</text>
  <rect x="105" y="136" width="110" height="6" rx="3" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="105" y="136" width="110" height="6" rx="3" fill="#10B981"/>
  <text x="160" y="156" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="var(--sp-ill-muted, #64748B)" text-anchor="middle">0 AT-RISK PASSWORDS</text>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">VAULT SCORE: EXCELLENT</text>
  </g>
</svg>`,
};

export const SECURITY_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationMfaAuthenticator,
  illustrationBiometricPasskey,
  illustrationSecurityShieldAudit,
  illustrationSsoFederation,
  illustrationSecurityBreachBlocked,
  illustrationSafeVault,
  illustrationPasswordKeygen,
  illustrationEncryptedSync,
  illustrationCredentialSharing,
  illustrationSecurityHealthReport,
] as const;

/**
 * @deprecated Vault illustrations are now merged into SECURITY_ILLUSTRATIONS.
 */
export const VAULT_ILLUSTRATIONS = [
  illustrationSafeVault,
  illustrationPasswordKeygen,
  illustrationEncryptedSync,
  illustrationCredentialSharing,
  illustrationSecurityHealthReport,
] as const;
