import {
  FILLABLE,
  hexagon,
  lattice,
  line,
  n,
  path,
  polygon,
  rect,
  svg,
  times,
} from './motif-definition.js';
import type { SpBuiltInMotifDefinition } from './motif-definition.js';

/** A sine-displaced horizontal or vertical rule. */
function wavyRule(fixed: number, amplitude: number, phase: number, vertical: boolean): string {
  const steps = 10;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 100;
    const offset = amplitude * Math.sin((i / steps) * Math.PI * 2 + phase);
    const x = vertical ? fixed + offset : t;
    const y = vertical ? t : fixed + offset;
    d += `${i === 0 ? 'M' : 'L'}${n(x)} ${n(y)}`;
  }
  return path(d);
}

// ── Motifs ──────────────────────────────────────────────────────────────────

/** A seven-cell honeycomb, cropped on three sides. */
export const motifHexagonPattern: SpBuiltInMotifDefinition = {
  name: 'hexagon-pattern',
  appearance: 'outlined',
  svg: svg(
    '<polygon data-motif-shape points="30,14 45.6,23 45.6,41 30,50 14.4,41 14.4,23"/>' +
      '<polygon data-motif-shape points="61.2,14 76.8,23 76.8,41 61.2,50 45.6,41 45.6,23"/>' +
      '<polygon data-motif-shape points="14.4,41 30,50 30,68 14.4,77 -1.2,68 -1.2,50"/>' +
      '<polygon data-motif-shape points="45.6,41 61.2,50 61.2,68 45.6,77 30,68 30,50"/>' +
      '<polygon data-motif-shape points="76.8,41 92.4,50 92.4,68 76.8,77 61.2,68 61.2,50"/>' +
      '<polygon data-motif-shape points="30,68 45.6,77 45.6,95 30,104 14.4,95 14.4,77"/>' +
      '<polygon data-motif-shape points="61.2,68 76.8,77 76.8,95 61.2,104 45.6,95 45.6,77"/>',
  ),
};

/** A comb with cells knocked out — the same lattice, deliberately incomplete. */
export const motifHoneycombFragments: SpBuiltInMotifDefinition = {
  name: 'honeycomb-fragments',
  appearance: 'outlined',
  svg: svg(
    (
      [
        [24, 22, 0.9],
        [56, 16, 0.6],
        [86, 30, 0.45],
        [40, 48, 0.85],
        [72, 58, 0.55],
        [18, 70, 0.5],
        [50, 84, 0.7],
        [88, 88, 0.3],
      ] as const
    )
      .map(([cx, cy, op]) => polygon(hexagon(cx, cy, 15), `${FILLABLE} opacity="${op}"`))
      .join(''),
  ),
};

/** An even lattice of open squares. */
export const motifSquareGrid: SpBuiltInMotifDefinition = {
  name: 'square-grid',
  appearance: 'outlined',
  svg: svg(lattice([6, 30, 54, 78], [6, 30, 54, 78], (x, y) => rect(x, y, 18, 18, 1))),
};

/** The same lattice turned 45° — a field of diamonds. */
export const motifDiamondGrid: SpBuiltInMotifDefinition = {
  name: 'diamond-grid',
  appearance: 'outlined',
  svg: svg(
    lattice([0, 25, 50, 75, 100], [0, 25, 50, 75, 100], (x, y) =>
      polygon([
        [x, y - 13],
        [x + 13, y],
        [x, y + 13],
        [x - 13, y],
      ]),
    ),
  ),
};

/** A grid whose cells slip out of true and go missing. */
export const motifBrokenGrid: SpBuiltInMotifDefinition = {
  name: 'broken-grid',
  appearance: 'outlined',
  svg: svg(
    lattice([6, 30, 54, 78], [6, 30, 54, 78], (x, y, col, row) => {
      const gone = (col * 3 + row * 5) % 7 === 0;
      if (gone) return '';
      const slip = ((col + row) % 3) - 1;
      return rect(x + slip * 3, y - slip * 2, 18, 18, 1);
    }),
  ),
};

/** A checkerboard with every other row shifted half a cell. */
export const motifOffsetChecker: SpBuiltInMotifDefinition = {
  name: 'offset-checker',
  appearance: 'filled',
  svg: svg(
    lattice([0, 20, 40, 60, 80], [0, 20, 40, 60, 80], (x, y, col, row) =>
      (col + row) % 2 === 0
        ? rect(x + (row % 2) * 10, y, 20, 20, 0, `${FILLABLE} opacity="${0.9 - row * 0.14}"`)
        : '',
    ),
  ),
};

