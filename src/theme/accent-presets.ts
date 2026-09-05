/**
 * Optional accent palette overrides layered on top of the active theme.
 * Light / dark pairs keep buttons and focus rings legible in both modes.
 */

export type AccentId =
  | 'default'
  | 'custom'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'fuchsia'
  | 'rose'
  | 'orange'
  | 'emerald'
  | 'teal';

/** Default hex when the user picks “custom” before choosing a color. */
export const DEFAULT_CUSTOM_ACCENT_HEX = '#3a9bdc';

/** UI metadata for the theme switcher (swatches + labels). */
export const ACCENT_OPTIONS: ReadonlyArray<{
  id: AccentId;
  label: string;
  /** CSS background for the preview dot */
  swatch: string;
}> = [
  {
    id: 'default',
    label: 'Theme default',
    swatch: 'linear-gradient(135deg, #64748b 0%, #cbd5e1 50%, #94a3b8 100%)',
  },
  { id: 'blue', label: 'Blue', swatch: '#2563eb' },
  { id: 'indigo', label: 'Indigo', swatch: '#4f46e5' },
  { id: 'violet', label: 'Violet', swatch: '#7c3aed' },
  { id: 'fuchsia', label: 'Fuchsia', swatch: '#c026d3' },
  { id: 'rose', label: 'Rose', swatch: '#e11d48' },
  { id: 'orange', label: 'Orange', swatch: '#ea580c' },
  { id: 'emerald', label: 'Emerald', swatch: '#059669' },
  { id: 'teal', label: 'Teal', swatch: '#0d9488' },
];

type AccentTokens = {
  light: Record<string, string>;
  dark: Record<string, string>;
};

