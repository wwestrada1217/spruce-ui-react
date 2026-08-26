/**
 * Motif types and the SVG builders every collection is written with.
 *
 * Kept separate from `motif-definitions.ts` so the collections can import the
 * types without importing the aggregator that imports them back.
 */

/** Outlined strokes or solid fills for the shapes a motif marks as fillable. */
export type SpMotifAppearance = 'outlined' | 'filled';

/** A named, reusable background ornament. */
export interface SpMotifDefinition {
  /** Registry key, used as the `motif` value at the call site. */
  readonly name: string;
  /** Standalone SVG markup on a `0 0 100 100` viewBox. */
  readonly svg: string;
  /**
   * How the motif reads best when the caller leaves `appearance` on `'auto'`.
   * Defaults to `'outlined'`.
   */
  readonly appearance?: SpMotifAppearance;
}

/** Names of the motifs shipped with the design system. */
export type SpBuiltInMotif =
  // ── Geometric ────────────────────────────────────────────────────────────
  | 'overlapping-diamonds'
  | 'rounded-blocks'
  | 'nested-rounded-squares'
  | 'isometric-cubes'
  | 'triangle-cluster'
  | 'low-poly-facets'
  | 'prism-shapes'
  | 'crystal-facets'
  | 'faceted-polygons'
  | 'abstract-shields'
  | 'bauhaus-geometry'
  | 'memphis-shapes'
  | 'l-shapes'
  | 'paper-fold'
  | 'mosaic-blocks'
  | 'tetris-blocks'
  | 'pixel-cluster'
  | 'rounded-crosses'
  | 'soft-starburst'
  | 'sparkle-cluster'
  | 'abstract-glyphs'
  | 'stair-step'
  | 'chevron-pattern'
  | 'zigzag-lines'
  // ── Circles, arcs, capsules ──────────────────────────────────────────────
  | 'concentric-circles'
  | 'arc-orbit'
  | 'offset-circles'
  | 'bubble-cluster'
  | 'semi-circle-stack'
  | 'quarter-circle-composition'
  | 'capsule-cluster'
  | 'pill-shapes'
  | 'nested-capsules'
  | 'concentric-rounded-rects'
  | 'floating-rings'
  | 'interlocking-circles'
  | 'linked-chain'
  | 'target-rings'
  | 'ripple-rings'
  | 'water-ripple-arcs'
  | 'eclipse-shapes'
  | 'crescent-shapes'
  | 'moon-phases'
  | 'dome-shapes'
  | 'arch-pattern'
  | 'repeating-arches'
  | 'soft-scallops'
  | 'radar-arcs'
  | 'orbit-lines'
  | 'dashed-orbits'
  // ── Grids and lattices ───────────────────────────────────────────────────
  | 'hexagon-pattern'
  | 'honeycomb-fragments'
  | 'square-grid'
  | 'diamond-grid'
  | 'broken-grid'
  | 'offset-checker'
  | 'blueprint-grid'
  | 'coordinate-grid'
  | 'window-grid'
  | 'wavy-grid'
  | 'warped-checker'
  | 'mesh-outlines'
  // ── Dots, nodes, particles ───────────────────────────────────────────────
  | 'dot-grid'
  | 'scattered-dots'
  | 'dot-gradient'
  | 'halftone-dots'
  | 'radial-dot-field'
  | 'constellation'
  | 'connected-nodes'
  | 'network-mesh'
  | 'minimal-confetti'
  | 'floating-particles'
  | 'plus-pattern'
  // ── Straight lines, rays, signals ────────────────────────────────────────
  | 'diagonal-lines'
  | 'radiating-lines'
  | 'sunburst'
  | 'perspective-lines'
  | 'vanishing-point-rays'
  | 'barcode-stripes'
  | 'staggered-segments'
  | 'sound-wave-bars'
  | 'equalizer-lines'
  | 'pulse-waveform'
  | 'dashed-curves'
  | 'monoline-loops'
  | 'infinity-curves'
  | 'spiral-arcs'
  | 'circuit-lines'
  // ── Organic curves and terrain ───────────────────────────────────────────
  | 'organic-blob'
  | 'abstract-waves'
  | 'layered-waves'
  | 's-curves'
  | 'bezier-loops'
  | 'flowing-ribbons'
  | 'folded-ribbon'
  | 'abstract-swoosh'
  | 'topographic-contours'
  | 'abstract-terrain'
  | 'layered-horizon'
  | 'abstract-mountains'
  | 'fan-shapes'
  | 'petal-cluster'
  | 'leaf-shapes'
  | 'pebble-shapes'
  | 'organic-cells'
  | 'fluid-blobs'
  | 'blob-outlines'
  | 'amoeba-shapes'
  | 'cloud-forms'
  // ── Frames, corners, sights ──────────────────────────────────────────────
  | 'corner-arcs'
  | 'framed-corners'
  | 'corner-brackets'
  | 'broken-rectangles'
  | 'open-frame-squares'
  | 'offset-frames'
  | 'rounded-frames'
  | 'crosshair';

