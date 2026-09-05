import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationPersonTablet: IllustrationDefinition = {
  name: 'person-tablet',
  title: 'Person with Tablet',
  category: 'people',
  tags: ['person', 'people', 'tablet', 'digital', 'reading', 'worker', 'standing', 'mobile'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <ellipse cx="160" cy="198" rx="72" ry="9" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.15))"/>
  <circle cx="215" cy="70" r="14" fill="#3B82F6" fill-opacity="0.12"/>
  <circle cx="105" cy="110" r="8" fill="#F59E0B" fill-opacity="0.2"/>
  <!-- Left Leg -->
  <path d="M152 126L150 186H158L160 126H152Z" fill="#1E1B4B"/>
  <rect x="146" y="186" width="14" height="6" rx="3" fill="#0F172A"/>
  <!-- Right Leg -->
  <path d="M166 126L172 186H180L174 126H166Z" fill="#1E1B4B"/>
  <rect x="171" y="186" width="14" height="6" rx="3" fill="#0F172A"/>
  <!-- Torso & Yellow Polo Shirt -->
  <path d="M146 76C146 76 154 72 163 72C172 72 180 76 180 76L182 128H144L146 76Z" fill="#EAB308"/>
  <path d="M160 72V88" stroke="#CA8A04" stroke-width="2" stroke-linecap="round"/>
  <!-- Head & Hair -->
  <circle cx="163" cy="54" r="13" fill="#8D5B4C"/>
  <path d="M152 48C152 42 158 39 166 39C174 39 178 44 177 51C173 49 167 49 162 52C158 53 155 52 152 48Z" fill="#18181B"/>
  <!-- Arms & Tablet -->
  <path d="M146 78L138 104L156 108" stroke="#8D5B4C" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M180 78L174 102L162 108" stroke="#8D5B4C" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Tablet Device -->
  <rect x="148" y="94" width="22" height="28" rx="3" transform="rotate(-10 148 94)" fill="var(--sp-ill-card, #FFFFFF)" stroke="#3B82F6" stroke-width="2"/>
  <line x1="153" y1="102" x2="167" y2="100" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="152" y1="107" x2="164" y2="105" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="208" width="100" height="20" rx="10" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B" stroke-width="1.2"/>
    <text x="160" y="222" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="10" fill="#B45309" text-anchor="middle" letter-spacing="0.5">REVIEWING</text>
  </g>
</svg>`,
};

export const illustrationPersonDesk: IllustrationDefinition = {
  name: 'person-desk',
  title: 'Person at Desk',
  category: 'people',
  tags: ['person', 'people', 'desk', 'laptop', 'seated', 'coding', 'working', 'chair'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <ellipse cx="160" cy="200" rx="84" ry="10" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.15))"/>
  <!-- Chair -->
  <rect x="116" y="104" width="24" height="42" rx="4" fill="#F59E0B"/>
  <rect x="114" y="146" width="36" height="8" rx="3" fill="#D97706"/>
  <line x1="120" y1="154" x2="114" y2="198" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
  <line x1="142" y1="154" x2="148" y2="198" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
  <!-- Seated Body & Legs -->
  <path d="M136 122C136 122 144 116 154 116C162 116 170 120 170 128L166 156L140 156L136 122Z" fill="#3B82F6"/>
  <path d="M140 156H178L198 188H188L170 162H140V156Z" fill="#1E1B4B"/>
  <rect x="194" y="184" width="16" height="6" rx="3" fill="#0F172A"/>
  <!-- Head & Hair -->
  <circle cx="154" cy="92" r="12" fill="#FBBF24"/>
  <path d="M144 94C144 80 154 78 162 78C172 78 174 88 172 98C168 96 162 94 156 97C150 100 146 98 144 94Z" fill="#1E293B"/>
  <path d="M144 96C142 106 145 116 148 122" stroke="#1E293B" stroke-width="4" stroke-linecap="round"/>
  <!-- Arms & Laptop -->
  <path d="M156 122L176 138H192" stroke="#FBBF24" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Laptop Base & Screen -->
  <line x1="178" y1="144" x2="216" y2="144" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
  <path d="M184 142L194 120H220L212 142" fill="var(--sp-ill-card, #FFFFFF)" stroke="#94A3B8" stroke-width="2"/>
  <circle cx="206" cy="130" r="3" fill="#3B82F6"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="115" y="210" width="90" height="20" rx="10" fill="var(--sp-ill-card, #DBEAFE)" stroke="#3B82F6" stroke-width="1.2"/>
    <text x="160" y="224" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="10" fill="#1D4ED8" text-anchor="middle" letter-spacing="0.5">FOCUSED</text>
  </g>
</svg>`,
};

