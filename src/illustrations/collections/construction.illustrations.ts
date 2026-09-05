import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationTowerCrane: IllustrationDefinition = {
  name: 'tower-crane',
  title: 'Tower Crane & Skyscraper Build',
  category: 'construction',
  tags: [
    'construction',
    'crane',
    'tower',
    'building',
    'scaffolding',
    'girder',
    'steel',
    'skyscraper',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.12))"/>
  <!-- Building Frame / Columns on Right -->
  <rect x="180" y="90" width="80" height="96" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2"/>
  <line x1="180" y1="122" x2="260" y2="122" stroke="#334155" stroke-width="2"/>
  <line x1="180" y1="154" x2="260" y2="154" stroke="#334155" stroke-width="2"/>
  <line x1="220" y1="90" x2="220" y2="186" stroke="#334155" stroke-width="2"/>
  <!-- Tower Crane Mast (Yellow) -->
  <rect x="96" y="50" width="16" height="136" fill="#F59E0B" stroke="#D97706" stroke-width="1.5"/>
  <line x1="96" y1="70" x2="112" y2="90" stroke="#D97706" stroke-width="1.5"/>
  <line x1="112" y1="70" x2="96" y2="90" stroke="#D97706" stroke-width="1.5"/>
  <line x1="96" y1="110" x2="112" y2="130" stroke="#D97706" stroke-width="1.5"/>
  <line x1="112" y1="110" x2="96" y2="130" stroke="#D97706" stroke-width="1.5"/>
  <line x1="96" y1="150" x2="112" y2="170" stroke="#D97706" stroke-width="1.5"/>
  <line x1="112" y1="150" x2="96" y2="170" stroke="#D97706" stroke-width="1.5"/>
  <!-- Horizontal Jib & Counter-Jib -->
  <rect x="60" y="44" width="160" height="8" rx="2" fill="#F59E0B"/>
  <!-- Counterweight -->
  <rect x="60" y="48" width="20" height="14" rx="2" fill="#334155"/>
  <!-- Operator Cabin & Apex -->
  <polygon points="96,44 104,26 112,44" fill="#D97706"/>
  <rect x="112" y="48" width="14" height="12" rx="2" fill="#93C5FD"/>
  <!-- Hoist Cable & Hook lifting Girder -->
  <line x1="170" y1="52" x2="170" y2="86" stroke="#0F172A" stroke-width="1.5"/>
  <rect x="150" y="86" width="40" height="6" rx="2" fill="#EF4444"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#B45309" text-anchor="middle" letter-spacing="1">UNDER BUILD</text>
  </g>
</svg>`,
};

export const illustrationExcavator: IllustrationDefinition = {
  name: 'excavator',
  title: 'Excavator Heavy Earthmoving',
  category: 'construction',
  tags: [
    'excavator',
    'digger',
    'heavy-machinery',
    'construction',
    'earthmoving',
    'site',
    'foundation',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <ellipse cx="160" cy="188" rx="88" ry="10" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.15))"/>
  <!-- Continuous Track / Treads -->
  <rect x="74" y="160" width="94" height="24" rx="12" fill="#1E293B" stroke="#0F172A" stroke-width="2"/>
  <circle cx="90" cy="172" r="7" fill="#64748B"/>
  <circle cx="110" cy="172" r="7" fill="#64748B"/>
  <circle cx="130" cy="172" r="7" fill="#64748B"/>
  <circle cx="150" cy="172" r="7" fill="#64748B"/>
  <!-- Revolving Cabin Body -->
  <rect x="80" y="126" width="60" height="34" rx="4" fill="#F59E0B"/>
  <rect x="110" y="112" width="36" height="48" rx="4" fill="var(--sp-ill-card, #FFFFFF)" stroke="#D97706" stroke-width="2"/>
  <rect x="116" y="118" width="26" height="20" rx="2" fill="#93C5FD"/>
  <!-- Articulated Boom & Arm -->
  <path d="M140 134L188 78L228 116L246 160" stroke="#F59E0B" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Joints & Hydraulic Cylinders -->
  <circle cx="140" cy="134" r="5" fill="#334155"/>
  <circle cx="188" cy="78" r="5" fill="#334155"/>
  <circle cx="228" cy="116" r="5" fill="#334155"/>
  <!-- Digger Bucket / Scoop -->
  <path d="M246 160L264 164L256 182L236 178Z" fill="#334155"/>
  <!-- Traffic Safety Cones -->
  <polygon points="60,184 66,160 70,160 76,184" fill="#EF4444"/>
  <line x1="62" y1="172" x2="74" y2="172" stroke="#FFFFFF" stroke-width="2"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="202" width="100" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#B45309" text-anchor="middle" letter-spacing="1">EXCAVATING</text>
  </g>
</svg>`,
};

