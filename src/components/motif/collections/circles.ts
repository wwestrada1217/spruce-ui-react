import {
  FILLABLE,
  arcPath,
  circle,
  crescentPath,
  gibbousPath,
  halfDiscPath,
  line,
  n,
  onCircle,
  path,
  rect,
  svg,
  times,
  wedgePath,
} from './motif-definition.js';
import type { SpBuiltInMotifDefinition } from './motif-definition.js';

/** A semicircle bulging upward from a baseline. */
const dome = (cx: number, cy: number, r: number, extra = '') =>
  path(`M${n(cx - r)} ${n(cy)}A${n(r)} ${n(r)} 0 0 1 ${n(cx + r)} ${n(cy)}`, extra);

/** A doorway arch: straight jambs closed by a round head. */
const arch = (cx: number, cy: number, w: number, h: number, extra = '') =>
  path(
    `M${n(cx - w)} ${n(cy + h)}V${n(cy)}A${n(w)} ${n(w)} 0 0 1 ${n(cx + w)} ${n(cy)}V${n(cy + h)}`,
    extra,
  );

/** A stadium: a rectangle whose radius is half its short side. */
const capsule = (x: number, y: number, w: number, h: number, extra = FILLABLE) =>
  rect(x, y, w, h, Math.min(w, h) / 2, extra);

// ── Motifs ──────────────────────────────────────────────────────────────────

/** Nested rings pushed off-center so the outermost one crops at the edge. */
export const motifConcentricCircles: SpBuiltInMotifDefinition = {
  name: 'concentric-circles',
  appearance: 'outlined',
  svg: svg(
    '<circle cx="62" cy="50" r="52"/>' +
      '<circle cx="62" cy="50" r="38"/>' +
      '<circle cx="62" cy="50" r="25"/>' +
      '<circle data-motif-shape cx="62" cy="50" r="13"/>',
  ),
};

/** Quarter arcs on two radii with small nodes on the orbit. */
export const motifArcOrbit: SpBuiltInMotifDefinition = {
  name: 'arc-orbit',
  appearance: 'outlined',
  svg: svg(
    '<path d="M50 6A44 44 0 0 1 94 50"/>' +
      '<path d="M6 50A44 44 0 0 0 50 94"/>' +
      '<path d="M28 50A22 22 0 0 1 50 28"/>' +
      '<path d="M72 50A22 22 0 0 1 50 72"/>' +
      '<circle data-motif-shape cx="50" cy="6" r="4.5"/>' +
      '<circle data-motif-shape cx="94" cy="50" r="3"/>' +
      '<circle data-motif-shape cx="50" cy="50" r="6"/>',
  ),
};

/** Three discs stepped off one another rather than nested. */
export const motifOffsetCircles: SpBuiltInMotifDefinition = {
  name: 'offset-circles',
  appearance: 'filled',
  svg: svg(
    circle(34, 38, 28, `${FILLABLE} opacity=".85"`) +
      circle(62, 48, 32, `${FILLABLE} opacity=".5"`) +
      circle(46, 74, 20, `${FILLABLE} opacity=".35"`),
  ),
};

/** A drift of bubbles at mixed sizes. */
export const motifBubbleCluster: SpBuiltInMotifDefinition = {
  name: 'bubble-cluster',
  appearance: 'outlined',
  svg: svg(
    (
      [
        [30, 34, 18, 0.9],
        [62, 22, 11, 0.6],
        [74, 48, 20, 0.75],
        [42, 60, 14, 0.5],
        [18, 66, 9, 0.4],
        [66, 78, 13, 0.45],
        [36, 88, 7, 0.3],
        [90, 20, 6, 0.35],
        [8, 24, 5, 0.3],
      ] as const
    )
      .map(([cx, cy, r, op]) => circle(cx, cy, r, `${FILLABLE} opacity="${op}"`))
      .join(''),
  ),
};

/** Nested half circles sharing one baseline — a rainbow arc stack. */
export const motifSemiCircleStack: SpBuiltInMotifDefinition = {
  name: 'semi-circle-stack',
  appearance: 'outlined',
  svg: svg(times(5, (i) => dome(50, 82, 46 - i * 9, i === 4 ? FILLABLE : ''))),
};

