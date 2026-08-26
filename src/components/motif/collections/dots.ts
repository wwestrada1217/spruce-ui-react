import { FILLABLE, circle, lattice, line, n, path, polygon, rect, svg } from './motif-definition.js';
import type { SpBuiltInMotifDefinition } from './motif-definition.js';

/**
 * Deterministic scatter.
 *
 * Motifs must render identically on every machine and every reload, so
 * placements come from a fixed sequence rather than Math.random. This is the
 * R2 low-discrepancy sequence — the reciprocals of the plastic number. A plain
 * hash clumps at these counts and leaves bald patches; R2 fills the field
 * evenly while still reading as scattered rather than gridded.
 */
const PLASTIC = 1.324717957244746;
const A1 = 1 / PLASTIC;
const A2 = 1 / (PLASTIC * PLASTIC);
const frac = (v: number) => v - Math.floor(v);

const scatter = (count: number, seed: number) =>
  Array.from({ length: count }, (_, i) => {
    const k = i + seed;
    return {
      x: 5 + frac(0.5 + A1 * k) * 90,
      y: 5 + frac(0.5 + A2 * k) * 90,
      t: frac(0.5 + 0.7548776662 * (k * 3 + 1)),
    };
  });

// ── Motifs ──────────────────────────────────────────────────────────────────

/** A calm lattice of small dots — texture rather than shape. */
export const motifDotGrid: SpBuiltInMotifDefinition = {
  name: 'dot-grid',
  appearance: 'filled',
  svg: svg(
    [10, 30, 50, 70, 90]
      .flatMap((cy) =>
        [10, 30, 50, 70, 90].map((cx) => `<circle data-motif-shape cx="${cx}" cy="${cy}" r="3"/>`),
      )
      .join(''),
  ),
};

/** Dots strewn loosely, off any lattice. */
export const motifScatteredDots: SpBuiltInMotifDefinition = {
  name: 'scattered-dots',
  appearance: 'filled',
  svg: svg(
    scatter(34, 3)
      .map(({ x, y, t }) => circle(x, y, 1.6 + t * 2.6, `${FILLABLE} opacity="${0.4 + t * 0.6}"`))
      .join(''),
  ),
};

/** A lattice whose dots shrink steadily across the field. */
export const motifDotGradient: SpBuiltInMotifDefinition = {
  name: 'dot-gradient',
  appearance: 'filled',
  svg: svg(
    lattice([8, 22, 36, 50, 64, 78, 92], [8, 22, 36, 50, 64, 78, 92], (x, y, col) =>
      circle(x, y, 5.2 - col * 0.72, `${FILLABLE} opacity="${0.95 - col * 0.11}"`),
    ),
  ),
};

/** Halftone: a staggered lattice with dot size ramping from a bright corner. */
export const motifHalftoneDots: SpBuiltInMotifDefinition = {
  name: 'halftone-dots',
  appearance: 'filled',
  svg: svg(
    lattice([0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6], (col, row) => {
      const x = 7 + col * 14.5 + (row % 2) * 7.25;
      const y = 9 + row * 14.5;
      // Distance from the bright corner drives the dot size. Capped so the
      // dense corner stays a field of dots rather than collapsing to a slab.
      const d = Math.hypot(x - 92, y - 9) / 120;
      return circle(x, y, Math.min(5.2, 0.9 + d * 5), FILLABLE);
    }),
  ),
};

/** Dots seated on concentric rings around a center. */
export const motifRadialDotField: SpBuiltInMotifDefinition = {
  name: 'radial-dot-field',
  appearance: 'filled',
  svg: svg(
    circle(50, 50, 3.4, FILLABLE) +
      [
        { r: 15, count: 7 },
        { r: 28, count: 13 },
        { r: 41, count: 19 },
        { r: 54, count: 25 },
      ]
        .map(({ r, count }, ring) =>
          Array.from({ length: count }, (_, i) => {
            const a = ((Math.PI * 2) / count) * i + ring * 0.3;
            return circle(
              50 + r * Math.cos(a),
              50 + r * Math.sin(a),
              3.2 - ring * 0.5,
              `${FILLABLE} opacity="${0.95 - ring * 0.16}"`,
            );
          }).join(''),
        )
        .join(''),
  ),
};

/** Stars joined into a figure, with unlinked stars around it. */
export const motifConstellation: SpBuiltInMotifDefinition = {
  name: 'constellation',
  appearance: 'filled',
  svg: svg(
    path('M16 74L34 52L52 60L66 30L88 22', ' opacity=".55"') +
      path('M52 60L58 86', ' opacity=".55"') +
      path('M66 30L44 20', ' opacity=".55"') +
      (
        [
          [16, 74, 3.6],
          [34, 52, 2.8],
          [52, 60, 4.2],
          [66, 30, 3.2],
          [88, 22, 2.6],
          [58, 86, 2.4],
          [44, 20, 2.2],
        ] as const
      )
        .map(([x, y, r]) => circle(x, y, r, FILLABLE))
        .join('') +
      scatter(12, 91)
        .map(({ x, y, t }) => circle(x, y, 0.9 + t * 0.9, `${FILLABLE} opacity="${0.3 + t * 0.3}"`))
        .join(''),
  ),
};