export const illustrationArchitectBlueprint: IllustrationDefinition = {
  name: 'architect-blueprint',
  title: 'Architect Blueprint & Planning',
  category: 'construction',
  tags: ['blueprint', 'architect', 'planning', 'engineering', 'drafting', 'hard-hat', 'design'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(2, 132, 199, 0.12))"/>
  <!-- Blueprint Paper Surface (Cyan/Blue) -->
  <rect x="74" y="60" width="172" height="124" rx="6" fill="#0284C7" stroke="#0369A1" stroke-width="2.5"/>
  <!-- Blueprint Grid -->
  <line x1="88" y1="60" x2="88" y2="184" stroke="#38BDF8" stroke-width="0.8" stroke-opacity="0.4"/>
  <line x1="116" y1="60" x2="116" y2="184" stroke="#38BDF8" stroke-width="0.8" stroke-opacity="0.4"/>
  <line x1="144" y1="60" x2="144" y2="184" stroke="#38BDF8" stroke-width="0.8" stroke-opacity="0.4"/>
  <line x1="172" y1="60" x2="172" y2="184" stroke="#38BDF8" stroke-width="0.8" stroke-opacity="0.4"/>
  <line x1="200" y1="60" x2="200" y2="184" stroke="#38BDF8" stroke-width="0.8" stroke-opacity="0.4"/>
  <line x1="228" y1="60" x2="228" y2="184" stroke="#38BDF8" stroke-width="0.8" stroke-opacity="0.4"/>
  <line x1="74" y1="86" x2="246" y2="86" stroke="#38BDF8" stroke-width="0.8" stroke-opacity="0.4"/>
  <line x1="74" y1="112" x2="246" y2="112" stroke="#38BDF8" stroke-width="0.8" stroke-opacity="0.4"/>
  <line x1="74" y1="138" x2="246" y2="138" stroke="#38BDF8" stroke-width="0.8" stroke-opacity="0.4"/>
  <line x1="74" y1="164" x2="246" y2="164" stroke="#38BDF8" stroke-width="0.8" stroke-opacity="0.4"/>
  <!-- Floorplan Architectural Lines -->
  <rect x="100" y="80" width="80" height="74" fill="none" stroke="#FFFFFF" stroke-width="2"/>
  <rect x="100" y="80" width="36" height="40" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
  <rect x="136" y="80" width="44" height="40" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
  <path d="M100 110C110 110 116 116 116 120" stroke="#FFFFFF" stroke-width="1.5" fill="none" stroke-dasharray="2 2"/>
  <!-- Yellow Hard Hat on Top-Right -->
  <g transform="translate(186, 92)">
    <path d="M10 24C10 8 26 4 36 4C46 4 62 8 62 24H10Z" fill="#FBBF24"/>
    <rect x="6" y="22" width="60" height="6" rx="3" fill="#F59E0B"/>
    <rect x="33" y="6" width="6" height="16" rx="2" fill="#F59E0B"/>
  </g>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="202" width="100" height="24" rx="12" fill="var(--sp-ill-card, #E0F2FE)" stroke="#0284C7" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#0369A1" text-anchor="middle" letter-spacing="1">BLUEPRINT</text>
  </g>
</svg>`,
};

export const illustrationSafetyInspection: IllustrationDefinition = {
  name: 'safety-inspection',
  title: 'Site Safety & Compliance Inspection',
  category: 'construction',
  tags: ['safety', 'inspection', 'vest', 'compliance', 'hazard', 'audit', 'construction', 'osha'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <!-- Safety Vest (High-Vis Neon Green/Orange) -->
  <path d="M110 80L130 68H190L210 80L202 164H118L110 80Z" fill="#84CC16"/>
  <!-- Inner Neckline Cutout -->
  <polygon points="144,68 176,68 160,110" fill="var(--sp-ill-card, #FFFFFF)"/>
  <!-- High-Vis Silver Reflective Strips -->
  <line x1="126" y1="92" x2="194" y2="92" stroke="#FFFFFF" stroke-width="6"/>
  <line x1="122" y1="128" x2="198" y2="128" stroke="#FFFFFF" stroke-width="6"/>
  <line x1="140" y1="92" x2="140" y2="164" stroke="#FFFFFF" stroke-width="5"/>
  <line x1="180" y1="92" x2="180" y2="164" stroke="#FFFFFF" stroke-width="5"/>
  <!-- Clipboard Inspection Passed -->
  <rect x="190" y="96" width="46" height="64" rx="4" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2"/>
  <rect x="204" y="92" width="18" height="6" rx="2" fill="#64748B"/>
  <circle cx="213" cy="126" r="14" fill="#10B981"/>
  <path d="M207 126L211 130L219 122" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Hard Hat at Top Center -->
  <path d="M142 54C142 42 150 38 160 38C170 38 178 42 178 54H142Z" fill="#F59E0B"/>
  <rect x="138" y="52" width="44" height="4" rx="2" fill="#D97706"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#047857" text-anchor="middle" letter-spacing="1">ZERO HAZARD</text>
  </g>
</svg>`,
};