/**
 * A built-in definition. Narrowing `name` to the published union makes a typo
 * in a collection a compile error rather than a motif that silently never
 * resolves.
 */
export interface SpBuiltInMotifDefinition extends SpMotifDefinition {
  readonly name: SpBuiltInMotif;
}

/**
 * A motif name. Built-in names autocomplete; any registered custom name is
 * accepted just as well.
 */
export type SpMotifName = SpBuiltInMotif | (string & {});

// ── SVG builders ────────────────────────────────────────────────────────────
//
// Every motif is assembled from these so the whole collection shares one root
// element, one number format, and one set of primitives. Stroke width is never
// written into the markup — `SpMotif` supplies a hairline from CSS that stays
// constant at any rendered size.

const SVG_OPEN =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
  'stroke-linejoin="round" aria-hidden="true" focusable="false">';

/** Wrap a body in the shared root element. */
export const svg = (body: string) => `${SVG_OPEN}${body}</svg>`;

/** One decimal place, with the trailing `.0` dropped. */
export const n = (value: number): string => `${Math.round(value * 10) / 10}`;

/** `fill`-able shapes carry this so the filled/outlined switch can reach them. */
export const FILLABLE = 'data-motif-shape';

const attrs = (extra: string) => (extra ? ` ${extra}` : '');

export const circle = (cx: number, cy: number, r: number, extra = FILLABLE) =>
  `<circle${attrs(extra)} cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}"/>`;

export const rect = (x: number, y: number, w: number, h: number, rx = 0, extra = FILLABLE) =>
  `<rect${attrs(extra)} x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"` +
  `${rx ? ` rx="${n(rx)}"` : ''}/>`;

export const line = (x1: number, y1: number, x2: number, y2: number, extra = '') =>
  `<line${attrs(extra)} x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}"/>`;

export const path = (d: string, extra = '') => `<path${attrs(extra)} d="${d}"/>`;

export const polygon = (points: readonly (readonly [number, number])[], extra = FILLABLE) =>
  `<polygon${attrs(extra)} points="${points.map(([x, y]) => `${n(x)},${n(y)}`).join(' ')}"/>`;

export const polyline = (points: readonly (readonly [number, number])[], extra = '') =>
  `<polyline${attrs(extra)} points="${points.map(([x, y]) => `${n(x)},${n(y)}`).join(' ')}"/>`;

/** Repeat a builder `count` times and concatenate. */
export const times = (count: number, build: (i: number) => string): string =>
  Array.from({ length: count }, (_, i) => build(i)).join('');

/** Repeat a builder over a lattice of x/y values. */
export const lattice = (
  xs: readonly number[],
  ys: readonly number[],
  build: (x: number, y: number, col: number, row: number) => string,
): string => ys.map((y, row) => xs.map((x, col) => build(x, y, col, row)).join('')).join('');

/** Evenly spaced values, `count` of them, from `from` to `to` inclusive. */
export const spread = (from: number, to: number, count: number): number[] =>
  count < 2
    ? [from]
    : Array.from({ length: count }, (_, i) => from + ((to - from) * i) / (count - 1));

const rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * A point on a circle. Angles are in degrees, `0` at 3 o'clock, growing
 * clockwise — the direction the screen's y-down axis makes natural.
 */
export const onCircle = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  cx + r * Math.cos(rad(deg)),
  cy + r * Math.sin(rad(deg)),
];

