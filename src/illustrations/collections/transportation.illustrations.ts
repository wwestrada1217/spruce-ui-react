import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationElectricFleet: IllustrationDefinition = {
  name: 'electric-fleet',
  title: 'Electric Fleet Vehicle',
  category: 'transportation',
  tags: ['transportation', 'fleet', 'ev', 'electric', 'van', 'vehicle', 'mobility', 'clean-energy'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <ellipse cx="160" cy="188" rx="88" ry="10" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.15))"/>
  <!-- Van Body -->
  <path d="M70 120H184V164H70V120Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <!-- Cab -->
  <path d="M184 120H214L234 144V164H184V120Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <!-- Windshield -->
  <polygon points="188,124 210,124 226,144 188,144" fill="#93C5FD"/>
  <!-- Eco Stripe -->
  <rect x="70" y="146" width="114" height="6" fill="#10B981"/>
  <!-- Wheels -->
  <circle cx="106" cy="166" r="16" fill="#1E293B"/>
  <circle cx="106" cy="166" r="7" fill="#CBD5E1"/>
  <circle cx="206" cy="166" r="16" fill="#1E293B"/>
  <circle cx="206" cy="166" r="7" fill="#CBD5E1"/>
  <!-- EV Plug Badge -->
  <circle cx="242" cy="100" r="16" fill="#10B981"/>
  <path d="M238 94L242 100H238L246 108L244 102H248L240 94" fill="#FFFFFF"/>
  <!-- GPS Beacon Wave -->
  <circle cx="130" cy="88" r="8" fill="#3B82F6"/>
  <path d="M118 80C124 74 136 74 142 80" stroke="#60A5FA" stroke-width="2" stroke-linecap="round"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#047857" text-anchor="middle" letter-spacing="1">FLEET READY</text>
  </g>
</svg>`,
};

export const illustrationBulletTrain: IllustrationDefinition = {
  name: 'bullet-train',
  title: 'High-Speed Rail Transit',
  category: 'transportation',
  tags: ['train', 'transit', 'rail', 'speed', 'bullet-train', 'transportation', 'commute', 'metro'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(59, 130, 246, 0.12))"/>
  <!-- Tracks -->
  <line x1="50" y1="172" x2="270" y2="172" stroke="#64748B" stroke-width="4" stroke-linecap="round"/>
  <line x1="50" y1="180" x2="270" y2="180" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
  <!-- Sleepers -->
  <line x1="70" y1="168" x2="70" y2="184" stroke="#CBD5E1" stroke-width="3"/>
  <line x1="100" y1="168" x2="100" y2="184" stroke="#CBD5E1" stroke-width="3"/>
  <line x1="130" y1="168" x2="130" y2="184" stroke="#CBD5E1" stroke-width="3"/>
  <line x1="160" y1="168" x2="160" y2="184" stroke="#CBD5E1" stroke-width="3"/>
  <line x1="190" y1="168" x2="190" y2="184" stroke="#CBD5E1" stroke-width="3"/>
  <line x1="220" y1="168" x2="220" y2="184" stroke="#CBD5E1" stroke-width="3"/>
  <line x1="250" y1="168" x2="250" y2="184" stroke="#CBD5E1" stroke-width="3"/>
  <!-- Aerodynamic Locomotive Train -->
  <path d="M60 118H200C224 118 256 138 262 168H60V118Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#1E3A8A" stroke-width="2.5"/>
  <!-- Streamline Accent -->
  <path d="M60 142H242" stroke="#3B82F6" stroke-width="5"/>
  <!-- Nose Windshield -->
  <path d="M216 126H232C244 134 248 142 248 144H216V126Z" fill="#1E293B"/>
  <!-- Passenger Windows -->
  <rect x="74" y="126" width="22" height="12" rx="2" fill="#93C5FD"/>
  <rect x="106" y="126" width="22" height="12" rx="2" fill="#93C5FD"/>
  <rect x="138" y="126" width="22" height="12" rx="2" fill="#93C5FD"/>
  <rect x="170" y="126" width="22" height="12" rx="2" fill="#93C5FD"/>
  <!-- Speed Trails -->
  <line x1="30" y1="130" x2="52" y2="130" stroke="#93C5FD" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="40" y1="142" x2="52" y2="142" stroke="#60A5FA" stroke-width="3" stroke-linecap="round"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="202" width="100" height="24" rx="12" fill="var(--sp-ill-card, #EFF6FF)" stroke="#3B82F6" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#1D4ED8" text-anchor="middle" letter-spacing="1">HIGH SPEED</text>
  </g>
</svg>`,
};

