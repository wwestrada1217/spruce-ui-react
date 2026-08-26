import {
  FILLABLE,
  blobPath,
  circle,
  lattice,
  line,
  n,
  path,
  polygon,
  polyline,
  rect,
  regularPolygon,
  sparklePath,
  svg,
  times,
} from './motif-definition.js';
import type { SpBuiltInMotifDefinition } from './motif-definition.js';

/** An isometric cube: top rhombus plus the two visible faces. */
function isoCube(cx: number, cy: number, s: number, opacity: number): string {
  const w = 0.866 * s;
  const top: [number, number][] = [
    [cx, cy - s],
    [cx + w, cy - s / 2],
    [cx, cy],
    [cx - w, cy - s / 2],
  ];
  const left: [number, number][] = [
    [cx - w, cy - s / 2],
    [cx, cy],
    [cx, cy + s],
    [cx - w, cy + s / 2],
  ];
  const right: [number, number][] = [
    [cx + w, cy - s / 2],
    [cx, cy],
    [cx, cy + s],
    [cx + w, cy + s / 2],
  ];
  const op = ` opacity="${opacity}"`;
  return (
    polygon(top, `${FILLABLE}${op}`) +
    polygon(left, `${FILLABLE} opacity="${opacity * 0.65}"`) +
    polygon(right, `${FILLABLE} opacity="${opacity * 0.4}"`)
  );
}

/** A plus built from two overlapping rounded bars, so it fills cleanly. */
const roundedCross = (cx: number, cy: number, arm: number, thick: number, opacity: number) => {
  const op = `${FILLABLE} opacity="${opacity}"`;
  return (
    rect(cx - arm, cy - thick / 2, arm * 2, thick, thick / 2, op) +
    rect(cx - thick / 2, cy - arm, thick, arm * 2, thick / 2, op)
  );
};

// ── Motifs ──────────────────────────────────────────────────────────────────

/**
 * Three rounded squares turned 45°, stepped in size and weight. The default
 * enterprise notification ornament: quiet, geometric, reads as depth.
 */
export const motifOverlappingDiamonds: SpBuiltInMotifDefinition = {
  name: 'overlapping-diamonds',
  appearance: 'filled',
  svg: svg(
    '<rect data-motif-shape x="15" y="19" width="46" height="46" rx="10" transform="rotate(45 38 42)" opacity=".9"/>' +
      '<rect data-motif-shape x="49" y="21" width="34" height="34" rx="8" transform="rotate(45 66 38)" opacity=".6"/>' +
      '<rect data-motif-shape x="41" y="55" width="30" height="30" rx="7" transform="rotate(45 56 70)" opacity=".38"/>',
  ),
};

/** Overlapping rounded rectangles at mixed sizes, tilts, and weights. */
export const motifRoundedBlocks: SpBuiltInMotifDefinition = {
  name: 'rounded-blocks',
  appearance: 'filled',
  svg: svg(
    '<rect data-motif-shape x="8" y="16" width="46" height="46" rx="12" opacity=".85"/>' +
      '<rect data-motif-shape x="38" y="36" width="54" height="54" rx="14" transform="rotate(10 65 63)" opacity=".55"/>' +
      '<rect data-motif-shape x="54" y="6" width="30" height="30" rx="9" transform="rotate(-16 69 21)" opacity=".35"/>',
  ),
};

/** Four rounded squares nested on one center — quiet concentric depth. */
export const motifNestedRoundedSquares: SpBuiltInMotifDefinition = {
  name: 'nested-rounded-squares',
  appearance: 'outlined',
  svg: svg(
    times(4, (i) => {
      const s = 92 - i * 22;
      return rect(50 - s / 2, 50 - s / 2, s, s, 8 + (3 - i) * 4, i === 3 ? FILLABLE : '');
    }),
  ),
};

/** Three stacked cubes in isometric projection. */
export const motifIsometricCubes: SpBuiltInMotifDefinition = {
  name: 'isometric-cubes',
  appearance: 'filled',
  svg: svg(isoCube(34, 40, 22, 0.9) + isoCube(64, 30, 18, 0.6) + isoCube(58, 72, 24, 0.4)),
};