/** A small graph: nodes of varying weight joined by edges. */
export const motifConnectedNodes: SpBuiltInMotifDefinition = {
  name: 'connected-nodes',
  appearance: 'outlined',
  svg: svg(
    (
      [
        [22, 24, 62, 18],
        [22, 24, 40, 56],
        [62, 18, 84, 44],
        [40, 56, 84, 44],
        [40, 56, 30, 84],
        [84, 44, 74, 82],
        [30, 84, 74, 82],
      ] as const
    )
      .map(([x1, y1, x2, y2]) => line(x1, y1, x2, y2, ' opacity=".6"'))
      .join('') +
      (
        [
          [22, 24, 9],
          [62, 18, 6],
          [84, 44, 11],
          [40, 56, 13],
          [30, 84, 7],
          [74, 82, 8],
        ] as const
      )
        .map(([x, y, r]) => circle(x, y, r, FILLABLE))
        .join(''),
  ),
};

/** A denser mesh — many nodes, every near neighbour joined. */
export const motifNetworkMesh: SpBuiltInMotifDefinition = {
  name: 'network-mesh',
  appearance: 'filled',
  svg: svg(
    (() => {
      const nodes = scatter(16, 7).map(({ x, y }) => [x, y] as [number, number]);
      const edges: string[] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1]);
          if (d < 30) {
            edges.push(
              line(
                nodes[i][0],
                nodes[i][1],
                nodes[j][0],
                nodes[j][1],
                ` opacity="${n(0.7 - d / 60)}"`,
              ),
            );
          }
        }
      }
      return edges.join('') + nodes.map(([x, y]) => circle(x, y, 2.6, FILLABLE)).join('');
    })(),
  ),
};

/** Small marks at loose angles — restrained confetti. */
export const motifMinimalConfetti: SpBuiltInMotifDefinition = {
  name: 'minimal-confetti',
  appearance: 'filled',
  svg: svg(
    scatter(18, 23)
      .map(({ x, y, t }) =>
        rect(
          x,
          y,
          3 + t * 6,
          2.6,
          1.3,
          `${FILLABLE} opacity="${0.35 + t * 0.6}" transform="rotate(${n(t * 360)} ${n(x)} ${n(y)})"`,
        ),
      )
      .join(''),
  ),
};

/** Tiny outlined primitives adrift — circle, square, triangle. */
export const motifFloatingParticles: SpBuiltInMotifDefinition = {
  name: 'floating-particles',
  appearance: 'outlined',
  svg: svg(
    scatter(15, 53)
      .map(({ x, y, t }, i) => {
        const s = 3 + t * 4;
        const op = ` opacity="${n(0.35 + t * 0.6)}"`;
        if (i % 3 === 0) return circle(x, y, s, `${FILLABLE}${op}`);
        if (i % 3 === 1)
          return rect(
            x - s,
            y - s,
            s * 2,
            s * 2,
            1,
            `${FILLABLE}${op} transform="rotate(${n(t * 90)} ${n(x)} ${n(y)})"`,
          );
        return polygon(
          [
            [x, y - s],
            [x + s, y + s],
            [x - s, y + s],
          ],
          `${FILLABLE}${op}`,
        );
      })
      .join(''),
  ),
};

/** Scattered plus marks at four different scales. */
export const motifPlusPattern: SpBuiltInMotifDefinition = {
  name: 'plus-pattern',
  appearance: 'outlined',
  svg: svg(
    '<path d="M12 22h16M20 14v16"/>' +
      '<path d="M47 14h10M52 9v10"/>' +
      '<path d="M68 34h20M78 24v20"/>' +
      '<path d="M28 54h12M34 48v12"/>' +
      '<path d="M52 64h24M64 52v24"/>' +
      '<path d="M17 86h14M24 79v14"/>' +
      '<path d="M83 78h10M88 73v10"/>',
  ),
};

/** Every dot, node, and particle motif, in showcase order. */
export const DOT_MOTIFS: readonly SpBuiltInMotifDefinition[] = [
  motifDotGrid,
  motifScatteredDots,
  motifDotGradient,
  motifHalftoneDots,
  motifRadialDotField,
  motifConstellation,
  motifConnectedNodes,
  motifNetworkMesh,
  motifMinimalConfetti,
  motifFloatingParticles,
  motifPlusPattern,
];


