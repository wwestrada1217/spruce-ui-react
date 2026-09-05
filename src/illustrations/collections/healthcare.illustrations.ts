import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationStethoscopeHeart: IllustrationDefinition = {
  name: 'stethoscope-heart',
  title: 'Stethoscope & Vital Heart',
  category: 'healthcare',
  tags: [
    'stethoscope',
    'heart',
    'cardiology',
    'medicine',
    'healthcare',
    'pulse',
    'vital',
    'doctor',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(239, 68, 68, 0.12))"/>
  <!-- Central Red Heart -->
  <path d="M160 86C148 70 124 70 114 86C100 108 130 138 160 160C190 138 220 108 206 86C196 70 172 70 160 86Z" fill="#EF4444"/>
  <!-- ECG Heartbeat Line on Heart -->
  <path d="M124 116H142L148 104L156 128L164 110L170 120L176 116H196" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Stethoscope Binaural Loop -->
  <path d="M130 52C130 46 142 42 160 42C178 42 190 46 190 52V76C190 84 176 96 160 96C144 96 130 84 130 76V52Z" fill="none" stroke="#64748B" stroke-width="3"/>
  <circle cx="130" cy="50" r="3" fill="#0F172A"/>
  <circle cx="190" cy="50" r="3" fill="#0F172A"/>
  <!-- Stethoscope Flexible Tube around Heart -->
  <path d="M160 96V140C160 164 196 172 206 150C214 132 202 120 196 120" fill="none" stroke="#3B82F6" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Chest Piece / Diaphragm -->
  <circle cx="196" cy="120" r="10" fill="#94A3B8" stroke="#334155" stroke-width="2"/>
  <circle cx="196" cy="120" r="5" fill="#3B82F6"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #FEF2F2)" stroke="#EF4444" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#DC2626" text-anchor="middle" letter-spacing="1">CARDIOLOGY</text>
  </g>
</svg>`,
};

export const illustrationHospitalClinic: IllustrationDefinition = {
  name: 'hospital-clinic',
  title: 'Hospital & Emergency Clinic',
  category: 'healthcare',
  tags: ['hospital', 'clinic', 'emergency', 'medical', 'healthcare', 'care', 'ambulance', 'center'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(59, 130, 246, 0.12))"/>
  <!-- Hospital Main Facility -->
  <rect x="80" y="60" width="160" height="114" rx="6" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <!-- Medical Red Cross in Header -->
  <rect x="144" y="68" width="32" height="32" rx="4" fill="#EF4444"/>
  <rect x="156" y="74" width="8" height="20" rx="1" fill="#FFFFFF"/>
  <rect x="150" y="80" width="20" height="8" rx="1" fill="#FFFFFF"/>
  <!-- Clinic Window Matrix -->
  <rect x="96" y="80" width="18" height="16" rx="2" fill="#93C5FD"/>
  <rect x="120" y="80" width="18" height="16" rx="2" fill="#93C5FD"/>
  <rect x="182" y="80" width="18" height="16" rx="2" fill="#93C5FD"/>
  <rect x="206" y="80" width="18" height="16" rx="2" fill="#93C5FD"/>
  <rect x="96" y="108" width="18" height="16" rx="2" fill="#93C5FD"/>
  <rect x="120" y="108" width="18" height="16" rx="2" fill="#93C5FD"/>
  <rect x="182" y="108" width="18" height="16" rx="2" fill="#93C5FD"/>
  <rect x="206" y="108" width="18" height="16" rx="2" fill="#93C5FD"/>
  <!-- Emergency Glass Sliding Entrance -->
  <rect x="144" y="134" width="32" height="40" rx="2" fill="#0284C7"/>
  <line x1="160" y1="134" x2="160" y2="174" stroke="#FFFFFF" stroke-width="2"/>
  <!-- Ambulance Heartbeat Sign -->
  <line x1="60" y1="174" x2="260" y2="174" stroke="#64748B" stroke-width="2.5"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #EFF6FF)" stroke="#3B82F6" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#1D4ED8" text-anchor="middle" letter-spacing="1">CLINICAL CARE</text>
  </g>
</svg>`,
};

