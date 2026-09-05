/**
 * Color-harmony accents.
 *
 * A plain accent paints one hue onto `--sp-primary*`. A harmony takes the same
 * brand hex and derives two companion hues from it — the scheme decides where
 * they sit on the wheel — then publishes them as `--sp-secondary*` and
 * `--sp-tertiary*` plus an eight-step categorical ramp for charts.
 *
 * Two rules shape everything here:
 *
 * 1. **The scheme picks hue; the token contract picks lightness.** Every
 *    generated fill is pushed until it clears 4.5:1 against the mode's
 *    reference background, and its label color is whichever of white / ink
 *    reads better. A harmony that looks pleasant but fails contrast is not a
 *    harmony this system will emit — so a very pale brand hex comes back
 *    darker than it went in.
 * 2. **Semantic hues are reserved.** Success, warning, and danger own their
 *    corners of the wheel. A derived member landing on one reads as that
 *    meaning, so it gets nudged aside — unless the brand hue itself lives
 *    there, in which case there is nothing to disambiguate.
 *
 * Mode references (`#ffffff` / `#1e1e1e`) match the assumption the existing
 * accent presets already make: the light block is written for a light theme
 * and the dark block for a dark one, not for one specific surface value.
 */

import {
  type Oklch,
  type Rgb,
  avoidHues,
  contrastRatio,
  ensureContrast,
  hexToOklch,
  hueDistance,
  oklchToHex,
  oklchToRgb,
  parseHex,
  readableTextOn,
  rotateHue,
  toHex,
  toRgba,
} from './color.js';

/** Named harmony scheme. `none` is not a scheme — it means "plain accent". */
export type HarmonySchemeId =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'
  | 'monochromatic';

/** A role's offset from the brand hue, in OKLCH terms. */
interface RoleShift {
  /** Hue rotation in degrees. */
  hue: number;
  /**
   * How far this role sits from the primary in lightness, as a magnitude on
   * the 0–1 scale. The direction is always *away from the background* —
   * darker in light mode, lighter in dark mode. Signing it per role would not
   * survive contrast repair: a step toward the background gets pushed straight
   * back and lands on the color it started from.
   */
  lightness?: number;
  /** Chroma multiplier. */
  chroma?: number;
}

/**
 * What the generator needs to produce a palette. `id` is loose here because a
 * custom selection resolves to one of these with `id: 'custom'`.
 */
interface GeneratorScheme {
  id: string;
  /** English label; the switcher resolves its own translated string. */
  label: string;
  /** One-line description of the relationship, for docs and tooltips. */
  description: string;
  secondary: RoleShift;
  tertiary: RoleShift;
  /** Hue offsets cycled to build the categorical chart ramp. */
  seriesHues: readonly number[];
}

/** A built-in scheme. Its id is always one of the named ids. */
export interface HarmonySchemeDefinition extends GeneratorScheme {
  id: HarmonySchemeId;
}

const SCHEME_DEFS: Record<HarmonySchemeId, HarmonySchemeDefinition> = {
  complementary: {
    id: 'complementary',
    label: 'Complementary',
    description: 'One hue directly opposite the brand, plus a softer version of it.',
    secondary: { hue: 180 },
    tertiary: { hue: 180, lightness: 0.12, chroma: 0.75 },
    seriesHues: [0, 180],
  },
  analogous: {
    id: 'analogous',
    label: 'Analogous',
    description: 'Neighbors either side of the brand hue — quiet, closely related.',
    secondary: { hue: -30 },
    tertiary: { hue: 30 },
    seriesHues: [0, -30, 30, -60],
  },
  triadic: {
    id: 'triadic',
    label: 'Triadic',
    description: 'Three hues evenly spaced around the wheel — the most distinct set.',
    secondary: { hue: 120 },
    tertiary: { hue: 240 },
    seriesHues: [0, 120, 240],
  },
  'split-complementary': {
    id: 'split-complementary',
    label: 'Split complementary',
    description: 'The two hues flanking the complement — contrast without the clash.',
    secondary: { hue: 150 },
    tertiary: { hue: 210 },
    seriesHues: [0, 150, 210],
  },
  tetradic: {
    id: 'tetradic',
    label: 'Tetradic',
    description: 'Two complementary pairs — the widest range, best with plenty of neutral.',
    secondary: { hue: 90 },
    tertiary: { hue: 180 },
    seriesHues: [0, 90, 180, 270],
  },
  monochromatic: {
    id: 'monochromatic',
    label: 'Monochromatic',
    description: 'One hue at different lightness and saturation — calmest of the six.',
    secondary: { hue: 0, lightness: 0.1, chroma: 0.72 },
    tertiary: { hue: 0, lightness: 0.22, chroma: 1.12 },
    seriesHues: [0],
  },
};

