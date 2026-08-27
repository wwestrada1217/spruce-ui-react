/* Shared chart palettes and color helpers. These are pure except for reading
 * CSS series tokens, which keeps every chart on the same theme contract. */

import { DEFAULT_CHART_COLORS } from './types.js';

export interface ChartPalette {
  name: string;
  displayName: string;
  colors: readonly string[];
}

/** Palette name that follows the active theme harmony ramp. */
export const HARMONY_PALETTE = 'harmony';

const PALETTE_VALUES: Record<string, readonly string[]> = {
  default: DEFAULT_CHART_COLORS,
  harmony: DEFAULT_CHART_COLORS,
  vivid: ['#e63946', '#457b9d', '#2a9d8f', '#e9c46a', '#264653', '#f4a261', '#d62828', '#023e8a'],
  pastel: ['#a8dadc', '#f4a8c1', '#b5e2a0', '#ffd6a5', '#c3b1e1', '#f9d5bb', '#97c1a9', '#cdb4db'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#023e8a', '#0096c7', '#48cae4', '#ade8f4', '#03045e'],
  sunset: ['#ff6b6b', '#ffa36c', '#ffd93d', '#ff8c42', '#c44536', '#ffb347', '#ff6348', '#f7b731'],
  forest: ['#2d6a4f', '#40916c', '#74c69d', '#b7e4c7', '#1b4332', '#52b788', '#95d5b2', '#d8f3dc'],
  corporate: ['#1d3557', '#457b9d', '#a8dadc', '#e63946', '#2b4570', '#6b9ac4', '#c9e4ec', '#f1faee'],
  nord: ['#5e81ac', '#81a1c1', '#88c0d0', '#8fbcbb', '#bf616a', '#d08770', '#ebcb8b', '#a3be8c'],
  midnight: ['#818cf8', '#c084fc', '#f472b6', '#67e8f9', '#a78bfa', '#e879f9', '#fb7185', '#22d3ee'],
  berry: ['#c026d3', '#a855f7', '#ec4899', '#f43f5e', '#d946ef', '#8b5cf6', '#f472b6', '#fb7185'],
  earth: ['#92400e', '#a16207', '#4d7c0f', '#166534', '#b45309', '#ca8a04', '#65a30d', '#15803d'],
  neon: ['#00ff87', '#00e5ff', '#ff3dff', '#ffea00', '#76ff03', '#00b0ff', '#d500f9', '#ffc400'],
  retro: ['#e07a5f', '#3d405b', '#81b29a', '#f2cc8f', '#f4f1de', '#264653', '#e9c46a', '#2a9d8f'],
  spring: ['#84cc16', '#22c55e', '#10b981', '#06b6d4', '#a3e635', '#4ade80', '#34d399', '#22d3ee'],
  autumn: ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#b91c1c', '#c2410c', '#b45309', '#a16207'],
  monochrome: ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9'],
};

export const CHART_PALETTES: Record<string, ChartPalette> = Object.fromEntries(
  Object.entries(PALETTE_VALUES).map(([name, colors]) => [name, {
    name,
    displayName: name === 'harmony' ? 'Theme harmony' : name[0].toUpperCase() + name.slice(1),
    colors,
  }]),
);

export const CHART_PALETTE_KEYS = Object.keys(CHART_PALETTES);

export function getPaletteColor(palette: readonly string[], index: number): string {
  return palette[index % Math.max(1, palette.length)] ?? DEFAULT_CHART_COLORS[0];
}

export function resolveChartPalette(name: string | undefined, fallback: readonly string[] = DEFAULT_CHART_COLORS): string[] {
  return name && PALETTE_VALUES[name] ? [...PALETTE_VALUES[name]] : (fallback.length ? [...fallback] : [...DEFAULT_CHART_COLORS]);
}

export function resolveSeriesPalette(element?: Element | null): string[] {
  if (!element || typeof window === 'undefined') return [...DEFAULT_CHART_COLORS];
  const style = getComputedStyle(element);
  return Array.from({ length: 8 }, (_, index) => style.getPropertyValue(`--sp-chart-series-${index + 1}`).trim() || DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length]);
}

export function interpolateColor(colorA: string, colorB: string, amount: number): string {
  const a = parseHex(colorA);
  const b = parseHex(colorB);
  if (!a || !b) return colorA;
  const t = Math.min(1, Math.max(0, amount));
  return `rgb(${Math.round(a.r + (b.r - a.r) * t)},${Math.round(a.g + (b.g - a.g) * t)},${Math.round(a.b + (b.b - a.b) * t)})`;
}

function parseHex(value: string): { r: number; g: number; b: number } | null {
  const normalized = value.replace('#', '').trim();
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return null;
  return { r: Number.parseInt(normalized.slice(0, 2), 16), g: Number.parseInt(normalized.slice(2, 4), 16), b: Number.parseInt(normalized.slice(4, 6), 16) };
}
