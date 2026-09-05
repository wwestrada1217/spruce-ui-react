import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationLabFlask: IllustrationDefinition = {
  name: 'lab-flask',
  title: 'Laboratory Chemistry Flask',
  category: 'science',
  tags: [
    'science',
    'chemistry',
    'flask',
    'laboratory',
    'experiment',
    'beaker',
    'research',
    'chemical',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <defs>
      <linearGradient id="flaskLiquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0284C7" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#0369A1" stop-opacity="0.95"/>
      </linearGradient>
      <linearGradient id="flaskGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--sp-ill-card, #FFFFFF)" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="var(--sp-ill-card-border, #E2E8F0)" stop-opacity="0.3"/>
      </linearGradient>
    </defs>
    <ellipse cx="160" cy="180" rx="90" ry="24" fill="var(--sp-ill-halo, rgba(14,165,233,0.12))"/>
    <circle cx="160" cy="120" r="76" fill="var(--sp-ill-halo, rgba(14,165,233,0.06))"/>
    <!-- Molecular bonds background -->
    <g stroke="var(--sp-ill-line, #CBD5E1)" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.7">
      <line x1="80" y1="70" x2="110" y2="50"/>
      <line x1="110" y1="50" x2="140" y2="65"/>
      <line x1="210" y1="65" x2="240" y2="50"/>
      <line x1="240" y1="50" x2="270" y2="70"/>
    </g>
    <circle cx="80" cy="70" r="4" fill="#0EA5E9"/>
    <circle cx="110" cy="50" r="5" fill="#38BDF8"/>
    <circle cx="140" cy="65" r="4" fill="#0284C7"/>
    <circle cx="210" cy="65" r="4" fill="#0284C7"/>
    <circle cx="240" cy="50" r="5" fill="#38BDF8"/>
    <circle cx="270" cy="70" r="4" fill="#0EA5E9"/>
    <!-- Lab Stand & Base -->
    <rect x="75" y="195" width="170" height="8" rx="4" fill="var(--sp-ill-border, #94A3B8)"/>
    <rect x="90" y="55" width="6" height="142" rx="3" fill="var(--sp-ill-border, #94A3B8)"/>
    <rect x="90" y="85" width="45" height="5" rx="2" fill="var(--sp-ill-line, #CBD5E1)"/>
    <circle cx="135" cy="87.5" r="7" stroke="var(--sp-ill-border, #94A3B8)" stroke-width="3" fill="none"/>
    <!-- Erlenmeyer Flask Body -->
    <path d="M148 60 L148 95 L112 170 C108 178 114 188 123 188 L197 188 C206 188 212 178 208 170 L172 95 L172 60 Z" fill="url(#flaskGlassGrad)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
    <!-- Liquid in Flask -->
    <path d="M124 145 Q160 148 196 145 L202 174 C205 180 200 186 194 186 L126 186 C120 186 115 180 118 174 Z" fill="url(#flaskLiquidGrad)"/>
    <!-- Liquid surface wave -->
    <path d="M124 145 C140 142 150 148 165 145 C180 142 190 148 196 145" stroke="#BAE6FD" stroke-width="2" fill="none"/>
    <!-- Bubbles inside flask -->
    <circle cx="150" cy="165" r="4" fill="#BAE6FD" opacity="0.8"/>
    <circle cx="168" cy="155" r="3" fill="#BAE6FD" opacity="0.9"/>
    <circle cx="140" cy="172" r="2.5" fill="#BAE6FD" opacity="0.7"/>
    <circle cx="178" cy="168" r="3.5" fill="#BAE6FD" opacity="0.75"/>
    <circle cx="158" cy="130" r="3" fill="#38BDF8" opacity="0.6"/>
    <circle cx="164" cy="115" r="2.5" fill="#38BDF8" opacity="0.5"/>
    <!-- Flask Lip & Measurement Lines -->
    <rect x="144" y="56" width="32" height="6" rx="3" fill="var(--sp-ill-line, #CBD5E1)"/>
    <line x1="166" y1="125" x2="174" y2="125" stroke="var(--sp-ill-muted, #94A3B8)" stroke-width="1.5"/>
    <line x1="164" y1="140" x2="176" y2="140" stroke="var(--sp-ill-muted, #94A3B8)" stroke-width="1.5"/>
    <line x1="160" y1="155" x2="178" y2="155" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
    <line x1="156" y1="170" x2="182" y2="170" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
    <!-- Test Tube Beside -->
    <rect x="222" y="110" width="14" height="68" rx="7" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
    <path d="M224 140 L224 171 C224 175 227 176 229 176 C231 176 234 175 234 171 L234 140 Z" fill="#F59E0B"/>
    <rect x="220" y="108" width="18" height="4" rx="2" fill="var(--sp-ill-line, #CBD5E1)"/>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="88" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(14,165,233,0.12))" stroke="var(--sp-ill-tag-border, #38BDF8)" stroke-width="1"/>
      <text x="56" y="29" fill="var(--sp-ill-tag-text, #0284C7)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">CHEMISTRY</text>
    </g>
  </svg>`,
};

export const illustrationDnaGenetics: IllustrationDefinition = {
  name: 'dna-genetics',
  title: 'DNA Double Helix & Genetics',
  category: 'science',
  tags: ['science', 'genetics', 'dna', 'biology', 'genome', 'sequencing', 'biotech'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <defs>
      <linearGradient id="dnaStrand1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0284C7"/>
        <stop offset="100%" stop-color="#6366F1"/>
      </linearGradient>
      <linearGradient id="dnaStrand2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#EC4899"/>
        <stop offset="100%" stop-color="#8B5CF6"/>
      </linearGradient>
    </defs>
    <ellipse cx="160" cy="195" rx="85" ry="20" fill="var(--sp-ill-halo, rgba(99,102,241,0.12))"/>
    <circle cx="160" cy="120" r="75" fill="var(--sp-ill-halo, rgba(99,102,241,0.06))"/>
    <!-- Sequencing Grid Background -->
    <g fill="var(--sp-ill-muted, #94A3B8)" opacity="0.35" font-size="8" font-family="monospace">
      <text x="40" y="70">A-T</text>
      <text x="40" y="95">C-G</text>
      <text x="40" y="120">T-A</text>
      <text x="40" y="145">G-C</text>
      <text x="40" y="170">A-T</text>
      <text x="260" y="70">G-C</text>
      <text x="260" y="95">A-T</text>
      <text x="260" y="120">T-A</text>
      <text x="260" y="145">C-G</text>
      <text x="260" y="170">G-C</text>
    </g>
    <!-- Base pair rungs (Horizontal connecting lines with nodes) -->
    <g stroke-width="2.5">
      <line x1="125" y1="52" x2="195" y2="52" stroke="#0284C7"/>
      <circle cx="140" cy="52" r="3.5" fill="#38BDF8"/>
      <circle cx="180" cy="52" r="3.5" fill="#F43F5E"/>
      <line x1="135" y1="72" x2="185" y2="72" stroke="var(--sp-ill-line, #CBD5E1)"/>
      <circle cx="145" cy="72" r="3" fill="#10B981"/>
      <circle cx="175" cy="72" r="3" fill="#F59E0B"/>
      <line x1="150" y1="92" x2="170" y2="92" stroke="#6366F1"/>
      <circle cx="155" cy="92" r="3" fill="#6366F1"/>
      <circle cx="165" cy="92" r="3" fill="#EC4899"/>
      <line x1="135" y1="112" x2="185" y2="112" stroke="var(--sp-ill-line, #CBD5E1)"/>
      <circle cx="145" cy="112" r="3" fill="#F43F5E"/>
      <circle cx="175" cy="112" r="3" fill="#38BDF8"/>
      <line x1="125" y1="132" x2="195" y2="132" stroke="#0284C7"/>
      <circle cx="140" cy="132" r="3.5" fill="#10B981"/>
      <circle cx="180" cy="132" r="3.5" fill="#F59E0B"/>
      <line x1="135" y1="152" x2="185" y2="152" stroke="var(--sp-ill-line, #CBD5E1)"/>
      <circle cx="145" cy="152" r="3" fill="#6366F1"/>
      <circle cx="175" cy="152" r="3" fill="#EC4899"/>
      <line x1="150" y1="172" x2="170" y2="172" stroke="#6366F1"/>
      <circle cx="155" cy="172" r="3" fill="#38BDF8"/>
      <circle cx="165" cy="172" r="3" fill="#F43F5E"/>
      <line x1="135" y1="192" x2="185" y2="192" stroke="var(--sp-ill-line, #CBD5E1)"/>
      <circle cx="145" cy="192" r="3" fill="#F59E0B"/>
      <circle cx="175" cy="192" r="3" fill="#10B981"/>
    </g>
    <!-- Left Sinusoidal Ribbon Strand -->
    <path d="M125 45 C115 70 205 75 195 100 C185 125 95 130 125 155 C155 180 195 185 185 205" fill="none" stroke="url(#dnaStrand1)" stroke-width="6" stroke-linecap="round"/>
    <!-- Right Sinusoidal Ribbon Strand -->
    <path d="M195 45 C205 70 115 75 125 100 C135 125 225 130 195 155 C165 180 125 185 135 205" fill="none" stroke="url(#dnaStrand2)" stroke-width="6" stroke-linecap="round"/>
    <!-- Floating science nodes -->
    <circle cx="85" cy="140" r="5" fill="#6366F1" opacity="0.7"/>
    <circle cx="235" cy="85" r="5" fill="#EC4899" opacity="0.7"/>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="80" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(99,102,241,0.12))" stroke="var(--sp-ill-tag-border, #818CF8)" stroke-width="1"/>
      <text x="52" y="29" fill="var(--sp-ill-tag-text, #4F46E5)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">GENETICS</text>
    </g>
  </svg>`,
};

export const illustrationAtomPhysics: IllustrationDefinition = {
  name: 'atom-physics',
  title: 'Atomic Structure & Quantum Physics',
  category: 'science',
  tags: ['science', 'physics', 'atom', 'quantum', 'nuclear', 'electron', 'particle', 'research'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <defs>
      <linearGradient id="atomCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38BDF8"/>
        <stop offset="100%" stop-color="#0284C7"/>
      </linearGradient>
    </defs>
    <ellipse cx="160" cy="195" rx="85" ry="18" fill="var(--sp-ill-halo, rgba(14,165,233,0.12))"/>
    <circle cx="160" cy="120" r="85" fill="var(--sp-ill-halo, rgba(14,165,233,0.06))"/>
    <!-- Energy field waves -->
    <circle cx="160" cy="120" r="68" fill="none" stroke="var(--sp-ill-line, #E2E8F0)" stroke-width="1.5" stroke-dasharray="4,4"/>
    <circle cx="160" cy="120" r="92" fill="none" stroke="var(--sp-ill-line, #E2E8F0)" stroke-width="1" stroke-dasharray="6,6"/>
    <!-- Elliptical Electron Orbit 1 (Horizontal tilt) -->
    <ellipse cx="160" cy="120" rx="85" ry="30" fill="none" stroke="#38BDF8" stroke-width="2.5" transform="rotate(0 160 120)"/>
    <circle cx="245" cy="120" r="6" fill="#0284C7"/>
    <circle cx="245" cy="120" r="3" fill="#FFFFFF"/>
    <!-- Elliptical Electron Orbit 2 (60 deg tilt) -->
    <ellipse cx="160" cy="120" rx="85" ry="30" fill="none" stroke="#6366F1" stroke-width="2.5" transform="rotate(60 160 120)"/>
    <circle cx="118" cy="193" r="6" fill="#4F46E5"/>
    <circle cx="118" cy="193" r="3" fill="#FFFFFF"/>
    <!-- Elliptical Electron Orbit 3 (-60 deg tilt) -->
    <ellipse cx="160" cy="120" rx="85" ry="30" fill="none" stroke="#EC4899" stroke-width="2.5" transform="rotate(-60 160 120)"/>
    <circle cx="118" cy="47" r="6" fill="#DB2777"/>
    <circle cx="118" cy="47" r="3" fill="#FFFFFF"/>
    <!-- Nucleus Protons & Neutrons Cluster -->
    <circle cx="152" cy="114" r="11" fill="#0284C7"/>
    <circle cx="168" cy="114" r="11" fill="#6366F1"/>
    <circle cx="160" cy="128" r="11" fill="#0EA5E9"/>
    <circle cx="153" cy="124" r="9" fill="#EC4899"/>
    <circle cx="166" cy="125" r="9" fill="#38BDF8"/>
    <!-- Quantum particle sparkles -->
    <polygon points="70,75 73,81 79,84 73,87 70,93 67,87 61,84 67,81" fill="#38BDF8"/>
    <polygon points="255,160 257,165 262,167 257,169 255,174 253,169 248,167 253,165" fill="#818CF8"/>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="76" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(14,165,233,0.12))" stroke="var(--sp-ill-tag-border, #38BDF8)" stroke-width="1"/>
      <text x="50" y="29" fill="var(--sp-ill-tag-text, #0284C7)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">PHYSICS</text>
    </g>
  </svg>`,
};

export const illustrationSpaceTelescope: IllustrationDefinition = {
  name: 'space-telescope',
  title: 'Space Telescope & Astronomy',
  category: 'science',
  tags: ['science', 'astronomy', 'telescope', 'space', 'stars', 'observatory', 'cosmos'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="205" rx="85" ry="18" fill="var(--sp-ill-halo, rgba(99,102,241,0.12))"/>
    <!-- Constellation Stars & Lines -->
    <g stroke="var(--sp-ill-line, #CBD5E1)" stroke-width="1" stroke-dasharray="2,3" opacity="0.6">
      <line x1="210" y1="45" x2="250" y2="35"/>
      <line x1="250" y1="35" x2="280" y2="60"/>
      <line x1="280" y1="60" x2="255" y2="85"/>
      <line x1="255" y1="85" x2="210" y2="45"/>
    </g>
    <circle cx="210" cy="45" r="3.5" fill="#FBBF24"/>
    <circle cx="250" cy="35" r="4.5" fill="#F59E0B"/>
    <circle cx="280" cy="60" r="3" fill="#FCD34D"/>
    <circle cx="255" cy="85" r="4" fill="#F59E0B"/>
    <!-- Crescent Moon/Planet -->
    <path d="M60 55 A 18 18 0 0 0 78 73 A 15 15 0 1 1 60 55 Z" fill="#6366F1" opacity="0.85"/>
    <circle cx="75" cy="65" r="2" fill="#BAE6FD" opacity="0.6"/>
    <!-- Celestial Orbit Arc -->
    <path d="M45 125 Q 160 50 285 105" fill="none" stroke="var(--sp-ill-line, #E2E8F0)" stroke-width="1.5" stroke-dasharray="4,4"/>
    <!-- Telescope Tripod Base -->
    <line x1="150" y1="140" x2="110" y2="208" stroke="var(--sp-ill-border, #64748B)" stroke-width="5" stroke-linecap="round"/>
    <line x1="155" y1="140" x2="155" y2="212" stroke="var(--sp-ill-border, #475569)" stroke-width="5" stroke-linecap="round"/>
    <line x1="160" y1="140" x2="200" y2="208" stroke="var(--sp-ill-border, #64748B)" stroke-width="5" stroke-linecap="round"/>
    <!-- Tripod Brace -->
    <path d="M125 180 L185 180" stroke="var(--sp-ill-line, #94A3B8)" stroke-width="2.5"/>
    <!-- Mount Axis -->
    <circle cx="155" cy="138" r="9" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #94A3B8)" stroke-width="3"/>
    <!-- Telescope Optical Tube (Angle 35 deg upwards) -->
    <g transform="rotate(-35 155 138)">
      <!-- Main Optical Barrel -->
      <rect x="100" y="128" width="120" height="20" rx="4" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
      <rect x="210" y="125" width="16" height="26" rx="3" fill="#0284C7"/>
      <!-- Lens Hood Ring -->
      <rect x="224" y="124" width="6" height="28" rx="2" fill="#38BDF8"/>
      <!-- Eyepiece / Finder Scope -->
      <rect x="110" y="116" width="40" height="8" rx="2" fill="var(--sp-ill-muted, #64748B)"/>
      <line x1="120" y1="124" x2="120" y2="128" stroke="var(--sp-ill-muted, #64748B)" stroke-width="2"/>
      <line x1="140" y1="124" x2="140" y2="128" stroke="var(--sp-ill-muted, #64748B)" stroke-width="2"/>
      <rect x="92" y="132" width="12" height="12" rx="2" fill="#334155"/>
      <!-- Accent Stripe -->
      <rect x="160" y="128" width="14" height="20" fill="#0EA5E9"/>
    </g>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="94" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(99,102,241,0.12))" stroke="var(--sp-ill-tag-border, #818CF8)" stroke-width="1"/>
      <text x="59" y="29" fill="var(--sp-ill-tag-text, #4F46E5)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">ASTRONOMY</text>
    </g>
  </svg>`,
};

export const illustrationMicrobiology: IllustrationDefinition = {
  name: 'microbiology',
  title: 'Microbiology & Microscopy',
  category: 'science',
  tags: ['science', 'microbiology', 'microscope', 'cells', 'biology', 'laboratory', 'petri-dish'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="195" rx="88" ry="20" fill="var(--sp-ill-halo, rgba(16,185,129,0.12))"/>
    <circle cx="160" cy="115" r="75" fill="var(--sp-ill-halo, rgba(16,185,129,0.06))"/>
    <!-- Petri Dish on Right -->
    <ellipse cx="230" cy="180" rx="38" ry="16" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
    <ellipse cx="230" cy="178" rx="34" ry="13" fill="rgba(16,185,129,0.12)"/>
    <!-- Bacterial colonies -->
    <circle cx="225" cy="176" r="4.5" fill="#10B981"/>
    <circle cx="240" cy="174" r="3.5" fill="#34D399"/>
    <circle cx="232" cy="183" r="5" fill="#059669"/>
    <circle cx="218" cy="181" r="3" fill="#6EE7B7"/>
    <!-- Microscope Heavy Base -->
    <path d="M85 192 C85 186 92 182 100 182 L170 182 C178 182 185 186 185 192 L185 196 C185 199 180 202 170 202 L100 202 C90 202 85 199 85 196 Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
    <!-- Microscope Curved Arm -->
    <path d="M165 182 C165 130 155 85 125 75" fill="none" stroke="var(--sp-ill-card-border, #64748B)" stroke-width="12" stroke-linecap="round"/>
    <!-- Coarse & Fine Adjustment Knobs -->
    <circle cx="165" cy="145" r="10" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #94A3B8)" stroke-width="2.5"/>
    <circle cx="165" cy="145" r="5" fill="#64748B"/>
    <!-- Stage Platform & Slide -->
    <rect x="95" y="136" width="60" height="6" rx="2" fill="#334155"/>
    <rect x="110" y="133" width="30" height="3" rx="1" fill="#38BDF8"/>
    <!-- Objective Turret & Lenses -->
    <rect x="115" y="105" width="22" height="12" rx="2" fill="#475569"/>
    <polygon points="120,117 122,128 126,128 124,117" fill="#0284C7"/>
    <polygon points="128,117 131,130 135,130 133,117" fill="#38BDF8"/>
    <!-- Monocular Eyepiece Tube -->
    <g transform="rotate(-25 118 75)">
      <rect x="110" y="45" width="16" height="36" rx="3" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
      <rect x="106" y="38" width="24" height="8" rx="3" fill="#1E293B"/>
    </g>
    <!-- Microscopic Inset Circle (Cellular View) -->
    <circle cx="62" cy="72" r="26" fill="var(--sp-ill-card, #FFFFFF)" stroke="#10B981" stroke-width="2.5"/>
    <circle cx="62" cy="72" r="22" fill="rgba(16,185,129,0.1)"/>
    <circle cx="58" cy="68" r="6" fill="#10B981" opacity="0.8"/>
    <circle cx="70" cy="75" r="7.5" fill="#059669" opacity="0.8"/>
    <circle cx="56" cy="80" r="4" fill="#34D399" opacity="0.9"/>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="98" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(16,185,129,0.12))" stroke="var(--sp-ill-tag-border, #34D399)" stroke-width="1"/>
      <text x="61" y="29" fill="var(--sp-ill-tag-text, #059669)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">MICROSCOPY</text>
    </g>
  </svg>`,
};

export const SCIENCE_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationLabFlask,
  illustrationDnaGenetics,
  illustrationAtomPhysics,
  illustrationSpaceTelescope,
  illustrationMicrobiology,
] as const;
