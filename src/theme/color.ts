/**
 * Color-space math for token generation.
 *
 * Everything that derives one color from another — hue rotation, tinting,
 * contrast repair — happens in OKLCH rather than sRGB or HSL. The reason is
 * hue rotation: in HSL, `hsl(60 100% 50%)` (yellow) and `hsl(240 100% 50%)`
 * (blue) claim the same lightness but differ by roughly 8:1 in perceived
 * brightness, so a triad built by rotating H comes out with one washed member
 * and one muddy one. OKLCH holds perceived lightness steady while H moves,
 * which is exactly the property a harmony generator needs.
 *
 * No dependencies: the sRGB ↔ OKLab matrices are Björn Ottosson's, and
 * out-of-gamut results are resolved by reducing chroma until the color fits
 * rather than clipping channels (clipping shifts hue, which defeats the point).
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Lightness 0–1, chroma 0–~0.4, hue in degrees 0–360. */
export interface Oklch {
  l: number;
  c: number;
  h: number;
}

// ── Hex ↔ RGB ───────────────────────────────────────────────────────────────

/** Parses `#rgb`, `#rrggbb`, or the same without the hash. Returns null if unparseable. */
export function parseHex(input: string): Rgb | null {
  let h = input.trim().replace(/^#/, '');
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function toHex({ r, g, b }: Rgb): string {
  const part = (n: number) =>
    Math.round(Math.min(255, Math.max(0, n)))
      .toString(16)
      .padStart(2, '0');
  return `#${part(r)}${part(g)}${part(b)}`;
}

/** `rgba(r, g, b, a)` string from an 8-bit triplet — matches the token style. */
export function toRgba({ r, g, b }: Rgb, alpha: number): string {
  const part = (n: number) => Math.round(Math.min(255, Math.max(0, n)));
  return `rgba(${part(r)}, ${part(g)}, ${part(b)}, ${alpha})`;
}

// ── sRGB ↔ linear ───────────────────────────────────────────────────────────

function toLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function fromLinear(channel: number): number {
  const c = channel <= 0.0031308 ? channel * 12.92 : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
  return c * 255;
}

// ── RGB ↔ OKLCH ─────────────────────────────────────────────────────────────

export function rgbToOklch(rgb: Rgb): Oklch {
  const r = toLinear(rgb.r);
  const g = toLinear(rgb.g);
  const b = toLinear(rgb.b);

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const c = Math.sqrt(A * A + B * B);
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c, h };
}

/** OKLCH → linear-light sRGB. May land outside 0–1 when the color is out of gamut. */
function oklchToLinearRgb({ l, c, h }: Oklch): { r: number; g: number; b: number } {
  const rad = (h * Math.PI) / 180;
  const A = Math.cos(rad) * c;
  const B = Math.sin(rad) * c;

  const l_ = l + 0.3963377774 * A + 0.2158037573 * B;
  const m_ = l - 0.1055613458 * A - 0.0638541728 * B;
  const s_ = l - 0.0894841775 * A - 1.291485548 * B;

  const L = l_ * l_ * l_;
  const M = m_ * m_ * m_;
  const S = s_ * s_ * s_;

  return {
    r: 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    g: -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    b: -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  };
}

function inGamut({ r, g, b }: { r: number; g: number; b: number }): boolean {
  const eps = 0.0001;
  return r >= -eps && r <= 1 + eps && g >= -eps && g <= 1 + eps && b >= -eps && b <= 1 + eps;
}

/**
 * OKLCH → sRGB, reducing chroma (never hue) until the color fits the display
 * gamut. A rotated hue frequently lands outside sRGB at the source chroma;
 * desaturating keeps the family recognizable where clipping would not.
 */
export function oklchToRgb(color: Oklch): Rgb {
  const l = Math.min(1, Math.max(0, color.l));
  const h = ((color.h % 360) + 360) % 360;
  let lo = 0;
  let hi = Math.max(0, color.c);

  if (inGamut(oklchToLinearRgb({ l, c: hi, h }))) {
    const linear = oklchToLinearRgb({ l, c: hi, h });
    return quantize(linear);
  }

  // 20 bisections resolve chroma to well under one 8-bit step.
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToLinearRgb({ l, c: mid, h }))) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return quantize(oklchToLinearRgb({ l, c: lo, h }));
}

