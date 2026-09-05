import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationIndustrialRobotArm: IllustrationDefinition = {
  name: 'industrial-robot-arm',
  title: 'Industrial Robot Arm & Automation',
  category: 'robotics',
  tags: [
    'robotics',
    'industrial',
    'robot-arm',
    'automation',
    'manufacturing',
    'welding',
    'factory',
    'engineering',
  ],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="205" rx="88" ry="18" fill="var(--sp-ill-halo, rgba(2,132,199,0.12))"/>
    <circle cx="160" cy="120" r="76" fill="var(--sp-ill-halo, rgba(2,132,199,0.06))"/>
    <!-- Heavy Mount Turret / Pedestal -->
    <rect x="70" y="185" width="60" height="24" rx="4" fill="#334155"/>
    <rect x="65" y="202" width="70" height="8" rx="3" fill="#1E293B"/>
    <circle cx="100" cy="180" r="16" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="3"/>
    <circle cx="100" cy="180" r="8" fill="#0284C7"/>
    <!-- Primary Arm Boom Segment -->
    <g transform="rotate(25 100 180)">
      <rect x="92" y="100" width="16" height="80" rx="6" fill="#0284C7"/>
      <line x1="100" y1="110" x2="100" y2="170" stroke="#38BDF8" stroke-width="2"/>
    </g>
    <!-- Elbow Articulation Joint -->
    <circle cx="134" cy="112" r="14" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="3"/>
    <circle cx="134" cy="112" r="7" fill="#F59E0B"/>
    <!-- Forearm Extension Segment -->
    <g transform="rotate(-30 134 112)">
      <rect x="127" y="52" width="14" height="60" rx="5" fill="#0369A1"/>
      <!-- Hydraulic cylinder -->
      <rect x="142" y="65" width="5" height="40" rx="2" fill="#94A3B8"/>
      <rect x="143" y="78" width="3" height="30" fill="#CBD5E1"/>
    </g>
    <!-- Wrist Joint & End Effector / Tool -->
    <circle cx="164" cy="62" r="10" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2.5"/>
    <!-- Welder Tool / Gripper -->
    <g transform="translate(164, 52) rotate(45)">
      <rect x="0" y="4" width="28" height="12" rx="2" fill="#475569"/>
      <polygon points="28,7 40,9 40,11 28,13" fill="#F59E0B"/>
      <!-- Welding Spark Sparks -->
      <polygon points="46,10 49,5 54,9 50,13 56,16 48,15 45,21 44,14" fill="#FCD34D"/>
      <circle cx="48" cy="4" r="1.5" fill="#EF4444"/>
      <circle cx="53" cy="18" r="1.5" fill="#F59E0B"/>
    </g>
    <!-- Workpiece on Assembly Rail -->
    <rect x="200" y="145" width="70" height="48" rx="4" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
    <line x1="205" y1="160" x2="265" y2="160" stroke="#38BDF8" stroke-width="2"/>
    <rect x="215" y="170" width="40" height="14" rx="2" fill="var(--sp-ill-line, #CBD5E1)"/>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="102" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(2,132,199,0.12))" stroke="var(--sp-ill-tag-border, #38BDF8)" stroke-width="1"/>
      <text x="63" y="29" fill="var(--sp-ill-tag-text, #0284C7)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">AUTOMATION</text>
    </g>
  </svg>`,
};

export const illustrationHumanoidRobot: IllustrationDefinition = {
  name: 'humanoid-robot',
  title: 'Humanoid AI Robot',
  category: 'robotics',
  tags: ['robotics', 'humanoid', 'robot', 'ai', 'android', 'cyborg', 'futuristic', 'intelligence'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="202" rx="88" ry="18" fill="var(--sp-ill-halo, rgba(99,102,241,0.12))"/>
    <circle cx="160" cy="118" r="76" fill="var(--sp-ill-halo, rgba(99,102,241,0.06))"/>
    <!-- Robotic Torso Chassis -->
    <path d="M110 135 L120 205 L200 205 L210 135 L195 125 L125 125 Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2.5"/>
    <!-- Armor Paneling Lines -->
    <path d="M125 138 L160 162 L195 138" fill="none" stroke="var(--sp-ill-line, #E2E8F0)" stroke-width="2"/>
    <line x1="160" y1="162" x2="160" y2="202" stroke="var(--sp-ill-line, #E2E8F0)" stroke-width="2"/>
    <!-- Illuminated Cybernetic Core in Chest -->
    <circle cx="160" cy="155" r="16" fill="#1E293B"/>
    <circle cx="160" cy="155" r="12" fill="#6366F1"/>
    <circle cx="160" cy="155" r="6" fill="#38BDF8"/>
    <!-- Shoulder Ball Joints -->
    <circle cx="102" cy="140" r="16" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
    <circle cx="102" cy="140" r="8" fill="#475569"/>
    <circle cx="218" cy="140" r="16" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
    <circle cx="218" cy="140" r="8" fill="#475569"/>
    <!-- Articulated Neck Hydraulics -->
    <rect x="150" y="108" width="20" height="20" rx="3" fill="#64748B"/>
    <line x1="154" y1="110" x2="154" y2="126" stroke="#94A3B8" stroke-width="2"/>
    <line x1="166" y1="110" x2="166" y2="126" stroke="#94A3B8" stroke-width="2"/>
    <!-- Android Head -->
    <path d="M135 70 C135 50 146 42 160 42 C174 42 185 50 185 70 L180 106 C180 112 172 116 160 116 C148 116 140 112 140 106 Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2.5"/>
    <!-- Head Temple Audio Ports -->
    <circle cx="134" cy="74" r="4" fill="#64748B"/>
    <circle cx="186" cy="74" r="4" fill="#64748B"/>
    <!-- Glowing Visor Eye Screen -->
    <rect x="142" y="65" width="36" height="14" rx="7" fill="#1E293B"/>
    <line x1="147" y1="72" x2="173" y2="72" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
    <!-- Forehead Circuit Node -->
    <circle cx="160" cy="52" r="2.5" fill="#6366F1"/>
    <!-- Circuit lines in background -->
    <path d="M70 90 L95 90 L105 110" fill="none" stroke="var(--sp-ill-line, #CBD5E1)" stroke-width="1.5" stroke-dasharray="3,3"/>
    <circle cx="70" cy="90" r="3" fill="#38BDF8"/>
    <path d="M250 90 L225 90 L215 110" fill="none" stroke="var(--sp-ill-line, #CBD5E1)" stroke-width="1.5" stroke-dasharray="3,3"/>
    <circle cx="250" cy="90" r="3" fill="#6366F1"/>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="98" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(99,102,241,0.12))" stroke="var(--sp-ill-tag-border, #818CF8)" stroke-width="1"/>
      <text x="61" y="29" fill="var(--sp-ill-tag-text, #4F46E5)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">HUMANOID AI</text>
    </g>
  </svg>`,
};