/** Every scheme, in the order the picker shows them. */
export const HARMONY_SCHEMES: readonly HarmonySchemeDefinition[] = [
  SCHEME_DEFS.complementary,
  SCHEME_DEFS.analogous,
  SCHEME_DEFS.triadic,
  SCHEME_DEFS['split-complementary'],
  SCHEME_DEFS.tetradic,
  SCHEME_DEFS.monochromatic,
];

export function isHarmonySchemeId(value: string): value is HarmonySchemeId {
  return Object.prototype.hasOwnProperty.call(SCHEME_DEFS, value);
}

/**
 * A harmony defined by explicit hue offsets rather than a named scheme — what
 * the harmony wheel produces when a marker is dragged off a canonical angle.
 *
 * Offsets are degrees from the brand hue and may be negative. Lightness and
 * chroma follow the same contract as the named schemes: lightness is a
 * magnitude away from the background, chroma a multiplier.
 */
export interface CustomHarmony {
  secondary: number;
  tertiary: number;
  secondaryLightness?: number;
  tertiaryLightness?: number;
  secondaryChroma?: number;
  tertiaryChroma?: number;
}

/** Either a named scheme or explicit offsets. */
export type HarmonySelection = HarmonySchemeId | CustomHarmony;

export function isCustomHarmony(selection: HarmonySelection): selection is CustomHarmony {
  return typeof selection === 'object' && selection !== null;
}

/** Normalizes a value from storage or an untyped source into a custom harmony. */
export function toCustomHarmony(value: unknown): CustomHarmony | null {
  if (typeof value !== 'object' || value === null) return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw['secondary'] !== 'number' || typeof raw['tertiary'] !== 'number') return null;
  const optional = (key: string): number | undefined =>
    typeof raw[key] === 'number' ? (raw[key] as number) : undefined;
  return {
    secondary: raw['secondary'],
    tertiary: raw['tertiary'],
    secondaryLightness: optional('secondaryLightness'),
    tertiaryLightness: optional('tertiaryLightness'),
    secondaryChroma: optional('secondaryChroma'),
    tertiaryChroma: optional('tertiaryChroma'),
  };
}

/** The hue offsets a selection resolves to, for wheels and previews. */
export function harmonyOffsets(selection: HarmonySelection): {
  secondary: number;
  tertiary: number;
} {
  if (isCustomHarmony(selection)) {
    return { secondary: selection.secondary, tertiary: selection.tertiary };
  }
  const def = SCHEME_DEFS[selection];
  return { secondary: def.secondary.hue, tertiary: def.tertiary.hue };
}

/**
 * The named scheme a pair of offsets corresponds to, or null when it is its own
 * thing. Used to snap a dragged wheel back onto a canonical scheme and to label
 * the result, so "triadic" keeps its name instead of becoming 119°/241°.
 */
export function matchHarmonyScheme(
  offsets: { secondary: number; tertiary: number },
  toleranceDegrees = 6,
): HarmonySchemeId | null {
  const norm = (deg: number) => ((deg % 360) + 360) % 360;
  const near = (a: number, b: number) => {
    const d = Math.abs(norm(a) - norm(b));
    return Math.min(d, 360 - d) <= toleranceDegrees;
  };
  for (const id of Object.keys(SCHEME_DEFS) as HarmonySchemeId[]) {
    const def = SCHEME_DEFS[id];
    if (near(def.secondary.hue, offsets.secondary) && near(def.tertiary.hue, offsets.tertiary)) {
      return id;
    }
  }
  return null;
}

