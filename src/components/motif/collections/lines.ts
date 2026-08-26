import {
  FILLABLE,
  circle,
  line,
  n,
  onCircle,
  path,
  polyline,
  rect,
  svg,
  times,
} from './motif-definition.js';
import type { SpBuiltInMotifDefinition } from './motif-definition.js';

// ── Motifs ──────────────────────────────────────────────────────────────────

/** Parallel 45° rules rising to the right. */
export const motifDiagonalLines: SpBuiltInMotifDefinition = {
  name: 'diagonal-lines',
  appearance: 'outlined',
  svg: svg(
    [-110, -90, -70, -50, -30, -10, 10, 30, 50, 70, 90]
      .map((x) => `<line x1="${x}" y1="110" x2="${x + 120}" y2="-10"/>`)
      .join(''),
  ),
};

/** A fan of rules thrown from a point just off the corner. */
export const motifRadiatingLines: SpBuiltInMotifDefinition = {
  name: 'radiating-lines',
  appearance: 'outlined',
  svg: svg(
    times(13, (i) => {
      const deg = -88 + i * 7.6;
      const [x, y] = onCircle(-8, 104, 150, deg);
      return line(-8, 104, x, y, ` opacity="${n(0.95 - Math.abs(i - 6) * 0.06)}"`);
    }),
  ),
};

/** Rays thrown the full way round a visible hub. */
export const motifSunburst: SpBuiltInMotifDefinition = {
  name: 'sunburst',
  appearance: 'outlined',
  svg: svg(
    times(24, (i) => {
      const deg = i * 15;
      const long = i % 2 === 0;
      const [x0, y0] = onCircle(50, 50, 14, deg);
      const [x1, y1] = onCircle(50, 50, long ? 52 : 38, deg);
      return line(x0, y0, x1, y1, long ? '' : ' opacity=".5"');
    }) + circle(50, 50, 9, FILLABLE),
  ),
};

/** A receding floor: rails to a vanishing point, crossed by sleepers. */
export const motifPerspectiveLines: SpBuiltInMotifDefinition = {
  name: 'perspective-lines',
  appearance: 'outlined',
  svg: svg(
    times(9, (i) =>
      line(50, 30, -40 + i * 22.5, 108, ` opacity="${n(0.9 - Math.abs(i - 4) * 0.08)}"`),
    ) +
      [36, 44, 55, 70, 90]
        .map((y, i) => line(0, y, 100, y, ` opacity="${n(0.3 + i * 0.14)}"`))
        .join('') +
      line(0, 30, 100, 30),
  ),
};

/** Rays converging on a point sitting on the horizon. */
export const motifVanishingPointRays: SpBuiltInMotifDefinition = {
  name: 'vanishing-point-rays',
  appearance: 'outlined',
  svg: svg(
    times(18, (i) => {
      const [x, y] = onCircle(72, 40, 160, i * 20);
      return line(72, 40, x, y, ` opacity="${n(0.25 + (i % 3) * 0.3)}"`);
    }) +
      line(0, 40, 100, 40) +
      circle(72, 40, 5, FILLABLE),
  ),
};

/** Vertical bars of varying width and weight. */
export const motifBarcodeStripes: SpBuiltInMotifDefinition = {
  name: 'barcode-stripes',
  appearance: 'filled',
  svg: svg(
    (() => {
      const widths = [3, 6, 2, 8, 3, 2, 5, 9, 2, 4, 7, 3, 2, 6, 4, 8, 2, 3];
      let x = 2;
      const bars: string[] = [];
      for (let i = 0; i < widths.length && x < 98; i++) {
        bars.push(rect(x, 6, widths[i], 88, 0, `${FILLABLE} opacity="${n(0.4 + (i % 4) * 0.2)}"`));
        x += widths[i] + 2 + (i % 3);
      }
      return bars.join('');
    })(),
  ),
};

/** Short rules starting and ending at staggered offsets. */
export const motifStaggeredSegments: SpBuiltInMotifDefinition = {
  name: 'staggered-segments',
  appearance: 'outlined',
  svg: svg(
    times(11, (i) => {
      const y = 6 + i * 8.8;
      const x0 = 4 + ((i * 23) % 46);
      const len = 20 + ((i * 17) % 44);
      return line(x0, y, Math.min(x0 + len, 98), y, ` opacity="${n(0.4 + ((i * 7) % 6) * 0.1)}"`);
    }),
  ),
};

/** Rounded bars mirrored about a center line — a waveform envelope. */
export const motifSoundWaveBars: SpBuiltInMotifDefinition = {
  name: 'sound-wave-bars',
  appearance: 'filled',
  svg: svg(
    times(17, (i) => {
      const h = 12 + Math.abs(Math.sin(i * 0.9)) * 62 + (i % 3) * 4;
      const x = 4 + i * 5.6;
      return rect(x, 50 - h / 2, 3.4, h, 1.7, `${FILLABLE} opacity="${n(0.45 + (i % 4) * 0.18)}"`);
    }),
  ),
};

