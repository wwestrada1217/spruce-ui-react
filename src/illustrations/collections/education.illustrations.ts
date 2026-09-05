import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationGraduationCap: IllustrationDefinition = {
  name: 'graduation-cap',
  title: 'Graduation Cap & Diploma',
  category: 'education',
  tags: [
    'graduation',
    'cap',
    'mortarboard',
    'diploma',
    'degree',
    'education',
    'academic',
    'alumni',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(99, 102, 241, 0.12))"/>
  <!-- Mortarboard Diamond Top -->
  <polygon points="160,54 246,84 160,114 74,84" fill="#1E1B4B" stroke="#0F172A" stroke-width="2.5"/>
  <!-- Skull Cap Underneath -->
  <path d="M110 97C110 97 122 134 160 134C198 134 210 97 210 97" fill="#312E81"/>
  <!-- Button on Cap -->
  <circle cx="160" cy="84" r="4" fill="#F59E0B"/>
  <!-- Golden Tassel Hanging Left -->
  <path d="M160 84L104 108V134" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="98" y="132" width="12" height="18" rx="2" fill="#F59E0B"/>
  <!-- Rolled Diploma Scroll Tied with Ribbon -->
  <rect x="90" y="152" width="140" height="24" rx="12" fill="var(--sp-ill-card, #FFFFFF)" stroke="#CBD5E1" stroke-width="2"/>
  <rect x="150" y="150" width="20" height="28" rx="3" fill="#EF4444"/>
  <polygon points="152,178 156,188 160,178" fill="#EF4444"/>
  <polygon points="160,178 164,188 168,178" fill="#EF4444"/>
  <!-- Academic Ribbon Wax Seal -->
  <circle cx="160" cy="164" r="7" fill="#B91C1C"/>
  <circle cx="160" cy="164" r="3" fill="#F59E0B"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #EEF2FF)" stroke="#6366F1" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#4F46E5" text-anchor="middle" letter-spacing="1">GRADUATION</text>
  </g>
</svg>`,
};

export const illustrationOnlineLearning: IllustrationDefinition = {
  name: 'online-learning',
  title: 'E-Learning & Virtual Classroom',
  category: 'education',
  tags: [
    'elearning',
    'online-learning',
    'laptop',
    'lecture',
    'student',
    'course',
    'education',
    'study',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(59, 130, 246, 0.12))"/>
  <!-- Laptop Base -->
  <rect x="74" y="152" width="172" height="12" rx="4" fill="#64748B"/>
  <polygon points="90,66 230,66 234,152 86,152" fill="#0F172A" stroke="#334155" stroke-width="2"/>
  <!-- Screen Display -->
  <rect x="96" y="74" width="128" height="70" rx="4" fill="var(--sp-ill-card, #FFFFFF)"/>
  <!-- Video Lecturer Silhouette on Screen -->
  <rect x="104" y="82" width="56" height="54" rx="4" fill="#EFF6FF"/>
  <circle cx="132" cy="98" r="10" fill="#3B82F6"/>
  <path d="M118 122C118 114 124 110 132 110C140 110 146 114 146 122" stroke="#3B82F6" stroke-width="2"/>
  <!-- Course Lecture Notes / Progress Bar on Right Screen -->
  <line x1="170" y1="88" x2="214" y2="88" stroke="#0F172A" stroke-width="2" stroke-linecap="round"/>
  <line x1="170" y1="98" x2="204" y2="98" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="170" y1="108" x2="210" y2="108" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
  <rect x="170" y="122" width="44" height="6" rx="3" fill="#E2E8F0"/>
  <rect x="170" y="122" width="32" height="6" rx="3" fill="#10B981"/>
  <!-- Book Stack Next to Laptop -->
  <rect x="238" y="142" width="30" height="8" rx="2" fill="#EF4444"/>
  <rect x="240" y="132" width="28" height="8" rx="2" fill="#F59E0B"/>
  <rect x="242" y="122" width="26" height="8" rx="2" fill="#3B82F6"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="202" width="100" height="24" rx="12" fill="var(--sp-ill-card, #EFF6FF)" stroke="#3B82F6" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#1D4ED8" text-anchor="middle" letter-spacing="1">E-LEARNING</text>
  </g>
</svg>`,
};

export const illustrationOpenBook: IllustrationDefinition = {
  name: 'open-book',
  title: 'Open Book & Academic Research',
  category: 'education',
  tags: [
    'book',
    'reading',
    'library',
    'academics',
    'knowledge',
    'research',
    'learning',
    'literature',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.12))"/>
  <!-- Hardcover Base -->
  <path d="M74 156C116 148 152 152 160 162C168 152 204 148 246 156L242 166C204 158 168 162 160 172C152 162 116 158 78 166Z" fill="#1E3A8A"/>
  <!-- Left Page Stack -->
  <path d="M78 84C116 78 150 84 160 96V158C150 148 116 142 78 148V84Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#CBD5E1" stroke-width="2"/>
  <!-- Left Page Lines -->
  <line x1="96" y1="98" x2="142" y2="98" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="96" y1="110" x2="146" y2="110" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="96" y1="122" x2="136" y2="122" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="96" y1="134" x2="144" y2="134" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Right Page Stack -->
  <path d="M242 84C204 78 170 84 160 96V158C170 148 204 142 242 148V84Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#CBD5E1" stroke-width="2"/>
  <!-- Right Page Lines -->
  <line x1="174" y1="98" x2="224" y2="98" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="174" y1="110" x2="218" y2="110" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="174" y1="122" x2="222" y2="122" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="174" y1="134" x2="210" y2="134" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Ribbon Bookmark -->
  <path d="M160 96V156L155 150L150 156V96" fill="#EF4444"/>
  <!-- Knowledge Sparkles -->
  <polygon points="160,48 163,58 173,61 163,64 160,74 157,64 147,61 157,58" fill="#F59E0B"/>
  <circle cx="120" cy="56" r="3" fill="#3B82F6"/>
  <circle cx="204" cy="58" r="3" fill="#10B981"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="202" width="100" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#B45309" text-anchor="middle" letter-spacing="1">ACADEMICS</text>
  </g>