/** Resolves a selection into the internal scheme definition used to generate. */
function resolveSchemeDef(selection: HarmonySelection): GeneratorScheme {
  if (!isCustomHarmony(selection)) return SCHEME_DEFS[selection];
  const { secondary, tertiary } = selection;
  return {
    id: 'custom',
    label: 'Custom',
    description: 'Hue offsets set by hand.',
    secondary: {
      hue: secondary,
      lightness: selection.secondaryLightness,
      chroma: selection.secondaryChroma,
    },
    tertiary: {
      hue: tertiary,
      lightness: selection.tertiaryLightness,
      chroma: selection.tertiaryChroma,
    },
    // Dedupe so a ramp built from overlapping offsets does not repeat a hue.
    seriesHues: Array.from(new Set([0, secondary, tertiary])),
  };
}

/**
 * Ready-made brand + scheme pairings. These exist to be played with: each one
 * is a starting point a team can adopt outright or nudge with the color input.
 */
export interface HarmonyPreset {
  id: string;
  displayName: string;
  /** Brand hex the harmony is derived from. */
  base: string;
  scheme: HarmonySchemeId;
}

export const HARMONY_PRESETS: readonly HarmonyPreset[] = [
  {
    id: 'cobalt-split',
    displayName: 'Cobalt Split',
    base: '#2563eb',
    scheme: 'split-complementary',
  },
  { id: 'citrus-pop', displayName: 'Citrus Pop', base: '#f97316', scheme: 'triadic' },
  { id: 'orchid-triad', displayName: 'Orchid Triad', base: '#7c3aed', scheme: 'triadic' },
  { id: 'lagoon-drift', displayName: 'Lagoon Drift', base: '#0891b2', scheme: 'analogous' },
  { id: 'teal-opposite', displayName: 'Teal Opposite', base: '#0d9488', scheme: 'complementary' },
  { id: 'sunset-run', displayName: 'Sunset Run', base: '#e11d48', scheme: 'analogous' },
  { id: 'forest-quartet', displayName: 'Forest Quartet', base: '#15803d', scheme: 'tetradic' },
  { id: 'slate-mono', displayName: 'Slate Mono', base: '#475569', scheme: 'monochromatic' },
  { id: 'amber-split', displayName: 'Amber Split', base: '#b45309', scheme: 'split-complementary' },
  { id: 'plum-mono', displayName: 'Plum Mono', base: '#9d174d', scheme: 'monochromatic' },
  {
    id: 'indigo-opposite',
    displayName: 'Indigo Opposite',
    base: '#4f46e5',
    scheme: 'complementary',
  },
  { id: 'moss-quartet', displayName: 'Moss Quartet', base: '#4d7c0f', scheme: 'tetradic' },
];

export function findHarmonyPreset(id: string): HarmonyPreset | undefined {
  return HARMONY_PRESETS.find((p) => p.id === id);
}

// ── Generation ──────────────────────────────────────────────────────────────

/** Reference background each mode's colors are validated against. */
const LIGHT_REF = '#ffffff';
const DARK_REF = '#1e1e1e';

/** Contrast floor for a fill used as text (WCAG AA, normal text). */
const TEXT_TARGET = 4.5;
/** Contrast floor for a chart series color — a graphical object, not text. */
const GRAPHIC_TARGET = 3;
/**
 * Generation aims slightly above the floors. Lightness moves in finite steps
 * and chroma gets clamped to gamut, so landing exactly on 4.5 leaves a color
 * one rounding away from failing the very check it was built to pass.
 */
const TEXT_MARGIN = 0.06;
const GRAPHIC_MARGIN = 0.05;

/** Hues that already carry meaning, derived from the default semantic colors. */
const SEMANTIC_HUES: readonly number[] = ['#dc2626', '#d97706', '#16a34a']
  .map((hex) => hexToOklch(hex)?.h)
  .filter((h): h is number => typeof h === 'number');