export const illustrationPersonIdea: IllustrationDefinition = {
  name: 'person-idea',
  title: 'Person with Big Idea',
  category: 'people',
  tags: [
    'person',
    'people',
    'idea',
    'lightbulb',
    'inspiration',
    'creativity',
    'innovation',
    'brainstorm',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <defs>
    <radialGradient id="pi-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(136 68) scale(60)">
      <stop stop-color="#FBBF24" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#FBBF24" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="160" cy="200" rx="80" ry="10" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.15))"/>
  <!-- Idea Glow & Giant Bulb -->
  <circle cx="136" cy="68" r="54" fill="url(#pi-glow)"/>
  <path d="M120 72C116 62 120 48 132 42C144 36 158 40 164 52C168 60 164 70 156 76V88H130V76C124 74 121 73 120 72Z" fill="#FBBF24"/>
  <rect x="132" y="88" width="22" height="6" rx="2" fill="#0F172A"/>
  <rect x="134" y="95" width="18" height="4" rx="2" fill="#0F172A"/>
  <!-- Person Standing Looking Up -->
  <!-- Legs -->
  <path d="M178 134L176 190H184L188 134H178Z" fill="#1E1B4B"/>
  <rect x="171" y="190" width="15" height="5" rx="2.5" fill="#0F172A"/>
  <path d="M192 134L196 190H204L200 134H192Z" fill="#1E1B4B"/>
  <rect x="194" y="190" width="15" height="5" rx="2.5" fill="#0F172A"/>
  <!-- Torso & Coral Shirt -->
  <path d="M174 88C174 88 182 84 192 84C200 84 206 88 206 94L202 136H176L174 88Z" fill="#EF4444"/>
  <!-- Head Tilted Left-Up -->
  <circle cx="194" cy="68" r="12" fill="#FBBF24"/>
  <path d="M192 56C198 56 206 60 206 68C206 76 200 78 196 78C194 72 190 70 184 70C182 64 186 56 192 56Z" fill="#1E1B4B"/>
  <!-- Raised Arms Holding Bulb Base -->
  <path d="M176 92L156 86L148 94" stroke="#FBBF24" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M192 92L170 82L158 92" stroke="#FBBF24" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="210" width="100" height="20" rx="10" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B" stroke-width="1.2"/>
    <text x="160" y="224" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="10" fill="#B45309" text-anchor="middle" letter-spacing="0.5">BIG IDEA</text>
  </g>
</svg>`,
};

export const illustrationPersonPresenting: IllustrationDefinition = {
  name: 'person-presenting',
  title: 'Person Presenting',
  category: 'people',
  tags: ['person', 'people', 'presenting', 'speaker', 'guide', 'thumbs-up', 'pitch', 'leadership'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <ellipse cx="160" cy="200" rx="74" ry="9" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.15))"/>
  <circle cx="95" cy="80" r="16" fill="#10B981" fill-opacity="0.12"/>
  <circle cx="230" cy="110" r="10" fill="#3B82F6" fill-opacity="0.15"/>
  <!-- Legs -->
  <path d="M150 128L148 188H156L160 128H150Z" fill="#1E1B4B"/>
  <rect x="144" y="188" width="14" height="6" rx="3" fill="#0F172A"/>
  <path d="M164 128L168 188H176L172 128H164Z" fill="#1E1B4B"/>
  <rect x="166" y="188" width="14" height="6" rx="3" fill="#0F172A"/>
  <!-- Torso & Blue Sweater -->
  <path d="M144 76C144 76 154 72 164 72C172 72 180 76 180 76L180 130H146L144 76Z" fill="#60A5FA"/>
  <!-- Head & Stylish Beard -->
  <circle cx="163" cy="54" r="12" fill="#FED7AA"/>
  <path d="M155 46C156 40 162 38 170 38C176 38 178 43 176 49C174 47 170 46 166 48C162 49 158 50 155 46Z" fill="#1E293B"/>
  <!-- Bun / Hair Knot -->
  <circle cx="152" cy="44" r="5" fill="#1E293B"/>
  <!-- Beard -->
  <path d="M158 58C160 68 170 68 172 58V54H158V58Z" fill="#1E293B"/>
  <!-- Left Hand on Waist / Gesturing -->
  <path d="M146 80L134 100L144 110" stroke="#FED7AA" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Right Arm Extended Presenting / Pointing Right -->
  <path d="M178 80L200 92H216" stroke="#60A5FA" stroke-width="6" stroke-linecap="round"/>
  <circle cx="220" cy="92" r="4" fill="#FED7AA"/>
  <!-- Speech / Accent Sparkle -->
  <path d="M228 76L232 84L240 86L232 88L228 96L224 88L216 86L224 84Z" fill="#10B981"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="115" y="210" width="90" height="20" rx="10" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.2"/>
    <text x="160" y="224" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="10" fill="#047857" text-anchor="middle" letter-spacing="0.5">PRESENTER</text>
  </g>
</svg>`,
};

export const illustrationPersonSuccess: IllustrationDefinition = {
  name: 'person-success',
  title: 'Person Celebrating Success',
  category: 'people',
  tags: ['person', 'people', 'success', 'celebration', 'winner', 'achievement', 'phone', 'cheer'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <ellipse cx="160" cy="200" rx="76" ry="9" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.15))"/>
  <!-- Legs -->
  <path d="M152 130L148 188H156L162 130H152Z" fill="#1E1B4B"/>
  <rect x="143" y="188" width="15" height="6" rx="3" fill="#0F172A"/>
  <path d="M166 130L174 188H182L176 130H166Z" fill="#1E1B4B"/>
  <rect x="172" y="188" width="15" height="6" rx="3" fill="#0F172A"/>
  <!-- Torso & Yellow Polo -->
  <path d="M148 76C148 76 156 72 166 72C174 72 182 76 182 76L182 132H148L148 76Z" fill="#F59E0B"/>
  <!-- Head Tilted Up -->
  <circle cx="164" cy="52" r="12" fill="#FED7AA"/>
  <path d="M154 44C156 38 164 36 172 38C178 40 180 46 176 52C172 50 166 50 160 52C156 50 154 46 154 44Z" fill="#1E293B"/>
  <!-- Left Arm Holding Phone Low -->
  <path d="M148 80L138 102L150 108" stroke="#FED7AA" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="148" y="104" width="8" height="14" rx="2" fill="#1E293B"/>
  <!-- Right Arm High Raised in Fist Victory -->
  <path d="M182 78L196 52L204 32" stroke="#FED7AA" stroke-width="6" stroke-linecap="round"/>
  <circle cx="204" cy="30" r="5" fill="#FED7AA"/>
  <!-- Sparkles of Celebration -->
  <path d="M216 24L220 30L226 32L220 34L216 40L212 34L206 32L212 30Z" fill="#F59E0B"/>
  <circle cx="218" cy="50" r="3" fill="#3B82F6"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="115" y="210" width="90" height="20" rx="10" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B" stroke-width="1.2"/>
    <text x="160" y="224" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="10" fill="#B45309" text-anchor="middle" letter-spacing="0.5">WINNER</text>
  </g>
</svg>`,
};

export const illustrationPersonCheering: IllustrationDefinition = {
  name: 'person-cheering',
  title: 'Person Cheering',
  category: 'people',
  tags: ['person', 'people', 'cheering', 'celebration', 'arms-raised', 'excited', 'joy', 'happy'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <ellipse cx="160" cy="200" rx="72" ry="9" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.15))"/>
  <!-- Legs -->
  <path d="M152 134L148 190H156L160 134H152Z" fill="#1E1B4B"/>
  <rect x="144" y="190" width="14" height="6" rx="3" fill="#0F172A"/>
  <path d="M166 134L172 190H180L174 134H166Z" fill="#1E1B4B"/>
  <rect x="171" y="190" width="14" height="6" rx="3" fill="#0F172A"/>
  <!-- Torso & Vibrant Coral Shirt -->
  <path d="M148 84C148 84 156 80 164 80C172 80 178 84 178 84L178 136H148L148 84Z" fill="#EF4444"/>
  <!-- Head Looking Center-Up -->
  <circle cx="163" cy="62" r="12" fill="#FED7AA"/>
  <!-- High Bun Hairstyle -->
  <path d="M153 54C155 46 162 44 170 46C176 48 178 54 175 62C170 60 164 60 158 62Z" fill="#1E293B"/>
  <circle cx="164" cy="40" r="6" fill="#1E293B"/>
  <!-- Both Arms Raised Up in V-Shape -->
  <path d="M150 86L134 58L122 36" stroke="#EF4444" stroke-width="6" stroke-linecap="round"/>
  <circle cx="120" cy="34" r="4.5" fill="#FED7AA"/>
  <path d="M176 86L192 58L204 36" stroke="#EF4444" stroke-width="6" stroke-linecap="round"/>
  <circle cx="206" cy="34" r="4.5" fill="#FED7AA"/>
  <!-- Celebration Confetti -->
  <circle cx="112" cy="54" r="3" fill="#3B82F6"/>
  <circle cx="214" cy="56" r="3" fill="#10B981"/>
  <path d="M160 26L162 30L166 31L162 33L160 37L158 33L154 31L158 30Z" fill="#F59E0B"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="210" width="110" height="20" rx="10" fill="var(--sp-ill-card, #FEE2E2)" stroke="#EF4444" stroke-width="1.2"/>
    <text x="160" y="224" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="10" fill="#B91C1C" text-anchor="middle" letter-spacing="0.5">CELEBRATING</text>
  </g>
</svg>`,
};