</svg>`,
};

export const illustrationClassroomBoard: IllustrationDefinition = {
  name: 'classroom-board',
  title: 'Classroom Board & Lecture',
  category: 'education',
  tags: ['classroom', 'board', 'blackboard', 'chalk', 'lecture', 'teaching', 'school', 'math'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <!-- Wooden Frame Blackboard -->
  <rect x="66" y="56" width="188" height="114" rx="6" fill="#78350F" stroke="#451A03" stroke-width="2.5"/>
  <rect x="74" y="64" width="172" height="98" rx="4" fill="#064E3B"/>
  <!-- Chalk Tray at Bottom -->
  <rect x="80" y="162" width="160" height="6" rx="2" fill="#B45309"/>
  <rect x="100" y="160" width="12" height="4" rx="1" fill="#FFFFFF"/>
  <rect x="120" y="160" width="8" height="4" rx="1" fill="#FDE047"/>
  <!-- Math Formula & Diagrams on Board -->
  <text x="96" y="90" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="14" fill="#FFFFFF">E = mc²</text>
  <text x="96" y="112" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="11" fill="#86EFAC">f(x) = ax + b</text>
  <!-- Geometric Triangle -->
  <polygon points="184,80 224,124 184,124" fill="none" stroke="#FDE047" stroke-width="1.8"/>
  <line x1="184" y1="116" x2="192" y2="116" stroke="#FDE047" stroke-width="1.5"/>
  <line x1="192" y1="116" x2="192" y2="124" stroke="#FDE047" stroke-width="1.5"/>
  <!-- Pointer Ruler -->
  <line x1="220" y1="168" x2="176" y2="120" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="202" width="100" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#047857" text-anchor="middle" letter-spacing="1">LECTURE</text>
  </g>
</svg>`,
};

export const illustrationSchoolCampus: IllustrationDefinition = {
  name: 'school-campus',
  title: 'University Campus & Academy',
  category: 'education',
  tags: ['campus', 'university', 'college', 'school', 'academy', 'education', 'building', 'hall'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(239, 68, 68, 0.12))"/>
  <!-- Ground Lawn -->
  <rect x="50" y="174" width="220" height="12" rx="4" fill="#16A34A"/>
  <!-- University Building Wings -->
  <rect x="80" y="104" width="160" height="70" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <!-- Classical Pillars -->
  <line x1="130" y1="118" x2="130" y2="174" stroke="#334155" stroke-width="3"/>
  <line x1="150" y1="118" x2="150" y2="174" stroke="#334155" stroke-width="3"/>
  <line x1="170" y1="118" x2="170" y2="174" stroke="#334155" stroke-width="3"/>
  <line x1="190" y1="118" x2="190" y2="174" stroke="#334155" stroke-width="3"/>
  <!-- Central Pediment Triangle -->
  <polygon points="120,118 160,84 200,118" fill="#B91C1C" stroke="#991B1B" stroke-width="2"/>
  <!-- Clock Tower Spire -->
  <rect x="146" y="44" width="28" height="42" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2"/>
  <polygon points="144,44 160,20 176,44" fill="#B91C1C"/>
  <circle cx="160" cy="60" r="8" fill="#FDE68A" stroke="#334155" stroke-width="1.5"/>
  <line x1="160" y1="60" x2="160" y2="55" stroke="#334155" stroke-width="1.5"/>
  <line x1="160" y1="60" x2="164" y2="60" stroke="#334155" stroke-width="1.5"/>
  <!-- Campus Trees -->
  <circle cx="70" cy="154" r="14" fill="#22C55E"/>
  <line x1="70" y1="154" x2="70" y2="174" stroke="#78350F" stroke-width="2.5"/>
  <circle cx="250" cy="154" r="14" fill="#22C55E"/>
  <line x1="250" y1="154" x2="250" y2="174" stroke="#78350F" stroke-width="2.5"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="202" width="100" height="24" rx="12" fill="var(--sp-ill-card, #FEE2E2)" stroke="#EF4444" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#B91C1C" text-anchor="middle" letter-spacing="1">ACADEMY</text>
  </g>
</svg>`,
};

export const EDUCATION_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationGraduationCap,
  illustrationOnlineLearning,
  illustrationOpenBook,
  illustrationClassroomBoard,
  illustrationSchoolCampus,
] as const;