/** Minimum separation a generated hue keeps from a semantic hue. */
const SEMANTIC_MIN_DISTANCE = 20;

/**
 * Below this chroma a color has no usable hue, so rotating it returns the same
 * gray. A brand that is essentially black, white, or slate (Shadcn's `#18181b`,
 * for one) therefore gets a lightness-stepped palette instead of a hue-based
 * one — the scheme is still honored in spirit: distinguishable companions that
 * belong to the brand.
 */
const ACHROMATIC_CHROMA = 0.02;

/** One role's resolved colors for a single mode. */
export interface HarmonyRole {
  base: string;
  hover: string;
  active: string;
  subtle: string;
  text: string;
  /** Resolved fill as 8-bit RGB, so callers can mix their own alphas. */
  rgb: Rgb;
}

export interface HarmonyModePalette {
  primary: HarmonyRole;
  secondary: HarmonyRole;
  tertiary: HarmonyRole;
  /** Eight categorical colors for charts, ordered for adjacent distinctness. */
  series: string[];
}

export interface HarmonyPalette {
  /** The brand hex the palette was derived from, normalized. */
  base: string;
  /** Named scheme, or `custom` when generated from explicit offsets. */
  scheme: HarmonySchemeId | 'custom';
  light: HarmonyModePalette;
  dark: HarmonyModePalette;
}

function clampL(value: number): number {
  return Math.min(0.98, Math.max(0.06, value));
}

/**
 * Past roughly this lightness a dark-mode fill reads as a pastel wash whatever
 * its hue, so it is the ceiling every dark-mode role has to fit under —
 * including the ones offset above the anchor.
 */
const DARK_CEILING = 0.85;

/**
 * Where a dark-mode fill should sit. Dark surfaces need a light accent, but
 * past roughly 0.8 everything reads as a pastel regardless of hue, so the
 * band matters more than the offset.
 */
function darkModeLightness(seedL: number): number {
  return Math.min(0.78, Math.max(0.58, seedL + 0.18));
}

/**
 * The dark-mode anchor, lowered far enough that the role sitting highest above
 * it still clears the ceiling. Without this, two roles with different offsets
 * both pin to the ceiling and come out as the same color — which is what a
 * monochromatic scheme did on a mid-lightness brand hue.
 */
function darkAnchorFor(seedL: number, maxOffset: number): number {
  return Math.min(darkModeLightness(seedL), DARK_CEILING - maxOffset);
}

/** Lightness a role's offsets are measured from, per mode. */
interface RoleAnchors {
  light: number;
  /** -1 to darken companions, +1 to lighten them. */
  lightDirection: number;
  dark: number;
}

/**
 * Lightness floor a light-mode fill stays above. Below this, stepping further
 * down stops producing a visibly different color — everything reads as black.
 */
const LIGHT_FLOOR = 0.18;

/**
 * Where each role's lightness comes from.
 *
 * Companions normally step *away* from the background: darker in light mode,
 * lighter in dark mode. The exception is a brand color already at the extreme —
 * a near-black brand has nothing below it, so in light mode its companions step
 * up instead. Dark mode needs no such case because the anchor itself is lowered
 * to leave room under the ceiling.
 */
function resolveAnchors(lightAnchor: number, seedL: number, maxOffset: number): RoleAnchors {
  const roomBelow = lightAnchor - maxOffset >= LIGHT_FLOOR;
  return {
    light: lightAnchor,
    lightDirection: roomBelow ? -1 : 1,
    dark: darkAnchorFor(seedL, maxOffset),
  };
}

/**
 * Which semantic hues this brand should steer around. A brand that *is* green
 * gets no green guard — there is no second meaning to protect.
 */
function reservedFor(baseHue: number): number[] {
  return SEMANTIC_HUES.filter((h) => hueDistance(baseHue, h) >= SEMANTIC_MIN_DISTANCE);
}