export const illustrationPersonVictory: IllustrationDefinition = {
  name: 'person-victory',
  title: 'Person with Arms Raised',
  category: 'people',
  tags: ['person', 'people', 'victory', 'arms-raised', 'triumph', 'blazer', 'jumping', 'success'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <ellipse cx="160" cy="200" rx="76" ry="9" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.15))"/>
  <!-- Legs -->
  <path d="M152 134L148 190H156L162 134H152Z" fill="#1E1B4B"/>
  <rect x="144" y="190" width="14" height="6" rx="3" fill="#0F172A"/>
  <path d="M166 134L172 190H180L174 134H166Z" fill="#1E1B4B"/>
  <rect x="171" y="190" width="14" height="6" rx="3" fill="#0F172A"/>
  <!-- Torso, White Shirt & Blue Open Jacket -->
  <path d="M148 82C148 82 156 78 164 78C172 78 178 82 178 82L178 136H148L148 82Z" fill="#3B82F6"/>
  <polygon points="158,78 168,78 164,116 160,116" fill="var(--sp-ill-card, #FFFFFF)"/>
  <!-- Head Tilted Left-Up -->
  <circle cx="163" cy="58" r="12" fill="#78350F"/>
  <path d="M154 50C156 42 164 40 172 42C178 44 180 50 178 58C174 56 168 56 162 58Z" fill="#1E293B"/>
  <!-- Both Arms Swept Up Triumphant -->
  <path d="M148 84L132 54L124 28" stroke="#3B82F6" stroke-width="6" stroke-linecap="round"/>
  <circle cx="122" cy="26" r="4.5" fill="#78350F"/>
  <path d="M178 84L194 54L202 28" stroke="#3B82F6" stroke-width="6" stroke-linecap="round"/>
  <circle cx="204" cy="26" r="4.5" fill="#78350F"/>
  <!-- Victory Star Burst -->
  <circle cx="163" cy="22" r="3" fill="#F59E0B"/>
  <circle cx="106" cy="46" r="2.5" fill="#10B981"/>
  <circle cx="218" cy="46" r="2.5" fill="#EF4444"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="115" y="210" width="90" height="20" rx="10" fill="var(--sp-ill-card, #DBEAFE)" stroke="#3B82F6" stroke-width="1.2"/>
    <text x="160" y="224" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="10" fill="#1D4ED8" text-anchor="middle" letter-spacing="0.5">VICTORY</text>
  </g>