export const illustrationAutonomousMobileRobot: IllustrationDefinition = {
  name: 'autonomous-mobile-robot',
  title: 'Autonomous Mobile Robot (AMR)',
  category: 'robotics',
  tags: ['robotics', 'amr', 'agv', 'autonomous', 'logistics', 'warehouse', 'mobile-robot', 'lidar'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="205" rx="90" ry="18" fill="var(--sp-ill-halo, rgba(16,185,129,0.12))"/>
    <circle cx="160" cy="120" r="76" fill="var(--sp-ill-halo, rgba(16,185,129,0.06))"/>
    <!-- AMR Low-Profile Chassis Body -->
    <rect x="90" y="152" width="140" height="38" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2.5"/>
    <!-- Heavy Rubber Wheels -->
    <rect x="100" y="186" width="22" height="12" rx="3" fill="#1E293B"/>
    <rect x="198" y="186" width="22" height="12" rx="3" fill="#1E293B"/>
    <!-- Front/Rear Status LED Strips -->
    <rect x="94" y="162" width="6" height="18" rx="2" fill="#10B981"/>
    <rect x="220" y="162" width="6" height="18" rx="2" fill="#F59E0B"/>
    <!-- Emergency Stop Push Button -->
    <rect x="110" y="146" width="8" height="6" rx="2" fill="#EF4444"/>
    <!-- 360 Lidar Sensor Puck Center Top -->
    <rect x="150" y="140" width="20" height="12" rx="3" fill="#334155"/>
    <rect x="153" y="136" width="14" height="5" rx="2" fill="#38BDF8"/>
    <!-- Lidar Scanning Laser Rays (Dotted Arc) -->
    <path d="M70 120 Q 160 85 250 120" fill="none" stroke="#10B981" stroke-width="1.5" stroke-dasharray="4,4"/>
    <path d="M85 105 Q 160 70 235 105" fill="none" stroke="#10B981" stroke-width="1.5" stroke-dasharray="4,4"/>
    <!-- Cargo Bin / Pallet on Top -->
    <g transform="translate(115, 82)">
      <rect x="0" y="0" width="90" height="52" rx="5" fill="#0284C7"/>
      <!-- Cargo crate ribs -->
      <rect x="8" y="8" width="74" height="36" rx="3" fill="#0369A1"/>
      <line x1="8" y1="8" x2="82" y2="44" stroke="#0284C7" stroke-width="2"/>
      <line x1="8" y1="44" x2="82" y2="8" stroke="#0284C7" stroke-width="2"/>
      <rect x="35" y="20" width="20" height="12" rx="2" fill="#FFFFFF"/>
      <!-- Barcode on box -->
      <line x1="39" y1="23" x2="39" y2="29" stroke="#1E293B" stroke-width="1.5"/>
      <line x1="43" y1="23" x2="43" y2="29" stroke="#1E293B" stroke-width="1"/>
      <line x1="47" y1="23" x2="47" y2="29" stroke="#1E293B" stroke-width="1.5"/>
      <line x1="51" y1="23" x2="51" y2="29" stroke="#1E293B" stroke-width="1"/>
    </g>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="108" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(16,185,129,0.12))" stroke="var(--sp-ill-tag-border, #34D399)" stroke-width="1"/>
      <text x="66" y="29" fill="var(--sp-ill-tag-text, #059669)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">AMR LOGISTICS</text>
    </g>
  </svg>`,
};

export const illustrationDroneBot: IllustrationDefinition = {
  name: 'drone-bot',
  title: 'Autonomous Drone & Aerial Robotics',
  category: 'robotics',
  tags: ['robotics', 'drone', 'aerial', 'uav', 'quadcopter', 'camera', 'flight', 'autonomous'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="202" rx="90" ry="18" fill="var(--sp-ill-halo, rgba(14,165,233,0.12))"/>
    <circle cx="160" cy="118" r="76" fill="var(--sp-ill-halo, rgba(14,165,233,0.06))"/>
    <!-- Flight Path / Telemetry Guide -->
    <path d="M50 185 C80 160 110 130 160 115 C210 100 240 135 270 110" fill="none" stroke="var(--sp-ill-line, #CBD5E1)" stroke-width="1.5" stroke-dasharray="4,4"/>
    <!-- Drone Central Core Body -->
    <ellipse cx="160" cy="112" rx="28" ry="16" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2.5"/>
    <ellipse cx="160" cy="108" rx="18" ry="8" fill="#0284C7"/>
    <!-- Carbon Fiber Rotor Arms -->
    <line x1="160" y1="112" x2="85" y2="82" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
    <line x1="160" y1="112" x2="235" y2="82" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
    <line x1="160" y1="112" x2="95" y2="135" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
    <line x1="160" y1="112" x2="225" y2="135" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
    <!-- Rotor Motor Pods -->
    <circle cx="85" cy="82" r="8" fill="#64748B"/>
    <circle cx="235" cy="82" r="8" fill="#64748B"/>
    <circle cx="95" cy="135" r="8" fill="#64748B"/>
    <circle cx="225" cy="135" r="8" fill="#64748B"/>
    <!-- Spinning Propeller Blades -->
    <ellipse cx="85" cy="74" rx="26" ry="4" fill="rgba(56,189,248,0.5)"/>
    <ellipse cx="235" cy="74" rx="26" ry="4" fill="rgba(56,189,248,0.5)"/>
    <ellipse cx="95" cy="127" rx="26" ry="4" fill="rgba(56,189,248,0.5)"/>
    <ellipse cx="225" cy="127" rx="26" ry="4" fill="rgba(56,189,248,0.5)"/>
    <!-- Landing Skid Struts -->
    <path d="M142 125 L135 145 L115 145" fill="none" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
    <path d="M178 125 L185 145 L205 145" fill="none" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
    <!-- 4K Camera Gimbal Underneath -->
    <circle cx="160" cy="136" r="10" fill="#1E293B"/>
    <circle cx="160" cy="136" r="6" fill="#38BDF8"/>
    <!-- Video Target Reticle Rings -->
    <circle cx="160" cy="136" r="22" fill="none" stroke="rgba(56,189,248,0.3)" stroke-width="1.5" stroke-dasharray="3,3"/>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="92" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(14,165,233,0.12))" stroke="var(--sp-ill-tag-border, #38BDF8)" stroke-width="1"/>
      <text x="58" y="29" fill="var(--sp-ill-tag-text, #0284C7)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">AERIAL BOT</text>
    </g>
  </svg>`,
};

export const illustrationBionicHand: IllustrationDefinition = {
  name: 'bionic-hand',
  title: 'Bionic Prosthetic & Cybernetics',
  category: 'robotics',
  tags: ['robotics', 'bionic', 'prosthetic', 'cybernetics', 'hand', 'neural', 'prosthesis', 'limb'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
    <ellipse cx="160" cy="205" rx="88" ry="18" fill="var(--sp-ill-halo, rgba(99,102,241,0.12))"/>
    <circle cx="160" cy="118" r="76" fill="var(--sp-ill-halo, rgba(99,102,241,0.06))"/>
    <!-- Forearm Prosthetic Socket -->
    <path d="M135 210 L138 155 L182 155 L185 210 Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2.5"/>
    <!-- Neural Interface Sensor Band -->
    <rect x="136" y="180" width="48" height="12" rx="3" fill="#6366F1"/>
    <circle cx="146" cy="186" r="2.5" fill="#FFFFFF"/>
    <circle cx="160" cy="186" r="2.5" fill="#38BDF8"/>
    <circle cx="174" cy="186" r="2.5" fill="#FFFFFF"/>
    <!-- Wrist Joint -->
    <circle cx="160" cy="148" r="14" fill="#334155"/>
    <circle cx="160" cy="148" r="7" fill="#0284C7"/>
    <!-- Palm Metacarpal Frame -->
    <path d="M138 142 L132 110 L188 110 L182 142 Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-card-border, #CBD5E1)" stroke-width="2"/>
    <!-- Palm Internal Circuitry Lines -->
    <line x1="145" y1="135" x2="142" y2="114" stroke="#38BDF8" stroke-width="2"/>
    <line x1="155" y1="138" x2="153" y2="114" stroke="#6366F1" stroke-width="2"/>
    <line x1="165" y1="138" x2="167" y2="114" stroke="#6366F1" stroke-width="2"/>
    <line x1="175" y1="135" x2="178" y2="114" stroke="#38BDF8" stroke-width="2"/>
    <!-- Thumb (Angled Left) -->
    <g transform="translate(122, 118) rotate(-35)">
      <rect x="0" y="-12" width="10" height="16" rx="3" fill="#64748B"/>
      <circle cx="5" cy="4" r="4" fill="#0284C7"/>
      <rect x="0" y="4" width="10" height="14" rx="3" fill="#475569"/>
    </g>
    <!-- Index Finger -->
    <g transform="translate(136, 110)">
      <rect x="0" y="-16" width="8" height="16" rx="2" fill="#64748B"/>
      <circle cx="4" cy="-16" r="3.5" fill="#0284C7"/>
      <rect x="0" y="-32" width="8" height="16" rx="2" fill="#475569"/>
      <circle cx="4" cy="-32" r="3.5" fill="#38BDF8"/>
      <rect x="0" y="-46" width="8" height="14" rx="2" fill="#64748B"/>
    </g>
    <!-- Middle Finger (Longest) -->
    <g transform="translate(148, 108)">
      <rect x="0" y="-18" width="8" height="18" rx="2" fill="#64748B"/>
      <circle cx="4" cy="-18" r="3.5" fill="#0284C7"/>
      <rect x="0" y="-36" width="8" height="18" rx="2" fill="#475569"/>
      <circle cx="4" cy="-36" r="3.5" fill="#38BDF8"/>
      <rect x="0" y="-52" width="8" height="16" rx="2" fill="#64748B"/>
    </g>
    <!-- Ring Finger -->
    <g transform="translate(162, 110)">
      <rect x="0" y="-16" width="8" height="16" rx="2" fill="#64748B"/>
      <circle cx="4" cy="-16" r="3.5" fill="#0284C7"/>
      <rect x="0" y="-32" width="8" height="16" rx="2" fill="#475569"/>
      <circle cx="4" cy="-32" r="3.5" fill="#38BDF8"/>
      <rect x="0" y="-46" width="8" height="14" rx="2" fill="#64748B"/>
    </g>
    <!-- Pinky Finger -->
    <g transform="translate(176, 114)">
      <rect x="0" y="-14" width="7" height="14" rx="2" fill="#64748B"/>
      <circle cx="3.5" cy="-14" r="3" fill="#0284C7"/>
      <rect x="0" y="-26" width="7" height="12" rx="2" fill="#475569"/>
      <circle cx="3.5" cy="-26" r="3" fill="#38BDF8"/>
      <rect x="0" y="-38" width="7" height="12" rx="2" fill="#64748B"/>
    </g>
    <!-- In-illustration Status Badge -->
    <g class="sp-ill-badge">
      <rect x="12" y="14" width="102" height="22" rx="11" fill="var(--sp-ill-tag-bg, rgba(99,102,241,0.12))" stroke="var(--sp-ill-tag-border, #818CF8)" stroke-width="1"/>
      <text x="63" y="29" fill="var(--sp-ill-tag-text, #4F46E5)" font-size="9" font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle" letter-spacing="0.8">CYBERNETICS</text>
    </g>
  </svg>`,
};

export const ROBOTICS_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationIndustrialRobotArm,
  illustrationHumanoidRobot,
  illustrationAutonomousMobileRobot,
  illustrationDroneBot,
  illustrationBionicHand,
] as const;
