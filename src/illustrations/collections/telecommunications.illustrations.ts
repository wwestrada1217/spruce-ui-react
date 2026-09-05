import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationCellTower: IllustrationDefinition = {
  name: 'cell-tower',
  title: '5G Cellular Tower',
  category: 'telecommunications',
  tags: ['telecom', '5g', 'cellular', 'tower', 'antenna', 'wireless', 'broadcast', 'signal'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(6, 182, 212, 0.12))"/>
  <!-- Broadcast Signal Arcs -->
  <path d="M136 50C144 42 176 42 184 50" stroke="#06B6D4" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M124 38C138 24 182 24 196 38" stroke="#22D3EE" stroke-width="2" stroke-linecap="round"/>
  <path d="M112 26C134 6 186 6 208 26" stroke="#67E8F9" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3 3"/>
  <!-- Tower Structure -->
  <line x1="160" y1="44" x2="160" y2="60" stroke="#0F172A" stroke-width="4" stroke-linecap="round"/>
  <circle cx="160" cy="44" r="5" fill="#EF4444"/>
  <!-- Cross Truss Lattice -->
  <polygon points="144,60 176,60 192,188 128,188" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <line x1="144" y1="90" x2="176" y2="90" stroke="#334155" stroke-width="2"/>
  <line x1="140" y1="124" x2="180" y2="124" stroke="#334155" stroke-width="2"/>
  <line x1="134" y1="156" x2="186" y2="156" stroke="#334155" stroke-width="2"/>
  <line x1="144" y1="60" x2="180" y2="124" stroke="#64748B" stroke-width="1.5"/>
  <line x1="176" y1="60" x2="140" y2="124" stroke="#64748B" stroke-width="1.5"/>
  <line x1="140" y1="124" x2="186" y2="188" stroke="#64748B" stroke-width="1.5"/>
  <line x1="180" y1="124" x2="134" y2="188" stroke="#64748B" stroke-width="1.5"/>
  <!-- Concrete Base -->
  <rect x="120" y="188" width="80" height="8" rx="2" fill="#64748B"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #ECFEFF)" stroke="#06B6D4" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#0891B2" text-anchor="middle" letter-spacing="1">5G NETWORK</text>
  </g>
</svg>`,
};

export const illustrationSatelliteOrbit: IllustrationDefinition = {
  name: 'satellite-orbit',
  title: 'Satellite Telecommunication',
  category: 'telecommunications',
  tags: ['satellite', 'telecom', 'orbit', 'space', 'uplink', 'downlink', 'global', 'connectivity'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(99, 102, 241, 0.12))"/>
  <!-- Orbit Ring -->
  <ellipse cx="160" cy="120" rx="98" ry="42" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4" transform="rotate(-20 160 120)"/>
  <!-- Central Earth Globe Segment -->
  <circle cx="90" cy="150" r="44" fill="#0284C7"/>
  <path d="M70 130C82 126 94 134 98 146C100 152 108 156 112 160C116 166 110 178 98 184C82 192 64 176 68 154" fill="#10B981"/>
  <!-- Satellite Main Body -->
  <g transform="translate(190, 68) rotate(25)">
    <!-- Solar Panels Left -->
    <rect x="-44" y="-12" width="34" height="24" rx="2" fill="#1E40AF" stroke="#60A5FA" stroke-width="1.5"/>
    <line x1="-33" y1="-12" x2="-33" y2="12" stroke="#60A5FA" stroke-width="1"/>
    <line x1="-22" y1="-12" x2="-22" y2="12" stroke="#60A5FA" stroke-width="1"/>
    <!-- Solar Panels Right -->
    <rect x="18" y="-12" width="34" height="24" rx="2" fill="#1E40AF" stroke="#60A5FA" stroke-width="1.5"/>
    <line x1="29" y1="-12" x2="29" y2="12" stroke="#60A5FA" stroke-width="1"/>
    <line x1="40" y1="-12" x2="40" y2="12" stroke="#60A5FA" stroke-width="1"/>
    <!-- Chassis -->
    <rect x="-10" y="-14" width="20" height="28" rx="4" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2"/>
    <circle cx="0" cy="0" r="4" fill="#3B82F6"/>
    <!-- Dish -->
    <path d="M-10 18C-10 18 -4 28 0 28C4 28 10 18 10 18" fill="none" stroke="#F59E0B" stroke-width="2.5"/>
    <line x1="0" y1="14" x2="0" y2="28" stroke="#F59E0B" stroke-width="2"/>
  </g>
  <!-- Downlink Beam -->
  <line x1="184" y1="94" x2="114" y2="136" stroke="#F59E0B" stroke-width="2" stroke-dasharray="3 3"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="202" width="100" height="24" rx="12" fill="var(--sp-ill-card, #EEF2FF)" stroke="#6366F1" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#4F46E5" text-anchor="middle" letter-spacing="1">SATELLITE</text>
  </g>
</svg>`,
};