export const illustrationPharmaMedicine: IllustrationDefinition = {
  name: 'pharma-medicine',
  title: 'Pharmacy & Medical Prescriptions',
  category: 'healthcare',
  tags: [
    'pharmacy',
    'medicine',
    'pills',
    'capsules',
    'prescription',
    'pharma',
    'health',
    'tablets',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <!-- Medicine Bottle -->
  <rect x="90" y="60" width="70" height="114" rx="8" fill="#F59E0B" stroke="#D97706" stroke-width="2"/>
  <rect x="100" y="52" width="50" height="12" rx="3" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2"/>
  <!-- Bottle Label -->
  <rect x="90" y="90" width="70" height="56" fill="var(--sp-ill-card, #FFFFFF)"/>
  <rect x="100" y="98" width="16" height="16" rx="2" fill="#10B981"/>
  <path d="M104 106L107 109L113 103" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="122" y1="102" x2="152" y2="102" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
  <line x1="100" y1="124" x2="150" y2="124" stroke="#CBD5E1" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="100" y1="134" x2="138" y2="134" stroke="#CBD5E1" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Blister Pack on Right -->
  <rect x="180" y="74" width="56" height="84" rx="4" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
  <circle cx="194" cy="92" r="8" fill="#3B82F6"/>
  <circle cx="222" cy="92" r="8" fill="#3B82F6"/>
  <circle cx="194" cy="116" r="8" fill="#3B82F6"/>
  <circle cx="222" cy="116" r="8" fill="#3B82F6"/>
  <circle cx="194" cy="140" r="8" fill="#3B82F6"/>
  <circle cx="222" cy="140" r="8" fill="#3B82F6"/>
  <!-- Floating Capsule in Foreground -->
  <g transform="translate(160, 150) rotate(35)">
    <rect x="-10" y="-20" width="20" height="20" rx="10" fill="#EF4444"/>
    <rect x="-10" y="0" width="20" height="20" rx="10" fill="var(--sp-ill-card, #FFFFFF)" stroke="#CBD5E1" stroke-width="1"/>
  </g>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="202" width="100" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#047857" text-anchor="middle" letter-spacing="1">PHARMACY</text>
  </g>
</svg>`,
};

export const illustrationDoctorConsultation: IllustrationDefinition = {
  name: 'doctor-consultation',
  title: 'Telehealth & Virtual Doctor',
  category: 'healthcare',
  tags: ['telehealth', 'doctor', 'consultation', 'virtual-care', 'patient', 'video', 'healthcare'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(2, 132, 199, 0.12))"/>
  <!-- Tablet Display Screen -->
  <rect x="90" y="48" width="140" height="126" rx="10" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <rect x="98" y="58" width="124" height="106" rx="4" fill="#F0F9FF"/>
  <!-- Camera Dot -->
  <circle cx="160" cy="53" r="2" fill="#64748B"/>
  <!-- Doctor Avatar on Screen -->
  <circle cx="160" cy="94" r="16" fill="#FED7AA"/>
  <!-- Doctor Hair -->
  <path d="M146 86C146 76 154 74 160 74C166 74 174 76 174 86C170 84 164 84 160 86C156 84 150 84 146 86Z" fill="#1E293B"/>
  <!-- White Doctor Coat & Stethoscope -->
  <path d="M142 110C142 110 148 106 160 106C172 106 178 110 178 110L186 164H134L142 110Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
  <polygon points="154,106 166,106 162,126 158,126" fill="#3B82F6"/>
  <path d="M152 110V128L158 132" stroke="#0284C7" stroke-width="2" stroke-linecap="round"/>
  <!-- Live Call Floating Status -->
  <rect x="180" y="66" width="34" height="12" rx="6" fill="#10B981"/>
  <text x="197" y="75" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="7" fill="#FFFFFF" text-anchor="middle">LIVE</text>
  <!-- Rx Prescription Clipboard on Side -->
  <rect x="216" y="112" width="32" height="42" rx="3" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="1.5"/>
  <text x="224" y="126" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="9" fill="#0284C7">Rx</text>
  <line x1="222" y1="134" x2="242" y2="134" stroke="#94A3B8" stroke-width="1"/>
  <line x1="222" y1="140" x2="238" y2="140" stroke="#94A3B8" stroke-width="1"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #F0F9FF)" stroke="#0284C7" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#0369A1" text-anchor="middle" letter-spacing="1">TELEHEALTH</text>
  </g>
</svg>`,
};

export const illustrationMedicalLabTest: IllustrationDefinition = {
  name: 'medical-lab-test',
  title: 'Diagnostic Lab Test & Analysis',
  category: 'healthcare',
  tags: ['lab', 'test', 'blood-test', 'diagnostics', 'tubes', 'analysis', 'medical', 'pathology'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <!-- Test Tube Rack -->
  <rect x="80" y="130" width="160" height="44" rx="4" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <line x1="80" y1="146" x2="240" y2="146" stroke="#E2E8F0" stroke-width="2"/>
  <!-- Test Tube 1 (Red / Blood) -->
  <rect x="100" y="70" width="18" height="74" rx="9" fill="none" stroke="#64748B" stroke-width="2"/>
  <rect x="100" y="66" width="18" height="8" rx="2" fill="#EF4444"/>
  <rect x="102" y="100" width="14" height="42" rx="7" fill="#EF4444"/>
  <!-- Test Tube 2 (Blue / Plasma) -->
  <rect x="134" y="70" width="18" height="74" rx="9" fill="none" stroke="#64748B" stroke-width="2"/>
  <rect x="134" y="66" width="18" height="8" rx="2" fill="#3B82F6"/>
  <rect x="136" y="112" width="14" height="30" rx="7" fill="#3B82F6"/>
  <!-- Test Tube 3 (Yellow / Serum) -->
  <rect x="168" y="70" width="18" height="74" rx="9" fill="none" stroke="#64748B" stroke-width="2"/>
  <rect x="168" y="66" width="18" height="8" rx="2" fill="#F59E0B"/>
  <rect x="170" y="94" width="14" height="48" rx="7" fill="#F59E0B"/>
  <!-- Test Tube 4 (Green / Culture) -->
  <rect x="202" y="70" width="18" height="74" rx="9" fill="none" stroke="#64748B" stroke-width="2"/>
  <rect x="202" y="66" width="18" height="8" rx="2" fill="#10B981"/>
  <rect x="204" y="118" width="14" height="24" rx="7" fill="#10B981"/>
  <!-- Verified Diagnostic Stamp -->
  <circle cx="230" cy="74" r="16" fill="#10B981"/>
  <path d="M222 74L228 80L238 68" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#047857" text-anchor="middle" letter-spacing="1">DIAGNOSTIC</text>
  </g>
</svg>`,
};

export const HEALTHCARE_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationStethoscopeHeart,
  illustrationHospitalClinic,
  illustrationPharmaMedicine,
  illustrationDoctorConsultation,
  illustrationMedicalLabTest,
] as const;