export const illustrationConcreteMixer: IllustrationDefinition = {
  name: 'concrete-mixer',
  title: 'Cement Mixer Truck Foundation',
  category: 'construction',
  tags: ['concrete', 'cement', 'mixer', 'truck', 'foundation', 'pour', 'construction', 'slab'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <ellipse cx="160" cy="188" rx="88" ry="10" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.15))"/>
  <!-- Rotating Drum (Tilted) -->
  <g transform="translate(126, 126) rotate(-16)">
    <polygon points="-50,-24 10,-32 50,0 10,32 -50,24" fill="#F59E0B" stroke="#D97706" stroke-width="2"/>
    <line x1="-30" y1="-26" x2="-30" y2="26" stroke="#FFFFFF" stroke-width="5"/>
    <line x1="10" y1="-32" x2="10" y2="32" stroke="#D97706" stroke-width="3"/>
  </g>
  <!-- Truck Chassis & Cab -->
  <rect x="66" y="152" width="130" height="14" fill="#334155"/>
  <!-- Cab -->
  <path d="M196 126H224L246 148V166H196V126Z" fill="#F59E0B" stroke="#D97706" stroke-width="2"/>
  <polygon points="200,130 220,130 238,148 200,148" fill="#93C5FD"/>
  <!-- Chute Pouring Concrete -->
  <polygon points="76,140 50,166 58,168 84,142" fill="#64748B"/>
  <ellipse cx="50" cy="174" rx="14" ry="4" fill="#94A3B8"/>
  <!-- Wheels -->
  <circle cx="90" cy="168" r="14" fill="#1E293B"/>
  <circle cx="90" cy="168" r="6" fill="#CBD5E1"/>
  <circle cx="120" cy="168" r="14" fill="#1E293B"/>
  <circle cx="120" cy="168" r="6" fill="#CBD5E1"/>
  <circle cx="224" cy="168" r="14" fill="#1E293B"/>
  <circle cx="224" cy="168" r="6" fill="#CBD5E1"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="202" width="100" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#B45309" text-anchor="middle" letter-spacing="1">POURING SLAB</text>
  </g>
</svg>`,
};

export const CONSTRUCTION_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationTowerCrane,
  illustrationExcavator,
  illustrationArchitectBlueprint,
  illustrationSafetyInspection,
  illustrationConcreteMixer,
] as const;