/** An open arc between two angles. */
export function arcPath(cx: number, cy: number, r: number, from: number, to: number): string {
  const [x0, y0] = onCircle(cx, cy, r, from);
  const [x1, y1] = onCircle(cx, cy, r, to);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  const sweep = to > from ? 1 : 0;
  return `M${n(x0)} ${n(y0)}A${n(r)} ${n(r)} 0 ${large} ${sweep} ${n(x1)} ${n(y1)}`;
}

/** A pie wedge, closed back through the center. */
export function wedgePath(cx: number, cy: number, r: number, from: number, to: number): string {
  return `${arcPath(cx, cy, r, from, to)}L${n(cx)} ${n(cy)}Z`;
}

/** A regular polygon, first vertex at `rotation` degrees. */
export const regularPolygon = (
  cx: number,
  cy: number,
  r: number,
  sides: number,
  rotation = -90,
): [number, number][] =>
  Array.from({ length: sides }, (_, i) => onCircle(cx, cy, r, rotation + (360 * i) / sides));

/** A pointy-top hexagon, the honeycomb building block. */
export const hexagon = (cx: number, cy: number, r: number) => regularPolygon(cx, cy, r, 6, -90);

/**
 * A closed smooth curve through polar samples of `radiusAt`.
 *
 * Catmull-Rom converted to cubics. Sixteen samples of a low-harmonic radius
 * function reads organic; a handful of hand-placed points reads lumpy.
 */
export function blobPath(
  cx: number,
  cy: number,
  radiusAt: (angleRad: number) => number,
  samples = 12,
): string {
  const pts = Array.from({ length: samples }, (_, i) => {
    const a = (i * 2 * Math.PI) / samples;
    const r = radiusAt(a);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
  });
  let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
  for (let i = 0; i < samples; i++) {
    const p0 = pts[(i - 1 + samples) % samples];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % samples];
    const p3 = pts[(i + 2) % samples];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${n(c1x)} ${n(c1y)} ${n(c2x)} ${n(c2y)} ${n(p2[0])} ${n(p2[1])}`;
  }
  return `${d}Z`;
}

/** A radius function built from two low harmonics — the default blob shape. */
export const harmonic =
  (base: number, a2 = 0.14, a3 = 0.08, phase = 0.6) =>
  (a: number) =>
    base * (1 + a2 * Math.sin(2 * a + phase) + a3 * Math.sin(3 * a - 1.1));

/** A four-point sparkle: straight-ish points pulled in toward the center. */
export function sparklePath(cx: number, cy: number, r: number, waist = 0.26, points = 4): string {
  const step = 360 / points;
  let d = '';
  for (let i = 0; i < points; i++) {
    const [x0, y0] = onCircle(cx, cy, r, -90 + i * step);
    const [x1, y1] = onCircle(cx, cy, r, -90 + (i + 1) * step);
    if (i === 0) d += `M${n(x0)} ${n(y0)}`;
    d += `Q${n(cx + (x0 + x1 - 2 * cx) * waist)} ${n(cy + (y0 + y1 - 2 * cy) * waist)} ${n(x1)} ${n(y1)}`;
  }
  return `${d}Z`;
}

/** A crescent: a semicircle closed by a shallower arc bulging the same way. */
export function crescentPath(cx: number, cy: number, r: number, thinness = 1.4): string {
  const R = r * thinness;
  return (
    `M${n(cx)} ${n(cy - r)}A${n(r)} ${n(r)} 0 0 0 ${n(cx)} ${n(cy + r)}` +
    `A${n(R)} ${n(R)} 0 0 1 ${n(cx)} ${n(cy - r)}Z`
  );
}

/** A half disc, flat edge vertical, lit side to the right. */
export const halfDiscPath = (cx: number, cy: number, r: number): string =>
  `M${n(cx)} ${n(cy - r)}A${n(r)} ${n(r)} 0 0 1 ${n(cx)} ${n(cy + r)}Z`;

/** A gibbous: the complement of a crescent — most of a disc, one side flattened. */
export function gibbousPath(cx: number, cy: number, r: number, fullness = 1.6): string {
  const R = r * fullness;
  return (
    `M${n(cx)} ${n(cy - r)}A${n(r)} ${n(r)} 0 0 1 ${n(cx)} ${n(cy + r)}` +
    `A${n(R)} ${n(R)} 0 0 1 ${n(cx)} ${n(cy - r)}Z`
  );
}