/** A pinwheel of corner quadrants at four different radii. */
export const motifQuarterCircleComposition: SpBuiltInMotifDefinition = {
  name: 'quarter-circle-composition',
  appearance: 'filled',
  svg: svg(
    path(wedgePath(0, 0, 50, 0, 90), `${FILLABLE} opacity=".9"`) +
      path(wedgePath(100, 0, 36, 90, 180), `${FILLABLE} opacity=".55"`) +
      path(wedgePath(100, 100, 46, 180, 270), `${FILLABLE} opacity=".7"`) +
      path(wedgePath(0, 100, 28, 270, 360), `${FILLABLE} opacity=".35"`) +
      path(arcPath(0, 0, 68, 0, 90), ' opacity=".4"') +
      path(arcPath(100, 100, 64, 180, 270), ' opacity=".4"'),
  ),
};

/** Stadium shapes tumbling at different angles. */
export const motifCapsuleCluster: SpBuiltInMotifDefinition = {
  name: 'capsule-cluster',
  appearance: 'filled',
  svg: svg(
    capsule(6, 26, 52, 20, `${FILLABLE} opacity=".85" transform="rotate(-18 32 36)"`) +
      capsule(44, 12, 40, 16, `${FILLABLE} opacity=".5" transform="rotate(28 64 20)"`) +
      capsule(28, 62, 60, 22, `${FILLABLE} opacity=".4" transform="rotate(-8 58 73)"`) +
      capsule(4, 74, 30, 14, `${FILLABLE} opacity=".3" transform="rotate(16 19 81)"`),
  ),
};

/** A tidy stack of horizontal pills at varying widths. */
export const motifPillShapes: SpBuiltInMotifDefinition = {
  name: 'pill-shapes',
  appearance: 'filled',
  svg: svg(
    (
      [
        [10, 12, 66, 0.9],
        [10, 32, 44, 0.65],
        [10, 52, 78, 0.5],
        [10, 72, 34, 0.35],
      ] as const
    )
      .map(([x, y, w, op]) => capsule(x, y, w, 14, `${FILLABLE} opacity="${op}"`))
      .join(''),
  ),
};

/** Stadium outlines nested inside one another. */
export const motifNestedCapsules: SpBuiltInMotifDefinition = {
  name: 'nested-capsules',
  appearance: 'outlined',
  svg: svg(
    times(4, (i) => {
      const inset = i * 11;
      return capsule(
        4 + inset,
        22 + inset * 0.7,
        92 - inset * 2,
        56 - inset * 1.4,
        i === 3 ? FILLABLE : '',
      );
    }),
  ),
};

/** Rounded rectangles nested on one center, landscape proportioned. */
export const motifConcentricRoundedRects: SpBuiltInMotifDefinition = {
  name: 'concentric-rounded-rects',
  appearance: 'outlined',
  svg: svg(
    times(5, (i) => {
      const w = 96 - i * 19;
      const h = 68 - i * 13.5;
      return rect(50 - w / 2, 50 - h / 2, w, h, 14 - i * 2.4, i === 4 ? FILLABLE : '');
    }),
  ),
};

/** Rings adrift at different sizes, barely touching. */
export const motifFloatingRings: SpBuiltInMotifDefinition = {
  name: 'floating-rings',
  appearance: 'outlined',
  svg: svg(
    circle(30, 30, 22, '') +
      circle(72, 26, 14, '') +
      circle(60, 66, 26, '') +
      circle(20, 74, 12, '') +
      circle(90, 62, 7, ''),
  ),
};

/** Three rings overlapping through one another's centers. */
export const motifInterlockingCircles: SpBuiltInMotifDefinition = {
  name: 'interlocking-circles',
  appearance: 'outlined',
  svg: svg(
    circle(36, 38, 28, '') +
      circle(64, 38, 28, '') +
      circle(50, 64, 28, '') +
      circle(50, 47, 6, FILLABLE),
  ),
};