/**
 * Linear-light triplet → 8-bit sRGB, rounded.
 *
 * Rounding here rather than at hex serialization matters: contrast is checked
 * on the value that actually ships, so a color that measures 4.5:1 as floats
 * cannot quietly round down to 4.49:1 in the stylesheet.
 */
function quantize(linear: { r: number; g: number; b: number }): Rgb {
  const channel = (v: number) => Math.round(Math.min(255, Math.max(0, fromLinear(v))));
  return { r: channel(linear.r), g: channel(linear.g), b: channel(linear.b) };
}

export function hexToOklch(hex: string): Oklch | null {
  const rgb = parseHex(hex);
  return rgb ? rgbToOklch(rgb) : null;
}

export function oklchToHex(color: Oklch): string {
  return toHex(oklchToRgb(color));
}

// ── Contrast ────────────────────────────────────────────────────────────────

export function relativeLuminance(rgb: Rgb): number {
  return 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);
}

/** WCAG 2.x contrast ratio between two opaque colors, 1–21. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function contrastRatioHex(a: string, b: string): number {
  const ra = parseHex(a);
  const rb = parseHex(b);
  if (!ra || !rb) return 1;
  return contrastRatio(ra, rb);
}

/**
 * Nudges lightness until `color` clears `target` contrast against `against`,
 * moving away from the background (darker on light, lighter on dark). Hue and
 * chroma are untouched, so the result still belongs to the harmony; only its
 * lightness is the theme's business.
 *
 * Returns the closest color it reached — if even pure black or white cannot
 * clear the target (a very mid-tone background), the caller gets the best
 * available rather than an exception.
 */
export function ensureContrast(color: Oklch, against: Rgb, target: number): Oklch {
  const towardDark = relativeLuminance(against) > 0.5;
  const step = 0.01;
  let candidate: Oklch = { ...color };
  let best: Oklch = { ...color };
  let bestRatio = contrastRatio(oklchToRgb(candidate), against);

  for (let i = 0; i < 100; i++) {
    if (bestRatio >= target) break;
    const nextL = towardDark ? candidate.l - step : candidate.l + step;
    if (nextL < 0 || nextL > 1) break;
    candidate = { ...candidate, l: nextL };
    const ratio = contrastRatio(oklchToRgb(candidate), against);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = candidate;
    }
  }
  return best;
}

/** Picks whichever of `light` / `dark` reads better on `background`. */
export function readableTextOn(background: Rgb, light = '#ffffff', dark = '#101014'): string {
  const l = parseHex(light) ?? { r: 255, g: 255, b: 255 };
  const d = parseHex(dark) ?? { r: 16, g: 16, b: 20 };
  return contrastRatio(background, l) >= contrastRatio(background, d) ? light : dark;
}

// ── Hue helpers ─────────────────────────────────────────────────────────────

export function rotateHue(color: Oklch, degrees: number): Oklch {
  return { ...color, h: (((color.h + degrees) % 360) + 360) % 360 };
}

/** Shortest angular distance between two hues, 0–180. */
export function hueDistance(a: number, b: number): number {
  const d = Math.abs((((a - b) % 360) + 360) % 360);
  return d > 180 ? 360 - d : d;
}

/**
 * Pushes a hue out of a reserved band, taking the shorter way out.
 *
 * A generated harmony member that lands on the same hue as a semantic color
 * reads as that meaning: a triad off orange produces a green that looks like a
 * success state sitting next to real success states. Callers pass the semantic
 * hues as `reserved` so those collisions get nudged aside.
 */
export function avoidHues(hue: number, reserved: readonly number[], minDistance: number): number {
  let h = ((hue % 360) + 360) % 360;
  for (const r of reserved) {
    if (hueDistance(h, r) >= minDistance) continue;
    const forward = (((r + minDistance - h) % 360) + 360) % 360;
    const backward = (((h - (r - minDistance)) % 360) + 360) % 360;
    h = forward <= backward ? r + minDistance : r - minDistance;
    h = ((h % 360) + 360) % 360;
  }
  return h;
}


