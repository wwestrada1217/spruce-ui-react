import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationFuelDispenser: IllustrationDefinition = {
  name: 'fuel-dispenser',
  title: 'Gas & Fuel Pump Dispenser',
  category: 'petro-fuel',
  tags: ['fuel', 'petro', 'gas', 'gasoline', 'diesel', 'pump', 'dispenser', 'station'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(239, 68, 68, 0.12))"/>
  <!-- Concrete Island Base -->
  <rect x="70" y="174" width="180" height="12" rx="4" fill="#64748B"/>
  <!-- Fuel Pump Housing -->
  <rect x="110" y="60" width="80" height="114" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <rect x="110" y="60" width="80" height="24" rx="8" fill="#EF4444"/>
  <text x="150" y="76" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="10" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">OCTANE 95</text>
  <!-- Digital Meter Display -->
  <rect x="122" y="94" width="56" height="30" rx="4" fill="#0F172A"/>
  <text x="150" y="108" font-family="monospace" font-weight="700" font-size="10" fill="#10B981" text-anchor="middle">$ 48.50</text>
  <text x="150" y="119" font-family="monospace" font-weight="700" font-size="8" fill="#F59E0B" text-anchor="middle">12.4 GAL</text>
  <!-- Keypad & Card Slot -->
  <rect x="124" y="132" width="22" height="18" rx="2" fill="#E2E8F0"/>
  <rect x="154" y="136" width="24" height="4" rx="1" fill="#334155"/>
  <!-- Flexible Nozzle Hose -->
  <path d="M190 100C214 100 226 130 220 160L216 160C220 134 210 110 190 108" fill="#1E293B"/>
  <!-- Dispenser Nozzle Handle -->
  <path d="M220 160L216 138L228 134L230 144L242 136" stroke="#EF4444" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Fuel Droplet -->
  <path d="M246 142C246 142 249 146 249 148C249 150 248 151 246 151C244 151 243 150 243 148C243 146 246 142 246 142Z" fill="#F59E0B"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #FEF2F2)" stroke="#EF4444" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#DC2626" text-anchor="middle" letter-spacing="1">REFUELING</text>
  </g>
</svg>`,
};

export const illustrationOilRig: IllustrationDefinition = {
  name: 'oil-rig',
  title: 'Offshore Petroleum Platform Rig',
  category: 'petro-fuel',
  tags: ['oil', 'petro', 'rig', 'offshore', 'platform', 'drilling', 'crude', 'energy'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(2, 132, 199, 0.12))"/>
  <!-- Ocean Waves -->
  <path d="M50 178C70 176 85 180 105 178C125 176 140 180 160 178C180 176 195 180 215 178C235 176 250 180 270 178" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
  <!-- Platform Leg Pilings (Submerged in Sea) -->
  <rect x="96" y="128" width="12" height="56" fill="#334155"/>
  <rect x="212" y="128" width="12" height="56" fill="#334155"/>
  <line x1="96" y1="140" x2="224" y2="180" stroke="#64748B" stroke-width="2"/>
  <line x1="224" y1="140" x2="96" y2="180" stroke="#64748B" stroke-width="2"/>
  <!-- Main Platform Deck -->
  <rect x="80" y="120" width="160" height="14" rx="2" fill="#E2E8F0" stroke="#334155" stroke-width="2"/>
  <!-- Central Drilling Derrick Mast -->
  <polygon points="144,52 176,52 188,120 132,120" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2"/>
  <line x1="140" y1="74" x2="180" y2="74" stroke="#334155" stroke-width="1.5"/>
  <line x1="136" y1="96" x2="184" y2="96" stroke="#334155" stroke-width="1.5"/>
  <line x1="144" y1="52" x2="184" y2="96" stroke="#94A3B8" stroke-width="1.2"/>
  <line x1="176" y1="52" x2="136" y2="96" stroke="#94A3B8" stroke-width="1.2"/>
  <!-- Gas Flare Boom on Left -->
  <line x1="88" y1="120" x2="64" y2="76" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
  <!-- Flare Flame -->
  <path d="M64 76C60 70 60 62 66 56C72 62 70 70 64 76Z" fill="#F59E0B"/>
  <path d="M64 72C62 68 62 64 65 60C68 64 67 68 64 72Z" fill="#EF4444"/>
  <!-- Helipad on Right -->
  <line x1="230" y1="120" x2="252" y2="108" stroke="#475569" stroke-width="2"/>
  <rect x="238" y="104" width="28" height="6" rx="2" fill="#10B981"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #F0F9FF)" stroke="#0284C7" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#0369A1" text-anchor="middle" letter-spacing="1">OFFSHORE RIG</text>
  </g>
</svg>`,
};