/** Hue and chroma for a role; lightness is decided per mode in buildRole. */
function shiftRole(base: Oklch, shift: RoleShift, reserved: readonly number[]): Oklch {
  const rotated = rotateHue(base, shift.hue);
  const hue = shift.hue === 0 ? rotated.h : avoidHues(rotated.h, reserved, SEMANTIC_MIN_DISTANCE);
  return { l: base.l, c: base.c * (shift.chroma ?? 1), h: hue };
}

/**
 * Builds one role's five colors for a mode.
 *
 * Light mode darkens on hover, dark mode lightens — the same direction the
 * hand-authored accent presets use, so a harmony feels like the rest of the
 * system rather than an import.
 */
function buildRole(
  seed: Oklch,
  mode: 'light' | 'dark',
  anchors: RoleAnchors,
  lightnessOffset = 0,
): HarmonyRole {
  const refHex = mode === 'light' ? LIGHT_REF : DARK_REF;
  const ref = parseHex(refHex)!;

  // Dark mode wants a lighter, slightly calmer fill — but as a target band,
  // not a fixed offset. Adding a constant to an already-light seed (orange,
  // yellow) lands near white and the accent comes out washed out.
  //
  // Both modes measure role offsets from an anchor and step in the direction
  // that has room (see resolveAnchors), so companions stay distinguishable
  // even when the brand color sits at an extreme.
  const start: Oklch =
    mode === 'light'
      ? {
          ...seed,
          l: clampL(anchors.light + anchors.lightDirection * lightnessOffset),
        }
      : {
          l: Math.min(DARK_CEILING, clampL(anchors.dark + lightnessOffset)),
          c: seed.c * 0.92,
          h: seed.h,
        };

  const fill = ensureContrast(start, ref, TEXT_TARGET + TEXT_MARGIN);
  const step = mode === 'light' ? -1 : 1;
  const hover: Oklch = { ...fill, l: clampL(fill.l + step * 0.06) };
  const active: Oklch = { ...fill, l: clampL(fill.l + step * 0.12) };

  const fillRgb = oklchToRgb(fill);
  return {
    base: oklchToHex(fill),
    hover: oklchToHex(hover),
    active: oklchToHex(active),
    subtle: toRgba(fillRgb, mode === 'light' ? 0.1 : 0.14),
    text: readableTextOn(fillRgb, '#ffffff', mode === 'light' ? '#101014' : '#0f172a'),
    rgb: fillRgb,
  };
}

/**
 * Categorical ramp. Hues cycle before lightness tiers change, so neighbors in
 * the legend differ by hue first — the difference people read fastest — and
 * only fall back to a lightness step once the scheme's hues run out.
 */
function buildSeries(
  seed: Oklch,
  scheme: GeneratorScheme,
  mode: 'light' | 'dark',
  achromatic = false,
): string[] {
  const ref = parseHex(mode === 'light' ? LIGHT_REF : DARK_REF)!;
  const hues = scheme.seriesHues;
  const maxTier = 0.27;
  const baseL = mode === 'light' ? seed.l : darkAnchorFor(seed.l, maxTier);

  // Tiers move away from the background — a step toward it gets pushed back by
  // the contrast repair and lands on the color it came from, which is how a
  // legend ends up with two identical swatches. A brand already near black has
  // no room below, so there the ramp climbs instead.
  const direction = mode === 'light' ? (baseL - maxTier >= LIGHT_FLOOR ? -1 : 1) : 1;
  const tierSteps = [0, 0.09, 0.18, 0.27];
  const chromaSteps = [1, 0.86, 1.08, 0.74];
  const out: string[] = [];

  // Tiers are measured from the lightness that already passes, not from the
  // raw seed — otherwise a seed outside the visible range has every tier
  // repaired back onto the same boundary value.
  const startL = ensureContrast({ ...seed, l: baseL }, ref, GRAPHIC_TARGET + GRAPHIC_MARGIN).l;

  // No hue to cycle: spread the eight steps across lightness alone.
  if (achromatic) {
    for (let i = 0; i < 8; i++) {
      const candidate: Oklch = { ...seed, l: clampL(startL + direction * i * 0.05) };
      const resolved = ensureContrast(candidate, ref, GRAPHIC_TARGET + GRAPHIC_MARGIN);
      out.push(distinctFrom(resolved, out, ref, direction));
    }
    return out;
  }

  for (let i = 0; i < 8; i++) {
    const hueOffset = hues[i % hues.length];
    const tierIndex = Math.floor(i / hues.length) % tierSteps.length;
    // Monochromatic has a single hue, so chroma carries more of the separation.
    const chromaScale = hues.length === 1 ? Math.max(0.35, 1 - 0.13 * i) : chromaSteps[tierIndex];
    const candidate: Oklch = {
      l: clampL(startL + direction * tierSteps[tierIndex]),
      c: Math.max(0.02, seed.c * chromaScale),
      h: (((seed.h + hueOffset) % 360) + 360) % 360,
    };

    const resolved = ensureContrast(candidate, ref, GRAPHIC_TARGET + GRAPHIC_MARGIN);
    out.push(distinctFrom(resolved, out, ref, direction));
  }
  return out;
}

