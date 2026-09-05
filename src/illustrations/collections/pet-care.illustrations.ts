import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationVeterinaryCare: IllustrationDefinition = {
  name: 'veterinary-care',
  title: 'Veterinary Care & Clinical Health',
  category: 'pet-care',
  tags: [
    'pet',
    'veterinary',
    'vet',
    'clinic',
    'dog',
    'animal',
    'medical',
    'stethoscope',
    'healthcare',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="195" rx="88" ry="18" fill="var(--sp-ill-halo, rgba(16,185,129,0.12))"/>
    <circle cx="160" cy="118" r="76" fill="var(--sp-ill-halo, rgba(16,185,129,0.06))"/>
    <!-- Exam Table -->
    <rect x="75" y="148" width="170" height="12" rx="4" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
    <rect x="90" y="160" width="8" height="42" rx="3" fill="var(--sp-ill-border, #94A3B8)"/>
    <rect x="222" y="160" width="8" height="42" rx="3" fill="var(--sp-ill-border, #94A3B8)"/>
    <line x1="94" y1="182" x2="226" y2="182" stroke="var(--sp-ill-line, #CBD5E1)" stroke-width="2"/>
    <!-- Patient Dog Silhouette on Table -->
    <g fill="#F59E0B">
      <!-- Dog body -->
      <path d="M125 146 C125 125 142 120 160 120 C182 120 196 130 196 146 Z"/>
      <!-- Dog chest & front leg -->
      <path d="M182 135 L182 148 L174 148 L174 135 Z"/>
      <!-- Dog head & muzzle -->
      <circle cx="188" cy="108" r="14"/>
      <path d="M192 106 L210 112 C212 113 212 117 208 118 L192 118 Z"/>
      <circle cx="210" cy="114" r="2.5" fill="#78350F"/>
      <!-- Floppy Ear -->
      <path d="M180 98 C176 108 174 116 177 122 C181 120 184 112 184 102 Z" fill="#D97706"/>
      <!-- Tail wagging up -->
      <path d="M128 135 C118 126 114 112 118 106 C120 114 128 122 134 130 Z" fill="#D97706"/>
    </g>
    <!-- Stethoscope -->
    <path d="M135 70 C135 105 160 135 175 135 C190 135 215 105 215 70" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/>
    <circle cx="175" cy="135" r="7" fill="var(--sp-ill-card, #FFFFFF)" stroke="#0284C7" stroke-width="2.5"/>
    <!-- Veterinary Cross in Heart -->
    <g transform="translate(68, 62)">
      <path d="M22 8 C14 0 0 4 0 18 C0 30 18 42 22 46 C26 42 44 30 44 18 C44 4 30 0 22 8 Z" fill="#10B981"/>
      <rect x="18" y="15" width="8" height="18" rx="2" fill="#FFFFFF"/>
      <rect x="13" y="20" width="18" height="8" rx="2" fill="#FFFFFF"/>
    </g>
    <!-- Medical Clipboard on Stand -->
    <g transform="translate(225, 78)">
      <rect x="0" y="0" width="34" height="46" rx="4" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
      <rect x="10" y="-4" width="14" height="6" rx="2" fill="var(--sp-ill-border, #94A3B8)"/>
      <line x1="6" y1="12" x2="28" y2="12" stroke="#10B981" stroke-width="2"/>
      <line x1="6" y1="20" x2="24" y2="20" stroke="var(--sp-ill-line, #CBD5E1)" stroke-width="1.5"/>
      <line x1="6" y1="27" x2="26" y2="27" stroke="var(--sp-ill-line, #CBD5E1)" stroke-width="1.5"/>
      <line x1="6" y1="34" x2="20" y2="34" stroke="var(--sp-ill-line, #CBD5E1)" stroke-width="1.5"/>
    </g>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="82" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(16,185,129,0.12))" stroke="var(--sp-ill-tag-border, #34D399)" stroke-width="1"/>
      <text x="53" y="29" fill="var(--sp-ill-tag-text, #059669)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">VET CARE</text>
    </g>
  </svg>`,
};

export const illustrationPetGrooming: IllustrationDefinition = {
  name: 'pet-grooming',
  title: 'Pet Grooming & Spa Bath',
  category: 'pet-care',
  tags: ['pet', 'grooming', 'bath', 'spa', 'shampoo', 'dog', 'puppy', 'wash', 'clean'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="202" rx="90" ry="18" fill="var(--sp-ill-halo, rgba(14,165,233,0.12))"/>
    <circle cx="160" cy="120" r="76" fill="var(--sp-ill-halo, rgba(14,165,233,0.06))"/>
    <!-- Grooming Tub Basin -->
    <path d="M80 135 C80 135 88 190 160 190 C232 190 240 135 240 135 Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2.5"/>
    <rect x="70" y="130" width="180" height="10" rx="5" fill="#38BDF8"/>
    <!-- Tub Claw feet -->
    <circle cx="105" cy="194" r="6" fill="var(--sp-ill-border, #94A3B8)"/>
    <circle cx="215" cy="194" r="6" fill="var(--sp-ill-border, #94A3B8)"/>
    <!-- Puppy in Tub -->
    <g fill="#FBBF24">
      <circle cx="160" cy="102" r="22"/>
      <!-- Floppy ears -->
      <ellipse cx="138" cy="106" rx="8" ry="16" fill="#F59E0B" transform="rotate(-15 138 106)"/>
      <ellipse cx="182" cy="106" rx="8" ry="16" fill="#F59E0B" transform="rotate(15 182 106)"/>
      <!-- Eyes and nose -->
      <circle cx="152" cy="100" r="3" fill="#1E293B"/>
      <circle cx="168" cy="100" r="3" fill="#1E293B"/>
      <ellipse cx="160" cy="108" rx="4" ry="3" fill="#1E293B"/>
      <path d="M157 112 Q160 115 163 112" stroke="#1E293B" stroke-width="1.5" fill="none"/>
    </g>
    <!-- Soap Suds on Dog Head & Tub Rim -->
    <circle cx="160" cy="80" r="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
    <circle cx="150" cy="82" r="7" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
    <circle cx="170" cy="82" r="7" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
    <!-- Suds on Tub -->
    <circle cx="95" cy="130" r="9" fill="#FFFFFF" opacity="0.9"/>
    <circle cx="106" cy="126" r="7" fill="#FFFFFF" opacity="0.85"/>
    <circle cx="215" cy="130" r="8" fill="#FFFFFF" opacity="0.9"/>
    <circle cx="226" cy="127" r="6" fill="#FFFFFF" opacity="0.85"/>
    <!-- Floating Soap Bubbles -->
    <circle cx="118" cy="75" r="7" fill="rgba(56,189,248,0.3)" stroke="#38BDF8" stroke-width="1.5"/>
    <circle cx="198" cy="65" r="9" fill="rgba(56,189,248,0.25)" stroke="#38BDF8" stroke-width="1.5"/>
    <circle cx="205" cy="92" r="5" fill="rgba(56,189,248,0.35)" stroke="#38BDF8" stroke-width="1"/>
    <!-- Grooming Scissors / Shears Left -->
    <g transform="translate(42, 115) rotate(25)">
      <circle cx="8" cy="8" r="7" fill="none" stroke="#64748B" stroke-width="2.5"/>
      <circle cx="8" cy="24" r="7" fill="none" stroke="#64748B" stroke-width="2.5"/>
      <line x1="14" y1="12" x2="42" y2="20" stroke="#94A3B8" stroke-width="2.5"/>
      <line x1="14" y1="20" x2="42" y2="12" stroke="#94A3B8" stroke-width="2.5"/>
      <circle cx="26" cy="16" r="2" fill="#0284C7"/>
    </g>
    <!-- Shampoo Bottle Right -->
    <g transform="translate(245, 120)">
      <rect x="0" y="14" width="22" height="42" rx="5" fill="#0284C7"/>
      <rect x="4" y="24" width="14" height="22" rx="2" fill="#FFFFFF"/>
      <!-- Paw icon on bottle -->
      <circle cx="11" cy="34" r="2" fill="#0284C7"/>
      <circle cx="8" cy="30" r="1" fill="#0284C7"/>
      <circle cx="14" cy="30" r="1" fill="#0284C7"/>
      <rect x="7" y="8" width="8" height="6" fill="var(--sp-ill-border, #CBD5E1)"/>
      <path d="M4 8 L18 8 L18 5 C18 3 14 3 11 3 C8 3 4 3 4 5 Z" fill="#38BDF8"/>
    </g>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="84" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(14,165,233,0.12))" stroke="var(--sp-ill-tag-border, #38BDF8)" stroke-width="1"/>
      <text x="54" y="29" fill="var(--sp-ill-tag-text, #0284C7)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">GROOMING</text>
    </g>
  </svg>`,
};

export const illustrationPetNutrition: IllustrationDefinition = {
  name: 'pet-nutrition',
  title: 'Pet Nutrition & Diet Food',
  category: 'pet-care',
  tags: ['pet', 'food', 'nutrition', 'kibble', 'diet', 'bowl', 'dog-food', 'treat', 'bone'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="195" rx="88" ry="18" fill="var(--sp-ill-halo, rgba(245,158,11,0.12))"/>
    <circle cx="160" cy="120" r="76" fill="var(--sp-ill-halo, rgba(245,158,11,0.06))"/>
    <!-- Pet Food Bag Left/Center -->
    <g transform="translate(85, 65)">
      <!-- Bag Body -->
      <path d="M8 20 L24 8 L76 8 L92 20 L98 128 C98 132 94 135 90 135 L10 135 C6 135 2 132 2 128 Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
      <!-- Bag Top Fold / Seal -->
      <polygon points="24,8 76,8 86,0 14,0" fill="#D97706"/>
      <!-- Bag Header Brand Banner -->
      <path d="M6 35 L94 35 L96 75 L4 75 Z" fill="#F59E0B"/>
      <!-- Heart and Paw on Bag -->
      <circle cx="50" cy="55" r="14" fill="#FFFFFF"/>
      <!-- Paw Print -->
      <ellipse cx="50" cy="57" rx="5" ry="4" fill="#D97706"/>
      <circle cx="44" cy="50" r="2" fill="#D97706"/>
      <circle cx="50" cy="47" r="2" fill="#D97706"/>
      <circle cx="56" cy="50" r="2" fill="#D97706"/>
      <!-- Food Bag Sub-banner -->
      <rect x="20" y="88" width="60" height="6" rx="3" fill="#10B981"/>
      <rect x="25" y="100" width="50" height="4" rx="2" fill="var(--sp-ill-line, #CBD5E1)"/>
      <rect x="30" y="108" width="40" height="4" rx="2" fill="var(--sp-ill-line, #CBD5E1)"/>
    </g>
    <!-- Food Bowl Right -->
    <g transform="translate(182, 140)">
      <path d="M8 32 C12 55 76 55 80 32 L88 32 C88 58 0 58 0 32 Z" fill="#0284C7"/>
      <ellipse cx="44" cy="32" rx="44" ry="12" fill="var(--sp-ill-card, #FFFFFF)" stroke="#0284C7" stroke-width="2"/>
      <!-- Kibble Mounded in Bowl -->
      <ellipse cx="44" cy="30" rx="38" ry="9" fill="#B45309"/>
      <!-- Kibbles -->
      <circle cx="32" cy="28" r="3" fill="#D97706"/>
      <circle cx="42" cy="26" r="3.5" fill="#F59E0B"/>
      <circle cx="54" cy="29" r="3" fill="#D97706"/>
      <circle cx="48" cy="32" r="3" fill="#78350F"/>
      <circle cx="36" cy="33" r="2.5" fill="#F59E0B"/>
      <circle cx="26" cy="31" r="2.5" fill="#78350F"/>
      <circle cx="62" cy="30" r="2.5" fill="#F59E0B"/>
    </g>
    <!-- Floating Bone Treat -->
    <g transform="translate(225, 75) rotate(-20)">
      <rect x="10" y="8" width="30" height="8" rx="2" fill="#FCD34D"/>
      <circle cx="8" cy="7" r="6" fill="#FCD34D"/>
      <circle cx="8" cy="17" r="6" fill="#FCD34D"/>
      <circle cx="42" cy="7" r="6" fill="#FCD34D"/>
      <circle cx="42" cy="17" r="6" fill="#FCD34D"/>
    </g>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="88" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(245,158,11,0.12))" stroke="var(--sp-ill-tag-border, #FBBF24)" stroke-width="1"/>
      <text x="56" y="29" fill="var(--sp-ill-tag-text, #D97706)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">NUTRITION</text>
    </g>
  </svg>`,
};

export const illustrationPetAdoption: IllustrationDefinition = {
  name: 'pet-adoption',
  title: 'Pet Adoption & Shelter Rescue',
  category: 'pet-care',
  tags: ['pet', 'adoption', 'rescue', 'shelter', 'dog', 'puppy', 'cat', 'kitten', 'heart', 'care'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="195" rx="88" ry="18" fill="var(--sp-ill-halo, rgba(236,72,153,0.12))"/>
    <circle cx="160" cy="120" r="76" fill="var(--sp-ill-halo, rgba(236,72,153,0.06))"/>
    <!-- Shelter House / Kennel -->
    <g>
      <!-- House Wall -->
      <rect x="90" y="105" width="140" height="85" rx="6" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
      <!-- Roof -->
      <polygon points="75,108 160,45 245,108" fill="#EC4899"/>
      <!-- Roof Eaves Accent -->
      <polygon points="80,108 160,52 240,108" fill="#F472B6"/>
      <!-- Arched Doorway Entrance -->
      <path d="M125 190 L125 140 C125 120 195 120 195 140 L195 190 Z" fill="#334155"/>
    </g>
    <!-- Puppy Peeking Out -->
    <g transform="translate(132, 132)">
      <!-- Head -->
      <circle cx="18" cy="20" r="16" fill="#F59E0B"/>
      <!-- Ears -->
      <ellipse cx="4" cy="18" rx="5" ry="11" fill="#D97706" transform="rotate(-20 4 18)"/>
      <ellipse cx="32" cy="18" rx="5" ry="11" fill="#D97706" transform="rotate(20 32 18)"/>
      <!-- Eyes & Snout -->
      <circle cx="13" cy="18" r="2.5" fill="#1E293B"/>
      <circle cx="23" cy="18" r="2.5" fill="#1E293B"/>
      <ellipse cx="18" cy="24" rx="4" ry="3" fill="#1E293B"/>
      <!-- Paws on Threshold -->
      <ellipse cx="8" cy="42" rx="7" ry="5" fill="#F59E0B"/>
      <ellipse cx="28" cy="42" rx="7" ry="5" fill="#F59E0B"/>
    </g>
    <!-- Kitten Peeking Beside -->
    <g transform="translate(162, 136)">
      <circle cx="16" cy="18" r="14" fill="#94A3B8"/>
      <!-- Pointy cat ears -->
      <polygon points="5,12 8,2 14,9" fill="#94A3B8"/>
      <polygon points="18,9 24,2 27,12" fill="#94A3B8"/>
      <polygon points="7,10 9,4 13,8" fill="#F472B6"/>
      <polygon points="19,8 23,4 25,10" fill="#F472B6"/>
      <!-- Eyes -->
      <ellipse cx="11" cy="18" rx="2" ry="3" fill="#10B981"/>
      <ellipse cx="21" cy="18" rx="2" ry="3" fill="#10B981"/>
      <polygon points="15,22 17,22 16,24" fill="#F43F5E"/>
    </g>
    <!-- Loving Heart Above House -->
    <g transform="translate(142, 62)">
      <path d="M18 6 C12 0 0 3 0 14 C0 24 14 34 18 38 C22 34 36 24 36 14 C36 3 24 0 18 6 Z" fill="#EF4444"/>
    </g>
    <!-- Adoption Medal / Certificate Tag Ribbon -->
    <g transform="translate(245, 125)">
      <circle cx="20" cy="20" r="18" fill="#F59E0B"/>
      <circle cx="20" cy="20" r="14" fill="#FEF3C7"/>
      <path d="M14 26 L8 45 L18 40 L28 45 L22 26 Z" fill="#F59E0B"/>
      <!-- Checkmark -->
      <path d="M14 20 L18 24 L26 15" fill="none" stroke="#D97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="82" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(236,72,153,0.12))" stroke="var(--sp-ill-tag-border, #F472B6)" stroke-width="1"/>
      <text x="53" y="29" fill="var(--sp-ill-tag-text, #DB2777)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">ADOPTED</text>
    </g>
  </svg>`,
};

export const illustrationPetPlay: IllustrationDefinition = {
  name: 'pet-play',
  title: 'Pet Play & Agility Training',
  category: 'pet-care',
  tags: ['pet', 'play', 'agility', 'frisbee', 'dog', 'ball', 'training', 'active', 'exercise'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="200" rx="95" ry="18" fill="var(--sp-ill-halo, rgba(16,185,129,0.12))"/>
    <circle cx="160" cy="120" r="76" fill="var(--sp-ill-halo, rgba(16,185,129,0.06))"/>
    <!-- Agility Jump Hurdle Left -->
    <g>
      <!-- Hurdle Posts -->
      <rect x="70" y="110" width="6" height="85" rx="3" fill="#0284C7"/>
      <rect x="130" y="110" width="6" height="85" rx="3" fill="#0284C7"/>
      <!-- Hurdle Feet -->
      <rect x="62" y="192" width="22" height="6" rx="3" fill="#0369A1"/>
      <rect x="122" y="192" width="22" height="6" rx="3" fill="#0369A1"/>
      <!-- Hurdle Bars (Striped) -->
      <rect x="73" y="125" width="60" height="8" rx="2" fill="#F59E0B"/>
      <rect x="85" y="125" width="12" height="8" fill="#FFFFFF"/>
      <rect x="109" y="125" width="12" height="8" fill="#FFFFFF"/>
      <rect x="73" y="150" width="60" height="8" rx="2" fill="#F59E0B"/>
      <rect x="85" y="150" width="12" height="8" fill="#FFFFFF"/>
      <rect x="109" y="150" width="12" height="8" fill="#FFFFFF"/>
    </g>
    <!-- Jumping Dog in Mid-Air -->
    <g transform="translate(130, 75) rotate(-15)">
      <!-- Torso -->
      <ellipse cx="45" cy="35" rx="30" ry="16" fill="#F59E0B"/>
      <!-- Back legs extended -->
      <path d="M22 38 L4 55 L-4 50 L14 34 Z" fill="#D97706"/>
      <!-- Front legs reaching -->
      <path d="M68 32 L88 44 L85 50 L62 38 Z" fill="#D97706"/>
      <!-- Tail -->
      <path d="M18 30 C10 20 4 10 0 12 C2 20 12 26 18 28 Z" fill="#D97706"/>
      <!-- Head & Jaws open towards frisbee -->
      <circle cx="72" cy="22" r="14" fill="#F59E0B"/>
      <ellipse cx="64" cy="15" rx="4" ry="10" fill="#D97706" transform="rotate(-30 64 15)"/>
      <path d="M80 18 L94 15 L90 22 Z" fill="#F59E0B"/>
      <path d="M80 24 L92 27 L88 23 Z" fill="#F59E0B"/>
      <circle cx="75" cy="18" r="2" fill="#1E293B"/>
    </g>
    <!-- Flying Frisbee Disc in Air -->
    <g transform="translate(230, 65) rotate(15)">
      <ellipse cx="25" cy="10" rx="25" ry="7" fill="#EF4444"/>
      <ellipse cx="25" cy="8" rx="22" ry="5" fill="#F87171"/>
      <ellipse cx="25" cy="7" rx="16" ry="3" fill="#FECACA"/>
      <!-- Motion Dash Lines Behind Frisbee -->
      <line x1="-15" y1="12" x2="-2" y2="12" stroke="#EF4444" stroke-width="2" stroke-dasharray="3,3"/>
      <line x1="-25" y1="8" x2="-8" y2="8" stroke="#EF4444" stroke-width="2" stroke-dasharray="4,4"/>
    </g>
    <!-- Tennis Ball with Bounce Arc -->
    <g transform="translate(245, 140)">
      <circle cx="16" cy="16" r="12" fill="#84CC16"/>
      <path d="M8 8 C14 12 14 20 8 24" fill="none" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M24 8 C18 12 18 20 24 24" fill="none" stroke="#FFFFFF" stroke-width="2"/>
      <!-- Trajectory curve -->
      <path d="M-40 40 Q -10 -10 16 16" fill="none" stroke="var(--sp-ill-line, #CBD5E1)" stroke-width="1.5" stroke-dasharray="3,3"/>
    </g>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="94" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(16,185,129,0.12))" stroke="var(--sp-ill-tag-border, #34D399)" stroke-width="1"/>
      <text x="59" y="29" fill="var(--sp-ill-tag-text, #059669)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">ACTIVE PLAY</text>
    </g>
  </svg>`,
};

export const PET_CARE_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationVeterinaryCare,
  illustrationPetGrooming,
  illustrationPetNutrition,
  illustrationPetAdoption,
  illustrationPetPlay,
] as const;
