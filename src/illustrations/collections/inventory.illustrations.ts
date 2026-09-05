import type { IllustrationDefinition } from '../illustration-definition.js';

export const illustrationWarehouseStorage: IllustrationDefinition = {
  name: 'warehouse-storage',
  title: 'Warehouse & Storage Racks',
  category: 'inventory',
  tags: ['warehouse', 'storage', 'racks', 'shelves', 'boxes', 'logistics', 'inventory'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(245, 158, 11, 0.12))"/>
  <rect x="65" y="45" width="190" height="140" rx="6" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <line x1="65" y1="92" x2="255" y2="92" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="2"/>
  <line x1="65" y1="138" x2="255" y2="138" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="2"/>
  <line x1="160" y1="45" x2="160" y2="185" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="2"/>
  <rect x="80" y="55" width="30" height="30" rx="4" fill="#F59E0B" fill-opacity="0.2" stroke="#F59E0B" stroke-width="1.5"/>
  <rect x="118" y="58" width="28" height="27" rx="4" fill="var(--sp-ill-subtle, #F1F5F9)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="1.5"/>
  <rect x="175" y="55" width="32" height="30" rx="4" fill="#10B981" fill-opacity="0.2" stroke="#10B981" stroke-width="1.5"/>
  <rect x="215" y="60" width="26" height="25" rx="4" fill="var(--sp-ill-subtle, #F1F5F9)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="1.5"/>
  <rect x="76" y="100" width="36" height="32" rx="4" fill="var(--sp-ill-subtle, #F1F5F9)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="1.5"/>
  <rect x="120" y="104" width="26" height="28" rx="4" fill="#06B6D4" fill-opacity="0.2" stroke="#06B6D4" stroke-width="1.5"/>
  <rect x="175" y="100" width="34" height="32" rx="4" fill="#F59E0B" fill-opacity="0.2" stroke="#F59E0B" stroke-width="1.5"/>
  <rect x="217" y="104" width="25" height="28" rx="4" fill="var(--sp-ill-subtle, #F1F5F9)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="1.5"/>
  <rect x="82" y="146" width="32" height="32" rx="4" fill="#10B981" fill-opacity="0.2" stroke="#10B981" stroke-width="1.5"/>
  <rect x="122" y="146" width="26" height="32" rx="4" fill="var(--sp-ill-subtle, #F1F5F9)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="1.5"/>
  <rect x="172" y="146" width="38" height="32" rx="4" fill="var(--sp-ill-subtle, #F1F5F9)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="1.5"/>
  <rect x="218" y="146" width="26" height="32" rx="4" fill="#06B6D4" fill-opacity="0.2" stroke="#06B6D4" stroke-width="1.5"/>
  <g class="sp-ill-badge">
    <rect x="80" y="195" width="160" height="24" rx="12" fill="var(--sp-ill-card, #FEF3C7)" stroke="#F59E0B"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#F59E0B" text-anchor="middle">WAREHOUSE READY</text>
  </g>
</svg>`,
};

export const illustrationBarcodeScanning: IllustrationDefinition = {
  name: 'barcode-scanning',
  title: 'Barcode & QR Scanning',
  category: 'inventory',
  tags: ['barcode', 'sku', 'scan', 'laser', 'reader', 'upc', 'inventory'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <rect x="90" y="60" width="140" height="100" rx="10" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <rect x="108" y="75" width="4" height="50" rx="1" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="116" y="75" width="8" height="50" rx="1" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="128" y="75" width="3" height="50" rx="1" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="135" y="75" width="6" height="50" rx="1" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="145" y="75" width="10" height="50" rx="1" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="160" y="75" width="4" height="50" rx="1" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="168" y="75" width="7" height="50" rx="1" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="179" y="75" width="3" height="50" rx="1" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="186" y="75" width="9" height="50" rx="1" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="200" y="75" width="4" height="50" rx="1" fill="var(--sp-ill-text, #0F172A)"/>
  <rect x="208" y="75" width="6" height="50" rx="1" fill="var(--sp-ill-text, #0F172A)"/>
  <text x="160" y="144" font-family="monospace" font-weight="700" font-size="11" fill="var(--sp-ill-muted, #64748B)" text-anchor="middle" letter-spacing="2">SKU-892410-X</text>
  <line x1="80" y1="100" x2="240" y2="100" stroke="#EF4444" stroke-width="2.5" stroke-dasharray="4 2"/>
  <g class="sp-ill-badge">
    <rect x="88" y="195" width="144" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">BARCODE VERIFIED</text>
  </g>
</svg>`,
};