</svg>`,
};

export const illustrationPersonFloorLaptop: IllustrationDefinition = {
  name: 'person-floor-laptop',
  title: 'Person Working on Floor',
  category: 'people',
  tags: [
    'person',
    'people',
    'laptop',
    'floor',
    'coding',
    'relaxed',
    'casual',
    'developer',
    'deep-work',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <ellipse cx="160" cy="198" rx="86" ry="11" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.15))"/>
  <!-- Cross-Legged Pants -->
  <path d="M116 172C116 160 128 152 144 152H176C192 152 204 160 204 172C204 186 186 194 160 194C134 194 116 186 116 172Z" fill="#1E1B4B"/>
  <ellipse cx="132" cy="180" rx="16" ry="7" fill="#1E1B4B"/>
  <ellipse cx="188" cy="180" rx="16" ry="7" fill="#1E1B4B"/>
  <rect x="120" y="182" width="14" height="6" rx="3" fill="#0F172A"/>
  <rect x="186" y="182" width="14" height="6" rx="3" fill="#0F172A"/>
  <!-- Torso & Red Casual Shirt -->
  <path d="M136 108C136 108 146 102 160 102C172 102 180 108 180 108L176 156H140L136 108Z" fill="#EF4444"/>
  <!-- Head Looking Down at Screen -->
  <circle cx="158" cy="84" r="12" fill="#FED7AA"/>
  <path d="M148 76C150 70 156 68 164 68C172 68 174 74 172 82C168 80 162 80 158 84Z" fill="#1E293B"/>
  <!-- Arms Typing -->
  <path d="M142 112L156 138H174" stroke="#FED7AA" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Laptop on Floor/Knees -->
  <line x1="162" y1="152" x2="202" y2="152" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
  <path d="M168 150L178 126H206L198 150" fill="var(--sp-ill-card, #FFFFFF)" stroke="#475569" stroke-width="2"/>
  <circle cx="192" cy="138" r="2.5" fill="#3B82F6"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="208" width="100" height="20" rx="10" fill="var(--sp-ill-card, #FEE2E2)" stroke="#EF4444" stroke-width="1.2"/>
    <text x="160" y="222" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="10" fill="#B91C1C" text-anchor="middle" letter-spacing="0.5">DEEP WORK</text>
  </g>
</svg>`,
};

