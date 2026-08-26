import {
  FILLABLE,
  blobPath,
  circle,
  harmonic,
  line,
  n,
  path,
  polygon,
  polyline,
  svg,
  times,
} from './motif-definition.js';
import type { SpBuiltInMotifDefinition } from './motif-definition.js';

/** A leaf: two mirrored arcs meeting at a tip and a stem. */
function leaf(cx: number, cy: number, len: number, width: number, deg: number, op: number): string {
  const half = len / 2;
  return (
    path(
      `M${n(cx)} ${n(cy - half)}C${n(cx + width)} ${n(cy - half * 0.35)} ${n(cx + width)} ${n(cy + half * 0.35)} ${n(cx)} ${n(cy + half)}` +
        `C${n(cx - width)} ${n(cy + half * 0.35)} ${n(cx - width)} ${n(cy - half * 0.35)} ${n(cx)} ${n(cy - half)}Z`,
      `${FILLABLE} opacity="${op}" transform="rotate(${deg} ${n(cx)} ${n(cy)})"`,
    ) +
    line(
      cx,
      cy - half,
      cx,
      cy + half,
      ` opacity="${op * 0.7}" transform="rotate(${deg} ${n(cx)} ${n(cy)})"`,
    )
  );
}

/** A petal: a teardrop swung out from a shared center. */
const petal = (cx: number, cy: number, len: number, width: number, deg: number, op: number) =>
  path(
    `M${n(cx)} ${n(cy)}C${n(cx - width)} ${n(cy - len * 0.5)} ${n(cx - width * 0.6)} ${n(cy - len)} ${n(cx)} ${n(cy - len)}` +
      `C${n(cx + width * 0.6)} ${n(cy - len)} ${n(cx + width)} ${n(cy - len * 0.5)} ${n(cx)} ${n(cy)}Z`,
    `${FILLABLE} opacity="${op}" transform="rotate(${deg} ${n(cx)} ${n(cy)})"`,
  );

/** A horizontal band bounded by two parallel sine curves. */
const waveBand = (y: number, amp: number, thickness: number, phase: number, op: number) => {
  const top = `M-6 ${n(y)}C${n(20)} ${n(y - amp)} ${n(46)} ${n(y + amp)} ${n(72)} ${n(y - amp * 0.4)}S106 ${n(y - amp * 0.2)} 106 ${n(y)}`;
  const bottom =
    `L106 ${n(y + thickness)}C106 ${n(y + thickness)} ${n(90)} ${n(y + thickness + amp * 0.2)} ${n(72)} ${n(y + thickness - amp * 0.4)}` +
    `C${n(46)} ${n(y + thickness + amp)} ${n(20)} ${n(y + thickness - amp)} -6 ${n(y + thickness)}Z`;
  return path(top + bottom, `${FILLABLE} opacity="${op}"`);
};

// ── Motifs ──────────────────────────────────────────────────────────────────

/** A soft asymmetric blob with an inner contour — the large-format option. */
export const motifOrganicBlob: SpBuiltInMotifDefinition = {
  name: 'organic-blob',
  appearance: 'filled',
  svg: svg(
    '<path data-motif-shape opacity=".9" d="M92.6 50C94.3 57.3 96.3 68 93.1 74.9C90 81.8 81 89.3 73.9 91.3' +
      'C66.7 93.3 56.7 89.1 50 86.9C43.3 84.8 39.5 81.1 33.6 78.3C27.7 75.6 20 75.1 14.7 70.4' +
      'C9.3 65.7 2.3 57.3 1.4 50C0.6 42.7 4.9 32.6 9.5 26.6C14.1 20.6 22.4 16.6 29.1 13.9' +
      'C35.9 11.1 43.3 9.6 50 10C56.7 10.5 63.9 13 69.4 16.5C74.8 20 78.8 25.5 82.7 31.1' +
      'C86.6 36.7 90.8 42.7 92.6 50Z"/>' +
      '<path d="M77.3 47C78.3 51.2 79.4 57.3 77.6 61.2C75.9 65.2 70.7 69.5 66.6 70.6' +
      'C62.5 71.8 56.8 69.3 53 68.1C49.2 66.9 47 64.8 43.7 63.2C40.3 61.6 35.9 61.4 32.8 58.7' +
      'C29.7 56 25.7 51.2 25.3 47C24.8 42.8 27.2 37.1 29.9 33.6C32.5 30.2 37.2 27.9 41.1 26.3' +
      'C44.9 24.8 49.2 23.9 53 24.2C56.8 24.4 60.9 25.8 64.1 27.8C67.2 29.9 69.5 33 71.7 36.2' +
      'C73.9 39.4 76.3 42.8 77.3 47Z"/>',
  ),
};