/** Triangles at mixed scales and rotations, loosely grouped. */
export const motifTriangleCluster: SpBuiltInMotifDefinition = {
  name: 'triangle-cluster',
  appearance: 'outlined',
  svg: svg(
    polygon(regularPolygon(36, 38, 28, 3, -90), `${FILLABLE} opacity=".9"`) +
      polygon(regularPolygon(70, 56, 22, 3, 150), `${FILLABLE} opacity=".6"`) +
      polygon(regularPolygon(42, 76, 16, 3, -30), `${FILLABLE} opacity=".45"`) +
      polygon(regularPolygon(80, 20, 12, 3, -90), `${FILLABLE} opacity=".35"`),
  ),
};

/** A triangulated surface — adjoining facets sharing edges. */
export const motifLowPolyFacets: SpBuiltInMotifDefinition = {
  name: 'low-poly-facets',
  appearance: 'outlined',
  svg: svg(
    [
      [
        [2, 22],
        [34, 4],
        [30, 40],
      ],
      [
        [34, 4],
        [68, 16],
        [30, 40],
      ],
      [
        [68, 16],
        [98, 6],
        [76, 44],
      ],
      [
        [68, 16],
        [76, 44],
        [30, 40],
      ],
      [
        [2, 22],
        [30, 40],
        [6, 62],
      ],
      [
        [30, 40],
        [76, 44],
        [52, 72],
      ],
      [
        [30, 40],
        [52, 72],
        [6, 62],
      ],
      [
        [76, 44],
        [98, 6],
        [96, 66],
      ],
      [
        [76, 44],
        [96, 66],
        [52, 72],
      ],
      [
        [6, 62],
        [52, 72],
        [24, 96],
      ],
      [
        [52, 72],
        [96, 66],
        [72, 98],
      ],
      [
        [52, 72],
        [72, 98],
        [24, 96],
      ],
    ]
      .map((tri, i) =>
        polygon(tri as [number, number][], `${FILLABLE} opacity="${0.25 + (i % 4) * 0.16}"`),
      )
      .join(''),
  ),
};

/** Triangular prisms — a front face, its offset twin, and the side between. */
export const motifPrismShapes: SpBuiltInMotifDefinition = {
  name: 'prism-shapes',
  appearance: 'outlined',
  svg: svg(
    // Side face reads as the depth of the solid, so it carries the fill.
    polygon(
      [
        [46, 30],
        [64, 16],
        [86, 62],
        [68, 76],
      ],
      `${FILLABLE} opacity=".45"`,
    ) +
      polygon(
        [
          [24, 76],
          [46, 30],
          [68, 76],
        ],
        `${FILLABLE} opacity=".85"`,
      ) +
      polyline([
        [42, 62],
        [64, 16],
        [86, 62],
      ]) +
      line(24, 76, 42, 62) +
      line(42, 62, 86, 62, ' opacity=".5"') +
      polygon(
        [
          [8, 96],
          [20, 70],
          [32, 96],
        ],
        `${FILLABLE} opacity=".3"`,
      ),
  ),
};

/** A cut gem: outline plus the internal facet lines. */
export const motifCrystalFacets: SpBuiltInMotifDefinition = {
  name: 'crystal-facets',
  appearance: 'outlined',
  svg: svg(
    polygon(
      [
        [50, 6],
        [86, 32],
        [72, 82],
        [28, 82],
        [14, 32],
      ],
      FILLABLE,
    ) +
      line(50, 6, 30, 44) +
      line(50, 6, 70, 44) +
      line(14, 32, 30, 44) +
      line(86, 32, 70, 44) +
      line(30, 44, 70, 44) +
      line(30, 44, 28, 82) +
      line(70, 44, 72, 82) +
      line(30, 44, 50, 82) +
      line(70, 44, 50, 82),
  ),
};

/** Regular polygons spoked from their centers to every vertex. */
export const motifFacetedPolygons: SpBuiltInMotifDefinition = {
  name: 'faceted-polygons',
  appearance: 'outlined',
  svg: svg(
    [
      { cx: 34, cy: 36, r: 26, sides: 5 },
      { cx: 72, cy: 64, r: 22, sides: 6 },
      { cx: 30, cy: 80, r: 14, sides: 7 },
    ]
      .map(
        ({ cx, cy, r, sides }) =>
          polygon(regularPolygon(cx, cy, r, sides), FILLABLE) +
          regularPolygon(cx, cy, r, sides)
            .map(([x, y]) => line(cx, cy, x, y))
            .join(''),
      )
      .join(''),
  ),
};

