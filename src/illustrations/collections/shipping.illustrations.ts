import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationCargoShip: IllustrationDefinition = {
  name: 'cargo-ship',
  title: 'Ocean Cargo Container Ship',
  category: 'shipping',
  tags: ['shipping', 'cargo', 'ship', 'containers', 'freight', 'ocean', 'maritime', 'logistics'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(2, 132, 199, 0.12))"/>
  <!-- Sea Waves -->
  <path d="M50 172C70 170 85 174 105 172C125 170 140 174 160 172C180 170 195 174 215 172C235 170 250 174 270 172" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
  <path d="M60 182C80 180 95 184 115 182C135 180 150 184 170 182C190 180 205 184 225 182C245 180 255 184 265 182" stroke="#0284C7" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Ship Hull -->
  <path d="M64 148L80 172H240L266 148H64Z" fill="#1E293B"/>
  <rect x="74" y="148" width="182" height="4" fill="#EF4444"/>
  <!-- Containers Tier 1 -->
  <rect x="88" y="128" width="32" height="18" rx="2" fill="#3B82F6" stroke="#1D4ED8" stroke-width="1"/>
  <rect x="124" y="128" width="32" height="18" rx="2" fill="#10B981" stroke="#047857" stroke-width="1"/>
  <rect x="160" y="128" width="32" height="18" rx="2" fill="#F59E0B" stroke="#B45309" stroke-width="1"/>
  <rect x="196" y="128" width="32" height="18" rx="2" fill="#EF4444" stroke="#B91C1C" stroke-width="1"/>
  <!-- Containers Tier 2 -->
  <rect x="100" y="108" width="32" height="18" rx="2" fill="#8B5CF6" stroke="#6D28D9" stroke-width="1"/>
  <rect x="136" y="108" width="32" height="18" rx="2" fill="#06B6D4" stroke="#0891B2" stroke-width="1"/>
  <rect x="172" y="108" width="32" height="18" rx="2" fill="#3B82F6" stroke="#1D4ED8" stroke-width="1"/>
  <!-- Wheelhouse / Bridge Tower -->
  <rect x="232" y="112" width="22" height="36" rx="2" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="1.5"/>
  <rect x="236" y="116" width="14" height="6" fill="#93C5FD"/>
  <line x1="243" y1="112" x2="243" y2="100" stroke="#334155" stroke-width="2"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="202" width="100" height="24" rx="12" fill="var(--sp-ill-card, #F0F9FF)" stroke="#0284C7" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#0369A1" text-anchor="middle" letter-spacing="1">FREIGHT AT SEA</text>
  </g>
</svg>`,
};

export const illustrationFreightTruck: IllustrationDefinition = {
  name: 'freight-truck',
  title: 'Heavy Logistics Freight Truck',
  category: 'shipping',
  tags: ['freight', 'truck', 'semi', 'shipping', 'cargo', 'highway', 'logistics', 'delivery'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <ellipse cx="160" cy="188" rx="88" ry="10" fill="var(--sp-ill-halo, rgba(59, 130, 246, 0.15))"/>
  <!-- Trailer Box -->
  <rect x="60" y="104" width="130" height="62" rx="4" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <line x1="125" y1="104" x2="125" y2="166" stroke="#E2E8F0" stroke-width="1.5"/>
  <rect x="60" y="148" width="130" height="6" fill="#3B82F6"/>
  <!-- Tractor Cab -->
  <path d="M192 120H222L246 142V166H192V120Z" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2"/>
  <!-- Windshield -->
  <polygon points="196,124 218,124 238,142 196,142" fill="#93C5FD"/>
  <!-- Exhaust Stack -->
  <line x1="194" y1="120" x2="194" y2="102" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
  <!-- Headlight Beam -->
  <polygon points="246,152 278,144 278,168 246,160" fill="#FEF08A" fill-opacity="0.35"/>
  <!-- Wheels with Rims -->
  <circle cx="84" cy="168" r="14" fill="#1E293B"/>
  <circle cx="84" cy="168" r="6" fill="#CBD5E1"/>
  <circle cx="114" cy="168" r="14" fill="#1E293B"/>
  <circle cx="114" cy="168" r="6" fill="#CBD5E1"/>
  <circle cx="226" cy="168" r="14" fill="#1E293B"/>
  <circle cx="226" cy="168" r="6" fill="#CBD5E1"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="202" width="100" height="24" rx="12" fill="var(--sp-ill-card, #EFF6FF)" stroke="#3B82F6" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#1D4ED8" text-anchor="middle" letter-spacing="1">IN TRANSIT</text>
  </g>
</svg>`,
};