export const illustrationPersonManager: IllustrationDefinition = {
  name: 'person-manager',
  title: 'Person with Clipboard',
  category: 'people',
  tags: [
    'person',
    'people',
    'manager',
    'clipboard',
    'supervisor',
    'auditor',
    'inspection',
    'leader',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <ellipse cx="160" cy="200" rx="74" ry="9" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.15))"/>
  <!-- Legs -->
  <path d="M150 128L148 188H156L160 128H150Z" fill="#1E1B4B"/>
  <rect x="144" y="188" width="14" height="6" rx="3" fill="#0F172A"/>
  <path d="M164 128L168 188H176L172 128H164Z" fill="#1E1B4B"/>
  <rect x="166" y="188" width="14" height="6" rx="3" fill="#0F172A"/>
  <!-- Torso & Blue Shirt -->
  <path d="M144 76C144 76 154 72 164 72C172 72 180 76 180 76L180 130H144L144 76Z" fill="#3B82F6"/>
  <!-- Head with Full Beard -->
  <circle cx="163" cy="54" r="12" fill="#8D5B4C"/>
  <path d="M155 46C156 40 162 38 170 38C176 38 178 43 176 49C174 47 170 46 166 48Z" fill="#18181B"/>
  <path d="M158 56C160 68 170 68 172 56V52H158V56Z" fill="#18181B"/>
  <!-- Left Hand Holding Clipboard -->
  <path d="M146 80L134 104L148 112" stroke="#8D5B4C" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Clipboard Board -->
  <rect x="122" y="98" width="24" height="32" rx="3" fill="#78350F"/>
  <rect x="128" y="95" width="12" height="5" rx="1.5" fill="#CBD5E1"/>
  <rect x="126" y="103" width="16" height="23" rx="1" fill="var(--sp-ill-card, #FFFFFF)"/>
  <line x1="129" y1="108" x2="139" y2="108" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="129" y1="113" x2="139" y2="113" stroke="#94A3B8" stroke-width="1" stroke-linecap="round"/>
  <line x1="129" y1="118" x2="137" y2="118" stroke="#94A3B8" stroke-width="1" stroke-linecap="round"/>
  <!-- Right Arm with Pen / Stylus -->
  <path d="M178 80L168 106L152 110" stroke="#8D5B4C" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="210" width="100" height="20" rx="10" fill="var(--sp-ill-card, #DBEAFE)" stroke="#3B82F6" stroke-width="1.2"/>
    <text x="160" y="224" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="10" fill="#1D4ED8" text-anchor="middle" letter-spacing="0.5">SUPERVISOR</text>
  </g>