/** Shields: square shoulders drawn down to a point. */
export const motifAbstractShields: SpBuiltInMotifDefinition = {
  name: 'abstract-shields',
  appearance: 'outlined',
  svg: svg(
    (
      [
        [30, 12, 22, 60, 0.9],
        [70, 34, 16, 44, 0.55],
        [58, 8, 12, 30, 0.3],
      ] as const
    )
      .map(([cx, cy, w, h, op]) =>
        path(
          `M${n(cx - w)} ${n(cy)}H${n(cx + w)}V${n(cy + h * 0.45)}` +
            `C${n(cx + w)} ${n(cy + h * 0.74)} ${n(cx + w * 0.5)} ${n(cy + h * 0.93)} ${n(cx)} ${n(cy + h)}` +
            `C${n(cx - w * 0.5)} ${n(cy + h * 0.93)} ${n(cx - w)} ${n(cy + h * 0.74)} ${n(cx - w)} ${n(cy + h * 0.45)}Z`,
          `${FILLABLE} opacity="${op}"`,
        ),
      )
      .join(''),
  ),
};

/** Circle, square, and triangle in a primary-shape composition. */
export const motifBauhausGeometry: SpBuiltInMotifDefinition = {
  name: 'bauhaus-geometry',
  appearance: 'filled',
  svg: svg(
    rect(6, 8, 40, 40, 0, `${FILLABLE} opacity=".85"`) +
      circle(64, 34, 28, `${FILLABLE} opacity=".5"`) +
      polygon(
        [
          [22, 94],
          [50, 50],
          [78, 94],
        ],
        `${FILLABLE} opacity=".65"`,
      ) +
      line(0, 50, 100, 50),
  ),
};

/** Eighties graphic language: squiggle, wedge, ring, and confetti bars. */
export const motifMemphisShapes: SpBuiltInMotifDefinition = {
  name: 'memphis-shapes',
  appearance: 'outlined',
  svg: svg(
    path('M4 26C14 12 24 40 34 26S54 12 64 26') +
      polygon(
        [
          [70, 8],
          [94, 8],
          [82, 32],
        ],
        FILLABLE,
      ) +
      circle(24, 62, 15, '') +
      circle(24, 62, 6, FILLABLE) +
      polyline([
        [50, 58],
        [58, 48],
        [66, 58],
        [74, 48],
        [82, 58],
      ]) +
      rect(60, 70, 26, 8, 4, `${FILLABLE} opacity=".6"`) +
      rect(14, 84, 34, 8, 4, `${FILLABLE} opacity=".4"`),
  ),
};

/** Interlocking L-shaped polygons. */
export const motifLShapes: SpBuiltInMotifDefinition = {
  name: 'l-shapes',
  appearance: 'filled',
  svg: svg(
    [
      { x: 8, y: 12, a: 42, b: 16, op: 0.85 },
      { x: 54, y: 34, a: 38, b: 14, op: 0.55 },
      { x: 20, y: 60, a: 32, b: 12, op: 0.35 },
    ]
      .map(({ x, y, a, b, op }) =>
        polygon(
          [
            [x, y],
            [x + b, y],
            [x + b, y + a - b],
            [x + a, y + a - b],
            [x + a, y + a],
            [x, y + a],
          ],
          `${FILLABLE} opacity="${op}"`,
        ),
      )
      .join(''),
  ),
};

/** Folded-paper geometry: panels meeting along crease lines. */
export const motifPaperFold: SpBuiltInMotifDefinition = {
  name: 'paper-fold',
  appearance: 'filled',
  svg: svg(
    polygon(
      [
        [6, 24],
        [40, 8],
        [40, 66],
        [6, 82],
      ],
      `${FILLABLE} opacity=".85"`,
    ) +
      polygon(
        [
          [40, 8],
          [72, 26],
          [72, 84],
          [40, 66],
        ],
        `${FILLABLE} opacity=".5"`,
      ) +
      polygon(
        [
          [72, 26],
          [98, 12],
          [98, 70],
          [72, 84],
        ],
        `${FILLABLE} opacity=".3"`,
      ) +
      line(40, 8, 40, 66) +
      line(72, 26, 72, 84),
  ),
};