/** Capsule links alternating orientation, each overlapping the last. */
export const motifLinkedChain: SpBuiltInMotifDefinition = {
  name: 'linked-chain',
  appearance: 'outlined',
  svg: svg(
    times(6, (i) => {
      const cx = 12 + i * 16;
      const cy = 26 + i * 9;
      return i % 2 === 0
        ? capsule(cx - 16, cy - 9, 32, 18, '')
        : capsule(cx - 9, cy - 16, 18, 32, '');
    }),
  ),
};

/** A centered target: even rings around a solid bull. */
export const motifTargetRings: SpBuiltInMotifDefinition = {
  name: 'target-rings',
  appearance: 'outlined',
  svg: svg(times(4, (i) => circle(50, 50, 46 - i * 11, '')) + circle(50, 50, 6, FILLABLE)),
};

/** Rings spreading from a struck point, spacing widening outward. */
export const motifRippleRings: SpBuiltInMotifDefinition = {
  name: 'ripple-rings',
  appearance: 'outlined',
  svg: svg(
    [5, 13, 24, 38, 55, 75].map((r, i) => circle(34, 58, r, ` opacity="${1 - i * 0.13}"`)).join(''),
  ),
};

/** Partial ripple arcs, as water reads when the source is off-frame. */
export const motifWaterRippleArcs: SpBuiltInMotifDefinition = {
  name: 'water-ripple-arcs',
  appearance: 'outlined',
  svg: svg(
    [14, 26, 39, 53, 68, 84]
      .map((r, i) => path(arcPath(8, 96, r, -86, -4), ` opacity="${1 - i * 0.12}"`))
      .join(''),
  ),
};

/** A disc with a ring slipping off it — the moment of an eclipse. */
export const motifEclipseShapes: SpBuiltInMotifDefinition = {
  name: 'eclipse-shapes',
  appearance: 'filled',
  svg: svg(
    circle(42, 48, 34, `${FILLABLE} opacity=".85"`) +
      circle(62, 42, 34, '') +
      circle(62, 42, 46, ' opacity=".4"'),
  ),
};

/** Crescents at three scales. */
export const motifCrescentShapes: SpBuiltInMotifDefinition = {
  name: 'crescent-shapes',
  appearance: 'filled',
  svg: svg(
    path(crescentPath(44, 44, 34, 1.35), `${FILLABLE} opacity=".9"`) +
      path(crescentPath(74, 68, 20, 1.5), `${FILLABLE} opacity=".55"`) +
      path(crescentPath(24, 82, 12, 1.6), `${FILLABLE} opacity=".35"`),
  ),
};

/** A row of moon phases, full through new. */
export const motifMoonPhases: SpBuiltInMotifDefinition = {
  name: 'moon-phases',
  appearance: 'filled',
  svg: svg(
    [10, 30, 50, 70, 90]
      .map((cx, i) => {
        const outline = circle(cx, 50, 9, ' opacity=".45"');
        if (i === 0) return circle(cx, 50, 9, FILLABLE);
        if (i === 1) return outline + path(gibbousPath(cx, 50, 9, 1.7), FILLABLE);
        if (i === 2) return outline + path(halfDiscPath(cx, 50, 9), FILLABLE);
        if (i === 3)
          return (
            outline +
            path(crescentPath(cx, 50, 9, 1.7), `${FILLABLE} transform="rotate(180 ${cx} 50)"`)
          );
        return outline;
      })
      .join(''),
  ),
};

/** Domes of different spans set along a ground line. */
export const motifDomeShapes: SpBuiltInMotifDefinition = {
  name: 'dome-shapes',
  appearance: 'outlined',
  svg: svg(
    dome(20, 78, 18, `${FILLABLE} opacity=".8"`) +
      dome(54, 78, 14, `${FILLABLE} opacity=".55"`) +
      dome(84, 78, 12, `${FILLABLE} opacity=".4"`) +
      dome(36, 40, 22, `${FILLABLE} opacity=".5"`) +
      dome(74, 40, 15, `${FILLABLE} opacity=".3"`) +
      line(0, 78, 100, 78) +
      line(0, 40, 100, 40, ' opacity=".45"'),
  ),
};

/** Three arches of different spans. */
export const motifArchPattern: SpBuiltInMotifDefinition = {
  name: 'arch-pattern',
  appearance: 'outlined',
  svg: svg(
    arch(24, 40, 18, 48, FILLABLE) +
      arch(60, 26, 24, 62, FILLABLE) +
      arch(92, 48, 14, 40, FILLABLE) +
      line(0, 88, 100, 88),
  ),
};

