import { FILLABLE, arcPath, circle, line, n, path, rect, svg, times } from './motif-definition.js';
import type { SpBuiltInMotifDefinition } from './motif-definition.js';

/** An L bracket anchored in one corner. */
const bracket = (x: number, y: number, arm: number, dx: number, dy: number, extra = '') =>
  path(`M${n(x + dx * arm)} ${n(y)}H${n(x)}V${n(y + dy * arm)}`, extra);

// ── Motifs ──────────────────────────────────────────────────────────────────

/** Quarter arcs struck from each corner at different radii. */
export const motifCornerArcs: SpBuiltInMotifDefinition = {
  name: 'corner-arcs',
  appearance: 'outlined',
  svg: svg(
    path(arcPath(0, 0, 38, 0, 90)) +
      path(arcPath(0, 0, 56, 0, 90), ' opacity=".5"') +
      path(arcPath(100, 0, 28, 90, 180)) +
      path(arcPath(100, 100, 54, 180, 270)) +
      path(arcPath(100, 100, 34, 180, 270), ' opacity=".5"') +
      path(arcPath(0, 100, 42, 270, 360)),
  ),
};

/** Thin Ls in all four corners, sketching a frame that is never closed. */
export const motifFramedCorners: SpBuiltInMotifDefinition = {
  name: 'framed-corners',
  appearance: 'outlined',
  svg: svg(
    bracket(8, 8, 26, 1, 1) +
      bracket(92, 8, 26, -1, 1) +
      bracket(8, 92, 26, 1, -1) +
      bracket(92, 92, 26, -1, -1) +
      bracket(20, 20, 14, 1, 1, ' opacity=".45"') +
      bracket(80, 80, 14, -1, -1, ' opacity=".45"'),
  ),
};

/** Two heavy viewfinder brackets on opposite corners. */
export const motifCornerBrackets: SpBuiltInMotifDefinition = {
  name: 'corner-brackets',
  appearance: 'outlined',
  svg: svg(
    path('M6 40V6H40') +
      path('M6 52V6', ' opacity=".4"') +
      path('M94 60V94H60') +
      path('M94 48V94', ' opacity=".4"') +
      line(46, 6, 58, 6, ' opacity=".4"') +
      line(42, 94, 54, 94, ' opacity=".4"'),
  ),
};

/** Rectangles with their sides deliberately interrupted. */
export const motifBrokenRectangles: SpBuiltInMotifDefinition = {
  name: 'broken-rectangles',
  appearance: 'outlined',
  svg: svg(
    path('M10 10H44M58 10H90V38M90 52V90H62M46 90H10V56M10 42V10') +
      path('M24 26H62V64H24Z', ' opacity=".45" stroke-dasharray="14 9"') +
      path('M36 40H76V78', ' opacity=".3"'),
  ),
};

/** Nested squares, each missing a different side. */
export const motifOpenFrameSquares: SpBuiltInMotifDefinition = {
  name: 'open-frame-squares',
  appearance: 'outlined',
  svg: svg(
    path('M4 4H96V96H36') +
      path('M22 22V78H78V38', ' opacity=".7"') +
      path('M38 38H62V62', ' opacity=".5"') +
      circle(50, 50, 4, FILLABLE),
  ),
};

/** The same frame printed three times, each a step out of register. */
export const motifOffsetFrames: SpBuiltInMotifDefinition = {
  name: 'offset-frames',
  appearance: 'outlined',
  svg: svg(
    times(3, (i) => rect(10 + i * 12, 10 + i * 12, 62, 62, 0, ` opacity="${n(0.95 - i * 0.28)}"`)),
  ),
};

/** Two rounded frames with a generous gap, cropped by the panel. */
export const motifRoundedFrames: SpBuiltInMotifDefinition = {
  name: 'rounded-frames',
  appearance: 'outlined',
  svg: svg(
    rect(-14, 6, 96, 88, 22, '') +
      rect(18, 22, 96, 56, 22, ' opacity=".55"') +
      rect(4, 40, 54, 74, 18, ' opacity=".32"'),
  ),
};

/** A sighting reticle: ring, ticks, and a centered cross. */
export const motifCrosshair: SpBuiltInMotifDefinition = {
  name: 'crosshair',
  appearance: 'outlined',
  svg: svg(
    circle(50, 50, 34, '') +
      circle(50, 50, 18, ' opacity=".55"') +
      line(50, 0, 50, 30) +
      line(50, 70, 50, 100) +
      line(0, 50, 30, 50) +
      line(70, 50, 100, 50) +
      line(50, 40, 50, 60, ' opacity=".7"') +
      line(40, 50, 60, 50, ' opacity=".7"') +
      times(4, (i) => {
        const deg = 45 + i * 90;
        const a = (deg * Math.PI) / 180;
        return line(
          50 + 30 * Math.cos(a),
          50 + 30 * Math.sin(a),
          50 + 38 * Math.cos(a),
          50 + 38 * Math.sin(a),
          ' opacity=".5"',
        );
      }),
  ),
};

/** Every frame, corner, and sight motif, in showcase order. */
export const FRAME_MOTIFS: readonly SpBuiltInMotifDefinition[] = [
  motifCornerArcs,
  motifFramedCorners,
  motifCornerBrackets,
  motifBrokenRectangles,
  motifOpenFrameSquares,
  motifOffsetFrames,
  motifRoundedFrames,
  motifCrosshair,
];