/** Irregular tiles packed edge to edge. */
export const motifMosaicBlocks: SpBuiltInMotifDefinition = {
  name: 'mosaic-blocks',
  appearance: 'filled',
  svg: svg(
    (
      [
        [4, 6, 30, 22, 0.85],
        [38, 6, 22, 34, 0.4],
        [64, 6, 32, 14, 0.6],
        [4, 32, 14, 30, 0.5],
        [22, 32, 12, 12, 0.3],
        [64, 24, 14, 26, 0.35],
        [82, 24, 14, 44, 0.7],
        [4, 66, 26, 30, 0.35],
        [34, 48, 26, 20, 0.75],
        [34, 72, 44, 24, 0.45],
        [22, 48, 8, 14, 0.6],
      ] as const
    )
      .map(([x, y, w, h, op]) => rect(x, y, w, h, 2, `${FILLABLE} opacity="${op}"`))
      .join(''),
  ),
};

/** Tetromino blocks, each drawn as a run of unit cells. */
export const motifTetrisBlocks: SpBuiltInMotifDefinition = {
  name: 'tetris-blocks',
  appearance: 'filled',
  svg: svg(
    (
      [
        {
          cells: [
            [0, 0],
            [1, 0],
            [2, 0],
            [1, 1],
          ],
          x: 8,
          y: 10,
          op: 0.85,
        },
        {
          cells: [
            [0, 0],
            [0, 1],
            [1, 1],
            [2, 1],
          ],
          x: 58,
          y: 12,
          op: 0.5,
        },
        {
          cells: [
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1],
          ],
          x: 12,
          y: 56,
          op: 0.35,
        },
        {
          cells: [
            [0, 0],
            [0, 1],
            [0, 2],
            [1, 2],
          ],
          x: 54,
          y: 50,
          op: 0.65,
        },
      ] as { cells: [number, number][]; x: number; y: number; op: number }[]
    )
      .map(({ cells, x, y, op }) =>
        cells
          .map(([cx, cy]) =>
            rect(x + cx * 18, y + cy * 18, 16, 16, 3, `${FILLABLE} opacity="${op}"`),
          )
          .join(''),
      )
      .join(''),
  ),
};

/** A dissolving cluster of pixels — dense at one corner, sparse at the other. */
export const motifPixelCluster: SpBuiltInMotifDefinition = {
  name: 'pixel-cluster',
  appearance: 'filled',
  svg: svg(
    lattice([6, 22, 38, 54, 70, 86], [6, 22, 38, 54, 70, 86], (x, y, col, row) => {
      // A deterministic checkerboard-plus-diagonal thinning: dense top-left,
      // scattered bottom-right. No randomness, so the motif is stable.
      const keep = (col * 7 + row * 5) % 4 !== 0 && col + row < 8;
      return keep ? rect(x, y, 11, 11, 2, `${FILLABLE} opacity="${1 - (col + row) * 0.08}"`) : '';
    }),
  ),
};

/** Rounded plus marks at three scales. */
export const motifRoundedCrosses: SpBuiltInMotifDefinition = {
  name: 'rounded-crosses',
  appearance: 'filled',
  svg: svg(
    roundedCross(30, 32, 20, 11, 0.9) +
      roundedCross(72, 24, 13, 8, 0.55) +
      roundedCross(64, 68, 24, 13, 0.4) +
      roundedCross(22, 78, 11, 7, 0.3),
  ),
};

/** Soft lobed bursts — rounded rays rather than spikes. */
export const motifSoftStarburst: SpBuiltInMotifDefinition = {
  name: 'soft-starburst',
  appearance: 'filled',
  svg: svg(
    path(
      blobPath(42, 44, (a) => 34 * (1 + 0.26 * Math.cos(8 * a)), 32),
      `${FILLABLE} opacity=".9"`,
    ) +
      path(
        blobPath(76, 76, (a) => 19 * (1 + 0.28 * Math.cos(6 * a + 0.5)), 24),
        `${FILLABLE} opacity=".5"`,
      ),
  ),
};