/** Three stacked sine-like curves that run off both edges. */
export const motifAbstractWaves: SpBuiltInMotifDefinition = {
  name: 'abstract-waves',
  appearance: 'outlined',
  svg: svg(
    '<path d="M-8 32C12 14 30 50 50 32S88 14 108 32"/>' +
      '<path d="M-8 52C12 34 30 70 50 52S88 34 108 52"/>' +
      '<path d="M-8 72C12 54 30 90 50 72S88 54 108 72"/>',
  ),
};

/** Filled wave bands lying over one another. */
export const motifLayeredWaves: SpBuiltInMotifDefinition = {
  name: 'layered-waves',
  appearance: 'filled',
  svg: svg(
    waveBand(20, 14, 22, 0, 0.85) +
      waveBand(46, 12, 20, 1.2, 0.55) +
      waveBand(70, 16, 26, 2.4, 0.35),
  ),
};

/** A run of S-bends, each offset from the last. */
export const motifSCurves: SpBuiltInMotifDefinition = {
  name: 's-curves',
  appearance: 'outlined',
  svg: svg(
    times(5, (i) => {
      const x = 8 + i * 21;
      return path(
        `M${n(x)} -6C${n(x + 26)} 20 ${n(x - 26)} 60 ${n(x)} 106`,
        ` opacity="${n(0.95 - i * 0.12)}"`,
      );
    }),
  ),
};

/** Loops traced by long bezier curves crossing one another. */
export const motifBezierLoops: SpBuiltInMotifDefinition = {
  name: 'bezier-loops',
  appearance: 'outlined',
  svg: svg(
    path('M10 78C-6 40 26 6 52 18C78 30 66 76 40 76C14 76 12 34 44 24C76 14 96 48 88 76') +
      path('M20 22C48 2 92 22 90 52C88 82 44 96 26 74', ' opacity=".55"'),
  ),
};

/** Wide ribbons sweeping across, each catching the light differently. */
export const motifFlowingRibbons: SpBuiltInMotifDefinition = {
  name: 'flowing-ribbons',
  appearance: 'filled',
  svg: svg(
    path('M-8 24C22 4 48 52 106 26L106 44C48 70 22 22 -8 42Z', `${FILLABLE} opacity=".85"`) +
      path('M-8 54C26 34 54 82 106 56L106 72C54 98 26 50 -8 72Z', `${FILLABLE} opacity=".5"`) +
      path('M-8 84C20 70 46 100 106 84L106 96L-8 96Z', `${FILLABLE} opacity=".3"`),
  ),
};

/** A ribbon that folds back on itself — angular, with visible creases. */
export const motifFoldedRibbon: SpBuiltInMotifDefinition = {
  name: 'folded-ribbon',
  appearance: 'filled',
  svg: svg(
    polygon(
      [
        [-6, 30],
        [34, 12],
        [34, 34],
        [-6, 52],
      ],
      `${FILLABLE} opacity=".85"`,
    ) +
      polygon(
        [
          [34, 12],
          [70, 34],
          [70, 56],
          [34, 34],
        ],
        `${FILLABLE} opacity=".45"`,
      ) +
      polygon(
        [
          [70, 34],
          [106, 16],
          [106, 38],
          [70, 56],
        ],
        `${FILLABLE} opacity=".7"`,
      ) +
      polygon(
        [
          [34, 56],
          [70, 78],
          [70, 100],
          [34, 78],
        ],
        `${FILLABLE} opacity=".3"`,
      ) +
      line(34, 12, 34, 34) +
      line(70, 34, 70, 56),
  ),
};

/** A single tapered sweep — the swoosh. */
export const motifAbstractSwoosh: SpBuiltInMotifDefinition = {
  name: 'abstract-swoosh',
  appearance: 'filled',
  svg: svg(
    path(
      'M2 84C18 44 54 14 104 10C60 26 32 52 22 88C18 96 6 96 2 84Z',
      `${FILLABLE} opacity=".9"`,
    ) + path('M14 92C30 56 62 32 100 26', ' opacity=".45"'),
  ),
};

/** Nested irregular contours, as a map draws elevation. */
export const motifTopographicContours: SpBuiltInMotifDefinition = {
  name: 'topographic-contours',
  appearance: 'outlined',
  svg: svg(
    times(7, (i) =>
      path(
        blobPath(46, 52, harmonic(10 + i * 7.5, 0.22, 0.12, 0.9), 14),
        ` opacity="${n(0.95 - i * 0.09)}"`,
      ),
    ),
  ),
};