/** Fine graph paper with a heavier rule every fourth line. */
export const motifBlueprintGrid: SpBuiltInMotifDefinition = {
  name: 'blueprint-grid',
  appearance: 'outlined',
  svg: svg(
    times(11, (i) => line(i * 10, 0, i * 10, 100, ` opacity="${i % 2 === 0 ? 0.8 : 0.28}"`)) +
      times(11, (i) => line(0, i * 10, 100, i * 10, ` opacity="${i % 2 === 0 ? 0.8 : 0.28}"`)),
  ),
};

/** Axes with tick marks over a light plotting grid. */
export const motifCoordinateGrid: SpBuiltInMotifDefinition = {
  name: 'coordinate-grid',
  appearance: 'outlined',
  svg: svg(
    times(9, (i) => line(10 + i * 10, 6, 10 + i * 10, 94, ' opacity=".22"')) +
      times(9, (i) => line(6, 10 + i * 10, 94, 10 + i * 10, ' opacity=".22"')) +
      line(50, 2, 50, 98) +
      line(2, 50, 98, 50) +
      times(9, (i) => line(47, 10 + i * 10, 53, 10 + i * 10)) +
      times(9, (i) => line(10 + i * 10, 47, 10 + i * 10, 53)),
  ),
};

/** Window panes divided by mullions, with a transom above. */
export const motifWindowGrid: SpBuiltInMotifDefinition = {
  name: 'window-grid',
  appearance: 'outlined',
  svg: svg(
    rect(10, 6, 80, 88, 3, '') +
      lattice([16, 42, 68], [12, 38, 64], (x, y) => rect(x, y, 20, 22, 1, FILLABLE)) +
      line(10, 50, 90, 50, ' opacity=".5"'),
  ),
};

/** A grid drawn with sine-displaced rules instead of straight ones. */
export const motifWavyGrid: SpBuiltInMotifDefinition = {
  name: 'wavy-grid',
  appearance: 'outlined',
  svg: svg(
    times(6, (i) => wavyRule(6 + i * 18, 4, i * 0.7, false)) +
      times(6, (i) => wavyRule(6 + i * 18, 4, i * 0.7 + 1.6, true)),
  ),
};

/** A checkerboard whose cells swell and shrink across the field. */
export const motifWarpedChecker: SpBuiltInMotifDefinition = {
  name: 'warped-checker',
  appearance: 'filled',
  svg: svg(
    lattice([0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5], (col, row) => {
      if ((col + row) % 2 !== 0) return '';
      const s = 10 + (col + row) * 1.6;
      const x = col * 17 + col * col * 0.4;
      const y = row * 17 + row * row * 0.4;
      return rect(x, y, s, s, 1, `${FILLABLE} opacity="${0.9 - (col + row) * 0.07}"`);
    }),
  ),
};

/** Smooth curves crossing in both directions — a mesh drawn as contours. */
export const motifMeshOutlines: SpBuiltInMotifDefinition = {
  name: 'mesh-outlines',
  appearance: 'outlined',
  svg: svg(
    times(5, (i) => {
      const y = 8 + i * 21;
      return path(`M-6 ${n(y)}C22 ${n(y - 16 + i * 3)} 60 ${n(y + 18 - i * 3)} 106 ${n(y - 4)}`);
    }) +
      times(5, (i) => {
        const x = 8 + i * 21;
        return path(`M${n(x)} -6C${n(x - 16 + i * 4)} 26 ${n(x + 18 - i * 4)} 66 ${n(x + 2)} 106`);
      }),
  ),
};

/** Every grid and lattice motif, in showcase order. */
export const GRID_MOTIFS: readonly SpBuiltInMotifDefinition[] = [
  motifHexagonPattern,
  motifHoneycombFragments,
  motifSquareGrid,
  motifDiamondGrid,
  motifBrokenGrid,
  motifOffsetChecker,
  motifBlueprintGrid,
  motifCoordinateGrid,
  motifWindowGrid,
  motifWavyGrid,
  motifWarpedChecker,
  motifMeshOutlines,
];