const ACCENT_PRESETS: Record<Exclude<AccentId, 'default' | 'custom'>, AccentTokens> = {
  blue: {
    light: {
      '--sp-primary': '#2563eb',
      '--sp-primary-hover': '#1d4ed8',
      '--sp-primary-active': '#1e40af',
      '--sp-primary-subtle': 'rgba(37, 99, 235, 0.1)',
      '--sp-primary-text': '#ffffff',
      '--sp-border-focus': '#2563eb',
      '--sp-focus-ring-color': 'rgba(37, 99, 235, 0.35)',
      '--sp-focus-glow-color': 'rgba(37, 99, 235, 0.14)',
      '--sp-info': '#2563eb',
      '--sp-info-subtle': 'rgba(37, 99, 235, 0.1)',
    },
    dark: {
      '--sp-primary': '#60a5fa',
      '--sp-primary-hover': '#93c5fd',
      '--sp-primary-active': '#3b82f6',
      '--sp-primary-subtle': 'rgba(96, 165, 250, 0.14)',
      '--sp-primary-text': '#0f172a',
      '--sp-border-focus': '#60a5fa',
      '--sp-focus-ring-color': 'rgba(96, 165, 250, 0.35)',
      '--sp-focus-glow-color': 'rgba(96, 165, 250, 0.16)',
      '--sp-info': '#60a5fa',
      '--sp-info-subtle': 'rgba(96, 165, 250, 0.12)',
    },
  },
  indigo: {
    light: {
      '--sp-primary': '#4f46e5',
      '--sp-primary-hover': '#4338ca',
      '--sp-primary-active': '#3730a3',
      '--sp-primary-subtle': 'rgba(79, 70, 229, 0.1)',
      '--sp-primary-text': '#ffffff',
      '--sp-border-focus': '#4f46e5',
      '--sp-focus-ring-color': 'rgba(79, 70, 229, 0.35)',
      '--sp-focus-glow-color': 'rgba(79, 70, 229, 0.14)',
      '--sp-info': '#4f46e5',
      '--sp-info-subtle': 'rgba(79, 70, 229, 0.1)',
    },
    dark: {
      '--sp-primary': '#818cf8',
      '--sp-primary-hover': '#a5b4fc',
      '--sp-primary-active': '#6366f1',
      '--sp-primary-subtle': 'rgba(129, 140, 248, 0.14)',
      '--sp-primary-text': '#1e1e2e',
      '--sp-border-focus': '#818cf8',
      '--sp-focus-ring-color': 'rgba(129, 140, 248, 0.35)',
      '--sp-focus-glow-color': 'rgba(129, 140, 248, 0.16)',
      '--sp-info': '#818cf8',
      '--sp-info-subtle': 'rgba(129, 140, 248, 0.12)',
    },
  },
  violet: {
    light: {
      '--sp-primary': '#7c3aed',
      '--sp-primary-hover': '#6d28d9',
      '--sp-primary-active': '#5b21b6',
      '--sp-primary-subtle': 'rgba(124, 58, 237, 0.1)',
      '--sp-primary-text': '#ffffff',
      '--sp-border-focus': '#7c3aed',
      '--sp-focus-ring-color': 'rgba(124, 58, 237, 0.35)',
      '--sp-focus-glow-color': 'rgba(124, 58, 237, 0.14)',
      '--sp-info': '#7c3aed',
      '--sp-info-subtle': 'rgba(124, 58, 237, 0.1)',
    },
    dark: {
      '--sp-primary': '#a78bfa',
      '--sp-primary-hover': '#c4b5fd',
      '--sp-primary-active': '#8b5cf6',
      '--sp-primary-subtle': 'rgba(167, 139, 250, 0.14)',
      '--sp-primary-text': '#1e1e2e',
      '--sp-border-focus': '#a78bfa',
      '--sp-focus-ring-color': 'rgba(167, 139, 250, 0.35)',
      '--sp-focus-glow-color': 'rgba(167, 139, 250, 0.16)',
      '--sp-info': '#a78bfa',
      '--sp-info-subtle': 'rgba(167, 139, 250, 0.12)',
    },
  },
  fuchsia: {
    light: {
      '--sp-primary': '#c026d3',
      '--sp-primary-hover': '#a21caf',
      '--sp-primary-active': '#86198f',
      '--sp-primary-subtle': 'rgba(192, 38, 211, 0.1)',
      '--sp-primary-text': '#ffffff',
      '--sp-border-focus': '#c026d3',
      '--sp-focus-ring-color': 'rgba(192, 38, 211, 0.35)',
      '--sp-focus-glow-color': 'rgba(192, 38, 211, 0.14)',
      '--sp-info': '#c026d3',
      '--sp-info-subtle': 'rgba(192, 38, 211, 0.1)',
    },
    dark: {
      '--sp-primary': '#e879f9',
      '--sp-primary-hover': '#f0abfc',
      '--sp-primary-active': '#d946ef',
      '--sp-primary-subtle': 'rgba(232, 121, 249, 0.14)',
      '--sp-primary-text': '#1e1e2e',
      '--sp-border-focus': '#e879f9',
      '--sp-focus-ring-color': 'rgba(232, 121, 249, 0.35)',
      '--sp-focus-glow-color': 'rgba(232, 121, 249, 0.16)',
      '--sp-info': '#e879f9',
      '--sp-info-subtle': 'rgba(232, 121, 249, 0.12)',
    },
  },
  rose: {
    light: {
      '--sp-primary': '#e11d48',
      '--sp-primary-hover': '#be123c',
      '--sp-primary-active': '#9f1239',
      '--sp-primary-subtle': 'rgba(225, 29, 72, 0.1)',
      '--sp-primary-text': '#ffffff',
      '--sp-border-focus': '#e11d48',
      '--sp-focus-ring-color': 'rgba(225, 29, 72, 0.35)',
      '--sp-focus-glow-color': 'rgba(225, 29, 72, 0.14)',
      '--sp-info': '#e11d48',
      '--sp-info-subtle': 'rgba(225, 29, 72, 0.1)',
    },
    dark: {
      '--sp-primary': '#fb7185',
      '--sp-primary-hover': '#fda4af',
      '--sp-primary-active': '#f43f5e',
      '--sp-primary-subtle': 'rgba(251, 113, 133, 0.14)',
      '--sp-primary-text': '#1e1e2e',
      '--sp-border-focus': '#fb7185',
      '--sp-focus-ring-color': 'rgba(251, 113, 133, 0.35)',
      '--sp-focus-glow-color': 'rgba(251, 113, 133, 0.16)',
      '--sp-info': '#fb7185',
      '--sp-info-subtle': 'rgba(251, 113, 133, 0.12)',
    },
  },
  orange: {
    light: {
      '--sp-primary': '#ea580c',
      '--sp-primary-hover': '#c2410c',
      '--sp-primary-active': '#9a3412',
      '--sp-primary-subtle': 'rgba(234, 88, 12, 0.1)',
      '--sp-primary-text': '#ffffff',
      '--sp-border-focus': '#ea580c',
      '--sp-focus-ring-color': 'rgba(234, 88, 12, 0.35)',
      '--sp-focus-glow-color': 'rgba(234, 88, 12, 0.14)',
      '--sp-info': '#ea580c',
      '--sp-info-subtle': 'rgba(234, 88, 12, 0.1)',
    },
    dark: {
      '--sp-primary': '#fb923c',
      '--sp-primary-hover': '#fdba74',
      '--sp-primary-active': '#f97316',
      '--sp-primary-subtle': 'rgba(251, 146, 60, 0.14)',
      '--sp-primary-text': '#1e1e2e',
      '--sp-border-focus': '#fb923c',
      '--sp-focus-ring-color': 'rgba(251, 146, 60, 0.35)',
      '--sp-focus-glow-color': 'rgba(251, 146, 60, 0.16)',
      '--sp-info': '#fb923c',
      '--sp-info-subtle': 'rgba(251, 146, 60, 0.12)',
    },
  },
  emerald: {
    light: {
      '--sp-primary': '#059669',
      '--sp-primary-hover': '#047857',
      '--sp-primary-active': '#065f46',
      '--sp-primary-subtle': 'rgba(5, 150, 105, 0.1)',
      '--sp-primary-text': '#ffffff',
      '--sp-border-focus': '#059669',
      '--sp-focus-ring-color': 'rgba(5, 150, 105, 0.35)',
      '--sp-focus-glow-color': 'rgba(5, 150, 105, 0.14)',
      '--sp-info': '#059669',
      '--sp-info-subtle': 'rgba(5, 150, 105, 0.1)',
    },
    dark: {
      '--sp-primary': '#34d399',
      '--sp-primary-hover': '#6ee7b7',
      '--sp-primary-active': '#10b981',
      '--sp-primary-subtle': 'rgba(52, 211, 153, 0.14)',
      '--sp-primary-text': '#1e1e2e',
      '--sp-border-focus': '#34d399',
      '--sp-focus-ring-color': 'rgba(52, 211, 153, 0.35)',
      '--sp-focus-glow-color': 'rgba(52, 211, 153, 0.16)',
      '--sp-info': '#34d399',
      '--sp-info-subtle': 'rgba(52, 211, 153, 0.12)',
    },
  },
  teal: {
    light: {
      '--sp-primary': '#0d9488',
      '--sp-primary-hover': '#0f766e',
      '--sp-primary-active': '#115e59',
      '--sp-primary-subtle': 'rgba(13, 148, 136, 0.1)',
      '--sp-primary-text': '#ffffff',
      '--sp-border-focus': '#0d9488',
      '--sp-focus-ring-color': 'rgba(13, 148, 136, 0.35)',
      '--sp-focus-glow-color': 'rgba(13, 148, 136, 0.14)',
      '--sp-info': '#0d9488',
      '--sp-info-subtle': 'rgba(13, 148, 136, 0.1)',
    },
    dark: {
      '--sp-primary': '#2dd4bf',
      '--sp-primary-hover': '#5eead4',
      '--sp-primary-active': '#14b8a6',
      '--sp-primary-subtle': 'rgba(45, 212, 191, 0.14)',
      '--sp-primary-text': '#1e1e2e',
      '--sp-border-focus': '#2dd4bf',
      '--sp-focus-ring-color': 'rgba(45, 212, 191, 0.35)',
      '--sp-focus-glow-color': 'rgba(45, 212, 191, 0.16)',
      '--sp-info': '#2dd4bf',
      '--sp-info-subtle': 'rgba(45, 212, 191, 0.12)',
    },
  },
};