/** Stacked profile lines, amplitude falling with distance. */
export const motifAbstractTerrain: SpBuiltInMotifDefinition = {
  name: 'abstract-terrain',
  appearance: 'outlined',
  svg: svg(
    times(7, (i) => {
      const y = 14 + i * 13;
      const amp = 12 - i * 1.4;
      const pts: [number, number][] = Array.from({ length: 13 }, (_, k) => [
        -4 + k * 9,
        y + Math.sin(k * 1.3 + i * 0.8) * amp * 0.5 + Math.sin(k * 0.5 + i) * amp * 0.5,
      ]);
      return polyline(pts, ` opacity="${n(0.95 - i * 0.1)}"`);
    }),
  ),
};

/** Long shallow ridges receding to a flat horizon. */
export const motifLayeredHorizon: SpBuiltInMotifDefinition = {
  name: 'layered-horizon',
  appearance: 'filled',
  svg: svg(
    path('M-6 62C24 48 48 66 106 44V106H-6Z', `${FILLABLE} opacity=".3"`) +
      path('M-6 76C28 62 56 82 106 62V106H-6Z', `${FILLABLE} opacity=".5"`) +
      path('M-6 90C30 80 62 96 106 82V106H-6Z', `${FILLABLE} opacity=".8"`) +
      line(-6, 34, 106, 34, ' opacity=".35"'),
  ),
};

/** Peaks in two ranges, the nearer one heavier. */
export const motifAbstractMountains: SpBuiltInMotifDefinition = {
  name: 'abstract-mountains',
  appearance: 'filled',
  svg: svg(
    polygon(
      [
        [-6, 74],
        [22, 30],
        [44, 62],
        [62, 22],
        [96, 74],
      ],
      `${FILLABLE} opacity=".4"`,
    ) +
      polygon(
        [
          [-6, 92],
          [30, 46],
          [54, 78],
          [74, 54],
          [106, 92],
        ],
        `${FILLABLE} opacity=".85"`,
      ) +
      polyline([
        [16, 40],
        [22, 30],
        [28, 40],
      ]) +
      line(-6, 92, 106, 92),
  ),
};

/** A fan: a segment of a circle ribbed by radial folds. */
export const motifFanShapes: SpBuiltInMotifDefinition = {
  name: 'fan-shapes',
  appearance: 'outlined',
  svg: svg(
    (() => {
      const cx = 50;
      const cy = 88;
      const r = 74;
      const from = -168;
      const to = -12;
      const ribs = times(9, (i) => {
        const a = ((from + ((to - from) * i) / 8) * Math.PI) / 180;
        return line(
          cx,
          cy,
          cx + r * Math.cos(a),
          cy + r * Math.sin(a),
          ` opacity="${n(0.4 + (i % 2) * 0.4)}"`,
        );
      });
      const a0 = (from * Math.PI) / 180;
      const a1 = (to * Math.PI) / 180;
      const outline = path(
        `M${n(cx)} ${n(cy)}L${n(cx + r * Math.cos(a0))} ${n(cy + r * Math.sin(a0))}` +
          `A${n(r)} ${n(r)} 0 0 1 ${n(cx + r * Math.cos(a1))} ${n(cy + r * Math.sin(a1))}Z`,
        FILLABLE,
      );
      return outline + ribs + circle(cx, cy, 4, FILLABLE);
    })(),
  ),
};

/** Petals swung around one center. */
export const motifPetalCluster: SpBuiltInMotifDefinition = {
  name: 'petal-cluster',
  appearance: 'filled',
  svg: svg(
    times(8, (i) => petal(50, 52, 40, 15, i * 45, 0.75 - (i % 3) * 0.14)) +
      circle(50, 52, 7, FILLABLE),
  ),
};

/** Leaves at loose angles, each with its midrib. */
export const motifLeafShapes: SpBuiltInMotifDefinition = {
  name: 'leaf-shapes',
  appearance: 'outlined',
  svg: svg(
    leaf(32, 32, 46, 15, -28, 0.9) +
      leaf(66, 42, 38, 12, 34, 0.6) +
      leaf(44, 74, 32, 11, -8, 0.45) +
      leaf(80, 78, 24, 8, 52, 0.3),
  ),
};

/** Small smooth stones, each a little different. */
export const motifPebbleShapes: SpBuiltInMotifDefinition = {
  name: 'pebble-shapes',
  appearance: 'filled',
  svg: svg(
    (
      [
        [30, 32, 20, 0.9, 0.5],
        [66, 26, 14, 0.6, 1.7],
        [72, 60, 22, 0.7, 2.9],
        [34, 68, 17, 0.45, 4.1],
        [16, 88, 11, 0.3, 5.3],
      ] as const
    )
      .map(([cx, cy, r, op, phase]) =>
        path(blobPath(cx, cy, harmonic(r, 0.11, 0.05, phase), 12), `${FILLABLE} opacity="${op}"`),
      )
      .join(''),
  ),
};