/** Four-point sparkles scattered at mixed sizes. */
export const motifSparkleCluster: SpBuiltInMotifDefinition = {
  name: 'sparkle-cluster',
  appearance: 'filled',
  svg: svg(
    (
      [
        [32, 30, 22, 0.9],
        [70, 20, 12, 0.55],
        [78, 56, 18, 0.7],
        [46, 62, 10, 0.4],
        [22, 76, 14, 0.5],
        [64, 88, 8, 0.3],
      ] as const
    )
      .map(([cx, cy, r, op]) => path(sparklePath(cx, cy, r), `${FILLABLE} opacity="${op}"`))
      .join(''),
  ),
};

/** Abstract rune-like marks — strokes, arcs, and dots without meaning. */
export const motifAbstractGlyphs: SpBuiltInMotifDefinition = {
  name: 'abstract-glyphs',
  appearance: 'outlined',
  svg: svg(
    path('M12 12v22M12 23h14M26 12v22') +
      path('M44 12a11 11 0 0 1 0 22M44 23h10') +
      path('M70 12h18l-18 22h18') +
      path('M12 48v24M12 60c10-10 18 10 26 0') +
      circle(52, 60, 11, '') +
      line(52, 49, 52, 71) +
      path('M74 48v24M74 56h16v10') +
      path('M12 84h20M18 78v12') +
      path('M42 78a10 10 0 1 0 0 20') +
      polyline([
        [62, 96],
        [70, 78],
        [78, 96],
        [86, 78],
      ]),
  ),
};

/** An orthogonal staircase climbing to the right. */
export const motifStairStep: SpBuiltInMotifDefinition = {
  name: 'stair-step',
  appearance: 'outlined',
  svg: svg(
    [0, 26, 52]
      .map((offset) => {
        const points: [number, number][] = [];
        for (let i = 0; i < 6; i++) {
          const x = offset - 30 + i * 22;
          const y = 106 - i * 22;
          points.push([x, y], [x + 22, y], [x + 22, y - 22]);
        }
        return polyline(points);
      })
      .join(''),
  ),
};

/** A lattice of chevron marks, every other row nudged across. */
export const motifChevronPattern: SpBuiltInMotifDefinition = {
  name: 'chevron-pattern',
  appearance: 'outlined',
  svg: svg(
    lattice([8, 36, 64, 92], [12, 34, 56, 78], (x, y, _col, row) =>
      polyline([
        [x - 10 + (row % 2) * 14, y + 8],
        [x + (row % 2) * 14, y - 4],
        [x + 10 + (row % 2) * 14, y + 8],
      ]),
    ),
  ),
};

/** Continuous zigzags spanning the full width. */
export const motifZigzagLines: SpBuiltInMotifDefinition = {
  name: 'zigzag-lines',
  appearance: 'outlined',
  svg: svg(
    [16, 40, 64, 88]
      .map((y) =>
        polyline(
          Array.from(
            { length: 9 },
            (_, i) => [-8 + i * 14, y + (i % 2 === 0 ? -8 : 8)] as [number, number],
          ),
        ),
      )
      .join(''),
  ),
};

/** Every geometric motif, in showcase order. */
export const GEOMETRIC_MOTIFS: readonly SpBuiltInMotifDefinition[] = [
  motifOverlappingDiamonds,
  motifRoundedBlocks,
  motifNestedRoundedSquares,
  motifIsometricCubes,
  motifTriangleCluster,
  motifLowPolyFacets,
  motifPrismShapes,
  motifCrystalFacets,
  motifFacetedPolygons,
  motifAbstractShields,
  motifBauhausGeometry,
  motifMemphisShapes,
  motifLShapes,
  motifPaperFold,
  motifMosaicBlocks,
  motifTetrisBlocks,
  motifPixelCluster,
  motifRoundedCrosses,
  motifSoftStarburst,
  motifSparkleCluster,
  motifAbstractGlyphs,
  motifStairStep,
  motifChevronPattern,
  motifZigzagLines,
];