export const illustrationPetroRefinery: IllustrationDefinition = {
  name: 'petro-refinery',
  title: 'Petroleum Refinery & Distillation',
  category: 'petro-fuel',
  tags: [
    'refinery',
    'petro',
    'distillation',
    'chemical',
    'crude',
    'pipeline',
    'tanks',
    'processing',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.12))"/>
  <!-- Spherical Liquefied Gas Tank on Left -->
  <circle cx="94" cy="144" r="26" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <line x1="76" y1="166" x2="76" y2="178" stroke="#334155" stroke-width="2.5"/>
  <line x1="112" y1="166" x2="112" y2="178" stroke="#334155" stroke-width="2.5"/>
  <ellipse cx="94" cy="144" rx="26" ry="7" fill="none" stroke="#CBD5E1" stroke-width="1.5"/>
  <!-- Tall Fractionation Distillation Column in Center -->
  <rect x="142" y="52" width="36" height="124" rx="18" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <!-- Distillation Trays -->
  <line x1="142" y1="78" x2="178" y2="78" stroke="#94A3B8" stroke-width="1.5"/>
  <line x1="142" y1="102" x2="178" y2="102" stroke="#94A3B8" stroke-width="1.5"/>
  <line x1="142" y1="126" x2="178" y2="126" stroke="#94A3B8" stroke-width="1.5"/>
  <line x1="142" y1="150" x2="178" y2="150" stroke="#94A3B8" stroke-width="1.5"/>
  <!-- Storage Silo on Right -->
  <rect x="198" y="104" width="48" height="72" rx="4" fill="#334155"/>
  <ellipse cx="222" cy="104" rx="24" ry="6" fill="#64748B"/>
  <!-- Interconnecting Pipelines -->
  <path d="M120 144H142" stroke="#F59E0B" stroke-width="3"/>
  <path d="M178 126H198" stroke="#3B82F6" stroke-width="3"/>
  <path d="M160 52V42H188V104" stroke="#10B981" stroke-width="2.5"/>
  <!-- Ground Line -->
  <line x1="60" y1="178" x2="260" y2="178" stroke="#64748B" stroke-width="2"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#B45309" text-anchor="middle" letter-spacing="1">REFINERY</text>
  </g>
</svg>`,
};

export const illustrationFuelTanker: IllustrationDefinition = {
  name: 'fuel-tanker',
  title: 'Petroleum Fuel Tanker Truck',
  category: 'petro-fuel',
  tags: ['fuel', 'tanker', 'truck', 'petro', 'hazmat', 'gasoline', 'transport', 'diesel'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <ellipse cx="160" cy="188" rx="88" ry="10" fill="var(--sp-ill-halo, rgba(239, 68, 68, 0.15))"/>
  <!-- Cylindrical Fuel Tank Body -->
  <rect x="64" y="112" width="128" height="52" rx="20" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <!-- Tanker Red Hazard Band -->
  <rect x="74" y="132" width="108" height="12" fill="#EF4444"/>
  <!-- Flammable Liquid Diamond Placard -->
  <polygon points="128,124 134,130 128,136 122,130" fill="#EF4444"/>
  <circle cx="128" cy="130" r="1.5" fill="#FFFFFF"/>
  <!-- Cab -->
  <path d="M192 124H222L244 146V166H192V124Z" fill="#EF4444" stroke="#DC2626" stroke-width="2"/>
  <polygon points="196,128 218,128 236,146 196,146" fill="#93C5FD"/>
  <!-- Wheels -->
  <circle cx="86" cy="168" r="14" fill="#1E293B"/>
  <circle cx="86" cy="168" r="6" fill="#CBD5E1"/>
  <circle cx="116" cy="168" r="14" fill="#1E293B"/>
  <circle cx="116" cy="168" r="6" fill="#CBD5E1"/>
  <circle cx="224" cy="168" r="14" fill="#1E293B"/>
  <circle cx="224" cy="168" r="6" fill="#CBD5E1"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #FEF2F2)" stroke="#EF4444" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#DC2626" text-anchor="middle" letter-spacing="1">HAZMAT FUEL</text>
  </g>
</svg>`,
};

export const illustrationRenewableFuel: IllustrationDefinition = {
  name: 'renewable-fuel',
  title: 'Biofuel & Clean Hydrogen Station',
  category: 'petro-fuel',
  tags: ['biofuel', 'renewable', 'hydrogen', 'clean-energy', 'green-fuel', 'station', 'eco'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <!-- Station Base -->
  <rect x="70" y="174" width="180" height="12" rx="4" fill="#64748B"/>
  <!-- Clean Green Fuel Pump -->
  <rect x="110" y="60" width="80" height="114" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="#166534" stroke-width="2.5"/>
  <rect x="110" y="60" width="80" height="24" rx="8" fill="#16A34A"/>
  <text x="150" y="76" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="10" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">BIO-DIESEL</text>
  <!-- Bio Leaf Emblem in Center -->
  <path d="M150 96C140 96 136 106 136 116C146 116 156 112 156 102C156 98 154 96 150 96Z" fill="#16A34A"/>
  <path d="M150 96C160 96 164 106 164 116C154 116 144 112 144 102C144 98 146 96 150 96Z" fill="#22C55E"/>
  <line x1="150" y1="96" x2="150" y2="124" stroke="#15803D" stroke-width="2" stroke-linecap="round"/>
  <!-- Green Hose & Eco Nozzle -->
  <path d="M190 100C214 100 226 130 220 160L216 160C220 134 210 110 190 108" fill="#15803D"/>
  <path d="M220 160L216 138L228 134L230 144L242 136" stroke="#16A34A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#047857" text-anchor="middle" letter-spacing="1">BIO-ENERGY</text>
  </g>
</svg>`,
};

export const PETRO_FUEL_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationFuelDispenser,
  illustrationOilRig,
  illustrationPetroRefinery,
  illustrationFuelTanker,
  illustrationRenewableFuel,
] as const;