/** Segmented columns rising from a baseline, meter fashion. */
export const motifEqualizerLines: SpBuiltInMotifDefinition = {
  name: 'equalizer-lines',
  appearance: 'filled',
  svg: svg(
    times(9, (i) => {
      const segments = 3 + ((i * 5) % 7);
      const x = 6 + i * 10.6;
      return (
        times(segments, (s) =>
          rect(x, 84 - s * 9, 7, 6, 1.5, `${FILLABLE} opacity="${n(0.9 - s * 0.09)}"`),
        ) + rect(x, 84 - (segments + 1) * 9, 7, 3, 1.5, `${FILLABLE} opacity=".35"`)
      );
    }) + line(2, 92, 98, 92, ' opacity=".5"'),
  ),
};

/** A single trace with one sharp beat — an ECG line. */
export const motifPulseWaveform: SpBuiltInMotifDefinition = {
  name: 'pulse-waveform',
  appearance: 'outlined',
  svg: svg(
    polyline([
      [-4, 50],
      [16, 50],
      [22, 42],
      [28, 50],
      [40, 50],
      [46, 22],
      [54, 84],
      [60, 50],
      [72, 50],
      [78, 40],
      [84, 58],
      [90, 50],
      [104, 50],
    ]) + line(-4, 50, 104, 50, ' opacity=".18"'),
  ),
};

/** Long curves drawn as dashes. */
export const motifDashedCurves: SpBuiltInMotifDefinition = {
  name: 'dashed-curves',
  appearance: 'outlined',
  svg: svg(
    times(5, (i) => {
      const y = 10 + i * 20;
      return path(
        `M-6 ${n(y)}C26 ${n(y - 22)} 62 ${n(y + 26)} 106 ${n(y - 6)}`,
        ` stroke-dasharray="8 6" opacity="${n(0.95 - i * 0.13)}"`,
      );
    }),
  ),
};

/** One continuous line looping back through itself. */
export const motifMonolineLoops: SpBuiltInMotifDefinition = {
  name: 'monoline-loops',
  appearance: 'outlined',
  svg: svg(
    path(
      'M6 62C6 30 26 12 46 12C66 12 78 28 66 44C54 60 30 52 34 32' +
        'C38 12 62 4 78 18C94 32 96 66 74 82C52 98 20 92 8 74',
    ),
  ),
};

/** Figure-eight loops at two scales. */
export const motifInfinityCurves: SpBuiltInMotifDefinition = {
  name: 'infinity-curves',
  appearance: 'outlined',
  svg: svg(
    path('M50 44C38 20 6 24 6 44C6 64 38 68 50 44C62 20 94 24 94 44C94 64 62 68 50 44Z') +
      path(
        'M50 72C42 58 22 60 22 72C22 84 42 86 50 72C58 58 78 60 78 72C78 84 58 86 50 72Z',
        ' opacity=".5"',
      ),
  ),
};

/** An arc spiral winding out from the center. */
export const motifSpiralArcs: SpBuiltInMotifDefinition = {
  name: 'spiral-arcs',
  appearance: 'outlined',
  svg: svg(
    (() => {
      let d = 'M50 50';
      let r = 6;
      let a = 0;
      for (let i = 0; i < 9; i++) {
        const next = r + 5.5;
        const [x, y] = onCircle(50, 50, next, a + 180);
        d += `A${n((r + next) / 2)} ${n((r + next) / 2)} 0 0 1 ${n(x)} ${n(y)}`;
        r = next;
        a += 180;
      }
      return path(d) + circle(50, 50, 3, FILLABLE);
    })(),
  ),
};

/** Orthogonal traces with pads and vias, circuit-board fashion. */
export const motifCircuitLines: SpBuiltInMotifDefinition = {
  name: 'circuit-lines',
  appearance: 'outlined',
  svg: svg(
    path('M2 18H30L44 32H72V58H92') +
      path('M2 48H18L30 60V88H58', ' opacity=".75"') +
      path('M98 24H74L62 12H38', ' opacity=".6"') +
      path('M40 96V72L52 60H88V38', ' opacity=".5"') +
      (
        [
          [30, 18],
          [72, 32],
          [92, 58],
          [18, 48],
          [58, 88],
          [74, 24],
          [38, 12],
          [40, 96],
          [88, 38],
        ] as const
      )
        .map(([x, y]) => circle(x, y, 3.2, FILLABLE))
        .join('') +
      circle(52, 60, 5, '') +
      circle(44, 32, 5, ''),
  ),
};

/** Every straight-line, ray, and signal motif, in showcase order. */
export const LINE_MOTIFS: readonly SpBuiltInMotifDefinition[] = [
  motifDiagonalLines,
  motifRadiatingLines,
  motifSunburst,
  motifPerspectiveLines,
  motifVanishingPointRays,
  motifBarcodeStripes,
  motifStaggeredSegments,
  motifSoundWaveBars,
  motifEqualizerLines,
  motifPulseWaveform,
  motifDashedCurves,
  motifMonolineLoops,
  motifInfinityCurves,
  motifSpiralArcs,
  motifCircuitLines,
];