/** An even arcade, two courses deep. */
export const motifRepeatingArches: SpBuiltInMotifDefinition = {
  name: 'repeating-arches',
  appearance: 'outlined',
  svg: svg(
    times(6, (i) => arch(-2 + i * 21, 14, 10, 30)) +
      times(6, (i) => arch(-2 + i * 21, 58, 10, 30, ' opacity=".55"')) +
      line(0, 44, 100, 44) +
      line(0, 88, 100, 88),
  ),
};

/** Rows of scalloped bumps. */
export const motifSoftScallops: SpBuiltInMotifDefinition = {
  name: 'soft-scallops',
  appearance: 'outlined',
  svg: svg(
    [22, 46, 70, 94]
      .map((y, row) => times(8, (i) => dome(-4 + i * 14 + (row % 2) * 7, y, 7)))
      .join(''),
  ),
};

/** A radar sweep: range rings, bearing arcs, and the sweep line. */
export const motifRadarArcs: SpBuiltInMotifDefinition = {
  name: 'radar-arcs',
  appearance: 'outlined',
  svg: svg(
    times(4, (i) => path(arcPath(50, 50, 46 - i * 12, -100, 10), ` opacity="${1 - i * 0.15}"`)) +
      line(50, 50, ...(onCircle(50, 50, 46, -100) as [number, number])) +
      line(50, 50, ...(onCircle(50, 50, 46, 10) as [number, number])) +
      line(50, 50, ...(onCircle(50, 50, 40, -46) as [number, number])) +
      circle(50, 50, 4, FILLABLE) +
      circle(...(onCircle(50, 50, 30, -62) as [number, number]), 3, FILLABLE) +
      circle(...(onCircle(50, 50, 41, -18) as [number, number]), 2.5, FILLABLE),
  ),
};

/** Ellipses crossing at different tilts — an orbital shell diagram. */
export const motifOrbitLines: SpBuiltInMotifDefinition = {
  name: 'orbit-lines',
  appearance: 'outlined',
  svg: svg(
    [0, 60, 120]
      .map((deg) => `<ellipse cx="50" cy="50" rx="46" ry="18" transform="rotate(${deg} 50 50)"/>`)
      .join('') +
      circle(50, 50, 7, FILLABLE) +
      circle(90, 44, 4, FILLABLE) +
      circle(24, 68, 3, FILLABLE),
  ),
};

/** Dashed orbits with a body riding each track. */
export const motifDashedOrbits: SpBuiltInMotifDefinition = {
  name: 'dashed-orbits',
  appearance: 'outlined',
  svg: svg(
    circle(50, 50, 44, ' stroke-dasharray="7 6"') +
      circle(50, 50, 30, ' stroke-dasharray="5 5" opacity=".7"') +
      circle(50, 50, 16, ' stroke-dasharray="3 4" opacity=".5"') +
      circle(50, 50, 5, FILLABLE) +
      circle(94, 50, 4, FILLABLE) +
      circle(31, 27, 3.2, FILLABLE) +
      circle(60, 63, 2.6, FILLABLE),
  ),
};

/** Every circle, arc, and capsule motif, in showcase order. */
export const CIRCLE_MOTIFS: readonly SpBuiltInMotifDefinition[] = [
  motifConcentricCircles,
  motifArcOrbit,
  motifOffsetCircles,
  motifBubbleCluster,
  motifSemiCircleStack,
  motifQuarterCircleComposition,
  motifCapsuleCluster,
  motifPillShapes,
  motifNestedCapsules,
  motifConcentricRoundedRects,
  motifFloatingRings,
  motifInterlockingCircles,
  motifLinkedChain,
  motifTargetRings,
  motifRippleRings,
  motifWaterRippleArcs,
  motifEclipseShapes,
  motifCrescentShapes,
  motifMoonPhases,
  motifDomeShapes,
  motifArchPattern,
  motifRepeatingArches,
  motifSoftScallops,
  motifRadarArcs,
  motifOrbitLines,
  motifDashedOrbits,
];