/**
 * The light-mode brand hex behind a built-in accent. A color harmony needs a
 * single seed color, so when the user has a preset accent selected this is
 * what the harmony is derived from.
 */
export function accentPresetBaseHex(accent: AccentId): string | null {
  if (accent === 'default' || accent === 'custom') return null;
  return ACCENT_PRESETS[accent]?.light['--sp-primary'] ?? null;
}

export function isAccentId(value: string): value is AccentId {
  return (
    value === 'default' ||
    value === 'custom' ||
    Object.prototype.hasOwnProperty.call(ACCENT_PRESETS, value)
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let h = hex.trim();
  if (h.startsWith('#')) h = h.slice(1);
  if (h.length === 3) {
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
    };
  }
  if (h.length !== 6 || !/^[0-9a-f]+$/i.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${[clamp(r), clamp(g), clamp(b)].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

function mixTowardBlack(r: number, g: number, b: number, amount: number): string {
  const t = Math.max(0, Math.min(1, amount));
  return rgbToHex(r * (1 - t), g * (1 - t), b * (1 - t));
}

function mixTowardWhite(
  r: number,
  g: number,
  b: number,
  amount: number,
): { r: number; g: number; b: number } {
  const t = Math.max(0, Math.min(1, amount));
  return {
    r: r + (255 - r) * t,
    g: g + (255 - g) * t,
    b: b + (255 - b) * t,
  };
}

function rgbaStr(r: number, g: number, b: number, a: number): string {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
}

/** Relative luminance (sRGB), WCAG-style. */
function relativeLuminance(r: number, g: number, b: number): number {
  const lin = (c: number) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const R = lin(r);
  const G = lin(g);
  const B = lin(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function primaryTextForRgb(r: number, g: number, b: number): string {
  return relativeLuminance(r, g, b) > 0.45 ? '#1e1e2e' : '#ffffff';
}

/** Normalizes `#RGB` / `#RRGGBB` or returns null. */
export function normalizeAccentHex(input: string): string | null {
  const t = input.trim();
  const rgb = hexToRgb(t.startsWith('#') ? t : `#${t}`);
  if (!rgb) return null;
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Builds `--sp-primary*` and related tokens from a single brand hex (light + dark).
 */
export function buildCustomAccentStylesheet(hexInput: string): string | null {
  const normalized = normalizeAccentHex(hexInput) ?? normalizeAccentHex(DEFAULT_CUSTOM_ACCENT_HEX);
  if (!normalized) return null;
  const rgb = hexToRgb(normalized);
  if (!rgb) return null;
  const { r, g, b } = rgb;

  const primary = normalized;
  const hover = mixTowardBlack(r, g, b, 0.12);
  const active = mixTowardBlack(r, g, b, 0.22);
  const subtle = rgbaStr(r, g, b, 0.1);
  const primaryText = primaryTextForRgb(r, g, b);
  const borderFocus = primary;
  const focusRing = rgbaStr(r, g, b, 0.35);
  const focusGlow = rgbaStr(r, g, b, 0.14);
  const info = primary;
  const infoSubtle = rgbaStr(r, g, b, 0.1);

  const d1 = mixTowardWhite(r, g, b, 0.38);
  const d2 = mixTowardWhite(d1.r, d1.g, d1.b, 0.14);
  const d3 = {
    r: d1.r * 0.92,
    g: d1.g * 0.92,
    b: d1.b * 0.92,
  };
  const darkPrimary = rgbToHex(d1.r, d1.g, d1.b);
  const darkHover = rgbToHex(d2.r, d2.g, d2.b);
  const darkActive = rgbToHex(d3.r, d3.g, d3.b);
  const darkSubtle = rgbaStr(d1.r, d1.g, d1.b, 0.14);
  const darkPrimaryText = primaryTextForRgb(d1.r, d1.g, d1.b);
  const darkBorderFocus = darkPrimary;
  const darkFocusRing = rgbaStr(d1.r, d1.g, d1.b, 0.35);
  const darkFocusGlow = rgbaStr(d1.r, d1.g, d1.b, 0.16);
  const darkInfo = darkPrimary;
  const darkInfoSubtle = rgbaStr(d1.r, d1.g, d1.b, 0.12);

  const light: Record<string, string> = {
    '--sp-primary': primary,
    '--sp-primary-hover': hover,
    '--sp-primary-active': active,
    '--sp-primary-subtle': subtle,
    '--sp-primary-text': primaryText,
    '--sp-border-focus': borderFocus,
    '--sp-focus-ring-color': focusRing,
    '--sp-focus-glow-color': focusGlow,
    '--sp-info': info,
    '--sp-info-subtle': infoSubtle,
  };

  const dark: Record<string, string> = {
    '--sp-primary': darkPrimary,
    '--sp-primary-hover': darkHover,
    '--sp-primary-active': darkActive,
    '--sp-primary-subtle': darkSubtle,
    '--sp-primary-text': darkPrimaryText,
    '--sp-border-focus': darkBorderFocus,
    '--sp-focus-ring-color': darkFocusRing,
    '--sp-focus-glow-color': darkFocusGlow,
    '--sp-info': darkInfo,
    '--sp-info-subtle': darkInfoSubtle,
  };

  const lightLines = Object.entries(light)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  const darkLines = Object.entries(dark)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  return `:root[data-theme='light'] {\n${lightLines}\n}\n:root.dark,\n:root[data-theme='dark'] {\n${darkLines}\n}`;
}

/**
 * Serializes accent overrides for injection after the base theme.
 * Uses mode-specific root selectors so specificity matches the theme override
 * layer. The style element is injected later, so an explicitly selected
 * accent still wins over the active theme's primary tokens.
 */
export function buildAccentStylesheet(accent: AccentId, customHex?: string | null): string | null {
  if (accent === 'default') return null;
  if (accent === 'custom') {
    const hex = normalizeAccentHex(customHex ?? '') ?? DEFAULT_CUSTOM_ACCENT_HEX;
    return buildCustomAccentStylesheet(hex);
  }
  const preset = ACCENT_PRESETS[accent];
  if (!preset) return null;
  const lightLines = Object.entries(preset.light)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  const darkLines = Object.entries(preset.dark)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  return `:root[data-theme='light'] {\n${lightLines}\n}\n:root.dark,\n:root[data-theme='dark'] {\n${darkLines}\n}`;
}