export const illustrationFiberOptic: IllustrationDefinition = {
  name: 'fiber-optic',
  title: 'Fiber Optic High-Speed Broadband',
  category: 'telecommunications',
  tags: ['fiber', 'broadband', 'cable', 'internet', 'gigabit', 'speed', 'telecom', 'optical'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <!-- Cable Sheath -->
  <rect x="60" y="100" width="70" height="36" rx="6" fill="#1E293B"/>
  <rect x="130" y="104" width="20" height="28" fill="#475569"/>
  <!-- Spreading Fiber Filaments with Glowing Ends -->
  <path d="M150 118C180 118 200 70 240 64" stroke="#06B6D4" stroke-width="3" stroke-linecap="round"/>
  <circle cx="240" cy="64" r="5" fill="#22D3EE"/>
  <path d="M150 118C185 118 205 92 248 88" stroke="#10B981" stroke-width="3" stroke-linecap="round"/>
  <circle cx="248" cy="88" r="5" fill="#34D399"/>
  <path d="M150 118C180 118 210 118 252 118" stroke="#3B82F6" stroke-width="3" stroke-linecap="round"/>
  <circle cx="252" cy="118" r="5" fill="#60A5FA"/>
  <path d="M150 118C185 118 205 144 248 148" stroke="#A855F7" stroke-width="3" stroke-linecap="round"/>
  <circle cx="248" cy="148" r="5" fill="#C084FC"/>
  <path d="M150 118C180 118 200 166 240 172" stroke="#F43F5E" stroke-width="3" stroke-linecap="round"/>
  <circle cx="240" cy="172" r="5" fill="#FB7185"/>
  <!-- Pulses of Light -->
  <circle cx="180" cy="118" r="3" fill="#FFFFFF"/>
  <circle cx="210" cy="80" r="2.5" fill="#FFFFFF"/>
  <circle cx="212" cy="156" r="2.5" fill="#FFFFFF"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#047857" text-anchor="middle" letter-spacing="1">GIGABIT FIBER</text>
  </g>
</svg>`,
};

export const illustrationVoipCalling: IllustrationDefinition = {
  name: 'voip-calling',
  title: 'VoIP & Cloud Telephony',
  category: 'telecommunications',
  tags: ['voip', 'phone', 'calling', 'telecom', 'telephony', 'headset', 'cloud-call', 'voice'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(37, 99, 235, 0.12))"/>
  <!-- Headset Loop -->
  <path d="M116 116C116 88 134 68 160 68C186 68 204 88 204 116" stroke="#1E293B" stroke-width="6" stroke-linecap="round"/>
  <!-- Left Ear Cushion -->
  <rect x="108" y="106" width="14" height="34" rx="7" fill="#3B82F6"/>
  <!-- Right Ear Cushion -->
  <rect x="198" y="106" width="14" height="34" rx="7" fill="#3B82F6"/>
  <!-- Microphone Boom Arm -->
  <path d="M114 130C114 148 132 158 152 158" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round"/>
  <rect x="150" y="153" width="12" height="10" rx="4" fill="#10B981"/>
  <!-- Sound Waveform -->
  <line x1="168" y1="158" x2="168" y2="158" stroke="#10B981" stroke-width="3" stroke-linecap="round"/>
  <line x1="174" y1="152" x2="174" y2="164" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="180" y1="146" x2="180" y2="170" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="186" y1="154" x2="186" y2="162" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="192" y1="156" x2="192" y2="160" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Cloud Icon Behind -->
  <path d="M142 98C142 90 148 84 156 84C162 84 167 87 170 92C172 91 175 90 178 90C184 90 188 94 188 100H142Z" fill="#93C5FD" fill-opacity="0.5"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="202" width="100" height="24" rx="12" fill="var(--sp-ill-card, #EFF6FF)" stroke="#3B82F6" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#1D4ED8" text-anchor="middle" letter-spacing="1">VOIP ACTIVE</text>
  </g>
</svg>`,
};

export const illustrationNetworkSwitch: IllustrationDefinition = {
  name: 'network-switch',
  title: 'Network Switch & Router Rack',
  category: 'telecommunications',
  tags: ['router', 'switch', 'rack', 'ethernet', 'ports', 'lan', 'wan', 'datacenter', 'hardware'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(100, 116, 139, 0.12))"/>
  <!-- Rack Unit Chassis -->
  <rect x="70" y="70" width="180" height="42" rx="4" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <rect x="70" y="118" width="180" height="42" rx="4" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <!-- Top Unit Ports & LEDs -->
  <rect x="80" y="78" width="8" height="8" rx="2" fill="#10B981"/>
  <circle cx="94" cy="82" r="2.5" fill="#10B981"/>
  <circle cx="102" cy="82" r="2.5" fill="#10B981"/>
  <circle cx="110" cy="82" r="2.5" fill="#F59E0B"/>
  <!-- Ethernet Port Bank 1 -->
  <rect x="130" y="80" width="14" height="12" rx="1" fill="#1E293B"/>
  <rect x="150" y="80" width="14" height="12" rx="1" fill="#1E293B"/>
  <rect x="170" y="80" width="14" height="12" rx="1" fill="#1E293B"/>
  <rect x="190" y="80" width="14" height="12" rx="1" fill="#1E293B"/>
  <rect x="210" y="80" width="14" height="12" rx="1" fill="#1E293B"/>
  <rect x="230" y="80" width="14" height="12" rx="1" fill="#1E293B"/>
  <!-- Bottom Unit Ports & Patch Cables -->
  <rect x="80" y="126" width="8" height="8" rx="2" fill="#3B82F6"/>
  <rect x="130" y="128" width="14" height="12" rx="1" fill="#1E293B"/>
  <rect x="150" y="128" width="14" height="12" rx="1" fill="#1E293B"/>
  <rect x="170" y="128" width="14" height="12" rx="1" fill="#1E293B"/>
  <rect x="190" y="128" width="14" height="12" rx="1" fill="#1E293B"/>
  <!-- Patch Cables Interconnecting -->
  <path d="M137 92C137 110 177 110 177 128" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M157 92C157 115 137 115 137 128" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #F1F5F9)" stroke="#64748B" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#334155" text-anchor="middle" letter-spacing="1">PATCH ROUTED</text>
  </g>
</svg>`,
};

export const TELECOMMUNICATIONS_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationCellTower,
  illustrationSatelliteOrbit,
  illustrationFiberOptic,
  illustrationVoipCalling,
  illustrationNetworkSwitch,
] as const;