export const illustrationCommercialAviation: IllustrationDefinition = {
  name: 'commercial-aviation',
  title: 'Commercial Flight & Aviation',
  category: 'transportation',
  tags: ['aviation', 'plane', 'airplane', 'flight', 'air-travel', 'transportation', 'sky', 'route'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(2, 132, 199, 0.12))"/>
  <!-- Soft Clouds -->
  <path d="M60 148C60 140 68 136 76 136C80 128 90 128 96 132C102 124 114 124 120 130C126 130 132 136 132 144C132 152 126 156 118 156H70C64 156 60 152 60 148Z" fill="#E2E8F0" fill-opacity="0.6"/>
  <path d="M200 160C200 152 208 148 216 148C220 140 230 140 236 144C242 136 254 136 260 142C266 142 272 148 272 156C272 164 266 168 258 168H210C204 168 200 164 200 160Z" fill="#E2E8F0" fill-opacity="0.6"/>
  <!-- Airplane Flying Diagonally Right-Up -->
  <g transform="translate(140, 96) rotate(-15)">
    <!-- Fuselage -->
    <path d="M-80 0C-80 -8 60 -8 90 0C60 8 -80 8 -80 0Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#0284C7" stroke-width="2.5"/>
    <!-- Cockpit -->
    <path d="M66 -4L78 0L66 4" fill="#0284C7"/>
    <!-- Tail Fin -->
    <polygon points="-80,-2 -70,-26 -52,-2" fill="#0284C7"/>
    <!-- Wings -->
    <polygon points="-10,0 20,-48 36,-48 10,0" fill="#38BDF8"/>
    <polygon points="-10,0 20,48 36,48 10,0" fill="#0284C7"/>
    <!-- Jet Engine -->
    <rect x="0" y="16" width="22" height="8" rx="4" fill="#64748B"/>
  </g>
  <!-- Flight Contrail -->
  <line x1="50" y1="134" x2="96" y2="120" stroke="#93C5FD" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="4 4"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="110" y="202" width="100" height="24" rx="12" fill="var(--sp-ill-card, #F0F9FF)" stroke="#0284C7" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#0369A1" text-anchor="middle" letter-spacing="1">IN FLIGHT</text>
  </g>
</svg>`,
};

export const illustrationSmartTraffic: IllustrationDefinition = {
  name: 'smart-traffic',
  title: 'Smart City Traffic Management',
  category: 'transportation',
  tags: ['traffic', 'smart-city', 'roads', 'signals', 'transit', 'transportation', 'routing'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.12))"/>
  <!-- Road Grid Cross -->
  <rect x="70" y="96" width="180" height="40" fill="#334155"/>
  <rect x="140" y="40" width="40" height="144" fill="#334155"/>
  <!-- Road Dashes -->
  <line x1="74" y1="116" x2="136" y2="116" stroke="#FBBF24" stroke-width="2" stroke-dasharray="6 4"/>
  <line x1="184" y1="116" x2="246" y2="116" stroke="#FBBF24" stroke-width="2" stroke-dasharray="6 4"/>
  <line x1="160" y1="44" x2="160" y2="92" stroke="#FBBF24" stroke-width="2" stroke-dasharray="6 4"/>
  <line x1="160" y1="140" x2="160" y2="180" stroke="#FBBF24" stroke-width="2" stroke-dasharray="6 4"/>
  <!-- Traffic Light Post -->
  <rect x="194" y="52" width="16" height="42" rx="4" fill="#0F172A"/>
  <circle cx="202" cy="62" r="4" fill="#EF4444"/>
  <circle cx="202" cy="73" r="4" fill="#F59E0B" fill-opacity="0.3"/>
  <circle cx="202" cy="84" r="4" fill="#10B981"/>
  <!-- Vehicle on Road -->
  <rect x="94" y="102" width="26" height="14" rx="3" fill="#3B82F6"/>
  <circle cx="99" cy="116" r="2" fill="#0F172A"/>
  <circle cx="115" cy="116" r="2" fill="#0F172A"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#B45309" text-anchor="middle" letter-spacing="1">OPTIMIZED</text>
  </g>
</svg>`,
};

export const illustrationRideNavigation: IllustrationDefinition = {
  name: 'ride-navigation',
  title: 'Ride Hailing & GPS Navigation',
  category: 'transportation',
  tags: ['ride', 'hailing', 'gps', 'navigation', 'map', 'car', 'booking', 'transportation'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="116" r="88" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <!-- Smartphone Outline -->
  <rect x="115" y="44" width="90" height="144" rx="12" fill="var(--sp-ill-card, #FFFFFF)" stroke="#334155" stroke-width="2.5"/>
  <rect x="145" y="50" width="30" height="4" rx="2" fill="#94A3B8"/>
  <!-- Screen Map View -->
  <rect x="123" y="60" width="74" height="114" rx="4" fill="#F8FAFC"/>
  <!-- Map Route Path -->
  <path d="M136 156C136 130 160 134 160 110C160 88 174 88 174 74" stroke="#10B981" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Start Pin -->
  <circle cx="136" cy="156" r="4" fill="#3B82F6"/>
  <!-- Destination Pin -->
  <circle cx="174" cy="74" r="6" fill="#EF4444"/>
  <circle cx="174" cy="74" r="2" fill="#FFFFFF"/>
  <!-- Car Indicator along Route -->
  <rect x="152" y="104" width="16" height="10" rx="2" fill="#1E293B"/>
  <circle cx="155" cy="114" r="1.5" fill="#64748B"/>
  <circle cx="165" cy="114" r="1.5" fill="#64748B"/>
  <!-- Badge -->
  <g class="sp-ill-badge">
    <rect x="105" y="202" width="110" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="1.5"/>
    <text x="160" y="218" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#047857" text-anchor="middle" letter-spacing="1">DISPATCHED</text>
  </g>
</svg>`,
};

export const TRANSPORTATION_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationElectricFleet,
  illustrationBulletTrain,
  illustrationCommercialAviation,
  illustrationSmartTraffic,
  illustrationRideNavigation,
] as const;