export const illustrationAirCargo: IllustrationDefinition = {
  name: 'air-cargo',
  title: 'Air Express Cargo Logistics',
  category: 'shipping',
  tags: ['air-cargo', 'shipping', 'plane', 'freight', 'pallet', 'forklift', 'logistics', 'express'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.12))"/>
  <!-- Cargo Plane Fuselage Nose Open / Loading -->
  <path d="M120 74C160 74 240 90 260 120H150V166H100C80 166 70 148 70 120C70 92 90 74 120 74Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <!-- Raised Cargo Door -->
  <path d="M150 120L190 70" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
  <!-- Loading Ramp -->
  <polygon points="150,166 210,172 150,172" fill="#64748B"/>
  <!-- Cargo Pallet Container -->
  <rect x="166" y="140" width="28" height="26" rx="2" fill="#F59E0B" stroke="#B45309" stroke-width="1.5"/>
  <line x1="166" y1="153" x2="194" y2="153" stroke="#B45309" stroke-width="1.5"/>
  <!-- Forklift Silhouette -->
  <rect x="216" y="148" width="24" height="22" rx="3" fill="#3B82F6"/>
  <rect x="210" y="142" width="6" height="28" fill="#1E293B"/>
  <circle cx="222" cy="172" r="6" fill="#0F172A"/>
  <circle cx="236" cy="172" r="6" fill="#0F172A"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#B45309" text-anchor="middle" letter-spacing="1">AIR EXPRESS</text>
  </g>
</svg>`,
};

export const illustrationParcelDelivery: IllustrationDefinition = {
  name: 'parcel-delivery',
  title: 'Parcel Delivery & Package Tracking',
  category: 'shipping',
  tags: ['parcel', 'package', 'box', 'delivery', 'courier', 'shipping', 'tracking', 'doorstep'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <!-- Delivery Box Isometric View -->
  <!-- Top Face -->
  <polygon points="160,66 216,92 160,118 104,92" fill="#FDE68A" stroke="#D97706" stroke-width="2"/>
  <line x1="160" y1="66" x2="160" y2="118" stroke="#D97706" stroke-width="2"/>
  <!-- Left Face -->
  <polygon points="104,92 160,118 160,178 104,152" fill="#F59E0B" stroke="#D97706" stroke-width="2"/>
  <!-- Right Face -->
  <polygon points="160,118 216,92 216,152 160,178" fill="#D97706" stroke="#B45309" stroke-width="2"/>
  <!-- Barcode Label on Box -->
  <rect x="174" y="122" width="28" height="18" rx="1" fill="#FFFFFF" transform="skewY(18)"/>
  <line x1="178" y1="126" x2="178" y2="136" stroke="#0F172A" stroke-width="1.5" transform="skewY(18)"/>
  <line x1="182" y1="126" x2="182" y2="136" stroke="#0F172A" stroke-width="1" transform="skewY(18)"/>
  <line x1="186" y1="126" x2="186" y2="136" stroke="#0F172A" stroke-width="2" transform="skewY(18)"/>
  <line x1="192" y1="126" x2="192" y2="136" stroke="#0F172A" stroke-width="1" transform="skewY(18)"/>
  <!-- Verified Delivery Checkmark Badge -->
  <circle cx="218" cy="80" r="18" fill="#10B981"/>
  <path d="M210 80L216 86L226 74" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="202" width="100" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#047857" text-anchor="middle" letter-spacing="1">DELIVERED</text>
  </g>
</svg>`,
};

export const illustrationCustomsClearance: IllustrationDefinition = {
  name: 'customs-clearance',
  title: 'Customs & Border Clearance',
  category: 'shipping',
  tags: [
    'customs',
    'clearance',
    'border',
    'stamp',
    'approved',
    'shipping',
    'international',
    'trade',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(59, 130, 246, 0.12))"/>
  <!-- Document / Manifest Paper -->
  <rect x="94" y="56" width="132" height="130" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <!-- Header Bar -->
  <rect x="94" y="56" width="132" height="24" rx="8" fill="#3B82F6"/>
  <text x="160" y="72" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="9" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">CUSTOMS MANIFEST</text>
  <!-- Content Lines -->
  <line x1="108" y1="92" x2="160" y2="92" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
  <line x1="108" y1="102" x2="200" y2="102" stroke="#CBD5E1" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="108" y1="112" x2="190" y2="112" stroke="#CBD5E1" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="108" y1="122" x2="170" y2="122" stroke="#CBD5E1" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Green "PASSED / CLEARED" Stamp -->
  <g transform="translate(140, 126) rotate(-12)">
    <rect x="0" y="0" width="80" height="34" rx="4" fill="none" stroke="#10B981" stroke-width="2.5" stroke-dasharray="4 2"/>
    <text x="40" y="22" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="12" fill="#10B981" text-anchor="middle" letter-spacing="1">CLEARED</text>
  </g>
  <!-- Security Shield Emblem -->
  <circle cx="218" cy="164" r="14" fill="#3B82F6"/>
  <path d="M214 160L218 164L224 158" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #EFF6FF)" stroke="#3B82F6" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#1D4ED8" text-anchor="middle" letter-spacing="1">CLEARED TRADE</text>
  </g>
</svg>`,
};

export const SHIPPING_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationCargoShip,
  illustrationFreightTruck,
  illustrationAirCargo,
  illustrationParcelDelivery,
  illustrationCustomsClearance,
] as const;