/**
 * Resolves a color that is not already in `taken`.
 *
 * Contrast repair pulls colors toward the same boundary, and a seed near the
 * lightness limits has nowhere left to go in the preferred direction — so
 * offsets are tried away from the background first, then toward it. Every
 * candidate is re-checked for contrast, so a legend never trades a duplicate
 * swatch for an invisible one.
 */
function distinctFrom(color: Oklch, taken: readonly string[], ref: Rgb, direction: number): string {
  const first = oklchToHex(color);
  if (!taken.includes(first)) return first;

  const offsets = [0.05, 0.1, 0.15, 0.2, 0.25];
  for (const magnitude of offsets) {
    for (const sign of [direction, -direction]) {
      const candidate: Oklch = { ...color, l: clampL(color.l + sign * magnitude) };
      const hex = oklchToHex(ensureContrast(candidate, ref, GRAPHIC_TARGET + GRAPHIC_MARGIN));
      if (!taken.includes(hex)) return hex;
    }
  }
  return first;
}

/**
 * Derives the full palette for a brand hex and scheme. Returns null only when
 * the hex cannot be parsed, so callers can fall back to a plain accent.
 */
export function buildHarmonyPalette(
  baseHex: string,
  selection: HarmonySelection,
): HarmonyPalette | null {
  const seed = hexToOklch(baseHex);
  const rgb = parseHex(baseHex);
  if (!seed || !rgb) return null;
  if (!isCustomHarmony(selection) && !SCHEME_DEFS[selection]) return null;
  const def = resolveSchemeDef(selection);

  const reserved = reservedFor(seed.h);
  const secondarySeed = shiftRole(seed, def.secondary, reserved);
  const tertiarySeed = shiftRole(seed, def.tertiary, reserved);

  const achromatic = seed.c < ACHROMATIC_CHROMA;
  // With no hue to move, the only axis left is lightness — so every scheme
  // collapses to the same stepped treatment rather than three identical grays.
  const secondaryOffset = achromatic ? 0.12 : (def.secondary.lightness ?? 0);
  const tertiaryOffset = achromatic ? 0.24 : (def.tertiary.lightness ?? 0);

  // Light-mode roles are offset from the *validated* primary, not the raw
  // seed. A pale brand hex gets darkened to clear AA, and if the offsets were
  // measured from the original lightness every role would land on that same
  // repaired boundary — three roles, one color.
  const validatedPrimaryL = ensureContrast(seed, parseHex(LIGHT_REF)!, TEXT_TARGET + TEXT_MARGIN).l;
  const anchors = resolveAnchors(
    validatedPrimaryL,
    seed.l,
    Math.max(secondaryOffset, tertiaryOffset),
  );

  const forMode = (mode: 'light' | 'dark'): HarmonyModePalette => ({
    primary: buildRole(seed, mode, anchors),
    secondary: buildRole(secondarySeed, mode, anchors, secondaryOffset),
    tertiary: buildRole(tertiarySeed, mode, anchors, tertiaryOffset),
    series: buildSeries(seed, def, mode, achromatic),
  });

  return {
    base: toHex(rgb),
    scheme: def.id as HarmonySchemeId | 'custom',
    light: forMode('light'),
    dark: forMode('dark'),
  };
}