</svg>`,
};

export const illustrationPersonInnovator: IllustrationDefinition = {
  name: 'person-innovator',
  title: 'Person on Lightbulb',
  category: 'people',
  tags: [
    'person',
    'people',
    'innovator',
    'lightbulb',
    'creative',
    'breakthrough',
    'laptop',
    'idea',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <defs>
    <radialGradient id="pinn-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(185 150) scale(60)">
      <stop stop-color="#FBBF24" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#FBBF24" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="160" cy="202" rx="88" ry="10" fill="var(--sp-ill-halo, rgba(148, 163, 184, 0.15))"/>
  <!-- Giant Tilted Lightbulb as Seat -->
  <circle cx="185" cy="150" r="48" fill="url(#pinn-glow)"/>
  <path d="M170 120C185 110 205 116 215 132C225 148 220 168 205 178C195 184 180 184 170 176L158 190L146 180L158 166C152 154 154 135 170 120Z" fill="#FBBF24"/>
  <rect x="144" y="180" width="16" height="8" rx="2" transform="rotate(40 144 180)" fill="#0F172A"/>
  <!-- Person Seated on Top of Bulb -->
  <!-- Legs Dangling -->
  <path d="M164 120C164 120 152 138 136 154L128 150" stroke="#1E1B4B" stroke-width="9" stroke-linecap="round"/>
  <rect x="122" y="148" width="14" height="6" rx="3" fill="#0F172A"/>
  <path d="M176 120C176 120 170 142 164 168L176 172" stroke="#1E1B4B" stroke-width="8" stroke-linecap="round"/>
  <rect x="172" y="170" width="14" height="6" rx="3" fill="#0F172A"/>
  <!-- Torso & Blue Shirt -->
  <path d="M162 76C162 76 172 72 182 74C190 76 196 82 196 90L190 122H164L162 76Z" fill="#38BDF8"/>
  <!-- Head with Afro / Curly Hair -->
  <circle cx="178" cy="56" r="12" fill="#78350F"/>
  <path d="M166 52C164 42 174 38 184 38C194 38 200 44 198 54C194 50 188 50 182 52Z" fill="#18181B"/>
  <circle cx="168" cy="46" r="6" fill="#18181B"/>
  <circle cx="188" cy="44" r="6" fill="#18181B"/>
  <!-- Arms & Laptop -->
  <path d="M170 82L152 98H136" stroke="#78350F" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Laptop on Lap -->
  <line x1="130" y1="102" x2="164" y2="102" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
  <path d="M136 100L144 80H166L158 100" fill="var(--sp-ill-card, #FFFFFF)" stroke="#0F172A" stroke-width="1.8"/>
  <circle cx="152" cy="90" r="2.5" fill="#38BDF8"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="210" width="100" height="20" rx="10" fill="var(--sp-ill-card, #E0F2FE)" stroke="#0284C7" stroke-width="1.2"/>
    <text x="160" y="224" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="10" fill="#0369A1" text-anchor="middle" letter-spacing="0.5">INNOVATOR</text>
  </g>
</svg>`,
};

export const PEOPLE_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationPersonTablet,
  illustrationPersonDesk,
  illustrationPersonIdea,
  illustrationPersonPresenting,
  illustrationPersonSuccess,
  illustrationPersonCheering,
  illustrationPersonVictory,
  illustrationPersonFloorLaptop,
  illustrationPersonManager,
  illustrationPersonInnovator,
] as const;