export const illustrationStockDepleted: IllustrationDefinition = {
  name: 'stock-depleted',
  title: 'Out of Stock / Depleted',
  category: 'inventory',
  tags: ['out of stock', 'depleted', 'zero', 'empty', 'reorder', 'alert', 'inventory'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(239, 68, 68, 0.12))"/>
  <path d="M110 90L160 65L210 90L160 115L110 90Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <path d="M110 90V135L160 160V115L110 90Z" fill="var(--sp-ill-subtle, #F1F5F9)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <path d="M210 90V135L160 160V115L210 90Z" fill="var(--sp-ill-card-subtle, #F8FAFC)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <circle cx="160" cy="125" r="24" fill="var(--sp-ill-card, #FEF2F2)" stroke="#EF4444" stroke-width="2.5"/>
  <line x1="146" y1="125" x2="174" y2="125" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
  <g class="sp-ill-badge">
    <rect x="88" y="195" width="144" height="24" rx="12" fill="var(--sp-ill-card, #FEF2F2)" stroke="#EF4444"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#EF4444" text-anchor="middle">OUT OF STOCK</text>
  </g>
</svg>`,
};

export const illustrationShippingLogistics: IllustrationDefinition = {
  name: 'shipping-logistics',
  title: 'Shipping & Delivery',
  category: 'inventory',
  tags: ['shipping', 'delivery', 'truck', 'transit', 'fulfillment', 'freight', 'inventory'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(6, 182, 212, 0.12))"/>
  <g transform="translate(80, 75)">
    <rect x="0" y="10" width="105" height="65" rx="6" fill="var(--sp-ill-card, #FFFFFF)" stroke="#06B6D4" stroke-width="2"/>
    <path d="M105 32H135L150 52V75H105V32Z" fill="var(--sp-ill-card, #FFFFFF)" stroke="#06B6D4" stroke-width="2"/>
    <rect x="114" y="38" width="22" height="15" rx="2" fill="#06B6D4" fill-opacity="0.2"/>
    <circle cx="35" cy="78" r="14" fill="#0F172A" stroke="#06B6D4" stroke-width="2"/>
    <circle cx="35" cy="78" r="5" fill="#FFFFFF"/>
    <circle cx="125" cy="78" r="14" fill="#0F172A" stroke="#06B6D4" stroke-width="2"/>
    <circle cx="125" cy="78" r="5" fill="#FFFFFF"/>
    <path d="M25 40H65M25 50H50" stroke="#06B6D4" stroke-width="2.5" stroke-linecap="round"/>
  </g>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #F0FDFA)" stroke="#06B6D4"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#06B6D4" text-anchor="middle">IN TRANSIT DISPATCH</text>
  </g>
</svg>`,
};

export const illustrationPurchaseOrder: IllustrationDefinition = {
  name: 'purchase-order',
  title: 'Purchase Order & Procurement',
  category: 'inventory',
  tags: ['procurement', 'purchase order', 'vendor', 'supply chain', 'po', 'inventory'],
  viewBox: '0 0 320 240',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none">
  <circle cx="160" cy="120" r="92" fill="var(--sp-ill-halo, rgba(16, 185, 129, 0.12))"/>
  <rect x="100" y="50" width="120" height="135" rx="8" fill="var(--sp-ill-card, #FFFFFF)" stroke="var(--sp-ill-border, #CBD5E1)" stroke-width="2"/>
  <rect x="115" y="65" width="40" height="6" rx="2" fill="#10B981"/>
  <line x1="115" y1="80" x2="205" y2="80" stroke="var(--sp-ill-border, #E2E8F0)" stroke-width="1.5"/>
  <rect x="115" y="92" width="60" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="185" y="92" width="20" height="4" rx="2" fill="#10B981"/>
  <rect x="115" y="104" width="50" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="185" y="104" width="20" height="4" rx="2" fill="#10B981"/>
  <rect x="115" y="116" width="55" height="4" rx="2" fill="var(--sp-ill-subtle, #CBD5E1)"/>
  <rect x="185" y="116" width="20" height="4" rx="2" fill="#10B981"/>
  <circle cx="180" cy="150" r="18" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981" stroke-width="2"/>
  <path d="M172 150L177 155L188 144" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
  <g class="sp-ill-badge">
    <rect x="85" y="195" width="150" height="24" rx="12" fill="var(--sp-ill-card, #ECFDF5)" stroke="#10B981"/>
    <text x="160" y="211" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#10B981" text-anchor="middle">PURCHASE ORDER OK</text>
  </g>
</svg>`,
};

export const INVENTORY_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  illustrationWarehouseStorage,
  illustrationBarcodeScanning,
  illustrationStockDepleted,
  illustrationShippingLogistics,
  illustrationPurchaseOrder,
] as const;
