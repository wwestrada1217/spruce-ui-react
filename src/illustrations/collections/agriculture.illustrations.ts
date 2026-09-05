import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationSmartTractor: IllustrationDefinition = {
  name: 'smart-tractor',
  title: 'Smart Autonomous Tractor',
  category: 'agriculture',
  tags: ['tractor', 'agriculture', 'farm', 'smart-farming', 'autonomous', 'field', 'crops', 'soil'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <ellipse cx="160" cy="188" rx="88" ry="10" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.15))"/>
  <!-- Tilled Furrow Lines on Ground -->
  <line x1="50" y1="184" x2="270" y2="184" stroke="#78350F" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="60" y1="192" x2="260" y2="192" stroke="#92400E" stroke-width="2" stroke-linecap="round"/>
  <!-- Tractor Hood & Engine Body (Spruce Green) -->
  <path d="M148 126H220V166H148V126Z" fill="#15803D" stroke="#166534" stroke-width="2"/>
  <rect x="220" y="132" width="14" height="28" fill="#166534"/>
  <!-- Exhaust Pipe -->
  <line x1="210" y1="126" x2="210" y2="98" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
  <!-- Glass Cab (High Tech) -->
  <path d="M106 104H154V154H106V104Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#166534" stroke-width="2.5"/>
  <rect x="110" y="108" width="40" height="26" rx="2" fill="#93C5FD"/>
  <!-- GPS Antenna Dome on Roof -->
  <ellipse cx="130" cy="100" rx="10" ry="4" fill="#F59E0B"/>
  <circle cx="130" cy="92" r="3" fill="#3B82F6"/>
  <!-- Large Rear Ag Tire -->
  <circle cx="106" cy="164" r="24" fill="#1E293B"/>
  <circle cx="106" cy="164" r="10" fill="#EAB308"/>
  <circle cx="106" cy="164" r="5" fill="#1E293B"/>
  <!-- Small Front Tire -->
  <circle cx="214" cy="168" r="14" fill="#1E293B"/>
  <circle cx="214" cy="168" r="6" fill="#EAB308"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="204" width="110" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <text x="160" y="220" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#047857" text-anchor="middle" letter-spacing="1">AUTONOMOUS</text>
  </g>
</svg>`,
};

export const illustrationCropHarvest: IllustrationDefinition = {
  name: 'crop-harvest',
  title: 'Golden Crop & Wheat Harvest',
  category: 'agriculture',
  tags: ['crop', 'harvest', 'wheat', 'grain', 'agriculture', 'farm', 'yield', 'organic'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.12))"/>
  <!-- Radiant Sun Behind -->
  <circle cx="160" cy="80" r="36" fill="#FDE68A"/>
  <!-- Central Wheat Stalks -->
  <line x1="160" y1="184" x2="160" y2="76" stroke="#D97706" stroke-width="3" stroke-linecap="round"/>
  <!-- Wheat Grains Right -->
  <ellipse cx="168" cy="84" rx="7" ry="4" fill="#F59E0B" transform="rotate(30 168 84)"/>
  <ellipse cx="168" cy="98" rx="7" ry="4" fill="#F59E0B" transform="rotate(30 168 98)"/>
  <ellipse cx="168" cy="112" rx="7" ry="4" fill="#F59E0B" transform="rotate(30 168 112)"/>
  <ellipse cx="168" cy="126" rx="7" ry="4" fill="#F59E0B" transform="rotate(30 168 126)"/>
  <!-- Wheat Grains Left -->
  <ellipse cx="152" cy="84" rx="7" ry="4" fill="#F59E0B" transform="rotate(-30 152 84)"/>
  <ellipse cx="152" cy="98" rx="7" ry="4" fill="#F59E0B" transform="rotate(-30 152 98)"/>
  <ellipse cx="152" cy="112" rx="7" ry="4" fill="#F59E0B" transform="rotate(-30 152 112)"/>
  <ellipse cx="152" cy="126" rx="7" ry="4" fill="#F59E0B" transform="rotate(-30 152 126)"/>
  <!-- Left Stalk Arcing -->
  <path d="M160 184C140 160 120 134 116 100" stroke="#D97706" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="118" cy="104" rx="6" ry="3.5" fill="#FBBF24" transform="rotate(40 118 104)"/>
  <ellipse cx="122" cy="118" rx="6" ry="3.5" fill="#FBBF24" transform="rotate(40 122 118)"/>
  <ellipse cx="128" cy="132" rx="6" ry="3.5" fill="#FBBF24" transform="rotate(40 128 132)"/>
  <!-- Right Stalk Arcing -->
  <path d="M160 184C180 160 200 134 204 100" stroke="#D97706" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="202" cy="104" rx="6" ry="3.5" fill="#FBBF24" transform="rotate(-40 202 104)"/>
  <ellipse cx="198" cy="118" rx="6" ry="3.5" fill="#FBBF24" transform="rotate(-40 198 118)"/>
  <ellipse cx="192" cy="132" rx="6" ry="3.5" fill="#FBBF24" transform="rotate(-40 192 132)"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="204" width="100" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B" stroke-width="1.5"/>
    <text x="160" y="220" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#B45309" text-anchor="middle" letter-spacing="1">HARVEST</text>
  </g>
</svg>`,
};