/** Packed cells with soft walls — tissue seen from above. */
export const motifOrganicCells: SpBuiltInMotifDefinition = {
  name: 'organic-cells',
  appearance: 'outlined',
  svg: svg(
    (
      [
        [24, 24, 20, 0.4],
        [62, 18, 17, 1.6],
        [90, 34, 16, 2.8],
        [44, 52, 21, 3.9],
        [80, 66, 19, 5.1],
        [16, 62, 17, 0.9],
        [40, 90, 18, 2.2],
        [78, 98, 15, 3.4],
      ] as const
    )
      .map(([cx, cy, r, phase]) => path(blobPath(cx, cy, harmonic(r, 0.13, 0.07, phase), 12)))
      .join(''),
  ),
};

/** Big soft blobs pooling into one another. */
export const motifFluidBlobs: SpBuiltInMotifDefinition = {
  name: 'fluid-blobs',
  appearance: 'filled',
  svg: svg(
    path(blobPath(36, 40, harmonic(34, 0.16, 0.09, 0.4), 12), `${FILLABLE} opacity=".85"`) +
      path(blobPath(68, 56, harmonic(30, 0.15, 0.08, 2.6), 12), `${FILLABLE} opacity=".5"`) +
      path(blobPath(44, 82, harmonic(22, 0.17, 0.1, 4.7), 12), `${FILLABLE} opacity=".32"`),
  ),
};

/** One blob traced at four scales — contour, not mass. */
export const motifBlobOutlines: SpBuiltInMotifDefinition = {
  name: 'blob-outlines',
  appearance: 'outlined',
  svg: svg(
    times(4, (i) =>
      path(
        blobPath(50, 50, harmonic(46 - i * 11, 0.16, 0.09, 0.7), 12),
        ` opacity="${n(0.95 - i * 0.16)}"`,
      ),
    ),
  ),
};

/** A blob with pseudopods — higher harmonics, lobed edges. */
export const motifAmoebaShapes: SpBuiltInMotifDefinition = {
  name: 'amoeba-shapes',
  appearance: 'filled',
  svg: svg(
    path(
      blobPath(
        48,
        50,
        (a) => 38 * (1 + 0.2 * Math.sin(5 * a + 0.4) + 0.12 * Math.sin(3 * a - 1)),
        20,
      ),
      `${FILLABLE} opacity=".85"`,
    ) +
      path(
        blobPath(
          48,
          50,
          (a) => 20 * (1 + 0.24 * Math.sin(5 * a + 0.4) + 0.14 * Math.sin(3 * a - 1)),
          20,
        ),
        '',
      ) +
      circle(56, 44, 5, FILLABLE),
  ),
};

/** Clouds built from overlapping lobes on a flat base. */
export const motifCloudForms: SpBuiltInMotifDefinition = {
  name: 'cloud-forms',
  appearance: 'filled',
  svg: svg(
    path(
      'M12 54C4 54 0 47 4 41C7 36 14 35 17 38C18 27 30 21 39 27C44 18 58 18 63 28C74 25 82 34 79 44C86 45 88 54 80 54Z',
      `${FILLABLE} opacity=".85"`,
    ) +
      path(
        'M46 88C38 88 35 82 39 77C42 73 48 73 51 76C53 66 64 62 71 68C76 60 88 61 91 70C98 71 100 88 92 88Z',
        `${FILLABLE} opacity=".5"`,
      ) +
      path(
        'M2 74C0 68 6 64 11 67C14 60 24 60 27 67C32 66 36 74 30 74Z',
        `${FILLABLE} opacity=".3"`,
      ),
  ),
};

/** Every organic curve and terrain motif, in showcase order. */
export const ORGANIC_MOTIFS: readonly SpBuiltInMotifDefinition[] = [
  motifOrganicBlob,
  motifAbstractWaves,
  motifLayeredWaves,
  motifSCurves,
  motifBezierLoops,
  motifFlowingRibbons,
  motifFoldedRibbon,
  motifAbstractSwoosh,
  motifTopographicContours,
  motifAbstractTerrain,
  motifLayeredHorizon,
  motifAbstractMountains,
  motifFanShapes,
  motifPetalCluster,
  motifLeafShapes,
  motifPebbleShapes,
  motifOrganicCells,
  motifFluidBlobs,
  motifBlobOutlines,
  motifAmoebaShapes,
  motifCloudForms,
];