function modeTokens(mode: HarmonyModePalette): Record<string, string> {
  const tokens: Record<string, string> = {
    '--sp-primary': mode.primary.base,
    '--sp-primary-hover': mode.primary.hover,
    '--sp-primary-active': mode.primary.active,
    '--sp-primary-subtle': mode.primary.subtle,
    '--sp-primary-text': mode.primary.text,
    '--sp-border-focus': mode.primary.base,
    '--sp-focus-ring-color': toRgba(mode.primary.rgb, 0.35),
    '--sp-focus-glow-color': toRgba(mode.primary.rgb, 0.14),
    '--sp-info': mode.primary.base,
    '--sp-info-subtle': mode.primary.subtle,

    '--sp-secondary': mode.secondary.base,
    '--sp-secondary-hover': mode.secondary.hover,
    '--sp-secondary-active': mode.secondary.active,
    '--sp-secondary-subtle': mode.secondary.subtle,
    '--sp-secondary-text': mode.secondary.text,

    '--sp-tertiary': mode.tertiary.base,
    '--sp-tertiary-hover': mode.tertiary.hover,
    '--sp-tertiary-active': mode.tertiary.active,
    '--sp-tertiary-subtle': mode.tertiary.subtle,
    '--sp-tertiary-text': mode.tertiary.text,
  };
  mode.series.forEach((color, i) => {
    tokens[`--sp-chart-series-${i + 1}`] = color;
  });
  return tokens;
}

/**
 * Serializes a harmony for injection after the base theme. Mode-specific root
 * selectors keep the generated palette at the same specificity as the theme
 * override layer while the later style element lets harmony win.
 */
export function buildHarmonyStylesheet(
  baseHex: string,
  selection: HarmonySelection,
): string | null {
  const palette = buildHarmonyPalette(baseHex, selection);
  if (!palette) return null;
  const serialize = (tokens: Record<string, string>) =>
    Object.entries(tokens)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n');
  return (
    `:root[data-theme='light'] {\n${serialize(modeTokens(palette.light))}\n}\n` +
    `:root.dark,\n:root[data-theme='dark'] {\n${serialize(modeTokens(palette.dark))}\n}`
  );
}

/**
 * Contrast report for a palette — what the picker and the docs page show so a
 * chosen harmony can be trusted rather than eyeballed. Ratios are measured
 * against the mode reference, and `passes` is WCAG AA for normal text.
 */
export interface HarmonyContrastRow {
  role: 'primary' | 'secondary' | 'tertiary';
  mode: 'light' | 'dark';
  /** Fill color read as text on the mode's background. */
  onBackground: number;
  /** Label color read on the fill. */
  labelOnFill: number;
  passes: boolean;
}

export function harmonyContrastReport(palette: HarmonyPalette): HarmonyContrastRow[] {
  const rows: HarmonyContrastRow[] = [];
  const refs = { light: parseHex(LIGHT_REF)!, dark: parseHex(DARK_REF)! };
  for (const mode of ['light', 'dark'] as const) {
    for (const role of ['primary', 'secondary', 'tertiary'] as const) {
      const entry = palette[mode][role];
      const fill = parseHex(entry.base);
      const label = parseHex(entry.text);
      if (!fill || !label) continue;
      const onBackground = contrastRatio(fill, refs[mode]);
      const labelOnFill = contrastRatio(label, fill);
      rows.push({
        role,
        mode,
        onBackground: Math.round(onBackground * 100) / 100,
        labelOnFill: Math.round(labelOnFill * 100) / 100,
        passes: onBackground >= TEXT_TARGET && labelOnFill >= TEXT_TARGET,
      });
    }
  }
  return rows;
}