export const illustrationGreenhouse: IllustrationDefinition = {
  name: 'greenhouse',
  title: 'Smart Greenhouse & Hydroponics',
  category: 'agriculture',
  tags: [
    'greenhouse',
    'hydroponics',
    'smart-farm',
    'plants',
    'agriculture',
    'vertical-farming',
    'eco',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <!-- Greenhouse Glass Frame Structure -->
  <polygon points="160,52 230,94 230,174 90,174 90,94" fill="var(--sp-ill-card, #FFFFFF)" stroke="#166534" stroke-width="2.5"/>
  <!-- Internal Glass Ribs -->
  <line x1="160" y1="52" x2="160" y2="174" stroke="#86EFAC" stroke-width="1.5"/>
  <line x1="125" y1="73" x2="125" y2="174" stroke="#86EFAC" stroke-width="1.5"/>
  <line x1="195" y1="73" x2="195" y2="174" stroke="#86EFAC" stroke-width="1.5"/>
  <line x1="90" y1="124" x2="230" y2="124" stroke="#86EFAC" stroke-width="1.5"/>
  <!-- Vertical Hydroponic Trays -->
  <rect x="104" y="146" width="34" height="10" rx="2" fill="#15803D"/>
  <circle cx="112" cy="140" r="5" fill="#22C55E"/>
  <circle cx="121" cy="138" r="5" fill="#16A34A"/>
  <circle cx="130" cy="140" r="5" fill="#22C55E"/>
  <rect x="182" y="146" width="34" height="10" rx="2" fill="#15803D"/>
  <circle cx="190" cy="140" r="5" fill="#22C55E"/>
  <circle cx="199" cy="138" r="5" fill="#16A34A"/>
  <circle cx="208" cy="140" r="5" fill="#22C55E"/>
  <rect x="143" y="152" width="34" height="10" rx="2" fill="#15803D"/>
  <circle cx="151" cy="146" r="5" fill="#22C55E"/>
  <circle cx="160" cy="144" r="5" fill="#16A34A"/>
  <circle cx="169" cy="146" r="5" fill="#22C55E"/>
  <!-- IoT Environmental Sensor on Peak -->
  <circle cx="160" cy="46" r="6" fill="#3B82F6"/>
  <path d="M152 40C156 36 164 36 168 40" stroke="#60A5FA" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="204" width="110" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <text x="160" y="220" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#047857" text-anchor="middle" letter-spacing="1">HYDROPONIC</text>
  </g>
</svg>`,
};

export const illustrationFarmSilo: IllustrationDefinition = {
  name: 'farm-silo',
  title: 'Farm Silo & Grain Storage',
  category: 'agriculture',
  tags: ['silo', 'barn', 'farm', 'storage', 'grain', 'agriculture', 'rural', 'harvest'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(239, 68, 68, 0.12))"/>
  <!-- Classic Red Barn Body -->
  <polygon points="150,96 195,68 240,96 240,174 150,174" fill="#DC2626" stroke="#991B1B" stroke-width="2"/>
  <!-- Barn Door with White X -->
  <rect x="175" y="128" width="40" height="46" fill="#991B1B"/>
  <line x1="175" y1="128" x2="215" y2="174" stroke="#FFFFFF" stroke-width="2.5"/>
  <line x1="215" y1="128" x2="175" y2="174" stroke="#FFFFFF" stroke-width="2.5"/>
  <!-- Round Grain Silo with Metal Dome -->
  <path d="M84 76C84 62 124 62 124 76V174H84V76Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#475569" stroke-width="2.5"/>
  <path d="M84 76C84 64 124 64 124 76" fill="#94A3B8"/>
  <!-- Silo Corrugation Rings -->
  <line x1="84" y1="96" x2="124" y2="96" stroke="#CBD5E1" stroke-width="1.5"/>
  <line x1="84" y1="116" x2="124" y2="116" stroke="#CBD5E1" stroke-width="1.5"/>
  <line x1="84" y1="136" x2="124" y2="136" stroke="#CBD5E1" stroke-width="1.5"/>
  <line x1="84" y1="156" x2="124" y2="156" stroke="#CBD5E1" stroke-width="1.5"/>
  <!-- Windmill in Background -->
  <line x1="140" y1="174" x2="140" y2="70" stroke="#64748B" stroke-width="2"/>
  <circle cx="140" cy="70" r="3" fill="#0F172A"/>
  <line x1="140" y1="70" x2="125" y2="55" stroke="#94A3B8" stroke-width="1.5"/>
  <line x1="140" y1="70" x2="155" y2="55" stroke="#94A3B8" stroke-width="1.5"/>
  <line x1="140" y1="70" x2="140" y2="90" stroke="#94A3B8" stroke-width="1.5"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="204" width="100" height="24" rx="12" fill="var(--sp-ill-card, #FEE2E2)" stroke="#EF4444" stroke-width="1.5"/>
    <text x="160" y="220" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#B91C1C" text-anchor="middle" letter-spacing="1">GRAIN STORAGE</text>
  </g>
</svg>`,
};

export const illustrationAgriDrone: IllustrationDefinition = {
  name: 'agri-drone',
  title: 'Agricultural Survey Drone',
  category: 'agriculture',
  tags: ['drone', 'agriculture', 'survey', 'ndvi', 'aerial', 'smart-farm', 'sensors', 'monitoring'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <!-- Drone Central Fuselage -->
  <ellipse cx="160" cy="86" rx="26" ry="16" fill="var(--sp-ill-card, #FFFFFF)" stroke="#166534" stroke-width="2"/>
  <!-- Multispectral Camera Sensor Lens -->
  <circle cx="160" cy="94" r="6" fill="#0284C7"/>
  <circle cx="160" cy="94" r="2.5" fill="#38BDF8"/>
  <!-- 4 Drone Rotor Arms -->
  <line x1="142" y1="76" x2="108" y2="58" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
  <line x1="178" y1="76" x2="212" y2="58" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
  <line x1="142" y1="96" x2="108" y2="114" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
  <line x1="178" y1="96" x2="212" y2="114" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
  <!-- Rotor Motors & Spinning Blurs -->
  <ellipse cx="108" cy="58" rx="22" ry="4" fill="#64748B" fill-opacity="0.3"/>
  <circle cx="108" cy="58" r="4" fill="#0F172A"/>
  <ellipse cx="212" cy="58" rx="22" ry="4" fill="#64748B" fill-opacity="0.3"/>
  <circle cx="212" cy="58" r="4" fill="#0F172A"/>
  <ellipse cx="108" cy="114" rx="22" ry="4" fill="#64748B" fill-opacity="0.3"/>
  <circle cx="108" cy="114" r="4" fill="#0F172A"/>
  <ellipse cx="212" cy="114" rx="22" ry="4" fill="#64748B" fill-opacity="0.3"/>
  <circle cx="212" cy="114" r="4" fill="#0F172A"/>
  <!-- Conical Scanning Sensor Beams -->
  <polygon points="160,98 90,174 230,174" fill="#10B981" fill-opacity="0.12"/>
  <line x1="160" y1="98" x2="90" y2="174" stroke="#10B981" stroke-width="1.5" stroke-dasharray="3 3"/>
  <line x1="160" y1="98" x2="230" y2="174" stroke="#10B981" stroke-width="1.5" stroke-dasharray="3 3"/>
  <!-- Field Rows at Ground Level -->
  <path d="M100 174C130 166 190 166 220 174" stroke="#16A34A" stroke-width="3" stroke-linecap="round"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="204" width="110" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <text x="160" y="220" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#047857" text-anchor="middle" letter-spacing="1">AERIAL SCAN</text>
  </g>
</svg>`,
};

export const AGRICULTURE_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationSmartTractor,
  illustrationCropHarvest,
  illustrationGreenhouse,
  illustrationFarmSilo,
  illustrationAgriDrone,
] as const;
